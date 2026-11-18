import React from 'react';
import { 
  Sparkles, 
  Sliders, 
  TrendingUp, 
  ClipboardPaste, 
  Camera, 
  RotateCcw, 
  HelpCircle,
  ToggleLeft,
  ToggleRight,
  Gauge,
  Zap,
  Plus,
  ChevronDown,
  Heart
} from 'lucide-react';
import { CurveMode, CohortTrackId } from '../types';
import { COHORT_TRACKS_INFO } from '../data/courses';

interface NavbarProps {
  curveMode: CurveMode;
  onCurveChange: (mode: CurveMode) => void;
  isGlobalMng: boolean;
  onToggleGlobalMng: () => void;
  currentTrackId: CohortTrackId;
  onOpenTrackModal: () => void;
  onOpenAddCustomCourse: () => void;
  onOpenOptimizer: () => void;
  onOpenForecaster: () => void;
  onOpenPasteModal: () => void;
  onOpenExportModal: () => void;
  onOpenCutoffModal: () => void;
  onOpenCommandPalette: () => void;
  onOpenWizard?: () => void;
  onOpenFeedback?: () => void;
  globalHearts?: number;
  onResetAll: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  curveMode,
  onCurveChange,
  isGlobalMng,
  onToggleGlobalMng,
  currentTrackId,
  onOpenTrackModal,
  onOpenAddCustomCourse,
  onOpenOptimizer,
  onOpenForecaster,
  onOpenPasteModal,
  onOpenExportModal,
  onOpenCutoffModal,
  onOpenCommandPalette,
  onOpenWizard,
  onOpenFeedback,
  globalHearts,
  onResetAll,
}) => {
  const currentTrack = COHORT_TRACKS_INFO.find(t => t.id === currentTrackId) || COHORT_TRACKS_INFO[0];

  return (
    <header className="sticky top-0 z-40 w-full max-w-[100vw] overflow-x-hidden border-b border-white/[0.08] bg-obsidian-950/92 backdrop-blur-xl transition-all select-none">
      {/* Unified Single Navbar: h-14 (56px) on mobile/tablet, h-16 (64px) on desktop */}
      <div className="w-full max-w-[1700px] mx-auto px-2 sm:px-4 lg:px-6 h-14 sm:h-16 flex items-center justify-between gap-1 sm:gap-2">
        
        {/* ============================================================== */}
        {/* LEFT: Brand Logo + Title + Cohort Section Pill                 */}
        {/* ============================================================== */}
        <div className="flex items-center gap-1.5 sm:gap-2 min-w-0 flex-shrink">
          {/* Logo Icon */}
          <div className="relative flex items-center justify-center w-7 h-7 sm:w-8 sm:h-8 rounded-xl bg-gradient-to-br from-cyan-500/20 via-indigo-500/20 to-violet-500/20 border border-cyan-500/30 shadow-[0_0_15px_rgba(6,182,212,0.25)] flex-shrink-0">
            <Gauge className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-cyan-400" />
            <span className="absolute -top-0.5 -right-0.5 flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-cyan-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-cyan-500"></span>
            </span>
          </div>

          {/* Title (Adaptive for mobile screens: CU Pulse on < 390px, CU GradePulse on >= 390px) */}
          <div className="flex items-center gap-1 whitespace-nowrap min-w-0 flex-shrink">
            <span className="text-xs sm:text-sm md:text-base font-extrabold tracking-tight text-white">
              <span className="inline min-[390px]:hidden">CU&nbsp;<span className="text-cyan-400">Pulse</span></span>
              <span className="hidden min-[390px]:inline">CU&nbsp;<span className="text-cyan-400">GradePulse</span></span>
            </span>
            <span className="hidden md:inline-flex items-center px-1.5 py-0.5 rounded text-[9px] font-semibold tracking-wider bg-cyan-950/80 text-cyan-300 border border-cyan-800/60 uppercase">
              CSE v2.4
            </span>
          </div>

          {/* Cohort Section Selector Pill (Auto-adapts width for small screens) */}
          <button
            onClick={onOpenTrackModal}
            title={`Current Cohort: ${currentTrack.name} (Click to switch section)`}
            className="flex items-center gap-1 px-1.5 sm:px-2 py-1 rounded-xl text-[11px] sm:text-xs font-semibold text-cyan-300 hover:text-white bg-cyan-950/60 hover:bg-cyan-900/60 border border-cyan-500/40 transition-all whitespace-nowrap shadow-[0_0_10px_rgba(6,182,212,0.15)] active:scale-95 touch-manipulation min-w-0 max-w-[72px] min-[380px]:max-w-[100px] sm:max-w-[150px] flex-shrink"
          >
            <span className="text-xs sm:text-sm flex-shrink-0">{currentTrack.icon}</span>
            <span className="truncate font-sans min-w-0">
              {currentTrack.name}
            </span>
            <ChevronDown className="w-2.5 h-2.5 sm:w-3 sm:h-3 text-cyan-400 flex-shrink-0" />
          </button>
        </div>

        {/* ============================================================== */}
        {/* CENTER: Cutoff Curve & Apt/Soft Skills Toggle (Desktop >= 1024)*/}
        {/* ============================================================== */}
        <div className="hidden lg:flex items-center gap-2 px-2.5 py-1 rounded-full bg-obsidian-900 border border-white/10 flex-shrink-0">
          {/* Curve Selector */}
          <div className="flex items-center gap-1 whitespace-nowrap text-xs">
            <span className="text-slate-400 text-[11px] font-mono">Curve:</span>
            <select
              value={curveMode}
              onChange={(e) => onCurveChange(e.target.value as CurveMode)}
              className="bg-obsidian-850 border border-white/10 rounded-md text-xs text-cyan-300 px-1.5 py-0.5 font-mono focus:border-cyan-500 focus:outline-none cursor-pointer"
              title="Cohort Cutoff Curve Difficulty"
            >
              <option value="standard">Standard (95+)</option>
              <option value="strict">Strict (97+)</option>
              <option value="lenient">Lenient (90+)</option>
              {curveMode === 'custom' && <option value="custom">Custom</option>}
            </select>

            <button
              onClick={onOpenCutoffModal}
              title="Inspect & Customize Cutoff Matrix (A+, A, B+, etc.)"
              className="p-1 rounded text-slate-400 hover:text-white transition-colors"
            >
              <Sliders className="w-3.5 h-3.5 text-cyan-400" />
            </button>
          </div>

          <div className="w-[1px] h-4 bg-white/10" />

          {/* MNG / Graded Switch */}
          <button
            onClick={onToggleGlobalMng}
            title="Batch Track Mode for Soft Skills-III & Aptitude-III"
            className="flex items-center gap-1 px-1.5 py-0.5 rounded-full text-xs font-medium transition-all hover:bg-white/5 whitespace-nowrap"
          >
            <span className="text-slate-400 text-[11px]">Apt/Soft:</span>
            {isGlobalMng ? (
              <span className="flex items-center gap-1 text-emerald-400 font-semibold text-xs">
                <ToggleRight className="w-3.5 h-3.5 text-emerald-400" /> MNG (19 Cr)
              </span>
            ) : (
              <span className="flex items-center gap-1 text-indigo-400 font-semibold text-xs">
                <ToggleLeft className="w-3.5 h-3.5 text-indigo-400" /> Graded (23 Cr)
              </span>
            )}
          </button>
        </div>

        {/* ============================================================== */}
        {/* RIGHT: Action Buttons (Adaptive & Mobile-Zero-Overflow)        */}
        {/* ============================================================== */}
        <div className="flex items-center gap-1 sm:gap-1.5 flex-shrink-0">
          
          {/* Cutoff Selector for Tablet (640px to 1023px) */}
          <div className="hidden sm:flex lg:hidden items-center gap-0.5 bg-obsidian-900 border border-white/10 rounded-lg px-1.5 py-1 text-xs">
            <select
              value={curveMode}
              onChange={(e) => onCurveChange(e.target.value as CurveMode)}
              className="bg-transparent text-xs text-cyan-300 font-mono focus:outline-none cursor-pointer"
              title="Cohort Cutoff Curve"
            >
              <option value="standard" className="bg-obsidian-900 text-slate-200">Standard</option>
              <option value="strict" className="bg-obsidian-900 text-slate-200">Strict</option>
              <option value="lenient" className="bg-obsidian-900 text-slate-200">Lenient</option>
              {curveMode === 'custom' && <option value="custom" className="bg-obsidian-900 text-slate-200">Custom</option>}
            </select>
            <button
              onClick={onOpenCutoffModal}
              className="p-0.5 text-slate-400 hover:text-white"
              title="Inspect Cutoffs"
            >
              <Sliders className="w-3 h-3 text-cyan-400" />
            </button>
          </div>

          {/* Cutoff Quick Pill for Mobile (< 640px) */}
          <button
            onClick={onOpenCutoffModal}
            className="sm:hidden flex items-center gap-1 px-1.5 py-1 rounded-lg bg-obsidian-900 border border-white/10 text-cyan-300 active:scale-95 transition-all text-xs font-mono flex-shrink-0"
            title={`Cutoff Curve: ${curveMode} (Tap to change)`}
          >
            <Sliders className="w-3 h-3 text-cyan-400 flex-shrink-0" />
            <span className="text-[10px] font-bold uppercase">
              {curveMode === 'standard' ? 'Std' : curveMode === 'strict' ? 'Str' : curveMode === 'lenient' ? 'Len' : 'Cust'}
            </span>
          </button>

          {/* Add Subject Button (Desktop / Tablet) */}
          <button
            onClick={onOpenAddCustomCourse}
            className="hidden sm:flex items-center justify-center p-1.5 sm:p-2 rounded-lg text-xs font-semibold bg-obsidian-850 hover:bg-obsidian-750 text-slate-200 border border-white/10 hover:border-cyan-500/40 transition-all flex-shrink-0"
            title="Add a custom or specialized course to Semester V"
          >
            <Plus className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-cyan-400" />
          </button>

          {/* Guided Wizard Button (Hidden on tiny screens < 380px because bottom nav already has prominent Cards button) */}
          {onOpenWizard && (
            <button
              onClick={onOpenWizard}
              className="hidden min-[380px]:flex items-center justify-center gap-1 px-2 sm:px-2.5 py-1 sm:py-1.5 rounded-lg text-xs font-bold bg-gradient-to-r from-cyan-500/20 via-indigo-500/20 to-violet-500/20 hover:from-cyan-500/30 hover:to-indigo-500/30 text-cyan-300 border border-cyan-500/40 transition-all shadow-[0_0_12px_rgba(6,182,212,0.2)] active:scale-95 touch-manipulation flex-shrink-0"
              title="Launch Step-by-Step Card Flow (Setup Wizard)"
            >
              <Zap className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-cyan-400 flex-shrink-0" />
              <span className="font-sans text-[11px] sm:text-xs">Cards</span>
            </button>
          )}

          {/* Smart Paste Button (Desktop / Tablet - on mobile available in Bottom Nav) */}
          <button
            onClick={onOpenPasteModal}
            className="hidden sm:flex items-center justify-center p-1.5 sm:p-2 rounded-lg text-xs font-medium bg-obsidian-850 hover:bg-obsidian-750 text-slate-200 border border-white/10 transition-all hover:border-cyan-500/40 active:scale-95 touch-manipulation flex-shrink-0"
            title="Paste raw CUIMS copied text/tables"
          >
            <ClipboardPaste className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-cyan-400" />
          </button>

          {/* Reverse Optimizer Button (Tablet / Desktop - on mobile available in Bottom Nav) */}
          <button
            onClick={onOpenOptimizer}
            className="hidden md:flex items-center justify-center p-1.5 sm:p-2 rounded-lg text-xs font-medium bg-gradient-to-r from-indigo-900/60 to-violet-900/60 hover:from-indigo-800/80 hover:to-violet-800/80 text-indigo-200 border border-indigo-500/30 transition-all shadow-[0_0_12px_rgba(99,102,241,0.2)] flex-shrink-0"
            title="AI SGPA Target Reverse-Optimizer"
          >
            <Sparkles className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-indigo-400" />
          </button>

          {/* Cumulative CGPA Forecaster Button (Tablet / Desktop - on mobile available in Bottom Nav) */}
          <button
            onClick={onOpenForecaster}
            className="hidden md:flex items-center justify-center p-1.5 sm:p-2 rounded-lg text-xs font-medium bg-obsidian-850 hover:bg-obsidian-750 text-slate-200 border border-white/10 transition-all flex-shrink-0"
            title="Forecast Overall CGPA"
          >
            <TrendingUp className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-emerald-400" />
          </button>

          {/* Scorecard Snapshot Button (Desktop / Tablet - on mobile available in Bottom Nav) */}
          <button
            onClick={onOpenExportModal}
            className="hidden sm:flex items-center justify-center p-1.5 sm:p-2 rounded-lg bg-obsidian-850 hover:bg-obsidian-750 text-slate-300 border border-white/10 transition-all hover:text-white flex-shrink-0"
            title="Export Scorecard Snapshot"
          >
            <Camera className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-slate-300" />
          </button>

          {/* Support / Feedback Heart Button (All devices) */}
          {onOpenFeedback && (
            <button
              onClick={onOpenFeedback}
              className="flex items-center justify-center gap-1 p-1.5 sm:px-2.5 sm:py-1.5 rounded-lg bg-rose-950/40 hover:bg-rose-900/60 text-rose-300 border border-rose-500/30 hover:border-rose-400/50 transition-all text-xs font-semibold shadow-[0_0_12px_rgba(244,63,94,0.15)] active:scale-95 touch-manipulation flex-shrink-0"
              title={`Support Creator (${globalHearts && globalHearts > 0 ? `${globalHearts} Hearts Received` : 'Send Love & Feedback'})`}
            >
              <Heart className="w-3.5 h-3.5 text-rose-400 fill-rose-500 animate-pulse" />
              <span className="hidden xl:inline font-sans font-bold">
                {globalHearts && globalHearts > 0 ? `${globalHearts} Hearts` : 'Love'}
              </span>
            </button>
          )}

          {/* Reset Marks Button (All devices) */}
          <button
            onClick={onResetAll}
            className="flex items-center justify-center p-1.5 sm:p-2 rounded-lg bg-obsidian-850 hover:bg-rose-950/40 text-slate-400 hover:text-rose-400 border border-white/10 transition-all active:scale-95 touch-manipulation flex-shrink-0"
            title="Reset All Marks to Zero"
          >
            <RotateCcw className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
          </button>
        </div>

      </div>
    </header>
  );
};

export default Navbar;
