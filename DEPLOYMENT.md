# Frontend Deployment Guide

## Option 1: Manual S3 Upload (if you get S3 permissions)

1. Create S3 bucket:
```bash
aws s3 mb s3://spanish-quiz-frontend-unique-name
```

2. Enable static website hosting:
```bash
aws s3 website s3://spanish-quiz-frontend-unique-name --index-document index.html --error-document index.html
```

3. Upload build files:
```bash
aws s3 sync build/ s3://spanish-quiz-frontend-unique-name --delete
```

4. Make bucket public:
```bash
aws s3api put-bucket-policy --bucket spanish-quiz-frontend-unique-name --policy '{
  "Version": "2012-10-17",
  "Statement": [{
    "Effect": "Allow",
    "Principal": "*",
    "Action": "s3:GetObject",
    "Resource": "arn:aws:s3:::spanish-quiz-frontend-unique-name/*"
  }]
}'
```

## Option 2: Use Existing Hosting

The production build is ready in the `build/` folder and packaged as `spanish-quiz-frontend.tar.gz`.

You can deploy this to:
- Netlify (drag & drop the build folder)
- Vercel 
- GitHub Pages
- Any static hosting service

## Option 3: Local Testing

Serve locally:
```bash
npx serve -s build -p 3000
```

## Current Status

✅ Backend API deployed: https://rzqrx5wwuc.execute-api.us-east-1.amazonaws.com/prod/api/generate-question
✅ Frontend built and ready for deployment
❌ Need S3 permissions or alternative hosting solution

The app is fully functional - just needs hosting permissions.
