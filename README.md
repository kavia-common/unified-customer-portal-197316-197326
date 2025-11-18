# unified-customer-portal-197316-197326

Frontend supports a mock mode to run without the backend:
- In `customer_portal_frontend`, set `REACT_APP_USE_MOCKS=true` (see `.env.mock`)
- Health and customer lists/details are served from local dummy data; no network calls occur
- Set `REACT_APP_USE_MOCKS=false` and `REACT_APP_API_BASE` to use the backend as usual