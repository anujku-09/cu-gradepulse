import React, { useState } from 'react';
import { 
  X, 
  Heart, 
  Send, 
  Sparkles, 
  CheckCircle, 
  MessageSquare,
  Award,
  Flame,
  ThumbsUp
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { track } from '@vercel/analytics';

interface FeedbackModalProps {
  isOpen: boolean;
  onClose: () => void;
  defaultSection?: string;
}

export const FeedbackModal: React.FC<FeedbackModalProps> = ({
  isOpen,
  onClose,
  defaultSection = 'CU CSE 5th Sem',
}) => {
  if (!isOpen) return null;

  const [heartsCount, setHeartsCount] = useState<number>(() => {
    try {
      return parseInt(localStorage.getItem('cu_gradepulse_user_hearts') || '0', 10);
    } catch (e) {
      return 0;
    }
  });
  const [rating, setRating] = useState<number>(5);
  const [studentName, setStudentName] = useState<string>('');
  const [studentSection, setStudentSection] = useState<string>(defaultSection);
  const [message, setMessage] = useState<string>('');
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [submitted, setSubmitted] = useState<boolean>(false);
  const [heartBurst, setHeartBurst] = useState<boolean>(false);

  const handleHeartClick = () => {
    const newCount = heartsCount + 1;
    setHeartsCount(newCount);
    setHeartBurst(true);
    setTimeout(() => setHeartBurst(false), 600);

    try {
      localStorage.setItem('cu_gradepulse_user_hearts', newCount.toString());
    } catch (e) {}

    // Send custom heart event to Vercel Analytics
    try {
      track('heart_click', { totalHeartsGiven: newCount });
    } catch (e) {}

    // Confetti celebration
    try {
      confetti({
        particleCount: 25,
        spread: 50,
        origin: { y: 0.6 },
        colors: ['#f43f5e', '#ec4899', '#f472b6', '#06b6d4', '#6366f1']
      });
    } catch (e) {}
  };

  const handleSubmitFeedback = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    // Track on Vercel Analytics
    try {
      track('student_feedback', {
        rating,
        section: studentSection,
        messageLength: message.length,
      });
    } catch (e) {}

    // Deliver to Anuj's email via FormSubmit AJAX endpoint
    try {
      await fetch('https://formsubmit.co/ajax/anujkushwah9876@gmail.com', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: JSON.stringify({
          _subject: `❤️ CU GradePulse Feedback: ${rating}★ from ${studentName || 'A CU Student'}`,
          studentName: studentName || 'Anonymous Student',
          section: studentSection || defaultSection,
          rating: `${rating} / 5 Hearts`,
          heartsSent: heartsCount,
          feedbackMessage: message,
          submittedAt: new Date().toLocaleString()
        })
      });
    } catch (err) {
      console.log('Form submission completed with client tracking:', err);
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
    }, 2800);
  };

  return (
    <div className="fixed inset-0 z-[70] overflow-y-auto bg-obsidian-950/85 backdrop-blur-md flex items-center justify-center p-3 sm:p-4 animate-fadeIn">
      <div 
        className="relative w-full max-w-lg bg-obsidian-900 border border-white/10 rounded-2xl sm:rounded-3xl shadow-[0_0_50px_rgba(244,63,94,0.25)] overflow-hidden flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Top Header */}
        <div className="flex items-center justify-between px-5 sm:px-6 py-4 border-b border-white/10 bg-obsidian-850/90 relative z-10">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-rose-500/20 border border-rose-500/40 flex items-center justify-center text-rose-400 shadow-[0_0_15px_rgba(244,63,94,0.3)]">
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
        <div className="p-5 sm:p-6 space-y-5">
          {submitted ? (
            <div className="py-8 text-center space-y-3 animate-fadeIn">
              <div className="w-16 h-16 mx-auto rounded-full bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center text-emerald-400 shadow-[0_0_25px_rgba(16,185,129,0.3)]">
                <CheckCircle className="w-8 h-8" />
              </div>
              <h3 className="text-xl font-bold text-white">
                Thank You So Much! ❤️
              </h3>
              <p className="text-xs sm:text-sm text-slate-300 max-w-sm mx-auto leading-relaxed">
                Your hearts and motivational feedback have been delivered straight to Anuj. Keep crushing your 5th semester! 🚀
              </p>
            </div>
          ) : (
            <>
              {/* Interactive Heart Button Hero */}
              <div className="p-4 rounded-2xl bg-gradient-to-br from-rose-950/40 via-obsidian-850 to-purple-950/40 border border-rose-500/30 text-center space-y-2">
                <span className="text-[11px] font-mono uppercase tracking-widest text-slate-400 block">
                  Tap to Send Hearts to Creator
                </span>

                <button
                  type="button"
                  onClick={handleHeartClick}
                  className={`inline-flex items-center justify-center p-4 rounded-2xl bg-rose-500/20 hover:bg-rose-500/30 border border-rose-500/40 shadow-[0_0_25px_rgba(244,63,94,0.3)] transition-all active:scale-90 cursor-pointer ${
                    heartBurst ? 'scale-125' : 'scale-100 hover:scale-105'
                  }`}
                  title="Click to send love to the developer"
                >
                  <Heart className={`w-8 h-8 text-rose-400 fill-rose-500 ${heartBurst ? 'animate-ping' : ''}`} />
                </button>

                <div className="flex items-center justify-center gap-1.5 text-sm font-bold font-mono text-rose-300">
                  <span>{heartsCount > 0 ? `❤️ ${heartsCount} Hearts Sent By You!` : 'Tap heart to show love!'}</span>
                </div>
                <p className="text-[10px] text-slate-400">
                  Every tap is logged on Vercel Analytics to show Anuj how many students love GradePulse.
                </p>
              </div>

              {/* Feedback Form */}
              <form onSubmit={handleSubmitFeedback} className="space-y-3.5">
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
                        <Heart className={`w-5 h-5 ${rating >= star ? 'fill-rose-500 text-rose-400' : 'text-slate-500'}`} />
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
                    placeholder="Tell me what you liked or what other subjects/features you want me to add next! Your feedback motivates me..."
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-obsidian-850 border border-white/10 text-xs text-white placeholder:text-slate-500 focus:border-rose-500 focus:outline-none resize-none leading-relaxed"
                  />
                </div>

                {/* Submit button */}
                <div className="pt-2 flex items-center justify-end gap-2">
                  <button
                    type="button"
                    onClick={onClose}
                    className="px-4 py-2 rounded-xl bg-obsidian-850 hover:bg-obsidian-800 text-slate-300 text-xs font-semibold border border-white/10"
                  >
                    Close
                  </button>
                  <button
                    type="submit"
                    disabled={isSubmitting || !message.trim()}
                    className="px-5 py-2 rounded-xl bg-gradient-to-r from-rose-500 via-pink-600 to-purple-600 hover:from-rose-400 hover:to-pink-500 text-white font-bold text-xs shadow-[0_0_15px_rgba(244,63,94,0.3)] flex items-center gap-1.5 transition-all disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
                  >
                    {isSubmitting ? (
                      <span>Sending...</span>
                    ) : (
                      <>
                        <Send className="w-3.5 h-3.5" />
                        <span>Send Feedback & Hearts</span>
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
