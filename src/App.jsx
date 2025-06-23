import React, { useState } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import './App.css';

// Context
import { AuthProvider, useAuth } from './services/AuthContext';
import { EventProvider } from './services/EventContext'; 
import { FeedbackProvider } from "./services/FeedbackContext";

// Common Components
import Navbar from './components/common/Navbar';
import Footer from './components/common/Footer';
import Sidebar from './components/common/Sidebar';
import Notification from './components/common/Notification';

// Pages
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import Search from './pages/Search';
import Manage from './pages/Manage';
import Faq from './pages/Faq';
import DonationBloodForm from './pages/Donation/DonationBloodForm';
import DonationStep1 from './pages/Donation/DonationStep1';
import DonationStep2 from './pages/Donation/DonationStep2';
import ForgotPassword from './pages/ForgotPassword';
import VerifyGmail from './pages/VerifyGmail';
import LookUp from './pages/LookUp';
import FeedbackList from './pages/FeedbackList';

// Guest Components
import EventList from './components/guest/EventList';
import NewsList from './components/guest/NewsList';
import BlogList from './components/guest/BlogList';

// Member Components
import Profile from './components/member/Profile';
import DonationHistory from './components/member/DonationHistory';
import EmergencyList from './components/member/EmergencyList';
import RegisterHistory from './components/member/RegisterHistory';
import Certificate from './components/member/Certificate';
import Form from './components/member/Form';
import EmergencyForm from './components/member/EmergencyForm';

// Staff Components
import EventManager from './components/staff/EventManager';
import BloodInventory from './components/staff/BloodInventory';
import MemberManager from './components/staff/MemberManager';

// Admin Components
import NewsManager from './components/admin/NewsManager';
import ForumManager from './components/admin/ForumManager';
import NotificationManager from './components/admin/NotificationManager';
import ReportStats from './components/admin/ReportStats';
import SystemSettings from './components/admin/SystemSettings';

// Protected Route Component
const ProtectedRoute = ({ children, requiredRole }) => {
  const { user, role, loading } = useAuth();
  if (loading) return <div className="loading">Đang tải...</div>;
  if (!user) return <Navigate to="/login" replace />;
  if (requiredRole && role !== requiredRole) return <Navigate to="/dashboard" replace />;
  return children;
};

// Main App Component
const AppContent = () => {
  const { user, role } = useAuth();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const isAdminOrStaff = user && (role === 'ADMIN' || role === 'STAFF');

  return (
    <div className="app">
      <Navbar setSidebarOpen={setSidebarOpen} />


      {isAdminOrStaff && (
        <Sidebar isOpen={sidebarOpen} setIsOpen={setSidebarOpen} userRole={role} />

      )}

      <main className={`main-content ${isAdminOrStaff ? 'with-sidebar' : ''}`}>
        <Routes>
          
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/news" element={<EventProvider><NewsList /></EventProvider>} />
          <Route path="/blog" element={<BlogList />} />
          <Route path="/faq" element={<Faq />} />
          <Route path="/search" element={<Search />} />
          <Route path="/donation-blood-form" element={<EventProvider><DonationBloodForm /></EventProvider>} />
          <Route path="/donation/step1" element={<EventProvider><DonationStep1 /></EventProvider>} />
          <Route path="/donation/step2" element={<EventProvider><DonationStep2 /></EventProvider>} />
          <Route path="/forgotPassword" element={<ForgotPassword />} />
          <Route path="/verifyGmail" element={<VerifyGmail />} />
          <Route path="/lookUp" element={<LookUp />} />
          <Route path="/feedbacks" element={<FeedbackProvider><FeedbackList /></FeedbackProvider>} />

          {/* Protected */}
          <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
          <Route path="/events" element={<EventProvider><EventList /></EventProvider>} />

          {/* Member */}
          <Route path="/profile" element={<ProtectedRoute requiredRole="MEMBER"><Profile /></ProtectedRoute>} />
          <Route path="/donationHistory" element={<ProtectedRoute requiredRole="MEMBER"><DonationHistory /></ProtectedRoute>} />
          <Route path="/emergency" element={<ProtectedRoute requiredRole="MEMBER"><EmergencyList /></ProtectedRoute>} />
          <Route path="/registerHistory" element={<ProtectedRoute requiredRole="MEMBER"><RegisterHistory /></ProtectedRoute>} />
          <Route path="/certificate" element={<ProtectedRoute requiredRole="MEMBER"><Certificate /></ProtectedRoute>} />
          <Route path="/form" element={<ProtectedRoute requiredRole="MEMBER"><Form /></ProtectedRoute>} />
          <Route path="/emergencyForm" element={<ProtectedRoute requiredRole="MEMBER"><EmergencyForm /></ProtectedRoute>} />

          {/* Staff */}
          <Route path="/manage-events" element={<ProtectedRoute requiredRole="STAFF"><EventProvider><EventManager /></EventProvider></ProtectedRoute>} />
          <Route path="/blood-inventory" element={<ProtectedRoute requiredRole="STAFF"><BloodInventory /></ProtectedRoute>} />
          <Route path="/manage-members" element={<ProtectedRoute requiredRole="STAFF"><MemberManager /></ProtectedRoute>} />

          {/* Admin */}
          <Route path="/manage" element={<ProtectedRoute requiredRole="ADMIN"><Manage /></ProtectedRoute>} />
          <Route path="/manage-news" element={<ProtectedRoute requiredRole="ADMIN"><EventProvider><NewsManager /></EventProvider></ProtectedRoute>} />
          <Route path="/manage-forum" element={<ProtectedRoute requiredRole="ADMIN"><ForumManager /></ProtectedRoute>} />
          <Route path="/manage-notifications" element={<ProtectedRoute requiredRole="ADMIN"><NotificationManager /></ProtectedRoute>} />
          <Route path="/reports" element={<ProtectedRoute requiredRole="ADMIN"><ReportStats /></ProtectedRoute>} />
          <Route path="/settings" element={<ProtectedRoute requiredRole="ADMIN"><SystemSettings /></ProtectedRoute>} />

          {/* Fallback */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </main>

      <Footer />
      <Notification />
    </div>
  );
};


const App = () => (
  <AuthProvider>
    <AppContent />
  </AuthProvider>
);

export default App;
