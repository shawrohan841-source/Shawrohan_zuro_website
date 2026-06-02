import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useAuth } from '../contexts/AuthContext';
import { toast } from 'sonner';
import Header from '../components/Header';

const RegisterPage = () => {
  const navigate = useNavigate();
  const { register, user } = useAuth();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [phone, setPhone] = useState('');
  const [loading, setLoading] = useState(false);

  if (user) {
    navigate('/profile');
    return null;
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    const result = await register(name, email, password, phone);
    if (result.success) {
      toast.success('Registration successful!');
      navigate('/profile');
    } else {
      toast.error(result.error);
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-[#050505]">
      <Header />
      <div className="pt-24 pb-16">
        <div className="container mx-auto px-6">
          <div className="max-w-md mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-[#111111] border border-white/10 p-8"
            >
              <h1
                data-testid="register-page-heading"
                className="text-2xl sm:text-3xl tracking-tight uppercase font-bold text-white mb-6"
              >
                REGISTER
              </h1>
              <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                  <label htmlFor="name" className="block text-xs uppercase tracking-[0.2em] text-white font-bold mb-2">
                    NAME
                  </label>
                  <input
                    type="text"
                    id="name"
                    data-testid="register-name-input"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    required
                    className="w-full bg-[#1A1A1A] border border-white/10 rounded-none px-4 py-3 text-white placeholder-gray-600 focus:border-white focus:outline-none"
                    placeholder="Your name"
                  />
                </div>
                <div>
                  <label htmlFor="email" className="block text-xs uppercase tracking-[0.2em] text-white font-bold mb-2">
                    EMAIL
                  </label>
                  <input
                    type="email"
                    id="email"
                    data-testid="register-email-input"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    className="w-full bg-[#1A1A1A] border border-white/10 rounded-none px-4 py-3 text-white placeholder-gray-600 focus:border-white focus:outline-none"
                    placeholder="your@email.com"
                  />
                </div>
                <div>
                  <label htmlFor="phone" className="block text-xs uppercase tracking-[0.2em] text-white font-bold mb-2">
                    PHONE (OPTIONAL)
                  </label>
                  <input
                    type="tel"
                    id="phone"
                    data-testid="register-phone-input"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="w-full bg-[#1A1A1A] border border-white/10 rounded-none px-4 py-3 text-white placeholder-gray-600 focus:border-white focus:outline-none"
                    placeholder="+91 XXXXX XXXXX"
                  />
                </div>
                <div>
                  <label htmlFor="password" className="block text-xs uppercase tracking-[0.2em] text-white font-bold mb-2">
                    PASSWORD
                  </label>
                  <input
                    type="password"
                    id="password"
                    data-testid="register-password-input"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    className="w-full bg-[#1A1A1A] border border-white/10 rounded-none px-4 py-3 text-white placeholder-gray-600 focus:border-white focus:outline-none"
                    placeholder="••••••••"
                  />
                </div>
                <button
                  type="submit"
                  data-testid="register-submit-button"
                  disabled={loading}
                  className="w-full bg-white text-black rounded-none hover:bg-gray-200 transition-colors uppercase tracking-widest font-bold text-sm px-8 py-4 disabled:opacity-50"
                >
                  {loading ? 'CREATING ACCOUNT...' : 'CREATE ACCOUNT'}
                </button>
              </form>
              <div className="mt-6 text-center">
                <p className="text-sm text-[#A1A1AA]">
                  Already have an account?{' '}
                  <Link to="/login" data-testid="register-login-link" className="text-white hover:text-[#E60000] transition-colors">
                    Login here
                  </Link>
                </p>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RegisterPage;
