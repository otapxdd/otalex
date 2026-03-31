import { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Search, Download, Heart, UploadCloud, TrendingUp,
  SlidersHorizontal, Grid3X3, List, X, ChevronDown, Flame
} from 'lucide-react';
import { Link } from 'react-router-dom';

// ─── Dados mock (futuramente virá da API) ─────────────────────────────────────
const ALL_TEMPLATES = [
  { id: 1,  title: 'Sukuna Domain Expansion',  anime: 'Jujutsu Kaisen',    author: '@motion_god',    likes: 124, downloads: 980,  img: 'https://images.unsplash.com/photo-1612450893072-dbdb63da8cd9?w=600&q=80', tags: ['domínio', 'horror'] },
  { id: 2,  title: 'Levi vs Beast Titan',       anime: 'AOT',               author: '@eren_edits',    likes: 89,  downloads: 410,  img: 'https://images.unsplash.com/photo-1578632767115-351597cf2477?w=600&q=80', tags: ['batalha', 'épico'] },
  { id: 3,  title: 'Goku UI Dodge',             anime: 'Dragon Ball',       author: '@saiyan_fx',     likes: 256, downloads: 1340, img: 'https://images.unsplash.com/photo-1606567595334-d39972c85d4f?w=600&q=80', tags: ['ação', 'esquiva'] },
  { id: 4,  title: 'Zoro Onigiri 3D',           anime: 'One Piece',         author: '@swordsman.ae',  likes: 432, downloads: 2100, img: 'https://images.unsplash.com/photo-1613376023733-0a73315d9b06?w=600&q=80', tags: ['espada', '3d'] },
  { id: 5,  title: 'Demon Slayer Breathing',    anime: 'Kimetsu no Yaiba',  author: '@tanjir0',       likes: 198, downloads: 760,  img: 'https://images.unsplash.com/photo-1541562232579-512a21360020?w=600&q=80', tags: ['respiração', 'fogo'] },
  { id: 6,  title: 'Naruto Baryon Mode',        anime: 'Boruto',            author: '@hokage_vfx',    likes: 312, downloads: 1580, img: 'https://images.unsplash.com/photo-1580477655122-5ea3b16fc8c4?w=600&q=80', tags: ['modo', 'poder'] },
  { id: 7,  title: 'Itadori Divergent Fist',   anime: 'Jujutsu Kaisen',    author: '@curse_fx',      likes: 77,  downloads: 290,  img: 'https://images.unsplash.com/photo-1560807707-8cc77767d783?w=600&q=80', tags: ['soco', 'maldição'] },
  { id: 8,  title: 'Whitebeard Quake',          anime: 'One Piece',         author: '@yonko_edit',    likes: 143, downloads: 620,  img: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=600&q=80', tags: ['poder', 'tremor'] },
  { id: 9,  title: 'Killua Godspeed',           anime: 'HxH',               author: '@hunter_ae',     likes: 201, downloads: 870,  img: 'https://images.unsplash.com/photo-1518770660439-4636190af475?w=600&q=80', tags: ['velocidade', 'raio'] },
  { id: 10, title: 'Madara Limbo',              anime: 'Naruto',            author: '@uchiha_vfx',    likes: 389, downloads: 1920, img: 'https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?w=600&q=80', tags: ['sombra', 'épico'] },
  { id: 11, title: 'Rem Ice Flower',            anime: 'Re:Zero',           author: '@subaru_edit',   likes: 166, downloads: 540,  img: 'https://images.unsplash.com/photo-1491895200222-0fc4a4c35e61?w=600&q=80', tags: ['gelo', 'magia'] },
  { id: 12, title: 'Aizen Kyoka Suigetsu',      anime: 'Bleach',            author: '@shinigami_fx',  likes: 278, downloads: 1100, img: 'https://images.unsplash.com/photo-1516912481808-3406841bd33c?w=600&q=80', tags: ['ilusão', 'zanpakuto'] },
];

const PAGE_SIZE = 8;
const SORT_OPTIONS = [
  { value: 'downloads', label: 'Mais Baixados' },
  { value: 'likes', label: 'Mais Curtidos' },
  { value: 'recent', label: 'Mais Recentes' },
];

const animes = ['Todos', ...Array.from(new Set(ALL_TEMPLATES.map(t => t.anime))).sort()];

type SortKey = 'downloads' | 'likes' | 'recent';
type ViewMode = 'grid' | 'list';

export function GalleryPage() {
  const [search, setSearch] = useState('');
  const [animeFilter, setAnimeFilter] = useState('Todos');
  const [sortBy, setSortBy] = useState<SortKey>('downloads');
  const [viewMode, setViewMode] = useState<ViewMode>('grid');
  const [page, setPage] = useState(1);
  const [sortOpen, setSortOpen] = useState(false);

  const filtered = useMemo(() => {
    let items = [...ALL_TEMPLATES];

    // Filtro de anime
    if (animeFilter !== 'Todos') {
      items = items.filter(t => t.anime === animeFilter);
    }

    // Busca
    if (search.trim()) {
      const s = search.toLowerCase();
      items = items.filter(t =>
        t.title.toLowerCase().includes(s) ||
        t.anime.toLowerCase().includes(s) ||
        t.author.toLowerCase().includes(s) ||
        t.tags.some(tag => tag.includes(s))
      );
    }

    // Ordenação
    items.sort((a, b) => {
      if (sortBy === 'downloads') return b.downloads - a.downloads;
      if (sortBy === 'likes') return b.likes - a.likes;
      return b.id - a.id; // recent = maior id primeiro
    });

    return items;
  }, [search, animeFilter, sortBy]);

  const visible = filtered.slice(0, page * PAGE_SIZE);
  const hasMore = visible.length < filtered.length;

  const resetFilters = () => {
    setSearch('');
    setAnimeFilter('Todos');
    setSortBy('downloads');
    setPage(1);
  };

  const isFiltered = search || animeFilter !== 'Todos' || sortBy !== 'downloads';

  return (
    <div className="min-h-screen pt-28 pb-20 px-4 md:px-8 container mx-auto">

      {/* ── Header ──────────────────────────────────────────── */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mb-10">
        <div className="flex items-center gap-2 mb-2">
          <Flame size={14} className="text-secondary" />
          <span className="text-[10px] font-black text-zinc-500 uppercase tracking-widest">Galeria Completa</span>
        </div>
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div>
            <h1 className="text-4xl md:text-5xl font-black text-white mb-2">
              Templates da{' '}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-secondary to-blue-400">
                Comunidade
              </span>
            </h1>
            <p className="text-zinc-400">
              {filtered.length} template{filtered.length !== 1 ? 's' : ''} disponíve{filtered.length !== 1 ? 'is' : 'l'}
            </p>
          </div>
          <Link
            to="/upload"
            className="flex items-center gap-2 bg-primary hover:bg-primary-hover text-white px-6 py-3 rounded-xl font-bold transition-all shadow-lg hover:shadow-primary/50 w-fit"
          >
            <UploadCloud size={18} /> Subir meu Parallax
          </Link>
        </div>
      </motion.div>

      {/* ── Barra de controles ──────────────────────────────── */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="flex flex-col gap-4 mb-8"
      >
        {/* Search + Sort + View */}
        <div className="flex flex-col sm:flex-row gap-3">
          {/* Busca */}
          <div className="relative flex-1 group">
            <Search size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-500 group-focus-within:text-secondary transition-colors" />
            <input
              type="text"
              value={search}
              onChange={e => { setSearch(e.target.value); setPage(1); }}
              placeholder="Buscar por título, anime, autor ou tag..."
              className="w-full bg-zinc-900 border border-zinc-800 text-zinc-100 rounded-xl pl-10 pr-10 py-3 focus:outline-none focus:border-secondary transition-all text-sm"
            />
            {search && (
              <button onClick={() => setSearch('')} className="absolute right-4 top-1/2 -translate-y-1/2 text-zinc-500 hover:text-white transition-colors">
                <X size={14} />
              </button>
            )}
          </div>

          {/* Sort dropdown */}
          <div className="relative">
            <button
              onClick={() => setSortOpen(v => !v)}
              className="flex items-center gap-2 bg-zinc-900 border border-zinc-800 hover:border-zinc-600 text-zinc-300 px-5 py-3 rounded-xl text-sm font-bold transition-all w-full sm:w-auto whitespace-nowrap"
            >
              <SlidersHorizontal size={15} />
              {SORT_OPTIONS.find(s => s.value === sortBy)?.label}
              <ChevronDown size={14} className={`transition-transform ${sortOpen ? 'rotate-180' : ''}`} />
            </button>
            <AnimatePresence>
              {sortOpen && (
                <motion.div
                  initial={{ opacity: 0, y: -8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -8 }}
                  className="absolute top-full mt-2 right-0 bg-zinc-950 border border-zinc-800 rounded-2xl overflow-hidden shadow-2xl z-50 min-w-[180px]"
                >
                  {SORT_OPTIONS.map(opt => (
                    <button
                      key={opt.value}
                      onClick={() => { setSortBy(opt.value as SortKey); setSortOpen(false); setPage(1); }}
                      className={`w-full text-left px-5 py-3.5 text-sm font-bold transition-colors hover:bg-zinc-900 ${sortBy === opt.value ? 'text-secondary' : 'text-zinc-400'}`}
                    >
                      {opt.label}
                    </button>
                  ))}
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* View mode toggle */}
          <div className="flex bg-zinc-900 border border-zinc-800 rounded-xl overflow-hidden">
            <button
              onClick={() => setViewMode('grid')}
              className={`p-3 transition-colors ${viewMode === 'grid' ? 'bg-zinc-800 text-white' : 'text-zinc-500 hover:text-zinc-300'}`}
              title="Grade"
            >
              <Grid3X3 size={16} />
            </button>
            <button
              onClick={() => setViewMode('list')}
              className={`p-3 transition-colors ${viewMode === 'list' ? 'bg-zinc-800 text-white' : 'text-zinc-500 hover:text-zinc-300'}`}
              title="Lista"
            >
              <List size={16} />
            </button>
          </div>
        </div>

        {/* Anime filter tabs */}
        <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-none">
          {animes.map(anime => (
            <button
              key={anime}
              onClick={() => { setAnimeFilter(anime); setPage(1); }}
              className={`px-4 py-2 rounded-xl text-xs font-black uppercase tracking-wider whitespace-nowrap transition-all shrink-0 ${
                animeFilter === anime
                  ? 'bg-primary text-white shadow-lg shadow-primary/30'
                  : 'bg-zinc-900 border border-zinc-800 text-zinc-500 hover:text-zinc-300 hover:border-zinc-600'
              }`}
            >
              {anime}
            </button>
          ))}
        </div>

        {/* Active filters indicator */}
        {isFiltered && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex items-center gap-3">
            <span className="text-xs text-zinc-500">{filtered.length} resultado{filtered.length !== 1 ? 's' : ''}</span>
            <button
              onClick={resetFilters}
              className="text-xs text-primary hover:text-primary-hover font-bold flex items-center gap-1 transition-colors"
            >
              <X size={12} /> Limpar filtros
            </button>
          </motion.div>
        )}
      </motion.div>

      {/* ── Grid / Lista ────────────────────────────────────── */}
      <AnimatePresence mode="wait">
        {filtered.length === 0 ? (
          <motion.div
            key="empty"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="flex flex-col items-center justify-center py-32 text-zinc-600 gap-4"
          >
            <Search size={56} className="opacity-20" />
            <p className="font-bold">Nenhum template encontrado</p>
            <button onClick={resetFilters} className="text-primary hover:underline text-sm font-bold">
              Limpar filtros
            </button>
          </motion.div>
        ) : (
          <motion.div
            key={viewMode}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className={viewMode === 'grid'
              ? 'grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5'
              : 'flex flex-col gap-4'
            }
          >
            <AnimatePresence mode="popLayout">
              {visible.map((item, index) => (
                viewMode === 'grid'
                  ? <GridCard key={item.id} item={item} index={index} />
                  : <ListCard key={item.id} item={item} />
              ))}
            </AnimatePresence>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── Load more ───────────────────────────────────────── */}
      {hasMore && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex flex-col items-center mt-12 gap-3">
          <p className="text-zinc-600 text-xs font-bold uppercase tracking-widest">
            Exibindo {visible.length} de {filtered.length}
          </p>
          <div className="w-48 h-1 bg-zinc-800 rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-primary to-secondary rounded-full transition-all duration-500"
              style={{ width: `${(visible.length / filtered.length) * 100}%` }}
            />
          </div>
          <button
            onClick={() => setPage(p => p + 1)}
            className="flex items-center gap-2 bg-zinc-900 hover:bg-zinc-800 border border-zinc-800 hover:border-primary/40 text-zinc-300 hover:text-white px-8 py-4 rounded-2xl font-bold transition-all active:scale-95 mt-2 group"
          >
            Carregar mais
            <ChevronDown size={16} className="text-zinc-500 group-hover:text-primary transition-colors" />
          </button>
        </motion.div>
      )}
    </div>
  );
}

// ─── Card em grade ─────────────────────────────────────────────────────────────
function GridCard({ item, index }: { item: typeof ALL_TEMPLATES[0]; index: number }) {
  return (
    <motion.div
      layout
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.9 }}
      transition={{ duration: 0.3, delay: Math.min(index * 0.04, 0.3) }}
      className="group relative rounded-2xl overflow-hidden glass-card p-2 border-zinc-800 hover:border-zinc-600 transition-colors"
    >
      <div className="relative aspect-video rounded-xl overflow-hidden mb-3 bg-zinc-900">
        <img src={item.img} alt={item.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 opacity-60 group-hover:opacity-100" />
        <div className="absolute top-2 left-2 bg-black/60 backdrop-blur-md px-2 py-1 rounded-md text-[10px] uppercase font-bold text-zinc-300">
          {item.anime}
        </div>
        {index === 0 && (
          <div className="absolute top-2 right-2 bg-secondary/90 backdrop-blur-md px-2 py-1 rounded-md text-[10px] uppercase font-black text-white flex items-center gap-1">
            <TrendingUp size={10} /> #1
          </div>
        )}
      </div>
      <div className="px-2 pb-2">
        <h3 className="font-bold text-zinc-200 mb-1 truncate text-sm">{item.title}</h3>
        <div className="flex justify-between items-center text-zinc-500 mb-3">
          <span className="text-xs hover:text-primary cursor-pointer transition-colors">{item.author}</span>
          <div className="flex items-center gap-3 text-xs">
            <span className="flex items-center gap-1"><Heart size={11} /> {item.likes}</span>
            <span className="flex items-center gap-1 text-secondary/80 font-bold"><Download size={11} /> {item.downloads.toLocaleString('pt-BR')}</span>
          </div>
        </div>
        <div className="flex gap-2 flex-wrap mb-3">
          {item.tags.map(tag => (
            <span key={tag} className="text-[9px] font-black uppercase tracking-wider bg-zinc-800 text-zinc-500 px-2 py-0.5 rounded">
              {tag}
            </span>
          ))}
        </div>
        <button className="w-full bg-zinc-800 hover:bg-zinc-700 text-zinc-300 py-2 rounded-lg text-xs font-bold transition-colors flex items-center justify-center gap-2">
          <Download size={14} /> Baixar .otalex
        </button>
      </div>
    </motion.div>
  );
}

// ─── Card em lista ─────────────────────────────────────────────────────────────
function ListCard({ item }: { item: typeof ALL_TEMPLATES[0] }) {
  return (
    <motion.div
      layout
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      transition={{ duration: 0.25 }}
      className="group flex items-center gap-5 glass-card p-4 rounded-2xl border-zinc-800 hover:border-zinc-600 transition-colors"
    >
      <div className="w-32 h-20 rounded-xl overflow-hidden bg-zinc-900 shrink-0">
        <img src={item.img} alt={item.title} className="w-full h-full object-cover opacity-70 group-hover:opacity-100 group-hover:scale-105 transition-all duration-500" />
      </div>
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 mb-1">
          <h3 className="font-bold text-zinc-200 truncate">{item.title}</h3>
          <span className="text-[9px] font-black uppercase tracking-wider bg-zinc-800 text-zinc-500 px-2 py-0.5 rounded shrink-0">{item.anime}</span>
        </div>
        <p className="text-zinc-500 text-xs mb-2">{item.author}</p>
        <div className="flex gap-2 flex-wrap">
          {item.tags.map(tag => (
            <span key={tag} className="text-[9px] font-bold uppercase tracking-wider bg-zinc-900 border border-zinc-800 text-zinc-600 px-2 py-0.5 rounded">
              {tag}
            </span>
          ))}
        </div>
      </div>
      <div className="flex items-center gap-6 shrink-0">
        <div className="text-center hidden sm:block">
          <p className="text-[9px] font-black text-zinc-600 uppercase tracking-widest mb-0.5">Downloads</p>
          <p className="text-white font-black">{item.downloads.toLocaleString('pt-BR')}</p>
        </div>
        <div className="text-center hidden sm:block">
          <p className="text-[9px] font-black text-zinc-600 uppercase tracking-widest mb-0.5">Curtidas</p>
          <p className="text-white font-black">{item.likes}</p>
        </div>
        <button className="bg-zinc-800 hover:bg-primary hover:text-white text-zinc-300 px-5 py-2.5 rounded-xl text-xs font-black transition-all flex items-center gap-2 whitespace-nowrap">
          <Download size={14} /> .otalex
        </button>
      </div>
    </motion.div>
  );
}
