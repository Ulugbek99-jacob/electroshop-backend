import { Request, Response } from "express";
import User from "../models/user";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken"
import { AuthRequest } from "../middleware/auth"

export const register = async (req: Request, res: Response) => {
    try {
        const { name, email, password, role } = req.body
        // 1. Email bor mi?
        const existingUser = await User.findOne({ email })
        if (existingUser) {
        return res.status(400).json({ message: "Email allaqachon mavjud" })
         }
  // 2. Parolni hash qil
   const hashedPassword = await bcrypt.hash(password, 10)
 // 3. Userni yarat
 const user = await User.create({ name, email, password: hashedPassword, role })

 const { password: _, ...userWithoutPassword } = user.toObject()
 
 res.status(201).json({ message: "Muvaffaqiyatli", data: userWithoutPassword })
} catch (error) {
        res.status(500).json({ message: "failed" })
    }
}


export const login = async (req: Request, res: Response) => {
    try {
        const { email, password } = req.body
        const existingUser = await User.findOne({ email })
        if (!existingUser) {
            return res.status(401).json({ message: "Email yoki parol noto'g'ri" })
        }
        const isPasswordValid = await bcrypt.compare(password, existingUser.password)
        if (!isPasswordValid) {
            return res.status(401).json({ message: "Email yoki parol noto'g'ri" })
        }
        const token = jwt.sign(
            { userId: existingUser._id, role: existingUser.role },
            process.env.JWT_SECRET as string,
            { expiresIn: "7d" }
        )
        res.status(200).json({ message: "Muvaffaqiyatli", token, 
            user: { 
                _id: existingUser._id,
                name: existingUser.name,
                email: existingUser.email,
                role: existingUser.role
            }
         })
    } catch (error) {
        res.status(500).json({ message: "Xato yuz berdi" })
    }
}

export const getProfile = async (req: AuthRequest, res: Response) => {
    try {
        const userId = req.user?.userId
        const user = await User.findById(userId).select("-password")
        if (!user) {
        return res.status(404).json({ message: "Topilmadi" })
         }

           res.status(200).json({ data: user })
    } catch (error) {
        res.status(500).json({ message: "Xato yuz berdi" })
    }
}

