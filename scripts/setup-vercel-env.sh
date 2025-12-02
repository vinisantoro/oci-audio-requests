#!/bin/bash

# Script to set ALLOWED_EMAILS environment variable in Vercel
# This script uses Vercel CLI to set the variable, which doesn't have character limits

# Check if vercel CLI is installed
if ! command -v vercel &> /dev/null; then
    echo "Error: Vercel CLI is not installed."
    echo "Install it with: npm i -g vercel"
    exit 1
fi

# Check if ALLOWED_EMAILS.env exists
if [ ! -f "ALLOWED_EMAILS.env" ]; then
    echo "Error: ALLOWED_EMAILS.env file not found."
    echo "Copy ALLOWED_EMAILS.env.example to ALLOWED_EMAILS.env and add your emails."
    exit 1
fi

# Read the email list from the file
EMAIL_LIST=$(cat ALLOWED_EMAILS.env | tr -d '\n' | tr -d ' ')

# Set the environment variable for production
echo "Setting ALLOWED_EMAILS for production..."
vercel env add ALLOWED_EMAILS production <<< "$EMAIL_LIST"

# Set the environment variable for preview
echo "Setting ALLOWED_EMAILS for preview..."
vercel env add ALLOWED_EMAILS preview <<< "$EMAIL_LIST"

# Set the environment variable for development
echo "Setting ALLOWED_EMAILS for development..."
vercel env add ALLOWED_EMAILS development <<< "$EMAIL_LIST"

echo "✅ ALLOWED_EMAILS environment variable has been set for all environments!"
echo "Note: You may need to redeploy your application for the changes to take effect."

