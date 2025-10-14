import { Request, Response } from "express";
import Report from "@/Models/Report";
import Case from "@/Models/Case";

export const createReportController = async (req: Request, res: Response) => {
  try {
    const {
      name,
      email,
      contact_info,
      message,
      caseId,
      relation_to_victim,
      report_type,
      urgency,
    } = req.body;

    if (caseId) {
      const case_ = await Case.findOne({ generated_id: caseId });
      if (case_) {
        await Case.findOneAndUpdate(
          { generated_id: caseId },
          [
            {
              $set: {
                status: "pending",
                urgency,
                isVerified: false,
                isThirdPartyVerified: false,
                isDigitalForensicsVerified: false,
                userModeratorVerified: null,
                userThirdPartyVerified: null,
                userDigitalForensicsVerified: null,
                story: {
                  $concat: [
                    { $ifNull: ["$story", ""] }, // keep old story (or empty if null)
                    "\n", // optional separator
                    message, // new content
                  ],
                },
              },
            },
          ],
          { new: true }
        );
      }
    }

    const report = await Report.create({
      name,
      email,
      contact_info,
      message,
      relation_to_victim,
      report_type,
      urgency,
      case: caseId,
    });

    res.status(201).json({
      status: "success",
      data: {
        report,
      },
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      status: "error",
      message: "Something went wrong while creating report",
    });
  }
};

export const getReportsController = async (req: Request, res: Response) => {
  try {
    const reports = await Report.find().sort({ createdAt: -1 });
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
