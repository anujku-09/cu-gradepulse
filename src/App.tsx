import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { 
  Plus, 
  RotateCcw, 
  Sparkles, 
  Sliders, 
  HelpCircle, 
  Filter, 
  Layers, 
  Grid, 
  CheckCircle,
  AlertTriangle,
  Zap,
  BookOpen,
  Search,
  ExternalLink,
  X,
  Heart
} from 'lucide-react';
import confetti from 'canvas-confetti';

import { Course, CourseType, CurveMode, GradeCutoffs, GradeLevel, SemesterCalculation, CohortTrackId } from './types';
import { 
  INITIAL_BLANK_COURSES, 
  SAMPLE_CSE_COURSES, 
  INITIAL_COURSES, 
  COHORT_TRACKS_INFO, 
  switchTrackPreservingMarks, 
  detectTrackFromCourses, 
  convertCourseMode 
} from './data/courses';
import { CURVE_PRESETS, calculateSemester, calculateCgpaForecast } from './utils/gradeCalculations';

import { Navbar } from './components/Navbar';
import { MissionControlHeader } from './components/MissionControlHeader';
import { QuickStartGuide } from './components/QuickStartGuide';
import { CourseBentoCard } from './components/CourseBentoCard';
import { CourseDetailModal } from './components/CourseDetailModal';
import { CgpaForecasterModal } from './components/CgpaForecasterModal';
import { CuimsSmartPasteModal } from './components/CuimsSmartPasteModal';
import { ScorecardExportModal } from './components/ScorecardExportModal';
import { GradeCutoffModal } from './components/GradeCutoffModal';
import { CommandPalette } from './components/CommandPalette';
import { MobileBottomNav } from './components/MobileBottomNav';
import { SemesterSetupWizard } from './components/SemesterSetupWizard';
import { FeedbackModal } from './components/FeedbackModal';
import { getGlobalHearts } from './services/heartCounter';
import { CohortTrackModal } from './components/CohortTrackModal';
import { AddCustomCourseModal } from './components/AddCustomCourseModal';
import { EditCourseModal } from './components/EditCourseModal';

