import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { toast } from 'sonner';
import Header from '../components/Header';
import { useCart } from '../contexts/CartContext';
import { useAuth } from '../contexts/AuthContext';

const API = `${process.env.REACT_APP_BACKEND_URL}/api`;

const CheckoutPage = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { cart, fetchCart } = useCart();
  const [loading, setLoading] = useState(false);
  const [products, setProducts] = useState({});
  const [paymentMethod, setPaymentMethod] = useState('cod');
  const [formData, setFormData] = useState({
    name: user?.name || '',
    email: user?.email || '',
    phone: user?.phone || '',
    address: '',
    city: '',
    state: '',
    pincode: '',
  });

  useEffect(() => {
    if (!user) {
      navigate('/login');
      return;
    }
    fetchCartProducts();
  }, [cart, user]);

  const fetchCartProducts = async () => {
    try {
      const productIds = [...new Set(cart.items?.map(item => item.product_id) || [])];
      const productData = {};
      for (const id of productIds) {
        const { data } = await axios.get(`${API}/products/${id}`);
        productData[id] = data;
      }
      setProducts(productData);
    } catch (error) {
      console.error('Failed to fetch cart products:', error);
    }
  };

  const subtotal = cart.items?.reduce((acc, item) => {
    const product = products[item.product_id];
    return acc + (product?.price || 0) * item.quantity;
  }, 0) || 0;

  const shipping = subtotal > 999 ? 0 : 99;
  const total = subtotal + shipping;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const orderData = {
        items: cart.items.map(item => ({
          ...item,
          product_name: products[item.product_id]?.name,
          price: products[item.product_id]?.price,
        })),
        total,
        payment_method: paymentMethod,
        shipping_address: formData,
      };

      const { data } = await axios.post(`${API}/orders/create`, orderData, { withCredentials: true });
      toast.success('Order placed successfully!');
      navigate(`/orders/${data.order_id}`);
    } catch (error) {
      toast.error('Failed to place order');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#050505]">
      <Header />
      <div className="pt-24 pb-16">
        <div className="container mx-auto px-6">
          <h1 className="text-2xl sm:text-3xl lg:text-4xl tracking-tight uppercase font-bold text-white mb-8">
            CHECKOUT
          </h1>
          <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 space-y-6">
              <div className="bg-[#111111] border border-white/10 p-6">
                <h2 className="text-xl uppercase font-bold text-white mb-4">SHIPPING ADDRESS</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <input type="text" placeholder="Full Name" required value={formData.name} onChange={(e) => setFormData({...formData, name: e.target.value})} className="w-full bg-[#1A1A1A] border border-white/10 rounded-none px-4 py-3 text-white placeholder-gray-600 focus:border-white focus:outline-none" />
                  <input type="email" placeholder="Email" required value={formData.email} onChange={(e) => setFormData({...formData, email: e.target.value})} className="w-full bg-[#1A1A1A] border border-white/10 rounded-none px-4 py-3 text-white placeholder-gray-600 focus:border-white focus:outline-none" />
                  <input type="tel" placeholder="Phone" required value={formData.phone} onChange={(e) => setFormData({...formData, phone: e.target.value})} className="w-full bg-[#1A1A1A] border border-white/10 rounded-none px-4 py-3 text-white placeholder-gray-600 focus:border-white focus:outline-none" />
                  <input type="text" placeholder="Address" required value={formData.address} onChange={(e) => setFormData({...formData, address: e.target.value})} className="w-full bg-[#1A1A1A] border border-white/10 rounded-none px-4 py-3 text-white placeholder-gray-600 focus:border-white focus:outline-none md:col-span-2" />
                  <input type="text" placeholder="City" required value={formData.city} onChange={(e) => setFormData({...formData, city: e.target.value})} className="w-full bg-[#1A1A1A] border border-white/10 rounded-none px-4 py-3 text-white placeholder-gray-600 focus:border-white focus:outline-none" />
                  <input type="text" placeholder="State" required value={formData.state} onChange={(e) => setFormData({...formData, state: e.target.value})} className="w-full bg-[#1A1A1A] border border-white/10 rounded-none px-4 py-3 text-white placeholder-gray-600 focus:border-white focus:outline-none" />
                  <input type="text" placeholder="Pincode" required value={formData.pincode} onChange={(e) => setFormData({...formData, pincode: e.target.value})} className="w-full bg-[#1A1A1A] border border-white/10 rounded-none px-4 py-3 text-white placeholder-gray-600 focus:border-white focus:outline-none md:col-span-2" />
                </div>
              </div>
              <div className="bg-[#111111] border border-white/10 p-6">
                <h2 className="text-xl uppercase font-bold text-white mb-4">PAYMENT METHOD</h2>
                <div className="space-y-3">
                  <label className="flex items-center gap-3 cursor-pointer">
                    <input type="radio" name="payment" value="cod" checked={paymentMethod === 'cod'} onChange={(e) => setPaymentMethod(e.target.value)} className="w-4 h-4" />
                    <span className="text-white">Cash on Delivery</span>
                  </label>
                  <label className="flex items-center gap-3 cursor-pointer">
                    <input type="radio" name="payment" value="razorpay" checked={paymentMethod === 'razorpay'} onChange={(e) => setPaymentMethod(e.target.value)} className="w-4 h-4" />
                    <span className="text-white">Razorpay (UPI/Cards/Wallets)</span>
                  </label>
                </div>
              </div>
            </div>
            <div>
              <div className="bg-[#111111] border border-white/10 p-6 sticky top-24">
                <h2 className="text-xl uppercase font-bold text-white mb-6">ORDER SUMMARY</h2>
                <div className="space-y-4 mb-6">
                  <div className="flex justify-between text-sm"><span className="text-[#A1A1AA]">Subtotal</span><span className="text-white">₹{subtotal}</span></div>
                  <div className="flex justify-between text-sm"><span className="text-[#A1A1AA]">Shipping</span><span className="text-white">{shipping === 0 ? 'FREE' : `₹${shipping}`}</span></div>
                  <div className="border-t border-white/10 pt-4 flex justify-between"><span className="text-white font-bold">Total</span><span className="text-white font-bold text-xl">₹{total}</span></div>
                </div>
                <button type="submit" disabled={loading} className="w-full bg-white text-black rounded-none hover:bg-gray-200 transition-colors uppercase tracking-widest font-bold text-sm px-8 py-4 disabled:opacity-50">{loading ? 'PLACING ORDER...' : 'PLACE ORDER'}</button>
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default CheckoutPage;
