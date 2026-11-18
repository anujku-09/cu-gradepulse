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
  Layers,
  ChevronDown
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
  onResetAll,
}) => {
  const currentTrack = COHORT_TRACKS_INFO.find(t => t.id === currentTrackId) || COHORT_TRACKS_INFO[0];

  return (
    <header className="sticky top-0 z-40 w-full border-b border-white/[0.08] bg-obsidian-950/90 backdrop-blur-xl transition-all">
      {/* Primary Top Bar: Height 56px (h-14) on mobile/tablet, 64px (h-16) on desktop */}
      <div className="max-w-7xl mx-auto px-2.5 sm:px-6 lg:px-8 h-14 sm:h-16 flex items-center justify-between gap-2 sm:gap-4">
        
        {/* Brand Logo & Title */}
        <div className="flex items-center gap-2 sm:gap-3 flex-shrink-0 min-w-0">
          <div className="relative flex items-center justify-center w-8 h-8 sm:w-9 sm:h-9 rounded-xl bg-gradient-to-br from-cyan-500/20 via-indigo-500/20 to-violet-500/20 border border-cyan-500/30 shadow-[0_0_20px_rgba(6,182,212,0.25)] flex-shrink-0">
            <Gauge className="w-4 h-4 sm:w-5 sm:h-5 text-cyan-400" />
            <span className="absolute -top-1 -right-1 flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-cyan-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-cyan-500"></span>
            </span>
          </div>

          <div className="flex-shrink-0 flex flex-col justify-center min-w-0">
            <div className="flex items-center gap-1.5 whitespace-nowrap">
              <span className="text-xs sm:text-base font-extrabold tracking-tight text-white select-none">
                CU&nbsp;<span className="text-cyan-400">GradePulse</span>
              </span>
              <span className="hidden sm:inline-flex items-center px-1.5 py-0.2 rounded text-[9px] font-semibold tracking-wider bg-cyan-950/80 text-cyan-300 border border-cyan-800/60 uppercase">
                CSE v2.4
              </span>
            </div>
            <p className="text-[10px] text-slate-400 whitespace-nowrap hidden xl:block">
              Chandigarh University Academic Mission Control
            </p>
          </div>
        </div>

        {/* Central Controls: Cohort Section, MNG Track & Curve (Desktop >= 1024px) */}
        <div className="hidden lg:flex items-center gap-1.5 xl:gap-2 glass-pill px-2.5 xl:px-3 py-1.5 rounded-full border border-white/10 flex-shrink-0">
          {/* Cohort Section Selector Pill */}
          <button
            onClick={onOpenTrackModal}
            title="Switch Section / Specialization Cohort (Apple, AI/ML, Cloud, Cyber, General)"
            className="flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold text-cyan-300 hover:text-white bg-cyan-950/40 hover:bg-cyan-900/50 border border-cyan-500/30 transition-all whitespace-nowrap shadow-[0_0_10px_rgba(6,182,212,0.15)]"
          >
            <span className="text-sm">{currentTrack.icon}</span>
            <span className="truncate max-w-[130px] xl:max-w-none">{currentTrack.name}</span>
            <ChevronDown className="w-3 h-3 text-cyan-400 flex-shrink-0" />
          </button>

          <div className="w-[1px] h-4 bg-white/10" />

          {/* MNG / Graded Switch */}
          <button
            onClick={onToggleGlobalMng}
            title="Batch Track Mode for Soft Skills-III & Aptitude-III"
            className="flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium transition-all hover:bg-white/5 whitespace-nowrap"
          >
            <span className="text-slate-400 text-[11px] hidden xl:inline">Apt/Soft:</span>
            {isGlobalMng ? (
              <span className="flex items-center gap-1 text-emerald-400 font-semibold text-[11px] xl:text-xs">
                <ToggleRight className="w-3.5 h-3.5 text-emerald-400" /> MNG (19 Cr)
              </span>
            ) : (
              <span className="flex items-center gap-1 text-indigo-400 font-semibold text-[11px] xl:text-xs">
                <ToggleLeft className="w-3.5 h-3.5 text-indigo-400" /> Graded (23 Cr)
              </span>
            )}
          </button>

          <div className="w-[1px] h-4 bg-white/10" />

          {/* Curve Selector */}
          <div className="flex items-center gap-1 whitespace-nowrap">
            <span className="text-slate-400 text-[11px] pl-1 hidden xl:inline">Curve:</span>
            <select
              value={curveMode}
              onChange={(e) => onCurveChange(e.target.value as CurveMode)}
              className="bg-obsidian-850 border border-white/10 rounded-md text-[11px] xl:text-xs text-slate-200 px-1.5 xl:px-2 py-1 font-mono focus:border-cyan-500 focus:outline-none cursor-pointer"
            >
              <option value="standard">CU Curve (95+)</option>
              <option value="strict">Strict (96+)</option>
              <option value="lenient">Lenient (91+)</option>
              {curveMode === 'custom' && <option value="custom">Custom</option>}
            </select>

            <button
              onClick={onOpenCutoffModal}
              title="Inspect & Customize Cutoff Matrix"
              className="p-1 rounded text-slate-400 hover:text-white transition-colors"
            >
              <HelpCircle className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* Action Buttons: Responsively Optimized Across Device Sizes */}
        <div className="flex items-center gap-1 sm:gap-1.5 xl:gap-2 flex-shrink-0">
          
          {/* Add Custom Subject Button (Tablet & Desktop) */}
          <button
            onClick={onOpenAddCustomCourse}
            className="hidden sm:flex items-center justify-center gap-1 px-2 xl:px-2.5 py-1.5 rounded-lg text-xs font-semibold bg-obsidian-800/90 hover:bg-obsidian-750 text-slate-200 border border-white/10 hover:border-cyan-500/40 transition-all flex-shrink-0"
            title="Add a custom or specialized course to Semester V"
          >
            <Plus className="w-3.5 h-3.5 text-cyan-400" />
            <span className="hidden md:inline">+ Subject</span>
          </button>

          {/* Guided Wizard Button (High priority, compact on mobile) */}
          {onOpenWizard && (
            <button
              onClick={onOpenWizard}
              className="flex items-center justify-center gap-1 px-2 py-1 sm:px-2.5 sm:py-1.5 rounded-lg text-[11px] sm:text-xs font-bold bg-gradient-to-r from-cyan-500/20 via-indigo-500/20 to-violet-500/20 hover:from-cyan-500/30 hover:to-indigo-500/30 text-cyan-300 border border-cyan-500/40 transition-all shadow-[0_0_12px_rgba(6,182,212,0.2)] flex-shrink-0"
              title="Launch Step-by-Step Card Flow (Setup Wizard)"
            >
              <Zap className="w-3.5 h-3.5 text-cyan-400 flex-shrink-0" />
              <span className="hidden xs:inline font-sans">Cards</span>
              <span className="xs:hidden font-sans">Cards</span>
            </button>
          )}

          {/* Smart Paste (Mobile icon, Desktop label) */}
          <button
            onClick={onOpenPasteModal}
            className="flex items-center justify-center gap-1 p-1.5 sm:px-2.5 sm:py-1.5 rounded-lg text-[11px] sm:text-xs font-medium bg-obsidian-800/80 hover:bg-obsidian-700 text-slate-200 border border-white/10 transition-all hover:border-cyan-500/40 flex-shrink-0"
            title="Paste raw CUIMS copied text/tables"
          >
            <ClipboardPaste className="w-3.5 h-3.5 text-cyan-400" />
            <span className="hidden md:inline">CUIMS Paste</span>
          </button>

          {/* Reverse Optimizer (Tablet & Desktop, mobile uses bottom dock) */}
          <button
            onClick={onOpenOptimizer}
            className="hidden sm:flex items-center justify-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-medium bg-gradient-to-r from-indigo-900/60 to-violet-900/60 hover:from-indigo-800/80 hover:to-violet-800/80 text-indigo-200 border border-indigo-500/30 transition-all shadow-[0_0_15px_rgba(99,102,241,0.2)] flex-shrink-0"
            title="AI SGPA Target Reverse-Optimizer"
          >
            <Sparkles className="w-3.5 h-3.5 text-indigo-400" />
            <span className="hidden lg:inline">AI Optimizer</span>
          </button>

          {/* Cumulative CGPA Forecaster (Tablet & Desktop) */}
          <button
            onClick={onOpenForecaster}
            className="hidden sm:flex items-center justify-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-medium bg-obsidian-800/80 hover:bg-obsidian-700 text-slate-200 border border-white/10 transition-all flex-shrink-0"
            title="Forecast Overall CGPA"
          >
            <TrendingUp className="w-3.5 h-3.5 text-emerald-400" />
            <span className="hidden lg:inline">CGPA</span>
          </button>

          {/* Scorecard Snapshot (Desktop / Tablet) */}
          <button
            onClick={onOpenExportModal}
            className="hidden sm:flex p-1.5 sm:p-2 rounded-lg bg-obsidian-800/80 hover:bg-obsidian-700 text-slate-300 border border-white/10 transition-all hover:text-white flex-shrink-0"
            title="Export Scorecard Snapshot"
          >
            <Camera className="w-4 h-4 text-slate-300" />
          </button>

          {/* Command Palette Trigger (Desktop only) */}
          <button
            onClick={onOpenCommandPalette}
            className="hidden xl:flex items-center gap-1 px-2 py-1.5 rounded-lg bg-obsidian-800/90 hover:bg-obsidian-700 text-slate-300 hover:text-white border border-white/10 text-xs font-mono transition-all hover:border-cyan-500/40 flex-shrink-0"
            title="Command Palette & Quick Switcher (Ctrl + K)"
          >
            <kbd className="px-1 py-0.2 rounded bg-white/10 border border-white/15 text-[10px] font-sans font-semibold text-slate-200">
              Ctrl
            </kbd>
            <kbd className="px-1 py-0.2 rounded bg-white/10 border border-white/15 text-[10px] font-mono font-bold text-cyan-300">
              K
            </kbd>
          </button>

          {/* Reset Marks Button */}
          <button
            onClick={onResetAll}
            className="p-1.5 sm:p-2 rounded-lg bg-obsidian-850 hover:bg-rose-950/40 text-slate-400 hover:text-rose-400 border border-white/10 transition-all flex-shrink-0"
            title="Reset All Marks to Zero"
          >
            <RotateCcw className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
          </button>
        </div>

      </div>

      {/* Mobile / Tablet Sub-Bar for Cohort Track, MNG & Cutoffs (Height 36px on mobile, 38px on tablet) */}
      <div className="lg:hidden flex items-center justify-between px-2.5 sm:px-4 h-9 sm:h-10 border-t border-white/[0.06] bg-obsidian-950/95 text-xs gap-1.5 sm:gap-2 overflow-x-auto no-scrollbar">
        {/* Cohort Selector Pill on Mobile */}
        <button
          onClick={onOpenTrackModal}
          className="flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] sm:text-[11px] font-semibold text-cyan-300 bg-cyan-950/70 border border-cyan-500/40 whitespace-nowrap flex-shrink-0"
        >
          <span>{currentTrack.icon}</span>
          <span className="truncate max-w-[100px] sm:max-w-[130px]">{currentTrack.name}</span>
          <ChevronDown className="w-2.5 h-2.5 sm:w-3 sm:h-3 text-cyan-400" />
        </button>

        {/* Apt/Soft skills MNG track */}
        <button
          onClick={onToggleGlobalMng}
          className="flex items-center gap-1 text-slate-300 hover:text-white transition-colors whitespace-nowrap flex-shrink-0"
        >
          <span className="text-[10px] sm:text-xs text-slate-400">Apt:</span>
          <span className={`font-semibold text-[10px] sm:text-xs ${isGlobalMng ? 'text-emerald-400' : 'text-indigo-400'}`}>
            {isGlobalMng ? 'MNG' : 'Graded'}
          </span>
        </button>

        {/* Cutoff Curve Selector */}
        <div className="flex items-center gap-1 whitespace-nowrap flex-shrink-0">
          <span className="text-[10px] font-mono text-slate-400 hidden xs:inline">Cutoff:</span>
          <select
            value={curveMode}
            onChange={(e) => onCurveChange(e.target.value as CurveMode)}
            className="bg-obsidian-850 border border-white/10 rounded text-[10px] sm:text-[11px] text-slate-200 px-1 py-0.5 font-mono focus:border-cyan-500 focus:outline-none"
          >
            <option value="standard">95+ Std</option>
            <option value="strict">96+ Strict</option>
            <option value="lenient">91+ Len</option>
            {curveMode === 'custom' && <option value="custom">Custom</option>}
          </select>
          <button
            onClick={onOpenCutoffModal}
            className="p-0.5 sm:p-1 rounded text-slate-400 hover:text-white"
            title="Inspect Cutoffs"
          >
            <HelpCircle className="w-3 h-3 sm:w-3.5 sm:h-3.5" />
          </button>
        </div>
      </div>
    </header>
  );
};

export default Navbar;
