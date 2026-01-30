/**
 * SAVORIA RESTAURANT - LOCAL NLP INTENT CLASSIFIER
 * TensorFlow.js-based intent classification with confidence scoring
 * Falls back to Gemini when confidence is low
 */

// Intent categories
const INTENTS = {
    GREETING: 'greeting',
    BROWSE_MENU: 'browse_menu',
    PLACE_ORDER: 'place_order',
    ADD_TO_CART: 'add_to_cart',
    VIEW_CART: 'view_cart',
    TRACK_ORDER: 'track_order',
    MODIFY_ORDER: 'modify_order',
    CANCEL_ORDER: 'cancel_order',
    COMPLAINT: 'complaint',
    PAYMENT_QUERY: 'payment_query',
    DELIVERY_QUERY: 'delivery_query',
    OFFER_QUERY: 'offer_query',
    RECOMMENDATION: 'recommendation',
    FAQ: 'faq',
    FEEDBACK: 'feedback',
    REPEAT_ORDER: 'repeat_order',
    HUMAN_HANDOFF: 'human_handoff',
    UNKNOWN: 'unknown'
};

// Training data for intent classification
const trainingData = [
    // GREETING
    { text: "hi", intent: INTENTS.GREETING },
    { text: "hello", intent: INTENTS.GREETING },
    { text: "hey", intent: INTENTS.GREETING },
    { text: "good morning", intent: INTENTS.GREETING },
    { text: "good evening", intent: INTENTS.GREETING },
    { text: "namaste", intent: INTENTS.GREETING },
    { text: "howdy", intent: INTENTS.GREETING },
    { text: "hii", intent: INTENTS.GREETING },
    { text: "helo", intent: INTENTS.GREETING },

    // BROWSE_MENU
    { text: "show me the menu", intent: INTENTS.BROWSE_MENU },
    { text: "what do you have", intent: INTENTS.BROWSE_MENU },
    { text: "menu please", intent: INTENTS.BROWSE_MENU },
    { text: "what can i order", intent: INTENTS.BROWSE_MENU },
    { text: "show food items", intent: INTENTS.BROWSE_MENU },
    { text: "menu dikhao", intent: INTENTS.BROWSE_MENU },
    { text: "kya milega", intent: INTENTS.BROWSE_MENU },
    { text: "food options", intent: INTENTS.BROWSE_MENU },
    { text: "what's on the menu", intent: INTENTS.BROWSE_MENU },
    { text: "browse menu", intent: INTENTS.BROWSE_MENU },
    { text: "see dishes", intent: INTENTS.BROWSE_MENU },
    { text: "vegetarian options", intent: INTENTS.BROWSE_MENU },
    { text: "non veg items", intent: INTENTS.BROWSE_MENU },
    { text: "show starters", intent: INTENTS.BROWSE_MENU },
    { text: "dessert menu", intent: INTENTS.BROWSE_MENU },

    // PLACE_ORDER
    { text: "i want to order", intent: INTENTS.PLACE_ORDER },
    { text: "place order", intent: INTENTS.PLACE_ORDER },
    { text: "order food", intent: INTENTS.PLACE_ORDER },
    { text: "ready to order", intent: INTENTS.PLACE_ORDER },
    { text: "order karna hai", intent: INTENTS.PLACE_ORDER },
    { text: "checkout", intent: INTENTS.PLACE_ORDER },
    { text: "confirm order", intent: INTENTS.PLACE_ORDER },
    { text: "place my order", intent: INTENTS.PLACE_ORDER },
    { text: "order now", intent: INTENTS.PLACE_ORDER },

    // ADD_TO_CART
    { text: "add butter chicken", intent: INTENTS.ADD_TO_CART },
    { text: "add to cart", intent: INTENTS.ADD_TO_CART },
    { text: "i'll have the biryani", intent: INTENTS.ADD_TO_CART },
    { text: "give me paneer tikka", intent: INTENTS.ADD_TO_CART },
    { text: "2 naan please", intent: INTENTS.ADD_TO_CART },
    { text: "one dal makhani", intent: INTENTS.ADD_TO_CART },
    { text: "add gulab jamun", intent: INTENTS.ADD_TO_CART },
    { text: "mujhe butter chicken chahiye", intent: INTENTS.ADD_TO_CART },
    { text: "ek biryani de do", intent: INTENTS.ADD_TO_CART },
    { text: "add this to my order", intent: INTENTS.ADD_TO_CART },

    // VIEW_CART
    { text: "show my cart", intent: INTENTS.VIEW_CART },
    { text: "what's in my cart", intent: INTENTS.VIEW_CART },
    { text: "view cart", intent: INTENTS.VIEW_CART },
    { text: "cart dikhao", intent: INTENTS.VIEW_CART },
    { text: "my items", intent: INTENTS.VIEW_CART },
    { text: "order summary", intent: INTENTS.VIEW_CART },

    // TRACK_ORDER
    { text: "track my order", intent: INTENTS.TRACK_ORDER },
    { text: "where is my food", intent: INTENTS.TRACK_ORDER },
    { text: "order status", intent: INTENTS.TRACK_ORDER },
    { text: "mera order kahan hai", intent: INTENTS.TRACK_ORDER },
    { text: "delivery status", intent: INTENTS.TRACK_ORDER },
    { text: "when will my food arrive", intent: INTENTS.TRACK_ORDER },
    { text: "eta for delivery", intent: INTENTS.TRACK_ORDER },
    { text: "order kab aayega", intent: INTENTS.TRACK_ORDER },
    { text: "track order", intent: INTENTS.TRACK_ORDER },
    { text: "is my order ready", intent: INTENTS.TRACK_ORDER },

    // MODIFY_ORDER
    { text: "change my order", intent: INTENTS.MODIFY_ORDER },
    { text: "modify order", intent: INTENTS.MODIFY_ORDER },
    { text: "remove item", intent: INTENTS.MODIFY_ORDER },
    { text: "change quantity", intent: INTENTS.MODIFY_ORDER },
    { text: "update my order", intent: INTENTS.MODIFY_ORDER },
    { text: "order mein change karna hai", intent: INTENTS.MODIFY_ORDER },

    // CANCEL_ORDER
    { text: "cancel my order", intent: INTENTS.CANCEL_ORDER },
    { text: "i want to cancel", intent: INTENTS.CANCEL_ORDER },
    { text: "cancel order", intent: INTENTS.CANCEL_ORDER },
    { text: "order cancel karo", intent: INTENTS.CANCEL_ORDER },
    { text: "don't want the order", intent: INTENTS.CANCEL_ORDER },

    // COMPLAINT
    { text: "food was cold", intent: INTENTS.COMPLAINT },
    { text: "wrong order delivered", intent: INTENTS.COMPLAINT },
    { text: "food quality is bad", intent: INTENTS.COMPLAINT },
    { text: "i have a complaint", intent: INTENTS.COMPLAINT },
    { text: "very disappointed", intent: INTENTS.COMPLAINT },
    { text: "terrible service", intent: INTENTS.COMPLAINT },
    { text: "missing items", intent: INTENTS.COMPLAINT },
    { text: "food was stale", intent: INTENTS.COMPLAINT },
    { text: "not happy with order", intent: INTENTS.COMPLAINT },
    { text: "shikayat hai", intent: INTENTS.COMPLAINT },

    // PAYMENT_QUERY
    { text: "payment options", intent: INTENTS.PAYMENT_QUERY },
    { text: "how to pay", intent: INTENTS.PAYMENT_QUERY },
    { text: "do you accept upi", intent: INTENTS.PAYMENT_QUERY },
    { text: "can i pay by card", intent: INTENTS.PAYMENT_QUERY },
    { text: "cash on delivery", intent: INTENTS.PAYMENT_QUERY },
    { text: "payment kaise karu", intent: INTENTS.PAYMENT_QUERY },
    { text: "refund status", intent: INTENTS.PAYMENT_QUERY },
    { text: "money not refunded", intent: INTENTS.PAYMENT_QUERY },

    // DELIVERY_QUERY
    { text: "delivery time", intent: INTENTS.DELIVERY_QUERY },
    { text: "how long for delivery", intent: INTENTS.DELIVERY_QUERY },
    { text: "do you deliver to my area", intent: INTENTS.DELIVERY_QUERY },
    { text: "delivery charges", intent: INTENTS.DELIVERY_QUERY },
    { text: "minimum order for free delivery", intent: INTENTS.DELIVERY_QUERY },
    { text: "kitna time lagega", intent: INTENTS.DELIVERY_QUERY },
    { text: "delivery areas", intent: INTENTS.DELIVERY_QUERY },
    { text: "free delivery", intent: INTENTS.DELIVERY_QUERY },

    // OFFER_QUERY
    { text: "any offers", intent: INTENTS.OFFER_QUERY },
    { text: "discounts available", intent: INTENTS.OFFER_QUERY },
    { text: "coupon code", intent: INTENTS.OFFER_QUERY },
    { text: "koi offer hai", intent: INTENTS.OFFER_QUERY },
    { text: "promo code", intent: INTENTS.OFFER_QUERY },
    { text: "discount de do", intent: INTENTS.OFFER_QUERY },
    { text: "today's offers", intent: INTENTS.OFFER_QUERY },

    // RECOMMENDATION
    { text: "what do you recommend", intent: INTENTS.RECOMMENDATION },
    { text: "suggest something", intent: INTENTS.RECOMMENDATION },
    { text: "best dishes", intent: INTENTS.RECOMMENDATION },
    { text: "popular items", intent: INTENTS.RECOMMENDATION },
    { text: "kuch spicy chahiye", intent: INTENTS.RECOMMENDATION },
    { text: "something light", intent: INTENTS.RECOMMENDATION },
    { text: "chef's special", intent: INTENTS.RECOMMENDATION },
    { text: "what should i try", intent: INTENTS.RECOMMENDATION },
    { text: "accha kya hai", intent: INTENTS.RECOMMENDATION },
    { text: "kuch healthy suggest karo", intent: INTENTS.RECOMMENDATION },

    // FAQ
    { text: "opening hours", intent: INTENTS.FAQ },
    { text: "restaurant timing", intent: INTENTS.FAQ },
    { text: "are you open", intent: INTENTS.FAQ },
    { text: "contact number", intent: INTENTS.FAQ },
    { text: "restaurant location", intent: INTENTS.FAQ },
    { text: "address kya hai", intent: INTENTS.FAQ },
    { text: "kab tak khule ho", intent: INTENTS.FAQ },

    // FEEDBACK
    { text: "food was great", intent: INTENTS.FEEDBACK },
    { text: "loved the biryani", intent: INTENTS.FEEDBACK },
    { text: "excellent service", intent: INTENTS.FEEDBACK },
    { text: "rate my experience", intent: INTENTS.FEEDBACK },
    { text: "give feedback", intent: INTENTS.FEEDBACK },
    { text: "bahut accha khana tha", intent: INTENTS.FEEDBACK },
    { text: "thank you for the food", intent: INTENTS.FEEDBACK },

    // REPEAT_ORDER
    { text: "repeat my last order", intent: INTENTS.REPEAT_ORDER },
    { text: "same as last time", intent: INTENTS.REPEAT_ORDER },
    { text: "reorder", intent: INTENTS.REPEAT_ORDER },
    { text: "order again", intent: INTENTS.REPEAT_ORDER },
    { text: "pichla order repeat karo", intent: INTENTS.REPEAT_ORDER },

    // HUMAN_HANDOFF
    { text: "talk to a person", intent: INTENTS.HUMAN_HANDOFF },
    { text: "connect me to support", intent: INTENTS.HUMAN_HANDOFF },
    { text: "human agent please", intent: INTENTS.HUMAN_HANDOFF },
    { text: "customer care", intent: INTENTS.HUMAN_HANDOFF },
    { text: "speak to manager", intent: INTENTS.HUMAN_HANDOFF },
    { text: "real person se baat karao", intent: INTENTS.HUMAN_HANDOFF }
];

