import React from 'react';
import Plot from 'react-plotly.js';
import { DataSet } from '../types';

import { PeakMatch } from '../utils/peakMatching';

interface XRDChartPlotlyProps {
  datasets: DataSet[];
  peakMatches?: PeakMatch[];
}

export const XRDChartPlotly: React.FC<XRDChartPlotlyProps> = ({ datasets, peakMatches }) => {
  // Prepare traces for each dataset
  const traces = datasets.flatMap(dataset => {
    if (!dataset.visible) return [];
    const x = dataset.data.map(d => d.angle);
    const y = dataset.data.map(d => d.backgroundSubtracted ?? d.intensity);
    return [{
      x,
      y,
      type: 'scatter',
      mode: 'lines',
      name: dataset.name,
      line: { color: dataset.color, width: 2 },
    }];
  });

  // Add matched peaks as markers (if any)
  if (peakMatches && peakMatches.length > 0) {
    traces.push({
      x: peakMatches.map(m => m.samplePeak.angle),
      y: peakMatches.map(m => m.samplePeak.intensity),
      mode: 'markers',
      type: 'scatter',
      name: 'Matched Peaks',
      marker: {
        color: 'red',
        size: 10,
        symbol: 'star',
        line: { color: 'black', width: 1 },
      },
      hoverinfo: 'text',
      text: peakMatches.map(m => `Sample: ${m.sampleDataset}<br>Ref: ${m.referenceDataset}<br>Δ: ${m.delta.toFixed(3)}°`),
    });
  }

  const layout = {
    title: 'XRD Pattern Analysis',
    xaxis: { title: '2θ (degrees)' },
    yaxis: { title: 'Intensity (a.u.)' },
    legend: { orientation: 'h', x: 0.5, xanchor: 'center', y: 1.1 },
    autosize: true,
    margin: { t: 50, l: 50, r: 30, b: 50 },
    plot_bgcolor: 'white',
    paper_bgcolor: 'white',
    font: { family: 'inherit', size: 14 },
  };

  return (
    <div className="w-full max-w-full h-[300px] sm:h-[400px] md:h-[500px] overflow-x-auto">
      <Plot
        data={traces}
        layout={layout}
        useResizeHandler
        style={{ width: '100%', height: '100%' }}
        config={{
          responsive: true,
          displaylogo: false,
          toImageButtonOptions: {
            format: 'png',
            filename: 'xrd-pattern',
            height: 500,
            width: 900,
            scale: 2,
          },
        }}
      />
    </div>
  );
};
