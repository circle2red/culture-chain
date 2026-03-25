#!/usr/bin/env bash

set -euo pipefail

source "$(cd "$(dirname "$0")" && pwd)/common.sh"

run_logged "hardhat-node" pnpm --filter @culture-chain/contracts node
