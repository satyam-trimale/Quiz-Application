import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { requireAuth } from '../services/api';

const StudentDashboard = () => {
  const navigate = useNavigate();

  useEffect(() => {
    requireAuth();
  }, []);

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="container mx-auto px-4">
        <div className="bg-white rounded-lg shadow-md p-8 max-w-3xl mx-auto">
          <h1 className="text-3xl font-bold text-gray-800 mb-6">Student Dashboard</h1>
          <p className="text-gray-600 mb-8">Browse and attempt quizzes.</p>

          <div className="grid grid-cols-1 gap-4">
            <button
              onClick={() => navigate('/quizzes')}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-lg font-semibold transition-colors"
            >
              Browse Quizzes
            </button>
          </div>

          <div className="mt-8 text-center">
            <button
              onClick={() => navigate('/')}
              className="text-blue-600 hover:text-blue-800 font-medium"
            >
              Back to Home
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StudentDashboard;


