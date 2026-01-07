#!/bin/bash

# Spanish Quiz Frontend Deployment Script
set -e

BUCKET_NAME="spanish-quiz-frontend-$(date +%s)"
REGION="us-east-1"

echo "🚀 Deploying Spanish Quiz Frontend to AWS S3..."

# Create S3 bucket
echo "📦 Creating S3 bucket: $BUCKET_NAME"
aws s3 mb s3://$BUCKET_NAME --region $REGION

# Enable static website hosting
echo "🌐 Enabling static website hosting..."
aws s3 website s3://$BUCKET_NAME --index-document index.html --error-document index.html

# Upload build files
echo "📤 Uploading files..."
aws s3 sync build/ s3://$BUCKET_NAME --delete

# Make bucket public
echo "🔓 Making bucket public..."
aws s3api put-bucket-policy --bucket $BUCKET_NAME --policy "{
  \"Version\": \"2012-10-17\",
  \"Statement\": [{
    \"Effect\": \"Allow\",
    \"Principal\": \"*\",
    \"Action\": \"s3:GetObject\",
    \"Resource\": \"arn:aws:s3:::$BUCKET_NAME/*\"
  }]
}"

# Get website URL
WEBSITE_URL="http://$BUCKET_NAME.s3-website-$REGION.amazonaws.com"

echo "✅ Deployment complete!"
echo "🌍 Website URL: $WEBSITE_URL"
echo ""
echo "Backend API: https://rzqrx5wwuc.execute-api.us-east-1.amazonaws.com/prod/api/generate-question"
