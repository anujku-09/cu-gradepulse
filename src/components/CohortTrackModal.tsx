import React from 'react';
import { 
  X, 
  Check, 
  Sparkles, 
  Layers, 
  Info, 
  ShieldCheck, 
  Laptop, 
  Cpu, 
  Cloud, 
  Shield, 
  GraduationCap, 
  Settings2,
  CheckCircle2,
  AlertCircle
} from 'lucide-react';
import { CohortTrackId, CohortTrackInfo } from '../types';
import { COHORT_TRACKS_INFO } from '../data/courses';

interface CohortTrackModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentTrackId: CohortTrackId;
  onSelectTrack: (trackId: CohortTrackId) => void;
  onOpenAddCustomCourse: () => void;
}

export const CohortTrackModal: React.FC<CohortTrackModalProps> = ({
  isOpen,
  onClose,
  currentTrackId,
  onSelectTrack,
  onOpenAddCustomCourse,
}) => {
  if (!isOpen) return null;

  const getTrackIcon = (id: CohortTrackId) => {
    switch (id) {
      case 'apple':
        return <span className="text-xl">🍎</span>;
      case 'aiml':
        return <span className="text-xl">🤖</span>;
      case 'cloud':
        return <span className="text-xl">☁️</span>;
      case 'cyber':
        return <span className="text-xl">🛡️</span>;
      case 'dual-nptel':
        return <span className="text-xl">🎓</span>;
      case 'custom':
        return <span className="text-xl">⚙️</span>;
      case 'general':
      default:
        return <span className="text-xl">🌐</span>;
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-obsidian-950/80 backdrop-blur-md flex items-center justify-center p-3 sm:p-4 animate-fadeIn">
      <div 
        className="relative w-full max-w-2xl bg-obsidian-900 border border-white/10 rounded-2xl sm:rounded-3xl shadow-[0_0_50px_rgba(0,0,0,0.8)] overflow-hidden flex flex-col max-h-[92vh]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Ambient Top Glow */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-3/4 h-24 bg-cyan-500/10 blur-[50px] pointer-events-none" />

        {/* Modal Header */}
        <div className="flex items-center justify-between px-5 sm:px-6 py-4 sm:py-5 border-b border-white/10 bg-obsidian-850/90 relative z-10 flex-shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-cyan-500/20 border border-cyan-500/40 flex items-center justify-center text-cyan-300 shadow-[0_0_15px_rgba(6,182,212,0.3)]">
              <Layers className="w-5 h-5 text-cyan-400" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-base sm:text-lg font-bold text-white">
                  Choose Your 5th Sem Cohort / Section
                </h2>
                <span className="text-[10px] font-mono uppercase px-2 py-0.5 rounded-full bg-cyan-950 text-cyan-300 border border-cyan-800/60 font-semibold">
                  CU CSE
                </span>
              </div>
              <p className="text-xs text-slate-400 mt-0.5">
                Automatically adapts your Professional Electives while keeping all your entered marks intact.
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

        {/* Preserved Marks Banner */}
        <div className="px-5 sm:px-6 py-2.5 bg-emerald-950/40 border-b border-emerald-500/20 flex items-center gap-2.5 text-xs text-emerald-300">
          <ShieldCheck className="w-4 h-4 text-emerald-400 flex-shrink-0" />
          <span>
            <strong>Zero Data Loss:</strong> Switching tracks preserves all entered marks for Probability & Statistics, Java PBL, Computer Networks, CC-2, FSD-2, and Soft Skills.
          </span>
        </div>

        {/* Track Selection Grid */}
        <div className="p-4 sm:p-6 overflow-y-auto space-y-3 relative z-10 flex-1">
          {COHORT_TRACKS_INFO.map((track) => {
            const isSelected = track.id === currentTrackId;

            return (
              <div
                key={track.id}
                onClick={() => {
                  onSelectTrack(track.id);
                  onClose();
                }}
                className={`p-4 rounded-xl border transition-all cursor-pointer relative group flex flex-col sm:flex-row sm:items-center justify-between gap-3 ${
                  isSelected
                    ? 'bg-gradient-to-r from-cyan-950/70 to-indigo-950/70 border-cyan-500/60 shadow-[0_0_20px_rgba(6,182,212,0.2)]'
                    : 'bg-obsidian-850/60 hover:bg-obsidian-800 border-white/10 hover:border-white/20'
                }`}
              >
                <div className="flex items-start gap-3.5">
                  <div className={`w-11 h-11 rounded-xl flex items-center justify-center flex-shrink-0 border ${
                    isSelected 
                      ? 'bg-cyan-500/20 border-cyan-500/50 shadow-[0_0_12px_rgba(6,182,212,0.3)]' 
                      : 'bg-white/5 border-white/10 group-hover:border-white/20'
                  }`}>
                    {getTrackIcon(track.id)}
                  </div>

                  <div className="space-y-1">
                    <div className="flex items-center gap-2 flex-wrap">
                      <h3 className={`text-sm sm:text-base font-bold ${isSelected ? 'text-cyan-300' : 'text-white'}`}>
                        {track.name}
                      </h3>
                      <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full border ${
                        isSelected 
                          ? 'bg-cyan-950 text-cyan-300 border-cyan-700/60'
                          : 'bg-obsidian-900 text-slate-400 border-white/10'
                      }`}>
                        {track.badge}
                      </span>
                    </div>

                    <p className="text-xs text-slate-300 font-medium">
                      {track.shortDesc}
                    </p>

                    <div className="flex items-center gap-1.5 text-[11px] text-slate-400 pt-0.5">
                      <span className="text-cyan-400 font-mono">Electives:</span>
                      <span className="text-slate-300">{track.electiveHighlight}</span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-2 self-end sm:self-center flex-shrink-0">
                  {isSelected ? (
                    <span className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-cyan-500/20 border border-cyan-500/40 text-cyan-300 font-semibold text-xs shadow-[0_0_10px_rgba(6,182,212,0.25)]">
                      <Check className="w-4 h-4 text-cyan-400" />
                      Active Track
                    </span>
                  ) : (
                    <button
                      className="px-3.5 py-1.5 rounded-xl bg-white/5 hover:bg-white/10 text-slate-300 hover:text-white font-medium text-xs border border-white/10 group-hover:border-cyan-500/30 transition-all"
                    >
                      Switch Track
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>

        {/* Modal Footer: Add Custom Course Option */}
        <div className="px-5 sm:px-6 py-3.5 border-t border-white/10 bg-obsidian-850/90 flex flex-col sm:flex-row items-center justify-between gap-3 relative z-10 flex-shrink-0">
          <div className="text-xs text-slate-400 text-center sm:text-left">
            Have a specialized subject not listed here? You can create any custom course anytime.
          </div>

          <div className="flex items-center gap-2 w-full sm:w-auto justify-end">
            <button
              onClick={() => {
                onClose();
                onOpenAddCustomCourse();
              }}
              className="w-full sm:w-auto px-4 py-2 rounded-xl bg-gradient-to-r from-indigo-600/30 to-violet-600/30 hover:from-indigo-600/40 hover:to-violet-600/40 text-indigo-200 border border-indigo-500/40 text-xs font-semibold flex items-center justify-center gap-2 transition-all shadow-[0_0_15px_rgba(99,102,241,0.2)]"
            >
              <Settings2 className="w-3.5 h-3.5 text-indigo-400" />
              <span>+ Add Custom Subject</span>
            </button>
          </div>
        </div>

      </div>
    </div>
  );
};
