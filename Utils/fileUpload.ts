import { uploadFileToS3 } from "./s3-utils";
import fs from "fs";

// File type validation
const isValidFileType = (filename: string, mimetype: string): boolean => {
  // Handle undefined or null values
  if (!filename || !mimetype) {
    console.log("Invalid file validation input:", { filename, mimetype });
    return false;
  }

  const allowedTypes = /jpeg|jpg|png|gif|pdf|doc|docx/;
  const extname = allowedTypes.test(filename.toLowerCase());
  const mimeCheck = allowedTypes.test(mimetype);
  return extname && mimeCheck;
};

// Read file buffer from formidable file
const readFileBuffer = async (file: any): Promise<Buffer> => {
  if (file.buffer) {
    return file.buffer;
  }
  // Read from filepath if buffer not available
  return fs.promises.readFile(file.filepath);
};

// Helper function to get single file from array or object
const getSingleFile = (fileInput: any) => {
  return Array.isArray(fileInput) ? fileInput[0] : fileInput;
};

// Process files from FormData and upload directly to S3
export const processFilesForS3 = async (files: any, caseId: string) => {
  const uploadedFiles: any = {};

  try {
    // Handle portrait photo
    if (files.portraitPhoto) {
      const fileData = getSingleFile(files.portraitPhoto);
      console.log("Processing portrait photo:", fileData);

      if (!isValidFileType(fileData.name, fileData.type)) {
        throw new Error(
          "Invalid file type for portrait photo. Only images and documents are allowed."
        );
      }

      const buffer = await readFileBuffer(fileData);
      const result = await uploadFileToS3(
        buffer,
        fileData.name,
        fileData.type,
        `${caseId}/portrait`
      );
      uploadedFiles.portraitPhoto = result.url;
    }

    // Handle additional photos
    if (files.additionalPhotos) {
      const additionalPhotos = Array.isArray(files.additionalPhotos)
        ? files.additionalPhotos
        : [files.additionalPhotos];

      console.log("Processing additional photos:", additionalPhotos.length);

      const uploadPromises = additionalPhotos.map(async (file: any) => {
        if (!isValidFileType(file.name, file.type)) {
          throw new Error(
            `Invalid file type for ${file.name}. Only images and documents are allowed.`
          );
        }

        const buffer = await readFileBuffer(file);
        const result = await uploadFileToS3(
          buffer,
          file.name,
          file.type,
          `${caseId}/additional`
        );
        return result.url;
      });

      uploadedFiles.additionalAttachments = await Promise.all(uploadPromises);
    }

    // Handle proof of ID
    if (files.proofOfId) {
      const fileData = getSingleFile(files.proofOfId);
      console.log("Processing proof of ID:", fileData);

      if (!isValidFileType(fileData.name, fileData.type)) {
        throw new Error(
          "Invalid file type for proof of ID. Only images and documents are allowed."
        );
      }

      const buffer = await readFileBuffer(fileData);
      const result = await uploadFileToS3(
        buffer,
        fileData.name,
        fileData.type,
        `${caseId}/proof-of-id`
      );
      uploadedFiles.proofOfId = result.url;
    }

    // Handle proof of death
    if (files.proofOfDeath) {
      const fileData = getSingleFile(files.proofOfDeath);
      console.log("Processing proof of death:", fileData);

      if (!isValidFileType(fileData.name, fileData.type)) {
        throw new Error(
          "Invalid file type for proof of death. Only images and documents are allowed."
        );
      }

      const buffer = await readFileBuffer(fileData);
      const result = await uploadFileToS3(
        buffer,
        fileData.name,
        fileData.type,
        `${caseId}/proof-of-death`
      );
      uploadedFiles.proofOfDeath = result.url;
    }

    // Handle additional evidence
    if (files.additionalEvidence) {
      const fileData = getSingleFile(files.additionalEvidence);
      console.log("Processing additional evidence:", fileData);

      if (!isValidFileType(fileData.name, fileData.type)) {
        throw new Error(
          "Invalid file type for additional evidence. Only images and documents are allowed."
        );
      }

      const buffer = await readFileBuffer(fileData);
      const result = await uploadFileToS3(
        buffer,
        fileData.name,
        fileData.type,
        `${caseId}/additional-evidence`
      );
      uploadedFiles.additionalEvidence = result.url;
    }

    console.log("Files uploaded successfully:", Object.keys(uploadedFiles));
    return uploadedFiles;
  } catch (error) {
    console.error("Error processing files for S3:", error);
    throw error;
  }
};

// Middleware to parse FormData files
export const parseFormDataFiles = async (req: any, res: any, next: any) => {
  try {
    const contentType = req.headers["content-type"];

    if (!contentType || !contentType.includes("multipart/form-data")) {
      return next();
    }

    // For now, we'll handle FormData parsing in the controller
    // This is a placeholder middleware
    next();
  } catch (error) {
    res.status(400).json({
      status: "fail",
      message: "Error parsing form data",
    });
  }
};
