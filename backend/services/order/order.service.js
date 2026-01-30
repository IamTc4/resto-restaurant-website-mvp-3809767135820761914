const Order = require('../../models/Order.model');
const supabase = require('../../config/supabase.config');

const mockOrders = [];

exports.placeOrder = async (orderData) => {
    // 1. Try Supabase
    if (supabase) {
        const { data, error } = await supabase
            .from('orders')
            .insert([orderData])
            .select();

        if (!error) return data[0];
        console.error('Supabase Error:', error.message);
    }

    // 2. Try MongoDB (Legacy)
    try {
        if (require('mongoose').connection.readyState === 1) {
            const order = new Order(orderData);
            return await order.save();
        }
    } catch (err) {
        console.warn('MongoDB not available');
    }

    // 3. Fallback to Memory (Prototype Mode)
    console.log('Using in-memory storage for order');
    const newOrder = { id: Date.now(), ...orderData, status: 'PENDING' };
    mockOrders.push(newOrder);
    return newOrder;
};
