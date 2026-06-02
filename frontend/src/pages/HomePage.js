import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import Marquee from 'react-fast-marquee';
import axios from 'axios';
import Header from '../components/Header';
import Footer from '../components/Footer';
import TestimonialsSection from '../components/TestimonialsSection';
import { ArrowRight, Truck, RefreshCw, Shield, Sparkles } from 'lucide-react';

const API = `${process.env.REACT_APP_BACKEND_URL}/api`;

const HomePage = () => {
  const [featuredProducts, setFeaturedProducts] = useState([]);

  useEffect(() => {
    const fetchFeatured = async () => {
      try {
        const { data } = await axios.get(`${API}/products?featured=true&limit=4`);
        setFeaturedProducts(data);
      } catch (error) {
        console.error('Failed to fetch featured products:', error);
      }
    };
    fetchFeatured();
  }, []);

  return (
    <div className="min-h-screen bg-[#050505]">
      <Header />

      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden pt-20">
        <div
          className="absolute inset-0 z-0"
          style={{
            backgroundImage: 'url(https://images.unsplash.com/photo-1578768079052-aa76e52ff62e?crop=entropy&cs=srgb&fm=jpg&ixid=M3w3NTY2OTV8MHwxfHNlYXJjaHwxfHxzdHJlZXR3ZWFyJTIwaG9vZGllJTIwbW9kZWwlMjBkYXJrfGVufDB8fHx8MTc4MDM5MDA0MHww&ixlib=rb-4.1.0&q=85)',
            backgroundSize: 'cover',
            backgroundPosition: 'center',
          }}
        >
          <div className="absolute inset-0 bg-gradient-to-t from-[#050505] via-[#050505]/50 to-transparent" />
        </div>

        <div className="relative z-10 container mx-auto px-6 text-center md:text-left">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="max-w-4xl"
          >
            <h1
              data-testid="hero-heading"
              className="text-4xl sm:text-5xl lg:text-7xl tracking-tighter uppercase font-black text-white mb-6 leading-tight"
            >
              WEAR YOUR
              <br />
              <span className="text-[#E60000]">ATTITUDE</span>
            </h1>
            <p className="text-base sm:text-lg text-[#A1A1AA] leading-relaxed mb-8 max-w-2xl">
              Premium GTF Premium Oversized T-shirt's for those who dare to be different. Anime-inspired streetwear that speaks volumes.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <Link
                to="/shop"
                data-testid="hero-shop-now-button"
                className="bg-white text-black rounded-none hover:bg-gray-200 transition-colors uppercase tracking-widest font-bold text-sm px-8 py-4 inline-flex items-center justify-center gap-2"
              >
                SHOP NOW
                <ArrowRight className="w-4 h-4" />
              </Link>
              <Link
                to="/custom-builder"
                data-testid="hero-customize-tover-button"
                className="border border-white/20 bg-transparent text-white hover:bg-white/5 rounded-none transition-colors uppercase tracking-widest font-bold text-sm px-8 py-4 inline-flex items-center justify-center gap-2"
              >
                CUSTOMIZE TOVER
                <Sparkles className="w-4 h-4" />
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Marquee */}
      <section className="py-12 border-y border-white/10 overflow-hidden">
        <Marquee gradient={false} speed={50}>
          <div className="marquee-text px-12">PREMIUM ANIME STREETWEAR</div>
          <div className="marquee-text px-12">PREMIUM ANIME STREETWEAR</div>
        </Marquee>
      </section>

      {/* Features */}
      <section className="py-16 md:py-24 bg-[#111111]">
        <div className="container mx-auto px-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            {[
              { icon: Truck, title: 'FREE SHIPPING', desc: 'On orders above ₹999' },
              { icon: RefreshCw, title: 'EASY RETURNS', desc: 'Within 7 days' },
              { icon: Shield, title: '100% SECURE', desc: 'Safe & encrypted' },
              { icon: Sparkles, title: 'PREMIUM QUALITY', desc: 'DTF printing' },
            ].map((feature, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1 }}
                className="text-center"
              >
                <feature.icon className="w-8 h-8 text-white mx-auto mb-4" />
                <h3 className="text-xs uppercase tracking-[0.2em] text-white font-bold mb-2">{feature.title}</h3>
                <p className="text-sm text-[#A1A1AA]">{feature.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Trending Collections */}
      <section className="py-16 md:py-24">
        <div className="container mx-auto px-6">
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            className="mb-12"
          >
            <h2 className="text-2xl sm:text-3xl lg:text-4xl tracking-tight uppercase font-bold text-white mb-2">
              TRENDING COLLECTIONS
            </h2>
            <p className="text-base text-[#A1A1AA]">Limited edition drops that sell out fast</p>
          </motion.div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 md:gap-12">
            {featuredProducts.map((product, i) => (
              <motion.div
                key={product.id}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1 }}
                data-testid={`featured-product-${i}`}
              >
                <Link to={`/product/${product.id}`} className="group block">
                  <div className="relative bg-[#111111] border border-white/10 overflow-hidden mb-4 aspect-[3/4] hover:-translate-y-1 hover:border-white/30 hover:shadow-[0_0_15px_rgba(255,255,255,0.05)] transition-all duration-300">
                    <img
                      src={product.images[0]}
                      alt={product.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    <div className="absolute top-4 left-4 z-10 flex flex-col gap-2">
                      {product.featured && (
                        <div className="bg-[#E60000] text-white text-[10px] uppercase tracking-widest px-2 py-1">
                          FEATURED
                        </div>
                      )}
                      {product.badge && (
                        <div className={`text-white text-[10px] uppercase tracking-widest px-2 py-1 ${
                          product.badge === 'TRENDING' ? 'bg-[#FF6B00]' :
                          product.badge === 'BEST SELLER' ? 'bg-[#00A651]' :
                          'bg-[#FF0000] animate-pulse'
                        }`}>
                          {product.badge}
                        </div>
                      )}
                    </div>
                    {product.stock && product.stock < 20 && (
                      <div className="absolute bottom-4 left-4 right-4 bg-black/80 backdrop-blur-sm text-white text-[10px] uppercase tracking-widest px-2 py-1 text-center">
                        Only {product.stock} left!
                      </div>
                    )}
                  </div>
                  <h3 className="text-sm uppercase font-bold text-white mb-1 group-hover:text-[#E60000] transition-colors">
                    {product.name}
                  </h3>
                  <p className="text-lg font-bold text-white">₹{product.price}</p>
                </Link>
              </motion.div>
            ))}
          </div>

          <div className="text-center mt-12">
            <Link
              to="/shop"
              data-testid="view-all-products-button"
              className="inline-block bg-white text-black rounded-none hover:bg-gray-200 transition-colors uppercase tracking-widest font-bold text-sm px-8 py-4"
            >
              VIEW ALL
            </Link>
          </div>
        </div>
      </section>

      {/* Why ZURO Section */}
      <section className="py-16 md:py-24 bg-[#111111]">
        <div className="container mx-auto px-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-2xl sm:text-3xl lg:text-4xl tracking-tight uppercase font-bold text-white mb-6">
                WHY ZURO?
              </h2>
              <p className="text-base leading-relaxed text-[#A1A1AA] mb-6">
                We don't just make T-shirts, stories and your personality. Each design is crafted with premium DTF printing, ensuring vibrant colors and long-lasting quality.
              </p>
              <ul className="space-y-4">
                {['Premium DTF Printing', '100% Cotton Fabric', 'Unique Anime Designs', 'Oversized Fit'].map((item, i) => (
                  <li key={i} className="flex items-center gap-3">
                    <div className="w-2 h-2 bg-[#E60000]" />
                    <span className="text-white text-sm">{item}</span>
                  </li>
                ))}
              </ul>
              <Link
                to="/custom-builder"
                data-testid="discover-more-button"
                className="inline-block mt-8 border border-white/20 bg-transparent text-white hover:bg-white/5 rounded-none transition-colors uppercase tracking-widest font-bold text-sm px-8 py-4"
              >
                DISCOVER MORE
              </Link>
            </div>
            <div className="relative">
              <img
                src="https://images.pexels.com/photos/28504904/pexels-photo-28504904.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=650&w=940"
                alt="ZURO Brand"
                className="w-full h-auto border border-white/10"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <TestimonialsSection />

      {/* WhatsApp Float Button */}
      <a
        href="https://wa.me/919876543210"
        target="_blank"
        rel="noopener noreferrer"
        data-testid="whatsapp-float-button"
        className="fixed bottom-8 right-8 z-50 bg-[#25D366] text-white w-14 h-14 rounded-full flex items-center justify-center shadow-lg hover:bg-[#20BA5A] transition-colors"
      >
        <svg className="w-7 h-7" fill="currentColor" viewBox="0 0 24 24">
          <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z" />
        </svg>
      </a>

      <Footer />
    </div>
  );
};

export default HomePage;
