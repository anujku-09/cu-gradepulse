import React, { useState, useMemo } from 'react';
import { 
  ClipboardPaste, 
  Check, 
  AlertCircle, 
  X, 
  Sparkles, 
  CheckCircle2,
  Trash2,
  FileText
} from 'lucide-react';
import { Course } from '../types';
import { parseCuimsText } from '../utils/cuimsParser';

interface CourseRegexPasteBoxProps {
  course: Course;
  onApplyMarks: (updates: { componentId: string; rawObtained: number }[]) => void;
  onClose?: () => void;
  isCompact?: boolean;
}

export const CourseRegexPasteBox: React.FC<CourseRegexPasteBoxProps> = ({
  course,
  onApplyMarks,
  onClose,
  isCompact = false,
}) => {
  const [text, setText] = useState('');
  const [isCopiedSuccess, setIsCopiedSuccess] = useState(false);

  // Live regex parsing targeting this specific course
  const parseResult = useMemo(() => {
    if (!text.trim()) return null;
    return parseCuimsText(text, [course]);
  }, [text, course]);

  const handlePasteClipboard = async () => {
    try {
      const clipText = await navigator.clipboard.readText();
      if (clipText) setText(clipText);
    } catch (e) {
      // Clipboard access might be blocked by browser permissions
      console.warn('Clipboard read failed:', e);
    }
  };

  const handleApply = () => {
    if (!parseResult || parseResult.items.length === 0) return;

    const updates = parseResult.items.map(item => ({
      componentId: item.componentId,
      rawObtained: item.extractedObtained
    }));

    onApplyMarks(updates);
    setIsCopiedSuccess(true);
    setTimeout(() => {
      setIsCopiedSuccess(false);
      if (onClose) onClose();
    }, 1200);
  };

  return (
    <div className="p-3.5 rounded-xl bg-obsidian-950/90 border border-cyan-500/30 shadow-[0_0_20px_rgba(6,182,212,0.15)] space-y-2.5 animate-fadeIn">
      {/* Header */}
      <div className="flex items-center justify-between gap-2">
        <span className="text-xs font-bold text-cyan-300 flex items-center gap-1.5">
          <ClipboardPaste className="w-3.5 h-3.5 text-cyan-400" />
          <span>CUIMS Regex Paste: {course.code}</span>
        </span>

        <div className="flex items-center gap-1">
          <button
            type="button"
            onClick={handlePasteClipboard}
            className="text-[10px] font-mono font-semibold px-2 py-0.5 rounded bg-cyan-950 text-cyan-300 border border-cyan-800/60 hover:bg-cyan-900 transition-colors flex items-center gap-1"
            title="Paste directly from clipboard"
          >
            <ClipboardPaste className="w-3 h-3" />
            <span>Paste Clipboard</span>
          </button>

          {text && (
            <button
              type="button"
              onClick={() => setText('')}
              className="text-[10px] text-slate-400 hover:text-rose-400 p-0.5"
              title="Clear text"
            >
              <Trash2 className="w-3 h-3" />
            </button>
          )}

          {onClose && (
            <button
              type="button"
              onClick={onClose}
              className="text-slate-400 hover:text-white p-0.5 ml-1"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          )}
        </div>
      </div>

      {/* Text Area */}
      <textarea
        rows={isCompact ? 3 : 4}
        value={text}
        onChange={(e) => setText(e.target.value)}
        placeholder={`Paste copied CUIMS text for ${course.name}...\nSupports desktop tables & mobile formats:\ne.g.\nPractical MST\n8.5/10\nPractical Worksheet/Projects 1\n29/30\nMST-1 Hybrid\n16/20`}
        className="w-full bg-obsidian-900 border border-white/10 rounded-lg p-2 text-xs text-slate-100 placeholder:text-slate-600 focus:outline-none focus:border-cyan-500 font-mono resize-none"
      />

      {/* Matched Items Preview & Apply Button */}
      {parseResult && parseResult.items.length > 0 && (
        <div className="space-y-2 pt-1 border-t border-white/5">
          <div className="flex items-center justify-between text-xs">
            <span className="text-[11px] font-mono text-emerald-400 font-semibold flex items-center gap-1">
              <CheckCircle2 className="w-3.5 h-3.5" />
              <span>Matched {parseResult.items.length} of {course.components.length} components</span>
            </span>

            <span className="text-[10px] font-mono text-slate-400">
              Regex Confidence: High
            </span>
          </div>

          {/* Matched component pills */}
          <div className="flex flex-wrap gap-1 max-h-24 overflow-y-auto no-scrollbar py-0.5">
            {parseResult.items.map(item => (
              <span
                key={item.componentId}
                className="text-[10px] font-mono px-2 py-0.5 rounded bg-emerald-950/70 text-emerald-300 border border-emerald-800/60 flex items-center gap-1"
              >
                <span>{item.componentName}:</span>
                <strong className="text-white">{item.extractedObtained}</strong>
                <span className="text-slate-400">/{item.rawMax}</span>
              </span>
            ))}
          </div>

          {/* Action button */}
          <button
            type="button"
            onClick={handleApply}
            disabled={isCopiedSuccess}
            className={`w-full py-1.5 px-3 rounded-lg text-xs font-bold font-mono transition-all flex items-center justify-center gap-1.5 ${
              isCopiedSuccess
                ? 'bg-emerald-600 text-white'
                : 'bg-gradient-to-r from-cyan-500 to-indigo-600 hover:from-cyan-400 hover:to-indigo-500 text-white shadow-[0_0_12px_rgba(6,182,212,0.3)]'
            }`}
          >
            {isCopiedSuccess ? (
              <>
                <Check className="w-3.5 h-3.5" />
                <span>Applied to {course.code}!</span>
              </>
            ) : (
              <>
                <Sparkles className="w-3.5 h-3.5" />
                <span>Apply {parseResult.items.length} Parsed Marks to {course.code}</span>
              </>
            )}
          </button>
        </div>
      )}

      {text && parseResult && parseResult.items.length === 0 && (
        <div className="text-[11px] text-amber-400 font-mono flex items-center gap-1 p-1">
          <AlertCircle className="w-3 h-3 flex-shrink-0" />
          <span>No matching components found for {course.code}. Ensure copied lines have test names (e.g. MST, Quiz, Surprise Test).</span>
        </div>
      )}
    </div>
  );
};
