// __mocks__/eventEmitter.mock.ts

type Listener = (...args: unknown[]) => void;

class MockEventEmitter {
  private events: Record<string, Listener[]>;

  constructor() {
    this.events = {};
  }

  /**
   * Registers a listener for the specified event.
   * @param event - The name of the event to listen for.
   * @param listener - The callback to execute when the event is emitted.
   * @returns {void}
   */
  on(event: string, listener: Listener): void {
    if (!this.events[event]) {
      this.events[event] = [];
    }
    this.events[event].push(listener);
    console.log(`[EventEmitter Mock] Listener added for event: ${event}`);
  }

  /**
   * Registers a one-time listener for the specified event.
   * @param event - The name of the event to listen for.
   * @param listener - The callback to execute when the event is emitted.
   * @returns {void}
   */
  once(event: string, listener: Listener): void {
    const oneTimeListener = (...args: unknown[]): void => {
      listener(...args);
      this.off(event, oneTimeListener);
    };
    this.on(event, oneTimeListener);
    console.log(
      `[EventEmitter Mock] One-time listener added for event: ${event}`
    );
  }

  /**
   * Removes a specific listener for the specified event.
   * @param event - The name of the event.
   * @param listener - The listener to remove.
   * @returns {void}
   */
  off(event: string, listener: Listener): void {
    if (!this.events[event]) return;

    this.events[event] = this.events[event].filter((l) => l !== listener);
    console.log(`[EventEmitter Mock] Listener removed for event: ${event}`);
  }

  /**
   * Emits an event, invoking all registered listeners for the event.
   * @param event - The name of the event to emit.
   * @param args - The arguments to pass to the listeners.
   * @returns {void}
   */
  emit(event: string, ...args: unknown[]): void {
    if (!this.events[event]) return;

    console.log(`[EventEmitter Mock] Event emitted: ${event}`, ...args);
    this.events[event].forEach((listener) => listener(...args));
  }

  /**
   * Removes all listeners for a specific event or all events.
   * @param event - The name of the event to clear listeners for. Clears all events if omitted.
   * @returns {void}
   */
  removeAllListeners(event?: string): void {
    if (event) {
      delete this.events[event];
      console.log(
        `[EventEmitter Mock] All listeners removed for event: ${event}`
      );
    } else {
      this.events = {};
      console.log(`[EventEmitter Mock] All listeners removed for all events`);
    }
  }

  /**
   * Retrieves all listeners for a specific event.
   * @param event - The name of the event.
   * @returns {Listener[]} - An array of listeners for the event.
   */
  listeners(event: string): Listener[] {
    return this.events[event] || [];
  }
}

// Export the mock event emitter
export default MockEventEmitter;
