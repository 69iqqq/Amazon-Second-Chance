'use client';

import React, { useState } from 'react';
import { X } from 'lucide-react';

interface LocationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (pincode: string, city: string) => void;
  initialPincode: string;
  initialCity: string;
}

export function LocationModal({ isOpen, onClose, onSave, initialPincode, initialCity }: LocationModalProps) {
  const [pincode, setPincode] = useState(initialPincode);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  if (!isOpen) return null;

  const handleApply = async () => {
    if (!pincode || pincode.length < 6) {
      setError('Please enter a valid 6-digit PIN code.');
      return;
    }
    
    setIsLoading(true);
    setError('');

    try {
      const res = await fetch(`https://api.postalpincode.in/pincode/${pincode}`);
      const data = await res.json();
      
      if (data && data[0] && data[0].Status === 'Success') {
        const postOffice = data[0].PostOffice[0];
        // Use District or Block as the city
        const city = postOffice.District || postOffice.Block || postOffice.Name;
        onSave(pincode, city);
        onClose();
      } else {
        setError('Invalid PIN code. Please check and try again.');
      }
    } catch (err) {
      setError('Failed to verify PIN code. Please try again later.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm transition-opacity">
      <div className="bg-white rounded-lg shadow-xl w-[350px] overflow-hidden flex flex-col animate-in fade-in zoom-in duration-200">
        
        {/* Header */}
        <div className="bg-[#f0f2f2] border-b border-[#D5D9D9] px-4 py-3 flex justify-between items-center">
          <h3 className="font-bold text-[16px] text-[#0F1111]">Choose your location</h3>
          <button onClick={onClose} className="p-1 hover:bg-[#e3e6e6] rounded-md transition-colors">
            <X className="w-5 h-5 text-[#0F1111]" />
          </button>
        </div>

        {/* Body */}
        <div className="p-4 text-[13px] text-[#0F1111] flex flex-col gap-3">
          <p>
            Delivery options and delivery speeds may vary for different locations.
          </p>

          <div>
            <p className="font-bold mb-1">Apply PIN Code</p>
            <div className="flex gap-2">
              <input
                type="text"
                value={pincode}
                onChange={(e) => {
                  setPincode(e.target.value.replace(/\D/g, '').slice(0, 6));
                  setError('');
                }}
                className="flex-1 border border-[#888C8C] rounded-[3px] px-3 py-1.5 focus:border-[#007185] focus:ring-1 focus:ring-[#007185] focus:outline-none shadow-[0_1px_2px_rgba(15,17,17,0.1)_inset]"
                placeholder="Enter PIN Code"
              />
              <button 
                onClick={handleApply}
                disabled={isLoading}
                className="bg-white border border-[#D5D9D9] rounded-full px-4 py-1.5 shadow-[0_2px_5px_0_rgba(213,217,217,0.5)] hover:bg-[#F7FAFA] disabled:opacity-50 transition-colors font-medium text-[#0F1111]"
              >
                {isLoading ? '...' : 'Apply'}
              </button>
            </div>
            {error && <p className="text-[#C40000] text-[12px] mt-1">{error}</p>}
          </div>

          <div className="flex items-center gap-3 my-1">
            <div className="h-[1px] bg-[#E7E9E9] flex-1"></div>
            <span className="text-[#767676] text-[12px]">or</span>
            <div className="h-[1px] bg-[#E7E9E9] flex-1"></div>
          </div>

          <button className="w-full bg-[#FFD814] hover:bg-[#F7CA00] border border-[#FCD200] rounded-full py-1.5 shadow-[0_2px_5px_0_rgba(213,217,217,0.5)] transition-colors text-[13px] text-[#0F1111]">
            Sign in to see your addresses
          </button>
        </div>
      </div>
    </div>
  );
}
