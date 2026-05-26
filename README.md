<div align="center">

# 😎 Generative AI Meets 6G and Beyond:<br>Diffusion Models for Semantic Communications

[![Awesome](https://awesome.re/badge.svg)](https://awesome.re)
[![arXiv](https://img.shields.io/badge/arXiv-2511.08416-b31b1b.svg)](https://arxiv.org/abs/2511.08416) 
[![IEEE](https://img.shields.io/badge/IEEE-COMST-blue.svg)](https://ieeexplore.ieee.org/document/11506355)
[![Project Page](https://img.shields.io/badge/Project-Page-green.svg)](https://qin-jingyun.github.io/Awesome-DiffComm)
[![Stars](https://img.shields.io/github/stars/qin-jingyun/Awesome-DiffComm?style=social&logo=github)](https://github.com/qin-jingyun/Awesome-DiffComm)

[![License](https://img.shields.io/badge/License-MIT-yellowgreen.svg)](LICENSE)
[![Visitors](https://komarev.com/ghpvc/?username=qin-jingyun&repo=Awesome-DiffComm&label=Hello,%20Visitor%20&color=yellow&style=social)](https://github.com/qin-jingyun/Awesome-DiffComm)
[![Pull Request](https://img.shields.io/badge/Pull%20Request-Contribute-orange.svg?style=flat)](https://github.com/qin-jingyun/Awesome-DiffComm/pulls)
[![Email](https://img.shields.io/badge/Contact-Email-red.svg)](mailto:hailong.qin@bupt.edu.cn)

<!-- ⁰ ¹ ² ³ ⁴ ⁵ ⁶ ⁷ ⁸ ⁹ -->

[Hai-Long Qin](https://scholar.google.com/citations?user=N33wbdEAAAAJ)¹, [Jincheng Dai](https://scholar.google.com/citations?user=0I_YtFsAAAAJ)¹, [Guo Lu](https://guolusjtu.github.io/guoluhomepage)², [Shuo Shao](https://ieeexplore.ieee.org/author/37086424888)³, [Sixian Wang](https://scholar.google.com/citations?user=f9s8H6UAAAAJ)², [Tongda Xu](https://tongdaxu.github.io)⁴,  
[Wenjun Zhang](https://ieeexplore.ieee.org/author/37278428800)², [Ping Zhang](https://ieeexplore.ieee.org/author/37274503400)¹, [Khaled B. Letaief](https://scholar.google.com/citations?user=6WLhtHgAAAAJ)⁵

¹ Beijing University of Posts and Telecommunications (BUPT)  
² Shanghai Jiao Tong University (SJTU)  
³ East China Normal University (ECNU)  
⁴ Tsinghua University (THU)  
⁵ Hong Kong University of Science and Technology (HKUST)  
<!-- † Corresponding Author -->

</div>

<div align="justify">

> &emsp;**This repository accompanies our IEEE COMST tutorial paper, serving as a living resource for researchers at the intersection of generative AI and wireless (semantic) communications**. As semantic communications emerge as a paradigm shift from bit-accurate transmission toward meaning-centric communication, diffusion models have become a cornerstone technology enabling receivers to reconstruct high-quality content from minimal semantic cues. This repository provides curated collections of representative works, popular implementations, educational resources, and practical guidelines to help researchers continuously acquire knowledge in this rapidly evolving interdisciplinary field.

</div>

---
<p align="center">
  <img src="./images/teaser.svg" alt="Teaser" style="max-width: 100%; height: auto;">
</p>

<div align="justify">

## 📋 TL;DR

**What is this article about?**  
To the best of our knowledge, this is the first tutorial paper on diffusion models for generative semantic communications. It provides a unified resource for researchers to efficiently begin their work in this interdisciplinary area, without separately navigating scattered literatures across generative AI and wireless communications.
- 🎯**Mathematical Fundamentals**: From score matching and Langevin dynamics to stochastic differential equations (SDEs) and probability flow ordinary differential equations (PF ODEs), we present the theoretical foundations of score-based diffusion models.
- 🎨 **Conditioning Mechanisms**: We examine how to steer diffusion models toward task-specific objectives through two complementary paradigms — *inference-time conditioning* that injects guidance during sampling while preserving pre-trained models, and *training-time conditioning* that jointly optimizes conditional and unconditional scores for tighter control, meeting the fundamental controllability requirement in semantic communications.
- ⚡ **Sampling Acceleration**: Recognizing that iterative sampling (often requiring hundreds to thousands of neural network evaluations) presents significant computational challenges for real-time deployment, we review five primary acceleration strategies: dimensionality reduction, knowledge distillation, structure pruning, cache reuse, and flow matching.
- 🔬 **Task Generalization**: We explore how diffusion models, initially conceived for specific data modalities and domains, can be extended across diverse scenarios through three fundamental aspects — *modality expansion*, *domain adaptation*, and *task generalization*, which addresses the requirements of task-specific multi-modal semantic communications.
- 📡 **Application Scenarios**: Through analysis of three distinct use cases, we illustrate how diffusion models enable extreme compression while maintaining semantic fidelity:
  - *Fidelity-oriented human semantic communications* balancing consistency-realism trade-offs for perceptually realistic reconstruction
  - *Task-specific machine semantic communications* optimizing effectiveness-efficiency trade-offs for downstream task execution under bandwidth constraints  
  - *Intent-driven agent semantic communications* managing centralization-distribution trade-offs for multi-agent coordination through shared probabilistic representations

**Why is this article needed?**  
As wireless systems approach Shannon capacity limits, semantic communications represent a paradigm shift from bit-accurate transmission toward meaning-centric communication. The emergence of diffusion models as powerful generative priors has catalyzed generative semantic communications, where receivers reconstruct high-quality content from minimal semantic cues. However, the field currently lacks systematic guidance connecting diffusion model techniques to semantic communication system design. This article fills that critical gap by:
- **Eliminating barriers** between machine learning and communication communities
- **Providing depth** beyond existing surveys and magazines through rigorous mathematical treatment and implementation details
- **Establishing connections** via an inverse problem perspective that reformulates semantic decoding as posterior inference
- **Offering practical resources** including open-source implementations, and deployment guidelines

**Who should read this?**  
We believe this article may be helpful to the following groups of people:
- Researchers in semantic communications seeking to leverage diffusion models
- Machine learning practitioners interested in wireless communication applications  
- Graduate students entering the interdisciplinary field of AI-native wireless networks
- Engineers designing next-generation communication systems with semantic awareness

</div>

## 📇 Table of Contents

- [😎 Generative AI Meets 6G and Beyond:Diffusion Models for Semantic Communications](#-generative-ai-meets-6g-and-beyonddiffusion-models-for-semantic-communications)
  - [📋 TL;DR](#-tldr)
  - [📇 Table of Contents](#-table-of-contents)
  - [🎓 Fundamentals of Diffusion Models](#-fundamentals-of-diffusion-models)
    - [Mathematical Foundations](#mathematical-foundations)
    - [Foundational Papers](#foundational-papers)
  - [🎨 Conditional Diffusion Models](#-conditional-diffusion-models)
    - [Inference-Time Conditional Diffusion Models](#inference-time-conditional-diffusion-models)
    - [Training-Time Conditional Diffusion Models](#training-time-conditional-diffusion-models)
  - [⚡ Efficient Diffusion Models](#-efficient-diffusion-models)
    - [Dimensionality Reduction](#dimensionality-reduction)
    - [Knowledge Distillation](#knowledge-distillation)
    - [Structure Pruning](#structure-pruning)
    - [Cache Reuse](#cache-reuse)
    - [Flow Matching](#flow-matching)
  - [🌐 Generalized Diffusion Models](#-generalized-diffusion-models)
    - [Modality Expansion](#modality-expansion)
    - [Domain Adaptation](#domain-adaptation)
    - [Task Generalization](#task-generalization)
  - [🛜 Diffusion Models for Semantic Communications](#-diffusion-models-for-semantic-communications)
    - [\[Preliminary\] Diffusion Models for Data Compression](#preliminary-diffusion-models-for-data-compression)
    - [Fidelity-Oriented Human Semantic Communications](#fidelity-oriented-human-semantic-communications)
    - [Task-Specific Machine Semantic Communications](#task-specific-machine-semantic-communications)
    - [Intent-Driven Agent Semantic Communications](#intent-driven-agent-semantic-communications)
  - [📊 Benchmarks and Datasets](#-benchmarks-and-datasets)
    - [Benchmarks](#benchmarks)
      - [Text-to-Image Benchmarks](#text-to-image-benchmarks)
      - [Video Generation Benchmarks](#video-generation-benchmarks)
    - [Datasets](#datasets)
      - [Audio](#audio)
      - [Image](#image)
      - [Video](#video)
      - [Volume (3D/4D)](#volume-3d4d)
      - [Domain-Specific](#domain-specific)
  - [📏 Evaluation Metrics](#-evaluation-metrics)
    - [Perception Metrics](#perception-metrics)
      - [Full-Reference Metrics](#full-reference-metrics)
      - [Reduced-Reference Metrics](#reduced-reference-metrics)
      - [No-Reference Metrics](#no-reference-metrics)
    - [Semantic Metrics](#semantic-metrics)
  - [🔗 Other Resources](#-other-resources)
    - [📚 Comprehensive Books, Surveys \& Tutorials](#-comprehensive-books-surveys--tutorials)
      - [Diffusion Models](#diffusion-models)
      - [Semantic Communications](#semantic-communications)
    - [📺 Courses \& Video Lectures](#-courses--video-lectures)
    - [🧰 Interactive Demos \& Tools](#-interactive-demos--tools)
  - [📝 Citation](#-citation)
  - [🌟 Acknowledgments](#-acknowledgments)

## 🎓 Fundamentals of Diffusion Models

### Mathematical Foundations

Mathematical concepts underlying diffusion models.

| # | Concept | Reference | Description | Links |
|---|---------|-----------|-------------|-------|
| 1 | **Score Matching** | [Estimation of Non-Normalized Statistical Models](https://www.jmlr.org/papers/volume6/hyvarinen05a/hyvarinen05a.pdf) (Hyvärinen, JMLR 2005) | Foundation for learning score functions without computing partition functions | [![Paper](https://img.shields.io/badge/Paper-PDF-red)](https://www.jmlr.org/papers/volume6/hyvarinen05a/hyvarinen05a.pdf) |
| 2 | **Denoising Score Matching** | [A Connection Between Score Matching and Denoising Autoencoders](https://www.iro.umontreal.ca/~vincentp/Publications/smdae_techreport.pdf) (Vincent, Neural Computation 2011) | Equivalence between score matching and denoising | [![Paper](https://img.shields.io/badge/Paper-PDF-red)](https://www.iro.umontreal.ca/~vincentp/Publications/smdae_techreport.pdf) |
| 3 | **Langevin Dynamics** | [Bayesian Learning via Stochastic Gradient Langevin Dynamics](https://www.stats.ox.ac.uk/~teh/research/compstats/WelTeh2011a.pdf) (Welling & Teh, ICML 2011) | MCMC sampling using gradient information | [![Paper](https://img.shields.io/badge/Paper-PDF-red)](https://www.stats.ox.ac.uk/~teh/research/compstats/WelTeh2011a.pdf) |
| 4 | **Tweedie's Formula** | [Tweedie's Formula and Selection Bias](https://efron.ckirby.su.domains/papers/2011TweediesFormula.pdf) (Efron, JASA 1992) | Posterior mean estimation from corrupted observations | [![Paper](https://img.shields.io/badge/Paper-PDF-red)](https://efron.ckirby.su.domains/papers/2011TweediesFormula.pdf) |
| 5 | **Neural ODEs** | [Neural Ordinary Differential Equations](https://arxiv.org/abs/1806.07366) (Chen et al., NeurIPS 2018) | Continuous-depth neural networks and invertible transformations | [![arXiv](https://img.shields.io/badge/arXiv-1806.07366-b31b1b)](https://arxiv.org/abs/1806.07366) [![GitHub](https://img.shields.io/github/stars/rtqichen/torchdiffeq?style=social)](https://github.com/rtqichen/torchdiffeq) |
| 6 | **Flow Matching** | [Flow Matching for Generative Modeling](https://arxiv.org/abs/2210.02747) (Lipman et al., ICLR 2023) | Continuous normalizing flows via regression | [![arXiv](https://img.shields.io/badge/arXiv-2210.02747-b31b1b)](https://arxiv.org/abs/2210.02747) [![GitHub](https://img.shields.io/github/stars/facebookresearch/flow_matching?style=social)](https://github.com/facebookresearch/flow_matching) |

### Foundational Papers

Seminal works establishing the theoretical and practical foundations of diffusion models.

| # | Method | Venue | Key Contribution | Links |
|---|--------|-------|------------------|-------|
| 1 | **Deep Unsupervised Learning using Nonequilibrium Thermodynamics** | ICML'15 | First diffusion model using thermodynamic principles | [![arXiv](https://img.shields.io/badge/arXiv-1503.03585-b31b1b)](https://arxiv.org/abs/1503.03585) [![GitHub](https://img.shields.io/github/stars/Sohl-Dickstein/Diffusion-Probabilistic-Models?style=social)](https://github.com/Sohl-Dickstein/Diffusion-Probabilistic-Models) |
| 2 | **NCSN** - Generative Modeling by Estimating Gradients | NeurIPS'19 | Score matching with Langevin dynamics (SMLD) | [![arXiv](https://img.shields.io/badge/arXiv-1907.05600-b31b1b)](https://arxiv.org/abs/1907.05600) [![GitHub](https://img.shields.io/github/stars/ermongroup/ncsn?style=social)](https://github.com/ermongroup/ncsn) |
| 3 | **DDPM** - Denoising Diffusion Probabilistic Models | NeurIPS'20 | Simplified training objective and high-quality generation | [![arXiv](https://img.shields.io/badge/arXiv-2006.11239-b31b1b)](https://arxiv.org/abs/2006.11239) [![GitHub](https://img.shields.io/github/stars/hojonathanho/diffusion?style=social)](https://github.com/hojonathanho/diffusion) [![Website](https://img.shields.io/badge/Project-Page-green)](https://hojonathanho.github.io/diffusion/) |
| 4 | **DDIM** - Denoising Diffusion Implicit Models | ICLR'21 | Non-Markovian sampling for accelerated generation | [![arXiv](https://img.shields.io/badge/arXiv-2010.02502-b31b1b)](https://arxiv.org/abs/2010.02502) [![GitHub](https://img.shields.io/github/stars/ermongroup/ddim?style=social)](https://github.com/ermongroup/ddim) |
| 5 | **Score SDE** - Score-Based Generative Modeling through SDEs | ICLR'21 | Unified SDE framework connecting score matching and diffusion | [![arXiv](https://img.shields.io/badge/arXiv-2011.13456-b31b1b)](https://arxiv.org/abs/2011.13456) [![GitHub](https://img.shields.io/github/stars/yang-song/score_sde?style=social)](https://github.com/yang-song/score_sde) |
| 6 | **LDM** - High-Resolution Image Synthesis with Latent Diffusion Models | CVPR'22 | Diffusion in learned latent spaces (Stable Diffusion) | [![arXiv](https://img.shields.io/badge/arXiv-2112.10752-b31b1b)](https://arxiv.org/abs/2112.10752) [![GitHub](https://img.shields.io/github/stars/CompVis/latent-diffusion?style=social)](https://github.com/CompVis/latent-diffusion) [![HF](https://img.shields.io/badge/🤗-Models-yellow)](https://huggingface.co/CompVis) |

## 🎨 Conditional Diffusion Models

Conditional diffusion models enable controlled generation by incorporating external guidance. This section covers two main categories based on when conditioning is applied.

### Inference-Time Conditional Diffusion Models

These methods introduce guidance during sampling without modifying the pre-trained model.

| # | Method | Venue | Description | Links |
|---|--------|-------|-------------|-------|
| 1 | **CG** - Classifier Guidance | NeurIPS'21 | Adds classifier gradients to steer generation | [![arXiv](https://img.shields.io/badge/arXiv-2105.05233-b31b1b)](https://arxiv.org/abs/2105.05233) [![GitHub](https://img.shields.io/github/stars/openai/guided-diffusion?style=social)](https://github.com/openai/guided-diffusion) |
| 2 | **ILVR** | ICCV'21 | Iterative refinement toward a reference image | [![arXiv](https://img.shields.io/badge/arXiv-2108.02938-b31b1b)](https://arxiv.org/abs/2108.02938) [![GitHub](https://img.shields.io/github/stars/jychoi118/ilvr_adm?style=social)](https://github.com/jychoi118/ilvr_adm) |
| 3 | **SDEdit** | ICLR'22 | Structure-preserving editing via controlled denoising | [![arXiv](https://img.shields.io/badge/arXiv-2108.01073-b31b1b)](https://arxiv.org/abs/2108.01073) [![GitHub](https://img.shields.io/github/stars/ermongroup/SDEdit?style=social)](https://github.com/ermongroup/SDEdit) [![Website](https://img.shields.io/badge/Project-Page-green)](https://sde-image-editing.github.io) |
| 4 | **RePaint** | CVPR'22 | Inpainting by alternating denoising and re-noising | [![arXiv](https://img.shields.io/badge/arXiv-2201.09865-b31b1b)](https://arxiv.org/abs/2201.09865) [![GitHub](https://img.shields.io/github/stars/andreas128/RePaint?style=social)](https://github.com/andreas128/RePaint) |
| 5 | **Prompt-to-Prompt** | arXiv'22 | Cross-attention editing guided by text prompts | [![arXiv](https://img.shields.io/badge/arXiv-2208.01626-b31b1b)](https://arxiv.org/abs/2208.01626) [![GitHub](https://img.shields.io/github/stars/google/prompt-to-prompt?style=social)](https://github.com/google/prompt-to-prompt) [![Website](https://img.shields.io/badge/Project-Page-green)](https://prompt-to-prompt.github.io) |
| 6 | **DDRM** | NeurIPS'22 | Linear inverse problem solver using diffusion priors | [![arXiv](https://img.shields.io/badge/arXiv-2201.11793-b31b1b)](https://arxiv.org/abs/2201.11793) [![GitHub](https://img.shields.io/github/stars/bahjat-kawar/ddrm?style=social)](https://github.com/bahjat-kawar/ddrm) [![Website](https://img.shields.io/badge/Project-Page-green)](https://ddrm-ml.github.io/) |
| 7 | **MCG** | NeurIPS'22 | Adds manifold consistency during sampling | [![arXiv](https://img.shields.io/badge/arXiv-2206.00941-b31b1b)](https://arxiv.org/abs/2206.00941) [![GitHub](https://img.shields.io/github/stars/hyungjin-chung/MCG_diffusion?style=social)](https://github.com/hyungjin-chung/MCG_diffusion) |
| 8 | **DDNM** - Denoising Diffusion Null-space Model | ICLR'23 | Null-space projection for zero-shot restoration | [![arXiv](https://img.shields.io/badge/arXiv-2212.00490-b31b1b)](https://arxiv.org/abs/2212.00490) [![GitHub](https://img.shields.io/github/stars/wyhuai/DDNM?style=social)](https://github.com/wyhuai/DDNM) [![HF](https://img.shields.io/badge/🤗-Demo-yellow)](https://huggingface.co/spaces/hysts/DDNM-HQ) [![Website](https://img.shields.io/badge/Project-Page-green)](https://wyhuai.github.io/ddnm.io) |
| 9 | **DPS** - Diffusion Posterior Sampling | ICLR'23 | Posterior sampling with measurement guidance | [![arXiv](https://img.shields.io/badge/arXiv-2209.14687-b31b1b)](https://arxiv.org/abs/2209.14687) [![GitHub](https://img.shields.io/github/stars/DPS2022/diffusion-posterior-sampling?style=social)](https://github.com/DPS2022/diffusion-posterior-sampling) [![Website](https://img.shields.io/badge/Project-Page-green)](https://dps2022.github.io/diffusion-posterior-sampling-page/) |
| 10 | **πGDM** - Pseudoinverse-Guided DM | ICLR'23 | Pseudoinverse-based conditioning for inverse tasks | [![arXiv](https://img.shields.io/badge/arXiv-2303.08089-b31b1b)](https://arxiv.org/abs/2303.08089) [![Website](https://img.shields.io/badge/OpenReview-Link-blue)](https://openreview.net/forum?id=9_gsMA8MRKQ) [![GitHub](https://img.shields.io/github/stars/HatimRabet/PiGDM?style=social)](https://github.com/HatimRabet/PiGDM) |
| 11 | **Null-Text Inversion** | CVPR'23 | Real-image editing via null-text optimization | [![arXiv](https://img.shields.io/badge/arXiv-2211.09794-b31b1b)](https://arxiv.org/abs/2211.09794) [![GitHub](https://img.shields.io/github/stars/google/prompt-to-prompt?style=social)](https://github.com/google/prompt-to-prompt/#null-text-inversion-for-editing-real-images) [![Website](https://img.shields.io/badge/Project-Page-green)](https://null-text-inversion.github.io) |
| 12 | **BlindDPS** | CVPR'23 | Jointly samples unknown operator and clean signal | [![arXiv](https://img.shields.io/badge/arXiv-2211.10656-b31b1b)](https://arxiv.org/abs/2211.10656) [![GitHub](https://img.shields.io/github/stars/BlindDPS/blind-dps?style=social)](https://github.com/BlindDPS/blind-dps) |
| 13 | **DiffPIR** | CVPRW'23 | Plug-and-play restoration with diffusion priors | [![arXiv](https://img.shields.io/badge/arXiv-2305.08995-b31b1b)](https://arxiv.org/abs/2305.08995) [![GitHub](https://img.shields.io/github/stars/yuanzhi-zhu/DiffPIR?style=social)](https://github.com/yuanzhi-zhu/DiffPIR) |
| 14 | **DiffusionMBIR** | CVPR'23 | Uses 2D diffusion priors for 3D reconstruction | [![arXiv](https://img.shields.io/badge/arXiv-2211.10655-b31b1b)](https://arxiv.org/abs/2211.10655) [![GitHub](https://img.shields.io/github/stars/hyungjin-chung/DiffusionMBIR?style=social)](https://github.com/hyungjin-chung/DiffusionMBIR) |
| 15 | **FreeDoM** | ICCV'23 | Training-free diffusion adaptation for new tasks | [![arXiv](https://img.shields.io/badge/arXiv-2303.09833-b31b1b)](https://arxiv.org/abs/2303.09833) [![GitHub](https://img.shields.io/github/stars/vvictoryuki/FreeDoM?style=social)](https://github.com/vvictoryuki/FreeDoM) |
| 16 | **DG** - Discriminator Guidance | ICML'23 | Introduces a discriminator that gives explicit supervision to a denoising sample path | [![arXiv](https://img.shields.io/badge/arXiv-2211.17091-b31b1b)](https://arxiv.org/abs/2211.17091) [![GitHub](https://img.shields.io/github/stars/alsdudrla10/DG?style=social)](https://github.com/alsdudrla10/DG) |
| 17 | **SMRD** | MICCAI'23 | MRI reconstruction via diffusion priors | [![Paper](https://img.shields.io/badge/Paper-Link-blue)](https://link.springer.com/chapter/10.1007/978-3-031-43898-1_20) [![GitHub](https://img.shields.io/github/stars/NVlabs/SMRD?style=social)](https://github.com/NVlabs/SMRD) |
| 18 | **PSLD** | NeurIPS'23 | Posterior sampling in latent diffusion space | [![arXiv](https://img.shields.io/badge/arXiv-2307.00619-b31b1b)](https://arxiv.org/abs/2307.00619) [![GitHub](https://img.shields.io/github/stars/LituRout/PSLD?style=social)](https://github.com/LituRout/PSLD) |
| 19 | **RED-diff** | ICLR'24 | Variational regularization with diffusion denoisers | [![arXiv](https://img.shields.io/badge/arXiv-2305.04391-b31b1b)](https://arxiv.org/abs/2305.04391) [![GitHub](https://img.shields.io/github/stars/NVlabs/RED-diff?style=social)](https://github.com/NVlabs/RED-diff) |
| 20 | **ControlVideo** | ICLR'24 | Video editing with spatial/temporal control via fine-tuning | [![arXiv](https://img.shields.io/badge/arXiv-2305.13077-b31b1b)](https://arxiv.org/abs/2305.13077) [![GitHub](https://img.shields.io/github/stars/YBYBZhang/ControlVideo?style=social)](https://github.com/YBYBZhang/ControlVideo) [![Replicate](https://img.shields.io/badge/Replicate-Demo-yellow.svg?logo=replicate&logoColor=white)](https://replicate.com/cjwbw/controlvideo) [![Website](https://img.shields.io/badge/Project-Page-green)](https://controlvideov1.github.io/) |
| 21 | **DeqIR** | CVPR'24 | Fixed-point solver for diffusion restoration | [![arXiv](https://img.shields.io/badge/arXiv-2311.11600-b31b1b)](https://arxiv.org/abs/2311.11600) [![GitHub](https://img.shields.io/github/stars/caojiezhang/DeqIR?style=social)](https://github.com/caojiezhang/DeqIR) |
| 22 | **SparseCtrl** | ECCV'24 | Adds sparse keyframe controls to text-to-video diffusion | [![arXiv](https://img.shields.io/badge/arXiv-2311.16933-b31b1b)](https://arxiv.org/abs/2311.16933) [![GitHub](https://img.shields.io/github/stars/Kosinkadink/ComfyUI-AnimateDiff-Evolved?style=social)](https://github.com/Kosinkadink/ComfyUI-AnimateDiff-Evolved/issues/245) [![Website](https://img.shields.io/badge/Project-Page-green)](https://guoyww.github.io/projects/SparseCtrl/) |
| 23 | **DiffBIR** | ECCV'24 | Blind image restoration with generative diffusion priors | [![arXiv](https://img.shields.io/badge/arXiv-2308.15070-b31b1b)](https://arxiv.org/abs/2308.15070) [![GitHub](https://img.shields.io/github/stars/XPixelGroup/DiffBIR?style=social)](https://github.com/XPixelGroup/DiffBIR) [![Replicate](https://img.shields.io/badge/Replicate-Demo-yellow.svg?logo=replicate&logoColor=white)](https://replicate.com/zsxkib/diffbir) [![Website](https://img.shields.io/badge/Project-Page-green)](https://0x3f3f3f3fun.github.io/projects/diffbir) |
| 24 | **DMPlug** | NeurIPS'24 | Plug-in solver for general inverse problems | [![arXiv](https://img.shields.io/badge/arXiv-2405.16749-b31b1b)](https://arxiv.org/abs/2405.16749) [![GitHub](https://img.shields.io/github/stars/sun-umn/DMPlug?style=social)](https://github.com/sun-umn/DMPlug) |
| 25 | **DGSolver** | NeurIPS'25 | Diffusion generalist solver with universal posterior sampling | [![arXiv](https://img.shields.io/badge/arXiv-2504.21487-b31b1b)](https://arxiv.org/abs/2504.21487) [![GitHub](https://img.shields.io/github/stars/MiliLab/DGSolver?style=social)](https://github.com/MiliLab/DGSolver) |
| 26 | **DAPS** | CVPR'25 | Annealed posterior sampling for inverse problems | [![arXiv](https://img.shields.io/badge/arXiv-2407.01521-b31b1b)](https://arxiv.org/abs/2407.01521) [![GitHub](https://img.shields.io/github/stars/zhangbingliang2019/DAPS?style=social)](https://github.com/zhangbingliang2019/DAPS) [![Website](https://img.shields.io/badge/Project-Page-green)](https://daps-inverse-problem.github.io/) |
| 27 | **SITCOM** | ICML'25 | Iterative constrained optimization during sampling | [![arXiv](https://img.shields.io/badge/arXiv-2410.04479-b31b1b)](https://arxiv.org/abs/2410.04479) [![GitHub](https://img.shields.io/github/stars/sjames40/SITCOM?style=social)](https://github.com/sjames40/SITCOM) |
| 28 | **DiffStateGrad** | ICLR'25 | Gradient projection in diffusion latent space | [![arXiv](https://img.shields.io/badge/arXiv-2410.03463-b31b1b)](https://arxiv.org/abs/2410.03463) [![GitHub](https://img.shields.io/github/stars/Anima-Lab/DiffStateGrad?style=social)](https://github.com/Anima-Lab/DiffStateGrad) [![Website](https://img.shields.io/badge/Project-Page-green)](https://diffstategrad.github.io/) |
| 29 | **RF-Inversion** | ICLR'25 | Semantic image inversion and editing using rectified SDEs | [![arXiv](https://img.shields.io/badge/arXiv-2410.10792-b31b1b)](https://arxiv.org/abs/2410.10792) [![GitHub](https://img.shields.io/github/stars/LituRout/RF-Inversion?style=social)](https://github.com/LituRout/RF-Inversion) [![ComfyUI](https://img.shields.io/badge/ComfyUI-Demo-yellow)](https://github.com/logtd/ComfyUI-Fluxtapoz) [![Website](https://img.shields.io/badge/Project-Page-green)](https://rf-inversion.github.io/) |
| 30 | **FlowDPS** | ICCV'25 | Posterior sampling within flow-matching ODEs | [![arXiv](https://img.shields.io/badge/arXiv-2503.08136-b31b1b)](https://arxiv.org/abs/2503.08136) [![GitHub](https://img.shields.io/github/stars/FlowDPS-Inverse/FlowDPS?style=social)](https://github.com/FlowDPS-Inverse/FlowDPS) |



**Key Formula**:

<div align="center">

![formula](https://latex.codecogs.com/svg.image?\boldsymbol{s}(\mathbf{x}|\mathbf{y},t)\approx\boldsymbol{s}_{\boldsymbol{\theta}}(\mathbf{x},t)+\gamma\boldsymbol{g}(\mathbf{y}|\mathbf{x},t))

</div>

### Training-Time Conditional Diffusion Models

These methods incorporate conditioning directly during model training.

| # | Method | Venue | Description | Links |
|---|--------|-------|-------------|-------|
| 1 | **CFG** - Classifier-Free Guidance | NeurIPS'21 | Standard for conditional generation | [![arXiv](https://img.shields.io/badge/arXiv-2207.12598-b31b1b)](https://arxiv.org/abs/2207.12598) [![GitHub](https://img.shields.io/github/stars/lucidrains/classifier-free-guidance-pytorch?style=social)](https://github.com/lucidrains/classifier-free-guidance-pytorch) |
| 2 | **LDM** - Latent Diffusion Model | CVPR'22 | Stable Diffusion foundation | [![arXiv](https://img.shields.io/badge/arXiv-2112.10752-b31b1b)](https://arxiv.org/abs/2112.10752) [![GitHub](https://img.shields.io/github/stars/CompVis/latent-diffusion?style=social)](https://github.com/CompVis/latent-diffusion) [![HF](https://img.shields.io/badge/🤗-Models-yellow)](https://huggingface.co/CompVis) |
| 3 | **Palette** | SIGGRAPH'22 | Image-to-image diffusion (colorization, inpainting, etc.) | [![arXiv](https://img.shields.io/badge/arXiv-2111.05826-b31b1b)](https://arxiv.org/abs/2111.05826) [![Website](https://img.shields.io/badge/Project-Page-green)](https://diffusion-palette.github.io/) |
| 4 | **Textual Inversion** | arXiv'22 | Personalizes a concept via learned token embeddings | [![arXIV](https://img.shields.io/badge/arXiv-2208.01618-b31b1b)](https://arxiv.org/abs/2208.01618) [![GitHub](https://img.shields.io/github/stars/rinongal/textual_inversion?style=social)](https://github.com/rinongal/textual_inversion) [![Website](https://img.shields.io/badge/Project-Page-green)](https://textual-inversion.github.io/) |
| 5 | **DreamBooth** | CVPR'23 | Subject-driven personalization via fine-tuning | [![arXiv](https://img.shields.io/badge/arXiv-2208.12242-b31b1b)](https://arxiv.org/abs/2208.12242) [![GitHub](https://img.shields.io/github/stars/google/dreambooth?style=social)](https://github.com/google/dreambooth) [![Website](https://img.shields.io/badge/Project-Page-green)](https://dreambooth.github.io/) |
| 6 | **GLIGEN** | CVPR'23 | Grounded language-to-image generation | [![arXiv](https://img.shields.io/badge/arXiv-2301.07093-b31b1b)](https://arxiv.org/abs/2301.07093) [![GitHub](https://img.shields.io/github/stars/gligen/GLIGEN?style=social)](https://github.com/gligen/GLIGEN) [![Website](https://img.shields.io/badge/Project-Page-green)](https://gligen.github.io/) |
| 7 | **InstructPix2Pix** | CVPR'23 | Instruction-based image editing | [![arXiv](https://img.shields.io/badge/arXiv-2211.09800-b31b1b)](https://arxiv.org/abs/2211.09800) [![GitHub](https://img.shields.io/github/stars/timothybrooks/instruct-pix2pix?style=social)](https://github.com/timothybrooks/instruct-pix2pix) [![Website](https://img.shields.io/badge/Project-Page-green)](https://www.timothybrooks.com/instruct-pix2pix) |
| 8 | **ControlNet** | ICCV'23 | Fine-grained spatial control | [![arXiv](https://img.shields.io/badge/arXiv-2302.05543-b31b1b)](https://arxiv.org/abs/2302.05543) [![GitHub](https://img.shields.io/github/stars/lllyasviel/ControlNet?style=social)](https://github.com/lllyasviel/ControlNet) [![HF](https://img.shields.io/badge/🤗-Models-yellow)](https://huggingface.co/lllyasviel/ControlNet) |
| 9 | **IP-Adapter** | arXiv'23 | Image prompt adapter for identity/style conditioning | [![arXiv](https://img.shields.io/badge/arXiv-2308.06721-b31b1b)](https://arxiv.org/abs/2308.06721) [![GitHub](https://img.shields.io/github/stars/tencent-ailab/IP-Adapter?style=social)](https://github.com/tencent-ailab/IP-Adapter) [![Website](https://img.shields.io/badge/Project-Page-green)](https://ip-adapter.github.io/) |
| 10 | **MoD** - Mixture of Diffusers | arXiv'23 | Conditional diffusion with learned mixture experts | [![arXiv](https://img.shields.io/badge/arXiv-2302.02412-b31b1b)](https://arxiv.org/abs/2302.02412) [![GitHub](https://img.shields.io/github/stars/albarji/mixture-of-diffusers?style=social)](https://github.com/albarji/mixture-of-diffusers) |
| 11 | **DiT** - Diffusion Transformer | ICCV'23 | Transformer-based diffusion | [![arXiv](https://img.shields.io/badge/arXiv-2212.09748-b31b1b)](https://arxiv.org/abs/2212.09748) [![GitHub](https://img.shields.io/github/stars/facebookresearch/DiT?style=social)](https://github.com/facebookresearch/DiT) [![Website](https://img.shields.io/badge/Project-Page-green)](https://www.wpeebles.com/DiT) |
| 12 | **MDT** - Masked Diffusion Transformer | ICCV'23 | Masked diffusion transformers | [![arXiv](https://img.shields.io/badge/arXiv-2303.14389-b31b1b)](https://arxiv.org/abs/2303.14389) [![GitHub](https://img.shields.io/github/stars/sail-sg/MDT?style=social)](https://github.com/sail-sg/MDT) |
| 13 | **SDXL** - Stable Diffusion XL | ICLR'24 | High-res text-to-image diffusion with multi-aspect conditioning | [![arXiv](https://img.shields.io/badge/arXiv-2307.01952-b31b1b)](https://arxiv.org/abs/2307.01952) [![GitHub](https://img.shields.io/github/stars/Stability-AI/generative-models?style=social)](https://github.com/Stability-AI/generative-models) [![HF](https://img.shields.io/badge/🤗-Models-yellow)](https://huggingface.co/stabilityai/stable-diffusion-xl-base-1.0) |
| 14 | **T2I-Adapter** | AAAI'24 | Lightweight adapters for control | [![arXiv](https://img.shields.io/badge/arXiv-2302.08453-b31b1b)](https://arxiv.org/abs/2302.08453) [![GitHub](https://img.shields.io/github/stars/TencentARC/T2I-Adapter?style=social)](https://github.com/TencentARC/T2I-Adapter) [![HF](https://img.shields.io/badge/🤗-Models-yellow)](https://huggingface.co/TencentARC) |
| 15 | **AnimateDiff** | ICLR'24 | Motion module for animation | [![arXiv](https://img.shields.io/badge/arXiv-2307.04725-b31b1b)](https://arxiv.org/abs/2307.04725) [![GitHub](https://img.shields.io/github/stars/guoyww/AnimateDiff?style=social)](https://github.com/guoyww/AnimateDiff) [![Website](https://img.shields.io/badge/Project-Page-green)](https://animatediff.github.io/) |
| 16 | **LVD** - LLM-grounded Video Diffusion | ICLR'24 | LLM-guided video generation | [![arXiv](https://img.shields.io/badge/arXiv-2309.17444-b31b1b)](https://arxiv.org/abs/2309.17444) [![GitHub](https://img.shields.io/github/stars/TonyLianLong/LLM-groundedVideoDiffusion?style=social)](https://github.com/TonyLianLong/LLM-groundedVideoDiffusion) [![Website](https://img.shields.io/badge/Project-Page-green)](https://llm-grounded-video-diffusion.github.io/) |
| 17 | **SEINE** | ICLR'24 | Short-to-long video diffusion | [![arXiv](https://img.shields.io/badge/arXiv-2310.20700-b31b1b)](https://arxiv.org/abs/2310.20700) [![GitHub](https://img.shields.io/github/stars/Vchitect/SEINE?style=social)](https://github.com/Vchitect/SEINE) [![HF](https://img.shields.io/badge/🤗-Models-yellow)](https://huggingface.co/Vchitect/SEINE/tree/main) [![Website](https://img.shields.io/badge/Project-Page-green)](https://vchitect.github.io/SEINE-project/) |
| 18 | **VideoCrafter2** | CVPR'24 | Open-source text-to-video / video editing diffusion pipeline | [![arXiv](https://img.shields.io/badge/arXiv-2401.09047-b31b1b)](https://arxiv.org/abs/2401.09047) [![GitHub](https://img.shields.io/github/stars/AILab-CVC/VideoCrafter?style=social)](https://github.com/AILab-CVC/VideoCrafter) [![Website](https://img.shields.io/badge/Project-Page-green)](https://ailab-cvc.github.io/videocrafter2/) |
| 19 | **HunyuanDiT** | CVPR'24 | Large-scale DiT-based text-to-image diffusion with strong conditioning | [![arXiv](https://img.shields.io/badge/arXiv-2405.08748-b31b1b)](https://arxiv.org/abs/2405.08748) [![GitHub](https://img.shields.io/github/stars/Tencent-Hunyuan/HunyuanDiT?style=social)](https://github.com/Tencent-Hunyuan/HunyuanDiT) [![HF](https://img.shields.io/badge/🤗-Models-yellow)](https://huggingface.co/Tencent-Hunyuan/HunyuanDiT) [![Website](https://img.shields.io/badge/Project-Page-green)](https://dit.hunyuan.tencent.com/) |
| 20 | **S-CFG** - Rethinking spatial Inconsistency in CFG | CVPR'24 | Analyzes and improves spatial consistency in CFG-based generation | [![arXiv](https://img.shields.io/badge/arXiv-2404.05384-b31b1b)](https://arxiv.org/abs/2404.05384) [![GitHub](https://img.shields.io/github/stars/SmilesDZgk/S-CFG?style=social)](https://github.com/SmilesDZgk/S-CFG) |
| 21 | **D3PO** | CVPR'24 | RLHF-style preference finetuning for diffusion without reward model | [![arXiv](https://img.shields.io/badge/arXiv-2311.13231-b31b1b)](https://arxiv.org/abs/2311.13231) [![GitHub](https://img.shields.io/github/stars/yk7333/D3PO?style=social)](https://github.com/yk7333/D3PO) |
| 22 | **DreamMatcher** | CVPR'24 | Appearance matching self-attention for semantically-consistent text-to-image personalization | [![arXiv](https://img.shields.io/badge/arXiv-2402.09812-b31b1b)](https://arxiv.org/abs/2402.09812) [![GitHub](https://img.shields.io/github/stars/cvlab-kaist/DreamMatcher?style=social)](https://github.com/cvlab-kaist/DreamMatcher) [![Website](https://img.shields.io/badge/Project-Page-green)](https://cvlab-kaist.github.io/DreamMatcher/) |
| 23 | **PixArt-Σ** | ECCV'24 | High-resolution text-to-image | [![arXiv](https://img.shields.io/badge/arXiv-2403.04692-b31b1b)](https://arxiv.org/abs/2403.04692) [![GitHub](https://img.shields.io/github/stars/PixArt-alpha/PixArt-sigma?style=social)](https://github.com/PixArt-alpha/PixArt-sigma) [![HF](https://img.shields.io/badge/🤗-Models-yellow)](https://huggingface.co/PixArt-alpha/pixart_sigma_sdxlvae_T5_diffusers) [![Website](https://img.shields.io/badge/Project-Page-green)](https://pixart-alpha.github.io/PixArt-sigma-project) |
| 24 | **Follow-Your-Emoji** | SIGGRAPH Asia'24 | Fine-controllable and expressive freestyle portrait animation with diffusion | [![arXiv](https://img.shields.io/badge/arXiv-2406.01900-b31b1b)](https://arxiv.org/abs/2406.01900) [![GitHub](https://img.shields.io/github/stars/mayuelala/FollowYourEmoji?style=social)](https://github.com/mayuelala/FollowYourEmoji) [![Website](https://img.shields.io/badge/Project-Page-green)](https://follow-your-emoji.github.io/) |
| 25 | **HunyuanVideo** | arXiv'24 | High-res text-to-video diffusion with multi-scale DiT backbone | [![arXiv](https://img.shields.io/badge/arXiv-2412.03603-b31b1b)](https://arxiv.org/abs/2412.03603) [![GitHub](https://img.shields.io/github/stars/Tencent/HunyuanVideo?style=social)](https://github.com/Tencent/HunyuanVideo) [![HF](https://img.shields.io/badge/🤗-Models-yellow)](https://huggingface.co/tencent/HunyuanVideo-PromptRewrite) [![Website](https://img.shields.io/badge/Project-Page-green)](https://aivideo.hunyuan.tencent.com/) |
| 26 | **DDO** - Direct Discriminative Optimization | ICML'25 | Direct optimization for preference alignment | [![arXiv](https://img.shields.io/badge/arXiv-2503.01103-b31b1b)](https://arxiv.org/abs/2503.01103) [![GitHub](https://img.shields.io/github/stars/NVlabs/DDO?style=social)](https://github.com/NVlabs/DDO) [![HF](https://img.shields.io/badge/🤗-Models-yellow)](https://huggingface.co/nvidia/DirectDiscriminativeOptimization) [![Website](https://img.shields.io/badge/Project-Page-green)](https://research.nvidia.com/labs/dir/ddo) |
| 27 | **CFG++** | ICLR'25 | Refines CFG via dynamic gradient weighting | [![arXiv](https://img.shields.io/badge/arXiv-2406.08070-b31b1b)](https://arxiv.org/abs/2406.08070) [![GitHub](https://img.shields.io/github/stars/CFGpp-diffusion/CFGpp?style=social)](https://github.com/CFGpp-diffusion/CFGpp) [![Website](https://img.shields.io/badge/Project-Page-green)](https://cfgpp-diffusion.github.io/) |
| 28 | **Ctrl-Adapter** | ICLR'25 | Unified adapter to inject diverse spatial/temporal controls into image/video diffusion | [![arXiv](https://img.shields.io/badge/arXiv-2404.09967-b31b1b)](https://arxiv.org/abs/2404.09967) [![GitHub](https://img.shields.io/github/stars/HL-hanlin/Ctrl-Adapter?style=social)](https://github.com/HL-hanlin/Ctrl-Adapter) [![HF](https://img.shields.io/badge/🤗-Models-yellow)](https://huggingface.co/hanlincs/Ctrl-Adapter) [![Website](https://img.shields.io/badge/Project-Page-green)](https://ctrl-adapter.github.io/) |
| 29 | **T2V-Turbo-v2** | ICLR'25 | Fast text-to-video generation | [![arXiv](https://img.shields.io/badge/arXiv-2405.18750-b31b1b)](https://arxiv.org/abs/2405.18750) [![GitHub](https://img.shields.io/github/stars/Ji4chenLi/t2v-turbo?style=social)](https://github.com/Ji4chenLi/t2v-turbo) [![Website](https://img.shields.io/badge/Project-Page-green)](https://t2v-turbo-v2.github.io/) |
| 30 | **β-CFG** | arXiv'25 | Dynamic guidance method for text-to-image diffusion models | [![arXiv](https://img.shields.io/badge/arXiv-2502.10574-b31b1b)](https://arxiv.org/abs/2502.10574) [![GitHub](https://img.shields.io/github/stars/gmum/beta-CFG?style=social)](https://github.com/gmum/beta-CFG) |


**Key Formula**:

<div align="center">

![formula](https://latex.codecogs.com/svg.image?\boldsymbol{s}(\mathbf{x}|\mathbf{y},t)\approx(1-\gamma)\boldsymbol{s}_{\boldsymbol{\theta}}(\mathbf{x},t)+\gamma\boldsymbol{s}_{\boldsymbol{\theta}}(\mathbf{x}|\mathbf{y},t))

</div>

## ⚡ Efficient Diffusion Models

Efficient diffusion models aim to reduce computational cost and sampling time through various acceleration strategies.

### Dimensionality Reduction

Operating in compressed latent spaces reduces computational overhead.

| # | Method | Venue | Description | Links |
|---|--------|-------|-------------|-------|
| 1 | **LDM** - Latent Diffusion Model | CVPR'22 | Stable Diffusion foundation | [![arXiv](https://img.shields.io/badge/arXiv-2112.10752-b31b1b)](https://arxiv.org/abs/2112.10752) [![GitHub](https://img.shields.io/github/stars/CompVis/latent-diffusion?style=social)](https://github.com/CompVis/latent-diffusion) [![HF](https://img.shields.io/badge/🤗-Models-yellow)](https://huggingface.co/CompVis) |
| 2 | **WSGM** - Wavelet Score-based GM | NeurIPS'22 | Wavelet-based score models | [![Website](https://img.shields.io/badge/OpenReview-Link-blue)](https://openreview.net/forum?id=xZmjH3Pm2BK) |
| 3 | **DiT** - Diffusion Transformer | ICCV'23 | Transformer-based diffusion | [![arXiv](https://img.shields.io/badge/arXiv-2212.09748-b31b1b)](https://arxiv.org/abs/2212.09748) [![GitHub](https://img.shields.io/github/stars/facebookresearch/DiT?style=social)](https://github.com/facebookresearch/DiT) [![Website](https://img.shields.io/badge/Project-Page-green)](https://www.wpeebles.com/DiT) |
| 4 | **WaveDiff** | CVPR'23 | Wavelet-based diffusion | [![arXiv](https://img.shields.io/badge/arXiv-2211.16152-b31b1b)](https://arxiv.org/abs/2211.16152) [![GitHub](https://img.shields.io/github/stars/VinAIResearch/WaveDiff?style=social)](https://github.com/VinAIResearch/WaveDiff) |
| 5 | **LMD** - Latent Masking Diffusion | AAAI'24 | Combines the advantages of MAEs and diffusion | [![arXiv](https://img.shields.io/badge/arXiv-2312.07971-b31b1b)](https://arxiv.org/abs/2312.07971) [![GitHub](https://img.shields.io/github/stars/AnonymousPony/lmd?style=social)](https://github.com/AnonymousPony/lmd) |

### Knowledge Distillation

Distilling multi-step diffusion into fewer steps or single-step models.

| # | Method | Venue | Description | Links |
|---|--------|-------|-------------|-------|
| 1 | **PD** - Progressive Distillation | ICLR'22 | 4-8 steps with minimal quality loss | [![arXiv](https://img.shields.io/badge/arXiv-2202.00512-b31b1b)](https://arxiv.org/abs/2202.00512) [![GitHub](https://img.shields.io/github/stars/google-research/google-research?style=social)](https://github.com/google-research/google-research/tree/master/diffusion_distillation) |
| 2 | **CM** - Consistency Model | ICML'23 | Single-step generation | [![arXiv](https://img.shields.io/badge/arXiv-2303.01469-b31b1b)](https://arxiv.org/abs/2303.01469) [![GitHub](https://img.shields.io/github/stars/openai/consistency_models?style=social)](https://github.com/openai/consistency_models) |
| 3 | **LCM** - Latent Consistency Model | arXiv'23 | Distills diffusion into few-step latent consistency models | [![arXiv](https://img.shields.io/badge/arXiv-2310.04378-b31b1b)](https://arxiv.org/abs/2310.04378) [![GitHub](https://img.shields.io/github/stars/luosiallen/latent-consistency-model?style=social)](https://github.com/luosiallen/latent-consistency-model) [![Replicate](https://img.shields.io/badge/Replicate-Demo-yellow.svg?logo=replicate&logoColor=white)](https://replicate.com/luosiallen/latent-consistency-model) [![Website](https://img.shields.io/badge/Project-Page-green)](https://latent-consistency-models.github.io/) |
| 4 | **DMD2** - Distribution Matching Distillation v2 | NeurIPS'24 | Improved distribution matching | [![arXiv](https://img.shields.io/badge/arXiv-2405.14867-b31b1b)](https://arxiv.org/abs/2405.14867) [![GitHub](https://img.shields.io/github/stars/tianweiy/DMD2?style=social)](https://github.com/tianweiy/DMD2) [![HF](https://img.shields.io/badge/🤗-Models-yellow)](https://huggingface.co/tianweiy/DMD2) [![Website](https://img.shields.io/badge/Project-Page-green)](https://tianweiy.github.io/dmd2/) |
| 5 | **CTM** - Consistency Trajectory Model | ICLR'24 | Trajectory consistency modeling | [![arXiv](https://img.shields.io/badge/arXiv-2310.02279-b31b1b)](https://arxiv.org/abs/2310.02279) [![GitHub](https://img.shields.io/github/stars/sony/ctm?style=social)](https://github.com/sony/ctm) [![Website](https://img.shields.io/badge/Project-Page-green)](https://consistencytrajectorymodel.github.io/CTM) |
| 6 | **iCT** - Improved Consistency Training | ICML'24 | Improved consistency training without teacher models | [![arXiv](https://img.shields.io/badge/arXiv-2310.14189-b31b1b)](https://arxiv.org/abs/2310.14189) [![GitHub](https://img.shields.io/github/stars/openai/consistency_models_cifar10?style=social)](https://github.com/openai/consistency_models_cifar10) |

### Structure Pruning

Reducing model parameters through structured pruning.

| # | Method | Venue | Description | Links |
|---|--------|-------|-------------|-------|
| 1 | **Diff-Pruning** | NeurIPS'23 | Structural pruning for diffusion | [![arXiv](https://img.shields.io/badge/arXiv-2305.10924-b31b1b)](https://arxiv.org/abs/2305.10924) [![GitHub](https://img.shields.io/github/stars/VainF/Diff-Pruning?style=social)](https://github.com/VainF/Diff-Pruning) |
| 2 | **TDPM** - Truncated DPM | ICLR'23 | Truncated diffusion models | [![arXiv](https://img.shields.io/badge/arXiv-2202.09671-b31b1b)](https://arxiv.org/abs/2202.09671) [![GitHub](https://img.shields.io/github/stars/JegZheng/truncated-diffusion-probabilistic-models?style=social)](https://github.com/JegZheng/truncated-diffusion-probabilistic-models) |
| 3 | **LD-Pruner** | CVPR'24 | Latent diffusion pruning | [![Website](https://img.shields.io/badge/Paper-Link-blue)](https://openaccess.thecvf.com/content/CVPR2024W/EDGE/html/Castells_LD-Pruner_Efficient_Pruning_of_Latent_Diffusion_Models_using_Task-Agnostic_Insights_CVPRW_2024_paper.html) |
| 4 | **DiP-GO** | NeurIPS'24 | Diffusion pruning with gradient optimization | [![arXiv](https://img.shields.io/badge/arXiv-2410.16942-b31b1b)](https://arxiv.org/abs/2410.16942) [![GitHub](https://img.shields.io/github/stars/haoweiz23/dip-go?style=social)](https://github.com/haoweiz23/dip-go) |
| 5 | **AdaDiff** | ECCV'24 | Adaptive diffusion pruning | [![arXiv](https://img.shields.io/badge/arXiv-2309.17074-b31b1b)](https://arxiv.org/abs/2309.17074) [![GitHub](https://img.shields.io/github/stars/Tangshengku/AdaDiff?style=social)](https://github.com/Tangshengku/AdaDiff) |
| 6 | **SnapFusion** | NeurIPS'23 | Mobile diffusion via architecture evolution and data distillation | [![arXiv](https://img.shields.io/badge/arXiv-2306.00980-b31b1b)](https://arxiv.org/abs/2306.00980) [![Website](https://img.shields.io/badge/Project-Page-green)](https://snap-research.github.io/SnapFusion/) |

### Cache Reuse

Reusing intermediate computations across sampling steps.

| # | Method | Venue | Description | Links |
|---|--------|-------|-------------|-------|
| 1 | **DeepCache** | CVPR'24 | Deep feature caching | [![arXiv](https://img.shields.io/badge/arXiv-2312.00858-b31b1b)](https://arxiv.org/abs/2312.00858) [![GitHub](https://img.shields.io/github/stars/horseee/DeepCache?style=social)](https://github.com/horseee/DeepCache) [![Website](https://img.shields.io/badge/Project-Page-green)](https://horseee.github.io/Diffusion_DeepCache/) |
| 2 | **BlockCaching** | CVPR'24 | Block-wise caching strategy | [![arXiv](https://img.shields.io/badge/arXiv-2312.03209-b31b1b)](https://arxiv.org/abs/2312.03209) [![Website](https://img.shields.io/badge/Project-Page-green)](https://fwmb.github.io/blockcaching) |
| 3 | **L2C** - Learning to Cache | NeurIPS'24 | Learned caching policies | [![arXiv](https://img.shields.io/badge/arXiv-2406.01733-b31b1b)](https://arxiv.org/abs/2406.01733) [![GitHub](https://img.shields.io/github/stars/horseee/learning-to-cache?style=social)](https://github.com/horseee/learning-to-cache) |
| 4 | **ToCa** - Token-wise Caching | ICLR'25 | Token-wise feature caching for DiT acceleration | [![arXiv](https://img.shields.io/badge/arXiv-2410.05317-b31b1b)](https://arxiv.org/abs/2410.05317) [![GitHub](https://img.shields.io/github/stars/Shenyi-Z/ToCa?style=social)](https://github.com/Shenyi-Z/ToCa) |
| 5 | **ClusCa** - Clustered Caching | MM'25 | Compute-efficient clustering cache | [![arXiv](https://img.shields.io/badge/arXiv-2509.10312-b31b1b)](https://arxiv.org/abs/2509.10312) [![GitHub](https://img.shields.io/github/stars/Shenyi-Z/Cache4Diffusion?style=social)](https://github.com/Shenyi-Z/Cache4Diffusion) |
| 6 | **TaylorSeer** | ICCV'25 | Taylor expansion-based feature forecasting for DiT acceleration | [![arXiv](https://img.shields.io/badge/arXiv-2503.06923-b31b1b)](https://arxiv.org/abs/2503.06923) [![GitHub](https://img.shields.io/github/stars/Shenyi-Z/TaylorSeer?style=social)](https://github.com/Shenyi-Z/TaylorSeer) [![Website](https://img.shields.io/badge/Project-Page-green)](https://taylorseer.github.io/TaylorSeer/) |

### Flow Matching

Transforming diffusion into deterministic flows for faster sampling.

| # | Method | Venue | Description | Links |
|---|--------|-------|-------------|-------|
| 1 | **Flow Matching** | ICLR'23 | Continuous normalizing flows | [![arXiv](https://img.shields.io/badge/arXiv-2412.06264-b31b1b)](https://arxiv.org/abs/2412.06264) [![GitHub](https://img.shields.io/github/stars/facebookresearch/flow_matching?style=social)](https://github.com/facebookresearch/flow_matching) |
| 2 | **Rectified Flow** | ICLR'23 | Straightening probability flows | [![arXiv](https://img.shields.io/badge/arXiv-2209.03003-b31b1b)](https://arxiv.org/abs/2209.03003) [![GitHub](https://img.shields.io/github/stars/gnobitab/RectifiedFlow?style=social)](https://github.com/gnobitab/RectifiedFlow) |
| 3 | **PeRFlow** - Piecewise Rectified Flow | NeurIPS'24 | Piecewise rectification for accelerating diffusion models | [![arXiv](https://img.shields.io/badge/arXiv-2405.07510-b31b1b)](https://arxiv.org/abs/2405.07510) [![GitHub](https://img.shields.io/github/stars/magic-research/piecewise-rectified-flow?style=social)](https://github.com/magic-research/piecewise-rectified-flow) [![HF](https://img.shields.io/badge/🤗-Models-yellow)](https://huggingface.co/hansyan) [![Website](https://img.shields.io/badge/Project-Page-green)](https://piecewise-rectified-flow.github.io) |
| 4 | **InstaFlow** | ICLR'24 | One-step generation via rectified flow | [![arXiv](https://img.shields.io/badge/arXiv-2309.06380-b31b1b)](https://arxiv.org/abs/2309.06380) [![GitHub](https://img.shields.io/github/stars/gnobitab/InstaFlow?style=social)](https://github.com/gnobitab/InstaFlow) |
| 5 | **MeanFlow** | NeurIPS'25 | Mean-field flow matching | [![arXiv](https://img.shields.io/badge/arXiv-2505.13447-b31b1b)](https://arxiv.org/abs/2505.13447) [![GitHub](https://img.shields.io/github/stars/Gsunshine/meanflow?style=social)](https://github.com/Gsunshine/meanflow) |
| 6 | **Stable Diffusion 3** | arXiv'24 | Scaling rectified flow transformers for high-resolution image synthesis (MMDiT) | [![arXiv](https://img.shields.io/badge/arXiv-2403.03206-b31b1b)](https://arxiv.org/abs/2403.03206) [![GitHub](https://img.shields.io/github/stars/Stability-AI/sd3.5?style=social)](https://github.com/Stability-AI/sd3.5) [![HF](https://img.shields.io/badge/🤗-Models-yellow)](https://huggingface.co/stabilityai/stable-diffusion-3.5-large) |
| 7 | **FLUX** | arXiv'25 | High-quality flow matching-based text-to-image model with hybrid transformer architecture | [![arXiv](https://img.shields.io/badge/arXiv-2506.15742-b31b1b)](https://arxiv.org/abs/2506.15742) [![GitHub](https://img.shields.io/github/stars/black-forest-labs/flux?style=social)](https://github.com/black-forest-labs/flux) [![HF](https://img.shields.io/badge/🤗-Models-yellow)](https://huggingface.co/black-forest-labs/FLUX.1-dev) |

## 🌐 Generalized Diffusion Models

Generalized diffusion models extend the framework to diverse modalities, domains, and tasks.

### Modality Expansion

Extending diffusion to multiple modalities beyond images.

| # | Method | Venue | Description | Links |
|---|--------|-------|-------------|-------|
| 1 | **MonoFormer** | arXiv'24 | One transformer for both diffusion and autoregression | [![arXiv](https://img.shields.io/badge/arXiv-2409.16280-b31b1b)](https://arxiv.org/abs/2409.16280) [![GitHub](https://img.shields.io/github/stars/MonoFormer/MonoFormer?style=social)](https://github.com/MonoFormer/MonoFormer) [![HF](https://img.shields.io/badge/🤗-Models-yellow)](https://huggingface.co/MonoFormer) [![Website](https://img.shields.io/badge/Project-Page-green)](https://monoformer.github.io) |
| 2 | **Diffusion Forcing** | NeurIPS'24 | Full-sequence diffusion forcing | [![arXiv](https://img.shields.io/badge/arXiv-2407.01392-b31b1b)](https://arxiv.org/abs/2407.01392) [![GitHub](https://img.shields.io/github/stars/buoyancy99/diffusion-forcing?style=social)](https://github.com/buoyancy99/diffusion-forcing) [![Website](https://img.shields.io/badge/Project-Page-green)](https://www.boyuan.space/diffusion-forcing) |
| 3 | **Show-o** | ICLR'25 | Unified image and text generation | [![arXiv](https://img.shields.io/badge/arXiv-2408.12528-b31b1b)](https://arxiv.org/abs/2408.12528) [![GitHub](https://img.shields.io/github/stars/showlab/Show-o?style=social)](https://github.com/showlab/Show-o) |
| 4 | **Transfusion** | ICLR'25 | Combining diffusion and autoregression | [![arXiv](https://img.shields.io/badge/arXiv-2408.11039-b31b1b)](https://www.arxiv.org/abs/2408.11039) [![GitHub](https://img.shields.io/github/stars/lucidrains/transfusion-pytorch?style=social)](https://github.com/lucidrains/transfusion-pytorch) |
| 5 | **UniDisc** | arXiv'25 | Unified discrete-continuous diffusion | [![arXiv](https://img.shields.io/badge/arXiv-2503.20853-b31b1b)](https://arxiv.org/abs/2503.20853) [![GitHub](https://img.shields.io/github/stars/alexanderswerdlow/unidisc?style=social)](https://github.com/alexanderswerdlow/unidisc) [![HF](https://img.shields.io/badge/🤗-Models-yellow)](https://huggingface.co/aswerdlow/unidisc_interleaved) [![Website](https://img.shields.io/badge/Project-Page-green)](https://unidisc.github.io/) |
| 6 | **OmniGen2** | arXiv'25 | Unified image generation model with multi-modal conditioning | [![arXiv](https://img.shields.io/badge/arXiv-2506.18871-b31b1b)](https://arxiv.org/abs/2506.18871) [![GitHub](https://img.shields.io/github/stars/VectorSpaceLab/OmniGen2?style=social)](https://github.com/VectorSpaceLab/OmniGen2) [![HF](https://img.shields.io/badge/🤗-Models-yellow)](https://huggingface.co/OmniGen2/OmniGen2) [![Website](https://img.shields.io/badge/Project-Page-green)](https://vectorspacelab.github.io/OmniGen2/) |

### Domain Adaptation

Adapting diffusion models to specialized domains.

| # | Method | Venue | Description | Links |
|---|--------|-------|-------------|-------|
| 1 | **DSB** - Diffusion Schrödinger Bridge | NeurIPS'21 | Domain transfer via Schrödinger bridge | [![Website](https://img.shields.io/badge/OpenReview-Link-blue)](https://openreview.net/forum?id=9BnCwiXB0ty) [![GitHub](https://img.shields.io/github/stars/JTT94/diffusion_schrodinger_bridge?style=social)](https://github.com/JTT94/diffusion_schrodinger_bridge) |
| 2 | **Composable Diffusion** | ECCV'22 | Compositional visual generation | [![arXiv](https://img.shields.io/badge/arXiv-2206.01714-b31b1b)](https://arxiv.org/abs/2206.01714) [![GitHub](https://img.shields.io/github/stars/energy-based-model/Compositional-Visual-Generation-with-Composable-Diffusion-Models-PyTorch?style=social)](https://github.com/energy-based-model/Compositional-Visual-Generation-with-Composable-Diffusion-Models-PyTorch) [![Website](https://img.shields.io/badge/Project-Page-green)](https://energy-based-model.github.io/Compositional-Visual-Generation-with-Composable-Diffusion-Models) |
| 3 | **DreamBooth** | CVPR'23 | Personalization with few examples | [![arXiv](https://img.shields.io/badge/arXiv-2208.12242-b31b1b)](https://arxiv.org/abs/2208.12242) [![GitHub](https://img.shields.io/github/stars/google/dreambooth?style=social)](https://github.com/google/dreambooth) [![Website](https://img.shields.io/badge/Project-Page-green)](https://dreambooth.github.io) |
| 4 | **I2SB** - Image-to-Image Schrödinger Bridge | ICML'23 | Image-to-image translation | [![arXiv](https://img.shields.io/badge/arXiv-2302.05872-b31b1b)](https://arxiv.org/abs/2302.05872) [![GitHub](https://img.shields.io/github/stars/NVlabs/I2SB?style=social)](https://github.com/NVlabs/I2SB) [![Website](https://img.shields.io/badge/Project-Page-green)](https://i2sb.github.io/) |
| 5 | **P2P-Bridge** | ECCV'24 | Point-to-point bridging | [![arXiv](https://img.shields.io/badge/arXiv-2408.16325-b31b1b)](https://arxiv.org/abs/2408.16325) [![GitHub](https://img.shields.io/github/stars/matvogel/P2P-Bridge?style=social)](https://github.com/matvogel/P2P-Bridge) [![Website](https://img.shields.io/badge/Project-Page-green)](https://p2p-bridge.github.io) |
| 6 | **OT-CFM** | ICLR'23 | Optimal transport conditional flow matching for efficient domain coupling | [![arXiv](https://img.shields.io/badge/arXiv-2302.00482-b31b1b)](https://arxiv.org/abs/2302.00482) [![GitHub](https://img.shields.io/github/stars/atong01/conditional-flow-matching?style=social)](https://github.com/atong01/conditional-flow-matching) |

### Task Generalization

Generalizing diffusion models across multiple tasks.

| # | Method | Venue | Description | Links |
|---|--------|-------|-------------|-------|
| 1 | **Diffuser** | ICML'22 | Planning with diffusion models | [![arXiv](https://img.shields.io/badge/arXiv-2205.09991-b31b1b)](https://arxiv.org/abs/2205.09991) [![GitHub](https://img.shields.io/github/stars/jannerm/diffuser?style=social)](https://github.com/jannerm/diffuser) [![Website](https://img.shields.io/badge/Project-Page-green)](https://diffusion-planning.github.io/) |
| 2 | **Diffusion Policy** | RSS'23 | Visuomotor policy learning | [![arXiv](https://img.shields.io/badge/arXiv-2303.04137-b31b1b)](https://arxiv.org/abs/2303.04137v4) [![GitHub](https://img.shields.io/github/stars/real-stanford/diffusion_policy?style=social)](https://github.com/real-stanford/diffusion_policy) [![Website](https://img.shields.io/badge/Project-Page-green)](https://diffusion-policy.cs.columbia.edu) |
| 3 | **DDPO** - Denoising Diffusion Policy Optimization | ICLR'24 | RL fine-tuning for diffusion | [![arXiv](https://img.shields.io/badge/arXiv-2305.13301-b31b1b)](https://arxiv.org/abs/2305.13301) [![GitHub](https://img.shields.io/github/stars/jannerm/ddpo?style=social)](https://github.com/jannerm/ddpo) [![Website](https://img.shields.io/badge/Project-Page-green)](https://rl-diffusion.github.io) |
| 4 | **C-LoRA** - Continual LoRA | TMLR'24 | Continual learning for diffusion | [![arXiv](https://img.shields.io/badge/arXiv-2304.06027-b31b1b)](https://arxiv.org/abs/2304.06027) [![Website](https://img.shields.io/badge/Project-Page-green)](https://jamessealesmith.github.io/continual-diffusion) |
| 5 | **Diffusion-ES** | CVPR'24 | Evolutionary search with diffusion for black-box trajectory optimization | [![arXiv](https://img.shields.io/badge/arXiv-2402.06559-b31b1b)](https://arxiv.org/abs/2402.06559) [![GitHub](https://img.shields.io/github/stars/bhyang/diffusion-es?style=social)](https://github.com/bhyang/diffusion-es) [![Website](https://img.shields.io/badge/Project-Page-green)](https://diffusion-es.github.io/) |
| 6 | **B²-DiffuRL** | CVPR'25 | Bidirectional diffusion for RL | [![arXiv](https://img.shields.io/badge/arXiv-2503.11240-b31b1b)](https://arxiv.org/abs/2503.11240) [![GitHub](https://img.shields.io/github/stars/hu-zijing/B2-DiffuRL?style=social)](https://github.com/hu-zijing/B2-DiffuRL) |
| 7 | **DPPO** - Diffusion Policy Policy Optimization | ICLR'25 | PPO fine-tuning for diffusion policies in robotics | [![arXiv](https://img.shields.io/badge/arXiv-2409.00588-b31b1b)](https://arxiv.org/abs/2409.00588) [![GitHub](https://img.shields.io/github/stars/irom-princeton/dppo?style=social)](https://github.com/irom-princeton/dppo) [![Website](https://img.shields.io/badge/Project-Page-green)](https://diffusion-ppo.github.io/) |

## 🛜 Diffusion Models for Semantic Communications

This section presents applications of diffusion models in semantic communications.

### [Preliminary] Diffusion Models for Data Compression

Representative works using diffusion models for data compression across image, video, and audio modalities.

| # | Method | Venue | Description | Links |
|---|--------|-------|-------------|-------|
| 1 | **CDC** | NeurIPS'23 | Conditional diffusion decoder for end-to-end optimized lossy image compression | [![arXiv](https://img.shields.io/badge/arXiv-2209.06950-b31b1b)](https://arxiv.org/abs/2209.06950) [![GitHub](https://img.shields.io/github/stars/buggyyang/CDC_compression?style=social)](https://github.com/buggyyang/CDC_compression) |
| 2 | **HFD** | arXiv'23 | High-fidelity compression with score-based generative models | [![arXiv](https://img.shields.io/badge/arXiv-2305.18231-b31b1b)](https://arxiv.org/abs/2305.18231) |
| 3 | **Multi-Band Diffusion** | NeurIPS'23 | High-fidelity audio generation from low-bitrate discrete representations | [![arXiv](https://img.shields.io/badge/arXiv-2308.02560-b31b1b)](https://arxiv.org/abs/2308.02560) [![GitHub](https://img.shields.io/github/stars/facebookresearch/audiocraft?style=social)](https://github.com/facebookresearch/audiocraft/blob/main/docs/MBD.md) [![Website](https://img.shields.io/badge/Project-Page-green)](https://ai.honu.io/papers/mbd/) |
| 4 | **PerCo** | ICLR'24 | Ultra-low bitrate image compression with diffusion models (0.003 bpp) | [![arXiv](https://img.shields.io/badge/arXiv-2310.10325-b31b1b)](https://arxiv.org/abs/2310.10325) [![GitHub](https://img.shields.io/github/stars/Nikolai10/PerCo?style=social)](https://github.com/Nikolai10/PerCo) |
| 5 | **IPIC (Idempotence)** | ICLR'24 | Perceptual compression via idempotence constraints without training new models | [![arXiv](https://img.shields.io/badge/arXiv-2401.08920-b31b1b)](https://arxiv.org/abs/2401.08920) [![GitHub](https://img.shields.io/github/stars/tongdaxu/Idempotence-and-Perceptual-Image-Compression?style=social)](https://github.com/tongdaxu/Idempotence-and-Perceptual-Image-Compression) |
| 6 | **CorrDiff** | ICML'24 | Correcting diffusion compression with privileged end-to-end decoder | [![arXiv](https://img.shields.io/badge/arXiv-2404.04916-b31b1b)](https://arxiv.org/abs/2404.04916) |
| 7 | **Foundation Diffusion** | ECCV'24 | Lossy compression using pre-trained foundation models without fine-tuning | [![arXiv](https://img.shields.io/badge/arXiv-2404.08580-b31b1b)](https://arxiv.org/abs/2404.08580) |
| 8 | **Extreme Video Compression** | WCSP'24 | Extreme video compression with diffusion-based predictive generation (0.02 bpp) | [![arXiv](https://img.shields.io/badge/arXiv-2402.08934-b31b1b)](https://arxiv.org/abs/2402.08934) [![GitHub](https://img.shields.io/github/stars/ElesionKyrie/Extreme-Video-Compression-With-Prediction-Using-Pre-trainded-Diffusion-Models-?style=social)](https://github.com/ElesionKyrie/Extreme-Video-Compression-With-Prediction-Using-Pre-trainded-Diffusion-Models-) |
| 9 | **UQDM** | ICLR'25 | Progressive compression with universally quantized diffusion models | [![arXiv](https://img.shields.io/badge/arXiv-2412.10935-b31b1b)](https://arxiv.org/abs/2412.10935) [![GitHub](https://img.shields.io/github/stars/mandt-lab/uqdm?style=social)](https://github.com/mandt-lab/uqdm) [![Website](https://img.shields.io/badge/Project-Page-green)](https://www.justuswill.com/uqdm/) |
| 10 | **DiffC** | ICLR'25 | Zero-shot lossy compression using pretrained Stable Diffusion models | [![arXiv](https://img.shields.io/badge/arXiv-2501.09815-b31b1b)](https://arxiv.org/abs/2501.09815) [![GitHub](https://img.shields.io/github/stars/JeremyIV/diffc?style=social)](https://github.com/JeremyIV/diffc) [![Website](https://img.shields.io/badge/Project-Page-green)](https://jeremyiv.github.io/diffc-project-page/) |
| 11 | **PICD** | CVPR'25 | Versatile perceptual image compression with diffusion rendering for screen and natural images | [![arXiv](https://img.shields.io/badge/arXiv-2505.05853-b31b1b)](https://arxiv.org/abs/2505.05853) |

### Fidelity-Oriented Human Semantic Communications

Diffusion models for high-quality semantic image, video, and audio transmission prioritizing perceptual fidelity for human consumption.

| # | Method | Venue | Description | Links |
|---|--------|-------|-------------|-------|
| 1 | **DM4ASC** | ICASSP'24 | First diffusion framework for audio semantic communication as inverse problem | [![arXiv](https://img.shields.io/badge/arXiv-2309.07195-b31b1b)](https://arxiv.org/abs/2309.07195) [![GitHub](https://img.shields.io/github/stars/ispamm/DM4ASC?style=social)](https://github.com/ispamm/DM4ASC) [![Website](https://img.shields.io/badge/Project-Page-green)](https://ispamm.github.io/diffusion-audio-semantic-communication/) |
| 2 | **CommIN** | ICASSP'24 | INN-guided diffusion for wireless image transmission as inverse problem | [![arXiv](https://img.shields.io/badge/arXiv-2310.01130-b31b1b)](https://arxiv.org/abs/2310.01130) |
| 3 | **DiffSC** | ICASSP'24 | DDPM with Multi-Dimensional Feature Extraction for high-noise environments | [![Website](https://img.shields.io/badge/Paper-Link-blue)](https://ieeexplore.ieee.org/abstract/document/10448094) |
| 4 | **CDDM** | TWC'24 | Channel denoising diffusion models adapting to AWGN/Rayleigh channels | [![arXiv](https://img.shields.io/badge/arXiv-2309.08895-b31b1b)](https://arxiv.org/abs/2309.08895) [![GitHub](https://img.shields.io/github/stars/Wireless3C-SJTU/CDDM-channel-denoising-diffusion-model-for-semantic-communication?style=social)](https://github.com/Wireless3C-SJTU/CDDM-channel-denoising-diffusion-model-for-semantic-communication) |
| 5 | **Gen-SC** | WCSP'24 | Transmits images efficiently by sending text descriptions and reconstructing images via a text-to-image diffusion model | [![arXiv](https://img.shields.io/badge/arXiv-2409.17104-b31b1b)](https://arxiv.org/abs/2409.17104) |
| 6 | **CDM-JSCC** | WCL'24 | Enhances the perceptual quality of transmitted images by utilizing a rate-adaptive conditional diffusion model | [![arXiv](https://img.shields.io/badge/arXiv-2409.02597-b31b1b)](https://arxiv.org/abs/2409.02597) [![GitHub](https://img.shields.io/github/stars/zhang-guangyi/cdm-jscc?style=social)](https://github.com/zhang-guangyi/cdm-jscc) |
| 7 | **Img2Img-SC** | MLSP'24 | Language-oriented semantic communication framework that transmits both textual descriptions and compressed image embeddings | [![arXiv](https://img.shields.io/badge/arXiv-2405.09976-b31b1b)](https://arxiv.org/abs/2405.09976) [![GitHub](https://img.shields.io/github/stars/ispamm/Img2Img-SC?style=social)](https://github.com/ispamm/Img2Img-SC) |
| 8 | **MU-GSC** | arXiv'24 | Swin Transformer JSCC with diffusion decoder, 17.75% PSNR improvement | [![arXiv](https://img.shields.io/badge/arXiv-2408.05112-b31b1b)](https://arxiv.org/abs/2408.05112) |
| 9 | **DiffJSCC** | TMLCN'25 | Pre-trained Stable Diffusion with Deep JSCC achieving <0.008 symbols/pixel | [![arXiv](https://img.shields.io/badge/arXiv-2404.17736-b31b1b)](https://arxiv.org/abs/2404.17736) [![GitHub](https://img.shields.io/github/stars/mingyuyng/DiffJSCC?style=social)](https://github.com/mingyuyng/DiffJSCC) |
| 10 | **DiffCom** | JSAC'25 | Probabilistic sampling using channel signals as fine-grained conditions | [![arXiv](https://img.shields.io/badge/arXiv-2406.07390-b31b1b)](https://arxiv.org/abs/2406.07390) [![GitHub](https://img.shields.io/github/stars/wsxtyrdd/diffcom?style=social)](https://github.com/wsxtyrdd/diffcom) [![Website](https://img.shields.io/badge/Project-Page-green)](https://semcomm.github.io/DiffCom/) |
| 11 | **GVSC** | TVT'25 | First generative video semantic communication at low bandwidth ratio | [![arXiv](https://img.shields.io/badge/arXiv-2502.13838-b31b1b)](https://arxiv.org/abs/2502.13838) |
| 12 | **Wang et al.** | arXiv'25 | Receiver-driven retransmission with caption-guided latent diffusion inpainting | [![arXiv](https://img.shields.io/badge/arXiv-2510.26442-b31b1b)](https://arxiv.org/abs/2510.26442) |
| 13 | **SGD-JSCC** | arXiv'25 | DiT-based diffusion with semantic side information for channel denoising | [![arXiv](https://img.shields.io/badge/arXiv-2501.01138-b31b1b)](https://arxiv.org/abs/2501.01138) [![GitHub](https://img.shields.io/github/stars/MauroZMJ/SGDJSCC?style=social)](https://github.com/MauroZMJ/SGDJSCC) |
| 14 | **WVSC-D** | arXiv'25 | Wireless video semantic communication framework with decoupled diffusion multi-frame compensation | [![arXiv](https://img.shields.io/badge/arXiv-2511.02478-b31b1b)](https://arxiv.org/abs/2511.02478) |
| 15 | **DiT-JSCC** | arXiv'26 |  A DiT-based generative JSCC that ensures high semantic consistency for image transmission under extreme channel conditions | [![arXiv](https://img.shields.io/badge/arXiv-2601.03112-b31b1b)](https://arxiv.org/abs/2601.03112) |

### Task-Specific Machine Semantic Communications

Resource-efficient diffusion models optimized for machine semantic communications and edge computing scenarios.

| # | Method | Venue | Description | Links |
|---|--------|-------|-------------|-------|
| 1 | **GESCO** | arXiv'23 | Pioneering diffusion-based machine semantic communication transmitting compressed semantic maps | [![arXiv](https://img.shields.io/badge/arXiv-2306.04321-b31b1b)](https://arxiv.org/abs/2306.04321) [![GitHub](https://img.shields.io/github/stars/ispamm/GESCO?style=social)](https://github.com/ispamm/GESCO) |
| 2 | **Qiao et al.** | WCL'24 | Latency-aware generative semantic communications with pre-trained diffusion models | [![Website](https://img.shields.io/badge/Paper-Link-blue)](https://ieeexplore.ieee.org/document/10599525) |
| 3 | **SCGSC** | WCNC'24 | Semantic change driven generative machine semantic communication framework | [![arXiv](https://img.shields.io/badge/arXiv-2309.12775-b31b1b)](https://arxiv.org/abs/2309.12775) [![GitHub](https://img.shields.io/github/stars/wty2011jl/SCDGSC?style=social)](https://github.com/wty2011jl/SCDGSC.git) |
| 4 | **LDM-SemCom** | TWC'25 | Real-time edge computing with end-to-end consistency distillation | [![arXiv](https://img.shields.io/badge/arXiv-2406.06644-b31b1b)](https://arxiv.org/abs/2406.06644) [![GitHub](https://img.shields.io/github/stars/JianhuaPei/LDM-enabled-SemCom-system?style=social)](https://github.com/JianhuaPei/LDM-enabled-SemCom-system) |
| 5 | **Guo et al.** | TWC'25 | Treating wireless transmission as forward diffusion process with VAE modules | [![arXiv](https://img.shields.io/badge/arXiv-2407.18468-b31b1b)](https://arxiv.org/abs/2407.18468) |
| 6 | **Q-GESCO** | WCL'25 | Quantized models reducing memory 75% and FLOPs 79% for resource-constrained devices | [![arXiv](https://img.shields.io/badge/arXiv-2410.02491-b31b1b)](https://arxiv.org/abs/2410.02491) [![GitHub](https://img.shields.io/github/stars/ispamm/Q-GESCO?style=social)](https://github.com/ispamm/Q-GESCO) |
| 7 | **CASC** | ICC'25 | Latent diffusion with Condition-Aware NN, 51.7% inference time reduction | [![arXiv](https://img.shields.io/badge/arXiv-2411.06552-b31b1b)](https://arxiv.org/abs/2411.06552) |
| 8 | **SC-Diffusion** | TMLCN'25 | Parameter generation for task-oriented semantic communications via conditional diffusion model | [![Website](https://img.shields.io/badge/Paper-Link-blue)](https://ieeexplore.ieee.org/document/11195863) |
| 9 | **Khalid et al.** | ICML'25 | Semantic image communication via Stable Cascade with compact latent embeddings | [![arXiv](https://img.shields.io/badge/arXiv-2507.17416-b31b1b)](https://arxiv.org/abs/2507.17416) |
| 10 | **Wang et al.** | arXiv'25 | Training-free LDM receiver with SDE-derived SNR-to-timestep mapping for zero-shot generalization | [![arXiv](https://img.shields.io/badge/arXiv-2506.05710-b31b1b)](https://arxiv.org/abs/2506.05710) |
| 11 | **DiffSem** | arXiv'25 | Task-oriented with privacy, notable accuracy improvement on MNIST | [![arXiv](https://img.shields.io/badge/arXiv-2506.19886-b31b1b)](https://arxiv.org/abs/2506.19886) |
| 12 | **SS-MGSC** | arXiv'25 | A multi-user generative semantic communication framework utilizing semantic-splitting and diffusion models for personalized vehicular networks | [![arXiv](https://img.shields.io/badge/arXiv-2507.01333-b31b1b)](https://arxiv.org/abs/2507.01333) |

### Intent-Driven Agent Semantic Communications

AI agents with diffusion models for intent-driven semantic communications.

| # | Method | Venue | Description | Links |
|---|--------|-------|-------------|-------|
| 1 | **A-GSC** | TWC'24 | Agent-driven generative semantic communications with cross-modality and prediction based on diffusion RL | [![arXiv](https://img.shields.io/badge/arXiv-2404.06997-b31b1b)](https://arxiv.org/abs/2404.06997) |
| 2 | **Semantic Collaboration** | CNIOT'24 | A multi-agent collaboration framework based on semantic communication for search and rescue tasks | [![Website](https://img.shields.io/badge/Paper-Link-blue)](https://dl.acm.org/doi/abs/10.1145/3670105.3670127) |
| 3 | **CSCA** | TMC'26 | A diffusion policy-empowered cognitive SemCom agent for intent-driven multimodal communication planning at the edge | [![Website](https://img.shields.io/badge/Paper-Link-blue)](https://ieeexplore.ieee.org/abstract/document/11085101) |


## 📊 Benchmarks and Datasets

### Benchmarks

Widely-used open-source benchmarks for evaluating diffusion model generation quality, prompt fidelity, and compositional capabilities.

#### Text-to-Image Benchmarks

| # | Benchmark | Description | Source |
|---|-----------|-------------|--------|
| 1 | **DrawBench** | 200 challenging prompts across 11 categories (counting, colors, spatial, text rendering, etc.) introduced by Imagen for qualitative human evaluation of T2I models. | [![arXiv](https://img.shields.io/badge/arXiv-2205.11487-b31b1b)](https://arxiv.org/abs/2205.11487) |
| 2 | **PartiPrompts (P2)** | 1,600 diverse English prompts spanning 12 categories and 11 challenge aspects for holistic T2I evaluation. Released with the Parti model. | [![arXiv](https://img.shields.io/badge/arXiv-2206.10789-b31b1b)](https://arxiv.org/abs/2206.10789) [![HF](https://img.shields.io/badge/🤗-Dataset-yellow)](https://huggingface.co/datasets/nateraw/parti-prompts) |
| 3 | **TIFA** | VQA-based automatic evaluation measuring T2I faithfulness by generating question-answer pairs from prompts and verifying against images. 4K prompts, 25K questions across 12 categories. | [![arXiv](https://img.shields.io/badge/arXiv-2303.11897-b31b1b)](https://arxiv.org/abs/2303.11897) [![GitHub](https://img.shields.io/github/stars/Yushi-Hu/tifa?style=social)](https://github.com/Yushi-Hu/tifa) [![Website](https://img.shields.io/badge/Project-Page-green)](https://tifa-benchmark.github.io/) |
| 4 | **T2I-CompBench** | Comprehensive compositional T2I benchmark evaluating attribute binding, spatial relationships, and complex compositions with detection-based metrics. | [![arXiv](https://img.shields.io/badge/arXiv-2307.06350-b31b1b)](https://arxiv.org/abs/2307.06350) [![GitHub](https://img.shields.io/github/stars/Karine-Huang/T2I-CompBench?style=social)](https://github.com/Karine-Huang/T2I-CompBench) |
| 5 | **GenEval** | Compositional generation benchmark evaluating object count, spatial relations, attribute binding, and co-occurrence accuracy via object detection pipelines. | [![arXiv](https://img.shields.io/badge/arXiv-2310.11513-b31b1b)](https://arxiv.org/abs/2310.11513) [![GitHub](https://img.shields.io/github/stars/djghosh13/geneval?style=social)](https://github.com/djghosh13/geneval) |
| 6 | **DPG-Bench** | Dense prompt generation benchmark with long, detailed prompts synthesized from multi-annotation sources for evaluating models on complex, attribute-rich descriptions. | [![arXiv](https://img.shields.io/badge/arXiv-2403.05135-b31b1b)](https://arxiv.org/abs/2403.05135) [![GitHub](https://img.shields.io/github/stars/TencentQQGYLab/ELLA?style=social)](https://github.com/TencentQQGYLab/ELLA) |
| 7 | **MJHQ-30K** | 30K high-quality Midjourney images across 10 categories for automatic FID-based aesthetic quality evaluation. Curated with aesthetic and CLIP score filtering. | [![arXiv](https://img.shields.io/badge/arXiv-2402.17245-b31b1b)](https://arxiv.org/abs/2402.17245) [![HF](https://img.shields.io/badge/🤗-Dataset-yellow)](https://huggingface.co/datasets/playgroundai/MJHQ-30K) |
| 8 | **GenAI-Bench** | 1,600 compositional prompts from professional designers, evaluating advanced reasoning (counting, comparison, logic) with human ratings across 10 leading T2I/T2V models. | [![arXiv](https://img.shields.io/badge/arXiv-2406.13743-b31b1b)](https://arxiv.org/abs/2406.13743) [![GitHub](https://img.shields.io/github/stars/linzhiqiu/t2v_metrics?style=social)](https://github.com/linzhiqiu/t2v_metrics) [![HF](https://img.shields.io/badge/🤗-Dataset-yellow)](https://huggingface.co/datasets/BaiqiL/GenAI-Bench) |

#### Video Generation Benchmarks

| # | Benchmark | Description | Source |
|---|-----------|-------------|--------|
| 1 | **VBench** | Comprehensive video generation benchmark evaluating 16 dimensions including temporal consistency, motion quality, aesthetic fidelity, and subject identity. | [![arXiv](https://img.shields.io/badge/arXiv-2311.17982-b31b1b)](https://arxiv.org/abs/2311.17982) [![GitHub](https://img.shields.io/github/stars/Vchitect/VBench?style=social)](https://github.com/Vchitect/VBench) |
| 2 | **EvalCrafter** | Benchmark and pipeline for evaluating video generation models across visual quality, text-video alignment, motion quality, and temporal consistency. | [![arXiv](https://img.shields.io/badge/arXiv-2310.11440-b31b1b)](https://arxiv.org/abs/2310.11440) [![GitHub](https://img.shields.io/github/stars/evalcrafter/EvalCrafter?style=social)](https://github.com/evalcrafter/EvalCrafter) [![Website](https://img.shields.io/badge/Project-Page-green)](https://evalcrafter.github.io/) |

### Datasets

#### Audio

| # | Dataset | Description | Size | Tasks | Source |
|---|---------|-------------|------|-------|--------|
| 1 | **LibriSpeech** | Large-scale corpus of read English speech derived from audiobooks. Clean and noisy subsets available. | 1000 hours | ASR, Speech Recognition | [![OpenSLR](https://img.shields.io/badge/Data-Link-blue)](http://www.openslr.org/12/) |
| 2 | **VCTK** | English multi-speaker corpus with 110 speakers reading newspapers. High-quality recordings. | 44 hours | TTS, Voice Conversion, Speaker Recognition | [![Link](https://img.shields.io/badge/Data-Link-blue)](https://datashare.ed.ac.uk/handle/10283/3443) |
| 3 | **AudioSet** | Large-scale dataset of 2M 10-second audio clips with 527 sound event classes from YouTube. | 2M clips | Audio Classification, Sound Event Detection | [![Link](https://img.shields.io/badge/Data-Link-blue)](https://research.google.com/audioset/) |

#### Image

| # | Dataset | Description | Size | Tasks | Source |
|---|---------|-------------|------|-------|--------|
| 1 | **ImageNet** | Large-scale image classification dataset with 1000 object categories. Standard benchmark for computer vision. | 1.4M images | Classification, Object Recognition | [![Link](https://img.shields.io/badge/Data-Link-blue)](https://www.image-net.org/) |
| 2 | **COCO** | Common Objects in Context. Object detection, segmentation, and captioning with 80 categories. | 330K images | Detection, Segmentation, Captioning | [![arXiv](https://img.shields.io/badge/arXiv-1405.0312-b31b1b)](https://arxiv.org/abs/1405.0312) |
| 3 | **FFHQ** | Flickr-Faces-HQ. High-quality face dataset at 1024×1024 resolution with diverse variations. | 70K images | Face Generation, GAN, Style Transfer | [![GitHub](https://img.shields.io/github/stars/NVlabs/ffhq-dataset?style=social)](https://github.com/NVlabs/ffhq-dataset) |
| 4 | **CLIC** | Challenge on Learned Image Compression dataset. Professional quality images for compression research. | 2000+ images | Image Compression, Quality Assessment | [![Link](https://img.shields.io/badge/Data-Link-blue)](http://www.compression.cc/) |
| 5 | **Kodak** | Kodak PhotoCD dataset. Standard benchmark with 24 high-quality uncompressed images. | 24 images | Image Compression, Quality Evaluation | [![Link](https://img.shields.io/badge/Data-Link-blue)](http://r0k.us/graphics/kodak/) |
| 6 | **Places365** | Scene recognition dataset with 365 scene categories. Focuses on environmental context. | 10M images | Scene Recognition, Classification | [![Link](https://img.shields.io/badge/Data-Link-blue)](http://places2.csail.mit.edu/) |
| 7 | **CelebA** | Large-scale face attributes dataset with 40 attribute annotations per image. | 202K images | Face Recognition, Attribute Prediction | [![Link](https://img.shields.io/badge/Data-Link-blue)](https://mmlab.ie.cuhk.edu.hk/projects/CelebA.html) |

#### Video

| # | Dataset | Description | Size | Tasks | Source |
|---|---------|-------------|------|-------|--------|
| 1 | **Kinetics-400/600/700** | Large-scale human action video dataset from YouTube. Standard for action recognition. | 650K videos | Action Recognition, Video Classification | [![arXiv](https://img.shields.io/badge/arXiv-1705.06950-b31b1b)](https://arxiv.org/abs/1705.06950) |
| 2 | **UCF101** | Action recognition dataset with 101 action categories from realistic web videos. | 13K videos | Action Recognition, Video Understanding | [![Link](https://img.shields.io/badge/Data-Link-blue)](https://www.crcv.ucf.edu/data/UCF101.php) |
| 3 | **ActivityNet** | Large-scale video dataset for human activity understanding with temporal annotations. | 20K videos | Activity Detection, Temporal Localization | [![Link](https://img.shields.io/badge/Data-Link-blue)](http://activity-net.org/) |
| 4 | **YouTube-8M** | Large-scale video understanding dataset with 8M videos and 3862 visual entity classes. | 8M videos | Video Classification, Multi-label | [![Link](https://img.shields.io/badge/Data-Link-blue)](https://research.google.com/youtube8m/) |
| 5 | **MSR-VTT** | Video captioning dataset with 10K video clips and 200K natural language descriptions. | 10K videos | Video Captioning, Video-Text Retrieval | [![Link](https://img.shields.io/badge/Data-Link-blue)](https://www.microsoft.com/en-us/research/publication/msr-vtt-a-large-video-description-dataset-for-bridging-video-and-language/) |

#### Volume (3D/4D)

| # | Dataset | Description | Size | Tasks | Source |
|---|---------|-------------|------|-------|--------|
| 1 | **D-NeRF** | Dynamic Neural Radiance Fields dataset with synthetic and real dynamic scenes for 4D reconstruction. | 9 scenes | Dynamic Novel View Synthesis, 4D Reconstruction | [![arXiv](https://img.shields.io/badge/arXiv-2011.13961-b31b1b)](https://arxiv.org/abs/2011.13961) [![GitHub](https://img.shields.io/github/stars/albertpumarola/D-NeRF?style=social)](https://github.com/albertpumarola/D-NeRF) [![Website](https://img.shields.io/badge/Project-Page-green)](https://www.albertpumarola.com/research/D-NeRF/index.html)|
| 2 | **Neu3D** | Neural 3D video synthesis dataset with multi-view videos of human performances. | 200+ sequences | 3D Human Reconstruction, Neural Rendering | [![arXiv](https://img.shields.io/badge/arXiv-2103.02597-b31b1b)](https://arxiv.org/abs/2103.02597) [![GitHub](https://img.shields.io/github/stars/facebookresearch/Neural_3D_Video?style=social)](https://github.com/facebookresearch/Neural_3D_Video) [![Project](https://img.shields.io/badge/Project-Page-green)](https://neural-3d-video.github.io/) |
| 3 | **ShapeNet** | Large-scale 3D shape dataset with 55 object categories and 51,300 3D CAD models. | 51K models | 3D Reconstruction, Shape Analysis | [![arXiv](https://img.shields.io/badge/arXiv-1512.03012-b31b1b)](https://arxiv.org/abs/1512.03012) [![Link](https://img.shields.io/badge/Data-Link-blue)](https://shapenet.org/) |
| 4 | **ScanNet** | Richly-annotated indoor RGB-D scans with 3D semantic segmentation labels for 1513 scenes. | 1513 scans | 3D Segmentation, Indoor Scene Understanding | [![arXiv](https://img.shields.io/badge/arXiv-1702.04405-b31b1b)](https://arxiv.org/abs/1702.04405) [![Link](https://img.shields.io/badge/Data-Link-blue)](http://www.scan-net.org/) |
| 5 | **ModelNet** | 3D CAD model dataset with ModelNet40 (40 classes) and ModelNet10 (10 classes) versions. | 12K models | 3D Classification, Point Cloud Processing | [![Link](https://img.shields.io/badge/Data-Link-blue)](https://modelnet.cs.princeton.edu/) |
| 6 | **NeRF Synthetic** | Blender-rendered synthetic scenes with known camera poses and lighting for NeRF evaluation. | 8 scenes | Novel View Synthesis, 3D Reconstruction | [![arXiv](https://img.shields.io/badge/arXiv-2003.08934-b31b1b)](https://arxiv.org/abs/2003.08934) [![GitHub](https://img.shields.io/github/stars/bmild/nerf?style=social)](https://github.com/bmild/nerf) [![Project](https://img.shields.io/badge/Project-Page-green)](https://www.matthewtancik.com/nerf) |

#### Domain-Specific

**Autonomous Driving**

| # | Dataset | Description | Size | Tasks | Source |
|---|---------|-------------|------|-------|--------|
| 1 | **nuScenes** | Full 3D sensor suite with LiDAR, radar, and cameras. 1000 scenes with 3D bounding boxes. | 1000 scenes | 3D Detection, Tracking, Prediction | [![arXiv](https://img.shields.io/badge/arXiv-1903.11027-b31b1b)](https://arxiv.org/abs/1903.11027) [![Link](https://img.shields.io/badge/Data-Link-blue)](https://www.nuscenes.org/) |
| 2 | **KITTI** | Benchmark suite for stereo, optical flow, visual odometry, and 3D object detection from driving scenarios. | 200K images | 3D Detection, Depth, Odometry | [![Link](https://img.shields.io/badge/Data-Link-blue)](http://www.cvlibs.net/datasets/kitti/) |
| 3 | **Waymo Open Dataset** | High-resolution sensor data with LiDAR and camera from Waymo vehicles. Large-scale 3D annotations. | 1000 segments | 3D Detection, Tracking, Motion Prediction | [![arXiv](https://img.shields.io/badge/arXiv-1912.04838-b31b1b)](https://arxiv.org/abs/1912.04838) [![Link](https://img.shields.io/badge/Data-Link-blue)](https://waymo.com/open/) |
| 4 | **Cityscapes** | Urban street scenes with dense pixel-level semantic and instance segmentation annotations. | 25K images | Semantic Segmentation, Instance Segmentation | [![arXiv](https://img.shields.io/badge/arXiv-1604.01685-b31b1b)](https://arxiv.org/abs/1604.01685) [![Link](https://img.shields.io/badge/Data-Link-blue)](https://www.cityscapes-dataset.com/) |

**Medical Imaging**

| # | Dataset | Description | Size | Tasks | Source |
|---|---------|-------------|------|-------|--------|
| 1 | **BraTS** | Brain Tumor Segmentation challenge with multimodal MRI scans (T1, T2, FLAIR, T1ce). Annual benchmark. | 2000+ cases | 3D Tumor Segmentation, Medical Imaging | [![Link](https://img.shields.io/badge/Data-Link-blue)](https://www.med.upenn.edu/cbica/brats/) |
| 2 | **MIMIC-CXR** | Large chest X-ray dataset with free-text radiology reports. Largest publicly available CXR dataset. | 377K images | Disease Classification, Report Generation | [![arXiv](https://img.shields.io/badge/arXiv-1901.07042-b31b1b)](https://arxiv.org/abs/1901.07042) [![PhysioNet](https://img.shields.io/badge/Data-Link-blue)](https://physionet.org/content/mimic-cxr/2.0.0/) |
| 3 | **ChestX-ray14** | Large-scale chest X-ray dataset with 14 common disease labels for multi-label classification. | 112K images | Disease Classification, Localization | [![arXiv](https://img.shields.io/badge/arXiv-1705.02315-b31b1b)](https://arxiv.org/abs/1705.02315) [![NIH](https://img.shields.io/badge/Data-Link-blue)](https://nihcc.app.box.com/v/ChestXray-NIHCC) |
| 4 | **Medical Segmentation Decathlon** | Multi-organ segmentation covering 10 different medical imaging tasks (CT, MRI). | 2600+ cases | Multi-task 3D Segmentation | [![arXiv](https://img.shields.io/badge/arXiv-1902.09063-b31b1b)](https://arxiv.org/abs/1902.09063) [![Link](https://img.shields.io/badge/Data-Link-blue)](http://medicaldecathlon.com/) |

**Depth Estimation**

| # | Dataset | Description | Size | Tasks | Source |
|---|---------|-------------|------|-------|--------|
| 1 | **NYU Depth V2** | Indoor RGB-D dataset with dense depth maps from Microsoft Kinect. 1449 labeled scenes. | 1449 scenes | Depth Estimation, Indoor Scene Understanding | [![Link](https://img.shields.io/badge/Data-Link-blue)](https://cs.nyu.edu/~fergus/datasets/nyu_depth_v2.html) |
| 2 | **DIODE** | Dense Indoor and Outdoor DEpth dataset with high-quality depth from laser scanner. | 25K images | Depth Estimation, Normal Estimation | [![arXiv](https://img.shields.io/badge/arXiv-1908.00463-b31b1b)](https://arxiv.org/abs/1908.00463) [![Link](https://img.shields.io/badge/Data-Link-blue)](https://diode-dataset.org/) |
| 3 | **Middlebury Stereo** | Standard stereo matching benchmark with high-resolution calibrated image pairs and ground truth. | 30+ pairs | Stereo Matching, Depth Estimation | [![Link](https://img.shields.io/badge/Data-Link-blue)](https://vision.middlebury.edu/stereo/) |
| 4 | **SceneFlow** | Large synthetic dataset with optical flow and disparity ground truth for 3D scene understanding. | 39K images | Optical Flow, Stereo Matching, Depth | [![arXiv](https://img.shields.io/badge/arXiv-1512.02134-b31b1b)](https://arxiv.org/abs/1512.02134) [![Link](https://img.shields.io/badge/Data-Link-blue)](https://lmb.informatik.uni-freiburg.de/resources/datasets/SceneFlowDatasets.en.html) |

**Remote Sensing**

| # | Dataset | Description | Size | Tasks | Source |
|---|---------|-------------|------|-------|--------|
| 1 | **SpaceNet** | High-resolution satellite imagery with building footprints, road networks across multiple cities. | 1M+ buildings | Building Detection, Road Extraction | [![Link](https://img.shields.io/badge/Data-Link-blue)](https://spacenet.ai/) |
| 2 | **xView** | One of the largest overhead imagery datasets with 1M object instances across 60 classes. | 1M objects | Object Detection, Classification | [![arXiv](https://img.shields.io/badge/arXiv-1802.07856-b31b1b)](https://arxiv.org/abs/1802.07856) [![Link](https://img.shields.io/badge/Data-Link-blue)](http://xviewdataset.org/) |
| 3 | **DOTA** | Dataset for Object deTection in Aerial images with oriented bounding boxes. 15 categories. | 188K instances | Oriented Object Detection, Aerial Imagery | [![arXiv](https://img.shields.io/badge/arXiv-1711.10398-b31b1b)](https://arxiv.org/abs/1711.10398) [![Link](https://img.shields.io/badge/Data-Link-blue)](https://captain-whu.github.io/DOTA/) |
| 4 | **LEVIR-CD** | Large-scale building change detection dataset from Google Earth with 637 image pairs. | 637 pairs | Change Detection, Building Analysis | [![Link](https://img.shields.io/badge/Data-Link-blue)](https://justchenhao.github.io/LEVIR/) |


## 📏 Evaluation Metrics

### Perception Metrics

#### Full-Reference Metrics

| # | Metric | Description | Source |
|---|--------|-------------|--------|
| 1 | **PSNR** | Peak Signal-to-Noise Ratio. Measures the ratio between the maximum possible power of a signal and the power of corrupting noise. Calculated as PSNR = 10·log₁₀(MAX²/MSE). | [![Wikipedia](https://img.shields.io/badge/Wikipedia-Link-blue)](https://en.wikipedia.org/wiki/Peak_signal-to-noise_ratio) |
| 2 | **SSIM** | Structural Similarity Index. Assesses image quality based on luminance, contrast, and structure. Designed to improve on PSNR by considering structural information. | [![Paper](https://img.shields.io/badge/Paper-Link-blue)](https://ieeexplore.ieee.org/document/1284395) |
| 3 | **LPIPS** | Learned Perceptual Image Patch Similarity. Uses deep neural network features to compute perceptual distance between images, better aligned with human perception. | [![arXiv](https://img.shields.io/badge/arXiv-1801.03924-b31b1b)](https://arxiv.org/abs/1801.03924) |
| 4 | **DISTS** | Deep Image Structure and Texture Similarity. Combines structure and texture similarity using deep features for better perceptual quality assessment. | [![arXiv](https://img.shields.io/badge/arXiv-2004.07728-b31b1b)](https://arxiv.org/abs/2004.07728) |

#### Reduced-Reference Metrics

| # | Metric | Description | Source |
|---|--------|-------------|--------|
| 1 | **RRED** | Reduced-Reference Entropic Differencing. Uses entropic differences between wavelet coefficients, requiring only partial statistical features from reference. | [![Paper](https://img.shields.io/badge/Paper-Link-blue)](https://ieeexplore.ieee.org/document/5999718) |
| 2 | **RR-SSIM** | Reduced-Reference SSIM. Extracts and transmits only key structural features (edge information, local statistics) from reference image. | [![Paper](https://img.shields.io/badge/Paper-Link-blue)](https://ieeexplore.ieee.org/document/6193206) |

#### No-Reference Metrics

| # | Metric | Description | Source |
|---|--------|-------------|--------|
| 1 | **NIQE** | Natural Image Quality Evaluator. Measures deviation from statistical regularities in natural images using natural scene statistics (NSS). Completely blind quality assessment. | [![Paper](https://img.shields.io/badge/Paper-Link-blue)](https://ieeexplore.ieee.org/document/6353522) |
| 2 | **FID** | Fréchet Inception Distance. Calculates Fréchet distance between feature distributions of real and generated images in Inception-v3 space. Lower FID indicates better quality and diversity. | [![arXiv](https://img.shields.io/badge/arXiv-1706.08500-b31b1b)](https://arxiv.org/abs/1706.08500) |
| 3 | **KID** | Kernel Inception Distance. Unbiased alternative to FID using polynomial kernel on Inception features. More reliable for small sample sizes. | [![arXiv](https://img.shields.io/badge/arXiv-1801.01401-b31b1b)](https://arxiv.org/abs/1801.01401) |
| 4 | **IS** | Inception Score. Evaluates both quality (classification confidence) and diversity (marginal class distribution). | [![arXiv](https://img.shields.io/badge/arXiv-1606.03498-b31b1b)](https://arxiv.org/abs/1606.03498) |
| 5 | **MUSIQ** | Multi-scale Image Quality Transformer. Handles native-resolution images via multi-scale patch embedding without fixed-size cropping, enabling more robust no-reference quality assessment. | [![arXiv](https://img.shields.io/badge/arXiv-2108.05997-b31b1b)](https://arxiv.org/abs/2108.05997) [![GitHub](https://img.shields.io/github/stars/google-research/google-research?style=social)](https://github.com/google-research/google-research/tree/master/musiq) |
| 6 | **CLIP-IQA** | Leverages CLIP's vision-language representations for no-reference image quality and aesthetic assessment via prompt-based antonym pairing. | [![arXiv](https://img.shields.io/badge/arXiv-2207.12396-b31b1b)](https://arxiv.org/abs/2207.12396) [![GitHub](https://img.shields.io/github/stars/IceClear/CLIP-IQA?style=social)](https://github.com/IceClear/CLIP-IQA) |

### Semantic Metrics

| # | Metric | Description | Source |
|---|--------|-------------|--------|
| 1 | **CLIPScore** | Measures text-image alignment using CLIP embeddings. Computed as cosine similarity between CLIP image and text features. | [![arXiv](https://img.shields.io/badge/arXiv-2104.08718-b31b1b)](https://arxiv.org/abs/2104.08718) |
| 2 | **ViTScore** | Uses Vision Transformer features to evaluate semantic similarity between images. Captures high-level semantic content beyond pixel-level differences. | [![arXiv](https://img.shields.io/badge/arXiv-2309.04891-b31b1b)](https://arxiv.org/abs/2309.04891) |
| 3 | **SeSS** | Semantic Similarity Score. Based on Scene Graph Generation and graph matching, shifts image similarity scores into semantic-level graph matching scores. | [![arXiv](https://img.shields.io/badge/arXiv-2406.03865-b31b1b)](https://arxiv.org/abs/2406.03865) |
| 4 | **DreamSim** | Learned perceptual metric trained on synthetic triplet judgments from diffusion models, capturing mid-level semantic similarity beyond low-level texture. | [![arXiv](https://img.shields.io/badge/arXiv-2306.09344-b31b1b)](https://arxiv.org/abs/2306.09344) [![GitHub](https://img.shields.io/github/stars/ssundaram21/dreamsim?style=social)](https://github.com/ssundaram21/dreamsim) |
| 5 | **ImageReward** | Text-image alignment metric learned from human preference rankings via reward modeling, designed to evaluate text-to-image generation quality. | [![arXiv](https://img.shields.io/badge/arXiv-2304.05977-b31b1b)](https://arxiv.org/abs/2304.05977) [![GitHub](https://img.shields.io/github/stars/THUDM/ImageReward?style=social)](https://github.com/THUDM/ImageReward) |
| 6 | **HPSv2** | Human Preference Score v2. Fine-tuned CLIP model predicting human aesthetic preferences for generated images, trained on large-scale human choice data. | [![arXiv](https://img.shields.io/badge/arXiv-2306.09341-b31b1b)](https://arxiv.org/abs/2306.09341) [![GitHub](https://img.shields.io/github/stars/tgxs002/HPSv2?style=social)](https://github.com/tgxs002/HPSv2) |
| 7 | **PickScore** | Preference-based scoring model trained on the Pick-a-Pic dataset of human pairwise preferences for text-to-image generation. | [![arXiv](https://img.shields.io/badge/arXiv-2305.01569-b31b1b)](https://arxiv.org/abs/2305.01569) [![GitHub](https://img.shields.io/github/stars/yuvalkirstain/PickScore?style=social)](https://github.com/yuvalkirstain/PickScore) |


## 🔗 Other Resources

### 📚 Comprehensive Books, Surveys & Tutorials

#### Diffusion Models
| # | Paper | Authors | Year | Links |
|---|-------|-------|------|-------|
| 1 | **Understanding Diffusion Models: A Unified Perspective** | Luo et al. | 2022 | [![arXiv](https://img.shields.io/badge/arXiv-2208.11970-b31b1b)](https://arxiv.org/abs/2208.11970) |
| 2 | **Diffusion Models: A Comprehensive Survey of Methods and Applications** | Yang et al. | 2022 | [![arXiv](https://img.shields.io/badge/arXiv-2209.00796-b31b1b)](https://arxiv.org/abs/2209.00796) |
| 3 | **Diffusion Models in Vision: A Survey** | Croitoru et al. | 2022 | [![arXiv](https://img.shields.io/badge/arXiv-2209.04747-b31b1b)](https://arxiv.org/abs/2209.04747) |
| 4 | **A Survey on Generative Diffusion Models** | Cao et al. | 2022 | [![arXiv](https://img.shields.io/badge/arXiv-2209.02646-b31b1b)](https://arxiv.org/abs/2209.02646) [![GitHub](https://img.shields.io/github/stars/chq1155/A-Survey-on-Generative-Diffusion-Model?style=social)](https://github.com/chq1155/A-Survey-on-Generative-Diffusion-Model) |
| 5 | **A Survey on Video Diffusion Models** | Xing et al. | 2023 | [![arXiv](https://img.shields.io/badge/arXiv-2310.10647-b31b1b)](https://arxiv.org/abs/2310.10647) [![GitHub](https://img.shields.io/github/stars/ChenHsing/Awesome-Video-Diffusion-Models?style=social)](https://github.com/ChenHsing/Awesome-Video-Diffusion-Models) |
| 6 | **Diffusion Models for Image Restoration and Enhancement: A Comprehensive Survey** | Li et al. | 2023 | [![arXiv](https://img.shields.io/badge/arXiv-2308.09388-b31b1b)](https://arxiv.org/abs/2308.09388) |
| 7 | **Efficient Diffusion Models: A Comprehensive Survey From Principles to Practices** | Ma et al. | 2024 | [![arXiv](https://img.shields.io/badge/arXiv-2410.11795-b31b1b)](https://arxiv.org/abs/2410.11795) |
| 8 | **Diffusion Model-Based Image Editing: A Survey** | Huang et al. | 2024 | [![arXiv](https://img.shields.io/badge/arXiv-2402.17525-b31b1b)](https://arxiv.org/abs/2402.17525) [![GitHub](https://img.shields.io/github/stars/SiatMMLab/Awesome-Diffusion-Model-Based-Image-Editing-Methods?style=social)](https://github.com/SiatMMLab/Awesome-Diffusion-Model-Based-Image-Editing-Methods) |
| 9 | **Diffusion Models in Low-Level Vision: A Survey** | He et al. | 2024 | [![arXiv](https://img.shields.io/badge/arXiv-2406.11138-b31b1b)](https://arxiv.org/abs/2406.11138) [![GitHub](https://img.shields.io/github/stars/ChunmingHe/awesome-diffusion-models-in-low-level-vision?style=social)](https://github.com/ChunmingHe/awesome-diffusion-models-in-low-level-vision) |
| 10 | **Diffusion Models in 3D Vision: A Survey** | Wang et al. | 2024 | [![arXiv](https://img.shields.io/badge/arXiv-2410.04738-b31b1b)](https://arxiv.org/abs/2410.04738) |
| 11 | **Understanding Reinforcement Learning-Based Fine-Tuning of Diffusion Models: A Tutorial and Review** | Uehara et al. | 2024 | [![arXiv](https://img.shields.io/badge/arXiv-2407.13734-b31b1b)](https://arxiv.org/abs/2407.13734) [![GitHub](https://img.shields.io/github/stars/masa-ue/RLfinetuning_Diffusion_Bioseq?style=social)](https://github.com/masa-ue/RLfinetuning_Diffusion_Bioseq) |
| 12 | **Efficient Diffusion Models: A Survey** | Shen et al. | 2025 | [![arXiv](https://img.shields.io/badge/arXiv-2502.06805-b31b1b)](https://arxiv.org/abs/2502.06805) [![GitHub](https://img.shields.io/github/stars/AIoT-MLSys-Lab/Efficient-Diffusion-Model-Survey?style=social)](https://github.com/AIoT-MLSys-Lab/Efficient-Diffusion-Model-Survey) |
| 13 | **A Survey on Diffusion Language Models** | Li et al. | 2025 | [![arXiv](https://img.shields.io/badge/arXiv-2508.10875-b31b1b)](https://arxiv.org/abs/2508.10875) [![GitHub](https://img.shields.io/github/stars/VILA-Lab/Awesome-DLMs?style=social)](https://github.com/VILA-Lab/Awesome-DLMs) |
| 14 | **The Principles of Diffusion Models** | Lai et al. | 2025 | [![arXiv](https://img.shields.io/badge/arXiv-2510.21890-b31b1b)](https://arxiv.org/abs/2510.21890) |
| 15 | **Flow Matching Guide and Code** | Lipman et al. | 2024 | [![arXiv](https://img.shields.io/badge/arXiv-2412.06264-b31b1b)](https://arxiv.org/abs/2412.06264) [![GitHub](https://img.shields.io/github/stars/facebookresearch/flow_matching?style=social)](https://github.com/facebookresearch/flow_matching) |
| 16 | **An Introduction to Flow Matching and Diffusion Models** | Holderrieth & Erives | 2025 | [![arXiv](https://img.shields.io/badge/arXiv-2506.02070-b31b1b)](https://arxiv.org/abs/2506.02070) [![Project Page](https://img.shields.io/badge/Project-Page-green.svg)](https://diffusion.csail.mit.edu/) |

#### Semantic Communications
| # | Paper | Authors | Year | Links |
|---|-------|-------|------|-------|
| 1 | **Toward Wisdom-Evolutionary and Primitive-Concise 6G: A New Paradigm of Semantic Communication Networks** | Zhang et al. | 2022 | [![Paper](https://img.shields.io/badge/Paper-Link-blue)](https://www.sciencedirect.com/science/article/pii/S2095809921004513) |
| 2 | **Semantic Communications for Future Internet: Fundamentals, Applications, and Challenges** | Yang et al. | 2022 | [![arXiv](https://img.shields.io/badge/arXiv-2207.00427-b31b1b)](https://arxiv.org/abs/2207.00427) |
| 3 | **Beyond Transmitting Bits: Context, Semantics, and Task-Oriented Communications** | Gunduz et al. | 2022 | [![arXiv](https://img.shields.io/badge/arXiv-2207.09353-b31b1b)](https://arxiv.org/abs/2207.09353) |
| 4 | **Semantics-Empowered Communications: A Tutorial-Cum-Survey** | Lu et al. | 2022 | [![arXiv](https://img.shields.io/badge/arXiv-2212.08487-b31b1b)](https://arxiv.org/abs/2212.08487) |
| 5 | **Less Data, More Knowledge: Building Next Generation Semantic Communication Networks** | Chaccour et al. | 2022 | [![arXiv](https://img.shields.io/badge/arXiv-2211.14343-b31b1b)](https://arxiv.org/abs/2211.14343) |
| 6 | **Enhancing Deep Reinforcement Learning: A Tutorial on Generative Diffusion Models in Network Optimization** | Du et al. | 2023 | [![arXiv](https://img.shields.io/badge/arXiv-2308.05384-b31b1b)](https://arxiv.org/abs/2308.05384) |
| 7 | **A Survey on Semantic Communication Networks: Architecture, Security, and Privacy** | Guo et al. | 2024 | [![arXiv](https://img.shields.io/badge/arXiv-2405.01221-b31b1b)](https://arxiv.org/abs/2405.01221) |
| 8 | **Resource Management, Security, and Privacy Issues in Semantic Communications: A Survey** | Won et al. | 2024 | [![Paper](https://img.shields.io/badge/Paper-Link-blue)](https://ieeexplore.ieee.org/abstract/document/10704713) |
| 9 | **Generative AI-Driven Semantic Communication Networks: Architecture, Technologies, and Applications** | Liang et al. | 2024 | [![arXiv](https://img.shields.io/badge/arXiv-2401.00124-b31b1b)](https://arxiv.org/abs/2401.00124) |
| 10 | **A Contemporary Survey on Semantic Communications: Theory of Mind, Generative AI, and Deep Joint Source-Channel Coding** | Nguyen et al. | 2025 | [![arXiv](https://img.shields.io/badge/arXiv-2502.16468-b31b1b)](https://arxiv.org/abs/2502.16468) |
| 11 | **Generative Diffusion Models for Wireless Networks: Fundamental, Architecture, and State-of-the-Art** | Fan et al. | 2025 | [![arXiv](https://img.shields.io/badge/arXiv-2507.16733-b31b1b)](https://arxiv.org/abs/2507.16733) |
| 12 | **Resource Allocation in Wireless Semantic Communications: A Comprehensive Survey** | Zhang et al. | 2025 | [![Paper](https://img.shields.io/badge/Paper-Link-blue)](https://ieeexplore.ieee.org/abstract/document/11111676) |

### 📺 Courses & Video Lectures

| # | Title | Source | Type | Links |
|---|-------|-------------------------|------|-------|
| 1 | **Stanford CS236: Deep Generative Models** | Stefano Ermon et al. | University Course | [![Project Page](https://img.shields.io/badge/Project-Page-green.svg)](https://deepgenerativemodels.github.io/) |
| 2 | **MIT 6.S978: Deep Generative Models** | Kaiming He et al. | University Course | [![Project Page](https://img.shields.io/badge/Project-Page-green.svg)](https://mit-6s978.github.io/) |
| 3 | **MIT 6.S184: Introduction to Flow Matching and Diffusion Models** | Peter Holderrieth & Ezra Erives | University Course | [![arXiv](https://img.shields.io/badge/arXiv-2506.02070-b31b1b)](https://arxiv.org/abs/2506.02070) [![Project Page](https://img.shields.io/badge/Project-Page-green.svg)](https://diffusion.csail.mit.edu/) |
| 4 | **Diffusion Models Course** | Hugging Face | Online Course | [![GitHub](https://img.shields.io/github/stars/huggingface/diffusion-models-class?style=social)](https://github.com/huggingface/diffusion-models-class) |
| 5 | **NeurIPS 2023 Workshop: Diffusion Models** | NeurIPS | Workshop | [![Project Page](https://img.shields.io/badge/Project-Page-green.svg)](https://neurips.cc/virtual/2023/workshop/66539) |
| 6 | **Diffusion and Score-Based Generative Models** | Yang Song | Lecture | [![YouTube](https://img.shields.io/badge/Watch-Video-red.svg)](https://www.youtube.com/watch?v=wMmqCMwuM2Q) |
| 7 | **Two Minute Papers – Diffusion Series** | Two Minute Papers | YouTube Series | [![YouTube](https://img.shields.io/badge/Watch-Video-red.svg)](https://www.youtube.com/@TwoMinutePapers) |
| 8 | **Generative Modeling by Estimating Gradients of the Data Distribution** | Yang Song | Blog Post | [![Project Page](https://img.shields.io/badge/Project-Page-green.svg)](https://yang-song.net/blog/2021/score/) |
| 9 | **What are Diffusion Models?** | Lilian Weng | Blog Post | [![Project Page](https://img.shields.io/badge/Project-Page-green.svg)](https://lilianweng.github.io/posts/2021-07-11-diffusion-models/) |

### 🧰 Interactive Demos & Tools

| # | Tool | Type | What it’s great for | Links |
|---|------|------|---------------------|-------|
| 1 | **Stable Diffusion WebUI (AUTOMATIC1111)** | UI + Extensions | Local UI with huge plugin ecosystem | [![GitHub](https://img.shields.io/github/stars/AUTOMATIC1111/stable-diffusion-webui?style=social)](https://github.com/AUTOMATIC1111/stable-diffusion-webui) |
| 2 | **InvokeAI** | Pro UI | Studio-style creative workflow & editing | [![GitHub](https://img.shields.io/github/stars/invoke-ai/InvokeAI?style=social)](https://github.com/invoke-ai/InvokeAI) |
| 3 | **🤗 Diffusers** | Library | Clean Python API for diffusion inference & training | [![GitHub](https://img.shields.io/github/stars/huggingface/diffusers?style=social)](https://github.com/huggingface/diffusers) |
| 4 | **Diffusers Playground (Hugging Face Spaces)** | Web demo | Try many pipelines online (no local install) | [![Project Page](https://img.shields.io/badge/Project-Page-green.svg)](https://huggingface.co/spaces/diffusers) |
| 5 | **ComfyUI** | Node-graph UI | Modular node-based pipelines for reproducible flows | [![GitHub](https://img.shields.io/github/stars/comfyanonymous/ComfyUI?style=social)](https://github.com/comfyanonymous/ComfyUI) |
| 6 | **StableStudio (Stability AI)** | Official UI | Frontend for SDXL / stability models | [![GitHub](https://img.shields.io/github/stars/Stability-AI/StableStudio?style=social)](https://github.com/Stability-AI/StableStudio) |
| 7 | **Fooocus** | Simple UI | One-click text→image with SDXL support | [![GitHub](https://img.shields.io/github/stars/lllyasviel/Fooocus?style=social)](https://github.com/lllyasviel/Fooocus) |
| 8 | **kohya-ss / sd-scripts** | Training / Finetune | LoRA, DreamBooth, finetuning helpers | [![GitHub](https://img.shields.io/github/stars/kohya-ss/sd-scripts?style=social)](https://github.com/kohya-ss/sd-scripts) |
| 9 | **ControlNet** | Conditioning model | Pose / edge / depth guided generation | [![GitHub](https://img.shields.io/github/stars/lllyasviel/ControlNet?style=social)](https://github.com/lllyasviel/ControlNet) |
|10 | **sd-webui-controlnet** | WebUI Extension | Easy ControlNet integration for WebUI | [![GitHub](https://img.shields.io/github/stars/Mikubill/sd-webui-controlnet?style=social)](https://github.com/Mikubill/sd-webui-controlnet) |

## 📝 Citation

If you find this article or repository helpful, please consider citing:

```bibtex
@article{qin-diffcomm,
    author  = {H. L. Qin and J. Dai and G. Lu and S. Shao and S. Wang and T. Xu and W. Zhang and P. Zhang and K. B. Letaief},
    title   = {Generative AI Meets 6G and Beyond: Diffusion Models for Semantic Communications},
    journal = {arXiv preprint arXiv:2511.08416},
    year    = {2025}
}
```

**Related Papers from Our Group**

```bibtex
@article{dai-gaicomm,
	author  = {J. Dai and X. Qin and S. Wang and L. Xu and K. Niu and P. Zhang},
	title   = {Deep Generative Modeling Reshapes Compression and Transmission: From Efficiency to Resiliency},
	journal = {IEEE Wireless Commun.},
	volume  = {31},
	number  = {4},
	pages   = {48--56},
	year    = {2024}
}
```
```bibtex
@article{wang-diffcom,
	author  = {S. Wang and J. Dai and K. Tan and X. Qin and K. Niu and P. Zhang},
	title   = {DiffCom: Channel Received Signal is a Natural Condition to Guide Diffusion Posterior Sampling},
	journal = {IEEE J. Sel. Areas Commun.},
	volume  = {43},
	number  = {7},
	pages   = {2651--2666},
	year    = {2025}
}
```
```bibtex
@article{qin-semcod,
    author  = {H. L. Qin and J. Dai and S. Wang and X. Qin and S. Shao and K. Niu and W. Xu and P. Zhang},
    title   = {Neural Coding is Not Always Semantic: Toward the Standardized Coding Workflow in Semantic Communications},
    journal = {IEEE Commun. Stand. Mag.},
    volume  = {9},
    number  = {4},
    pages   = {24--33},
    year    = {2025}
}
```
```bibtex
@article{tan-ditjscc,
    author  = {K. Tan and J. Dai and S. Wang and G. Lu and S. Shao and K. Niu and W. Zhang and P. Zhang},
    title   = {DiT-JSCC: Rethinking Deep JSCC with Diffusion Transformers and Semantic Representations},
    journal = {arXiv preprint arXiv:2601.03112},
    year    = {2026}
}
```

## 🌟 Acknowledgments

<div align="justify">

We thank the diffusion models and semantic communications research communities for their groundbreaking work. Special thanks to all and future contributors to this repository.

</div>

<!-- [![Star History Chart](https://api.star-history.com/svg?repos=qin-jingyun/Awesome-DiffComm&type=date&legend=top-left)](https://www.star-history.com/#qin-jingyun/Awesome-DiffComm&type=date&legend=top-left) -->

<div align="center">

<p>
  <b>⭐ Star this repo if you find it useful! ⭐</b><br>
  <p>
    <a href="#top">
      <img src="https://img.shields.io/badge/Back%20to%20Top-Thanks-blue?style=for-the-badge" alt="Back to Top">
    </a>
  </p>
</p>

<p>
  <p>
    Maintained with ❤️ by the community members:
  </p>
  <a href="https://github.com/qin-jingyun/SemCod/graphs/contributors">
    <img src="https://contrib.rocks/image?repo=qin-jingyun/SemCod" alt="Contributors" />
  </a>
</p>

</div>