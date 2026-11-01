# Velora - Full E-commerce Project (React + Express + MongoDB + Docker)

A complete online store built for practicing Docker and Docker Compose.

## Features
**Customers:** browse products, search, filter by category and price, sort, pagination, product page,
shopping cart (saved in the browser), register / login (JWT), checkout with shipping details,
cash-on-delivery or simulated card payment, order history, cancel pending orders.

**Admin panel (/admin):** dashboard (revenue, orders, customers, low stock), create / edit / delete products,
view all orders and change their status (pending, paid, shipped, delivered, cancelled).

**Backend rules:** prices are always read from the database (the client can't cheat), stock is reserved
atomically when ordering and restored on cancellation, free shipping from $100, passwords hashed with bcrypt.

## Run
1. Install and start Docker Desktop.
2. (Optional) Copy `.env.example` to `.env` and change the demo credentials.
3. In this folder, run `docker compose up --build`.
4. Open http://localhost:3000

Compose starts MongoDB, the Express API, and the React frontend. MongoDB data is kept in a named
volume. On its first start, the database is filled with 20 demo products and an admin account:

| Role | Email | Password |
|---|---|---|
| Admin | admin@shop.com | Admin12345 |
| Customer | register your own from the site | |

Stop: `Ctrl + C`, then `docker compose down`. Add `-v` to also delete the database data (it re-seeds on next start).

Check service status with `docker compose ps`, API/database connectivity with
`http://localhost:5000/api/health`, and logs with `docker compose logs -f`.

## Project structure
```
ecommerce-docker/
├── docker-compose.yml        # 3 services: mongo, backend, frontend
├── .env.example              # example DB credentials, JWT secret, admin account
├── database/
│   ├── Dockerfile            # FROM mongo:7 + init scripts
│   └── init/
│       └── 01-create-app-user.js   # limited user for the backend (runs once)
├── backend/
│   ├── Dockerfile
│   ├── package.json
│   └── src/
│       ├── server.js         # Express app + MongoDB connection (with retry)
│       ├── config.js         # reads environment variables
│       ├── seed.js           # demo products + admin user
│       ├── utils.js
│       ├── models/           # User, Product, Order (Mongoose)
│       ├── middleware/       # auth (JWT + admin), error handler
│       └── routes/           # auth, products, orders, admin
└── frontend/
    ├── Dockerfile            # multi-stage: build with Node, serve with Nginx
    ├── nginx.conf            # serves React + proxies /api to the backend
    ├── package.json
    └── src/
        ├── App.jsx, main.jsx, api.js, styles.css
        ├── context/          # AuthContext, CartContext
        ├── components/       # Navbar, ProductCard, ProtectedRoute, ...
        └── pages/            # Home, Products, ProductDetails, Cart, Checkout,
                              # Login, Register, Orders, OrderDetails, admin/*
```

## Docker architecture
| Service | Image / Build | Host port | Notes |
|---|---|---|---|
| mongo | `./database/Dockerfile` (based on `mongo:7`) | none (private) | data in volume `mongo-data`, healthcheck, init scripts |
| backend | `./backend/Dockerfile` | 5000 | waits for mongo to be healthy; seeds demo data |
| frontend | `./frontend/Dockerfile` | 3000 | Nginx proxies `/api` to `backend:5000` |

All services share the `app-network` network and reach each other by service name (`mongo`, `backend`).
Compose reads optional overrides from `.env`; defaults are for local learning only. Change
`JWT_SECRET` and the passwords before using this anywhere real.

The `mongo-data` named volume persists database files when containers are removed. The backend source
is bind-mounted from `./backend/src` to `/app/src`, and Node restarts the server when those files
change. The frontend and database application files are still copied into their images.

## API overview
| Method | Endpoint | Access |
|---|---|---|
| POST | /api/auth/register, /api/auth/login | public |
| GET | /api/auth/me | logged in |
| GET | /api/products (search, category, sort, minPrice, maxPrice, page) | public |
| GET | /api/products/categories, /api/products/:id | public |
| POST / PUT / DELETE | /api/products, /api/products/:id | admin |
| POST | /api/orders | logged in |
| GET | /api/orders/mine, /api/orders/:id | owner (or admin) |
| PUT | /api/orders/:id/cancel | owner, pending orders only |
| GET | /api/orders | admin |
| PUT | /api/orders/:id/status | admin |
| GET | /api/admin/stats | admin |
| GET | /api/health | public |

## Useful commands
- `docker compose ps` list services
- `docker compose logs -f backend` follow backend logs
- `docker compose exec mongo mongosh -u admin -p secret123 --authenticationDatabase admin shopdb`
- `docker compose up --build -d` rebuild and run in the background
- `docker compose build --no-cache frontend` rebuild one service from scratch

## Practice ideas
1. `docker compose down`, then up again: orders and products survive (volume). Then try `down -v`.
2. Change the frontend host port from 3000 to 8080 in `docker-compose.yml`.
3. Add an `adminer` or `mongo-express` service to browse the database in a web page.
4. Bind-mount the frontend source in a development Compose override for hot reload.
5. Add a Redis service and cache `/api/products/categories`.

## Notes
- Card payment is a simulation. For real payments integrate a gateway such as Stripe.
- Product photos are optional: without an image URL the shop shows the product emoji. Admins can paste image URLs.
