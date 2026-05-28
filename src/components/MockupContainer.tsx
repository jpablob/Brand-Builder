import { motion, AnimatePresence } from 'motion/react';
import { 
  Sparkles, 
  Download, 
  RefreshCw, 
  FileText, 
  Smartphone, 
  ChevronRight, 
  AlertCircle,
  Camera
} from 'lucide-react';
import { CampaignMedium } from '../types';

interface MockupContainerProps {
  medium: CampaignMedium;
  imageUrl: string | null;
  loading: boolean;
  title: string;
  creativeDescription: string;
  onGenerate: () => void;
  brandName: string;
  error?: string | null;
}

export function MockupContainer({
  medium,
  imageUrl,
  loading,
  title,
  creativeDescription,
  onGenerate,
  brandName,
  error,
}: MockupContainerProps) {
  
  // Truncate or design brand title
  const cleanBrand = brandName ? brandName.toUpperCase() : 'YOUR BRAND';

  const downloadImage = () => {
    if (!imageUrl) return;
    const link = document.createElement('a');
    link.href = imageUrl;
    link.download = `${cleanBrand.toLowerCase().replace(/\s+/g, '_')}_${medium}_ad.png`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div id={`mockup-card-${medium}`} className="relative bg-slate-900/40 border border-slate-800 rounded-3xl overflow-hidden shadow-2xl flex flex-col h-full group hover:border-slate-700 transition-all duration-300">
      
      {/* Container Header */}
      <div className="px-5 py-4 border-b border-slate-800 bg-black/40 backdrop-blur-md flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <div className="p-1.5 rounded-xl bg-slate-850 text-yellow-400">
            {medium === 'billboard' && <span className="text-xs font-bold font-mono tracking-widest px-1">16:9</span>}
            {medium === 'newspaper' && <FileText className="w-4 h-4" />}
            {medium === 'social' && <Smartphone className="w-4 h-4" />}
          </div>
          <div>
            <span className="text-[10px] text-slate-500 uppercase font-mono tracking-wider block">Medium Configuration</span>
            <h4 className="text-xs font-bold text-slate-200 uppercase tracking-wide">
              {medium === 'billboard' ? 'Grand Plaza Billboard' : medium === 'newspaper' ? 'Vintage Print Press Ad' : 'Social Media Feed Post'}
            </h4>
          </div>
        </div>

        {imageUrl && !loading && (
          <button
            onClick={downloadImage}
            title="Download image asset"
            className="flex items-center justify-center p-2 rounded-xl bg-slate-800/80 text-slate-350 hover:bg-slate-700 hover:text-white transition-all cursor-pointer border border-slate-700/50"
          >
            <Download className="w-3.5 h-3.5" />
          </button>
        )}
      </div>

      {/* Creative Concept Blurb */}
      <div className="p-4 bg-slate-950/20 text-xs text-slate-350 italic border-b border-slate-800/80 leading-relaxed font-sans">
        <span className="font-mono not-italic text-yellow-400 font-bold mr-1.5 uppercase text-[10px]">{title ? `"${title}"` : 'Headline Pending'}:</span>
        {creativeDescription || 'Waiting for product briefing to formulate the placement layout...'}
      </div>

      {/* Mockup Canvas */}
      <div className="relative flex-1 bg-slate-950/40 flex items-center justify-center p-5 min-h-[350px] overflow-hidden">
        
        <AnimatePresence mode="wait">
          {loading ? (
            <motion.div
              key="loading"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 z-10 bg-[#0A0A0C]/95 flex flex-col items-center justify-center p-6 text-center"
            >
              <div className="relative">
                <div className="w-16 h-16 rounded-full border border-dashed border-yellow-400 animate-spin" />
                <div className="absolute inset-0 flex items-center justify-center">
                  <Sparkles className="w-6 h-6 text-yellow-400 animate-pulse" />
                </div>
              </div>
              <p className="mt-5 text-sm font-bold text-slate-200 tracking-tight font-sans">Nano-Banana Imaginator</p>
              <p className="mt-1.5 text-xs text-slate-500 max-w-[220px] leading-relaxed font-mono">
                [EXCLUDING PEOPLE] Assembling layout geometries...
              </p>
            </motion.div>
          ) : error ? (
            <motion.div
              key="error"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="flex flex-col items-center justify-center text-center p-6 bg-yellow-400/5 rounded-3xl border border-yellow-400/20 max-w-[305px] h-full"
            >
              <div className="w-12 h-12 rounded-2xl bg-yellow-400/10 border border-yellow-400/20 flex items-center justify-center text-yellow-400 mb-3 animate-pulse">
                <AlertCircle className="w-5 h-5" />
              </div>
              <h5 className="text-yellow-400 text-xs font-bold uppercase tracking-widest font-mono">Quota Threshold Met</h5>
              <p className="text-slate-350 text-[11px] mt-2.5 leading-relaxed font-sans font-medium px-1">
                {error.toLowerCase().includes('quota') || error.toLowerCase().includes('exceeded') || error.includes('429') ? (
                  <span>
                    Your Free-Tier key exhausted its image frames. Please switch your API key to a <strong className="text-yellow-400">paid tier or workspace key</strong> (Settings &gt; Secrets menu) to unlock 4K renders.
                  </span>
                ) : (
                  <span>{error}</span>
                )}
              </p>
              <button
                onClick={onGenerate}
                className="mt-5 flex items-center gap-1.5 px-4 py-2 bg-slate-900 border border-slate-800 text-slate-300 hover:text-white rounded-xl text-xs font-bold uppercase tracking-wider hover:bg-slate-850 hover:border-slate-705 transition-all cursor-pointer shadow-sm"
              >
                <RefreshCw className="w-3.5 h-3.5" />
                <span>Retry Imaginator</span>
              </button>
            </motion.div>
          ) : !imageUrl ? (
            <motion.div
              key="empty"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="flex flex-col items-center justify-center text-center p-6"
            >
              <div className="w-14 h-14 rounded-2xl bg-slate-900 border border-slate-800 flex items-center justify-center text-slate-500 mb-3.5 group-hover:border-yellow-400/30 transition-all">
                <Camera className="w-6 h-6 text-slate-400 group-hover:text-yellow-400 transition-all" />
              </div>
              <h5 className="text-slate-300 text-sm font-semibold tracking-wide uppercase font-mono text-[11px]">No Visual Rendered</h5>
              <p className="text-slate-400 text-xs px-4 mt-2 leading-relaxed max-w-[260px]">
                Describe your brand product and trigger Nano-Banana configuration.
              </p>
              <button
                onClick={onGenerate}
                disabled={!title}
                className={`mt-5 inline-flex items-center gap-1.5 px-4 py-2 text-xs font-bold uppercase rounded-xl transition-all duration-200 cursor-pointer ${
                  title 
                    ? 'bg-yellow-400 hover:bg-yellow-350 text-black shadow-md shadow-yellow-400/10' 
                    : 'bg-slate-800 text-slate-500 cursor-not-allowed border border-slate-700/50'
                }`}
              >
                <span>Imagine Visual</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </button>
            </motion.div>
          ) : (
            <motion.div
              key="mockup"
              initial={{ opacity: 0, scale: 0.98 }}
              animate={{ opacity: 1, scale: 1 }}
              className="w-full h-full flex items-center justify-center"
            >
              {/* BILLBOARD FRAME */}
              {medium === 'billboard' && (
                <div className="w-full max-w-lg flex flex-col items-center">
                  {/* Outer Scene Environment */}
                  <div className="relative w-full aspect-[16/9] bg-gradient-to-b from-[#111115] to-[#252530] p-3 rounded-2xl shadow-2xl border border-slate-800">
                    <div className="absolute top-2 left-3 flex gap-1">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                      <span className="w-1.5 h-1.5 rounded-full bg-yellow-400 animate-pulse" />
                    </div>
                    {/* Billboard Frame */}
                    <div className="w-full h-full bg-slate-950 border-[5px] border-slate-900 rounded-sm overflow-hidden relative shadow-inner">
                      <img
                        src={imageUrl}
                        alt="Plaza billboard mockup"
                        className="w-full h-full object-cover"
                        referrerPolicy="no-referrer"
                      />
                      {/* Text Tag or Logo integrated on mockup overlay */}
                      <div className="absolute bottom-1 right-1 px-1.5 py-0.5 bg-black/80 font-mono text-[8px] text-yellow-400 font-bold">
                        {cleanBrand} // 16:9
                      </div>
                    </div>
                  </div>
                  {/* Metal structure/posts supporting the billboard */}
                  <div className="flex justify-between w-[80%] px-10">
                    <div className="w-2.5 h-10 bg-gradient-to-r from-slate-800 to-slate-900" />
                    <div className="w-2.5 h-10 bg-gradient-to-r from-slate-800 to-slate-900" />
                  </div>
                  {/* Base cement foundation */}
                  <div className="w-full h-2 rounded bg-slate-850 shadow" />
                </div>
              )}

              {/* VINTAGE NEWSPAPER CLIP */}
              {medium === 'newspaper' && (
                <div className="w-full max-w-sm rounded-2xl bg-[#F1F1E6] p-4.5 text-[#2b2b2a] shadow-xl border border-slate-800 font-serif relative">
                  {/* Header title */}
                  <div className="flex justify-between items-end border-b-2 border-black pb-1 mb-2 font-serif">
                    <span className="text-[10px] uppercase tracking-wider font-extrabold">Volume XCIII</span>
                    <span className="font-bold text-center tracking-tighter text-xs uppercase">THE CHRONICLE</span>
                    <span className="text-[10px] uppercase font-extrabold">EST. 1894</span>
                  </div>
                  
                  {/* Editorial Layout with centered Ad */}
                  <div className="grid grid-cols-4 gap-2.5 text-[8px] font-serif leading-tight">
                    <div className="col-span-1 border-r border-black/30 pr-1 text-justify">
                      <p className="font-extrabold mb-1 uppercase tracking-wide">DESIGN REVIEW</p>
                      <p className="opacity-90 leading-snug">Industrial blueprints indicate supreme fidelity alignment. Zero human entities present in generated frames.</p>
                    </div>
                    
                    {/* Centered Black & White Ad Box */}
                    <div className="col-span-3 flex flex-col items-center p-1.5 bg-white border border-black rounded-sm relative">
                      <span className="absolute top-0.5 right-1 text-[6.5px] tracking-widest font-sans font-black text-black/50">ADVERTISEMENT</span>
                      <div className="font-sans font-bold text-center my-1 tracking-tight uppercase text-[9px] border-b border-black/20 w-full pb-0.5">
                        {title || 'EXQUISITE QUALITY'}
                      </div>
                      
                      {/* B&W Newspaper Ad Image */}
                      <div className="w-full aspect-[4/3] relative rounded bg-zinc-400 overflow-hidden mix-blend-multiply grayscale contrast-125 saturate-50">
                        <img
                          src={imageUrl}
                          alt="Vintage newspaper ad catalog"
                          className="w-full h-full object-cover"
                          referrerPolicy="no-referrer"
                        />
                      </div>
                      <div className="text-[8px] text-center italic mt-2 font-sans font-bold text-slate-800 leading-tight">
                        "For those who cherish raw mastercraft. Discover {cleanBrand} today."
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* SOCIAL MEDIA FEED POST */}
              {medium === 'social' && (
                <div className="w-full max-w-sm rounded-2xl overflow-hidden bg-slate-900/60 border border-slate-800 shadow-2xl flex flex-col text-slate-200">
                  {/* Feed Header */}
                  <div className="p-3.5 flex items-center justify-between border-b border-slate-800">
                    <div className="flex items-center gap-2">
                      <div className="w-7 h-7 rounded-xl bg-gradient-to-tr from-yellow-400 to-amber-500 flex items-center justify-center font-bold text-[10px] text-black">
                        {cleanBrand.slice(0, 2)}
                      </div>
                      <div>
                        <span className="text-xs font-semibold text-slate-100 block tracking-tight">@{cleanBrand.toLowerCase().replace(/\s+/g, '')}</span>
                        <span className="text-[9px] text-slate-500 block -mt-0.5">Sponsored • Premium Feed</span>
                      </div>
                    </div>
                    {/* Three Dots Menu */}
                    <div className="flex gap-1 pr-1">
                      <span className="w-1 h-1 rounded-full bg-slate-500" />
                      <span className="w-1 h-1 rounded-full bg-slate-500" />
                      <span className="w-1 h-1 rounded-full bg-slate-500" />
                    </div>
                  </div>

                  {/* Primary 1:1 Image */}
                  <div className="w-full aspect-square bg-[#0A0A0C] overflow-hidden">
                    <img
                      src={imageUrl}
                      alt="Social app visual"
                      className="w-full h-full object-cover"
                      referrerPolicy="no-referrer"
                    />
                  </div>

                  {/* Interactions Footer */}
                  <div className="p-3.5 text-xs bg-slate-950/40">
                    <div className="flex justify-between items-center mb-2">
                      <div className="flex gap-3 text-slate-350">
                        <span className="hover:text-yellow-405 transition-colors cursor-pointer text-sm">❤️</span>
                        <span className="hover:text-yellow-405 transition-colors cursor-pointer text-sm">💬</span>
                        <span className="hover:text-yellow-405 transition-colors cursor-pointer text-sm">✈️</span>
                      </div>
                      <span className="hover:text-yellow-405 transition-colors cursor-pointer text-sm">🔖</span>
                    </div>
                    
                    {/* Comments & Captions */}
                    <div className="space-y-1">
                      <p className="font-extrabold text-slate-200 text-[11px]">8,394 likes</p>
                      <p className="text-slate-350 leading-snug text-[11px]">
                        <span className="font-bold text-yellow-400 mr-1.5">{cleanBrand.toLowerCase().replace(/\s+/g, '')}</span>
                        {title || 'Immerse in fine detail.'} Designed thoughtfully, built for life. #minimalism #nopeople
                      </p>
                    </div>
                  </div>
                </div>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Footer controls */}
      {imageUrl && !loading && (
        <div className="px-5 py-3 border-t border-slate-800 bg-[#0A0A0C]/50 flex justify-end gap-2">
          <button
            onClick={onGenerate}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-slate-850 bg-slate-900 text-slate-300 hover:text-white hover:bg-slate-850 hover:border-slate-700 transition-all text-xs cursor-pointer"
          >
            <RefreshCw className="w-3 h-3" />
            <span>Regenerate Visual</span>
          </button>
        </div>
      )}
    </div>
  );
}
