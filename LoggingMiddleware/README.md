# Logging Middleware (Reusable Package)

This folder contains a reusable logging utility for both backend and frontend apps.

## Usage

### Backend Logger

```ts
import { logBackend } from "./src/backendLogger";

await logBackend("info", "controller", "User created successfully");
await logBackend("error", "handler", "Received string, expected bool");
