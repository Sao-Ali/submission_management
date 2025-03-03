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

    // Save uploaded file in /tmp/ (Vercel allows writing here)
    const filePath = `/tmp/${req.file.originalname}`;
    fs.writeFileSync(filePath, req.file.buffer);

    // Ensure backend.sh is in the correct location
    const scriptPath = "/tmp/backend.sh";
    const originalScriptPath = path.join(__dirname, "backend.sh"); // Corrected reference

    // Copy backend.sh to /tmp/ before execution
    try {
      fs.copyFileSync(originalScriptPath, scriptPath);
      fs.chmodSync(scriptPath, "755"); // Ensure it's executable
    } catch (copyError) {
      return res.status(500).send(`Error copying backend.sh: ${copyError.message}`);
    }

    // Execute backend.sh on the uploaded file
    exec(`bash ${scriptPath} ${filePath}`, (error, stdout, stderr) => {
      if (error) return res.status(500).send(`Script Error: ${stderr}`);
      res.setHeader("Content-Type", "text/plain");
      return res.status(200).send(stdout);
    });
  });
};
