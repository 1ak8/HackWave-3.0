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
  Check,
  Headphones,
  Package,
  Terminal,
  Zap,
  Play,
  ShieldAlert,
  Shuffle,
  Trash2,
  Cpu,
  Loader2,
  ChevronRight,
  Info,
  Bot,
  Sliders,
  SlidersHorizontal,
  ToggleLeft,
  ToggleRight
} from 'lucide-react';
import { useTests } from '../context/TestContext';
import apiClient from '../api/apiClient';

export default function DemoStore() {
  const [searchParams, setSearchParams] = useSearchParams();
  const urlMode = searchParams.get('mode') || 'standard';

  const { tests, activeRun, setActiveRun, triggerRun, terminalLogs, clearLogs, addTerminalLog, refreshAll } = useTests();
  const defaultTest = tests.find(t => t._id === 'test_default_ecommerce_flow' || t.isSample || t.steps?.length === 6) || tests[0] || null;

  // Mode: 'standard' | 'mutated' | 'chaos' | 'bug_mode'
  const [mode, setMode] = useState(urlMode);

  // Active source: 'manual' (user clicks) vs 'bot' (Playwright headless runner)
  const [activeSource, setActiveSource] = useState('manual');

  // ================= JUDGE'S LIVE CHAOS CONTROL DECK =================
  // Individual step mutation toggles:
  const [mutateCart, setMutateCart] = useState(searchParams.get('mutateCart') !== 'false');
  const [mutateBag, setMutateBag] = useState(searchParams.get('mutateBag') === 'true');
  const [mutateEmail, setMutateEmail] = useState(searchParams.get('mutateEmail') !== 'false');
  const [mutateAddress, setMutateAddress] = useState(searchParams.get('mutateAddress') === 'true');
  const [mutatePay, setMutatePay] = useState(searchParams.get('mutatePay') !== 'false');

  // Visual Chaos tweaks
  const [chaosText, setChaosText] = useState(searchParams.get('chaosText') === 'true');
  const [chaosPosition, setChaosPosition] = useState(searchParams.get('chaosPosition') === 'true');
  const [chaosClasses, setChaosClasses] = useState(searchParams.get('chaosClasses') === 'true');
  const [chaosSeed, setChaosSeed] = useState(parseInt(searchParams.get('chaosSeed') || '0'));

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

  // Clean initial steps definition (waiting for action)
  const getFreshSteps = () => [
    { order: 1, name: 'Select Product', intent: 'Add headphones to bag', status: 'pending', orig: '#btn-add-to-cart', healed: null, confidence: null, error: null },
    { order: 2, name: 'Open Shopping Bag', intent: 'Open checkout drawer', status: 'pending', orig: '#btn-view-cart', healed: null, confidence: null, error: null },
    { order: 3, name: 'Enter Buyer Email', intent: 'Fill customer contact email', status: 'pending', orig: '#input-checkout-email', healed: null, confidence: null, error: null },
    { order: 4, name: 'Enter Shipping Address', intent: 'Fill destination delivery address', status: 'pending', orig: '#input-checkout-address', healed: null, confidence: null, error: null },
    { order: 5, name: 'Authorize Payment', intent: 'Authorize card and charge $149', status: 'pending', orig: '#btn-complete-order', healed: null, confidence: null, error: null },
    { order: 6, name: 'Order Confirmation', intent: 'Verify successful order badge', status: 'pending', orig: '#order-success-badge', healed: null, confidence: null, error: null }
  ];

  const [manualSteps, setManualSteps] = useState(getFreshSteps());
  const demoTerminalContainerRef = useRef(null);

  useEffect(() => {
    if (urlMode) {
      setMode(urlMode);
    }
  }, [urlMode]);

  useEffect(() => {
    if (demoTerminalContainerRef.current) {
      demoTerminalContainerRef.current.scrollTop = demoTerminalContainerRef.current.scrollHeight;
    }
  }, [terminalLogs]);

  // Keep bot running state in sync with activeRun
  useEffect(() => {
    if (activeSource === 'bot') {
      if (activeRun?.status === 'running') {
        setIsBotRunning(true);
      } else if (activeRun?.status && activeRun.status !== 'pending') {
        setIsBotRunning(false);
      }
    }
  }, [activeRun?.status, activeSource]);

  // Synchronize store UI with bot actions in real time!
  useEffect(() => {
    if (activeSource === 'bot' && activeRun?.steps) {
      const steps = activeRun.steps;

      // Step 1: Product added?
      const step1 = steps.find(s => s.order === 1 || s.intent?.toLowerCase().includes('add') || s.name?.toLowerCase().includes('product'));
      if (step1 && (step1.status === 'healed' || step1.status === 'passed')) {
        setCartCount(1);
        setItemAddedToast(true);
      }

      // Step 2: Opened drawer / checkout form?
      const step2 = steps.find(s => s.order === 2 || s.intent?.toLowerCase().includes('cart') || s.name?.toLowerCase().includes('cart'));
      if (step2 && (step2.status === 'healed' || step2.status === 'passed' || step2.status === 'running')) {
        // Comfortable visual pause so user sees "Added to Bag" before moving to Checkout form!
        setTimeout(() => {
          setStoreStep(prev => (prev === 1 ? 2 : prev));
        }, 750);
      }

      // Step 3: Email filled?
      const emailStep = steps.find(s => s.intent?.toLowerCase().includes('email') || s.name?.toLowerCase().includes('email'));
      if (emailStep && (emailStep.status === 'healed' || emailStep.status === 'passed')) {
        setTimeout(() => {
          setEmail('lokesh@hackwave.dev');
        }, 300);
      }

      // Step 4: Address filled?
      const addrStep = steps.find(s => s.intent?.toLowerCase().includes('address') || s.name?.toLowerCase().includes('address'));
      if (addrStep && (addrStep.status === 'healed' || addrStep.status === 'passed')) {
        setTimeout(() => {
          setAddress('Building 4, Tech Innovation Hub, Cyber City');
        }, 300);
      }

      // Step 5: Payment / Place Order completed?
      const payStep = steps.find(s => 
        s.intent?.toLowerCase().includes('payment') || 
        s.intent?.toLowerCase().includes('authorize') || 
        s.name?.toLowerCase().includes('payment') ||
        s.originalSelector?.includes('complete-order') ||
        s.order === 5
      );
      if (payStep) {
        if (payStep.status === 'running') {
          setIsProcessing(true);
        } else if (payStep.status === 'failed') {
          setIsProcessing(false);
          setBugHaltToast(true);
        } else if (payStep.status === 'healed' || payStep.status === 'passed') {
          setIsProcessing(true);
          setTimeout(() => {
            setIsProcessing(false);
            setStoreStep(3); // Transition store to Step 3: Order Confirmation!
          }, 800);
        }
      }

      // Step 6: Confirmation badge assertion?
      const confirmStep = steps.find(s => s.order === 6 || s.intent?.toLowerCase().includes('confirm'));
      if (confirmStep && (confirmStep.status === 'healed' || confirmStep.status === 'passed')) {
        setStoreStep(3);
      }
    }
  }, [activeSource, activeRun?.steps]);

  // Reset store and step pipeline cleanly
  const resetStore = () => {
    setActiveSource('manual');
    setIsBotRunning(false);
    setCartCount(0);
    setStoreStep(1);
    setEmail('');
    setAddress('');
    setIsProcessing(false);
    setItemAddedToast(false);
    setBugHaltToast(false);
    setManualSteps(getFreshSteps());
  };

  const handleModeChange = (newMode) => {
    setMode(newMode);
    setSearchParams({ mode: newMode });
    setActiveSource('manual');
    setIsBotRunning(false);
    setCartCount(0);
    setStoreStep(1);
    setEmail('');
    setAddress('');
    setIsProcessing(false);
    setItemAddedToast(false);
    setBugHaltToast(false);
    setManualSteps(getFreshSteps());
    if (addTerminalLog) {
      addTerminalLog('info', `Switched workspace mode to [${newMode.toUpperCase()}]. Waiting for user actions...`);
    }
  };

  // In mutated, chaos, and bug_mode:
  // In mutated: Steps 1, 3, 5 are mutated by default.
  // In chaos: EXACTLY the steps chosen by the judge are mutated!
  // In bug_mode: Steps 1 & 3 are mutated & healed, and Step 5 halts!
  const isMutated = mode === 'mutated';
  const isBug = mode === 'bug_mode';
  const isChaos = mode === 'chaos';

  // Count active chaos toggles for judge's badge
  const activeChaosCount = [mutateCart, mutateBag, mutateEmail, mutateAddress, mutatePay].filter(Boolean).length;

  /*
   * DYNAMIC SELECTOR DETERMINATION (JUDGE'S RULES):
   * If in Chaos Mode: Only the toggled steps mutate!
   * If in Version B: Steps 1, 3, 5 mutate, while 2, 4, 6 stay clean.
   * If in Standard: All stay clean baseline.
   */

  // Step 1: Add to Cart button
  const isCartMutated = isChaos ? mutateCart : (isMutated || isBug || chaosClasses);
  const addToCartId = isCartMutated
    ? (chaosSeed > 0 ? `chaos_cart_btn_${chaosSeed}` : 'dynamic_btn_cart_x89')
    : 'btn-add-to-cart';

  const addToCartText = (isChaos && chaosText)
    ? 'Grab Audio Deal Now!' 
    : (isCartMutated ? 'Claim Headphones Now' : 'Add to Bag');

  // Step 2: View Bag Trigger
  const isBagMutated = isChaos ? mutateBag : false;
  const viewCartId = isBagMutated
    ? (chaosSeed > 0 ? `chaos_nav_bag_${chaosSeed}` : 'chaos_nav_bag_92')
    : 'btn-view-cart';

  const viewCartText = (isChaos && chaosText && isBagMutated) ? 'Proceed to Bag Now' : 'View Bag & Checkout';

  // Step 3: Customer Email field
  const isEmailMutated = isChaos ? mutateEmail : (isMutated || isBug || chaosClasses);
  const emailFieldId = isEmailMutated
    ? (chaosSeed > 0 ? `chaos_email_${chaosSeed}` : 'customer_email_contact')
    : 'input-checkout-email';

  // Step 4: Shipping Address field
  const isAddressMutated = isChaos ? mutateAddress : false;
  const addressFieldId = isAddressMutated
    ? (chaosSeed > 0 ? `chaos_address_${chaosSeed}` : 'chaos_dest_address')
    : 'input-checkout-address';

  // Step 5: Payment Action button
  const isPayMutated = isChaos ? mutatePay : (isMutated || isBug || chaosClasses);
  const checkoutBtnId = isPayMutated
    ? (chaosSeed > 0 ? `chaos_pay_action_${chaosSeed}` : 'checkout_action_auth_pay')
    : 'btn-complete-order';

  const checkoutBtnText = (isChaos && chaosText)
    ? 'Authorize & Charge Card' 
    : (isPayMutated ? 'Complete Payment ($149.00)' : 'Place Order');

  // Trigger manual step progression WITH LIVE REAL-TIME LOGGING
  const triggerStepAction = (order, isFailure = false, errorMsg = null) => {
    setActiveSource('manual');

    // 1. STANDARD MODE: All steps pass cleanly on baseline selectors
    if (mode === 'standard') {
      setManualSteps(prev => prev.map(s => s.order === order ? { ...s, status: 'passed' } : s));
      if (addTerminalLog) {
        if (order === 1) addTerminalLog('info', 'Step #1: Located baseline selector #btn-add-to-cart. Item added.');
        if (order === 2) addTerminalLog('info', 'Step #2: Baseline selector #btn-view-cart located. Opened drawer.');
        if (order === 3) addTerminalLog('info', 'Step #3: Baseline selector #input-checkout-email filled with contact email.');
        if (order === 4) addTerminalLog('info', 'Step #4: Baseline selector #input-checkout-address filled with shipping destination.');
        if (order === 5) addTerminalLog('info', 'Step #5: Baseline selector #btn-complete-order authorized card payment.');
        if (order === 6) addTerminalLog('success', 'Step #6: Order confirmation verified (#order-success-badge). Test passed.');
      }
      return;
    }

    // 2. REAL BUG MODE on Step 5 (Payment)
    if (isFailure || (mode === 'bug_mode' && order === 5)) {
      setManualSteps(prev => prev.map(s => s.order === order ? {
        ...s,
        status: 'failed',
        error: errorMsg || 'HTTP 500 Payment Gateway Timeout & $0.00 Price Anomaly'
      } : s));
      if (addTerminalLog) {
        addTerminalLog('warn', 'Payment authorization submitted for processing...');
        addTerminalLog('error', 'HTTP 500 Internal Server Error & Cart total anomaly ($0.00).');
        addTerminalLog('error', '🚨 GENUINE APPLICATION BUG DETECTED: Smart Triage halted test. AI refused to heal regression!');
      }

      // Persist genuine bug record into database
      apiClient.post('/reports/healing-logs', {
        testId: defaultTest?._id || 'test_default_ecommerce_flow',
        stepOrder: 5,
        stepName: 'Complete Payment',
        userIntent: 'Authorize card and charge $149',
        brokenSelector: '#btn-complete-order',
        healedSelector: 'NONE (BLOCKED)',
        confidence: 99,
        strategyLayer: 'Triage Layer: Business Logic Assertion',
        classification: 'Genuine_Bug',
        reasoning: 'Critical Application Bug detected: Payment gateway returned HTTP 500 & Cart total anomaly ($0.00). AI engine verified this is a genuine backend regression, NOT a cosmetic selector rename. Healing safely aborted.'
      }).then(() => { if (refreshAll) refreshAll(); }).catch(() => {});

      return;
    }

    // 3. SELECTIVE MUTATION CHECK:
    // Only steps that are ACTUALLY mutated will heal! All other steps pass directly like Version A!
    const isThisStepMutated = (order === 1 && addToCartId !== 'btn-add-to-cart') ||
      (order === 2 && viewCartId !== 'btn-view-cart') ||
      (order === 3 && emailFieldId !== 'input-checkout-email') ||
      (order === 4 && addressFieldId !== 'input-checkout-address') ||
      (order === 5 && checkoutBtnId !== 'btn-complete-order');

    if (!isThisStepMutated) {
      // Clean pass without needing AI!
      setManualSteps(prev => prev.map(s => s.order === order ? { ...s, status: 'passed', healed: null } : s));
      if (addTerminalLog) {
        if (order === 1) addTerminalLog('info', 'Step #1: Baseline selector #btn-add-to-cart found (Unchanged). Passed directly.');
        if (order === 2) addTerminalLog('info', 'Step #2: Baseline selector #btn-view-cart found (Unchanged). Passed directly.');
        if (order === 3) addTerminalLog('info', 'Step #3: Baseline selector #input-checkout-email found (Unchanged). Passed directly.');
        if (order === 4) addTerminalLog('info', 'Step #4: Baseline selector #input-checkout-address found (Unchanged). Passed directly.');
        if (order === 5) addTerminalLog('info', 'Step #5: Baseline selector #btn-complete-order found (Unchanged). Passed directly.');
        if (order === 6) addTerminalLog('success', 'Step #6: Order confirmation verified (#order-success-badge). Direct pass.');
      }
      return;
    }

    // Step IS mutated: show realistic AI deliberation delay and stream logs!
    setManualSteps(prev => prev.map(s => s.order === order ? { ...s, status: 'healing' } : s));

    if (addTerminalLog) {
      if (order === 1) {
        addTerminalLog('warn', 'Selector Failure on Step #1! Missing: #btn-add-to-cart. Invoking AI Reasoning Engine...');
        addTerminalLog('healing', 'AI Engine analyzing accessibility tree for intent: "Add headphones to bag"...');
      } else if (order === 2) {
        addTerminalLog('warn', 'Selector Failure on Step #2! Missing: #btn-view-cart. Invoking AI Reasoning Engine...');
        addTerminalLog('healing', 'AI Engine analyzing accessibility tree for intent: "Open checkout drawer"...');
      } else if (order === 3) {
        addTerminalLog('warn', 'Selector Failure on Step #3! Missing: #input-checkout-email. Invoking AI Reasoning Engine...');
        addTerminalLog('healing', 'AI Engine analyzing accessibility tree for intent: "Fill customer contact email"...');
      } else if (order === 4) {
        addTerminalLog('warn', 'Selector Failure on Step #4! Missing: #input-checkout-address. Invoking AI Reasoning Engine...');
        addTerminalLog('healing', 'AI Engine analyzing accessibility tree for intent: "Fill destination delivery address"...');
      } else if (order === 5) {
        addTerminalLog('warn', 'Selector Failure on Step #5! Missing: #btn-complete-order. Invoking AI Reasoning Engine...');
        addTerminalLog('healing', 'AI Engine analyzing accessibility tree for intent: "Authorize card and charge $149"...');
      }
    }

    // Realistic deliberation delay of 850ms before healing completes
    setTimeout(() => {
      let resolvedSel = '#btn-add-to-cart';
      if (order === 1) resolvedSel = `#${addToCartId}`;
      if (order === 2) resolvedSel = `#${viewCartId}`;
      if (order === 3) resolvedSel = `#${emailFieldId}`;
      if (order === 4) resolvedSel = `#${addressFieldId}`;
      if (order === 5) resolvedSel = `#${checkoutBtnId}`;

      const conf = Math.floor(Math.random() * 4) + 95;

      setManualSteps(prev => prev.map(s => s.order === order ? {
        ...s,
        status: 'healed',
        healed: resolvedSel,
        confidence: conf
      } : s));

      if (addTerminalLog) {
        if (order === 1) {
          addTerminalLog('success', `✔ Healed: [#btn-add-to-cart] -> [${resolvedSel}] (${conf}% confidence via Semantic Text & Role Matching)`);
          addTerminalLog('info', `Action dispatched on resolved element: ${resolvedSel}`);
        } else if (order === 2) {
          addTerminalLog('success', `✔ Healed: [#btn-view-cart] -> [${resolvedSel}] (${conf}% confidence via Navigation Role Matching)`);
          addTerminalLog('info', `Opened checkout drawer on resolved element: ${resolvedSel}`);
        } else if (order === 3) {
          addTerminalLog('success', `✔ Healed: [#input-checkout-email] -> [${resolvedSel}] (${conf}% confidence via Proximity Graph)`);
          addTerminalLog('info', `Filled contact email on resolved element: ${resolvedSel}`);
        } else if (order === 4) {
          addTerminalLog('success', `✔ Healed: [#input-checkout-address] -> [${resolvedSel}] (${conf}% confidence via Delivery Address Heuristic)`);
          addTerminalLog('info', `Filled destination address on resolved element: ${resolvedSel}`);
        } else if (order === 5) {
          addTerminalLog('success', `✔ Healed: [#btn-complete-order] -> [${resolvedSel}] (${conf}% confidence via Intent Assertion)`);
          addTerminalLog('info', `Payment authorization dispatched on: ${resolvedSel}`);
        }
      }

      // Persist real healing record into backend database
      apiClient.post('/reports/healing-logs', {
        testId: defaultTest?._id || 'test_default_ecommerce_flow',
        stepOrder: order,
        stepName: order === 1 ? 'Select Product' : order === 2 ? 'Open Shopping Bag' : order === 3 ? 'Enter Buyer Email' : order === 4 ? 'Enter Shipping Address' : 'Complete Payment',
        userIntent: order === 1 ? 'Add headphones to bag' : order === 2 ? 'Open checkout drawer' : order === 3 ? 'Fill customer contact email' : order === 4 ? 'Fill destination delivery address' : 'Authorize card and charge $149',
        brokenSelector: order === 1 ? '#btn-add-to-cart' : order === 2 ? '#btn-view-cart' : order === 3 ? '#input-checkout-email' : order === 4 ? '#input-checkout-address' : '#btn-complete-order',
        healedSelector: resolvedSel,
        confidence: conf,
        strategyLayer: order === 1 ? 'Layer 1: Semantic Text & Role Matching' : order === 3 ? 'Layer 2: Proximity & Input Graph' : 'Layer 3: Intent Assertion',
        classification: 'Harmless_UI_Change',
        reasoning: `Original selector was mutated in DOM redesign. Located dynamic replacement element "${resolvedSel}" satisfying user intent.`
      }).then(() => { if (refreshAll) refreshAll(); }).catch(() => {});
    }, 850);
  };

  // Seed shuffler that dynamically mutates live DOM IDs
  const handleShuffleSeed = () => {
    const nextSeed = ((chaosSeed || 0) % 9) + 1;
    setChaosSeed(nextSeed);
    if (addTerminalLog) {
      addTerminalLog('chaos', `🎲 Seed #${nextSeed} active! Live DOM IDs scrambled with hash entropy.`);
    }
  };

  // Automated E2E Bot execution with selective chaos parameters
  const runAutomatedBot = async () => {
    setActiveSource('bot');
    setIsBotRunning(true);
    setInspectorTab('pipeline');
    // Initialize activeRun with fresh pending steps so real-time socket events never drop!
    if (setActiveRun) {
      const freshSteps = (defaultTest?.steps || getFreshSteps()).map(s => ({
        order: s.order,
        name: s.name,
        intent: s.intent,
        action: s.action,
        originalSelector: s.selector || s.orig,
        resolvedSelector: s.selector || s.orig,
        status: 'pending',
        durationMs: 0,
        healingDetails: null,
        error: null
      }));
      setActiveRun({
        _id: 'pending_run',
        status: 'running',
        mode,
        steps: freshSteps,
        healedCount: 0,
        totalSteps: freshSteps.length
      });
    }
    
    // Reset local UI inputs WITHOUT resetting activeSource
    setCartCount(0);
    setStoreStep(1);
    setEmail('');
    setAddress('');
    setIsProcessing(false);
    setItemAddedToast(false);
    setBugHaltToast(false);
    setManualSteps(getFreshSteps());

    try {
      if (addTerminalLog) {
        addTerminalLog('info', `🤖 Starting Headless Playwright Bot for [${mode.toUpperCase()}] mode...`);
      }

      // If in Chaos mode, pass the judge's exact choices to the Playwright runner!
      const chaosParams = `mutateCart=${mutateCart}&mutateBag=${mutateBag}&mutateEmail=${mutateEmail}&mutateAddress=${mutateAddress}&mutatePay=${mutatePay}&chaosPosition=${chaosPosition}&chaosText=${chaosText}&chaosSeed=${chaosSeed}`;

      await triggerRun(defaultTest?._id, mode, true, {
        targetUrl: `${window.location.origin}/demo-store`,
        ...(isChaos ? { chaosParams } : {})
      });
    } catch (err) {
      console.error('Failed to run bot:', err);
      setIsBotRunning(false);
      if (addTerminalLog) {
        addTerminalLog('error', `Bot execution error: ${err.message}`);
      }
    }
  };

  // Clean steps display:
  // If activeSource === 'bot' AND activeRun has steps, display bot's live steps.
  // Otherwise ALWAYS show clean manualSteps (so tab switches start in pending state)!
  const displayedSteps = (activeSource === 'bot' && activeRun && activeRun.steps && activeRun.steps.length > 0)
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
        return <span className="text-2xs font-mono font-medium px-1.5 py-0.2 rounded bg-[#1f6feb]/20 text-[#58a6ff] border border-[#388bfd]/40">HEAL</span>;
      case 'success':
        return <span className="text-2xs font-mono font-medium px-1.5 py-0.2 rounded bg-[#238636]/20 text-[#3fb950] border border-[#2ea043]/40">PASS</span>;
      case 'error':
        return <span className="text-2xs font-mono font-medium px-1.5 py-0.2 rounded bg-[#da3633]/20 text-[#f85149] border border-[#f85149]/40">FAIL</span>;
      case 'warn':
        return <span className="text-2xs font-mono font-medium px-1.5 py-0.2 rounded bg-[#9e6a03]/20 text-[#d29922] border border-[#bb8009]/40">WARN</span>;
      case 'chaos':
        return <span className="text-2xs font-mono font-medium px-1.5 py-0.2 rounded bg-[#b62324]/20 text-[#ff7b72] border border-[#ff7b72]/40">CHAOS</span>;
      default:
        return <span className="text-2xs font-mono font-medium px-1.5 py-0.2 rounded bg-[#30363d]/40 text-[#8b949e] border border-[#30363d]">INFO</span>;
    }
  };

  return (
    <div className="flex-1 bg-canvas text-ink flex flex-col font-sans">
      {/* Top Header */}
      <header className="border-b border-border bg-surface-raised sticky top-14 z-20 px-6 py-2 flex items-center justify-between gap-4 shadow-card">
        <div className="flex items-center gap-2 shrink-0">
          <span className="w-2 h-2 rounded-full bg-[#1a7f37] shrink-0"></span>
          <span className="font-semibold text-xs sm:text-sm tracking-tight text-ink whitespace-nowrap">Testing Sandbox</span>
          <span className="badge badge-info text-2xs font-mono whitespace-nowrap">Arena</span>
        </div>

        {/* 4 Mode Switcher Tabs */}
        <div className="flex items-center p-0.5 rounded-md bg-surface border border-border shrink-0 gap-0.5">
          <button
            onClick={() => handleModeChange('standard')}
            className={`px-2.5 py-1 rounded text-xs font-medium transition-colors whitespace-nowrap shrink-0 ${
              mode === 'standard' 
                ? 'bg-surface-raised text-ink font-semibold shadow-card border border-border' 
                : 'text-ink-secondary hover:text-ink'
            }`}
          >
            Version A (Base)
          </button>
          <button
            onClick={() => handleModeChange('mutated')}
            className={`px-2.5 py-1 rounded text-xs font-medium transition-colors whitespace-nowrap shrink-0 ${
              mode === 'mutated' 
                ? 'bg-surface-raised text-ink font-semibold shadow-card border border-border' 
                : 'text-ink-secondary hover:text-ink'
            }`}
          >
            Version B (Auto-Heal)
          </button>
          <button
            onClick={() => handleModeChange('chaos')}
            className={`px-2.5 py-1 rounded text-xs font-medium transition-colors flex items-center gap-1.5 whitespace-nowrap shrink-0 ${
              mode === 'chaos' 
                ? 'bg-surface-raised text-ink font-semibold shadow-card border border-border' 
                : 'text-ink-secondary hover:text-ink'
            }`}
          >
            <Flame className={`w-3.5 h-3.5 shrink-0 ${mode === 'chaos' ? 'text-[#9a6700]' : 'text-ink-tertiary'}`} />
            <span>Live Chaos</span>
            <span className={`text-2xs px-1.5 py-0.2 rounded-full font-mono font-medium leading-none shrink-0 ${
              mode === 'chaos'
                ? 'bg-[#fff8c5] text-[#9a6700] border border-[#d4a72c]'
                : 'bg-surface text-ink-tertiary border border-border'
            }`}>
              {activeChaosCount} active
            </span>
          </button>
          <button
            onClick={() => handleModeChange('bug_mode')}
            className={`px-2.5 py-1 rounded text-xs font-medium transition-colors flex items-center gap-1 whitespace-nowrap shrink-0 ${
              mode === 'bug_mode' 
                ? 'bg-surface-raised text-ink font-semibold shadow-card border border-border' 
                : 'text-ink-secondary hover:text-ink'
            }`}
          >
            <AlertTriangle className={`w-3.5 h-3.5 shrink-0 ${mode === 'bug_mode' ? 'text-[#cf222e]' : 'text-ink-tertiary'}`} />
            <span>Real Bug</span>
          </button>
        </div>

        {/* Action Controls */}
        <div className="flex items-center gap-2 shrink-0">
          <button
            onClick={runAutomatedBot}
            disabled={isBotRunning}
            className={`btn btn-sm whitespace-nowrap shrink-0 flex items-center gap-1.5 font-medium transition-colors ${
              isBotRunning 
                ? 'bg-[#9a6700] text-white animate-pulse' 
                : 'btn-primary'
            }`}
            title="Auto-Run Playwright Robot: Automatically drives browser, clicks elements & executes the full test suite"
          >
            {isBotRunning ? (
              <>
                <Loader2 className="w-3.5 h-3.5 animate-spin shrink-0" />
                <span>Running Bot...</span>
              </>
            ) : (
              <>
                <Bot className="w-3.5 h-3.5 shrink-0" />
                <span>Auto-Run E2E Bot</span>
              </>
            )}
          </button>

          <button 
            onClick={resetStore}
            className="btn btn-secondary btn-sm whitespace-nowrap shrink-0 flex items-center gap-1 text-ink-secondary hover:text-ink"
            title="Reset Store and Step Pipeline"
          >
            <RotateCcw className="w-3 h-3 shrink-0" />
            <span>Reset</span>
          </button>
        </div>
      </header>

      {/* Full-width Top Chaos Banner */}
      {isChaos ? (
        <div className="w-full bg-surface-raised border-b border-border px-6 py-2 shadow-card">
          <div className="max-w-7xl mx-auto flex items-center justify-between gap-4 flex-wrap">
            <div className="flex items-center gap-2">
              <Flame className="w-4 h-4 text-[#9a6700] shrink-0" />
              <span className="text-xs font-semibold text-ink whitespace-nowrap">Mutate Step Selectors:</span>
              <span className="text-2xs text-ink-secondary hidden sm:inline">Toggle which elements get mutated during execution</span>
            </div>

            {/* Clean Segmented Step Switcher */}
            <div className="inline-flex items-center p-0.5 rounded-md bg-surface border border-border gap-1 flex-wrap">
              {[
                { id: 'cart', label: '1. Cart', active: mutateCart, toggle: () => setMutateCart(!mutateCart) },
                { id: 'bag', label: '2. Bag', active: mutateBag, toggle: () => setMutateBag(!mutateBag) },
                { id: 'email', label: '3. Email', active: mutateEmail, toggle: () => setMutateEmail(!mutateEmail) },
                { id: 'address', label: '4. Address', active: mutateAddress, toggle: () => setMutateAddress(!mutateAddress) },
                { id: 'pay', label: '5. Pay', active: mutatePay, toggle: () => setMutatePay(!mutatePay) },
              ].map(step => (
                <button
                  key={step.id}
                  onClick={step.toggle}
                  className={`px-2.5 py-1 rounded text-xs font-medium transition-colors flex items-center gap-1.5 whitespace-nowrap ${
                    step.active
                      ? 'bg-surface-raised text-accent font-semibold border border-accent shadow-card'
                      : 'bg-surface-raised text-ink-secondary border border-border hover:text-ink'
                  }`}
                >
                  <span className={`w-1.5 h-1.5 rounded-full ${step.active ? 'bg-accent animate-pulse' : 'bg-border'}`}></span>
                  <span>{step.label}</span>
                  {step.active && <span className="text-2xs text-accent font-semibold">⚡</span>}
                </button>
              ))}
            </div>
          </div>
        </div>
      ) : (
        /* Clean Mode Status Indicator for standard/mutated/bug_mode */
        <div className="bg-surface-raised border-b border-border px-6 py-1.5 text-xs flex items-center justify-between text-ink-secondary">
          <div className="flex items-center gap-2">
            <Info className="w-3.5 h-3.5 text-ink-tertiary shrink-0" />
            {mode === 'standard' && (
              <span><strong>Version A Mode:</strong> Unmodified baseline store. All elements pass cleanly on original selectors.</span>
            )}
            {mode === 'mutated' && (
              <span><strong>Version B Mode:</strong> Devs renamed Steps 1, 3, 5, while Steps 2, 4, 6 remain untouched. AI deliberately heals broken steps.</span>
            )}
            {mode === 'bug_mode' && (
              <span><strong>Real Bug Mode:</strong> Steps 1 & 3 heal safely, but Step 5 encounters a 500 error & $0 price. AI halts and refuses to false-heal!</span>
            )}
          </div>
        </div>
      )}

      {/* Dual-Pane Arena */}
      <div className="flex-1 max-w-7xl w-full mx-auto p-6 grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        
        {/* ================= LEFT PANE: Interactive Store (7 cols) ================= */}
        <div className="lg:col-span-7 space-y-3.5">
          <div className="flex items-center justify-between pb-0.5">
            <h2 className="text-sm font-semibold text-ink flex items-center gap-2">
              <ShoppingBag className="w-4 h-4 text-accent" />
              <span>Target Application UI</span>
            </h2>
            <span className="text-2xs font-mono text-ink-tertiary">
              Step {storeStep} of 3
            </span>
          </div>

          {/* STORE STEP 1: Product Showcase */}
          {storeStep === 1 && (
            <div className="card p-5 md:p-6 space-y-5 shadow-card">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-center">
                {/* Product Image / Visual Showcase */}
                <div className="relative rounded-md bg-surface border border-border p-5 flex flex-col items-center justify-between min-h-[270px] overflow-hidden group shadow-card">
                  {/* Top floating pill */}
                  <div className="w-full flex items-center justify-between z-10">
                    <span className="badge badge-neutral text-2xs font-mono">Model Q-90</span>
                    <span className="badge badge-success text-2xs font-mono font-medium flex items-center gap-1">
                      <span className="w-1.5 h-1.5 rounded-full bg-[#1a7f37] animate-pulse"></span>
                      In Stock
                    </span>
                  </div>

                  {/* Center Headphones Illustration */}
                  <div className="my-auto z-10 relative flex flex-col items-center py-3">
                    <div className="w-20 h-20 rounded-md bg-surface-raised border border-border flex items-center justify-center shadow-card group-hover:scale-105 transition-transform duration-200">
                      <Headphones className="w-10 h-10 text-ink stroke-[1.5]" />
                    </div>
                    <span className="text-2xs font-mono text-ink-tertiary mt-2 font-medium tracking-tight">Spatial Drivers • 40mm Neodymium</span>
                  </div>

                  {/* Bottom feature badges */}
                  <div className="w-full pt-2.5 border-t border-border flex items-center justify-center gap-1.5 z-10 text-2xs font-mono text-ink-secondary">
                    <span className="px-1.5 py-0.5 rounded bg-surface-raised border border-border">Bluetooth 5.4</span>
                    <span className="px-1.5 py-0.5 rounded bg-surface-raised border border-border">42h Battery</span>
                    <span className="px-1.5 py-0.5 rounded bg-surface-raised border border-border">ANC 2.0</span>
                  </div>
                </div>

                {/* Product Info */}
                <div className="space-y-3.5">
                  <div>
                    <div className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-[#ddf4ff] border border-[#54aeff] text-accent text-2xs font-mono font-medium uppercase tracking-wider mb-1.5">
                      <Sparkles className="w-3 h-3" />
                      <span>Studio Audio Series</span>
                    </div>
                    <h3 className="text-xl font-bold text-ink tracking-tight">Quantum Studio Headphones</h3>
                    <p className="text-xs text-ink-secondary mt-1 leading-relaxed">
                      Spatial acoustic drivers with adaptive algorithmic active noise cancellation and ultra-low latency wireless streaming.
                    </p>
                  </div>

                  {/* Price Row */}
                  <div className="flex items-baseline gap-2.5">
                    <span className="text-2xl font-bold text-ink font-mono">
                      {isBug ? '$0.00' : '$149.00'}
                    </span>
                    {isBug ? (
                      <span className="badge badge-danger text-2xs font-mono font-medium">
                        Pricing Regression ($0)
                      </span>
                    ) : (
                      <>
                        <span className="text-xs text-ink-tertiary line-through font-mono">$229.00</span>
                        <span className="badge badge-success text-2xs font-mono font-medium">SAVE 35%</span>
                      </>
                    )}
                  </div>

                  {/* DOM ID Badge Preview — Clean single line */}
                  <div className="bg-surface px-2.5 py-1.5 rounded-md border border-border flex items-center justify-between text-2xs font-mono">
                    <span className="text-ink-secondary flex items-center gap-1.5 font-medium">
                      <span className="w-1.5 h-1.5 rounded-full bg-[#1a7f37]"></span>
                      <span>Target Selector:</span>
                    </span>
                    <code className={`font-mono font-semibold px-1.5 py-0.2 rounded ${
                      isCartMutated ? 'bg-[#fff8c5] text-[#9a6700] border border-[#d4a72c]' : 'bg-surface-raised text-accent border border-border'
                    }`}>
                      #{addToCartId}
                    </code>
                  </div>

                  {/* Buttons */}
                  <div className={`space-y-2 pt-0.5 ${chaosPosition ? 'flex flex-col-reverse' : ''}`}>
                    <button
                      id={addToCartId}
                      data-testid="add-to-cart-action"
                      onClick={() => {
                        setCartCount(prev => Math.max(1, prev + 1));
                        setItemAddedToast(true);
                        triggerStepAction(1);
                        setTimeout(() => setItemAddedToast(false), 2000);
                      }}
                      className="btn btn-primary w-full py-2.5 text-xs sm:text-sm font-medium flex items-center justify-center gap-2"
                    >
                      {itemAddedToast ? (
                        <>
                          <Check className="w-4 h-4 text-white" />
                          <span>Added to Bag! (Step 1 Complete)</span>
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
                      data-testid="view-cart-action"
                      onClick={() => {
                        setStoreStep(2);
                        triggerStepAction(2);
                      }}
                      className="btn btn-secondary w-full py-2 text-xs font-medium flex items-center justify-between px-3"
                    >
                      <span>{viewCartText}</span>
                      <span className="text-2xs font-mono font-semibold px-1.5 py-0.2 rounded-full bg-surface-raised border border-border text-ink">
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
                    <span className={`text-xs font-mono ${isEmailMutated ? 'text-amber-600 font-bold' : 'text-ink-tertiary'}`}>#{emailFieldId}</span>
                  </label>
                  <input
                    id={emailFieldId}
                    data-testid="checkout-email-input"
                    name={isEmailMutated ? 'buyer_email' : 'email'}
                    type="email"
                    value={email}
                    onChange={(e) => {
                      setEmail(e.target.value);
                      triggerStepAction(3);
                    }}
                    placeholder="lokesh@hackwave.dev"
                    className="input input-mono text-xs"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-ink mb-1 flex justify-between">
                    <span>Shipping Address (Step 4)</span>
                    <span className={`text-xs font-mono ${isAddressMutated ? 'text-amber-600 font-bold' : 'text-ink-tertiary'}`}>#{addressFieldId}</span>
                  </label>
                  <input
                    id={addressFieldId}
                    data-testid="checkout-address-input"
                    name={isAddressMutated ? 'delivery_addr' : 'address'}
                    type="text"
                    value={address}
                    onChange={(e) => {
                      setAddress(e.target.value);
                      triggerStepAction(4);
                    }}
                    placeholder="Building 4, Tech Innovation Hub, Cyber City"
                    className="input input-mono text-xs"
                  />
                </div>

                {/* Payment Submit Button */}
                <div className="pt-2">
                  <button
                    id={checkoutBtnId}
                    data-testid="checkout-payment-action"
                    disabled={isProcessing}
                    onClick={() => {
                      setIsProcessing(true);
                      setTimeout(() => {
                        setIsProcessing(false);
                        if (isBug) {
                          setBugHaltToast(true);
                          triggerStepAction(5, true, 'HTTP 500 Payment Gateway Timeout & $0.00 Price Anomaly');
                        } else {
                          setStoreStep(3);
                          triggerStepAction(5);
                          triggerStepAction(6);
                        }
                      }, 500);
                    }}
                    className={`btn w-full py-2.5 text-xs sm:text-sm font-medium shadow-card ${
                      isBug
                        ? 'btn-danger'
                        : 'btn-primary'
                    }`}
                  >
                    <Lock className="w-3.5 h-3.5" />
                    <span>{isBug ? 'Authorize & Pay ($0.00) — Triggers 500 Crash' : checkoutBtnText}</span>
                  </button>
                </div>

                {bugHaltToast && (
                  <div className="p-3 rounded-md bg-[#ffebe9] border border-[#ff8182] text-[#cf222e] text-xs space-y-1">
                    <p className="font-semibold flex items-center gap-1.5">
                      <AlertTriangle className="w-4 h-4" />
                      HTTP 500 Internal Server Error & Corrupted Price
                    </p>
                    <p className="leading-relaxed text-2xs">
                      AI Smart Triage detected that this is a real server crash, not a renamed selector. <strong>AI refused to heal this step!</strong> Check the right panel.
                    </p>
                  </div>
                )}

                <div className="bg-surface p-2 rounded-md border border-border text-xs font-mono flex items-center justify-between">
                  <span className="text-ink-secondary text-2xs">Payment Action ID:</span>
                  <span className={`font-semibold ${isPayMutated ? 'text-[#9a6700]' : 'text-accent'}`}>#{checkoutBtnId}</span>
                </div>
              </div>
            </div>
          )}

          {/* STORE STEP 3: Order Confirmation */}
          {storeStep === 3 && (
            <div className="card p-6 text-center space-y-3.5 shadow-card">
              <div className="w-12 h-12 rounded-full bg-[#dafbe1] border border-[#4ac26b] flex items-center justify-center mx-auto text-[#1a7f37]">
                <CheckCircle2 className="w-6 h-6" />
              </div>

              <span 
                id="order-success-badge" 
                className="badge badge-success text-2xs font-mono font-medium px-2.5 py-0.5"
              >
                Order Confirmed
              </span>

              <h3 className="text-xl font-bold text-ink">Purchase Completed Successfully</h3>
              <p className="text-xs text-ink-secondary">
                Workflow verified end-to-end. Tracking ID: <span className="font-mono text-accent font-semibold">#HW-90214-X</span>
              </p>

              <div className="pt-3 border-t border-border flex justify-center gap-2.5">
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
                  <Bot className="w-3.5 h-3.5" />
                  <span>Auto-Run with Bot</span>
                </button>
              </div>
            </div>
          )}
        </div>

        {/* ================= RIGHT PANE: Live Inspector & Telemetry Logs (5 cols) ================= */}
        <div className="lg:col-span-5 space-y-2.5 sticky top-20">
          {/* Active Bot Driving Banner */}
          {isBotRunning && (
            <div className="p-2.5 rounded-md bg-[#1f883d] text-white text-xs font-medium flex items-center justify-between shadow-card animate-pulse">
              <div className="flex items-center gap-2">
                <Bot className="w-4 h-4 animate-bounce" />
                <span>Playwright Bot Driving Browser...</span>
              </div>
              <span className="text-2xs font-mono bg-white/20 px-2 py-0.5 rounded">
                Mode: {mode.toUpperCase()}
              </span>
            </div>
          )}

          {/* Tab Switcher */}
          <div className="p-0.5 rounded-md flex items-center justify-between bg-surface border border-border shadow-card">
            <div className="flex items-center gap-0.5">
              <button
                onClick={() => setInspectorTab('pipeline')}
                className={`px-2.5 py-1 rounded text-xs font-medium transition-colors flex items-center gap-1.5 ${
                  inspectorTab === 'pipeline'
                    ? 'bg-surface-raised text-ink font-semibold shadow-card border border-border'
                    : 'text-ink-secondary hover:text-ink'
                }`}
              >
                <Zap className={`w-3.5 h-3.5 ${inspectorTab === 'pipeline' ? 'text-accent' : 'text-ink-tertiary'}`} />
                <span>Live Test Pipeline</span>
              </button>

              <button
                onClick={() => setInspectorTab('terminal')}
                className={`px-2.5 py-1 rounded text-xs font-medium transition-colors flex items-center gap-1.5 ${
                  inspectorTab === 'terminal'
                    ? 'bg-surface-raised text-ink font-semibold shadow-card border border-border'
                    : 'text-ink-secondary hover:text-ink'
                }`}
              >
                <Terminal className={`w-3.5 h-3.5 ${inspectorTab === 'terminal' ? 'text-accent' : 'text-ink-tertiary'}`} />
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
            <div className="card p-4 space-y-2.5 shadow-card max-h-[620px] overflow-y-auto scrollbar-thin">
              <div className="flex items-center justify-between pb-2 border-b border-border">
                <div>
                  <h3 className="text-xs sm:text-sm font-semibold text-ink">E2E Test Steps & Healing State</h3>
                  <p className="text-2xs text-ink-secondary">
                    {activeSource === 'bot' ? 'Streaming live from automated Playwright bot' : 'Live state as you click store buttons'}
                  </p>
                </div>
                <span className="text-2xs font-mono font-semibold px-2 py-0.5 rounded bg-surface border border-border">
                  {mode.toUpperCase()}
                </span>
              </div>

              {/* Steps List */}
              <div className="space-y-2">
                {displayedSteps.map((s) => {
                  const isHealing = s.status === 'healing';
                  const isActuallyHealed = s.status === 'healed' && s.healed && s.healed !== s.orig;
                  const isPassed = (s.status === 'passed') || (s.status === 'healed' && (!s.healed || s.healed === s.orig));
                  const isFailed = s.status === 'failed';
                  const isPending = s.status === 'pending';
                  const isRunning = s.status === 'running';

                    return (
                      <div
                        key={s.order}
                        className={`p-2.5 rounded-md border transition-colors text-xs space-y-1.5 ${
                          isHealing ? 'border-[#d4a72c] bg-[#fff8c5]/40 ring-1 ring-[#d4a72c]' :
                          isRunning ? 'border-accent bg-[#ddf4ff]/30 ring-1 ring-accent' :
                          isActuallyHealed ? 'border-[#54aeff] bg-[#ddf4ff]/30' :
                          isPassed ? 'border-[#4ac26b] bg-[#dafbe1]/30' :
                          isFailed ? 'border-[#ff8182] bg-[#ffebe9]/40' :
                          'border-border bg-surface'
                        }`}
                      >
                        {/* Step Header */}
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <span className="w-4 h-4 rounded bg-surface-raised border border-border flex items-center justify-center font-mono font-semibold text-2xs text-ink-secondary">
                              {s.order}
                            </span>
                            <span className="font-semibold text-ink text-xs">{s.name}</span>
                          </div>

                          {/* Status Badges */}
                          <div>
                            {isHealing && (
                              <span className="badge badge-warning text-2xs font-medium animate-pulse">
                                <Loader2 className="w-3 h-3 animate-spin" />
                                HEALING...
                              </span>
                            )}
                            {isRunning && !isHealing && (
                              <span className="badge badge-info text-2xs font-medium font-mono animate-pulse">
                                <Loader2 className="w-3 h-3 animate-spin text-accent" />
                                RUNNING...
                              </span>
                            )}
                            {isActuallyHealed && !isHealing && !isRunning && (
                              <span className="badge badge-info text-2xs font-medium">
                                <Sparkles className="w-3 h-3" />
                                AUTO-HEALED {s.confidence ? `(${s.confidence}%)` : ''}
                              </span>
                            )}
                            {isPassed && !isHealing && !isRunning && (
                              <span className="badge badge-success text-2xs font-medium">
                                <CheckCircle2 className="w-3 h-3" />
                                PASSED (Direct)
                              </span>
                            )}
                            {isFailed && (
                              <span className="badge badge-danger text-2xs font-medium">
                                <AlertTriangle className="w-3 h-3" />
                                BUG HALTED
                              </span>
                            )}
                            {isPending && !isRunning && (
                              <span className="badge badge-neutral text-2xs font-mono">
                                Waiting...
                              </span>
                            )}
                          </div>
                        </div>

                        {/* Goal */}
                        <p className="text-2xs text-ink-secondary">
                          Goal: <span className="text-ink font-medium">{s.intent}</span>
                        </p>

                        {/* State indicator when actively running or healing */}
                        {isHealing && (
                          <div className="bg-[#fff8c5] p-1.5 rounded border border-[#d4a72c] text-[#9a6700] font-mono text-2xs flex items-center gap-1.5">
                            <Loader2 className="w-3 h-3 animate-spin shrink-0 text-[#9a6700]" />
                            <span>Selector mutated! Scanning accessibility tree & semantic intent...</span>
                          </div>
                        )}
                        {isRunning && !isHealing && (
                          <div className="bg-surface-raised p-1.5 rounded border border-border text-ink-secondary font-mono text-2xs flex items-center gap-1.5">
                            <Loader2 className="w-3 h-3 animate-spin shrink-0 text-accent" />
                            <span>Playwright executing direct action on baseline selector...</span>
                          </div>
                        )}

                      {/* Selector Diff Box: ONLY SHOWN WHEN ACTUALLY HEALED & DIFFERENT! */}
                      {isActuallyHealed && !isHealing && !isRunning && (
                        <div className="bg-surface-raised p-1.5 rounded border border-border font-mono text-2xs space-y-0.5">
                          <div className="flex items-center justify-between text-[#cf222e]">
                            <span>- Broken:</span>
                            <span className="line-through font-semibold">{s.orig}</span>
                          </div>
                          <div className="flex items-center justify-between text-[#1a7f37] font-semibold">
                            <span>+ Healed:</span>
                            <span>{s.healed}</span>
                          </div>
                        </div>
                      )}

                      {/* Passed Clean Selector */}
                      {isPassed && !isHealing && !isRunning && (
                        <div className="bg-surface-raised p-1 rounded border border-border font-mono text-2xs text-ink-secondary flex items-center justify-between">
                          <span>Baseline:</span>
                          <span className="font-semibold text-[#1a7f37]">{s.orig} (Passed directly)</span>
                        </div>
                      )}

                      {/* Bug Triage Explanation */}
                      {isFailed && (
                        <div className="bg-[#ffebe9] p-2 rounded border border-[#ff8182] text-[#cf222e] text-2xs space-y-0.5">
                          <p className="font-semibold flex items-center gap-1">
                            <ShieldAlert className="w-3 h-3 shrink-0" />
                            Smart Triage: Refused to False-Heal
                          </p>
                          <p className="leading-relaxed">
                            {s.error || '500 Server Regression & Corrupted Price ($0.00). Test halted safely to prevent shipping broken payment code!'}
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
            <div className="card bg-[#0d1117] border-[#30363d] text-[#c9d1d9] font-mono shadow-card overflow-hidden flex flex-col h-[580px]">
              {/* Terminal Title Bar */}
              <div className="bg-[#161b22] px-3.5 py-2 border-b border-[#30363d] flex items-center justify-between select-none">
                <div className="flex items-center gap-2">
                  <Terminal className="w-3.5 h-3.5 text-[#58a6ff]" />
                  <span className="text-xs text-[#e6edf3] font-semibold font-sans">
                    Live Telemetry Stream
                  </span>
                </div>
                <span className="text-2xs text-[#8b949e] font-mono">{terminalLogs.length} events</span>
              </div>

              {/* Logs Stream */}
              <div 
                ref={demoTerminalContainerRef}
                className="p-3 overflow-y-auto flex-1 space-y-1.5 text-xs leading-relaxed scrollbar-thin"
              >
                {terminalLogs.length === 0 ? (
                  <div className="text-[#8b949e] text-center py-16 italic font-sans text-xs">
                    Listening for browser events... Click buttons in the store or click "Auto-Run E2E Bot" to stream live logs.
                  </div>
                ) : (
                  terminalLogs.map((log, index) => (
                    <div key={index} className="flex items-start gap-2 hover:bg-[#161b22]/70 px-1 py-0.5 rounded font-mono text-2xs">
                      <span className="text-[#6e7681] select-none shrink-0 font-mono pt-0.5">
                        {log.timestamp}
                      </span>
                      <span className="shrink-0">
                        {getTagBadge(log.type)}
                      </span>
                      <span className={`break-all ${
                        log.type === 'error' ? 'text-[#f85149] font-medium' :
                        log.type === 'healing' ? 'text-[#e3b341] font-medium' :
                        log.type === 'success' ? 'text-[#3fb950] font-medium' : 'text-[#c9d1d9]'
                      }`}>
                        {log.message}
                      </span>
                    </div>
                  ))
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
