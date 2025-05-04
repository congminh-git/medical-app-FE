// components/ChartWrapper.tsx
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  LineElement,
  PointElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
  ChartData,
  ChartOptions,
} from 'chart.js';

import {
  Bar,
  Line,
  Pie,
  Doughnut,
  Radar,
  PolarArea,
} from 'react-chartjs-2';

import React from 'react';

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  LineElement,
  PointElement,
  ArcElement,
  Title,
  Tooltip,
  Legend
);

type ChartType = 'bar' | 'line' | 'pie' | 'doughnut' | 'radar' | 'polarArea';

type ChartPropsMap = {
  bar: ChartData<'bar'>;
  line: ChartData<'line'>;
  pie: ChartData<'pie'>;
  doughnut: ChartData<'doughnut'>;
  radar: ChartData<'radar'>;
  polarArea: ChartData<'polarArea'>;
};

interface ChartWrapperProps<T extends ChartType> {
  type: T;
  data: ChartPropsMap[T];
  options?: ChartOptions<T>;
}

const ChartWrapper = <T extends ChartType>({
  type,
  data,
  options,
}: ChartWrapperProps<T>) => {
  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false, // quan trọng để chiều cao theo thẻ cha
    ...options,
  };

  const chartComponent = (() => {
    switch (type) {
      case 'bar':
        return <Bar data={data as ChartData<'bar'>} options={chartOptions as ChartOptions<'bar'>} />;
      case 'line':
        return <Line data={data as ChartData<'line'>} options={chartOptions as ChartOptions<'line'>} />;
      case 'pie':
        return <Pie data={data as ChartData<'pie'>} options={chartOptions as ChartOptions<'pie'>} />;
      case 'doughnut':
        return <Doughnut data={data as ChartData<'doughnut'>} options={chartOptions as ChartOptions<'doughnut'>} />;
      case 'radar':
        return <Radar data={data as ChartData<'radar'>} options={chartOptions as ChartOptions<'radar'>} />;
      case 'polarArea':
        return <PolarArea data={data as ChartData<'polarArea'>} options={chartOptions as ChartOptions<'polarArea'>} />;
      default:
        return null;
    }
  })();

  return (
    <div className="w-full" style={{ position: 'relative', width: '100%', height: '400px' }}>
      {chartComponent}
    </div>
  );
};

export default ChartWrapper;
