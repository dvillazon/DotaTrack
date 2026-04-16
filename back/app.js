import express from "express";
import cors from "cors";
import userRoutes from "./src/routes/user.routes.js";

const app = express(); // ✅ PRIMERO creas app

// middlewares
app.use(cors());
app.use(express.json());

// rutas
app.use("/users", userRoutes); // ✅ DESPUÉS la usas

// ruta base
app.get("/", (req, res) => {
  res.send("API funcionando 🚀");
});

export default app;