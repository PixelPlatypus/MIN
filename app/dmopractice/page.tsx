'use client';

import { useState, useEffect } from 'react';
import { Question } from './data/questions';
import { getRandomQuestions } from './data/questionSelector';
import 'katex/dist/katex.min.css';
import { InlineMath } from 'react-katex';
import { useShiningEffect } from '@/hooks/use-shining-effect';
import { MinFloatingElements } from "@/components/ui/min-floating-elements"
import { ClientOnly } from "@/components/client-only"
import Navigation from "@/components/navigation"
import { Footer } from "@/components/footer"


export default function DmopracticePage() {
  const [questions, setQuestions] = useState<Question[]>([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [timeLeft, setTimeLeft] = useState(6000); // 100 minutes in seconds
  const [selectedAnswers, setSelectedAnswers] = useState<{ [key: string]: string }>({});
  const [showResults, setShowResults] = useState(false);
  const [score, setScore] = useState(0);
  const [examFinished, setExamFinished] = useState(false);
  const [examStarted, setExamStarted] = useState(false);
  const [previousResults, setPreviousResults] = useState<any[]>([]);


  const shiningEffectRef = useShiningEffect<HTMLButtonElement>();

  useEffect(() => {
    const storedResults = JSON.parse(localStorage.getItem('dmoExamResults') || '[]');
    setPreviousResults(storedResults);
  }, []);

  useEffect(() => {
    if (examStarted) {
      setQuestions(getRandomQuestions(50)); // Get 50 random questions on component mount

      const timer = setInterval(() => {
        setTimeLeft((prevTime) => {
          if (prevTime <= 1) {
            clearInterval(timer);
            setExamFinished(true);
            handleSubmitExam();
            return 0;
          }
          return prevTime - 1;
        });
      }, 1000);

      return () => clearInterval(timer);
    }
  }, [examStarted]);

  const startExam = () => {
    setExamStarted(true);
  };

  const handleSubmitExam = () => {
    setExamFinished(true);
    let correctCount = 0;
    const questionDetails = questions.map(question => {
      const isCorrect = selectedAnswers[question.id] === question.correctAnswer;
      if (isCorrect) {
        correctCount++;
      }
      return {
        id: question.id,
        questionText: question.questionText.substring(0, 50) + (question.questionText.length > 50 ? '...' : ''),
        selectedAnswer: selectedAnswers[question.id] || 'Not answered',
        correctAnswer: question.correctAnswer,
        isCorrect
      };
    });
    
    setScore(correctCount);
    setShowResults(true);

    const results = {
      score: correctCount,
      totalQuestions: questions.length,
      percentage: Math.round((correctCount / questions.length) * 100),
      questionDetails,
      timeSpent: 6000 - timeLeft, // in seconds
      timestamp: new Date().toISOString(),
    };
    const storedResults = JSON.parse(localStorage.getItem('dmoExamResults') || '[]');
    localStorage.setItem('dmoExamResults', JSON.stringify([...storedResults, results]));
  };

    const getUnattemptedQuestionsCount = () => {
    return questions.filter(q => !selectedAnswers[q.id]).length;
  };

  const formatTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes.toString().padStart(2, '0')}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

  const handleAnswerSelect = (questionId: string, answer: string) => {
    setSelectedAnswers((prevAnswers) => ({
      ...prevAnswers,
      [questionId]: answer,
    }));
  };

  const handleNextQuestion = () => {
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex((prevIndex) => prevIndex + 1);
    }
  };

  const handlePreviousQuestion = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex((prevIndex) => prevIndex - 1);
    }
  };

  if (!examStarted) {
    return (
      <div className="overflow-x-hidden">
        <ClientOnly>
          <MinFloatingElements />
        </ClientOnly>
        <Navigation />
        <div className="min-h-screen flex flex-col items-center justify-center p-4 pt-20 relative z-10">
          <div className="glassmorphic-card p-8 rounded-lg shadow-lg w-full max-w-3xl text-white">
            <h1 className="text-3xl font-bold mb-6 min-gradient-accent">DMO Practice Exam</h1>
            <p className="text-lg mb-8">Welcome to the DMO Practice Exam. Click the button below to start your 1-hour exam.</p>
            <button
              onClick={() => startExam()}
              className="group glass text-white px-6 sm:px-10 py-3 sm:py-4 rounded-full font-semibold text-sm sm:text-lg hover:glass-hover transition-all duration-300 flex items-center justify-center space-x-2 w-full sm:w-auto shining-effect"
              ref={shiningEffectRef}
            >
              Start Test
            </button>

            {previousResults.length > 0 && (
              <div className="mt-10">
                <h2 className="text-2xl font-bold mb-4 min-gradient-accent">Previous Attempts</h2>
                <div className="grid gap-4">
                  {previousResults.slice().reverse().map((result, index) => (
                    <div key={index} className="glassmorphic-card p-4 rounded-lg">
                      <div className="flex justify-between items-center mb-2">
                        <div className="text-xl font-bold">
                          Score: {result.score} / {result.totalQuestions} 
                          {result.percentage && <span className="ml-2">({result.percentage}%)</span>}
                        </div>
                        <div className="text-sm opacity-80">
                          {new Date(result.timestamp).toLocaleDateString()} at {new Date(result.timestamp).toLocaleTimeString()}
                        </div>
                      </div>
                      {result.timeSpent && (
                        <div className="text-sm mb-2">
                          Time spent: {Math.floor(result.timeSpent / 60)}m {result.timeSpent % 60}s
                        </div>
                      )}
                      <div className="flex gap-2 mt-2">
                        <div className="h-2 bg-green-500 rounded-full" style={{ width: `${(result.score / result.totalQuestions) * 100}%` }}></div>
                        <div className="h-2 bg-red-500 rounded-full" style={{ width: `${((result.totalQuestions - result.score) / result.totalQuestions) * 100}%` }}></div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  if (examFinished) {
    const percentage = Math.round((score / questions.length) * 100);
    const timeSpent = 6000 - timeLeft;
    
    return (
      <div className="overflow-x-hidden">
        <ClientOnly>
          <MinFloatingElements />
        </ClientOnly>
        <Navigation />
        <div className="min-h-screen flex flex-col items-center justify-center p-4 pt-20 relative z-10">
          <div className="glassmorphic-card p-8 rounded-lg shadow-lg w-full max-w-3xl text-white">
            <h1 className="text-4xl font-bold mb-6 min-gradient-accent text-center">Exam Finished!</h1>
            
            <div className="mb-8">
              <div className="flex justify-between items-center mb-4">
                <p className="text-2xl">Your score: {score} / {questions.length}</p>
                <p className="text-2xl font-bold">{percentage}%</p>
              </div>
              
              <div className="w-full h-4 bg-gray-700 rounded-full mb-4">
                <div 
                  className={`h-full rounded-full ${percentage >= 70 ? 'bg-green-500' : percentage >= 50 ? 'bg-yellow-500' : 'bg-red-500'}`} 
                  style={{ width: `${percentage}%` }}
                ></div>
              </div>
              
              <p className="text-lg">Time spent: {Math.floor(timeSpent / 60)} minutes {timeSpent % 60} seconds</p>
            </div>
            
            <div className="flex justify-center mb-8">
              <button
                onClick={() => {
                  setShowResults(false);
                  setExamFinished(false);
                  setQuestions([]); // Clear questions
                  setCurrentQuestionIndex(0);
                  setSelectedAnswers({});
                  setTimeLeft(6000);
                  setExamStarted(false); // Go back to start screen
                }}
                className="group glass text-white px-6 sm:px-10 py-3 sm:py-4 rounded-full font-semibold text-sm sm:text-lg hover:glass-hover transition-all duration-300 flex items-center justify-center space-x-2 w-full sm:w-auto shining-effect mx-auto"
                ref={shiningEffectRef}
              >
                Start New Exam
              </button>
            </div>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  if (!examStarted || questions.length === 0) {
    return <div className="flex items-center justify-center min-h-screen text-white text-2xl">Loading questions...</div>;
  }

  const renderTextWithLatex = (text: string) => {
    if (!text) return <span></span>;
    
    // Regular expression to match LaTeX expressions between $ symbols
    const regex = /\$(.*?)\$/g;
    const parts = [];
    let lastIndex = 0;
    let match;
    
    while ((match = regex.exec(text)) !== null) {
      // Add text before the match
      if (match.index > lastIndex) {
        parts.push(<span key={`text-${lastIndex}`}>{text.substring(lastIndex, match.index)}</span>);
      }
      
      // Add the LaTeX expression
      parts.push(<InlineMath key={`math-${match.index}`} math={match[1]} />);
      
      lastIndex = match.index + match[0].length;
    }
    
    // Add any remaining text
    if (lastIndex < text.length) {
      parts.push(<span key={`text-${lastIndex}`}>{text.substring(lastIndex)}</span>);
    }
    
    return <>{parts}</>;
  };

  const currentQuestion = questions[currentQuestionIndex];
  return (
    <div className="overflow-x-hidden">
      <Navigation />
      <div className="min-h-screen flex flex-col items-center justify-center p-4 pt-20 relative z-10">
        <div className="glassmorphic-card p-8 rounded-lg shadow-lg w-full max-w-3xl">
          <div className="flex justify-center items-center mb-6">
            <div className="glassmorphic-card p-2 sm:p-4 rounded-lg shadow-lg flex flex-col items-center">
              <div className="text-lg sm:text-2xl font-mono font-bold min-gradient-accent">Time Left: {formatTime(timeLeft)}</div>
              <div className="text-base sm:text-lg font-mono font-bold min-gradient-accent">Unattempted: {getUnattemptedQuestionsCount()}</div>
            </div>
          </div>

          <div className="mb-8">
            <p className="text-xl mb-4 text-white">Question {currentQuestionIndex + 1} of {questions.length}:</p>
            <p className="text-lg mb-6 text-white">{renderTextWithLatex(currentQuestion.questionText)}</p>
            {currentQuestion.image && (
              <div className="flex justify-center mb-4">
                <img 
                  src={`/qsn_img/${currentQuestion.image}`}
                  alt="Question Image" 
                  className="bg-white p-2 rounded shadow-md max-w-full h-auto" 
                />
              </div>
            )}
            {currentQuestion.math && (
              <div className="text-lg bg-card p-2 rounded mb-4">
                <InlineMath math={currentQuestion.math} />
              </div>
            )}
          </div>

          <div className="flex flex-col gap-4 mb-8">
            {currentQuestion.options.map((option: string, index: number) => (
              <button
                key={index}
                className={`flex items-center text-left p-4 rounded-lg border-2 ${selectedAnswers[currentQuestion.id] === option ? 'border-min-primary bg-primary-foreground text-primary' : 'border-border bg-card'} hover:border-min-primary transition-all duration-200 glassmorphic-button`}
                onClick={() => handleAnswerSelect(currentQuestion.id, option)}
              >
                <span className="font-bold mr-3">{String.fromCharCode(65 + index)}.</span>
                {renderTextWithLatex(option)}
              </button>
            ))}
          </div>

          <div className="flex flex-wrap justify-between w-full px-4 gap-4">
            <button
              onClick={handlePreviousQuestion}
              disabled={currentQuestionIndex === 0}
              className="group glass text-white px-6 sm:px-10 py-3 sm:py-4 rounded-full font-semibold text-sm sm:text-lg hover:glass-hover transition-all duration-300 flex items-center justify-center space-x-2 w-full sm:w-auto shining-effect"
              ref={shiningEffectRef}
            >
              Previous
            </button>
            {currentQuestionIndex === questions.length - 1 ? (
              <div className="flex flex-wrap gap-4 justify-end w-full sm:w-auto">
                {getUnattemptedQuestionsCount() > 0 && (
                  <button
                    onClick={() => {
                      const firstUnattempted = questions.findIndex(q => !selectedAnswers[q.id]);
                      if (firstUnattempted !== -1) {
                        setCurrentQuestionIndex(firstUnattempted);
                      }
                    }}
                    className="group glass text-white px-6 sm:px-10 py-3 sm:py-4 rounded-full font-semibold text-sm sm:text-lg hover:glass-hover transition-all duration-300 flex items-center justify-center space-x-2 w-full sm:w-auto shining-effect"
                    ref={shiningEffectRef}
                  >
                    Go to Unattempted
                  </button>
                )}
                <button
                  onClick={handleSubmitExam}
                  className="group glass text-white px-6 sm:px-10 py-3 sm:py-4 rounded-full font-semibold text-sm sm:text-lg hover:glass-hover transition-all duration-300 flex items-center justify-center space-x-2 w-full sm:w-auto shining-effect"
                  ref={shiningEffectRef}
                >
                  Submit Exam
                </button>
              </div>
            ) : (
              <div className="flex justify-end w-full sm:w-auto">
                <button
                  onClick={handleNextQuestion}
                  disabled={currentQuestionIndex === questions.length - 1}
                  className="group glass text-white px-6 sm:px-10 py-3 sm:py-4 rounded-full font-semibold text-sm sm:text-lg hover:glass-hover transition-all duration-300 flex items-center justify-center space-x-2 w-full sm:w-auto shining-effect"
                  ref={shiningEffectRef}
                >
                  Next
                </button>
              </div>
            )}
          </div>

          {showResults && (
            <div className="mt-8 p-6 bg-card rounded-lg">
              <h2 className="text-2xl font-bold mb-4 text-foreground">Your Results</h2>
              <p className="text-xl text-foreground">Score: {score} / {questions.length}</p>
              <button
                onClick={() => setShowResults(false)}
                className="mt-4 px-4 py-2 rounded-lg bg-primary hover:bg-primary-foreground text-primary-foreground transition-all duration-200 glassmorphic-button"
              >
                Close Results
              </button>
            </div>
          )}
        </div>

        <style jsx>{`
          .glassmorphic-card {
            background: rgba(255, 255, 255, 0.05);
            backdrop-filter: blur(12px);
            border-radius: 15px;
            border: 1px solid rgba(255, 255, 255, 0.15);
            box-shadow: 0 6px 10px rgba(0, 0, 0, 0.15);
          }
        `}</style>
      </div>
      <Footer />
    </div>
  );
}