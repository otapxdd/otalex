import { ParallaxUploader } from '../components/ParallaxUploader';
import { ArrowLeft } from 'lucide-react';
import { Link } from 'react-router-dom';

export function UploadPage() {
  return (
    <div className="min-h-screen pt-32 pb-20 px-6 container mx-auto flex flex-col items-center">
      
      <div className="absolute top-[-20%] left-[-10%] w-[50%] h-[50%] bg-primary/10 blur-[150px] rounded-full point-events-none z-0" />
      
      <div className="w-full max-w-6xl flex justify-start mb-6 relative z-10">
        <Link to="/#gallery" className="flex items-center gap-2 text-zinc-400 hover:text-white transition-colors text-sm font-medium bg-zinc-900/50 px-4 py-2 rounded-xl border border-zinc-800 backdrop-blur-md">
          <ArrowLeft size={16} /> Voltar
        </Link>
      </div>
      
      <div className="w-full max-w-6xl text-center mb-8 relative z-10">
        <h1 className="text-3xl md:text-5xl font-bold text-zinc-100 mb-4">Compartilhe na Comunidade</h1>
        <p className="text-zinc-400 max-w-2xl mx-auto">
          Faça o upload do seu arquivo de configuração `.otalex` e adicione até 3 imagens demonstrativas das suas camadas. Seus arquivos ficarão disponíveis gratuitamente para outros usuários!
        </p>
      </div>

      <div className="w-full max-w-6xl relative z-10">
        <ParallaxUploader />
      </div>
    </div>
  );
}
