import React, { useState, useEffect } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { 
  ShoppingBag, 
  Sparkles, 
  AlertTriangle, 
  Flame, 
  CheckCircle2, 
  RotateCcw,
  Lock,
  ArrowLeft,
  Check
} from 'lucide-react';

export default function DemoStore() {
  const [searchParams] = useSearchParams();
  const urlMode = searchParams.get('mode') || 'standard';

  // Mode state: 'standard' (Ver A) | 'mutated' (Ver B) | 'chaos' | 'bug_mode'
  const [mode, setMode] = useState(urlMode);

  // Chaos tweaks
  const [chaosText, setChaosText] = useState(false);
  const [chaosPosition, setChaosPosition] = useState(false);
  const [chaosClasses, setChaosClasses] = useState(false);

  // E-commerce Cart & Checkout state
  const [cartCount, setCartCount] = useState(0);
  const [step, setStep] = useState(1); // 1: Product, 2: Cart Drawer, 3: Order Confirmed
  const [email, setEmail] = useState('');
  const [address, setAddress] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [itemAddedToast, setItemAddedToast] = useState(false);

  useEffect(() => {
    if (urlMode) {
      setMode(urlMode);
    }
  }, [urlMode]);

  const resetStore = () => {
    setCartCount(0);
    setStep(1);
    setEmail('');
    setAddress('');
    setIsProcessing(false);
    setItemAddedToast(false);
  };

  const isMutated = mode === 'mutated' || mode === 'chaos';
  const isBug = mode === 'bug_mode';

  // Dynamic selector computations
  const addToCartId = isMutated || chaosClasses ? 'dynamic_btn_cart_x89' : 'btn-add-to-cart';
  const addToCartText = chaosText 
    ? 'Grab It!' 
    : (isMutated ? 'Claim Headphones Now' : 'Add to Cart');

  const viewCartId = isMutated || chaosClasses ? 'nav_bag_trigger_92' : 'btn-view-cart';
  const viewCartText = isMutated ? 'Proceed to Bag' : 'View Cart & Checkout';

  const checkoutBtnId = isMutated || chaosClasses ? 'checkout_action_auth_pay' : 'btn-complete-order';
  const checkoutBtnText = chaosText 
    ? 'Authorize & Charge' 
    : (isMutated ? 'Complete Payment ($149.00)' : 'Place Order');

  const emailFieldId = isMutated || chaosClasses ? 'customer_email_contact' : 'input-checkout-email';
  const addressFieldId = isMutated || chaosClasses ? 'shipping_dest_address' : 'input-checkout-address';

  return (
    <div className="min-h-screen bg-[#f5f5f7] text-apple-text flex flex-col font-sans">
      {/* Top Frosted Navigation Bar */}
      <header className="border-b border-black/[0.05] bg-white/80 backdrop-blur-2xl sticky top-0 z-50 px-6 py-3 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Link 
            to="/" 
            className="flex items-center gap-1.5 text-xs text-apple-secondary hover:text-apple-text transition-colors py-1.5 px-3 rounded-full bg-black/[0.04] hover:bg-black/[0.08] font-medium"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            Back to Studio
          </Link>
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-apple-green animate-pulse"></span>
            <span className="font-bold text-sm tracking-tight text-apple-text">Apple Style Sandbox Store</span>
            <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-apple-blue/10 text-apple-blue font-semibold">
              Live Target App
            </span>
          </div>
        </div>

        {/* Apple Segmented Control for Mode Switcher */}
        <div className="flex items-center p-1 rounded-full bg-black/[0.05] border border-black/[0.04]">
          <button
            onClick={() => { setMode('standard'); resetStore(); }}
            className={`px-3.5 py-1 rounded-full text-xs font-semibold transition-all ${
              mode === 'standard' 
                ? 'bg-white text-apple-text shadow-sm' 
                : 'text-apple-secondary hover:text-apple-text'
            }`}
          >
            Version A
          </button>
          <button
            onClick={() => { setMode('mutated'); resetStore(); }}
            className={`px-3.5 py-1 rounded-full text-xs font-semibold transition-all ${
              mode === 'mutated' 
                ? 'bg-apple-blue text-white shadow-sm' 
                : 'text-apple-secondary hover:text-apple-text'
            }`}
          >
            Version B (Heal)
          </button>
          <button
            onClick={() => { setMode('chaos'); resetStore(); }}
            className={`px-3.5 py-1 rounded-full text-xs font-semibold transition-all flex items-center gap-1 ${
              mode === 'chaos' 
                ? 'bg-apple-orange text-white shadow-sm' 
                : 'text-apple-secondary hover:text-apple-text'
            }`}
          >
            <Flame className="w-3 h-3" />
            Live Chaos
          </button>
          <button
            onClick={() => { setMode('bug_mode'); resetStore(); }}
            className={`px-3.5 py-1 rounded-full text-xs font-semibold transition-all flex items-center gap-1 ${
              mode === 'bug_mode' 
                ? 'bg-apple-red text-white shadow-sm' 
                : 'text-apple-secondary hover:text-apple-text'
            }`}
          >
            <AlertTriangle className="w-3 h-3" />
            Real Bug
          </button>
        </div>

        <button 
          onClick={resetStore}
          className="flex items-center gap-1 text-xs text-apple-secondary hover:text-apple-text px-2.5 py-1.5 rounded-full hover:bg-black/[0.04] transition font-medium"
          title="Reset Flow"
        >
          <RotateCcw className="w-3.5 h-3.5" />
          <span>Reset</span>
        </button>
      </header>

      {/* Live Chaos Mutation Toolbar */}
      {(mode === 'chaos' || mode === 'mutated') && (
        <div className="bg-apple-orange-light border-b border-apple-orange/20 px-6 py-2.5 flex items-center justify-between text-xs text-apple-orange">
          <div className="flex items-center gap-2">
            <Flame className="w-4 h-4 animate-bounce" />
            <span className="font-bold">Chaos Injection Controls:</span>
            <span>Mutate the interface live while Playwright test executes!</span>
          </div>
          <div className="flex items-center gap-3 font-mono">
            <label className="flex items-center gap-1.5 cursor-pointer bg-white px-2.5 py-1 rounded-full border border-apple-orange/30 shadow-sm hover:bg-orange-50">
              <input 
                type="checkbox" 
                checked={chaosText} 
                onChange={(e) => setChaosText(e.target.checked)} 
                className="rounded accent-apple-orange" 
              />
              <span>Mutate Text Labels</span>
            </label>
            <label className="flex items-center gap-1.5 cursor-pointer bg-white px-2.5 py-1 rounded-full border border-apple-orange/30 shadow-sm hover:bg-orange-50">
              <input 
                type="checkbox" 
                checked={chaosPosition} 
                onChange={(e) => setChaosPosition(e.target.checked)} 
                className="rounded accent-apple-orange" 
              />
              <span>Shift Button Position</span>
            </label>
            <label className="flex items-center gap-1.5 cursor-pointer bg-white px-2.5 py-1 rounded-full border border-apple-orange/30 shadow-sm hover:bg-orange-50">
              <input 
                type="checkbox" 
                checked={chaosClasses} 
                onChange={(e) => setChaosClasses(e.target.checked)} 
                className="rounded accent-apple-orange" 
              />
              <span>Scramble Class Names</span>
            </label>
          </div>
        </div>
      )}

      {/* Real Bug Mode Alert Banner */}
      {isBug && (
        <div className="bg-apple-red-light border-b border-apple-red/20 px-6 py-2.5 flex items-center justify-between text-xs text-apple-red">
          <div className="flex items-center gap-2">
            <AlertTriangle className="w-4 h-4" />
            <span className="font-bold">Smart Triage Simulation Active:</span>
            <span>Cart pricing is corrupted ($0.00) & payment service throws 500 error. The AI must halt and REFUSE to heal!</span>
          </div>
          <span className="font-mono bg-white px-2 py-0.5 rounded-full border border-apple-red/30 font-bold">
            ERR_500_SERVICE_OFFLINE
          </span>
        </div>
      )}

      {/* Main Showcase Area */}
      <main className="flex-1 max-w-4xl w-full mx-auto p-6 md:p-8 flex flex-col justify-center">
        {step === 1 && (
          <div className="grid md:grid-cols-2 gap-8 items-center bg-white/80 backdrop-blur-2xl border border-black/[0.06] rounded-3xl p-6 md:p-8 relative shadow-apple-elevated">
            {/* Current Mode Badge */}
            <div className="absolute top-5 right-5 flex items-center gap-2">
              <span className="text-[11px] font-mono text-apple-tertiary">Mode:</span>
              <span className={`text-[11px] font-mono px-2.5 py-0.5 rounded-full font-bold ${
                mode === 'standard' ? 'bg-black/[0.04] text-apple-secondary' :
                mode === 'mutated' ? 'bg-apple-blue-light text-apple-blue border border-apple-blue/20' :
                mode === 'chaos' ? 'bg-apple-orange-light text-apple-orange border border-apple-orange/20' : 
                'bg-apple-red-light text-apple-red border border-apple-red/20'
              }`}>
                {mode.toUpperCase()}
              </span>
            </div>

            {/* Product Image Showcase */}
            <div className="flex flex-col items-center justify-center bg-black/[0.02] border border-black/[0.04] rounded-2xl p-8 relative">
              <div className="w-44 h-44 rounded-2xl bg-gradient-to-tr from-apple-blue/10 via-white to-black/[0.02] border border-black/[0.04] flex items-center justify-center shadow-inner relative group">
                <Sparkles className="w-16 h-16 text-apple-blue" />
              </div>
              <div className="mt-4 flex gap-2">
                <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-white text-apple-secondary border border-black/[0.06] shadow-apple-sm">Bluetooth 5.4</span>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-white text-apple-secondary border border-black/[0.06] shadow-apple-sm">45h Battery</span>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-apple-green-light text-apple-green border border-apple-green/20 font-bold">ANC Active</span>
              </div>
            </div>

            {/* Product Information */}
            <div className="flex flex-col space-y-4">
              <div>
                <p className="text-xs font-bold uppercase tracking-wider text-apple-blue">Studio Acoustics</p>
                <h1 className="text-2xl md:text-3xl font-extrabold text-apple-text mt-1 tracking-tight">Quantum Wireless Headphones</h1>
                <p className="text-xs text-apple-secondary mt-2 leading-relaxed">
                  Studio-grade spatial acoustic drivers with adaptive algorithmic noise cancellation and ultra-low latency DAC.
                </p>
              </div>

              {/* Price Tag with Bug Simulation */}
              <div className="flex items-baseline gap-3">
                <span className="text-3xl font-extrabold text-apple-text tracking-tight font-mono">
                  {isBug ? '$0.00' : '$149.00'}
                </span>
                {isBug && (
                  <span className="text-xs text-apple-red bg-apple-red-light px-2.5 py-0.5 rounded-full font-mono border border-apple-red/30 font-bold">
                    Pricing Bug! ($0)
                  </span>
                )}
                {!isBug && <span className="text-sm text-apple-tertiary line-through">$229.00</span>}
                <span className="text-xs text-apple-green bg-apple-green-light border border-apple-green/20 px-2 py-0.5 rounded-full font-bold">In Stock</span>
              </div>

              {/* Action Buttons */}
              <div className={`flex flex-col gap-2.5 pt-2 ${chaosPosition ? 'order-first' : ''}`}>
                <button
                  id={addToCartId}
                  data-testid="add-to-cart-action"
                  onClick={() => {
                    setCartCount(prev => Math.max(1, prev + 1));
                    setItemAddedToast(true);
                    setTimeout(() => setItemAddedToast(false), 2000);
                  }}
                  className={`w-full py-3.5 px-6 rounded-full font-semibold text-xs flex items-center justify-center gap-2 transition-all shadow-sm active:scale-[0.98] ${
                    isMutated 
                      ? 'bg-apple-blue hover:bg-apple-blue-hover text-white shadow-apple-blue/20' 
                      : 'bg-apple-text hover:bg-black text-white'
                  }`}
                >
                  {itemAddedToast ? (
                    <>
                      <Check className="w-4 h-4 text-apple-green" />
                      <span>Item Added!</span>
                    </>
                  ) : (
                    <>
                      <ShoppingBag className="w-4 h-4" />
                      <span>{addToCartText}</span>
                    </>
                  )}
                </button>

                <button
                  id={viewCartId}
                  onClick={() => setStep(2)}
                  className="w-full py-2.5 px-4 rounded-full border border-black/[0.08] bg-white hover:bg-black/[0.02] text-apple-text font-semibold text-xs flex items-center justify-center gap-2 transition shadow-apple-sm active:scale-[0.98]"
                >
                  <span>{viewCartText}</span>
                  <span className="font-mono text-[10px] bg-black/[0.05] text-apple-text px-2 py-0.5 rounded-full font-bold">
                    Cart ({cartCount})
                  </span>
                </button>

                {/* Inspectable Selector Tag */}
                <div className="text-[11px] font-mono text-apple-secondary bg-black/[0.02] p-2.5 rounded-xl border border-black/[0.04] flex items-center justify-between">
                  <span>DOM Selector:</span>
                  <span className="text-apple-blue font-bold">#{addToCartId}</span>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* STEP 2: Checkout Drawer / Form */}
        {step === 2 && (
          <div className="bg-white/80 backdrop-blur-2xl border border-black/[0.06] rounded-3xl p-6 md:p-8 max-w-xl mx-auto w-full shadow-apple-elevated relative">
            <div className="flex items-center justify-between pb-4 border-b border-black/[0.04]">
              <div className="flex items-center gap-2">
                <ShoppingBag className="w-5 h-5 text-apple-blue" />
                <h2 className="text-base font-bold text-apple-text tracking-tight">Checkout Details</h2>
              </div>
              <button 
                id={viewCartId}
                className="text-xs text-apple-secondary hover:text-apple-text underline font-mono"
              >
                {viewCartText}
              </button>
            </div>

            <div className="my-5 p-4 rounded-2xl bg-black/[0.02] border border-black/[0.04] flex items-center justify-between">
              <div>
                <p className="font-semibold text-xs text-apple-text">Quantum Wireless Headphones</p>
                <p className="text-[11px] text-apple-secondary">Qty: 1 • Audiophile Spatial</p>
              </div>
              <span className="text-sm font-bold text-apple-text font-mono">
                {isBug ? '$0.00' : '$149.00'}
              </span>
            </div>

            {/* Form Fields */}
            <div className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-apple-text mb-1.5 flex justify-between">
                  <span>Customer Email</span>
                  <span className="text-[10px] font-mono text-apple-tertiary">#{emailFieldId}</span>
                </label>
                <input
                  id={emailFieldId}
                  name={isMutated ? 'buyer_email' : 'email'}
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="lokesh@hackwave.dev"
                  className="w-full bg-white border border-black/[0.08] rounded-xl px-4 py-2.5 text-xs text-apple-text focus:outline-none focus:border-apple-blue font-mono shadow-apple-sm"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-apple-text mb-1.5 flex justify-between">
                  <span>Shipping Address</span>
                  <span className="text-[10px] font-mono text-apple-tertiary">#{addressFieldId}</span>
                </label>
                <input
                  id={addressFieldId}
                  name={isMutated ? 'delivery_addr' : 'address'}
                  type="text"
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  placeholder="Building 4, Tech Innovation Hub, Cyber City"
                  className="w-full bg-white border border-black/[0.08] rounded-xl px-4 py-2.5 text-xs text-apple-text focus:outline-none focus:border-apple-blue font-mono shadow-apple-sm"
                />
              </div>

              {/* Payment Submit Button */}
              <div className="pt-3">
                <button
                  id={checkoutBtnId}
                  disabled={isBug || isProcessing}
                  onClick={() => {
                    setIsProcessing(true);
                    setTimeout(() => {
                      setIsProcessing(false);
                      setStep(3);
                    }, 400);
                  }}
                  className={`w-full py-3.5 px-6 rounded-full font-semibold text-xs flex items-center justify-center gap-2 transition-all shadow-sm active:scale-[0.98] ${
                    isBug
                      ? 'bg-apple-red-light border border-apple-red/30 text-apple-red cursor-not-allowed opacity-80'
                      : isMutated
                      ? 'bg-apple-blue hover:bg-apple-blue-hover text-white'
                      : 'bg-apple-text hover:bg-black text-white'
                  }`}
                >
                  <Lock className="w-3.5 h-3.5" />
                  <span>{isBug ? 'Payment Service Offline (500 Error)' : checkoutBtnText}</span>
                </button>
              </div>

              <div className="text-[11px] font-mono text-apple-secondary bg-black/[0.02] p-2 rounded-xl border border-black/[0.04] flex items-center justify-between">
                <span>Checkout Selector:</span>
                <span className="text-apple-blue font-bold">#{checkoutBtnId}</span>
              </div>
            </div>
          </div>
        )}

        {/* STEP 3: Order Confirmation */}
        {step === 3 && (
          <div className="bg-white/80 backdrop-blur-2xl border border-black/[0.06] rounded-3xl p-8 max-w-lg mx-auto w-full text-center shadow-apple-elevated">
            <div className="w-16 h-16 rounded-full bg-apple-green-light border border-apple-green/20 flex items-center justify-center mx-auto mb-4 text-apple-green shadow-sm">
              <CheckCircle2 className="w-8 h-8" />
            </div>

            <span 
              id="order-success-badge" 
              className="text-xs font-mono font-bold px-3 py-1 rounded-full bg-apple-green-light text-apple-green border border-apple-green/30 inline-block mb-2"
            >
              Order Confirmed
            </span>

            <h2 className="text-2xl font-bold text-apple-text tracking-tight">Purchase Successful</h2>
            <p className="text-xs text-apple-secondary mt-1.5 leading-relaxed">
              Workflow completed end-to-end. Tracking ID: <span className="font-mono text-apple-blue font-bold">#HW-90214-X</span>
            </p>

            <div className="mt-6 pt-6 border-t border-black/[0.04] flex justify-center gap-2.5">
              <button
                onClick={resetStore}
                className="px-4 py-2.5 rounded-full bg-black/[0.04] hover:bg-black/[0.08] text-xs font-semibold text-apple-text transition active:scale-95"
              >
                Run Another Test
              </button>
              <Link
                to="/"
                className="px-4 py-2.5 rounded-full bg-apple-blue hover:bg-apple-blue-hover text-white font-semibold text-xs transition shadow-sm active:scale-95"
              >
                View Healing Logs
              </Link>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
