'use client';

import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { User, Settings, LogOut, Store } from 'lucide-react';
import { useRouter } from 'next/navigation';

export default function UserButton() {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const router = useRouter();

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('saas_token');
    localStorage.removeItem('tenant_slug');
    localStorage.removeItem('tenant_id');
    router.push('/login');
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
              <p className="text-xs text-zinc-500 truncate mt-0.5">lojista@exemplo.com</p>
            </div>
            
            <button className="w-full flex items-center px-4 py-2.5 text-sm text-zinc-400 hover:text-white hover:bg-zinc-800/50 transition-colors">
              <Store className="w-4 h-4 mr-3" />
              Minha Loja
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
