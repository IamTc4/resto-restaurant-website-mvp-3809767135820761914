/**
 * SAVORIA RESTAURANT - ORDERS DATABASE
 * Sample order data for testing analytics, tracking, and ML training
 */

const { menuItems } = require('./menu-items.seed');

// Generate order ID
const generateOrderId = (index) => `ORD-${Date.now().toString(36).toUpperCase()}-${String(index).padStart(4, '0')}`;

// Order statuses
const ORDER_STATUS = {
    PENDING: 'pending',
    CONFIRMED: 'confirmed',
    PREPARING: 'preparing',
    READY: 'ready',
    OUT_FOR_DELIVERY: 'out_for_delivery',
    DELIVERED: 'delivered',
    CANCELLED: 'cancelled'
};

const PAYMENT_STATUS = {
    PENDING: 'pending',
    PAID: 'paid',
    FAILED: 'failed',
    REFUNDED: 'refunded'
};

const PAYMENT_METHODS = ['card', 'upi', 'cod', 'wallet'];

// Sample orders spanning last 30 days
const orders = [
    {
        id: "ORD-2026012901",
        customerId: "cust_001",
        customerName: "Rahul Sharma",
        customerPhone: "+91 98765 43210",
        items: [
            { menuItemId: 11, name: "Butter Chicken", quantity: 2, price: 450, subtotal: 900 },
            { menuItemId: 23, name: "Butter Naan", quantity: 4, price: 65, subtotal: 260 },
            { menuItemId: 31, name: "Jeera Rice", quantity: 1, price: 165, subtotal: 165 }
        ],
        subtotal: 1325,
        tax: 66.25,
        deliveryFee: 40,
        discount: 0,
        couponCode: null,
        total: 1431.25,
        status: ORDER_STATUS.DELIVERED,
        paymentStatus: PAYMENT_STATUS.PAID,
        paymentMethod: "upi",
        address: {
            line1: "42, Marina Heights",
            line2: "Worli Sea Face",
            city: "Mumbai",
            pincode: "400018"
        },
        notes: "Extra spicy please",
        rating: 5,
        feedback: "Excellent butter chicken! Best in Mumbai.",
        createdAt: "2026-01-29T12:30:00Z",
        confirmedAt: "2026-01-29T12:32:00Z",
        preparedAt: "2026-01-29T12:50:00Z",
        deliveredAt: "2026-01-29T13:15:00Z",
        deliveryPartnerId: "DP-001",
        estimatedDeliveryTime: 45
    },
    {
        id: "ORD-2026012902",
        customerId: "cust_003",
        customerName: "Amit Kumar",
        customerPhone: "+91 76543 21098",
        items: [
            { menuItemId: 51, name: "Truffle Butter Chicken", quantity: 1, price: 695, subtotal: 695 },
            { menuItemId: 54, name: "Wagyu Seekh Kebab", quantity: 1, price: 895, subtotal: 895 },
            { menuItemId: 24, name: "Garlic Naan", quantity: 3, price: 85, subtotal: 255 },
            { menuItemId: 47, name: "Cold Coffee", quantity: 2, price: 145, subtotal: 290 }
        ],
        subtotal: 2135,
        tax: 106.75,
        deliveryFee: 0,
        discount: 213.5,
        couponCode: "VIP10",
        total: 2028.25,
        status: ORDER_STATUS.PREPARING,
        paymentStatus: PAYMENT_STATUS.PAID,
        paymentMethod: "card",
        address: {
            line1: "B-204, Corporate Park",
            line2: "Powai",
            city: "Mumbai",
            pincode: "400076"
        },
        notes: "Call before delivery",
        rating: null,
        feedback: null,
        createdAt: "2026-01-29T19:45:00Z",
        confirmedAt: "2026-01-29T19:47:00Z",
        preparedAt: null,
        deliveredAt: null,
        deliveryPartnerId: null,
        estimatedDeliveryTime: 50
    },
    {
        id: "ORD-2026012801",
        customerId: "cust_002",
        customerName: "Priya Patel",
        customerPhone: "+91 87654 32109",
        items: [
            { menuItemId: 3, name: "Paneer Tikka", quantity: 1, price: 320, subtotal: 320 },
            { menuItemId: 12, name: "Dal Makhani", quantity: 1, price: 295, subtotal: 295 },
            { menuItemId: 36, name: "Rasmalai", quantity: 2, price: 195, subtotal: 390 },
            { menuItemId: 44, name: "Mango Lassi", quantity: 2, price: 125, subtotal: 250 }
        ],
        subtotal: 1255,
        tax: 62.75,
        deliveryFee: 40,
        discount: 0,
        couponCode: null,
        total: 1357.75,
        status: ORDER_STATUS.DELIVERED,
        paymentStatus: PAYMENT_STATUS.PAID,
        paymentMethod: "upi",
        address: {
            line1: "15, Shanti Niketan",
            line2: "Bandra West",
            city: "Mumbai",
            pincode: "400050"
        },
        notes: "Less oil in dal",
        rating: 4,
        feedback: "Good food, slightly delayed delivery",
        createdAt: "2026-01-28T13:00:00Z",
        confirmedAt: "2026-01-28T13:02:00Z",
        preparedAt: "2026-01-28T13:25:00Z",
        deliveredAt: "2026-01-28T13:55:00Z",
        deliveryPartnerId: "DP-003",
        estimatedDeliveryTime: 45
    },
    {
        id: "ORD-2026012802",
        customerId: "cust_005",
        customerName: "Vikram Singh",
        customerPhone: "+91 54321 09876",
        items: [
            { menuItemId: 19, name: "Mutton Biryani", quantity: 2, price: 545, subtotal: 1090 },
            { menuItemId: 5, name: "Seekh Kebab", quantity: 1, price: 425, subtotal: 425 },
            { menuItemId: 46, name: "Rose Sharbat", quantity: 2, price: 95, subtotal: 190 }
        ],
        subtotal: 1705,
        tax: 85.25,
        deliveryFee: 40,
        discount: 170.5,
        couponCode: "BIRYANI10",
        total: 1659.75,
        status: ORDER_STATUS.DELIVERED,
        paymentStatus: PAYMENT_STATUS.PAID,
        paymentMethod: "card",
        address: {
            line1: "78, Royal Residency",
            line2: "Juhu",
            city: "Mumbai",
            pincode: "400049"
        },
        notes: "",
        rating: 5,
        feedback: "Best biryani in town! Will order again.",
        createdAt: "2026-01-28T19:30:00Z",
        confirmedAt: "2026-01-28T19:33:00Z",
        preparedAt: "2026-01-28T20:05:00Z",
        deliveredAt: "2026-01-28T20:35:00Z",
        deliveryPartnerId: "DP-002",
        estimatedDeliveryTime: 55
    },
    {
        id: "ORD-2026012701",
        customerId: "cust_006",
        customerName: "Meera Nair",
        customerPhone: "+91 43210 98765",
        items: [
            { menuItemId: 52, name: "Lobster Thermidor", quantity: 1, price: 1495, subtotal: 1495 },
            { menuItemId: 7, name: "Prawn Koliwada", quantity: 1, price: 545, subtotal: 545 },
            { menuItemId: 33, name: "Kashmiri Pulao", quantity: 1, price: 245, subtotal: 245 }
        ],
        subtotal: 2285,
        tax: 114.25,
        deliveryFee: 0,
        discount: 342.75,
        couponCode: "SEAFOOD15",
        total: 2056.50,
        status: ORDER_STATUS.DELIVERED,
        paymentStatus: PAYMENT_STATUS.PAID,
        paymentMethod: "card",
        address: {
            line1: "23, Sagar Apartments",
            line2: "Colaba",
            city: "Mumbai",
            pincode: "400005"
        },
        notes: "Gluten-free options please",
        rating: 5,
        feedback: "Lobster was absolutely divine! Worth every rupee.",
        createdAt: "2026-01-27T20:00:00Z",
        confirmedAt: "2026-01-27T20:03:00Z",
        preparedAt: "2026-01-27T20:45:00Z",
        deliveredAt: "2026-01-27T21:15:00Z",
        deliveryPartnerId: "DP-001",
        estimatedDeliveryTime: 60
    },
    {
        id: "ORD-2026012702",
        customerId: "cust_009",
        customerName: "Danish Sheikh",
        customerPhone: "+91 10987 65432",
        items: [
            { menuItemId: 13, name: "Lamb Rogan Josh", quantity: 1, price: 595, subtotal: 595 },
            { menuItemId: 29, name: "Hyderabadi Chicken Biryani", quantity: 1, price: 395, subtotal: 395 },
            { menuItemId: 26, name: "Laccha Paratha", quantity: 3, price: 75, subtotal: 225 },
            { menuItemId: 35, name: "Gulab Jamun", quantity: 1, price: 165, subtotal: 165 }
        ],
        subtotal: 1380,
        tax: 69.00,
        deliveryFee: 40,
        discount: 0,
        couponCode: null,
        total: 1489.00,
        status: ORDER_STATUS.DELIVERED,
        paymentStatus: PAYMENT_STATUS.PAID,
        paymentMethod: "cod",
        address: {
            line1: "45, Pearl Heights",
            line2: "Mohammad Ali Road",
            city: "Mumbai",
            pincode: "400003"
        },
        notes: "Extra spicy Rogan Josh",
        rating: 5,
        feedback: "Authentic Kashmiri flavors!",
        createdAt: "2026-01-27T22:30:00Z",
        confirmedAt: "2026-01-27T22:32:00Z",
        preparedAt: "2026-01-27T23:00:00Z",
        deliveredAt: "2026-01-27T23:35:00Z",
        deliveryPartnerId: "DP-004",
        estimatedDeliveryTime: 50
    },
    {
        id: "ORD-2026012601",
        customerId: "cust_011",
        customerName: "Rohit Kapoor",
        customerPhone: "+91 98765 12340",
        items: [
            { menuItemId: 52, name: "Lobster Thermidor", quantity: 2, price: 1495, subtotal: 2990 },
            { menuItemId: 51, name: "Truffle Butter Chicken", quantity: 2, price: 695, subtotal: 1390 },
            { menuItemId: 54, name: "Wagyu Seekh Kebab", quantity: 2, price: 895, subtotal: 1790 },
            { menuItemId: 53, name: "Molecular Rasmalai", quantity: 4, price: 395, subtotal: 1580 },
            { menuItemId: 28, name: "Cheese Naan", quantity: 6, price: 125, subtotal: 750 }
        ],
        subtotal: 8500,
        tax: 425.00,
        deliveryFee: 0,
        discount: 1700,
        couponCode: "DIAMOND20",
        total: 7225.00,
        status: ORDER_STATUS.DELIVERED,
        paymentStatus: PAYMENT_STATUS.PAID,
        paymentMethod: "card",
        address: {
            line1: "Penthouse, Sea View Towers",
            line2: "Marine Drive",
            city: "Mumbai",
            pincode: "400020"
        },
        notes: "Party of 8. Please include extra cutlery and napkins.",
        rating: 5,
        feedback: "Perfect for our dinner party! Chef's specials were the highlight.",
        createdAt: "2026-01-26T19:00:00Z",
        confirmedAt: "2026-01-26T19:02:00Z",
        preparedAt: "2026-01-26T19:50:00Z",
        deliveredAt: "2026-01-26T20:20:00Z",
        deliveryPartnerId: "DP-001",
        estimatedDeliveryTime: 60
    },
    {
        id: "ORD-2026012501",
        customerId: "cust_007",
        customerName: "Arjun Menon",
        customerPhone: "+91 32109 87654",
        items: [
            { menuItemId: 21, name: "Chicken Tikka Masala", quantity: 1, price: 445, subtotal: 445 },
            { menuItemId: 31, name: "Jeera Rice", quantity: 1, price: 165, subtotal: 165 },
            { menuItemId: 24, name: "Garlic Naan", quantity: 2, price: 85, subtotal: 170 }
        ],
        subtotal: 780,
        tax: 39.00,
        deliveryFee: 40,
        discount: 0,
        couponCode: null,
        total: 859.00,
        status: ORDER_STATUS.DELIVERED,
        paymentStatus: PAYMENT_STATUS.PAID,
        paymentMethod: "upi",
        address: {
            line1: "501, Tech Tower",
            line2: "Lower Parel",
            city: "Mumbai",
            pincode: "400013"
        },
        notes: "Office lunch - deliver to reception",
        rating: 4,
        feedback: "Good portion size",
        createdAt: "2026-01-25T12:15:00Z",
        confirmedAt: "2026-01-25T12:17:00Z",
        preparedAt: "2026-01-25T12:35:00Z",
        deliveredAt: "2026-01-25T13:00:00Z",
        deliveryPartnerId: "DP-002",
        estimatedDeliveryTime: 40
    },
    {
        id: "ORD-2026012401",
        customerId: "cust_008",
        customerName: "Kavitha Iyer",
        customerPhone: "+91 21098 76543",
        items: [
            { menuItemId: 22, name: "Mixed Vegetable Korma", quantity: 2, price: 285, subtotal: 570 },
            { menuItemId: 30, name: "Vegetable Biryani", quantity: 1, price: 295, subtotal: 295 },
            { menuItemId: 38, name: "Gajar Ka Halwa", quantity: 2, price: 175, subtotal: 350 },
            { menuItemId: 43, name: "Masala Chai", quantity: 4, price: 65, subtotal: 260 }
        ],
        subtotal: 1475,
        tax: 73.75,
        deliveryFee: 40,
        discount: 147.50,
        couponCode: "GOLD10",
        total: 1441.25,
        status: ORDER_STATUS.DELIVERED,
        paymentStatus: PAYMENT_STATUS.PAID,
        paymentMethod: "upi",
        address: {
            line1: "88, Temple View",
            line2: "Matunga",
            city: "Mumbai",
            pincode: "400019"
        },
        notes: "No onion, no garlic",
        rating: 5,
        feedback: "Perfect sattvic food for our family gathering!",
        createdAt: "2026-01-24T18:00:00Z",
        confirmedAt: "2026-01-24T18:03:00Z",
        preparedAt: "2026-01-24T18:30:00Z",
        deliveredAt: "2026-01-24T19:05:00Z",
        deliveryPartnerId: "DP-003",
        estimatedDeliveryTime: 50
    },
    {
        id: "ORD-2026012301",
        customerId: "cust_015",
        customerName: "Karan Malhotra",
        customerPhone: "+91 54321 56780",
        items: [
            { menuItemId: 2, name: "Chicken 65", quantity: 3, price: 345, subtotal: 1035 },
            { menuItemId: 51, name: "Truffle Butter Chicken", quantity: 2, price: 695, subtotal: 1390 },
            { menuItemId: 29, name: "Hyderabadi Chicken Biryani", quantity: 3, price: 395, subtotal: 1185 },
            { menuItemId: 39, name: "Chocolate Brownie with Ice Cream", quantity: 4, price: 245, subtotal: 980 },
            { menuItemId: 47, name: "Cold Coffee", quantity: 5, price: 145, subtotal: 725 }
        ],
        subtotal: 5315,
        tax: 265.75,
        deliveryFee: 0,
        discount: 797.25,
        couponCode: "PLATINUM15",
        total: 4783.50,
        status: ORDER_STATUS.DELIVERED,
        paymentStatus: PAYMENT_STATUS.PAID,
        paymentMethod: "card",
        address: {
            line1: "14, Film City Road",
            line2: "Goregaon East",
            city: "Mumbai",
            pincode: "400065"
        },
        notes: "Production set catering - need by 10 PM sharp",
        rating: 5,
        feedback: "Saved our late night shoot! Amazing food.",
        createdAt: "2026-01-23T21:00:00Z",
        confirmedAt: "2026-01-23T21:02:00Z",
        preparedAt: "2026-01-23T21:40:00Z",
        deliveredAt: "2026-01-23T22:00:00Z",
        deliveryPartnerId: "DP-001",
        estimatedDeliveryTime: 50
    },
    // More historical orders for analytics
    {
        id: "ORD-2026012001",
        customerId: "cust_004",
        customerName: "Sneha Reddy",
        customerPhone: "+91 65432 10987",
        items: [
            { menuItemId: 16, name: "Palak Paneer", quantity: 1, price: 315, subtotal: 315 },
            { menuItemId: 27, name: "Tandoori Roti", quantity: 4, price: 45, subtotal: 180 },
            { menuItemId: 43, name: "Masala Chai", quantity: 2, price: 65, subtotal: 130 }
        ],
        subtotal: 625,
        tax: 31.25,
        deliveryFee: 40,
        discount: 0,
        couponCode: null,
        total: 696.25,
        status: ORDER_STATUS.DELIVERED,
        paymentStatus: PAYMENT_STATUS.PAID,
        paymentMethod: "cod",
        address: {
            line1: "12, Green Valley",
            line2: "Andheri East",
            city: "Mumbai",
            pincode: "400069"
        },
        notes: "Jain preparation please",
        rating: 4,
        feedback: "Good jain options",
        createdAt: "2026-01-20T13:30:00Z",
        confirmedAt: "2026-01-20T13:32:00Z",
        preparedAt: "2026-01-20T13:55:00Z",
        deliveredAt: "2026-01-20T14:25:00Z",
        deliveryPartnerId: "DP-004",
        estimatedDeliveryTime: 45
    },
    {
        id: "ORD-2026011501",
        customerId: "cust_014",
        customerName: "Nisha Agarwal",
        customerPhone: "+91 65432 45670",
        items: [
            { menuItemId: 12, name: "Dal Makhani", quantity: 2, price: 295, subtotal: 590 },
            { menuItemId: 31, name: "Jeera Rice", quantity: 2, price: 165, subtotal: 330 },
            { menuItemId: 49, name: "Buttermilk (Chaas)", quantity: 2, price: 55, subtotal: 110 }
        ],
        subtotal: 1030,
        tax: 51.50,
        deliveryFee: 40,
        discount: 103,
        couponCode: "GOLD10",
        total: 1018.50,
        status: ORDER_STATUS.DELIVERED,
        paymentStatus: PAYMENT_STATUS.PAID,
        paymentMethod: "upi",
        address: {
            line1: "702, Financial District",
            line2: "Nariman Point",
            city: "Mumbai",
            pincode: "400021"
        },
        notes: "Office lunch for 2",
        rating: 5,
        feedback: "Perfect light lunch",
        createdAt: "2026-01-15T12:00:00Z",
        confirmedAt: "2026-01-15T12:02:00Z",
        preparedAt: "2026-01-15T12:25:00Z",
        deliveredAt: "2026-01-15T12:55:00Z",
        deliveryPartnerId: "DP-002",
        estimatedDeliveryTime: 45
    },
    // Cancelled order for testing
    {
        id: "ORD-2026011801",
        customerId: "cust_010",
        customerName: "Ananya Deshmukh",
        customerPhone: "+91 09876 54321",
        items: [
            { menuItemId: 8, name: "Hara Bhara Kebab", quantity: 2, price: 265, subtotal: 530 },
            { menuItemId: 45, name: "Fresh Lime Soda", quantity: 2, price: 85, subtotal: 170 }
        ],
        subtotal: 700,
        tax: 35.00,
        deliveryFee: 40,
        discount: 0,
        couponCode: null,
        total: 775.00,
        status: ORDER_STATUS.CANCELLED,
        paymentStatus: PAYMENT_STATUS.REFUNDED,
        paymentMethod: "upi",
        address: {
            line1: "12, Innovation Hub",
            line2: "BKC",
            city: "Mumbai",
            pincode: "400051"
        },
        notes: "",
        rating: null,
        feedback: null,
        cancelReason: "Customer requested cancellation - meeting got rescheduled",
        createdAt: "2026-01-18T11:00:00Z",
        confirmedAt: "2026-01-18T11:02:00Z",
        cancelledAt: "2026-01-18T11:10:00Z",
        deliveryPartnerId: null,
        estimatedDeliveryTime: 40
    }
];

