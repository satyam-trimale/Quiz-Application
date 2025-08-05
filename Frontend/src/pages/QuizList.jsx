import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { quizAPI, questionAPI, requireAuth } from '../services/api';

const QuizList = () => {
  const navigate = useNavigate();
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [creatingQuiz, setCreatingQuiz] = useState(false);

  // Category descriptions and icons - you can modify these based on your needs
  const categoryInfo = {
    'Programming': { description: 'Test your programming knowledge', icon: '💻' },
    'Mathematics': { description: 'Challenge your math skills', icon: '📐' },
    'Science': { description: 'Explore scientific concepts', icon: '🔬' },
    'History': { description: 'Journey through historical events', icon: '📚' },
    'Geography': { description: 'Discover the world around you', icon: '🌍' },
    'Literature': { description: 'Dive into classic and modern literature', icon: '📖' },
    'Technology': { description: 'Learn about modern technology', icon: '⚡' },
    'Sports': { description: 'Test your sports knowledge', icon: '⚽' },
    'Music': { description: 'Explore music theory and history', icon: '🎵' },
    'General Knowledge': { description: 'Test your general knowledge', icon: '🧠' }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      setLoading(true);
      setError('');
      
      console.log('Fetching categories from backend...');
      const categoryNames = await questionAPI.getAllCategories();
      console.log('Received categories:', categoryNames);
      
      // Transform category names into objects with descriptions and icons
      const categoriesWithInfo = categoryNames.map(categoryName => ({
        name: categoryName,
        description: categoryInfo[categoryName]?.description || `Test your knowledge of ${categoryName}`,
        icon: categoryInfo[categoryName]?.icon || '📝'
      }));
      
      console.log('Processed categories:', categoriesWithInfo);
      setCategories(categoriesWithInfo);
      
    } catch (err) {
      console.error('Error fetching categories:', err);
      setError('Failed to load categories. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleStartQuiz = async (category) => {
    try {
      // Check authentication first
      if (!requireAuth()) {
        return;
      }

      setCreatingQuiz(true);
      setError('');
      
      console.log('Creating quiz for category:', category.name);
      
      // Create a quiz for this category
      const quizTitle = `${category.name} Quiz`;
      const numQuestions = 10; // You can make this configurable
      
      const createResponse = await quizAPI.createQuiz(category.name, numQuestions, quizTitle);
      console.log('Quiz created, response:', createResponse);
      
      // Extract quiz ID from response
      let quizId;
      if (typeof createResponse === 'string') {
        quizId = createResponse;
      } else if (createResponse && createResponse.id) {
        quizId = createResponse.id;
      } else {
        throw new Error('Invalid quiz creation response');
      }
      
      console.log('Extracted quiz ID:', quizId);
      
      // Navigate to the quiz page with the quiz ID
      navigate(`/quiz/${quizId}`);
      
    } catch (err) {
      console.error('Error creating quiz:', err);
      setError(`Failed to create quiz: ${err.message}`);
    } finally {
      setCreatingQuiz(false);
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
            onClick={fetchCategories}
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
              <p className="text-gray-600 mt-2">Choose a category to start your quiz</p>
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

      {/* Categories Grid */}
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {categories.map((category, index) => (
            <div
              key={index}
              className="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300 overflow-hidden cursor-pointer"
              onClick={() => !creatingQuiz && handleStartQuiz(category)}
            >
              <div className="p-6">
                <div className="text-4xl mb-4">{category.icon}</div>
                <h3 className="text-xl font-semibold text-gray-800 mb-2">
                  {category.name}
                </h3>
                <p className="text-gray-600 mb-4">
                  {category.description}
                </p>
                <button 
                  className={`w-full py-2 rounded-lg font-medium transition-colors ${
                    creatingQuiz 
                      ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                      : 'bg-blue-600 hover:bg-blue-700 text-white'
                  }`}
                  disabled={creatingQuiz}
                >
                  {creatingQuiz ? 'Creating Quiz...' : 'Start Quiz'}
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* No Categories Message */}
        {categories.length === 0 && (
          <div className="text-center py-12">
            <p className="text-gray-600 mb-4">No quiz categories available at the moment.</p>
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