'use client';

import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import toast from 'react-hot-toast';
import 'sweetalert2/dist/sweetalert2.min.css';
import { 
  Building2, 
  QrCode, 
  Copy, 
  Check, 
  ShieldCheck, 
  ChevronRight,
  ArrowRight,
  Info,
  DollarSign,
  ZoomIn,
  X
} from 'lucide-react';

export default function DonationPage() {
  const [copiedField, setCopiedField] = useState('');
  const [activeTab, setActiveTab] = useState('bank'); // bank, upi, paypal
  const [email, setEmail] = useState('');
  const [paypalAmount, setPaypalAmount] = useState('25');
  const [paypalCurrency, setPaypalCurrency] = useState('USD');
  const [activeQr, setActiveQr] = useState('general'); // 'general' or 'gpay'
  const [qrModalOpen, setQrModalOpen] = useState(false);
  const [paypalLoaded, setPaypalLoaded] = useState(false);
  const [paypalError, setPaypalError] = useState(null);

  const amountRef = useRef(paypalAmount);
  const currencyRef = useRef(paypalCurrency);

  useEffect(() => {
    amountRef.current = paypalAmount;
  }, [paypalAmount]);

  useEffect(() => {
    currencyRef.current = paypalCurrency;
  }, [paypalCurrency]);

  useEffect(() => {
    if (activeTab !== 'paypal') return;

    let isMounted = true;
    const clientId = process.env.ACHIVE_PUBLIC_PAYPAL_CLIENT_ID;

    if (!clientId) {
      setPaypalError('PayPal Client ID is missing.');
      return;
    }

    // Check if script is already in the document
    const scriptId = 'paypal-sdk-script';
    let script = document.getElementById(scriptId);

    const initPaypalButtons = () => {
      if (!window.paypal) return;
      
      const container = document.getElementById('paypal-button-container');
      if (container && container.children.length === 0) {
        try {
          window.paypal.Buttons({
            style: {
              layout: 'vertical',
              color: 'gold',
              shape: 'rect',
              label: 'paypal'
            },
            createOrder: (data, actions) => {
              return actions.order.create({
                purchase_units: [{
                  amount: {
                    currency_code: currencyRef.current,
                    value: amountRef.current || '10'
                  },
                  description: 'Siloti Archive Donation'
                }]
              });
            },
            onApprove: async (data, actions) => {
              const details = await actions.order.capture();
              // Show beautiful success notification using sweetalert2
              const Swal = (await import('sweetalert2')).default;
              Swal.fire({
                title: 'Donation Successful!',
                text: `Thank you, ${details.payer.name.given_name}! We successfully received your donation of ${currencyRef.current} ${amountRef.current}.`,
                icon: 'success',
                confirmButtonColor: '#10b981', // matching emerald-500
                background: '#0f172a', // matching slate-900
                color: '#fff',
                customClass: {
                  popup: 'rounded-3xl border border-white/10 shadow-2xl'
                }
              });
            },
            onError: async (err) => {
              console.error('PayPal Checkout error:', err);
              const Swal = (await import('sweetalert2')).default;
              Swal.fire({
                title: 'Payment Failed',
                text: 'A payment error occurred during the transaction. Please try again.',
                icon: 'error',
                confirmButtonColor: '#ef4444', // red-500
                background: '#0f172a',
                color: '#fff',
                customClass: {
                  popup: 'rounded-3xl border border-white/10 shadow-2xl'
                }
              });
            }
          }).render('#paypal-button-container');
        } catch (e) {
          console.error('Failed to render PayPal Buttons:', e);
        }
      }
    };

    if (script) {
      // Script exists, but if we changed currency, we need to reload it with the correct currency parameters
      const currentSrc = script.getAttribute('src');
      const expectedSrc = `https://www.paypal.com/sdk/js?client-id=${clientId}&currency=${paypalCurrency}&disable-funding=credit,card`;
      
      if (currentSrc !== expectedSrc) {
        script.remove();
        script = null;
      }
    }

    if (!script) {
      setPaypalLoaded(false);
      setPaypalError(null);
      const newScript = document.createElement('script');
      newScript.id = scriptId;
      newScript.src = `https://www.paypal.com/sdk/js?client-id=${clientId}&currency=${paypalCurrency}&disable-funding=credit,card`;
      newScript.async = true;
      newScript.onload = () => {
        if (isMounted) {
          setPaypalLoaded(true);
          initPaypalButtons();
        }
      };
      newScript.onerror = () => {
        if (isMounted) {
          setPaypalError('Failed to load PayPal SDK.');
        }
      };
      document.body.appendChild(newScript);
    } else {
      setPaypalLoaded(true);
      // Wait a short moment to ensure container DOM element is rendered
      const timer = setTimeout(() => {
        if (isMounted) initPaypalButtons();
      }, 50);
      return () => clearTimeout(timer);
    }

    return () => {
      isMounted = false;
    };
  }, [activeTab, paypalCurrency]);

  const bankDetails = {
    bank: 'Punjab National Bank',
    accountHolder: 'Siloti Archive Research and Cultural Centre',
    accountNumber: '0627200100009801',
    ifsc: 'PUNB0062720',
    swift: 'PUNBINBBISB',
    adCode: '0300200',
    branch: 'Kalain',
  };

  const upiDetails = {
    upiId: '9957116126@okbizaxis',
    payeeName: 'Siloti Archive Research & Cultural Centre',
  };

  const handleCopy = (text, fieldName) => {
    navigator.clipboard.writeText(text);
    setCopiedField(fieldName);
    setTimeout(() => setCopiedField(''), 2000);
  };

  return (
    <section className="py-22 bg-slate-950 text-white min-h-screen relative overflow-hidden selection:bg-emerald-400 selection:text-slate-950">
      {/* Background glows */}
      <div className="absolute top-0 left-1/4 w-[500px] h-[300px] bg-emerald-400/5 blur-[150px] rounded-full pointer-events-none"></div>
      <div className="absolute bottom-0 right-1/4 w-[500px] h-[300px] bg-blue-500/5 blur-[150px] rounded-full pointer-events-none"></div>

      <div className="max-w-7xl mx-auto px-6 relative z-10">
        
        {/* Header Section */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-white/5 border border-white/10 rounded-full mb-6">
            <ShieldCheck className="w-4 h-4 text-emerald-400" />
            <span className="text-[10px] font-bold uppercase tracking-widest text-emerald-300">Secure Contribution</span>
          </div>
          <h2 className="text-4xl sm:text-6xl font-light tracking-tight mb-6">
            Preserve Our <span className="font-serif italic font-semibold bg-gradient-to-r from-emerald-400 via-blue-400 to-amber-300 bg-clip-text text-transparent">Shared History</span>
          </h2>
          <p className="text-white/60 leading-relaxed font-light text-base sm:text-lg">
            Your contributions directly support the digitization of rare manuscripts, field recordings of traditional folk music, and free open public access to historical collections.
          </p>
        </div>

        {/* Tab Selection */}
        <div className="flex justify-center gap-2 mb-12 border-b border-white/5 pb-9">
          {[
            { id: 'bank', label: 'Bank Transfer', icon: <Building2 className="w-4 h-4" /> },
            { id: 'upi', label: 'UPI QR', icon: <QrCode className="w-4 h-4" /> },
            { id: 'paypal', label: 'PayPal Checkout', icon: <DollarSign className="w-4 h-4" /> }
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-2 px-5 py-2.5 rounded-full text-sm font-semibold transition-all duration-300 cursor-pointer ${
                activeTab === tab.id
                  ? 'bg-emerald-400 text-slate-950 shadow-lg shadow-emerald-400/10'
                  : 'bg-white/5 border border-white/5 hover:bg-white/10 text-white/70'
              }`}
            >
              {tab.icon}
              <span>{tab.label}</span>
            </button>
          ))}
        </div>

        {/* Dynamic Options Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* LEFT SIDE: TAB CONTENT (8 Cols) */}
          <div className="lg:col-span-8">
            
            {/* 1. BANK DETAILS TAB */}
            {activeTab === 'bank' && (
              <div className="bg-white/[0.01] border border-white/10 rounded-[2rem] p-8 sm:p-10 backdrop-blur-md animate-fadeIn">
                <div className="flex items-center gap-4 mb-6">
                  <div className="w-12 h-12 rounded-2xl bg-emerald-400/10 border border-emerald-400/20 flex items-center justify-center text-emerald-400">
                    <Building2 className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold">Direct Bank Transfer</h3>
                    <p className="text-xs text-white/55">For domestic and international bank transfers</p>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-8">
                  {[
                    { label: 'Bank Name', value: bankDetails.bank, field: 'bank' },
                    { label: 'Account Holder', value: bankDetails.accountHolder, field: 'holder' },
                    { label: 'Account Number', value: bankDetails.accountNumber, field: 'account', copyable: true },
                    { label: 'IFSC Code', value: bankDetails.ifsc, field: 'ifsc', copyable: true },
                    { label: 'SWIFT Code', value: bankDetails.swift, field: 'swift', copyable: true },
                    { label: 'AD Code', value: bankDetails.adCode, field: 'adcode' },
                    { label: 'Branch Name', value: bankDetails.branch, field: 'branch' },
                  ].map((item, idx) => (
                    <div 
                      key={idx} 
                      className={`p-5 rounded-2xl border bg-white/[0.01] transition-all ${
                        item.copyable ? 'border-white/10 hover:border-white/20' : 'border-white/5'
                      }`}
                    >
                      <span className="text-[10px] uppercase tracking-wider text-white/40 block mb-1">
                        {item.label}
                      </span>
                      <div className="flex items-center justify-between gap-3">
                        <span className="text-sm font-semibold text-white/90 leading-tight">
                          {item.value}
                        </span>
                        {item.copyable && (
                          <button
                            onClick={() => handleCopy(item.value, item.field)}
                            className="p-2 hover:bg-white/10 rounded-lg text-white/60 hover:text-white transition-colors cursor-pointer"
                            title={`Copy ${item.label}`}
                          >
                            {copiedField === item.field ? (
                              <Check className="w-4 h-4 text-emerald-400" />
                            ) : (
                              <Copy className="w-4 h-4" />
                            )}
                          </button>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* 2. UPI DETAILS TAB */}
            {activeTab === 'upi' && (
              <div className="bg-white/[0.01] border border-white/10 rounded-[2rem] p-8 sm:p-10 backdrop-blur-md animate-fadeIn">
                <div className="flex items-center justify-between flex-wrap gap-4 mb-6 border-b border-white/5 pb-4">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-2xl bg-emerald-400/10 border border-emerald-400/20 flex items-center justify-center text-emerald-400">
                      <QrCode className="w-5 h-5" />
                    </div>
                    <div>
                      <h3 className="text-xl font-semibold">Scan UPI QR Code</h3>
                      <p className="text-xs text-white/55">Instant transfer from any Indian UPI app</p>
                    </div>
                  </div>
                  {/* QR Toggle Switch */}
                  <div className="flex p-1 bg-white/5 rounded-xl border border-white/5 gap-1">
                    <button
                      type="button"
                      onClick={() => setActiveQr('general')}
                      className={`px-4 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                        activeQr === 'general'
                          ? 'bg-emerald-400 text-slate-950 font-bold shadow-md shadow-emerald-400/10'
                          : 'text-white/60 hover:text-white'
                      }`}
                    >
                      General UPI QR
                    </button>
                    <button
                      type="button"
                      onClick={() => setActiveQr('gpay')}
                      className={`px-4 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                        activeQr === 'gpay'
                          ? 'bg-emerald-400 text-slate-950 font-bold shadow-md shadow-emerald-400/10'
                          : 'text-white/60 hover:text-white'
                      }`}
                    >
                      Google Pay QR
                    </button>
                  </div>
                </div>

                <div className="flex flex-col md:flex-row items-center gap-10 mt-8">
                  {/* QR Image Wrapper with Modal Trigger */}
                  <div 
                    onClick={() => setQrModalOpen(true)}
                    className={`group relative bg-white rounded-3xl shadow-xl flex flex-col items-center justify-center shrink-0 border-4 border-emerald-400/30 overflow-hidden cursor-zoom-in transition-all duration-300 ${
                      activeQr === 'gpay' ? 'w-60 h-80' : 'w-56 h-56'
                    }`}
                  >
                    <Image
                      src={activeQr === 'general' ? '/bank/archive_QR.jpg' : '/bank/googlePay_full_QR_new.jpg'}
                      alt={activeQr === 'general' ? 'General UPI QR Code' : 'Google Pay QR Code'}
                      width={activeQr === 'gpay' ? 240 : 220}
                      height={activeQr === 'gpay' ? 320 : 220}
                      className={`w-full h-full transition-transform duration-300 group-hover:scale-105 ${
                        activeQr === 'gpay' ? 'object-contain p-2' : 'object-cover'
                      }`}
                    />
                    <div className="absolute inset-0 bg-slate-950/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                      <div className="bg-slate-950/80 p-2 rounded-xl border border-white/10 flex items-center gap-1.5 text-xs font-semibold text-white">
                        <ZoomIn className="w-3.5 h-3.5 text-emerald-400" />
                        <span>Click to Expand</span>
                      </div>
                    </div>
                  </div>

                  {/* Instructions */}
                  <div className="space-y-6 flex-grow w-full">
                    <div className="p-5 rounded-2xl border border-white/10 bg-white/[0.01]">
                      <span className="text-[10px] uppercase tracking-wider text-white/40 block mb-1">
                        Payee Name
                      </span>
                      <span className="text-sm font-semibold text-white/90">
                        {upiDetails.payeeName}
                      </span>
                    </div>

                    <div className="p-5 rounded-2xl border border-white/10 bg-white/[0.01] flex items-center justify-between gap-3">
                      <div>
                        <span className="text-[10px] uppercase tracking-wider text-white/40 block mb-1">
                          UPI ID / VPA
                        </span>
                        <span className="text-sm font-semibold text-emerald-400 font-mono">
                          {upiDetails.upiId}
                        </span>
                      </div>
                      <button
                        onClick={() => handleCopy(upiDetails.upiId, 'upiId')}
                        className="p-3 bg-white/5 hover:bg-white/10 rounded-xl text-white/60 hover:text-white transition-colors cursor-pointer"
                        title="Copy UPI ID"
                      >
                        {copiedField === 'upiId' ? (
                          <Check className="w-4 h-4 text-emerald-400" />
                        ) : (
                          <Copy className="w-4 h-4" />
                        )}
                      </button>
                    </div>

                    <div className="text-xs text-white/40 flex items-start gap-2 leading-relaxed">
                      <Info className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                      <span>Simply open your preferred UPI application (BHIM, Google Pay, PhonePe, Paytm) and scan the QR code, or transfer directly using the VPA listed above.</span>
                    </div>

                    {/* Mobile Direct Pay Deep Link */}
                    <div className="pt-2 md:hidden">
                      <a
                        href="upi://pay?pa=silotiarchive@pnb&pn=Siloti%20Archive%20Research%20and%20Cultural%20Centre&cu=INR"
                        className="w-full bg-emerald-400 hover:bg-emerald-300 text-slate-950 font-bold py-3.5 px-6 rounded-2xl shadow-lg shadow-emerald-400/10 flex items-center justify-center gap-2 cursor-pointer text-sm"
                      >
                        <span>Pay via UPI App Directly</span>
                      </a>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* 3. PAYPAL TAB */}
            {activeTab === 'paypal' && (
              <div className="bg-white/[0.01] border border-white/10 rounded-[2rem] p-8 sm:p-10 backdrop-blur-md animate-fadeIn">
                <div className="flex items-center gap-4 mb-6">
                  <div className="w-12 h-12 rounded-2xl bg-emerald-400/10 border border-emerald-400/20 flex items-center justify-center text-emerald-400">
                    <DollarSign className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold">PayPal Checkout</h3>
                    <p className="text-xs text-white/55">For international contributors supporting from outside India</p>
                  </div>
                </div>

                <div className="space-y-6 mt-8 max-w-xl">
                  
                  {/* Select currency */}
                  <div>
                    <label className="text-xs uppercase tracking-widest text-white/50 block mb-3 font-semibold">
                      Select Currency
                    </label>
                    <div className="grid grid-cols-4 gap-3">
                      {[
                        { code: 'USD', symbol: '$' },
                        { code: 'EUR', symbol: '€' },
                        { code: 'GBP', symbol: '£' },
                        { code: 'CAD', symbol: 'C$' }
                      ].map((curr) => (
                        <button
                          key={curr.code}
                          type="button"
                          onClick={() => setPaypalCurrency(curr.code)}
                          className={`py-2 rounded-xl text-sm font-semibold transition-all cursor-pointer ${
                            paypalCurrency === curr.code
                              ? 'bg-emerald-400 text-slate-950 shadow-md shadow-emerald-400/10'
                              : 'bg-white/5 border border-white/5 hover:bg-white/10 text-white/80'
                          }`}
                        >
                          {curr.code} ({curr.symbol})
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Select amount */}
                  <div>
                    <label className="text-xs uppercase tracking-widest text-white/50 block mb-3 font-semibold">
                      Select Amount ({paypalCurrency})
                    </label>
                    <div className="grid grid-cols-4 gap-3">
                      {(paypalCurrency === 'GBP' ? ['10', '20', '50', '100'] : paypalCurrency === 'CAD' ? ['15', '30', '75', '150'] : ['10', '25', '50', '100']).map((amt) => (
                        <button
                          key={amt}
                          type="button"
                          onClick={() => setPaypalAmount(amt)}
                          className={`py-3 rounded-xl text-sm font-semibold transition-all cursor-pointer ${
                            paypalAmount === amt
                              ? 'bg-emerald-400 text-slate-950 shadow-md shadow-emerald-400/10'
                              : 'bg-white/5 border border-white/5 hover:bg-white/10 text-white/80'
                          }`}
                        >
                          {paypalCurrency === 'USD' ? '$' : paypalCurrency === 'EUR' ? '€' : paypalCurrency === 'GBP' ? '£' : 'C$'}{amt}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Custom amount input */}
                  <div className="relative">
                    <span className="absolute left-4 top-1/2 -translate-y-1/2 text-white/40 font-semibold">
                      {paypalCurrency === 'USD' ? '$' : paypalCurrency === 'EUR' ? '€' : paypalCurrency === 'GBP' ? '£' : 'C$'}
                    </span>
                    <input
                      type="number"
                      placeholder="Other Amount"
                      value={paypalAmount}
                      onChange={(e) => setPaypalAmount(e.target.value)}
                      className="w-full bg-white/5 border border-white/10 rounded-xl py-3.5 pl-8 pr-4 text-sm text-white placeholder-white/35 focus:outline-none focus:border-emerald-400 transition-colors"
                    />
                  </div>

                  {/* Email contact input */}
                  <div>
                    <label className="text-xs uppercase tracking-widest text-white/50 block mb-2 font-semibold">
                      Your Email Address (For Receipt)
                    </label>
                    <input
                      type="email"
                      placeholder="name@example.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="w-full bg-white/5 border border-white/10 rounded-xl py-3.5 px-4 text-sm text-white placeholder-white/35 focus:outline-none focus:border-emerald-400 transition-colors"
                    />
                  </div>

                  {/* PayPal SDK rendering container */}
                  <div className="pt-4 min-h-[150px] flex flex-col justify-center relative w-full">
                    {!paypalLoaded && !paypalError && (
                      <div className="flex flex-col items-center justify-center gap-3 py-6 absolute inset-0 bg-slate-950/50 z-10 rounded-xl">
                        <div className="w-8 h-8 border-4 border-emerald-400/30 border-t-emerald-400 rounded-full animate-spin"></div>
                        <span className="text-xs text-white/55">Loading PayPal Checkout...</span>
                      </div>
                    )}

                    {paypalError && (
                      <div className="p-4 bg-red-500/10 border border-red-500/20 text-red-400 rounded-xl text-center text-sm font-medium">
                        {paypalError}
                      </div>
                    )}
                    
                    <div 
                      key={paypalCurrency}
                      id="paypal-button-container" 
                      className="transition-all duration-300 w-full"
                    />
                  </div>

                  <div className="flex items-center justify-center gap-2 text-white/40 text-[10px] uppercase tracking-wider mt-4">
                    <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                    <span>Transactions are secured by end-to-end PayPal encryption</span>
                  </div>

                </div>
              </div>
            )}


          </div>

          {/* RIGHT SIDE: INFO & FAQ (4 Cols) */}
          <div className="lg:col-span-4 space-y-6">
            
            {/* Impact card */}
            <div className="bg-white/[0.02] border border-white/10 rounded-3xl p-6 relative overflow-hidden">
              <div className="absolute top-0 right-0 w-20 h-20 bg-emerald-400/5 blur-xl rounded-full"></div>
              <h4 className="font-bold text-emerald-400 text-sm uppercase tracking-widest mb-4">How it helps</h4>
              
              <ul className="space-y-4">
                {[
                  { title: 'Archiving Manuscripts', desc: 'Preserves ancient texts and books from decay.' },
                  { title: 'Linguistic Research', desc: 'Funds critical research on the Siloti language.' },
                  { title: 'Oral Traditions', desc: 'Enables recordists to capture rare folk music and Dhamail.' }
                ].map((item, i) => (
                  <li key={i} className="flex gap-3">
                    <span className="text-emerald-400 font-serif italic font-bold">0{i+1}.</span>
                    <div>
                      <h5 className="text-sm font-semibold text-white/95">{item.title}</h5>
                      <p className="text-xs text-white/55 mt-0.5">{item.desc}</p>
                    </div>
                  </li>
                ))}
              </ul>
            </div>

            {/* Need Help card */}
            <div className="bg-white/[0.02] border border-white/5 rounded-3xl p-6 text-center space-y-4">
              <p className="text-xs text-white/55">
                Have questions about sponsorships, donations, or international support?
              </p>
              <a 
                href="/contact"
                className="inline-flex items-center gap-1.5 text-xs font-bold text-emerald-400 hover:text-emerald-300 uppercase tracking-widest cursor-pointer"
              >
                <span>Contact Curators</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </a>
            </div>

          </div>

        </div>

      </div>

      {/* Lightbox Modal for QR Codes */}
      {qrModalOpen && (
        <div 
          className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/80 backdrop-blur-md p-6 animate-fadeIn"
          onClick={() => setQrModalOpen(false)}
        >
          <div 
            className="relative bg-slate-900 border border-white/10 max-w-sm w-full rounded-3xl p-6 shadow-2xl flex flex-col items-center gap-4"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={() => setQrModalOpen(false)}
              className="absolute top-4 right-4 p-2 bg-white/5 hover:bg-white/10 rounded-full text-white/70 hover:text-white transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
            <h4 className="text-base font-bold text-center mt-2">
              {activeQr === 'general' ? 'General UPI QR Code' : 'Google Pay QR Code'}
            </h4>
            <p className="text-[11px] text-white/50 text-center -mt-2">
              Scan this code using any UPI app to complete your donation
            </p>
            <div className={`bg-white p-3 rounded-2xl relative flex items-center justify-center overflow-hidden transition-all duration-300 ${
              activeQr === 'gpay' ? 'w-60 h-80' : 'w-48 h-48'
            }`}>
              <Image
                src={activeQr === 'general' ? '/bank/archive_QR.jpg' : '/bank/googlePay_full_QR_new.jpg'}
                alt="QR Code Zoomed"
                width={activeQr === 'gpay' ? 240 : 192}
                height={activeQr === 'gpay' ? 320 : 192}
                className="object-contain w-full h-full"
              />
            </div>
            <div className="w-full flex flex-col gap-2">
              <div className="p-3 bg-white/5 border border-white/5 rounded-xl text-center">
                <span className="text-[9px] uppercase tracking-wider text-white/40 block mb-1">Payee Name</span>
                <span className="text-xs font-semibold">{upiDetails.payeeName}</span>
              </div>
              <div className="p-3 bg-white/5 border border-white/5 rounded-xl text-center">
                <span className="text-[9px] uppercase tracking-wider text-white/40 block mb-1">UPI ID / VPA</span>
                <span className="text-xs font-semibold text-emerald-400 font-mono">{upiDetails.upiId}</span>
              </div>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
