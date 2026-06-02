import { useEffect, useState } from 'react';
import axios from 'axios';
import Header from '../../components/Header';
import { Plus, Edit, Trash2, X, Upload, Image as ImageIcon, Star } from 'lucide-react';
import { toast } from 'sonner';

const API = `${process.env.REACT_APP_BACKEND_URL}/api`;
const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;

const AdminProducts = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [uploading, setUploading] = useState(false);

  const [formData, setFormData] = useState({
    name: '',
    category: 'Anime T-Shirts',
    description: '',
    price: 0,
    images: [],
    videos: [],
    sizes: ['S', 'M', 'L', 'XL', 'XXL'],
    colors: ['Black', 'White'],
    stock: 100,
    featured: false,
  });

  const categories = ['Oversized T-Shirts', 'Anime T-Shirts', 'Custom T-Shirts', 'Hoodies', 'Accessories'];

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

  const handleImageUpload = async (e) => {
    const files = Array.from(e.target.files);
    if (files.length === 0) return;

    setUploading(true);
    const uploaded = [];
    for (const file of files) {
      if (!['image/jpeg', 'image/png', 'image/webp', 'image/jpg'].includes(file.type)) {
        toast.error(`Invalid format: ${file.name}. Use JPG, PNG, or WEBP.`);
        continue;
      }
      try {
        const formDataObj = new FormData();
        formDataObj.append('file', file);
        const { data } = await axios.post(`${API}/storage/upload`, formDataObj, {
          headers: { 'Content-Type': 'multipart/form-data' },
          withCredentials: true,
        });
        uploaded.push(`${BACKEND_URL}${data.url}`);
      } catch (error) {
        toast.error(`Upload failed: ${file.name}`);
      }
    }
    setFormData({ ...formData, images: [...formData.images, ...uploaded] });
    setUploading(false);
    if (uploaded.length > 0) toast.success(`${uploaded.length} image(s) uploaded`);
  };

  const handleVideoUpload = async (e) => {
    const files = Array.from(e.target.files);
    if (files.length === 0) return;

    setUploading(true);
    const uploaded = [];
    for (const file of files) {
      if (!['video/mp4', 'video/webm'].includes(file.type)) {
        toast.error(`Invalid format: ${file.name}. Use MP4 or WEBM.`);
        continue;
      }
      try {
        const formDataObj = new FormData();
        formDataObj.append('file', file);
        const { data } = await axios.post(`${API}/storage/upload`, formDataObj, {
          headers: { 'Content-Type': 'multipart/form-data' },
          withCredentials: true,
        });
        uploaded.push(`${BACKEND_URL}${data.url}`);
      } catch (error) {
        toast.error(`Upload failed: ${file.name}`);
      }
    }
    setFormData({ ...formData, videos: [...formData.videos, ...uploaded] });
    setUploading(false);
    if (uploaded.length > 0) toast.success(`${uploaded.length} video(s) uploaded`);
  };

  const removeImage = (index) => {
    setFormData({
      ...formData,
      images: formData.images.filter((_, i) => i !== index),
    });
  };

  const removeVideo = (index) => {
    setFormData({
      ...formData,
      videos: formData.videos.filter((_, i) => i !== index),
    });
  };

  const setMainImage = (index) => {
    const newImages = [...formData.images];
    const [main] = newImages.splice(index, 1);
    newImages.unshift(main);
    setFormData({ ...formData, images: newImages });
    toast.success('Featured image updated');
  };

  const moveImage = (fromIndex, toIndex) => {
    const newImages = [...formData.images];
    const [moved] = newImages.splice(fromIndex, 1);
    newImages.splice(toIndex, 0, moved);
    setFormData({ ...formData, images: newImages });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (formData.images.length === 0) {
      toast.error('Please add at least one product image');
      return;
    }
    try {
      if (editingProduct) {
        await axios.put(`${API}/products/${editingProduct.id}`, formData, { withCredentials: true });
        toast.success('Product updated');
      } else {
        await axios.post(`${API}/products`, formData, { withCredentials: true });
        toast.success('Product created');
      }
      setShowModal(false);
      resetForm();
      fetchProducts();
    } catch (error) {
      toast.error('Failed to save product');
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

  const handleEdit = (product) => {
    setFormData({
      name: product.name,
      category: product.category,
      description: product.description,
      price: product.price,
      images: product.images || [],
      videos: product.videos || [],
      sizes: product.sizes || ['S', 'M', 'L', 'XL', 'XXL'],
      colors: product.colors || ['Black', 'White'],
      stock: product.stock,
      featured: product.featured,
    });
    setEditingProduct(product);
    setShowModal(true);
  };

  const resetForm = () => {
    setFormData({
      name: '',
      category: 'Anime T-Shirts',
      description: '',
      price: 0,
      images: [],
      videos: [],
      sizes: ['S', 'M', 'L', 'XL', 'XXL'],
      colors: ['Black', 'White'],
      stock: 100,
      featured: false,
    });
    setEditingProduct(null);
  };

  return (
    <div className="min-h-screen bg-[#050505]">
      <Header />
      <div className="pt-24 pb-16">
        <div className="container mx-auto px-6">
          <div className="flex justify-between items-center mb-8">
            <h1 className="text-2xl sm:text-3xl tracking-tight uppercase font-bold text-white">MANAGE PRODUCTS</h1>
            <button
              onClick={() => {
                resetForm();
                setShowModal(true);
              }}
              className="bg-white text-black rounded-none hover:bg-gray-200 transition-colors uppercase tracking-widest font-bold text-sm px-6 py-3 flex items-center gap-2"
            >
              <Plus className="w-4 h-4" />
              ADD PRODUCT
            </button>
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
                      <th className="text-left p-4 text-xs uppercase tracking-[0.2em] text-white">MEDIA</th>
                      <th className="text-left p-4 text-xs uppercase tracking-[0.2em] text-white">ACTIONS</th>
                    </tr>
                  </thead>
                  <tbody>
                    {products.map((product, i) => (
                      <tr key={i} className="border-b border-white/10 last:border-0">
                        <td className="p-4">
                          <img src={product.images[0]} alt={product.name} className="w-12 h-12 object-cover" />
                        </td>
                        <td className="p-4 text-white">{product.name}</td>
                        <td className="p-4 text-[#A1A1AA]">{product.category}</td>
                        <td className="p-4 text-white">₹{product.price}</td>
                        <td className="p-4 text-[#A1A1AA]">{product.stock}</td>
                        <td className="p-4 text-[#A1A1AA] text-xs">
                          {product.images?.length || 0} img / {product.videos?.length || 0} vid
                        </td>
                        <td className="p-4">
                          <div className="flex gap-2">
                            <button
                              onClick={() => handleEdit(product)}
                              className="text-white hover:text-[#E60000] transition-colors"
                            >
                              <Edit className="w-4 h-4" />
                            </button>
                            <button
                              onClick={() => handleDelete(product.id)}
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
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4 overflow-y-auto">
          <div className="bg-[#111111] border border-white/10 p-8 max-w-3xl w-full my-8 max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl uppercase font-bold text-white">
                {editingProduct ? 'EDIT PRODUCT' : 'CREATE PRODUCT'}
              </h2>
              <button
                onClick={() => {
                  setShowModal(false);
                  resetForm();
                }}
                className="text-white hover:text-[#E60000]"
              >
                <X className="w-6 h-6" />
              </button>
            </div>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs uppercase tracking-[0.2em] text-white font-bold mb-2">NAME</label>
                  <input
                    type="text"
                    required
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full bg-[#1A1A1A] border border-white/10 rounded-none px-4 py-3 text-white focus:border-white focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-xs uppercase tracking-[0.2em] text-white font-bold mb-2">CATEGORY</label>
                  <select
                    value={formData.category}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                    className="w-full bg-[#1A1A1A] border border-white/10 rounded-none px-4 py-3 text-white focus:border-white focus:outline-none"
                  >
                    {categories.map((cat) => (
                      <option key={cat} value={cat}>{cat}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-xs uppercase tracking-[0.2em] text-white font-bold mb-2">PRICE (₹)</label>
                  <input
                    type="number"
                    required
                    value={formData.price}
                    onChange={(e) => setFormData({ ...formData, price: parseFloat(e.target.value) || 0 })}
                    className="w-full bg-[#1A1A1A] border border-white/10 rounded-none px-4 py-3 text-white focus:border-white focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-xs uppercase tracking-[0.2em] text-white font-bold mb-2">STOCK</label>
                  <input
                    type="number"
                    required
                    value={formData.stock}
                    onChange={(e) => setFormData({ ...formData, stock: parseInt(e.target.value) || 0 })}
                    className="w-full bg-[#1A1A1A] border border-white/10 rounded-none px-4 py-3 text-white focus:border-white focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs uppercase tracking-[0.2em] text-white font-bold mb-2">DESCRIPTION</label>
                <textarea
                  required
                  rows={3}
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  className="w-full bg-[#1A1A1A] border border-white/10 rounded-none px-4 py-3 text-white focus:border-white focus:outline-none resize-none"
                />
              </div>

              <div>
                <label className="block text-xs uppercase tracking-[0.2em] text-white font-bold mb-2">COLORS (comma-separated)</label>
                <input
                  type="text"
                  value={formData.colors.join(', ')}
                  onChange={(e) => setFormData({ ...formData, colors: e.target.value.split(',').map(c => c.trim()).filter(Boolean) })}
                  className="w-full bg-[#1A1A1A] border border-white/10 rounded-none px-4 py-3 text-white focus:border-white focus:outline-none"
                  placeholder="Black, White, Red"
                />
              </div>

              {/* Image Upload */}
              <div>
                <label className="block text-xs uppercase tracking-[0.2em] text-white font-bold mb-2">
                  PRODUCT IMAGES (First image is featured)
                </label>
                <input
                  type="file"
                  accept="image/jpeg,image/png,image/webp,image/jpg"
                  multiple
                  onChange={handleImageUpload}
                  disabled={uploading}
                  className="w-full bg-[#1A1A1A] border border-white/10 rounded-none px-4 py-3 text-white focus:border-white focus:outline-none file:bg-white file:text-black file:border-0 file:px-4 file:py-1 file:mr-4 file:uppercase file:text-xs file:font-bold disabled:opacity-50"
                />
                {formData.images.length > 0 && (
                  <div className="grid grid-cols-4 gap-2 mt-3">
                    {formData.images.map((img, i) => (
                      <div key={i} className="relative group">
                        <img src={img} alt={`Product ${i}`} className={`w-full aspect-square object-cover border ${i === 0 ? 'border-[#E60000] border-2' : 'border-white/10'}`} />
                        {i === 0 && (
                          <span className="absolute top-1 left-1 bg-[#E60000] text-white text-[8px] uppercase tracking-widest px-1 py-0.5">FEATURED</span>
                        )}
                        <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                          {i !== 0 && (
                            <button
                              type="button"
                              onClick={() => setMainImage(i)}
                              className="bg-white text-black w-7 h-7 flex items-center justify-center hover:bg-gray-200"
                              title="Set as featured"
                            >
                              <Star className="w-4 h-4" />
                            </button>
                          )}
                          <button
                            type="button"
                            onClick={() => removeImage(i)}
                            className="bg-[#E60000] text-white w-7 h-7 flex items-center justify-center hover:bg-[#CC0000]"
                          >
                            <X className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Video Upload */}
              <div>
                <label className="block text-xs uppercase tracking-[0.2em] text-white font-bold mb-2">
                  PRODUCT VIDEOS (Optional - MP4/WEBM)
                </label>
                <input
                  type="file"
                  accept="video/mp4,video/webm"
                  multiple
                  onChange={handleVideoUpload}
                  disabled={uploading}
                  className="w-full bg-[#1A1A1A] border border-white/10 rounded-none px-4 py-3 text-white focus:border-white focus:outline-none file:bg-white file:text-black file:border-0 file:px-4 file:py-1 file:mr-4 file:uppercase file:text-xs file:font-bold disabled:opacity-50"
                />
                {formData.videos.length > 0 && (
                  <div className="grid grid-cols-3 gap-2 mt-3">
                    {formData.videos.map((vid, i) => (
                      <div key={i} className="relative group">
                        <video src={vid} className="w-full aspect-video object-cover border border-white/10" />
                        <button
                          type="button"
                          onClick={() => removeVideo(i)}
                          className="absolute top-1 right-1 bg-[#E60000] text-white w-7 h-7 flex items-center justify-center hover:bg-[#CC0000]"
                        >
                          <X className="w-4 h-4" />
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              <label className="flex items-center gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  checked={formData.featured}
                  onChange={(e) => setFormData({ ...formData, featured: e.target.checked })}
                  className="w-4 h-4"
                />
                <span className="text-white text-sm">Show on Homepage (Featured Product)</span>
              </label>

              <div className="flex gap-4 mt-6 pt-6 border-t border-white/10">
                <button
                  type="submit"
                  disabled={uploading}
                  className="flex-1 bg-white text-black rounded-none hover:bg-gray-200 transition-colors uppercase tracking-widest font-bold text-sm px-6 py-3 disabled:opacity-50"
                >
                  {uploading ? 'UPLOADING...' : editingProduct ? 'UPDATE PRODUCT' : 'CREATE PRODUCT'}
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setShowModal(false);
                    resetForm();
                  }}
                  className="flex-1 border border-white/20 bg-transparent text-white hover:bg-white/5 rounded-none transition-colors uppercase tracking-widest font-bold text-sm px-6 py-3"
                >
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

export default AdminProducts;
