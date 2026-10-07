import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { FiMail, FiArrowLeft, FiCheckCircle } from 'react-icons/fi';

const ForgotPassword = () => {
  const [email, setEmail] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    setSubmitted(true);
  };

  return (
    <div className="min-h-[75vh] flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="w-full max-w-md bg-[#FFFDF8] border border-[#E7DED1] rounded-fc-xl p-8 shadow-lg text-center space-y-6">
        
        <Link to="/" className="inline-flex items-center space-x-2">
          <div className="w-9 h-9 rounded-fc-md bg-[#4A2523] flex items-center justify-center text-[#D7A94C] font-bold text-sm">
            FC
          </div>
          <span className="font-serif font-bold text-xl text-[#4A2523]">FOOD CONNECT</span>
        </Link>

        {submitted ? (
          <div className="space-y-4">
            <div className="w-12 h-12 bg-[#E8F0E6] text-[#5F8F65] rounded-full flex items-center justify-center mx-auto">
              <FiCheckCircle className="w-6 h-6" />
            </div>
            <h2 className="text-2xl font-serif font-bold text-[#4A2523]">Check Your Email</h2>
            <p className="text-xs text-[#746B66] leading-relaxed">
              We have sent password reset instructions to <span className="font-bold text-[#4A2523]">{email}</span>.
            </p>
            <Link
              to="/login"
              className="inline-flex items-center space-x-2 text-xs font-bold text-[#4A2523] hover:underline pt-2"
            >
              <FiArrowLeft className="w-4 h-4" />
              <span>Back to Login</span>
            </Link>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4 text-left">
            <h2 className="text-2xl font-serif font-bold text-[#4A2523] text-center">Reset Password</h2>
            <p className="text-xs text-[#746B66] text-center">
              Enter your account email address and we'll send you a recovery link.
            </p>

            <div>
              <label className="block text-xs font-bold text-[#4A2523] mb-1">Email Address</label>
              <div className="relative">
                <FiMail className="w-4 h-4 text-[#958B85] absolute left-3.5 top-3" />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@example.com"
                  className="w-full pl-10 pr-3.5 py-2.5 bg-[#FFFDF8] border border-[#E7DED1] rounded-fc-md text-sm text-[#2D2422] focus:border-[#4A2523] focus:outline-none"
                />
              </div>
            </div>

            <button
              type="submit"
              className="w-full py-2.5 bg-[#4A2523] text-[#FFF9F0] text-sm font-medium rounded-fc-md hover:bg-[#351816] transition-colors"
            >
              Send Reset Link
            </button>

            <div className="text-center pt-2">
              <Link to="/login" className="inline-flex items-center space-x-1 text-xs text-[#746B66] hover:text-[#4A2523]">
                <FiArrowLeft className="w-3.5 h-3.5" />
                <span>Back to Login</span>
              </Link>
            </div>
          </form>
        )}

      </div>
    </div>
  );
};

export default ForgotPassword;
