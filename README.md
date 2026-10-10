# BAVIQUE — Fancy, Beauty, Fashion
> *More than just a store… it's a vibe.*

Welcome to the official web application for **BAVIQUE**, a premium girls' boutique specializing in hair accessories, beauty & skincare, luxury jewellery, fancy bags, and boutique fashion dresses.

---

## 💎 Project Overview

BAVIQUE is a **product-display-only catalogue website** designed to let customers explore curated collections online before visiting the physical store.

- **Display-Only Model:** No shopping cart, no online checkout, no payment gateways, no customer accounts.
- **Physical Store Focus:** Products showcase prices in Indian Rupees (₹), availability status, descriptions, and direct inquiry actions (Call Boutique / WhatsApp / Instagram).
- **Owner Admin Dashboard:** Non-technical owner portal for effortlessly adding products, updating prices, toggling availability, managing categories, and updating boutique timings/contact info.

---

## 🎨 Design System & Brand Identity

- **Primary Asset:** Original BAVIQUE Logo preserved across header, footer, and brand moments.
- **Cinematic Intro:** Atmospheric video presentation utilizing `brand-intro.mp4` with logo fade-in, responsive controls, and non-intrusive "Skip Intro" option.
- **Color Palette:**
  - Warm Champagne Cream: `#F7E9DD`
  - Soft Blush Pink: `#E8A0A8`
  - Rose Gold: `#B76E79`
  - Rich Metallic Gold: `#C49A52`
  - Deep Chocolate Brown: `#493126`
  - Soft Ivory: `#FFF9F4`
- **Typography:** *Playfair Display* (luxury serif headings), *Plus Jakarta Sans* (clean body/prices), *Great Vibes* (refined script accents).
- **Glassmorphism:** Frosted cream/blush backdrops, translucent golden borders, and subtle elevation shadows.

---

## 🛠️ Technology Stack

| Layer | Technologies |
|---|---|
| **Frontend** | React 18, Vite 6, Tailwind CSS, Lucide React, React Router 6 |
| **Backend** | Node.js, Express.js, Mongoose ODM, Helmet, CORS, Morgan |
| **Database** | MongoDB (Local service or MongoDB Atlas) |
| **Security** | Argon2id/Bcrypt password hashing, JWT HttpOnly authentication, Express Rate Limiter, Sharp image sterilization |
| **Media** | Sharp WebP image compression, streaming static server for brand MP4 |

---

## 🚀 Running the Project Locally

Both servers are currently active:

- **Public Boutique Frontend:** [http://localhost:3000](http://localhost:3000)
- **Admin Dashboard Login:** [http://localhost:3000/admin/login](http://localhost:3000/admin/login)
- **REST API Server:** [http://localhost:5000](http://localhost:5000)
- **API Health Check:** [http://localhost:5000/api/health](http://localhost:5000/api/health)

### Starting Manually:

1. **Backend Server:**
   ```bash
   cd backend
   npm install
   npm run seed    # Seeds 15 curated products, 5 categories, admin user, and settings
   npm start       # Runs on port 5000
   ```

2. **Frontend Client:**
   ```bash
   cd frontend
   npm install
   npm run dev     # Runs on port 3000 with proxy to 5000
   ```

---

## 🔐 Administrator Access

- **Login URL:** [http://localhost:3000/admin/login](http://localhost:3000/admin/login)
- **Email:** `admin@bavique.com`
- **Password:** `Bavique@Admin2026!`

*(Password can be customized in `backend/.env` or updated securely inside the Admin Settings)*

---

## 🧪 Automated QA & Integration Tests

An automated test suite is provided to verify all public catalogue endpoints, security rules, rate limiters, admin CRUD, and image validation:

```bash
cd backend
node src/tests/test_suite.js
```

### Test Results Summary:
- **Total Tests:** 21
- **Passed:** 21 (100%)
- **Failed:** 0

Features verified:
1. Public Categories & Products retrieval
2. Keyword search, category filtering, and sorting
3. Unauthorized route protection (401 status)
4. Password brute-force rate limiting
5. Admin authentication & JWT token generation
6. Product addition, price modification, and safe deletion
7. Category deletion safety gate (prevents deletion if products exist)
8. Sharp multipart image processing and conversion to WebP

---

## 📱 Social & Store Details

- **Instagram:** [@bavique_ff_](https://instagram.com/bavique_ff_)
- **Contact:** +91 98765 43210
- **Store Hours:** Mon - Sun: 10:30 AM - 9:30 PM
- **Address:** BAVIQUE Boutique, Plot 24 Fashion Galleria, Near City Center, India
