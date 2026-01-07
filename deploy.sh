#!/bin/bash

# Spanish Quiz AWS Deployment Script

set -e

APP_NAME="spanish-quiz"
REGION="us-east-1"
STACK_NAME="${APP_NAME}-stack"

echo "🚀 Deploying Spanish Quiz to AWS..."

# Check if AWS CLI is configured
echo "🔍 Testing AWS CLI configuration..."
if ! aws sts get-caller-identity; then
    echo "❌ AWS CLI error. Please check your credentials with 'aws configure'"
    exit 1
fi
echo "✅ AWS CLI configured successfully"

# Install dependencies
echo "📦 Installing dependencies..."
npm install

# Build React app
echo "🏗️  Building React application..."
npm run build

# Deploy CloudFormation stack
echo "☁️  Deploying CloudFormation stack..."
aws cloudformation deploy \
    --template-file cloudformation.yml \
    --stack-name $STACK_NAME \
    --parameter-overrides AppName=$APP_NAME \
    --capabilities CAPABILITY_IAM \
    --region $REGION

# Get the application URL
APP_URL=$(aws cloudformation describe-stacks \
    --stack-name $STACK_NAME \
    --region $REGION \
    --query 'Stacks[0].Outputs[?OutputKey==`ApplicationURL`].OutputValue' \
    --output text)

echo "✅ Deployment complete!"
echo "🌐 Application URL: http://$APP_URL"
echo ""
echo "📋 Next steps:"
echo "1. Build and push Docker image to ECR (optional)"
echo "2. Deploy application code to Elastic Beanstalk"
echo "3. Test the application"
