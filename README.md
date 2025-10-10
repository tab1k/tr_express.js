# Trucking-Desc-back

## Prerequisites
- Node.js 18+ and npm
- PostgreSQL database
- Redis 4+

## Environment
Copy `.env.example` to `.env` and update the values:
```bash
cp .env.example .env
```
Ensure the PostgreSQL credentials point to the database you created and that `DB_DIALECT=postgres`. If you prefer a different SQL engine, adjust the dialect and install the matching driver.

## Install Dependencies
```bash
npm install
```

## Run Locally
```bash
npm start
```
The API starts on `http://localhost:${PORT}` (default 8585), serves swagger docs at `/api/documentation`, and the AdminJS panel at its configured root path.

## Run with PM2
```bash
pm2 start server.js --name trucking-desk
pm2 logs trucking-desk
```

## Deployment Notes
- Regenerate a production `.env` with secure secrets.
- Use a process manager (PM2/systemd) and reverse proxy (nginx) for production.
- Ensure Redis is reachable via `REDIS_URL` if it is not on the same host.
