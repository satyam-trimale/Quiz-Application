import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { quizAPI, requireAuth } from '../services/api';

const QuizList = () => {
  const navigate = useNavigate();
  const [quizzes, setQuizzes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [startingQuiz, setStartingQuiz] = useState(false);

  useEffect(() => {
    fetchQuizzes();
  }, []);

  const fetchQuizzes = async () => {
    try {
      setLoading(true);
      setError('');
      
      console.log('Fetching quizzes from backend...');
      const quizList = await quizAPI.getAllQuizzes();
      console.log('Received quizzes:', quizList);
      
      setQuizzes(quizList);
      
    } catch (err) {
      console.error('Error fetching quizzes:', err);
      setError('Failed to load quizzes. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleStartQuiz = async (quiz) => {
    try {
      // Check authentication first
      if (!requireAuth()) {
        return;
      }

      setStartingQuiz(true);
      setError('');
      
      console.log('Starting quiz with ID:', quiz.id);
      
      // Navigate directly to the quiz page with the existing quiz ID
      navigate(`/quiz/${quiz.id}`);
      
    } catch (err) {
      console.error('Error starting quiz:', err);
      setError(`Failed to start quiz: ${err.message}`);
    } finally {
      setStartingQuiz(false);
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
          <p className="text-gray-600">Loading categories...</p>
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
            onClick={fetchQuizzes}
            className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm">
        <div className="container mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
                      <div>
            <h1 className="text-3xl font-bold text-gray-800">Available Quizzes</h1>
            <p className="text-gray-600 mt-2">Choose a quiz to start</p>
          </div>
            <div className="flex space-x-4">
              <button
                onClick={() => navigate('/create-quiz')}
                className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors"
              >
                Create Quiz
              </button>
              <button
                onClick={handleBackToHome}
                className="bg-gray-600 text-white px-4 py-2 rounded-lg hover:bg-gray-700 transition-colors"
              >
                Back to Home
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Quizzes Grid */}
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {quizzes.map((quiz, index) => (
            <div
              key={quiz.id}
              className="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300 overflow-hidden cursor-pointer"
              onClick={() => !startingQuiz && handleStartQuiz(quiz)}
            >
              <div className="p-6">
                <div className="text-4xl mb-4">📝</div>
                <h3 className="text-xl font-semibold text-gray-800 mb-2">
                  {quiz.title}
                </h3>
                <p className="text-gray-600 mb-4">
                  Quiz ID: {quiz.id} • {quiz.questions ? quiz.questions.length : 0} questions
                </p>
                <button 
                  className={`w-full py-2 rounded-lg font-medium transition-colors ${
                    startingQuiz 
                      ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                      : 'bg-blue-600 hover:bg-blue-700 text-white'
                  }`}
                  disabled={startingQuiz}
                >
                  {startingQuiz ? 'Starting Quiz...' : 'Start Quiz'}
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* No Quizzes Message */}
        {quizzes.length === 0 && (
          <div className="text-center py-12">
            <p className="text-gray-600 mb-4">No quizzes available at the moment.</p>
            <button
              onClick={handleBackToHome}
              className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
            >
              Back to Home
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default QuizList; 