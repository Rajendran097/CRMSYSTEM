import React from 'react';
import { Menu } from 'antd';
import { useNavigate } from 'react-router-dom';
import {
    ShopOutlined,
    DashboardOutlined,
    UserAddOutlined,
    FileSearchOutlined,
    FileDoneOutlined,
    BarChartOutlined,
    UserOutlined,
    EditOutlined
} from '@ant-design/icons';

const SideMenu = ({ tasks }) => {
    const navigate = useNavigate();  // Correct placement

    // Log the tasks to see what is being passed
    console.log("Tasks: ", tasks);

    return (
        <div className="SideMenu">
            <Menu
                onClick={(item) => navigate(item.key)}  // Correct navigation setup
                items={[
                    { label: "Dashboard", key: '/dashboard', icon: <DashboardOutlined /> },
                    { label: "Assign Task", key: '/assigntask', icon: <UserAddOutlined /> },
                    { label: "Update Task", key: '/updatetask', icon: <EditOutlined  /> },
                    { label: "Create Leads", key: '/createleads', icon: <ShopOutlined /> },
                    { label: "Followup Leads", key: '/followupleads', icon: <FileSearchOutlined /> },
                    { label: "Approved Leads", key: '/approvedleads', icon: <FileDoneOutlined /> },
                    { label: "Reports", key: '/reports', icon: <BarChartOutlined /> },
                    { label: "User Profile", key: '/userprofile', icon: <UserOutlined /> },
                  
                    
                ]}
            />
        </div>
    );
}

export default SideMenu;