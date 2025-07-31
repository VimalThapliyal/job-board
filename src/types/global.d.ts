declare global {
  interface Window {
    gtag: (
      command: "config" | "event",
      targetId: string,
      config?: {
        [key: string]: string | number | boolean;
      }
    ) => void;
  }
}

export {};
