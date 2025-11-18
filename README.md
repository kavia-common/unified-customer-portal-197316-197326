# unified-customer-portal-197316-197326

Frontend runs standalone on mock data by default:
- In `customer_portal_frontend`, copy `.env.standalone` to `.env` (or set `REACT_APP_USE_MOCKS=true`)
- Health, dashboard metrics, and customers use local dummy data; no network calls occur
- To use the backend instead: set `REACT_APP_USE_MOCKS=false` and define `REACT_APP_API_BASE`