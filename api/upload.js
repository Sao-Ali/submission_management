const express = require("express");
const multer = require("multer");
const { exec } = require("child_process");
const path = require("path");
const cors = require("cors");

const app = express();
app.use(cors());
app.use(express.json());

const storage = multer.memoryStorage();
const upload = multer({ storage });

app.post("/api/upload", upload.single("file"), (req, res) => {
  if (!req.file) return res.status(400).send("No file uploaded.");

  const filePath = `/tmp/${req.file.originalname}`;
  require("fs").writeFileSync(filePath, req.file.buffer);

  exec(`bash backend.sh ${filePath}`, (error, stdout, stderr) => {
    if (error) return res.status(500).send(stderr);
    res.send(`<pre>${stdout}</pre>`);
  });
});

module.exports = app;
