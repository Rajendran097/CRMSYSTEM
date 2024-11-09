import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Typography, Input, Button, Form, Select, DatePicker, message } from 'antd';
import moment from 'moment'; // Import moment

const { Option } = Select;

function AssignTask() {
    const [form] = Form.useForm();
    const [employees, setEmployees] = useState([]);

    useEffect(() => {
        const fetchEmployees = async () => {
            try {
                const response = await axios.get('https://localhost:7231/api/Employee');
                setEmployees(response.data); 
            } catch (error) {
                console.error('Failed to fetch employees:', error);
                message.error('Failed to load employees. Please try again.');
            }
        };

        fetchEmployees();
    }, []);

    const onFinish = async (values) => {
        const selectedEmployee = employees.find(emp => emp.empCode === values.employee);
        
        const newTask = {
            taskName: values.taskName,
            empCode: selectedEmployee?.empCode || values.employee, 
            empName: selectedEmployee?.empName || values.employee, 
            targetDate: values.targetDate.toISOString(), 
            taskStatus: 'Pending',
            remarks: values.remarks || '', 
        };

        try {
            const response = await axios.post('https://localhost:7231/api/Task', newTask);
            if (response.status === 201) {
                message.success('Task assigned successfully.');
                form.resetFields();
            }
        } catch (error) {
            console.error('Error creating task:', error);
            if (error.response) {
                console.error('Response data:', error.response.data);
                message.error(`Failed to assign task: ${error.response.data}`);
            } else {
                message.error('Failed to assign task. Please try again.');
            }
        }
    };

    // Function to disable past dates
    const disablePastDates = (current) => {
        // Disable dates before today
        return current && current < moment().startOf('day');
    };

    return (
        <div style={{ padding: '20px' }}>
            <Typography.Title level={3}>Assign Task</Typography.Title>
            <Form form={form} layout="vertical" onFinish={onFinish}>
                <Form.Item
                    name="taskName"
                    label="Task Name"
                    rules={[{ required: true, message: 'Please enter the task name' }]}
                >
                    <Input 
                        placeholder="Enter Task Name" 
                        onChange={(e) => form.setFieldsValue({ taskName: e.target.value.toUpperCase() })} // Convert to uppercase
                    />
                </Form.Item>
                <Form.Item
                    name="employee"
                    label="Select Employee"
                    rules={[{ required: true, message: 'Please select an employee' }]}
                >
                    <Select placeholder="Select Employee">
                        {employees.map((employee) => (
                            <Option key={employee.id} value={employee.empCode}>
                                {employee.empName}
                            </Option>
                        ))}
                    </Select>
                </Form.Item>
                <Form.Item
                    name="targetDate"
                    label="Set Target Date"
                    rules={[{ required: true, message: 'Please select a target date' }]}
                >
                    <DatePicker 
                        style={{ width: '100%' }} 
                        disabledDate={disablePastDates} // Add this line to disable past dates
                    />
                </Form.Item>
                <Form.Item
                    name="remarks"
                    label="Remarks"
                    rules={[{ required: false }]} 
                >
                    <Input.TextArea 
                        rows={4} 
                        placeholder="Enter any remarks (optional)" 
                        onChange={(e) => form.setFieldsValue({ remarks: e.target.value.toUpperCase() })} // Convert to uppercase
                    />
                </Form.Item>
                <Form.Item>
                    <Button type="primary" htmlType="submit" style={{ width: '100%' }}>Submit Task</Button>
                </Form.Item>
            </Form>
        </div>
    );
}

export default AssignTask;