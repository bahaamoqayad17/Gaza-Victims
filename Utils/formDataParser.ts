import { Request, Response, NextFunction } from "express";
import formidable, { File, Fields, Files } from "formidable";

interface ParsedFormData {
  fields: { [key: string]: string };
  files: { [key: string]: any };
}

// Middleware to parse multipart/form-data
export const parseFormData = async (
  req: Request & { formData?: ParsedFormData },
  res: Response,
  next: NextFunction
) => {
  try {
    const contentType = req.headers["content-type"];

    if (!contentType || !contentType.includes("multipart/form-data")) {
      return next();
    }

    const form = formidable({
      multiples: true, // Allow multiple files
      keepExtensions: true,
      maxFileSize: 50 * 1024 * 1024, // 50MB max file size
    });

    // Parse the form data
    const [fields, files] = await form.parse(req);

    // Convert fields to a simpler format
    const processedFields: { [key: string]: string } = {};
    Object.entries(fields).forEach(([key, value]) => {
      if (Array.isArray(value)) {
        processedFields[key] = value[0] || "";
      } else {
        processedFields[key] = value || "";
      }
    });

    // Process JSON fields that come as strings
    const jsonFields = [
      "leftBehind",
      "socialMediaLinks",
      "newsLinks",
      "location",
    ];
    jsonFields.forEach((field) => {
      if (processedFields[field]) {
        try {
          processedFields[field] = JSON.parse(processedFields[field]);
        } catch (e) {
          // If parsing fails, keep as string
          console.log(
            `Failed to parse ${field} as JSON:`,
            processedFields[field]
          );
        }
      }
    });

    // Convert formidable files to a format compatible with our S3 upload
    const processedFiles: { [key: string]: any } = {};
    Object.entries(files).forEach(([key, fileArray]) => {
      if (Array.isArray(fileArray)) {
        processedFiles[key] = fileArray.map((f: File) => ({
          name: f.originalFilename || f.newFilename,
          type: f.mimetype,
          size: f.size,
          filepath: f.filepath,
          buffer: null, // We'll read this when needed
        }));
      } else if (fileArray) {
        const f = fileArray as File;
        processedFiles[key] = {
          name: f.originalFilename || f.newFilename,
          type: f.mimetype,
          size: f.size,
          filepath: f.filepath,
          buffer: null, // We'll read this when needed
        };
      }
    });

    // Add parsed data to request object
    req.body = { ...processedFields };
    req.formData = { fields: processedFields, files: processedFiles };

    console.log("Parsed form data:", {
      fields: Object.keys(processedFields),
      files: Object.keys(processedFiles),
      bodyKeys: Object.keys(req.body),
    });

    next();
  } catch (error) {
    console.error("Error parsing form data:", error);
    res.status(400).json({
      status: "fail",
      message: "Error parsing form data",
      error: error instanceof Error ? error.message : "Unknown error",
    });
  }
};
