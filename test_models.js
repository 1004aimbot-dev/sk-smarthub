import { GoogleGenerativeAI } from "@google/generative-ai";
import fs from 'fs';
import path from 'path';

// Read .env.local manually
const envPath = path.resolve('d:\\성남신광교회-스마트-허브 (2)\\.env.local');
let apiKey = '';

try {
    const envContent = fs.readFileSync(envPath, 'utf8');
    const match = envContent.match(/GEMINI_API_KEY=(.+)/);
    if (match) {
        apiKey = match[1].trim();
    }
} catch (e) {
    console.error("Error reading .env.local:", e.message);
}

const genAI = new GoogleGenerativeAI(apiKey);

async function listModels() {
    try {
        console.log("Listing models...");
        // The SDK doesn't have a direct listModels but we can try to fetch them via REST or just test common ones.
        // Actually, let's just test 'gemini-2.0-flash-exp' and 'gemini-1.5-flash' specifically.
        const testModels = ["gemini-1.5-flash", "gemini-1.5-pro", "gemini-2.0-flash-exp", "gemini-3-flash-preview"];

        for (const m of testModels) {
            try {
                const model = genAI.getGenerativeModel({ model: m });
                const result = await model.generateContent("test");
                console.log(`✅ ${m}: SUCCESS`);
            } catch (e) {
                console.log(`❌ ${m}: ${e.message.split('\n')[0]}`);
            }
        }
    } catch (e) {
        console.error(e);
    }
}

listModels();
