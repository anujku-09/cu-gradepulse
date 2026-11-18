import React, { useState, useMemo } from 'react';
import { 
  X, 
  Plus, 
  Sparkles, 
  BookOpen, 
  Layers, 
  Check, 
  AlertCircle,
  Award,
  Sliders
} from 'lucide-react';
import { Course, CourseType } from '../types';
import { createNewBlankCourse, detectAssessmentSchemeFromCode } from '../data/courses';

interface AddCustomCourseModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAddCourse: (newCourse: Course) => void;
}

export const AddCustomCourseModal: React.FC<AddCustomCourseModalProps> = ({
  isOpen,
  onClose,
  onAddCourse,
}) => {
  if (!isOpen) return null;

  const [name, setName] = useState('');
  const [code, setCode] = useState('');
  const [credits, setCredits] = useState<number>(3.0);
  const [type, setType] = useState<CourseType>('Theory');
  const [isNonGraded, setIsNonGraded] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Auto-detect assessment scheme from code & name
  const detectedType = useMemo(() => {
    return detectAssessmentSchemeFromCode(code, name);
  }, [code, name]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) {
      setError('Please provide a subject name.');
      return;
    }
    if (!code.trim()) {
      setError('Please enter a course code (e.g. 24CSH-352 or ELEC-1).');
      return;
    }
    if (credits <= 0 || credits > 8) {
      setError('Credits must be between 1.0 and 8.0.');
      return;
    }

    const course = createNewBlankCourse(name, code, credits, type, isNonGraded);
    onAddCourse(course);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-[70] overflow-y-auto bg-obsidian-950/80 backdrop-blur-md flex items-center justify-center p-3 sm:p-4 animate-fadeIn">
      <div 
        className="relative w-full max-w-lg bg-obsidian-900 border border-white/10 rounded-2xl sm:rounded-3xl shadow-[0_0_50px_rgba(0,0,0,0.8)] overflow-hidden flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Top Header */}
        <div className="flex items-center justify-between px-5 sm:px-6 py-4 border-b border-white/10 bg-obsidian-850/90 relative z-10">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-cyan-500/20 border border-cyan-500/40 flex items-center justify-center text-cyan-300 shadow-[0_0_15px_rgba(6,182,212,0.3)]">
              <Plus className="w-5 h-5 text-cyan-400" />
            </div>
            <div>
              <h2 className="text-base sm:text-lg font-bold text-white">
                Add Custom Subject
              </h2>
              <p className="text-xs text-slate-400">
                Universal custom course for special sections, electives, or honors.
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-xl bg-white/5 hover:bg-white/10 text-slate-400 hover:text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-5 sm:p-6 space-y-4">
          {error && (
            <div className="p-3 rounded-xl bg-rose-950/50 border border-rose-500/40 text-rose-300 text-xs flex items-center gap-2">
              <AlertCircle className="w-4 h-4 flex-shrink-0 text-rose-400" />
              <span>{error}</span>
            </div>
          )}

          {/* Smart Suggestion Banner */}
          {detectedType !== type && (code.trim() || name.trim()) && (
            <div className="p-2.5 rounded-xl bg-indigo-950/40 border border-indigo-500/30 flex items-center justify-between gap-2 animate-fadeIn">
              <div className="flex items-center gap-2 text-xs text-indigo-200">
                <Sparkles className="w-4 h-4 text-cyan-400 flex-shrink-0" />
                <span>
                  Code suggests: <strong>{
                    detectedType === 'ContinuousEvaluation' ? '100% Continuous Internal' :
                    detectedType === 'Hybrid' ? 'Hybrid PBL (70/30)' :
                    detectedType === 'Practical' ? 'Practical Lab (60/40)' :
                    detectedType === 'DirectGrade' ? 'Direct Grade NPTEL' : 'Theory (40/60)'
                  }</strong>
                </span>
              </div>
              <button
                type="button"
                onClick={() => setType(detectedType)}
                className="px-2.5 py-1 rounded-lg bg-indigo-500/25 hover:bg-indigo-500/40 text-cyan-300 text-[11px] font-bold border border-indigo-500/40 transition-colors whitespace-nowrap"
              >
                Apply
              </button>
            </div>
          )}

          {/* Subject Name */}
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1.5">
              Subject Name *
            </label>
            <input
              type="text"
              placeholder="e.g. iOS Application Development with Swift"
              value={name}
              onChange={(e) => {
                setName(e.target.value);
                setError(null);
              }}
              className="w-full px-3.5 py-2.5 rounded-xl bg-obsidian-850 border border-white/10 text-white text-sm focus:border-cyan-500 focus:outline-none focus:ring-1 focus:ring-cyan-500"
              required
            />
          </div>

          {/* Course Code & Credits */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                Course Code *
              </label>
              <input
                type="text"
                placeholder="e.g. 24CSH-352"
                value={code}
                onChange={(e) => {
                  setCode(e.target.value);
                  setError(null);
                }}
                className="w-full px-3.5 py-2.5 rounded-xl bg-obsidian-850 border border-white/10 text-white font-mono text-sm focus:border-cyan-500 focus:outline-none uppercase"
                required
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                Credits *
              </label>
              <select
                value={credits}
                onChange={(e) => setCredits(parseFloat(e.target.value))}
                className="w-full px-3.5 py-2.5 rounded-xl bg-obsidian-850 border border-white/10 text-white font-mono text-sm focus:border-cyan-500 focus:outline-none cursor-pointer"
              >
                <option value={1.0}>1.0 Credit (Lab / FSD)</option>
                <option value={2.0}>2.0 Credits (CC / Aptitude)</option>
                <option value={3.0}>3.0 Credits (Standard Elective / PBL)</option>
                <option value={4.0}>4.0 Credits (P&S / Core Theory)</option>
                <option value={5.0}>5.0 Credits</option>
              </select>
            </div>
          </div>

          {/* Evaluation Type (All 5 CU schemes) */}
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-2">
              Evaluation & Assessment Type
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
              <button
                type="button"
                onClick={() => setType('Theory')}
                className={`p-2.5 rounded-xl border text-left flex flex-col justify-between transition-all ${
                  type === 'Theory'
                    ? 'bg-cyan-950/60 border-cyan-500 text-white shadow-[0_0_15px_rgba(6,182,212,0.2)]'
                    : 'bg-obsidian-850 border-white/10 text-slate-300 hover:border-white/20'
                }`}
              >
                <span className="text-xs font-bold flex items-center justify-between">
                  Theory (40/60)
                  {type === 'Theory' && <Check className="w-3.5 h-3.5 text-cyan-400" />}
                </span>
                <span className="text-[10px] text-slate-400 mt-1">
                  40 Int / 60 End-Term Exam
                </span>
              </button>

              <button
                type="button"
                onClick={() => setType('Practical')}
                className={`p-2.5 rounded-xl border text-left flex flex-col justify-between transition-all ${
                  type === 'Practical'
                    ? 'bg-cyan-950/60 border-cyan-500 text-white shadow-[0_0_15px_rgba(6,182,212,0.2)]'
                    : 'bg-obsidian-850 border-white/10 text-slate-300 hover:border-white/20'
                }`}
              >
                <span className="text-xs font-bold flex items-center justify-between">
                  Practical (60/40)
                  {type === 'Practical' && <Check className="w-3.5 h-3.5 text-cyan-400" />}
                </span>
                <span className="text-[10px] text-slate-400 mt-1">
                  60 Lab / 40 External Viva
                </span>
              </button>

              <button
                type="button"
                onClick={() => setType('Hybrid')}
                className={`p-2.5 rounded-xl border text-left flex flex-col justify-between transition-all ${
                  type === 'Hybrid'
                    ? 'bg-cyan-950/60 border-cyan-500 text-white shadow-[0_0_15px_rgba(6,182,212,0.2)]'
                    : 'bg-obsidian-850 border-white/10 text-slate-300 hover:border-white/20'
                }`}
              >
                <span className="text-xs font-bold flex items-center justify-between">
                  Hybrid (70/30)
                  {type === 'Hybrid' && <Check className="w-3.5 h-3.5 text-cyan-400" />}
                </span>
                <span className="text-[10px] text-slate-400 mt-1">
                  70 PBL / 30 End-Term
                </span>
              </button>

              <button
                type="button"
                onClick={() => setType('ContinuousEvaluation')}
                className={`p-2.5 rounded-xl border text-left flex flex-col justify-between transition-all ${
                  type === 'ContinuousEvaluation'
                    ? 'bg-emerald-950/60 border-emerald-500 text-white shadow-[0_0_15px_rgba(16,185,129,0.2)]'
                    : 'bg-obsidian-850 border-white/10 text-slate-300 hover:border-white/20'
                }`}
              >
                <span className="text-xs font-bold flex items-center justify-between">
                  100% Internal
                  {type === 'ContinuousEvaluation' && <Check className="w-3.5 h-3.5 text-emerald-400" />}
                </span>
                <span className="text-[10px] text-slate-400 mt-1">
                  100 Int / 0 External Exam
                </span>
              </button>

              <button
                type="button"
                onClick={() => setType('DirectGrade')}
                className={`p-2.5 rounded-xl border text-left flex flex-col justify-between transition-all ${
                  type === 'DirectGrade'
                    ? 'bg-indigo-950/60 border-indigo-500 text-white shadow-[0_0_15px_rgba(99,102,241,0.2)]'
                    : 'bg-obsidian-850 border-white/10 text-slate-300 hover:border-white/20'
                }`}
              >
                <span className="text-xs font-bold flex items-center justify-between">
                  Direct Grade
                  {type === 'DirectGrade' && <Check className="w-3.5 h-3.5 text-indigo-400" />}
                </span>
                <span className="text-[10px] text-slate-400 mt-1">
                  NPTEL / Swayam Direct Grade
                </span>
              </button>
            </div>
          </div>

          {/* Non-Graded Checkbox */}
          <div className="pt-2">
            <label className="flex items-center gap-2.5 cursor-pointer p-2.5 rounded-xl bg-obsidian-850 border border-white/5 hover:border-white/10">
              <input
                type="checkbox"
                checked={isNonGraded}
                onChange={(e) => setIsNonGraded(e.target.checked)}
                className="w-4 h-4 rounded text-cyan-500 bg-obsidian-900 border-white/20 focus:ring-0 cursor-pointer"
              />
              <div className="text-xs">
                <span className="font-semibold text-slate-200">Mandatory Non-Graded (MNG)</span>
                <span className="text-slate-400 block text-[11px]">Subject requires ≥40% to pass, but does not affect SGPA</span>
              </div>
            </label>
          </div>

          {/* Submit Actions */}
          <div className="pt-3 flex items-center justify-end gap-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl bg-obsidian-850 hover:bg-obsidian-800 text-slate-300 font-semibold text-xs border border-white/10"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2 rounded-xl bg-gradient-to-r from-cyan-500 to-indigo-600 hover:from-cyan-400 hover:to-indigo-500 text-black font-bold text-xs shadow-[0_0_15px_rgba(6,182,212,0.3)] flex items-center gap-1.5 transition-all"
            >
              <Plus className="w-4 h-4" />
              <span>Add Subject to Semester V</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
