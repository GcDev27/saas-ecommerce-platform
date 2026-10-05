"use client";

import { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import Link from "next/link";
import { useToast } from "../../../../components/Toast";
import { authFetch, getToken } from "../../../../lib/auth";
import { ChevronLeft, Trash2, Plus, Image as ImageIcon } from "lucide-react";

export default function EditarProduto() {
  const router = useRouter();
  const params = useParams();
  const produtoId = params.id as string;
  const { addToast } = useToast();
  
  const [fetching, setFetching] = useState(true);
  const [loading, setLoading] = useState(false);

  // Product Fields
  const [name, setName] = useState("");
  const [categoryName, setCategoryName] = useState("Geral");
  const [description, setDescription] = useState("");
  const [slug, setSlug] = useState("");
  const [visibility, setVisibility] = useState("VISIBLE");
  const [imageUrl, setImageUrl] = useState("");
  
  // Variation Fields
  const [variations, setVariations] = useState<any[]>([]);
  const [isMultipleVariations, setIsMultipleVariations] = useState(false);
  
  // Single Variation State
  const [defaultVarId, setDefaultVarId] = useState("");
  const [price, setPrice] = useState("0,00");
  const [compareAtPrice, setCompareAtPrice] = useState("");
  const [chatInitialMessage, setChatInitialMessage] = useState("");
  const [hasUnlimitedStock, setHasUnlimitedStock] = useState(false);
  const [stockQuantity, setStockQuantity] = useState("0");
  const [stockLines, setStockLines] = useState<any[]>([]);
  const [newStockText, setNewStockText] = useState("");
  const [showAddStock, setShowAddStock] = useState(false);

  // Active Tab for single variation delivery UI
  const [activeTab, setActiveTab] = useState("linhas"); 

  useEffect(() => {
    if (!produtoId) return;
    if (!getToken()) { router.push('/login'); return; }

    fetchData();
  }, [produtoId, router]);

  const fetchData = async () => {
    try {
      const res = await authFetch(`/api/admin/produtos/${produtoId}`);
      if (!res.ok) throw new Error("Produto não encontrado");
      const data = await res.json();
      
      setName(data.name || "");
      setCategoryName(data.categoryName || "Geral");
      setDescription(data.description || "");
      setSlug(data.slug || "");
      setVisibility(data.visibility || "VISIBLE");
      setImageUrl(data.imageUrl || "");
      
      const vars = data.variations || [];
      setVariations(vars);

      if (vars.length === 1 && vars[0].name === "Padrão") {
        setIsMultipleVariations(false);
        const v = vars[0];
        setDefaultVarId(v.id);
        setPrice(v.price ? v.price.toString().replace('.', ',') : "0,00");
        setCompareAtPrice(v.compareAtPrice ? v.compareAtPrice.toString().replace('.', ',') : "");
        setActiveTab(v.deliveryType === "AUTOMATIC_LINES" ? "linhas" : "chat");
        setChatInitialMessage(v.chatInitialMessage || "");
        setHasUnlimitedStock(v.hasUnlimitedStock || false);
        setStockQuantity(v.stockQuantity ? v.stockQuantity.toString() : "0");
        
        // Fetch stock lines
        fetchStockLines(v.id);
      } else {
        setIsMultipleVariations(true);
      }
      setFetching(false);
    } catch (err) {
      console.error(err);
      addToast("Erro ao carregar os dados.", "error");
      router.push("/admin/produtos");
    }
  };

  const fetchStockLines = async (varId: string) => {
    try {
      const res = await authFetch(`/api/admin/variacoes/${varId}/estoque`);
      if (res.ok) {
        setStockLines(await res.json());
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      // 1. Atualiza o Produto
      const productRes = await authFetch(`/api/admin/produtos/${produtoId}`, {
        method: "PUT",
        body: JSON.stringify({
          name, description, slug, visibility, categoryName, imageUrl
        }),
      });
      if (!productRes.ok) throw new Error("Erro ao atualizar produto");

      // 2. Se for variação simples, atualiza a variação padrão
      if (!isMultipleVariations && defaultVarId) {
        const varRes = await authFetch(`/api/admin/variacoes/${defaultVarId}`, {
          method: "PUT",
          body: JSON.stringify({
            name: "Padrão",
            price: parseFloat(price.replace(',', '.')) || 0,
            compareAtPrice: compareAtPrice ? parseFloat(compareAtPrice.replace(',', '.')) : null,
            deliveryType: activeTab === "chat" ? "MANUAL_CHAT" : "AUTOMATIC_LINES",
            chatInitialMessage: activeTab === "chat" ? chatInitialMessage : null,
            hasUnlimitedStock: hasUnlimitedStock,
            stockQuantity: parseInt(stockQuantity) || 0,
          }),
        });
        if (!varRes.ok) throw new Error("Erro ao atualizar configurações de preço/estoque");
      }

      addToast("Pacote salvo com sucesso!", "success");
    } catch (error) {
      console.error(error);
      addToast("Falha ao salvar as alterações.", "error");
    } finally {
      setLoading(false);
    }
  };

  const handleAddStockLines = async () => {
    if (!defaultVarId || !newStockText.trim()) return;
    const lines = newStockText.split('\n').filter(l => l.trim() !== '');
    if (lines.length === 0) return;

    try {
      const res = await authFetch(`/api/admin/variacoes/${defaultVarId}/estoque`, {
        method: 'POST',
        body: JSON.stringify({ lines }),
      });
      if (res.ok) {
        setNewStockText('');
        setShowAddStock(false);
        fetchStockLines(defaultVarId);
        addToast("Estoque adicionado!", "success");
      }
    } catch (err) {
      console.error(err);
      addToast("Erro ao adicionar estoque.", "error");
    }
  };

  const handleDeleteStockLine = async (stockLineId: string) => {
    try {
      const res = await authFetch(`/api/admin/estoque/${stockLineId}`, { method: 'DELETE' });
      if (res.ok && defaultVarId) fetchStockLines(defaultVarId);
    } catch (err) {
      console.error(err);
    }
  };

  if (fetching) return <div className="min-h-screen bg-[#0a0a0b] flex items-center justify-center text-neutral-400">Carregando...</div>;

  return (
    <form onSubmit={handleSubmit} className="min-h-screen bg-[#0a0a0b] p-6 lg:p-10 font-sans text-neutral-200">
      <div className="max-w-7xl mx-auto space-y-6">
        
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <button type="button" onClick={() => router.push('/admin/produtos')} className="text-neutral-500 hover:text-white transition-colors">
              <ChevronLeft className="w-5 h-5" />
            </button>
            <h1 className="text-xl font-medium text-white">Editar pacote</h1>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Column */}
          <div className="lg:col-span-2 space-y-6">
            
            {/* General Info */}
            <div className="bg-[#131316] border border-neutral-800/60 rounded-xl p-6">
              <div className="grid grid-cols-2 gap-4 mb-6">
                <div>
                  <label className="block text-xs text-neutral-400 mb-1.5 font-medium">Nome</label>
                  <input type="text" value={name} onChange={e => setName(e.target.value)} required className="w-full bg-[#1c1c21] border border-neutral-800 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-violet-500 transition-colors" />
                </div>
                <div>
                  <label className="block text-xs text-neutral-400 mb-1.5 font-medium">Categoria</label>
                  <select value={categoryName} onChange={e => setCategoryName(e.target.value)} className="w-full bg-[#1c1c21] border border-neutral-800 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-violet-500 transition-colors appearance-none">
                    <option value="Geral">Geral</option>
                    <option value="Avakin Life">Avakin Life</option>
                    <option value="Free Fire">Free Fire</option>
                    <option value="Instagram">Instagram</option>
                  </select>
                </div>
              </div>

              <div>
                <div className="bg-[#1c1c21] border border-neutral-800 rounded-lg overflow-hidden">
                  <div className="flex items-center gap-1 border-b border-neutral-800 p-2 bg-[#131316]">
                    <button type="button" className="p-1.5 text-neutral-400 hover:text-white hover:bg-neutral-800 rounded"><span className="font-bold">B</span></button>
                    <button type="button" className="p-1.5 text-neutral-400 hover:text-white hover:bg-neutral-800 rounded"><span className="italic">I</span></button>
                    <button type="button" className="p-1.5 text-neutral-400 hover:text-white hover:bg-neutral-800 rounded"><span className="underline">U</span></button>
                  </div>
                  <textarea value={description} onChange={e => setDescription(e.target.value)} rows={6} className="w-full bg-transparent p-4 text-sm outline-none resize-none placeholder-neutral-600" placeholder="O QUE VOCÊ VAI RECEBER?..." />
                </div>
              </div>
            </div>

            {/* Configurações (Preço, Estoque, Entrega) */}
            {!isMultipleVariations ? (
              <div className="bg-[#131316] border border-neutral-800/60 rounded-xl overflow-hidden">
                <div className="p-6 border-b border-neutral-800/60">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs text-neutral-400 mb-1.5 font-medium">Preço comparativo (opcional)</label>
                      <div className="relative">
                        <span className="absolute left-3 top-2 text-neutral-500 text-sm">R$</span>
                        <input type="text" value={compareAtPrice} onChange={e => setCompareAtPrice(e.target.value)} placeholder="0,00" className="w-full bg-[#1c1c21] border border-neutral-800 rounded-lg py-2 pl-9 pr-3 text-sm text-white outline-none focus:border-violet-500 transition-colors" />
                      </div>
                    </div>
                    <div>
                      <label className="block text-xs text-neutral-400 mb-1.5 font-medium">Preço</label>
                      <div className="relative">
                        <span className="absolute left-3 top-2 text-neutral-500 text-sm">R$</span>
                        <input type="text" value={price} onChange={e => setPrice(e.target.value)} required placeholder="0,00" className="w-full bg-[#1c1c21] border border-neutral-800 rounded-lg py-2 pl-9 pr-3 text-sm text-white outline-none focus:border-violet-500 transition-colors" />
                      </div>
                    </div>
                  </div>
                </div>

                <div className="flex border-b border-neutral-800/60 bg-[#101012]">
                  <button type="button" onClick={() => setActiveTab("linhas")} className={`flex-1 py-3 text-xs font-medium uppercase tracking-wider transition-colors ${activeTab === 'linhas' ? 'text-violet-400 border-b-2 border-violet-500 bg-[#131316]' : 'text-neutral-500 hover:text-neutral-300'}`}>Linhas</button>
                  <button type="button" onClick={() => setActiveTab("chat")} className={`flex-1 py-3 text-xs font-medium uppercase tracking-wider transition-colors ${activeTab === 'chat' ? 'text-violet-400 border-b-2 border-violet-500 bg-[#131316]' : 'text-neutral-500 hover:text-neutral-300'}`}>Chat</button>
                </div>

                <div className="p-6">
                  {activeTab === "linhas" && (
                    <div className="space-y-4">
                      <div className="flex justify-between items-center">
                        <div>
                          <h3 className="text-sm font-medium text-white">Linhas</h3>
                          <p className="text-xs text-neutral-500 mt-0.5">Cada linha é um item do estoque.</p>
                        </div>
                        <button type="button" onClick={() => setShowAddStock(!showAddStock)} className="bg-white text-black text-xs font-semibold px-3 py-1.5 rounded flex items-center gap-1 hover:bg-neutral-200 transition-colors">
                          <Plus className="w-3.5 h-3.5" /> Adicionar estoque
                        </button>
                      </div>

                      {showAddStock && (
                        <div className="bg-[#1c1c21] border border-neutral-800 rounded-lg p-3">
                          <textarea value={newStockText} onChange={e => setNewStockText(e.target.value)} rows={4} className="w-full bg-[#131316] border border-neutral-800 rounded text-xs p-3 outline-none text-neutral-300 font-mono" placeholder="Cole as keys aqui..." />
                          <div className="flex justify-end mt-2"><button type="button" onClick={handleAddStockLines} className="bg-violet-600 text-white text-xs px-3 py-1.5 rounded hover:bg-violet-700">Salvar Linhas</button></div>
                        </div>
                      )}

                      <div className="border border-neutral-800 rounded-lg overflow-hidden bg-[#1c1c21]">
                        <div className="p-2 border-b border-neutral-800 flex items-center gap-2">
                          <input type="text" placeholder="Buscar linha..." className="bg-[#131316] border border-neutral-800 rounded text-xs px-2 py-1 w-64 outline-none text-white" />
                        </div>
                        <div className="max-h-48 overflow-y-auto p-1">
                          {stockLines.length === 0 ? <p className="text-xs text-center p-4 text-neutral-500">Sem estoque cadastrado.</p> : stockLines.map(line => (
                            <div key={line.id} className="flex items-center justify-between px-3 py-1.5 hover:bg-[#232329] rounded group">
                              <span className="text-xs font-mono text-neutral-300 truncate max-w-[80%]">{line.content}</span>
                              <button type="button" onClick={() => handleDeleteStockLine(line.id)} className="text-red-400 opacity-0 group-hover:opacity-100 hover:text-red-300 p-1"><Trash2 className="w-3.5 h-3.5" /></button>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  )}

                  {activeTab === "chat" && (
                    <div className="space-y-4">
                      <div>
                        <h3 className="text-sm font-medium text-white mb-2">Mensagem de Boas-vindas (Chat)</h3>
                        <textarea value={chatInitialMessage} onChange={e => setChatInitialMessage(e.target.value)} rows={4} className="w-full bg-[#1c1c21] border border-neutral-800 rounded-lg p-3 text-sm outline-none text-neutral-300" placeholder="Olá! Envie seu usuário para entregarmos o pedido..." />
                      </div>
                      <div className="flex items-center justify-between bg-[#1c1c21] p-4 rounded-lg border border-neutral-800">
                         <div>
                           <p className="text-sm font-medium text-white">Estoque Ilimitado</p>
                           <p className="text-xs text-neutral-500">Se ativo, nunca ficará sem estoque.</p>
                         </div>
                         <button type="button" onClick={() => setHasUnlimitedStock(!hasUnlimitedStock)} className={`w-10 h-5 rounded-full relative transition-colors ${hasUnlimitedStock ? 'bg-violet-600' : 'bg-neutral-700'}`}>
                           <div className={`w-3.5 h-3.5 bg-white rounded-full absolute top-[3px] transition-all ${hasUnlimitedStock ? 'left-[22px]' : 'left-1'}`} />
                         </button>
                      </div>
                      {!hasUnlimitedStock && (
                        <div>
                          <label className="block text-xs text-neutral-400 mb-1.5 font-medium">Quantidade em Estoque</label>
                          <input type="number" value={stockQuantity} onChange={e => setStockQuantity(e.target.value)} className="w-32 bg-[#1c1c21] border border-neutral-800 rounded-lg py-2 px-3 text-sm text-white outline-none focus:border-violet-500 transition-colors" />
                        </div>
                      )}
                    </div>
                  )}
                </div>
              </div>
            ) : (
              <div className="bg-[#131316] border border-neutral-800/60 rounded-xl p-6">
                <h3 className="text-sm font-medium text-white mb-2">Variações do pacote</h3>
                <p className="text-xs text-neutral-500 mb-4">Este pacote tem múltiplas variações. Você pode adicionar diferentes variações com preços e configurações específicas.</p>
                <Link href={`/admin/produtos/${produtoId}`}>
                  <button type="button" className="text-xs font-medium bg-[#1c1c21] border border-neutral-700 text-white px-4 py-2 rounded-lg hover:bg-neutral-800 transition-colors">Gerenciar variações</button>
                </Link>
              </div>
            )}
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            <div className="bg-[#131316] border border-neutral-800/60 rounded-xl p-6">
              <h2 className="text-sm font-medium text-white mb-4">Imagem (opcional)</h2>
              
              <input 
                type="file" 
                id="imageUpload" 
                accept="image/*" 
                className="hidden" 
                onChange={(e) => {
                  const file = e.target.files?.[0];
                  if (file) {
                    // Limite simples de 2MB
                    if (file.size > 2 * 1024 * 1024) {
                      addToast("A imagem deve ter no máximo 2MB", "error");
                      return;
                    }
                    const reader = new FileReader();
                    reader.onloadend = () => {
                      setImageUrl(reader.result as string);
                    };
                    reader.readAsDataURL(file);
                  }
                }}
              />

              <label 
                htmlFor="imageUpload" 
                className="w-full h-32 bg-[#1c1c21] border border-dashed border-neutral-700 rounded-lg flex flex-col items-center justify-center text-neutral-500 relative overflow-hidden group cursor-pointer hover:border-violet-500 transition-colors"
              >
                {imageUrl ? (
                  <>
                    <img src={imageUrl} alt="Capa" className="w-full h-full object-cover opacity-80 group-hover:opacity-100 transition-opacity" />
                    <div className="absolute inset-0 flex items-center justify-center bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity">
                      <span className="text-xs text-white">Clique para trocar a imagem</span>
                    </div>
                  </>
                ) : (
                  <>
                    <ImageIcon className="w-6 h-6 mb-2 group-hover:text-violet-400 transition-colors" />
                    <span className="text-xs group-hover:text-violet-400 transition-colors">Fazer upload do aparelho</span>
                  </>
                )}
              </label>
              
              {imageUrl && (
                <button 
                  type="button" 
                  onClick={() => setImageUrl("")} 
                  className="mt-3 w-full bg-red-500/10 text-red-500 hover:bg-red-500/20 text-xs py-2 rounded-lg transition-colors"
                >
                  Remover imagem
                </button>
              )}
            </div>

            <div className="bg-[#131316] border border-neutral-800/60 rounded-xl p-6">
              <h2 className="text-sm font-medium text-white mb-1">Slug</h2>
              <p className="text-[10px] text-neutral-500 mb-3">O nome que aparecerá na URL do produto</p>
              <input type="text" value={slug} onChange={e => setSlug(e.target.value.toLowerCase().replace(/\s+/g, '-'))} className="w-full bg-[#1c1c21] border border-neutral-800 rounded-lg py-2 px-3 text-sm text-white outline-none focus:border-violet-500 transition-colors" />
            </div>

            <div className="bg-[#131316] border border-neutral-800/60 rounded-xl p-6">
              <h2 className="text-sm font-medium text-white mb-3">Visibilidade</h2>
              <select value={visibility} onChange={e => setVisibility(e.target.value)} className="w-full bg-[#1c1c21] border border-neutral-800 rounded-lg py-2 px-3 text-sm text-white outline-none focus:border-violet-500 transition-colors appearance-none">
                <option value="VISIBLE">Visível</option>
                <option value="HIDDEN">Oculto</option>
              </select>
            </div>

            {!isMultipleVariations && (
              <div className="bg-[#131316] border border-neutral-800/60 rounded-xl p-6">
                 <p className="text-xs text-neutral-400 mb-4">Quer criar variações de preços para este produto (Ex: Chave de 100k, Chave de 200k)?</p>
                 <Link href={`/admin/produtos/${produtoId}`}>
                  <button type="button" className="w-full text-xs font-medium bg-[#1c1c21] border border-neutral-700 text-white px-4 py-2.5 rounded-lg hover:bg-neutral-800 transition-colors">Converter para Variações</button>
                 </Link>
              </div>
            )}
          </div>
        </div>

        {/* Footer Buttons */}
        <div className="flex items-center justify-between pt-6 border-t border-neutral-800/50 mt-10">
          <button type="button" className="bg-red-500/10 text-red-500 hover:bg-red-500/20 px-4 py-2 rounded-lg text-sm font-medium transition-colors">Deletar pacote</button>
          <button type="submit" disabled={loading} className="bg-white hover:bg-neutral-200 text-black px-6 py-2 rounded-lg text-sm font-medium transition-colors disabled:opacity-50 shadow-sm">{loading ? 'Salvando...' : 'Editar pacote'}</button>
        </div>

      </div>
    </form>
  );
}
