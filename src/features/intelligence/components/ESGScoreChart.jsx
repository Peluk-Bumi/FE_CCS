import React from 'react';
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
  RadialLinearScale
} from 'chart.js';
import { Doughnut } from 'react-chartjs-2';

ChartJS.register(ArcElement, Tooltip, Legend, RadialLinearScale);

const ESGScoreChart = ({ score, breakdown }) => {
  if (!breakdown) return null;

  const data = {
    labels: ['Environmental', 'Social', 'Governance'],
    datasets: [
      {
        data: [
          breakdown.environmental,
          breakdown.social,
          breakdown.governance,
        ],
        backgroundColor: [
          '#10b981', // Environmental - Green
          '#3b82f6', // Social - Blue
          '#f59e0b', // Governance - Amber
        ],
        borderWidth: 0,
        hoverOffset: 4,
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    cutout: '70%',
    plugins: {
      legend: {
        position: 'bottom',
        labels: {
          usePointStyle: true,
          padding: 20,
        },
      },
    },
  };

  return (
    <div className="relative h-64 w-full">
      <Doughnut data={data} options={options} />
      <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
        <span className="text-3xl font-black text-gray-900">{score}</span>
        <span className="text-xs font-bold text-gray-500 uppercase tracking-widest">ESG Score</span>
      </div>
    </div>
  );
};

export default ESGScoreChart;
