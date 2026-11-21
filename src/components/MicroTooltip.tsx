import React, { useState, useRef, useEffect, useCallback } from 'react';
import { createPortal } from 'react-dom';
import { HelpCircle, X, Sparkles } from 'lucide-react';

interface MicroTooltipProps {
  content: string;
  className?: string;
  side?: 'top' | 'bottom';
  title?: string;
}

export const MicroTooltip: React.FC<MicroTooltipProps> = ({ 
  content, 
  className = '',
  side = 'top',
  title
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [coords, setCoords] = useState<{
    top: number;
    left: number;
    width: number;
    arrowLeft: number;
    placement: 'top' | 'bottom';
  } | null>(null);

  const buttonRef = useRef<HTMLButtonElement>(null);
  const tooltipRef = useRef<HTMLDivElement>(null);

  // Parse header and body from content if "Title: Description" format is used
  const parsedHeader = title || (content.includes(': ') ? content.split(': ')[0] : '');
  const parsedBody = content.includes(': ') && !title ? content.split(': ').slice(1).join(': ') : content;

  const updatePosition = useCallback(() => {
    if (!buttonRef.current) return;
    const rect = buttonRef.current.getBoundingClientRect();
    
    // If trigger element has scrolled out of viewport, close it
    if (rect.bottom < 0 || rect.top > window.innerHeight) {
      setIsOpen(false);
      return;
    }

    const tooltipEl = tooltipRef.current;
    const viewportWidth = window.innerWidth;
    const viewportHeight = window.innerHeight;
    const padding = 12; // margin from viewport edges
    
    // Adaptive width: up to 280px on desktop, clamped on narrow mobile
    const targetWidth = Math.min(280, viewportWidth - padding * 2);
    const measuredHeight = tooltipEl ? tooltipEl.offsetHeight : 100;

    // Determine vertical placement (top vs bottom)
    let placement: 'top' | 'bottom' = side;
    const spaceAbove = rect.top;
    const spaceBelow = viewportHeight - rect.bottom;

    if (placement === 'top' && spaceAbove < measuredHeight + 16 && spaceBelow > spaceAbove) {
      placement = 'bottom';
    } else if (placement === 'bottom' && spaceBelow < measuredHeight + 16 && spaceAbove > spaceBelow) {
      placement = 'top';
    }

    // Calculate vertical position (fixed relative to viewport)
    let top = 0;
    if (placement === 'top') {
      top = rect.top - measuredHeight - 8;
    } else {
      top = rect.bottom + 8;
    }

    // Clamp top to viewport
    top = Math.max(padding, Math.min(top, viewportHeight - measuredHeight - padding));

    // Calculate horizontal position (centered on trigger button, clamped to viewport)
    const buttonCenter = rect.left + rect.width / 2;
    let left = buttonCenter - targetWidth / 2;

    // Clamp horizontally to stay within viewport
    if (left < padding) {
      left = padding;
    } else if (left + targetWidth > viewportWidth - padding) {
      left = viewportWidth - padding - targetWidth;
    }

    // Arrow pointer position relative to tooltip box
    const arrowLeft = Math.max(16, Math.min(buttonCenter - left, targetWidth - 16));

    setCoords({
      top,
      left,
      width: targetWidth,
      arrowLeft,
      placement
    });
  }, [side]);

  // Position calculation on open
  useEffect(() => {
    if (isOpen) {
      updatePosition();
      const raf = requestAnimationFrame(updatePosition);
      return () => cancelAnimationFrame(raf);
    } else {
      setCoords(null);
    }
  }, [isOpen, updatePosition]);

  // Update position on window scroll or resize
  useEffect(() => {
    if (!isOpen) return;

    const handleScrollOrResize = () => {
      updatePosition();
    };

    window.addEventListener('scroll', handleScrollOrResize, true);
    window.addEventListener('resize', handleScrollOrResize);

    return () => {
      window.removeEventListener('scroll', handleScrollOrResize, true);
      window.removeEventListener('resize', handleScrollOrResize);
    };
  }, [isOpen, updatePosition]);

  // Pointerdown outside listener (works for both mouse click and mobile touch)
  useEffect(() => {
    if (!isOpen) return;

    const handlePointerDown = (e: MouseEvent | TouchEvent) => {
      const target = e.target as Node;
      if (buttonRef.current && buttonRef.current.contains(target)) {
        return;
      }
      if (tooltipRef.current && tooltipRef.current.contains(target)) {
        return;
      }
      setIsOpen(false);
    };

    document.addEventListener('pointerdown', handlePointerDown);
    return () => {
      document.removeEventListener('pointerdown', handlePointerDown);
    };
  }, [isOpen]);

  // Close on Escape key
  useEffect(() => {
    if (!isOpen) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setIsOpen(false);
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen]);

  return (
    <>
      <button
        ref={buttonRef}
        type="button"
        onClick={(e) => {
          e.stopPropagation();
          e.preventDefault();
          setIsOpen(prev => !prev);
        }}
        onMouseEnter={() => {
          setIsOpen(true);
        }}
        onMouseLeave={() => {
          // On non-touch devices, hover opens it; tap on mobile toggles it
          if (window.matchMedia('(hover: hover)').matches) {
            setIsOpen(false);
          }
        }}
        className={`p-0.5 text-slate-400 hover:text-cyan-300 focus:outline-none transition-colors rounded-full active:scale-95 touch-manipulation inline-flex items-center justify-center cursor-pointer ${className}`}
        aria-label="More information"
        title="Click for quick guide"
      >
        <HelpCircle className="w-3.5 h-3.5 text-cyan-400/80 hover:text-cyan-300" />
      </button>

      {isOpen && typeof document !== 'undefined' && createPortal(
        <div 
          ref={tooltipRef}
          style={{
            position: 'fixed',
            top: coords ? `${coords.top}px` : '-9999px',
            left: coords ? `${coords.left}px` : '-9999px',
            width: coords ? `${coords.width}px` : '280px',
            zIndex: 99999,
          }}
          className="p-3 rounded-2xl bg-obsidian-950/98 border border-cyan-400/50 text-slate-100 text-xs leading-relaxed shadow-[0_12px_40px_rgba(0,0,0,0.9),0_0_25px_rgba(6,182,212,0.25)] backdrop-blur-2xl animate-fadeIn select-text pointer-events-auto"
          onClick={(e) => e.stopPropagation()}
          onMouseEnter={() => {
            if (window.matchMedia('(hover: hover)').matches) {
              setIsOpen(true);
            }
          }}
          onMouseLeave={() => {
            if (window.matchMedia('(hover: hover)').matches) {
              setIsOpen(false);
            }
          }}
        >
          {/* Header Row: Guide Title + Dismiss Button */}
          <div className="flex items-center justify-between gap-1 mb-1.5 pb-1 border-b border-white/10">
            <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-cyan-400 flex items-center gap-1">
              <Sparkles className="w-3 h-3 text-cyan-400" />
              <span>{parsedHeader || 'Quick Guide'}</span>
            </span>
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                setIsOpen(false);
              }}
              className="p-0.5 rounded text-slate-400 hover:text-white transition-colors"
              aria-label="Close tooltip"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Tooltip Content Body */}
          <p className="text-[11.5px] leading-relaxed text-slate-200">
            {parsedBody}
          </p>

          {/* Dynamic Pointer Arrow aligned with the trigger button */}
          {coords && (
            <div 
              style={{
                left: `${coords.arrowLeft}px`,
              }}
              className={`absolute -translate-x-1/2 w-0 h-0 border-x-[6px] border-x-transparent pointer-events-none ${
                coords.placement === 'bottom'
                  ? 'bottom-full border-b-[6px] border-b-cyan-400/70'
                  : 'top-full border-t-[6px] border-t-cyan-400/70'
              }`} 
            />
          )}
        </div>,
        document.body
      )}
    </>
  );
};
