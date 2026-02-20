import { GoogleGenerativeAI } from "@google/generative-ai";
import dotenv from 'dotenv';
import fs from 'fs';
import path from 'path';

// .env.local 파일 직접 읽기 (Windows 환경 호환성 위해)
const envPath = path.resolve(process.cwd(), '.env.local');
const envConfig = dotenv.parse(fs.readFileSync(envPath));
const apiKey = envConfig.GEMINI_API_KEY;

console.log("Checking API Key:", apiKey ? apiKey.substring(0, 5) + "..." : "MISSING");

async function checkModels() {
    if (!apiKey) {
        console.error("No API KEY found in .env.local");
        return;
    }

    try {
        const genAI = new GoogleGenerativeAI(apiKey);
        // listModels 메서드를 지원하는지 확인 (SDK 버전에 따라 다를 수 있음)
        // 일반적으로는 genAI.getGenerativeModelMain, 혹은 model manager가 필요할 수 있음.
        // @google/generative-ai SDK에서는 genAI 인스턴스 자체에 listModels가 없고, 
        // 보통은 모델을 직접 요청해서 확인합니다. 
        // 하지만 listModels 기능은 관리자/시스템용이라 일반 API 키로는 제한될 수 있습니다.

        // 대신 가장 일반적인 모델들로 'generateContent'를 'Dry Run' 해봅니다.
        const candidates = [
            "gemini-2.0-flash",
            "gemini-2.0-flash-exp",
            "gemini-1.5-flash",
            "gemini-1.5-flash-001",
            "gemini-1.5-flash-002",
            "gemini-1.5-pro",
            "gemini-1.5-pro-001",
            "gemini-1.5-pro-002",
            "gemini-pro"
        ];

        console.log("\nAttempting to connect to Google Gemini API with various model names...\n");

        for (const modelName of candidates) {
            process.stdout.write(`Testing model: ${modelName.padEnd(20)} ... `);
            try {
                const model = genAI.getGenerativeModel({ model: modelName });
                const result = await model.generateContent("Hi");
                const response = await result.response;
                console.log(`✅ SUCCESS! (Response: ${response.text().trim()})`);

                // 성공하면 바로 종료하지 않고 계속 테스트하거나, 가장 최신을 추천할 수 있음.
            } catch (error) {
                if (error.message.includes("404") || error.message.includes("not found")) {
                    console.log(`❌ Not Found (404)`);
                } else if (error.message.includes("API key expired")) {
                    console.log(`❌ API Key Expired`);
                } else {
                    console.log(`❌ Error: ${error.message.split('\n')[0]}`);
                }
            }
        }

    } catch (error) {
        console.error("Fatal Error:", error);
    }
}

checkModels();
