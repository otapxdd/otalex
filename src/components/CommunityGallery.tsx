import { useState } from 'react';
import { motion } from 'framer-motion';
import { Search, Download, Heart } from 'lucide-react';

const mockTemplates = [
  { id: 1, title: 'Sukuna Domain Expansion', anime: 'Jujutsu Kaisen', author: '@motion_god', likes: 124, img: 'https://images.unsplash.com/photo-1612450893072-dbdb63da8cd9?w=500&q=80' },
  { id: 2, title: 'Levi vs Beast Titan', anime: 'AOT', author: '@eren_edits', likes: 89, img: 'https://images.unsplash.com/photo-1578632767115-351597cf2477?w=500&q=80' },
  { id: 3, title: 'Goku UI Dodge', anime: 'Dragon Ball', author: '@saiyan_fx', likes: 256, img: 'https://images.unsplash.com/photo-1606567595334-d39972c85d4f?w=500&q=80' },
  { id: 4, title: 'Zoro Onigiri 3D', anime: 'One Piece', author: '@swordsman.ae', likes: 432, img: 'https://images.unsplash.com/photo-1613376023733-0a73315d9b06?w=500&q=80' },
  { id: 5, title: 'Demon Slayer Breathing', anime: 'Kimetsu no Yaiba', author: '@tanjir0', likes: 198, img: 'https://images.unsplash.com/photo-1541562232579-512a21360020?w=500&q=80' },
  { id: 6, title: 'Naruto Baryon Mode', anime: 'Boruto', author: '@hokage_vfx', likes: 312, img: 'https://images.unsplash.com/photo-1580477655122-5ea3b16fc8c4?w=500&q=80' },
];

export function CommunityGallery() {
  const [searchTerm, setSearchTerm] = useState('');

  const filtered = mockTemplates.filter(t => 
    t.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
    t.anime.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <section id="gallery" className="w-full py-32 container mx-auto px-6 md:px-12 relative z-10">
      
      <div className="flex flex-col md:flex-row justify-between items-end mb-12 gap-8">
        <div>
          <h2 className="text-3xl md:text-5xl font-bold mb-4 text-zinc-100">
            Galeria da <span className="text-transparent bg-clip-text bg-gradient-to-r from-secondary to-blue-400">Comunidade</span>
          </h2>
          <p className="text-zinc-400 max-w-xl">
            Explore e baixe templates criados pela comunidade. Arquivos 100% editáveis no After Effects contendo câmeras 3D prontas.
          </p>
        </div>
        
        <div className="relative w-full md:w-96 group">
          <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
            <Search size={18} className="text-zinc-500 group-focus-within:text-secondary transition-colors" />
          </div>
          <input
            type="text"
            className="w-full bg-zinc-900 border border-zinc-800 text-zinc-100 rounded-xl pl-11 pr-4 py-3 focus:outline-none focus:border-secondary focus:ring-1 focus:ring-secondary transition-all"
            placeholder="Buscar por anime, cena ou autor..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {filtered.map((item, index) => (
          <motion.div
            key={item.id}
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.4, delay: index * 0.05 }}
            className="group relative rounded-2xl overflow-hidden glass-card p-2 border-zinc-800 hover:border-zinc-600 transition-colors"
          >
            <div className="relative aspect-video rounded-xl overflow-hidden mb-3 bg-zinc-900">
              {/* Fallback image style since unsplash urls might fail or look generic, we use object-cover */}
              <img src={item.img} alt={item.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 opacity-60 group-hover:opacity-100" />
              
              <div className="absolute top-2 left-2 bg-black/60 backdrop-blur-md px-2 py-1 rounded-md text-[10px] uppercase font-bold text-zinc-300">
                {item.anime}
              </div>
            </div>

            <div className="px-3 pb-3">
              <h3 className="font-semibold text-zinc-200 mb-1 truncate">{item.title}</h3>
              <div className="flex justify-between items-center text-sm text-zinc-500">
                <span className="hover:text-primary cursor-pointer transition-colors">{item.author}</span>
                <div className="flex items-center gap-1">
                  <Heart size={14} /> {item.likes}
                </div>
              </div>

              <div className="mt-4 flex gap-2">
                <button className="flex-1 bg-zinc-800 hover:bg-zinc-700 text-zinc-300 py-2 rounded-lg text-sm font-medium transition-colors flex items-center justify-center gap-2">
                  <Download size={16} />
                  .otalex
                </button>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
      
      {filtered.length === 0 && (
        <div className="w-full py-20 flex flex-col items-center justify-center text-zinc-500">
          <Search size={48} className="mb-4 opacity-20" />
          <p>Nenhum template encontrado para "{searchTerm}"</p>
        </div>
      )}

    </section>
  );
}
