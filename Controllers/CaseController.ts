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
    const features = new ApiFeatures(Case.find(), req.query)
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
          $group: {
            _id: "$status",
            count: { $sum: 1 },
          },
        },
      ]),

      // Cases by gender
      casesByGender: await Case.aggregate([
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
          $match: { locationName: { $exists: true, $ne: "" } },
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
      message: "Something went wrong while verifying case",
    });
  }
};
