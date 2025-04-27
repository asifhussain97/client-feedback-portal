import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import './index.css';

import AuthPage from './pages/AuthPage';
import AdminDashboard from './pages/AdminDashboard';
import FeedbackHistory from './pages/FeedbackHistory';
import FeedbackPage from './pages/FeedbackPage';

import PrivateRoute from './components/PrivateRoute';
import Navbar from './components/Navbar';

const App = () => {
  return (
    <Router>
      <Routes>
        {/* Public Routes */}
        <Route path="/auth" element={<AuthPage />} />

        {/* Protected Routes */}
        <Route path="/admin" element={<PrivateRoute requiredRole="admin"> <Navbar /><AdminDashboard /></PrivateRoute>} />
        <Route path="/" element={<PrivateRoute requiredRole="client">  <Navbar /><FeedbackHistory /></PrivateRoute>} />
        <Route path="/feedback" element={<PrivateRoute requiredRole="client"> <Navbar /><FeedbackPage /></PrivateRoute>} />
      </Routes>
    </Router>
  );
};

export default App;
