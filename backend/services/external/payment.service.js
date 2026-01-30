exports.processPayment = async (amount) => {
    console.log('--- PAYMENT BYPASSED (PROTOTYPE MODE) ---');
    return { success: true, transactionId: 'MOCK-TXN-' + Date.now() };
};
