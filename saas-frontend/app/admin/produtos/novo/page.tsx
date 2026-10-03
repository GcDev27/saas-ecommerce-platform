"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Package } from "lucide-react";

export default function NovoPacote() {
  const router = useRouter();
  
  // Estados do formulário
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [slug, setSlug] = useState("");
  const [visibility, setVisibility] = useState("VISIBLE");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setName(val);
    if (!slug || slug === name.toLowerCase().replace(/\s+/g, '-').slice(0, -1)) {
      setSlug(val.toLowerCase().replace(/[\u0300-\u036f]/g, '').replace(/[^a-z0-9\s-]/g, '').trim().replace(/\s+/g, '-'));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const productData = {
      name,
      description,
      slug,
      visibility,
    };

    try {
      const token = localStorage.getItem("saas_token");
      const res = await fetch("http://localhost:8081/api/admin/produtos", {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(productData),
      });

      if (!res.ok) {
        throw new Error("Erro ao criar pacote");
      }

      const createdProduct = await res.json();
      
      // Redireciona para a página de edição do pacote onde vai gerir as variações (Preços, Chat, Linhas)
      router.push(`/admin/produtos/${createdProduct.id}`);
      
    } catch (err: any) {
      console.error(err);
      setError("Ocorreu um erro ao salvar o pacote.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="p-8 text-white min-h-screen bg-[#0a0a0a]">
      {/* Cabeçalho */}
      <div className="flex justify-between items-center mb-8">
        <div>
          <Link href="/admin/produtos" className="text-neutral-400 text-sm hover:text-white transition-colors flex items-center gap-2 mb-2">
            <span>←</span> Voltar para pacotes
          </Link>
          <h1 className="text-2xl font-bold flex items-center gap-3">
            <Package className="w-6 h-6 text-violet-400" />
            Criar Novo Pacote
          </h1>
          <p className="text-neutral-400 text-sm mt-1">
            Crie um grupo base. Os preços, chaves e opções de entrega serão configurados nas Variações deste pacote.
          </p>
        </div>
        <button 
          type="submit" 
          disabled={loading}
          className="bg-violet-600 hover:bg-violet-700 disabled:opacity-50 text-white px-6 py-2.5 rounded-xl font-medium transition-colors shadow-lg shadow-violet-500/20"
        >
          {loading ? "Criando..." : "Criar Pacote e Continuar"}
        </button>
      </div>

      {error && (
        <div className="mb-6 p-4 bg-red-500/10 border border-red-500/20 text-red-400 rounded-xl text-sm">
          {error}
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Coluna Principal (Esquerda) */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-[#171717] rounded-xl border border-neutral-800 p-8 shadow-sm">
            <h2 className="text-sm font-semibold text-neutral-300 mb-6 uppercase tracking-wider">Informações Gerais</h2>
            
            <div className="space-y-6">
              <div>
                <label className="block text-sm text-neutral-400 mb-2">Nome do Pacote *</label>
                <input
                  type="text"
                  placeholder="Ex: CONTAS FAKES DE CROWNS"
                  required
                  value={name}
                  onChange={handleNameChange}
                  className="w-full bg-[#0a0a0a] border border-neutral-800 rounded-xl px-4 py-3 text-white placeholder-neutral-600 outline-none focus:border-violet-500 transition-colors"
                />
              </div>

              <div>
                <label className="block text-sm text-neutral-400 mb-2">Descrição (Opcional)</label>
                <textarea
                  placeholder="Descreva sobre o que é este pacote de produtos..."
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="w-full h-32 bg-[#0a0a0a] border border-neutral-800 rounded-xl px-4 py-3 text-neutral-300 placeholder-neutral-600 outline-none focus:border-violet-500 transition-colors resize-none"
                ></textarea>
              </div>
            </div>
          </div>
        </div>

        {/* Coluna Lateral (Direita) */}
        <div className="space-y-6">
          
          <div className="bg-[#171717] rounded-xl border border-neutral-800 p-6 shadow-sm">
            <h2 className="text-sm font-semibold text-white mb-1">Slug da URL</h2>
            <p className="text-xs text-neutral-500 mb-4">Como aparecerá no link.</p>
            <input
              type="text"
              required
              placeholder="ex: contas-fakes"
              value={slug}
              onChange={(e) => setSlug(e.target.value.toLowerCase().replace(/\s+/g, '-'))}
              className="w-full bg-[#0a0a0a] border border-neutral-800 rounded-lg py-2 px-3 text-sm text-white outline-none focus:border-violet-500 transition-colors"
            />
          </div>

          <div className="bg-[#171717] rounded-xl border border-neutral-800 p-6 shadow-sm">
            <h2 className="text-sm font-semibold text-white mb-4">Visibilidade Inicial</h2>
            <select
              value={visibility}
              onChange={(e) => setVisibility(e.target.value)}
              className="w-full bg-[#0a0a0a] border border-neutral-800 rounded-lg py-2.5 px-3 text-sm text-white outline-none focus:border-violet-500 transition-colors appearance-none cursor-pointer"
            >
              <option value="VISIBLE">Visível na vitrine</option>
              <option value="HIDDEN">Oculto (Rascunho)</option>
            </select>
          </div>

        </div>
      </div>
    </form>
  );
}
