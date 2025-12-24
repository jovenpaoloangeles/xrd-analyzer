# Plan: Base UI Migration & Advanced XRD Analysis

This plan outlines the steps for migrating to shadcn Base UI and implementing advanced XRD features (Multi-pattern comparison and Rietveld refinement).

## Phase 1: Infrastructure & Base UI Migration [checkpoint: 0acf35a]
- [x] Task: Install shadcn Base UI and necessary dependencies. b59356b
- [x] Task: Migrate `Tooltip` components from Radix to Base UI. 03c2dbc
- [x] Task: Migrate `Checkbox` and `Dropdown` components to Base UI. ab8f8d0
- [x] Task: Migrate `Dialog` (if any) and `Tabs` to Base UI. (Verified none present)
- [x] Task: Verify UI consistency and accessibility after migration.
- [x] Task: Conductor - User Manual Verification 'Infrastructure & Base UI Migration' (Protocol in workflow.md)

## Phase 2: Multiple Pattern Comparison (Visualization) [checkpoint: 5a6966f]
- [x] Task: Update `types.ts` to support multi-dataset display settings (offset, mode). 96d9d49
- [x] Task: Implement 'Overlay' vs 'Waterfall' logic in `XRDChartPlotly.tsx`. 637251f
- [x] Task: Add UI controls for Comparison Mode and Y-Offset in `ProcessingControls.tsx`. 92027c4
- [x] Task: Write tests for data offset calculation logic. 2993883
- [x] Task: Conductor - User Manual Verification 'Multiple Pattern Comparison' (Protocol in workflow.md)

## Phase 3: Rietveld Refinement - Data & Solver Setup [checkpoint: 3e1aee4]
- [x] Task: Implement CIF file upload and parsing utility. 305ee10
- [x] Task: Create a Web Worker to handle the computation-heavy refinement solver. 166b53a
- [x] Task: Implement the calculation engine for XRD profiles based on CIF parameters (Atomic Scattering Factors, Lorentz-Polarization). 60ecfbc
- [x] Task: Write unit tests for the XRD profile calculation engine. 60ecfbc
- [x] Task: Conductor - User Manual Verification 'Rietveld Refinement - Data & Solver Setup' (Protocol in workflow.md)

## Phase 4: Rietveld Refinement - Implementation & UI
- [x] Task: Implement the refinement solver using `ml-levenberg-marquardt` (Lattice, Scale, Atomic Positions). f86075d
- [x] Task: Add UI for refinement configuration (selecting parameters to refine). 7650149
- [ ] Task: Update `XRDChartPlotly.tsx` to display calculated profile and difference plot.
- [ ] Task: Write integration tests for the full refinement flow.
- [ ] Task: Conductor - User Manual Verification 'Rietveld Refinement - Implementation & UI' (Protocol in workflow.md)
