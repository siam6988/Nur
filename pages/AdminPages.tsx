import React, { useState, useEffect } from 'react';
import { useStore } from '../context/StoreContext';
import { BlogPost } from '../types';
import { db } from '../firebase-config';
import { collection, getDocs, addDoc, updateDoc, deleteDoc, doc, query, orderBy } from 'firebase/firestore';
import { Edit, Trash2, Plus, X, Save, Sparkles } from 'lucide-react';

export const BlogAdmin: React.FC = () => {
  const { user, showToast } = useStore();
  const [blogs, setBlogs] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingBlog, setEditingBlog] = useState<BlogPost | null>(null);

  const [formData, setFormData] = useState({
    title: '',
    category: '',
    image: '',
    excerpt: '',
    content: '',
    isActive: true
  });

  const fetchBlogs = async () => {
    setLoading(true);
    try {
      const q = query(collection(db, 'blogs'), orderBy('createdAt', 'desc'));
      const querySnapshot = await getDocs(q);
      const fetchedBlogs: BlogPost[] = [];
      querySnapshot.forEach((doc) => {
        fetchedBlogs.push({ id: doc.id, ...doc.data() } as BlogPost);
      });
      setBlogs(fetchedBlogs);
    } catch (error) {
      console.error("Error fetching blogs:", error);
      showToast("Error fetching blogs", "error");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (user?.role === 'admin') {
      fetchBlogs();
    }
  }, [user]);

  // Temporary function to seed sample blogs
  const seedSampleBlogs = async () => {
    if (blogs.length > 0) return;
    
    const sampleBlogs = [
      {
        title: "Classy Clothing 101: How to Look Elegant Everyday",
        category: "Style",
        date: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
        image: "https://images.unsplash.com/photo-1490481651871-ab68de25d43d?q=80&w=2070&auto=format&fit=crop",
        excerpt: "Discover the timeless rules of classy dressing and learn how to elevate your everyday wardrobe with simple but effective fashion choices.",
        content: "Classy clothing is more about fit and fabric than brand names. To look elegant everyday: \n\n1. Stick to neutral colors like black, white, navy, and beige.\n2. Ensure your clothes fit perfectly. A tailored look instantly elevates an outfit.\n3. Invest in timeless pieces like a well-fitted blazer, a classic white shirt, and quality leather accessories.\n\nWhen buying premium clothing from NUR, you ensure long-lasting quality that speaks for itself. True elegance is understated.",
        createdAt: new Date().toISOString(),
        isActive: true
      },
      {
        title: "Must-Have Winter Clothing for 2024",
        category: "Seasonal",
        date: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
        image: "https://images.unsplash.com/photo-1549439602-43ebca2327af?q=80&w=2070&auto=format&fit=crop",
        excerpt: "Stay warm without sacrificing style. Here are the top winter fashion trends you need in your closet this season.",
        content: "Winter clothing is all about layering. This season, oversized wool coats and chunky knit sweaters are making a huge comeback.\n\nKey winter essentials:\n- **Turtlenecks:** Perfect for layering under dresses or blazers.\n- **Cashmere Sweaters:** Not only do they keep you warm, but they also look incredibly luxurious.\n- **Trench Coats:** A classic outerwear piece that never goes out of style.\n\nCheck out our latest winter collection at NUR to stay stylish in the cold.",
        createdAt: new Date().toISOString(),
        isActive: true
      },
      {
        title: "Summer Clothing: Stay Cool and Stylish",
        category: "Seasonal",
        date: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
        image: "https://images.unsplash.com/photo-1523381210434-271e8be1f52b?q=80&w=2070&auto=format&fit=crop",
        excerpt: "Beat the heat with our ultimate guide to breathable fabrics and vibrant summer styles.",
        content: "When the temperature rises, breathability is key. Summer clothing should emphasize comfort while letting your personal style shine.\n\n- **Linen everything:** Linen shirts and trousers are life-savers in high humidity.\n- **Floral Patterns:** Summer is the perfect time to experiment with bright, cheerful prints.\n- **Maxi Dresses:** Flowy and comfortable, perfect for both day-outs and evening dinners.\n\nFind your perfect summer fit from NUR's exclusive seasonal drop.",
        createdAt: new Date().toISOString(),
        isActive: true
      }
    ];

    try {
      for (const blog of sampleBlogs) {
        await addDoc(collection(db, 'blogs'), blog);
      }
      showToast("Sample blogs generated successfully!", "success");
      fetchBlogs();
    } catch (error) {
      showToast("Failed to generate sample blogs", "error");
    }
  };

  const handleOpenModal = (blog: BlogPost | null = null) => {
    if (blog) {
      setEditingBlog(blog);
      setFormData({
        title: blog.title,
        category: blog.category,
        image: blog.image,
        excerpt: blog.excerpt,
        content: blog.content,
        isActive: blog.isActive !== false
      });
    } else {
      setEditingBlog(null);
      setFormData({
        title: '',
        category: '',
        image: '',
        excerpt: '',
        content: '',
        isActive: true
      });
    }
    setIsModalOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.title || !formData.content) {
      showToast("Title and Content are required", "error");
      return;
    }

    try {
      const blogData = {
        ...formData,
        date: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
      };

      if (editingBlog) {
        await updateDoc(doc(db, 'blogs', editingBlog.id), {
          ...blogData,
        });
        showToast("Blog updated successfully", "success");
      } else {
        await addDoc(collection(db, 'blogs'), {
          ...blogData,
          createdAt: new Date().toISOString()
        });
        showToast("Blog created successfully", "success");
      }
      setIsModalOpen(false);
      fetchBlogs();
    } catch (error) {
      console.error(error);
      showToast("Error saving blog", "error");
    }
  };

  const handleDelete = async (id: string) => {
    if (window.confirm("Are you sure you want to delete this blog?")) {
      try {
        await deleteDoc(doc(db, 'blogs', id));
        showToast("Blog deleted successfully", "success");
        fetchBlogs();
      } catch (error) {
        showToast("Error deleting blog", "error");
      }
    }
  };

  if (user?.role !== 'admin') {
    return (
      <div className="container mx-auto px-4 py-20 text-center">
        <h1 className="text-3xl font-bold text-red-500 mb-4">Access Denied</h1>
        <p className="text-gray-600 dark:text-gray-400">You must be an admin to access this page.</p>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-10">
      <div className="flex justify-between items-center mb-8 border-b pb-4 dark:border-darkBorder">
        <h1 className="text-2xl font-bold dark:text-white">Blogs Management</h1>
        <div className="flex gap-4">
          <button 
            onClick={seedSampleBlogs} 
            className="flex items-center gap-2 bg-gray-100 hover:bg-gray-200 dark:bg-darkBorder dark:hover:bg-gray-700 text-gray-800 dark:text-white px-4 py-2 rounded-lg transition"
          >
            <Sparkles size={18} /> Seed Standard Blogs
          </button>
          <button 
            onClick={() => handleOpenModal()} 
            className="flex items-center gap-2 bg-primary hover:bg-blue-800 text-white px-4 py-2 rounded-lg transition"
          >
            <Plus size={18} /> Create New Blog
          </button>
        </div>
      </div>

      {loading ? (
        <div className="text-center py-20 text-gray-500">Loading blogs...</div>
      ) : blogs.length === 0 ? (
        <div className="text-center py-20 bg-gray-50 dark:bg-darkCard rounded-xl border dark:border-darkBorder">
          <p className="text-gray-500 mb-4">No blogs found.</p>
          <button onClick={seedSampleBlogs} className="text-primary hover:underline font-medium">Auto-generate sample blogs for AdSense approval</button>
        </div>
      ) : (
        <div className="overflow-x-auto bg-white dark:bg-darkCard rounded-xl shadow-sm border border-gray-100 dark:border-darkBorder">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-50 dark:bg-darkBg border-b dark:border-darkBorder">
                <th className="p-4 font-bold text-gray-600 dark:text-gray-300">Title</th>
                <th className="p-4 font-bold text-gray-600 dark:text-gray-300">Category</th>
                <th className="p-4 font-bold text-gray-600 dark:text-gray-300">Date</th>
                <th className="p-4 font-bold text-gray-600 dark:text-gray-300">Status</th>
                <th className="p-4 font-bold text-gray-600 dark:text-gray-300 text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {blogs.map(blog => (
                <tr key={blog.id} className="border-b dark:border-darkBorder last:border-0 hover:bg-gray-50 dark:hover:bg-darkBg/50 transition">
                  <td className="p-4 font-medium dark:text-white">
                    <div className="flex items-center gap-3">
                      {blog.image && <img src={blog.image} alt={blog.title} className="w-10 h-10 object-cover rounded-md" />}
                      <span className="truncate max-w-[200px] block">{blog.title}</span>
                    </div>
                  </td>
                  <td className="p-4 text-gray-600 dark:text-gray-400">{blog.category}</td>
                  <td className="p-4 text-gray-600 dark:text-gray-400">{blog.date}</td>
                  <td className="p-4">
                    <span className={`px-2 py-1 text-xs font-bold rounded-full ${blog.isActive !== false ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                      {blog.isActive !== false ? 'Published' : 'Draft'}
                    </span>
                  </td>
                  <td className="p-4 text-right">
                    <div className="flex justify-end gap-2">
                      <button onClick={() => handleOpenModal(blog)} className="p-2 text-blue-600 bg-blue-50 dark:bg-blue-900/20 rounded hover:bg-blue-100 dark:hover:bg-blue-900/40 transition">
                        <Edit size={16} />
                      </button>
                      <button onClick={() => handleDelete(blog.id)} className="p-2 text-red-600 bg-red-50 dark:bg-red-900/20 rounded hover:bg-red-100 dark:hover:bg-red-900/40 transition">
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white dark:bg-darkCard w-full max-w-3xl rounded-2xl shadow-xl overflow-hidden mt-10 mb-10">
            <div className="flex justify-between items-center p-6 border-b dark:border-darkBorder">
              <h2 className="text-xl font-bold dark:text-white">{editingBlog ? 'Edit Blog Post' : 'Create New Blog Post'}</h2>
              <button onClick={() => setIsModalOpen(false)} className="text-gray-400 hover:text-gray-600 dark:hover:text-white">
                <X size={24} />
              </button>
            </div>
            
            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1 dark:text-gray-300">Title*</label>
                <input 
                  type="text" 
                  value={formData.title} 
                  onChange={(e) => setFormData({...formData, title: e.target.value})} 
                  className="w-full border dark:border-darkBorder dark:bg-darkBg dark:text-white rounded-lg p-3 outline-none focus:ring-2 focus:ring-primary/50" 
                  required 
                />
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-1 dark:text-gray-300">Category</label>
                  <input 
                    type="text" 
                    value={formData.category} 
                    onChange={(e) => setFormData({...formData, category: e.target.value})} 
                    className="w-full border dark:border-darkBorder dark:bg-darkBg dark:text-white rounded-lg p-3 outline-none focus:ring-2 focus:ring-primary/50" 
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1 dark:text-gray-300">Image URL</label>
                  <input 
                    type="url" 
                    value={formData.image} 
                    onChange={(e) => setFormData({...formData, image: e.target.value})} 
                    className="w-full border dark:border-darkBorder dark:bg-darkBg dark:text-white rounded-lg p-3 outline-none focus:ring-2 focus:ring-primary/50" 
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium mb-1 dark:text-gray-300">Excerpt (Short description)</label>
                <textarea 
                  value={formData.excerpt} 
                  onChange={(e) => setFormData({...formData, excerpt: e.target.value})} 
                  rows={2}
                  className="w-full border dark:border-darkBorder dark:bg-darkBg dark:text-white rounded-lg p-3 outline-none focus:ring-2 focus:ring-primary/50" 
                ></textarea>
              </div>

              <div>
                <label className="block text-sm font-medium mb-1 dark:text-gray-300">Full Content* (Markdown support added in rendering)</label>
                <textarea 
                  value={formData.content} 
                  onChange={(e) => setFormData({...formData, content: e.target.value})} 
                  rows={8}
                  className="w-full border dark:border-darkBorder dark:bg-darkBg dark:text-white rounded-lg p-3 outline-none focus:ring-2 focus:ring-primary/50 font-mono text-sm" 
                  required
                ></textarea>
              </div>

              <div className="flex items-center gap-2 mt-4">
                <input 
                  type="checkbox" 
                  id="isActive" 
                  checked={formData.isActive} 
                  onChange={(e) => setFormData({...formData, isActive: e.target.checked})} 
                  className="w-4 h-4 text-primary rounded border-gray-300 focus:ring-primary" 
                />
                <label htmlFor="isActive" className="text-sm font-medium text-gray-700 dark:text-gray-300">Publish immediately</label>
              </div>
              
              <div className="pt-4 border-t dark:border-darkBorder flex justify-end gap-3 mt-4">
                <button type="button" onClick={() => setIsModalOpen(false)} className="px-5 py-2 text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-darkBg rounded-lg font-medium transition">
                  Cancel
                </button>
                <button type="submit" className="flex items-center gap-2 bg-primary text-white hover:bg-blue-800 px-6 py-2 rounded-lg font-bold transition">
                  <Save size={18} /> {editingBlog ? 'Update Post' : 'Save Post'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
