exports.validateMessage = (req, res, next) => {
    const { message, customerId } = req.body;
    if (!message || !customerId) {
        return res.status(400).json({ error: 'Message and Customer ID are required' });
    }
    next();
};
