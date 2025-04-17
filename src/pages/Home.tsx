
import React from 'react';
import { Zap, Award, UserPlus, BarChart2 } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import MiningRateDisplay from '@/components/mining/MiningRateDisplay';
import MiningCard from '@/components/dashboard/MiningCard';
import { useAuth } from '@/contexts/AuthContext';
import { useMiningData } from '@/hooks/useMiningData';

const Home = () => {
  const { userData } = useAuth();
  const { 
    miningActive, 
    progress, 
    miningRate, 
    miningSession, 
    miningTime, 
    handleStartMining, 
    handleStopMining 
  } = useMiningData();

  return (
    <div className="min-h-screen flex flex-col relative pb-20 fc-space-bg">
      {/* Header */}
      <header className="px-4 py-6 text-center">
        <h1 className="text-3xl font-bold fc-gradient-text mb-2">
          NOMINAL Coin Mining Hub
        </h1>
        <p className="text-purple-300/80">
          Welcome, {userData?.displayName || 'Miner'}! Start earning crypto today.
        </p>
      </header>

      {/* Main Content */}
      <main className="flex-1 px-4 max-w-3xl mx-auto w-full relative z-10">
        <div className="space-y-6">
          {/* Mining Card */}
          <MiningCard 
            miningActive={miningActive}
            progress={progress}
            miningRate={miningRate}
            miningSession={miningSession}
            miningTime={miningTime}
            onStartMining={handleStartMining}
            onStopMining={handleStopMining}
          />

          {/* Quick Actions */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <Link to="/referral" className="block">
              <Button variant="cosmic" className="w-full">
                <UserPlus className="mr-2 h-5 w-5" />
                Referrals
              </Button>
            </Link>
            <Link to="/mining/upgrades" className="block">
              <Button variant="purple" className="w-full">
                <Zap className="mr-2 h-5 w-5" />
                Upgrades
              </Button>
            </Link>
            <Link to="/tasks" className="block">
              <Button variant="navy" className="w-full">
                <Award className="mr-2 h-5 w-5" />
                Tasks
              </Button>
            </Link>
            <Link to="/statistics" className="block">
              <Button variant="secondary" className="w-full">
                <BarChart2 className="mr-2 h-5 w-5" />
                Stats
              </Button>
            </Link>
          </div>

          {/* Mining Rate Details */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <MiningRateDisplay />
          </div>
        </div>
      </main>
    </div>
  );
};

export default Home;