// Delivery partners
const deliveryPartners = [
    { id: "DP-001", name: "Raj Kumar", phone: "+91 99887 76655", rating: 4.8, totalDeliveries: 1234, vehicle: "Bike" },
    { id: "DP-002", name: "Suresh Patil", phone: "+91 88776 65544", rating: 4.6, totalDeliveries: 987, vehicle: "Bike" },
    { id: "DP-003", name: "Mohammed Ali", phone: "+91 77665 54433", rating: 4.9, totalDeliveries: 1567, vehicle: "Bike" },
    { id: "DP-004", name: "Ganesh More", phone: "+91 66554 43322", rating: 4.7, totalDeliveries: 756, vehicle: "Bike" }
];

// Coupon codes
const coupons = [
    { code: "WELCOME20", discount: 20, type: "percentage", minOrder: 500, maxDiscount: 200, validTill: "2026-12-31", usageLimit: 1, description: "Welcome offer for new customers" },
    { code: "GOLD10", discount: 10, type: "percentage", minOrder: 800, maxDiscount: 500, validTill: "2026-12-31", usageLimit: null, description: "Gold tier loyalty discount" },
    { code: "PLATINUM15", discount: 15, type: "percentage", minOrder: 1000, maxDiscount: 1000, validTill: "2026-12-31", usageLimit: null, description: "Platinum tier loyalty discount" },
    { code: "DIAMOND20", discount: 20, type: "percentage", minOrder: 2000, maxDiscount: 2000, validTill: "2026-12-31", usageLimit: null, description: "Diamond tier loyalty discount" },
    { code: "VIP10", discount: 10, type: "percentage", minOrder: 1500, maxDiscount: 1000, validTill: "2026-12-31", usageLimit: null, description: "VIP customer discount" },
    { code: "BIRYANI10", discount: 10, type: "percentage", minOrder: 500, maxDiscount: 300, validTill: "2026-06-30", usageLimit: 3, description: "Biryani lovers special" },
    { code: "SEAFOOD15", discount: 15, type: "percentage", minOrder: 1000, maxDiscount: 500, validTill: "2026-03-31", usageLimit: 2, description: "Seafood festival discount" },
    { code: "FLAT100", discount: 100, type: "fixed", minOrder: 600, maxDiscount: 100, validTill: "2026-02-28", usageLimit: 1, description: "Flat ₹100 off" }
];

module.exports = {
    orders,
    ORDER_STATUS,
    PAYMENT_STATUS,
    PAYMENT_METHODS,
    deliveryPartners,
    coupons,
    generateOrderId
};
