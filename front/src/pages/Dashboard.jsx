import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Trophy, 
  Users, 
  BarChart3, 
  Shield, 
  Bell,
  LayoutDashboard, 
  Settings,
  Flame,
  Plus,
  ArrowUpRight,
  LogOut
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { getActiveTournaments, getTournaments } from '../services/api';

const Dashboard = () => {
  const [activeTab, setActiveTab] = useState('home');
  const [tournaments, setTournaments] = useState([]);
  const [loading, setLoading] = useState(true);
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [activeRes, allRes] = await Promise.all([
          getActiveTournaments(),
          getTournaments()
        ]);
        setTournaments(activeRes.data);
      } catch (error) {
        console.error('Error fetching data:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('es-ES', {
      day: 'numeric',
      month: 'short',
      year: 'numeric'
    });
  };

  return (
    <div className="min-h-screen bg-[#080a0c] text-slate-200 font-sans">
      {/* Navigation Sidebar */}
      <nav className="fixed left-0 top-0 h-full w-20 lg:w-64 bg-[#0d1013] border-r border-white/5 z-50">
        <div className="p-8 flex items-center gap-3">
          <div className="flex flex-col">
            <span className="text-xl font-black tracking-[0.2em] text-white">
              DOTA<span className="text-amber-500">TRACK</span>
            </span>
            <span className="hidden lg:block text-[10px] text-slate-500 font-medium tracking-[0.3em] uppercase">
              Amateur League
            </span>
          </div>
        </div>

        <div className="mt-12 space-y-1 px-4">
          <NavItem icon={<LayoutDashboard size={20} />} label="Inicio" active={activeTab === 'home'} onClick={() => setActiveTab('home')} />
          <NavItem icon={<Trophy size={20} />} label="Torneos" active={activeTab === 'tournaments'} onClick={() => navigate('/tournaments')} />
          <NavItem icon={<Users size={20} />} label="Equipos" active={activeTab === 'teams'} onClick={() => setActiveTab('teams')} />
          <NavItem icon={<BarChart3 size={20} />} label="Estadísticas" active={activeTab === 'stats'} onClick={() => setActiveTab('stats')} />
          
          <div className="mt-10 px-4 py-2">
            <p className="hidden lg:block text-[10px] font-bold text-slate-600 uppercase tracking-widest mb-4">Gestión</p>
            <NavItem icon={<Shield size={20} />} label="Admin" active={activeTab === 'admin'} onClick={() => navigate('/admin/tournaments')} color="text-amber-500/70" />
            <NavItem icon={<Settings size={20} />} label="Ajustes" active={activeTab === 'settings'} onClick={() => setActiveTab('settings')} />
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="pl-20 lg:pl-64 min-h-screen">
        {/* Header */}
        <header className="h-20 bg-[#080a0c]/80 backdrop-blur-xl sticky top-0 z-40 flex items-center justify-between px-10 border-b border-white/5">
          <div className="flex items-center gap-6">
            <h2 className="text-sm font-medium text-slate-400 capitalize">Dashboard / {activeTab}</h2>
          </div>
          
          <div className="flex items-center gap-6">
            <div className="flex items-center gap-2 px-4 py-1.5 bg-white/5 rounded-full border border-white/10">
              <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>
              <span className="text-xs font-medium text-slate-300">Servidores: Online</span>
            </div>
            <button className="relative text-slate-400 hover:text-white transition-colors">
              <Bell size={20} />
              <span className="absolute -top-1 -right-1 w-2 h-2 bg-amber-500 rounded-full"></span>
            </button>
            <div className="h-8 w-[1px] bg-white/10 mx-2"></div>
            <button 
              onClick={handleLogout}
              className="flex items-center gap-2 text-slate-400 hover:text-red-400 transition-colors text-sm"
            >
              <LogOut size={18} />
              <span className="hidden sm:inline">Salir</span>
            </button>
            <div className="flex items-center gap-3 group cursor-pointer" onClick={() => setActiveTab('profile')}>
              <div className="text-right hidden sm:block">
                <p className="text-xs font-bold text-white">{user?.name || 'Usuario'}</p>
                <p className="text-[10px] text-slate-500">{user?.role || 'VIEWER'}</p>
              </div>
              <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-amber-500/20 to-amber-600/20 border border-amber-500/30 flex items-center justify-center font-bold text-amber-500">
                {user?.name?.charAt(0).toUpperCase() || 'U'}
              </div>
            </div>
          </div>
        </header>

        <div className="p-10 max-w-[1400px] mx-auto">
          {activeTab === 'home' && (
            <div className="space-y-12">
              {/* Hero Section */}
              <section className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
                <div className="space-y-6">
                  <div className="inline-flex items-center gap-2 px-3 py-1 rounded-md bg-amber-500/10 border border-amber-500/20 text-amber-500 text-[10px] font-bold uppercase tracking-widest">
                    <Flame size={12} /> Temporada 01 Activa
                  </div>
                  <h1 className="text-5xl lg:text-7xl font-black text-white leading-none tracking-tighter">
                    DOMINA EL <br/> <span className="text-amber-500 underline decoration-amber-500/30 underline-offset-8">FOSO.</span>
                  </h1>
                  <p className="text-slate-400 text-lg max-w-md leading-relaxed">
                    La plataforma de torneos definitiva para la comunidad amateur de Dota 2. Compite, progresa y hazte un nombre.
                  </p>
                  <div className="flex items-center gap-4 pt-4">
                    <button 
                      onClick={() => navigate('/tournaments')}
                      className="bg-amber-500 hover:bg-amber-400 text-black font-black py-4 px-10 rounded-full transition-all flex items-center gap-2 shadow-xl shadow-amber-500/10"
                    >
                      EMPEZAR A COMPETIR <ArrowUpRight size={20} />
                    </button>
                    <button 
                      onClick={() => navigate('/tournaments')}
                      className="bg-white/5 hover:bg-white/10 text-white font-bold py-4 px-10 rounded-full border border-white/10 transition-all"
                    >
                      VER LIGAS
                    </button>
                  </div>
                </div>
                <div className="hidden lg:block relative">
                  <div className="absolute -inset-4 bg-amber-500/10 blur-3xl rounded-full"></div>
                  <div className="relative bg-[#0d1013] border border-white/10 p-8 rounded-[2rem] shadow-2xl">
                    <div className="flex items-center justify-between mb-8">
                      <h3 className="font-bold">Partida Destacada</h3>
                      <span className="text-xs text-slate-500">En Vivo</span>
                    </div>
                    <div className="flex items-center justify-between gap-8 py-4">
                      <div className="text-center space-y-2">
                        <div className="w-16 h-16 bg-blue-500/20 rounded-2xl border border-blue-500/30 flex items-center justify-center text-2xl">⚡</div>
                        <p className="text-xs font-bold text-slate-300">RADIANT</p>
                      </div>
                      <div className="text-4xl font-black italic text-slate-700">VS</div>
                      <div className="text-center space-y-2">
                        <div className="w-16 h-16 bg-red-500/20 rounded-2xl border border-red-500/30 flex items-center justify-center text-2xl">🔥</div>
                        <p className="text-xs font-bold text-slate-300">DIRE</p>
                      </div>
                    </div>
                  </div>
                </div>
              </section>

              {/* Stats Grid */}
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <StatCard label="Torneos" value={tournaments.length} sub="Activos" />
                <StatCard label="Jugadores" value="1.2k" sub="Registrados" />
                <StatCard label="Premios" value="$2.5k" sub="Repartidos" />
                <StatCard label="Equipos" value="84" sub="En liga" />
              </div>

              {/* Tournaments List */}
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-12 pt-8">
                <div className="lg:col-span-2 space-y-8">
                  <div className="flex items-center justify-between border-b border-white/5 pb-4">
                    <h3 className="text-xl font-bold text-white">Próximos Torneos</h3>
                    <button 
                      onClick={() => navigate('/admin/tournaments/new')}
                      className="p-2 bg-white/5 rounded-lg hover:bg-white/10 transition-colors"
                    >
                      <Plus size={20} />
                    </button>
                  </div>
                  <div className="space-y-4">
                    {loading ? (
                      <div className="text-center py-8 text-slate-500">Cargando...</div>
                    ) : tournaments.length === 0 ? (
                      <div className="text-center py-8 text-slate-500">
                        No hay tournaments activos. ¡Crea el tuyo!
                      </div>
                    ) : (
                      tournaments.slice(0, 5).map(t => (
                        <div 
                          key={t.id} 
                          className="group bg-[#0d1013] border border-white/5 p-6 rounded-2xl flex items-center justify-between hover:bg-[#12161b] hover:border-amber-500/20 transition-all cursor-pointer"
                          onClick={() => navigate(`/tournaments/${t.id}`)}
                        >
                          <div className="flex items-center gap-6">
                            <div className="w-2 h-12 bg-amber-500 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"></div>
                            <div>
                              <h4 className="font-bold text-lg text-white group-hover:text-amber-500 transition-colors">{t.name}</h4>
                              <p className="text-xs text-slate-500 mt-1 uppercase tracking-widest">
                                {t.teams?.length || 0}/{t.maxTeams} Equipos • Premio ${t.maxTeams * 100}
                              </p>
                            </div>
                          </div>
                          <span className="text-xs font-bold text-slate-400 bg-white/5 px-4 py-2 rounded-lg group-hover:bg-amber-500 group-hover:text-black transition-all">
                            {t.status === 'REGISTRATION' ? 'INSCRIBIRSE' : 'EN PROGRESO'}
                          </span>
                        </div>
                      ))
                    )}
                  </div>
                </div>

                {/* Top Players */}
                <div className="space-y-8">
                  <div className="flex items-center justify-between border-b border-white/5 pb-4">
                    <h3 className="text-xl font-bold text-white">Top Progresión</h3>
                    <BarChart3 size={20} className="text-slate-600" />
                  </div>
                  <div className="bg-[#0d1013] border border-white/5 rounded-2xl divide-y divide-white/5">
                    <div className="p-5 flex items-center justify-between hover:bg-white/[0.02] transition-colors">
                      <div className="flex items-center gap-4">
                        <span className="text-slate-600 font-bold w-4">01</span>
                        <div>
                          <p className="text-sm font-bold text-white">SkyWalker</p>
                          <p className="text-[10px] text-slate-500 uppercase tracking-tighter">Anti-Mage</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-sm font-black text-amber-500">6400</p>
                        <p className="text-[10px] text-slate-500">58% WR</p>
                      </div>
                    </div>
                    <div className="p-5 flex items-center justify-between hover:bg-white/[0.02] transition-colors">
                      <div className="flex items-center gap-4">
                        <span className="text-slate-600 font-bold w-4">02</span>
                        <div>
                          <p className="text-sm font-bold text-white">PudgeEnjoyer</p>
                          <p className="text-[10px] text-slate-500 uppercase tracking-tighter">Pudge</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-sm font-black text-amber-500">5900</p>
                        <p className="text-[10px] text-slate-500">54% WR</p>
                      </div>
                    </div>
                    <div className="p-5 flex items-center justify-between hover:bg-white/[0.02] transition-colors">
                      <div className="flex items-center gap-4">
                        <span className="text-slate-600 font-bold w-4">03</span>
                        <div>
                          <p className="text-sm font-bold text-white">MiranaFan</p>
                          <p className="text-[10px] text-slate-500 uppercase tracking-tighter">Mirana</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-sm font-black text-amber-500">6100</p>
                        <p className="text-[10px] text-slate-500">61% WR</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

const NavItem = ({ icon, label, active, onClick, color }) => (
  <button 
    onClick={onClick}
    className={`w-full flex items-center gap-4 p-4 rounded-xl transition-all group relative ${
      active 
      ? 'bg-amber-500/5 text-amber-500' 
      : `text-slate-500 hover:text-white hover:bg-white/5 ${color || ''}`
    }`}
  >
    {active && <div className="absolute left-0 w-1 h-6 bg-amber-500 rounded-r-full"></div>}
    <span className={`${active ? 'scale-110' : 'group-hover:scale-110'} transition-transform duration-300`}>
      {icon}
    </span>
    <span className="hidden lg:block font-bold text-xs uppercase tracking-[0.15em]">
      {label}
    </span>
  </button>
);

const StatCard = ({ label, value, sub }) => (
  <div className="bg-[#0d1013] border border-white/5 p-6 rounded-2xl hover:bg-[#12161b] transition-all">
    <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-1">{label}</p>
    <div className="flex items-baseline gap-2">
      <span className="text-2xl font-black text-white">{value}</span>
      <span className="text-[10px] text-slate-600 font-medium">{sub}</span>
    </div>
  </div>
);

export default Dashboard;