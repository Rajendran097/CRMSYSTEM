// Import necessary components and libraries
import React, { useState, useEffect } from 'react';
import { Layout, Table, Spin, Row } from 'antd';
import axios from 'axios';
import LeadCard from './LeadCard'; // Ensure LeadCard is correctly imported
import moment from 'moment';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, Legend as RechartsLegend } from 'recharts';
import { PieChart, Pie, Cell, Tooltip, Legend } from 'recharts';

const { Content } = Layout;

function Dashboard() {
    const [tasks, setTasks] = useState([]);
    const [loading, setLoading] = useState(true);
    const [leadCounts, setLeadCounts] = useState({});
    const [totalLeads, setTotalLeads] = useState(0);

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        try {
            const [tasksResponse, leadsResponse] = await Promise.all([
                axios.get('https://localhost:7231/api/Task'),
                axios.get('https://localhost:7231/api/Lead'),
            ]);

            setTasks(tasksResponse.data);

            const leadCategories = {};
            leadsResponse.data.forEach(lead => {
                const status = lead.leadStatus;
                leadCategories[status] = (leadCategories[status] || 0) + 1;
            });

            setLeadCounts(leadCategories);
            setTotalLeads(leadsResponse.data.length);
        } catch (error) {
            console.error('Error fetching data:', error);
        } finally {
            setLoading(false);
        }
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
            title: 'Assigned Employee Name',
            dataIndex: 'empName',
            key: 'empName',
        },
        {
            title: 'Target Date',
            dataIndex: 'targetDate',
            key: 'targetDate',
            render: (date) => moment(date).format('DD-MM-YYYY'),
        },
    ];

    const leadStatuses = [
        'Total Leads',
        'NEW LEAD',
        'INTERESTED',
        'NOT INTERESTED',
        'CALL LATER',
        'IN FUTURE',
        'APPROVED',
        'RETURNED',
        'REJECTED',
        'RECOMMEND',
    ];

    // Prepare data for the bar chart
    const chartData = leadStatuses.map(status => ({
        status,
        count: status === 'Total Leads' ? totalLeads : leadCounts[status] || 0,
    }));

    // Prepare data for the pie chart
    const pieData = chartData.filter(item => item.count > 0);

    // Define colors for the pie chart
    const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#FF3377', '#B04959', '#D9CDCD', '#8C89F2', '#9DFFBD', '#C2D1E2'];

    return (
        <Layout>
            <Content style={{ padding: '24px', minHeight: '280px' }}>
                <h2>Task Dashboard</h2>
                {loading ? (
                    <Spin size="large" />
                ) : (
                    <Table
                        columns={columns}
                        dataSource={tasks}
                        rowKey="taskId"
                        pagination={{ pageSize: 10 }}
                    />
                )}

                <h2 style={{ marginTop: '40px' }}>Lead Status</h2>
                <Row gutter={16}>
                    {leadStatuses.map(status => (
                        <LeadCard 
                            key={status}
                            title={status}
                            count={status === 'Total Leads' ? totalLeads : leadCounts[status] || 0}
                            totalLeads={totalLeads}
                        />
                    ))}
                </Row>

                <h2 style={{ marginTop: '40px' }}>Lead Status Bar Chart</h2>
                <BarChart
                    width={600}
                    height={300}
                    data={chartData}
                    margin={{
                        top: 5, right: 30, left: 20, bottom: 5,
                    }}
                >
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="status" />
                    <YAxis />
                    <RechartsTooltip />
                    <RechartsLegend />
                    <Bar dataKey="count" fill="#8884d8" />
                </BarChart>

                <h2 style={{ marginTop: '40px' }}>Lead Status Pie Chart</h2>
                <PieChart width={600} height={300}>
                    <Pie
                        data={pieData}
                        cx={300}
                        cy={150}
                        outerRadius={80}
                        fill="#8884d8"
                        dataKey="count"
                        label={({ name, percent }) => `${name} (${(percent * 100).toFixed(0)}%)`} // Display name and percentage
                    >
                        {pieData.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                    </Pie>
                    <Tooltip />
                    <Legend />
                </PieChart>
            </Content>
        </Layout>
    );
}

export default Dashboard;