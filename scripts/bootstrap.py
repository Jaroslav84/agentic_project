#!/usr/bin/env python3
"""
Bootstrap script: seed a target project with the agentic-development layout.

FLOW
----
Given a destination project directory, this script performs the following steps
in order. Every file copy that would overwrite an existing file prompts the user
for an action ([O]verwrite / [S]kip / [D]iff / [M]erge for .md / [A]ll-overwrite
/ [L]all-skip). Identical files are left alone silently.

    1. Copy `.claude/` recursively from source into target.
       - Includes agents/, commands/, skills/, settings.local.json, etc.
       - Each file prompts on conflict. .md files can be merged (appended).

    2. Copy `CLAUDE.md` into target.
       - If target already has `CLAUDE.md`, the file is written to
         `CLAUDE_AGENTIC-DEVELOPMENT.md` instead so the user's existing
         instructions are never clobbered. The user can then merge manually.

    3. Copy `BOOTSTRAP.md` into target (prompts on conflict, mergeable).

    4. Copy content subtrees recursively from source into target (each one
       optional — missing source dirs are skipped silently). Same
       prompt-on-conflict behavior as `.claude/`:
         plan/              specs/              dashboard/
         docs/              scripts/linters/    scripts/security/

       Gitignored files and OS/build junk (.DS_Store, __pycache__,
       node_modules, .mypy_cache, …) are skipped automatically. When the
       source is a git repo, only tracked + untracked-not-ignored files
       are copied (`git ls-files --cached --others --exclude-standard`).

    5. Ensure these empty directories exist in target (created only if missing):
         docs/  plan/  reviews/  scripts/  specs/  src/  todo/

    6. Create `README.md` in target **only if it does not exist**, seeded with a
       single line: `# <dest-folder-name>`. Existing READMEs are never touched.

Usage:
    python3 scripts/bootstrap.py /path/to/target/project
    python3 scripts/bootstrap.py /path/to/target -s /path/to/source
"""

import argparse
import filecmp
import shutil
import subprocess
import sys
from pathlib import Path

SCAFFOLD_DIRS = ("docs", "plan", "reviews", "scripts", "specs", "src", "todo")

DONE_BANNER = r"""

▄████▄  ▄████  ██████ ███  ██ ██████ ██ ▄█████
██▄▄██ ██  ▄▄▄ ██▄▄   ██ ▀▄██   ██   ██ ██
██  ██  ▀███▀  ██▄▄▄▄ ██   ██   ██   ██ ▀█████


█████▄ ▄████▄ ▄████▄ ██████ ▄█████ ██████ █████▄  ▄████▄ █████▄
██▄▄██ ██  ██ ██  ██   ██   ▀▀▀▄▄▄   ██   ██▄▄██▄ ██▄▄██ ██▄▄█▀
██▄▄█▀ ▀████▀ ▀████▀   ██   █████▀   ██   ██   ██ ██  ██ ██
                
                COMPLETED

"""

CONTENT_SUBTREES = (
    "plan",
    "specs",
    "dashboard",
    "docs",
    "scripts/linters",
    "scripts/security",
)

JUNK_NAMES = {
    ".DS_Store", "Thumbs.db", ".git",
    "__pycache__", ".mypy_cache", ".pytest_cache", ".ruff_cache",
    "node_modules",
}


def git_allowed_files(source_dir: Path, subtree: str) -> set[Path] | None:
    """Absolute paths git would track under <subtree> (tracked + untracked-not-ignored).

    Returns None if source isn't a git repo — caller falls back to copying everything.
    """
    try:
        result = subprocess.run(
            ["git", "-C", str(source_dir), "ls-files", "-z",
             "--cached", "--others", "--exclude-standard", "--", subtree],
            check=True, capture_output=True, text=True,
        )
    except (subprocess.CalledProcessError, FileNotFoundError):
        return None
    return {(source_dir / p).resolve() for p in result.stdout.split("\0") if p}


def is_junk(path: Path) -> bool:
    return any(part in JUNK_NAMES for part in path.parts)


def prompt_for_file_action(dest: Path) -> str:
    """Ask user what to do when dest file exists. Returns o|s|d|m|all-o|all-s."""
    while True:
        rel = dest.relative_to(dest.anchor) if dest.is_absolute() else dest
        print(f"\n  File exists: {rel}")
        print(
            "  [O]verwrite  [S]kip  [D]iff  [M]erge (append)  [A]ll overwrite  [L]all skip: ",
            end="",
        )
        choice = input().strip().lower()
        if choice in ("o", "s", "d", "m"):
            return choice
        if choice == "a":
            return "all-o"
        if choice == "l":
            return "all-s"
        print("  Invalid. Choose O, S, D, M, A, or L.")


