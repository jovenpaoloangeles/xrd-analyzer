# Plan: Core Data Processing and Analysis Features

This plan outlines the steps to implement background subtraction, smoothing, and peak detection.

## Phase 1: Foundational Processing Utilities [checkpoint: 926ccef]
- [x] Task: Implement background subtraction utility function. a6fd1e4
- [x] Task: Implement Savitzky-Golay smoothing utility function. d3510d7
- [x] Task: Write unit tests for background subtraction and smoothing logic. d3510d7
- [x] Task: Conductor - User Manual Verification 'Foundational Processing Utilities' (Protocol in workflow.md)

## Phase 2: UI Integration for Smoothing and Background
- [ ] Task: Create UI controls in `ProcessingControls.tsx` for smoothing parameters (window size, order).
- [ ] Task: Create UI controls in `ProcessingControls.tsx` for background subtraction parameters.
- [ ] Task: Connect processing utilities to the main state in `App.tsx`.
- [ ] Task: Ensure the `XRDChartPlotly.tsx` correctly displays processed vs. raw data.
- [ ] Task: Conductor - User Manual Verification 'UI Integration for Smoothing and Background' (Protocol in workflow.md)

## Phase 3: Peak Detection Implementation
- [ ] Task: Implement peak detection algorithm in `peakMatching.ts` or a new utility.
- [ ] Task: Create UI controls for peak detection sensitivity.
- [ ] Task: Update `XRDChartPlotly.tsx` to render markers/annotations for detected peaks.
- [ ] Task: Conductor - User Manual Verification 'Peak Detection Implementation' (Protocol in workflow.md)
