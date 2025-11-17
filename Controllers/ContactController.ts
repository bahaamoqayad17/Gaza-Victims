import { Request, Response } from "express";
import Contact from "@/Models/Contact";

// GET /api/contacts - Get all contacts
export const getAllContactsController = async (req: Request, res: Response) => {
  try {
    const contacts = await Contact.find().sort({ createdAt: -1 });

    res.status(200).json({
      status: "success",
      data: contacts,
    });
  } catch (error) {
    res.status(500).json({
      status: "error",
      message: "Something went wrong while fetching contacts",
      error: error instanceof Error ? error.message : "Unknown error",
    });
  }
};

// POST /api/contacts - Create a new contact
export const createContactController = async (req: Request, res: Response) => {
  try {
    const { name, email, mobile_number, message, type, recaptcha } = req.body;

    // Basic validation
    if (!name || !email || !mobile_number || !message) {
      return res.status(400).json({
        status: "fail",
        message:
          "Please provide all required fields: name, email, mobile_number, and message",
      });
    }

    // Validate reCAPTCHA checkbox (contact form uses a checkbox, not actual reCAPTCHA component)
    if (!recaptcha) {
      return res.status(400).json({
        status: "fail",
        message: "Please confirm that you are not a robot",
      });
    }

    const newContact = await Contact.create({
      name,
      email,
      mobile_number,
      message,
      type: type || "general", // Default type
    });

    res.status(201).json({
      status: "success",
      data: {
        contact: newContact,
      },
    });
  } catch (error) {
    res.status(400).json({
      status: "fail",
      message:
        error instanceof Error ? error.message : "Failed to create contact",
    });
  }
};
