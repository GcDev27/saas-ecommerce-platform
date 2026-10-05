'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { Eye, EyeOff } from 'lucide-react';

export default function LoginPage() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showPassword, setShowPassword] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const response = await fetch('http://localhost:8081/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (!response.ok) {
        if (data.error) throw new Error(data.error);
        if (data.errors) throw new Error(Object.values(data.errors)[0] as string);
        throw new Error('E-mail ou senha inválidos.');
      }

      // CORREÇÃO: Salvar como 'token' para o resto do sistema conseguir ler
      localStorage.setItem('token', data.token);
      
      // Redirect to admin dashboard
      router.push('/admin');
    } catch (err: any) {
      setError(err.message || 'Ocorreu um erro ao fazer login.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#e5e5e5] flex items-center justify-center p-4 sm:p-8">
      {/* Main Container */}
      <div className="w-full max-w-6xl h-[85vh] min-h-[600px] bg-[#0c0c0e] rounded-3xl overflow-hidden flex flex-col md:flex-row shadow-2xl relative">
        
        {/* Decorative Top Left Glow */}
        <div className="absolute top-[-20%] left-[-10%] w-[50%] h-[50%] bg-violet-500/20 blur-[120px] rounded-full pointer-events-none"></div>

        {/* Left Column - Form */}
        <div className="w-full md:w-1/2 flex flex-col justify-center px-8 sm:px-16 lg:px-24 z-10 relative">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <h1 className="text-3xl font-semibold text-white tracking-tight mb-2">
              Acessar Painel
            </h1>
            <p className="text-neutral-400 text-sm mb-10">
              Gerencie seus produtos e vendas acessando sua conta.
            </p>

            {error && (
              <div className="mb-6 p-3 bg-red-500/10 border border-red-500/20 text-red-400 rounded-xl text-sm">
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-5">
              <div>
                <label className="block text-sm font-medium text-neutral-300 mb-2">
                  E-mail
                </label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="Seu e-mail cadastrado"
                  required
                  className="w-full bg-[#16161a] border border-neutral-800 rounded-xl px-4 py-3.5 text-white text-sm placeholder-neutral-600 focus:outline-none focus:border-violet-400 focus:ring-1 focus:ring-violet-400 transition-all"
                />
              </div>

              <div>
  <label className="block text-sm font-medium text-neutral-300 mb-2">Senha</label>
  <div className="relative">
    <input
      type={showPassword ? 'text' : 'password'}
      name="password"
      value={formData.password}
      onChange={handleChange}
      placeholder="Digite sua senha"
      required
      className="w-full bg-[#16161a] border border-neutral-800 rounded-xl px-4 py-3.5 pr-10 text-white text-sm placeholder-neutral-600 focus:outline-none focus:border-violet-400 focus:ring-1 focus:ring-violet-400 transition-all"
    />
      <button
        type="button"
        onClick={() => setShowPassword(!showPassword)}
        className="absolute inset-y-0 right-0 pr-3 flex items-center text-neutral-500 hover:text-neutral-300"
     >
        {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
      </button>
    </div>
    </div>
              <button
                type="submit"
                disabled={loading}
                className="w-full mt-4 bg-[#c4b5fd] hover:bg-[#b09ff2] text-neutral-900 font-semibold py-3.5 px-4 rounded-xl active:scale-[0.98] transition-all disabled:opacity-70 flex justify-center items-center"
              >
                {loading ? (
                  <svg className="animate-spin h-5 w-5 text-neutral-900" viewBox="0 0 24 24" fill="none">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
                  </svg>
                ) : (
                  'Entrar na conta'
                )}
              </button>
            </form>

            <div className="mt-8">
              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-neutral-800"></div>
                </div>
                <div className="relative flex justify-center text-sm">
                  <span className="px-4 bg-[#0c0c0e] text-neutral-500">Ou acesse com</span>
                </div>
              </div>

              <div className="mt-6 flex flex-col gap-3">
                <button type="button" className="w-full flex items-center justify-center gap-3 bg-transparent border border-neutral-800 hover:bg-neutral-900 text-white font-medium py-3 px-4 rounded-xl transition-all">
                  <svg className="w-5 h-5" viewBox="0 0 24 24">
                    <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                    <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                    <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
                    <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
                  </svg>
                  Continuar com Google
                </button>
              </div>
            </div>
            
            <p className="mt-8 text-center text-xs text-neutral-500">
              Não tem uma conta? <a href="/registro" className="text-white underline hover:text-[#c4b5fd] transition-colors">Criar agora</a>
            </p>
          </motion.div>
        </div>

        {/* Right Column - Presentation */}
        <div className="hidden md:flex md:w-1/2 relative bg-linear-to-b from-[#111115] to-[#2a1d45]/40 flex-col items-center justify-center p-12 overflow-hidden border-l border-neutral-800/50">
          
          {/* Glassmorphism Charts Simulation */}
          <motion.div 
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.2, duration: 0.7 }}
            className="w-full max-w-sm mb-16 relative z-10"
          >
            {/* Chart 1 */}
            <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-6 shadow-2xl mb-[-40px] ml-[-20px] relative z-20">
              <p className="text-neutral-400 text-xs mb-1">Taxa de Conversão</p>
              <h3 className="text-white text-3xl font-medium mb-4">12.4%</h3>
              <svg className="w-full h-16 overflow-visible" viewBox="0 0 200 50">
                <path d="M0,40 Q20,20 40,30 T80,20 T120,35 T160,10 T200,5" fill="none" stroke="#c4b5fd" strokeWidth="3" strokeLinecap="round" />
                <circle cx="160" cy="10" r="4" fill="#c4b5fd" />
              </svg>
            </div>
            
            {/* Chart 2 */}
            <div className="bg-white/5 backdrop-blur-md border border-white/10 rounded-2xl p-6 shadow-2xl ml-[40px] relative z-10">
              <svg className="w-full h-24" viewBox="0 0 300 80">
                {/* Simulated bar chart */}
                <rect x="10" y="50" width="10" height="30" fill="rgba(196, 181, 253, 0.2)" rx="2" />
                <rect x="30" y="40" width="10" height="40" fill="rgba(196, 181, 253, 0.4)" rx="2" />
                <rect x="50" y="60" width="10" height="20" fill="rgba(196, 181, 253, 0.2)" rx="2" />
                <rect x="70" y="30" width="10" height="50" fill="rgba(196, 181, 253, 0.6)" rx="2" />
                <rect x="90" y="45" width="10" height="35" fill="rgba(196, 181, 253, 0.4)" rx="2" />
                <rect x="110" y="20" width="10" height="60" fill="rgba(196, 181, 253, 0.8)" rx="2" />
                
                {/* Overlaid line graph */}
                <path d="M15,45 Q40,35 60,50 T100,25 T120,15" fill="none" stroke="#fff" strokeWidth="1.5" />
              </svg>
            </div>
          </motion.div>

          {/* Text Content */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4, duration: 0.6 }}
            className="text-center z-10"
          >
            <h2 className="text-xl font-medium text-white mb-3">
              Uma Plataforma Completa
            </h2>
            <p className="text-neutral-400 text-sm max-w-xs mx-auto leading-relaxed">
              O ecossistema definitivo para criadores e lojistas escalarem suas vendas de produtos digitais com entrega automática.
            </p>
          </motion.div>
          
          {/* Bottom Glow */}
          <div className="absolute bottom-0 left-0 w-full h-[40%] bg-linear-to-t from-violet-600/20 to-transparent pointer-events-none"></div>
        </div>

      </div>
    </div>
  );
}