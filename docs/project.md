# Roach

Roach is a web inventory system for a shop. One deployment serves many shops. Each shop sees only its own products, stock movements, invoices, and alerts. An operator records offline payments and can pause a shop without deleting its data.

This document describes the system as it is in this repository.

## Purpose

A shop needs one place to keep product records, see what is on hand, restock, sell, and look back at what sold. Roach stores that record, prices it from the product's selling price and cost, and warns the shop when quantity is low.

The home page includes sample marketing lines such as "Free Trial 1 Month", "23K Brand Owners", "36K Active Users", and "400+ Partners". Those lines are page copy. They are not counts from the database.

## People

| Person | How they get in | What they can do |
| --- | --- | --- |
| Shop user | Register on the home page | Products, photos, QR labels, restock, checkout, reports, alerts, profile, Report Bug. Access lasts through the trial or the paid-through date. |
| Operator | `ADMIN_EMAIL` and `ADMIN_PASSWORD` | Everything a shop can do, plus the Admin page. The operator account does not expire. |

There is no separate cashier role. The person signed into the shop records the sale.

## A deployment

`docker compose up --build` starts three services:

- The browser uses `http://localhost:8080`.
- Nginx serves the React app and proxies `/api` and `/uploads` to the API.
- Express listens on port 5000 inside the Compose network.
- MongoDB 7 is only on that network. Its data is the `mongo_data` volume.
- Uploaded images are the `uploads_data` volume.

Shops on one deployment share the database and are separated by the signed-in user id. A second organization runs its own Compose stack, its own admin password, and its own volumes.

## Features

### Accounts

- Register with name, email, and a password of at least 6 characters. Email is unique.
- Sign in and sign out. The session is an httpOnly cookie named `token`, valid for one day.
- A failed login does not set that cookie.
- Profile: name, phone, bio, and a profile photo.
- Change password while signed in.
- Forgot password and reset password. The reset link lasts 30 minutes and is emailed only when SMTP is configured. The database stores a SHA-256 hash of the reset token. The raw token is not written to the server log.

### Trial and payment

- A new shop can use Roach for 30 days from registration.
- There is no card payment and no plan catalog. The shop pays the operator in person.
- The operator records the payment on the Admin page. Access then runs for the chosen number of months, default one, starting after the later of today, the current paid-through date, and the trial end. A payment during the trial does not throw away the remaining free days.
- When access ends, the shop can still sign in. Inventory, scan, reports, notifications, and Report Bug answer `Account access is paused`. The products, invoices, movements, and photos remain.
- Block now ends access immediately and does not delete the shop.

### Products

- Create, view, edit, and delete products owned by the signed-in shop.
- Fields: name, category, SKU, selling price, cost, quantity, reorder level, description, benefits, use cases, and an image.
- SKU is generated in the browser from the first three letters of the category plus the current time.
- Category is text typed on the product. There is no separate category setup screen.
- Description, benefits, and use cases are rich text. Benefits and use cases may be left empty.
- Quantity and reorder level are whole numbers. Price and cost are zero or greater. Reorder level defaults to 5. Cost defaults to 0.
- The dashboard lists the shop's products and can filter that list in the browser. Search is not a database query.
- Dashboard cards, computed in the browser from that list: number of products, store value (selling price times quantity), out-of-stock count, and number of distinct categories.

### Photos, camera, and QR

- A product image and a profile photo can be a file upload or a still from the laptop or phone camera. Allowed types are png and jpeg.
- Images are stored on the API disk and served at `/uploads/...`. If all three `CLOUDINARY_*` variables are set, the file is sent to Cloudinary instead and the stored path is that URL.
- Product detail shows a QR code. Its text is `{site origin}/scan/{product id}`. The code can be downloaded as a PNG. It identifies the product. It is not a password. The API still checks the owner and the subscription.
- The Scan page reads that code with the device camera. If the camera is blocked or missing, the same page searches by name or SKU.
- Opening a product from a scan shows restock and checkout. Restock can attach a new photo. Checkout can collect several products into one sale.

### Stock, invoices, and reports

- Restock adds a whole number of units and writes a `restock` movement.
- Checkout sells one or more lines. A line cannot sell more units than are on hand. Each line decreases quantity, writes a `checkout` movement, and becomes a line on one invoice.
- Editing quantity on the product form writes an `adjustment` movement.
- An invoice number looks like `INV-<timestamp>`. Each line keeps the product name, SKU, quantity, selling price, and cost from the moment of the sale.
- Invoice totals: revenue is quantity times selling price, cost is quantity times cost price, profit is revenue minus cost.
- Reports show units sold, revenue, cost, and profit across the shop's invoices, the newest invoices, and the newest stock movements.

