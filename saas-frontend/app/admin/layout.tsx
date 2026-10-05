"use client";

import { useState, useEffect } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import Link from 'next/link';
import { 
  LayoutDashboard, ShoppingBag, Package, Users, 
  FileText, HelpCircle, Moon, Search, Plus, Bell,
  Menu, X, Settings
} from 'lucide-react';
import UserButton from '../components/UserButton';

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isAuthorized, setIsAuthorized] = useState(false);

  // Verificação de segurança: Checa se o usuário tem o token ao carregar a página
  useEffect(() => {
    const token = localStorage.getItem('token');
    
    if (!token) {
      router.push('/login');
    } else {
      setIsAuthorized(true);
    }
    
    setIsMobileMenuOpen(false);
  }, [pathname, router]);

  // Enquanto verifica o login, mostra uma tela vazia para não vazar a interface
  if (!isAuthorized) {
    return <div className="min-h-screen bg-[#131316] flex items-center justify-center text-zinc-500">Validando sessão...</div>;
  }

  const navItems = [
    { name: 'Visão Geral', href: '/admin', icon: LayoutDashboard },
    { name: 'Produtos', href: '/admin/produtos', icon: Package },
    { name: 'Configurações', href: '/admin/configuracoes', icon: Settings },
    { name: 'Clientes', href: '#clientes', icon: Users },
    { name: 'Pedidos', href: '#pedidos', icon: ShoppingBag },
    { name: 'Relatórios', href: '#relatorios', icon: FileText },
  ];

  return (
    <div className="flex h-screen bg-[#131316] text-white font-sans overflow-hidden">
      
      {isMobileMenuOpen && (
        <div 
          className="fixed inset-0 bg-black/60 z-40 lg:hidden backdrop-blur-sm transition-opacity"
          onClick={() => setIsMobileMenuOpen(false)}
        />
      )}

      <aside className={`
        fixed inset-y-0 left-0 z-50 w-72 bg-[#1C1C21] border-r border-zinc-800/60 flex flex-col transition-transform duration-300 ease-in-out
        lg:relative lg:translate-x-0
        ${isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full'}
      `}>
        
        <div className="h-20 flex items-center justify-between px-6 border-b border-zinc-800/30">
          <span className="text-xl font-semibold tracking-wide text-zinc-100">Painel Admin</span>
          <button 
            className="lg:hidden text-zinc-400 hover:text-white p-2 rounded-lg hover:bg-zinc-800 transition-colors"
            onClick={() => setIsMobileMenuOpen(false)}
          >
            <X className="w-5 h-5" />
          </button>
        </div>
        
        <nav className="flex-1 px-4 py-6 space-y-1.5 overflow-y-auto custom-scrollbar">
          {navItems.map((item) => {
            const isActive = pathname === item.href;
            const Icon = item.icon;
            
            return (
              <Link 
                key={item.name} 
                href={item.href} 
                className={`
                  flex items-center px-4 py-3 rounded-xl font-medium transition-all duration-200 group
                  ${isActive 
                    ? 'bg-[#2A2A32] text-white shadow-sm ring-1 ring-zinc-700/50' 
                    : 'text-zinc-400 hover:text-zinc-100 hover:bg-[#2A2A32]/50'
                  }
                `}
              >
                <Icon className={`w-5 h-5 mr-3 transition-colors ${isActive ? 'text-violet-400' : 'group-hover:text-zinc-300'}`} /> 
                {item.name}
                {isActive && <div className="ml-auto w-1.5 h-1.5 rounded-full bg-violet-400 shadow-[0_0_8px_rgba(167,139,250,0.8)]" />}
              </Link>
            );
          })}
        </nav>

        <div className="p-4 space-y-2 border-t border-zinc-800/30">
          <Link href="#ajuda" className="flex items-center px-4 py-2.5 text-zinc-400 hover:text-zinc-100 hover:bg-[#2A2A32]/50 rounded-xl transition-all duration-200 text-sm font-medium group">
            <HelpCircle className="w-5 h-5 mr-3 group-hover:text-zinc-300 transition-colors" /> 
            Ajuda e Informações
          </Link>
          <div className="flex items-center justify-between px-4 py-3 text-zinc-400 text-sm font-medium rounded-xl hover:bg-[#2A2A32]/30 transition-colors cursor-pointer">
            <div className="flex items-center">
              <Moon className="w-5 h-5 mr-3" />
              Modo Escuro
            </div>
            <div className="w-9 h-5 bg-violet-500 rounded-full relative shadow-inner transition-colors">
              <div className="w-3.5 h-3.5 bg-white rounded-full absolute right-1 top-0.5 shadow-sm"></div>
            </div>
          </div>
        </div>
      </aside>

      <main className="flex-1 flex flex-col min-w-0 overflow-hidden">
        
        <header className="h-20 flex items-center justify-between px-4 lg:px-8 bg-[#131316] border-b border-zinc-800/30 z-10">
          
          <div className="flex items-center flex-1">
            <button 
              className="lg:hidden text-zinc-400 hover:text-white mr-4 p-2 rounded-lg hover:bg-zinc-800 transition-colors"
              onClick={() => setIsMobileMenuOpen(true)}
            >
              <Menu className="w-6 h-6" />
            </button>
            
            <div className="relative w-full max-w-md hidden sm:block">
              <Search className="w-4 h-4 absolute left-4 top-3 text-zinc-500" />
              <input 
                type="text" 
                placeholder="Buscar em toda a loja..." 
                className="w-full bg-[#1C1C21] text-zinc-200 placeholder-zinc-500 rounded-full py-2 pl-11 pr-4 text-sm border border-zinc-800/60 focus:outline-none focus:border-violet-500/50 focus:ring-1 focus:ring-violet-500/50 transition-all"
              />
            </div>
          </div>
          
          <div className="flex items-center space-x-3 lg:space-x-5 pl-4">
            <button className="hidden sm:flex items-center bg-violet-600 hover:bg-violet-700 active:scale-95 text-white px-5 py-2 rounded-full text-sm font-medium transition-all shadow-lg shadow-violet-500/20">
              <Plus className="w-4 h-4 mr-2" />
              Novo Pedido
            </button>
            
            <button className="p-2.5 rounded-full text-zinc-400 hover:text-white hover:bg-zinc-800 transition-colors relative">
              <Bell className="w-5 h-5" />
              <span className="absolute top-2 right-2.5 w-2 h-2 bg-rose-500 rounded-full border-2 border-[#131316]"></span>
            </button>
            
            <UserButton />
          </div>
        </header>
        
        <div className="flex-1 overflow-y-auto p-4 lg:p-8 custom-scrollbar relative">
          {children}
        </div>
      </main>
    </div>
  );
}