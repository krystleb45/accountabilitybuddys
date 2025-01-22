// src/types/tests/mocks/mocks.test.ts

import { setupServer } from 'msw/node';
import { rest } from 'msw';
import axios from 'axios';
import { expect } from '@jest/globals';

const API_BASE_URL = 'https://accountabilitybuddys.com/api';

/**
 * Mock server handlers
 */
const handlers = [
  rest.get(`${API_BASE_URL}/example`, (req, res, ctx) => {
    return res(
      ctx.status(200),
      ctx.json({ message: 'Mocked GET request successful' })
    );
  }),

  rest.post(`${API_BASE_URL}/example`, (req, res, ctx) => {
    return res(
      ctx.status(201),
      ctx.json({ message: 'Mocked POST request successful' })
    );
  }),

  rest.put(`${API_BASE_URL}/example/:id`, (req, res, ctx) => {
    const { id } = req.params;
    return res(
      ctx.status(200),
      ctx.json({ message: `Mocked PUT request successful for ID: ${id}` })
    );
  }),

  rest.delete(`${API_BASE_URL}/example/:id`, (req, res, ctx) => {
    const { id } = req.params;
    return res(
      ctx.status(204),
      ctx.json({ message: `Mocked DELETE request successful for ID: ${id}` })
    );
  }),
];

/**
 * Set up the mock server
 */
const server = setupServer(...handlers);

// Establish API mocking before all tests
beforeAll(() => server.listen({ onUnhandledRequest: 'warn' }));

// Reset handlers after each test to avoid test bleed
afterEach(() => server.resetHandlers());

// Clean up after the tests are finished
afterAll(() => server.close());

/**
 * Tests for API handlers
 */
describe('Mock Service Worker Handlers', () => {
  it('should mock a GET request successfully', async () => {
    const response = await axios.get(`${API_BASE_URL}/example`);
    expect(response.status).toBe(200);
    expect(response.data.message).toBe('Mocked GET request successful');
  });

  it('should mock a POST request successfully', async () => {
    const response = await axios.post(`${API_BASE_URL}/example`, {
      name: 'Test',
    });
    expect(response.status).toBe(201);
    expect(response.data.message).toBe('Mocked POST request successful');
  });

  it('should mock a PUT request successfully', async () => {
    const id = '123';
    const response = await axios.put(`${API_BASE_URL}/example/${id}`, {
      name: 'Updated Test',
    });
    expect(response.status).toBe(200);
    expect(response.data.message).toBe(
      `Mocked PUT request successful for ID: ${id}`
    );
  });

  it('should mock a DELETE request successfully', async () => {
    const id = '123';
    const response = await axios.delete(`${API_BASE_URL}/example/${id}`);
    expect(response.status).toBe(204);
  });

  it('should handle network errors gracefully', async () => {
    server.use(
      rest.get(`${API_BASE_URL}/example`, (req, res, ctx) => {
        return res.networkError('Failed to connect');
      })
    );

    await expect(axios.get(`${API_BASE_URL}/example`)).rejects.toThrow(
      'Network Error'
    );
  });

  it('should return a 500 error for a specific endpoint', async () => {
    server.use(
      rest.get(`${API_BASE_URL}/example`, (req, res, ctx) => {
        return res(ctx.status(500), ctx.json({ error: 'Internal Server Error' }));
      })
    );

    try {
      await axios.get(`${API_BASE_URL}/example`);
    } catch (error: any) {
      expect(error.response.status).toBe(500);
      expect(error.response.data.error).toBe('Internal Server Error');
    }
  });
});
