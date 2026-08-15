#!/usr/bin/env sh

# Vercel Ignored Build Step for one workspace of this monorepo.
#
# Vercel reads the exit code backwards from the usual convention:
#   exit 0 -> skip the build   |   any other code -> run the build
#
# `turbo query affected --exit-code` already answers in that same shape
# (1 when the package is affected, 0 when it is not), so the codes line up
# without inverting anything. It replaces `turbo-ignore`, deprecated by
# Vercel in favour of this command.
#
# Usage (from the repo root): sh scripts/skip-unaffected-build.sh nino-manager

set -u

package="${1:-}"

if [ -z "$package" ]; then
  echo "usage: skip-unaffected-build.sh <workspace-name>" >&2
  exit 1
fi

# SHA of the last successful deployment of THIS project — Vercel only exposes
# it when an Ignored Build Step is configured, which is exactly this script.
base="${VERCEL_GIT_PREVIOUS_SHA:-}"

if [ -z "$base" ]; then
  echo "No previous successful deployment to compare against — building $package."
  exit 1
fi

# Vercel clones shallow, so a base older than the clone depth is missing here.
# Deepening is best-effort: never skip a build over a diff we could not read.
if ! git cat-file -e "$base^{commit}" 2>/dev/null; then
  git fetch --no-tags --depth=100 origin "$base" 2>/dev/null ||
    git fetch --no-tags --unshallow 2>/dev/null ||
    true
fi

if ! git cat-file -e "$base^{commit}" 2>/dev/null; then
  echo "Base commit $base is not in this clone — building $package."
  exit 1
fi

# The Ignored Build Step runs before the install step, so node_modules may not
# exist yet; npx downloads turbo in that case.
if [ -x ./node_modules/.bin/turbo ]; then
  turbo=./node_modules/.bin/turbo
else
  turbo="npx --yes turbo@^2.5.4"
fi

$turbo query affected --base="$base" --packages "$package" --exit-code
status=$?

case "$status" in
  0)
    echo "$package is unaffected by $base..HEAD — skipping build."
    exit 0
    ;;
  1)
    echo "$package is affected by $base..HEAD — building."
    exit 1
    ;;
  *)
    echo "turbo query failed with exit $status — building $package to be safe."
    exit 1
    ;;
esac
