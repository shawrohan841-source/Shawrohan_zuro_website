import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import axios from 'axios';
import { toast } from 'sonner';
import Header from '../components/Header';
import Footer from '../components/Footer';
import { Trash2, Plus, Minus } from 'lucide-react';
import { useCart } from '../contexts/CartContext';
import { useAuth } from '../contexts/AuthContext';

const API = `${process.env.REACT_APP_BACKEND_URL}/api`;

const CartPage = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { cart, removeFromCart, fetchCart } = useCart();
  const [products, setProducts] = useState({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) {
      navigate('/login');
      return;
    }
    fetchCartProducts();
  }, [cart, user]);

  const fetchCartProducts = async () => {
    try {
      setLoading(true);
      const productIds = [...new Set(cart.items?.map(item => item.product_id) || [])];
      const productData = {};
      for (const id of productIds) {
        const { data } = await axios.get(`${API}/products/${id}`);
        productData[id] = data;
      }
      setProducts(productData);
    } catch (error) {
      console.error('Failed to fetch cart products:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleRemove = async (productId, size, color) => {
    await removeFromCart(productId, size, color);
    toast.success('Item removed from cart');
  };

  const subtotal = cart.items?.reduce((acc, item) => {
    const product = products[item.product_id];
    return acc + (product?.price || 0) * item.quantity;
  }, 0) || 0;

  const shipping = subtotal > 999 ? 0 : 99;
  const total = subtotal + shipping;

  if (!user) {
    return null;
  }

  return (
    <div className="min-h-screen bg-[#050505]">
      <Header />

      <div className="pt-24 pb-16">
        <div className="container mx-auto px-6">
          <h1
            data-testid="cart-page-heading"
            className="text-2xl sm:text-3xl lg:text-4xl tracking-tight uppercase font-bold text-white mb-8"
          >
            SHOPPING CART
          </h1>

          {loading ? (
            <div className="text-center py-20">
              <div className="text-white text-xl font-heading uppercase tracking-wider">Loading...</div>
            </div>
          ) : cart.items?.length === 0 ? (
            <div className="text-center py-20">
              <p className="text-[#A1A1AA] text-lg mb-6">Your cart is empty</p>
              <Link
                to="/shop"
                data-testid="cart-empty-shop-button"
                className="inline-block bg-white text-black rounded-none hover:bg-gray-200 transition-colors uppercase tracking-widest font-bold text-sm px-8 py-4"
              >
                START SHOPPING
              </Link>
            </div>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* Cart Items */}
              <div className="lg:col-span-2">
                <div className="space-y-4">
                  {cart.items.map((item, i) => {
                    const product = products[item.product_id];
                    if (!product) return null;
                    return (
                      <motion.div
                        key={`${item.product_id}-${item.size}-${item.color}`}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: i * 0.05 }}
                        data-testid={`cart-item-${i}`}
                        className="bg-[#111111] border border-white/10 p-6 flex gap-6"
                      >
                        <img
                          src={product.images[0]}
                          alt={product.name}
                          className="w-24 h-24 object-cover border border-white/10"
                        />
                        <div className="flex-1">
                          <h3 className="text-white font-bold mb-1">{product.name}</h3>
                          <p className="text-sm text-[#A1A1AA] mb-2">
                            Size: {item.size} | Color: {item.color}
                          </p>
                          <p className="text-white font-bold">₹{product.price}</p>
                          <div className="flex items-center gap-4 mt-3">
                            <span className="text-sm text-[#A1A1AA]">Qty: {item.quantity}</span>
                          </div>
                        </div>
                        <button
                          data-testid={`cart-remove-button-${i}`}
                          onClick={() => handleRemove(item.product_id, item.size, item.color)}
                          className="text-[#A1A1AA] hover:text-white transition-colors"
                        >
                          <Trash2 className="w-5 h-5" />
                        </button>
                      </motion.div>
                    );
                  })}
                </div>
              </div>

              {/* Order Summary */}
              <div>
                <div className="bg-[#111111] border border-white/10 p-6 sticky top-24">
                  <h2 className="text-xl uppercase font-bold text-white mb-6">ORDER SUMMARY</h2>
                  <div className="space-y-4 mb-6">
                    <div className="flex justify-between text-sm">
                      <span className="text-[#A1A1AA]">Subtotal</span>
                      <span data-testid="cart-subtotal" className="text-white">₹{subtotal}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-[#A1A1AA]">Shipping</span>
                      <span data-testid="cart-shipping" className="text-white">{shipping === 0 ? 'FREE' : `₹${shipping}`}</span>
                    </div>
                    {shipping > 0 && (
                      <p className="text-xs text-[#A1A1AA]">Add ₹{1000 - subtotal} more for free shipping</p>
                    )}
                    <div className="border-t border-white/10 pt-4 flex justify-between">
                      <span className="text-white font-bold">Total</span>
                      <span data-testid="cart-total" className="text-white font-bold text-xl">₹{total}</span>
                    </div>
                  </div>
                  <Link
                    to="/checkout"
                    data-testid="proceed-to-checkout-button"
                    className="block w-full bg-white text-black rounded-none hover:bg-gray-200 transition-colors uppercase tracking-widest font-bold text-sm px-8 py-4 text-center"
                  >
                    PROCEED TO CHECKOUT
                  </Link>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default CartPage;
