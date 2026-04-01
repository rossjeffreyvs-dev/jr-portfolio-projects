from typing import Callable, Awaitable, Dict, Any
from gateway.host_router import get_app_for_host

ASGIApp = Callable[[Dict[str, Any], Callable, Callable], Awaitable[None]]

async def app(scope, receive, send):
    # Only handle HTTP
    if scope["type"] != "http":
        await send({"type": "http.response.start", "status": 404, "headers": []})
        await send({"type": "http.response.body", "body": b"Not Found"})
        return

    headers = dict(scope.get("headers") or [])
    host = headers.get(b"host", b"").decode("utf-8").split(":")[0].lower()

    target: ASGIApp | None = get_app_for_host(host)

    if target is None:
        body = (
            b"JR Portfolio Projects\n"
            b"Unknown host. Use a project subdomain.\n"
        )
        await send(
            {
                "type": "http.response.start",
                "status": 200,
                "headers": [(b"content-type", b"text/plain; charset=utf-8")],
            }
        )
        await send({"type": "http.response.body", "body": body})
        return

    # Delegate to the matched service ASGI app
    await target(scope, receive, send)
