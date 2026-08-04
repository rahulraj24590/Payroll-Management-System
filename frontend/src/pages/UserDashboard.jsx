import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import { IndianRupee, FileText, Calendar, Activity } from 'lucide-react';

const UserDashboard = () => {
    const { user } = useAuth();
    const [recentPayslip, setRecentPayslip] = useState(null);

    useEffect(() => {
        const fetchUserData = async () => {
            try {
                const token = localStorage.getItem('token');
                const config = { headers: { Authorization: `Bearer ${token}` } };

                const res = await axios.get(`${import.meta.env.VITE_API_URL || 'http://localhost:5000'}/api/payrolls`, config);
                const userPayrolls = res.data.data;

                if (userPayrolls.length > 0) {
                    // Assuming the latest is the last in the array or sorting it
                    const latest = userPayrolls.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))[0];
                    setRecentPayslip(latest);
                }
            } catch (err) {
                console.error("Error fetching user data", err);
            }
        };

        fetchUserData();
    }, []);

    return (
        <div className="space-y-6 max-w-5xl mx-auto">
            <div className="bg-indigo-600 rounded-2xl p-8 text-white flex justify-between items-center shadow-lg relative overflow-hidden">
                <div className="relative z-10">
                    <h2 className="text-3xl font-bold mb-2">Hello, {user?.name}</h2>
                    <p className="text-indigo-100 text-lg">Welcome to your employee portal.</p>
                </div>
                {/* Decorative circles */}
                <div className="absolute right-0 top-0 -mt-10 -mr-10 w-40 h-40 bg-white opacity-10 rounded-full blur-2xl"></div>
                <div className="absolute right-20 bottom-0 -mb-10 w-32 h-32 bg-white opacity-10 rounded-full blur-xl"></div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="col-span-1 md:col-span-2 space-y-6">
                    <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
                        <h3 className="text-lg font-semibold text-slate-800 mb-4 flex items-center">
                            <FileText className="w-5 h-5 mr-2 text-indigo-500" />
                            Latest Payslip Overview
                        </h3>

                        {recentPayslip ? (
                            <div className="space-y-4">
                                <div className="flex justify-between items-end pb-4 border-b border-slate-100">
                                    <div>
                                        <p className="text-sm text-slate-500">Period</p>
                                        <p className="font-medium text-slate-800">{recentPayslip.payPeriodMonth} {recentPayslip.payPeriodYear}</p>
                                    </div>
                                    <div className="text-right">
                                        <p className="text-sm text-slate-500">Net Pay</p>
                                        <p className="text-2xl font-bold text-emerald-600">₹{recentPayslip.netPay.toLocaleString()}</p>
                                    </div>
                                </div>

                                <div className="grid grid-cols-2 gap-4 pt-2">
                                    <div className="bg-slate-50 p-3 rounded-lg">
                                        <p className="text-xs text-slate-500 mb-1">Base Salary</p>
                                        <p className="font-medium text-slate-800">₹{(recentPayslip.baseSalary || 0).toLocaleString()}</p>
                                    </div>
                                    <div className="bg-slate-50 p-3 rounded-lg">
                                        <p className="text-xs text-slate-500 mb-1">Bonuses</p>
                                        <p className="font-medium text-slate-800">₹{(recentPayslip.bonuses || 0).toLocaleString()}</p>
                                    </div>
                                    <div className="bg-slate-50 p-3 rounded-lg">
                                        <p className="text-xs text-slate-500 mb-1">Deductions</p>
                                        <p className="font-medium text-red-500">-₹{(recentPayslip.deductions || 0).toLocaleString()}</p>
                                    </div>
                                    <div className="bg-slate-50 p-3 rounded-lg">
                                        <p className="text-xs text-slate-500 mb-1">Status</p>
                                        <p className={`font-medium ${recentPayslip.status === 'Paid' ? 'text-emerald-600' : 'text-amber-500'}`}>
                                            {recentPayslip.status}
                                        </p>
                                    </div>
                                </div>
                            </div>
                        ) : (
                            <div className="text-center py-8 text-slate-500">
                                <FileText className="mx-auto h-12 w-12 text-slate-200 mb-3" />
                                <p>No payslips generated yet.</p>
                            </div>
                        )}
                    </div>
                </div>

                <div className="col-span-1">
                    <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
                        <h3 className="text-lg font-semibold text-slate-800 mb-4">My Details</h3>
                        <div className="space-y-4">
                            <div className="flex items-center text-sm">
                                <div className="w-8 h-8 rounded bg-indigo-50 flex items-center justify-center mr-3 text-indigo-600">
                                    <Activity className="w-4 h-4" />
                                </div>
                                <div>
                                    <p className="text-slate-500 text-xs">Department</p>
                                    <p className="font-medium text-slate-800">{user?.department || 'Not Assigned'}</p>
                                </div>
                            </div>
                            <div className="flex items-center text-sm mt-4">
                                <div className="w-8 h-8 rounded bg-emerald-50 flex items-center justify-center mr-3 text-emerald-600">
                                    <Calendar className="w-4 h-4" />
                                </div>
                                <div>
                                    <p className="text-slate-500 text-xs">Role Level</p>
                                    <p className="font-medium text-slate-800">{user?.role}</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default UserDashboard;
