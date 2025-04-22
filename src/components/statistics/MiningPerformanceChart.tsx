
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { BarChart, BarChart as BarChartIcon } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { BarChart as RechartsBarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

interface ChartData {
  name: string;
  amount: number;
}

interface MiningPerformanceChartProps {
  hourlyData: ChartData[];
  weeklyData: ChartData[];
}

const MiningPerformanceChart = ({ hourlyData, weeklyData }: MiningPerformanceChartProps) => {
  return (
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
  );
};

export default MiningPerformanceChart;
