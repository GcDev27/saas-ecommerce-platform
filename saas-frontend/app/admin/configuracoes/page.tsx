'use client';

import { useState, useEffect, useCallback } from 'react';
import { useToast } from '../../components/Toast';
import { 
  Palette, Type, AlignLeft, MonitorSmartphone, 
  Save, Store, CheckCircle2, RefreshCw, Sparkles
} from 'lucide-react';

// ─── Tipos ────────────────────────────────────────────────────────
type FormData = {
  theme: string;
  primaryColor: string;
  font: string;
  heroTitle: string;
  heroDescription: string;
  logoUrl: string;
};

// ─── Constantes de Design ─────────────────────────────────────────
const THEMES = [
  {
    id: 'theme-glass',
    name: 'Dark Premium',
    desc: 'Glassmorphism elegante, como Vercel e Linear',
    preview: { bg: '#09090b', card: 'rgba(255,255,255,0.04)', text: '#fafafa', accent: '#8b5cf6', border: 'rgba(255,255,255,0.07)' }
  },
  {
    id: 'theme-light',
    name: 'Clean Light',
    desc: 'Minimalismo premium, como Apple e Shopify',
    preview: { bg: '#f8f8f8', card: '#ffffff', text: '#111111', accent: '#2563eb', border: 'rgba(0,0,0,0.08)' }
  },
  {
    id: 'theme-gamer',
    name: 'Gamer Neon',
    desc: 'Alta intensidade, como Razer e Epic Games',
    preview: { bg: '#020204', card: '#0c0c14', text: '#e2e8ff', accent: '#22c55e', border: 'rgba(34,197,94,0.2)' }
  }
];

const FONTS = [
  { name: 'Inter', family: 'Inter, sans-serif', style: 'normal', desc: 'Clean & tecnológica' },
  { name: 'Space Grotesk', family: '"Space Grotesk", sans-serif', style: 'normal', desc: 'Moderna & geométrica' },
  { name: 'Poppins', family: 'Poppins, sans-serif', style: 'normal', desc: 'Amigável & versátil' },
  { name: 'Montserrat', family: 'Montserrat, sans-serif', style: 'normal', desc: 'Forte & marcante' },
  { name: 'Raleway', family: 'Raleway, sans-serif', style: 'normal', desc: 'Elegante & refinada' },
  { name: 'Nunito', family: 'Nunito, sans-serif', style: 'normal', desc: 'Suave & arredondada' },
  { name: 'Playfair Display', family: '"Playfair Display", serif', style: 'italic', desc: 'Luxuosa & editorial' },
  { name: 'Roboto', family: 'Roboto, sans-serif', style: 'normal', desc: 'Clássica & legível' },
];

const PRESET_COLORS = [
  { color: '#8b5cf6', name: 'Violet' },
  { color: '#3b82f6', name: 'Blue' },
  { color: '#10b981', name: 'Emerald' },
  { color: '#f59e0b', name: 'Amber' },
  { color: '#ef4444', name: 'Red' },
  { color: '#ec4899', name: 'Pink' },
  { color: '#06b6d4', name: 'Cyan' },
  { color: '#f97316', name: 'Orange' },
  { color: '#14b8a6', name: 'Teal' },
  { color: '#a855f7', name: 'Purple' },
];

// ─── Tabs ─────────────────────────────────────────────────────────
const TABS = [
  { id: 'tema', label: 'Tema', icon: Palette },
  { id: 'tipografia', label: 'Tipografia', icon: Type },
  { id: 'textos', label: 'Textos & Logo', icon: AlignLeft },
];

