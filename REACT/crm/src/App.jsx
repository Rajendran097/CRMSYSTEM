import React, { useState } from 'react';
import { Layout, message } from 'antd';
import SideMenu from './components/SideMenu';
import AppRoutes from './components/AppRoutes';
import AppFooter from './components/AppFooter';
import Login from './components/Auth/Login';
import AppHeader from './components/Appheader';
import './App.css';

const { Header, Sider, Content } = Layout;

const App = () => {
    const [leads, setLeads] = useState([]);
    
    const [user, setUser] = useState(() => {
        const savedUser = localStorage.getItem('user');
        return savedUser ? JSON.parse(savedUser) : null; 
    });

    const handleLogin = (userInfo) => {
        setUser(userInfo); // Using the userInfo directly from API
        localStorage.setItem('user', JSON.stringify(userInfo));
    };

    const handleLogout = () => {
        setUser(null);
        localStorage.removeItem('user');
        message.success('You have successfully logged out!');
    };

    if (!user) {
        return (
            <Layout style={{ minHeight: '100vh', justifyContent: 'center', alignItems: 'center' }}>
                <Login onLogin={handleLogin} />
            </Layout>
        );
    }

    return (
        <Layout style={{ minHeight: '100vh' }}>
            <Sider width={200}>
                <SideMenu userRole={user.role} />
            </Sider>
            <Layout>
                <Header style={{ background: '#fff', padding: 0 }}>
                    <AppHeader 
                        onLogout={handleLogout} 
                        employeeName={user.empName} 
                    />
                </Header>
                <Content style={{ padding: '20px', flex: 1 }}>
                    <AppRoutes
                        user={user}
                        addLead={setLeads}
                        leads={leads}
                    />
                </Content>
                <Layout.Footer style={{ background: '#fff' }}>
                    <AppFooter />
                </Layout.Footer>
            </Layout>
        </Layout>
    );
};

export default App;