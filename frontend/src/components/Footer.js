import { Link } from 'react-router-dom';
import { Instagram, Twitter, Facebook, Mail } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="bg-[#111111] border-t border-white/10 py-12 md:py-20">
      <div className="container mx-auto px-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12">
          {/* Brand */}
          <div>
            <h3 className="text-2xl font-black uppercase tracking-tighter text-white mb-4">ZURO</h3>
            <p className="text-[#A1A1AA] text-sm leading-relaxed">
              Premium anime-inspired streetwear for those who wear their attitude.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-xs uppercase tracking-[0.2em] text-white mb-4 font-bold">Quick Links</h4>
            <ul className="space-y-2">
              <li>
                <Link to="/shop" className="text-[#A1A1AA] text-sm hover:text-white transition-colors">
                  Shop All
                </Link>
              </li>
              <li>
                <Link to="/custom-builder" className="text-[#A1A1AA] text-sm hover:text-white transition-colors">
                  Custom Builder
                </Link>
              </li>
              <li>
                <Link to="/profile" className="text-[#A1A1AA] text-sm hover:text-white transition-colors">
                  My Orders
                </Link>
              </li>
            </ul>
          </div>

          {/* Support */}
          <div>
            <h4 className="text-xs uppercase tracking-[0.2em] text-white mb-4 font-bold">Support</h4>
            <ul className="space-y-2">
              <li>
                <Link to="/contact" className="text-[#A1A1AA] text-sm hover:text-white transition-colors">
                  Contact Us
                </Link>
              </li>
              <li>
                <Link to="/shipping" className="text-[#A1A1AA] text-sm hover:text-white transition-colors">
                  Shipping Policy
                </Link>
              </li>
              <li>
                <Link to="/refund" className="text-[#A1A1AA] text-sm hover:text-white transition-colors">
                  Return Policy
                </Link>
              </li>
              <li>
                <Link to="/size-guide" className="text-[#A1A1AA] text-sm hover:text-white transition-colors">
                  Size Guide
                </Link>
              </li>
              <li>
                <Link to="/faq" className="text-[#A1A1AA] text-sm hover:text-white transition-colors">
                  FAQ
                </Link>
              </li>
            </ul>
          </div>

          {/* Legal */}
          <div>
            <h4 className="text-xs uppercase tracking-[0.2em] text-white mb-4 font-bold">Legal</h4>
            <ul className="space-y-2">
              <li>
                <Link to="/about" className="text-[#A1A1AA] text-sm hover:text-white transition-colors">
                  About Us
                </Link>
              </li>
              <li>
                <Link to="/terms" className="text-[#A1A1AA] text-sm hover:text-white transition-colors">
                  Terms & Conditions
                </Link>
              </li>
              <li>
                <Link to="/privacy" className="text-[#A1A1AA] text-sm hover:text-white transition-colors">
                  Privacy Policy
                </Link>
              </li>
            </ul>
          </div>

          {/* Newsletter */}
          <div>
            <h4 className="text-xs uppercase tracking-[0.2em] text-white mb-4 font-bold">Stay Connected</h4>
            <div className="flex gap-4 mb-4">
              <Instagram className="w-5 h-5 text-[#A1A1AA] hover:text-white transition-colors cursor-pointer" />
              <Twitter className="w-5 h-5 text-[#A1A1AA] hover:text-white transition-colors cursor-pointer" />
              <Facebook className="w-5 h-5 text-[#A1A1AA] hover:text-white transition-colors cursor-pointer" />
              <Mail className="w-5 h-5 text-[#A1A1AA] hover:text-white transition-colors cursor-pointer" />
            </div>
            <p className="text-[#A1A1AA] text-xs">Subscribe to get special offers and updates.</p>
          </div>
        </div>

        <div className="border-t border-white/10 mt-12 pt-8 text-center">
          <p className="text-[#A1A1AA] text-xs">
            © 2026 ZURO. All rights reserved. Premium Anime Streetwear.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
