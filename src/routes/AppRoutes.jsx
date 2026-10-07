import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';

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
      <Route path="/ngo/dashboard" element={<NgoDashboard />} />
      <Route path="/ngo/nearby-donations" element={<NearbyDonations />} />
      <Route path="/ngo/donations/:id" element={<NgoDonationDetails />} />
      <Route path="/ngo/accepted" element={<AcceptedDonations />} />

      {/* Volunteer Routes */}
      <Route path="/volunteer/dashboard" element={<VolunteerDashboard />} />
      <Route path="/volunteer/assignments" element={<AvailableAssignments />} />
      <Route path="/volunteer/tracking/:id" element={<VolunteerTracking />} />

      {/* Shared & Profile Routes */}
      <Route path="/profile" element={<ProfilePage />} />
      <Route path="/settings" element={<SettingsPage />} />
      <Route path="/admin/dashboard" element={<AdminDashboard />} />

      {/* Fallback Catch-all Redirect */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
};

export default AppRoutes;
