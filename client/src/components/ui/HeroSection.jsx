import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import ArticleCard from './ArticleCard';

const HeroSection = ({ articles = [] }) => {
    const { t } = useTranslation();

    // Get featured articles for hero
    const mainFeatured = articles[0];
    const secondaryFeatured = articles.slice(1, 3);

    if (!mainFeatured) {
        return null;
    }

    return (
        <section className="py-6 md:py-8">
            <div className="container">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                    {/* Main Featured Article */}
                    <div className="lg:row-span-2">
                        <ArticleCard article={mainFeatured} variant="featured" />
                    </div>

                    {/* Secondary Featured Articles */}
                    <div className="flex flex-col gap-4">
                        {secondaryFeatured.map((article) => (
                            <article
                                key={article._id}
                                className="group relative overflow-hidden rounded-xl aspect-video lg:aspect-auto lg:flex-1"
                            >
                                <img
                                    src={article.featuredImage || '/placeholder-chess.jpg'}
                                    alt={article.title}
                                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                                />
                                <div className="overlay" />
                                <div className="absolute bottom-0 left-0 right-0 p-4 md:p-5 z-10">
                                    <span className="badge mb-2 text-xs">
                                        {article.category?.name || 'Chess'}
                                    </span>
                                    <h3 className="text-lg md:text-xl font-bold text-white line-clamp-2" style={{ color: 'white' }}>
                                        <Link to={`/news/${article.slug}`} className="hover:underline">
                                            {article.title}
                                        </Link>
                                    </h3>
                                </div>
                            </article>
                        ))}
                    </div>
                </div>
            </div>
        </section>
    );
};

export default HeroSection;
