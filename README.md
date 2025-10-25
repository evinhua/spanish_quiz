# Spanish Quiz

A Spanish B1 level grammar quiz application with AI-generated questions using React and Express.

## Features

- 10 AI-generated Spanish B1 grammar questions per game
- Spanish flag themed UI (red and yellow colors)
- Scoring system: 3 points for correct answer on first try, 1 point on second try
- Two attempts per question
- Covers various grammar topics: subjunctive, ser vs estar, por vs para, conditionals, etc.

## Setup

1. Install dependencies:
```bash
npm install
```

2. Start the backend server (required for AI question generation):
```bash
npm run server
```

3. In a new terminal, start the React application:
```bash
npm start
```

The server runs on http://localhost:3001 and the React app on http://localhost:3000.

## Available Scripts

- `npm start` - Runs the React app in development mode
- `npm run server` - Starts the Express backend server
- `npm run build` - Builds the app for production
- `npm test` - Launches the test runner

## How to Play

1. Answer 10 Spanish grammar questions
2. You get two attempts per question
3. First correct answer: 3 points
4. Second correct answer: 1 point
5. Wrong on both attempts: 0 points
6. View your final score and correct answers at the end

## Technology Stack

- React with TypeScript
- Express.js backend
- NVIDIA AI API for question generation
- CSS with Spanish flag color scheme
