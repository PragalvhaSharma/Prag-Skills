#!/usr/bin/env bash
# Install this repo's skills as the canonical set, then symlink Agents, Codex,
# and Cursor to ~/.claude/skills so every tool sees the same skills.
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
    if [[ -L "$dest" || -e "$dest" ]]; then
      rm -rf "$dest"
    fi
    ln -s "$src" "$dest"
    echo "linked $dest → $src"
  done
done
