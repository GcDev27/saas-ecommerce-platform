"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import ProdutoAcoes from "./ProdutoAcoes";

export default function ProdutosPage() {
  const [produtos, setProdutos] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const token = localStorage.getItem("saas_token");
    
    // Rota NOVA e corrigida apontando para o Spring Boot
    fetch("http://localhost:8081/api/admin/produtos", {
      method: "GET",
      headers: {
        "Authorization": `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    })
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

      {loading && <p className="text-neutral-400">A carregar produtos da base de dados...</p>}
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
                    <span className="font-semibold text-white">{produto.name}</span>
                    <div className="flex gap-2 mt-1.5">
                      {produto.hasStock ? (
                        <span className="text-[10px] uppercase font-bold px-2 py-0.5 rounded bg-emerald-900/30 text-emerald-400 border border-emerald-800/50">
                          {produto.stockQuantity} EM ESTOQUE
                        </span>
                      ) : (
                        <span className="text-[10px] uppercase font-bold px-2 py-0.5 rounded bg-red-900/30 text-red-400 border border-red-800/50">
                          SEM CONTROLO DE STOCK
                        </span>
                      )}
                      <span className="text-[10px] uppercase font-bold px-2 py-0.5 rounded bg-neutral-800 text-neutral-400 border border-neutral-700">
                        {produto.visibility === 'VISIBLE' ? 'VISÍVEL NA LOJA' : 'OCULTO'}
                      </span>
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-6">
                  <div className="text-right">
                    <span className="text-xs text-neutral-500 block mb-0.5">Preço</span>
                    <span className="font-semibold text-white">
                      R$ {produto.price ? produto.price.toFixed(2).replace('.', ',') : '0,00'}
                    </span>
                  </div>
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
