import { Request, Response } from "express";
import Report from "@/Models/Report";

export const createReportController = async (req: Request, res: Response) => {
  try {
    const { name, email, contact_info, message, caseId, type } = req.body;
    const report = await Report.create({
      name,
      email,
      contact_info,
      message,
      case: caseId,
      type,
    });

    res.status(201).json({
      status: "success",
      data: {
        report,
      },
    });
  } catch (error) {
    res.status(500).json({
      status: "error",
      message: "Something went wrong while creating report",
    });
  }
};

export const getReportsController = async (req: Request, res: Response) => {
  try {
    const reports = await Report.find();
    res.status(200).json({
      status: "success",
      data: {
        reports,
      },
    });
  } catch (error) {
    res.status(500).json({
      status: "error",
      message: "Something went wrong while fetching reports",
    });
  }
};
