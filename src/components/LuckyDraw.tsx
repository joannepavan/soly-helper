import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import confetti from 'canvas-confetti';
import { Trophy, RefreshCw, Settings2, UserCheck, AlertCircle } from 'lucide-react';
import { cn } from '@/src/lib/utils';

interface LuckyDrawProps {
  names: string[];
}

export default function LuckyDraw({ names }: LuckyDrawProps) {
  const [isDrawing, setIsDrawing] = useState(false);
  const [winner, setWinner] = useState<string | null>(null);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [allowRepeat, setAllowRepeat] = useState(false);
  const [availableNames, setAvailableNames] = useState<string[]>([]);
  const [history, setHistory] = useState<string[]>([]);
  
  const drawIntervalRef = useRef<number | null>(null);

  useEffect(() => {
    setAvailableNames(names);
  }, [names]);

  const startDraw = () => {
    if (availableNames.length === 0) return;
    
    setIsDrawing(true);
    setWinner(null);

    // Animation phase
    let counter = 0;
    const duration = 2000; // 2 seconds
    const interval = 80;
    const totalSteps = duration / interval;

    drawIntervalRef.current = window.setInterval(() => {
      setCurrentIndex(Math.floor(Math.random() * names.length));
      counter++;

      if (counter >= totalSteps) {
        stopDraw();
      }
    }, interval);
  };

  const stopDraw = () => {
    if (drawIntervalRef.current) {
      clearInterval(drawIntervalRef.current);
    }

    const randomIndex = Math.floor(Math.random() * availableNames.length);
    const selectedWinner = availableNames[randomIndex];

    setWinner(selectedWinner);
    setIsDrawing(false);
    setHistory([selectedWinner, ...history]);

    if (!allowRepeat) {
      setAvailableNames(prev => prev.filter(n => n !== selectedWinner));
    }

    // Celebration
    confetti({
      particleCount: 150,
      spread: 70,
      origin: { y: 0.6 },
      colors: ['#3b82f6', '#10b981', '#f59e0b', '#ef4444']
    });
  };

  const resetDraw = () => {
    setAvailableNames(names);
    setHistory([]);
    setWinner(null);
  };

  if (names.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-64 text-slate-400 gap-4">
        <AlertCircle className="w-12 h-12" />
        <p className="text-lg">請先在「名單管理」中加入姓名</p>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto space-y-8 animate-in fade-in zoom-in-95 duration-500">
      {/* Settings & Stats */}
      <div className="flex flex-wrap items-center justify-between gap-4 bg-white p-4 rounded-2xl border border-slate-200 shadow-sm">
        <div className="flex items-center gap-6">
          <div className="flex items-center gap-2">
            <Settings2 className="w-5 h-5 text-slate-400" />
            <span className="text-sm font-medium text-slate-600">設定：</span>
            <label className="flex items-center gap-2 cursor-pointer group">
              <div 
                className={cn(
                  "w-10 h-5 rounded-full transition-colors relative",
                  allowRepeat ? "bg-blue-600" : "bg-slate-200"
                )}
                onClick={() => setAllowRepeat(!allowRepeat)}
              >
                <div className={cn(
                  "absolute top-1 w-3 h-3 bg-white rounded-full transition-all",
                  allowRepeat ? "left-6" : "left-1"
                )} />
              </div>
              <span className="text-sm text-slate-700">可重複中獎</span>
            </label>
          </div>
          <div className="h-4 w-px bg-slate-200 hidden sm:block" />
          <div className="text-sm text-slate-600">
            剩餘人數：<span className="font-bold text-blue-600">{availableNames.length}</span>
          </div>
        </div>
        
        <button 
          onClick={resetDraw}
          className="flex items-center gap-2 text-sm text-slate-500 hover:text-blue-600 transition-colors"
        >
          <RefreshCw className="w-4 h-4" />
          重置抽籤
        </button>
      </div>

      {/* Main Draw Area */}
      <div className="relative aspect-video max-h-[400px] bg-slate-900 rounded-[2rem] overflow-hidden shadow-2xl flex items-center justify-center border-8 border-slate-800">
        {/* Background Pattern */}
        <div className="absolute inset-0 opacity-10 pointer-events-none">
          <div className="absolute inset-0" style={{ backgroundImage: 'radial-gradient(circle at 2px 2px, white 1px, transparent 0)', backgroundSize: '40px 40px' }} />
        </div>

        <AnimatePresence mode="wait">
          {isDrawing ? (
            <motion.div
              key="drawing"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 1.2 }}
              className="text-6xl md:text-8xl font-black text-white tracking-tighter"
            >
              {names[currentIndex]}
            </motion.div>
          ) : winner ? (
            <motion.div
              key="winner"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex flex-col items-center gap-4"
            >
              <Trophy className="w-20 h-20 text-yellow-400 animate-bounce" />
              <div className="text-center">
                <p className="text-blue-400 font-bold uppercase tracking-widest text-sm mb-2">恭喜中獎</p>
                <h2 className="text-6xl md:text-8xl font-black text-white tracking-tighter">{winner}</h2>
              </div>
            </motion.div>
          ) : (
            <motion.div
              key="idle"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-slate-500 text-xl font-medium"
            >
              準備好開始抽籤了嗎？
            </motion.div>
          )}
        </AnimatePresence>

        {/* Action Button Overlay */}
        {!isDrawing && (
          <div className="absolute bottom-8">
            <button
              onClick={startDraw}
              disabled={availableNames.length === 0}
              className={cn(
                "px-12 py-4 rounded-full font-bold text-lg shadow-xl transition-all transform hover:scale-105 active:scale-95",
                availableNames.length > 0 
                  ? "bg-gradient-to-r from-blue-600 to-indigo-600 text-white hover:shadow-blue-500/25" 
                  : "bg-slate-700 text-slate-500 cursor-not-allowed"
              )}
            >
              {availableNames.length === 0 ? "名單已抽完" : winner ? "再抽一次" : "開始抽籤"}
            </button>
          </div>
        )}
      </div>

      {/* History */}
      {history.length > 0 && (
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
          <h3 className="text-lg font-semibold flex items-center gap-2 mb-4">
            <UserCheck className="w-5 h-5 text-blue-500" />
            中獎紀錄
          </h3>
          <div className="flex flex-wrap gap-2">
            {history.map((name, i) => (
              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                key={`${name}-${i}`}
                className="px-4 py-2 bg-slate-50 border border-slate-100 rounded-xl text-slate-700 font-medium flex items-center gap-2"
              >
                <span className="text-xs text-slate-400">#{history.length - i}</span>
                {name}
              </motion.div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
