import { Router } from "express";
import {
  createShortUrl,
  getShortUrlStats,
  redirectToOriginalUrl
} from "../controllers/shorturlController";

const router = Router();
/**
 * POST /
 * ----------------
 * Route: /shorturls
 * Handles creation of a new shortened URL.
 * Request body should include:
 * - url (required)
 * - shortcode (optional)
 * - validity (optional)
 * 
 * The controller performs validation and invokes the service layer.
 */

router.post("/", createShortUrl); 
/**
 * GET /stats/:shortcode
 * -------------------------
 * Route: /shorturls/stats/:shortcode
 * Returns analytics and statistics for a specific shortened URL.
 * 
 * Note: Using a `stats/` prefix in the route path avoids conflicts
 * with actual shortcodes (which may be alphanumeric).
 */

router.get("/stats/:shortcode", getShortUrlStats); 

/**
 * GET /:shortcode
 * ---------------------
 * Route: /shorturls/:shortcode
 * Redirects to the original long URL for the given shortcode.
 * 
 * This route is matched last to ensure it doesn't clash with
 * specific named routes like `/stats/:shortcode`.
 */
router.get("/:shortcode", redirectToOriginalUrl); 

export default router;
