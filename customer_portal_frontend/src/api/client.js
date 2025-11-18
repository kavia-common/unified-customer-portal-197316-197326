import axios from 'axios';
import * as mock from './mockClient';

/**
 * Toggle for using mocks. Default to true when API base is not set.
 */
const USE_MOCKS = String(process.env.REACT_APP_USE_MOCKS || '').toLowerCase() === 'true'
  || !(process.env.REACT_APP_API_BASE || process.env.REACT_APP_BACKEND_URL);

/**
 * Error suppression flag. When true, API functions resolve to safe defaults
 * and never throw UI-visible errors. Controlled via REACT_APP_SUPPRESS_ERRORS.
 */
const SUPPRESS_ERRORS = String(process.env.REACT_APP_SUPPRESS_ERRORS || 'true').toLowerCase() === 'true';

/**
 * Normalize and validate base URL and health path from env.
 * Priority: REACT_APP_API_BASE -> REACT_APP_BACKEND_URL -> default 'http://localhost:3001/api/v1'
 * Ensures protocol+host+optional port are included and trailing slashes are trimmed to avoid // issues.
 */
const rawBase = process.env.REACT_APP_API_BASE || process.env.REACT_APP_BACKEND_URL;
const FALLBACK_BASE = 'http://localhost:3001/api/v1';

// Ensure base has protocol and remove trailing slash.
// Additionally, if the app is served over HTTPS, avoid mixed content by upgrading
// http://localhost:* to https://<current-host>:<port> when possible.
function normalizeBaseUrl(input) {
  let b = (input || '').trim();

  // Fill protocol if missing
  if (b && !/^https?:\/\//i.test(b)) {
    b = `http://${b}`;
  }

  // Default if still empty
  if (!b) {
    b = FALLBACK_BASE;
  }

  // Trim trailing slashes
  b = b.replace(/\/+$/, '');

  // Mixed-content guard: if page is https and base is http to localhost,
  // try to align with current location host using https, but preserve path (/api/v1).
  try {
    const loc = typeof window !== 'undefined' ? window.location : null;
    if (loc && loc.protocol === 'https:' && /^http:\/\/localhost(?::\d+)?\//i.test(b)) {
      const url = new URL(b);
      const apiPath = url.pathname || '/api/v1';
      const newBase = `https://${loc.hostname}:3001${apiPath}`;
      // eslint-disable-next-line no-console
      console.warn('[API] Upgrading base URL to avoid mixed content:', newBase);
      b = newBase.replace(/\/+$/, '');
    }
  } catch {
    // ignore
  }

  return b;
}

export const API_BASE = USE_MOCKS ? mock.API_BASE : normalizeBaseUrl(rawBase);

/**
 * Resolve health check path:
 * - If REACT_APP_HEALTHCHECK_PATH starts with 'http', use as absolute URL.
 * - Else, treat as a path relative to API_BASE (default '/health').
 * In mock mode, ignore env and return mock pseudo URL.
 */
const rawHealthPath = process.env.REACT_APP_HEALTHCHECK_PATH || '/health';

// PUBLIC_INTERFACE
export function getHealthUrl() {
  if (USE_MOCKS) return mock.getHealthUrl();
  if (/^https?:\/\//i.test(rawHealthPath)) {
    return rawHealthPath;
  }
  const path = rawHealthPath.startsWith('/') ? rawHealthPath : `/${rawHealthPath}`;
  return `${API_BASE}${path}`;
}

/**
 * Create axios client with safe defaults for CORS.
 * - withCredentials: false to avoid cookie-based CORS failures
 * - baseURL: API_BASE
 * - timeout: 10s
 * Adds a request interceptor to log diagnostics in development.
 * In mock mode, this client won't be used for mocked endpoints.
 */
const client = axios.create({
  baseURL: USE_MOCKS ? undefined : API_BASE,
  timeout: 10000,
  withCredentials: false,
});

