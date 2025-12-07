import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Facebook, Twitter, Instagram, Youtube, Mail } from 'lucide-react';

const Footer = () => {
    const { t } = useTranslation();
    const currentYear = new Date().getFullYear();

    const quickLinks = [
        { path: '/', label: t('nav.home') },
        { path: '/news', label: t('nav.news') },
        { path: '/contact', label: t('nav.contact') },
    ];

    const categories = [
        { path: '/category/tournaments', label: t('categories.tournament') },
        { path: '/category/players', label: t('categories.player') },
        { path: '/category/openings', label: t('categories.opening') },
        { path: '/category/strategy', label: t('categories.strategy') },
    ];

    const socialLinks = [
        { icon: Facebook, href: '#', label: 'Facebook' },
        { icon: Twitter, href: '#', label: 'Twitter' },
        { icon: Instagram, href: '#', label: 'Instagram' },
        { icon: Youtube, href: '#', label: 'YouTube' },
    ];

    return (
        <footer className="bg-gray-900 text-white chess-bg-dark">
            <div className="container py-12 md:py-16">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                    {/* Brand */}
                    <div className="lg:col-span-1">
                        <Link to="/" className="flex items-center gap-3 mb-4">
                            <div className="w-10 h-10 bg-white rounded-lg flex items-center justify-center">
                                <img src="/assets/images/logo.png" alt="Logo" />
                            </div>
                            <div>
                                <h3 className="text-lg font-bold leading-none">Pawn to Glory</h3>
                                <p className="text-xs text-gray-400">Chess News Hub</p>
                            </div>
                        </Link>
                        <p className="text-gray-400 text-sm mb-4">
                            {t('footer.description')}
                        </p>

                        {/* Social Links */}
                        <div className="flex items-center gap-3">
                            {socialLinks.map((social) => (
                                <a
                                    key={social.label}
                                    href={social.href}
                                    className="w-9 h-9 bg-gray-800 rounded-full flex items-center justify-center hover:bg-white hover:text-gray-900 transition-colors"
                                    aria-label={social.label}
                                >
                                    <social.icon className="w-4 h-4" />
                                </a>
                            ))}
                        </div>
                    </div>

                    {/* Quick Links */}
                    <div>
                        <h4 className="text-lg font-bold mb-4">{t('footer.quickLinks')}</h4>
                        <ul className="space-y-2">
                            {quickLinks.map((link) => (
                                <li key={link.path}>
                                    <Link
                                        to={link.path}
                                        className="text-gray-400 hover:text-white transition-colors"
                                    >
                                        {link.label}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Categories */}
                    <div>
                        <h4 className="text-lg font-bold mb-4">{t('categories.title')}</h4>
                        <ul className="space-y-2">
                            {categories.map((category) => (
                                <li key={category.path}>
                                    <Link
                                        to={category.path}
                                        className="text-gray-400 hover:text-white transition-colors"
                                    >
                                        {category.label}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Newsletter */}
                    <div>
                        <h4 className="text-lg font-bold mb-4">{t('sidebar.newsletter')}</h4>
                        <p className="text-gray-400 text-sm mb-4">
                            {t('sidebar.emailPlaceholder')}
                        </p>
                        <form className="flex gap-2">
                            <input
                                type="email"
                                placeholder="Email"
                                className="flex-1 px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-white"
                            />
                            <button
                                type="submit"
                                className="px-4 py-2 bg-white text-gray-900 font-medium rounded-lg hover:bg-gray-200 transition-colors"
                            >
                                <Mail className="w-5 h-5" />
                            </button>
                        </form>
                    </div>
                </div>
            </div>

            {/* Copyright */}
            <div className="border-t border-gray-800">
                <div className="container py-6 flex flex-col sm:flex-row items-center justify-between gap-4">
                    <p className="text-gray-400 text-sm text-center sm:text-left">
                        © {currentYear} Pawn to Glory. All rights reserved.
                    </p>
                    <div className="flex items-center gap-4 text-sm text-gray-400">
                        <a href="#" className="hover:text-white transition-colors">Privacy Policy</a>
                        <a href="#" className="hover:text-white transition-colors">Terms of Service</a>
                    </div>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
