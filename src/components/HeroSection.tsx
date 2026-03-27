import { motion } from 'framer-motion';
import { Sparkles, ArrowRight, Play } from 'lucide-react';

export function HeroSection() {
  return (
    <section id="hero" className="relative min-h-screen flex items-center justify-center pt-24 pb-12 overflow-hidden mx-auto container px-6 md:px-12">
      
      <div className="grid lg:grid-cols-2 gap-12 lg:gap-8 items-center z-10 w-full relative">
        
        {/* TEXT CONTENT */}
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="flex flex-col items-start text-left"
        >
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass border-primary/30 text-primary mb-8 font-medium text-sm">
            <Sparkles size={16} />
            <span>A Revolução para Editores Geek e AMVs</span>
          </div>
          
          <h1 className="text-5xl md:text-6xl lg:text-7xl font-extrabold tracking-tight mb-6 text-zinc-100">
            Crie Parallax 3D <br />em Segundos no <br/>
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary via-purple-400 to-secondary animate-pulse">After Effects</span>
          </h1>
          
          <p className="text-lg md:text-xl text-zinc-400 mb-10 max-w-xl leading-relaxed">
            Automatize máscaras, separe camadas de animes e crie movimentos de câmera perfeitos com apenas 1 clique usando IA focada no universo motion.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto">
            <a href="#pricing" className="group flex items-center justify-center gap-2 bg-primary hover:bg-primary-hover text-white px-8 py-4 rounded-xl font-semibold transition-all shadow-[0_0_20px_rgba(139,92,246,0.4)] hover:shadow-[0_0_30px_rgba(139,92,246,0.6)] hover:-translate-y-1">
              Ver Planos
              <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
            </a>
            <a href="#gallery" className="flex items-center justify-center gap-2 glass px-8 py-4 rounded-xl font-semibold text-zinc-200 hover:bg-zinc-800 transition-all hover:-translate-y-1">
              Ver Galeria da Comunidade
            </a>
          </div>
          
          <div className="mt-10 flex items-center gap-4 text-sm text-zinc-500">
            <div className="flex -space-x-3">
              {[1,2,3,4].map((i) => (
                <div key={i} className="w-8 h-8 rounded-full border border-zinc-900 bg-zinc-800" />
              ))}
            </div>
            <span>Junte-se a +2.000 motion designers</span>
          </div>
        </motion.div>

        {/* VISUAL / VIDEO PLACEHOLDER */}
        <motion.div 
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, delay: 0.2, ease: "easeOut" }}
          className="relative w-full aspect-[4/3] lg:aspect-square flex items-center justify-center"
        >
          {/* Decorative Glow */}
          <div className="absolute inset-0 bg-gradient-to-tr from-primary/30 to-secondary/30 rounded-3xl blur-[80px] -z-10" />
          
          {/* Main Video Card */}
          <div className="relative w-full h-[80%] rounded-[2rem] glass-card overflow-hidden border-zinc-700/50 p-2 group shadow-[0_0_40px_rgba(6,182,212,0.15)]">
            <div className="absolute inset-0 bg-neutral-900/80 m-2 rounded-[1.8rem] flex flex-col items-center justify-center overflow-hidden">
              
              {/* Fake UI for After effects mockup */}
              <div className="absolute top-0 left-0 w-full h-10 border-b border-zinc-800 bg-zinc-950/50 flex items-center px-4 gap-2">
                <div className="w-3 h-3 rounded-full bg-red-500/50" />
                <div className="w-3 h-3 rounded-full bg-yellow-500/50" />
                <div className="w-3 h-3 rounded-full bg-green-500/50" />
                <span className="ml-4 text-xs text-zinc-600 font-mono">Composition - AnimeScene.aep</span>
              </div>

              {/* Play Button Overlay */}
              <div className="z-20 w-16 h-16 rounded-full glass flex items-center justify-center cursor-pointer group-hover:scale-110 transition-transform">
                <Play className="text-zinc-200 translate-x-0.5" fill="currentColor" size={24} />
              </div>
              
              {/* Background image mockup (Grid) */}
              <div className="absolute inset-0 top-10 flex items-center justify-center opacity-30">
                <div className="w-full h-full" style={{ backgroundImage: 'radial-gradient(circle at 2px 2px, rgba(255,255,255,0.15) 1px, transparent 0)', backgroundSize: '24px 24px' }} />
              </div>
              
              <div className="absolute bottom-6 left-1/2 -translate-x-1/2 px-6 py-2 glass rounded-full text-sm font-medium text-zinc-300 tracking-wide flex items-center gap-3">
                <div className="w-2 h-2 rounded-full bg-primary animate-pulse" />
                [Placeholder: Vídeo de Anime virando 3D]
              </div>
            </div>
          </div>
        </motion.div>
      </div>

    </section>
  );
}
