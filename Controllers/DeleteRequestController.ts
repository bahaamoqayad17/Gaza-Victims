import { Request, Response } from "express";
import DeleteRequest from "../Models/DeleteRequest";
import CatchAsync from "../Utils/CatchAsync";
import AppError from "../Utils/AppError";

// Create a new delete request
export const createDeleteRequest = CatchAsync(
  async (req: Request, res: Response) => {
    const { reason, email, caseId } = req.body;

    // Validate required fields
    if (!reason || !caseId) {
      throw new AppError("Reason and case ID are required", 400);
    }

    // Validate email format if provided
    if (email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      throw new AppError("Please provide a valid email address", 400);
    }

    // Create the delete request
    const deleteRequest = await DeleteRequest.create({
      reason,
      email: email || undefined,
      caseId,
    });

    res.status(201).json({
      status: "success",
      message: "Delete request submitted successfully",
      data: {
        deleteRequest,
      },
    });
  }
);

// Get all delete requests (for admin)
export const getAllDeleteRequests = CatchAsync(
  async (req: Request, res: Response) => {
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 10;
    const skip = (page - 1) * limit;

    const deleteRequests = await DeleteRequest.find()
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    const total = await DeleteRequest.countDocuments();

    res.status(200).json({
      status: "success",
      results: deleteRequests.length,
      total,
      data: {
        deleteRequests,
      },
    });
  }
);

// Get a specific delete request by ID
export const getDeleteRequestById = CatchAsync(
  async (req: Request, res: Response) => {
    const { id } = req.params;

    const deleteRequest = await DeleteRequest.findById(id);

    if (!deleteRequest) {
      throw new AppError("Delete request not found", 404);
    }

    res.status(200).json({
      status: "success",
      data: {
        deleteRequest,
      },
    });
  }
);

// Update delete request status (for admin)
export const updateDeleteRequestStatus = CatchAsync(
  async (req: Request, res: Response) => {
    const { id } = req.params;
    const { status, adminNotes } = req.body;

    const deleteRequest = await DeleteRequest.findByIdAndUpdate(
      id,
      { status, adminNotes },
      { new: true, runValidators: true }
    );

    if (!deleteRequest) {
      throw new AppError("Delete request not found", 404);
    }

    res.status(200).json({
      status: "success",
      message: "Delete request status updated successfully",
      data: {
        deleteRequest,
      },
    });
  }
);

// Delete a delete request (for admin)
export const deleteDeleteRequest = CatchAsync(
  async (req: Request, res: Response) => {
    const { id } = req.params;

    const deleteRequest = await DeleteRequest.findByIdAndDelete(id);

    if (!deleteRequest) {
      throw new AppError("Delete request not found", 404);
    }

    res.status(204).json({
      status: "success",
      message: "Delete request deleted successfully",
    });
  }
);
