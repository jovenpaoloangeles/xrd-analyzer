import { Peak, DataSet } from '../types';

export interface PeakMatch {
  samplePeak: Peak;
  referencePeak: Peak;
  sampleDataset: string;
  referenceDataset: string;
  delta: number;
}

// Returns a list of matches between sample and reference peaks
export function matchPeaks(
  sampleDatasets: DataSet[],
  referenceDatasets: DataSet[],
  tolerance: number = 0.2
): PeakMatch[] {
  const matches: PeakMatch[] = [];
  sampleDatasets.forEach(sample => {
    referenceDatasets.forEach(reference => {
      sample.peaks.forEach(samplePeak => {
        const closest = reference.peaks.reduce<{peak: Peak|null, delta: number}>(
          (acc, refPeak) => {
            const delta = Math.abs(samplePeak.angle - refPeak.angle);
            return delta < acc.delta ? {peak: refPeak, delta} : acc;
          },
          {peak: null, delta: Infinity}
        );
        if (closest.peak && closest.delta <= tolerance) {
          matches.push({
            samplePeak,
            referencePeak: closest.peak,
            sampleDataset: sample.name,
            referenceDataset: reference.name,
            delta: closest.delta,
          });
        }
      });
    });
  });
  return matches;
}
