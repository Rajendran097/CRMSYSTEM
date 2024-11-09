import React, { useState } from 'react';
import { Typography, Button, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle } from '@mui/material';
import { MailOutlined, BellFilled } from '@ant-design/icons';
import { Badge, Space } from 'antd';
import { useNavigate } from 'react-router-dom';

function AppHeader({ onLogout, employeeName }) {
    const navigate = useNavigate();
    const [open, setOpen] = useState(false);

    // Function to open the logout confirmation dialog
    const handleLogout = () => {
        setOpen(true);
    };

    const handleClose = () => {
        setOpen(false);
    };

    // Confirm logout action
    const confirmLogout = () => {
        onLogout();
        navigate('/');
        handleClose();
    };

    return (
        <div className="AppHeader" style={{ 
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center' }}>
            <div style={{ display: 'flex', alignItems: 'center' }}>
                <img width={60} src="/crmlogo.jpg" alt="logo" className="logo" />
                <Typography variant="h6" className="headerTitle" style={{ marginLeft: '10px' }}>
                    CRM SYSTEM
                </Typography>
                {/* Display employee name when logged in */}
                {employeeName && (
                    <Typography variant="h6" style={{ marginLeft: '20px' }}>
                        {`Hello, ${employeeName}`}
                    </Typography>
                )}
            </div>

            <Space className="notificationIcons" style={{ display: 'flex', alignItems: 'center' }}>
                <Badge count={30} dot>
                    <MailOutlined style={{ fontSize: 24 }} />
                </Badge>
                <Badge count={20}>
                    <BellFilled style={{ fontSize: 24 }} />
                </Badge>
                <Button
                    variant="contained"
                    color="secondary"
                    onClick={handleLogout}
                    style={{ marginLeft: '20px' }}
                >
                    Logout
                </Button>

                {/* Confirmation Dialog */}
                <Dialog open={open} onClose={handleClose}>
                    <DialogTitle>Logout Confirmation</DialogTitle>
                    <DialogContent>
                        <DialogContentText>
                            Are you sure you want to logout?
                        </DialogContentText>
                    </DialogContent>
                    <DialogActions>
                        <Button onClick={handleClose} color="primary">
                            NO
                        </Button>
                        <Button onClick={confirmLogout} color="secondary" autoFocus>
                            YES
                        </Button>
                    </DialogActions>
                </Dialog>
            </Space>
        </div>
    );
}

export default AppHeader;