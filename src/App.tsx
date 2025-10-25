import React, { useState, useEffect } from 'react';
import './App.css';

interface Question {
  question: string;
  options: string[];
  correct: number;
}

function App() {
  const [currentQuestion, setCurrentQuestion] = useState<Question | null>(null);
  const [questionNumber, setQuestionNumber] = useState(1);
  const [score, setScore] = useState(0);
  const [correctAnswers, setCorrectAnswers] = useState(0);
  const [attempts, setAttempts] = useState(0);
  const [gameFinished, setGameFinished] = useState(false);
  const [loading, setLoading] = useState(false);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [showResult, setShowResult] = useState(false);

  const generateQuestion = async (): Promise<Question> => {
    const response = await fetch('http://localhost:3001/api/generate-question', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      }
    });

    const question = await response.json();
    
    // Validate the question structure
    if (!question.question || !Array.isArray(question.options) || question.options.length !== 4) {
      console.error('Invalid question structure:', question);
      return {
        question: "¿Cuál es la forma correcta del verbo 'ser' en primera persona del presente?",
        options: ["soy", "eres", "es", "somos"],
        correct: 0
      };
    }
    
    console.log('Generated question:', question);
    return question;
  };

  const loadNextQuestion = async () => {
    setLoading(true);
    try {
      const question = await generateQuestion();
      setCurrentQuestion(question);
    } catch (error) {
      console.error('Error loading question:', error);
    }
    setLoading(false);
  };

  const startGame = async () => {
    setQuestionNumber(1);
    setScore(0);
    setCorrectAnswers(0);
    setGameFinished(false);
    setAttempts(0);
    setSelectedAnswer(null);
    setShowResult(false);
    await loadNextQuestion();
  };

  const handleAnswer = (answerIndex: number) => {
    if (showResult || !currentQuestion) return;
    
    setSelectedAnswer(answerIndex);
    setShowResult(true);
    
    const isCorrect = answerIndex === currentQuestion.correct;
    
    if (isCorrect) {
      setCorrectAnswers(prev => prev + 1);
      if (attempts === 0) {
        setScore(prev => prev + 3);
      } else if (attempts === 1) {
        setScore(prev => prev + 1);
      }
    }
    
    setTimeout(async () => {
      if (questionNumber < 10) {
        setQuestionNumber(prev => prev + 1);
        setAttempts(0);
        setSelectedAnswer(null);
        setShowResult(false);
        await loadNextQuestion();
      } else {
        setGameFinished(true);
      }
    }, 2000);
  };

  const handleWrongAnswer = () => {
    setAttempts(prev => prev + 1);
    setSelectedAnswer(null);
    setShowResult(false);
  };

  useEffect(() => {
    startGame();
  }, []);

  if (loading) {
    return (
      <div className="App">
        <div className="loading">
          <h2>Generando pregunta...</h2>
          <div className="spinner"></div>
        </div>
      </div>
    );
  }

  if (gameFinished) {
    return (
      <div className="App">
        <div className="results">
          <h1>¡Juego Terminado!</h1>
          <div className="score-display">
            <h2>Puntuación Total: {score}</h2>
            <h3>Respuestas Correctas: {correctAnswers}/10</h3>
          </div>
          <button onClick={startGame} className="restart-btn">
            Jugar de Nuevo
          </button>
        </div>
      </div>
    );
  }

  if (!currentQuestion) return <div>Cargando...</div>;

  return (
    <div className="App">
      <header className="header">
        <h1>Quiz de Gramática Española B1</h1>
        <div className="progress">
          Pregunta {questionNumber}/10 | Puntuación: {score}
        </div>
      </header>
      
      <div className="question-container">
        <h2>{currentQuestion.question}</h2>
        
        <div className="options">
          {currentQuestion.options.map((option, index) => (
            <button
              key={index}
              onClick={() => handleAnswer(index)}
              className={`option ${
                showResult
                  ? index === currentQuestion.correct
                    ? 'correct'
                    : selectedAnswer === index
                    ? 'incorrect'
                    : ''
                  : ''
              }`}
              disabled={showResult}
            >
              {option}
            </button>
          ))}
        </div>
        
        {showResult && selectedAnswer !== currentQuestion.correct && attempts < 2 && (
          <button onClick={handleWrongAnswer} className="try-again">
            Intentar de Nuevo
          </button>
        )}
      </div>
    </div>
  );
}

export default App;
