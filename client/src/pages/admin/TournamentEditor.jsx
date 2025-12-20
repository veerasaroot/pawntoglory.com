import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { ArrowLeft, Save, Eye, Image, X, Upload, Trophy, MapPin, Calendar, Users } from 'lucide-react';
import toast from 'react-hot-toast';
import { createTournament, updateTournament, uploadImage } from '../../services/api';
import axios from 'axios';

const TournamentEditor = () => {
    const { t } = useTranslation();
    const { id } = useParams();
    const navigate = useNavigate();
    const isEditing = !!id;

    const [formData, setFormData] = useState({
        title: '',
        slug: '',
        description: '',
        date: '',
        location: '',
        format: 'Swiss',
        prize: '',
        organizer: '',
        participants: 0,
        featuredImage: '',
        status: 'upcoming',
        tags: '',
    });
    const [loading, setLoading] = useState(false);
    const [uploading, setUploading] = useState(false);

    useEffect(() => {
        if (isEditing) {
            fetchTournament();
        }
    }, [isEditing, id]);

    const fetchTournament = async () => {
        try {
            const response = await axios.get(`/api/tournaments/admin`);
            const tournament = response.data.find(a => a._id === id);
            if (tournament) {
                setFormData({
                    title: tournament.title || '',
                    slug: tournament.slug || '',
                    description: tournament.description || '',
                    date: tournament.date ? tournament.date.substring(0, 10) : '',
                    location: tournament.location || '',
                    format: tournament.format || 'Swiss',
                    prize: tournament.prize || '',
                    organizer: tournament.organizer || '',
                    participants: tournament.participants || 0,
                    featuredImage: tournament.featuredImage || '',
                    status: tournament.status || 'upcoming',
                    tags: tournament.tags?.join(', ') || '',
                });
            }
        } catch (error) {
            console.error('Error fetching tournament:', error);
            toast.error('Failed to load tournament');
        }
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });

        if (name === 'title' && !isEditing) {
            const slug = value
                .toLowerCase()
                .replace(/[^a-z0-9]+/g, '-')
                .replace(/(^-|-$)/g, '');
            setFormData((prev) => ({ ...prev, slug }));
        }
    };

    const handleImageUpload = async (e) => {
        const file = e.target.files[0];
        if (!file) return;

        try {
            setUploading(true);
            const data = await uploadImage(file);
            setFormData((prev) => ({ ...prev, featuredImage: data.url }));
            toast.success('Image uploaded');
        } catch (error) {
            toast.error('Failed to upload image');
        } finally {
            setUploading(false);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        try {
            const data = {
                ...formData,
                date: new Date(formData.date),
                participants: parseInt(formData.participants) || 0,
                tags: formData.tags ? formData.tags.split(',').map(t => t.trim()) : [],
            };

            if (isEditing) {
                await updateTournament(id, data);
                toast.success('Tournament updated!');
            } else {
                await createTournament(data);
                toast.success('Tournament created!');
            }
            navigate('/admin/tournaments');
        } catch (error) {
            toast.error(error.response?.data?.message || 'Failed to save tournament');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div>
            <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-4">
                    <button
                        onClick={() => navigate('/admin/tournaments')}
                        className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                    >
                        <ArrowLeft className="w-5 h-5" />
                    </button>
                    <h1 className="text-2xl font-bold text-gray-900">
                        {isEditing ? t('admin.editTournament') : t('admin.createTournament')}
                    </h1>
                </div>
                <button
                    onClick={handleSubmit}
                    disabled={loading}
                    className="btn btn-primary"
                >
                    {loading ? (
                        <div className="spinner w-4 h-4 border-2" />
                    ) : (
                        <>
                            <Save className="w-4 h-4" />
                            {t('common.save')}
                        </>
                    )}
                </button>
            </div>

            <form onSubmit={handleSubmit}>
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    <div className="lg:col-span-2 space-y-6">
                        <div className="bg-white rounded-xl border border-gray-200 p-6">
                            <div className="space-y-5">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        {t('tournament.title')}
                                    </label>
                                    <input
                                        type="text"
                                        name="title"
                                        value={formData.title}
                                        onChange={handleChange}
                                        className="input"
                                        required
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Slug
                                    </label>
                                    <input
                                        type="text"
                                        name="slug"
                                        value={formData.slug}
                                        onChange={handleChange}
                                        className="input"
                                        required
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Description
                                    </label>
                                    <textarea
                                        name="description"
                                        value={formData.description}
                                        onChange={handleChange}
                                        rows={10}
                                        className="input resize-none"
                                    />
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="space-y-6">
                        <div className="bg-white rounded-xl border border-gray-200 p-6">
                            <h3 className="font-semibold text-gray-900 mb-4">{t('tournament.status')}</h3>
                            <select
                                name="status"
                                value={formData.status}
                                onChange={handleChange}
                                className="input"
                            >
                                <option value="upcoming">{t('tournament.upcoming')}</option>
                                <option value="ongoing">{t('tournament.ongoing')}</option>
                                <option value="completed">{t('tournament.completed')}</option>
                                <option value="cancelled">{t('tournament.cancelled')}</option>
                            </select>
                        </div>

                        <div className="bg-white rounded-xl border border-gray-200 p-6">
                            <h3 className="font-semibold text-gray-900 mb-4">{t('tournament.details')}</h3>
                            
                            <div className="space-y-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        {t('tournament.date')}
                                    </label>
                                    <input
                                        type="date"
                                        name="date"
                                        value={formData.date}
                                        onChange={handleChange}
                                        className="input"
                                        required
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        {t('tournament.location')}
                                    </label>
                                    <div className="relative">
                                        <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                                        <input
                                            type="text"
                                            name="location"
                                            value={formData.location}
                                            onChange={handleChange}
                                            className="input pl-9"
                                            required
                                        />
                                    </div>
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        {t('tournament.format')}
                                    </label>
                                    <select
                                        name="format"
                                        value={formData.format}
                                        onChange={handleChange}
                                        className="input"
                                        required
                                    >
                                        <option value="Swiss">Swiss</option>
                                        <option value="Round Robin">Round Robin</option>
                                        <option value="Knockout">Knockout</option>
                                        <option value="Blitz">Blitz</option>
                                        <option value="Rapid">Rapid</option>
                                        <option value="Classical">Classical</option>
                                    </select>
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        {t('tournament.prize')}
                                    </label>
                                    <input
                                        type="text"
                                        name="prize"
                                        value={formData.prize}
                                        onChange={handleChange}
                                        className="input"
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        {t('tournament.organizer')}
                                    </label>
                                    <div className="relative">
                                        <Users className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                                        <input
                                            type="text"
                                            name="organizer"
                                            value={formData.organizer}
                                            onChange={handleChange}
                                            className="input pl-9"
                                        />
                                    </div>
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        {t('tournament.participants')}
                                    </label>
                                    <input
                                        type="number"
                                        name="participants"
                                        value={formData.participants}
                                        onChange={handleChange}
                                        className="input"
                                        min="0"
                                    />
                                </div>
                            </div>
                        </div>

                        <div className="bg-white rounded-xl border border-gray-200 p-6">
                            <h3 className="font-semibold text-gray-900 mb-4">Featured Image</h3>
                            {formData.featuredImage ? (
                                <div className="relative">
                                    <img
                                        src={formData.featuredImage}
                                        alt="Featured"
                                        className="w-full h-40 object-cover rounded-lg"
                                    />
                                    <button
                                        type="button"
                                        onClick={() => setFormData({ ...formData, featuredImage: '' })}
                                        className="absolute top-2 right-2 p-1 bg-red-500 text-white rounded-full hover:bg-red-600"
                                    >
                                        <X className="w-4 h-4" />
                                    </button>
                                </div>
                            ) : (
                                <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
                                    <Image className="w-10 h-10 mx-auto text-gray-400 mb-2" />
                                    <label className="cursor-pointer">
                                        <span className="text-sm text-gray-500 hover:text-gray-700">
                                            {uploading ? 'Uploading...' : 'Click to upload'}
                                        </span>
                                        <input
                                            type="file"
                                            accept="image/*"
                                            onChange={handleImageUpload}
                                            className="hidden"
                                            disabled={uploading}
                                        />
                                    </label>
                                </div>
                            )}
                        </div>
                        
                        <div className="bg-white rounded-xl border border-gray-200 p-6">
                            <h3 className="font-semibold text-gray-900 mb-4">{t('article.tags')}</h3>
                            <input
                                type="text"
                                name="tags"
                                value={formData.tags}
                                onChange={handleChange}
                                placeholder="blitz, championship, thailand"
                                className="input"
                            />
                            <p className="text-xs text-gray-500 mt-2">
                                Separate tags with commas
                            </p>
                        </div>
                    </div>
                </div>
            </form>
        </div>
    );
};

export default TournamentEditor;
