import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import Footer from '../components/layout/Footer';
import { 
  FaTools, 
  FaUserTie, 
  FaUsers, 
  FaChartLine, 
  FaCalendarAlt, 
  FaCheckCircle,
  FaArrowRight,
  FaShieldAlt,
  FaClock,
  FaBell
} from 'react-icons/fa';

const HomePage = () => {
  const { user } = useAuth();

  const features = [
    {
      icon: FaTools,
      title: 'Maintenance Management',
      description: 'Streamline your equipment maintenance requests and track their progress in real-time.',
      color: 'from-blue-500 to-blue-600',
    },
    {
      icon: FaUserTie,
      title: 'Manager Dashboard',
      description: 'Approve requests, assign teams, and monitor all maintenance activities from one place.',
      color: 'from-purple-500 to-purple-600',
    },
    {
      icon: FaUsers,
      title: 'Team Collaboration',
      description: 'Work seamlessly with your technical teams and track task assignments efficiently.',
      color: 'from-green-500 to-green-600',
    },
    {
      icon: FaChartLine,
      title: 'Analytics & Reports',
      description: 'Get insights into maintenance patterns and equipment performance metrics.',
      color: 'from-orange-500 to-orange-600',
    },
    {
      icon: FaCalendarAlt,
      title: 'Schedule Management',
      description: 'Plan and schedule maintenance tasks with our intuitive calendar interface.',
      color: 'from-pink-500 to-pink-600',
    },
    {
      icon: FaCheckCircle,
      title: 'Status Tracking',
      description: 'Track request status through Kanban boards and real-time updates.',
      color: 'from-indigo-500 to-indigo-600',
    },
  ];

  const benefits = [
    {
      icon: FaShieldAlt,
      title: 'Secure & Reliable',
      description: 'Your data is protected with enterprise-grade security.',
    },
    {
      icon: FaClock,
      title: 'Real-time Updates',
      description: 'Get instant notifications on request status changes.',
    },
    {
      icon: FaBell,
      title: 'Smart Notifications',
      description: 'Never miss important updates with our notification system.',
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
      {/* Navigation Bar */}
      <nav className="bg-white/80 backdrop-blur-md shadow-sm border-b border-gray-200/50 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center">
              <div className="w-10 h-10 bg-gradient-to-br from-gray-700 to-gray-800 rounded-lg flex items-center justify-center mr-3">
                <FaTools className="text-white text-lg" />
              </div>
              <h1 className="text-2xl font-bold bg-gradient-to-r from-gray-700 to-gray-900 bg-clip-text text-transparent">
                GearGuard
              </h1>
            </div>
            <div className="flex items-center gap-4">
              {user ? (
                <>
                  <Link
                    to="/dashboard"
                    className="px-4 py-2 text-gray-700 hover:text-gray-900 font-medium transition-colors"
                  >
                    Dashboard
                  </Link>
                  <div className="w-10 h-10 bg-gradient-to-br from-gray-600 to-gray-700 rounded-full flex items-center justify-center text-white font-bold shadow-lg">
                    {user.name?.charAt(0).toUpperCase() || 'U'}
                  </div>
                </>
              ) : (
                <>
                  <Link
                    to="/login"
                    className="px-4 py-2 text-gray-700 hover:text-gray-900 font-medium transition-colors"
                  >
                    Login
                  </Link>
                  <Link
                    to="/signup/user"
                    className="px-4 py-2 bg-gradient-to-r from-gray-700 to-gray-800 text-white rounded-lg hover:from-gray-800 hover:to-gray-900 font-medium transition-all shadow-md hover:shadow-lg"
                  >
                    Sign Up
                  </Link>
                </>
              )}
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="text-center">
          <h1 className="text-5xl md:text-6xl font-bold text-gray-900 mb-6">
            Maintenance Management
            <span className="block bg-gradient-to-r from-gray-700 to-gray-900 bg-clip-text text-transparent">
              Made Simple
            </span>
          </h1>
          <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
            Streamline your equipment maintenance workflow with GearGuard. 
            Create requests, assign teams, and track progress all in one place.
          </p>
          {!user && (
            <div className="flex gap-4 justify-center">
              <Link
                to="/signup"
                className="px-8 py-3 bg-gradient-to-r from-gray-700 to-gray-800 text-white rounded-lg hover:from-gray-800 hover:to-gray-900 font-semibold transition-all shadow-lg hover:shadow-xl flex items-center gap-2"
              >
                Get Started
                <FaArrowRight />
              </Link>
              <Link
                to="/login"
                className="px-8 py-3 bg-white text-gray-700 border-2 border-gray-700 rounded-lg hover:bg-gray-50 font-semibold transition-all"
              >
                Login
              </Link>
            </div>
          )}
        </div>
      </section>

      {/* Features Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold text-gray-900 mb-4">Powerful Features</h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Everything you need to manage your maintenance operations efficiently
          </p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => {
            const Icon = feature.icon;
            return (
              <div
                key={index}
                className="bg-white rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 border border-gray-100"
              >
                <div className={`w-14 h-14 bg-gradient-to-br ${feature.color} rounded-xl flex items-center justify-center mb-4`}>
                  <Icon className="text-white text-2xl" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">{feature.title}</h3>
                <p className="text-gray-600">{feature.description}</p>
              </div>
            );
          })}
        </div>
      </section>

      {/* Benefits Section */}
      <section className="bg-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">Why Choose GearGuard?</h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Built for teams who value efficiency and transparency
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {benefits.map((benefit, index) => {
              const Icon = benefit.icon;
              return (
                <div key={index} className="text-center">
                  <div className="w-16 h-16 bg-gradient-to-br from-gray-600 to-gray-700 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Icon className="text-white text-2xl" />
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 mb-2">{benefit.title}</h3>
                  <p className="text-gray-600">{benefit.description}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      {!user && (
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
          <div className="bg-gradient-to-r from-gray-700 to-gray-900 rounded-2xl p-12 text-center text-white">
            <h2 className="text-4xl font-bold mb-4">Ready to Get Started?</h2>
            <p className="text-xl mb-8 opacity-90">
              Join GearGuard today and transform your maintenance management
            </p>
            <Link
              to="/signup/user"
              className="inline-block px-8 py-3 bg-white text-gray-700 rounded-lg hover:bg-gray-100 font-semibold transition-all shadow-lg hover:shadow-xl"
            >
              Create Free Account
            </Link>
          </div>
        </section>
      )}

      {/* Footer */}
      <Footer />
    </div>
  );
};

export default HomePage;

