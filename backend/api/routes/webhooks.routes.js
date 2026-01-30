const express = require('express');
const router = express.Router();

router.post('/whatsapp', (req, res) => res.send('WhatsApp Webhook Received'));
router.post('/payment', (req, res) => res.send('Payment Webhook Received'));

module.exports = router;
