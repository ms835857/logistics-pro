import React, { useContext } from 'react';
import { Navigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';

const ProtectedRoute = ({ children, adminOnly = false, clientOnly = false }) => {
    const { currentUser, loading } = useContext(AuthContext);

    if (loading) return <div className="min-h-screen flex items-center justify-center">Loading...</div>;

    if (!currentUser) {
        return <Navigate to="/login" />;
    }

    if (adminOnly && currentUser.role !== 'admin') {
        return <Navigate to="/dashboard" />;
    }

    if (clientOnly && currentUser.role === 'admin') {
        return <Navigate to="/admin/dashboard" />;
    }

    return children;
};

export default ProtectedRoute;
