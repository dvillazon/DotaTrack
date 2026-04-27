import express from "express";
import { getPlayerByAccountId, searchPlayers, getHeroes } from "../controllers/player.controller.js";

const router = express.Router();

router.get("/search", searchPlayers);
router.get("/heroes", getHeroes);
router.get("/:accountId", getPlayerByAccountId);

export default router;