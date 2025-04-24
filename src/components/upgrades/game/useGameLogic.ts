
import { useState, useRef, useEffect } from 'react';
import { toast } from 'sonner';

interface GameObject {
  id: number;
  x: number;
  y: number;
}

interface Obstacle extends GameObject {
  type: 'asteroid' | 'satellite';
}

interface GameState {
  isPlaying: boolean;
  score: number;
  timeLeft: number;
  playerPosition: { x: number; y: number };
  coins: GameObject[];
  obstacles: Obstacle[];
  gameSpeed: number;
}

export const useGameLogic = (onGameEnd: (score: number) => void) => {
  const [gameState, setGameState] = useState<GameState>({
    isPlaying: false,
    score: 0,
    timeLeft: 30,
    playerPosition: { x: 50, y: 75 },
    coins: [],
    obstacles: [],
    gameSpeed: 1
  });

  const gameAreaRef = useRef<HTMLDivElement>(null);
  const animationRef = useRef<number | null>(null);
  const lastUpdateTimeRef = useRef<number>(0);

  const startGame = () => {
    setGameState({
      isPlaying: true,
      score: 0,
      timeLeft: 30,
      playerPosition: { x: 50, y: 75 },
      coins: [],
      obstacles: [],
      gameSpeed: 1
    });
    lastUpdateTimeRef.current = performance.now();
  };

  const endGame = () => {
    setGameState(prev => ({ ...prev, isPlaying: false }));
    onGameEnd(gameState.score);
  };

  useEffect(() => {
    const handleTouchMove = (e: TouchEvent) => {
      if (!gameAreaRef.current || !gameState.isPlaying) return;
      
      e.preventDefault();
      const touch = e.touches[0];
      const rect = gameAreaRef.current.getBoundingClientRect();
      
      const x = ((touch.clientX - rect.left) / rect.width) * 100;
      const y = ((touch.clientY - rect.top) / rect.height) * 100;
      
      const clampedX = Math.min(Math.max(x, 5), 95);
      const clampedY = Math.min(Math.max(y, 5), 95);
      
      setGameState(prev => ({
        ...prev,
        playerPosition: { x: clampedX, y: clampedY }
      }));
    };
    
    if (gameState.isPlaying) {
      gameAreaRef.current?.addEventListener('touchmove', handleTouchMove, { passive: false });
    }
    
    return () => {
      gameAreaRef.current?.removeEventListener('touchmove', handleTouchMove);
    };
  }, [gameState.isPlaying]);

  useEffect(() => {
    if (!gameState.isPlaying) return;

    const gameLoop = (timestamp: number) => {
      const deltaTime = timestamp - lastUpdateTimeRef.current;
      lastUpdateTimeRef.current = timestamp;

      setGameState(prev => {
        const updatedObstacles = prev.obstacles
          .map(obstacle => ({
            ...obstacle,
            y: obstacle.y + prev.gameSpeed * (deltaTime / 16)
          }))
          .filter(obstacle => obstacle.y < 110);

        const hasCollision = updatedObstacles.some(obstacle => {
          const dx = Math.abs(obstacle.x - prev.playerPosition.x);
          const dy = Math.abs(obstacle.y - prev.playerPosition.y);
          return dx < 8 && dy < 8;
        });

        if (hasCollision) {
          toast.error("Oyun Bitti! Bir engele çarptınız!");
          endGame();
          return prev;
        }

        const updatedCoins = prev.coins
          .filter(coin => {
            const dx = Math.abs(coin.x - prev.playerPosition.x);
            const dy = Math.abs(coin.y - prev.playerPosition.y);
            if (dx < 8 && dy < 8) {
              toast.success("+10 Puan!", { duration: 1000 });
              return false;
            }
            return true;
          })
          .map(coin => ({
            ...coin,
            y: coin.y + prev.gameSpeed * (deltaTime / 16)
          }))
          .filter(coin => coin.y < 110);

        const newScore = prev.score + (prev.coins.length - updatedCoins.length) * 10;

        // Spawn new objects
        let newCoins = [...updatedCoins];
        let newObstacles = [...updatedObstacles];

        if (Math.random() < 0.02 * prev.gameSpeed) {
          if (Math.random() < 0.7) {
            newCoins.push({
              id: Math.random(),
              x: Math.random() * 90 + 5,
              y: -10
            });
          } else {
            newObstacles.push({
              id: Math.random(),
              x: Math.random() * 90 + 5,
              y: -10,
              type: Math.random() > 0.5 ? 'asteroid' : 'satellite'
            });
          }
        }

        return {
          ...prev,
          score: newScore,
          coins: newCoins,
          obstacles: newObstacles,
          gameSpeed: prev.timeLeft < 10 ? 2 : prev.timeLeft < 20 ? 1.5 : 1
        };
      });

      animationRef.current = requestAnimationFrame(gameLoop);
    };

    const timer = setInterval(() => {
      setGameState(prev => ({
        ...prev,
        timeLeft: prev.timeLeft <= 1 ? 0 : prev.timeLeft - 1
      }));

      if (gameState.timeLeft <= 1) {
        clearInterval(timer);
        if (animationRef.current) {
          cancelAnimationFrame(animationRef.current);
        }
        endGame();
      }
    }, 1000);

    animationRef.current = requestAnimationFrame(gameLoop);

    return () => {
      clearInterval(timer);
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [gameState.isPlaying, onGameEnd]);

  return {
    gameState,
    gameAreaRef,
    startGame,
    endGame
  };
};
