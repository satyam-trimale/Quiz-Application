const API_BASE_URL = 'http://localhost:8080/api';

// Get token from localStorage
const getAuthToken = () => {
  return localStorage.getItem('token');
};

// Check if user is authenticated
export const isAuthenticated = () => {
  const token = getAuthToken();
  return !!token;
};

// Redirect to login if not authenticated
export const requireAuth = () => {
  if (!isAuthenticated()) {
    window.location.href = '/login';
    return false;
  }
  return true;
};

// Generic API request function
const apiRequest = async (endpoint, options = {}) => {
  const url = `${API_BASE_URL}${endpoint}`;
  const token = getAuthToken();
  
  const config = {
    headers: {
      'Content-Type': 'application/json',
      ...options.headers,
    },
    ...options,
  };

  // Add Authorization header if token exists
  if (token) {
    config.headers['Authorization'] = `Bearer ${token}`;
  }

  try {
    console.log('Making API request to:', url);
    console.log('Request config:', config);
    
    const response = await fetch(url, config);
    
    console.log('Response status:', response.status);
    console.log('Response headers:', Object.fromEntries(response.headers.entries()));
    
    if (!response.ok) {
      const errorText = await response.text();
      console.error('Response error text:', errorText);
      throw new Error(`HTTP error! status: ${response.status}, message: ${errorText}`);
    }
    
    // Check if response has content before trying to parse JSON
    const contentType = response.headers.get('content-type');
    console.log('Content-Type:', contentType);
    
    if (contentType && contentType.includes('application/json')) {
      const jsonData = await response.json();
      console.log('JSON response:', jsonData);
      return jsonData;
    } else {
      // For non-JSON responses (like plain text), return the text
      const textData = await response.text();
      console.log('Text response:', textData);
      return textData;
    }
  } catch (error) {
    console.error('API request failed for URL:', url);
    console.error('Error details:', error);
    throw error;
  }
};

// Auth API calls
export const authAPI = {
  login: (credentials) => 
    apiRequest('/auth/login', {
      method: 'POST',
      body: JSON.stringify(credentials),
    }),
  
  register: (userData) => 
    apiRequest('/auth/register', {
      method: 'POST',
      body: JSON.stringify(userData),
    }),
  
  logout: () => 
    apiRequest('/auth/logout', {
      method: 'POST',
    }),
};

// Quiz API calls
export const quizAPI = {
  createQuiz: (category, numQ, title) => {
    const params = new URLSearchParams({
      category: category,
      numQ: numQ.toString(),
      title: title
    });
    console.log('Creating quiz with params:', params.toString());
    return apiRequest(`/quiz/create?${params}`, {
      method: 'POST',
    });
  },
  
  getQuizQuestions: (quizId) => {
    console.log('Getting quiz questions for ID:', quizId);
    return apiRequest(`/quiz/get/${quizId}`);
  },
  
  submitQuiz: (quizId, responses) => {
    console.log('Submitting quiz with ID:', quizId);
    console.log('Responses:', responses);
    console.log('Responses JSON:', JSON.stringify(responses));
    return apiRequest(`/quiz/submit/${quizId}`, {
      method: 'POST',
      body: JSON.stringify(responses),
    });
  },
};

// Question API calls
export const questionAPI = {
  getAllQuestions: () => 
    apiRequest('/question/allQuestions'),
  
  getQuestionsByCategory: (category) => 
    apiRequest(`/question/category/${category}`),
  
  getAllCategories: () => 
    apiRequest('/question/categories'),
  
  getQuestionById: (questionId) => 
    apiRequest(`/question/get/${questionId}`),
  
  createQuestion: (questionData) => 
    apiRequest('/question/add', {
      method: 'POST',
      body: JSON.stringify(questionData),
    }),
  
  updateQuestion: (questionId, questionData) => 
    apiRequest(`/question/update/${questionId}`, {
      method: 'PUT',
      body: JSON.stringify(questionData),
    }),
  
  deleteQuestion: (questionId) => 
    apiRequest(`/question/delete/${questionId}`, {
      method: 'DELETE',
    }),
};

// User API calls
export const userAPI = {
  getProfile: () => 
    apiRequest('/user/profile'),
  
  updateProfile: (userData) => 
    apiRequest('/user/update', {
      method: 'PUT',
      body: JSON.stringify(userData),
    }),
  
  getQuizHistory: () => 
    apiRequest('/user/quiz-history'),
  
  getLeaderboard: () => 
    apiRequest('/user/leaderboard'),
};

export default {
  auth: authAPI,
  quiz: quizAPI,
  question: questionAPI,
  user: userAPI,
}; 