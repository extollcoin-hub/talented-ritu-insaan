import { useEffect, useState } from 'react';
import { supabase } from '../../lib/supabase';
import { TrendingUp, Users, CheckCircle, XCircle } from 'lucide-react';

interface AnalyticsData {
  totalLeads: number;
  convertedLeads: number;
  lostLeads: number;
  conversionRate: number;
  leadsByStatus: Record<string, number>;
  leadsBySource: Record<string, number>;
  leadsByCourse: Record<string, number>;
  monthlyLeads: { month: string; count: number }[];
}

export function AdminAnalytics() {
  const [analytics, setAnalytics] = useState<AnalyticsData>({
    totalLeads: 0,
    convertedLeads: 0,
    lostLeads: 0,
    conversionRate: 0,
    leadsByStatus: {},
    leadsBySource: {},
    leadsByCourse: {},
    monthlyLeads: [],
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchAnalytics();
  }, []);

  async function fetchAnalytics() {
    try {
      const { data: leads, error } = await supabase
        .from('leads')
        .select('*');

      if (error) throw error;

      const totalLeads = leads?.length || 0;
      const convertedLeads = leads?.filter(l => l.status === 'converted').length || 0;
      const lostLeads = leads?.filter(l => l.status === 'lost').length || 0;
      const conversionRate = totalLeads > 0 ? (convertedLeads / totalLeads) * 100 : 0;

      const leadsByStatus: Record<string, number> = {};
      const leadsBySource: Record<string, number> = {};
      const leadsByCourse: Record<string, number> = {};

      leads?.forEach(lead => {
        leadsByStatus[lead.status] = (leadsByStatus[lead.status] || 0) + 1;
        leadsBySource[lead.source] = (leadsBySource[lead.source] || 0) + 1;
        if (lead.course_interest) {
          leadsByCourse[lead.course_interest] = (leadsByCourse[lead.course_interest] || 0) + 1;
        }
      });

      const monthlyLeads = leads?.reduce((acc: { month: string; count: number }[], lead) => {
        const month = new Date(lead.created_at).toLocaleString('default', { month: 'short', year: 'numeric' });
        const existing = acc.find(m => m.month === month);
        if (existing) {
          existing.count++;
        } else {
          acc.push({ month, count: 1 });
        }
        return acc;
      }, []) || [];

      setAnalytics({
        totalLeads,
        convertedLeads,
        lostLeads,
        conversionRate,
        leadsByStatus,
        leadsBySource,
        leadsByCourse,
        monthlyLeads,
      });
    } catch (error) {
      console.error('Error fetching analytics:', error);
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
      <h1 className="text-2xl font-bold text-white">Analytics</h1>

      {/* Key Metrics */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-gray-900 rounded-xl p-6 border border-gray-800">
          <div className="flex items-center justify-between mb-4">
            <div className="w-10 h-10 bg-blue-600/20 rounded-lg flex items-center justify-center">
              <Users className="w-5 h-5 text-blue-500" />
            </div>
          </div>
          <h3 className="text-gray-400 text-sm mb-1">Total Leads</h3>
          <p className="text-2xl font-bold text-white">{analytics.totalLeads}</p>
        </div>

        <div className="bg-gray-900 rounded-xl p-6 border border-gray-800">
          <div className="flex items-center justify-between mb-4">
            <div className="w-10 h-10 bg-green-600/20 rounded-lg flex items-center justify-center">
              <CheckCircle className="w-5 h-5 text-green-500" />
            </div>
          </div>
          <h3 className="text-gray-400 text-sm mb-1">Converted</h3>
          <p className="text-2xl font-bold text-white">{analytics.convertedLeads}</p>
        </div>

        <div className="bg-gray-900 rounded-xl p-6 border border-gray-800">
          <div className="flex items-center justify-between mb-4">
            <div className="w-10 h-10 bg-red-600/20 rounded-lg flex items-center justify-center">
              <XCircle className="w-5 h-5 text-red-500" />
            </div>
          </div>
          <h3 className="text-gray-400 text-sm mb-1">Lost</h3>
          <p className="text-2xl font-bold text-white">{analytics.lostLeads}</p>
        </div>

        <div className="bg-gray-900 rounded-xl p-6 border border-gray-800">
          <div className="flex items-center justify-between mb-4">
            <div className="w-10 h-10 bg-yellow-600/20 rounded-lg flex items-center justify-center">
              <TrendingUp className="w-5 h-5 text-yellow-500" />
            </div>
          </div>
          <h3 className="text-gray-400 text-sm mb-1">Conversion Rate</h3>
          <p className="text-2xl font-bold text-white">{analytics.conversionRate.toFixed(1)}%</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Leads by Status */}
        <div className="bg-gray-900 rounded-xl p-6 border border-gray-800">
          <h2 className="text-lg font-semibold text-white mb-4">Leads by Status</h2>
          <div className="space-y-3">
            {Object.entries(analytics.leadsByStatus).map(([status, count]) => {
              const percentage = (count / analytics.totalLeads) * 100;
              return (
                <div key={status}>
                  <div className="flex justify-between text-sm mb-1">
                    <span className="text-gray-400 capitalize">{status.replace('_', ' ')}</span>
                    <span className="text-white">{count}</span>
                  </div>
                  <div className="h-2 bg-gray-800 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-red-600 rounded-full"
                      style={{ width: `${percentage}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Leads by Source */}
        <div className="bg-gray-900 rounded-xl p-6 border border-gray-800">
          <h2 className="text-lg font-semibold text-white mb-4">Leads by Source</h2>
          <div className="space-y-3">
            {Object.entries(analytics.leadsBySource).map(([source, count]) => {
              const percentage = (count / analytics.totalLeads) * 100;
              return (
                <div key={source}>
                  <div className="flex justify-between text-sm mb-1">
                    <span className="text-gray-400 capitalize">{source}</span>
                    <span className="text-white">{count}</span>
                  </div>
                  <div className="h-2 bg-gray-800 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-blue-600 rounded-full"
                      style={{ width: `${percentage}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Leads by Course */}
        <div className="bg-gray-900 rounded-xl p-6 border border-gray-800 lg:col-span-2">
          <h2 className="text-lg font-semibold text-white mb-4">Leads by Course Interest</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {Object.entries(analytics.leadsByCourse).map(([course, count]) => (
              <div key={course} className="bg-gray-800/50 rounded-lg p-4">
                <p className="text-white font-medium mb-1">{course}</p>
                <p className="text-2xl font-bold text-red-400">{count}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
