import React from 'react';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
} from 'chart.js';
import { Line } from 'react-chartjs-2';
import { ProcessedData, Peak, DataSet } from '../types';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

interface XRDChartProps {
  datasets: DataSet[];
}

export const XRDChart: React.FC<XRDChartProps> = ({ datasets }) => {
  const chartData = {
    labels: datasets[0]?.data.map(d => d.angle.toFixed(2)) ?? [],
    datasets: datasets.flatMap(dataset => {
      if (!dataset.visible) return [];

      return [
        {
          label: `${dataset.name} - Raw`,
          data: dataset.data.map(d => d.intensity),
          borderColor: dataset.color,
          backgroundColor: `${dataset.color}33`,
          pointRadius: 0,
        },
        {
          label: `${dataset.name} - Processed`,
          data: dataset.data.map(d => d.backgroundSubtracted),
          borderColor: dataset.color,
          backgroundColor: `${dataset.color}33`,
          pointRadius: 0,
          borderDash: [5, 5],
        },
        {
          label: `${dataset.name} - Peaks`,
          data: dataset.data.map(d => 
            dataset.peaks.some(p => Math.abs(p.angle - d.angle) < 0.1) ? d.backgroundSubtracted : null
          ),
          borderColor: dataset.color,
          backgroundColor: `${dataset.color}33`,
          pointRadius: 5,
          pointStyle: 'star',
        },
      ];
    }),
  };

  const options = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top' as const,
      },
      title: {
        display: true,
        text: 'XRD Pattern Analysis',
      },
      tooltip: {
        callbacks: {
          label: (context: any) => {
            const datasetLabel = context.dataset.label;
            const value = context.parsed.y;
            const angle = parseFloat(context.label);
            
            if (datasetLabel.includes('Peaks')) {
              const dataset = datasets.find(d => d.name === datasetLabel.split(' - ')[0]);
              const peak = dataset?.peaks.find(p => Math.abs(p.angle - angle) < 0.1);
              
              if (peak) {
                return [
                  `Position: ${peak.angle.toFixed(2)}°`,
                  `Intensity: ${peak.intensity.toFixed(0)}`,
                  `FWHM: ${peak.width.toFixed(3)}°`,
                  peak.crystalliteSize ? `Crystallite Size: ${peak.crystalliteSize.toFixed(1)} nm` : '',
                ];
              }
            }
            
            return `${datasetLabel}: ${value.toFixed(1)}`;
          },
        },
      },
    },
    scales: {
      x: {
        title: {
          display: true,
          text: '2θ (degrees)',
        },
      },
      y: {
        title: {
          display: true,
          text: 'Intensity (a.u.)',
        },
      },
    },
  };

  return (
    <div className="w-full max-w-full h-[300px] sm:h-[400px] md:h-[500px] overflow-x-auto">
      <Line data={chartData} options={options} />
    </div>
  );
};