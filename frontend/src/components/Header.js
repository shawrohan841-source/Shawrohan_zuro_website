import { Link } from 'react-router-dom';
import { ShoppingCart, Heart, User, Menu, X } from 'lucide-react';
import { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useCart } from '../contexts/CartContext';
import { motion, AnimatePresence } from 'framer-motion';

const Header = () => {
  const { user, logout } = useAuth();
  const { cartCount } = useCart();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [profileMenuOpen, setProfileMenuOpen] = useState(false);

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-black/60 backdrop-blur-xl backdrop-saturate-150 border-b border-white/10">
      <div className="container mx-auto px-6 py-4">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <Link to="/" data-testid="header-logo">
            <h1 className="text-2xl md:text-3xl font-black uppercase tracking-tighter text-white hover:text-[#E60000] transition-colors">
              ZURO
            </h1>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-8">
            <Link
              to="/shop"
              data-testid="nav-shop"
              className="text-xs uppercase tracking-[0.2em] text-[#A1A1AA] hover:text-white transition-colors"
            >
              Shop
            </Link>
            <Link
              to="/custom-builder"
              data-testid="nav-custom-builder"
              className="text-xs uppercase tracking-[0.2em] text-[#A1A1AA] hover:text-white transition-colors"
            >
              Custom Builder
            </Link>
            <Link
              to="/shop?category=Oversized T-Shirts"
              data-testid="nav-tshirts"
              className="text-xs uppercase tracking-[0.2em] text-[#A1A1AA] hover:text-white transition-colors"
            >
              T-Shirts
            </Link>
            <Link
              to="/shop?category=Hoodies"
              data-testid="nav-hoodies"
              className="text-xs uppercase tracking-[0.2em] text-[#A1A1AA] hover:text-white transition-colors"
            >
              Hoodies
            </Link>
          </nav>

          {/* Actions */}
          <div className="flex items-center gap-4">
            <Link to="/cart" data-testid="header-cart-icon" className="relative">
              <ShoppingCart className="w-5 h-5 text-white hover:text-[#E60000] transition-colors" />
              {cartCount > 0 && (
                <span
                  data-testid="cart-count-badge"
                  className="absolute -top-2 -right-2 bg-[#E60000] text-white text-[10px] font-bold w-5 h-5 rounded-full flex items-center justify-center"
                >
                  {cartCount}
                </span>
              )}
            </Link>

            <button data-testid="header-wishlist-icon" className="hidden md:block">
              <Heart className="w-5 h-5 text-white hover:text-[#E60000] transition-colors" />
            </button>

            {user ? (
              <div className="relative">
                <button
                  data-testid="header-profile-menu-button"
                  onClick={() => setProfileMenuOpen(!profileMenuOpen)}
                  className="flex items-center gap-2 text-white hover:text-[#E60000] transition-colors"
                >
                  <User className="w-5 h-5" />
                  <span className="hidden md:block text-xs uppercase tracking-wider">{user.name}</span>
                </button>
                <AnimatePresence>
                  {profileMenuOpen && (
                    <motion.div
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      className="absolute right-0 top-full mt-2 w-48 bg-[#111111] border border-white/10 rounded-none"
                    >
                      <Link
                        to="/profile"
                        data-testid="profile-menu-profile"
                        className="block px-4 py-3 text-sm text-white hover:bg-white/5 transition-colors"
                      >
                        Profile
                      </Link>
                      <button
                        data-testid="profile-menu-logout"
                        onClick={logout}
                        className="block w-full text-left px-4 py-3 text-sm text-white hover:bg-white/5 transition-colors"
                      >
                        Logout
                      </button>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            ) : (
              <Link
                to="/login"
                data-testid="header-login-button"
                className="hidden md:block bg-white text-black px-6 py-2 text-xs uppercase tracking-widest font-bold hover:bg-gray-200 transition-colors"
              >
                Login
              </Link>
            )}

            {/* Mobile Menu Button */}
            <button
              data-testid="mobile-menu-button"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden text-white"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        <AnimatePresence>
          {mobileMenuOpen && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="md:hidden overflow-hidden"
            >
              <nav className="flex flex-col gap-4 pt-6 pb-4">
                <Link
                  to="/shop"
                  data-testid="mobile-nav-shop"
                  className="text-sm uppercase tracking-wider text-white hover:text-[#E60000] transition-colors"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Shop
                </Link>
                <Link
                  to="/custom-builder"
                  data-testid="mobile-nav-custom-builder"
                  className="text-sm uppercase tracking-wider text-white hover:text-[#E60000] transition-colors"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Custom Builder
                </Link>
                {!user && (
                  <Link
                    to="/login"
                    data-testid="mobile-nav-login"
                    className="text-sm uppercase tracking-wider text-white hover:text-[#E60000] transition-colors"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    Login
                  </Link>
                )}
              </nav>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </header>
  );
};

export default Header;
