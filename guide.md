# RestaurantBot AI - Complete File Structure & Architecture

## 📁 Project Root Structure

```
restaurantbot-ai/
├── 📂 backend/
│   ├── 📂 api/
│   ├── 📂 services/
│   ├── 📂 models/
│   ├── 📂 utils/
│   ├── 📂 config/
│   ├── 📂 middleware/
│   └── 📂 workers/
│
├── 📂 frontend/
│   ├── 📂 web/
│   ├── 📂 mobile/
│   └── 📂 admin-dashboard/
│
├── 📂 ai-core/
│   ├── 📂 prompts/
│   ├── 📂 embeddings/
│   ├── 📂 conversation/
│   └── 📂 analytics/
│
├── 📂 database/
│   ├── 📂 schemas/
│   ├── 📂 migrations/
│   └── 📂 seeds/
│
├── 📂 integrations/
│   ├── 📂 whatsapp/
│   ├── 📂 instagram/
│   ├── 📂 payment/
│   └── 📂 delivery/
│
├── 📂 shared/
│   ├── 📂 types/
│   ├── 📂 constants/
│   └── 📂 helpers/
│
├── 📂 scripts/
├── 📂 docs/
├── 📂 tests/
└── 📂 deployment/
```

---

## 🔧 Backend Structure (`/backend`)

### `/backend/api/`
**Purpose:** All API route handlers and controllers

```
api/
├── routes/
│   ├── chat.routes.js           # Chatbot conversation endpoints
│   ├── orders.routes.js          # Order management endpoints
│   ├── menu.routes.js            # Menu CRUD operations
│   ├── crm.routes.js             # Customer data endpoints
│   ├── analytics.routes.js       # Analytics & insights endpoints
│   ├── admin.routes.js           # Admin/owner dashboard endpoints
│   └── webhooks.routes.js        # External service webhooks
│
├── controllers/
│   ├── chat.controller.js        # Handles chat logic
│   ├── order.controller.js       # Order processing logic
│   ├── customer.controller.js    # Customer management
│   ├── analytics.controller.js   # Data analysis & reporting
│   └── notification.controller.js # Push notifications, SMS, etc.
│
└── validators/
    ├── chat.validator.js         # Input validation for chat
    ├── order.validator.js        # Order data validation
    └── common.validator.js       # Reusable validators
```

---

### `/backend/services/`
**Purpose:** Business logic layer - where the actual work happens

```
services/
├── ai/
│   ├── llm.service.js           # Interface to Gemini AI
│   ├── intent.service.js        # Detect user intent (order/query/complaint)
│   ├── sentiment.service.js     # Analyze customer mood
│   └── recommendation.service.js # Smart menu suggestions
│
├── crm/
│   ├── customer.service.js      # Customer profile management
│   ├── segmentation.service.js  # Customer classification logic
│   └── lifetime-value.service.js # Calculate customer LTV
│
├── order/
│   ├── order.service.js         # Order creation & tracking
│   ├── cart.service.js          # Shopping cart management
│   └── pricing.service.js       # Calculate totals, discounts, tax
│
├── analytics/
│   ├── metrics.service.js       # Calculate KPIs
│   ├── insights.service.js      # Generate business insights
│   └── reporting.service.js     # Create reports for owner
│
├── automation/
│   ├── workflow.service.js      # Automated workflows
│   ├── notification.service.js  # Send emails, SMS, push
│   └── scheduling.service.js    # Schedule tasks (reminders, etc.)
│
└── external/
    ├── payment.service.js       # Payment gateway integration
    ├── delivery.service.js      # Delivery partner APIs
    └── sms.service.js           # SMS provider integration
```

---

### `/backend/models/`
**Purpose:** Database schema definitions and data models

```
models/
├── Customer.model.js            # Customer profile schema
├── Conversation.model.js        # Chat history schema
├── Order.model.js               # Order details schema
├── MenuItem.model.js            # Menu item schema
├── Cart.model.js                # Shopping cart schema
├── Feedback.model.js            # Customer feedback/ratings
├── Analytics.model.js           # Analytics events schema
└── Automation.model.js          # Automation logs schema
```

---

### `/backend/utils/`
**Purpose:** Helper functions and utilities

