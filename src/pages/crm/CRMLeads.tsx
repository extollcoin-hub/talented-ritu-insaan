import { useEffect, useState } from 'react';
import { supabase, type Lead } from '../../lib/supabase';
import { useAuth } from '../../context/AuthContext';
import { Search, Phone, Mail, MapPin, Calendar, MessageSquare } from 'lucide-react';

export function CRMLeads() {
  const { user } = useAuth();
  const [leads, setLeads] = useState<Lead[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedLead, setSelectedLead] = useState<Lead | null>(null);
  const [note, setNote] = useState('');

  useEffect(() => {
    fetchLeads();
  }, []);

  async function fetchLeads() {
    try {
      const { data, error } = await supabase
        .from('leads')
        .select('*')
        .eq('assigned_to', user?.id)
        .order('created_at', { ascending: false });

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

  async function addNote() {
    if (!selectedLead || !note.trim()) return;

    try {
      const newNote = `${new Date().toLocaleString()}: ${note}\n\n${selectedLead.notes || ''}`;
      
      const { error } = await supabase
        .from('leads')
        .update({ notes: newNote })
        .eq('id', selectedLead.id);

      if (error) throw error;
      setNote('');
      fetchLeads();
      setSelectedLead({ ...selectedLead, notes: newNote });
    } catch (error) {
      console.error('Error adding note:', error);
    }
  }

  const filteredLeads = leads.filter(lead => 
    lead.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    lead.phone.includes(searchTerm)
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
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-white">My Leads</h1>
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
          <input
            type="text"
            placeholder="Search leads..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10 pr-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white focus:outline-none focus:border-red-500 w-64"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Leads List */}
        <div className="lg:col-span-2 space-y-4">
          {filteredLeads.map((lead) => (
            <div
              key={lead.id}
              onClick={() => setSelectedLead(lead)}
              className={`bg-gray-900 rounded-xl p-4 border cursor-pointer transition-colors ${
                selectedLead?.id === lead.id
                  ? 'border-red-500'
                  : 'border-gray-800 hover:border-gray-700'
              }`}
            >
              <div className="flex items-center justify-between mb-2">
                <h3 className="text-white font-semibold">{lead.name}</h3>
                <span className={`px-2 py-1 rounded text-xs ${statusColors[lead.status]}`}>
                  {lead.status.replace('_', ' ').toUpperCase()}
                </span>
              </div>
              
              <div className="flex flex-wrap gap-4 text-sm text-gray-400">
                <span className="flex items-center gap-1">
                  <Phone size={14} />
                  {lead.phone}
                </span>
                <span className="flex items-center gap-1">
                  <MapPin size={14} />
                  {lead.state}
                </span>
              </div>

              {lead.course_interest && (
                <p className="text-red-400 text-sm mt-2">Course: {lead.course_interest}</p>
              )}
            </div>
          ))}

          {filteredLeads.length === 0 && (
            <div className="text-center py-12">
              <p className="text-gray-400">No leads found</p>
            </div>
          )}
        </div>

        {/* Lead Details Panel */}
        <div className="bg-gray-900 rounded-xl p-6 border border-gray-800 h-fit sticky top-24">
          {selectedLead ? (
            <div className="space-y-4">
              <h2 className="text-xl font-bold text-white">{selectedLead.name}</h2>
              
              <div className="space-y-2">
                <div className="flex items-center gap-2 text-gray-400">
                  <Phone size={16} />
                  <a href={`tel:${selectedLead.phone}`} className="hover:text-white">
                    {selectedLead.phone}
                  </a>
                </div>
                {selectedLead.email && (
                  <div className="flex items-center gap-2 text-gray-400">
                    <Mail size={16} />
                    <a href={`mailto:${selectedLead.email}`} className="hover:text-white">
                      {selectedLead.email}
                    </a>
                  </div>
                )}
                <div className="flex items-center gap-2 text-gray-400">
                  <MapPin size={16} />
                  <span>{selectedLead.city}, {selectedLead.state}</span>
                </div>
                <div className="flex items-center gap-2 text-gray-400">
                  <Calendar size={16} />
                  <span>{new Date(selectedLead.created_at).toLocaleDateString()}</span>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Update Status</label>
                <select
                  value={selectedLead.status}
                  onChange={(e) => {
                    updateLeadStatus(selectedLead.id, e.target.value as Lead['status']);
                    setSelectedLead({ ...selectedLead, status: e.target.value as Lead['status'] });
                  }}
                  className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white focus:outline-none focus:border-red-500"
                >
                  <option value="new">New</option>
                  <option value="contacted">Contacted</option>
                  <option value="follow_up">Follow Up</option>
                  <option value="converted">Converted</option>
                  <option value="lost">Lost</option>
                </select>
              </div>

              <div className="flex gap-2">
                <a
                  href={`tel:${selectedLead.phone}`}
                  className="flex-1 bg-red-600 hover:bg-red-700 text-white py-2 rounded-lg text-center transition-colors"
                >
                  Call
                </a>
                <a
                  href={`https://wa.me/${selectedLead.phone.replace(/\D/g, '')}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex-1 bg-green-600 hover:bg-green-700 text-white py-2 rounded-lg text-center transition-colors"
                >
                  WhatsApp
                </a>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Add Note</label>
                <textarea
                  value={note}
                  onChange={(e) => setNote(e.target.value)}
                  rows={3}
                  className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white focus:outline-none focus:border-red-500"
                  placeholder="Add a note..."
                />
                <button
                  onClick={addNote}
                  className="mt-2 bg-gray-700 hover:bg-gray-600 text-white px-4 py-2 rounded-lg text-sm transition-colors"
                >
                  Save Note
                </button>
              </div>

              {selectedLead.notes && (
                <div>
                  <h4 className="text-sm font-medium text-gray-300 mb-2 flex items-center gap-2">
                    <MessageSquare size={16} />
                    Notes
                  </h4>
                  <div className="bg-gray-800/50 rounded-lg p-3 text-sm text-gray-300 whitespace-pre-wrap max-h-40 overflow-y-auto">
                    {selectedLead.notes}
                  </div>
                </div>
              )}
            </div>
          ) : (
            <div className="text-center py-8">
              <p className="text-gray-400">Select a lead to view details</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
