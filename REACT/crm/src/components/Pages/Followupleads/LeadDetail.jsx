import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Select, message, Spin, Input, Button } from 'antd';
import axios from 'axios';

const { Option } = Select;

const LeadDetail = () => {
    const { leadId } = useParams();
    const navigate = useNavigate();

    const [lead, setLead] = useState(null);
    const [loading, setLoading] = useState(true);
    const [temporaryStatus, setTemporaryStatus] = useState('');
    const [remarks, setRemarks] = useState('');
    const [history, setHistory] = useState([]);
    const [currentUser, setCurrentUser] = useState(null);

    const statusOptions = {
        'NEW LEAD': [
            { value: 'INTERESTED', label: 'INTERESTED' },
            { value: 'NOT INTERESTED', label: 'NOT INTERESTED' },
            { value: 'CALL LATER', label: 'CALL LATER' },
            { value: 'IN FUTURE', label: 'IN FUTURE' },
        ],
        'NOT INTERESTED': [
            { value: 'INTERESTED', label: 'INTERESTED' },
            { value: 'NOT INTERESTED', label: 'NOT INTERESTED' },
            { value: 'CALL LATER', label: 'CALL LATER' },
            { value: 'IN FUTURE', label: 'IN FUTURE' },
        ],
        'CALL LATER': [
            { value: 'INTERESTED', label: 'INTERESTED' },
            { value: 'NOT INTERESTED', label: 'NOT INTERESTED' },
            { value: 'CALL LATER', label: 'CALL LATER' },
            { value: 'IN FUTURE', label: 'IN FUTURE' },
        ],
        'IN FUTURE': [
            { value: 'INTERESTED', label: 'INTERESTED' },
            { value: 'NOT INTERESTED', label: 'NOT INTERESTED' },
            { value: 'CALL LATER', label: 'CALL LATER' },
            { value: 'IN FUTURE', label: 'IN FUTURE' },
        ],
        'INTERESTED': [
            { value: 'RECOMMEND', label: 'RECOMMEND' },
            { value: 'RETURNED', label: 'RETURNED' },
        ],
        'UPDATED': [
            { value: 'RECOMMEND', label: 'RECOMMEND' },
            { value: 'RETURNED', label: 'RETURNED' },
        ],
        'RECOMMEND': [
            { value: 'APPROVED', label: 'APPROVED' },
            { value: 'RETURNED', label: 'RETURNED' },
            { value: 'REJECT', label: 'REJECT' },
        ],
    };

    const renderStatusOptions = () => {
        if (!lead) return [];
        const currentStatus = lead.leadStatus;
        return statusOptions[currentStatus]?.map(option => (
            <Option key={option.value} value={option.value}>{option.label}</Option>
        )) || [];
    };

    useEffect(() => {
        const fetchLeadDetails = async () => {
            if (!leadId) return;

            try {
                const response = await axios.get(`https://localhost:7231/api/Lead/${leadId}`);
                if (response.data) {
                    setLead(response.data);
                    setTemporaryStatus(response.data.leadStatus || '');
                    const storedHistory = JSON.parse(localStorage.getItem(`leadHistory_${leadId}`)) || [];
                    setHistory(storedHistory);
                } else {
                    message.error('Lead not found.');
                }
            } catch (error) {
                console.error('Error fetching lead details:', error);
                message.error('Failed to fetch lead details.');
            } finally {
                setLoading(false);
            }
        };

        const fetchCurrentUser = async () => {
            try {
                const userResponse = await axios.get('https://localhost:7231/api/Employee');
                setCurrentUser(userResponse.data || 'Unknown User');
            } catch (error) {
                console.error('Error fetching employee details:', error);
                message.error('Failed to fetch employee details.');
            }
        };

        fetchLeadDetails();
        fetchCurrentUser();
    }, [leadId]);

    const handleStatusChange = (value) => {
        setTemporaryStatus(value);
    };

    const handleSubmitRemarks = async () => {
        if (!remarks) {
            message.error('Remarks are required for this status update.');
            return;
        }
    
        const updatedLead = {
            ...(lead || {}),  // Spread the existing lead data
            leadStatus: temporaryStatus,
            empCode: currentUser ? currentUser.empCode : "Unknown User",
            remarks: remarks,
        };
    
        try {
            const response = await axios.put(`https://localhost:7231/api/Lead/${leadId}`, updatedLead);
            
            if (response.status === 200) { // Successful response indicates success
                message.success('Lead status and remarks updated successfully.');
    
                // Update history and localStorage
                const newHistoryEntry = {
                    createdBy: updatedLead.empCode,
                    date: new Date().toISOString(),
                    status: updatedLead.leadStatus,
                    remarks: updatedLead.remarks,
                };
    
                const newHistory = [...history, newHistoryEntry];
                setLead(updatedLead);
                setHistory(newHistory);
                setRemarks('');
                setTemporaryStatus(updatedLead.leadStatus);
                localStorage.setItem(`leadHistory_${leadId}`, JSON.stringify(newHistory));
                
                // Navigate to relevant pages based on the updated status
                switch (updatedLead.leadStatus) {
                    case 'APPROVED':
                        navigate('/approvedleads');
                        break;
                    case 'RECOMMEND':
                    case 'RETURNED':
                    default:
                        navigate('/followupleads');
                        break;
                }
            } else {
                message.error(`Failed to update lead status and remarks. Server responded with status: ${response.status}`);
            }
        } catch (error) {
            console.error('Error updating lead status:', error);
            if (error.response) {
                message.error(`Failed to update lead status and remarks. Server responded: ${error.response.data.message}`);
            } else {
                message.error(`Failed to update lead status and remarks: ${error.message}`);
            }
        }
    };

    if (loading) return <Spin size="large" />;

    if (!lead) {
        return (
            <div style={{ display: 'flex', flexDirection: 'column', height: '100vh' }}>
                <h2>Create New Lead</h2>
                {/* New lead form can be added here */}
            </div>
        );
    }

    return (
        <div style={{ display: 'flex', flexDirection: 'column', height: '100vh' }}>
            <div style={{ flex: '0 1 auto', padding: '20px', backgroundColor: '#f0f0f0' }}>
                <h2>Lead Details</h2>
                <p><strong>Lead ID:</strong> {lead.leadId}</p>
                <p><strong>Name:</strong> {lead.leadName}</p>
                <p><strong>Phone:</strong> {lead.phone}</p>
                <p><strong>Scheme:</strong> {lead.schemeName}</p>
                <p><strong>Loan Amount:</strong> ${lead.loanAmount}</p>
                <p><strong>Address:</strong> {lead.address || 'Address not provided'}</p>
            </div>

            <div style={{ display: 'flex', flex: '1 1 auto', padding: '20px', overflow: 'hidden' }}>
                <div style={{ flex: '1', padding: '20px', borderRight: '1px solid #ccc' }}>
                    <h3>Update Status</h3>
                    <Select
                        value={temporaryStatus}
                        onChange={handleStatusChange}
                        style={{ width: '100%' }}
                    >
                        {renderStatusOptions()}
                    </Select>
                    <Input.TextArea
                        value={remarks}
                        onChange={(e) => setRemarks(e.target.value)}
                        placeholder="Enter remarks here (mandatory for status updates)"
                        rows={4}
                        style={{ marginTop: '10px' }}
                    />
                    <Button
                        type="primary"
                        onClick={handleSubmitRemarks}
                        style={{ marginTop: '10px' }}
                    >
                        Submit
                    </Button>
                </div>

                <div style={{ flex: '2', position: 'relative', display: 'flex', flexDirection: 'column', overflow: 'auto' }}>
                    <h3 style={{ textAlign: 'center' }}>Lead History</h3>
                    <div style={{ marginTop: '10px', overflowY: 'auto', maxHeight: 'calc(100vh - 300px)', paddingBottom: '20px' }}>
                        <ul style={{ listStyle: 'none', padding: '0', width: '100%', margin: '0' }}>
                            {history.length === 0 ? (
                                <li style={{ padding: '10px', textAlign: 'center' }}>
                                    No history available for this lead.
                                </li>
                            ) : (
                                history.map((event, index) => (
                                    <li key={index} style={{ marginBottom: '20px', padding: '10px', border: '1px solid #ccc', borderRadius: '5px', backgroundColor: 'white' }}>
                                        <div>
                                            <strong>Status:</strong> <span style={{ fontWeight: 'bold', color: 'red' }}>{event.status}</span>
                                        </div>
                                        <div>
                                            <strong>Updated By:</strong> {event.createdBy}
                                        </div>
                                        <div>
                                            <strong>Remarks:</strong> {event.remarks || 'No remarks'}
                                        </div>
                                        <div>
                                            <strong>Date:</strong> {new Date(event.date).toLocaleString()}
                                        </div>
                                    </li>
                                ))
                            )}
                        </ul>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default LeadDetail;