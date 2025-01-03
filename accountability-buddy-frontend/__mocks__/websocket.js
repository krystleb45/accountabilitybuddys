// __mocks__/websocket.js
class MockWebSocket {
    constructor(url) {
      this.url = url;
      this.onmessage = null;
      this.onopen = null;
      this.onclose = null;
    }
  
    send(data) {
      if (this.onmessage) {
        this.onmessage({ data });
      }
    }
  
    close() {
      if (this.onclose) {
        this.onclose();
      }
    }
  }
  
  global.WebSocket = MockWebSocket;
  