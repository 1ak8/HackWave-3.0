const path = require('path');
require('dotenv').config({ path: path.resolve(__dirname, '../../.env') });

const store = require('../src/models/store');
const { healBrokenStep } = require('../src/engine/aiHealer');

async function runSelfVerification() {
  console.log('🧪 Starting Self-Verification of Core AutoHeal Engine...\n');

  // 1. Verify default suite seeding
  const tests = await store.getTests();
  console.log(`✔ Store loaded ${tests.length} suites.`);
  if (tests.length === 0) throw new Error('No tests seeded');

  // 2. Test Harmless UI Change (Version B Button Rename & ID Mutation)
  console.log('\n--- Test Scenario 1: Harmless UI Mutation (Auto-Heal) ---');
  const mockHarmlessDOM = {
    elements: [
      {
        tag: 'button',
        id: 'dynamic_btn_cart_x89',
        suggestedSelector: '#dynamic_btn_cart_x89',
        text: 'Grab Item Now',
        classes: 'btn-action-primary shadow-lg',
        disabled: false
      },
      {
        tag: 'a',
        id: 'nav_bag_trigger_92',
        suggestedSelector: '#nav_bag_trigger_92',
        text: 'Proceed to Bag',
        disabled: false
      }
    ],
    pageSnippet: 'Quantum HyperBass Headphones $149.00 In Stock Audiophile Edition'
  };

  const harmlessResult = await healBrokenStep({
    intent: 'Add headphones to shopping cart',
    brokenSelector: '#btn-add-to-cart',
    domData: mockHarmlessDOM,
    mode: 'mutated'
  });

  console.log('Result Classification:', harmlessResult.classification);
  console.log('Healed Selector:', harmlessResult.healedSelector);
  console.log('Confidence:', harmlessResult.confidence + '%');
  console.log('Strategy Layer:', harmlessResult.strategyLayer);
  console.log('Safe to Resume:', harmlessResult.isSafeToResume);

  if (harmlessResult.classification !== 'Harmless_UI_Change' || !harmlessResult.isSafeToResume) {
    throw new Error('Expected Harmless_UI_Change with isSafeToResume=true');
  }

  // 3. Test Feature 3: Smart Triage (Genuine Bug Scenario - Server Error 500 & $0.00 Total)
  console.log('\n--- Test Scenario 2: Smart Triage Genuine Failure ---');
  const mockBugDOM = {
    elements: [
      {
        tag: 'button',
        id: 'checkout_action_auth_pay',
        suggestedSelector: '#checkout_action_auth_pay',
        text: 'Payment Service Offline (500 Error)',
        disabled: true
      }
    ],
    pageSnippet: 'Server Error 500: Payment Gateway Offline. Cart Total: $0.00'
  };

  const bugResult = await healBrokenStep({
    intent: 'Complete payment and authorize card',
    brokenSelector: '#btn-complete-order',
    domData: mockBugDOM,
    mode: 'bug_mode'
  });

  console.log('Result Classification:', bugResult.classification);
  console.log('Healed Selector:', bugResult.healedSelector);
  console.log('Reasoning:', bugResult.reasoning);
  console.log('Safe to Resume:', bugResult.isSafeToResume);

  if (bugResult.classification !== 'Genuine_Bug' || bugResult.isSafeToResume !== false) {
    throw new Error('Expected Genuine_Bug with isSafeToResume=false');
  }

  console.log('\n🎉 ALL ENGINE SELF-VERIFICATION CHECKS PASSED WITH 100% SUCCESS!');
  process.exit(0);
}

runSelfVerification().catch(err => {
  console.error('❌ Verification Failed:', err);
  process.exit(1);
});
