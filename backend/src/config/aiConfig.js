const axios = require('axios');
const logger = require('../utils/logger');

const getAIProvider = () => {
  if (process.env.GROQ_API_KEY) return 'groq';
  if (process.env.OPENAI_API_KEY) return 'openai';
  return process.env.AI_PROVIDER || 'local_heuristic';
};

/**
 * Call LLM API (Groq or OpenAI) or return null to trigger heuristic engine
 */
const callLLM = async (messages, options = {}) => {
  const provider = getAIProvider();

  if (provider === 'groq' && process.env.GROQ_API_KEY) {
    try {
      const response = await axios.post(
        'https://api.groq.com/openai/v1/chat/completions',
        {
          model: 'llama-3.3-70b-versatile',
          messages,
          temperature: 0.1,
          response_format: { type: 'json_object' }
        },
        {
          headers: {
            Authorization: `Bearer ${process.env.GROQ_API_KEY}`,
            'Content-Type': 'application/json'
          },
          timeout: 8000
        }
      );
      return JSON.parse(response.data.choices[0].message.content);
    } catch (err) {
      logger.warn(`Groq API request failed (${err.message}). Falling back to Semantic Heuristic Engine.`);
    }
  }

  if (provider === 'openai' && process.env.OPENAI_API_KEY) {
    try {
      const response = await axios.post(
        'https://api.openai.com/v1/chat/completions',
        {
          model: 'gpt-4o-mini',
          messages,
          temperature: 0.1,
          response_format: { type: 'json_object' }
        },
        {
          headers: {
            Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
            'Content-Type': 'application/json'
          },
          timeout: 8000
        }
      );
      return JSON.parse(response.data.choices[0].message.content);
    } catch (err) {
      logger.warn(`OpenAI API request failed (${err.message}). Falling back to Semantic Heuristic Engine.`);
    }
  }

  return null; // Signals heuristic fallback
};

module.exports = { getAIProvider, callLLM };
