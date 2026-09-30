# Operations

One Compose stack is one Roach service. Every shop account on that stack shares the database and is isolated by user id. The platform admin records payments. Shop users do not pay inside the app.

## Local use

```bash
docker compose up --build
```

Open http://localhost:8080.

The local admin is created on API startup from `ADMIN_EMAIL` and `ADMIN_PASSWORD`. The Compose defaults are `admin@example.com` and `change-me-admin`. Sign in there to open `/admin`.

A new shop has 30 days from registration. After that, login still works and the shop sees a paused-access page. Products, invoices, notifications, and uploaded images stay in the database. Record a payment on the admin page to set a paid-through date one month after the later of today, the current paid-through date, and the trial end.

Leave `EMAIL_HOST`, `EMAIL_USER`, and `EMAIL_PASS` empty until you have an SMTP account. Forgot-password and Report Bug then return `Email services aren't available`. Low-stock and out-of-stock alerts still show on the bell. When all three variables are set, those alerts are emailed as well, and password reset and Report Bug send mail.

`COOKIE_SECURE` stays `false` on this HTTP stack.

## Run it as a service

Replace the local defaults before anyone else uses the deployment:

- `JWT_SECRET` — a long random value.
- `ADMIN_EMAIL` and `ADMIN_PASSWORD` — the operator account. The password is applied when that account is first created. Later password changes in the app are kept.
- `FRONTEND_URL` — the public origin, for example `https://inventory.example.com`. Password-reset links use it.
- `COOKIE_SECURE=true` — only after the site is served with HTTPS. The cookie is then `Secure` and `SameSite=None`.
- SMTP variables — so password reset, Report Bug, and stock emails work.
- Put TLS in front of port 8080 (a host reverse proxy or a load balancer). Publish only that proxy. Do not publish MongoDB.

Back up `mongo_data` and `uploads_data` on a schedule you control. Copy those backups off the machine. The app does not run a backup job.

A phone on the same network can open the site and use its camera for QR scan and product photos. The address must be the host the phone can reach, not `localhost` on the phone itself.

## Backup

The database lives in the `mongo_data` volume, database name `roach`. Product and profile images live in the `uploads_data` volume, mounted at `/app/uploads` in the API container.

From the directory that contains `docker-compose.yml`:

```bash
docker compose exec -T mongo mongodump --db roach --archive > roach-db.archive
docker compose cp backend:/app/uploads ./roach-uploads
```

Keep `roach-db.archive` and the `roach-uploads` folder together. They are one backup.

## Restore

Stop the API so it does not write during the restore. MongoDB can stay up.

```bash
docker compose stop backend
docker compose exec -T mongo mongorestore --db roach --drop --archive < roach-db.archive
docker compose cp ./roach-uploads/. backend:/app/uploads
docker compose start backend
```

`--drop` replaces the `roach` database with the archive. The uploads copy replaces files in the volume. Confirm a shop can sign in and open a product image before you continue.

Schedule, retention, and off-site copies are the operator's job for that deployment.
