import React, { useState, useEffect } from 'react';
import { 
  X, 
  Sliders, 
  HelpCircle, 
  Award, 
  AlertCircle, 
  CheckCircle2, 
  Sparkles, 
  TrendingDown,
  Layers,
  Save,
  RotateCcw,
  Info,
  Check,
  ClipboardPaste
} from 'lucide-react';
import { Course, CourseResult, GradeLevel, GradeCutoffs } from '../types';
import { GRADE_COLORS, GRADE_POINTS } from '../utils/gradeCalculations';
import { CourseRegexPasteBox } from './CourseRegexPasteBox';

interface CourseDetailModalProps {
  course: Course | null;
  result: CourseResult | null;
  globalCutoffs: GradeCutoffs;
  onClose: () => void;
  onUpdateComponentMarks: (courseId: string, componentId: string, obtained: number) => void;
  onUpdateExternal: (courseId: string, score: number) => void;
  onUpdateDirectGrade: (courseId: string, grade: GradeLevel) => void;
  onQuickPreset: (courseId: string, preset: 'full' | 'average' | 'reset') => void;
  onSaveCustomCutoffs: (courseId: string, cutoffs: GradeCutoffs | undefined) => void;
  onOpenEditCourse?: (course: Course) => void;
  onConvertCourseMode?: (courseId: string, targetType: 'Theory' | 'Practical' | 'DirectGrade') => void;
}

