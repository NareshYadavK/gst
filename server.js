import express from "express";
import fetch from "node-fetch";

const app = express();

// CORS Policy
app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "*"); // change "*" to your domain if needed
  res.header("Access-Control-Allow-Headers", "Content-Type");
  next();
});

app.get("/gst", async (req, res) => {
  const gstin = req.query.GSTIN;

  if (!gstin) {
    return res.status(400).json({ error: "GSTIN parameter missing" });
  }

  const apiURL = `https://einvoice1.gst.gov.in/others/GetGstinInfo?GSTIN=${encodeURIComponent(gstin)}`;

  try {
    const response = await fetch(apiURL);
    const data = await response.json();
    res.json(data);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch GST Data", details: err.message });
  }
});

const port = process.env.PORT || 3000;
app.listen(port, () => console.log(`Server running on port ${port}`));
