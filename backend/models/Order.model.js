const mongoose = require('mongoose');

const OrderSchema = new mongoose.Schema({
    customerId: mongoose.Schema.Types.ObjectId,
    items: [{
        menuItemId: mongoose.Schema.Types.ObjectId,
        quantity: Number,
        price: Number
    }],
    total: Number,
    status: { type: String, default: 'PENDING' }
});

module.exports = mongoose.model('Order', OrderSchema);