```
utils/
├── logger.js                    # Logging (errors, info, debug)
├── cache.js                     # Redis caching wrapper
├── date-helpers.js              # Date formatting, timezone handling
├── text-helpers.js              # Text cleaning, formatting
├── error-handler.js             # Centralized error handling
├── response-formatter.js        # Standardize API responses
└── security.js                  # Encryption, hashing, sanitization
```

---

### `/backend/config/`
**Purpose:** Configuration files for different environments

```
config/
├── database.config.js           # DB connection settings
├── ai.config.js                 # AI API keys, model settings
├── payment.config.js            # Payment gateway credentials
├── email.config.js              # Email service settings
├── app.config.js                # General app settings
└── environments/
    ├── development.js           # Dev environment variables
    ├── staging.js               # Staging environment
    └── production.js            # Production environment
```

---

### `/backend/middleware/`
**Purpose:** Request processing middleware

```
middleware/
├── auth.middleware.js           # Verify user authentication
├── rate-limit.middleware.js     # Prevent API abuse
├── cors.middleware.js           # Handle cross-origin requests
├── session.middleware.js        # Manage user sessions
└── logging.middleware.js        # Log all incoming requests
```

---

### `/backend/workers/`
**Purpose:** Background jobs and scheduled tasks

```
workers/
├── analytics-aggregation.worker.js  # Daily analytics rollup
├── cleanup.worker.js                # Delete old logs, conversations
├── reminder.worker.js               # Send scheduled reminders
└── report-generation.worker.js      # Generate daily/weekly reports
```

---

## 🎨 Frontend Structure (`/frontend`)

### `/frontend/web/`
**Purpose:** Website chatbot interface

```
web/
├── components/
│   ├── ChatWidget/              # Floating chat bubble
│   ├── Menu/                    # Menu display components
│   └── Cart/                    # Shopping cart
│
├── pages/
│   ├── Home.jsx                 # Landing page
│   ├── Menu.jsx                 # Full menu page
│   ├── OrderTracking.jsx        # Track order page
│   └── Profile.jsx              # User profile
│
├── services/                    # API and storage services
├── hooks/                       # Custom hooks (useChat, useCart)
└── styles/                      # CSS/Styles
```

---

### `/frontend/mobile/`
**Purpose:** Mobile app (React Native or Flutter)

```
mobile/
├── screens/                     # ChatScreen, MenuScreen, etc.
├── components/                  # ChatBubble, MenuCard, etc.
├── navigation/                  # AppNavigator logic
└── services/                    # API, Notifications, Storage
```

---

### `/frontend/admin-dashboard/`
**Purpose:** Owner/staff admin panel

```
admin-dashboard/
├── pages/                       # Dashboard, Analytics, Menu, Orders
├── components/                  # Charts, Tables, Widgets
└── services/                    # dashboard-api
```

---

## 🧠 AI Core Structure (`/ai-core`)

- **`/prompts/`**: System prompts and message templates.
- **`/embeddings/`**: Vector search for menu and FAQs.
- **`/conversation/`**: Context management and intent detection.
- **`/analytics/`**: AI-powered business insights.

---

## 💾 Database Structure (`/database`)

- **`/schemas/`**: Table definitions (Mongoose/SQL).
- **`/migrations/`**: Version control for database changes.
- **`/seeds/`**: Sample data for local development.

---

## 🔌 Integrations Structure (`/integrations`)

- **`/whatsapp/`**: Webhook and message handlers.
- **`/payment/`**: Razorpay/Paytm integration.
- **`/delivery/`**: Dunzo/Swiggy API handlers.

---

## 🚀 Local Runnability (Prototype Settings)

This prototype is designed to run locally without external API dependencies:

1.  **AI Service**: The `llm.service.js` uses a simulation layer for Google Gemini. No Gemini API keys are required for basic flow testing.
2.  **Payments**: The `payment.service.js` returns a successful mock transaction ID.
3.  **Delivery**: The `delivery.service.js` returns a mock delivery ID.
4.  **Database**: Defaults to `mongodb://localhost:27017/restaurantbot`. Ensure MongoDB is running or update `MONGO_URI` in `.env`.

### Quick Start:
1.  Navigate to `/backend` and run `npm install`.
2.  Create a `.env` file based on `.env.example`.
3.  Run `npm start` to launch the server.
4.  Check [HOSTING.md](file:///c:/work/resto-restaurant-website-mvp-3809767135820761914/docs/HOSTING.md) for free deployment instructions.
