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