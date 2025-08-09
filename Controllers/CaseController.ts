import Case from "@/Models/Case";
import { processFilesForS3 } from "@/Utils/fileUpload";
import ApiFeatures from "@/Utils/ApiFeatures";
import { Request, Response } from "express";

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

export const getCaseController = async (req: Request, res: Response) => {
  try {
    const case_ = await Case.findById(req.params.id);

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
    console.log("Request body:", req.body);
    console.log("Form data:", req.formData?.files.additionalPhotos);

    // Generate temporary ID for file organization
    const tempId = new Date().getTime().toString();

    // Extract files from the parsed form data
    const files = req.formData?.files || {};

    console.log("Extracted files:", Object.keys(files));

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
    const locations = await Case.find().select("location");

    res.status(200).json({
      status: "success",
      data: {
        locations,
      },
    });
  } catch (error) {
    res.status(500).json({
      status: "error",
      message: "Something went wrong while fetching locations",
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
    const recentCases = await Case.find()
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .select("-__v");

    const totalCases = await Case.countDocuments();

    // 2. Get timeline navigation data (years and months with case counts)
    const timelineData = await Case.aggregate([
      {
        $group: {
          _id: {
            year: { $year: "$createdAt" },
            month: { $month: "$createdAt" },
          },
          count: { $sum: 1 },
          monthName: {
            $first: { $dateToString: { format: "%b", date: "$createdAt" } },
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
            createdAt: {
              $gte: new Date(new Date().getFullYear(), 0, 1),
              $lt: new Date(new Date().getFullYear() + 1, 0, 1),
            },
          },
        },
        {
          $group: {
            _id: { $month: "$createdAt" },
            count: { $sum: 1 },
            monthName: {
              $first: { $dateToString: { format: "%b", date: "$createdAt" } },
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
      newCasesLast30Days: await Case.countDocuments({
        createdAt: { $gte: thirtyDaysAgo },
      }),
      verifiedLast30Days: await Case.countDocuments({
        createdAt: { $gte: thirtyDaysAgo },
        isVerified: true,
      }),
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
