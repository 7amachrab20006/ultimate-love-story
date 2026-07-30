import React from 'react';
import { Heart, Moon, Sun, Lock, Gift, CloudRain, Snowflake, Stars, Sparkles, Menu, X } from 'lucide-react';
import { WeatherMode, ThemeMode } from '../types';
import { sounds } from '../utils/soundEffects';

interface NavbarProps {
  themeMode: ThemeMode;
  onToggleTheme: () => void;
  weatherMode: WeatherMode;
  onSelectWeather: (mode: WeatherMode) => void;
  partner1: string;
  partner2: string;
  onOpenPasscodeModal: () => void;
  onOpenCouponsModal: () => void;
  claimedCount: number;
}

export const Navbar: React.FC<NavbarProps> = ({
  themeMode,
  onToggleTheme,
  weatherMode,
  onSelectWeather,
  partner1,
  partner2,
  onOpenPasscodeModal,
  onOpenCouponsModal,
  claimedCount
}) => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = React.useState(false);

  const navLinks = [
    { name: "Love Counter", href: "#love-counter" },
    { name: "Our Story", href: "#timeline" },
    { name: "Memories", href: "#gallery" },
    { name: "World Map", href: "#world-map" },
    { name: "Arcade Games", href: "#arcade" },
    { name: "Spin Wheel", href: "#spin-wheel" }
  ];

  const handleNavClick = (href: string) => {
    sounds.playClick();
    setIsMobileMenuOpen(false);
    const element = document.querySelector(href);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <nav className={`sticky top-0 z-40 w-full backdrop-blur-xl border-b transition-colors duration-500 ${
      themeMode === 'night'
        ? 'bg-slate-950/70 border-rose-500/15 text-slate-100'
        : 'bg-white/70 border-rose-300/30 text-slate-800'
    }`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        {/* Brand / Couple Monogram */}
        <a href="#love-counter" className="flex items-center gap-3 group cursor-pointer">
          <div className="w-10 h-10 bg-gradient-to-br from-rose-500 to-indigo-600 rounded-xl flex items-center justify-center shadow-lg shadow-rose-500/20 group-hover:scale-105 transition-transform">
            <span className="text-xl font-serif italic font-bold text-white">A</span>
          </div>
          <div className="flex flex-col">
            <span className="font-serif font-bold text-base md:text-lg tracking-widest uppercase text-rose-100">
              {partner1} & {partner2}
            </span>
            <span className="text-[10px] uppercase tracking-[0.2em] opacity-60 text-rose-300">
              Aeterna • Our Eternal Story
            </span>
          </div>
        </a>

        {/* Desktop Navigation Links */}
        <div className="hidden lg:flex items-center gap-6 text-sm font-medium">
          {navLinks.map((link) => (
            <button
              key={link.name}
              onClick={() => handleNavClick(link.href)}
              className={`transition-colors hover:text-rose-400 cursor-pointer ${
                themeMode === 'night' ? 'text-slate-300' : 'text-slate-700'
              }`}
            >
              {link.name}
            </button>
          ))}
        </div>

        {/* Action Controls & Utilities */}
        <div className="flex items-center gap-2 sm:gap-3">
          {/* Weather Ambient Switcher */}
          <div className="hidden sm:flex items-center p-1 rounded-full bg-slate-900/60 border border-slate-700/50 text-xs">
            <button
              onClick={() => { sounds.playClick(); onSelectWeather('stars'); }}
              className={`p-1.5 rounded-full transition-all ${
                weatherMode === 'stars' ? 'bg-rose-500 text-white shadow-md' : 'text-slate-400 hover:text-white'
              }`}
              title="Starlight Mode"
            >
              <Stars className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={() => { sounds.playClick(); onSelectWeather('rain'); }}
              className={`p-1.5 rounded-full transition-all ${
                weatherMode === 'rain' ? 'bg-rose-500 text-white shadow-md' : 'text-slate-400 hover:text-white'
              }`}
              title="Romantic Rain Mode"
            >
              <CloudRain className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={() => { sounds.playClick(); onSelectWeather('snow'); }}
              className={`p-1.5 rounded-full transition-all ${
                weatherMode === 'snow' ? 'bg-rose-500 text-white shadow-md' : 'text-slate-400 hover:text-white'
              }`}
              title="Gentle Snow Mode"
            >
              <Snowflake className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Theme Switcher Button */}
          <button
            onClick={() => { sounds.playClick(); onToggleTheme(); }}
            className={`p-2 rounded-full border transition-all ${
              themeMode === 'night'
                ? 'bg-slate-900/80 border-slate-700 text-amber-300 hover:bg-slate-800'
                : 'bg-rose-50 border-rose-200 text-rose-600 hover:bg-rose-100'
            }`}
            title={`Switch to ${themeMode === 'night' ? 'Daylight' : 'Twilight'} Mode`}
          >
            {themeMode === 'night' ? <Moon className="w-4 h-4 fill-amber-300/30" /> : <Sun className="w-4 h-4 fill-rose-500/30" />}
          </button>

          {/* Claimed Rewards Drawer Button */}
          <button
            onClick={() => { sounds.playClick(); onOpenCouponsModal(); }}
            className="relative p-2 rounded-full bg-gradient-to-r from-amber-500/20 to-rose-500/20 border border-amber-500/30 text-amber-300 hover:scale-105 transition-all"
            title="My Saved Coupons & Rewards"
          >
            <Gift className="w-4 h-4" />
            {claimedCount > 0 && (
              <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-rose-500 text-white text-[10px] font-bold flex items-center justify-center animate-pulse">
                {claimedCount}
              </span>
            )}
          </button>

          {/* Secret Password Gate Button */}
          <button
            onClick={() => { sounds.playClick(); onOpenPasscodeModal(); }}
            className="p-2 rounded-full bg-rose-500/20 border border-rose-500/40 text-rose-300 hover:bg-rose-500/30 transition-all glow-box-rose"
            title="Unlock Secret Romantic Vault"
          >
            <Lock className="w-4 h-4" />
          </button>

          {/* Mobile Menu Toggle */}
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="lg:hidden p-2 rounded-xl text-slate-300 hover:text-white"
          >
            {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {isMobileMenuOpen && (
        <div className="lg:hidden px-4 pt-2 pb-6 space-y-3 bg-slate-950/95 border-b border-rose-500/20 backdrop-blur-2xl">
          <div className="flex items-center justify-around py-2 border-b border-slate-800">
            <span className="text-xs text-slate-400">Atmosphere:</span>
            <div className="flex items-center gap-2">
              <button
                onClick={() => { onSelectWeather('stars'); setIsMobileMenuOpen(false); }}
                className={`px-3 py-1 rounded-full text-xs font-medium flex items-center gap-1 ${
                  weatherMode === 'stars' ? 'bg-rose-500 text-white' : 'bg-slate-800 text-slate-300'
                }`}
              >
                <Stars className="w-3 h-3" /> Stars
              </button>
              <button
                onClick={() => { onSelectWeather('rain'); setIsMobileMenuOpen(false); }}
                className={`px-3 py-1 rounded-full text-xs font-medium flex items-center gap-1 ${
                  weatherMode === 'rain' ? 'bg-rose-500 text-white' : 'bg-slate-800 text-slate-300'
                }`}
              >
                <CloudRain className="w-3 h-3" /> Rain
              </button>
              <button
                onClick={() => { onSelectWeather('snow'); setIsMobileMenuOpen(false); }}
                className={`px-3 py-1 rounded-full text-xs font-medium flex items-center gap-1 ${
                  weatherMode === 'snow' ? 'bg-rose-500 text-white' : 'bg-slate-800 text-slate-300'
                }`}
              >
                <Snowflake className="w-3 h-3" /> Snow
              </button>
            </div>
          </div>

          {navLinks.map((link) => (
            <button
              key={link.name}
              onClick={() => handleNavClick(link.href)}
              className="block w-full text-left py-2 text-base font-medium text-slate-200 hover:text-rose-400"
            >
              {link.name}
            </button>
          ))}
        </div>
      )}
    </nav>
  );
};
