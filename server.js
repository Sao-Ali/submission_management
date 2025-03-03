const express = require("express");
const multer = require("multer");
const { exec } = require("child_process");
const path = require("path");
const cors = require("cors");

const app = express();
const PORT = 3000;

app.use(cors());
app.use(express.static("public"));

// Set up the file upload handling
const storage = multer.diskStorage({
  destination: "./uploads/",
  filename: (req, file, cb) => {
    cb(null, file.originalname);
  },
});
const upload = multer({ storage });

// Routing for file uploads
app.post("/upload", upload.single("file"), (req, res) => {
  if (!req.file) return res.status(400).send("No file uploaded.");

  const filePath = path.join(__dirname, "uploads", req.file.filename);

  // Runing the backend.sh on the uploaded file
  exec(`bash backend.sh ${filePath}`, (error, stdout, stderr) => {
    if (error) return res.status(500).send(stderr);
    res.send(`<pre>${stdout}</pre>`);
  });
});

// Start server
app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});

