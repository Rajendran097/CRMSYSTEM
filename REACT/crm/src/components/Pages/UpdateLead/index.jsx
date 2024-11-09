import React, { useState, useEffect } from 'react';
import { Form, Input, Button, message, DatePicker, Select } from 'antd';
import moment from 'moment';
import { useParams, useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';
import axios from 'axios';

const UpdateLeads = () => {
    const { leadId } = useParams(); // Getting leadId from the route params
    const [loading, setLoading] = useState(false);
    const [form] = Form.useForm();
    const navigate = useNavigate();
    const [lead, setLead] = useState(null); // To hold fetched lead data

    const schemeLimits = {
        sx: 100000,
        mx: 1000000,
        ux: 5000000,
    };

    useEffect(() => {
        const fetchLeadDetails = async () => {
            try {
                const response = await axios.get(`https://localhost:7231/api/lead/${leadId}`);
                
                if (response.data) {
                    setLead(response.data);
                    
                    form.setFieldsValue({
                        name: response.data.leadName,
                        phone: response.data.phone,
                        address: response.data.address,
                        dob: moment(response.data.dOB), // set moment date object for DatePicker
                        gender: response.data.gender,
                        schemeName: response.data.schemeName,
                        loanAmount: response.data.loanAmount,
                    });
                } else {
                    message.error('Lead not found.');
                    navigate('/dashboard'); // Redirect if lead isn't found
                }
            } catch (error) {
                console.error('Error fetching lead details:', error);
                message.error('Failed to fetch lead details. Please check your network and try again.');
            }
        };

        fetchLeadDetails();
    }, [leadId, form, navigate]);

    const validatePhoneNumber = (_, value) => {
        const phonePattern = /^[6789]\d{9}$/;
        if (!value) {
            return Promise.reject(new Error('Please input your phone number!'));
        }
        if (!phonePattern.test(value)) {
            return Promise.reject(new Error('Invalid number! Must start with 6, 7, 8, or 9 and be 10 digits long.'));
        }
        return Promise.resolve();
    };

    const onFinish = async (values) => {
        setLoading(true);
        try {
            const formattedDob = values.dob ? values.dob.format('YYYY-MM-DD') : null;

            // Validate age - must be at least 18 years old
            const age = formattedDob ? moment().diff(moment(formattedDob), 'years') : null;
            if (age !== null && age < 18) {
                message.error('You must be at least 18 years old.');
                setLoading(false);
                return;
            }

            const updatedLead = {
                LeadId: leadId,
                LeadName: values.name,
                Phone: values.phone,
                Address: values.address,
                DOB: formattedDob,
                Gender: values.gender,
                SchemeName: values.schemeName,
                LoanAmount: Number(values.loanAmount),
                leadStatus: "UPDATED", // Set status to UPDATED
            };

            const response = await axios.put(`https://localhost:7231/api/lead/${leadId}`, updatedLead);
            if (response.status === 200 || response.status === 204) {
                await Swal.fire({
                    title: 'Success!',
                    text: 'Lead updated successfully.',
                    icon: 'success',
                    confirmButtonText: 'Ok',
                });
                form.resetFields(); // Reset the fields after a successful update
                navigate('/followupleads'); // Redirect after updating
            } else {
                message.error('Failed to update lead. Server responded with an unexpected status.');
            }
        } catch (error) {
            console.error('Update error:', error);
            if (error.response) {
                message.error(`Failed to update lead: ${error.response.data.message || 'An error occurred'}`);
            } else if (error.request) {
                message.error('Failed to update lead: No response received from the server.');
            } else {
                message.error('Failed to update lead: ' + error.message);
            }
        } finally {
            setLoading(false);
        }
    };

    const handlePhoneChange = (e) => {
        const value = e.target.value.replace(/[^0-9]/g, '');
        form.setFieldsValue({ phone: value });
    };

    const handleSchemeChange = (value) => {
        form.setFieldsValue({ loanAmount: schemeLimits[value] });
    };

    const validateLoanAmount = (_, value) => {
        const maxLoanAmount = schemeLimits[form.getFieldValue('schemeName')];
        if (!value) {
            return Promise.reject(new Error('Please input the loan amount!'));
        }

        const numberValue = Number(value);
        if (isNaN(numberValue)) {
            return Promise.reject(new Error('Loan amount must be a number!'));
        }
        if (numberValue > maxLoanAmount) {
            return Promise.reject(new Error(`Loan amount must not exceed ₹${maxLoanAmount.toLocaleString()} for the selected scheme!`));
        }
        if (numberValue <= 0) {
            return Promise.reject(new Error('Loan amount must be greater than zero!'));
        }

        return Promise.resolve();
    };

    if (!lead) return <div>Loading...</div>; // Handle loading state

    return (
        <Form form={form} layout="vertical" onFinish={onFinish}>
            <Form.Item name="name" label="Lead Name" rules={[{ required: true, message: 'Please input the name!' }]}>
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
                    Update Lead
                </Button>
            </Form.Item>
        </Form>
    );
};

export default UpdateLeads;