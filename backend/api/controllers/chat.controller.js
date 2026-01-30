const llmService = require('../../services/ai/llm.service');

const chatHistory = {};

exports.sendMessage = async (req, res) => {
    try {
        const { message, customerId } = req.body;
        console.log(`[Chat] Message from ${customerId}: ${message}`);

        let history = chatHistory[customerId] || [];
        const aiResponse = await llmService.generateResponse(message, history);

        history.push({ role: 'user', content: message });
        history.push({ role: 'assistant', content: aiResponse.content });
        chatHistory[customerId] = history;

        res.json({ reply: aiResponse.content });
    } catch (error) {
        console.error("Chat Controller Error:", error);
        res.status(500).json({ error: error.message });
    }
};

exports.getHistory = async (req, res) => {
    try {
        const { customerId } = req.params;
        res.json({ history: chatHistory[customerId] || [] });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};
