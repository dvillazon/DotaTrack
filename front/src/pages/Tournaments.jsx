import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Trophy, Calendar, Users, Search, Filter, Plus } from 'lucide-react';
import { getActiveTournaments, getPastTournaments } from '../services/api';
import { useAuth } from '../context/AuthContext';

const Tournaments = () => {
  const [tournaments, setTournaments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeFilter, setActiveFilter] = useState('active');
  const [searchTerm, setSearchTerm] = useState('');
  const { user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchTournaments = async () => {
      setLoading(true);
      try {
        const endpoint = activeFilter === 'active' ? getActiveTournaments : getPastTournaments;
        const response = await endpoint();
        setTournaments(response.data);
      } catch (error) {
        console.error('Error:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchTournaments();
  }, [activeFilter]);

  const filteredTournaments = tournaments.filter(t =>
    t.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('es-ES', {
      day: 'numeric',
      month: 'short',
      year: 'numeric'
    });
  };

  const getStatusBadge = (status) => {
    const statusMap = {
      'REGISTRATION': { label: 'Inscripciones', color: 'bg-green-500/20 text-green-400 border-green-500/30' },
      'IN_PROGRESS': { label: 'En Progreso', color: 'bg-amber-500/20 text-amber-400 border-amber-500/30' },
      'COMPLETED': { label: 'Finalizado', color: 'bg-slate-500/20 text-slate-400 border-slate-500/30' },
      'CANCELLED': { label: 'Cancelado', color: 'bg-red-500/20 text-red-400 border-red-500/30' },
    };
    return statusMap[status] || { label: status, color: 'bg-slate-500/20 text-slate-400' };
  };

  return (
    <div className="min-h-screen bg-[#080a0c] text-slate-200">
      {/* Header */}
      <header className="bg-[#0d1013] border-b border-white/5 p-6">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-black text-white tracking-tight">TORNEOS</h1>
            <p className="text-slate-500 text-sm mt-1">Explora y únete a tournaments de la comunidad</p>
          </div>
          {user?.role === 'ADMIN' && (
            <button 
              onClick={() => navigate('/admin/tournaments/new')}
              className="flex items-center gap-2 bg-amber-500 hover:bg-amber-400 text-black font-bold py-3 px-6 rounded-full transition-all"
            >
              <Plus size={20} />
              Crear Tournament
            </button>
          )}
        </div>
      </header>

      <main className="max-w-7xl mx-auto p-6">
        {/* Filters */}
        <div className="flex flex-col md:flex-row items-center justify-between gap-4 mb-8">
          <div className="flex items-center gap-2 bg-[#0d1013] border border-white/5 rounded-full p-1">
            <button
              onClick={() => setActiveFilter('active')}
              className={`px-6 py-2 rounded-full text-sm font-bold transition-all ${
                activeFilter === 'active' 
                  ? 'bg-amber-500 text-black' 
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              Activos
            </button>
            <button
              onClick={() => setActiveFilter('past')}
              className={`px-6 py-2 rounded-full text-sm font-bold transition-all ${
                activeFilter === 'past' 
                  ? 'bg-amber-500 text-black' 
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              Pasados
            </button>
          </div>

          <div className="relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" size={20} />
            <input
              type="text"
              placeholder="Buscar tournaments..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="bg-[#0d1013] border border-white/5 rounded-full py-3 pl-12 pr-6 text-sm focus:outline-none focus:border-amber-500/50 w-64"
            />
          </div>
        </div>

        {/* Tournament Grid */}
        {loading ? (
          <div className="text-center py-20">
            <div className="w-12 h-12 border-4 border-amber-500 border-t-transparent rounded-full animate-spin mx-auto"></div>
            <p className="text-slate-500 mt-4">Cargando tournaments...</p>
          </div>
        ) : filteredTournaments.length === 0 ? (
          <div className="text-center py-20">
            <Trophy size={48} className="mx-auto text-slate-700 mb-4" />
            <p className="text-slate-500">No hay tournaments {activeFilter === 'active' ? 'activos' : 'pasados'}</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredTournaments.map(tournament => {
              const statusBadge = getStatusBadge(tournament.status);
              return (
                <div
                  key={tournament.id}
                  onClick={() => navigate(`/tournaments/${tournament.id}`)}
                  className="bg-[#0d1013] border border-white/5 rounded-2xl p-6 hover:border-amber-500/30 hover:bg-[#12161b] transition-all cursor-pointer group"
                >
                  <div className="flex items-start justify-between mb-4">
                    <div className={`px-3 py-1 rounded-full text-xs font-bold border ${statusBadge.color}`}>
                      {statusBadge.label}
                    </div>
                    <span className="text-xs text-slate-500">{tournament.format}</span>
                  </div>

                  <h3 className="text-lg font-bold text-white group-hover:text-amber-500 transition-colors mb-2">
                    {tournament.name}
                  </h3>
                  
                  {tournament.description && (
                    <p className="text-slate-400 text-sm mb-4 line-clamp-2">
                      {tournament.description}
                    </p>
                  )}

                  <div className="flex items-center gap-4 text-xs text-slate-500">
                    <div className="flex items-center gap-1">
                      <Calendar size={14} />
                      {formatDate(tournament.startDate)}
                    </div>
                    <div className="flex items-center gap-1">
                      <Users size={14} />
                      {tournament.teams?.length || 0}/{tournament.maxTeams}
                    </div>
                    <div className="flex items-center gap-1">
                      <Trophy size={14} className="text-amber-500" />
                      Bo{tournament.bestOf}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </main>
    </div>
  );
};

export default Tournaments;