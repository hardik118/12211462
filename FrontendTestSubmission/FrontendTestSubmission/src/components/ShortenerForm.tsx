import {
  Box,
  TextField,
  Typography,
  Alert,
} from "@mui/material";
import { Grid } from "@mui/material";

import { useState, forwardRef, useImperativeHandle } from "react";
import axios from "axios";
import { logFrontend } from "../api/logger";

//  This interface defines what each row of input will look like.
// Each URL row can have the URL, optional validity period, and custom shortcode.
interface InputRow {
  url: string;
  validity?: string;
  shortcode?: string;
}

//  This interface defines what the API will return for each successful URL shortened.
interface ShortenResult {
  originalUrl: string;
  shortLink: string;
  expiry: string;
}

//  This component lets users enter up to 5 URLs to shorten.
// It uses forwardRef so the parent (like Home.tsx) can trigger submission externally.
const ShortenerForm = forwardRef((_, ref) => {
  const [inputs, setInputs] = useState<InputRow[]>([{ url: "" }]);
  const [results, setResults] = useState<ShortenResult[]>([]);
  const [error, setError] = useState<string | null>(null);

  //  This lets the parent component (e.g. Home page) trigger form submission using a button outside this component.
  useImperativeHandle(ref, () => ({
    submit: handleSubmit,
  }));

  //  Update a specific input row when the user types something.
  const handleInputChange = (index: number, field: keyof InputRow, value: string) => {
    const newInputs = [...inputs];
    newInputs[index] = { ...newInputs[index], [field]: value };
    setInputs(newInputs);
  };

  //  Adds a new empty URL input row (up to 5 only).
  const addInput = () => {
    if (inputs.length >= 5) return;
    setInputs([...inputs, { url: "" }]);
  };

  //  Simple client-side check to make sure user entered a valid URL format.
  const validateUrl = (url: string) => /^(http|https):\/\/.+/.test(url);

  // This is the main function that sends all valid URLs to the backend for shortening.
  const handleSubmit = async () => {
    setError(null);
    const validRequests = inputs.filter((inp) => validateUrl(inp.url));
    
    // If none of the entered URLs are valid, show an error.
    if (!validRequests.length) {
      setError("Please provide at least one valid URL.");
      return;
    }

    try {
      const resData: ShortenResult[] = [];

      // Loop through valid URLs and send them one-by-one to the backend.
      for (const input of validRequests) {
        const res = await axios.post("http://localhost:3001", {
          url: input.url,
          shortcode: input.shortcode || undefined,
          validity: input.validity ? parseInt(input.validity) : undefined,
        });

        // On success, push the response into result list to display to user.
        resData.push({
          originalUrl: input.url,
          shortLink: res.data.shortLink,
          expiry: res.data.expiry,
        });

        // Log the event using our custom logger (not console.log).
        await logFrontend("info", "component", `Shortened URL: ${input.url}`);
      }

      // Store all successful results to render them below.
      setResults(resData);

      const newCodes = resData.map(r => r.shortLink.split("/").pop());
      sessionStorage.setItem("shortcodes", JSON.stringify(newCodes));
      
    } catch (err: unknown) {
      // Error handling: If axios fails, show a clean message and log it.
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
      {/* Input form fields for each row */}
      {inputs.map((input, index) => (
        <Box key={index} sx={{ mb: 2, p: 2, border: "1px solid #ddd", borderRadius: 2 }}>
          <Grid container spacing={2}>
            {/* Long URL input */}
            <Grid  xs={12} sm={6}>
              <TextField
                fullWidth
                label="Long URL"
                value={input.url}
                onChange={(e) => handleInputChange(index, "url", e.target.value)}
              />
            </Grid>

            {/*  Optional validity period in minutes */}
            <Grid item xs={6} sm={3}>
              <TextField
                fullWidth
                label="Validity (min)"
                type="number"
                value={input.validity || ""}
                onChange={(e) => handleInputChange(index, "validity", e.target.value)}
              />
            </Grid>

            {/*  Optional custom shortcode */}
            <Grid item xs={6} sm={3}>
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

      {/* Allow up to 5 rows */}
      {inputs.length < 5 && (
        <Box sx={{ mb: 2 }}>
          <TextField
            type="button"
            value="+ Add URL"
            fullWidth
            onClick={addInput}
            sx={{ cursor: "pointer", background: "#f5f5f5" }}
          />
        </Box>
      )}

      {/* Display any error to the user */}
      {error && <Alert severity="error" sx={{ mt: 2 }}>{error}</Alert>}

      {/* If URLs were shortened, show the results here */}
      {results.length > 0 && (
  <Box sx={{ mt: 4 }}>
    <Typography variant="h6" gutterBottom>
      Results
    </Typography>
    <Grid container spacing={2}>
      {results.map((res, idx) => (
        <Grid item xs={12} sm={6} md={4} key={idx}>
          <Box
            sx={{
              border: "1px solid #ddd",
              borderRadius: 2,
              p: 2,
              boxShadow: 2,
              backgroundColor: "#f9f9f9",
              transition: "0.3s",
              "&:hover": {
                boxShadow: 4,
              },
            }}
          >
            <Typography variant="subtitle2" gutterBottom>
              <strong>Original:</strong>
              <Typography variant="body2" color="text.secondary" noWrap>
                {res.originalUrl}
              </Typography>
            </Typography>

            <Typography variant="subtitle2" gutterBottom>
              <strong>Short Link:</strong>
              <Typography variant="body2">
                <a
                  href={res.shortLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{ color: "#1976d2" }}
                >
                  {res.shortLink}
                </a>
              </Typography>
            </Typography>

            <Typography variant="subtitle2">
              <strong>Expiry:</strong>{" "}
              <Typography variant="body2" color="text.secondary">
                {new Date(res.expiry).toLocaleString()}
              </Typography>
            </Typography>
          </Box>
        </Grid>
      ))}
    </Grid>
  </Box>
)}

    </Box>
  );
});

export default ShortenerForm;
