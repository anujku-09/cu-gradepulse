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
  onResetAll,
}) => {
  const currentTrack = COHORT_TRACKS_INFO.find(t => t.id === currentTrackId) || COHORT_TRACKS_INFO[0];

  return (
    <header className="sticky top-0 z-40 w-full border-b border-white/[0.08] bg-obsidian-950/92 backdrop-blur-xl transition-all select-none">
      {/* Unified Single Navbar: h-14 (56px) on mobile/tablet, h-16 (64px) on desktop */}
      <div className="w-full max-w-[1700px] mx-auto px-2 sm:px-4 lg:px-6 h-14 sm:h-16 flex items-center justify-between gap-1.5 sm:gap-2">
        
        {/* ============================================================== */}
        {/* LEFT: Brand Logo + Title + Cohort Section Pill                 */}
        {/* ============================================================== */}
        <div className="flex items-center gap-1.5 sm:gap-2.5 flex-shrink-0 min-w-0">
          {/* Logo Icon */}
          <div className="relative flex items-center justify-center w-8 h-8 sm:w-9 sm:h-9 rounded-xl bg-gradient-to-br from-cyan-500/20 via-indigo-500/20 to-violet-500/20 border border-cyan-500/30 shadow-[0_0_15px_rgba(6,182,212,0.25)] flex-shrink-0">
            <Gauge className="w-4 h-4 sm:w-5 sm:h-5 text-cyan-400" />
            <span className="absolute -top-0.5 -right-0.5 flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-cyan-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-cyan-500"></span>
            </span>
          </div>

          {/* Title */}
          <div className="flex items-center gap-1 sm:gap-1.5 whitespace-nowrap">
            <span className="text-sm sm:text-base font-extrabold tracking-tight text-white">
              CU&nbsp;<span className="text-cyan-400">GradePulse</span>
            </span>
            <span className="hidden sm:inline-flex items-center px-1.5 py-0.5 rounded text-[9px] font-semibold tracking-wider bg-cyan-950/80 text-cyan-300 border border-cyan-800/60 uppercase">
              CSE v2.4
            </span>
          </div>

          {/* Cohort Section Selector Pill (Always visible across all devices!) */}
          <button
            onClick={onOpenTrackModal}
            title="Click to switch 5th Sem section (Apple, AI/ML, Cloud, Cyber, General)"
            className="flex items-center gap-1 px-2 py-1 rounded-xl text-xs font-semibold text-cyan-300 hover:text-white bg-cyan-950/60 hover:bg-cyan-900/60 border border-cyan-500/40 transition-all whitespace-nowrap shadow-[0_0_10px_rgba(6,182,212,0.15)] active:scale-95 touch-manipulation flex-shrink-0"
          >
            <span className="text-sm">{currentTrack.icon}</span>
            <span className="truncate max-w-[80px] sm:max-w-[120px] font-sans">
              {currentTrack.name}
            </span>
            <ChevronDown className="w-3 h-3 text-cyan-400 flex-shrink-0" />
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
              <option value="standard">Standard</option>
              <option value="strict">Strict</option>
              <option value="lenient">Lenient</option>
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
        {/* RIGHT: Action Buttons (Adaptive & Ultra-Compact)              */}
        {/* ============================================================== */}
        <div className="flex items-center gap-1 sm:gap-1.5 flex-shrink-0">
          
          {/* Cutoff Selector for Mobile & Tablet (< 1024px) */}
          <div className="lg:hidden flex items-center gap-0.5 bg-obsidian-900 border border-white/10 rounded-lg px-1.5 py-1 text-xs">
            <select
              value={curveMode}
              onChange={(e) => onCurveChange(e.target.value as CurveMode)}
              className="bg-transparent text-[10px] sm:text-xs text-cyan-300 font-mono focus:outline-none cursor-pointer"
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

          {/* Add Subject Button */}
          <button
            onClick={onOpenAddCustomCourse}
            className="hidden sm:flex items-center justify-center p-1.5 sm:p-2 rounded-lg text-xs font-semibold bg-obsidian-850 hover:bg-obsidian-750 text-slate-200 border border-white/10 hover:border-cyan-500/40 transition-all flex-shrink-0"
            title="Add a custom or specialized course to Semester V"
          >
            <Plus className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-cyan-400" />
          </button>

          {/* Guided Wizard Button (Hero Primary Action) */}
          {onOpenWizard && (
            <button
              onClick={onOpenWizard}
              className="flex items-center justify-center gap-1 sm:gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-bold bg-gradient-to-r from-cyan-500/20 via-indigo-500/20 to-violet-500/20 hover:from-cyan-500/30 hover:to-indigo-500/30 text-cyan-300 border border-cyan-500/40 transition-all shadow-[0_0_12px_rgba(6,182,212,0.2)] active:scale-95 touch-manipulation flex-shrink-0"
              title="Launch Step-by-Step Card Flow (Setup Wizard)"
            >
              <Zap className="w-3.5 h-3.5 text-cyan-400 flex-shrink-0" />
              <span className="font-sans">Cards</span>
            </button>
          )}

          {/* Smart Paste Button */}
          <button
            onClick={onOpenPasteModal}
            className="flex items-center justify-center p-1.5 sm:p-2 rounded-lg text-xs font-medium bg-obsidian-850 hover:bg-obsidian-750 text-slate-200 border border-white/10 transition-all hover:border-cyan-500/40 active:scale-95 touch-manipulation flex-shrink-0"
            title="Paste raw CUIMS copied text/tables"
          >
            <ClipboardPaste className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-cyan-400" />
          </button>

          {/* Reverse Optimizer Button */}
          <button
            onClick={onOpenOptimizer}
            className="hidden sm:flex items-center justify-center p-1.5 sm:p-2 rounded-lg text-xs font-medium bg-gradient-to-r from-indigo-900/60 to-violet-900/60 hover:from-indigo-800/80 hover:to-violet-800/80 text-indigo-200 border border-indigo-500/30 transition-all shadow-[0_0_12px_rgba(99,102,241,0.2)] flex-shrink-0"
            title="AI SGPA Target Reverse-Optimizer"
          >
            <Sparkles className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-indigo-400" />
          </button>

          {/* Cumulative CGPA Forecaster Button */}
          <button
            onClick={onOpenForecaster}
            className="hidden sm:flex items-center justify-center p-1.5 sm:p-2 rounded-lg text-xs font-medium bg-obsidian-850 hover:bg-obsidian-750 text-slate-200 border border-white/10 transition-all flex-shrink-0"
            title="Forecast Overall CGPA"
          >
            <TrendingUp className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-emerald-400" />
          </button>

          {/* Scorecard Snapshot Button (Camera) */}
          <button
            onClick={onOpenExportModal}
            className="flex items-center justify-center p-1.5 sm:p-2 rounded-lg bg-obsidian-850 hover:bg-obsidian-750 text-slate-300 border border-white/10 transition-all hover:text-white flex-shrink-0"
            title="Export Scorecard Snapshot"
          >
            <Camera className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-slate-300" />
          </button>

          {/* Support / Feedback Heart Button */}
          {onOpenFeedback && (
            <button
              onClick={onOpenFeedback}
              className="flex items-center justify-center gap-1 px-2 sm:px-2.5 py-1.5 rounded-lg bg-rose-950/40 hover:bg-rose-900/60 text-rose-300 border border-rose-500/30 hover:border-rose-400/50 transition-all text-xs font-semibold shadow-[0_0_12px_rgba(244,63,94,0.15)] active:scale-95 touch-manipulation flex-shrink-0"
              title="Support Creator & Send Feedback"
            >
              <Heart className="w-3.5 h-3.5 text-rose-400 fill-rose-500 animate-pulse" />
              <span className="hidden md:inline font-sans">Love</span>
            </button>
          )}

          {/* Reset Marks Button */}
          <button
            onClick={onResetAll}
            className="flex items-center justify-center p-1.5 sm:p-2 rounded-lg bg-obsidian-850 hover:bg-rose-950/40 text-slate-400 hover:text-rose-400 border border-white/10 transition-all flex-shrink-0"
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
