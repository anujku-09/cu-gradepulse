import React, { useState, useEffect, useMemo } from 'react';
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
  Save,
  HelpCircle,
  SlidersHorizontal,
  ChevronDown,
  ChevronUp
} from 'lucide-react';
import { Course, CourseType, GradeLevel } from '../types';
import { convertCourseMode, CU_5TH_SEM_ELECTIVE_PRESETS, detectAssessmentSchemeFromCode } from '../data/courses';

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

  // Custom External Weightage States
  const [showCustomWeightage, setShowCustomWeightage] = useState(false);
  const [externalName, setExternalName] = useState(course.externalName);
  const [externalRawMax, setExternalRawMax] = useState<number>(course.externalRawMax);
  const [externalWeightage, setExternalWeightage] = useState<number>(course.externalWeightage);

  useEffect(() => {
    setName(course.name);
    setCode(course.code);
    setCredits(course.credits);
    setType(course.type);
    setIsNonGraded(!!course.isNonGraded);
    setIsExcluded(!!course.isExcluded);
    setExternalName(course.externalName);
    setExternalRawMax(course.externalRawMax);
    setExternalWeightage(course.externalWeightage);
    setShowCustomWeightage(false);
  }, [course]);

  // Auto-detection based on course code and title
  const detectedType = useMemo(() => {
    return detectAssessmentSchemeFromCode(code, name);
  }, [code, name]);

  const handleQuickConvert = (targetType: CourseType) => {
    setType(targetType);
    if (targetType === 'Theory') {
      setExternalName('External Theory Exam');
      setExternalRawMax(60);
      setExternalWeightage(60);
    } else if (targetType === 'Practical') {
      setExternalName('External Viva / Voce');
      setExternalRawMax(40);
      setExternalWeightage(40);
    } else if (targetType === 'Hybrid') {
      setExternalName('End Term Hybrid Theory');
      setExternalRawMax(60);
      setExternalWeightage(30);
    } else if (targetType === 'ContinuousEvaluation') {
      setExternalName('Continuous Evaluation (No External Exam)');
      setExternalRawMax(0);
      setExternalWeightage(0);
    } else if (targetType === 'DirectGrade') {
      setExternalName('NPTEL Certificate Score');
      setExternalRawMax(100);
      setExternalWeightage(100);
    }
  };

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

    // If type changed, apply convertCourseMode first
    if (type !== course.type) {
      updated = convertCourseMode(updated, type);
    }

    // Apply any customized external properties
    updated.externalName = externalName.trim() || updated.externalName;
    updated.externalRawMax = Math.max(0, Number(externalRawMax) || 0);
    updated.externalWeightage = Math.max(0, Math.min(100, Number(externalWeightage) || 0));

    onUpdateCourse(updated);
    onClose();
  };

  const calculatedInternalWeightage = Math.max(0, 100 - externalWeightage);

  return (
    <div className="fixed inset-0 z-[70] overflow-y-auto bg-obsidian-950/80 backdrop-blur-md flex items-center justify-center p-3 sm:p-4 animate-fadeIn">
      <div 
        className="relative w-full max-w-xl bg-obsidian-900 border border-white/10 rounded-2xl sm:rounded-3xl shadow-[0_0_50px_rgba(0,0,0,0.8)] overflow-hidden flex flex-col max-h-[92vh]"
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
                <span>Configure Subject & Scheme</span>
                <span className="font-mono text-xs text-cyan-300 px-2 py-0.5 rounded bg-white/5 border border-white/10">
                  {course.code}
                </span>
              </h2>
              <p className="text-xs text-slate-400">
                Choose evaluation scheme (Theory, Practical, Hybrid, Continuous, NPTEL) or customize weightages.
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
        <form onSubmit={handleSave} className="p-5 sm:p-6 space-y-4 overflow-y-auto">
          
          {/* Smart Auto-Detection Banner if code suggests a different scheme */}
          {detectedType !== type && (
            <div className="p-3 rounded-xl bg-indigo-950/40 border border-indigo-500/30 flex items-center justify-between gap-2.5 animate-fadeIn">
              <div className="flex items-center gap-2 text-xs text-indigo-200">
                <Sparkles className="w-4 h-4 text-cyan-400 flex-shrink-0" />
                <span>
                  Code indicates <strong>{
                    detectedType === 'ContinuousEvaluation' ? '100% Continuous Internal' :
                    detectedType === 'Hybrid' ? 'Hybrid PBL (70/30)' :
                    detectedType === 'Practical' ? 'Practical Lab (60/40)' :
                    detectedType === 'DirectGrade' ? 'Direct Grade NPTEL' : 'Theory (40/60)'
                  }</strong>
                </span>
              </div>
              <button
                type="button"
                onClick={() => handleQuickConvert(detectedType)}
                className="px-2.5 py-1 rounded-lg bg-indigo-500/25 hover:bg-indigo-500/40 text-cyan-300 text-[11px] font-bold border border-indigo-500/40 transition-colors whitespace-nowrap"
              >
                Apply Scheme
              </button>
            </div>
          )}

          {/* Evaluation Mode Switcher Tabs (All 5 CU Schemes) */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="text-xs font-semibold text-slate-200">
                Evaluation & Assessment Scheme:
              </label>
              <span className="text-[10px] font-mono text-cyan-400">
                CU Assessment Schemes
              </span>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
              {/* 1. Theory (40/60) */}
              <button
                type="button"
                onClick={() => handleQuickConvert('Theory')}
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

              {/* 2. Practical (60/40) */}
              <button
                type="button"
                onClick={() => handleQuickConvert('Practical')}
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

              {/* 3. Hybrid (70/30) */}
              <button
                type="button"
                onClick={() => handleQuickConvert('Hybrid')}
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

              {/* 4. Continuous Internal (100/0) */}
              <button
                type="button"
                onClick={() => handleQuickConvert('ContinuousEvaluation')}
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

              {/* 5. Direct Grade (NPTEL) */}
              <button
                type="button"
                onClick={() => handleQuickConvert('DirectGrade')}
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
                  NPTEL / Swayam Letter Grade
                </span>
              </button>
            </div>
          </div>

          {/* Quick Elective Preset (Optional 1-Click Fill from Official 5th Sem Allocations) */}
          <div className="p-2.5 rounded-xl bg-cyan-950/30 border border-cyan-500/20 space-y-1.5">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-bold text-cyan-300">
                CU 5th Sem Elective Quick Presets:
              </span>
              <span className="text-[9px] font-mono text-slate-400">
                Sets B-F Official Allocations
              </span>
            </div>
            <select
              onChange={(e) => {
                const preset = CU_5TH_SEM_ELECTIVE_PRESETS.find(p => p.name === e.target.value);
                if (preset) {
                  setName(preset.name);
                  setCode(preset.code);
                  setCredits(preset.credits);
                  handleQuickConvert(preset.type);
                }
              }}
              defaultValue=""
              className="w-full px-2.5 py-1.5 rounded-lg bg-obsidian-900 border border-white/10 text-xs text-slate-200 focus:border-cyan-500 focus:outline-none cursor-pointer"
            >
              <option value="" disabled>-- Or pick from official 5th Sem electives --</option>
              {CU_5TH_SEM_ELECTIVE_PRESETS.map((p, idx) => (
                <option key={idx} value={p.name}>
                  [{p.set}] {p.name} ({p.type})
                </option>
              ))}
            </select>
          </div>

          {/* Subject Name */}
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1.5">
              Subject Name
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full px-3.5 py-2 rounded-xl bg-obsidian-850 border border-white/10 text-white text-sm focus:border-cyan-500 focus:outline-none"
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
                className="w-full px-3.5 py-2 rounded-xl bg-obsidian-850 border border-white/10 text-white font-mono text-sm focus:border-cyan-500 focus:outline-none uppercase"
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
                className="w-full px-3.5 py-2 rounded-xl bg-obsidian-850 border border-white/10 text-white font-mono text-sm focus:border-cyan-500 focus:outline-none cursor-pointer"
              >
                <option value={1.0}>1.0 Credit</option>
                <option value={2.0}>2.0 Credits</option>
                <option value={3.0}>3.0 Credits (Standard Elective)</option>
                <option value={4.0}>4.0 Credits (Core Theory)</option>
                <option value={5.0}>5.0 Credits</option>
              </select>
            </div>
          </div>

          {/* Advanced / Custom Weightage Accordion */}
          {type !== 'DirectGrade' && (
            <div className="rounded-xl border border-white/10 bg-obsidian-850/60 overflow-hidden">
              <button
                type="button"
                onClick={() => setShowCustomWeightage(!showCustomWeightage)}
                className="w-full px-3.5 py-2.5 text-left flex items-center justify-between text-xs text-slate-300 hover:text-white transition-colors"
              >
                <span className="flex items-center gap-1.5 font-medium">
                  <SlidersHorizontal className="w-3.5 h-3.5 text-cyan-400" />
                  <span>Custom Weightage & External Exam Rules</span>
                </span>
                <span className="text-[10px] font-mono text-cyan-400 flex items-center gap-1">
                  {showCustomWeightage ? 'Hide Custom Split' : 'Customize Split (e.g. 50/50)'}
                  {showCustomWeightage ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
                </span>
              </button>

              {showCustomWeightage && (
                <div className="p-3.5 pt-1 border-t border-white/5 space-y-3 animate-fadeIn">
                  <div className="text-[11px] text-slate-400 leading-relaxed">
                    If your section or elective follows a custom marks distribution, adjust the external exam weightage below. The internal weightage automatically adjusts to balance to 100%.
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
                    <div>
                      <label className="block text-[11px] font-medium text-slate-300 mb-1">
                        External Exam Title
                      </label>
                      <input
                        type="text"
                        value={externalName}
                        onChange={(e) => setExternalName(e.target.value)}
                        placeholder="e.g. External Theory"
                        className="w-full px-2.5 py-1.5 rounded-lg bg-obsidian-900 border border-white/10 text-xs text-white focus:border-cyan-500 focus:outline-none"
                      />
                    </div>

                    <div>
                      <label className="block text-[11px] font-medium text-slate-300 mb-1">
                        External Max Marks
                      </label>
                      <input
                        type="number"
                        min="0"
                        max="100"
                        value={externalRawMax}
                        onChange={(e) => setExternalRawMax(parseFloat(e.target.value) || 0)}
                        className="w-full px-2.5 py-1.5 rounded-lg bg-obsidian-900 border border-white/10 text-xs font-mono text-cyan-300 focus:border-cyan-500 focus:outline-none text-center"
                      />
                    </div>

                    <div>
                      <label className="block text-[11px] font-medium text-slate-300 mb-1">
                        External Weightage (%)
                      </label>
                      <input
                        type="number"
                        min="0"
                        max="100"
                        value={externalWeightage}
                        onChange={(e) => setExternalWeightage(parseFloat(e.target.value) || 0)}
                        className="w-full px-2.5 py-1.5 rounded-lg bg-obsidian-900 border border-white/10 text-xs font-mono text-cyan-300 focus:border-cyan-500 focus:outline-none text-center"
                      />
                    </div>
                  </div>

                  {/* Calculated Balance Badge */}
                  <div className="p-2 rounded-lg bg-obsidian-900 border border-white/5 flex items-center justify-between text-xs">
                    <span className="text-slate-400">Calculated Assessment Split:</span>
                    <span className="font-mono font-bold text-cyan-300">
                      {calculatedInternalWeightage}% Internal + {externalWeightage}% External = 100%
                    </span>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Additional Options (Disallow / Non-Graded) */}
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
