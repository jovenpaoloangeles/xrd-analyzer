import React, { useState } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from './ui/card';
import { Button } from './ui/button';
import { DataSet, Peak } from '../types';
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator
} from './ui/dropdown-menu';
import { MoreVertical } from 'lucide-react';

interface AnalysisResultsCardProps {
  dataset: DataSet;
}

function getMainPeak(peaks: Peak[]): Peak | undefined {
  if (!peaks.length) return undefined;
  return peaks.reduce((max, p) => p.intensity > max.intensity ? p : max, peaks[0]);
}

function getAvgFWHM(peaks: Peak[]): string {
  if (!peaks.length) return '-';
  return (peaks.reduce((a, b) => a + b.width, 0) / peaks.length).toFixed(3);
}

function getAvgCrystallite(peaks: Peak[]): string {
  const sizes = peaks.map(p => p.crystalliteSize).filter(x => !!x) as number[];
  if (!sizes.length) return '-';
  return (sizes.reduce((a, b) => a + b, 0) / sizes.length).toFixed(1);
}

function exportPeaksAsJSON(dataset: DataSet) {
  const blob = new Blob([JSON.stringify(dataset.peaks, null, 2)], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `${dataset.name}-peaks.json`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

function exportPeaksAsTXT(dataset: DataSet) {
  let txt = 'Peak\tAngle (2θ)\tIntensity\tFWHM\tCrystallite Size (nm)\n';
  txt += dataset.peaks.map((p, idx) =>
    `${idx + 1}\t${p.angle.toFixed(2)}\t${p.intensity.toFixed(0)}\t${p.width.toFixed(3)}\t${p.crystalliteSize ? p.crystalliteSize.toFixed(1) : ''}`
  ).join('\n');
  const blob = new Blob([txt], { type: 'text/plain' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `${dataset.name}-peaks.txt`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

function copyPeaksToClipboard(dataset: DataSet) {
  let txt = 'Peak\tAngle (2θ)\tIntensity\tFWHM\tCrystallite Size (nm)\n';
  txt += dataset.peaks.map((p, idx) =>
    `${idx + 1}\t${p.angle.toFixed(2)}\t${p.intensity.toFixed(0)}\t${p.width.toFixed(3)}\t${p.crystalliteSize ? p.crystalliteSize.toFixed(1) : ''}`
  ).join('\n');
  if (navigator.clipboard) {
    navigator.clipboard.writeText(txt);
  } else {
    // fallback for older browsers
    const textarea = document.createElement('textarea');
    textarea.value = txt;
    document.body.appendChild(textarea);
    textarea.select();
    document.execCommand('copy');
    document.body.removeChild(textarea);
  }
}

export const AnalysisResultsCard: React.FC<AnalysisResultsCardProps> = ({ dataset }) => {
  const [open, setOpen] = useState(false);
  const { peaks } = dataset;

  return (
    <Card className="mb-2">
      <CardHeader className="flex flex-row items-center justify-between py-3 px-4 cursor-pointer select-none" onClick={() => setOpen(o => !o)}>
        <div>
          <CardTitle className="text-base font-semibold">
            {dataset.name} – Detected Peaks
          </CardTitle>
          <div className="text-xs mt-1 text-muted-foreground">
            {peaks.length} peaks detected; average FWHM = {getAvgFWHM(peaks)}°
          </div>
          <div className="flex gap-4 mt-1 text-xs">
            <span>{(() => {
              const mainPeak = getMainPeak(peaks);
              return mainPeak ? `Main Peak: ${mainPeak.angle.toFixed(2)}° (${mainPeak.intensity.toFixed(0)} counts)` : 'Main Peak: -';
            })()}</span>
            <span>Avg. Size: {getAvgCrystallite(peaks)} nm</span>
            <span>Total: {peaks.length}</span>
          </div>
        </div>
        <div className="flex flex-col gap-1 items-end">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button size="icon" variant="ghost" className="h-8 w-8 p-0" onClick={e => e.stopPropagation()} aria-label="Open actions menu">
                <MoreVertical className="w-5 h-5" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={(e: React.MouseEvent) => { e.stopPropagation(); exportPeaksAsJSON(dataset); }}>Export JSON</DropdownMenuItem>
              <DropdownMenuItem onClick={(e: React.MouseEvent) => { e.stopPropagation(); exportPeaksAsTXT(dataset); }}>Download TXT</DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={(e: React.MouseEvent) => { e.stopPropagation(); copyPeaksToClipboard(dataset); }}>Copy to clipboard</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </CardHeader>
      {open && (
        <CardContent className="pt-0 pb-4 px-4">
          {peaks.length === 0 ? (
            <div className="text-xs text-muted-foreground">No peaks detected.</div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-xs font-mono border-spacing-0" style={{ lineHeight: '1.7', minWidth: 320 }}>
                <thead>
                  <tr>
                    <th className="px-2 py-1 text-left">#</th>
                    <th className="px-2 py-1 text-left">Angle (2θ)</th>
                    <th className="px-2 py-1 text-left">Intensity</th>
                    <th className="px-2 py-1 text-left">FWHM</th>
                    <th className="px-2 py-1 text-left">Crystallite Size (nm)</th>
                  </tr>
                </thead>
                <tbody>
                  {peaks.map((peak, idx) => (
                    <tr key={idx} style={{ padding: '12px 0' }}>
                      <td className="px-2 py-1">{idx + 1}</td>
                      <td className="px-2 py-1">{peak.angle.toFixed(2)}</td>
                      <td className="px-2 py-1">{peak.intensity.toFixed(0)}</td>
                      <td className="px-2 py-1">{peak.width.toFixed(3)}</td>
                      <td className="px-2 py-1">{peak.crystalliteSize ? peak.crystalliteSize.toFixed(1) : ''}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </CardContent>
      )}
    </Card>
  );
};
