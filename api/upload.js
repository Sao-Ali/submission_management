const multer = require("multer");
const { exec } = require("child_process");
const fs = require("fs");
const path = require("path");

const storage = multer.memoryStorage();
const upload = multer({ storage });

module.exports = async (req, res) => {
  if (req.method !== "POST") {
    return res.status(405).send("Method Not Allowed");
  }

  upload.single("file")(req, res, function (err) {
    if (err) return res.status(500).send("File upload error.");
    if (!req.file) return res.status(400).send("No file uploaded.");

    // Save the uploaded file in /tmp/ (Vercel allows writing here)
    const filePath = `/tmp/${req.file.originalname}`;
    fs.writeFileSync(filePath, req.file.buffer);

    // Define correct paths for backend.sh and checksum
    const scriptPath = "/tmp/backend.sh";
    const checksumPath = "/tmp/checksum";
    const originalScriptPath = path.join(__dirname, "backend.sh");
    const originalChecksumPath = path.join(__dirname, "checksum");

    try {
      // Copy backend.sh and checksum to /tmp/ before execution
      fs.copyFileSync(originalScriptPath, scriptPath);
      fs.copyFileSync(originalChecksumPath, checksumPath);
      fs.chmodSync(scriptPath, "755"); // Ensure backend.sh is executable
      fs.chmodSync(checksumPath, "755"); // Ensure checksum is executable
    } catch (copyError) {
      return res.status(500).send(`Error copying backend.sh or checksum: ${copyError.message}`);
    }

    // Execute backend.sh on the uploaded file
    exec(`bash ${scriptPath} ${filePath}`, (error, stdout, stderr) => {
      if (error) return res.status(500).send(`Script Error: ${stderr}`);
      res.setHeader("Content-Type", "text/plain");
      return res.status(200).send(stdout);
    });
  });
};
