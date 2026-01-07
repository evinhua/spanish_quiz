#!/bin/bash

# Simple deployment without CloudFormation
set -e

echo "🚀 Building Spanish Quiz..."

# Install dependencies and build
npm install
npm run build

echo "✅ Build complete!"
echo "📋 Next steps:"
echo "1. Create Elastic Beanstalk application manually in AWS Console"
echo "2. Upload the built application"
echo "3. Configure environment variables: AWS_REGION=us-east-1"
