import express from "express";
import cors from "cors";
import passport from "passport";
import dotenv from "dotenv";
import session from "express-session";
import userRoutes from "./src/routes/user.routes.js";
import authRoutes from "./src/routes/auth.routes.js";
import tournamentRoutes from "./src/routes/tournament.routes.js";
import teamRoutes from "./src/routes/team.routes.js";
import playerRoutes from "./src/routes/player.routes.js";
import matchRoutes from "./src/routes/match.routes.js";
import { googlePassportConfig } from "./src/config/passport.js";

dotenv.config();

const app = express();

googlePassportConfig(passport);

app.use(cors());
app.use(express.json());
app.use(session({
  secret: process.env.JWT_SECRET || "dota_track_secret",
  resave: false,
  saveUninitialized: false,
  cookie: { secure: false }
}));
app.use(passport.initialize());
app.use(passport.session());

app.use("/users", userRoutes);
app.use("/auth", authRoutes);
app.use("/tournaments", tournamentRoutes);
app.use("/teams", teamRoutes);
app.use("/players", playerRoutes);
app.use("/matches", matchRoutes);

app.get("/health", (req, res) => {
  res.send("API funcionando 🚀");
});

export default app;