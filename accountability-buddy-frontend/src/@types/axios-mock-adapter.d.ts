declare module 'axios-mock-adapter' {
  import { AxiosInstance } from 'axios';

  class MockAdapter {
    constructor(
      axiosInstance: AxiosInstance,
      options?: { delayResponse?: number }
    );
    onGet(url: string, config?: any): this;
    onPost(url: string, config?: any): this;
    onPut(url: string, config?: any): this;
    onDelete(url: string, config?: any): this;
    reply(status: number, data?: any, headers?: any): this;
    reset(): void;
    restore(): void;
  }

  export default MockAdapter;
}
