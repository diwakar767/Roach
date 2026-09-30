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
| POST | `/api/users/forgotpassword` | No | `{ email }` | Sends a reset email. Needs SMTP env vars. |
| PUT | `/api/users/resetpassword/:resetToken` | No | `{ password }` | Sets a new password when the token is valid and unexpired. |

## Products

All product routes require the session cookie. Products are limited to `req.user`.

| Method | Path | Body | Result |
| --- | --- | --- | --- |
| POST | `/api/products` | multipart: `name`, `sku`, `category`, `quantity`, `price`, `description`, optional `image` | 201 product. |
| GET | `/api/products` | | Array of the current user's products, newest first. |
| GET | `/api/products/:id` | | One product. 404 if missing. 401 if it belongs to someone else. |
| PATCH | `/api/products/:id` | multipart fields, optional new `image` | Updated product. Omitting the image keeps the previous one. |
| DELETE | `/api/products/:id` | | `{ message: "Product Deleted Successfully." }`. |

Allowed image types are `image/png`, `image/jpg`, and `image/jpeg`.

## Contact

| Method | Path | Auth | Body | Result |
| --- | --- | --- | --- | --- |
| POST | `/api/contactus` | Yes | `{ subject, message }` | `{ success: true, message: "Email Sent" }` when SMTP accepts the message. |

## Other

`GET /` on the API process returns the text `Home Page`. Nginx does not expose that path; `/` is the React app.
