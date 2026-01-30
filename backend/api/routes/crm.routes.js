const express = require('express');
const router = express.Router();
const customerController = require('../controllers/customer.controller');

router.get('/:id', customerController.getCustomer);
router.put('/:id', customerController.updateCustomer);
router.get('/:id/history', customerController.getOrderHistory);

module.exports = router;
