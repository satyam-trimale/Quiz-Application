import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { isAuthenticated } from '../services/api';

const Header = () => {
  const navigate = useNavigate();
  const isLoggedIn = isAuthenticated();

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    navigate('/login');
  };

  return (
    <header className="bg-blue-600 text-white shadow-lg">
      <div className="container mx-auto px-4 py-4">
        <div className="flex justify-between items-center">
          <div className="flex items-center space-x-2">
            <Link to="/" className="text-2xl font-bold hover:text-blue-200 transition-colors">
              QuizApp
            </Link>
            <span className="text-blue-200">|</span>
            <span className="text-blue-100">Test Your Knowledge</span>
          </div>
          <nav className="hidden md:flex space-x-6">
            <Link to="/" className="hover:text-blue-200 transition-colors">Home</Link>
            <Link to="/quizzes" className="hover:text-blue-200 transition-colors">Quizzes</Link>
            <Link to="/create-quiz" className="hover:text-blue-200 transition-colors">Create Quiz</Link>
            <a href="/leaderboard" className="hover:text-blue-200 transition-colors">Leaderboard</a>
            <a href="/profile" className="hover:text-blue-200 transition-colors">Profile</a>
          </nav>
          <div className="flex items-center space-x-4">
            {isLoggedIn ? (
              <button 
                onClick={handleLogout}
                className="bg-red-600 hover:bg-red-700 px-4 py-2 rounded-lg transition-colors"
              >
                Logout
              </button>
            ) : (
              <>
                <Link 
                  to="/login"
                  className="bg-blue-700 hover:bg-blue-800 px-4 py-2 rounded-lg transition-colors"
                >
                  Login
                </Link>
                <Link 
                  to="/signup"
                  className="bg-white text-blue-600 hover:bg-blue-50 px-4 py-2 rounded-lg transition-colors"
                >
                  Sign Up
                </Link>
              </>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header; 