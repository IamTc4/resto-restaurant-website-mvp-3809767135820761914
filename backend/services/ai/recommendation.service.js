/**
 * SAVORIA RESTAURANT - SMART RECOMMENDATION SERVICE
 * Collaborative filtering and personalized recommendations
 */

const { menuItems, categories } = require('../../../database/seeds/menu-items.seed');
const { customers } = require('../../../database/seeds/customers.seed');
const { orders } = require('../../../database/seeds/orders.seed');

class RecommendationService {
    constructor() {
        this.menuItems = menuItems;
        this.customers = customers;
        this.orders = orders;
    }

    /**
     * Get personalized recommendations for a customer
     * Uses collaborative filtering based on similar customers' preferences
     */
    getPersonalizedRecommendations(customerId, limit = 6) {
        const customer = this.customers.find(c => c.id === customerId);

        if (!customer) {
            // Return popular items for anonymous users
            return this.getPopularItems(limit);
        }

        const recommendations = [];
        const orderedItemIds = new Set(customer.favoriteItems || []);

        // Find similar customers based on preferences
        const similarCustomers = this.findSimilarCustomers(customer);

        // Get items that similar customers ordered but this customer hasn't
        similarCustomers.forEach(simCustomer => {
            (simCustomer.favoriteItems || []).forEach(itemId => {
                if (!orderedItemIds.has(itemId)) {
                    const item = this.menuItems.find(m => m.id === itemId);
                    if (item && item.isAvailable && !recommendations.find(r => r.id === itemId)) {
                        recommendations.push({
                            ...item,
                            reason: `Popular with customers like you`
                        });
                    }
                }
            });
        });

        // Fill remaining slots with category-based recommendations
        if (recommendations.length < limit) {
            const preferredCategories = customer.preferences?.favoriteCategories || [];

            preferredCategories.forEach(category => {
                const categoryItems = this.menuItems.filter(item =>
                    item.category === category &&
                    item.isAvailable &&
                    !orderedItemIds.has(item.id) &&
                    !recommendations.find(r => r.id === item.id)
                );

                categoryItems.slice(0, 2).forEach(item => {
                    if (recommendations.length < limit) {
                        recommendations.push({
                            ...item,
                            reason: `Based on your love for ${category}`
                        });
                    }
                });
            });
        }

        // Fill remaining with bestsellers
        if (recommendations.length < limit) {
            const bestsellers = this.menuItems
                .filter(item =>
                    item.isBestseller &&
                    item.isAvailable &&
                    !orderedItemIds.has(item.id) &&
                    !recommendations.find(r => r.id === item.id)
                )
                .slice(0, limit - recommendations.length);

            bestsellers.forEach(item => {
                recommendations.push({
                    ...item,
                    reason: 'Bestseller'
                });
            });
        }

        return recommendations.slice(0, limit);
    }

    /**
     * Find customers with similar preferences
     */
    findSimilarCustomers(targetCustomer) {
        return this.customers
            .filter(c => c.id !== targetCustomer.id)
            .map(customer => {
                let similarity = 0;

                // Same dietary preference
                if (customer.preferences?.isVeg === targetCustomer.preferences?.isVeg) {
                    similarity += 3;
                }

                // Similar spice preference
                const spiceDiff = Math.abs(
                    (customer.preferences?.spiceLevel || 1) - (targetCustomer.preferences?.spiceLevel || 1)
                );
                similarity += (3 - spiceDiff);

                // Shared favorite categories
                const sharedCategories = (customer.preferences?.favoriteCategories || [])
                    .filter(cat => (targetCustomer.preferences?.favoriteCategories || []).includes(cat));
                similarity += sharedCategories.length * 2;

                // Similar tier (spending pattern)
                if (customer.tier === targetCustomer.tier) {
                    similarity += 2;
                }

                return { ...customer, similarity };
            })
            .sort((a, b) => b.similarity - a.similarity)
            .slice(0, 5);
    }

    /**
     * Get "Customers also ordered" recommendations
     */
    getAlsoOrderedWith(menuItemId, limit = 4) {
        const itemId = parseInt(menuItemId);
        const coOccurrence = {};

        // Find orders containing this item
        this.orders.forEach(order => {
            const hasItem = order.items.some(item => item.menuItemId === itemId);

            if (hasItem) {
                order.items.forEach(item => {
                    if (item.menuItemId !== itemId) {
                        coOccurrence[item.menuItemId] = (coOccurrence[item.menuItemId] || 0) + 1;
                    }
                });
            }
        });

        // Sort by frequency and get menu items
        return Object.entries(coOccurrence)
            .sort((a, b) => b[1] - a[1])
            .slice(0, limit)
            .map(([id, count]) => {
                const item = this.menuItems.find(m => m.id === parseInt(id));
                return item ? { ...item, coOrderCount: count } : null;
            })
            .filter(Boolean);
    }

