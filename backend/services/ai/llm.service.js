/**
 * SAVORIA RESTAURANT - ENHANCED LLM SERVICE
 * Uses local intent classifier with Gemini fallback when confidence is low
 */

const aiConfig = require('../../config/ai.config');
const { GoogleGenerativeAI } = require("@google/generative-ai");
const { intentClassifier, INTENTS } = require('../../../ai-core/ml/intent-classifier');
const { menuItems } = require('../../../database/seeds/menu-items.seed');

class LLMService {
    constructor() {
        console.log("🤖 Initializing Savoria AI [v3.0 - Hybrid Local/Gemini]");

        this.apiKey = aiConfig.apiKey;
        this.model = aiConfig.model || 'gemini-1.5-flash';
        this.provider = process.env.AI_PROVIDER || 'local';
        this.localEndpoint = aiConfig.localEndpoint || 'http://localhost:11434/api/generate';

        // Initialize Gemini if API key available
        this.genAI = (this.apiKey && this.apiKey !== 'prototype-mock-key')
            ? new GoogleGenerativeAI(this.apiKey)
            : null;

        // Response templates by intent
        this.responseTemplates = this.buildResponseTemplates();

        // System prompt for Gemini
        this.systemPrompt = `
You are Savoria Sommelier, the AI assistant for Savoria - a premium Indian restaurant in Mumbai.

PERSONA:
- Warm, sophisticated, yet approachable
- Expert in Indian cuisine, especially North Indian and Mughlai
- Knowledgeable about food pairings, ingredients, and cooking methods
- Use 1-2 relevant emojis sparingly

CAPABILITIES:
- Help customers browse the menu and find dishes
- Take orders and add items to cart
- Answer questions about ingredients, allergens, spice levels
- Provide personalized recommendations
- Handle complaints with empathy
- Track order status

MENU HIGHLIGHTS:
- Butter Chicken (₹450) - Our signature dish
- Dal Makhani (₹295) - 24-hour slow-cooked
- Mutton Biryani (₹545) - Lucknowi dum style
- Truffle Butter Chicken (₹695) - Chef's special

RESPONSE STYLE:
- Keep responses concise (2-4 lines max)
- Be helpful and action-oriented
- Handle Hinglish naturally (e.g., "kya chahiye")
- Always suggest next steps

CURRENT TIME: ${new Date().toLocaleTimeString('en-IN')}
RESTAURANT: Open 11 AM - 11 PM
`;
    }

