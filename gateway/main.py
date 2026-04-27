from fastapi import FastAPI
from fastapi.responses import JSONResponse
from gateway.host_router import get_app_for_request
from starlette.types import Scope, Receive, Send
import httpx
import logging


logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)


class HostDispatcher:
    def __init__(self, default_app):
        self.default_app = default_app

    async def __call__(self, scope: Scope, receive: Receive, send: Send):
        if scope["type"] != "http":
            await self.default_app(scope, receive, send)
            return

        path = scope.get("path", "")

        if path == "/health":
            response = JSONResponse({"status": "ok"})
            await response(scope, receive, send)
            return

        headers = dict(scope["headers"])
        host = headers.get(b"host", b"").decode().split(":")[0]

        logger.info(f"Incoming request host={host} path={path}")

        target = get_app_for_request(host, scope.get("path", ""))

        if callable(target):
            await target(scope, receive, send)
            return

        if isinstance(target, str):
            await self.proxy_request(scope, receive, send, target)
            return

        await self.default_app(scope, receive, send)

    async def proxy_request(
        self,
        scope: Scope,
        receive: Receive,
        send: Send,
        target_url: str,
    ):
        timeout = httpx.Timeout(120.0, connect=10.0)

        body = b""
        more_body = True
        while more_body:
            message = await receive()
            body += message.get("body", b"")
            more_body = message.get("more_body", False)

        path = scope["path"]
        url = f"{target_url}{path}"

        if scope.get("query_string"):
            url += f"?{scope['query_string'].decode()}"

        forward_headers = {
            k.decode(): v.decode()
            for k, v in scope["headers"]
            if k.lower() not in [b"host", b"content-length", b"connection"]
        }

        try:
            async with httpx.AsyncClient(timeout=timeout) as client:
                response = await client.request(
                    method=scope["method"],
                    url=url,
                    headers=forward_headers,
                    content=body,
                )

            response_headers = [
                (k.encode(), v.encode())
                for k, v in response.headers.items()
                if k.lower() not in [
                    "transfer-encoding",
                    "content-length",
                ]
            ]

            await send(
                {
                    "type": "http.response.start",
                    "status": response.status_code,
                    "headers": response_headers,
                }
            )

            await send(
                {
                    "type": "http.response.body",
                    "body": response.content,
                }
            )

        except Exception as e:
            logger.exception("Proxy request failed")
            error_body = JSONResponse(
                status_code=502,
                content={"error": "Bad gateway", "detail": str(e)},
            ).body

            await send(
                {
                    "type": "http.response.start",
                    "status": 502,
                    "headers": [(b"content-type", b"application/json")],
                }
            )

            await send(
                {
                    "type": "http.response.body",
                    "body": error_body,
                }
            )


fallback_app = FastAPI()


@fallback_app.get("/")
def root():
    return {"message": "Unknown host"}


@fallback_app.api_route(
    "/{path:path}",
    methods=["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS", "HEAD"],
)
async def unknown_host(path: str):
    return JSONResponse(
        status_code=404,
        content={"message": "Unknown host", "path": f"/{path}"},
    )


app = HostDispatcher(fallback_app)