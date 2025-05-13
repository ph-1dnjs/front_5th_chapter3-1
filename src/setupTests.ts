import { setupServer } from 'msw/node';
import '@testing-library/jest-dom';

import { createHandlers } from './__mocks__/handlers';

/* msw */
export const server = setupServer(...createHandlers().handlers);

beforeAll(() => {
  server.listen();
});

beforeEach(() => {
  expect.hasAssertions();
});

afterEach(() => {
  server.resetHandlers();
  vi.clearAllMocks();
});

afterAll(() => {
  vi.resetAllMocks();
  server.close();
});
