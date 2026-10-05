'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { authFetch } from '../../../lib/auth';

export default function NovoProduto() {
  const router = useRouter();
  
  // Estados do formulário
  const [name, setName] = useState('');
  const [slug, setSlug] = useState('');
  const [description, setDescription] = useState('');
  const [visibility, setVisibility] = useState('VISIBLE');
  
  // Estados de feedback
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  // Função para gerar o slug automaticamente
  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newName = e.target.value;
    setName(newName);
    setSlug(
      newName
        .toLowerCase()
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '')
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/(^-|-$)+/g, '')
    );
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    const payload = {
      name,
      slug,
      description,
      visibility,
    };

    try {
      const response = await authFetch('/api/admin/produtos', {
        method: 'POST',
        body: JSON.stringify(payload),
      });

      if (response.status === 403 || response.status === 401) {
        throw new Error('Sessão expirada ou sem permissão. Faça login novamente.');
      }

      if (!response.ok) {
        throw new Error('Ocorreu um erro ao salvar o pacote.');
      }

      const data = await response.json();
      
      // Sucesso! Vai para a tela de Edição (onde configurará a variação padrão se for simples)
      router.push(`/admin/produtos/${data.id}/editar`);
      
    } catch (err: any) {
      setError(err.message || 'Erro de conexão. Verifique se o backend está rodando.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#0f0f11] text-gray-200 p-8 font-sans">
      <form onSubmit={handleSubmit} className="max-w-5xl mx-auto space-y-6">
        
        <div className="flex justify-between items-start">
          <div>
            <Link href="/admin/produtos" className="text-sm text-gray-400 hover:text-white mb-4 inline-block">
              &larr; Voltar para pacotes
            </Link>
            <div className="flex items-center gap-3">
              <div className="bg-purple-600/20 p-2 rounded-lg">
                <svg className="w-6 h-6 text-purple-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                </svg>
              </div>
              <h1 className="text-3xl font-bold text-white">Criar Novo Pacote</h1>
            </div>
            <p className="text-gray-400 mt-2 text-sm">
              Crie um grupo base. Os preços, chaves e opções de entrega serão configurados nas Variações deste pacote.
            </p>
          </div>
          
          <button
            type="submit"
            disabled={isLoading}
            className="bg-purple-600 hover:bg-purple-700 text-white font-medium py-2 px-6 rounded-md transition-colors disabled:opacity-50"
          >
            {isLoading ? 'Processando...' : 'Criar Pacote e Continuar'}
          </button>
        </div>

        {error && (
          <div className="bg-red-900/30 border border-red-800/50 text-red-400 p-4 rounded-md">
            {error}
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-6">
            <div className="bg-[#18181b] border border-gray-800 rounded-xl p-6">
              <h2 className="text-sm font-semibold text-gray-300 tracking-wider mb-6">INFORMAÇÕES GERAIS</h2>
              
              <div className="space-y-4">
                <div>
                  <label htmlFor="name" className="block text-sm text-gray-400 mb-2">Nome do Pacote *</label>
                  <input
                    id="name"
                    type="text"
                    required
                    value={name}
                    onChange={handleNameChange}
                    className="w-full bg-[#0f0f11] border border-gray-800 rounded-md p-3 text-white focus:outline-none focus:border-purple-500 transition-colors"
                  />
                </div>

                <div>
                  <label htmlFor="description" className="block text-sm text-gray-400 mb-2">Descrição (Opcional)</label>
                  <textarea
                    id="description"
                    rows={4}
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    className="w-full bg-[#0f0f11] border border-gray-800 rounded-md p-3 text-white focus:outline-none focus:border-purple-500 transition-colors"
                  />
                </div>
              </div>
            </div>
          </div>

          <div className="space-y-6">
            <div className="bg-[#18181b] border border-gray-800 rounded-xl p-6">
              <h2 className="text-sm font-semibold text-white mb-1">Slug da URL</h2>
              <p className="text-xs text-gray-500 mb-4">Como aparecerá no link.</p>
              <input
                type="text"
                required
                value={slug}
                onChange={(e) => setSlug(e.target.value)}
                className="w-full bg-[#0f0f11] border border-gray-800 rounded-md p-3 text-white focus:outline-none focus:border-purple-500 transition-colors"
              />
            </div>

            <div className="bg-[#18181b] border border-gray-800 rounded-xl p-6">
              <h2 className="text-sm font-semibold text-white mb-4">Visibilidade Inicial</h2>
              <select
                value={visibility}
                onChange={(e) => setVisibility(e.target.value)}
                className="w-full bg-[#0f0f11] border border-gray-800 rounded-md p-3 text-white focus:outline-none focus:border-purple-500 transition-colors appearance-none"
              >
                <option value="VISIBLE">Visível na vitrine</option>
                <option value="HIDDEN">Oculto</option>
              </select>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
}