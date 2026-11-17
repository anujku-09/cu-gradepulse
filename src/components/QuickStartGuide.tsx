import React, { useState } from 'react';
import { 
  Sparkles, 
  HelpCircle, 
  X, 
  ChevronRight, 
  Edit3, 
  Sliders, 
  Award, 
  RotateCcw, 
  ClipboardPaste,
  Eye,
  CheckCircle2,
  Zap,
  CalendarCheck
} from 'lucide-react';

interface QuickStartGuideProps {
  isDetailedView: boolean;
  onToggleDetailedView: () => void;
  onStartBlank: () => void;
  onLoadSample: () => void;
  onOpenPasteModal: () => void;
  onOpenWizard?: () => void;
  onClaimAllAttendance?: () => void;
}

export const QuickStartGuide: React.FC<QuickStartGuideProps> = ({
  isDetailedView,
  onToggleDetailedView,
  onStartBlank,
  onLoadSample,
  onOpenPasteModal,
  onOpenWizard,
  onClaimAllAttendance,
}) => {
  const [isDismissed, setIsDismissed] = useState(false);

  return (
    <div className="mb-6 space-y-3">
      {/* Top Quick Actions Bar (Responsive across all screens) */}
      <div className="p-3 sm:p-3.5 rounded-2xl glass-card border border-white/10 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        {/* Left: Mode description & quick setup */}
        <div className="flex flex-wrap items-center gap-2">
          <div className="flex items-center gap-1.5 mr-1">
            <span className="flex h-2 w-2 rounded-full bg-cyan-400 animate-pulse" />
            <span className="text-[11px] sm:text-xs text-slate-300 font-medium">
              Mode:
            </span>
          </div>
          {onOpenWizard && (
            <button
              onClick={onOpenWizard}
              className="px-3 py-1 rounded-lg text-xs font-bold bg-gradient-to-r from-cyan-500/20 via-indigo-500/20 to-violet-500/20 hover:from-cyan-500/30 hover:to-indigo-500/30 text-cyan-300 border border-cyan-500/40 shadow-[0_0_12px_rgba(6,182,212,0.25)] flex items-center gap-1.5 transition-all touch-manipulation"
              title="Launch step-by-step card flow to configure your subjects one by one"
            >
              <Zap className="w-3.5 h-3.5 text-cyan-400" />
              <span>⚡ Step-by-Step Card Flow</span>
            </button>
          )}

          {onClaimAllAttendance && (
            <button
              onClick={onClaimAllAttendance}
              className="px-2.5 py-1 rounded-lg text-xs font-semibold bg-emerald-950/60 hover:bg-emerald-900/80 text-emerald-300 border border-emerald-700/50 flex items-center gap-1.5 transition-all touch-manipulation"
              title="Award full attendance marks for all subjects (≥75% attendance rule)"
            >
              <CalendarCheck className="w-3.5 h-3.5 text-emerald-400" />
              <span>Claim All Attendance</span>
            </button>
          )}

          <button
            onClick={onStartBlank}
            className="px-2.5 py-1 rounded-lg text-xs font-semibold bg-obsidian-850 hover:bg-rose-950/60 text-slate-200 hover:text-rose-300 border border-white/10 flex items-center gap-1.5 transition-all touch-manipulation"
            title="Reset all fields to 0 to enter your actual marks"
          >
            <RotateCcw className="w-3.5 h-3.5 text-rose-400" />
            <span>Clear / Start Blank</span>
          </button>

          <button
            onClick={onLoadSample}
            className="px-2.5 py-1 rounded-lg text-xs font-semibold bg-cyan-950/70 hover:bg-cyan-900/80 text-cyan-300 border border-cyan-700/60 flex items-center gap-1.5 transition-all touch-manipulation"
            title="Populate with realistic sample CSE marks"
          >
            <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
            <span>Load Sample CSE Marks</span>
          </button>
        </div>

        {/* Right: Paste and View Switch */}
        <div className="flex items-center gap-2 justify-between sm:justify-end border-t sm:border-t-0 pt-2 sm:pt-0 border-white/5">
          <button
            onClick={onOpenPasteModal}
            className="px-2.5 py-1 rounded-lg text-xs font-semibold bg-indigo-950/80 hover:bg-indigo-900 text-indigo-200 border border-indigo-700/60 flex items-center gap-1.5 transition-all shadow-sm touch-manipulation"
          >
            <ClipboardPaste className="w-3.5 h-3.5 text-indigo-400" />
            <span>Paste from CUIMS</span>
          </button>

          <div className="w-[1px] h-4 bg-white/10 hidden sm:block" />

          {/* View Mode Switch */}
          <button
            onClick={onToggleDetailedView}
            className="px-2.5 py-1 rounded-lg text-xs font-mono font-medium text-slate-300 bg-obsidian-850 border border-white/10 hover:border-cyan-500/40 transition-all flex items-center gap-1.5 touch-manipulation"
          >
            <Eye className="w-3.5 h-3.5 text-cyan-400" />
            <span>{isDetailedView ? 'Detailed' : 'Simple'}</span>
          </button>
        </div>
      </div>

      {/* Explanatory 3-Step Guide (Can be dismissed) */}
      {!isDismissed && (
        <div className="relative p-4 sm:p-5 rounded-2xl bg-gradient-to-r from-obsidian-850 via-obsidian-850 to-indigo-950/40 border border-cyan-500/20 shadow-lg">
          <button
            onClick={() => setIsDismissed(true)}
            className="absolute top-3 right-3 text-slate-500 hover:text-slate-300 p-1 transition-colors"
            title="Dismiss guide"
          >
            <X className="w-4 h-4" />
          </button>

          <div className="flex items-center gap-2 mb-3">
            <HelpCircle className="w-4 h-4 text-cyan-400" />
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-200 font-mono">
              How To Use CU GradePulse in 3 Simple Steps:
            </h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            {/* Step 1 */}
            <div className="p-3 rounded-xl bg-obsidian-900/80 border border-white/5 space-y-1">
              <div className="flex items-center gap-2">
                <span className="w-5 h-5 rounded-full bg-cyan-500/20 text-cyan-300 font-mono font-bold text-xs flex items-center justify-center border border-cyan-500/40">
                  1
                </span>
                <span className="text-xs font-semibold text-slate-200">
                  Enter Your Internals
                </span>
              </div>
              <p className="text-[11px] text-slate-400 leading-snug">
                Type your total internal score directly into each card, or expand the breakdown to enter individual experiment marks.
              </p>
            </div>

            {/* Step 2 */}
            <div className="p-3 rounded-xl bg-obsidian-900/80 border border-white/5 space-y-1">
              <div className="flex items-center gap-2">
                <span className="w-5 h-5 rounded-full bg-indigo-500/20 text-indigo-300 font-mono font-bold text-xs flex items-center justify-center border border-indigo-500/40">
                  2
                </span>
                <span className="text-xs font-semibold text-slate-200">
                  Set External Targets
                </span>
              </div>
              <p className="text-[11px] text-slate-400 leading-snug">
                Drag the target slider or type your expected external exam marks (e.g. 45/60). Watch tick-marks show the marks required for Grade A+.
              </p>
            </div>

            {/* Step 3 */}
            <div className="p-3 rounded-xl bg-obsidian-900/80 border border-white/5 space-y-1">
              <div className="flex items-center gap-2">
                <span className="w-5 h-5 rounded-full bg-emerald-500/20 text-emerald-300 font-mono font-bold text-xs flex items-center justify-center border border-emerald-500/40">
                  3
                </span>
                <span className="text-xs font-semibold text-slate-200">
                  Instant SGPA & CGPA
                </span>
              </div>
              <p className="text-[11px] text-slate-400 leading-snug">
                The top Mission Control hub computes your exact Chandigarh University SGPA, graded credits, and cumulative degree CGPA in real time.
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
