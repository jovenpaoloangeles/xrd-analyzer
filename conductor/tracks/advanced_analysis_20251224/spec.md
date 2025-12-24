# Specification: Base UI Migration & Advanced XRD Analysis

## Overview
This track combines a major technical refactor with significant functional enhancements. It aims to modernize the UI foundation by migrating to shadcn Base UI while simultaneously delivering advanced analysis capabilities: basic Rietveld refinement for quantitative analysis and multi-pattern comparison tools.

## User Stories
- **UI Modernization:** As a developer, I want to migrate to shadcn Base UI for better performance and accessibility.
- **Rietveld Refinement:** As a researcher, I want to upload a crystal structure file (CIF) and refine its parameters (scale, lattice, atomic positions) against my experimental data to verify the material's structure.
- **Pattern Comparison:** As a researcher, I want to overlay or stack multiple XRD patterns to compare samples and identify trends.

## Functional Requirements

### 1. Base UI Migration (Technical Debt/Refactor)
- **Scope:** All components currently using `@radix-ui/*` (Dialog, Dropdown, Tooltip, Checkbox, Slider, Tabs).
- **Strategy:** Incremental replacement with Base UI equivalents.
- **Goal:** Parity in visual design with improved accessibility and internal styling API.

### 2. Multiple Pattern Comparison
- **Visualization:** Update `XRDChartPlotly.tsx` to support two modes:
    - **Overlay:** All patterns share the same Y-axis zero point (different colors).
    - **Waterfall:** Patterns are stacked vertically with a user-adjustable Y-offset.
- **Controls:** Add UI controls to toggle between Overlay and Waterfall modes and adjust the offset value.

### 3. Rietveld Refinement (Advanced Analysis)
- **Input:** Allow uploading of `.cif` (Crystallographic Information File) files.
- **Engine:** Implement a solver (likely using `ml-levenberg-marquardt`) to minimize the difference between observed and calculated intensities.
- **Parameters:**
    - **Basic:** Scale factor, Lattice parameters (a, b, c, alpha, beta, gamma).
    - **Advanced:** Atomic positions (x, y, z) and thermal parameters (B).
- **Output:**
    - Visual overlay of the calculated profile on the experimental data.
    - Difference plot (Observed - Calculated).
    - Refined parameter values and goodness-of-fit metrics (R_wp).

## Non-Functional Requirements
- **Performance:** Rietveld refinement is computationally intensive. It should run in a web worker to avoid freezing the UI.
- **Stability:** UI migration must not break existing workflows (Data Input, Peak Detection).
- **Dependencies:** May require a CIF parser library (e.g., `cif-parser` or similar).

## Out of Scope
- Full multi-phase quantitative analysis (refining multiple phases simultaneously).
