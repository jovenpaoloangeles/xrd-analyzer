# Specification: Core Data Processing and Analysis Features

## Overview
This track implements the primary scientific processing capabilities of the XRD Analyzer. It bridges the gap between raw data visualization and meaningful material analysis by providing tools to clean data and identify key diffraction peaks.

## User Stories
- As a researcher, I want to subtract the background from my XRD pattern so that I can see the diffraction peaks more clearly.
- As a researcher, I want to apply smoothing (Savitzky-Golay) to my data to reduce noise without losing peak intensity.
- As a researcher, I want the system to automatically detect peaks so that I can quickly identify the 2θ positions of my sample's phases.

## Functional Requirements
### 1. Background Subtraction
- Implement an algorithm (e.g., polynomial fit or rolling ball) to estimate and subtract the baseline.
- Provide UI controls to toggle background subtraction and adjust its parameters.

### 2. Savitzky-Golay Smoothing
- Integrate the `ml-savitzky-golay` library.
- Provide UI controls for window size and polynomial order.
- Ensure the plot updates in real-time or upon confirmation.

### 3. Peak Detection
- Implement a peak finding algorithm based on local maxima and thresholding.
- Allow users to adjust peak detection sensitivity.
- Visually mark detected peaks on the Plotly chart with markers and labels.

## Technical Constraints
- Must use existing mathematical libraries (`ml-matrix`, `ml-savitzky-golay`).
- Chart updates must remain performant for large datasets.
- UI components must follow the established `shadcn/ui` and `Tailwind CSS` patterns.
