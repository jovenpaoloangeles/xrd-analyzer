import React from 'react';
import { ProcessingParams } from '../types';

interface ProcessingControlsProps {
  params: ProcessingParams;
  onParamsChange: (params: ProcessingParams) => void;
}

export const ProcessingControls: React.FC<ProcessingControlsProps> = ({
  params,
  onParamsChange,
}) => {
  const [showAdvanced, setShowAdvanced] = React.useState(false);
  const handleChange = (section: keyof ProcessingParams, field: string, value: any) => {
    onParamsChange({
      ...params,
      [section]: {
        ...params[section],
        [field]: value,
      },
    });
  };

  return (
    <div className="space-y-6 p-4 bg-white rounded-md shadow-sm max-w-full sm:max-w-lg mx-auto">
      <div>
        <h3 className="text-lg font-medium text-gray-900">Processing Parameters</h3>
        <div className="mt-4 space-y-4">
          <div>
            <div className="mt-2 space-y-2">
              <label className="flex items-center font-medium text-gray-700 text-sm">
                <input
                  type="checkbox"
                  checked={params.smoothing.enabled}
                  onChange={(e) => handleChange('smoothing', 'enabled', e.target.checked)}
                  className="rounded border-gray-300 text-indigo-600 focus:ring-indigo-500 mr-2"
                />
                Smoothing
              </label>
              {params.smoothing.enabled && (
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm text-gray-600">Window Size</label>
                    <input
                      type="number"
                      value={params.smoothing.windowSize}
                      onChange={(e) => handleChange('smoothing', 'windowSize', parseInt(e.target.value))}
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                    />
                  </div>
                  <div>
                    <label className="block text-sm text-gray-600">Polynomial Order</label>
                    <input
                      type="number"
                      value={params.smoothing.polynomialOrder}
                      onChange={(e) => handleChange('smoothing', 'polynomialOrder', parseInt(e.target.value))}
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                    />
                  </div>
                </div>
              )}
            </div>
          </div>

          <div>
            <div className="mt-2 space-y-2">
              <label className="flex items-center font-medium text-gray-700 text-sm">
                <input
                  type="checkbox"
                  checked={params.background.enabled}
                  onChange={(e) => handleChange('background', 'enabled', e.target.checked)}
                  className="rounded border-gray-300 text-indigo-600 focus:ring-indigo-500 mr-2"
                />
                Background Subtraction
              </label>
              {params.background.enabled && (
                <>
                  <select
                    value={params.background.method}
                    onChange={(e) => handleChange('background', 'method', e.target.value)}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                  >
                    <option value="sliding">Sliding Window</option>
                    <option value="spline">Spline Fitting</option>
                    <option value="rollingBall">Rolling Ball</option>
                  </select>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm text-gray-600">Window Size</label>
                      <input
                        type="number"
                        value={params.background.windowSize}
                        onChange={(e) => handleChange('background', 'windowSize', parseInt(e.target.value))}
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                      />
                    </div>
                    {params.background.method === 'rollingBall' && (
                      <div>
                        <label className="block text-sm text-gray-600">Iterations</label>
                        <input
                          type="number"
                          value={params.background.iterations}
                          onChange={(e) => handleChange('background', 'iterations', parseInt(e.target.value))}
                          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                        />
                      </div>
                    )}
                  </div>
                </>
              )}
            </div>
          </div>

          <div>
            <h4 className="text-sm font-medium text-gray-700">Peak Analysis</h4>
            <div className="mt-2 grid grid-cols-2 gap-4">
              <div>
                <div>
                  <label className="flex items-center">
                    <input
                      type="checkbox"
                      checked={params.peaks.useMinHeight}
                      onChange={(e) => handleChange('peaks', 'useMinHeight', e.target.checked)}
                      className="rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
                    />
                    <span className="ml-2 text-sm text-gray-600">Use Min. Height (%)</span>
                  </label>
                  {params.peaks.useMinHeight && (
                    <input
                      type="number"
                      value={params.peaks.minHeight * 100}
                      onChange={(e) => handleChange('peaks', 'minHeight', parseFloat(e.target.value) / 100)}
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                    />
                  )}
                </div>
                <div>
                  <label className="flex items-center">
                    <input
                      type="checkbox"
                      checked={params.peaks.useMinDistance}
                      onChange={(e) => handleChange('peaks', 'useMinDistance', e.target.checked)}
                      className="rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
                    />
                    <span className="ml-2 text-sm text-gray-600">Use Min. Distance (°)</span>
                  </label>
                  {params.peaks.useMinDistance && (
                    <input
                      type="number"
                      value={params.peaks.minDistance}
                      onChange={(e) => handleChange('peaks', 'minDistance', parseFloat(e.target.value))}
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                    />
                  )}
                </div>
                <div>
                  <label className="flex items-center">
                    <input
                      type="checkbox"
                      checked={params.peaks.useMinProminence}
                      onChange={(e) => handleChange('peaks', 'useMinProminence', e.target.checked)}
                      className="rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
                    />
                    <span className="ml-2 text-sm text-gray-600">Use Min. Prominence</span>
                  </label>
                  {params.peaks.useMinProminence && (
                    <input
                      type="number"
                      value={params.peaks.minProminence}
                      onChange={(e) => handleChange('peaks', 'minProminence', parseFloat(e.target.value))}
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                    />
                  )}
                </div>
              </div>
            </div>
          </div>
          {/* Advanced Settings Accordion */}
          <div className="mt-6">
            <button
              type="button"
              className="w-full flex justify-between items-center px-4 py-2 bg-gray-100 rounded text-gray-700 font-medium border border-gray-200 hover:bg-gray-200 transition"
              onClick={() => setShowAdvanced(a => !a)}
              aria-expanded={showAdvanced}
            >
              Advanced Settings
              <span className="ml-2">{showAdvanced ? '▲' : '▼'}</span>
            </button>
            {showAdvanced && (
              <div className="mt-4 space-y-4 bg-gray-50 rounded p-4 border border-gray-200">
                <div>
                  <label className="block text-sm text-gray-600">Instrument Broadening (°)</label>
                  <input
                    type="number"
                    value={params.peaks.instrumentBroadening}
                    onChange={(e) => handleChange('peaks', 'instrumentBroadening', parseFloat(e.target.value))}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                  />
                </div>
                <div>
                  <label className="block text-sm text-gray-600">Wavelength (Å)</label>
                  <input
                    type="number"
                    value={params.peaks.wavelength}
                    onChange={(e) => handleChange('peaks', 'wavelength', parseFloat(e.target.value))}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                  />
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};