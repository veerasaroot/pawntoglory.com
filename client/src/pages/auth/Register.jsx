import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Eye, EyeOff, ArrowLeft } from 'lucide-react';
import toast from 'react-hot-toast';
import { useAuth } from '../../context/AuthContext';

const Register = () => {
    const { t } = useTranslation();
    const navigate = useNavigate();
    const { register } = useAuth();

    const [formData, setFormData] = useState({
        name: '',
        email: '',
        password: '',
        confirmPassword: '',
    });
    const [showPassword, setShowPassword] = useState(false);
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (formData.password !== formData.confirmPassword) {
            toast.error('Passwords do not match');
            return;
        }

        if (formData.password.length < 6) {
            toast.error('Password must be at least 6 characters');
            return;
        }

        setLoading(true);

        try {
            await register(formData.name, formData.email, formData.password);
            toast.success('Account created successfully!');
            navigate('/');
        } catch (error) {
            toast.error(error.response?.data?.message || 'Registration failed');
        } finally {
            setLoading(false);
        }
    };

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    return (
        <div className="min-h-screen flex chess-bg">
            {/* Left Panel - Branding */}
            <div className="hidden lg:flex lg:w-1/2 bg-gray-900 chess-bg-dark flex-col justify-between p-12">
                <div className="flex items-center justify-between">
                    <Link to="/" className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-white rounded-lg flex items-center justify-center">
                            <svg className="w-6 h-6 text-gray-900" viewBox="0 0 24 24" fill="currentColor">
                                <path d="M19 22H5V20H19V22ZM17 10C17 6.13 13.86 3.01 10 3.01C10 3.01 10 3 10 3C9.32 3 8.66 3.1 8.02 3.29L7.21 2.35C8.06 1.82 9 1.45 10 1.27V1C10 0.45 10.45 0 11 0H13C13.55 0 14 0.45 14 1V1.27C17.53 1.94 20.22 4.82 20.86 8.38C21.08 9.56 20.16 10.63 18.96 10.63H17.47C17.17 10.63 16.92 10.44 16.84 10.16C16.73 9.78 16.5 9 16.5 9L13.3 12L11 18H17V10Z" />
                            </svg>
                        </div>
                        <span className="text-xl font-bold text-white">Pawn to Glory</span>
                    </Link>

                    <Link
                        to="/login"
                        className="px-6 py-2 bg-white text-gray-900 font-medium rounded-lg hover:bg-gray-100 transition-colors"
                    >
                        {t('auth.login')}
                    </Link>
                </div>

                <div className="text-center">
                    <div className="w-48 h-48 mx-auto mb-6 opacity-30">
                        <svg viewBox="0 0 24 24" fill="white" className="w-full h-full">
                            <path d="M19 22H5V20H19V22ZM17 10C17 6.13 13.86 3.01 10 3.01C10 3.01 10 3 10 3C9.32 3 8.66 3.1 8.02 3.29L7.21 2.35C8.06 1.82 9 1.45 10 1.27V1C10 0.45 10.45 0 11 0H13C13.55 0 14 0.45 14 1V1.27C17.53 1.94 20.22 4.82 20.86 8.38C21.08 9.56 20.16 10.63 18.96 10.63H17.47C17.17 10.63 16.92 10.44 16.84 10.16C16.73 9.78 16.5 9 16.5 9L13.3 12L11 18H17V10Z" />
                        </svg>
                    </div>
                    <h2 className="text-2xl font-bold text-white mb-2">Join Our Community</h2>
                    <p className="text-gray-400">Stay updated with the latest chess news</p>
                </div>

                <Link
                    to="/"
                    className="inline-flex items-center gap-2 text-gray-400 hover:text-white transition-colors"
                >
                    <ArrowLeft className="w-4 h-4" />
                    {t('auth.backToHome')}
                </Link>
            </div>

            {/* Right Panel - Form */}
            <div className="w-full lg:w-1/2 flex items-center justify-center p-8">
                <div className="w-full max-w-md">
                    <Link
                        to="/"
                        className="lg:hidden inline-flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-8 transition-colors"
                    >
                        <ArrowLeft className="w-4 h-4" />
                        {t('auth.backToHome')}
                    </Link>

                    <h1 className="text-3xl font-bold text-gray-900 mb-2">{t('auth.register')}</h1>
                    <p className="text-gray-500 mb-8">Create your free account</p>

                    <form onSubmit={handleSubmit} className="space-y-5">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                {t('auth.name')}
                            </label>
                            <input
                                type="text"
                                name="name"
                                value={formData.name}
                                onChange={handleChange}
                                placeholder="John Doe"
                                className="input"
                                required
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                {t('auth.email')}
                            </label>
                            <input
                                type="email"
                                name="email"
                                value={formData.email}
                                onChange={handleChange}
                                placeholder="you@example.com"
                                className="input"
                                required
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                {t('auth.password')}
                            </label>
                            <div className="relative">
                                <input
                                    type={showPassword ? 'text' : 'password'}
                                    name="password"
                                    value={formData.password}
                                    onChange={handleChange}
                                    placeholder="••••••••"
                                    className="input pr-12"
                                    required
                                    minLength={6}
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPassword(!showPassword)}
                                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
                                >
                                    {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                                </button>
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                {t('auth.confirmPassword')}
                            </label>
                            <input
                                type="password"
                                name="confirmPassword"
                                value={formData.confirmPassword}
                                onChange={handleChange}
                                placeholder="••••••••"
                                className="input"
                                required
                            />
                        </div>

                        <button
                            type="submit"
                            disabled={loading}
                            className="btn btn-primary w-full justify-center"
                        >
                            {loading ? (
                                <div className="spinner w-5 h-5 border-2 border-white border-t-transparent" />
                            ) : (
                                t('auth.signUp')
                            )}
                        </button>
                    </form>

                    <p className="mt-8 text-center text-gray-600">
                        {t('auth.hasAccount')}{' '}
                        <Link to="/login" className="text-gray-900 font-medium hover:underline">
                            {t('auth.signIn')}
                        </Link>
                    </p>
                </div>
            </div>
        </div>
    );
};

export default Register;
