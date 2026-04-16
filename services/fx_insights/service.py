from asgiref.wsgi import WsgiToAsgi

from services.fx_insights.backend.local_server import app as flask_fx_app

# Expose the Flask app as ASGI so the FastAPI/ASGI gateway can dispatch to it
app = WsgiToAsgi(flask_fx_app)