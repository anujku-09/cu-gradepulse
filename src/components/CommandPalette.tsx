import React, { useState, useEffect, useMemo } from 'react';
import { 
  Search, 
  Sparkles, 
  TrendingUp, 
  ClipboardPaste, 
  Camera, 
  Layers, 
  RotateCcw, 
  Sliders, 
  ArrowRight,
  BookOpen,
  Check,
  HelpCircle,
  Eye,
  EyeOff,
  CheckCircle2,
  Trash2,
  SlidersHorizontal,
  X,
  Zap,
  CalendarCheck
} from 'lucide-react';
import { Course, CurveMode } from '../types';

interface CommandPaletteProps {
  isOpen: boolean;
  onClose: () => void;
  courses: Course[];
  onSelectCourse: (courseId: string) => void;
  onOpenOptimizer: () => void;
  onOpenForecaster: () => void;
  onOpenPasteModal: () => void;
  onOpenExportModal: () => void;
  onOpenCutoffModal: () => void;
  onOpenCommandPalette?: () => void;
  onOpenWizard?: () => void;
  onOpenTrackModal?: () => void;
  onOpenAddCustomCourse?: () => void;
  onClaimAllAttendance?: () => void;
  onToggleGlobalMng: () => void;
  onCurveChange: (mode: CurveMode) => void;
  onGlobalQuickPreset: (preset: 'full' | 'average' | 'reset') => void;
  onStartBlank?: () => void;
  onLoadSample?: () => void;
  onToggleCourseExcluded?: (courseId: string) => void;
  isGlobalMng?: boolean;
  curveMode?: CurveMode;
  isSimpleMode?: boolean;
  onToggleSimpleMode?: () => void;
}

