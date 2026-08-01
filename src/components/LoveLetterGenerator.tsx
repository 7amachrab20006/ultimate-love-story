import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Sparkles, Heart, Feather, Copy, Check, Download, RefreshCw, Wand2, Calendar, MapPin, MessageSquare, BookOpen } from 'lucide-react';
import confetti from 'canvas-confetti';
import { MILESTONES } from '../data/relationshipData';
import { sounds } from '../utils/soundEffects';

interface LoveLetterGeneratorProps {
  themeMode?: 'night' | 'day';
}

interface GeneratedLetterData {
  title: string;
  quote: string;
  letter: string;
  highlights: string[];
}

export const LoveLetterGenerator: React.FC<LoveLetterGeneratorProps> = ({ themeMode = 'night' }) => {
  const [selectedMilestoneIds, setSelectedMilestoneIds] = useState<string[]>(
    MILESTONES.map((m) => m.id)
  );
  const [recipient, setRecipient] = useState<string>('Asma');
  const [sender, setSender] = useState<string>('Mohamed');
  const [tone, setTone] = useState<string>('Deeply Romantic & Heartfelt');
  const [customNote, setCustomNote] = useState<string>('');

  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [letterData, setLetterData] = useState<GeneratedLetterData | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [copied, setCopied] = useState<boolean>(false);

  const tones = [
    { id: 'Deeply Romantic & Heartfelt', label: '💖 Deeply Romantic', desc: 'Heartfelt devotion & eternal warmth' },
    { id: 'Poetic & Dreamy', label: '🌙 Poetic & Dreamy', desc: 'Swaying metaphors & starry atmosphere' },
    { id: 'Flirty & Passionate', label: '🔥 Flirty & Passionate', desc: 'Intense longing & playful spark' },
    { id: 'Soulful & Eternal', label: '✨ Soulful & Eternal', desc: 'Destiny, home, and lifetime vows' }
  ];

  const toggleMilestone = (id: string) => {
    sounds.playClick();
    if (selectedMilestoneIds.includes(id)) {
      if (selectedMilestoneIds.length === 1) return; // keep at least 1
      setSelectedMilestoneIds(selectedMilestoneIds.filter((mId) => mId !== id));
    } else {
      setSelectedMilestoneIds([...selectedMilestoneIds, id]);
    }
  };

  const handleSelectAll = () => {
    sounds.playClick();
    setSelectedMilestoneIds(MILESTONES.map((m) => m.id));
  };

  const handleGenerate = async () => {
    sounds.playChime();
    setIsLoading(true);
    setError(null);
    setLetterData(null);

    const chosenMilestones = MILESTONES.filter((m) => selectedMilestoneIds.includes(m.id));

    try {
      const res = await fetch('/api/generate-love-letter', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          recipient,
          sender,
          tone,
          milestones: chosenMilestones,
          customNote
        })
      });

      if (!res.ok) {
        const errJson = await res.json().catch(() => ({}));
        throw new Error(errJson.error || errJson.details || 'Failed to generate love letter');
      }

      const data: GeneratedLetterData = await res.json();
      setLetterData(data);
      sounds.playVictoryFanfare();

      // Trigger romantic confetti blast
      confetti({
        particleCount: 80,
        spread: 70,
        origin: { y: 0.6 },
        colors: ['#f43f5e', '#fbbf24', '#f472b6', '#ec4899']
      });
    } catch (err: any) {
      console.error(err);
      setError(err.message || 'Something went wrong while composing your letter.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleCopy = () => {
    if (!letterData) return;
    sounds.playClick();
    const fullText = `${letterData.title}\n\n"${letterData.quote}"\n\n${letterData.letter}\n\nKey Moments Highlighted:\n${letterData.highlights.map(h => `• ${h}`).join('\n')}`;
    navigator.clipboard.writeText(fullText);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  const handleDownload = () => {
    if (!letterData) return;
    sounds.playClick();
    const fullText = `${letterData.title}\n\n"${letterData.quote}"\n\n${letterData.letter}\n\nWith all my love,\n${sender}`;
    const blob = new Blob([fullText], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `Love_Letter_${recipient}_from_${sender}.txt`;
    link.click();
    URL.revokeObjectURL(url);
  };

  return (
    <section id="ai-love-letter" className="py-20 px-4 sm:px-6 max-w-5xl mx-auto relative">
      {/* Title Header */}
      <div className="text-center max-w-2xl mx-auto mb-12">
        <span className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs font-semibold uppercase tracking-widest mb-3">
          <Wand2 className="w-3.5 h-3.5 text-amber-300" />
          AI Memory Composer
        </span>
        <h2 className="font-serif text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight text-slate-100 mb-4">
          AI Love Letter Generator
        </h2>
        <p className="text-slate-300 text-sm sm:text-base leading-relaxed">
          Transform your real milestone chapters—from coffee on the beach to starry lookouts—into a custom, deeply emotional love letter powered by Gemini AI.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Controls Panel */}
        <div className={`lg:col-span-5 p-6 sm:p-8 rounded-3xl border border-rose-500/20 shadow-2xl ${
          themeMode === 'night' ? 'bg-slate-900/80 backdrop-blur-xl' : 'bg-slate-900/90 text-slate-100'
        }`}>
          <h3 className="font-serif text-xl font-bold text-rose-200 mb-6 flex items-center gap-2">
            <Feather className="w-5 h-5 text-rose-400" />
            Customize Your Letter
          </h3>

          {/* Names Input */}
          <div className="grid grid-cols-2 gap-4 mb-5">
            <div>
              <label className="block text-xs font-medium text-slate-400 mb-1.5">Recipient</label>
              <input
                type="text"
                value={recipient}
                onChange={(e) => setRecipient(e.target.value)}
                className="w-full px-3.5 py-2 rounded-xl bg-slate-950 border border-slate-800 text-white text-sm focus:border-rose-500 focus:outline-none"
                placeholder="Asma"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-slate-400 mb-1.5">From</label>
              <input
                type="text"
                value={sender}
                onChange={(e) => setSender(e.target.value)}
                className="w-full px-3.5 py-2 rounded-xl bg-slate-950 border border-slate-800 text-white text-sm focus:border-rose-500 focus:outline-none"
                placeholder="Mohamed"
              />
            </div>
          </div>

          {/* Tone Selector */}
          <div className="mb-6">
            <label className="block text-xs font-medium text-slate-400 mb-2">Romantic Vibe / Tone</label>
            <div className="grid grid-cols-1 gap-2">
              {tones.map((t) => (
                <button
                  key={t.id}
                  type="button"
                  onClick={() => { sounds.playClick(); setTone(t.id); }}
                  className={`p-3 rounded-2xl text-left border transition-all cursor-pointer ${
                    tone === t.id
                      ? 'bg-rose-500/20 border-rose-500/80 text-rose-200 shadow-md'
                      : 'bg-slate-950/60 border-slate-800 text-slate-300 hover:border-slate-700'
                  }`}
                >
                  <div className="text-xs font-bold">{t.label}</div>
                  <div className="text-[11px] text-slate-400">{t.desc}</div>
                </button>
              ))}
            </div>
          </div>

          {/* Milestone Checkbox Selection */}
          <div className="mb-6">
            <div className="flex items-center justify-between mb-2">
              <label className="text-xs font-medium text-slate-400">Include Milestones ({selectedMilestoneIds.length}/{MILESTONES.length})</label>
              <button
                type="button"
                onClick={handleSelectAll}
                className="text-[11px] text-rose-400 hover:underline cursor-pointer"
              >
                Select All
              </button>
            </div>
            <div className="space-y-2 max-h-48 overflow-y-auto pr-1">
              {MILESTONES.map((m) => {
                const isSelected = selectedMilestoneIds.includes(m.id);
                return (
                  <div
                    key={m.id}
                    onClick={() => toggleMilestone(m.id)}
                    className={`flex items-center gap-3 p-2.5 rounded-xl border cursor-pointer transition-all ${
                      isSelected
                        ? 'bg-rose-950/40 border-rose-500/50 text-rose-200'
                        : 'bg-slate-950/40 border-slate-800 text-slate-400 hover:border-slate-700'
                    }`}
                  >
                    <div className={`w-4 h-4 rounded border flex items-center justify-center text-xs ${
                      isSelected ? 'bg-rose-500 border-rose-400 text-white' : 'border-slate-700'
                    }`}>
                      {isSelected && <Check className="w-3 h-3 stroke-[3]" />}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="text-xs font-semibold truncate">{m.title}</div>
                      <div className="text-[10px] text-slate-400 flex items-center gap-2">
                        <span>{m.date}</span>
                        <span>•</span>
                        <span>{m.location}</span>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Optional Note */}
          <div className="mb-6">
            <label className="block text-xs font-medium text-slate-400 mb-1.5 flex items-center gap-1">
              <MessageSquare className="w-3.5 h-3.5 text-rose-400" />
              Special Wish or Personal Touch (Optional)
            </label>
            <textarea
              value={customNote}
              onChange={(e) => setCustomNote(e.target.value)}
              rows={2}
              className="w-full p-3 rounded-xl bg-slate-950 border border-slate-800 text-white text-xs focus:border-rose-500 focus:outline-none resize-none"
              placeholder="e.g., Mention her beautiful long dark hair, our favorite coffee date, and how she makes my world complete."
            />
          </div>

          {/* Submit Button */}
          <button
            onClick={handleGenerate}
            disabled={isLoading || selectedMilestoneIds.length === 0}
            className="w-full py-3.5 px-6 rounded-2xl bg-gradient-to-r from-rose-600 via-rose-500 to-amber-500 text-white font-bold text-sm sm:text-base shadow-xl glow-box-rose hover:opacity-95 transition-all transform hover:scale-[1.01] active:scale-[0.99] disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 cursor-pointer"
          >
            {isLoading ? (
              <>
                <RefreshCw className="w-5 h-5 animate-spin" />
                <span>Weaving Memories with Gemini...</span>
              </>
            ) : (
              <>
                <Wand2 className="w-5 h-5 text-amber-200" />
                <span>Compose AI Love Letter</span>
              </>
            )}
          </button>
        </div>

        {/* Letter Output Preview Container */}
        <div className="lg:col-span-7">
          <AnimatePresence mode="wait">
            {isLoading && (
              <motion.div
                key="loading"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                className="p-10 rounded-3xl bg-slate-900/90 border border-rose-500/30 text-center flex flex-col items-center justify-center min-h-[420px]"
              >
                <div className="relative w-16 h-16 mb-6">
                  <div className="absolute inset-0 rounded-full bg-rose-500/20 animate-ping" />
                  <div className="relative z-10 w-full h-full rounded-full bg-gradient-to-tr from-rose-600 to-amber-400 flex items-center justify-center text-white shadow-xl">
                    <Heart className="w-8 h-8 fill-white animate-pulse" />
                  </div>
                </div>
                <h3 className="font-serif text-xl font-bold text-rose-200 mb-2">Writing Your Love Letter...</h3>
                <p className="text-slate-400 text-xs sm:text-sm max-w-sm">
                  Gemini is carefully reflecting on your selected milestones and translating your journey into heartfelt words.
                </p>
              </motion.div>
            )}

            {error && !isLoading && (
              <motion.div
                key="error"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                className="p-8 rounded-3xl bg-rose-950/50 border border-rose-500/40 text-center min-h-[300px] flex flex-col items-center justify-center"
              >
                <Heart className="w-10 h-10 text-rose-400 mb-3" />
                <h4 className="font-serif text-lg font-bold text-rose-200 mb-2">Could Not Compose Letter</h4>
                <p className="text-xs text-rose-300 max-w-sm mb-4">{error}</p>
                <button
                  onClick={handleGenerate}
                  className="px-5 py-2 rounded-full bg-rose-600 text-white font-semibold text-xs hover:bg-rose-500"
                >
                  Try Again
                </button>
              </motion.div>
            )}

            {!isLoading && !letterData && !error && (
              <motion.div
                key="empty"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="p-10 rounded-3xl bg-slate-900/60 border border-slate-800 text-center min-h-[420px] flex flex-col items-center justify-center relative overflow-hidden"
              >
                <div className="p-4 rounded-full bg-rose-500/10 border border-rose-500/20 mb-4 text-rose-400">
                  <BookOpen className="w-10 h-10" />
                </div>
                <h3 className="font-serif text-2xl font-bold text-slate-200 mb-2">Your Letter Will Appear Here</h3>
                <p className="text-slate-400 text-xs sm:text-sm max-w-md mb-6 leading-relaxed">
                  Select your favorite milestone stories on the left and click <span className="text-rose-300 font-semibold">Compose AI Love Letter</span> to generate a unique keepsake letter for {recipient}.
                </p>
              </motion.div>
            )}

            {!isLoading && letterData && (
              <motion.div
                key="letter"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.6 }}
                className="p-6 sm:p-10 rounded-3xl bg-gradient-to-b from-slate-900 via-slate-900 to-rose-950/40 border border-rose-500/40 shadow-[0_0_50px_rgba(244,63,94,0.25)] relative overflow-hidden"
              >
                {/* Decorative Wax Seal Icon */}
                <div className="absolute top-6 right-6 p-3 rounded-full bg-gradient-to-tr from-rose-700 to-amber-500 shadow-xl border-2 border-amber-300/40 flex items-center justify-center text-white">
                  <Heart className="w-5 h-5 fill-white" />
                </div>

                {/* Title & Quote */}
                <div className="mb-6 pr-12">
                  <span className="text-[10px] font-bold text-amber-300 uppercase tracking-widest block mb-1">
                    Special AI Keepsake
                  </span>
                  <h3 className="font-serif text-2xl sm:text-3xl font-bold text-amber-100 mb-2">
                    {letterData.title}
                  </h3>
                  <p className="text-xs sm:text-sm text-rose-200 italic font-serif border-l-2 border-amber-400/80 pl-3 py-1 bg-amber-400/5 rounded-r-lg">
                    "{letterData.quote}"
                  </p>
                </div>

                {/* Letter Body */}
                <div className="prose prose-invert max-w-none text-slate-100 font-serif text-sm sm:text-base leading-relaxed space-y-4 mb-8 whitespace-pre-line border-t border-b border-rose-500/20 py-6">
                  {letterData.letter}
                </div>

                {/* Highlights */}
                {letterData.highlights && letterData.highlights.length > 0 && (
                  <div className="mb-8">
                    <h4 className="text-xs font-bold text-amber-300 uppercase tracking-wider mb-2.5 flex items-center gap-1.5">
                      <Sparkles className="w-3.5 h-3.5" />
                      Chapters Weaved in this Letter:
                    </h4>
                    <div className="flex flex-wrap gap-2">
                      {letterData.highlights.map((h, idx) => (
                        <span
                          key={idx}
                          className="px-3 py-1 rounded-full bg-rose-500/15 border border-rose-500/30 text-rose-200 text-xs font-medium"
                        >
                          {h}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                {/* Action Toolbar */}
                <div className="flex flex-wrap items-center justify-between gap-3 pt-2">
                  <button
                    onClick={handleGenerate}
                    className="px-4 py-2 rounded-full bg-slate-800 hover:bg-slate-700 border border-slate-700 text-slate-200 text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer"
                  >
                    <RefreshCw className="w-3.5 h-3.5" />
                    <span>Regenerate</span>
                  </button>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={handleCopy}
                      className="px-4 py-2 rounded-full bg-slate-800 hover:bg-slate-700 border border-slate-700 text-rose-300 text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer"
                    >
                      {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                      <span>{copied ? 'Copied!' : 'Copy Letter'}</span>
                    </button>

                    <button
                      onClick={handleDownload}
                      className="px-4 py-2 rounded-full bg-rose-600 hover:bg-rose-500 text-white text-xs font-semibold shadow-lg flex items-center gap-1.5 transition-colors cursor-pointer"
                    >
                      <Download className="w-3.5 h-3.5" />
                      <span>Download Letter</span>
                    </button>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </section>
  );
};
