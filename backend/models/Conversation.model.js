const mongoose = require('mongoose');

const ConversationSchema = new mongoose.Schema({
    customerId: mongoose.Schema.Types.ObjectId,
    messages: [{
        role: String,
        content: String,
        timestamp: { type: Date, default: Date.now }
    }]
});

module.exports = mongoose.model('Conversation', ConversationSchema);
