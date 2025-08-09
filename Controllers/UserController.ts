import { Request, Response } from "express";
import User from "@/Models/User";

// REST API Controllers
export const getAllUsersController = async (req: Request, res: Response) => {
  try {
    const users = await User.find().select("-password");

    res.status(200).json({
      status: "success",
      results: users.length,
      data: {
        users,
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
