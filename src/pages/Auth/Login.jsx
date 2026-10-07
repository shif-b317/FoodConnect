import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { FiMail, FiLock, FiArrowRight, FiShield, FiHeart } from 'react-icons/fi';

const Login = () => {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('donor');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email || !password) {
      setError('Please fill in both email and password.');
      return;
    }
    setError('');
    setLoading(true);
    const res = await login(email, password);
    setLoading(false);
    if (res.success) {
      // Role comes from Firestore profile, but we also respect the UI tab for UX
      if (res.user?.role === 'ngo') navigate('/ngo/dashboard');
      else if (res.user?.role === 'volunteer') navigate('/volunteer/dashboard');
      else navigate('/donor/dashboard');
    } else {
      // Map Firebase error codes to friendly messages
      if (res.error?.includes('user-not-found') || res.error?.includes('invalid-credential')) {
        setError('No account found with this email. Please register first.');
      } else if (res.error?.includes('wrong-password')) {
        setError('Incorrect password. Please try again.');
      } else if (res.error?.includes('too-many-requests')) {
        setError('Too many failed attempts. Please try again later.');
      } else {
        setError(res.error || 'Login failed. Please try again.');
      }
    }
  };

  return (
    <div className="min-h-[85vh] flex items-center justify-center py-8 px-4 sm:px-6 lg:px-8">
      <div className="w-full max-w-5xl bg-[#FFFDF8] border border-[#E7DED1] rounded-fc-xl overflow-hidden shadow-lg grid grid-cols-1 lg:grid-cols-12">
        
        {/* Left Column: Form */}
        <div className="lg:col-span-6 p-8 sm:p-12 flex flex-col justify-between">
          <div>
            
            {/* Logo */}
            <Link to="/" className="flex items-center space-x-2.5 mb-8">
              <div className="w-9 h-9 rounded-fc-md bg-[#4A2523] flex items-center justify-center text-[#D7A94C] font-bold text-sm">
                FC
              </div>
              <span className="font-serif font-bold text-xl text-[#4A2523] tracking-tight">
                FOOD CONNECT
              </span>
            </Link>

            <h2 className="text-3xl font-serif font-bold text-[#4A2523]">Welcome Back</h2>
            <p className="text-xs text-[#746B66] mt-1 mb-6">
              Sign in to manage food donations, accept assignments, or view impact.
            </p>

            {/* Role Selection Tabs */}
            <div className="mb-6">
              <label className="block text-xs font-bold text-[#4A2523] mb-2">Select Your Role:</label>
              <div className="grid grid-cols-3 gap-2 bg-[#F8EFE1] p-1 rounded-fc-md border border-[#E8D8C1]">
                <button
                  type="button"
                  onClick={() => setRole('donor')}
                  className={`py-2 text-xs font-semibold rounded-fc-sm transition-all ${
                    role === 'donor'
                      ? 'bg-[#4A2523] text-[#FFF9F0] shadow-sm'
                      : 'text-[#746B66] hover:text-[#4A2523]'
                  }`}
                >
                  Donor
                </button>
                <button
                  type="button"
                  onClick={() => setRole('ngo')}
                  className={`py-2 text-xs font-semibold rounded-fc-sm transition-all ${
                    role === 'ngo'
                      ? 'bg-[#4A2523] text-[#FFF9F0] shadow-sm'
                      : 'text-[#746B66] hover:text-[#4A2523]'
                  }`}
                >
                  NGO
                </button>
                <button
                  type="button"
                  onClick={() => setRole('volunteer')}
                  className={`py-2 text-xs font-semibold rounded-fc-sm transition-all ${
                    role === 'volunteer'
                      ? 'bg-[#4A2523] text-[#FFF9F0] shadow-sm'
                      : 'text-[#746B66] hover:text-[#4A2523]'
                  }`}
                >
                  Volunteer
                </button>
              </div>
            </div>

            {error && (
              <div className="mb-4 p-3 bg-[#F5E3E0] border border-[#ECC9C5] text-[#B84C46] text-xs rounded-fc-md">
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-[#4A2523] mb-1">Email Address</label>
                <div className="relative">
                  <FiMail className="w-4 h-4 text-[#958B85] absolute left-3.5 top-3" />
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder={`${role}@foodconnect.org`}
                    className="w-full pl-10 pr-3.5 py-2.5 bg-[#FFFDF8] border border-[#E7DED1] rounded-fc-md text-sm text-[#2D2422] focus:border-[#4A2523] focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <div className="flex justify-between items-center mb-1">
                  <label className="block text-xs font-bold text-[#4A2523]">Password</label>
                  <Link to="/forgot-password" className="text-xs text-[#6B403C] hover:underline">
                    Forgot password?
                  </Link>
                </div>
                <div className="relative">
                  <FiLock className="w-4 h-4 text-[#958B85] absolute left-3.5 top-3" />
                  <input
                    type="password"
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full pl-10 pr-3.5 py-2.5 bg-[#FFFDF8] border border-[#E7DED1] rounded-fc-md text-sm text-[#2D2422] focus:border-[#4A2523] focus:outline-none"
                  />
                </div>
              </div>

              <div className="flex items-center justify-between text-xs text-[#746B66] pt-1">
                <label className="flex items-center space-x-2 cursor-pointer">
                  <input type="checkbox" defaultChecked className="accent-[#4A2523] rounded" />
                  <span>Remember me on this device</span>
                </label>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full py-3 bg-[#4A2523] text-[#FFF9F0] text-sm font-medium rounded-fc-md hover:bg-[#351816] transition-colors flex items-center justify-center space-x-2 pt-2 disabled:opacity-60 disabled:cursor-not-allowed"
              >
                {loading ? (
                  <span>Signing in...</span>
                ) : (
                  <>
                    <span>Log In as {role.toUpperCase()}</span>
                    <FiArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>
            </form>

          </div>

          <div className="pt-6 border-t border-[#E7DED1] mt-6 text-center text-xs text-[#746B66]">
            Don't have an account yet?{' '}
            <Link to={`/register?role=${role}`} className="font-bold text-[#4A2523] hover:underline">
              Create an Account
            </Link>
          </div>

        </div>

        {/* Right Column: Editorial Visual */}
        <div className="hidden lg:block lg:col-span-6 bg-[#F8EFE1] p-8 border-l border-[#E7DED1] relative">
          <div className="h-full flex flex-col justify-between">
            <div className="relative h-[420px] rounded-fc-xl overflow-hidden border border-[#E8D8C1]">
              <img
                src="https://images.unsplash.com/photo-1555244162-803834f70033?auto=format&fit=crop&q=80&w=800"
                alt="Cooked food surplus feast"
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#351816]/70 via-transparent to-transparent" />
              <div className="absolute bottom-6 left-6 right-6 text-[#FFF9F0]">
                <p className="font-serif italic text-lg leading-snug">
                  "Good food deserves to be shared, not wasted."
                </p>
                <p className="text-xs text-[#D7A94C] mt-2 font-semibold">
                  Connecting Event Hosts • Verified NGOs • Volunteers
                </p>
              </div>
            </div>

            <div className="pt-4 flex items-center justify-between text-xs text-[#6B403C]">
              <span className="flex items-center gap-1">
                <FiShield className="w-3.5 h-3.5 text-[#D7A94C]" /> Verified NGO Network
              </span>
              <span className="flex items-center gap-1">
                <FiHeart className="w-3.5 h-3.5 text-[#D7A94C]" /> 1,24,000+ Meals Served
              </span>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};

export default Login;
