import { Navigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

const AdminRoute = ({ children }) => {
  const { user, loading } = useAuth();
  const isAdminAuthenticated = localStorage.getItem('admin_authenticated') === 'true';

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#050505]">
        <div className="text-white text-xl font-heading uppercase tracking-wider">Loading...</div>
      </div>
    );
  }

  // Check if admin gate passed
  if (!isAdminAuthenticated) {
    return <Navigate to="/admin-login" replace />;
  }

  // Check if user is logged in and has admin role
  if (!user) {
    return <Navigate to="/login" replace />;
  }

  if (user.role !== 'admin') {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#050505] px-6">
        <div className="text-center">
          <h1 className="text-4xl font-bold text-white mb-4">UNAUTHORIZED ACCESS</h1>
          <p className="text-[#A1A1AA] mb-8">You do not have permission to access this area.</p>
          <a href="/" className="inline-block bg-white text-black px-8 py-4 uppercase tracking-widest font-bold text-sm hover:bg-gray-200 transition-colors">
            RETURN HOME
          </a>
        </div>
      </div>
    );
  }

  return children;
};

export default AdminRoute;