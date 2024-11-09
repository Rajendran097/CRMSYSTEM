import React, { createContext, useContext } from 'react';

const rolesConfig = {
    ADMIN: {
        id: 1,
        permissions: [
            'assign_task',
            'update_task',
            'delete_task',
            'approve_lead',
            'return_lead',
            'delete_lead',
            'assign_role',
            'update_role',
        ],
    },
    SALES_OFFICER: {
        id: 3,
        permissions: [
            'update_task',
            'create_lead',
            'update_lead',
        ],
    },
    SALES_HEAD: {
        id: 2,
        permissions: [
            'update_task',
            'return_lead',
            'recommend_lead',
        ],
    },
};

const RolesConfigContext = createContext();

export const RolesConfigProvider = ({ children }) => {
    return (
        <RolesConfigContext.Provider value={rolesConfig}>
            {children}
        </RolesConfigContext.Provider>
    );
};

export const useRolesConfig = () => {
    return useContext(RolesConfigContext);
};

export default RolesConfigProvider;