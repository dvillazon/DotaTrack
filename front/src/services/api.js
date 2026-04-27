import axios from 'axios';

const API_URL = 'http://localhost:3000';

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// Auth
export const loginGoogle = () => {
  window.location.href = `${API_URL}/auth/google`;
};

export const getMe = () => api.get('/auth/me');

export const logout = () => {
  localStorage.removeItem('token');
  localStorage.removeItem('user');
  window.location.href = '/';
};

// Tournaments
export const getTournaments = () => api.get('/tournaments');
export const getActiveTournaments = () => api.get('/tournaments/active');
export const getPastTournaments = () => api.get('/tournaments/past');
export const getTournament = (id) => api.get(`/tournaments/${id}`);
export const createTournament = (data) => api.post('/tournaments', data);
export const updateTournament = (id, data) => api.put(`/tournaments/${id}`, data);
export const deleteTournament = (id) => api.delete(`/tournaments/${id}`);
export const generateBracket = (id) => api.post(`/matches/tournaments/${id}/generate-bracket`);

// Teams
export const getMyTeam = () => api.get('/teams/my-team');
export const getTeam = (id) => api.get(`/teams/${id}`);
export const getTeamsByTournament = (tournamentId) => api.get(`/teams/${tournamentId}/teams`);
export const createTeam = (tournamentId, data) => api.post(`/teams/${tournamentId}/teams`, data);
export const claimTeam = (id) => api.post(`/teams/${id}/claim`);
export const addPlayer = (teamId, data) => api.post(`/teams/${teamId}/players`, data);
export const updatePlayer = (teamId, playerId, data) => api.put(`/teams/${teamId}/players/${playerId}`, data);
export const removePlayer = (teamId, playerId) => api.delete(`/teams/${teamId}/players/${playerId}`);
export const updateTeamCaptain = (tournamentId, teamId, data) => 
  api.put(`/tournaments/${tournamentId}/teams/${teamId}/captain`, data);

// Matches
export const getMatches = (tournamentId) => api.get(`/matches/tournaments/${tournamentId}/matches`);
export const getMatch = (id) => api.get(`/matches/${id}`);
export const verifyMatch = (id) => api.post(`/matches/${id}/verify`);
export const registerResult = (id, data) => api.post(`/matches/${id}/result`, data);

// Players (OpenDota)
export const getPlayer = (accountId) => api.get(`/players/${accountId}`);
export const searchPlayers = (query) => api.get(`/players/search?q=${encodeURIComponent(query)}`);
export const getHeroes = () => api.get('/players/heroes');

export default api;