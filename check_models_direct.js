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

if (!apiKey) {
    console.error("API Key not found in .env.local!");
    process.exit(1);
}

console.log("Using API Key (Prefix):", apiKey.substring(0, 5));

const models = [
    "gemini-1.5-flash",
    "gemini-1.5-flash-001",
    "gemini-1.5-flash-002",
    "gemini-1.5-pro",
    "gemini-1.5-pro-001",
    "gemini-1.5-pro-002",
    "gemini-2.0-flash-exp",
    "gemini-pro"
];

const genAI = new GoogleGenerativeAI(apiKey);

async function testModels() {
    console.log("Starting model checks...");

    for (const modelName of models) {
        process.stdout.write(`Testing ${modelName.padEnd(25)} ... `);
        try {
            const model = genAI.getGenerativeModel({ model: modelName });
            const result = await model.generateContent("Hello");
            const response = await result.response;
            console.log(`✅ OK (Response: ${response.text().trim()})`);
            // Since at least one works, let's stop? No, check all valuable ones.
        } catch (error) {
            if (error.message.includes("404") || error.message.includes("not found")) {
                console.log(`❌ 404 (Not Found)`);
            } else if (error.message.includes("expired")) {
                console.log(`❌ Key Expired`);
            } else {
                console.log(`❌ Error: ${error.message.split('\n')[0]}`);
            }
        }
    }
}

testModels();
