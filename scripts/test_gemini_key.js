
const { GoogleGenerativeAI } = require('@google/generative-ai');

async function testV() {
  console.log('Testing gemini...');
  // check if key available via node process.env
  if (process.env.GEMINI_API_KEY) {
      console.log('Key exists.');
  } else {
      console.log('No GEMINI_API_KEY. Need to check .env');
  }
}
testV();
