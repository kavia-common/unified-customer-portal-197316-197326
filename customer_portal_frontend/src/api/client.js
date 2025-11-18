import axios from 'axios';

/**
 * Resolve API base URL:
 * Priority: REACT_APP_API_BASE -> REACT_APP_BACKEND_URL -> default 'http://localhost:3001/api/v1'
 */
const envBase = process.env.REACT_APP_API_BASE || process.env.REACT_APP_BACKEND_URL;
export const API_BASE =
  envBase && envBase.trim().length > 0 ? envBase : 'http://localhost:3001/api/v1';

/**
 * Resolve health check path:
 * - If REACT_APP_HEALTHCHECK_PATH starts with 'http', use as absolute URL.
 * - Else, treat as a path relative to API_BASE (default '/health').
 */
const rawHealthPath = process.env.REACT_APP_HEALTHCHECK_PATH || '/health';

/**
 * PUBLIC_INTERFACE
 * getHealthUrl: returns the effective URL used for the health request, for diagnostics.
 */
export function getHealthUrl() {
  if (/^https?:\/\//i.test(rawHealthPath)) {
    return rawHealthPath;
  }
  // ensure no double slashes when joining
  const base = API_BASE.replace(/\/+$/, '');
  const path = rawHealthPath.startsWith('/') ? rawHealthPath : `/${rawHealthPath}`;
  return `${base}${path}`;
}

const client = axios.create({
  baseURL: API_BASE,
  timeout: 10000,
});

/**
 * PUBLIC_INTERFACE
 * health: GET health endpoint using configured path
 */
export async function health() {
  const url = getHealthUrl();
  // If absolute URL, use axios.get directly; else use client with relative path
  if (/^https?:\/\//i.test(url)) {
    const res = await axios.get(url, { timeout: 10000 });
    return res.data;
  }
  const res = await client.get(url.replace(API_BASE, '')); // strip base if accidentally included
  return res.data;
}

/**
 * PUBLIC_INTERFACE
 * listCustomers: GET /customers
 */
export async function listCustomers() {
  const res = await client.get('/customers');
  return res.data;
}

/**
 * PUBLIC_INTERFACE
 * getCustomer: GET /customers/:id
 */
export async function getCustomer(id) {
  const res = await client.get(`/customers/${id}`);
  return res.data;
}

export default client;
