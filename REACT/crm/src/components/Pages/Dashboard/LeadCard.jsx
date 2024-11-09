import React from 'react';
import { Card, Col } from 'antd';

const LeadCard = ({ title, count, totalLeads }) => {
    const percentage = totalLeads > 0 ? ((count / totalLeads) * 100).toFixed(2) : 0; // Calculate percentage

    return (
        <Col span={8} style={{ marginBottom: 16 }}>
            <Card bordered={true} title={title} style={{ textAlign: 'center' }}>
                <h2>Count: {count}</h2>
                <h2>Percentage: {percentage}%</h2>
            </Card>
        </Col>
    );
};

export default LeadCard;