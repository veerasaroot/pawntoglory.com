import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Clock, Eye, Share2, Facebook, Twitter, Linkedin, ArrowLeft } from 'lucide-react';
import Sidebar from '../components/layout/Sidebar';
import ArticleCard from '../components/ui/ArticleCard';
import { getArticleBySlug, getArticles, getCategories } from '../services/api';

const ArticleSingle = () => {
    const { t } = useTranslation();
    const { slug } = useParams();
    const [article, setArticle] = useState(null);
    const [relatedArticles, setRelatedArticles] = useState([]);
    const [categories, setCategories] = useState([]);
    const [popularArticles, setPopularArticles] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchArticle = async () => {
            setLoading(true);
            try {
                const [data, categoriesRes, popularRes] = await Promise.all([
                    getArticleBySlug(slug),
                    getCategories(),
                    getArticles({ limit: 5, sort: '-views' })
                ]);

                setArticle(data);
                setCategories(categoriesRes || []);
                setPopularArticles(popularRes.articles || []);

                // Fetch related articles from same category
                if (data.category?._id) {
                    const related = await getArticles({ category: data.category._id, limit: 2 });
                    setRelatedArticles(
                        (related.articles || []).filter(a => a._id !== data._id).slice(0, 2)
                    );
                }
            } catch (err) {
                console.error('Error fetching article:', err);
                setError('Article not found');
            } finally {
                setLoading(false);
            }
        };

        fetchArticle();
    }, [slug]);

    const formatDate = (date) => {
        return new Date(date).toLocaleDateString('th-TH', {
            day: 'numeric',
            month: 'long',
            year: 'numeric',
        });
    };

    const handleShare = (platform) => {
        const url = window.location.href;
        const title = article?.title;

        const shareUrls = {
            facebook: `https://www.facebook.com/sharer/sharer.php?u=${url}`,
            twitter: `https://twitter.com/intent/tweet?url=${url}&text=${title}`,
            linkedin: `https://www.linkedin.com/sharing/share-offsite/?url=${url}`,
        };

        window.open(shareUrls[platform], '_blank', 'width=600,height=400');
    };

    if (loading) {
        return (
            <div className="container py-8">
                <div className="skeleton h-80 rounded-xl mb-6" />
                <div className="skeleton h-8 w-3/4 rounded mb-4" />
                <div className="skeleton h-4 w-1/2 rounded mb-8" />
                <div className="space-y-4">
                    <div className="skeleton h-4 rounded" />
                    <div className="skeleton h-4 rounded" />
                    <div className="skeleton h-4 w-5/6 rounded" />
                </div>
            </div>
        );
    }

    if (error || !article) {
        return (
            <div className="container py-12 text-center">
                <h1 className="text-2xl font-bold text-gray-900 mb-4">Article not found</h1>
                <Link to="/news" className="btn btn-primary">
                    Back to News
                </Link>
            </div>
        );
    }

    return (
        <div>
            {/* Hero Image */}
            {article.featuredImage && (
                <div className="relative h-64 md:h-96 lg:h-[500px]">
                    <img
                        src={article.featuredImage}
                        alt={article.title}
                        className="w-full h-full object-cover"
                    />
                    <div className="overlay" />
                </div>
            )}

            {/* Content */}
            <section className="py-8 md:py-12">
                <div className="container">
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                        {/* Article Content */}
                        <article className="lg:col-span-2">
                            {/* Back Button */}
                            <Link
                                to="/news"
                                className="inline-flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-6 transition-colors"
                            >
                                <ArrowLeft className="w-4 h-4" />
                                {t('auth.backToHome')}
                            </Link>

                            {/* Category */}
                            {article.category && (
                                <span className="badge mb-4">{article.category.name}</span>
                            )}

                            {/* Title */}
                            <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4 text-balance">
                                {article.title}
                            </h1>

                            {/* Meta */}
                            <div className="flex flex-wrap items-center gap-4 mb-6 pb-6 border-b border-gray-200">
                                <div className="flex items-center gap-2">
                                    <div className="w-10 h-10 bg-gray-900 rounded-full flex items-center justify-center">
                                        <span className="text-white font-medium">
                                            {article.author?.name?.charAt(0) || 'A'}
                                        </span>
                                    </div>
                                    <div>
                                        <p className="font-medium text-gray-900">{article.author?.name || 'Admin'}</p>
                                        <p className="text-sm text-gray-500">{formatDate(article.publishedAt || article.createdAt)}</p>
                                    </div>
                                </div>
                                <div className="flex items-center gap-4 text-sm text-gray-500 ml-auto">
                                    <span className="flex items-center gap-1">
                                        <Eye className="w-4 h-4" />
                                        {article.views || 0}
                                    </span>
                                </div>
                            </div>

                            {/* Content */}
                            <div
                                className="prose prose-lg max-w-none prose-headings:font-bold prose-headings:text-gray-900 prose-p:text-gray-600 prose-blockquote:border-l-gray-900 prose-blockquote:text-gray-700"
                                dangerouslySetInnerHTML={{ __html: article.content }}
                            />

                            {/* Tags */}
                            {article.tags && article.tags.length > 0 && (
                                <div className="mt-8 pt-6 border-t border-gray-200">
                                    <h3 className="font-bold text-gray-900 mb-3">{t('article.tags')}</h3>
                                    <div className="flex flex-wrap gap-2">
                                        {article.tags.map((tag) => (
                                            <span
                                                key={tag}
                                                className="px-3 py-1 bg-gray-100 text-gray-700 text-sm rounded-full"
                                            >
                                                {tag}
                                            </span>
                                        ))}
                                    </div>
                                </div>
                            )}

                            {/* Share */}
                            <div className="mt-6 pt-6 border-t border-gray-200">
                                <h3 className="font-bold text-gray-900 mb-3 flex items-center gap-2">
                                    <Share2 className="w-4 h-4" />
                                    {t('article.share')}
                                </h3>
                                <div className="flex gap-3">
                                    <button
                                        onClick={() => handleShare('facebook')}
                                        className="p-2 bg-[#3b5998] text-white rounded-lg hover:opacity-90 transition-opacity"
                                    >
                                        <Facebook className="w-5 h-5" />
                                    </button>
                                    <button
                                        onClick={() => handleShare('twitter')}
                                        className="p-2 bg-[#1da1f2] text-white rounded-lg hover:opacity-90 transition-opacity"
                                    >
                                        <Twitter className="w-5 h-5" />
                                    </button>
                                    <button
                                        onClick={() => handleShare('linkedin')}
                                        className="p-2 bg-[#0077b5] text-white rounded-lg hover:opacity-90 transition-opacity"
                                    >
                                        <Linkedin className="w-5 h-5" />
                                    </button>
                                </div>
                            </div>

                            {/* Author Bio */}
                            {article.author && (
                                <div className="mt-8 p-6 bg-gray-100 rounded-xl">
                                    <div className="flex items-center gap-4">
                                        <div className="w-16 h-16 bg-gray-900 rounded-full flex items-center justify-center">
                                            <span className="text-white text-xl font-bold">
                                                {article.author.name?.charAt(0) || 'A'}
                                            </span>
                                        </div>
                                        <div>
                                            <h4 className="font-bold text-gray-900">{article.author.name}</h4>
                                            {article.author.bio && (
                                                <p className="text-gray-600 text-sm mt-1">{article.author.bio}</p>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            )}

                            {/* Related Articles */}
                            {relatedArticles.length > 0 && (
                                <div className="mt-12">
                                    <h3 className="text-xl font-bold text-gray-900 mb-6">
                                        {t('article.relatedArticles')}
                                    </h3>
                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                                        {relatedArticles.map((related) => (
                                            <ArticleCard key={related._id} article={related} showExcerpt={false} />
                                        ))}
                                    </div>
                                </div>
                            )}
                        </article>

                        {/* Sidebar */}
                        <div className="lg:col-span-1">
                            <Sidebar
                                author={article.author}
                                categories={categories}
                                popularArticles={popularArticles}
                            />
                        </div>
                    </div>
                </div>
            </section>
        </div>
    );
};

export default ArticleSingle;
