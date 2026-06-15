'use client';

import { StatCard } from '@/components/shared/StatCard';
import { ShieldCheck, BarChart3, Users, Factory, Zap } from 'lucide-react';
import { useGetAdminDashboard } from '@/hooks/api/useAdmin';

export default function AdminDashboard() {
  const { data: dashboard, isLoading } = useGetAdminDashboard();

  return (
    <main className="max-w-[1400px] mx-auto p-8">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">System Admin</h1>
          <p className="text-xs text-gray-500 mt-1">Global ecosystem overview, AI evaluation logs, and partner management.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 mb-8">
        <StatCard title="Total Users" value={isLoading ? '...' : dashboard?.totalUsers || 0} trend="0%" icon={Users} iconBgColor="bg-sky-50" iconColor="text-sky-600" />
        <StatCard title="Total Returns" value={isLoading ? '...' : dashboard?.totalReturns || 0} trend="0%" icon={BarChart3} iconBgColor="bg-slate-50" iconColor="text-slate-600" />
        <StatCard title="Total Listings" value={isLoading ? '...' : dashboard?.totalListings || 0} trend="0%" icon={Factory} iconBgColor="bg-purple-50" iconColor="text-purple-600" />
        <StatCard title="CO₂ Saved" value={isLoading ? '...' : dashboard?.co2Saved || 0} trend="0%" icon={Zap} iconBgColor="bg-emerald-50" iconColor="text-emerald-600" />
      </div>

      <div className="bg-white border border-gray-100 rounded-2xl p-6 shadow-sm mb-8">
        <h3 className="text-lg font-bold text-slate-900 tracking-tight mb-4">Recent AI Dispositions</h3>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="text-gray-400 border-b border-gray-100 uppercase text-[10px] font-bold tracking-wider">
                <th className="pb-3 font-semibold">Evaluation ID</th>
                <th className="pb-3 font-semibold">Product</th>
                <th className="pb-3 font-semibold">Grade</th>
                <th className="pb-3 font-semibold">Confidence</th>
                <th className="pb-3 font-semibold">AI Decision</th>
                <th className="pb-3 font-semibold text-center">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 font-medium text-slate-800">
              {/* Replace with real decisions array from backend API when available */}
              <AiLogRow 
                id="EVAL-88273" 
                product="Samsung Odyssey G7" 
                grade="GRADE_C" 
                confidence={92} 
                decision="REFURBISH" 
              />
              <AiLogRow 
                id="EVAL-88272" 
                product="Apple iPad Air" 
                grade="GRADE_A" 
                confidence={98} 
                decision="RESELL" 
              />
            </tbody>
          </table>
        </div>
      </div>
    </main>
  );
}

function AiLogRow({ id, product, grade, confidence, decision }: any) {
  const getDecisionColor = (d: string) => {
    switch(d) {
      case 'RESELL': return 'bg-emerald-50 text-emerald-600 border-emerald-100';
      case 'REFURBISH': return 'bg-sky-50 text-sky-600 border-sky-100';
      case 'RECYCLE': return 'bg-slate-100 text-slate-600 border-slate-200';
      default: return 'bg-gray-50 text-gray-600';
    }
  };

  return (
    <tr className="hover:bg-slate-50/60 transition-all">
      <td className="py-3.5 font-mono text-gray-500 text-[10px]">{id}</td>
      <td className="py-3.5 font-bold text-slate-900">{product}</td>
      <td className="py-3.5 font-bold text-slate-700">{grade}</td>
      <td className="py-3.5">
        <div className="flex items-center gap-2">
          <div className="w-16 bg-slate-100 h-1.5 rounded-full overflow-hidden">
            <div className={`h-full ${confidence > 90 ? 'bg-emerald-500' : 'bg-amber-500'}`} style={{ width: `${confidence}%` }}></div>
          </div>
          <span className="text-[10px] text-gray-500">{confidence}%</span>
        </div>
      </td>
      <td className="py-3.5">
        <span className={`px-2 py-0.5 border rounded-full font-bold text-[10px] ${getDecisionColor(decision)}`}>
          {decision}
        </span>
      </td>
      <td className="py-3.5 text-center">
        <button className="text-xs font-bold text-[#007185] hover:underline">
          Override
        </button>
      </td>
    </tr>
  );
}
