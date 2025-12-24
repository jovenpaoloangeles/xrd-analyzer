import React from 'react';
import { ProcessingParams, CrystalStructure } from '../types';
import { Card } from './ui/card';
import { Button } from './ui/button';
import { Checkbox } from './ui/checkbox';
import { parseCIF } from '../utils/cifParser';

interface RietveldControlsProps {
  params: ProcessingParams;
  onParamsChange: (params: ProcessingParams) => void;
  onRunRefinement: () => void;
}

export const RietveldControls: React.FC<RietveldControlsProps> = ({
  params,
  onParamsChange,
  onRunRefinement,
}) => {
  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const text = await file.text();
      const structure = parseCIF(text);
      onParamsChange({
        ...params,
        rietveld: {
          ...params.rietveld,
          cifContent: text,
          structure,
        },
      });
    }
  };

  return (
    <Card className="p-4 space-y-4">
      <h3 className="text-lg font-semibold">Rietveld Refinement</h3>
      
      <div className="space-y-2">
        <label className="block text-sm font-medium text-gray-700">Upload CIF File</label>
        <input
          type="file"
          accept=".cif"
          onChange={handleFileChange}
          className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-primary file:text-primary-foreground hover:file:bg-primary/90"
        />
      </div>

      {params.rietveld.structure && (
        <div className="space-y-2">
          <p className="text-xs text-gray-500">
            Lattice: a={params.rietveld.structure.a.toFixed(3)}, b={params.rietveld.structure.b.toFixed(3)}, c={params.rietveld.structure.c.toFixed(3)}
          </p>
          <div className="flex items-center gap-2">
            <Checkbox 
              id="refine-enabled" 
              checked={params.rietveld.enabled} 
              onCheckedChange={(checked) => onParamsChange({
                ...params,
                rietveld: { ...params.rietveld, enabled: !!checked }
              })} 
            />
            <label htmlFor="refine-enabled" className="text-sm">Enable Overlay</label>
          </div>
          
          <Button 
            className="w-full" 
            onClick={onRunRefinement}
            disabled={!params.rietveld.cifContent}
          >
            Run Refinement
          </Button>
          
          {params.rietveld.rwp !== undefined && (
            <p className="text-sm font-medium text-green-600">
              Goodness of Fit (Rwp): {(params.rietveld.rwp * 100).toFixed(2)}%
            </p>
          )}
        </div>
      )}
    </Card>
  );
};
