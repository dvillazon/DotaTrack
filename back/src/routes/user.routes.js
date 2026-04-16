import express from "express";
import prisma from "../config/db.js";

const router = express.Router();

// crear usuario
router.get("/test", async (req, res) => {
  try {
    const user = await prisma.user.create({
      data: {
        name: "Carlos",
        email: "test@test.com",
        googleId: Math.random().toString(),
      },
    });

    res.json(user);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Error creando usuario" });
  }
});

export default router;