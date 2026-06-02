import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { toast } from 'sonner';
import axios from 'axios';
import { Shield, Lock } from 'lucide-react';

const API = `${process.env.REACT_APP_BACKEND_URL}/api`;

const AdminLoginGate = () => {
  const navigate = useNavigate();
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const { data } = await axios.post(
        `${API}/admin/auth/validate`,
        { password },
        { withCredentials: true }
      );

      if (data.success) {
        // Store admin auth token
        localStorage.setItem('admin_authenticated', 'true');
        toast.success('Admin access granted');
        navigate('/admin');
      }
    } catch (error) {
      toast.error('Invalid admin password');
      setPassword('');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#050505] flex items-center justify-center px-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md"
      >
        <div className="bg-[#111111] border border-white/10 p-8">
          <div className="flex items-center justify-center mb-8">
            <Shield className="w-12 h-12 text-[#E60000]" />
          </div>
          
          <h1 className="text-2xl uppercase font-bold text-white text-center mb-2">
            ADMIN ACCESS
          </h1>
          <p className="text-[#A1A1AA] text-center text-sm mb-8">
            Restricted Area - Authorized Personnel Only
          </p>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label htmlFor="admin-password" className="block text-xs uppercase tracking-[0.2em] text-white font-bold mb-2">
                MASTER PASSWORD
              </label>
              <div className="relative">
                <Lock className="absolute left-4 top-1/2 transform -translate-y-1/2 w-4 h-4 text-[#A1A1AA]" />
                <input
                  type="password"
                  id="admin-password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  autoComplete="off"
                  className="w-full bg-[#1A1A1A] border border-white/10 rounded-none pl-12 pr-4 py-3 text-white placeholder-gray-600 focus:border-[#E60000] focus:outline-none"
                  placeholder="Enter admin password"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-[#E60000] text-white rounded-none hover:bg-[#CC0000] transition-colors uppercase tracking-widest font-bold text-sm px-8 py-4 disabled:opacity-50"
            >
              {loading ? 'AUTHENTICATING...' : 'ACCESS ADMIN PANEL'}
            </button>
          </form>

          <div className="mt-6 pt-6 border-t border-white/10">
            <p className="text-[#A1A1AA] text-xs text-center">
              This area is monitored. Unauthorized access attempts are logged.
            </p>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default AdminLoginGate;