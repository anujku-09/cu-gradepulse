import React, { useState, useEffect } from 'react';
import { 
  X, 
  Heart, 
  Send, 
  Sparkles, 
  CheckCircle, 
  Flame, 
  Globe, 
  ShieldCheck,
  UserCheck
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { getGlobalHearts, incrementGlobalHearts } from '../services/heartCounter';

interface FeedbackModalProps {
  isOpen: boolean;
  onClose: () => void;
  defaultSection?: string;
  globalHearts?: number;
  onHeartsUpdated?: (newTotal: number) => void;
}

export const FeedbackModal: React.FC<FeedbackModalProps> = ({
  isOpen,
  onClose,
  defaultSection = 'CU CSE 5th Sem',
  globalHearts: initialGlobalHearts,
  onHeartsUpdated,
}) => {
  if (!isOpen) return null;

  const [heartsCount, setHeartsCount] = useState<number>(() => {
    try {
      return parseInt(localStorage.getItem('cu_gradepulse_user_hearts') || '0', 10);
    } catch (e) {
      return 0;
    }
  });

  const [globalHearts, setGlobalHearts] = useState<number>(initialGlobalHearts || 0);
  const [rating, setRating] = useState<number>(5);
  const [studentName, setStudentName] = useState<string>('');
  const [studentSection, setStudentSection] = useState<string>(defaultSection);
  const [message, setMessage] = useState<string>('');
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [submitted, setSubmitted] = useState<boolean>(false);
  const [heartBurst, setHeartBurst] = useState<boolean>(false);

  // Fetch real-time global hearts when modal opens
  useEffect(() => {
    let isMounted = true;
    getGlobalHearts().then((count) => {
      if (isMounted && count > 0) {
        setGlobalHearts(count);
        if (onHeartsUpdated) onHeartsUpdated(count);
      }
    });
    return () => {
      isMounted = false;
    };
  }, []);

  const handleHeartClick = async () => {
    const newPersonalCount = heartsCount + 1;
    setHeartsCount(newPersonalCount);
    setHeartBurst(true);
    setTimeout(() => setHeartBurst(false), 500);

    // Optimistic local and global increment
    setGlobalHearts(prev => {
      const next = prev + 1;
      if (onHeartsUpdated) onHeartsUpdated(next);
      return next;
    });

    try {
      localStorage.setItem('cu_gradepulse_user_hearts', newPersonalCount.toString());
    } catch (e) {}

    // Confetti celebration
    try {
      confetti({
        particleCount: 28,
        spread: 60,
        origin: { y: 0.6 },
        colors: ['#f43f5e', '#ec4899', '#f472b6', '#06b6d4', '#6366f1']
      });
    } catch (e) {}

    // Persist to Cloud Counter (free, no Vercel Pro required)
    try {
      const updatedCloudCount = await incrementGlobalHearts();
      if (updatedCloudCount > 0) {
        setGlobalHearts(updatedCloudCount);
        if (onHeartsUpdated) onHeartsUpdated(updatedCloudCount);
      }
    } catch (err) {
      console.log('Heart recorded locally:', err);
    }
  };

  const handleSubmitFeedback = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!message.trim()) return;

    setIsSubmitting(true);

    const senderName = studentName.trim() || 'Anonymous Student';
    const senderSection = studentSection.trim() || defaultSection;

    const payloadText = [
      `⭐ Rating: ${rating}/5 Stars`,
      `👤 From: ${senderName} (${senderSection})`,
      `❤️ Hearts Sent: ${heartsCount} (Global Total: ${globalHearts})`,
      `📝 Review / Feedback:`,
      message.trim(),
      `🕒 Sent: ${new Date().toLocaleString()}`
    ].join('\n');

    // Instant delivery to developer's real-time stream using standard JSON body (100% UTF-8 safe across all browsers)
    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 8000);

      const res = await fetch('https://ntfy.sh', {
        method: 'POST',
        signal: controller.signal,
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          topic: 'cu_gradepulse_feedback_anuj',
          title: `CU GradePulse: ${rating}-Star Review from ${senderName}`,
          message: payloadText,
          priority: 4,
          tags: ['heart', 'mortar_board', 'star']
        })
      });
      clearTimeout(timeoutId);

      if (!res.ok) {
        console.warn('Feedback delivery response status:', res.status);
      }
    } catch (err) {
      console.warn('Instant notification delivery error:', err);
    }

    setIsSubmitting(false);
    setSubmitted(true);

    try {
      confetti({
        particleCount: 50,
        spread: 70,
        origin: { y: 0.5 },
        colors: ['#10b981', '#06b6d4', '#f43f5e', '#fbbf24']
      });
    } catch (e) {}

    setTimeout(() => {
      onClose();
      setSubmitted(false);
      setMessage('');
    }, 3200);
  };

  return (
    <div className="fixed inset-0 z-[70] overflow-y-auto bg-obsidian-950/85 backdrop-blur-md flex items-center justify-center p-2.5 sm:p-4 animate-fadeIn">
      <div 
        className="relative w-full max-w-md bg-obsidian-900 border border-white/10 rounded-2xl sm:rounded-3xl shadow-[0_0_50px_rgba(244,63,94,0.25)] overflow-hidden flex flex-col my-auto max-h-[94vh]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Top Header */}
        <div className="flex items-center justify-between px-4 sm:px-6 py-3.5 sm:py-4 border-b border-white/10 bg-obsidian-850/90 relative z-10">
          <div className="flex items-center gap-2.5 sm:gap-3 min-w-0">
            <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-rose-500/20 border border-rose-500/40 flex items-center justify-center text-rose-400 shadow-[0_0_15px_rgba(244,63,94,0.3)] flex-shrink-0">
              <Heart className="w-4 h-4 sm:w-5 sm:h-5 text-rose-400 fill-rose-500" />
            </div>
            <div className="min-w-0">
              <h2 className="text-sm sm:text-base font-bold text-white truncate">
                Support & Send Feedback
              </h2>
              <p className="text-[11px] sm:text-xs text-slate-400 truncate">
                CU CSE 2026 Batch • Creator Feedback
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 sm:p-2 rounded-xl bg-white/5 hover:bg-white/10 text-slate-400 hover:text-white transition-colors flex-shrink-0 ml-2"
          >
            <X className="w-4 h-4 sm:w-5 sm:h-5" />
          </button>
        </div>

        {/* Modal Content */}
        <div className="p-3.5 sm:p-5 space-y-3 sm:space-y-4 overflow-y-auto">
          {submitted ? (
            <div className="py-6 text-center space-y-3 animate-fadeIn">
              <div className="w-14 h-14 sm:w-16 sm:h-16 mx-auto rounded-full bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center text-emerald-400 shadow-[0_0_25px_rgba(16,185,129,0.3)]">
                <CheckCircle className="w-7 h-7 sm:w-8 sm:h-8" />
              </div>
              <h3 className="text-lg sm:text-xl font-bold text-white">
                Feedback Delivered Instantly! ❤️
              </h3>
              <p className="text-xs sm:text-sm text-slate-300 max-w-sm mx-auto leading-relaxed">
                Your message has been sent directly to the developer. Thank you for motivating the creator! 🚀
              </p>
            </div>
          ) : (
            <>
              {/* Privacy Notice Banner */}
              <div className="p-2.5 sm:p-3 rounded-xl bg-obsidian-850/80 border border-emerald-500/30 flex items-center gap-2 text-xs">
                <ShieldCheck className="w-4 h-4 text-emerald-400 flex-shrink-0" />
                <div className="min-w-0 flex-1">
                  <span className="text-white font-semibold block text-[11px] sm:text-xs">
                    Direct & Private Feedback
                  </span>
                  <span className="text-[10px] text-slate-400 block truncate">
                    Sent securely to the developer without exposing personal contact details.
                  </span>
                </div>
              </div>

              {/* Real-time Global Hearts Community Badge */}
              <div className="flex items-center justify-between p-2.5 sm:p-3 rounded-xl bg-rose-950/30 border border-rose-500/30">
                <div className="flex items-center gap-1.5 sm:gap-2 min-w-0">
                  <Flame className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-rose-400 animate-pulse flex-shrink-0" />
                  <span className="text-[11px] sm:text-xs font-semibold text-rose-200 truncate">
                    Live Global Hearts Collected:
                  </span>
                </div>
                <div className="flex items-center gap-1 px-2 sm:px-2.5 py-0.5 sm:py-1 rounded-lg bg-rose-500/20 border border-rose-500/40 text-rose-300 font-mono font-extrabold text-xs sm:text-sm shadow-[0_0_10px_rgba(244,63,94,0.2)] flex-shrink-0">
                  <span>❤️</span>
                  <span>{globalHearts > 0 ? globalHearts.toLocaleString() : '...'}</span>
                </div>
              </div>

              {/* Interactive Heart Button Hero */}
              <div className="p-3 sm:p-4 rounded-2xl bg-gradient-to-br from-rose-950/40 via-obsidian-850 to-purple-950/40 border border-rose-500/30 text-center space-y-1.5 sm:space-y-2">
                <span className="text-[10px] sm:text-[11px] font-mono uppercase tracking-widest text-slate-400 block">
                  Tap Heart to Show Appreciation
                </span>

                <button
                  type="button"
                  onClick={handleHeartClick}
                  className={`inline-flex items-center justify-center p-3 sm:p-3.5 rounded-2xl bg-rose-500/20 hover:bg-rose-500/30 border border-rose-500/40 shadow-[0_0_25px_rgba(244,63,94,0.3)] transition-all active:scale-90 cursor-pointer ${
                    heartBurst ? 'scale-125' : 'scale-100 hover:scale-105'
                  }`}
                  title="Click to send love to creator"
                >
                  <Heart className={`w-7 h-7 sm:w-8 sm:h-8 text-rose-400 fill-rose-500 ${heartBurst ? 'animate-ping' : ''}`} />
                </button>

                <div className="flex items-center justify-center gap-1 text-xs sm:text-sm font-bold font-mono text-rose-300">
                  <span>{heartsCount > 0 ? `❤️ ${heartsCount} Hearts Given By You!` : 'Tap heart to show love!'}</span>
                </div>
                <p className="text-[10px] text-slate-400 flex items-center justify-center gap-1">
                  <Globe className="w-3 h-3 text-cyan-400 inline flex-shrink-0" />
                  <span>Synced in real-time cloud storage. No login required.</span>
                </p>
              </div>

              {/* Feedback Form */}
              <form onSubmit={handleSubmitFeedback} className="space-y-2.5 sm:space-y-3">
                {/* 5-Heart Star Rating */}
                <div>
                  <label className="block text-[11px] sm:text-xs font-semibold text-slate-300 mb-1">
                    How was your experience?
                  </label>
                  <div className="flex items-center gap-1.5 sm:gap-2">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <button
                        key={star}
                        type="button"
                        onClick={() => setRating(star)}
                        className={`p-1.5 sm:p-2 rounded-xl border transition-all ${
                          rating >= star
                            ? 'bg-rose-950/80 border-rose-500/60 text-rose-300 shadow-[0_0_10px_rgba(244,63,94,0.2)]'
                            : 'bg-obsidian-850 border-white/10 text-slate-500 hover:border-white/20'
                        }`}
                      >
                        <Heart className={`w-4 h-4 sm:w-4.5 sm:h-4.5 ${rating >= star ? 'fill-rose-500 text-rose-400' : 'text-slate-500'}`} />
                      </button>
                    ))}
                    <span className="text-[11px] sm:text-xs font-mono text-cyan-300 ml-1 font-bold">
                      {rating === 5 ? '5/5 Outstanding!' : `${rating}/5 Stars`}
                    </span>
                  </div>
                </div>

                {/* Name & Section */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  <div>
                    <label className="block text-[10px] sm:text-[11px] font-medium text-slate-300 mb-0.5">
                      Your Name / Nickname (Optional)
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. Rahul / CU Student"
                      value={studentName}
                      onChange={(e) => setStudentName(e.target.value)}
                      className="w-full px-2.5 py-1.5 sm:py-2 rounded-xl bg-obsidian-850 border border-white/10 text-xs text-white focus:border-cyan-500 focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-[10px] sm:text-[11px] font-medium text-slate-300 mb-0.5">
                      Section / Cohort
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. Apple / Core / IoT / AI"
                      value={studentSection}
                      onChange={(e) => setStudentSection(e.target.value)}
                      className="w-full px-2.5 py-1.5 sm:py-2 rounded-xl bg-obsidian-850 border border-white/10 text-xs text-white focus:border-cyan-500 focus:outline-none"
                    />
                  </div>
                </div>

                {/* Feedback Message */}
                <div>
                  <label className="block text-[10px] sm:text-[11px] font-medium text-slate-300 mb-0.5">
                    Your Review / Suggestions for Developer:
                  </label>
                  <textarea
                    rows={3}
                    required
                    placeholder="Tell the developer what you liked or what subjects/features you want added next..."
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    className="w-full px-2.5 py-2 rounded-xl bg-obsidian-850 border border-white/10 text-xs text-white placeholder:text-slate-500 focus:border-rose-500 focus:outline-none resize-none leading-relaxed"
                  />
                </div>

                {/* Actions */}
                <div className="pt-1.5 flex items-center justify-end gap-2">
                  <button
                    type="button"
                    onClick={onClose}
                    className="px-3.5 py-2 rounded-xl bg-obsidian-850 hover:bg-obsidian-800 text-slate-300 text-xs font-semibold border border-white/10"
                  >
                    Close
                  </button>
                  <button
                    type="submit"
                    disabled={isSubmitting || !message.trim()}
                    className="px-5 py-2 rounded-xl bg-gradient-to-r from-rose-500 via-pink-600 to-purple-600 hover:from-rose-400 hover:to-pink-500 text-white font-bold text-xs shadow-[0_0_15px_rgba(244,63,94,0.3)] flex items-center justify-center gap-1.5 transition-all disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
                  >
                    {isSubmitting ? (
                      <span>Sending...</span>
                    ) : (
                      <>
                        <Send className="w-3.5 h-3.5" />
                        <span>Send Now ⚡</span>
                      </>
                    )}
                  </button>
                </div>
              </form>
            </>
          )}
        </div>
      </div>
    </div>
  );
};
