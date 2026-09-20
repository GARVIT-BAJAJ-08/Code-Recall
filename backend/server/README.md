# CodeRecall API

## Start locally

1. Create a MongoDB Atlas cluster and create a database user.
2. In Atlas, allow your current IP address under **Network Access**.
3. Copy `.env.example` to `.env`, then set `MONGODB_URI` and a long random `JWT_SECRET`.
4. For Google sign-in, create a Google OAuth **Web application** client, add your frontend URL (such as `http://localhost:5173`) as an Authorized JavaScript origin, and set its ID as `GOOGLE_CLIENT_ID`.
5. Configure `SMTP_HOST`, `SMTP_PORT`, `SMTP_USER`, `SMTP_PASSWORD`, and `SMTP_FROM` to enable the email OTP required during signup.
6. Run `npm install` and then `npm run dev` from this `server` directory.

The API runs at `http://localhost:5000` by default.

## Auth routes

| Method | Route | Body | Response |
| --- | --- | --- | --- |
| POST | `/api/auth/signup/request-otp` | `{ name, email, password }` | `{ message }` |
| POST | `/api/auth/signup/verify-otp` | `{ email, otp }` | `{ user, token }` |
| POST | `/api/auth/login` | `{ email, password }` | `{ user, token }` |
| GET | `/api/auth/me` | Bearer token header | `{ user }` |
| POST | `/api/auth/google` | `{ credential }` | `{ user, token }` |

Use `Authorization: Bearer <token>` for protected routes. Passwords are stored only as bcrypt hashes.