export const CommandPalette: React.FC<CommandPaletteProps> = ({
  isOpen,
  onClose,
  courses,
  onSelectCourse,
  onOpenOptimizer,
  onOpenForecaster,
  onOpenPasteModal,
  onOpenExportModal,
  onOpenCutoffModal,
  onOpenWizard,
  onOpenTrackModal,
  onOpenAddCustomCourse,
  onClaimAllAttendance,
  onToggleGlobalMng,
  onCurveChange,
  onGlobalQuickPreset,
  onStartBlank,
  onLoadSample,
  onToggleCourseExcluded,
  isGlobalMng = true,
  curveMode = 'standard',
  isSimpleMode = false,
  onToggleSimpleMode,
}) => {
  const [query, setQuery] = useState('');
  const [selectedIndex, setSelectedIndex] = useState(0);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        if (isOpen) onClose();
      }
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  const commandItems = useMemo(() => {
    const actions = [
      {
        id: 'wizard',
        category: 'Guided Setup',
        title: 'Launch Step-by-Step Subject Card Flow (Wizard)',
        subtitle: 'Enter your 5th Sem marks card-by-card with smooth transitions',
        icon: <Zap className="w-4 h-4 text-cyan-400" />,
        run: () => onOpenWizard?.()
      },
      {
        id: 'track-switch',
        category: 'Section & Cohort',
        title: 'Choose 5th Sem Section / Track (Apple, AI/ML, Cloud, Cyber, General)',
        subtitle: 'Switch cohort electives (iOS Swift, Apple Lab, ML, etc.) preserving core marks',
        icon: <Layers className="w-4 h-4 text-cyan-400" />,
        run: () => onOpenTrackModal?.()
      },
      {
        id: 'add-subject',
        category: 'Section & Cohort',
        title: '+ Add Custom Subject to Semester V',
        subtitle: 'Configure custom subject name, code, credits & evaluation mode',
        icon: <Sliders className="w-4 h-4 text-indigo-400" />,
        run: () => onOpenAddCustomCourse?.()
      },
      {
        id: 'claim-att',
        category: 'Quick Action',
        title: 'Claim 100% Attendance for All Subjects',
        subtitle: 'Awards full attendance marks (>= 75% rule) for all courses',
        icon: <CalendarCheck className="w-4 h-4 text-emerald-400" />,
        run: () => onClaimAllAttendance?.()
      },
      {
        id: 'opt',
        category: 'Action',
        title: 'Open AI Target SGPA Reverse-Optimizer',
        subtitle: 'Calculate optimal external roadmap for your dream SGPA',
        icon: <Sparkles className="w-4 h-4 text-indigo-400" />,
        run: () => onOpenOptimizer()
      },
      {
        id: 'cgpa',
        category: 'Action',
        title: 'Open Cumulative CGPA Forecaster',
        subtitle: 'Project overall degree CGPA and net shift',
        icon: <TrendingUp className="w-4 h-4 text-emerald-400" />,
        run: () => onOpenForecaster()
      },
      {
        id: 'paste',
        category: 'Action',
        title: 'Open CUIMS Smart Paste Parser',
        subtitle: 'Paste copied table text from CUIMS portal to auto-fill marks',
        icon: <ClipboardPaste className="w-4 h-4 text-cyan-400" />,
        run: () => onOpenPasteModal()
      },
      {
        id: 'cutoffs-inspect',
        category: 'Action',
        title: 'Inspect & Customize Cutoff Matrix',
        subtitle: 'View or customize grade boundaries for relative grading',
        icon: <HelpCircle className="w-4 h-4 text-cyan-300" />,
        run: () => onOpenCutoffModal()
      },
      {
        id: 'export',
        category: 'Action',
        title: 'Export Scorecard Snapshot',
        subtitle: 'Generate high-res PNG / PDF summary card',
        icon: <Camera className="w-4 h-4 text-slate-300" />,
        run: () => onOpenExportModal()
      },
      {
        id: 'workspace-blank',
        category: 'Workspace',
        title: 'Clear / Start Blank Workspace',
        subtitle: 'Clear all marks to zero and enter fresh CUIMS scores',
        icon: <Trash2 className="w-4 h-4 text-rose-400" />,
        run: () => onStartBlank?.()
      },
      {
        id: 'workspace-sample',
        category: 'Workspace',
        title: 'Load Realistic Sample CSE Marks',
        subtitle: 'Populate realistic Chandigarh University semester scores',
        icon: <CheckCircle2 className="w-4 h-4 text-cyan-400" />,
        run: () => onLoadSample?.()
      },
      {
        id: 'view-mode',
        category: 'View',
        title: `Switch View Mode (Currently: ${isSimpleMode ? 'Simple Cards' : 'Detailed Studio'})`,
        subtitle: 'Toggle between clean minimal cards and detailed studio inspect mode',
        icon: isSimpleMode ? <Eye className="w-4 h-4 text-cyan-400" /> : <EyeOff className="w-4 h-4 text-slate-400" />,
        run: () => onToggleSimpleMode?.()
      },
      {
        id: 'mng-toggle',
        category: 'Setting',
        title: `Toggle Aptitude & Soft Skills MNG Track (Currently: ${isGlobalMng ? 'Non-Graded / 19 Cr' : 'Graded / 23 Cr'})`,
        subtitle: 'Switch between Non-Graded (MNG Pass/Fail) and Graded SGPA mode',
        icon: <Layers className="w-4 h-4 text-indigo-400" />,
        run: () => onToggleGlobalMng()
      },
      {
        id: 'curve-std',
        category: 'Grading Curve',
        title: 'Set Relative Curve: Standard CU CSE Reality (A+ ≥ 95, A ≥ 88)',
        subtitle: 'Realistic Chandigarh University CSE section distribution',
        icon: <Sliders className="w-4 h-4 text-cyan-400" />,
        run: () => onCurveChange('standard')
      },
      {
        id: 'curve-strict',
        category: 'Grading Curve',
        title: 'Set Relative Curve: High Competition / Strict (A+ ≥ 96, A ≥ 90)',
        subtitle: 'High score cohort competition distribution',
        icon: <Sliders className="w-4 h-4 text-rose-400" />,
        run: () => onCurveChange('strict')
      },
      {
        id: 'curve-lenient',
        category: 'Grading Curve',
        title: 'Set Relative Curve: Tough Exam Paper / Relaxed (A+ ≥ 91, A ≥ 84)',
        subtitle: 'Lower cutoffs for difficult end-term examinations',
        icon: <Sliders className="w-4 h-4 text-amber-400" />,
        run: () => onCurveChange('lenient')
      },
      {
        id: 'preset-full',
        category: 'Preset',
        title: 'Auto-fill All Courses: 100% Full Marks',
        subtitle: 'Simulate max internal marks across all courses',
        icon: <Check className="w-4 h-4 text-emerald-400" />,
        run: () => onGlobalQuickPreset('full')
      },
      {
        id: 'preset-avg',
        category: 'Preset',
        title: 'Auto-fill All Courses: 75% Average Marks',
        subtitle: 'Simulate typical class average benchmark (75%)',
        icon: <RotateCcw className="w-4 h-4 text-cyan-400" />,
        run: () => onGlobalQuickPreset('average')
      },
      {
        id: 'preset-reset',
        category: 'Preset',
        title: 'Reset All Course Marks to Zero',
        subtitle: 'Reset internals and external targets to 0',
        icon: <RotateCcw className="w-4 h-4 text-rose-400" />,
        run: () => onGlobalQuickPreset('reset')
      },
    ];

    // Exclude / Include Toggles for each course
    const excludeItems = courses.map(c => ({
      id: `exclude-${c.id}`,
      category: 'Allow/Disallow Subject',
      title: `${c.isExcluded ? 'Include (Allow)' : 'Exclude (Disallow)'} ${c.code}: ${c.name}`,
      subtitle: c.isExcluded ? 'Currently EXCLUDED from calculation • Click to include back' : 'Currently ACTIVE in calculation • Click to remove from SGPA',
      icon: <SlidersHorizontal className={`w-4 h-4 ${c.isExcluded ? 'text-amber-400' : 'text-slate-400'}`} />,
      run: () => onToggleCourseExcluded?.(c.id)
    }));

    // Course Navigation Jumps
    const courseItems = courses.map(c => ({
      id: `course-${c.id}`,
      category: 'Course Jump',
      title: `${c.code}: ${c.name}${c.isExcluded ? ' (EXCLUDED)' : ''}`,
      subtitle: `${c.credits} Credits • ${c.type}${c.isNonGraded ? ' • Non-Graded (MNG)' : ''} • Click to inspect details`,
      icon: <BookOpen className={`w-4 h-4 ${c.isExcluded ? 'text-slate-500' : 'text-cyan-400'}`} />,
      run: () => onSelectCourse(c.id)
    }));

    return [...actions, ...excludeItems, ...courseItems];
  }, [
    courses, 
    onOpenOptimizer, 
    onOpenForecaster, 
    onOpenPasteModal, 
    onOpenExportModal, 
    onOpenCutoffModal,
    onOpenWizard,
    onClaimAllAttendance,
    onToggleGlobalMng, 
    onCurveChange, 
    onGlobalQuickPreset, 
    onSelectCourse,
    onStartBlank,
    onLoadSample,
    onToggleCourseExcluded,
    onToggleSimpleMode,
    isGlobalMng,
    curveMode,
    isSimpleMode
  ]);

  const filtered = useMemo(() => {
    if (!query.trim()) return commandItems;
    const q = query.toLowerCase();
    return commandItems.filter(item => 
      item.title.toLowerCase().includes(q) || 
      item.subtitle.toLowerCase().includes(q) ||
      item.category.toLowerCase().includes(q)
    );
  }, [commandItems, query]);

  useEffect(() => {
    setSelectedIndex(0);
  }, [query]);

  const handleSelect = (item: typeof commandItems[0]) => {
    item.run();
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[80] overflow-y-auto bg-obsidian-950/80 backdrop-blur-md flex items-start justify-center pt-10 sm:pt-20 p-3 sm:p-4 animate-fadeIn">
      <div className="relative w-full max-w-xl bg-obsidian-900 border border-white/15 rounded-2xl shadow-2xl overflow-hidden">
        
        {/* Search Input Bar */}
        <div className="flex items-center px-3 sm:px-4 py-3 border-b border-white/10 gap-2 sm:gap-3">
          <Search className="w-5 h-5 text-slate-400 flex-shrink-0" />
          <input
            type="text"
            autoFocus
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'ArrowDown') {
                e.preventDefault();
                setSelectedIndex(prev => (prev + 1) % filtered.length);
              } else if (e.key === 'ArrowUp') {
                e.preventDefault();
                setSelectedIndex(prev => (prev - 1 + filtered.length) % filtered.length);
              } else if (e.key === 'Enter' && filtered[selectedIndex]) {
                e.preventDefault();
                handleSelect(filtered[selectedIndex]);
              }
            }}
            placeholder="Search commands or courses (e.g. 'Optimizer', 'MNG')..."
            className="w-full bg-transparent text-sm text-white placeholder:text-slate-500 focus:outline-none font-medium min-w-0"
          />
          <kbd className="hidden sm:inline-block px-1.5 py-0.5 rounded bg-obsidian-800 text-[10px] font-mono text-slate-400 border border-white/10 flex-shrink-0">
            ESC
          </kbd>
          <button
            onClick={onClose}
            className="sm:hidden p-1 rounded-lg text-slate-400 hover:text-white hover:bg-white/5 transition-colors flex-shrink-0"
            title="Close command palette"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Command List */}
        <div className="max-h-[340px] overflow-y-auto p-2 space-y-1">
          {filtered.length === 0 ? (
            <div className="p-4 text-center text-xs text-slate-500">
              No matching commands or courses found.
            </div>
          ) : (
            filtered.map((item, idx) => {
              const isSelected = idx === selectedIndex;
              return (
                <div
                  key={item.id}
                  onClick={() => handleSelect(item)}
                  onMouseEnter={() => setSelectedIndex(idx)}
                  className={`p-2.5 rounded-xl cursor-pointer flex items-center justify-between transition-all ${
                    isSelected ? 'bg-cyan-950/60 border border-cyan-500/40 text-white' : 'hover:bg-white/5 text-slate-300'
                  }`}
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <div className="p-1.5 rounded-lg bg-obsidian-850 border border-white/5 flex-shrink-0">
                      {item.icon}
                    </div>
                    <div className="min-w-0">
                      <div className="text-xs font-semibold flex items-center gap-2 truncate">
                        <span>{item.title}</span>
                        <span className="text-[10px] font-mono text-slate-400 px-1 py-0.2 rounded bg-white/[0.04]">
                          {item.category}
                        </span>
                      </div>
                      <div className="text-[11px] text-slate-400 truncate mt-0.5">
                        {item.subtitle}
                      </div>
                    </div>
                  </div>

                  <ArrowRight className={`w-3.5 h-3.5 flex-shrink-0 ${isSelected ? 'text-cyan-400' : 'text-slate-600'}`} />
                </div>
              );
            })
          )}
        </div>

        {/* Footer shortcuts hint */}
        <div className="px-3 sm:px-4 py-2 border-t border-white/10 bg-obsidian-950 flex items-center justify-between text-[11px] font-mono text-slate-500">
          <div className="hidden sm:flex items-center gap-3">
            <span>↑↓ Navigate</span>
            <span>↵ Select</span>
            <span>ESC Close</span>
          </div>
          <span className="sm:hidden text-[10px]">Tap any action to execute</span>
          <span className="text-[10px] sm:text-[11px]">CU GradePulse</span>
        </div>

      </div>
    </div>
  );
};
