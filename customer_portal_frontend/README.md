# Unified Customer Portal - Frontend

React frontend with Corporate Navy theme, shared layout (TopNav + SideNav), routing, and API client.

## Quick Start
- Install deps: `npm install`
- Set backend URL: copy `.env.example` to `.env` and adjust values
- Run: `npm start` (http://localhost:3000)

## Routing
- `/` Dashboard (fetches `GET /api/v1/health`)
- `/customers` Customers list (fetches `GET /api/v1/customers`)
- `/customers/:id` Customer detail (fetches `GET /api/v1/customers/:id`)
- `/profile` Profile
- Unknown routes → 404 page

## API Configuration
This app reads the base URL from environment variables:
- `REACT_APP_API_BASE` (preferred)
- Fallback: `REACT_APP_BACKEND_URL`
If neither is set, defaults to `http://localhost:3001/api/v1`.

Example:
```
REACT_APP_API_BASE=http://localhost:3001/api/v1
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
- `src/api/client.js` API client (axios)
- `src/components/Layout/*` TopNav & SideNav
- `src/components/common/*` common UI (Button, Card, Table)
- `src/pages/*` pages

## Notes
- No UI framework; all styles are lightweight CSS.
- Uses `react-router-dom@6` and `axios`.
