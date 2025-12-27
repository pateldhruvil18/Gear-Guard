import React, { useState } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { authApi } from '../api/authApi';
import { useToast } from '../contexts/ToastContext';
import { FaEnvelope, FaSpinner, FaCheckCircle } from 'react-icons/fa';

const VerifyEmailPendingPage = () => {
  const location = useLocation();
  const email = location.state?.email || '';
  const [resending, setResending] = useState(false);
  const [resent, setResent] = useState(false);
  const { showToast } = useToast();
  const navigate = useNavigate();

  const handleResend = async () => {
    if (!email) {
      showToast('Email address not found', 'error');
      return;
    }

    setResending(true);
    try {
      await authApi.resendVerificationEmail(email);
      setResent(true);
      showToast('Verification email sent! Please check your inbox.', 'success');
    } catch (error) {
      showToast(error.response?.data?.message || 'Failed to resend email', 'error');
    } finally {
      setResending(false);
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
        <div className="text-center">
          <div className="w-20 h-20 bg-gradient-to-br from-gray-600 to-gray-700 rounded-full flex items-center justify-center mx-auto mb-4 shadow-xl">
            <FaEnvelope className="text-white text-3xl" />
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Check Your Email</h1>
          <p className="text-gray-600 mb-4">
            We've sent a verification email to:
          </p>
          <p className="text-gray-900 font-semibold mb-6">{email}</p>
          <p className="text-gray-600 text-sm mb-6">
            Please click the verification link in the email to activate your account. 
            The link will expire in 24 hours.
          </p>

          {resent && (
            <div className="mb-4 p-3 bg-green-50 border border-green-200 rounded-lg flex items-center gap-2">
              <FaCheckCircle className="text-green-600" />
              <p className="text-green-800 text-sm font-medium">Email sent successfully!</p>
            </div>
          )}

          <div className="space-y-3">
            <button
              onClick={handleResend}
              disabled={resending}
              className="w-full btn btn-secondary flex items-center justify-center gap-2"
            >
              {resending ? (
                <>
                  <FaSpinner className="animate-spin" />
                  Sending...
                </>
              ) : (
                <>
                  <FaEnvelope />
                  Resend Verification Email
                </>
              )}
            </button>
            <Link
              to="/login"
              className="block w-full btn btn-primary text-center"
            >
              Go to Login
            </Link>
          </div>

          <p className="text-xs text-gray-500 mt-6">
            Didn't receive the email? Check your spam folder or try resending.
          </p>
        </div>
      </div>
    </div>
  );
};

export default VerifyEmailPendingPage;

