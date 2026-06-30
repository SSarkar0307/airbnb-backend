# Airbnb Backend — API Reference (v2)

Base URL: `http://localhost:3001`

Authentication is **session-based** (cookie `connect.sid`). After a successful `POST /auth/login`, the session cookie must be sent with every protected request.

## Roles

| Role | userType value | Description |
| --- | --- | --- |
| Guest | `guest` | Browses homes, books/unbooks, manages favourites. Default role on signup. |
| Home Owner | `host` | Lists/edits/deletes their own homes and views who booked them. |
| Super Admin | `superAdmin` | Platform-wide oversight of all users, homes, and bookings. |

## Access requirement legend

| Tag | Meaning |
| --- | --- |
| Public | No login required. |
| Login | Any authenticated user (`requireLogin`). |
| Guest | Logged in **and** `userType === 'guest'` (`isGuest`). |
| Host | Logged in **and** `userType === 'host'` (`isHost`). |
| SuperAdmin | Logged in **and** `userType === 'superAdmin'` (`isSuperAdmin`). |

---

## Auth APIs

Mounted at `/auth`.

| Method | Endpoint | Access | Purpose | Request body | Success response |
| --- | --- | --- | --- | --- | --- |
| POST | `/auth/signup` | Public | Register a new user. | `firstName`, `lastName`, `email`, `password`, `userType` (`guest` \| `host` \| `superAdmin`) | `201` `{ message, user }` |
| POST | `/auth/login` | Public | Log in and create a session. | `email`, `password` | `200` `{ message, user }` + session cookie |
| POST | `/auth/logout` | Public | Destroy the session and clear the cookie. | — | `200` `{ message }` |
| GET | `/auth/status` | Public | Current login state from the session. | — | `200` `{ loggedIn, userId, userType }` |

**Notes**
- `signup` returns `409` if the email already exists.
- `login` returns `401` for unknown email or wrong password.

---

## Store APIs (guest-facing)

Mounted at root `/`.

| Method | Endpoint | Access | Purpose | Params / Body | Success response |
| --- | --- | --- | --- | --- | --- |
| GET | `/homes` | Public | List all homes (with owner name populated). | — | `200` `{ homes }` |
| GET | `/homes/:homeId` | Public | Home details, including owner name/email. | path `homeId` | `200` `{ home }` |
| GET | `/bookings` | Guest | List the logged-in guest's bookings (home + owner populated). | — | `200` `{ bookings }` |
| POST | `/bookings/:homeId` | Guest | Book a home (click-and-confirm). | path `homeId` | `201` `{ message }` |
| DELETE | `/bookings/:homeId` | Guest | Unbook a home (only the guest's own booking). | path `homeId` | `200` `{ message }` |
| GET | `/favourites` | Guest | List the guest's favourite homes. | — | `200` `{ favourites }` |
| POST | `/favourites/:homeId` | Guest | Add a home to favourites. | path `homeId` | `201` `{ message }` |
| DELETE | `/favourites/:homeId` | Guest | Remove a home from favourites. | path `homeId` | `200` `{ message }` |

**Notes**
- `POST /bookings/:homeId` returns `404` if the home does not exist and `500` if it is already booked by the same guest.
- Booking and favourite endpoints require an authenticated **guest**; other roles get `403`.

---

## Host APIs (home owner)

Mounted at `/host`. All endpoints require **Host** access.

| Method | Endpoint | Access | Purpose | Params / Body | Success response |
| --- | --- | --- | --- | --- | --- |
| GET | `/host/homes` | Host | List only the homes owned by the logged-in host. | — | `200` `{ homes }` |
| GET | `/host/bookings` | Host | Detailed track record of all bookings on the host's homes (home + guest populated, newest first). | — | `200` `{ bookings }` |
| GET | `/host/homes/:homeId` | Host | Fetch one of the host's own homes. | path `homeId` | `200` `{ home }` |
| POST | `/host/homes` | Host | Add a new home (owner set automatically). | `houseName`, `price`, `location`, `rating`, `photoUrl` | `201` `{ message, home }` |
| PUT | `/host/homes/:homeId` | Host | Edit one of the host's own homes. | path `homeId` + same fields as add | `200` `{ message, home }` |
| DELETE | `/host/homes/:homeId` | Host | Delete a home and its related favourites + bookings. | path `homeId` | `200` `{ message }` |

**Notes**
- All home operations are scoped to `owner === session user`. Accessing another host's home returns `404`.

---

## Admin APIs (super admin)

Mounted at `/admin`. All endpoints require **SuperAdmin** access.

| Method | Endpoint | Access | Purpose | Params / Body | Success response |
| --- | --- | --- | --- | --- | --- |
| GET | `/admin/users` | SuperAdmin | List all users (name, email, userType). | — | `200` `{ users }` |
| GET | `/admin/homes` | SuperAdmin | List all homes with owner populated. | — | `200` `{ homes }` |
| GET | `/admin/bookings` | SuperAdmin | List every booking platform-wide (home, owner, and guest populated, newest first). | — | `200` `{ bookings }` |

---

## Common error responses

| Status | When |
| --- | --- |
| `401 Login required` | Protected route accessed without a valid session. |
| `403 Only for Guests / Hosts / Super Admin` | Authenticated, but wrong role for the route. |
| `404 Home not found` / `Route Not Found` | Resource missing or unknown route. |
| `409 User already exists` | Signup with an email that is already registered. |
| `500` | Duplicate booking/favourite or an unexpected server error. |
