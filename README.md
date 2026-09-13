# 🎮 Nexus Forge — Indie Game Studio & Digital Marketplace

[![Angular](https://img.shields.io/badge/Angular-17.3-DD0031?style=for-the-badge&logo=angular&logoColor=white)](https://angular.io/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.4-3178C6?style=for-the-badge&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![Node.js](https://img.shields.io/badge/Node.js-20.x-339933?style=for-the-badge&logo=node.js&logoColor=white)](https://nodejs.org/)
[![Express](https://img.shields.io/badge/Express-4.18-000000?style=for-the-badge&logo=express&logoColor=white)](https://expressjs.com/)
[![TailwindCSS](https://img.shields.io/badge/Tailwind_CSS-3.4-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)](https://tailwindcss.com/)
[![SQLite](https://img.shields.io/badge/SQLite-3-003B57?style=for-the-badge&logo=sqlite&logoColor=white)](https://www.sqlite.org/)
[![License](https://img.shields.io/badge/License-MIT-blue.style=for-the-badge)](LICENSE)

A state-of-the-art, full-stack web application and digital marketplace for **Nexus Forge**, an independent game development studio. Built with an **Angular 17 Standalone Architecture**, **Angular Signals** for reactive state management, **Tailwind CSS v3**, and a robust **Express.js + TypeScript** REST backend powered by **SQLite**.

---

## 📋 Table of Contents

- [✨ Core Features](#-core-features)
- [🛠 Tech Stack & Architecture](#-tech-stack--architecture)
- [📂 Directory Structure](#-directory-structure)
- [⚡ Quick Start Guide](#-quick-start-guide)
- [🎮 Catalog & Seeded Games](#-catalog--seeded-games)
- [🔌 REST API Reference](#-rest-api-reference)
- [🎨 Key Architectural Highlights](#-key-architectural-highlights)
- [🤝 Contributing & License](#-contributing--license)

---

## ✨ Core Features

### 🌌 Interactive Home & Particle Hero
- **Dynamic Particle Canvas**: Custom HTML5 Canvas engine with glowing particle physics and mouse attraction effects.
- **Featured Spotlight**: 3D tilt showcase card for flagship titles with direct action links.
- **Live Studio Metrics**: Animated counters highlighting games launched, community size, awards, and team milestones.

### 🎯 Game Catalog & Advanced Search
- **Multi-Faceted Filtering**: Filter catalog by Genre (*Action, RPG, Strategy, Racing, Horror, Simulation, Puzzle, Adventure*), Badges (*Best Seller, New Release, Early Access, Staff Pick*), and Price Ranges.
- **Instant Search & Sort**: Real-time fuzzy title search and sorting by Popularity, Rating, Price (Low/High), and Title.
- **Interactive 3D Cards**: Hover-responsive game cards with glassmorphism overlays and quick cart actions.

### 🔍 Deep Game Details & Screenshot Lightbox
- **Full-Screen Lightbox**: Interactive screenshot gallery modal with thumbnail navigation and keyboard support.
- **Tabbed Interface**: Organized view for Game Overview, Detailed System Requirements (Minimum & Recommended), and Verified Community Reviews.
- **Real-Time Cart Sync**: Instant "In Cart" detection with quantity increment/decrement controls.

### 🏢 Studio Origin & Engine Tech Stack (`/studio`)
- **Origin Story**: Narrative journey chronicling the studio's evolution from a 2019 indie garage project to a modern powerhouse.
- **Milestone Timeline**: Interactive timeline showcasing engine releases, major game launches, and industry recognition.
- **Engine Tech Breakdown**: Spotlighting in-house C++, WebGPU, and custom shader pipeline capabilities.
- **Team Spotlights**: Profiles highlighting studio leadership, game designers, and core engineers.

### 📰 Devlogs & Technical Blog (`/blog`)
- **Deep Technical Articles**: Postmortems, rendering breakdown, network architecture, and AI pathfinding articles for all 12 indie games.
- **Interactive Reader Modal**: Seamless full-page reading experience without losing route context.
- **Search & Category Tagging**: Search articles by keyword or filter by devlog category.

### 🛒 Signal-Driven Reactive Cart Drawer
- **Angular Signals State**: Powered by `CartService` using Angular Signals for zero-latency UI reactivity across components.
- **Persistence & Calculations**: Automatic `localStorage` persistence, real-time item count badges, item removal, quantity adjustment, and dynamic tax calculation.

### 💳 3D Animated Checkout Flow
- **3D Card Flip Preview**: Interactive credit card visualization that mirrors user input (Cardholder Name, Number, Expiry, CVV) and flips 180° in 3D space when focusing on CVV.
- **One-Click Demo Fill**: Pre-populates realistic test card data for instant demonstration testing.
- **Order Processing Animation**: Multi-stage modal feedback loop simulating bank authorization, inventory lock, and receipt creation.

### 🎫 Scratch-Off License Key Reveal & Receipt (`/order-success/:orderNumber`)
- **Interactive Scratch Card**: Custom HTML5 Canvas scratch-off surface allowing users to drag/touch to reveal their generated digital game license keys.
- **Single-Click Copy**: One-tap copy to clipboard for instantly pasting keys into digital game launchers.
- **Printable Digital Receipt**: Formatted, print-ready order summary with itemized tax and pricing breakdown.

---

## 🛠 Tech Stack & Architecture

### Frontend (`/client`)
- **Framework**: Angular 17.3 (Standalone Components & Signals)
- **Styling**: Tailwind CSS 3.4 + Custom SCSS Keyframe Animations
- **State Management**: Reactive Angular Signals (`CartService`, `ToastService`)
- **HTTP**: HttpClient with server proxy routing (`proxy.conf.json`)
- **Routing**: Angular Router with lazy-loaded standalone page components

### Backend (`/server`)
- **Runtime**: Node.js 20.x + Express.js 4.18
- **Language**: TypeScript 5.4 (`ts-node-dev` for instant hot-reloading)
- **Database**: SQLite via `better-sqlite3` (High-performance synchronous C++ SQLite binding)
- **Utilities**: CORS, UUID v4 key generator, automated database seeder

---

## 📂 Directory Structure

```
Gaming-studio/
├── package.json              ← Monorepo root scripts (start:server, start:client, seed)
├── .gitignore                ← Workspace root ignore configuration
├── README.md                 ← Comprehensive documentation
├── client/                   ← Angular 17 Frontend Application
│   ├── src/
│   │   ├── app/
│   │   │   ├── core/         ← Services (CartService, GameService, OrderService, ToastService)
│   │   │   ├── pages/        ← Standalone Page Components
│   │   │   │   ├── blog/         ← Devlog reader & postmortems
│   │   │   │   ├── catalog/      ← Search, filters, & 3D tilt grid
│   │   │   │   ├── checkout/     ← 3D flip card & payment simulator
│   │   │   │   ├── game-detail/  ← Lightbox gallery & detailed specs
│   │   │   │   ├── home/         ← Particle hero & featured games
│   │   │   │   ├── order-success/← Canvas scratch-off key reveal
│   │   │   │   └── studio/       ← Milestone timeline & engine stack
│   │   │   └── shared/       ← Reusable Components (Navbar, Cart Drawer, Toast, Game Card)
│   │   ├── assets/           ← Graphics & static icons
│   │   └── styles.scss       ← Tailwind imports & custom SCSS design system
│   ├── tailwind.config.js    ← Tailwind configuration & custom theme extensions
│   ├── proxy.conf.json       ← API proxy forwarding /api/* to http://localhost:3000
│   └── package.json
└── server/                   ← Express API Backend
    ├── src/
    │   ├── controllers/      ← Request handlers (games.controller, orders.controller)
    │   ├── db/               ← SQLite client setup & seed data script (`seed.ts`)
    │   ├── routes/           ← Express router modules (`games.routes`, `orders.routes`)
    │   └── index.ts          ← Server bootstrap & Express middleware
    ├── data/                 ← SQLite database storage directory (`gaming-studio.db`)
    └── package.json
```

---

## ⚡ Quick Start Guide

### Prerequisites
- **Node.js**: `v18.x` or `v20.x` or higher
- **npm**: `v9.x` or higher

### 1. Clone the Repository

```bash
git clone https://github.com/ayush-studio/gaming-studio.git
cd gaming-studio
```

### 2. Install All Dependencies

Install client and server dependencies using the root convenience script:

```bash
npm run install:all
```

*Or manually in both directories:*
```bash
cd server && npm install
cd ../client && npm install
```

### 3. Seed the Database

The database initializes automatically on server start, but you can explicitly seed/reset all 12 games and blog posts:

```bash
npm run seed
```

### 4. Start the Application

Run the backend API server and frontend Angular dev server in separate terminals:

**Terminal 1 — Backend API Server (Port 3000):**
```bash
npm run start:server
```

**Terminal 2 — Frontend Angular App (Port 4200):**
```bash
npm run start:client
```

Open your browser and navigate to **`http://localhost:4200`**.

---

## 🎮 Catalog & Seeded Games

Nexus Forge comes pre-populated with **12 complete indie titles**, each containing high-res banner art, screenshots, developer logs, system requirements, and pricing:

| ID | Title | Genre | Price | Badge | Rating |
|---|---|---|---|---|---|
| 1 | **Apex Drifter 2D** | Racing | \$14.99 | Best Seller | 4.9 ★ |
| 2 | **Protocol: Agents** | Strategy | \$19.99 | Staff Pick | 4.8 ★ |
| 3 | **CyberPulse 2099** | Action | \$24.99 | New Release | 4.7 ★ |
| 4 | **Void Horizons** | Simulation | \$29.99 | Best Seller | 4.9 ★ |
| 5 | **Mythic Runes** | RPG | \$18.99 | Staff Pick | 4.6 ★ |
| 6 | **ChronoShift** | Puzzle | \$12.99 | Early Access | 4.5 ★ |
| 7 | **Iron Siege** | Strategy | \$21.99 | Best Seller | 4.7 ★ |
| 8 | **Shadow Realm: Origins** | RPG | \$27.99 | New Release | 4.8 ★ |
| 9 | **Neon Overdrive** | Racing | \$16.99 | Early Access | 4.4 ★ |
| 10 | **Aetheria: Sky Islands** | Simulation | \$22.99 | Staff Pick | 4.9 ★ |
| 11 | **Bio-Hazard Protocol** | Horror | \$19.99 | New Release | 4.6 ★ |
| 12 | **Subzero Odyssey** | Adventure | \$15.99 | Staff Pick | 4.7 ★ |

---

## 🔌 REST API Reference

The backend exposes a JSON REST API running at `http://localhost:3000/api`.

### Games Endpoints

| Method | Endpoint | Query Parameters | Description |
|---|---|---|---|
| `GET` | `/api/games` | `search`, `genre`, `badge`, `sortBy`, `minPrice`, `maxPrice` | Retrieve games matching filters |
| `GET` | `/api/games/:slug` | — | Retrieve single game detail by unique slug |
| `GET` | `/api/games/featured/list` | — | Retrieve top featured game titles for Hero banner |

### Orders & Checkout Endpoints

| Method | Endpoint | Request Body | Description |
|---|---|---|---|
| `POST` | `/api/orders/checkout` | `{ items: [{ gameId, quantity }], paymentDetails: {...} }` | Process order & generate UUID license keys |
| `GET` | `/api/orders/:orderNumber` | — | Fetch order details, receipt info, & license keys |

### Sample Checkout Request Body
```json
{
  "customerName": "Ayush Developer",
  "customerEmail": "ayush@example.com",
  "items": [
    { "gameId": 1, "quantity": 1 },
    { "gameId": 4, "quantity": 2 }
  ],
  "payment": {
    "cardNumber": "**** **** **** 4242",
    "cardHolder": "Ayush Developer"
  }
}
```

---

## 🎨 Key Architectural Highlights

### 1. Signal-Based Shopping Cart (`CartService`)
```typescript
// Angular Signals state implementation snippet
export class CartService {
  private cartItems = signal<CartItem[]>(this.loadInitialCart());
  
  readonly items = this.cartItems.asReadonly();
  readonly itemCount = computed(() => this.cartItems().reduce((acc, item) => acc + item.quantity, 0));
  readonly subtotal = computed(() => this.cartItems().reduce((acc, item) => acc + (item.game.price * item.quantity), 0));
  readonly tax = computed(() => this.subtotal() * 0.08);
  readonly total = computed(() => this.subtotal() + this.tax());
}
```

### 2. Canvas Scratch-Off Key Reveal
The order confirmation page uses a HTML5 2D Canvas context with `globalCompositeOperation = 'destination-out'` to simulate a scratch-off lottery ticket for game key activation.

---

## 📄 License

Distributed under the **MIT License**. See `LICENSE` for more information.

---

<p center="align">
  Crafted with ❤️ by <strong>Nexus Forge Team</strong> & <strong>Ayush</strong>
</p>
