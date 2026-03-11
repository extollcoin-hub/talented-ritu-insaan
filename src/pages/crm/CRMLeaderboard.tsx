import { useEffect, useState } from 'react';
import { supabase } from '../../lib/supabase';
import { Trophy, Medal, Award } from 'lucide-react';

interface LeaderboardEntry {
  id: string;
  name: string;
  conversions: number;
  totalLeads: number;
  conversionRate: number;
}

export function CRMLeaderboard() {
  const [leaderboard, setLeaderboard] = useState<LeaderboardEntry[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchLeaderboard();
  }, []);

  async function fetchLeaderboard() {
    try {
      const { data: employees, error: empError } = await supabase
        .from('employees')
        .select('id, name')
        .in('role', ['calls', 'manager']);

      if (empError) throw empError;

      const { data: leads, error: leadsError } = await supabase
        .from('leads')
        .select('assigned_to, status');

      if (leadsError) throw leadsError;

      const stats: Record<string, { conversions: number; total: number }> = {};
      
      leads?.forEach(lead => {
        if (!lead.assigned_to) return;
        if (!stats[lead.assigned_to]) {
          stats[lead.assigned_to] = { conversions: 0, total: 0 };
        }
        stats[lead.assigned_to].total++;
        if (lead.status === 'converted') {
          stats[lead.assigned_to].conversions++;
        }
      });

      const leaderboardData: LeaderboardEntry[] = (employees || [])
        .map(emp => ({
          id: emp.id,
          name: emp.name,
          conversions: stats[emp.id]?.conversions || 0,
          totalLeads: stats[emp.id]?.total || 0,
          conversionRate: stats[emp.id]?.total 
            ? (stats[emp.id].conversions / stats[emp.id].total) * 100 
            : 0,
        }))
        .sort((a, b) => b.conversions - a.conversions);

      setLeaderboard(leaderboardData);
    } catch (error) {
      console.error('Error fetching leaderboard:', error);
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
      <h1 className="text-2xl font-bold text-white">Leaderboard</h1>

      {/* Top 3 */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {leaderboard.slice(0, 3).map((entry, index) => (
          <div
            key={entry.id}
            className={`bg-gray-900 rounded-xl p-6 border ${
              index === 0 ? 'border-yellow-500' : index === 1 ? 'border-gray-400' : 'border-amber-700'
            }`}
          >
            <div className="flex items-center justify-between mb-4">
              {index === 0 ? (
                <Trophy className="w-8 h-8 text-yellow-500" />
              ) : index === 1 ? (
                <Medal className="w-8 h-8 text-gray-400" />
              ) : (
                <Award className="w-8 h-8 text-amber-700" />
              )}
              <span className="text-4xl font-bold text-white">#{index + 1}</span>
            </div>
            <h3 className="text-xl font-semibold text-white mb-2">{entry.name}</h3>
            <div className="space-y-1">
              <p className="text-green-400 font-bold text-2xl">{entry.conversions} Conversions</p>
              <p className="text-gray-400 text-sm">{entry.totalLeads} Total Leads</p>
              <p className="text-gray-400 text-sm">{entry.conversionRate.toFixed(1)}% Rate</p>
            </div>
          </div>
        ))}
      </div>

      {/* Full Leaderboard */}
      <div className="bg-gray-900 rounded-xl border border-gray-800 overflow-hidden">
        <table className="w-full">
          <thead>
            <tr className="bg-gray-800/50">
              <th className="text-left text-gray-400 text-sm font-medium py-4 px-6">Rank</th>
              <th className="text-left text-gray-400 text-sm font-medium py-4 px-6">Name</th>
              <th className="text-left text-gray-400 text-sm font-medium py-4 px-6">Conversions</th>
              <th className="text-left text-gray-400 text-sm font-medium py-4 px-6">Total Leads</th>
              <th className="text-left text-gray-400 text-sm font-medium py-4 px-6">Conversion Rate</th>
            </tr>
          </thead>
          <tbody>
            {leaderboard.map((entry, index) => (
              <tr key={entry.id} className="border-t border-gray-800">
                <td className="py-4 px-6">
                  <span className={`font-bold ${index < 3 ? 'text-yellow-500' : 'text-gray-400'}`}>
                    #{index + 1}
                  </span>
                </td>
                <td className="py-4 px-6 text-white font-medium">{entry.name}</td>
                <td className="py-4 px-6 text-green-400 font-semibold">{entry.conversions}</td>
                <td className="py-4 px-6 text-gray-400">{entry.totalLeads}</td>
                <td className="py-4 px-6">
                  <span className="text-white">{entry.conversionRate.toFixed(1)}%</span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {leaderboard.length === 0 && (
          <div className="text-center py-12">
            <p className="text-gray-400">No data available</p>
          </div>
        )}
      </div>
    </div>
  );
}
