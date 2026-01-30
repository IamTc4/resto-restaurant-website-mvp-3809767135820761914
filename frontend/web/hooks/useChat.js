import { useState, useEffect } from 'react';
import { sendMessage, getHistory } from '../services/chat.service';

export const useChat = (customerId) => {
    const [messages, setMessages] = useState([
        { role: 'ai', content: 'Welcome to Savoria. I am your Sommelier. How may I elevate your dining experience today?', timestamp: new Date() }
    ]);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (customerId) {
            getHistory(customerId).then(data => setMessages(data.history || []));
        }
    }, [customerId]);

    const send = async (text) => {
        setLoading(true);
        // Optimistic UI update
        const userMsg = { role: 'user', content: text, timestamp: new Date() };
        setMessages(prev => [...prev, userMsg]);

        try {
            const response = await sendMessage(text, customerId);
            const aiMsg = { role: 'ai', content: response.reply, timestamp: new Date() };
            setMessages(prev => [...prev, aiMsg]);
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    return { messages, send, loading };
};
