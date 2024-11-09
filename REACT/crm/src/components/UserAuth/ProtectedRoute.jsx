import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from './AuthProvider';
import rolesConfig from './RolesConfigProvider';

const ProtectedRoute = ({ children, requiredRoles }) => {
    const { user, loading } = useAuth();

    if (loading) {
        return <div>Loading...</div>;
    }

    if (!user) {
        return <Navigate to="/" replace />;
    }

    const userRole = Object.keys(rolesConfig).find(role => rolesConfig[role].id === user.employeeStatus);

    if (!userRole || (requiredRoles && !requiredRoles.includes(userRole))) {
        return <div>You do not have access to this page.</div>;
    }

    return <>{children}</>;
};

export default ProtectedRoute;