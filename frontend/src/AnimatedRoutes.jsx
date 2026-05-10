import React from 'react';
import { Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { AnimatePresence } from 'framer-motion';

import ProtectedRoute from './components/ProtectedRoute';
import AnimatedPage from './components/AnimatedPage';

import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import Orders from './pages/Orders';
import Inventory from './pages/Inventory';
import Shipments from './pages/Shipments';
import Suppliers from './pages/Suppliers';

const AnimatedRoutes = () => {
  const location = useLocation();

  return (
    <AnimatePresence mode="wait">
      <Routes location={location} key={location.pathname}>
        <Route path="/" element={<Navigate to="/dashboard" />} />
        <Route path="/login" element={<AnimatedPage><Login /></AnimatedPage>} />
        <Route path="/register" element={<AnimatedPage><Register /></AnimatedPage>} />
        
        <Route path="/dashboard" element={<ProtectedRoute><AnimatedPage><Dashboard /></AnimatedPage></ProtectedRoute>} />
        <Route path="/orders" element={<ProtectedRoute><AnimatedPage><Orders /></AnimatedPage></ProtectedRoute>} />
        <Route path="/inventory" element={<ProtectedRoute><AnimatedPage><Inventory /></AnimatedPage></ProtectedRoute>} />
        <Route path="/shipments" element={<ProtectedRoute><AnimatedPage><Shipments /></AnimatedPage></ProtectedRoute>} />
        <Route path="/suppliers" element={<ProtectedRoute><AnimatedPage><Suppliers /></AnimatedPage></ProtectedRoute>} />
      </Routes>
    </AnimatePresence>
  );
};

export default AnimatedRoutes;
