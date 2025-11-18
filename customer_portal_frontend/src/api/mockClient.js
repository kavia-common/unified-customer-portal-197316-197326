//
// Mock API client providing deterministic dummy data for development/demo.
// This module mirrors the signatures of src/api/client.js functions,
// allowing the UI to switch between real backend calls and mocks via env.
//
// PUBLIC_INTERFACE
export const MOCK_LATENCY_MS = 250;

/**
 * PUBLIC_INTERFACE
 * Simulate a small delay to mimic network latency.
 */
function delay(ms = MOCK_LATENCY_MS) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

/**
 * PUBLIC_INTERFACE
 * getHealth: returns a healthy status with current timestamp after a short delay.
 */
export async function getHealth() {
  await delay();
  return {
    status: 'ok',
    service: 'mock',
    timestamp: new Date().toISOString(),
  };
}

/**
 * PUBLIC_INTERFACE
 * listCustomers: returns a static list of customers.
 */
export async function listCustomers() {
  await delay();
  return [
    { id: 1, name: 'Alice Johnson', email: 'alice.j@example.com', company: 'Acme Corp', status: 'active', phone: '555-0001' },
    { id: 2, name: 'Bob Smith', email: 'bob.s@example.com', company: 'Beta LLC', status: 'prospect', phone: '555-0002' },
    { id: 3, name: 'Carol Lee', email: 'carol.l@example.com', company: 'Contoso', status: 'inactive', phone: '555-0003' },
    { id: 4, name: 'David Kim', email: 'david.k@example.com', company: 'Globex', status: 'active', phone: '555-0004' },
  ];
}

/**
 * PUBLIC_INTERFACE
 * getCustomer: returns a single customer from the mock list by id.
 */
export async function getCustomer(id) {
  await delay();
  const all = await listCustomers();
  const numericId = Number(id);
  const found = all.find((c) => c.id === numericId);
  if (!found) {
    // Simulate not found
    const err = new Error('Mock: customer not found');
    err.status = 404;
    throw err;
  }
  return found;
}

// Helpers to align with existing client exports (for Dashboard)
export const API_BASE = 'mock://api';
export function getHealthUrl() {
  // In mock mode we don't contact network; return a descriptive pseudo URL
  return 'mock://api/health';
}

// Default export for potential parity with axios client usage (not required by current code)
const mockClient = {
  getHealth,
  listCustomers,
  getCustomer,
  API_BASE,
  getHealthUrl,
};
export default mockClient;
