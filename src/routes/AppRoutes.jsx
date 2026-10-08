import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const roleHome = (role) => role === 'ngo' ? '/ngo/dashboard' : role === 'volunteer' ? '/volunteer/dashboard' : role === 'admin' ? '/admin/dashboard' : '/donor/dashboard';

const RequireAuth = ({ children }) => {
  const { user } = useAuth();
  return user ? children : <Navigate to="/login" replace />;
};

const RequireRole = ({ role, allowPendingNgo = false, children }) => {
  const { user } = useAuth();
  if (!user) return <Navigate to="/login" replace />;
  if (user.role !== role) return <Navigate to={roleHome(user.role)} replace />;
  if (role === 'ngo' && !allowPendingNgo && user.verificationStatus !== 'VERIFIED') {
    return <Navigate to="/ngo/dashboard" replace />;
  }
  return children;
};

// Public Pages
import LandingPage from '../pages/Public/LandingPage';
import AboutPage from '../pages/Public/AboutPage';
import HowItWorksPage from '../pages/Public/HowItWorksPage';
import ImpactPage from '../pages/Public/ImpactPage';
import ContactPage from '../pages/Public/ContactPage';
import FAQPage from '../pages/Public/FAQPage';

// Auth Pages
import Login from '../pages/Auth/Login';
import SignUp from '../pages/Auth/SignUp';
import ForgotPassword from '../pages/Auth/ForgotPassword';

// Donor Pages
import DonorDashboard from '../pages/Donor/DonorDashboard';
import DonateFood from '../pages/Donor/DonateFood';
import MyDonations from '../pages/Donor/MyDonations';
import DonationDetails from '../pages/Donor/DonationDetails';

// NGO Pages
import NgoDashboard from '../pages/NGO/NgoDashboard';
import NearbyDonations from '../pages/NGO/NearbyDonations';
import NgoDonationDetails from '../pages/NGO/NgoDonationDetails';
import AcceptedDonations from '../pages/NGO/AcceptedDonations';

// Volunteer Pages
import VolunteerDashboard from '../pages/Volunteer/VolunteerDashboard';
import AvailableAssignments from '../pages/Volunteer/AvailableAssignments';
import VolunteerTracking from '../pages/Volunteer/VolunteerTracking';

// Profile, Settings & Admin
import ProfilePage from '../pages/Profile/ProfilePage';
import SettingsPage from '../pages/Settings/SettingsPage';
import AdminDashboard from '../pages/Admin/AdminDashboard';

const AppRoutes = () => {
  return (
    <Routes>
      {/* Public Routes */}
      <Route path="/" element={<LandingPage />} />
      <Route path="/about" element={<AboutPage />} />
      <Route path="/how-it-works" element={<HowItWorksPage />} />
      <Route path="/impact" element={<ImpactPage />} />
      <Route path="/contact" element={<ContactPage />} />
      <Route path="/faq" element={<FAQPage />} />

      {/* Auth Routes */}
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<SignUp />} />
      <Route path="/forgot-password" element={<ForgotPassword />} />

      {/* Donor Routes */}
      <Route path="/donor/dashboard" element={<DonorDashboard />} />
      <Route path="/donor/donate" element={<DonateFood />} />
      <Route path="/donor/donations" element={<MyDonations />} />
      <Route path="/donor/donations/:id" element={<DonationDetails />} />

      {/* NGO Routes */}
      <Route path="/ngo/dashboard" element={<RequireRole role="ngo" allowPendingNgo><NgoDashboard /></RequireRole>} />
      <Route path="/ngo/nearby-donations" element={<RequireRole role="ngo"><NearbyDonations /></RequireRole>} />
      <Route path="/ngo/donations/:id" element={<RequireRole role="ngo"><NgoDonationDetails /></RequireRole>} />
      <Route path="/ngo/accepted" element={<RequireRole role="ngo"><AcceptedDonations /></RequireRole>} />

      {/* Volunteer Routes */}
      <Route path="/volunteer/dashboard" element={<VolunteerDashboard />} />
      <Route path="/volunteer/assignments" element={<AvailableAssignments />} />
      <Route path="/volunteer/tracking/:id" element={<VolunteerTracking />} />

      {/* Shared & Profile Routes */}
      <Route path="/profile" element={<RequireAuth><ProfilePage /></RequireAuth>} />
      <Route path="/settings" element={<RequireAuth><SettingsPage /></RequireAuth>} />
      <Route path="/admin/dashboard" element={<RequireRole role="admin"><AdminDashboard /></RequireRole>} />

      {/* Fallback Catch-all Redirect */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
};

export default AppRoutes;
