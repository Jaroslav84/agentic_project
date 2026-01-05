# OPENCODE.md

This file provides guidance to AI agents when working with this codebase.

## Project Overview

An "Agentic Skeleton Project" designed to demonstrate AI agent capabilities, featuring a Python client-server demo application.

## Commands

- `python3 .opencode/skill/start-stop-app/tools/start.py` - Start demo server
- `python3 apps/client/main.py` - Run demo client
- `python3 -m pytest` - Run tests (from apps/{app_name} dir)

## Code Style

- Use Python 3.12+ features
- Follow PEP 8 conventions
- Type hints required for all functions
- Use Pydantic for data validation where applicable