export const CourseDetailModal: React.FC<CourseDetailModalProps> = ({
  course,
  result,
  globalCutoffs,
  onClose,
  onUpdateComponentMarks,
  onUpdateExternal,
  onUpdateDirectGrade,
  onQuickPreset,
  onSaveCustomCutoffs,
  onOpenEditCourse,
  onConvertCourseMode,
}) => {
  if (!course || !result) return null;

  const [activeTab, setActiveTab] = useState<'components' | 'unlocker' | 'cutoffs'>('components');
  const [showRegexBox, setShowRegexBox] = useState(false);
  const [editingCutoffs, setEditingCutoffs] = useState<GradeCutoffs>(course.customCutoffs || globalCutoffs);
  const [hasCustomCutoffs, setHasCustomCutoffs] = useState<boolean>(!!course.customCutoffs);

  // Close on Escape key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onClose]);

  const theme = GRADE_COLORS[result.predictedGrade];

  // Calculate component statistics
  const componentStats = course.components.map(comp => {
    const rawClamped = Math.max(0, Math.min(comp.rawObtained, comp.rawMax));
    const weightedScore = comp.rawMax > 0 ? (rawClamped / comp.rawMax) * comp.weightage : 0;
    const marksLost = comp.weightage - weightedScore;
    const lossPercentage = comp.weightage > 0 ? (marksLost / comp.weightage) * 100 : 0;

    return {
      ...comp,
      rawClamped,
      weightedScore: Math.round(weightedScore * 100) / 100,
      marksLost: Math.round(marksLost * 100) / 100,
      lossPercentage: Math.round(lossPercentage),
    };
  });

  // Total marks lost
  const totalMarksLost = componentStats.reduce((acc, c) => acc + c.marksLost, 0);

  // Check for attendance component
  const attendanceComp = course.components.find(
    c => c.category === 'Attendance' || c.name.toLowerCase().includes('attendance')
  );
  const hasFullAttendance = attendanceComp ? attendanceComp.rawObtained >= attendanceComp.rawMax : false;

  const handleApplyCustomCutoffs = () => {
    onSaveCustomCutoffs(course.id, editingCutoffs);
    setHasCustomCutoffs(true);
  };

  const handleResetCutoffs = () => {
    setEditingCutoffs(globalCutoffs);
    onSaveCustomCutoffs(course.id, undefined);
    setHasCustomCutoffs(false);
  };

  return (
    <div className="fixed inset-0 z-[70] overflow-y-auto bg-obsidian-950/80 backdrop-blur-md flex justify-end animate-fadeIn">
      {/* Click outside backdrop */}
      <div className="fixed inset-0" onClick={onClose} />

      {/* Slide-over Drawer Panel (Responsive: full width on mobile, max-w-2xl on desktop) */}
      <div className="relative w-full max-w-2xl bg-obsidian-900 border-l border-white/10 min-h-screen shadow-2xl p-4 sm:p-6 flex flex-col justify-between z-10 overflow-y-auto">
        
        <div>
          {/* Drawer Top Header */}
          <div className="flex items-start justify-between pb-3 sm:pb-4 border-b border-white/10 gap-3">
            <div>
              <div className="flex items-center gap-1.5 sm:gap-2 flex-wrap">
                <span className="font-mono text-xs font-bold text-cyan-400 px-2 py-0.5 rounded bg-cyan-950/60 border border-cyan-800/60">
                  {course.code}
                </span>
                <span className="text-xs text-slate-400 font-mono">
                  {course.credits.toFixed(1)} Credits
                </span>
                <span className="text-[10px] sm:text-xs uppercase text-slate-400 px-1.5 py-0.2 rounded bg-obsidian-850 border border-white/5">
                  {course.type}
                </span>
              </div>
              <h2 className="text-lg sm:text-xl font-bold text-white mt-1 leading-snug">
                {course.name}
              </h2>
            </div>

            <div className="flex items-center gap-1.5 flex-shrink-0">
              {onOpenEditCourse && (
                <button
                  onClick={() => {
                    onClose();
                    onOpenEditCourse(course);
                  }}
                  className="px-2.5 py-1.5 rounded-xl bg-white/5 hover:bg-white/10 text-slate-300 hover:text-white border border-white/10 text-xs font-mono flex items-center gap-1 transition-colors"
                  title="Configure subject properties, code, credits, or change evaluation mode"
                >
                  <Sliders className="w-3.5 h-3.5 text-cyan-400" />
                  <span className="hidden sm:inline">Config</span>
                </button>
              )}
              <button
                onClick={onClose}
                className="p-2 rounded-xl bg-obsidian-800 hover:bg-obsidian-700 text-slate-400 hover:text-white border border-white/10 transition-colors touch-manipulation flex-shrink-0"
                title="Close inspector"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Quick Metrics Header Pill */}
          <div className="grid grid-cols-3 gap-2 sm:gap-3 my-3 sm:my-4">
            <div className="p-2 sm:p-3 rounded-xl bg-obsidian-850/80 border border-white/5 text-center">
              <span className="text-[10px] sm:text-[11px] text-slate-400 uppercase font-mono block truncate">Internal Wt</span>
              <span className="text-base sm:text-lg font-bold font-mono text-cyan-400">
                {result.weightedInternalScore.toFixed(1)}<span className="text-xs text-slate-500 font-normal">/{result.maxInternalWeightage.toFixed(1)}</span>
              </span>
            </div>

            <div className="p-2 sm:p-3 rounded-xl bg-obsidian-850/80 border border-white/5 text-center">
              <span className="text-[10px] sm:text-[11px] text-slate-400 uppercase font-mono block truncate">External Wt</span>
              <span className="text-base sm:text-lg font-bold font-mono text-indigo-400">
                {result.weightedExternalScore.toFixed(1)}<span className="text-xs text-slate-500 font-normal">/{result.maxExternalWeightage.toFixed(1)}</span>
              </span>
            </div>

            <div className="p-2 sm:p-3 rounded-xl bg-obsidian-850/80 border border-white/5 text-center">
              <span className="text-[10px] sm:text-[11px] text-slate-400 uppercase font-mono block truncate">Grade</span>
              <span className={`text-base sm:text-lg font-extrabold font-mono ${theme.text}`}>
                {result.predictedGrade} [{result.gradePoint}]
              </span>
            </div>
          </div>

          {/* Navigation Tabs (Scrollable on small mobile screens) */}
          <div className="flex border-b border-white/10 gap-2 text-xs font-medium mb-4 overflow-x-auto no-scrollbar whitespace-nowrap">
            <button
              onClick={() => setActiveTab('components')}
              className={`pb-2.5 px-2 border-b-2 transition-all flex-shrink-0 ${
                activeTab === 'components'
                  ? 'border-cyan-400 text-cyan-300 font-semibold'
                  : 'border-transparent text-slate-400 hover:text-slate-200'
              }`}
            >
              Assessments ({course.components.length})
            </button>

            <button
              onClick={() => setActiveTab('unlocker')}
              className={`pb-2.5 px-2 border-b-2 transition-all flex-shrink-0 ${
                activeTab === 'unlocker'
                  ? 'border-cyan-400 text-cyan-300 font-semibold'
                  : 'border-transparent text-slate-400 hover:text-slate-200'
              }`}
            >
              Next Grade Targets
            </button>

            <button
              onClick={() => setActiveTab('cutoffs')}
              className={`pb-2.5 px-2 border-b-2 transition-all flex-shrink-0 ${
                activeTab === 'cutoffs'
                  ? 'border-cyan-400 text-cyan-300 font-semibold'
                  : 'border-transparent text-slate-400 hover:text-slate-200'
              }`}
            >
              Cutoff Customizer {hasCustomCutoffs && '•'}
            </button>
          </div>

          {/* TAB 1: Components Breakdown */}
          {activeTab === 'components' && (
            <div className="space-y-4">
              {/* Presets and Loss Summary */}
              <div className="flex items-center justify-between text-xs p-2.5 rounded-xl bg-obsidian-850/60 border border-white/5">
                <div className="flex items-center gap-1.5 flex-wrap">
                  <span className="text-slate-400 font-medium">Quick Fill:</span>
                  {attendanceComp && (
                    <button
                      type="button"
                      onClick={() => {
                        const isFull = attendanceComp.rawObtained >= attendanceComp.rawMax;
                        onUpdateComponentMarks(course.id, attendanceComp.id, isFull ? 0 : attendanceComp.rawMax);
                      }}
                      className={`px-2 py-0.5 rounded border transition-colors flex items-center gap-1 font-mono text-[11px] font-bold ${
                        hasFullAttendance
                          ? 'bg-emerald-950/80 text-emerald-300 border-emerald-500/50 shadow-[0_0_8px_rgba(16,185,129,0.25)]'
                          : 'bg-obsidian-800 text-slate-300 border-white/10 hover:border-white/20'
                      }`}
                      title="1-Click Attendance Toggle: CU awards full marks for >= 75% attendance"
                    >
                      <Check className="w-3 h-3" />
                      <span>{hasFullAttendance ? `✓ +${attendanceComp.rawMax} Att` : `+0 Att`}</span>
                    </button>
                  )}
                  <button
                    onClick={() => onQuickPreset(course.id, 'full')}
                    className="px-2 py-0.5 rounded bg-emerald-950/60 text-emerald-300 border border-emerald-800/40 hover:bg-emerald-900 transition-colors"
                  >
                    100% Full
                  </button>
                  <button
                    onClick={() => onQuickPreset(course.id, 'average')}
                    className="px-2 py-0.5 rounded bg-cyan-950/60 text-cyan-300 border border-cyan-800/40 hover:bg-cyan-900 transition-colors"
                  >
                    75% Average
                  </button>
                  <button
                    onClick={() => onQuickPreset(course.id, 'reset')}
                    className="px-2 py-0.5 rounded bg-rose-950/60 text-rose-300 border border-rose-800/40 hover:bg-rose-900 transition-colors"
                  >
                    Reset (0)
                  </button>
                  <button
                    type="button"
                    onClick={() => setShowRegexBox(!showRegexBox)}
                    className={`px-2 py-0.5 rounded border transition-colors flex items-center gap-1 font-mono text-[11px] font-semibold ${
                      showRegexBox
                        ? 'bg-cyan-950 text-cyan-300 border-cyan-500/50 shadow-[0_0_8px_rgba(6,182,212,0.25)]'
                        : 'bg-white/[0.04] text-cyan-400 border-white/10 hover:border-cyan-500/30'
                    }`}
                    title="Paste CUIMS table lines for this subject via regex"
                  >
                    <ClipboardPaste className="w-3 h-3 text-cyan-400" />
                    <span>Regex Paste</span>
                  </button>
                </div>

                <div className="text-slate-400 font-mono text-[11px]">
                  Internal Lost: <strong className="text-rose-400 font-semibold">-{totalMarksLost.toFixed(1)} wt</strong>
                </div>
              </div>

              {/* Embedded Course Regex Paste Box */}
              {showRegexBox && (
                <CourseRegexPasteBox
                  course={course}
                  onApplyMarks={(updates) => {
                    for (const u of updates) {
                      onUpdateComponentMarks(course.id, u.componentId, u.rawObtained);
                    }
                    setShowRegexBox(false);
                  }}
                  onClose={() => setShowRegexBox(false)}
                />
              )}

              {/* Table / List of Assessment Components */}
              <div className="space-y-2 max-h-[460px] overflow-y-auto pr-1">
                {componentStats.map(comp => (
                  <div
                    key={comp.id}
                    className="p-3 rounded-xl bg-obsidian-850/70 border border-white/5 hover:border-white/15 transition-all flex items-center justify-between gap-3"
                  >
                    {/* Component Name & Loss Indicator */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <span className="font-medium text-xs text-slate-200 truncate">
                          {comp.name}
                        </span>
                        {comp.marksLost > 0 && (
                          <span className="text-[10px] font-mono text-rose-400 bg-rose-950/40 px-1.5 py-0.2 rounded border border-rose-800/40">
                            -{comp.marksLost.toFixed(1)}
                          </span>
                        )}
                      </div>

                      {/* Mini Bar of Marks Lost */}
                      <div className="w-full bg-obsidian-800 h-1.5 rounded-full mt-2 overflow-hidden border border-white/5">
                        <div
                          className="h-full bg-gradient-to-r from-emerald-500 to-cyan-400 rounded-full"
                          style={{ width: `${Math.max(0, 100 - comp.lossPercentage)}%` }}
                        />
                      </div>

                      <div className="flex justify-between items-center text-[10px] text-slate-400 mt-1 font-mono">
                        <span>Max: {comp.rawMax}</span>
                        <span>Wt: {comp.weightage}</span>
                        <span className="text-cyan-300 font-semibold">
                          Secured: {comp.weightedScore.toFixed(1)} wt
                        </span>
                      </div>
                    </div>

                    {/* Raw Obtained Input or 1-Click Attendance */}
                    <div className="flex flex-col items-end gap-1 flex-shrink-0">
                      <span className="text-[10px] text-slate-400 font-mono">
                        {comp.category === 'Attendance' || comp.name.toLowerCase().includes('attendance') ? 'Attendance Status:' : 'Raw Obtained:'}
                      </span>
                      {comp.category === 'Attendance' || comp.name.toLowerCase().includes('attendance') ? (
                        <div className="flex items-center gap-1.5">
                          <button
                            type="button"
                            onClick={() => {
                              const isFull = comp.rawObtained >= comp.rawMax;
                              onUpdateComponentMarks(course.id, comp.id, isFull ? 0 : comp.rawMax);
                            }}
                            className={`px-3 py-1.5 rounded-lg text-xs font-mono font-bold transition-all border flex items-center gap-1.5 ${
                              comp.rawObtained >= comp.rawMax
                                ? 'bg-emerald-950 text-emerald-300 border-emerald-500/50 shadow-[0_0_10px_rgba(16,185,129,0.3)]'
                                : 'bg-obsidian-800 text-slate-400 border-white/10 hover:border-white/30 hover:text-white'
                            }`}
                            title="Click to toggle full attendance marks (>= 75% rule)"
                          >
                            <Check className="w-3.5 h-3.5 text-emerald-400" />
                            <span>{comp.rawObtained >= comp.rawMax ? `Full +${comp.rawMax}.0 Marks` : `Click for +${comp.rawMax}`}</span>
                          </button>
                          <span className="text-slate-400 text-xs font-mono whitespace-nowrap">/ {comp.rawMax}</span>
                        </div>
                      ) : (
                        <div className="flex items-center gap-1.5">
                          <input
                            type="number"
                            min="0"
                            max={comp.rawMax}
                            step="0.5"
                            value={comp.rawObtained === 0 ? '' : comp.rawObtained}
                            onChange={(e) => {
                              const raw = e.target.value;
                              onUpdateComponentMarks(course.id, comp.id, raw === '' ? 0 : (parseFloat(raw) || 0));
                            }}
                            placeholder="0"
                            className="w-20 px-2 py-1 rounded text-center num-input text-xs font-bold text-cyan-300"
                          />
                          <span className="text-slate-400 text-xs font-mono whitespace-nowrap">/ {comp.rawMax}</span>
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>

              {/* External Target Adjustment */}
              {course.type !== 'DirectGrade' && (
                <div className="mt-4 p-4 rounded-xl bg-gradient-to-br from-obsidian-850 to-obsidian-800 border border-cyan-500/20 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-semibold text-slate-200">
                      {course.externalName} Target Score
                    </span>
                    <span className="font-mono text-xs text-cyan-400 font-bold">
                      {course.externalTargetScore} / {course.externalRawMax} ({result.weightedExternalScore.toFixed(1)} wt)
                    </span>
                  </div>

                  <input
                    type="range"
                    min="0"
                    max={course.externalRawMax}
                    step="0.5"
                    value={course.externalTargetScore}
                    onChange={(e) => onUpdateExternal(course.id, parseFloat(e.target.value))}
                    className="w-full h-2 bg-obsidian-950 rounded-lg slider-tactile appearance-none border border-white/10"
                  />
                </div>
              )}
            </div>
          )}

          {/* TAB 2: Next Grade Unlocker Target */}
          {activeTab === 'unlocker' && (
            <div className="space-y-4">
              <div className="p-3.5 rounded-xl bg-cyan-950/20 border border-cyan-500/30 text-xs text-slate-300 space-y-1">
                <div className="flex items-center gap-1.5 font-semibold text-cyan-300">
                  <Info className="w-4 h-4 text-cyan-400" />
                  <span>CU CSE Relative Curve Safe Target Bands</span>
                </div>
                <p className="text-[11px] leading-relaxed">
                  Relative grading has <strong className="text-white">no fixed guaranteed cutoff</strong>. Across all CSE sections, <strong className="text-cyan-300 font-mono">95–96+</strong> is typically required for A+ and <strong className="text-indigo-300 font-mono">88–90+</strong> for A. Based on your current internal score of <strong className="text-cyan-300 font-mono">{result.weightedInternalScore.toFixed(1)}</strong>, here is your estimated external target roadmap:
                </p>
              </div>

              <div className="space-y-2">
                {result.targetRequirements.map((req) => {
                  const gTheme = GRADE_COLORS[req.grade];
                  const cutoffMarks = result.gradeCutoffs[req.grade];

                  return (
                    <div
                      key={req.grade}
                      className={`p-3 rounded-xl border transition-all flex items-center justify-between ${
                        req.alreadyAchieved
                          ? 'bg-emerald-950/20 border-emerald-500/30 text-emerald-300'
                          : req.possible
                          ? 'bg-obsidian-850/70 border-white/10 text-slate-200'
                          : 'bg-rose-950/20 border-rose-500/20 text-rose-400/80 opacity-60'
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <span className={`w-10 h-10 rounded-xl font-mono font-bold text-sm flex items-center justify-center border ${gTheme.bg} ${gTheme.border} ${gTheme.text}`}>
                          {req.grade}
                        </span>
                        <div>
                          <div className="font-semibold text-xs text-slate-100 flex items-center gap-2">
                            <span>Grade {req.grade}</span>
                            <span className="text-[11px] font-mono text-slate-400">
                              (Cutoff: ≥{cutoffMarks})
                            </span>
                          </div>
                          <div className="text-[11px] text-slate-400 mt-0.5">
                            Grade Points: {GRADE_POINTS[req.grade]}
                          </div>
                        </div>
                      </div>

                      <div className="text-right">
                        {req.alreadyAchieved ? (
                          <span className="flex items-center gap-1 font-mono text-xs font-semibold text-emerald-400">
                            <CheckCircle2 className="w-4 h-4" /> Already Secured
                          </span>
                        ) : req.possible ? (
                          <div>
                            <span className="font-mono text-sm font-bold text-cyan-400">
                              {req.requiredExternalRaw}
                            </span>
                            <span className="text-xs text-slate-400 font-mono"> / {course.externalRawMax}</span>
                            <span className="block text-[10px] text-slate-400 font-mono">
                              ({Math.round((req.requiredExternalRaw / course.externalRawMax) * 100)}% effort)
                            </span>
                          </div>
                        ) : (
                          <span className="text-xs font-mono text-rose-400">
                            Mathematically Impossible
                          </span>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* TAB 3: Subject Cutoff Override Customizer */}
          {activeTab === 'cutoffs' && (
            <div className="space-y-4">
              <div className="p-3 rounded-xl bg-obsidian-850/60 border border-white/5 text-xs text-slate-300">
                <p>
                  CU relative grading often shifts cutoffs per course based on section performance. You can override the global curve for <strong className="text-cyan-300 font-semibold">{course.code}</strong> here:
                </p>
              </div>

              <div className="grid grid-cols-2 gap-3">
                {(['A+', 'A', 'B+', 'B', 'C+', 'C', 'D'] as GradeLevel[]).map(g => (
                  <div key={g} className="p-3 rounded-xl bg-obsidian-850/80 border border-white/5 flex items-center justify-between">
                    <span className="font-mono font-bold text-sm text-slate-200">
                      Grade {g}
                    </span>
                    <div className="flex items-center gap-1">
                      <span className="text-xs text-slate-400">≥</span>
                      <input
                        type="number"
                        min="0"
                        max="100"
                        value={editingCutoffs[g]}
                        onChange={(e) => setEditingCutoffs(prev => ({ ...prev, [g]: parseFloat(e.target.value) || 0 }))}
                        className="w-20 px-2 py-1 rounded text-center num-input text-xs font-bold text-cyan-300"
                      />
                    </div>
                  </div>
                ))}
              </div>

              <div className="flex items-center justify-between pt-3 border-t border-white/10">
                <button
                  onClick={handleResetCutoffs}
                  className="px-3 py-1.5 rounded-lg bg-obsidian-800 hover:bg-obsidian-700 text-slate-300 border border-white/10 text-xs font-medium flex items-center gap-1.5 transition-colors"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                  Reset to Global Curve
                </button>

                <button
                  onClick={handleApplyCustomCutoffs}
                  className="px-4 py-1.5 rounded-lg bg-cyan-600 hover:bg-cyan-500 text-white text-xs font-semibold flex items-center gap-1.5 shadow-md transition-colors"
                >
                  <Save className="w-3.5 h-3.5" />
                  Save Course Cutoffs
                </button>
              </div>
            </div>
          )}

        </div>

        {/* Footer Close Button */}
        <div className="pt-4 border-t border-white/10 flex justify-end">
          <button
            onClick={onClose}
            className="px-5 py-2 rounded-xl bg-obsidian-800 hover:bg-obsidian-700 text-slate-200 font-semibold text-xs border border-white/10 transition-colors"
          >
            Done
          </button>
        </div>

      </div>
    </div>
  );
};
