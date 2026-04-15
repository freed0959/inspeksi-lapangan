#!/bin/bash

# Pull changes from master branch
cd /vercel/share/v0-project

echo "Fetching latest changes from GitHub..."
git fetch origin master

echo "Pulling changes from master branch..."
git pull origin master

echo "Git pull completed successfully!"
