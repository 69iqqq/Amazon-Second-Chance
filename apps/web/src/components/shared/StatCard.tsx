import { LucideIcon } from 'lucide-react';
import { cn } from '@/lib/utils';

interface StatCardProps {
  title: string;
  value: string | number;
  trend?: string;
  trendUp?: boolean;
  icon?: LucideIcon;
  imageSrc?: string;
  iconBgColor?: string;
  iconColor?: string;
}

export function StatCard({ 
  title, 
  value, 
  trend, 
  trendUp = true, 
  icon: Icon,
  imageSrc,
  iconBgColor = 'bg-amber-50 border-amber-100',
  iconColor = 'text-amber-600'
}: StatCardProps) {
  return (
    <div className="bg-white rounded-none shadow-md p-5 flex items-center justify-between">
      <div className="space-y-1">
        <p className="text-xs font-semibold text-gray-500">{title}</p>
        <p className="text-3xl font-black text-slate-900 tracking-tight">{value}</p>
        {trend && (
          <p className={cn("text-[10px] font-bold flex items-center gap-1", trendUp ? "text-emerald-600" : "text-red-500")}>
            {trendUp ? '↑' : '↓'} {trend} <span className="text-gray-400 font-normal">from last 30 days</span>
          </p>
        )}
      </div>
      <div className={cn("w-12 h-12 rounded-none flex items-center justify-center overflow-hidden", iconBgColor, iconColor, imageSrc && "border-none bg-transparent")}>
        {imageSrc ? (
          <img src={imageSrc} alt={title} className="w-12 h-12 object-contain drop-shadow-sm" />
        ) : Icon ? (
          <Icon className="w-6 h-6" />
        ) : null}
      </div>
    </div>
  );
}
