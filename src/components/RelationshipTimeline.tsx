import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Heart, Sparkles, Flame, Plane, Home, Compass, Calendar, MapPin, X, ArrowRight } from 'lucide-react';
import { Milestone } from '../types';
import { MILESTONES } from '../data/relationshipData';
import { sounds } from '../utils/soundEffects';

interface RelationshipTimelineProps {
  themeMode: 'night' | 'day';
}

export const RelationshipTimeline: React.FC<RelationshipTimelineProps> = ({ themeMode }) => {
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [activeMilestone, setActiveMilestone] = useState<Milestone | null>(null);

  const categories = [
    { id: 'all', label: 'All Chapter Stories' },
    { id: 'first', label: 'Magical Firsts' },
    { id: 'travel', label: 'Adventures' },
    { id: 'anniversary', label: 'Milestones' },
    { id: 'future', label: 'Future Dreams' }
  ];

  const filteredMilestones = MILESTONES.filter(
    (m) => selectedCategory === 'all' || m.category === selectedCategory
  );

  const getIcon = (iconName: string) => {
    switch (iconName) {
      case 'Sparkles': return <Sparkles className="w-5 h-5 text-amber-300" />;
      case 'Flame': return <Flame className="w-5 h-5 text-rose-400" />;
      case 'Plane': return <Plane className="w-5 h-5 text-sky-400" />;
      case 'Home': return <Home className="w-5 h-5 text-amber-400" />;
      case 'Compass': return <Compass className="w-5 h-5 text-emerald-400" />;
      default: return <Heart className="w-5 h-5 text-rose-500 fill-rose-500" />;
    }
  };

  return (
    <section id="timeline" className="py-20 px-4 sm:px-6 max-w-6xl mx-auto relative">
      {/* Title section */}
      <div className="text-center max-w-2xl mx-auto mb-12">
        <span className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs font-semibold uppercase tracking-widest mb-3">
          <Sparkles className="w-3.5 h-3.5 text-amber-300" />
          Chronicles of Us
        </span>
        <h2 className="font-serif text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight text-slate-100 mb-4">
          Our Love Story Timeline
        </h2>
        <p className="text-slate-300 text-sm sm:text-base">
          Every moment with you is a chapter in our favorite fairy tale. Click any milestone to read the full story.
        </p>
      </div>

      {/* Category Tabs Filter */}
      <div className="flex items-center justify-center gap-2 mb-14 flex-wrap">
        {categories.map((cat) => (
          <button
            key={cat.id}
            onClick={() => { sounds.playClick(); setSelectedCategory(cat.id); }}
            className={`px-4 py-2 rounded-full text-xs sm:text-sm font-semibold transition-all cursor-pointer ${
              selectedCategory === cat.id
                ? 'bg-gradient-to-r from-rose-600 to-amber-500 text-white shadow-lg glow-box-rose'
                : 'bg-slate-900/60 border border-slate-800 text-slate-300 hover:border-slate-700'
            }`}
          >
            {cat.label}
          </button>
        ))}
      </div>

      {/* Vertical Timeline Structure */}
      <div className="relative max-w-4xl mx-auto">
        {/* Center glowing vertical line */}
        <div className="absolute left-4 sm:left-1/2 top-0 bottom-0 w-0.5 -translate-x-1/2 bg-gradient-to-b from-rose-500/80 via-amber-400/60 to-rose-500/20 shadow-[0_0_10px_rgba(244,63,94,0.5)]" />

        <div className="space-y-12">
          {filteredMilestones.map((milestone, idx) => {
            const isEven = idx % 2 === 0;

            return (
              <motion.div
                key={milestone.id}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: idx * 0.1 }}
                className={`relative flex flex-col sm:flex-row items-center ${
                  isEven ? 'sm:flex-row-reverse' : ''
                }`}
              >
                {/* Timeline node icon in center */}
                <div className="absolute left-4 sm:left-1/2 -translate-x-1/2 z-20 flex items-center justify-center w-10 h-10 rounded-full bg-slate-900 border-2 border-rose-500 shadow-[0_0_15px_rgba(244,63,94,0.6)] group">
                  {getIcon(milestone.iconName)}
                </div>

                {/* Content Card */}
                <div className="w-full sm:w-1/2 pl-12 sm:pl-0 sm:px-8">
                  <div
                    onClick={() => { sounds.playChime(); setActiveMilestone(milestone); }}
                    className={`p-6 rounded-3xl transition-all cursor-pointer group hover:scale-[1.02] ${
                      themeMode === 'night' ? 'glass-card' : 'glass-card-light'
                    } border border-rose-500/20 hover:border-rose-500/50 shadow-xl`}
                  >
                    {/* Image Preview */}
                    <div className="relative h-44 w-full mb-4 rounded-2xl overflow-hidden">
                      <img
                        src={milestone.image}
                        alt={milestone.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                        referrerPolicy="no-referrer"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-transparent" />
                      <span className="absolute bottom-3 left-3 inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-950/80 backdrop-blur-md text-rose-300 text-xs font-semibold border border-rose-500/30">
                        <Calendar className="w-3 h-3 text-rose-400" />
                        {milestone.date}
                      </span>
                    </div>

                    {/* Location Badge */}
                    <div className="flex items-center gap-1.5 text-xs text-amber-300/90 mb-2 font-medium">
                      <MapPin className="w-3.5 h-3.5 text-amber-400" />
                      {milestone.location}
                    </div>

                    {/* Milestone Title */}
                    <h3 className="font-serif text-xl font-bold text-slate-100 group-hover:text-rose-300 transition-colors mb-2">
                      {milestone.title}
                    </h3>

                    {/* Short Description */}
                    <p className="text-slate-300 text-xs sm:text-sm line-clamp-2 leading-relaxed">
                      {milestone.shortDescription}
                    </p>

                    <div className="mt-4 flex items-center gap-1 text-xs font-semibold text-rose-400 group-hover:text-rose-300">
                      <span>Read Full Chapter</span>
                      <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                    </div>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>

      {/* Bottom Callout to AI Love Letter */}
      <div className="mt-12 text-center">
        <a
          href="#ai-love-letter"
          onClick={() => sounds.playClick()}
          className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-gradient-to-r from-rose-500/20 via-rose-500/30 to-amber-500/20 border border-rose-500/40 text-rose-200 text-sm font-bold shadow-lg hover:border-rose-500 hover:scale-105 transition-all cursor-pointer"
        >
          <Sparkles className="w-4 h-4 text-amber-300" />
          <span>Turn these milestone stories into a custom AI Love Letter</span>
        </a>
      </div>

      {/* Active Milestone Modal */}
      <AnimatePresence>
        {activeMilestone && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/85 backdrop-blur-lg">
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="w-full max-w-2xl max-h-[90vh] overflow-y-auto rounded-3xl bg-slate-900 border border-rose-500/30 text-slate-100 p-6 sm:p-8 shadow-2xl relative"
            >
              <button
                onClick={() => setActiveMilestone(null)}
                className="absolute top-4 right-4 p-2 rounded-full bg-slate-800 text-slate-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>

              <div className="relative h-64 sm:h-80 w-full mb-6 rounded-2xl overflow-hidden">
                <img
                  src={activeMilestone.image}
                  alt={activeMilestone.title}
                  className="w-full h-full object-cover"
                  referrerPolicy="no-referrer"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/40 to-transparent" />
                
                <div className="absolute bottom-4 left-4 right-4">
                  <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-rose-500/80 text-white text-xs font-bold mb-2">
                    {activeMilestone.date}
                  </span>
                  <h3 className="font-serif text-2xl sm:text-3xl font-bold text-white">
                    {activeMilestone.title}
                  </h3>
                </div>
              </div>

              <div className="flex items-center gap-2 text-amber-300 text-sm mb-4">
                <MapPin className="w-4 h-4 text-amber-400" />
                <span>{activeMilestone.location}</span>
              </div>

              <div className="space-y-4 text-slate-200 text-sm sm:text-base leading-relaxed font-light">
                <p className="text-rose-200 font-medium text-base italic border-l-2 border-rose-500 pl-4 py-1">
                  "{activeMilestone.shortDescription}"
                </p>
                <p>{activeMilestone.fullStory}</p>
              </div>

              <div className="mt-8 pt-4 border-t border-slate-800 flex justify-end">
                <button
                  onClick={() => setActiveMilestone(null)}
                  className="px-6 py-2.5 rounded-full bg-rose-500 text-white font-semibold text-sm hover:bg-rose-600 transition-colors shadow-lg"
                >
                  Close Story
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </section>
  );
};
