'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { motion, useMotionValue, useSpring, useTransform } from 'framer-motion';
import { Eye, EyeOff } from 'lucide-react';

export default function RegisterTenantPage() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    storeName: '',
    storeSlug: '',
    adminName: '',
    adminEmail: '',
    adminPassword: '',
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showPassword, setShowPassword] = useState(false);

  // Tilt Card logic
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  
  const mouseXSpring = useSpring(x, { stiffness: 300, damping: 40 });
  const mouseYSpring = useSpring(y, { stiffness: 300, damping: 40 });

  const rotateX = useTransform(mouseYSpring, [-0.5, 0.5], ["15deg", "-15deg"]);
  const rotateY = useTransform(mouseXSpring, [-0.5, 0.5], ["-15deg", "15deg"]);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const width = rect.width;
    const height = rect.height;
    const mouseX = e.clientX - rect.left;
    const mouseY = e.clientY - rect.top;
    
    const xPct = mouseX / width - 0.5;
    const yPct = mouseY / height - 0.5;
    
    x.set(xPct);
    y.set(yPct);
  };

  const handleMouseLeave = () => {
    x.set(0);
    y.set(0);
  };

  const handleStoreNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    const generatedSlug = value
      .toLowerCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .replace(/[^a-z0-9\s-]/g, '')
      .trim()
      .replace(/\s+/g, '-');

    setFormData((prev) => ({
      ...prev,
      storeName: value,
      storeSlug: generatedSlug,
    }));
  };

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
      const response = await fetch('http://localhost:8081/api/auth/register-tenant', {
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
        throw new Error('Falha ao criar loja.');
      }

      localStorage.setItem('saas_token', data.token);
      localStorage.setItem('tenant_slug', data.storeSlug);
      localStorage.setItem('tenant_id', data.tenantId);

      router.push('/admin');
    } catch (err: any) {
      setError(err.message || 'Ocorreu um erro ao criar conta.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#e5e5e5] flex items-center justify-center p-4 sm:p-8">
      {/* Main Container */}
      <div className="w-full max-w-6xl h-auto min-h-[85vh] bg-[#0c0c0e] rounded-3xl overflow-hidden flex flex-col md:flex-row shadow-2xl relative my-8">
        
        {/* Decorative Glow */}
        <div className="absolute top-[-20%] left-[-10%] w-[50%] h-[50%] bg-violet-500/20 blur-[120px] rounded-full pointer-events-none"></div>

        {/* Left Column - Form */}
        <div className="w-full md:w-1/2 flex flex-col justify-center px-8 py-12 sm:px-16 lg:px-20 z-10 relative overflow-y-auto custom-scrollbar">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <h1 className="text-3xl font-semibold text-white tracking-tight mb-2">
              Criar Loja SaaS
            </h1>
            <p className="text-neutral-400 text-sm mb-8">
              Comece sua experiência criando sua loja de produtos digitais.
            </p>

            {error && (
              <div className="mb-6 p-3 bg-red-500/10 border border-red-500/20 text-red-400 rounded-xl text-sm">
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-neutral-300 mb-2">Nome da Loja</label>
                  <input
                    type="text"
                    name="storeName"
                    value={formData.storeName}
                    onChange={handleStoreNameChange}
                    placeholder="Sua loja"
                    required
                    className="w-full bg-[#16161a] border border-neutral-800 rounded-xl px-4 py-3 text-white text-sm placeholder-neutral-600 focus:outline-none focus:border-violet-400 focus:ring-1 focus:ring-violet-400 transition-all"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-neutral-300 mb-2">Slug / URL</label>
                  <input
                    type="text"
                    name="storeSlug"
                    value={formData.storeSlug}
                    onChange={handleChange}
                    placeholder="sua-loja"
                    required
                    className="w-full bg-[#16161a] border border-neutral-800 rounded-xl px-4 py-3 text-white text-sm placeholder-neutral-600 focus:outline-none focus:border-violet-400 focus:ring-1 focus:ring-violet-400 transition-all"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-neutral-300 mb-2">Seu Nome</label>
                <input
                  type="text"
                  name="adminName"
                  value={formData.adminName}
                  onChange={handleChange}
                  placeholder="Lojista"
                  required
                  className="w-full bg-[#16161a] border border-neutral-800 rounded-xl px-4 py-3 text-white text-sm placeholder-neutral-600 focus:outline-none focus:border-violet-400 focus:ring-1 focus:ring-violet-400 transition-all"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-neutral-300 mb-2">E-mail</label>
                <input
                  type="email"
                  name="adminEmail"
                  value={formData.adminEmail}
                  onChange={handleChange}
                  placeholder="contato@loja.com"
                  required
                  className="w-full bg-[#16161a] border border-neutral-800 rounded-xl px-4 py-3 text-white text-sm placeholder-neutral-600 focus:outline-none focus:border-violet-400 focus:ring-1 focus:ring-violet-400 transition-all"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-neutral-300 mb-2">Senha</label>
                <div className="relative">
                  <input
                    type={showPassword ? "text" : "password"}
                    name="adminPassword"
                    value={formData.adminPassword}
                    onChange={handleChange}
                    placeholder="Mínimo de 6 caracteres"
                    required
                    minLength={6}
                    className="w-full bg-[#16161a] border border-neutral-800 rounded-xl px-4 py-3 text-white text-sm placeholder-neutral-600 focus:outline-none focus:border-violet-400 focus:ring-1 focus:ring-violet-400 transition-all pr-12"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-neutral-500 hover:text-white transition-colors"
                  >
                    {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                  </button>
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full mt-6 bg-[#c4b5fd] hover:bg-[#b09ff2] text-neutral-900 font-semibold py-3.5 px-4 rounded-xl active:scale-[0.98] transition-all disabled:opacity-70 flex justify-center items-center"
              >
                {loading ? (
                  <svg className="animate-spin h-5 w-5 text-neutral-900" viewBox="0 0 24 24" fill="none">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
                  </svg>
                ) : (
                  'Criar Conta'
                )}
              </button>
            </form>
            
            <p className="mt-8 text-center text-xs text-neutral-500">
              Já possui uma loja? <a href="/login" className="text-white underline hover:text-[#c4b5fd] transition-colors">Entrar</a>
            </p>
          </motion.div>
        </div>

        {/* Right Column - Tilt Card Presentation */}
        <div className="hidden md:flex md:w-1/2 relative bg-linear-to-b from-[#111115] to-[#2a1d45]/40 flex-col items-center justify-center p-12 overflow-hidden border-l border-neutral-800/50 perspective-1000">
          
          <motion.div
            style={{ rotateX, rotateY, transformStyle: "preserve-3d" }}
            onMouseMove={handleMouseMove}
            onMouseLeave={handleMouseLeave}
            className="w-full max-w-sm rounded-2xl bg-white/5 border border-white/10 p-8 shadow-2xl backdrop-blur-xl relative z-20 cursor-crosshair"
          >
            <div style={{ transform: "translateZ(50px)" }}>
              <div className="w-12 h-12 rounded-full bg-violet-500/20 flex items-center justify-center mb-6">
                <div className="w-6 h-6 rounded-full bg-violet-400"></div>
              </div>
              <h3 className="text-white text-2xl font-semibold tracking-tight mb-2">
                O Futuro das Vendas
              </h3>
              <p className="text-neutral-400 text-sm leading-relaxed mb-6">
                Interaja com os nossos cards 3D. A sua vitrine terá elementos modernos para maximizar a retenção e conversão dos seus clientes no checkout.
              </p>
              
              <div className="w-full h-1 bg-neutral-800/50 rounded-full overflow-hidden">
                <motion.div 
                  className="h-full bg-violet-400"
                  initial={{ width: "0%" }}
                  animate={{ width: "100%" }}
                  transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                />
              </div>
            </div>
          </motion.div>

          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4, duration: 0.6 }}
            className="text-center z-10 mt-12"
          >
            <h2 className="text-xl font-medium text-white mb-3">
              Crie Seu Espaço
            </h2>
            <p className="text-neutral-400 text-sm max-w-xs mx-auto leading-relaxed">
              Passe o mouse no card acima. Tudo pensado nos mínimos detalhes de UI/UX para impressionar seus consumidores finais.
            </p>
          </motion.div>
          
          <div className="absolute bottom-0 left-0 w-full h-[40%] bg-linear-to-t from-violet-600/20 to-transparent pointer-events-none"></div>
        </div>

      </div>
    </div>
  );
}
