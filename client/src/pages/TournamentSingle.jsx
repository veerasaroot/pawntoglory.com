import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { ChevronRight, Trophy, MapPin, Calendar, User, Tag, ArrowLeft, Users } from 'lucide-react';
import { getTournamentBySlug } from '../services/api';

const TournamentSingle = () => {
    const { t } = useTranslation();
    const { slug } = useParams();
    
    const [tournament, setTournament] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    
    useEffect(() => {
        fetchTournament();
    }, [slug]);
    
    const fetchTournament = async () => {
        try {
            setLoading(true);
            const data = await getTournamentBySlug(slug);
            setTournament(data);
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
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
    
    if (error) {
        return (
            <div className="container py-16 text-center">
                <p className="text-red-600">{error}</p>
            </div>
        );
    }
    
    if (!tournament) {
        return (
            <div className="container py-16 text-center">
                <p className="text-gray-600">{t('common.noResults')}</p>
            </div>
        );
    }
    
    return (
        <div className="container py-12">
            {/* Back Button */}
            <Link to="/tournaments" className="inline-flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-6">
                <ArrowLeft className="w-4 h-4" />
                {t('common.back')}
            </Link>
            
            <article className="bg-white border border-gray-200 rounded-lg overflow-hidden">
                {/* Featured Image */}
                {tournament.featuredImage ? (
                    <div className="aspect-video overflow-hidden">
                        <img
                            src={tournament.featuredImage}
                            alt={tournament.title}
                            className="w-full h-full object-cover"
                        />
                    </div>
                ) : (
                    <div className="aspect-video bg-gray-100 flex items-center justify-center">
                        <Trophy className="w-24 h-24 text-gray-400" />
                    </div>
                )}
                
                <div className="p-8">
                    {/* Header */}
                    <div className="mb-8">
                        <div className="flex items-center gap-4 mb-4">
                            <span className={`inline-block px-3 py-1 text-sm font-medium rounded-full ${getStatusColor(tournament.status)}`}>
                                {t(`tournament.${tournament.status}`)}
                            </span>
                            <div className="flex items-center gap-2 text-sm text-gray-600">
                                <User className="w-4 h-4" />
                                <span>{tournament.author?.name}</span>
                            </div>
                        </div>
                        
                        <h1 className="text-4xl font-bold text-gray-900 mb-4 font-heading">
                            {tournament.title}
                        </h1>
                        
                        {/* Metadata */}
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
                            <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                                <Calendar className="w-5 h-5 text-gray-600" />
                                <div>
                                    <div className="text-xs text-gray-500">{t('tournament.date')}</div>
                                    <div className="font-medium text-gray-900">{formatDate(tournament.date)}</div>
                                </div>
                            </div>
                            
                            <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                                <MapPin className="w-5 h-5 text-gray-600" />
                                <div>
                                    <div className="text-xs text-gray-500">{t('tournament.location')}</div>
                                    <div className="font-medium text-gray-900">{tournament.location}</div>
                                </div>
                            </div>
                            
                            <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                                <Trophy className="w-5 h-5 text-gray-600" />
                                <div>
                                    <div className="text-xs text-gray-500">{t('tournament.format')}</div>
                                    <div className="font-medium text-gray-900">{tournament.format}</div>
                                </div>
                            </div>
                            
                            <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                                <Users className="w-5 h-5 text-gray-600" />
                                <div>
                                    <div className="text-xs text-gray-500">{t('tournament.participants')}</div>
                                    <div className="font-medium text-gray-900">{tournament.participants}</div>
                                </div>
                            </div>
                        </div>
                    </div>
                    
                    {/* Description */}
                    <div className="prose prose-lg max-w-none mb-8">
                        <h2 className="text-2xl font-bold text-gray-900 mb-4">{t('tournament.aboutTournament')}</h2>
                        <div 
                            className="text-gray-700 leading-relaxed"
                            dangerouslySetInnerHTML={{ __html: tournament.description }}
                        />
                    </div>
                    
                    {/* Additional Info */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                        {tournament.prize && (
                            <div className="p-4 border border-gray-200 rounded-lg">
                                <h3 className="font-bold text-gray-900 mb-2">{t('tournament.prize')}</h3>
                                <p className="text-gray-700">{tournament.prize}</p>
                            </div>
                        )}
                        
                        {tournament.organizer && (
                            <div className="p-4 border border-gray-200 rounded-lg">
                                <h3 className="font-bold text-gray-900 mb-2">{t('tournament.organizer')}</h3>
                                <p className="text-gray-700">{tournament.organizer}</p>
                            </div>
                        )}
                    </div>
                    
                    {/* Tags */}
                    {tournament.tags && tournament.tags.length > 0 && (
                        <div className="mb-8">
                            <h3 className="text-lg font-bold text-gray-900 mb-3 flex items-center gap-2">
                                <Tag className="w-5 h-5" />
                                {t('article.tags')}
                            </h3>
                            <div className="flex flex-wrap gap-2">
                                {tournament.tags.map((tag, index) => (
                                    <span
                                        key={index}
                                        className="px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-sm"
                                    >
                                        {tag}
                                    </span>
                                ))}
                            </div>
                        </div>
                    )}
                    
                    {/* CTA Button */}
                    {tournament.status === 'upcoming' && (
                        <div className="text-center pt-8 border-t border-gray-200">
                            <button className="btn btn-primary btn-lg">
                                {t('tournament.registerNow')}
                            </button>
                        </div>
                    )}
                </div>
            </article>
        </div>
    );
};

export default TournamentSingle;
