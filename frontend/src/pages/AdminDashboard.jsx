import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import { Users, IndianRupee, Activity, TrendingUp } from 'lucide-react';

const AdminDashboard = () => {
    const { user } = useAuth();
    const [stats, setStats] = useState({
        totalEmployees: 0,
        totalPayrollPaid: 0,
        avgSalary: 0
    });

    useEffect(() => {
        const fetchDashboardData = async () => {
            try {
                const token = localStorage.getItem('token');
                const config = { headers: { Authorization: `Bearer ${token}` } };

                // Fetch users
                const usersRes = await axios.get('http://localhost:5000/api/users', config);

                // Fetch payrolls
                const payrollsRes = await axios.get('http://localhost:5000/api/payrolls', config);

                const totalEmp = usersRes.data.count;
                const totalPaid = payrollsRes.data.data.reduce((acc, curr) => acc + curr.netPay, 0);
                const avgSal = totalEmp > 0 ? totalPaid / totalEmp : 0;

                setStats({
                    totalEmployees: totalEmp,
                    totalPayrollPaid: totalPaid,
                    avgSalary: avgSal
                });
            } catch (err) {
                console.error('Error fetching dashboard data:', err);
            }
        };

        fetchDashboardData();
    }, []);

    const statCards = [
        { label: 'Total Employees', value: stats.totalEmployees, icon: Users, color: 'text-blue-600', bg: 'bg-blue-100' },
        { label: 'Total Payroll Disbursed', value: `₹${stats.totalPayrollPaid.toLocaleString()}`, icon: IndianRupee, color: 'text-emerald-600', bg: 'bg-emerald-100' },
        { label: 'Average Net Salary', value: `₹${stats.avgSalary.toLocaleString(undefined, { maximumFractionDigits: 0 })}`, icon: Activity, color: 'text-purple-600', bg: 'bg-purple-100' },
        { label: 'Growth/Month', value: '+2.4%', icon: TrendingUp, color: 'text-indigo-600', bg: 'bg-indigo-100' },
    ];

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <div>
                    <h2 className="text-2xl font-bold text-slate-800">Welcome back, {user?.name}</h2>
                    <p className="text-slate-500 mt-1">Here is what's happening with your payroll today.</p>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {statCards.map((stat, idx) => {
                    const Icon = stat.icon;
                    return (
                        <div key={idx} className="bg-white rounded-xl border border-slate-200 p-6 shadow-sm hover:shadow-md transition-shadow">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-sm font-medium text-slate-500 mb-1">{stat.label}</p>
                                    <p className="text-2xl font-bold text-slate-800">{stat.value}</p>
                                </div>
                                <div className={`w-12 h-12 rounded-full ${stat.bg} flex items-center justify-center`}>
                                    <Icon className={`w-6 h-6 ${stat.color}`} />
                                </div>
                            </div>
                        </div>
                    );
                })}
            </div>

            <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-sm mt-8">
                <h3 className="text-lg font-semibold mb-4 text-slate-800">Recent Activity</h3>
                <div className="text-center py-10 text-slate-500 border-2 border-dashed border-slate-200 rounded-lg">
                    <Activity className="mx-auto h-12 w-12 text-slate-300 mb-3" />
                    <p>No recent activity logic implemented yet.</p>
                </div>
            </div>
        </div>
    );
};

export default AdminDashboard;
