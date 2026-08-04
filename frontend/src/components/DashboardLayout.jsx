import React from 'react';
import { Outlet, Navigate, Link, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { LayoutDashboard, Users, FileText, Settings, LogOut } from 'lucide-react';

const DashboardLayout = () => {
    const { user, logout } = useAuth();
    const location = useLocation();

    if (!user) {
        return <Navigate to="/login" replace />;
    }

    const handleLogout = () => {
        logout();
    };

    const navItems = user.role === 'Admin'
        ? [
            { path: '/dashboard/overview', icon: LayoutDashboard, label: 'Overview' },
            { path: '/dashboard/employees', icon: Users, label: 'Employees' },
            { path: '/dashboard/payroll', icon: FileText, label: 'Payroll Data' },
            { path: '/dashboard/settings', icon: Settings, label: 'Settings' },
        ]
        : [
            { path: '/dashboard/my-dashboard', icon: LayoutDashboard, label: 'My Dashboard' },
            { path: '/dashboard/payroll', icon: FileText, label: 'My Payslips' },
            { path: '/dashboard/settings', icon: Settings, label: 'Settings' },
        ];

    return (
        <div className="min-h-screen bg-slate-50 flex">
            {/* Sidebar */}
            <aside className="w-64 bg-indigo-900 text-white flex flex-col fixed h-full z-10 transition-transform">
                <div className="h-16 flex items-center px-6 font-bold text-xl border-b border-indigo-800 tracking-wider">
                    <span className="text-indigo-400 mr-1">Payroll</span>Hub
                </div>

                <div className="flex-1 overflow-y-auto py-6">
                    <nav className="space-y-1 px-3">
                        {navItems.map((item) => {
                            const Icon = item.icon;
                            const isActive = location.pathname === item.path;
                            return (
                                <Link
                                    key={item.path}
                                    to={item.path}
                                    className={`flex items-center px-3 py-3 rounded-lg text-sm font-medium transition-colors ${isActive
                                        ? 'bg-indigo-800 text-white'
                                        : 'text-indigo-200 hover:bg-indigo-800 hover:text-white'
                                        }`}
                                >
                                    <Icon className={`mr-3 h-5 w-5 ${isActive ? 'text-indigo-400' : 'text-indigo-300'}`} />
                                    {item.label}
                                </Link>
                            );
                        })}
                    </nav>
                </div>

                <div className="p-4 border-t border-indigo-800">
                    <div className="flex items-center mb-4 px-2">
                        <div className="w-8 h-8 rounded-full bg-indigo-700 flex items-center justify-center text-sm font-bold mr-3">
                            {user.name.charAt(0)}
                        </div>
                        <div className="flex-1 min-w-0">
                            <p className="text-sm font-medium truncate">{user.name}</p>
                            <p className="text-xs text-indigo-300 truncate">{user.role}</p>
                        </div>
                    </div>
                    <button
                        onClick={handleLogout}
                        className="flex items-center w-full px-3 py-2 text-sm font-medium text-indigo-200 hover:text-white hover:bg-indigo-800 rounded-lg transition-colors"
                    >
                        <LogOut className="mr-3 h-5 w-5 text-indigo-300" />
                        Logout
                    </button>
                </div>
            </aside>

            {/* Main Content */}
            <main className="flex-1 ml-64 min-w-0 flex flex-col h-screen overflow-hidden">
                <header className="h-16 bg-white border-b shadow-sm flex items-center px-8 z-20">
                    <h1 className="text-xl font-semibold text-slate-800 capitalize">
                        {location.pathname.split('/').pop().replace('-', ' ')}
                    </h1>
                </header>

                <div className="flex-1 overflow-y-auto p-8">
                    <Outlet />
                </div>
            </main>
        </div>
    );
};

export default DashboardLayout;
