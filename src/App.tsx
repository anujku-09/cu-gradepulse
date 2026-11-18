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
  X
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
import { TargetOptimizerModal } from './components/TargetOptimizerModal';
import { CgpaForecasterModal } from './components/CgpaForecasterModal';
import { CuimsSmartPasteModal } from './components/CuimsSmartPasteModal';
import { ScorecardExportModal } from './components/ScorecardExportModal';
import { GradeCutoffModal } from './components/GradeCutoffModal';
import { CommandPalette } from './components/CommandPalette';
import { MobileBottomNav } from './components/MobileBottomNav';
import { SemesterSetupWizard } from './components/SemesterSetupWizard';
import { CohortTrackModal } from './components/CohortTrackModal';
import { AddCustomCourseModal } from './components/AddCustomCourseModal';
import { EditCourseModal } from './components/EditCourseModal';

const STORAGE_KEY_COURSES = 'cuims_gradepulse_courses_v3';
const STORAGE_KEY_CGPA = 'cuims_gradepulse_cgpa_v3';
const STORAGE_KEY_CURVE = 'cuims_gradepulse_curve_v3';
const STORAGE_KEY_VIEW = 'cuims_gradepulse_view_v3';
const STORAGE_KEY_TRACK = 'cuims_gradepulse_track_v3';

