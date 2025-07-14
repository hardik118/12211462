// src/components/ShortenerForm.tsx
import {
  Box,
  Button,
  TextField,
  Typography,
  Alert,
} from "@mui/material";
import Grid from "@mui/material/Grid";

import { useState } from "react";
import axios from "axios";
import { logFrontend } from "../api/logger";

interface InputRow {
  url: string;
  validity?: string;
  shortcode?: string;
}

interface ShortenResult {
  originalUrl: string;
  shortLink: string;
  expiry: string;
}

export default function ShortenerForm() {
  const [inputs, setInputs] = useState<InputRow[]>([
    { url: "" },
  ]);
  const [results, setResults] = useState<ShortenResult[]>([]);
  const [error, setError] = useState<string | null>(null);

  const handleInputChange = (index: number, field: keyof InputRow, value: string) => {
    const newInputs = [...inputs];
    newInputs[index] = { ...newInputs[index], [field]: value };
    setInputs(newInputs);
  };

  const addInput = () => {
    if (inputs.length >= 5) return;
    setInputs([...inputs, { url: "" }]);
  };

  const validateUrl = (url: string) => {
    return /^(http|https):\/\/.+/.test(url);
  };

  const handleSubmit = async () => {
    setError(null);
    const validRequests = inputs.filter((inp) => validateUrl(inp.url));
    if (!validRequests.length) {
      setError("Please provide at least one valid URL.");
      return;
    }

    try {
      const resData: ShortenResult[] = [];

      for (const input of validRequests) {
        const res = await axios.post("http://localhost:3001/shorturls", {
          url: input.url,
          shortcode: input.shortcode || undefined,
          validity: input.validity ? parseInt(input.validity) : undefined,
        });

        resData.push({
          originalUrl: input.url,
          shortLink: res.data.shortLink,
          expiry: res.data.expiry,
        });

        await logFrontend("info", "component", `Shortened URL: ${input.url}`);
      }

      setResults(resData);
    } catch (err: unknown) {
      if (axios.isAxiosError(err)) {
        setError(err.response?.data?.message || "Failed to shorten URLs.");
        await logFrontend("error", "component", `Error shortening URL: ${err.message}`);
      } else {
        setError("Unexpected error occurred.");
      }
    }
  };

  return (
    <Box>
      {inputs.map((input, index) => (
        <Box key={index} sx={{ mb: 2, p: 2, border: "1px solid #ddd", borderRadius: 2 }}>
          <Grid container spacing={2}>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Long URL"
                value={input.url}
                onChange={(e) => handleInputChange(index, "url", e.target.value)}
              />
            </Grid>
            <Grid item xs={6} sm={3}>
              <TextField
                fullWidth
                label="Validity (min)"
                type="number"
                value={input.validity || ""}
                onChange={(e) => handleInputChange(index, "validity", e.target.value)}
              />
            </Grid>
            <Grid item  xs={6} sm={3}>
              <TextField
                fullWidth
                label="Custom Shortcode"
                value={input.shortcode || ""}
                onChange={(e) => handleInputChange(index, "shortcode", e.target.value)}
              />
            </Grid>
          </Grid>
        </Box>
      ))}

      {inputs.length < 5 && (
        <Button variant="outlined" onClick={addInput} sx={{ mb: 2 }}>
          + Add URL
        </Button>
      )}

      <Button variant="contained" onClick={handleSubmit}>
        Shorten URLs
      </Button>

      {error && <Alert severity="error" sx={{ mt: 2 }}>{error}</Alert>}

      {results.length > 0 && (
        <Box sx={{ mt: 4 }}>
          <Typography variant="h6">Results</Typography>
          {results.map((res, idx) => (
            <Box key={idx} sx={{ mt: 1 }}>
              <Typography variant="body2">
                <strong>Original:</strong> {res.originalUrl}
              </Typography>
              <Typography variant="body2">
                <strong>Short Link:</strong>{" "}
                <a href={res.shortLink} target="_blank" rel="noopener noreferrer">
                  {res.shortLink}
                </a>
              </Typography>
              <Typography variant="body2">
                <strong>Expiry:</strong> {new Date(res.expiry).toLocaleString()}
              </Typography>
            </Box>
          ))}
        </Box>
      )}
    </Box>
  );
}
