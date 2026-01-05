# Agentic Skeleton Project

This is a skeleton project designed for Agentic Development, structured to support AI agents with defined skills, commands, and documentation.

Special thanks to **@IndyDevDan** and his Youtube video that inspired this project: [Youtube video](https://www.youtube.com/watch?v=fop_yxV-mPo)

## How to use
Delete files for the demo app in 'apps/' directory and plance your project files there. Then customize the MD files to support your project.

## Overview
1. **Agents / Commands**: `.opencode/` directory
2. **Project Specs**: `specs/`
3. **App Reviews**: `app_reviews/`
4. **Skills**: `.opencode/skills/`

## Agents & Commands
- **Prime**: `prime [query]`
- **Plan**: `plan [id] [prompt]`
- **Scout**: `scout [query]`
- **Review**: `review [feature]`
- **Test Writer**: `test_writer`
- **Documentation Fetcher**: `fetch_docs [urls]`

## Project Structure

```text
.
├── .opencode/                # Agent definitions, commands, and skills
│   ├── agents/             # Agent definitions
│   │   ├── fetch_docs.md   # Documentation fetcher agent
│   │   ├── review_agent.md # Code review agent
│   │   ├── scout.md        # Codebase scout agent
│   │   └── test_writer.md  # Test writing agent
│   ├── commands/           # Command definitions
│   │   ├── build.md        # Build/implementation command
│   │   ├── document.md     # Documentation generator
│   │   ├── plan.md         # Planning command
│   │   ├── prime.md        # Codebase priming
│   │   ├── pull_ticket.md  # Jira ticket puller
│   │   ├── reproduce.md    # Bug reproduction
│   │   ├── review.md       # Code review command
│   │   ├── scout.md        # Scout command
│   │   ├── start_apps.md   # App startup command
│   │   ├── test_be.md      # Backend testing
│   │   └── test_fe.md      # Frontend testing
│   └── skills/             # Executable skills
│       ├── db-migrate/     # Database migration skill
│       └── start-stop-app/ # App lifecycle management
├── ai_docs/                # Project documentation for AI context
├── apps/                   # Application source code
│   ├── client/             # Python client application
│   └── server/             # FastAPI/Python server application
├── specs/                  # Technical specifications
└── CLAUDE.md               # Main entry point/guide for Claude
```

## Reference Links
- [Youtube video](https://www.youtube.com/watch?v=fop_yxV-mPo)
- [Agentic Engineer](https://agenticengineer.com/)
- [Model Context Protocol (MCP)](https://modelcontextprotocol.io/)
