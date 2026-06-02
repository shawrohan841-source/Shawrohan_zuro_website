import { useEffect, useState } from 'react';
import axios from 'axios';
import Header from '../../components/Header';
import { toast } from 'sonner';

const API = `${process.env.REACT_APP_BACKEND_URL}/api`;

const AdminOrders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      const { data } = await axios.get(`${API}/admin/orders`, { withCredentials: true });
      setOrders(data);
    } catch (error) {
      console.error('Failed to fetch orders:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleStatusUpdate = async (orderId, newStatus) => {
    try {
      await axios.put(`${API}/admin/orders/${orderId}/status?status=${newStatus}`, {}, { withCredentials: true });
      toast.success('Order status updated');
      fetchOrders();
    } catch (error) {
      toast.error('Failed to update order');
    }
  };

  return (
    <div className="min-h-screen bg-[#050505]">
      <Header />
      <div className="pt-24 pb-16">
        <div className="container mx-auto px-6">
          <h1 className="text-2xl sm:text-3xl tracking-tight uppercase font-bold text-white mb-8">MANAGE ORDERS</h1>
          {loading ? (
            <div className="text-white">Loading...</div>
          ) : (
            <div className="bg-[#111111] border border-white/10">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="border-b border-white/10">
                    <tr>
                      <th className="text-left p-4 text-xs uppercase tracking-[0.2em] text-white">ORDER ID</th>
                      <th className="text-left p-4 text-xs uppercase tracking-[0.2em] text-white">DATE</th>
                      <th className="text-left p-4 text-xs uppercase tracking-[0.2em] text-white">TOTAL</th>
                      <th className="text-left p-4 text-xs uppercase tracking-[0.2em] text-white">PAYMENT</th>
                      <th className="text-left p-4 text-xs uppercase tracking-[0.2em] text-white">STATUS</th>
                      <th className="text-left p-4 text-xs uppercase tracking-[0.2em] text-white">ACTIONS</th>
                    </tr>
                  </thead>
                  <tbody>
                    {orders.map((order, i) => (
                      <tr key={i} className="border-b border-white/10 last:border-0">
                        <td className="p-4 text-white">{order.id.slice(0, 8).toUpperCase()}</td>
                        <td className="p-4 text-[#A1A1AA]">{new Date(order.created_at).toLocaleDateString()}</td>
                        <td className="p-4 text-white">₹{order.total}</td>
                        <td className="p-4 text-[#A1A1AA]">{order.payment_method.toUpperCase()}</td>
                        <td className="p-4">
                          <select value={order.status} onChange={(e) => handleStatusUpdate(order.id, e.target.value)} className="bg-[#1A1A1A] border border-white/10 text-white px-3 py-1 text-sm rounded-none focus:border-white focus:outline-none">
                            <option value="pending">Pending</option>
                            <option value="processing">Processing</option>
                            <option value="shipped">Shipped</option>
                            <option value="delivered">Delivered</option>
                            <option value="cancelled">Cancelled</option>
                          </select>
                        </td>
                        <td className="p-4 text-white">View</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminOrders;
