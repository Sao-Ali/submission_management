const multer = require("multer");
const { exec } = require("child_process");
const fs = require("fs");
const path = require("path");

const storage = multer.memoryStorage();
const upload = multer({ storage });

module.exports = async (req, res) => {
  if (req.method === "POST") {
    upload.single("file")(req, res, function (err) {
      if (err) return res.status(500).send("File upload error.");

      if (!req.file) return res.status(400).send("No file uploaded.");

      const filePath = `/tmp/${req.file.originalname}`;
      fs.writeFileSync(filePath, req.file.buffer);

      exec(`bash backend.sh ${filePath}`, (error, stdout, stderr) => {
        if (error) return res.status(500).send(stderr);
        res.setHeader("Content-Type", "text/plain");
        return res.status(200).send(stdout);
      });
    });
  } else {
    res.status(405).send("Method Not Allowed");
  }
};
