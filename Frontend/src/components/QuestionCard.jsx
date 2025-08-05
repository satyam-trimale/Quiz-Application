import React from 'react';

const QuestionCard = ({ 
  question, 
  onAnswer, 
  currentQuestion, 
  totalQuestions, 
  selectedAnswer,
  onNext,
  onPrevious,
  canGoNext,
  canGoPrevious,
  isLastQuestion,
  submitting
}) => {

  const handleAnswerSelect = (answerIndex) => {
    onAnswer(answerIndex);
  };

  const handleSubmit = () => {
    if (canGoNext) {
      onNext();
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-lg p-6 max-w-2xl mx-auto">
      {/* Progress Bar */}
      <div className="mb-6">
        <div className="flex justify-between items-center mb-2">
          <span className="text-sm text-gray-600">
            Question {currentQuestion} of {totalQuestions}
          </span>
          <span className="text-sm text-gray-600">
            {Math.round((currentQuestion / totalQuestions) * 100)}%
          </span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-2">
          <div 
            className="bg-blue-600 h-2 rounded-full transition-all duration-300"
            style={{ width: `${(currentQuestion / totalQuestions) * 100}%` }}
          ></div>
        </div>
      </div>

      {/* Question */}
      <div className="mb-6">
        <h3 className="text-xl font-semibold text-gray-800 mb-4">
          {question.questionText}
        </h3>
        {question.imageUrl && (
          <img 
            src={question.imageUrl} 
            alt="Question" 
            className="w-full h-48 object-cover rounded-lg mb-4"
          />
        )}
      </div>

      {/* Answer Options */}
      <div className="space-y-3 mb-6">
        {question.options.map((option, index) => (
          <button
            key={index}
            onClick={() => handleAnswerSelect(index)}
            className={`w-full p-4 text-left rounded-lg border-2 transition-all duration-200 ${
              selectedAnswer === index
                ? 'border-blue-500 bg-blue-50 text-blue-700'
                : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
            }`}
          >
            <span className="font-medium mr-3">
              {String.fromCharCode(65 + index)}.
            </span>
            {option}
          </button>
        ))}
      </div>

      {/* Navigation Buttons */}
      <div className="flex justify-between">
        <button
          onClick={onPrevious}
          disabled={!canGoPrevious}
          className={`px-6 py-2 rounded-lg font-medium transition-colors ${
            canGoPrevious
              ? 'text-gray-600 hover:text-gray-800'
              : 'text-gray-400 cursor-not-allowed'
          }`}
        >
          Previous
        </button>
        <button
          onClick={handleSubmit}
          disabled={!canGoNext || submitting}
          className={`px-6 py-2 rounded-lg font-medium transition-colors ${
            canGoNext && !submitting
              ? 'bg-blue-600 hover:bg-blue-700 text-white'
              : 'bg-gray-300 text-gray-500 cursor-not-allowed'
          }`}
        >
          {submitting ? 'Submitting...' : isLastQuestion ? 'Finish Quiz' : 'Next Question'}
        </button>
      </div>
    </div>
  );
};

export default QuestionCard; 