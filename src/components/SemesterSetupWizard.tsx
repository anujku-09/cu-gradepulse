import React, { useState, useMemo, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import confetti from 'canvas-confetti';
import { 
  CheckCircle, 
  Sparkles, 
  ChevronRight, 
  ChevronLeft, 
  X, 
  Award, 
  GraduationCap, 
  SlidersHorizontal, 
  Edit3, 
  Check, 
  ArrowRight,
  TrendingUp,
  Layers,
  BookOpen,
  CalendarCheck,
  RotateCcw,
  Zap,
  Info,
  ShieldCheck,
  AlertTriangle,
  Eye,
  EyeOff,
  ClipboardPaste,
  Sliders,
  HelpCircle
} from 'lucide-react';
import { Course, CourseResult, GradeLevel, CurveMode, GradeCutoffs, CohortTrackId } from '../types';
import { GRADE_COLORS, GRADE_POINTS } from '../utils/gradeCalculations';
import { COHORT_TRACKS_INFO } from '../data/courses';
import { CourseRegexPasteBox } from './CourseRegexPasteBox';

interface SemesterSetupWizardProps {
  isOpen: boolean;
  onClose: () => void;
  courses: Course[];
  results: Record<string, CourseResult>;
  liveSgpa: number;
  totalGradedCredits: number;
  isGlobalMng: boolean;
  curveMode: CurveMode;
  currentTrackId: CohortTrackId;
  onSelectTrack: (trackId: CohortTrackId) => void;
  onOpenTrackModal: () => void;
  onCurveChange: (mode: CurveMode) => void;
  onOpenCutoffModal: () => void;
  onToggleGlobalMng: () => void;
  onUpdateExternal: (courseId: string, score: number) => void;
  onUpdateDirectGrade: (courseId: string, grade: GradeLevel) => void;
  onUpdateDirectInternal: (courseId: string, score: number | undefined) => void;
  onUpdateComponentMarks: (courseId: string, componentId: string, score: number) => void;
  onToggleCourseMng: (courseId: string) => void;
  onToggleCourseExcluded: (courseId: string) => void;
  onQuickPreset: (courseId: string, preset: 'full' | 'average' | 'reset') => void;
  onToggleAttendance: (courseId: string, full: boolean) => void;
  onClaimAllAttendance: () => void;
  onOpenEditCourse?: (course: Course) => void;
  onConvertCourseMode?: (courseId: string, targetType: 'Theory' | 'Practical' | 'DirectGrade') => void;
  onComplete: () => void;
}

export const SemesterSetupWizard: React.FC<SemesterSetupWizardProps> = ({
  isOpen,
  onClose,
  courses,
  results,
  liveSgpa,
  totalGradedCredits,
  isGlobalMng,
  curveMode,
  currentTrackId,
  onSelectTrack,
  onOpenTrackModal,
  onCurveChange,
  onOpenCutoffModal,
  onToggleGlobalMng,
  onUpdateExternal,
  onUpdateDirectGrade,
  onUpdateDirectInternal,
  onUpdateComponentMarks,
  onToggleCourseMng,
  onToggleCourseExcluded,
  onQuickPreset,
  onToggleAttendance,
  onClaimAllAttendance,
  onOpenEditCourse,
  onConvertCourseMode,
  onComplete,
}) => {
  // Step 0: Track Mode (MNG vs Graded & Cohort Section)
  // Step 1..totalCourseSteps: The Semester V Courses
  // Step totalCourseSteps + 1: Celebration / Summary Deck
  const [currentStep, setCurrentStep] = useState(0);
  const [direction, setDirection] = useState(1); // 1 = forward, -1 = back
  const [showDetailedComponents, setShowDetailedComponents] = useState(false);
  const [showRegexBox, setShowRegexBox] = useState(false);
  const [allAttendanceClaimed, setAllAttendanceClaimed] = useState(false);

  const currentTrack = COHORT_TRACKS_INFO.find(t => t.id === currentTrackId) || COHORT_TRACKS_INFO[0];

  // Ordered list of courses for the wizard:
  // Dynamically prioritizes core and specialization courses, including any custom added courses!
  const orderedCourses = useMemo(() => {
    const priorityCodes = [
      '24SMT-341', // Probability & Statistics (4.0 Cr)
      '24CSH-301', // PBL in Java (3.0 Cr)
      '24CSH-352', // Apple iOS App Dev (3.0 Cr)
      '24CST-351', // Web Development Fundamentals (3.0 Cr)
      '24CST-354', // ML Foundations (3.0 Cr)
      '24CST-356', // Cloud Arch (3.0 Cr)
      '24CST-358', // Network Security (3.0 Cr)
      'PE-5',      // Professional Elective (3.0 Cr)
      'PE-5A',     // Dual NPTEL 1
      'PE-5B',     // Dual NPTEL 2
      '24CST-302', // Computer Networks (3.0 Cr)
      '24CSP-353', // Apple Frameworks Lab (3.0 Cr)
      '24CSP-355', // AI Lab (3.0 Cr)
      '24CSP-357', // DevOps Lab (3.0 Cr)
      '24CSP-359', // Cyber Lab (3.0 Cr)
      '24CSP-305', // Competitive Coding-II (2.0 Cr)
      '24CSP-304', // Full Stack Development - II (1.0 Cr)
      '24TDP-311', // Soft Skills-III (2.0 Cr)
      '24TDT-312', // Aptitude-III (2.0 Cr)
    ];

    const result: Course[] = [];
    const addedIds = new Set<string>();

    for (const code of priorityCodes) {
      const match = courses.find(c => c.code.toUpperCase() === code && !addedIds.has(c.id));
      if (match) {
        result.push(match);
        addedIds.add(match.id);
      }
    }

    for (const c of courses) {
      if (!addedIds.has(c.id)) {
        result.push(c);
        addedIds.add(c.id);
      }
    }

    return result;
  }, [courses]);

  const totalCourseSteps = orderedCourses.length;
  const celebrationStep = totalCourseSteps + 1;

  // Keyboard navigation
  useEffect(() => {
    if (!isOpen) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      } else if (e.key === 'ArrowRight' && currentStep < celebrationStep) {
        setDirection(1);
        setCurrentStep(prev => prev + 1);
      } else if (e.key === 'ArrowLeft' && currentStep > 0) {
        setDirection(-1);
        setCurrentStep(prev => prev - 1);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, currentStep, celebrationStep, onClose]);

  // When reaching celebration step, fire confetti
  useEffect(() => {
    if (isOpen && currentStep === celebrationStep) {
      try {
        confetti({
          particleCount: 80,
          spread: 80,
          origin: { y: 0.55 },
          colors: ['#06b6d4', '#6366f1', '#10b981', '#f59e0b', '#ec4899']
        });
      } catch (e) {}
    }
  }, [isOpen, currentStep, celebrationStep]);

  if (!isOpen) return null;

  const activeCourse = currentStep >= 1 && currentStep <= totalCourseSteps ? orderedCourses[currentStep - 1] : null;
  const activeResult = activeCourse ? results[activeCourse.id] : null;

  // Check if course is unentered (0 marks entered yet)
  const isActiveCourseUnentered = activeCourse && activeResult
    ? (activeCourse.type === 'DirectGrade'
        ? !activeCourse.directGrade
        : activeResult.totalWeightedScore === 0 &&
          (activeCourse.directInternalOverride === undefined || activeCourse.directInternalOverride === 0) &&
          activeCourse.components.every(c => c.rawObtained === 0) &&
          activeCourse.externalTargetScore === 0)
    : false;

  // Check if active course has an attendance component
  const attendanceComp = activeCourse?.components.find(
    c => c.category === 'Attendance' || c.name.toLowerCase().includes('attendance')
  );
  const hasFullAttendance = attendanceComp ? attendanceComp.rawObtained >= attendanceComp.rawMax : false;

  const handleEnterMissionControl = () => {
    onComplete();
    window.scrollTo({ top: 0, behavior: 'smooth' });
    setTimeout(() => {
      document.getElementById('course-matrix')?.scrollIntoView({ behavior: 'smooth' });
    }, 150);
  };

  const handleNext = () => {
    if (currentStep < celebrationStep) {
      setDirection(1);
      setCurrentStep(prev => prev + 1);
      setShowDetailedComponents(false);
      setShowRegexBox(false);
    } else {
      handleEnterMissionControl();
    }
  };

  const handleBack = () => {
    if (currentStep > 0) {
      setDirection(-1);
      setCurrentStep(prev => prev - 1);
      setShowDetailedComponents(false);
      setShowRegexBox(false);
    }
  };

  const handleJumpToStep = (stepIdx: number) => {
    setDirection(stepIdx > currentStep ? 1 : -1);
    setCurrentStep(stepIdx);
    setShowDetailedComponents(false);
    setShowRegexBox(false);
  };

  const handleSkipToDashboard = () => {
    onComplete();
    setTimeout(() => {
      document.getElementById('course-matrix')?.scrollIntoView({ behavior: 'smooth' });
    }, 100);
  };

  const handleClaimAll = () => {
    onClaimAllAttendance();
    setAllAttendanceClaimed(true);
    try {
      confetti({ particleCount: 30, spread: 50, origin: { y: 0.2 } });
    } catch (e) {}
  };

  // Grade pill options for Group B (PE-5)
  const gradePills: GradeLevel[] = ['A+', 'A', 'B+', 'B', 'C+', 'C', 'D', 'F'];

  // Animation variants
  const slideVariants = {
    enter: (dir: number) => ({
      x: dir > 0 ? 320 : -320,
      opacity: 0,
      scale: 0.96,
    }),
    center: {
      x: 0,
      opacity: 1,
      scale: 1,
      transition: {
        type: 'spring',
        stiffness: 340,
        damping: 30,
      }
    },
    exit: (dir: number) => ({
      x: dir < 0 ? 320 : -320,
      opacity: 0,
      scale: 0.96,
      transition: {
        duration: 0.18,
      }
    })
  };

  // Check how many courses have non-zero marks
  const configuredCoursesCount = courses.filter(c => {
    if (c.type === 'DirectGrade') return !!c.directGrade;
    if (c.directInternalOverride !== undefined && c.directInternalOverride > 0) return true;
    const internalSum = c.components.reduce((acc, comp) => acc + comp.rawObtained, 0);
    return internalSum > 0 || c.externalTargetScore > 0;
  }).length;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-obsidian-950/85 backdrop-blur-xl flex flex-col justify-between p-3 sm:p-6 animate-fadeIn select-none">
      
      {/* ============================================================== */}
      {/* 1. TOP HEADER & LIVE PROGRESS HUB                             */}
      {/* ============================================================== */}
      <div className="w-full max-w-4xl mx-auto flex flex-col gap-3">
        <div className="flex items-center justify-between gap-2 sm:gap-3 flex-wrap sm:flex-nowrap">
          {/* Brand & Step title */}
          <div className="flex items-center gap-2 sm:gap-2.5">
            <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-xl bg-gradient-to-br from-cyan-500/20 via-indigo-500/20 to-violet-500/20 border border-cyan-500/30 flex items-center justify-center shadow-[0_0_15px_rgba(6,182,212,0.3)] flex-shrink-0">
              <Sparkles className="w-4 h-4 text-cyan-400" />
            </div>
            <div>
              <div className="flex items-center gap-1.5 sm:gap-2">
                <span className="text-xs sm:text-sm font-extrabold text-white tracking-tight">
                  CU <span className="text-cyan-400">GradePulse</span>
                </span>
                <span className="text-[9px] sm:text-[10px] font-mono px-1.5 sm:px-2 py-0.5 rounded-full bg-cyan-950 text-cyan-300 border border-cyan-800/60 uppercase">
                  Sem V Fast-Track
                </span>
              </div>
              <p className="text-[10px] sm:text-[11px] text-slate-400 font-medium">
                {currentStep === 0 && 'Step 0: Choose Section & Evaluation Track'}
                {currentStep >= 1 && currentStep <= totalCourseSteps && `Subject ${currentStep} of ${totalCourseSteps}: ${activeCourse?.code}`}
                {currentStep === celebrationStep && 'Final Step: Academic Flight Plan'}
              </p>
            </div>
          </div>

          {/* Right: Live SGPA badge & Cutoff Curve & Cohort Pill & Global Attendance & Close */}
          <div className="flex items-center gap-1.5 sm:gap-2 ml-auto sm:ml-0 flex-wrap sm:flex-nowrap justify-end">
            
            {/* Cohort Section Pill in Wizard Header */}
            <button
              type="button"
              onClick={onOpenTrackModal}
              title="Click to switch your 5th Sem section (Apple, AI/ML, Cloud, Cyber, General)"
              className="flex items-center gap-1.5 px-2.5 py-1 rounded-xl bg-cyan-950/60 hover:bg-cyan-900/60 border border-cyan-500/40 text-cyan-300 text-xs font-semibold transition-all shadow-[0_0_10px_rgba(6,182,212,0.15)]"
            >
              <span>{currentTrack.icon}</span>
              <span className="hidden xs:inline">{currentTrack.name}</span>
            </button>

            {/* Cutoff Line / Curve Mode Option in Wizard Nav */}
            <div className="flex items-center gap-1 sm:gap-1.5 px-2 py-1 rounded-xl bg-obsidian-900 border border-white/10 text-xs">
              <span className="text-[10px] font-mono text-slate-400 hidden lg:inline">Cutoff:</span>
              <select
                value={curveMode}
                onChange={(e) => onCurveChange(e.target.value as CurveMode)}
                className="bg-obsidian-850 border border-white/10 rounded-md text-[10px] sm:text-xs text-cyan-300 px-1.5 sm:px-2 py-0.5 font-mono focus:border-cyan-500 focus:outline-none cursor-pointer"
                title="Cohort Cutoff Curve Difficulty"
              >
                <option value="standard">Standard (95+)</option>
                <option value="strict">Strict (96+)</option>
                <option value="lenient">Lenient (91+)</option>
                {curveMode === 'custom' && <option value="custom">Custom</option>}
              </select>

              <button
                type="button"
                onClick={onOpenCutoffModal}
                title="Inspect & Customize Cutoff Matrix (A+, A, B+, B, C+, C, D thresholds)"
                className="p-1 rounded text-slate-400 hover:text-white hover:bg-white/5 transition-colors"
              >
                <Sliders className="w-3.5 h-3.5 text-cyan-400" />
              </button>
            </div>

            {/* Live Predicted SGPA badge */}
            <div className="flex items-center gap-1 sm:gap-1.5 px-2 sm:px-2.5 py-1 rounded-xl bg-obsidian-900 border border-white/10 shadow-inner">
              <span className="text-[9px] sm:text-[10px] font-mono text-slate-400 uppercase tracking-wider hidden xs:inline">SGPA:</span>
              <span className={`text-sm sm:text-base font-extrabold font-mono ${
                liveSgpa >= 9.0 ? 'text-emerald-400' : liveSgpa >= 8.0 ? 'text-cyan-300' : liveSgpa >= 7.0 ? 'text-indigo-300' : liveSgpa > 0 ? 'text-amber-400' : 'text-slate-400'
              }`}>
                {liveSgpa > 0 ? liveSgpa.toFixed(2) : '--.--'}
              </span>
            </div>

            {/* Quick 100% Attendance Claimer */}
            <button
              onClick={handleClaimAll}
              title="Give full attendance marks to all 6 subjects with attendance requirements (>75%)"
              className={`hidden sm:flex items-center gap-1.5 px-2.5 sm:px-3 py-1.5 rounded-xl text-xs font-semibold font-mono transition-all border ${
                allAttendanceClaimed
                  ? 'bg-emerald-950/70 text-emerald-300 border-emerald-500/50 shadow-[0_0_12px_rgba(16,185,129,0.25)]'
                  : 'bg-obsidian-850 text-slate-300 hover:text-white border-white/10 hover:border-cyan-500/40'
              }`}
            >
              <CalendarCheck className="w-3.5 h-3.5 text-emerald-400" />
              <span>{allAttendanceClaimed ? '✓ 100% Att' : 'Claim Attendance'}</span>
            </button>

            {/* Close / Skip to Dashboard */}
            <button
              type="button"
              onClick={handleSkipToDashboard}
              className="px-2.5 sm:px-3 py-1.5 rounded-xl text-xs font-semibold text-slate-300 hover:text-white bg-obsidian-850 hover:bg-white/10 border border-white/10 transition-colors flex items-center gap-1 sm:gap-1.5 shadow-sm whitespace-nowrap active:scale-95 touch-manipulation"
              title="Exit setup wizard and open full mission control dashboard"
            >
              <span className="hidden xs:inline">Skip to </span>Dashboard
              <X className="w-3.5 h-3.5 text-slate-400" />
            </button>
          </div>
        </div>

        {/* Animated Progress Bar */}
        <div className="w-full bg-obsidian-900 h-1.5 rounded-full overflow-hidden border border-white/5 relative">
          <motion.div
            className="h-full bg-gradient-to-r from-cyan-500 via-indigo-500 to-violet-500"
            initial={{ width: 0 }}
            animate={{ width: `${(currentStep / celebrationStep) * 100}%` }}
            transition={{ ease: 'easeInOut', duration: 0.3 }}
          />
        </div>

        {/* Step Navigation Dots (Clickable) */}
        <div className="flex items-center justify-between px-1 overflow-x-auto no-scrollbar py-1">
          {Array.from({ length: celebrationStep + 1 }, (_, i) => {
            const isCompleted = i < currentStep;
            const isCurrent = i === currentStep;
            return (
              <button
                key={i}
                onClick={() => handleJumpToStep(i)}
                className={`flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-mono transition-all flex-shrink-0 ${
                  isCurrent
                    ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-400/50 font-bold shadow-[0_0_10px_rgba(6,182,212,0.3)]'
                    : isCompleted
                    ? 'text-slate-400 hover:text-white'
                    : 'text-slate-600 hover:text-slate-400'
                }`}
              >
                <span>{i === 0 ? 'Track' : i === celebrationStep ? 'Done' : orderedCourses[i - 1]?.code.split('-')[0]}</span>
                {isCompleted && <Check className="w-2.5 h-2.5 text-emerald-400" />}
              </button>
            );
          })}
        </div>
      </div>

      {/* ============================================================== */}
      {/* 2. THE ANIMATED CARD STACK (AnimatePresence)                  */}
      {/* ============================================================== */}
      <div className="w-full max-w-2xl mx-auto my-auto py-2">
        <AnimatePresence mode="wait" custom={direction}>
          
          {/* ============================================================ */}
          {/* CARD 0: BATCH TRACK MODE (MNG VS GRADED)                     */}
          {/* ============================================================ */}
          {currentStep === 0 && (
            <motion.div
              key="step-0"
              custom={direction}
              variants={slideVariants}
              initial="enter"
              animate="center"
              exit="exit"
              className="glass-card rounded-2xl p-5 sm:p-7 border border-white/15 shadow-2xl relative overflow-hidden"
            >
              <div className="absolute top-0 right-0 w-64 h-64 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none" />
              
              <div className="text-center space-y-2 mb-6">
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-mono font-semibold bg-cyan-950/80 text-cyan-300 border border-cyan-800/60">
                  <GraduationCap className="w-3.5 h-3.5" />
                  Chandigarh University • CSE Semester V
                </span>
                <h2 className="text-xl sm:text-2xl font-extrabold text-white tracking-tight">
                  Configure Your 5th Sem Setup
                </h2>
                <p className="text-xs sm:text-sm text-slate-400 max-w-lg mx-auto">
                  Select your specialization cohort (Apple, AI/ML, Cloud, Cyber, General) and Aptitude/Soft Skills evaluation track.
                </p>
              </div>

              {/* 1. CHOOSE YOUR COHORT / SPECIALIZATION SECTION */}
              <div className="space-y-2 mb-6 text-left">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-slate-200 flex items-center gap-1.5">
                    <span>1. Select Your 5th Sem Cohort / Section:</span>
                  </span>
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-cyan-950 text-cyan-300 border border-cyan-800/60 font-semibold">
                    Universal Cohort Presets
                  </span>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                  {COHORT_TRACKS_INFO.map(track => {
                    const isSelected = track.id === currentTrackId;
                    return (
                      <button
                        key={track.id}
                        type="button"
                        onClick={() => onSelectTrack(track.id)}
                        className={`p-2.5 rounded-xl border text-left transition-all flex items-center gap-2.5 ${
                          isSelected
                            ? 'bg-gradient-to-r from-cyan-950/80 to-indigo-950/80 border-cyan-500 text-white shadow-[0_0_15px_rgba(6,182,212,0.25)] ring-1 ring-cyan-500/50'
                            : 'bg-obsidian-900/80 hover:bg-obsidian-850 border-white/10 text-slate-300'
                        }`}
                      >
                        <span className="text-xl flex-shrink-0">{track.icon}</span>
                        <div className="min-w-0">
                          <span className={`text-xs font-bold block truncate ${isSelected ? 'text-cyan-300' : 'text-slate-200'}`}>
                            {track.name}
                          </span>
                          <span className="text-[10px] text-slate-400 block truncate font-mono">
                            {track.badge}
                          </span>
                        </div>
                      </button>
                    );
                  })}
                </div>

                <div className="p-2.5 rounded-xl bg-obsidian-850/80 border border-white/10 text-[11px] text-slate-300 flex flex-col sm:flex-row sm:items-center justify-between gap-1">
                  <div className="flex items-center gap-1.5 truncate">
                    <span className="text-cyan-400 font-mono font-semibold">Electives:</span>
                    <span className="text-slate-200 font-medium truncate">{currentTrack.electiveHighlight}</span>
                  </div>
                  <span className="text-[10px] text-emerald-400 font-medium flex-shrink-0">
                    ✓ Core Marks Preserved
                  </span>
                </div>
              </div>

              {/* 2. CHOOSE APTITUDE & SOFT SKILLS EVALUATION */}
              <div className="space-y-2 mb-6 text-left">
                <span className="text-xs font-bold text-slate-200 block">
                  2. How does your batch evaluate Aptitude & Soft Skills?
                </span>
                <p className="text-[11px] text-slate-400">
                  In Chandigarh University, Soft Skills-III (<code className="font-mono text-cyan-300">24TDP-311</code>) and Aptitude-III (<code className="font-mono text-cyan-300">24TDT-312</code>) are evaluated as Non-Graded (MNG) or Graded.
                </p>
              </div>

              {/* 2 Options Cards */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
                
                {/* Option A: Non-Graded (MNG) */}
                <div
                  onClick={() => {
                    if (!isGlobalMng) onToggleGlobalMng();
                  }}
                  className={`p-4 rounded-xl border cursor-pointer transition-all flex flex-col justify-between ${
                    isGlobalMng
                      ? 'bg-gradient-to-b from-cyan-950/60 to-obsidian-900 border-cyan-500/50 shadow-[0_0_20px_rgba(6,182,212,0.2)] ring-1 ring-cyan-500/50'
                      : 'bg-obsidian-900/60 border-white/10 hover:border-white/20'
                  }`}
                >
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-emerald-950 text-emerald-300 border border-emerald-800/60 font-bold uppercase">
                        Recommended (90% Batches)
                      </span>
                      {isGlobalMng && <CheckCircle className="w-4 h-4 text-cyan-400" />}
                    </div>
                    <h3 className="font-bold text-white text-base">
                      Non-Graded Track (MNG)
                    </h3>
                    <p className="text-xs text-slate-400 leading-relaxed">
                      Requires <strong>≥ 40 / 100</strong> to qualify and avoid a backlog. Their marks <strong>do not affect</strong> your final SGPA calculation.
                    </p>
                  </div>
                  <div className="mt-4 pt-3 border-t border-white/5 flex items-center justify-between text-xs font-mono">
                    <span className="text-slate-400">Total Graded Credits:</span>
                    <span className="font-bold text-cyan-300">19.0 Credits</span>
                  </div>
                </div>

                {/* Option B: Graded Track */}
                <div
                  onClick={() => {
                    if (isGlobalMng) onToggleGlobalMng();
                  }}
                  className={`p-4 rounded-xl border cursor-pointer transition-all flex flex-col justify-between ${
                    !isGlobalMng
                      ? 'bg-gradient-to-b from-indigo-950/60 to-obsidian-900 border-indigo-500/50 shadow-[0_0_20px_rgba(99,102,241,0.2)] ring-1 ring-indigo-500/50'
                      : 'bg-obsidian-900/60 border-white/10 hover:border-white/20'
                  }`}
                >
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-indigo-950 text-indigo-300 border border-indigo-800/60 font-bold uppercase">
                        Full Credit Track
                      </span>
                      {!isGlobalMng && <CheckCircle className="w-4 h-4 text-indigo-400" />}
                    </div>
                    <h3 className="font-bold text-white text-base">
                      Graded Track
                    </h3>
                    <p className="text-xs text-slate-400 leading-relaxed">
                      Soft Skills and Aptitude letter grades (A+ to F) <strong>directly count</strong> into your 10-point SGPA formula.
                    </p>
                  </div>
                  <div className="mt-4 pt-3 border-t border-white/5 flex items-center justify-between text-xs font-mono">
                    <span className="text-slate-400">Total Graded Credits:</span>
                    <span className="font-bold text-indigo-300">23.0 Credits</span>
                  </div>
                </div>

              </div>

              {/* Action Button */}
              <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-4 border-t border-white/10">
                <button
                  type="button"
                  onClick={handleSkipToDashboard}
                  className="w-full sm:w-auto px-4 py-2.5 rounded-xl bg-obsidian-850 hover:bg-obsidian-800 text-slate-300 hover:text-white text-xs font-semibold border border-white/10 transition-colors order-2 sm:order-1 text-center"
                >
                  Skip to Dashboard (Explore Bento Grid)
                </button>
                <button
                  type="button"
                  onClick={handleNext}
                  className="w-full sm:w-auto px-6 py-2.5 rounded-xl bg-gradient-to-r from-cyan-500 to-indigo-600 hover:from-cyan-400 hover:to-indigo-500 text-white font-bold text-sm shadow-[0_0_20px_rgba(6,182,212,0.3)] flex items-center justify-center gap-2 transition-all order-1 sm:order-2"
                >
                  <span>Start Subject Cards</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </motion.div>
          )}

          {/* ============================================================ */}
          {/* CARDS 1 THROUGH N: THE SEMESTER V SUBJECTS                   */}
          {/* ============================================================ */}
          {currentStep >= 1 && currentStep <= totalCourseSteps && activeCourse && activeResult && (
            <motion.div
              key={`step-${currentStep}-${activeCourse.id}`}
              custom={direction}
              variants={slideVariants}
              initial="enter"
              animate="center"
              exit="exit"
              className="glass-card rounded-2xl p-5 sm:p-6 border border-white/15 shadow-2xl relative overflow-hidden"
            >
              {/* Top Subject Identity Header */}
              <div className="flex items-start justify-between gap-3 pb-3 border-b border-white/10">
                <div>
                  <div className="flex items-center gap-2 flex-wrap mb-1">
                    <span className="font-mono text-xs font-bold px-2 py-0.5 rounded bg-white/[0.08] text-white border border-white/10">
                      {activeCourse.code}
                    </span>
                    <span className="text-xs font-mono font-bold text-cyan-300">
                      {activeCourse.credits.toFixed(1)} Credits
                    </span>
                    <span className="text-[10px] font-mono uppercase px-2 py-0.5 rounded bg-obsidian-850 text-slate-400 border border-white/5">
                      {activeCourse.type}
                    </span>
                    {activeCourse.credits >= 3.0 && (
                      <span className="text-[10px] font-semibold text-amber-300 bg-amber-950/60 px-2 py-0.5 rounded border border-amber-800/40">
                        ⚡ Core Impact
                      </span>
                    )}

                    {/* Configure Subject Button */}
                    {onOpenEditCourse && (
                      <button
                        type="button"
                        onClick={() => onOpenEditCourse(activeCourse)}
                        title="Configure subject name, code, credits, or change evaluation mode"
                        className="flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-mono text-slate-300 hover:text-cyan-300 bg-white/5 hover:bg-white/10 border border-white/10 transition-colors"
                      >
                        <Sliders className="w-2.5 h-2.5 text-cyan-400" />
                        <span>Config</span>
                      </button>
                    )}

                    {/* 1-Click Evaluation Mode Swapper */}
                    {onConvertCourseMode && activeCourse.type === 'DirectGrade' && (
                      <button
                        type="button"
                        onClick={() => onConvertCourseMode(activeCourse.id, 'Theory')}
                        title="Switch to 40 internal / 60 external theory marks evaluation"
                        className="flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-mono text-cyan-300 bg-cyan-950/60 border border-cyan-500/40 hover:bg-cyan-900/60 transition-colors"
                      >
                        ⇄ Marks Mode (40/60)
                      </button>
                    )}
                    {onConvertCourseMode && activeCourse.type !== 'DirectGrade' && (
                      <button
                        type="button"
                        onClick={() => onConvertCourseMode(activeCourse.id, 'DirectGrade')}
                        title="Switch to direct grade (NPTEL / MOOC / Certificate)"
                        className="flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-mono text-indigo-300 bg-indigo-950/60 border border-indigo-500/40 hover:bg-indigo-900/60 transition-colors"
                      >
                        ⇄ Direct Grade (NPTEL)
                      </button>
                    )}
                  </div>
                  <h3 className="text-lg sm:text-xl font-bold text-white">
                    {activeCourse.name}
                  </h3>
                </div>

                {/* Live Predicted Grade for this card */}
                <div className="flex flex-col items-end flex-shrink-0">
                  {activeCourse.isExcluded ? (
                    <span className="px-3 py-1 rounded-full text-xs font-mono font-bold bg-rose-950/70 text-rose-300 border border-rose-500/30">
                      Excluded (0 Cr)
                    </span>
                  ) : isActiveCourseUnentered ? (
                    <span className="px-3 py-1 rounded-full text-xs font-mono font-medium border border-white/10 bg-obsidian-850 text-slate-400">
                      Awaiting Marks
                    </span>
                  ) : activeCourse.isNonGraded ? (
                    <span className={`px-3 py-1 rounded-full text-xs font-mono font-bold border flex items-center gap-1 ${
                      activeResult.isQualified
                        ? 'bg-emerald-950 text-emerald-300 border-emerald-500/50'
                        : 'bg-rose-950 text-rose-300 border-rose-500/50 animate-pulse'
                    }`}>
                      {activeResult.isQualified ? <CheckCircle className="w-3.5 h-3.5" /> : null}
                      {activeResult.isQualified ? 'QUALIFIED (PASS)' : 'NOT QUALIFIED'}
                    </span>
                  ) : (
                    <span className={`px-3 py-1 rounded-full text-sm font-extrabold font-mono border ${
                      GRADE_COLORS[activeResult.predictedGrade]?.bg || 'bg-obsidian-850'
                    } ${GRADE_COLORS[activeResult.predictedGrade]?.text || 'text-cyan-300'} ${
                      GRADE_COLORS[activeResult.predictedGrade]?.border || 'border-cyan-500/30'
                    } ${GRADE_COLORS[activeResult.predictedGrade]?.glow || ''}`}>
                      Grade {activeResult.predictedGrade} ({activeResult.gradePoint} GP)
                    </span>
                  )}
                  <span className="text-[10px] font-mono text-slate-400 mt-1">
                    {isActiveCourseUnentered ? '0.0 / 100 (Unentered)' : `Total: ${activeResult.totalWeightedScore.toFixed(1)} / 100`}
                  </span>
                </div>
              </div>

              {/* Course Exclude / Include Option */}
              <div className="flex items-center justify-between py-2 text-xs">
                <span className="text-slate-400">
                  {activeCourse.isExcluded 
                    ? '⚠️ This course is currently excluded from SGPA calculations.' 
                    : 'Included in your SGPA calculation.'}
                </span>
                <button
                  type="button"
                  onClick={() => onToggleCourseExcluded(activeCourse.id)}
                  className={`flex items-center gap-1 text-[11px] font-mono font-semibold px-2 py-0.5 rounded transition-all border ${
                    activeCourse.isExcluded
                      ? 'bg-rose-950/60 text-rose-300 border-rose-500/40 hover:bg-rose-900/60'
                      : 'bg-obsidian-800 text-slate-400 border-white/10 hover:text-white'
                  }`}
                >
                  {activeCourse.isExcluded ? <EyeOff className="w-3 h-3 text-rose-400" /> : <Eye className="w-3 h-3" />}
                  <span>{activeCourse.isExcluded ? 'Excluded' : 'Exclude Subject'}</span>
                </button>
              </div>

              {/* CARD BODY CONTENT */}
              <div className="space-y-4 my-3">

                {/* -------------------------------------------------------- */}
                {/* 1. ATTENDANCE QUICK-TOGGLE (NO TYPING NEEDED!)           */}
                {/* -------------------------------------------------------- */}
                {attendanceComp && (
                  <div className="p-3 rounded-xl bg-gradient-to-r from-obsidian-900 to-obsidian-850 border border-white/10 flex flex-col sm:flex-row sm:items-center justify-between gap-2.5">
                    <div className="space-y-0.5">
                      <span className="text-xs font-bold text-white flex items-center gap-1.5">
                        <CalendarCheck className="w-3.5 h-3.5 text-emerald-400" />
                        Class Attendance (≥ 75% Rule)
                      </span>
                      <p className="text-[11px] text-slate-400">
                        Chandigarh University awards full {attendanceComp.rawMax} marks for ≥ 75% attendance.
                      </p>
                    </div>

                    <button
                      type="button"
                      onClick={() => onToggleAttendance(activeCourse.id, !hasFullAttendance)}
                      className={`w-full sm:w-auto flex-shrink-0 flex items-center justify-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-mono font-bold transition-all border active:scale-95 touch-manipulation ${
                        hasFullAttendance
                          ? 'bg-emerald-950/80 text-emerald-300 border-emerald-500/50 shadow-[0_0_15px_rgba(16,185,129,0.3)]'
                          : 'bg-obsidian-800 text-slate-400 border-white/15 hover:border-white/30 hover:text-slate-200'
                      }`}
                    >
                      {hasFullAttendance ? (
                        <>
                          <Check className="w-3.5 h-3.5 text-emerald-400" />
                          <span>Full +{attendanceComp.rawMax}.0 Marks Claimed</span>
                        </>
                      ) : (
                        <span>Click if ≥ 75% Attended (+{attendanceComp.rawMax})</span>
                      )}
                    </button>
                  </div>
                )}

                {/* -------------------------------------------------------- */}
                {/* 2. INTERNAL MARKS ENTRY (For Non-DirectGrade)            */}
                {/* -------------------------------------------------------- */}
                {activeCourse.type !== 'DirectGrade' && (
                  <div className="p-4 rounded-xl bg-obsidian-850/70 border border-white/10 space-y-3">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                      <span className="text-xs font-bold text-slate-200 flex items-center gap-1.5">
                        <Edit3 className="w-3.5 h-3.5 text-cyan-400" />
                        Step 1: Your Internal Marks
                      </span>
                      
                      {/* One-click quick presets */}
                      <div className="flex items-center gap-1.5 flex-wrap">
                        <button
                          type="button"
                          onClick={() => {
                            onUpdateDirectInternal(activeCourse.id, undefined);
                            onQuickPreset(activeCourse.id, 'full');
                          }}
                          className="text-[10px] font-mono px-2 py-0.5 rounded bg-white/[0.04] hover:bg-emerald-950/60 hover:text-emerald-300 text-slate-400 border border-white/5 transition-colors"
                        >
                          Full Marks
                        </button>
                        <button
                          type="button"
                          onClick={() => {
                            onUpdateDirectInternal(activeCourse.id, undefined);
                            onQuickPreset(activeCourse.id, 'average');
                          }}
                          className="text-[10px] font-mono px-2 py-0.5 rounded bg-white/[0.04] hover:bg-cyan-950/60 hover:text-cyan-300 text-slate-400 border border-white/5 transition-colors"
                        >
                          75% Avg
                        </button>
                        <button
                          type="button"
                          onClick={() => {
                            onUpdateDirectInternal(activeCourse.id, 0);
                            onQuickPreset(activeCourse.id, 'reset');
                          }}
                          className="text-[10px] font-mono px-2 py-0.5 rounded bg-white/[0.04] hover:bg-rose-950/60 hover:text-rose-300 text-slate-400 border border-white/5 transition-colors"
                        >
                          Zero
                        </button>
                        <button
                          type="button"
                          onClick={() => setShowRegexBox(!showRegexBox)}
                          className={`text-[10px] font-mono px-2 py-0.5 rounded border transition-all flex items-center gap-1 ${
                            showRegexBox
                              ? 'bg-cyan-950 text-cyan-300 border-cyan-500/50 shadow-[0_0_10px_rgba(6,182,212,0.3)]'
                              : 'bg-white/[0.04] text-cyan-400 border-white/10 hover:border-cyan-500/30'
                          }`}
                          title="Paste copied table text from CUIMS portal to auto-fill marks via regex"
                        >
                          <ClipboardPaste className="w-3 h-3 text-cyan-400" />
                          <span>Regex Paste</span>
                        </button>
                      </div>
                    </div>

                    {/* Embedded Course Regex Paste Box */}
                    {showRegexBox && (
                      <CourseRegexPasteBox
                        course={activeCourse}
                        onApplyMarks={(updates) => {
                          onUpdateDirectInternal(activeCourse.id, undefined);
                          for (const u of updates) {
                            onUpdateComponentMarks(activeCourse.id, u.componentId, u.rawObtained);
                          }
                          setShowRegexBox(false);
                        }}
                        onClose={() => setShowRegexBox(false)}
                      />
                    )}

                    {/* Simple Big Direct Internal Box */}
                    <div className="flex items-center justify-between gap-3 p-3 rounded-xl bg-obsidian-900 border border-white/5">
                      <div>
                        <span className="text-xs font-semibold text-slate-200 block">
                          Total Weighted Internal Score:
                        </span>
                        <span className="text-[11px] text-slate-400 font-mono">
                          Out of {activeResult.maxInternalWeightage.toFixed(1)} max weightage
                        </span>
                      </div>

                      <div className="flex items-center gap-2">
                        <input
                          type="number"
                          min="0"
                          max={activeResult.maxInternalWeightage}
                          step="0.5"
                          value={activeResult.weightedInternalScore === 0 && activeCourse.directInternalOverride === undefined && activeCourse.components.every(c => c.rawObtained === 0) ? '' : activeResult.weightedInternalScore}
                          onChange={(e) => {
                            const raw = e.target.value;
                            if (raw === '') {
                              onUpdateDirectInternal(activeCourse.id, 0);
                            } else {
                              const val = parseFloat(raw);
                              onUpdateDirectInternal(activeCourse.id, isNaN(val) ? 0 : val);
                            }
                          }}
                          placeholder="0.0"
                          className="w-24 px-3 py-1.5 rounded-lg text-center num-input text-base font-bold text-cyan-300 tracking-wide bg-obsidian-850 border border-white/10"
                        />
                        <span className="text-xs font-mono text-slate-400">/ {activeResult.maxInternalWeightage.toFixed(1)}</span>
                      </div>
                    </div>

                    {/* Detailed Assessments Toggle */}
                    <div>
                      <button
                        type="button"
                        onClick={() => setShowDetailedComponents(!showDetailedComponents)}
                        className="text-[11px] text-cyan-400 hover:text-cyan-300 font-medium transition-colors flex items-center gap-1"
                      >
                        <span>{showDetailedComponents ? '▴ Hide Individual Assessment Inputs' : `▾ Or enter individual marks (${activeCourse.components.length} assessments: MSTs, Quizzes, Experiments)`}</span>
                      </button>

                      {showDetailedComponents && (
                        <div className="mt-2.5 pt-2 border-t border-white/5 space-y-1.5 max-h-48 overflow-y-auto pr-1">
                          {activeCourse.components.map(comp => {
                            const isAtt = comp.category === 'Attendance' || comp.name.toLowerCase().includes('attendance');
                            return (
                              <div
                                key={comp.id}
                                className="p-2 rounded-lg bg-obsidian-900 border border-white/5 flex items-center justify-between text-xs"
                              >
                                <div>
                                  <span className="text-slate-200 font-medium block">{comp.name}</span>
                                  <span className="text-[10px] font-mono text-slate-500">
                                    Raw Max: {comp.rawMax} • Weight: {comp.weightage}
                                  </span>
                                </div>

                                {isAtt ? (
                                  <button
                                    type="button"
                                    onClick={() => {
                                      onUpdateDirectInternal(activeCourse.id, undefined);
                                      const isFull = comp.rawObtained >= comp.rawMax;
                                      onUpdateComponentMarks(activeCourse.id, comp.id, isFull ? 0 : comp.rawMax);
                                    }}
                                    className={`px-2.5 py-1 rounded text-xs font-mono font-bold border transition-all ${
                                      comp.rawObtained >= comp.rawMax
                                        ? 'bg-emerald-950 text-emerald-300 border-emerald-500/50'
                                        : 'bg-obsidian-800 text-slate-400 border-white/10'
                                    }`}
                                  >
                                    {comp.rawObtained >= comp.rawMax ? `✓ Full ${comp.rawMax}/${comp.rawMax}` : `Click for ${comp.rawMax} Marks`}
                                  </button>
                                ) : (
                                  <div className="flex items-center gap-1.5">
                                    <input
                                      type="number"
                                      min="0"
                                      max={comp.rawMax}
                                      step="0.5"
                                      value={comp.rawObtained === 0 ? '' : comp.rawObtained}
                                      onChange={(e) => {
                                        onUpdateDirectInternal(activeCourse.id, undefined);
                                        const raw = e.target.value;
                                        onUpdateComponentMarks(activeCourse.id, comp.id, raw === '' ? 0 : (parseFloat(raw) || 0));
                                      }}
                                      placeholder="0"
                                      className="w-16 px-2 py-1 rounded text-center num-input text-xs font-bold text-slate-100"
                                    />
                                    <span className="text-[10px] font-mono text-slate-400">/ {comp.rawMax}</span>
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

                {/* -------------------------------------------------------- */}
                {/* 3. GROUP B (PE-5) DIRECT GRADE SELECTOR                  */}
                {/* -------------------------------------------------------- */}
                {activeCourse.type === 'DirectGrade' && (
                  <div className="p-4 rounded-xl bg-obsidian-850/70 border border-white/10 space-y-3">
                    <span className="text-xs font-bold text-slate-200 block">
                      Choose Your Expected Letter Grade for {activeCourse.code}:
                    </span>
                    <div className="grid grid-cols-4 gap-2">
                      {gradePills.map(g => {
                        const isSelected = (activeCourse.directGrade || 'A') === g;
                        const gTheme = GRADE_COLORS[g];
                        return (
                          <button
                            key={g}
                            type="button"
                            onClick={() => onUpdateDirectGrade(activeCourse.id, g)}
                            className={`py-3 rounded-xl text-sm font-mono font-bold border transition-all ${
                              isSelected
                                ? `${gTheme.bg} ${gTheme.border} ${gTheme.text} ${gTheme.glow} ring-2 ring-cyan-400/40 scale-105`
                                : 'bg-obsidian-900 text-slate-400 border-white/5 hover:border-white/20'
                            }`}
                          >
                            <div>{g}</div>
                            <div className="text-[10px] font-normal opacity-70">[{GRADE_POINTS[g]} GP]</div>
                          </button>
                        );
                      })}
                    </div>
                  </div>
                )}

                {/* -------------------------------------------------------- */}
                {/* 4. EXTERNAL EXAM TARGET SLIDER                           */}
                {/* -------------------------------------------------------- */}
                {activeCourse.type !== 'DirectGrade' && (
                  <div className="p-4 rounded-xl bg-obsidian-850/70 border border-white/10 space-y-3">
                    <div className="flex items-center justify-between text-xs">
                      <span className="font-bold text-slate-200 flex items-center gap-1.5">
                        <SlidersHorizontal className="w-3.5 h-3.5 text-cyan-400" />
                        Step 2: Expected External Marks ({activeCourse.externalName})
                      </span>
                      <div className="flex items-center gap-1.5 font-mono">
                        <input
                          type="number"
                          min="0"
                          max={activeCourse.externalRawMax}
                          step="0.5"
                          value={activeCourse.externalTargetScore === 0 ? '' : activeCourse.externalTargetScore}
                          onChange={(e) => {
                            const raw = e.target.value;
                            onUpdateExternal(activeCourse.id, raw === '' ? 0 : (parseFloat(raw) || 0));
                          }}
                          placeholder="0"
                          className="w-16 px-2 py-1 rounded text-center num-input text-xs font-bold text-cyan-400"
                        />
                        <span className="text-slate-400 text-xs">/ {activeCourse.externalRawMax}</span>
                      </div>
                    </div>

                    {/* Range slider */}
                    <input
                      type="range"
                      min="0"
                      max={activeCourse.externalRawMax}
                      step="0.5"
                      value={activeCourse.externalTargetScore}
                      onChange={(e) => onUpdateExternal(activeCourse.id, parseFloat(e.target.value) || 0)}
                      className="w-full h-2.5 bg-obsidian-900 rounded-lg slider-tactile appearance-none border border-white/10"
                      style={{ touchAction: 'pan-y' }}
                    />

                    {/* Dynamic requirement hint */}
                    <div className="text-[11px] font-mono text-slate-400 flex items-center justify-between">
                      {isActiveCourseUnentered ? (
                        <span className="text-slate-400">
                          Slide to simulate external marks • Live targets update as you enter scores
                        </span>
                      ) : activeResult.targetRequirements.find(t => !t.alreadyAchieved && t.possible) ? (
                        <span className="text-cyan-300">
                          Target <strong>{activeResult.targetRequirements.find(t => !t.alreadyAchieved && t.possible)?.requiredExternalRaw}</strong> for Grade {activeResult.targetRequirements.find(t => !t.alreadyAchieved && t.possible)?.grade} (~{activeResult.gradeCutoffs[activeResult.targetRequirements.find(t => !t.alreadyAchieved && t.possible)!.grade]}+ safe band)
                        </span>
                      ) : (
                        <span className="text-emerald-400 font-semibold">
                          ✓ High-Percentile Safe Zone (A+ ~95+)
                        </span>
                      )}
                      <span className="text-slate-500 text-[10px]">CU Cohort Curve</span>
                    </div>
                  </div>
                )}

              </div>

              {/* CARD FOOTER CONTROLS */}
              <div className="flex items-center justify-between gap-3 pt-3 border-t border-white/10">
                <button
                  type="button"
                  onClick={handleBack}
                  className="px-4 py-2 rounded-xl bg-obsidian-850 hover:bg-obsidian-800 text-slate-300 text-xs font-semibold border border-white/10 transition-colors flex items-center gap-1.5"
                >
                  <ChevronLeft className="w-4 h-4" />
                  <span>Back</span>
                </button>

                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={handleSkipToDashboard}
                    className="px-3 py-2 rounded-xl text-xs font-mono text-slate-400 hover:text-slate-200 transition-colors hidden xs:inline-block"
                    title="Exit wizard and jump straight to the mission control dashboard"
                  >
                    Skip to Dashboard
                  </button>
                  <button
                    type="button"
                    onClick={handleNext}
                    className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-cyan-500 to-indigo-600 hover:from-cyan-400 hover:to-indigo-500 text-white text-xs font-bold shadow-[0_0_15px_rgba(6,182,212,0.3)] transition-all flex items-center gap-1.5"
                  >
                    <span>{currentStep === totalCourseSteps ? 'Finish & View Flight Plan' : 'Next Subject'}</span>
                    <ChevronRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </motion.div>
          )}

          {/* ============================================================ */}
          {/* CELEBRATION & SEMESTER V FLIGHT PLAN                         */}
          {/* ============================================================ */}
          {currentStep === celebrationStep && (
            <motion.div
              key="celebration-summary"
              custom={direction}
              variants={slideVariants}
              initial="enter"
              animate="center"
              exit="exit"
              className="glass-card rounded-2xl p-5 sm:p-7 border border-white/15 shadow-2xl text-center relative overflow-hidden"
            >
              <div className="absolute top-0 center w-96 h-96 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none -translate-y-1/2" />

              <div className="space-y-2 mb-6">
                <div className="inline-flex p-3 rounded-2xl bg-gradient-to-br from-emerald-500/20 via-cyan-500/20 to-indigo-500/20 border border-emerald-500/30 text-emerald-400 shadow-[0_0_25px_rgba(16,185,129,0.3)]">
                  <Award className="w-8 h-8" />
                </div>
                <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
                  Your Semester V Flight Plan is Ready!
                </h2>
                <p className="text-xs sm:text-sm text-slate-400 max-w-md mx-auto">
                  All {totalCourseSteps} subjects for {currentTrack.name} are calibrated with your marks and targets.
                </p>
              </div>

              {/* Giant SGPA Hero Card */}
              <div className="p-6 rounded-2xl bg-gradient-to-br from-obsidian-900 via-obsidian-850 to-cyan-950/40 border border-cyan-500/30 shadow-[0_0_30px_rgba(6,182,212,0.2)] mb-6">
                <span className="text-xs font-mono uppercase tracking-widest text-slate-400 block mb-1">
                  Projected 5th Semester SGPA
                </span>
                <div className="text-6xl sm:text-7xl font-extrabold font-mono text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-emerald-400 to-indigo-300">
                  {liveSgpa > 0 ? liveSgpa.toFixed(2) : '0.00'}
                </div>
                <div className="mt-3 flex items-center justify-center gap-2">
                  <span className={`px-3 py-1 rounded-full text-xs font-mono font-bold border ${
                    liveSgpa >= 9.0 
                      ? 'bg-emerald-950 text-emerald-300 border-emerald-500/40' 
                      : liveSgpa >= 8.0 
                      ? 'bg-cyan-950 text-cyan-300 border-cyan-500/40' 
                      : 'bg-indigo-950 text-indigo-300 border-indigo-500/40'
                  }`}>
                    {liveSgpa >= 9.0 ? '🌟 University Merit Class (9.0+)' : liveSgpa >= 8.0 ? 'Distinction Class (8.0+)' : 'First Division Standing'}
                  </span>
                  <span className="text-xs font-mono text-slate-400">
                    • {totalGradedCredits.toFixed(1)} Graded Credits
                  </span>
                </div>
              </div>

              {/* Quick Course Grade Grid Summary */}
              <div className="grid grid-cols-2 xs:grid-cols-3 sm:grid-cols-5 gap-2 text-left mb-6">
                {orderedCourses.map(c => {
                  const r = results[c.id];
                  if (!r) return null;
                  return (
                    <div key={c.id} className="p-2 rounded-lg bg-obsidian-900 border border-white/5 flex flex-col justify-between">
                      <span className="text-[10px] font-mono text-slate-400 truncate">{c.code}</span>
                      <div className="text-xs font-bold text-white mt-1">
                        {c.isExcluded ? (
                          <span className="text-rose-400">Excl</span>
                        ) : (c.type === 'DirectGrade' ? !c.directGrade : r.totalWeightedScore === 0) ? (
                          <span className="text-slate-400 font-mono text-[11px]">Pending</span>
                        ) : c.isNonGraded ? (
                          <span className={r.isQualified ? 'text-emerald-400' : 'text-rose-400'}>
                            {r.isQualified ? 'PASS' : 'FAIL'}
                          </span>
                        ) : (
                          <span className="text-cyan-300 font-mono">
                            {r.predictedGrade} ({r.gradePoint})
                          </span>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Final Actions */}
              <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
                <button
                  type="button"
                  onClick={handleEnterMissionControl}
                  className="w-full sm:w-auto px-8 py-3 rounded-xl bg-gradient-to-r from-cyan-500 via-indigo-600 to-violet-600 hover:from-cyan-400 hover:to-indigo-500 text-white text-sm font-extrabold shadow-[0_0_25px_rgba(6,182,212,0.4)] flex items-center justify-center gap-2 transition-all active:scale-95 touch-manipulation cursor-pointer"
                >
                  <Sparkles className="w-4 h-4 text-cyan-200" />
                  <span>Enter Mission Control Dashboard 🚀</span>
                </button>
                <button
                  type="button"
                  onClick={() => handleJumpToStep(1)}
                  className="w-full sm:w-auto px-4 py-3 rounded-xl bg-obsidian-850 hover:bg-obsidian-800 text-slate-300 hover:text-white text-xs font-semibold border border-white/10 transition-colors"
                >
                  Review / Edit Subjects
                </button>
              </div>

            </motion.div>
          )}

        </AnimatePresence>
      </div>

      {/* ============================================================== */}
      {/* 3. BOTTOM HELPER HINT                                          */}
      {/* ============================================================== */}
      <div className="w-full max-w-2xl mx-auto flex items-center justify-between text-[11px] font-mono text-slate-500 px-2 py-1">
        <span className="hidden sm:inline">Use ← and → arrow keys to navigate cards</span>
        <span>Chandigarh University • CSE Batch Academic Simulator</span>
      </div>

    </div>
  );
};
