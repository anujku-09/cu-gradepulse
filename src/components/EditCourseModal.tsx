import React, { useState, useEffect } from 'react';
import { 
  X, 
  Sliders, 
  Check, 
  Trash2, 
  EyeOff, 
  Eye, 
  AlertCircle, 
  Sparkles,
  Award,
  Layers,
  Save
} from 'lucide-react';
import { Course, CourseType, GradeLevel } from '../types';
import { convertCourseMode } from '../data/courses';

interface EditCourseModalProps {
  course: Course | null;
  isOpen: boolean;
  onClose: () => void;
  onUpdateCourse: (updated: Course) => void;
  onDeleteCourse?: (courseId: string) => void;
}

export const EditCourseModal: React.FC<EditCourseModalProps> = ({
  course,
  isOpen,
  onClose,
  onUpdateCourse,
  onDeleteCourse,
}) => {
  if (!isOpen || !course) return null;

  const [name, setName] = useState(course.name);
  const [code, setCode] = useState(course.code);
  const [credits, setCredits] = useState<number>(course.credits);
  const [type, setType] = useState<CourseType>(course.type);
  const [isNonGraded, setIsNonGraded] = useState(!!course.isNonGraded);
  const [isExcluded, setIsExcluded] = useState(!!course.isExcluded);

  useEffect(() => {
    setName(course.name);
    setCode(course.code);
    setCredits(course.credits);
    setType(course.type);
    setIsNonGraded(!!course.isNonGraded);
    setIsExcluded(!!course.isExcluded);
  }, [course]);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    let updated: Course = {
      ...course,
      name: name.trim() || course.name,
      code: code.trim().toUpperCase() || course.code,
      credits: Number(credits) || course.credits,
      isNonGraded,
      isExcluded,
    };

    // If type changed, apply convertCourseMode
    if (type !== course.type) {
      updated = convertCourseMode(updated, type === 'DirectGrade' ? 'DirectGrade' : type === 'Practical' ? 'Practical' : 'Theory');
    }

    onUpdateCourse(updated);
    onClose();
  };

  const handleQuickConvert = (targetType: 'Theory' | 'Practical' | 'DirectGrade') => {
    setType(targetType);
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
            <div className="w-10 h-10 rounded-xl bg-indigo-500/20 border border-indigo-500/40 flex items-center justify-center text-indigo-300 shadow-[0_0_15px_rgba(99,102,241,0.3)]">
              <Sliders className="w-5 h-5 text-indigo-400" />
            </div>
            <div>
              <h2 className="text-base sm:text-lg font-bold text-white flex items-center gap-2">
                <span>Configure Subject</span>
                <span className="font-mono text-xs text-cyan-300 px-2 py-0.5 rounded bg-white/5 border border-white/10">
                  {course.code}
                </span>
              </h2>
              <p className="text-xs text-slate-400">
                Switch evaluation mode (Marks ↔ Direct Grade) or customize subject properties.
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

        {/* Modal Form */}
        <form onSubmit={handleSave} className="p-5 sm:p-6 space-y-4">
          
          {/* Evaluation Mode Switcher Tabs */}
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-2">
              Evaluation Mode
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
              <button
                type="button"
                onClick={() => handleQuickConvert('Theory')}
                className={`p-3 rounded-xl border text-left flex flex-col justify-between transition-all ${
                  type === 'Theory'
                    ? 'bg-cyan-950/60 border-cyan-500 text-white shadow-[0_0_15px_rgba(6,182,212,0.2)]'
                    : 'bg-obsidian-850 border-white/10 text-slate-300 hover:border-white/20'
                }`}
              >
                <span className="text-xs font-bold flex items-center justify-between">
                  Marks (40/60)
                  {type === 'Theory' && <Check className="w-3.5 h-3.5 text-cyan-400" />}
                </span>
                <span className="text-[10px] text-slate-400 mt-1">
                  Standard Theory 40 internal / 60 external
                </span>
              </button>

              <button
                type="button"
                onClick={() => handleQuickConvert('Practical')}
                className={`p-3 rounded-xl border text-left flex flex-col justify-between transition-all ${
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
                  Practical lab evaluation / Swift Lab
                </span>
              </button>

              <button
                type="button"
                onClick={() => handleQuickConvert('DirectGrade')}
                className={`p-3 rounded-xl border text-left flex flex-col justify-between transition-all ${
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
                  NPTEL / Swayam Exam certificate direct grade
                </span>
              </button>
            </div>
          </div>

          {/* Name */}
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1.5">
              Subject Name
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl bg-obsidian-850 border border-white/10 text-white text-sm focus:border-cyan-500 focus:outline-none"
              required
            />
          </div>

          {/* Code & Credits */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                Course Code
              </label>
              <input
                type="text"
                value={code}
                onChange={(e) => setCode(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl bg-obsidian-850 border border-white/10 text-white font-mono text-sm focus:border-cyan-500 focus:outline-none uppercase"
                required
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                Credits Weightage
              </label>
              <select
                value={credits}
                onChange={(e) => setCredits(parseFloat(e.target.value))}
                className="w-full px-3.5 py-2.5 rounded-xl bg-obsidian-850 border border-white/10 text-white font-mono text-sm focus:border-cyan-500 focus:outline-none cursor-pointer"
              >
                <option value={1.0}>1.0 Credit</option>
                <option value={2.0}>2.0 Credits</option>
                <option value={3.0}>3.0 Credits (Standard Elective)</option>
                <option value={4.0}>4.0 Credits</option>
                <option value={5.0}>5.0 Credits</option>
              </select>
            </div>
          </div>

          {/* Additional Options */}
          <div className="space-y-2 pt-1">
            <label className="flex items-center gap-2.5 cursor-pointer p-2.5 rounded-xl bg-obsidian-850 border border-white/5 hover:border-white/10">
              <input
                type="checkbox"
                checked={isExcluded}
                onChange={(e) => setIsExcluded(e.target.checked)}
                className="w-4 h-4 rounded text-rose-500 bg-obsidian-900 border-white/20 focus:ring-0 cursor-pointer"
              />
              <div className="text-xs">
                <span className="font-semibold text-slate-200">Disallow / Exclude from SGPA</span>
                <span className="text-slate-400 block text-[11px]">Subject will be skipped in semester credit & GPA calculation</span>
              </div>
            </label>

            <label className="flex items-center gap-2.5 cursor-pointer p-2.5 rounded-xl bg-obsidian-850 border border-white/5 hover:border-white/10">
              <input
                type="checkbox"
                checked={isNonGraded}
                onChange={(e) => setIsNonGraded(e.target.checked)}
                className="w-4 h-4 rounded text-cyan-500 bg-obsidian-900 border-white/20 focus:ring-0 cursor-pointer"
              />
              <div className="text-xs">
                <span className="font-semibold text-slate-200">Non-Graded Mode (MNG)</span>
                <span className="text-slate-400 block text-[11px]">Requires 40% to pass, earned credits do not scale SGPA</span>
              </div>
            </label>
          </div>

          {/* Footer Actions */}
          <div className="pt-3 flex items-center justify-between gap-2 border-t border-white/10">
            {onDeleteCourse && course.isCustom ? (
              <button
                type="button"
                onClick={() => {
                  if (window.confirm(`Delete ${course.name} from Semester V?`)) {
                    onDeleteCourse(course.id);
                    onClose();
                  }
                }}
                className="px-3 py-2 rounded-xl bg-rose-950/40 hover:bg-rose-900/60 text-rose-300 text-xs font-semibold border border-rose-500/30 flex items-center gap-1.5 transition-colors"
              >
                <Trash2 className="w-3.5 h-3.5 text-rose-400" />
                <span>Delete Subject</span>
              </button>
            ) : (
              <div />
            )}

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 rounded-xl bg-obsidian-850 hover:bg-obsidian-800 text-slate-300 font-semibold text-xs border border-white/10"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-5 py-2 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-black font-bold text-xs shadow-[0_0_15px_rgba(6,182,212,0.3)] flex items-center gap-1.5 transition-all"
              >
                <Save className="w-4 h-4" />
                <span>Save Changes</span>
              </button>
            </div>
          </div>
        </form>

      </div>
    </div>
  );
};
