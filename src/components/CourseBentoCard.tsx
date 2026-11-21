import React, { useState } from 'react';
import { 
  ChevronRight, 
  ChevronDown,
  CheckCircle, 
  XCircle, 
  Layers, 
  SlidersHorizontal,
  Flame,
  ToggleLeft,
  ToggleRight,
  Info,
  Edit3,
  RotateCcw,
  Sparkles,
  EyeOff,
  Check,
  ClipboardPaste
} from 'lucide-react';
import { Course, CourseResult, GradeLevel, CourseType } from '../types';
import { GRADE_COLORS, GRADE_POINTS } from '../utils/gradeCalculations';
import { CourseRegexPasteBox } from './CourseRegexPasteBox';
import { MicroTooltip } from './MicroTooltip';
import { Sliders, Settings2 } from 'lucide-react';

interface CourseBentoCardProps {
  course: Course;
  result: CourseResult;
  isDetailedView: boolean;
  onUpdateExternal: (courseId: string, score: number) => void;
  onUpdateDirectGrade: (courseId: string, grade: GradeLevel) => void;
  onUpdateDirectInternal: (courseId: string, score: number | undefined) => void;
  onUpdateComponentMarks: (courseId: string, componentId: string, score: number) => void;
  onToggleCourseExcluded: (courseId: string) => void;
  onQuickPreset: (courseId: string, preset: 'full' | 'average' | 'reset') => void;
  onInspect: (courseId: string) => void;
  onOpenEditCourse?: (course: Course) => void;
  onConvertCourseMode?: (courseId: string, targetType: CourseType) => void;
}

