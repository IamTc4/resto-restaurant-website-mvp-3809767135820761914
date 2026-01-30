import { post, get } from './api.service';

export const sendMessage = async (message, customerId) => {
    return await post('/chat/send', { message, customerId });
};

export const getHistory = async (customerId) => {
    return await get(`/chat/history/${customerId}`);
};
