// src/types/global.d.ts

declare global {
  interface Window {
    fetch: typeof fetch;
    MutationObserver: typeof MutationObserver;
    IntersectionObserver: typeof IntersectionObserver;
    ResizeObserver: typeof ResizeObserver;
  }

  type MutationObserverCallback = (mutationsList: MutationRecord[], observer: MutationObserver) => void;
  type IntersectionObserverCallback = (entries: IntersectionObserverEntry[], observer: IntersectionObserver) => void;
  type ResizeObserverCallback = (entries: ResizeObserverEntry[], observer: ResizeObserver) => void;
}

export {};
