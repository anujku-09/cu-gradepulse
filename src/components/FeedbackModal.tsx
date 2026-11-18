import React, { useState, useEffect } from 'react';
import { 
  X, 
  Heart, 
  Send, 
  Sparkles, 
  CheckCircle, 
  Flame, 
  Globe, 
  Mail, 
  ExternalLink,
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

    const payloadText = [
      `⭐ Rating: ${rating}/5 Stars`,
      `👤 From: ${studentName.trim() || 'Anonymous Student'} (${studentSection || defaultSection})`,
      `❤️ Hearts Sent: ${heartsCount} (Global Total: ${globalHearts})`,
      `📝 Review / Feedback:`,
      message.trim(),
      `🕒 Sent: ${new Date().toLocaleString()}`
    ].join('\n');

    // Instant delivery to Anuj's real-time developer stream (< 400ms)
    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 3500);

      await fetch('https://ntfy.sh/cu_gradepulse_feedback_anuj', {
        method: 'POST',
        signal: controller.signal,
        headers: {
          'Title': `CU GradePulse: ${rating}★ Review from ${studentName.trim() || 'Student'}`,
          'Priority': 'high',
          'Tags': 'heart,mortar_board,star'
        },
        body: payloadText
      });
      clearTimeout(timeoutId);
    } catch (err) {
      console.log('Instant notification logged:', err);
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
    }, 3800);
  };

  // Generate mailto link for students who want direct email client confirmation
  const mailtoUrl = `mailto:anujkushwah9876@gmail.com?subject=${encodeURIComponent(`❤️ CU GradePulse Feedback (${rating} Stars) - ${studentName || 'CU Student'}`)}&body=${encodeURIComponent(
    `Hi Anuj,\n\n${message || 'Great workspace for 5th sem!'}\n\nRating: ${rating}/5 Stars\nCohort: ${studentSection || defaultSection}\nHearts Sent: ${heartsCount}\n\n- ${studentName || 'A CU Student'}`
  )}`;

  return (
    <div className="fixed inset-0 z-[70] overflow-y-auto bg-obsidian-950/85 backdrop-blur-md flex items-center justify-center p-3 sm:p-4 animate-fadeIn">
      <div 
        className="relative w-full max-w-lg bg-obsidian-900 border border-white/10 rounded-2xl sm:rounded-3xl shadow-[0_0_50px_rgba(244,63,94,0.25)] overflow-hidden flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Top Header */}
        <div className="flex items-center justify-between px-5 sm:px-6 py-4 border-b border-white/10 bg-obsidian-850/90 relative z-10">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-rose-500/20 border border-rose-500/40 flex items-center justify-center text-rose-400 shadow-[0_0_15px_rgba(244,63,94,0.3)] flex-shrink-0">
              <Heart className="w-5 h-5 text-rose-400 fill-rose-500" />
            </div>
            <div>
              <h2 className="text-base sm:text-lg font-bold text-white flex items-center gap-2">
                <span>Support & Send Feedback</span>
              </h2>
              <p className="text-xs text-slate-400">
                Created with passion for CU CSE 2026 Batch by Anuj Kumar.
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

        {/* Modal Content */}
        <div className="p-5 sm:p-6 space-y-4">
          {submitted ? (
            <div className="py-6 text-center space-y-3 animate-fadeIn">
              <div className="w-16 h-16 mx-auto rounded-full bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center text-emerald-400 shadow-[0_0_25px_rgba(16,185,129,0.3)]">
                <CheckCircle className="w-8 h-8" />
              </div>
              <h3 className="text-xl font-bold text-white">
                Feedback Delivered Instantly! ❤️
              </h3>
              <p className="text-xs sm:text-sm text-slate-300 max-w-sm mx-auto leading-relaxed">
                Your message has been posted directly to <strong className="text-cyan-300">Anuj Kumar's Live Feed</strong>. Thank you for motivating the developer! 🚀
              </p>
              <div className="pt-2">
                <a
                  href="https://ntfy.sh/cu_gradepulse_feedback_anuj"
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-obsidian-850 hover:bg-obsidian-800 border border-white/10 text-xs text-cyan-300 font-mono transition-all"
                >
                  <ExternalLink className="w-3.5 h-3.5" />
                  <span>Verify on Live Developer Feed (ntfy.sh)</span>
                </a>
              </div>
            </div>
          ) : (
            <>
              {/* Recipient Destination Guarantee Banner */}
              <div className="p-3 rounded-xl bg-gradient-to-r from-obsidian-850 via-obsidian-800 to-obsidian-850 border border-cyan-500/30 flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs">
                <div className="flex items-center gap-2">
                  <div className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse flex-shrink-0" />
                  <div>
                    <span className="text-slate-400 text-[10px] uppercase font-mono block">Direct Destination:</span>
                    <span className="text-white font-bold text-xs flex items-center gap-1">
                      <UserCheck className="w-3.5 h-3.5 text-cyan-400" />
                      Anuj Kumar (Lead Developer)
                    </span>
                  </div>
                </div>
                <div className="flex items-center gap-1.5 text-[11px] font-mono text-cyan-300">
                  <Mail className="w-3 h-3 text-cyan-400" />
                  <span className="underline">anujkushwah9876@gmail.com</span>
                </div>
              </div>

              {/* Real-time Global Hearts Community Badge */}
              <div className="flex items-center justify-between p-3 rounded-xl bg-rose-950/30 border border-rose-500/30">
                <div className="flex items-center gap-2">
                  <Flame className="w-4 h-4 text-rose-400 animate-pulse flex-shrink-0" />
                  <span className="text-xs font-semibold text-rose-200">
                    Live Global Hearts Collected:
                  </span>
                </div>
                <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-rose-500/20 border border-rose-500/40 text-rose-300 font-mono font-extrabold text-sm shadow-[0_0_10px_rgba(244,63,94,0.2)]">
                  <span>❤️</span>
                  <span>{globalHearts > 0 ? globalHearts.toLocaleString() : '...'}</span>
                </div>
              </div>

              {/* Interactive Heart Button Hero */}
              <div className="p-4 rounded-2xl bg-gradient-to-br from-rose-950/40 via-obsidian-850 to-purple-950/40 border border-rose-500/30 text-center space-y-2">
                <span className="text-[11px] font-mono uppercase tracking-widest text-slate-400 block">
                  Tap Heart to Show Appreciation
                </span>

                <button
                  type="button"
                  onClick={handleHeartClick}
                  className={`inline-flex items-center justify-center p-3.5 sm:p-4 rounded-2xl bg-rose-500/20 hover:bg-rose-500/30 border border-rose-500/40 shadow-[0_0_25px_rgba(244,63,94,0.3)] transition-all active:scale-90 cursor-pointer ${
                    heartBurst ? 'scale-125' : 'scale-100 hover:scale-105'
                  }`}
                  title="Click to send love to Anuj"
                >
                  <Heart className={`w-8 h-8 text-rose-400 fill-rose-500 ${heartBurst ? 'animate-ping' : ''}`} />
                </button>

                <div className="flex items-center justify-center gap-1.5 text-sm font-bold font-mono text-rose-300">
                  <span>{heartsCount > 0 ? `❤️ ${heartsCount} Hearts Given By You!` : 'Tap heart to show love!'}</span>
                </div>
                <p className="text-[10px] text-slate-400 flex items-center justify-center gap-1">
                  <Globe className="w-3 h-3 text-cyan-400 inline" />
                  <span>Synced in real-time cloud storage. No login required.</span>
                </p>
              </div>

              {/* Feedback Form */}
              <form onSubmit={handleSubmitFeedback} className="space-y-3">
                {/* 5-Heart Star Rating */}
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                    How was your experience?
                  </label>
                  <div className="flex items-center gap-2">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <button
                        key={star}
                        type="button"
                        onClick={() => setRating(star)}
                        className={`p-2 rounded-xl border transition-all ${
                          rating >= star
                            ? 'bg-rose-950/80 border-rose-500/60 text-rose-300 shadow-[0_0_10px_rgba(244,63,94,0.2)]'
                            : 'bg-obsidian-850 border-white/10 text-slate-500 hover:border-white/20'
                        }`}
                      >
                        <Heart className={`w-4 h-4 sm:w-5 sm:h-5 ${rating >= star ? 'fill-rose-500 text-rose-400' : 'text-slate-500'}`} />
                      </button>
                    ))}
                    <span className="text-xs font-mono text-cyan-300 ml-1 font-bold">
                      {rating === 5 ? '5/5 Outstanding!' : `${rating}/5 Stars`}
                    </span>
                  </div>
                </div>

                {/* Name & Section */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                  <div>
                    <label className="block text-[11px] font-medium text-slate-300 mb-1">
                      Your Name / Nickname (Optional)
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. Rahul / CU Student"
                      value={studentName}
                      onChange={(e) => setStudentName(e.target.value)}
                      className="w-full px-3 py-2 rounded-xl bg-obsidian-850 border border-white/10 text-xs text-white focus:border-cyan-500 focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-medium text-slate-300 mb-1">
                      Section / Specialization
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. Apple / Core / IoT / AI"
                      value={studentSection}
                      onChange={(e) => setStudentSection(e.target.value)}
                      className="w-full px-3 py-2 rounded-xl bg-obsidian-850 border border-white/10 text-xs text-white focus:border-cyan-500 focus:outline-none"
                    />
                  </div>
                </div>

                {/* Feedback Message */}
                <div>
                  <label className="block text-[11px] font-medium text-slate-300 mb-1">
                    Your Review / Suggestions for Anuj:
                  </label>
                  <textarea
                    rows={3}
                    required
                    placeholder="Tell Anuj what you liked or what other subjects/features you want added next! Your words motivate the creator..."
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-obsidian-850 border border-white/10 text-xs text-white placeholder:text-slate-500 focus:border-rose-500 focus:outline-none resize-none leading-relaxed"
                  />
                </div>

                {/* Action Buttons: Instant Send + Direct Email option */}
                <div className="pt-2 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-2">
                  <a
                    href={mailtoUrl}
                    className="px-3 py-2 rounded-xl bg-obsidian-850 hover:bg-obsidian-800 text-slate-300 hover:text-cyan-300 text-xs font-semibold border border-white/10 flex items-center justify-center gap-1.5 transition-all"
                    title="Open in your default email app with pre-filled message"
                  >
                    <Mail className="w-3.5 h-3.5 text-cyan-400" />
                    <span>Send via Gmail / Mail App</span>
                  </a>

                  <div className="flex items-center justify-end gap-2">
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
                        <span>Sending (Instant)...</span>
                      ) : (
                        <>
                          <Send className="w-3.5 h-3.5" />
                          <span>Send Now ⚡</span>
                        </>
                      )}
                    </button>
                  </div>
                </div>
              </form>
            </>
          )}
        </div>
      </div>
    </div>
  );
};
