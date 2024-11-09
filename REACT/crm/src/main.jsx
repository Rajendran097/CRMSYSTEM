import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App'; 
import { BrowserRouter as Router } from 'react-router-dom'; // Correctly import Router
import { AuthProvider } from './components/UserAuth/AuthProvider';
import RolesConfigProvider from './components/UserAuth/RolesConfigProvider';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
    <React.StrictMode>
        <Router>  
            <AuthProvider>
                <RolesConfigProvider>
                    <App />
                </RolesConfigProvider>
            </AuthProvider>
        </Router>
    </React.StrictMode>
);