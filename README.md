# Roach

Roach is a web app for keeping a private product inventory. Each account sees only its own products. You can register, sign in, add products with an image, search the list, edit or delete items, and update a profile.

The browser talks to one origin. Nginx serves the React app and forwards `/api` and `/uploads` to the Express API. The API stores users, products, and password-reset tokens in MongoDB.

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

Register an account from the home page. Forgot-password and Report Bug stay inactive until SMTP variables are set. Product images are stored on the API disk unless Cloudinary variables are set.

Copy [.env.example](.env.example) to `.env` in this folder to override the defaults in [docker-compose.yml](docker-compose.yml). Do not commit `.env`.

| Variable | Purpose |
| --- | --- |
| `JWT_SECRET` | Signs the session cookie. Change this before any shared deployment. |
| `FRONTEND_URL` | Origin allowed by CORS, and the base of password-reset links. Default `http://localhost:8080`. |
| `COOKIE_SECURE` | `false` for this HTTP stack. Set `true` only behind HTTPS. |
| `EMAIL_HOST`, `EMAIL_USER`, `EMAIL_PASS` | SMTP for password reset and Report Bug. |
| `CLOUDINARY_CLOUD_NAME`, `CLOUDINARY_API_KEY`, `CLOUDINARY_API_SECRET` | Optional. When all three are set, images go to Cloudinary instead of disk. |

Stop the stack with `docker compose down`. Database and upload volumes remain until `docker compose down -v`.

## App routes

| Path | Page |
| --- | --- |
| `/` | Home |
| `/register`, `/login`, `/forgot` | Account access |
| `/resetpassword/:resetToken` | Set a new password from an email link |
| `/dashboard` | Inventory stats and item list |
| `/add-product` | Create a product |
| `/product-detail/:id` | Product detail |
| `/edit-product/:id` | Edit a product |
| `/profile`, `/edit-profile` | Profile |
| `/contact-us` | Report Bug |

API details are in [docs/api.md](docs/api.md). Layout and data model are in [docs/architecture.md](docs/architecture.md). Running the frontend and API without Docker is in [docs/development.md](docs/development.md).
