#!/bin/sh
# Cursor sessionStart hook. Cursor has no global AGENTS.md file, so this injects
# the shared global agent instructions (~/.claude/CLAUDE.md) as additional_context.
cat >/dev/null
instructions_file="$HOME/.claude/CLAUDE.md"
if [ ! -r "$instructions_file" ]; then
  printf '{}\n'
  exit 0
fi
exec /usr/bin/python3 -c 'import json, sys; print(json.dumps({"additional_context": open(sys.argv[1], encoding="utf-8").read()}))' "$instructions_file"
