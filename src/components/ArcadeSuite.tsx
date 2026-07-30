import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Gamepad2, Heart, Award, RotateCcw, Sparkles, Trophy, CheckCircle2, XCircle, Gift, Play, Flame, Flower2, Mail, Plane, Star, Lock } from 'lucide-react';
import confetti from 'canvas-confetti';
import { QUIZ_QUESTIONS } from '../data/relationshipData';
import { sounds } from '../utils/soundEffects';

interface ArcadeSuiteProps {
  themeMode: 'night' | 'day';
  onUnlockSecretLetter: () => void;
}

export const ArcadeSuite: React.FC<ArcadeSuiteProps> = ({ themeMode, onUnlockSecretLetter }) => {
  const [activeTab, setActiveTab] = useState<'memory' | 'catch' | 'quiz'>('memory');

  // --- GAME 1: MEMORY MATCH STATE ---
  const iconList = [Heart, Flame, Flower2, Mail, Plane, Star, Sparkles, Award];
  const [cards, setCards] = useState<{ id: number; iconIndex: number; flipped: boolean; matched: boolean }[]>([]);
  const [flippedCards, setFlippedCards] = useState<number[]>([]);
  const [moves, setMoves] = useState(0);
  const [memoryWon, setMemoryWon] = useState(false);

  const initMemoryGame = () => {
    sounds.playClick();
    const pairedIndices = [...Array(8).keys(), ...Array(8).keys()];
    // Shuffle
    const shuffled = pairedIndices
      .sort(() => Math.random() - 0.5)
      .map((iconIndex, idx) => ({
        id: idx,
        iconIndex,
        flipped: false,
        matched: false
      }));
    setCards(shuffled);
    setFlippedCards([]);
    setMoves(0);
    setMemoryWon(false);
  };

  useEffect(() => {
    initMemoryGame();
  }, []);

  const handleCardClick = (index: number) => {
    if (flippedCards.length === 2 || cards[index].flipped || cards[index].matched) return;
    sounds.playClick();

    const newCards = [...cards];
    newCards[index].flipped = true;
    setCards(newCards);

    const newFlipped = [...flippedCards, index];
    setFlippedCards(newFlipped);

    if (newFlipped.length === 2) {
      setMoves((m) => m + 1);
      const [first, second] = newFlipped;
      if (cards[first].iconIndex === cards[second].iconIndex) {
        sounds.playHeartCatch();
        setTimeout(() => {
          setCards((prev) => {
            const updated = [...prev];
            updated[first].matched = true;
            updated[second].matched = true;
            if (updated.every((c) => c.matched)) {
              setMemoryWon(true);
              sounds.playVictoryFanfare();
              confetti({ particleCount: 100, spread: 70, origin: { y: 0.6 } });
            }
            return updated;
          });
          setFlippedCards([]);
        }, 400);
      } else {
        setTimeout(() => {
          setCards((prev) => {
            const updated = [...prev];
            updated[first].flipped = false;
            updated[second].flipped = false;
            return updated;
          });
          setFlippedCards([]);
        }, 900);
      }
    }
  };

  // --- GAME 2: CATCH THE HEARTS CANVAS STATE ---
  const catchCanvasRef = useRef<HTMLCanvasElement | null>(null);
  const [isPlayingCatch, setIsPlayingCatch] = useState(false);
  const [catchScore, setCatchScore] = useState(0);
  const [catchHighScore, setCatchHighScore] = useState<number>(() => {
    return parseInt(localStorage.getItem('catch_hearts_highscore') || '0', 10);
  });
  const [catchGameOver, setCatchGameOver] = useState(false);

  useEffect(() => {
    if (!isPlayingCatch) return;
    const canvas = catchCanvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animId: number;
    let score = 0;
    let basketX = canvas.width / 2;
    const basketWidth = 70;
    const basketHeight = 16;

    const items: { x: number; y: number; speed: number; type: 'heart' | 'star' | 'bomb'; size: number }[] = [];

    const handlePointerMove = (e: MouseEvent | TouchEvent) => {
      const rect = canvas.getBoundingClientRect();
      let clientX = 0;
      if ('touches' in e && e.touches.length > 0) {
        clientX = e.touches[0].clientX;
      } else if ('clientX' in e) {
        clientX = (e as MouseEvent).clientX;
      }
      basketX = Math.max(basketWidth / 2, Math.min(canvas.width - basketWidth / 2, clientX - rect.left));
    };

    window.addEventListener('mousemove', handlePointerMove);
    window.addEventListener('touchmove', handlePointerMove);

    let spawnTimer = 0;

    const gameLoop = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // Draw Basket
      ctx.fillStyle = '#f43f5e';
      ctx.shadowBlur = 15;
      ctx.shadowColor = '#f43f5e';
      ctx.beginPath();
      ctx.roundRect(basketX - basketWidth / 2, canvas.height - 30, basketWidth, basketHeight, 8);
      ctx.fill();

      // Spawn items
      spawnTimer++;
      if (spawnTimer > 35) {
        spawnTimer = 0;
        const rand = Math.random();
        const type = rand < 0.7 ? 'heart' : rand < 0.88 ? 'star' : 'bomb';
        items.push({
          x: Math.random() * (canvas.width - 30) + 15,
          y: -10,
          speed: Math.random() * 2.5 + 2,
          type,
          size: type === 'star' ? 14 : 16
        });
      }

      // Update & Render items
      items.forEach((item, idx) => {
        item.y += item.speed;

        // Render item
        ctx.save();
        ctx.translate(item.x, item.y);

        if (item.type === 'heart') {
          ctx.fillStyle = '#f43f5e';
          ctx.beginPath();
          const s = item.size;
          ctx.moveTo(0, 0);
          ctx.bezierCurveTo(-s / 2, -s / 2, -s, s / 3, 0, s);
          ctx.bezierCurveTo(s, s / 3, s / 2, -s / 2, 0, 0);
          ctx.fill();
        } else if (item.type === 'star') {
          ctx.fillStyle = '#fef08a';
          ctx.beginPath();
          ctx.arc(0, 0, 8, 0, Math.PI * 2);
          ctx.fill();
        } else {
          // Bomb / Broken heart
          ctx.fillStyle = '#64748b';
          ctx.beginPath();
          ctx.arc(0, 0, 9, 0, Math.PI * 2);
          ctx.fill();
        }
        ctx.restore();

        // Collision Check with basket
        if (
          item.y >= canvas.height - 40 &&
          item.y <= canvas.height - 10 &&
          Math.abs(item.x - basketX) < basketWidth / 2 + 10
        ) {
          if (item.type === 'heart') {
            score += 10;
            sounds.playHeartCatch();
          } else if (item.type === 'star') {
            score += 25;
            sounds.playChime();
          } else {
            // Bomb - Game Over
            setCatchGameOver(true);
            setIsPlayingCatch(false);
            if (score > catchHighScore) {
              setCatchHighScore(score);
              localStorage.setItem('catch_hearts_highscore', score.toString());
              confetti();
            }
          }
          setCatchScore(score);
          items.splice(idx, 1);
        } else if (item.y > canvas.height) {
          items.splice(idx, 1);
        }
      });

      if (isPlayingCatch) {
        animId = requestAnimationFrame(gameLoop);
      }
    };

    animId = requestAnimationFrame(gameLoop);

    return () => {
      window.removeEventListener('mousemove', handlePointerMove);
      window.removeEventListener('touchmove', handlePointerMove);
      cancelAnimationFrame(animId);
    };
  }, [isPlayingCatch, catchHighScore]);

  const startCatchGame = () => {
    sounds.playClick();
    setCatchScore(0);
    setCatchGameOver(false);
    setIsPlayingCatch(true);
  };

  // --- GAME 3: ROMANTIC QUIZ STATE ---
  const [currentQuizIdx, setCurrentQuizIdx] = useState(0);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [quizScore, setQuizScore] = useState(0);
  const [quizFinished, setQuizFinished] = useState(false);

  const handleQuizAnswer = (optionIdx: number) => {
    if (selectedOption !== null) return;
    setSelectedOption(optionIdx);

    const isCorrect = optionIdx === QUIZ_QUESTIONS[currentQuizIdx].correctAnswer;
    if (isCorrect) {
      sounds.playChime();
      setQuizScore((s) => s + 1);
    } else {
      sounds.playClick();
    }
  };

  const handleNextQuestion = () => {
    sounds.playClick();
    setSelectedOption(null);
    if (currentQuizIdx + 1 < QUIZ_QUESTIONS.length) {
      setCurrentQuizIdx((i) => i + 1);
    } else {
      setQuizFinished(true);
      if (quizScore + (selectedOption === QUIZ_QUESTIONS[currentQuizIdx].correctAnswer ? 1 : 0) === QUIZ_QUESTIONS.length) {
        sounds.playVictoryFanfare();
        confetti({ particleCount: 150, spread: 90 });
        onUnlockSecretLetter();
      }
    }
  };

  const restartQuiz = () => {
    sounds.playClick();
    setCurrentQuizIdx(0);
    setSelectedOption(null);
    setQuizScore(0);
    setQuizFinished(false);
  };

  return (
    <section id="arcade" className="py-20 px-4 sm:px-6 max-w-5xl mx-auto relative">
      {/* Title Header */}
      <div className="text-center max-w-2xl mx-auto mb-10">
        <span className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs font-semibold uppercase tracking-widest mb-3">
          <Gamepad2 className="w-3.5 h-3.5 text-amber-300" />
          Amusement Arcade
        </span>
        <h2 className="font-serif text-3xl sm:text-4xl font-bold tracking-tight text-slate-100 mb-3">
          Interactive Romantic Games
        </h2>
        <p className="text-slate-300 text-sm">
          Challenge each other, unlock high scores, and discover hidden secret letters!
        </p>
      </div>

      {/* Game Selector Tabs */}
      <div className="flex items-center justify-center gap-3 mb-10">
        <button
          onClick={() => { sounds.playClick(); setActiveTab('memory'); }}
          className={`px-5 py-2.5 rounded-2xl text-xs sm:text-sm font-bold flex items-center gap-2 transition-all cursor-pointer ${
            activeTab === 'memory'
              ? 'bg-rose-500 text-white shadow-lg glow-box-rose'
              : 'bg-slate-900/70 border border-slate-800 text-slate-400 hover:text-white'
          }`}
        >
          <Sparkles className="w-4 h-4" /> Memory Match
        </button>
        <button
          onClick={() => { sounds.playClick(); setActiveTab('catch'); }}
          className={`px-5 py-2.5 rounded-2xl text-xs sm:text-sm font-bold flex items-center gap-2 transition-all cursor-pointer ${
            activeTab === 'catch'
              ? 'bg-rose-500 text-white shadow-lg glow-box-rose'
              : 'bg-slate-900/70 border border-slate-800 text-slate-400 hover:text-white'
          }`}
        >
          <Heart className="w-4 h-4" /> Catch Hearts
        </button>
        <button
          onClick={() => { sounds.playClick(); setActiveTab('quiz'); }}
          className={`px-5 py-2.5 rounded-2xl text-xs sm:text-sm font-bold flex items-center gap-2 transition-all cursor-pointer ${
            activeTab === 'quiz'
              ? 'bg-rose-500 text-white shadow-lg glow-box-rose'
              : 'bg-slate-900/70 border border-slate-800 text-slate-400 hover:text-white'
          }`}
        >
          <Trophy className="w-4 h-4" /> Couple Quiz
        </button>
      </div>

      {/* GAME 1: MEMORY MATCH CONTAINER */}
      {activeTab === 'memory' && (
        <div className="p-6 sm:p-8 rounded-3xl glass-card border border-rose-500/20 max-w-xl mx-auto text-center">
          <div className="flex items-center justify-between mb-6">
            <span className="text-xs font-semibold text-slate-300">
              Moves: <strong className="text-rose-400">{moves}</strong>
            </span>
            <button
              onClick={initMemoryGame}
              className="px-3 py-1.5 rounded-xl bg-slate-800 text-slate-300 hover:text-white text-xs font-semibold flex items-center gap-1"
            >
              <RotateCcw className="w-3.5 h-3.5" /> Restart
            </button>
          </div>

          <div className="grid grid-cols-4 gap-3 sm:gap-4 mb-6">
            {cards.map((card, idx) => {
              const IconComp = iconList[card.iconIndex];
              return (
                <div
                  key={card.id}
                  onClick={() => handleCardClick(idx)}
                  className={`aspect-square rounded-2xl flex items-center justify-center cursor-pointer transition-all duration-300 transform border ${
                    card.flipped || card.matched
                      ? 'bg-slate-900 border-rose-500/60 shadow-[0_0_15px_rgba(244,63,94,0.4)] rotate-0'
                      : 'bg-slate-950 border-slate-800 hover:border-slate-700 hover:scale-105'
                  }`}
                >
                  {card.flipped || card.matched ? (
                    <IconComp className="w-7 h-7 text-rose-400 fill-rose-400/20 animate-pulse" />
                  ) : (
                    <Heart className="w-6 h-6 text-slate-700 fill-slate-800" />
                  )}
                </div>
              );
            })}
          </div>

          {memoryWon && (
            <div className="p-4 rounded-2xl bg-rose-500/20 border border-rose-500/40 text-rose-200 text-sm font-bold flex items-center justify-center gap-2 animate-bounce">
              <Trophy className="w-5 h-5 text-amber-300" /> You matched all pairs in {moves} moves!
            </div>
          )}
        </div>
      )}

      {/* GAME 2: CATCH THE HEARTS CONTAINER */}
      {activeTab === 'catch' && (
        <div className="p-6 rounded-3xl glass-card border border-rose-500/20 max-w-lg mx-auto text-center relative overflow-hidden">
          <div className="flex items-center justify-between mb-4 text-xs font-semibold text-slate-300">
            <span>Score: <strong className="text-rose-400 text-base">{catchScore}</strong></span>
            <span>High Score: <strong className="text-amber-300 text-base">{catchHighScore}</strong></span>
          </div>

          <div className="relative w-full aspect-[4/3] bg-slate-950 rounded-2xl border border-slate-800 overflow-hidden mb-4">
            <canvas
              ref={catchCanvasRef}
              width={400}
              height={300}
              className="w-full h-full block"
            />

            {!isPlayingCatch && (
              <div className="absolute inset-0 bg-slate-950/85 backdrop-blur-sm flex flex-col items-center justify-center p-6 text-center">
                <Heart className="w-12 h-12 text-rose-500 fill-rose-500 mb-3 animate-heartbeat" />
                <h3 className="font-serif text-xl font-bold text-white mb-2">
                  {catchGameOver ? 'Game Over!' : 'Catch the Floating Hearts'}
                </h3>
                <p className="text-xs text-slate-300 mb-6 max-w-xs">
                  Move your cursor or slide your finger to guide the basket. Catch hearts and stars, avoid bombs!
                </p>
                <button
                  onClick={startCatchGame}
                  className="px-6 py-3 rounded-full bg-gradient-to-r from-rose-600 to-amber-500 text-white font-bold text-sm shadow-xl hover:scale-105 transition-transform flex items-center gap-2"
                >
                  <Play className="w-4 h-4 fill-white" /> {catchGameOver ? 'Play Again' : 'Start Catching'}
                </button>
              </div>
            )}
          </div>
        </div>
      )}

      {/* GAME 3: ROMANTIC QUIZ CONTAINER */}
      {activeTab === 'quiz' && (
        <div className="p-6 sm:p-8 rounded-3xl glass-card border border-rose-500/20 max-w-xl mx-auto">
          {!quizFinished ? (
            <div>
              <div className="flex items-center justify-between text-xs text-slate-400 mb-4">
                <span>Question {currentQuizIdx + 1} of {QUIZ_QUESTIONS.length}</span>
                <span>Score: {quizScore}</span>
              </div>

              <h3 className="font-serif text-xl font-bold text-white mb-6">
                {QUIZ_QUESTIONS[currentQuizIdx].question}
              </h3>

              <div className="space-y-3 mb-6">
                {QUIZ_QUESTIONS[currentQuizIdx].options.map((opt, optionIdx) => {
                  const isSelected = selectedOption === optionIdx;
                  const isCorrect = optionIdx === QUIZ_QUESTIONS[currentQuizIdx].correctAnswer;
                  
                  let btnStyle = 'bg-slate-900 border-slate-800 hover:border-rose-500/50 text-slate-200';
                  if (selectedOption !== null) {
                    if (isCorrect) btnStyle = 'bg-emerald-600/30 border-emerald-500 text-emerald-200 font-bold';
                    else if (isSelected) btnStyle = 'bg-rose-600/30 border-rose-500 text-rose-200 font-bold';
                  }

                  return (
                    <button
                      key={opt}
                      onClick={() => handleQuizAnswer(optionIdx)}
                      disabled={selectedOption !== null}
                      className={`w-full p-4 rounded-2xl border text-left text-sm transition-all flex items-center justify-between ${btnStyle}`}
                    >
                      <span>{opt}</span>
                      {selectedOption !== null && (
                        isCorrect ? <CheckCircle2 className="w-5 h-5 text-emerald-400" /> : isSelected ? <XCircle className="w-5 h-5 text-rose-400" /> : null
                      )}
                    </button>
                  );
                })}
              </div>

              {selectedOption !== null && (
                <div className="p-4 rounded-2xl bg-slate-900/90 border border-slate-800 text-xs text-slate-300 mb-6">
                  <span className="font-bold text-rose-300 block mb-1">Trivia Note:</span>
                  {QUIZ_QUESTIONS[currentQuizIdx].explanation}
                </div>
              )}

              {selectedOption !== null && (
                <div className="flex justify-end">
                  <button
                    onClick={handleNextQuestion}
                    className="px-6 py-2.5 rounded-full bg-rose-500 text-white font-bold text-sm hover:bg-rose-600 transition-colors"
                  >
                    {currentQuizIdx + 1 === QUIZ_QUESTIONS.length ? 'View Results' : 'Next Question'}
                  </button>
                </div>
              )}
            </div>
          ) : (
            <div className="text-center py-6">
              <Trophy className="w-16 h-16 text-amber-300 mx-auto mb-4 animate-bounce" />
              <h3 className="font-serif text-2xl font-bold text-white mb-2">
                Quiz Completed!
              </h3>
              <p className="text-sm text-slate-300 mb-6">
                You scored <strong className="text-rose-400 font-bold text-lg">{quizScore} / {QUIZ_QUESTIONS.length}</strong>
              </p>

              {quizScore === QUIZ_QUESTIONS.length ? (
                <div className="p-4 rounded-2xl bg-amber-500/20 border border-amber-500/40 text-amber-200 text-xs font-semibold mb-6">
                  🎉 Perfect 100% Score! Secret Romantic Letter Unlocked in Vault!
                </div>
              ) : (
                <p className="text-xs text-slate-400 mb-6">
                  Score 100% to automatically unlock a secret love letter!
                </p>
              )}

              <button
                onClick={restartQuiz}
                className="px-6 py-3 rounded-full bg-rose-500 text-white font-bold text-sm hover:bg-rose-600 transition-colors"
              >
                Try Quiz Again
              </button>
            </div>
          )}
        </div>
      )}
    </section>
  );
};
