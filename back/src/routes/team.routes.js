import express from "express";
import { 
  getTeamsByTournament, getTeamById, getMyTeam,
  claimTeam, createTeam, addPlayer, updatePlayer, removePlayer
} from "../controllers/team.controller.js";
import { authenticateToken } from "../middlewares/auth.js";

const router = express.Router();

router.get("/my-team", authenticateToken, getMyTeam);
router.get("/:id", getTeamById);
router.post("/:id/claim", authenticateToken, claimTeam);
router.post("/:tournamentId/teams", authenticateToken, createTeam);
router.post("/:id/players", authenticateToken, addPlayer);
router.put("/:id/players/:playerId", authenticateToken, updatePlayer);
router.delete("/:id/players/:playerId", authenticateToken, removePlayer);

export default router;