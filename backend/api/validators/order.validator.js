exports.validateOrder = (req, res, next) => {
    const { items, total } = req.body;
    if (!items || items.length === 0) {
        return res.status(400).json({ error: 'Cart is empty' });
    }
    next();
};