    /**
     * Get popular items globally
     */
    getPopularItems(limit = 8) {
        return this.menuItems
            .filter(item => item.isAvailable)
            .sort((a, b) => b.ratingCount - a.ratingCount)
            .slice(0, limit);
    }

    /**
     * Get trending items (based on recent orders)
     */
    getTrendingItems(limit = 6) {
        const recentOrders = this.orders
            .filter(o => {
                const orderDate = new Date(o.createdAt);
                const weekAgo = new Date();
                weekAgo.setDate(weekAgo.getDate() - 7);
                return orderDate >= weekAgo;
            });

        const itemCounts = {};
        recentOrders.forEach(order => {
            order.items.forEach(item => {
                itemCounts[item.menuItemId] = (itemCounts[item.menuItemId] || 0) + item.quantity;
            });
        });

        return Object.entries(itemCounts)
            .sort((a, b) => b[1] - a[1])
            .slice(0, limit)
            .map(([id, count]) => {
                const item = this.menuItems.find(m => m.id === parseInt(id));
                return item ? { ...item, ordersThisWeek: count } : null;
            })
            .filter(Boolean);
    }

    /**
     * Get recommendations based on dietary restrictions
     */
    getDietaryRecommendations(restrictions, limit = 8) {
        let filtered = this.menuItems.filter(item => item.isAvailable);

        if (restrictions.includes('vegetarian') || restrictions.includes('veg')) {
            filtered = filtered.filter(item => item.isVeg);
        }

        if (restrictions.includes('vegan')) {
            filtered = filtered.filter(item =>
                item.isVeg && !item.allergens?.includes('dairy')
            );
        }

        if (restrictions.includes('gluten-free')) {
            filtered = filtered.filter(item =>
                !item.allergens?.includes('gluten')
            );
        }

        if (restrictions.includes('jain')) {
            // Jain food - no onion, garlic, root vegetables
            filtered = filtered.filter(item =>
                item.isVeg && !item.tags?.includes('onion') && !item.tags?.includes('garlic')
            );
        }

        return filtered
            .sort((a, b) => b.rating - a.rating)
            .slice(0, limit);
    }

    /**
     * Get recommendations by mood/occasion
     */
    getMoodBasedRecommendations(mood, limit = 6) {
        let filtered = this.menuItems.filter(item => item.isAvailable);

        switch (mood.toLowerCase()) {
            case 'spicy':
                filtered = filtered.filter(item => item.spiceLevel >= 2);
                break;
            case 'mild':
            case 'light':
                filtered = filtered.filter(item => item.spiceLevel <= 1 && item.calories < 400);
                break;
            case 'comfort':
                filtered = filtered.filter(item =>
                    ['Main Course', 'Rice & Biryani'].includes(item.category)
                );
                break;
            case 'sweet':
            case 'dessert':
                filtered = filtered.filter(item => item.category === 'Desserts');
                break;
            case 'healthy':
                filtered = filtered.filter(item => item.calories < 350);
                break;
            case 'premium':
            case 'special':
                filtered = filtered.filter(item => item.category === "Chef's Specials");
                break;
            case 'quick':
                filtered = filtered.filter(item => item.prepTime <= 15);
                break;
        }

        return filtered
            .sort((a, b) => b.rating - a.rating)
            .slice(0, limit);
    }

    /**
     * Get complete meal suggestion
     */
    getSuggestedMeal(preferences = {}) {
        const meal = {
            starter: null,
            main: null,
            bread: null,
            dessert: null,
            beverage: null,
            totalPrice: 0
        };

        const isVeg = preferences.isVeg !== false;
        const budget = preferences.budget || 1000;

        // Get starter
        const starters = this.menuItems.filter(item =>
            item.category === 'Starters' &&
            item.isAvailable &&
            item.isVeg === isVeg
        );
        meal.starter = starters.sort((a, b) => b.rating - a.rating)[0];

        // Get main course
        const mains = this.menuItems.filter(item =>
            item.category === 'Main Course' &&
            item.isAvailable &&
            item.isVeg === isVeg
        );
        meal.main = mains.sort((a, b) => b.rating - a.rating)[0];

        // Get bread
        const breads = this.menuItems.filter(item =>
            item.category === 'Breads' && item.isAvailable
        );
        meal.bread = breads.sort((a, b) => b.rating - a.rating)[0];

        // Get dessert
        const desserts = this.menuItems.filter(item =>
            item.category === 'Desserts' && item.isAvailable
        );
        meal.dessert = desserts.sort((a, b) => b.rating - a.rating)[0];

        // Get beverage
        const beverages = this.menuItems.filter(item =>
            item.category === 'Beverages' && item.isAvailable
        );
        meal.beverage = beverages.sort((a, b) => b.rating - a.rating)[0];

        // Calculate total
        meal.totalPrice = [meal.starter, meal.main, meal.bread, meal.dessert, meal.beverage]
            .filter(Boolean)
            .reduce((sum, item) => sum + item.price, 0);

        return meal;
    }
}

module.exports = new RecommendationService();
