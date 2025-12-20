import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Plus, Edit, Trash2, Trophy } from 'lucide-react';
import { getAdminTournaments, deleteTournament } from '../../services/api';
import { toast } from 'react-hot-toast';

const TournamentListAdmin = () => {
    const { t } = useTranslation();
    
    const [tournaments, setTournaments] = useState([]);
    const [loading, setLoading] = useState(true);
    
    useEffect(() => {
        fetchTournaments();
    }, []);
    
    const fetchTournaments = async () => {
        try {
            const data = await getAdminTournaments();
            setTournaments(data);
        } catch (err) {
            toast.error(err.message || 'Failed to fetch tournaments');
        } finally {
            setLoading(false);
        }
    };
    
    const handleDelete = async (id) => {
        if (window.confirm('Are you sure you want to delete this tournament?')) {
            try {
                await deleteTournament(id);
                toast.success('Tournament deleted successfully');
                fetchTournaments();
            } catch (err) {
                toast.error(err.message || 'Failed to delete tournament');
            }
        }
    };
    
    const getStatusColor = (status) => {
        switch (status) {
            case 'upcoming': return 'bg-blue-100 text-blue-800';
            case 'ongoing': return 'bg-green-100 text-green-800';
            case 'completed': return 'bg-gray-100 text-gray-800';
            case 'cancelled': return 'bg-red-100 text-red-800';
            default: return 'bg-gray-100 text-gray-800';
        }
    };
    
    const formatDate = (date) => {
        const thaiMonths = [
            'ม.ค.', 'ก.พ.', 'มี.ค.', 'เม.ย.', 'พ.ค.', 'มิ.ย.',
            'ก.ค.', 'ส.ค.', 'ก.ย.', 'ต.ค.', 'พ.ย.', 'ธ.ค.'
        ];
        
        const d = new Date(date);
        const month = thaiMonths[d.getMonth()];
        const year = d.getFullYear() + 543;
        
        return `${d.getDate()} ${month} ${year}`;
    };
    
    if (loading) {
        return (
            <div className="container py-16 text-center">
                <div className="animate-spin inline-block w-8 h-8 border-4 border-gray-900 border-t-transparent rounded-full"></div>
                <p className="mt-4 text-gray-600">{t('common.loading')}</p>
            </div>
        );
    }
    
    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex justify-between items-center">
                <h1 className="text-3xl font-bold text-gray-900">{t('admin.tournaments')}</h1>
                <Link to="/admin/tournaments/new" className="btn btn-primary">
                    <Plus className="w-4 h-4 mr-2" />
                    {t('admin.createTournament')}
                </Link>
            </div>
            
            {/* Stats */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="bg-white p-6 rounded-lg border border-gray-200">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm text-gray-500">{t('tournament.upcoming')}</p>
                            <p className="text-2xl font-bold">
                                {tournaments.filter(t => t.status === 'upcoming').length}
                            </p>
                        </div>
                        <Trophy className="w-8 h-8 text-blue-500" />
                    </div>
                </div>
                
                <div className="bg-white p-6 rounded-lg border border-gray-200">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm text-gray-500">{t('tournament.ongoing')}</p>
                            <p className="text-2xl font-bold">
                                {tournaments.filter(t => t.status === 'ongoing').length}
                            </p>
                        </div>
                        <Trophy className="w-8 h-8 text-green-500" />
                    </div>
                </div>
                
                <div className="bg-white p-6 rounded-lg border border-gray-200">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm text-gray-500">{t('tournament.completed')}</p>
                            <p className="text-2xl font-bold">
                                {tournaments.filter(t => t.status === 'completed').length}
                            </p>
                        </div>
                        <Trophy className="w-8 h-8 text-gray-500" />
                    </div>
                </div>
            </div>
            
            {/* Tournament List */}
            <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="min-w-full">
                        <thead className="bg-gray-50 border-b border-gray-200">
                            <tr>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    {t('tournament.title')}
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    {t('tournament.date')}
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    {t('tournament.location')}
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    {t('tournament.format')}
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    {t('tournament.status')}
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    {t('common.actions')}
                                </th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-200">
                            {tournaments.length > 0 ? (
                                tournaments.map((tournament) => (
                                    <tr key={tournament._id} className="hover:bg-gray-50">
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <div className="flex items-center">
                                                {tournament.featuredImage ? (
                                                    <img
                                                        src={tournament.featuredImage}
                                                        alt={tournament.title}
                                                        className="w-10 h-10 rounded-lg object-cover mr-3"
                                                    />
                                                ) : (
                                                    <div className="w-10 h-10 bg-gray-200 rounded-lg mr-3 flex items-center justify-center">
                                                        <Trophy className="w-5 h-5 text-gray-400" />
                                                    </div>
                                                )}
                                                <div>
                                                    <div className="text-sm font-medium text-gray-900">
                                                        {tournament.title}
                                                    </div>
                                                    <div className="text-sm text-gray-500">
                                                        {tournament.slug}
                                                    </div>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                            {formatDate(tournament.date)}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                            {tournament.location}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                            {tournament.format}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(tournament.status)}`}>
                                                {t(`tournament.${tournament.status}`)}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm">
                                            <div className="flex items-center gap-2">
                                                <Link
                                                    to={`/admin/tournaments/edit/${tournament._id}`}
                                                    className="text-blue-600 hover:text-blue-900"
                                                    title="Edit"
                                                >
                                                    <Edit className="w-4 h-4" />
                                                </Link>
                                                <button
                                                    onClick={() => handleDelete(tournament._id)}
                                                    className="text-red-600 hover:text-red-900"
                                                    title="Delete"
                                                >
                                                    <Trash2 className="w-4 h-4" />
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan="6" className="px-6 py-12 text-center text-gray-500">
                                        <Trophy className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                                        <p>{t('tournament.noTournaments')}</p>
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default TournamentListAdmin;
