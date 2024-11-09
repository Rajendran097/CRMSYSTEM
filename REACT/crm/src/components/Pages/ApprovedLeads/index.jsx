import React, { useEffect, useState } from 'react';
import { Table, Typography, Spin, message } from 'antd';
import axios from 'axios';

const { Title, Text } = Typography;

function ApprovedLeads() {
    const [approvedLeads, setApprovedLeads] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchLeads = async () => {
            try {
                const response = await axios.get('https://localhost:7231/api/Lead');
                
                // Filter to get only approved leads
                const leads = response.data.filter(lead => lead.leadStatus === "APPROVED");
                
                setApprovedLeads(leads);
            } catch (err) {
                console.error("Failed to fetch leads:", err);
                setError('Failed to load approved leads. Please try again later.');
                message.error('Failed to load approved leads. Please try again later.');
            } finally {
                setLoading(false);
            }
        };

        fetchLeads();
    }, []);

    // Columns for the table
    const columns = [
        { title: 'Lead ID', dataIndex: 'leadId', key: 'leadId', width: 100 },
        { title: 'Name', dataIndex: 'leadName', key: 'leadName', width: 150 },
        { title: 'Phone', dataIndex: 'phone', key: 'phone', width: 120 },
        { title: 'Address', dataIndex: 'address', key: 'address', width: 200 },
        { title: 'DOB', dataIndex: 'dob', key: 'dob', render: (dob) => new Date(dob).toLocaleDateString(), width: 100 },
        { title: 'Scheme Name', dataIndex: 'schemeName', key: 'schemeName', width: 150 },
        { title: 'Loan Amount', dataIndex: 'loanAmount', key: 'loanAmount', render: (amount) => `$${amount}`, width: 120 },
        { title: 'Sales Officer', dataIndex: 'empCode', key: 'empCode', width: 160 },
        { title: 'Sales Officer Remarks', dataIndex: 'remarks', key: 'remarks', width: 200 },
        { title: 'Sales Head', dataIndex: 'salesHeadEmpCode', key: 'salesHeadEmpCode', width: 160 },
        { title: 'Sales Head Remarks', dataIndex: 'salesHeadRemarks', key: 'salesHeadRemarks', width: 200 },
        { title: 'Admin', dataIndex: 'adminEmpCode', key: 'adminEmpCode', width: 160 },
        { title: 'Admin Remarks', dataIndex: 'adminRemarks', key: 'adminRemarks', width: 200 },
        { title: 'Status', dataIndex: 'leadStatus', key: 'leadStatus', render: () => 'Approved', width: 100 },
        { title: 'Approved Date', dataIndex: 'approvedDate', key: 'approvedDate', render: () => new Date().toLocaleDateString(), width: 100 },
    ];

    // Display loading spinner or error message
    if (loading) return <Spin size="large" />;
    if (error) return <Text type="danger">{error}</Text>;

    return (
        <div>
            <Title level={2} style={{ marginBottom: '16px' }}>
                Approved Leads
            </Title>
            <Table
                dataSource={approvedLeads}
                columns={columns}
                rowKey="leadId"
                pagination={false}
                scroll={{ x: 'max-content' }}
                bordered
            />
        </div>
    );
}

export default ApprovedLeads;