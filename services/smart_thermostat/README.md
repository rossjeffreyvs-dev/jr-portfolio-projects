# Smart Thermostat Rule-Based Agent

## Setup

```bash
python -m venv .venv
source .venv/bin/activate
pip install -e ".[dev]"
```

## Run (local temp)

```bash
python -m thermostat_agent.main --temp 15
python -m thermostat_agent.main --temp 28
python -m thermostat_agent.main --temp 22
```

## Run (external weather API)

```bash
python -m thermostat_agent.main --use-weather --lat 40.7128 --lon -74.0060
```

## Run tests

```bash
pytest
```
