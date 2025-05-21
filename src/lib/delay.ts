export const delay = (ms: number = 500) =>
  process.env.NODE_ENV === "development"
    ? new Promise((resolve) => setTimeout(resolve, ms))
    : Promise.resolve();