def merge_markdown(src: Path, dest: Path) -> bool:
    """Append source content to dest with a separator. Returns True if merged."""
    try:
        dest_content = dest.read_text(encoding="utf-8", errors="replace")
        src_content = src.read_text(encoding="utf-8", errors="replace")
        separator = "\n\n---\n\n<!-- Merged from bootstrap -->\n\n"
        dest.write_text(dest_content + separator + src_content, encoding="utf-8")
        return True
    except OSError as e:
        print(f"  Error merging: {e}")
        return False


def run_diff(src: Path, dest: Path) -> bool:
    """Run diff/fc command. Returns True if diff available."""
    for cmd in (["diff", "-u", str(dest), str(src)], ["fc", "/N", str(dest), str(src)]):
        try:
            subprocess.run(cmd)
            return True
        except FileNotFoundError:
            continue
    print("  No diff tool found (diff or fc)")
    return False


def copy_file(
    src: Path,
    dest: Path,
    *,
    all_overwrite: bool = False,
    all_skip: bool = False,
    mergeable: bool = True,
) -> tuple[bool, bool, bool]:
    """
    Copy src to dest, prompting if dest exists.
    Returns (done, all_overwrite, all_skip) - latter two update caller flags.
    """
    if all_overwrite:
        dest.parent.mkdir(parents=True, exist_ok=True)
        shutil.copy2(src, dest)
        print(f"  Copied (overwrite): {dest}")
        return True, True, False

    if all_skip:
        print(f"  Skipped: {dest}")
        return True, False, True

    if not dest.exists():
        dest.parent.mkdir(parents=True, exist_ok=True)
        shutil.copy2(src, dest)
        print(f"  Copied: {dest}")
        return True, False, False

    if filecmp.cmp(src, dest, shallow=False):
        print(f"  Unchanged (identical): {dest}")
        return True, False, False

    action = prompt_for_file_action(dest)
    if action == "all-o":
        shutil.copy2(src, dest)
        print(f"  Copied (overwrite): {dest}")
        return True, True, False
    if action == "all-s":
        print(f"  Skipped: {dest}")
        return True, False, True
    if action == "o":
        shutil.copy2(src, dest)
        print(f"  Copied (overwrite): {dest}")
        return True, False, False
    if action == "s":
        print(f"  Skipped: {dest}")
        return True, False, False
    if action == "d":
        run_diff(src, dest)
        return copy_file(
            src, dest, all_overwrite=False, all_skip=False, mergeable=mergeable
        )
    if action == "m" and mergeable and src.suffix.lower() in (".md", ".markdown"):
        if merge_markdown(src, dest):
            print(f"  Merged: {dest}")
        return True, False, False
    if action == "m":
        print("  Merge only supported for .md files. Choose O or S.")
        return copy_file(
            src, dest, all_overwrite=False, all_skip=False, mergeable=mergeable
        )

    return False, False, False


def copy_subtree(
    name: str,
    source_dir: Path,
    dest_dir: Path,
    all_overwrite: bool,
    all_skip: bool,
    *,
    required: bool,
) -> tuple[bool, bool]:
    """Copy `<name>/` recursively from source to target.

    If `required` is True and the source subtree is missing, exit with an error.
    If `required` is False and it's missing, skip silently.
    """
    sub_src = source_dir / name
    if not sub_src.is_dir():
        if required:
            print(f"Error: No {name}/ directory in source: {source_dir}")
            sys.exit(1)
        print(f"\n--- {name}/ (not in source — skipping) ---")
        return all_overwrite, all_skip

    print(f"\n--- {name}/ ---")
    allowed = git_allowed_files(source_dir, name)
    for src_path in sorted(sub_src.rglob("*")):
        if src_path.is_dir():
            continue
        if is_junk(src_path):
            continue
        if allowed is not None and src_path.resolve() not in allowed:
            continue
        rel = src_path.relative_to(sub_src)
        dest_path = dest_dir / name / rel
        _, ao, as_ = copy_file(
            src_path,
            dest_path,
            all_overwrite=all_overwrite,
            all_skip=all_skip,
            mergeable=True,
        )
        all_overwrite |= ao
        all_skip |= as_
    return all_overwrite, all_skip


