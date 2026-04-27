import express from "express";
import { 
  generateBracket, getTournamentMatches, getMatchById,
  verifyMatchResult, registerMatchResult
} from "../controllers/match.controller.js";
import { authenticateToken } from "../middlewares/auth.js";

const router = express.Router();

router.post("/tournaments/:id/generate-bracket", authenticateToken, generateBracket);
router.get("/tournaments/:id/matches", getTournamentMatches);
router.get("/:id", getMatchById);
router.post("/:id/verify", authenticateToken, verifyMatchResult);
router.post("/:id/result", authenticateToken, registerMatchResult);

export default router;