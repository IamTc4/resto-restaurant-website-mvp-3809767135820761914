const mongoose = require('mongoose');

const CustomerSchema = new mongoose.Schema({
    name: String,
    phone: String,
    email: String,
    preferences: [String],
    order_count: { type: Number, default: 0 },
    last_order_date: Date,
    loyaltyTier: { type: String, default: 'BRONZE' }
});

module.exports = mongoose.model('Customer', CustomerSchema);
