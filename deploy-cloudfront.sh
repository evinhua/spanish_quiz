#!/bin/bash
# Deploy CloudFront for Spanish Quiz Frontend

BUCKET_NAME="spanish-quiz-frontend-1767772476"

echo "🚀 Deploying CloudFront distribution..."

# Deploy CloudFormation stack
aws cloudformation deploy \
  --template-file cloudfront-stack.yml \
  --stack-name spanish-quiz-cloudfront \
  --parameter-overrides BucketName=$BUCKET_NAME

# Get CloudFront URL
CLOUDFRONT_URL=$(aws cloudformation describe-stacks \
  --stack-name spanish-quiz-cloudfront \
  --query 'Stacks[0].Outputs[?OutputKey==`CloudFrontURL`].OutputValue' \
  --output text)

echo "✅ CloudFront deployed!"
echo "🌍 Website URL: $CLOUDFRONT_URL"
echo ""
echo "Note: CloudFront distribution takes 15-20 minutes to fully deploy"