### Alerts

- After a product is created, edited, restocked, or sold, Roach checks the quantity.
- Quantity zero creates an out-of-stock notification. Quantity above zero and at or below the reorder level creates a low-stock notification.
- A second unread notification of the same type for the same product is not created. After that notification is read or cleared, or after the quantity has gone back above the reorder level, a later drop can create another one.
- The header bell lists notifications. Each item can be opened, which marks it read and goes to the product. Read all marks every item read. Clear all deletes them.
- When SMTP is configured, the same text is emailed to the shop. If that email fails, the bell item still remains and the stock change is kept.

### Report Bug

The contact page is a form for a signed-in shop whose access is active. It emails `EMAIL_USER` and sets reply-to to the shop's email. The address, phone, and social lines on that page are placeholders, not a live support desk. Without SMTP the form returns `Email services aren't available`.

## Screens

| Path | Who | What it is |
| --- | --- | --- |
| `/` | Anyone | Home |
| `/register`, `/login`, `/forgot` | Anyone | Create an account, sign in, request a reset |
| `/resetpassword/:resetToken` | Anyone with the email link | Choose a new password |
| `/blocked` | Shop whose access has ended | Explains that data is kept and that payment is in person |
| `/dashboard` | Shop or operator | Stats and product list |
| `/add-product` | Shop or operator | New product |
| `/product-detail/:id` | Owner | Detail, rich text, QR code |
| `/edit-product/:id` | Owner | Edit product |
| `/scan` | Shop or operator | Camera scan or search |
| `/stock/:id` | Owner | Restock or add to checkout |
| `/checkout` | Shop or operator | Review the cart and record the invoice |
| `/reports` | Shop or operator | Sales totals, invoices, movements |
| `/invoice/:id` | Owner | One invoice |
| `/admin` | Operator only | Shops, payments, block |
| `/profile`, `/edit-profile` | Signed in | Profile and password |
| `/contact-us` | Shop with access | Report Bug |

The sidebar shows Dashboard, Add Product, Scan, Reports, Account, and Report Bug. Admin appears only for the operator.

## Security

- Passwords are hashed with bcrypt before they are stored. Other user and product fields are ordinary database values. This version does not encrypt every field.
- The session cookie is httpOnly. On this HTTP stack `COOKIE_SECURE` is false and `SameSite` is `Lax`. Behind HTTPS, set `COOKIE_SECURE=true`. The cookie is then `Secure` and `SameSite=None`.
- Product, stock, invoice, notification, and contact routes require the cookie and an active trial, a current paid-through date, or the operator role.
- A shop cannot read another shop's products by guessing an id.
- `JWT_SECRET` signs the session. Replace it before anyone else depends on the deployment.

## Data

| Record | What it holds |
| --- | --- |
| User | Name, unique email, password hash, photo, phone, bio, role (`user` or `admin`), trial end, paid-through date |
| Product | Owner, name, SKU, category, quantity, selling price, cost, reorder level, description, benefits, use cases, image |
| Stock movement | Owner, product, name, SKU, type (`restock`, `checkout`, `adjustment`), quantity change, quantity after, unit price, unit cost, note |
| Invoice | Owner, number, line snapshots, revenue, cost, profit, note |
| Notification | Owner, product, type (`low_stock` or `out_of_stock`), title, body, read flag |
| Payment | Shop, months credited, optional amount, note, which operator recorded it, resulting paid-through date |
| Token | Password-reset hash and expiry. Not the session. |

Images live in the uploads volume, or in Cloudinary when those variables are set. The database stores the path or URL.

## Not in this version

- A card payment gateway or a list of priced plans.
- A category catalog separate from the product.
- A backup job inside the app. The operator copies the database volume and the uploads volume. Steps are in [operations.md](operations.md).
- Encryption of every customer field. Only the password is hashed.
- Live chat, a chatbot, or a native mobile app.
- An IoT device protocol. The camera and QR features use the browser on a laptop or phone.

## Where to go next

- [guide.md](guide.md) — how a shop and an operator use the screens.
- [architecture.md](architecture.md) — services, cookie, and records.
- [data-flow.md](data-flow.md) — how data moves through the system.
- [api.md](api.md) — HTTP routes.
- [operations.md](operations.md) — run it for other people, including backup and restore.
- [development.md](development.md) — run the API and the React dev server without Compose.
