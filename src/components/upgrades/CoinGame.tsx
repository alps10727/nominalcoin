import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Coins, ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import { useIsMobile } from '@/hooks/use-mobile';

interface CoinGameProps {
  onGameEnd: (score: number) => void;
}

interface Obstacle {
  id: number;
  x: number;
  y: number;
  type: 'asteroid' | 'satellite';
}

const CoinGame: React.FC<CoinGameProps> = ({ onGameEnd }) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [score, setScore] = useState(0);
  const [timeLeft, setTimeLeft] = useState(30);
  const [playerPosition, setPlayerPosition] = useState({ x: 50, y: 75 });
  const [coins, setCoins] = useState<{id: number; x: number; y: number}[]>([]);
  const [obstacles, setObstacles] = useState<Obstacle[]>([]);
  const [gameSpeed, setGameSpeed] = useState(1);
  const gameAreaRef = useRef<HTMLDivElement>(null);
  const animationRef = useRef<number | null>(null);
  const lastUpdateTimeRef = useRef<number>(0);
  const isMobile = useIsMobile();

  const createObstacle = () => {
    const types: ('asteroid' | 'satellite')[] = ['asteroid', 'satellite'];
    const newObstacle: Obstacle = {
      id: Math.random(),
      x: Math.random() * 90 + 5,
      y: -10,
      type: types[Math.floor(Math.random() * types.length)]
    };
    setObstacles(prev => [...prev, newObstacle]);
  };

  const handleBackClick = () => {
    if (isPlaying) {
      endGame();
    } else {
      if (document.fullscreenElement) {
        document.exitFullscreen();
      }
      onGameEnd(score);
    }
  };

  const startGame = () => {
    if (gameAreaRef.current) {
      gameAreaRef.current.requestFullscreen();
    }
    setIsPlaying(true);
    setScore(0);
    setTimeLeft(30);
    setCoins([]);
    setObstacles([]);
    setPlayerPosition({ x: 50, y: 75 });
    setGameSpeed(1);
    lastUpdateTimeRef.current = performance.now();
  };

  const endGame = () => {
    setIsPlaying(false);
    if (document.fullscreenElement) {
      document.exitFullscreen();
    }
    onGameEnd(score);
  };

  useEffect(() => {
    const handleTouchMove = (e: TouchEvent) => {
      if (!gameAreaRef.current || !isPlaying) return;
      
      e.preventDefault(); // Prevent scrolling
      const touch = e.touches[0];
      const rect = gameAreaRef.current.getBoundingClientRect();
      
      const x = ((touch.clientX - rect.left) / rect.width) * 100;
      const y = ((touch.clientY - rect.top) / rect.height) * 100;
      
      const clampedX = Math.min(Math.max(x, 5), 95);
      const clampedY = Math.min(Math.max(y, 5), 95);
      
      setPlayerPosition({ x: clampedX, y: clampedY });
    };
    
    if (isPlaying) {
      gameAreaRef.current?.addEventListener('touchmove', handleTouchMove, { passive: false });
    }
    
    return () => {
      gameAreaRef.current?.removeEventListener('touchmove', handleTouchMove);
    };
  }, [isPlaying]);

  useEffect(() => {
    if (!isPlaying) return;

    const gameLoop = (timestamp: number) => {
      const deltaTime = timestamp - lastUpdateTimeRef.current;
      lastUpdateTimeRef.current = timestamp;

      setObstacles(prevObstacles => {
        return prevObstacles.map(obstacle => ({
          ...obstacle,
          y: obstacle.y + gameSpeed * (deltaTime / 16)
        })).filter(obstacle => obstacle.y < 110);
      });

      const hasCollision = obstacles.some(obstacle => {
        const dx = Math.abs(obstacle.x - playerPosition.x);
        const dy = Math.abs(obstacle.y - playerPosition.y);
        return dx < 8 && dy < 8;
      });

      if (hasCollision) {
        toast.error("Oyun Bitti! Bir engele çarptınız!");
        endGame();
        return;
      }

      setCoins(prevCoins => {
        const collidedCoinId = prevCoins.find(coin => {
          const dx = Math.abs(coin.x - playerPosition.x);
          const dy = Math.abs(coin.y - playerPosition.y);
          return dx < 8 && dy < 8;
        })?.id;
        
        if (collidedCoinId) {
          setScore(prevScore => prevScore + 10);
          toast.success("+10 Puan!", { duration: 1000 });
        }
        
        return prevCoins
          .filter(coin => coin.id !== collidedCoinId)
          .map(coin => ({
            ...coin,
            y: coin.y + gameSpeed * (deltaTime / 16)
          }))
          .filter(coin => coin.y < 110);
      });

      if (Math.random() < 0.02 * gameSpeed) {
        const rand = Math.random();
        if (rand < 0.7) {
          const newCoin = {
            id: Math.random(),
            x: Math.random() * 90 + 5,
            y: -10
          };
          setCoins(prev => [...prev, newCoin]);
        } else {
          createObstacle();
        }
      }

      if (timeLeft < 20) setGameSpeed(1.5);
      if (timeLeft < 10) setGameSpeed(2);

      animationRef.current = requestAnimationFrame(gameLoop);
    };

    const timer = setInterval(() => {
      setTimeLeft(prevTime => {
        if (prevTime <= 1) {
          clearInterval(timer);
          if (animationRef.current) {
            cancelAnimationFrame(animationRef.current);
          }
          endGame();
          return 0;
        }
        return prevTime - 1;
      });
    }, 1000);

    animationRef.current = requestAnimationFrame(gameLoop);

    return () => {
      clearInterval(timer);
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [isPlaying, playerPosition, gameSpeed, score, timeLeft, onGameEnd]);

  return (
    <div 
      ref={gameAreaRef} 
      className="relative w-full h-full bg-gradient-to-b from-indigo-950 to-purple-950 overflow-hidden touch-none"
      style={{ 
        height: isMobile ? '100vh' : '100%',
        width: isMobile ? '100vw' : '100%',
        position: isMobile ? 'fixed' : 'relative',
        top: isMobile ? 0 : 'auto',
        left: isMobile ? 0 : 'auto',
        zIndex: isMobile ? 50 : 'auto'
      }}
    >
      <Button
        onClick={handleBackClick}
        className="absolute top-4 left-4 z-50 bg-black/50 hover:bg-black/70"
        size="sm"
        variant="ghost"
      >
        <ArrowLeft className="h-5 w-5" />
      </Button>

      {!isPlaying ? (
        <div className="absolute inset-0 flex flex-col items-center justify-center p-4 text-center bg-gradient-to-b from-indigo-950/90 to-purple-950/90 backdrop-blur-sm">
          <h2 className="text-3xl font-bold text-white mb-4 animate-fade-in">Uzay Madeni</h2>
          <p className="text-gray-300 mb-6 max-w-xs animate-fade-in delay-100">
            Ekrana dokunarak coinleri topla ve puanları kazanmaya başla! Asteroidlerden ve uydulardan kaçın! 30 saniye içinde ne kadar çok coin toplayabilirsin?
          </p>
          <Button 
            onClick={startGame}
            className="animate-fade-in delay-200 bg-gradient-to-r from-indigo-600 to-purple-600 px-8 py-6 text-lg shadow-lg hover:shadow-xl transition-all duration-300"
          >
            Oyuna Başla
          </Button>
        </div>
      ) : (
        <>
          {/* Background stars */}
          {Array.from({ length: 50 }).map((_, i) => (
            <div
              key={i}
              className="absolute bg-white rounded-full opacity-70 animate-twinkle"
              style={{
                width: Math.random() * 2 + 1 + 'px',
                height: Math.random() * 2 + 1 + 'px',
                left: Math.random() * 100 + '%',
                top: Math.random() * 100 + '%',
                animationDelay: `${Math.random() * 3}s`,
              }}
            />
          ))}

          {/* Player touch indicator */}
          <motion.div
            className="absolute w-12 h-12 flex items-center justify-center pointer-events-none"
            animate={{ x: `${playerPosition.x}%`, y: `${playerPosition.y}%` }}
            transition={{ type: 'spring', stiffness: 300, damping: 20 }}
            style={{ marginLeft: '-24px', marginTop: '-24px' }}
          >
            <div className="w-full h-full rounded-full border-2 border-indigo-400 bg-indigo-400/20 animate-pulse" />
          </motion.div>

          {/* Coins with collection animation */}
          <AnimatePresence>
            {coins.map(coin => (
              <motion.div
                key={coin.id}
                className="absolute w-10 h-10 flex items-center justify-center"
                style={{ left: `${coin.x}%`, top: `${coin.y}%`, marginLeft: '-20px', marginTop: '-20px' }}
                initial={{ scale: 0 }}
                animate={{ scale: 1, rotate: 360 }}
                exit={{ scale: 0, opacity: 0 }}
                transition={{ duration: 0.3 }}
              >
                <Coins className="w-full h-full text-yellow-400 animate-bounce" />
              </motion.div>
            ))}
          </AnimatePresence>

          {/* Obstacles */}
          <AnimatePresence>
            {obstacles.map(obstacle => (
              <motion.div
                key={obstacle.id}
                className="absolute w-10 h-10 flex items-center justify-center"
                style={{ left: `${obstacle.x}%`, top: `${obstacle.y}%`, marginLeft: '-20px', marginTop: '-20px' }}
                initial={{ scale: 0, rotate: 0 }}
                animate={{ scale: 1, rotate: 360 }}
                exit={{ scale: 0, opacity: 0 }}
                transition={{ duration: 0.3 }}
              >
                <div className={`w-full h-full ${
                  obstacle.type === 'asteroid' 
                    ? 'bg-gradient-to-br from-gray-600 to-gray-800 rounded-full shadow-lg'
                    : 'bg-gradient-to-br from-blue-400 to-blue-600 rounded shadow-lg'
                }`} />
              </motion.div>
            ))}
          </AnimatePresence>

          {/* Game UI */}
          <div className="absolute top-4 right-4 left-16 flex justify-between items-center gap-2">
            <div className="bg-black/50 backdrop-blur px-4 py-2 rounded-full border border-indigo-500/30 flex-1">
              <span className="text-white text-sm">Skor: {score}</span>
            </div>
            <div className="bg-black/50 backdrop-blur px-4 py-2 rounded-full border border-indigo-500/30 flex-1 text-center">
              <span className="text-white text-sm">Süre: {timeLeft}s</span>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default CoinGame;
