"""
Security utilities for Arkitecto AI Backend
Phase 6: Security & Performance Audit
"""
import re
import time
from collections import defaultdict
from typing import Optional
from fastapi import Request, HTTPException
from starlette.middleware.base import BaseHTTPMiddleware
from starlette.responses import Response

# =====================================================
# RATE LIMITING
# =====================================================

class RateLimiter:
    """
    Simple in-memory rate limiter.
    For production, consider using Redis for distributed rate limiting.
    """
    def __init__(self, requests_per_minute: int = 60, requests_per_hour: int = 500):
        self.requests_per_minute = requests_per_minute
        self.requests_per_hour = requests_per_hour
        self.minute_requests = defaultdict(list)
        self.hour_requests = defaultdict(list)

    def _cleanup_old_requests(self, client_id: str):
        """Remove requests older than the time window."""
        current_time = time.time()

        # Cleanup minute requests (older than 60 seconds)
        self.minute_requests[client_id] = [
            t for t in self.minute_requests[client_id]
            if current_time - t < 60
        ]

        # Cleanup hour requests (older than 3600 seconds)
        self.hour_requests[client_id] = [
            t for t in self.hour_requests[client_id]
            if current_time - t < 3600
        ]

    def is_allowed(self, client_id: str) -> tuple[bool, Optional[str]]:
        """
        Check if the client is allowed to make a request.
        Returns (allowed, error_message)
        """
        self._cleanup_old_requests(client_id)
        current_time = time.time()

        # Check minute limit
        if len(self.minute_requests[client_id]) >= self.requests_per_minute:
            return False, "Rate limit exceeded. Max 60 requests per minute."

        # Check hour limit
        if len(self.hour_requests[client_id]) >= self.requests_per_hour:
            return False, "Rate limit exceeded. Max 500 requests per hour."

        # Record this request
        self.minute_requests[client_id].append(current_time)
        self.hour_requests[client_id].append(current_time)

        return True, None


# Global rate limiter instance
rate_limiter = RateLimiter()


class RateLimitMiddleware(BaseHTTPMiddleware):
    """
    Middleware to enforce rate limiting on all requests.
    """
    # Paths exempt from rate limiting
    EXEMPT_PATHS = ["/", "/docs", "/openapi.json"]

    async def dispatch(self, request: Request, call_next) -> Response:
        # Skip rate limiting for exempt paths
        if request.url.path in self.EXEMPT_PATHS:
            return await call_next(request)

        # Get client identifier (IP or user ID if authenticated)
        client_id = self._get_client_id(request)

        # Check rate limit
        allowed, error_message = rate_limiter.is_allowed(client_id)

        if not allowed:
            return Response(
                content=f'{{"detail": "{error_message}"}}',
                status_code=429,
                media_type="application/json"
            )

        return await call_next(request)

    def _get_client_id(self, request: Request) -> str:
        """Get a unique identifier for the client."""
        # Try to get user ID from state (if authenticated)
        if hasattr(request.state, 'user') and request.state.user:
            return f"user:{request.state.user.get('uid', 'unknown')}"

        # Fall back to IP address
        forwarded = request.headers.get("X-Forwarded-For")
        if forwarded:
            return f"ip:{forwarded.split(',')[0].strip()}"

        return f"ip:{request.client.host if request.client else 'unknown'}"


# =====================================================
# INPUT SANITIZATION
# =====================================================

