import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { supabase, type Course } from '../../lib/supabase';
import { Plus, Edit, Trash2, Eye, EyeOff } from 'lucide-react';

export function AdminCourses() {
  const [courses, setCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchCourses();
  }, []);

  async function fetchCourses() {
    try {
      const { data, error } = await supabase
        .from('courses')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setCourses(data as Course[]);
    } catch (error) {
      console.error('Error fetching courses:', error);
    } finally {
      setLoading(false);
    }
  }

  async function toggleActive(course: Course) {
    try {
      const { error } = await supabase
        .from('courses')
        .update({ is_active: !course.is_active })
        .eq('id', course.id);

      if (error) throw error;
      fetchCourses();
    } catch (error) {
      console.error('Error toggling course:', error);
    }
  }

  async function deleteCourse(id: string) {
    if (!confirm('Are you sure you want to delete this course?')) return;

    try {
      const { error } = await supabase.from('courses').delete().eq('id', id);
      if (error) throw error;
      fetchCourses();
    } catch (error) {
      console.error('Error deleting course:', error);
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-red-500"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-white">Courses</h1>
        <Link
          to="/admin/courses/new"
          className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg text-sm flex items-center gap-2 transition-colors"
        >
          <Plus size={18} />
          Add Course
        </Link>
      </div>

      <div className="bg-gray-900 rounded-xl border border-gray-800 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-gray-800/50">
                <th className="text-left text-gray-400 text-sm font-medium py-4 px-6">Title</th>
                <th className="text-left text-gray-400 text-sm font-medium py-4 px-6">Category</th>
                <th className="text-left text-gray-400 text-sm font-medium py-4 px-6">Price</th>
                <th className="text-left text-gray-400 text-sm font-medium py-4 px-6">Duration</th>
                <th className="text-left text-gray-400 text-sm font-medium py-4 px-6">Status</th>
                <th className="text-left text-gray-400 text-sm font-medium py-4 px-6">Actions</th>
              </tr>
            </thead>
            <tbody>
              {courses.map((course) => (
                <tr key={course.id} className="border-t border-gray-800">
                  <td className="py-4 px-6">
                    <div className="flex items-center gap-3">
                      <img
                        src={course.image_url}
                        alt={course.title}
                        className="w-12 h-12 rounded-lg object-cover"
                      />
                      <div>
                        <p className="text-white font-medium">{course.title}</p>
                        <p className="text-gray-500 text-sm">{course.slug}</p>
                      </div>
                    </div>
                  </td>
                  <td className="py-4 px-6">
                    <span className="bg-gray-800 text-gray-300 px-2 py-1 rounded text-sm">
                      {course.category}
                    </span>
                  </td>
                  <td className="py-4 px-6 text-white">₹{course.price.toLocaleString()}</td>
                  <td className="py-4 px-6 text-gray-400">{course.duration}</td>
                  <td className="py-4 px-6">
                    <button
                      onClick={() => toggleActive(course)}
                      className={`flex items-center gap-1 px-2 py-1 rounded text-sm ${
                        course.is_active
                          ? 'bg-green-600/20 text-green-400'
                          : 'bg-red-600/20 text-red-400'
                      }`}
                    >
                      {course.is_active ? <Eye size={14} /> : <EyeOff size={14} />}
                      {course.is_active ? 'Active' : 'Inactive'}
                    </button>
                  </td>
                  <td className="py-4 px-6">
                    <div className="flex items-center gap-2">
                      <Link
                        to={`/admin/courses/edit/${course.id}`}
                        className="text-gray-400 hover:text-white transition-colors"
                      >
                        <Edit size={18} />
                      </Link>
                      <button
                        onClick={() => deleteCourse(course.id)}
                        className="text-gray-400 hover:text-red-400 transition-colors"
                      >
                        <Trash2 size={18} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {courses.length === 0 && (
          <div className="text-center py-12">
            <p className="text-gray-400">No courses found. Add your first course!</p>
          </div>
        )}
      </div>
    </div>
  );
}
