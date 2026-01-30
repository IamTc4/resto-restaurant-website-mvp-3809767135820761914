const express = require('express');
const router = express.Router();

router.get('/dashboard', (req, res) => res.send('Admin Dashboard Data'));
router.post('/settings', (req, res) => res.send('Update Settings'));

module.exports = router;
