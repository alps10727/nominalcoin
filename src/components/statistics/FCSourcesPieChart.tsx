
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { PieChart } from "lucide-react";
import { PieChart as RechartsPieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer } from 'recharts';

interface SourceData {
  name: string;
  value: number;
}

interface FCSourcesPieChartProps {
  sourceData: SourceData[];
}

const COLORS = ['#8884d8', '#82ca9d', '#ffc658'];

const FCSourcesPieChart = ({ sourceData }: FCSourcesPieChartProps) => {
  return (
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
  );
};

export default FCSourcesPieChart;
