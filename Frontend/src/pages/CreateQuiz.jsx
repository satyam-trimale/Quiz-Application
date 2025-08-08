import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { quizAPI, requireAdmin } from '../services/api';

const CreateQuiz = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    title: '',
    questions: [
      { questionTitle: '', option1: '', option2: '', option3: '', option4: '', rightAnswer: '', difficultyLevel: '', category: '' }
    ]
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  // Categories are free-text per question now; no dropdown state

  useEffect(() => {
    if (!requireAdmin()) return;
  }, []);

  // No category fetching needed

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleQuestionChange = (index, field, value) => {
    setFormData(prev => {
      const updated = [...prev.questions];
      updated[index] = { ...updated[index], [field]: value };
      return { ...prev, questions: updated };
    });
  };

  const addQuestion = () => {
    setFormData(prev => ({
      ...prev,
      questions: [...prev.questions, { questionTitle: '', option1: '', option2: '', option3: '', option4: '', rightAnswer: '', difficultyLevel: '', category: '' }]
    }));
  };

  const removeQuestion = (index) => {
    setFormData(prev => ({
      ...prev,
      questions: prev.questions.filter((_, i) => i !== index)
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      setLoading(true);
      setError('');
      setSuccess('');

      if (!formData.title.trim()) {
        setError('Please enter a quiz title');
        return;
      }
      if (formData.questions.length === 0) {
        setError('Please add at least one question');
        return;
      }

      console.log('Creating quiz with full data:', formData);
      const result = await quizAPI.createFullQuiz(formData);

      console.log('Quiz creation result:', result);

      setSuccess('Quiz created successfully!');
      
      // Reset form
      setFormData({ title: '', questions: [{ questionTitle: '', option1: '', option2: '', option3: '', option4: '', rightAnswer: '', difficultyLevel: '', category: '' }] });

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
          <p className="text-gray-600">Build a custom quiz by adding your own questions</p>
        </div>

        {/* Form */}
        <div className="max-w-2xl mx-auto">
          <div className="bg-white rounded-lg shadow-lg p-8">
            <form onSubmit={handleSubmit} className="space-y-6">
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

              {/* Questions Builder */}
              <div className="space-y-6">
                <h2 className="text-lg font-semibold text-gray-800">Questions</h2>
                {formData.questions.map((q, idx) => (
                  <div key={idx} className="border border-gray-200 rounded-lg p-4 space-y-3">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Question *</label>
                      <textarea
                        value={q.questionTitle}
                        onChange={(e) => handleQuestionChange(idx, 'questionTitle', e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                        rows={2}
                        required
                      />
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      <input placeholder="Option A" value={q.option1} onChange={(e) => handleQuestionChange(idx, 'option1', e.target.value)} className="px-3 py-2 border border-gray-300 rounded-lg" />
                      <input placeholder="Option B" value={q.option2} onChange={(e) => handleQuestionChange(idx, 'option2', e.target.value)} className="px-3 py-2 border border-gray-300 rounded-lg" />
                      <input placeholder="Option C" value={q.option3} onChange={(e) => handleQuestionChange(idx, 'option3', e.target.value)} className="px-3 py-2 border border-gray-300 rounded-lg" />
                      <input placeholder="Option D" value={q.option4} onChange={(e) => handleQuestionChange(idx, 'option4', e.target.value)} className="px-3 py-2 border border-gray-300 rounded-lg" />
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                      <input placeholder="Correct Answer (paste exact option text)" value={q.rightAnswer} onChange={(e) => handleQuestionChange(idx, 'rightAnswer', e.target.value)} className="px-3 py-2 border border-gray-300 rounded-lg" />
                      <input placeholder="Difficulty" value={q.difficultyLevel} onChange={(e) => handleQuestionChange(idx, 'difficultyLevel', e.target.value)} className="px-3 py-2 border border-gray-300 rounded-lg" />
                      <input placeholder="Category (free text)" value={q.category} onChange={(e) => handleQuestionChange(idx, 'category', e.target.value)} className="px-3 py-2 border border-gray-300 rounded-lg" />
                    </div>
                    {formData.questions.length > 1 && (
                      <div className="text-right">
                        <button type="button" onClick={() => removeQuestion(idx)} className="text-red-600 hover:underline">Remove</button>
                      </div>
                    )}
                  </div>
                ))}
                <button type="button" onClick={addQuestion} className="px-4 py-2 bg-gray-100 border rounded-lg hover:bg-gray-200">Add another question</button>
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
                  disabled={loading}
                  className={`flex-1 py-3 px-4 rounded-lg font-semibold text-white transition-colors ${
                    loading ? 'bg-gray-400 cursor-not-allowed' : 'bg-blue-600 hover:bg-blue-700'
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
              <li>• Enter a quiz title</li>
              <li>• Add as many questions as you need with options and the correct answer</li>
              <li>• Optionally set difficulty and category (free text)</li>
              <li>• Save to create the quiz</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CreateQuiz; 