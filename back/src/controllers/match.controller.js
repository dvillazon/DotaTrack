import prisma from "../config/db.js";
import * as openDotaService from "../services/opendota.service.js";

const shuffleArray = (array) => {
  const shuffled = [...array];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
};

export const generateBracket = async (req, res) => {
  try {
    const { id } = req.params;
    const tournament = await prisma.tournament.findUnique({
      where: { id },
      include: { teams: true }
    });

    if (!tournament) return res.status(404).json({ error: "Tournament not found" });
    if (tournament.creatorId !== req.user.id) {
      return res.status(403).json({ error: "Only creator can generate bracket" });
    }

    const teams = tournament.teams;
    if (teams.length < 2) {
      return res.status(400).json({ error: "Need at least 2 teams" });
    }

    const shuffledTeams = shuffleArray(teams);
    const matches = [];

    if (tournament.format === "SINGLE_ELIMINATION") {
      const rounds = Math.ceil(Math.log2(shuffledTeams.length));
      let matchNumber = 1;

      for (let round = 1; round <= rounds; round++) {
        const matchesInRound = Math.pow(2, rounds - round);
        for (let i = 0; i < matchesInRound; i++) {
          const teamIndex = i * 2;
          matches.push({
            tournamentId: id,
            bracket: "UPPER",
            round,
            matchNumber: matchNumber++,
            team1Id: shuffledTeams[teamIndex]?.id || null,
            team2Id: shuffledTeams[teamIndex + 1]?.id || null,
            bestOf: tournament.bestOf,
            status: "PENDING"
          });
        }
      }
    } else if (tournament.format === "DOUBLE_ELIMINATION") {
      const numTeams = shuffledTeams.length;
      const ubRounds = Math.ceil(Math.log2(numTeams));
      const lbRounds = (ubRounds - 1) * 2;
      let matchNumber = 1;

      // Upper Bracket
      for (let round = 1; round <= ubRounds; round++) {
        const matchesInRound = Math.pow(2, ubRounds - round);
        for (let i = 0; i < matchesInRound; i++) {
          const teamIndex = i * 2;
          matches.push({
            tournamentId: id,
            bracket: "UPPER",
            round,
            matchNumber: matchNumber++,
            team1Id: shuffledTeams[teamIndex]?.id || null,
            team2Id: shuffledTeams[teamIndex + 1]?.id || null,
            bestOf: tournament.bestOf,
            status: "PENDING"
          });
        }
      }

      // Lower Bracket (simplified)
      for (let round = 1; round <= lbRounds; round++) {
        const matchesInRound = Math.pow(2, lbRounds - round);
        for (let i = 0; i < matchesInRound; i++) {
          matches.push({
            tournamentId: id,
            bracket: "LOWER",
            round,
            matchNumber: matchNumber++,
            team1Id: null,
            team2Id: null,
            bestOf: tournament.bestOf,
            status: "PENDING"
          });
        }
      }

      // Grand Final
      matches.push({
        tournamentId: id,
        bracket: "GRAND_FINAL",
        round: 1,
        matchNumber: matchNumber++,
        team1Id: null,
        team2Id: null,
        bestOf: tournament.bestOf,
        status: "PENDING"
      });
    }

    await prisma.match.createMany({ data: matches });
    await prisma.tournament.update({ where: { id }, data: { status: "IN_PROGRESS" } });

    res.json({ message: "Bracket generated", matchesCreated: matches.length });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Error generating bracket" });
  }
};

export const getTournamentMatches = async (req, res) => {
  try {
    const { id } = req.params;
    const matches = await prisma.match.findMany({
      where: { tournamentId: id },
      include: {
        team1: { include: { players: { include: { user: true } } } },
        team2: { include: { players: { include: { user: true } } } },
        winner: true
      },
      orderBy: [{ bracket: "asc" }, { round: "asc" }, { matchNumber: "asc" }]
    });
    res.json(matches);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Error fetching matches" });
  }
};

export const getMatchById = async (req, res) => {
  try {
    const { id } = req.params;
    const match = await prisma.match.findUnique({
      where: { id },
      include: {
        team1: { include: { players: { include: { user: true } } } },
        team2: { include: { players: { include: { user: true } } } },
        winner: true,
        tournament: true
      }
    });
    if (!match) return res.status(404).json({ error: "Match not found" });
    res.json(match);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Error fetching match" });
  }
};

const findMatchingGame = async (team1AccountIds, team2AccountIds) => {
  const limit = 30;
  const samplePlayerId = team1AccountIds[0];
  
  const recentMatches = await openDotaService.getPlayerRecentMatches(samplePlayerId, limit);
  
  for (const match of recentMatches) {
    const matchDetails = await openDotaService.getMatchDetails(match.match_id);
    const players = matchDetails.players || [];
    
    const radiantIds = players.filter(p => p.player_slot < 128).map(p => p.account_id).filter(Boolean);
    const direIds = players.filter(p => p.player_slot >= 128).map(p => p.account_id).filter(Boolean);

    const hasTeam1 = team1AccountIds.every(id => radiantIds.includes(id) || direIds.includes(id));
    const hasTeam2 = team2AccountIds.every(id => radiantIds.includes(id) || direIds.includes(id));
    
    if (!hasTeam1 || !hasTeam2) continue;

    const team1OnRadiant = team1AccountIds.every(id => radiantIds.includes(id));
    const team1Won = team1OnRadiant ? matchDetails.radiant_win : !matchDetails.radiant_win;

    return {
      matchId: match.match_id,
      team1Won,
      radiantWin: matchDetails.radiant_win
    };
  }
  
  return null;
};

export const verifyMatchResult = async (req, res) => {
  try {
    const { id } = req.params;
    const match = await prisma.match.findUnique({
      where: { id },
      include: {
        team1: { include: { players: true } },
        team2: { include: { players: true } }
      }
    });

    if (!match) return res.status(404).json({ error: "Match not found" });
    if (match.status === "COMPLETED") {
      return res.status(400).json({ error: "Match already completed" });
    }

    const team1AccountIds = match.team1.players
      .filter(p => p.userId)
      .map(p => p.userId);
    
    const team2AccountIds = match.team2.players
      .filter(p => p.userId)
      .map(p => p.userId);

    if (team1AccountIds.length === 0 && team2AccountIds.length === 0) {
      return res.status(400).json({ error: "No players with account IDs to verify" });
    }

    const result = await findMatchingGame(team1AccountIds, team2AccountIds);
    
    if (!result) {
      return res.status(404).json({ 
        error: "Could not find matching game. Please register result manually.",
        requiresManualResult: true
      });
    }

    const winnerId = result.team1Won ? match.team1Id : match.team2Id;
    
    await prisma.match.update({
      where: { id },
      data: { winnerId, status: "COMPLETED", matchId: result.matchId.toString() }
    });

    res.json({ 
      message: "Result verified automatically",
      winnerId,
      matchId: result.matchId
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Error verifying match result" });
  }
};

export const registerMatchResult = async (req, res) => {
  try {
    const { id } = req.params;
    const { winnerId, matchId } = req.body;

    const match = await prisma.match.findUnique({
      where: { id },
      include: { tournament: true }
    });

    if (!match) return res.status(404).json({ error: "Match not found" });
    if (match.tournament.creatorId !== req.user.id) {
      return res.status(403).json({ error: "Only tournament creator can register results" });
    }

    const updated = await prisma.match.update({
      where: { id },
      data: { winnerId, matchId, status: "COMPLETED" }
    });

    res.json({ message: "Result registered", match: updated });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Error registering result" });
  }
};