import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import axios from 'axios';
import { toast } from 'sonner';
import Header from '../components/Header';
import Footer from '../components/Footer';
import { Heart, Star, ShoppingCart, Minus, Plus, X } from 'lucide-react';
import { useCart } from '../contexts/CartContext';
import { useAuth } from '../contexts/AuthContext';
import { compressImage } from '../utils/imageCompression';

const API = `${process.env.REACT_APP_BACKEND_URL}/api`;

const ProductDetailPage = () => {
  const { id } = useParams();
  const { user } = useAuth();
  const { addToCart } = useCart();
  const [product, setProduct] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [reviewStats, setReviewStats] = useState({ total: 0, average: 0, breakdown: {} });
  const [reviewSort, setReviewSort] = useState('newest');
  const [withImagesOnly, setWithImagesOnly] = useState(false);
  const [showReviewForm, setShowReviewForm] = useState(false);
  const [reviewRating, setReviewRating] = useState(5);
  const [reviewComment, setReviewComment] = useState('');
  const [reviewImages, setReviewImages] = useState([]);
  const [submittingReview, setSubmittingReview] = useState(false);
  const [loading, setLoading] = useState(true);
  const [selectedSize, setSelectedSize] = useState('');
  const [selectedColor, setSelectedColor] = useState('');
  const [quantity, setQuantity] = useState(1);
  const [selectedImage, setSelectedImage] = useState(0);
  const [isWishlisted, setIsWishlisted] = useState(false);
  const [imageZoomed, setImageZoomed] = useState(false);

  useEffect(() => {
    fetchProduct();
  }, [id]);

  useEffect(() => {
    fetchReviews();
  }, [id, reviewSort, withImagesOnly]);

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
      const { data } = await axios.get(
        `${API}/reviews/product/${id}?sort=${reviewSort}&with_images=${withImagesOnly}`
      );
      setReviews(data.reviews || []);
      setReviewStats(data.stats || { total: 0, average: 0, breakdown: {} });
    } catch (error) {
      console.error('Failed to fetch reviews:', error);
    }
  };

  const handleReviewImageUpload = async (e) => {
    const files = Array.from(e.target.files).slice(0, 4);
    const uploaded = [];
    for (const file of files) {
      try {
        // Compress image before upload for faster performance
        const compressed = await compressImage(file, 1200, 0.85).catch(() => file);
        const formData = new FormData();
        formData.append('file', compressed);
        const { data } = await axios.post(`${API}/storage/upload`, formData, {
          headers: { 'Content-Type': 'multipart/form-data' },
          withCredentials: true,
        });
        uploaded.push(`${process.env.REACT_APP_BACKEND_URL}${data.url}`);
      } catch (error) {
        toast.error('Failed to upload image');
      }
    }
    setReviewImages([...reviewImages, ...uploaded]);
  };

  const handleSubmitReview = async (e) => {
    e.preventDefault();
    if (!user) {
      toast.error('Please login to submit a review');
      return;
    }
    setSubmittingReview(true);
    try {
      const { data } = await axios.post(
        `${API}/reviews`,
        {
          product_id: id,
          rating: reviewRating,
          comment: reviewComment,
          images: reviewImages,
        },
        { withCredentials: true }
      );
      toast.success(data.verified_purchase ? 'Review submitted (Verified Purchase)' : 'Review submitted');
      setShowReviewForm(false);
      setReviewComment('');
      setReviewRating(5);
      setReviewImages([]);
      fetchReviews();
    } catch (error) {
      toast.error(error.response?.data?.detail || 'Failed to submit review');
    } finally {
      setSubmittingReview(false);
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

  const averageRating = reviewStats.average || 0;

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
            {/* Images & Videos Gallery */}
            <div>
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="bg-[#111111] border border-white/10 mb-4 aspect-square overflow-hidden relative group"
              >
                {(() => {
                  const allMedia = [
                    ...product.images.map(url => ({ type: 'image', url })),
                    ...(product.videos || []).map(url => ({ type: 'video', url }))
                  ];
                  const currentMedia = allMedia[selectedImage] || allMedia[0];
                  if (!currentMedia) return null;
                  
                  if (currentMedia.type === 'video') {
                    return (
                      <video
                        src={currentMedia.url}
                        controls
                        autoPlay
                        loop
                        muted
                        className="w-full h-full object-cover"
                      />
                    );
                  }
                  return (
                    <div
                      className="w-full h-full cursor-zoom-in"
                      onClick={() => setImageZoomed(true)}
                    >
                      <img
                        src={currentMedia.url}
                        alt={product.name}
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                        data-testid="product-main-image"
                      />
                      <div className="absolute top-4 right-4 bg-black/60 backdrop-blur-sm px-3 py-1 text-white text-xs uppercase tracking-widest opacity-0 group-hover:opacity-100 transition-opacity">
                        Click to Zoom
                      </div>
                    </div>
                  );
                })()}
              </motion.div>
              {(() => {
                const allMedia = [
                  ...product.images.map(url => ({ type: 'image', url })),
                  ...(product.videos || []).map(url => ({ type: 'video', url }))
                ];
                if (allMedia.length <= 1) return null;
                return (
                  <div className="grid grid-cols-4 gap-4">
                    {allMedia.map((media, i) => (
                      <button
                        key={i}
                        data-testid={`product-thumbnail-${i}`}
                        onClick={() => setSelectedImage(i)}
                        className={`bg-[#111111] border ${
                          selectedImage === i ? 'border-white' : 'border-white/10'
                        } aspect-square overflow-hidden hover:border-white/50 transition-colors relative`}
                      >
                        {media.type === 'video' ? (
                          <>
                            <video src={media.url} className="w-full h-full object-cover" muted />
                            <div className="absolute inset-0 flex items-center justify-center bg-black/40">
                              <div className="w-8 h-8 bg-white/90 rounded-full flex items-center justify-center">
                                <div className="w-0 h-0 border-l-[8px] border-l-black border-y-[6px] border-y-transparent ml-1" />
                              </div>
                            </div>
                          </>
                        ) : (
                          <img src={media.url} alt={`View ${i + 1}`} className="w-full h-full object-cover" />
                        )}
                      </button>
                    ))}
                  </div>
                );
              })()}
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
                <span className="text-sm text-[#A1A1AA]">({reviewStats.total} reviews)</span>
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
            <div className="flex flex-wrap items-center justify-between gap-4 mb-8">
              <h2 className="text-2xl tracking-tight uppercase font-bold text-white">CUSTOMER REVIEWS</h2>
              {user && (
                <button
                  onClick={() => setShowReviewForm(!showReviewForm)}
                  data-testid="write-review-button"
                  className="bg-white text-black hover:bg-gray-200 transition-colors uppercase tracking-widest font-bold text-xs px-6 py-3"
                >
                  {showReviewForm ? 'CANCEL' : 'WRITE A REVIEW'}
                </button>
              )}
            </div>

            {/* Review Form */}
            {showReviewForm && user && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-[#111111] border border-white/10 p-6 mb-8"
              >
                <h3 className="text-lg uppercase font-bold text-white mb-4">SHARE YOUR EXPERIENCE</h3>
                <form onSubmit={handleSubmitReview} className="space-y-4">
                  <div>
                    <label className="block text-xs uppercase tracking-[0.2em] text-white font-bold mb-2">RATING</label>
                    <div className="flex gap-1">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <button
                          key={star}
                          type="button"
                          onClick={() => setReviewRating(star)}
                          className="transition-colors"
                        >
                          <Star
                            className={`w-8 h-8 ${
                              star <= reviewRating ? 'fill-[#E60000] text-[#E60000]' : 'text-[#A1A1AA]'
                            }`}
                          />
                        </button>
                      ))}
                    </div>
                  </div>
                  <div>
                    <label className="block text-xs uppercase tracking-[0.2em] text-white font-bold mb-2">REVIEW</label>
                    <textarea
                      value={reviewComment}
                      onChange={(e) => setReviewComment(e.target.value)}
                      required
                      rows={4}
                      className="w-full bg-[#1A1A1A] border border-white/10 rounded-none px-4 py-3 text-white placeholder-gray-600 focus:border-white focus:outline-none resize-none"
                      placeholder="Share your thoughts about the product..."
                    />
                  </div>
                  <div>
                    <label className="block text-xs uppercase tracking-[0.2em] text-white font-bold mb-2">ADD PHOTOS (OPTIONAL)</label>
                    <input
                      type="file"
                      accept="image/*"
                      multiple
                      onChange={handleReviewImageUpload}
                      className="w-full bg-[#1A1A1A] border border-white/10 rounded-none px-4 py-3 text-white focus:border-white focus:outline-none file:bg-white file:text-black file:border-0 file:px-4 file:py-1 file:mr-4 file:uppercase file:text-xs file:font-bold"
                    />
                    {reviewImages.length > 0 && (
                      <div className="flex gap-2 mt-2">
                        {reviewImages.map((img, i) => (
                          <img key={i} src={img} alt="Review" className="w-16 h-16 object-cover border border-white/10" />
                        ))}
                      </div>
                    )}
                  </div>
                  <button
                    type="submit"
                    disabled={submittingReview}
                    className="bg-white text-black hover:bg-gray-200 transition-colors uppercase tracking-widest font-bold text-sm px-8 py-3 disabled:opacity-50"
                  >
                    {submittingReview ? 'SUBMITTING...' : 'SUBMIT REVIEW'}
                  </button>
                </form>
              </motion.div>
            )}

            {/* Rating Stats */}
            {reviewStats.total > 0 && (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                <div className="bg-[#111111] border border-white/10 p-6 text-center">
                  <div className="text-5xl font-bold text-white mb-2">{averageRating.toFixed(1)}</div>
                  <div className="flex items-center justify-center gap-1 mb-2">
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        className={`w-4 h-4 ${
                          i < Math.round(averageRating) ? 'fill-[#E60000] text-[#E60000]' : 'text-[#A1A1AA]'
                        }`}
                      />
                    ))}
                  </div>
                  <p className="text-[#A1A1AA] text-sm">Based on {reviewStats.total} reviews</p>
                </div>
                <div className="md:col-span-2 bg-[#111111] border border-white/10 p-6">
                  <h3 className="text-xs uppercase tracking-[0.2em] text-white font-bold mb-4">RATING BREAKDOWN</h3>
                  {[5, 4, 3, 2, 1].map((rating) => {
                    const count = reviewStats.breakdown[rating] || 0;
                    const percent = reviewStats.total > 0 ? (count / reviewStats.total) * 100 : 0;
                    return (
                      <div key={rating} className="flex items-center gap-3 mb-2">
                        <span className="text-sm text-white w-12">{rating} ★</span>
                        <div className="flex-1 h-2 bg-white/10 overflow-hidden">
                          <div
                            className="h-full bg-[#E60000] transition-all duration-500"
                            style={{ width: `${percent}%` }}
                          />
                        </div>
                        <span className="text-xs text-[#A1A1AA] w-12 text-right">{count}</span>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Sort & Filter */}
            {reviewStats.total > 0 && (
              <div className="flex flex-wrap items-center gap-4 mb-6">
                <select
                  value={reviewSort}
                  onChange={(e) => setReviewSort(e.target.value)}
                  data-testid="review-sort"
                  className="bg-[#1A1A1A] border border-white/10 text-white px-4 py-2 text-sm rounded-none focus:border-white focus:outline-none"
                >
                  <option value="newest">Newest First</option>
                  <option value="oldest">Oldest First</option>
                  <option value="highest">Highest Rating</option>
                  <option value="lowest">Lowest Rating</option>
                </select>
                <button
                  onClick={() => setWithImagesOnly(!withImagesOnly)}
                  data-testid="filter-images-only"
                  className={`px-4 py-2 border text-sm uppercase tracking-widest transition-colors ${
                    withImagesOnly
                      ? 'border-white bg-white text-black'
                      : 'border-white/20 bg-transparent text-white hover:border-white/50'
                  }`}
                >
                  With Photos
                </button>
              </div>
            )}

            {/* Reviews List */}
            {reviews.length === 0 ? (
              <div className="bg-[#111111] border border-white/10 p-12 text-center">
                <p className="text-[#A1A1AA]">No reviews yet. Be the first to review this product!</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {reviews.map((review, i) => (
                  <div key={review.id || i} data-testid={`review-${i}`} className="bg-[#111111] border border-white/10 p-6">
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex items-start gap-3">
                        <div className="w-10 h-10 rounded-full bg-[#E60000]/20 flex items-center justify-center text-white font-bold uppercase">
                          {review.user_name?.charAt(0) || 'A'}
                        </div>
                        <div>
                          <div className="flex items-center gap-2 flex-wrap">
                            <p className="text-white font-bold">{review.user_name}</p>
                            {review.verified_purchase && (
                              <span className="bg-[#E60000] text-white text-[10px] uppercase tracking-widest px-2 py-0.5">VERIFIED</span>
                            )}
                            {review.featured && (
                              <span className="bg-[#FF6B00] text-white text-[10px] uppercase tracking-widest px-2 py-0.5">FEATURED</span>
                            )}
                          </div>
                          <p className="text-xs text-[#A1A1AA]">{review.user_city || 'India'}</p>
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
                      </div>
                      <span className="text-xs text-[#A1A1AA]">{new Date(review.created_at).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}</span>
                    </div>
                    <p className="text-[#A1A1AA] text-sm leading-relaxed mt-3">{review.comment}</p>
                    {review.images && review.images.length > 0 && (
                      <div className="flex gap-2 mt-4">
                        {review.images.map((img, j) => (
                          <img
                            key={j}
                            src={img}
                            alt="Review"
                            loading="lazy"
                            className="w-20 h-20 object-cover border border-white/10 cursor-pointer hover:border-white/30 transition-colors"
                            onClick={() => window.open(img, '_blank')}
                          />
                        ))}
                      </div>
                    )}
                    {review.admin_reply && (
                      <div className="mt-4 bg-[#E60000]/5 border-l-2 border-[#E60000] p-4">
                        <p className="text-xs uppercase tracking-[0.2em] text-[#E60000] font-bold mb-2">
                          ZURO REPLY
                        </p>
                        <p className="text-white text-sm leading-relaxed">{review.admin_reply.text}</p>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Image Zoom Modal */}
      {imageZoomed && product && (
        <div
          className="fixed inset-0 z-[100] bg-black/95 backdrop-blur-md flex items-center justify-center p-6 cursor-zoom-out"
          onClick={() => setImageZoomed(false)}
        >
          <button
            onClick={(e) => {
              e.stopPropagation();
              setImageZoomed(false);
            }}
            className="absolute top-6 right-6 w-12 h-12 bg-white/10 backdrop-blur-sm border border-white/20 text-white flex items-center justify-center hover:bg-white/20 transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
          <img
            src={product.images[selectedImage]}
            alt={product.name}
            className="max-w-full max-h-full object-contain"
            onClick={(e) => e.stopPropagation()}
          />
        </div>
      )}

      <Footer />
    </div>
  );
};

export default ProductDetailPage;
