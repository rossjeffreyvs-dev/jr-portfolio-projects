import logging

import httpx
from fastapi import FastAPI
from fastapi.responses import JSONResponse
from gateway.host_router import get_app_for_request
from starlette.types import Receive, Scope, Send


logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)


REQUEST_HEADERS_TO_DROP = {
    b"host",
    b"content-length",
    b"connection",
    b"accept-encoding",
}

RESPONSE_HEADERS_TO_DROP = {
    "transfer-encoding",
    "content-length",
    "content-encoding",
}


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

        logger.info("Incoming request host=%s path=%s", host, path)

        target = get_app_for_request(host, path)

        if callable(target):
            await target(scope, receive, send)
            return

        if isinstance(target, dict):
            await self.proxy_request(
                scope,
                receive,
                send,
                target_url=target["url"],
                rewritten_path=target["path"],
            )
            return

        if isinstance(target, str):
            await self.proxy_request(
                scope,
                receive,
                send,
                target_url=target,
                rewritten_path=path,
            )
            return

        await self.default_app(scope, receive, send)

    async def proxy_request(
        self,
        scope: Scope,
        receive: Receive,
        send: Send,
        target_url: str,
        rewritten_path: str,
    ):
        timeout = httpx.Timeout(120.0, connect=10.0)

        body = await self.read_body(receive)
        url = self.build_url(target_url, rewritten_path, scope)
        forward_headers = self.build_forward_headers(scope)

        logger.info("Proxying %s %s", scope["method"], url)

        try:
            async with httpx.AsyncClient(timeout=timeout) as client:
                response = await client.request(
                    method=scope["method"],
                    url=url,
                    headers=forward_headers,
                    content=body,
                )

            await self.send_proxy_response(send, response)

        except Exception as exc:
            logger.exception("Proxy request failed")
            await self.send_bad_gateway(send, exc)

    async def read_body(self, receive: Receive) -> bytes:
        body = b""
        more_body = True

        while more_body:
            message = await receive()
            body += message.get("body", b"")
            more_body = message.get("more_body", False)

        return body

    def build_url(self, target_url: str, rewritten_path: str, scope: Scope) -> str:
        url = f"{target_url}{rewritten_path}"

        if scope.get("query_string"):
            url += f"?{scope['query_string'].decode()}"

        return url

    def build_forward_headers(self, scope: Scope) -> dict[str, str]:
        return {
            key.decode(): value.decode()
            for key, value in scope["headers"]
            if key.lower() not in REQUEST_HEADERS_TO_DROP
        }

    async def send_proxy_response(self, send: Send, response: httpx.Response):
        response_headers = [
            (key.encode(), value.encode())
            for key, value in response.headers.items()
            if key.lower() not in RESPONSE_HEADERS_TO_DROP
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

    async def send_bad_gateway(self, send: Send, exc: Exception):
        error_body = JSONResponse(
            status_code=502,
            content={"error": "Bad gateway", "detail": str(exc)},
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