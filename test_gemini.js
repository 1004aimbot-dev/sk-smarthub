import { GoogleGenerativeAI } from '@google/generative-ai';

const genAI = new GoogleGenerativeAI('AIzaSyBG08ShNR_GiLgwC5E_41XbeOApUsoCQYg');

async function run() {
    try {
        console.log("Testing gemini-1.5-flash...");
        const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });
        const result = await model.generateContent('Hi');
        const response = await result.response;
        console.log("SUCCESS:", response.text());
    } catch (e) {
        console.log("ERROR MESSAGE:", e.message);
    }
}

run();
