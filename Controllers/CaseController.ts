import Case from "@/Models/Case";
import User from "@/Models/User";
import { processFilesForS3 } from "@/Utils/fileUpload";
import ApiFeatures from "@/Utils/ApiFeatures";
import { Request, Response } from "express";

// Dashboard stats endpoint
export const getDashboardStats = async (req: Request, res: Response) => {
  try {
    console.log("Fetching dashboard stats...");

    // Get user counts
    const totalUsers = await User.countDocuments();
    const activeUsers = await User.countDocuments({ isActive: true });

    // Get case counts
    const totalCases = await Case.countDocuments();
    const pendingCases = await Case.countDocuments({
      status: "pending",
      isVerified: false,
    });
    const casesUnderReview = await Case.countDocuments({
      status: "under_review",
      isVerified: false,
    });
    const thirdPartyReviewCases = await Case.countDocuments({
      status: "third_party_review",
      isThirdPartyVerified: false,
    });
    const digitalForensicsReviewCases = await Case.countDocuments({
      status: "digital_forensics_review",
      isDigitalForensicsVerified: false,
    });
    const verifiedCases = await Case.countDocuments({ isVerified: true });

    // Get cases verified today
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const casesVerifiedToday = await Case.countDocuments({
      isVerified: true,
      updatedAt: { $gte: today },
    });

    // Get active verifiers count
    const activeVerifiers = await User.countDocuments({
      role: { $in: ["third_party_moderator", "digital_forensics_moderator"] },
      isActive: true,
    });

    const stats = {
      users: {
        total: totalUsers,
        active: activeUsers,
        activeVerifiers,
      },
      cases: {
        total: totalCases,
        pending: pendingCases,
        underReview: casesUnderReview,
        thirdPartyReview: thirdPartyReviewCases,
        digitalForensicsReview: digitalForensicsReviewCases,
        verified: verifiedCases,
        verifiedToday: casesVerifiedToday,
      },
    };

    res.status(200).json({
      status: "success",
      data: stats,
    });
  } catch (error) {
    console.error("Error fetching dashboard stats:", error);
    res.status(500).json({
      status: "error",
      message: "Something went wrong while fetching dashboard stats",
    });
  }
};

// REST API Controllers
export const getAllCasesController = async (req: Request, res: Response) => {
  try {
    // Use ApiFeatures for filtering, sorting, pagination
    const features = new ApiFeatures(Case.find({ isVerified: true }), req.query)
      .filter()
      .sort()
      .limitFields()
      .paginate();

    const cases = await features.query;

    res.status(200).json({
      status: "success",
      results: cases.length,
      data: {
        cases,
      },
    });
  } catch (error) {
    res.status(500).json({
      status: "error",
      message: "Something went wrong while fetching cases",
    });
  }
};

export const getCasesForThirdPartyReview = async (
  req: Request,
  res: Response
) => {
  try {
    const cases = await Case.find({
      isThirdPartyVerified: false,
      isVerified: true,
      status: "third_party_review",
    }).populate("userThirdPartyVerified", "name email");

    res.status(200).json({
      status: "success",
      data: {
        cases,
      },
    });
  } catch (error) {
    console.error("Error fetching third party review cases:", error);
    res.status(500).json({
      status: "error",
      message:
        "Something went wrong while fetching cases for third party review",
    });
  }
};

export const getCasesUnderReview = async (req: Request, res: Response) => {
  try {
    const cases = await Case.find({
      status: "under_review",
      isVerified: false,
    }).populate("userModeratorVerified", "name email");

    res.status(200).json({
      status: "success",
      data: {
        cases,
      },
    });
  } catch (error) {
    console.error("Error fetching cases under review:", error);
    res.status(500).json({
      status: "error",
      message: "Something went wrong while fetching cases under review",
    });
  }
};

export const getPendingCases = async (req: Request, res: Response) => {
  try {
    const cases = await Case.find({
      isVerified: false,
      status: "pending",
    }).populate("userModeratorVerified", "name email");

    res.status(200).json({
      status: "success",
      data: {
        cases,
      },
    });
  } catch (error) {
    console.error("Error fetching pending cases:", error);
    res.status(500).json({
      status: "error",
      message: "Something went wrong while fetching pending cases",
    });
  }
};

export const getCasesForDigitalForensicsReview = async (
  req: Request,
  res: Response
) => {
  try {
    const cases = await Case.find({
      isDigitalForensicsVerified: false,
      isVerified: true,
      status: "digital_forensics_review",
    }).populate("userDigitalForensicsVerified", "name email");

    res.status(200).json({
      status: "success",
      data: {
        cases,
      },
    });
  } catch (error) {
    console.error("Error fetching digital forensics review cases:", error);
    res.status(500).json({
      status: "error",
      message:
        "Something went wrong while fetching cases for digital forensics review",
    });
  }
};

