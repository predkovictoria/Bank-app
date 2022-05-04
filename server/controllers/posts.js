import express from "express";
import mongoose from "mongoose";

import PostMessage from "../models/postMessage.js";

const router = express.Router();

export const getPosts = async (req, res) => {
  try {
    const filters = processFilters(req.query);
    const postMessages = await PostMessage.find(filters);

    res.status(200).json(postMessages);
  } catch (error) {
    console.log(error);
    res.status(404).json({ message: error.message });
  }
};

export const getPostMaxBalance = async (req, res) => {
  const maxBalance = await PostMessage.aggregate([
    { $match: { balance: { $ne: "" } } },
    {
      $group: {
        _id: "balance",
        Max: {
          $max: {
            $toInt: "$balance",
          },
        },
      },
    },
  ]);
  res.status(200).json(maxBalance[0].Max);
};

export const getPostCitiess = async (req, res) => {
  const postMessages = await PostMessage.find({}, "city").distinct("city");
  res.status(200).json(postMessages);
};

export const getPost = async (req, res) => {
  const { id } = req.params;

  try {
    const post = await PostMessage.findById(id);

    res.status(200).json(post);
  } catch (error) {
    res.status(404).json({ message: error.message });
  }
};

export const createPost = async (req, res) => {
  const {
    balance,
    city,
    clientName,
    haveMortgage,
    numCreditCards,
    selectedFile,
  } = req.body;

  const newPostMessage = new PostMessage({
    clientName,
    city,
    balance,
    haveMortgage,
    numCreditCards,
    selectedFile,
  });

  try {
    await newPostMessage.save();

    res.status(201).json(newPostMessage);
  } catch (error) {
    res.status(409).json({ message: error.message });
  }
};

export const updatePost = async (req, res) => {
  const { id } = req.params;
  const {
    clientName,
    city,
    balance,
    haveMortgage,
    numCreditCards,
    selectedFile,
  } = req.body;

  if (!mongoose.Types.ObjectId.isValid(id))
    return res.status(404).send(`No post with id: ${id}`);

  const updatedPost = {
    clientName,
    city,
    balance,
    haveMortgage,
    numCreditCards,
    selectedFile,
    selectedFile,
    _id: id,
  };

  await PostMessage.findByIdAndUpdate(id, updatedPost, { new: true });

  res.json(updatedPost);
};

export const deletePost = async (req, res) => {
  const { id } = req.params;

  if (!mongoose.Types.ObjectId.isValid(id))
    return res.status(404).send(`No post with id: ${id}`);

  await PostMessage.findByIdAndRemove(id);

  res.json({ message: "Post deleted successfully." });
};

export const likePost = async (req, res) => {
  const { id } = req.params;

  if (!mongoose.Types.ObjectId.isValid(id))
    return res.status(404).send(`No post with id: ${id}`);

  const post = await PostMessage.findById(id);

  const updatedPost = await PostMessage.findByIdAndUpdate(
    id,
    { likeCount: post.likeCount + 1 },
    { new: true }
  );

  res.json(updatedPost);
};

const processFilters = ({
  haveMortgage,
  balanceFrom,
  balanceTo,
  numCreditCards,
  city,
}) => {
  const resultFilter = {};

  if (haveMortgage) {
    if (
      haveMortgage === true ||
      haveMortgage === "true" ||
      haveMortgage.toLowerCase() === "yes"
    ) {
      resultFilter.haveMortgage = { $regex: new RegExp("yes", "i") };
    } else if (
      haveMortgage === false ||
      haveMortgage === "false" ||
      haveMortgage.toLowerCase() === "no"
    ) {
      resultFilter.haveMortgage = { $regex: new RegExp("no", "i") };
    }
  }

  resultFilter.balance = { $ne: "" };

  if (balanceFrom) {
    resultFilter["$and"] = [
      {
        $expr: {
          $gte: [
            { $convert: { input: "$balance", to: "decimal" } },
            Number(balanceFrom),
          ],
        },
      },
    ];
  }

  if (balanceTo) {
    const and = [...(resultFilter["$and"] || [])];
    and.push({
      $expr: {
        $lte: [
          { $convert: { input: "$balance", to: "decimal" } },
          Number(balanceTo),
        ],
      },
    });

    resultFilter["$and"] = and;
  }

  if (numCreditCards) {
    resultFilter.numCreditCards = { $gte: Number(numCreditCards) };
  }

  if (city) {
    resultFilter.city = { $in: city };
  }

  return resultFilter;
};

export default router;
