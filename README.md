# Roach

Roach is a web app for a shop's private inventory. Each account sees only its own products. A shop can register, sign in, add products with a photo or a camera still, print a QR code, scan that code to restock or sell, and read invoices and stock alerts.

The browser talks to one origin. Nginx serves the React app and forwards `/api` and `/uploads` to the Express API. The API stores accounts, products, movements, invoices, notifications, and password-reset tokens in MongoDB.

A new shop can use the app for 30 days. After that, access is paused until an operator records an offline payment for another month. Pausing access does not delete the shop's data.

Read this first if you are new to the repository:

- [docs/project.md](docs/project.md) — what Roach is, every feature, the records it stores, and what this version does not do.
- [docs/guide.md](docs/guide.md) — how a shop and an operator use the screens.
- [docs/architecture.md](docs/architecture.md) — services and data model.
- [docs/data-flow.md](docs/data-flow.md) — data-flow diagrams for sign-in, stock, QR checkout, alerts, and access.
- [docs/api.md](docs/api.md) — HTTP routes.
- [docs/operations.md](docs/operations.md) — run a deployment for other people, including backup and restore.
- [docs/development.md](docs/development.md) — run the API and React dev server without Compose.

## Stack

- React 18, Redux Toolkit, React Router 6
- Express 4, Mongoose 6, JWT in an httpOnly cookie
- MongoDB 7
- Docker Compose

## Run the whole app

Docker Desktop must be running.

```bash
docker compose up --build
```

Open [http://localhost:8080](http://localhost:8080).

Register a shop from the home page. The local operator account is `admin@example.com` / `change-me-admin` unless you override it. That account opens the Admin page.

Forgot-password and Report Bug show `Email services aren't available` until SMTP variables are set. Stock alerts still appear on the bell. Product images are stored on the API disk unless Cloudinary variables are set.

Copy [.env.example](.env.example) to `.env` and change `ADMIN_EMAIL` and `ADMIN_PASSWORD` before other people use this deployment. Compose reads `.env` on `docker compose up`. You do not rebuild the app to change those values. Recreate the containers after an edit. The admin password is stored when that account is first created. Do not commit `.env`.

| Variable | Purpose |
| --- | --- |
| `JWT_SECRET` | Signs the session cookie. Change this before any shared deployment. |
| `FRONTEND_URL` | Origin allowed by CORS, and the base of password-reset links. Default `http://localhost:8080`. |
| `COOKIE_SECURE` | `false` for this HTTP stack. Set `true` only behind HTTPS. |
| `EMAIL_HOST`, `EMAIL_USER`, `EMAIL_PASS` | SMTP. All three are required. Used for password reset, Report Bug, and a copy of stock alerts. |
| `ADMIN_EMAIL`, `ADMIN_PASSWORD` | Operator account created on startup if it does not exist. Defaults `admin@example.com` / `change-me-admin`. |
| `CLOUDINARY_CLOUD_NAME`, `CLOUDINARY_API_KEY`, `CLOUDINARY_API_SECRET` | Optional. When all three are set, images go to Cloudinary instead of disk. |

Stop the stack with `docker compose down`. Database and upload volumes remain until `docker compose down -v`.

Hosting this stack for other shops, including backup and restore, is described in [docs/operations.md](docs/operations.md).

## App routes

| Path | Page |
| --- | --- |
| `/` | Home |
| `/register`, `/login`, `/forgot` | Account access |
| `/resetpassword/:resetToken` | Set a new password from an email link |
| `/blocked` | Shown when the free month has ended and no payment is recorded |
| `/dashboard` | Inventory stats and item list |
| `/add-product` | Create a product |
| `/product-detail/:id` | Product detail and QR code |
| `/edit-product/:id` | Edit a product |
| `/scan` | Camera QR scan, or search, then restock or sell |
| `/stock/:id` | Restock or add the product to checkout |
| `/checkout` | Review a sale and record the invoice |
| `/reports` | Units sold, revenue, cost, profit, invoices, stock movements |
| `/invoice/:id` | One invoice |
| `/admin` | Operator page for trials and offline payments |
| `/profile`, `/edit-profile` | Profile |
| `/contact-us` | Report Bug |

The route table above is the screen list. How to use each one is in [docs/guide.md](docs/guide.md).
