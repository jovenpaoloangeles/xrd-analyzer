import React from 'react';
import { Card } from './ui/card';
import { ArrowRight, GitBranch, FileUp, BarChart, Zap, Download } from 'lucide-react';

const About: React.FC = () => (
  <div className="bg-background min-h-screen">
    <div className="max-w-[1400px] mx-auto my-8 p-4 md:p-8">
      <Card className="p-6 mb-8 shadow-md bg-card">
        <h1 className="text-3xl font-bold mb-4 text-primary">About XRD Analyzer</h1>
        <p className="text-lg mb-6">
          <span className="font-semibold">XRD Analyzer</span> is a web-based tool for visualizing and analyzing X-ray diffraction (XRD) data. 
          It supports common file formats (CSV, TXT, DAT) and provides interactive plotting, data processing, and peak analysis features.
        </p>
      </Card>

      <Card className="p-6 mb-8 shadow-md">
        <h2 className="text-2xl font-bold mb-4 flex items-center text-primary">
          <ArrowRight className="mr-2 h-6 w-6" />
          User Guide
        </h2>
        <ol className="list-decimal pl-6 space-y-4">
          <li className="p-4 bg-muted rounded-md shadow-sm">
            <p className="font-semibold flex items-center">
              <FileUp className="mr-2 h-5 w-5 text-primary" />
              Upload Data
            </p>
            <p className="mt-1 text-muted-foreground">
              Use the file upload section to import your XRD data files. Supported formats: CSV, TXT, DAT.
            </p>
          </li>
          <li className="p-4 bg-muted rounded-md shadow-sm">
            <p className="font-semibold flex items-center">
              <BarChart className="mr-2 h-5 w-5 text-primary" />
              Plot Visualization
            </p>
            <p className="mt-1 text-muted-foreground">
              Uploaded data will be plotted interactively. Zoom, pan, and hover for details.
            </p>
          </li>
          <li className="p-4 bg-muted rounded-md shadow-sm">
            <p className="font-semibold">Processing Tools</p>
            <p className="mt-1 text-muted-foreground">
              Apply background subtraction, smoothing, normalization, and baseline correction using the controls provided.
            </p>
          </li>
          <li className="p-4 bg-muted rounded-md shadow-sm">
            <p className="font-semibold flex items-center">
              <Zap className="mr-2 h-5 w-5 text-primary" />
              Peak Detection
            </p>
            <p className="mt-1 text-muted-foreground">
              Detect peaks with adjustable sensitivity. Peaks will be marked on the plot.
            </p>
          </li>
          <li className="p-4 bg-muted rounded-md shadow-sm">
            <p className="font-semibold">Phase Identification</p>
            <p className="mt-1 text-muted-foreground">
              (Optional) Upload a reference pattern for phase identification or use the built-in simple matcher.
            </p>
          </li>
          <li className="p-4 bg-muted rounded-md shadow-sm">
            <p className="font-semibold flex items-center">
              <Download className="mr-2 h-5 w-5 text-primary" />
              Export
            </p>
            <p className="mt-1 text-muted-foreground">
              Download processed data as CSV or the plot as PNG.
            </p>
          </li>
        </ol>
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <Card className="p-6 shadow-md">
          <h2 className="text-2xl font-bold mb-4 text-primary">Features</h2>
          <ul className="list-disc pl-6 space-y-2">
            <li className="text-muted-foreground">Interactive XRD plotting (Plotly.js)</li>
            <li className="text-muted-foreground">Data processing: background subtraction, smoothing, normalization, baseline correction</li>
            <li className="text-muted-foreground">Peak detection with adjustable sensitivity</li>
            <li className="text-muted-foreground">Phase identification (simple or user-uploaded reference)</li>
            <li className="text-muted-foreground">Export options: CSV, PNG</li>
            <li className="text-muted-foreground">Responsive, user-friendly interface</li>
          </ul>
        </Card>

        <Card className="p-6 shadow-md">
          <h2 className="text-2xl font-bold mb-4 flex items-center text-primary">
            <GitBranch className="mr-2 h-6 w-6" />
            Contact & Feedback
          </h2>
          <p className="mb-4 text-muted-foreground">
            For questions, feedback, or bug reports, please visit the GitHub repository or contact me via email.
          </p>
          <div className="flex flex-col gap-2">
            <a 
              href="https://github.com/jovenpaoloangeles/xrd-analyzer/"
              className="inline-block px-4 py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90 transition-colors"
              target="_blank"
              rel="noopener noreferrer"
            >
              GitHub Repository
            </a>
            <a 
              href="mailto:jovenpaoloangeles@gmail.com"
              className="inline-block px-4 py-2 bg-secondary text-secondary-foreground rounded-md hover:bg-secondary/90 transition-colors"
            >
              jovenpaoloangeles@gmail.com
            </a>
          </div>
        </Card>
      </div>
    </div>
  </div>
);

export default About;
