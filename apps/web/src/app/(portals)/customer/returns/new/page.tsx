'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { Camera, Search, ArrowRight, Leaf, Package, AlertCircle, ScanBarcode, UploadCloud, CheckCircle2, RotateCcw, Building2, Store } from 'lucide-react';
import { createKiranaDropoff, getEligiblePastPurchases } from '@/app/actions/secondLifeActions';

export default function NewReturnFlow() {
  const [step, setStep] = useState(0); // 0 = Select Item, 1 = Upload Photo, 2 = AI Grading, 3 = Options, 4 = Success
  const [isScanning, setIsScanning] = useState(false);
  const [scanProgress, setScanProgress] = useState(0);
  const [aiResult, setAiResult] = useState<any>(null);
  const [estimatedRefund, setEstimatedRefund] = useState(0);
  const [condition, setCondition] = useState('Good');
  
  const [pastPurchases, setPastPurchases] = useState<any[]>([]);
  const [selectedItem, setSelectedItem] = useState<any>(null);

  useEffect(() => {
    getEligiblePastPurchases().then(data => {
      setPastPurchases(data);
    });
  }, []);

  const handleSelectItem = (item: any) => {
    setSelectedItem(item);
    setStep(1); // Move to upload step
  };

  const handleScan = async (base64String: string) => {
    setScanProgress(0);
    setIsScanning(true);
    
    // Simulate progress bar while API call happens
    let progress = 0;
    const progressInterval = setInterval(() => {
      progress += Math.random() * 10;
      if (progress > 90) progress = 90;
      setScanProgress(progress);
    }, 300);

    try {
      const productId = selectedItem?.id || '00000000-0000-0000-0000-000000000000';
      const baseUrl = process.env.NEXT_PUBLIC_API_URL || `http://${window.location.hostname}:3001/api/v1`;
      const apiUrl = `${baseUrl}/grading/${productId}`;
      const res = await fetch(apiUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          imageUrl: base64String,
          originalImageUrl: selectedItem?.image || '' 
        })
      });
      
      const data = await res.json();
      setAiResult(data);
      
      const grade = data.grade || 'GRADE_C';
      let expectedCondition = 'Good';
      
      if (grade === 'GRADE_A_PLUS') expectedCondition = 'Pristine';
      else if (grade === 'GRADE_A') expectedCondition = 'Like New';
      else if (grade === 'GRADE_B') expectedCondition = 'Good';
      else if (grade === 'GRADE_C') expectedCondition = 'Fair';
      else if (grade === 'GRADE_D' || grade === 'GRADE_F') { expectedCondition = 'Damaged'; }

      setCondition(expectedCondition);
      
      // Calculate estimated refund (Original Price - transit fee - damage fee)
      const originalPrice = selectedItem ? selectedItem.originalPrice * 80 : 10500;
      const transitFee = 150;
      
      let damagePercentage = 0;
      if (grade === 'GRADE_A_PLUS') damagePercentage = 0.05;
      else if (grade === 'GRADE_A') damagePercentage = 0.10;
      else if (grade === 'GRADE_B') damagePercentage = 0.15;
      else if (grade === 'GRADE_C') damagePercentage = 0.30;
      else if (grade === 'GRADE_D' || grade === 'GRADE_F') damagePercentage = 0.80;
      
      const damageFee = originalPrice * damagePercentage;
      
      setEstimatedRefund(originalPrice - transitFee - damageFee);

    } catch (e) {
      console.error("AI Grading failed", e);
      setCondition('Good');
      setEstimatedRefund(10000); // Mock fallback
    } finally {
      clearInterval(progressInterval);
      setScanProgress(100);
      setTimeout(() => setStep(2), 500); // Go straight to Product Identified/AI Result
    }
  };

  const [isLoading, setIsLoading] = useState(false);

  const confirmKiranaDropoff = async () => {
    setIsLoading(true);
    try {
      const productId = selectedItem?.id || '00000000-0000-0000-0000-000000000000';
      await createKiranaDropoff(productId, 'Hackathon Judge', `Estimated Refund: ₹${estimatedRefund} - Condition: ${aiResult?.grade || 'GRADE_B'}`);
      setStep(4);
    } catch (e) {
      console.error(e);
      setStep(4); // Fallback to success for demo
    }
    setIsLoading(false);
  };

  const getGradeLetter = (gradeStr: string) => {
    if (gradeStr === 'GRADE_A_PLUS') return 'A+';
    if (gradeStr === 'GRADE_A') return 'A';
    if (gradeStr === 'GRADE_B') return 'B';
    if (gradeStr === 'GRADE_C') return 'C';
    if (gradeStr === 'GRADE_D') return 'D';
    if (gradeStr === 'GRADE_F') return 'F';
    return 'B';
  };

  const getGradeColor = (gradeStr: string) => {
    if (gradeStr === 'GRADE_A_PLUS') return 'border-purple-500 text-purple-700 bg-purple-50';
    if (gradeStr === 'GRADE_A') return 'border-emerald-400 text-emerald-600 bg-emerald-50';
    if (gradeStr === 'GRADE_B') return 'border-blue-400 text-blue-600 bg-blue-50';
    if (gradeStr === 'GRADE_C') return 'border-yellow-400 text-yellow-600 bg-yellow-50';
    return 'border-red-500 text-red-600 bg-red-50';
  };

  return (
    <div className="min-h-screen bg-[#f3f4f6]">
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-4xl mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Link href="/customer" className="text-gray-500 hover:text-gray-800 transition">
              Customer Portal
            </Link>
            <span className="text-gray-400">/</span>
            <span className="font-bold text-[#0f1111]">Start a Return</span>
          </div>
          <div className="text-xs font-bold text-gray-500 bg-gray-100 px-3 py-1 rounded-full">
            Step {Math.min(step, 3)} of 3
          </div>
        </div>
      </div>

      <main className="max-w-4xl mx-auto px-4 py-10">

        {step === 0 && (
          <div className="space-y-6">
            <h1 className="text-[28px] font-normal text-[#0f1111] mb-2">Select an item to return</h1>
            <p className="text-[15px] text-[#0f1111] mb-4">Choose from your eligible past purchases.</p>
            
            <div className="space-y-4">
              {pastPurchases.map((item) => (
                <div key={item.id} className="border border-[#D5D9D9] rounded-[8px] overflow-hidden bg-white">
                  <div className="bg-[#f0f2f2] border-b border-[#D5D9D9] p-3 text-[13px] text-[#565959] flex flex-wrap justify-between gap-4">
                    <div className="flex gap-8">
                      <div>
                        <div className="uppercase">Order Placed</div>
                        <div className="text-[#0f1111]">{item.purchasedAt}</div>
                      </div>
                      <div>
                        <div className="uppercase">Original Price</div>
                        <div className="text-[#0f1111]">₹{(item.originalPrice * 80).toLocaleString()}</div>
                      </div>
                    </div>
                  </div>
                  <div className="p-4 flex flex-col md:flex-row justify-between gap-4">
                    <div className="flex gap-4">
                      <div className="w-[90px] h-[90px] shrink-0 border border-[#D5D9D9] p-1 flex items-center justify-center">
                        <img src={item.image} className="max-h-full max-w-full object-contain" alt={item.title} />
                      </div>
                      <div className="pt-1">
                        <span className="text-[#007185] font-bold block mb-1">{item.title}</span>
                        <p className="text-[13px] text-[#565959]">Return window active</p>
                      </div>
                    </div>
                    <div className="flex flex-col justify-center min-w-[220px]">
                      <button 
                        onClick={() => handleSelectItem(item)}
                        className="w-full bg-[#FFD814] border border-[#FCD200] rounded-[8px] py-1.5 px-3 text-[13px] shadow-sm hover:bg-[#F7CA00] font-medium transition text-center"
                      >
                        Return this item
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
        
        {step === 1 && (
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-10 text-center max-w-2xl mx-auto">
            <div className="w-20 h-20 bg-blue-50 rounded-full flex items-center justify-center text-blue-600 mx-auto mb-6">
              <ScanBarcode className="w-10 h-10" />
            </div>
            <h1 className="text-3xl font-bold text-[#0f1111] mb-4">Identify Your Product</h1>
            <p className="text-gray-600 mb-8 max-w-md mx-auto">
              Scan your product's barcode or upload a photo. Our AI will automatically identify the item and assess its condition.
            </p>
            
            {isScanning ? (
              <div className="border-2 border-dashed border-blue-300 rounded-xl p-10 bg-blue-50 relative overflow-hidden">
                <div 
                  className="absolute left-0 top-0 bottom-0 bg-blue-100/50 transition-all duration-300"
                  style={{ width: `${Math.min(scanProgress, 100)}%` }}
                />
                <div className="relative z-10 flex flex-col items-center">
                  <div className="w-16 h-16 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mb-4" />
                  <p className="text-blue-800 font-bold">AI Analyzing Image...</p>
                  <p className="text-sm text-blue-600/80 mt-2">Matching with catalog & checking for damage...</p>
                </div>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="relative border-2 border-gray-200 hover:border-blue-500 hover:bg-blue-50 rounded-xl p-6 transition group flex flex-col items-center cursor-pointer">
                  <input 
                    type="file" 
                    accept="image/*"
                    capture="environment"
                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                    onChange={(e) => {
                      const file = e.target.files?.[0];
                      if (file) {
                        const reader = new FileReader();
                        reader.onloadend = () => { handleScan(reader.result as string); };
                        reader.readAsDataURL(file);
                      }
                    }}
                  />
                  <Camera className="w-8 h-8 text-gray-400 group-hover:text-blue-600 mb-3 transition" />
                  <span className="font-bold text-[#0f1111]">Open Camera</span>
                  <span className="text-xs text-gray-500 mt-1">Scan barcode or item</span>
                </div>
                
                <div className="relative border-2 border-gray-200 hover:border-blue-500 hover:bg-blue-50 rounded-xl p-6 transition group flex flex-col items-center cursor-pointer">
                  <input 
                    type="file" 
                    accept="image/*"
                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                    onChange={(e) => {
                      const file = e.target.files?.[0];
                      if (file) {
                        const reader = new FileReader();
                        reader.onloadend = () => { handleScan(reader.result as string); };
                        reader.readAsDataURL(file);
                      }
                    }}
                  />
                  <UploadCloud className="w-8 h-8 text-gray-400 group-hover:text-blue-600 mb-3 transition" />
                  <span className="font-bold text-[#0f1111]">Upload Photo</span>
                  <span className="text-xs text-gray-500 mt-1">JPG, PNG up to 5MB</span>
                </div>
              </div>
            )}
          </div>
        )}

        {step === 2 && (
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8 max-w-3xl mx-auto">
            <div className="flex items-center gap-3 mb-8 pb-6 border-b border-gray-100">
              <div className={`w-10 h-10 ${aiResult?.isMismatch ? 'bg-red-100 text-red-700' : 'bg-green-100 text-green-700'} rounded-full flex items-center justify-center`}>
                {aiResult?.isMismatch ? <AlertCircle className="w-6 h-6" /> : <CheckCircle2 className="w-6 h-6" />}
              </div>
              <div>
                <h2 className={`text-xl font-bold ${aiResult?.isMismatch ? 'text-red-700' : 'text-[#0f1111]'}`}>
                  {aiResult?.isMismatch ? 'Return Rejected: Product Mismatch' : 'Product Identified & AI Appraised'}
                </h2>
                <p className="text-sm text-gray-500">
                  {aiResult?.isMismatch ? 'The uploaded image does not match the purchased product.' : 'Match found in your order history'}
                </p>
              </div>
            </div>

            <div className="flex flex-col md:flex-row gap-8 mb-10">
              <div className="w-40 h-40 bg-gray-50 border border-gray-200 rounded-xl flex items-center justify-center p-4 shrink-0">
                <img src={selectedItem?.image || "/products/earbuds.png"} className="max-h-full object-contain mix-blend-multiply" />
              </div>
              <div className="flex-1">
                <div className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-1">Order #{selectedItem?.id.substring(0, 15) || '114-8273619'}</div>
                <h3 className="text-2xl font-bold text-[#0f1111] mb-2">{selectedItem?.title || 'Wireless Noise Cancelling Earbuds'}</h3>
                <p className="text-sm text-gray-600 mb-4">Purchased on {selectedItem?.purchasedAt || 'March 12, 2024'}</p>
                
                  {aiResult?.isMismatch ? (
                    <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                      <h3 className="font-bold text-red-900 mb-2">Return Cannot Be Processed</h3>
                      <p className="text-sm text-red-800">{aiResult?.damageSummary || 'Our AI detected that the uploaded image is a completely different item than the original product.'}</p>
                    </div>
                  ) : (
                    <>
                      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                        <div className="flex justify-between items-center mb-2">
                          <p className="font-bold text-blue-900">AI Condition Assessment</p>
                          <div className={`w-12 h-12 rounded-full border-4 flex items-center justify-center font-black text-xl shadow-sm ${getGradeColor(aiResult?.grade || 'GRADE_B')}`}>
                            {getGradeLetter(aiResult?.grade || 'GRADE_B')}
                          </div>
                        </div>
                        <p className="text-sm text-blue-800 mb-3">{aiResult?.damageSummary || 'Minor scratches detected on the case.'}</p>
                        
                        <div className="bg-white rounded p-3 border border-blue-100">
                          <div className="flex justify-between text-sm mb-1">
                            <span className="text-gray-600">Original Price:</span>
                            <span className="text-gray-900 font-bold">₹{selectedItem ? (selectedItem.originalPrice * 80).toLocaleString('en-IN') : '10,500'}</span>
                          </div>
                          <div className="flex justify-between text-sm mb-1">
                            <span className="text-gray-600">Return Transit Fee:</span>
                            <span className="text-red-600 font-bold">-₹150</span>
                          </div>
                          <div className="flex justify-between text-sm mb-3 pb-3 border-b border-gray-100">
                            <span className="text-gray-600">AI Damage Deduction:</span>
                            <span className="text-red-600 font-bold">-₹{selectedItem ? ((selectedItem.originalPrice * 80) - 150 - estimatedRefund).toLocaleString('en-IN') : (10500 - 150 - estimatedRefund).toLocaleString('en-IN')}</span>
                          </div>
                          <div className="flex justify-between text-base font-bold">
                            <span className="text-gray-900">Estimated Refund:</span>
                            <span className="text-green-600">₹{estimatedRefund.toLocaleString('en-IN')}</span>
                          </div>
                        </div>
                        <p className="text-xs text-gray-500 mt-2">* Final refund amount is verified at drop-off.</p>
                      </div>
                      
                      <div className="mt-6">
                        <button onClick={() => setStep(3)} className="bg-[#FFD814] hover:bg-[#F7CA00] border border-[#FCD200] text-[#0f1111] font-bold px-6 py-2 rounded-full shadow-sm w-full transition">
                          Continue to Drop-off Options
                        </button>
                      </div>
                    </>
                  )}
                </div>
              </div>
            </div>
        )}

        {step === 3 && (
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8 max-w-3xl mx-auto">
            <div className="text-center mb-10">
              <h2 className="text-2xl font-bold text-[#0f1111] mb-3">Return Drop-off Options</h2>
              <p className="text-gray-600 max-w-md mx-auto">
                Based on your location and the item's condition, here is the fastest way to get your refund.
              </p>
            </div>

            <div className="border-2 border-slate-500 bg-slate-50 rounded-xl p-8 relative overflow-hidden">
              <div className="absolute right-0 top-0 bottom-0 w-1/3 bg-gradient-to-l from-slate-500/20 to-transparent" />
              <div className="relative z-10 flex flex-col md:flex-row gap-6 items-center">
                <div className="w-20 h-20 bg-white rounded-full flex items-center justify-center text-slate-600 shrink-0 shadow-sm">
                  <Store className="w-10 h-10" />
                </div>
                <div>
                  <div className="inline-block bg-slate-600 text-white text-[10px] font-bold px-2 py-0.5 rounded uppercase tracking-wider mb-2">Recommended</div>
                  <h3 className="text-2xl font-bold text-[#0f1111] mb-2">Drop off at Local Kirana Hub</h3>
                  <p className="text-slate-800 mb-2">
                    Drop off your return at a nearby partnered store. Your refund will be processed immediately upon verification.
                  </p>
                  <div className="bg-white/60 border border-slate-200 rounded-lg p-3 mb-4 max-w-sm">
                    <p className="font-bold text-sm text-[#0f1111]">Nearest Hub: Sharma General Store</p>
                    <p className="text-xs text-gray-600">0.8 km away • Open till 9 PM</p>
                  </div>
                  <div className="flex flex-col sm:flex-row gap-4">
                    <button 
                      onClick={confirmKiranaDropoff} 
                      disabled={isLoading}
                      className="bg-[#0f1111] hover:bg-black text-white font-bold px-6 py-3 rounded-full transition disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {isLoading ? 'Processing...' : 'Confirm Drop-off & Get Code'}
                    </button>
                  </div>
                </div>
              </div>
            </div>

            <div className="mt-8 text-center">
              <button 
                onClick={() => setStep(2)}
                className="text-gray-500 hover:text-[#0f1111] text-sm font-medium underline transition"
              >
                Go back
              </button>
            </div>
          </div>
        )}

        {step === 4 && (
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-10 text-center max-w-2xl mx-auto">
            <div className="w-20 h-20 bg-green-50 rounded-full flex items-center justify-center text-green-600 mx-auto mb-6">
              <CheckCircle2 className="w-10 h-10" />
            </div>
            <h1 className="text-3xl font-bold text-[#0f1111] mb-4">Drop-off Scheduled!</h1>
            <p className="text-gray-600 mb-8 max-w-md mx-auto">
              Please take your item to the Kirana Hub within 48 hours. Show the store owner the code below.
            </p>

            <div className="bg-slate-50 border border-slate-200 rounded-xl p-8 max-w-sm mx-auto mb-8">
              <p className="text-sm text-gray-500 font-bold uppercase tracking-widest mb-2">Drop-off Code</p>
              <p className="text-4xl font-black text-[#0f1111] tracking-wider font-mono">AMZ-492</p>
            </div>

            <div className="flex flex-col gap-3 max-w-sm mx-auto">
              <Link href="/customer" className="bg-[#FFD814] hover:bg-[#F7CA00] border border-[#FCD200] text-[#0f1111] font-bold px-6 py-3 rounded-full shadow-sm transition w-full block">
                Go to My Orders
              </Link>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
