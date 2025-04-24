
import React from 'react';
import { useGameLogic } from './game/useGameLogic';
import BackButton from './game/BackButton';
import StartScreen from './game/StartScreen';
import Background from './game/Background';
import GameObjects from './game/GameObjects';

interface CoinGameProps {
  onGameEnd: (score: number) => void;
}

const CoinGame: React.FC<CoinGameProps> = ({ onGameEnd }) => {
  const { gameState, gameAreaRef, startGame, endGame } = useGameLogic(onGameEnd);

  const handleBackClick = () => {
    if (gameState.isPlaying) {
      endGame();
    } else {
      onGameEnd(gameState.score);
    }
  };

  return (
    <div 
      ref={gameAreaRef} 
      className="relative w-full h-full bg-gradient-to-b from-indigo-950 to-purple-950 overflow-hidden touch-none"
      style={{ 
        height: '100vh',
        width: '100vw',
        position: 'fixed',
        top: 0,
        left: 0,
        zIndex: 50
      }}
    >
      <BackButton onBack={handleBackClick} isPlaying={gameState.isPlaying} />

      {!gameState.isPlaying ? (
        <StartScreen onStart={startGame} />
      ) : (
        <>
          <Background />
          <GameObjects 
            coins={gameState.coins}
            obstacles={gameState.obstacles}
            playerPosition={gameState.playerPosition}
          />

          {/* Game UI */}
          <div className="absolute top-4 right-4 left-16 flex justify-between items-center gap-2">
            <div className="bg-black/50 backdrop-blur px-4 py-2 rounded-full border border-indigo-500/30 flex-1">
              <span className="text-white text-sm">Skor: {gameState.score}</span>
            </div>
            <div className="bg-black/50 backdrop-blur px-4 py-2 rounded-full border border-indigo-500/30 flex-1 text-center">
              <span className="text-white text-sm">Süre: {gameState.timeLeft}s</span>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default CoinGame;
