import React from 'react';
import { useDropzone } from 'react-dropzone';
import { Upload } from 'lucide-react';
import { Button } from './ui/button';
import { Card } from './ui/card';

interface FileUploadProps {
  onFileAccepted: (file: File) => void;
  accept?: string[];
  label?: React.ReactNode;
  description?: string;
  className?: string;
}

export const FileUpload: React.FC<FileUploadProps> = ({
  onFileAccepted,
  accept = ['.csv', '.txt', '.dat'],
  label = 'Upload File',
  description = 'CSV, TXT, or DAT files (drag and drop or click)',
  className = '',
}) => {
  const {
    getRootProps,
    getInputProps,
    isDragActive,
    open,
  } = useDropzone({
    accept: accept.reduce((acc, ext) => ({ ...acc, [ext]: [] }), {}),
    multiple: false,
    noClick: true,
    onDrop: (acceptedFiles) => {
      if (acceptedFiles.length > 0) {
        onFileAccepted(acceptedFiles[0]);
      }
    },
  });

  return (
    <Card
      {...getRootProps({
        className:
          'flex flex-col items-center justify-center border-dashed border-2 border-muted-foreground/30 p-6 rounded-lg cursor-pointer transition-colors hover:border-primary/60 bg-background ' +
          (isDragActive ? 'bg-accent/30 border-primary/80 ' : '') +
          className,
      })}
      tabIndex={0}
      aria-label={typeof label === 'string' ? label : 'File Upload'}
    >
      <input {...getInputProps()} />
      <div className="flex flex-col items-center text-muted-foreground mb-2">
        <Upload size={40} className="mb-2" />
        <span className="font-semibold">{label}</span>
        <span className="text-xs text-center">{description}</span>
      </div>
      <Button type="button" onClick={open} className="mt-2" variant="outline">
        Select File
      </Button>
    </Card>
  );
};
