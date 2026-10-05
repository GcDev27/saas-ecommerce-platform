"use client";

import { motion, Variants } from "framer-motion";
import InteractiveLineGraph from "../components/InteractiveLineGraph";
import { DollarSign, ShoppingBag, Users, TrendingUp, Search, Bell, ChevronDown, Package, MoreHorizontal, Circle } from "lucide-react";

export default function DashboardVisaoGeral() {
  const metricas = [
    { titulo: "Faturamento Total", valor: "R$ 248.750,00", variacao: "+18.6% mês passado", icone: <DollarSign className="w-5 h-5 text-amber-500" />, cor: "bg-amber-500/10 border-amber-500/20" },
    { titulo: "Total de Pedidos", valor: "1.287", variacao: "+14.2% mês passado", icone: <ShoppingBag className="w-5 h-5 text-violet-500" />, cor: "bg-violet-500/10 border-violet-500/20" },
    { titulo: "Total de Clientes", valor: "3.642", variacao: "+12.5% mês passado", icone: <Users className="w-5 h-5 text-emerald-500" />, cor: "bg-emerald-500/10 border-emerald-500/20" },
    { titulo: "Taxa de Conversão", valor: "2.73%", variacao: "+8.4% mês passado", icone: <TrendingUp className="w-5 h-5 text-blue-500" />, cor: "bg-blue-500/10 border-blue-500/20" },
  ];

  const topProdutos = [
    { id: 1, nome: "Chaves de Avacoins (100k)", preco: "R$ 12,90", vendas: 842 },
    { id: 2, nome: "Conta Nível 50 + VIP", preco: "R$ 199,00", vendas: 621 },
    { id: 3, nome: "Conjunto de Animação", preco: "R$ 89,00", vendas: 512 },
    { id: 4, nome: "Chaves de Avacoins (500k)", preco: "R$ 49,90", vendas: 423 },
    { id: 5, nome: "Pet Exclusivo Dourado", preco: "R$ 29,00", vendas: 398 },
  ];

  const pedidosRecentes = [
    { id: "#PED-10487", cliente: "Sophia Bennett", data: "3 Jun, 2024", valor: "R$ 129,00", status: "Entregue", cor: "bg-green-500/10 text-green-400 border-green-500/20" },
    { id: "#PED-10486", cliente: "James Anderson", data: "3 Jun, 2024", valor: "R$ 199,00", status: "Enviado", cor: "bg-blue-500/10 text-blue-400 border-blue-500/20" },
    { id: "#PED-10485", cliente: "Olivia Martinez", data: "2 Jun, 2024", valor: "R$ 89,00", status: "Processando", cor: "bg-amber-500/10 text-amber-400 border-amber-500/20" },
    { id: "#PED-10484", cliente: "Daniel Thompson", data: "2 Jun, 2024", valor: "R$ 249,00", status: "Entregue", cor: "bg-green-500/10 text-green-400 border-green-500/20" },
    { id: "#PED-10483", cliente: "Isabella Wilson", data: "1 Jun, 2024", valor: "R$ 159,00", status: "Cancelado", cor: "bg-red-500/10 text-red-400 border-red-500/20" },
  ];

  const containerAnim: Variants = {
    hidden: { opacity: 0 },
    show: { opacity: 1, transition: { staggerChildren: 0.1 } }
  };
  const itemAnim: Variants = {
    hidden: { opacity: 0, y: 15 },
    show: { opacity: 1, y: 0, transition: { type: "spring" as const, stiffness: 300, damping: 24 } }
  };

  return (
    <div className="p-6 lg:p-10 text-neutral-200 min-h-screen bg-[#0a0a0b] font-sans">
      
      {/* 1. Métricas (Top Row) */}
      <motion.div variants={containerAnim} initial="hidden" animate="show" className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-6 mb-6">
        {metricas.map((metrica, idx) => (
          <motion.div key={idx} variants={itemAnim}>
            <div className="bg-[#131316] border border-neutral-800/60 rounded-2xl p-6 h-full hover:border-neutral-700 transition-colors">
              <div className="flex items-start gap-4">
                <div className={`w-12 h-12 rounded-xl flex items-center justify-center border ${metrica.cor}`}>
                  {metrica.icone}
                </div>
                <div>
                  <h3 className="text-neutral-500 text-xs font-semibold mb-1">{metrica.titulo}</h3>
                  <p className="text-2xl font-black text-white tracking-tight">{metrica.valor}</p>
                  <p className="text-[10px] text-neutral-400 mt-2 font-medium flex items-center gap-1">
                    <TrendingUp className="w-3 h-3 text-emerald-400" /> {metrica.variacao}
                  </p>
                </div>
              </div>
            </div>
          </motion.div>
        ))}
      </motion.div>

      {/* 2. Middle Row (Gráfico + Produtos Populares) */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6 mb-6">
        <motion.div initial={{ opacity: 0, scale: 0.98 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.3 }} className="xl:col-span-2 bg-[#131316] border border-neutral-800/60 rounded-2xl p-6">
          <div className="flex justify-between items-center mb-6">
            <div>
              <h2 className="text-sm font-bold text-white">Visão Geral de Vendas</h2>
              <div className="flex gap-4 mt-2">
                <span className="flex items-center gap-1.5 text-[10px] text-neutral-400"><Circle className="w-2 h-2 fill-violet-500 text-violet-500" /> Receita</span>
                <span className="flex items-center gap-1.5 text-[10px] text-neutral-400"><Circle className="w-2 h-2 fill-transparent text-neutral-600" /> Pedidos</span>
              </div>
            </div>
            <select className="bg-[#1c1c21] border border-neutral-800 rounded-lg text-xs px-3 py-1.5 outline-none focus:border-violet-500 text-neutral-300">
              <option>Últimos 30 Dias</option>
              <option>Últimos 7 Dias</option>
            </select>
          </div>
          <InteractiveLineGraph />
        </motion.div>

        <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.4 }} className="bg-[#131316] border border-neutral-800/60 rounded-2xl p-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-sm font-bold text-white">Produtos Mais Vendidos</h2>
            <button className="text-[10px] font-semibold text-violet-400 hover:text-violet-300">Ver todos</button>
          </div>
          <div className="space-y-4">
            {topProdutos.map((prod) => (
              <div key={prod.id} className="flex items-center gap-4 group">
                <div className="w-12 h-12 rounded-lg bg-[#1c1c21] border border-neutral-800 flex items-center justify-center text-neutral-600">
                  <Package className="w-5 h-5" />
                </div>
                <div className="flex-1">
                  <p className="text-xs font-semibold text-white group-hover:text-violet-300 transition-colors">{prod.nome}</p>
                  <p className="text-[10px] text-neutral-500 mt-0.5">{prod.preco}</p>
                </div>
                <div className="text-right">
                  <p className="text-xs font-bold text-white">{prod.vendas}</p>
                  <p className="text-[10px] text-neutral-500">vendidos</p>
                </div>
              </div>
            ))}
          </div>
        </motion.div>
      </div>

      {/* 3. Bottom Row (Tabela de Pedidos + Breakdown) */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 }} className="xl:col-span-2 bg-[#131316] border border-neutral-800/60 rounded-2xl p-6 overflow-hidden">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-sm font-bold text-white">Pedidos Recentes</h2>
            <button className="text-[10px] font-semibold text-violet-400 hover:text-violet-300">Ver todos</button>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-neutral-800/60 text-[10px] uppercase tracking-wider text-neutral-500 font-semibold">
                  <th className="pb-3 font-medium">ID Pedido</th>
                  <th className="pb-3 font-medium">Cliente</th>
                  <th className="pb-3 font-medium">Data</th>
                  <th className="pb-3 font-medium">Valor</th>
                  <th className="pb-3 font-medium">Status</th>
                  <th className="pb-3 font-medium text-right">Ação</th>
                </tr>
              </thead>
              <tbody className="text-xs">
                {pedidosRecentes.map((pedido, i) => (
                  <tr key={i} className="border-b border-neutral-800/30 hover:bg-[#1c1c21]/50 transition-colors">
                    <td className="py-4 font-medium text-white">{pedido.id}</td>
                    <td className="py-4 text-neutral-300">{pedido.cliente}</td>
                    <td className="py-4 text-neutral-500">{pedido.data}</td>
                    <td className="py-4 font-semibold text-white">{pedido.valor}</td>
                    <td className="py-4">
                      <span className={`px-2.5 py-1 rounded-md border text-[10px] font-bold ${pedido.cor}`}>
                        {pedido.status}
                      </span>
                    </td>
                    <td className="py-4 text-right">
                      <button className="text-neutral-500 hover:text-white transition-colors"><MoreHorizontal className="w-4 h-4 ml-auto" /></button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.6 }} className="bg-[#131316] border border-neutral-800/60 rounded-2xl p-6">
          <h2 className="text-sm font-bold text-white mb-6">Status dos Pedidos</h2>
          <div className="flex flex-col items-center justify-center h-50 relative">
            {/* Mockup de Gráfico Donut estilo Aurora */}
            <div className="w-36 h-36 rounded-full border-12 border-neutral-800/80 border-t-violet-500 border-r-blue-500 border-b-emerald-500 border-l-amber-500 relative flex items-center justify-center shadow-[inset_0_0_20px_rgba(0,0,0,0.5)]">
               <div className="text-center">
                 <p className="text-2xl font-black text-white leading-none">1,287</p>
                 <p className="text-[9px] text-neutral-500 uppercase font-semibold mt-1">Total Pedidos</p>
               </div>
            </div>
          </div>
          <div className="mt-6 space-y-3">
            {[
              { label: 'Entregue', percent: '49.9%', count: 642, dot: 'bg-emerald-500' },
              { label: 'Processando', percent: '20.0%', count: 258, dot: 'bg-amber-500' },
              { label: 'Enviado', percent: '16.7%', count: 215, dot: 'bg-blue-500' },
              { label: 'Cancelado', percent: '13.4%', count: 172, dot: 'bg-red-500' },
            ].map(s => (
              <div key={s.label} className="flex items-center justify-between text-xs">
                <div className="flex items-center gap-2">
                  <span className={`w-2 h-2 rounded-full ${s.dot}`}></span>
                  <span className="text-neutral-300">{s.label}</span>
                </div>
                <div className="flex items-center gap-3">
                  <span className="text-white font-medium">{s.count}</span>
                  <span className="text-neutral-500 text-[10px]">({s.percent})</span>
                </div>
              </div>
            ))}
          </div>
        </motion.div>
      </div>

    </div>
  );
}
