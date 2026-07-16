import { Request, Response } from "express";
import { AuthRequest } from "../middleware/auth";
import Review from "../models/review";

export const createReview = async (req: AuthRequest, res: Response) => {
  try {
    const { product, rating, comment } = req.body;
    const userId = req.user!.userId;

    const existing = await Review.findOne({ user: userId, product });
    if (existing) {
      return res.status(400).json({ message: "You have already reviewed this product" });
    }

    const review = await Review.create({ user: userId, product, rating, comment });
    res.status(201).json({ data: review });
  } catch {
    res.status(500).json({ message: "Internal server error" });
  }
};

export const getProductReviews = async (req: Request, res: Response) => {
  try {
    const reviews = await Review.find({ product: req.params.productId } as object)
      .populate("user", "name")
      .sort({ createdAt: -1 });
    res.status(200).json({ data: reviews });
  } catch {
    res.status(500).json({ message: "Internal server error" });
  }
};

export const deleteReview = async (req: AuthRequest, res: Response) => {
  try {
    const review = await Review.findById(req.params.id);
    if (!review) {
      return res.status(404).json({ message: "Review not found" });
    }
    const isOwner = review.user.toString() === req.user!.userId;
    const isAdmin = req.user!.role === "admin";
    if (!isOwner && !isAdmin) {
      return res.status(403).json({ message: "Access denied" });
    }
    await review.deleteOne();
    res.status(200).json({ message: "Review deleted" });
  } catch {
    res.status(500).json({ message: "Internal server error" });
  }
};
