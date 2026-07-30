import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Sparkles, MapPin as MapPinIcon, Heart, Compass, Globe, X } from 'lucide-react';
import { MapPin } from '../types';
import { MAP_PINS } from '../data/relationshipData';
import { sounds } from '../utils/soundEffects';

interface WorldMapProps {
  themeMode: 'night' | 'day';
}

export const WorldMap: React.FC<WorldMapProps> = ({ themeMode }) => {
  const [selectedFilter, setSelectedFilter] = useState<string>('all');
  const [activePin, setActivePin] = useState<MapPin | null>(null);

  const filters = [
    { id: 'all', label: 'All Locations' },
    { id: 'met', label: 'Where We Met (Red)' },
    { id: 'visited', label: 'Visited (Gold)' },
    { id: 'dream', label: 'Dream Destinations (Pink)' }
  ];

  const filteredPins = MAP_PINS.filter(
    (p) => selectedFilter === 'all' || p.type === selectedFilter
  );

  const getPinColor = (type: string) => {
    switch (type) {
      case 'met': return 'bg-rose-500 text-white shadow-[0_0_15px_rgba(244,63,94,0.8)] border-rose-300';
      case 'visited': return 'bg-amber-400 text-slate-950 shadow-[0_0_15px_rgba(245,158,11,0.8)] border-amber-200';
      default: return 'bg-pink-500 text-white shadow-[0_0_15px_rgba(236,72,153,0.8)] border-pink-300';
    }
  };

  return (
    <section id="world-map" className="py-20 px-4 sm:px-6 max-w-6xl mx-auto relative">
      {/* Title Header */}
      <div className="text-center max-w-2xl mx-auto mb-12">
        <span className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs font-semibold uppercase tracking-widest mb-3">
          <Globe className="w-3.5 h-3.5 text-amber-300" />
          Our Global Passport
        </span>
        <h2 className="font-serif text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight text-slate-100 mb-4">
          Interactive Dream Destinations
        </h2>
        <p className="text-slate-300 text-sm sm:text-base">
          Tracing where our hearts have been and mapping out every place we'll explore next.
        </p>
      </div>

      {/* Filter Tabs */}
      <div className="flex items-center justify-center gap-2 mb-10 flex-wrap">
        {filters.map((f) => (
          <button
            key={f.id}
            onClick={() => { sounds.playClick(); setSelectedFilter(f.id); }}
            className={`px-4 py-2 rounded-full text-xs sm:text-sm font-semibold transition-all cursor-pointer ${
              selectedFilter === f.id
                ? 'bg-rose-500 text-white shadow-lg glow-box-rose'
                : 'bg-slate-900/60 border border-slate-800 text-slate-300 hover:border-slate-700'
            }`}
          >
            {f.label}
          </button>
        ))}
      </div>

      {/* Vector World Map Stage Container */}
      <div className={`relative w-full rounded-3xl p-4 sm:p-8 overflow-hidden shadow-2xl transition-colors ${
        themeMode === 'night' ? 'glass-card' : 'glass-card-light'
      } border border-rose-500/20`}>
        {/* SVG World Map Graphics */}
        <div className="relative w-full aspect-[2/1] min-h-[300px] sm:min-h-[420px] bg-slate-950/80 rounded-2xl overflow-hidden border border-slate-800">
          <svg
            viewBox="0 0 1000 500"
            className="w-full h-full object-cover opacity-40 text-rose-500/30 fill-current"
          >
            {/* World Continent Vector Outline Path representation */}
            {/* North America */}
            <path d="M120,80 Q200,60 280,110 T260,220 Q180,260 100,180 Z" />
            {/* South America */}
            <path d="M260,260 Q340,280 320,380 T260,460 Q220,380 240,300 Z" />
            {/* Europe */}
            <path d="M480,70 Q560,60 580,120 T500,180 Q460,140 470,90 Z" />
            {/* Africa */}
            <path d="M480,190 Q580,200 560,340 T480,420 Q440,320 460,240 Z" />
            {/* Asia */}
            <path d="M590,70 Q800,40 860,160 T740,260 Q620,240 580,140 Z" />
            {/* Australia */}
            <path d="M780,320 Q880,310 860,400 T760,410 Q740,360 760,330 Z" />
          </svg>

          {/* Map Grid Lat/Long Lines decorative effect */}
          <div className="absolute inset-0 bg-[linear-gradient(to_right,#1e293b_1px,transparent_1px),linear-gradient(to_bottom,#1e293b_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_50%,#000_70%,transparent_100%)] opacity-30 pointer-events-none" />

          {/* Render Pins */}
          {filteredPins.map((pin) => (
            <div
              key={pin.id}
              style={{ left: `${pin.coordinates.x}%`, top: `${pin.coordinates.y}%` }}
              className="absolute -translate-x-1/2 -translate-y-1/2 z-20 group cursor-pointer"
              onClick={() => { sounds.playChime(); setActivePin(pin); }}
            >
              {/* Pulsing ring behind pin */}
              <div className="absolute -inset-2 rounded-full bg-rose-500/40 animate-ping opacity-75" />

              {/* Pin icon button */}
              <div className={`relative p-2 rounded-full border-2 ${getPinColor(pin.type)} transition-transform group-hover:scale-125`}>
                {pin.type === 'met' ? (
                  <Heart className="w-4 h-4 fill-white" />
                ) : pin.type === 'visited' ? (
                  <MapPinIcon className="w-4 h-4" />
                ) : (
                  <Compass className="w-4 h-4" />
                )}
              </div>

              {/* Quick Label Tooltip */}
              <div className="absolute left-1/2 bottom-full -translate-x-1/2 mb-2 hidden group-hover:flex flex-col items-center pointer-events-none z-30">
                <div className="px-3 py-1.5 rounded-xl bg-slate-900/95 border border-rose-500/40 text-xs font-bold text-white whitespace-nowrap shadow-xl">
                  {pin.locationName}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Selected Pin Detail Modal */}
      <AnimatePresence>
        {activePin && (
          <div
            onClick={() => setActivePin(null)}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md"
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
              className="w-full max-w-md p-6 rounded-3xl bg-slate-900 border border-rose-500/30 text-slate-100 shadow-2xl relative"
            >
              <button
                onClick={() => setActivePin(null)}
                className="absolute top-4 right-4 p-2 rounded-full bg-slate-800 text-slate-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>

              <div className="relative h-48 w-full mb-4 rounded-2xl overflow-hidden">
                <img
                  src={activePin.image}
                  alt={activePin.locationName}
                  className="w-full h-full object-cover"
                  referrerPolicy="no-referrer"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-transparent to-transparent" />
                <span className="absolute bottom-3 left-3 inline-flex items-center gap-1 px-3 py-1 rounded-full bg-rose-500 text-white text-xs font-bold">
                  {activePin.dateOrYear}
                </span>
              </div>

              <div className="flex items-center gap-1.5 text-xs text-amber-300 font-semibold mb-1 uppercase tracking-wider">
                <Globe className="w-3.5 h-3.5" />
                <span>{activePin.country}</span>
              </div>

              <h3 className="font-serif text-2xl font-bold text-white mb-2">
                {activePin.locationName}
              </h3>

              <p className="text-slate-300 text-sm italic mb-6 leading-relaxed">
                "{activePin.note}"
              </p>

              <div className="flex justify-end">
                <button
                  onClick={() => setActivePin(null)}
                  className="px-5 py-2 rounded-full bg-rose-500 text-white font-semibold text-xs hover:bg-rose-600 transition-colors"
                >
                  Close Location
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </section>
  );
};
