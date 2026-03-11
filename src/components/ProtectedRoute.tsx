import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Loader2 } from 'lucide-react';

interface ProtectedRouteProps {
  children: React.ReactNode;
  requireAdmin?: boolean;
  requireCRM?: boolean;
}

export function ProtectedRoute({ children, requireAdmin, requireCRM }: ProtectedRouteProps) {
  const { user, loading, isAdmin } = useAuth();
  const location = useLocation();

  if (loading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-12 h-12 text-red-500 animate-spin mx-auto mb-4" />
          <p className="text-gray-400">Loading...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    const redirectPath = location.pathname.startsWith('/crm-private') ? '/crm-login' : '/loginprivate';
    return <Navigate to={redirectPath} state={{ from: location }} replace />;
  }

  if (requireAdmin && !isAdmin) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-center max-w-md mx-auto p-8">
          <div className="bg-yellow-500/20 border border-yellow-500 rounded-lg p-6">
            <p className="text-yellow-400 text-lg font-semibold mb-2">Admin Access Required</p>
            <p className="text-gray-400">You need admin privileges to access this page.</p>
          </div>
        </div>
      </div>
    );
  }

  if (requireCRM && user.role !== 'calls' && user.role !== 'manager' && user.role !== 'admin') {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-center max-w-md mx-auto p-8">
          <div className="bg-yellow-500/20 border border-yellow-500 rounded-lg p-6">
            <p className="text-yellow-400 text-lg font-semibold mb-2">CRM Access Required</p>
            <p className="text-gray-400">You need CRM privileges to access this page.</p>
          </div>
        </div>
      </div>
    );
  }

  return <>{children}</>;
}
