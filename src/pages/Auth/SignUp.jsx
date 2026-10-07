import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { FiUser, FiMail, FiLock, FiPhone, FiHome, FiArrowRight } from 'react-icons/fi';

const SignUp = () => {
  const { register } = useAuth();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  const [role, setRole] = useState(searchParams.get('role') || 'donor');
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [organization, setOrganization] = useState('');
  const [password, setPassword] = useState('');

  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const paramRole = searchParams.get('role');
    if (paramRole && ['donor', 'ngo', 'volunteer'].includes(paramRole)) {
      setRole(paramRole);
    }
  }, [searchParams]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (password.length < 8) {
      setError('Password must be at least 8 characters.');
      return;
    }
    setError('');
    setLoading(true);
    const res = await register({ fullName, email, phone, organization, password, role });
    setLoading(false);
    if (res.success) {
      if (role === 'ngo') navigate('/ngo/dashboard');
      else if (role === 'volunteer') navigate('/volunteer/dashboard');
      else navigate('/donor/dashboard');
    } else {
      if (res.error?.includes('email-already-in-use')) {
        setError('An account with this email already exists. Please log in instead.');
      } else if (res.error?.includes('invalid-email')) {
        setError('Please enter a valid email address.');
      } else {
        setError(res.error || 'Registration failed. Please try again.');
      }
    }
  };

  return (
    <div className="min-h-[85vh] flex items-center justify-center py-8 px-4 sm:px-6 lg:px-8">
      <div className="w-full max-w-5xl bg-[#FFFDF8] border border-[#E7DED1] rounded-fc-xl overflow-hidden shadow-lg grid grid-cols-1 lg:grid-cols-12">
        
        {/* Left Column: Form */}
        <div className="lg:col-span-6 p-8 sm:p-10 flex flex-col justify-between">
          <div>
            <Link to="/" className="flex items-center space-x-2.5 mb-6">
              <div className="w-9 h-9 rounded-fc-md bg-[#4A2523] flex items-center justify-center text-[#D7A94C] font-bold text-sm">
                FC
              </div>
              <span className="font-serif font-bold text-xl text-[#4A2523] tracking-tight">
                FOOD CONNECT
              </span>
            </Link>

            <h2 className="text-3xl font-serif font-bold text-[#4A2523]">Create an Account</h2>
            <p className="text-xs text-[#746B66] mt-1 mb-5">
              Join the network to rescue surplus cooked food and support communities.
            </p>

            {/* Role Selector */}
            <div className="mb-5">
              <label className="block text-xs font-bold text-[#4A2523] mb-2">Select Account Role:</label>
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
                  Donor Host
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
                  NGO Partner
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
              <div className="mb-3 p-3 bg-[#F5E3E0] border border-[#ECC9C5] text-[#B84C46] text-xs rounded-fc-md">
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-3.5">
              <div>
                <label className="block text-xs font-bold text-[#4A2523] mb-1">Full Name</label>
                <div className="relative">
                  <FiUser className="w-4 h-4 text-[#958B85] absolute left-3.5 top-3" />
                  <input
                    type="text"
                    required
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    placeholder="e.g. Shifali Rao"
                    className="w-full pl-10 pr-3.5 py-2 bg-[#FFFDF8] border border-[#E7DED1] rounded-fc-md text-sm text-[#2D2422] focus:border-[#4A2523] focus:outline-none"
                  />
                </div>
              </div>

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
                    className="w-full pl-10 pr-3.5 py-2 bg-[#FFFDF8] border border-[#E7DED1] rounded-fc-md text-sm text-[#2D2422] focus:border-[#4A2523] focus:outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-[#4A2523] mb-1">Phone Number</label>
                  <div className="relative">
                    <FiPhone className="w-4 h-4 text-[#958B85] absolute left-3.5 top-3" />
                    <input
                      type="tel"
                      required
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      placeholder="+91 98765 43210"
                      className="w-full pl-10 pr-3.5 py-2 bg-[#FFFDF8] border border-[#E7DED1] rounded-fc-md text-sm text-[#2D2422] focus:border-[#4A2523] focus:outline-none"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-[#4A2523] mb-1">
                    {role === 'ngo' ? 'Organization Name' : 'Venue / Event Co (Optional)'}
                  </label>
                  <div className="relative">
                    <FiHome className="w-4 h-4 text-[#958B85] absolute left-3.5 top-3" />
                    <input
                      type="text"
                      value={organization}
                      onChange={(e) => setOrganization(e.target.value)}
                      placeholder={role === 'ngo' ? 'Hope Shelter Trust' : 'Grand Banquets'}
                      className="w-full pl-10 pr-3.5 py-2 bg-[#FFFDF8] border border-[#E7DED1] rounded-fc-md text-sm text-[#2D2422] focus:border-[#4A2523] focus:outline-none"
                    />
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-[#4A2523] mb-1">Password</label>
                <div className="relative">
                  <FiLock className="w-4 h-4 text-[#958B85] absolute left-3.5 top-3" />
                  <input
                    type="password"
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="At least 8 characters"
                    className="w-full pl-10 pr-3.5 py-2 bg-[#FFFDF8] border border-[#E7DED1] rounded-fc-md text-sm text-[#2D2422] focus:border-[#4A2523] focus:outline-none"
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full py-2.5 bg-[#4A2523] text-[#FFF9F0] text-sm font-medium rounded-fc-md hover:bg-[#351816] transition-colors flex items-center justify-center space-x-2 mt-2 disabled:opacity-60 disabled:cursor-not-allowed"
              >
                {loading ? (
                  <span>Creating account...</span>
                ) : (
                  <>
                    <span>Register as {role.toUpperCase()}</span>
                    <FiArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>
            </form>

          </div>

          <div className="pt-4 border-t border-[#E7DED1] mt-4 text-center text-xs text-[#746B66]">
            Already have an account?{' '}
            <Link to="/login" className="font-bold text-[#4A2523] hover:underline">
              Log In
            </Link>
          </div>

        </div>

        {/* Right Column Visual */}
        <div className="hidden lg:block lg:col-span-6 bg-[#F8EFE1] p-8 border-l border-[#E7DED1] relative">
          <div className="h-full flex flex-col justify-between">
            <div className="relative h-[440px] rounded-fc-xl overflow-hidden border border-[#E8D8C1]">
              <img
                src="https://images.unsplash.com/photo-1544025162-d76694265947?auto=format&fit=crop&q=80&w=800"
                alt="Community food distribution"
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#351816]/70 via-transparent to-transparent" />
              <div className="absolute bottom-6 left-6 right-6 text-[#FFF9F0]">
                <p className="font-serif italic text-lg leading-snug">
                  "Every meal redirected turns a wasted surplus into hope."
                </p>
                <p className="text-xs text-[#D7A94C] mt-2 font-semibold">
                  Join 1,280+ Verified NGOs & 3,900+ Connected Event Hosts
                </p>
              </div>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};

export default SignUp;
