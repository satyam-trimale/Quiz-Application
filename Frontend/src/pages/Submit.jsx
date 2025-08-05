import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';

const Submit = () => {
  const navigate = useNavigate();
  const location = useLocation();
  
  // Get score and total questions from location state
  const { score, totalQuestions, quizId } = location.state || {};
  
  console.log('Submit component - location.state:', location.state);
  console.log('Submit component - score:', score);
  console.log('Submit component - totalQuestions:', totalQuestions);
  console.log('Submit component - quizId:', quizId);

  const handleRetake = () => {
    // Navigate back to the quiz page to retake
    navigate(`/quiz/${quizId}`);
  };

  const handleBackToHome = () => {
    navigate('/');
  };

  const handleBackToQuizzes = () => {
    navigate('/quizzes');
  };

  // If no score data, redirect to home
  if (!score && !totalQuestions) {
    console.log('No score data found, redirecting to home');
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50">
        <div className="text-center">
          <p className="text-gray-600 mb-4">No quiz results found.</p>
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

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-50">
      <div className="bg-white rounded-lg shadow-lg p-8 max-w-md w-full text-center">
        <h2 className="text-3xl font-bold text-gray-800 mb-4">Quiz Completed!</h2>
        
        {/* Score Display */}
        <div className="mb-6">
          <div className="text-6xl font-bold text-blue-600 mb-2">{score}</div>
          <p className="text-gray-600">out of {totalQuestions}</p>
        </div>

        {/* Percentage */}
        <div className="mb-6">
          <div className="text-2xl font-semibold text-gray-700">
            {Math.round((score / totalQuestions) * 100)}%
          </div>
          <p className="text-sm text-gray-500">Success Rate</p>
        </div>

        {/* Performance Message */}
        <div className="mb-8">
          {score === totalQuestions ? (
            <p className="text-green-600 font-semibold">Perfect Score! 🎉</p>
          ) : score >= totalQuestions * 0.8 ? (
            <p className="text-blue-600 font-semibold">Excellent! Well done! 👏</p>
          ) : score >= totalQuestions * 0.6 ? (
            <p className="text-yellow-600 font-semibold">Good job! Keep practicing! 💪</p>
          ) : (
            <p className="text-orange-600 font-semibold">Keep learning! You can do better! 📚</p>
          )}
        </div>

        {/* Action Buttons */}
        <div className="space-y-3">
          <button 
            onClick={handleRetake}
            className="w-full bg-blue-600 text-white py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors"
          >
            Retake Quiz
          </button>
          <button 
            onClick={handleBackToQuizzes}
            className="w-full bg-green-600 text-white py-3 rounded-lg font-semibold hover:bg-green-700 transition-colors"
          >
            Try Another Quiz
          </button>
          <button 
            onClick={handleBackToHome}
            className="w-full bg-gray-600 text-white py-3 rounded-lg font-semibold hover:bg-gray-700 transition-colors"
          >
            Back to Home
          </button>
        </div>
      </div>
    </div>
  );
};

export default Submit; 