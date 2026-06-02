import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import Header from '../components/Header';
import Footer from '../components/Footer';
import { useAuth } from '../contexts/AuthContext';
import { Package } from 'lucide-react';

const API = `${process.env.REACT_APP_BACKEND_URL}/api`;

const ProfilePage = () => {
  const { user } = useAuth();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      const { data } = await axios.get(`${API}/orders`, { withCredentials: true });
      setOrders(data);
    } catch (error) {
      console.error('Failed to fetch orders:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#050505]">
      <Header />
      <div className="pt-24 pb-16">
        <div className="container mx-auto px-6">
          <h1 className="text-2xl sm:text-3xl lg:text-4xl tracking-tight uppercase font-bold text-white mb-8">MY PROFILE</h1>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="bg-[#111111] border border-white/10 p-6">
              <h2 className="text-xl uppercase font-bold text-white mb-4">PROFILE INFO</h2>
              <div className="space-y-3 text-sm">
                <div><span className="text-[#A1A1AA]">Name:</span> <span className="text-white">{user?.name}</span></div>
                <div><span className="text-[#A1A1AA]">Email:</span> <span className="text-white">{user?.email}</span></div>
                <div><span className="text-[#A1A1AA]">Phone:</span> <span className="text-white">{user?.phone || 'Not provided'}</span></div>
              </div>
            </div>
            <div className="lg:col-span-2">
              <h2 className="text-xl uppercase font-bold text-white mb-4">ORDER HISTORY</h2>
              {loading ? (
                <div className="text-center py-10"><div className="text-white">Loading orders...</div></div>
              ) : orders.length === 0 ? (
                <div className="bg-[#111111] border border-white/10 p-8 text-center">
                  <Package className="w-12 h-12 text-[#A1A1AA] mx-auto mb-4" />
                  <p className="text-[#A1A1AA] mb-4">No orders yet</p>
                  <Link to="/shop" className="inline-block bg-white text-black rounded-none hover:bg-gray-200 transition-colors uppercase tracking-widest font-bold text-sm px-8 py-4">START SHOPPING</Link>
                </div>
              ) : (
                <div className="space-y-4">
                  {orders.map((order, i) => (
                    <Link key={i} to={`/orders/${order.id}`} className="block bg-[#111111] border border-white/10 p-6 hover:border-white/30 transition-colors">
                      <div className="flex justify-between items-start mb-2">
                        <div>
                          <p className="text-white font-bold">Order #{order.id.slice(0, 8).toUpperCase()}</p>
                          <p className="text-sm text-[#A1A1AA]">{new Date(order.created_at).toLocaleDateString()}</p>
                        </div>
                        <span className="text-xs uppercase px-3 py-1 bg-[#E60000] text-white">{order.status}</span>
                      </div>
                      <p className="text-white font-bold">₹{order.total}</p>
                    </Link>
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

export default ProfilePage;
