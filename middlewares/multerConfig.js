const fs = require("fs");
const multer = require("multer");
const path = require("path");

// Define the upload directory
const uploadDir = path.join(__dirname, "../uploads");

// Ensure the uploads directory exists
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, uploadDir); // Save files to the 'uploads' folder
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(
      null,
      file.fieldname + "-" + uniqueSuffix + path.extname(file.originalname)
    ); // Ensure original extension is kept
  },
});

const fileFilter = (req, file, cb) => {
  const allowedFormats = [
    "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet", // XLSX
    "application/pdf", // PDF
    "image/jpeg", // JPEG
    "application/vnd.openxmlformats-officedocument.wordprocessingml.document", // DOCX
  ];
  if (allowedFormats.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error("Unsupported file format"), false);
  }
};

const upload = multer({ storage, fileFilter });

module.exports = upload;
