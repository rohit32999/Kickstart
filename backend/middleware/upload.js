const multer = require("multer");
const fs = require("fs");
const path = require("path");

// Ensure the directory exists
const ensureDirExists = (dir) => {
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
};

// Configure storage for images & resumes
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    let uploadDir = "";

    if (file.fieldname === "profilePic") uploadDir = "uploads/profile_pics/";
    else if (file.fieldname === "resume") uploadDir = "uploads/resumes/";

    // Ensure the upload directory exists
    if (uploadDir) {
      ensureDirExists(uploadDir);
      cb(null, uploadDir);
    } else {
      cb(new Error("Invalid fieldname for upload"), null);
    }
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + path.extname(file.originalname));
  },
});

// File filter (allow only images & PDFs)
const fileFilter = (req, file, cb) => {
  if (file.fieldname === "profilePic" && file.mimetype.startsWith("image/")) cb(null, true);
  else if (file.fieldname === "resume" && file.mimetype === "application/pdf") cb(null, true);
  else cb(new Error("Invalid file type! Only images & PDFs allowed."), false);
};

// Upload middleware
const upload = multer({ storage, fileFilter });

module.exports = upload;
