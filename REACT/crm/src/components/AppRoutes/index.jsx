import { Route, Routes, Navigate } from "react-router-dom";
import Dashboard from "../Pages/Dashboard";
import AssignTask from "../Pages/AssignTask";
import CreateLeads from "../Pages/CreateLeads/Index";
import Followupleads from "../Pages/Followupleads/FollowupLeads";
import ApprovedLeads from "../Pages/ApprovedLeads";
import UpdateLeads from "../Pages/UpdateLead"; // Assuming UpdateLead handles /updatleads
import UpdateTask from "../Pages/UpdateTask"; // Add the update task component
import UserProfile from "../Pages/UserProfile";
import LeadDetail from "../Pages/Followupleads/LeadDetail";
import Reports from "../Pages/Reports/Reports";
import LeadReports from "../Pages/Reports/LeadReports";
import TaskReports from "../Pages/Reports/TaskReports";
import Unauthorized from "../Unauthorized/Unauthorized";

function AppRoutes({ addLead, leads }) {
    return (
        <Routes>
            <Route path="/" element={<Navigate to="/dashboard" />} />
            <Route path="/dashboard" element={<Dashboard tasks={leads} />} />
            <Route path="/assigntask" element={<AssignTask addTask={addLead} />} />
            <Route path="/createleads" element={<CreateLeads addLead={addLead} />} />
            <Route path="/followupleads" element={<Followupleads onLeadAdded={() => {}} leads={leads} />} />
            <Route path="/lead-detail/:leadId" element={<LeadDetail />} />
            <Route path="/approvedleads" element={<ApprovedLeads leads={leads} />} />
            <Route path="/userprofile" element={<UserProfile leads={leads} />} />
            <Route path="/unauthorized" element={<Unauthorized />} />
            <Route path="/reports" element={<Reports />}>
                <Route path="leadreports" element={<LeadReports />} />
                <Route path="taskreports" element={<TaskReports />} />
            </Route>
            <Route path="/updateleads/:leadId" element={<UpdateLeads />} />
            <Route path="/updatetask" element={<UpdateTask />} /> {/* For updating tasks */}
        </Routes>
    );
}

export default AppRoutes;