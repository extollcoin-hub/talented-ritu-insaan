import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { supabase } from '../../lib/supabase';
import { ArrowLeft, Loader2 } from 'lucide-react';

export function AdminCourseForm() {
  const navigate = useNavigate();
  const { id } = useParams();
  const isEdit = Boolean(id);

  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    title_hi: '',
    slug: '',
    description: '',
    description_hi: '',
    price: '',
    duration: '',
    image_url: '',
    category: '',
    is_active: true,
  });

  useEffect(() => {
    if (isEdit && id) {
      fetchCourse();
    }
  }, [id]);

  async function fetchCourse() {
    try {
      const { data, error } = await supabase
        .from('courses')
        .select('*')
        .eq('id', id)
        .single();

      if (error) throw error;
      
      if (data) {
        setFormData({
          title: data.title || '',
          title_hi: data.title_hi || '',
          slug: data.slug || '',
          description: data.description || '',
          description_hi: data.description_hi || '',
          price: data.price?.toString() || '',
          duration: data.duration || '',
          image_url: data.image_url || '',
          category: data.category || '',
          is_active: data.is_active ?? true,
        });
      }
    } catch (error) {
      console.error('Error fetching course:', error);
    }
  }

  function generateSlug(title: string) {
    return title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, '');
  }

  function handleChange(e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) {
    const { name, value, type } = e.target;
    
    if (name === 'title' && !isEdit) {
      setFormData(prev => ({
        ...prev,
        [name]: value,
        slug: generateSlug(value),
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: type === 'checkbox' ? (e.target as HTMLInputElement).checked : value,
      }));
    }
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);

    try {
      const courseData = {
        title: formData.title,
        title_hi: formData.title_hi,
        slug: formData.slug,
        description: formData.description,
        description_hi: formData.description_hi,
        price: parseFloat(formData.price) || 0,
        duration: formData.duration,
        image_url: formData.image_url,
        category: formData.category,
        is_active: formData.is_active,
      };

      if (isEdit) {
        const { error } = await supabase
          .from('courses')
          .update(courseData)
          .eq('id', id);
        if (error) throw error;
      } else {
        const { error } = await supabase.from('courses').insert([courseData]);
        if (error) throw error;
      }

      navigate('/admin/courses');
    } catch (error) {
      console.error('Error saving course:', error);
      alert('Error saving course. Please try again.');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="max-w-2xl mx-auto">
      <button
        onClick={() => navigate('/admin/courses')}
        className="flex items-center gap-2 text-gray-400 hover:text-white mb-6"
      >
        <ArrowLeft size={20} />
        Back to Courses
      </button>

      <div className="bg-gray-900 rounded-xl p-6 border border-gray-800">
        <h1 className="text-2xl font-bold text-white mb-6">
          {isEdit ? 'Edit Course' : 'Add New Course'}
        </h1>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Title (English)
              </label>
              <input
                type="text"
                name="title"
                value={formData.title}
                onChange={handleChange}
                className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white focus:outline-none focus:border-red-500"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Title (Hindi)
              </label>
              <input
                type="text"
                name="title_hi"
                value={formData.title_hi}
                onChange={handleChange}
                className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white focus:outline-none focus:border-red-500"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">Slug</label>
            <input
              type="text"
              name="slug"
              value={formData.slug}
              onChange={handleChange}
              className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white focus:outline-none focus:border-red-500"
              required
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Description (English)
              </label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleChange}
                rows={3}
                className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white focus:outline-none focus:border-red-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Description (Hindi)
              </label>
              <textarea
                name="description_hi"
                value={formData.description_hi}
                onChange={handleChange}
                rows={3}
                className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white focus:outline-none focus:border-red-500"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">Price (₹)</label>
              <input
                type="number"
                name="price"
                value={formData.price}
                onChange={handleChange}
                className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white focus:outline-none focus:border-red-500"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">Duration</label>
              <input
                type="text"
                name="duration"
                value={formData.duration}
                onChange={handleChange}
                placeholder="e.g., 3 Months"
                className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white focus:outline-none focus:border-red-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">Category</label>
              <select
                name="category"
                value={formData.category}
                onChange={handleChange}
                className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white focus:outline-none focus:border-red-500"
              >
                <option value="">Select Category</option>
                <option value="Beginner">Beginner</option>
                <option value="Advanced">Advanced</option>
                <option value="Specialization">Specialization</option>
                <option value="Business">Business</option>
                <option value="Design">Design</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">Image URL</label>
            <input
              type="url"
              name="image_url"
              value={formData.image_url}
              onChange={handleChange}
              className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white focus:outline-none focus:border-red-500"
              placeholder="https://example.com/image.jpg"
            />
          </div>

          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              id="is_active"
              name="is_active"
              checked={formData.is_active}
              onChange={(e) => setFormData(prev => ({ ...prev, is_active: e.target.checked }))}
              className="w-4 h-4 bg-gray-800 border-gray-700 rounded"
            />
            <label htmlFor="is_active" className="text-sm text-gray-300">
              Active (visible on website)
            </label>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-red-600 hover:bg-red-700 disabled:bg-red-600/50 text-white py-3 rounded-lg font-semibold transition-colors flex items-center justify-center gap-2"
          >
            {loading ? (
              <>
                <Loader2 className="animate-spin" size={20} />
                Saving...
              </>
            ) : (
              'Save Course'
            )}
          </button>
        </form>
      </div>
    </div>
  );
}
