import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Eye, EyeOff, ArrowLeft } from 'lucide-react';
import toast from 'react-hot-toast';
import { useAuth } from '../../context/AuthContext';

const Login = () => {
    const { t } = useTranslation();
    const navigate = useNavigate();
    const { login } = useAuth();

    const [formData, setFormData] = useState({
        email: '',
        password: '',
    });
    const [showPassword, setShowPassword] = useState(false);
    const [loading, setLoading] = useState(false);
    const [rememberMe, setRememberMe] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        try {
            await login(formData.email, formData.password);
            toast.success('Login successful!');
            navigate('/');
        } catch (error) {
            toast.error(error.response?.data?.message || 'Login failed');
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
                        to="/register"
                        className="px-6 py-2 bg-white text-gray-900 font-medium rounded-lg hover:bg-gray-100 transition-colors"
                    >
                        {t('auth.register')}
                    </Link>
                </div>

                <div className="text-center">
                    {/* Chess Knight Illustration */}
                    <div className="w-48 h-48 mx-auto mb-6 opacity-30">
                        <svg viewBox="0 0 24 24" fill="white" className="w-full h-full">
                            <path d="M19 22H5V20H19V22ZM17 10C17 6.13 13.86 3.01 10 3.01C10 3.01 10 3 10 3C9.32 3 8.66 3.1 8.02 3.29L7.21 2.35C8.06 1.82 9 1.45 10 1.27V1C10 0.45 10.45 0 11 0H13C13.55 0 14 0.45 14 1V1.27C17.53 1.94 20.22 4.82 20.86 8.38C21.08 9.56 20.16 10.63 18.96 10.63H17.47C17.17 10.63 16.92 10.44 16.84 10.16C16.73 9.78 16.5 9 16.5 9L13.3 12L11 18H17V10Z" />
                        </svg>
                    </div>
                    <h2 className="text-2xl font-bold text-white mb-2">Welcome Back</h2>
                    <p className="text-gray-400">Your premier chess news destination</p>
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
                    {/* Mobile Back Button */}
                    <Link
                        to="/"
                        className="lg:hidden inline-flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-8 transition-colors"
                    >
                        <ArrowLeft className="w-4 h-4" />
                        {t('auth.backToHome')}
                    </Link>

                    <h1 className="text-3xl font-bold text-gray-900 mb-2">{t('auth.login')}</h1>
                    <p className="text-gray-500 mb-8">Sign in to your account</p>

                    <form onSubmit={handleSubmit} className="space-y-5">
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

                        <div className="flex items-center justify-between">
                            <label className="flex items-center gap-2 cursor-pointer">
                                <input
                                    type="checkbox"
                                    checked={rememberMe}
                                    onChange={(e) => setRememberMe(e.target.checked)}
                                    className="w-4 h-4 border-gray-300 rounded text-gray-900 focus:ring-gray-900"
                                />
                                <span className="text-sm text-gray-600">{t('auth.rememberMe')}</span>
                            </label>
                            <Link
                                to="/forgot-password"
                                className="text-sm text-gray-900 hover:underline font-medium"
                            >
                                {t('auth.forgotPassword')}
                            </Link>
                        </div>

                        <button
                            type="submit"
                            disabled={loading}
                            className="btn btn-primary w-full justify-center"
                        >
                            {loading ? (
                                <div className="spinner w-5 h-5 border-2 border-white border-t-transparent" />
                            ) : (
                                t('auth.signIn')
                            )}
                        </button>
                    </form>

                    <div className="mt-8">
                        <div className="relative">
                            <div className="absolute inset-0 flex items-center">
                                <div className="w-full border-t border-gray-200" />
                            </div>
                            <div className="relative flex justify-center">
                                <span className="px-4 bg-white text-sm text-gray-500">{t('auth.or')}</span>
                            </div>
                        </div>

                        <div className="mt-6 flex gap-4">
                            <button className="flex-1 py-3 px-4 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors flex items-center justify-center gap-2 text-sm font-medium">
                                <svg className="w-5 h-5" viewBox="0 0 24 24">
                                    <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                                    <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                                    <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
                                    <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
                                </svg>
                                Google
                            </button>
                            <button className="flex-1 py-3 px-4 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors flex items-center justify-center gap-2 text-sm font-medium">
                                <svg className="w-5 h-5" viewBox="0 0 24 24" fill="#1877F2">
                                    <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
                                </svg>
                                Facebook
                            </button>
                        </div>
                    </div>

                    <p className="mt-8 text-center text-gray-600">
                        {t('auth.noAccount')}{' '}
                        <Link to="/register" className="text-gray-900 font-medium hover:underline">
                            {t('auth.signUp')}
                        </Link>
                    </p>
                </div>
            </div>
        </div>
    );
};

export default Login;
