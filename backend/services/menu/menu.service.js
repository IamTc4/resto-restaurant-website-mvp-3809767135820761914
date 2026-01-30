const MenuItem = require('../../models/MenuItem.model');
const supabase = require('../../config/supabase.config');

const mockMenu = [
    { id: 1, name: 'Burger', price: 10, category: 'Fast Food' },
    { id: 2, name: 'Pizza', price: 15, category: 'Italian' }
];

exports.getMenu = async () => {
    // 1. Try Supabase
    if (supabase) {
        const { data, error } = await supabase
            .from('menu_items')
            .select('*');
        if (!error) return data;
    }

    // 2. Try MongoDB
    try {
        if (require('mongoose').connection.readyState === 1) {
            return await MenuItem.find();
        }
    } catch (err) {
        console.warn('MongoDB not available');
    }

    // 3. Fallback to Memory
    return mockMenu;
};
