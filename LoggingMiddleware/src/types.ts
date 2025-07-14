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
