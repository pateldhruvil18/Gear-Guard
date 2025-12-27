import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { useToast } from '../contexts/ToastContext';
import { authApi } from '../api/authApi';
import { FaUserPlus, FaUser, FaUserTie, FaTools, FaTimes } from 'react-icons/fa';

const SignUpPage = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    role: 'user',
    skills: [],
  });
  const [newSkill, setNewSkill] = useState('');
  const [loading, setLoading] = useState(false);
  const [managerExists, setManagerExists] = useState(false);
  const [checkingManager, setCheckingManager] = useState(true);
  const { register } = useAuth();
  const { showToast } = useToast();
  const navigate = useNavigate();

  const commonSkills = [
    'Electrical Repair',
    'Mechanical Repair',
    'HVAC Maintenance',
    'Plumbing',
    'Welding',
    'Carpentry',
    'IT Support',
    'Network Configuration',
    'Software Installation',
    'Hardware Troubleshooting',
  ];

  useEffect(() => {
    checkManager();
  }, []);

  const checkManager = async () => {
    try {
      const response = await authApi.checkManagerExists();
      setManagerExists(response.data.managerExists);
    } catch (error) {
      console.error('Error checking manager:', error);
    } finally {
      setCheckingManager(false);
    }
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
    // Clear skills when role changes away from technician
    if (e.target.name === 'role' && e.target.value !== 'technician') {
      setFormData(prev => ({
        ...prev,
        role: e.target.value,
        skills: [],
      }));
    }
  };

  const handleAddSkill = () => {
    if (newSkill.trim() && !formData.skills.includes(newSkill.trim())) {
      setFormData({
        ...formData,
        skills: [...formData.skills, newSkill.trim()],
      });
      setNewSkill('');
    }
  };

  const handleRemoveSkill = (skillToRemove) => {
    setFormData({
      ...formData,
      skills: formData.skills.filter(skill => skill !== skillToRemove),
    });
  };

  const handleSelectCommonSkill = (skill) => {
    if (!formData.skills.includes(skill)) {
      setFormData(prev => ({
        ...prev,
        skills: [...prev.skills, skill],
      }));
    }
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

    // Validate skills for technician role
    if (formData.role === 'technician' && formData.skills.length === 0) {
      showToast('Please add at least one skill for technician role', 'error');
      return;
    }

    setLoading(true);

    try {
      const result = await register(
        formData.name,
        formData.email,
        formData.password,
        formData.role,
        formData.role === 'technician' ? formData.skills : []
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

  const roleOptions = [
    { value: 'user', label: 'User', icon: FaUser, description: 'Create maintenance requests' },
    { value: 'manager', label: 'Manager', icon: FaUserTie, description: 'Approve and assign requests', disabled: managerExists },
    { value: 'technician', label: 'Technician', icon: FaTools, description: 'Accept and complete tasks' },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-700 via-gray-800 to-gray-900 flex items-center justify-center p-4 relative overflow-hidden">
      <div className="absolute inset-0 bg-grid-pattern opacity-10"></div>
      <div 
        className="absolute inset-0 opacity-20"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.05'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`
        }}
      ></div>
      <div className="bg-white rounded-3xl shadow-2xl w-full max-w-2xl p-8 md:p-10 relative z-10 animate-fade-in border border-white/20 overflow-y-auto max-h-[95vh]">
        <div className="text-center mb-8">
          <div className="w-20 h-20 bg-gradient-to-br from-gray-700 to-gray-800 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-xl">
            <FaUserPlus className="text-white text-3xl" />
          </div>
          <h1 className="text-4xl font-bold text-gray-900 mb-2 bg-gradient-to-r from-gray-700 via-gray-800 to-gray-900 bg-clip-text text-transparent">
            Create Account
          </h1>
          <p className="text-gray-600 font-medium text-lg">Join GearGuard Maintenance System</p>
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

          <div>
            <label className="label text-gray-700 font-semibold mb-3 block">Select Your Role</label>
            {checkingManager ? (
              <div className="text-center py-4 text-gray-500">Checking availability...</div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {roleOptions.map((role) => {
                  const Icon = role.icon;
                  const isDisabled = role.disabled;
                  return (
                    <button
                      key={role.value}
                      type="button"
                      onClick={() => {
                        if (!isDisabled) {
                          setFormData(prev => ({
                            ...prev,
                            role: role.value,
                            skills: role.value === 'technician' ? prev.skills : [],
                          }));
                        }
                      }}
                      disabled={isDisabled}
                      className={`p-5 rounded-xl border-2 transition-all duration-200 relative ${
                        isDisabled
                          ? 'border-gray-200 bg-gray-100 opacity-50 cursor-not-allowed'
                          : formData.role === role.value
                          ? 'border-gray-600 bg-gray-100 shadow-lg scale-105'
                          : 'border-gray-200 bg-white hover:border-gray-400 hover:bg-gray-50 hover:shadow-md'
                      }`}
                    >
                      {isDisabled && (
                        <div className="absolute top-2 right-2 bg-red-500 text-white text-xs px-2 py-1 rounded-full">
                          Unavailable
                        </div>
                      )}
                      <Icon className={`text-3xl mb-3 mx-auto ${
                        isDisabled 
                          ? 'text-gray-300' 
                          : formData.role === role.value ? 'text-gray-700' : 'text-gray-400'
                      }`} />
                      <div className={`font-bold mb-1 text-base ${
                        isDisabled 
                          ? 'text-gray-400' 
                          : formData.role === role.value ? 'text-gray-800' : 'text-gray-700'
                      }`}>
                        {role.label}
                      </div>
                      <div className="text-xs text-gray-500">
                        {isDisabled ? 'Manager already exists' : role.description}
                      </div>
                    </button>
                  );
                })}
              </div>
            )}
          </div>

          {/* Skills field - only show for technician role */}
          {formData.role === 'technician' && (
            <div>
              <label className="label text-gray-700 font-semibold mb-2">Your Skills</label>
              <div className="flex flex-wrap gap-2 mb-3">
                {commonSkills.map(skill => (
                  <button
                    key={skill}
                    type="button"
                    onClick={() => handleSelectCommonSkill(skill)}
                    className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
                      formData.skills.includes(skill)
                        ? 'bg-gray-700 text-white shadow-md'
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                  >
                    {skill}
                  </button>
                ))}
              </div>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={newSkill}
                  onChange={(e) => setNewSkill(e.target.value)}
                  onKeyPress={(e) => { if (e.key === 'Enter') { e.preventDefault(); handleAddSkill(); } }}
                  className="input flex-1 bg-gray-50 focus:bg-white border-gray-300 focus:border-gray-600"
                  placeholder="Add a custom skill"
                />
                <button
                  type="button"
                  onClick={handleAddSkill}
                  className="btn btn-secondary px-4 py-2.5"
                >
                  Add
                </button>
              </div>
              {formData.skills.length > 0 && (
                <div className="mt-4 flex flex-wrap gap-2">
                  {formData.skills.map(skill => (
                    <span
                      key={skill}
                      className="flex items-center gap-2 bg-gray-100 text-gray-700 px-3 py-1.5 rounded-full text-sm font-medium border border-gray-200"
                    >
                      {skill}
                      <button
                        type="button"
                        onClick={() => handleRemoveSkill(skill)}
                        className="text-gray-500 hover:text-gray-700"
                      >
                        <FaTimes className="text-xs" />
                      </button>
                    </span>
                  ))}
                </div>
              )}
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full btn btn-primary flex items-center justify-center gap-2 py-3 text-base font-semibold shadow-lg hover:shadow-xl transition-all"
          >
            <FaUserPlus />
            {loading ? 'Creating Account...' : 'Sign Up'}
          </button>
        </form>

        <div className="mt-8 pt-6 border-t border-gray-200 text-center">
          <p className="text-gray-600">
            Already have an account?{' '}
            <Link to="/login" className="text-gray-700 hover:text-gray-900 font-semibold hover:underline transition-colors">
              Login
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default SignUpPage;

