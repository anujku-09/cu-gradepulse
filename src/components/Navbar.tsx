import React from 'react';
import { 
  Sparkles, 
  Sliders, 
  TrendingUp, 
  ClipboardPaste, 
  Camera, 
  RotateCcw, 
  HelpCircle,
  Command as CommandIcon,
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
    <header className="sticky top-0 z-40 w-full border-b border-white/[0.08] bg-obsidian-950/80 backdrop-blur-xl transition-all">
      <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 h-15 sm:h-16 flex items-center justify-between gap-2 sm:gap-4">
        
        {/* Brand Logo & Mission Control Tag */}
        <div className="flex items-center gap-2 sm:gap-3 flex-shrink-0">
          <div className="relative flex items-center justify-center w-8 h-8 sm:w-10 sm:h-10 rounded-xl bg-gradient-to-br from-cyan-500/20 via-indigo-500/20 to-violet-500/20 border border-cyan-500/30 shadow-[0_0_20px_rgba(6,182,212,0.25)] flex-shrink-0">
            <Gauge className="w-4 h-4 sm:w-5 sm:h-5 text-cyan-400" />
            <span className="absolute -top-1 -right-1 flex h-2 sm:h-2.5 w-2 sm:w-2.5">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-cyan-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 sm:h-2.5 w-2 sm:w-2.5 bg-cyan-500"></span>
            </span>
          </div>

          <div className="flex-shrink-0 flex flex-col justify-center">
            <div className="flex items-center gap-1.5 sm:gap-2 whitespace-nowrap">
              <span className="text-sm sm:text-base lg:text-lg font-extrabold tracking-tight whitespace-nowrap text-white select-none">
                CU&nbsp;<span className="text-cyan-400">GradePulse</span>
              </span>
              <span className="hidden xs:inline-flex items-center px-1.5 py-0.5 rounded text-[9px] sm:text-[10px] font-semibold tracking-wider bg-cyan-950/80 text-cyan-300 border border-cyan-800/60 uppercase whitespace-nowrap">
                CSE v2.4
              </span>
            </div>
            <p className="text-[10px] sm:text-[11px] text-slate-400 whitespace-nowrap hidden sm:block">
              Chandigarh University Academic Mission Control
            </p>
          </div>
        </div>

        {/* Central Controls: Cohort Section, MNG Track & Curve (Desktop) */}
        <div className="hidden lg:flex items-center gap-2 glass-pill px-3 py-1.5 rounded-full border border-white/10 flex-shrink-0">
          {/* Cohort Section Selector Pill */}
          <button
            onClick={onOpenTrackModal}
            title="Switch Section / Specialization Cohort (Apple, AI/ML, Cloud, Cyber, General)"
            className="flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold text-cyan-300 hover:text-white bg-cyan-950/40 hover:bg-cyan-900/50 border border-cyan-500/30 transition-all whitespace-nowrap shadow-[0_0_10px_rgba(6,182,212,0.15)]"
          >
            <span>{currentTrack.icon}</span>
            <span>{currentTrack.name}</span>
            <ChevronDown className="w-3 h-3 text-cyan-400" />
          </button>

          <div className="w-[1px] h-4 bg-white/10" />

          {/* MNG / Graded Switch */}
          <button
            onClick={onToggleGlobalMng}
            title="Batch Track Mode for Soft Skills-III & Aptitude-III"
            className="flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium transition-all hover:bg-white/5 whitespace-nowrap"
          >
            <span className="text-slate-400 text-[11px]">Apt/Soft:</span>
            {isGlobalMng ? (
              <span className="flex items-center gap-1 text-emerald-400 font-semibold">
                <ToggleRight className="w-4 h-4 text-emerald-400" /> MNG (19 Cr)
              </span>
            ) : (
              <span className="flex items-center gap-1 text-indigo-400 font-semibold">
                <ToggleLeft className="w-4 h-4 text-indigo-400" /> Graded (23 Cr)
              </span>
            )}
          </button>

          <div className="w-[1px] h-4 bg-white/10" />

          {/* Curve Selector */}
          <div className="flex items-center gap-1.5 whitespace-nowrap">
            <span className="text-slate-400 text-[11px] pl-1">Curve:</span>
            <select
              value={curveMode}
              onChange={(e) => onCurveChange(e.target.value as CurveMode)}
              className="bg-obsidian-850 border border-white/10 rounded-md text-xs text-slate-200 px-2 py-1 font-mono focus:border-cyan-500 focus:outline-none cursor-pointer"
            >
              <option value="standard">CU CSE Curve (95+)</option>
              <option value="strict">High Comp (96+)</option>
              <option value="lenient">Tough Paper (91+)</option>
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

        {/* Action Buttons */}
        <div className="flex items-center gap-1 sm:gap-2">
          {/* Add Custom Subject Button */}
          <button
            onClick={onOpenAddCustomCourse}
            className="hidden sm:flex items-center justify-center gap-1 px-2.5 py-1.5 rounded-lg text-xs font-semibold bg-obsidian-800/90 hover:bg-obsidian-750 text-slate-200 border border-white/10 hover:border-cyan-500/40 transition-all"
            title="Add a custom or specialized course to Semester V"
          >
            <Plus className="w-3.5 h-3.5 text-cyan-400" />
            <span className="hidden md:inline">+ Subject</span>
          </button>

          {/* Guided Wizard */}
          {onOpenWizard && (
            <button
              onClick={onOpenWizard}
              className="flex items-center justify-center gap-1.5 p-1.5 sm:px-2.5 sm:py-1.5 rounded-lg text-xs font-bold bg-gradient-to-r from-cyan-500/20 via-indigo-500/20 to-violet-500/20 hover:from-cyan-500/30 hover:to-indigo-500/30 text-cyan-300 border border-cyan-500/40 transition-all shadow-[0_0_12px_rgba(6,182,212,0.2)]"
              title="Launch Step-by-Step Card Flow (Setup Wizard)"
            >
              <Zap className="w-3.5 h-3.5 text-cyan-400" />
              <span className="hidden sm:inline">Guided Wizard</span>
            </button>
          )}

          {/* Smart Paste */}
          <button
            onClick={onOpenPasteModal}
            className="flex items-center justify-center gap-1.5 p-1.5 sm:px-2.5 sm:py-1.5 rounded-lg text-xs font-medium bg-obsidian-800/80 hover:bg-obsidian-700 text-slate-200 border border-white/10 transition-all hover:border-cyan-500/40"
            title="Paste raw CUIMS copied text/tables"
          >
            <ClipboardPaste className="w-3.5 h-3.5 text-cyan-400" />
            <span className="hidden sm:inline">CUIMS Paste</span>
          </button>

          {/* Reverse Optimizer */}
          <button
            onClick={onOpenOptimizer}
            className="flex items-center justify-center gap-1.5 p-1.5 sm:px-2.5 sm:py-1.5 rounded-lg text-xs font-medium bg-gradient-to-r from-indigo-900/60 to-violet-900/60 hover:from-indigo-800/80 hover:to-violet-800/80 text-indigo-200 border border-indigo-500/30 transition-all shadow-[0_0_15px_rgba(99,102,241,0.2)]"
            title="AI SGPA Target Reverse-Optimizer"
          >
            <Sparkles className="w-3.5 h-3.5 text-indigo-400" />
            <span className="hidden sm:inline">AI Optimizer</span>
          </button>

          {/* Cumulative CGPA Forecaster */}
          <button
            onClick={onOpenForecaster}
            className="flex items-center justify-center gap-1.5 p-1.5 sm:px-2.5 sm:py-1.5 rounded-lg text-xs font-medium bg-obsidian-800/80 hover:bg-obsidian-700 text-slate-200 border border-white/10 transition-all"
            title="Forecast Overall CGPA"
          >
            <TrendingUp className="w-3.5 h-3.5 text-emerald-400" />
            <span className="hidden md:inline">CGPA</span>
          </button>

          {/* Scorecard Snapshot */}
          <button
            onClick={onOpenExportModal}
            className="p-1.5 sm:p-2 rounded-lg bg-obsidian-800/80 hover:bg-obsidian-700 text-slate-300 border border-white/10 transition-all hover:text-white"
            title="Export Scorecard Snapshot"
          >
            <Camera className="w-4 h-4 text-slate-300" />
          </button>

          {/* Command Palette Trigger (Desktop / Laptop) */}
          <button
            onClick={onOpenCommandPalette}
            className="hidden sm:flex items-center gap-1 px-2 py-1.5 rounded-lg bg-obsidian-800/90 hover:bg-obsidian-700 text-slate-300 hover:text-white border border-white/10 text-xs font-mono transition-all hover:border-cyan-500/40"
            title="Command Palette & Quick Switcher (Ctrl + K)"
          >
            <kbd className="px-1 py-0.2 rounded bg-white/10 border border-white/15 text-[10px] font-sans font-semibold text-slate-200">
              Ctrl
            </kbd>
            <kbd className="px-1 py-0.2 rounded bg-white/10 border border-white/15 text-[10px] font-mono font-bold text-cyan-300">
              K
            </kbd>
          </button>

          {/* Reset Marks */}
          <button
            onClick={onResetAll}
            className="p-1.5 sm:p-2 rounded-lg bg-obsidian-850 hover:bg-rose-950/40 text-slate-400 hover:text-rose-400 border border-white/10 transition-all"
            title="Reset All Marks to Zero"
          >
            <RotateCcw className="w-4 h-4" />
          </button>
        </div>

      </div>

      {/* Mobile / Tablet Sub-Bar for Cohort, MNG & Curve */}
      <div className="lg:hidden flex items-center justify-between px-3 sm:px-4 py-2 border-t border-white/[0.06] bg-obsidian-950/90 text-xs gap-2 overflow-x-auto no-scrollbar">
        {/* Cohort Selector Pill on Mobile */}
        <button
          onClick={onOpenTrackModal}
          className="flex items-center gap-1 px-2 py-1 rounded-full text-[11px] font-semibold text-cyan-300 bg-cyan-950/60 border border-cyan-500/40 whitespace-nowrap flex-shrink-0"
        >
          <span>{currentTrack.icon}</span>
          <span className="truncate max-w-[120px]">{currentTrack.name}</span>
          <ChevronDown className="w-3 h-3 text-cyan-400" />
        </button>

        <button
          onClick={onToggleGlobalMng}
          className="flex items-center gap-1.5 text-slate-300 hover:text-white transition-colors whitespace-nowrap flex-shrink-0"
        >
          <span className="text-[11px] sm:text-xs text-slate-400">Apt/Soft:</span>
          <span className={`font-semibold text-[11px] sm:text-xs ${isGlobalMng ? 'text-emerald-400' : 'text-indigo-400'}`}>
            {isGlobalMng ? 'MNG (19 Cr)' : 'Graded (23 Cr)'}
          </span>
        </button>

        <div className="flex items-center gap-1 sm:gap-2 whitespace-nowrap flex-shrink-0">
          <select
            value={curveMode}
            onChange={(e) => onCurveChange(e.target.value as CurveMode)}
            className="bg-obsidian-850 border border-white/10 rounded text-[11px] text-slate-200 px-1.5 py-0.5 font-mono focus:border-cyan-500 focus:outline-none"
          >
            <option value="standard">CSE Curve (95+)</option>
            <option value="strict">High Comp (96+)</option>
            <option value="lenient">Tough Paper (91+)</option>
          </select>
          <button
            onClick={onOpenCutoffModal}
            className="p-1 rounded text-slate-400 hover:text-white"
            title="Inspect Cutoffs"
          >
            <HelpCircle className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </header>
  );
};

export default Navbar;
