import React, { useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { FiMail, FiArrowLeft, FiCheckCircle, FiLock } from 'react-icons/fi';
import { apiRequest } from '../../services/api';

const ForgotPassword = () => {
  const [searchParams] = useSearchParams();
  const token = searchParams.get('token') || '';
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [devResetUrl, setDevResetUrl] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError('');
    if (token && password !== confirmPassword) {
      setError('The passwords do not match.');
      return;
    }
    setLoading(true);
    try {
      if (token) {
        await apiRequest('/auth/reset-password', { method: 'POST', body: { token, password }, token: null });
      } else {
        const response = await apiRequest('/auth/forgot-password', { method: 'POST', body: { email }, token: null });
        setDevResetUrl(response.data?.devResetUrl || '');
      }
      setSubmitted(true);
    } catch (requestError) {
      setError(requestError.message || 'Could not complete the password request.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[75vh] flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="w-full max-w-md bg-[#FFFDF8] border border-[#E7DED1] rounded-fc-xl p-8 shadow-lg text-center space-y-6">
        <Link to="/" className="inline-flex items-center space-x-2">
          <div className="w-9 h-9 rounded-fc-md bg-[#4A2523] flex items-center justify-center text-[#D7A94C] font-bold text-sm">FC</div>
          <span className="font-serif font-bold text-xl text-[#4A2523]">FOOD CONNECT</span>
        </Link>

        {submitted ? (
          <div className="space-y-4">
            <div className="w-12 h-12 bg-[#E8F0E6] text-[#5F8F65] rounded-full flex items-center justify-center mx-auto"><FiCheckCircle className="w-6 h-6" /></div>
            <h2 className="text-2xl font-serif font-bold text-[#4A2523]">{token ? 'Password Updated' : 'Check Your Email'}</h2>
            {token ? <p className="text-xs text-[#746B66]">Your password has been reset. Sign in with the new password.</p> : <p className="text-xs text-[#746B66] leading-relaxed">If an account exists for {email}, reset instructions have been sent.</p>}
            {devResetUrl && <p className="text-xs text-[#746B66]">Development mode: <a className="font-bold text-[#4A2523] underline" href={devResetUrl}>Open the local reset link</a></p>}
            <Link to="/login" className="inline-flex items-center space-x-2 text-xs font-bold text-[#4A2523] hover:underline pt-2"><FiArrowLeft className="w-4 h-4" /><span>Back to Login</span></Link>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4 text-left">
            <h2 className="text-2xl font-serif font-bold text-[#4A2523] text-center">{token ? 'Choose a New Password' : 'Reset Password'}</h2>
            <p className="text-xs text-[#746B66] text-center">{token ? 'Choose a password with at least 8 characters.' : 'Enter your account email and we will send a recovery link.'}</p>
            {error && <div role="alert" className="p-3 bg-[#F5E3E0] border border-[#ECC9C5] text-[#B84C46] text-xs rounded-fc-md">{error}</div>}
            {!token ? (
              <div>
                <label htmlFor="reset-email" className="block text-xs font-bold text-[#4A2523] mb-1">Email Address</label>
                <div className="relative"><FiMail className="w-4 h-4 text-[#958B85] absolute left-3.5 top-3" /><input id="reset-email" type="email" required value={email} onChange={(event) => setEmail(event.target.value)} placeholder="you@example.com" className="w-full pl-10 pr-3.5 py-2.5 bg-[#FFFDF8] border border-[#E7DED1] rounded-fc-md text-sm text-[#2D2422] focus:border-[#4A2523] focus:outline-none" /></div>
              </div>
            ) : <>
              <div><label htmlFor="new-password" className="block text-xs font-bold text-[#4A2523] mb-1">New Password</label><div className="relative"><FiLock className="w-4 h-4 text-[#958B85] absolute left-3.5 top-3" /><input id="new-password" type="password" required minLength={8} value={password} onChange={(event) => setPassword(event.target.value)} className="w-full pl-10 pr-3.5 py-2.5 bg-[#FFFDF8] border border-[#E7DED1] rounded-fc-md text-sm" /></div></div>
              <div><label htmlFor="confirm-password" className="block text-xs font-bold text-[#4A2523] mb-1">Confirm Password</label><input id="confirm-password" type="password" required minLength={8} value={confirmPassword} onChange={(event) => setConfirmPassword(event.target.value)} className="w-full px-3.5 py-2.5 bg-[#FFFDF8] border border-[#E7DED1] rounded-fc-md text-sm" /></div>
            </>}
            <button type="submit" disabled={loading} className="w-full py-2.5 bg-[#4A2523] text-[#FFF9F0] text-sm font-medium rounded-fc-md hover:bg-[#351816] transition-colors disabled:opacity-60">{loading ? 'Please wait…' : token ? 'Update Password' : 'Send Reset Link'}</button>
            <div className="text-center pt-2"><Link to="/login" className="inline-flex items-center space-x-1 text-xs text-[#746B66] hover:text-[#4A2523]"><FiArrowLeft className="w-3.5 h-3.5" /><span>Back to Login</span></Link></div>
          </form>
        )}
      </div>
    </div>
  );
};

export default ForgotPassword;
