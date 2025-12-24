import React from 'react';
import Plot from 'react-plotly.js';
import { DataSet, ProcessingParams } from '../types';

import { PeakMatch } from '../utils/peakMatching';
import { calculateWaterfallOffset } from '../utils/dataProcessing';

interface XRDChartPlotlyProps {
  datasets: DataSet[];
  peakMatches?: PeakMatch[];
  params: ProcessingParams;
}

export const XRDChartPlotly: React.FC<XRDChartPlotlyProps> = ({ datasets, peakMatches, params }) => {
  // Using dataset colors assigned in App.tsx (Paul Tol's color-blind safe palette)
  // Prepare traces for each dataset
  // Use generic object typing for Plotly traces to avoid type errors
  // Create traces array for all datasets and their peaks
  const traces: Array<Partial<Record<string, any>>> = [];
  
  const mode = params.comparison.mode;
  const offsetValue = params.comparison.offset;

  // Process each dataset and immediately add its peaks
  datasets.forEach((dataset, index) => {
    // Use the dataset's original color
    const color = dataset.color;
    if (!dataset.visible) return;
    
    // Calculate vertical offset for waterfall mode
    const currentOffset = calculateWaterfallOffset(index, offsetValue, mode);

    const x = dataset.data.map(d => d.angle);
    const y = dataset.data.map(d => (d.backgroundSubtracted ?? d.intensity) + currentOffset);
    
    // Create a unique group name for this dataset and its peaks
    const groupName = `dataset-${index}`;
    
    // Add the dataset line trace
    traces.push({
      x,
      y,
      type: 'scatter',
      mode: 'lines',
      name: dataset.name,
      legendgroup: groupName,
      line: { color, width: 1 },
    } as any);
    
    // Immediately add peaks trace if available (to keep them adjacent in the legend)
    if (dataset.peaks && dataset.peaks.length > 0) {
      traces.push({
        x: dataset.peaks.map(p => p.angle),
        y: dataset.peaks.map(p => p.intensity + currentOffset),
        mode: 'markers',
        type: 'scatter',
        name: 'Peaks',
        legendgroup: groupName,
        marker: {
          color,
          size: 8,
          symbol: 'circle',
          line: { color: 'black', width: 0 },
        },
        hoverinfo: 'text',
        text: dataset.peaks.map((p, i) => `Peak ${i + 1}: ${p.angle.toFixed(2)}°<br>Intensity: ${p.intensity.toFixed(0)}`),
      } as any);
    }
  });

  // Add matched peaks as markers (if any)
  if (peakMatches && peakMatches.length > 0) {
    // Note: Matched peaks logic might need adjustment if sample/ref have different offsets
    // For now, let's keep them at original intensity or adjust if needed.
    // Usually, matched peaks are shown on the sample.
    traces.push({
      x: peakMatches.map(m => m.samplePeak.angle),
      y: peakMatches.map(m => {
        // Find dataset index to apply same offset
        const dsIndex = datasets.findIndex(ds => ds.name === m.sampleDataset);
        const currentOffset = calculateWaterfallOffset(dsIndex, offsetValue, mode);
        return m.samplePeak.intensity + currentOffset;
      }),
      mode: 'markers',
      type: 'scatter',
      name: 'Matched Peaks',
      marker: {
        color: 'red',
        size: 8,
        symbol: 'star',
        line: { color: 'black', width: 0 },
      },
      hoverinfo: 'text',
      text: peakMatches.map(m => `Sample: ${m.sampleDataset}<br>Ref: ${m.referenceDataset}<br>Δ: ${m.delta.toFixed(3)}°`),
    } as any);
  }

  const layout = {
    title: 'XRD Pattern Analysis',
    xaxis: { title: '2θ (degrees)' },
    yaxis: { title: 'Intensity (a.u.)' },
    legend: { 
      orientation: "h" as const, 
      x: 0.5, 
      xanchor: "center" as const, 
      y: 1.15, 
      yanchor: "bottom" as const,
      traceorder: "grouped" as const,
      itemsizing: "constant" as const,
      itemwidth: 30,
      groupgap: 40,
      tracegroupgap: 5
    },
    autosize: true,
    margin: { t: 50, l: 50, r: 30, b: 50 },
    plot_bgcolor: 'white',
    paper_bgcolor: 'white',
    font: { family: 'inherit', size: 14 },
  };


  return (
    <div className="w-full max-w-full h-[300px] sm:h-[400px] md:h-[500px] overflow-x-auto">
      {/* Type assertion to bypass TS error for plotly prop */}
      {(
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
        /> as any
      )}
    </div>
  );
};
