import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowUpRight } from 'lucide-react';
import { loginGoogle } from '../services/api';
import { useAuth } from '../context/AuthContext';

const Landing = () => {
  const navigate = useNavigate();
  const { user, loading } = useAuth();

  useEffect(() => {
    if (!loading && user) {
      navigate('/dashboard');
    }
  }, [user, loading, navigate]);

  const handleStart = () => {
    loginGoogle();
  };

  return (
    <div className="min-h-screen bg-[#080a0c] relative overflow-hidden">
      {/* Dota 2 Background Effect */}
      <div className="absolute inset-0 bg-gradient-to-br from-[#0a0c10] via-[#0d1013] to-[#080a0c]"></div>
      <div className="absolute inset-0 opacity-20">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-amber-500/20 rounded-full blur-[100px]"></div>
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-red-500/10 rounded-full blur-[100px]"></div>
      </div>
      
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-5" style={{
        backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23f59e0b' fill-opacity='0.4'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
      }}></div>

      {/* Logo */}
      <div className="absolute top-6 left-8 z-20">
        <div className="flex items-center gap-2">
          <span className="text-xl font-black tracking-[0.2em] text-white">
            DOTA<span className="text-amber-500">TRACK</span>
          </span>
        </div>
      </div>

      {/* Main Content */}
      <div className="relative z-10 flex flex-col items-center justify-center min-h-screen px-4">
        <div className="text-center space-y-8 max-w-3xl  ">
          {/* Subtitle */}
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-amber-500/10 border border-amber-500/20">
            <span className="w-2 h-2 bg-amber-500 rounded-full animate-pulse"></span>
            <span className="text-xs font-bold text-amber-500 uppercase tracking-widest">
              Amateur League
            </span>
          </div>

          {/* Main Title */}
          <h1 className="text-6xl md:text-8xl font-black text-white tracking-tighter leading-none">
            DOMINA EL <br />
            <span className="text-amber-500 underline decoration-amber-500/30 underline-offset-8">
              FOSO.
            </span>
          </h1>

          {/* Description */}
          <p className="text-lg md:text-xl text-slate-400 max-w-xl mx-auto leading-relaxed">
            La plataforma de torneos definitiva para la comunidad amateur de Dota 2. 
            Compite, progresa y hazte un nombre.
          </p>

          {/* CTA Button */}
          <div className="pt-8 items-center justify-center flex  ">
            <button
              onClick={handleStart}
              className="group bg-amber-500 hover:bg-amber-400 text-black font-black py-5 px-12 rounded-full transition-all
               flex items-center gap-3 shadow-xl shadow-amber-500/10 hover:shadow-amber-500/20 hover:scale-105 hover:cursor-pointer"
            >
              EMPEZAR A COMPETIR
            
            </button>
          </div>

          {/* Stats */}
          <div className="flex items-center justify-center gap-12 pt-12 text-sm text-slate-500">
            <div>
              <span className="block text-2xl font-black text-white">12</span>
              <span className="uppercase tracking-wider text-xs">Torneos</span>
            </div>
            <div className="w-px h-8 bg-white/10"></div>
            <div>
              <span className="block text-2xl font-black text-white">1.2k</span>
              <span className="uppercase tracking-wider text-xs">Jugadores</span>
            </div>
            <div className="w-px h-8 bg-white/10"></div>
            <div>
              <span className="block text-2xl font-black text-white">$2.5k</span>
              <span className="uppercase tracking-wider text-xs">Premios</span>
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="absolute bottom-6 left-0 right-0 text-center">
        <p className="text-xs text-slate-600">
          © 2026 DotaTrack. No Affiliated with Valve Corporation.
        </p>
      </div>
    </div>
  );
};

export default Landing;