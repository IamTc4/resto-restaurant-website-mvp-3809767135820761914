exports.createOrder = async (amount) => {
    return {
        id: 'order_12345',
        amount: amount * 100,
        currency: 'INR'
    };
};
