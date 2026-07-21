<div align="center">

# GS-RealBlur: A Flexible Data Acquisition Framework for Real-World Image Deblurring

Mingyang Chen, Zhilu Zhang, Honglei Xu, Renlong Wu, Xiaohe Wu, Wangmeng Zuo<br>
Harbin Institute of Technology, Harbin, China

[![Project Page](https://img.shields.io/badge/Project%20Page-1f2a44?style=for-the-badge)](https://youngmchan.github.io/GS-RealBlur/)
[![Paper](https://img.shields.io/badge/Paper%20(PDF)-1f2a44?style=for-the-badge)](https://youngmchan.github.io/GS-RealBlur/assets/paper/GS-RealBlur.pdf)
[![arXiv](https://img.shields.io/badge/arXiv-2607.15401-b31b1b?style=for-the-badge)](https://arxiv.org/abs/2607.15401)

</div>

## Abstract

High-quality, large-scale paired data is essential for training learning-based image deblurring models. However, synthetic blurry images generally lack realism, while real-world captured images require complex and inflexible camera systems. In this work, we propose GS-RealBlur, a data acquisition framework for real-world image deblurring, achieving both blur realism and acquisition flexibility. Specifically, we use a handheld camera to capture blurry images, and deploy a gimbal to densely capture sharp images of the same scene. We reconstruct the 3D representation of sharp images and calibrate the camera pose of each blurry frame within this 3D. The image rendered from this 3D according to the pose serves as the sharp counterpart. To better align the rendered image with the blurry image, we introduce a Blur-aware Pose Refinement (BPR) module that refines the pose using appearance consistency and centroid alignment constraints. Leveraging GS-RealBlur, we construct a high-quality and diverse dataset. Extensive experiments demonstrate that a deblurring model trained on our dataset achieves superior generalization performance across various real-world deblurring benchmarks.

## What Makes GS-RealBlur Different?

Existing paired-data pipelines trade blur realism against acquisition flexibility. Robot-arm and beam-splitter systems capture real blur but depend on specialized, non-portable hardware, while synthetic pipelines do not directly reproduce physical blur formation. GS-RealBlur captures real blur with portable consumer devices and uses 3D Gaussian Splatting to render spatially aligned sharp supervision.

![Comparison of existing paired-data acquisition pipelines and GS-RealBlur](https://youngmchan.github.io/GS-RealBlur/assets/images/real-world-blur.png)

## Method Overview

GS-RealBlur densely captures sharp-view videos with a gimbal for 3DGS reconstruction, then captures real-world blurry images in handheld mode. GLOMAP provides the initial blurry-frame pose, while Blur-aware Pose Refinement jointly uses appearance consistency and blur-kernel centroid alignment to obtain an aligned sharp rendering.

![GS-RealBlur capture, reconstruction, and Blur-aware Pose Refinement pipeline](https://youngmchan.github.io/GS-RealBlur/assets/images/pipeline.png)

## Experiments

Models trained on existing datasets degrade substantially when evaluated on other real-world benchmarks. In contrast, GS-RealBlur provides strong cross-dataset generalization and robust perceptual quality on in-the-wild OOD benchmarks. The interactive [project page](https://youngmchan.github.io/GS-RealBlur/) contains all quantitative tables; representative visual comparisons are shown below.

### Cross-Dataset Generalization

![Cross-dataset qualitative comparison](https://youngmchan.github.io/GS-RealBlur/assets/images/more-metric-visual.png)

### Out-of-Distribution Evaluation

![OOD visual comparison](https://youngmchan.github.io/GS-RealBlur/assets/images/nr-metric.png)

### BPR Ablation

Blur weakens feature matching and makes SfM pose estimates unreliable. BPR refines inaccurate poses using learnable rotation and translation offsets optimized by appearance consistency and blur-kernel centroid alignment.

![Alignment improvement from Blur-aware Pose Refinement](https://youngmchan.github.io/GS-RealBlur/assets/images/BPR_compare.png)

## Dataset Patch Samples

The dataset contains aligned blurry--sharp patch pairs from diverse real-world scenes. Visit the [interactive project page](https://youngmchan.github.io/GS-RealBlur/#dataset-samples) to drag the divider and compare each blurry observation with its aligned ground truth.

## Open-Source Release

The dataset and source code will be publicly released. Please watch this repository for updates.

## Links

- [Project Page](https://youngmchan.github.io/GS-RealBlur/)
- [Paper (PDF)](https://youngmchan.github.io/GS-RealBlur/assets/paper/GS-RealBlur.pdf)
- [arXiv](https://arxiv.org/abs/2607.15401)
