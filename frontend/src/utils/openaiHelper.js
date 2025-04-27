const { Configuration, OpenAIApi } = require("openai");

const configuration = new Configuration({
  apiKey: process.env.OPENAI_API_KEY,
});
const openai = new OpenAIApi(configuration);

const getAIReply = async (feedbackText) => {
  const response = await openai.createChatCompletion({
    model: "gpt-3.5-turbo",
    messages: [{ role: "system", content: "Reply as a helpful admin to this feedback:" }, { role: "user", content: feedbackText }]
  });
  return response.data.choices[0].message.content;
};

module.exports = { getAIReply };
