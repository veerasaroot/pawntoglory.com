import { Routes, Route } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { useAuth } from './context/AuthContext';

// Layouts
import MainLayout from './layouts/MainLayout';
import AdminLayout from './layouts/AdminLayout';

// Public Pages
import Home from './pages/Home';
import ArticleList from './pages/ArticleList';
import ArticleSingle from './pages/ArticleSingle';
import Contact from './pages/Contact';

// Auth Pages
import Login from './pages/auth/Login';
import Register from './pages/auth/Register';
import ForgotPassword from './pages/auth/ForgotPassword';

// Admin Pages
import Dashboard from './pages/admin/Dashboard';
import AdminArticles from './pages/admin/Articles';
import ArticleEditor from './pages/admin/ArticleEditor';
import AdminCategories from './pages/admin/Categories';
import AdminUsers from './pages/admin/Users';
import AdminSettings from './pages/admin/Settings';

// Components
import ProtectedRoute from './components/ProtectedRoute';
import LoadingScreen from './components/ui/LoadingScreen';

function App() {
    const { loading } = useAuth();

    if (loading) {
        return <LoadingScreen />;
    }

    return (
        <>
            <Toaster
                position="top-right"
                toastOptions={{
                    style: {
                        background: '#171717',
                        color: '#fff',
                        borderRadius: '8px',
                    },
                }}
            />
            <Routes>
                {/* Public Routes */}
                <Route element={<MainLayout />}>
                    <Route path="/" element={<Home />} />
                    <Route path="/news" element={<ArticleList />} />
                    <Route path="/news/:slug" element={<ArticleSingle />} />
                    <Route path="/category/:slug" element={<ArticleList />} />
                    <Route path="/contact" element={<Contact />} />
                </Route>

                {/* Auth Routes */}
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Register />} />
                <Route path="/forgot-password" element={<ForgotPassword />} />

                {/* Admin Routes */}
                <Route
                    path="/admin"
                    element={
                        <ProtectedRoute requiredRole="editor">
                            <AdminLayout />
                        </ProtectedRoute>
                    }
                >
                    <Route index element={<Dashboard />} />
                    <Route path="articles" element={<AdminArticles />} />
                    <Route path="articles/new" element={<ArticleEditor />} />
                    <Route path="articles/edit/:id" element={<ArticleEditor />} />
                    <Route path="categories" element={<AdminCategories />} />
                    <Route path="users" element={<AdminUsers />} />
                    <Route path="settings" element={<AdminSettings />} />
                </Route>
            </Routes>
        </>
    );
}

export default App;
