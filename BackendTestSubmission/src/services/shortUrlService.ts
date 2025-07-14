import { v4 as uuidv4 } from "uuid";
import { store } from "../db/db";
import { UrlEntry, ClickInfo } from "../types";
import { generateCode } from "../utlis/generateCode";

/**
 * Function: createUrlEntry
 * -------------------------
 * Creates and stores a new shortened URL entry.
 * 
 * Parameters:
 * - url: string (the original long URL)
 * - validity: number (optional, in minutes; defaults to 30)
 * - shortcode: string (optional custom shortcode)
 * 
 * Steps:
 * 1. Sets expiry time based on current time and validity.
 * 2. Uses custom shortcode if provided; otherwise generates a unique one.
 * 3. Checks for shortcode uniqueness in the store.
 * 4. Constructs the UrlEntry object with tracking fields.
 * 5. Stores the entry in an in-memory store.
 * 6. Returns a response object with the shortened URL and expiry.
 * 
 * Throws:
 * - 409 Conflict if shortcode already exists.
 */

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
    shortLink: `http://localhost:3001/${code}`,
    expiry,
  };
}


/**
 * Function: getUrlStats
 * -----------------------
 * Fetches analytical statistics for a given shortcode.
 * 
 * Parameters:
 * - shortcode: string (the unique identifier for a shortened URL)
 * 
 * Returns:
 * - Object containing:
 *   - original URL
 *   - creation and expiry timestamps
 *   - total click count
 *   - click history: timestamp, referrer, location
 * 
 * Throws:
 * - 404 Not Found if the shortcode does not exist in the store.
 */

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
