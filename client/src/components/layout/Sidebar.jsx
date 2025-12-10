import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Search, TrendingUp, BookOpen, User, Mail } from 'lucide-react';

const Sidebar = ({ author, categories = [], popularArticles = [] }) => {
    const { t } = useTranslation();

    return (
        <aside className="space-y-6">
            {/* Author Widget */}
            {author && (
                <div className="bg-white border border-gray-200 rounded-xl p-5 text-center">
                    <div className="w-24 h-24 mx-auto mb-4 rounded-full overflow-hidden bg-gray-100">
                        <img
                            src={author.avatar || '/images/placeholder-avatar.jpg'}
                            alt={author.name}
                            className="w-full h-full object-cover"
                        />
                    </div>
                    <h3 className="font-bold text-lg text-gray-900">{author.name}</h3>
                    <p className="text-gray-500 text-sm mt-2 line-clamp-3">
                        {author.bio || t('sidebar.about')}
                    </p>
                    <div className="flex justify-center gap-3 mt-4">
                        {['facebook', 'twitter', 'instagram'].map((social) => (
                            <a
                                key={social}
                                href="#"
                                className="w-9 h-9 bg-gray-100 rounded-full flex items-center justify-center hover:bg-gray-900 hover:text-white transition-colors"
                            >
                                <span className="sr-only">{social}</span>
                                <User className="w-4 h-4" />
                            </a>
                        ))}
                    </div>
                </div>
            )}

            {/* Search Widget */}
            <div className="bg-white border border-gray-200 rounded-xl p-5">
                <form>
                    <div className="relative">
                        <input
                            type="text"
                            placeholder={t('common.search')}
                            className="input pr-12"
                        />
                        <button
                            type="submit"
                            className="absolute right-2 top-1/2 -translate-y-1/2 p-2 bg-gray-900 text-white rounded-lg hover:bg-gray-800 transition-colors"
                        >
                            <Search className="w-4 h-4" />
                        </button>
                    </div>
                </form>
            </div>

            {/* Categories Widget */}
            {categories.length > 0 && (
                <div className="bg-white border border-gray-200 rounded-xl p-5">
                    <h3 className="font-bold text-lg text-gray-900 mb-4 flex items-center gap-2">
                        <BookOpen className="w-5 h-5" />
                        {t('sidebar.trendingTopics')}
                    </h3>
                    <ul className="space-y-2">
                        {categories.map((category) => (
                            <li key={category._id}>
                                <Link
                                    to={`/category/${category.slug}`}
                                    className="flex items-center justify-between py-2 px-3 rounded-lg hover:bg-gray-100 transition-colors group"
                                >
                                    <span className="text-gray-700 group-hover:text-gray-900">
                                        {category.name}
                                    </span>
                                    <span className="text-sm text-gray-400">
                                        ({category.articleCount || 0})
                                    </span>
                                </Link>
                            </li>
                        ))}
                    </ul>
                </div>
            )}

            {/* Popular Posts Widget */}
            {popularArticles.length > 0 && (
                <div className="bg-white border border-gray-200 rounded-xl p-5">
                    <h3 className="font-bold text-lg text-gray-900 mb-4 flex items-center gap-2">
                        <TrendingUp className="w-5 h-5" />
                        {t('sidebar.popularPosts')}
                    </h3>
                    <div className="space-y-4">
                        {popularArticles.map((article, index) => (
                            <Link
                                key={article._id}
                                to={`/news/${article.slug}`}
                                className="flex gap-3 group"
                            >
                                <div className="w-16 h-16 flex-shrink-0 rounded-lg overflow-hidden bg-gray-100">
                                    <img
                                        src={article.featuredImage || '/placeholder-chess.jpg'}
                                        alt={article.title}
                                        className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
                                    />
                                </div>
                                <div className="flex-1 min-w-0">
                                    <span className="text-xs text-gray-500">
                                        {new Date(article.publishedAt || article.createdAt).toLocaleDateString(
                                            'th-TH',
                                            { day: 'numeric', month: 'short', year: 'numeric' }
                                        )}
                                    </span>
                                    <h4 className="font-semibold text-sm text-gray-900 line-clamp-2 group-hover:text-gray-600 transition-colors mt-1">
                                        {article.title}
                                    </h4>
                                </div>
                            </Link>
                        ))}
                    </div>
                </div>
            )}

            {/* Newsletter Widget */}
            <div className="bg-gray-900 rounded-xl p-5 text-center chess-bg-dark">
                <Mail className="w-10 h-10 text-white mx-auto mb-3" />
                <h3 className="font-bold text-lg text-white mb-2" style={{ color: 'white' }}>{t('sidebar.newsletter')}</h3>
                <p className="text-gray-400 text-sm mb-4">
                    Stay updated with the latest chess news
                </p>
                <form className="space-y-3">
                    <input
                        type="email"
                        placeholder={t('sidebar.emailPlaceholder')}
                        className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-white"
                    />
                    <button
                        type="submit"
                        className="w-full py-3 bg-white text-gray-900 font-semibold rounded-lg hover:bg-gray-200 transition-colors"
                    >
                        {t('sidebar.subscribe')}
                    </button>
                </form>
            </div>
        </aside>
    );
};

export default Sidebar;
