import { Request, Response } from "express"
import Order from "../models/order"
import { AuthRequest } from "../middleware/auth"


export const createOrder = async (req: AuthRequest, res: Response) => {
    try {
        const { items, shippingAddress, totalAmount } = req.body
        const userId = req.user!.userId
        const order = await Order.create({
            user: userId,
            items,
            shippingAddress,
            totalAmount
        })
        res.status(201).json({ data: order })
    } catch (error) {
        res.status(500).json({ message: "Xato yuz berdi" })
    }
}

export const getMyOrders = async (req: AuthRequest, res: Response) => {
    try {
        const orders = await Order.find({ user: req.user!.userId })
        res.status(200).json({ data: orders })
    } catch (error) {
        res.status(500).json({ message: "Xato yuz berdi" })
    }
}

export const getOrderById = async (req: Request, res: Response) => {
    try {
        const order = await Order.findById(req.params.id)
        if (!order) {
            return res.status(404).json({ message: "Mahsulot topilmadi" })
        }
        res.status(200).json({ data: order })
    } catch (error) {
        res.status(500).json({ message: "Xato yuz berdi" })
    }
}

export const getAllOrders = async (req: Request, res: Response) => {
    try {
        const order = await Order.find()
        res.status(200).json({ data: order })
    } catch (error) {
        res.status(500).json({ message: "Xato yuz berdi" })
    }
}

export const updateOrderStatus = async (req: Request, res: Response) => {
    try {
       const order = await Order.findByIdAndUpdate(req.params.id, { status: req.body.status }, { new: true })
        if (!order) {
            return res.status(404).json({ message: "Mahsulot topilmadi" })
        }
        res.status(200).json({ data: order })
    } catch (error) {
        res.status(500).json({ message: "Xato yuz berdi" })
    }
}