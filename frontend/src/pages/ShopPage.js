import { useEffect, useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import axios from 'axios';
import Header from '../components/Header';
import Footer from '../components/Footer';
import { SlidersHorizontal, X } from 'lucide-react';

const API = `${process.env.REACT_APP_BACKEND_URL}/api`;

const ShopPage = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filterOpen, setFilterOpen] = useState(false);

  const selectedCategory = searchParams.get('category');

  useEffect(() => {
    fetchCategories();
  }, []);

  useEffect(() => {
    fetchProducts();
  }, [selectedCategory]);

  const fetchCategories = async () => {
    try {
      const { data } = await axios.get(`${API}/categories`);
      setCategories(data);
    } catch (error) {
      console.error('Failed to fetch categories:', error);
    }
  };

  const fetchProducts = async () => {
    try {
      setLoading(true);
      const params = {};
      if (selectedCategory) params.category = selectedCategory;
      const { data } = await axios.get(`${API}/products`, { params });
      setProducts(data);
    } catch (error) {
      console.error('Failed to fetch products:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleCategoryChange = (category) => {
    if (category === selectedCategory) {
      searchParams.delete('category');
    } else {
      searchParams.set('category', category);
    }
    setSearchParams(searchParams);
    setFilterOpen(false);
  };

  return (
    <div className="min-h-screen bg-[#050505]">
      <Header />

      <div className="pt-24 pb-16">
        <div className="container mx-auto px-6">
          {/* Header */}
          <div className="flex items-center justify-between mb-8">
            <div>
              <h1
                data-testid="shop-page-heading"
                className="text-2xl sm:text-3xl lg:text-4xl tracking-tight uppercase font-bold text-white mb-2"
              >
                SHOP ALL
              </h1>
              <p className="text-base text-[#A1A1AA]">
                {selectedCategory || 'All Products'} ({products.length} items)
              </p>
            </div>
            <button
              data-testid="filter-toggle-button"
              onClick={() => setFilterOpen(!filterOpen)}
              className="lg:hidden border border-white/20 bg-transparent text-white px-4 py-2 flex items-center gap-2 hover:bg-white/5 transition-colors"
            >
              <SlidersHorizontal className="w-4 h-4" />
              Filters
            </button>
          </div>

          <div className="flex gap-8">
            {/* Sidebar Filters - Desktop */}
            <aside className="hidden lg:block w-64 flex-shrink-0">
              <div className="bg-[#111111] border border-white/10 p-6">
                <h3 className="text-xs uppercase tracking-[0.2em] text-white font-bold mb-4">CATEGORIES</h3>
                <ul className="space-y-2">
                  <li>
                    <button
                      data-testid="category-filter-all"
                      onClick={() => handleCategoryChange(null)}
                      className={`text-sm w-full text-left transition-colors ${
                        !selectedCategory ? 'text-white font-bold' : 'text-[#A1A1AA] hover:text-white'
                      }`}
                    >
                      All Products
                    </button>
                  </li>
                  {categories.map((category, i) => (
                    <li key={i}>
                      <button
                        data-testid={`category-filter-${i}`}
                        onClick={() => handleCategoryChange(category)}
                        className={`text-sm w-full text-left transition-colors ${
                          selectedCategory === category ? 'text-white font-bold' : 'text-[#A1A1AA] hover:text-white'
                        }`}
                      >
                        {category}
                      </button>
                    </li>
                  ))}
                </ul>
              </div>
            </aside>

            {/* Mobile Filters */}
            {filterOpen && (
              <div className="lg:hidden fixed inset-0 z-50 bg-black/80 backdrop-blur-sm" onClick={() => setFilterOpen(false)}>
                <motion.div
                  initial={{ x: -300 }}
                  animate={{ x: 0 }}
                  exit={{ x: -300 }}
                  onClick={(e) => e.stopPropagation()}
                  className="w-80 h-full bg-[#111111] border-r border-white/10 p-6"
                >
                  <div className="flex items-center justify-between mb-6">
                    <h3 className="text-xs uppercase tracking-[0.2em] text-white font-bold">FILTERS</h3>
                    <button onClick={() => setFilterOpen(false)}>
                      <X className="w-5 h-5 text-white" />
                    </button>
                  </div>
                  <h4 className="text-xs uppercase tracking-[0.2em] text-white font-bold mb-4">CATEGORIES</h4>
                  <ul className="space-y-2">
                    <li>
                      <button
                        onClick={() => handleCategoryChange(null)}
                        className={`text-sm w-full text-left transition-colors ${
                          !selectedCategory ? 'text-white font-bold' : 'text-[#A1A1AA] hover:text-white'
                        }`}
                      >
                        All Products
                      </button>
                    </li>
                    {categories.map((category, i) => (
                      <li key={i}>
                        <button
                          onClick={() => handleCategoryChange(category)}
                          className={`text-sm w-full text-left transition-colors ${
                            selectedCategory === category ? 'text-white font-bold' : 'text-[#A1A1AA] hover:text-white'
                          }`}
                        >
                          {category}
                        </button>
                      </li>
                    ))}
                  </ul>
                </motion.div>
              </div>
            )}

            {/* Products Grid */}
            <div className="flex-1">
              {loading ? (
                <div className="text-center py-20">
                  <div className="text-white text-xl font-heading uppercase tracking-wider">Loading...</div>
                </div>
              ) : products.length === 0 ? (
                <div className="text-center py-20">
                  <p className="text-[#A1A1AA] text-lg">No products found</p>
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
                  {products.map((product, i) => (
                    <motion.div
                      key={product.id}
                      initial={{ opacity: 0, y: 30 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: i * 0.05 }}
                      data-testid={`product-card-${i}`}
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
                        <p className="text-sm text-[#A1A1AA] mb-2">{product.category}</p>
                        <p className="text-lg font-bold text-white">₹{product.price}</p>
                      </Link>
                    </motion.div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default ShopPage;
