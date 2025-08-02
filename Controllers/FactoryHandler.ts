import CatchAsync from "@/Utils/CatchAsync";
import AppError from "@/Utils/AppError";
import ApiFeatures from "@/Utils/ApiFeatures";

export const deleteModel = (Model: any) =>
  CatchAsync(async (req: any, res: any, next: any) => {
    const doc = await Model.findByIdAndDelete(req.params.id);

    if (!doc) {
      return next(new AppError("No document found with that ID", 404));
    }

    res.status(204).json({
      status: "success",
      data: null,
    });
  });

export const update = (Model: any) =>
  CatchAsync(async (req: any, res: any, next: any) => {
    const doc = await Model.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });

    if (!doc) {
      return next(new AppError("No document found with that ID", 404));
    }

    res.status(200).json({
      status: "success",
      doc,
    });
  });

export const create = (Model: any) =>
  CatchAsync(async (req: any, res: any, next: any) => {
    const doc = await Model.create(req.body);

    res.status(201).json({
      status: "success",
      doc,
    });
  });

export const show = (Model: any) =>
  CatchAsync(async (req: any, res: any, next: any) => {
    const doc = await Model.findById(req.params.id);

    if (!doc) {
      return next(new AppError("No document found with that ID", 404));
    }

    res.status(200).json({
      status: "success",
      doc,
    });
  });

export const index = (Model: any) =>
  CatchAsync(async (req: any, res: any, next: any) => {
    let filter = {};
    const features = new ApiFeatures(Model.find(filter), req.query)
      .filter()
      .sort()
      .limitFields()
      .paginate();
    const doc = await features.query;

    res.status(200).json({
      status: "success",
      results: doc.length,
      doc,
    });
  });
