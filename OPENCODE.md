# OPENCODE.md

This file provides guidance to AI agents when working with this codebase.

## Project Overview

An "Agentic Skeleton Project" designed to demonstrate AI agent capabilities, featuring a Python client-server demo application.

## Commands

- `python3 .opencode/skill/start-stop-app/tools/start.py` - Start demo server
- `python3 apps/client/main.py` - Run demo client
- `python3 -m pytest` - Run tests (from apps/{app_name} dir)

### Bootstrap Feedback Loop

**Command:** `.opencode/command/bootstrap_feedback_loop.md`

One-time setup that makes the project ready for **autonomous, self-correcting development**. The agent will:

1. **Reconnaissance** — Discover runtimes, frameworks, services, existing logs/tests/health checks.
2. **Gap analysis** — Identify missing log capture, process output capture, and browser console capture.
3. **Implementation** — Add only what’s needed: `logs/` layout, tee’d process output, optional Vite/Playwright console capture, and a dev script that runs everything with full logging.
4. **Manifest** — Write `.opencode/PROJECT_LOOP.md` with services, log paths, start commands, and log priority for agents.
5. **Validate** — Start the project with the new setup and confirm logs are written.

After running it, agents can rely on `.opencode/PROJECT_LOOP.md` and the feedback loop protocol in AGENTS.md for ongoing development.

## Code Style

- Use Python 3.12+ features
- Follow PEP 8 conventions
- Type hints required for all functions
- Use Pydantic for data validation where applicable
