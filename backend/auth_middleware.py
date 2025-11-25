from fastapi import Request, HTTPException
from starlette.middleware.base import BaseHTTPMiddleware, RequestResponseFunction
from starlette.responses import Response
from firebase_admin import auth

# List of paths that do not require authentication
PUBLIC_PATHS = ["/docs", "/openapi.json", "/", "/analyze_budget", "/generate_sketch"]

class FirebaseAuthMiddleware(BaseHTTPMiddleware):
    async def dispatch(self, request: Request, call_next: RequestResponseFunction) -> Response:
        # Check if the path is public
        if request.url.path in PUBLIC_PATHS:
            return await call_next(request)

        auth_header = request.headers.get("Authorization")
        if not auth_header:
            return HTTPException(status_code=401, detail="Not authenticated")

        try:
            # Expecting "Bearer <token>"
            id_token = auth_header.split(" ")[1]
            decoded_token = auth.verify_id_token(id_token)
            request.state.user = decoded_token
        except Exception as e:
            return HTTPException(status_code=401, detail=f"Invalid authentication credentials: {e}")

        response = await call_next(request)
        return response
