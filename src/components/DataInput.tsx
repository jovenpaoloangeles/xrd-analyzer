import React, { useCallback } from 'react';
import { parseCSV } from '../utils/dataProcessing';
import { XRDData } from '../types';
import { Textarea } from "./ui/textarea";
import { useNotification } from "./NotificationContext";
import { FileUpload } from "./FileUpload";
import { Plus } from 'lucide-react';

interface DataInputProps {
  onDataLoaded: (data: XRDData[], name: string, type: 'sample' | 'reference') => void;
  hasSample: boolean;
  hasReference: boolean;
  onAddSample: () => void;
  onAddReference: () => void;
}

export const DataInput: React.FC<DataInputProps> = ({ onDataLoaded, hasSample, hasReference, onAddSample, onAddReference }) => {
  const { showNotification } = useNotification();
  const [showSampleUpload, setShowSampleUpload] = React.useState(false);
  const [showReferenceUpload, setShowReferenceUpload] = React.useState(false);

  // Unified file handler for both sample and reference
  const handleFile = useCallback(
    (file: File, type: 'sample' | 'reference') => {
      const reader = new FileReader();
      reader.onload = (e) => {
        try {
          const text = e.target?.result as string;
          const data = parseCSV(text);
          if (!data.length) throw new Error('No valid data found.');
          onDataLoaded(data, file.name, type);
          showNotification(
            `Loaded ${type === 'sample' ? 'sample' : 'reference'}: ${file.name}`,
            'success'
          );
        } catch (err: any) {
          showNotification(
            `Failed to parse ${type === 'sample' ? 'file' : 'reference'}: ${err.message}`,
            'error'
          );
        }
      };
      reader.onerror = () =>
        showNotification(
          `Error reading ${type === 'sample' ? 'file' : 'reference'} file.`,
          'error'
        );
      reader.readAsText(file);
    },
    [onDataLoaded, showNotification]
  );

  // Handler wrappers for add buttons
  const handleAddSample = () => {
    setShowSampleUpload(true);
    if (onAddSample) onAddSample();
  };
  const handleAddReference = () => {
    setShowReferenceUpload(true);
    if (onAddReference) onAddReference();
  };

  // Hide drop zone after upload
  const handleFileInternal = useCallback((file: File, type: 'sample' | 'reference') => {
    handleFile(file, type);
    if (type === 'sample') setShowSampleUpload(false);
    if (type === 'reference') setShowReferenceUpload(false);
  }, [handleFile]);

  const handlePastedData = useCallback(
    (event: React.ChangeEvent<HTMLTextAreaElement>) => {
      const text = event.target.value;
      try {
        if (text) {
          const data = parseCSV(text);
          if (!data.length) throw new Error('No valid data found in pasted text.');
          onDataLoaded(data, 'Pasted Data', 'sample');
          showNotification('Loaded pasted data.', 'success');
        }
      } catch (err: any) {
        showNotification(`Failed to parse pasted data: ${err.message}`, 'error');
      }
    },
    [onDataLoaded, showNotification]
  );

  return (
  <div className="w-full max-w-2xl mx-auto mt-6">
    {(!hasSample && !hasReference) || showSampleUpload || showReferenceUpload ? (
      <div className="flex flex-col md:flex-row gap-4">
        {/* Sample File Upload */}
        {(!hasSample || showSampleUpload) && (
          <FileUpload
            onFileAccepted={file => handleFileInternal(file, 'sample')}
            label="Upload Sample Data"
            description="CSV, TXT, or DAT files (drag and drop or click)"
          />
        )}
        {/* Reference File Upload */}
        {(!hasReference || showReferenceUpload) && (
          <FileUpload
            onFileAccepted={file => handleFileInternal(file, 'reference')}
            label={<span className="flex items-center gap-1"><Plus size={18} />Add Reference Pattern</span>}
            description="CSV, TXT, or DAT files (drag and drop or click)"
          />
        )}
      </div>
    ) : (
      <div className="flex gap-4">
        <button
          className="flex items-center px-3 py-2 rounded bg-indigo-100 text-indigo-700 font-medium border border-indigo-300 hover:bg-indigo-200 transition"
          onClick={handleAddSample}
        >
          <Plus size={18} className="mr-1" /> Add New Sample
        </button>
        <button
          className="flex items-center px-3 py-2 rounded bg-teal-100 text-teal-700 font-medium border border-teal-300 hover:bg-teal-200 transition"
          onClick={handleAddReference}
        >
          <Plus size={18} className="mr-1" /> Add New Reference
        </button>
      </div>
    )}
    {/* Hide textarea when compressed UI is active */}
    {(!hasSample && !hasReference) || showSampleUpload || showReferenceUpload ? (
      <div className="mt-6">
        <span className="font-medium text-sm mb-1 block">Or paste your data here:</span>
        <Textarea
          rows={4}
          placeholder="Paste your XRD data here (angle,intensity format)"
          onChange={handlePastedData}
          className="w-full"
        />
      </div>
    ) : null}
  </div>
);
};