import React, { useState } from 'react';
import { 
  X, 
  HelpCircle, 
  Sliders, 
  Layers, 
  Check, 
  RotateCcw,
  Sparkles,
  Info
} from 'lucide-react';
import { CurveMode, GradeCutoffs, GradeLevel } from '../types';
import { CURVE_PRESETS, GRADE_COLORS, GRADE_POINTS } from '../utils/gradeCalculations';

interface GradeCutoffModalProps {
  isOpen: boolean;
  onClose: () => void;
  curveMode: CurveMode;
  onCurveChange: (mode: CurveMode) => void;
  currentCutoffs: GradeCutoffs;
  onSaveCutoffs: (cutoffs: GradeCutoffs) => void;
}

export const GradeCutoffModal: React.FC<GradeCutoffModalProps> = ({
  isOpen,
  onClose,
  curveMode,
  onCurveChange,
  currentCutoffs,
  onSaveCutoffs,
}) => {
  if (!isOpen) return null;

  const [localCutoffs, setLocalCutoffs] = useState<GradeCutoffs>(currentCutoffs);

  const handlePresetSelect = (mode: Exclude<CurveMode, 'custom'>) => {
    onCurveChange(mode);
    setLocalCutoffs(CURVE_PRESETS[mode]);
  };

  const handleSave = () => {
    onSaveCutoffs(localCutoffs);
    onClose();
  };

  const gradeTiers: GradeLevel[] = ['A+', 'A', 'B+', 'B', 'C+', 'C', 'D'];

  return (
    <div className="fixed inset-0 z-[70] overflow-y-auto bg-obsidian-950/85 backdrop-blur-md flex items-center justify-center p-3 sm:p-4 animate-fadeIn">
      <div className="relative w-full max-w-xl bg-obsidian-900 border border-white/10 rounded-2xl shadow-2xl p-4 sm:p-6 overflow-hidden max-h-[92vh] flex flex-col justify-between">
        
        {/* Modal Header */}
        <div className="flex items-start sm:items-center justify-between pb-3 sm:pb-4 border-b border-white/10 gap-3">
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-xl bg-cyan-950/80 border border-cyan-500/40 text-cyan-400 flex-shrink-0">
              <Sliders className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base sm:text-lg font-bold text-white flex items-center gap-1.5 sm:gap-2 flex-wrap">
                CU Relative Grading Simulator
              </h2>
              <p className="text-[11px] sm:text-xs text-slate-400">
                Understand and tune grade cutoff thresholds based on examination difficulty
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-lg bg-obsidian-800 hover:bg-obsidian-700 text-slate-400 hover:text-white transition-colors touch-manipulation flex-shrink-0"
            title="Close simulator"
          >
            <X className="w-4 h-4 sm:w-5 sm:h-5" />
          </button>
        </div>

        {/* CU Relative Curve Explainer */}
        <div className="my-4 p-3.5 rounded-xl bg-cyan-950/20 border border-cyan-500/30 text-xs text-cyan-200/90 space-y-1.5">
          <div className="flex items-center gap-1.5 font-semibold text-cyan-300">
            <Info className="w-4 h-4 text-cyan-400 flex-shrink-0" />
            <span>Chandigarh University (CSE) Relative Grading Reality:</span>
          </div>
          <p className="text-[11px] text-slate-300 leading-relaxed">
            There is <strong className="text-white">no fixed guaranteed cutoff line</strong>. Grades are awarded on a percentile bell curve across all CSE sections. Because internal marks are competitive across the batch, students usually need <strong className="text-cyan-300 font-mono">95–96+ for A+</strong> and <strong className="text-indigo-300 font-mono">88–90+ for A</strong> to remain in the safe top percentiles.
          </p>
        </div>

        {/* Presets selector */}
        <div className="space-y-2 mb-4">
          <span className="text-xs font-semibold text-slate-300 uppercase tracking-wider font-mono">
            CSE Cohort Curve Models:
          </span>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
            <button
              onClick={() => handlePresetSelect('standard')}
              className={`p-2.5 rounded-xl border text-xs font-semibold transition-all touch-manipulation ${
                curveMode === 'standard'
                  ? 'bg-cyan-950/60 border-cyan-500 text-cyan-300'
                  : 'bg-obsidian-850 border-white/5 text-slate-400 hover:text-slate-200'
              }`}
            >
              <div>CU CSE Reality</div>
              <div className="text-[10px] font-mono opacity-80 mt-0.5">A+ ≥ 95 • A ≥ 88</div>
            </button>

            <button
              onClick={() => handlePresetSelect('strict')}
              className={`p-2.5 rounded-xl border text-xs font-semibold transition-all touch-manipulation ${
                curveMode === 'strict'
                  ? 'bg-rose-950/60 border-rose-500 text-rose-300'
                  : 'bg-obsidian-850 border-white/5 text-slate-400 hover:text-slate-200'
              }`}
            >
              <div>High Competition</div>
              <div className="text-[10px] font-mono opacity-80 mt-0.5">A+ ≥ 96 • A ≥ 90</div>
            </button>

            <button
              onClick={() => handlePresetSelect('lenient')}
              className={`p-2.5 rounded-xl border text-xs font-semibold transition-all touch-manipulation ${
                curveMode === 'lenient'
                  ? 'bg-amber-950/60 border-amber-500 text-amber-300'
                  : 'bg-obsidian-850 border-white/5 text-slate-400 hover:text-slate-200'
              }`}
            >
              <div>Tough Exam Cohort</div>
              <div className="text-[10px] font-mono opacity-80 mt-0.5">A+ ≥ 91 • A ≥ 84</div>
            </button>
          </div>
        </div>

        {/* Cutoff Thresholds Grid (Responsive) */}
        <div className="space-y-2 mb-4 sm:mb-5">
          <span className="text-xs font-semibold text-slate-300 uppercase tracking-wider font-mono">
            Active Cutoff Thresholds (Score ≥ Target):
          </span>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 max-h-[220px] overflow-y-auto pr-1">
            {gradeTiers.map(g => {
              const gTheme = GRADE_COLORS[g];
              return (
                <div
                  key={g}
                  className="p-2 sm:p-2.5 rounded-xl bg-obsidian-850/80 border border-white/5 flex items-center justify-between text-xs"
                >
                  <div className="flex items-center gap-2">
                    <span className={`w-7 h-7 rounded-lg font-mono font-bold text-xs flex items-center justify-center border ${gTheme.bg} ${gTheme.border} ${gTheme.text}`}>
                      {g}
                    </span>
                    <span className="font-semibold text-slate-200">
                      Grade {g} <span className="text-slate-400 font-mono text-[10px]">[{GRADE_POINTS[g]}]</span>
                    </span>
                  </div>

                  <div className="flex items-center gap-1">
                    <span className="text-slate-500 text-xs">≥</span>
                    <input
                      type="number"
                      min="0"
                      max="100"
                      value={localCutoffs[g]}
                      onChange={(e) => setLocalCutoffs(prev => ({ ...prev, [g]: parseFloat(e.target.value) || 0 }))}
                      className="w-20 px-2 py-1 rounded text-center num-input text-xs font-bold text-cyan-300"
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Footer Actions (Responsive) */}
        <div className="pt-3 sm:pt-4 border-t border-white/10 flex flex-col-reverse sm:flex-row items-stretch sm:items-center justify-between gap-2.5">
          <button
            onClick={() => handlePresetSelect('standard')}
            className="px-3 py-2 sm:py-1.5 rounded-lg bg-obsidian-850 hover:bg-obsidian-800 text-slate-400 text-xs font-medium border border-white/10 flex items-center justify-center gap-1 touch-manipulation"
          >
            <RotateCcw className="w-3.5 h-3.5" /> Reset Standard
          </button>

          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2">
            <button
              onClick={onClose}
              className="px-4 py-2 rounded-xl bg-obsidian-800 hover:bg-obsidian-700 text-slate-300 text-xs font-semibold border border-white/10 transition-colors text-center touch-manipulation"
            >
              Cancel
            </button>

            <button
              onClick={handleSave}
              className="px-5 py-2.5 sm:py-2 rounded-xl bg-cyan-600 hover:bg-cyan-500 text-white text-xs font-bold transition-all shadow-[0_0_15px_rgba(6,182,212,0.3)] text-center touch-manipulation"
            >
              Apply Cutoff Matrix
            </button>
          </div>
        </div>

      </div>
    </div>
  );
};
