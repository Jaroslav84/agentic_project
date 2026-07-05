# v1.3.1 (2026-07-05)

- `CLAUDE.md` got broken up into `CALUDE.global.md` and a project specific `CLAUDE.md` template 
- `YALO.md` (my YOLO.md version) skill added - very handy
- `HANDOFF.md` skill added

# v1.3.0 (2026-04-22)

We kinda leaned towards using Claude Code cuxx it's so good. Sorry, no more `/.agents` or `AGENTS.md`

## New
- **Spec-Driven Requirements Gathering**: idea → research → mission → .... -> plan
- **Mockup-First Web UI**: clickable HTML artifacts in `dashboard/` validate the product *before* code — so specs, design, and build all converge on something you can actually see and click.

## New: Better Claude support

- added generic `CLAUDE.md` (instead of `AGENTS.md`) with my generic 130 line long prefferences. Can be used and extended in any project.
- added `BOOTSTRAP.md` which gets called by `CLAUDE.md` once -> which calls `.claude/commands/PRIME.md` to *prime* the project
- renamed `scripts/bootstrap_agents.py` → `scripts/bootstrap.py` and updated it
- added `.claude/settings.local.json` crazy big Claude (Allow/Deny) list for Claude Code. Extra layer of security.
- `.claude/skills` -> added skills from the official Anthropic repo

## Toolz
- added bunch of my custom *linters* I recently maded into `./scripts/linters/`

## Refactoring
- renamed `apps` to `src`
- renamed `.agents` to `.claude` because Anthropic is a b**ch but a good one
- CAPTIALIZED md files

--

# v1.2.0 (2026-03-03)

- renamed `.opencode` to `.agents` standard protocol (dotagentsprotocol.com) to support cursor/claude/opencode at the same time
- Plural usage for `agents`, `commands`, `skills` is the right way :) 
- added `.claude/commands/PRIME_FEEDBACK.md`: which sets up your project for "Autonomous Feedback Loop Setup"
