// src/pages/Home.tsx
import { Box, Button, Typography } from "@mui/material";
import ShortenerForm from "../components/ShortenerForm";
import { logFrontend } from "../api/logger";
import { useEffect } from "react";

export default function Home() {
  useEffect(() => {
    logFrontend("info", "page", "Visited Home (Shortener) Page");
  }, []);

  return (
    <Box sx={{ maxWidth: 800, mx: "auto", mt: 6, px: 2 }}>
      <Typography variant="h4" gutterBottom>
        URL Shortener
      </Typography>
      <Typography variant="body1" gutterBottom>
        You can shorten up to 5 URLs at once. Optionally, set expiry or provide a custom shortcode.
      </Typography>
      <ShortenerForm />
      <Box sx={{ mt: 4 }}>
        <Button variant="outlined" href="/stats">
          View Stats
        </Button>
      </Box>
    </Box>
  );
}
