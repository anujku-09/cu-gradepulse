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
  HelpCircle,
  Target,
  ChevronDown,
  CheckCircle2,
  Heart
} from 'lucide-react';
import { Course, CourseResult, GradeLevel, CurveMode, GradeCutoffs, CohortTrackId, CourseType } from '../types';
import { GRADE_COLORS, GRADE_POINTS } from '../utils/gradeCalculations';
import { COHORT_TRACKS_INFO } from '../data/courses';
import { CourseRegexPasteBox } from './CourseRegexPasteBox';
import { MicroTooltip } from './MicroTooltip';

interface SemesterSetupWizardProps {
  isOpen: boolean;
  onClose: () => void;
  courses: Course[];
  results: Record<string, CourseResult>;
  liveSgpa: number;
  totalGradedCredits: number;
  curveMode: CurveMode;
  currentTrackId: CohortTrackId;
  onSelectTrack: (trackId: CohortTrackId) => void;
  onOpenTrackModal: () => void;
  onCurveChange: (mode: CurveMode) => void;
  onOpenCutoffModal: () => void;
  onUpdateExternal: (courseId: string, score: number) => void;
  onUpdateDirectGrade: (courseId: string, grade: GradeLevel) => void;
  onUpdateDirectInternal: (courseId: string, score: number | undefined) => void;
  onUpdateComponentMarks: (courseId: string, componentId: string, score: number) => void;
  onToggleCourseExcluded: (courseId: string) => void;
  onQuickPreset: (courseId: string, preset: 'full' | 'average' | 'reset') => void;
  onToggleAttendance: (courseId: string, full: boolean) => void;
  onClaimAllAttendance: () => void;
  onOpenEditCourse?: (course: Course) => void;
  onConvertCourseMode?: (courseId: string, targetType: CourseType) => void;
  globalCutoffs?: GradeCutoffs;
  onSaveCustomCutoffs?: (courseId: string, cutoffs: GradeCutoffs | undefined) => void;
  onOpenFeedback?: () => void;
  onComplete: () => void;
}

