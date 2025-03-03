const express = require("express");
const multer = require("multer");
const { exec } = require("child_process");
const path = require("path");
const cors = require("cors");

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

// Use memory storage instead of writing to disk
const storage = multer.memoryStorage();
const upload = multer({ storage });

// File Upload Route
app.post("/api/upload", upload.single("file"), (req, res) => {
  if (!req.file) return res.status(400).send("No file uploaded.");

  // Convert buffer data to a temporary file
  const filePath = `/tmp/${req.file.originalname}`;
  require("fs").writeFileSync(filePath, req.file.buffer);

  // Run backend.sh with the uploaded file
  exec(`bash backend.sh ${filePath}`, (error, stdout, stderr) => {
    if (error) return res.status(500).send(stderr);
    res.send(`<pre>${stdout}</pre>`);
  });
});

// Start server locally
if (process.env.NODE_ENV !== "production") {
  app.listen(PORT, () => {
    console.log(`Server running at http://localhost:${PORT}`);
  });
}

// Export handler for Vercel
module.exports = app;
