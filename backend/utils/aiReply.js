const config = require('../config');
const fetch = require('node-fetch');

if (!config.TOGETHER_API_KEY) {
  console.warn('⚠️ TOGETHER_API_KEY is missing in .env. AI replies will be disabled.');
}

module.exports = async function generateAdminReply(feedbackText) {
  if (!config.TOGETHER_API_KEY) {
    return "Thanks for your feedback! (AI auto-reply disabled)";
  }

  try {
    const response = await fetch('https://api.together.xyz/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${config.TOGETHER_API_KEY}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        model: "mistralai/Mixtral-8x7B-Instruct-v0.1", // good free model
        messages: [
          { role: "system", content: "You are a helpful admin assistant." },
          { role: "user", content: feedbackText }
        ]
      })
    });

    const data = await response.json();

    if (!data.choices || data.choices.length === 0) {
      console.error("❌ No choices in Together.ai response");
      return "Thanks for your feedback! (AI reply not available)";
    }

    return data.choices[0].message.content;
  } catch (err) {
    console.error("❌ Together API Error:", err.message);
    return "Thanks for your feedback! (AI reply failed)";
  }
};
