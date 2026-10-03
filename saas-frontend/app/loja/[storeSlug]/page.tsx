import React from 'react';
import { notFound } from 'next/navigation';

type Product = {
  id: string;
  name: string;
  description: string;
  price: number;
};

// Função para buscar os dados no Spring Boot de forma dinâmica
async function getProducts(storeSlug: string) {
  try {
    const res = await fetch(`http://localhost:8081/api/storefront/produtos`, {
      method: 'GET',
      headers: {
        'X-Tenant-Slug': storeSlug,
        'Content-Type': 'application/json'
      },
      cache: 'no-store'
    });

    if (res.status === 404 || res.status === 403) {
      return null; // Loja não encontrada ou inativa
    }

    if (!res.ok) {
      throw new Error('Falha ao buscar produtos');
    }

    return res.json();
  } catch (error) {
    console.error("Erro ao buscar produtos:", error);
    return null;
  }
}

// Next.js App Router route params
export default async function StorefrontPage({ params }: { params: { storeSlug: string } }) {
  // Await the params object in Next.js 15+ if needed, but synchronous destructuring usually works in page props.
  // Wait, in Next.js 15, `params` is a Promise and must be awaited.
  const { storeSlug } = await params;
  
  const products = await getProducts(storeSlug);

  // Se a loja não existir (ex: tenant-slug inválido no backend), mostramos o 404
  if (!products) {
    notFound();
  }

  // Nome formatado provisório (no futuro pegamos os detalhes da loja numa API /tenant/info)
  const formatStoreName = (slug: string) => {
    return slug.split('-').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ');
  };

  return (
    <main className="min-h-screen bg-neutral-50 p-10 font-sans">
      <div className="max-w-5xl mx-auto">
        
        {/* Cabeçalho da Loja */}
        <header className="mb-12 text-center md:text-left border-b border-neutral-200 pb-8">
          <span className="inline-block px-3 py-1 bg-violet-100 text-violet-700 text-xs font-semibold rounded-full mb-3 uppercase tracking-wider">
            Loja Oficial
          </span>
          <h1 className="text-4xl md:text-5xl font-extrabold text-neutral-900 tracking-tight">
            {formatStoreName(storeSlug)}
          </h1>
          <p className="text-neutral-500 mt-3 text-lg max-w-2xl">
            Bem-vindo à loja {formatStoreName(storeSlug)}. Aqui encontra os nossos melhores produtos com entrega imediata.
          </p>
        </header>

        {/* Vitrine de Produtos */}
        {products.length === 0 ? (
          <div className="text-center py-20 bg-white rounded-3xl border border-neutral-100 shadow-sm">
            <h3 className="text-xl font-medium text-neutral-800">Esta loja ainda não tem produtos.</h3>
            <p className="text-neutral-500 mt-2">O vendedor ainda não adicionou itens ao catálogo.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
            {products.map((product: Product) => (
              <div key={product.id} className="bg-white p-6 rounded-2xl shadow-[0_2px_10px_-3px_rgba(6,81,237,0.1)] border border-neutral-100 hover:shadow-xl hover:-translate-y-1 transition-all duration-300 flex flex-col h-full group">
                
                <div className="flex-1">
                  <h2 className="text-xl font-bold text-neutral-800 group-hover:text-violet-600 transition-colors line-clamp-2">{product.name}</h2>
                  <p className="text-neutral-500 mt-3 text-sm leading-relaxed line-clamp-3">
                    {product.description}
                  </p>
                </div>
                
                <div className="mt-6 pt-6 border-t border-neutral-100 flex items-center justify-between">
                  <span className="text-violet-600 font-extrabold text-2xl tracking-tight">
                    R$ {product.price.toFixed(2)}
                  </span>
                </div>
                
                <button className="mt-5 w-full bg-neutral-900 text-white font-medium py-3 rounded-xl hover:bg-violet-600 active:scale-95 transition-all shadow-md flex justify-center items-center gap-2">
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
                  </svg>
                  Comprar Agora
                </button>
              </div>
            ))}
          </div>
        )}

      </div>
    </main>
  );
}
