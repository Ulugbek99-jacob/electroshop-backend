import { Request, Response } from "express"
import Category from "../models/category"

export const getCategories = async (req: Request, res: Response) => {
    try {
        const categories = await Category.find()
        res.status(200).json({ data: categories })
    } catch (error) {
        res.status(500).json({ message: "Xato yuz berdi" })
    }
}

export const getCategoryById = async (req: Request, res: Response) => {
    try {
        const product = await Category.findById(req.params.id)
        if (!product) {
            return res.status(404).json({ message: "Mahsulot topilmadi" })
        }
        res.status(200).json({ data: product })
    } catch (error) {
        res.status(500).json({ message: "Xato yuz berdi" })
    }
}

export const updateCategory = async (req: Request, res: Response) => {
    try {
        const category = await Category.findByIdAndUpdate(
            req.params.id, 
            req.body, 
            { new: true }  // yangilangan versiyani qaytaradi
        )
        if (!category) {
            return res.status(404).json({ message: "Mahsulot topilmadi" })
        }
        res.status(200).json({ data: category })
    } catch (error) {
        res.status(500).json({ message: "Xato yuz berdi" })
    }
}

export const deleteCategory = async (req: Request, res: Response) => {
    try {
        await Category.findByIdAndDelete(req.params.id)
        res.status(200).json({ message: "Mahsulot o'chirildi" })
    } catch (error) {
        res.status(500).json({ message: "Xato yuz berdi" })
    }
}

export const createCategory = async (req: Request, res: Response) => {
    try {
        const { name, slug, description, image } = req.body
        const product = await Category.create({ name, slug, description, image })
        res.status(201).json({ data: product })
    } catch (error) {
        res.status(500).json({ message: "Xato yuz berdi" })
    }
}