"use client";

import { motion, Variants } from "framer-motion";
import InteractiveLineGraph from "../components/InteractiveLineGraph";

export default function DashboardVisaoGeral() {
  // Dados fictícios perfeitos para marketing
  const metricas = [
    { titulo: "Faturamento Líquido", valor: "R$ 48.592,00", variacao: "+14.2%", positivo: true },
    { titulo: "Vendas Realizadas", valor: "342", variacao: "+8.1%", positivo: true },
    { titulo: "Taxa de Conversão", valor: "4.8%", variacao: "-0.4%", positivo: false },
    { titulo: "Ticket Médio", valor: "R$ 142,08", variacao: "+2.4%", positivo: true },
  ];

  const vendasRecentes = [
    { id: "PED-8472", cliente: "Lucas Silva", produto: "Template Creator Pro", valor: "R$ 297,00", tempo: "Há 5 min", status: "Aprovado" },
    { id: "PED-8471", cliente: "Mariana Costa", produto: "E-book: Vendas Rápidas", valor: "R$ 47,00", tempo: "Há 12 min", status: "Aprovado" },
    { id: "PED-8470", cliente: "João Pedro", produto: "Pack de Ícones Premium", valor: "R$ 97,00", tempo: "Há 45 min", status: "Pendente" },
    { id: "PED-8469", cliente: "Ana Beatriz", produto: "Template Creator Pro", valor: "R$ 297,00", tempo: "Há 1 hora", status: "Aprovado" },
  ];

  // Animação em cascata para os cartões
  const containerAnim: Variants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: { staggerChildren: 0.1 }
    }
  };

  const itemAnim: Variants = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 300, damping: 24 } }
  };

  return (
    <div className="p-8 text-white min-h-screen bg-[#0a0a0a]">
      {/* Cabeçalho */}
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-2xl font-bold">Visão Geral</h1>
          <p className="text-neutral-400 text-sm mt-1">
            Acompanhe o desempenho da sua loja nos últimos 30 dias.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <button className="bg-[#171717] border border-neutral-800 text-sm text-neutral-300 px-4 py-2 rounded-lg hover:text-white transition-colors">
            Últimos 30 dias
          </button>
          <button className="bg-violet-600 hover:bg-violet-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors shadow-[0_0_15px_rgba(124,58,237,0.3)]">
            Exportar Relatório
          </button>
        </div>
      </div>

      {/* Grid de Métricas */}
      <motion.div 
        variants={containerAnim} 
        initial="hidden" 
        animate="show" 
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8"
      >
        {metricas.map((metrica, idx) => (
          <motion.div key={idx} variants={itemAnim}>
            <div className="bg-[#171717] border border-neutral-800 rounded-2xl p-6 relative overflow-hidden group hover:border-neutral-700 transition-colors h-full">
              {/* Efeito de brilho de fundo no hover */}
              <div className="absolute inset-0 bg-gradient-to-br from-violet-600/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
              
              <h3 className="text-neutral-400 text-sm font-medium mb-2">{metrica.titulo}</h3>
              <div className="flex items-end justify-between mt-4">
                <span className="text-3xl font-bold tracking-tight text-white">{metrica.valor}</span>
                <span className={`text-xs font-semibold px-2 py-1 rounded-md mb-1 ${metrica.positivo ? 'bg-emerald-500/10 text-emerald-400' : 'bg-red-500/10 text-red-400'}`}>
                  {metrica.variacao}
                </span>
              </div>
            </div>
          </motion.div>
        ))}
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Gráfico Principal Animado */}
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.3, duration: 0.5 }}
          className="lg:col-span-2 bg-[#171717] border border-neutral-800 rounded-2xl p-6"
        >
          <div className="flex justify-between items-center mb-2">
            <h2 className="text-lg font-semibold">Desempenho de Vendas</h2>
            <div className="flex gap-2 items-center">
              <span className="w-2 h-2 rounded-full bg-violet-500 shadow-[0_0_8px_rgba(124,58,237,0.8)]"></span>
              <span className="text-xs text-neutral-400">Faturamento Diário</span>
            </div>
          </div>
          
          {/* O componente interativo do Framer Motion */}
          <InteractiveLineGraph />
          
        </motion.div>

        {/* Lista de Vendas Recentes */}
        <motion.div 
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.5, duration: 0.5 }}
          className="bg-[#171717] border border-neutral-800 rounded-2xl p-6"
        >
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-lg font-semibold">Vendas Recentes</h2>
            <button className="text-xs text-violet-400 hover:text-violet-300 transition-colors">Ver todas</button>
          </div>

          <div className="space-y-5">
            {vendasRecentes.map((venda, idx) => (
              <div key={idx} className="flex items-center justify-between group cursor-default">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-neutral-800 flex items-center justify-center text-sm font-medium border border-neutral-700">
                    {venda.cliente.charAt(0)}
                  </div>
                  <div>
                    <p className="text-sm font-medium text-white group-hover:text-violet-400 transition-colors">{venda.cliente}</p>
                    <p className="text-xs text-neutral-500">{venda.produto}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-sm font-semibold text-white">{venda.valor}</p>
                  <p className="text-[10px] text-neutral-500">{venda.tempo}</p>
                </div>
              </div>
            ))}
          </div>
        </motion.div>
      </div>
    </div>
  );
}