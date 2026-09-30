# Frontend

React app for Roach. Setup, Docker, and API notes are in the repository [README](../README.md) and [docs/development.md](../docs/development.md).

```bash
npm ci
npm start
```

Set `REACT_APP_BACKEND_URL` before starting. Use `http://localhost:5000` when the API runs on the host. Leave it empty when the production build is served behind the nginx proxy in Docker.
