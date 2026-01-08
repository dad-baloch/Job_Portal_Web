#!/usr/bin/env bash
# Build script for Render.com deployment

set -o errexit  # Exit on error

echo "Installing Python dependencies..."
pip install -r requirements.txt

echo "Running database migrations..."
flask db upgrade

echo "Build completed successfully!"
