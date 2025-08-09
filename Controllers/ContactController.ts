import { Request, Response } from "express";
import Contact from "@/Models/Contact";
import ApiFeatures from "@/Utils/ApiFeatures";

// GET /api/contacts - Get all contacts with filtering, sorting, pagination
export const getAllContactsController = async (req: Request, res: Response) => {
  try {
    // Use ApiFeatures for filtering, sorting, pagination
    const features = new ApiFeatures(Contact.find(), req.query)
      .filter()
      .sort()
      .limitFields()
      .paginate();

    const contacts = await features.query;
    const totalContacts = await Contact.countDocuments();

    res.status(200).json({
      status: "success",
      results: contacts.length,
      total: totalContacts,
      data: {
        contacts,
      },
    });
  } catch (error) {
    res.status(500).json({
      status: "error",
      message: "Something went wrong while fetching contacts",
      error: error instanceof Error ? error.message : "Unknown error",
    });
  }
};

// GET /api/contacts/:id - Get a specific contact by ID
export const getContactController = async (req: Request, res: Response) => {
  try {
    const contact = await Contact.findById(req.params.id);

    if (!contact) {
      return res.status(404).json({
        status: "fail",
        message: "No contact found with that ID",
      });
    }

    res.status(200).json({
      status: "success",
      data: {
        contact,
      },
    });
  } catch (error) {
    res.status(500).json({
      status: "error",
      message: "Something went wrong while fetching the contact",
      error: error instanceof Error ? error.message : "Unknown error",
    });
  }
};

// POST /api/contacts - Create a new contact
export const createContactController = async (req: Request, res: Response) => {
  try {
    const { name, email, mobile_number, message, type } = req.body;

    // Basic validation
    if (!name || !email || !mobile_number || !message) {
      return res.status(400).json({
        status: "fail",
        message:
          "Please provide all required fields: name, email, mobile_number, and message",
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

// PUT /api/contacts/:id - Update a contact
export const updateContactController = async (req: Request, res: Response) => {
  try {
    const contact = await Contact.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });

    if (!contact) {
      return res.status(404).json({
        status: "fail",
        message: "No contact found with that ID",
      });
    }

    res.status(200).json({
      status: "success",
      data: {
        contact,
      },
    });
  } catch (error) {
    res.status(400).json({
      status: "fail",
      message:
        error instanceof Error ? error.message : "Failed to update contact",
    });
  }
};

// DELETE /api/contacts/:id - Delete a contact
export const deleteContactController = async (req: Request, res: Response) => {
  try {
    const contact = await Contact.findByIdAndDelete(req.params.id);

    if (!contact) {
      return res.status(404).json({
        status: "fail",
        message: "No contact found with that ID",
      });
    }

    res.status(204).json({
      status: "success",
      data: null,
    });
  } catch (error) {
    res.status(500).json({
      status: "error",
      message: "Something went wrong while deleting the contact",
      error: error instanceof Error ? error.message : "Unknown error",
    });
  }
};

// GET /api/contacts/stats - Get contact statistics
export const getContactStatsController = async (
  req: Request,
  res: Response
) => {
  try {
    const totalContacts = await Contact.countDocuments();

    // Get contacts by type
    const contactsByType = await Contact.aggregate([
      {
        $group: {
          _id: "$type",
          count: { $sum: 1 },
        },
      },
    ]);

    // Get recent contacts (last 30 days)
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

    const recentContacts = await Contact.countDocuments({
      createdAt: { $gte: thirtyDaysAgo },
    });

    // Get contacts by month for the current year
    const currentYear = new Date().getFullYear();
    const contactsByMonth = await Contact.aggregate([
      {
        $match: {
          createdAt: {
            $gte: new Date(`${currentYear}-01-01`),
            $lt: new Date(`${currentYear + 1}-01-01`),
          },
        },
      },
      {
        $group: {
          _id: { $month: "$createdAt" },
          count: { $sum: 1 },
        },
      },
      {
        $sort: { _id: 1 },
      },
    ]);

    res.status(200).json({
      status: "success",
      data: {
        totalContacts,
        recentContacts,
        contactsByType,
        contactsByMonth,
      },
    });
  } catch (error) {
    res.status(500).json({
      status: "error",
      message: "Something went wrong while fetching contact statistics",
      error: error instanceof Error ? error.message : "Unknown error",
    });
  }
};

// GET /api/contacts/search - Search contacts
export const searchContactsController = async (req: Request, res: Response) => {
  try {
    const { q, type, limit = 10 } = req.query;

    let query: any = {};

    // Text search
    if (q) {
      query.$or = [
        { name: { $regex: q, $options: "i" } },
        { email: { $regex: q, $options: "i" } },
        { message: { $regex: q, $options: "i" } },
      ];
    }

    // Filter by type
    if (type) {
      query.type = type;
    }

    const contacts = await Contact.find(query)
      .limit(Number(limit))
      .sort({ createdAt: -1 });

    res.status(200).json({
      status: "success",
      results: contacts.length,
      data: {
        contacts,
      },
    });
  } catch (error) {
    res.status(500).json({
      status: "error",
      message: "Something went wrong while searching contacts",
      error: error instanceof Error ? error.message : "Unknown error",
    });
  }
};
