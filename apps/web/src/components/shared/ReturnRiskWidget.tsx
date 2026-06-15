import React, { useState, useEffect } from 'react';
import { AlertTriangle, ShieldCheck, Info, Loader2 } from 'lucide-react';
import { getReturnRiskPrediction } from '@/app/actions/predictReturnRisk';

interface ReturnRiskWidgetProps {
  product: any;
  reviews: any[];
  price: number;
}

export function ReturnRiskWidget({ product, reviews, price }: ReturnRiskWidgetProps) {
  const [riskData, setRiskData] = useState<{ riskScore: number, riskLevel: string, reason: string } | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function fetchRisk() {
      try {
        const result = await getReturnRiskPrediction(product, reviews, price);
        setRiskData(result);
      } catch (e) {
        console.error(e);
      } finally {
        setIsLoading(false);
      }
    }
    
    fetchRisk();
  }, [product, reviews, price]);

  if (isLoading) {
    return (
      <div className="mt-3 border border-gray-200 bg-gray-50 rounded-none p-3 shadow-sm flex items-center justify-center h-20 animate-pulse">
        <Loader2 className="w-6 h-6 text-gray-400 animate-spin" />
        <span className="ml-2 text-sm text-gray-500">AI analyzing return risk...</span>
      </div>
    );
  }

  if (!riskData) return null;

  const { riskScore, riskLevel, reason } = riskData;

  // Styling based on risk level
  const styles = {
    LOW: {
      bg: 'bg-[#eef8ef]',
      border: 'border-[#007600]',
      text: 'text-[#007600]',
      icon: <ShieldCheck className="w-5 h-5 text-[#007600]" />,
      label: 'Low Return Risk'
    },
    MEDIUM: {
      bg: 'bg-[#fff4e6]',
      border: 'border-[#ff9900]',
      text: 'text-[#c45500]',
      icon: <Info className="w-5 h-5 text-[#c45500]" />,
      label: 'Moderate Return Risk'
    },
    HIGH: {
      bg: 'bg-[#fdf2f4]',
      border: 'border-[#cc0c39]',
      text: 'text-[#cc0c39]',
      icon: <AlertTriangle className="w-5 h-5 text-[#cc0c39]" />,
      label: 'High Return Risk'
    },
    UNKNOWN: {
      bg: 'bg-[#f0f2f2]',
      border: 'border-[#d5d9d9]',
      text: 'text-[#565959]',
      icon: <Info className="w-5 h-5 text-[#565959]" />,
      label: 'Unknown Return Risk'
    }
  }[riskLevel as 'LOW' | 'MEDIUM' | 'HIGH' | 'UNKNOWN'] || {
    bg: 'bg-[#f0f2f2]',
    border: 'border-[#d5d9d9]',
    text: 'text-[#565959]',
    icon: <Info className="w-5 h-5 text-[#565959]" />,
    label: 'Unknown Return Risk'
  };

  return (
    <div className={`mt-3 border ${styles.border} ${styles.bg} rounded-none p-3 shadow-sm`}>
      <div className="flex items-start gap-2">
        <div className="mt-0.5">{styles.icon}</div>
        <div className="flex-1">
          <div className="flex justify-between items-center mb-1">
            <span className={`font-bold text-[14px] ${styles.text}`}>{styles.label}</span>
            {riskLevel !== 'UNKNOWN' && (
              <span className={`font-black text-[16px] ${styles.text}`}>{riskScore}%</span>
            )}
          </div>
          <p className="text-[12px] text-[#0f1111] leading-tight">
            <strong>AI Prediction:</strong> {reason}
          </p>
        </div>
      </div>
    </div>
  );
}
