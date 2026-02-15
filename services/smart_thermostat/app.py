from flask import Flask, render_template, request, jsonify
import yaml

app = Flask(__name__)

STATE = {
    "active": False,
    "temperature": 22.0,
    "agent_state": "off"
}

with open("config/rules.yaml") as f:
    RULES = yaml.safe_load(f)["rules"]

def decide(temp: float):
    if temp < 18.0:
        return "heater_on", "heating"
    if temp > 26.0:
        return "cooler_on", "cooling"
    return "all_off", "off"

@app.route("/")
def index():
    return render_template("index.html")

@app.route("/api/activate", methods=["POST"])
def activate():
    STATE["active"] = True
    return jsonify({"status": "activated"})

@app.route("/api/step", methods=["POST"])
def step():
    temp = float(request.json.get("temperature"))
    action, agent_state = decide(temp)
    STATE.update({
        "temperature": temp,
        "agent_state": agent_state
    })
    return jsonify({
        "temperature": temp,
        "action": action,
        "agent_state": agent_state
    })

if __name__ == "__main__":
    app.run(debug=True)
