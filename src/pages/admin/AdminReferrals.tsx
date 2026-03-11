import { useEffect, useState } from 'react';
import { supabase, type Referral } from '../../lib/supabase';
import { Search, Gift, CheckCircle, Clock } from 'lucide-react';

export function AdminReferrals() {
  const [referrals, setReferrals] = useState<Referral[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    fetchReferrals();
  }, []);

  async function fetchReferrals() {
    try {
      const { data, error } = await supabase
        .from('referrals')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setReferrals(data as Referral[]);
    } catch (error) {
      console.error('Error fetching referrals:', error);
    } finally {
      setLoading(false);
    }
  }

  async function updateStatus(id: string, status: Referral['status']) {
    try {
      const { error } = await supabase
        .from('referrals')
        .update({ status })
        .eq('id', id);

      if (error) throw error;
      fetchReferrals();
    } catch (error) {
      console.error('Error updating referral:', error);
    }
  }

  const filteredReferrals = referrals.filter(ref =>
    ref.referrer_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    ref.referrer_phone.includes(searchTerm) ||
    ref.referee_name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const statusColors: Record<Referral['status'], string> = {
    pending: 'bg-yellow-600/20 text-yellow-400',
    verified: 'bg-blue-600/20 text-blue-400',
    rewarded: 'bg-green-600/20 text-green-400',
  };

  const statusIcons: Record<Referral['status'], typeof Clock> = {
    pending: Clock,
    verified: CheckCircle,
    rewarded: Gift,
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
        <h1 className="text-2xl font-bold text-white">Referrals</h1>
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
          <input
            type="text"
            placeholder="Search referrals..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10 pr-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white focus:outline-none focus:border-red-500 w-64"
          />
        </div>
      </div>

      <div className="bg-gray-900 rounded-xl border border-gray-800 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-gray-800/50">
                <th className="text-left text-gray-400 text-sm font-medium py-4 px-6">Referrer</th>
                <th className="text-left text-gray-400 text-sm font-medium py-4 px-6">Referee</th>
                <th className="text-left text-gray-400 text-sm font-medium py-4 px-6">Course</th>
                <th className="text-left text-gray-400 text-sm font-medium py-4 px-6">Reward</th>
                <th className="text-left text-gray-400 text-sm font-medium py-4 px-6">Status</th>
                <th className="text-left text-gray-400 text-sm font-medium py-4 px-6">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredReferrals.map((referral) => {
                const StatusIcon = statusIcons[referral.status];
                return (
                  <tr key={referral.id} className="border-t border-gray-800">
                    <td className="py-4 px-6">
                      <div>
                        <p className="text-white font-medium">{referral.referrer_name}</p>
                        <p className="text-gray-500 text-sm">{referral.referrer_phone}</p>
                      </div>
                    </td>
                    <td className="py-4 px-6">
                      <div>
                        <p className="text-white">{referral.referee_name}</p>
                        <p className="text-gray-500 text-sm">{referral.referee_phone}</p>
                      </div>
                    </td>
                    <td className="py-4 px-6 text-gray-400">
                      {referral.course_name || '-'}
                    </td>
                    <td className="py-4 px-6 text-white">
                      ₹{referral.reward_amount}
                    </td>
                    <td className="py-4 px-6">
                      <span className={`flex items-center gap-1 px-2 py-1 rounded text-sm w-fit ${statusColors[referral.status]}`}>
                        <StatusIcon size={14} />
                        {referral.status.charAt(0).toUpperCase() + referral.status.slice(1)}
                      </span>
                    </td>
                    <td className="py-4 px-6">
                      <select
                        value={referral.status}
                        onChange={(e) => updateStatus(referral.id, e.target.value as Referral['status'])}
                        className="px-3 py-1 bg-gray-800 border border-gray-700 rounded text-white text-sm focus:outline-none focus:border-red-500"
                      >
                        <option value="pending">Pending</option>
                        <option value="verified">Verified</option>
                        <option value="rewarded">Rewarded</option>
                      </select>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {filteredReferrals.length === 0 && (
          <div className="text-center py-12">
            <p className="text-gray-400">No referrals found</p>
          </div>
        )}
      </div>
    </div>
  );
}
