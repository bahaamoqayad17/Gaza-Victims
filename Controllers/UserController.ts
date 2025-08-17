import { Request, Response } from "express";
import User from "@/Models/User";
import Case from "@/Models/Case";

// REST API Controllers
export const getAllUsersController = async (req: Request, res: Response) => {
  try {
    const users = await User.find().select("-password");

    // Get the number of cases reviewed by each user based on their role
    const casesReviewedByModerator = await Case.aggregate([
      {
        $match: {
          userModeratorVerified: { $ne: null },
        },
      },
      {
        $group: {
          _id: "$userModeratorVerified",
          count: { $sum: 1 },
        },
      },
    ]);

    const casesReviewedByThirdParty = await Case.aggregate([
      {
        $match: {
          userThirdPartyVerified: { $ne: null },
        },
      },
      {
        $group: {
          _id: "$userThirdPartyVerified",
          count: { $sum: 1 },
        },
      },
    ]);

    const casesReviewedByDigitalForensics = await Case.aggregate([
      {
        $match: {
          userDigitalForensicsVerified: { $ne: null },
        },
      },
      {
        $group: {
          _id: "$userDigitalForensicsVerified",
          count: { $sum: 1 },
        },
      },
    ]);

    const usersWithCasesReviewed = users.map((user) => {
      const userObj = user.toObject();
      let casesReviewed = 0;

      // Count cases based on user role
      switch (user.role) {
        case "admin":
        case "senior_moderator":
          casesReviewed =
            casesReviewedByModerator.find(
              (c) => c._id?.toString() === user._id.toString()
            )?.count || 0;
        case "moderator":
          casesReviewed =
            casesReviewedByModerator.find(
              (c) => c._id?.toString() === user._id.toString()
            )?.count || 0;
          break;
        case "third_party_moderator":
          casesReviewed =
            casesReviewedByThirdParty.find(
              (c) => c._id?.toString() === user._id.toString()
            )?.count || 0;
          break;
        case "digital_forensics_moderator":
          casesReviewed =
            casesReviewedByDigitalForensics.find(
              (c) => c._id?.toString() === user._id.toString()
            )?.count || 0;
          break;
        default:
          casesReviewed = 0;
      }

      return {
        ...userObj,
        casesReviewed,
      };
    });

    res.status(200).json({
      status: "success",
      results: users.length,
      data: {
        users: usersWithCasesReviewed,
      },
    });
  } catch (error) {
    res.status(500).json({
      status: "error",
      message: "Something went wrong while fetching users",
    });
  }
};

export const addUserController = async (req: Request, res: Response) => {
  try {
    const user = await User.create(req.body);

    // Remove password from response
    user.password = undefined;

    res.status(201).json({
      status: "success",
      data: {
        user,
      },
    });
  } catch (error) {
    res.status(400).json({
      status: "fail",
      message: error instanceof Error ? error.message : "Failed to create user",
    });
  }
};

export const addModeratorController = async (req: Request, res: Response) => {
  try {
    const {
      firstName,
      lastName,
      email,
      secondaryEmail,
      phone,
      role,
      organization,
      department,
      specializations,
      languages,
      timeZone,
      startDate,
      securityClearance,
      notes,
      emergencyContact,
      password,
    } = req.body;

    // Combine first and last name
    const name = `${firstName} ${lastName}`;

    // Prepare user data
    const userData = {
      name,
      email,
      password,
      passwordConfirm: password, // Set passwordConfirm to the same value
      role,
      secondaryEmail: secondaryEmail || undefined,
      mobile_number: phone || undefined,
      timezone: timeZone || "UTC",
      organization_name: organization || undefined,
      department: department || undefined,
      start_date: startDate ? new Date(startDate) : undefined,
      specializations: Array.isArray(specializations) ? specializations : [],
      languages: Array.isArray(languages) ? languages : [],
      security_clearance: securityClearance || undefined,
      notes: notes || undefined,
      contact_name: emergencyContact?.name || undefined,
      contact_number: emergencyContact?.phone || undefined,
      contact_email: emergencyContact?.email || undefined,
      contact_relationship: emergencyContact?.relationship || undefined,
      isActive: true,
    };

    const user = await User.create(userData);

    // Remove password from response
    const userResponse = user.toObject();
    delete userResponse.password;
    delete userResponse.passwordConfirm;

    res.status(201).json({
      status: "success",
      data: {
        user: userResponse,
      },
    });
  } catch (error) {
    console.error("Error creating moderator:", error);
    res.status(400).json({
      status: "fail",
      message:
        error instanceof Error ? error.message : "Failed to create moderator",
    });
  }
};

