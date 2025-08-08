import React from 'react';
import { useNavigate } from 'react-router-dom';
import QuizCard from '../components/QuizCard';
import { isAdmin } from '../services/api';

const Home = () => {
  const navigate = useNavigate();
  const admin = isAdmin();
  
  // Mock data for featured quizzes
  const featuredQuizzes = [
    {
      id: 1,
      title: "JavaScript Fundamentals",
      description: "Test your knowledge of JavaScript basics including variables, functions, and control structures.",
      category: "Programming",
      questionCount: 20,
      timeLimit: 30,
      difficulty: "Beginner",
      participants: 1250
    },
    {
      id: 2,
      title: "React Hooks Mastery",
      description: "Advanced React concepts focusing on hooks, state management, and component lifecycle.",
      category: "Frontend",
      questionCount: 15,
      timeLimit: 25,
      difficulty: "Intermediate",
      participants: 890
    },
    {
      id: 3,
      title: "Data Structures & Algorithms",
      description: "Challenge yourself with complex data structures and algorithmic problem solving.",
      category: "Computer Science",
      questionCount: 25,
      timeLimit: 45,
      difficulty: "Advanced",
      participants: 567
    }
  ];

  const handleStartQuiz = (quizId) => {
    console.log(`Starting quiz with ID: ${quizId}`);
    // Navigate to quiz list page
    navigate('/quizzes');
  };

  const handleBrowseQuizzes = () => {
    navigate('/quizzes');
  };

  const handleStartLearning = () => {
    navigate('/quizzes');
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-blue-600 to-purple-600 text-white py-20">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-5xl font-bold mb-6">
            Test Your Knowledge
          </h1>
          <p className="text-xl mb-8 max-w-2xl mx-auto">
            Challenge yourself with our interactive quizzes. Learn, compete, and track your progress across various topics.
          </p>
          <div className="flex justify-center space-x-4">
            <button 
              onClick={handleStartLearning}
              className="bg-white text-blue-600 px-8 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-colors"
            >
              Start Learning
            </button>
            <button 
              onClick={handleBrowseQuizzes}
              className="border-2 border-white text-white px-8 py-3 rounded-lg font-semibold hover:bg-white hover:text-blue-600 transition-colors"
            >
              Browse Quizzes
            </button>
            {admin && (
              <button 
                onClick={() => navigate('/create-quiz')}
                className="bg-green-600 text-white px-8 py-3 rounded-lg font-semibold hover:bg-green-700 transition-colors"
              >
                Create Quiz
              </button>
            )}
          </div>
        </div>
      </section>

      {/* Featured Quizzes Section */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-800 mb-4">
              Featured Quizzes
            </h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Explore our most popular quizzes and start your learning journey today.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {featuredQuizzes.map((quiz) => (
              <QuizCard
                key={quiz.id}
                quiz={quiz}
                onStartQuiz={handleStartQuiz}
              />
            ))}
          </div>

          <div className="text-center mt-12">
            <button 
              onClick={handleBrowseQuizzes}
              className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 rounded-lg font-semibold transition-colors"
            >
              View All Quizzes
            </button>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="bg-white py-16">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
            <div>
              <div className="text-4xl font-bold text-blue-600 mb-2">500+</div>
              <div className="text-gray-600">Available Quizzes</div>
            </div>
            <div>
              <div className="text-4xl font-bold text-blue-600 mb-2">50K+</div>
              <div className="text-gray-600">Active Users</div>
            </div>
            <div>
              <div className="text-4xl font-bold text-blue-600 mb-2">1M+</div>
              <div className="text-gray-600">Quizzes Completed</div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home; 