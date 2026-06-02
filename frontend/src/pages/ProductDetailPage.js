import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import axios from 'axios';
import { toast } from 'sonner';
import Header from '../components/Header';
import Footer from '../components/Footer';
import { Heart, Star, ShoppingCart, Minus, Plus } from 'lucide-react';
import { useCart } from '../contexts/CartContext';
import { useAuth } from '../contexts/AuthContext';

const API = `${process.env.REACT_APP_BACKEND_URL}/api`;

const ProductDetailPage = () => {
  const { id } = useParams();
  const { user } = useAuth();
  const { addToCart } = useCart();
  const [product, setProduct] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedSize, setSelectedSize] = useState('');
  const [selectedColor, setSelectedColor] = useState('');
  const [quantity, setQuantity] = useState(1);
  const [selectedImage, setSelectedImage] = useState(0);
  const [isWishlisted, setIsWishlisted] = useState(false);

  useEffect(() => {
    fetchProduct();
    fetchReviews();
  }, [id]);

  const fetchProduct = async () => {
    try {
      setLoading(true);
      const { data } = await axios.get(`${API}/products/${id}`);
      setProduct(data);
      setSelectedSize(data.sizes[0]);
      setSelectedColor(data.colors[0]);
    } catch (error) {
      console.error('Failed to fetch product:', error);
      toast.error('Failed to load product');
    } finally {
      setLoading(false);
    }
  };

  const fetchReviews = async () => {
    try {
      const { data } = await axios.get(`${API}/reviews/product/${id}`);
      setReviews(data);
    } catch (error) {
      console.error('Failed to fetch reviews:', error);
    }
  };

  const handleAddToCart = async () => {
    if (!user) {
      toast.error('Please login to add items to cart');
      return;
    }
    try {
      const result = await addToCart(id, quantity, selectedSize, selectedColor);
      if (result.success) {
        toast.success('Added to cart!');
      } else {
        toast.error(result.error);
      }
    } catch (error) {
      toast.error('Failed to add to cart');
    }
  };

  const handleWishlist = async () => {
    if (!user) {
      toast.error('Please login to add to wishlist');
      return;
    }
    try {
      if (isWishlisted) {
        await axios.delete(`${API}/wishlist/remove/${id}`, { withCredentials: true });
        setIsWishlisted(false);
        toast.success('Removed from wishlist');
      } else {
        await axios.post(`${API}/wishlist/add/${id}`, {}, { withCredentials: true });
        setIsWishlisted(true);
        toast.success('Added to wishlist');
      }
    } catch (error) {
      toast.error('Failed to update wishlist');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#050505] flex items-center justify-center">
        <div className="text-white text-xl font-heading uppercase tracking-wider">Loading...</div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-screen bg-[#050505] flex items-center justify-center">
        <div className="text-center">
          <p className="text-white text-xl mb-4">Product not found</p>
          <Link to="/shop" className="text-[#E60000] hover:underline">
            Back to Shop
          </Link>
        </div>
      </div>
    );
  }

  const averageRating = reviews.length > 0 ? reviews.reduce((acc, r) => acc + r.rating, 0) / reviews.length : 0;

  return (
    <div className="min-h-screen bg-[#050505]">
      <Header />

      <div className="pt-24 pb-16">
        <div className="container mx-auto px-6">
          {/* Breadcrumb */}
          <div className="mb-8">
            <div className="flex items-center gap-2 text-sm text-[#A1A1AA]">
              <Link to="/" className="hover:text-white transition-colors">
                Home
              </Link>
              <span>/</span>
              <Link to="/shop" className="hover:text-white transition-colors">
                Shop
              </Link>
              <span>/</span>
              <span className="text-white">{product.name}</span>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            {/* Images */}
            <div>
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="bg-[#111111] border border-white/10 mb-4 aspect-square overflow-hidden"
              >
                <img
                  src={product.images[selectedImage]}
                  alt={product.name}
                  className="w-full h-full object-cover"
                  data-testid="product-main-image"
                />
              </motion.div>
              {product.images.length > 1 && (
                <div className="grid grid-cols-4 gap-4">
                  {product.images.map((img, i) => (
                    <button
                      key={i}
                      data-testid={`product-thumbnail-${i}`}
                      onClick={() => setSelectedImage(i)}
                      className={`bg-[#111111] border ${
                        selectedImage === i ? 'border-white' : 'border-white/10'
                      } aspect-square overflow-hidden hover:border-white/50 transition-colors`}
                    >
                      <img src={img} alt={`View ${i + 1}`} className="w-full h-full object-cover" />
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Product Info */}
            <div>
              <div className="mb-4">
                <span className="text-xs uppercase tracking-[0.2em] text-[#A1A1AA]">{product.category}</span>
              </div>
              <h1
                data-testid="product-name"
                className="text-2xl sm:text-3xl lg:text-4xl tracking-tight uppercase font-bold text-white mb-4"
              >
                {product.name}
              </h1>

              {/* Rating */}
              <div className="flex items-center gap-2 mb-6">
                <div className="flex items-center gap-1">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      className={`w-4 h-4 ${
                        i < Math.round(averageRating) ? 'fill-[#E60000] text-[#E60000]' : 'text-[#A1A1AA]'
                      }`}
                    />
                  ))}
                </div>
                <span className="text-sm text-[#A1A1AA]">({reviews.length} reviews)</span>
              </div>

              <p data-testid="product-price" className="text-3xl font-bold text-white mb-6">
                ₹{product.price}
              </p>

              <p className="text-base leading-relaxed text-[#A1A1AA] mb-8">{product.description}</p>

              {/* Size Selection */}
              <div className="mb-6">
                <h3 className="text-xs uppercase tracking-[0.2em] text-white font-bold mb-3">SIZE</h3>
                <div className="flex gap-2">
                  {product.sizes.map((size, i) => (
                    <button
                      key={i}
                      data-testid={`size-option-${size}`}
                      onClick={() => setSelectedSize(size)}
                      className={`px-6 py-2 border ${
                        selectedSize === size
                          ? 'border-white bg-white text-black'
                          : 'border-white/20 bg-transparent text-white hover:border-white/50'
                      } transition-colors uppercase text-sm font-bold`}
                    >
                      {size}
                    </button>
                  ))}
                </div>
              </div>

              {/* Color Selection */}
              <div className="mb-6">
                <h3 className="text-xs uppercase tracking-[0.2em] text-white font-bold mb-3">COLOR</h3>
                <div className="flex gap-2">
                  {product.colors.map((color, i) => (
                    <button
                      key={i}
                      data-testid={`color-option-${color}`}
                      onClick={() => setSelectedColor(color)}
                      className={`px-6 py-2 border ${
                        selectedColor === color
                          ? 'border-white bg-white text-black'
                          : 'border-white/20 bg-transparent text-white hover:border-white/50'
                      } transition-colors uppercase text-sm font-bold`}
                    >
                      {color}
                    </button>
                  ))}
                </div>
              </div>

              {/* Quantity */}
              <div className="mb-8">
                <h3 className="text-xs uppercase tracking-[0.2em] text-white font-bold mb-3">QUANTITY</h3>
                <div className="flex items-center gap-4">
                  <button
                    data-testid="quantity-decrease-button"
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="w-10 h-10 border border-white/20 bg-transparent text-white flex items-center justify-center hover:border-white/50 transition-colors"
                  >
                    <Minus className="w-4 h-4" />
                  </button>
                  <span data-testid="quantity-display" className="text-white font-bold text-lg w-12 text-center">
                    {quantity}
                  </span>
                  <button
                    data-testid="quantity-increase-button"
                    onClick={() => setQuantity(quantity + 1)}
                    className="w-10 h-10 border border-white/20 bg-transparent text-white flex items-center justify-center hover:border-white/50 transition-colors"
                  >
                    <Plus className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* Actions */}
              <div className="flex gap-4 mb-8">
                <button
                  data-testid="add-to-cart-button"
                  onClick={handleAddToCart}
                  className="flex-1 bg-white text-black rounded-none hover:bg-gray-200 transition-colors uppercase tracking-widest font-bold text-sm px-8 py-4 flex items-center justify-center gap-2"
                >
                  <ShoppingCart className="w-4 h-4" />
                  ADD TO CART
                </button>
                <button
                  data-testid="wishlist-button"
                  onClick={handleWishlist}
                  className="w-14 h-14 border border-white/20 bg-transparent text-white flex items-center justify-center hover:border-white/50 transition-colors"
                >
                  <Heart className={`w-5 h-5 ${isWishlisted ? 'fill-[#E60000] text-[#E60000]' : ''}`} />
                </button>
              </div>

              {/* Product Details */}
              <div className="border-t border-white/10 pt-6">
                <h3 className="text-xs uppercase tracking-[0.2em] text-white font-bold mb-3">PRODUCT DETAILS</h3>
                <ul className="space-y-2 text-sm text-[#A1A1AA]">
                  <li>• 100% Premium Cotton</li>
                  <li>• DTF Premium Printing</li>
                  <li>• Oversized Fit</li>
                  <li>• Made in India</li>
                </ul>
              </div>
            </div>
          </div>

          {/* Reviews Section */}
          <div className="mt-20">
            <h2 className="text-2xl tracking-tight uppercase font-bold text-white mb-8">CUSTOMER REVIEWS</h2>
            {reviews.length === 0 ? (
              <p className="text-[#A1A1AA]">No reviews yet. Be the first to review this product!</p>
            ) : (
              <div className="space-y-6">
                {reviews.map((review, i) => (
                  <div key={i} data-testid={`review-${i}`} className="bg-[#111111] border border-white/10 p-6">
                    <div className="flex items-start justify-between mb-3">
                      <div>
                        <p className="text-white font-bold">{review.user_name}</p>
                        <div className="flex items-center gap-1 mt-1">
                          {[...Array(5)].map((_, j) => (
                            <Star
                              key={j}
                              className={`w-3 h-3 ${
                                j < review.rating ? 'fill-[#E60000] text-[#E60000]' : 'text-[#A1A1AA]'
                              }`}
                            />
                          ))}
                        </div>
                      </div>
                      <span className="text-xs text-[#A1A1AA]">{new Date(review.created_at).toLocaleDateString()}</span>
                    </div>
                    <p className="text-[#A1A1AA] text-sm">{review.comment}</p>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default ProductDetailPage;
