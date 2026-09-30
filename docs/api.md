# API

Base path: `/api`. With Docker Compose the browser calls these paths on the same origin as the React app. Cookies are sent with `credentials`.

Errors from the error middleware return JSON `{ "message": "..." }` and an HTTP error status.

## Users

| Method | Path | Auth | Body | Result |
| --- | --- | --- | --- | --- |
| POST | `/api/users/register` | No | `{ name, email, password }` | 201 user fields and sets the session cookie. Password must be at least 6 characters. Email must be unique. |
| POST | `/api/users/login` | No | `{ email, password }` | 200 user fields and sets the session cookie. |
| GET | `/api/users/logout` | Cookie | | Clears the session cookie. |
| GET | `/api/users/loggedin` | Cookie optional | | `true` or `false`. |
| GET | `/api/users/getuser` | Yes | | Current user without the password. |
| PATCH | `/api/users/updateuser` | Yes | `{ name, phone, bio, photo }` | Updated user. Email is not changed by this route. |
| POST | `/api/users/photo` | Yes | multipart field `photo` (png or jpeg) | `{ photo }` URL or `/uploads/...` path. |
| PATCH | `/api/users/changepassword` | Yes | `{ oldPassword, password }` | Text `Password changed successfully`. |
| POST | `/api/users/forgotpassword` | No | `{ email }` | Sends a reset email when SMTP is configured. 503 `Email services aren't available` when it is not. |
| PUT | `/api/users/resetpassword/:resetToken` | No | `{ password }` | Sets a new password when the token is valid and unexpired. |

User JSON includes `role`, `trialEndsAt`, `paidUntil`, and `access` (`trial`, `active`, `blocked`, or `admin`).

Shop routes below require the session cookie and an active trial, a current `paidUntil`, or an admin role. A paused shop receives 403 `Account access is paused`. Records stay in the database.

## Products

Products are limited to `req.user`.

| Method | Path | Body | Result |
| --- | --- | --- | --- |
| POST | `/api/products` | multipart: `name`, `sku`, `category`, `quantity`, `price`, `description`, optional `cost`, `reorderLevel`, `benefits`, `useCases`, `image` | 201 product. |
| GET | `/api/products` | | Array of the current user's products, newest first. |
| GET | `/api/products/:id` | | One product. 404 if missing. 401 if it belongs to someone else. |
| PATCH | `/api/products/:id` | multipart fields, optional new `image` | Updated product. Omitting the image keeps the previous one. A quantity change writes an adjustment movement. |
| DELETE | `/api/products/:id` | | `{ message: "Product Deleted Successfully." }`. |

Quantity and reorder level are whole numbers, zero or greater. Price and cost are zero or greater. `reorderLevel` defaults to 5. `cost` defaults to 0. Benefits and use cases may be empty.

Allowed image types are `image/png`, `image/jpg`, and `image/jpeg`.

## Stock

| Method | Path | Body | Result |
| --- | --- | --- | --- |
| POST | `/api/stock/restock` | multipart: `productId`, `quantity` (whole number, at least 1), optional `note`, optional `image` | 201 updated product. Writes a `restock` movement. |
| POST | `/api/stock/checkout` | `{ lines: [{ productId, quantity }], note? }` | 201 invoice. Decreases each product, writes `checkout` movements. 400 if a line asks for more than the quantity on hand. |
| GET | `/api/stock/movements` | | Up to 50 newest movements for the current user. |

## Reports

| Method | Path | Result |
| --- | --- | --- |
| GET | `/api/reports/summary` | `{ unitsSold, revenue, cost, profit, invoices, movements }`. Totals cover every invoice. Lists are the newest 50. |
| GET | `/api/reports/invoices/:id` | One invoice owned by the current user. |

## Notifications

| Method | Path | Result |
| --- | --- | --- |
| GET | `/api/notifications` | Newest 50 notifications for the current user. |
| PATCH | `/api/notifications/read-all` | Marks all of them read. |
| DELETE | `/api/notifications` | Deletes all of them. |
| PATCH | `/api/notifications/:id/read` | Marks one read. |
| DELETE | `/api/notifications/:id` | Deletes one. |

A stock change creates `low_stock` when quantity is above zero and at or below `reorderLevel`, or `out_of_stock` when quantity is zero. A second unread notification of the same type for the same product is not created. When SMTP is configured, the same text is emailed to the shop user.

## Admin

Requires `role: "admin"`.

| Method | Path | Body | Result |
| --- | --- | --- | --- |
| GET | `/api/admin/users` | | Every account, without passwords, with `access`. |
| POST | `/api/admin/users/:id/payments` | `{ months, amount?, note? }` | Sets `paidUntil` to `months` after the later of now, the current `paidUntil`, and `trialEndsAt`. `months` is an integer from 1 to 36. Default 1. Writes a `Payment` record. |
| POST | `/api/admin/users/:id/block` | | Clears `paidUntil` and sets `trialEndsAt` in the past. Does not delete the user or their products. |

## Contact

| Method | Path | Auth | Body | Result |
| --- | --- | --- | --- | --- |
| POST | `/api/contactus` | Shop with access | `{ subject, message }` | `{ success: true, message: "Email Sent" }` when SMTP accepts the message. 503 `Email services aren't available` when SMTP is not configured. |

## Other

`GET /` on the API process returns the text `Home Page`. Nginx does not expose that path; `/` is the React app.
