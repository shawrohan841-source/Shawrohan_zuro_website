import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import axios from 'axios';
import Header from '../components/Header';
import Footer from '../components/Footer';
import { Package, Truck, CheckCircle } from 'lucide-react';

const API = `${process.env.REACT_APP_BACKEND_URL}/api`;

const OrderTrackingPage = () => {
  const { orderId } = useParams();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchOrder();
  }, [orderId]);

  const fetchOrder = async () => {
    try {
      const { data } = await axios.get(`${API}/orders/${orderId}`, { withCredentials: true });
      setOrder(data);
    } catch (error) {
      console.error('Failed to fetch order:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <div className="min-h-screen bg-[#050505] flex items-center justify-center"><div className="text-white">Loading...</div></div>;
  if (!order) return <div className="min-h-screen bg-[#050505] flex items-center justify-center"><div className="text-white">Order not found</div></div>;

  return (
    <div className="min-h-screen bg-[#050505]">
      <Header />
      <div className="pt-24 pb-16">
        <div className="container mx-auto px-6 max-w-4xl">
          <Link to="/profile" className="text-[#A1A1AA] hover:text-white transition-colors mb-6 inline-block">&larr; Back to Profile</Link>
          <h1 className="text-2xl sm:text-3xl tracking-tight uppercase font-bold text-white mb-8">ORDER DETAILS</h1>
          <div className="bg-[#111111] border border-white/10 p-6 mb-8">
            <div className="flex justify-between items-start mb-4">
              <div>
                <p className="text-xs uppercase tracking-[0.2em] text-[#A1A1AA]">ORDER ID</p>
                <p className="text-white font-bold">{order.id}</p>
              </div>
              <span className="text-xs uppercase px-3 py-1 bg-[#E60000] text-white">{order.status}</span>
            </div>
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div><span className="text-[#A1A1AA]">Date:</span> <span className="text-white">{new Date(order.created_at).toLocaleDateString()}</span></div>
              <div><span className="text-[#A1A1AA]">Total:</span> <span className="text-white font-bold">₹{order.total}</span></div>
              <div><span className="text-[#A1A1AA]">Payment:</span> <span className="text-white">{order.payment_method.toUpperCase()}</span></div>
            </div>
          </div>
          <div className="bg-[#111111] border border-white/10 p-6">
            <h2 className="text-xl uppercase font-bold text-white mb-4">ITEMS</h2>
            <div className="space-y-4">
              {order.items.map((item, i) => (
                <div key={i} className="flex gap-4 pb-4 border-b border-white/10 last:border-0">
                  <div className="flex-1">
                    <p className="text-white font-bold">{item.product_name || 'Product'}</p>
                    <p className="text-sm text-[#A1A1AA]">Size: {item.size} | Color: {item.color} | Qty: {item.quantity}</p>
                  </div>
                  <p className="text-white font-bold">₹{item.price * item.quantity}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default OrderTrackingPage;
