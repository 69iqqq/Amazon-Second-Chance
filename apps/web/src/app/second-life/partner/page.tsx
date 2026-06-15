'use client';

import { AmazonNavbar } from '@/components/shared/AmazonNavbar';
import { AmazonFooter } from '@/components/shared/AmazonFooter';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { applyForPartnerRole } from '@/app/actions/partnerActions';
import { useAuth } from '@clerk/nextjs';
import { SignInButton } from '@clerk/nextjs';
import Link from 'next/link';

const PARTNER_TYPES = [
  {
    role: 'SELLER' as const,
    title: 'Start selling on Amazon 2nd Chance',
    description: 'Reach millions of Amazon customers with your refurbished and pre-owned products. Access AI pricing, certifications, and earn Green Credits.',
    icon: '/logos/og-amazon.png',
    benefits: [
      'List refurbished & pre-owned products on Amazon',
      'AI-powered pricing recommendations',
      'Amazon Certified Refurbished badge',
      'Earn Green Credits for every sale',
      'Seller Central dashboard with analytics',
    ],
    cta: 'Register as a Seller',
    portal: '/seller',
    fee: '₹0 — No registration fee',
  },
  {
    role: 'KIRANA_PARTNER' as const,
    title: 'Become a Kirana Hub Partner',
    description: 'Turn your store into an Amazon-powered return and pickup center. Accept customer returns, verify products, and earn commissions.',
    icon: '/logos/og-amazon.png',
    benefits: [
      'Earn ₹40–₹120 per return accepted',
      'Increased foot traffic to your store',
      'Amazon-provided packaging materials',
      'Real-time pickup management dashboard',
      'Priority routing from nearby customers',
    ],
    cta: 'Register as Kirana Hub',
    portal: '/kirana',
    fee: '₹0 — No registration fee',
  },
  {
    role: 'NGO' as const,
    title: 'Partner as a Donation NGO',
    description: 'Receive AI-matched donated products for your beneficiaries. Amazon routes items that fit your needs registry directly to your organization.',
    icon: '/logos/og-amazon.png',
    benefits: [
      'Receive products matched to your needs registry',
      'Free delivery of all donated items',
      'Digital donation certificates for donors',
      'Impact dashboard tracking families helped',
      'Schedule pickups from Kirana Hubs nearby',
    ],
    cta: 'Register as NGO Partner',
    portal: '/ngo',
    fee: '₹0 — Free for verified NGOs',
  },
];