export const CourseBentoCard: React.FC<CourseBentoCardProps> = ({
  course,
  result,
  isDetailedView,
  onUpdateExternal,
  onUpdateDirectGrade,
  onUpdateDirectInternal,
  onUpdateComponentMarks,
  onToggleCourseExcluded,
  onQuickPreset,
  onInspect,
  onOpenEditCourse,
  onConvertCourseMode,
}) => {
  const [isAccordionOpen, setIsAccordionOpen] = useState(false);
  const [showRegexBox, setShowRegexBox] = useState(false);
  const { predictedGrade, gradePoint, weightedInternalScore, maxInternalWeightage, totalWeightedScore, targetRequirements } = result;

  const isExcluded = !!course.isExcluded;
  const isUnentered = totalWeightedScore === 0;
  const theme = isExcluded 
    ? { text: 'text-slate-500', bg: 'bg-obsidian-900', border: 'border-white/10 border-dashed', glow: 'shadow-none', ring: 'rgba(255,255,255,0.1)' }
    : isUnentered 
    ? GRADE_COLORS['PENDING'] 
    : (GRADE_COLORS[predictedGrade] || GRADE_COLORS['C']);

  // Calculate internal percentage for radial SVG ring
  const internalRatio = maxInternalWeightage > 0 ? weightedInternalScore / maxInternalWeightage : 0;
  const internalPercent = Math.min(100, Math.round(internalRatio * 100));

  // Radial SVG constants
  const radius = 22;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (internalRatio * circumference);

  // Group B Direct Grade options
  const gradePills: GradeLevel[] = ['A+', 'A', 'B+', 'B', 'C+', 'C', 'D', 'F'];

  // Check for attendance component
  const attendanceComp = course.components.find(
    c => c.category === 'Attendance' || c.name.toLowerCase().includes('attendance')
  );
  const hasFullAttendance = attendanceComp ? attendanceComp.rawObtained >= attendanceComp.rawMax : false;

  // Next grade unlocker logic for the slider (excluding Grade D)
  const nextTarget = targetRequirements.find(t => !t.alreadyAchieved && t.possible && t.grade !== 'D');

  return (
    <div
      id={`course-${course.id}`}
      className={`glass-card rounded-2xl p-3.5 sm:p-5 flex flex-col justify-between relative overflow-hidden transition-all duration-300 border ${
        isExcluded 
          ? 'opacity-65 border-white/10 hover:opacity-100' 
          : result.isBacklog ? 'border-rose-500/50 shadow-[0_0_25px_rgba(239,68,68,0.25)]' : theme.border
      }`}
    >
      {/* Excluded Subject Notice Banner */}
      {isExcluded && (
        <div className="mb-3 px-3 py-1.5 rounded-xl bg-rose-950/40 border border-rose-500/30 text-rose-300 text-xs flex items-center justify-between">
          <span className="flex items-center gap-1.5 font-medium">
            <EyeOff className="w-3.5 h-3.5 text-rose-400" />
            <span>Disallowed • Excluded from your SGPA</span>
          </span>
          <button
            onClick={() => onToggleCourseExcluded(course.id)}
            className="text-[11px] font-bold text-cyan-400 underline hover:text-cyan-300 ml-2"
          >
            Allow Back
          </button>
        </div>
      )}

      {/* Top Header Row */}
      <div>
        <div className="flex items-start justify-between gap-3">
          {/* Left: Code, Credits, Type */}
          <div className="space-y-1">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="font-mono text-xs font-bold text-slate-200 px-2 py-0.5 rounded bg-white/[0.06] border border-white/10">
                {course.code}
              </span>
              <span className="text-[11px] font-mono text-cyan-300 font-semibold">
                {course.credits.toFixed(1)} Credits
              </span>
              <span className={`text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded border ${
                course.type === 'Hybrid'
                  ? 'bg-purple-950/60 text-purple-300 border-purple-500/30'
                  : course.type === 'ContinuousEvaluation'
                  ? 'bg-emerald-950/60 text-emerald-300 border-emerald-500/30'
                  : course.type === 'Practical'
                  ? 'bg-amber-950/60 text-amber-300 border-amber-500/30'
                  : course.type === 'DirectGrade'
                  ? 'bg-indigo-950/60 text-indigo-300 border-indigo-500/30'
                  : 'bg-cyan-950/60 text-cyan-300 border-cyan-500/30'
              }`}>
                {course.type === 'Hybrid' ? 'HYBRID 70/30' :
                 course.type === 'ContinuousEvaluation' ? '100% INTERNAL' :
                 course.type === 'Practical' ? 'PRACTICAL 60/40' :
                 course.type === 'DirectGrade' ? 'DIRECT GRADE' : 'THEORY 40/60'}
              </span>

              {/* Allow / Disallow Contribution Toggle Button */}
              <div className="inline-flex items-center gap-0.5">
                <button
                  onClick={() => onToggleCourseExcluded(course.id)}
                  title={isExcluded ? "Include this subject back into SGPA calculations" : "Disallow / exclude this subject from SGPA calculations"}
                  className={`flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-mono font-bold transition-all border ${
                    isExcluded
                      ? 'bg-rose-950/60 text-rose-300 border-rose-500/40 hover:bg-rose-900/60'
                      : 'bg-emerald-950/40 text-emerald-300 border-emerald-500/30 hover:bg-emerald-900/60'
                  }`}
                >
                  {isExcluded ? (
                    <>
                      <EyeOff className="w-2.5 h-2.5 text-rose-400" />
                      <span>Excluded (0 Cr)</span>
                    </>
                  ) : (
                    <>
                      <Check className="w-2.5 h-2.5 text-emerald-400" />
                      <span>In SGPA</span>
                    </>
                  )}
                </button>
                <MicroTooltip content="In SGPA / Exclude: Exclude this course from your SGPA calculation without deleting marks." />
              </div>

              {/* Configure Subject Modal Trigger */}
              {onOpenEditCourse && (
                <div className="inline-flex items-center gap-0.5">
                  <button
                    type="button"
                    onClick={() => onOpenEditCourse(course)}
                    title="Configure subject name, code, credits, or change evaluation mode"
                    className="flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-mono text-slate-400 hover:text-cyan-300 bg-white/5 hover:bg-white/10 border border-white/10 transition-colors"
                  >
                    <Settings2 className="w-2.5 h-2.5" />
                    <span>Config</span>
                  </button>
                  <MicroTooltip content="Subject Config: Modify course code, credits, or convert evaluation pattern (Theory, Practical, Hybrid 70/30, 100% Internal, or Direct Grade)." />
                </div>
              )}
            </div>

            <h3 className="font-semibold text-slate-100 text-sm leading-snug line-clamp-1" title={course.name}>
              {course.name}
            </h3>
          </div>

          {/* Right: Predicted Grade Pill */}
          <div className="flex flex-col items-end flex-shrink-0">
            {isExcluded ? (
              <div className="flex flex-col items-end">
                <span className="px-2.5 py-0.5 rounded-full text-xs font-mono font-bold border border-rose-500/30 bg-rose-950/40 text-rose-300">
                  Excluded
                </span>
                <span className="text-[10px] font-mono text-slate-500 mt-0.5">
                  0 Cr in SGPA
                </span>
              </div>
            ) : isUnentered ? (
              <div className="flex flex-col items-end">
                <span className="px-2.5 py-0.5 rounded-full text-xs font-mono font-medium border border-white/10 bg-obsidian-850 text-slate-400">
                  Awaiting Marks
                </span>
                <span className="text-[10px] font-mono text-slate-500 mt-0.5">
                  0 / 100
                </span>
              </div>
            ) : (
              <div className="flex flex-col items-end">
                <span className={`px-2.5 py-0.5 rounded-full text-sm font-extrabold font-mono border ${theme.bg} ${theme.border} ${theme.text} ${theme.glow}`}>
                  Grade {predictedGrade} <span className="text-[11px] font-normal opacity-85">({gradePoint} GP)</span>
                </span>
                <span className="text-[10px] font-mono text-slate-400 mt-0.5">
                  Total: {totalWeightedScore.toFixed(1)}/100
                </span>
              </div>
            )}
          </div>
        </div>

        {/* ============================================================== */}
        {/* DIRECT INTERNAL MARKS ENTRY SECTION (Non-DirectGrade courses)  */}
        {/* ============================================================== */}
        {course.type !== 'DirectGrade' && (
          <div className="mt-4 p-3.5 rounded-xl bg-obsidian-850/70 border border-white/10 space-y-2.5">
            <div className="flex flex-wrap items-center justify-between gap-1.5">
              <span className="text-xs font-semibold text-slate-200 flex items-center gap-1.5">
                <Edit3 className="w-3.5 h-3.5 text-cyan-400" />
                Step 1: Your Internal Marks
              </span>
              
              {/* Quick presets & 1-click Attendance */}
              <div className="flex items-center gap-1 flex-wrap">
                {attendanceComp && (
                  <button
                    type="button"
                    onClick={() => {
                      onUpdateDirectInternal(course.id, undefined);
                      const isFull = attendanceComp.rawObtained >= attendanceComp.rawMax;
                      onUpdateComponentMarks(course.id, attendanceComp.id, isFull ? 0 : attendanceComp.rawMax);
                    }}
                    className={`text-[10px] font-mono px-2 py-0.5 rounded-full border transition-all flex items-center gap-1 ${
                      hasFullAttendance
                        ? 'bg-emerald-950/80 text-emerald-300 border-emerald-500/50 shadow-[0_0_8px_rgba(16,185,129,0.3)]'
                        : 'bg-obsidian-800 text-slate-400 border-white/10 hover:border-white/20'
                    }`}
                    title="One-click attendance toggle: CU awards full marks for >= 75% attendance"
                  >
                    <Check className="w-2.5 h-2.5" />
                    <span>{hasFullAttendance ? `+${attendanceComp.rawMax} Att` : 'No Att'}</span>
                  </button>
                )}
                     <div className="inline-flex items-center gap-0.5">
                  <button
                    type="button"
                    onClick={() => setShowRegexBox(!showRegexBox)}
                    className={`text-[10px] font-mono px-1.5 py-0.5 rounded border transition-all flex items-center gap-1 ${
                      showRegexBox
                        ? 'bg-cyan-950 text-cyan-300 border-cyan-500/50 shadow-[0_0_8px_rgba(6,182,212,0.2)]'
                        : 'bg-white/[0.04] text-cyan-400 border-white/5 hover:border-cyan-500/30'
                    }`}
                    title="Regex auto-fill marks from CUIMS copied text for this subject"
                  >
                    <ClipboardPaste className="w-2.5 h-2.5" />
                    <span>Regex Paste</span>
                  </button>
                  <MicroTooltip content="Regex Paste: Copy your raw internal marks table from the CUIMS portal and click paste. Automatically fills MSTs, Quizzes, Experiments, and Assignments with zero manual typing." />
                </div>
                {onConvertCourseMode && (
                  <div className="inline-flex items-center gap-0.5">
                    <button
                      type="button"
                      onClick={() => onConvertCourseMode(course.id, 'DirectGrade')}
                      className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-indigo-950/60 text-indigo-300 border border-indigo-500/30 hover:bg-indigo-900/60 transition-colors"
                      title="Switch this subject to Direct Grade (NPTEL / Certificate)"
                    >
                      ⇄ Direct Grade
                    </button>
                    <MicroTooltip content="Direct Grade: For NPTEL / MOOC electives where you get a direct letter grade without internal/external exams." />
                  </div>
                )}
              </div>
            </div>

            {/* Embedded Course Regex Paste Box */}
            {showRegexBox && (
              <CourseRegexPasteBox
                course={course}
                onApplyMarks={(updates) => {
                  onUpdateDirectInternal(course.id, undefined);
                  for (const u of updates) {
                    onUpdateComponentMarks(course.id, u.componentId, u.rawObtained);
                  }
                  setShowRegexBox(false);
                }}
                onClose={() => setShowRegexBox(false)}
                isCompact={true}
              />
            )}

            {/* Direct Total Internal Input Row */}
            <div className="flex items-center justify-between gap-2.5 bg-obsidian-900/90 p-2.5 rounded-lg border border-white/5">
              <div className="flex items-center gap-2.5 min-w-0">
                {isDetailedView && (
                  <div className="relative flex items-center justify-center w-9 h-9 flex-shrink-0">
                    <svg className="w-9 h-9 -rotate-90" viewBox="0 0 56 56">
                      <circle cx="28" cy="28" r={radius} stroke="rgba(255,255,255,0.08)" strokeWidth="4" fill="transparent" />
                      <circle cx="28" cy="28" r={radius} stroke={theme.ring} strokeWidth="4" fill="transparent" strokeDasharray={circumference} strokeDashoffset={strokeDashoffset} strokeLinecap="round" />
                    </svg>
                    <div className="absolute inset-0 flex items-center justify-center font-mono text-[9px] font-bold text-slate-200">
                      {internalPercent}%
                    </div>
                  </div>
                )}
                <div className="min-w-0">
                  <span className="text-xs font-semibold text-slate-300 block whitespace-nowrap">
                    {course.directInternalOverride !== undefined ? 'Direct Internals:' : 'Weighted Total:'}
                  </span>
                  <span className="text-[11px] text-slate-400 font-mono whitespace-nowrap">
                    Max: {maxInternalWeightage.toFixed(1)} wt
                  </span>
                </div>
              </div>

              {/* Directly editable internal score input: balanced width to prevent truncation of label while comfortably fitting decimal scores */}
              <div className="flex items-center gap-1.5 flex-shrink-0">
                <input
                  type="number"
                  min="0"
                  max={maxInternalWeightage}
                  step="0.5"
                  value={weightedInternalScore === 0 && course.directInternalOverride === undefined && course.components.every(c => c.rawObtained === 0) ? '' : weightedInternalScore}
                  onChange={(e) => {
                    const raw = e.target.value;
                    if (raw === '') {
                      onUpdateDirectInternal(course.id, 0);
                    } else {
                      const val = parseFloat(raw);
                      onUpdateDirectInternal(course.id, isNaN(val) ? 0 : val);
                    }
                  }}
                  placeholder="0.0"
                  title="Directly enter your total weighted internal marks"
                  className="w-20 px-2 py-1 rounded-md text-center num-input text-base sm:text-sm font-bold text-cyan-300 tracking-wide min-h-[38px]"
                />
                <span className="text-xs font-mono text-slate-400 whitespace-nowrap">/ {maxInternalWeightage.toFixed(1)}</span>
              </div>
            </div>

            {/* Toggleable Accordion for detailed component inputs (Experiments, MSTs) */}
            <div>
              <button
                type="button"
                onClick={() => setIsAccordionOpen(!isAccordionOpen)}
                className="w-full flex items-center justify-between text-[11px] text-cyan-400 hover:text-cyan-300 font-medium py-1 px-1 transition-colors"
              >
                <span>
                  {isAccordionOpen ? '▴ Hide Component Inputs' : `▾ Or edit individual assessments (${course.components.length} items)`}
                </span>
                <span className="text-[10px] font-mono text-slate-500">
                  {isAccordionOpen ? 'Close' : 'Expand'}
                </span>
              </button>

              {isAccordionOpen && (
                <div className="mt-2 pt-2 border-t border-white/5 space-y-1.5 max-h-48 overflow-y-auto pr-1">
                  <div className="text-[10px] text-slate-400 mb-1">
                    Entering raw scores here scales down automatically according to CU weightages:
                  </div>
                  {course.components.map((comp) => {
                    const isAtt = comp.category === 'Attendance' || comp.name.toLowerCase().includes('attendance');
                    return (
                      <div
                        key={comp.id}
                        className="p-1.5 rounded-lg bg-obsidian-900 border border-white/5 flex items-center justify-between text-xs"
                      >
                        <div className="min-w-0">
                          <span className="text-slate-300 text-[11px] truncate block font-medium">
                            {comp.name}
                          </span>
                          <span className="text-[10px] font-mono text-slate-500">
                            Raw Max: {comp.rawMax} • Weight: {comp.weightage}
                          </span>
                        </div>

                        {isAtt ? (
                          <div className="flex items-center gap-1.5 flex-shrink-0">
                            <button
                              type="button"
                              onClick={() => {
                                onUpdateDirectInternal(course.id, undefined);
                                const isFull = comp.rawObtained >= comp.rawMax;
                                onUpdateComponentMarks(course.id, comp.id, isFull ? 0 : comp.rawMax);
                              }}
                              className={`px-2 py-1 rounded text-xs font-mono font-bold transition-all border flex items-center gap-1 ${
                                comp.rawObtained >= comp.rawMax
                                  ? 'bg-emerald-950/90 text-emerald-300 border-emerald-500/50 shadow-[0_0_8px_rgba(16,185,129,0.3)]'
                                  : 'bg-obsidian-800 text-slate-400 border-white/10 hover:text-white'
                              }`}
                              title="Click to toggle: full marks if >= 75% attendance"
                            >
                              <Check className="w-3 h-3" />
                              <span>{comp.rawObtained >= comp.rawMax ? `Full +${comp.rawMax}` : `0 (Click +${comp.rawMax})`}</span>
                            </button>
                            <span className="text-[10px] font-mono text-slate-400 whitespace-nowrap">/ {comp.rawMax}</span>
                          </div>
                        ) : (
                          <div className="flex items-center gap-1.5 flex-shrink-0">
                            <input
                              type="number"
                              min="0"
                              max={comp.rawMax}
                              step="0.5"
                              value={comp.rawObtained === 0 ? '' : comp.rawObtained}
                              onChange={(e) => {
                                // When editing component, clear direct internal override so components dictate the score
                                onUpdateDirectInternal(course.id, undefined);
                                const raw = e.target.value;
                                onUpdateComponentMarks(course.id, comp.id, raw === '' ? 0 : (parseFloat(raw) || 0));
                              }}
                              placeholder="0"
                              className="w-20 px-2 py-1 rounded-md text-center num-input text-xs font-bold text-slate-100"
                            />
                            <span className="text-[10px] font-mono text-slate-400 whitespace-nowrap">/ {comp.rawMax}</span>
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          </div>
        )}

        {/* Group B Direct Grade Selector */}
        {course.type === 'DirectGrade' && (
          <div className="mt-4 p-3.5 rounded-xl bg-obsidian-850/70 border border-white/10 space-y-2">
            <div className="flex items-center justify-between text-xs">
              <span className="font-semibold text-slate-200">
                Step 1: Choose Your Expected Grade:
              </span>
              {onConvertCourseMode && (
                <button
                  type="button"
                  onClick={() => onConvertCourseMode(course.id, 'Theory')}
                  className="text-[10px] font-mono text-cyan-400 hover:text-cyan-300 underline"
                  title="Convert to standard 40 internal / 60 external theory evaluation"
                >
                  ⇄ Marks Mode (40/60)
                </button>
              )}
            </div>
            <div className="grid grid-cols-4 gap-1.5">
              {gradePills.map(g => {
                const isSelected = (course.directGrade || 'A') === g;
                const gTheme = GRADE_COLORS[g];
                return (
                  <button
                    key={g}
                    onClick={() => onUpdateDirectGrade(course.id, g)}
                    className={`py-2 rounded-lg text-xs font-mono font-bold border transition-all ${
                      isSelected
                        ? `${gTheme.bg} ${gTheme.border} ${gTheme.text} ${gTheme.glow} ring-1 ring-cyan-400/40`
                        : 'bg-obsidian-800/60 text-slate-400 border-white/5 hover:border-white/20 hover:text-slate-200'
                    }`}
                  >
                    {g} <span className="text-[10px] font-normal opacity-70">[{GRADE_POINTS[g]}]</span>
                  </button>
                );
              })}
            </div>
          </div>
        )}
      </div>

      {/* ============================================================== */}
      {/* STEP 2: EXTERNAL EXAM TARGET SLIDER & INPUT                   */}
      {/* ============================================================== */}
      <div className="mt-4 pt-3 border-t border-white/[0.08] space-y-3">
        {course.type !== 'DirectGrade' && (
          course.type === 'ContinuousEvaluation' || course.externalRawMax === 0 ? (
            <div className="p-3 rounded-xl bg-emerald-950/25 border border-emerald-500/25 text-xs space-y-1">
              <div className="flex items-center gap-1.5 text-emerald-300 font-semibold">
                <CheckCircle className="w-3.5 h-3.5 text-emerald-400 flex-shrink-0" />
                <span>100% Continuous Internal Evaluation</span>
              </div>
              <p className="text-[11px] text-slate-400 leading-relaxed">
                No end-term written external exam. Course grade is calculated 100% from internal milestone reviews, practical projects, viva, and continuous assessments.
              </p>
            </div>
          ) : (
            <div className="space-y-2">
              {/* Title & Editable Number Box */}
              <div className="flex items-center justify-between text-xs gap-2">
                <span className="text-slate-200 font-semibold flex items-center gap-1 min-w-0">
                  <SlidersHorizontal className="w-3.5 h-3.5 text-cyan-400 flex-shrink-0" />
                  <span className="truncate">Step 2: External ({course.externalName})</span>
                </span>
                
                <div className="flex items-center gap-1.5 font-mono flex-shrink-0">
                  <input
                    type="number"
                    min="0"
                    max={course.externalRawMax}
                    step="0.5"
                    value={course.externalTargetScore === 0 ? '' : course.externalTargetScore}
                    onChange={(e) => {
                      const raw = e.target.value;
                      onUpdateExternal(course.id, raw === '' ? 0 : (parseFloat(raw) || 0));
                    }}
                    placeholder="0"
                    className="w-18 px-2 py-1 rounded-md text-center num-input text-base sm:text-xs font-bold text-cyan-400 min-h-[36px]"
                  />
                  <span className="text-slate-400 text-xs whitespace-nowrap">/ {course.externalRawMax}</span>
                </div>
              </div>

              {/* Slider Track with Live Tickmarks */}
              <div className="relative">
                <input
                  type="range"
                  min="0"
                  max={course.externalRawMax}
                  step="0.5"
                  value={course.externalTargetScore}
                  onChange={(e) => onUpdateExternal(course.id, parseFloat(e.target.value) || 0)}
                  className="w-full h-2 bg-obsidian-800 rounded-lg slider-tactile appearance-none border border-white/10"
                />

                {/* Tick marks on slider track for grade thresholds */}
                {isDetailedView && (
                  <div className="relative w-full h-3 mt-1">
                    {targetRequirements.map((req) => {
                      if (!req.possible && !req.alreadyAchieved) return null;
                      const leftPercent = req.alreadyAchieved 
                        ? 0 
                        : (req.requiredExternalRaw / course.externalRawMax) * 100;
                      
                      if (leftPercent < 0 || leftPercent > 100) return null;

                      return (
                        <div
                          key={req.grade}
                          className="absolute -top-1 transform -translate-x-1/2 flex flex-col items-center pointer-events-none"
                          style={{ left: `${leftPercent}%` }}
                        >
                          <div className="w-[1.5px] h-2 bg-slate-500/60" />
                          <span className="text-[9px] font-mono text-slate-400 scale-90">
                            {req.grade}
                          </span>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>

              {/* Target Hint */}
              <div className="text-[11px] font-mono text-slate-400 flex flex-wrap items-center justify-between gap-1">
                {nextTarget ? (
                  <span className="text-cyan-300 flex items-center gap-1">
                    <Flame className="w-3 h-3 text-amber-400 inline" />
                    Target <strong className="text-cyan-200">{nextTarget.requiredExternalRaw}</strong> for <strong className="text-white">Grade {nextTarget.grade}</strong>
                    <span className="text-[10px] text-slate-400">
                      (~{result.gradeCutoffs[nextTarget.grade]}+ safe band)
                    </span>
                  </span>
                ) : (
                  <span className="text-emerald-400 font-medium">
                    ✓ High-Percentile Safe Zone (A+ ~95+)
                  </span>
                )}

                <span className="text-slate-500 text-[10px]" title="Relative curve: actual cutoff varies across sections">
                  Cohort Relative
                </span>
              </div>
            </div>
          )
        )}

        {/* Detailed Breakdown Button */}
        <button
          onClick={() => onInspect(course.id)}
          className="w-full py-1.5 px-3 rounded-xl bg-obsidian-800/60 hover:bg-obsidian-700/80 text-slate-300 hover:text-white border border-white/10 text-xs font-medium flex items-center justify-center gap-1.5 transition-all"
        >
          <span>Deep Grade Unlocker & Cutoff Inspector</span>
          <ChevronRight className="w-3.5 h-3.5 text-cyan-400" />
        </button>
      </div>
    </div>
  );
};
