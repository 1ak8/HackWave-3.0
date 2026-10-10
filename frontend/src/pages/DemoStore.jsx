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
      <header className="border-b border-border bg-white sticky top-0 z-50 px-6 sm:px-8 py-3.5 flex items-center justify-between shadow-xs">
        <div className="flex items-center gap-4">
          <Link 
            to="/" 
            className="btn btn-secondary btn-sm flex items-center gap-2"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back to Studio</span>
          </Link>

          <div className="flex items-center gap-2.5">
            <span className="w-2.5 h-2.5 rounded-full bg-success"></span>
            <span className="font-bold text-base tracking-tight text-ink">Apex Audio Sandbox</span>
            <span className="badge badge-brand text-xs font-mono font-semibold">Live Target App</span>
          </div>
        </div>

        {/* Clean Mode Switcher Tabs */}
        <div className="flex items-center p-1 rounded-lg bg-surface border border-border">
          <button
            onClick={() => { setMode('standard'); resetStore(); }}
            className={`px-3.5 py-1.5 rounded-md text-xs font-semibold transition-all ${
              mode === 'standard' 
                ? 'bg-white text-ink shadow-xs border border-border' 
                : 'text-ink-secondary hover:text-ink'
            }`}
          >
            Version A (Base)
          </button>
          <button
            onClick={() => { setMode('mutated'); resetStore(); }}
            className={`px-3.5 py-1.5 rounded-md text-xs font-semibold transition-all ${
              mode === 'mutated' 
                ? 'bg-brand text-white shadow-xs' 
                : 'text-ink-secondary hover:text-ink'
            }`}
          >
            Version B (Auto-Heal)
          </button>
          <button
            onClick={() => { setMode('chaos'); resetStore(); }}
            className={`px-3.5 py-1.5 rounded-md text-xs font-semibold transition-all flex items-center gap-1.5 ${
              mode === 'chaos' 
                ? 'bg-amber-500 text-white shadow-xs' 
                : 'text-ink-secondary hover:text-ink'
            }`}
          >
            <Flame className="w-3.5 h-3.5" />
            Chaos Mode
          </button>
          <button
            onClick={() => { setMode('bug_mode'); resetStore(); }}
            className={`px-3.5 py-1.5 rounded-md text-xs font-semibold transition-all flex items-center gap-1.5 ${
              mode === 'bug_mode' 
                ? 'bg-danger text-white shadow-xs' 
                : 'text-ink-secondary hover:text-ink'
            }`}
          >
            <AlertTriangle className="w-3.5 h-3.5" />
            Real Bug
          </button>
        </div>

        <button 
          onClick={resetStore}
          className="btn btn-ghost btn-sm flex items-center gap-1.5 text-ink-secondary"
          title="Reset Flow"
        >
          <RotateCcw className="w-3.5 h-3.5" />
          <span>Reset</span>
        </button>
      </header>

      {/* Live Chaos Mutation Toolbar */}
      {(mode === 'chaos' || mode === 'mutated') && (
        <div className="bg-warning-bg border-b border-warning-border px-8 py-2.5 flex items-center justify-between text-sm text-warning-text font-medium">
          <div className="flex items-center gap-2.5">
            <Flame className="w-4 h-4 text-amber-600 animate-pulse" />
            <span className="font-bold">Live Chaos Injections:</span>
            <span>Mutate the interface while Playwright test executes</span>
          </div>
          <div className="flex items-center gap-4 font-mono text-xs">
            <label className="flex items-center gap-2 cursor-pointer bg-white px-3 py-1.5 rounded-md border border-warning-border shadow-xs text-ink hover:bg-surface">
              <input 
                type="checkbox" 
                checked={chaosText} 
                onChange={(e) => setChaosText(e.target.checked)} 
                className="rounded accent-amber-500" 
              />
              <span>Mutate Text Labels</span>
            </label>
            <label className="flex items-center gap-2 cursor-pointer bg-white px-3 py-1.5 rounded-md border border-warning-border shadow-xs text-ink hover:bg-surface">
              <input 
                type="checkbox" 
                checked={chaosPosition} 
                onChange={(e) => setChaosPosition(e.target.checked)} 
                className="rounded accent-amber-500" 
              />
              <span>Shift Button Order</span>
            </label>
            <label className="flex items-center gap-2 cursor-pointer bg-white px-3 py-1.5 rounded-md border border-warning-border shadow-xs text-ink hover:bg-surface">
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
        <div className="bg-danger-bg border-b border-danger-border px-8 py-2.5 flex items-center justify-between text-sm text-danger-text">
          <div className="flex items-center gap-2.5">
            <AlertTriangle className="w-4 h-4 text-danger" />
            <span className="font-bold">Smart Triage Simulation Active:</span>
            <span>Cart pricing is corrupted ($0.00) & payment service returns 500 error. The AI engine must halt and REFUSE to heal!</span>
          </div>
          <span className="badge badge-danger font-mono text-xs font-bold">
            ERR_500_SERVICE_OFFLINE
          </span>
        </div>
      )}

      {/* Main Sandbox Showcase */}
      <main className="flex-1 max-w-5xl w-full mx-auto p-6 md:p-10 flex flex-col justify-center">
        {step === 1 && (
          <div className="card p-8 md:p-10 grid md:grid-cols-2 gap-10 items-center relative shadow-card-md">
            {/* Mode Indicator Pill */}
            <div className="absolute top-5 right-5 flex items-center gap-2">
              <span className="text-xs font-mono text-ink-tertiary">Mode:</span>
              <span className={`badge text-xs font-mono font-bold ${
                mode === 'standard' ? 'badge-neutral' :
                mode === 'mutated' ? 'badge-brand' :
                mode === 'chaos' ? 'badge-warning' : 
                'badge-danger'
              }`}>
                {mode.toUpperCase()}
              </span>
            </div>

            {/* Product Image Box */}
            <div className="flex flex-col items-center justify-center bg-surface border border-border rounded-2xl p-10">
              <div className="w-48 h-48 rounded-2xl bg-gradient-to-tr from-brand-light via-white to-surface border border-border flex items-center justify-center shadow-inner relative">
                <Package className="w-20 h-20 text-brand" />
              </div>
              <div className="mt-5 flex gap-2.5">
                <span className="badge badge-neutral text-xs font-mono">Bluetooth 5.4</span>
                <span className="badge badge-neutral text-xs font-mono">45h Battery</span>
                <span className="badge badge-success text-xs font-mono">ANC Active</span>
              </div>
            </div>

            {/* Product Info & Actions */}
            <div className="flex flex-col space-y-5">
              <div>
                <p className="text-xs font-bold uppercase tracking-wider text-brand">Studio Acoustics Series</p>
                <h1 className="text-3xl font-extrabold text-ink tracking-tight mt-1.5 leading-tight">Quantum Wireless Headphones</h1>
                <p className="text-sm text-ink-secondary mt-2 leading-relaxed">
                  Studio-grade spatial acoustic drivers with adaptive algorithmic noise cancellation and ultra-low latency DAC.
                </p>
              </div>

              {/* Price Tag with Bug Simulation */}
              <div className="flex items-baseline gap-3.5">
                <span className="text-3xl font-extrabold text-ink font-mono">
                  {isBug ? '$0.00' : '$149.00'}
                </span>
                {isBug && (
                  <span className="badge badge-danger text-xs font-mono font-bold">
                    Pricing Regression ($0)
                  </span>
                )}
                {!isBug && <span className="text-sm text-ink-tertiary line-through font-mono">$229.00</span>}
                <span className="badge badge-success text-xs font-mono font-bold">In Stock</span>
              </div>

              {/* Action Buttons */}
              <div className={`flex flex-col gap-3 pt-2 ${chaosPosition ? 'order-first' : ''}`}>
                <button
                  id={addToCartId}
                  data-testid="add-to-cart-action"
                  onClick={() => {
                    setCartCount(prev => Math.max(1, prev + 1));
                    setItemAddedToast(true);
                    setTimeout(() => setItemAddedToast(false), 2000);
                  }}
                  className={`btn w-full py-3 text-sm font-bold ${isMutated ? 'btn-primary' : 'bg-gray-900 hover:bg-black text-white'}`}
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
                  className="btn btn-secondary w-full py-2.5 text-sm font-semibold"
                >
                  <span>{viewCartText}</span>
                  <span className="badge badge-neutral text-xs font-mono font-bold ml-1">
                    Bag ({cartCount})
                  </span>
                </button>

                {/* Inspectable Target Selector */}
                <div className="text-xs font-mono text-ink-secondary bg-surface p-2.5 rounded-lg border border-border flex items-center justify-between">
                  <span>DOM Selector ID:</span>
                  <span className="text-brand font-bold">#{addToCartId}</span>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* STEP 2: Checkout Drawer / Form */}
        {step === 2 && (
          <div className="card p-8 md:p-10 max-w-xl mx-auto w-full space-y-6 shadow-card-md">
            <div className="flex items-center justify-between pb-4 border-b border-border">
              <div className="flex items-center gap-2.5">
                <ShoppingBag className="w-5 h-5 text-brand" />
                <h2 className="text-lg font-bold text-ink">Checkout Details</h2>
              </div>
              <button 
                id={viewCartId}
                className="text-xs text-brand hover:underline font-mono font-semibold"
              >
                {viewCartText}
              </button>
            </div>

            <div className="p-4 rounded-xl bg-surface border border-border flex items-center justify-between">
              <div>
                <p className="font-semibold text-sm text-ink">Quantum Wireless Headphones</p>
                <p className="text-xs text-ink-secondary mt-0.5">Qty: 1 • Spatial Studio Edition</p>
              </div>
              <span className="text-base font-bold text-ink font-mono">
                {isBug ? '$0.00' : '$149.00'}
              </span>
            </div>

            {/* Form Fields */}
            <div className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-ink mb-1.5 flex justify-between">
                  <span>Customer Email</span>
                  <span className="text-xs font-mono text-ink-tertiary">#{emailFieldId}</span>
                </label>
                <input
                  id={emailFieldId}
                  name={isMutated ? 'buyer_email' : 'email'}
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="lokesh@hackwave.dev"
                  className="input input-mono py-2.5"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-ink mb-1.5 flex justify-between">
                  <span>Shipping Address</span>
                  <span className="text-xs font-mono text-ink-tertiary">#{addressFieldId}</span>
                </label>
                <input
                  id={addressFieldId}
                  name={isMutated ? 'delivery_addr' : 'address'}
                  type="text"
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  placeholder="Building 4, Tech Innovation Hub, Cyber City"
                  className="input input-mono py-2.5"
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
                  className={`btn w-full py-3.5 text-sm font-bold ${
                    isBug
                      ? 'btn-danger opacity-80 cursor-not-allowed'
                      : isMutated
                      ? 'btn-primary'
                      : 'bg-gray-900 hover:bg-black text-white'
                  }`}
                >
                  <Lock className="w-4 h-4" />
                  <span>{isBug ? 'Payment Gateway Error (500 Regression)' : checkoutBtnText}</span>
                </button>
              </div>

              <div className="text-xs font-mono text-ink-secondary bg-surface p-2.5 rounded-lg border border-border flex items-center justify-between">
                <span>Checkout Selector ID:</span>
                <span className="text-brand font-bold">#{checkoutBtnId}</span>
              </div>
            </div>
          </div>
        )}

        {/* STEP 3: Order Confirmation */}
        {step === 3 && (
          <div className="card p-10 max-w-lg mx-auto w-full text-center space-y-5 shadow-card-md">
            <div className="w-16 h-16 rounded-full bg-success-bg border border-success-border flex items-center justify-center mx-auto text-success">
              <CheckCircle2 className="w-8 h-8" />
            </div>

            <span 
              id="order-success-badge" 
              className="badge badge-success text-xs font-mono font-bold px-3 py-1"
            >
              Order Confirmed
            </span>

            <h2 className="text-2xl font-bold text-ink tracking-tight">Purchase Completed Successfully</h2>
            <p className="text-sm text-ink-secondary leading-relaxed">
              End-to-end checkout workflow verified. Confirmation Reference: <span className="font-mono text-brand font-bold">#HW-90214-X</span>
            </p>

            <div className="pt-5 border-t border-border flex justify-center gap-3">
              <button
                onClick={resetStore}
                className="btn btn-secondary text-sm px-4 py-2"
              >
                Run Another Test
              </button>
              <Link
                to="/"
                className="btn btn-primary text-sm px-4 py-2"
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
