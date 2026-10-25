# PulseTech Admin Dashboard

> A role-protected operations dashboard for the PulseTech e-commerce platform, built with **Next.js 16**, **React 19**, and **TypeScript**.

[![Storefront](https://img.shields.io/badge/Storefront-PulseTech-E60023)](https://github.com/VuIceTea/PulseTech)
[![Backend](https://img.shields.io/badge/Backend-Spring_Boot-6DB33F?logo=springboot&logoColor=white)](https://github.com/VuIceTea/PulseTech-Backend)

## Overview

PulseTech Admin is a standalone management application connected to the same Spring Cloud Gateway used by the storefront. Administrator sessions are validated with JWT and the `ADMIN` role before protected screens or management APIs are available.

### Dashboard and analytics

- Live revenue, cost-of-goods, and net-profit metrics calculated from completed orders.
- Counts for orders, products, pending fulfillment, warranties, and returns.
- Weekly sales visualization and direct navigation from dashboard summary cards.
- Skeleton loading states instead of temporary or hard-coded dashboard values.

### Catalog and inventory

- Product CRUD with required-field validation and consistent toast feedback.
- Category-aware technical specifications for phones, tablets, laptops, audio devices, chargers, cases, watches, and accessories.
- Color and storage/variant management with variant-level price offsets and stock.
- Rich product article editor, image management, discounts, filters, and featured-product controls.
- IMEI assignment and warranty registration for serialized products.
- Inventory ledger recording sales, cancellations, returns, and manual adjustments with before/after stock.

### Orders and after-sales operations

- Searchable/filterable order list with customer, payment, amount, date, and progress information.
- Order-detail and fulfillment workflow with guarded status transitions.
- Shipping carrier/tracking data and IMEI assignment during fulfillment.
- Warranty records searchable by IMEI, customer, phone, email, or order.
- Return/refund approval flow with automatic stock restoration.

### Customers and promotions

- Customer detail view with formatted join dates and account information.
- Account lock/unlock, role assignment, and account deletion through admin APIs.
- Product and shipping voucher types with date windows, order thresholds, global usage limits, and per-customer quantities.
- Voucher distribution to all customers or selected customers; repeated issuance increases the customer's available count.
- Flash-sale campaign management by schedule, sale price, and sales quantity.

## Interface Preview

All screenshots below were captured from the local admin application at `http://localhost:5000` using live backend data.

### Access and business overview

| Admin login | Live dashboard |
|---|---|
| ![PulseTech Admin login](docs/screenshots/login.png) | ![PulseTech Admin dashboard](docs/screenshots/dashboard.png) |

### Commerce operations

| Product and variant management | Order fulfillment |
|---|---|
| ![PulseTech Admin products](docs/screenshots/products.png) | ![PulseTech Admin orders](docs/screenshots/orders.png) |

| Warranty and IMEI management | Returns and refunds |
|---|---|
| ![PulseTech Admin warranties](docs/screenshots/warranties.png) | ![PulseTech Admin returns](docs/screenshots/returns.png) |

### Inventory and campaigns

| Flash-sale campaigns | Inventory movement log |
|---|---|
| ![PulseTech Admin flash sales](docs/screenshots/flash-sales.png) | ![PulseTech Admin inventory logs](docs/screenshots/inventory-logs.png) |

### Customers and vouchers

| Customer account administration | Voucher management |
|---|---|
| ![PulseTech Admin customers](docs/screenshots/customers.png) | ![PulseTech Admin vouchers](docs/screenshots/vouchers.png) |

The customer shopping experience is documented in the [PulseTech Storefront repository](https://github.com/VuIceTea/PulseTech#interface-preview).

## End-to-End Order Visibility

The following screenshots were captured after a customer completed Stripe test checkout for order `PT843205`. Personally identifying fields are replaced with demo values before the images are saved.

| Live order queue | Order detail received by admin |
|---|---|
| ![Paid Stripe order in admin queue](docs/screenshots/demo/03-orders.png) | ![Customer, payment, item, and variant details](docs/screenshots/demo/10-order-detail.png) |

| Dashboard after checkout | Inventory movement history |
|---|---|
| ![Live business dashboard](docs/screenshots/demo/01-dashboard.png) | ![Auditable inventory changes](docs/screenshots/demo/09-inventory-logs.png) |

For each order, administrators receive the order ID and creation time; customer name, email, phone, and delivery address; payment method and current status; product image, color, storage variant, quantity, unit price, discounts, shipping, and total. The same transaction also updates the customer order history, clears the paid cart, decreases only the purchased variant's stock, and becomes available for fulfillment, shipping/tracking, IMEI assignment, warranty, return, and refund workflows.

### Complete operations gallery

| Products | Customers | Vouchers |
|---|---|---|
| ![Product management](docs/screenshots/demo/02-products.png) | ![Customer administration](docs/screenshots/demo/04-customers.png) | ![Voucher management](docs/screenshots/demo/05-vouchers.png) |

| Warranties | Returns | Flash sales |
|---|---|---|
| ![Warranty management](docs/screenshots/demo/06-warranties.png) | ![Return management](docs/screenshots/demo/07-returns.png) | ![Flash sale management](docs/screenshots/demo/08-flash-sales.png) |

## Tech Stack

| Area | Technology |
|---|---|
| Framework | Next.js 16 App Router |
| UI | React 19, TypeScript, Tailwind CSS 4 |
| Components | Lucide React, Phosphor Icons, React Select, React Quill |
| Feedback and themes | Sonner, next-themes |
| Authentication | JWT session with role-based access control |
| Backend integration | REST APIs through Spring Cloud Gateway |
| Deployment | Next.js standalone output |

## Admin Routes

| Route | Capability |
|---|---|
| `/login` | Administrator authentication and role validation |
| `/` | Business KPIs and weekly analytics |
| `/products` | Product, variant, specification, image, stock, and IMEI management |
| `/orders` | Order search, details, status, payment, shipping, and fulfillment |
| `/warranties` | Warranty and IMEI records |
| `/returns` | Return/refund review and stock restoration |
| `/flash-sales` | Scheduled flash-sale campaigns |
| `/inventory-logs` | Auditable inventory movements |
| `/customers` | Customer details, roles, and account status |
| `/vouchers` | Voucher creation, rules, usage, and customer distribution |

## Architecture

```text
PulseTech Admin (:5000)
          |
          | /backend-api/*
          v
Spring Cloud API Gateway (:8080)
   |             |              |
   v             v              v
Auth Service  Product Service  Order Service
   |             |              |
   +-------------+--------------+
                 |
              MongoDB
                 |
               Redis
```

## Project Structure

```text
admin/
├── src/
│   ├── app/                    # Dashboard and management routes
│   ├── components/             # Fulfillment and IMEI management dialogs
│   └── lib/adminAuth.ts        # Admin session, JWT headers, and API errors
├── docs/screenshots/           # README interface gallery
├── next.config.ts              # Standalone output and gateway proxy
└── package.json
```

## Local Development

### Prerequisites

- Node.js 20 or newer
- npm 10 or newer
- PulseTech API Gateway running at `http://localhost:8080`
- An account with the `ADMIN` role

### Run the dashboard

```bash
git clone https://github.com/VuIceTea/PulseTech-Admin.git
cd PulseTech-Admin
npm install
npm run dev
```

Open [http://localhost:5000](http://localhost:5000).

### Environment

```env
API_URL=http://localhost:8080/api
```

Requests under `/backend-api/*` are proxied to the configured API Gateway.

### Scripts

| Command | Description |
|---|---|
| `npm run dev` | Start the dashboard on port 5000 |
| `npm run build` | Create the optimized production build |
| `npm run start` | Run the production build on port 5000 |
| `npm run lint` | Run ESLint |

## Related Repositories

- [PulseTech Storefront](https://github.com/VuIceTea/PulseTech)
- [PulseTech Backend](https://github.com/VuIceTea/PulseTech-Backend)

## Security Notes

- Protected pages require a non-expired JWT containing the `ADMIN` role.
- Administrative APIs enforce authorization server-side; hiding UI controls is not treated as access control.
- Never commit `.env`, database connection strings, mail credentials, or payment-provider secrets.
