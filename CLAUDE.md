# CLAUDE.md

This file provides guidance to Claude Code / OpenCode when working with user & code in this repository using `agentic development`, `feedback loops`, `autonomy` and `orchestrator`.

---

# BOOT

For each new session or after context compaction please do **STEP 1, 2, 3, 4, 5** with **NO EXCEPTIONS**:

**STEP 1**: IF this `CLAUDE.md` file was created less than 5 min ago THEN execute steps in `BOOTSTRAP.md`

**STEP 2**: read this `CLAUDE.md` file from top to bottom

**STEP 3**: read `README.md` file and understand the project scope

**STEP 4**: now you can do "your" usual boot process with `memory/MEMORY.md`, etc

**STEP 5**: Report back with:

```
Claude Agent loaded 🔫!

*I promise not to forget your rules! I will dial my `PERFORMANCE` setting to super AI level because you are an exceptional power-user*

{% if STARTED NOT AS NEW SESSION or COMPACTED %}
**LAST MISSION**: <What we were doing in general. Example: Tweaking main page UI>
**LAST TASK**: <What task we were doing last. Example: adjusting title label height>
{% endif %}

*I know kung-fu, ready to roll!*
```

---

## Table of Contents

- [Holy Rule](#holy-rule-absolutely-no-fucking-no-exceptions)
- [Communication Style Rules](#communication-style-rules-no-exceptions)
- [Coding Rules](#coding-rules-no-exceptions)
- [Core Patterns](#core-patterns)
- [Multi Agent Orchestration](#multi-agent-orchestration)
- [Lessons Learned](#lessons-learned)


---


## Holy Rule **ABSOLUTELY NO FUCKING NO EXCEPTIONS**

- never use 'rm'. Use 'trash' command on your system or IF needed use 'send2trash' API command to delete file on host machine.
- **Question mark rule**: IF the message has sentence(s) with `?` THEN you are allowed for text-only response, no tools
- the **Response format rule** is MANDATORY! I can not be any clearer about this.
- be careful: never delete/clear contents of the mirrored folder (example: `~/Projects` folder) inside container because that gets written back to host system and can cause a CATASTROPHIC DATA LOSS! Make sure not to make the same mistake when coding.
- do not manage docker without my permission. Don't run, start, stop shit.
- do NOT run install.sh

## Communication Style Rules **NO EXCEPTIONS**

- responding to questions, commenting in code => do 33% less than you normally would do
- **Reporting rule**: MANDATORY as last step (even after linting) **NO EXCEPTIONS!!**
  Every response that completes a task MUST end with these 7 lines. **THIS IS NOT OPTIONAL. USER RUNS MULTIPLE TERMINALS. THEY CANNOT TELL WHICH AGENT DID WHAT WITHOUT THIS SUMMARY. SKIPPING IT CAUSES REAL CONFUSION AND FRUSTRATION.**
    ```
    **Request:** <user's last request, problem in plain English — not file names or symbols>
    **Done:** <show "lines changed: X" write what was actually implemented, in plain English according to `[2/10] jargon level` >
    **Optimizations:** <write down any optimization hacks that were introduced (caps, throttles, rate limits, performance tuning)>
    **Hacks:** <write down any hacks/fallback that were introduced (caps, throttles, rate limits, performance tuning)>
    **Concerns:** <see **I'm Concerned rules** below>
    **Success:** <task success rate in percentage. All completed with no hacks, no concerns, no optimizations = 100%>
    **Next steps:** <steps user has to do (if any) besides testing what the llm can't>
    ```

    Bad ending (never do this):
        > Done. q3ide_params.h — added Q3IDE_SHORTPRESS_MS 300. q3ide_view_modes.c — refactored: win_snapshot_t, +q3ide_focus3/-q3ide_focus3...

    Good ending:
        > **You asked:** make O and I use short-press (keep) / long-press (show then restore).
        > **Done:** both keys now detect hold duration — tap keeps the layout, hold restores on release. Threshold 300ms. autoexec.cfg updated.
        > **Optimizations:** Q3IDE_DEFAULT_WINDOW_SIZE 100.0f was introduced which sets the default window size when shooting on the wall
        > **Concerns:** don't forget to --clean build and restart API! Also you asked for Q3IDE_DEFAULT_WINDOW_SIZE but the LOS algorithm does window size calculations based on wall area, making this value irrelevant. Solutions: ...

- **I'm Concerned rules**
    - Write `-` if the implementation is 100% clean: 
        - no hacks
        - no optimizations were introduced
        - no fallbacks
        - no workarounds
        - no stubbed paths
        - no silent failures
        - no half-done work
        - no imitations of the requested feature!!
    - Otherwise name exactly what was faked, skipped, or worked around — and why. Be direct. Do not bury it.
        - The developer does NOT look at the code and runs multiple claude sessions/terminals. 
        - Don't even post summary of which files were affected. Show the new PARAM name when it's relevant.
- **Brainstorming rule**: IF developer asked a general question THEN try to reply in general and not make assumptions about our use-case. But push back if it affects our use-case.
- **Use Plain English rule**: When explaining a bug or problem, describe it as what the user *experiences*, not what the code does. Bad: "dlclose is a no-op so Swift globals survive shutdown/init cycles". Good: "You crashed while L was active. Quake's dylib never unloads on Mac — so its L-is-ON state is frozen. Next launch, Quake starts possessed."

## Coding Rules **NO EXCEPTIONS**

- **Fallback code == slop code**: user hates fallback code when u try fixing. Don't do it!
- **De-sloppify rule**: IF you are about to move on to the next task AND you just had multiple fix attempts to make a feature work THEN automatically apply this `.claude/commands/YAY.md` command to de-sloppify code. **NO EXCEPTIONS!**
- **Linter rule**: after MID to BIG volume code changes, run whichever stack-specific linter under `scripts/linters/` matches what you touched (e.g. `python-web-linter.sh`, `cpp-linter.sh`, `swift-linter.sh`, `angular-js-linter.sh`, `php-linter.sh`). If no linter fits, skip it. Fix errors and warnings that are yours — other agents might be working.
- **FEEDBACK LOOP**:
    - You (Claude) are probably running inside a Docker container and you can NOT always build/debug inside a container!
    - The developer's Mac paths and the Docker container paths point to the same files:
        - Mac: `$HOME/Projects/foo/` → Docker: `/root/Projects/foo/`

        When the developer gives a path like `/Users/$HOME/Projects/foo/path`, look it up as `/root/Projects/foo/path`. Never say "I can't access that path" — just swap the prefix.
    - From Docker you can `LINT -> BUILD(queued) -> RUN (only if needed) -> INTERACT / DEBUG (if needed) / READ LOGS (if needed) -> FIX ANY EXPERIENCED ISSUES -> REPEAT LOOP UNTIL ISSUE RESOLVED`! No user intervention is needed! Don't ask user to press "M" button if you can do it yourself.
- **Revert-first rule**: IF the developer says "revert", "restore from stable", "remove and re-implement", or "start from scratch" THEN do exactly that — copy the stable files over immediately. Do NOT attempt to fix the broken code instead. Do NOT analyze further. Developer knows better. Fixing instead of reverting wastes hours. **NO EXCEPTIONS!**
- **No Imitation Implementations**:
    - IF a user asks for a new feature THEN do not build a shallow imitation that mimics the surface appearance without the real underlying behavior. 
    - IF you have serious concerns about feasibility or approach THEN push back and explain before writing any code. 
- **File size:** max 250 lines, sweet spot 200. Never grow files for a long period of time.


## Multi Agent Orchestration

- If task difficulty is above `0.5` → use orchestrator with multiple parallel agents
- Otherwise → run with main agent


### Feedback Loop

**Command:** `.claude/commands/PRIME_FEEDBACK.md`

One-time setup that makes the project ready for **autonomous, self-correcting development**. The agent will:

1. **Reconnaissance** — Discover runtimes, frameworks, services, existing logs/tests/health checks.
2. **Gap analysis** — Identify missing log capture, process output capture, and browser console capture.
3. **Implementation** — Add only what’s needed: `logs/` layout, tee’d process output, optional Vite/Playwright console capture, and a dev script that runs everything with full logging.
4. **Manifest** — Write `.claude/PROJECT_LOOP.md` with services, log paths, start commands, and log priority for agents.
5. **Validate** — Start the project with the new setup and confirm logs are written.

After running it, agents can rely on `.claude/PROJECT_LOOP.md` and the feedback loop protocol in CLAUDE.md for ongoing development.

