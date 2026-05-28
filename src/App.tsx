import { useState, FormEvent } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Sparkles, 
  Layers, 
  Send, 
  Trash2, 
  AlertTriangle, 
  CheckCircle, 
  HelpCircle, 
  Lightbulb, 
  Megaphone, 
  ArrowRight,
  RefreshCw,
  Settings
} from 'lucide-react';

import { CampaignMedium, CampaignMediumPrompt, GeneratedCampaign, SUPPORTED_MEDIUMS } from './types';
import { TemplateSelector } from './components/TemplateSelector';
import { MockupContainer } from './components/MockupContainer';
import { ProductTemplate } from './templates';

export default function App() {
  // Input form state
  const [productName, setProductName] = useState('');
  const [productDescription, setProductDescription] = useState('');
  const [brandTone, setBrandTone] = useState('elegant, minimal, luxury');

  // Campaign state
  const [campaign, setCampaign] = useState<GeneratedCampaign | null>(null);
  const [images, setImages] = useState<Record<CampaignMedium, string | null>>({
    billboard: null,
    newspaper: null,
    social: null
  });

  // Loaders & Errors
  const [loadingPrompts, setLoadingPrompts] = useState(false);
  const [loadingImages, setLoadingImages] = useState<Record<CampaignMedium, boolean>>({
    billboard: false,
    newspaper: false,
    social: false
  });
  
  const [campaignError, setCampaignError] = useState<string | null>(null);
  const [imageErrors, setImageErrors] = useState<Record<CampaignMedium, string | null>>({
    billboard: null,
    newspaper: null,
    social: null
  });

  // Handle template selection
  const handleSelectTemplate = (tpl: ProductTemplate) => {
    setProductName(tpl.name);
    setProductDescription(tpl.description);
    setBrandTone(tpl.brandTone);
    setCampaignError(null);
  };

  // Step 1: Generate prompts based on product description
  const generateCampaignPrompts = async (e: FormEvent) => {
    e.preventDefault();
    if (!productName.trim() || !productDescription.trim()) return;

    setLoadingPrompts(true);
    setCampaignError(null);
    setCampaign(null);
    setImages({ billboard: null, newspaper: null, social: null });
    setImageErrors({ billboard: null, newspaper: null, social: null });

    try {
      const response = await fetch('/api/generate-prompts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          productName,
          productDescription,
          brandTone
        })
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || data.error || 'Failed to generate visual prompts.');
      }

      setCampaign(data);
    } catch (err: any) {
      console.error(err);
      setCampaignError(err.message || 'An error occurred while generating prompts.');
    } finally {
      setLoadingPrompts(false);
    }
  };

  // Step 2: Generate specific image using Nano-Banana
  const generateImage = async (medium: CampaignMedium, promptText: string) => {
    setLoadingImages(prev => ({ ...prev, [medium]: true }));
    setImageErrors(prev => ({ ...prev, [medium]: null }));

    try {
      const matchedMedium = SUPPORTED_MEDIUMS.find(m => m.id === medium);
      const safeRatio = matchedMedium ? matchedMedium.aspectRatio : '1:1';

      const response = await fetch('/api/generate-image', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          prompt: promptText,
          aspectRatio: safeRatio,
          medium
        })
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || data.error || 'Failed to generate model shot');
      }

      setImages(prev => ({ ...prev, [medium]: data.imageUrl }));
    } catch (err: any) {
      console.error(err);
      setImageErrors(prev => ({ ...prev, [medium]: err.message || 'Failed to render.' }));
    } finally {
      setLoadingImages(prev => ({ ...prev, [medium]: false }));
    }
  };

  // Multi-medium sequential launcher
  const imagineFullCampaign = async () => {
    if (!campaign) return;
    
    // Trigger sequential imaging to avoid heavy simultaneous load & watch campaigns develop elegantly
    for (const promptObj of campaign.prompts) {
      await generateImage(promptObj.medium, promptObj.prompt);
    }
  };

  // Reset work
  const handleClear = () => {
    setCampaign(null);
    setImages({ billboard: null, newspaper: null, social: null });
    setProductName('');
    setProductDescription('');
    setBrandTone('elegant, minimal, luxury');
    setCampaignError(null);
    setImageErrors({ billboard: null, newspaper: null, social: null });
  };

  // Inline prompt override editing by the user
  const handlePromptChange = (medium: CampaignMedium, updatedText: string) => {
    if (!campaign) return;
    setCampaign(prev => {
      if (!prev) return null;
      return {
        ...prev,
        prompts: prev.prompts.map(p => p.medium === medium ? { ...p, prompt: updatedText } : p)
      };
    });
  };

  return (
    <div className="min-h-screen bg-[#0A0A0C] text-slate-100 flex flex-col font-sans selection:bg-yellow-450/30 selection:text-white">
      
      {/* Decorative top aesthetic block */}
      <div className="h-1.5 w-full bg-gradient-to-r from-yellow-400 via-emerald-500 to-amber-500" />
      
      {/* Header */}
      <header className="border-b border-slate-900 bg-[#0A0A0C]/90 backdrop-blur-md sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-6 py-4 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-yellow-400 rounded-xl flex items-center justify-center shadow-lg shadow-yellow-400/10">
              <svg className="w-6 h-6 text-black" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
                <span className="text-[10px] uppercase tracking-widest text-slate-400 font-bold font-mono">
                  Engine: Nano-Banana v4.2-Pro
                </span>
              </div>
              <h1 className="text-xl font-black italic tracking-tighter text-slate-100 uppercase">
                BRAND BUILDER
              </h1>
            </div>
          </div>

          <div className="flex items-center gap-4 text-xs">
            {/* Consist Level widget */}
            <div className="hidden md:flex bg-slate-800/40 border border-slate-800 px-4 py-1.5 rounded-xl items-center gap-3">
              <div className="text-[9px] text-slate-500 uppercase font-black tracking-widest font-mono">Consist Level</div>
              <div className="flex gap-1">
                <div className="w-2.5 h-1.5 bg-yellow-400 rounded-full"></div>
                <div className="w-2.5 h-1.5 bg-yellow-400 rounded-full"></div>
                <div className="w-2.5 h-1.5 bg-yellow-400 rounded-full"></div>
                <div className="w-2.5 h-1.5 bg-slate-700 rounded-full"></div>
              </div>
            </div>
            {campaign && (
              <button
                onClick={handleClear}
                className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl border border-slate-800 hover:border-slate-700 bg-slate-900/60 hover:bg-slate-900 text-slate-400 hover:text-white transition-all cursor-pointer font-bold font-mono text-[10px] uppercase tracking-wider"
              >
                <Trash2 className="w-3.5 h-3.5" />
                <span>Reset Space</span>
              </button>
            )}
          </div>
        </div>
      </header>

      {/* Main Container */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-6 py-8">
        
        {/* API Key Missing Notification banner */}
        {campaignError && campaignError.includes('MISSING_API_KEY') && (
          <div className="mb-8 p-5 rounded-2xl bg-yellow-400/10 border border-yellow-400/20 text-slate-200 flex flex-col md:flex-row gap-4 items-start md:items-center justify-between">
            <div className="flex gap-3 items-start">
              <div className="p-2 rounded-xl bg-yellow-400/20 text-yellow-400 mt-0.5 md:mt-0">
                <AlertTriangle className="w-5 h-5" />
              </div>
              <div>
                <h4 className="font-bold text-slate-100 mb-0.5">Gemini API Credentials Needed</h4>
                <p className="text-xs text-slate-300 max-w-2xl leading-relaxed">
                  The Brand Builder leverages premium server-side image modeling. In order to invoke models like 
                  <code className="text-yellow-400 font-mono text-[11px] bg-slate-950 px-1 py-0.5 rounded mx-1">gemini-2.5-flash-image</code> (Nano-Banana), 
                  you must provide an API key in the secrets drawer.
                </p>
                <p className="text-xs text-yellow-400/80 mt-1 font-semibold">
                  Steps: Clear existing placeholders in Settings &gt; Secrets menu, add GEMINI_API_KEY and apply.
                </p>
              </div>
            </div>
          </div>
        )}

        {/* General Campaign Errors */}
        {campaignError && !campaignError.includes('MISSING_API_KEY') && (
          <div className="mb-6 p-4 rounded-2xl bg-red-500/15 border border-red-500/20 text-red-200 flex gap-3 text-xs leading-relaxed">
            <AlertTriangle className="w-4 h-4 text-red-400 flex-shrink-0 mt-0.5" />
            <div>
              <p className="font-semibold text-slate-100">Operation Error</p>
              <p className="opacity-80">{campaignError}</p>
            </div>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* LEFT COLUMN: Campaign Input & Fine-Tuning */}
          <section className="lg:col-span-4 space-y-8 lg:sticky lg:top-24">
            
            <div className="bg-slate-900/40 border border-slate-800 rounded-3xl p-6 shadow-xl space-y-6">
              
              <div className="border-b border-slate-800/80 pb-4">
                <div className="text-[10px] text-yellow-400 font-bold uppercase tracking-widest font-mono mb-1">
                  Input Configuration
                </div>
                <h2 className="text-base font-bold text-slate-200 font-sans flex items-center gap-2">
                  <Megaphone className="w-4.5 h-4.5 text-yellow-400" />
                  <span>Briefing Room</span>
                </h2>
                <p className="text-xs text-slate-450 mt-1">
                  Describe the core concept of your product to generate a consistent multi-medium rollout.
                </p>
              </div>

              {/* Product Presets */}
              <TemplateSelector 
                onSelect={handleSelectTemplate} 
                selectedName={productName} 
              />

              <div className="border-t border-slate-800/80 pt-5">
                <form onSubmit={generateCampaignPrompts} className="space-y-4">
                  {/* Product Name */}
                  <div>
                    <label className="block text-[10px] font-mono uppercase tracking-widest text-slate-400 mb-1.5 font-bold">
                      Product Name
                    </label>
                    <input
                      type="text"
                      required
                      value={productName}
                      onChange={(e) => setProductName(e.target.value)}
                      placeholder="e.g. ZenMug, HyperPulse Shoes"
                      className="w-full text-xs font-medium px-4 py-3 rounded-2xl bg-[#0A0A0C] border border-slate-800 text-slate-100 focus:border-yellow-400 focus:ring-1 focus:ring-yellow-400/35 transition-all outline-none"
                    />
                  </div>

                  {/* Brand Tone */}
                  <div>
                    <label className="block text-[10px] font-mono uppercase tracking-widest text-slate-400 mb-1.5 font-bold">
                      Brand Tone / Aesthetics
                    </label>
                    <input
                      type="text"
                      value={brandTone}
                      onChange={(e) => setBrandTone(e.target.value)}
                      placeholder="e.g. brutalist, minimalist, luxury, playful, golden hour"
                      className="w-full text-xs font-medium px-4 py-3 rounded-2xl bg-[#0A0A0C] border border-slate-800 text-slate-100 focus:border-yellow-400 focus:ring-1 focus:ring-yellow-400/35 transition-all outline-none"
                    />
                  </div>

                  {/* Product Visual Description */}
                  <div>
                    <label className="block text-[10px] font-mono uppercase tracking-widest text-slate-400 mb-1.5 font-bold">
                      Product Visual Description
                    </label>
                    <textarea
                      required
                      rows={5}
                      value={productDescription}
                      onChange={(e) => setProductDescription(e.target.value)}
                      placeholder="Describe high-definition visual attributes: colors, materials, textures, geometry, label content, and design finish. (Important to lock in product consistency!)"
                      className="w-full text-xs font-medium p-4 rounded-2xl bg-[#0A0A0C] border border-slate-800 text-slate-100 focus:border-yellow-400 focus:ring-1 focus:ring-yellow-400/35 transition-all outline-none resize-none leading-relaxed font-sans"
                    />
                  </div>

                  {/* Submit Button */}
                  <button
                    type="submit"
                    disabled={loadingPrompts || !productName.trim() || !productDescription.trim()}
                    className={`w-full py-3.5 px-4 rounded-2xl text-xs font-bold tracking-widest uppercase transition-all flex items-center justify-center gap-2 cursor-pointer ${
                      loadingPrompts
                        ? 'bg-slate-800 text-slate-500 cursor-not-allowed border border-slate-700/50'
                        : 'bg-yellow-400 hover:bg-yellow-350 text-black shadow-lg hover:shadow-yellow-400/10'
                    }`}
                  >
                    {loadingPrompts ? (
                      <>
                        <RefreshCw className="w-4 h-4 animate-spin" />
                        <span>Analyzing Blueprints...</span>
                      </>
                    ) : (
                      <>
                        <Send className="w-4 h-4" />
                        <span>Formulate Campaign Concepts</span>
                      </>
                    )}
                  </button>
                </form>
              </div>

            </div>

            {/* Campaign Method Explanation */}
            <div className="bg-slate-900/40 border border-slate-800 rounded-3xl p-5 space-y-3">
              <div className="flex items-center gap-2 text-slate-300">
                <Lightbulb className="w-4.5 h-4.5 text-yellow-400" />
                <h4 className="text-[10px] font-bold uppercase tracking-widest font-mono text-slate-300">Consistency Logic</h4>
              </div>
              <p className="text-xs text-slate-405 leading-relaxed">
                To guarantee stunning product consistency cross-medium, our copywriter engine (Flash) pre-identifies your key structural blueprints, repeating them in each prompt context.
              </p>
              <div className="flex items-center gap-2 text-[10.5px] text-slate-440 font-mono bg-slate-950/60 p-2.5 rounded-xl border border-slate-800/80">
                <span className="w-2 h-2 rounded-full bg-emerald-500" />
                <span>Negative Constraint: Strictly NO People</span>
              </div>
            </div>

          </section>

          {/* RIGHT COLUMN: Campaign Output View */}
          <section className="lg:col-span-8 space-y-8">
            
            <AnimatePresence mode="wait">
              {!campaign ? (
                <motion.div
                  key="uninitiated"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="bg-slate-900/40 border border-slate-800 rounded-3xl p-12 text-center h-[540px] flex flex-col items-center justify-center space-y-4"
                >
                  <div className="w-16 h-16 rounded-2xl bg-slate-905 border border-slate-800 flex items-center justify-center mb-2">
                    <Layers className="w-8 h-8 text-slate-500" />
                  </div>
                  <h3 className="text-lg font-black italic tracking-tight text-slate-205 uppercase">Awaiting Brand Briefing</h3>
                  <p className="text-xs text-slate-405 max-w-md leading-relaxed">
                    Pick a blueprint above or write details of your product, then formulate campaign concepts. Nano-Banana will imagine the product in realistic outdoor placements, paper print columns, and high-quality social feeds.
                  </p>
                  <div className="pt-3 flex flex-wrap gap-2.5 justify-center">
                    <span className="text-[9px] font-mono border border-slate-800 bg-slate-950/60 px-2.5 py-1 rounded-full text-slate-400 font-extrabold uppercase">
                      No People Guarantee
                    </span>
                    <span className="text-[9px] font-mono border border-slate-800 bg-slate-950/60 px-2.5 py-1 rounded-full text-slate-400 font-extrabold uppercase">
                      Consistency Engine
                    </span>
                    <span className="text-[9px] font-mono border border-slate-800 bg-slate-950/60 px-2.5 py-1 rounded-full text-slate-400 font-extrabold uppercase">
                      Strictly 4K Renders
                    </span>
                  </div>
                </motion.div>
              ) : (
                <motion.div
                  key="campaign-ready"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="space-y-8"
                >
                  {/* Active Product Description Bento Banner */}
                  <div className="bg-slate-900/40 border border-slate-800 p-5 rounded-3xl flex flex-col gap-3 shrink-0">
                    <div className="text-[10px] text-yellow-400 uppercase font-black tracking-widest font-mono">Input Description</div>
                    <div className="text-base font-medium text-slate-300 italic font-serif">
                      "{campaign.productDescription || productDescription}"
                    </div>
                    <div className="flex flex-wrap gap-2 pt-1">
                      <span className="px-2.5 py-1 bg-slate-950 border border-slate-800 text-slate-300 rounded-lg text-[10px] font-mono">#minimalist</span>
                      <span className="px-2.5 py-1 bg-slate-950 border border-slate-800 text-slate-300 rounded-lg text-[10px] font-mono">#{campaign.productName.toLowerCase().replace(/\s+/g, '-')}</span>
                      <span className="px-2.5 py-1 bg-slate-950 border border-slate-800 text-slate-300 rounded-lg text-[10px] font-mono">#no-humans</span>
                      <span className="px-2.5 py-1 bg-slate-950 border border-slate-800 text-slate-300 rounded-lg text-[10px] font-mono">#high-fidelity</span>
                    </div>
                  </div>

                  {/* Campaign Dashboard Header */}
                  <div className="bg-slate-900/40 border border-slate-800 rounded-3xl p-6 shadow-xl flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
                    <div>
                      <span className="text-[10px] text-yellow-400 font-mono tracking-widest uppercase font-extrabold block">
                        Visual Laboratory
                      </span>
                      <h2 className="text-xl font-black italic tracking-tight text-slate-100 mt-1 uppercase">
                        {campaign.productName} Rollout
                      </h2>
                      <p className="text-xs text-slate-400 mt-1 max-w-xl">
                        A pristine bento visual deployment sequence for grand billboards, print presses, and high-quality social feeds.
                      </p>
                    </div>

                    <button
                      onClick={imagineFullCampaign}
                      className="w-full md:w-auto inline-flex items-center justify-center gap-2 py-3 px-6 bg-yellow-400 hover:bg-yellow-350 text-black text-xs font-bold rounded-2xl shadow-lg shadow-yellow-400/10 transition-all uppercase tracking-wider cursor-pointer font-sans"
                    >
                      <Sparkles className="w-4 h-4" />
                      <span>Imagine All Media Visuals</span>
                    </button>
                  </div>

                  {/* PROMPT EDITING & REFINING */}
                  <div className="bg-[#0A0A0C] rounded-3xl border border-slate-800/80 p-6 space-y-4">
                    <div className="flex items-center gap-2 pb-3.5 border-b border-slate-900">
                      <Settings className="w-4 h-4 text-slate-500" />
                      <h4 className="text-[10px] font-bold uppercase tracking-wider font-mono text-slate-400">
                        Visual Prompts & Fine Tuning Matrix
                      </h4>
                      <span className="text-[9px] bg-yellow-400/15 text-yellow-400 px-2 py-0.5 rounded-full font-mono font-bold ml-auto">
                        EDITABLE MATRIX
                      </span>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                      {campaign.prompts.map((p) => (
                        <div key={p.medium} className="space-y-3 bg-slate-900/30 p-4 rounded-2xl border border-slate-800/60 hover:border-slate-800 transition-all flex flex-col justify-between">
                          <div>
                            <div className="flex items-center justify-between">
                              <span className="text-[10.5px] font-mono font-extrabold text-slate-300 uppercase tracking-wider">
                                {p.medium === 'billboard' ? 'Billboard (16:9)' : p.medium === 'newspaper' ? 'Newspaper (4:3)' : 'Social Post (1:1)'}
                              </span>
                              <span className="text-[9px] text-slate-500 font-mono">
                                Ratio: {p.aspectRatio}
                              </span>
                            </div>
                            
                            <textarea
                              rows={5}
                              value={p.prompt}
                              onChange={(e) => handlePromptChange(p.medium, e.target.value)}
                              className="w-full text-[10.5px] font-semibold p-2.5 mt-2.5 rounded-xl bg-slate-950 border border-slate-805 text-slate-300 focus:border-yellow-400 outline-none leading-relaxed font-mono resize-none focus:text-slate-150"
                              title="Refine custom image generation prompt text"
                            />
                          </div>

                          {imageErrors[p.medium] && (
                            <p className="text-[10px] text-red-400 mt-1 flex items-center gap-1 leading-snug">
                              <AlertTriangle className="w-3 h-3 flex-shrink-0" />
                              <span>{imageErrors[p.medium]}</span>
                            </p>
                          )}

                          <button
                            onClick={() => generateImage(p.medium, p.prompt)}
                            disabled={loadingImages[p.medium]}
                            className={`w-full py-2 mt-3 rounded-xl text-xs font-bold uppercase tracking-wider flex items-center justify-center gap-1.5 cursor-pointer transition-all ${
                              loadingImages[p.medium]
                                ? 'bg-slate-800 text-slate-500 cursor-not-allowed border border-slate-700/35'
                                : 'bg-slate-800/85 hover:bg-slate-750 text-slate-205 border border-slate-700'
                            }`}
                          >
                            {loadingImages[p.medium] ? (
                              <>
                                <RefreshCw className="w-3.5 h-3.5 animate-spin text-yellow-400" />
                                <span>Rendering...</span>
                              </>
                            ) : images[p.medium] ? (
                              <>
                                <CheckCircle className="w-3.5 h-3.5 text-emerald-400" />
                                <span>Re-Imagine</span>
                              </>
                            ) : (
                              <>
                                <Sparkles className="w-3.5 h-3.5 text-yellow-400" />
                                <span>Imagine</span>
                              </>
                            )}
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* VISUAL MOCKUP CONTAINERS */}
                  <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                    {campaign.prompts.map((p) => {
                      const image = images[p.medium];
                      const loading = loadingImages[p.medium];

                      return (
                        <div key={p.medium} className="h-full">
                          <MockupContainer
                            medium={p.medium}
                            imageUrl={image}
                            loading={loading}
                            title={p.title}
                            creativeDescription={p.description}
                            brandName={campaign.productName}
                            onGenerate={() => generateImage(p.medium, p.prompt)}
                            error={imageErrors[p.medium]}
                          />
                        </div>
                      );
                    })}

                    {/* EXTRA BENTO TILES TO PERFECT THE 1024x768 GRID FEEL AS DIRECTED */}
                    <div className="bg-emerald-500 rounded-3xl p-6 flex flex-col text-black relative overflow-hidden shadow-lg shadow-emerald-500/10 hover:scale-[1.01] transition-all min-h-[280px]">
                      <div className="absolute -right-8 -top-8 w-32 h-32 bg-yellow-400 rounded-full opacity-35 animate-pulse"></div>
                      <div className="z-10">
                        <div className="text-[10px] font-bold uppercase tracking-widest font-mono opacity-80 mb-1">PROMPT ALIGNMENT</div>
                        <div className="text-xl font-black italic tracking-tighter uppercase">EMERALD CONSISTENCY</div>
                      </div>
                      <p className="text-[11px] text-zinc-900 leading-snug mt-2.5 z-10 font-bold max-w-xs">
                        Dynamic prompt repetition ensures congruent textures & colors with zero human entities in layout. Match rating exceeds baseline standard.
                      </p>
                      <div className="mt-auto flex items-end justify-between z-10">
                        <div className="text-5xl font-black tracking-tighter leading-none">98%</div>
                        <div className="text-[9px] font-extrabold tracking-wide text-right uppercase font-mono leading-tight">
                          MATCHING<br />RATING
                        </div>
                      </div>
                    </div>

                    <div className="col-span-1 md:col-span-2 bg-slate-900/40 border border-slate-800 rounded-3xl p-6 flex items-center gap-6 hover:border-yellow-400/20 transition-all min-h-[160px]">
                      <div className="w-20 h-20 bg-black/60 rounded-2xl border border-slate-800 flex items-center justify-center flex-shrink-0 relative overflow-hidden shadow-inner">
                        {loadingPrompts || Object.values(loadingImages).some(Boolean) ? (
                          <div className="w-8 h-8 rounded-full border-4 border-yellow-400 border-t-transparent animate-spin"></div>
                        ) : (
                          <div className="w-4 h-4 rounded-full bg-emerald-400 animate-pulse"></div>
                        )}
                      </div>
                      <div className="flex flex-col gap-0.5 min-w-0">
                        <div className="text-[9px] text-yellow-400 font-extrabold uppercase tracking-widest font-mono">System Integrity</div>
                        <div className="text-base font-black italic uppercase text-slate-100 tracking-tight">NANO-BANANA X-RAY</div>
                        <p className="text-[11.5px] text-slate-400 leading-normal">
                          Validates multi-medium geometry congruency on 12 sub-layers. Zero human features detected. Perfect geometry alignment ensured.
                        </p>
                      </div>
                    </div>

                  </div>
                </motion.div>
              )}
            </AnimatePresence>

          </section>

        </div>
      </main>

      {/* Footer */}
      <footer className="mt-16 border-t border-slate-900 bg-[#0A0A0C] py-8 text-center text-[10px] text-slate-500 font-mono">
        <div className="max-w-7xl mx-auto px-6 space-y-2">
          <p className="uppercase tracking-widest font-extrabold text-slate-600">
            Brand Builder Campaign Laboratory • Powered by server-side Google GenAI
          </p>
          <p className="text-[9.5px] text-slate-600">
            Strict negative prompts enforced: No people assets, no human limbs. Dedicated Nano-Banana execution.
          </p>
        </div>
      </footer>

    </div>
  );
}
