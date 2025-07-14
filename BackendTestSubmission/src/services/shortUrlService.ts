import { v4 as uuidv4 } from "uuid";
import { store } from "../db/db";
import { UrlEntry, ClickInfo } from "../types";
import { generateCode } from "../utlis/generateCode";

export async function createUrlEntry(
  url: string,
  validity?: number,
  shortcode?: string
) {
  const now = new Date();
  const expiryMinutes = validity ?? 30;
  const expiry = new Date(now.getTime() + expiryMinutes * 60000).toISOString();

  let code = shortcode || generateCode();

  // Ensure shortcode is unique
  if (store.has(code)) {
    throw {
      statusCode: 409,
      message: `Shortcode '${code}' already exists`,
    };
  }

  const entry: UrlEntry = {
    id: uuidv4(),
    shortcode: code,
    originalUrl: url,
    createdAt: now.toISOString(),
    expiry,
    clicks: [],
  };

  store.set(code, entry);

  return {
    shortLink: `http://localhost:3000/${code}`,
    expiry,
  };
}

export async function getUrlStats(shortcode: string) {
  const entry = store.get(shortcode);

  if (!entry) {
    throw {
      statusCode: 404,
      message: "Shortcode not found",
    };
  }

  return {
    shortcode: entry.shortcode,
    originalUrl: entry.originalUrl,
    createdAt: entry.createdAt,
    expiry: entry.expiry,
    totalClicks: entry.clicks.length,
    clickHistory: entry.clicks,
  };
}
