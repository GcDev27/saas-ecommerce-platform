'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useParams, useRouter } from 'next/navigation';
import { 
  ArrowLeft, Plus, MoreHorizontal, MessageSquare, List as ListIcon, 
  FileBox, Link as LinkIcon, Edit, Copy, Trash, Settings 
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

type DeliveryType = 'LINES' | 'FILE' | 'CHAT' | 'DISCORD';

interface Variation {
  id?: string;
  name: string;
  price: string;
  compareAtPrice: string;
  deliveryType: DeliveryType;
  chatInitialMessage: string;
  hasStock: boolean;
  stockQuantity: string;
  visibility: string;
  slug: string;
  lines: string[];
}

export default function PackageVariationsPage() {
  const params = useParams();
  const router = useRouter();
  
  // States
  const [packageName, setPackageName] = useState("Carregando pacote...");
  const [variations, setVariations] = useState<Variation[]>([]);
  
  const [editingVariation, setEditingVariation] = useState<Variation | null>(null);
  const [activeTab, setActiveTab] = useState<DeliveryType | 'INSTRUCTIONS'>('CHAT');
  
  // Simulated initial fetch (since the backend for variations isn't fully connected yet)
  useEffect(() => {
    // Aqui fariamos fetch(`http://localhost:8081/api/admin/produtos/${params.id}`)
    // Mockando para UI
    setTimeout(() => {
      setPackageName("CONTAS FAKE DE CROWNS");
      setVariations([
        {
          id: '1',
          name: "FAKE 240 CROWNS - NÍVEL 6",
          price: "23.90",
          compareAtPrice: "",
          deliveryType: 'CHAT',
          chatInitialMessage: "Seu pedido foi aprovado! 🚀\nMe envie seu código de amigo + nome no jogo para que comece a ser enviado.",
          hasStock: false,
          stockQuantity: "0",
          visibility: "VISIBLE",
          slug: "fake-240-crowns",
          lines: []
        }
      ]);
    }, 500);
  }, [params.id]);

  const handleCreateNewVariation = () => {
    setEditingVariation({
      name: "Nova Variação",
      price: "",
      compareAtPrice: "",
      deliveryType: 'CHAT',
      chatInitialMessage: "",
      hasStock: false,
      stockQuantity: "0",
      visibility: "VISIBLE",
      slug: "",
      lines: []
    });
    setActiveTab('CHAT');
  };

  // UI for editing a specific variation
  const renderEditVariation = () => {
    if (!editingVariation) return null;

    return (
      <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-300">
        
        {/* Header do Editor */}
        <div className="flex items-center justify-between">
          <button 
            onClick={() => setEditingVariation(null)}
            className="text-neutral-400 hover:text-white flex items-center gap-2 text-sm transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            Variações de {packageName}
          </button>
          
          <div className="flex items-center gap-3">
            <button className="bg-[#1C1C21] border border-neutral-800 text-sm px-4 py-2 rounded-lg text-neutral-300 hover:text-white hover:bg-[#2A2A32] transition-colors">
              Ações em massa 
            </button>
            <button className="bg-violet-600 hover:bg-violet-700 text-white px-6 py-2 rounded-lg text-sm font-medium transition-colors shadow-[0_0_15px_rgba(124,58,237,0.3)]">
              Salvar Variação
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          
          {/* Coluna Principal */}
          <div className="lg:col-span-2 space-y-6">
            
            <div className="bg-[#1C1C21] border border-neutral-800/60 rounded-xl p-6">
              <label className="block text-sm font-medium text-neutral-300 mb-2">Nome da Variação</label>
              <input
                type="text"
                value={editingVariation.name}
                onChange={(e) => setEditingVariation({...editingVariation, name: e.target.value})}
                className="w-full bg-[#131316] border border-neutral-800 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-violet-500 transition-colors"
              />
            </div>

            <div className="bg-[#1C1C21] border border-neutral-800/60 rounded-xl p-6">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm text-neutral-400 mb-2">Preço comparativo (opcional)</label>
                  <div className="relative">
                    <span className="absolute left-4 top-3 text-neutral-500">R$</span>
                    <input
                      type="text"
                      value={editingVariation.compareAtPrice}
                      onChange={(e) => setEditingVariation({...editingVariation, compareAtPrice: e.target.value})}
                      className="w-full bg-[#131316] border border-neutral-800 rounded-lg py-3 pl-10 pr-4 text-white outline-none focus:border-violet-500 transition-colors"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-sm text-neutral-400 mb-2">Preço *</label>
                  <div className="relative">
                    <span className="absolute left-4 top-3 text-neutral-500">R$</span>
                    <input
                      type="text"
                      value={editingVariation.price}
                      onChange={(e) => setEditingVariation({...editingVariation, price: e.target.value})}
                      className="w-full bg-[#131316] border border-neutral-800 rounded-lg py-3 pl-10 pr-4 text-white outline-none focus:border-violet-500 transition-colors"
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* ABAS DE ENTREGA */}
            <div className="bg-[#1C1C21] border border-neutral-800/60 rounded-xl overflow-hidden">
              <div className="flex border-b border-neutral-800/60 bg-[#131316]">
                <button 
                  onClick={() => setActiveTab('INSTRUCTIONS')}
                  className={`flex-1 py-3 text-sm font-medium text-center transition-colors border-b-2 ${activeTab === 'INSTRUCTIONS' ? 'border-violet-500 text-white' : 'border-transparent text-neutral-500 hover:text-neutral-300'}`}
                >
                  Instruções
                </button>
                <button 
                  onClick={() => { setActiveTab('LINES'); setEditingVariation({...editingVariation, deliveryType: 'LINES'})}}
                  className={`flex-1 py-3 text-sm font-medium text-center transition-colors border-b-2 flex items-center justify-center gap-2 ${activeTab === 'LINES' ? 'border-violet-500 text-white bg-[#1C1C21]' : 'border-transparent text-neutral-500 hover:text-neutral-300'}`}
                >
                  <ListIcon className="w-4 h-4" />
                  Linhas
                  {editingVariation.lines.length > 0 && <span className="bg-violet-600 text-[10px] px-1.5 py-0.5 rounded text-white ml-1">{editingVariation.lines.length}</span>}
                </button>
                <button 
                  onClick={() => { setActiveTab('FILE'); setEditingVariation({...editingVariation, deliveryType: 'FILE'})}}
                  className={`flex-1 py-3 text-sm font-medium text-center transition-colors border-b-2 flex items-center justify-center gap-2 ${activeTab === 'FILE' ? 'border-violet-500 text-white bg-[#1C1C21]' : 'border-transparent text-neutral-500 hover:text-neutral-300'}`}
                >
                  <FileBox className="w-4 h-4" />
                  Arquivo
                </button>
                <button 
                  onClick={() => { setActiveTab('CHAT'); setEditingVariation({...editingVariation, deliveryType: 'CHAT'})}}
                  className={`flex-1 py-3 text-sm font-medium text-center transition-colors border-b-2 flex items-center justify-center gap-2 ${activeTab === 'CHAT' ? 'border-violet-500 text-white bg-[#1C1C21]' : 'border-transparent text-neutral-500 hover:text-neutral-300'}`}
                >
                  <MessageSquare className="w-4 h-4" />
                  Chat
                  {editingVariation.deliveryType === 'CHAT' && <span className="text-emerald-400 ml-1">✓</span>}
                </button>
              </div>

              <div className="p-6">
                
                {/* CONTEÚDO: CHAT */}
                {activeTab === 'CHAT' && (
                  <div className="animate-in fade-in">
                    <div className="flex items-start gap-4 mb-6">
                      <MessageSquare className="w-5 h-5 text-violet-400 mt-0.5" />
                      <div className="flex-1">
                        <h3 className="text-sm font-medium text-white">Entrega via Chat</h3>
                        <p className="text-xs text-neutral-500 mt-1">Ative para entregar este produto manualmente através do chat de atendimento após a compra.</p>
                      </div>
                    </div>
                    
                    <div className="bg-[#131316] border border-neutral-800/60 rounded-xl p-5 mb-6 flex justify-between items-center">
                      <div>
                        <h4 className="text-sm font-medium text-white">Ativar entrega via chat</h4>
                        <p className="text-xs text-neutral-500 mt-1">Um chat será criado automaticamente quando o pedido for aprovado.</p>
                      </div>
                      
                      {/* Custom Toggle Switch */}
                      <button 
                        onClick={() => {
                           const isChat = editingVariation.deliveryType === 'CHAT';
                           setEditingVariation({...editingVariation, deliveryType: isChat ? 'FILE' : 'CHAT'})
                        }}
                        className={`w-10 h-6 rounded-full transition-colors relative flex items-center ${editingVariation.deliveryType === 'CHAT' ? 'bg-violet-600' : 'bg-neutral-700'}`}
                      >
                        <div className={`w-4 h-4 bg-white rounded-full absolute transition-all shadow-sm ${editingVariation.deliveryType === 'CHAT' ? 'left-[22px]' : 'left-1'}`}></div>
                      </button>
                    </div>

                    <div>
                      <h4 className="text-sm font-medium text-white mb-1">Mensagem inicial (opcional)</h4>
                      <p className="text-xs text-neutral-500 mb-3">Esta mensagem será enviada automaticamente ao comprador quando o chat for criado.</p>
                      <textarea
                        value={editingVariation.chatInitialMessage}
                        onChange={(e) => setEditingVariation({...editingVariation, chatInitialMessage: e.target.value})}
                        className="w-full h-32 bg-[#131316] border border-neutral-800 rounded-xl p-4 text-sm text-neutral-300 focus:outline-none focus:border-violet-500 transition-colors resize-none"
                        placeholder="Ex: Seu pedido foi aprovado! Me envie seu ID do jogo..."
                      />
                    </div>
                  </div>
                )}

                {/* CONTEÚDO: LINHAS */}
                {activeTab === 'LINES' && (
                  <div className="animate-in fade-in">
                    <div className="flex items-start gap-4 mb-6">
                      <ListIcon className="w-5 h-5 text-violet-400 mt-0.5" />
                      <div className="flex-1">
                        <h3 className="text-sm font-medium text-white">Linhas (Estoque em Texto)</h3>
                        <p className="text-xs text-neutral-500 mt-1">Cada linha funciona como um item de estoque que será enviado automaticamente ao cliente.</p>
                      </div>
                    </div>

                    <div className="flex justify-between gap-4 mb-4">
                      <div className="relative flex-1">
                        <input
                          type="text"
                          placeholder="Buscar linha..."
                          className="w-full bg-[#131316] border border-neutral-800 rounded-lg py-2 pl-4 pr-10 text-sm text-white outline-none"
                        />
                      </div>
                      <button className="bg-white text-black px-4 py-2 rounded-lg text-sm font-medium flex items-center gap-2 hover:bg-neutral-200 transition-colors">
                        <Plus className="w-4 h-4" /> Adicionar estoque
                      </button>
                    </div>

                    <div className="bg-[#131316] border border-neutral-800/60 rounded-xl overflow-hidden">
                      <div className="flex items-center px-4 py-2 border-b border-neutral-800/60 text-xs font-medium text-neutral-500">
                        <input type="checkbox" className="mr-4 rounded border-neutral-700 bg-neutral-800" />
                        <span>0 linhas em estoque</span>
                      </div>
                      
                      <div className="p-8 text-center text-neutral-500 text-sm">
                        Nenhuma linha de estoque cadastrada. <br/>
                        Clique em "Adicionar estoque" para colar as suas keys ou links.
                      </div>
                    </div>
                  </div>
                )}
                
              </div>
            </div>

          </div>

          {/* Coluna Lateral (Configurações) */}
          <div className="space-y-6">
            
            <div className="bg-[#1C1C21] border border-neutral-800/60 rounded-xl p-6">
              <label className="block text-sm font-medium text-neutral-300 mb-2">Slug</label>
              <p className="text-xs text-neutral-500 mb-3">O nome que aparecerá na URL do produto</p>
              <input
                type="text"
                value={editingVariation.slug}
                onChange={(e) => setEditingVariation({...editingVariation, slug: e.target.value})}
                className="w-full bg-[#131316] border border-neutral-800 rounded-lg px-4 py-2.5 text-sm text-white focus:outline-none focus:border-violet-500 transition-colors"
              />
            </div>

            <div className="bg-[#1C1C21] border border-neutral-800/60 rounded-xl p-6">
              <label className="block text-sm font-medium text-neutral-300 mb-3">Visibilidade</label>
              <select
                value={editingVariation.visibility}
                onChange={(e) => setEditingVariation({...editingVariation, visibility: e.target.value})}
                className="w-full bg-[#131316] border border-neutral-800 rounded-lg px-4 py-3 text-sm text-white focus:outline-none focus:border-violet-500 appearance-none transition-colors"
              >
                <option value="VISIBLE">Visível</option>
                <option value="HIDDEN">Oculto</option>
              </select>
            </div>

            <div className="bg-[#1C1C21] border border-neutral-800/60 rounded-xl p-6">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h4 className="text-sm font-medium text-white">Estoque</h4>
                  <p className="text-xs text-neutral-500 mt-1">Ativar estoque deste produto</p>
                </div>
                <button 
                  onClick={() => setEditingVariation({...editingVariation, hasStock: !editingVariation.hasStock})}
                  className={`w-10 h-6 rounded-full transition-colors relative flex items-center shrink-0 ${editingVariation.hasStock ? 'bg-violet-600' : 'bg-neutral-700'}`}
                >
                  <div className={`w-4 h-4 bg-white rounded-full absolute transition-all shadow-sm ${editingVariation.hasStock ? 'left-[22px]' : 'left-1'}`}></div>
                </button>
              </div>
              
              {editingVariation.hasStock && (
                <input
                  type="number"
                  value={editingVariation.stockQuantity}
                  onChange={(e) => setEditingVariation({...editingVariation, stockQuantity: e.target.value})}
                  className="w-full bg-[#131316] border border-neutral-800 rounded-lg px-4 py-2.5 text-sm text-white outline-none"
                />
              )}
            </div>

          </div>
        </div>
      </div>
    );
  };

  // UI for the Variation List (when not editing)
  if (editingVariation) return renderEditVariation();

  return (
    <div className="space-y-6">
      
      {/* List Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <button 
            onClick={() => router.push('/admin/produtos')}
            className="text-neutral-400 hover:text-white flex items-center gap-2 text-sm transition-colors mb-2"
          >
            <ArrowLeft className="w-4 h-4" /> Voltar para Pacotes
          </button>
          <h1 className="text-2xl font-bold text-white flex items-center gap-3">
            Variações de {packageName}
          </h1>
          <p className="text-sm text-neutral-400 mt-1">Gerencie as variações deste pacote.</p>
        </div>
        
        <button 
          onClick={handleCreateNewVariation}
          className="bg-white hover:bg-neutral-200 text-black px-4 py-2.5 rounded-xl text-sm font-medium flex items-center gap-2 transition-colors shadow-sm"
        >
          <Plus className="w-4 h-4" /> Nova variação
        </button>
      </div>

      <div className="flex justify-between items-center mb-4">
        <div className="relative w-72">
          <input
            type="text"
            placeholder="Buscar variação"
            className="w-full bg-[#1C1C21] border border-neutral-800/80 rounded-lg py-2.5 pl-4 pr-10 text-sm text-white focus:outline-none focus:border-neutral-600 transition-colors"
          />
        </div>
        <button className="text-sm text-neutral-400 hover:text-white flex items-center gap-2">
          Ações em massa <ArrowLeft className="w-3 h-3 rotate-[-90deg]" />
        </button>
      </div>

      {/* Tabela de Variações */}
      <div className="bg-[#1C1C21] border border-neutral-800/60 rounded-xl overflow-hidden">
        {variations.map((v) => (
          <div key={v.id} className="flex items-center justify-between p-4 border-b border-neutral-800/60 hover:bg-[#232329] transition-colors group cursor-pointer" onClick={() => setEditingVariation(v)}>
            <div className="flex items-center gap-4">
              <div className="text-neutral-500">
                <ListIcon className="w-4 h-4" />
              </div>
              <span className="text-sm font-medium text-white">{v.name} - R$ {v.price}</span>
              
              {!v.hasStock || parseInt(v.stockQuantity) === 0 ? (
                <span className="bg-rose-500/10 text-rose-400 text-[10px] font-semibold px-2 py-0.5 rounded ml-2">SEM ESTOQUE</span>
              ) : (
                <span className="bg-emerald-500/10 text-emerald-400 text-[10px] font-semibold px-2 py-0.5 rounded ml-2">{v.stockQuantity} EM ESTOQUE</span>
              )}
            </div>
            
            <button className="text-neutral-500 hover:text-white p-2" onClick={(e) => { e.stopPropagation(); /* abria menu */ }}>
              <MoreHorizontal className="w-5 h-5" />
            </button>
          </div>
        ))}
        {variations.length === 0 && (
          <div className="p-8 text-center text-neutral-500 text-sm">
            Nenhuma variação criada.
          </div>
        )}
      </div>

    </div>
  );
}
