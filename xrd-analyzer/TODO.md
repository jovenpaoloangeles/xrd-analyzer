# XRD Analyzer Webapp – Detailed TODO Checklist

## Project Setup
- [ ] Confirm tech stack: React + TypeScript, Plotly.js, shadcn, gh-pages
- [ ] Initialize project structure (`src/components`, `src/utils`, etc.)
- [ ] Install dependencies:
  - [ ] React, React-DOM, TypeScript
  - [ ] Plotly.js and react-plotly.js
  - [x] shadcn (UI components modernized)
  - [x] react-dropzone (for file uploads, drag-and-drop enabled)
  - [ ] gh-pages (for deployment)
  - [ ] Utility libraries (e.g., papaparse, lodash)
- [ ] Configure TypeScript (tsconfig.json)
- [ ] Set up GitHub repository and Pages branch

## UI/UX & Theming
- [x] Modernize UI with shadcn/ui and Tailwind CSS
- [x] Migrate charting to Plotly.js (Chart.js replaced)
- [x] Implement responsive layout (mobile & desktop)
- [x] Create Navbar:
  - [x] App name/logo
  - [x] Navigation links (Home, Help, etc.)
- [x] Add global error & notification system
- [x] Collapsible Data Input section after upload
- [x] Progressive disclosure for advanced settings (accordion)
- [x] Combine section headers and toggles for Smoothing and Background Subtraction
- [x] Hide smoothing/background options when disabled

> Chart and controls are now mobile-friendly and visually cohesive across devices.

## File Upload & Data Parsing
- [ ] Create FileUpload component:
  - [ ] Support drag-and-drop and button upload
  - [ ] Accept CSV, TXT, DAT formats
  - [ ] Show file info and upload status
- [ ] Parse uploaded files:
  - [ ] Validate file format and data integrity
  - [ ] Handle parsing errors gracefully
  - [ ] Store parsed data in state

## XRD Plot Rendering
- [x] Integrate Plotly.js via react-plotly.js
- [x] Render XRD pattern (2θ vs intensity)
- [x] Add interactive features:
  - [x] Zoom, pan
  - [ ] Tooltips
  - [ ] Legend
- [ ] Apply Google colors to plot traces and UI

## Data Processing Tools
- [ ] Background subtraction:
  - [ ] UI controls for parameters
  - [ ] Algorithm implementation
- [ ] Smoothing (e.g., Savitzky-Golay):
  - [ ] UI controls for window size, polynomial order
  - [ ] Algorithm implementation
- [ ] Normalization:
  - [ ] Option to normalize intensity
- [ ] Baseline correction:
  - [ ] UI controls for baseline method
  - [ ] Algorithm implementation
- [ ] Show before/after comparison

## Peak Detection
- [ ] Implement peak detection algorithm
- [ ] UI slider/control for sensitivity/threshold
- [ ] Highlight detected peaks on plot
- [ ] List peak positions and intensities

## Phase Identification
- [ ] Allow user to upload reference pattern
- [ ] Simple pattern matching (optional)
- [ ] Show matches on plot

## Export Features
- [x] Add export features (CSV, PNG).
  - Plotly chart has built-in PNG export via toolbar
  - CSV export button downloads visible datasets
- [ ] UI buttons for export actions

## Help & Documentation
- [ ] Implement Help/User Guide page/section
- [ ] Provide sample/demo data for testing
- [ ] Add tooltips and inline help

## Testing & QA
- [ ] Test with various sample files (CSV, TXT, DAT)
- [ ] Validate error handling (invalid files, edge cases)
- [ ] Test on different devices/screen sizes

## Deployment
- [ ] Configure gh-pages deployment in package.json
- [ ] Add deploy script
- [ ] Deploy to GitHub Pages
- [ ] Verify live site and fix issues

## Final Polish
- [ ] Review and refine UI for consistency
- [ ] Optimize performance (large files, rendering)
- [ ] Update README with usage instructions

---

**Legend:**
- [ ] Not started
- [x] Completed

---

Feel free to check off items as you progress!
