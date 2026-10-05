"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import ProdutoAcoes from "./ProdutoAcoes";
import { getToken } from "../../lib/auth";
import { authFetch } from "../../lib/auth";

export default function ProdutosPage() {
  const [produtos, setProdutos] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const token = getToken();
    
    if (!token) {
      window.location.href = "/login";
      return;
    }

    authFetch("/api/admin/produtos")
      .then((res) => {
        if (!res.ok) throw new Error("Falha ao buscar produtos");
        return res.json();
      })
      .then((data) => {
        setProdutos(data);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Erro na comunicação com a API:", err);
        setError("Não foi possível carregar os produtos.");
        setLoading(false);
      });
  }, []);

  return (
    <div className="p-8 text-white min-h-screen bg-[#0a0a0a]">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-2xl font-bold">Produtos</h1>
          <p className="text-neutral-400 text-sm mt-1">
            Crie ou altere os produtos que deseja vender na sua loja.
          </p>
        </div>
        <Link href="/admin/produtos/novo">
          <button className="bg-violet-600 hover:bg-violet-700 text-white px-4 py-2 rounded-md font-medium transition-colors">
            + Novo produto
          </button>
        </Link>
      </div>

      {loading && <p className="text-neutral-400">Carregando produtos...</p>}
      {error && <p className="text-red-500">{error}</p>}

      {!loading && !error && (
       <div className="bg-[#171717] rounded-xl border border-neutral-800 overflow-visible">
          {produtos.length === 0 ? (
            <div className="p-8 text-center text-neutral-400">Nenhum produto encontrado.</div>
          ) : (
            produtos.map((produto) => (
              <div 
                key={produto.id} 
                className="flex justify-between items-center p-4 border-b border-neutral-800 last:border-0 hover:bg-[#202020] transition-colors"
              >
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-neutral-800 rounded-lg flex items-center justify-center border border-neutral-700">
                    📦
                  </div>
                  <div className="flex flex-col">
                    <Link href={`/admin/produtos/${produto.id}`} className="font-semibold text-white hover:text-violet-400 transition-colors">
                      {produto.name}
                    </Link>
                    <div className="flex gap-2 mt-1.5">
                      <span className="text-[10px] uppercase font-bold px-2 py-0.5 rounded bg-violet-900/30 text-violet-400 border border-violet-800/50">
                        {produto.variations?.length || 0} variações
                      </span>
                      <span className="text-[10px] uppercase font-bold px-2 py-0.5 rounded bg-neutral-800 text-neutral-400 border border-neutral-700">
                        {produto.visibility === 'VISIBLE' ? 'VISÍVEL NA LOJA' : 'OCULTO'}
                      </span>
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-6">
                 <ProdutoAcoes 
                   produtoId={produto.id} 
                   onDeleteSuccess={(id) => setProdutos(produtos.filter(p => p.id !== id))} 
                  />  
                </div>
              </div>
            ))
          )}
        </div>
      )}
    </div>
  );
}