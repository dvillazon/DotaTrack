import axios from "axios";

const BASE_URL = "https://api.opendota.com/api";

export const getPlayerByAccountId = async (accountId) => {
  try {
    const response = await axios.get(`${BASE_URL}/players/${accountId}`);
    const data = response.data;

    return {
      accountId: data.account_id,
      steamId: data.profile?.steamid,
      name: data.profile?.personaname,
      avatar: data.profile?.avatarfull,
      country: data.profile?.loccountrycode,
      mmr: data.computed_mmr || null,
      rankTier: data.rank_tier || null,
    };
  } catch (error) {
    console.error("Error fetching player from OpenDota:", error.message);
    throw new Error("Player not found");
  }
};

export const searchPlayers = async (query) => {
  try {
    const response = await axios.get(`${BASE_URL}/search?q=${encodeURIComponent(query)}`);
    return response.data.slice(0, 10).map(player => ({
      accountId: player.account_id,
      name: player.personaname,
      avatar: player.avatar,
      country: player.loccountrycode,
    }));
  } catch (error) {
    console.error("Error searching players:", error.message);
    throw new Error("Search failed");
  }
};

export const getHeroes = async () => {
  try {
    const response = await axios.get(`${BASE_URL}/heroes`);
    return response.data.map(hero => ({
      id: hero.id,
      name: hero.name,
      localizedName: hero.localized_name,
      primaryAttr: hero.primary_attr,
      attackType: hero.attack_type,
      roles: hero.roles,
    }));
  } catch (error) {
    console.error("Error fetching heroes:", error.message);
    throw new Error("Failed to fetch heroes");
  }
};

export const getPlayerRecentMatches = async (accountId, limit = 20) => {
  try {
    const response = await axios.get(`${BASE_URL}/players/${accountId}/recentMatches?limit=${limit}`);
    return response.data;
  } catch (error) {
    console.error("Error fetching recent matches:", error.message);
    throw new Error("Failed to fetch recent matches");
  }
};

export const getMatchDetails = async (matchId) => {
  try {
    const response = await axios.get(`${BASE_URL}/matches/${matchId}`);
    return response.data;
  } catch (error) {
    console.error("Error fetching match details:", error.message);
    throw new Error("Match not found");
  }
};