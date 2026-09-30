"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useToast } from "../../../components/Toast";

export default function NovoProduto() {
  const router = useRouter();
  const { addToast } = useToast();
  
  // Estados do formulário
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("");
  const [comparePrice, setComparePrice] = useState(""); // Apenas visual por agora
  const [slug, setSlug] = useState("");
  const [hasStock, setHasStock] = useState(false);
  const [stockQuantity, setStockQuantity] = useState("0");
  const [visibility, setVisibility] = useState("VISIBLE");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    // Converte o preço (ex: "250,00" ou "250.00" para número)
    const formattedPrice = parseFloat(price.replace(',', '.')) || 0;

    const productData = {
      name,
      description,
      price: formattedPrice,
      slug,
      hasStock,
      stockQuantity: parseInt(stockQuantity) || 0,
      visibility,
    };

    try {
      // Rota CORRIGIDA apontando para a porta do teu Spring Boot
      const res = await fetch("http://localhost:8080/api/produtos", {
        method: "POST",
        headers: {
          "X-Tenant-Slug": "minha-super-loja",
          "Content-Type": "application/json",
        },
        body: JSON.stringify(productData),
      });

      if (!res.ok) {
        throw new Error("Erro ao salvar produto");
      }

      addToast("Produto criado com sucesso!", "success");
      router.push("/admin/produtos"); // Volta para a tabela
      
    } catch (error) {
      console.error("Erro ao salvar produto:", error);
      addToast("Falha de comunicação com o servidor.", "error");
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
            <span>←</span> Voltar para produtos
          </Link>
          <h1 className="text-2xl font-bold">Criar Produto</h1>
          <p className="text-neutral-400 text-sm mt-1">
            Adicione um novo pacote ou item ao seu catálogo.
          </p>
        </div>
        <button 
          type="submit" 
          disabled={loading}
          className="bg-violet-600 hover:bg-violet-700 disabled:opacity-50 text-white px-6 py-2 rounded-xl font-medium transition-colors"
        >
          {loading ? "A salvar..." : "Salvar produto"}
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Coluna Principal (Esquerda) */}
        <div className="lg:col-span-2 space-y-6">
          
          {/* Informações Básicas (Nome e Descrição) */}
          <div className="bg-[#171717] rounded-xl border border-neutral-800 p-6">
            <input
              type="text"
              placeholder="Nome do produto..."
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full bg-transparent text-2xl font-semibold text-white placeholder-neutral-600 outline-none mb-6"
            />
            
            {/* Editor de Texto Simples (Se tiveres o Tiptap separado, podes substituir esta div) */}
            <div className="border border-neutral-800 rounded-lg overflow-hidden">
              <div className="bg-[#1C1C1C] flex items-center gap-2 p-2 border-b border-neutral-800 text-neutral-400">
                <button type="button" className="p-1 hover:text-white">B</button>
                <button type="button" className="p-1 hover:text-white italic">I</button>
                <button type="button" className="p-1 hover:text-white underline">U</button>
                <button type="button" className="p-1 hover:text-white line-through">S</button>
                <div className="w-px h-4 bg-neutral-700 mx-2"></div>
                <button type="button" className="p-1 hover:text-white">≡</button>
              </div>
              <textarea
                placeholder="Descreva o seu produto aqui..."
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="w-full h-48 bg-[#171717] text-neutral-300 p-4 outline-none resize-none"
              ></textarea>
            </div>
          </div>

          {/* Precificação */}
          <div className="bg-[#171717] rounded-xl border border-neutral-800 p-6">
            <h2 className="text-sm font-semibold text-white mb-4">Precificação</h2>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs text-neutral-400 mb-2">Preço comparativo (opcional)</label>
                <div className="relative">
                  <span className="absolute left-3 top-2.5 text-neutral-500">R$</span>
                  <input
                    type="text"
                    placeholder="0,00"
                    value={comparePrice}
                    onChange={(e) => setComparePrice(e.target.value)}
                    className="w-full bg-[#0a0a0a] border border-neutral-800 rounded-lg py-2 pl-9 pr-3 text-white outline-none focus:border-violet-500 transition-colors"
                  />
                </div>
              </div>
              <div>
                <label className="block text-xs text-neutral-400 mb-2">Preço de venda *</label>
                <div className="relative">
                  <span className="absolute left-3 top-2.5 text-neutral-500">R$</span>
                  <input
                    type="text"
                    required
                    placeholder="0,00"
                    value={price}
                    onChange={(e) => setPrice(e.target.value)}
                    className="w-full bg-[#0a0a0a] border border-neutral-800 rounded-lg py-2 pl-9 pr-3 text-white outline-none focus:border-violet-500 transition-colors"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Coluna Lateral (Direita) */}
        <div className="space-y-6">
          
          {/* Imagem */}
          <div className="bg-[#171717] rounded-xl border border-neutral-800 p-8 flex flex-col items-center justify-center text-center">
            <div className="w-12 h-12 bg-neutral-800 rounded-full flex items-center justify-center mb-4">
              ☁️
            </div>
            <span className="text-sm font-medium text-white mb-1">Adicionar imagem</span>
            <span className="text-xs text-neutral-500">Desativado temporariamente por segurança.</span>
          </div>

          {/* URL Slug */}
          <div className="bg-[#171717] rounded-xl border border-neutral-800 p-6">
            <h2 className="text-sm font-semibold text-white mb-1">Slug da URL</h2>
            <p className="text-xs text-neutral-500 mb-4">O identificador único do produto no link.</p>
            <input
              type="text"
              required
              placeholder="ex: teclado-mecanico-gamer"
              value={slug}
              onChange={(e) => setSlug(e.target.value.toLowerCase().replace(/\s+/g, '-'))}
              className="w-full bg-[#0a0a0a] border border-neutral-800 rounded-lg py-2 px-3 text-sm text-white outline-none focus:border-violet-500 transition-colors"
            />
          </div>

          {/* Visibilidade */}
          <div className="bg-[#171717] rounded-xl border border-neutral-800 p-6">
            <h2 className="text-sm font-semibold text-white mb-4">Visibilidade</h2>
            <select
              value={visibility}
              onChange={(e) => setVisibility(e.target.value)}
              className="w-full bg-[#0a0a0a] border border-neutral-800 rounded-lg py-2 px-3 text-sm text-white outline-none focus:border-violet-500 transition-colors appearance-none"
            >
              <option value="VISIBLE">Visível na loja</option>
              <option value="HIDDEN">Oculto</option>
            </select>
          </div>

          {/* Controle de Estoque */}
          <div className="bg-[#171717] rounded-xl border border-neutral-800 p-6">
            <div className="flex justify-between items-center mb-4">
              <div>
                <h2 className="text-sm font-semibold text-white mb-1">Controle de Estoque</h2>
                <p className="text-xs text-neutral-500">Limitar vendas pela quantidade.</p>
              </div>
              <button
                type="button"
                onClick={() => setHasStock(!hasStock)}
                className={`w-10 h-6 rounded-full transition-colors relative ${hasStock ? 'bg-violet-600' : 'bg-neutral-700'}`}
              >
                <div className={`w-4 h-4 bg-white rounded-full absolute top-1 transition-all ${hasStock ? 'left-5' : 'left-1'}`}></div>
              </button>
            </div>
            
            {hasStock && (
              <div className="mt-4 pt-4 border-t border-neutral-800">
                <label className="block text-xs text-neutral-400 mb-2">Quantidade em estoque</label>
                <input
                  type="number"
                  min="0"
                  value={stockQuantity}
                  onChange={(e) => setStockQuantity(e.target.value)}
                  className="w-full bg-[#0a0a0a] border border-neutral-800 rounded-lg py-2 px-3 text-sm text-white outline-none focus:border-violet-500 transition-colors"
                />
              </div>
            )}
          </div>

        </div>
      </div>
    </form>
  );
}