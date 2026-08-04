import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { Save, Bell, Shield, Key } from 'lucide-react';

const Settings = () => {
    const { user } = useAuth();
    const [activeTab, setActiveTab] = useState('profile');
    const [formData, setFormData] = useState({
        name: user?.name || '',
        email: user?.email || '',
        currentPassword: '',
        newPassword: '',
        notifications: true
    });

    const handleSave = (e) => {
        e.preventDefault();
        alert('Settings saved successfully (Mock implementation)');
    };

    return (
        <div className="max-w-4xl mx-auto">
            <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
                <div className="flex border-b border-slate-200">
                    <button
                        onClick={() => setActiveTab('profile')}
                        className={`flex-1 py-4 text-sm font-medium transition-colors ${activeTab === 'profile' ? 'text-indigo-600 border-b-2 border-indigo-600' : 'text-slate-500 hover:text-slate-700'}`}
                    >
                        User Profile
                    </button>
                    <button
                        onClick={() => setActiveTab('security')}
                        className={`flex-1 py-4 text-sm font-medium transition-colors ${activeTab === 'security' ? 'text-indigo-600 border-b-2 border-indigo-600' : 'text-slate-500 hover:text-slate-700'}`}
                    >
                        Security
                    </button>
                    <button
                        onClick={() => setActiveTab('notifications')}
                        className={`flex-1 py-4 text-sm font-medium transition-colors ${activeTab === 'notifications' ? 'text-indigo-600 border-b-2 border-indigo-600' : 'text-slate-500 hover:text-slate-700'}`}
                    >
                        Notifications
                    </button>
                </div>

                <div className="p-8">
                    <form onSubmit={handleSave} className="space-y-6">
                        {activeTab === 'profile' && (
                            <div className="space-y-4">
                                <h3 className="text-lg font-medium text-slate-800 border-b pb-2 mb-4">Personal Information</h3>
                                <div className="grid grid-cols-2 gap-6">
                                    <div>
                                        <label className="block text-sm font-medium text-slate-700 mb-1">Full Name</label>
                                        <input
                                            type="text"
                                            className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none transition-shadow"
                                            value={formData.name}
                                            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-slate-700 mb-1">Email Address</label>
                                        <input
                                            type="email"
                                            disabled
                                            className="w-full px-4 py-2 border border-slate-200 bg-slate-50 text-slate-500 rounded-lg cursor-not-allowed"
                                            value={formData.email}
                                        />
                                        <p className="text-xs text-slate-500 mt-1">Contact your administrator to change your email.</p>
                                    </div>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-slate-700 mb-1">Role & Department</label>
                                    <div className="p-3 bg-slate-50 rounded-lg text-sm border border-slate-200">
                                        <span className="font-semibold text-slate-700">{user?.role}</span> in <span className="text-indigo-600">{user?.department || 'Unassigned'}</span>
                                    </div>
                                </div>
                            </div>
                        )}

                        {activeTab === 'security' && (
                            <div className="space-y-4">
                                <h3 className="text-lg font-medium text-slate-800 border-b pb-2 mb-4 flex items-center">
                                    <Shield className="w-5 h-5 mr-2 text-indigo-500" />
                                    Change Password
                                </h3>
                                <div>
                                    <label className="block text-sm font-medium text-slate-700 mb-1">Current Password</label>
                                    <input
                                        type="password"
                                        className="w-full max-w-md px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none"
                                        placeholder="••••••••"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-slate-700 mb-1">New Password</label>
                                    <input
                                        type="password"
                                        className="w-full max-w-md px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none"
                                        placeholder="••••••••"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-slate-700 mb-1">Confirm New Password</label>
                                    <input
                                        type="password"
                                        className="w-full max-w-md px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none"
                                        placeholder="••••••••"
                                    />
                                </div>
                            </div>
                        )}

                        {activeTab === 'notifications' && (
                            <div className="space-y-4">
                                <h3 className="text-lg font-medium text-slate-800 border-b pb-2 mb-4 flex items-center">
                                    <Bell className="w-5 h-5 mr-2 text-indigo-500" />
                                    Email Preferences
                                </h3>
                                <div className="flex items-center justify-between p-4 border border-slate-200 rounded-lg">
                                    <div>
                                        <p className="font-medium text-slate-800">Monthly Payslip Updates</p>
                                        <p className="text-sm text-slate-500">Receive an email when new payroll data is generated.</p>
                                    </div>
                                    <label className="relative inline-flex items-center cursor-pointer">
                                        <input type="checkbox" className="sr-only peer" defaultChecked />
                                        <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-indigo-600"></div>
                                    </label>
                                </div>
                            </div>
                        )}

                        <div className="pt-6 border-t border-slate-200">
                            <button
                                type="submit"
                                className="inline-flex items-center px-6 py-2 bg-indigo-600 text-white font-medium rounded-lg hover:bg-indigo-700 transition shadow-sm"
                            >
                                <Save className="w-4 h-4 mr-2" />
                                Save Changes
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default Settings;
