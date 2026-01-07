#!/bin/bash

echo "🚀 Manual deployment without CloudFormation..."

# Build the React app
echo "📦 Building React app..."
npm install
npm run build

# Create deployment package
echo "📦 Creating deployment package..."
mkdir -p dist
cp -r build/* dist/
cp server.js dist/
cp package.json dist/

# Create a simple index.js for manual deployment
cat > dist/index.js << 'EOF'
const express = require('express');
const path = require('path');
const app = express();
const PORT = process.env.PORT || 8080;

app.use(express.static('.'));
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'index.html'));
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
EOF

echo "✅ Deployment package created in 'dist' folder"
echo ""
echo "📋 Manual deployment options:"
echo "1. Upload 'dist' folder to any web hosting service"
echo "2. Use AWS Amplify Console (drag & drop deployment)"
echo "3. Use Vercel: 'npx vercel --prod'"
echo "4. Use Netlify: drag 'dist' folder to netlify.com/drop"
echo ""
echo "🔧 For Bedrock integration, you'll need to:"
echo "1. Deploy the backend separately (Lambda or EC2)"
echo "2. Update REACT_APP_API_URL in frontend"
