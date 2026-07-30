import React, { useEffect, useRef, useState } from 'react';
import { WeatherMode, ThemeMode } from '../types';

interface ParticleBackgroundProps {
  weatherMode: WeatherMode;
  themeMode: ThemeMode;
}

interface HeartParticle {
  id: number;
  x: number;
  y: number;
  size: number;
  speedY: number;
  speedX: number;
  opacity: number;
  rotation: number;
  color: string;
}

export const ParticleBackground: React.FC<ParticleBackgroundProps> = ({ weatherMode, themeMode }) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [cursorParticlesEnabled, setCursorParticlesEnabled] = useState(true);
  const cursorHeartsRef = useRef<HeartParticle[]>([]);

  // Canvas weather animation loop
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId: number;
    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    const handleResize = () => {
      if (!canvas) return;
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    };
    window.addEventListener('resize', handleResize);

    // Weather particles generator
    const particlesCount = weatherMode === 'stars' ? 120 : weatherMode === 'rain' ? 180 : 80;
    const particles = Array.from({ length: particlesCount }, () => ({
      x: Math.random() * width,
      y: Math.random() * height,
      radius: Math.random() * (weatherMode === 'snow' ? 3.5 : 1.8) + 0.5,
      speedY: weatherMode === 'rain' ? Math.random() * 8 + 6 : weatherMode === 'snow' ? Math.random() * 1.5 + 0.5 : (Math.random() - 0.5) * 0.2,
      speedX: weatherMode === 'rain' ? -1.5 : weatherMode === 'snow' ? (Math.random() - 0.5) * 0.8 : (Math.random() - 0.5) * 0.2,
      opacity: Math.random() * 0.8 + 0.2,
      twinkleSpeed: Math.random() * 0.02 + 0.005
    }));

    // Shooting stars for night stars mode
    let shootingStar = {
      x: Math.random() * width,
      y: Math.random() * (height / 2),
      length: Math.random() * 80 + 40,
      speed: Math.random() * 10 + 12,
      active: false
    };

    let shootingStarTimer = 0;

    const render = () => {
      ctx.clearRect(0, 0, width, height);

      // Render weather mode
      if (weatherMode === 'stars') {
        particles.forEach((p) => {
          p.opacity += p.twinkleSpeed;
          if (p.opacity > 1 || p.opacity < 0.2) p.twinkleSpeed = -p.twinkleSpeed;

          ctx.beginPath();
          ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
          ctx.fillStyle = themeMode === 'night' 
            ? `rgba(254, 240, 138, ${p.opacity})` 
            : `rgba(244, 63, 94, ${p.opacity * 0.5})`;
          ctx.shadowBlur = p.radius * 3;
          ctx.shadowColor = themeMode === 'night' ? '#fde047' : '#f43f5e';
          ctx.fill();
        });

        // Shooting star logic
        shootingStarTimer++;
        if (shootingStarTimer > 300 && !shootingStar.active && Math.random() < 0.03) {
          shootingStar = {
            x: Math.random() * (width * 0.8),
            y: Math.random() * (height * 0.4),
            length: Math.random() * 100 + 60,
            speed: Math.random() * 12 + 15,
            active: true
          };
          shootingStarTimer = 0;
        }

        if (shootingStar.active) {
          ctx.beginPath();
          const grad = ctx.createLinearGradient(
            shootingStar.x,
            shootingStar.y,
            shootingStar.x - shootingStar.length,
            shootingStar.y + shootingStar.length * 0.5
          );
          grad.addColorStop(0, 'rgba(255, 255, 255, 1)');
          grad.addColorStop(1, 'rgba(244, 63, 94, 0)');

          ctx.strokeStyle = grad;
          ctx.lineWidth = 2;
          ctx.moveTo(shootingStar.x, shootingStar.y);
          ctx.lineTo(shootingStar.x - shootingStar.length, shootingStar.y + shootingStar.length * 0.5);
          ctx.stroke();

          shootingStar.x += shootingStar.speed;
          shootingStar.y += shootingStar.speed * 0.5;

          if (shootingStar.x > width || shootingStar.y > height) {
            shootingStar.active = false;
          }
        }
      } else if (weatherMode === 'rain') {
        ctx.strokeStyle = themeMode === 'night' ? 'rgba(147, 197, 253, 0.35)' : 'rgba(244, 63, 94, 0.25)';
        ctx.lineWidth = 1.2;
        particles.forEach((p) => {
          ctx.beginPath();
          ctx.moveTo(p.x, p.y);
          ctx.lineTo(p.x + p.speedX * 3, p.y + p.speedY * 2.5);
          ctx.stroke();

          p.y += p.speedY;
          p.x += p.speedX;

          if (p.y > height) {
            p.y = -10;
            p.x = Math.random() * width;
          }
        });
      } else if (weatherMode === 'snow') {
        particles.forEach((p) => {
          ctx.beginPath();
          ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
          ctx.fillStyle = themeMode === 'night' ? `rgba(255, 255, 255, ${p.opacity})` : `rgba(251, 113, 133, ${p.opacity * 0.7})`;
          ctx.shadowBlur = 4;
          ctx.shadowColor = '#ffffff';
          ctx.fill();

          p.y += p.speedY;
          p.x += Math.sin(p.y * 0.02) * p.speedX;

          if (p.y > height) {
            p.y = -10;
            p.x = Math.random() * width;
          }
        });
      }

      // Render Floating Cursor Hearts
      if (cursorParticlesEnabled && cursorHeartsRef.current.length > 0) {
        cursorHeartsRef.current.forEach((heart, idx) => {
          ctx.save();
          ctx.translate(heart.x, heart.y);
          ctx.rotate((heart.rotation * Math.PI) / 180);
          ctx.globalAlpha = heart.opacity;
          ctx.fillStyle = heart.color;

          // Draw small heart SVG path on canvas
          const s = heart.size;
          ctx.beginPath();
          ctx.moveTo(0, 0);
          ctx.bezierCurveTo(-s / 2, -s / 2, -s, s / 3, 0, s);
          ctx.bezierCurveTo(s, s / 3, s / 2, -s / 2, 0, 0);
          ctx.fill();
          ctx.restore();

          // Update heart state
          heart.y -= heart.speedY;
          heart.x += heart.speedX;
          heart.opacity -= 0.015;

          if (heart.opacity <= 0) {
            cursorHeartsRef.current.splice(idx, 1);
          }
        });
      }

      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      window.removeEventListener('resize', handleResize);
      cancelAnimationFrame(animationFrameId);
    };
  }, [weatherMode, themeMode, cursorParticlesEnabled]);

  // Handle pointer movement to generate drift heart particles
  useEffect(() => {
    let lastTime = 0;
    const colors = ['#f43f5e', '#ec4899', '#fb7185', '#fef08a', '#eab308'];

    const handlePointerMove = (e: MouseEvent | TouchEvent) => {
      if (!cursorParticlesEnabled) return;
      const now = Date.now();
      if (now - lastTime < 40) return; // limit frequency
      lastTime = now;

      let x = 0;
      let y = 0;
      if ('touches' in e && e.touches.length > 0) {
        x = e.touches[0].clientX;
        y = e.touches[0].clientY;
      } else if ('clientX' in e) {
        x = (e as MouseEvent).clientX;
        y = (e as MouseEvent).clientY;
      } else {
        return;
      }

      cursorHeartsRef.current.push({
        id: Math.random(),
        x,
        y: y - 10,
        size: Math.random() * 8 + 8,
        speedY: Math.random() * 1.5 + 1,
        speedX: (Math.random() - 0.5) * 1.2,
        opacity: 0.9,
        rotation: (Math.random() - 0.5) * 30,
        color: colors[Math.floor(Math.random() * colors.length)]
      });

      // Keep maximum 40 cursor particles for performance
      if (cursorHeartsRef.current.length > 40) {
        cursorHeartsRef.current.shift();
      }
    };

    window.addEventListener('mousemove', handlePointerMove);
    window.addEventListener('touchmove', handlePointerMove);

    return () => {
      window.removeEventListener('mousemove', handlePointerMove);
      window.removeEventListener('touchmove', handlePointerMove);
    };
  }, [cursorParticlesEnabled]);

  return (
    <>
      {/* Background Atmosphere Glow Blobs */}
      <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
        <div className="absolute top-[-10%] left-[-10%] w-[55%] h-[55%] bg-indigo-950/40 rounded-full blur-[130px]" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[55%] h-[55%] bg-rose-950/40 rounded-full blur-[130px]" />
        <div className="absolute top-[25%] right-[10%] w-[35%] h-[35%] bg-purple-950/30 rounded-full blur-[110px]" />
      </div>

      <canvas
        ref={canvasRef}
        className="fixed inset-0 pointer-events-none z-0"
      />
      
      {/* Small floating toggle button for mobile particle performance */}
      <div className="fixed bottom-4 left-4 z-40 hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-full bg-slate-900/60 backdrop-blur-md border border-slate-700/50 text-xs text-slate-300 shadow-lg">
        <span className="opacity-75">Cursor Effects</span>
        <button
          onClick={() => setCursorParticlesEnabled(!cursorParticlesEnabled)}
          className={`w-7 h-4 rounded-full p-0.5 transition-colors ${
            cursorParticlesEnabled ? 'bg-rose-500' : 'bg-slate-700'
          }`}
          title="Toggle cursor heart trail"
        >
          <div
            className={`w-3 h-3 rounded-full bg-white transition-transform ${
              cursorParticlesEnabled ? 'translate-x-3' : 'translate-x-0'
            }`}
          />
        </button>
      </div>
    </>
  );
};
