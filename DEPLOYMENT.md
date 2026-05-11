# Production Deployment

## Frontend: Vercel

Set the Vercel project root to the repository root. The included `vercel.json` installs and builds the Vite app from `client/`.

Environment variable:

```env
VITE_API_BASE_URL=https://mern-saas-admin-dashboard-api.onrender.com/api
```

Commands:

```bash
cd client
npm install
npm run build
```

## Backend: Render

Create the service from `render.yaml`, or create a Web Service manually with:

```bash
Root Directory: backend
Build Command: npm install
Start Command: npm start
Health Check Path: /health
```

Render environment variables:

```env
NODE_ENV=production
PORT=10000
MONGO_URI=mongodb+srv://<username>:<password>@<cluster-url>/mern-saas-admin-dashboard?retryWrites=true&w=majority
JWT_SECRET=<generate-a-long-random-secret>
JWT_EXPIRES_IN=7d
CLIENT_URLS=https://mern-saas-admin-dashboard.vercel.app
```

## MongoDB Atlas

Create an Atlas cluster, create a database user, and use the SRV connection string in `MONGO_URI`.

For Render, allow network access from Render outbound IPs if using a paid/static setup. During initial setup, `0.0.0.0/0` works but is less restrictive, so pair it with a strong database password and least-privilege user.

## Deployment Commands

Local production checks:

```bash
cd backend
npm install
npm start
```

```bash
cd client
npm install
npm run build
npm run preview
```

Deploy with CLIs:

```bash
cd client
npx vercel --prod
```

```bash
git push origin main
```

Render deploys automatically from the connected branch when `autoDeploy` is enabled.

## Common Deployment Errors

`Cannot GET /dashboard` on Vercel means SPA rewrites are missing. The `vercel.json` rewrite sends all frontend routes to `index.html`.

`vite: command not found` means dependencies were not installed in the frontend directory. Use the included Vercel install/build commands.

`Cannot find module express` on Render means the backend has no install step or no backend `package.json`. This project now includes `backend/package.json`.

`MongoServerSelectionError` usually means the Atlas IP access list blocks Render or the `MONGO_URI` is wrong.

`jwt malformed` or login failures after deploy often mean `JWT_SECRET` changed between deploys or the frontend is sending an old local token.

## CORS Fixes

Use exact frontend origins in `CLIENT_URLS`, separated by commas:

```env
CLIENT_URLS=https://mern-saas-admin-dashboard.vercel.app,https://preview-name.vercel.app
```

Do not include a trailing slash. Use `https://app.vercel.app`, not `https://app.vercel.app/`.

If credentials are enabled, do not use `*` as the CORS origin.

## Environment Variable Mistakes

Vite exposes only variables prefixed with `VITE_`. The frontend must use `VITE_API_BASE_URL`.

Backend secrets must be set on Render, not Vercel.

Frontend production variables must be set on Vercel, not only in local `.env` files.

After changing Vercel env vars, redeploy the frontend. Vite bakes env values into the production build.

## Production Debugging

Check `/health` on the Render URL first. If it fails, debug backend logs before testing the frontend.

Open browser DevTools Network tab and confirm requests go to `/api` on the Render URL, not `localhost`.

Check Render logs for CORS origin values, MongoDB connection failures, missing env vars, and startup crashes.

Clear `localStorage` after changing auth secrets or switching between local and production APIs.
