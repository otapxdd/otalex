import { motion } from 'framer-motion';

export function DiscordBanner() {
  return (
    <section className="w-full py-20 border-t border-zinc-800/40 relative overflow-hidden flex justify-center">
      {/* Background glow */}
      <div className="absolute inset-0 bg-[#5865F2]/5 blur-[100px] z-0 pointer-events-none" />
      
      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        whileInView={{ opacity: 1, scale: 1 }}
        viewport={{ once: true }}
        className="container mx-auto px-6 relative z-10"
      >
        <div className="glass-card border border-[#5865F2]/30 rounded-[2rem] p-10 md:p-16 flex flex-col md:flex-row items-center justify-between gap-10 shadow-[0_0_40px_rgba(88,101,242,0.15)] max-w-5xl mx-auto overflow-hidden relative">
          
          {/* Internal Glow */}
          <div className="absolute -top-32 -right-32 w-64 h-64 bg-[#5865F2]/20 blur-[80px] pointer-events-none" />

          <div className="flex-1 text-center md:text-left relative z-10">
            <h2 className="text-3xl md:text-4xl font-bold text-zinc-100 mb-4 flex items-center justify-center md:justify-start gap-3">
              Comunidade Otalex
            </h2>
            <p className="text-zinc-400 text-lg max-w-xl">
              Faça parte da nossa máfia de editores! Tire dúvidas, compartilhe seus AMVs, baixe templates exclusivos e vote em novas funcionalidades.
            </p>
          </div>
          
          <a 
            href="https://discord.com" 
            target="_blank" 
            rel="noreferrer"
            className="relative z-10 flex-shrink-0 bg-[#5865F2] hover:bg-[#4752C4] text-white px-8 py-4 rounded-xl font-bold flex items-center gap-3 transition-all shadow-[0_0_20px_rgba(88,101,242,0.4)] hover:shadow-[0_0_30px_rgba(88,101,242,0.6)] hover:-translate-y-1"
          >
            <svg viewBox="0 0 24 24" fill="currentColor" className="w-7 h-7">
              <path d="M20.317 4.3698a19.7913 19.7913 0 00-4.8851-1.5152.0741.0741 0 00-.0785.0371c-.211.3753-.4447.8648-.6083 1.2495-1.8447-.2762-3.68-.2762-5.4868 0-.1636-.3933-.4058-.8742-.6177-1.2495a.077.077 0 00-.0785-.037 19.7363 19.7363 0 00-4.8852 1.515.0699.0699 0 00-.0321.0277C.5334 9.0458-.319 13.5799.0992 18.0578a.0824.0824 0 00.0312.0561c2.0528 1.5076 4.0413 2.4228 5.9929 3.0294a.0777.0777 0 00.0842-.0276c.4616-.6304.8731-1.2952 1.226-1.9942a.076.076 0 00-.0416-.1057c-.6528-.2476-1.2743-.5495-1.8722-.8923a.077.077 0 01-.0076-.1277c.1258-.0943.2517-.1923.3718-.2914a.0743.0743 0 01.0776-.0105c3.9278 1.7933 8.18 1.7933 12.0614 0a.0739.0739 0 01.0785.0095c.1202.099.246.1981.3728.2924a.077.077 0 01-.0066.1276 12.2986 12.2986 0 01-1.873.8914.0766.0766 0 00-.0407.1067c.3604.698.7719 1.3628 1.225 1.9932a.076.076 0 00.0842.0286c1.961-.6067 3.9495-1.5219 6.0023-3.0294a.077.077 0 00.0313-.0552c.5004-5.177-.8382-9.6739-3.5485-13.6604a.061.061 0 00-.0312-.0286zM8.02 15.3312c-1.1825 0-2.1569-1.0857-2.1569-2.419 0-1.3332.9555-2.4189 2.157-2.4189 1.2108 0 2.1757 1.0952 2.1568 2.419 0 1.3332-.9555 2.4189-2.1569 2.4189zm7.9748 0c-1.1825 0-2.1569-1.0857-2.1569-2.419 0-1.3332.9554-2.4189 2.1569-2.4189 1.2108 0 2.1757 1.0952 2.1568 2.419 0 1.3332-.946 2.4189-2.1568 2.4189Z" />
            </svg>
            Entrar no Discord
          </a>
        </div>
      </motion.div>
    </section>
  );
}
