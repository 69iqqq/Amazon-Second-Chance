'use client';

import { useState, useEffect } from 'react';
import { StatCard } from '@/components/shared/StatCard';
import { Package, Truck, DollarSign, Box, ArrowRight, CheckCircle2, Heart, Search } from 'lucide-react';
import { useGetKiranaInventory } from '@/hooks/api/usePartner';
import { getKiranaPickups, processKiranaFinalDisposition, getAllNgos } from '@/app/actions/secondLifeActions';

const MOCK_NGOS = [
  { id: 'mock-1', name: 'Goonj', distanceText: '2.5 km away', needs: 'Furniture, Clothes', contactPerson: 'Anshu Gupta', phone: '+91 98765 43210', address: 'Sarita Vihar, New Delhi' },
  { id: 'mock-2', name: 'Smile Foundation', distanceText: '4.2 km away', needs: 'Electronics, Books', contactPerson: 'Sanjeev Dham', phone: '+91 98765 43211', address: 'Green Park, New Delhi' },
  { id: 'mock-3', name: 'Helpage India', distanceText: '7.8 km away', needs: 'Home Appliances, Medical Eq.', contactPerson: 'Mathew Cherian', phone: '+91 98765 43212', address: 'Qutab Institutional Area, New Delhi' }
];

export default function KiranaDashboard() {
  const { data: inventory, isLoading } = useGetKiranaInventory();
  const [pickups, setPickups] = useState<any[]>([]);
  const [loadingPickups, setLoadingPickups] = useState(true);
  
  const [activeTab, setActiveTab] = useState<'DASHBOARD' | 'NGO_DIRECTORY'>('DASHBOARD');
  const [ngos, setNgos] = useState<any[]>([]);

  // Modal state
  const [selectedPickup, setSelectedPickup] = useState<any>(null);
  const [selectedNgo, setSelectedNgo] = useState<any>(null);
  const [isProcessing, setIsProcessing] = useState(false);

  const fetchPickups = async () => {
    setLoadingPickups(true);
    try {
      const data = await getKiranaPickups();
      setPickups(data);
    } catch (e) {
      console.error(e);
    }
    setLoadingPickups(false);
  };

  const fetchNgos = async () => {
    try {
      const data = await getAllNgos();
      if (data && data.length > 0) {
        setNgos(data);
      } else {
        setNgos(MOCK_NGOS); // Fallback to mock data for demo if DB is empty
      }
    } catch (e) {
      console.error(e);
      setNgos(MOCK_NGOS);
    }
  };

  useEffect(() => {
    fetchPickups();
    fetchNgos();
  }, []);

  const handleVerify = async (actionType: 'RESALE' | 'DONATE' | 'RECYCLE', ngoId?: string) => {
    const pickupId = selectedPickup?.id || selectedNgo?.pickupIdToAllocate;
    if (!pickupId) return;
    setIsProcessing(true);
    try {
      await processKiranaFinalDisposition(pickupId, actionType, ngoId);
      setSelectedPickup(null);
      setSelectedNgo(null);
      fetchPickups();
    } catch (e) {
      console.error(e);
    }
    setIsProcessing(false);
  };

  const pendingPickups = pickups.filter(p => p.status === 'SCHEDULED');
  const completedPickups = pickups.filter(p => p.status === 'COMPLETED');

  return (
    <div className="min-h-screen bg-[#eaeded] text-[#0F1111] font-sans pb-10">

      {/* Main Container mirroring the Amazon Pay layout width */}
      <div className="max-w-[1280px] mx-auto p-4 pt-6 grid grid-cols-1 lg:grid-cols-4 gap-6 items-start">
        
        {/* Left Sidebar (Mimics Amazon Pay Balance card) */}
        <div className="lg:col-span-1 space-y-4">
          <div className="bg-white border border-[#D5D9D9] flex flex-col shadow-sm">
            <div className="bg-[#f0f2f2] p-4 flex justify-between items-center border-b border-[#D5D9D9]">
              <span className="font-bold text-[13px] text-[#0f1111]">Hub Earnings</span>
              <span className="text-[#007600] text-[15px] font-bold">₹{completedPickups.length * 50}</span>
            </div>
            <div className="p-4 flex flex-col gap-4 text-[13px] text-[#007185]">
              <div 
                onClick={() => setActiveTab('DASHBOARD')}
                className={`flex items-center gap-2 cursor-pointer hover:underline hover:text-[#c45500] ${activeTab === 'DASHBOARD' ? 'font-bold text-[#c45500]' : ''}`}
              >
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5">
                  <path d="M12 3l8 4.5v9L12 21l-8-4.5v-9L12 3z" />
                  <path d="M12 3v9l8-4.5M12 12l-8-4.5" />
                  <path d="M12 12v9" />
                  <circle cx="5" cy="19" r="5" fill="#ff9900" stroke="none" />
                  <path d="M5 16v6m-3-3h6" stroke="#ffffff" strokeWidth="1.5" />
                </svg>
                Verify Returns
              </div>
              <div 
                onClick={() => setActiveTab('NGO_DIRECTORY')}
                className={`flex items-center gap-2 cursor-pointer hover:underline hover:text-[#c45500] ${activeTab === 'NGO_DIRECTORY' ? 'font-bold text-[#c45500]' : ''}`}
              >
                <Heart className="w-5 h-5 text-current" strokeWidth={1.5} />
                NGO Directory (Donations)
              </div>
              <div className="flex items-center gap-2 cursor-pointer hover:underline hover:text-[#c45500]">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="#007185" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5">
                  <rect x="5" y="9" width="16" height="11" rx="1" />
                  <path d="M13 9v11" />
                  <path d="M13 9c0-2-2-3-4-2-1.5.8-1.5 2.5 0 3.5s4-1.5 4-1.5z" />
                  <path d="M13 9c0-2 2-3 4-2 1.5.8 1.5 2.5 0 3.5s-4-1.5-4-1.5z" />
                  <circle cx="5" cy="19" r="5" fill="#ff9900" stroke="none" />
                  <path d="M5 16v6m-3-3h6" stroke="#ffffff" strokeWidth="1.5" />
                </svg>
                Request Amazon Transport
              </div>
              <div className="flex items-center gap-2 cursor-pointer hover:underline hover:text-[#c45500]">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="#007185" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5">
                  <path d="M12.22 2h-.44a2 2 0 0 0-2 2v.18a2 2 0 0 1-1 1.73l-.43.25a2 2 0 0 1-2 0l-.15-.08a2 2 0 0 0-2.73.73l-.22.38a2 2 0 0 0 .73 2.73l.15.1a2 2 0 0 1 1 1.72v.51a2 2 0 0 1-1 1.74l-.15.09a2 2 0 0 0-.73 2.73l.22.38a2 2 0 0 0 2.73.73l.15-.08a2 2 0 0 1 2 0l.43.25a2 2 0 0 1 1 1.73V20a2 2 0 0 0 2 2h.44a2 2 0 0 0 2-2v-.18a2 2 0 0 1 1-1.73l.43-.25a2 2 0 0 1 2 0l.15.08a2 2 0 0 0 2.73-.73l.22-.39a2 2 0 0 0-.73-2.73l-.15-.08a2 2 0 0 1-1-1.74v-.5a2 2 0 0 1 1-1.74l.15-.09a2 2 0 0 0 .73-2.73l-.22-.38a2 2 0 0 0-2.73-.73l-.15.08a2 2 0 0 1-2 0l-.43-.25a2 2 0 0 1-1-1.73V4a2 2 0 0 0-2-2z" />
                  <circle cx="12" cy="12" r="4.5" fill="#ff9900" stroke="none" />
                  <circle cx="12" cy="12" r="1.5" fill="#ffffff" stroke="none" />
                </svg>
                Account Settings
              </div>
              <div className="flex items-center gap-2 cursor-pointer hover:underline hover:text-[#c45500]">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="#007185" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5">
                  <path d="M3 3v18h18" />
                  <rect x="7" y="14" width="4" height="7" fill="#007185" stroke="none" />
                  <rect x="14" y="9" width="4" height="12" fill="#ff9900" stroke="none" />
                </svg>
                Analytical Dashboard
              </div>
            </div>
          </div>
        </div>

        {/* Main Content Area */}
        <div className="lg:col-span-3 space-y-4">
          
          {/* Hero Banner */}
          <div className="w-full bg-[#fde9c5] shadow-sm border border-[#D5D9D9] overflow-hidden mb-4">
            <div className="w-full h-[220px] flex items-center justify-center bg-gradient-to-r from-[#232f3e] to-[#007185] text-white p-8">
               <h2 className="text-3xl font-extrabold">Kirana Partner Hub</h2>
            </div>
          </div>

          {/* Section 1: Performance & Sales */}
          {activeTab === 'DASHBOARD' ? (
            <>
              <div className="bg-white border border-[#D5D9D9] shadow-sm">
            <h3 className="text-[15px] font-bold text-[#0f1111] p-4 border-b border-[#f0f2f2]">Hub Performance Overview</h3>
            <div className="p-6 grid grid-cols-4 gap-4 text-center">
              <div className="flex flex-col items-center cursor-pointer group">
                <div className="w-12 h-12 mb-3 rounded-full bg-[#fff4e6] border border-[#ff9900] flex items-center justify-center text-[#c45500] font-light text-[22px] group-hover:bg-[#fde2c5] transition relative z-10">
                  {pendingPickups.length}
                </div>
                <span className="text-[13px] text-[#0f1111] group-hover:text-[#c45500] group-hover:underline">Pending Drop-offs</span>
              </div>
              <div className="flex flex-col items-center cursor-pointer group">
                <div className="w-12 h-12 mb-3 rounded-full bg-[#e6f2f8] border border-[#00A8E1] flex items-center justify-center text-[#007185] font-light text-[14px] group-hover:bg-[#ccebf5] transition relative z-10">
                  {completedPickups.length}
                </div>
                <span className="text-[13px] text-[#0f1111] group-hover:text-[#c45500] group-hover:underline">Processed Returns</span>
              </div>
              <div className="flex flex-col items-center cursor-pointer group">
                <div className="w-12 h-12 mb-3 rounded-full bg-[#eef8ef] border border-[#007600] flex items-center justify-center text-[#007600] font-light text-[22px] group-hover:bg-[#d8f0d8] transition relative z-10">
                  {inventory?.length || 0}
                </div>
                <span className="text-[13px] text-[#0f1111] group-hover:text-[#c45500] group-hover:underline">Stored Inventory</span>
              </div>
              <div className="flex flex-col items-center cursor-pointer group">
                <div className="w-12 h-12 mb-3 rounded-full bg-[#f4f4f4] border border-[#a6a6a6] flex items-center justify-center text-[#565959] font-light text-[18px] group-hover:bg-[#e3e3e3] transition relative z-10">
                  {Math.round(((inventory?.length || 0) / 50) * 100)}%
                </div>
                <span className="text-[13px] text-[#0f1111] group-hover:text-[#c45500] group-hover:underline">Capacity Used</span>
              </div>
            </div>
          </div>

          {/* Table for Drop-offs (Matches Recent Listings Table) */}
          <div className="bg-white border border-[#D5D9D9] shadow-sm mt-4">
             <div className="p-4 border-b border-[#f0f2f2] flex justify-between items-center">
               <h3 className="text-[15px] font-bold text-[#0f1111]">Recent Customer Drop-offs</h3>
             </div>
             <div className="p-4 overflow-x-auto">
               <table className="w-full text-left text-[13px]">
                 <thead>
                   <tr className="border-b border-[#D5D9D9] text-[#565959]">
                     <th className="pb-2 font-normal">Status</th>
                     <th className="pb-2 font-normal">Customer Name</th>
                     <th className="pb-2 font-normal">AI Appraisal</th>
                     <th className="pb-2 font-normal">Time</th>
                     <th className="pb-2 font-normal text-right">Action</th>
                   </tr>
                 </thead>
                 <tbody>
                   {loadingPickups ? (
                     <tr><td colSpan={5} className="py-6 text-center text-[#565959]">Loading pickups...</td></tr>
                   ) : pickups.length > 0 ? pickups.map((item) => (
                     <tr key={item.id} className="border-b border-[#f0f2f2] hover:bg-[#f7fafa]">
                       <td className="py-3">
                         <span className={`px-2 py-0.5 text-[11px] font-bold ${item.status === 'COMPLETED' ? 'text-[#007600]' : 'text-[#CC0C39]'}`}>{item.status}</span>
                       </td>
                       <td className="py-3 font-medium text-[#007185]">{item.customerName}</td>
                       <td className="py-3 text-[#565959] max-w-[200px] truncate">{item.notes}</td>
                       <td className="py-3 text-[#565959]">{new Date(item.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</td>
                       <td className="py-3 text-right">
                         {item.status === 'SCHEDULED' && (
                           <button 
                             onClick={() => setSelectedPickup(item)}
                             className="bg-white border border-[#D5D9D9] rounded-none py-1 px-3 text-[12px] shadow-sm hover:bg-[#f7fafa]"
                           >
                             Verify Item
                           </button>
                         )}
                       </td>
                     </tr>
                   )) : (
                     <tr><td colSpan={5} className="py-6 text-center text-[#565959]">No pending customer drop-offs at the moment.</td></tr>
                   )}
                 </tbody>
               </table>
             </div>
          </div>
          </>
          ) : (
            <div className="bg-white border border-[#D5D9D9] shadow-sm">
              <div className="p-4 border-b border-[#f0f2f2] flex justify-between items-center bg-[#f7fafa]">
                <h3 className="text-[17px] font-bold text-[#0f1111] flex items-center gap-2">
                  <Heart className="w-5 h-5 text-[#007185]" />
                  Local NGO Directory
                </h3>
                <div className="relative">
                  <input 
                    type="text" 
                    placeholder="Search NGOs..." 
                    className="border border-[#D5D9D9] rounded-[8px] pl-8 pr-3 py-1.5 text-[13px] w-[200px] focus:outline-none focus:border-[#007185] focus:ring-1 focus:ring-[#007185]"
                  />
                  <Search className="w-4 h-4 text-[#565959] absolute left-2.5 top-2" />
                </div>
              </div>
              <div className="p-0">
                {ngos.map(ngo => (
                  <div key={ngo.id} className="p-4 border-b border-[#f0f2f2] hover:bg-[#f7fafa] transition">
                    <div className="flex justify-between items-start mb-2">
                      <div>
                        <h4 className="font-bold text-[15px] text-[#0f1111]">{ngo.name}</h4>
                        <p className="text-[13px] text-[#565959]">{ngo.distanceText}</p>
                      </div>
                      <div className="bg-[#eef8ef] border border-[#007600] px-2 py-1 rounded-[4px] text-[#007600] text-[11px] font-bold uppercase tracking-wide">
                        Verified Partner
                      </div>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-3">
                      <div>
                        <p className="text-[12px] font-bold text-[#0f1111] uppercase tracking-wide mb-1 text-opacity-70">Currently Needs</p>
                        <p className="text-[13px] text-[#007185] font-medium bg-[#f0f2f2] inline-block px-2 py-1 rounded-sm">
                          {ngo.needs}
                        </p>
                      </div>
                      <div className="text-[12px] text-[#565959] flex flex-col justify-between items-start md:items-end">
                        <div>
                          <p><strong className="text-[#0f1111]">Contact:</strong> {ngo.contactPerson} ({ngo.phone})</p>
                          <p><strong className="text-[#0f1111]">Address:</strong> {ngo.address}</p>
                        </div>
                        <button 
                          onClick={() => setSelectedNgo(ngo)}
                          className="mt-2 bg-[#FFD814] hover:bg-[#F7CA00] border border-[#FCD200] text-[#0f1111] font-bold py-1.5 px-4 rounded-none text-[12px] shadow-sm transition"
                        >
                          Allocate Pending Item
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
                {ngos.length === 0 && (
                  <div className="p-8 text-center text-[#565959]">No NGOs found in the database.</div>
                )}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* VERIFY MODAL */}
      {selectedPickup && (
        <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-none max-w-lg w-full p-6 shadow-2xl border border-[#D5D9D9]">
            <div className="flex justify-between items-start mb-4">
              <div>
                <h2 className="text-[18px] font-bold text-[#0f1111] mb-1">Verify Return Drop-off</h2>
                <p className="text-[13px] text-[#565959]">Customer: <span className="font-bold text-[#0f1111]">{selectedPickup.customerName}</span></p>
              </div>
              <button onClick={() => setSelectedPickup(null)} className="text-[#565959] hover:text-[#0f1111] font-bold text-xl leading-none">&times;</button>
            </div>

            <div className="bg-[#f0f2f2] border border-[#D5D9D9] p-4 mb-6 rounded-none">
              <h4 className="font-bold text-[#0f1111] mb-2 text-[13px] uppercase tracking-wide flex items-center gap-2">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-[#007185]" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M11.3 1.046A1 1 0 0112 2v5h4a1 1 0 01.82 1.573l-7 10A1 1 0 018 18v-5H4a1 1 0 01-.82-1.573l7-10a1 1 0 011.12-.38z" clipRule="evenodd" />
                </svg>
                AI Appraisal & Customer Recommendation
              </h4>
              <div className="bg-white p-4 border border-[#007185] border-l-4 rounded-r-sm shadow-sm">
                <p className="text-[14px] text-[#0f1111] font-medium whitespace-pre-wrap">
                  {selectedPickup.notes}
                </p>
              </div>
              <p className="text-[12px] text-[#007185] mt-3 font-bold">
                Does the physical item match the AI's assessment? Choose final disposition below.
              </p>
            </div>

            <div className="flex flex-col gap-3">
              <button 
                onClick={() => handleVerify('RESALE')}
                disabled={isProcessing}
                className="w-full bg-[#FFD814] hover:bg-[#F7CA00] border border-[#FCD200] text-[#0f1111] font-bold py-2 rounded-none text-[13px] shadow-sm transition flex justify-center items-center gap-2"
              >
                {isProcessing ? 'Processing...' : 'Approve for Resale (Refurbished Store)'}
              </button>
              <button 
                onClick={() => handleVerify('DONATE')}
                disabled={isProcessing}
                className="w-full bg-blue-100 hover:bg-blue-200 border border-blue-300 text-blue-900 font-bold py-2 rounded-none text-[13px] shadow-sm transition flex justify-center items-center gap-2"
              >
                {isProcessing ? 'Processing...' : 'Route to Local NGO (Donate)'}
              </button>
              <button 
                onClick={() => handleVerify('RECYCLE')}
                disabled={isProcessing}
                className="w-full bg-emerald-100 hover:bg-emerald-200 border border-emerald-300 text-emerald-900 font-bold py-2 rounded-none text-[13px] shadow-sm transition flex justify-center items-center gap-2"
              >
                {isProcessing ? 'Processing...' : 'Send to Recycler (Recycle)'}
              </button>
              <button 
                onClick={() => setSelectedPickup(null)}
                disabled={isProcessing}
                className="w-full mt-2 bg-white border border-[#D5D9D9] hover:bg-[#f7fafa] text-[#0f1111] font-bold py-2 rounded-none text-[13px] shadow-sm transition"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* NGO ALLOCATION MODAL */}
      {selectedNgo && (
        <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-none max-w-2xl w-full p-6 shadow-2xl border border-[#D5D9D9]">
            <div className="flex justify-between items-start mb-4 border-b border-[#D5D9D9] pb-4">
              <div>
                <h2 className="text-[18px] font-bold text-[#0f1111] mb-1 flex items-center gap-2">
                  <Heart className="w-5 h-5 text-[#007185]" />
                  Donate to {selectedNgo.name}
                </h2>
                <p className="text-[13px] text-[#565959]">Select a pending customer drop-off to route directly to this NGO.</p>
              </div>
              <button onClick={() => setSelectedNgo(null)} className="text-[#565959] hover:text-[#0f1111] font-bold text-xl leading-none">&times;</button>
            </div>

            <div className="max-h-[40vh] overflow-y-auto mb-6">
              {pendingPickups.length > 0 ? (
                <div className="space-y-3">
                  {pendingPickups.map((item) => (
                    <div key={item.id} className="border border-[#D5D9D9] p-3 hover:bg-[#f7fafa] transition flex justify-between items-center cursor-pointer" onClick={() => setSelectedNgo({...selectedNgo, pickupIdToAllocate: item.id})}>
                      <div>
                        <p className="font-bold text-[14px] text-[#007185] mb-1">{item.customerName}</p>
                        <p className="text-[12px] text-[#565959] max-w-[300px] truncate">{item.notes}</p>
                      </div>
                      <div className="flex items-center gap-3">
                        <span className="text-[11px] text-[#565959]">{new Date(item.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                        <div className={`w-4 h-4 rounded-full border border-[#D5D9D9] flex items-center justify-center ${selectedNgo.pickupIdToAllocate === item.id ? 'bg-[#007185] border-[#007185]' : 'bg-white'}`}>
                          {selectedNgo.pickupIdToAllocate === item.id && <div className="w-2 h-2 rounded-full bg-white"></div>}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-[14px] text-[#565959] text-center py-8">No pending drop-offs available to allocate.</p>
              )}
            </div>

            <div className="flex justify-end gap-3 pt-4 border-t border-[#D5D9D9]">
              <button 
                onClick={() => setSelectedNgo(null)}
                disabled={isProcessing}
                className="bg-white border border-[#D5D9D9] hover:bg-[#f7fafa] text-[#0f1111] font-bold py-1.5 px-4 rounded-none text-[13px] shadow-sm transition"
              >
                Cancel
              </button>
              <button 
                onClick={() => handleVerify('DONATE', selectedNgo.id)}
                disabled={isProcessing || !selectedNgo.pickupIdToAllocate}
                className={`border text-[13px] font-bold py-1.5 px-6 rounded-none shadow-sm transition ${!selectedNgo.pickupIdToAllocate ? 'bg-gray-100 border-gray-200 text-gray-400 cursor-not-allowed' : 'bg-[#FFD814] hover:bg-[#F7CA00] border-[#FCD200] text-[#0f1111]'}`}
              >
                {isProcessing ? 'Processing...' : 'Confirm Allocation'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function PickupCard({ time, name, notes, location, onVerify }: any) {
  return (
    <div className="flex items-center justify-between border-b border-gray-200 p-4 hover:bg-sky-50 transition group bg-white">
      <div className="flex items-center gap-4">
        <div className="w-16 text-center">
          <p className="text-xs font-bold text-slate-900">{time}</p>
        </div>
        <div className="w-10 h-10 rounded-none bg-[#007185]/10 text-[#007185] flex items-center justify-center font-bold text-sm">
          {name.charAt(0)}
        </div>
        <div>
          <p className="font-bold text-slate-900 text-sm mb-0.5">{name}</p>
          <p className="text-[11px] text-gray-600 line-clamp-1 max-w-[200px]">{notes}</p>
        </div>
      </div>
      <button 
        onClick={onVerify}
        className="text-sm font-bold text-white bg-[#007185] hover:bg-[#005a6a] px-4 py-2 rounded-none transition shadow-sm"
      >
        Verify Item
      </button>
    </div>
  );
}
