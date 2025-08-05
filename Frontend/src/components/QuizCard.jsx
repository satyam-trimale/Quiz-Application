import React from 'react';

const QuizCard = ({ quiz, onStartQuiz }) => {
  return (
    <div className="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300 overflow-hidden">
      <div className="p-6">
        <div className="flex justify-between items-start mb-4">
          <h3 className="text-xl font-semibold text-gray-800">{quiz.title}</h3>
          <span className="bg-blue-100 text-blue-800 text-xs font-medium px-2.5 py-0.5 rounded">
            {quiz.category}
          </span>
        </div>
        
        <p className="text-gray-600 mb-4 line-clamp-2">{quiz.description}</p>
        
        <div className="flex items-center justify-between text-sm text-gray-500 mb-4">
          <div className="flex items-center space-x-4">
            <span>📝 {quiz.questionCount} questions</span>
            <span>⏱️ {quiz.timeLimit} min</span>
          </div>
          <div className="flex items-center space-x-2">
            <span>⭐ {quiz.difficulty}</span>
          </div>
        </div>
        
        <div className="flex items-center justify-between">
          <div className="text-sm text-gray-500">
            <span>👥 {quiz.participants} participants</span>
          </div>
          <button
            onClick={() => onStartQuiz(quiz.id)}
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-colors font-medium"
          >
            Start Quiz
          </button>
        </div>
      </div>
    </div>
  );
};

export default QuizCard; 