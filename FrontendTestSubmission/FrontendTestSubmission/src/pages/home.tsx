// src/pages/Home.tsx
import { Box, Button, Typography, Stack } from "@mui/material";
import ShortenerForm from "../components/ShortenerForm";
import { logFrontend } from "../api/logger";
import { useEffect, useRef } from "react";

export default function Home() {
  const formRef = useRef<{ submit: () => void }>(null);

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

      {/* Pass formRef so you can trigger submit from outside */}
      <ShortenerForm ref={formRef} />

      {/* Align buttons side by side */}
      <Stack direction="row" spacing={2} sx={{ mt: 4 }}>
        <Button variant="contained" onClick={() => formRef.current?.submit()}>
          Shorten URLs
        </Button>
        <Button variant="outlined" href="/stats">
          View Stats
        </Button>
      </Stack>
    </Box>
  );
}
