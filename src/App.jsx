import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import './App.css';


// Context
import { AuthProvider, useAuth } from './context/AuthContext';

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
  const { user, loading } = useAuth();
  
  if (loading) {
    return <div className="loading">Đang tải...</div>;
  }
  
  if (!user) {
    return <Navigate to="/login" replace />;
  }
  
  if (requiredRole && user.role !== requiredRole) {
    return <Navigate to="/dashboard" replace />;
  }
  
  return children;
};

// Main App Component
const AppContent = () => {
  const { user } = useAuth();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="app">
      <Navbar setSidebarOpen={setSidebarOpen} />
      
      {user && (
        <Sidebar 
          isOpen={sidebarOpen} 
          setIsOpen={setSidebarOpen}
          userRole={user.role}
        />
      )}
      
      <main className={`main-content ${user ? 'with-sidebar' : ''}`}>
        <Routes>
          {/* Public Routes */}
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/events" element={<EventList />} />
          <Route path="/news" element={<NewsList />} />
          <Route path="/blog" element={<BlogList />} />
          <Route path="/search" element={<Search />} />
          
          {/* Protected Routes - All Users */}
          <Route path="/dashboard" element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          } />
          
          {/* Member Routes */}
          <Route path="/profile" element={
            <ProtectedRoute requiredRole="member">
              <Profile />
            </ProtectedRoute>
          } />
          <Route path="/donation-history" element={
            <ProtectedRoute requiredRole="member">
              <DonationHistory />
            </ProtectedRoute>
          } />
          <Route path="/emergency" element={
            <ProtectedRoute requiredRole="member">
              <EmergencyList />
            </ProtectedRoute>
          } />
          
          {/* Staff Routes */}
          <Route path="/manage-events" element={
            <ProtectedRoute requiredRole="staff">
              <EventManager />
            </ProtectedRoute>
          } />
          <Route path="/blood-inventory" element={
            <ProtectedRoute requiredRole="staff">
              <BloodInventory />
            </ProtectedRoute>
          } />
          <Route path="/manage-members" element={
            <ProtectedRoute requiredRole="staff">
              <MemberManager />
            </ProtectedRoute>
          } />
          
          {/* Admin Routes */}
          <Route path="/manage" element={
            <ProtectedRoute requiredRole="admin">
              <Manage />
            </ProtectedRoute>
          } />
          <Route path="/manage-news" element={
            <ProtectedRoute requiredRole="admin">
              <NewsManager />
            </ProtectedRoute>
          } />
          <Route path="/manage-forum" element={
            <ProtectedRoute requiredRole="admin">
              <ForumManager />
            </ProtectedRoute>
          } />
          <Route path="/manage-notifications" element={
            <ProtectedRoute requiredRole="admin">
              <NotificationManager />
            </ProtectedRoute>
          } />
          <Route path="/reports" element={
            <ProtectedRoute requiredRole="admin">
              <ReportStats />
            </ProtectedRoute>
          } />
          <Route path="/settings" element={
            <ProtectedRoute requiredRole="admin">
              <SystemSettings />
            </ProtectedRoute>
          } />
          
          {/* Catch all route */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </main>
      
      <Footer />
      <Notification />
    </div>
  );
};

// App wrapper with providers
const App = () => {
  return (
    <AuthProvider>
      <Router>
        <AppContent />
      </Router>
    </AuthProvider>
  );
};

export default App;