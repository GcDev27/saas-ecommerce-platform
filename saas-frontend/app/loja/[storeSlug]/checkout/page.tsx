'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useParams, useSearchParams, useRouter } from 'next/navigation';
import { Suspense } from 'react';

type Variation = {
  id: string;
  name: string;
  price: number;
  compareAtPrice?: number;
  deliveryType: string;
};

function CheckoutContent() {
  const params = useParams();
  const searchParams = useSearchParams();
  const router = useRouter();

  const storeSlug = params.storeSlug as string;
  const variationId = searchParams.get('variationId');

  const [variation, setVariation] = useState<Variation | null>(null);
  const [productName, setProductName] = useState('');
  const [productSlug, setProductSlug] = useState('');
  const [loading, setLoading] = useState(true);
  const [step, setStep] = useState<'form' | 'processing' | 'success'>('form');

  const [email, setEmail] = useState('');
  const [name, setName] = useState('');
  const [errors, setErrors] = useState<{ email?: string; name?: string }>({});

  const storeName = storeSlug?.split('-').map((w: string) => w.charAt(0).toUpperCase() + w.slice(1)).join(' ');

  useEffect(() => {
    if (!variationId || !storeSlug) return;
    // Busca todos os produtos e encontra a variação
    fetch(`http://localhost:8081/api/storefront/produtos`, {
      headers: { 'X-Tenant-Slug': storeSlug },
    })
      .then(r => r.json())
      .then((products: any[]) => {
        for (const p of products) {
          const found = p.variations?.find((v: any) => v.id === variationId);
          if (found) {
            setVariation(found);
            setProductName(p.name);
            setProductSlug(p.slug);
            break;
          }
        }
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, [variationId, storeSlug]);

  const validate = () => {
    const errs: { email?: string; name?: string } = {};
    if (!name.trim()) errs.name = 'Digite seu nome';
    if (!email.trim() || !email.includes('@')) errs.email = 'Digite um e-mail válido';
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;
    setStep('processing');

    // Simula o processamento de pagamento (futuramente integrará com gateway)
    setTimeout(() => setStep('success'), 2500);
  };

  if (loading) return (
    <div className="min-h-screen bg-[#09090b] flex items-center justify-center">
      <div className="w-8 h-8 border-2 border-violet-500/30 border-t-violet-500 rounded-full animate-spin" />
    </div>
  );

  if (!variation) return (
    <div className="min-h-screen bg-[#09090b] flex flex-col items-center justify-center gap-4">
      <p className="text-white">Produto não encontrado.</p>
      <Link href={`/loja/${storeSlug}`} className="text-violet-400 text-sm">← Voltar à loja</Link>
    </div>
  );

  const isChat = variation.deliveryType === 'MANUAL_CHAT';

  if (step === 'success') return (
    <div className="min-h-screen bg-[#09090b] flex items-center justify-center p-6">
      <div className="max-w-md w-full text-center">
        <div className="w-20 h-20 bg-green-500/20 rounded-full flex items-center justify-center mx-auto mb-6 border border-green-500/30">
          <svg className="w-10 h-10 text-green-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
          </svg>
        </div>
        <h2 className="text-2xl font-extrabold text-white mb-2">Pedido Confirmado!</h2>
        {isChat ? (
          <>
            <p className="text-neutral-400 text-sm mb-6 leading-relaxed">
              Seu pagamento foi processado. O vendedor vai entrar em contato em breve pelo chat para finalizar a entrega.
            </p>
            <div className="bg-orange-500/10 border border-orange-500/20 rounded-xl p-4 text-left mb-6">
              <p className="text-orange-400 text-xs font-semibold mb-1">📩 Próximos passos</p>
              <p className="text-neutral-400 text-xs leading-relaxed">Fique atento ao seu e-mail <span className="text-white font-medium">{email}</span>. O vendedor irá iniciar o chat de entrega.</p>
            </div>
          </>
        ) : (
          <>
            <p className="text-neutral-400 text-sm mb-6 leading-relaxed">
              Seu produto foi entregue automaticamente no e-mail <span className="text-white font-medium">{email}</span>. Verifique sua caixa de entrada!
            </p>
            <div className="bg-green-500/10 border border-green-500/20 rounded-xl p-4 text-left mb-6">
              <p className="text-green-400 text-xs font-semibold mb-1">⚡ Entrega realizada</p>
              <p className="text-neutral-400 text-xs">As instruções e credenciais do produto foram enviadas para seu e-mail.</p>
            </div>
          </>
        )}
        <Link href={`/loja/${storeSlug}`} className="inline-block w-full py-3.5 bg-white hover:bg-neutral-200 text-black font-bold rounded-xl transition-colors">
          Continuar Comprando
        </Link>
      </div>
    </div>
  );

  if (step === 'processing') return (
    <div className="min-h-screen bg-[#09090b] flex items-center justify-center">
      <div className="text-center space-y-5">
        <div className="w-14 h-14 border-2 border-violet-500/30 border-t-violet-500 rounded-full animate-spin mx-auto" />
        <p className="text-white font-medium">Processando pagamento...</p>
        <p className="text-neutral-500 text-sm">Não feche esta janela</p>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-[#09090b] text-white font-sans">
      {/* Header */}
      <header className="border-b border-white/5">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 py-4 flex items-center justify-between">
          <Link href={`/loja/${storeSlug}`} className="flex items-center gap-2.5 hover:opacity-80 transition-opacity">
            <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-violet-500 to-indigo-600 flex items-center justify-center text-white font-black text-xs">
              {storeName?.charAt(0)}
            </div>
            <span className="font-bold text-white">{storeName}</span>
          </Link>
          <div className="flex items-center gap-1.5 text-xs text-neutral-500">
            <svg className="w-3.5 h-3.5 text-green-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
            </svg>
            Checkout Seguro
          </div>
        </div>
      </header>

      <main className="max-w-3xl mx-auto px-4 sm:px-6 py-10">
        <div className="grid grid-cols-1 md:grid-cols-5 gap-6 items-start">

          {/* Form */}
          <div className="md:col-span-3">
            <h1 className="text-xl font-extrabold mb-6">Finalizar Compra</h1>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="bg-[#111113] border border-white/5 rounded-2xl p-6 space-y-4">
                <h2 className="text-sm font-semibold text-neutral-400 uppercase tracking-wider">Seus dados</h2>
                <div>
                  <label className="block text-xs text-neutral-400 mb-1.5">Nome completo *</label>
                  <input
                    type="text"
                    value={name}
                    onChange={e => setName(e.target.value)}
                    placeholder="Seu nome"
                    className={`w-full bg-[#1c1c21] border rounded-xl px-4 py-3 text-sm text-white outline-none transition-colors placeholder-neutral-600 ${errors.name ? 'border-red-500/50 focus:border-red-500' : 'border-white/10 focus:border-violet-500'}`}
                  />
                  {errors.name && <p className="text-red-400 text-xs mt-1">{errors.name}</p>}
                </div>
                <div>
                  <label className="block text-xs text-neutral-400 mb-1.5">E-mail *</label>
                  <input
                    type="email"
                    value={email}
                    onChange={e => setEmail(e.target.value)}
                    placeholder="seu@email.com"
                    className={`w-full bg-[#1c1c21] border rounded-xl px-4 py-3 text-sm text-white outline-none transition-colors placeholder-neutral-600 ${errors.email ? 'border-red-500/50 focus:border-red-500' : 'border-white/10 focus:border-violet-500'}`}
                  />
                  {errors.email && <p className="text-red-400 text-xs mt-1">{errors.email}</p>}
                  <p className="text-[10px] text-neutral-600 mt-1.5">
                    {isChat ? 'Usaremos seu e-mail para o contato de entrega.' : 'O produto será entregue neste e-mail automaticamente.'}
                  </p>
                </div>
              </div>

              {/* Payment placeholder */}
              <div className="bg-[#111113] border border-white/5 rounded-2xl p-6 space-y-4">
                <h2 className="text-sm font-semibold text-neutral-400 uppercase tracking-wider">Pagamento</h2>
                <div className="flex gap-2">
                  {['PIX', 'Cartão de Crédito', 'Boleto'].map(m => (
                    <span key={m} className={`px-3 py-1.5 rounded-lg border text-xs font-medium transition-colors ${m === 'PIX' ? 'bg-green-500/10 border-green-500/30 text-green-400' : 'bg-white/5 border-white/10 text-neutral-500'}`}>
                      {m}
                    </span>
                  ))}
                </div>
                {/* PIX area (mockup por ora) */}
                <div className="bg-[#1c1c21] rounded-xl p-4 border border-white/5 text-center">
                  <div className="w-24 h-24 bg-white rounded-lg mx-auto mb-3 flex items-center justify-center text-neutral-900 text-[10px] font-mono">
                    QR CODE<br/>PAGAMENTO
                  </div>
                  <p className="text-xs text-neutral-500">Integração com gateway em breve.</p>
                </div>
              </div>

              <button
                type="submit"
                className="w-full py-4 bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-500 hover:to-indigo-500 text-white font-bold rounded-xl transition-all active:scale-[0.98] shadow-lg shadow-violet-500/20"
              >
                {isChat ? '💬 Confirmar · Entrega via Chat' : '⚡ Confirmar Compra'}
              </button>
            </form>
          </div>

          {/* Order summary */}
          <div className="md:col-span-2">
            <div className="sticky top-6 bg-[#111113] border border-white/5 rounded-2xl p-5">
              <h2 className="text-sm font-semibold text-neutral-400 uppercase tracking-wider mb-4">Resumo do Pedido</h2>

              <Link href={`/loja/${storeSlug}/produto/${productSlug}`} className="flex items-start gap-3 mb-4 group">
                <div className="w-10 h-10 rounded-xl bg-neutral-800 flex items-center justify-center text-neutral-600 flex-shrink-0 text-lg">📦</div>
                <div>
                  <p className="text-sm font-medium text-white leading-snug group-hover:text-violet-300 transition-colors">{productName}</p>
                  <p className="text-xs text-neutral-500 mt-0.5">{variation.name}</p>
                </div>
              </Link>

              <div className="border-t border-white/5 pt-4 space-y-2">
                {variation.compareAtPrice && (
                  <div className="flex justify-between text-xs">
                    <span className="text-neutral-500">Preço original</span>
                    <span className="line-through text-neutral-600">R$ {Number(variation.compareAtPrice).toFixed(2)}</span>
                  </div>
                )}
                <div className="flex justify-between text-sm">
                  <span className="text-neutral-400">Subtotal</span>
                  <span className="text-white font-medium">R$ {Number(variation.price).toFixed(2)}</span>
                </div>
                {variation.compareAtPrice && (
                  <div className="flex justify-between text-xs">
                    <span className="text-green-400">Desconto</span>
                    <span className="text-green-400">- R$ {(Number(variation.compareAtPrice) - Number(variation.price)).toFixed(2)}</span>
                  </div>
                )}
              </div>

              <div className="border-t border-white/5 mt-4 pt-4 flex justify-between">
                <span className="font-bold text-white">Total</span>
                <span className="font-black text-xl text-white">R$ {Number(variation.price).toFixed(2)}</span>
              </div>

              <div className="mt-4 flex items-center gap-2 text-[10px] text-neutral-600">
                <svg className="w-3 h-3 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd" />
                </svg>
                Transação criptografada e segura
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

export default function CheckoutPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-[#09090b] flex items-center justify-center"><div className="w-8 h-8 border-2 border-violet-500/30 border-t-violet-500 rounded-full animate-spin" /></div>}>
      <CheckoutContent />
    </Suspense>
  );
}
