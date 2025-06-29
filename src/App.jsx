import React, { useState } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import './App.css';

// Context
import { AuthProvider, useAuth } from './services/AuthContext';
import { EventProvider } from './services/EventContext';
import { FeedbackProvider } from './services/FeedbackContext';
import { QnAProvider } from './services/QnAContext';
import { EmergencyProvider } from './services/EmergencyContext';
import { DonationProvider } from './services/DonationContext';
import { DonorProvider } from './services/DonorContext';
import { NotificationProvider } from './services/NotificationsContext'; // ✅ thêm NotificationProvider


// Common Components
import Navbar from './components/common/Navbar';
import Footer from './components/common/Footer';
import Sidebar from './components/common/Sidebar';
import Notification from './components/common/Notification';

// Pages
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
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
import FeedbackForm from './pages/FeedbackForm';
import DonorSearch from './pages/DonorSearch';

// Guest Components
import EventList from './components/guest/EventList';
import NewsList from './components/guest/NewsList';

// Member Components
import Profile from './components/member/Profile';
import DonationHistory from './components/member/DonationHistory';
import RegisterHistory from './components/member/RegisterHistory';
import Certificate from './components/member/Certificate';
import Form from './components/member/Form';
import EmergencyForm from './components/member/EmergencyForm';
import FormDetail from './components/member/FormDetail';

// Staff Components
import EventManager from './components/staff/EventManager';
import BloodInventory from './components/staff/BloodInventory';
import MemberManager from './components/staff/MemberManager';
import StaffDashboard from './components/staff/StaffDashboard';
import CreateEventPage from './components/staff/CreateEventPage';
import BloodFormList from './components/staff/FormList/BloodFormList';
import BloodIntentList from './components/staff/FormList/BloodIntentList';
import EmergencyList from './components/staff/FormList/EmergencyList';
import BloodInventoryForm from './components/staff/BloodInventoryForm';
import ResultForm from './components/staff/ResultForm';
import DonationBloodResult from './components/staff/DonationBloodResult'; // Thêm DonationBloodResult


// Admin Components
import NewsManager from './components/admin/NewsManager';
import AdminDaschboard from './components/admin/AdminDashboard';
import NotificationManager from './components/admin/NotificationManager';
import MemberManagerAd from './components/admin/MemberManagerAd';
import StaffManager from './components/admin/StaffManager';

// Protected Route Component
const ProtectedRoute = ({ children, requiredRole }) => {
  const { user, role, loading } = useAuth();
  if (loading) return <div className="loading">Đang tải...</div>;
  if (!user) return <Navigate to="/login" replace />;
  if (requiredRole && role !== requiredRole) return <Navigate to="/dashboard" replace />;
  return children;
};

