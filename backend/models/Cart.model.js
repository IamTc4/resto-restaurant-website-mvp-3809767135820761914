const mongoose = require('mongoose');

const CartSchema = new mongoose.Schema({
    customerId: mongoose.Schema.Types.ObjectId,
    items: [{
        menuItemId: mongoose.Schema.Types.ObjectId,
        quantity: Number
    }]
});

module.exports = mongoose.model('Cart', CartSchema);
