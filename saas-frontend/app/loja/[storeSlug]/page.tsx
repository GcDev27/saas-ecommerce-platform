import React from 'react';
import Link from 'next/link';
import { notFound } from 'next/navigation';

type Variation = {
  id: string;
  name: string;
  price: number;
  compareAtPrice?: number;
  deliveryType: string;
  stockLines?: any[];
  stockQuantity?: number;
  hasUnlimitedStock?: boolean;
};

type Product = {
  id: string;
  name: string;
  description: string;
  slug: string;
  categoryName?: string;
  imageUrl?: string;
  variations?: Variation[];
};

async function getStoreData(storeSlug: string) {
  try {
    const res = await fetch(`http://localhost:8081/api/storefront/produtos`, {
      headers: { 'X-Tenant-Slug': storeSlug },
      cache: 'no-store',
    });
    if (res.status === 404 || !res.ok) return null;
    return res.json();
  } catch {
    return null;
  }
}

const getMinPrice = (product: Product) => {
  if (!product.variations || product.variations.length === 0) return 0;
  return Math.min(...product.variations.map(v => v.price));
};

const formatStoreName = (slug: string) =>
  slug.split('-').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ');

export default async function StorefrontPage({ params }: { params: { storeSlug: string } }) {
  const { storeSlug } = await params;
  
  // Como precisamos do tenant e dos produtos, vamos fazer as duas buscas
  const tenantRes = await fetch(`http://localhost:8081/api/v1/tenants/${storeSlug}`, { cache: 'no-store' });
  const tenant = tenantRes.ok ? await tenantRes.json() : null;
  
  const products: Product[] = await getStoreData(storeSlug);

  if (!products || !tenant) notFound();

  const categories = Array.from(new Set(products.map(p => p.categoryName || 'Geral')));
  const storeName = tenant.name || formatStoreName(storeSlug);

  return (
    <div className="min-h-screen text-[var(--text-primary)] relative selection:bg-[var(--color-brand)]/30">
      
      {/* Background Glow Efeitos (Glassmorphism ambient light) */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
        <div className="absolute top-[-10%] right-[-5%] w-[40%] h-[40%] bg-[var(--color-brand)]/15 blur-[120px] rounded-full opacity-60 mix-blend-screen" />
        <div className="absolute bottom-[-10%] left-[-5%] w-[40%] h-[40%] bg-[var(--color-brand)]/10 blur-[120px] rounded-full opacity-50 mix-blend-screen" />
      </div>

      <div className="relative z-10 max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 py-6">
        
        {/* Header - Glassmorphism Style */}
        <header className="flex items-center justify-between py-4 px-6 bg-[var(--bg-secondary)]/60 backdrop-blur-2xl border border-[var(--border-color)] rounded-2xl mb-16 shadow-2xl">
          <div className="flex items-center gap-8">
            {tenant.logoUrl ? (
              <img src={tenant.logoUrl} alt={storeName} className="h-8 w-auto object-contain" />
            ) : (
              <h1 className="text-xl font-black tracking-tighter uppercase">{storeName}</h1>
            )}
            <nav className="hidden md:flex items-center gap-6 text-sm text-[var(--text-secondary)] font-medium">
              <span className="text-[var(--text-primary)] cursor-pointer">Products</span>
              <span className="hover:text-[var(--text-primary)] transition-colors cursor-pointer">Templates</span>
              <span className="hover:text-[var(--text-primary)] transition-colors cursor-pointer">Pricing</span>
              <span className="hover:text-[var(--text-primary)] transition-colors cursor-pointer">Learn</span>
            </nav>
          </div>
          <div className="flex items-center gap-4">
             {/* Fake Search Bar para estética */}
             <div className="hidden lg:flex items-center bg-[var(--bg-primary)]/50 border border-[var(--border-color)] rounded-full px-4 py-2 w-64 hover:border-[var(--color-brand)]/50 transition-colors cursor-text">
               <svg className="w-4 h-4 text-[var(--text-secondary)] mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
               <span className="text-[var(--text-secondary)] text-sm">Search Products</span>
             </div>
             
             {/* Carrinho (Icon) */}
             <button className="relative p-2 text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-colors">
               <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" /></svg>
               <span className="absolute top-0 right-0 w-3.5 h-3.5 bg-[var(--color-brand)] text-white text-[9px] font-bold rounded-full flex items-center justify-center">0</span>
             </button>

             <button className="bg-[var(--color-brand)] text-white text-sm font-semibold px-5 py-2 rounded-full hover:brightness-110 transition-all shadow-lg shadow-[var(--color-brand)]/20">
               Login
             </button>
          </div>
        </header>

        {/* Hero Section */}
        <div className="text-center mb-16">
          <h2 className="text-5xl md:text-6xl font-extrabold tracking-tight mb-5">
            {tenant.heroTitle || 'Premium Digital Assets.'}
          </h2>
          <p className="text-[var(--text-secondary)] text-lg max-w-2xl mx-auto">
            {tenant.heroDescription || 'Elevate seu projeto com produtos de alta qualidade.'}
          </p>
        </div>

        {/* Main Layout: Sidebar + Grid */}
        <div className="flex flex-col lg:flex-row gap-12">
          
          {/* Sidebar */}
          <aside className="w-full lg:w-64 shrink-0 space-y-10">
             <div>
               <h3 className="text-sm font-semibold mb-5 text-[var(--text-primary)] flex items-center justify-between">
                 Categories
                 <svg className="w-4 h-4 text-[var(--text-secondary)]" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" /></svg>
               </h3>
               <div className="space-y-3">
                 <label className="flex items-center gap-3 cursor-pointer group">
                   <div className="w-4 h-4 rounded bg-[var(--color-brand)] flex items-center justify-center border border-[var(--color-brand)]">
                     <svg className="w-3 h-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" /></svg>
                   </div>
                   <span className="text-sm text-[var(--text-primary)]">All Products</span>
                 </label>
                 {categories.map(cat => (
                   <label key={cat} className="flex items-center gap-3 cursor-pointer group">
                     <div className="w-4 h-4 rounded bg-[var(--bg-primary)] border border-[var(--border-color)] group-hover:border-[var(--color-brand)]/50 transition-colors" />
                     <span className="text-sm text-[var(--text-secondary)] group-hover:text-[var(--text-primary)] transition-colors">{cat}</span>
                   </label>
                 ))}
               </div>
             </div>

             <div className="pt-8 border-t border-[var(--border-color)]">
               <h3 className="text-sm font-semibold mb-5 text-[var(--text-primary)] flex items-center justify-between">
                 Price
                 <svg className="w-4 h-4 text-[var(--text-secondary)]" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" /></svg>
               </h3>
               <div className="flex items-center justify-between text-xs text-[var(--text-secondary)] mb-3">
                 <span>R$ 0</span>
                 <span>R$ 500+</span>
               </div>
               <div className="h-1.5 bg-[var(--bg-primary)] border border-[var(--border-color)] rounded-full relative">
                 <div className="absolute left-0 right-1/4 h-full bg-[var(--color-brand)] rounded-full"></div>
                 <div className="absolute left-0 w-3 h-3 bg-white rounded-full top-1/2 -translate-y-1/2 shadow" />
                 <div className="absolute right-1/4 w-3 h-3 bg-white rounded-full top-1/2 -translate-y-1/2 shadow translate-x-1.5" />
               </div>
             </div>
          </aside>

          {/* Grid de Produtos */}
          <main className="flex-1">
            {products.length === 0 ? (
              <div className="text-center py-24 bg-[var(--bg-secondary)]/30 border border-[var(--border-color)] rounded-3xl backdrop-blur-md">
                <h3 className="text-xl font-bold text-[var(--text-primary)]">Nenhum produto disponível</h3>
                <p className="text-[var(--text-secondary)] mt-2">Esta loja ainda não adicionou produtos ao catálogo.</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                {products.map(product => {
                  const minPrice = getMinPrice(product);
                  const inStock = product.variations?.some(v =>
                    v.hasUnlimitedStock || (v.stockLines && v.stockLines.length > 0) || (v.stockQuantity ?? 0) > 0
                  );

                  return (
                    <Link key={product.id} href={`/loja/${storeSlug}/produto/${product.slug}`}>
                      <div className="group bg-[var(--bg-secondary)]/80 backdrop-blur-sm border border-[var(--border-color)] rounded-[24px] overflow-hidden hover:border-[var(--color-brand)]/40 hover:shadow-[0_8px_32px_-8px_var(--color-brand)] transition-all duration-500 flex flex-col h-full">
                        
                        {/* Imagem com padding interno (estilo da referência) */}
                        <div className="p-2 pb-0 relative">
                          <div className="w-full aspect-[4/3] bg-[var(--bg-primary)] rounded-[18px] overflow-hidden relative border border-[var(--border-color)]">
                            {product.imageUrl ? (
                              <img src={product.imageUrl} alt={product.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ease-out" />
                            ) : (
                              <div className="absolute inset-0 flex items-center justify-center">
                                <svg className="w-8 h-8 text-[var(--text-secondary)] opacity-30" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                </svg>
                              </div>
                            )}
                            {/* Stock Badge no canto da imagem */}
                            <div className="absolute top-3 right-3">
                              {inStock !== false ? (
                                <span className="flex items-center gap-1.5 px-2.5 py-1 bg-[#111113]/80 backdrop-blur-md border border-[var(--border-color)] text-white text-[10px] font-bold rounded-full">
                                  <span className="w-1.5 h-1.5 rounded-full bg-green-500 shadow-[0_0_8px_#22c55e]"></span>
                                  Disponível
                                </span>
                              ) : (
                                <span className="flex items-center gap-1.5 px-2.5 py-1 bg-[#111113]/80 backdrop-blur-md border border-red-500/30 text-red-400 text-[10px] font-bold rounded-full">
                                  Esgotado
                                </span>
                              )}
                            </div>
                          </div>
                        </div>

                        {/* Conteúdo */}
                        <div className="p-6 flex flex-col flex-1">
                          <h3 className="font-bold text-[var(--text-primary)] text-lg leading-tight mb-2 group-hover:text-[var(--color-brand)] transition-colors line-clamp-1">{product.name}</h3>
                          <p className="text-[var(--text-secondary)] text-xs line-clamp-2 leading-relaxed mb-6">
                            {product.description || 'Produto digital de alta qualidade. Adquira agora e receba automaticamente no seu e-mail.'}
                          </p>
                          
                          <div className="mt-auto flex items-center justify-between">
                            <div>
                              <span className="text-[var(--text-primary)] font-extrabold text-xl">R$ {minPrice.toFixed(2)}</span>
                            </div>
                            <span className="bg-[var(--color-brand)]/10 border border-[var(--color-brand)]/20 text-[var(--color-brand)] text-xs font-bold px-4 py-2 rounded-full group-hover:bg-[var(--color-brand)] group-hover:text-white transition-all duration-300">
                              View Details
                            </span>
                          </div>
                        </div>
                      </div>
                    </Link>
                  );
                })}
              </div>
            )}
          </main>
        </div>
      </div>
    </div>
  );
}
