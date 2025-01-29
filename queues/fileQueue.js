const Bull = require("bull");
const path = require("path");
const fs = require("fs");
const xlsx = require("xlsx");
const File = require("../models/file");

const fileProcessingQueue = new Bull("file-processing-queue");

fileProcessingQueue.process(async (job) => {
  const { id, filename } = job.data;
  const filePath = path.join(__dirname, "../uploads", filename);

  try {
    const fileRecord = await File.findByPk(id);
    if (!fileRecord) throw new Error("File record not found");

    fileRecord.status = "processing";
    await fileRecord.save();

    if (filename.endsWith(".xlsx")) {
      try {
        const workbook = xlsx.readFile(filePath);
        console.log("Parsed XLSX file:", workbook.SheetNames);
      } catch (xlsxError) {
        console.error("Error parsing XLSX file:", filename, xlsxError);
        throw new Error("Invalid XLSX file format");
      }
    } else if (filename.endsWith(".pdf")) {
      console.log("Processing PDF file:", filename);
    } else if (filename.endsWith(".jpeg")) {
      console.log("Processing JPEG image:", filename);
    } else if (filename.endsWith(".docx")) {
      console.log("Processing DOCX file:", filename);
    }

    fileRecord.status = "completed";
    await fileRecord.save();
  } catch (err) {
    console.error("Error processing file:", filename, err);
    const fileRecord = await File.findByPk(id);
    if (fileRecord) {
      fileRecord.status = "failed";
      await fileRecord.save();
    }
    throw err; 
  } finally {
    try {
      await fs.promises.unlink(filePath);
    } catch (err) {
      console.error("Error deleting file:", filePath, err);
    }
  }
});

module.exports = fileProcessingQueue;
