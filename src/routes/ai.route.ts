import { Router, Request, Response } from "express";
import Product from "../models/product";

const router = Router();

router.post("/chat", async (req: Request, res: Response) => {
  const { message } = req.body;

  try {
    const products = await Product.find({}).limit(20).lean();
    const productList = products
      .map((p: any) => `- ${p.name}: $${p.price} (${p.brand})`)
      .join("\n");

    const contextMessage = `
You are ElectroShop assistant. Here are our products:
${productList}

Customer question: ${message}
    `;

    const response = await fetch("https://electroshop-ai-production.up.railway.app/chat", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ message: contextMessage }),
    });

    const data = await response.json();
    res.json({ reply: data.reply });
  } catch (err) {
    res.status(500).json({ error: "AI service ishlamayapti" });
  }
});

export default router;