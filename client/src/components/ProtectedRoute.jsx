import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const ProtectedRoute = ({ children, requiredRole }) => {
    const { user, isAuthenticated, isAdmin, isEditor } = useAuth();

    if (!isAuthenticated) {
        return <Navigate to="/login" replace />;
    }

    if (requiredRole === 'admin' && !isAdmin()) {
        return <Navigate to="/" replace />;
    }

    if (requiredRole === 'editor' && !isEditor()) {
        return <Navigate to="/" replace />;
    }

    return children;
};

export default ProtectedRoute;