    buildResponseTemplates() {
        return {
            [INTENTS.GREETING]: [
                "Welcome to Savoria! ✨ I'm your AI Sommelier. Would you like to explore our menu or get personalized recommendations?",
                "Namaste! 🙏 Welcome to Savoria. How may I assist you today - browse our menu or help with an existing order?",
                "Hello! Great to have you at Savoria. Ready to discover something delicious? 🍽️"
            ],
            [INTENTS.BROWSE_MENU]: [
                "Our menu features 55+ exquisite dishes! 📋 Would you like to see:\n• Starters\n• Main Course\n• Biryani & Rice\n• Desserts\n\nOr should I recommend our bestsellers?",
                "Let me show you what we're serving today! 🍛 We have amazing options in Indian, Mughlai, and Chef's Specials. Any preference - veg or non-veg?"
            ],
            [INTENTS.RECOMMENDATION]: [
                "For an unforgettable experience, I recommend:\n🥇 Butter Chicken (₹450) - Our crown jewel\n🥈 Dal Makhani (₹295) - 24hr slow-cooked\n🥉 Rasmalai (₹195) - Perfect ending\n\nShall I add any to your cart?",
                "Based on popular demand:\n• Chicken Biryani (₹395) - Most ordered! 🔥\n• Paneer Tikka (₹320) - Veg favorite\n• Truffle Butter Chicken (₹695) - Premium pick\n\nWant me to add something?"
            ],
            [INTENTS.ADD_TO_CART]: [
                "Great choice! I've added that to your cart. 🛒 Would you like to add anything else - maybe some naan or a refreshing lassi?",
                "Added to your cart! ✅ Your order is shaping up nicely. Anything else to complete your meal?"
            ],
            [INTENTS.VIEW_CART]: [
                "Here's what's in your cart. Would you like to modify quantities or proceed to checkout?",
                "Your cart is ready! 🛒 Review your items and let me know if you'd like to add or remove anything."
            ],
            [INTENTS.TRACK_ORDER]: [
                "Let me check your order status... 📍 Your order is being prepared with care. Estimated delivery: 35-45 minutes.",
                "Tracking your order now... 🚗 I'll show you the live status. Is there anything else I can help with while you wait?"
            ],
            [INTENTS.PLACE_ORDER]: [
                "Excellent! Ready to place your order. 📝 Please confirm your delivery address and payment method.",
                "Let's finalize your order! 🎉 I'll need your delivery details. Shall we proceed?"
            ],
            [INTENTS.OFFER_QUERY]: [
                "Great timing! 🎁 Current offers:\n• WELCOME20 - 20% off for new customers\n• Free delivery on orders above ₹500\n• BIRYANI10 - 10% off on biryanis\n\nWant me to apply any code?",
                "Here are today's special offers:\n🏷️ Flat ₹100 off on ₹600+\n🚚 Free delivery on ₹500+\n🎪 Weekend special: 15% off Chef's Specials"
            ],
            [INTENTS.DELIVERY_QUERY]: [
                "We deliver across Mumbai! 🚗\n• Delivery time: 35-50 minutes\n• Free delivery on orders above ₹500\n• ₹40 charge for orders below ₹500\n\nWhat's your location?",
                "Great question! We cover most Mumbai areas. Delivery typically takes 35-45 mins. Orders above ₹500 get FREE delivery! 🎉"
            ],
            [INTENTS.PAYMENT_QUERY]: [
                "We accept multiple payment options:\n💳 Credit/Debit Cards\n📱 UPI (GPay, PhonePe, Paytm)\n💵 Cash on Delivery\n\nWhich do you prefer?",
                "Payment is easy! We support UPI, cards, and COD. Your payment is 100% secure with us. 🔒"
            ],
            [INTENTS.COMPLAINT]: [
                "I'm truly sorry to hear this. 😔 Your satisfaction is our priority. Let me connect you with our support team immediately. Can you share your order ID?",
                "I sincerely apologize for the inconvenience. This isn't the experience we want for you. Please share your order details and we'll make this right - including a complimentary credit for your next order. 🙏"
            ],
            [INTENTS.FEEDBACK]: [
                "Thank you so much for the kind words! 🌟 Your feedback means everything to us. Would you like to rate your experience on a scale of 1-5?",
                "We're thrilled you enjoyed your meal! 😊 Your appreciation motivates our team. Hope to serve you again soon!"
            ],
            [INTENTS.CANCEL_ORDER]: [
                "I understand things change. Let me help you cancel your order. Can you provide your order ID? Note: Full refund for cancellations before kitchen prep.",
                "No problem, I can help with cancellation. 📝 Please share your order ID and I'll process this right away."
            ],
            [INTENTS.REPEAT_ORDER]: [
                "Great idea! 🔄 Would you like to repeat your last order? I can pull up your order history.",
                "Reordering is easy! Let me fetch your recent orders so you can quickly reorder your favorites. 📋"
            ],
            [INTENTS.HUMAN_HANDOFF]: [
                "I understand you'd prefer speaking with a person. 👤 Transferring you to our customer support team now. Average wait time: 2 minutes.",
                "No problem at all! 📞 Our support team is available 11 AM - 11 PM at +91 98765 43210. Shall I have them call you back?"
            ],
            [INTENTS.FAQ]: [
                "Happy to help! 📍 Savoria\n• Hours: 11 AM - 11 PM\n• Location: Worli, Mumbai\n• Contact: +91 98765 43210\n\nAnything specific you'd like to know?",
                "Here's our info:\n🕐 Open daily 11 AM - 11 PM\n📍 Multiple locations across Mumbai\n📞 +91 98765 43210\n\nHow can I assist you further?"
            ],
            [INTENTS.UNKNOWN]: [
                "I'd be happy to help! Could you tell me more about what you're looking for? You can:\n• Browse our menu\n• Get recommendations\n• Track an order",
                "Let me help you! 😊 Are you looking to order food, track an existing order, or need assistance with something else?"
            ]
        };
    }

    getRandomTemplate(intent) {
        const templates = this.responseTemplates[intent] || this.responseTemplates[INTENTS.UNKNOWN];
        return templates[Math.floor(Math.random() * templates.length)];
    }

