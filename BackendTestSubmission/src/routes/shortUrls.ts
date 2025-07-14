import { Router } from "express";
import {
  createShortUrl,
  getShortUrlStats,
  redirectToOriginalUrl
} from "../controllers/shorturlController";

const router = Router();

router.post("/", createShortUrl); // POST /shorturls

// ✅ Add a base path to avoid conflict
router.get("/stats/:shortcode", getShortUrlStats); // GET /shorturls/stats/:shortcode

// ✅ Keep redirect as is (base path handles separation)
router.get("/:shortcode", redirectToOriginalUrl); // GET /shorturls/:shortcode

export default router;
