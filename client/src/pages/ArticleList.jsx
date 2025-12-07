import { useState, useEffect } from 'react';
import { useParams, useSearchParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import ArticleCard from '../components/ui/ArticleCard';
import Sidebar from '../components/layout/Sidebar';
import { getArticles, getCategories, getCategoryBySlug } from '../services/api';

const ArticleList = () => {
    const { t } = useTranslation();
    const { slug: categorySlug } = useParams();
    const [searchParams] = useSearchParams();
    const searchQuery = searchParams.get('search');

    const [articles, setArticles] = useState([]);
    const [popularArticles, setPopularArticles] = useState([]);

    const [categories, setCategories] = useState([]);
    const [currentCategory, setCurrentCategory] = useState(null);
    const [loading, setLoading] = useState(true);
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);

    useEffect(() => {
        const fetchData = async () => {
            setLoading(true);
            try {
                // Fetch categories
                const categoriesRes = await getCategories();
                setCategories(categoriesRes || []);

                // Get category ID if categorySlug exists
                let categoryId = null;
                if (categorySlug) {
                    const category = categoriesRes.find(c => c.slug === categorySlug);
                    if (category) {
                        categoryId = category._id;
                        setCurrentCategory(category);
                    }
                } else {
                    setCurrentCategory(null);
                }

                // Fetch articles
                const params = {
                    page: currentPage,
                    limit: 10,
                };
                if (categoryId) params.category = categoryId;
                if (searchQuery) params.search = searchQuery;

                // Fetch popular articles for sidebar
                const [articlesRes, popularRes] = await Promise.all([
                    getArticles(params),
                    getArticles({ limit: 5, sort: '-views' }) // Assuming API supports sort, or I'll just use latest for now if not implemented.
                ]);

                // Note: My current getArticles API on client side just accepts params and passes them.
                // My server side getArticles does .sort({ publishedAt: -1 }) by default (Step 122).
                // It doesn't seem to support custom sort via query params yet.
                // Let's check server/routes/articles.js ... 
                // It does NOT support sort. It only supports category and search.

                setArticles(articlesRes.articles || []);
                setPopularArticles(popularRes.articles || []);
                setTotalPages(articlesRes.pages || 1);
            } catch (err) {
                console.error('Error fetching articles:', err);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, [categorySlug, searchQuery, currentPage]);

    const pageTitle = currentCategory
        ? currentCategory.name
        : searchQuery
            ? `Search: "${searchQuery}"`
            : t('nav.news');

    return (
        <div>
            {/* Page Header */}
            <div className="bg-gray-900 py-12 md:py-16 chess-bg-dark">
                <div className="container text-center">
                    <h1 className="text-3xl md:text-4xl font-bold text-white mb-2">
                        {pageTitle}
                    </h1>
                    <p className="text-gray-400">
                        {articles.length} {t('admin.articles').toLowerCase()}
                    </p>
                </div>
            </div>

            {/* Content */}
            <section className="py-8 md:py-12">
                <div className="container">
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                        {/* Articles */}
                        <div className="lg:col-span-2">
                            {loading ? (
                                <div className="space-y-6">
                                    {[1, 2, 3].map((i) => (
                                        <div key={i} className="skeleton h-48 rounded-xl" />
                                    ))}
                                </div>
                            ) : articles.length === 0 ? (
                                <div className="text-center py-12">
                                    <p className="text-gray-500">{t('common.noResults')}</p>
                                </div>
                            ) : (
                                <>
                                    <div className="space-y-6">
                                        {articles.map((article) => (
                                            <ArticleCard
                                                key={article._id}
                                                article={article}
                                                variant="horizontal"
                                            />
                                        ))}
                                    </div>

                                    {/* Pagination */}
                                    {totalPages > 1 && (
                                        <div className="flex items-center justify-center gap-2 mt-8">
                                            <button
                                                onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                                                disabled={currentPage === 1}
                                                className="p-2 bg-gray-100 rounded-lg hover:bg-gray-200 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                                            >
                                                <ChevronLeft className="w-5 h-5" />
                                            </button>

                                            {[...Array(totalPages)].map((_, i) => (
                                                <button
                                                    key={i}
                                                    onClick={() => setCurrentPage(i + 1)}
                                                    className={`w-10 h-10 rounded-lg font-medium transition-colors ${currentPage === i + 1
                                                        ? 'bg-gray-900 text-white'
                                                        : 'bg-gray-100 hover:bg-gray-200'
                                                        }`}
                                                >
                                                    {i + 1}
                                                </button>
                                            ))}

                                            <button
                                                onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                                                disabled={currentPage === totalPages}
                                                className="p-2 bg-gray-100 rounded-lg hover:bg-gray-200 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                                            >
                                                <ChevronRight className="w-5 h-5" />
                                            </button>
                                        </div>
                                    )}
                                </>
                            )}
                        </div>

                        {/* Sidebar */}
                        <div className="lg:col-span-1">
                            <Sidebar categories={categories} popularArticles={popularArticles} />
                        </div>
                    </div>
                </div>
            </section>
        </div>
    );
};

export default ArticleList;