export const SemesterSetupWizard: React.FC<SemesterSetupWizardProps> = ({
  isOpen,
  onClose,
  courses,
  results,
  liveSgpa,
  totalGradedCredits,
  curveMode,
  currentTrackId,
  onSelectTrack,
  onOpenTrackModal,
  onCurveChange,
  onOpenCutoffModal,
  onUpdateExternal,
  onUpdateDirectGrade,
  onUpdateDirectInternal,
  onUpdateComponentMarks,
  onToggleCourseExcluded,
  onQuickPreset,
  onToggleAttendance,
  onClaimAllAttendance,
  onOpenEditCourse,
  onConvertCourseMode,
  globalCutoffs,
  onSaveCustomCutoffs,
  onOpenFeedback,
  onComplete,
}) => {
  // Step 0: Cohort Section Setup
  // Step 1..totalCourseSteps: The Semester V Courses
  // Step totalCourseSteps + 1: Celebration / Summary Deck
  const [currentStep, setCurrentStep] = useState(0);
  const [direction, setDirection] = useState(1); // 1 = forward, -1 = back
  const [showDetailedComponents, setShowDetailedComponents] = useState(false);
  const [showRegexBox, setShowRegexBox] = useState(false);
  const [allAttendanceClaimed, setAllAttendanceClaimed] = useState(false);
  const [showCutoffInspector, setShowCutoffInspector] = useState(false);
  const [showSingleSubjectModal, setShowSingleSubjectModal] = useState(false);
  const [snapFeedback, setSnapFeedback] = useState<string | null>(null);

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
      '24CST-360', // IoT Network Architecture (3.0 Cr)
      'PE-2',      // Professional Elective-II (3.0 Cr)
      'PE-3',      // Professional Elective-III (3.0 Cr)
      'PE-5',      // Legacy Professional Elective (3.0 Cr)
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
      setShowCutoffInspector(false);
      setShowSingleSubjectModal(false);
      setSnapFeedback(null);
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
      setShowCutoffInspector(false);
      setShowSingleSubjectModal(false);
      setSnapFeedback(null);
    }
  };

  const handleJumpToStep = (stepIdx: number) => {
    setDirection(stepIdx > currentStep ? 1 : -1);
    setCurrentStep(stepIdx);
    setShowDetailedComponents(false);
    setShowRegexBox(false);
    setShowCutoffInspector(false);
    setShowSingleSubjectModal(false);
    setSnapFeedback(null);
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
    <div className="fixed top-14 sm:top-16 inset-x-0 bottom-0 z-40 overflow-y-auto bg-obsidian-950/95 backdrop-blur-xl flex flex-col p-2 sm:p-5 animate-fadeIn select-none">
      
      {/* ============================================================== */}
      {/* 1. TOP HEADER & LIVE PROGRESS HUB                             */}
      {/* ============================================================== */}
      <div className="w-full max-w-4xl mx-auto flex flex-col gap-1.5 sm:gap-2 flex-shrink-0">
        
        {/* Mobile Header (< 640px): Ergonomic, Non-Crowded, Zero Overflow */}
        <div className="sm:hidden flex flex-col gap-1.5 w-full bg-obsidian-900/95 px-3 py-2 rounded-2xl border border-white/10 shadow-lg">
          <div className="flex items-center justify-between gap-2">
            {/* Left: Sparkles + Jump Selector */}
            <div className="flex items-center gap-1.5 min-w-0 flex-1">
              <div className="w-6 h-6 rounded-lg bg-gradient-to-br from-cyan-500/20 via-indigo-500/20 to-violet-500/20 border border-cyan-500/30 flex items-center justify-center shadow-[0_0_10px_rgba(6,182,212,0.3)] flex-shrink-0">
                <Sparkles className="w-3 h-3 text-cyan-400" />
              </div>
              <select
                value={currentStep}
                onChange={(e) => handleJumpToStep(parseInt(e.target.value))}
                className="bg-obsidian-850 text-xs font-bold text-white rounded-lg px-2 py-1 border border-white/10 focus:border-cyan-400 focus:outline-none cursor-pointer min-w-0 flex-1 max-w-[210px] min-[390px]:max-w-[250px] truncate"
                title="Jump directly to any subject"
              >
                <option value={0}>⚙️ Step 0: Track Setup</option>
                {orderedCourses.map((c, idx) => {
                  const stepNum = idx + 1;
                  const res = results[c.id];
                  const gradeBadge = res?.predictedGrade ? `[${res.predictedGrade}]` : '';
                  return (
                    <option key={c.id} value={stepNum}>
                      {stepNum}. {c.code} {gradeBadge}
                    </option>
                  );
                })}
                <option value={celebrationStep}>🎉 Done: Flight Plan</option>
              </select>
            </div>

            {/* Right: Live SGPA + Exit */}
            <div className="flex items-center gap-1.5 flex-shrink-0">
              <div className="flex items-center gap-0.5 px-2 py-0.5 rounded-lg bg-obsidian-850 border border-white/10">
                <span className="text-[9px] font-mono text-slate-400">SGPA:</span>
                <span className={`text-xs font-extrabold font-mono ${
                  liveSgpa >= 9.0 ? 'text-emerald-400' : liveSgpa >= 8.0 ? 'text-cyan-300' : liveSgpa >= 7.0 ? 'text-indigo-300' : liveSgpa > 0 ? 'text-amber-400' : 'text-slate-400'
                }`}>
                  {liveSgpa > 0 ? liveSgpa.toFixed(2) : '--'}
                </span>
              </div>

              <button
                type="button"
                onClick={handleSkipToDashboard}
                className="p-1.5 rounded-lg text-slate-400 hover:text-white bg-obsidian-800 border border-white/10 active:scale-95"
                title="Exit cards to dashboard"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          {/* Animated Progress Bar */}
          <div className="w-full bg-obsidian-950 h-1.5 rounded-full overflow-hidden border border-white/5 relative">
            <motion.div
              className="h-full bg-gradient-to-r from-cyan-500 via-indigo-500 to-violet-500"
              initial={{ width: 0 }}
              animate={{ width: `${(currentStep / celebrationStep) * 100}%` }}
              transition={{ ease: 'easeInOut', duration: 0.3 }}
            />
          </div>

          {/* Step Helper Status */}
          <div className="flex items-center justify-between text-[11px] font-mono text-slate-400 px-0.5">
            <span className="text-cyan-300 font-bold">
              {currentStep === 0 ? 'Step 0: Track Setup' : currentStep === celebrationStep ? 'Flight Plan' : `Subject ${currentStep} of ${totalCourseSteps}`}
            </span>
            <span className="text-slate-400 truncate max-w-[160px] text-right">
              {currentStep === 0 ? currentTrack.name : currentStep === celebrationStep ? 'Ready' : activeCourse?.name}
            </span>
          </div>
        </div>

        {/* Desktop Header Bar (Single Row: h-12 / 48px - hidden sm:flex) */}
        <div className="hidden sm:flex items-center justify-between gap-1.5 sm:gap-2.5 h-12 bg-obsidian-900/90 px-2.5 sm:px-4 rounded-2xl border border-white/10 shadow-lg">
          
          {/* Left: Brand + Subject Jump Selector */}
          <div className="flex items-center gap-1.5 sm:gap-2.5 min-w-0">
            <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-xl bg-gradient-to-br from-cyan-500/20 via-indigo-500/20 to-violet-500/20 border border-cyan-500/30 flex items-center justify-center shadow-[0_0_15px_rgba(6,182,212,0.3)] flex-shrink-0">
              <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
            </div>

            {/* Jump To Dropdown (Instant Subject Switcher) */}
            <div className="flex items-center gap-1 min-w-0">
              <select
                value={currentStep}
                onChange={(e) => handleJumpToStep(parseInt(e.target.value))}
                className="bg-obsidian-850 text-xs sm:text-sm font-bold text-white rounded-lg px-2 py-1 border border-white/10 focus:border-cyan-400 focus:outline-none cursor-pointer max-w-[140px] xs:max-w-[200px] sm:max-w-[280px] truncate"
                title="Jump directly to any subject"
              >
                <option value={0}>⚙️ Step 0: Cohort Track</option>
                {orderedCourses.map((c, idx) => {
                  const stepNum = idx + 1;
                  const res = results[c.id];
                  const gradeBadge = res?.predictedGrade ? `[Grade ${res.predictedGrade}]` : '';
                  return (
                    <option key={c.id} value={stepNum}>
                      {stepNum}. {c.code} - {c.name.slice(0, 16)} {gradeBadge}
                    </option>
                  );
                })}
                <option value={celebrationStep}>🎉 Done: Flight Plan</option>
              </select>
            </div>
          </div>

          {/* Right: Cutoff + SGPA + Exit */}
          <div className="flex items-center gap-1.5 sm:gap-2 flex-shrink-0">
            {/* Cutoff Curve Selector */}
            <div className="flex items-center gap-0.5 sm:gap-1 px-1.5 py-1 rounded-xl bg-obsidian-850 border border-white/10 text-[10px] sm:text-xs">
              <select
                value={curveMode}
                onChange={(e) => onCurveChange(e.target.value as CurveMode)}
                className="bg-transparent text-[10px] sm:text-xs text-cyan-300 font-mono focus:outline-none cursor-pointer"
                title="Cohort Cutoff Curve"
              >
                <option value="standard" className="bg-obsidian-900 text-slate-200">95+ Std</option>
                <option value="strict" className="bg-obsidian-900 text-slate-200">96+ Strict</option>
                <option value="lenient" className="bg-obsidian-900 text-slate-200">91+ Len</option>
                {curveMode === 'custom' && <option value="custom" className="bg-obsidian-900 text-slate-200">Custom</option>}
              </select>
              <button
                type="button"
                onClick={onOpenCutoffModal}
                title="Inspect & Customize Cutoff Matrix"
                className="p-0.5 rounded text-slate-400 hover:text-white"
              >
                <Sliders className="w-3 h-3 text-cyan-400" />
              </button>
            </div>

            {/* Live Predicted SGPA badge */}
            <div className="flex items-center gap-1 px-2 py-1 rounded-xl bg-obsidian-850 border border-white/10 shadow-inner">
              <span className="text-[9px] font-mono text-slate-400 uppercase tracking-wider hidden sm:inline">SGPA:</span>
              <span className={`text-xs sm:text-sm font-extrabold font-mono ${
                liveSgpa >= 9.0 ? 'text-emerald-400' : liveSgpa >= 8.0 ? 'text-cyan-300' : liveSgpa >= 7.0 ? 'text-indigo-300' : liveSgpa > 0 ? 'text-amber-400' : 'text-slate-400'
              }`}>
                {liveSgpa > 0 ? liveSgpa.toFixed(2) : '--.--'}
              </span>
            </div>

            {/* Exit to Dashboard */}
            <button
              type="button"
              onClick={handleSkipToDashboard}
              className="px-2 sm:px-2.5 py-1 rounded-xl text-xs font-semibold text-slate-300 hover:text-white bg-obsidian-800 hover:bg-white/10 border border-white/10 transition-colors flex items-center gap-1 shadow-sm whitespace-nowrap active:scale-95 touch-manipulation"
              title="Exit setup wizard and open full mission control dashboard"
            >
              <span className="hidden sm:inline">Dashboard</span>
              <X className="w-3.5 h-3.5 text-slate-400" />
            </button>
          </div>
        </div>

        {/* Animated Progress Bar (Desktop) */}
        <div className="hidden sm:block w-full bg-obsidian-900 h-1.5 rounded-full overflow-hidden border border-white/5 relative">
          <motion.div
            className="h-full bg-gradient-to-r from-cyan-500 via-indigo-500 to-violet-500"
            initial={{ width: 0 }}
            animate={{ width: `${(currentStep / celebrationStep) * 100}%` }}
            transition={{ ease: 'easeInOut', duration: 0.3 }}
          />
        </div>

        {/* Step Navigation Dots (Desktop Only - hidden sm:flex) */}
        <div className="hidden sm:flex items-center gap-1 overflow-x-auto no-scrollbar py-0.5">
          {Array.from({ length: celebrationStep + 1 }, (_, i) => {
            const isCompleted = i < currentStep;
            const isCurrent = i === currentStep;
            const course = i >= 1 && i <= totalCourseSteps ? orderedCourses[i - 1] : null;
            const res = course ? results[course.id] : null;
            const label = i === 0 
              ? 'Track' 
              : i === celebrationStep 
              ? 'Done' 
              : course?.code.startsWith('PE-')
              ? course.code
              : (course?.code.split('-')[1] || course?.code.slice(0, 6));

            return (
              <button
                key={i}
                onClick={() => handleJumpToStep(i)}
                className={`flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-mono transition-all flex-shrink-0 border ${
                  isCurrent
                    ? 'bg-cyan-500/20 text-cyan-300 border-cyan-400/60 font-bold shadow-[0_0_10px_rgba(6,182,212,0.3)] ring-1 ring-cyan-400/30'
                    : isCompleted
                    ? 'bg-obsidian-900 text-slate-300 border-white/10 hover:text-white'
                    : 'bg-obsidian-900/60 text-slate-500 border-white/5 hover:text-slate-400'
                }`}
              >
                <span>{label}</span>
                {res?.predictedGrade && !res.isBacklog && (
                  <span className="text-[9px] font-bold text-cyan-400">
                    {res.predictedGrade}
                  </span>
                )}
                {isCompleted && <Check className="w-2.5 h-2.5 text-emerald-400" />}
              </button>
            );
          })}
        </div>
      </div>

      {/* ============================================================== */}
      {/* 2. THE ANIMATED CARD STACK (AnimatePresence)                  */}
      {/* ============================================================== */}
      <div className="w-full max-w-2xl mx-auto flex-1 flex flex-col justify-center py-1 sm:py-3">
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
              className="glass-card rounded-2xl p-3 sm:p-7 border border-white/15 shadow-2xl relative overflow-hidden"
            >
              <div className="absolute top-0 right-0 w-64 h-64 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none" />
              
              <div className="text-center space-y-1.5 mb-5 sm:mb-6">
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-mono font-semibold bg-cyan-950/80 text-cyan-300 border border-cyan-800/60">
                  <GraduationCap className="w-3.5 h-3.5" />
                  CSE Semester V Setup
                </span>
                <h2 className="text-lg sm:text-2xl font-extrabold text-white tracking-tight">
                  Configure Your 5th Sem Setup
                </h2>
                <p className="text-xs sm:text-sm text-slate-400 max-w-lg mx-auto">
                  Select your elective cohort track to auto-populate your subjects and evaluation schemes.
                </p>
              </div>

              {/* CHOOSE YOUR COHORT / SPECIALIZATION SECTION */}
              <div className="space-y-2.5 mb-6 text-left">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-slate-200 flex items-center gap-1.5">
                    <span>Select Your Elective Cohort Track:</span>
                    <MicroTooltip content="Elective Cohort Track: Select your section's specialization (e.g. Set F Core, Set B Apple, Set D AI/ML, Set C IoT, Set E Industry). Your core marks are preserved when switching." />
                  </span>
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-cyan-950 text-cyan-300 border border-cyan-800/60 font-semibold">
                    Elective Sets
                  </span>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 sm:gap-2.5">
                  {COHORT_TRACKS_INFO.map(track => {
                    const isSelected = track.id === currentTrackId;
                    return (
                      <button
                        key={track.id}
                        type="button"
                        onClick={() => onSelectTrack(track.id)}
                        className={`p-2.5 sm:p-3 rounded-xl border text-left transition-all flex items-center gap-2.5 active:scale-95 touch-manipulation ${
                          isSelected
                            ? 'bg-gradient-to-r from-cyan-950/80 to-indigo-950/80 border-cyan-500 text-white shadow-[0_0_15px_rgba(6,182,212,0.25)] ring-1 ring-cyan-500/50'
                            : 'bg-obsidian-900/80 hover:bg-obsidian-850 border-white/10 text-slate-300'
                        }`}
                      >
                        <span className="text-lg sm:text-xl flex-shrink-0">{track.icon}</span>
                        <div className="min-w-0 flex-1">
                          <span className={`text-[11px] sm:text-xs font-bold block leading-tight truncate ${isSelected ? 'text-cyan-300' : 'text-slate-200'}`}>
                            {track.name}
                          </span>
                          <span className="text-[9px] sm:text-[10px] text-slate-400 block truncate font-mono mt-0.5">
                            {track.badge}
                          </span>
                        </div>
                      </button>
                    );
                  })}
                </div>

                <div className="p-2.5 sm:p-3 rounded-xl bg-obsidian-850/80 border border-white/10 text-[11px] text-slate-300 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                                
                  {/* Electives Content */}
                  <div className="flex items-start gap-1.5 min-w-0 flex-1">
                    <span className="text-cyan-400 font-mono font-semibold flex-shrink-0">
                      Electives:
                    </span>
                                
                    <span className="text-slate-200 font-medium min-w-0 flex-1 whitespace-normal break-words leading-relaxed">
                      {currentTrack.electiveHighlight}
                    </span>
                  </div>
                                
                  {/* Core Marks Status */}
                  <span className="text-[10px] text-emerald-400 font-medium flex-shrink-0 whitespace-nowrap">
                    ✓ Core Marks Preserved
                  </span>
                                
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
              className="glass-card rounded-2xl p-3 sm:p-6 border border-white/15 shadow-2xl relative overflow-hidden"
            >
              {/* Mobile Subject Identity Header (< 640px) */}
              <div className="sm:hidden space-y-2 pb-2.5 border-b border-white/10">
                {/* Row 1: Badges Left, Grade Right */}
                <div className="flex items-center justify-between gap-2">
                  <div className="flex items-center gap-1.5 flex-wrap min-w-0">
                    <span className="font-mono text-xs font-bold px-2 py-0.5 rounded bg-white/[0.08] text-white border border-white/10">
                      {activeCourse.code}
                    </span>
                    <span className="text-xs font-mono font-bold text-cyan-300">
                      {activeCourse.credits.toFixed(1)} Cr
                    </span>
                    <span className={`text-[9px] font-mono font-bold uppercase px-1.5 py-0.5 rounded border ${
                      activeCourse.type === 'Hybrid'
                        ? 'bg-purple-950/60 text-purple-300 border-purple-500/30'
                        : activeCourse.type === 'ContinuousEvaluation'
                        ? 'bg-emerald-950/60 text-emerald-300 border-emerald-500/30'
                        : activeCourse.type === 'Practical'
                        ? 'bg-amber-950/60 text-amber-300 border-amber-500/30'
                        : activeCourse.type === 'DirectGrade'
                        ? 'bg-indigo-950/60 text-indigo-300 border-indigo-500/30'
                        : 'bg-cyan-950/60 text-cyan-300 border-cyan-500/30'
                    }`}>
                      {activeCourse.type === 'ContinuousEvaluation' ? '100% INT' : activeCourse.type === 'DirectGrade' ? 'DIRECT' : activeCourse.type.toUpperCase()}
                    </span>
                    {activeCourse.credits >= 3.0 && (
                      <span className="text-[9px] font-semibold text-amber-300 bg-amber-950/60 px-1.5 py-0.5 rounded border border-amber-800/40">
                        ⚡ Core
                      </span>
                    )}
                  </div>

                  {/* Live Grade Badge */}
                  <div className="flex-shrink-0">
                    {activeCourse.isExcluded ? (
                      <span className="px-2.5 py-0.5 rounded-full text-[11px] font-mono font-bold bg-rose-950/70 text-rose-300 border border-rose-500/30">
                        Excluded
                      </span>
                    ) : isActiveCourseUnentered ? (
                      <span className="px-2.5 py-0.5 rounded-full text-[11px] font-mono font-medium border border-white/10 bg-obsidian-850 text-slate-400">
                        Awaiting
                      </span>
                    ) : (
                      <span className={`px-2.5 py-0.5 rounded-full text-xs font-extrabold font-mono border ${
                        GRADE_COLORS[activeResult.predictedGrade]?.bg || 'bg-obsidian-850'
                      } ${GRADE_COLORS[activeResult.predictedGrade]?.text || 'text-cyan-300'} ${
                        GRADE_COLORS[activeResult.predictedGrade]?.border || 'border-cyan-500/30'
                      }`}>
                        {activeResult.predictedGrade} ({activeResult.gradePoint} GP)
                      </span>
                    )}
                  </div>
                </div>

                {/* Row 2: Subject Title */}
                <h3 className="text-base font-bold text-white leading-snug">
                  {activeCourse.name}
                </h3>

                {/* Row 3: Action Strip (Config, Cycle, Exclude + Total Score) */}
                <div className="flex items-center justify-between gap-1.5 pt-1 border-t border-white/5">
                  <div className="flex items-center gap-1.5 flex-wrap">
                    {onOpenEditCourse && (
                      <div className="inline-flex items-center gap-0.5">
                        <button
                          type="button"
                          onClick={() => onOpenEditCourse(activeCourse)}
                          className="flex items-center gap-1 px-2.5 py-1 rounded-lg text-[10px] font-mono font-semibold text-cyan-300 bg-cyan-950/60 border border-cyan-500/40 active:scale-95 touch-manipulation"
                        >
                          <Sliders className="w-2.5 h-2.5 text-cyan-400" />
                          <span>Config</span>
                        </button>
                        <MicroTooltip content="Config Scheme: Customize course name, code, credits, evaluation scheme, or custom internal/external marks splits." />
                      </div>
                    )}
                    {onConvertCourseMode && (
                      <div className="inline-flex items-center gap-0.5">
                        <button
                          type="button"
                          onClick={() => {
                            const nextMode: CourseType = 
                              activeCourse.type === 'Theory' ? 'Practical' :
                              activeCourse.type === 'Practical' ? 'Hybrid' :
                              activeCourse.type === 'Hybrid' ? 'ContinuousEvaluation' :
                              activeCourse.type === 'ContinuousEvaluation' ? 'DirectGrade' : 'Theory';
                            onConvertCourseMode(activeCourse.id, nextMode);
                          }}
                          className="flex items-center gap-1 px-2.5 py-1 rounded-lg text-[10px] font-mono text-slate-300 bg-white/5 border border-white/10 active:scale-95 touch-manipulation"
                        >
                          <span>⇄ Mode</span>
                        </button>
                        <MicroTooltip content="Cycle Mode: Switch evaluation mode between Theory (40/60), Practical (60/40), Hybrid (70/30), 100% Internal, or Direct Grade." />
                      </div>
                    )}
                    <div className="inline-flex items-center gap-0.5">
                      <button
                        type="button"
                        onClick={() => onToggleCourseExcluded(activeCourse.id)}
                        className={`flex items-center gap-1 text-[10px] font-mono font-semibold px-2.5 py-1 rounded-lg border active:scale-95 touch-manipulation ${
                          activeCourse.isExcluded
                            ? 'bg-rose-950/60 text-rose-300 border-rose-500/40'
                            : 'bg-obsidian-800 text-slate-400 border-white/10'
                        }`}
                      >
                        {activeCourse.isExcluded ? <EyeOff className="w-2.5 h-2.5 text-rose-400" /> : <Eye className="w-2.5 h-2.5" />}
                        <span>{activeCourse.isExcluded ? 'Excluded' : 'Exclude'}</span>
                      </button>
                      <MicroTooltip content="Exclude Subject: Exclude this course from SGPA calculation (0 credits in SGPA) without clearing or losing entered marks." />
                    </div>
                  </div>

                  <span className="text-[11px] font-mono font-bold text-cyan-300 bg-obsidian-900 px-2 py-0.5 rounded-lg border border-white/5 flex-shrink-0">
                    {isActiveCourseUnentered ? '0.0/100' : `${activeResult.totalWeightedScore.toFixed(1)}/100`}
                  </span>
                </div>
              </div>

              {/* Desktop Subject Identity Header (>= 640px) */}
              <div className="hidden sm:flex items-start justify-between gap-3 pb-3 border-b border-white/10">
                <div>
                  <div className="flex items-center gap-2 flex-wrap mb-1">
                    <span className="font-mono text-xs font-bold px-2 py-0.5 rounded bg-white/[0.08] text-white border border-white/10">
                      {activeCourse.code}
                    </span>
                    <span className="text-xs font-mono font-bold text-cyan-300">
                      {activeCourse.credits.toFixed(1)} Credits
                    </span>
                    <span className={`text-[10px] font-mono font-bold uppercase px-2 py-0.5 rounded border ${
                      activeCourse.type === 'Hybrid'
                        ? 'bg-purple-950/60 text-purple-300 border-purple-500/30'
                        : activeCourse.type === 'ContinuousEvaluation'
                        ? 'bg-emerald-950/60 text-emerald-300 border-emerald-500/30'
                        : activeCourse.type === 'Practical'
                        ? 'bg-amber-950/60 text-amber-300 border-amber-500/30'
                        : activeCourse.type === 'DirectGrade'
                        ? 'bg-indigo-950/60 text-indigo-300 border-indigo-500/30'
                        : 'bg-cyan-950/60 text-cyan-300 border-cyan-500/30'
                    }`}>
                      {activeCourse.type === 'Hybrid' ? 'HYBRID 70/30' :
                       activeCourse.type === 'ContinuousEvaluation' ? '100% INTERNAL' :
                       activeCourse.type === 'Practical' ? 'PRACTICAL 60/40' :
                       activeCourse.type === 'DirectGrade' ? 'DIRECT GRADE' : 'THEORY 40/60'}
                    </span>
                    {activeCourse.credits >= 3.0 && (
                      <span className="text-[10px] font-semibold text-amber-300 bg-amber-950/60 px-2 py-0.5 rounded border border-amber-800/40">
                        ⚡ Core Impact
                      </span>
                    )}

                    {/* Configure Subject Button */}
                    {onOpenEditCourse && (
                      <div className="inline-flex items-center gap-0.5">
                        <button
                          type="button"
                          onClick={() => onOpenEditCourse(activeCourse)}
                          title="Configure subject evaluation scheme, name, code, credits, or custom weightage"
                          className="flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-mono font-semibold text-cyan-300 hover:text-white bg-cyan-950/50 hover:bg-cyan-900/60 border border-cyan-500/30 transition-colors shadow-sm"
                        >
                          <Sliders className="w-2.5 h-2.5 text-cyan-400" />
                          <span>Config Scheme</span>
                        </button>
                        <MicroTooltip content="Config Scheme: Customize course name, code, credits, evaluation scheme, or custom internal/external marks splits." />
                      </div>
                    )}

                    {/* 1-Click Evaluation Mode Swapper */}
                    {onConvertCourseMode && (
                      <div className="inline-flex items-center gap-0.5">
                        <button
                          type="button"
                          onClick={() => {
                            const nextMode: CourseType = 
                              activeCourse.type === 'Theory' ? 'Practical' :
                              activeCourse.type === 'Practical' ? 'Hybrid' :
                              activeCourse.type === 'Hybrid' ? 'ContinuousEvaluation' :
                              activeCourse.type === 'ContinuousEvaluation' ? 'DirectGrade' : 'Theory';
                            onConvertCourseMode(activeCourse.id, nextMode);
                          }}
                          title="Click to cycle evaluation mode (Theory ⇄ Practical ⇄ Hybrid ⇄ 100% Internal ⇄ Direct Grade)"
                          className="flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-mono text-slate-300 bg-white/5 border border-white/10 hover:border-cyan-500/40 hover:text-cyan-300 transition-colors"
                        >
                          <span>⇄ Cycle Mode</span>
                        </button>
                        <MicroTooltip content="Cycle Mode: Switch this course between Theory (40/60), Practical (60/40), Hybrid (70/30), 100% Internal, or Direct Grade." />
                      </div>
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

              {/* Course Exclude / Include Option (Desktop) */}
              <div className="hidden sm:flex items-center justify-between py-2 text-xs">
                <span className="text-slate-400">
                  {activeCourse.isExcluded 
                    ? '⚠️ This course is currently excluded from SGPA calculations.' 
                    : 'Included in your SGPA calculation.'}
                </span>
                <div className="inline-flex items-center gap-1">
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
                  <MicroTooltip content="Exclude Subject: Exclude this course from SGPA calculation (0 credits in SGPA) without clearing or losing entered marks." />
                </div>
              </div>

              {/* CARD BODY CONTENT */}
              <div className="space-y-4 my-3">

                {/* -------------------------------------------------------- */}
                {/* 1. ATTENDANCE QUICK-TOGGLE (NO TYPING NEEDED!)           */}
                {/* -------------------------------------------------------- */}
                {/* -------------------------------------------------------- */}
                {/* 2. INTERNAL MARKS ENTRY (For Non-DirectGrade)            */}
                {/* -------------------------------------------------------- */}
                {activeCourse.type !== 'DirectGrade' && (
                  <div className="p-4 rounded-xl bg-obsidian-850/70 border border-white/10 space-y-3">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                      <span className="text-xs font-bold text-slate-200 flex items-center gap-1.5">
                        <Edit3 className="w-3.5 h-3.5 text-cyan-400" />
                        <span>Step 1: Your Internal Marks</span>
                        <MicroTooltip content="Internal Marks: Continuous internal evaluation (MSTs, Quizzes, Assignments, Attendance, Labs) weighted per syllabus." />
                      </span>
                      
         {/* Attendance + Regex Paste Controls */}
<div className="flex items-center gap-1.5 flex-shrink-0">

  {/* Attendance Toggle */}
  {attendanceComp && (
    <button
      type="button"
      onClick={() => onToggleAttendance(activeCourse.id, !hasFullAttendance)}
      className={`flex items-center justify-center gap-1 px-2 py-1 rounded-lg text-[10px] sm:text-xs font-bold transition-all border active:scale-95 touch-manipulation whitespace-nowrap ${
        hasFullAttendance
          ? 'bg-emerald-950/80 text-emerald-300 border-emerald-500/50'
          : 'bg-obsidian-800 text-slate-400 border-white/15 hover:border-emerald-500/40'
      }`}
      title={`Attendance credit: ${attendanceComp.rawMax} marks for ≥75% attendance`}
    >
      {hasFullAttendance && (
        <Check className="w-3 h-3 text-emerald-400" />
      )}
      <span>≥75% Attend. (+{attendanceComp.rawMax})</span>
    </button>
  )}

  {/* Regex Paste */}
  <div className="inline-flex items-center gap-1">
    <button
      type="button"
      onClick={() => setShowRegexBox(!showRegexBox)}
      className={`text-[10px] font-mono px-2 py-1 rounded-lg border transition-all flex items-center gap-1 whitespace-nowrap ${
        showRegexBox
          ? 'bg-cyan-950 text-cyan-300 border-cyan-500/50 shadow-[0_0_10px_rgba(6,182,212,0.3)]'
          : 'bg-white/[0.04] text-cyan-400 border-white/10 hover:border-cyan-500/30'
      }`}
      title="Paste copied table text from CUIMS portal to auto-fill marks via regex"
    >
      <ClipboardPaste className="w-3 h-3 text-cyan-400" />
      <span>Regex Paste</span>
    </button>

    <MicroTooltip content="Regex Paste: Copy your raw internal marks table from the CUIMS portal and click paste. The smart parser automatically fills MSTs, Quizzes, and Assignments." />
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
          </div>

                    {/* Simple Big Direct Internal Box */}
                    <div className="flex items-center justify-between gap-2 p-2.5 sm:p-3 rounded-xl bg-obsidian-900 border border-white/5">
                      <div className="min-w-0 flex-1">
                        <div className="flex items-center gap-1">
                          <span className="text-xs font-bold text-slate-200 truncate">
                            Total Internal Score:
                          </span>
                          <MicroTooltip content="Direct Internal Score: Enter your consolidated internal score out of max weightage, or click below to enter individual assessment scores." />
                        </div>
                        <span className="text-[10px] sm:text-[11px] text-slate-400 font-mono block">
                          Weighted (Max {activeResult.maxInternalWeightage.toFixed(1)})
                        </span>
                      </div>

                      <div className="flex items-center gap-1.5 flex-shrink-0">
                        <input
                          type="number"
                          min="0"
                          max={activeResult.maxInternalWeightage}
                          step="0.5"
                          inputMode="decimal"
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
                          className="w-20 sm:w-24 px-2 sm:px-3 py-1.5 rounded-lg text-center num-input text-sm sm:text-base font-bold text-cyan-300 tracking-wide bg-obsidian-850 border border-white/10"
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
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-slate-200 flex items-center gap-1.5">
                        <span>Choose Your Expected Letter Grade for {activeCourse.code}:</span>
                        <MicroTooltip content="Direct Grade: For NPTEL MOOCs or pass/direct-evaluation courses, select your anticipated letter grade directly without entering raw numeric marks." />
                      </span>
                    </div>
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
                {/* 4. EXTERNAL EXAM TARGET SLIDER & DEEP GRADE UNLOCKER     */}
                {/* -------------------------------------------------------- */}
                {activeCourse.type !== 'DirectGrade' && (
                  activeCourse.type === 'ContinuousEvaluation' || activeCourse.externalRawMax === 0 ? (
                    <div className="p-4 rounded-xl bg-emerald-950/25 border border-emerald-500/25 text-xs space-y-1.5">
                      <div className="flex items-center gap-1.5 text-emerald-300 font-bold">
                        <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0" />
                        <span>100% Continuous Internal Evaluation</span>
                        <MicroTooltip content="Continuous Evaluation: This subject has no end-term written exam; 100% of your grade comes from internal project milestones, lab records, and viva." />
                      </div>
                      <p className="text-[11px] text-slate-300 leading-relaxed">
                        This subject has no end-term written external exam. Course grade is calculated 100% from internal milestone reviews, practical projects, viva, and continuous assessments.
                      </p>
                    </div>
                  ) : (
                    <div className="p-4 rounded-xl bg-obsidian-850/70 border border-white/10 space-y-3">
                    <div className="flex items-center justify-between text-xs gap-2">
                      <span className="font-bold text-slate-200 flex items-center gap-1.5 min-w-0">
                        <SlidersHorizontal className="w-3.5 h-3.5 text-cyan-400 flex-shrink-0" />
                        <span className="truncate">Step 2: External Target <span className="hidden xs:inline text-slate-400 font-normal">({activeCourse.externalName})</span></span>
                        <MicroTooltip content="External Target Slider: Drag to simulate your end-term exam score. Watch your predicted grade update in real-time according to CU cohort curve cutoffs." />
                      </span>
                      <div className="flex items-center gap-1 font-mono flex-shrink-0">
                        <input
                          type="number"
                          min="0"
                          max={activeCourse.externalRawMax}
                          step="0.5"
                          inputMode="decimal"
                          value={activeCourse.externalTargetScore === 0 ? '' : activeCourse.externalTargetScore}
                          onChange={(e) => {
                            const raw = e.target.value;
                            onUpdateExternal(activeCourse.id, raw === '' ? 0 : (parseFloat(raw) || 0));
                          }}
                          placeholder="0"
                          className="w-16 px-2 py-1 rounded text-center num-input text-xs font-bold text-cyan-400 bg-obsidian-900 border border-white/10"
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
                          Slide to simulate external marks • Tap any grade below to snap marks
                        </span>
                      ) : activeResult.targetRequirements.find(t => !t.alreadyAchieved && t.possible && t.grade !== 'D') ? (
                        <span className="text-cyan-300">
                          Target <strong>{activeResult.targetRequirements.find(t => !t.alreadyAchieved && t.possible && t.grade !== 'D')?.requiredExternalRaw}</strong> for Grade {activeResult.targetRequirements.find(t => !t.alreadyAchieved && t.possible && t.grade !== 'D')?.grade} (~{activeResult.gradeCutoffs[activeResult.targetRequirements.find(t => !t.alreadyAchieved && t.possible && t.grade !== 'D')!.grade]}+ safe band)
                        </span>
                      ) : (
                        <span className="text-emerald-400 font-semibold">
                          ✓ High-Percentile Safe Zone (A+ ~95+)
                        </span>
                      )}
                      <span className="text-slate-500 text-[10px]">CU Cohort Curve</span>
                    </div>

                    {/* Snap Feedback Toast */}
                    {snapFeedback && (
                      <div className="p-2 rounded-lg bg-cyan-950/80 border border-cyan-400/50 text-cyan-200 text-xs font-mono flex items-center gap-2 animate-fadeIn">
                        <Check className="w-3.5 h-3.5 text-cyan-400 flex-shrink-0" />
                        <span className="truncate">{snapFeedback}</span>
                      </div>
                    )}

                    {/* ======================================================== */}
                    {/* INLINE DEEP GRADE UNLOCKER & 1-CLICK TARGET SNAPPER      */}
                    {/* ======================================================== */}
                    <div className="pt-2 border-t border-white/10 space-y-2">
                      <div className="flex items-center justify-between text-xs">
                        <span className="font-bold text-slate-200 flex items-center gap-1.5">
                          <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
                          <span>Deep Grade Unlocker & Target Snapper</span>
                          <MicroTooltip content="Deep Grade Snapper: Shows the minimum external marks required to secure each letter grade under relative curve models. Tap any grade pill to snap the slider." />
                        </span>
                        <span className="text-[10px] font-mono text-cyan-400 hidden xs:inline">
                          Tap grade to snap slider
                        </span>
                      </div>

                      {/* Swipeable Snap Strip on Mobile, 7-Grid on Desktop */}
                      <div className="flex gap-2 overflow-x-auto no-scrollbar pb-1.5 pt-1 -mx-1 px-1 sm:grid sm:grid-cols-7 sm:gap-1.5 sm:overflow-visible sm:pb-0 sm:pt-0 sm:mx-0 sm:px-0">
                        {activeResult.targetRequirements.map((req) => {
                          const isCurrentGrade = activeResult.predictedGrade === req.grade;
                          const gTheme = GRADE_COLORS[req.grade] || GRADE_COLORS['C'];
                          const cutoff = activeResult.gradeCutoffs[req.grade];

                          return (
                            <button
                              key={req.grade}
                              type="button"
                              disabled={!req.possible && !req.alreadyAchieved}
                              onClick={() => {
                                if (req.alreadyAchieved) {
                                  onUpdateExternal(activeCourse.id, 0);
                                  setSnapFeedback(`Grade ${req.grade} already secured with internals! External set to 0.`);
                                } else if (req.possible) {
                                  onUpdateExternal(activeCourse.id, req.requiredExternalRaw);
                                  setSnapFeedback(`Snapped to Grade ${req.grade} target (${req.requiredExternalRaw}/${activeCourse.externalRawMax} marks)`);
                                }
                                setTimeout(() => setSnapFeedback(null), 2500);
                              }}
                              className={`p-2 rounded-xl border text-center transition-all flex flex-col items-center justify-between min-h-[74px] sm:min-h-[76px] w-[76px] xs:w-[82px] sm:w-auto flex-shrink-0 relative cursor-pointer active:scale-95 touch-manipulation ${
                                isCurrentGrade
                                  ? `${gTheme.bg} ${gTheme.border} ring-2 ring-cyan-400 scale-[1.02] shadow-[0_0_15px_rgba(6,182,212,0.3)]`
                                  : req.alreadyAchieved
                                  ? 'bg-emerald-950/40 border-emerald-500/40 text-emerald-300 hover:border-emerald-400'
                                  : req.possible
                                  ? 'bg-obsidian-900/90 border-white/10 hover:border-cyan-500/50 text-slate-200 hover:bg-obsidian-850'
                                  : 'bg-obsidian-950/60 border-white/5 text-slate-600 opacity-40 cursor-not-allowed'
                              }`}
                            >
                              {isCurrentGrade && (
                                <span className="absolute -top-1.5 -right-1 px-1 py-0.2 rounded bg-cyan-500 text-obsidian-950 font-bold text-[8px] uppercase tracking-wider shadow">
                                  Current
                                </span>
                              )}

                              <div className="flex items-center gap-1">
                                <span className={`text-sm font-extrabold font-mono ${isCurrentGrade ? gTheme.text : 'text-white'}`}>
                                  {req.grade}
                                </span>
                                <span className="text-[9px] font-mono text-slate-400">
                                  [{GRADE_POINTS[req.grade]}]
                                </span>
                              </div>

                              <div className="text-[10px] font-mono text-slate-400">
                                ≥{cutoff}
                              </div>

                              <div className="mt-1 w-full">
                                {req.alreadyAchieved ? (
                                  <span className="text-[9px] font-mono font-bold text-emerald-400 flex items-center justify-center gap-0.5">
                                    <Check className="w-2.5 h-2.5" /> Secured
                                  </span>
                                ) : req.possible ? (
                                  <div className="text-[10px] font-mono font-bold text-cyan-300 bg-cyan-950/60 py-0.5 rounded border border-cyan-800/40">
                                    {req.requiredExternalRaw}/{activeCourse.externalRawMax}
                                  </div>
                                ) : (
                                  <span className="text-[9px] font-mono text-rose-400/80">
                                    Impossible
                                  </span>
                                )}
                              </div>
                            </button>
                          );
                        })}
                      </div>
                    </div>

                    {/* ======================================================== */}
                    {/* COLLAPSIBLE COHORT CUTOFF INSPECTOR & CURVE SAFE BANDS   */}
                    {/* ======================================================== */}
                    <div className="pt-1">
                      <div className="flex items-center gap-1">
                        <button
                          type="button"
                          onClick={() => setShowCutoffInspector(!showCutoffInspector)}
                          className="flex-1 flex items-center justify-between p-2 rounded-xl bg-obsidian-900/80 hover:bg-obsidian-850 border border-white/10 text-xs font-semibold text-slate-300 hover:text-white transition-all"
                        >
                          <span className="flex items-center gap-2">
                            <Sliders className="w-3.5 h-3.5 text-cyan-400" />
                            <span>Cohort Cutoff Inspector & Curve Distribution</span>
                          </span>
                          <span className="text-[11px] font-mono text-cyan-400">
                            {showCutoffInspector ? 'Hide ▲' : 'Inspect ▼'}
                          </span>
                        </button>
                        <MicroTooltip content="Cohort Cutoffs: Inspect the dynamic percentile cutoffs (A+, A, B+, B, C+, C, D) calibrated for Chandigarh University relative curve grading distributions." />
                      </div>

                      {showCutoffInspector && (
                        <div className="mt-2 p-3 rounded-xl bg-obsidian-900/95 border border-cyan-500/20 space-y-2.5 animate-fadeIn">
                          <div className="flex items-center justify-between text-xs">
                            <span className="text-slate-300 font-medium">
                              Relative Curve Mode for {activeCourse.code}:
                            </span>
                            <span className="font-mono text-cyan-300 uppercase font-bold text-[11px]">
                              {curveMode} ({activeResult.gradeCutoffs['A+']}+ for A+)
                            </span>
                          </div>

                          {/* Cutoff Reference Pills */}
                          <div className="grid grid-cols-4 sm:grid-cols-7 gap-1 text-[10px] sm:text-[11px] font-mono">
                            {(['A+', 'A', 'B+', 'B', 'C+', 'C', 'D'] as GradeLevel[]).map(g => (
                              <div key={g} className="p-1.5 rounded-lg bg-obsidian-850 border border-white/5 text-center">
                                <div className="font-bold text-slate-200">{g}</div>
                                <div className="text-[10px] text-cyan-400">≥{activeResult.gradeCutoffs[g]}</div>
                              </div>
                            ))}
                          </div>

                          {/* Next Grade Distance Hint */}
                          <div className="p-2.5 rounded-lg bg-cyan-950/40 border border-cyan-800/40 text-xs text-slate-300 flex items-start gap-2">
                            <Info className="w-4 h-4 text-cyan-400 flex-shrink-0 mt-0.5" />
                            <div>
                              <p className="leading-relaxed">
                                Your projected score is <strong className="text-cyan-300 font-mono">{activeResult.totalWeightedScore.toFixed(1)}/100</strong>.
                                {activeResult.targetRequirements.find(t => !t.alreadyAchieved && t.possible && t.grade !== 'D') ? (
                                  <>
                                    {' '}To reach <strong className="text-white">Grade {activeResult.targetRequirements.find(t => !t.alreadyAchieved && t.possible && t.grade !== 'D')?.grade}</strong>, you need external marks of at least <strong className="text-cyan-300 font-mono">{activeResult.targetRequirements.find(t => !t.alreadyAchieved && t.possible && t.grade !== 'D')?.requiredExternalRaw}/{activeCourse.externalRawMax}</strong>.
                                  </>
                                ) : (
                                  <span className="text-emerald-300 font-semibold"> You are in the top-percentile A+ band!</span>
                                )}
                              </p>
                            </div>
                          </div>
                        </div>
                      )}
                    </div>

                  </div>
                  )
                )}

              </div>

              {/* CARD FOOTER CONTROLS */}
              <div className="pt-3 border-t border-white/10 space-y-2 sm:space-y-0">
                {/* Mobile Controls (< 640px): Large, Comfortable Touch Targets */}
                <div className="sm:hidden space-y-2">
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={handleBack}
                      className="flex-1 py-3 rounded-xl bg-obsidian-850 hover:bg-obsidian-800 text-slate-300 text-xs font-bold border border-white/10 transition-colors flex items-center justify-center gap-1.5 active:scale-95 touch-manipulation"
                    >
                      <ChevronLeft className="w-4 h-4" />
                      <span>Back</span>
                    </button>
                    <button
                      type="button"
                      onClick={handleNext}
                      className="flex-[2] py-3 rounded-xl bg-gradient-to-r from-cyan-500 to-indigo-600 hover:from-cyan-400 hover:to-indigo-500 text-white text-xs font-extrabold shadow-[0_0_15px_rgba(6,182,212,0.3)] transition-all flex items-center justify-center gap-1.5 active:scale-95 touch-manipulation"
                    >
                      <span>{currentStep === totalCourseSteps ? 'Finish & Flight Plan' : 'Next Subject'}</span>
                      <ChevronRight className="w-4 h-4" />
                    </button>
                  </div>
                  <div className="flex items-center justify-between gap-2">
                    <div className="flex-1 flex items-center gap-0.5">
                      <button
                        type="button"
                        onClick={() => setShowSingleSubjectModal(true)}
                        className="w-full py-2 rounded-xl bg-cyan-950/60 text-cyan-300 text-[11px] font-semibold border border-cyan-500/30 flex items-center justify-center gap-1 active:scale-95"
                      >
                        <Sparkles className="w-3 h-3 text-cyan-400" />
                        <span>Single Subject Report</span>
                      </button>
                      <MicroTooltip content="Single Subject Report: Opens a detailed diagnostic view showing grade cutoffs, score breakdown, and requirement targets for this subject." />
                    </div>
                    <button
                      type="button"
                      onClick={handleSkipToDashboard}
                      className="flex-1 py-2 rounded-xl bg-obsidian-850 text-slate-400 text-[11px] font-semibold border border-white/10 flex items-center justify-center active:scale-95"
                    >
                      <span>Skip to Dashboard</span>
                    </button>
                  </div>
                </div>

                {/* Desktop Controls (>= 640px) */}
                <div className="hidden sm:flex items-center justify-between gap-2">
                  <button
                    type="button"
                    onClick={handleBack}
                    className="px-3 sm:px-4 py-2 rounded-xl bg-obsidian-850 hover:bg-obsidian-800 text-slate-300 text-xs font-semibold border border-white/10 transition-colors flex items-center gap-1.5"
                  >
                    <ChevronLeft className="w-4 h-4" />
                    <span>Back</span>
                  </button>

                  {/* Center: Single Subject Report button */}
                  <div className="inline-flex items-center gap-1 order-3 sm:order-2 w-full sm:w-auto justify-center">
                    <button
                      type="button"
                      onClick={() => setShowSingleSubjectModal(true)}
                      className="px-3 py-2 rounded-xl bg-cyan-950/60 hover:bg-cyan-900/60 text-cyan-300 hover:text-white text-xs font-semibold border border-cyan-500/40 transition-all flex items-center gap-1.5 shadow-[0_0_12px_rgba(6,182,212,0.15)] active:scale-95"
                    >
                      <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
                      <span>Single Subject Report</span>
                    </button>
                    <MicroTooltip content="Single Subject Report: Opens a detailed diagnostic view showing grade cutoffs, score breakdown, and requirement targets for this subject." />
                  </div>

                  <div className="flex items-center gap-2 order-2 sm:order-3 ml-auto sm:ml-0">
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
                      className="px-4 sm:px-5 py-2.5 rounded-xl bg-gradient-to-r from-cyan-500 to-indigo-600 hover:from-cyan-400 hover:to-indigo-500 text-white text-xs font-bold shadow-[0_0_15px_rgba(6,182,212,0.3)] transition-all flex items-center gap-1.5"
                    >
                      <span>{currentStep === totalCourseSteps ? 'Finish & Flight Plan' : 'Next Subject'}</span>
                      <ChevronRight className="w-4 h-4" />
                    </button>
                  </div>
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
              className="glass-card rounded-2xl p-3.5 sm:p-7 border border-white/15 shadow-2xl text-center relative overflow-hidden"
            >
              <div className="absolute top-0 center w-96 h-96 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none -translate-y-1/2" />

              <div className="space-y-2 mb-6">
                <div className="inline-flex p-3 rounded-2xl bg-gradient-to-br from-emerald-500/20 via-cyan-500/20 to-indigo-500/20 border border-emerald-500/30 text-emerald-400 shadow-[0_0_25px_rgba(16,185,129,0.3)]">
                  <Award className="w-8 h-8" />
                </div>
                <h2 className="text-xl sm:text-3xl font-extrabold text-white tracking-tight">
                  Your Semester V Flight Plan is Ready!
                </h2>
                <p className="text-xs sm:text-sm text-slate-400 max-w-md mx-auto">
                  All {totalCourseSteps} subjects for {currentTrack.name} are calibrated with your marks and targets.
                </p>
              </div>

              {/* Giant SGPA Hero Card */}
              <div className="p-4 sm:p-6 rounded-2xl bg-gradient-to-br from-obsidian-900 via-obsidian-850 to-cyan-950/40 border border-cyan-500/30 shadow-[0_0_30px_rgba(6,182,212,0.2)] mb-6">
                <span className="text-xs font-mono uppercase tracking-widest text-slate-400 block mb-1">
                  Projected 5th Semester SGPA
                </span>
                <div className="text-5xl sm:text-7xl font-extrabold font-mono text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-emerald-400 to-indigo-300">
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

              {/* Developer Motivation & Feedback Card */}
              <div className="p-4 sm:p-5 rounded-2xl bg-gradient-to-r from-rose-950/40 via-purple-950/30 to-indigo-950/40 border border-rose-500/30 shadow-[0_0_20px_rgba(244,63,94,0.15)] flex flex-col sm:flex-row items-center justify-between gap-3 text-left mb-6">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-2xl bg-rose-500/20 border border-rose-500/40 flex items-center justify-center text-rose-400 shadow-[0_0_15px_rgba(244,63,94,0.3)] flex-shrink-0">
                    <Heart className="w-5 h-5 text-rose-400 fill-rose-500 animate-pulse" />
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-white">Did GradePulse help you plan your semester?</h4>
                    <p className="text-xs text-slate-400">Leave a heart or a quick motivational note for Anuj (Creator)!</p>
                  </div>
                </div>
                {onOpenFeedback && (
                  <button
                    type="button"
                    onClick={onOpenFeedback}
                    className="px-4 py-2 rounded-xl bg-gradient-to-r from-rose-500 to-pink-600 hover:from-rose-400 hover:to-pink-500 text-white font-bold text-xs shadow-[0_0_15px_rgba(244,63,94,0.3)] flex items-center gap-1.5 transition-all whitespace-nowrap active:scale-95 flex-shrink-0 cursor-pointer"
                  >
                    <Heart className="w-3.5 h-3.5 fill-white" />
                    <span>Send Love & Feedback</span>
                  </button>
                )}
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

      {/* ============================================================== */}
      {/* 4. SINGLE SUBJECT RESULT & QUICK EXIT MODAL                     */}
      {/* ============================================================== */}
      {showSingleSubjectModal && activeCourse && activeResult && (
        <div className="fixed inset-0 z-[70] bg-obsidian-950/85 backdrop-blur-md flex items-center justify-center p-3 sm:p-5 animate-fadeIn">
          <div className="relative w-full max-w-lg bg-obsidian-900 border border-cyan-500/30 rounded-2xl shadow-2xl p-4 sm:p-6 space-y-4 max-h-[92vh] overflow-y-auto">
            {/* Header */}
            <div className="flex items-start justify-between pb-3 border-b border-white/10 gap-2">
              <div>
                <div className="flex items-center gap-1.5 flex-wrap">
                  <span className="font-mono text-xs font-bold text-cyan-400 px-2 py-0.5 rounded bg-cyan-950/80 border border-cyan-800/60">
                    {activeCourse.code}
                  </span>
                  <span className="text-xs font-mono text-slate-300">
                    {activeCourse.credits.toFixed(1)} Credits
                  </span>
                  <span className="text-[10px] font-mono text-slate-400 uppercase">
                    {activeCourse.type}
                  </span>
                </div>
                <h3 className="text-base sm:text-lg font-bold text-white mt-1">
                  {activeCourse.name}
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setShowSingleSubjectModal(false)}
                className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-white/10 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Hero Grade Card */}
            <div className="p-4 rounded-xl bg-gradient-to-br from-obsidian-850 to-obsidian-800 border border-cyan-500/20 flex items-center justify-between">
              <div>
                <span className="text-[10px] font-mono uppercase tracking-wider text-slate-400 block mb-0.5">
                  Single Subject Predicted Grade
                </span>
                <div className="flex items-baseline gap-2">
                  <span className={`text-2xl sm:text-3xl font-extrabold font-mono ${
                    GRADE_COLORS[activeResult.predictedGrade]?.text || 'text-cyan-300'
                  }`}>
                    Grade {activeResult.predictedGrade}
                  </span>
                  <span className="text-xs font-mono text-slate-300 font-semibold">
                    ({activeResult.gradePoint} Grade Points)
                  </span>
                </div>
                <span className="text-[11px] font-mono text-slate-400 mt-1 block">
                  Contributes {(activeCourse.credits * activeResult.gradePoint).toFixed(1)} Credit Points to SGPA
                </span>
              </div>

              <div className={`w-14 h-14 rounded-2xl flex flex-col items-center justify-center font-mono font-bold text-xl border ${
                GRADE_COLORS[activeResult.predictedGrade]?.bg || 'bg-obsidian-850'
              } ${GRADE_COLORS[activeResult.predictedGrade]?.border || 'border-cyan-500/40'} ${
                GRADE_COLORS[activeResult.predictedGrade]?.text || 'text-cyan-300'
              } ${GRADE_COLORS[activeResult.predictedGrade]?.glow || ''}`}>
                {activeResult.predictedGrade}
              </div>
            </div>

            {/* Marks Breakdown Grid */}
            <div className="grid grid-cols-3 gap-2 text-center text-xs">
              <div className="p-2.5 rounded-xl bg-obsidian-850 border border-white/5">
                <span className="text-[10px] font-mono text-slate-400 block">Total Score</span>
                <span className="text-sm font-bold font-mono text-white">
                  {activeResult.totalWeightedScore.toFixed(1)}
                </span>
                <span className="text-[10px] text-slate-500 block">/ 100.0</span>
              </div>
              <div className="p-2.5 rounded-xl bg-obsidian-850 border border-white/5">
                <span className="text-[10px] font-mono text-slate-400 block">Internal Secured</span>
                <span className="text-sm font-bold font-mono text-cyan-300">
                  {activeResult.weightedInternalScore.toFixed(1)}
                </span>
                <span className="text-[10px] text-slate-500 block">/ {activeResult.maxInternalWeightage} wt</span>
              </div>
              <div className="p-2.5 rounded-xl bg-obsidian-850 border border-white/5">
                <span className="text-[10px] font-mono text-slate-400 block">External Target</span>
                <span className="text-sm font-bold font-mono text-indigo-300">
                  {activeCourse.externalTargetScore}
                </span>
                <span className="text-[10px] text-slate-500 block">/ {activeCourse.externalRawMax} raw</span>
              </div>
            </div>

            {/* Target Roadmap Table */}
            <div className="space-y-1.5">
              <span className="text-xs font-semibold text-slate-300 flex items-center gap-1.5">
                <Target className="w-3.5 h-3.5 text-cyan-400" />
                <span>Cohort Grade Roadmap for {activeCourse.code}:</span>
              </span>
              <div className="grid grid-cols-2 xs:grid-cols-4 sm:grid-cols-7 gap-1">
                {activeResult.targetRequirements.map(req => {
                  const isCurrent = activeResult.predictedGrade === req.grade;
                  return (
                    <div
                      key={req.grade}
                      className={`p-1.5 rounded-lg border text-center font-mono ${
                        isCurrent
                          ? 'bg-cyan-950/80 border-cyan-400 ring-1 ring-cyan-400 text-cyan-300'
                          : req.alreadyAchieved
                          ? 'bg-emerald-950/40 border-emerald-500/30 text-emerald-300'
                          : req.possible
                          ? 'bg-obsidian-850 border-white/10 text-slate-300'
                          : 'bg-obsidian-950/60 border-white/5 text-slate-600'
                      }`}
                    >
                      <div className="text-xs font-bold">{req.grade}</div>
                      <div className="text-[9px] text-slate-400">≥{activeResult.gradeCutoffs[req.grade]}</div>
                      <div className="text-[9px] font-bold mt-0.5">
                        {req.alreadyAchieved ? '✓' : req.possible ? `${req.requiredExternalRaw}` : '✗'}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Modal Actions */}
            <div className="space-y-2 pt-2 border-t border-white/10">
              <button
                type="button"
                onClick={() => {
                  setShowSingleSubjectModal(false);
                  onComplete();
                  setTimeout(() => {
                    document.getElementById(`course-${activeCourse.id}`)?.scrollIntoView({ behavior: 'smooth', block: 'center' });
                  }, 150);
                }}
                className="w-full py-2.5 rounded-xl bg-gradient-to-r from-cyan-500 to-indigo-600 hover:from-cyan-400 hover:to-indigo-500 text-white font-bold text-xs shadow-[0_0_15px_rgba(6,182,212,0.3)] flex items-center justify-center gap-2 transition-all cursor-pointer active:scale-98"
              >
                <Sparkles className="w-4 h-4" />
                <span>Finish & View This Subject on Dashboard 🚀</span>
              </button>

              <div className="flex items-center gap-2">
                {currentStep < totalCourseSteps && (
                  <button
                    type="button"
                    onClick={() => {
                      setShowSingleSubjectModal(false);
                      handleNext();
                    }}
                    className="flex-1 py-2 rounded-xl bg-obsidian-850 hover:bg-obsidian-800 text-slate-200 text-xs font-semibold border border-white/10 transition-colors"
                  >
                    Simulate Next Subject →
                  </button>
                )}
                <button
                  type="button"
                  onClick={() => setShowSingleSubjectModal(false)}
                  className="flex-1 py-2 rounded-xl bg-obsidian-850 hover:bg-obsidian-800 text-slate-400 hover:text-slate-200 text-xs font-semibold border border-white/10 transition-colors"
                >
                  Keep Editing
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
