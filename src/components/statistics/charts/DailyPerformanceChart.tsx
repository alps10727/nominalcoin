
import { BarChart } from "lucide-react";
import { BarChart as RechartsBarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

interface ChartData {
  name: string;
  amount: number;
}

interface DailyPerformanceChartProps {
  data: ChartData[];
}

const DailyPerformanceChart = ({ data }: DailyPerformanceChartProps) => {
  return (
    <div className="h-64">
      <ResponsiveContainer width="100%" height="100%">
        <RechartsBarChart
          data={data}
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
    </div>
  );
};

export default DailyPerformanceChart;
