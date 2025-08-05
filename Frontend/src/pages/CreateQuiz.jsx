import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { quizAPI, questionAPI, requireAuth } from '../services/api';

const CreateQuiz = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    category: '',
    numQ: 5,
    title: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [availableCategories, setAvailableCategories] = useState([]);
  const [loadingCategories, setLoadingCategories] = useState(true);

  useEffect(() => {
    // Check authentication first
    if (!requireAuth()) {
      return;
    }
    
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      setLoadingCategories(true);
      console.log('Fetching categories for create quiz...');
      const categories = await questionAPI.getAllCategories();
      console.log('Available categories:', categories);
      setAvailableCategories(categories);
    } catch (err) {
      console.error('Error fetching categories:', err);
      setError('Failed to load categories. Please try again.');
    } finally {
      setLoadingCategories(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      setLoading(true);
      setError('');
      setSuccess('');

      // Validate form data
      if (!formData.category.trim()) {
        setError('Please select a category');
        return;
      }

      if (!formData.title.trim()) {
        setError('Please enter a quiz title');
        return;
      }

      if (formData.numQ < 1 || formData.numQ > 50) {
        setError('Number of questions must be between 1 and 50');
        return;
      }

      console.log('Creating quiz with data:', formData);

      // Create the quiz
      const result = await quizAPI.createQuiz(
        formData.category,
        parseInt(formData.numQ),
        formData.title
      );

      console.log('Quiz creation result:', result);

      setSuccess('Quiz created successfully!');
      
      // Reset form
      setFormData({
        category: '',
        numQ: 5,
        title: ''
      });

      // Optionally navigate to quiz list after a short delay
      setTimeout(() => {
        navigate('/quizzes');
      }, 2000);

    } catch (err) {
      console.error('Error creating quiz:', err);
      setError(`Failed to create quiz: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  const handleBackToQuizzes = () => {
    navigate('/quizzes');
  };

  const handleBackToHome = () => {
    navigate('/');
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="mb-8 text-center">
          <h1 className="text-3xl font-bold text-gray-800 mb-2">Create New Quiz</h1>
          <p className="text-gray-600">Create a custom quiz from existing questions in the database</p>
        </div>

        {/* Form */}
        <div className="max-w-2xl mx-auto">
          <div className="bg-white rounded-lg shadow-lg p-8">
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Category Selection */}
              <div>
                <label htmlFor="category" className="block text-sm font-medium text-gray-700 mb-2">
                  Quiz Category *
                </label>
                <select
                  id="category"
                  name="category"
                  value={formData.category}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  required
                  disabled={loadingCategories}
                >
                  <option value="">
                    {loadingCategories ? 'Loading categories...' : 'Select a category'}
                  </option>
                  {availableCategories.map((category, index) => (
                    <option key={index} value={category}>
                      {category}
                    </option>
                  ))}
                </select>
                {loadingCategories && (
                  <p className="text-sm text-gray-500 mt-1">Loading available categories...</p>
                )}
              </div>

              {/* Number of Questions */}
              <div>
                <label htmlFor="numQ" className="block text-sm font-medium text-gray-700 mb-2">
                  Number of Questions *
                </label>
                <input
                  type="number"
                  id="numQ"
                  name="numQ"
                  min="1"
                  max="50"
                  value={formData.numQ}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  required
                />
                <p className="text-sm text-gray-500 mt-1">Choose between 1 and 50 questions</p>
              </div>

              {/* Quiz Title */}
              <div>
                <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-2">
                  Quiz Title *
                </label>
                <input
                  type="text"
                  id="title"
                  name="title"
                  value={formData.title}
                  onChange={handleInputChange}
                  placeholder="Enter a descriptive title for your quiz"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  required
                />
              </div>

              {/* Error Message */}
              {error && (
                <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
                  {error}
                </div>
              )}

              {/* Success Message */}
              {success && (
                <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-lg">
                  {success}
                </div>
              )}

              {/* Action Buttons */}
              <div className="flex space-x-4 pt-4">
                <button
                  type="submit"
                  disabled={loading || loadingCategories}
                  className={`flex-1 py-3 px-4 rounded-lg font-semibold text-white transition-colors ${
                    loading || loadingCategories
                      ? 'bg-gray-400 cursor-not-allowed'
                      : 'bg-blue-600 hover:bg-blue-700'
                  }`}
                >
                  {loading ? 'Creating Quiz...' : 'Create Quiz'}
                </button>
                
                <button
                  type="button"
                  onClick={handleBackToQuizzes}
                  className="flex-1 py-3 px-4 bg-gray-600 text-white rounded-lg font-semibold hover:bg-gray-700 transition-colors"
                >
                  Back to Quizzes
                </button>
              </div>

              <div className="text-center">
                <button
                  type="button"
                  onClick={handleBackToHome}
                  className="text-blue-600 hover:text-blue-800 font-medium"
                >
                  Back to Home
                </button>
              </div>
            </form>
          </div>

          {/* Info Section */}
          <div className="mt-8 bg-blue-50 border border-blue-200 rounded-lg p-6">
            <h3 className="text-lg font-semibold text-blue-800 mb-3">How it works:</h3>
            <ul className="text-blue-700 space-y-2">
              <li>• Select a category to choose questions from that topic</li>
              <li>• Specify the number of questions you want in your quiz</li>
              <li>• Give your quiz a descriptive title</li>
              <li>• Questions will be randomly selected from the database</li>
              <li>• After creation, you can take the quiz immediately</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CreateQuiz; 