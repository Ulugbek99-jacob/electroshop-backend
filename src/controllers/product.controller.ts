import { Request, Response } from "express"
import Product from "../models/product"

export const getProducts = async (req: Request, res: Response) => {
    try {
        const products = await Product.find({ isActive: true })
        res.status(200).json({ data: products })
    } catch (error) {
        res.status(500).json({ message: "Xato yuz berdi" })
    }
}

export const getProductById = async (req: Request, res: Response) => {
    try {
        const product = await Product.findById(req.params.id)
        if (!product) {
            return res.status(404).json({ message: "Mahsulot topilmadi" })
        }
        res.status(200).json({ data: product })
    } catch (error) {
        res.status(500).json({ message: "Xato yuz berdi" })
    }
}

export const updateProduct = async (req: Request, res: Response) => {
    try {
        const product = await Product.findByIdAndUpdate(
            req.params.id, 
            req.body, 
            { new: true }  // yangilangan versiyani qaytaradi
        )
        if (!product) {
            return res.status(404).json({ message: "Mahsulot topilmadi" })
        }
        res.status(200).json({ data: product })
    } catch (error) {
        res.status(500).json({ message: "Xato yuz berdi" })
    }
}

export const deleteProduct = async (req: Request, res: Response) => {
    try {
        await Product.findByIdAndUpdate(req.params.id, { isActive: false })
        res.status(200).json({ message: "Mahsulot o'chirildi" })
    } catch (error) {
        res.status(500).json({ message: "Xato yuz berdi" })
    }
}

export const createProduct = async (req: Request, res: Response) => {
    try {
        const { name, slug, description, price, stock, brand, category, images, specs } = req.body
        const product = await Product.create({ name, slug, description, price, stock, brand, category, images, specs })
        res.status(201).json({ data: product })
    } catch (error) {
        res.status(500).json({ message: "Xato yuz berdi" })
    }
}

export const getProductBySlug = async (req: Request, res: Response) => {
    try {
        const product = await Product.findOne({ slug: req.params.slug as string })
        if (!product) {
            return res.status(404).json({ message: "Topilmadi" })
        }
        res.status(200).json({ data: product })
    } catch (error) {
        res.status(500).json({ message: "Xato yuz berdi" })
    }
}