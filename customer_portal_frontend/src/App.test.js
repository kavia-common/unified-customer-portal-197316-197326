import { render } from '@testing-library/react';
import { RouterProvider, createMemoryRouter } from 'react-router-dom';
import router from './router';

test('renders app without crashing', () => {
  const testRouter = createMemoryRouter(router.routes, { initialEntries: ['/'] });
  render(<RouterProvider router={testRouter} />);
});