def copy_claude_md(
    source_dir: Path, dest_dir: Path, all_overwrite: bool, all_skip: bool
) -> tuple[bool, bool]:
    """Step 2: copy CLAUDE.md — or CLAUDE_AGENTIC-DEVELOPMENT.md if one exists."""
    src = source_dir / "CLAUDE.md"
    if not src.is_file():
        print(f"Error: No CLAUDE.md in source: {source_dir}")
        sys.exit(1)

    primary = dest_dir / "CLAUDE.md"
    if not primary.exists():
        print("\n--- CLAUDE.md ---")
        _, ao, as_ = copy_file(
            src, primary, all_overwrite=all_overwrite, all_skip=all_skip, mergeable=True
        )
        return all_overwrite | ao, all_skip | as_

    if filecmp.cmp(src, primary, shallow=False):
        print("\n--- CLAUDE.md ---")
        print(f"  In sync with upstream (identical): {primary}")
        return all_overwrite, all_skip

    print("\n--- CLAUDE.md ---")
    print(f"  ⚠️  Your CLAUDE.md diverges from upstream: {primary}")
    print("  Writing new upstream version to CLAUDE_AGENTIC-DEVELOPMENT.md for manual merge.")
    dest = dest_dir / "CLAUDE_AGENTIC-DEVELOPMENT.md"
    _, ao, as_ = copy_file(
        src, dest, all_overwrite=all_overwrite, all_skip=all_skip, mergeable=True
    )
    return all_overwrite | ao, all_skip | as_


def copy_bootstrap_md(
    source_dir: Path, dest_dir: Path, all_overwrite: bool, all_skip: bool
) -> tuple[bool, bool]:
    """Step 3: copy BOOTSTRAP.md into target."""
    src = source_dir / "BOOTSTRAP.md"
    if not src.is_file():
        print(f"  Skipping BOOTSTRAP.md (not found in source: {source_dir})")
        return all_overwrite, all_skip

    print("\n--- BOOTSTRAP.md ---")
    _, ao, as_ = copy_file(
        src,
        dest_dir / "BOOTSTRAP.md",
        all_overwrite=all_overwrite,
        all_skip=all_skip,
        mergeable=True,
    )
    return all_overwrite | ao, all_skip | as_


def ensure_scaffold_dirs(dest_dir: Path) -> None:
    """Step 4: create empty scaffold directories if they don't exist."""
    print("\n--- Scaffold directories ---")
    for name in SCAFFOLD_DIRS:
        path = dest_dir / name
        if path.exists():
            print(f"  Exists:  {path}")
        else:
            path.mkdir(parents=True)
            print(f"  Created: {path}")


def ensure_readme(dest_dir: Path) -> None:
    """Step 5: create a stub README.md if none exists (never overwrites)."""
    readme = dest_dir / "README.md"
    print("\n--- README.md ---")
    if readme.exists():
        print(f"  Exists (untouched): {readme}")
        return
    title = f"# {dest_dir.name}\n"
    readme.write_text(title, encoding="utf-8")
    print(f"  Created: {readme}")


def bootstrap(source_dir: Path, dest_dir: Path) -> None:
    """Run the full bootstrap flow described at the top of this file."""
    dest_dir = dest_dir.resolve()
    source_dir = source_dir.resolve()

    if not source_dir.is_dir():
        print(f"Error: Source directory does not exist: {source_dir}")
        sys.exit(1)

    if not dest_dir.exists():
        dest_dir.mkdir(parents=True)
        print(f"Created destination: {dest_dir}")

    all_overwrite = False
    all_skip = False

    all_overwrite, all_skip = copy_subtree(
        ".claude", source_dir, dest_dir, all_overwrite, all_skip, required=True
    )
    all_overwrite, all_skip = copy_claude_md(
        source_dir, dest_dir, all_overwrite, all_skip
    )
    all_overwrite, all_skip = copy_bootstrap_md(
        source_dir, dest_dir, all_overwrite, all_skip
    )
    for name in CONTENT_SUBTREES:
        all_overwrite, all_skip = copy_subtree(
            name, source_dir, dest_dir, all_overwrite, all_skip, required=False
        )
    ensure_scaffold_dirs(dest_dir)
    ensure_readme(dest_dir)

    print(DONE_BANNER)


def main():
    parser = argparse.ArgumentParser(
        description=(
            "Bootstrap a target project with the agentic-development layout: "
            ".claude/, CLAUDE.md, BOOTSTRAP.md, plan/, specs/, scaffold dirs, "
            "and a stub README."
        )
    )
    parser.add_argument(
        "dest",
        type=Path,
        help="Destination project directory (folder path)",
    )
    parser.add_argument(
        "-s",
        "--source",
        type=Path,
        default=Path(__file__).resolve().parent.parent,
        help="Source directory containing .claude/, CLAUDE.md, BOOTSTRAP.md (default: project root)",
    )
    args = parser.parse_args()
    bootstrap(args.source, args.dest)


if __name__ == "__main__":
    main()
