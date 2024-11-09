// src/Pages/Reports.js

import React, { useEffect, useState } from 'react';
import { Table, DatePicker, Button } from 'antd';
import axios from 'axios';
import * as XLSX from 'xlsx';

// Lead status mapping
const leadStatusMap = {
    1: 'Lead Entry',
    2: 'Interested',
    3: 'Not Interested',
    4: 'Call Later',
    5: 'Not to Call',
    6: 'Lead Approved',
    7: 'Lead Rejected',
    8: 'Approval Pending',
    // You might want to add more statuses based on your API response
};

// Convert API date format (timestamp) to readable local date string
const formatDate = (dateString) => {
    if (!dateString) return 'N/A'; // Handling case where date may not be there
    const date = new Date(dateString);
    return date.toLocaleDateString(); // Format the date as required (mm/dd/yyyy by default)
};

const LeadReports = () => {
    const [reportData, setReportData] = useState([]);
    const [dateRange, setDateRange] = useState([null, null]);

    // Fetch lead reports data from API
    const fetchLeadReports = async () => {
        try {
            const response = await axios.get('https://localhost:7231/api/Lead');
            const leads = response.data;

            // Map leads to report format
            const reports = leads.map((lead, index) => ({
                slno: index + 1,
                leadId: lead.leadId || 'N/A',
                name: lead.leadName || 'N/A',
                address: lead.address || 'N/A',
                phone: lead.phone || 'N/A',
                dob: formatDate(lead.DOB), // Use the function to format DOB
                scheme: lead.schemeName || 'N/A',
                loanAmount: lead.loanAmount || 0,
                createdDate: formatDate(lead.createdDate), // Properly format created date
                status: leadStatusMap[parseInt(lead.leadStatus)] || 'N/A', // Ensure correct status mapping
                approvedDate: formatDate(lead.approvedDate), // Format approved date
                assignedEmployee: lead.salesOfficer || 'Unassigned',
                salesOfficerRemarks: lead.salesOfficerRemarks || 'N/A',
                salesHead: lead.salesHead || 'N/A',
                salesHeadRemarks: lead.salesHeadRemarks || 'N/A',
                admin: lead.admin || 'N/A',
                adminRemarks: lead.adminRemarks || 'N/A',
            }));

            setReportData(reports);
        } catch (error) {
            console.error('Error fetching leads:', error);
        }
    };

    useEffect(() => {
        fetchLeadReports();
    }, []);

    // Function for exporting report data to Excel
    const exportToExcel = () => {
        const ws = XLSX.utils.json_to_sheet(reportData);
        const wb = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(wb, ws, 'Lead Reports');
        XLSX.writeFile(wb, 'LeadReports.xlsx');
    };

    const columns = [
        {
            title: 'Sl No',
            dataIndex: 'slno',
            key: 'slno',
            width: '5%',
        },
        {
            title: 'Lead ID',
            dataIndex: 'leadId',
            key: 'leadId',
        },
        {
            title: 'Name',
            dataIndex: 'name',
            key: 'name',
        },
        {
            title: 'Phone No',
            dataIndex: 'phone',
            key: 'phone',
        },
        {
            title: 'Address',
            dataIndex: 'address',
            key: 'address',
        },
        {
            title: 'DOB',
            dataIndex: 'dob',
            key: 'dob',
        },
        {
            title: 'Scheme',
            dataIndex: 'scheme',
            key: 'scheme',
        },
        {
            title: 'Loan Amount',
            dataIndex: 'loanAmount',
            key: 'loanAmount',
        },
        {
            title: 'Created Date',
            dataIndex: 'createdDate',
            key: 'createdDate',
        },
        {
            title: 'Lead Status',
            dataIndex: 'status',
            key: 'status',
        },
        {
            title: 'Sales Officer',
            dataIndex: 'assignedEmployee',
            key: 'assignedEmployee',
        },
        {
            title: 'Sales Officer Remarks',
            dataIndex: 'salesOfficerRemarks',
            key: 'salesOfficerRemarks',
        },
        {
            title: 'Sales Head',
            dataIndex: 'salesHead',
            key: 'salesHead',
        },
        {
            title: 'Sales Head Remarks',
            dataIndex: 'salesHeadRemarks',
            key: 'salesHeadRemarks',
        },
        {
            title: 'Admin',
            dataIndex: 'admin',
            key: 'admin',
        },
        {
            title: 'Admin Remarks',
            dataIndex: 'adminRemarks',
            key: 'adminRemarks',
        }
    ];

    return (
        <div>
            <h1>Lead Reports</h1>

            {/* Date Range Selection */}
            <DatePicker.RangePicker 
                onChange={(dates) => setDateRange(dates)} 
                style={{ marginBottom: '20px' }}
            />

            <Button onClick={fetchLeadReports} type="primary" style={{ marginRight: '10px' }}>
                Filter
            </Button>

            <Button onClick={exportToExcel} type="default">
                Export to Excel
            </Button>

            {reportData.length > 0 ? (
                <Table
                    dataSource={reportData}
                    columns={columns}
                    rowKey="leadId"
                    style={{ marginTop: '20px' }}
                />
            ) : (
                <p>No leads available to display.</p>
            )}
        </div>
    );
};

export default LeadReports;