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
  ArrowLeft
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
    <div className="min-h-screen bg-slate-50 text-slate-900 flex flex-col font-sans">
      {/* Top Banner Navigation */}
      <header className="border-b border-slate-200 bg-white/95 backdrop-blur-md sticky top-0 z-50 px-6 py-3.5 flex items-center justify-between shadow-sm">
        <div className="flex items-center gap-4">
          <Link 
            to="/" 
            className="flex items-center gap-1.5 text-xs text-slate-600 hover:text-brand-600 transition-colors py-1 px-2.5 rounded-lg bg-slate-100 hover:bg-slate-200 font-medium"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            Back to Test Studio
          </Link>
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse"></span>
            <span className="font-bold text-sm tracking-tight text-slate-900">Quantum Hardware Store</span>
            <span className="text-[11px] font-mono px-2 py-0.5 rounded bg-brand-50 text-brand-700 border border-brand-200 font-semibold">
              Target App Sandbox
            </span>
          </div>
        </div>

        {/* Live Mode Switcher */}
        <div className="flex items-center gap-1.5 bg-slate-100 p-1 rounded-xl border border-slate-200">
          <button
            onClick={() => { setMode('standard'); resetStore(); }}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
              mode === 'standard' 
                ? 'bg-slate-900 text-white shadow-sm' 
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Version A (Base)
          </button>
          <button
            onClick={() => { setMode('mutated'); resetStore(); }}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
              mode === 'mutated' 
                ? 'bg-brand-600 text-white shadow-sm' 
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Version B (Redesigned)
          </button>
          <button
            onClick={() => { setMode('chaos'); resetStore(); }}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1 ${
              mode === 'chaos' 
                ? 'bg-rose-600 text-white shadow-sm' 
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Flame className="w-3.5 h-3.5" />
            Live Chaos
          </button>
          <button
            onClick={() => { setMode('bug_mode'); resetStore(); }}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1 ${
              mode === 'bug_mode' 
                ? 'bg-red-700 text-white shadow-sm' 
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <AlertTriangle className="w-3.5 h-3.5" />
            Real Bug Mode
          </button>
        </div>

        <button 
          onClick={resetStore}
          className="flex items-center gap-1.5 text-xs text-slate-500 hover:text-slate-800 p-2 rounded-lg hover:bg-slate-100 transition font-medium"
          title="Reset Flow"
        >
          <RotateCcw className="w-3.5 h-3.5" />
          Reset
        </button>
      </header>

      {/* Live Chaos Mutation Toolbar */}
      {(mode === 'chaos' || mode === 'mutated') && (
        <div className="bg-amber-50 border-b border-amber-200 px-6 py-2.5 flex items-center justify-between text-xs text-amber-900">
          <div className="flex items-center gap-2">
            <Flame className="w-4 h-4 text-amber-600 animate-bounce" />
            <span className="font-bold text-amber-950">Live Chaos Injection Panel:</span>
            <span>Toggle dynamic mutations while the automation is running!</span>
          </div>
          <div className="flex items-center gap-3 font-mono">
            <label className="flex items-center gap-1.5 cursor-pointer bg-white px-2.5 py-1 rounded border border-amber-300 hover:bg-amber-100/50">
              <input 
                type="checkbox" 
                checked={chaosText} 
                onChange={(e) => setChaosText(e.target.checked)} 
                className="rounded accent-amber-600" 
              />
              <span>Mutate Text Labels</span>
            </label>
            <label className="flex items-center gap-1.5 cursor-pointer bg-white px-2.5 py-1 rounded border border-amber-300 hover:bg-amber-100/50">
              <input 
                type="checkbox" 
                checked={chaosPosition} 
                onChange={(e) => setChaosPosition(e.target.checked)} 
                className="rounded accent-amber-600" 
              />
              <span>Shift Button Position</span>
            </label>
            <label className="flex items-center gap-1.5 cursor-pointer bg-white px-2.5 py-1 rounded border border-amber-300 hover:bg-amber-100/50">
              <input 
                type="checkbox" 
                checked={chaosClasses} 
                onChange={(e) => setChaosClasses(e.target.checked)} 
                className="rounded accent-amber-600" 
              />
              <span>Scramble Class Names</span>
            </label>
          </div>
        </div>
      )}

      {/* Real Bug Mode Alert Banner */}
      {isBug && (
        <div className="bg-red-50 border-b border-red-200 px-6 py-2.5 flex items-center justify-between text-xs text-red-900">
          <div className="flex items-center gap-2">
            <AlertTriangle className="w-4 h-4 text-red-600" />
            <span className="font-bold text-red-950">Smart Triage Simulation Active:</span>
            <span>Payment service is offline & cart pricing is corrupted ($0.00). AI must flag Genuine Failure and REFUSE to heal!</span>
          </div>
          <span className="font-mono bg-white px-2 py-0.5 rounded text-red-700 border border-red-300 font-bold">
            ERR_HTTP_500_SERVICE_UNAVAILABLE
          </span>
        </div>
      )}

      {/* Main Content Area */}
      <main className="flex-1 max-w-5xl w-full mx-auto p-6 md:p-8 flex flex-col justify-center">
        {step === 1 && (
          <div className="grid md:grid-cols-2 gap-8 items-center bg-white border border-slate-200 rounded-3xl p-6 md:p-8 relative overflow-hidden shadow-sm">
            {/* Current Mode Badge */}
            <div className="absolute top-4 right-4 flex items-center gap-2">
              <span className="text-[11px] font-mono text-slate-500 font-medium">Mode:</span>
              <span className={`text-[11px] font-mono px-2 py-0.5 rounded font-bold ${
                mode === 'standard' ? 'bg-slate-100 text-slate-800' :
                mode === 'mutated' ? 'bg-brand-50 text-brand-700 border border-brand-200' :
                mode === 'chaos' ? 'bg-rose-50 text-rose-700 border border-rose-200' : 'bg-red-50 text-red-700 border border-red-200'
              }`}>
                {mode.toUpperCase()}
              </span>
            </div>

            {/* Product Image Showcase */}
            <div className="flex flex-col items-center justify-center bg-slate-50 border border-slate-200 rounded-2xl p-8 relative">
              <div className="w-44 h-44 rounded-2xl bg-gradient-to-tr from-brand-100 via-white to-slate-100 border border-slate-200 flex items-center justify-center shadow-inner relative group">
                <Sparkles className="w-16 h-16 text-brand-600" />
              </div>
              <div className="mt-4 flex gap-2">
                <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-white text-slate-600 border border-slate-200">Bluetooth 5.4</span>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-white text-slate-600 border border-slate-200">45h Battery</span>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-emerald-50 text-emerald-700 border border-emerald-200 font-bold">ANC Active</span>
              </div>
            </div>

            {/* Product Information */}
            <div className="flex flex-col space-y-5">
              <div>
                <p className="text-xs font-bold uppercase tracking-wider text-brand-600">Audiophile Edition</p>
                <h1 className="text-2xl md:text-3xl font-extrabold text-slate-900 mt-1">Quantum HyperBass Headphones</h1>
                <p className="text-sm text-slate-600 mt-2">
                  Studio-grade spatial acoustic drivers with adaptive algorithmic noise cancellation and ultra-low latency DAC.
                </p>
              </div>

              {/* Price Tag with Bug Simulation */}
              <div className="flex items-baseline gap-3">
                <span className="text-3xl font-extrabold text-slate-900">
                  {isBug ? '$0.00' : '$149.00'}
                </span>
                {isBug && (
                  <span className="text-xs text-red-700 bg-red-100 px-2 py-0.5 rounded font-mono border border-red-300 font-bold">
                    Pricing Logic Bug! (Corrupted $0)
                  </span>
                )}
                {!isBug && <span className="text-sm text-slate-400 line-through">$229.00</span>}
                <span className="text-xs text-emerald-700 bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded font-bold">In Stock</span>
              </div>

              {/* Action Buttons */}
              <div className={`flex flex-col gap-2.5 pt-2 ${chaosPosition ? 'order-first' : ''}`}>
                <button
                  id={addToCartId}
                  data-testid="add-to-cart-action"
                  onClick={() => {
                    setCartCount(prev => Math.max(1, prev + 1));
                  }}
                  className={`w-full py-3.5 px-6 rounded-xl font-bold text-sm flex items-center justify-center gap-2 transition-all shadow-sm active:scale-95 ${
                    isMutated 
                      ? 'bg-brand-600 hover:bg-brand-700 text-white shadow-brand-500/25' 
                      : 'bg-slate-900 hover:bg-slate-800 text-white'
                  }`}
                >
                  <ShoppingBag className="w-4 h-4" />
                  <span>{addToCartText}</span>
                </button>

                <button
                  id={viewCartId}
                  onClick={() => setStep(2)}
                  className="w-full py-2.5 px-4 rounded-xl border border-slate-200 bg-slate-50 hover:bg-slate-100 text-slate-800 font-bold text-xs flex items-center justify-center gap-2 transition"
                >
                  <span>{viewCartText}</span>
                  <span className="font-mono text-[10px] bg-brand-50 text-brand-700 px-1.5 py-0.5 rounded border border-brand-200">
                    Cart ({cartCount})
                  </span>
                </button>

                {/* Inspectable Selector Tag */}
                <div className="text-[11px] font-mono text-slate-600 bg-slate-50 p-2.5 rounded-lg border border-slate-200 flex items-center justify-between">
                  <span>Current DOM Selector:</span>
                  <span className="text-brand-700 font-bold">#{addToCartId}</span>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* STEP 2: Checkout Drawer / Form */}
        {step === 2 && (
          <div className="bg-white border border-slate-200 rounded-3xl p-6 md:p-8 max-w-xl mx-auto w-full shadow-sm relative">
            <div className="flex items-center justify-between pb-4 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <ShoppingBag className="w-5 h-5 text-brand-600" />
                <h2 className="text-lg font-bold text-slate-900">Cart & Checkout Flow</h2>
              </div>
              <button 
                id={viewCartId}
                className="text-xs text-slate-600 hover:text-slate-900 underline font-mono font-medium"
              >
                {viewCartText}
              </button>
            </div>

            <div className="my-5 p-4 rounded-xl bg-slate-50 border border-slate-200 flex items-center justify-between">
              <div>
                <p className="font-bold text-sm text-slate-900">Quantum HyperBass Headphones</p>
                <p className="text-xs text-slate-500">Qty: 1 • Spatial Gray</p>
              </div>
              <span className="text-base font-bold text-slate-900">
                {isBug ? '$0.00' : '$149.00'}
              </span>
            </div>

            {/* Form Fields */}
            <div className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1.5 flex justify-between">
                  <span>Customer Contact Email</span>
                  <span className="text-[10px] font-mono text-slate-400">#{emailFieldId}</span>
                </label>
                <input
                  id={emailFieldId}
                  name={isMutated ? 'buyer_email' : 'email'}
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="lokesh@hackwave.dev"
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-sm text-slate-900 focus:outline-none focus:border-brand-600 font-mono"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1.5 flex justify-between">
                  <span>Shipping Destination</span>
                  <span className="text-[10px] font-mono text-slate-400">#{addressFieldId}</span>
                </label>
                <input
                  id={addressFieldId}
                  name={isMutated ? 'delivery_addr' : 'address'}
                  type="text"
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  placeholder="Building 4, Tech Innovation Hub, Cyber City"
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-sm text-slate-900 focus:outline-none focus:border-brand-600 font-mono"
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
                  className={`w-full py-3.5 px-6 rounded-xl font-bold text-sm flex items-center justify-center gap-2 transition-all shadow-sm ${
                    isBug
                      ? 'bg-red-100 border border-red-300 text-red-800 cursor-not-allowed opacity-80'
                      : isMutated
                      ? 'bg-brand-600 hover:bg-brand-700 text-white shadow-brand-500/20'
                      : 'bg-slate-900 hover:bg-slate-800 text-white'
                  }`}
                >
                  <Lock className="w-4 h-4" />
                  <span>{isBug ? 'Payment Service Offline (500 Error)' : checkoutBtnText}</span>
                </button>
              </div>

              <div className="text-[11px] font-mono text-slate-500 bg-slate-50 p-2 rounded-lg border border-slate-200 flex items-center justify-between">
                <span>Checkout Selector Target:</span>
                <span className="text-brand-700 font-bold">#{checkoutBtnId}</span>
              </div>
            </div>
          </div>
        )}

        {/* STEP 3: Order Confirmation */}
        {step === 3 && (
          <div className="bg-white border border-emerald-200 rounded-3xl p-8 max-w-lg mx-auto w-full text-center shadow-sm">
            <div className="w-16 h-16 rounded-full bg-emerald-50 border border-emerald-200 flex items-center justify-center mx-auto mb-4 text-emerald-600">
              <CheckCircle2 className="w-8 h-8" />
            </div>

            <span 
              id="order-success-badge" 
              className="text-xs font-mono font-bold px-3 py-1 rounded-full bg-emerald-50 text-emerald-800 border border-emerald-200 inline-block mb-2"
            >
              Order Confirmed
            </span>

            <h2 className="text-2xl font-bold text-slate-900">Purchase Successful!</h2>
            <p className="text-sm text-slate-600 mt-2">
              Your test workflow completed end-to-end. Tracking ID: <span className="font-mono text-brand-600 font-bold">#HW-90214-X</span>
            </p>

            <div className="mt-6 pt-6 border-t border-slate-100 flex justify-center gap-3">
              <button
                onClick={resetStore}
                className="px-5 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-xs font-bold text-slate-700 transition"
              >
                Run Another Test
              </button>
              <Link
                to="/"
                className="px-5 py-2.5 rounded-xl bg-brand-600 hover:bg-brand-700 text-white font-bold text-xs transition shadow-sm"
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
