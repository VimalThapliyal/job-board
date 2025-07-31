declare global {
  interface Window {
    gtag: (
      command: "config" | "event",
      targetId: string,
      config?: {
        [key: string]: any;
      }
    ) => void;
  }
}

export {};
