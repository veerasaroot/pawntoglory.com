import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useAuth } from '../../context/AuthContext';
import {
    Search,
    Menu,
    X,
    User,
    LogOut,
    LayoutDashboard,
    Globe,
    ChevronDown
} from 'lucide-react';
import { getArticles } from '../../services/api';

const Header = () => {
    const { t, i18n } = useTranslation();
    const { user, isAuthenticated, logout, isEditor } = useAuth();
    const navigate = useNavigate();

    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [isSearchOpen, setIsSearchOpen] = useState(false);
    const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');
    const [headline, setHeadline] = useState('Magnus Carlsen Wins World Chess Championship 2024'); // Default fallback

    useEffect(() => {
        const fetchHeadline = async () => {
            try {
                const data = await getArticles({ limit: 1 });
                if (data.articles && data.articles.length > 0) {
                    setHeadline(data.articles[0].title);
                }
            } catch (error) {
                console.error('Error fetching headline:', error);
            }
        };
        fetchHeadline();
    }, []);

    const toggleLanguage = () => {
        const newLang = i18n.language === 'en' ? 'th' : 'en';
        i18n.changeLanguage(newLang);
    };

    const handleSearch = (e) => {
        e.preventDefault();
        if (searchQuery.trim()) {
            navigate(`/news?search=${encodeURIComponent(searchQuery)}`);
            setIsSearchOpen(false);
            setSearchQuery('');
        }
    };

    const handleLogout = () => {
        logout();
        setIsUserMenuOpen(false);
        navigate('/');
    };

    const navLinks = [
        { path: '/', label: t('nav.home') },
        { path: '/news', label: t('nav.news') },
        { path: '/contact', label: t('nav.contact') },
    ];

    return (
        <header className="sticky top-0 z-50 bg-white border-b border-gray-200">
            {/* Top Bar */}
            <div className="bg-gray-900 text-white py-2">
                <div className="container flex items-center justify-between">
                    <div className="flex items-center gap-4 text-sm">
                        <span className="hidden sm:inline-block px-2 py-0.5 bg-white text-gray-900 text-xs font-bold uppercase">
                            {t('home.breakingNews')}
                        </span>
                        <span className="text-gray-300 text-xs sm:text-sm truncate">
                            {headline}
                        </span>
                    </div>

                    <div className="flex items-center gap-3">
                        {/* Language Switcher */}
                        <button
                            onClick={toggleLanguage}
                            className="flex items-center gap-1 text-sm hover:text-gray-300 transition-colors"
                        >
                            <Globe className="w-4 h-4" />
                            <span className="uppercase font-medium">{i18n.language}</span>
                        </button>
                    </div>
                </div>
            </div>

            {/* Main Header */}
            <div className="container py-4">
                <div className="flex items-center justify-between">
                    {/* Logo */}
                    <Link to="/" className="flex items-center gap-3">
                        <div className="w-16 h-16 flex items-center justify-center">
                            <img src="/assets/images/logo.png" alt="Logo" />
                        </div>
                        <div className="hidden md:block">
                            <h1 className="text-xl font-bold text-gray-900 font-heading leading-none">
                                Pawn to Glory
                            </h1>
                            <p className="text-xs text-gray-500">Chess News Hub</p>
                        </div>
                    </Link>

                    {/* Desktop Navigation */}
                    <nav className="hidden md:flex items-center gap-1">
                        {navLinks.map((link) => (
                            <Link
                                key={link.path}
                                to={link.path}
                                className="px-4 py-2 text-gray-700 font-medium hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors"
                            >
                                {link.label}
                            </Link>
                        ))}
                    </nav>

                    {/* Right Actions */}
                    <div className="flex items-center gap-2">
                        {/* Search Button */}
                        <button
                            onClick={() => setIsSearchOpen(!isSearchOpen)}
                            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                        >
                            <Search className="w-5 h-5 text-gray-700" />
                        </button>

                        {/* User Menu */}
                        {isAuthenticated ? (
                            <div className="relative">
                                <button
                                    onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                                    className="flex items-center gap-2 p-2 hover:bg-gray-100 rounded-lg transition-colors"
                                >
                                    <div className="w-8 h-8 bg-gray-900 rounded-full flex items-center justify-center">
                                        <span className="text-white text-sm font-medium">
                                            {user?.name?.charAt(0).toUpperCase()}
                                        </span>
                                    </div>
                                    <ChevronDown className="w-4 h-4 text-gray-500 hidden sm:block" />
                                </button>

                                {/* User Dropdown */}
                                {isUserMenuOpen && (
                                    <div className="absolute right-0 top-full mt-2 w-48 bg-white border border-gray-200 rounded-lg shadow-lg py-2 z-50">
                                        <div className="px-4 py-2 border-b border-gray-100">
                                            <p className="font-medium text-gray-900 truncate">{user?.name}</p>
                                            <p className="text-xs text-gray-500 truncate">{user?.email}</p>
                                        </div>

                                        {isEditor() && (
                                            <Link
                                                to="/admin"
                                                onClick={() => setIsUserMenuOpen(false)}
                                                className="flex items-center gap-2 px-4 py-2 text-gray-700 hover:bg-gray-100 transition-colors"
                                            >
                                                <LayoutDashboard className="w-4 h-4" />
                                                {t('nav.dashboard')}
                                            </Link>
                                        )}

                                        <button
                                            onClick={handleLogout}
                                            className="w-full flex items-center gap-2 px-4 py-2 text-red-600 hover:bg-red-50 transition-colors"
                                        >
                                            <LogOut className="w-4 h-4" />
                                            {t('nav.logout')}
                                        </button>
                                    </div>
                                )}
                            </div>
                        ) : (
                            <Link
                                to="/login"
                                className="btn btn-primary text-sm"
                            >
                                {t('nav.login')}
                            </Link>
                        )}

                        {/* Mobile Menu Button */}
                        <button
                            onClick={() => setIsMenuOpen(!isMenuOpen)}
                            className="p-2 hover:bg-gray-100 rounded-lg transition-colors md:hidden"
                        >
                            {isMenuOpen ? (
                                <X className="w-5 h-5 text-gray-700" />
                            ) : (
                                <Menu className="w-5 h-5 text-gray-700" />
                            )}
                        </button>
                    </div>
                </div>

                {/* Search Bar */}
                {isSearchOpen && (
                    <form onSubmit={handleSearch} className="mt-4 relative">
                        <input
                            type="text"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            placeholder={t('nav.search')}
                            className="input pr-12"
                            autoFocus
                        />
                        <button
                            type="submit"
                            className="absolute right-2 top-1/2 -translate-y-1/2 p-2 bg-gray-900 text-white rounded-lg hover:bg-gray-800 transition-colors"
                        >
                            <Search className="w-4 h-4" />
                        </button>
                    </form>
                )}

                {/* Mobile Navigation */}
                {isMenuOpen && (
                    <nav className="mt-4 pt-4 border-t border-gray-200 md:hidden">
                        <div className="flex flex-col gap-1">
                            {navLinks.map((link) => (
                                <Link
                                    key={link.path}
                                    to={link.path}
                                    onClick={() => setIsMenuOpen(false)}
                                    className="px-4 py-3 text-gray-700 font-medium hover:bg-gray-100 rounded-lg transition-colors"
                                >
                                    {link.label}
                                </Link>
                            ))}
                        </div>
                    </nav>
                )}
            </div>
        </header>
    );
};

export default Header;
