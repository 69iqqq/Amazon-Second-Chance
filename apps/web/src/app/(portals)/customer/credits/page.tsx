import { getGreenCreditWallet } from '@/app/actions/secondLifeActions';
import Link from 'next/link';
import GreenCreditsClient from './GreenCreditsClient';

const products = [
  {
    id: 'amazon-pay-1000',
    type: 'amazon-pay' as const,
    amount: 1000,
    title: 'Amazon Pay eGift Card',
    image: '/rewards/gc_amazon_orange_1781426709019.png',
    rating: 4.5,
    reviews: '72.2K',
    bestseller: true
  },
  {
    id: 'amazon-pay-500',
    type: 'amazon-pay' as const,
    amount: 500,
    title: 'Amazon Pay eGift Card',
    image: '/rewards/gc_amazon_orange_1781426709019.png',
    rating: 4.5,
    reviews: '32.3K'
  },
  {
    id: 'prime-250',
    type: 'prime' as const,
    amount: 250,
    title: 'Amazon Prime Subscription - 1 Month',
    image: '/rewards/prime_reward_card_1781425848169.png',
    rating: 4.8,
    reviews: '128K'
  },
  {
    id: 'amazon-pay-2000',
    type: 'amazon-pay' as const,
    amount: 2000,
    title: 'Amazon Pay eGift Card',
    image: '/rewards/gc_amazon_orange_1781426709019.png',
    rating: 4.5,
    reviews: '12.1K'
  }
];

export const dynamic = 'force-dynamic';

export default async function GreenCreditsPage() {
  const wallet = await getGreenCreditWallet();
  const balance = wallet?.balance || 0;

  return (
    <div className="max-w-[1500px] mx-auto pb-20 pt-6 px-4">
      
      {/* Header & Balance */}
      <div className="flex flex-col sm:flex-row justify-between items-end border-b border-gray-200 pb-2 mb-6">
        <div>
          <h1 className="text-2xl font-bold text-[#0f1111] mb-1">Amazon 2nd Chance Rewards</h1>
          <p className="text-sm text-[#565959]">Use your Green Credits to purchase Amazon Pay Gift Cards and Prime Subscriptions.</p>
        </div>
        <div className="text-right mt-4 sm:mt-0">
          <div className="text-sm text-[#565959]">Available Balance</div>
          <div className="text-2xl font-bold text-emerald-600">{balance} <span className="text-sm font-normal">GC</span></div>
        </div>
      </div>

      <GreenCreditsClient products={products} balance={balance} />
    </div>
  );
}
