import { useEffect, useState } from 'react';
import axios from 'axios';
import Header from '../../components/Header';
import { Plus, Edit, Trash2 } from 'lucide-react';
import { toast } from 'sonner';

const API = `${process.env.REACT_APP_BACKEND_URL}/api`;

const AdminProducts = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      const { data } = await axios.get(`${API}/products`, { withCredentials: true });
      setProducts(data);
    } catch (error) {
      console.error('Failed to fetch products:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure?')) return;
    try {
      await axios.delete(`${API}/products/${id}`, { withCredentials: true });
      toast.success('Product deleted');
      fetchProducts();
    } catch (error) {
      toast.error('Failed to delete product');
    }
  };

  return (
    <div className="min-h-screen bg-[#050505]">
      <Header />
      <div className="pt-24 pb-16">
        <div className="container mx-auto px-6">
          <div className="flex justify-between items-center mb-8">
            <h1 className="text-2xl sm:text-3xl tracking-tight uppercase font-bold text-white">MANAGE PRODUCTS</h1>
            <button className="bg-white text-black rounded-none hover:bg-gray-200 transition-colors uppercase tracking-widest font-bold text-sm px-6 py-3 flex items-center gap-2"><Plus className="w-4 h-4" />ADD PRODUCT</button>
          </div>
          {loading ? (
            <div className="text-white">Loading...</div>
          ) : (
            <div className="bg-[#111111] border border-white/10">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="border-b border-white/10">
                    <tr>
                      <th className="text-left p-4 text-xs uppercase tracking-[0.2em] text-white">IMAGE</th>
                      <th className="text-left p-4 text-xs uppercase tracking-[0.2em] text-white">NAME</th>
                      <th className="text-left p-4 text-xs uppercase tracking-[0.2em] text-white">CATEGORY</th>
                      <th className="text-left p-4 text-xs uppercase tracking-[0.2em] text-white">PRICE</th>
                      <th className="text-left p-4 text-xs uppercase tracking-[0.2em] text-white">STOCK</th>
                      <th className="text-left p-4 text-xs uppercase tracking-[0.2em] text-white">ACTIONS</th>
                    </tr>
                  </thead>
                  <tbody>
                    {products.map((product, i) => (
                      <tr key={i} className="border-b border-white/10 last:border-0">
                        <td className="p-4"><img src={product.images[0]} className="w-12 h-12 object-cover" /></td>
                        <td className="p-4 text-white">{product.name}</td>
                        <td className="p-4 text-[#A1A1AA]">{product.category}</td>
                        <td className="p-4 text-white">₹{product.price}</td>
                        <td className="p-4 text-[#A1A1AA]">{product.stock}</td>
                        <td className="p-4">
                          <div className="flex gap-2">
                            <button className="text-white hover:text-[#E60000] transition-colors"><Edit className="w-4 h-4" /></button>
                            <button onClick={() => handleDelete(product.id)} className="text-white hover:text-[#E60000] transition-colors"><Trash2 className="w-4 h-4" /></button>
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
    </div>
  );
};

export default AdminProducts;
