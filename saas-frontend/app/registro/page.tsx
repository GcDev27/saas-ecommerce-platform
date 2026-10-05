'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { Eye, EyeOff } from 'lucide-react';

export default function RegisterPage() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '', // Novo campo
    storeName: '',
  });

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validação de senhas iguais antes de enviar ao backend
    if (formData.password !== formData.confirmPassword) {
      setError('As senhas não coincidem. Verifique e tente novamente.');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const response = await fetch('http://localhost:8081/api/auth/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: formData.name,
          email: formData.email,
          password: formData.password,
          storeName: formData.storeName
        }), // Enviamos sem o confirmPassword, pois o backend não precisa dele
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Ocorreu um erro ao criar sua conta e loja.');
      }

      localStorage.setItem('token', data.token);
      router.push('/admin');
    } catch (err: any) {
      setError(err.message || 'Ocorreu um erro ao registrar.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#e5e5e5] flex items-center justify-center p-4 sm:p-8">
      <div className="w-full max-w-6xl bg-[#0c0c0e] rounded-3xl overflow-hidden flex flex-col md:flex-row shadow-2xl relative">
        
        <div className="absolute top-[-20%] left-[-10%] w-[50%] h-[50%] bg-violet-500/20 blur-[120px] rounded-full pointer-events-none"></div>

        <div className="w-full md:w-1/2 flex flex-col justify-center px-8 py-12 sm:px-16 lg:px-24 z-10 relative">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <h1 className="text-3xl font-semibold text-white tracking-tight mb-2">Crie sua Loja</h1>
            <p className="text-neutral-400 text-sm mb-8">Configure seu espaço e comece a vender em poucos minutos.</p>

            {error && (
              <div className="mb-6 p-3 bg-red-500/10 border border-red-500/20 text-red-400 rounded-xl text-sm">
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-neutral-300 mb-2">Nome da sua Loja</label>
                <input
                  type="text"
                  name="storeName"
                  value={formData.storeName}
                  onChange={handleChange}
                  placeholder="Ex: Sabbat Shop"
                  required
                  className="w-full bg-[#16161a] border border-neutral-800 rounded-xl px-4 py-3.5 text-white text-sm placeholder-neutral-600 focus:outline-none focus:border-violet-400 focus:ring-1 focus:ring-violet-400 transition-all"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-neutral-300 mb-2">Seu Nome</label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="Como devemos te chamar?"
                  required
                  className="w-full bg-[#16161a] border border-neutral-800 rounded-xl px-4 py-3.5 text-white text-sm placeholder-neutral-600 focus:outline-none focus:border-violet-400 focus:ring-1 focus:ring-violet-400 transition-all"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-neutral-300 mb-2">E-mail</label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="Seu melhor e-mail"
                  required
                  className="w-full bg-[#16161a] border border-neutral-800 rounded-xl px-4 py-3.5 text-white text-sm placeholder-neutral-600 focus:outline-none focus:border-violet-400 focus:ring-1 focus:ring-violet-400 transition-all"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-neutral-300 mb-2">Senha</label>
                  <div className="relative">
                    <input
                      type={showPassword ? 'text' : 'password'}
                      name="password"
                      value={formData.password}
                      onChange={handleChange}
                      placeholder="Crie uma senha forte"
                      required
                      minLength={6}
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

                <div>
                  <label className="block text-sm font-medium text-neutral-300 mb-2">Confirmar Senha</label>
                  <div className="relative">
                    <input
                      type={showConfirmPassword ? 'text' : 'password'}
                      name="confirmPassword"
                      value={formData.confirmPassword}
                      onChange={handleChange}
                      placeholder="Repita a senha"
                      required
                      minLength={6}
                      className="w-full bg-[#16161a] border border-neutral-800 rounded-xl px-4 py-3.5 pr-10 text-white text-sm placeholder-neutral-600 focus:outline-none focus:border-violet-400 focus:ring-1 focus:ring-violet-400 transition-all"
                    />
                    <button
                      type="button"
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      className="absolute inset-y-0 right-0 pr-3 flex items-center text-neutral-500 hover:text-neutral-300"
                    >
                      {showConfirmPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                    </button>
                  </div>
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full mt-6 bg-[#c4b5fd] hover:bg-[#b09ff2] text-neutral-900 font-semibold py-3.5 px-4 rounded-xl active:scale-[0.98] transition-all disabled:opacity-70 flex justify-center items-center"
              >
                {loading ? 'A criar a sua loja...' : 'Criar Conta e Loja'}
              </button>
            </form>
            
            <p className="mt-8 text-center text-xs text-neutral-500">
              Já tem uma conta? <Link href="/login" className="text-white underline hover:text-[#c4b5fd] transition-colors">Acesse aqui</Link>
            </p>
          </motion.div>
        </div>

        <div className="hidden md:flex md:w-1/2 relative bg-linear-to-b from-[#111115] to-[#2a1d45]/40 flex-col items-center justify-center p-12 overflow-hidden border-l border-neutral-800/50">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.6 }}
            className="text-center z-10"
          >
            <h2 className="text-3xl font-medium text-white mb-4">Sua loja no ar hoje mesmo.</h2>
            <p className="text-neutral-400 text-sm max-w-sm mx-auto leading-relaxed">
              Junte-se à plataforma definitiva para criadores e lojistas escalarem suas vendas.
            </p>
          </motion.div>
          <div className="absolute bottom-0 left-0 w-full h-[40%] bg-linear-to-t from-violet-600/20 to-transparent pointer-events-none"></div>
        </div>

      </div>
    </div>
  );
}