export const getCaseController = async (req: Request, res: Response) => {
  try {
    console.log("Fetching case by generated_id:", req.params.id);

    const case_ = await Case.findOne({ generated_id: req.params.id });

    if (!case_) {
      return res.status(404).json({
        status: "fail",
        message: "No case found with that ID",
      });
    }

    res.status(200).json({
      status: "success",
      data: {
        case: case_,
      },
    });
  } catch (error) {
    res.status(500).json({
      status: "error",
      message: "Something went wrong while fetching the case",
    });
  }
};

export const createCaseController = async (
  req: Request & { formData?: any },
  res: Response
) => {
  try {
    // Generate temporary ID for file organization
    const tempId = new Date().getTime().toString();

    // Extract files from the parsed form data
    const files = req.formData?.files || {};

    // Process and upload files to S3 if any
    let uploadedFiles = {};
    if (Object.keys(files).length > 0) {
      uploadedFiles = await processFilesForS3(files, tempId);
    }

    // Use the parsed body data directly (files are already excluded)
    const caseDataFromBody = req.body;

    // Combine case data with uploaded file URLs
    const caseData = {
      ...caseDataFromBody,
      ...uploadedFiles,
    };

    // Create the case
    const newCase = await Case.create(caseData);

    res.status(201).json({
      status: "success",
      data: {
        case: newCase,
      },
    });
  } catch (error) {
    console.error("Error creating case:", error);
    res.status(400).json({
      status: "fail",
      message: error instanceof Error ? error.message : "Failed to create case",
    });
  }
};

export const getCasesLocationsController = async (
  req: Request,
  res: Response
) => {
  try {
    // Get comprehensive map data (similar to homepage but with all locations)
    const mapLocations = await Case.aggregate([
      {
        $match: {
          "location.lat": { $exists: true, $ne: "" },
          "location.lng": { $exists: true, $ne: "" },
          isVerified: true,
        },
      },
      {
        $group: {
          _id: {
            lat: "$location.lat",
            lng: "$location.lng",
            locationName: "$locationName",
          },
          count: { $sum: 1 },
          cases: {
            $push: {
              _id: "$_id",
              name: "$name",
              date: "$date",
              age: "$age",
              gender: "$gender",
              status: "$status",
              isVerified: "$isVerified",
            },
          },
        },
      },
      {
        $project: {
          _id: 0,
          lat: "$_id.lat",
          lng: "$_id.lng",
          locationName: "$_id.locationName",
          caseCount: "$count",
          recentCases: { $slice: ["$cases", 10] }, // Show up to 10 cases per location
        },
      },
      {
        $sort: { caseCount: -1 }, // Sort by case count descending
      },
    ]);

    // Get total statistics
    const totalLocations = await Case.distinct("locationName", {
      locationName: { $exists: true, $ne: "" },
    }).then((locations) => locations.length);

    const totalCasesWithLocation = await Case.countDocuments({
      "location.lat": { $exists: true, $ne: "" },
      "location.lng": { $exists: true, $ne: "" },
    });

    res.status(200).json({
      status: "success",
      data: {
        locations: mapLocations,
        totalLocations,
        totalCasesWithLocation,
        lastUpdated: new Date().toISOString(),
      },
    });
  } catch (error) {
    console.error("Error fetching case locations:", error);
    res.status(500).json({
      status: "error",
      message: "Something went wrong while fetching locations",
      error: error instanceof Error ? error.message : "Unknown error",
    });
  }
};

