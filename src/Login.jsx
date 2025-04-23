import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { apiService } from './services/api';
import '../Style/Login.css';

const Login = () => {
  const [activeTab, setActiveTab] = useState('user');
  const [userCredentials, setUserCredentials] = useState({ email: '', password: '' });
  const [adminCredentials, setAdminCredentials] = useState({ username: '', password: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  
  const navigate = useNavigate();

  const handleUserInputChange = (e) => {
    const { name, value } = e.target;
    setUserCredentials(prev => ({ ...prev, [name]: value }));
  };

  const handleAdminInputChange = (e) => {
    const { name, value } = e.target;
    setAdminCredentials(prev => ({ ...prev, [name]: value }));
  };

  const handleUserLogin = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const response = await apiService.login(userCredentials);
      
      if (!response.success) {
        throw new Error(response.message || 'Login failed');
      }
      
      // Store user info in localStorage or sessionStorage for persistence
      localStorage.setItem('user', JSON.stringify(response.user));
      
      // Redirect to dashboard
      navigate('/dashboard');
    } catch (err) {
      setError(err.message || 'Login failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleAdminLogin = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const response = await apiService.login(adminCredentials);
      
      if (!response.success) {
        throw new Error(response.message || 'Login failed');
      }
      
      if (response.user.role !== 'admin') {
        throw new Error('Access denied. Admin privileges required.');
      }
      
      // Store admin info in localStorage or sessionStorage for persistence
      localStorage.setItem('user', JSON.stringify(response.user));
      
      // Redirect to admin panel
      navigate('/admin');
    } catch (err) {
      setError(err.message || 'Login failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-container">
      <div className="login-card">
        <div className="app-title">
          <h1>Kachi Dham Traffic Management</h1>
          <p>Login to access the traffic management system</p>
        </div>
        
        <div className="login-tabs">
          <button 
            className={`tab-btn ${activeTab === 'user' ? 'active' : ''}`}
            onClick={() => setActiveTab('user')}
          >
            User Login
          </button>
          <button 
            className={`tab-btn ${activeTab === 'admin' ? 'active' : ''}`}
            onClick={() => setActiveTab('admin')}
          >
            Admin Login
          </button>
        </div>
        
        <div className="tab-content">
          {activeTab === 'user' ? (
            <form onSubmit={handleUserLogin} className="login-form">
              <div className="form-group">
                <label htmlFor="user-email">Email</label>
                <input
                  type="email"
                  id="user-email"
                  name="email"
                  value={userCredentials.email}
                  onChange={handleUserInputChange}
                  placeholder="Enter your email"
                  required
                />
              </div>
              
              <div className="form-group">
                <label htmlFor="user-password">Password</label>
                <input
                  type="password"
                  id="user-password"
                  name="password"
                  value={userCredentials.password}
                  onChange={handleUserInputChange}
                  placeholder="Enter your password"
                  required
                />
              </div>
              
              <div className="form-options">
                <label className="remember-me">
                  <input type="checkbox" />
                  <span>Remember me</span>
                </label>
                <a href="/forgot-password" className="forgot-password">Forgot Password?</a>
              </div>
              
              <button 
                type="submit" 
                className="login-btn"
                disabled={loading}
              >
                {loading ? 'Logging in...' : 'Login as User'}
              </button>
              
              <div className="register-option">
                <span>Don't have an account?</span>
                <a href="/register">Register</a>
              </div>
            </form>
          ) : (
            <form onSubmit={handleAdminLogin} className="login-form admin-form">
              <div className="form-group">
                <label htmlFor="admin-username">Username</label>
                <input
                  type="text"
                  id="admin-username"
                  name="username"
                  value={adminCredentials.username}
                  onChange={handleAdminInputChange}
                  placeholder="Enter your username"
                  required
                />
              </div>
              
              <div className="form-group">
                <label htmlFor="admin-password">Password</label>
                <input
                  type="password"
                  id="admin-password"
                  name="password"
                  value={adminCredentials.password}
                  onChange={handleAdminInputChange}
                  placeholder="Enter your password"
                  required
                />
              </div>
              
              <div className="form-options">
                <label className="remember-me">
                  <input type="checkbox" />
                  <span>Remember me</span>
                </label>
                <a href="/admin/forgot-password" className="forgot-password">Forgot Password?</a>
              </div>
              
              <button 
                type="submit" 
                className="login-btn admin-login-btn"
                disabled={loading}
              >
                {loading ? 'Logging in...' : 'Login as Admin'}
              </button>
              
              <div className="contact-admin">
                <p>Need admin access? <a href="/contact-admin">Contact administrator</a></p>
              </div>
            </form>
          )}
          
          {error && <div className="error-message">{error}</div>}
        </div>
      </div>
    </div>
  );
};

export default Login;