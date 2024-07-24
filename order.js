const express = require('express');
const router = express.Router();
const Order = require('../models/Order');

// Create order
router.post('/', async (req, res) => {
    const { userId, products, total } = req.body;
    try {
        const order = new Order({ userId, products, total });
        await order.save();
        res.status(201).json(order);
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
});

module.exports = router;
