# Architecture

```text
Browser  -->  frontend nginx :8080  -->  backend Express :5000  -->  MongoDB
                      |                         |
                      |                         +--> uploads volume (or Cloudinary)
                      +--> static React build
```

The published port is `8080`. MongoDB is not published to the host. Nginx proxies `/api/` and `/uploads/` to the API container and serves every other path from the React build, including client-side routes.

## Authentication

Register and login set an httpOnly cookie named `token`. The JWT expires in one day (`expiresIn: "1d"`). The cookie flags come from `COOKIE_SECURE`:

- `false` (Compose default): `Secure` is off and `SameSite` is `Lax`, so the cookie is stored on `http://localhost`.
- `true`: `Secure` is on and `SameSite` is `None`, for an HTTPS frontend on another site.

Protected routes read `req.cookies.token` and load the user. A failed login does not set the cookie.

Password reset stores a SHA-256 hash of a random token in the `Token` collection. The raw token is emailed as `${FRONTEND_URL}/resetpassword/:resetToken` and expires after 30 minutes. The reset token is not written to the server log.

## Data

`User`: name, unique email, bcrypt password, photo, phone, bio.

`Product`: owner user id, name, sku, category, quantity, price, description, image object, timestamps. Quantity and price are strings. The image object has `fileName`, `filePath`, `fileType`, and `fileSize`. `filePath` is `/uploads/<filename>` on disk, or a Cloudinary URL when Cloudinary credentials are set. Each user can list, read, update, and delete only their own products.

`Token`: user id, hashed reset token, `createdAt`, `expiresAt`. This collection is for password reset, not for the session.

## Images

Multer writes the upload into `backend/uploads` (the `uploads_data` volume in Compose). If `CLOUDINARY_CLOUD_NAME`, `CLOUDINARY_API_KEY`, and `CLOUDINARY_API_SECRET` are all set, the API then uploads that file to Cloudinary and stores the remote URL. Otherwise the browser loads the file through `/uploads/...`.

Profile photos use `POST /api/users/photo` and the same storage path. The default avatar is a placeholder image URL on the user document.

## Email

Nodemailer sends password-reset and Report Bug messages when `EMAIL_HOST`, `EMAIL_USER`, and `EMAIL_PASS` are set. Report Bug requires a logged-in user and sends the message to `EMAIL_USER`.
