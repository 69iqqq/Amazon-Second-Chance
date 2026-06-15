import { getGreenCreditWallet } from '@/app/actions/secondLifeActions';
import Link from 'next/link';
import { ChevronRight } from 'lucide-react';
import { GiftCardClient } from '@/components/shared/GiftCardClient';

export default async function GiftCardPDP({ searchParams }: { searchParams: Promise<{ type?: string, amount?: string }> }) {
  const params = await searchParams;
  const wallet = await getGreenCreditWallet();
  const balance = wallet?.balance || 0;
  
  const type = params.type || 'amazon-pay';
  let defaultAmount = params.amount || '500';
  if (defaultAmount === '1000') defaultAmount = '1,000';
  if (defaultAmount === '2000') defaultAmount = '2,000';
  if (defaultAmount === '5000') defaultAmount = '5,000';
  if (defaultAmount === '10000') defaultAmount = '10,000';

  const isPrime = type === 'prime';
  const title = isPrime ? 'Amazon Prime Subscription - Digital' : 'Amazon Pay Customizable eGift Card';
  
  const images = isPrime 
    ? [{ src: '/rewards/prime_reward_card_1781425848169.png', name: 'Prime Standard' }]
    : [
        { src: '/rewards/gc_amazon_orange_1781426709019.png', name: 'a for Amazon (Orange)' },
        { src: '/rewards/gc_amazon_black_1781426720935.png', name: 'a for Amazon (Black)' },
        { src: '/rewards/gc_birthday_balloons_1781426734403.png', name: 'Happy Birthday Balloons' },
        { src: '/rewards/gc_diwali_1781426786839.png', name: 'Diwali Lights' },
        { src: '/rewards/gc_wedding_1781426747880.png', name: 'Wedding Rings' },
        { src: '/rewards/gc_thank_you_1781426761359.png', name: 'Thank You Floral' },
        { src: '/rewards/gc_congratulations_1781426773237.png', name: 'Congratulations' },
        { src: '/rewards/gc_new_year_1781426800195.png', name: 'New Year Fireworks' }
      ];

  return (
    <div className="max-w-[1500px] mx-auto pb-20 pt-4 px-4 bg-white min-h-screen">
      
      {/* Breadcrumb */}
      <div className="flex items-center text-sm text-[#565959] mb-4">
        <Link href="/customer/credits" className="hover:underline">Green Credits Rewards</Link>
        <ChevronRight className="w-4 h-4 mx-1" />
        <span className="text-[#0f1111] font-bold">{title}</span>
      </div>

      <GiftCardClient 
        initialAmount={defaultAmount}
        balance={balance}
        title={title}
        images={images}
        isPrime={isPrime}
      />
    </div>
  );
}
