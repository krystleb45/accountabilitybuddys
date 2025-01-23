/**
 * Mock implementation of the WebSocket API for testing purposes.
 */

type WebSocketEvent = {
  data?: unknown;
};

class MockWebSocket {
  public url: string;
  public onmessage: ((event: WebSocketEvent) => void) | null = null;
  public onopen: (() => void) | null = null;
  public onclose: (() => void) | null = null;
  public onerror: ((error: Event) => void) | null = null;

  constructor(url: string) {
    this.url = url;

    // Simulate connection opening
    setTimeout(() => {
      if (this.onopen) {
        this.onopen();
      }
    }, 0);
  }

  /**
   * Simulates sending data through the WebSocket.
   * @param data - The data to send.
   */
  send(data: unknown): void {
    if (this.onmessage) {
      this.onmessage({ data });
    }
  }

  /**
   * Simulates closing the WebSocket connection.
   */
  close(): void {
    if (this.onclose) {
      this.onclose();
    }
  }

  /**
   * Simulates triggering an error event on the WebSocket.
   * @param error - The error event to trigger.
   */
  triggerError(error: Event): void {
    if (this.onerror) {
      this.onerror(error);
    }
  }
}

// Replace the global WebSocket with the mock
(global as unknown as { WebSocket: unknown }).WebSocket = MockWebSocket;

export default MockWebSocket;
