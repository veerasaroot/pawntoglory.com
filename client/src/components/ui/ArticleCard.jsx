import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Clock, Eye, User } from 'lucide-react';

const ArticleCard = ({ article, variant = 'default', showExcerpt = true }) => {
    const { t } = useTranslation();

    const formatDate = (date) => {
        return new Date(date).toLocaleDateString('th-TH', {
            day: 'numeric',
            month: 'short',
            year: 'numeric',
        });
    };

    if (variant === 'featured') {
        return (
            <article className="group relative overflow-hidden rounded-xl aspect-hero">
                <img
                    src={article.featuredImage || '/placeholder-chess.jpg'}
                    alt={article.title}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                />
                <div className="overlay" />
                <div className="absolute bottom-0 left-0 right-0 p-6 md:p-8 z-10">
                    <span className="badge mb-3">{article.category?.name || 'Chess'}</span>
                    <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold text-white mb-3 line-clamp-2 text-balance">
                        <Link to={`/news/${article.slug}`} className="hover:underline">
                            {article.title}
                        </Link>
                    </h2>
                    {showExcerpt && (
                        <p className="text-gray-200 mb-4 line-clamp-2 hidden sm:block">
                            {article.excerpt}
                        </p>
                    )}
                    <div className="flex items-center gap-4 text-sm text-gray-300">
                        <div className="flex items-center gap-1">
                            <User className="w-4 h-4" />
                            <span>{article.author?.name || 'Admin'}</span>
                        </div>
                        <div className="flex items-center gap-1">
                            <Clock className="w-4 h-4" />
                            <span>{formatDate(article.publishedAt || article.createdAt)}</span>
                        </div>
                    </div>
                </div>
            </article>
        );
    }

    if (variant === 'horizontal') {
        return (
            <article className="group flex gap-4 p-4 bg-white rounded-lg border border-gray-200 hover:shadow-md transition-shadow">
                <div className="w-24 h-24 sm:w-32 sm:h-24 flex-shrink-0 rounded-lg overflow-hidden">
                    <img
                        src={article.featuredImage || '/placeholder-chess.jpg'}
                        alt={article.title}
                        className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
                    />
                </div>
                <div className="flex-1 min-w-0">
                    <span className="text-xs font-semibold text-gray-500 uppercase">
                        {article.category?.name || 'Chess'}
                    </span>
                    <h3 className="font-bold text-gray-900 mt-1 line-clamp-2 group-hover:text-gray-600 transition-colors">
                        <Link to={`/news/${article.slug}`}>{article.title}</Link>
                    </h3>
                    <div className="flex items-center gap-3 mt-2 text-xs text-gray-500">
                        <span>{formatDate(article.publishedAt || article.createdAt)}</span>
                        <span className="flex items-center gap-1">
                            <Eye className="w-3 h-3" />
                            {article.views || 0}
                        </span>
                    </div>
                </div>
            </article>
        );
    }

    // Default card style
    return (
        <article className="card group">
            <div className="relative aspect-card overflow-hidden">
                <img
                    src={article.featuredImage || '/placeholder-chess.jpg'}
                    alt={article.title}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                />
                <div className="absolute top-3 left-3">
                    <span className="badge">{article.category?.name || 'Chess'}</span>
                </div>
            </div>
            <div className="p-5">
                <h3 className="text-lg font-bold text-gray-900 mb-2 line-clamp-2 group-hover:text-gray-600 transition-colors">
                    <Link to={`/news/${article.slug}`}>{article.title}</Link>
                </h3>
                {showExcerpt && (
                    <p className="text-gray-600 text-sm mb-4 line-clamp-2">{article.excerpt}</p>
                )}
                <div className="flex items-center justify-between text-sm text-gray-500">
                    <div className="flex items-center gap-2">
                        <div className="w-7 h-7 bg-gray-900 rounded-full flex items-center justify-center">
                            <span className="text-white text-xs font-medium">
                                {article.author?.name?.charAt(0) || 'A'}
                            </span>
                        </div>
                        <span>{article.author?.name || 'Admin'}</span>
                    </div>
                    <span>{formatDate(article.publishedAt || article.createdAt)}</span>
                </div>
            </div>
        </article>
    );
};

export default ArticleCard;
