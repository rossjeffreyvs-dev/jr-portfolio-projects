from fastapi import FastAPI
from gateway.host_router import get_app_for_host
from starlette.types import Scope, Receive, Send
import httpx

class HostDispatcher:
    def __init__(self, default_app):
        self.default_app = default_app

    async def __call__(self, scope: Scope, receive: Receive, send: Send):
        if scope["type"] != "http":
            await self.default_app(scope, receive, send)
            return

        headers = dict(scope["headers"])
        host = headers.get(b"host", b"").decode()

        target = get_app_for_host(host)

        # 🔥 CASE 1: ASGI app (existing behavior)
        if callable(target):
            await target(scope, receive, send)
            return

        # 🔥 CASE 2: HTTP proxy (Flask)
        if isinstance(target, str):
            await self.proxy_request(scope, receive, send, target)
            return

        await self.default_app(scope, receive, send)

    async def proxy_request(self, scope, receive, send, target_url):
        timeout = httpx.Timeout(120.0, connect=10.0)

        async with httpx.AsyncClient(timeout=timeout) as client:
            body = b""
            more_body = True

            while more_body:
                message = await receive()
                body += message.get("body", b"")
                more_body = message.get("more_body", False)

            url = f"{target_url}{scope['path']}"

            response = await client.request(
                method=scope["method"],
                url=url,
                headers={k.decode(): v.decode() for k, v in scope["headers"]},
                content=body,
            )

            await send({
                "type": "http.response.start",
                "status": response.status_code,
                "headers": [
                    (k.encode(), v.encode())
                    for k, v in response.headers.items()
                ],
            })

            await send({
                "type": "http.response.body",
                "body": response.content,
            })


# fallback app
app = FastAPI()

@app.get("/")
def root():
    return {"message": "Unknown host"}

# wrap it
app = HostDispatcher(app)