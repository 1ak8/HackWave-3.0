import React, { useState, useEffect } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { 
  ShoppingBag, 
  Sparkles, 
  AlertTriangle, 
  ShieldCheck, 
  Flame, 
  ArrowRight, 
  CheckCircle2, 
  RotateCcw,
  Sliders,
  Zap,
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
    <div className="min-h-screen bg-obsidian-950 text-slate-100 flex flex-col font-sans">
      {/* Top Banner Navigation */}
      <header className="border-b border-white/10 bg-obsidian-900/80 backdrop-blur-md sticky top-0 z-50 px-6 py-3.5 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Link 
            to="/" 
            className="flex items-center gap-1.5 text-xs text-slate-400 hover:text-emerald-400 transition-colors py-1 px-2.5 rounded-lg bg-obsidian-800 border border-white/5"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            Back to Test Studio
          </Link>
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse"></span>
            <span className="font-semibold text-sm tracking-wide text-white">Quantum Hardware Store</span>
            <span className="text-[11px] font-mono px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
              Target App Sandbox
            </span>
          </div>
        </div>

        {/* Live Mode Switcher */}
        <div className="flex items-center gap-2 bg-obsidian-850 p-1 rounded-xl border border-white/10">
          <button
            onClick={() => { setMode('standard'); resetStore(); }}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
              mode === 'standard' 
                ? 'bg-emerald-500 text-obsidian-950 font-semibold shadow-sm' 
                : 'text-slate-400 hover:text-white'
            }`}
          >
            Version A (Base)
          </button>
          <button
            onClick={() => { setMode('mutated'); resetStore(); }}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
              mode === 'mutated' 
                ? 'bg-amber-500 text-obsidian-950 font-semibold shadow-sm' 
                : 'text-slate-400 hover:text-white'
            }`}
          >
            Version B (Redesigned)
          </button>
          <button
            onClick={() => { setMode('chaos'); resetStore(); }}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all flex items-center gap-1 ${
              mode === 'chaos' 
                ? 'bg-crimson-accent text-white font-semibold shadow-sm' 
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <Flame className="w-3 h-3 text-red-300" />
            Live Chaos
          </button>
          <button
            onClick={() => { setMode('bug_mode'); resetStore(); }}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all flex items-center gap-1 ${
              mode === 'bug_mode' 
                ? 'bg-red-600 text-white font-semibold shadow-sm' 
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <AlertTriangle className="w-3 h-3 text-white" />
            Real Bug Mode
          </button>
        </div>

        <button 
          onClick={resetStore}
          className="flex items-center gap-1.5 text-xs text-slate-400 hover:text-white p-2 rounded-lg hover:bg-obsidian-800 transition"
          title="Reset Flow"
        >
          <RotateCcw className="w-3.5 h-3.5" />
          Reset
        </button>
      </header>

      {/* Live Chaos Mutation Toolbar (when in Chaos or Mutated mode) */}
      {(mode === 'chaos' || mode === 'mutated') && (
        <div className="bg-amber-950/30 border-b border-amber-500/20 px-6 py-2.5 flex items-center justify-between text-xs text-amber-200">
          <div className="flex items-center gap-2">
            <Flame className="w-4 h-4 text-amber-400 animate-bounce" />
            <span className="font-semibold text-amber-300">Live Chaos Injection Panel:</span>
            <span>Toggle dynamic mutations while the automation is running!</span>
          </div>
          <div className="flex items-center gap-3 font-mono">
            <label className="flex items-center gap-1.5 cursor-pointer bg-amber-500/10 px-2.5 py-1 rounded border border-amber-500/20 hover:bg-amber-500/20">
              <input 
                type="checkbox" 
                checked={chaosText} 
                onChange={(e) => setChaosText(e.target.checked)} 
                className="rounded accent-amber-500" 
              />
              <span>Mutate Text Labels</span>
            </label>
            <label className="flex items-center gap-1.5 cursor-pointer bg-amber-500/10 px-2.5 py-1 rounded border border-amber-500/20 hover:bg-amber-500/20">
              <input 
                type="checkbox" 
                checked={chaosPosition} 
                onChange={(e) => setChaosPosition(e.target.checked)} 
                className="rounded accent-amber-500" 
              />
              <span>Shift Button Position</span>
            </label>
            <label className="flex items-center gap-1.5 cursor-pointer bg-amber-500/10 px-2.5 py-1 rounded border border-amber-500/20 hover:bg-amber-500/20">
              <input 
                type="checkbox" 
                checked={chaosClasses} 
                onChange={(e) => setChaosClasses(e.target.checked)} 
                className="rounded accent-amber-500" 
              />
              <span>Scramble Class Names</span>
            </label>
          </div>
        </div>
      )}

      {/* Real Bug Mode Alert Banner */}
      {isBug && (
        <div className="bg-red-950/50 border-b border-red-500/30 px-6 py-2.5 flex items-center justify-between text-xs text-red-200">
          <div className="flex items-center gap-2">
            <AlertTriangle className="w-4 h-4 text-red-400" />
            <span className="font-semibold text-red-300">Smart Triage Simulation Active:</span>
            <span>Payment service is down & cart pricing is corrupted ($0.00). AI must flag Genuine Failure and REFUSE to heal!</span>
          </div>
          <span className="font-mono bg-red-500/20 px-2 py-0.5 rounded text-red-300 border border-red-500/30">
            ERR_HTTP_500_SERVICE_UNAVAILABLE
          </span>
        </div>
      )}

      {/* Main Content Area */}
      <main className="flex-1 max-w-5xl w-full mx-auto p-6 md:p-8 flex flex-col justify-center">
        {step === 1 && (
          <div className="grid md:grid-cols-2 gap-8 items-center bg-obsidian-900 border border-white/10 rounded-2xl p-6 md:p-8 relative overflow-hidden shadow-2xl">
            {/* Ambient visual badge */}
            <div className="absolute top-4 right-4 flex items-center gap-2">
              <span className="text-[11px] font-mono text-slate-400">Current Mode:</span>
              <span className={`text-[11px] font-mono px-2 py-0.5 rounded font-semibold ${
                mode === 'standard' ? 'bg-emerald-500/20 text-emerald-300' :
                mode === 'mutated' ? 'bg-amber-500/20 text-amber-300' :
                mode === 'chaos' ? 'bg-crimson-500/20 text-crimson-300' : 'bg-red-500/20 text-red-300'
              }`}>
                {mode.toUpperCase()}
              </span>
            </div>

            {/* Product Image & Showcase */}
            <div className="flex flex-col items-center justify-center bg-obsidian-850 border border-white/5 rounded-xl p-8 relative">
              <div className="w-44 h-44 rounded-2xl bg-gradient-to-tr from-emerald-900/30 via-obsidian-800 to-obsidian-700 border border-emerald-500/20 flex items-center justify-center shadow-lg relative group">
                <Sparkles className="w-16 h-16 text-emerald-400 drop-shadow-[0_0_15px_rgba(16,185,129,0.4)]" />
              </div>
              <div className="mt-4 flex gap-2">
                <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-white/5 text-slate-400">Bluetooth 5.4</span>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-white/5 text-slate-400">45h Battery</span>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-400">Active Noise Cancel</span>
              </div>
            </div>

            {/* Product Information */}
            <div className="flex flex-col space-y-5">
              <div>
                <p className="text-xs font-semibold uppercase tracking-wider text-emerald-400">Audiophile Edition</p>
                <h1 className="text-2xl md:text-3xl font-bold text-white mt-1">Quantum HyperBass Headphones</h1>
                <p className="text-sm text-slate-400 mt-2">
                  Studio-grade spatial acoustic drivers with adaptive algorithmic noise cancellation and ultra-low latency DAC.
                </p>
              </div>

              {/* Price Tag with Bug Simulation */}
              <div className="flex items-baseline gap-3">
                <span className="text-3xl font-extrabold text-white">
                  {isBug ? '$0.00' : '$149.00'}
                </span>
                {isBug && (
                  <span className="text-xs text-red-400 bg-red-500/10 px-2 py-0.5 rounded font-mono border border-red-500/20">
                    Pricing Logic Bug! (Corrupted $0)
                  </span>
                )}
                {!isBug && <span className="text-sm text-slate-500 line-through">$229.00</span>}
                <span className="text-xs text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded">In Stock</span>
              </div>

              {/* Action Buttons */}
              <div className={`flex flex-col gap-3 pt-2 ${chaosPosition ? 'order-first' : ''}`}>
                <button
                  id={addToCartId}
                  data-testid="add-to-cart-action"
                  onClick={() => {
                    setCartCount(prev => prev + 1);
                    setStep(2);
                  }}
                  className={`w-full py-3.5 px-6 rounded-xl font-medium text-sm flex items-center justify-center gap-2 transition-all shadow-lg active:scale-95 ${
                    isMutated 
                      ? 'bg-amber-500 hover:bg-amber-400 text-obsidian-950 font-semibold shadow-amber-500/20' 
                      : 'bg-emerald-500 hover:bg-emerald-400 text-obsidian-950 font-semibold shadow-emerald-500/20'
                  }`}
                >
                  <ShoppingBag className="w-4 h-4" />
                  <span>{addToCartText}</span>
                </button>

                {/* Inspectable Selector Tag for Judges */}
                <div className="text-[11px] font-mono text-slate-400 bg-obsidian-950 p-2 rounded-lg border border-white/5 flex items-center justify-between">
                  <span>Current DOM Selector:</span>
                  <span className="text-emerald-300 font-semibold">#{addToCartId}</span>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* STEP 2: Checkout Drawer / Form */}
        {step === 2 && (
          <div className="bg-obsidian-900 border border-white/10 rounded-2xl p-6 md:p-8 max-w-xl mx-auto w-full shadow-2xl relative">
            <div className="flex items-center justify-between pb-4 border-b border-white/10">
              <div className="flex items-center gap-2">
                <ShoppingBag className="w-5 h-5 text-emerald-400" />
                <h2 className="text-lg font-bold text-white">Cart & Checkout Flow</h2>
              </div>
              <button 
                id={viewCartId}
                className="text-xs text-slate-400 hover:text-white underline font-mono"
              >
                {viewCartText}
              </button>
            </div>

            <div className="my-5 p-4 rounded-xl bg-obsidian-850 border border-white/5 flex items-center justify-between">
              <div>
                <p className="font-medium text-sm text-white">Quantum HyperBass Headphones</p>
                <p className="text-xs text-slate-400">Qty: 1 • Spatial Gray</p>
              </div>
              <span className="text-base font-bold text-emerald-400">
                {isBug ? '$0.00' : '$149.00'}
              </span>
            </div>

            {/* Form Fields */}
            <div className="space-y-4">
              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1.5 flex justify-between">
                  <span>Customer Contact Email</span>
                  <span className="text-[10px] font-mono text-slate-500">#{emailFieldId}</span>
                </label>
                <input
                  id={emailFieldId}
                  name={isMutated ? 'buyer_email' : 'email'}
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="lokesh@hackwave.dev"
                  className="w-full bg-obsidian-950 border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-emerald-500 transition font-mono"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1.5 flex justify-between">
                  <span>Shipping Destination</span>
                  <span className="text-[10px] font-mono text-slate-500">#{addressFieldId}</span>
                </label>
                <input
                  id={addressFieldId}
                  name={isMutated ? 'delivery_addr' : 'address'}
                  type="text"
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  placeholder="Building 4, Tech Innovation Hub, Cyber City"
                  className="w-full bg-obsidian-950 border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-emerald-500 transition font-mono"
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
                  className={`w-full py-3.5 px-6 rounded-xl font-medium text-sm flex items-center justify-center gap-2 transition-all shadow-lg ${
                    isBug
                      ? 'bg-red-950 border border-red-500/30 text-red-300 cursor-not-allowed opacity-75'
                      : isMutated
                      ? 'bg-amber-500 hover:bg-amber-400 text-obsidian-950 font-semibold'
                      : 'bg-emerald-500 hover:bg-emerald-400 text-obsidian-950 font-semibold'
                  }`}
                >
                  <Lock className="w-4 h-4" />
                  <span>{isBug ? 'Payment Service Offline (500 Error)' : checkoutBtnText}</span>
                </button>
              </div>

              <div className="text-[11px] font-mono text-slate-400 bg-obsidian-950 p-2 rounded-lg border border-white/5 flex items-center justify-between">
                <span>Checkout Selector Target:</span>
                <span className="text-emerald-300 font-semibold">#{checkoutBtnId}</span>
              </div>
            </div>
          </div>
        )}

        {/* STEP 3: Order Confirmation */}
        {step === 3 && (
          <div className="bg-obsidian-900 border border-emerald-500/30 rounded-2xl p-8 max-w-lg mx-auto w-full text-center shadow-[0_0_40px_rgba(16,185,129,0.15)]">
            <div className="w-16 h-16 rounded-full bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center mx-auto mb-4 text-emerald-400">
              <CheckCircle2 className="w-8 h-8" />
            </div>

            <span 
              id="order-success-badge" 
              className="text-xs font-mono font-semibold px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 inline-block mb-2"
            >
              Order Confirmed
            </span>

            <h2 className="text-2xl font-bold text-white">Purchase Successful!</h2>
            <p className="text-sm text-slate-400 mt-2">
              Your test workflow completed end-to-end. Tracking ID: <span className="font-mono text-emerald-400">#HW-90214-X</span>
            </p>

            <div className="mt-6 pt-6 border-t border-white/10 flex justify-center gap-3">
              <button
                onClick={resetStore}
                className="px-5 py-2.5 rounded-xl bg-obsidian-800 hover:bg-obsidian-700 text-xs font-medium text-slate-200 transition"
              >
                Run Another Test
              </button>
              <Link
                to="/"
                className="px-5 py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-obsidian-950 font-semibold text-xs transition"
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
