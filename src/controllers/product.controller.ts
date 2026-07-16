import { Request, Response } from "express";
import Product from "../models/product";
import Category from "../models/category";

export const getProducts = async (req: Request, res: Response) => {
  try {
    const { search, category, minPrice, maxPrice, sort, page = 1, limit = 20 } = req.query;

    const filter: Record<string, unknown> = { isActive: true };
    if (search) filter.name = { $regex: search, $options: "i" };
    if (category) {
      const cat = await Category.findOne({ slug: String(category) });
      if (cat) filter.category = cat._id;
      else return res.status(200).json({ data: [], pagination: { total: 0, page: 1, limit: 20, pages: 0 } });
    }
    if (minPrice || maxPrice) {
      filter.price = {};
      if (minPrice) (filter.price as Record<string, number>).$gte = Number(minPrice);
      if (maxPrice) (filter.price as Record<string, number>).$lte = Number(maxPrice);
    }

    const sortOption: Record<string, 1 | -1> =
      sort === "price_asc" ? { price: 1 }
      : sort === "price_desc" ? { price: -1 }
      : { createdAt: -1 };

    const skip = (Number(page) - 1) * Number(limit);
    const [products, total] = await Promise.all([
      Product.find(filter).sort(sortOption).skip(skip).limit(Number(limit)).populate("category", "name slug"),
      Product.countDocuments(filter),
    ]);

    res.status(200).json({
      data: products,
      pagination: { total, page: Number(page), limit: Number(limit), pages: Math.ceil(total / Number(limit)) },
    });
  } catch {
    res.status(500).json({ message: "Internal server error" });
  }
};

export const getProductById = async (req: Request, res: Response) => {
  try {
    const product = await Product.findById(req.params.id).populate("category", "name slug");
    if (!product) return res.status(404).json({ message: "Product not found" });
    res.status(200).json({ data: product });
  } catch {
    res.status(500).json({ message: "Internal server error" });
  }
};

export const getProductBySlug = async (req: Request, res: Response) => {
  try {
    const product = await Product.findOne({ slug: String(req.params.slug) }).populate("category", "name slug");
    if (!product) return res.status(404).json({ message: "Product not found" });
    res.status(200).json({ data: product });
  } catch {
    res.status(500).json({ message: "Internal server error" });
  }
};

export const getFeaturedProducts = async (_req: Request, res: Response) => {
  try {
    const products = await Product.find({ isFeatured: true, isActive: true }).populate("category", "name slug");
    res.status(200).json({ data: products });
  } catch {
    res.status(500).json({ message: "Internal server error" });
  }
};

export const createProduct = async (req: Request, res: Response) => {
  try {
    const { name, slug, description, price, stock, brand, category, images, specs } = req.body as {
      name: string; slug: string; description: string; price: number;
      stock?: number; brand: string; category?: string; images?: string[]; specs?: Record<string, string>;
    };
    const existing = await Product.findOne({ slug } as object);
    if (existing) return res.status(400).json({ message: "Slug already exists" });
    const product = await Product.create({ name, slug, description, price, ...(stock !== undefined && { stock }), brand, ...(category && { category }), ...(images && { images }), ...(specs && { specs }) });
    res.status(201).json({ data: product });
  } catch {
    res.status(500).json({ message: "Internal server error" });
  }
};

export const updateProduct = async (req: Request, res: Response) => {
  try {
    const product = await Product.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
    if (!product) return res.status(404).json({ message: "Product not found" });
    res.status(200).json({ data: product });
  } catch {
    res.status(500).json({ message: "Internal server error" });
  }
};

export const deleteProduct = async (req: Request, res: Response) => {
  try {
    const product = await Product.findByIdAndUpdate(req.params.id, { isActive: false }, { new: true });
    if (!product) return res.status(404).json({ message: "Product not found" });
    res.status(200).json({ message: "Product deactivated" });
  } catch {
    res.status(500).json({ message: "Internal server error" });
  }
};
