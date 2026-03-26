# Eventora Backend

This backend is designed for your Eventora React app and can live in a `backend` folder outside `src`.

## Folder structure

```text
project-root/
  src/
    components/
    App.js
    ...
  backend/
    package.json
    server.js
    .env.example
    src/
      config/
      controllers/
      middleware/
      models/
      routes/
      scripts/
      utils/
```

## Main features

- attendee and organizer auth
- organizer-only event management
- public event listing and event detail endpoints
- seat map endpoint for seat selection
- booking creation endpoint
- my bookings endpoint for ticket history
- organizer dashboard stats endpoint

## Quick start

1. Create a folder named `backend` beside your frontend `src` folder.
2. Copy all files from this package into that `backend` folder.
3. Inside `backend`, run:

```bash
npm install
```

4. Create `.env` from `.env.example`.
5. Start MongoDB locally or use MongoDB Atlas.
6. Run the backend:

```bash
npm run dev
```

Server URL will be:

```text
http://localhost:5000
```

## Seed demo data

```bash
npm run seed
```

Demo users after seeding:

- organizer@eventora.com / 123456
- attendee@eventora.com / 123456

## API routes

### Auth
- `POST /api/auth/register`
- `POST /api/auth/login`
- `GET /api/auth/me`

### Events
- `GET /api/events`
- `GET /api/events/:id`
- `GET /api/events/:id/seats`

### Bookings
- `POST /api/bookings`
- `GET /api/bookings/my`
- `GET /api/bookings/:id`

### Organizer
- `GET /api/organizer/dashboard`
- `GET /api/organizer/events`
- `POST /api/organizer/events`
- `PATCH /api/organizer/events/:id`

## Example request bodies

### Register
```json
{
  "name": "Moeez",
  "email": "moeez@example.com",
  "password": "123456",
  "role": "attendee"
}
```

### Login
```json
{
  "email": "moeez@example.com",
  "password": "123456"
}
```

### Create booking
```json
{
  "eventId": "PUT_EVENT_ID_HERE",
  "selectedSeats": ["P_A1", "P_A2"],
  "email": "moeez@example.com"
}
```

### Create organizer event
```json
{
  "title": "Neon Pop Bash",
  "category": "Music",
  "venue": "Rafay Concert Arena",
  "city": "Lahore",
  "description": "Pop concert",
  "bannerEmoji": "🎵",
  "eventDate": "2026-04-23T19:00:00.000Z",
  "gateOpens": "6:00 PM",
  "status": "upcoming"
}
```

## Frontend integration notes

Your current React pages still use hardcoded data. To make the full app dynamic, connect these pages next:

- `EventoraAuth` → `/api/auth/login` or `/api/auth/register`
- `Dashboard` → `GET /api/events`
- `EventDetailPage` → `GET /api/events/:id`
- `SeatSelectionPage` → `GET /api/events/:id/seats`
- `SeatSelectionPage` checkout → `POST /api/bookings`
- `BookingConfirmedPage` → booking response from backend
- `OrganizerDashboard` → `/api/organizer/dashboard` and `/api/organizer/events`

## Important

Do not reuse secrets from your old project. Create fresh values in `.env` for this app.
