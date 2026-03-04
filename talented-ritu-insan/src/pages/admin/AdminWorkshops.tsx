import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { supabase, type Workshop } from '../../lib/supabase';
import { Plus, Edit, Trash2, Eye, EyeOff, Calendar, Users } from 'lucide-react';

export function AdminWorkshops() {
  const [workshops, setWorkshops] = useState<Workshop[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchWorkshops();
  }, []);

  async function fetchWorkshops() {
    try {
      const { data, error } = await supabase
        .from('workshops')
        .select('*')
        .order('date', { ascending: true });

      if (error) throw error;
      setWorkshops(data as Workshop[]);
    } catch (error) {
      console.error('Error fetching workshops:', error);
    } finally {
      setLoading(false);
    }
  }

  async function toggleActive(workshop: Workshop) {
    try {
      const { error } = await supabase
        .from('workshops')
        .update({ is_active: !workshop.is_active })
        .eq('id', workshop.id);

      if (error) throw error;
      fetchWorkshops();
    } catch (error) {
      console.error('Error toggling workshop:', error);
    }
  }

  async function deleteWorkshop(id: string) {
    if (!confirm('Are you sure you want to delete this workshop?')) return;

    try {
      const { error } = await supabase.from('workshops').delete().eq('id', id);
      if (error) throw error;
      fetchWorkshops();
    } catch (error) {
      console.error('Error deleting workshop:', error);
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
        <h1 className="text-2xl font-bold text-white">Workshops</h1>
        <Link
          to="/admin/workshops/new"
          className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg text-sm flex items-center gap-2 transition-colors"
        >
          <Plus size={18} />
          Add Workshop
        </Link>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {workshops.map((workshop) => (
          <div
            key={workshop.id}
            className="bg-gray-900 rounded-xl overflow-hidden border border-gray-800"
          >
            <div className="relative h-40">
              <img
                src={workshop.image_url}
                alt={workshop.title}
                className="w-full h-full object-cover"
              />
              <span
                className={`absolute top-2 right-2 px-2 py-1 rounded text-xs ${
                  workshop.is_active
                    ? 'bg-green-600/80 text-white'
                    : 'bg-red-600/80 text-white'
                }`}
              >
                {workshop.is_active ? 'Active' : 'Inactive'}
              </span>
            </div>

            <div className="p-4">
              <h3 className="text-white font-semibold mb-2">{workshop.title}</h3>
              
              <div className="space-y-1 text-sm text-gray-400 mb-4">
                <div className="flex items-center gap-2">
                  <Calendar size={14} />
                  <span>{new Date(workshop.date).toLocaleDateString()} at {workshop.time}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Users size={14} />
                  <span>{workshop.seats} seats</span>
                </div>
              </div>

              <div className="flex items-center justify-between">
                <span className="text-lg font-bold text-white">₹{workshop.price.toLocaleString()}</span>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => toggleActive(workshop)}
                    className="text-gray-400 hover:text-white transition-colors"
                  >
                    {workshop.is_active ? <Eye size={18} /> : <EyeOff size={18} />}
                  </button>
                  <Link
                    to={`/admin/workshops/edit/${workshop.id}`}
                    className="text-gray-400 hover:text-white transition-colors"
                  >
                    <Edit size={18} />
                  </Link>
                  <button
                    onClick={() => deleteWorkshop(workshop.id)}
                    className="text-gray-400 hover:text-red-400 transition-colors"
                  >
                    <Trash2 size={18} />
                  </button>
                </div>
              </div>
            </div>
          </div>
        ))}

        {workshops.length === 0 && (
          <div className="col-span-full text-center py-12">
            <p className="text-gray-400">No workshops found. Add your first workshop!</p>
          </div>
        )}
      </div>
    </div>
  );
}
