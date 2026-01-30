class RestaurantBot {
    constructor(menu) {
        this.menu = menu;
        this.customerData = this.loadCustomerData();
        this.context = {
            state: 'idle',
            suggestedItem: null
        };
    }

    loadCustomerData() {
        // CRM Simulation: Load or Initialize
        let data = JSON.parse(localStorage.getItem('savoria_crm')) || {
            visits: 0,
            orders: 0,
            name: null,
            preferences: []
        };

        // Track visit on session start
        if (!sessionStorage.getItem('savoria_session')) {
            data.visits++;
            localStorage.setItem('savoria_crm', JSON.stringify(data));
            sessionStorage.setItem('savoria_session', 'active');
        }

        return data;
    }

    getCustomerType() {
        if (this.customerData.orders > 5) return 'Loyal';
        if (this.customerData.visits > 1) return 'Repeat';
        return 'First-time';
    }

    // Main Greeting
    greet() {
        const type = this.getCustomerType();
        const hour = new Date().getHours();
        let timeGreeting = "Good day";
        if (hour < 12) timeGreeting = "Good morning";
        else if (hour < 18) timeGreeting = "Good afternoon";
        else timeGreeting = "Good evening";

        if (type === 'First-time') {
            return `Hi, ${timeGreeting}! Welcome to Savoria. 🍛 I'm your virtual assistant. Since you're new here, can I suggest some of our bestsellers?`;
        } else if (type === 'Repeat') {
            return `${timeGreeting}! Welcome back to Savoria! 😃 Hungry again? Let me know what you're craving today.`;
        } else {
            return `${timeGreeting}, VIP! 🌟 Wonderful to see you. Special craving today, or shall we look at the specials?`;
        }
    }

    // Core Logic
    processMessage(input) {
        const text = input.toLowerCase();

        // 1. Greetings
        if (text.match(/^(hi|hello|hey|yo|namaste)/)) {
            return this.greet();
        }

        // 2. Recommendations based on keywords
        if (text.includes('spicy') || text.includes('hot')) {
            return this.recommendByTag('spicy', "Feeling brave? 🔥 I highly recommend our");
        }

        if (text.includes('veg') && !text.includes('non')) {
            return this.recommendByTag('veg', "Going meat-free? 🥦 You'll love the");
        }

        if (text.includes('sweet') || text.includes('dessert')) {
            return this.recommendByTag('dessert', "Time for a treat? 🍩 How about");
        }

        if (text.includes('starter') || text.includes('snack')) {
            return this.recommendByTag('starter', "Starting light? 🍟 Try the");
        }

        if (text.includes('budget') || text.includes('cheap') || text.includes('price')) {
             return this.recommendByTag('budget', "Looking for value? 💰 Check out the");
        }

        // 3. Specific Item Search
        const foundItem = this.menu.find(item => text.includes(item.name.toLowerCase()));
        if (foundItem) {
            this.context.suggestedItem = foundItem;
            return `Ah, the **${foundItem.name}**! Great choice. 🌟\nIt's ₹${foundItem.price}. ${foundItem.description}\n\nShall I add this to your cart?`;
        }

        // 4. Affirmation (Yes/Add it) handling
        if ((text.includes('yes') || text.includes('add') || text.includes('sure')) && this.context.suggestedItem) {
            const item = this.context.suggestedItem;
            // Trigger global addToCart from main.js if available
            if (typeof addToCart === 'function') {
                addToCart(item.id);
                this.context.suggestedItem = null; // Reset
                return `Done! ✅ Added **${item.name}** to your cart. Anything else?`;
            } else {
                return `I'd love to add it, but I can't reach the cart right now. Please click 'Add' on the menu card!`;
            }
        }

        // 5. Status / Info
        if (text.includes('delivery') || text.includes('time')) {
            return "We usually deliver within 30-45 minutes depending on traffic. 🚀";
        }

        if (text.includes('thank')) {
            return "You're most welcome! 😊 Enjoy your meal planning.";
        }

        // Default Fallback
        return "I'm listening! 👂 You can ask for 'spicy food', 'desserts', or specific items like 'Butter Chicken'.";
    }

    recommendByTag(tag, prefix) {
        const items = this.menu.filter(i => i.tags.includes(tag) || i.category.toLowerCase() === tag);
        if (items.length === 0) return "I couldn't find exactly that, but our menu has great variety!";

        const item = items[Math.floor(Math.random() * items.length)];
        this.context.suggestedItem = item;
        return `${prefix} **${item.name}** (₹${item.price})? It's ${item.tags.includes('bestseller') ? 'a bestseller! 🌟' : 'delicious.'}\nWant to try it?`;
    }
}
