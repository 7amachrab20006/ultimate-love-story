import React, { useState, useEffect, useRef } from 'react';
import { Play, Pause, Volume2, VolumeX, Music, Heart, Youtube, Maximize2, Minimize2 } from 'lucide-react';
import { sounds } from '../utils/soundEffects';

const YOUTUBE_VIDEO_ID = 'LF13_TQUxLU';

export const AudioPlayer: React.FC = () => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [volume, setVolume] = useState(0.7);
  const [showVolumeSlider, setShowVolumeSlider] = useState(false);
  const [showVideoModal, setShowVideoModal] = useState(false);

  const iframeRef = useRef<HTMLIFrameElement | null>(null);

  const sendYTCommand = (func: string, args: unknown = '') => {
    if (iframeRef.current && iframeRef.current.contentWindow) {
      iframeRef.current.contentWindow.postMessage(
        JSON.stringify({ event: 'command', func, args }),
        '*'
      );
    }
  };

  const togglePlay = () => {
    sounds.playClick();
    if (isPlaying) {
      sendYTCommand('pauseVideo');
      setIsPlaying(false);
    } else {
      sendYTCommand('playVideo');
      sendYTCommand('unMute');
      sendYTCommand('setVolume', volume * 100);
      setIsPlaying(true);
    }
  };

  const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newVol = parseFloat(e.target.value);
    setVolume(newVol);
    if (newVol === 0) {
      setIsMuted(true);
      sendYTCommand('mute');
    } else {
      setIsMuted(false);
      sendYTCommand('unMute');
      sendYTCommand('setVolume', newVol * 100);
    }
  };

  const toggleMute = () => {
    sounds.playClick();
    const nextMute = !isMuted;
    setIsMuted(nextMute);
    if (nextMute) {
      sendYTCommand('mute');
    } else {
      sendYTCommand('unMute');
      sendYTCommand('setVolume', volume * 100);
    }
  };

  // Sync volume on change
  useEffect(() => {
    if (isPlaying) {
      sendYTCommand('setVolume', (isMuted ? 0 : volume) * 100);
    }
  }, [volume, isMuted, isPlaying]);

  return (
    <>
      {/* Hidden YouTube Iframe Player */}
      <div className={showVideoModal ? 'fixed bottom-20 right-5 z-50 rounded-2xl overflow-hidden border-2 border-rose-500/50 shadow-2xl bg-black w-80 h-48 animate-scaleUp' : 'hidden'}>
        <iframe
          ref={iframeRef}
          id="bg-youtube-player"
          src={`https://www.youtube.com/embed/${YOUTUBE_VIDEO_ID}?enablejsapi=1&autoplay=0&loop=1&playlist=${YOUTUBE_VIDEO_ID}&controls=1`}
          title="Background Song"
          className="w-full h-full"
          allow="autoplay; encrypted-media"
        />
        <button
          onClick={() => setShowVideoModal(false)}
          className="absolute top-2 right-2 p-1.5 rounded-full bg-slate-900/80 text-white hover:bg-rose-600 transition-colors"
          title="Minimize Video"
        >
          <Minimize2 className="w-3.5 h-3.5" />
        </button>
      </div>

      {/* Render iframe offscreen when video modal is not shown */}
      {!showVideoModal && (
        <iframe
          ref={iframeRef}
          id="bg-youtube-player-offscreen"
          src={`https://www.youtube.com/embed/${YOUTUBE_VIDEO_ID}?enablejsapi=1&autoplay=0&loop=1&playlist=${YOUTUBE_VIDEO_ID}`}
          title="Background Song"
          className="fixed -left-[9999px] -top-[9999px] w-1 h-1 pointer-events-none opacity-0"
          allow="autoplay; encrypted-media"
        />
      )}

      {/* Fixed Bottom-Right Audio Player Bar */}
      <div className="fixed bottom-5 right-5 z-40 flex items-center gap-3">
        <div className="flex items-center gap-3 px-4 py-2.5 rounded-full bg-slate-900/85 backdrop-blur-xl border border-rose-500/30 shadow-[0_8px_32px_rgba(0,0,0,0.5)]">
          {/* Animated Equalizer Bars */}
          <div
            className="flex items-center gap-1 h-5 w-6 cursor-pointer"
            onClick={togglePlay}
            title={isPlaying ? "Pause Music" : "Play Special Song"}
          >
            {[0.6, 0.9, 0.4, 0.8].map((scale, i) => (
              <div
                key={i}
                className={`w-1 rounded-full bg-gradient-to-t from-rose-500 to-amber-300 transition-all duration-300 ${
                  isPlaying ? 'animate-pulse' : 'h-1 opacity-50'
                }`}
                style={{
                  height: isPlaying ? `${Math.floor(scale * 18)}px` : '4px',
                  animationDelay: `${i * 0.15}s`,
                  animationDuration: '0.6s'
                }}
              />
            ))}
          </div>

          {/* Track Info */}
          <div className="hidden sm:flex flex-col cursor-pointer" onClick={togglePlay}>
            <span className="text-xs font-semibold text-rose-200 flex items-center gap-1">
              <Music className="w-3 h-3 text-rose-400" />
              Asma & Mohamed's Song
            </span>
            <span className="text-[10px] text-slate-400 flex items-center gap-1">
              <Youtube className="w-2.5 h-2.5 text-red-500" /> YouTube Background Theme
            </span>
          </div>

          {/* Play / Pause Toggle Button */}
          <button
            onClick={togglePlay}
            className="p-2 rounded-full bg-rose-500/20 hover:bg-rose-500/30 border border-rose-500/40 text-rose-300 transition-all transform hover:scale-105"
            title={isPlaying ? "Pause Music" : "Play Background Song"}
          >
            {isPlaying ? <Pause className="w-4 h-4 fill-rose-300" /> : <Play className="w-4 h-4 fill-rose-300 ml-0.5" />}
          </button>

          {/* Toggle Video Viewer */}
          <button
            onClick={() => setShowVideoModal(!showVideoModal)}
            className={`p-2 rounded-full transition-colors ${
              showVideoModal ? 'bg-rose-600 text-white' : 'hover:bg-slate-800 text-slate-400 hover:text-rose-300'
            }`}
            title="Toggle Video Screen"
          >
            <Maximize2 className="w-3.5 h-3.5" />
          </button>

          {/* Volume Control Button */}
          <div className="relative flex items-center">
            <button
              onClick={toggleMute}
              onMouseEnter={() => setShowVolumeSlider(true)}
              className="p-2 rounded-full hover:bg-slate-800 text-slate-300 transition-colors"
              title={isMuted ? "Unmute" : "Mute"}
            >
              {isMuted || volume === 0 ? <VolumeX className="w-4 h-4 text-rose-400" /> : <Volume2 className="w-4 h-4 text-slate-300" />}
            </button>

            {/* Volume Popup Slider */}
            {showVolumeSlider && (
              <div
                onMouseLeave={() => setShowVolumeSlider(false)}
                className="absolute bottom-12 right-0 p-3 rounded-2xl bg-slate-900/90 border border-slate-700/60 shadow-xl flex items-center gap-2 animate-fadeIn"
              >
                <Heart className="w-3 h-3 text-rose-400" />
                <input
                  type="range"
                  min="0"
                  max="1"
                  step="0.05"
                  value={isMuted ? 0 : volume}
                  onChange={handleVolumeChange}
                  className="w-20 accent-rose-500 h-1 bg-slate-700 rounded-lg cursor-pointer"
                />
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
};

