
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { BarChart as BarChartIcon, Clock, Award, UserPlus, Coins, TrendingUp, BarChart, PieChart } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";
import { useTheme } from "@/contexts/ThemeContext";
import Header from "@/components/Header";
import MobileNavigation from "@/components/MobileNavigation";
import { BarChart as RechartsBarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart as RechartsPieChart, Pie, Cell } from 'recharts';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const Statistics = () => {
  const { t } = useLanguage();
  const { theme } = useTheme();
  
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

  const COLORS = ['#8884d8', '#82ca9d', '#ffc658'];

  // Format minutes to hours and minutes
  const formatTime = (minutes: number) => {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return `${hours}h ${mins}m`;
  };

  return (
    <div className={`min-h-screen bg-gradient-to-br from-gray-900 to-indigo-950 dark:from-gray-950 dark:to-indigo-950 flex flex-col`}>
      <Header />

      <main className="flex-1 p-5 max-w-3xl mx-auto w-full pb-24 md:pb-5">
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-white">{t('stats.title')}</h1>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
          <Card className="border-none shadow-md bg-gray-800 text-gray-100 dark:bg-gray-850">
            <CardContent className="p-4 flex flex-col items-center">
              <div className="p-2 rounded-full bg-indigo-900/50 mb-2">
                <Coins className="h-5 w-5 text-indigo-400" />
              </div>
              <p className="text-xs text-gray-400">{t('stats.totalMined')}</p>
              <p className="text-lg font-bold text-white">{totalMined.toFixed(1)} FC</p>
            </CardContent>
          </Card>

          <Card className="border-none shadow-md bg-gray-800 text-gray-100 dark:bg-gray-850">
            <CardContent className="p-4 flex flex-col items-center">
              <div className="p-2 rounded-full bg-blue-900/50 mb-2">
                <Clock className="h-5 w-5 text-blue-400" />
              </div>
              <p className="text-xs text-gray-400">{t('stats.miningTime')}</p>
              <p className="text-lg font-bold text-white">{formatTime(miningTime)}</p>
            </CardContent>
          </Card>

          <Card className="border-none shadow-md bg-gray-800 text-gray-100 dark:bg-gray-850">
            <CardContent className="p-4 flex flex-col items-center">
              <div className="p-2 rounded-full bg-purple-900/50 mb-2">
                <TrendingUp className="h-5 w-5 text-purple-400" />
              </div>
              <p className="text-xs text-gray-400">{t('stats.upgrades')}</p>
              <p className="text-lg font-bold text-white">{upgradeCount}</p>
            </CardContent>
          </Card>

          <Card className="border-none shadow-md bg-gray-800 text-gray-100 dark:bg-gray-850">
            <CardContent className="p-4 flex flex-col items-center">
              <div className="p-2 rounded-full bg-green-900/50 mb-2">
                <UserPlus className="h-5 w-5 text-green-400" />
              </div>
              <p className="text-xs text-gray-400">{t('stats.referrals')}</p>
              <p className="text-lg font-bold text-white">{referralCount}</p>
            </CardContent>
          </Card>
        </div>

        <Card className="mb-6 border-none shadow-lg bg-gray-800 text-gray-100 dark:bg-gray-850">
          <CardHeader className="pb-2">
            <CardTitle className="flex items-center gap-2 text-xl">
              <BarChartIcon className="h-5 w-5 text-indigo-400" />
              Mining Performance
            </CardTitle>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="weekly">
              <TabsList className="bg-gray-750 border-gray-700 mb-4">
                <TabsTrigger value="daily">Daily</TabsTrigger>
                <TabsTrigger value="weekly">Weekly</TabsTrigger>
              </TabsList>
              
              <TabsContent value="daily" className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <RechartsBarChart
                    data={hourlyData}
                    margin={{ top: 5, right: 5, left: 5, bottom: 20 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" stroke="#555" vertical={false} />
                    <XAxis dataKey="name" tick={{ fill: '#aaa' }} />
                    <YAxis tick={{ fill: '#aaa' }} />
                    <Tooltip 
                      contentStyle={{ backgroundColor: '#333', borderColor: '#555' }}
                      labelStyle={{ color: '#fff' }}
                    />
                    <Bar dataKey="amount" name="FC Mined" fill="#6366f1" />
                  </RechartsBarChart>
                </ResponsiveContainer>
              </TabsContent>
              
              <TabsContent value="weekly" className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <RechartsBarChart
                    data={weeklyData}
                    margin={{ top: 5, right: 5, left: 5, bottom: 20 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" stroke="#555" vertical={false} />
                    <XAxis dataKey="name" tick={{ fill: '#aaa' }} />
                    <YAxis tick={{ fill: '#aaa' }} />
                    <Tooltip 
                      contentStyle={{ backgroundColor: '#333', borderColor: '#555' }}
                      labelStyle={{ color: '#fff' }}
                    />
                    <Bar dataKey="amount" name="FC Mined" fill="#6366f1" />
                  </RechartsBarChart>
                </ResponsiveContainer>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>

        <Card className="mb-6 border-none shadow-lg bg-gray-800 text-gray-100 dark:bg-gray-850">
          <CardHeader className="pb-2">
            <CardTitle className="flex items-center gap-2 text-xl">
              <PieChart className="h-5 w-5 text-purple-400" />
              FC Sources
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <RechartsPieChart>
                  <Pie
                    data={sourceData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
                  >
                    {sourceData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip 
                    contentStyle={{ backgroundColor: '#333', borderColor: '#555' }}
                    labelStyle={{ color: '#fff' }}
                  />
                  <Legend />
                </RechartsPieChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </main>

      <MobileNavigation />
    </div>
  );
};

export default Statistics;