// Main App Content
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
          {/* Public */}
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/news" element={<NewsList />} />
          <Route path="/faq" element={<Faq />} />
          <Route path="/search" element={<Search />} />
          <Route path="/donation-blood-form" element={<DonationBloodForm />} />
          <Route path="/donation/step1" element={<DonationStep1 />} />
          <Route path="/donation/step2" element={<DonationStep2 />} />
          <Route path="/forgotPassword" element={<ForgotPassword />} />
          <Route path="/verifyGmail" element={<VerifyGmail />} />
          <Route path="/lookUp" element={<LookUp />} />
          <Route path="/feedbacks" element={<FeedbackList />} />
          <Route path="/feedbackForm" element={<FeedbackForm />} />
          <Route path="/donor-search" element={<DonorSearch />} />

          {/* Protected */}
          <Route path="/events" element={<EventProvider><EventList /></EventProvider>} />

          {/* Member */}
          <Route path="/profile" element={<ProtectedRoute requiredRole="MEMBER"><Profile /></ProtectedRoute>} />
          <Route path="/donationHistory" element={<ProtectedRoute requiredRole="MEMBER"><DonationHistory /></ProtectedRoute>} />
          <Route path="/emergency" element={<ProtectedRoute requiredRole="MEMBER"><EmergencyList /></ProtectedRoute>} />
          <Route path="/registerHistory" element={<ProtectedRoute requiredRole="MEMBER"><RegisterHistory /></ProtectedRoute>} />
          <Route path="/certificate" element={<ProtectedRoute requiredRole="MEMBER"><Certificate /></ProtectedRoute>} />
          <Route path="/form" element={<ProtectedRoute requiredRole="MEMBER"><Form /></ProtectedRoute>} />
          <Route path="/emergencyForm" element={<ProtectedRoute requiredRole="MEMBER"><EmergencyForm /></ProtectedRoute>} />
          <Route path="/formDetail/:id" element={<ProtectedRoute requiredRole="MEMBER"><FormDetail /></ProtectedRoute>} />

          {/* Staff */}
          <Route path="/eventManager" element={<ProtectedRoute requiredRole="STAFF"><EventManager /></ProtectedRoute>} />
          <Route path="/bloodInventory" element={<ProtectedRoute requiredRole="STAFF"><BloodInventory /></ProtectedRoute>} />
          <Route path="/manage-members" element={<ProtectedRoute requiredRole="STAFF"><MemberManager /></ProtectedRoute>} />
          <Route path="/staffDashboard" element={<ProtectedRoute requiredRole="STAFF"><StaffDashboard /></ProtectedRoute>} />
          <Route path="/createEvent" element={<ProtectedRoute requiredRole="STAFF"><CreateEventPage /></ProtectedRoute>} />
          <Route path="/bloodFormList" element={<ProtectedRoute requiredRole="STAFF"><BloodFormList /></ProtectedRoute>} />
          <Route path="/bloodIntentList" element={<ProtectedRoute requiredRole="STAFF"><BloodIntentList /></ProtectedRoute>} />
          <Route path="/emergencyList" element={<ProtectedRoute requiredRole="STAFF"><EmergencyList /></ProtectedRoute>} />
          <Route path="/bloodInventoryForm" element={<ProtectedRoute requiredRole="STAFF"><BloodInventoryForm /></ProtectedRoute>} />
          {/* Staff */}
          <Route path="/resultForm" element={<ProtectedRoute requiredRole="STAFF"><ResultForm /></ProtectedRoute>} />
          <Route path="/resultForm/:id" element={<ProtectedRoute requiredRole="STAFF"><ResultForm /></ProtectedRoute>} />
          <Route path="/donationBloodResult" element={<ProtectedRoute requiredRole="STAFF"><DonationBloodResult /></ProtectedRoute>} />
          <Route path="/staff/formDetail/:id" element={<ProtectedRoute requiredRole="STAFF"><FormDetail /></ProtectedRoute>} />


          {/* Admin */}
          <Route path="/manage" element={<ProtectedRoute requiredRole="ADMIN"><Manage /></ProtectedRoute>} />
          <Route path="/manage-news" element={<ProtectedRoute requiredRole="ADMIN"><NewsManager /></ProtectedRoute>} />
          <Route path="/manage-notifications" element={<ProtectedRoute requiredRole="ADMIN"><NotificationManager /></ProtectedRoute>} />
          <Route path="/admin-dashboard" element={<ProtectedRoute requiredRole="ADMIN"><AdminDaschboard /></ProtectedRoute>} />
          <Route path="/memberManagerAd" element={<ProtectedRoute requiredRole="ADMIN"><MemberManagerAd /></ProtectedRoute>} />
          <Route path="/staffmander" element={<ProtectedRoute requiredRole="ADMIN"><StaffManager /></ProtectedRoute>} />

          {/* Fallback */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </main>

      <Footer />
      <Notification />
    </div>
  );
};

// Wrap toàn bộ app bằng các Provider
const App = () => (
  <AuthProvider>
    <NotificationProvider>
      <EventProvider>
        <EmergencyProvider>
          <FeedbackProvider>
            <QnAProvider>
              <DonationProvider>
                <DonorProvider>
                  <AppContent /> {/* KHÔNG còn BrowserRouter ở đây */}
                </DonorProvider>
              </DonationProvider>
            </QnAProvider>
          </FeedbackProvider>
        </EmergencyProvider>
      </EventProvider>
    </NotificationProvider>
  </AuthProvider>
);

export default App;
