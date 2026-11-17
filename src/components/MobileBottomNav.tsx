import React from 'react';
import { 
  Sparkles, 
  TrendingUp, 
  ClipboardPaste, 
  Camera, 
  Award,
  Sliders
} from 'lucide-react';
import { SemesterCalculation } from '../types';

interface MobileBottomNavProps {
  calc: SemesterCalculation;
  onOpenOptimizer: () => void;
  onOpenForecaster: () => void;
  onOpenPasteModal: () => void;
  onOpenExportModal: () => void;
  onOpenCutoffModal: () => void;
  onOpenWizard?: () => void;
}

export const MobileBottomNav: React.FC<MobileBottomNavProps> = ({
  calc,
  onOpenOptimizer,
  onOpenForecaster,
  onOpenPasteModal,
  onOpenExportModal,
  onOpenCutoffModal,
  onOpenWizard,
}) => {
  const { sgpa, hasBacklog } = calc;

  return (
    <nav 
      aria-label="Mobile Navigation Bar"
      className="sm:hidden fixed bottom-0 left-0 right-0 z-40 bg-obsidian-950/92 backdrop-blur-2xl border-t border-white/10 px-2 py-1.5 transition-all shadow-[0_-8px_30px_rgba(0,0,0,0.6)]"
      style={{ paddingBottom: 'max(0.375rem, env(safe-area-inset-bottom))' }}
    >
      <div className="flex items-center justify-around gap-1 max-w-md mx-auto">
        
        {/* Live SGPA Badge / Guided Wizard Trigger */}
        <button
          onClick={onOpenWizard || onOpenOptimizer}
          className="flex flex-col items-center justify-center py-1 px-2 rounded-xl text-center transition-all active:scale-95 touch-manipulation group"
          title="Launch Step-by-Step Card Flow"
        >
          <div className="flex items-center gap-1">
            <Award className={`w-3.5 h-3.5 ${hasBacklog ? 'text-rose-400' : 'text-cyan-400'}`} />
            <span className={`font-mono text-xs font-extrabold ${hasBacklog ? 'text-rose-400' : 'text-cyan-300'}`}>
              {sgpa > 0 ? sgpa.toFixed(2) : '--'}
            </span>
          </div>
          <span className="text-[9px] font-mono text-slate-400 mt-0.5">
            {onOpenWizard ? 'Cards ⚡' : 'SGPA'}
          </span>
        </button>

        {/* Smart Paste */}
        <button
          onClick={onOpenPasteModal}
          className="flex flex-col items-center justify-center py-1 px-2.5 rounded-xl text-slate-300 hover:text-white transition-all active:scale-95 touch-manipulation"
        >
          <ClipboardPaste className="w-4 h-4 text-cyan-400" />
          <span className="text-[10px] font-medium text-slate-400 mt-0.5">
            Paste
          </span>
        </button>

        {/* AI Optimizer (Featured Center Action) */}
        <button
          onClick={onOpenOptimizer}
          className="flex flex-col items-center justify-center p-1.5 px-3 rounded-2xl bg-gradient-to-r from-indigo-600 via-indigo-500 to-cyan-500 text-white shadow-[0_0_15px_rgba(99,102,241,0.4)] transition-all active:scale-95 touch-manipulation -translate-y-1"
        >
          <Sparkles className="w-4 h-4 text-white" />
          <span className="text-[9px] font-bold tracking-tight mt-0.5 uppercase">
            Optimizer
          </span>
        </button>

        {/* CGPA Forecaster */}
        <button
          onClick={onOpenForecaster}
          className="flex flex-col items-center justify-center py-1 px-2.5 rounded-xl text-slate-300 hover:text-white transition-all active:scale-95 touch-manipulation"
        >
          <TrendingUp className="w-4 h-4 text-emerald-400" />
          <span className="text-[10px] font-medium text-slate-400 mt-0.5">
            CGPA
          </span>
        </button>

        {/* Snapshot / Scorecard */}
        <button
          onClick={onOpenExportModal}
          className="flex flex-col items-center justify-center py-1 px-2 rounded-xl text-slate-300 hover:text-white transition-all active:scale-95 touch-manipulation"
        >
          <Camera className="w-4 h-4 text-slate-300" />
          <span className="text-[10px] font-medium text-slate-400 mt-0.5">
            Card
          </span>
        </button>

      </div>
    </nav>
  );
};
