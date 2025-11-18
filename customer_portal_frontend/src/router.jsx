import React from 'react';
import { createBrowserRouter } from 'react-router-dom';
import App from './App';
import Dashboard from './pages/Dashboard';
import CustomersList from './pages/Customers/List';
import CustomerDetail from './pages/Customers/Detail';
import Profile from './pages/Profile';
import NotFound from './pages/NotFound';

/**
 * PUBLIC_INTERFACE
 * create and export the main application router.
 * Routes:
 *  - /           Dashboard
 *  - /customers  Customers list
 *  - /customers/:id  Customer detail
 *  - /profile    Profile page
 *  - *           NotFound
 */
const router = createBrowserRouter([
  {
    path: '/',
    element: <App />,
    children: [
      { index: true, element: <Dashboard /> },
      { path: 'customers', element: <CustomersList /> },
      { path: 'customers/:id', element: <CustomerDetail /> },
      { path: 'profile', element: <Profile /> },
      { path: '*', element: <NotFound /> }
    ],
  },
]);

export default router;
