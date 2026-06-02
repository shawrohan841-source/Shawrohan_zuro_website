import { useEffect, useState } from 'react';
import axios from 'axios';
import Header from '../../components/Header';
import { Plus, Edit, Trash2, Check, X } from 'lucide-react';
import { toast } from 'sonner';

const API = `${process.env.REACT_APP_BACKEND_URL}/api`;

const AdminCoupons = () => {
  const [coupons, setCoupons] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState({
    code: '',
    discount_percent: 0,
    discount_amount: 0,
    expiry_date: '',
    active: true,
  });
  const [editingId, setEditingId] = useState(null);

  useEffect(() => {
    fetchCoupons();
  }, []);

  const fetchCoupons = async () => {
    try {
      const { data } = await axios.get(`${API}/admin/coupons`, { withCredentials: true });
      setCoupons(data);
    } catch (error) {
      console.error('Failed to fetch coupons:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingId) {
        await axios.put(`${API}/admin/coupons/${editingId}`, formData, { withCredentials: true });
        toast.success('Coupon updated');
      } else {
        await axios.post(`${API}/admin/coupons`, formData, { withCredentials: true });
        toast.success('Coupon created');
      }
      setShowModal(false);
      resetForm();
      fetchCoupons();
    } catch (error) {
      toast.error('Failed to save coupon');
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure?')) return;
    try {
      await axios.delete(`${API}/admin/coupons/${id}`, { withCredentials: true });
      toast.success('Coupon deleted');
      fetchCoupons();
    } catch (error) {
      toast.error('Failed to delete coupon');
    }
  };

  const handleEdit = (coupon) => {
    setFormData({
      code: coupon.code,
      discount_percent: coupon.discount_percent || 0,
      discount_amount: coupon.discount_amount || 0,
      expiry_date: coupon.expiry_date.split('T')[0],
      active: coupon.active,
    });
    setEditingId(coupon.id);
    setShowModal(true);
  };

  const resetForm = () => {
    setFormData({
      code: '',
      discount_percent: 0,
      discount_amount: 0,
      expiry_date: '',
      active: true,
    });
    setEditingId(null);
  };

  const toggleActive = async (id, currentStatus) => {
    try {
      await axios.put(`${API}/admin/coupons/${id}`, { active: !currentStatus }, { withCredentials: true });
      toast.success('Status updated');
      fetchCoupons();
    } catch (error) {
      toast.error('Failed to update status');
    }
  };

  return (
    <div className="min-h-screen bg-[#050505]">
      <Header />
      <div className="pt-24 pb-16">
        <div className="container mx-auto px-6">
          <div className="flex justify-between items-center mb-8">
            <h1 className="text-2xl sm:text-3xl tracking-tight uppercase font-bold text-white">MANAGE COUPONS</h1>
            <button
              onClick={() => {
                resetForm();
                setShowModal(true);
              }}
              className="bg-white text-black rounded-none hover:bg-gray-200 transition-colors uppercase tracking-widest font-bold text-sm px-6 py-3 flex items-center gap-2"
            >
              <Plus className="w-4 h-4" />
              ADD COUPON
            </button>
          </div>

          {loading ? (
            <div className="text-white">Loading...</div>
          ) : coupons.length === 0 ? (
            <div className="bg-[#111111] border border-white/10 p-12 text-center">
              <p className="text-[#A1A1AA] mb-4">No coupons yet</p>
              <button
                onClick={() => setShowModal(true)}
                className="inline-block bg-white text-black rounded-none hover:bg-gray-200 transition-colors uppercase tracking-widest font-bold text-sm px-8 py-4"
              >
                CREATE FIRST COUPON
              </button>
            </div>
          ) : (
            <div className="bg-[#111111] border border-white/10">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="border-b border-white/10">
                    <tr>
                      <th className="text-left p-4 text-xs uppercase tracking-[0.2em] text-white">CODE</th>
                      <th className="text-left p-4 text-xs uppercase tracking-[0.2em] text-white">DISCOUNT</th>
                      <th className="text-left p-4 text-xs uppercase tracking-[0.2em] text-white">EXPIRY</th>
                      <th className="text-left p-4 text-xs uppercase tracking-[0.2em] text-white">USED</th>
                      <th className="text-left p-4 text-xs uppercase tracking-[0.2em] text-white">STATUS</th>
                      <th className="text-left p-4 text-xs uppercase tracking-[0.2em] text-white">ACTIONS</th>
                    </tr>
                  </thead>
                  <tbody>
                    {coupons.map((coupon, i) => (
                      <tr key={i} className="border-b border-white/10 last:border-0">
                        <td className="p-4 text-white font-bold">{coupon.code}</td>
                        <td className="p-4 text-[#A1A1AA]">
                          {coupon.discount_percent > 0 ? `${coupon.discount_percent}%` : `₹${coupon.discount_amount}`}
                        </td>
                        <td className="p-4 text-[#A1A1AA]">{new Date(coupon.expiry_date).toLocaleDateString()}</td>
                        <td className="p-4 text-[#A1A1AA]">{coupon.used_count || 0}</td>
                        <td className="p-4">
                          <button
                            onClick={() => toggleActive(coupon.id, coupon.active)}
                            className={`px-3 py-1 text-xs uppercase tracking-widest ${
                              coupon.active ? 'bg-[#00A651] text-white' : 'bg-[#A1A1AA] text-black'
                            }`}
                          >
                            {coupon.active ? 'ACTIVE' : 'INACTIVE'}
                          </button>
                        </td>
                        <td className="p-4">
                          <div className="flex gap-2">
                            <button
                              onClick={() => handleEdit(coupon)}
                              className="text-white hover:text-[#E60000] transition-colors"
                            >
                              <Edit className="w-4 h-4" />
                            </button>
                            <button
                              onClick={() => handleDelete(coupon.id)}
                              className="text-white hover:text-[#E60000] transition-colors"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
          <div className="bg-[#111111] border border-white/10 p-8 max-w-md w-full">
            <h2 className="text-xl uppercase font-bold text-white mb-6">
              {editingId ? 'EDIT COUPON' : 'CREATE COUPON'}
            </h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-xs uppercase tracking-[0.2em] text-white font-bold mb-2">CODE</label>
                <input
                  type="text"
                  required
                  value={formData.code}
                  onChange={(e) => setFormData({ ...formData, code: e.target.value.toUpperCase() })}
                  className="w-full bg-[#1A1A1A] border border-white/10 rounded-none px-4 py-3 text-white placeholder-gray-600 focus:border-white focus:outline-none"
                  placeholder="SUMMER2024"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs uppercase tracking-[0.2em] text-white font-bold mb-2">
                    PERCENT OFF
                  </label>
                  <input
                    type="number"
                    min="0"
                    max="100"
                    value={formData.discount_percent}
                    onChange={(e) => setFormData({ ...formData, discount_percent: parseInt(e.target.value) || 0 })}
                    className="w-full bg-[#1A1A1A] border border-white/10 rounded-none px-4 py-3 text-white focus:border-white focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-xs uppercase tracking-[0.2em] text-white font-bold mb-2">
                    OR AMOUNT
                  </label>
                  <input
                    type="number"
                    min="0"
                    value={formData.discount_amount}
                    onChange={(e) => setFormData({ ...formData, discount_amount: parseInt(e.target.value) || 0 })}
                    className="w-full bg-[#1A1A1A] border border-white/10 rounded-none px-4 py-3 text-white focus:border-white focus:outline-none"
                  />
                </div>
              </div>
              <div>
                <label className="block text-xs uppercase tracking-[0.2em] text-white font-bold mb-2">EXPIRY DATE</label>
                <input
                  type="date"
                  required
                  value={formData.expiry_date}
                  onChange={(e) => setFormData({ ...formData, expiry_date: e.target.value })}
                  className="w-full bg-[#1A1A1A] border border-white/10 rounded-none px-4 py-3 text-white focus:border-white focus:outline-none"
                />
              </div>
              <div className="flex gap-4 mt-6">
                <button
                  type="submit"
                  className="flex-1 bg-white text-black rounded-none hover:bg-gray-200 transition-colors uppercase tracking-widest font-bold text-sm px-6 py-3 flex items-center justify-center gap-2"
                >
                  <Check className="w-4 h-4" />
                  SAVE
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setShowModal(false);
                    resetForm();
                  }}
                  className="flex-1 border border-white/20 bg-transparent text-white hover:bg-white/5 rounded-none transition-colors uppercase tracking-widest font-bold text-sm px-6 py-3 flex items-center justify-center gap-2"
                >
                  <X className="w-4 h-4" />
                  CANCEL
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminCoupons;
