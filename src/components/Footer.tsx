import { Play, MessageCircle, Send, Video } from 'lucide-react';

export function Footer() {
  return (
    <footer className="border-t border-zinc-800/60 bg-zinc-950 pt-16 pb-8">
      <div className="container mx-auto px-6 md:px-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-12">
          {/* Brand */}
          <div className="md:col-span-1">
            <a href="#hero" className="flex items-center gap-2 mb-4 group">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-primary to-secondary flex items-center justify-center p-[2px]">
                <div className="w-full h-full bg-background rounded-md flex items-center justify-center">
                  <Play size={18} className="text-secondary ml-1 group-hover:scale-110 transition-transform" />
                </div>
              </div>
              <span className="text-xl font-bold text-zinc-100">Otalex</span>
            </a>
            <p className="text-sm text-zinc-500 mb-6">
              Plugin Parallax 3D para After Effects. Larga de coolocar PNG nesse fundo ai! Nosso plugin fará o Parallex pra você.
            </p>
            <div className="flex gap-4">
              <a href="#" className="text-zinc-500 hover:text-primary transition-colors"><Send size={20} /></a>
              <a href="#" className="text-zinc-500 hover:text-primary transition-colors"><MessageCircle size={20} /></a>
              <a href="#" className="text-zinc-500 hover:text-primary transition-colors"><Video size={20} /></a>
            </div>
          </div>

          {/* Links Navegação */}
          <div>
            <h4 className="font-semibold text-zinc-100 mb-4">Produto</h4>
            <ul className="space-y-3">
              <li><a href="#pricing" className="text-sm text-zinc-500 hover:text-zinc-300 transition-colors">Planos e Preços</a></li>
              <li><a href="#gallery" className="text-sm text-zinc-500 hover:text-zinc-300 transition-colors">Comunidade</a></li>
              <li><a href="#dashboard" className="text-sm text-zinc-500 hover:text-zinc-300 transition-colors">Validar License Key</a></li>
            </ul>
          </div>

          {/* Links Suporte */}
          <div>
            <h4 className="font-semibold text-zinc-100 mb-4">Suporte</h4>
            <ul className="space-y-3">
              <li><a href="#" className="text-sm text-zinc-500 hover:text-zinc-300 transition-colors">Tutoriais</a></li>
              <li><a href="#" className="text-sm text-zinc-500 hover:text-zinc-300 transition-colors">Discord Server</a></li>
              <li><a href="#" className="text-sm text-zinc-500 hover:text-zinc-300 transition-colors">Contato</a></li>
            </ul>
          </div>

          {/* Legal */}
          <div>
            <h4 className="font-semibold text-zinc-100 mb-4">Legal</h4>
            <ul className="space-y-3">
              <li><a href="#" className="text-sm text-zinc-500 hover:text-zinc-300 transition-colors">Termos de Uso</a></li>
              <li><a href="#" className="text-sm text-zinc-500 hover:text-zinc-300 transition-colors">Privacidade</a></li>
              <li><a href="#" className="text-sm text-zinc-500 hover:text-zinc-300 transition-colors">Reembolso</a></li>
            </ul>
          </div>
        </div>
        
        <div className="pt-8 border-t border-zinc-800/60 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-xs text-zinc-600">
            © {new Date().getFullYear()} Otalex. Todos os direitos reservados.
          </p>
          <div className="flex gap-4 text-xs text-zinc-600">
            <span>Desenvolvido para editores e motion designers.</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
