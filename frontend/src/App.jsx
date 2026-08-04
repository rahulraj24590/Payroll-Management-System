import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';

// Pages
import Login from './pages/Login';
import DashboardLayout from './components/DashboardLayout';
import AdminDashboard from './pages/AdminDashboard';
import UserDashboard from './pages/UserDashboard';
import Employees from './pages/Employees';
import PayrollData from './pages/PayrollData';
import Settings from './pages/Settings';

function App() {
    return (
        <Router>
            <Routes>
                <Route path="/login" element={<Login />} />

                {/* Protected Dashboard Routes */}
                <Route path="/dashboard" element={<DashboardLayout />}>
                    <Route index element={<Navigate to="overview" replace />} />
                    <Route path="overview" element={<AdminDashboard />} />
                    <Route path="my-dashboard" element={<UserDashboard />} />
                    <Route path="employees" element={<Employees />} />
                    <Route path="payroll" element={<PayrollData />} />
                    <Route path="settings" element={<Settings />} />
                </Route>

                <Route path="*" element={<Navigate to="/login" replace />} />
            </Routes>
        </Router>
    );
}

export default App;
