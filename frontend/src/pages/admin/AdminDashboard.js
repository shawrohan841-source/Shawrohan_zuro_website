import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import Header from '../../components/Header';
import { Package, ShoppingBag, Users, DollarSign, Ticket } from 'lucide-react';

const API = `${process.env.REACT_APP_BACKEND_URL}/api`;

const AdminDashboard = () => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboard();
  }, []);

  const fetchDashboard = async () => {
    try {
      const { data } = await axios.get(`${API}/admin/dashboard`, { withCredentials: true });
      setStats(data);
    } catch (error) {
      console.error('Failed to fetch dashboard:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#050505]">
      <Header />
      <div className="pt-24 pb-16">
        <div className="container mx-auto px-6">
          <h1 className="text-2xl sm:text-3xl lg:text-4xl tracking-tight uppercase font-bold text-white mb-8">ADMIN DASHBOARD</h1>
          {loading ? (
            <div className="text-white">Loading...</div>
          ) : (
            <>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                {[
                  { label: 'Total Orders', value: stats?.total_orders || 0, icon: Package },
                  { label: 'Total Revenue', value: `₹${stats?.total_revenue || 0}`, icon: DollarSign },
                  { label: 'Total Users', value: stats?.total_users || 0, icon: Users },
                  { label: 'Total Products', value: stats?.total_products || 0, icon: ShoppingBag },
                ].map((stat, i) => (
                  <div key={i} className="bg-[#111111] border border-white/10 p-6">
                    <div className="flex items-center gap-4 mb-2">
                      <stat.icon className="w-8 h-8 text-[#E60000]" />
                      <p className="text-xs uppercase tracking-[0.2em] text-[#A1A1AA]">{stat.label}</p>
                    </div>
                    <p className="text-3xl font-bold text-white">{stat.value}</p>
                  </div>
                ))}
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                <Link to="/admin/products" className="bg-[#111111] border border-white/10 p-8 hover:border-white/30 transition-all hover:-translate-y-1">
                  <ShoppingBag className="w-10 h-10 text-white mb-4" />
                  <h2 className="text-xl uppercase font-bold text-white">MANAGE PRODUCTS</h2>
                  <p className="text-[#A1A1AA] text-sm mt-2">Add, edit, or delete products</p>
                </Link>
                <Link to="/admin/orders" className="bg-[#111111] border border-white/10 p-8 hover:border-white/30 transition-all hover:-translate-y-1">
                  <Package className="w-10 h-10 text-white mb-4" />
                  <h2 className="text-xl uppercase font-bold text-white">MANAGE ORDERS</h2>
                  <p className="text-[#A1A1AA] text-sm mt-2">View and update order status</p>
                </Link>
                <Link to="/admin/coupons" className="bg-[#111111] border border-white/10 p-8 hover:border-white/30 transition-all hover:-translate-y-1">
                  <Ticket className="w-10 h-10 text-white mb-4" />
                  <h2 className="text-xl uppercase font-bold text-white">MANAGE COUPONS</h2>
                  <p className="text-[#A1A1AA] text-sm mt-2">Create and manage discount coupons</p>
                </Link>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