export default function BecomePartnerPage() {
  const { isSignedIn } = useAuth();
  const router = useRouter();
  const [applying, setApplying] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  async function handleApply(role: 'SELLER' | 'KIRANA_PARTNER' | 'NGO', portal: string) {
    setApplying(role);
    setError(null);
    try {
      await applyForPartnerRole(role);
      setSuccess(role);
      setTimeout(() => router.push(portal), 1200);
    } catch (e: any) {
      setError('Something went wrong. Please try again.');
    } finally {
      setApplying(null);
    }
  }

  return (
    <div className="min-h-screen bg-white flex flex-col">
      <AmazonNavbar forceSecondLife />

      {/* Amazon-style breadcrumb header */}
      <div className="bg-white border-b border-[#D5D9D9]">
        <div className="max-w-[1500px] mx-auto px-4 py-3">
          <div className="flex items-center text-[13px] text-[#565959]">
            <Link href="/" className="hover:underline text-[#007185]">Amazon.in</Link>
            <span className="mx-2">&rsaquo;</span>
            <Link href="/second-life" className="hover:underline text-[#007185]">Amazon 2nd Chance</Link>
            <span className="mx-2">&rsaquo;</span>
            <span className="text-[#c45500] font-bold">Become a Partner</span>
          </div>
        </div>
      </div>

      {/* Hero Section — Amazon Seller Central style */}
      <div className="bg-[#232F3E]">
        <div className="max-w-[1200px] mx-auto px-4 py-12 md:py-16 text-center">
          <h1 className="text-[32px] md:text-[40px] font-normal text-white leading-tight mb-4">
            Sell, collect, or receive — <span className="text-[#FF9900] font-bold">grow with Amazon 2nd Chance</span>
          </h1>
          <p className="text-[#ccc] text-[15px] max-w-2xl mx-auto mb-8">
            Join Amazon&apos;s sustainable commerce ecosystem. Whether you&apos;re a seller, a local store, or an NGO — there&apos;s a partner programme built for you.
          </p>
          <div className="flex flex-wrap justify-center gap-6 text-white text-[13px]">
            <div className="flex items-center gap-2">
              <span className="w-8 h-8 rounded-full bg-[#FF9900] flex items-center justify-center font-bold text-[#232F3E] text-[14px]">1</span>
              <span>Choose your type</span>
            </div>
            <span className="text-[#565959] hidden sm:block self-center">→</span>
            <div className="flex items-center gap-2">
              <span className="w-8 h-8 rounded-full bg-[#FF9900] flex items-center justify-center font-bold text-[#232F3E] text-[14px]">2</span>
              <span>Sign in &amp; register</span>
            </div>
            <span className="text-[#565959] hidden sm:block self-center">→</span>
            <div className="flex items-center gap-2">
              <span className="w-8 h-8 rounded-full bg-[#FF9900] flex items-center justify-center font-bold text-[#232F3E] text-[14px]">3</span>
              <span>Access your dashboard</span>
            </div>
          </div>
        </div>
      </div>

      {/* Partner Cards — Amazon product-card style */}
      <div className="flex-1 bg-[#EAEDED]">
        <div className="max-w-[1200px] mx-auto px-4 py-8">

          {error && (
            <div className="mb-4 bg-[#FCF4F4] border border-[#CC0C39] rounded-[4px] p-3 text-[13px] text-[#CC0C39] text-center">
              {error}
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {PARTNER_TYPES.map((p) => (
              <div
                key={p.role}
                className={`bg-white border ${
                  success === p.role ? 'border-[#007600] border-2' : 'border-[#D5D9D9]'
                } rounded-[8px] overflow-hidden flex flex-col shadow-sm hover:shadow-md transition-shadow`}
              >
                {/* Card top accent */}
                <div className="h-1 bg-[#FF9900]" />

                {/* Card content */}
                <div className="p-5 flex-1 flex flex-col">
                  <h2 className="text-[18px] font-bold text-[#0F1111] leading-tight mb-2">{p.title}</h2>
                  <p className="text-[13px] text-[#565959] mb-4 leading-relaxed">{p.description}</p>

                  <div className="border-t border-[#EAEDED] pt-4 mb-4">
                    <p className="text-[12px] font-bold text-[#565959] uppercase tracking-wider mb-3">Benefits</p>
                    <ul className="space-y-2">
                      {p.benefits.map((b, i) => (
                        <li key={i} className="flex items-start gap-2 text-[13px] text-[#0F1111]">
                          <span className="text-[#007600] font-bold mt-px shrink-0">✓</span>
                          <span>{b}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div className="mt-auto pt-4 border-t border-[#EAEDED]">
                    <p className="text-[12px] text-[#007600] font-bold mb-3">{p.fee}</p>

                    {success === p.role ? (
                      <div className="w-full py-2.5 bg-[#067D62] text-white font-bold rounded-[8px] text-[14px] text-center">
                        ✓ Registered! Redirecting…
                      </div>
                    ) : !isSignedIn ? (
                      <SignInButton mode="modal">
                        <button className="w-full py-2.5 bg-[#FFD814] border border-[#FCD200] hover:bg-[#F7CA00] font-medium rounded-[8px] text-[13px] transition shadow-sm cursor-pointer">
                          Sign in to {p.cta.toLowerCase()}
                        </button>
                      </SignInButton>
                    ) : (
                      <button
                        disabled={!!applying}
                        onClick={() => handleApply(p.role, p.portal)}
                        className="w-full py-2.5 bg-[#FFD814] border border-[#FCD200] hover:bg-[#F7CA00] font-medium rounded-[8px] text-[13px] transition shadow-sm disabled:opacity-50 disabled:cursor-wait cursor-pointer"
                      >
                        {applying === p.role ? 'Registering…' : p.cta}
                      </button>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Info strip */}
          <div className="mt-6 bg-white border border-[#D5D9D9] rounded-[8px] p-4 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
            <p className="text-[13px] text-[#0F1111]">
              <strong>Already an Amazon customer?</strong> Your default dashboard is the{' '}
              <Link href="/customer" className="text-[#007185] hover:underline hover:text-[#C7511F]">
                Customer Portal
              </Link>
              . Admin access is internal only.
            </p>
            <Link
              href="/customer"
              className="shrink-0 text-center py-1.5 px-5 border border-[#D5D9D9] rounded-[8px] text-[13px] font-medium hover:bg-[#f7fafa] transition shadow-sm"
            >
              Go to Customer Dashboard
            </Link>
          </div>
        </div>
      </div>

      <AmazonFooter />
    </div>
  );
}
