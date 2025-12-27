import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { useToast } from '../contexts/ToastContext';
import { FaUserPlus, FaUser } from 'react-icons/fa';

const SignUpUserPage = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
  });
  const [loading, setLoading] = useState(false);
  const { register } = useAuth();
  const { showToast } = useToast();
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (formData.password !== formData.confirmPassword) {
      showToast('Passwords do not match', 'error');
      return;
    }

    if (formData.password.length < 6) {
      showToast('Password must be at least 6 characters', 'error');
      return;
    }

    setLoading(true);

    try {
      const result = await register(
        formData.name,
        formData.email,
        formData.password,
        'user'
      );
      
      if (result.success) {
        showToast(`Welcome, ${result.user.name}! Account created successfully.`, 'success');
        navigate('/dashboard');
      } else {
        showToast(result.error || 'Registration failed', 'error');
      }
    } catch (error) {
      showToast('Registration failed', 'error');
      console.error('Registration error:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-700 via-gray-800 to-gray-900 flex items-center justify-center p-4 relative overflow-hidden">
      <div className="absolute inset-0 bg-grid-pattern opacity-10"></div>
      <div 
        className="absolute inset-0 opacity-20"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.05'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`
        }}
      ></div>
      <div className="bg-white rounded-3xl shadow-2xl w-full max-w-md p-8 md:p-10 relative z-10 animate-fade-in border border-white/20">
        <div className="text-center mb-8">
          <div className="w-20 h-20 bg-gradient-to-br from-gray-700 to-gray-800 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-xl">
            <FaUser className="text-white text-3xl" />
          </div>
          <h1 className="text-4xl font-bold text-gray-900 mb-2 bg-gradient-to-r from-gray-700 via-gray-800 to-gray-900 bg-clip-text text-transparent">
            Create User Account
          </h1>
          <p className="text-gray-600 font-medium text-lg">Join as a User to create maintenance requests</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="label text-gray-700 font-semibold">Full Name</label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              className="input bg-gray-50 focus:bg-white border-gray-300 focus:border-gray-600"
              placeholder="Enter your full name"
              required
            />
          </div>

          <div>
            <label className="label text-gray-700 font-semibold">Email Address</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              className="input bg-gray-50 focus:bg-white border-gray-300 focus:border-gray-600"
              placeholder="Enter your email"
              required
            />
          </div>

          <div>
            <label className="label text-gray-700 font-semibold">Password</label>
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              className="input bg-gray-50 focus:bg-white border-gray-300 focus:border-gray-600"
              placeholder="Enter your password (min 6 characters)"
              required
              minLength={6}
            />
          </div>

          <div>
            <label className="label text-gray-700 font-semibold">Confirm Password</label>
            <input
              type="password"
              name="confirmPassword"
              value={formData.confirmPassword}
              onChange={handleChange}
              className="input bg-gray-50 focus:bg-white border-gray-300 focus:border-gray-600"
              placeholder="Confirm your password"
              required
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full btn btn-primary flex items-center justify-center gap-2 py-3 text-base font-semibold shadow-lg hover:shadow-xl transition-all"
          >
            <FaUserPlus />
            {loading ? 'Creating Account...' : 'Sign Up as User'}
          </button>
        </form>

        <div className="mt-8 pt-6 border-t border-gray-200 text-center">
          <p className="text-gray-600 mb-2">
            Already have an account?{' '}
            <Link to="/login" className="text-gray-700 hover:text-gray-900 font-semibold hover:underline transition-colors">
              Login
            </Link>
          </p>
          <p className="text-sm text-gray-500">
            Are you a technician?{' '}
            <Link to="/signup/technician" className="text-gray-700 hover:text-gray-900 font-semibold hover:underline">
              Sign up as Technician
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default SignUpUserPage;

