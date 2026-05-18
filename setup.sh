#!/usr/bin/env bash
set -euo pipefail

npm install

if [ ! -f ".env.local" ]; then
  cp .env.local.example .env.local
fi

echo "Setup complete. Run: npm run dev"
