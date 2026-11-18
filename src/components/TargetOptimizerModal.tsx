import React, { useState, useMemo } from 'react';
import { 
  X, 
  Sparkles, 
  CheckCircle2, 
  AlertTriangle, 
  ArrowRight, 
  Flame, 
  Zap, 
  Compass,
  Sliders,
  Check
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { Course, GradeCutoffs, GradeLevel, StrategyPlan } from '../types';
import { generateSgpaStrategy } from '../utils/optimizer';
import { GRADE_COLORS } from '../utils/gradeCalculations';

interface TargetOptimizerModalProps {
  courses: Course[];
  globalCutoffs: GradeCutoffs;
  currentSgpa: number;
  isOpen: boolean;
  onClose: () => void;
  onApplyStrategy: (roadmap: { courseId: string; targetExternal: number; targetGrade?: GradeLevel }[]) => void;
}

export const TargetOptimizerModal: React.FC<TargetOptimizerModalProps> = ({
  courses,
  globalCutoffs,
  currentSgpa,
  isOpen,
  onClose,
  onApplyStrategy,
}) => {
  const [targetSgpa, setTargetSgpa] = useState<number>(() => {
    return Math.min(10.0, Math.max(7.5, Math.ceil((currentSgpa + 0.3) * 10) / 10));
  });
  const [applied, setApplied] = useState(false);

  // Generate strategy plan
  const plan: StrategyPlan = useMemo(() => {
    return generateSgpaStrategy(targetSgpa, courses, globalCutoffs);
  }, [targetSgpa, courses, globalCutoffs]);

  // Separate graded vs non-graded courses for unambiguous transparency
  const gradedPlan = useMemo(() => plan.courses.filter(c => !c.isNonGraded), [plan.courses]);
  const nonGradedPlan = useMemo(() => plan.courses.filter(c => !!c.isNonGraded), [plan.courses]);

  const handleApply = () => {
    const roadmap = plan.courses.map(c => ({
      courseId: c.courseId,
      targetExternal: c.targetExternalRaw,
      targetGrade: c.targetGrade
    }));

    onApplyStrategy(roadmap);
    setApplied(true);

    try {
      confetti({
        particleCount: 80,
        spread: 70,
        origin: { y: 0.6 }
      });
    } catch (e) {
      // ignore
    }

    setTimeout(() => {
      onClose();
    }, 700);
  };

  const getDifficultyBadge = (diff: string) => {
    switch (diff) {
      case 'Achieved':
        return <span className="px-2 py-0.5 rounded text-[10px] font-bold font-mono bg-emerald-950/80 text-emerald-400 border border-emerald-800/60">Secured</span>;
      case 'Comfortable':
        return <span className="px-2 py-0.5 rounded text-[10px] font-bold font-mono bg-cyan-950/80 text-cyan-400 border border-cyan-800/60">Moderate</span>;
      case 'Challenging':
        return <span className="px-2 py-0.5 rounded text-[10px] font-bold font-mono bg-amber-950/80 text-amber-400 border border-amber-800/60">Challenging</span>;
      case 'Maximum Effort':
        return <span className="px-2 py-0.5 rounded text-[10px] font-bold font-mono bg-rose-950/80 text-rose-400 border border-rose-800/60">Maximum Effort</span>;
      default:
        return <span className="px-2 py-0.5 rounded text-[10px] font-bold font-mono bg-slate-800 text-slate-400">Impossible</span>;
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[70] overflow-y-auto bg-obsidian-950/85 backdrop-blur-md flex items-center justify-center p-3 sm:p-4 animate-fadeIn">
      <div className="relative w-full max-w-2xl bg-obsidian-900 border border-white/10 rounded-2xl shadow-2xl p-4 sm:p-6 overflow-hidden max-h-[92vh] flex flex-col justify-between">
        
        {/* Glow ambient background */}
        <div className="absolute -top-16 -right-16 w-56 h-56 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />

        {/* Modal Header */}
        <div className="flex items-start sm:items-center justify-between pb-3 sm:pb-4 border-b border-white/10 gap-3">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-indigo-950/80 border border-indigo-500/40 text-indigo-400 shadow-[0_0_15px_rgba(99,102,241,0.3)] flex-shrink-0">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base sm:text-lg font-bold text-white flex items-center gap-1.5 sm:gap-2 flex-wrap">
                Target SGPA Reverse-Optimizer
                <span className="text-[9px] sm:text-[10px] uppercase font-mono px-1.5 py-0.2 rounded bg-indigo-900/60 text-indigo-300 border border-indigo-700/60">
                  AI Strategy Engine
                </span>
              </h2>
              <p className="text-[11px] sm:text-xs text-slate-400">
                Calculates the easiest realistic external exam roadmap across all courses
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-lg bg-obsidian-800 hover:bg-obsidian-700 text-slate-400 hover:text-white transition-colors touch-manipulation flex-shrink-0"
            title="Close optimizer"
          >
            <X className="w-4 h-4 sm:w-5 sm:h-5" />
          </button>
        </div>

        {/* Dream SGPA Slider Control */}
        <div className="my-5 p-4 rounded-xl bg-obsidian-850/80 border border-white/10 space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-300 uppercase tracking-wider font-mono">
              Target SGPA Goal:
            </span>
            <div className="flex items-baseline gap-2">
              <span className="text-3xl font-extrabold font-mono text-cyan-400">
                {targetSgpa.toFixed(2)}
              </span>
              <span className="text-xs text-slate-400 font-mono">/ 10.0</span>
            </div>
          </div>

          <input
            type="range"
            min="6.0"
            max="10.0"
            step="0.05"
            value={targetSgpa}
            onChange={(e) => setTargetSgpa(parseFloat(e.target.value))}
            className="w-full h-2 bg-obsidian-950 rounded-lg slider-tactile appearance-none border border-white/10"
          />

          <div className="flex justify-between text-[11px] font-mono text-slate-400">
            <span>6.0 (Passing)</span>
            <span>7.5 (Distinction)</span>
            <span>8.5 (Honors)</span>
            <span>10.0 (Perfect)</span>
          </div>
        </div>

        {/* Strategy Summary Banner */}
        <div className={`p-3.5 rounded-xl border text-xs flex items-start gap-3 mb-4 ${
          plan.feasible
            ? 'bg-emerald-950/30 border-emerald-500/30 text-emerald-200'
            : 'bg-amber-950/30 border-amber-500/30 text-amber-200'
        }`}>
          {plan.feasible ? (
            <CheckCircle2 className="w-5 h-5 text-emerald-400 flex-shrink-0 mt-0.5" />
          ) : (
            <AlertTriangle className="w-5 h-5 text-amber-400 flex-shrink-0 mt-0.5" />
          )}
          <div>
            <div className="font-semibold text-slate-100 flex items-center gap-2">
              <span>{plan.feasible ? 'Target Feasible & Achievable' : 'Target Exceeds Theoretical Ceiling'}</span>
              <span className="font-mono text-[11px] text-cyan-300">
                (Projected: {plan.achievableSgpa.toFixed(2)} SGPA)
              </span>
            </div>
            <p className="mt-1 text-slate-300 text-[11px] leading-relaxed">
              {plan.summary}
            </p>
          </div>
        </div>

        {/* Roadmap Course List */}
        <div className="space-y-3 max-h-[330px] overflow-y-auto pr-1">
          {/* Core Graded Courses (Affects SGPA) */}
          <div>
            <div className="flex items-center justify-between text-xs font-semibold text-slate-300 pb-1.5 border-b border-white/5 mb-2">
              <span className="flex items-center gap-1.5 text-cyan-400">
                <span>Core Graded Courses ({gradedPlan.reduce((acc, c) => acc + c.credits, 0).toFixed(1)} Credits)</span>
              </span>
              <span className="text-[10px] text-slate-500 font-mono">Directly dictates SGPA</span>
            </div>

            <div className="space-y-2">
              {gradedPlan.map((item) => {
                const gTheme = GRADE_COLORS[item.targetGrade];

                return (
                  <div
                    key={item.courseId}
                    className="p-3 rounded-xl bg-obsidian-850/60 border border-white/5 flex flex-col gap-1.5 text-xs hover:border-white/10 transition-colors"
                  >
                    <div className="flex items-center justify-between gap-3">
                      <div className="flex items-center gap-2.5 min-w-0">
                        <span className={`w-8 h-8 rounded-lg font-mono font-bold text-xs flex items-center justify-center border flex-shrink-0 ${gTheme.bg} ${gTheme.border} ${gTheme.text}`}>
                          {item.targetGrade}
                        </span>
                        <div className="min-w-0">
                          <div className="flex items-center gap-1.5">
                            <span className="font-mono font-semibold text-slate-200">{item.code}</span>
                            <span className="text-[10px] text-slate-400 font-mono">{item.credits.toFixed(1)} Cr</span>
                            {item.credits >= 4.0 && (
                              <span className="text-[9px] font-bold font-mono px-1 py-0.2 rounded bg-indigo-950 text-indigo-300 border border-indigo-700/50">
                                High Weight
                              </span>
                            )}
                          </div>
                          <div className="text-[11px] text-slate-300 truncate">
                            {item.name}
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center gap-3 text-right flex-shrink-0">
                        <div>
                          <span className="font-mono font-bold text-cyan-400 text-sm">
                            {item.targetExternalRaw}
                          </span>
                          <span className="font-mono text-slate-400 text-xs"> / {item.maxExternalRaw}</span>
                          <div className="text-[10px] text-slate-400 font-mono">
                            Target External
                          </div>
                        </div>

                        <div>
                          {getDifficultyBadge(item.difficulty)}
                        </div>
                      </div>
                    </div>

                    {item.note && (
                      <div className="text-[10px] text-slate-400 font-mono bg-obsidian-900/70 px-2 py-1 rounded border border-white/5">
                        {item.note}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>

          {/* Non-Graded Courses Section (MNG Mode) */}
          {nonGradedPlan.length > 0 && (
            <div className="pt-2">
              <div className="flex items-center justify-between text-xs font-semibold text-slate-300 pb-1.5 border-b border-white/5 mb-2">
                <span className="flex items-center gap-1.5 text-emerald-400">
                  <span>Non-Graded Track (MNG Pass/Fail • 0 Credits to SGPA)</span>
                </span>
                <span className="text-[10px] text-slate-500 font-mono">Threshold: ≥ 40/100 to avoid backlog</span>
              </div>

              <div className="space-y-2">
                {nonGradedPlan.map((item) => {
                  return (
                    <div
                      key={item.courseId}
                      className="p-3 rounded-xl bg-obsidian-850/40 border border-emerald-500/20 flex flex-col gap-1.5 text-xs"
                    >
                      <div className="flex items-center justify-between gap-3">
                        <div className="flex items-center gap-2.5 min-w-0">
                          <span className="px-2 py-1 rounded-lg font-mono font-bold text-[10px] bg-emerald-950 text-emerald-300 border border-emerald-700/60 flex-shrink-0">
                            QUALIFY
                          </span>
                          <div className="min-w-0">
                            <div className="flex items-center gap-1.5">
                              <span className="font-mono font-semibold text-slate-200">{item.code}</span>
                              <span className="text-[10px] text-slate-400 font-mono">MNG Mode</span>
                            </div>
                            <div className="text-[11px] text-slate-400 truncate">
                              {item.name}
                            </div>
                          </div>
                        </div>

                        <div className="flex items-center gap-3 text-right flex-shrink-0">
                          <div>
                            <span className="font-mono font-bold text-emerald-400 text-sm">
                              {item.targetExternalRaw}
                            </span>
                            <span className="font-mono text-slate-400 text-xs"> / {item.maxExternalRaw}</span>
                            <div className="text-[10px] text-slate-400 font-mono">
                              Min Ext to Pass
                            </div>
                          </div>

                          <div>
                            {getDifficultyBadge(item.difficulty)}
                          </div>
                        </div>
                      </div>

                      {item.note && (
                        <div className="text-[10px] text-slate-400 font-mono bg-obsidian-900/70 px-2 py-1 rounded border border-white/5">
                          {item.note}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </div>

        {/* Footer Actions (Responsive: full width stacked on mobile, inline on desktop) */}
        <div className="mt-4 sm:mt-5 pt-3 sm:pt-4 border-t border-white/10 flex flex-col-reverse sm:flex-row items-stretch sm:items-center justify-between gap-2.5">
          <button
            onClick={onClose}
            className="px-4 py-2.5 sm:py-2 rounded-xl bg-obsidian-800 hover:bg-obsidian-700 text-slate-300 text-xs font-semibold border border-white/10 transition-colors text-center touch-manipulation"
          >
            Cancel
          </button>

          <button
            onClick={handleApply}
            disabled={applied}
            className="px-5 py-2.5 sm:py-2 rounded-xl bg-gradient-to-r from-indigo-600 via-cyan-600 to-emerald-600 hover:from-indigo-500 hover:to-emerald-500 text-white text-xs font-bold flex items-center justify-center gap-2 shadow-[0_0_20px_rgba(6,182,212,0.4)] transition-all touch-manipulation"
          >
            {applied ? (
              <>
                <Check className="w-4 h-4" />
                <span>Roadmap Applied!</span>
              </>
            ) : (
              <>
                <Zap className="w-4 h-4" />
                <span>Apply Roadmap to Live Sliders</span>
              </>
            )}
          </button>
        </div>

      </div>
    </div>
  );
};
