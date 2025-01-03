// src/types/jest-fetch-mock.d.ts

declare module "jest-fetch-mock" {
    const fetchMock: {
      enableMocks: () => void;
      resetMocks: () => void;
      doMock: () => void;
      mockResponse: (body: string, options?: RequestInit) => void;
      mockResponseOnce: (body: string, options?: RequestInit) => void;
    };
  
    export default fetchMock;
  }
  