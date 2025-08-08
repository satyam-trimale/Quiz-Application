import React from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import Header from './components/Header';
import Footer from './components/Footer';
import Home from './pages/Home';
import Login from './pages/Login';
import Signup from './pages/Signup';
import QuizList from './pages/QuizList';
import Quiz from './pages/Quiz';
import Submit from './pages/Submit';
import CreateQuiz from './pages/CreateQuiz';
import AdminDashboard from './pages/AdminDashboard';
import StudentDashboard from './pages/StudentDashboard';
import './App.css';

function Layout({ children }) {
  const location = useLocation();
  const hideHeaderFooter = ['/login', '/signup'].includes(location.pathname);
  return (
    <div className="App">
      {!hideHeaderFooter && <Header />}
      {children}
      {!hideHeaderFooter && <Footer />}
    </div>
  );
}

function App() {
  return (
    <Router>
      <Layout>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/admin" element={<AdminDashboard />} />
          <Route path="/student" element={<StudentDashboard />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/quizzes" element={<QuizList />} />
          <Route path="/quiz/:quizId" element={<Quiz />} />
          <Route path="/submit" element={<Submit />} />
          <Route path="/create-quiz" element={<CreateQuiz />} />
        </Routes>
      </Layout>
    </Router>
  );
}

export default App;
