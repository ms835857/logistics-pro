import React from 'react';
import { Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { AnimatePresence } from 'framer-motion';

import ProtectedRoute from './components/ProtectedRoute';
import AnimatedPage from './components/AnimatedPage';

// Auth & Public
import Login from './pages/Login';
import Register from './pages/Register';
import TrackShipment from './pages/TrackShipment';

// Client Pages
import ClientDashboard from './pages/client/ClientDashboard';
import ClientOrders from './pages/client/ClientOrders';
import ClientShipments from './pages/client/ClientShipments';
import ClientSuppliers from './pages/client/ClientSuppliers';
import ClientProfile from './pages/client/ClientProfile';

// Admin Pages
import AdminDashboard from './pages/admin/AdminDashboard';
import AdminOrders from './pages/admin/AdminOrders';
import AdminShipments from './pages/admin/AdminShipments';
import AdminInventory from './pages/admin/AdminInventory';
import AdminSuppliers from './pages/admin/AdminSuppliers';
import AdminClients from './pages/admin/AdminClients';
import AdminProfile from './pages/admin/AdminProfile';

const AnimatedRoutes = () => {
  const location = useLocation();

  return (
    <AnimatePresence mode="wait">
      <Routes location={location} key={location.pathname}>
        <Route path="/" element={<Navigate to="/dashboard" />} />
        
        {/* Auth */}
        <Route path="/login" element={<AnimatedPage><Login /></AnimatedPage>} />
        <Route path="/register" element={<AnimatedPage><Register /></AnimatedPage>} />
        <Route path="/track" element={<AnimatedPage><TrackShipment /></AnimatedPage>} />
        
        {/* Client Routes */}
        <Route path="/dashboard" element={<ProtectedRoute clientOnly={true}><AnimatedPage><ClientDashboard /></AnimatedPage></ProtectedRoute>} />
        <Route path="/orders" element={<ProtectedRoute clientOnly={true}><AnimatedPage><ClientOrders /></AnimatedPage></ProtectedRoute>} />
        <Route path="/shipments" element={<ProtectedRoute clientOnly={true}><AnimatedPage><ClientShipments /></AnimatedPage></ProtectedRoute>} />
        <Route path="/suppliers" element={<ProtectedRoute clientOnly={true}><AnimatedPage><ClientSuppliers /></AnimatedPage></ProtectedRoute>} />
        <Route path="/profile" element={<ProtectedRoute clientOnly={true}><AnimatedPage><ClientProfile /></AnimatedPage></ProtectedRoute>} />

        {/* Admin Routes */}
        <Route path="/admin/dashboard" element={<ProtectedRoute adminOnly={true}><AnimatedPage><AdminDashboard /></AnimatedPage></ProtectedRoute>} />
        <Route path="/admin/orders" element={<ProtectedRoute adminOnly={true}><AnimatedPage><AdminOrders /></AnimatedPage></ProtectedRoute>} />
        <Route path="/admin/shipments" element={<ProtectedRoute adminOnly={true}><AnimatedPage><AdminShipments /></AnimatedPage></ProtectedRoute>} />
        <Route path="/admin/inventory" element={<ProtectedRoute adminOnly={true}><AnimatedPage><AdminInventory /></AnimatedPage></ProtectedRoute>} />
        <Route path="/admin/suppliers" element={<ProtectedRoute adminOnly={true}><AnimatedPage><AdminSuppliers /></AnimatedPage></ProtectedRoute>} />
        <Route path="/admin/clients" element={<ProtectedRoute adminOnly={true}><AnimatedPage><AdminClients /></AnimatedPage></ProtectedRoute>} />
        <Route path="/admin/profile" element={<ProtectedRoute adminOnly={true}><AnimatedPage><AdminProfile /></AnimatedPage></ProtectedRoute>} />
        
        {/* Fallback */}
        <Route path="*" element={<Navigate to="/dashboard" />} />
      </Routes>
    </AnimatePresence>
  );
};

export default AnimatedRoutes;
