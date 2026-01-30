/**
 * SAVORIA RESTAURANT - MENU API ROUTES
 * Full CRUD operations for menu items with filtering and search
 */

const express = require('express');
const router = express.Router();
const { menuItems, categories } = require('../../../database/seeds/menu-items.seed');

// In-memory data store (in production, use MongoDB/PostgreSQL)
let menuData = [...menuItems];
let categoryData = [...categories];

// ============ GET ROUTES ============

/**
 * GET /api/menu
 * Get all menu items with optional filtering
 * Query params: category, isVeg, spiceLevel, minPrice, maxPrice, search, sort
 */
router.get('/', (req, res) => {
    try {
        let result = [...menuData];
        const { category, isVeg, spiceLevel, minPrice, maxPrice, search, sort, available, bestseller } = req.query;

        // Filter by category
        if (category && category !== 'All') {
            result = result.filter(item => item.category === category);
        }

        // Filter by vegetarian
        if (isVeg !== undefined) {
            result = result.filter(item => item.isVeg === (isVeg === 'true'));
        }

        // Filter by spice level
        if (spiceLevel !== undefined) {
            result = result.filter(item => item.spiceLevel <= parseInt(spiceLevel));
        }

        // Filter by price range
        if (minPrice) {
            result = result.filter(item => item.price >= parseInt(minPrice));
        }
        if (maxPrice) {
            result = result.filter(item => item.price <= parseInt(maxPrice));
        }

        // Filter by availability
        if (available !== undefined) {
            result = result.filter(item => item.isAvailable === (available === 'true'));
        }

        // Filter bestsellers only
        if (bestseller === 'true') {
            result = result.filter(item => item.isBestseller);
        }

        // Search by name or description
        if (search) {
            const searchLower = search.toLowerCase();
            result = result.filter(item =>
                item.name.toLowerCase().includes(searchLower) ||
                item.description.toLowerCase().includes(searchLower) ||
                item.tags.some(tag => tag.toLowerCase().includes(searchLower))
            );
        }

        // Sorting
        if (sort) {
            switch (sort) {
                case 'price_asc':
                    result.sort((a, b) => a.price - b.price);
                    break;
                case 'price_desc':
                    result.sort((a, b) => b.price - a.price);
                    break;
                case 'rating':
                    result.sort((a, b) => b.rating - a.rating);
                    break;
                case 'popular':
                    result.sort((a, b) => b.ratingCount - a.ratingCount);
                    break;
                case 'name':
                    result.sort((a, b) => a.name.localeCompare(b.name));
                    break;
            }
        }

        res.json({
            success: true,
            count: result.length,
            data: result
        });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
});

/**
 * GET /api/menu/categories
 * Get all menu categories with item counts
 */
router.get('/categories', (req, res) => {
    try {
        // Calculate actual item counts
        const categoriesWithCounts = categoryData.map(cat => ({
            ...cat,
            itemCount: menuData.filter(item => item.category === cat.name).length
        }));

        res.json({
            success: true,
            data: categoriesWithCounts
        });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
});

/**
 * GET /api/menu/bestsellers
 * Get top bestselling items
 */
router.get('/bestsellers', (req, res) => {
    try {
        const limit = parseInt(req.query.limit) || 8;
        const bestsellers = menuData
            .filter(item => item.isBestseller && item.isAvailable)
            .sort((a, b) => b.ratingCount - a.ratingCount)
            .slice(0, limit);

        res.json({
            success: true,
            count: bestsellers.length,
            data: bestsellers
        });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
});

/**
 * GET /api/menu/recommendations
 * Get personalized recommendations (uses simple logic for now, ML later)
 */
router.get('/recommendations', (req, res) => {
    try {
        const { itemId, customerId } = req.query;
        let recommendations = [];

        if (itemId) {
            // Find similar items based on category and tags
            const item = menuData.find(i => i.id === parseInt(itemId));
            if (item) {
                recommendations = menuData
                    .filter(i =>
                        i.id !== item.id &&
                        i.isAvailable &&
                        (i.category === item.category ||
                            i.tags.some(tag => item.tags.includes(tag)))
                    )
                    .sort((a, b) => b.rating - a.rating)
                    .slice(0, 4);
            }
        } else {
            // Default: return highly rated available items
            recommendations = menuData
                .filter(item => item.isAvailable && item.rating >= 4.5)
                .sort((a, b) => b.ratingCount - a.ratingCount)
                .slice(0, 6);
        }

        res.json({
            success: true,
            data: recommendations
        });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
});

/**
 * GET /api/menu/:id
 * Get single menu item by ID
 */
router.get('/:id', (req, res) => {
    try {
        const item = menuData.find(i => i.id === parseInt(req.params.id));

        if (!item) {
            return res.status(404).json({
                success: false,
                error: 'Menu item not found'
            });
        }

        // Get related items
        const relatedItems = menuData
            .filter(i => i.id !== item.id && i.category === item.category && i.isAvailable)
            .slice(0, 4);

        res.json({
            success: true,
            data: { ...item, relatedItems }
        });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
});

// ============ POST ROUTES ============

/**
 * POST /api/menu
 * Add new menu item (Admin only)
 */
router.post('/', (req, res) => {
    try {
        const newItem = {
            id: menuData.length + 1,
            ...req.body,
            rating: 0,
            ratingCount: 0,
            isAvailable: true,
            isBestseller: false,
            createdAt: new Date().toISOString()
        };

        // Validate required fields
        const requiredFields = ['name', 'category', 'price', 'description'];
        for (const field of requiredFields) {
            if (!newItem[field]) {
                return res.status(400).json({
                    success: false,
                    error: `Missing required field: ${field}`
                });
            }
        }

        menuData.push(newItem);

        res.status(201).json({
            success: true,
            message: 'Menu item created successfully',
            data: newItem
        });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
});

// ============ PUT/PATCH ROUTES ============

/**
 * PUT /api/menu/:id
 * Update menu item (Admin only)
 */
router.put('/:id', (req, res) => {
    try {
        const index = menuData.findIndex(i => i.id === parseInt(req.params.id));

        if (index === -1) {
            return res.status(404).json({
                success: false,
                error: 'Menu item not found'
            });
        }

        menuData[index] = {
            ...menuData[index],
            ...req.body,
            id: menuData[index].id, // Prevent ID modification
            updatedAt: new Date().toISOString()
        };

        res.json({
            success: true,
            message: 'Menu item updated successfully',
            data: menuData[index]
        });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
});

/**
 * PATCH /api/menu/:id/availability
 * Toggle availability (Admin only)
 */
router.patch('/:id/availability', (req, res) => {
    try {
        const item = menuData.find(i => i.id === parseInt(req.params.id));

        if (!item) {
            return res.status(404).json({
                success: false,
                error: 'Menu item not found'
            });
        }

        item.isAvailable = !item.isAvailable;

        res.json({
            success: true,
            message: `Item is now ${item.isAvailable ? 'available' : 'unavailable'}`,
            data: item
        });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
});

// ============ DELETE ROUTES ============

/**
 * DELETE /api/menu/:id
 * Delete menu item (Admin only)
 */
router.delete('/:id', (req, res) => {
    try {
        const index = menuData.findIndex(i => i.id === parseInt(req.params.id));

        if (index === -1) {
            return res.status(404).json({
                success: false,
                error: 'Menu item not found'
            });
        }

        const deletedItem = menuData.splice(index, 1)[0];

        res.json({
            success: true,
            message: 'Menu item deleted successfully',
            data: deletedItem
        });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
});

module.exports = router;
