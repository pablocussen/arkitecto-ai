from typing import Callable
from fastapi import Request
from starlette.middleware.base import BaseHTTPMiddleware
from starlette.responses import Response, JSONResponse
from firebase_admin import auth

# List of paths that do not require authentication
PUBLIC_PATHS = [
    "/docs", "/openapi.json", "/",
    "/analyze_budget", "/generate_sketch",
    "/suggestions", "/categories",
    "/export/pdf", "/export/excel", "/export/text"
]

# Paths that start with these prefixes are public
PUBLIC_PATH_PREFIXES = ["/search/"]

class FirebaseAuthMiddleware(BaseHTTPMiddleware):
    async def dispatch(self, request: Request, call_next: Callable) -> Response:
        # Allow OPTIONS requests (CORS preflight)
        if request.method == "OPTIONS":
            return await call_next(request)

        # Check if the path is public
        if request.url.path in PUBLIC_PATHS:
            return await call_next(request)

        # Check if the path starts with a public prefix
        for prefix in PUBLIC_PATH_PREFIXES:
            if request.url.path.startswith(prefix):
                return await call_next(request)

        auth_header = request.headers.get("Authorization")
        if not auth_header:
            return JSONResponse(status_code=401, content={"detail": "Not authenticated"})

        try:
            # Expecting "Bearer <token>"
            id_token = auth_header.split(" ")[1]
            decoded_token = auth.verify_id_token(id_token)
            request.state.user = decoded_token
        except Exception as e:
            return JSONResponse(status_code=401, content={"detail": f"Invalid authentication credentials: {str(e)}"})

        response = await call_next(request)
        return response
