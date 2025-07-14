export type Stack = "backend" | "frontend";

export type LogLevel = "debug" | "info" | "warn" | "error" | "fatal";

export type Package =
  | "cache" | "controller" | "cron_job" | "db" | "domain" | "handler" | "repository" | "route" | "service" // backend-only
  | "api" | "component" | "book" | "page" | "state" | "style" // frontend-only
  | "auth" | "config" | "middleware" | "utils"; // both

export interface LogParams {
  stack: Stack;
  level: LogLevel;
  package: Package;
  message: string;
}

import dotenv from "dotenv";

dotenv.config();

const LOG_API = process.env.LOG_API!;
const LOG_API_KEY = process.env.LOG_API_KEY!;

export async function logFrontend(
  level: LogParams["level"],
  pkg: Exclude<LogParams["package"],
    "cache" | "controller" | "cron_job" | "db" | "domain" | "handler" | "repository" | "route" | "service">,
  message: string
) {
  const body = {
    stack: "frontend",
    level,
    package: pkg,
    message,
  };

  try {
    const res = await fetch(LOG_API, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: LOG_API_KEY,
      },
      body: JSON.stringify(body),
    });
    return await res.json();
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (err: any) {
    console.error("[Logger Frontend] Failed:", err.message);
  }
}
