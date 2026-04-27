import prisma from "../config/db.js";

export const getTeamsByTournament = async (req, res) => {
  try {
    const { tournamentId } = req.params;
    const teams = await prisma.team.findMany({
      where: { tournamentId },
      include: { 
        captain: { select: { id: true, name: true, email: true, avatar: true } },
        players: { include: { user: { select: { id: true, name: true, email: true, avatar: true } } } }
      }
    });
    res.json(teams);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Error fetching teams" });
  }
};

export const getTeamById = async (req, res) => {
  try {
    const { id } = req.params;
    const team = await prisma.team.findUnique({
      where: { id },
      include: { 
        captain: { select: { id: true, name: true, email: true, avatar: true } },
        players: { include: { user: { select: { id: true, name: true, email: true, avatar: true } } } },
        tournament: { select: { id: true, name: true, creatorId: true } }
      }
    });
    if (!team) return res.status(404).json({ error: "Team not found" });
    res.json(team);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Error fetching team" });
  }
};

export const getMyTeam = async (req, res) => {
  try {
    const userId = req.user.id;
    const team = await prisma.team.findFirst({
      where: { captainId: userId },
      include: { 
        players: { include: { user: { select: { id: true, name: true, email: true, avatar: true } } } },
        tournament: true,
        captain: { select: { id: true, name: true, email: true, avatar: true } }
      }
    });
    if (!team) return res.status(404).json({ error: "No team found" });
    res.json(team);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Error fetching your team" });
  }
};

export const claimTeam = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.id;

    const team = await prisma.team.findUnique({ 
      where: { id },
      include: { tournament: true }
    });

    if (!team) return res.status(404).json({ error: "Team not found" });
    if (team.captainId !== userId) return res.status(403).json({ error: "You are not the captain of this team" });

    res.json({ message: "Team claimed successfully", team });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Error claiming team" });
  }
};

export const createTeam = async (req, res) => {
  try {
    const { tournamentId } = req.params;
    const { name, captainEmail } = req.body;

    const tournament = await prisma.tournament.findUnique({ where: { id: tournamentId } });
    if (!tournament) return res.status(404).json({ error: "Tournament not found" });
    if (tournament.creatorId !== req.user.id) {
      return res.status(403).json({ error: "Only tournament creator can create teams" });
    }

    let captainId = null;
    if (captainEmail) {
      const captain = await prisma.user.findUnique({ where: { email: captainEmail } });
      captainId = captain?.id || null;
    }

    const team = await prisma.team.create({
      data: {
        name,
        tournamentId,
        captainId
      },
      include: { captain: true }
    });
    res.json(team);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Error creating team" });
  }
};

export const addPlayer = async (req, res) => {
  try {
    const { id } = req.params;
    const { userId, guestName, slot } = req.body;

    const team = await prisma.team.findUnique({ 
      where: { id },
      include: { tournament: true }
    });

    if (!team) return res.status(404).json({ error: "Team not found" });

    const isCaptain = team.captainId === req.user.id;
    const isCreator = team.tournament.creatorId === req.user.id;
    if (!isCaptain && !isCreator) {
      return res.status(403).json({ error: "Only captain or tournament creator can add players" });
    }

    const playerCount = await prisma.teamPlayer.count({ where: { teamId: id } });
    if (playerCount >= 5) {
      return res.status(400).json({ error: "Team already has 5 players" });
    }

    const player = await prisma.teamPlayer.create({
      data: {
        teamId: id,
        userId: userId || null,
        guestName: guestName || null,
        slot: slot || playerCount
      },
      include: { user: { select: { id: true, name: true, email: true, avatar: true } } }
    });
    res.json(player);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Error adding player" });
  }
};

export const updatePlayer = async (req, res) => {
  try {
    const { id, playerId } = req.params;
    const { userId, guestName, slot } = req.body;

    const team = await prisma.team.findUnique({ 
      where: { id },
      include: { tournament: true }
    });

    if (!team) return res.status(404).json({ error: "Team not found" });

    const isCaptain = team.captainId === req.user.id;
    const isCreator = team.tournament.creatorId === req.user.id;
    if (!isCaptain && !isCreator) {
      return res.status(403).json({ error: "Only captain or tournament creator can update players" });
    }

    const player = await prisma.teamPlayer.update({
      where: { id: playerId },
      data: { 
        userId: userId !== undefined ? userId : undefined,
        guestName: guestName !== undefined ? guestName : undefined,
        slot: slot !== undefined ? slot : undefined
      },
      include: { user: { select: { id: true, name: true, email: true, avatar: true } } }
    });
    res.json(player);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Error updating player" });
  }
};

export const removePlayer = async (req, res) => {
  try {
    const { id, playerId } = req.params;

    const team = await prisma.team.findUnique({ 
      where: { id },
      include: { tournament: true }
    });

    if (!team) return res.status(404).json({ error: "Team not found" });

    const isCaptain = team.captainId === req.user.id;
    const isCreator = team.tournament.creatorId === req.user.id;
    if (!isCaptain && !isCreator) {
      return res.status(403).json({ error: "Only captain or tournament creator can remove players" });
    }

    await prisma.teamPlayer.delete({ where: { id: playerId } });
    res.json({ message: "Player removed" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Error removing player" });
  }
};