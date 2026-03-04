import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { supabase } from '../../lib/supabase';
import { Users, BookOpen, Calendar, TrendingUp, UserPlus } from 'lucide-react';

interface Stats {
  totalLeads: number;
  newLeads: number;
  totalCourses: number;
  totalWorkshops: number;
  totalRevenue: number;
  conversions: number;
}

interface RecentLead {
  id: string;
  name: string;
  phone: string;
  course_interest: string;
  created_at: string;
}

export function AdminDashboard() {
  const [stats, setStats] = useState<Stats>({
    totalLeads: 0,
    newLeads: 0,
    totalCourses: 0,
    totalWorkshops: 0,
    totalRevenue: 0,
    conversions: 0,
  });
  const [recentLeads, setRecentLeads] = useState<RecentLead[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  async function fetchDashboardData() {
    try {
      const [leadsResult, coursesResult, workshopsResult, recentLeadsResult] = await Promise.all([
        supabase.from('leads').select('*', { count: 'exact', head: true }),
        supabase.from('courses').select('*', { count: 'exact', head: true }),
        supabase.from('workshops').select('*', { count: 'exact', head: true }),
        supabase.from('leads').select('id, name, phone, course_interest, created_at').order('created_at', { ascending: false }).limit(5),
      ]);

      setStats({
        totalLeads: leadsResult.count || 0,
        newLeads: leadsResult.count || 0,
        totalCourses: coursesResult.count || 0,
        totalWorkshops: workshopsResult.count || 0,
        totalRevenue: 0,
        conversions: 0,
      });

      setRecentLeads((recentLeadsResult.data as RecentLead[]) || []);
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
    } finally {
      setLoading(false);
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
      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-gray-900 rounded-xl p-6 border border-gray-800">
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 bg-red-600/20 rounded-lg flex items-center justify-center">
              <Users className="w-6 h-6 text-red-500" />
            </div>
            <TrendingUp className="w-5 h-5 text-green-500" />
          </div>
          <h3 className="text-gray-400 text-sm mb-1">Total Leads</h3>
          <p className="text-2xl font-bold text-white">{stats.totalLeads}</p>
        </div>

        <div className="bg-gray-900 rounded-xl p-6 border border-gray-800">
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 bg-blue-600/20 rounded-lg flex items-center justify-center">
              <UserPlus className="w-6 h-6 text-blue-500" />
            </div>
          </div>
          <h3 className="text-gray-400 text-sm mb-1">New Leads (Today)</h3>
          <p className="text-2xl font-bold text-white">{stats.newLeads}</p>
        </div>

        <div className="bg-gray-900 rounded-xl p-6 border border-gray-800">
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 bg-green-600/20 rounded-lg flex items-center justify-center">
              <BookOpen className="w-6 h-6 text-green-500" />
            </div>
          </div>
          <h3 className="text-gray-400 text-sm mb-1">Total Courses</h3>
          <p className="text-2xl font-bold text-white">{stats.totalCourses}</p>
        </div>

        <div className="bg-gray-900 rounded-xl p-6 border border-gray-800">
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 bg-purple-600/20 rounded-lg flex items-center justify-center">
              <Calendar className="w-6 h-6 text-purple-500" />
            </div>
          </div>
          <h3 className="text-gray-400 text-sm mb-1">Active Workshops</h3>
          <p className="text-2xl font-bold text-white">{stats.totalWorkshops}</p>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="bg-gray-900 rounded-xl p-6 border border-gray-800">
        <h2 className="text-lg font-semibold text-white mb-4">Quick Actions</h2>
        <div className="flex flex-wrap gap-3">
          <Link
            to="/admin/courses/new"
            className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg text-sm transition-colors"
          >
            Add New Course
          </Link>
          <Link
            to="/admin/workshops/new"
            className="bg-gray-800 hover:bg-gray-700 text-white px-4 py-2 rounded-lg text-sm transition-colors"
          >
            Add New Workshop
          </Link>
          <Link
            to="/admin/leads"
            className="bg-gray-800 hover:bg-gray-700 text-white px-4 py-2 rounded-lg text-sm transition-colors"
          >
            View All Leads
          </Link>
        </div>
      </div>

      {/* Recent Leads */}
      <div className="bg-gray-900 rounded-xl p-6 border border-gray-800">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-white">Recent Leads</h2>
          <Link to="/admin/leads" className="text-red-500 hover:text-red-400 text-sm">
            View All
          </Link>
        </div>
        
        {recentLeads.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-800">
                  <th className="text-left text-gray-400 text-sm font-medium py-3">Name</th>
                  <th className="text-left text-gray-400 text-sm font-medium py-3">Phone</th>
                  <th className="text-left text-gray-400 text-sm font-medium py-3">Course</th>
                  <th className="text-left text-gray-400 text-sm font-medium py-3">Date</th>
                </tr>
              </thead>
              <tbody>
                {recentLeads.map((lead) => (
                  <tr key={lead.id} className="border-b border-gray-800/50">
                    <td className="py-3 text-white">{lead.name}</td>
                    <td className="py-3 text-gray-400">{lead.phone}</td>
                    <td className="py-3 text-gray-400">{lead.course_interest || '-'}</td>
                    <td className="py-3 text-gray-400">
                      {new Date(lead.created_at).toLocaleDateString()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <p className="text-gray-400 text-center py-8">No leads found</p>
        )}
      </div>
    </div>
  );
}
