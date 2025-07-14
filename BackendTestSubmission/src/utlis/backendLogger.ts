import axios from "axios";
import dotenv from "dotenv";
import { LogParams } from "../types/index";

dotenv.config();

const LOG_API = process.env.LOG_API!;
const LOG_API_KEY = process.env.LOG_API_KEY!;

export async function logBackend(
  level: LogParams["level"],
  pkg: Exclude<LogParams["package"],
    "api" | "component" | "book" | "page" | "state" | "style">,
  message: string
) {
  const body = {
    stack: "backend",
    level,
    package: pkg,
    message,
  };

  try {
    const res = await axios.post(LOG_API, body, {
      headers: {
        Authorization: LOG_API_KEY,
      },
    });
    return res.data;
  } catch (err: any) {
    console.error("[Logger Backend] Failed:", err.message);
  }
}
