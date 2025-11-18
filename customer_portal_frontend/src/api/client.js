import axios from 'axios';

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
      // Use current host for backend if ports match known dev ports (3000 frontend, 3001 backend)
      // We keep port 3001 for backend.
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

export const API_BASE = normalizeBaseUrl(rawBase);

/**
 * Resolve health check path:
 * - If REACT_APP_HEALTHCHECK_PATH starts with 'http', use as absolute URL.
 * - Else, treat as a path relative to API_BASE (default '/health').
 */
const rawHealthPath = process.env.REACT_APP_HEALTHCHECK_PATH || '/health';

// PUBLIC_INTERFACE
export function getHealthUrl() {
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
 */
const client = axios.create({
  baseURL: API_BASE,
  timeout: 10000,
  withCredentials: false,
});

// Diagnostics logging
(function logApiDiagnostics() {
  try {
    // eslint-disable-next-line no-console
    console.log('[API] baseURL:', API_BASE, 'healthPath:', rawHealthPath, 'healthURL:', getHealthUrl());
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
 */
async function tryOpenApiConnectivity() {
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
 * health: GET health endpoint using configured path, with diagnostics & fallback to /openapi.json.
 */
export async function health() {
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
    // Build detailed diagnostics and attempt fallback to /openapi.json
    const diag = {
      message: err?.message || 'Network error',
      code: err?.code,
      name: err?.name,
      isAxiosError: !!err?.isAxiosError,
      requestedUrl: url,
      apiBase: API_BASE,
    };
    const fallback = await tryOpenApiConnectivity();
    throw Object.assign(new Error('Health check failed'), {
      diagnostics: diag,
      fallback,
    });
  }
}

/**
 * PUBLIC_INTERFACE
 * listCustomers: GET /customers
 */
export async function listCustomers() {
  const res = await client.get('/customers', { withCredentials: false });
  return res.data;
}

/**
 * PUBLIC_INTERFACE
 * getCustomer: GET /customers/:id
 */
export async function getCustomer(id) {
  const res = await client.get(`/customers/${id}`, { withCredentials: false });
  return res.data;
}

export default client;
