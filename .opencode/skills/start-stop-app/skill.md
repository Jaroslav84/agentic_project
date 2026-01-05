---
name: Start/Stop Demo App
description: Start or stop the demo server (FastAPI) on port 2026. Use when you need to run or kill the development server.
model: zai-coding-plan/glm-4.5-air
---

# Start/Stop Demo App

Manage the demo FastAPI development server running on port 2026.

## Tools

- `tools/start.py` - Start the demo server (`apps/server/main.py`)
- `tools/stop.py` - Stop the server running on port 2026

## Usage

```bash
# Start the app
python3 .opencode/skills/start-stop-app/tools/start.py

# Stop the app
python3 .opencode/skills/start-stop-app/tools/stop.py
```
