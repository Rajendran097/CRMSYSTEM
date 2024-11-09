import React, { useEffect, useState } from "react";
import axios from "axios";
import { Typography, Select, Spin, message, Row, Col, Button } from "antd";
import { useAuth } from "../../UserAuth/AuthProvider";

const { Option } = Select;

function UserProfile() {
    const { user } = useAuth();
    const [employees, setEmployees] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedEmployee, setSelectedEmployee] = useState(null);
    const [selectedRole, setSelectedRole] = useState(null);
    
    const roleMap = {
        "Admin": 1,
        "Sales Head": 2,
        "Sales Officer": 3,
        "Sales Manager": 4,
        "None": 0
    };

    // Fetch all employees from the API
    useEffect(() => {
        const fetchEmployees = async () => {
            setLoading(true);
            try {
                const response = await axios.get("https://localhost:7231/api/Employee");
                setEmployees(response.data);
            } catch (error) {
                console.error("Failed to fetch employees:", error);
                message.error("Failed to load employees. Please try again later.");
            } finally {
                setLoading(false);
            }
        };

        fetchEmployees();
    }, []);

    const handleEmployeeChange = (employeeId) => {
        setSelectedEmployee(employeeId);
        setSelectedRole(null); // Reset role when employee changes
    };

    const updateEmployeeStatus = async () => {
        if (!selectedEmployee) {
            return message.warning("Please select an employee.");
        }

        const roleValue = roleMap[selectedRole];
        if (roleValue == null) {
            return message.error("Please select a valid role.");
        }

        const updatedEmployee = {
            ...employees.find(e => e.id === selectedEmployee),
            employeeStatus: roleValue,
        };

        try {
            await axios.put(`https://localhost:7231/api/Employee/${selectedEmployee}`, updatedEmployee);
            message.success("Employee role updated successfully!");

            // Refetch the employee list to reflect changes
            const response = await axios.get("https://localhost:7231/api/Employee");
            setEmployees(response.data);
            setSelectedEmployee(null);
            setSelectedRole(null);
        } catch (error) {
            console.error("Failed to update employee status:", error);
            message.error("Failed to update employee status. Please try again later.");
        }
    };

    if (loading) {
        return <Spin />;
    }

   

    return (
        <div>
            <Typography.Title level={2}>Manage Employees</Typography.Title>
            {employees.length === 0 ? (
                <Typography.Text>No employees found.</Typography.Text>
            ) : (
                <Row gutter={16}>
                    <Col span={8}>
                        <Select
                            placeholder="Select an employee"
                            onChange={handleEmployeeChange}
                            style={{ width: '100%' }}
                            value={selectedEmployee}
                        >
                            {employees.map(employee => (
                                <Option key={employee.id} value={employee.id}>
                                    {`${employee.empName} - ${employee.empCode} - ${Object.keys(roleMap).find(key => roleMap[key] === employee.employeeStatus)}`}
                                </Option>
                            ))}
                        </Select>
                    </Col>
                    
                    <Col span={8}>
                        <Select
                            placeholder="Assign new role"
                            onChange={setSelectedRole}
                            style={{ width: '100%' }}
                            value={selectedRole}
                        >
                            {Object.keys(roleMap).map(role => (
                                <Option key={role} value={role}>
                                    {role}
                                </Option>
                            ))}
                        </Select>
                    </Col>

                    <Col span={8}>
                        <Button 
                            type="primary" 
                            onClick={updateEmployeeStatus} 
                            style={{ marginLeft: 16 }}
                            disabled={!selectedRole || !selectedEmployee}
                        >
                            Update Role
                        </Button>
                    </Col>
                </Row>
            )}
        </div>
    );
}

export default UserProfile;