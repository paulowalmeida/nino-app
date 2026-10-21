#!/usr/bin/env sh
# Commit only the paths you name, never a whole folder by accident.
# usage: scripts/commit-mine.sh "mensagem" path1 [path2 ...]
# Aborts when the index already holds files outside those paths, so work staged
# by another session is not swept into your commit.
set -eu

[ "$#" -ge 2 ] || { echo "usage: $0 \"message\" path [path...]" >&2; exit 2; }
message=$1
shift

for path in "$@"; do
  if [ -d "$path" ] && [ "${COMMIT_MINE_ALLOW_DIR:-0}" != 1 ]; then
    echo "refusing directory '$path' (set COMMIT_MINE_ALLOW_DIR=1 to allow)" >&2
    exit 1
  fi
done

git add -A -- "$@"

outside=$(git diff --cached --name-only | while read -r file; do
  keep=0
  for path in "$@"; do
    case "$file" in "$path"|"$path"/*) keep=1 ;; esac
  done
  [ "$keep" = 1 ] || echo "$file"
done)

if [ -n "$outside" ]; then
  echo "staged files outside the given paths:" >&2
  echo "$outside" >&2
  echo "unstage them (git restore --staged <file>) and retry" >&2
  exit 1
fi

git diff --cached --name-status
git commit -q -m "$message"
git log --oneline -1
