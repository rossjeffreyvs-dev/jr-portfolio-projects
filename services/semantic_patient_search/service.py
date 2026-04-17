from asgiref.wsgi import WsgiToAsgi
from backend.local_server import app as flask_app

# Expose the Flask app as ASGI so the portfolio gateway can dispatch to it.
app = WsgiToAsgi(flask_app)
