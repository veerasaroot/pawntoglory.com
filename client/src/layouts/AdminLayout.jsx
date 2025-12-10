import { useState } from 'react';
import { Outlet, Link, useLocation, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useAuth } from '../context/AuthContext';
import {
    LayoutDashboard,
    FileText,
    FolderOpen,
    Users,
    Settings,
    LogOut,
    Menu,
    X,
    ChevronLeft,
    Globe,
} from 'lucide-react';

const AdminLayout = () => {
    const { t, i18n } = useTranslation();
    const { user, logout } = useAuth();
    const location = useLocation();
    const navigate = useNavigate();
    const [sidebarOpen, setSidebarOpen] = useState(false);

    const handleLogout = () => {
        logout();
        navigate('/');
    };

    const toggleLanguage = () => {
        i18n.changeLanguage(i18n.language === 'en' ? 'th' : 'en');
    };

    const menuItems = [
        { path: '/admin', icon: LayoutDashboard, label: t('admin.dashboard'), exact: true },
        { path: '/admin/articles', icon: FileText, label: t('admin.articles') },
        { path: '/admin/categories', icon: FolderOpen, label: t('admin.categories') },
        { path: '/admin/users', icon: Users, label: t('admin.users') },
        { path: '/admin/settings', icon: Settings, label: t('admin.settings') },
    ];

    const isActive = (path, exact = false) => {
        if (exact) return location.pathname === path;
        return location.pathname.startsWith(path);
    };

    return (
        <div className="min-h-screen bg-gray-100 flex">
            {/* Sidebar */}
            <aside
                className={`fixed inset-y-0 left-0 z-50 w-64 bg-gray-900 transform transition-transform duration-300 lg:translate-x-0 lg:static ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'
                    }`}
            >
                <div className="flex flex-col h-full">
                    {/* Logo */}
                    <div className="p-5 border-b border-gray-800">
                        <Link to="/" className="flex items-center gap-3">
                            <div className="w-10 h-10 bg-white rounded-lg flex items-center justify-center">
                                <img src="/assets/images/logo.png" alt="Logo" />
                            </div>
                            <div>
                                <span className="text-lg font-bold text-white">Pawn to Glory</span>
                                <p className="text-xs text-gray-400">Admin Panel</p>
                            </div>
                        </Link>
                    </div>

                    {/* Navigation */}
                    <nav className="flex-1 p-4 space-y-1">
                        {menuItems.map((item) => (
                            <Link
                                key={item.path}
                                to={item.path}
                                onClick={() => setSidebarOpen(false)}
                                className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${isActive(item.path, item.exact)
                                    ? 'bg-white text-gray-900'
                                    : 'text-gray-400 hover:bg-gray-800 hover:text-white'
                                    }`}
                                style={{ color: isActive(item.path, item.exact) ? 'black' : 'white' }}
                            >
                                <item.icon className="w-5 h-5" />
                                <span className="font-medium">{item.label}</span>
                            </Link>
                        ))}
                    </nav>

                    {/* User Section */}
                    <div className="p-4 border-t border-gray-800">
                        <div className="flex items-center gap-3 px-4 py-2 mb-3">
                            <div className="w-10 h-10 bg-gray-700 rounded-full flex items-center justify-center">
                                <span className="text-white font-medium">
                                    {user?.name?.charAt(0).toUpperCase()}
                                </span>
                            </div>
                            <div className="flex-1 min-w-0">
                                <p className="text-white font-medium truncate">{user?.name}</p>
                                <p className="text-xs text-gray-400 truncate">{user?.email}</p>
                            </div>
                        </div>
                        <button
                            onClick={handleLogout}
                            className="w-full flex items-center gap-3 px-4 py-3 text-red-400 hover:bg-red-500/10 rounded-lg transition-colors"
                        >
                            <LogOut className="w-5 h-5" />
                            <span className="font-medium">{t('nav.logout')}</span>
                        </button>
                    </div>
                </div>
            </aside>

            {/* Overlay */}
            {sidebarOpen && (
                <div
                    className="fixed inset-0 bg-black/50 z-40 lg:hidden"
                    onClick={() => setSidebarOpen(false)}
                />
            )}

            {/* Main Content */}
            <div className="flex-1 flex flex-col min-h-screen">
                {/* Top Bar */}
                <header className="bg-white border-b border-gray-200 px-4 py-3 lg:px-6">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-4">
                            <button
                                onClick={() => setSidebarOpen(true)}
                                className="p-2 hover:bg-gray-100 rounded-lg lg:hidden"
                            >
                                <Menu className="w-5 h-5" />
                            </button>
                            <Link
                                to="/"
                                className="hidden sm:flex items-center gap-2 text-gray-600 hover:text-gray-900 transition-colors"
                            >
                                <ChevronLeft className="w-4 h-4" />
                                <span className="text-sm">{t('auth.backToHome')}</span>
                            </Link>
                        </div>

                        <div className="flex items-center gap-3">
                            <button
                                onClick={toggleLanguage}
                                className="flex items-center gap-2 px-3 py-2 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
                            >
                                <Globe className="w-4 h-4" />
                                <span className="text-sm font-medium uppercase">{i18n.language}</span>
                            </button>
                        </div>
                    </div>
                </header>

                {/* Page Content */}
                <main className="flex-1 p-4 lg:p-6">
                    <Outlet />
                </main>
            </div>
        </div>
    );
};

export default AdminLayout;
