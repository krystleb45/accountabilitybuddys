// src/types/jest.d.ts
declare module 'jest-fetch-mock' {
    const fetchMock: {
      enableMocks: () => void;
      resetMocks: () => void;
      doMock: () => void;
      mockResponse: (body: string, options?: RequestInit) => void;
      mockResponseOnce: (body: string, options?: RequestInit) => void;
      // Add any additional methods you need here
    };
  
    export default fetchMock;
  }
  