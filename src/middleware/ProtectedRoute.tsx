import { Navigate, Outlet } from 'react-router-dom';

/**
 * AuthGuard - For routes that REQUIRE authentication.
 * If not logged in, redirects to /signin.
 * If allowedRoles is provided, checks if user has permission.
 */
export const AuthGuard = ({ allowedRoles }: { allowedRoles?: string[] }) => {
    const token = sessionStorage.getItem('access_token');
    const role = sessionStorage.getItem('role');

    if (!token) {
        return <Navigate to="/signin" replace />;
    }

    if (allowedRoles && !allowedRoles.includes(role || '')) {
        // Cross-role protection: If they go to wrong dashboard, send them to their own
        if (role === 'admin') return <Navigate to="/admin" replace />;
        if (role === 'staff') return <Navigate to="/dashboard" replace />;
        return <Navigate to="/" replace />;
    }

    return <Outlet />;
};

/**
 * GuestGuard - For routes that require the user NOT be authenticated (SignIn/Register).
 * If already logged in, redirects to their respective dashboard.
 */
export const GuestGuard = () => {
    const token = sessionStorage.getItem('access_token');
    const role = sessionStorage.getItem('role');

    if (token) {
        if (role === 'admin') return <Navigate to="/admin" replace />;
        if (role === 'staff') return <Navigate to="/dashboard" replace />;
        return <Navigate to="/" replace />;
    }

    return <Outlet />;
};
