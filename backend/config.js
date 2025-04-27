require('dotenv').config();

const config = {
  PORT: process.env.PORT || 5000,
  MONGO_URI: process.env.MONGO_URI,
  JWT_SECRET: process.env.JWT_SECRET,
  TOGETHER_API_KEY: process.env.TOGETHER_API_KEY,
  CLIENT_URL: process.env.CLIENT_URL
};

module.exports = config;
