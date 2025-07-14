// src/components/StatsPage.tsx
import {
  Box,
  Typography,
  List,
  ListItem,
  ListItemText,
  Divider,
  CircularProgress,
  Alert,
} from "@mui/material";
import { useEffect, useState } from "react";
import axios from "axios";
import { logFrontend } from "../api/logger";

interface ClickInfo {
  timestamp: string;
  referrer: string;
  location: string;
}

interface UrlStats {
  shortcode: string;
  originalUrl: string;
  createdAt: string;
  expiry: string;
  totalClicks: number;
  clickHistory: ClickInfo[];
}

export default function StatsPage() {
  const [shortcodes, setShortcodes] = useState<string[]>([]);
  const [stats, setStats] = useState<UrlStats[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Optionally: Load shortcodes from localStorage or memory
    const stored = sessionStorage.getItem("shortcodes");
    if (stored) {
      setShortcodes(JSON.parse(stored));
    }
  }, []);

  useEffect(() => {
    const fetchStats = async () => {
      setLoading(true);
      setError(null);
      try {
        const results: UrlStats[] = [];
        for (const code of shortcodes) {
          const res = await axios.get(`http://localhost:3001/shorturls/${code}`);
          results.push(res.data);
          await logFrontend("info", "component", `Fetched stats for ${code}`);
        }
        setStats(results);
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      } catch (err: any) {
        setError("Failed to fetch stats.");
        await logFrontend("error", "component", `Error fetching stats: ${err.message}`);
      } finally {
        setLoading(false);
      }
    };

    if (shortcodes.length) fetchStats();
  }, [shortcodes]);

  if (loading) return <CircularProgress />;
  if (error) return <Alert severity="error">{error}</Alert>;

  return (
    <Box>
      <Typography variant="h5" sx={{ mb: 2 }}>Short URL Stats</Typography>
      {stats.map((s, idx) => (
        <Box key={idx} sx={{ mb: 4 }}>
          <Typography variant="h6">Shortcode: {s.shortcode}</Typography>
          <Typography>Original URL: {s.originalUrl}</Typography>
          <Typography>Created At: {new Date(s.createdAt).toLocaleString()}</Typography>
          <Typography>Expires At: {new Date(s.expiry).toLocaleString()}</Typography>
          <Typography>Total Clicks: {s.totalClicks}</Typography>

          <Typography sx={{ mt: 1 }}>Click History:</Typography>
          <List>
            {s.clickHistory.map((click, i) => (
              <ListItem key={i} alignItems="flex-start">
                <ListItemText
                  primary={`Clicked at: ${new Date(click.timestamp).toLocaleString()}`}
                  secondary={`Referrer: ${click.referrer}, Location: ${click.location}`}
                />
              </ListItem>
            ))}
          </List>
          <Divider sx={{ mt: 2 }} />
        </Box>
      ))}
    </Box>
  );
}
