import { useEffect, useState } from 'react';
import { supabase, type Lead } from '../../lib/supabase';
import { useAuth } from '../../context/AuthContext';
import { Users, Phone, CheckCircle, Clock } from 'lucide-react';

interface Stats {
  totalLeads: number;
  newLeads: number;
  followUps: number;
  converted: number;
}

export function CRMDashboard() {
  const { user } = useAuth();
  const [stats, setStats] = useState<Stats>({
    totalLeads: 0,
    newLeads: 0,
    followUps: 0,
    converted: 0,
  });
  const [recentLeads, setRecentLeads] = useState<Lead[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  async function fetchDashboardData() {
    try {
      const [leadsResult, recentResult] = await Promise.all([
        supabase.from('leads').select('*', { count: 'exact', head: true }).eq('assigned_to', user?.id),
        supabase.from('leads').select('*').eq('assigned_to', user?.id).order('created_at', { ascending: false }).limit(5),
      ]);

      const leads = recentResult.data || [];
      
      setStats({
        totalLeads: leadsResult.count || 0,
        newLeads: leads.filter(l => l.status === 'new').length,
        followUps: leads.filter(l => l.status === 'follow_up').length,
        converted: leads.filter(l => l.status === 'converted').length,
      });

      setRecentLeads(leads as Lead[]);
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
    } finally {
      setLoading(false);
    }
  }

  async function updateLeadStatus(leadId: string, status: Lead['status']) {
    try {
      const { error } = await supabase
        .from('leads')
        .update({ status })
        .eq('id', leadId);

      if (error) throw error;
      fetchDashboardData();
    } catch (error) {
      console.error('Error updating lead:', error);
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
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-gray-900 rounded-xl p-6 border border-gray-800">
          <div className="flex items-center justify-between mb-4">
            <div className="w-10 h-10 bg-red-600/20 rounded-lg flex items-center justify-center">
              <Users className="w-5 h-5 text-red-500" />
            </div>
          </div>
          <h3 className="text-gray-400 text-sm mb-1">Total Leads</h3>
          <p className="text-2xl font-bold text-white">{stats.totalLeads}</p>
        </div>

        <div className="bg-gray-900 rounded-xl p-6 border border-gray-800">
          <div className="flex items-center justify-between mb-4">
            <div className="w-10 h-10 bg-blue-600/20 rounded-lg flex items-center justify-center">
              <Phone className="w-5 h-5 text-blue-500" />
            </div>
          </div>
          <h3 className="text-gray-400 text-sm mb-1">New Leads</h3>
          <p className="text-2xl font-bold text-white">{stats.newLeads}</p>
        </div>

        <div className="bg-gray-900 rounded-xl p-6 border border-gray-800">
          <div className="flex items-center justify-between mb-4">
            <div className="w-10 h-10 bg-yellow-600/20 rounded-lg flex items-center justify-center">
              <Clock className="w-5 h-5 text-yellow-500" />
            </div>
          </div>
          <h3 className="text-gray-400 text-sm mb-1">Follow Ups</h3>
          <p className="text-2xl font-bold text-white">{stats.followUps}</p>
        </div>

        <div className="bg-gray-900 rounded-xl p-6 border border-gray-800">
          <div className="flex items-center justify-between mb-4">
            <div className="w-10 h-10 bg-green-600/20 rounded-lg flex items-center justify-center">
              <CheckCircle className="w-5 h-5 text-green-500" />
            </div>
          </div>
          <h3 className="text-gray-400 text-sm mb-1">Converted</h3>
          <p className="text-2xl font-bold text-white">{stats.converted}</p>
        </div>
      </div>

      {/* Recent Leads */}
      <div className="bg-gray-900 rounded-xl p-6 border border-gray-800">
        <h2 className="text-lg font-semibold text-white mb-4">Recent Leads</h2>
        
        {recentLeads.length > 0 ? (
          <div className="space-y-4">
            {recentLeads.map((lead) => (
              <div
                key={lead.id}
                className="flex items-center justify-between p-4 bg-gray-800/50 rounded-lg"
              >
                <div>
                  <h3 className="text-white font-medium">{lead.name}</h3>
                  <p className="text-gray-400 text-sm">{lead.phone}</p>
                  {lead.course_interest && (
                    <p className="text-red-400 text-sm">{lead.course_interest}</p>
                  )}
                </div>
                <div className="flex items-center gap-2">
                  <select
                    value={lead.status}
                    onChange={(e) => updateLeadStatus(lead.id, e.target.value as Lead['status'])}
                    className="px-3 py-1 bg-gray-700 border border-gray-600 rounded-lg text-white text-sm focus:outline-none focus:border-red-500"
                  >
                    <option value="new">New</option>
                    <option value="contacted">Contacted</option>
                    <option value="follow_up">Follow Up</option>
                    <option value="converted">Converted</option>
                    <option value="lost">Lost</option>
                  </select>
                  <a
                    href={`tel:${lead.phone}`}
                    className="bg-red-600 hover:bg-red-700 text-white px-3 py-1 rounded-lg text-sm transition-colors"
                  >
                    Call
                  </a>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-gray-400 text-center py-8">No leads assigned to you</p>
        )}
      </div>
    </div>
  );
}
