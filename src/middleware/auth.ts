import { Request, Response, NextFunction } from "express"
import jwt from "jsonwebtoken"

export interface AuthRequest extends Request {
    user?: {
        userId: string
        role: string
    }
}

export const authenticate = (req: AuthRequest, res: Response, next: NextFunction) => {
    console.log("authenticate called")
    console.log("header:", req.headers.authorization)
    try {
        const token = req.headers.authorization?.split(" ")[1]
        
        if (!token) {
            return res.status(401).json({ message: "Token yo'q" })
        }

        const decoded = jwt.verify(token, process.env.JWT_SECRET as string) as { userId: string, role: string }
        req.user = decoded
        next()
    } catch (error) {
        res.status(401).json({ message: "Token yaroqsiz" })
    }
}

export const requireAdmin = (req: AuthRequest, res: Response, next: NextFunction) => {
    if (req.user?.role !== "admin") {
        return res.status(403).json({ message: "Admin huquqi kerak" })
    }
    next()
}