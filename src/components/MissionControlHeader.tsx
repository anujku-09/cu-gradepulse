import React from 'react';
import { 
  AlertTriangle, 
  Award, 
  CheckCircle2, 
  Layers, 
  TrendingUp, 
  ShieldCheck, 
  Sparkles,
  Info
} from 'lucide-react';
import { SemesterCalculation, CgpaForecast } from '../types';

interface MissionControlHeaderProps {
  calc: SemesterCalculation;
  cgpaForecast: CgpaForecast;
  isGlobalMng: boolean;
  onOpenForecaster: () => void;
  onOpenOptimizer: () => void;
  onToggleMng: () => void;
}

export const MissionControlHeader: React.FC<MissionControlHeaderProps> = ({
  calc,
  cgpaForecast,
  isGlobalMng,
  onOpenForecaster,
  onOpenOptimizer,
  onToggleMng,
}) => {
  const { sgpa, totalGradedCredits, totalEarnedGradePoints, hasBacklog, backlogCourses, totalInternalEarned, totalInternalMax, overallInternalPercentage } = calc;

  // Determine overall SGPA grade category and color
  let sgpaTheme = {
    color: 'text-cyan-400',
    border: 'border-cyan-500/30',
    glow: 'shadow-[0_0_35px_rgba(6,182,212,0.25)]',
    badgeBg: 'bg-cyan-950/80 text-cyan-300 border-cyan-800/60',
    title: 'Outstanding Pace',
    description: 'On track for First Class with Distinction'
  };

  const isUnentered = sgpa === 0;

  if (hasBacklog && backlogCourses.length > 0) {
    sgpaTheme = {
      color: 'text-rose-400',
      border: 'border-rose-500/40',
      glow: 'shadow-[0_0_35px_rgba(239,68,68,0.3)]',
      badgeBg: 'bg-rose-950/80 text-rose-300 border-rose-800/60',
      title: 'Backlog Alert',
      description: 'One or more courses have failing grades (< 40 total marks)'
    };
  } else if (isUnentered) {
    sgpaTheme = {
      color: 'text-slate-300',
      border: 'border-white/10',
      glow: 'shadow-none',
      badgeBg: 'bg-obsidian-850 text-slate-300 border-white/10',
      title: 'Ready to Calculate',
      description: 'Enter your internal marks or external targets below to start simulation'
    };
  } else if (sgpa >= 9.0) {
    sgpaTheme = {
      color: 'text-emerald-400',
      border: 'border-emerald-500/30',
      glow: 'shadow-[0_0_35px_rgba(16,185,129,0.25)]',
      badgeBg: 'bg-emerald-950/80 text-emerald-300 border-emerald-800/60',
      title: 'University Merit Class',
      description: 'Exceptional academic standing (9.0+ SGPA)'
    };
  } else if (sgpa >= 8.0) {
    sgpaTheme = {
      color: 'text-cyan-400',
      border: 'border-cyan-500/30',
      glow: 'shadow-[0_0_35px_rgba(6,182,212,0.25)]',
      badgeBg: 'bg-cyan-950/80 text-cyan-300 border-cyan-800/60',
      title: 'Honors Eligible Pace',
      description: 'Comfortably above 8.0 SGPA threshold'
    };
  } else if (sgpa >= 7.0) {
    sgpaTheme = {
      color: 'text-indigo-400',
      border: 'border-indigo-500/30',
      glow: 'shadow-[0_0_35px_rgba(99,102,241,0.25)]',
      badgeBg: 'bg-indigo-950/80 text-indigo-300 border-indigo-800/60',
      title: 'First Class Standing',
      description: 'Solid performance across core technical subjects'
    };
  } else if (sgpa >= 6.0) {
    sgpaTheme = {
      color: 'text-amber-400',
      border: 'border-amber-500/30',
      glow: 'shadow-[0_0_35px_rgba(245,158,11,0.25)]',
      badgeBg: 'bg-amber-950/80 text-amber-300 border-amber-800/60',
      title: 'Second Class Standing',
      description: 'Consider raising external targets on 4-credit courses'
    };
  } else {
    sgpaTheme = {
      color: 'text-orange-400',
      border: 'border-orange-500/30',
      glow: 'shadow-[0_0_35px_rgba(249,115,22,0.25)]',
      badgeBg: 'bg-orange-950/80 text-orange-300 border-orange-800/60',
      title: 'Marginal Standing',
      description: 'Action needed to elevate external performance'
    };
  }

  return (
    <section className="space-y-4 mb-6">
      {/* Backlog Warning Banner (Only shown if user entered marks that genuinely fail < 40) */}
      {hasBacklog && backlogCourses.length > 0 && (
        <div className="relative overflow-hidden rounded-2xl bg-rose-950/40 border border-rose-500/40 p-4 shadow-[0_0_30px_rgba(239,68,68,0.25)] animate-pulse-glow">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-xl bg-rose-900/60 border border-rose-500/40 text-rose-300">
                <AlertTriangle className="w-5 h-5 text-rose-400" />
              </div>
              <div>
                <h4 className="text-sm font-bold text-rose-200 uppercase tracking-wider flex items-center gap-2">
                  Academic Backlog Alert
                </h4>
                <p className="text-xs text-rose-300/80 mt-0.5">
                  Affected: <span className="font-semibold text-rose-100">{backlogCourses.join(', ')}</span>. In CU, scoring &lt; 40 total marks results in an F grade or MNG Not Qualified status.
                </p>
              </div>
            </div>
            <button
              onClick={onOpenOptimizer}
              className="px-3 py-1.5 rounded-lg bg-rose-900/80 hover:bg-rose-800 text-rose-100 border border-rose-400/40 text-xs font-semibold whitespace-nowrap transition-all shadow-sm"
            >
              Resolve with AI Optimizer →
            </button>
          </div>
        </div>
      )}

      {/* ============================================================== */}
      {/* MOBILE HERO (< 768px): Compact, High-Impact, 60% Less Height    */}
      {/* ============================================================== */}
      <div className="md:hidden space-y-3">
        {/* Mobile SGPA Hero Card */}
        <div className={`glass-card rounded-2xl p-4 relative overflow-hidden flex flex-col justify-between ${sgpaTheme.glow} ${sgpaTheme.border} transition-all`}>
          <div className="absolute -top-10 -right-10 w-36 h-36 bg-gradient-to-br from-cyan-500/10 to-indigo-500/10 rounded-full blur-2xl pointer-events-none" />

          <div>
            <div className="flex items-center justify-between gap-2">
              <span className="text-[11px] font-semibold tracking-wider text-slate-400 uppercase flex items-center gap-1.5 whitespace-nowrap">
                <Award className="w-3.5 h-3.5 text-cyan-400 flex-shrink-0" />
                Live Predicted SGPA
              </span>
              <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold border tracking-wide uppercase whitespace-nowrap ${sgpaTheme.badgeBg}`}>
                {sgpaTheme.title}
              </span>
            </div>

            <div className="mt-2.5 flex items-baseline gap-2">
              <span className={`text-5xl font-extrabold font-mono tracking-tight ${sgpaTheme.color} drop-shadow-md`}>
                {isUnentered ? '--' : sgpa.toFixed(2)}
              </span>
              <span className="text-base font-mono text-slate-400">/ 10.0</span>
            </div>

            <p className="mt-1 text-xs text-slate-300">
              {sgpaTheme.description}
            </p>
          </div>

          <div className="mt-3.5 pt-2.5 border-t border-white/[0.08] flex items-center justify-between gap-2 text-xs text-slate-400 font-mono">
            <div className="flex items-center gap-2">
              <span>Pts: <strong className="text-slate-100 font-semibold">{totalEarnedGradePoints.toFixed(1)}</strong></span>
              <span>•</span>
              <span>Cr: <strong className="text-slate-100 font-semibold">{totalGradedCredits.toFixed(1)}</strong></span>
            </div>
            <button
              onClick={onOpenOptimizer}
              className="text-cyan-400 hover:text-cyan-300 font-sans font-semibold text-[11px] flex items-center gap-1 transition-colors active:scale-95"
            >
              <Sparkles className="w-3 h-3" />
              <span>Target Plan</span>
            </button>
          </div>
        </div>

        {/* 2-Column Compact Metric Row */}
        <div className="grid grid-cols-2 gap-2.5">
          {/* Tile A: Weighted Internals */}
          <div className="glass-card rounded-2xl p-3 flex flex-col justify-between border-white/10">
            <div>
              <span className="text-[10px] font-semibold tracking-wider text-slate-400 uppercase flex items-center gap-1">
                <ShieldCheck className="w-3 h-3 text-emerald-400 flex-shrink-0" />
                <span>Internals</span>
              </span>
              <div className="mt-1.5 text-2xl font-bold font-mono text-emerald-400">
                {isUnentered ? '0.0%' : `${overallInternalPercentage.toFixed(1)}%`}
              </div>
              <div className="mt-1.5 w-full bg-obsidian-800 h-1.5 rounded-full overflow-hidden border border-white/5">
                <div
                  className="h-full bg-gradient-to-r from-emerald-500 to-teal-400 rounded-full"
                  style={{ width: `${Math.min(100, overallInternalPercentage)}%` }}
                />
              </div>
            </div>
            <div className="mt-2 text-[10px] text-slate-400 font-mono truncate">
              {totalInternalEarned.toFixed(1)} / {totalInternalMax.toFixed(1)} wt
            </div>
          </div>

          {/* Tile B: CGPA Shift */}
          <div 
            onClick={onOpenForecaster}
            className="glass-card rounded-2xl p-3 flex flex-col justify-between border-cyan-500/20 active:border-cyan-500/50 cursor-pointer active:scale-98"
          >
            <div>
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-semibold tracking-wider text-slate-400 uppercase flex items-center gap-1">
                  <TrendingUp className="w-3 h-3 text-cyan-400 flex-shrink-0" />
                  <span>CGPA Shift</span>
                </span>
                <span className="text-[9px] text-cyan-400 font-sans">Open →</span>
              </div>
              <div className="mt-1.5 flex items-baseline gap-1.5">
                <span className="text-2xl font-bold font-mono text-white">
                  {cgpaForecast.predictedCgpa.toFixed(2)}
                </span>
                <span className={`px-1 py-0.2 rounded font-bold font-mono text-[9px] ${
                  isUnentered 
                    ? 'bg-obsidian-800 text-slate-400' 
                    : cgpaForecast.cgpaDelta >= 0 ? 'bg-emerald-950/80 text-emerald-400' : 'bg-rose-950/80 text-rose-400'
                }`}>
                  {isUnentered ? '±0.0' : cgpaForecast.cgpaDelta >= 0 ? `+${cgpaForecast.cgpaDelta.toFixed(2)}` : cgpaForecast.cgpaDelta.toFixed(2)}
                </span>
              </div>
            </div>
            <div className="mt-2 text-[10px] text-slate-400 font-mono truncate">
              From {cgpaForecast.previousCgpa.toFixed(2)} baseline
            </div>
          </div>
        </div>
      </div>

      {/* ============================================================== */}
      {/* DESKTOP BENTO GRID HERO (>= 768px - hidden md:grid)            */}
      {/* ============================================================== */}
      <div className="hidden md:grid md:grid-cols-2 lg:grid-cols-12 gap-4">
        
        {/* Bento 1: Real-Time SGPA Gauge (5 cols) */}
        <div className={`lg:col-span-5 glass-card rounded-2xl p-4 sm:p-6 relative overflow-hidden flex flex-col justify-between ${sgpaTheme.glow} ${sgpaTheme.border} transition-all`}>
          <div className="absolute -top-12 -right-12 w-48 h-48 bg-gradient-to-br from-cyan-500/10 to-indigo-500/10 rounded-full blur-3xl pointer-events-none" />

          <div>
            <div className="flex items-center justify-between gap-2">
              <span className="text-xs font-semibold tracking-wider text-slate-400 uppercase flex items-center gap-1.5 whitespace-nowrap">
                <Award className="w-4 h-4 text-cyan-400 flex-shrink-0" />
                Live Predicted SGPA
              </span>
              <span className={`px-2 sm:px-2.5 py-0.5 rounded-full text-[10px] sm:text-xs font-bold border tracking-wide uppercase whitespace-nowrap ${sgpaTheme.badgeBg}`}>
                {sgpaTheme.title}
              </span>
            </div>

            <div className="mt-3 sm:mt-4 flex items-baseline gap-2 sm:gap-3">
              <span className={`text-5xl sm:text-6xl md:text-7xl font-extrabold font-mono tracking-tight ${sgpaTheme.color} drop-shadow-md`}>
                {isUnentered ? '--' : sgpa.toFixed(2)}
              </span>
              <span className="text-lg sm:text-xl font-mono text-slate-400">/ 10.0</span>
            </div>

            <p className="mt-1.5 sm:mt-2 text-xs text-slate-300">
              {sgpaTheme.description}
            </p>
          </div>

          <div className="mt-5 sm:mt-6 pt-3 sm:pt-4 border-t border-white/[0.08] flex flex-wrap items-center justify-between gap-2 text-xs text-slate-400 font-mono">
            <span>Points: <strong className="text-slate-100 font-semibold">{totalEarnedGradePoints.toFixed(1)}</strong></span>
            <span>Credits: <strong className="text-slate-100 font-semibold">{totalGradedCredits.toFixed(1)}</strong></span>
            <button
              onClick={onOpenOptimizer}
              className="text-cyan-400 hover:text-cyan-300 font-sans font-medium flex items-center gap-1 transition-colors ml-auto sm:ml-0"
            >
              <Sparkles className="w-3.5 h-3.5" />
              Target SGPA Plan
            </button>
          </div>
        </div>

        {/* Bento 2: Graded Credits Breakdown & Batch Switch (3 cols) */}
        <div className="lg:col-span-3 glass-card rounded-2xl p-4 sm:p-5 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold tracking-wider text-slate-400 uppercase flex items-center gap-1.5">
                <Layers className="w-4 h-4 text-indigo-400" />
                Graded Credits
              </span>
              <span className="text-[11px] font-mono text-indigo-300 bg-indigo-950/60 px-2 py-0.5 rounded border border-indigo-800/40">
                Sem V Matrix
              </span>
            </div>

            <div className="mt-4">
              <div className="flex items-baseline gap-2">
                <span className="text-4xl font-bold font-mono text-white">
                  {totalGradedCredits.toFixed(1)}
                </span>
                <span className="text-sm font-mono text-slate-400">/ 23.0 Max</span>
              </div>

              {/* Progress bar of credits */}
              <div className="mt-3 w-full bg-obsidian-800 h-2 rounded-full overflow-hidden border border-white/5">
                <div
                  className="h-full bg-gradient-to-r from-indigo-500 to-cyan-400 rounded-full transition-all duration-500"
                  style={{ width: `${(totalGradedCredits / 23.0) * 100}%` }}
                />
              </div>
            </div>

            <div className="mt-4 p-2.5 rounded-xl bg-obsidian-850/80 border border-white/5 text-[11px] text-slate-300 space-y-1">
              <div className="flex justify-between">
                <span>Core Graded:</span>
                <span className="font-mono text-slate-200">19.0 Credits</span>
              </div>
              <div className="flex justify-between items-center">
                <span>Apt & Soft Skills:</span>
                <button
                  onClick={onToggleMng}
                  className="font-mono text-[10px] text-cyan-400 underline hover:text-cyan-300"
                >
                  {isGlobalMng ? '0.0 (MNG Pass/Fail)' : '4.0 (Graded)'}
                </button>
              </div>
            </div>
          </div>

          <div className="mt-3 text-[11px] text-slate-400 flex items-center gap-1">
            <Info className="w-3.5 h-3.5 text-slate-500 flex-shrink-0" />
            <span>MNG courses require ≥ 40 to pass.</span>
          </div>
        </div>

        {/* Bento 3: Weighted Internal Performance Meter (2 cols) */}
        <div className="lg:col-span-2 glass-card rounded-2xl p-4 sm:p-5 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold tracking-wider text-slate-400 uppercase flex items-center gap-1.5">
                <ShieldCheck className="w-4 h-4 text-emerald-400" />
                Internals {isGlobalMng && <span className="text-[10px] text-cyan-400 font-mono font-normal normal-case">(Graded)</span>}
              </span>
            </div>

            <div className="mt-4">
              <div className="text-3xl font-bold font-mono text-emerald-400">
                {isUnentered ? '0.0%' : `${overallInternalPercentage.toFixed(1)}%`}
              </div>
              <p className="text-xs text-slate-300 mt-1 font-mono">
                {totalInternalEarned.toFixed(1)} / {totalInternalMax.toFixed(1)} wt secured
              </p>
              <span className="text-[10px] text-slate-500 font-mono block mt-0.5">
                Across {isGlobalMng ? '6 Core Subjects' : '8 Graded Subjects'}
              </span>
            </div>

            <div className="mt-4 w-full bg-obsidian-800 h-2 rounded-full overflow-hidden border border-white/5">
              <div
                className="h-full bg-gradient-to-r from-emerald-500 to-teal-400 rounded-full transition-all duration-500"
                style={{ width: `${Math.min(100, overallInternalPercentage)}%` }}
              />
            </div>
          </div>

          <div className="mt-3 text-[11px] text-slate-400">
            {isUnentered ? (
              <span className="text-slate-400">Awaiting marks entry</span>
            ) : hasBacklog ? (
              <span className="text-rose-400 font-medium">⚠ Risk of backlog (&lt; 40 marks)</span>
            ) : sgpa >= 8.5 ? (
              <span className="text-emerald-400 font-medium">✓ Excellent standing for Grade A/A+</span>
            ) : overallInternalPercentage >= 75 ? (
              <span className="text-emerald-400 font-medium">✓ Strong internal buffer</span>
            ) : overallInternalPercentage >= 50 ? (
              <span className="text-cyan-400 font-medium">✓ Balanced internal standing</span>
            ) : (
              <span className="text-amber-400 font-medium">Target higher externals to boost grade</span>
            )}
          </div>
        </div>

        {/* Bento 4: Cumulative CGPA Quick Forecaster (2 cols) */}
        <div 
          onClick={onOpenForecaster}
          className="lg:col-span-2 glass-card glass-card-hover rounded-2xl p-4 sm:p-5 flex flex-col justify-between cursor-pointer border-cyan-500/20 hover:border-cyan-500/50"
        >
          <div>
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold tracking-wider text-slate-400 uppercase flex items-center gap-1.5">
                <TrendingUp className="w-4 h-4 text-cyan-400" />
                CGPA Shift
              </span>
              <span className="text-[10px] text-cyan-400 underline font-sans">Open</span>
            </div>

            <div className="mt-4">
              <div className="text-3xl font-bold font-mono text-white">
                {cgpaForecast.predictedCgpa.toFixed(2)}
              </div>
              <div className="flex items-center gap-1.5 mt-1 font-mono text-xs">
                <span className="text-slate-400">From {cgpaForecast.previousCgpa.toFixed(2)}</span>
                <span className={`px-1.5 py-0.2 rounded font-bold text-[11px] ${
                  isUnentered 
                    ? 'bg-obsidian-800 text-slate-400' 
                    : cgpaForecast.cgpaDelta >= 0 ? 'bg-emerald-950/80 text-emerald-400' : 'bg-rose-950/80 text-rose-400'
                }`}>
                  {isUnentered ? '±0.00' : cgpaForecast.cgpaDelta >= 0 ? `+${cgpaForecast.cgpaDelta.toFixed(2)}` : cgpaForecast.cgpaDelta.toFixed(2)}
                </span>
              </div>
            </div>
          </div>

          <div className="mt-3 text-[11px] text-slate-400 flex items-center justify-between">
            <span>Cumulative Forecast</span>
            <span className="text-slate-200 font-mono">→</span>
          </div>
        </div>

      </div>
    </section>
  );
};
