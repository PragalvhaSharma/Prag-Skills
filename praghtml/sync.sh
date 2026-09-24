#!/usr/bin/env bash
# Link the canonical praghtml skill into Claude Code, Codex, and Cursor.
# Canonical: ~/.claude/skills/praghtml
# Usage: bash ~/.claude/skills/praghtml/sync.sh

set -euo pipefail

CANON="${HOME}/.claude/skills/praghtml"
TARGETS=(
  "${HOME}/.codex/skills/praghtml"
  "${HOME}/.cursor/skills/praghtml"
  "${HOME}/.agents/skills/praghtml"
)

if [[ ! -f "${CANON}/SKILL.md" ]]; then
  echo "error: canonical skill missing at ${CANON}/SKILL.md" >&2
  exit 1
fi

mkdir -p "${HOME}/.claude/skills" "${HOME}/.codex/skills" "${HOME}/.cursor/skills" "${HOME}/.agents/skills"

for dest in "${TARGETS[@]}"; do
  parent="$(dirname "$dest")"
  mkdir -p "$parent"

  if [[ -L "$dest" ]]; then
    current="$(readlink "$dest")"
    if [[ "$current" == "$CANON" ]]; then
      echo "ok  (symlink) $dest → $CANON"
      continue
    fi
    rm "$dest"
  elif [[ -d "$dest" ]]; then
    echo "warn: $dest is a real directory; leaving it alone (remove it to replace with a symlink)" >&2
    continue
  elif [[ -e "$dest" ]]; then
    echo "warn: $dest exists and is not a symlink; leaving it alone" >&2
    continue
  fi

  ln -s "$CANON" "$dest"
  echo "linked $dest → $CANON"
done

echo
echo "Canonical: $CANON"
ls -la "$CANON"
echo
echo "Links:"
ls -la "${TARGETS[@]}" 2>/dev/null || true
