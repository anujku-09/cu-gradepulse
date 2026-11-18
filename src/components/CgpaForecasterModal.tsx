import React, { useState } from 'react';
import { 
  X, 
  TrendingUp, 
  Award, 
  HelpCircle, 
  CheckCircle2, 
  Layers, 
  ArrowUpRight, 
  ArrowDownRight,
  Info
} from 'lucide-react';
import { calculateCgpaForecast } from '../utils/gradeCalculations';

interface CgpaForecasterModalProps {
  currentSgpa: number;
  semesterCredits: number;
  isOpen: boolean;
  onClose: () => void;
  previousCgpa: number;
  previousCredits: number;
  onSavePreferences: (cgpa: number, credits: number) => void;
}

export const CgpaForecasterModal: React.FC<CgpaForecasterModalProps> = ({
  currentSgpa,
  semesterCredits,
  isOpen,
  onClose,
  previousCgpa,
  previousCredits,
  onSavePreferences,
}) => {
  if (!isOpen) return null;

  const [prevCgpaInput, setPrevCgpaInput] = useState<number>(previousCgpa);
  const [prevCreditsInput, setPrevCreditsInput] = useState<number>(previousCredits);

  const forecast = calculateCgpaForecast(
    prevCgpaInput,
    prevCreditsInput,
    currentSgpa,
    semesterCredits
  );

  const handleApply = () => {
    onSavePreferences(prevCgpaInput, prevCreditsInput);
    onClose();
  };

  // Milestone targets
  const milestones = [
    { label: 'First Class', target: 7.50 },
    { label: 'Distinction', target: 8.00 },
    { label: 'Honors', target: 8.50 },
    { label: 'Merit Tier', target: 9.00 },
  ];

  return (
    <div className="fixed inset-0 z-[70] overflow-y-auto bg-obsidian-950/85 backdrop-blur-md flex items-center justify-center p-3 sm:p-4 animate-fadeIn">
      <div className="relative w-full max-w-xl bg-obsidian-900 border border-white/10 rounded-2xl shadow-2xl p-4 sm:p-6 overflow-hidden max-h-[92vh] flex flex-col justify-between my-auto">
        
        {/* Glow ambient background */}
        <div className="absolute -top-16 -right-16 w-56 h-56 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />

        {/* Modal Header */}
        <div className="flex items-start sm:items-center justify-between pb-3 sm:pb-4 border-b border-white/10 gap-2.5 flex-shrink-0">
          <div className="flex items-center gap-2 sm:gap-2.5 min-w-0">
            <div className="p-2 rounded-xl bg-emerald-950/80 border border-emerald-500/40 text-emerald-400 shadow-[0_0_15px_rgba(16,185,129,0.3)] flex-shrink-0">
              <TrendingUp className="w-4 h-4 sm:w-5 sm:h-5" />
            </div>
            <div className="min-w-0">
              <h2 className="text-sm sm:text-lg font-bold text-white flex items-center gap-1.5 sm:gap-2 flex-wrap">
                <span>Cumulative CGPA Forecaster</span>
                <span className="text-[9px] sm:text-[10px] uppercase font-mono px-1.5 py-0.2 rounded bg-emerald-900/60 text-emerald-300 border border-emerald-700/60">
                  Projection
                </span>
              </h2>
              <p className="text-[10px] sm:text-xs text-slate-400 truncate">
                Simulate degree CGPA shift with this semester's marks
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-lg bg-obsidian-800 hover:bg-obsidian-700 text-slate-400 hover:text-white transition-colors touch-manipulation flex-shrink-0"
            title="Close forecaster"
          >
            <X className="w-4 h-4 sm:w-5 sm:h-5" />
          </button>
        </div>

        {/* Scrollable Modal Body on Small Mobile Viewports */}
        <div className="flex-1 overflow-y-auto space-y-3.5 sm:space-y-4 my-3 pr-1 custom-scrollbar">
          {/* Forecast Hero Display */}
          <div className="p-3.5 sm:p-5 rounded-xl bg-obsidian-850/90 border border-emerald-500/30 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 shadow-[0_0_25px_rgba(16,185,129,0.15)]">
            <div>
              <span className="text-[10px] sm:text-xs font-mono uppercase text-slate-400 font-semibold tracking-wider">
                Projected Overall CGPA
              </span>
              <div className="flex items-baseline gap-2 mt-0.5 sm:mt-1">
                <span className="text-3xl sm:text-5xl font-extrabold font-mono text-emerald-400">
                  {forecast.predictedCgpa.toFixed(2)}
                </span>
                <span className="text-sm sm:text-lg font-mono text-slate-400">/ 10.0</span>
              </div>
              <div className="flex items-center gap-1.5 sm:gap-2 mt-1 sm:mt-1.5 text-[11px] sm:text-xs font-mono flex-wrap text-slate-400">
                <span>Prev: {prevCgpaInput.toFixed(2)}</span>
                <span className="text-slate-600">•</span>
                <span>Sem SGPA: {currentSgpa.toFixed(2)}</span>
              </div>
            </div>

            <div className="flex sm:flex-col items-center sm:items-end justify-between w-full sm:w-auto pt-2 sm:pt-0 border-t sm:border-t-0 border-white/5">
              <span className={`px-2.5 sm:px-3 py-1 sm:py-1.5 rounded-xl font-mono text-xs sm:text-sm font-bold flex items-center gap-1 border ${
                forecast.cgpaDelta >= 0 
                  ? 'bg-emerald-950/80 text-emerald-400 border-emerald-500/40 shadow-[0_0_15px_rgba(16,185,129,0.3)]' 
                  : 'bg-rose-950/80 text-rose-400 border-rose-500/40'
              }`}>
                {forecast.cgpaDelta >= 0 ? <ArrowUpRight className="w-3.5 h-3.5 sm:w-4 sm:h-4" /> : <ArrowDownRight className="w-3.5 h-3.5 sm:w-4 sm:h-4" />}
                {forecast.cgpaDelta >= 0 ? `+${forecast.cgpaDelta.toFixed(2)}` : forecast.cgpaDelta.toFixed(2)} CGPA
              </span>
              <span className="text-[10px] text-slate-400 sm:mt-1 font-mono">
                Net Shift
              </span>
            </div>
          </div>

          {/* Inputs for Previous History */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 sm:gap-4">
            <div className="p-3 sm:p-3.5 rounded-xl bg-obsidian-850/60 border border-white/5 space-y-1">
              <label className="text-xs font-semibold text-slate-300 block">
                Previous CGPA (till Sem IV)
              </label>
              <div className="flex items-center gap-2">
                <input
                  type="number"
                  min="0"
                  max="10"
                  step="0.01"
                  value={prevCgpaInput}
                  onChange={(e) => setPrevCgpaInput(parseFloat(e.target.value) || 0)}
                  className="w-full px-3 py-1.5 rounded-lg num-input text-sm font-bold bg-obsidian-900 border border-white/10 text-white"
                />
              </div>
              <span className="text-[10px] text-slate-400 font-mono block">Scale: 0.00 to 10.00</span>
            </div>

            <div className="p-3 sm:p-3.5 rounded-xl bg-obsidian-850/60 border border-white/5 space-y-1">
              <label className="text-xs font-semibold text-slate-300 block">
                Completed Credits
              </label>
              <div className="flex items-center gap-2">
                <input
                  type="number"
                  min="0"
                  max="180"
                  step="1"
                  value={prevCreditsInput}
                  onChange={(e) => setPrevCreditsInput(parseFloat(e.target.value) || 0)}
                  className="w-full px-3 py-1.5 rounded-lg num-input text-sm font-bold bg-obsidian-900 border border-white/10 text-white"
                />
              </div>
              <span className="text-[10px] text-slate-400 font-mono block">Typically 76 to 84 credits</span>
            </div>
          </div>

          {/* Milestone Targets Status */}
          <div className="space-y-1.5 sm:space-y-2">
            <span className="text-xs font-semibold text-slate-300 uppercase tracking-wider font-mono block">
              Degree Milestone Standing
            </span>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {milestones.map((m) => {
                const reached = forecast.predictedCgpa >= m.target;
                return (
                  <div
                    key={m.target}
                    className={`p-2.5 rounded-xl border flex items-center justify-between text-xs ${
                      reached
                        ? 'bg-emerald-950/30 border-emerald-500/30 text-emerald-300'
                        : 'bg-obsidian-850/40 border-white/5 text-slate-400'
                    }`}
                  >
                    <div className="flex items-center gap-2">
                      <Award className={`w-4 h-4 flex-shrink-0 ${reached ? 'text-emerald-400' : 'text-slate-500'}`} />
                      <div>
                        <div className="font-semibold text-slate-200">{m.label}</div>
                        <div className="text-[10px] font-mono opacity-80">Target ≥ {m.target.toFixed(2)}</div>
                      </div>
                    </div>
                    <div>
                      {reached ? (
                        <span className="text-[10px] font-bold font-mono text-emerald-400 px-2 py-0.5 rounded bg-emerald-950/80 border border-emerald-500/30">
                          Unlocked
                        </span>
                      ) : (
                        <span className="text-[10px] font-mono text-slate-400">
                          Need +{(m.target - forecast.predictedCgpa).toFixed(2)}
                        </span>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Footer Actions (Responsive Stacking for Mobile) */}
        <div className="pt-3 sm:pt-4 border-t border-white/10 flex flex-col-reverse xs:flex-row items-stretch xs:items-center justify-between gap-2 flex-shrink-0">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-xl bg-obsidian-800 hover:bg-obsidian-700 text-slate-300 text-xs font-semibold border border-white/10 transition-colors text-center"
          >
            Cancel
          </button>

          <button
            onClick={handleApply}
            className="px-5 py-2.5 sm:py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold transition-all shadow-[0_0_15px_rgba(16,185,129,0.3)] text-center"
          >
            Save Forecaster Preferences
          </button>
        </div>

      </div>
    </div>
  );
};
