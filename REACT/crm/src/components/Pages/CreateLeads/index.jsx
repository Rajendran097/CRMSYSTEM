// CreateLeads.js
import React, { useState, useEffect } from 'react';
import { Form, Input, Button, message, DatePicker, Select } from 'antd';
import moment from 'moment';
import PropTypes from 'prop-types';
import { useLocation, useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2'; // Import SweetAlert2

function CreateLeads({ existingLeads = [] }) {
    const [loading, setLoading] = useState(false);
    const [lastId, setLastId] = useState(0);
    const [form] = Form.useForm();
    const [selectedScheme, setSelectedScheme] = useState('');
    
    const location = useLocation(); // Using useLocation to retrieve passed state
    const navigate = useNavigate();
    const currentLead = location.state?.currentLead;

    const schemeLimits = {
        sx: 100000,
        mx: 1000000,
        ux: 5000000,
    };

    const leadsArray = Array.isArray(existingLeads) ? existingLeads : [];

    useEffect(() => {
        if (leadsArray.length > 0) {
            const maxId = Math.max(...leadsArray.map(lead => parseInt(lead.LeadId.replace('LDN', ''), 10)));
            setLastId(maxId);
        }

     
        
    }, [leadsArray, currentLead, form]);

    const onFinish = async (values) => {
        setLoading(true);
        const formattedDob = values.dob ? values.dob.format('YYYY-MM-DD') : null;
        const age = formattedDob ? moment().diff(moment(formattedDob, 'YYYY-MM-DD'), 'years') : null;

        if (age !== null && age < 18) {
            message.error('You must be at least 18 years old.');
            setLoading(false);
            return;
        }

        if (!currentLead) {
            const exists = leadsArray.some(lead => 
                lead.LeadName === values.name &&
                lead.Phone === values.phone &&
                lead.DOB === formattedDob
            );

            if (exists) {
                message.error('A lead with the same Name, Phone number, and Date of Birth already exists.');
                setLoading(false);
                return;
            }
        }

        const newLeadId = currentLead ? currentLead.LeadId : `LDN${String(lastId + 1).padStart(5, '0')}`;

        const newLead = {
            LeadId: newLeadId,
            LeadName: values.name,
            Phone: values.phone,
            Address: values.address,
            DOB: formattedDob,
            Gender: values.gender,
            SchemeName: values.schemeName,
            LoanAmount: Number(values.loanAmount),
            leadStatus: currentLead ? currentLead.leadStatus : 'NEW LEAD',
        };

        try {
            const method = currentLead ? 'PUT' : 'POST';
            const url = currentLead ? `https://localhost:7231/api/Lead/${currentLead.LeadId}` : 'https://localhost:7231/api/Lead';

            const response = await fetch(url, {
                method,
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(newLead),
            });

            if (!response.ok) {
                const errorResponse = await response.json();
                const errorMessage = errorResponse?.message || 'Failed to create/update lead. Please try again later.';
                message.error(errorMessage);
            } else {
                await Swal.fire({
                    title: 'Success!',
                    text: `Lead ${currentLead ? 'updated' : 'created'} successfully.`,
                    icon: 'success',
                    confirmButtonText: 'Ok'
                });

                form.resetFields(); // Reset fields after a successful submission
                navigate('/dashboard'); // Redirect to the dashboard
            }
        } catch (error) {
            message.error('Failed to create/update lead. Please check your network and try again.');
        } finally {
            setLoading(false);
        }
    };

    const validatePhoneNumber = (rule, value) => {
        const phonePattern = /^[6789]\d{9}$/;
        if (!value) {
            return Promise.reject(new Error('Please input your phone number!'));
        }
        if (!phonePattern.test(value)) {
            return Promise.reject(new Error('Invalid number! Must start with 6, 7, 8, or 9 and be 10 digits long.'));
        }
        return Promise.resolve();
    };

    const handlePhoneChange = (e) => {
        const value = e.target.value.replace(/[^0-9]/g, '');
        form.setFieldsValue({ phone: value });
    };

    const handleSchemeChange = (value) => {
        setSelectedScheme(value);
        form.setFieldsValue({ loanAmount: schemeLimits[value] });
    };

    const validateLoanAmount = (_, value) => {
        const maxLoanAmount = schemeLimits[selectedScheme];

        if (!value) {
            return Promise.reject(new Error('Please input the loan amount!'));
        }

        const numberValue = Number(value);

        if (isNaN(numberValue)) {
            return Promise.reject(new Error('Loan amount must be a number!'));
        }
        if (numberValue > maxLoanAmount) {
            return Promise.reject(new Error(`Loan amount must not exceed ₹${maxLoanAmount.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")} for the selected scheme!`));
        }
        if (numberValue <= 0) {
            return Promise.reject(new Error('Loan amount must be greater than zero!'));
        }

        return Promise.resolve();
    };

    return (
        <Form form={form} layout="vertical" onFinish={onFinish}>
            <Form.Item name="name" label="Name" rules={[{ required: true, message: 'Please input the name!' }]}>
                <Input onChange={(e) => form.setFieldsValue({ name: e.target.value.toUpperCase() })} />
            </Form.Item>
            <Form.Item name="phone" label="Phone" rules={[{ validator: validatePhoneNumber }]}>
                <Input onChange={handlePhoneChange} maxLength={10} />
            </Form.Item>
            <Form.Item name="address" label="Address" rules={[{ max: 40, message: 'Address must be at most 40 characters long!' }]}>
                <Input onChange={(e) => form.setFieldsValue({ address: e.target.value.toUpperCase() })} maxLength={40} />
            </Form.Item>
            <Form.Item name="dob" label="Date of Birth" rules={[{ required: true, message: 'Please select a date of birth!' }]}>
                <DatePicker 
                    format="DD/MM/YYYY"  
                    disabledDate={(current) => current && current > moment().endOf('day')}
                    onChange={(date) => {
                        if (date) {
                            form.setFieldsValue({ dob: date });
                        }
                    }}
                />
            </Form.Item>
            <Form.Item name="gender" label="Gender" rules={[{ required: true, message: 'Please select your gender!' }]}>
                <Select placeholder="Select your gender">
                    <Select.Option value="male">Male</Select.Option>
                    <Select.Option value="female">Female</Select.Option>
                    <Select.Option value="other">Other</Select.Option>
                </Select>
            </Form.Item>
            <Form.Item name="schemeName" label="Scheme Name" rules={[{ required: true, message: 'Please select a scheme!' }]}>
                <Select placeholder="Select a scheme" onChange={handleSchemeChange}>
                    <Select.Option value="sx">SX - 100,000</Select.Option>
                    <Select.Option value="mx">MX - 1,000,000</Select.Option>
                    <Select.Option value="ux">UX - 5,000,000</Select.Option>
                </Select>
            </Form.Item>
            <Form.Item name="loanAmount" label="Loan Amount" rules={[{ required: true, message: 'Please input the loan amount!' }, { validator: validateLoanAmount }]}>
                <Input type="number" />
            </Form.Item>
            <Form.Item>
                <Button type="primary" htmlType="submit" loading={loading}>
                    {currentLead ? 'Update Lead' : 'Create Lead'}
                </Button>
            </Form.Item>
        </Form>
    );
}

// Define prop types
CreateLeads.propTypes = {
    existingLeads: PropTypes.array,
};

export default CreateLeads;