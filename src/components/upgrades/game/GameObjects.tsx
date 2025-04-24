
import React from 'react';
import { Coins } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface GameObject {
  id: number;
  x: number;
  y: number;
}

interface Obstacle extends GameObject {
  type: 'asteroid' | 'satellite';
}

interface GameObjectsProps {
  coins: GameObject[];
  obstacles: Obstacle[];
  playerPosition: { x: number; y: number };
}

const GameObjects: React.FC<GameObjectsProps> = ({ coins, obstacles, playerPosition }) => (
  <>
    {/* Player Touch Indicator */}
    <motion.div
      className="absolute w-12 h-12 flex items-center justify-center pointer-events-none"
      animate={{ x: `${playerPosition.x}%`, y: `${playerPosition.y}%` }}
      transition={{ type: 'spring', stiffness: 300, damping: 20 }}
      style={{ marginLeft: '-24px', marginTop: '-24px' }}
    >
      <div className="w-full h-full rounded-full border-2 border-indigo-400 bg-indigo-400/20 animate-pulse" />
    </motion.div>

    {/* Coins */}
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
  </>
);

export default GameObjects;
