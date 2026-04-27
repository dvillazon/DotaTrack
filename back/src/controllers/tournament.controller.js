import prisma from "../config/db.js";

export const getAllTournaments = async (req, res) => {
  try {
    const tournaments = await prisma.tournament.findMany({
      include: { 
        teams: { include: { captain: true } },
        creator: { select: { id: true, name: true, email: true, avatar: true } }
      },
      orderBy: { createdAt: "desc" }
    });
    res.json(tournaments);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Error fetching tournaments" });
  }
};

export const getActiveTournaments = async (req, res) => {
  try {
    const tournaments = await prisma.tournament.findMany({
      where: { status: { in: ["REGISTRATION", "IN_PROGRESS"] } },
      include: { 
        teams: { include: { captain: true } },
        creator: { select: { id: true, name: true, email: true, avatar: true } }
      },
      orderBy: { startDate: "asc" }
    });
    res.json(tournaments);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Error fetching active tournaments" });
  }
};

export const getPastTournaments = async (req, res) => {
  try {
    const tournaments = await prisma.tournament.findMany({
      where: { status: { in: ["COMPLETED", "CANCELLED"] } },
      include: { 
        teams: { include: { captain: true } },
        creator: { select: { id: true, name: true, email: true, avatar: true } }
      },
      orderBy: { startDate: "desc" }
    });
    res.json(tournaments);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Error fetching past tournaments" });
  }
};

export const getTournamentById = async (req, res) => {
  try {
    const { id } = req.params;
    const tournament = await prisma.tournament.findUnique({
      where: { id },
      include: { 
        creator: { select: { id: true, name: true, email: true, avatar: true } },
        teams: { 
          include: { 
            captain: { select: { id: true, name: true, email: true, avatar: true } },
            players: { include: { user: { select: { id: true, name: true, email: true, avatar: true } } } }
          }
        }
      }
    });
    if (!tournament) return res.status(404).json({ error: "Tournament not found" });
    res.json(tournament);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Error fetching tournament" });
  }
};

export const createTournament = async (req, res) => {
  try {
    const { name, description, format, bestOf, maxTeams, startDate, teams } = req.body;
    const userId = req.user.id;

    const tournamentData = {
      name,
      description,
      format,
      bestOf: bestOf || 3,
      maxTeams: maxTeams || 8,
      teamSlots: maxTeams || 8,
      startDate: new Date(startDate),
      creatorId: userId,
    };

    if (teams && teams.length > 0) {
      tournamentData.teams = {
        create: await Promise.all(teams.map(async (t) => {
          let captainId = null;
          if (t.captainEmail) {
            const captain = await prisma.user.findUnique({ where: { email: t.captainEmail } });
            captainId = captain?.id || null;
          }
          return {
            name: t.name,
            captainId
          };
        }))
      };
    }

    const tournament = await prisma.tournament.create({
      data: tournamentData,
      include: { 
        teams: { include: { captain: true } },
        creator: { select: { id: true, name: true, email: true, avatar: true } }
      }
    });
    res.json(tournament);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Error creating tournament" });
  }
};

export const updateTournament = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, description, format, bestOf, maxTeams, status, startDate } = req.body;

    const tournament = await prisma.tournament.findUnique({ where: { id } });
    if (!tournament) return res.status(404).json({ error: "Tournament not found" });
    if (tournament.creatorId !== req.user.id) {
      return res.status(403).json({ error: "Only creator can update tournament" });
    }

    const updated = await prisma.tournament.update({
      where: { id },
      data: { name, description, format, bestOf, maxTeams, status, startDate: startDate ? new Date(startDate) : undefined }
    });
    res.json(updated);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Error updating tournament" });
  }
};

export const deleteTournament = async (req, res) => {
  try {
    const { id } = req.params;
    const tournament = await prisma.tournament.findUnique({ where: { id } });
    if (!tournament) return res.status(404).json({ error: "Tournament not found" });
    if (tournament.creatorId !== req.user.id) {
      return res.status(403).json({ error: "Only creator can delete tournament" });
    }

    await prisma.tournament.delete({ where: { id } });
    res.json({ message: "Tournament deleted" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Error deleting tournament" });
  }
};

export const updateTeamCaptain = async (req, res) => {
  try {
    const { id, teamId } = req.params;
    const { captainEmail } = req.body;

    const tournament = await prisma.tournament.findUnique({ where: { id } });
    if (!tournament) return res.status(404).json({ error: "Tournament not found" });
    if (tournament.creatorId !== req.user.id) {
      return res.status(403).json({ error: "Only creator can change captain" });
    }

    const captain = await prisma.user.findUnique({ where: { email: captainEmail } });
    if (!captain) return res.status(404).json({ error: "Captain not found" });

    const team = await prisma.team.update({
      where: { id: teamId },
      data: { captainId: captain.id },
      include: { captain: true }
    });
    res.json(team);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Error updating captain" });
  }
};