class InputSanitizer:
    """
    Sanitize and validate user inputs to prevent injection attacks.
    """

    # Dangerous patterns to remove
    DANGEROUS_PATTERNS = [
        r'<script[^>]*>.*?</script>',  # Script tags
        r'javascript:',                  # JavaScript protocol
        r'on\w+\s*=',                   # Event handlers
        r'<iframe[^>]*>',               # Iframes
        r'<object[^>]*>',               # Object tags
        r'<embed[^>]*>',                # Embed tags
    ]

    # SQL injection patterns
    SQL_PATTERNS = [
        r"('\s*(OR|AND)\s*')",
        r'(;\s*(DROP|DELETE|UPDATE|INSERT))',
        r'(UNION\s+SELECT)',
        r'(--)(\s|$)',
    ]

    @classmethod
    def sanitize_string(cls, value: str, max_length: int = 1000) -> str:
        """
        Sanitize a string input.
        - Removes dangerous HTML/JS patterns
        - Truncates to max length
        - Strips leading/trailing whitespace
        """
        if not value:
            return ""

        # Truncate
        value = value[:max_length]

        # Remove dangerous patterns (case insensitive)
        for pattern in cls.DANGEROUS_PATTERNS:
            value = re.sub(pattern, '', value, flags=re.IGNORECASE | re.DOTALL)

        # Strip whitespace
        value = value.strip()

        return value

    @classmethod
    def sanitize_instruction(cls, instruction: str) -> str:
        """
        Sanitize budget instruction input specifically.
        More permissive than general sanitization since we need
        construction terminology.
        """
        if not instruction:
            raise ValueError("Instruction cannot be empty")

        # Max length for instructions
        instruction = instruction[:2000]

        # Remove only the most dangerous patterns
        for pattern in cls.DANGEROUS_PATTERNS:
            instruction = re.sub(pattern, '', instruction, flags=re.IGNORECASE | re.DOTALL)

        # Check for SQL injection attempts
        for pattern in cls.SQL_PATTERNS:
            if re.search(pattern, instruction, re.IGNORECASE):
                raise ValueError("Invalid characters in instruction")

        return instruction.strip()

    @classmethod
    def validate_email(cls, email: str) -> bool:
        """Validate email format."""
        pattern = r'^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$'
        return bool(re.match(pattern, email))

    @classmethod
    def sanitize_filename(cls, filename: str) -> str:
        """Sanitize a filename to prevent path traversal."""
        # Remove path separators and dangerous characters
        filename = re.sub(r'[/\\:*?"<>|]', '', filename)
        # Remove leading dots (hidden files, path traversal)
        filename = filename.lstrip('.')
        return filename[:255]  # Max filename length


# =====================================================
# SECURITY HEADERS MIDDLEWARE
# =====================================================

class SecurityHeadersMiddleware(BaseHTTPMiddleware):
    """
    Add security headers to all responses.
    """

    async def dispatch(self, request: Request, call_next) -> Response:
        response = await call_next(request)

        # Content Security Policy (relaxed for API)
        response.headers["X-Content-Type-Options"] = "nosniff"
        response.headers["X-Frame-Options"] = "DENY"
        response.headers["X-XSS-Protection"] = "1; mode=block"
        response.headers["Referrer-Policy"] = "strict-origin-when-cross-origin"

        # Permissions Policy
        response.headers["Permissions-Policy"] = (
            "accelerometer=(), camera=(), geolocation=(), "
            "gyroscope=(), magnetometer=(), microphone=(), "
            "payment=(), usb=()"
        )

        return response


# =====================================================
# REQUEST LOGGING
# =====================================================

class RequestLoggingMiddleware(BaseHTTPMiddleware):
    """
    Log all requests for monitoring and debugging.
    """

    async def dispatch(self, request: Request, call_next) -> Response:
        start_time = time.time()

        # Process request
        response = await call_next(request)

        # Calculate processing time
        process_time = (time.time() - start_time) * 1000  # in ms

        # Log request (only important endpoints)
        if request.url.path not in ["/", "/docs", "/openapi.json"]:
            client_ip = request.headers.get("X-Forwarded-For", request.client.host if request.client else "unknown")
            print(f"📊 {request.method} {request.url.path} | {response.status_code} | {process_time:.1f}ms | {client_ip}")

        # Add timing header
        response.headers["X-Process-Time"] = f"{process_time:.1f}ms"

        return response
