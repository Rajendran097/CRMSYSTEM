import React from 'react';
import { Typography } from 'antd';

const Unauthorized = () => {
    return (
        <div style={{ padding: 20 }}>
            <Typography.Title level={2}>Unauthorized Access</Typography.Title>
            <Typography.Paragraph>
                You do not have permission to view this page. Please contact your administrator.
            </Typography.Paragraph>
        </div>
    );
};

export default Unauthorized;