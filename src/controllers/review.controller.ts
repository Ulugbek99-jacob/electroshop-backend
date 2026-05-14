import { Request, Response } from "express"
import { AuthRequest } from "../middleware/auth"
import Review from "../models/review"



export const createReview = async (req: AuthRequest, res: Response) => {
    try {
        const { product, rating, comment  } = req.body
        const userId = req.user!.userId
        const review = await Review.create({
            user: userId,
            product,
            rating,
            comment
        })
        res.status(201).json({ data: review })
    } catch (error) {
        res.status(500).json({ message: "Xato yuz berdi" })
    }
}

export const getProductReviews = async (req: AuthRequest, res: Response) => {
    try {
        const { productId } = req.params
        const reviews = await Review.find({ product: productId as string })
        res.status(200).json({ data: reviews })
    } catch (error) {
        res.status(500).json({ message: "Xato yuz berdi" })
    }
}

export const deleteReview = async (req: Request, res: Response) => {
    try {
        await Review.findByIdAndDelete(req.params.id)
        res.status(200).json({ message: "Comment o'chirildi" })
    } catch (error) {
        res.status(500).json({ message: "Xato yuz berdi" })
    }
}