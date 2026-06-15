"use client";

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Search, MapPin, ChevronDown, LayoutDashboard } from 'lucide-react';
import { SignInButton, UserButton, useAuth, useUser } from '@clerk/nextjs';
import { usePathname, useRouter } from 'next/navigation';
import { LocationModal } from './LocationModal';
import { useCart } from '@/context/CartContext';
import { getUserLocation, saveUserLocation } from '@/app/actions/locationActions';

export function AmazonNavbar({ portalName, forceSecondLife }: { portalName?: string; forceSecondLife?: boolean }) {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isLocationModalOpen, setIsLocationModalOpen] = useState(false);
  const [pincode, setPincode] = useState('799001');
  const [city, setCity] = useState('Agartala');
  
  const { getToken, signOut } = useAuth();
  const { user, isLoaded, isSignedIn } = useUser();
  const pathname = usePathname();
  const router = useRouter();
  const isSecondLife = forceSecondLife || pathname?.startsWith('/second-life') || pathname?.startsWith('/customer') || pathname?.startsWith('/seller') || pathname?.startsWith('/ngo') || pathname?.startsWith('/kirana') || pathname?.startsWith('/admin') || pathname?.startsWith('/shop-refurbished');

  const [searchTerm, setSearchTerm] = useState('');
  const [suggestions, setSuggestions] = useState<any[]>([]);
  const [myPortal, setMyPortal] = useState<string>('/customer');

  useEffect(() => {
    if (!searchTerm.trim()) {
      setSuggestions([]);
      return;
    }
    const timer = setTimeout(async () => {
      try {
        const url = isSecondLife 
          ? `/api/search?q=${encodeURIComponent(searchTerm)}&type=second-life` 
          : `/api/search?q=${encodeURIComponent(searchTerm)}`;
        const res = await fetch(url);
        if (res.ok) {
          const data = await res.json();
          setSuggestions(data.results || []);
        }
      } catch (err) {}
    }, 300);
    return () => clearTimeout(timer);
  }, [searchTerm, isSecondLife]);

  // Load cart
  let cartCount = 0;
  try {
    // eslint-disable-next-line react-hooks/rules-of-hooks
    const cart = useCart();
    cartCount = cart.cartCount;
  } catch(e) {
    // Might not be wrapped yet during some isolated tests
  }

  // Fetch user's portal based on role
  useEffect(() => {
    if (isSignedIn) {
      fetch('/api/my-portal')
        .then((r) => r.json())
        .then((d) => setMyPortal(d.portal || '/customer'))
        .catch(() => {});
    }
  }, [isSignedIn]);

  // Load location on mount
  useEffect(() => {
    async function loadLocation() {
      if (isSignedIn) {
        try {
          const location = await getUserLocation();
          if (location) {
            if (location.postalCode) setPincode(location.postalCode);
            if (location.city) setCity(location.city);
          }
        } catch (error) {
          console.warn("Failed to load user location from Server Action.");
        }
      } else if (isLoaded) {
        // Guest user
        const savedLocation = localStorage.getItem('amazon_location');
        if (savedLocation) {
          const { pin, cty } = JSON.parse(savedLocation);
          setPincode(pin);
          setCity(cty);
        }
      }
    }
    loadLocation();
  }, [isSignedIn, isLoaded]);

  const handleSaveLocation = async (newPincode: string, newCity: string) => {
    setPincode(newPincode);
    setCity(newCity);
    
    if (isSignedIn) {
      try {
        await saveUserLocation(newCity, newPincode);
      } catch (error) {
        console.error("Failed to save location via Server Action", error);
      }
    } else {
      localStorage.setItem('amazon_location', JSON.stringify({ pin: newPincode, cty: newCity }));
    }
  };

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <header className="bg-[#131921] text-white flex flex-col sticky top-0 z-50 shadow-md">
      <LocationModal 
        isOpen={isLocationModalOpen} 
        onClose={() => setIsLocationModalOpen(false)} 
        onSave={handleSaveLocation}
        initialCity={city}
        initialPincode={pincode}
      />
      <div className="px-4 py-1.5 flex items-center justify-between gap-4 relative z-10 bg-[#131921]">
        {/* Left Side: Logo & Location */}
        <div className="flex items-center gap-2">
          <Link href="/" className="flex items-center border border-transparent hover:border-white p-1 rounded-sm">
            {isSecondLife ? (
              <img
                src="/logos/second-life-logo.png"
                alt="Amazon 2nd Chance Logo"
                className="object-contain h-[80px] w-auto -my-6 translate-y-[5px]"
              />
            ) : (
              <img
                src="/logos/og-amazon.png"
                alt="Amazon Logo"
                className="object-contain h-[35px] w-auto mt-1"
              />
            )}
          </Link>

          <div 
            onClick={() => setIsLocationModalOpen(true)}
            className="hidden sm:flex flex-col items-start cursor-pointer border border-transparent hover:border-white p-1 rounded-sm"
          >
            <p className="text-[#cccccc] text-[12px] pl-4 leading-none">
              Deliver to {user?.firstName || 'Guest'}
            </p>
            <div className="flex items-center leading-none mt-1">
              <MapPin className="w-4 h-4 text-white -ml-1 mr-0.5" />
              <p className="text-white font-bold text-[14px]">{city} {pincode}</p>
            </div>
          </div>
        </div>

        {/* Middle: Search Bar */}
        <div className="flex-1 hidden md:flex relative h-10">
          <div className="flex-1 flex items-center h-full rounded-md overflow-visible bg-white focus-within:ring-2 focus-within:ring-[#f90] shadow-sm">
            <div className="h-full bg-[#f3f3f3] hover:bg-[#dadada] text-[#555] text-[13px] flex items-center border-r border-[#cdcdcd] rounded-l-md relative w-[52px]">
              <select className="h-full w-full bg-transparent appearance-none pl-2 cursor-pointer outline-none focus:ring-2 focus:ring-[#f90] rounded-l-md z-10">
                <option>All</option>
                <option>Alexa Skills</option>
                <option>Amazon Devices</option>
                <option>Amazon Fashion</option>
                <option>Amazon Pharmacy</option>
                <option>Appliances</option>
                <option>Apps & Games</option>
                <option>Audible Audiobooks</option>
                <option>Baby</option>
                <option>Beauty</option>
                <option>Books</option>
                <option>Car & Motorbike</option>
                <option>Clothing & Accessories</option>
                <option>Collectibles</option>
                <option>Computers & Accessories</option>
                <option>Deals</option>
                <option>Electronics</option>
                <option>Furniture</option>
                <option>Garden & Outdoors</option>
                <option>Gift Cards</option>
              </select>
              <ChevronDown className="w-3 h-3 absolute right-2 text-[#555] pointer-events-none" />
            </div>
            <input
              type="text"
              placeholder={isSecondLife ? "Search Amazon 2nd Chance" : "Search Amazon.in"}
              className="flex-1 h-full px-3 text-black focus:outline-none text-[15px]"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter' && searchTerm.trim()) {
                  const url = isSecondLife ? `/search?q=${encodeURIComponent(searchTerm)}&type=second-life` : `/search?q=${encodeURIComponent(searchTerm)}`;
                  router.push(url);
                  setSuggestions([]);
                }
              }}
            />
            <button 
              className="h-full bg-[#febd69] hover:bg-[#f3a847] px-4 flex items-center justify-center rounded-r-md"
              onClick={() => {
                if(searchTerm.trim()) {
                  const url = isSecondLife ? `/search?q=${encodeURIComponent(searchTerm)}&type=second-life` : `/search?q=${encodeURIComponent(searchTerm)}`;
                  router.push(url);
                  setSuggestions([]);
                }
              }}
            >
              <Search className="w-5 h-5 text-[#333]" />
            </button>
          </div>
          
          {/* Search Suggestions Dropdown */}
          {suggestions.length > 0 && (
            <div className="absolute top-11 left-0 w-full bg-white border border-gray-200 shadow-xl rounded-b-md z-50 text-black flex flex-col py-2 max-h-[400px] overflow-y-auto">
              {suggestions.map((item, idx) => (
                <div 
                  key={idx} 
                  className="px-4 py-2 hover:bg-[#f3f3f3] flex items-center gap-3 cursor-pointer text-[#0f1111]"
                  onClick={() => {
                    setSearchTerm(item);
                    setSuggestions([]);
                    const url = isSecondLife ? `/search?q=${encodeURIComponent(item)}&type=second-life` : `/search?q=${encodeURIComponent(item)}`;
                    router.push(url);
                  }}
                >
                  <Search className="w-4 h-4 text-gray-400 shrink-0" />
                  <span className="text-[14px] line-clamp-1">{item}</span>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Right Side: Account, Returns, Cart */}
        <div className="flex items-center gap-1 sm:gap-2 text-sm">
          <div className="hidden lg:flex items-center gap-1 cursor-pointer border border-transparent hover:border-white px-2 py-1.5 rounded-sm">
            <span className="text-[14px] font-bold flex items-center">
              🇮🇳 EN <ChevronDown className="w-3 h-3 ml-1 text-gray-400" />
            </span>
          </div>

          <div className="border border-transparent hover:border-white px-2 py-1.5 rounded-sm cursor-pointer flex flex-col justify-center transition">
            {!isSignedIn && (
              <SignInButton mode="modal">
                <button className="text-left leading-none cursor-pointer">
                  <p className="text-[12px] text-white">Hello, sign in</p>
                  <p className="text-[14px] font-bold text-white flex items-center mt-0.5">
                    Account & Lists <ChevronDown className="w-3 h-3 text-gray-400 ml-1" />
                  </p>
                </button>
              </SignInButton>
            )}
            {isSignedIn && (
              <div className="relative group flex items-center gap-2 border border-transparent hover:border-white px-2 py-1.5 rounded-sm cursor-pointer transition">
                <div className="text-left leading-none mr-2">
                  <p className="text-[12px] text-[#cccccc] leading-none">Hello, {user?.firstName || 'User'}</p>
                  <p className="text-[14px] font-bold text-white flex items-center mt-0.5">
                    Account & Lists <ChevronDown className="w-3 h-3 text-gray-400 ml-1" />
                  </p>
                </div>
                <UserButton />

                {/* Unified Dropdown Menu */}
                <div className="absolute top-[100%] right-0 pt-2 w-64 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50">
                  <div className="bg-white text-black border border-gray-200 shadow-2xl rounded-md p-4 cursor-default relative">
                    {/* Triangle pointer */}
                    <div className="absolute -top-2 right-[30px] w-4 h-4 bg-white border-t border-l border-gray-200 rotate-45"></div>
                    
                    <h3 className="font-bold text-[16px] mb-3 text-[#0f1111]">Your Account</h3>
                    <ul className="space-y-2 text-[14px]">
                      <li><Link href="/customer" className="text-[#007185] hover:text-[#c45500] hover:underline block">Customer Dashboard</Link></li>
                      <li><Link href="/customer/returns" className="text-[#007185] hover:text-[#c45500] hover:underline block">Returns & Sell</Link></li>
                      <li><Link href="/customer/credits" className="text-[#007185] hover:text-[#c45500] hover:underline block">Green Credits</Link></li>
                    </ul>

                    <div className="my-3 border-t border-gray-200"></div>

                    <h3 className="font-bold text-[16px] mb-3 text-[#0f1111]">Partner Portals</h3>
                    <ul className="space-y-2 text-[14px]">
                      <li><Link href="/seller/login" className="text-[#007185] hover:text-[#c45500] hover:underline block">Seller Central</Link></li>
                      <li><Link href="/kirana" className="text-[#007185] hover:text-[#c45500] hover:underline block">Kirana Hub</Link></li>
                      <li><Link href="/ngo" className="text-[#007185] hover:text-[#c45500] hover:underline block">NGO Portal</Link></li>
                      <li><Link href="/admin" className="text-[#007185] hover:text-[#c45500] hover:underline block">Admin Dashboard</Link></li>
                    </ul>

                    <div className="my-3 border-t border-gray-200"></div>

                    <ul className="space-y-2 text-[14px]">
                      <li>
                        <button 
                          onClick={() => {
                            router.push('/');
                          }}
                          className="text-[#007185] hover:text-[#c45500] hover:underline block w-full text-left"
                        >
                          Exit Partner Mode
                        </button>
                      </li>
                    </ul>
                  </div>
                </div>
              </div>
            )}
          </div>

          <Link href={isSecondLife ? "/customer/returns" : "/orders"} className="hidden sm:flex flex-col justify-center border border-transparent hover:border-white px-2 py-1.5 rounded-sm cursor-pointer leading-none">
            <p className="text-[12px] text-white">Returns</p>
            <p className="text-[14px] font-bold text-white mt-0.5">& Sell</p>
          </Link>

          <Link href={isSecondLife ? "/cart?ref=second-life" : "/cart"} className="flex items-center border border-transparent hover:border-white px-2 py-1 rounded-sm cursor-pointer relative">
            <div className="relative flex items-center justify-center">
              <span className="absolute top-[-5px] left-1/2 -translate-x-1/2 font-bold text-[#f08804] text-[18px] leading-none z-10">
                {cartCount}
              </span>
              <Image
                src="/logos/cart-icon.png"
                alt="Cart"
                width={200}
                height={200}
                className="object-contain w-[55px] h-auto scale-[2] origin-center"
              />
            </div>
            <p className="text-[15px] font-bold text-white hidden sm:block self-end pb-1.5 -ml-2">Cart</p>
          </Link>
        </div>
      </div>

      <div
        className={`bg-[#232F3E] px-4 flex items-center gap-4 text-[14px] font-medium overflow-x-auto whitespace-nowrap transition-all duration-300 ease-in-out ${isScrolled ? 'max-h-0 py-0 opacity-0' : 'max-h-[40px] py-2 opacity-100'
          }`}
      >
        {isSecondLife ? (
          <>
            <Link href="/" className="border border-transparent hover:border-white px-2 py-0.5 rounded-sm -ml-2 transition flex items-center justify-center">
              <img src="/logos/green-a-logo.png" alt="Amazon Home" className="h-[28px] w-auto object-contain" />
            </Link>
            <Link href="/customer" className={`border border-transparent hover:border-white px-2 py-1 rounded-sm transition ${pathname === '/customer' ? 'font-bold text-white' : 'text-[#e6f2f8] font-bold'}`}>Dashboard</Link>
            <Link href="/shop-refurbished" className={`border border-transparent hover:border-white px-2 py-1 rounded-sm transition font-bold ${pathname === '/shop-refurbished' ? 'text-white' : 'text-[#ff9900]'}`}>Shop Refurbished</Link>
            <Link href="/customer/returns" className={`border border-transparent hover:border-white px-2 py-1 rounded-sm transition ${pathname === '/customer/returns' || pathname === '/customer/returns/new' ? 'font-bold text-white' : 'text-[#e6f2f8]'}`}>Returns & Sell</Link>
            <Link href="/customer/credits" className={`border border-transparent hover:border-white px-2 py-1 rounded-sm transition ${pathname === '/customer/credits' ? 'font-bold text-white' : 'text-[#e6f2f8]'}`}>Green Credits</Link>
            <Link href="/seller/login" className={`border border-transparent hover:border-white px-2 py-1 rounded-sm transition font-bold ${pathname === '/seller/login' ? 'text-white' : 'text-[#ff9900]'}`}>Sell</Link>
            {myPortal === '/customer' && (
              <Link href="/second-life" className={`border ${pathname === '/second-life' || pathname === '/second-life/partner' ? 'border-white text-white' : 'border-transparent text-[#febd69]'} hover:border-white px-2 py-1 rounded-sm transition font-bold`}>Become a Partner</Link>
            )}
            {portalName && (
              <div className="ml-auto flex items-center space-x-1 text-sm font-medium">
                <div className="text-[#febd69] font-bold">
                  {portalName} Mode Active
                </div>
              </div>
            )}
          </>
        ) : (
          <>
            <Link href="#" className="text-[#e6f2f8] border border-transparent hover:border-white px-2 py-1 rounded-sm -ml-2 transition font-bold flex items-center gap-1"><span className="text-[16px] leading-none">☰</span> All</Link>
            <Link href="#" className="text-black bg-white rounded-full px-2.5 py-0.5 font-bold text-[13px] flex items-center gap-1 hover:bg-gray-100 transition shadow-sm ml-1">
              <span className="text-blue-500 text-[10px]">❖</span> Rufus
            </Link>
            <Link href="#" className="text-[#e6f2f8] border border-transparent hover:border-white px-2 py-1 rounded-sm transition">MX Player</Link>
            <Link href="#" className="text-[#e6f2f8] border border-transparent hover:border-white px-2 py-1 rounded-sm transition">Sell</Link>
            <Link href="#" className="text-[#e6f2f8] border border-transparent hover:border-white px-2 py-1 rounded-sm transition">Gift Cards</Link>
            <Link href="#" className="text-[#e6f2f8] border border-transparent hover:border-white px-2 py-1 rounded-sm transition">AmazonBasics</Link>
            <Link href="#" className="text-[#e6f2f8] border border-transparent hover:border-white px-2 py-1 rounded-sm transition">Subscribe & Save</Link>
            <Link href="#" className="text-[#e6f2f8] border border-transparent hover:border-white px-2 py-1 rounded-sm transition flex items-center gap-1">Prime <ChevronDown className="w-3 h-3 text-[#e6f2f8] opacity-70" /></Link>
            <Link href="/second-life" className="text-[#00A8E1] border border-transparent hover:border-white px-2 py-1 rounded-sm transition flex items-center gap-1 font-bold">
              Amazon 2nd Chance <sub className="text-[#ff9900] text-[9px] font-bold mb-1">New</sub>
            </Link>
            <Link href="#" className="text-[#e6f2f8] border border-transparent hover:border-white px-2 py-1 rounded-sm transition flex items-center gap-1">Browsing History <ChevronDown className="w-3 h-3 text-[#e6f2f8] opacity-70" /></Link>
            <Link href="#" className="text-[#e6f2f8] border border-transparent hover:border-white px-2 py-1 rounded-sm transition">Buy Again</Link>
            <Link href="#" className="text-[#e6f2f8] border border-transparent hover:border-white px-2 py-1 rounded-sm transition">Amazon Pay</Link>
            <Link href="#" className="text-[#e6f2f8] border border-transparent hover:border-white px-2 py-1 rounded-sm transition">Kindle</Link>
            <Link href="#" className="text-[#e6f2f8] border border-transparent hover:border-white px-2 py-1 rounded-sm transition">Gift Ideas</Link>
            <Link href="#" className="text-[#e6f2f8] border border-transparent hover:border-white px-2 py-1 rounded-sm transition">Health, Household & Personal Care</Link>
            <Link href="#" className="text-[#e6f2f8] border border-transparent hover:border-white px-2 py-1 rounded-sm transition">Home Improvement</Link>
            <Link href="#" className="text-[#e6f2f8] border border-transparent hover:border-white px-2 py-1 rounded-sm transition">Audible</Link>
            <Link href="#" className="text-[#e6f2f8] border border-transparent hover:border-white px-2 py-1 rounded-sm transition">Customer Service</Link>
            <Link href="#" className="text-[#e6f2f8] border border-transparent hover:border-white px-2 py-1 rounded-sm transition">Today's Deals</Link>
          </>
        )}
      </div>
    </header>
  );
}
