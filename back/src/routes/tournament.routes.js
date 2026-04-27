import express from "express";
import { 
  getAllTournaments, getActiveTournaments, getPastTournaments,
  getTournamentById, createTournament, updateTournament, 
  deleteTournament, updateTeamCaptain
} from "../controllers/tournament.controller.js";
import { authenticateToken } from "../middlewares/auth.js";

const router = express.Router();

router.get("/", getAllTournaments);
router.get("/active", getActiveTournaments);
router.get("/past", getPastTournaments);
router.get("/:id", getTournamentById);
router.post("/", authenticateToken, createTournament);
router.put("/:id", authenticateToken, updateTournament);
router.delete("/:id", authenticateToken, deleteTournament);
router.put("/:id/teams/:teamId/captain", authenticateToken, updateTeamCaptain);

export default router;