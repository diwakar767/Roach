# Local development

Compose is the supported way to run every part together. Use this page when you want the React dev server and the API on the host.

## API

```bash
cd backend
npm ci
```

Create `backend/.env`:

```text
MONGO_URI=mongodb://127.0.0.1:27017/roach
JWT_SECRET=local-dev-secret-change-me
FRONTEND_URL=http://localhost:3000
COOKIE_SECURE=false
PORT=5000
EMAIL_HOST=
EMAIL_USER=
EMAIL_PASS=
CLOUDINARY_CLOUD_NAME=
CLOUDINARY_API_KEY=
CLOUDINARY_API_SECRET=
```

MongoDB must already be listening on port 27017. Then:

```bash
npm start
```

`npm start` runs `node server.js`. The `backend` script name in `package.json` calls `nodemon`, which is not installed by default.

## Frontend

```bash
cd frontend
npm ci
```

Create `frontend/.env`:

```text
REACT_APP_BACKEND_URL=http://localhost:5000
```

`REACT_APP_*` values are read when the dev server or production build starts. An empty value makes the app call `/api` on the same origin, which is what the Docker build uses.

```bash
npm start
```

The dev server listens on port 3000. The API CORS list includes `http://localhost:3000` and `FRONTEND_URL`.

## Notes

- Do not commit `.env` files, the `uploads` image files, or the `.ai` folder.
- `COOKIE_SECURE=false` is required for login on plain HTTP. A `Secure` cookie is dropped by the browser on `http://localhost`.
- Forgot-password links use `FRONTEND_URL`, so that value must be the origin you open in the browser.
