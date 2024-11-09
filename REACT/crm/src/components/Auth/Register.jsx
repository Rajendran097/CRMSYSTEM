import React, { useState } from 'react';
import { Form, Input, Button, Typography, message } from 'antd';

const { Title } = Typography;

const Register = ({ onRegister, onGoToLogin }) => {
    const [loading, setLoading] = useState(false);
    const [form] = Form.useForm(); // Create a form instance

    const handleRegister = async (values) => {
        setLoading(true);
        try {
            // Convert only the name to uppercase before sending to API
            const upperCaseValues = {
                EmpName: values.EmpName.toUpperCase(),
                Phone: values.Phone,
                Email: values.Email, // keeping email as is
                PasswordHash: values.PasswordHash, // keeping password as is
            };

            const response = await fetch('https://localhost:7231/api/Employee/register', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(upperCaseValues),
            });

            if (response.ok) {
                const newUser = await response.json();
                message.success('Registration successful! You can now log in.');
                onGoToLogin(); // Call to redirect to login
            } else {
                const errorMessage = await response.text();
                message.error(`Registration failed: ${errorMessage}`);
            }
        } catch (error) {
            message.error('Registration failed. Please try again.');
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    const validatePhone = (_, value) => {
        if (!value) {
            return Promise.reject(new Error('Please input your phone number!'));
        }
        const phone = value.replace(/\D/g, ''); // Remove non-digit characters
        const isValid = /^([6789][0-9]{9})$/.test(phone); // Ensure it starts with 6, 7, 8, or 9 and is 10 digits
        
        if (!isValid) {
            return Promise.reject(new Error('Phone number must be exactly 10 digits and start with 6, 7, 8, or 9.'));
        }
        return Promise.resolve();
    };

    const handlePhoneChange = (e) => {
        const value = e.target.value.replace(/[^0-9]/g, ''); // Allow only numbers
        form.setFieldsValue({ Phone: value }); // Update form field
    };

    return (
        <div style={{ maxWidth: 300, margin: 'auto' }}>
            <Title level={2}>Register</Title>
            <Form form={form} onFinish={handleRegister}>
                <Form.Item name="EmpName" rules={[{ required: true, message: 'Please input your name!' }]}>
                    <Input 
                        placeholder="Name" 
                        onChange={(e) => form.setFieldsValue({ EmpName: e.target.value.toUpperCase() })} // Convert name to uppercase
                    />
                </Form.Item>
                <Form.Item name="Phone" rules={[{ validator: validatePhone }]}>
                    <Input 
                        placeholder="Phone" 
                        onChange={handlePhoneChange} // Handle phone input change
                        maxLength={10} // Limit input to 10 digits
                    />
                </Form.Item>
                <Form.Item name="Email" rules={[{ required: true, type: 'email', message: 'Please input your email!' }]}>
                    <Input 
                        placeholder="Email" 
                    />
                </Form.Item>
                <Form.Item name="PasswordHash" rules={[{ required: true, message: 'Please input your password!' }]}>
                    <Input.Password 
                        placeholder="Password"
                    />
                </Form.Item>
                <Form.Item>
                    <Button type="primary" htmlType="submit" loading={loading}>
                        Register
                    </Button>
                </Form.Item>
            </Form>
            {/* Button to go back to the login page */}
            <Button type="link" onClick={onGoToLogin} style={{ padding: 0 }}>
                Already have an account? Log in
            </Button>
        </div>
    );
};

export default Register;