export const getHomePageController = async (req: Request, res: Response) => {
  try {
    // Get pagination parameters
    const page = Number(req.query.page) || 1;
    const limit = Number(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    // 1. Get recent cases with pagination
    const recentCases = await Case.find({ isVerified: true })
      .sort({ date: -1, createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .select("-__v");

    const totalCases = await Case.countDocuments();

    // 2. Get timeline navigation data (years and months with case counts)
    const timelineData = await Case.aggregate([
      {
        $match: {
          date: { $exists: true, $ne: null },
          isVerified: true,
        },
      },
      {
        $addFields: {
          dateAsDate: {
            $cond: {
              if: { $type: "$date" },
              then: {
                $cond: {
                  if: { $eq: [{ $type: "$date" }, "string"] },
                  then: { $dateFromString: { dateString: "$date" } },
                  else: "$date",
                },
              },
              else: new Date(),
            },
          },
        },
      },
      {
        $group: {
          _id: {
            year: { $year: "$dateAsDate" },
            month: { $month: "$dateAsDate" },
          },
          count: { $sum: 1 },
          monthName: {
            $first: { $dateToString: { format: "%b", date: "$dateAsDate" } },
          },
        },
      },
      {
        $group: {
          _id: "$_id.year",
          months: {
            $push: {
              name: "$monthName",
              month: "$_id.month",
              cases: "$count",
            },
          },
          totalCases: { $sum: "$count" },
        },
      },
      {
        $sort: { _id: -1 },
      },
    ]);

    // 3. Get map data (unique locations)
    const mapLocations = await Case.aggregate([
      {
        $match: {
          "location.lat": { $exists: true, $ne: "" },
          "location.lng": { $exists: true, $ne: "" },
          isVerified: true,
        },
      },
      {
        $group: {
          _id: {
            lat: "$location.lat",
            lng: "$location.lng",
            locationName: "$locationName",
          },
          count: { $sum: 1 },
          cases: { $push: { _id: "$_id", name: "$name", date: "$date" } },
        },
      },
      {
        $project: {
          _id: 0,
          lat: "$_id.lat",
          lng: "$_id.lng",
          locationName: "$_id.locationName",
          caseCount: "$count",
          recentCases: { $slice: ["$cases", 5] }, // Show up to 5 recent cases per location
        },
      },
    ]);

    // 4. Get comprehensive statistics
    const statistics = await Promise.all([
      Case.countDocuments(), // Total cases
      Case.distinct("locationName").then(
        (locations) => locations.filter(Boolean).length
      ), // Unique locations
      Case.countDocuments({ isVerified: true }), // Verified cases
      Case.countDocuments({ isThirdPartyVerified: true }), // Third-party verified
      Case.countDocuments({ isDigitalForensicsVerified: true }), // Digital forensics verified
      Case.countDocuments({ status: "pending" }), // Pending cases
      Case.countDocuments({ status: "verified" }), // Verified status cases
    ]);

    const [
      totalCasesCount,
      uniqueLocationsCount,
      verifiedCasesCount,
      thirdPartyVerifiedCount,
      digitalForensicsVerifiedCount,
      pendingCasesCount,
      verifiedStatusCount,
    ] = statistics;

    // 5. Get chart data for various visualizations
    const chartData = {
      // Cases by month for current year
      casesByMonth: await Case.aggregate([
        {
          $match: {
            date: { $exists: true, $ne: null },
            isVerified: true,
          },
        },
        {
          $addFields: {
            dateAsDate: {
              $cond: {
                if: { $eq: [{ $type: "$date" }, "string"] },
                then: { $dateFromString: { dateString: "$date" } },
                else: "$date",
              },
            },
          },
        },
        {
          $match: {
            dateAsDate: {
              $gte: new Date(new Date().getFullYear(), 0, 1),
              $lt: new Date(new Date().getFullYear() + 1, 0, 1),
            },
          },
        },
        {
          $group: {
            _id: { $month: "$dateAsDate" },
            count: { $sum: 1 },
            monthName: {
              $first: { $dateToString: { format: "%b", date: "$dateAsDate" } },
            },
          },
        },
        {
          $sort: { _id: 1 },
        },
      ]),

      // Cases by status
      casesByStatus: await Case.aggregate([
        {
          $match: {
            isVerified: true,
          },
        },
        {
          $group: {
            _id: "$status",
            count: { $sum: 1 },
          },
        },
      ]),

      // Cases by gender
      casesByGender: await Case.aggregate([
        {
          $match: {
            isVerified: true,
          },
        },
        {
          $group: {
            _id: "$gender",
            count: { $sum: 1 },
          },
        },
      ]),

      // Cases by age groups
      casesByAgeGroup: await Case.aggregate([
        {
          $match: {
            isVerified: true,
          },
        },
        {
          $group: {
            _id: {
              $switch: {
                branches: [
                  { case: { $lt: ["$age", 18] }, then: "0-17" },
                  { case: { $lt: ["$age", 35] }, then: "18-34" },
                  { case: { $lt: ["$age", 50] }, then: "35-49" },
                  { case: { $lt: ["$age", 65] }, then: "50-64" },
                  { case: { $gte: ["$age", 65] }, then: "65+" },
                ],
                default: "Unknown",
              },
            },
            count: { $sum: 1 },
          },
        },
        {
          $sort: { _id: 1 },
        },
      ]),

      // Top locations by case count
      topLocationsByCases: await Case.aggregate([
        {
          $match: {
            locationName: { $exists: true, $ne: "" },
            isVerified: true,
          },
        },
        {
          $group: {
            _id: "$locationName",
            count: { $sum: 1 },
          },
        },
        {
          $sort: { count: -1 },
        },
        {
          $limit: 10,
        },
      ]),
    };

    // 6. Get recent activity (last 30 days)
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

    const recentActivity = {
      newCasesLast30Days: await Case.aggregate([
        {
          $match: {
            date: { $exists: true, $ne: null },
            isVerified: true,
          },
        },
        {
          $addFields: {
            dateAsDate: {
              $cond: {
                if: { $eq: [{ $type: "$date" }, "string"] },
                then: { $dateFromString: { dateString: "$date" } },
                else: "$date",
              },
            },
          },
        },
        {
          $match: {
            dateAsDate: { $gte: thirtyDaysAgo },
            isVerified: true,
          },
        },
        {
          $count: "count",
        },
      ]).then((result) => result[0]?.count || 0),

      verifiedLast30Days: await Case.aggregate([
        {
          $match: {
            date: { $exists: true, $ne: null },
            isVerified: true,
          },
        },
        {
          $addFields: {
            dateAsDate: {
              $cond: {
                if: { $eq: [{ $type: "$date" }, "string"] },
                then: { $dateFromString: { dateString: "$date" } },
                else: "$date",
              },
            },
          },
        },
        {
          $match: {
            dateAsDate: { $gte: thirtyDaysAgo },
            isVerified: true,
          },
        },
        {
          $count: "count",
        },
      ]).then((result) => result[0]?.count || 0),
    };

    res.status(200).json({
      status: "success",
      data: {
        // Paginated recent cases
        recentCases,
        pagination: {
          currentPage: page,
          totalPages: Math.ceil(totalCases / limit),
          totalCases,
          limit,
          hasNextPage: page * limit < totalCases,
          hasPrevPage: page > 1,
        },

        // Timeline navigation data
        timelineData,

        // Map data
        mapData: {
          locations: mapLocations,
          totalLocations: uniqueLocationsCount,
        },

        // Comprehensive statistics
        statistics: {
          totalCases: totalCasesCount,
          uniqueLocations: uniqueLocationsCount,
          verifiedCases: verifiedCasesCount,
          thirdPartyVerified: thirdPartyVerifiedCount,
          digitalForensicsVerified: digitalForensicsVerifiedCount,
          pendingCases: pendingCasesCount,
          verifiedStatusCases: verifiedStatusCount,
          verificationRate:
            totalCasesCount > 0
              ? ((verifiedCasesCount / totalCasesCount) * 100).toFixed(1)
              : 0,
        },

        // Chart data for visualizations
        chartData,

        // Recent activity
        recentActivity,

        // Metadata
        lastUpdated: new Date().toISOString(),
        dataVersion: "1.0",
      },
    });
  } catch (error) {
    console.error("Error fetching homepage data:", error);
    res.status(500).json({
      status: "error",
      message: "Something went wrong while fetching homepage data",
      error: error instanceof Error ? error.message : "Unknown error",
    });
  }
};

export const assignCase = async (req: Request, res: Response) => {
  try {
    const case_ = await Case.findById(req.params.id);

    const assignedTo = req.body.assignedTo;

    const userAssigned = await User.findById(assignedTo);

    if (!userAssigned) {
      return res.status(404).json({
        status: "fail",
        message: "No user found with that ID",
      });
    }

    if (userAssigned?.role === "moderator") {
      case_.status = "under_review";
      case_.userModeratorVerified = userAssigned._id;
    } else if (userAssigned?.role === "third_party_moderator") {
      if (!case_.isVerified) {
        return res.status(400).json({
          status: "fail",
          message: "Case is not verified",
        });
      }

      case_.status = "third_party_review";
      case_.userThirdPartyVerified = userAssigned._id;
    } else if (userAssigned?.role === "digital_forensics_moderator") {
      if (!case_.isVerified) {
        return res.status(400).json({
          status: "fail",
          message: "Case is not verified",
        });
      }

      case_.status = "digital_forensics_review";
      case_.userDigitalForensicsVerified = userAssigned._id;
    } else {
      return res.status(400).json({
        status: "fail",
        message: "Invalid user role for assigning case",
      });
    }

    await case_.save();

    res.status(200).json({
      status: "success",
      data: {
        case: case_,
      },
    });
  } catch (error) {
    res.status(500).json({
      status: "error",
      message: "Something went wrong while assigning case",
    });
  }
};

export const getVerifiedCases = async (req: Request, res: Response) => {
  try {
    const cases = await Case.find({
      isVerified: true,
      isThirdPartyVerified: true,
      isDigitalForensicsVerified: true,
      status: "verified",
    })
      .populate("userThirdPartyVerified", "name email")
      .populate("userDigitalForensicsVerified", "name email")
      .populate("userModeratorVerified", "name email");

    res.status(200).json({
      status: "success",
      data: {
        cases,
      },
    });
  } catch (error) {
    res.status(500).json({
      status: "error",
      message: "Something went wrong while fetching verified cases",
    });
  }
};

export const verifyCase = async (req: any, res: Response) => {
  try {
    const case_ = await Case.findById(req.params.id);

    console.log(case_, "case_ before verifying");
    console.log(req.user, "req.user");

    if (!case_) {
      return res.status(404).json({
        status: "fail",
        message: "No case found with that ID",
      });
    }

    if (req.user.role === "moderator") {
      case_.isVerified = true;
      case_.status = "under_third_party_review";
      case_.userModeratorVerified = req.user._id;
    } else if (req.user.role === "third_party_moderator") {
      case_.isThirdPartyVerified = true;
      case_.status = "under_digital_forensics_review";
      case_.userThirdPartyVerified = req.user._id;
    } else if (req.user.role === "digital_forensics_moderator") {
      case_.isDigitalForensicsVerified = true;
      case_.status = "verified";
      case_.userDigitalForensicsVerified = req.user._id;
    } else {
      return res.status(400).json({
        status: "fail",
        message: "Invalid user role for verifying case",
      });
    }

    console.log(case_, "case_ before saving");

    const savedCase = await Case.findByIdAndUpdate(req.params.id, case_, {
      new: true,
    });

    console.log(savedCase, "case_ after saving");

    res.status(200).json({
      status: "success",
      data: {
        case: savedCase,
      },
    });
  } catch (error) {
    res.status(500).json({
      status: "error",
      message: "Something went wrong while verifying case",
    });
  }
};

export const downloadCase = async (req: Request, res: Response) => {
  try {
    const { generated_id } = req.body;

    if (!generated_id) {
      return res.status(400).json({
        status: "fail",
        message: "generated_id is required",
      });
    }

    // Find the case by generated_id
    const caseData = await Case.findOne({ generated_id });
    if (!caseData) {
      return res.status(404).json({
        status: "fail",
        message: "Case not found",
      });
    }

    const archiver = require("archiver");
    const createCsvWriter = require("csv-writer").createObjectCsvWriter;
    const fs = require("fs");
    const path = require("path");
    const os = require("os");
    const {
      downloadFileFromS3,
      extractS3KeyFromUrl,
      getFilenameFromUrl,
    } = require("../Utils/s3-utils");

    // Create temporary directory for files
    const tempDir = path.join(
      os.tmpdir(),
      `case-${generated_id}-${Date.now()}`
    );
    fs.mkdirSync(tempDir, { recursive: true });

    try {
      // 1. Create CSV file with case data
      const csvPath = path.join(
        tempDir,
        `case-${caseData.name.replace(/[^a-zA-Z0-9]/g, "_")}-data.csv`
      );

      const csvWriter = createCsvWriter({
        path: csvPath,
        header: [
          { id: "id", title: "Case ID" },
          { id: "name", title: "Name" },
          { id: "age", title: "Age" },
          { id: "gender", title: "Gender" },
          { id: "occupation", title: "Occupation" },
          { id: "story", title: "Story" },
          { id: "leftBehind", title: "Left Behind" },
          { id: "locationName", title: "Location Name" },
          { id: "locationLat", title: "Location Latitude" },
          { id: "locationLng", title: "Location Longitude" },
          { id: "date", title: "Date" },
          { id: "status", title: "Status" },
          { id: "isVerified", title: "Is Verified" },
          { id: "createdAt", title: "Created At" },
          { id: "updatedAt", title: "Updated At" },
          { id: "socialMediaLinks", title: "Social Media Links" },
          { id: "portraitPhoto", title: "Portrait Photo URL" },
          { id: "additionalAttachments", title: "Additional Attachments URLs" },
        ],
      });

      // Prepare CSV data
      const csvData = [
        {
          id: caseData.generated_id,
          name: caseData.name || "",
          age: caseData.age || "",
          gender: caseData.gender || "",
          occupation: caseData.occupation || "",
          story: caseData.story || "",
          leftBehind: Array.isArray(caseData.leftBehind)
            ? caseData.leftBehind.join("; ")
            : "",
          locationName: caseData.locationName || "",
          locationLat: caseData.location?.lat || "",
          locationLng: caseData.location?.lng || "",
          date: caseData.date || "",
          status: caseData.status || "",
          isVerified: caseData.isVerified || false,
          createdAt: caseData.createdAt || "",
          updatedAt: caseData.updatedAt || "",
          socialMediaLinks: Array.isArray(caseData.socialMediaLinks)
            ? caseData.socialMediaLinks.join("; ")
            : "",
          portraitPhoto: caseData.portraitPhoto || "",
          additionalAttachments: Array.isArray(caseData.additionalAttachments)
            ? caseData.additionalAttachments.join("; ")
            : "",
        },
      ];

      await csvWriter.writeRecords(csvData);

      // 2. Download files from S3
      const filesToDownload: string[] = [];

      // Add portrait photo if exists
      if (caseData.portraitPhoto) {
        filesToDownload.push(caseData.portraitPhoto);
      }

      // Add additional attachments if exist
      if (
        caseData.additionalAttachments &&
        Array.isArray(caseData.additionalAttachments)
      ) {
        filesToDownload.push(...caseData.additionalAttachments);
      }

      // Download files from S3 and save to temp directory
      const downloadPromises = filesToDownload.map(async (fileUrl, index) => {
        try {
          console.log(
            `Processing file ${index + 1}/${filesToDownload.length}: ${fileUrl}`
          );
          const s3Key = extractS3KeyFromUrl(fileUrl);
          console.log(`Extracted S3 key: ${s3Key}`);
          const fileName = getFilenameFromUrl(fileUrl);
          console.log(`Extracted filename: ${fileName}`);

          const fileBuffer = await downloadFileFromS3(s3Key);

          // Create unique filename to avoid conflicts
          const fileExtension = path.extname(fileName);
          const baseName = path.basename(fileName, fileExtension);
          const uniqueFileName = `${index + 1}-${baseName}${fileExtension}`;
          const filePath = path.join(tempDir, uniqueFileName);

          fs.writeFileSync(filePath, fileBuffer);
          console.log(`Successfully downloaded and saved: ${uniqueFileName}`);
          return { success: true, fileName: uniqueFileName };
        } catch (error) {
          console.error(`Error downloading file ${fileUrl}:`, error);
          return {
            success: false,
            fileName: fileUrl,
            error: error instanceof Error ? error.message : "Unknown error",
          };
        }
      });

      const downloadResults = await Promise.all(downloadPromises);

      // Log download results
      const successfulDownloads = downloadResults.filter((r) => r.success);
      const failedDownloads = downloadResults.filter((r) => !r.success);

      console.log(
        `Successfully downloaded ${successfulDownloads.length} files`
      );
      if (failedDownloads.length > 0) {
        console.log(
          `Failed to download ${failedDownloads.length} files:`,
          failedDownloads
        );
      }

      // 3. Create ZIP archive
      const archive = archiver("zip", {
        zlib: { level: 9 }, // Maximum compression
      });

      // Set response headers
      const zipFileName = `case-${caseData.name.replace(
        /[^a-zA-Z0-9]/g,
        "_"
      )}-${Date.now()}.zip`;
      res.setHeader("Content-Type", "application/zip");
      res.setHeader(
        "Content-Disposition",
        `attachment; filename="${zipFileName}"`
      );

      // Pipe archive to response
      archive.pipe(res);

      // Add CSV file to archive
      archive.file(csvPath, { name: path.basename(csvPath) });

      // Add downloaded files to archive
      const tempFiles = fs.readdirSync(tempDir);
      tempFiles.forEach((fileName: string) => {
        if (fileName.endsWith(".csv")) return; // Skip CSV as it's already added
        const filePath = path.join(tempDir, fileName);
        if (fs.statSync(filePath).isFile()) {
          archive.file(filePath, { name: fileName });
        }
      });

      // Create a summary file with download results
      if (failedDownloads.length > 0) {
        const summaryPath = path.join(tempDir, "download-summary.txt");
        const summaryContent = [
          `Case Download Summary for: ${caseData.name}`,
          `Generated on: ${new Date().toISOString()}`,
          ``,
          `Successfully downloaded files: ${successfulDownloads.length}`,
          `Failed downloads: ${failedDownloads.length}`,
          ``,
          ...(failedDownloads.length > 0
            ? [
                "Failed files:",
                ...failedDownloads.map((f) => `- ${f.fileName}: ${f.error}`),
              ]
            : []),
        ].join("\n");

        fs.writeFileSync(summaryPath, summaryContent);
        archive.file(summaryPath, { name: "download-summary.txt" });
      }

      // Finalize archive
      await archive.finalize();

      // Clean up temp directory after a delay
      setTimeout(() => {
        try {
          fs.rmSync(tempDir, { recursive: true, force: true });
        } catch (error) {
          console.error("Error cleaning up temp directory:", error);
        }
      }, 5000); // 5 seconds delay to ensure download completes
    } catch (error) {
      // Clean up temp directory on error
      try {
        fs.rmSync(tempDir, { recursive: true, force: true });
      } catch (cleanupError) {
        console.error("Error cleaning up temp directory:", cleanupError);
      }
      throw error;
    }
  } catch (error) {
    console.error("Error in downloadCase:", error);
    res.status(500).json({
      status: "error",
      message: "Failed to generate case download",
      error: error instanceof Error ? error.message : "Unknown error",
    });
  }
};

export const getCaseStatus = async (req: Request, res: Response) => {
  try {
    const { generated_id } = req.body;
    const case_ = await Case.findOne({ generated_id });
    if (!case_) {
      return res.status(404).json({
        status: "fail",
        message: "Case not found",
      });
    }

    res.status(200).json({
      status: "success",
      data: {
        isVerified: case_.isVerified,
        isThirdPartyVerified: case_.isThirdPartyVerified,
        isDigitalForensicsVerified: case_.isDigitalForensicsVerified,
        status: case_.status,
      },
    });
  } catch (error) {
    console.error("Error in caseStatus:", error);
    res.status(500).json({
      status: "error",
      message: "Something went wrong while fetching case status",
    });
  }
};

export const downloadArchive = async (req: Request, res: Response) => {
  try {
    const {
      includeMedia = true,
      includePhotos = true,
      includeVideos = true,
      statusFilter = "all",
      locationFilter = "",
      dateFrom = "",
      dateTo = "",
    } = req.body;

    console.log("Download archive request with filters:", {
      includeMedia,
      includePhotos,
      includeVideos,
      statusFilter,
      locationFilter,
      dateFrom,
      dateTo,
    });

    // Build query based on filters
    const query: any = {};

    // Status filter
    if (statusFilter !== "all") {
      switch (statusFilter) {
        case "documented":
          query.isVerified = false;
          query.status = "pending";
          break;
        case "verified":
          query.isVerified = true;
          query.isThirdPartyVerified = true;
          query.isDigitalForensicsVerified = true;
          query.status = "verified";
          break;
        case "investigating":
          query.status = {
            $in: [
              "under_review",
              "third_party_review",
              "digital_forensics_review",
            ],
          };
          break;
      }
    }

    // Location filter
    if (locationFilter) {
      query.locationName = { $regex: locationFilter, $options: "i" };
    }

    // Date filters
    if (dateFrom || dateTo) {
      query.date = {};
      if (dateFrom) {
        query.date.$gte = new Date(dateFrom);
      }
      if (dateTo) {
        const endDate = new Date(dateTo);
        endDate.setHours(23, 59, 59, 999); // End of day
        query.date.$lte = endDate;
      }
    }

    console.log("Query for cases:", JSON.stringify(query, null, 2));

    // Find cases matching the filters
    const cases = await Case.find(query).sort({ createdAt: -1 });

    if (cases.length === 0) {
      return res.status(404).json({
        status: "fail",
        message: "No cases found matching the specified filters",
      });
    }

    console.log(`Found ${cases.length} cases to include in archive`);

    const archiver = require("archiver");
    const createCsvWriter = require("csv-writer").createObjectCsvWriter;
    const fs = require("fs");
    const path = require("path");
    const os = require("os");
    const {
      downloadFileFromS3,
      extractS3KeyFromUrl,
      getFilenameFromUrl,
    } = require("../Utils/s3-utils");

    // Create temporary directory for files
    const tempDir = path.join(os.tmpdir(), `archive-${Date.now()}`);
    fs.mkdirSync(tempDir, { recursive: true });

    try {
      // 1. Create CSV file with all cases data
      const csvPath = path.join(tempDir, "cases-archive-data.csv");

      const csvWriter = createCsvWriter({
        path: csvPath,
        header: [
          { id: "id", title: "Case ID" },
          { id: "name", title: "Name" },
          { id: "age", title: "Age" },
          { id: "gender", title: "Gender" },
          { id: "occupation", title: "Occupation" },
          { id: "story", title: "Story" },
          { id: "leftBehind", title: "Left Behind" },
          { id: "locationName", title: "Location Name" },
          { id: "locationLat", title: "Location Latitude" },
          { id: "locationLng", title: "Location Longitude" },
          { id: "date", title: "Date" },
          { id: "status", title: "Status" },
          { id: "isVerified", title: "Is Verified" },
          { id: "isThirdPartyVerified", title: "Is Third Party Verified" },
          {
            id: "isDigitalForensicsVerified",
            title: "Is Digital Forensics Verified",
          },
          { id: "createdAt", title: "Created At" },
          { id: "updatedAt", title: "Updated At" },
          { id: "socialMediaLinks", title: "Social Media Links" },
          { id: "portraitPhoto", title: "Portrait Photo URL" },
          { id: "additionalAttachments", title: "Additional Attachments URLs" },
        ],
      });

      // Prepare CSV data for all cases
      const csvData = cases.map((caseData) => ({
        id: caseData.generated_id,
        name: caseData.name || "",
        age: caseData.age || "",
        gender: caseData.gender || "",
        occupation: caseData.occupation || "",
        story: caseData.story || "",
        leftBehind: Array.isArray(caseData.leftBehind)
          ? caseData.leftBehind.join("; ")
          : "",
        locationName: caseData.locationName || "",
        locationLat: caseData.location?.lat || "",
        locationLng: caseData.location?.lng || "",
        date: caseData.date || "",
        status: caseData.status || "",
        isVerified: caseData.isVerified || false,
        isThirdPartyVerified: caseData.isThirdPartyVerified || false,
        isDigitalForensicsVerified:
          caseData.isDigitalForensicsVerified || false,
        createdAt: caseData.createdAt || "",
        updatedAt: caseData.updatedAt || "",
        socialMediaLinks: Array.isArray(caseData.socialMediaLinks)
          ? caseData.socialMediaLinks.join("; ")
          : "",
        portraitPhoto: caseData.portraitPhoto || "",
        additionalAttachments: Array.isArray(caseData.additionalAttachments)
          ? caseData.additionalAttachments.join("; ")
          : "",
      }));

      await csvWriter.writeRecords(csvData);

      // 2. Download media files if requested
      let downloadedFilesCount = 0;
      let failedDownloadsCount = 0;

      if (includeMedia) {
        console.log("Processing media files...");

        // Collect all files to download
        const filesToDownload: {
          url: string;
          caseId: string;
          caseName: string;
          type: string;
        }[] = [];

        for (const caseData of cases) {
          // Add portrait photo if exists and photos are requested
          if (includePhotos && caseData.portraitPhoto) {
            filesToDownload.push({
              url: caseData.portraitPhoto,
              caseId: caseData.generated_id,
              caseName: caseData.name || "Unknown",
              type: "portrait",
            });
          }

          // Add additional attachments if exist and media is requested
          if (
            caseData.additionalAttachments &&
            Array.isArray(caseData.additionalAttachments)
          ) {
            caseData.additionalAttachments.forEach(
              (attachment: string, index: number) => {
                // Filter by type if needed
                const isVideo = attachment
                  .toLowerCase()
                  .match(/\.(mp4|avi|mov|wmv|flv|webm)$/);
                const isPhoto = attachment
                  .toLowerCase()
                  .match(/\.(jpg|jpeg|png|gif|bmp|webp)$/);

                if ((includePhotos && isPhoto) || (includeVideos && isVideo)) {
                  filesToDownload.push({
                    url: attachment,
                    caseId: caseData.generated_id,
                    caseName: caseData.name || "Unknown",
                    type: isVideo ? "video" : "photo",
                  });
                }
              }
            );
          }
        }

        console.log(`Found ${filesToDownload.length} files to download`);

        // Download files from S3 and save to temp directory
        const downloadPromises = filesToDownload.map(
          async (fileInfo, index) => {
            try {
              console.log(
                `Processing file ${index + 1}/${filesToDownload.length}: ${
                  fileInfo.url
                }`
              );
              const s3Key = extractS3KeyFromUrl(fileInfo.url);
              const fileName = getFilenameFromUrl(fileInfo.url);

              const fileBuffer = await downloadFileFromS3(s3Key);

              // Create organized folder structure
              const caseFolder = path.join(
                tempDir,
                "media",
                `${fileInfo.caseId}-${fileInfo.caseName.replace(
                  /[^a-zA-Z0-9]/g,
                  "_"
                )}`
              );
              if (!fs.existsSync(caseFolder)) {
                fs.mkdirSync(caseFolder, { recursive: true });
              }

              // Create unique filename to avoid conflicts
              const fileExtension = path.extname(fileName);
              const baseName = path.basename(fileName, fileExtension);
              const uniqueFileName = `${fileInfo.type}-${baseName}${fileExtension}`;
              const filePath = path.join(caseFolder, uniqueFileName);

              fs.writeFileSync(filePath, fileBuffer);
              console.log(`Successfully downloaded: ${uniqueFileName}`);
              downloadedFilesCount++;
              return {
                success: true,
                fileName: uniqueFileName,
                caseId: fileInfo.caseId,
              };
            } catch (error) {
              console.error(`Error downloading file ${fileInfo.url}:`, error);
              failedDownloadsCount++;
              return {
                success: false,
                fileName: fileInfo.url,
                caseId: fileInfo.caseId,
                error: error instanceof Error ? error.message : "Unknown error",
              };
            }
          }
        );

        await Promise.all(downloadPromises);
      }

      // 3. Create ZIP archive
      const archive = archiver("zip", {
        zlib: { level: 9 }, // Maximum compression
      });

      // Set response headers
      const zipFileName = `gaza-victims-archive-${Date.now()}.zip`;
      res.setHeader("Content-Type", "application/zip");
      res.setHeader(
        "Content-Disposition",
        `attachment; filename="${zipFileName}"`
      );

      // Pipe archive to response
      archive.pipe(res);

      // Add CSV file to archive
      archive.file(csvPath, { name: "cases-data.csv" });

      // Add downloaded files to archive
      if (includeMedia && fs.existsSync(path.join(tempDir, "media"))) {
        const mediaDir = path.join(tempDir, "media");
        const caseFolders = fs.readdirSync(mediaDir);

        caseFolders.forEach((caseFolder: string) => {
          const caseFolderPath = path.join(mediaDir, caseFolder);
          if (fs.statSync(caseFolderPath).isDirectory()) {
            const files = fs.readdirSync(caseFolderPath);
            files.forEach((fileName: string) => {
              const filePath = path.join(caseFolderPath, fileName);
              if (fs.statSync(filePath).isFile()) {
                archive.file(filePath, {
                  name: `media/${caseFolder}/${fileName}`,
                });
              }
            });
          }
        });
      }

      // Create a summary file
      const summaryPath = path.join(tempDir, "archive-summary.txt");
      const summaryContent = [
        `Gaza Victims Archive Summary`,
        `Generated on: ${new Date().toISOString()}`,
        ``,
        `Archive Filters Applied:`,
        `- Include Media: ${includeMedia}`,
        `- Include Photos: ${includePhotos}`,
        `- Include Videos: ${includeVideos}`,
        `- Status Filter: ${statusFilter}`,
        `- Location Filter: ${locationFilter || "None"}`,
        `- Date From: ${dateFrom || "None"}`,
        `- Date To: ${dateTo || "None"}`,
        ``,
        `Archive Contents:`,
        `- Total Cases: ${cases.length}`,
        `- CSV Data File: cases-data.csv`,
        `- Media Files: ${downloadedFilesCount} files downloaded`,
        `- Failed Downloads: ${failedDownloadsCount} files`,
        ``,
        `This archive contains all case data and media files based on the specified filters.`,
        `The CSV file contains structured data for all cases, while media files are organized by case.`,
      ].join("\n");

      fs.writeFileSync(summaryPath, summaryContent);
      archive.file(summaryPath, { name: "archive-summary.txt" });

      // Finalize archive
      await archive.finalize();

      // Clean up temp directory after a delay
      setTimeout(() => {
        try {
          fs.rmSync(tempDir, { recursive: true, force: true });
        } catch (error) {
          console.error("Error cleaning up temp directory:", error);
        }
      }, 10000); // 10 seconds delay to ensure download completes
    } catch (error) {
      // Clean up temp directory on error
      try {
        fs.rmSync(tempDir, { recursive: true, force: true });
      } catch (cleanupError) {
        console.error("Error cleaning up temp directory:", cleanupError);
      }
      throw error;
    }
  } catch (error) {
    console.error("Error in downloadArchive:", error);
    res.status(500).json({
      status: "error",
      message: "Failed to generate archive download",
      error: error instanceof Error ? error.message : "Unknown error",
    });
  }
};
