import React, { useEffect, useState } from "react";
import { Table, message, Button } from "antd";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const Followupleads = ({ onLeadAdded }) => {
    const [leads, setLeads] = useState([]);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchLeads = async () => {
            try {
                const response = await axios.get("https://localhost:7231/api/lead");
                // Filter out leads that are approved
                const filteredLeads = response.data.filter(lead => lead.leadStatus !== "APPROVED");
                setLeads(filteredLeads);
                if (onLeadAdded) onLeadAdded(); // Notify that leads have been fetched
            } catch (error) {
                console.error("Failed to fetch leads:", error);
                message.error('Failed to load leads. Please try again later.');
            }
        };

        fetchLeads();
    }, [onLeadAdded]);

    const handleRowClick = (lead) => {
        if (lead.leadStatus === "RETURNED") {
            // Navigate to UpdateLeads page if lead status is "RETURNED"
            navigate(`/updateleads/${lead.leadId}`);
        } else {
            // Navigate to LeadDetail page for other statuses
            navigate(`/lead-detail/${lead.leadId}`);
        }
    };

    const handleNewLead = () => {
        // Navigate to the Create Leads page to add a new lead
        navigate(`/createleads`);
    };

    const columns = [
        {
            title: 'Lead ID',
            dataIndex: 'leadId',
        },
        {
            title: 'Name',
            dataIndex: 'leadName',
        },
        {
            title: 'Phone',
            dataIndex: 'phone',
        },
        {
            title: 'Scheme',
            dataIndex: 'schemeName',
        },
        {
            title: 'Loan Amount',
            dataIndex: 'loanAmount',
            render: (amount) => `$${amount}`,
        },
        {
            title: 'Status',
            dataIndex: 'leadStatus',
        },
    ];

    return (
        <>
            <Button onClick={handleNewLead} type="primary">
                Add New Lead
            </Button>
            <Table
                dataSource={leads}
                columns={columns}
                rowKey="leadId"
                pagination={false}
                onRow={(record) => ({
                    onClick: () => handleRowClick(record),
                })}
            />
        </>
    );
}

export default Followupleads;