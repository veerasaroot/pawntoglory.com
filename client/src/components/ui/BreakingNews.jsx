import { useRef, useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { ChevronLeft, ChevronRight, Zap } from 'lucide-react';

const BreakingNews = ({ articles = [] }) => {
    const { t } = useTranslation();
    const scrollRef = useRef(null);
    const [canScrollLeft, setCanScrollLeft] = useState(false);
    const [canScrollRight, setCanScrollRight] = useState(true);

    const checkScrollButtons = () => {
        if (scrollRef.current) {
            const { scrollLeft, scrollWidth, clientWidth } = scrollRef.current;
            setCanScrollLeft(scrollLeft > 0);
            setCanScrollRight(scrollLeft < scrollWidth - clientWidth - 10);
        }
    };

    useEffect(() => {
        checkScrollButtons();
        const ref = scrollRef.current;
        if (ref) {
            ref.addEventListener('scroll', checkScrollButtons);
            return () => ref.removeEventListener('scroll', checkScrollButtons);
        }
    }, [articles]);

    const scroll = (direction) => {
        if (scrollRef.current) {
            const scrollAmount = 300;
            scrollRef.current.scrollBy({
                left: direction === 'left' ? -scrollAmount : scrollAmount,
                behavior: 'smooth',
            });
        }
    };

    if (!articles.length) return null;

    return (
        <section className="py-6 md:py-8">
            <div className="container">
                <div className="bg-gray-900 rounded-xl p-4 md:p-5">
                    <div className="flex items-center gap-4 mb-4">
                        <div className="flex items-center gap-2 text-white">
                            <Zap className="w-5 h-5 text-yellow-400 fill-yellow-400" />
                            <span className="font-bold uppercase tracking-wide text-sm">
                                {t('home.breakingNews')}
                            </span>
                        </div>

                        <div className="flex-1 h-px bg-gray-700" />

                        {/* Scroll Buttons */}
                        <div className="flex items-center gap-2">
                            <button
                                onClick={() => scroll('left')}
                                disabled={!canScrollLeft}
                                className={`p-1.5 rounded-lg transition-colors ${canScrollLeft
                                    ? 'bg-gray-800 hover:bg-gray-700 text-white'
                                    : 'bg-gray-800/50 text-gray-600 cursor-not-allowed'
                                    }`}
                            >
                                <ChevronLeft className="w-4 h-4" />
                            </button>
                            <button
                                onClick={() => scroll('right')}
                                disabled={!canScrollRight}
                                className={`p-1.5 rounded-lg transition-colors ${canScrollRight
                                    ? 'bg-gray-800 hover:bg-gray-700 text-white'
                                    : 'bg-gray-800/50 text-gray-600 cursor-not-allowed'
                                    }`}
                            >
                                <ChevronRight className="w-4 h-4" />
                            </button>
                        </div>
                    </div>

                    {/* Scrollable Cards */}
                    <div
                        ref={scrollRef}
                        className="flex gap-4 overflow-x-auto scrollbar-hide snap-x snap-mandatory pb-2"
                        style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
                    >
                        {articles.map((article) => (
                            <article
                                key={article._id}
                                className="flex-shrink-0 w-72 snap-start bg-gray-800 rounded-lg overflow-hidden group"
                            >
                                <Link to={`/news/${article.slug}`} className="flex gap-3 p-3">
                                    <div className="w-20 h-20 flex-shrink-0 rounded-lg overflow-hidden">
                                        <img
                                            src={article.featuredImage || '/placeholder-chess.jpg'}
                                            alt={article.title}
                                            className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
                                        />
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <span className="text-xs text-gray-400">
                                            {new Date(article.publishedAt || article.createdAt).toLocaleDateString(
                                                'th-TH',
                                                { day: 'numeric', month: 'short' }
                                            )}
                                        </span>
                                        <h3 className="text-white text-sm font-semibold mt-1 line-clamp-2 group-hover:text-gray-300 transition-colors" style={{ color: 'white' }}>
                                            {article.title}
                                        </h3>
                                    </div>
                                </Link>
                            </article>
                        ))}
                    </div>
                </div>
            </div>
        </section>
    );
};

export default BreakingNews;
