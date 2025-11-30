// server.js
import express from "express";
import fetch from "node-fetch";
import cors from "cors";

const app = express();
const PORT = process.env.PORT || 3000;

// Allow your frontend origin (for now, allow all with cors())
app.use(cors());
app.use(express.json());

const GST_API_BASE = "https://einvoice1.gst.gov.in/others/GetGstinInfo?GSTIN=";

// Simple health check
app.get("/", (req, res) => {
  res.send("GSTIN proxy backend is running ✅");
});

// Proxy endpoint: /api/gstin/:gstin
app.get("/api/gstin/:gstin", async (req, res) => {
  const { gstin } = req.params;

  if (!gstin) {
    return res.status(400).json({ error: "GSTIN is required" });
  }

  try {
    const response = await fetch(GST_API_BASE + gstin);
    if (!response.ok) {
      return res
        .status(response.status)
        .json({ error: `Upstream error: ${response.status}` });
    }

    const data = await response.json();
    // Just relay the JSON from GST API
    res.json(data);
  } catch (err) {
    console.error("Error calling GST API:", err);
    res.status(500).json({ error: "Internal server error" });
  }
});

// Start server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