// ─── Componente de Pré-visualização ───────────────────────────────
function LivePreview({ formData }: { formData: FormData }) {
  const theme = THEMES.find(t => t.id === formData.theme) || THEMES[0];
  const colors = theme.preview;
  const primaryColor = formData.primaryColor || colors.accent;
  const font = FONTS.find(f => f.name === formData.font);
  const fontFamily = font?.family || 'Inter, sans-serif';

  return (
    <div className="sticky top-6 space-y-3">
      <div className="flex items-center gap-2 mb-4">
        <MonitorSmartphone className="w-4 h-4 text-zinc-400" />
        <span className="text-sm font-medium text-zinc-400">Pré-visualização</span>
        <span className="ml-auto text-xs text-zinc-600 bg-zinc-800/50 px-2 py-0.5 rounded-full">Ao vivo</span>
      </div>

      {/* Browser chrome */}
      <div className="rounded-2xl overflow-hidden border border-zinc-800 shadow-2xl">
        {/* Tab bar */}
        <div className="bg-[#1a1a1e] px-4 py-2.5 flex items-center gap-2 border-b border-zinc-800">
          <div className="flex gap-1.5">
            <div className="w-2.5 h-2.5 rounded-full bg-zinc-700" />
            <div className="w-2.5 h-2.5 rounded-full bg-zinc-700" />
            <div className="w-2.5 h-2.5 rounded-full bg-zinc-700" />
          </div>
          <div className="flex-1 bg-zinc-800 rounded-full h-4 mx-4 flex items-center px-2">
            <div className="w-2 h-2 rounded-full mr-1" style={{ backgroundColor: primaryColor, opacity: 0.8 }} />
            <div className="h-1.5 w-16 bg-zinc-700 rounded-full" />
          </div>
        </div>

        {/* Store mockup */}
        <div 
          className="relative"
          style={{ backgroundColor: colors.bg, fontFamily }}
        >
          {/* Ambient glow for glass theme */}
          {formData.theme === 'theme-glass' && (
            <div className="absolute top-0 right-0 w-24 h-24 rounded-full opacity-20 blur-2xl"
              style={{ backgroundColor: primaryColor }} />
          )}

          {/* Scanlines for gamer theme */}
          {formData.theme === 'theme-gamer' && (
            <div className="absolute inset-0 pointer-events-none" style={{
              backgroundImage: 'repeating-linear-gradient(0deg, transparent, transparent 3px, rgba(0,0,0,0.08) 3px, rgba(0,0,0,0.08) 4px)'
            }} />
          )}

          {/* Header */}
          <div className="relative px-4 py-3 flex items-center justify-between" style={{
            background: formData.theme === 'theme-glass' ? 'rgba(0,0,0,0.4)' : formData.theme === 'theme-gamer' ? 'rgba(0,0,0,0.8)' : colors.bg,
            borderBottom: `1px solid ${colors.border}`,
            backdropFilter: formData.theme === 'theme-glass' ? 'blur(12px)' : 'none',
          }}>
            <div className="flex items-center gap-2">
              {formData.logoUrl ? (
                <img src={formData.logoUrl} alt="Logo" className="h-4 w-auto object-contain" style={{ maxWidth: 60 }} />
              ) : (
                <span className="font-bold text-[10px] tracking-widest uppercase" 
                  style={{ color: primaryColor, fontFamily }}>
                  Minha Loja
                </span>
              )}
              {formData.theme === 'theme-gamer' && (
                <div className="w-px h-3 mx-1" style={{ backgroundColor: primaryColor, opacity: 0.5 }} />
              )}
            </div>
            <div className="flex items-center gap-2">
              <div className="w-10 h-3 rounded-full" style={{ backgroundColor: colors.border }} />
              <div className="px-2 py-0.5 rounded-full text-[7px] font-bold text-white" 
                style={{ backgroundColor: primaryColor, fontFamily }}>
                Login
              </div>
            </div>
          </div>

          {/* Hero */}
          <div className="px-4 py-5 text-center relative z-10">
            <div className="font-extrabold text-[11px] leading-tight mb-1.5 line-clamp-1" 
              style={{ color: colors.text, fontFamily }}>
              {formData.heroTitle || 'Premium Digital Assets.'}
            </div>
            <div className="text-[8px] leading-relaxed line-clamp-2 mb-3" style={{ color: colors.text, opacity: 0.6, fontFamily }}>
              {formData.heroDescription || 'Eleve seu projeto com produtos de alta qualidade.'}
            </div>
            <div className="inline-block px-3 py-1 rounded-full text-[7px] font-bold text-white"
              style={{ backgroundColor: primaryColor }}>
              Ver Produtos
            </div>
          </div>

          {/* Product grid */}
          <div className="px-3 pb-4 grid grid-cols-3 gap-2">
            {[
              { name: 'Produto Pro', price: 'R$ 49,90' },
              { name: 'Pack Bundle', price: 'R$ 129,90' },
              { name: 'Script VIP', price: 'R$ 89,90' },
            ].map((p, i) => (
              <div key={i} className="rounded overflow-hidden relative" style={{
                backgroundColor: colors.card,
                border: `1px solid ${i === 0 ? primaryColor + '40' : colors.border}`,
                boxShadow: formData.theme === 'theme-gamer' && i === 0 ? `0 0 8px ${primaryColor}30` : 'none',
              }}>
                <div className="aspect-square flex items-center justify-center" style={{
                  background: formData.theme === 'theme-light' 
                    ? '#f4f4f5' 
                    : 'rgba(255,255,255,0.04)'
                }}>
                  <div className="w-4 h-4 rounded opacity-20" style={{ backgroundColor: primaryColor }} />
                </div>
                <div className="p-1.5">
                  <div className="text-[6px] font-semibold line-clamp-1 mb-0.5" style={{ color: colors.text, fontFamily }}>{p.name}</div>
                  <div className="text-[7px] font-bold" style={{ color: primaryColor, fontFamily }}>{p.price}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Theme info chips */}
      <div className="flex flex-wrap gap-1.5 mt-2">
        <span className="text-[10px] px-2 py-0.5 rounded-full bg-zinc-800/60 text-zinc-400 border border-zinc-800">
          {theme.name}
        </span>
        <span className="text-[10px] px-2 py-0.5 rounded-full bg-zinc-800/60 text-zinc-400 border border-zinc-800">
          {formData.font}
        </span>
        <span className="text-[10px] px-2 py-0.5 rounded-full bg-zinc-800/60 border border-zinc-800 font-mono" 
          style={{ color: primaryColor }}>
          {formData.primaryColor.toUpperCase()}
        </span>
      </div>
    </div>
  );
}

// ─── Componente Principal ─────────────────────────────────────────
export default function SettingsPage() {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [activeTab, setActiveTab] = useState('tema');
  const { addToast } = useToast();

  const [formData, setFormData] = useState<FormData>({
    theme: 'theme-glass',
    primaryColor: '#8b5cf6',
    font: 'Inter',
    heroTitle: 'Premium Digital Assets.',
    heroDescription: 'Eleve seu projeto com produtos de alta qualidade desenvolvidos por especialistas.',
    logoUrl: ''
  });

  const update = useCallback((field: keyof FormData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    setSaved(false);
  }, []);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) { setLoading(false); return; }
    
    fetch('http://localhost:8081/api/v1/tenants/me', {
      headers: { 'Authorization': `Bearer ${token}` }
    })
      .then(res => { if (!res.ok) throw new Error(); return res.json(); })
      .then(data => {
        setFormData({
          theme: data.theme || 'theme-glass',
          primaryColor: data.primaryColor || '#8b5cf6',
          font: data.font || 'Inter',
          heroTitle: data.heroTitle || 'Premium Digital Assets.',
          heroDescription: data.heroDescription || 'Eleve seu projeto com produtos de alta qualidade.',
          logoUrl: data.logoUrl || ''
        });
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  const handleSave = async () => {
    setSaving(true);
    const token = localStorage.getItem('token');
    try {
      const res = await fetch('http://localhost:8081/api/v1/tenants/me', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
        body: JSON.stringify(formData)
      });
      if (res.ok) {
        setSaved(true);
        addToast('Configurações salvas com sucesso!', 'success');
      } else {
        addToast('Erro ao salvar. Tente novamente.', 'error');
      }
    } catch {
      addToast('Erro de conexão com o servidor.', 'error');
    }
    setSaving(false);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64 gap-3">
        <div className="w-5 h-5 border-2 border-violet-500 border-t-transparent rounded-full animate-spin" />
        <span className="text-zinc-500 text-sm">Carregando configurações...</span>
      </div>
    );
  }

  const currentTheme = THEMES.find(t => t.id === formData.theme);

  return (
    <div className="pb-12">
      {/* Page Header */}
      <div className="flex items-start justify-between mb-8">
        <div>
          <h1 className="text-xl font-bold text-white flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-violet-500/10 flex items-center justify-center">
              <Store className="w-4 h-4 text-violet-400" />
            </div>
            Configurações da Loja
          </h1>
          <p className="text-zinc-500 text-sm mt-1.5 ml-10">Personalize a aparência e os textos da sua vitrine.</p>
        </div>
        <button
          onClick={handleSave}
          disabled={saving}
          className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold transition-all duration-200 shadow-lg ${
            saved 
              ? 'bg-emerald-600/20 text-emerald-400 border border-emerald-500/30 shadow-emerald-500/10' 
              : 'bg-violet-600 hover:bg-violet-500 text-white shadow-violet-500/20 hover:shadow-violet-500/30 active:scale-95'
          } disabled:opacity-60 disabled:cursor-not-allowed`}
        >
          {saving ? (
            <><RefreshCw className="w-4 h-4 animate-spin" />Salvando...</>
          ) : saved ? (
            <><CheckCircle2 className="w-4 h-4" />Salvo</>
          ) : (
            <><Save className="w-4 h-4" />Salvar Alterações</>
          )}
        </button>
      </div>

      {/* Main Layout: Settings + Preview */}
      <div className="grid grid-cols-1 xl:grid-cols-[1fr_320px] gap-8 items-start">

        {/* Left: Settings Panel */}
        <div className="space-y-0">
          
          {/* Tabs */}
          <div className="flex gap-1 p-1 bg-[#111113] rounded-xl border border-zinc-800/60 mb-6 w-fit">
            {TABS.map(tab => {
              const Icon = tab.icon;
              const active = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                    active 
                      ? 'bg-[#1a1a1e] text-white shadow-sm border border-zinc-700/50' 
                      : 'text-zinc-500 hover:text-zinc-300 hover:bg-zinc-800/50'
                  }`}
                >
                  <Icon className="w-3.5 h-3.5" />
                  {tab.label}
                </button>
              );
            })}
          </div>

          {/* ── TAB: Tema ─────────────────────────────── */}
          {activeTab === 'tema' && (
            <div className="space-y-6">
              
              {/* Theme Cards */}
              <div className="bg-[#111113] border border-zinc-800/60 rounded-2xl p-6">
                <div className="mb-5">
                  <h2 className="text-white font-semibold text-sm mb-1">Template da Loja</h2>
                  <p className="text-zinc-500 text-xs">Escolha a identidade visual que mais combina com sua marca.</p>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  {THEMES.map(theme => {
                    const isActive = formData.theme === theme.id;
                    return (
                      <button
                        key={theme.id}
                        onClick={() => update('theme', theme.id)}
                        className={`relative text-left rounded-xl border-2 overflow-hidden transition-all duration-200 group ${
                          isActive 
                            ? 'border-violet-500 shadow-lg shadow-violet-500/20' 
                            : 'border-zinc-800 hover:border-zinc-600'
                        }`}
                      >
                        {/* Miniatura do tema */}
                        <div className="h-24 relative" style={{ backgroundColor: theme.preview.bg }}>
                          {/* Glow/effect per theme */}
                          {theme.id === 'theme-glass' && (
                            <div className="absolute top-2 right-2 w-8 h-8 rounded-full opacity-40 blur-xl" 
                              style={{ backgroundColor: theme.preview.accent }} />
                          )}
                          {theme.id === 'theme-gamer' && (
                            <div className="absolute inset-0 opacity-30" style={{
                              backgroundImage: 'repeating-linear-gradient(0deg, transparent, transparent 3px, rgba(0,0,0,0.15) 3px, rgba(0,0,0,0.15) 4px)'
                            }} />
                          )}
                          {/* Fake header */}
                          <div className="absolute top-0 left-0 right-0 px-2 py-1.5 flex items-center justify-between"
                            style={{ borderBottom: `1px solid ${theme.preview.border}`, backgroundColor: theme.id === 'theme-glass' ? 'rgba(0,0,0,0.3)' : 'transparent' }}>
                            <div className="w-8 h-1.5 rounded-full" style={{ backgroundColor: theme.preview.accent, opacity: 0.8 }} />
                            <div className="flex gap-1">
                              <div className="w-4 h-1 rounded-full" style={{ backgroundColor: theme.preview.border }} />
                              <div className="w-4 h-1 rounded-full" style={{ backgroundColor: theme.preview.accent }} />
                            </div>
                          </div>
                          {/* Cards */}
                          <div className="absolute bottom-2 left-2 right-2 grid grid-cols-3 gap-1">
                            {[0,1,2].map(i => (
                              <div key={i} className="rounded h-8" style={{
                                backgroundColor: theme.preview.card,
                                border: `1px solid ${i === 0 ? theme.preview.accent + '50' : theme.preview.border}`,
                                boxShadow: theme.id === 'theme-gamer' && i === 0 ? `0 0 6px ${theme.preview.accent}40` : 'none'
                              }} />
                            ))}
                          </div>
                        </div>
                        {/* Info */}
                        <div className="p-3 bg-[#1a1a1e] border-t border-zinc-800">
                          <div className="flex items-center justify-between mb-0.5">
                            <span className="text-white text-xs font-semibold">{theme.name}</span>
                            {isActive && (
                              <CheckCircle2 className="w-3.5 h-3.5 text-violet-400" />
                            )}
                          </div>
                          <span className="text-zinc-500 text-[10px]">{theme.desc}</span>
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Color Section */}
              <div className="bg-[#111113] border border-zinc-800/60 rounded-2xl p-6">
                <div className="mb-5">
                  <h2 className="text-white font-semibold text-sm mb-1">Cor Principal</h2>
                  <p className="text-zinc-500 text-xs">Define o tom geral dos botões, links e destaques.</p>
                </div>

                {/* Preset palette */}
                <div className="flex flex-wrap gap-2.5 mb-5">
                  {PRESET_COLORS.map(preset => (
                    <button
                      key={preset.color}
                      onClick={() => update('primaryColor', preset.color)}
                      title={preset.name}
                      className="relative w-8 h-8 rounded-full transition-all duration-200 hover:scale-110 focus:outline-none focus:ring-2 focus:ring-white/30"
                      style={{ backgroundColor: preset.color }}
                    >
                      {formData.primaryColor.toLowerCase() === preset.color && (
                        <span className="absolute inset-0 flex items-center justify-center">
                          <CheckCircle2 className="w-4 h-4 text-white drop-shadow" />
                        </span>
                      )}
                    </button>
                  ))}
                </div>

                {/* Custom color row */}
                <div className="flex items-center gap-3 p-3 bg-[#0d0d10] border border-zinc-800 rounded-xl">
                  <div className="relative">
                    <div className="w-10 h-10 rounded-lg cursor-pointer overflow-hidden border-2 border-zinc-700 hover:border-zinc-500 transition-colors"
                      style={{ backgroundColor: formData.primaryColor }}>
                      <input
                        type="color"
                        value={formData.primaryColor}
                        onChange={e => update('primaryColor', e.target.value)}
                        className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                      />
                    </div>
                  </div>
                  <div className="flex-1">
                    <label className="text-[10px] text-zinc-500 font-medium uppercase tracking-wider">Cor personalizada</label>
                    <input
                      type="text"
                      value={formData.primaryColor.toUpperCase()}
                      onChange={e => update('primaryColor', e.target.value)}
                      className="w-full bg-transparent text-white font-mono text-sm outline-none border-none mt-0.5"
                      placeholder="#8B5CF6"
                    />
                  </div>
                  <Sparkles className="w-4 h-4 text-zinc-600" />
                </div>
              </div>
            </div>
          )}

          {/* ── TAB: Tipografia ──────────────────────── */}
          {activeTab === 'tipografia' && (
            <div className="bg-[#111113] border border-zinc-800/60 rounded-2xl p-6">
              <div className="mb-6">
                <h2 className="text-white font-semibold text-sm mb-1">Tipografia da Loja</h2>
                <p className="text-zinc-500 text-xs">A fonte influencia a personalidade e a legibilidade da sua vitrine.</p>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {FONTS.map(font => {
                  const isActive = formData.font === font.name;
                  return (
                    <button
                      key={font.name}
                      onClick={() => update('font', font.name)}
                      className={`relative text-left p-4 rounded-xl border-2 transition-all duration-200 ${
                        isActive 
                          ? 'border-violet-500 bg-violet-500/5 shadow-lg shadow-violet-500/10' 
                          : 'border-zinc-800 bg-[#0d0d10] hover:border-zinc-700'
                      }`}
                    >
                      <div className="flex items-start justify-between mb-2">
                        <span 
                          className="text-xl font-bold leading-none"
                          style={{ fontFamily: font.family, color: isActive ? '#ffffff' : '#a1a1aa', fontStyle: font.style === 'italic' ? 'italic' : 'normal' }}
                        >
                          {font.name}
                        </span>
                        {isActive && <CheckCircle2 className="w-4 h-4 text-violet-400 shrink-0 mt-0.5" />}
                      </div>
                      <span 
                        className="text-sm block mb-1"
                        style={{ fontFamily: font.family, color: '#71717a' }}
                      >
                        Aa Bb Cc — 1 2 3
                      </span>
                      <span className="text-[10px] text-zinc-600">{font.desc}</span>
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* ── TAB: Textos & Logo ───────────────────── */}
          {activeTab === 'textos' && (
            <div className="space-y-4">
              {/* Logo */}
              <div className="bg-[#111113] border border-zinc-800/60 rounded-2xl p-6">
                <h2 className="text-white font-semibold text-sm mb-1">Logotipo</h2>
                <p className="text-zinc-500 text-xs mb-4">Se preenchido, substitui o nome em texto no cabeçalho da loja.</p>
                
                {/* Preview + input */}
                <div className="flex items-center gap-4 mb-4">
                  <div className="w-16 h-16 rounded-xl bg-zinc-800/50 border border-zinc-700 flex items-center justify-center overflow-hidden shrink-0">
                    {formData.logoUrl ? (
                      <img src={formData.logoUrl} alt="logo preview" className="w-full h-full object-contain p-1" />
                    ) : (
                      <Store className="w-6 h-6 text-zinc-600" />
                    )}
                  </div>
                  <div className="flex-1">
                    <label className="text-xs text-zinc-400 font-medium block mb-1.5">URL da imagem</label>
                    <input 
                      type="text"
                      placeholder="https://i.imgur.com/sua-logo.png"
                      value={formData.logoUrl}
                      onChange={e => update('logoUrl', e.target.value)}
                      className="w-full bg-[#0d0d10] border border-zinc-800 rounded-xl px-4 py-2.5 text-white text-sm focus:ring-1 focus:ring-violet-500 focus:border-violet-500 outline-none transition-colors placeholder:text-zinc-700"
                    />
                    <p className="text-[10px] text-zinc-600 mt-1.5">Use serviços como Imgur ou Cloudinary para hospedar imagens.</p>
                  </div>
                </div>
              </div>

              {/* Textos Hero */}
              <div className="bg-[#111113] border border-zinc-800/60 rounded-2xl p-6 space-y-5">
                <div>
                  <h2 className="text-white font-semibold text-sm mb-1">Seção Principal (Hero)</h2>
                  <p className="text-zinc-500 text-xs">O texto em destaque que os visitantes veem primeiro ao abrir sua loja.</p>
                </div>

                <div>
                  <div className="flex items-center justify-between mb-1.5">
                    <label className="text-xs text-zinc-400 font-medium">Título Principal</label>
                    <span className="text-[10px] text-zinc-600">{formData.heroTitle.length}/80</span>
                  </div>
                  <input 
                    type="text"
                    maxLength={80}
                    value={formData.heroTitle}
                    onChange={e => update('heroTitle', e.target.value)}
                    className="w-full bg-[#0d0d10] border border-zinc-800 rounded-xl px-4 py-2.5 text-white text-sm font-semibold focus:ring-1 focus:ring-violet-500 focus:border-violet-500 outline-none transition-colors"
                    placeholder="Produtos digitais de alta qualidade"
                  />
                </div>

                <div>
                  <div className="flex items-center justify-between mb-1.5">
                    <label className="text-xs text-zinc-400 font-medium">Descrição / Subtítulo</label>
                    <span className="text-[10px] text-zinc-600">{formData.heroDescription.length}/200</span>
                  </div>
                  <textarea 
                    rows={3}
                    maxLength={200}
                    value={formData.heroDescription}
                    onChange={e => update('heroDescription', e.target.value)}
                    className="w-full bg-[#0d0d10] border border-zinc-800 rounded-xl px-4 py-3 text-white text-sm focus:ring-1 focus:ring-violet-500 focus:border-violet-500 outline-none transition-colors resize-none placeholder:text-zinc-700"
                    placeholder="Eleve seus projetos com scripts, templates e artes exclusivas..."
                  />
                </div>

                {/* Live preview do hero text */}
                <div className="rounded-xl border border-zinc-800 bg-[#0a0a0d] p-4">
                  <p className="text-[10px] text-zinc-600 mb-2 uppercase tracking-wider">Preview do Hero</p>
                  <h3 className="text-white font-extrabold text-base leading-tight mb-1">
                    {formData.heroTitle || 'Seu título aqui'}
                  </h3>
                  <p className="text-zinc-500 text-xs leading-relaxed">
                    {formData.heroDescription || 'Sua descrição aqui'}
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Right: Live Preview */}
        <div className="hidden xl:block">
          <LivePreview formData={formData} />
        </div>
      </div>

      {/* Mobile save bar */}
      <div className="xl:hidden fixed bottom-0 left-0 right-0 p-4 bg-[#131316]/90 backdrop-blur-xl border-t border-zinc-800 z-50">
        <button
          onClick={handleSave}
          disabled={saving}
          className="w-full flex items-center justify-center gap-2 bg-violet-600 hover:bg-violet-500 text-white py-3 rounded-xl font-semibold transition-all disabled:opacity-60"
        >
          {saving ? <><RefreshCw className="w-4 h-4 animate-spin" />Salvando...</> : <><Save className="w-4 h-4" />Salvar Configurações</>}
        </button>
      </div>
    </div>
  );
}
