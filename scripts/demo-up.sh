#!/usr/bin/env bash

set -euo pipefail

source "$(cd "$(dirname "$0")" && pwd)/common.sh"

start_background "hardhat-node" "$ROOT_DIR/scripts/run-hardhat-node.sh"
wait_for_tcp 127.0.0.1 8545 30 1
run_logged "deploy-local" "$ROOT_DIR/scripts/deploy-local.sh"
start_background "web" "$ROOT_DIR/scripts/run-web.sh"
wait_for_tcp 127.0.0.1 3000 60 1
say "demo is ready"
say "web:  http://127.0.0.1:3000"
say "logs: $LOG_DIR"