export const getModerators = async (req: Request, res: Response) => {
  try {
    const moderators = await User.find({ role: "moderator" });

    res.status(200).json({
      status: "success",
      data: {
        moderators,
      },
    });
  } catch (error) {
    res.status(500).json({
      status: "error",
      message: "Something went wrong while fetching moderators",
    });
  }
};

export const getThirdPartyModerators = async (req: Request, res: Response) => {
  try {
    const thirdPartyModerators = await User.find({
      role: "third_party_moderator",
    });

    res.status(200).json({
      status: "success",
      data: {
        thirdPartyModerators,
      },
    });
  } catch (error) {
    res.status(500).json({
      status: "error",
      message: "Something went wrong while fetching third party moderators",
    });
  }
};

export const getDigitalForensicsModerators = async (
  req: Request,
  res: Response
) => {
  try {
    const digitalForensicsModerators = await User.find({
      role: "digital_forensics_moderator",
    });

    res.status(200).json({
      status: "success",
      data: {
        digitalForensicsModerators,
      },
    });
  } catch (error) {
    res.status(500).json({
      status: "error",
      message:
        "Something went wrong while fetching digital forensics moderators",
    });
  }
};

export const getAdminStats = async (req: Request, res: Response) => {
  try {
    const adminStats = await User.aggregate([
      { $match: { role: "admin" } },
      { $group: { _id: null, count: { $sum: 1 } } },
    ]);

    res.status(200).json({
      status: "success",
      data: {
        adminStats,
      },
    });
  } catch (error) {
    res.status(500).json({
      status: "error",
      message: "Something went wrong while fetching admin stats",
    });
  }
};

export const getUserRecords = async (req: Request, res: Response) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) {
      return res.status(404).json({
        status: "fail",
        message: "User not found",
      });
    }
    // return all the cases that the user has reviewed
    const cases = await Case.find({
      $or: [
        { userModeratorVerified: user._id },
        { userThirdPartyVerified: user._id },
        { userDigitalForensicsVerified: user._id },
      ],
    })
      .populate("userModeratorVerified", "name email")
      .populate("userThirdPartyVerified", "name email")
      .populate("userDigitalForensicsVerified", "name email");

    res.status(200).json({
      status: "success",
      data: {
        cases,
      },
    });
  } catch (error) {
    res.status(500).json({
      status: "error",
      message: "Something went wrong while fetching user records",
    });
  }
};

export const deleteUserController = async (req: Request, res: Response) => {
  try {
    const user = await User.findByIdAndDelete(req.params.id);
    if (!user) {
      return res.status(404).json({
        status: "fail",
        message: "User not found",
      });
    }
    res.status(200).json({
      status: "success",
      data: {
        user,
      },
    });
  } catch (error) {
    res.status(500).json({
      status: "error",
      message: "Something went wrong while deleting user",
    });
  }
};

export const deactiveUserController = async (req: Request, res: Response) => {
  try {
    const user = await User.findByIdAndUpdate(
      req.params.id,
      { isActive: false },
      { new: true }
    );

    if (!user) {
      return res.status(404).json({
        status: "fail",
        message: "User not found",
      });
    }
    res.status(200).json({
      status: "success",
      data: {
        user,
      },
    });
  } catch (error) {
    res.status(500).json({
      status: "error",
      message: "Something went wrong while deactivating user",
    });
  }
};

export const activateUserController = async (req: Request, res: Response) => {
  try {
    const user = await User.findByIdAndUpdate(
      req.params.id,
      { isActive: true },
      { new: true }
    );

    if (!user) {
      return res.status(404).json({
        status: "fail",
        message: "User not found",
      });
    }
    res.status(200).json({
      status: "success",
      data: {
        user,
      },
    });
  } catch (error) {
    res.status(500).json({
      status: "error",
      message: "Something went wrong while activating user",
    });
  }
};
