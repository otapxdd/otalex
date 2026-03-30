import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Menu, X, Play, UserCircle, ShieldAlert } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

export function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const navigate = useNavigate();
  const { isAuthenticated, user } = useAuth();

  const handleBuyClick = () => {
    if (!isAuthenticated) {
      navigate('/auth');
    } else {
      const pricingSection = document.getElementById('pricing');
      if (pricingSection) {
        pricingSection.scrollIntoView({ behavior: 'smooth' });
      } else {
        navigate('/#pricing');
      }
    }
  };

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { label: 'Início', href: '/#hero' },
    { label: 'Planos', href: '/#pricing' },
    { label: 'Galeria', href: '/#gallery' },
    { label: 'Testar Licença', href: '/#dashboard' }
  ];

  const isAdmin = user?.role === 'admin';

  return (
    <nav className={`fixed top-0 w-full z-50 transition-all duration-300 ${isScrolled ? 'glass py-4' : 'bg-transparent py-6'}`}>
      <div className="container mx-auto px-6 md:px-12 flex items-center justify-between">
        
        {/* LOGO */}
        <Link to="/" className="flex items-center gap-2 group">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-primary to-secondary flex items-center justify-center p-[2px]">
            <div className="w-full h-full bg-background rounded-md flex items-center justify-center">
              <Play size={18} className="text-secondary ml-1 group-hover:scale-110 transition-transform" />
            </div>
          </div>
          <span className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-zinc-100 to-zinc-400">
            Otalex
          </span>
        </Link>

        {/* DESKTOP NAV */}
        <div className="hidden md:flex items-center gap-8">
          <div className="flex gap-6">
            {navLinks.map(link => (
              <a 
                key={link.label}
                href={link.href} 
                className="text-zinc-400 hover:text-white transition-colors text-sm font-medium"
              >
                {link.label}
              </a>
            ))}
          </div>
          <div className="flex items-center gap-4 border-l border-zinc-800 pl-8">
            <a 
              href="https://discord.com" 
              target="_blank" 
              rel="noreferrer"
              className="text-zinc-500 hover:text-[#5865F2] transition-colors bg-zinc-900/50 p-2 rounded-lg border border-zinc-800 hover:border-[#5865F2]/50"
              title="Comunidade Discord"
            >
              <svg viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
                <path d="M20.317 4.3698a19.7913 19.7913 0 00-4.8851-1.5152.0741.0741 0 00-.0785.0371c-.211.3753-.4447.8648-.6083 1.2495-1.8447-.2762-3.68-.2762-5.4868 0-.1636-.3933-.4058-.8742-.6177-1.2495a.077.077 0 00-.0785-.037 19.7363 19.7363 0 00-4.8852 1.515.0699.0699 0 00-.0321.0277C.5334 9.0458-.319 13.5799.0992 18.0578a.0824.0824 0 00.0312.0561c2.0528 1.5076 4.0413 2.4228 5.9929 3.0294a.0777.0777 0 00.0842-.0276c.4616-.6304.8731-1.2952 1.226-1.9942a.076.076 0 00-.0416-.1057c-.6528-.2476-1.2743-.5495-1.8722-.8923a.077.077 0 01-.0076-.1277c.1258-.0943.2517-.1923.3718-.2914a.0743.0743 0 01.0776-.0105c3.9278 1.7933 8.18 1.7933 12.0614 0a.0739.0739 0 01.0785.0095c.1202.099.246.1981.3728.2924a.077.077 0 01-.0066.1276 12.2986 12.2986 0 01-1.873.8914.0766.0766 0 00-.0407.1067c.3604.698.7719 1.3628 1.225 1.9932a.076.076 0 00.0842.0286c1.961-.6067 3.9495-1.5219 6.0023-3.0294a.077.077 0 00.0313-.0552c.5004-5.177-.8382-9.6739-3.5485-13.6604a.061.061 0 00-.0312-.0286zM8.02 15.3312c-1.1825 0-2.1569-1.0857-2.1569-2.419 0-1.3332.9555-2.4189 2.157-2.4189 1.2108 0 2.1757 1.0952 2.1568 2.419 0 1.3332-.9555 2.4189-2.1569 2.4189zm7.9748 0c-1.1825 0-2.1569-1.0857-2.1569-2.419 0-1.3332.9554-2.4189 2.1569-2.4189 1.2108 0 2.1757 1.0952 2.1568 2.419 0 1.3332-.946 2.4189-2.1568 2.4189Z" />
              </svg>
            </a>

            {isAdmin && (
              <Link to="/admin" className="flex items-center gap-2 text-primary font-bold hover:text-primary-hover transition-colors text-xs uppercase tracking-tighter bg-primary/10 px-3 py-2 rounded-lg border border-primary/20 animate-pulse-slow">
                <ShieldAlert size={14} /> Admin
              </Link>
            )}

            {isAuthenticated ? (
              <Link to="/dashboard" className="flex items-center gap-2 text-zinc-300 hover:text-white transition-colors text-sm font-medium">
                <UserCircle size={18} /> Minha Conta
              </Link>
            ) : (
              <Link to="/auth" className="flex items-center gap-2 text-zinc-300 hover:text-white transition-colors text-sm font-medium">
                <UserCircle size={18} /> Entrar
              </Link>
            )}
            <button 
              onClick={handleBuyClick}
              className="bg-primary hover:bg-primary-hover text-white px-5 py-2.5 rounded-xl font-medium text-sm transition-all shadow-[0_0_15px_rgba(139,92,246,0.3)] hover:shadow-[0_0_20px_rgba(139,92,246,0.5)]"
            >
              Comprar Otacoins
            </button>
          </div>
        </div>

        {/* MOBILE TOGGLE */}
        <button 
          className="md:hidden text-zinc-300"
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
        >
          {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>

      </div>

      {/* MOBILE MENU */}
      {isMobileMenuOpen && (
        <motion.div 
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="absolute top-full left-0 w-full glass border-none border-t border-zinc-800 flex flex-col items-center py-6 gap-6 md:hidden shadow-xl"
        >
          {navLinks.map(link => (
            <a 
              key={link.label}
              href={link.href} 
              className="text-zinc-300 font-medium w-full text-center py-2 hover:text-white"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              {link.label}
            </a>
          ))}
          <div className="w-[80%] h-px bg-zinc-800 my-2" />
          
          {isAdmin && (
            <Link 
              to="/admin"
              onClick={() => setIsMobileMenuOpen(false)}
              className="text-primary font-bold w-full text-center py-2 flex items-center justify-center gap-2 uppercase text-xs tracking-widest"
            >
              <ShieldAlert size={20} /> Painel Admin
            </Link>
          )}

          {isAuthenticated ? (
            <Link 
              to="/dashboard"
              onClick={() => setIsMobileMenuOpen(false)}
              className="text-zinc-300 font-medium w-full text-center py-2 flex items-center justify-center gap-2"
            >
              <UserCircle size={20} /> Minha Conta
            </Link>
          ) : (
            <Link 
              to="/auth"
              onClick={() => setIsMobileMenuOpen(false)}
              className="text-zinc-300 font-medium w-full text-center py-2 flex items-center justify-center gap-2"
            >
              <UserCircle size={20} /> Entrar / Conta
            </Link>
          )}
          <button 
            onClick={() => { handleBuyClick(); setIsMobileMenuOpen(false); }}
            className="bg-primary w-[80%] py-3 rounded-xl font-medium text-white shadow-lg mt-2"
          >
            Comprar Otacoins
          </button>
        </motion.div>
      )}
    </nav>
  );
}
