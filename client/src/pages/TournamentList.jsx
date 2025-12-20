import React, { useEffect, useState } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { ChevronRight, Trophy, MapPin, Calendar, Search, X } from 'lucide-react';
import { getTournaments } from '../services/api';

const TournamentList = () => {
    const { t } = useTranslation();
    const [searchParams, setSearchParams] = useSearchParams();
    
    const [tournaments, setTournaments] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [searchQuery, setSearchQuery] = useState(searchParams.get('search') || '');
    const [filters, setFilters] = useState({
        status: searchParams.get('status') || 'upcoming',
        search: searchParams.get('search') || ''
    });
    
    const [statusFilter, setStatusFilter] = useState('all');
    
    useEffect(() => {
        fetchTournaments();
    }, [searchParams]);
    
    const fetchTournaments = async () => {
        try {
            setLoading(true);
            const status = searchParams.get('status') || 'all';
            const search = searchParams.get('search') || '';
            const page = searchParams.get('page') || 1;
            
            const response = await getTournaments({ status, search, page });
            setTournaments(response.tournaments);
            setStatusFilter(status);
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };
    
    const handleSearch = (e) => {
        e.preventDefault();
        const query = searchQuery.trim();
        
        if (query) {
            setSearchParams({ status: statusFilter, search: query });
        } else {
            setSearchParams({ status: statusFilter });
        }
    };
    
    const clearSearch = () => {
        setSearchQuery('');
        setSearchParams({ status: statusFilter });
    };
    
    const handleStatusFilter = (status) => {
        setStatusFilter(status);
        if (searchQuery) {
            setSearchParams({ status, search: searchQuery });
        } else {
            setSearchParams({ status });
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
        const year = d.getFullYear() + 543; // Convert to Thai year
        
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
    
    if (error) {
        return (
            <div className="container py-16 text-center">
                <p className="text-red-600">{error}</p>
            </div>
        );
    }
    
    return (
        <div className="container py-12">
            {/* Header */}
            <div className="flex justify-between items-center mb-12">
                <h2 className="text-4xl font-bold text-gray-900 font-heading">
                    {t('tournament.title')}
                </h2>
            </div>
            
            {/* Search and Filters */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
                {/* Search */}
                <form onSubmit={handleSearch} className="col-span-1">
                    <div className="relative">
                        <input
                            type="text"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            placeholder={`${t('common.search')}`}
                            className="input pr-12"
                        />
                        {searchQuery ? (
                            <button
                                type="button"
                                onClick={clearSearch}
                                className="absolute right-10 top-1/2 -translate-y-1/2 text-gray-400"
                            >
                                <X className="w-4 h-4" />
                            </button>
                        ) : null}
                        <button
                            type="submit"
                            className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400"
                        >
                            <Search className="w-4 h-4" />
                        </button>
                    </div>
                </form>
                
                {/* Status Filters */}
                <div className="col-span-2 flex flex-wrap gap-2">
                    {['all', 'upcoming', 'ongoing', 'completed'].map((status) => (
                        <button
                            key={status}
                            onClick={() => handleStatusFilter(status)}
                            className={`px-4 py-2 rounded-lg capitalize transition-colors ${
                                statusFilter === status
                                    ? 'bg-gray-900 text-white'
                                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                            }`}
                        >
                            {t(`tournament.${status}`)}
                        </button>
                    ))}
                </div>
            </div>
            
            {/* Tournament Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {tournaments.length > 0 ? (
                    tournaments.map((tournament) => (
                        <Link
                            key={tournament._id}
                            to={`/tournaments/${tournament.slug}`}
                            className="group bg-white border border-gray-200 rounded-lg overflow-hidden hover:shadow-lg hover:shadow-gray-100 transition-all hover:-translate-y-1"
                        >
                            {tournament.featuredImage ? (
                                <div className="aspect-video overflow-hidden">
                                    <img
                                        src={tournament.featuredImage}
                                        alt={tournament.title}
                                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                                    />
                                </div>
                            ) : (
                                <div className="aspect-video bg-gray-100 flex items-center justify-center">
                                    <Trophy className="w-12 h-12 text-gray-400" />
                                </div>
                            )}
                            
                            <div className="p-4">
                                {/* Status Badge */}
                                <span
                                    className={`inline-block px-2 py-1 text-xs font-medium rounded-full mb-2 ${
                                        getStatusColor(tournament.status)
                                    }`}
                                >
                                    {t(`tournament.${tournament.status}`)}
                                </span>
                                
                                <h3 className="text-lg font-bold text-gray-900 mb-2 line-clamp-2">
                                    {tournament.title}
                                </h3>
                                
                                <div className="space-y-2 text-sm text-gray-600">
                                    <div className="flex items-center gap-2">
                                        <Calendar className="w-4 h-4" />
                                        <span>{formatDate(tournament.date)}</span>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <MapPin className="w-4 h-4" />
                                        <span className="line-clamp-1">{tournament.location}</span>
                                    </div>
                                </div>
                                
                                <div className="flex justify-between items-center mt-4 pt-3 border-t border-gray-100">
                                    <div className="text-sm text-gray-600">
                                        <span className="font-medium">{tournament.participants}</span>{' '}
                                        {t('tournament.participants')}
                                    </div>
                                    <div className="flex items-center gap-1 text-sm text-gray-700 font-medium">
                                        {t('tournament.format')}
                                        <ChevronRight className="w-4 h-4" />
                                    </div>
                                </div>
                            </div>
                        </Link>
                    ))
                ) : (
                    <div className="col-span-full py-16 text-center">
                        <Trophy className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                        <h3 className="text-lg font-medium text-gray-600">{t('tournament.noTournaments')}</h3>
                        <p className="text-gray-500 mt-2">{t('common.noResults')}</p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default TournamentList;
