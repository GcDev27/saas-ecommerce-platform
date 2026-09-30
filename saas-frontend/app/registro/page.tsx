'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';

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
  const [success, setSuccess] = useState(false);

  // Auto-gera slug ao digitar nome da loja
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
        if (data.error) {
          throw new Error(data.error);
        } else if (data.errors) {
          const firstError = Object.values(data.errors)[0] as string;
          throw new Error(firstError);
        } else {
          throw new Error('Falha ao cadastrar loja. Tente novamente.');
        }
      }

      // Salva o token e dados da loja no localStorage
      localStorage.setItem('saas_token', data.token);
      localStorage.setItem('tenant_slug', data.storeSlug);
      localStorage.setItem('tenant_id', data.tenantId);

      setSuccess(true);
      setTimeout(() => {
        router.push('/admin');
      }, 1500);
    } catch (err: any) {
      setError(err.message || 'Ocorreu um erro inesperado.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-indigo-950 to-slate-900 flex items-center justify-center p-4">
      <div className="w-full max-w-xl bg-slate-900/90 border border-slate-800 backdrop-blur-xl rounded-2xl shadow-2xl p-8 md:p-10">
        <div className="text-center mb-8">
          <span className="inline-block bg-indigo-500/10 text-indigo-400 text-xs font-semibold px-3 py-1 rounded-full uppercase tracking-wider mb-3">
            Onboarding de Lojista
          </span>
          <h1 className="text-3xl font-extrabold text-white tracking-tight">Crie sua Loja Virtual</h1>
          <p className="text-slate-400 text-sm mt-2">
            Configure seu ambiente SaaS e comece a vender em poucos minutos.
          </p>
        </div>

        {error && (
          <div className="mb-6 p-4 bg-red-500/10 border border-red-500/20 text-red-400 rounded-xl text-sm flex items-center gap-3">
            <span className="text-lg">⚠️</span>
            <span>{error}</span>
          </div>
        )}

        {success && (
          <div className="mb-6 p-4 bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 rounded-xl text-sm flex items-center gap-3">
            <span className="text-lg">🎉</span>
            <span>Loja criada com sucesso! Redirecionando para o painel...</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-5">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1.5">Nome da Loja</label>
              <input
                type="text"
                name="storeName"
                value={formData.storeName}
                onChange={handleStoreNameChange}
                placeholder="Ex: Gamers Club Store"
                required
                className="w-full bg-slate-800/80 border border-slate-700/80 rounded-xl px-4 py-3 text-white text-sm placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1.5">Slug da Loja (Subdomínio)</label>
              <div className="relative">
                <input
                  type="text"
                  name="storeSlug"
                  value={formData.storeSlug}
                  onChange={handleChange}
                  placeholder="gamers-club"
                  required
                  className="w-full bg-slate-800/80 border border-slate-700/80 rounded-xl px-4 py-3 text-white text-sm placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all"
                />
              </div>
              <p className="text-[11px] text-slate-500 mt-1">Sua loja: {formData.storeSlug || 'sua-loja'}.saas.com</p>
            </div>
          </div>

          <hr className="border-slate-800 my-2" />

          <div>
            <label className="block text-xs font-medium text-slate-300 mb-1.5">Nome do Administrador / Lojista</label>
            <input
              type="text"
              name="adminName"
              value={formData.adminName}
              onChange={handleChange}
              placeholder="Seu nome completo"
              required
              className="w-full bg-slate-800/80 border border-slate-700/80 rounded-xl px-4 py-3 text-white text-sm placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1.5">E-mail de Acesso</label>
              <input
                type="email"
                name="adminEmail"
                value={formData.adminEmail}
                onChange={handleChange}
                placeholder="seuemail@exemplo.com"
                required
                className="w-full bg-slate-800/80 border border-slate-700/80 rounded-xl px-4 py-3 text-white text-sm placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1.5">Senha de Acesso</label>
              <input
                type="password"
                name="adminPassword"
                value={formData.adminPassword}
                onChange={handleChange}
                placeholder="••••••••"
                required
                minLength={6}
                className="w-full bg-slate-800/80 border border-slate-700/80 rounded-xl px-4 py-3 text-white text-sm placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading || success}
            className="w-full mt-6 bg-indigo-600 hover:bg-indigo-500 text-white font-semibold py-3.5 px-4 rounded-xl shadow-lg shadow-indigo-600/30 hover:shadow-indigo-500/40 active:scale-[0.99] transition-all disabled:opacity-50 flex items-center justify-center gap-2 text-sm"
          >
            {loading ? (
              <>
                <svg className="animate-spin h-4 w-4 text-white" viewBox="0 0 24 24" fill="none">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
                </svg>
                <span>Criando sua loja...</span>
              </>
            ) : (
              'Criar Minha Loja Agora 🚀'
            )}
          </button>
        </form>
      </div>
    </div>
  );
}
