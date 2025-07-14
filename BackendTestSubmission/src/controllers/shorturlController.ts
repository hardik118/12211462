import { Request, Response, NextFunction } from "express";
import { createUrlEntry, getUrlStats } from "../services/shortUrlService";
import { store } from "../db/db";
import { logBackend } from "../utlis/backendLogger";

/**
 * Controller: createShortUrl
 * ---------------------------
 * Handles the creation of a shortened URL.
 * - Validates the presence and type of the 'url' field in the request.
 * - Delegates the logic to `createUrlEntry`, which also handles optional validity and custom shortcode.
 * - Returns the shortened link and expiry.
 * 
 * Error handling is delegated to the global error middleware.
 */
export async function createShortUrl(req: Request, res: Response, next: NextFunction) {
  try {
    const { url, validity, shortcode } = req.body;

    if (!url || typeof url !== "string") {
      return res.status(400).json({ error: "Missing or invalid 'url'" });
    }

    const result = await createUrlEntry(url, validity, shortcode);

    res.status(201).json(result);
  } catch (err) {
    next(err);
  }
}
/**
 * Controller: getShortUrlStats
 * -----------------------------
 * Returns usage statistics for a specific shortened URL.
 * - Extracts the shortcode from the request params.
 * - Retrieves corresponding analytics from the store.
 * - Returns number of clicks, creation/expiry times, and click metadata.
 */
export async function getShortUrlStats(req: Request, res: Response, next: NextFunction) {
  try {
    const shortcode = req.params.shortcode;
    const stats = await getUrlStats(shortcode);

    res.status(200).json(stats);
  } catch (err) {
    next(err);
  }
}

/**
 * Controller: redirectToOriginalUrl
 * ----------------------------------
 * Handles redirection from a shortcode to the original URL.
 * - Looks up the shortcode in the in-memory store.
 * - Validates its existence and expiry.
 * - Logs each successful or failed redirection attempt.
 * - Records the click with metadata (timestamp, IP, referrer).
 */

export async function redirectToOriginalUrl(req: Request, res: Response) {
  const shortcode = req.params.shortcode;

  const entry = store.get(shortcode);

  if (!entry) {
    await logBackend("warn", "handler", `Shortcode not found: ${shortcode}`);
    return res.status(404).json({ error: "Short URL not found" });
  }

  const now = new Date();
  const expiry = new Date(entry.expiry);

  if (now > expiry) {
   await logBackend("warn", "handler", `Shortcode expired: ${shortcode}`);
    return res.status(410).json({ error: "Short URL has expired" });
  }

  // Log click
  entry.clicks.push({
    timestamp: now.toISOString(),
    referrer: req.get("referer") || undefined,
    location: req.ip || "unknown",
  });

  await logBackend("info", "route", `Redirecting shortcode ${shortcode} to ${entry.originalUrl}`);

  return res.redirect(entry.originalUrl);
}