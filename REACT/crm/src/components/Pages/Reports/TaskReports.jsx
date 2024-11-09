// src/Pages/TaskReports.js

import React, { useEffect, useState } from 'react';
import { Table, Button, DatePicker } from 'antd';
import axios from 'axios';
import * as XLSX from 'xlsx';

// Task status mapping
const taskStatusMap = {
    Pending: 'Pending',
    InProgress: 'In Progress',
    Completed: 'Completed',
    Cancelled: 'Cancelled',
};

const TaskReports = () => {
    const [taskData, setTaskData] = useState([]);
    const [dateRange, setDateRange] = useState([null, null]);

    // Fetch task reports data from API
    const fetchTaskReports = async () => {
        try {
            const response = await axios.get('https://localhost:7231/api/Task');
            const tasks = response.data;

            // Map tasks to report format
            const reports = tasks.map((task, index) => ({
                key: index + 1,
                taskId: task.id || 'N/A', // Ensure ID from response matches your backend task entity structure
                taskName: task.taskName || 'N/A',
                empCode: task.empCode || 'N/A',
                empName: task.empName || 'N/A',
                targetDate: task.targetDate ? new Date(task.targetDate).toLocaleDateString() : 'N/A',
                taskStatus: taskStatusMap[task.taskStatus] || 'N/A', // Use task status mapping
                remarks: task.remarks || 'N/A',
            }));

            setTaskData(reports);
        } catch (error) {
            console.error('Error fetching task reports:', error);
        }
    };

    useEffect(() => {
        fetchTaskReports();
    }, []);

    // Function for exporting task data to Excel
    const exportToExcel = () => {
        const ws = XLSX.utils.json_to_sheet(taskData);
        const wb = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(wb, ws, 'Task Reports');
        XLSX.writeFile(wb, 'TaskReports.xlsx');
    };

    const columns = [
        {
            title: 'Task ID',
            dataIndex: 'taskId',
            key: 'taskId',
        },
        {
            title: 'Task Name',
            dataIndex: 'taskName',
            key: 'taskName',
        },
        {
            title: 'Employee Code',
            dataIndex: 'empCode',
            key: 'empCode',
        },
        {
            title: 'Employee Name',
            dataIndex: 'empName',
            key: 'empName',
        },
        {
            title: 'Target Date',
            dataIndex: 'targetDate',
            key: 'targetDate',
        },
        {
            title: 'Task Status',
            dataIndex: 'taskStatus',
            key: 'taskStatus',
        },
        {
            title: 'Remarks',
            dataIndex: 'remarks',
            key: 'remarks',
        }
    ];

    return (
        <div>
            <h1>Task Reports</h1>

            {/* Date Range Selection - Optional for filtering */}
            <DatePicker.RangePicker 
                onChange={(dates) => setDateRange(dates)} 
                style={{ marginBottom: '20px' }}
            />

            <Button onClick={exportToExcel} type="default" style={{ marginRight: '10px' }}>
                Export to Excel
            </Button>

            {taskData.length > 0 ? (
                <Table
                    dataSource={taskData}
                    columns={columns}
                    rowKey="taskId"
                    style={{ marginTop: '20px' }}
                />
            ) : (
                <p>No tasks available to display.</p>
            )}
        </div>
    );
};

export default TaskReports;