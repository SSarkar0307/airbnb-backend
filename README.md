# Property-Tenancy Backend (v2)

A Node.js + Express + MongoDB backend for a Property Tenancy app. v2 turns the single-host setup into a multitenant platform with bookings and role-based access.

## Features

- **Multitenant home ownership** — multiple home owners sign up, list their own homes, and each home carries its owner's details when guests view it.
- **Booking** — guests book a home with a simple click-and-confirm (no payment flow) and can unbook anytime.
- **Booking track records** — each home owner sees a detailed record of which guest booked which of their homes and when.
- **Favourites** — guests can save and remove favourite homes.
- **Three roles**
  - `guest` — browse, book/unbook, manage favourites.
  - `host` (home owner) — list/edit/delete their own homes, view their bookings.
  - `superAdmin` — platform-wide oversight of all users, homes, and bookings.
- **Session-based auth** — login state stored in MongoDB-backed sessions.

## API reference

All endpoints, request bodies, roles, and error responses are documented in [API.md](./API.md).

## Tech stack

Node.js, Express, MongoDB (Mongoose), express-session with connect-mongodb-session.

## Configuration

The app reads these environment variables (see [.env.example](./.env.example)):

| Variable | Default | Purpose |
| --- | --- | --- |
| `PORT` | `3001` | Port the server listens on. |
| `MONGODB_URI` | Atlas fallback in code | MongoDB connection string. |
| `SESSION_SECRET` | `secret_key` | Secret used to sign session cookies. |

## Running the app

### With Docker (recommended — app + MongoDB bundled)

```bash
docker compose up --build
```

This starts the API and a local MongoDB with a persistent volume. The app is available at `http://localhost:3001`.

To use MongoDB Atlas instead of the bundled Mongo, override `MONGODB_URI` in `docker-compose.yml` (or via an env file) and remove the `mongo` dependency.

To run just the image against an external database:

```bash
docker build -t property-tenancy-backend .
docker run -p 3001:3001 -e MONGODB_URI="<your-mongo-uri>" -e SESSION_SECRET="<random>" property-tenancy-backend
```

### Without Docker

Requirements: Node.js 18+ and a reachable MongoDB instance (local or Atlas).

```bash
npm install
```

Set your environment variables (copy `.env.example` to `.env` and adjust, or export them in your shell), then start the server:

```bash
npm start
```

`npm start` runs the app with nodemon for live reload during development. The server listens on `http://localhost:3001` (or your `PORT`).

## Project structure

```
app.js              # Express app setup, middleware, route mounting, server start
controllers/        # auth, store (guest), host, admin, errors
models/             # user, home, booking, favourite (Mongoose schemas)
routes/             # authRouter, storeRouter, hostRouter, adminRouter
utils/              # database URI and path helpers
public/             # static assets
```
