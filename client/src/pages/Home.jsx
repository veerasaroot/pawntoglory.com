import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { ArrowRight } from 'lucide-react';
import HeroSection from '../components/ui/HeroSection';
import BreakingNews from '../components/ui/BreakingNews';
import ArticleCard from '../components/ui/ArticleCard';
import Sidebar from '../components/layout/Sidebar';
import { getArticles, getCategories } from '../services/api';

const Home = () => {
    const { t } = useTranslation();
    const [articles, setArticles] = useState([]);
    const [categories, setCategories] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchData = async () => {
            try {
                setLoading(true);
                const [articlesRes, categoriesRes] = await Promise.all([
                    getArticles({ limit: 10 }),
                    getCategories(),
                ]);
                setArticles(articlesRes.articles || []);
                setCategories(categoriesRes || []);
            } catch (err) {
                console.error('Error fetching data:', err);
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, []);

    const featuredArticles = articles.slice(0, 3);
    const breakingNews = articles.slice(0, 5);
    const latestArticles = articles.slice(0, 6);
    const popularArticles = [...articles].sort((a, b) => b.views - a.views).slice(0, 4);

    if (loading) {
        return (
            <div className="container py-8">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mb-8">
                    <div className="skeleton h-80 rounded-xl" />
                    <div className="space-y-4">
                        <div className="skeleton h-36 rounded-xl" />
                        <div className="skeleton h-36 rounded-xl" />
                    </div>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="container py-12 text-center">
                <p className="text-red-600 mb-4">Error: {error}</p>
                <p className="text-gray-500">Please make sure the backend server is running.</p>
            </div>
        );
    }

    // Show empty state if no articles
    if (articles.length === 0) {
        return (
            <div className="container py-12 text-center">
                <div className="max-w-md mx-auto">
                    <div className="w-24 h-24 bg-gray-200 rounded-full flex items-center justify-center mx-auto mb-6">
                        <svg className="w-12 h-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z" />
                        </svg>
                    </div>
                    <h2 className="text-2xl font-bold text-gray-900 mb-2">No Articles Yet</h2>
                    <p className="text-gray-500 mb-6">Be the first to create an article for your chess news website.</p>
                    <Link to="/admin/articles/new" className="btn btn-primary">
                        Create First Article
                    </Link>
                </div>
            </div>
        );
    }

    return (
        <div>
            {/* Hero Section */}
            <HeroSection articles={featuredArticles} />

            {/* Breaking News */}
            <BreakingNews articles={breakingNews} />

            {/* Main Content */}
            <section className="py-8 md:py-12">
                <div className="container">
                    <div className="flex items-center justify-between mb-6">
                        <h2 className="text-2xl md:text-3xl font-bold text-gray-900 relative pb-3">
                            {t('home.topHighlights')}
                            <span className="absolute bottom-0 left-0 w-20 h-1 bg-gray-900 rounded-full" />
                        </h2>
                        <Link
                            to="/news"
                            className="flex items-center gap-1 text-gray-600 hover:text-gray-900 transition-colors font-medium"
                        >
                            {t('home.viewAll')}
                            <ArrowRight className="w-4 h-4" />
                        </Link>
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                        {/* Articles Grid */}
                        <div className="lg:col-span-2">
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                                {latestArticles.map((article) => (
                                    <ArticleCard key={article._id} article={article} />
                                ))}
                            </div>
                        </div>

                        {/* Sidebar */}
                        <div className="lg:col-span-1">
                            <Sidebar
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

export default Home;
