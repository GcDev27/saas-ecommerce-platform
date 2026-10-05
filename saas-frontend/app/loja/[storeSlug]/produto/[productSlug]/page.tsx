'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useParams, useRouter } from 'next/navigation';

type Variation = {
  id: string;
  name: string;
  price: number;
  compareAtPrice?: number;
  deliveryType: string;
  stockLines?: { id: string; content: string }[];
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

export default function ProductDetailPage() {
  const params = useParams();
  const router = useRouter();
  const storeSlug = params.storeSlug as string;
  const productSlug = params.productSlug as string;

  const [product, setProduct] = useState<Product | null>(null);
  const [selectedVariation, setSelectedVariation] = useState<Variation | null>(null);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);

  const storeName = storeSlug?.split('-').map((w: string) => w.charAt(0).toUpperCase() + w.slice(1)).join(' ');

  useEffect(() => {
    if (!storeSlug || !productSlug) return;

    fetch(`http://localhost:8081/api/storefront/produtos/${productSlug}`, {
      headers: { 'X-Tenant-Slug': storeSlug },
    })
      .then(res => {
        if (!res.ok) { setNotFound(true); return null; }
        return res.json();
      })
      .then(data => {
        if (!data) return;
        setProduct(data);
        // Seleciona a primeira variação por padrão
        if (data.variations?.length > 0) {
          setSelectedVariation(data.variations[0]);
        }
        setLoading(false);
      })
      .catch(() => { setNotFound(true); setLoading(false); });
  }, [storeSlug, productSlug]);

  const isInStock = (v: Variation) => {
    if (v.hasUnlimitedStock) return true;
    if (v.stockLines && v.stockLines.length > 0) return true;
    if ((v.stockQuantity ?? 0) > 0) return true;
    return false;
  };

  const handleBuyNow = () => {
    if (!selectedVariation) return;
    router.push(`/loja/${storeSlug}/checkout?variationId=${selectedVariation.id}`);
  };

  if (loading) return (
    <div className="min-h-screen bg-[#09090b] flex items-center justify-center">
      <div className="w-8 h-8 border-2 border-violet-500/30 border-t-violet-500 rounded-full animate-spin" />
    </div>
  );

  if (notFound || !product) return (
    <div className="min-h-screen bg-[#09090b] flex flex-col items-center justify-center gap-4">
      <h2 className="text-white text-xl font-bold">Produto não encontrado</h2>
      <Link href={`/loja/${storeSlug}`} className="text-violet-400 hover:text-violet-300 text-sm">← Voltar à loja</Link>
    </div>
  );

  const isSimple = !product.variations || product.variations.length === 1;
  const isChat = selectedVariation?.deliveryType === 'MANUAL_CHAT';

  return (
    <div className="min-h-screen bg-[#09090b] text-white font-sans">

      {/* Header */}
      <header className="sticky top-0 z-50 bg-[#09090b]/95 backdrop-blur-md border-b border-white/5">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 py-4 flex items-center justify-between">
          <Link href={`/loja/${storeSlug}`} className="flex items-center gap-3 hover:opacity-80 transition-opacity">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-violet-500 to-indigo-600 flex items-center justify-center text-white font-black text-sm">
              {storeName?.charAt(0)}
            </div>
            <span className="font-bold text-white text-lg">{storeName}</span>
          </Link>
          <Link href={`/loja/${storeSlug}`} className="text-xs text-neutral-500 hover:text-neutral-300 transition-colors flex items-center gap-1">
            <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            Voltar à loja
          </Link>
        </div>
      </header>

      <main className="max-w-5xl mx-auto px-4 sm:px-6 py-10 lg:py-16">
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-8 lg:gap-12">

          {/* Left: Image + Info */}
          <div className="lg:col-span-3 space-y-6">
            {/* Category breadcrumb */}
            <div className="flex items-center gap-2 text-xs text-neutral-500">
              <Link href={`/loja/${storeSlug}`} className="hover:text-neutral-300 transition-colors">{storeName}</Link>
              <span>/</span>
              <span>{product.categoryName || 'Geral'}</span>
              <span>/</span>
              <span className="text-neutral-300 truncate">{product.name}</span>
            </div>

            {/* Image */}
            <div className="relative w-full aspect-video bg-neutral-900/80 rounded-2xl overflow-hidden border border-white/5">
              {product.imageUrl ? (
                <img src={product.imageUrl} alt={product.name} className="w-full h-full object-cover" />
              ) : (
                <div className="absolute inset-0 flex flex-col items-center justify-center gap-2 text-neutral-700">
                  <svg className="w-10 h-10" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                  <span className="text-sm">Sem imagem</span>
                </div>
              )}
              {/* Delivery badge */}
              <div className="absolute bottom-3 left-3">
                {isChat ? (
                  <span className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-orange-500/20 border border-orange-500/30 text-orange-400 text-[10px] font-semibold rounded-full">
                    <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" /></svg>
                    Entrega Manual · Chat
                  </span>
                ) : (
                  <span className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-green-500/20 border border-green-500/30 text-green-400 text-[10px] font-semibold rounded-full">
                    <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>
                    Entrega Automática
                  </span>
                )}
              </div>
            </div>

            {/* Description */}
            {product.description && (
              <div className="bg-[#111113] border border-white/5 rounded-2xl p-6">
                <h2 className="text-sm font-semibold text-white mb-3 uppercase tracking-wider">Descrição do Produto</h2>
                <div className="text-sm text-neutral-400 leading-relaxed whitespace-pre-wrap">{product.description}</div>
              </div>
            )}

            {/* Trust signals */}
            <div className="grid grid-cols-3 gap-3">
              {[
                { icon: '⚡', title: 'Entrega Imediata', desc: 'Automática após pagamento' },
                { icon: '🔒', title: '100% Seguro', desc: 'Pagamentos protegidos' },
                { icon: '✅', title: 'Garantia', desc: 'Suporte pós-compra' },
              ].map(item => (
                <div key={item.title} className="bg-[#111113] border border-white/5 rounded-xl p-3 text-center">
                  <div className="text-xl mb-1">{item.icon}</div>
                  <p className="text-[11px] font-semibold text-white">{item.title}</p>
                  <p className="text-[10px] text-neutral-500 mt-0.5">{item.desc}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Right: Purchase box */}
          <div className="lg:col-span-2">
            <div className="sticky top-24 space-y-4">
              <div className="bg-[#111113] border border-white/5 rounded-2xl p-6">
                <h1 className="text-xl font-extrabold text-white leading-snug mb-5">{product.name}</h1>

                {/* Variation selector */}
                {!isSimple && product.variations && (
                  <div className="mb-5">
                    <p className="text-xs text-neutral-500 uppercase tracking-wider mb-3 font-medium">Selecione uma opção</p>
                    <div className="space-y-2">
                      {product.variations.map(v => {
                        const inStock = isInStock(v);
                        return (
                          <button
                            key={v.id}
                            type="button"
                            onClick={() => inStock && setSelectedVariation(v)}
                            disabled={!inStock}
                            className={`w-full flex items-center justify-between p-3.5 rounded-xl border text-left transition-all ${
                              selectedVariation?.id === v.id
                                ? 'border-violet-500 bg-violet-500/10'
                                : inStock
                                ? 'border-white/10 bg-white/5 hover:border-white/20'
                                : 'border-white/5 bg-white/[0.02] opacity-40 cursor-not-allowed'
                            }`}
                          >
                            <div className="flex items-center gap-3">
                              <div className={`w-4 h-4 rounded-full border-2 flex items-center justify-center transition-colors ${selectedVariation?.id === v.id ? 'border-violet-500' : 'border-neutral-700'}`}>
                                {selectedVariation?.id === v.id && <div className="w-2 h-2 rounded-full bg-violet-500" />}
                              </div>
                              <div>
                                <p className="text-sm font-medium text-white">{v.name}</p>
                                {!inStock && <p className="text-[10px] text-red-400 mt-0.5">Sem estoque</p>}
                              </div>
                            </div>
                            <div className="text-right">
                              {v.compareAtPrice && (
                                <p className="text-xs line-through text-neutral-600">R$ {Number(v.compareAtPrice).toFixed(2)}</p>
                              )}
                              <p className="text-white font-bold">R$ {Number(v.price).toFixed(2)}</p>
                            </div>
                          </button>
                        );
                      })}
                    </div>
                  </div>
                )}

                {/* Price display (for simple products) */}
                {isSimple && selectedVariation && (
                  <div className="mb-5 py-4 border-y border-white/5">
                    {selectedVariation.compareAtPrice && (
                      <p className="text-sm line-through text-neutral-600 mb-0.5">R$ {Number(selectedVariation.compareAtPrice).toFixed(2)}</p>
                    )}
                    <div className="flex items-center gap-3">
                      <span className="text-3xl font-black text-white">R$ {Number(selectedVariation.price).toFixed(2)}</span>
                      {selectedVariation.compareAtPrice && (
                        <span className="px-2 py-0.5 bg-green-500/20 text-green-400 text-xs font-bold rounded-full">
                          {Math.round((1 - selectedVariation.price / selectedVariation.compareAtPrice) * 100)}% OFF
                        </span>
                      )}
                    </div>
                  </div>
                )}

                {/* Stock info */}
                {selectedVariation && (
                  <div className="mb-5 text-xs text-neutral-500">
                    {isInStock(selectedVariation) ? (
                      <span className="text-green-400">✓ Em estoque · Entrega imediata após pagamento</span>
                    ) : (
                      <span className="text-red-400">✗ Sem estoque no momento</span>
                    )}
                  </div>
                )}

                {/* CTA */}
                <button
                  onClick={handleBuyNow}
                  disabled={!selectedVariation || !isInStock(selectedVariation)}
                  className="w-full py-4 bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-500 hover:to-indigo-500 disabled:opacity-40 disabled:cursor-not-allowed text-white font-bold rounded-xl transition-all active:scale-[0.98] shadow-lg shadow-violet-500/20"
                >
                  {selectedVariation && isInStock(selectedVariation)
                    ? isChat ? '💬 Comprar · Entrega via Chat' : '⚡ Comprar Agora'
                    : 'Sem Estoque'
                  }
                </button>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
