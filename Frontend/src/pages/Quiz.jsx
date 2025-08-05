import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { quizAPI, requireAuth } from '../services/api';
import QuestionCard from '../components/QuestionCard';

const Quiz = () => {
  const { quizId } = useParams();
  const navigate = useNavigate();
  const [questions, setQuestions] = useState([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [userAnswers, setUserAnswers] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [quizTitle, setQuizTitle] = useState('');

  useEffect(() => {
    fetchQuizQuestions();
  }, [quizId]);

  const fetchQuizQuestions = async () => {
    try {
      // Check authentication first
      if (!requireAuth()) {
        return;
      }

      setLoading(true);
      setError('');
      
      console.log('Fetching questions for quiz ID:', quizId);
      
      // Get questions for this quiz
      const questionsData = await quizAPI.getQuizQuestions(quizId);
      console.log('Questions received:', questionsData);
      
      if (Array.isArray(questionsData)) {
        setQuestions(questionsData);
        // Set a default title if we don't have one
        setQuizTitle('Quiz');
      } else {
        throw new Error('Invalid questions data format');
      }
      
    } catch (err) {
      console.error('Error fetching quiz questions:', err);
      setError(`Failed to load quiz questions: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  const handleAnswer = (answerIndex) => {
    setUserAnswers(prev => ({
      ...prev,
      [currentQuestionIndex]: answerIndex
    }));
  };

  const handleNext = () => {
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(prev => prev + 1);
    } else {
      // Quiz completed, submit answers
      submitQuiz();
    }
  };

  const handlePrevious = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(prev => prev - 1);
    }
  };

  const submitQuiz = async () => {
    try {
      setSubmitting(true);
      
      console.log('Submitting quiz with ID:', quizId);
      console.log('User answers:', userAnswers);
      
      // Convert user answers to the format expected by backend
      const responses = questions.map((question, index) => {
        const selectedIndex = userAnswers[index];
        let selectedAnswer = "-1";
        
        if (selectedIndex !== undefined) {
          // Convert index to actual option text
          switch(selectedIndex) {
            case 0:
              selectedAnswer = question.option1;
              break;
            case 1:
              selectedAnswer = question.option2;
              break;
            case 2:
              selectedAnswer = question.option3;
              break;
            case 3:
              selectedAnswer = question.option4;
              break;
            default:
              selectedAnswer = "-1";
          }
        }
        
        return {
          id: question.id,
          response: selectedAnswer
        };
      });

      console.log('Formatted responses:', responses);
      console.log('Sample response details:');
      responses.forEach((resp, idx) => {
        console.log(`Question ${idx + 1}: ID=${resp.id}, Response="${resp.response}"`);
      });
      const result = await quizAPI.submitQuiz(quizId, responses);
      console.log('Quiz submission result:', result);
      console.log('Result type:', typeof result);
      console.log('Result value:', result);
      
      // Ensure we have a valid score
      const score = parseInt(result) || 0;
      console.log('Parsed score:', score);
      
      // Navigate to submit page with score data
      navigate('/submit', {
        state: {
          score: score,
          totalQuestions: questions.length,
          quizId: quizId
        }
      });
      
    } catch (err) {
      console.error('Error submitting quiz:', err);
      setError(`Failed to submit quiz: ${err.message}`);
    } finally {
      setSubmitting(false);
    }
  };

  const handleBackToHome = () => {
    navigate('/');
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading quiz questions...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50">
        <div className="text-center">
          <p className="text-red-600 mb-4">{error}</p>
          <button 
            onClick={fetchQuizQuestions}
            className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  if (questions.length === 0) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50">
        <div className="text-center">
          <p className="text-gray-600 mb-4">No questions found for this quiz.</p>
          <button 
            onClick={handleBackToHome}
            className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
          >
            Back to Home
          </button>
        </div>
      </div>
    );
  }

  const currentQuestion = questions[currentQuestionIndex];
  const hasAnswered = userAnswers[currentQuestionIndex] !== undefined;

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4">
        {/* Quiz Header */}
        <div className="mb-8 text-center">
          <h1 className="text-3xl font-bold text-gray-800 mb-2">
            {quizTitle}
          </h1>
          <p className="text-gray-600">
            Question {currentQuestionIndex + 1} of {questions.length}
          </p>
        </div>

        {/* Question Card */}
        <QuestionCard
          question={{
            questionText: currentQuestion.questionTitle,
            options: [
              currentQuestion.option1,
              currentQuestion.option2,
              currentQuestion.option3,
              currentQuestion.option4
            ].filter(option => option && option.trim() !== '')
          }}
          onAnswer={handleAnswer}
          currentQuestion={currentQuestionIndex + 1}
          totalQuestions={questions.length}
          selectedAnswer={userAnswers[currentQuestionIndex]}
          onNext={handleNext}
          onPrevious={handlePrevious}
          canGoNext={hasAnswered}
          canGoPrevious={currentQuestionIndex > 0}
          isLastQuestion={currentQuestionIndex === questions.length - 1}
          submitting={submitting}
        />

        {/* Progress Indicator */}
        <div className="mt-8 max-w-2xl mx-auto">
          <div className="flex justify-between text-sm text-gray-600 mb-2">
            <span>Progress</span>
            <span>{Math.round(((currentQuestionIndex + 1) / questions.length) * 100)}%</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div 
              className="bg-blue-600 h-2 rounded-full transition-all duration-300"
              style={{ width: `${((currentQuestionIndex + 1) / questions.length) * 100}%` }}
            ></div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Quiz; 