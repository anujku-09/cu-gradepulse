import React, { useState, useRef, useEffect } from 'react';
import { HelpCircle } from 'lucide-react';

interface MicroTooltipProps {
  content: string;
  className?: string;
  side?: 'top' | 'bottom';
}

export const MicroTooltip: React.FC<MicroTooltipProps> = ({ 
  content, 
  className = '',
  side = 'top'
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  // Close tooltip when clicking outside on mobile
  useEffect(() => {
    if (!isOpen) return;
    const handleClickOutside = (e: MouseEvent | TouchEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    document.addEventListener('touchstart', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('touchstart', handleClickOutside);
    };
  }, [isOpen]);

  return (
    <div 
      ref={containerRef}
      className={`relative inline-flex items-center ${className}`}
      onMouseEnter={() => setIsOpen(true)}
      onMouseLeave={() => setIsOpen(false)}
    >
      <button
        type="button"
        onClick={(e) => {
          e.stopPropagation();
          setIsOpen(prev => !prev);
        }}
        className="p-0.5 text-slate-400 hover:text-cyan-300 focus:outline-none transition-colors rounded-full"
        aria-label="More information"
      >
        <HelpCircle className="w-3.5 h-3.5 text-cyan-400/80 hover:text-cyan-300" />
      </button>

      {isOpen && (
        <div 
          className={`absolute z-50 w-56 sm:w-64 p-2.5 rounded-xl bg-obsidian-950/95 border border-cyan-500/40 text-slate-200 text-[11px] leading-relaxed shadow-[0_10px_25px_rgba(0,0,0,0.8)] backdrop-blur-xl animate-fadeIn pointer-events-auto ${
            side === 'bottom'
              ? 'top-full mt-1.5 left-1/2 -translate-x-1/2'
              : 'bottom-full mb-1.5 left-1/2 -translate-x-1/2'
          }`}
          onClick={(e) => e.stopPropagation()}
        >
          <div className="text-white font-semibold flex items-center gap-1 mb-1 text-[10px] uppercase font-mono text-cyan-400">
            <span>Quick Guide</span>
          </div>
          {content}
          <div 
            className={`absolute left-1/2 -translate-x-1/2 border-4 border-transparent ${
              side === 'bottom'
                ? 'bottom-full border-b-obsidian-950/95'
                : 'top-full border-t-obsidian-950/95'
            }`} 
          />
        </div>
      )}
    </div>
  );
};
