# CodeRecall

CodeRecall is a full-stack spaced-revision app for coding interview problems. Users can create an account with email/password or Google, save questions, and record revision outcomes that automatically schedule the next review.

## Stack

- React + Vite frontend
- Express + MongoDB API
- JWT authentication and Google Identity Services

## Run locally

1. Copy `.env.example` to `.env` and set:

   ```env
   VITE_API_URL=http://localhost:5000/api
   VITE_GOOGLE_CLIENT_ID=your-google-client-id.apps.googleusercontent.com
   ```

2. Copy `server/.env.example` to `server/.env`, then set `MONGODB_URI`, a long random `JWT_SECRET`, and the matching `GOOGLE_CLIENT_ID`.
3. Start the API from `server`: `npm run dev`.
4. Start the frontend from the project root: `npm run dev`.

The frontend runs at `http://localhost:5173`; the API runs at `http://localhost:5000`.

## Google sign-in setup

In Google Cloud Console, create an OAuth 2.0 **Web application** client. Add `http://localhost:5173` under **Authorized JavaScript origins** (and add your deployed frontend URL before production). Put the client ID in both environment files. The client secret is not used by, and must never be exposed to, the frontend.

If only the Google account that created the OAuth project can sign in, check the OAuth consent screen in Google Cloud Console. For local testing, set the app's audience to **External** and add every account under **Test users**. An app in **Testing** mode only accepts those listed accounts. For a public app, complete Google's verification requirements and publish the consent screen; for a Google Workspace-only app, **Internal** restricts sign-in to accounts in that Workspace organization.

After changing these settings, sign out of CodeRecall, clear the Google session or use an incognito window, and try the other account again. If it still fails, verify that `VITE_GOOGLE_CLIENT_ID` in the frontend and `GOOGLE_CLIENT_ID` in `server/.env` are exactly the same Web application client ID, then restart both dev servers.

## API

- `POST /api/auth/signup`
- `POST /api/auth/login`
- `POST /api/auth/google`
- `GET /api/auth/me`
- `GET`, `POST /api/questions`
- `PATCH`, `DELETE /api/questions/:id`
- `POST /api/questions/:id/review`
