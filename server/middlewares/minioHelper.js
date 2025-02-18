import { minioClient } from "../socket/server.js";
import fs from "fs";

const bucket = "chat-app-object-db";

async function isBucketExists() {
  try {
    const exists = await minioClient.bucketExists(bucket);
    if (!exists) {
      await minioClient.makeBucket(bucket, "");
      console.log(`Bucket "${bucket}" created`);
    }
  } catch (error) {
    console.error("Error checking or creating MinIO bucket:", error);
  }
}

isBucketExists();

export async function getFileUrlFromMinio(req, res) {
  try {
    const { fileName } = req.params;
    const url = await minioClient.presignedGetObject(bucket, fileName, 60 * 60);
    console.log("Generated object url: ", url);
    res.redirect(url.replace("http://minio:9000", "http://localhost:9000"));

  } catch (error) {
    console.log(`Error generating presigned url: ${error.message}`);
    res.status(500).json({error: error.message});
  }
}

export async function uploadFileToMinio(req, res, next) {
  try {
    if (!req.file) {
      console.log("No file uploaded");
      next();
    }

    const filePath = req.file.path;
    const objectName = req.file.filename;

    await minioClient.fPutObject(bucket, objectName, filePath);
    console.log(`File "${objectName}" uploaded to MinIO`);

    // delete the local file
    fs.unlink(filePath, (err) => {
      if (err) console.error("Error deleting local file:", err);
    });

    next();

  } catch (error) {
    console.error("MinIO upload error:", error);
    res.status(500).json({ error: "File upload failed" });
  }
}
