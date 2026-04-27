import * as openDotaService from "../services/opendota.service.js";

export const getPlayerByAccountId = async (req, res) => {
  try {
    const { accountId } = req.params;
    const player = await openDotaService.getPlayerByAccountId(accountId);
    res.json(player);
  } catch (error) {
    res.status(404).json({ error: error.message || "Error fetching player data" });
  }
};

export const searchPlayers = async (req, res) => {
  try {
    const { q } = req.query;
    if (!q) {
      return res.status(400).json({ error: "Query parameter 'q' is required" });
    }
    const players = await openDotaService.searchPlayers(q);
    res.json(players);
  } catch (error) {
    res.status(500).json({ error: error.message || "Error searching players" });
  }
};

export const getHeroes = async (req, res) => {
  try {
    const heroes = await openDotaService.getHeroes();
    res.json(heroes);
  } catch (error) {
    res.status(500).json({ error: error.message || "Error fetching heroes" });
  }
};