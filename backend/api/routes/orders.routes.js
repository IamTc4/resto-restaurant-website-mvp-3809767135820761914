/**
 * SAVORIA RESTAURANT - ORDERS API ROUTES
 * Complete order management: cart, checkout, tracking, history
 */

const express = require('express');
const router = express.Router();
const { orders, ORDER_STATUS, PAYMENT_STATUS, deliveryPartners, coupons, generateOrderId } = require('../../../database/seeds/orders.seed');
const { menuItems } = require('../../../database/seeds/menu-items.seed');
const { customers } = require('../../../database/seeds/customers.seed');

// In-memory data store
let ordersData = [...orders];
let cartsData = {}; // sessionId -> cart items

// ============ CART MANAGEMENT ============

/**
 * GET /api/orders/cart
 * Get current cart contents
 */
router.get('/cart', (req, res) => {
    try {
        const sessionId = req.headers['x-session-id'] || 'default-session';
        const cart = cartsData[sessionId] || { items: [], customerId: null };

        // Calculate totals
        const subtotal = cart.items.reduce((sum, item) => sum + item.subtotal, 0);
        const tax = subtotal * 0.05; // 5% GST
        const deliveryFee = subtotal > 500 ? 0 : 40;

        res.json({
            success: true,
            data: {
                items: cart.items,
                itemCount: cart.items.reduce((sum, item) => sum + item.quantity, 0),
                subtotal,
                tax,
                deliveryFee,
                total: subtotal + tax + deliveryFee
            }
        });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
});

/**
 * POST /api/orders/cart/add
 * Add item to cart
 */
router.post('/cart/add', (req, res) => {
    try {
        const sessionId = req.headers['x-session-id'] || 'default-session';
        const { menuItemId, quantity = 1, notes = '' } = req.body;

        // Initialize cart if not exists
        if (!cartsData[sessionId]) {
            cartsData[sessionId] = { items: [], customerId: null };
        }

        // Find menu item
        const menuItem = menuItems.find(item => item.id === parseInt(menuItemId));
        if (!menuItem) {
            return res.status(404).json({ success: false, error: 'Menu item not found' });
        }

        if (!menuItem.isAvailable) {
            return res.status(400).json({ success: false, error: 'Item is currently unavailable' });
        }

        // Check if item already in cart
        const existingIndex = cartsData[sessionId].items.findIndex(
            item => item.menuItemId === parseInt(menuItemId)
        );

        if (existingIndex > -1) {
            // Update quantity
            cartsData[sessionId].items[existingIndex].quantity += quantity;
            cartsData[sessionId].items[existingIndex].subtotal =
                cartsData[sessionId].items[existingIndex].quantity * menuItem.price;
            if (notes) cartsData[sessionId].items[existingIndex].notes = notes;
        } else {
            // Add new item
            cartsData[sessionId].items.push({
                menuItemId: menuItem.id,
                name: menuItem.name,
                price: menuItem.price,
                quantity,
                subtotal: menuItem.price * quantity,
                image: menuItem.image,
                isVeg: menuItem.isVeg,
                notes
            });
        }

        res.json({
            success: true,
            message: `${menuItem.name} added to cart`,
            data: cartsData[sessionId]
        });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
});

/**
 * PUT /api/orders/cart/update
 * Update item quantity in cart
 */
router.put('/cart/update', (req, res) => {
    try {
        const sessionId = req.headers['x-session-id'] || 'default-session';
        const { menuItemId, quantity } = req.body;

        if (!cartsData[sessionId]) {
            return res.status(404).json({ success: false, error: 'Cart not found' });
        }

        const itemIndex = cartsData[sessionId].items.findIndex(
            item => item.menuItemId === parseInt(menuItemId)
        );

        if (itemIndex === -1) {
            return res.status(404).json({ success: false, error: 'Item not in cart' });
        }

        if (quantity <= 0) {
            // Remove item
            cartsData[sessionId].items.splice(itemIndex, 1);
        } else {
            // Update quantity
            cartsData[sessionId].items[itemIndex].quantity = quantity;
            cartsData[sessionId].items[itemIndex].subtotal =
                cartsData[sessionId].items[itemIndex].price * quantity;
        }

        res.json({
            success: true,
            message: 'Cart updated',
            data: cartsData[sessionId]
        });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
});

/**
 * DELETE /api/orders/cart/remove/:menuItemId
 * Remove item from cart
 */
router.delete('/cart/remove/:menuItemId', (req, res) => {
    try {
        const sessionId = req.headers['x-session-id'] || 'default-session';

        if (!cartsData[sessionId]) {
            return res.status(404).json({ success: false, error: 'Cart not found' });
        }

        const itemIndex = cartsData[sessionId].items.findIndex(
            item => item.menuItemId === parseInt(req.params.menuItemId)
        );

        if (itemIndex === -1) {
            return res.status(404).json({ success: false, error: 'Item not in cart' });
        }

        const removedItem = cartsData[sessionId].items.splice(itemIndex, 1)[0];

        res.json({
            success: true,
            message: `${removedItem.name} removed from cart`,
            data: cartsData[sessionId]
        });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
});

/**
 * DELETE /api/orders/cart/clear
 * Clear entire cart
 */
router.delete('/cart/clear', (req, res) => {
    try {
        const sessionId = req.headers['x-session-id'] || 'default-session';
        cartsData[sessionId] = { items: [], customerId: null };

        res.json({
            success: true,
            message: 'Cart cleared'
        });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
});

/**
 * POST /api/orders/cart/apply-coupon
 * Apply coupon code to cart
 */
router.post('/cart/apply-coupon', (req, res) => {
    try {
        const sessionId = req.headers['x-session-id'] || 'default-session';
        const { couponCode } = req.body;

        if (!cartsData[sessionId] || cartsData[sessionId].items.length === 0) {
            return res.status(400).json({ success: false, error: 'Cart is empty' });
        }

        const coupon = coupons.find(c => c.code.toUpperCase() === couponCode.toUpperCase());
        if (!coupon) {
            return res.status(404).json({ success: false, error: 'Invalid coupon code' });
        }

        // Check validity
        if (new Date(coupon.validTill) < new Date()) {
            return res.status(400).json({ success: false, error: 'Coupon has expired' });
        }

        const subtotal = cartsData[sessionId].items.reduce((sum, item) => sum + item.subtotal, 0);
        if (subtotal < coupon.minOrder) {
            return res.status(400).json({
                success: false,
                error: `Minimum order of ₹${coupon.minOrder} required for this coupon`
            });
        }

        // Calculate discount
        let discount = coupon.type === 'percentage'
            ? (subtotal * coupon.discount / 100)
            : coupon.discount;

        discount = Math.min(discount, coupon.maxDiscount);

        cartsData[sessionId].appliedCoupon = {
            code: coupon.code,
            discount,
            description: coupon.description
        };

        res.json({
            success: true,
            message: `Coupon applied! You save ₹${discount.toFixed(2)}`,
            data: {
                coupon: cartsData[sessionId].appliedCoupon,
                discount
            }
        });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
});

// ============ ORDER MANAGEMENT ============

/**
 * POST /api/orders/checkout
 * Create order from cart
 */
router.post('/checkout', (req, res) => {
    try {
        const sessionId = req.headers['x-session-id'] || 'default-session';
        const { customerId, address, paymentMethod, notes = '' } = req.body;

        if (!cartsData[sessionId] || cartsData[sessionId].items.length === 0) {
            return res.status(400).json({ success: false, error: 'Cart is empty' });
        }

        if (!address || !paymentMethod) {
            return res.status(400).json({ success: false, error: 'Address and payment method required' });
        }

        const cart = cartsData[sessionId];
        const subtotal = cart.items.reduce((sum, item) => sum + item.subtotal, 0);
        const tax = subtotal * 0.05;
        const deliveryFee = subtotal > 500 ? 0 : 40;
        const discount = cart.appliedCoupon?.discount || 0;
        const total = subtotal + tax + deliveryFee - discount;

        // Get customer info
        const customer = customers.find(c => c.id === customerId) || {
            id: 'guest',
            name: req.body.customerName || 'Guest',
            phone: req.body.customerPhone || ''
        };

        // Create order
        const newOrder = {
            id: `ORD-${Date.now()}`,
            customerId: customer.id,
            customerName: customer.name,
            customerPhone: customer.phone,
            items: cart.items.map(item => ({
                menuItemId: item.menuItemId,
                name: item.name,
                quantity: item.quantity,
                price: item.price,
                subtotal: item.subtotal
            })),
            subtotal,
            tax,
            deliveryFee,
            discount,
            couponCode: cart.appliedCoupon?.code || null,
            total,
            status: ORDER_STATUS.PENDING,
            paymentStatus: paymentMethod === 'cod' ? PAYMENT_STATUS.PENDING : PAYMENT_STATUS.PAID,
            paymentMethod,
            address,
            notes,
            rating: null,
            feedback: null,
            createdAt: new Date().toISOString(),
            confirmedAt: null,
            preparedAt: null,
            deliveredAt: null,
            deliveryPartnerId: null,
            estimatedDeliveryTime: 45
        };

        ordersData.push(newOrder);

        // Clear cart
        cartsData[sessionId] = { items: [], customerId: null };

        // Simulate order confirmation after 2 seconds
        setTimeout(() => {
            const order = ordersData.find(o => o.id === newOrder.id);
            if (order && order.status === ORDER_STATUS.PENDING) {
                order.status = ORDER_STATUS.CONFIRMED;
                order.confirmedAt = new Date().toISOString();
                // Assign random delivery partner
                const partner = deliveryPartners[Math.floor(Math.random() * deliveryPartners.length)];
                order.deliveryPartnerId = partner.id;
            }
        }, 2000);

        res.status(201).json({
            success: true,
            message: 'Order placed successfully!',
            data: {
                orderId: newOrder.id,
                total: newOrder.total,
                estimatedDeliveryTime: newOrder.estimatedDeliveryTime,
                status: newOrder.status
            }
        });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
});

/**
 * GET /api/orders/:id
 * Get order details by ID
 */
router.get('/:id', (req, res) => {
    try {
        const order = ordersData.find(o => o.id === req.params.id);

        if (!order) {
            return res.status(404).json({ success: false, error: 'Order not found' });
        }

        // Get delivery partner info
        let deliveryPartner = null;
        if (order.deliveryPartnerId) {
            deliveryPartner = deliveryPartners.find(dp => dp.id === order.deliveryPartnerId);
        }

        res.json({
            success: true,
            data: { ...order, deliveryPartner }
        });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
});

/**
 * GET /api/orders/track/:id
 * Get order tracking status
 */
router.get('/track/:id', (req, res) => {
    try {
        const order = ordersData.find(o => o.id === req.params.id);

        if (!order) {
            return res.status(404).json({ success: false, error: 'Order not found' });
        }

        // Build tracking timeline
        const timeline = [
            { status: 'Order Placed', time: order.createdAt, completed: true },
            { status: 'Order Confirmed', time: order.confirmedAt, completed: !!order.confirmedAt },
            { status: 'Preparing', time: order.preparedAt, completed: !!order.preparedAt },
            { status: 'Out for Delivery', time: null, completed: order.status === ORDER_STATUS.OUT_FOR_DELIVERY || order.status === ORDER_STATUS.DELIVERED },
            { status: 'Delivered', time: order.deliveredAt, completed: order.status === ORDER_STATUS.DELIVERED }
        ];

        // Get delivery partner
        let deliveryPartner = null;
        if (order.deliveryPartnerId) {
            deliveryPartner = deliveryPartners.find(dp => dp.id === order.deliveryPartnerId);
        }

        // Mock live location for out-for-delivery orders
        let liveLocation = null;
        if (order.status === ORDER_STATUS.OUT_FOR_DELIVERY) {
            liveLocation = {
                lat: 19.0760 + (Math.random() * 0.02 - 0.01),
                lng: 72.8777 + (Math.random() * 0.02 - 0.01),
                lastUpdated: new Date().toISOString()
            };
        }

        res.json({
            success: true,
            data: {
                orderId: order.id,
                currentStatus: order.status,
                timeline,
                deliveryPartner,
                liveLocation,
                estimatedDeliveryTime: order.estimatedDeliveryTime,
                address: order.address
            }
        });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
});

/**
 * GET /api/orders/history/:customerId
 * Get order history for customer
 */
router.get('/history/:customerId', (req, res) => {
    try {
        const customerOrders = ordersData
            .filter(o => o.customerId === req.params.customerId)
            .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

        res.json({
            success: true,
            count: customerOrders.length,
            data: customerOrders
        });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
});

/**
 * PATCH /api/orders/:id/status
 * Update order status (Admin/Kitchen)
 */
router.patch('/:id/status', (req, res) => {
    try {
        const { status } = req.body;
        const order = ordersData.find(o => o.id === req.params.id);

        if (!order) {
            return res.status(404).json({ success: false, error: 'Order not found' });
        }

        if (!Object.values(ORDER_STATUS).includes(status)) {
            return res.status(400).json({ success: false, error: 'Invalid status' });
        }

        order.status = status;

        // Update timestamps based on status
        switch (status) {
            case ORDER_STATUS.CONFIRMED:
                order.confirmedAt = new Date().toISOString();
                break;
            case ORDER_STATUS.PREPARING:
                if (!order.confirmedAt) order.confirmedAt = new Date().toISOString();
                break;
            case ORDER_STATUS.READY:
                order.preparedAt = new Date().toISOString();
                break;
            case ORDER_STATUS.DELIVERED:
                order.deliveredAt = new Date().toISOString();
                break;
        }

        res.json({
            success: true,
            message: `Order status updated to ${status}`,
            data: order
        });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
});

/**
 * POST /api/orders/:id/cancel
 * Cancel order
 */
router.post('/:id/cancel', (req, res) => {
    try {
        const { reason } = req.body;
        const order = ordersData.find(o => o.id === req.params.id);

        if (!order) {
            return res.status(404).json({ success: false, error: 'Order not found' });
        }

        // Can only cancel if not yet out for delivery
        const cancellableStatuses = [ORDER_STATUS.PENDING, ORDER_STATUS.CONFIRMED, ORDER_STATUS.PREPARING];
        if (!cancellableStatuses.includes(order.status)) {
            return res.status(400).json({
                success: false,
                error: 'Order cannot be cancelled at this stage'
            });
        }

        order.status = ORDER_STATUS.CANCELLED;
        order.cancelReason = reason || 'Customer requested cancellation';
        order.cancelledAt = new Date().toISOString();

        if (order.paymentStatus === PAYMENT_STATUS.PAID) {
            order.paymentStatus = PAYMENT_STATUS.REFUNDED;
        }

        res.json({
            success: true,
            message: 'Order cancelled successfully',
            data: order
        });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
});

/**
 * POST /api/orders/:id/rate
 * Rate an order
 */
router.post('/:id/rate', (req, res) => {
    try {
        const { rating, feedback } = req.body;
        const order = ordersData.find(o => o.id === req.params.id);

        if (!order) {
            return res.status(404).json({ success: false, error: 'Order not found' });
        }

        if (order.status !== ORDER_STATUS.DELIVERED) {
            return res.status(400).json({ success: false, error: 'Can only rate delivered orders' });
        }

        if (rating < 1 || rating > 5) {
            return res.status(400).json({ success: false, error: 'Rating must be between 1 and 5' });
        }

        order.rating = rating;
        order.feedback = feedback || '';

        res.json({
            success: true,
            message: 'Thank you for your feedback!',
            data: { rating: order.rating, feedback: order.feedback }
        });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
});

/**
 * GET /api/orders (Admin)
 * Get all orders with filters
 */
router.get('/', (req, res) => {
    try {
        let result = [...ordersData];
        const { status, date, customerId, limit = 50 } = req.query;

        if (status) {
            result = result.filter(o => o.status === status);
        }

        if (customerId) {
            result = result.filter(o => o.customerId === customerId);
        }

        if (date) {
            result = result.filter(o => o.createdAt.startsWith(date));
        }

        // Sort by newest first
        result.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

        res.json({
            success: true,
            count: result.length,
            data: result.slice(0, parseInt(limit))
        });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
});

module.exports = router;
