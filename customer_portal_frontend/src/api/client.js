import axios from 'axios';

/**
 * Resolve API base URL:
 * Priority: REACT_APP_API_BASE -> REACT_APP_BACKEND_URL -> default 'http://localhost:3001/api/v1'
 */
const envBase = process.env.REACT_APP_API_BASE || process.env.REACT_APP_BACKEND_URL;
export const API_BASE =
  envBase && envBase.trim().length > 0 ? envBase : 'http://localhost:3001/api/v1';

const client = axios.create({
  baseURL: API_BASE,
  timeout: 10000,
});

/**
 * PUBLIC_INTERFACE
 * health: GET /health
 */
export async function health() {
  const res = await client.get('/health');
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
