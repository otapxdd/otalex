import { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { UploadCloud, File, Image as ImageIcon, X, CheckCircle, Plus } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useToast } from '../contexts/ToastContext';

export function ParallaxUploader() {
  const { error, warning } = useToast();
  const [otalexFile, setOtalexFile] = useState<File | null>(null);
  const [images, setImages] = useState<File[]>([]);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [uploaded, setUploaded] = useState(false);
  
  const otalexInputRef = useRef<HTMLInputElement>(null);
  const imageInputRef = useRef<HTMLInputElement>(null);

  const handleOtalexChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const file = e.target.files[0];
      // Checa a extensão .otalex (ou para facilitar testes locais, deixamos passar se o nome incluir otalex)
      if (file.name.toLowerCase().endsWith('.otalex') || file.name.toLowerCase().includes('otalex')) {
        setOtalexFile(file);
      } else {
        error('Selecione um arquivo de configuração válido (.otalex).');
      }
    }
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const selectedFiles = Array.from(e.target.files);
      const remainingSlots = 3 - images.length;
      
      if (selectedFiles.length > remainingSlots) {
        warning(`Máximo de 3 camadas. Somente ${remainingSlots} imagem(ns) serão adicionadas.`);
      }
      
      const allowedFiles = selectedFiles.filter(f => f.type.startsWith('image/')).slice(0, remainingSlots);
      setImages(prev => [...prev, ...allowedFiles]);
      
      // Reseta o valor para permitir selecionar o mesmo arquivo novamente se precisar
      if (imageInputRef.current) {
        imageInputRef.current.value = '';
      }
    }
  };

  const removeImage = (index: number) => {
    setImages(prev => prev.filter((_, i) => i !== index));
  };

  const handleUpload = () => {
    if (!otalexFile || images.length === 0) {
      error('Selecione o arquivo .otalex e pelo menos 1 imagem de camada.');
      return;
    }

    setIsUploading(true);
    setUploadProgress(0);

    // Simula o tempo de upload/renderização no backend
    const interval = setInterval(() => {
      setUploadProgress(prev => {
        if (prev >= 100) {
          clearInterval(interval);
          setIsUploading(false);
          setUploaded(true);
          return 100;
        }
        return prev + 5;
      });
    }, 150);
  };

  const resetUploader = () => {
    setOtalexFile(null);
    setImages([]);
    setUploadProgress(0);
    setUploaded(false);
    if (otalexInputRef.current) otalexInputRef.current.value = '';
  };

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.2 }}
      className="mt-12 glass-card p-8 border border-primary/20 relative overflow-hidden group"
    >
      <div className="absolute top-0 right-0 w-64 h-64 bg-primary/5 rounded-full blur-[80px] group-hover:bg-primary/10 transition-colors pointer-events-none" />

      <div className="flex items-center gap-3 mb-8">
        <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-primary to-secondary flex items-center justify-center p-[2px]">
          <div className="w-full h-full bg-background rounded-lg flex items-center justify-center">
            <UploadCloud size={20} className="text-secondary" />
          </div>
        </div>
        <div>
          <h2 className="text-2xl font-bold text-zinc-100">Envio de Projeto Parallax</h2>
          <p className="text-sm text-zinc-400">Anexe o projeto `.otalex` juntamente com as imagens demonstrativas da cena.</p>
        </div>
      </div>

      <AnimatePresence mode="wait">
        {!uploaded ? (
          <motion.div 
            key="upload-form"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="grid lg:grid-cols-2 gap-8 relative z-10"
          >
            {/* Area do Arquivo Otalex */}
            <div className="flex flex-col gap-4">
              <h3 className="text-sm font-semibold text-zinc-300 uppercase tracking-wider flex items-center gap-2">
                <File size={16} className="text-primary" />
                Arquivo Projeto (.otalex)
              </h3>
              
              <input 
                type="file" 
                ref={otalexInputRef} 
                onChange={handleOtalexChange} 
                className="hidden" 
                accept=".otalex" 
              />
              
              <div 
                onClick={() => otalexInputRef.current?.click()}
                className={`w-full h-32 border-2 border-dashed rounded-2xl flex flex-col items-center justify-center cursor-pointer transition-all ${
                  otalexFile 
                    ? 'border-primary/50 bg-primary/5' 
                    : 'border-zinc-700 bg-zinc-900/50 hover:border-primary/50 hover:bg-zinc-800'
                }`}
              >
                {otalexFile ? (
                  <div className="flex flex-col items-center text-center px-4">
                    <File size={32} className="text-primary mb-2" />
                    <span className="text-sm font-semibold text-zinc-200 truncate w-full max-w-[200px]">{otalexFile.name}</span>
                    <span className="text-xs text-secondary mt-1">Clique para alterar</span>
                  </div>
                ) : (
                  <div className="flex flex-col items-center text-center text-zinc-500">
                    <UploadCloud size={32} className="mb-2" />
                    <span className="text-sm font-medium">Selecione o arquivo principal</span>
                  </div>
                )}
              </div>
            </div>

            {/* Area de Imagens */}
            <div className="flex flex-col gap-4">
              <h3 className="text-sm font-semibold text-zinc-300 uppercase tracking-wider flex items-center gap-2 justify-between">
                <span className="flex items-center gap-2">
                  <ImageIcon size={16} className="text-secondary" />
                  Camadas (Images - Max 3)
                </span>
                <span className="text-xs bg-zinc-800 px-2 py-1 rounded text-zinc-400">{images.length}/3</span>
              </h3>
              
              <input 
                type="file" 
                ref={imageInputRef} 
                onChange={handleImageChange} 
                className="hidden" 
                accept="image/*" 
                multiple 
              />
              
              <div className="flex gap-3 h-32">
                {images.map((img, i) => (
                  <div key={i} className="flex-1 border border-zinc-700 rounded-2xl relative overflow-hidden bg-zinc-900 group">
                    <img src={URL.createObjectURL(img)} alt={`Layer ${i}`} className="w-full h-full object-cover opacity-60 group-hover:opacity-40 transition-opacity" />
                    <button 
                      onClick={() => removeImage(i)}
                      className="absolute top-2 right-2 p-1.5 bg-red-500/80 text-white rounded-lg opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-500"
                    >
                      <X size={14} />
                    </button>
                    <div className="absolute justify-center items-center w-full bottom-2 flex">
                      <span className="bg-zinc-950/80 text-xs px-2 py-0.5 rounded backdrop-blur-md text-zinc-300 truncate max-w-[80%]">Camada {i+1}</span>
                    </div>
                  </div>
                ))}
                
                {images.length < 3 && (
                  <div 
                    onClick={() => imageInputRef.current?.click()}
                    className={`flex-1 border-2 border-dashed border-zinc-700 bg-zinc-900/50 hover:border-secondary/50 hover:bg-zinc-800 rounded-2xl flex flex-col items-center justify-center cursor-pointer transition-all ${images.length === 0 ? 'col-span-3' : ''}`}
                    style={{ minWidth: images.length === 0 ? '100%' : 'auto' }}
                  >
                    <Plus size={24} className="text-zinc-500 mb-1" />
                    {images.length === 0 && <span className="text-xs text-zinc-500 font-medium">Adicionar Imagens</span>}
                  </div>
                )}
              </div>
            </div>

            {/* Ações */}
            <div className="lg:col-span-2 pt-4 border-t border-zinc-800/60 flex items-center justify-between">
              <span className="text-sm text-zinc-500">
                O projeto ficará disponível para todo o fórum da comunidade!
              </span>

              <div className="flex items-center gap-4">
                {isUploading && (
                  <div className="flex items-center gap-3">
                    <div className="w-32 h-2 bg-zinc-800 rounded-full overflow-hidden">
                      <motion.div 
                        className="h-full bg-gradient-to-r from-primary to-secondary"
                        initial={{ width: 0 }}
                        animate={{ width: `${uploadProgress}%` }}
                      />
                    </div>
                    <span className="text-xs font-bold text-primary">{uploadProgress}%</span>
                  </div>
                )}

                <button 
                  onClick={handleUpload}
                  disabled={isUploading || !otalexFile || images.length === 0}
                  className="bg-primary hover:bg-primary-hover disabled:opacity-50 disabled:hover:bg-primary text-white px-8 py-3 rounded-xl font-bold transition-all shadow-lg hover:shadow-[0_0_20px_rgba(139,92,246,0.5)] disabled:shadow-none flex items-center justify-center gap-2"
                >
                  {isUploading ? 'Enviando p/ Galeria...' : 'Compartilhar Projeto'}
                  {!isUploading && <UploadCloud size={18} />}
                </button>
              </div>
            </div>
          </motion.div>
        ) : (
          <motion.div
            key="upload-success"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="flex flex-col items-center justify-center py-12 relative z-10"
          >
            <div className="w-20 h-20 bg-green-500/10 rounded-full flex items-center justify-center mb-6">
              <CheckCircle size={40} className="text-green-400" />
            </div>
            <h3 className="text-2xl font-bold text-white mb-2">Projeto Compartilhado!</h3>
            <p className="text-zinc-400 mb-8 max-w-md text-center">
              Seu template parallax agora faz parte da Comunidade Otalex. Muito obrigado por engajar e disponibilizar seu talento!
            </p>
            <div className="flex gap-4">
              <button 
                onClick={resetUploader}
                className="bg-zinc-800 hover:bg-zinc-700 text-white px-6 py-2.5 rounded-xl font-medium transition-colors"
               >
                Fazer outro Upload
              </button>
              <Link 
                to="/#gallery" 
                className="bg-primary hover:bg-primary-hover flex items-center gap-2 text-white px-6 py-2.5 rounded-xl font-medium transition-colors shadow-[0_0_15px_rgba(139,92,246,0.4)]"
              >
                Ver na Galeria
              </Link>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
