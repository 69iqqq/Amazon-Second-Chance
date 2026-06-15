'use client';

import { useState } from 'react';
import { redeemGreenCredits } from '@/app/actions/secondLifeActions';
import { useRouter } from 'next/navigation';

export function RedeemButton({ amount, reason, disabled, className = '' }: { amount: number, reason: string, disabled?: boolean, className?: string }) {
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleRedeem = async () => {
    setLoading(true);
    try {
      await redeemGreenCredits(amount, reason);
      router.refresh();
      alert(`Success! We've sent the details for "${reason}" to your registered email address.`);
    } catch (e: any) {
      alert(e.message || "Failed to redeem. Insufficient balance.");
    }
    setLoading(false);
  }

  return (
    <button 
      onClick={handleRedeem}
      disabled={loading || disabled}
      className={`px-4 py-2 rounded-full text-sm font-medium transition ${
        disabled 
          ? 'bg-gray-200 text-gray-500 cursor-not-allowed border border-gray-300'
          : 'bg-[#FFD814] hover:bg-[#F7CA00] border border-[#FCD200] text-[#0f1111] shadow-sm'
      } ${className}`}
    >
      {loading ? "Redeeming..." : `Redeem (${amount} Credits)`}
    </button>
  );
}
