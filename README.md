# AI-Powered Blog Assistant

Week 4 mini project for the AI-Powered Full-Stack Web Development Internship.
React + Tailwind frontend, Express + MongoDB backend, Google Gemini API for AI.

## Features
- User authentication (JWT)
- React dashboard with: AI Blog Title Generator, AI Content Generator, AI Content Summarizer and AI Chat Assistant
- Copy to clipboard and save generated content (MongoDB)
- Loading states and error handling
- API key kept on the server in `.env` (never sent to the browser)
- Responsive UI

## Folders
- `server/` – Express API (auth, AI, saved posts)
- `client/` – React app (Vite + Tailwind)

## Run locally
1. Get a free Gemini API key at https://aistudio.google.com
2. Backend:
```
cd server
npm install
cp .env.example .env     # fill in MONGO_URI, JWT_SECRET, GEMINI_API_KEY
npm run dev
```
3. Frontend (new terminal):
```
cd client
npm install
npm run dev
```
Open http://localhost:5173

## API (send `Authorization: Bearer <token>` except auth routes)
| Method | Route | Body |
|---|---|---|
| POST | /api/auth/register | name, email, password |
| POST | /api/auth/login | email, password |
| POST | /api/ai/titles | input, tone |
| POST | /api/ai/content | input, tone |
| POST | /api/ai/summary | input |
| POST | /api/ai/chat | messages: [{role, content}] |
| GET / POST | /api/posts | type, prompt, result |
| DELETE | /api/posts/:id | |

## Deploy
**Backend (Render):** New Web Service → root directory `server` → build `npm install` → start `npm start`. Add the env vars from `.env.example`. Use a MongoDB Atlas connection string for `MONGO_URI`.

**Frontend (Vercel):** Import the repo → root directory `client` → add env var `VITE_API_URL` = your Render URL (no trailing slash).

Then set `CLIENT_URL` on Render to your Vercel URL.

Live frontend: _add your Vercel link here_
Live backend: _add your Render link here_
