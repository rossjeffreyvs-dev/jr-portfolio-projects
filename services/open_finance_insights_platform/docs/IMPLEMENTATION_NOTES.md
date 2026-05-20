# Implementation Notes

## Suggested repo path

```text
services/open_finance_insights_platform/
```

## Suggested production path

```text
/open-finance-insights-platform
```

## Suggested local ports

- API: `8036`
- Web: `3006`

## Gateway / deployment updates to make manually

Add a proxy route in the host dispatcher similar to the Startup Finance project:

```python
"/open-finance-insights-platform": "http://127.0.0.1:3006"
```

Add API prefixes if the gateway routes API requests directly:

```python
OPEN_FINANCE_API_PREFIXES = (
    "/open-finance",
)
```

Add startup commands to `docker-entrypoint.sh`:

```bash
echo "Starting Open Finance API on port 8036..."
python -m uvicorn services.open_finance_insights_platform.apps.api.app.main:app --host 0.0.0.0 --port 8036 &

echo "Starting Open Finance web on port 3006..."
cd /app/services/open_finance_insights_platform/apps/web && PORT=3006 node .next/standalone/server.js &
```

In Dockerfile, add a build stage mirroring `agentic_startup_finance_ops/apps/web`, then copy the standalone output into the runtime image.

## Refinement backlog

1. Add a CDM diagram panel to the Project Description tab.
2. Add before/after source-to-CDM field mapping.
3. Add Plaid Sandbox integration as Phase 2.
4. Add webhook-style refresh to simulate transaction updates.
5. Add developer docs showing canonical response contracts.
6. Add affordability / cash-flow health score with explicit inputs.
