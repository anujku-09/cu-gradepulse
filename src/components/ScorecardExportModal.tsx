import React, { useRef, useState } from 'react';
import { 
  X, 
  Download, 
  Printer, 
  Copy, 
  Check, 
  Award, 
  ShieldCheck, 
  Gauge,
  Sparkles
} from 'lucide-react';
import { toPng } from 'html-to-image';
import { Course, SemesterCalculation, CgpaForecast } from '../types';
import { GRADE_COLORS } from '../utils/gradeCalculations';

interface ScorecardExportModalProps {
  courses: Course[];
  calc: SemesterCalculation;
  cgpaForecast: CgpaForecast;
  isOpen: boolean;
  onClose: () => void;
}

export const ScorecardExportModal: React.FC<ScorecardExportModalProps> = ({
  courses,
  calc,
  cgpaForecast,
  isOpen,
  onClose,
}) => {
  if (!isOpen) return null;

  const cardRef = useRef<HTMLDivElement>(null);
  const [downloading, setDownloading] = useState(false);
  const [copied, setCopied] = useState(false);
  const [studentName, setStudentName] = useState('CSE Scholar');
  const [studentUid, setStudentUid] = useState('22BCS10842');

  const handleDownloadPng = async () => {
    if (!cardRef.current) return;
    setDownloading(true);
    try {
      const dataUrl = await toPng(cardRef.current, {
        cacheBust: true,
        pixelRatio: 2,
        backgroundColor: '#09090B'
      });
      const link = document.createElement('a');
      link.download = `CU-GradePulse-Scorecard-${studentUid || 'Snapshot'}.png`;
      link.href = dataUrl;
      link.click();
    } catch (err) {
      console.error('Failed to generate image', err);
    } finally {
      setDownloading(false);
    }
  };

  const handlePrint = () => {
    window.print();
  };

  const handleCopySummary = () => {
    const lines = [
      `🎓 CU GradePulse Academic Snapshot`,
      `Student: ${studentName} (${studentUid})`,
      `Predicted SGPA: ${calc.sgpa.toFixed(2)} / 10.0`,
      `Projected CGPA: ${cgpaForecast.predictedCgpa.toFixed(2)} (${cgpaForecast.cgpaDelta >= 0 ? '+' : ''}${cgpaForecast.cgpaDelta.toFixed(2)})`,
      `Graded Credits: ${calc.totalGradedCredits} | Total GP: ${calc.totalEarnedGradePoints.toFixed(1)}`,
      `Backlog Status: ${calc.hasBacklog ? 'Backlog Alert: ' + calc.backlogCourses.join(', ') : 'CLEAR (All Passed)'}`,
      `--- Course Breakdown ---`,
      ...courses.map(c => {
        const res = calc.courses[c.id];
        return `${c.code}: ${res.predictedGrade} [${res.gradePoint}] (${res.totalWeightedScore.toFixed(1)}/100) - ${c.credits} Cr`;
      })
    ];

    navigator.clipboard.writeText(lines.join('\n'));
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-[70] overflow-y-auto bg-obsidian-950/85 backdrop-blur-md flex items-center justify-center p-2.5 sm:p-4 animate-fadeIn">
      <div className="relative w-full max-w-3xl bg-obsidian-900 border border-white/10 rounded-2xl shadow-2xl p-3.5 sm:p-5 max-h-[94vh] flex flex-col justify-between my-auto overflow-hidden">
        
        {/* Modal Header */}
        <div className="flex items-start sm:items-center justify-between pb-2.5 sm:pb-3 border-b border-white/10 gap-2.5 flex-shrink-0">
          <div className="flex items-center gap-2 min-w-0">
            <div className="p-2 rounded-xl bg-cyan-950/80 border border-cyan-500/40 text-cyan-400 flex-shrink-0">
              <Award className="w-4 h-4 sm:w-5 sm:h-5" />
            </div>
            <div className="min-w-0">
              <h2 className="text-sm sm:text-lg font-bold text-white truncate">
                Academic Scorecard Snapshot
              </h2>
              <p className="text-[10px] sm:text-xs text-slate-400 truncate">
                Export high-resolution scorecard certificate for record keeping
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-lg bg-obsidian-800 hover:bg-obsidian-700 text-slate-400 hover:text-white transition-colors touch-manipulation flex-shrink-0"
            title="Close scorecard"
          >
            <X className="w-4 h-4 sm:w-5 sm:h-5" />
          </button>
        </div>

        {/* Scrollable Center Body on Mobile Viewports */}
        <div className="flex-1 overflow-y-auto min-h-0 space-y-2.5 sm:space-y-3 my-2.5 pr-0.5 custom-scrollbar">
          {/* Student Customization Bar (Responsive) */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 sm:gap-3 p-2.5 sm:p-3 rounded-xl bg-obsidian-850 border border-white/5 text-xs">
            <div>
              <label className="text-slate-400 block mb-1 text-[11px]">Student Name:</label>
              <input
                type="text"
                value={studentName}
                onChange={(e) => setStudentName(e.target.value)}
                className="w-full px-2.5 py-1.5 rounded-lg bg-obsidian-900 border border-white/10 text-white font-medium focus:border-cyan-500 outline-none text-xs"
              />
            </div>
            <div>
              <label className="text-slate-400 block mb-1 text-[11px]">University Roll / UID:</label>
              <input
                type="text"
                value={studentUid}
                onChange={(e) => setStudentUid(e.target.value)}
                className="w-full px-2.5 py-1.5 rounded-lg bg-obsidian-900 border border-white/10 text-white font-mono uppercase focus:border-cyan-500 outline-none text-xs"
              />
            </div>
          </div>

          {/* Mobile Swipe Helper Notification */}
          <div className="sm:hidden flex items-center justify-between text-[10px] font-mono text-cyan-300 bg-cyan-950/40 px-2.5 py-1.5 rounded-lg border border-cyan-800/40">
            <span className="flex items-center gap-1">
              <Sparkles className="w-3 h-3 text-cyan-400" />
              Full HD Certificate Preview
            </span>
            <span className="text-slate-400">⇄ Swipe table</span>
          </div>

          {/* Scorecard Printable Container (Touch-scrollable with 2D overflow) */}
          <div className="overflow-auto touch-scroll max-h-[46vh] sm:max-h-[380px] p-1 border border-white/5 rounded-xl bg-obsidian-950/60 custom-scrollbar">
            <div
            ref={cardRef}
            className="w-full min-w-[560px] p-6 rounded-2xl bg-obsidian-950 border border-white/15 text-slate-100 shadow-2xl relative"
          >
            {/* Header / Brand */}
            <div className="flex items-center justify-between pb-4 border-b border-white/10">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-cyan-500/20 border border-cyan-400/40 flex items-center justify-center text-cyan-400 font-bold">
                  CU
                </div>
                <div>
                  <h3 className="font-bold text-base tracking-tight text-white">
                    CHANDIGARH UNIVERSITY
                  </h3>
                  <p className="text-[11px] text-cyan-400 font-mono">
                    Department of Computer Science & Engineering
                  </p>
                </div>
              </div>

              <div className="text-right text-xs font-mono">
                <span className="px-2 py-0.5 rounded bg-emerald-950/80 text-emerald-400 border border-emerald-800/40 font-bold block">
                  {calc.hasBacklog ? 'BACKLOG ALERT' : 'STATUS: CLEAR'}
                </span>
                <span className="text-[10px] text-slate-400 mt-1 block">
                  Semester V Matrix
                </span>
              </div>
            </div>

            {/* Student Info & Hero Metrics */}
            <div className="grid grid-cols-3 gap-4 my-4 p-4 rounded-xl bg-obsidian-850/70 border border-white/5">
              <div>
                <span className="text-[10px] uppercase font-mono text-slate-400 block">Student Profile</span>
                <div className="font-bold text-sm text-white mt-0.5">{studentName}</div>
                <div className="text-xs font-mono text-cyan-400 mt-0.5">{studentUid}</div>
              </div>

              <div className="text-center border-x border-white/10 px-2">
                <span className="text-[10px] uppercase font-mono text-slate-400 block">Predicted SGPA</span>
                <div className="text-3xl font-extrabold font-mono text-cyan-400 mt-0.5">
                  {calc.sgpa.toFixed(2)}
                </div>
                <span className="text-[10px] font-mono text-slate-400">
                  {calc.totalGradedCredits} Graded Credits
                </span>
              </div>

              <div className="text-right">
                <span className="text-[10px] uppercase font-mono text-slate-400 block">Projected CGPA</span>
                <div className="text-2xl font-bold font-mono text-emerald-400 mt-0.5">
                  {cgpaForecast.predictedCgpa.toFixed(2)}
                </div>
                <span className="text-[10px] font-mono text-slate-400">
                  Shift: {cgpaForecast.cgpaDelta >= 0 ? `+${cgpaForecast.cgpaDelta.toFixed(2)}` : cgpaForecast.cgpaDelta.toFixed(2)}
                </span>
              </div>
            </div>

            {/* Course Table */}
            <table className="w-full text-left text-xs font-sans border-collapse">
              <thead>
                <tr className="border-b border-white/10 text-[10px] font-mono uppercase text-slate-400">
                  <th className="py-2">Code</th>
                  <th className="py-2">Course Title</th>
                  <th className="py-2 text-center">Credits</th>
                  <th className="py-2 text-right">Internal</th>
                  <th className="py-2 text-right">External</th>
                  <th className="py-2 text-right">Total %</th>
                  <th className="py-2 text-center">Grade</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5 text-[11px] font-mono">
                {courses.map(c => {
                  const res = calc.courses[c.id];
                  const gTheme = GRADE_COLORS[res.predictedGrade];

                  return (
                    <tr key={c.id}>
                      <td className="py-2 text-cyan-400 font-bold">{c.code}</td>
                      <td className="py-2 text-slate-200 font-sans truncate max-w-[180px]">{c.name}</td>
                      <td className="py-2 text-center text-slate-400">{c.credits.toFixed(1)}</td>
                      <td className="py-2 text-right text-slate-300">
                        {c.type === 'DirectGrade' ? '-' : `${res.weightedInternalScore.toFixed(1)}`}
                      </td>
                      <td className="py-2 text-right text-slate-300">
                        {c.type === 'DirectGrade' ? '-' : `${res.weightedExternalScore.toFixed(1)}`}
                      </td>
                      <td className="py-2 text-right font-bold text-slate-100">
                        {res.totalWeightedScore.toFixed(1)}
                      </td>
                      <td className="py-2 text-center">
                        <span className={`px-2 py-0.5 rounded font-bold ${gTheme.text} ${gTheme.bg} border ${gTheme.border}`}>
                          {res.predictedGrade}
                        </span>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>

            {/* Footer Verification Tag */}
            <div className="mt-3 pt-2.5 border-t border-white/10 flex items-center justify-between text-[9px] sm:text-[10px] text-slate-500 font-mono">
              <span>Simulated via CU GradePulse Spatial Engine</span>
              <span>Generated on {new Date().toLocaleDateString()}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Action Buttons (Responsive: side-by-side primary buttons on mobile) */}
      <div className="pt-2.5 sm:pt-3 border-t border-white/10 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-2 flex-shrink-0">
        <button
          onClick={handleCopySummary}
          className="w-full sm:w-auto px-3 py-2 sm:py-1.5 rounded-lg bg-obsidian-850 hover:bg-obsidian-800 text-slate-300 text-xs font-semibold flex items-center justify-center gap-1.5 border border-white/10 transition-colors touch-manipulation"
        >
          {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
          <span>{copied ? 'Summary Copied!' : 'Copy Summary Text'}</span>
        </button>

        <div className="flex flex-row items-center gap-2 w-full sm:w-auto">
          <button
            onClick={handlePrint}
            className="flex-1 sm:flex-none px-3.5 py-2.5 sm:py-2 rounded-xl bg-obsidian-800 hover:bg-obsidian-700 text-slate-300 text-xs font-semibold border border-white/10 flex items-center justify-center gap-1.5 transition-colors touch-manipulation"
          >
            <Printer className="w-4 h-4" />
            <span>Print / PDF</span>
          </button>

          <button
            onClick={handleDownloadPng}
            disabled={downloading}
            className="flex-1 sm:flex-none px-4 py-2.5 sm:py-2 rounded-xl bg-gradient-to-r from-cyan-500 to-indigo-600 hover:from-cyan-400 hover:to-indigo-500 disabled:opacity-50 text-white text-xs font-bold flex items-center justify-center gap-1.5 shadow-[0_0_15px_rgba(6,182,212,0.3)] transition-all touch-manipulation"
          >
            <Download className="w-4 h-4" />
            <span>{downloading ? 'Rendering...' : 'Download PNG'}</span>
          </button>
        </div>
      </div>

    </div>
  </div>
);
};
