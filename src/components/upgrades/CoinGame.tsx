
import React, { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { Coins, Rocket } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';

interface CoinGameProps {
  onGameEnd: (score: number) => void;
}

const CoinGame: React.FC<CoinGameProps> = ({ onGameEnd }) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [score, setScore] = useState(0);
  const [timeLeft, setTimeLeft] = useState(30); // 30 saniye oyun süresi
  const [playerPosition, setPlayerPosition] = useState({ x: 50, y: 75 });
  const [coins, setCoins] = useState<{id: number; x: number; y: number}[]>([]);
  const [gameSpeed, setGameSpeed] = useState(1);
  const gameAreaRef = useRef<HTMLDivElement>(null);
  const animationRef = useRef<number | null>(null);
  const lastUpdateTimeRef = useRef<number>(0);
  
  // Yeni coin oluştur
  const createCoin = () => {
    const newCoin = {
      id: Math.random(),
      x: Math.random() * 90 + 5, // 5% ile 95% arasında
      y: -10, // Ekranın üstünden başlasın
    };
    
    setCoins(prev => [...prev, newCoin]);
  };
  
  // Oyunu başlat
  const startGame = () => {
    setIsPlaying(true);
    setScore(0);
    setTimeLeft(30);
    setCoins([]);
    setPlayerPosition({ x: 50, y: 75 });
    setGameSpeed(1);
    lastUpdateTimeRef.current = performance.now();
  };
  
  // Oyunu bitir
  const endGame = () => {
    setIsPlaying(false);
    // Skoru ana bileşene bildir
    onGameEnd(score);
  };
  
  // Fare hareketlerini yakala
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (!gameAreaRef.current || !isPlaying) return;
      
      const rect = gameAreaRef.current.getBoundingClientRect();
      const x = ((e.clientX - rect.left) / rect.width) * 100;
      const y = ((e.clientY - rect.top) / rect.height) * 100;
      
      // Sınırları kontrol et
      const clampedX = Math.min(Math.max(x, 5), 95);
      const clampedY = Math.min(Math.max(y, 5), 95);
      
      setPlayerPosition({ x: clampedX, y: clampedY });
    };
    
    if (isPlaying) {
      window.addEventListener('mousemove', handleMouseMove);
    }
    
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
    };
  }, [isPlaying]);
  
  // Oyun döngüsü
  useEffect(() => {
    if (!isPlaying) return;
    
    const gameLoop = (timestamp: number) => {
      // Zaman farkını hesapla
      const deltaTime = timestamp - lastUpdateTimeRef.current;
      lastUpdateTimeRef.current = timestamp;
      
      // Coinlerin hareketini güncelle
      setCoins(prevCoins => {
        return prevCoins.map(coin => ({
          ...coin,
          y: coin.y + gameSpeed * (deltaTime / 16), // 60fps'de 16ms
        }));
      });
      
      // Çarpışmaları kontrol et
      setCoins(prevCoins => {
        const collidedCoinId = prevCoins.find(coin => {
          const dx = Math.abs(coin.x - playerPosition.x);
          const dy = Math.abs(coin.y - playerPosition.y);
          return dx < 8 && dy < 8; // Çarpışma algılama mesafesi
        })?.id;
        
        // Çarpışma varsa
        if (collidedCoinId) {
          // Skoru arttır
          setScore(prevScore => prevScore + 10);
          // Sesi çal veya animasyon göster
          return prevCoins.filter(coin => coin.id !== collidedCoinId);
        }
        
        // Ekrandan çıkan coinleri temizle
        return prevCoins.filter(coin => coin.y < 110);
      });
      
      // Yeni coin ekleme olasılığı
      if (Math.random() < 0.02 * gameSpeed) {
        createCoin();
      }
      
      // Oyun hızını zamanla arttır
      if (timeLeft < 20) {
        setGameSpeed(1.5);
      }
      if (timeLeft < 10) {
        setGameSpeed(2);
      }
      
      animationRef.current = requestAnimationFrame(gameLoop);
    };
    
    // Zamanı güncelle
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
      className="relative w-full h-full bg-gradient-to-b from-indigo-950 to-purple-950 overflow-hidden"
    >
      {!isPlaying ? (
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <Rocket className="w-16 h-16 text-indigo-400 mb-4" />
          <h2 className="text-2xl font-bold text-white mb-4">Uzay Madeni</h2>
          <p className="text-gray-300 mb-6 text-center max-w-xs">
            Uzayda uçarak coinleri topla ve puanları kazanmaya başla! 30 saniye içinde ne kadar çok coin toplayabilirsin?
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
          {/* Arkaplan yıldızları */}
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
          
          {/* Oyuncu */}
          <motion.div
            className="absolute w-10 h-10 flex items-center justify-center"
            animate={{ x: `${playerPosition.x}%`, y: `${playerPosition.y}%` }}
            transition={{ type: 'spring', stiffness: 300, damping: 20 }}
            style={{ marginLeft: '-20px', marginTop: '-20px' }}
          >
            <Rocket className="w-full h-full text-indigo-400 transform rotate-180" />
          </motion.div>
          
          {/* Coinler */}
          {coins.map(coin => (
            <motion.div
              key={coin.id}
              className="absolute w-8 h-8 flex items-center justify-center"
              style={{ left: `${coin.x}%`, top: `${coin.y}%`, marginLeft: '-16px', marginTop: '-16px' }}
            >
              <Coins className="w-full h-full text-yellow-400" />
            </motion.div>
          ))}
          
          {/* UI Elemanları */}
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
