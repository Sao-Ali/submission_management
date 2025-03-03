const cors = require("cors");
const multer = require("multer");
const { exec } = require("child_process");
const fs = require("fs");
const path = require("path");

const storage = multer.memoryStorage();
const upload = multer({ storage });

module.exports = async (req, res) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");

  if (req.method === "OPTIONS") {
    return res.status(200).end();
  }

  if (req.method !== "POST") {
    return res.status(405).send("Method Not Allowed");
  }

  upload.single("file")(req, res, function (err) {
    if (err) return res.status(500).send("File upload error.");
    if (!req.file) return res.status(400).send("No file uploaded.");

    const filePath = `/tmp/${req.file.originalname}`;
    fs.writeFileSync(filePath, req.file.buffer);

    const scriptPath = "/tmp/backend.sh";
    const checksumPath = "/tmp/checksum";
    const originalScriptPath = path.join(__dirname, "backend.sh");
    const originalChecksumPath = path.join(__dirname, "checksum");

    try {
      fs.copyFileSync(originalScriptPath, scriptPath);
      fs.copyFileSync(originalChecksumPath, checksumPath);
      fs.chmodSync(scriptPath, "755");
      fs.chmodSync(checksumPath, "755");
    } catch (copyError) {
      return res.status(500).send(`Error copying backend.sh or checksum: ${copyError.message}`);
    }

    exec(`bash ${scriptPath} ${filePath}`, (error, stdout, stderr) => {
      if (error) return res.status(500).send(`Script Error: ${stderr}`);
      res.setHeader("Content-Type", "text/plain");
      return res.status(200).send(stdout);
    });
  });
};
