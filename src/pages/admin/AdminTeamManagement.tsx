import { useEffect, useState } from 'react';
import { supabase, type Employee } from '../../lib/supabase';
import { Plus, Edit, Trash2, UserCheck, UserX, Shield, Phone, Mail } from 'lucide-react';

export function AdminTeamManagement() {
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingEmployee, setEditingEmployee] = useState<Employee | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    role: 'calls' as Employee['role'],
  });

  useEffect(() => {
    fetchEmployees();
  }, []);

  async function fetchEmployees() {
    try {
      const { data, error } = await supabase
        .from('employees')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setEmployees(data as Employee[]);
    } catch (error) {
      console.error('Error fetching employees:', error);
    } finally {
      setLoading(false);
    }
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    try {
      if (editingEmployee) {
        const { error } = await supabase
          .from('employees')
          .update(formData)
          .eq('id', editingEmployee.id);
        if (error) throw error;
      } else {
        const { error } = await supabase.from('employees').insert([formData]);
        if (error) throw error;
      }
      setShowForm(false);
      setEditingEmployee(null);
      setFormData({ name: '', email: '', phone: '', role: 'calls' });
      fetchEmployees();
    } catch (error) {
      console.error('Error saving employee:', error);
    }
  }

  async function toggleActive(employee: Employee) {
    try {
      const { error } = await supabase
        .from('employees')
        .update({ is_active: !employee.is_active })
        .eq('id', employee.id);
      if (error) throw error;
      fetchEmployees();
    } catch (error) {
      console.error('Error toggling employee:', error);
    }
  }

  async function deleteEmployee(id: string) {
    if (!confirm('Are you sure you want to delete this employee?')) return;
    try {
      const { error } = await supabase.from('employees').delete().eq('id', id);
      if (error) throw error;
      fetchEmployees();
    } catch (error) {
      console.error('Error deleting employee:', error);
    }
  }

  const roleColors: Record<Employee['role'], string> = {
    admin: 'bg-red-600/20 text-red-400',
    manager: 'bg-purple-600/20 text-purple-400',
    calls: 'bg-blue-600/20 text-blue-400',
  };

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
        <h1 className="text-2xl font-bold text-white">Team Management</h1>
        <button
          onClick={() => {
            setEditingEmployee(null);
            setFormData({ name: '', email: '', phone: '', role: 'calls' });
            setShowForm(true);
          }}
          className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg text-sm flex items-center gap-2 transition-colors"
        >
          <Plus size={18} />
          Add Member
        </button>
      </div>

      {showForm && (
        <div className="bg-gray-900 rounded-xl p-6 border border-gray-800">
          <h2 className="text-lg font-semibold text-white mb-4">
            {editingEmployee ? 'Edit Team Member' : 'Add New Team Member'}
          </h2>
          <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">Name</label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white focus:outline-none focus:border-red-500"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">Email</label>
              <input
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white focus:outline-none focus:border-red-500"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">Phone</label>
              <input
                type="tel"
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white focus:outline-none focus:border-red-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">Role</label>
              <select
                value={formData.role}
                onChange={(e) => setFormData({ ...formData, role: e.target.value as Employee['role'] })}
                className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white focus:outline-none focus:border-red-500"
              >
                <option value="calls">Calls Team</option>
                <option value="manager">Manager</option>
                <option value="admin">Admin</option>
              </select>
            </div>
            <div className="md:col-span-2 flex gap-3">
              <button
                type="submit"
                className="bg-red-600 hover:bg-red-700 text-white px-6 py-2 rounded-lg transition-colors"
              >
                {editingEmployee ? 'Update' : 'Add'} Member
              </button>
              <button
                type="button"
                onClick={() => {
                  setShowForm(false);
                  setEditingEmployee(null);
                }}
                className="bg-gray-700 hover:bg-gray-600 text-white px-6 py-2 rounded-lg transition-colors"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {employees.map((employee) => (
          <div
            key={employee.id}
            className="bg-gray-900 rounded-xl p-6 border border-gray-800"
          >
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-gray-800 rounded-full flex items-center justify-center">
                  <Shield className={`w-6 h-6 ${employee.is_active ? 'text-green-500' : 'text-gray-500'}`} />
                </div>
                <div>
                  <h3 className="text-white font-semibold">{employee.name}</h3>
                  <span className={`px-2 py-0.5 rounded text-xs ${roleColors[employee.role]}`}>
                    {employee.role.charAt(0).toUpperCase() + employee.role.slice(1)}
                  </span>
                </div>
              </div>
              <span className={`w-2 h-2 rounded-full ${employee.is_active ? 'bg-green-500' : 'bg-red-500'}`} />
            </div>

            <div className="space-y-2 mb-4">
              <div className="flex items-center gap-2 text-gray-400 text-sm">
                <Mail size={14} />
                <span>{employee.email}</span>
              </div>
              {employee.phone && (
                <div className="flex items-center gap-2 text-gray-400 text-sm">
                  <Phone size={14} />
                  <span>{employee.phone}</span>
                </div>
              )}
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={() => toggleActive(employee)}
                className={`flex-1 flex items-center justify-center gap-1 py-2 rounded-lg text-sm transition-colors ${
                  employee.is_active
                    ? 'bg-green-600/20 text-green-400 hover:bg-green-600/30'
                    : 'bg-red-600/20 text-red-400 hover:bg-red-600/30'
                }`}
              >
                {employee.is_active ? <UserCheck size={16} /> : <UserX size={16} />}
                {employee.is_active ? 'Active' : 'Inactive'}
              </button>
              <button
                onClick={() => {
                  setEditingEmployee(employee);
                  setFormData({
                    name: employee.name,
                    email: employee.email,
                    phone: employee.phone,
                    role: employee.role,
                  });
                  setShowForm(true);
                }}
                className="p-2 text-gray-400 hover:text-white transition-colors"
              >
                <Edit size={18} />
              </button>
              <button
                onClick={() => deleteEmployee(employee.id)}
                className="p-2 text-gray-400 hover:text-red-400 transition-colors"
              >
                <Trash2 size={18} />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
