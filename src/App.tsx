import React, { useState, useCallback } from 'react';
import { Card } from "./components/ui/card";
import { AnalysisResultsCard } from "./components/AnalysisResultsCard";

import { Checkbox } from "./components/ui/checkbox";

import Navbar from './components/Navbar';
import { DataInput } from './components/DataInput';
import { XRDChartPlotly } from "./components/XRDChartPlotly";
import { ProcessingControls } from './components/ProcessingControls';
import { NotificationProvider } from './components/NotificationContext';
import { GlobalNotification } from './components/GlobalNotification';
import About from './components/About';
import { XRDData, ProcessedData, DataSet, ProcessingParams } from './types';
import { subtractBackground, smoothData, findPeaks } from './utils/dataProcessing';
import { matchPeaks, PeakMatch } from './utils/peakMatching';
import { HashRouter, Routes, Route } from 'react-router-dom';


const defaultProcessingParams: ProcessingParams = {
  smoothing: { enabled: false, windowSize: 5, polynomialOrder: 2 },
  background: { enabled: false, method: 'sliding', windowSize: 20, iterations: 3 },
  peaks: {
    minHeight: 0.1,
    minDistance: 0.5,
    minProminence: 10,
    instrumentBroadening: 0.1,
    wavelength: 1.5406,
    useMinHeight: false,
    useMinDistance: false,
    useMinProminence: false,
  },
};

// Paul Tol's bright color-blind safe palette
const tolBrightPalette = [
  '#4477AA', // blue
  '#EE6677', // red
  '#228833', // green
  '#CCBB44', // yellow
  '#66CCEE', // cyan
  '#AA3377', // purple
  '#BBBBBB', // grey
];

const generateColor = (index: number) => {
  return tolBrightPalette[index % tolBrightPalette.length];
};

import { Loader2 } from 'lucide-react';