    extractFoodItem(message) {
        const lowerMessage = message.toLowerCase();
        const matchedItem = menuItems.find(item =>
            lowerMessage.includes(item.name.toLowerCase()) ||
            item.tags.some(tag => lowerMessage.includes(tag))
        );
        return matchedItem;
    }

    async generateResponse(message, history = []) {
        console.log(`\n[AI SERVICE] Processing: "${message}"`);

        // Step 1: Use local intent classifier
        const classification = intentClassifier.classify(message);
        console.log(`[INTENT] ${classification.intent} (confidence: ${(classification.confidence * 100).toFixed(1)}%)`);

        // Step 2: Check if we should use Gemini fallback
        if (classification.shouldFallback && this.genAI) {
            console.log(`[AI SERVICE] Low confidence (${(classification.confidence * 100).toFixed(1)}%) - Using Gemini`);
            return await this.callGemini(message, history);
        }

        // Step 3: Generate response based on intent
        let response = this.getRandomTemplate(classification.intent);

        // Enhance response for specific intents
        if (classification.intent === INTENTS.ADD_TO_CART) {
            const item = this.extractFoodItem(message);
            if (item) {
                response = `Excellent choice! 🌟 I've added ${item.name} (₹${item.price}) to your cart. ${item.isBestseller ? "That's one of our bestsellers!" : ""} Would you like:\n• Butter Naan (₹65) to go with it?\n• A refreshing Mango Lassi (₹125)?`;
            }
        }

        if (classification.intent === INTENTS.RECOMMENDATION) {
            // Check for specific preferences
            const wantsSpicy = message.toLowerCase().includes('spicy') || message.toLowerCase().includes('tikkha');
            const wantsVeg = message.toLowerCase().includes('veg');

            if (wantsSpicy) {
                response = "For spice lovers, I recommend:\n🔥 Chicken Chettinad (₹425) - Fiery South Indian\n🔥 Chicken 65 (₹345) - Hyderabadi heat\n🔥 Kadai Paneer (₹335) - Veg with punch\n\nHow hot can you handle it? 😄";
            } else if (wantsVeg) {
                response = "Our vegetarian favorites:\n🥬 Paneer Tikka (₹320) - Chargrilled perfection\n🥬 Dal Makhani (₹295) - 24-hour magic\n🥬 Palak Paneer (₹315) - Iron-rich goodness\n🥬 Vegetable Biryani (₹295) - Aromatic treat\n\nShall I add any?";
            }
        }

        return {
            content: response,
            intent: classification.intent,
            confidence: classification.confidence,
            source: 'local'
        };
    }

    async callGemini(message, history) {
        try {
            const historyContext = history
                .slice(-5) // Last 5 messages for context
                .map(h => `${h.role === 'user' ? 'Customer' : 'Savoria'}: ${h.content}`)
                .join('\n');

            const fullPrompt = `${this.systemPrompt}

Recent Conversation:
${historyContext}

Customer: "${message}"

Savoria Sommelier:`;

            const model = this.genAI.getGenerativeModel({ model: this.model });
            const result = await model.generateContent(fullPrompt);
            const responseText = result.response.text();

            console.log(`[AI SERVICE] Gemini response received`);

            return {
                content: responseText,
                intent: INTENTS.UNKNOWN,
                confidence: 1.0,
                source: 'gemini'
            };
        } catch (error) {
            console.error('[AI SERVICE] Gemini error:', error.message);

            // Fallback to template response
            return {
                content: this.getRandomTemplate(INTENTS.UNKNOWN),
                intent: INTENTS.UNKNOWN,
                confidence: 0,
                source: 'fallback'
            };
        }
    }

    async tryLocalOllama(message, history) {
        try {
            const historyContext = history
                .slice(-3)
                .map(h => `${h.role === 'user' ? 'Customer' : 'Bot'}: ${h.content}`)
                .join('\n');

            const prompt = `${this.systemPrompt}\n\nConversation:\n${historyContext}\n\nCustomer: "${message}"\n\nBot:`;

            const res = await fetch(this.localEndpoint, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    model: "llama3",
                    prompt,
                    stream: false
                })
            });

            if (res.ok) {
                const data = await res.json();
                return {
                    content: data.response || data.text,
                    source: 'ollama'
                };
            }
        } catch (err) {
            console.warn("[AI SERVICE] Ollama not available");
        }
        return null;
    }
}

module.exports = new LLMService();
