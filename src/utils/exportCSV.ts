import { DataSet } from '../types';

export function exportDatasetsToCSV(datasets: DataSet[]) {
  if (!datasets.length) return;
  // Prepare CSV header
  const headers = ['Dataset','Angle (2θ)','Intensity','BackgroundSubtracted','Peak?'];
  let rows: string[] = [headers.join(',')];

  datasets.forEach(ds => {
    ds.data.forEach(point => {
      const isPeak = ds.peaks?.some(p => Math.abs(p.angle - point.angle) < 0.1);
      rows.push([
        ds.name,
        point.angle,
        point.intensity,
        point.backgroundSubtracted ?? '',
        isPeak ? 'Yes' : ''
      ].join(','));
    });
  });

  const csvContent = rows.join('\r\n');
  const blob = new Blob([csvContent], { type: 'text/csv' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = 'xrd-data.csv';
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}
