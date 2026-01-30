const mongoose = require('mongoose');
const AutomationSchema = new mongoose.Schema({ trigger: String, action: String, status: String });
module.exports = mongoose.model('Automation', AutomationSchema);
