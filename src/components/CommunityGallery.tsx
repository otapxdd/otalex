import { motion } from 'framer-motion';
import { Download, Heart, UploadCloud, TrendingUp, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';

// Preview: top 3 mais baixados
const TOP_TEMPLATES = [
  { id: 4,  title: 'Zoro Onigiri 3D',      anime: 'One Piece',      author: '@swordsman.ae', likes: 432, downloads: 2100, img: 'https://images.unsplash.com/photo-1613376023733-0a73315d9b06?w=600&q=80' },
  { id: 10, title: 'Madara Limbo',          anime: 'Naruto',         author: '@uchiha_vfx',   likes: 389, downloads: 1920, img: 'https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?w=600&q=80' },
  { id: 6,  title: 'Naruto Baryon Mode',    anime: 'Boruto',         author: '@hokage_vfx',   likes: 312, downloads: 1580, img: 'https://images.unsplash.com/photo-1580477655122-5ea3b16fc8c4?w=600&q=80' },
  { id: 3,  title: 'Goku UI Dodge',         anime: 'Dragon Ball',    author: '@saiyan_fx',    likes: 256, downloads: 1340, img: 'https://images.unsplash.com/photo-1606567595334-d39972c85d4f?w=600&q=80' },
  { id: 12, title: 'Aizen Kyoka Suigetsu',  anime: 'Bleach',         author: '@shinigami_fx', likes: 278, downloads: 1100, img: 'https://images.unsplash.com/photo-1516912481808-3406841bd33c?w=600&q=80' },
  { id: 1,  title: 'Sukuna Domain Exp.',    anime: 'Jujutsu Kaisen', author: '@motion_god',   likes: 124, downloads: 980,  img: 'https://images.unsplash.com/photo-1612450893072-dbdb63da8cd9?w=600&q=80' },
];

export function CommunityGallery() {
  return (
    <section id="gallery" className="w-full py-32 container mx-auto px-6 md:px-12 relative z-10">

      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-end mb-12 gap-8">
        <div>
          <div className="flex items-center gap-2 mb-3">
            <TrendingUp size={16} className="text-secondary" />
            <span className="text-[10px] font-black text-zinc-500 uppercase tracking-widest">
              Mais Baixados Primeiro
            </span>
          </div>
          <h2 className="text-3xl md:text-5xl font-bold mb-4 text-zinc-100">
            Galeria da{' '}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-secondary to-blue-400">
              Comunidade
            </span>
          </h2>
          <p className="text-zinc-400 max-w-xl">
            Explore templates criados pela comunidade. Arquivos 100% editáveis no After Effects
            contendo câmeras 3D prontas.
          </p>
        </div>

        <Link
          to="/upload"
          target="_blank"
          className="w-full md:w-auto bg-primary hover:bg-primary-hover text-white px-6 py-3 rounded-xl font-bold transition-all shadow-lg hover:shadow-primary/50 flex items-center justify-center gap-2"
        >
          Subir meu Parallax <UploadCloud size={18} />
        </Link>
      </div>

      {/* Preview grid — 6 mais baixados */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
        {TOP_TEMPLATES.map((item, index) => (
          <motion.div
            key={item.id}
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.4, delay: index * 0.06 }}
            className="group relative rounded-2xl overflow-hidden glass-card p-2 border-zinc-800 hover:border-zinc-600 transition-colors"
          >
            <div className="relative aspect-video rounded-xl overflow-hidden mb-3 bg-zinc-900">
              <img
                src={item.img}
                alt={item.title}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 opacity-60 group-hover:opacity-100"
              />
              <div className="absolute top-2 left-2 bg-black/60 backdrop-blur-md px-2 py-1 rounded-md text-[10px] uppercase font-bold text-zinc-300">
                {item.anime}
              </div>
              {index === 0 && (
                <div className="absolute top-2 right-2 bg-secondary/90 backdrop-blur-md px-2 py-1 rounded-md text-[10px] uppercase font-black text-white flex items-center gap-1">
                  <TrendingUp size={10} /> #1
                </div>
              )}
            </div>

            <div className="px-3 pb-3">
              <h3 className="font-semibold text-zinc-200 mb-1 truncate">{item.title}</h3>
              <div className="flex justify-between items-center text-sm text-zinc-500 mb-4">
                <span className="hover:text-primary cursor-pointer transition-colors text-xs">
                  {item.author}
                </span>
                <div className="flex items-center gap-3 text-xs">
                  <span className="flex items-center gap-1"><Heart size={12} /> {item.likes}</span>
                  <span className="flex items-center gap-1 text-secondary/80 font-bold">
                    <Download size={12} /> {item.downloads.toLocaleString('pt-BR')}
                  </span>
                </div>
              </div>
              <button className="w-full bg-zinc-800 hover:bg-zinc-700 text-zinc-300 py-2 rounded-lg text-sm font-medium transition-colors flex items-center justify-center gap-2">
                <Download size={16} /> .otalex
              </button>
            </div>
          </motion.div>
        ))}
      </div>

      {/* CTA — ir para galeria completa */}
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5 }}
        className="flex flex-col items-center gap-4"
      >
        <p className="text-zinc-500 text-sm">
          Mostrando os 6 mais baixados de{' '}
          <span className="text-white font-bold">12 templates</span> disponíveis
        </p>
        <Link
          to="/gallery"
          className="flex items-center gap-3 bg-zinc-900 hover:bg-zinc-800 border border-zinc-700 hover:border-primary/50 text-zinc-200 hover:text-white px-8 py-4 rounded-2xl font-bold transition-all active:scale-95 group"
        >
          Ver galeria completa
          <ArrowRight size={18} className="text-zinc-500 group-hover:text-primary transition-colors group-hover:translate-x-1 duration-200" />
        </Link>
      </motion.div>

    </section>
  );
}
