/**
 * SAVORIA RESTAURANT - CUSTOMER DATABASE
 * Sample customer profiles for testing CRM, analytics, and recommendations
 */

const customers = [
    {
        id: "cust_001",
        name: "Rahul Sharma",
        email: "rahul.sharma@email.com",
        phone: "+91 98765 43210",
        avatar: "https://i.pravatar.cc/150?img=1",
        address: {
            line1: "42, Marina Heights",
            line2: "Worli Sea Face",
            city: "Mumbai",
            state: "Maharashtra",
            pincode: "400018",
            landmark: "Near Worli Dairy"
        },
        preferences: {
            isVeg: false,
            spiceLevel: 2,
            favoriteCategories: ["Main Course", "Starters"],
            allergies: [],
            dietaryRestrictions: []
        },
        loyaltyPoints: 2450,
        tier: "Gold",
        totalOrders: 34,
        totalSpent: 28560,
        averageOrderValue: 840,
        lastOrderDate: "2026-01-28",
        joinDate: "2024-03-15",
        segment: "loyal",
        favoriteItems: [11, 2, 29], // Butter Chicken, Chicken 65, Biryani
        tags: ["frequent-orderer", "non-veg-lover", "weekend-customer"]
    },
    {
        id: "cust_002",
        name: "Priya Patel",
        email: "priya.patel@gmail.com",
        phone: "+91 87654 32109",
        avatar: "https://i.pravatar.cc/150?img=5",
        address: {
            line1: "15, Shanti Niketan",
            line2: "Bandra West",
            city: "Mumbai",
            state: "Maharashtra",
            pincode: "400050",
            landmark: "Near Linking Road"
        },
        preferences: {
            isVeg: true,
            spiceLevel: 1,
            favoriteCategories: ["Desserts", "Beverages"],
            allergies: [],
            dietaryRestrictions: ["vegetarian"]
        },
        loyaltyPoints: 890,
        tier: "Silver",
        totalOrders: 12,
        totalSpent: 8920,
        averageOrderValue: 743,
        lastOrderDate: "2026-01-25",
        joinDate: "2025-06-20",
        segment: "regular",
        favoriteItems: [3, 12, 36], // Paneer Tikka, Dal Makhani, Rasmalai
        tags: ["vegetarian", "dessert-lover", "family-orders"]
    },
    {
        id: "cust_003",
        name: "Amit Kumar",
        email: "amit.kumar@outlook.com",
        phone: "+91 76543 21098",
        avatar: "https://i.pravatar.cc/150?img=3",
        address: {
            line1: "B-204, Corporate Park",
            line2: "Powai",
            city: "Mumbai",
            state: "Maharashtra",
            pincode: "400076",
            landmark: "Near Hiranandani Gardens"
        },
        preferences: {
            isVeg: false,
            spiceLevel: 3,
            favoriteCategories: ["Chef's Specials", "Main Course"],
            allergies: ["shellfish"],
            dietaryRestrictions: []
        },
        loyaltyPoints: 5680,
        tier: "Platinum",
        totalOrders: 67,
        totalSpent: 89450,
        averageOrderValue: 1335,
        lastOrderDate: "2026-01-29",
        joinDate: "2023-11-10",
        segment: "vip",
        favoriteItems: [51, 54, 13], // Truffle Butter Chicken, Wagyu Seekh, Lamb Rogan Josh
        tags: ["high-spender", "premium-customer", "corporate-orders"]
    },
    {
        id: "cust_004",
        name: "Sneha Reddy",
        email: "sneha.reddy@yahoo.com",
        phone: "+91 65432 10987",
        avatar: "https://i.pravatar.cc/150?img=9",
        address: {
            line1: "12, Green Valley",
            line2: "Andheri East",
            city: "Mumbai",
            state: "Maharashtra",
            pincode: "400069",
            landmark: "Near MIDC"
        },
        preferences: {
            isVeg: true,
            spiceLevel: 2,
            favoriteCategories: ["Main Course", "Breads"],
            allergies: ["nuts"],
            dietaryRestrictions: ["jain"]
        },
        loyaltyPoints: 320,
        tier: "Bronze",
        totalOrders: 5,
        totalSpent: 2890,
        averageOrderValue: 578,
        lastOrderDate: "2026-01-20",
        joinDate: "2025-12-05",
        segment: "new",
        favoriteItems: [16, 23, 43], // Palak Paneer, Butter Naan, Masala Chai
        tags: ["new-customer", "jain-food", "budget-conscious"]
    },
    {
        id: "cust_005",
        name: "Vikram Singh",
        email: "vikram.singh@gmail.com",
        phone: "+91 54321 09876",
        avatar: "https://i.pravatar.cc/150?img=12",
        address: {
            line1: "78, Royal Residency",
            line2: "Juhu",
            city: "Mumbai",
            state: "Maharashtra",
            pincode: "400049",
            landmark: "Near Juhu Beach"
        },
        preferences: {
            isVeg: false,
            spiceLevel: 2,
            favoriteCategories: ["Rice & Biryani", "Starters"],
            allergies: [],
            dietaryRestrictions: []
        },
        loyaltyPoints: 1560,
        tier: "Gold",
        totalOrders: 23,
        totalSpent: 19870,
        averageOrderValue: 864,
        lastOrderDate: "2026-01-27",
        joinDate: "2024-08-12",
        segment: "loyal",
        favoriteItems: [19, 29, 5], // Mutton Biryani, Chicken Biryani, Seekh Kebab
        tags: ["biryani-lover", "meat-lover", "regular-tipper"]
    },
    {
        id: "cust_006",
        name: "Meera Nair",
        email: "meera.nair@gmail.com",
        phone: "+91 43210 98765",
        avatar: "https://i.pravatar.cc/150?img=16",
        address: {
            line1: "23, Sagar Apartments",
            line2: "Colaba",
            city: "Mumbai",
            state: "Maharashtra",
            pincode: "400005",
            landmark: "Near Gateway of India"
        },
        preferences: {
            isVeg: false,
            spiceLevel: 1,
            favoriteCategories: ["Chef's Specials", "Beverages"],
            allergies: ["gluten"],
            dietaryRestrictions: ["gluten-free"]
        },
        loyaltyPoints: 4230,
        tier: "Platinum",
        totalOrders: 45,
        totalSpent: 67890,
        averageOrderValue: 1509,
        lastOrderDate: "2026-01-28",
        joinDate: "2024-01-22",
        segment: "vip",
        favoriteItems: [52, 7, 44], // Lobster Thermidor, Prawn Koliwada, Mango Lassi
        tags: ["seafood-lover", "premium", "health-conscious"]
    },
    {
        id: "cust_007",
        name: "Arjun Menon",
        email: "arjun.m@techcorp.com",
        phone: "+91 32109 87654",
        avatar: "https://i.pravatar.cc/150?img=7",
        address: {
            line1: "501, Tech Tower",
            line2: "Lower Parel",
            city: "Mumbai",
            state: "Maharashtra",
            pincode: "400013",
            landmark: "Near Phoenix Mills"
        },
        preferences: {
            isVeg: false,
            spiceLevel: 2,
            favoriteCategories: ["Main Course", "Starters"],
            allergies: [],
            dietaryRestrictions: []
        },
        loyaltyPoints: 780,
        tier: "Silver",
        totalOrders: 15,
        totalSpent: 12450,
        averageOrderValue: 830,
        lastOrderDate: "2026-01-24",
        joinDate: "2025-04-18",
        segment: "regular",
        favoriteItems: [21, 9, 47], // Chicken Tikka Masala, Chicken Malai Tikka, Cold Coffee
        tags: ["office-orders", "lunch-regular", "chicken-lover"]
    },
    {
        id: "cust_008",
        name: "Kavitha Iyer",
        email: "kavitha.iyer@email.com",
        phone: "+91 21098 76543",
        avatar: "https://i.pravatar.cc/150?img=20",
        address: {
            line1: "88, Temple View",
            line2: "Matunga",
            city: "Mumbai",
            state: "Maharashtra",
            pincode: "400019",
            landmark: "Near Five Gardens"
        },
        preferences: {
            isVeg: true,
            spiceLevel: 0,
            favoriteCategories: ["Desserts", "Main Course"],
            allergies: [],
            dietaryRestrictions: ["sattvic"]
        },
        loyaltyPoints: 1890,
        tier: "Gold",
        totalOrders: 28,
        totalSpent: 18760,
        averageOrderValue: 670,
        lastOrderDate: "2026-01-26",
        joinDate: "2024-06-30",
        segment: "loyal",
        favoriteItems: [22, 38, 35], // Veg Korma, Gajar Halwa, Gulab Jamun
        tags: ["traditional", "sweet-tooth", "family-gatherings"]
    },
    {
        id: "cust_009",
        name: "Danish Sheikh",
        email: "danish.sheikh@gmail.com",
        phone: "+91 10987 65432",
        avatar: "https://i.pravatar.cc/150?img=13",
        address: {
            line1: "45, Pearl Heights",
            line2: "Mohammad Ali Road",
            city: "Mumbai",
            state: "Maharashtra",
            pincode: "400003",
            landmark: "Near Minara Masjid"
        },
        preferences: {
            isVeg: false,
            spiceLevel: 3,
            favoriteCategories: ["Main Course", "Rice & Biryani"],
            allergies: [],
            dietaryRestrictions: ["halal"]
        },
        loyaltyPoints: 2890,
        tier: "Gold",
        totalOrders: 38,
        totalSpent: 32450,
        averageOrderValue: 854,
        lastOrderDate: "2026-01-29",
        joinDate: "2024-02-14",
        segment: "loyal",
        favoriteItems: [13, 19, 15], // Lamb Rogan Josh, Mutton Biryani, Chicken Chettinad
        tags: ["spicy-lover", "mutton-preferred", "late-night-orders"]
    },
    {
        id: "cust_010",
        name: "Ananya Deshmukh",
        email: "ananya.d@startup.io",
        phone: "+91 09876 54321",
        avatar: "https://i.pravatar.cc/150?img=25",
        address: {
            line1: "12, Innovation Hub",
            line2: "BKC",
            city: "Mumbai",
            state: "Maharashtra",
            pincode: "400051",
            landmark: "Near Jio Garden"
        },
        preferences: {
            isVeg: true,
            spiceLevel: 1,
            favoriteCategories: ["Starters", "Beverages"],
            allergies: ["dairy"],
            dietaryRestrictions: ["vegan"]
        },
        loyaltyPoints: 450,
        tier: "Bronze",
        totalOrders: 8,
        totalSpent: 4560,
        averageOrderValue: 570,
        lastOrderDate: "2026-01-22",
        joinDate: "2025-10-08",
        segment: "new",
        favoriteItems: [8, 10, 45], // Hara Bhara Kebab, Spring Rolls, Fresh Lime
        tags: ["vegan-options", "healthy-eater", "startup-crowd"]
    },
    {
        id: "cust_011",
        name: "Rohit Kapoor",
        email: "rohit.kapoor@business.com",
        phone: "+91 98765 12340",
        avatar: "https://i.pravatar.cc/150?img=8",
        address: {
            line1: "Penthouse, Sea View Towers",
            line2: "Marine Drive",
            city: "Mumbai",
            state: "Maharashtra",
            pincode: "400020",
            landmark: "Near Wankhede Stadium"
        },
        preferences: {
            isVeg: false,
            spiceLevel: 1,
            favoriteCategories: ["Chef's Specials", "Beverages"],
            allergies: [],
            dietaryRestrictions: []
        },
        loyaltyPoints: 8920,
        tier: "Diamond",
        totalOrders: 89,
        totalSpent: 178000,
        averageOrderValue: 2000,
        lastOrderDate: "2026-01-29",
        joinDate: "2023-05-20",
        segment: "vip",
        favoriteItems: [52, 51, 54], // Lobster, Truffle Butter Chicken, Wagyu
        tags: ["ultra-premium", "party-orders", "wine-pairing"]
    },
    {
        id: "cust_012",
        name: "Fatima Khan",
        email: "fatima.khan@email.com",
        phone: "+91 87654 23450",
        avatar: "https://i.pravatar.cc/150?img=32",
        address: {
            line1: "34, Crescent Colony",
            line2: "Byculla",
            city: "Mumbai",
            state: "Maharashtra",
            pincode: "400027",
            landmark: "Near Byculla Zoo"
        },
        preferences: {
            isVeg: false,
            spiceLevel: 2,
            favoriteCategories: ["Main Course", "Desserts"],
            allergies: [],
            dietaryRestrictions: ["halal"]
        },
        loyaltyPoints: 1230,
        tier: "Silver",
        totalOrders: 19,
        totalSpent: 14560,
        averageOrderValue: 766,
        lastOrderDate: "2026-01-25",
        joinDate: "2025-02-28",
        segment: "regular",
        favoriteItems: [11, 13, 41], // Butter Chicken, Lamb Rogan Josh, Jalebi
        tags: ["family-size", "weekend-celebrator", "festive-orders"]
    },
    {
        id: "cust_013",
        name: "Siddharth Joshi",
        email: "sid.joshi@creative.co",
        phone: "+91 76543 34560",
        avatar: "https://i.pravatar.cc/150?img=11",
        address: {
            line1: "Studio 5, Artist Lane",
            line2: "Kala Ghoda",
            city: "Mumbai",
            state: "Maharashtra",
            pincode: "400023",
            landmark: "Near Jehangir Art Gallery"
        },
        preferences: {
            isVeg: true,
            spiceLevel: 2,
            favoriteCategories: ["Starters", "Main Course"],
            allergies: [],
            dietaryRestrictions: ["vegetarian"]
        },
        loyaltyPoints: 670,
        tier: "Bronze",
        totalOrders: 11,
        totalSpent: 7890,
        averageOrderValue: 717,
        lastOrderDate: "2026-01-23",
        joinDate: "2025-08-15",
        segment: "regular",
        favoriteItems: [3, 18, 14], // Paneer Tikka, Kadai Paneer, Paneer Lababdar
        tags: ["paneer-lover", "artistic-customer", "lunch-orders"]
    },
    {
        id: "cust_014",
        name: "Nisha Agarwal",
        email: "nisha.agarwal@finance.com",
        phone: "+91 65432 45670",
        avatar: "https://i.pravatar.cc/150?img=26",
        address: {
            line1: "702, Financial District",
            line2: "Nariman Point",
            city: "Mumbai",
            state: "Maharashtra",
            pincode: "400021",
            landmark: "Near Air India Building"
        },
        preferences: {
            isVeg: true,
            spiceLevel: 1,
            favoriteCategories: ["Main Course", "Beverages"],
            allergies: ["gluten"],
            dietaryRestrictions: ["marwari"]
        },
        loyaltyPoints: 2340,
        tier: "Gold",
        totalOrders: 32,
        totalSpent: 24560,
        averageOrderValue: 768,
        lastOrderDate: "2026-01-27",
        joinDate: "2024-04-10",
        segment: "loyal",
        favoriteItems: [12, 31, 49], // Dal Makhani, Jeera Rice, Buttermilk
        tags: ["marwari-food", "office-lunch", "healthy-options"]
    },
    {
        id: "cust_015",
        name: "Karan Malhotra",
        email: "karan.m@entertainment.tv",
        phone: "+91 54321 56780",
        avatar: "https://i.pravatar.cc/150?img=15",
        address: {
            line1: "14, Film City Road",
            line2: "Goregaon East",
            city: "Mumbai",
            state: "Maharashtra",
            pincode: "400065",
            landmark: "Near Film City"
        },
        preferences: {
            isVeg: false,
            spiceLevel: 2,
            favoriteCategories: ["Starters", "Chef's Specials"],
            allergies: [],
            dietaryRestrictions: []
        },
        loyaltyPoints: 3890,
        tier: "Platinum",
        totalOrders: 52,
        totalSpent: 67890,
        averageOrderValue: 1306,
        lastOrderDate: "2026-01-28",
        joinDate: "2023-12-01",
        segment: "vip",
        favoriteItems: [2, 51, 39], // Chicken 65, Truffle Butter Chicken, Brownie
        tags: ["late-night", "bulk-orders", "set-catering"]
    }
];

// Customer segments for analytics
const customerSegments = {
    vip: { minSpend: 50000, label: "VIP Customers", color: "#FFD700" },
    loyal: { minOrders: 20, label: "Loyal Regulars", color: "#4CAF50" },
    regular: { minOrders: 10, label: "Regular Customers", color: "#2196F3" },
    new: { maxOrders: 5, label: "New Customers", color: "#9C27B0" },
    at_risk: { daysSinceOrder: 30, label: "At Risk", color: "#FF5722" }
};

// Loyalty tiers configuration
const loyaltyTiers = {
    Bronze: { minPoints: 0, discount: 0, perks: ["Birthday bonus"] },
    Silver: { minPoints: 500, discount: 5, perks: ["Birthday bonus", "Early access to specials"] },
    Gold: { minPoints: 1500, discount: 10, perks: ["Birthday bonus", "Early access", "Free delivery"] },
    Platinum: { minPoints: 4000, discount: 15, perks: ["All Gold perks", "Priority support", "Exclusive events"] },
    Diamond: { minPoints: 8000, discount: 20, perks: ["All Platinum perks", "Personal sommelier", "Chef's table access"] }
};

module.exports = { customers, customerSegments, loyaltyTiers };
