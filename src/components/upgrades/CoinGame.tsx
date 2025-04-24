
import React, { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { Coins } from 'lucide-react';
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

      // Update obstacles
      setObstacles(prevObstacles => {
        return prevObstacles.map(obstacle => ({
          ...obstacle,
          y: obstacle.y + gameSpeed * (deltaTime / 16)
        })).filter(obstacle => obstacle.y < 110);
      });

      // Check collisions with obstacles
      const hasCollision = obstacles.some(obstacle => {
        const dx = Math.abs(obstacle.x - playerPosition.x);
        const dy = Math.abs(obstacle.y - playerPosition.y);
        return dx < 8 && dy < 8;
      });

      if (hasCollision) {
        toast.error("Çarpışma! -10 puan");
        setScore(prevScore => Math.max(0, prevScore - 10));
      }

      // Update coins
      setCoins(prevCoins => {
        const collidedCoinId = prevCoins.find(coin => {
          const dx = Math.abs(coin.x - playerPosition.x);
          const dy = Math.abs(coin.y - playerPosition.y);
          return dx < 8 && dy < 8;
        })?.id;
        
        if (collidedCoinId) {
          setScore(prevScore => prevScore + 10);
        }
        
        return prevCoins
          .filter(coin => coin.id !== collidedCoinId)
          .map(coin => ({
            ...coin,
            y: coin.y + gameSpeed * (deltaTime / 16)
          }))
          .filter(coin => coin.y < 110);
      });

      // Spawn new elements
      if (Math.random() < 0.02 * gameSpeed) {
        const rand = Math.random();
        if (rand < 0.7) {
          // 70% chance for coin
          const newCoin = {
            id: Math.random(),
            x: Math.random() * 90 + 5,
            y: -10
          };
          setCoins(prev => [...prev, newCoin]);
        } else {
          // 30% chance for obstacle
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
      {!isPlaying ? (
        <div className="absolute inset-0 flex flex-col items-center justify-center p-4 text-center">
          <h2 className="text-2xl font-bold text-white mb-4">Uzay Madeni</h2>
          <p className="text-gray-300 mb-6 max-w-xs">
            Ekrana dokunarak coinleri topla ve puanları kazanmaya başla! Asteroidlerden ve uydulardan kaçın! 30 saniye içinde ne kadar çok coin toplayabilirsin?
          </p>
          <Button 
            onClick={startGame}
            className="bg-gradient-to-r from-indigo-600 to-purple-600 px-8 py-6 text-lg"
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
              className="absolute bg-white rounded-full opacity-70"
              style={{
                width: Math.random() * 2 + 1 + 'px',
                height: Math.random() * 2 + 1 + 'px',
                left: Math.random() * 100 + '%',
                top: Math.random() * 100 + '%',
                animationDuration: Math.random() * 3 + 2 + 's',
              }}
            />
          ))}

          {/* Player touch indicator */}
          <motion.div
            className="absolute w-8 h-8 flex items-center justify-center"
            animate={{ x: `${playerPosition.x}%`, y: `${playerPosition.y}%` }}
            transition={{ type: 'spring', stiffness: 300, damping: 20 }}
            style={{ marginLeft: '-16px', marginTop: '-16px' }}
          >
            <div className="w-full h-full rounded-full border-2 border-indigo-400 bg-indigo-400/20" />
          </motion.div>

          {/* Coins */}
          {coins.map(coin => (
            <motion.div
              key={coin.id}
              className="absolute w-8 h-8 flex items-center justify-center"
              style={{ left: `${coin.x}%`, top: `${coin.y}%`, marginLeft: '-16px', marginTop: '-16px' }}
            >
              <Coins className="w-full h-full text-yellow-400" />
            </motion.div>
          ))}

          {/* Obstacles */}
          {obstacles.map(obstacle => (
            <motion.div
              key={obstacle.id}
              className="absolute w-8 h-8 flex items-center justify-center"
              style={{ left: `${obstacle.x}%`, top: `${obstacle.y}%`, marginLeft: '-16px', marginTop: '-16px' }}
            >
              <div className={`w-full h-full ${
                obstacle.type === 'asteroid' 
                  ? 'bg-gray-600 rounded-full' 
                  : 'bg-blue-400 rounded'
              }`} />
            </motion.div>
          ))}

          {/* Game UI */}
          <div className="absolute top-4 left-4 right-4 flex justify-between items-center">
            <div className="bg-gray-900/80 backdrop-blur px-4 py-1 rounded-full border border-indigo-500/30">
              <span className="text-white">Skor: {score}</span>
            </div>
            <div className="bg-gray-900/80 backdrop-blur px-4 py-1 rounded-full border border-indigo-500/30">
              <span className="text-white">Süre: {timeLeft}s</span>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default CoinGame;

