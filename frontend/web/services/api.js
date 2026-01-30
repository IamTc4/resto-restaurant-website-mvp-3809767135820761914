/**
 * SAVORIA RESTAURANT - API SERVICE
 * Frontend service for backend API communication
 */

const API_BASE = 'http://localhost:5006/api';

// Session ID for cart persistence
const getSessionId = () => {
    let sessionId = localStorage.getItem('savoria_session_id');
    if (!sessionId) {
        sessionId = 'session_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
        localStorage.setItem('savoria_session_id', sessionId);
    }
    return sessionId;
};

const headers = () => ({
    'Content-Type': 'application/json',
    'X-Session-Id': getSessionId()
});

// ============ MENU API ============

export const menuAPI = {
    getAll: async (filters = {}) => {
        const params = new URLSearchParams(filters);
        const res = await fetch(`${API_BASE}/menu?${params}`, { headers: headers() });
        return res.json();
    },

    getById: async (id) => {
        const res = await fetch(`${API_BASE}/menu/${id}`, { headers: headers() });
        return res.json();
    },

    getCategories: async () => {
        const res = await fetch(`${API_BASE}/menu/categories`, { headers: headers() });
        return res.json();
    },

    getBestsellers: async (limit = 8) => {
        const res = await fetch(`${API_BASE}/menu/bestsellers?limit=${limit}`, { headers: headers() });
        return res.json();
    },

    getRecommendations: async (itemId = null) => {
        const url = itemId
            ? `${API_BASE}/menu/recommendations?itemId=${itemId}`
            : `${API_BASE}/menu/recommendations`;
        const res = await fetch(url, { headers: headers() });
        return res.json();
    }
};

// ============ CART API ============

export const cartAPI = {
    get: async () => {
        const res = await fetch(`${API_BASE}/orders/cart`, { headers: headers() });
        return res.json();
    },

    addItem: async (menuItemId, quantity = 1, notes = '') => {
        const res = await fetch(`${API_BASE}/orders/cart/add`, {
            method: 'POST',
            headers: headers(),
            body: JSON.stringify({ menuItemId, quantity, notes })
        });
        return res.json();
    },

    updateItem: async (menuItemId, quantity) => {
        const res = await fetch(`${API_BASE}/orders/cart/update`, {
            method: 'PUT',
            headers: headers(),
            body: JSON.stringify({ menuItemId, quantity })
        });
        return res.json();
    },

    removeItem: async (menuItemId) => {
        const res = await fetch(`${API_BASE}/orders/cart/remove/${menuItemId}`, {
            method: 'DELETE',
            headers: headers()
        });
        return res.json();
    },

    clear: async () => {
        const res = await fetch(`${API_BASE}/orders/cart/clear`, {
            method: 'DELETE',
            headers: headers()
        });
        return res.json();
    },

    applyCoupon: async (couponCode) => {
        const res = await fetch(`${API_BASE}/orders/cart/apply-coupon`, {
            method: 'POST',
            headers: headers(),
            body: JSON.stringify({ couponCode })
        });
        return res.json();
    }
};

// ============ ORDERS API ============

export const ordersAPI = {
    checkout: async (orderData) => {
        const res = await fetch(`${API_BASE}/orders/checkout`, {
            method: 'POST',
            headers: headers(),
            body: JSON.stringify(orderData)
        });
        return res.json();
    },

    getById: async (orderId) => {
        const res = await fetch(`${API_BASE}/orders/${orderId}`, { headers: headers() });
        return res.json();
    },

    track: async (orderId) => {
        const res = await fetch(`${API_BASE}/orders/track/${orderId}`, { headers: headers() });
        return res.json();
    },

    getHistory: async (customerId) => {
        const res = await fetch(`${API_BASE}/orders/history/${customerId}`, { headers: headers() });
        return res.json();
    },

    cancel: async (orderId, reason) => {
        const res = await fetch(`${API_BASE}/orders/${orderId}/cancel`, {
            method: 'POST',
            headers: headers(),
            body: JSON.stringify({ reason })
        });
        return res.json();
    },

    rate: async (orderId, rating, feedback) => {
        const res = await fetch(`${API_BASE}/orders/${orderId}/rate`, {
            method: 'POST',
            headers: headers(),
            body: JSON.stringify({ rating, feedback })
        });
        return res.json();
    }
};

// ============ ANALYTICS API (Admin) ============

export const analyticsAPI = {
    getDashboard: async () => {
        const res = await fetch(`${API_BASE}/analytics/dashboard`, { headers: headers() });
        return res.json();
    },

    getSales: async (period = '7days') => {
        const res = await fetch(`${API_BASE}/analytics/sales?period=${period}`, { headers: headers() });
        return res.json();
    },

    getPopularItems: async (limit = 10) => {
        const res = await fetch(`${API_BASE}/analytics/menu/popular?limit=${limit}`, { headers: headers() });
        return res.json();
    },

    getCategoryBreakdown: async () => {
        const res = await fetch(`${API_BASE}/analytics/menu/category`, { headers: headers() });
        return res.json();
    },

    getCustomerInsights: async () => {
        const res = await fetch(`${API_BASE}/analytics/customers`, { headers: headers() });
        return res.json();
    },

    getRevenue: async () => {
        const res = await fetch(`${API_BASE}/analytics/revenue/breakdown`, { headers: headers() });
        return res.json();
    },

    getFeedback: async () => {
        const res = await fetch(`${API_BASE}/analytics/feedback`, { headers: headers() });
        return res.json();
    }
};

// ============ CHAT API ============

export const chatAPI = {
    send: async (message, history = []) => {
        const res = await fetch(`${API_BASE}/chat/message`, {
            method: 'POST',
            headers: headers(),
            body: JSON.stringify({ message, history, customerId: localStorage.getItem('savoria_customer_id') })
        });
        return res.json();
    }
};

export default {
    menu: menuAPI,
    cart: cartAPI,
    orders: ordersAPI,
    analytics: analyticsAPI,
    chat: chatAPI
};
