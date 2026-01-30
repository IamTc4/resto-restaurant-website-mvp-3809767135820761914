module.exports = {
    apiKey: process.env.GEMINI_API_KEY || 'prototype-mock-key',
    model: process.env.GEMINI_MODEL || 'gemini-1.5-flash',
    provider: process.env.AI_PROVIDER || 'gemini', // 'gemini' or 'local'
    localEndpoint: process.env.LOCAL_AI_ENDPOINT || 'http://localhost:11434/api/generate' // Default Ollama
};
