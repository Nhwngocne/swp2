import React, { useState } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import './App.css';

// Context
import { AuthProvider, useAuth } from './services/AuthContext';
import { EventProvider } from './services/EventContext'; 

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
import Faq from './pages/Faq'; // ✅ Thêm Faq ở đây
import DonationBloodForm from './pages/Donation/DonationBloodForm';
import DonationStep1 from './pages/Donation/DonationStep1'; // ✅ Thêm import
import DonationStep2 from './pages/Donation/DonationStep2'; // ✅ Thêm import
import ForgotPassword from './pages/ForgotPassword';
import VerifyGmail from './pages/VerifyGmail';
import LookUp from './pages/LookUp';

// Guest Components
import EventList from './components/guest/EventList';
import NewsList from './components/guest/NewsList';
import BlogList from './components/guest/BlogList';

// Member Components
import Profile from './components/member/Profile';
import DonationHistory from './components/member/DonationHistory';
import EmergencyList from './components/member/EmergencyList';

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


  return (
    <div className="app">
      <Navbar setSidebarOpen={setSidebarOpen} />
      {user && (

        <Sidebar isOpen={sidebarOpen} setIsOpen={setSidebarOpen} userRole={role} />

      )}
      <main className={`main-content ${user ? 'with-sidebar' : ''}`}>
        <Routes>
          {/* Public Routes */}
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          
          <Route path="/news" element={<EventProvider><NewsList /></EventProvider>} />
          <Route path="/blog" element={<BlogList />} />
          <Route path="/faq" element={<Faq />} /> {/* ✅ Đã thêm route hỏi đáp */}
          <Route path="/search" element={<Search />} />
          <Route path="/donation-blood-form" element={<EventProvider><DonationBloodForm /></EventProvider>} />
          <Route path="/donation/step1" element={<EventProvider><DonationStep1 /></EventProvider>} /> {/* ✅ Thêm route */}
          <Route path="/donation/step2" element={<EventProvider><DonationStep2 /></EventProvider>} /> {/* ✅ Thêm route */}
          <Route path="/forgotPassword" element={<ForgotPassword />} />
          <Route path="/verifyGmail" element={<VerifyGmail />} />
          <Route path="/lookUp" element={<LookUp />} />

          {/* Protected Routes */}
          <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
          <Route path="/events" element={<EventProvider><EventList /></EventProvider>}/>

          {/* Member Routes */}
          <Route path="/profile" element={<ProtectedRoute requiredRole="MEMBER"><Profile /></ProtectedRoute>} />
          <Route path="/donation-history" element={<ProtectedRoute requiredRole="MEMBER"><DonationHistory /></ProtectedRoute>} />
          <Route path="/emergency" element={<ProtectedRoute requiredRole="MEMBER"><EmergencyList /></ProtectedRoute>} />


          {/* Staff Routes */}
          <Route path="/manage-events" element={<ProtectedRoute requiredRole="STAFF"><EventProvider><EventManager /></EventProvider></ProtectedRoute>} />
          <Route path="/blood-inventory" element={<ProtectedRoute requiredRole="STAFF"><BloodInventory /></ProtectedRoute>} />
          <Route path="/manage-members" element={<ProtectedRoute requiredRole="STAFF"><MemberManager /></ProtectedRoute>} />

          {/* Admin Routes */}
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

// App wrapper
const App = () => (
    <AuthProvider>
        <AppContent />
    </AuthProvider>
);

export default App;
