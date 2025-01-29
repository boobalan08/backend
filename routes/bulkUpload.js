const express = require("express");
const multer = require("../middlewares/multerConfig");
const path = require("path");
const File = require("../models/file");
const fileQueue = require("../queues/fileQueue");
const authenticateUser = require("../middlewares/auth");
const router = express.Router();
const fs = require("fs");

router.post(
  "/",
  authenticateUser,
  multer.array("files", 10),
  async (req, res) => {
    try {
      const userId = req.user.id;
      const files = req.files;
      if (!files || files.length === 0) {
        return res
          .status(400)
          .json({ success: false, message: "No files uploaded." });
      }
      const uploadedFiles = [];
      // Save files to the database and process them
      for (const file of files) {
        const format = path.extname(file.originalname).slice(1);
        // Save file record to the database
        const fileRecord = await File.create({
          name: file.originalname,
          format,
          status: "pending",
          userId,
        });
        uploadedFiles.push({
          filename: file.originalname, // Return original filename
          filePath: `/uploads/${file.filename}`, // Add the file path in the response
        });
        // Process file queue (for further processing after upload)
        fileQueue.add({ id: fileRecord.id, filename: file.filename });
      }

      res.status(200).json({
        success: true,
        message: "Files uploaded successfully.",
        files: uploadedFiles,
      });
    } catch (err) {
      console.error("Error in bulk upload:", err);
      res
        .status(500)
        .json({ success: false, message: "Error during bulk upload." });
    }
  }
);

router.get("/uploadedFiles", authenticateUser, async (req, res) => {
  try {
    const userId = req.user.id; // Get the authenticated user's ID

    // Fetch files uploaded by the user
    const files = await File.findAll({
      where: { userId }, // Filter by userId
      attributes: ["id", "name", "format", "status", "createdAt"], // Select relevant fields
      order: [["createdAt", "DESC"]], // Sort by newest uploads
    });

    if (!files.length) {
      return res.status(200).json({
        success: false,
        message: "No uploaded files found for this user.",
      });
    }

    res.status(200).json({
      success: true,
      files,
    });
  } catch (err) {
    console.log("Error fetching uploaded files:", err);
    res.status(500).json({
      success: false,
      message: "Error retrieving uploaded files.",
    });
  }
});

router.delete("/uploadedFiles/:id", authenticateUser, async (req, res) => {
  try {
    const userId = req.user.id; // Get the authenticated user's ID
    const fileId = req.params.id; // Get the file ID from the request params

    // Find the file in the database
    const file = await File.findOne({ where: { id: fileId, userId } });

    if (!file) {
      return res.status(404).json({
        success: false,
        message: "File not found or unauthorized to delete.",
      });
    }

    // Define file path (assuming files are stored in '/uploads/')
    const filePath = path.join(__dirname, "../uploads", file.name);

    // Delete the file from the storage (optional)
    if (fs.existsSync(filePath)) {
      fs.unlinkSync(filePath); // Remove file from disk
    }

    // Delete the file record from the database
    await File.destroy({ where: { id: fileId } });

    res.status(200).json({
      success: true,
      message: "File deleted successfully.",
    });
  } catch (err) {
    console.error("Error deleting file:", err);
    res.status(500).json({
      success: false,
      message: "Error deleting file.",
    });
  }
});

module.exports = router;
