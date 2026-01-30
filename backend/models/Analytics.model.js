const mongoose = require('mongoose');
const AnalyticsSchema = new mongoose.Schema({ event: String, data: Object, timestamp: Date });
module.exports = mongoose.model('Analytics', AnalyticsSchema);
