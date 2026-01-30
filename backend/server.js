/**
 * SAVORIA RESTAURANT - MAIN SERVER
 * Ultimate Backend with all API routes
 */

require('dotenv').config();
const express = require('express');
const cors = require('cors');
const path = require('path');

// Import routes
const chatRoutes = require('./api/routes/chat.routes');
const menuRoutes = require('./api/routes/menu.routes');
const ordersRoutes = require('./api/routes/orders.routes');
const analyticsRoutes = require('./api/routes/analytics.routes');

const app = express();
const PORT = process.env.PORT || 5006;

// ============ MIDDLEWARE ============

// CORS - allow all origins for development
app.use(cors({
    origin: '*',
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'X-Session-Id']
}));

// Body parsing
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

// Request logging
app.use((req, res, next) => {
    const timestamp = new Date().toISOString();
    console.log(`[${timestamp}] ${req.method} ${req.path}`);
    next();
});

// ============ API ROUTES ============

// Health check
app.get('/', (req, res) => {
    res.json({
        name: 'Savoria Restaurant API',
        version: '2.0.0',
        status: 'active',
        timestamp: new Date().toISOString(),
        endpoints: {
            chat: '/api/chat',
            menu: '/api/menu',
            orders: '/api/orders',
            analytics: '/api/analytics'
        }
    });
});

// API routes
app.use('/api/chat', chatRoutes);
app.use('/api/menu', menuRoutes);
app.use('/api/orders', ordersRoutes);
app.use('/api/analytics', analyticsRoutes);

// ============ ERROR HANDLING ============

// 404 handler
app.use((req, res) => {
    res.status(404).json({
        success: false,
        error: 'Endpoint not found',
        path: req.path
    });
});

// Global error handler
app.use((err, req, res, next) => {
    console.error('Server Error:', err);
    res.status(500).json({
        success: false,
        error: process.env.NODE_ENV === 'production'
            ? 'Internal server error'
            : err.message
    });
});

// ============ SERVER START ============

app.listen(PORT, () => {
    console.log(`
╔════════════════════════════════════════════════╗
║                                                ║
║   🍽️  SAVORIA RESTAURANT API v2.0             ║
║                                                ║
║   Server running on port ${PORT}                 ║
║   http://localhost:${PORT}                       ║
║                                                ║
║   Available Endpoints:                         ║
║   • GET  /api/menu           - Browse menu     ║
║   • POST /api/orders/cart    - Manage cart     ║
║   • POST /api/orders/checkout - Place order    ║
║   • GET  /api/analytics      - View insights   ║
║   • POST /api/chat           - AI assistant    ║
║                                                ║
╚════════════════════════════════════════════════╝
  `);
});

module.exports = app;
