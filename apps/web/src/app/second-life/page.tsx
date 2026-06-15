import { AmazonNavbar } from '@/components/shared/AmazonNavbar';
import { AmazonFooter } from '@/components/shared/AmazonFooter';
import Link from 'next/link';

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-white flex flex-col">
      <AmazonNavbar forceSecondLife />
      
      <main className="w-full flex flex-col items-center overflow-x-hidden flex-1">
        
        {/* second-chance-header: Whole screen width */}
        <section className="w-full">
          <img 
            src="/logos/second-chance-header.png" 
            alt="Second Chance Header" 
            className="w-full h-auto object-contain block"
          />
        </section>

        {/* decision-flow: Whole screen width */}
        <section className="w-full mb-8 lg:mb-12 relative group">
          <style>{`
            @keyframes flow-glow {
              0% { top: 20%; left: 15%; opacity: 0; transform: scale(0.5); }
              10% { opacity: 1; transform: scale(1); }
              50% { top: 50%; left: 50%; transform: scale(1.2); }
              90% { top: 75%; left: 85%; opacity: 1; transform: scale(1); }
              100% { top: 75%; left: 85%; opacity: 0; transform: scale(0.5); }
            }
            .glittery-circle {
              position: absolute;
              width: 12px;
              height: 12px;
              background-color: #fff;
              border-radius: 50%;
              box-shadow: 0 0 12px 6px rgba(255, 255, 255, 0.8), 0 0 24px 10px rgba(255, 153, 0, 0.6);
              animation: flow-glow 4s infinite ease-in-out;
              pointer-events: none;
              z-index: 20;
            }
          `}</style>

          <img 
            src="/logos/dicision-flow.png" 
            alt="Decision Flow" 
            className="w-full h-auto object-contain block"
          />
          <div className="glittery-circle"></div>
        </section>

        {/* ai-certi: bounded to 1440px */}
        <section className="w-full max-w-[1440px] px-4 md:px-0 mb-8 lg:mb-12">
          <img 
            src="/logos/ai-certi.png" 
            alt="AI Certification" 
            className="w-full h-auto object-contain block mx-auto"
          />
        </section>

        {/* catalogue: Made smaller */}
        <section className="w-[85%] sm:w-[70%] max-w-[800px] mb-8 lg:mb-12 cursor-pointer hover:opacity-90 transition">
          <Link href="/second-life/buy">
            <img 
              src="/logos/catalogue.png" 
              alt="Catalogue" 
              className="w-full h-auto object-contain block mx-auto rounded-lg shadow-sm"
            />
          </Link>
        </section>

        {/* why-us: bounded to 1440px */}
        <section className="w-full max-w-[1440px] px-4 md:px-0 mb-10 lg:mb-16">
          <img 
            src="/logos/why-us.png" 
            alt="Why Us" 
            className="w-full h-auto object-contain block mx-auto"
          />
        </section>

        {/* ──────────────────────────────────────────────────────────────── */}
        {/* BECOME A PARTNER SECTION */}
        {/* ──────────────────────────────────────────────────────────────── */}
        <section className="w-full bg-[#EAEDED] py-12 lg:py-16">
          <div className="max-w-[1200px] mx-auto px-4">

            {/* Section heading */}
            <div className="text-center mb-10">
              <h2 className="text-[28px] md:text-[32px] font-bold text-[#0F1111] leading-tight mb-2">
                Become a Partner
              </h2>
              <p className="text-[15px] text-[#565959] max-w-2xl mx-auto">
                Join Amazon 2nd Chance&apos;s partner network. Sell refurbished products, accept returns at your Kirana store, or receive donations for your NGO.
              </p>
            </div>

            {/* Partner Cards — matching screenshot aesthetic */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">

              {/* Seller Card */}
              <div className="bg-white rounded-xl p-8 flex flex-col shadow-[0_4px_20px_rgba(0,0,0,0.06)] border border-gray-50 h-full">
                <h3 className="text-[22px] font-extrabold text-[#000033] mb-4 leading-tight">
                  Register as a Seller
                </h3>
                <div className="w-full h-[2px] bg-[#3B5BDB] mb-6"></div>
                <p className="text-[15px] text-[#4A4A4A] leading-relaxed mb-8 flex-1">
                  List your refurbished and pre-owned products on Amazon 2nd Chance. 
                  Access AI pricing tools, earn Green Credits, and reach millions of 
                  customers with the Amazon Certified Refurbished badge.
                </p>
                <Link 
                  href="/second-life/partner" 
                  className="text-[16px] font-bold text-[#E46011] hover:text-[#C7511F] flex items-center gap-1 group/link mt-auto"
                >
                  Learn more <span className="group-hover/link:translate-x-1 transition-transform text-[18px] leading-none mb-[2px]">›</span>
                </Link>
              </div>

              {/* Kirana Hub Card */}
              <div className="bg-white rounded-xl p-8 flex flex-col shadow-[0_4px_20px_rgba(0,0,0,0.06)] border border-gray-50 h-full">
                <h3 className="text-[22px] font-extrabold text-[#000033] mb-4 leading-tight">
                  Become a Kirana Hub
                </h3>
                <div className="w-full h-[2px] bg-[#3B5BDB] mb-6"></div>
                <p className="text-[15px] text-[#4A4A4A] leading-relaxed mb-8 flex-1">
                  Turn your store into an Amazon-powered return and pickup centre. 
                  Accept customer drop-offs, verify product conditions, and earn 
                  ₹40–₹120 commission per return handled.
                </p>
                <Link 
                  href="/second-life/partner" 
                  className="text-[16px] font-bold text-[#E46011] hover:text-[#C7511F] flex items-center gap-1 group/link mt-auto"
                >
                  Learn more <span className="group-hover/link:translate-x-1 transition-transform text-[18px] leading-none mb-[2px]">›</span>
                </Link>
              </div>

              {/* NGO Card */}
              <div className="bg-white rounded-xl p-8 flex flex-col shadow-[0_4px_20px_rgba(0,0,0,0.06)] border border-gray-50 h-full">
                <h3 className="text-[22px] font-extrabold text-[#000033] mb-4 leading-tight">
                  Partner as an NGO
                </h3>
                <div className="w-full h-[2px] bg-[#3B5BDB] mb-6"></div>
                <p className="text-[15px] text-[#4A4A4A] leading-relaxed mb-8 flex-1">
                  Receive AI-routed donated products that match your organisation&apos;s 
                  needs registry. Free delivery, digital donation certificates, 
                  and an impact dashboard to track families helped.
                </p>
                <Link 
                  href="/second-life/partner" 
                  className="text-[16px] font-bold text-[#E46011] hover:text-[#C7511F] flex items-center gap-1 group/link mt-auto"
                >
                  Learn more <span className="group-hover/link:translate-x-1 transition-transform text-[18px] leading-none mb-[2px]">›</span>
                </Link>
              </div>
            </div>

            {/* Full-width CTA banner */}
            <div className="bg-white border border-[#D5D9D9] rounded-xl overflow-hidden flex flex-col md:flex-row items-center">
              <div className="flex-1 p-6 md:p-8">
                <p className="text-[11px] font-bold text-[#c45500] uppercase tracking-widest mb-2">Partner Programme</p>
                <h3 className="text-[22px] font-bold text-[#0F1111] leading-tight mb-2">
                  Ready to make an impact?
                </h3>
                <p className="text-[14px] text-[#565959] mb-5 max-w-lg">
                  Registration is free and takes less than 2 minutes. Choose your partner type and start contributing to the circular economy today.
                </p>
                <Link
                  href="/second-life/partner"
                  className="inline-block py-2.5 px-8 bg-[#FFD814] border border-[#FCD200] hover:bg-[#F7CA00] font-medium rounded-[8px] text-[14px] transition shadow-sm"
                >
                  Register now — it&apos;s free
                </Link>
              </div>
              <div className="hidden md:flex w-[300px] bg-[#232F3E] h-full min-h-[200px] items-center justify-center p-8">
                <div className="text-center">
                  <p className="text-[#FF9900] text-[48px] font-black leading-none mb-1">0</p>
                  <p className="text-white text-[13px] font-bold">Registration Fee</p>
                  <div className="w-8 h-[2px] bg-[#FF9900] mx-auto my-3 rounded-full"></div>
                  <p className="text-[#FF9900] text-[48px] font-black leading-none mb-1">2</p>
                  <p className="text-white text-[13px] font-bold">Minutes to Sign Up</p>
                </div>
              </div>
            </div>

          </div>
        </section>

      </main>

      <AmazonFooter />
    </div>
  );
}
