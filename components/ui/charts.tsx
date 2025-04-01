"use client";

import { 
  Chart as ChartJS, 
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
  ChartOptions,
  ChartData,
  ChartDataset
} from 'chart.js';
import { Bar, Line, Pie } from 'react-chartjs-2';

// Register ChartJS components
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend
);

// Common interface for all chart props
interface ChartProps {
  data: ChartData<any>;
  options?: ChartOptions<any>;
  className?: string;
}

export function BarChart({ data, options, className }: ChartProps) {
  const defaultOptions: ChartOptions<'bar'> = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top',
      },
    },
    scales: {
      y: {
        beginAtZero: true
      }
    }
  };

  return (
    <div className={className}>
      <Bar 
        data={data} 
        options={options || defaultOptions} 
      />
    </div>
  );
}

export function LineChart({ data, options, className }: ChartProps) {
  const defaultOptions: ChartOptions<'line'> = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top',
      },
    },
    scales: {
      y: {
        beginAtZero: true
      }
    }
  };

  return (
    <div className={className}>
      <Line 
        data={data} 
        options={options || defaultOptions} 
      />
    </div>
  );
}

export function PieChart({ data, options, className }: ChartProps) {
  const defaultOptions: ChartOptions<'pie'> = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top',
      },
    }
  };

  return (
    <div className={className}>
      <Pie 
        data={data} 
        options={options || defaultOptions} 
      />
    </div>
  );
}