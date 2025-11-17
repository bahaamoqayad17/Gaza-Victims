import { Request, Response } from "express";
import Information from "../Models/Information";
import CatchAsync from "../Utils/CatchAsync";
import AppError from "../Utils/AppError";
import { verifyRecaptcha } from "../Utils/recaptchaVerification";

// Create a new information submission
export const createInformation = CatchAsync(
  async (req: Request & { formData?: any }, res: Response) => {
    const { note, caseId, captchaValue } = req.body;
    const files = req.formData?.files || {};

    // Validate required fields
    if (!note || !caseId) {
      throw new AppError("Note and case ID are required", 400);
    }

    // Verify reCAPTCHA
    if (!captchaValue) {
      throw new AppError("reCAPTCHA verification is required", 400);
    }

    const isCaptchaValid = await verifyRecaptcha(captchaValue);
    if (!isCaptchaValid) {
      throw new AppError("reCAPTCHA verification failed. Please try again.", 400);
    }

    // Process and upload files to S3 if any
    let uploadedFiles: string[] = [];
    if (Object.keys(files).length > 0) {
      try {
        const { processFilesForS3 } = await import("../Utils/fileUpload");
        const processedFiles = await processFilesForS3(files, caseId);
        uploadedFiles = Object.values(processedFiles).flat() as string[];
      } catch (error) {
        throw new AppError("Failed to upload files", 500);
      }
    }

    // Create the information submission
    const information = await Information.create({
      note,
      files: uploadedFiles,
      caseId,
      status: "pending",
    });

    res.status(201).json({
      status: "success",
      message: "Additional information submitted successfully",
      data: {
        information,
      },
    });
  }
);

// Get all information submissions (for admin)
export const getAllInformation = CatchAsync(
  async (req: Request, res: Response) => {
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 10;
    const skip = (page - 1) * limit;
    const caseId = req.query.caseId as string;

    // Build query
    const query: any = {};
    if (caseId) {
      query.caseId = caseId;
    }

    const information = await Information.find(query)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    const total = await Information.countDocuments(query);

    res.status(200).json({
      status: "success",
      results: information.length,
      total,
      data: {
        information,
      },
    });
  }
);

// Get information by ID
export const getInformationById = CatchAsync(
  async (req: Request, res: Response) => {
    const { id } = req.params;

    const information = await Information.findById(id);

    if (!information) {
      throw new AppError("Information submission not found", 404);
    }

    res.status(200).json({
      status: "success",
      data: {
        information,
      },
    });
  }
);

// Update information status (for admin)
export const updateInformationStatus = CatchAsync(
  async (req: Request, res: Response) => {
    const { id } = req.params;
    const { status, adminNotes } = req.body;

    const information = await Information.findByIdAndUpdate(
      id,
      { status, adminNotes },
      { new: true, runValidators: true }
    );

    if (!information) {
      throw new AppError("Information submission not found", 404);
    }

    res.status(200).json({
      status: "success",
      message: "Information status updated successfully",
      data: {
        information,
      },
    });
  }
);

// Delete information submission (for admin)
export const deleteInformation = CatchAsync(
  async (req: Request, res: Response) => {
    const { id } = req.params;

    const information = await Information.findByIdAndDelete(id);

    if (!information) {
      throw new AppError("Information submission not found", 404);
    }

    res.status(204).json({
      status: "success",
      message: "Information submission deleted successfully",
    });
  }
);

// Get information by case ID
export const getInformationByCaseId = CatchAsync(
  async (req: Request, res: Response) => {
    const { caseId } = req.params;

    const information = await Information.find({ caseId }).sort({
      createdAt: -1,
    });

    res.status(200).json({
      status: "success",
      results: information.length,
      data: {
        information,
      },
    });
  }
);
