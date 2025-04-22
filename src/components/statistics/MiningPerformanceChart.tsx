
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { BarChart } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import DailyPerformanceChart from "./charts/DailyPerformanceChart";
import WeeklyPerformanceChart from "./charts/WeeklyPerformanceChart";

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
          <BarChart className="h-5 w-5 text-indigo-400" />
          Mining Performance
        </CardTitle>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="weekly">
          <TabsList className="bg-gray-750 border-gray-700 mb-4">
            <TabsTrigger value="daily">Daily</TabsTrigger>
            <TabsTrigger value="weekly">Weekly</TabsTrigger>
          </TabsList>
          
          <TabsContent value="daily">
            <DailyPerformanceChart data={hourlyData} />
          </TabsContent>
          
          <TabsContent value="weekly">
            <WeeklyPerformanceChart data={weeklyData} />
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
};

export default MiningPerformanceChart;
