// src/components/StatsPage.tsx
import {
  Box,
  Typography,
  List,
  ListItem,
  ListItemText,
  CircularProgress,
  Alert,
  Card,
  CardContent,
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
          const res = await axios.get(`http://localhost:3001/stats/${code}`);
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
    <Box sx={{ maxWidth: 900, mx: "auto", mt: 6, px: 2 }}>
      <Typography
        variant="h4"
        sx={{
          mb: 4,
          fontWeight: "bold",
          color: "#1976d2", // Blue
          textAlign: "center",
        }}
      >
        Short URL Statistics
      </Typography>

      {stats.map((s, idx) => (
        <Card key={idx} sx={{ mb: 4, borderRadius: 3, boxShadow: 3 }}>
          <CardContent>
            <Typography variant="h6" color="primary" sx={{ mb: 1 }}>
              Shortcode: {s.shortcode}
            </Typography>
            <Typography variant="body1">
              <strong>Original URL:</strong> {s.originalUrl}
            </Typography>
            <Typography variant="body1">
              <strong>Created At:</strong> {new Date(s.createdAt).toLocaleString()}
            </Typography>
            <Typography variant="body1">
              <strong>Expires At:</strong> {new Date(s.expiry).toLocaleString()}
            </Typography>
            <Typography variant="body1">
              <strong>Total Clicks:</strong> {s.totalClicks}
            </Typography>

            <Typography variant="subtitle1" sx={{ mt: 2, fontWeight: "bold" }}>
              Click History:
            </Typography>
            <List dense>
              {s.clickHistory.map((click, i) => (
                <ListItem key={i} alignItems="flex-start" disablePadding sx={{ mb: 1 }}>
                  <ListItemText
                    primary={`Clicked at: ${new Date(click.timestamp).toLocaleString()}`}
                    secondary={`Referrer: ${click.referrer || "N/A"}, Location: ${click.location}`}
                  />
                </ListItem>
              ))}
            </List>
          </CardContent>
        </Card>
      ))}

      {!stats.length && (
        <Typography align="center" color="text.secondary">
          No statistics available. Please shorten some URLs first.
        </Typography>
      )}
    </Box>
  );
}
