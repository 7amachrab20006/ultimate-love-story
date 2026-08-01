import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Gamepad2, Heart, Award, RotateCcw, Sparkles, Trophy, CheckCircle2, XCircle, 
  Gift, Play, Flame, Flower2, Mail, Plane, Star, Lock, MessageCircleHeart,
  Calendar, Shuffle, Palette, HelpCircle, Send
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { QUIZ_QUESTIONS } from '../data/relationshipData';
import { sounds } from '../utils/soundEffects';

interface ArcadeSuiteProps {
  themeMode: 'night' | 'day';
  onUnlockSecretLetter: () => void;
}

type GameTab = 'memory' | 'catch' | 'quiz' | 'trivia' | 'date' | 'scramble' | 'secret' | 'color';

export const ArcadeSuite: React.FC<ArcadeSuiteProps> = ({ themeMode, onUnlockSecretLetter }) => {
  const [activeTab, setActiveTab] = useState<GameTab>('memory');

  // --- GAME 1: MEMORY MATCH STATE ---
  const iconList = [Heart, Flame, Flower2, Mail, Plane, Star, Sparkles, Award];
  const [cards, setCards] = useState<{ id: number; iconIndex: number; flipped: boolean; matched: boolean }[]>([]);
  const [flippedCards, setFlippedCards] = useState<number[]>([]);
  const [moves, setMoves] = useState(0);
  const [memoryWon, setMemoryWon] = useState(false);

  const initMemoryGame = () => {
    sounds.playClick();
    const pairedIndices = [...Array(8).keys(), ...Array(8).keys()];
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

      ctx.fillStyle = '#f43f5e';
      ctx.shadowBlur = 15;
      ctx.shadowColor = '#f43f5e';
      ctx.beginPath();
      ctx.roundRect(basketX - basketWidth / 2, canvas.height - 30, basketWidth, basketHeight, 8);
      ctx.fill();

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

      items.forEach((item, idx) => {
        item.y += item.speed;
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
          ctx.fillStyle = '#64748b';
          ctx.beginPath();
          ctx.arc(0, 0, 9, 0, Math.PI * 2);
          ctx.fill();
        }
        ctx.restore();

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

  // --- GAME 4: LOVE TRIVIA (personalized milestone questions) ---
  const TRIVIA_QUESTIONS = [
    {
      q: "Where did our 'First Spark' happen?",
      options: ["Old Medina Street", "Sunset Beach Cafe", "Pine Ridge Lookout", "Cozy Fireside Room"],
      correct: 1,
    },
    {
      q: "What did we do at Pine Ridge on August 14, 2022?",
      options: ["Had dinner", "Watched a sunrise", "Went stargazing", "Took photos"],
      correct: 2,
    },
    {
      q: "Where did we spend our First Christmas & said 'I Love You'?",
      options: ["Beach Cafe", "Cozy Fireside Living Room", "Pine Ridge Cabin", "Home Kitchen"],
      correct: 1,
    },
    {
      q: "What month did our First Spark happen?",
      options: ["May", "June", "July", "August"],
      correct: 1,
    },
    {
      q: "What year did we say our first 'I Love You'?",
      options: ["2021", "2022", "2023", "2024"],
      correct: 1,
    },
  ];
  const [triviaIdx, setTriviaIdx] = useState(0);
  const [triviaSelected, setTriviaSelected] = useState<number | null>(null);
  const [triviaScore, setTriviaScore] = useState(0);
  const [triviaDone, setTriviaDone] = useState(false);

  const handleTriviaAnswer = (idx: number) => {
    if (triviaSelected !== null) return;
    setTriviaSelected(idx);
    if (idx === TRIVIA_QUESTIONS[triviaIdx].correct) {
      setTriviaScore((s) => s + 1);
      sounds.playChime();
    } else {
      sounds.playClick();
    }
  };

  const nextTrivia = () => {
    sounds.playClick();
    setTriviaSelected(null);
    if (triviaIdx + 1 < TRIVIA_QUESTIONS.length) {
      setTriviaIdx((i) => i + 1);
    } else {
      setTriviaDone(true);
      const finalScore = triviaScore + (triviaSelected === TRIVIA_QUESTIONS[triviaIdx].correct ? 1 : 0);
      if (finalScore === TRIVIA_QUESTIONS.length) {
        sounds.playVictoryFanfare();
        confetti({ particleCount: 150, spread: 90 });
      }
    }
  };

  const resetTrivia = () => {
    sounds.playClick();
    setTriviaIdx(0);
    setTriviaSelected(null);
    setTriviaScore(0);
    setTriviaDone(false);
  };

  // --- GAME 5: GUESS THE MILESTONE DATE ---
  const DATE_ROUNDS = [
    {
      story: "The moment our eyes first met over warm coffee at the Sunset Beach Cafe — our First Spark ☀️",
      correctDate: new Date('2022-06-18').getTime(),
      label: "First Spark",
    },
    {
      story: "The night sky above Pine Ridge Lookout, blankets, and endless stars ✨",
      correctDate: new Date('2022-08-14').getTime(),
      label: "Stargazing at Pine Ridge",
    },
    {
      story: "By the warm fireplace, hearts wide open — our first 'I Love You' 🎄",
      correctDate: new Date('2022-12-24').getTime(),
      label: "First Christmas & 'I Love You'",
    },
  ];

  const minDate = new Date('2022-01-01').getTime();
  const maxDate = new Date('2023-12-31').getTime();
  const [dateRoundIdx, setDateRoundIdx] = useState(0);
  const [dateGuess, setDateGuess] = useState<number>((minDate + maxDate) / 2);
  const [dateSubmitted, setDateSubmitted] = useState(false);
  const [dateTotalScore, setDateTotalScore] = useState(0);
  const [dateGameDone, setDateGameDone] = useState(false);

  const formatDate = (ts: number) =>
    new Date(ts).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });

  const handleDateSubmit = () => {
    sounds.playClick();
    setDateSubmitted(true);
    const diffDays = Math.abs(dateGuess - DATE_ROUNDS[dateRoundIdx].correctDate) / (1000 * 60 * 60 * 24);
    // score: 100 max, lose 1 point per 3 days off
    const roundScore = Math.max(0, Math.round(100 - diffDays / 3));
    setDateTotalScore((s) => s + roundScore);
    if (roundScore > 90) {
      sounds.playChime();
      confetti({ particleCount: 50, spread: 60 });
    }
  };

  const nextDateRound = () => {
    sounds.playClick();
    setDateSubmitted(false);
    setDateGuess((minDate + maxDate) / 2);
    if (dateRoundIdx + 1 < DATE_ROUNDS.length) {
      setDateRoundIdx((i) => i + 1);
    } else {
      setDateGameDone(true);
    }
  };

  const resetDateGame = () => {
    sounds.playClick();
    setDateRoundIdx(0);
    setDateGuess((minDate + maxDate) / 2);
    setDateSubmitted(false);
    setDateTotalScore(0);
    setDateGameDone(false);
  };

  // --- GAME 6: LOVE LETTER WORD SCRAMBLE ---
  const SCRAMBLE_WORDS = [
    { word: 'LOVE', hint: 'The core of everything ❤️' },
    { word: 'FOREVER', hint: 'How long I want us to last ♾️' },
    { word: 'SUNSET', hint: 'Where our first spark happened 🌅' },
    { word: 'STARS', hint: 'What we watched at Pine Ridge ✨' },
    { word: 'ASMA', hint: 'The most beautiful name 💕' },
    { word: 'DESTINY', hint: 'What brought us together 🌌' },
    { word: 'HEART', hint: 'What beats only for you 💓' },
  ];

  const scrambleWord = (w: string) => {
    let arr = w.split('');
    do {
      arr = arr.sort(() => Math.random() - 0.5);
    } while (arr.join('') === w);
    return arr.join('');
  };

  const [scrambleIdx, setScrambleIdx] = useState(0);
  const [scrambled, setScrambled] = useState(() => scrambleWord(SCRAMBLE_WORDS[0].word));
  const [scrambleGuess, setScrambleGuess] = useState('');
  const [scrambleFeedback, setScrambleFeedback] = useState<'correct' | 'wrong' | null>(null);
  const [scrambleScore, setScrambleScore] = useState(0);
  const [scrambleDone, setScrambleDone] = useState(false);

  const handleScrambleSubmit = () => {
    if (!scrambleGuess.trim()) return;
    sounds.playClick();
    if (scrambleGuess.trim().toUpperCase() === SCRAMBLE_WORDS[scrambleIdx].word) {
      setScrambleFeedback('correct');
      setScrambleScore((s) => s + 1);
      sounds.playChime();
      setTimeout(() => {
        if (scrambleIdx + 1 < SCRAMBLE_WORDS.length) {
          const nextIdx = scrambleIdx + 1;
          setScrambleIdx(nextIdx);
          setScrambled(scrambleWord(SCRAMBLE_WORDS[nextIdx].word));
          setScrambleGuess('');
          setScrambleFeedback(null);
        } else {
          setScrambleDone(true);
          sounds.playVictoryFanfare();
          confetti({ particleCount: 100, spread: 70 });
        }
      }, 1200);
    } else {
      setScrambleFeedback('wrong');
      setTimeout(() => setScrambleFeedback(null), 1000);
    }
  };

  const resetScramble = () => {
    sounds.playClick();
    setScrambleIdx(0);
    setScrambled(scrambleWord(SCRAMBLE_WORDS[0].word));
    setScrambleGuess('');
    setScrambleFeedback(null);
    setScrambleScore(0);
    setScrambleDone(false);
  };

  // --- GAME 7: SECRET MESSAGE REVEAL ---
  const SECRET_MESSAGE = "YOU ARE MY WHOLE WORLD ASMA";
  const [revealedLetters, setRevealedLetters] = useState<boolean[]>(
    Array(SECRET_MESSAGE.length).fill(false)
  );
  const [secretGuess, setSecretGuess] = useState('');
  const [secretWon, setSecretWon] = useState(false);
  const [secretAttempts, setSecretAttempts] = useState(0);

  const handleRevealLetter = (idx: number) => {
    if (revealedLetters[idx] || SECRET_MESSAGE[idx] === ' ') return;
    sounds.playClick();
    const updated = [...revealedLetters];
    updated[idx] = true;
    setRevealedLetters(updated);
    setSecretAttempts((a) => a + 1);
  };

  const handleSecretSubmit = () => {
    sounds.playClick();
    if (secretGuess.trim().toUpperCase() === SECRET_MESSAGE) {
      setSecretWon(true);
      setRevealedLetters(Array(SECRET_MESSAGE.length).fill(true));
      sounds.playVictoryFanfare();
      confetti({ particleCount: 200, spread: 100, origin: { y: 0.6 } });
      onUnlockSecretLetter();
    }
  };

  const resetSecret = () => {
    sounds.playClick();
    setRevealedLetters(Array(SECRET_MESSAGE.length).fill(false));
    setSecretGuess('');
    setSecretWon(false);
    setSecretAttempts(0);
  };

  // --- GAME 8: COLOR MATCH EMOTIONS ---
  const COLOR_PAIRS = [
    { color: '#f97316', label: 'Sunset Orange', memory: 'Our First Coffee Date 🌅' },
    { color: '#facc15', label: 'Golden Yellow', memory: 'Starlight at Pine Ridge ✨' },
    { color: '#dc2626', label: 'Fireplace Red', memory: 'First Christmas Together 🔥' },
    { color: '#a855f7', label: 'Twilight Purple', memory: 'Old Medina Strolls 🌆' },
    { color: '#ec4899', label: 'Rose Pink', memory: 'Every Love Note 💌' },
  ];

  const [colorMatches, setColorMatches] = useState<Record<string, string>>({});
  const [colorSelected, setColorSelected] = useState<string | null>(null);
  const [shuffledMemories, setShuffledMemories] = useState<typeof COLOR_PAIRS>(() =>
    [...COLOR_PAIRS].sort(() => Math.random() - 0.5)
  );
  const [colorWon, setColorWon] = useState(false);

  const handleColorClick = (colorLabel: string) => {
    sounds.playClick();
    setColorSelected(colorLabel);
  };

  const handleMemoryClick = (memory: string) => {
    if (!colorSelected) return;
    sounds.playClick();
    const targetPair = COLOR_PAIRS.find((p) => p.label === colorSelected);
    if (targetPair && targetPair.memory === memory) {
      sounds.playChime();
      const updated = { ...colorMatches, [colorSelected]: memory };
      setColorMatches(updated);
      setColorSelected(null);
      if (Object.keys(updated).length === COLOR_PAIRS.length) {
        setColorWon(true);
        sounds.playVictoryFanfare();
        confetti({ particleCount: 150, spread: 90 });
      }
    } else {
      // wrong pair
      setColorSelected(null);
    }
  };

  const resetColorGame = () => {
    sounds.playClick();
    setColorMatches({});
    setColorSelected(null);
    setShuffledMemories([...COLOR_PAIRS].sort(() => Math.random() - 0.5));
    setColorWon(false);
  };

  // --- TAB CONFIG ---
  const tabs: { id: GameTab; label: string; icon: any }[] = [
    { id: 'memory', label: 'Memory Match', icon: Sparkles },
    { id: 'catch', label: 'Catch Hearts', icon: Heart },
    { id: 'quiz', label: 'Couple Quiz', icon: Trophy },
    { id: 'trivia', label: 'Love Trivia', icon: HelpCircle },
    { id: 'date', label: 'Guess the Date', icon: Calendar },
    { id: 'scramble', label: 'Word Scramble', icon: Shuffle },
    { id: 'secret', label: 'Secret Message', icon: MessageCircleHeart },
    { id: 'color', label: 'Color Emotions', icon: Palette },
  ];

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

      {/* Game Selector Tabs (scrollable) */}
      <div className="flex items-center justify-start sm:justify-center gap-3 mb-10 overflow-x-auto pb-3 px-2 scrollbar-thin">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const active = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => { sounds.playClick(); setActiveTab(tab.id); }}
              className={`whitespace-nowrap px-4 py-2.5 rounded-2xl text-xs sm:text-sm font-bold flex items-center gap-2 transition-all cursor-pointer flex-shrink-0 ${
                active
                  ? 'bg-rose-500 text-white shadow-lg glow-box-rose'
                  : 'bg-slate-900/70 border border-slate-800 text-slate-400 hover:text-white'
              }`}
            >
              <Icon className="w-4 h-4" /> {tab.label}
            </button>
          );
        })}
      </div>

      {/* GAME 1: MEMORY MATCH */}
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

      {/* GAME 2: CATCH THE HEARTS */}
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

      {/* GAME 3: ROMANTIC QUIZ */}
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
              <h3 className="font-serif text-2xl font-bold text-white mb-2">Quiz Completed!</h3>
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

      {/* GAME 4: LOVE TRIVIA */}
      {activeTab === 'trivia' && (
        <div className="p-6 sm:p-8 rounded-3xl glass-card border border-rose-500/20 max-w-xl mx-auto">
          {!triviaDone ? (
            <div>
              <div className="flex items-center justify-between text-xs text-slate-400 mb-4">
                <span>Question {triviaIdx + 1} of {TRIVIA_QUESTIONS.length}</span>
                <span>Score: {triviaScore}</span>
              </div>

              <h3 className="font-serif text-xl font-bold text-white mb-6">
                💘 {TRIVIA_QUESTIONS[triviaIdx].q}
              </h3>

              <div className="space-y-3 mb-6">
                {TRIVIA_QUESTIONS[triviaIdx].options.map((opt, i) => {
                  const isSelected = triviaSelected === i;
                  const isCorrect = i === TRIVIA_QUESTIONS[triviaIdx].correct;

                  let btnStyle = 'bg-slate-900 border-slate-800 hover:border-rose-500/50 text-slate-200';
                  if (triviaSelected !== null) {
                    if (isCorrect) btnStyle = 'bg-emerald-600/30 border-emerald-500 text-emerald-200 font-bold';
                    else if (isSelected) btnStyle = 'bg-rose-600/30 border-rose-500 text-rose-200 font-bold';
                  }

                  return (
                    <button
                      key={opt}
                      onClick={() => handleTriviaAnswer(i)}
                      disabled={triviaSelected !== null}
                      className={`w-full p-4 rounded-2xl border text-left text-sm transition-all flex items-center justify-between ${btnStyle}`}
                    >
                      <span>{opt}</span>
                      {triviaSelected !== null && (
                        isCorrect ? <CheckCircle2 className="w-5 h-5 text-emerald-400" /> : isSelected ? <XCircle className="w-5 h-5 text-rose-400" /> : null
                      )}
                    </button>
                  );
                })}
              </div>

              {triviaSelected !== null && (
                <div className="flex justify-end">
                  <button
                    onClick={nextTrivia}
                    className="px-6 py-2.5 rounded-full bg-rose-500 text-white font-bold text-sm hover:bg-rose-600 transition-colors"
                  >
                    {triviaIdx + 1 === TRIVIA_QUESTIONS.length ? 'See Results' : 'Next Question'}
                  </button>
                </div>
              )}
            </div>
          ) : (
            <div className="text-center py-6">
              <Trophy className="w-16 h-16 text-amber-300 mx-auto mb-4 animate-bounce" />
              <h3 className="font-serif text-2xl font-bold text-white mb-2">Trivia Complete! 💘</h3>
              <p className="text-sm text-slate-300 mb-6">
                Score: <strong className="text-rose-400 font-bold text-lg">{triviaScore} / {TRIVIA_QUESTIONS.length}</strong>
              </p>
              <button
                onClick={resetTrivia}
                className="px-6 py-3 rounded-full bg-rose-500 text-white font-bold text-sm hover:bg-rose-600 transition-colors"
              >
                Play Again
              </button>
            </div>
          )}
        </div>
      )}

      {/* GAME 5: GUESS THE MILESTONE DATE */}
      {activeTab === 'date' && (
        <div className="p-6 sm:p-8 rounded-3xl glass-card border border-rose-500/20 max-w-xl mx-auto">
          {!dateGameDone ? (
            <div>
              <div className="flex items-center justify-between text-xs text-slate-400 mb-4">
                <span>Round {dateRoundIdx + 1} of {DATE_ROUNDS.length}</span>
                <span>Total Score: <strong className="text-amber-300">{dateTotalScore}</strong></span>
              </div>

              <h3 className="font-serif text-lg font-bold text-white mb-2">
                🌹 {DATE_ROUNDS[dateRoundIdx].label}
              </h3>
              <p className="text-sm text-slate-300 mb-6 italic">
                "{DATE_ROUNDS[dateRoundIdx].story}"
              </p>

              <div className="p-5 rounded-2xl bg-slate-950 border border-slate-800 mb-4">
                <p className="text-center text-lg font-serif text-rose-300 mb-4">
                  {formatDate(dateGuess)}
                </p>
                <input
                  type="range"
                  min={minDate}
                  max={maxDate}
                  step={1000 * 60 * 60 * 24}
                  value={dateGuess}
                  onChange={(e) => setDateGuess(parseInt(e.target.value))}
                  disabled={dateSubmitted}
                  className="w-full accent-rose-500"
                />
                <div className="flex justify-between text-[10px] text-slate-500 mt-2">
                  <span>{formatDate(minDate)}</span>
                  <span>{formatDate(maxDate)}</span>
                </div>
              </div>

              {!dateSubmitted ? (
                <button
                  onClick={handleDateSubmit}
                  className="w-full px-6 py-3 rounded-full bg-rose-500 text-white font-bold text-sm hover:bg-rose-600 transition-colors"
                >
                  Lock in My Guess 💘
                </button>
              ) : (
                <div>
                  <div className="p-4 rounded-2xl bg-slate-900/90 border border-slate-800 text-center mb-4">
                    <p className="text-xs text-slate-400 mb-1">Actual date was:</p>
                    <p className="text-lg font-serif text-emerald-300 font-bold">
                      {formatDate(DATE_ROUNDS[dateRoundIdx].correctDate)}
                    </p>
                    <p className="text-xs text-slate-400 mt-2">
                      You were off by <strong className="text-rose-300">
                        {Math.round(Math.abs(dateGuess - DATE_ROUNDS[dateRoundIdx].correctDate) / (1000 * 60 * 60 * 24))} days
                      </strong>
                    </p>
                  </div>
                  <button
                    onClick={nextDateRound}
                    className="w-full px-6 py-3 rounded-full bg-rose-500 text-white font-bold text-sm hover:bg-rose-600 transition-colors"
                  >
                    {dateRoundIdx + 1 === DATE_ROUNDS.length ? 'See Final Score' : 'Next Round'}
                  </button>
                </div>
              )}
            </div>
          ) : (
            <div className="text-center py-6">
              <Trophy className="w-16 h-16 text-amber-300 mx-auto mb-4 animate-bounce" />
              <h3 className="font-serif text-2xl font-bold text-white mb-2">Rounds Complete! 🌹</h3>
              <p className="text-sm text-slate-300 mb-6">
                Total: <strong className="text-rose-400 font-bold text-lg">{dateTotalScore} / {DATE_ROUNDS.length * 100}</strong>
              </p>
              <button
                onClick={resetDateGame}
                className="px-6 py-3 rounded-full bg-rose-500 text-white font-bold text-sm hover:bg-rose-600 transition-colors"
              >
                Play Again
              </button>
            </div>
          )}
        </div>
      )}

      {/* GAME 6: LOVE LETTER WORD SCRAMBLE */}
      {activeTab === 'scramble' && (
        <div className="p-6 sm:p-8 rounded-3xl glass-card border border-rose-500/20 max-w-xl mx-auto text-center">
          {!scrambleDone ? (
            <div>
              <div className="flex items-center justify-between text-xs text-slate-400 mb-6">
                <span>Word {scrambleIdx + 1} of {SCRAMBLE_WORDS.length}</span>
                <span>Score: <strong className="text-amber-300">{scrambleScore}</strong></span>
              </div>

              <p className="text-sm text-slate-300 mb-3 italic">💌 Hint:</p>
              <p className="font-serif text-lg text-rose-200 mb-6">
                "{SCRAMBLE_WORDS[scrambleIdx].hint}"
              </p>

              <div className="flex justify-center gap-2 sm:gap-3 mb-8 flex-wrap">
                {scrambled.split('').map((letter, i) => (
                  <div
                    key={i}
                    className="w-11 h-14 sm:w-12 sm:h-16 rounded-xl bg-gradient-to-b from-slate-900 to-slate-950 border-2 border-rose-500/40 flex items-center justify-center font-serif text-xl sm:text-2xl font-bold text-rose-200 shadow-lg"
                  >
                    {letter}
                  </div>
                ))}
              </div>

              <input
                type="text"
                value={scrambleGuess}
                onChange={(e) => setScrambleGuess(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleScrambleSubmit()}
                placeholder="Unscramble the word..."
                className={`w-full max-w-sm px-4 py-3 rounded-2xl bg-slate-950 border text-center font-serif text-lg tracking-widest uppercase focus:outline-none mb-4 transition-all ${
                  scrambleFeedback === 'correct'
                    ? 'border-emerald-500 text-emerald-200'
                    : scrambleFeedback === 'wrong'
                    ? 'border-rose-500 text-rose-200 animate-shake'
                    : 'border-slate-800 text-white focus:border-rose-500'
                }`}
              />
              <br />
              <button
                onClick={handleScrambleSubmit}
                disabled={!scrambleGuess.trim()}
                className="px-6 py-3 rounded-full bg-gradient-to-r from-rose-600 to-amber-500 text-white font-bold text-sm shadow-xl hover:scale-105 transition-transform disabled:opacity-40 disabled:cursor-not-allowed inline-flex items-center gap-2"
              >
                <Send className="w-4 h-4" /> Submit
              </button>
            </div>
          ) : (
            <div className="py-6">
              <Trophy className="w-16 h-16 text-amber-300 mx-auto mb-4 animate-bounce" />
              <h3 className="font-serif text-2xl font-bold text-white mb-2">All Words Solved! 💌</h3>
              <p className="text-sm text-slate-300 mb-6">
                Perfect Score: <strong className="text-rose-400 font-bold text-lg">{scrambleScore} / {SCRAMBLE_WORDS.length}</strong>
              </p>
              <button
                onClick={resetScramble}
                className="px-6 py-3 rounded-full bg-rose-500 text-white font-bold text-sm hover:bg-rose-600 transition-colors"
              >
                Play Again
              </button>
            </div>
          )}
        </div>
      )}

      {/* GAME 7: SECRET MESSAGE REVEAL */}
      {activeTab === 'secret' && (
        <div className="p-6 sm:p-8 rounded-3xl glass-card border border-rose-500/20 max-w-2xl mx-auto text-center">
          <div className="flex items-center justify-between mb-6 text-xs font-semibold text-slate-300">
            <span>Revealed: <strong className="text-rose-400">{revealedLetters.filter(Boolean).length}</strong> / {SECRET_MESSAGE.replace(/ /g, '').length}</span>
            <span>Clicks: <strong className="text-amber-300">{secretAttempts}</strong></span>
            <button
              onClick={resetSecret}
              className="px-3 py-1.5 rounded-xl bg-slate-800 text-slate-300 hover:text-white text-xs font-semibold flex items-center gap-1"
            >
              <RotateCcw className="w-3.5 h-3.5" /> Reset
            </button>
          </div>

          <p className="text-slate-300 text-sm mb-6">
            💌 Reveal a few letters, then <strong className="text-rose-300">guess the secret message below</strong> to unlock a hidden love note!
          </p>

          <div className="flex flex-wrap gap-2 justify-center mb-8">
            {SECRET_MESSAGE.split('').map((char, idx) => {
              if (char === ' ') return <div key={idx} className="w-4" />;
              const isRevealed = revealedLetters[idx];
              return (
                <motion.div
                  key={idx}
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => handleRevealLetter(idx)}
                  className={`w-10 h-12 sm:w-11 sm:h-14 rounded-xl flex items-center justify-center cursor-pointer transition-all border-2 ${
                    isRevealed
                      ? 'bg-gradient-to-b from-rose-500/30 to-rose-500/10 border-rose-400 text-rose-100 shadow-[0_0_15px_rgba(244,63,94,0.4)]'
                      : 'bg-slate-950 border-slate-800 hover:border-rose-500/50'
                  }`}
                >
                  {isRevealed ? (
                    <span className="font-serif text-lg sm:text-xl font-bold">{char}</span>
                  ) : (
                    <Heart className="w-5 h-5 text-slate-700 fill-slate-800" />
                  )}
                </motion.div>
              );
            })}
          </div>

          {!secretWon ? (
            <div className="max-w-md mx-auto">
              <input
                type="text"
                value={secretGuess}
                onChange={(e) => setSecretGuess(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleSecretSubmit()}
                placeholder="Type your guess..."
                className="w-full px-4 py-3 rounded-2xl bg-slate-950 border border-slate-800 text-slate-100 text-sm placeholder-slate-600 focus:outline-none focus:border-rose-500 mb-3"
              />
              <button
                onClick={handleSecretSubmit}
                disabled={!secretGuess.trim()}
                className="px-6 py-3 rounded-full bg-gradient-to-r from-rose-600 to-amber-500 text-white font-bold text-sm shadow-xl hover:scale-105 transition-transform disabled:opacity-40 disabled:cursor-not-allowed inline-flex items-center gap-2"
              >
                <Gift className="w-4 h-4" /> Submit Guess
              </button>
            </div>
          ) : (
            <div className="p-5 rounded-2xl bg-gradient-to-r from-rose-500/20 to-amber-500/20 border border-rose-500/40 text-rose-100">
              <Trophy className="w-10 h-10 text-amber-300 mx-auto mb-2 animate-bounce" />
              <h4 className="font-serif text-xl font-bold mb-1">You unlocked the secret! 💌</h4>
              <p className="text-sm text-rose-200">
                The hidden message: <strong className="text-white">"{SECRET_MESSAGE}"</strong>
              </p>
              <p className="text-xs text-amber-200 mt-2">🎁 A secret romantic letter has been added to your vault!</p>
            </div>
          )}
        </div>
      )}

      {/* GAME 8: COLOR MATCH EMOTIONS */}
      {activeTab === 'color' && (
        <div className="p-6 sm:p-8 rounded-3xl glass-card border border-rose-500/20 max-w-2xl mx-auto">
          <div className="flex items-center justify-between mb-6">
            <p className="text-slate-300 text-sm">
              🎨 <strong className="text-rose-300">Tap a color</strong>, then match it to the memory it represents.
            </p>
            <button
              onClick={resetColorGame}
              className="px-3 py-1.5 rounded-xl bg-slate-800 text-slate-300 hover:text-white text-xs font-semibold flex items-center gap-1"
            >
              <RotateCcw className="w-3.5 h-3.5" /> Reset
            </button>
          </div>

          {!colorWon ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              {/* Colors */}
              <div>
                <p className="text-xs font-semibold text-slate-400 uppercase tracking-widest mb-3">Colors</p>
                <div className="space-y-2">
                  {COLOR_PAIRS.map((p) => {
                    const isMatched = !!colorMatches[p.label];
                    const isSelected = colorSelected === p.label;
                    return (
                      <button
                        key={p.label}
                        onClick={() => !isMatched && handleColorClick(p.label)}
                        disabled={isMatched}
                        className={`w-full p-3 rounded-2xl border flex items-center gap-3 transition-all ${
                          isMatched
                            ? 'bg-emerald-500/10 border-emerald-500/30 opacity-50 cursor-default'
                            : isSelected
                            ? 'bg-rose-500/20 border-rose-500 shadow-lg'
                            : 'bg-slate-900 border-slate-800 hover:border-rose-500/50 cursor-pointer'
                        }`}
                      >
                        <div
                          className="w-8 h-8 rounded-full flex-shrink-0 border-2 border-white/20"
                          style={{ backgroundColor: p.color, boxShadow: `0 0 15px ${p.color}` }}
                        />
                        <span className="text-sm text-slate-200 font-medium">{p.label}</span>
                        {isMatched && <CheckCircle2 className="w-4 h-4 text-emerald-400 ml-auto" />}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Memories */}
              <div>
                <p className="text-xs font-semibold text-slate-400 uppercase tracking-widest mb-3">Memories</p>
                <div className="space-y-2">
                  {shuffledMemories.map((p) => {
                    const isMatched = Object.values(colorMatches).includes(p.memory);
                    return (
                      <button
                        key={p.memory}
                        onClick={() => !isMatched && handleMemoryClick(p.memory)}
                        disabled={isMatched}
                        className={`w-full p-3 rounded-2xl border text-left text-sm transition-all ${
                          isMatched
                            ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-200 opacity-70 cursor-default'
                            : colorSelected
                            ? 'bg-slate-900 border-rose-500/50 text-white hover:bg-rose-500/10 cursor-pointer'
                            : 'bg-slate-900 border-slate-800 text-slate-400 cursor-not-allowed'
                        }`}
                      >
                        {p.memory}
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>
          ) : (
            <div className="text-center py-8">
              <Trophy className="w-16 h-16 text-amber-300 mx-auto mb-4 animate-bounce" />
              <h3 className="font-serif text-2xl font-bold text-white mb-2">All Colors Matched! 🎨</h3>
              <p className="text-sm text-slate-300 mb-6">
                Every color tells a piece of our story 💕
              </p>
              <button
                onClick={resetColorGame}
                className="px-6 py-3 rounded-full bg-rose-500 text-white font-bold text-sm hover:bg-rose-600 transition-colors"
              >
                Play Again
              </button>
            </div>
          )}
        </div>
      )}
    </section>
  );
};