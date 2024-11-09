import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Typography, Input, Button, Form, DatePicker, message } from 'antd';
import moment from 'moment';
import { useNavigate } from 'react-router-dom';

function UpdateTask() {
    const [form] = Form.useForm();
    const [taskDetails, setTaskDetails] = useState(null);
    const taskId = 32; // This should ideally be dynamic
    const navigate = useNavigate();

    useEffect(() => {
        const fetchTaskDetails = async () => {
            try {
                const response = await axios.get(`https://localhost:7231/api/Task/${taskId}`);
                if (response.status === 200) {
                    setTaskDetails(response.data);
                    form.setFieldsValue({
                        taskName: response.data.taskName,
                        targetDate: moment(response.data.targetDate),
                        remarks: response.data.remarks,
                    });
                } else {
                    message.error(`Failed to load task details: ${response.statusText}`);
                }
            } catch (error) {
                console.error('Failed to fetch task details:', error);
                message.error('Failed to load task details. Please try again.');
            }
        };

        fetchTaskDetails();
    }, [taskId]);

    const onFinish = async (values) => {
        try {
            const updatedTask = {
                ...taskDetails,
                remarks: values.remarks || '',
            };

            const response = await axios.put(`https://localhost:7231/api/Task/${taskId}`, updatedTask);
            if (response.status === 200) {
                message.success('Task updated successfully.');
                form.resetFields();
                navigate('/dashboard');
            }
        } catch (error) {
            console.error('Error updating task:', error);
            message.error('Failed to update task. Please try again.');
        }
    };

    return (
        <div style={{ padding: '20px' }}>
            <Typography.Title level={3}>Update Task</Typography.Title>
            {taskDetails && (
                <Form form={form} layout="vertical" onFinish={onFinish}>
                    <Form.Item name="taskName" label="Task Name" rules={[{ required: true }]}>
                        <Input disabled />
                    </Form.Item>
                    <Form.Item name="targetDate" label="Target Date" rules={[{ required: true }]}>
                        <DatePicker style={{ width: '100%' }} disabled />
                    </Form.Item>
                    <Form.Item name="remarks" label="Remarks">
                        <Input.TextArea rows={4} />
                    </Form.Item>
                    <Form.Item>
                        <Button type="primary" htmlType="submit">Update Task</Button>
                    </Form.Item>
                </Form>
            )}
        </div>
    );
}

export default UpdateTask;