import { useEffect, useState } from 'react';
import { supabase, type Lead } from '../../lib/supabase';
import { Search, Phone, Mail, MapPin, Calendar } from 'lucide-react';

export function AdminLeads() {
  const [leads, setLeads] = useState<Lead[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');

  useEffect(() => {
    fetchLeads();
  }, []);

  async function fetchLeads() {
    try {
      let query = supabase.from('leads').select('*').order('created_at', { ascending: false });

      if (statusFilter !== 'all') {
        query = query.eq('status', statusFilter);
      }

      const { data, error } = await query;
      if (error) throw error;
      setLeads(data as Lead[]);
    } catch (error) {
      console.error('Error fetching leads:', error);
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
      fetchLeads();
    } catch (error) {
      console.error('Error updating lead:', error);
    }
  }

  const filteredLeads = leads.filter(lead => 
    lead.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    lead.phone.includes(searchTerm) ||
    lead.email?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const statusColors: Record<Lead['status'], string> = {
    new: 'bg-blue-600/20 text-blue-400',
    contacted: 'bg-yellow-600/20 text-yellow-400',
    follow_up: 'bg-purple-600/20 text-purple-400',
    converted: 'bg-green-600/20 text-green-400',
    lost: 'bg-red-600/20 text-red-400',
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
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <h1 className="text-2xl font-bold text-white">Leads</h1>
        <div className="flex items-center gap-3 w-full sm:w-auto">
          <div className="relative flex-1 sm:flex-initial">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
            <input
              type="text"
              placeholder="Search leads..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 pr-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white focus:outline-none focus:border-red-500 w-full sm:w-64"
            />
          </div>
          <select
            value={statusFilter}
            onChange={(e) => {
              setStatusFilter(e.target.value);
              fetchLeads();
            }}
            className="px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white focus:outline-none focus:border-red-500"
          >
            <option value="all">All Status</option>
            <option value="new">New</option>
            <option value="contacted">Contacted</option>
            <option value="follow_up">Follow Up</option>
            <option value="converted">Converted</option>
            <option value="lost">Lost</option>
          </select>
        </div>
      </div>

      <div className="grid gap-4">
        {filteredLeads.map((lead) => (
          <div
            key={lead.id}
            className="bg-gray-900 rounded-xl p-6 border border-gray-800"
          >
            <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
              <div className="space-y-2">
                <div className="flex items-center gap-3">
                  <h3 className="text-lg font-semibold text-white">{lead.name}</h3>
                  <span className={`px-2 py-1 rounded text-xs ${statusColors[lead.status]}`}>
                    {lead.status.replace('_', ' ').toUpperCase()}
                  </span>
                </div>
                
                <div className="flex flex-wrap gap-4 text-sm text-gray-400">
                  <span className="flex items-center gap-1">
                    <Phone size={14} />
                    {lead.phone}
                  </span>
                  {lead.email && (
                    <span className="flex items-center gap-1">
                      <Mail size={14} />
                      {lead.email}
                    </span>
                  )}
                  <span className="flex items-center gap-1">
                    <MapPin size={14} />
                    {lead.city}, {lead.state}
                  </span>
                  <span className="flex items-center gap-1">
                    <Calendar size={14} />
                    {new Date(lead.created_at).toLocaleDateString()}
                  </span>
                </div>

                {lead.course_interest && (
                  <p className="text-sm text-gray-500">
                    Course Interest: <span className="text-red-400">{lead.course_interest}</span>
                  </p>
                )}

                {lead.notes && (
                  <p className="text-sm text-gray-500 mt-2">Notes: {lead.notes}</p>
                )}
              </div>

              <div className="flex items-center gap-2">
                <select
                  value={lead.status}
                  onChange={(e) => updateLeadStatus(lead.id, e.target.value as Lead['status'])}
                  className="px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white text-sm focus:outline-none focus:border-red-500"
                >
                  <option value="new">New</option>
                  <option value="contacted">Contacted</option>
                  <option value="follow_up">Follow Up</option>
                  <option value="converted">Converted</option>
                  <option value="lost">Lost</option>
                </select>
                <a
                  href={`tel:${lead.phone}`}
                  className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg text-sm transition-colors"
                >
                  Call
                </a>
              </div>
            </div>
          </div>
        ))}

        {filteredLeads.length === 0 && (
          <div className="text-center py-12">
            <p className="text-gray-400">No leads found</p>
          </div>
        )}
      </div>
    </div>
  );
}
