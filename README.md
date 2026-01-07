# Spanish Quiz App

A Spanish grammar quiz application using AWS Bedrock Claude 3 Haiku for AI-generated questions.

## Architecture

- **Frontend**: React TypeScript application
- **Backend**: AWS Lambda function
- **AI Model**: AWS Bedrock Claude 3 Haiku (`anthropic.claude-3-haiku-20240307-v1:0`)
- **API**: AWS API Gateway
- **Infrastructure**: AWS CloudFormation
- **Storage**: AWS S3

## Deployed Services

### Backend API
```
POST https://rzqrx5wwuc.execute-api.us-east-1.amazonaws.com/prod/api/generate-question
```

### Frontend
- **S3 Bucket**: `spanish-quiz-frontend-1767772476`
- **Status**: Files uploaded, awaiting public access configuration

## Local Development

1. Install dependencies:
```bash
npm install
```

2. Start development server:
```bash
npm start
```

3. Open browser to `http://localhost:3000`

## Production Build

Build for production:
```bash
npm run build
```

Serve locally:
```bash
npx serve -s build -p 3000
```

## Deployment

### Backend (Lambda + API Gateway)
```bash
# Update Lambda function
cd /Users/evinhua/genai/proj1/amazon_q/spanish_quiz
zip lambda-simple.zip lambda-simple.js
aws lambda update-function-code --function-name spanish-quiz-api --zip-file fileb://lambda-simple.zip
```

### Frontend (S3)
```bash
# Build and deploy
npm run build
./deploy-frontend.sh
```

**Note**: Frontend deployment requires:
- S3FullAccess permissions
- Account-level Block Public Access disabled OR CloudFront permissions
- Organization SCP allowing S3/CloudFront operations

## Features

- AI-generated Spanish grammar questions (B1 level)
- 15 dynamically generated grammar topics per session
- Multiple choice format with 4 options
- Topics include: pretérito perfecto vs indefinido, subjuntivo, ser vs estar, por vs para, and more
- Scoring system: 3 points for first attempt, 1 point for second attempt
- 10 questions per game
- Two attempts per question

## Project Structure

```
spanish_quiz/
├── src/
│   ├── App.tsx              # React frontend
│   └── App.css              # Styles
├── build/                   # Production build
├── lambda-simple.js         # AWS Lambda function
├── lambda-stack.yml         # Backend CloudFormation template
├── cloudfront-stack.yml     # CloudFront distribution template
├── deploy-frontend.sh       # Frontend deployment script
├── deploy-cloudfront.sh     # CloudFront deployment script
└── README.md
```

## AWS Resources

- **Lambda Function**: `spanish-quiz-api`
- **API Gateway**: `spanish-quiz-api` (ID: `rzqrx5wwuc`)
- **CloudFormation Stack**: `spanish-quiz-lambda`
- **S3 Bucket**: `spanish-quiz-frontend-1767772476`
- **IAM Role**: `spanish-quiz-lambda-LambdaExecutionRole-IlYe1mct27YN`

## Troubleshooting

### Frontend not accessible
- Check if account-level Block Public Access is disabled
- Verify CloudFront permissions if using CDN
- Check Organization Service Control Policies

### Backend API errors
- Verify Lambda function has Bedrock permissions
- Check CloudWatch logs: `/aws/lambda/spanish-quiz-api`
- Ensure Claude 3 Haiku model is available in us-east-1

### CORS issues
- API Gateway has OPTIONS method configured
- Lambda returns proper CORS headers

## License

MIT
