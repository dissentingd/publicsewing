#!/bin/sh
# Run tools/drape-pipeline.mjs on the GPU host (Cloudbox), unattended, from its own checkout.
#
#   ssh <gpu host> 'sh ~/drape-pipeline/run.sh --background [args]'   # one run, detached
#   ssh <gpu host> 'sh ~/drape-pipeline/run.sh status'                # the latest log's tail
#   crontab: 0 2 * * * sh $HOME/drape-pipeline/run.sh nightly         # regress, then new
#   (first time: copy this file up as ~/drape-pipeline/run.sh and run it with `setup`, which
#   clones the repo; after that each run keeps run.sh the repo's copy)
#
# Keeps everything under ~/drape-pipeline: repo/ (a clone of the public repo, reset to
# origin/main before each run unless PIPELINE_NO_UPDATE=1), node/ (a pinned Node), and
# latest.log. Results: repo/designs/out/drape-pipeline/ (see the top of drape-pipeline.mjs).
# --background detaches, so the ssh session can close; `status` prints the last run's log tail.
set -eu
BASE="$HOME/drape-pipeline"
REPO="$BASE/repo"
URL="https://github.com/dissentingd/publicsewing.git"
NODE_VERSION="v22.12.0"
NODE="$BASE/node/bin/node"
export PATH="$BASE/node/bin:$PATH"
export DRAPE_HOST=local
export DRAPE_DATA="${DRAPE_DATA:-$HOME/custom-clothing/docker/data}"
export PYTHON="${PYTHON:-python3}"
mkdir -p "$BASE"

setup() {
  if [ ! -x "$NODE" ]; then
    echo "installing Node $NODE_VERSION"
    tmp=$(mktemp -d)
    curl -fsSL "https://nodejs.org/dist/$NODE_VERSION/node-$NODE_VERSION-linux-x64.tar.xz" -o "$tmp/node.tar.xz"
    mkdir -p "$BASE/node"
    tar -xJf "$tmp/node.tar.xz" -C "$BASE/node" --strip-components=1
    rm -rf "$tmp"
  fi
  [ -d "$REPO/.git" ] || git clone -q "$URL" "$REPO"
  if [ "${PIPELINE_NO_UPDATE:-0}" != 1 ]; then
    git -C "$REPO" fetch -q origin main
    git -C "$REPO" reset -q --hard origin/main
  fi
  # Dependencies only when the lock file changed
  lock="$REPO/designs/package-lock.json"
  sum=$(sha256sum "$lock" | cut -d' ' -f1)
  if [ "$(cat "$BASE/.deps" 2>/dev/null)" != "$sum" ] || [ ! -d "$REPO/designs/node_modules" ]; then
    echo "installing the designs' dependencies"
    (cd "$REPO/designs" && npm ci --no-audit --no-fund --loglevel=error)
    echo "$sum" > "$BASE/.deps"
  fi
  # Keep ~/drape-pipeline/run.sh (what cron calls) the repo's copy; a rename, so a run that's
  # reading the old one isn't disturbed
  cp "$REPO/designs/tools/drape-pipeline.sh" "$BASE/run.sh.new" && mv "$BASE/run.sh.new" "$BASE/run.sh"
}

# Old output: the pipeline's simulations (about 17 MB each) after 14 days, its runs and logs
# after 30. Drapes run by hand (not *-pipeline_*) are kept
prune() {
  find "$DRAPE_DATA/Logs" -maxdepth 1 -type d -name '*-pipeline_*' -mtime +14 -exec rm -rf {} + 2>/dev/null || true
  find "$REPO/designs/out/drape-pipeline" -mindepth 1 -maxdepth 1 -type d -mtime +30 -exec rm -rf {} + 2>/dev/null || true
  find "$BASE/logs" -type f -mtime +30 -delete 2>/dev/null || true
}

case "${1:-}" in
  setup)
    setup
    echo "ready: $REPO at $(git -C "$REPO" rev-parse --short HEAD)"
    exit 0
    ;;
  status)
    tail -n 30 "$(ls -t "$BASE"/latest.log "$BASE"/logs/*.log 2>/dev/null | head -1)" 2>/dev/null || echo "no run yet"
    exit 0
    ;;
  nightly)
    # From cron: drape again what changed, then try the new designs; a dated log
    shift
    mkdir -p "$BASE/logs"
    exec sh "$0" --mode nightly "$@" > "$BASE/logs/$(date +%F).log" 2>&1 < /dev/null
    ;;
  --background)
    shift
    nohup setsid sh "$0" "$@" > "$BASE/latest.log" 2>&1 < /dev/null &
    echo "started in the background: tail -f $BASE/latest.log"
    exit 0
    ;;
esac

# One run at a time (the pipeline keeps its own lock too)
exec 9> "$BASE/.run.lock"
if ! flock -n 9; then echo "a run is already going"; exit 1; fi
setup
prune
cd "$REPO/designs"
"$NODE" tools/drape-pipeline.mjs "$@"
