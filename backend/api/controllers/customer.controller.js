exports.getCustomer = async (req, res) => {
    res.json({ customerId: req.params.id, name: 'John Doe' });
};

exports.updateCustomer = async (req, res) => {
    res.json({ message: 'Customer updated' });
};

exports.getOrderHistory = async (req, res) => {
    res.json({ orders: [] });
};
