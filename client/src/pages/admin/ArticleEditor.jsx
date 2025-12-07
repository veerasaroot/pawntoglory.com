import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { ArrowLeft, Save, Eye, Image, X, Upload } from 'lucide-react';
import toast from 'react-hot-toast';
import { getCategories, createArticle, updateArticle, uploadImage } from '../../services/api';
import axios from 'axios';

const ArticleEditor = () => {
    const { t } = useTranslation();
    const { id } = useParams();
    const navigate = useNavigate();
    const isEditing = !!id;

    const [categories, setCategories] = useState([]);
    const [formData, setFormData] = useState({
        title: '',
        slug: '',
        excerpt: '',
        content: '',
        category: '',
        featuredImage: '',
        status: 'draft',
        tags: '',
    });
    const [loading, setLoading] = useState(false);
    const [uploading, setUploading] = useState(false);

    useEffect(() => {
        fetchCategories();
        if (isEditing) {
            fetchArticle();
        }
    }, [isEditing, id]);

    const fetchCategories = async () => {
        try {
            const data = await getCategories();
            setCategories(data || []);
        } catch (error) {
            console.error('Error fetching categories:', error);
        }
    };

    const fetchArticle = async () => {
        try {
            const response = await axios.get(`/api/articles/admin`);
            const article = response.data.find(a => a._id === id);
            if (article) {
                setFormData({
                    title: article.title || '',
                    slug: article.slug || '',
                    excerpt: article.excerpt || '',
                    content: article.content || '',
                    category: article.category?._id || '',
                    featuredImage: article.featuredImage || '',
                    status: article.status || 'draft',
                    tags: article.tags?.join(', ') || '',
                });
            }
        } catch (error) {
            console.error('Error fetching article:', error);
            toast.error('Failed to load article');
        }
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });

        // Auto-generate slug from title
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
            if (isEditing) {
                await updateArticle(id, formData);
                toast.success('Article updated!');
            } else {
                await createArticle(formData);
                toast.success('Article created!');
            }
            navigate('/admin/articles');
        } catch (error) {
            toast.error(error.response?.data?.message || 'Failed to save article');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div>
            {/* Header */}
            <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-4">
                    <button
                        onClick={() => navigate('/admin/articles')}
                        className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                    >
                        <ArrowLeft className="w-5 h-5" />
                    </button>
                    <h1 className="text-2xl font-bold text-gray-900">
                        {isEditing ? t('admin.editArticle') : t('admin.createArticle')}
                    </h1>
                </div>
                <div className="flex items-center gap-3">
                    {formData.slug && (
                        <a
                            href={`/news/${formData.slug}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="btn btn-secondary"
                        >
                            <Eye className="w-4 h-4" />
                            Preview
                        </a>
                    )}
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
            </div>

            <form onSubmit={handleSubmit}>
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    {/* Main Content */}
                    <div className="lg:col-span-2 space-y-6">
                        <div className="bg-white rounded-xl border border-gray-200 p-6">
                            <div className="space-y-5">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Title
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
                                        Excerpt
                                    </label>
                                    <textarea
                                        name="excerpt"
                                        value={formData.excerpt}
                                        onChange={handleChange}
                                        rows={3}
                                        className="input resize-none"
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Content (HTML supported)
                                    </label>
                                    <textarea
                                        name="content"
                                        value={formData.content}
                                        onChange={handleChange}
                                        rows={15}
                                        className="input resize-none font-mono text-sm"
                                        placeholder="<p>Write your article content here...</p>"
                                        required
                                    />
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Sidebar */}
                    <div className="space-y-6">
                        {/* Status */}
                        <div className="bg-white rounded-xl border border-gray-200 p-6">
                            <h3 className="font-semibold text-gray-900 mb-4">Publish</h3>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Status
                                </label>
                                <select
                                    name="status"
                                    value={formData.status}
                                    onChange={handleChange}
                                    className="input"
                                >
                                    <option value="draft">Draft</option>
                                    <option value="published">Published</option>
                                </select>
                            </div>
                        </div>

                        {/* Category */}
                        <div className="bg-white rounded-xl border border-gray-200 p-6">
                            <h3 className="font-semibold text-gray-900 mb-4">Category</h3>
                            <select
                                name="category"
                                value={formData.category}
                                onChange={handleChange}
                                className="input"
                            >
                                <option value="">Select category</option>
                                {categories.map((cat) => (
                                    <option key={cat._id} value={cat._id}>
                                        {cat.name}
                                    </option>
                                ))}
                            </select>
                        </div>

                        {/* Featured Image */}
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
                                    <div className="mt-3">
                                        <p className="text-xs text-gray-400 mb-2">Or paste URL:</p>
                                        <input
                                            type="text"
                                            name="featuredImage"
                                            value={formData.featuredImage}
                                            onChange={handleChange}
                                            placeholder="https://..."
                                            className="input text-sm"
                                        />
                                    </div>
                                </div>
                            )}
                        </div>

                        {/* Tags */}
                        <div className="bg-white rounded-xl border border-gray-200 p-6">
                            <h3 className="font-semibold text-gray-900 mb-4">Tags</h3>
                            <input
                                type="text"
                                name="tags"
                                value={formData.tags}
                                onChange={handleChange}
                                placeholder="chess, tournament, opening"
                                className="input"
                            />
                            <p className="text-xs text-gray-500 mt-2">Separate tags with commas</p>
                        </div>
                    </div>
                </div>
            </form>
        </div>
    );
};

export default ArticleEditor;
