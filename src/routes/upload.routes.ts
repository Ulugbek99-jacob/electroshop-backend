import { Router } from "express"
import { authenticate } from "../middleware/auth"
import { upload } from "../middleware/upload"

const router = Router()

router.post("/", authenticate, upload.single("image"), (req, res) => {
    if (!req.file) {
        return res.status(400).json({ message: "Rasm yuklanmadi" })
    }
    res.status(200).json({ 
        url: (req.file as any).path 
    })
})

export default router