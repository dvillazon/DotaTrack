import { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { getMe } from '../services/api';

const LoginCallback = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { login } = useAuth();
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const handleCallback = async () => {
      const token = searchParams.get('token');
      
      if (!token) {
        setError('No token received');
        setLoading(false);
        return;
      }

      try {
        // Save token immediately
        localStorage.setItem('token', token);
        
        // Fetch user data
        const response = await getMe();
        const user = response.data;
        
        login(token, user);
        navigate('/dashboard');
      } catch (err) {
        console.error('Login error:', err);
        setError('Error al iniciar sesión');
        setLoading(false);
      }
    };

    handleCallback();
  }, [searchParams, login, navigate]);

  if (loading) {
    return (
      <div className="min-h-screen bg-[#080a0c] flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-amber-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-slate-400">Iniciando sesión...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-[#080a0c] flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-500 mb-4">{error}</p>
          <button 
            onClick={() => navigate('/')}
            className="text-amber-500 hover:underline"
          >
            Volver al inicio
          </button>
        </div>
      </div>
    );
  }

  return null;
};

export default LoginCallback;