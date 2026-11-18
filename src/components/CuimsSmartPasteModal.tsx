import React, { useState, useMemo } from 'react';
import { 
  X, 
  ClipboardPaste, 
  CheckCircle2, 
  AlertCircle, 
  Sparkles, 
  FileText, 
  ArrowRight,
  Database
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { Course } from '../types';
import { parseCuimsText, ParseResult } from '../utils/cuimsParser';

interface CuimsSmartPasteModalProps {
  courses: Course[];
  isOpen: boolean;
  onClose: () => void;
  onApplyParsedMarks: (updates: { courseId: string; componentId: string; rawObtained: number }[]) => void;
}

const SAMPLE_CUIMS_TEXT = `Computer Networks (24CST-302)
Exam Description    Max. Marks    Marks Obtd.
Assignment/PBL    10    9.5
Mid-Semester Test-1    20    19.5
Quiz    4    4
Surprise Test    12    11
Mid-Semester Test-2    20    19.5

Probability and Statistics (24SMT-341)
Exam Description    Max. Marks    Marks Obtd.
Assignment/PBL    10    10
Mid-Semester Test-1    20    18.5
Quiz    4    4
Surprise Test    12    11.5
Mid-Semester Test-2    20    19

Competitive Coding-II (24CSP-305)
Exam Description    Max. Marks    Marks Obtd.
Experiment 1    30    29
Experiment 2    30    30
Experiment 3    30    28
Experiment 4    30    29
Experiment 5    30    28
Mid-Term Test    15    14.5`;

export const CuimsSmartPasteModal: React.FC<CuimsSmartPasteModalProps> = ({
  courses,
  isOpen,
  onClose,
  onApplyParsedMarks,
}) => {
  if (!isOpen) return null;

  const [rawText, setRawText] = useState<string>('');

  const parseResult: ParseResult = useMemo(() => {
    if (!rawText.trim()) return { items: [], unmatchedLines: [], courseSummary: [] };
    return parseCuimsText(rawText, courses);
  }, [rawText, courses]);

  const handleApply = () => {
    if (parseResult.items.length === 0) return;

    const updates = parseResult.items.map(item => ({
      courseId: item.courseId,
      componentId: item.componentId,
      rawObtained: item.extractedObtained
    }));

    onApplyParsedMarks(updates);

    try {
      confetti({
        particleCount: 60,
        spread: 60,
        origin: { y: 0.6 }
      });
    } catch (e) {}

    onClose();
  };

  const handleLoadSample = () => {
    setRawText(SAMPLE_CUIMS_TEXT);
  };

  return (
    <div className="fixed inset-0 z-[70] overflow-y-auto bg-obsidian-950/85 backdrop-blur-md flex items-center justify-center p-3 sm:p-4 animate-fadeIn">
      <div className="relative w-full max-w-2xl bg-obsidian-900 border border-white/10 rounded-2xl shadow-2xl p-4 sm:p-6 overflow-hidden max-h-[92vh] flex flex-col justify-between">
        
        {/* Glow ambient background */}
        <div className="absolute -top-16 -right-16 w-56 h-56 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none" />

        {/* Modal Header */}
        <div className="flex items-start sm:items-center justify-between pb-3 sm:pb-4 border-b border-white/10 gap-3">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-cyan-950/80 border border-cyan-500/40 text-cyan-400 shadow-[0_0_15px_rgba(6,182,212,0.3)] flex-shrink-0">
              <ClipboardPaste className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base sm:text-lg font-bold text-white flex items-center gap-1.5 sm:gap-2 flex-wrap">
                CUIMS Smart Paste Parser
                <span className="text-[9px] sm:text-[10px] uppercase font-mono px-1.5 py-0.2 rounded bg-cyan-900/60 text-cyan-300 border border-cyan-700/60">
                  Regex Engine
                </span>
              </h2>
              <p className="text-[11px] sm:text-xs text-slate-400">
                Copy raw marks tables from CUIMS portal and paste here to auto-populate
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-lg bg-obsidian-800 hover:bg-obsidian-700 text-slate-400 hover:text-white transition-colors touch-manipulation flex-shrink-0"
            title="Close parser"
          >
            <X className="w-4 h-4 sm:w-5 sm:h-5" />
          </button>
        </div>

        {/* Text Input Area */}
        <div className="my-4 space-y-2">
          <div className="flex items-center justify-between">
            <label className="text-xs font-semibold text-slate-300 flex items-center gap-1.5">
              <FileText className="w-3.5 h-3.5 text-cyan-400" />
              Raw CUIMS Paste Area:
            </label>
            <button
              onClick={handleLoadSample}
              className="text-xs font-mono text-cyan-400 hover:text-cyan-300 underline flex items-center gap-1"
            >
              <Sparkles className="w-3 h-3" /> Load Sample Data
            </button>
          </div>

          <textarea
            rows={6}
            value={rawText}
            onChange={(e) => setRawText(e.target.value)}
            placeholder="Paste text directly from CUIMS assessment tables or reports here (e.g., 'Experiment 1  28 / 30' or 'MST-1 18')..."
            className="w-full p-3 rounded-xl bg-obsidian-850 border border-white/10 text-xs font-mono text-slate-200 focus:outline-none focus:border-cyan-500 transition-all placeholder:text-slate-600"
          />
        </div>

        {/* Parsing Results Preview */}
        {parseResult.items.length > 0 && (
          <div className="space-y-3 mb-4">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-slate-300 uppercase tracking-wider font-mono">
                Matched Components ({parseResult.items.length} items across {parseResult.courseSummary.length} courses):
              </span>
              <span className="text-xs font-mono text-emerald-400 flex items-center gap-1">
                <CheckCircle2 className="w-3.5 h-3.5" /> High Confidence
              </span>
            </div>

            <div className="space-y-1.5 max-h-[220px] overflow-y-auto pr-1">
              {parseResult.items.map((item, idx) => (
                <div
                  key={`${item.courseId}-${item.componentId}-${idx}`}
                  className="p-2.5 rounded-lg bg-obsidian-850/60 border border-white/5 flex items-center justify-between text-xs"
                >
                  <div className="min-w-0">
                    <span className="font-mono text-[10px] text-cyan-400 font-semibold mr-1.5">
                      [{item.courseCode}]
                    </span>
                    <span className="text-slate-200 font-medium">
                      {item.componentName}
                    </span>
                  </div>

                  <div className="flex items-center gap-2 font-mono flex-shrink-0">
                    <span className="text-slate-500 line-through text-[11px]">
                      {item.previousObtained}
                    </span>
                    <ArrowRight className="w-3 h-3 text-slate-500" />
                    <span className="text-emerald-400 font-bold">
                      {item.extractedObtained} / {item.rawMax}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {rawText.trim() && parseResult.items.length === 0 && (
          <div className="p-3.5 rounded-xl bg-amber-950/30 border border-amber-500/30 text-xs text-amber-300 flex items-center gap-2 mb-4">
            <AlertCircle className="w-4 h-4 flex-shrink-0" />
            <span>Could not extract matching components. Ensure the text contains assessment names like "Experiment 1", "MST-1", "Assignment" and marks numbers.</span>
          </div>
        )}

        {/* Footer Actions (Responsive: wraps on mobile) */}
        <div className="pt-3 sm:pt-4 border-t border-white/10 flex flex-col-reverse sm:flex-row items-stretch sm:items-center justify-between gap-2.5">
          <button
            onClick={() => setRawText('')}
            className="px-3 py-2 sm:py-1.5 rounded-lg bg-obsidian-850 hover:bg-obsidian-800 text-slate-400 text-xs font-medium border border-white/10 transition-colors text-center touch-manipulation"
          >
            Clear Text
          </button>

          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2">
            <button
              onClick={onClose}
              className="px-4 py-2 rounded-xl bg-obsidian-800 hover:bg-obsidian-700 text-slate-300 text-xs font-semibold border border-white/10 transition-colors text-center touch-manipulation"
            >
              Cancel
            </button>

            <button
              onClick={handleApply}
              disabled={parseResult.items.length === 0}
              className="px-5 py-2.5 sm:py-2 rounded-xl bg-cyan-600 hover:bg-cyan-500 disabled:opacity-50 disabled:pointer-events-none text-white text-xs font-bold transition-all shadow-[0_0_15px_rgba(6,182,212,0.3)] flex items-center justify-center gap-2 touch-manipulation"
            >
              <Sparkles className="w-4 h-4" />
              <span>Apply {parseResult.items.length > 0 ? `All ${parseResult.items.length} Parsed Marks` : 'Parsed Marks'}</span>
            </button>
          </div>
        </div>

      </div>
    </div>
  );
};
