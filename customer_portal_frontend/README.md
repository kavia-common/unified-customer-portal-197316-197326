# Unified Customer Portal - Frontend

React frontend with Corporate Navy theme, shared layout (TopNav + SideNav), routing, and API client.

## Quick Start (Standalone by default)
- Install deps: `npm install`
- Run fully standalone on mock data (no backend needed):
  - Copy `.env.standalone` to `.env` (or set `REACT_APP_USE_MOCKS=true`)
  - `npm start` (opens http://localhost:3000)
- The health check, dashboard metrics, and customer lists/details all run from local mocks. No network calls are made.

## Switching to Real Backend
- Set `REACT_APP_USE_MOCKS=false`
- Set `REACT_APP_API_BASE` (e.g., `http://localhost:3001/api/v1`)
- Optional: `REACT_APP_HEALTHCHECK_PATH` (default: `/health`, or use absolute URL)
- `npm start`

Base URL resolution order when mocks are OFF:
- `REACT_APP_API_BASE` (preferred)
- fallback: `REACT_APP_BACKEND_URL`
If neither is set, defaults to `http://localhost:3001/api/v1`.

Example:
```
REACT_APP_USE_MOCKS=false
REACT_APP_API_BASE=http://localhost:3001/api/v1
```

Health path:
```
# absolute URL allowed (used as-is)
REACT_APP_HEALTHCHECK_PATH=https://your-host:3001/api/v1/health
# or relative to API base (default: /health)
REACT_APP_HEALTHCHECK_PATH=/health
```

When mocks are ON, any backend URL variables are ignored and the app never calls the network for health or data.

## Routing
- `/` Dashboard (mock metrics/cards/charts + health, mocked when enabled)
- `/customers` Customers list (reads via API client; mocked when enabled)
- `/customers/:id` Customer detail (reads via API client; mocked when enabled)
- `/profile` Profile
- Unknown routes → 404 page

## API Configuration and Mock Mode
- Toggle with `REACT_APP_USE_MOCKS=true|false`
- If `REACT_APP_API_BASE` is not set, mock mode defaults to ON automatically
- In mock mode, health and customer endpoints use deterministic dummy data and never hit the network

## Theme
Corporate Navy color palette is implemented with CSS variables in `src/App.css`:
- primary: #1E3A8A
- secondary: #F59E0B
- background: #F3F4F6
- surface: #FFFFFF
- text: #111827

Supports light/dark toggle (persists in localStorage).

## Project Structure
- `src/router.jsx` app routes
- `src/api/client.js` API client with mock toggle
- `src/api/mockClient.js` mock endpoints
- `src/components/Layout/*` TopNav & SideNav
- `src/components/common/*` common UI (Button, Card, Table)
- `src/pages/*` pages

## Network Error / CORS Troubleshooting
When mocks are disabled:
1. Ensure `REACT_APP_API_BASE` includes protocol and port and no trailing slash.
   - Good: `https://host:3001/api/v1`
   - Bad: `host:3001/api/v1` (missing protocol)
2. If running over HTTPS, ensure the backend is also accessible over HTTPS or your environment allows mixed content.
3. Backend CORS must allow your frontend origin (e.g., http://localhost:3000). The frontend sets `withCredentials=false`.
4. Dashboard logs diagnostics for base URL and health URL; it also tries `/openapi.json` as a connectivity fallback.

To force mock mode:
```
REACT_APP_USE_MOCKS=true
```

## Notes
- No UI framework; all styles are lightweight CSS.
- Uses `react-router-dom@6` and `axios`.
