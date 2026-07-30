import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Heart, Sparkles, Play, MapPin, Calendar, X, ChevronLeft, ChevronRight, Maximize2 } from 'lucide-react';
import { GalleryItem } from '../types';
import { GALLERY_ITEMS } from '../data/relationshipData';
import { sounds } from '../utils/soundEffects';

interface SharedGalleryProps {
  themeMode: 'night' | 'day';
}

export const SharedGallery: React.FC<SharedGalleryProps> = ({ themeMode }) => {
  const [activeItemIndex, setActiveItemIndex] = useState<number | null>(null);

  const activeItem: GalleryItem | null =
    activeItemIndex !== null ? GALLERY_ITEMS[activeItemIndex] : null;

  const handlePrev = (e: React.MouseEvent) => {
    e.stopPropagation();
    sounds.playClick();
    if (activeItemIndex !== null) {
      setActiveItemIndex((activeItemIndex - 1 + GALLERY_ITEMS.length) % GALLERY_ITEMS.length);
    }
  };

  const handleNext = (e: React.MouseEvent) => {
    e.stopPropagation();
    sounds.playClick();
    if (activeItemIndex !== null) {
      setActiveItemIndex((activeItemIndex + 1) % GALLERY_ITEMS.length);
    }
  };

  return (
    <section id="gallery" className="py-20 px-4 sm:px-6 max-w-7xl mx-auto relative">
      {/* Section Header */}
      <div className="text-center max-w-2xl mx-auto mb-14">
        <span className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs font-semibold uppercase tracking-widest mb-3">
          <Sparkles className="w-3.5 h-3.5 text-amber-300" />
          Captured Moments
        </span>
        <h2 className="font-serif text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight text-slate-100 mb-4">
          Our Shared Memory Gallery
        </h2>
        <p className="text-slate-300 text-sm sm:text-base">
          A visual archive of our favorite trips, quiet evenings, and spontaneous laughter.
        </p>
      </div>

      {/* Masonry Grid */}
      <div className="columns-1 sm:columns-2 lg:columns-3 gap-6 space-y-6">
        {GALLERY_ITEMS.map((item, idx) => (
          <motion.div
            key={item.id}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.4, delay: idx * 0.08 }}
            onClick={() => { sounds.playChime(); setActiveItemIndex(idx); }}
            className={`relative rounded-3xl overflow-hidden cursor-pointer group break-inside-avoid shadow-xl transition-all duration-300 hover:scale-[1.02] ${
              themeMode === 'night' ? 'glass-card' : 'glass-card-light'
            } border border-rose-500/20 hover:border-rose-500/60`}
          >
            {/* Image / Video Thumbnail */}
            <div className="relative w-full">
              {item.type === 'video' && !item.thumbnail ? (
                <video
                  src={item.url}
                  className="w-full h-auto object-cover group-hover:scale-105 transition-transform duration-700 min-h-[220px]"
                  muted
                  playsInline
                  loop
                  autoPlay
                />
              ) : (
                <img
                  src={item.type === 'video' ? item.thumbnail : item.url}
                  alt={item.title}
                  className="w-full h-auto object-cover group-hover:scale-105 transition-transform duration-700"
                  referrerPolicy="no-referrer"
                />
              )}

              {/* Video Play Badge */}
              {item.type === 'video' && (
                <div className="absolute inset-0 flex items-center justify-center bg-slate-950/40 group-hover:bg-slate-950/20 transition-colors">
                  <div className="p-4 rounded-full bg-rose-500/80 backdrop-blur-md text-white shadow-[0_0_20px_rgba(244,63,94,0.8)] group-hover:scale-110 transition-transform">
                    <Play className="w-6 h-6 fill-white ml-0.5" />
                  </div>
                </div>
              )}

              {/* Glassmorphic Overlay on Hover */}
              <div className="absolute inset-0 p-6 flex flex-col justify-end bg-gradient-to-t from-slate-950/90 via-slate-950/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                <div className="flex items-center gap-2 text-xs text-rose-300 mb-1">
                  <Calendar className="w-3.5 h-3.5" />
                  <span>{item.date}</span>
                  <span>•</span>
                  <MapPin className="w-3.5 h-3.5 text-amber-300" />
                  <span className="text-amber-200">{item.location}</span>
                </div>
                <h3 className="font-serif text-lg font-bold text-white mb-1">
                  {item.title}
                </h3>
                <p className="text-xs text-slate-200 line-clamp-2">
                  {item.caption}
                </p>

                <div className="mt-3 flex items-center gap-1 text-[11px] font-bold text-amber-300 uppercase tracking-widest">
                  <Maximize2 className="w-3 h-3" /> View Full Memory
                </div>
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Lightbox Slider Modal */}
      <AnimatePresence>
        {activeItem && (
          <div
            onClick={() => setActiveItemIndex(null)}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/90 backdrop-blur-xl"
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
              className="relative w-full max-w-4xl rounded-3xl bg-slate-900 border border-rose-500/30 overflow-hidden shadow-2xl flex flex-col md:flex-row"
            >
              {/* Close Button */}
              <button
                onClick={() => setActiveItemIndex(null)}
                className="absolute top-4 right-4 z-20 p-2.5 rounded-full bg-slate-950/80 text-slate-300 hover:text-white border border-slate-700"
              >
                <X className="w-5 h-5" />
              </button>

              {/* Prev / Next Buttons */}
              <button
                onClick={handlePrev}
                className="absolute left-4 top-1/2 -translate-y-1/2 z-20 p-3 rounded-full bg-slate-950/70 border border-rose-500/30 text-rose-300 hover:bg-rose-500/30 transition-all"
              >
                <ChevronLeft className="w-6 h-6" />
              </button>
              <button
                onClick={handleNext}
                className="absolute right-4 top-1/2 -translate-y-1/2 z-20 p-3 rounded-full bg-slate-950/70 border border-rose-500/30 text-rose-300 hover:bg-rose-500/30 transition-all"
              >
                <ChevronRight className="w-6 h-6" />
              </button>

              {/* Media Display Container */}
              <div className="w-full md:w-2/3 bg-slate-950 flex items-center justify-center min-h-[350px] md:min-h-[500px]">
                {activeItem.type === 'video' ? (
                  <div className="w-full h-full p-4 flex items-center justify-center">
                    <div className="w-full aspect-video rounded-2xl border-2 border-amber-500/50 shadow-[0_0_30px_rgba(245,158,11,0.3)] overflow-hidden bg-black flex items-center justify-center">
                      {activeItem.url.includes('youtube') || activeItem.url.includes('embed') ? (
                        <iframe
                          src={activeItem.url}
                          title={activeItem.title}
                          className="w-full h-full"
                          allow="autoplay; encrypted-media"
                          allowFullScreen
                        />
                      ) : (
                        <video
                          src={activeItem.url}
                          controls
                          autoPlay
                          className="w-full h-full object-contain"
                        />
                      )}
                    </div>
                  </div>
                ) : (
                  <img
                    src={activeItem.url}
                    alt={activeItem.title}
                    className="max-h-[75vh] w-full object-contain p-2"
                    referrerPolicy="no-referrer"
                  />
                )}
              </div>

              {/* Caption Sidebar */}
              <div className="w-full md:w-1/3 p-6 sm:p-8 flex flex-col justify-between bg-slate-900/90 border-t md:border-t-0 md:border-l border-slate-800">
                <div>
                  <div className="flex items-center gap-2 text-xs font-semibold text-rose-400 mb-2 uppercase tracking-wider">
                    <Calendar className="w-3.5 h-3.5" />
                    <span>{activeItem.date}</span>
                  </div>

                  <h3 className="font-serif text-2xl font-bold text-white mb-3">
                    {activeItem.title}
                  </h3>

                  <div className="flex items-center gap-1.5 text-xs text-amber-300 mb-4 font-medium">
                    <MapPin className="w-4 h-4 text-amber-400" />
                    <span>{activeItem.location}</span>
                  </div>

                  <p className="text-slate-300 text-sm leading-relaxed font-light">
                    "{activeItem.caption}"
                  </p>
                </div>

                <div className="mt-8 pt-4 border-t border-slate-800 flex items-center justify-between text-xs text-slate-400">
                  <span className="flex items-center gap-1 text-rose-400">
                    <Heart className="w-4 h-4 fill-rose-500" /> Favorite Moment
                  </span>
                  <span>{activeItemIndex + 1} of {GALLERY_ITEMS.length}</span>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </section>
  );
};
