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
  Check,
  ShieldCheck,
  Package
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
  const [step, setStep] = useState(1); // 1: Product, 2: Checkout Form, 3: Confirmation
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
    <div className="min-h-screen bg-surface text-ink flex flex-col font-sans">
      {/* Top Navigation Bar */}
      <header className="border-b border-border bg-white sticky top-0 z-50 px-6 py-2.5 flex items-center justify-between shadow-xs">
        <div className="flex items-center gap-4">
          <Link 
            to="/" 
            className="btn btn-secondary btn-xs flex items-center gap-1.5"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Studio</span>
          </Link>

          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-success"></span>
            <span className="font-bold text-sm tracking-tight text-ink">Apex Audio Sandbox</span>
            <span className="badge badge-brand text-2xs font-mono">Target App</span>
          </div>
        </div>

        {/* Clean Mode Switcher Tabs */}
        <div className="flex items-center p-0.5 rounded-lg bg-surface border border-border">
          <button
            onClick={() => { setMode('standard'); resetStore(); }}
            className={`px-3 py-1 rounded-md text-xs font-semibold transition-all ${
              mode === 'standard' 
                ? 'bg-white text-ink shadow-xs border border-border' 
                : 'text-ink-secondary hover:text-ink'
            }`}
          >
            Version A
          </button>
          <button
            onClick={() => { setMode('mutated'); resetStore(); }}
            className={`px-3 py-1 rounded-md text-xs font-semibold transition-all ${
              mode === 'mutated' 
                ? 'bg-brand text-white shadow-xs' 
                : 'text-ink-secondary hover:text-ink'
            }`}
          >
            Version B (Heal)
          </button>
          <button
            onClick={() => { setMode('chaos'); resetStore(); }}
            className={`px-3 py-1 rounded-md text-xs font-semibold transition-all flex items-center gap-1 ${
              mode === 'chaos' 
                ? 'bg-amber-500 text-white shadow-xs' 
                : 'text-ink-secondary hover:text-ink'
            }`}
          >
            <Flame className="w-3 h-3" />
            Chaos Mode
          </button>
          <button
            onClick={() => { setMode('bug_mode'); resetStore(); }}
            className={`px-3 py-1 rounded-md text-xs font-semibold transition-all flex items-center gap-1 ${
              mode === 'bug_mode' 
                ? 'bg-danger text-white shadow-xs' 
                : 'text-ink-secondary hover:text-ink'
            }`}
          >
            <AlertTriangle className="w-3 h-3" />
            Real Bug
          </button>
        </div>

        <button 
          onClick={resetStore}
          className="btn btn-ghost btn-xs flex items-center gap-1 text-ink-secondary"
          title="Reset Flow"
        >
          <RotateCcw className="w-3 h-3" />
          <span>Reset</span>
        </button>
      </header>

      {/* Live Chaos Mutation Toolbar */}
      {(mode === 'chaos' || mode === 'mutated') && (
        <div className="bg-warning-bg border-b border-warning-border px-6 py-2 flex items-center justify-between text-xs text-warning-text font-medium">
          <div className="flex items-center gap-2">
            <Flame className="w-4 h-4 text-amber-600 animate-pulse" />
            <span className="font-bold">Live Chaos Injections:</span>
            <span>Mutate the interface while Playwright test executes</span>
          </div>
          <div className="flex items-center gap-3 font-mono text-2xs">
            <label className="flex items-center gap-1.5 cursor-pointer bg-white px-2.5 py-1 rounded border border-warning-border shadow-xs text-ink hover:bg-surface">
              <input 
                type="checkbox" 
                checked={chaosText} 
                onChange={(e) => setChaosText(e.target.checked)} 
                className="rounded accent-amber-500" 
              />
              <span>Mutate Text Labels</span>
            </label>
            <label className="flex items-center gap-1.5 cursor-pointer bg-white px-2.5 py-1 rounded border border-warning-border shadow-xs text-ink hover:bg-surface">
              <input 
                type="checkbox" 
                checked={chaosPosition} 
                onChange={(e) => setChaosPosition(e.target.checked)} 
                className="rounded accent-amber-500" 
              />
              <span>Shift Button Order</span>
            </label>
            <label className="flex items-center gap-1.5 cursor-pointer bg-white px-2.5 py-1 rounded border border-warning-border shadow-xs text-ink hover:bg-surface">
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
        <div className="bg-danger-bg border-b border-danger-border px-6 py-2 flex items-center justify-between text-xs text-danger-text">
          <div className="flex items-center gap-2">
            <AlertTriangle className="w-4 h-4 text-danger" />
            <span className="font-bold">Smart Triage Simulation Active:</span>
            <span>Cart pricing is corrupted ($0.00) & payment service returns 500 error. The AI engine must halt and REFUSE to heal!</span>
          </div>
          <span className="badge badge-danger font-mono text-2xs">
            ERR_500_SERVICE_OFFLINE
          </span>
        </div>
      )}

      {/* Main Sandbox Showcase */}
      <main className="flex-1 max-w-4xl w-full mx-auto p-6 md:p-8 flex flex-col justify-center">
        {step === 1 && (
          <div className="card p-6 md:p-8 grid md:grid-cols-2 gap-8 items-center relative">
            {/* Mode Indicator Pill */}
            <div className="absolute top-4 right-4 flex items-center gap-1.5">
              <span className="text-2xs font-mono text-ink-tertiary">Mode:</span>
              <span className={`badge text-2xs font-mono ${
                mode === 'standard' ? 'badge-neutral' :
                mode === 'mutated' ? 'badge-brand' :
                mode === 'chaos' ? 'badge-warning' : 
                'badge-danger'
              }`}>
                {mode.toUpperCase()}
              </span>
            </div>

            {/* Product Image Box */}
            <div className="flex flex-col items-center justify-center bg-surface border border-border rounded-xl p-8">
              <div className="w-40 h-40 rounded-xl bg-gradient-to-tr from-brand-light via-white to-surface border border-border flex items-center justify-center shadow-inner relative">
                <Package className="w-16 h-16 text-brand" />
              </div>
              <div className="mt-4 flex gap-2">
                <span className="badge badge-neutral text-2xs font-mono">Bluetooth 5.4</span>
                <span className="badge badge-neutral text-2xs font-mono">45h Battery</span>
                <span className="badge badge-success text-2xs font-mono">ANC Active</span>
              </div>
            </div>

            {/* Product Info & Actions */}
            <div className="flex flex-col space-y-4">
              <div>
                <p className="text-2xs font-bold uppercase tracking-wider text-brand">Studio Acoustics Series</p>
                <h1 className="text-2xl font-extrabold text-ink tracking-tight mt-1">Quantum Studio Headphones</h1>
                <p className="text-xs text-ink-secondary mt-1.5 leading-relaxed">
                  Studio-grade spatial acoustic drivers with adaptive algorithmic noise cancellation and ultra-low latency DAC.
                </p>
              </div>

              {/* Price Tag with Bug Simulation */}
              <div className="flex items-baseline gap-3">
                <span className="text-2xl font-extrabold text-ink font-mono">
                  {isBug ? '$0.00' : '$149.00'}
                </span>
                {isBug && (
                  <span className="badge badge-danger text-2xs font-mono font-bold">
                    Pricing Regression ($0)
                  </span>
                )}
                {!isBug && <span className="text-xs text-ink-tertiary line-through font-mono">$229.00</span>}
                <span className="badge badge-success text-2xs font-mono">In Stock</span>
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
                  className={`btn w-full ${isMutated ? 'btn-primary' : 'bg-gray-900 hover:bg-black text-white'}`}
                >
                  {itemAddedToast ? (
                    <>
                      <Check className="w-4 h-4 text-green-300" />
                      <span>Item Added to Bag!</span>
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
                  className="btn btn-secondary w-full"
                >
                  <span>{viewCartText}</span>
                  <span className="badge badge-neutral text-2xs font-mono">
                    Bag ({cartCount})
                  </span>
                </button>

                {/* Inspectable Target Selector */}
                <div className="text-2xs font-mono text-ink-secondary bg-surface p-2 rounded-lg border border-border flex items-center justify-between">
                  <span>DOM Selector ID:</span>
                  <span className="text-brand font-bold">#{addToCartId}</span>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* STEP 2: Checkout Drawer / Form */}
        {step === 2 && (
          <div className="card p-6 md:p-8 max-w-xl mx-auto w-full space-y-5">
            <div className="flex items-center justify-between pb-3 border-b border-border">
              <div className="flex items-center gap-2">
                <ShoppingBag className="w-4 h-4 text-brand" />
                <h2 className="text-base font-bold text-ink">Checkout Details</h2>
              </div>
              <button 
                id={viewCartId}
                className="text-xs text-brand hover:underline font-mono"
              >
                {viewCartText}
              </button>
            </div>

            <div className="p-3.5 rounded-lg bg-surface border border-border flex items-center justify-between">
              <div>
                <p className="font-semibold text-xs text-ink">Quantum Studio Headphones</p>
                <p className="text-2xs text-ink-secondary">Qty: 1 • Spatial Edition</p>
              </div>
              <span className="text-sm font-bold text-ink font-mono">
                {isBug ? '$0.00' : '$149.00'}
              </span>
            </div>

            {/* Form Fields */}
            <div className="space-y-3.5">
              <div>
                <label className="block text-xs font-semibold text-ink mb-1 flex justify-between">
                  <span>Customer Email</span>
                  <span className="text-2xs font-mono text-ink-tertiary">#{emailFieldId}</span>
                </label>
                <input
                  id={emailFieldId}
                  name={isMutated ? 'buyer_email' : 'email'}
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="lokesh@hackwave.dev"
                  className="input input-mono"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-ink mb-1 flex justify-between">
                  <span>Shipping Address</span>
                  <span className="text-2xs font-mono text-ink-tertiary">#{addressFieldId}</span>
                </label>
                <input
                  id={addressFieldId}
                  name={isMutated ? 'delivery_addr' : 'address'}
                  type="text"
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  placeholder="Building 4, Tech Innovation Hub, Cyber City"
                  className="input input-mono"
                />
              </div>

              {/* Payment Submit Button */}
              <div className="pt-2">
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
                  className={`btn w-full ${
                    isBug
                      ? 'btn-danger opacity-80 cursor-not-allowed'
                      : isMutated
                      ? 'btn-primary'
                      : 'bg-gray-900 hover:bg-black text-white'
                  }`}
                >
                  <Lock className="w-3.5 h-3.5" />
                  <span>{isBug ? 'Payment Gateway Error (500 Regression)' : checkoutBtnText}</span>
                </button>
              </div>

              <div className="text-2xs font-mono text-ink-secondary bg-surface p-2 rounded-lg border border-border flex items-center justify-between">
                <span>Checkout Selector ID:</span>
                <span className="text-brand font-bold">#{checkoutBtnId}</span>
              </div>
            </div>
          </div>
        )}

        {/* STEP 3: Order Confirmation */}
        {step === 3 && (
          <div className="card p-8 max-w-lg mx-auto w-full text-center space-y-4">
            <div className="w-12 h-12 rounded-full bg-success-bg border border-success-border flex items-center justify-center mx-auto text-success">
              <CheckCircle2 className="w-6 h-6" />
            </div>

            <span 
              id="order-success-badge" 
              className="badge badge-success text-2xs font-mono font-bold"
            >
              Order Confirmed
            </span>

            <h2 className="text-xl font-bold text-ink">Purchase Completed Successfully</h2>
            <p className="text-xs text-ink-secondary leading-relaxed">
              End-to-end checkout workflow verified. Confirmation Reference: <span className="font-mono text-brand font-bold">#HW-90214-X</span>
            </p>

            <div className="pt-4 border-t border-border flex justify-center gap-2">
              <button
                onClick={resetStore}
                className="btn btn-secondary btn-sm"
              >
                Run Another Test
              </button>
              <Link
                to="/"
                className="btn btn-primary btn-sm"
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
