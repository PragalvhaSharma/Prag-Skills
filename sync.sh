#!/usr/bin/env bash
# Install this repo's skills as the canonical set, then symlink Agents, Codex,
# and Cursor to ~/.claude/skills so every tool sees the same skills.
# Then restore any global agent files from global/ that this machine is missing,
# leaving global files that are already in place untouched.
set -euo pipefail

ROOT="$(cd "$(dirname "$0")" && pwd)"
CANON="${HOME}/.claude/skills"
TARGETS=(
  "${HOME}/.codex/skills"
  "${HOME}/.cursor/skills"
  "${HOME}/.agents/skills"
)

mkdir -p "$CANON"

for skill_dir in "$ROOT"/*/; do
  name="$(basename "$skill_dir")"
  if [[ ! -f "${skill_dir}/SKILL.md" ]]; then
    continue
  fi
  rsync -a --delete --exclude '.DS_Store' "$skill_dir" "${CANON}/${name}/"
  echo "installed ${CANON}/${name}"
done

for dest_root in "${TARGETS[@]}"; do
  mkdir -p "$dest_root"
done

for skill_dir in "$CANON"/*/; do
  name="$(basename "$skill_dir")"
  src="${CANON}/${name}"
  [[ -f "${src}/SKILL.md" ]] || continue
  for dest_root in "${TARGETS[@]}"; do
    dest="${dest_root}/${name}"
    # Skip when dest already is (or points at) the real folder; removing it
    # would delete the source that the canonical symlink points to.
    if [[ -e "$dest" && "$(cd "$dest" && pwd -P)" == "$(cd "$src" && pwd -P)" ]]; then
      continue
    fi
    if [[ -L "$dest" || -e "$dest" ]]; then
      rm -rf "$dest"
    fi
    ln -s "$src" "$dest"
    echo "linked $dest → $src"
  done
done

# Global agent files. ~/.claude/CLAUDE.md must stay a real file because Claude
# Cowork skips a symlinked one; Codex and OpenCode link to it, and a Cursor
# sessionStart hook injects it.
CLAUDE_MD="${HOME}/.claude/CLAUDE.md"
CURSOR_HOOK="${HOME}/.cursor/hooks/parallel-work-context.sh"

restore() {  # restore <path under global/> <destination>, only if it is missing
  local src="${ROOT}/global/$1" dest="$2"
  if [[ -e "$dest" || -L "$dest" ]]; then
    return 0
  fi
  if [[ ! -f "$src" ]]; then
    echo "skipped ${dest}: global/$1 is not in this repo"
    return 0
  fi
  mkdir -p "$(dirname "$dest")"
  cp "$src" "$dest"
  if [[ "$dest" == *.sh ]]; then
    chmod +x "$dest"
  fi
  echo "restored ${dest}"
}

restore AGENTS.md "$CLAUDE_MD"
restore claude-agents/verifier.md "${HOME}/.claude/agents/verifier.md"
for agent in ocx-claude-opus-5-5 ocx-gpt-5-6-sol ocx-gpt-5-6-terra ocx-gpt-5-5 ocx-self case-video; do
  restore "claude-agents/${agent}.md" "${HOME}/.claude/agents/${agent}.md"
done
restore codex-agents/verifier.toml "${HOME}/.codex/agents/verifier.toml"
restore opencode-agents/verifier.md "${HOME}/.config/opencode/agents/verifier.md"
restore cursor-hooks/parallel-work-context.sh "$CURSOR_HOOK"

# Link only where the path is missing, an empty file, or already a symlink.
if [[ -f "$CLAUDE_MD" ]]; then
  for dest in "${HOME}/.codex/AGENTS.md" "${HOME}/.config/opencode/AGENTS.md"; do
    if [[ -L "$dest" && "$(readlink "$dest")" == "$CLAUDE_MD" ]]; then
      continue
    fi
    if [[ -L "$dest" || ! -e "$dest" || ( -f "$dest" && ! -s "$dest" ) ]]; then
      mkdir -p "$(dirname "$dest")"
      ln -sfn "$CLAUDE_MD" "$dest"
      echo "linked $dest → $CLAUDE_MD"
    else
      echo "kept ${dest}: it has its own content, so it was not replaced with a link"
    fi
  done
fi

# Register the Cursor hook in ~/.cursor/hooks.json unless it is already there.
if [[ -f "$CURSOR_HOOK" ]]; then
  python3 - "${HOME}/.cursor/hooks.json" "sh '${CURSOR_HOOK}'" <<'PY'
import json
import sys
from pathlib import Path

path, command = Path(sys.argv[1]), sys.argv[2]
try:
    data = json.loads(path.read_text()) if path.exists() else {"version": 1, "hooks": {}}
    entries = data.setdefault("hooks", {}).setdefault("sessionStart", [])
    if any("parallel-work-context.sh" in str(e.get("command", "")) for e in entries):
        sys.exit(0)
    entries.append({"command": command})
except (OSError, ValueError, AttributeError, TypeError) as exc:
    sys.exit(f"left {path} unchanged, could not add the Cursor hook: {exc}")
path.parent.mkdir(parents=True, exist_ok=True)
path.write_text(json.dumps(data, indent=2) + "\n")
print(f"added the Cursor sessionStart hook to {path}")
PY
fi
