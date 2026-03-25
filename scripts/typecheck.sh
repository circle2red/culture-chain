#!/usr/bin/env bash

set -euo pipefail

source "$(cd "$(dirname "$0")" && pwd)/common.sh"

run_logged "typecheck" pnpm --filter @culture-chain/web typecheck
