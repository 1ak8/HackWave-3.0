import React, { useState, useEffect, useRef } from 'react';
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
  Package,
  Terminal,
  Zap,
  Play,
  ShieldAlert,
  Shuffle,
  Trash2,
  Cpu,
  ChevronRight,
  Info
} from 'lucide-react';
import { useTests } from '../context/TestContext';

export default function DemoStore() {
  const [searchParams, setSearchParams] = useSearchParams();
  const urlMode = searchParams.get('mode') || 'standard';

  const { tests, activeRun, triggerRun, terminalLogs, clearLogs } = useTests();
  const defaultTest = tests[0] || null;

  // Mode: 'standard' | 'mutated' | 'chaos' | 'bug_mode'
  const [mode, setMode] = useState(urlMode);

  // Chaos tweaks
  const [chaosText, setChaosText] = useState(false);
  const [chaosPosition, setChaosPosition] = useState(false);
  const [chaosClasses, setChaosClasses] = useState(false);
  const [chaosSeed, setChaosSeed] = useState(0);

  // E-commerce store states
  const [cartCount, setCartCount] = useState(0);
  const [storeStep, setStoreStep] = useState(1); // 1: Product, 2: Checkout Form, 3: Confirmation
  const [email, setEmail] = useState('');
  const [address, setAddress] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [itemAddedToast, setItemAddedToast] = useState(false);
  const [bugHaltToast, setBugHaltToast] = useState(false);

  // Inspector Panel Tab: 'pipeline' | 'terminal'
  const [inspectorTab, setInspectorTab] = useState('pipeline');
  const [isBotRunning, setIsBotRunning] = useState(false);

  // Interactive step tracker state for manual testing
  const [manualSteps, setManualSteps] = useState([
    { order: 1, name: 'Select Product', intent: 'Add headphones to bag', status: 'pending', orig: '#btn-add-to-cart', healed: null, confidence: null, error: null },
    { order: 2, name: 'Open Shopping Bag', intent: 'Open checkout drawer', status: 'pending', orig: '#btn-view-cart', healed: null, confidence: null, error: null },
    { order: 3, name: 'Enter Buyer Email', intent: 'Fill customer contact email', status: 'pending', orig: '#input-checkout-email', healed: null, confidence: null, error: null },
    { order: 4, name: 'Enter Shipping Address', intent: 'Fill destination delivery address', status: 'pending', orig: '#input-checkout-address', healed: null, confidence: null, error: null },
    { order: 5, name: 'Authorize Payment', intent: 'Authorize card and charge $149', status: 'pending', orig: '#btn-complete-order', healed: null, confidence: null, error: null },
    { order: 6, name: 'Order Confirmation', intent: 'Verify successful order badge', status: 'pending', orig: '#order-success-badge', healed: null, confidence: null, error: null }
  ]);

  const terminalEndRef = useRef(null);

  useEffect(() => {
    if (urlMode) {
      setMode(urlMode);
    }
  }, [urlMode]);

  useEffect(() => {
    terminalEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [terminalLogs]);

  // Reset store and step pipeline
  const resetStore = () => {
    setCartCount(0);
    setStoreStep(1);
    setEmail('');
    setAddress('');
    setIsProcessing(false);
    setItemAddedToast(false);
    setBugHaltToast(false);
    setManualSteps([
      { order: 1, name: 'Select Product', intent: 'Add headphones to bag', status: 'pending', orig: '#btn-add-to-cart', healed: null, confidence: null, error: null },
      { order: 2, name: 'Open Shopping Bag', intent: 'Open checkout drawer', status: 'pending', orig: '#btn-view-cart', healed: null, confidence: null, error: null },
      { order: 3, name: 'Enter Buyer Email', intent: 'Fill customer contact email', status: 'pending', orig: '#input-checkout-email', healed: null, confidence: null, error: null },
      { order: 4, name: 'Enter Shipping Address', intent: 'Fill destination delivery address', status: 'pending', orig: '#input-checkout-address', healed: null, confidence: null, error: null },
      { order: 5, name: 'Authorize Payment', intent: 'Authorize card and charge $149', status: 'pending', orig: '#btn-complete-order', healed: null, confidence: null, error: null },
      { order: 6, name: 'Order Confirmation', intent: 'Verify successful order badge', status: 'pending', orig: '#order-success-badge', healed: null, confidence: null, error: null }
    ]);
  };

  const handleModeChange = (newMode) => {
    setMode(newMode);
    setSearchParams({ mode: newMode });
    resetStore();
  };

  const isMutated = mode === 'mutated' || mode === 'chaos';
  const isBug = mode === 'bug_mode';

  // Dynamic selector computations
  const addToCartId = isMutated || chaosClasses 
    ? (chaosSeed > 0 ? `dynamic_cart_btn_${chaosSeed}` : 'dynamic_btn_cart_x89') 
    : 'btn-add-to-cart';

  const addToCartText = chaosText 
    ? 'Grab Deal Now!' 
    : (isMutated ? 'Claim Headphones Now' : 'Add to Bag');

  const viewCartId = isMutated || chaosClasses 
    ? (chaosSeed > 0 ? `nav_bag_trigger_${chaosSeed}` : 'nav_bag_trigger_92') 
    : 'btn-view-cart';

  const viewCartText = isMutated ? 'Proceed to Bag' : 'View Bag & Checkout';

  const checkoutBtnId = isMutated || chaosClasses 
    ? (chaosSeed > 0 ? `auth_pay_action_${chaosSeed}` : 'checkout_action_auth_pay') 
    : 'btn-complete-order';

  const checkoutBtnText = chaosText 
    ? 'Authorize & Charge' 
    : (isMutated ? 'Complete Payment ($149.00)' : 'Place Order');

  const emailFieldId = isMutated || chaosClasses 
    ? (chaosSeed > 0 ? `customer_email_${chaosSeed}` : 'customer_email_contact') 
    : 'input-checkout-email';

  const addressFieldId = isMutated || chaosClasses 
    ? (chaosSeed > 0 ? `shipping_dest_${chaosSeed}` : 'shipping_dest_address') 
    : 'input-checkout-address';

  // Trigger manual step progression when user clicks in UI
  const markStepDone = (order, isFailure = false, errorMsg = null) => {
    setManualSteps(prev => prev.map(s => {
      if (s.order === order) {
        if (isFailure) {
          return {
            ...s,
            status: 'failed',
            error: errorMsg || 'Genuine application regression encountered (500 Error)'
          };
        }
        if (mode === 'standard') {
          return { ...s, status: 'passed' };
        } else {
          // Mutated or Chaos: mark healed with resolved selector
          let healedSel = s.orig;
          if (order === 1) healedSel = `#${addToCartId}`;
          if (order === 2) healedSel = `#${viewCartId}`;
          if (order === 3) healedSel = `#${emailFieldId}`;
          if (order === 4) healedSel = `#${addressFieldId}`;
          if (order === 5) healedSel = `#${checkoutBtnId}`;
          if (order === 6) healedSel = '#order-success-badge';

          return {
            ...s,
            status: order === 6 ? 'passed' : 'healed',
            healed: healedSel,
            confidence: Math.floor(Math.random() * 5) + 94
          };
        }
      }
      return s;
    }));
  };

  // Automated E2E Bot execution
  const runAutomatedBot = async () => {
    setIsBotRunning(true);
    resetStore();
    try {
      await triggerRun(defaultTest?._id, mode, true);
    } catch (err) {
      console.error(err);
    } finally {
      setIsBotRunning(false);
    }
  };

  // Determine which steps to show in the pipeline:
  // If activeRun is recent and running/completed in this mode, use activeRun.steps, else manualSteps
  const displayedSteps = (activeRun && activeRun.mode === mode && activeRun.steps && activeRun.steps.length > 0)
    ? activeRun.steps.map(s => ({
        order: s.order,
        name: s.name,
        intent: s.intent,
        status: s.status,
        orig: s.originalSelector,
        healed: s.resolvedSelector,
        confidence: s.healingDetails?.confidence,
        error: s.error || (s.healingDetails?.classification === 'Genuine_Bug' ? s.healingDetails.reasoning : null)
      }))
    : manualSteps;

  const getTagBadge = (type) => {
    switch (type) {
      case 'healing':
        return <span className="text-2xs font-bold px-1.5 py-0.5 rounded bg-amber-950 text-amber-400 border border-amber-800 font-mono">HEAL</span>;
      case 'success':
        return <span className="text-2xs font-bold px-1.5 py-0.5 rounded bg-emerald-950 text-emerald-400 border border-emerald-800 font-mono">PASS</span>;
      case 'error':
        return <span className="text-2xs font-bold px-1.5 py-0.5 rounded bg-red-950 text-red-400 border border-red-800 font-mono">FAIL</span>;
      case 'warn':
        return <span className="text-2xs font-bold px-1.5 py-0.5 rounded bg-amber-950 text-amber-400 border border-amber-800 font-mono">WARN</span>;
      case 'chaos':
        return <span className="text-2xs font-bold px-1.5 py-0.5 rounded bg-rose-950 text-rose-400 border border-rose-800 font-mono">CHAOS</span>;
      default:
        return <span className="text-2xs font-bold px-1.5 py-0.5 rounded bg-indigo-950 text-indigo-400 border border-indigo-800 font-mono">INFO</span>;
    }
  };

  return (
    <div className="min-h-screen bg-surface text-ink flex flex-col font-sans">
      {/* Top Header */}
      <header className="border-b border-border bg-white sticky top-0 z-50 px-6 py-3 flex items-center justify-between shadow-xs">
        <div className="flex items-center gap-4">
          <Link 
            to="/" 
            className="btn btn-secondary btn-sm flex items-center gap-1.5"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Dashboard</span>
          </Link>

          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-success"></span>
            <span className="font-bold text-base tracking-tight text-ink">Apex Audio Testing Arena</span>
            <span className="badge badge-brand text-xs font-mono font-bold">Interactive Sandbox</span>
          </div>
        </div>

        {/* 4 Mode Switcher Tabs */}
        <div className="flex items-center p-1 rounded-xl bg-surface border border-border">
          <button
            onClick={() => handleModeChange('standard')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
              mode === 'standard' 
                ? 'bg-white text-ink shadow-xs border border-border' 
                : 'text-ink-secondary hover:text-ink'
            }`}
          >
            Version A (Base)
          </button>
          <button
            onClick={() => handleModeChange('mutated')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
              mode === 'mutated' 
                ? 'bg-brand text-white shadow-xs' 
                : 'text-ink-secondary hover:text-ink'
            }`}
          >
            Version B (Auto-Heal)
          </button>
          <button
            onClick={() => handleModeChange('chaos')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1 ${
              mode === 'chaos' 
                ? 'bg-amber-500 text-white shadow-xs' 
                : 'text-ink-secondary hover:text-ink'
            }`}
          >
            <Flame className="w-3.5 h-3.5" />
            Live Chaos
          </button>
          <button
            onClick={() => handleModeChange('bug_mode')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1 ${
              mode === 'bug_mode' 
                ? 'bg-danger text-white shadow-xs' 
                : 'text-ink-secondary hover:text-ink'
            }`}
          >
            <AlertTriangle className="w-3.5 h-3.5" />
            Real Bug
          </button>
        </div>

        {/* Action Controls */}
        <div className="flex items-center gap-2">
          <button
            onClick={runAutomatedBot}
            disabled={isBotRunning}
            className="btn btn-primary btn-sm flex items-center gap-1.5 font-bold shadow-sm"
            title="Trigger headless Playwright bot to execute the test suite"
          >
            <Zap className={`w-3.5 h-3.5 fill-current ${isBotRunning ? 'animate-spin' : ''}`} />
            <span>{isBotRunning ? 'Bot Running...' : 'Auto-Run E2E Bot'}</span>
          </button>

          <button 
            onClick={resetStore}
            className="btn btn-ghost btn-sm flex items-center gap-1 text-ink-secondary"
            title="Reset Store and Step Pipeline"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Reset</span>
          </button>
        </div>
      </header>

      {/* Mode Guidance Sub-Bar */}
      <div className={`px-6 py-2.5 border-b text-xs flex items-center justify-between font-medium ${
        mode === 'standard' ? 'bg-gray-50 border-gray-200 text-ink-secondary' :
        mode === 'mutated' ? 'bg-indigo-50 border-indigo-200 text-indigo-900' :
        mode === 'chaos' ? 'bg-amber-50 border-amber-200 text-amber-900' :
        'bg-red-50 border-red-200 text-red-900'
      }`}>
        <div className="flex items-center gap-2">
          <Info className="w-4 h-4 shrink-0" />
          {mode === 'standard' && (
            <span><strong>Version A Mode:</strong> Unmodified baseline store. Click through the order flow below to see all steps pass normally.</span>
          )}
          {mode === 'mutated' && (
            <span><strong>Version B Mode (Auto-Heal):</strong> Button IDs and names have been mutated by developers. Watch the right panel dynamically heal them in real time!</span>
          )}
          {mode === 'chaos' && (
            <span><strong>Live Chaos Mode:</strong> Toggle mutations or click "Shuffle Now" to scramble elements while testing. AI uses semantic intent to heal!</span>
          )}
          {mode === 'bug_mode' && (
            <span><strong>Real Bug Mode (Smart Triage):</strong> Cart price is corrupted ($0.00) & Payment endpoint returns 500. AI halts and REFUSES to heal real bugs!</span>
          )}
        </div>

        {mode === 'chaos' && (
          <div className="flex items-center gap-3">
            <button
              onClick={() => setChaosSeed(prev => prev + 1)}
              className="btn btn-xs bg-amber-600 hover:bg-amber-700 text-white font-bold flex items-center gap-1"
            >
              <Shuffle className="w-3 h-3" />
              <span>Shuffle Now 🎲</span>
            </button>
            <label className="flex items-center gap-1 text-xs cursor-pointer">
              <input 
                type="checkbox" 
                checked={chaosText} 
                onChange={(e) => setChaosText(e.target.checked)} 
                className="accent-amber-600 rounded" 
              />
              <span>Scramble Text</span>
            </label>
            <label className="flex items-center gap-1 text-xs cursor-pointer">
              <input 
                type="checkbox" 
                checked={chaosPosition} 
                onChange={(e) => setChaosPosition(e.target.checked)} 
                className="accent-amber-600 rounded" 
              />
              <span>Invert Order</span>
            </label>
          </div>
        )}
      </div>

      {/* Dual-Pane Arena: Store on Left (55%), Live Inspector on Right (45%) */}
      <div className="flex-1 max-w-7xl w-full mx-auto p-6 grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        
        {/* ================= LEFT PANE: Interactive E-Commerce Sandbox Store (7 cols) ================= */}
        <div className="lg:col-span-7 space-y-4">
          <div className="flex items-center justify-between pb-1">
            <h2 className="text-base font-bold text-ink flex items-center gap-2">
              <ShoppingBag className="w-4 h-4 text-brand" />
              <span>Target Application UI</span>
            </h2>
            <span className="text-xs text-ink-tertiary">
              Step {storeStep} of 3
            </span>
          </div>

          {/* STORE STEP 1: Product Showcase */}
          {storeStep === 1 && (
            <div className="card p-6 md:p-8 space-y-6 shadow-card">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-center">
                {/* Product Image */}
                <div className="bg-surface border border-border rounded-xl p-8 flex flex-col items-center justify-center">
                  <div className="w-36 h-36 rounded-xl bg-gradient-to-tr from-brand-light via-white to-surface border border-border flex items-center justify-center shadow-inner">
                    <Package className="w-16 h-16 text-brand" />
                  </div>
                  <div className="mt-4 flex gap-2">
                    <span className="badge badge-neutral text-2xs font-mono">Bluetooth 5.4</span>
                    <span className="badge badge-success text-2xs font-mono font-bold">In Stock</span>
                  </div>
                </div>

                {/* Product Info */}
                <div className="space-y-4">
                  <div>
                    <span className="badge badge-brand text-2xs font-bold">Studio Audio Series</span>
                    <h3 className="text-2xl font-extrabold text-ink tracking-tight mt-1">Quantum Studio Headphones</h3>
                    <p className="text-xs text-ink-secondary mt-1 leading-relaxed">
                      Spatial acoustic drivers with adaptive algorithmic active noise cancellation.
                    </p>
                  </div>

                  <div className="flex items-baseline gap-3">
                    <span className="text-3xl font-extrabold text-ink font-mono">
                      {isBug ? '$0.00' : '$149.00'}
                    </span>
                    {isBug && (
                      <span className="badge badge-danger text-xs font-mono font-bold">
                        Pricing Regression ($0)
                      </span>
                    )}
                    {!isBug && <span className="text-xs text-ink-tertiary line-through font-mono">$229.00</span>}
                  </div>

                  {/* DOM ID Badge Preview */}
                  <div className="bg-surface p-2.5 rounded-lg border border-border text-xs font-mono flex items-center justify-between">
                    <span className="text-ink-secondary text-2xs font-semibold">Live Add-to-Cart ID:</span>
                    <span className="font-bold text-brand">#{addToCartId}</span>
                  </div>

                  {/* Buttons */}
                  <div className={`space-y-2 pt-1 ${chaosPosition ? 'flex flex-col-reverse' : ''}`}>
                    <button
                      id={addToCartId}
                      data-testid="add-to-cart-action"
                      onClick={() => {
                        setCartCount(prev => Math.max(1, prev + 1));
                        setItemAddedToast(true);
                        markStepDone(1);
                        setTimeout(() => setItemAddedToast(false), 2000);
                      }}
                      className={`btn w-full py-3 text-sm font-bold shadow-sm ${
                        isMutated ? 'btn-primary' : 'bg-gray-900 hover:bg-black text-white'
                      }`}
                    >
                      {itemAddedToast ? (
                        <>
                          <Check className="w-4 h-4 text-green-300" />
                          <span>Added to Bag! (Step 1 Completed)</span>
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
                      onClick={() => {
                        setStoreStep(2);
                        markStepDone(2);
                      }}
                      className="btn btn-secondary w-full py-2.5 text-sm font-semibold"
                    >
                      <span>{viewCartText}</span>
                      <span className="badge badge-neutral text-xs font-mono font-bold ml-1">
                        Bag ({cartCount})
                      </span>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* STORE STEP 2: Checkout Form */}
          {storeStep === 2 && (
            <div className="card p-6 md:p-8 space-y-5 shadow-card">
              <div className="flex items-center justify-between pb-3 border-b border-border">
                <div className="flex items-center gap-2">
                  <ShoppingBag className="w-4 h-4 text-brand" />
                  <h3 className="text-base font-bold text-ink">Checkout & Payment</h3>
                </div>
                <button
                  id={viewCartId}
                  className="text-xs text-brand font-mono font-semibold hover:underline"
                >
                  {viewCartText}
                </button>
              </div>

              {/* Order Summary */}
              <div className="p-3.5 rounded-lg bg-surface border border-border flex items-center justify-between">
                <div>
                  <p className="font-semibold text-sm text-ink">Quantum Studio Headphones</p>
                  <p className="text-xs text-ink-secondary">Qty: 1 • Spatial Studio Edition</p>
                </div>
                <span className="text-base font-bold text-ink font-mono">
                  {isBug ? '$0.00' : '$149.00'}
                </span>
              </div>

              {/* Form Fields */}
              <div className="space-y-4">
                <div>
                  <label className="block text-xs font-bold text-ink mb-1 flex justify-between">
                    <span>Customer Email (Step 3)</span>
                    <span className="text-xs font-mono text-ink-tertiary">#{emailFieldId}</span>
                  </label>
                  <input
                    id={emailFieldId}
                    name={isMutated ? 'buyer_email' : 'email'}
                    type="email"
                    value={email}
                    onChange={(e) => {
                      setEmail(e.target.value);
                      markStepDone(3);
                    }}
                    placeholder="lokesh@hackwave.dev"
                    className="input input-mono text-xs"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-ink mb-1 flex justify-between">
                    <span>Shipping Address (Step 4)</span>
                    <span className="text-xs font-mono text-ink-tertiary">#{addressFieldId}</span>
                  </label>
                  <input
                    id={addressFieldId}
                    name={isMutated ? 'delivery_addr' : 'address'}
                    type="text"
                    value={address}
                    onChange={(e) => {
                      setAddress(e.target.value);
                      markStepDone(4);
                    }}
                    placeholder="Building 4, Tech Innovation Hub, Cyber City"
                    className="input input-mono text-xs"
                  />
                </div>

                {/* Payment Submit Button */}
                <div className="pt-2">
                  <button
                    id={checkoutBtnId}
                    disabled={isProcessing}
                    onClick={() => {
                      setIsProcessing(true);
                      setTimeout(() => {
                        setIsProcessing(false);
                        if (isBug) {
                          setBugHaltToast(true);
                          markStepDone(5, true, 'HTTP 500 Payment Gateway Timeout & $0.00 Price Anomaly');
                        } else {
                          setStoreStep(3);
                          markStepDone(5);
                          markStepDone(6);
                        }
                      }, 500);
                    }}
                    className={`btn w-full py-3.5 text-sm font-bold shadow-sm ${
                      isBug
                        ? 'btn-danger'
                        : isMutated
                        ? 'btn-primary'
                        : 'bg-gray-900 hover:bg-black text-white'
                    }`}
                  >
                    <Lock className="w-4 h-4" />
                    <span>{isBug ? 'Authorize & Pay ($0.00) — Triggers 500 Crash' : checkoutBtnText}</span>
                  </button>
                </div>

                {bugHaltToast && (
                  <div className="p-3 rounded-lg bg-red-100 border border-red-300 text-danger text-xs space-y-1">
                    <p className="font-bold flex items-center gap-1.5">
                      <AlertTriangle className="w-4 h-4" />
                      HTTP 500 Internal Server Error & Corrupted Price
                    </p>
                    <p>
                      The AI Smart Triage detected that this is NOT a selector rename. The payment service crashed and price was corrupted. <strong>AI refused to heal this step!</strong> Check the right panel.
                    </p>
                  </div>
                )}

                <div className="bg-surface p-2 rounded-lg border border-border text-xs font-mono flex items-center justify-between">
                  <span className="text-ink-secondary text-2xs">Payment Action ID:</span>
                  <span className="font-bold text-brand">#{checkoutBtnId}</span>
                </div>
              </div>
            </div>
          )}

          {/* STORE STEP 3: Order Confirmation */}
          {storeStep === 3 && (
            <div className="card p-8 text-center space-y-4 shadow-card">
              <div className="w-14 h-14 rounded-full bg-success-bg border border-success-border flex items-center justify-center mx-auto text-success">
                <CheckCircle2 className="w-7 h-7" />
              </div>

              <span 
                id="order-success-badge" 
                className="badge badge-success text-xs font-mono font-bold px-3 py-1"
              >
                Order Confirmed
              </span>

              <h3 className="text-2xl font-bold text-ink">Purchase Completed Successfully</h3>
              <p className="text-xs text-ink-secondary">
                Workflow verified end-to-end. Tracking ID: <span className="font-mono text-brand font-bold">#HW-90214-X</span>
              </p>

              <div className="pt-4 border-t border-border flex justify-center gap-3">
                <button
                  onClick={resetStore}
                  className="btn btn-secondary btn-sm"
                >
                  Run Another Test
                </button>
                <button
                  onClick={runAutomatedBot}
                  className="btn btn-primary btn-sm flex items-center gap-1.5"
                >
                  <Zap className="w-3.5 h-3.5 fill-current" />
                  <span>Auto-Run with Bot</span>
                </button>
              </div>
            </div>
          )}
        </div>

        {/* ================= RIGHT PANE: Live Autonomous Inspector & Telemetry Logs (5 cols) ================= */}
        <div className="lg:col-span-5 space-y-3 sticky top-20">
          {/* Right Pane Tab Switcher */}
          <div className="card p-1.5 flex items-center justify-between bg-white shadow-xs">
            <div className="flex items-center gap-1">
              <button
                onClick={() => setInspectorTab('pipeline')}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition flex items-center gap-1.5 ${
                  inspectorTab === 'pipeline'
                    ? 'bg-brand text-white shadow-xs'
                    : 'text-ink-secondary hover:text-ink hover:bg-gray-100'
                }`}
              >
                <Zap className="w-3.5 h-3.5" />
                <span>Live Test Pipeline</span>
              </button>

              <button
                onClick={() => setInspectorTab('terminal')}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition flex items-center gap-1.5 ${
                  inspectorTab === 'terminal'
                    ? 'bg-gray-900 text-white shadow-xs'
                    : 'text-ink-secondary hover:text-ink hover:bg-gray-100'
                }`}
              >
                <Terminal className="w-3.5 h-3.5" />
                <span>Real-Time Logs ({terminalLogs.length})</span>
              </button>
            </div>

            {inspectorTab === 'terminal' && (
              <button
                onClick={clearLogs}
                className="btn btn-ghost btn-xs text-ink-tertiary"
                title="Clear Logs"
              >
                <Trash2 className="w-3 h-3" />
              </button>
            )}
          </div>

          {/* TAB 1: Live Step Pipeline & AI Diff */}
          {inspectorTab === 'pipeline' && (
            <div className="card p-5 space-y-3.5 shadow-card max-h-[620px] overflow-y-auto scrollbar-thin">
              <div className="flex items-center justify-between pb-2 border-b border-border">
                <div>
                  <h3 className="text-sm font-bold text-ink">E2E Test Steps & Healing State</h3>
                  <p className="text-xs text-ink-secondary">Updates in real-time as you click or run bot</p>
                </div>
                <span className="text-xs font-mono font-bold px-2 py-0.5 rounded bg-surface border border-border">
                  {mode.toUpperCase()}
                </span>
              </div>

              {/* Steps List */}
              <div className="space-y-2.5">
                {displayedSteps.map((s) => {
                  const isPassed = s.status === 'passed';
                  const isHealed = s.status === 'healed';
                  const isFailed = s.status === 'failed';
                  const isPending = s.status === 'pending';

                  return (
                    <div
                      key={s.order}
                      className={`p-3 rounded-xl border transition-all text-xs space-y-2 ${
                        isHealed ? 'border-indigo-300 bg-brand-light/30' :
                        isPassed ? 'border-success-border bg-success-bg/30' :
                        isFailed ? 'border-danger-border bg-danger-bg/40' :
                        'border-border bg-surface'
                      }`}
                    >
                      {/* Step Header */}
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <span className="w-5 h-5 rounded-md bg-white border border-border flex items-center justify-center font-mono font-bold text-2xs text-ink-secondary">
                            {s.order}
                          </span>
                          <span className="font-bold text-ink text-xs">{s.name}</span>
                        </div>

                        {/* Status Badges */}
                        <div>
                          {isHealed && (
                            <span className="badge badge-brand text-2xs font-bold">
                              <Sparkles className="w-3 h-3" />
                              AUTO-HEALED {s.confidence ? `(${s.confidence}%)` : ''}
                            </span>
                          )}
                          {isPassed && (
                            <span className="badge badge-success text-2xs font-bold">
                              <CheckCircle2 className="w-3 h-3" />
                              PASSED
                            </span>
                          )}
                          {isFailed && (
                            <span className="badge badge-danger text-2xs font-bold">
                              <AlertTriangle className="w-3 h-3" />
                              BUG HALTED
                            </span>
                          )}
                          {isPending && (
                            <span className="badge badge-neutral text-2xs">
                              Waiting...
                            </span>
                          )}
                        </div>
                      </div>

                      {/* Goal */}
                      <p className="text-2xs text-ink-secondary">
                        Goal: <span className="text-ink font-semibold">{s.intent}</span>
                      </p>

                      {/* Selector Diff Box */}
                      {isHealed && (
                        <div className="bg-white p-2 rounded-lg border border-indigo-200 font-mono text-2xs space-y-1">
                          <div className="flex items-center justify-between text-danger">
                            <span>- Broken:</span>
                            <span className="line-through font-bold">{s.orig}</span>
                          </div>
                          <div className="flex items-center justify-between text-success-text font-bold">
                            <span>+ Healed:</span>
                            <span>{s.healed}</span>
                          </div>
                        </div>
                      )}

                      {/* Passed Clean Selector */}
                      {isPassed && !isHealed && (
                        <div className="bg-white p-1.5 rounded border border-border font-mono text-2xs text-ink-secondary flex items-center justify-between">
                          <span>Selector:</span>
                          <span className="font-bold text-ink">{s.orig}</span>
                        </div>
                      )}

                      {/* Bug Triage Explanation */}
                      {isFailed && (
                        <div className="bg-red-50 p-2.5 rounded-lg border border-red-200 text-danger text-2xs space-y-1">
                          <p className="font-bold flex items-center gap-1">
                            <ShieldAlert className="w-3.5 h-3.5 shrink-0" />
                            Smart Triage Refused to Heal
                          </p>
                          <p className="leading-relaxed">
                            {s.error || '500 Server Regression & Corrupted Price ($0.00). Test safely halted to prevent shipping broken payment code!'}
                          </p>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* TAB 2: Real-Time Playwright Telemetry Logs Terminal */}
          {inspectorTab === 'terminal' && (
            <div className="card bg-gray-950 border-gray-800 text-gray-200 font-mono shadow-card overflow-hidden flex flex-col h-[580px]">
              {/* Terminal Title Bar */}
              <div className="bg-gray-900/90 px-4 py-2.5 border-b border-gray-800 flex items-center justify-between select-none">
                <div className="flex items-center gap-2">
                  <div className="flex gap-1.5">
                    <span className="w-2.5 h-2.5 rounded-full bg-red-500"></span>
                    <span className="w-2.5 h-2.5 rounded-full bg-amber-500"></span>
                    <span className="w-2.5 h-2.5 rounded-full bg-green-500"></span>
                  </div>
                  <span className="text-xs text-gray-300 font-bold font-sans ml-2">
                    Live Telemetry Stream
                  </span>
                </div>
                <span className="text-2xs text-gray-500 font-mono">{terminalLogs.length} events</span>
              </div>

              {/* Logs Stream */}
              <div className="p-3.5 overflow-y-auto flex-1 space-y-2 text-xs leading-relaxed scrollbar-thin">
                {terminalLogs.length === 0 ? (
                  <div className="text-gray-600 text-center py-16 italic font-sans text-xs">
                    Listening for browser events... Click buttons in the store or click "Auto-Run E2E Bot" to stream live logs.
                  </div>
                ) : (
                  terminalLogs.map((log, index) => (
                    <div key={index} className="flex items-start gap-2 hover:bg-gray-900/60 p-1 rounded font-mono text-2xs">
                      <span className="text-gray-500 select-none shrink-0 font-mono pt-0.5">
                        {log.timestamp}
                      </span>
                      <span className="shrink-0">
                        {getTagBadge(log.type)}
                      </span>
                      <span className={`break-all ${
                        log.type === 'error' ? 'text-red-400 font-semibold' :
                        log.type === 'healing' ? 'text-amber-300 font-semibold' :
                        log.type === 'success' ? 'text-emerald-400 font-semibold' : 'text-gray-300'
                      }`}>
                        {log.message}
                      </span>
                    </div>
                  ))
                )}
                <div ref={terminalEndRef} />
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
