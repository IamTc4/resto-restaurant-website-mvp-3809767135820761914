# 🍷 SAVORIA - Feature Access & Testing Guide

This guide provides step-by-step instructions on how to access, test, and verify all the features of the SAVORIA Restaurant Platform.

---

## 🚀 Quick Start - Running the System

To test the features, you need to run both the backend and frontend servers.

### 1. Backend Server
1. Open a terminal in `backend/`.
2. Install dependencies: `npm install` (only required once).
3. **Link Supabase**:
   - Create a `.env` file in the root directory.
   - Add your Supabase credentials:
     ```env
     SUPABASE_URL=your_supabase_project_url
     SUPABASE_KEY=your_supabase_anon_key
     ```
   - The backend will automatically detect these and initialize the client.
4. Start the server: `npm start`.
5. **Verification**: Navigate to `http://localhost:5006/`. You should see "Savoria Ultimate Backend [VERIFIED ACTIVE]".

### 2. Frontend Web (Customer Site)
1. Open a terminal in `frontend/web/`.
2. Install dependencies: `npm install`.
3. Start the development server: `npm run dev`.
4. **Verification**: Open the URL provided in the terminal (usually `http://localhost:5173/`).

### 3. Admin Dashboard
1. Open a terminal in `frontend/admin-dashboard/`.
2. Install dependencies: `npm install`.
3. Start the development server: `npm run dev`.
4. **Verification**: Open the second URL provided (usually `http://localhost:5174/`).

---

## 🛠️ Feature Testing Checklist

### 1. AI Sommelier (Chatbot)
- [ ] **Access**: Click the floating chat bubble 💬 on the bottom-right of the Home page.
- [ ] **Interaction**: Ask "What do you recommend for dinner?" or "Is there anything spicy?".
- [ ] **Verification**: The AI should respond in a professional and warm tone, suggesting menu items like Dal Makhani or Paneer Tikka.
- [ ] **Hinglish Support**: Try asking "Kuch special hai kya?".

### 2. Menu Experience
- [ ] **Access**: Navigate to the "Explore Menu" button on the Home page or go directly to `/menu`.
- [ ] **Functionality**: Browse the categories and items.
- [ ] **Cart Actions**: Click "Add to Cart" on any item.
- [ ] **Verification**: An alert should confirm that the item was added to the cart.

### 3. Visual & Responsive Design
- [ ] **Hero Section**: Verify the "Legacy of Hospitality" animation and the text gradient.
- [ ] **Parallax Effect**: Scroll down to see the glassmorphism effects and the "Heritage" section.
- [ ] **Mobile View**: Open Chrome DevTools (F12), toggle device toolbar, and select "iPhone 12" to verify responsiveness.

### 4. Admin Insights (Dashboard)
- [ ] **Access**: Open the Admin Dashboard (usually on port 5174).
- [ ] **Analytics**: View the charts and metrics (Note: Most metrics are currently based on simulated data).
- [ ] **Menu Management**: Check if you can view the menu item list.

---

## 🔧 Troubleshooting

| Issue | Solution |
| :--- | :--- |
| **Port Conflict** | If port 5006 is blocked, check for zombie processes or change the port in `backend/server.js`. |
| **AI Not Responding** | Ensure `.env` contains a valid `GEMINI_API_KEY` or that Ollama is running if `AI_PROVIDER=local`. |
| **Styling Missing** | Ensure all `npm install` commands were successful and that `index.css` is correctly imported. |

---

> [!TIP]
> Use the **AI Sommelier** to test various scenarios like late-night cravings or dietary restrictions. The AI is programmed to handle these intelligently even in mock mode!
