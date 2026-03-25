#!/usr/bin/env bash

set -euo pipefail

source "$(cd "$(dirname "$0")" && pwd)/common.sh"

status_background "hardhat-node" || true
status_background "web" || true
say "logs directory: $LOG_DIR"
