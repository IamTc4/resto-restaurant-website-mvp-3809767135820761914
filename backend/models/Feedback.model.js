const mongoose = require('mongoose');
const FeedbackSchema = new mongoose.Schema({ customerId: String, rating: Number, comment: String });
module.exports = mongoose.model('Feedback', FeedbackSchema);
