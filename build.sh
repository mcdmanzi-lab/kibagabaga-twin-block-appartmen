#!/bin/bash
set -e

echo "Installing dependencies..."
npm ci --prefer-offline --no-audit

echo "Building application..."
npm run build

echo "Build completed successfully!"
