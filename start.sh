#!/bin/bash
if ! command -v pnpm &> /dev/null
then
  echo "pnpm not found. Installing with npm..."
  npm install -g pnpm
fi


pnpm install
pnpm run dev:back-front