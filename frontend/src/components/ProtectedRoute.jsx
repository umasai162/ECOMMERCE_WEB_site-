import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Lock } from 'lucide-react';

/**
 * Wraps a route so only logged-in users can access it.
 * Unauthenticated users are redirected to /login with a `from` state
 * so they can be sent back after signing in.
 */
export default function ProtectedRoute({ children, adminOnly = false }) {
    const { user, loading } = useAuth();
    const location = useLocation();

    // While checking auth state, show a minimal spinner
    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <div className="text-center">
                    <div
                        className="w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-3 pulse-glow"
                        style={{ background: 'rgba(99,102,241,0.15)' }}
                    >
                        <Lock className="w-5 h-5" style={{ color: '#6366f1' }} />
                    </div>
                    <p className="text-sm" style={{ color: '#64748b' }}>Checking access…</p>
                </div>
            </div>
        );
    }

    // Not logged in → redirect to login, remember where they came from
    if (!user) {
        return <Navigate to="/login" state={{ from: location }} replace />;
    }

    // Admin-only gate
    if (adminOnly && user.role !== 'admin') {
        return <Navigate to="/" replace />;
    }

    return children;
}
