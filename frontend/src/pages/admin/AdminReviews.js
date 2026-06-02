import { useEffect, useState } from 'react';
import axios from 'axios';
import Header from '../../components/Header';
import { Check, X, Star, EyeOff, Trash2, Award, MessageSquare } from 'lucide-react';
import { toast } from 'sonner';

const API = `${process.env.REACT_APP_BACKEND_URL}/api`;

const AdminReviews = () => {
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');
  const [replyingTo, setReplyingTo] = useState(null);
  const [replyText, setReplyText] = useState('');

  useEffect(() => {
    fetchReviews();
  }, []);

  const fetchReviews = async () => {
    try {
      const { data } = await axios.get(`${API}/admin/reviews`, { withCredentials: true });
      setReviews(data);
    } catch (error) {
      console.error('Failed to fetch reviews:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleModerate = async (reviewId, action) => {
    try {
      await axios.put(`${API}/admin/reviews/${reviewId}/moderate?action=${action}`, {}, { withCredentials: true });
      toast.success(action === 'feature' ? 'Review featured! Email sent to customer.' : `Review ${action}d successfully`);
      fetchReviews();
    } catch (error) {
      toast.error('Failed to moderate review');
    }
  };

  const handleDelete = async (reviewId) => {
    if (!window.confirm('Delete this review permanently?')) return;
    try {
      await axios.delete(`${API}/reviews/${reviewId}`, { withCredentials: true });
      toast.success('Review deleted');
      fetchReviews();
    } catch (error) {
      toast.error('Failed to delete review');
    }
  };

  const handleReplySubmit = async (reviewId) => {
    if (!replyText.trim()) {
      toast.error('Please enter a reply');
      return;
    }
    try {
      await axios.post(
        `${API}/admin/reviews/${reviewId}/reply`,
        { reply: replyText },
        { withCredentials: true }
      );
      toast.success('Reply added');
      setReplyingTo(null);
      setReplyText('');
      fetchReviews();
    } catch (error) {
      toast.error('Failed to add reply');
    }
  };

  const handleDeleteReply = async (reviewId) => {
    if (!window.confirm('Delete this reply?')) return;
    try {
      await axios.delete(`${API}/admin/reviews/${reviewId}/reply`, { withCredentials: true });
      toast.success('Reply deleted');
      fetchReviews();
    } catch (error) {
      toast.error('Failed to delete reply');
    }
  };

  const filteredReviews = reviews.filter((r) => {
    if (filter === 'pending') return r.approved === false;
    if (filter === 'approved') return r.approved !== false;
    if (filter === 'featured') return r.featured;
    if (filter === 'with_images') return r.images && r.images.length > 0;
    return true;
  });

  return (
    <div className="min-h-screen bg-[#050505]">
      <Header />
      <div className="pt-24 pb-16">
        <div className="container mx-auto px-6">
          <h1 className="text-2xl sm:text-3xl tracking-tight uppercase font-bold text-white mb-8">MANAGE REVIEWS</h1>

          {/* Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
            <div className="bg-[#111111] border border-white/10 p-4">
              <p className="text-xs uppercase tracking-[0.2em] text-[#A1A1AA] mb-1">TOTAL</p>
              <p className="text-2xl font-bold text-white">{reviews.length}</p>
            </div>
            <div className="bg-[#111111] border border-white/10 p-4">
              <p className="text-xs uppercase tracking-[0.2em] text-[#A1A1AA] mb-1">APPROVED</p>
              <p className="text-2xl font-bold text-[#00A651]">{reviews.filter(r => r.approved !== false).length}</p>
            </div>
            <div className="bg-[#111111] border border-white/10 p-4">
              <p className="text-xs uppercase tracking-[0.2em] text-[#A1A1AA] mb-1">REJECTED</p>
              <p className="text-2xl font-bold text-[#E60000]">{reviews.filter(r => r.approved === false).length}</p>
            </div>
            <div className="bg-[#111111] border border-white/10 p-4">
              <p className="text-xs uppercase tracking-[0.2em] text-[#A1A1AA] mb-1">FEATURED</p>
              <p className="text-2xl font-bold text-[#FF6B00]">{reviews.filter(r => r.featured).length}</p>
            </div>
          </div>

          {/* Filters */}
          <div className="flex flex-wrap gap-2 mb-6">
            {['all', 'approved', 'pending', 'featured', 'with_images'].map((f) => (
              <button
                key={f}
                onClick={() => setFilter(f)}
                className={`px-4 py-2 border text-xs uppercase tracking-widest transition-colors ${
                  filter === f
                    ? 'border-white bg-white text-black'
                    : 'border-white/20 bg-transparent text-white hover:border-white/50'
                }`}
              >
                {f.replace('_', ' ')}
              </button>
            ))}
          </div>

          {loading ? (
            <div className="text-white">Loading...</div>
          ) : filteredReviews.length === 0 ? (
            <div className="bg-[#111111] border border-white/10 p-12 text-center">
              <p className="text-[#A1A1AA]">No reviews to moderate</p>
            </div>
          ) : (
            <div className="space-y-4">
              {filteredReviews.map((review, i) => (
                <div key={i} className="bg-[#111111] border border-white/10 p-6">
                  <div className="flex flex-wrap items-start justify-between gap-4 mb-4">
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
                          {review.approved === false && (
                            <span className="bg-[#A1A1AA] text-black text-[10px] uppercase tracking-widest px-2 py-0.5">REJECTED</span>
                          )}
                        </div>
                        <p className="text-xs text-[#A1A1AA]">{review.user_city || 'India'} • {new Date(review.created_at).toLocaleDateString('en-IN')}</p>
                        <div className="flex items-center gap-1 mt-1">
                          {[...Array(5)].map((_, j) => (
                            <Star
                              key={j}
                              className={`w-3 h-3 ${j < review.rating ? 'fill-[#E60000] text-[#E60000]' : 'text-[#A1A1AA]'}`}
                            />
                          ))}
                        </div>
                      </div>
                    </div>
                    <div className="flex gap-2 flex-wrap">
                      {review.approved !== false ? (
                        <button
                          onClick={() => handleModerate(review.id, 'reject')}
                          className="bg-transparent border border-[#E60000]/50 text-[#E60000] hover:bg-[#E60000]/10 px-3 py-2 text-xs uppercase tracking-widest flex items-center gap-2"
                          title="Reject"
                        >
                          <EyeOff className="w-4 h-4" />
                          Reject
                        </button>
                      ) : (
                        <button
                          onClick={() => handleModerate(review.id, 'approve')}
                          className="bg-transparent border border-[#00A651]/50 text-[#00A651] hover:bg-[#00A651]/10 px-3 py-2 text-xs uppercase tracking-widest flex items-center gap-2"
                          title="Approve"
                        >
                          <Check className="w-4 h-4" />
                          Approve
                        </button>
                      )}
                      {review.featured ? (
                        <button
                          onClick={() => handleModerate(review.id, 'unfeature')}
                          className="bg-transparent border border-white/20 text-white hover:bg-white/5 px-3 py-2 text-xs uppercase tracking-widest flex items-center gap-2"
                          title="Unfeature"
                        >
                          <Award className="w-4 h-4" />
                          Unfeature
                        </button>
                      ) : (
                        <button
                          onClick={() => handleModerate(review.id, 'feature')}
                          className="bg-transparent border border-[#FF6B00]/50 text-[#FF6B00] hover:bg-[#FF6B00]/10 px-3 py-2 text-xs uppercase tracking-widest flex items-center gap-2"
                          title="Feature"
                        >
                          <Award className="w-4 h-4" />
                          Feature
                        </button>
                      )}
                      <button
                        onClick={() => handleDelete(review.id)}
                        className="bg-transparent border border-[#E60000]/50 text-[#E60000] hover:bg-[#E60000]/10 px-3 py-2 text-xs uppercase tracking-widest flex items-center gap-2"
                        title="Delete"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                  <p className="text-[#A1A1AA] text-sm leading-relaxed">{review.comment}</p>
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

                  {/* Admin Reply Section */}
                  {review.admin_reply ? (
                    <div className="mt-4 bg-[#E60000]/5 border-l-2 border-[#E60000] p-4">
                      <div className="flex justify-between items-start mb-1">
                        <p className="text-xs uppercase tracking-[0.2em] text-[#E60000] font-bold">
                          ZURO REPLY · {review.admin_reply.admin_name}
                        </p>
                        <button
                          onClick={() => handleDeleteReply(review.id)}
                          className="text-[#A1A1AA] hover:text-[#E60000] transition-colors"
                          title="Delete reply"
                        >
                          <Trash2 className="w-3 h-3" />
                        </button>
                      </div>
                      <p className="text-white text-sm">{review.admin_reply.text}</p>
                      <p className="text-xs text-[#A1A1AA] mt-2">
                        {new Date(review.admin_reply.created_at).toLocaleDateString('en-IN')}
                      </p>
                    </div>
                  ) : replyingTo === review.id ? (
                    <div className="mt-4 bg-[#1A1A1A] border border-white/10 p-4">
                      <textarea
                        value={replyText}
                        onChange={(e) => setReplyText(e.target.value)}
                        placeholder="Write your reply..."
                        rows={3}
                        className="w-full bg-[#050505] border border-white/10 rounded-none px-3 py-2 text-white text-sm focus:border-white focus:outline-none resize-none"
                      />
                      <div className="flex gap-2 mt-3">
                        <button
                          onClick={() => handleReplySubmit(review.id)}
                          className="bg-white text-black hover:bg-gray-200 transition-colors uppercase tracking-widest font-bold text-xs px-4 py-2"
                        >
                          SEND REPLY
                        </button>
                        <button
                          onClick={() => {
                            setReplyingTo(null);
                            setReplyText('');
                          }}
                          className="border border-white/20 bg-transparent text-white hover:bg-white/5 transition-colors uppercase tracking-widest font-bold text-xs px-4 py-2"
                        >
                          CANCEL
                        </button>
                      </div>
                    </div>
                  ) : (
                    <button
                      onClick={() => {
                        setReplyingTo(review.id);
                        setReplyText('');
                      }}
                      className="mt-4 text-[#A1A1AA] hover:text-white transition-colors text-xs uppercase tracking-widest flex items-center gap-2"
                    >
                      <MessageSquare className="w-3 h-3" />
                      Reply to Customer
                    </button>
                  )}

                  <p className="text-xs text-[#A1A1AA] mt-3">Product ID: {review.product_id}</p>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminReviews;
