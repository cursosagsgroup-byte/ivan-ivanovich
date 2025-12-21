
const { GoogleGenerativeAI } = require('@google/generative-ai');



const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || '');
const model = genAI.getGenerativeModel({ model: "gemini-pro" });

async function run() {
    console.log('Testing Gemini API key...');
    console.log('Key available:', !!process.env.GEMINI_API_KEY);

    try {
        const result = await model.generateContent("Hello, are you working?");
        const response = result.response.text();
        console.log('Success! Response:', response);
    } catch (e) {
        console.error('API Error:', e);
    }
}

run();
