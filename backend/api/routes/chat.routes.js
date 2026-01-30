const express = require('express');
const router = express.Router();
const chatController = require('../controllers/chat.controller');
const chatValidator = require('../validators/chat.validator');

router.post('/send', chatValidator.validateMessage, chatController.sendMessage);
router.get('/history/:customerId', chatController.getHistory);

module.exports = router;
