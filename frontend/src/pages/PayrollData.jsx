import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Download, Plus, Search, Filter, PlayCircle } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const PayrollData = () => {
    const { user } = useAuth();
    const [payrolls, setPayrolls] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showModal, setShowModal] = useState(false);
    const [employees, setEmployees] = useState([]);
    const [formData, setFormData] = useState({
        userId: '', baseSalary: '', bonuses: 0, deductions: 0,
        payPeriodMonth: new Date().toLocaleString('default', { month: 'short' }),
        payPeriodYear: new Date().getFullYear()
    });

    useEffect(() => {
        fetchPayrolls();
        if (user?.role === 'Admin') {
            fetchEmployees();
        }
    }, [user]);

    const fetchPayrolls = async () => {
        try {
            const token = localStorage.getItem('token');
            const res = await axios.get('http://localhost:5000/api/payrolls', {
                headers: { Authorization: `Bearer ${token}` }
            });
            setPayrolls(res.data.data);
            setLoading(false);
        } catch (err) {
            console.error(err);
            setLoading(false);
        }
    };

    const fetchEmployees = async () => {
        try {
            const token = localStorage.getItem('token');
            const res = await axios.get('http://localhost:5000/api/users', {
                headers: { Authorization: `Bearer ${token}` }
            });
            setEmployees(res.data.data);
        } catch (err) {
            console.error(err);
        }
    };

    const handleProcessPayroll = async (id) => {
        try {
            const token = localStorage.getItem('token');
            await axios.put(`http://localhost:5000/api/payrolls/${id}`, { status: 'Paid' }, {
                headers: { Authorization: `Bearer ${token}` }
            });
            fetchPayrolls();
        } catch (err) {
            console.error(err);
        }
    };

    const handleAddSubmit = async (e) => {
        e.preventDefault();
        try {
            const token = localStorage.getItem('token');
            await axios.post('http://localhost:5000/api/payrolls', formData, {
                headers: { Authorization: `Bearer ${token}` }
            });
            setShowModal(false);
            setFormData({
                userId: '', baseSalary: '', bonuses: 0, deductions: 0,
                payPeriodMonth: formData.payPeriodMonth, payPeriodYear: formData.payPeriodYear
            });
            fetchPayrolls();
        } catch (err) {
            alert('Error creating payroll record');
        }
    };

    const exportCSV = () => {
        if (payrolls.length === 0) return;

        const headers = ['Employee ID', 'Name', 'Month', 'Year', 'Base Salary', 'Bonuses', 'Deductions', 'Net Pay', 'Status'];
        const csvContent = [
            headers.join(','),
            ...payrolls.map(p => {
                const name = p.userId?.name || user?.name || 'Unknown';
                const uid = p.userId?._id || p.userId || user?.id;
                return `${uid},"${name}",${p.payPeriodMonth},${p.payPeriodYear},${p.baseSalary},${p.bonuses},${p.deductions},${p.netPay},${p.status}`;
            })
        ].join('\n');

        const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
        const url = URL.createObjectURL(blob);
        const link = document.createElement("a");
        link.setAttribute("href", url);
        link.setAttribute("download", `payroll_report_${new Date().toISOString().split('T')[0]}.csv`);
        link.style.visibility = 'hidden';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    return (
        <div className="space-y-6 max-w-7xl mx-auto">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div className="flex gap-3 w-full sm:w-auto">
                    <div className="relative flex-1 sm:w-64">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                            <Search className="h-5 w-5 text-slate-400" />
                        </div>
                        <input
                            type="text"
                            className="block w-full pl-10 pr-3 py-2 border border-slate-300 rounded-lg focus:ring-indigo-500 focus:border-indigo-500 text-sm"
                            placeholder="Search records..."
                        />
                    </div>
                    <button className="p-2 border border-slate-300 text-slate-600 rounded-lg hover:bg-slate-50 transition">
                        <Filter className="w-5 h-5" />
                    </button>
                </div>

                <div className="flex gap-3 w-full sm:w-auto">
                    <button
                        onClick={exportCSV}
                        className="flex-1 sm:flex-none inline-flex justify-center items-center px-4 py-2 bg-white border border-slate-300 text-slate-700 rounded-lg text-sm font-medium hover:bg-slate-50 transition shadow-sm"
                    >
                        <Download className="w-4 h-4 mr-2" />
                        Export CSV
                    </button>
                    {user?.role === 'Admin' && (
                        <button
                            onClick={() => setShowModal(true)}
                            className="flex-1 sm:flex-none inline-flex justify-center items-center px-4 py-2 bg-indigo-600 text-white rounded-lg text-sm font-medium hover:bg-indigo-700 transition shadow-sm"
                        >
                            <Plus className="w-4 h-4 mr-2" />
                            New Record
                        </button>
                    )}
                </div>
            </div>

            <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden text-sm">
                <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-slate-200">
                        <thead className="bg-slate-50">
                            <tr>
                                {user?.role === 'Admin' && <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Employee</th>}
                                <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Period</th>
                                <th className="px-6 py-3 text-right text-xs font-medium text-slate-500 uppercase tracking-wider">Base Salary</th>
                                <th className="px-6 py-3 text-right text-xs font-medium text-slate-500 uppercase tracking-wider">Bonuses</th>
                                <th className="px-6 py-3 text-right text-xs font-medium text-slate-500 uppercase tracking-wider">Deductions</th>
                                <th className="px-6 py-3 text-right text-xs font-medium text-slate-500 uppercase tracking-wider">Net Pay</th>
                                <th className="px-6 py-3 text-center text-xs font-medium text-slate-500 uppercase tracking-wider">Status</th>
                                {user?.role === 'Admin' && <th className="px-6 py-3 text-right text-xs font-medium text-slate-500 uppercase tracking-wider">Action</th>}
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-slate-200">
                            {loading ? (
                                <tr>
                                    <td colSpan={user?.role === 'Admin' ? 8 : 7} className="px-6 py-8 text-center text-slate-500">Loading records...</td>
                                </tr>
                            ) : payrolls.length === 0 ? (
                                <tr>
                                    <td colSpan={user?.role === 'Admin' ? 8 : 7} className="px-6 py-8 text-center text-slate-500">No payroll records found.</td>
                                </tr>
                            ) : payrolls.map((record) => (
                                <tr key={record._id} className="hover:bg-slate-50 transition-colors">
                                    {user?.role === 'Admin' && (
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <div className="font-medium text-slate-900">{record.userId?.name || 'Unknown User'}</div>
                                            <div className="text-xs text-slate-500">{record.userId?.email}</div>
                                        </td>
                                    )}
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <div className="font-medium text-slate-900">{record.payPeriodMonth} {record.payPeriodYear}</div>
                                        {record.paymentDate && <div className="text-xs text-slate-500 flex items-center mt-1">
                                            Paid: {new Date(record.paymentDate).toLocaleDateString()}
                                        </div>}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-right text-slate-500">₹{record.baseSalary.toLocaleString()}</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-right text-emerald-600">+₹{record.bonuses.toLocaleString()}</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-right text-red-500">-₹{record.deductions.toLocaleString()}</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-right font-bold text-slate-900">₹{record.netPay.toLocaleString()}</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-center">
                                        <span className={`px-2.5 py-1 text-xs font-medium rounded-full ${record.status === 'Paid' ? 'bg-emerald-100 text-emerald-800'
                                                : record.status === 'Processing' ? 'bg-blue-100 text-blue-800'
                                                    : 'bg-amber-100 text-amber-800'
                                            }`}>
                                            {record.status}
                                        </span>
                                    </td>
                                    {user?.role === 'Admin' && (
                                        <td className="px-6 py-4 whitespace-nowrap text-right">
                                            {record.status !== 'Paid' && (
                                                <button
                                                    onClick={() => handleProcessPayroll(record._id)}
                                                    className="text-indigo-600 hover:text-indigo-900 bg-indigo-50 hover:bg-indigo-100 px-3 py-1 rounded-md transition-colors font-medium inline-flex items-center"
                                                >
                                                    <PlayCircle className="w-4 h-4 mr-1 text-indigo-500" />
                                                    Process
                                                </button>
                                            )}
                                        </td>
                                    )}
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Add Payroll Record Modal (Admin Only) */}
            {showModal && user?.role === 'Admin' && (
                <div className="fixed inset-0 bg-slate-900/50 flex items-center justify-center z-50 p-4">
                    <div className="bg-white rounded-xl shadow-xl max-w-lg w-full overflow-hidden">
                        <div className="px-6 py-4 border-b border-slate-200 flex justify-between items-center bg-slate-50">
                            <h3 className="text-lg font-semibold text-slate-800">Generate Payroll Record</h3>
                            <button onClick={() => setShowModal(false)} className="text-slate-400 hover:text-slate-600">
                                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
                            </button>
                        </div>

                        <form onSubmit={handleAddSubmit} className="p-6">
                            <div className="space-y-4">
                                <div>
                                    <label className="block text-sm font-medium text-slate-700 mb-1">Select Employee</label>
                                    <select
                                        required
                                        className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none"
                                        value={formData.userId}
                                        onChange={(e) => setFormData({ ...formData, userId: e.target.value })}
                                    >
                                        <option value="">-- Select an Employee --</option>
                                        {employees.map(emp => (
                                            <option key={emp._id} value={emp._id}>{emp.name} ({emp.email})</option>
                                        ))}
                                    </select>
                                </div>

                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-sm font-medium text-slate-700 mb-1">Pay Month</label>
                                        <select
                                            required
                                            className="w-full px-3 py-2 border border-slate-300 rounded-lg"
                                            value={formData.payPeriodMonth} onChange={(e) => setFormData({ ...formData, payPeriodMonth: e.target.value })}
                                        >
                                            {['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'].map(m => (
                                                <option key={m} value={m}>{m}</option>
                                            ))}
                                        </select>
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-slate-700 mb-1">Pay Year</label>
                                        <input
                                            type="number" required min="2000" max="2100"
                                            className="w-full px-3 py-2 border border-slate-300 rounded-lg"
                                            value={formData.payPeriodYear} onChange={(e) => setFormData({ ...formData, payPeriodYear: Number(e.target.value) })}
                                        />
                                    </div>
                                </div>

                                <div className="bg-slate-50 p-4 rounded-lg border border-slate-200 space-y-4 mt-2">
                                    <h4 className="font-medium text-slate-700 text-sm mb-2 border-b pb-2">Salary Components</h4>
                                    <div>
                                        <label className="block text-sm font-medium text-slate-700 mb-1">Base Salary (₹)</label>
                                        <input
                                            type="number" required min="0" step="1"
                                            className="w-full px-3 py-2 border border-slate-300 rounded-lg"
                                            value={formData.baseSalary} onChange={(e) => setFormData({ ...formData, baseSalary: Number(e.target.value) })}
                                        />
                                    </div>
                                    <div className="grid grid-cols-2 gap-4">
                                        <div>
                                            <label className="block text-sm font-medium text-slate-700 mb-1">Bonuses (₹)</label>
                                            <input
                                                type="number" min="0" step="1"
                                                className="w-full px-3 py-2 border border-slate-300 rounded-lg text-emerald-600 font-medium"
                                                value={formData.bonuses} onChange={(e) => setFormData({ ...formData, bonuses: Number(e.target.value) })}
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-slate-700 mb-1">Deductions (₹)</label>
                                            <input
                                                type="number" min="0" step="1"
                                                className="w-full px-3 py-2 border border-slate-300 rounded-lg text-red-500 font-medium"
                                                value={formData.deductions} onChange={(e) => setFormData({ ...formData, deductions: Number(e.target.value) })}
                                            />
                                        </div>
                                    </div>
                                    <div className="pt-3 flex justify-between items-center text-sm font-bold border-t border-slate-200">
                                        <span className="text-slate-600">Calculated Net Pay:</span>
                                        <span className="text-lg text-indigo-700">
                                            ₹{((Number(formData.baseSalary) || 0) + (Number(formData.bonuses) || 0) - (Number(formData.deductions) || 0)).toLocaleString()}
                                        </span>
                                    </div>
                                </div>
                            </div>

                            <div className="pt-6 flex gap-3">
                                <button type="button" onClick={() => setShowModal(false)} className="flex-1 px-4 py-2 border border-slate-300 text-slate-700 font-medium rounded-lg hover:bg-slate-50 transition">
                                    Cancel
                                </button>
                                <button type="submit" className="flex-1 px-4 py-2 bg-indigo-600 text-white font-medium rounded-lg hover:bg-indigo-700 transition">
                                    Save Record
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

        </div>
    );
};

export default PayrollData;
