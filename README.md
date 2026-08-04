# PulseTech Admin Dashboard — Standalone Store Management System

<div align="center">
  <h3>Professional, Real-Time Microservice Control Center for PulseTech E-Commerce Platform</h3>
  <p>Built with Next.js 16 (App Router), TypeScript, Tailwind CSS, Lucide React, and Sonner Toast Notifications.</p>
</div>

---

## 🏗️ Architecture Overview

This project (`D:\admin`) is a **standalone web application** decoupled from the customer-facing Storefront (`D:\frontend`). It connects directly to the **PulseTech Backend Microservices Ecosystem** via Spring Cloud Gateway (`/backend-api`).

```
+---------------------------+       +------------------------------------+
|  PulseTech Admin Web App  | ====> | API Gateway Proxy (/backend-api/*) |
|      (Next.js App)        |       +------------------------------------+
+---------------------------+                         ||
                                                      || routes to
                                                      \/
                     +-----------------------------------------------------------------+
                     |                  Microservice Cloud Cluster                     |
                     |                                                                 |
                     |  - Product Service (:8081) - MongoDB Catalog & Discount API     |
                     |  - Auth Service (:8082)    - JWT Authentication & User Accounts |
                     |  - Order Service (:8083)   - Order Lifecycle & Order Tracking   |
                     +-----------------------------------------------------------------+
```

---

## ✨ Key Administrative Features

1. **Live Executive Dashboard (`/`)**:
   - Real-time aggregation of Total Revenue, Order Volume, Product Catalog count, and Registered Member accounts.
   - Built-in **Microservice Topology Health Monitor** indicating live availability and latency of all core services.
   - Shortcut actions and recent order logs.

2. **Product Catalog & Inventory Management (`/products`)**:
   - Full CRUD support: Add new products, edit existing items, delete discontinued products.
   - Adjust promotional pricing, discounts, stock levels, and product categories (`Điện thoại`, `Laptop`, `Phụ kiện`, `Đồng hồ`).

3. **Order Processing & Fulfillment (`/orders`)**:
   - Track customer orders with full details (shipping address, phone number, VNPay/COD payment methods).
   - Real-time Order Status workflow updates:
     - `1: Pending Confirmation`
     - `2: Processing`
     - `3: Shipping`
     - `4: Successfully Delivered`
     - `5: Cancelled`

4. **Customer Account Administration (`/customers`)**:
   - Inspect registered user accounts from the Auth Service.
   - Account moderation and deletion capabilities.

---

## 🚀 Getting Started

### 1. Prerequisites
- **Node.js** (v18.18+ or v20+)
- **npm** (v9+)

### 2. Installation & Configuration

Install project dependencies:

```bash
npm install
```

### 3. Running Locally

Start the local development server (runs on port **3001** or **3000**):

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) (or the port specified in terminal) in your browser.

### 4. Production Build & Verification

To verify TypeScript types and build standard production bundle:

```bash
npm run build
```

---

## ⚙️ Environment & API Gateway Configuration

The API Proxy rules are configured in `next.config.ts`. By default, API requests starting with `/backend-api/*` are forwarded to:
- Production Vercel/Render API Gateway (`https://pulse-tech-beryl.vercel.app/backend-api`)
- Or Local Spring Cloud Gateway (`http://localhost:8080/api`) if customized via `process.env.API_URL`.

---

## 📄 License
Copyright © 2026 PulseTech Team. All rights reserved.
