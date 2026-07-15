# OOD Evaluation Module Design

## Goal

Separate the out-of-distribution (OOD) evaluation from the cross-dataset experiments so that OOD quantitative and qualitative evidence are read together.

## Layout

1. **Cross-Dataset Generalization** remains first and its carousel contains NAFNet, Restormer, and EVSSM only.
2. A new **Out-of-Distribution Evaluation** card follows it. It contains the existing OOD no-reference table and the OOD visual comparison (`nr-metric.png`) in a vertical reading order.
3. **Qualitative Results** remains after the OOD card but contains the cross-dataset and supplementary visual comparisons only.
4. **BPR Ablation** and all preceding/following content remain unchanged.

## Behavior and Accessibility

- The new OOD table is rendered as a fixed table rather than a carousel slide.
- Existing carousel controls continue to work for the remaining cross-dataset tables and qualitative images.
- The OOD card receives an explicit heading, descriptive copy, table caption, and image alt text.

## Verification

- Add a content test that requires the standalone OOD mount and requires the OOD slide to be excluded from the cross-dataset carousel.
- Run the page, carousel, asset, and sample-comparison test suites.
