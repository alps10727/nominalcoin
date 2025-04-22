
import { useState } from "react";
import MobileNavigation from "@/components/MobileNavigation";
import StatisticsHeader from "@/components/statistics/StatisticsHeader";
import StatisticsGrid from "@/components/statistics/StatisticsGrid";
import MiningPerformanceChart from "@/components/statistics/MiningPerformanceChart";
import FCSourcesPieChart from "@/components/statistics/FCSourcesPieChart";

const Statistics = () => {
  // Sample data
  const [totalMined] = useState(120.5);
  const [miningTime] = useState(240); // minutes
  const [upgradeCount] = useState(3);
  const [referralCount] = useState(2);
  
  const hourlyData = [
    { name: '12 AM', amount: 0.2 },
    { name: '4 AM', amount: 0.4 },
    { name: '8 AM', amount: 0.8 },
    { name: '12 PM', amount: 1.2 },
    { name: '4 PM', amount: 2.0 },
    { name: '8 PM', amount: 1.5 },
  ];

  const weeklyData = [
    { name: 'Mon', amount: 10.2 },
    { name: 'Tue', amount: 12.4 },
    { name: 'Wed', amount: 8.8 },
    { name: 'Thu', amount: 15.2 },
    { name: 'Fri', amount: 20.0 },
    { name: 'Sat', amount: 22.5 },
    { name: 'Sun', amount: 18.3 },
  ];

  const sourceData = [
    { name: 'Mining', value: 75 },
    { name: 'Referrals', value: 15 },
    { name: 'Tasks', value: 10 },
  ];

  return (
    <div className={`min-h-screen bg-gradient-to-br from-gray-900 to-indigo-950 dark:from-gray-950 dark:to-indigo-950 flex flex-col`}>
      <main className="flex-1 p-5 max-w-3xl mx-auto w-full pb-24 md:pb-5">
        <StatisticsHeader />
        <StatisticsGrid 
          totalMined={totalMined}
          miningTime={miningTime}
          upgradeCount={upgradeCount}
          referralCount={referralCount}
        />
        <MiningPerformanceChart 
          hourlyData={hourlyData}
          weeklyData={weeklyData}
        />
        <FCSourcesPieChart sourceData={sourceData} />
      </main>
      <MobileNavigation />
    </div>
  );
};

export default Statistics;
