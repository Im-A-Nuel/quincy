#!/usr/bin/env bash
# Fetch Foundry dependencies into lib/ (git-ignored, not vendored in the repo).
# Run once after cloning before `forge build` / `forge test`.
set -euo pipefail
cd "$(dirname "$0")/.."

rm -rf lib
mkdir -p lib
git clone --depth 1 https://github.com/foundry-rs/forge-std lib/forge-std
git clone --depth 1 --branch v5.1.0 \
  https://github.com/OpenZeppelin/openzeppelin-contracts lib/openzeppelin-contracts

echo "Dependencies installed. Run: forge build"
