import { Response } from "express";
import Order from "../models/order";
import Product from "../models/product";
import { AuthRequest } from "../middleware/auth";

export const createOrder = async (req: AuthRequest, res: Response) => {
  try {
    const { items, shippingAddress, totalAmount } = req.body;
    const userId = req.user!.userId;

    // Validate stock for each item
    for (const item of items) {
      const product = await Product.findById(item.product);
      if (!product) {
        return res.status(404).json({ message: `Product not found: ${item.product}` });
      }
      if (product.stock < item.quantity) {
        return res.status(400).json({ message: `Insufficient stock for "${product.name}"` });
      }
    }

    // Deduct stock
    for (const item of items) {
      await Product.findByIdAndUpdate(item.product, { $inc: { stock: -item.quantity } });
    }

    const order = await Order.create({ user: userId, items, shippingAddress, totalAmount });
    res.status(201).json({ data: order });
  } catch {
    res.status(500).json({ message: "Internal server error" });
  }
};

export const getMyOrders = async (req: AuthRequest, res: Response) => {
  try {
    const orders = await Order.find({ user: req.user!.userId }).sort({ createdAt: -1 });
    res.status(200).json({ data: orders });
  } catch {
    res.status(500).json({ message: "Internal server error" });
  }
};

export const getOrderById = async (req: AuthRequest, res: Response) => {
  try {
    const order = await Order.findById(req.params.id);
    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }
    // Only owner or admin can view
    if (order.user.toString() !== req.user!.userId && req.user!.role !== "admin") {
      return res.status(403).json({ message: "Access denied" });
    }
    res.status(200).json({ data: order });
  } catch {
    res.status(500).json({ message: "Internal server error" });
  }
};

export const getAllOrders = async (_req: AuthRequest, res: Response) => {
  try {
    const orders = await Order.find().populate("user", "name email").sort({ createdAt: -1 });
    res.status(200).json({ data: orders });
  } catch {
    res.status(500).json({ message: "Internal server error" });
  }
};

export const updateOrderStatus = async (req: AuthRequest, res: Response) => {
  try {
    const validStatuses = ["pending", "confirmed", "shipped", "delivered", "cancelled"];
    if (!validStatuses.includes(req.body.status)) {
      return res.status(400).json({ message: "Invalid order status" });
    }
    const order = await Order.findByIdAndUpdate(
      req.params.id,
      { status: req.body.status },
      { new: true }
    );
    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }
    res.status(200).json({ data: order });
  } catch {
    res.status(500).json({ message: "Internal server error" });
  }
};