export const App: React.FC = () => {
  // Clear any residual browser storage so application always starts clean from start on refresh or tab reopen
  useEffect(() => {
    try {
      localStorage.clear();
      sessionStorage.clear();
    } catch (e) {}
  }, []);

  // 1. Course State (Starts fresh on every load / refresh with clean blank slate)
  const [courses, setCourses] = useState<Course[]>(INITIAL_BLANK_COURSES);

  // Track State (Starts fresh at General CSE Set F)
  const [currentTrackId, setCurrentTrackId] = useState<CohortTrackId>('general');

  // 2. View Mode (Simple vs Detailed)
  const [isDetailedView, setIsDetailedView] = useState<boolean>(false);

  // 3. Global Curve Mode & Cutoffs (Defaults to standard 95+ CU curve)
  const [curveMode, setCurveMode] = useState<CurveMode>('standard');
  const [globalCutoffs, setGlobalCutoffs] = useState<GradeCutoffs>(CURVE_PRESETS.standard);

  useEffect(() => {
    if (curveMode !== 'custom') {
      setGlobalCutoffs(CURVE_PRESETS[curveMode]);
    }
  }, [curveMode]);

  // 4. CGPA Forecaster Preferences (Previous CGPA & Credits)
  const [cgpaPrefs, setCgpaPrefs] = useState<{ previousCgpa: number; previousCredits: number }>({
    previousCgpa: 8.25,
    previousCredits: 76.0
  });

  // 5. Modal Dialog States
  const [inspectCourseId, setInspectCourseId] = useState<string | null>(null);
  const [isForecasterOpen, setIsForecasterOpen] = useState(false);
  const [isPasteModalOpen, setIsPasteModalOpen] = useState(false);
  const [isExportModalOpen, setIsExportModalOpen] = useState(false);
  const [isCutoffModalOpen, setIsCutoffModalOpen] = useState(false);
  const [isCommandPaletteOpen, setIsCommandPaletteOpen] = useState(false);
  const [isTrackModalOpen, setIsTrackModalOpen] = useState(false);
  const [isAddCustomCourseOpen, setIsAddCustomCourseOpen] = useState(false);
  const [editingCourse, setEditingCourse] = useState<Course | null>(null);
  const [isFeedbackOpen, setIsFeedbackOpen] = useState(false);
  const [globalHearts, setGlobalHearts] = useState<number>(() => {
    try {
      return parseInt(localStorage.getItem('cu_gradepulse_cached_global_hearts') || '0', 10);
    } catch (e) {
      return 0;
    }
  });

  // Fetch real-time global hearts on mount
  useEffect(() => {
    getGlobalHearts().then(count => {
      if (count > 0) setGlobalHearts(count);
    });
  }, []);

  // Setup Wizard starts OPEN on Step 0 so students always start from the start!
  const [isSetupWizardOpen, setIsSetupWizardOpen] = useState<boolean>(true);
  const [showFlightPlanBanner, setShowFlightPlanBanner] = useState(false);

  // 6. Filter Tab: All, Core Marks (A), Direct (B), Dual-Mode (C)
  const [filterGroup, setFilterGroup] = useState<'ALL' | 'A' | 'B' | 'C'>('ALL');
  const [searchQuery, setSearchQuery] = useState('');

  // 7. Core Calculations
  const calculation: SemesterCalculation = useMemo(() => {
    return calculateSemester(courses, globalCutoffs);
  }, [courses, globalCutoffs]);

  const cgpaForecast = useMemo(() => {
    return calculateCgpaForecast(
      cgpaPrefs.previousCgpa,
      cgpaPrefs.previousCredits,
      calculation.sgpa,
      calculation.totalGradedCredits
    );
  }, [cgpaPrefs, calculation.sgpa, calculation.totalGradedCredits]);

  // Handlers for modifying courses
  const handleUpdateExternal = useCallback((courseId: string, score: number) => {
    setCourses(prev => prev.map(c => {
      if (c.id !== courseId) return c;
      const clamped = Math.max(0, Math.min(score, c.externalRawMax));
      return { ...c, externalTargetScore: clamped };
    }));
  }, []);

  const handleUpdateDirectGrade = useCallback((courseId: string, grade: GradeLevel) => {
    setCourses(prev => prev.map(c => {
      if (c.id !== courseId) return c;
      return { ...c, directGrade: grade };
    }));
  }, []);

  const handleUpdateDirectInternal = useCallback((courseId: string, score: number | undefined) => {
    setCourses(prev => prev.map(c => {
      if (c.id !== courseId) return c;
      return { ...c, directInternalOverride: score };
    }));
  }, []);

  const handleUpdateComponentMarks = useCallback((courseId: string, componentId: string, obtained: number) => {
    setCourses(prev => prev.map(c => {
      if (c.id !== courseId) return c;
      return {
        ...c,
        directInternalOverride: undefined, // Clear override so individual components are active
        components: c.components.map(comp => {
          if (comp.id !== componentId) return comp;
          const clamped = Math.max(0, Math.min(obtained, comp.rawMax));
          return { ...comp, rawObtained: clamped };
        })
      };
    }));
  }, []);

  const handleQuickPreset = useCallback((courseId: string, preset: 'full' | 'average' | 'reset') => {
    setCourses(prev => prev.map(c => {
      if (c.id !== courseId) return c;
      return {
        ...c,
        directInternalOverride: undefined,
        components: c.components.map(comp => {
          let score = comp.rawMax;
          if (preset === 'average') score = Math.round(comp.rawMax * 0.75 * 10) / 10;
          if (preset === 'reset') score = 0;
          return { ...comp, rawObtained: score };
        })
      };
    }));
  }, []);

  const handleGlobalQuickPreset = useCallback((preset: 'full' | 'average' | 'reset') => {
    setCourses(prev => prev.map(c => {
      return {
        ...c,
        directInternalOverride: undefined,
        components: c.components.map(comp => {
          let score = comp.rawMax;
          if (preset === 'average') score = Math.round(comp.rawMax * 0.75 * 10) / 10;
          if (preset === 'reset') score = 0;
          return { ...comp, rawObtained: score };
        }),
        externalTargetScore: preset === 'full' ? c.externalRawMax : preset === 'average' ? Math.round(c.externalRawMax * 0.75) : 0,
        directGrade: preset === 'full' ? 'A+' : preset === 'average' ? 'B+' : 'C'
      };
    }));
  }, []);

  const handleStartBlank = useCallback(() => {
    setCourses(INITIAL_BLANK_COURSES);
  }, []);

  const handleLoadSample = useCallback(() => {
    setCourses(SAMPLE_CSE_COURSES);
    try {
      confetti({ particleCount: 50, spread: 60, origin: { y: 0.6 } });
    } catch (e) {}
  }, []);

  const handleToggleCourseExcluded = useCallback((courseId: string) => {
    setCourses(prev => prev.map(c => {
      if (c.id === courseId) {
        return { ...c, isExcluded: !c.isExcluded };
      }
      return c;
    }));
  }, []);

  const handleIncludeAllCourses = useCallback(() => {
    setCourses(prev => prev.map(c => ({ ...c, isExcluded: false })));
  }, []);

  const handleSaveCustomCutoffs = useCallback((courseId: string, cutoffs: GradeCutoffs | undefined) => {
    setCourses(prev => prev.map(c => {
      if (c.id === courseId) {
        return { ...c, customCutoffs: cutoffs };
      }
      return c;
    }));
  }, []);

  const handleApplyParsedMarks = useCallback((updates: { courseId: string; componentId: string; rawObtained: number }[]) => {
    const lookup = new Map<string, number>();
    for (const u of updates) {
      lookup.set(`${u.courseId}_${u.componentId}`, u.rawObtained);
    }

    setCourses(prev => prev.map(c => {
      return {
        ...c,
        directInternalOverride: undefined,
        components: c.components.map(comp => {
          const key = `${c.id}_${comp.id}`;
          if (lookup.has(key)) {
            return { ...comp, rawObtained: lookup.get(key)! };
          }
          return comp;
        })
      };
    }));
  }, []);

  const handleResetAll = useCallback(() => {
    if (window.confirm('Reset all entered marks to clean blank slate (0)?')) {
      handleStartBlank();
    }
  }, [handleStartBlank]);

  const handleToggleAttendance = useCallback((courseId: string, full: boolean) => {
    setCourses(prev => prev.map(c => {
      if (c.id !== courseId) return c;
      const attComp = c.components.find(comp => comp.category === 'Attendance' || comp.name.toLowerCase().includes('attendance'));
      if (!attComp) return c;
      return {
        ...c,
        directInternalOverride: undefined,
        components: c.components.map(comp => {
          if (comp.id === attComp.id) {
            return { ...comp, rawObtained: full ? comp.rawMax : 0 };
          }
          return comp;
        })
      };
    }));
  }, []);

  const handleClaimAllAttendance = useCallback(() => {
    setCourses(prev => prev.map(c => {
      const hasAtt = c.components.some(comp => comp.category === 'Attendance' || comp.name.toLowerCase().includes('attendance'));
      if (!hasAtt) return c;
      return {
        ...c,
        directInternalOverride: undefined,
        components: c.components.map(comp => {
          if (comp.category === 'Attendance' || comp.name.toLowerCase().includes('attendance')) {
            return { ...comp, rawObtained: comp.rawMax };
          }
          return comp;
        })
      };
    }));
    try {
      confetti({ particleCount: 50, spread: 60, origin: { y: 0.6 } });
    } catch (e) {}
  }, []);

  const handleSelectTrack = useCallback((newTrackId: CohortTrackId) => {
    setCurrentTrackId(newTrackId);
    setCourses(prev => switchTrackPreservingMarks(prev, newTrackId));
  }, []);

  const handleAddCourse = useCallback((newCourse: Course) => {
    setCourses(prev => [...prev, newCourse]);
    setCurrentTrackId('custom');
  }, []);

  const handleUpdateCourse = useCallback((updatedCourse: Course) => {
    setCourses(prev => prev.map(c => c.id === updatedCourse.id ? updatedCourse : c));
  }, []);

  const handleDeleteCourse = useCallback((courseId: string) => {
    setCourses(prev => prev.filter(c => c.id !== courseId));
  }, []);

  const handleConvertCourseMode = useCallback((courseId: string, targetType: CourseType) => {
    setCourses(prev => prev.map(c => {
      if (c.id !== courseId) return c;
      return convertCourseMode(c, targetType);
    }));
  }, []);

  const handleCompleteWizard = useCallback(() => {
    setIsSetupWizardOpen(false);
    setShowFlightPlanBanner(true);
    window.scrollTo({ top: 0, behavior: 'smooth' });
    setTimeout(() => {
      document.getElementById('course-matrix')?.scrollIntoView({ behavior: 'smooth' });
    }, 150);
  }, []);

  const handleOpenWizard = useCallback(() => {
    setIsSetupWizardOpen(true);
  }, []);

  // Filtered courses for grid
  const displayedCourses = useMemo(() => {
    return courses.filter(c => {
      if (filterGroup !== 'ALL' && c.group !== filterGroup) return false;
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        return c.code.toLowerCase().includes(q) || c.name.toLowerCase().includes(q);
      }
      return true;
    });
  }, [courses, filterGroup, searchQuery]);

  // Selected course for slide-over inspector
  const inspectedCourse = useMemo(() => {
    return courses.find(c => c.id === inspectCourseId) || null;
  }, [courses, inspectCourseId]);

  const inspectedResult = useMemo(() => {
    return inspectCourseId ? calculation.courses[inspectCourseId] || null : null;
  }, [calculation, inspectCourseId]);

  return (
    <div className="min-h-screen bg-obsidian-900 text-slate-100 flex flex-col relative selection:bg-cyan-500/20 selection:text-cyan-300">
      
      {/* Radial Ambient Mesh Background */}
      <div className="fixed inset-0 pointer-events-none bg-mesh-glow opacity-80" />
      <div className="fixed top-0 left-1/4 w-[600px] h-[600px] bg-indigo-600/5 rounded-full blur-[140px] pointer-events-none" />
      <div className="fixed bottom-0 right-1/4 w-[600px] h-[600px] bg-cyan-600/5 rounded-full blur-[140px] pointer-events-none" />

      {/* Mission Control Top Navigation Bar */}
      <Navbar
        curveMode={curveMode}
        onCurveChange={setCurveMode}
        currentTrackId={currentTrackId}
        onOpenTrackModal={() => setIsTrackModalOpen(true)}
        onOpenAddCustomCourse={() => setIsAddCustomCourseOpen(true)}
        onOpenForecaster={() => setIsForecasterOpen(true)}
        onOpenPasteModal={() => setIsPasteModalOpen(true)}
        onOpenExportModal={() => setIsExportModalOpen(true)}
        onOpenCutoffModal={() => setIsCutoffModalOpen(true)}
        onOpenCommandPalette={() => setIsCommandPaletteOpen(true)}
        onOpenWizard={handleOpenWizard}
        onOpenFeedback={() => setIsFeedbackOpen(true)}
        globalHearts={globalHearts}
        onResetAll={handleResetAll}
      />

      {/* Main Content Hub */}
      <main className="flex-1 max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 py-3 sm:py-6 w-full relative z-10 pb-28 sm:pb-8">
        
        {/* Welcome / Arrival Banner after Completing Setup Flow */}
        {showFlightPlanBanner && (
          <div className="mb-4 sm:mb-6 p-3.5 sm:p-4 rounded-2xl bg-gradient-to-r from-cyan-950/70 via-indigo-950/70 to-obsidian-900 border border-cyan-500/40 shadow-[0_0_25px_rgba(6,182,212,0.25)] flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 animate-fadeIn">
            <div className="flex items-center gap-3 min-w-0">
              <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-cyan-500/20 border border-cyan-500/40 flex items-center justify-center text-cyan-300 shadow-[0_0_15px_rgba(6,182,212,0.3)] flex-shrink-0">
                <Sparkles className="w-5 h-5 text-cyan-400" />
              </div>
              <div className="min-w-0">
                <h3 className="text-sm sm:text-base font-extrabold text-white flex items-center gap-2 flex-wrap">
                  <span>Welcome to Academic Mission Control 🚀</span>
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-cyan-950 text-cyan-300 border border-cyan-700/60">
                    Live Predicted SGPA: {calculation.sgpa > 0 ? calculation.sgpa.toFixed(2) : '--.--'}
                  </span>
                </h3>
                <p className="text-xs text-slate-300 mt-0.5">
                  All your course marks, attendance credits, and external targets have landed in your Semester V Matrix.
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2 self-end sm:self-auto flex-shrink-0">
              <button
                type="button"
                onClick={handleOpenWizard}
                className="px-3 py-1.5 rounded-xl bg-obsidian-850 hover:bg-obsidian-800 text-xs font-semibold text-slate-300 border border-white/10 transition-colors min-h-[36px]"
              >
                Reopen Card Deck
              </button>
              <button
                type="button"
                onClick={() => setShowFlightPlanBanner(false)}
                className="p-1.5 rounded-xl bg-white/5 hover:bg-white/10 text-slate-400 hover:text-white transition-colors min-h-[36px] min-w-[36px] flex items-center justify-center"
                title="Dismiss banner"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}

        {/* Bento Hero Header */}
        <MissionControlHeader
          calc={calculation}
          cgpaForecast={cgpaForecast}
          onOpenForecaster={() => setIsForecasterOpen(true)}
        />

        {/* Quick Start & Mode Banner */}
        <QuickStartGuide
          isDetailedView={isDetailedView}
          onToggleDetailedView={() => setIsDetailedView(prev => !prev)}
          onStartBlank={handleStartBlank}
          onLoadSample={handleLoadSample}
          onOpenPasteModal={() => setIsPasteModalOpen(true)}
          onOpenWizard={handleOpenWizard}
          onClaimAllAttendance={handleClaimAllAttendance}
        />

        {/* Cohort Track Quick Bar & Add Subject */}
        <div className="mb-4 p-3 sm:p-3.5 rounded-2xl bg-obsidian-850/60 border border-white/10 flex flex-col sm:flex-row sm:items-center justify-between gap-2.5">
          <div className="flex items-center justify-between sm:justify-start gap-2 flex-wrap">
            <div className="flex items-center gap-1.5">
              <span className="text-xs text-slate-400 font-medium">Cohort:</span>
              <button
                type="button"
                onClick={() => setIsTrackModalOpen(true)}
                className="flex items-center gap-1.5 px-3 py-1 rounded-xl bg-cyan-950/70 hover:bg-cyan-900/70 border border-cyan-500/40 text-cyan-300 text-xs font-semibold shadow-[0_0_12px_rgba(6,182,212,0.2)] transition-all min-h-[34px]"
              >
                <span>{COHORT_TRACKS_INFO.find(t => t.id === currentTrackId)?.icon || '🌐'}</span>
                <span>{COHORT_TRACKS_INFO.find(t => t.id === currentTrackId)?.name || 'General CSE'}</span>
                <span className="text-[10px] text-cyan-400 font-mono">(Switch)</span>
              </button>
            </div>
            <span className="text-[11px] text-slate-400 hidden md:inline truncate max-w-sm">
              • {COHORT_TRACKS_INFO.find(t => t.id === currentTrackId)?.electiveHighlight}
            </span>
          </div>

          <div className="flex items-center justify-between sm:justify-end gap-2 w-full sm:w-auto">
            <span className="text-[11px] font-mono text-slate-400 sm:hidden">
              {calculation.totalGradedCredits.toFixed(1)} Graded Credits
            </span>
            <button
              type="button"
              onClick={() => setIsAddCustomCourseOpen(true)}
              className="px-3 py-1.5 rounded-xl bg-gradient-to-r from-indigo-900/50 to-violet-900/50 hover:from-indigo-800/60 hover:to-violet-800/60 text-indigo-200 border border-indigo-500/30 text-xs font-semibold flex items-center gap-1.5 transition-all shadow-[0_0_10px_rgba(99,102,241,0.15)] min-h-[36px]"
            >
              <Plus className="w-3.5 h-3.5 text-indigo-400" />
              <span>+ Add Custom Subject</span>
            </button>
          </div>
        </div>

        {/* Section Header & Bento Filters */}
        <div id="course-matrix" className="space-y-3 mb-5 scroll-mt-20">
          {/* Header row: title and status badge */}
          <div className="flex items-center justify-between gap-2 flex-wrap">
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-xl bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center text-cyan-400 flex-shrink-0">
                <Grid className="w-4 h-4 text-cyan-400" />
              </div>
              <div>
                <h2 className="text-base sm:text-lg font-extrabold tracking-tight text-white flex items-center gap-2">
                  <span>Semester V Course Matrix</span>
                </h2>
                <div className="flex items-center gap-2 text-[11px] font-mono text-slate-400">
                  <span>{courses.filter(c => !c.isExcluded).length} of {courses.length} Contributing in SGPA</span>
                  {courses.some(c => c.isExcluded) && (
                    <button
                      type="button"
                      onClick={handleIncludeAllCourses}
                      className="text-cyan-400 hover:text-cyan-300 font-bold underline"
                    >
                      (Include All)
                    </button>
                  )}
                </div>
              </div>
            </div>

            <div className="flex items-center gap-1.5">
              <span className="text-[11px] font-mono px-2.5 py-1 rounded-full bg-obsidian-850 border border-white/10 text-slate-300">
                {courses.filter(c => !c.isExcluded).reduce((sum, c) => sum + c.credits, 0).toFixed(1)} Credits
              </span>
            </div>
          </div>

          {/* Search Bar & Filter Strip */}
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-2.5">
            {/* Search filter input */}
            <div className="relative flex-1">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search subject by code or name (e.g. 24CST-301)..."
                className="w-full pl-9 pr-8 py-2 rounded-xl bg-obsidian-850/80 border border-white/10 text-xs sm:text-sm text-slate-200 placeholder:text-slate-500 focus:outline-none focus:border-cyan-500/60 min-h-[40px] font-sans"
              />
              {searchQuery && (
                <button
                  type="button"
                  onClick={() => setSearchQuery('')}
                  className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white p-1"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              )}
            </div>

            {/* Filter Pills with Horizontal Touch-Scroll on mobile */}
            <div className="flex items-center gap-1 overflow-x-auto no-scrollbar py-0.5 flex-shrink-0">
              <button
                type="button"
                onClick={() => setFilterGroup('ALL')}
                className={`px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all border min-h-[36px] ${
                  filterGroup === 'ALL'
                    ? 'bg-cyan-950 text-cyan-300 border-cyan-500/50 shadow-[0_0_10px_rgba(6,182,212,0.2)]'
                    : 'bg-obsidian-850/70 text-slate-400 border-white/5 hover:text-slate-200'
                }`}
              >
                All ({courses.length})
              </button>
              <button
                type="button"
                onClick={() => setFilterGroup('A')}
                className={`px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all border min-h-[36px] ${
                  filterGroup === 'A'
                    ? 'bg-cyan-950 text-cyan-300 border-cyan-500/50 shadow-[0_0_10px_rgba(6,182,212,0.2)]'
                    : 'bg-obsidian-850/70 text-slate-400 border-white/5 hover:text-slate-200'
                }`}
                title="Group A: Core Theory & Lab Courses"
              >
                Core ({courses.filter(c => c.group === 'A').length})
              </button>
              <button
                type="button"
                onClick={() => setFilterGroup('B')}
                className={`px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all border min-h-[36px] ${
                  filterGroup === 'B'
                    ? 'bg-cyan-950 text-cyan-300 border-cyan-500/50 shadow-[0_0_10px_rgba(6,182,212,0.2)]'
                    : 'bg-obsidian-850/70 text-slate-400 border-white/5 hover:text-slate-200'
                }`}
                title="Group B: Direct Grade Elective (NPTEL / MOOC)"
              >
                Direct Grade ({courses.filter(c => c.group === 'B').length})
              </button>
              <button
                type="button"
                onClick={() => setFilterGroup('C')}
                className={`px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all border min-h-[36px] ${
                  filterGroup === 'C'
                    ? 'bg-cyan-950 text-cyan-300 border-cyan-500/50 shadow-[0_0_10px_rgba(6,182,212,0.2)]'
                    : 'bg-obsidian-850/70 text-slate-400 border-white/5 hover:text-slate-200'
                }`}
                title="Group C: Soft Skills & Aptitude Courses"
              >
                Aptitude & Skills ({courses.filter(c => c.group === 'C').length})
              </button>
            </div>
          </div>
        </div>

        {/* Course Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3.5 sm:gap-5">
          {displayedCourses.map(course => (
            <CourseBentoCard
              key={course.id}
              course={course}
              result={calculation.courses[course.id]}
              isDetailedView={isDetailedView}
              onUpdateExternal={handleUpdateExternal}
              onUpdateDirectGrade={handleUpdateDirectGrade}
              onUpdateDirectInternal={handleUpdateDirectInternal}
              onUpdateComponentMarks={handleUpdateComponentMarks}
              onToggleCourseExcluded={handleToggleCourseExcluded}
              onQuickPreset={handleQuickPreset}
              onInspect={(id) => setInspectCourseId(id)}
              onOpenEditCourse={(c) => setEditingCourse(c)}
              onConvertCourseMode={handleConvertCourseMode}
            />
          ))}

          {displayedCourses.length === 0 && (
            <div className="col-span-full p-8 rounded-2xl glass-card border border-white/10 text-center space-y-3">
              <Search className="w-8 h-8 text-slate-500 mx-auto" />
              <h4 className="text-sm font-bold text-slate-200">No matching subjects</h4>
              <p className="text-xs text-slate-400">
                {searchQuery ? `No subjects match "${searchQuery}"` : 'No subjects in this category.'}
              </p>
              <button
                type="button"
                onClick={() => { setSearchQuery(''); setFilterGroup('ALL'); }}
                className="px-4 py-2 rounded-xl bg-cyan-950 text-cyan-300 border border-cyan-700/60 text-xs font-semibold transition-all hover:bg-cyan-900"
              >
                Reset Search & Filter
              </button>
            </div>
          )}
        </div>

        {/* Bottom Quick Help & CUIMS Insights Callout */}
        <div className="mt-8 sm:mt-12 p-4 sm:p-6 rounded-2xl glass-card border border-white/10 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div className="space-y-1 min-w-0">
            <h4 className="text-xs sm:text-sm font-bold text-slate-100 flex items-center gap-2">
              <Zap className="w-4 h-4 text-cyan-400 flex-shrink-0" />
              <span>Chandigarh University Weightage & SGPA Formula</span>
            </h4>
            <p className="text-xs text-slate-400 leading-relaxed max-w-2xl">
              Internal marks scale using <code className="text-cyan-300 font-mono">Weighted_Score = (Raw_Obtained / Raw_Max) * Weightage</code>. In CSE Semester V, 4-credit courses drive over 70% of your SGPA weight. Keep external targets aligned with the live tick-marks on each course slider.
            </p>
          </div>

          <div className="flex items-center gap-2 flex-wrap sm:flex-nowrap flex-shrink-0 w-full sm:w-auto">
            <button
              type="button"
              onClick={handleOpenWizard}
              className="flex-1 sm:flex-none min-h-[38px] px-3.5 py-2 rounded-xl bg-gradient-to-r from-cyan-500/20 to-indigo-500/20 hover:from-cyan-500/30 hover:to-indigo-500/30 text-cyan-300 border border-cyan-500/40 text-xs font-bold transition-colors text-center"
            >
              Card Deck Flow ⚡
            </button>
            <button
              type="button"
              onClick={() => setIsPasteModalOpen(true)}
              className="flex-1 sm:flex-none min-h-[38px] px-3.5 py-2 rounded-xl bg-obsidian-850 hover:bg-obsidian-800 text-xs font-semibold text-slate-200 border border-white/10 transition-colors text-center"
            >
              Parse CUIMS Text
            </button>
          </div>
        </div>

      </main>

      {/* Footer with Mobile Safe-Bottom Padding */}
      <footer className="border-t border-white/[0.08] bg-obsidian-950 py-6 pb-28 sm:pb-6 text-center text-xs text-slate-500 font-mono relative z-10">
        <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="flex flex-col sm:flex-row items-center gap-1 sm:gap-2">
            <span className="font-semibold text-slate-400">CU GradePulse</span>
            <span className="hidden sm:inline">•</span>
            <span>Chandigarh University (CSE) Academic Intelligence Workspace</span>
          </div>
          <button
            type="button"
            onClick={() => setIsFeedbackOpen(true)}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-rose-950/40 hover:bg-rose-900/60 text-rose-300 border border-rose-500/30 transition-all font-sans cursor-pointer shadow-sm active:scale-95 min-h-[38px]"
            title="Leave a heart or feedback note for Anuj"
          >
            <span>Crafted with</span>
            <Heart className="w-3.5 h-3.5 fill-rose-500 text-rose-400 animate-pulse" />
            <span>by Anuj Kumar • {globalHearts > 0 ? `${globalHearts.toLocaleString()} Hearts` : 'Send Love'} & Feedback</span>
          </button>
        </div>
      </footer>

      {/* Step-by-Step Card Flow (Rapid Setup Wizard) - Mounted BEFORE modals so all modals naturally layer on top */}
      {isSetupWizardOpen && (
        <SemesterSetupWizard
          isOpen={isSetupWizardOpen}
          onClose={handleCompleteWizard}
          courses={courses}
          results={calculation.courses}
          liveSgpa={calculation.sgpa}
          totalGradedCredits={calculation.totalGradedCredits}
          curveMode={curveMode}
          currentTrackId={currentTrackId}
          onSelectTrack={handleSelectTrack}
          onOpenTrackModal={() => setIsTrackModalOpen(true)}
          onCurveChange={setCurveMode}
          onOpenCutoffModal={() => setIsCutoffModalOpen(true)}
          onUpdateExternal={handleUpdateExternal}
          onUpdateDirectGrade={handleUpdateDirectGrade}
          onUpdateDirectInternal={handleUpdateDirectInternal}
          onUpdateComponentMarks={handleUpdateComponentMarks}
          onToggleCourseExcluded={handleToggleCourseExcluded}
          onQuickPreset={handleQuickPreset}
          onToggleAttendance={handleToggleAttendance}
          onClaimAllAttendance={handleClaimAllAttendance}
          onOpenEditCourse={(c) => setEditingCourse(c)}
          onConvertCourseMode={handleConvertCourseMode}
          globalCutoffs={globalCutoffs}
          onSaveCustomCutoffs={handleSaveCustomCutoffs}
          onOpenFeedback={() => setIsFeedbackOpen(true)}
          onComplete={handleCompleteWizard}
        />
      )}

      {/* Modals & Slide-over Inspectors */}
      {inspectedCourse && inspectedResult && (
        <CourseDetailModal
          course={inspectedCourse}
          result={inspectedResult}
          globalCutoffs={globalCutoffs}
          onClose={() => setInspectCourseId(null)}
          onUpdateComponentMarks={handleUpdateComponentMarks}
          onUpdateExternal={handleUpdateExternal}
          onUpdateDirectGrade={handleUpdateDirectGrade}
          onQuickPreset={handleQuickPreset}
          onSaveCustomCutoffs={handleSaveCustomCutoffs}
          onOpenEditCourse={(c) => setEditingCourse(c)}
          onConvertCourseMode={handleConvertCourseMode}
        />
      )}

      {isForecasterOpen && (
        <CgpaForecasterModal
          currentSgpa={calculation.sgpa}
          semesterCredits={calculation.totalGradedCredits}
          isOpen={isForecasterOpen}
          onClose={() => setIsForecasterOpen(false)}
          previousCgpa={cgpaPrefs.previousCgpa}
          previousCredits={cgpaPrefs.previousCredits}
          onSavePreferences={(cgpa, credits) => setCgpaPrefs({ previousCgpa: cgpa, previousCredits: credits })}
        />
      )}

      {isPasteModalOpen && (
        <CuimsSmartPasteModal
          courses={courses}
          isOpen={isPasteModalOpen}
          onClose={() => setIsPasteModalOpen(false)}
          onApplyParsedMarks={handleApplyParsedMarks}
        />
      )}

      {isExportModalOpen && (
        <ScorecardExportModal
          courses={courses}
          calc={calculation}
          cgpaForecast={cgpaForecast}
          isOpen={isExportModalOpen}
          onClose={() => setIsExportModalOpen(false)}
        />
      )}

      {isCutoffModalOpen && (
        <GradeCutoffModal
          isOpen={isCutoffModalOpen}
          onClose={() => setIsCutoffModalOpen(false)}
          curveMode={curveMode}
          onCurveChange={setCurveMode}
          currentCutoffs={globalCutoffs}
          onSaveCutoffs={(cutoffs) => {
            setGlobalCutoffs(cutoffs);
            setCurveMode('custom');
          }}
          courses={courses}
          calc={calculation}
        />
      )}

      {/* Cohort Track Preset Switcher Modal */}
      <CohortTrackModal
        isOpen={isTrackModalOpen}
        onClose={() => setIsTrackModalOpen(false)}
        currentTrackId={currentTrackId}
        onSelectTrack={handleSelectTrack}
        onOpenAddCustomCourse={() => setIsAddCustomCourseOpen(true)}
      />

      {/* Add Custom Course Modal */}
      <AddCustomCourseModal
        isOpen={isAddCustomCourseOpen}
        onClose={() => setIsAddCustomCourseOpen(false)}
        onAddCourse={handleAddCourse}
      />

      {/* Edit Course Modal (Name, Code, Credits, Evaluation Mode) */}
      <EditCourseModal
        course={editingCourse}
        isOpen={!!editingCourse}
        onClose={() => setEditingCourse(null)}
        onUpdateCourse={handleUpdateCourse}
        onDeleteCourse={handleDeleteCourse}
      />

      <CommandPalette
        isOpen={isCommandPaletteOpen}
        onClose={() => setIsCommandPaletteOpen(false)}
        courses={courses}
        onSelectCourse={(id) => setInspectCourseId(id)}
        onOpenForecaster={() => setIsForecasterOpen(true)}
        onOpenPasteModal={() => setIsPasteModalOpen(true)}
        onOpenExportModal={() => setIsExportModalOpen(true)}
        onOpenCutoffModal={() => setIsCutoffModalOpen(true)}
        onOpenWizard={handleOpenWizard}
        onOpenTrackModal={() => setIsTrackModalOpen(true)}
        onOpenAddCustomCourse={() => setIsAddCustomCourseOpen(true)}
        onClaimAllAttendance={handleClaimAllAttendance}
        onCurveChange={setCurveMode}
        onGlobalQuickPreset={handleGlobalQuickPreset}
        onStartBlank={handleStartBlank}
        onLoadSample={handleLoadSample}
        onToggleCourseExcluded={handleToggleCourseExcluded}
        curveMode={curveMode}
        isSimpleMode={!isDetailedView}
        onToggleSimpleMode={() => setIsDetailedView(prev => !prev)}
      />

      {/* Floating Bottom Mission Control Dock for Mobile Phones (displayed on dashboard) */}
      {!isSetupWizardOpen && (
        <MobileBottomNav
          calc={calculation}
          onOpenForecaster={() => setIsForecasterOpen(true)}
          onOpenPasteModal={() => setIsPasteModalOpen(true)}
          onOpenExportModal={() => setIsExportModalOpen(true)}
          onOpenCutoffModal={() => setIsCutoffModalOpen(true)}
          onOpenWizard={handleOpenWizard}
        />
      )}

      {/* Developer Love & Feedback Modal */}
      <FeedbackModal
        isOpen={isFeedbackOpen}
        onClose={() => setIsFeedbackOpen(false)}
        defaultSection={COHORT_TRACKS_INFO.find(t => t.id === currentTrackId)?.name || 'CU CSE 5th Sem'}
        globalHearts={globalHearts}
        onHeartsUpdated={(newTotal) => setGlobalHearts(newTotal)}
      />

    </div>
  );
};

export default App;
