import React from 'react';
import Link from 'next/link';
import { ArrowRight, ShoppingBag, Zap, ShieldCheck } from 'lucide-react';

export default function PlatformLandingPage() {
  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white font-sans selection:bg-violet-500/30">
      
      {/* Navbar */}
      <nav className="border-b border-white/5 backdrop-blur-md sticky top-0 z-50 bg-[#0a0a0a]/80">
        <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-linear-to-br from-violet-500 to-fuchsia-600 flex items-center justify-center">
              <ShoppingBag className="w-4 h-4 text-white" />
            </div>
            <span className="text-xl font-bold tracking-tight">SaaS Commerce</span>
          </div>
          <div className="flex items-center gap-4">
            <Link href="/login" className="text-sm font-medium text-neutral-400 hover:text-white transition-colors px-4 py-2">
              Entrar
            </Link>
            <Link href="/registro" className="text-sm font-medium bg-white text-black px-5 py-2.5 rounded-full hover:bg-neutral-200 transition-colors">
              Criar Loja Grátis
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative pt-32 pb-20 overflow-hidden">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[600px] bg-violet-600/20 blur-[150px] rounded-full pointer-events-none"></div>
        
        <div className="max-w-7xl mx-auto px-6 relative z-10 text-center">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/5 border border-white/10 mb-8">
            <span className="flex h-2 w-2 rounded-full bg-violet-500 animate-pulse"></span>
            <span className="text-xs font-medium text-neutral-300">A plataforma #1 para produtos digitais</span>
          </div>
          
          <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight mb-8 leading-tight">
            Venda produtos digitais <br className="hidden md:block" />
            <span className="text-transparent bg-clip-text bg-linear-to-r from-violet-400 to-fuchsia-500">
              no piloto automático
            </span>
          </h1>
          
          <p className="text-lg md:text-xl text-neutral-400 max-w-2xl mx-auto mb-10 leading-relaxed">
            A infraestrutura completa para você criar sua loja virtual, entregar chaves (keys), gift cards ou serviços, com a melhor conversão do mercado.
          </p>
          
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link href="/registro" className="w-full sm:w-auto flex items-center justify-center gap-2 bg-violet-600 hover:bg-violet-700 text-white px-8 py-4 rounded-full font-medium text-lg transition-all shadow-[0_0_30px_rgba(124,58,237,0.3)] hover:shadow-[0_0_40px_rgba(124,58,237,0.5)]">
              Começar Agora
              <ArrowRight className="w-5 h-5" />
            </Link>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-24 bg-[#0c0c0e] border-t border-white/5">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="p-8 rounded-3xl bg-white/5 border border-white/5 hover:border-violet-500/30 transition-colors">
              <div className="w-12 h-12 rounded-xl bg-violet-500/10 flex items-center justify-center mb-6">
                <Zap className="w-6 h-6 text-violet-400" />
              </div>
              <h3 className="text-xl font-bold mb-3">Entrega Instantânea</h3>
              <p className="text-neutral-400 leading-relaxed">O cliente pagou, recebeu. Sistema de gestão de stock de chaves e ficheiros 100% automático.</p>
            </div>
            
            <div className="p-8 rounded-3xl bg-white/5 border border-white/5 hover:border-violet-500/30 transition-colors">
              <div className="w-12 h-12 rounded-xl bg-violet-500/10 flex items-center justify-center mb-6">
                <ShieldCheck className="w-6 h-6 text-violet-400" />
              </div>
              <h3 className="text-xl font-bold mb-3">Ambiente Isolado</h3>
              <p className="text-neutral-400 leading-relaxed">A sua loja (tenant) funciona de forma independente com URLs exclusivas e dados totalmente isolados e seguros.</p>
            </div>
            
            <div className="p-8 rounded-3xl bg-white/5 border border-white/5 hover:border-violet-500/30 transition-colors">
              <div className="w-12 h-12 rounded-xl bg-violet-500/10 flex items-center justify-center mb-6">
                <ShoppingBag className="w-6 h-6 text-violet-400" />
              </div>
              <h3 className="text-xl font-bold mb-3">Checkout de Alta Conversão</h3>
              <p className="text-neutral-400 leading-relaxed">Design pensado para eliminar atrito e transformar mais visitantes em compradores reais.</p>
            </div>
          </div>
        </div>
      </section>

    </div>
  );
}