/**
 * Simple keyword-based intent classifier with confidence scoring
 * In production, this would use TensorFlow.js with a trained neural network
 */
class IntentClassifier {
    constructor() {
        this.confidenceThreshold = 0.6; // Below this, fall back to Gemini
        this.buildKeywordIndex();
    }

    buildKeywordIndex() {
        this.keywordIndex = {};

        trainingData.forEach(example => {
            const words = this.tokenize(example.text);
            words.forEach(word => {
                if (!this.keywordIndex[word]) {
                    this.keywordIndex[word] = {};
                }
                this.keywordIndex[word][example.intent] =
                    (this.keywordIndex[word][example.intent] || 0) + 1;
            });
        });
    }

    tokenize(text) {
        return text
            .toLowerCase()
            .replace(/[^a-z0-9\s]/gi, '')
            .split(/\s+/)
            .filter(word => word.length > 1);
    }

    /**
     * Classify intent with confidence score
     * @param {string} text - User input
     * @returns {Object} { intent, confidence, shouldFallback }
     */
    classify(text) {
        const words = this.tokenize(text);
        const intentScores = {};
        let totalMatches = 0;

        words.forEach(word => {
            if (this.keywordIndex[word]) {
                Object.entries(this.keywordIndex[word]).forEach(([intent, count]) => {
                    intentScores[intent] = (intentScores[intent] || 0) + count;
                    totalMatches += count;
                });
            }
        });

        // Handle no matches
        if (totalMatches === 0) {
            return {
                intent: INTENTS.UNKNOWN,
                confidence: 0,
                shouldFallback: true,
                allScores: {}
            };
        }

        // Find best intent
        let bestIntent = INTENTS.UNKNOWN;
        let bestScore = 0;

        Object.entries(intentScores).forEach(([intent, score]) => {
            if (score > bestScore) {
                bestScore = score;
                bestIntent = intent;
            }
        });

        // Calculate confidence (normalized score)
        const confidence = Math.min(bestScore / (words.length * 2), 1);

        // Check for exact matches (higher confidence)
        const exactMatch = trainingData.find(
            ex => this.tokenize(ex.text).join(' ') === words.join(' ')
        );
        if (exactMatch) {
            return {
                intent: exactMatch.intent,
                confidence: 0.95,
                shouldFallback: false,
                allScores: intentScores
            };
        }

        return {
            intent: bestIntent,
            confidence,
            shouldFallback: confidence < this.confidenceThreshold,
            allScores: intentScores
        };
    }

    /**
     * Get all possible intents
     */
    getIntents() {
        return INTENTS;
    }

    /**
     * Add new training example
     */
    addTrainingExample(text, intent) {
        trainingData.push({ text, intent });
        this.buildKeywordIndex(); // Rebuild index
    }
}

// Singleton instance
const intentClassifier = new IntentClassifier();

module.exports = {
    IntentClassifier,
    intentClassifier,
    INTENTS,
    trainingData
};
