# Milemarker Stories — a field guide for curious people

> Find your people. Save their places. Write your own story.

Milemarker Stories is a responsive, full-stack travel journal that turns personal recommendations into a living map of the world. Browse notes from fellow travellers, explore the places behind them, and publish your own discoveries. It is designed as a polished product showcase, with a fully interactive local demo and an optional MongoDB-backed API.

**Repository name candidate:** `milemarker-stories`  ·  **Product:** Milemarker Stories  ·  **Author:** Jahid Khan

![Milemarker Stories travel journal interface](https://images.unsplash.com/photo-1470770841072-f978cf4d019e?auto=format&fit=crop&w=1600&q=85)

## At a glance

| | |
|---|---|
| Experience | Community travel journal with traveller profiles and destination stories |
| Client | React, Context API, custom hooks, React Router |
| API | Node.js, Express, MongoDB, Mongoose, JWT |
| Preview | Local sample content works without a database or API server |
| Configuration | Environment variables; no provider keys committed |

## A small product, thoughtfully built

- **Discover eight editorial field notes:** search by destination, mood, category, or tags, then sort by sample rating or indicative daily budget.
- **Publish a place to Explore:** add a story, travel style, useful details, tags, and up to six photos. New stories show up in discovery immediately.
- **Use the shared photo tools:** drag and drop or choose images, preview and remove them, then browse galleries with arrows, dots, or touch gestures.
- **Keep ownership clear:** only the author sees edit and delete actions, and the API checks ownership on both operations.
- **Save places:** build a personal shortlist that stays in this browser.
- **Plan a route:** add and reorder destinations on a trip board, see indicative duration and spend, and export the plan as a text file.
- **Share a note:** use the device share sheet or copy a link, and open destinations in Maps.
- **Explore the community:** browse traveller profiles and open each person's place collection.
- **Read destination stories:** view photography, addresses, best seasons, local tips, and map links; open a story to edit it.
- **Create and manage places:** add, update, and delete your own recommendations.
- **Sign in or create an account:** the API supports password hashing and expiring JWT sessions.
- **Try the demo immediately:** sample travellers and destinations load when the local API is unavailable. Demo edits, saved places, and trip boards persist in browser storage.
- **Use it anywhere:** responsive layouts, accessible labels, reduced clutter, and touch-friendly controls across phone, tablet, and desktop sizes.

## Quick start

### Frontend preview (no backend required)

```bash
cd frontend
npm install
npm start
```

Open `http://localhost:3000`. Milemarker Stories starts with sample stories and uses a browser-local preview when its API cannot be reached. The preview is intended for presentation; it is not a production identity or storage system. Sign-up in preview mode uses the first sample profile. Destination budgets, ratings, seasons, and story copy are illustrative sample content, not live travel advice or verified prices.

### Full stack

1. Install dependencies in both `frontend` and `backend`.
2. Create `backend/.env` using the example below and provide a MongoDB connection string and a long random JWT secret.
3. Start the API with `npm start` in `backend` and the client with `npm start` in `frontend`.

```dotenv
PORT=5000
MONGODB_URI=mongodb://127.0.0.1:27017/milemarker-stories
JWT_SECRET=replace-with-a-long-random-secret
CLIENT_ORIGIN=http://localhost:3000
```

Optionally set `REACT_APP_API_URL=http://localhost:5000` in `frontend/.env`. The client uses this as the API base URL. Uploaded images are stored under `backend/uploads/images` in this starter; use managed object storage for a deployed service.

## Project map

```text
frontend/
  public/                 App shell and browser metadata
  src/
    places/               Place collection, create, update, and card flows
    shared/               Auth context, hooks, form controls, navigation, UI
    user/                 Community list and authentication screens
backend/
  controllers/            Request handling and domain operations
  middleware/             Authentication and upload handling
  models/                 Mongoose user, place, and error models
  routes/                 REST endpoints and validation
```

## API surface

| Method | Endpoint | Purpose |
|---|---|---|
| GET | `/api/users` | List travellers |
| POST | `/api/users/signup` | Create account (multipart image upload) |
| POST | `/api/users/login` | Issue a signed session token |
| GET | `/api/places` | List public place stories |
| GET | `/api/places/:placeId` | Read a place |
| GET | `/api/places/user/:userId` | Read a traveller's places |
| POST | `/api/places` | Create a place with up to six photos (authenticated, multipart) |
| PATCH | `/api/places/:placeId` | Update a place (authenticated) |
| DELETE | `/api/places/:placeId` | Remove a place (authenticated) |

Protected requests use `Authorization: Bearer <token>`.

## Configuration and security

Keep credentials and deployment-specific values in local environment files. Never commit `.env` files. `MONGODB_URI`, `JWT_SECRET`, `CLIENT_ORIGIN`, `PORT`, and `REACT_APP_API_URL` are instance-specific settings. The demo content and demo session are intentionally non-sensitive and should not be used as production auth or persistence.

Before deploying, use HTTPS, restrict CORS to the actual client origin, validate and limit uploaded files, move uploads to durable object storage, add rate limiting and security headers, and use a managed database. Rotate any credentials that may have been exposed in earlier versions of this repository.

## Product notes

Milemarker Stories began as a React Context and Hooks travel-list exercise and has been shaped into a presentable full-stack product. The current API retains the original Express/Mongoose organization, while the client includes a local preview path for reliable demos. The product name, sample writing, and sample content are designed for this portfolio presentation.

## License

This project is licensed under the MIT License. See the app://-/LICENSE file for details.

---

**Made with care by Jahid Khan.** Go somewhere. Bring back a story.
