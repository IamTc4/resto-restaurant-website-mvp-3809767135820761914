/**
 * SAVORIA RESTAURANT - ANALYTICS API ROUTES
 * Business intelligence, sales metrics, and insights
 */

const express = require('express');
const router = express.Router();
const { orders, ORDER_STATUS } = require('../../../database/seeds/orders.seed');
const { menuItems } = require('../../../database/seeds/menu-items.seed');
const { customers, customerSegments } = require('../../../database/seeds/customers.seed');

// ============ DASHBOARD OVERVIEW ============

/**
 * GET /api/analytics/dashboard
 * Get dashboard overview metrics
 */
router.get('/dashboard', (req, res) => {
    try {
        const completedOrders = orders.filter(o => o.status === ORDER_STATUS.DELIVERED);

        // Key metrics
        const totalOrders = completedOrders.length;
        const totalRevenue = completedOrders.reduce((sum, o) => sum + o.total, 0);
        const averageOrderValue = totalOrders > 0 ? totalRevenue / totalOrders : 0;

        // Today's metrics
        const today = new Date().toISOString().split('T')[0];
        const todayOrders = completedOrders.filter(o => o.createdAt.startsWith(today));
        const todayRevenue = todayOrders.reduce((sum, o) => sum + o.total, 0);

        // Pending orders
        const pendingOrders = orders.filter(o =>
            [ORDER_STATUS.PENDING, ORDER_STATUS.CONFIRMED, ORDER_STATUS.PREPARING].includes(o.status)
        ).length;

        // Average rating
        const ratedOrders = completedOrders.filter(o => o.rating);
        const averageRating = ratedOrders.length > 0
            ? ratedOrders.reduce((sum, o) => sum + o.rating, 0) / ratedOrders.length
            : 0;

        // Customer count
        const uniqueCustomers = [...new Set(orders.map(o => o.customerId))].length;

        res.json({
            success: true,
            data: {
                overview: {
                    totalOrders,
                    totalRevenue: totalRevenue.toFixed(2),
                    averageOrderValue: averageOrderValue.toFixed(2),
                    averageRating: averageRating.toFixed(1),
                    totalCustomers: uniqueCustomers
                },
                today: {
                    orders: todayOrders.length,
                    revenue: todayRevenue.toFixed(2),
                    pendingOrders
                },
                comparison: {
                    ordersChange: '+12%', // Mock data
                    revenueChange: '+18%',
                    ratingChange: '+0.2'
                }
            }
        });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
});

// ============ SALES ANALYTICS ============

/**
 * GET /api/analytics/sales
 * Get sales trends over time
 */
router.get('/sales', (req, res) => {
    try {
        const { period = '7days' } = req.query;
        const completedOrders = orders.filter(o => o.status === ORDER_STATUS.DELIVERED);

        // Generate last N days data
        const days = period === '30days' ? 30 : 7;
        const salesByDay = [];

        for (let i = days - 1; i >= 0; i--) {
            const date = new Date();
            date.setDate(date.getDate() - i);
            const dateStr = date.toISOString().split('T')[0];

            const dayOrders = completedOrders.filter(o => o.createdAt.startsWith(dateStr));

            salesByDay.push({
                date: dateStr,
                displayDate: date.toLocaleDateString('en-IN', { weekday: 'short', day: 'numeric' }),
                orders: dayOrders.length,
                revenue: dayOrders.reduce((sum, o) => sum + o.total, 0)
            });
        }

        // Calculate totals
        const totalRevenue = salesByDay.reduce((sum, d) => sum + d.revenue, 0);
        const totalOrders = salesByDay.reduce((sum, d) => sum + d.orders, 0);
        const avgDaily = totalRevenue / days;

        res.json({
            success: true,
            data: {
                period,
                salesByDay,
                summary: {
                    totalRevenue: totalRevenue.toFixed(2),
                    totalOrders,
                    avgDailyRevenue: avgDaily.toFixed(2),
                    avgDailyOrders: (totalOrders / days).toFixed(1)
                }
            }
        });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
});

/**
 * GET /api/analytics/sales/by-hour
 * Get sales by hour of day (for peak hours analysis)
 */
router.get('/sales/by-hour', (req, res) => {
    try {
        const completedOrders = orders.filter(o => o.status === ORDER_STATUS.DELIVERED);

        const hourlyData = Array(24).fill(0).map((_, hour) => ({
            hour,
            label: `${hour.toString().padStart(2, '0')}:00`,
            orders: 0,
            revenue: 0
        }));

        completedOrders.forEach(order => {
            const hour = new Date(order.createdAt).getHours();
            hourlyData[hour].orders++;
            hourlyData[hour].revenue += order.total;
        });

        // Find peak hours
        const peakHour = hourlyData.reduce((max, h) => h.orders > max.orders ? h : max);

        res.json({
            success: true,
            data: {
                hourlyData,
                peakHour: peakHour.label,
                peakOrders: peakHour.orders
            }
        });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
});

// ============ MENU ANALYTICS ============

/**
 * GET /api/analytics/menu/popular
 * Get most popular menu items
 */
router.get('/menu/popular', (req, res) => {
    try {
        const { limit = 10 } = req.query;
        const completedOrders = orders.filter(o => o.status === ORDER_STATUS.DELIVERED);

        // Count item popularity
        const itemCounts = {};
        const itemRevenue = {};

        completedOrders.forEach(order => {
            order.items.forEach(item => {
                itemCounts[item.menuItemId] = (itemCounts[item.menuItemId] || 0) + item.quantity;
                itemRevenue[item.menuItemId] = (itemRevenue[item.menuItemId] || 0) + item.subtotal;
            });
        });

        // Convert to array and sort
        const popularItems = Object.entries(itemCounts)
            .map(([id, count]) => {
                const menuItem = menuItems.find(m => m.id === parseInt(id));
                return {
                    id: parseInt(id),
                    name: menuItem?.name || 'Unknown',
                    category: menuItem?.category || 'Unknown',
                    image: menuItem?.image,
                    orderCount: count,
                    revenue: itemRevenue[id],
                    rating: menuItem?.rating || 0
                };
            })
            .sort((a, b) => b.orderCount - a.orderCount)
            .slice(0, parseInt(limit));

        res.json({
            success: true,
            data: popularItems
        });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
});

/**
 * GET /api/analytics/menu/category
 * Get sales by category
 */
router.get('/menu/category', (req, res) => {
    try {
        const completedOrders = orders.filter(o => o.status === ORDER_STATUS.DELIVERED);

        const categoryData = {};

        completedOrders.forEach(order => {
            order.items.forEach(item => {
                const menuItem = menuItems.find(m => m.id === item.menuItemId);
                const category = menuItem?.category || 'Unknown';

                if (!categoryData[category]) {
                    categoryData[category] = { orders: 0, revenue: 0, items: 0 };
                }
                categoryData[category].items += item.quantity;
                categoryData[category].revenue += item.subtotal;
                categoryData[category].orders++;
            });
        });

        const result = Object.entries(categoryData)
            .map(([name, data]) => ({ name, ...data }))
            .sort((a, b) => b.revenue - a.revenue);

        res.json({
            success: true,
            data: result
        });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
});

// ============ CUSTOMER ANALYTICS ============

/**
 * GET /api/analytics/customers
 * Get customer analytics
 */
router.get('/customers', (req, res) => {
    try {
        // Calculate customer metrics
        const customerMetrics = customers.map(c => ({
            id: c.id,
            name: c.name,
            tier: c.tier,
            segment: c.segment,
            totalOrders: c.totalOrders,
            totalSpent: c.totalSpent,
            averageOrderValue: c.averageOrderValue,
            lastOrderDate: c.lastOrderDate,
            loyaltyPoints: c.loyaltyPoints
        }));

        // Segment distribution
        const segmentCounts = customers.reduce((acc, c) => {
            acc[c.segment] = (acc[c.segment] || 0) + 1;
            return acc;
        }, {});

        // Tier distribution
        const tierCounts = customers.reduce((acc, c) => {
            acc[c.tier] = (acc[c.tier] || 0) + 1;
            return acc;
        }, {});

        // Top customers by spend
        const topCustomers = [...customerMetrics]
            .sort((a, b) => b.totalSpent - a.totalSpent)
            .slice(0, 5);

        res.json({
            success: true,
            data: {
                totalCustomers: customers.length,
                segmentDistribution: Object.entries(segmentCounts).map(([name, count]) => ({
                    segment: name,
                    count,
                    label: customerSegments[name]?.label || name,
                    color: customerSegments[name]?.color || '#666'
                })),
                tierDistribution: Object.entries(tierCounts).map(([tier, count]) => ({
                    tier,
                    count
                })),
                topCustomers,
                averageLifetimeValue: (customers.reduce((sum, c) => sum + c.totalSpent, 0) / customers.length).toFixed(2)
            }
        });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
});

/**
 * GET /api/analytics/customers/retention
 * Get customer retention metrics
 */
router.get('/customers/retention', (req, res) => {
    try {
        const now = new Date();

        // Calculate retention metrics
        const activeCustomers = customers.filter(c => {
            const daysSinceOrder = Math.floor((now - new Date(c.lastOrderDate)) / (1000 * 60 * 60 * 24));
            return daysSinceOrder <= 30;
        }).length;

        const atRiskCustomers = customers.filter(c => {
            const daysSinceOrder = Math.floor((now - new Date(c.lastOrderDate)) / (1000 * 60 * 60 * 24));
            return daysSinceOrder > 30 && daysSinceOrder <= 60;
        }).length;

        const churnedCustomers = customers.filter(c => {
            const daysSinceOrder = Math.floor((now - new Date(c.lastOrderDate)) / (1000 * 60 * 60 * 24));
            return daysSinceOrder > 60;
        }).length;

        const repeatRate = (customers.filter(c => c.totalOrders > 1).length / customers.length * 100).toFixed(1);

        res.json({
            success: true,
            data: {
                activeCustomers,
                atRiskCustomers,
                churnedCustomers,
                repeatRate: `${repeatRate}%`,
                customerLifecycle: [
                    { status: 'Active', count: activeCustomers, color: '#4CAF50' },
                    { status: 'At Risk', count: atRiskCustomers, color: '#FF9800' },
                    { status: 'Churned', count: churnedCustomers, color: '#F44336' }
                ]
            }
        });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
});

// ============ REVENUE ANALYTICS ============

/**
 * GET /api/analytics/revenue/breakdown
 * Get revenue breakdown
 */
router.get('/revenue/breakdown', (req, res) => {
    try {
        const completedOrders = orders.filter(o => o.status === ORDER_STATUS.DELIVERED);

        const totalRevenue = completedOrders.reduce((sum, o) => sum + o.total, 0);
        const totalSubtotal = completedOrders.reduce((sum, o) => sum + o.subtotal, 0);
        const totalTax = completedOrders.reduce((sum, o) => sum + o.tax, 0);
        const totalDeliveryFee = completedOrders.reduce((sum, o) => sum + o.deliveryFee, 0);
        const totalDiscount = completedOrders.reduce((sum, o) => sum + o.discount, 0);

        // Payment method breakdown
        const paymentBreakdown = {};
        completedOrders.forEach(order => {
            paymentBreakdown[order.paymentMethod] = (paymentBreakdown[order.paymentMethod] || 0) + order.total;
        });

        res.json({
            success: true,
            data: {
                totalRevenue: totalRevenue.toFixed(2),
                breakdown: {
                    foodSales: totalSubtotal.toFixed(2),
                    taxCollected: totalTax.toFixed(2),
                    deliveryFees: totalDeliveryFee.toFixed(2),
                    discountsGiven: totalDiscount.toFixed(2)
                },
                paymentMethods: Object.entries(paymentBreakdown).map(([method, amount]) => ({
                    method,
                    amount: amount.toFixed(2),
                    percentage: ((amount / totalRevenue) * 100).toFixed(1)
                })),
                profitEstimate: ((totalSubtotal + totalDeliveryFee) * 0.25).toFixed(2) // Rough 25% margin estimate
            }
        });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
});

// ============ FEEDBACK ANALYTICS ============

/**
 * GET /api/analytics/feedback
 * Get feedback and ratings analysis
 */
router.get('/feedback', (req, res) => {
    try {
        const completedOrders = orders.filter(o => o.status === ORDER_STATUS.DELIVERED);
        const ratedOrders = completedOrders.filter(o => o.rating);

        // Rating distribution
        const ratingDistribution = [1, 2, 3, 4, 5].map(rating => ({
            stars: rating,
            count: ratedOrders.filter(o => o.rating === rating).length
        }));

        // Average rating
        const avgRating = ratedOrders.length > 0
            ? ratedOrders.reduce((sum, o) => sum + o.rating, 0) / ratedOrders.length
            : 0;

        // Recent feedback
        const recentFeedback = ratedOrders
            .filter(o => o.feedback)
            .sort((a, b) => new Date(b.deliveredAt) - new Date(a.deliveredAt))
            .slice(0, 5)
            .map(o => ({
                orderId: o.id,
                customerName: o.customerName,
                rating: o.rating,
                feedback: o.feedback,
                date: o.deliveredAt
            }));

        res.json({
            success: true,
            data: {
                totalReviews: ratedOrders.length,
                averageRating: avgRating.toFixed(1),
                ratingDistribution,
                responseRate: ((ratedOrders.length / completedOrders.length) * 100).toFixed(1) + '%',
                recentFeedback
            }
        });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
});

module.exports = router;
