
import { useState, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Trophy, ArrowLeft, Zap, Gift } from "lucide-react";
import { toast } from "@/hooks/use-toast";
import { useLanguage } from "@/contexts/LanguageContext";
import { useTheme } from "@/contexts/ThemeContext";
import Header from "@/components/Header";
import MobileNavigation from "@/components/MobileNavigation";
import { useNavigate } from "react-router-dom";
import { useCoinContext } from "@/contexts/CoinContext";

const MiniGame = () => {
  const { t } = useLanguage();
  const { theme } = useTheme();
  const navigate = useNavigate();
  const { addCoins } = useCoinContext();
  
  const [gameActive, setGameActive] = useState(false);
  const [score, setScore] = useState(0);
  const [timeLeft, setTimeLeft] = useState(30);
  const [targetPosition, setTargetPosition] = useState({ x: 50, y: 50 });
  const [gameCompleted, setGameCompleted] = useState(false);
  const [canvasSize, setCanvasSize] = useState({ width: 300, height: 300 });
  const gameAreaRef = useRef<HTMLDivElement>(null);

  // Update canvas size based on screen size
  useEffect(() => {
    const updateSize = () => {
      if (gameAreaRef.current) {
        const width = Math.min(gameAreaRef.current.offsetWidth, 500);
        setCanvasSize({ width, height: width });
      }
    };

    updateSize();
    window.addEventListener('resize', updateSize);
    return () => window.removeEventListener('resize', updateSize);
  }, []);

  // Game timer
  useEffect(() => {
    let interval: number | undefined;
    
    if (gameActive && timeLeft > 0) {
      interval = window.setInterval(() => {
        setTimeLeft(prev => prev - 1);
      }, 1000);
    } else if (timeLeft === 0 && gameActive) {
      setGameActive(false);
      setGameCompleted(true);
      
      // Calculate coins earned (1 coin per 2 points)
      const coinsEarned = Math.floor(score / 2);
      
      if (coinsEarned > 0) {
        addCoins(coinsEarned);
        toast({
          title: t('game.completed'),
          description: t('game.earnedCoins', coinsEarned.toString())
        });
      } else {
        toast({
          title: t('game.completed'),
          description: t('game.tryAgain')
        });
      }
    }
    
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [gameActive, timeLeft, score, t, addCoins]);

  const startGame = () => {
    setGameActive(true);
    setScore(0);
    setTimeLeft(30);
    setGameCompleted(false);
    moveTarget();
    
    toast({
      title: t('game.started'),
      description: t('game.clickTargets')
    });
  };

  const moveTarget = () => {
    // Random position within the canvas
    const padding = 30; // Ensure target isn't too close to the edge
    const x = Math.random() * (canvasSize.width - padding * 2) + padding;
    const y = Math.random() * (canvasSize.height - padding * 2) + padding;
    setTargetPosition({ x, y });
  };

  const handleTargetClick = () => {
    if (!gameActive) return;
    
    setScore(prev => prev + 1);
    moveTarget();
  };

  const goBack = () => {
    navigate('/');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 to-indigo-950 dark:from-gray-950 dark:to-indigo-950 flex flex-col">
      <Header />

      <main className="flex-1 p-5 max-w-2xl mx-auto w-full pb-24 md:pb-5">
        <Button 
          variant="ghost" 
          className="mb-4 text-indigo-300 hover:text-indigo-100 hover:bg-indigo-900/50"
          onClick={goBack}
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          {t('back')}
        </Button>

        <Card className="mb-6 overflow-hidden border-none shadow-lg bg-gray-800 dark:bg-gray-850">
          <div className="absolute inset-0 bg-gradient-to-r from-purple-900 to-indigo-900 opacity-90"></div>
          <CardHeader className="relative z-10">
            <CardTitle className="text-2xl font-bold text-white flex items-center gap-2">
              <Trophy className="h-6 w-6 text-yellow-400" />
              {t('game.title')}
            </CardTitle>
            <CardDescription className="text-indigo-200">
              {t('game.description')}
            </CardDescription>
          </CardHeader>
          
          <CardContent className="relative z-10 pb-6">
            <div className="flex flex-col md:flex-row gap-6 justify-between mb-4">
              <div className="bg-gray-900/60 rounded-lg p-3 flex items-center justify-between md:flex-1">
                <span className="text-indigo-200">{t('game.score')}:</span>
                <span className="text-2xl font-bold text-white">{score}</span>
              </div>
              
              <div className="bg-gray-900/60 rounded-lg p-3 flex items-center justify-between md:flex-1">
                <span className="text-indigo-200">{t('game.timeLeft')}:</span>
                <span className={`text-2xl font-bold ${timeLeft < 10 ? 'text-red-400' : 'text-white'}`}>
                  {timeLeft}s
                </span>
              </div>
            </div>

            {!gameActive && !gameCompleted && (
              <div className="flex flex-col items-center justify-center py-12">
                <div className="p-4 bg-indigo-800/50 rounded-full mb-4">
                  <Zap className="h-10 w-10 text-yellow-400" />
                </div>
                <h3 className="text-xl font-bold text-white mb-4">{t('game.ready')}</h3>
                <Button
                  onClick={startGame}
                  className="bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white font-bold px-8 py-6 text-lg h-auto"
                >
                  {t('game.startButton')}
                </Button>
              </div>
            )}

            {gameCompleted && (
              <div className="flex flex-col items-center justify-center py-12">
                <div className="p-4 bg-purple-800/50 rounded-full mb-4">
                  <Trophy className="h-10 w-10 text-yellow-400" />
                </div>
                <h3 className="text-xl font-bold text-white mb-2">{t('game.completed')}</h3>
                <p className="text-indigo-200 mb-4">{t('game.finalScore', score.toString())}</p>
                <p className="text-lg font-semibold text-green-400 mb-4">{t('game.earnedCoins', Math.floor(score / 2).toString())}</p>
                <Button
                  onClick={startGame}
                  className="bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white font-bold px-8 py-6 text-lg h-auto"
                >
                  {t('game.playAgain')}
                </Button>
              </div>
            )}

            {gameActive && (
              <div 
                ref={gameAreaRef} 
                className="relative bg-gray-900/80 rounded-lg mx-auto overflow-hidden cursor-pointer"
                style={{ 
                  width: '100%', 
                  height: canvasSize.height, 
                  maxWidth: canvasSize.width, 
                  maxHeight: canvasSize.height 
                }}
              >
                <div 
                  className="absolute w-12 h-12 bg-gradient-to-r from-yellow-400 to-amber-500 rounded-full transform -translate-x-1/2 -translate-y-1/2 flex items-center justify-center shadow-lg hover:scale-95 active:scale-90 transition-transform"
                  style={{ 
                    left: targetPosition.x, 
                    top: targetPosition.y,
                  }}
                  onClick={handleTargetClick}
                >
                  <Gift className="h-6 w-6 text-white" />
                </div>
              </div>
            )}
          </CardContent>

          <CardFooter className="relative z-10 bg-gray-850/80 border-t border-gray-700 flex justify-between">
            <div className="text-sm text-gray-400">
              {t('game.hint')}
            </div>
            <div className="font-medium text-indigo-300">
              1 {t('game.point')} = 0.5 FC
            </div>
          </CardFooter>
        </Card>
      </main>

      <MobileNavigation />
    </div>
  );
};

export default MiniGame;
