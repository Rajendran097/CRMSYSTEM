import React from 'react';
import { useAuth } from './AuthProvider';
import { useRolesConfig } from './RolesConfigProvider';
import { Typography, Spin } from 'antd';

const RoleActions = () => {
    const { user, loading, error } = useAuth();
    const rolesConfig = useRolesConfig();

    if (loading) {
        return <Spin />;
    }

    if (error) {
        return <div>Error: {error}</div>;
    }

    if (!user) {
        return <div>Please log in.</div>;
    }

    const roleId = user.employeeStatus;
    const userRole = Object.keys(rolesConfig).find(role => rolesConfig[role].id === roleId);

    const renderActions = () => {
        if (userRole && rolesConfig[userRole]) {
            const { permissions } = rolesConfig[userRole];
            return (
                <div>
                    <Typography.Title level={4}>{userRole.replace('_', ' ').toUpperCase()} Actions</Typography.Title>
                    <ul>
                        {permissions.map(permission => (
                            <li key={permission}>{permission.replace('_', ' ').toUpperCase()}</li>
                        ))}
                    </ul>
                </div>
            );
        }
        return <div>You do not have access to any specific role actions.</div>;
    };

    return <div>{renderActions()}</div>;
};

export default RoleActions;