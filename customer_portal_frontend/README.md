# Unified Customer Portal - Frontend

React frontend with Corporate Navy theme, shared layout (TopNav + SideNav), routing, and API client.

## Quick Start
- Install deps: `npm install`
- Run with mocks (no backend needed):
  - Copy `.env.mock` to `.env` (or set `REACT_APP_USE_MOCKS=true`)
  - `npm start` (http://localhost:3000)
- Run with real backend:
  - Set `REACT_APP_USE_MOCKS=false`
  - Set `REACT_APP_API_BASE` (e.g., `http://localhost:3001/api/v1`)
  - Optionally set `REACT_APP_HEALTHCHECK_PATH=/health`
  - `npm start`

## Routing
- `/` Dashboard (reads health via API client; mocked when enabled)
- `/customers` Customers list (reads via API client; mocked when enabled)
- `/customers/:id` Customer detail (reads via API client; mocked when enabled)
- `/profile` Profile
- Unknown routes → 404 page

## API Configuration and Mock Mode
This app can operate fully offline using a mock API:
- Toggle with `REACT_APP_USE_MOCKS=true|false`
- If `REACT_APP_API_BASE` is not set, mock mode defaults to ON automatically
- In mock mode, health and customer endpoints return deterministic dummy data and no network calls are made

When using the real backend, base URL resolution order:
- `REACT_APP_API_BASE` (preferred)
- Fallback: `REACT_APP_BACKEND_URL`
If neither is set (and mocks are disabled), defaults to `http://localhost:3001/api/v1`.

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
When mocks are disabled, the Dashboard performs a health check using `REACT_APP_API_BASE` and `REACT_APP_HEALTHCHECK_PATH`. If you see "Network Error":
1. Ensure `REACT_APP_API_BASE` includes protocol and port and no trailing slash.
   - Good: `https://host:3001/api/v1`
   - Bad: `host:3001/api/v1` (missing protocol), `https://host:3001/api/v1/` (trailing slash ok, but will be normalized)
2. If running over HTTPS, ensure the backend is also accessible over HTTPS or your environment allows mixed content.
3. Backend CORS must allow your frontend origin (e.g., http://localhost:3000). The frontend sets `withCredentials=false`.
4. Use the diagnostics shown on the Dashboard: it logs effective base URL, health URL, and tries fetching `/openapi.json` as a connectivity fallback.
5. You can click the "Open API Docs JSON" link to verify reachability, or enable mocks to bypass the backend.

You can copy `.env.mock` to `.env` to force mock mode:
```
REACT_APP_USE_MOCKS=true
```

## Notes
- No UI framework; all styles are lightweight CSS.
- Uses `react-router-dom@6` and `axios`.
