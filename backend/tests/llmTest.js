require('dotenv').config({ path: require('path').resolve(__dirname, '../../.env') });
const { getAIProvider, callLLM } = require('../src/config/aiConfig');

(async () => {
  console.log('Provider:', getAIProvider());
  console.log('GROQ key set:', !!process.env.GROQ_API_KEY);
  try {
    const r = await callLLM([
      { role: 'user', content: 'Reply ONLY with JSON: {"ok":true,"model":"working"}' }
    ]);
    console.log('LLM Response:', JSON.stringify(r));
  } catch (e) {
    console.log('Error:', e.message);
  }
})();
