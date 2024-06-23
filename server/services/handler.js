import asyncHandler from "express-async-handler";
import { ApiError, ApiFeatures } from "../utils/index.js";

const deleteOne = (Model) =>
  asyncHandler(async (req, res, next) => {
    const { id } = req.params;
    if (req.user) {
      if (req.user._id.toString() !== id)
        return next(
          new ApiError("you are not allowed to preform this action", 403)
        );
    }

    const document = await Model.findByIdAndDelete(id);
    if (!document) {
      return next(new ApiError(`No document for this id ${id}`, 404));
    }
    res.clearCookie("jwt").status(204);
  });

const updateOne = (Model) =>
  asyncHandler(async (req, res, next) => {
    const { id } = req.params;
    const document = await Model.findByIdAndUpdate(id, req.body, { new: true });

    if (!document) {
      return next(new ApiError(`no document with this id :${id}`, 404));
    }

    res.status(200).json({ data: document });
  });

const createOne = (Model) =>
  asyncHandler(async (req, res) => {
    const document = await Model.create(req.body);
    res.status(201).json({ data: document, ok: true });
  });

const getOne = (Model, populationOpt) =>
  asyncHandler(async (req, res, next) => {
    const { id } = req.params;
    // 1) Build query
    let query = Model.findById(id);

    if (populationOpt) {
      query = query.populate(populationOpt);
    }

    // 2) Execute query
    const document = await query;

    if (!document) {
      return next(new ApiError(`no document with this id :${id}`, 404));
    }
    res.status(200).json({ data: document });
  });

const getAll = (Model) =>
  asyncHandler(async (req, res, next) => {
    const filter = {};
    if (req.filterObject) {
      req.filterObject = filter;
    }
    const docCounts = await Model.countDocuments();
    const apiFutures = new ApiFeatures(Model.find(filter), req.query)
      .filter()
      .limitFildes()
      .pagenate(docCounts)
      .serch()
      .sort();
    const { mongooseQuery, pagenation } = apiFutures;
    const document = await mongooseQuery;
    if (!document) {
      return next(new ApiError(`no Brand found`, 404));
    }
    res
      .status(200)
      .json({ results: document.length, pagenation, data: document });
  });

export { deleteOne, updateOne, createOne, getOne, getAll };