function App() {
  const [datasets, setDatasets] = useState<DataSet[]>([]);
  const [dataInputCollapsed, setDataInputCollapsed] = useState(false);
  const [processingParams, setProcessingParams] = useState<ProcessingParams>(defaultProcessingParams);
  const [peakMatches, setPeakMatches] = useState<PeakMatch[]>([]);
  const [loading, setLoading] = useState(false);

  const processData = useCallback((data: XRDData[]): ProcessedData[] => {
    let processed = data.map(d => ({ ...d }));
    processed = smoothData(processed, processingParams);
    processed = subtractBackground(processed, processingParams);
    return processed;
  }, [processingParams]);

  const handleDataLoaded = useCallback(
    (newData: XRDData[], name: string, type: 'sample' | 'reference') => {
      const processedData = processData(newData);
      const detectedPeaks = findPeaks(processedData, processingParams);
      setDatasets(prev => [
        ...prev,
        {
          id: `${type}-${Date.now()}`,
          name,
          type,
          color: generateColor(prev.length),
          data: processedData,
          peaks: detectedPeaks,
          visible: true,
        },
      ]);
      if (type === 'sample') setDataInputCollapsed(true);
    },
    [processData, processingParams]
  );

  const handleParamsChange = useCallback((newParams: ProcessingParams) => {
    setProcessingParams(newParams);
    setLoading(true);
    setDatasets(prev => prev.map(dataset => {
      const processedData = processData(dataset.data);
      const detectedPeaks = findPeaks(processedData, newParams);
      return { ...dataset, data: processedData, peaks: detectedPeaks };
    }));
    setTimeout(() => setLoading(false), 300); // Give spinner a chance to show
  }, [processData]);

  // Extra safety: always reprocess datasets when processingParams changes
  React.useEffect(() => {
    setLoading(true);
    setDatasets(prev => prev.map(dataset => {
      const processedData = processData(dataset.data);
      const detectedPeaks = findPeaks(processedData, processingParams);
      return { ...dataset, data: processedData, peaks: detectedPeaks };
    }));
    setTimeout(() => setLoading(false), 300);
    // eslint-disable-next-line
  }, [processingParams]);

  return (
    <NotificationProvider>
      <GlobalNotification />
      <HashRouter>
      <div className="bg-background min-h-screen">
        <Navbar />
        <Routes>
          <Route path="/" element={
            <div className="max-w-[1400px] mx-auto my-8 p-4 md:p-8">
              {/* Home/Main content starts here */}

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="md:col-span-2">
              <div className="flex items-center mb-2">
                <h2 className="text-2xl font-bold mr-4">Data Input</h2>
                <button
                  className="ml-auto px-3 py-1 rounded bg-gray-200 hover:bg-gray-300 text-gray-700 text-sm"
                  onClick={() => setDataInputCollapsed(c => !c)}
                >
                  {dataInputCollapsed ? 'Show Data Input' : 'Hide Data Input'}
                </button>
              </div>
              {!dataInputCollapsed && (
                <Card className="mb-6 p-4">
                  <DataInput
                    onDataLoaded={handleDataLoaded}
                    hasSample={datasets.some(ds => ds.type === 'sample')}
                    hasReference={datasets.some(ds => ds.type === 'reference')}
                    onAddSample={() => setDataInputCollapsed(false)}
                    onAddReference={() => setDataInputCollapsed(false)}
                  />
                </Card>
              )}

              {datasets.length > 0 && (
                <div className="mb-6">
                  <h3 className="text-lg font-semibold mb-2">Loaded Patterns</h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
                    {datasets.map(dataset => (
                      <div key={dataset.id} className="flex items-center justify-between p-2 rounded border bg-card">
                        <div className="flex items-center gap-2">
                          <span className="inline-block w-4 h-4 rounded-full mr-2" style={{ background: dataset.color }} />
                          <span className="font-medium text-sm">{dataset.name}</span>
                        </div>
                        <label className="flex items-center gap-1 cursor-pointer select-none">
                          <Checkbox checked={dataset.visible} onCheckedChange={() => setDatasets(prev => prev.map(d => d.id === dataset.id ? { ...d, visible: !d.visible } : d))} />
                          <span className="text-xs">Show</span>
                        </label>
                      </div>
                    ))}
                  </div>
                </div>
              )}
              {(() => {
                const visibleSamples = datasets.filter(d => d.visible && d.type === 'sample');
                const visibleReferences = datasets.filter(d => d.visible && d.type === 'reference');
                // Compute matches whenever visible datasets change
                React.useEffect(() => {
                  setPeakMatches(matchPeaks(visibleSamples, visibleReferences));
                  // eslint-disable-next-line
                }, [datasets]);
                return datasets.filter(d => d.visible).length > 0 ? (
                  <div className="mb-6 relative">
                    <h3 className="text-lg font-semibold mb-2">XRD Pattern</h3>
                    <div className="md:col-span-2 col-span-1 relative">
                      <XRDChartPlotly datasets={datasets.filter(d => d.visible)} peakMatches={peakMatches} />
                      {loading && (
                        <div className="absolute inset-0 flex items-center justify-center bg-white/60 z-20">
                          <Loader2 className="animate-spin w-16 h-16 text-primary" />
                        </div>
                      )}
                    </div>
                    <div className="flex justify-end mt-2">
                      <button
                        className="px-4 py-2 rounded bg-primary text-primary-foreground hover:bg-primary/90 text-sm font-medium shadow"
                        onClick={() => import('./utils/exportCSV').then(mod => mod.exportDatasetsToCSV(datasets.filter(d => d.visible)))}
                      >
                        Export CSV
                      </button>
                    </div>
                    {/* Peak match summary table */}
                    {peakMatches.length > 0 && (
                      <div className="mt-4">
                        <h4 className="text-md font-semibold mb-2">Phase Match Summary</h4>
                        <div className="overflow-x-auto">
                          <table className="min-w-full text-xs border bg-background">
                            <thead>
                              <tr>
                                <th className="px-2 py-1 border">Sample</th>
                                <th className="px-2 py-1 border">Reference</th>
                                <th className="px-2 py-1 border">Sample Peak (°2θ)</th>
                                <th className="px-2 py-1 border">Reference Peak (°2θ)</th>
                                <th className="px-2 py-1 border">Δ (°2θ)</th>
                              </tr>
                            </thead>
                            <tbody>
                              {peakMatches.map((m, i) => (
                                <tr key={i}>
                                  <td className="px-2 py-1 border">{m.sampleDataset}</td>
                                  <td className="px-2 py-1 border">{m.referenceDataset}</td>
                                  <td className="px-2 py-1 border">{m.samplePeak.angle.toFixed(2)}</td>
                                  <td className="px-2 py-1 border">{m.referencePeak.angle.toFixed(2)}</td>
                                  <td className="px-2 py-1 border">{m.delta.toFixed(3)}</td>
                                </tr>
                              ))}
                            </tbody>
                          </table>
                        </div>
                      </div>
                    )}
                  </div>
                ) : null;
              })()}

              {datasets.length > 0 && (
                <div>
                  <h3 className="text-lg font-semibold mb-2">Analysis Results</h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
                    {datasets.map(dataset => (
                      <AnalysisResultsCard key={dataset.id} dataset={dataset} />
                    ))}
                  </div>
                </div>
              )}
            </div>
            <div>
              <h3 className="text-lg font-semibold mb-2">Processing Controls</h3>
              <Card className="p-4">
                <ProcessingControls params={processingParams} onParamsChange={handleParamsChange} />
              </Card>
            </div>
          </div>
        </div>}
          />
          <Route path="/about" element={<About />} />
        </Routes>
      </div>
      </HashRouter>
    </NotificationProvider>
  );
}

export default App;