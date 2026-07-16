import { Request, Response, NextFunction } from "express";

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export const validateRegister = (req: Request, res: Response, next: NextFunction) => {
  const { name, email, password } = req.body;
  if (!name || typeof name !== "string" || name.trim().length < 2) {
    return res.status(400).json({ message: "Name must be at least 2 characters" });
  }
  if (!email || !EMAIL_REGEX.test(email)) {
    return res.status(400).json({ message: "Invalid email address" });
  }
  if (!password || password.length < 6) {
    return res.status(400).json({ message: "Password must be at least 6 characters" });
  }
  next();
};

export const validateLogin = (req: Request, res: Response, next: NextFunction) => {
  const { email, password } = req.body;
  if (!email || !EMAIL_REGEX.test(email)) {
    return res.status(400).json({ message: "Invalid email address" });
  }
  if (!password) {
    return res.status(400).json({ message: "Password is required" });
  }
  next();
};

export const validateProduct = (req: Request, res: Response, next: NextFunction) => {
  const { name, slug, description, price, brand } = req.body;
  if (!name || !slug || !description || !brand) {
    return res.status(400).json({ message: "name, slug, description, brand are required" });
  }
  if (price === undefined || isNaN(Number(price)) || Number(price) < 0) {
    return res.status(400).json({ message: "Price must be a positive number" });
  }
  next();
};

export const validateOrder = (req: Request, res: Response, next: NextFunction) => {
  const { items, shippingAddress, totalAmount } = req.body;
  if (!items || !Array.isArray(items) || items.length === 0) {
    return res.status(400).json({ message: "Order must have at least one item" });
  }
  if (!shippingAddress || typeof shippingAddress !== "string") {
    return res.status(400).json({ message: "Shipping address is required" });
  }
  if (totalAmount === undefined || isNaN(Number(totalAmount)) || Number(totalAmount) <= 0) {
    return res.status(400).json({ message: "Invalid total amount" });
  }
  next();
};

export const validateReview = (req: Request, res: Response, next: NextFunction) => {
  const { product, rating, comment } = req.body;
  if (!product) {
    return res.status(400).json({ message: "Product ID is required" });
  }
  if (!rating || isNaN(Number(rating)) || Number(rating) < 1 || Number(rating) > 5) {
    return res.status(400).json({ message: "Rating must be between 1 and 5" });
  }
  if (!comment || typeof comment !== "string" || comment.trim().length < 3) {
    return res.status(400).json({ message: "Comment must be at least 3 characters" });
  }
  next();
};
