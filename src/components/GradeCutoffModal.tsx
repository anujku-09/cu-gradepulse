import React, { useState, useMemo } from 'react';
import { 
  X, 
  Sliders, 
  RotateCcw, 
  Sparkles, 
  Info, 
  Check, 
  TrendingUp, 
  Award, 
  Minus, 
  Plus, 
  ChevronDown, 
  ChevronUp, 
  Zap, 
  Target,
  ShieldCheck,
  Flame,
  Scale
} from 'lucide-react';
import { CurveMode, GradeCutoffs, GradeLevel, Course, SemesterCalculation } from '../types';
import { CURVE_PRESETS, GRADE_COLORS, GRADE_POINTS, calculateSemester, determineGrade } from '../utils/gradeCalculations';
import { MicroTooltip } from './MicroTooltip';

interface GradeCutoffModalProps {
  isOpen: boolean;
  onClose: () => void;
  curveMode: CurveMode;
  onCurveChange: (mode: CurveMode) => void;
  currentCutoffs: GradeCutoffs;
  onSaveCutoffs: (cutoffs: GradeCutoffs) => void;
  courses?: Course[];
  calc?: SemesterCalculation;
}

export const GradeCutoffModal: React.FC<GradeCutoffModalProps> = ({
  isOpen,
  onClose,
  curveMode,
  onCurveChange,
  currentCutoffs,
  onSaveCutoffs,
  courses,
  calc,
}) => {
  if (!isOpen) return null;

  const [localCutoffs, setLocalCutoffs] = useState<GradeCutoffs>(currentCutoffs);
  const [activeMode, setActiveMode] = useState<CurveMode>(curveMode);
  const [testScore, setTestScore] = useState<number>(88.0);
  const [showInsights, setShowInsights] = useState<boolean>(false);

  // Live simulation of user's semester if courses are provided
  const simulatedCalc = useMemo(() => {
    if (!courses || courses.length === 0) return null;
    return calculateSemester(courses, localCutoffs);
  }, [courses, localCutoffs]);

  // SGPA difference between live dashboard calculation and current simulated curve
  const sgpaDiff = useMemo(() => {
    if (!calc || !simulatedCalc || calc.sgpa === 0 || simulatedCalc.sgpa === 0) return 0;
    return Math.round((simulatedCalc.sgpa - calc.sgpa) * 100) / 100;
  }, [calc, simulatedCalc]);

  // Counts of predicted grades across active courses under this simulated curve
  const simulatedGradeCounts = useMemo(() => {
    if (!simulatedCalc) return null;
    const counts: Record<GradeLevel, number> = { 'A+': 0, 'A': 0, 'B+': 0, 'B': 0, 'C+': 0, 'C': 0, 'D': 0, 'F': 0 };
    Object.values(simulatedCalc.courses).forEach(res => {
      if (!res.isExcluded && res.predictedGrade) {
        counts[res.predictedGrade] = (counts[res.predictedGrade] || 0) + 1;
      }
    });
    return counts;
  }, [simulatedCalc]);

  // Test score simulated grade
  const testGrade = useMemo(() => {
    return determineGrade(testScore, localCutoffs);
  }, [testScore, localCutoffs]);

  // Test score gap & buffer diagnostics
  const testDiagnostics = useMemo(() => {
    const tiers: GradeLevel[] = ['A+', 'A', 'B+', 'B', 'C+', 'C', 'D'];
    const currentIndex = tiers.indexOf(testGrade);
    const higherGrade = currentIndex > 0 ? tiers[currentIndex - 1] : null;
    const lowerGrade = currentIndex < tiers.length - 1 ? tiers[currentIndex + 1] : null;

    const neededForHigher = higherGrade ? Math.max(0, Math.round((localCutoffs[higherGrade] - testScore) * 10) / 10) : 0;
    const bufferAboveCurrent = Math.max(0, Math.round((testScore - localCutoffs[testGrade]) * 10) / 10);

    return { higherGrade, lowerGrade, neededForHigher, bufferAboveCurrent };
  }, [testScore, testGrade, localCutoffs]);

  // 1-Click Preset Selection
  const handlePresetSelect = (mode: Exclude<CurveMode, 'custom'>) => {
    setActiveMode(mode);
    setLocalCutoffs({ ...CURVE_PRESETS[mode] });
  };

  // Stepper / Direct Input for Individual Grade Cutoff
  const handleCutoffStep = (grade: GradeLevel, delta: number) => {
    setLocalCutoffs(prev => {
      const currentVal = prev[grade] ?? 50;
      const nextVal = Math.max(grade === 'D' ? 40 : 45, Math.min(99.5, Math.round((currentVal + delta) * 10) / 10));
      return { ...prev, [grade]: nextVal };
    });
    setActiveMode('custom');
  };

  const handleCutoffDirectInput = (grade: GradeLevel, valStr: string) => {
    const num = parseFloat(valStr);
    if (!isNaN(num)) {
      const clamped = Math.max(grade === 'D' ? 40 : 35, Math.min(100, Math.round(num * 10) / 10));
      setLocalCutoffs(prev => ({ ...prev, [grade]: clamped }));
      setActiveMode('custom');
    }
  };

  // 1-Click Curve Offset Shift (Proportional moderation)
  const handleShiftCurve = (delta: number) => {
    setLocalCutoffs(prev => {
      const next: GradeCutoffs = { ...prev };
      const keys: GradeLevel[] = ['A+', 'A', 'B+', 'B', 'C+', 'C'];
      for (const k of keys) {
        next[k] = Math.max(45, Math.min(99, Math.round((prev[k] + delta) * 10) / 10));
      }
      return next;
    });
    setActiveMode('custom');
  };

  // Save changes to application
  const handleSave = () => {
    onCurveChange(activeMode);
    onSaveCutoffs(localCutoffs);
    onClose();
  };

  const gradeTiers: { grade: GradeLevel; percentile: string }[] = [
    { grade: 'A+', percentile: 'Top ~5%' },
    { grade: 'A', percentile: 'Top ~15%' },
    { grade: 'B+', percentile: 'Top ~35%' },
    { grade: 'B', percentile: 'Top ~60%' },
    { grade: 'C+', percentile: 'Top ~80%' },
    { grade: 'C', percentile: 'Passing Band' },
    { grade: 'D', percentile: 'Floor (≥ 40)' },
  ];

  return (
    <div className="fixed inset-0 z-[70] overflow-y-auto bg-obsidian-950/85 backdrop-blur-md p-2 sm:p-4 animate-fadeIn overscroll-contain">
      <div className="min-h-full flex items-center justify-center py-2 sm:py-6">
        <div className="relative w-full max-w-xl bg-obsidian-900 border border-white/10 rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[92vh] sm:max-h-[88vh]">
          
          {/* ============================================================== */}
          {/* 1. MODAL HEADER (Sticky Top, High Contrast)                     */}
          {/* ============================================================== */}
          <div className="flex items-center justify-between p-3.5 sm:p-4 border-b border-white/10 flex-shrink-0 bg-obsidian-900/95 backdrop-blur-md">
            <div className="flex items-center gap-2.5 min-w-0">
              <div className="p-2 rounded-xl bg-gradient-to-br from-cyan-500/20 to-indigo-500/20 border border-cyan-500/40 text-cyan-300 flex-shrink-0 shadow-[0_0_15px_rgba(6,182,212,0.25)]">
                <Sliders className="w-4 h-4 sm:w-5 sm:h-5 text-cyan-400" />
              </div>
              <div className="min-w-0">
                <div className="flex items-center gap-1.5 flex-wrap">
                  <h2 className="text-sm sm:text-base font-extrabold text-white tracking-tight truncate">
                    CU Relative Grading Simulator
                  </h2>
                  <span className="text-[9px] font-mono font-bold px-1.5 py-0.5 rounded bg-cyan-950 border border-cyan-500/30 text-cyan-300">
                    v2.5 Engine
                  </span>
                </div>
                <p className="text-[10px] sm:text-[11px] text-slate-400 truncate">
                  Simulate Chandigarh University cohort percentile curve & test cutoffs
                </p>
              </div>
            </div>

            <button
              onClick={onClose}
              className="p-2 rounded-xl bg-obsidian-850 hover:bg-obsidian-800 text-slate-400 hover:text-white transition-colors touch-manipulation flex-shrink-0 active:scale-95 border border-white/5"
              title="Close simulator"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* ============================================================== */}
          {/* 2. SCROLLABLE BODY CONTENT (Smooth Mobile Flow)                */}
          {/* ============================================================== */}
          <div className="flex-1 overflow-y-auto p-3 sm:p-4 space-y-3.5 overscroll-contain">
            
            {/* ------------------------------------------------------------ */}
            {/* A. LIVE SGPA SIMULATION IMPACT BANNER (If Courses Present)    */}
            {/* ------------------------------------------------------------ */}
            {simulatedCalc && (
              <div className="p-3 sm:p-3.5 rounded-xl bg-gradient-to-r from-obsidian-950 via-cyan-950/30 to-indigo-950/30 border border-cyan-500/30 shadow-[0_0_20px_rgba(6,182,212,0.15)] flex flex-col xs:flex-row items-stretch xs:items-center justify-between gap-2.5">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center text-cyan-300 flex-shrink-0">
                    <TrendingUp className="w-5 h-5 text-cyan-400" />
                  </div>
                  <div>
                    <span className="text-[10px] font-mono uppercase text-slate-400 block tracking-wider">
                      Simulated Semester SGPA
                    </span>
                    <div className="flex items-baseline gap-2">
                      <span className="text-xl sm:text-2xl font-extrabold font-mono text-cyan-300">
                        {simulatedCalc.sgpa > 0 ? simulatedCalc.sgpa.toFixed(2) : '--'}
                      </span>
                      {calc && calc.sgpa > 0 && (
                        <span className={`text-[11px] font-mono font-bold px-1.5 py-0.5 rounded ${
                          sgpaDiff > 0 
                            ? 'bg-emerald-950/80 text-emerald-300 border border-emerald-500/30'
                            : sgpaDiff < 0 
                            ? 'bg-rose-950/80 text-rose-300 border border-rose-500/30'
                            : 'bg-obsidian-850 text-slate-400 border border-white/10'
                        }`}>
                          {sgpaDiff > 0 ? `+${sgpaDiff.toFixed(2)} ▲` : sgpaDiff < 0 ? `${sgpaDiff.toFixed(2)} ▼` : '= Live'}
                        </span>
                      )}
                    </div>
                  </div>
                </div>

                {/* Grade breakdown pills */}
                {simulatedGradeCounts && (
                  <div className="flex items-center gap-1 flex-wrap xs:justify-end text-[10px] font-mono">
                    {(['A+', 'A', 'B+', 'B'] as GradeLevel[]).map(g => {
                      const count = simulatedGradeCounts[g] || 0;
                      if (count === 0) return null;
                      return (
                        <span key={g} className={`px-1.5 py-0.5 rounded border ${GRADE_COLORS[g].bg} ${GRADE_COLORS[g].border} ${GRADE_COLORS[g].text} font-bold`}>
                          {count}× {g}
                        </span>
                      );
                    })}
                  </div>
                )}
              </div>
            )}

            {/* ------------------------------------------------------------ */}
            {/* B. COHORT CURVE PRESETS (3-Column Mobile Strip)              */}
            {/* ------------------------------------------------------------ */}
            <div className="space-y-1.5">
              <div className="flex items-center justify-between text-xs">
                <span className="font-semibold text-slate-300 flex items-center gap-1 font-mono uppercase text-[11px]">
                  <span>Cohort Curve Models:</span>
                  <MicroTooltip content="Cohort Curve: Switch between balanced Chandigarh University grading, high internal scoring inflation, or lenient moderation for tough papers." />
                </span>
                <span className="text-[10px] font-mono text-cyan-400">
                  {activeMode === 'custom' ? 'Custom Tuned' : `${activeMode.toUpperCase()}`}
                </span>
              </div>

              <div className="grid grid-cols-3 gap-1.5 sm:gap-2">
                {/* 1. CU Reality Standard */}
                <button
                  type="button"
                  onClick={() => handlePresetSelect('standard')}
                  className={`p-2 sm:p-2.5 rounded-xl border text-left transition-all active:scale-95 touch-manipulation flex flex-col justify-between ${
                    activeMode === 'standard'
                      ? 'bg-gradient-to-b from-cyan-950/80 to-obsidian-900 border-cyan-400 text-cyan-300 ring-1 ring-cyan-400/40 shadow-[0_0_15px_rgba(6,182,212,0.25)]'
                      : 'bg-obsidian-850/80 hover:bg-obsidian-800 border-white/10 text-slate-300'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="text-[11px] sm:text-xs font-bold truncate">CU Reality</span>
                    {activeMode === 'standard' && <Check className="w-3 h-3 text-cyan-400 flex-shrink-0" />}
                  </div>
                  <div className="text-[9px] sm:text-[10px] font-mono text-slate-400 mt-1">
                    A+ ≥ 95 • A ≥ 88
                  </div>
                  <div className="text-[8px] sm:text-[9px] text-cyan-400/80 font-mono mt-0.5">
                    Balanced (~85%)
                  </div>
                </button>

                {/* 2. High Competition */}
                <button
                  type="button"
                  onClick={() => handlePresetSelect('strict')}
                  className={`p-2 sm:p-2.5 rounded-xl border text-left transition-all active:scale-95 touch-manipulation flex flex-col justify-between ${
                    activeMode === 'strict'
                      ? 'bg-gradient-to-b from-rose-950/80 to-obsidian-900 border-rose-500 text-rose-300 ring-1 ring-rose-500/40 shadow-[0_0_15px_rgba(244,63,94,0.25)]'
                      : 'bg-obsidian-850/80 hover:bg-obsidian-800 border-white/10 text-slate-300'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="text-[11px] sm:text-xs font-bold truncate">High Comp</span>
                    {activeMode === 'strict' && <Check className="w-3 h-3 text-rose-400 flex-shrink-0" />}
                  </div>
                  <div className="text-[9px] sm:text-[10px] font-mono text-slate-400 mt-1">
                    A+ ≥ 96 • A ≥ 90
                  </div>
                  <div className="text-[8px] sm:text-[9px] text-rose-400/80 font-mono mt-0.5">
                    Scoring Batch
                  </div>
                </button>

                {/* 3. Tough Exam Cohort */}
                <button
                  type="button"
                  onClick={() => handlePresetSelect('lenient')}
                  className={`p-2 sm:p-2.5 rounded-xl border text-left transition-all active:scale-95 touch-manipulation flex flex-col justify-between ${
                    activeMode === 'lenient'
                      ? 'bg-gradient-to-b from-amber-950/80 to-obsidian-900 border-amber-500 text-amber-300 ring-1 ring-amber-500/40 shadow-[0_0_15px_rgba(245,158,11,0.25)]'
                      : 'bg-obsidian-850/80 hover:bg-obsidian-800 border-white/10 text-slate-300'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="text-[11px] sm:text-xs font-bold truncate">Tough Exam</span>
                    {activeMode === 'lenient' && <Check className="w-3 h-3 text-amber-400 flex-shrink-0" />}
                  </div>
                  <div className="text-[9px] sm:text-[10px] font-mono text-slate-400 mt-1">
                    A+ ≥ 91 • A ≥ 84
                  </div>
                  <div className="text-[8px] sm:text-[9px] text-amber-400/80 font-mono mt-0.5">
                    Lenient Curve
                  </div>
                </button>
              </div>
            </div>

            {/* ------------------------------------------------------------ */}
            {/* C. 1-TAP RAPID CURVE MODERATION SHIFT                        */}
            {/* ------------------------------------------------------------ */}
            <div className="p-2.5 rounded-xl bg-obsidian-850/60 border border-white/5 space-y-1.5">
              <div className="flex items-center justify-between text-[11px]">
                <span className="text-slate-300 font-medium flex items-center gap-1">
                  <Scale className="w-3 h-3 text-cyan-400" />
                  <span>1-Tap Exam Moderation Shift:</span>
                  <MicroTooltip content="Moderation Shift: Shifts all letter grade cutoffs up or down simultaneously to simulate batch examination difficulty." />
                </span>
                <span className="text-[10px] font-mono text-slate-400">
                  Batch Offset
                </span>
              </div>

              <div className="grid grid-cols-5 gap-1 text-[10px] font-mono">
                <button
                  type="button"
                  onClick={() => handleShiftCurve(-2)}
                  className="py-1 rounded bg-white/[0.04] hover:bg-cyan-950 text-cyan-300 border border-white/10 active:scale-95 transition-all text-center"
                  title="Shift all cutoffs -2 marks (Harder exam paper)"
                >
                  -2 Lenient
                </button>
                <button
                  type="button"
                  onClick={() => handleShiftCurve(-1)}
                  className="py-1 rounded bg-white/[0.04] hover:bg-cyan-950 text-cyan-300 border border-white/10 active:scale-95 transition-all text-center"
                  title="Shift all cutoffs -1 mark"
                >
                  -1 Mark
                </button>
                <button
                  type="button"
                  onClick={() => handlePresetSelect('standard')}
                  className="py-1 rounded bg-white/[0.04] hover:bg-obsidian-800 text-slate-300 border border-white/10 active:scale-95 transition-all text-center font-bold"
                  title="Reset to standard CU Reality cutoffs"
                >
                  Reset
                </button>
                <button
                  type="button"
                  onClick={() => handleShiftCurve(1)}
                  className="py-1 rounded bg-white/[0.04] hover:bg-rose-950 text-rose-300 border border-white/10 active:scale-95 transition-all text-center"
                  title="Shift all cutoffs +1 mark"
                >
                  +1 Mark
                </button>
                <button
                  type="button"
                  onClick={() => handleShiftCurve(2)}
                  className="py-1 rounded bg-white/[0.04] hover:bg-rose-950 text-rose-300 border border-white/10 active:scale-95 transition-all text-center"
                  title="Shift all cutoffs +2 marks (High batch competition)"
                >
                  +2 Strict
                </button>
              </div>
            </div>

            {/* ------------------------------------------------------------ */}
            {/* D. INTERACTIVE SCORE TESTER (The Live Simulator Sandbox)     */}
            {/* ------------------------------------------------------------ */}
            <div className="p-3 rounded-xl bg-gradient-to-br from-obsidian-850 to-obsidian-900 border border-white/10 space-y-2">
              <div className="flex items-center justify-between text-xs">
                <span className="font-bold text-slate-200 flex items-center gap-1.5">
                  <Target className="w-3.5 h-3.5 text-cyan-400" />
                  <span>Test Any Subject Score:</span>
                  <MicroTooltip content="Score Sandbox: Slide or enter any hypothetical marks out of 100 to instantly see what letter grade and safety buffer it secures under this curve." />
                </span>
                <div className="flex items-center gap-1 font-mono">
                  <input
                    type="number"
                    min="0"
                    max="100"
                    step="0.5"
                    value={testScore}
                    onChange={(e) => setTestScore(Math.max(0, Math.min(100, parseFloat(e.target.value) || 0)))}
                    className="w-16 px-1.5 py-0.5 rounded text-center num-input text-xs font-bold text-cyan-300 bg-obsidian-950 border border-white/10"
                  />
                  <span className="text-[11px] text-slate-400">/ 100</span>
                </div>
              </div>

              {/* Score Range Slider */}
              <input
                type="range"
                min="0"
                max="100"
                step="0.5"
                value={testScore}
                onChange={(e) => setTestScore(parseFloat(e.target.value) || 0)}
                className="w-full h-2 bg-obsidian-950 rounded-lg slider-tactile appearance-none border border-white/10 cursor-pointer"
                style={{ touchAction: 'pan-y' }}
              />

              {/* Live Test Outcome */}
              <div className="p-2 rounded-lg bg-obsidian-950/80 border border-white/5 flex items-center justify-between text-xs font-mono">
                <div className="flex items-center gap-2">
                  <span className={`px-2 py-0.5 rounded-lg font-bold border ${GRADE_COLORS[testGrade].bg} ${GRADE_COLORS[testGrade].border} ${GRADE_COLORS[testGrade].text}`}>
                    Grade {testGrade}
                  </span>
                  <span className="text-slate-300 text-[11px]">
                    [{GRADE_POINTS[testGrade]} Grade Points]
                  </span>
                </div>

                <div className="text-[10px] text-right">
                  {testDiagnostics.higherGrade ? (
                    <span className="text-cyan-300">
                      +{testDiagnostics.neededForHigher}m for {testDiagnostics.higherGrade} (≥{localCutoffs[testDiagnostics.higherGrade]})
                    </span>
                  ) : (
                    <span className="text-emerald-400 font-semibold">
                      ✓ Top Percentile (A+)
                    </span>
                  )}
                </div>
              </div>
            </div>

            {/* ------------------------------------------------------------ */}
            {/* E. CUTOFF THRESHOLDS MATRIX (Responsive 2-Column Grid)        */}
            {/* ------------------------------------------------------------ */}
            <div className="space-y-1.5">
              <div className="flex items-center justify-between text-xs">
                <span className="font-semibold text-slate-300 font-mono uppercase text-[11px] flex items-center gap-1">
                  <span>Cutoff Thresholds (Score ≥ Cutoff):</span>
                  <MicroTooltip content="Grade Cutoffs: The minimum aggregate score (internal + external) required to unlock each grade level. Tap - or + to tweak." />
                </span>
                <span className="text-[10px] font-mono text-slate-400">
                  Tap - / + to adjust
                </span>
              </div>

              <div className="grid grid-cols-2 gap-1.5 sm:gap-2">
                {gradeTiers.map(({ grade, percentile }) => {
                  const gTheme = GRADE_COLORS[grade];
                  const cutoffVal = localCutoffs[grade] ?? 40;

                  return (
                    <div
                      key={grade}
                      className="p-2 sm:p-2.5 rounded-xl bg-obsidian-850/80 border border-white/10 flex flex-col justify-between gap-1.5"
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-1.5">
                          <span className={`w-6 h-6 rounded-md font-mono font-extrabold text-[11px] flex items-center justify-center border ${gTheme.bg} ${gTheme.border} ${gTheme.text}`}>
                            {grade}
                          </span>
                          <div className="min-w-0">
                            <span className="text-[11px] font-bold text-white block leading-tight">
                              {GRADE_POINTS[grade]} GP
                            </span>
                            <span className="text-[9px] font-mono text-slate-400 block truncate">
                              {percentile}
                            </span>
                          </div>
                        </div>
                      </div>

                      {/* Stepper with - and + */}
                      <div className="flex items-center justify-between gap-1 bg-obsidian-950/90 rounded-lg p-0.5 border border-white/5">
                        <button
                          type="button"
                          onClick={() => handleCutoffStep(grade, -0.5)}
                          disabled={grade === 'D' && cutoffVal <= 40}
                          className="w-7 h-7 rounded bg-obsidian-850 hover:bg-obsidian-800 text-slate-300 hover:text-white flex items-center justify-center active:scale-90 transition-all disabled:opacity-30 disabled:pointer-events-none"
                          title="Decrease cutoff by 0.5"
                        >
                          <Minus className="w-3 h-3" />
                        </button>

                        <div className="flex items-center justify-center gap-0.5 min-w-0 flex-1">
                          <span className="text-[10px] text-slate-500 font-mono">≥</span>
                          <input
                            type="number"
                            min={grade === 'D' ? 40 : 35}
                            max="100"
                            step="0.5"
                            inputMode="decimal"
                            value={cutoffVal}
                            onChange={(e) => handleCutoffDirectInput(grade, e.target.value)}
                            className="w-12 px-1 py-0.5 rounded text-center num-input text-xs font-bold text-cyan-300 bg-transparent focus:outline-none"
                          />
                        </div>

                        <button
                          type="button"
                          onClick={() => handleCutoffStep(grade, 0.5)}
                          disabled={cutoffVal >= 99.5}
                          className="w-7 h-7 rounded bg-obsidian-850 hover:bg-obsidian-800 text-slate-300 hover:text-white flex items-center justify-center active:scale-90 transition-all disabled:opacity-30 disabled:pointer-events-none"
                          title="Increase cutoff by 0.5"
                        >
                          <Plus className="w-3 h-3" />
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* ------------------------------------------------------------ */}
            {/* F. CHANDIGARH UNIVERSITY RELATIVE GRADING INSIGHTS           */}
            {/* ------------------------------------------------------------ */}
            <div className="rounded-xl border border-white/10 bg-obsidian-850/50 overflow-hidden">
              <button
                type="button"
                onClick={() => setShowInsights(!showInsights)}
                className="w-full p-2.5 flex items-center justify-between text-left text-xs font-semibold text-cyan-300 hover:text-cyan-200 transition-colors"
              >
                <div className="flex items-center gap-1.5">
                  <Info className="w-3.5 h-3.5 text-cyan-400" />
                  <span>Chandigarh University Relative Grading Reality:</span>
                </div>
                <div className="flex items-center gap-1 text-[10px] font-mono text-slate-400">
                  <span>{showInsights ? 'Hide' : 'Explain'}</span>
                  {showInsights ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
                </div>
              </button>

              {showInsights && (
                <div className="p-3 pt-0 border-t border-white/5 text-[11px] text-slate-300 space-y-2 leading-relaxed animate-fadeIn">
                  <p>
                    <strong className="text-white">1. No Fixed Percentage Cutoffs:</strong> In Chandigarh University, letter grades are awarded on a relative bell curve calculated across all 2,000+ CSE students per semester.
                  </p>
                  <p>
                    <strong className="text-white">2. The 75% Internal Saturation:</strong> Because most students score 34–38 out of 40 in continuous internal assessments, the 60-mark End-Term Theory Exam (ETE) acts as the decisive differentiator for A+ (~95+) and A (~88+).
                  </p>
                  <p>
                    <strong className="text-white">3. Exam Paper Moderation:</strong> In notoriously difficult courses (like Theory of Computation or OS), the cohort mean drops, shifting the A+ line down to ~91. In scoring subjects, the line climbs to ~96+.
                  </p>
                  <p>
                    <strong className="text-white">4. Passing Standard:</strong> You must score an aggregate of at least <strong className="text-amber-300 font-mono">40.0 / 100</strong> (Grade D, 4.0 GP) to avoid an academic backlog (F).
                  </p>
                </div>
              )}
            </div>

          </div>

          {/* ============================================================== */}
          {/* 3. STICKY BOTTOM ACTION BAR (Touch-Friendly CTAs)              */}
          {/* ============================================================== */}
          <div className="p-3 sm:p-4 bg-obsidian-950/95 backdrop-blur-md border-t border-white/10 flex flex-col-reverse xs:flex-row items-stretch xs:items-center justify-between gap-2 flex-shrink-0">
            <button
              type="button"
              onClick={() => handlePresetSelect('standard')}
              className="px-3 py-2 rounded-xl bg-obsidian-850 hover:bg-obsidian-800 text-slate-400 hover:text-slate-200 text-xs font-medium border border-white/10 flex items-center justify-center gap-1.5 active:scale-95 touch-manipulation"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Reset Standard</span>
            </button>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={onClose}
                className="flex-1 xs:flex-none px-4 py-2 rounded-xl bg-obsidian-800 hover:bg-obsidian-750 text-slate-300 text-xs font-semibold border border-white/10 active:scale-95 transition-all text-center touch-manipulation"
              >
                Cancel
              </button>

              <button
                type="button"
                onClick={handleSave}
                className="flex-1 xs:flex-none px-5 py-2 rounded-xl bg-gradient-to-r from-cyan-500 to-indigo-600 hover:from-cyan-400 hover:to-indigo-500 text-white text-xs font-bold transition-all shadow-[0_0_15px_rgba(6,182,212,0.3)] active:scale-95 text-center touch-manipulation flex items-center justify-center gap-1.5"
              >
                <Check className="w-3.5 h-3.5" />
                <span>Apply Cutoff Matrix</span>
              </button>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};
