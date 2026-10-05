'use client';

import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { User, Settings, LogOut, Store, ExternalLink } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { removeToken } from '../lib/auth';

export default function UserButton() {
  const [isOpen, setIsOpen] = useState(false);
  const [userEmail, setUserEmail] = useState('Carregando...');
  const [tenantSlug, setTenantSlug] = useState<string | null>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const router = useRouter();

  useEffect(() => {
    // 1. Extrai o e-mail real e tenta extrair o slug decodificando o Token JWT
    const token = localStorage.getItem('token');
    if (token) {
      try {
        const payloadBase64 = token.split('.')[1];
        const decodedJson = atob(payloadBase64.replace(/-/g, '+').replace(/_/g, '/'));
        const payload = JSON.parse(decodedJson);
        
        setUserEmail(payload.sub || payload.email || 'Usuário');
        
        // 2. Busca o slug da loja. 
        // Caso no futuro você adicione o slug dentro do JWT, ele já vai ler daqui.
        // Se não, ele tenta resgatar do localStorage.
        const slug = payload.tenantSlug || localStorage.getItem('tenant_slug');
        if (slug) {
          setTenantSlug(slug);
        }
      } catch (e) {
        setUserEmail('Erro ao ler perfil');
      }
    }

    // Fecha o menu ao clicar fora dele[cite: 13]
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleLogout = () => {
    removeToken();
    localStorage.removeItem('tenant_slug');
    localStorage.removeItem('tenant_id');
    router.push('/login');
  };

  // Função para abrir a loja do cliente
  const handleOpenStore = () => {
    if (tenantSlug) {
      // Abre em uma nova aba. 
      // IMPORTANTE: Ajuste a URL abaixo dependendo de como seu frontend exibe a loja.
      // Exemplo se for subdomínio: window.open(`http://${tenantSlug}.localhost:3000`, '_blank');
      // Exemplo se for em rota: window.open(`/loja/${tenantSlug}`, '_blank');
      window.open(`/loja/${tenantSlug}`, '_blank');
      setIsOpen(false);
    } else {
      alert('A URL da sua loja ainda não está sincronizada. Por favor, saia e faça login novamente.');
    }
  };

  return (
    <div className="relative z-50" ref={dropdownRef}>
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className="w-10 h-10 bg-zinc-800 rounded-full flex items-center justify-center border border-zinc-700/50 cursor-pointer hover:border-zinc-500 transition-colors shrink-0"
      >
        <User className="w-5 h-5 text-zinc-400" />
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 10, scale: 0.95 }}
            transition={{ duration: 0.2 }}
            className="absolute right-0 mt-3 w-56 bg-[#1C1C21] border border-zinc-800/60 rounded-2xl shadow-2xl overflow-hidden py-2"
          >
            <div className="px-4 py-3 border-b border-zinc-800/60 mb-1">
              <p className="text-sm font-medium text-white">Minha Conta</p>
              <p className="text-xs text-zinc-500 truncate mt-0.5">{userEmail}</p>
            </div>
            
            {/* Botão de abrir a loja atualizado */}
            <button 
              onClick={handleOpenStore}
              className="w-full flex items-center justify-between px-4 py-2.5 text-sm text-zinc-400 hover:text-white hover:bg-zinc-800/50 transition-colors"
            >
              <div className="flex items-center">
                <Store className="w-4 h-4 mr-3" />
                Minha Loja
              </div>
              <ExternalLink className="w-3.5 h-3.5 opacity-40" />
            </button>

            <button className="w-full flex items-center px-4 py-2.5 text-sm text-zinc-400 hover:text-white hover:bg-zinc-800/50 transition-colors">
              <Settings className="w-4 h-4 mr-3" />
              Configurações
            </button>
            
            <div className="h-px bg-zinc-800/60 my-1"></div>
            
            <button 
              onClick={handleLogout}
              className="w-full flex items-center px-4 py-2.5 text-sm text-rose-400 hover:text-rose-300 hover:bg-rose-500/10 transition-colors"
            >
              <LogOut className="w-4 h-4 mr-3" />
              Sair da conta
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}