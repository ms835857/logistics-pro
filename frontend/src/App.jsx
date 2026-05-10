import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import Navbar from './components/Navbar';
import ProtectedRoute from './components/ProtectedRoute';
import AnimatedRoutes from './AnimatedRoutes';
import { Toaster } from 'react-hot-toast';
import NetworkBackground from './components/NetworkBackground';

function App() {
  return (
    <AuthProvider>
      <Router>
        <div className="min-h-screen bg-transparent text-text relative">
          <NetworkBackground />
          <Toaster position="top-right" toastOptions={{
            style: {
              background: '#1e293b',
              color: '#fff',
              border: '1px solid rgba(255, 255, 255, 0.1)'
            }
          }} />
          <Navbar />
          <main className="p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto animate-fade-in relative z-10">
            <AnimatedRoutes />
          </main>
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;
