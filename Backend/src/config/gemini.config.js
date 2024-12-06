const { GoogleGenerativeAI } = require("@google/generative-ai");

const configuration = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
const modelId = "gemini-pro";
const model = configuration.getGenerativeModel({ model: modelId });

module.exports = {
  model,
};