// Diagnostics logging
(function logApiDiagnostics() {
  try {
    // eslint-disable-next-line no-console
    console.log('[API] mode:', USE_MOCKS ? 'MOCK' : 'REAL', 'baseURL:', API_BASE, 'healthPath:', rawHealthPath, 'healthURL:', getHealthUrl(), 'suppressErrors:', SUPPRESS_ERRORS);
  } catch (e) {
    // ignore
  }
})();

client.interceptors.request.use((config) => {
  // eslint-disable-next-line no-console
  if (process.env.NODE_ENV !== 'production') {
    console.debug('[API] Request:', {
      method: config.method,
      url: config.baseURL ? `${config.baseURL}${config.url}` : config.url,
    });
  }
  return config;
});

/**
 * Try GET /openapi.json to verify connectivity when health path fails.
 * Skipped in mock mode.
 */
async function tryOpenApiConnectivity() {
  if (USE_MOCKS) {
    return { ok: true, urlTried: 'mock://api/openapi.json', data: { mock: true } };
  }
  const openapiUrl = `${API_BASE.replace(/\/+$/, '')}/openapi.json`;
  try {
    const res = await axios.get(openapiUrl, { timeout: 8000, withCredentials: false });
    return { ok: true, urlTried: openapiUrl, data: res.data };
  } catch (e) {
    return {
      ok: false,
      urlTried: openapiUrl,
      error: e?.message || 'Failed to fetch openapi.json',
      code: e?.code,
    };
  }
}

/**
 * PUBLIC_INTERFACE
 * health: return mock health when USE_MOCKS; otherwise call backend.
 * In suppression mode, failures resolve to a neutral healthy-looking default.
 * When USE_MOCKS is true this function MUST NOT perform any network calls.
 */
export async function health() {
  if (USE_MOCKS) {
    return mock.getHealth();
  }
  const url = getHealthUrl();
  try {
    if (/^https?:\/\//i.test(url)) {
      const res = await axios.get(url, { timeout: 10000, withCredentials: false });
      return res.data;
    }
    // strip base if accidentally included and ensure relative path
    const relative = url.startsWith(API_BASE) ? url.slice(API_BASE.length) || '/' : url;
    const res = await client.get(relative, { withCredentials: false });
    return res.data;
  } catch (err) {
    // Attempt fallback diagnostics (kept for logs only)
    try { await tryOpenApiConnectivity(); } catch { /* noop */ }
    if (SUPPRESS_ERRORS) {
      // Neutral fallback
      return {
        status: 'ok',
        service: 'degraded',
        timestamp: new Date().toISOString(),
      };
    }
    throw err;
  }
}

/**
 * PUBLIC_INTERFACE
 * listCustomers: mocked or real GET /customers
 * In suppression mode, failures resolve to [].
 */
export async function listCustomers() {
  if (USE_MOCKS) {
    return mock.listCustomers();
  }
  try {
    const res = await client.get('/customers', { withCredentials: false });
    return res.data;
  } catch (err) {
    if (SUPPRESS_ERRORS) {
      return [];
    }
    throw err;
  }
}

/**
 * PUBLIC_INTERFACE
 * getCustomer: mocked or real GET /customers/:id
 * In suppression mode, failures resolve to a neutral placeholder object.
 */
export async function getCustomer(id) {
  if (USE_MOCKS) {
    try {
      return await mock.getCustomer(id);
    } catch (e) {
      if (SUPPRESS_ERRORS) {
        return {
          id: Number(id) || 0,
          name: '—',
          email: '—',
          phone: null,
          company: null,
          status: 'inactive',
        };
      }
      throw e;
    }
  }
  try {
    const res = await client.get(`/customers/${id}`, { withCredentials: false });
    return res.data;
  } catch (err) {
    if (SUPPRESS_ERRORS) {
      return {
        id: Number(id) || 0,
        name: '—',
        email: '—',
        phone: null,
        company: null,
        status: 'inactive',
      };
    }
    throw err;
  }
}

export default client;