export const App: React.FC = () => {
  // 1. Course State (Persisted in localStorage, defaults to clean slate)
  const [courses, setCourses] = useState<Course[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY_COURSES);
      if (saved) return JSON.parse(saved);
    } catch (e) {
      console.error(e);
    }
    return INITIAL_BLANK_COURSES;
  });

  // Track State (Apple Section, General CSE, AI/ML, Cloud, Cyber, etc.)
  const [currentTrackId, setCurrentTrackId] = useState<CohortTrackId>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY_TRACK);
      if (saved) return saved as CohortTrackId;
    } catch (e) {}
    return detectTrackFromCourses(courses);
  });

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY_TRACK, currentTrackId);
    } catch (e) {}
  }, [currentTrackId]);

  // 2. View Mode (Simple vs Detailed)
  const [isDetailedView, setIsDetailedView] = useState<boolean>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY_VIEW);
      if (saved) return JSON.parse(saved);
    } catch (e) {}
    return false; // Default to clean Simple view
  });

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY_VIEW, JSON.stringify(isDetailedView));
    } catch (e) {}
  }, [isDetailedView]);

  // 3. Global Curve Mode & Cutoffs
  const [curveMode, setCurveMode] = useState<CurveMode>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY_CURVE);
      if (saved) return JSON.parse(saved);
    } catch (e) {}
    return 'standard';
  });

  const [globalCutoffs, setGlobalCutoffs] = useState<GradeCutoffs>(CURVE_PRESETS.standard);

  useEffect(() => {
    if (curveMode !== 'custom') {
      setGlobalCutoffs(CURVE_PRESETS[curveMode]);
    }
    localStorage.setItem(STORAGE_KEY_CURVE, JSON.stringify(curveMode));
  }, [curveMode]);

  // 4. CGPA Forecaster Preferences (Previous CGPA & Credits)
  const [cgpaPrefs, setCgpaPrefs] = useState<{ previousCgpa: number; previousCredits: number }>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY_CGPA);
      if (saved) return JSON.parse(saved);
    } catch (e) {}
    return { previousCgpa: 8.25, previousCredits: 76.0 };
  });

  // Auto-save courses to localStorage
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY_COURSES, JSON.stringify(courses));
    } catch (e) {}
  }, [courses]);

  // Save CGPA prefs to localStorage
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY_CGPA, JSON.stringify(cgpaPrefs));
    } catch (e) {}
  }, [cgpaPrefs]);

  // 5. Modal Dialog States
  const [inspectCourseId, setInspectCourseId] = useState<string | null>(null);
  const [isOptimizerOpen, setIsOptimizerOpen] = useState(false);
  const [isForecasterOpen, setIsForecasterOpen] = useState(false);
  const [isPasteModalOpen, setIsPasteModalOpen] = useState(false);
  const [isExportModalOpen, setIsExportModalOpen] = useState(false);
  const [isCutoffModalOpen, setIsCutoffModalOpen] = useState(false);
  const [isCommandPaletteOpen, setIsCommandPaletteOpen] = useState(false);
  const [isTrackModalOpen, setIsTrackModalOpen] = useState(false);
  const [isAddCustomCourseOpen, setIsAddCustomCourseOpen] = useState(false);
  const [editingCourse, setEditingCourse] = useState<Course | null>(null);
  const [isSetupWizardOpen, setIsSetupWizardOpen] = useState<boolean>(() => {
    try {
      const completed = localStorage.getItem('cu_gradepulse_wizard_completed');
      return !completed;
    } catch (e) {
      return false;
    }
  });
  const [showFlightPlanBanner, setShowFlightPlanBanner] = useState(false);

  // 6. Filter Tab: All, Core Marks (A), Direct (B), Dual-Mode (C)
  const [filterGroup, setFilterGroup] = useState<'ALL' | 'A' | 'B' | 'C'>('ALL');
  const [searchQuery, setSearchQuery] = useState('');

  // 7. Global MNG State: checks if both Soft Skills & Aptitude are non-graded
  const isGlobalMng = useMemo(() => {
    const dualCourses = courses.filter(c => c.group === 'C');
    return dualCourses.every(c => c.isNonGraded);
  }, [courses]);

  // 8. Core Calculations
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

  const handleToggleGlobalMng = useCallback(() => {
    const nextState = !isGlobalMng;
    setCourses(prev => prev.map(c => {
      if (c.group === 'C') {
        return { ...c, isNonGraded: nextState };
      }
      return c;
    }));
  }, [isGlobalMng]);

  const handleToggleCourseMng = useCallback((courseId: string) => {
    setCourses(prev => prev.map(c => {
      if (c.id === courseId) {
        return { ...c, isNonGraded: !c.isNonGraded };
      }
      return c;
    }));
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

  const handleApplyOptimizerStrategy = useCallback((roadmap: { courseId: string; targetExternal: number; targetGrade?: GradeLevel }[]) => {
    const lookup = new Map(roadmap.map(r => [r.courseId, r]));
    setCourses(prev => prev.map(c => {
      const match = lookup.get(c.id);
      if (match) {
        if (c.type === 'DirectGrade' && match.targetGrade) {
          return { ...c, directGrade: match.targetGrade };
        }
        return { ...c, externalTargetScore: match.targetExternal };
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

  const handleConvertCourseMode = useCallback((courseId: string, targetType: 'Theory' | 'Practical' | 'DirectGrade') => {
    setCourses(prev => prev.map(c => {
      if (c.id !== courseId) return c;
      return convertCourseMode(c, targetType);
    }));
  }, []);

  const handleCompleteWizard = useCallback(() => {
    setIsSetupWizardOpen(false);
    setShowFlightPlanBanner(true);
    try {
      localStorage.setItem('cu_gradepulse_wizard_completed', 'true');
    } catch (e) {}
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
        isGlobalMng={isGlobalMng}
        onToggleGlobalMng={handleToggleGlobalMng}
        currentTrackId={currentTrackId}
        onOpenTrackModal={() => setIsTrackModalOpen(true)}
        onOpenAddCustomCourse={() => setIsAddCustomCourseOpen(true)}
        onOpenOptimizer={() => setIsOptimizerOpen(true)}
        onOpenForecaster={() => setIsForecasterOpen(true)}
        onOpenPasteModal={() => setIsPasteModalOpen(true)}
        onOpenExportModal={() => setIsExportModalOpen(true)}
        onOpenCutoffModal={() => setIsCutoffModalOpen(true)}
        onOpenCommandPalette={() => setIsCommandPaletteOpen(true)}
        onOpenWizard={handleOpenWizard}
        onResetAll={handleResetAll}
      />

      {/* Main Content Hub */}
      <main className="flex-1 max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 py-4 sm:py-6 w-full relative z-10 pb-20 sm:pb-8">
        
        {/* Welcome / Arrival Banner after Completing Setup Flow */}
        {showFlightPlanBanner && (
          <div className="mb-6 p-4 rounded-2xl bg-gradient-to-r from-cyan-950/70 via-indigo-950/70 to-obsidian-900 border border-cyan-500/40 shadow-[0_0_25px_rgba(6,182,212,0.25)] flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 animate-fadeIn">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-cyan-500/20 border border-cyan-500/40 flex items-center justify-center text-cyan-300 shadow-[0_0_15px_rgba(6,182,212,0.3)] flex-shrink-0">
                <Sparkles className="w-5 h-5 text-cyan-400" />
              </div>
              <div>
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
                onClick={handleOpenWizard}
                className="px-3 py-1.5 rounded-xl bg-obsidian-850 hover:bg-obsidian-800 text-xs font-semibold text-slate-300 border border-white/10 transition-colors"
              >
                Reopen Card Deck
              </button>
              <button
                onClick={() => setShowFlightPlanBanner(false)}
                className="p-1.5 rounded-xl bg-white/5 hover:bg-white/10 text-slate-400 hover:text-white transition-colors"
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
          isGlobalMng={isGlobalMng}
          onOpenForecaster={() => setIsForecasterOpen(true)}
          onOpenOptimizer={() => setIsOptimizerOpen(true)}
          onToggleMng={handleToggleGlobalMng}
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
        <div className="mb-4 p-3 rounded-2xl bg-obsidian-850/60 border border-white/10 flex flex-col sm:flex-row sm:items-center justify-between gap-2.5">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="text-xs text-slate-400 font-medium">Cohort / Section:</span>
            <button
              onClick={() => setIsTrackModalOpen(true)}
              className="flex items-center gap-1.5 px-3 py-1 rounded-xl bg-cyan-950/70 hover:bg-cyan-900/70 border border-cyan-500/40 text-cyan-300 text-xs font-semibold shadow-[0_0_12px_rgba(6,182,212,0.2)] transition-all"
            >
              <span>{COHORT_TRACKS_INFO.find(t => t.id === currentTrackId)?.icon || '🌐'}</span>
              <span>{COHORT_TRACKS_INFO.find(t => t.id === currentTrackId)?.name || 'General CSE'}</span>
              <span className="text-[10px] text-cyan-400 font-mono">(Switch)</span>
            </button>
            <span className="text-[11px] text-slate-400 hidden md:inline truncate max-w-sm">
              • {COHORT_TRACKS_INFO.find(t => t.id === currentTrackId)?.electiveHighlight}
            </span>
          </div>

          <div className="flex items-center gap-2 self-end sm:self-auto">
            <button
              onClick={() => setIsAddCustomCourseOpen(true)}
              className="px-3 py-1.5 rounded-xl bg-gradient-to-r from-indigo-900/50 to-violet-900/50 hover:from-indigo-800/60 hover:to-violet-800/60 text-indigo-200 border border-indigo-500/30 text-xs font-semibold flex items-center gap-1.5 transition-all shadow-[0_0_10px_rgba(99,102,241,0.15)]"
            >
              <Plus className="w-3.5 h-3.5 text-indigo-400" />
              <span>+ Add Custom Subject</span>
            </button>
          </div>
        </div>

        {/* Section Header & Bento Filters */}
        <div id="course-matrix" className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 sm:gap-4 mb-5 scroll-mt-20">
          <div className="flex items-center gap-2 flex-wrap">
            <h2 className="text-lg sm:text-xl font-extrabold tracking-tight text-white flex items-center gap-2">
              <Grid className="w-4 h-4 sm:w-5 sm:h-5 text-cyan-400" />
              Semester V Course Matrix
            </h2>
            <span className="text-[11px] sm:text-xs font-mono text-slate-400 px-2 py-0.5 rounded-full bg-white/[0.04] border border-white/5">
              {courses.filter(c => !c.isExcluded).length} of {courses.length} Contributing
            </span>
            {courses.some(c => c.isExcluded) && (
              <button
                onClick={handleIncludeAllCourses}
                className="text-xs font-mono text-cyan-400 hover:text-cyan-300 underline"
                title="Re-include all excluded subjects"
              >
                (Include All)
              </button>
            )}
          </div>

          {/* Group Filter Tabs & Search */}
          <div className="flex items-center gap-2 w-full sm:w-auto">
            {/* Search filter input */}
            <div className="relative flex-1 sm:flex-none">
              <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Filter subjects..."
                className="pl-8 pr-3 py-1 rounded-lg bg-obsidian-850 border border-white/10 text-xs text-slate-200 placeholder:text-slate-500 focus:outline-none focus:border-cyan-500 w-full sm:w-40 font-sans"
              />
            </div>

            {/* Filter Pills with Horizontal Touch-Scroll on mobile */}
            <div className="flex items-center glass-pill p-1 rounded-xl text-xs font-medium overflow-x-auto no-scrollbar flex-shrink-0">
              <button
                onClick={() => setFilterGroup('ALL')}
                className={`px-2.5 py-1 rounded-lg transition-all whitespace-nowrap ${
                  filterGroup === 'ALL' ? 'bg-cyan-950 text-cyan-300 font-semibold border border-cyan-700/50' : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                All ({courses.length})
              </button>
              <button
                onClick={() => setFilterGroup('A')}
                className={`px-2.5 py-1 rounded-lg transition-all whitespace-nowrap ${
                  filterGroup === 'A' ? 'bg-cyan-950 text-cyan-300 font-semibold border border-cyan-700/50' : 'text-slate-400 hover:text-slate-200'
                }`}
                title="Group A: Marks-Based Courses"
              >
                Core ({courses.filter(c => c.group === 'A').length})
              </button>
              <button
                onClick={() => setFilterGroup('B')}
                className={`px-2.5 py-1 rounded-lg transition-all whitespace-nowrap ${
                  filterGroup === 'B' ? 'bg-cyan-950 text-cyan-300 font-semibold border border-cyan-700/50' : 'text-slate-400 hover:text-slate-200'
                }`}
                title="Group B: Direct Grade Elective (NPTEL / MOOC)"
              >
                Direct ({courses.filter(c => c.group === 'B').length})
              </button>
              <button
                onClick={() => setFilterGroup('C')}
                className={`px-2.5 py-1 rounded-lg transition-all whitespace-nowrap ${
                  filterGroup === 'C' ? 'bg-cyan-950 text-cyan-300 font-semibold border border-cyan-700/50' : 'text-slate-400 hover:text-slate-200'
                }`}
                title="Group C: Soft Skills & Aptitude (Dual-Mode)"
              >
                Dual ({courses.filter(c => c.group === 'C').length})
              </button>
            </div>
          </div>
        </div>

        {/* Course Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
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
              onToggleCourseMng={handleToggleCourseMng}
              onToggleCourseExcluded={handleToggleCourseExcluded}
              onQuickPreset={handleQuickPreset}
              onInspect={(id) => setInspectCourseId(id)}
              onOpenEditCourse={(c) => setEditingCourse(c)}
              onConvertCourseMode={handleConvertCourseMode}
            />
          ))}
        </div>

        {/* Bottom Quick Help & CUIMS Insights Callout */}
        <div className="mt-12 p-6 rounded-2xl glass-card border border-white/10 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div className="space-y-1">
            <h4 className="text-sm font-bold text-slate-100 flex items-center gap-2">
              <Zap className="w-4 h-4 text-cyan-400" />
              Chandigarh University Weightage Formula Guarantee
            </h4>
            <p className="text-xs text-slate-400 leading-relaxed max-w-2xl">
              Internal marks scale using <code className="text-cyan-300 font-mono">Weighted_Score = (Raw_Obtained / Raw_Max) * Weightage</code>. In CSE Semester V, 4-credit Probability & Statistics and 3-credit courses drive over 70% of your SGPA weight. Keep external targets aligned with the live tick-marks on each course slider.
            </p>
          </div>

          <div className="flex items-center gap-2 flex-shrink-0">
            <button
              onClick={() => setIsPasteModalOpen(true)}
              className="px-3.5 py-2 rounded-xl bg-obsidian-850 hover:bg-obsidian-800 text-xs font-semibold text-slate-200 border border-white/10 transition-colors"
            >
              Parse CUIMS Text
            </button>
            <button
              onClick={() => setIsOptimizerOpen(true)}
              className="px-4 py-2 rounded-xl bg-cyan-600 hover:bg-cyan-500 text-xs font-bold text-white shadow-[0_0_15px_rgba(6,182,212,0.3)] transition-colors"
            >
              AI Target SGPA Engine →
            </button>
          </div>
        </div>

      </main>

      {/* Footer */}
      <footer className="border-t border-white/[0.08] bg-obsidian-950 py-6 text-center text-xs text-slate-500 font-mono relative z-10">
        <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-2">
          <span>CU GradePulse • Chandigarh University (CSE) Academic Intelligence Workspace</span>
          <span>Crafted with Deep Obsidian Spatial Glassmorphism</span>
        </div>
      </footer>

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

      {isOptimizerOpen && (
        <TargetOptimizerModal
          courses={courses}
          globalCutoffs={globalCutoffs}
          currentSgpa={calculation.sgpa}
          isOpen={isOptimizerOpen}
          onClose={() => setIsOptimizerOpen(false)}
          onApplyStrategy={handleApplyOptimizerStrategy}
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
        onOpenOptimizer={() => setIsOptimizerOpen(true)}
        onOpenForecaster={() => setIsForecasterOpen(true)}
        onOpenPasteModal={() => setIsPasteModalOpen(true)}
        onOpenExportModal={() => setIsExportModalOpen(true)}
        onOpenCutoffModal={() => setIsCutoffModalOpen(true)}
        onOpenWizard={handleOpenWizard}
        onOpenTrackModal={() => setIsTrackModalOpen(true)}
        onOpenAddCustomCourse={() => setIsAddCustomCourseOpen(true)}
        onClaimAllAttendance={handleClaimAllAttendance}
        onToggleGlobalMng={handleToggleGlobalMng}
        onCurveChange={setCurveMode}
        onGlobalQuickPreset={handleGlobalQuickPreset}
        onStartBlank={handleStartBlank}
        onLoadSample={handleLoadSample}
        onToggleCourseExcluded={handleToggleCourseExcluded}
        isGlobalMng={isGlobalMng}
        curveMode={curveMode}
        isSimpleMode={!isDetailedView}
        onToggleSimpleMode={() => setIsDetailedView(prev => !prev)}
      />

      {/* Step-by-Step Card Flow (Rapid Setup Wizard) */}
      {isSetupWizardOpen && (
        <SemesterSetupWizard
          isOpen={isSetupWizardOpen}
          onClose={handleCompleteWizard}
          courses={courses}
          results={calculation.courses}
          liveSgpa={calculation.sgpa}
          totalGradedCredits={calculation.totalGradedCredits}
          isGlobalMng={isGlobalMng}
          curveMode={curveMode}
          currentTrackId={currentTrackId}
          onSelectTrack={handleSelectTrack}
          onOpenTrackModal={() => setIsTrackModalOpen(true)}
          onCurveChange={setCurveMode}
          onOpenCutoffModal={() => setIsCutoffModalOpen(true)}
          onToggleGlobalMng={handleToggleGlobalMng}
          onUpdateExternal={handleUpdateExternal}
          onUpdateDirectGrade={handleUpdateDirectGrade}
          onUpdateDirectInternal={handleUpdateDirectInternal}
          onUpdateComponentMarks={handleUpdateComponentMarks}
          onToggleCourseMng={handleToggleCourseMng}
          onToggleCourseExcluded={handleToggleCourseExcluded}
          onQuickPreset={handleQuickPreset}
          onToggleAttendance={handleToggleAttendance}
          onClaimAllAttendance={handleClaimAllAttendance}
          onOpenEditCourse={(c) => setEditingCourse(c)}
          onConvertCourseMode={handleConvertCourseMode}
          onComplete={handleCompleteWizard}
        />
      )}

      {/* Floating Bottom Mission Control Dock for Mobile Phones */}
      <MobileBottomNav
        calc={calculation}
        onOpenOptimizer={() => setIsOptimizerOpen(true)}
        onOpenForecaster={() => setIsForecasterOpen(true)}
        onOpenPasteModal={() => setIsPasteModalOpen(true)}
        onOpenExportModal={() => setIsExportModalOpen(true)}
        onOpenCutoffModal={() => setIsCutoffModalOpen(true)}
        onOpenWizard={handleOpenWizard}
      />

    </div>
  );
};

export default App;
