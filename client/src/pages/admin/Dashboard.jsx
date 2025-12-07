import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { FileText, Eye, Users, TrendingUp, Plus } from 'lucide-react';
import { Link } from 'react-router-dom';
import toast from 'react-hot-toast';
import { getDashboardStats } from '../../services/api';

const Dashboard = () => {
    const { t } = useTranslation();
    const [stats, setStats] = useState({
        totalArticles: 0,
        totalViews: 0,
        totalUsers: 0,
        recentActivity: []
    });
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchStats = async () => {
            try {
                const data = await getDashboardStats();
                setStats(data);
            } catch (error) {
                console.error('Error fetching dashboard stats:', error);
                toast.error('Failed to load dashboard statistics');
            } finally {
                setLoading(false);
            }
        };

        fetchStats();
    }, []);

    // Statistics cards
    const statCards = [
        { label: t('admin.totalArticles'), value: stats.totalArticles, icon: FileText, trend: '' },
        { label: t('admin.totalViews'), value: stats.totalViews.toLocaleString(), icon: Eye, trend: '' },
        { label: t('admin.totalUsers'), value: stats.totalUsers, icon: Users, trend: '' },
        { label: 'Growth', value: 'N/A', icon: TrendingUp, trend: '' }, // Placeholder for now
    ];

    if (loading) {
        return (
            <div className="p-8">
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
                    {[1, 2, 3, 4].map((i) => (
                        <div key={i} className="skeleton h-32 rounded-xl" />
                    ))}
                </div>
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    <div className="skeleton h-96 rounded-xl" />
                    <div className="skeleton h-96 rounded-xl" />
                </div>
            </div>
        );
    }

    return (
        <div>
            {/* Header */}
            <div className="flex items-center justify-between mb-6">
                <h1 className="text-2xl font-bold text-gray-900">{t('admin.dashboard')}</h1>
                <Link to="/admin/articles/new" className="btn btn-primary">
                    <Plus className="w-4 h-4" />
                    {t('admin.createArticle')}
                </Link>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
                {statCards.map((stat, index) => (
                    <div key={index} className="bg-white rounded-xl p-6 border border-gray-200">
                        <div className="flex items-center justify-between mb-4">
                            <div className="w-12 h-12 bg-gray-900 rounded-lg flex items-center justify-center">
                                <stat.icon className="w-6 h-6 text-white" />
                            </div>
                            {stat.trend && (
                                <span className="text-sm font-medium text-green-600">{stat.trend}</span>
                            )}
                        </div>
                        <p className="text-3xl font-bold text-gray-900 mb-1">{stat.value}</p>
                        <p className="text-sm text-gray-500">{stat.label}</p>
                    </div>
                ))}
            </div>

            {/* Content Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Recent Activity */}
                <div className="bg-white rounded-xl border border-gray-200 p-6">
                    <h2 className="text-lg font-bold text-gray-900 mb-4">{t('admin.recentActivity')}</h2>
                    <div className="space-y-4">
                        {stats.recentActivity.length === 0 ? (
                            <p className="text-gray-500 text-sm">No recent activity</p>
                        ) : (
                            stats.recentActivity.map((activity, index) => (
                                <div key={index} className="flex items-start gap-3 pb-4 border-b border-gray-100 last:border-0">
                                    <div className={`w-2 h-2 mt-2 rounded-full ${activity.type === 'article' ? 'bg-blue-500' : 'bg-green-500'}`} />
                                    <div className="flex-1 min-w-0">
                                        <p className="font-medium text-gray-900">{activity.action}</p>
                                        <p className="text-sm text-gray-500 truncate">{activity.title}</p>
                                        <p className="text-xs text-gray-400">{activity.details}</p>
                                    </div>
                                    <span className="text-xs text-gray-400 whitespace-nowrap">
                                        {new Date(activity.time).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                    </span>
                                </div>
                            ))
                        )}
                    </div>
                </div>

                {/* Quick Actions */}
                <div className="bg-white rounded-xl border border-gray-200 p-6">
                    <h2 className="text-lg font-bold text-gray-900 mb-4">Quick Actions</h2>
                    <div className="grid grid-cols-2 gap-3">
                        <Link
                            to="/admin/articles/new"
                            className="p-4 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors text-center"
                        >
                            <FileText className="w-8 h-8 mx-auto mb-2 text-gray-700" />
                            <span className="text-sm font-medium text-gray-700">New Article</span>
                        </Link>
                        <Link
                            to="/admin/categories"
                            className="p-4 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors text-center"
                        >
                            <Plus className="w-8 h-8 mx-auto mb-2 text-gray-700" />
                            <span className="text-sm font-medium text-gray-700">Add Category</span>
                        </Link>
                        <Link
                            to="/admin/users"
                            className="p-4 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors text-center"
                        >
                            <Users className="w-8 h-8 mx-auto mb-2 text-gray-700" />
                            <span className="text-sm font-medium text-gray-700">Manage Users</span>
                        </Link>
                        <Link
                            to="/admin/settings"
                            className="p-4 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors text-center"
                        >
                            <TrendingUp className="w-8 h-8 mx-auto mb-2 text-gray-700" />
                            <span className="text-sm font-medium text-gray-700">View Analytics</span>
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Dashboard;
