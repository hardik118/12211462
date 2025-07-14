import axios from "axios";

export async function logFrontend(
  level: "debug" | "info" | "warn" | "error" | "fatal",
  pkg: "api" | "component" | "page" | "state" | "style" | "auth" | "config" | "middleware" | "utils",
  message: string
) {
  try {
    await axios.post(import.meta.env.VITE_LOG_API, {
      stack: "frontend",
      level,
      package: pkg,
      message,
    }, {
      headers: {
        Authorization: import.meta.env.VITE_LOG_API_KEY,
      },
    });
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  } catch (err: unknown) {
    // Fallback: do not use console.log
  }
}
