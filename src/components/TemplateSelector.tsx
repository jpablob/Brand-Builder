import { PRODUCT_TEMPLATES, ProductTemplate } from '../templates';
import { Sparkles, ArrowRight } from 'lucide-react';

interface TemplateSelectorProps {
  onSelect: (template: ProductTemplate) => void;
  selectedName: string;
}

export function TemplateSelector({ onSelect, selectedName }: TemplateSelectorProps) {
  return (
    <div className="space-y-3">
      <div className="flex items-center gap-2">
        <Sparkles className="w-4 h-4 text-yellow-400" />
        <h3 className="text-[10px] font-bold text-slate-400 uppercase tracking-widest font-mono">
          Instant Base Blueprints
        </h3>
      </div>
      
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {PRODUCT_TEMPLATES.map((tpl) => {
          const isSelected = selectedName.toLowerCase().trim() === tpl.name.toLowerCase().trim();
          
          return (
            <button
              key={tpl.name}
              type="button"
              onClick={() => onSelect(tpl)}
              className={`text-left p-3.5 rounded-2xl border transition-all duration-200 cursor-pointer flex flex-col justify-between ${
                isSelected
                  ? 'bg-yellow-400/10 border-yellow-400 shadow-md shadow-yellow-400/5'
                  : 'bg-slate-900/40 border-slate-800 hover:border-slate-700 hover:bg-slate-900/70'
              }`}
            >
              <div className="w-full">
                <div className="flex items-center justify-between mb-1">
                  <span className="text-[9px] uppercase font-mono tracking-wider font-extrabold text-slate-500">
                    {tpl.category}
                  </span>
                  {isSelected && (
                    <span className="text-[9px] bg-yellow-400/20 text-yellow-400 font-mono py-0.5 px-1.5 rounded-full font-bold">
                      ACTIVE
                    </span>
                  )}
                </div>
                <h4 className="text-xs font-black tracking-tight text-slate-100 italic">
                  {tpl.name.toUpperCase()}
                </h4>
                <p className="text-[11px] text-slate-400 mt-1 line-clamp-2 leading-relaxed">
                  {tpl.description}
                </p>
              </div>

              <div className="mt-3.5 pt-2 border-t border-slate-800/80 flex items-center justify-between w-full">
                <span className="text-[9px] text-slate-500 font-mono">
                  Tone: <span className="text-slate-400 italic font-sans">{tpl.brandTone.split(',')[0]}</span>
                </span>
                <span className="text-slate-400 group-hover:text-yellow-400 transition-colors flex items-center gap-1 text-[10px] font-bold">
                  <span>LOAD</span>
                  <ArrowRight className="w-3 h-3" />
                </span>
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}
