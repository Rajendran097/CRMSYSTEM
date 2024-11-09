// src/Pages/Reports/Reports.js

import React, { useState } from 'react';
import axios from 'axios'; // Import Axios
import { Radio, Button, Typography, message, Table } from 'antd';

const { Title } = Typography;

const Reports = () => {
    const [reportType, setReportType] = useState('lead'); // Default to "lead"
    const [reportData, setReportData] = useState([]); // Changed to array to accommodate the reports

    const handleReportTypeChange = (e) => {
        setReportType(e.target.value);
        setReportData([]); // Reset report data when changing type
    };

    const fetchReportData = async () => {
        const url = reportType === 'lead' 
            ? 'https://localhost:7231/api/Lead' 
            : 'https://localhost:7231/api/Task';

        try {
            const response = await axios.get(url);
            setReportData(response.data); // Set report data from the API response
        } catch (error) {
            console.error("Error fetching report data:", error);
            message.error('Failed to fetch report data.'); // Show error message
        }
    };

    const handleViewReport = () => {
        console.log("Fetching report for type...", reportType);
        fetchReportData(); // Call the function to fetch data
    };

    // Columns definition for Leads
    const leadColumns = [
        { title: 'Lead ID', dataIndex: 'leadId', key: 'leadId' },
        { title: 'Lead Name', dataIndex: 'leadName', key: 'leadName' },
        { title: 'Phone', dataIndex: 'phone', key: 'phone' },
        { title: 'Address', dataIndex: 'address', key: 'address' },
        { title: 'DOB', dataIndex: 'dob', key: 'dob' },
        { title: 'Gender', dataIndex: 'gender', key: 'gender' },
        { title: 'Scheme', dataIndex: 'schemeName', key: 'schemeName' },
        { title: 'Loan Amount', dataIndex: 'loanAmount', key: 'loanAmount' },
        { title: 'Date', dataIndex: 'date', key: 'date' },
        { title: 'Sales Officer', dataIndex: 'salesOfficer', key: 'salesOfficer' },
        { title: 'Sales Officer Remarks', dataIndex: 'remarks', key: 'remarks' },
        { title: 'Sales Head', dataIndex: 'salesHead', key: 'salesHead' },
        { title: 'Sales Head Remarks', dataIndex: 'salesHeadRemarks', key: 'salesHeadRemarks' },
        { title: 'Admin', dataIndex: 'admin', key: 'admin' },
        { title: 'Admin Remarks', dataIndex: 'adminRemarks', key: 'adminRemarks' },
        { title: 'Lead Status', dataIndex: 'leadStatus', key: 'leadStatus' },
    ];

    // Columns definition for Tasks
    const taskColumns = [
        { title: 'Task ID', dataIndex: 'taskId', key: 'taskId' },
        { title: 'Task Name', dataIndex: 'taskName', key: 'taskName' },
        { title: 'Assigned Emp Code', dataIndex: 'empCode', key: 'empCode' },
        { title: 'Assigned Emp Name', dataIndex: 'empName', key: 'empName' },
        { title: 'Target Date', dataIndex: 'targetDate', key: 'targetDate' },
        { title: 'Remarks', dataIndex: 'remarks', key: 'remarks' },
        { title: 'Sales Officer', dataIndex: 'salesOfficer', key: 'salesOfficer' },
        { title: 'Sales Officer Remarks', dataIndex: 'salesOfficerRemarks', key: 'salesOfficerRemarks' },
        { title: 'Sales Head', dataIndex: 'salesHead', key: 'salesHead' },
        { title: 'Sales Head Remarks', dataIndex: 'salesHeadRemarks', key: 'salesHeadRemarks' },
        { title: 'Admin', dataIndex: 'admin', key: 'admin' },
        { title: 'Admin Remarks', dataIndex: 'adminRemarks', key: 'adminRemarks' },
        { title: 'Task Status', dataIndex: 'taskStatus', key: 'taskStatus' },
    ];

    return (
        <div style={{ padding: '20px' }}>
            <Title level={2}>Reports</Title>
            <Radio.Group onChange={handleReportTypeChange} value={reportType}>
                <Radio value="lead">Lead Reports</Radio>
                <Radio value="task">Task Reports</Radio>
            </Radio.Group>

            <div style={{ marginTop: '20px' }}>
                <Button type="primary" onClick={handleViewReport}>
                    View Report
                </Button>
            </div>

            <div style={{ marginTop: '20px', maxHeight: '500px', overflowY: 'auto' }}>
                {/* Display the fetched report data as a table */}
                {reportData.length > 0 ? (
                    <Table 
                        dataSource={reportData} 
                        columns={reportType === 'lead' ? leadColumns : taskColumns} 
                        rowKey={reportType === 'lead' ? 'leadId' : 'taskId'} 
                        pagination={true}
                    />
                ) : (
                    <p>Select a report type and click "View Report" to see the results.</p>
                )}
            </div>
        </div>
    );
};

export default Reports;