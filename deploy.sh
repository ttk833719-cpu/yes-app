#!/bin/bash
# Deploy to Railway

# 1. Initialize git
git init

# 2. Add all files
git add .

# 3. Create initial commit
git commit -m "Yes App - Photo Capture"

# 4. Connect to Railway
# Go to https://railway.app and follow the instructions

echo "✅ Project ready for deployment!"
echo ""
echo "Next steps:"
echo "1. Go to https://railway.app"
echo "2. Click 'New Project'"
echo "3. Select 'Deploy from GitHub'"
echo "4. Choose this folder"
echo "5. Click Deploy"
echo ""
echo "Your app will be live at: https://yes-app-xxx.up.railway.app"
