import React, { useCallback } from 'react';
import { parseCSV } from '../utils/dataProcessing';
import { XRDData } from '../types';
import { Textarea } from "./ui/textarea";
import { useNotification } from "./NotificationContext";
import { FileUpload } from "./FileUpload";
import { FlaskConical, Database } from 'lucide-react';

interface DataInputProps {
  onDataLoaded: (data: XRDData[], name: string, type: 'sample' | 'reference') => void;
  hasSample: boolean;
  hasReference: boolean;
  onAddSample: () => void;
  onAddReference: () => void;
}

export const DataInput: React.FC<DataInputProps> = ({ onDataLoaded }) => {
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

  // Collapsible state for paste-in sections
  const [showPasteSample, setShowPasteSample] = React.useState(false);
  const [showPasteReference, setShowPasteReference] = React.useState(false);

  return (
    <div className="w-full max-w-3xl mx-auto mt-6 grid grid-cols-1 md:grid-cols-2 gap-6">
      {/* Sample Upload Card */}
      <div className="bg-white rounded-lg shadow border p-6 flex flex-col">
        <div className="flex items-center mb-2">
          <FlaskConical size={22} className="text-indigo-600 mr-2" />
          <h2 className="font-bold text-lg">Upload Sample Data</h2>
        </div>
        <FileUpload
          onFileAccepted={file => handleFileInternal(file, 'sample')}
          label={null}
          description="CSV, TXT, or DAT files (drag and drop or click)"
        />
        <button
          className="text-xs mt-4 text-indigo-700 hover:underline self-start"
          type="button"
          onClick={() => setShowPasteSample(s => !s)}
        >
          {showPasteSample ? 'Hide Paste Data' : 'Paste Data Instead'}
        </button>
        {showPasteSample && (
          <div className="mt-2">
            <Textarea
              rows={4}
              placeholder="Paste your XRD data here (angle,intensity format)"
              onChange={handlePastedData}
              className="w-full"
            />
          </div>
        )}
      </div>

      {/* Reference Upload Card */}
      <div className="bg-white rounded-lg shadow border p-6 flex flex-col">
        <div className="flex items-center mb-2">
          <Database size={22} className="text-teal-600 mr-2" />
          <h2 className="font-bold text-lg">Upload Reference Pattern</h2>
        </div>
        <FileUpload
          onFileAccepted={file => handleFileInternal(file, 'reference')}
          label={null}
          description="CSV, TXT, or DAT files (drag and drop or click)"
        />
        <button
          className="text-xs mt-4 text-teal-700 hover:underline self-start"
          type="button"
          onClick={() => setShowPasteReference(s => !s)}
        >
          {showPasteReference ? 'Hide Paste Data' : 'Paste Data Instead'}
        </button>
        {showPasteReference && (
          <div className="mt-2">
            <Textarea
              rows={4}
              placeholder="Paste your XRD reference pattern here (angle,intensity format)"
              onChange={e => {
                // Use as reference
                const text = e.target.value;
                try {
                  if (text) {
                    const data = parseCSV(text);
                    if (!data.length) throw new Error('No valid data found in pasted text.');
                    onDataLoaded(data, 'Pasted Reference', 'reference');
                    showNotification('Loaded pasted reference.', 'success');
                  }
                } catch (err: any) {
                  showNotification(`Failed to parse pasted reference: ${err.message}`, 'error');
                }
              }}
              className="w-full"
            />
          </div>
        )}
      </div>
    </div>
  );
};