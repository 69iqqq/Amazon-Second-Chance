'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { Camera, ScanBarcode, Cpu, Leaf, AlertCircle, CheckCircle2, Package, Recycle, ArrowRight, Heart } from 'lucide-react';
import { CldUploadWidget } from 'next-cloudinary';
import { AmazonNavbar } from '@/components/shared/AmazonNavbar';
import { getEligiblePastPurchases, createKiranaDropoff, getMatchingNgo } from '@/app/actions/secondLifeActions';

type Step = 'SELECT_ITEM' | 'ASSESS_ITEM' | 'AI_PROCESSING' | 'REVIEW_DISPOSITION' | 'SUCCESS';

export default function SellYourItemFlow() {
  const [step, setStep] = useState<Step>('SELECT_ITEM');
  const [selectedItem, setSelectedItem] = useState<any>(null);
  const [scanProgress, setScanProgress] = useState(0);
  const [pastPurchases, setPastPurchases] = useState<any[]>([]);
  const [aiResult, setAiResult] = useState<any>(null);

  useEffect(() => {
    getEligiblePastPurchases().then(data => {
      setPastPurchases(data);
    });
  }, []);

  const handleSelectItem = (item: any) => {
    setSelectedItem(item);
    setStep('ASSESS_ITEM');
  };

  const handleStartScan = async (imageUrl: string) => {
    setStep('AI_PROCESSING');
    
    // Simulate progress bar while API call happens
    let progress = 0;
    const progressInterval = setInterval(() => {
      progress += Math.random() * 10;
      if (progress > 90) progress = 90;
      setScanProgress(progress);
    }, 300);

    try {
      // Call our real Gemini grading backend
      const res = await fetch(`http://localhost:3001/api/v1/grading/${selectedItem.id}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ imageUrl })
      });
      
      const data = await res.json();
      setAiResult(data);
      
      // Determine disposition based on real grade
      const grade = data.grade || 'GRADE_C';
      let disposition = 'RESALE';
      let expectedCondition = 'Good';
      
      if (grade === 'GRADE_A') expectedCondition = 'Like New';
      else if (grade === 'GRADE_B') expectedCondition = 'Good';
      else if (grade === 'GRADE_C') expectedCondition = 'Fair';
      else if (grade === 'GRADE_D') { expectedCondition = 'Poor'; disposition = 'RECYCLE'; }
      else if (grade === 'GRADE_F') { expectedCondition = 'Damaged'; disposition = 'RECYCLE'; }

      let matchedNGO = null;
      if (disposition === 'RECYCLE' || grade === 'GRADE_C') {
        matchedNGO = await getMatchingNgo(selectedItem.title);
      }

      setSelectedItem({
        ...selectedItem,
        disposition,
        expectedCondition,
        suggestedPrice: selectedItem.originalPrice * (grade === 'GRADE_A' ? 0.8 : 0.6),
        matchedNGO
      });

    } catch (e) {
      console.error("AI Grading failed", e);
      // Fallback
      setSelectedItem({ ...selectedItem, disposition: 'RESALE', expectedCondition: 'Good' });
    } finally {
      clearInterval(progressInterval);
      setScanProgress(100);
      setTimeout(() => setStep('REVIEW_DISPOSITION'), 500);
    }
  };

  return (
    <div className="min-h-screen bg-white text-[#0F1111] font-sans pb-20">
      <AmazonNavbar forceSecondLife />
      <div className="max-w-[1000px] mx-auto px-4 py-4 pt-6">
        
        {/* Breadcrumb Header */}
        <div className="flex items-center text-[13px] text-[#565959] mb-4">
          <Link href="/customer" className="hover:underline text-[#007185]">Your Account</Link> 
          <span className="mx-2 text-[#565959]">&rsaquo;</span> 
          <span className="text-[#c45500] font-bold">List an Item</span>
        </div>

        <h1 className="text-[28px] font-normal text-[#0f1111] mb-6">List an Item on Amazon 2nd Chance</h1>

        {/* STEP 1: SELECT ITEM */}
        {step === 'SELECT_ITEM' && (
          <div className="space-y-6">
            <p className="text-[15px] text-[#0f1111] mb-4">Select an item from your past purchases to assess for resale, donation, or recycling.</p>
            
            <div className="space-y-4">
              {pastPurchases.map((item) => (
                <div key={item.id} className="border border-[#D5D9D9] rounded-[8px] overflow-hidden">
                  <div className="bg-[#f0f2f2] border-b border-[#D5D9D9] p-3 text-[13px] text-[#565959] flex flex-wrap justify-between gap-4">
                    <div className="flex gap-8">
                      <div>
                        <div className="uppercase">Order Placed</div>
                        <div className="text-[#0f1111]">{item.purchasedAt}</div>
                      </div>
                      <div>
                        <div className="uppercase">Original Price</div>
                        <div className="text-[#0f1111]">${item.originalPrice.toFixed(2)}</div>
                      </div>
                    </div>
                  </div>
                  <div className="p-4 bg-white flex flex-col md:flex-row justify-between gap-4">
                    <div className="flex gap-4">
                      <div className="w-[90px] h-[90px] shrink-0 border border-[#D5D9D9] p-1 flex items-center justify-center">
                        <img src={item.image} className="max-h-full max-w-full object-contain" alt={item.title} />
                      </div>
                      <div className="pt-1">
                        <Link href="#" className="text-[#007185] hover:text-[#C7511F] hover:underline text-[15px] font-bold block mb-1">{item.title}</Link>
                        <p className="text-[13px] text-[#565959]">Purchased {item.purchasedAt}</p>
                      </div>
                    </div>
                    <div className="flex flex-col justify-center min-w-[220px]">
                      <button 
                        onClick={() => handleSelectItem(item)}
                        className="w-full bg-[#FFD814] border border-[#FCD200] rounded-[8px] py-1.5 px-3 text-[13px] shadow-sm hover:bg-[#F7CA00] font-medium transition text-center"
                      >
                        Assess this item
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
            
            <div className="border-t border-[#D5D9D9] pt-6 mt-8">
              <h3 className="font-bold text-[15px] mb-2">Item not purchased on Amazon?</h3>
              <p className="text-[13px] text-[#565959] mb-3">You can list items purchased elsewhere using our AI barcode scanner.</p>
              <button className="bg-white border border-[#D5D9D9] rounded-[8px] py-1.5 px-4 text-[13px] shadow-sm hover:bg-[#f7fafa] font-medium transition text-center">
                Scan Barcode manually
              </button>
            </div>
          </div>
        )}

        {/* STEP 2: ASSESS ITEM */}
        {step === 'ASSESS_ITEM' && selectedItem && (
          <div className="bg-white border border-[#D5D9D9] rounded-[8px] p-6 max-w-[600px]">
            <h2 className="text-[21px] font-normal text-[#0f1111] mb-4">Step 1: AI Condition Assessment</h2>
            <div className="flex gap-4 p-4 border border-[#D5D9D9] rounded-[8px] mb-6 bg-[#f7fafa]">
              <div className="w-[60px] h-[60px] shrink-0 bg-white border border-[#D5D9D9] flex items-center justify-center p-1">
                <img src={selectedItem.image} className="max-h-full max-w-full object-contain" alt={selectedItem.title} />
              </div>
              <div>
                <h3 className="font-bold text-[15px] text-[#0f1111] leading-snug">{selectedItem.title}</h3>
                <p className="text-[13px] text-[#565959]">Original Price: ${selectedItem.originalPrice.toFixed(2)}</p>
              </div>
            </div>

            <p className="text-[14px] text-[#0f1111] mb-4">To ensure accurate pricing and listing eligibility, our AI needs to assess the physical condition of your item.</p>
            
            <div className="relative">
              <input 
                type="file" 
                accept="image/*"
                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                onChange={(e) => {
                  const file = e.target.files?.[0];
                  if (file) {
                    const reader = new FileReader();
                    reader.onloadend = () => {
                      const base64String = reader.result as string;
                      setSelectedItem({ ...selectedItem, uploadedImageUrl: base64String });
                      handleStartScan(base64String);
                    };
                    reader.readAsDataURL(file);
                  }
                }}
              />
              <div className="border-2 border-dashed border-[#007185] bg-[#f3f7f4] rounded-[8px] p-8 flex flex-col items-center justify-center text-center cursor-pointer hover:bg-[#e6efeb] transition mb-6 pointer-events-none">
                <Camera className="w-12 h-12 text-[#007185] mb-2" />
                <p className="font-bold text-[15px] text-[#007185]">Upload Real Photo for AI Grading</p>
                <p className="text-[13px] text-[#565959]">Powered by Google Gemini AI</p>
              </div>
            </div>

            <div className="flex justify-between items-center">
              <button onClick={() => setStep('SELECT_ITEM')} className="text-[#007185] hover:text-[#C7511F] hover:underline text-[13px] font-medium z-20 relative">
                &larr; Choose different item
              </button>
            </div>
          </div>
        )}

        {/* STEP 3: AI PROCESSING */}
        {step === 'AI_PROCESSING' && (
          <div className="bg-white border border-[#D5D9D9] rounded-[8px] p-8 max-w-[600px] text-center">
             <div className="relative w-[150px] h-[150px] mx-auto mb-6">
                <div className="absolute inset-0 border-4 border-[#f0f2f2] rounded-full"></div>
                <div className="absolute inset-0 border-4 border-[#007185] rounded-full border-t-transparent animate-spin"></div>
                <div className="absolute inset-0 flex items-center justify-center text-[#007185]">
                   <Cpu className="w-12 h-12" />
                </div>
             </div>
             <h2 className="text-[21px] font-bold text-[#0f1111] mb-2">Amazon AI Engine Analyzing...</h2>
             <p className="text-[14px] text-[#565959] mb-4">Assessing product condition, market demand, and optimal pricing.</p>
             
             <div className="w-full bg-[#f0f2f2] rounded-full h-2.5 mb-2 overflow-hidden">
               <div className="bg-[#007185] h-2.5 transition-all duration-150 ease-out" style={{ width: `${scanProgress}%` }}></div>
             </div>
             <p className="text-[12px] font-bold text-[#007185] uppercase tracking-wider">{scanProgress}% Complete</p>
          </div>
        )}

        {/* STEP 4: REVIEW DISPOSITION */}
        {step === 'REVIEW_DISPOSITION' && selectedItem && (
          <div className="bg-white border border-[#D5D9D9] rounded-[8px] overflow-hidden max-w-[600px]">
            <div className="bg-[#f0f2f2] border-b border-[#D5D9D9] p-4 flex items-center gap-2">
              <Cpu className="w-5 h-5 text-[#007185]" />
              <h2 className="text-[17px] font-bold text-[#0f1111]">AI Assessment Results</h2>
            </div>
            
            <div className="p-6">
              {/* Disposition: RESALE */}
              {selectedItem.disposition === 'RESALE' && (
                <>
                  <div className="flex items-start gap-3 mb-6 bg-emerald-50 border border-emerald-200 p-4 rounded-[8px]">
                    <CheckCircle2 className="w-6 h-6 text-[#007600] shrink-0 mt-0.5" />
                    <div>
                      <h3 className="font-bold text-[15px] text-[#007600]">AI Prediction: Approved for Resale</h3>
                      <p className="text-[13px] text-[#0f1111] mt-1">This item appears to meet Amazon 2nd Chance quality standards. The AI graded the condition as <strong>{selectedItem.expectedCondition}</strong>. Final certification will be done at the Kirana Hub.</p>
                    </div>
                  </div>

                  <div className="border border-[#D5D9D9] rounded-[8px] p-4 mb-6">
                    <h3 className="font-bold text-[15px] text-[#0f1111] border-b border-[#D5D9D9] pb-2 mb-3">AI Pricing Recommendation</h3>
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-[13px] text-[#565959]">Original Price</span>
                      <span className="text-[13px] line-through text-[#565959]">${selectedItem.originalPrice.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between items-center font-bold">
                      <span className="text-[15px] text-[#0f1111]">Suggested Listing Price</span>
                      <span className="text-[18px] text-[#B12704]">${selectedItem.suggestedPrice.toFixed(2)}</span>
                    </div>
                    <p className="text-[12px] text-[#565959] mt-3 bg-[#f0f2f2] p-2 rounded-sm">Based on recent sales data, items in this condition sell within 3-5 days at this price.</p>
                  </div>
                </>
              )}

              {/* Disposition: RECYCLE or DONATE */}
              {selectedItem.disposition === 'RECYCLE' && (
                <>
                  <div className="flex items-start gap-3 mb-6 bg-red-50 border border-red-200 p-4 rounded-[8px]">
                    <AlertCircle className="w-6 h-6 text-[#CC0C39] shrink-0 mt-0.5" />
                    <div>
                      <h3 className="font-bold text-[15px] text-[#CC0C39]">AI Prediction: Ineligible for Resale</h3>
                      <p className="text-[13px] text-[#0f1111] mt-1">The AI detected significant damage (<strong>{selectedItem.expectedCondition}</strong>). This item does not appear to meet Amazon 2nd Chance quality standards. Final check will be at Kirana Hub.</p>
                    </div>
                  </div>

                  {selectedItem.matchedNGO ? (
                    <div className="border-2 border-[#007185] rounded-[8px] p-5 mb-6 bg-white relative overflow-hidden">
                      <div className="absolute top-0 right-0 bg-[#007185] text-white text-[10px] font-bold px-2 py-1 uppercase tracking-wider rounded-bl-lg">Recommended Alternative</div>
                      <h3 className="font-bold text-[16px] text-[#0f1111] border-b border-[#D5D9D9] pb-2 mb-3">AI Predicts: Donate to Local NGO</h3>
                      <p className="text-[13px] text-[#0f1111] mb-3">This item isn't fit for retail, but it can still make a difference! <strong>{selectedItem.matchedNGO.name}</strong> is currently looking for {selectedItem.matchedNGO.needs.toLowerCase()}.</p>
                      
                      <div className="flex items-center gap-2 mb-4 bg-[#f3f7f4] p-3 rounded-lg border border-[#D5D9D9]">
                        <Heart className="w-5 h-5 text-[#007185]" />
                        <div>
                          <div className="text-[13px] font-bold text-[#0f1111]">{selectedItem.matchedNGO.name}</div>
                          <div className="text-[12px] text-[#565959]">{selectedItem.matchedNGO.distance}</div>
                        </div>
                      </div>
                      
                      <div className="flex justify-between items-center bg-white border border-[#D5D9D9] p-3 rounded-[8px]">
                        <div className="flex items-center gap-2">
                          <Leaf className="w-5 h-5 text-[#007600]" />
                          <span className="text-[14px] font-bold text-[#0f1111]">Donation Reward</span>
                        </div>
                        <span className="text-[17px] font-bold text-[#007600]">+500 Credits</span>
                      </div>
                    </div>
                  ) : (
                    <div className="border border-[#D5D9D9] rounded-[8px] p-4 mb-6 bg-[#f7fafa]">
                      <h3 className="font-bold text-[15px] text-[#0f1111] border-b border-[#D5D9D9] pb-2 mb-3">AI Predicts Disposition: Recycle</h3>
                      <p className="text-[13px] text-[#0f1111] mb-4">Instead of throwing it away, recycle this item responsibly and earn Green Credits towards your next purchase.</p>
                      
                      <div className="flex justify-between items-center bg-white border border-[#D5D9D9] p-3 rounded-[8px]">
                        <div className="flex items-center gap-2">
                          <Leaf className="w-5 h-5 text-[#007600]" />
                          <span className="text-[14px] font-bold text-[#0f1111]">Green Credits Offer</span>
                        </div>
                        <span className="text-[17px] font-bold text-[#007600]">+250 Credits</span>
                      </div>
                    </div>
                  )}
                </>
              )}

              <div className="flex justify-end gap-3 pt-4 border-t border-[#D5D9D9]">
                <button onClick={() => setStep('SELECT_ITEM')} className="bg-white border border-[#D5D9D9] rounded-[8px] py-1.5 px-4 text-[13px] shadow-sm hover:bg-[#f7fafa] font-medium transition">
                  Cancel
                </button>
                
                <button 
                  onClick={async () => {
                    try { 
                      await createKiranaDropoff(selectedItem.id, 'Demo User', `AI Predicts: ${selectedItem.disposition} (Grade: ${selectedItem.expectedCondition})`); 
                    } catch (e) { console.error(e); }
                    setStep('SUCCESS');
                  }}
                  className="bg-[#FFD814] border border-[#FCD200] rounded-[8px] py-1.5 px-6 text-[13px] shadow-sm hover:bg-[#F7CA00] font-medium transition"
                >
                  Schedule Kirana Drop-off
                </button>
              </div>
            </div>
          </div>
        )}

        {/* STEP 5: SUCCESS */}
        {step === 'SUCCESS' && selectedItem && (
          <div className="bg-white border border-[#D5D9D9] rounded-[8px] p-8 max-w-[600px] text-center">
              <>
                <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Package className="w-8 h-8 text-[#007185]" />
                </div>
                <h2 className="text-[21px] font-bold text-[#0f1111] mb-2">Drop-off Scheduled!</h2>
                <p className="text-[14px] text-[#565959] mb-6">Take your {selectedItem.title} to your nearest Kirana Partner Hub.</p>
                
                <div className="border border-[#D5D9D9] rounded-[8px] p-4 text-left bg-[#f7fafa] mb-6">
                  <h3 className="font-bold text-[13px] text-[#0f1111] mb-1">What's next?</h3>
                  <ul className="text-[13px] text-[#565959] space-y-2 list-disc pl-4">
                    <li>Pack the item securely in any box.</li>
                    <li>Drop it off at the Kirana Hub (Sharma General Store).</li>
                    <li>The partner will perform the final certification and disposition.</li>
                  </ul>
                </div>
              </>

            <div className="flex flex-col gap-3">
              <Link href="/customer/returns" className="w-full bg-[#FFD814] border border-[#FCD200] rounded-[8px] py-2 text-[13px] shadow-sm hover:bg-[#F7CA00] font-medium transition block">
                View your orders and listings
              </Link>
              <button onClick={() => setStep('SELECT_ITEM')} className="text-[#007185] hover:text-[#C7511F] hover:underline text-[13px] font-medium">
                List another item
              </button>
            </div>
          </div>
        )}

      </div>
    </div>
  );
}
