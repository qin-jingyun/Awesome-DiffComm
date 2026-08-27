// --- I18n Translation System for DiffComm Tutorial ---
var translations = {
en: {
    // ===== Metadata =====
    pageTitle: "Diffusion Models for Semantic Communications",
    paperTitle: "Generative AI Meets 6G and Beyond: Diffusion Models for Semantic Communications",
    related_links_btn: "Related links",
    author_1: 'Hai-Long Qin<sup>1</sup>',
    author_2: 'Jincheng Dai<sup>1</sup>',
    author_3: 'Guo Lu<sup>2</sup>',
    author_4: 'Shuo Shao<sup>3</sup>',
    author_5: 'Sixian Wang<sup>2</sup>',
    author_6: 'Tongda Xu<sup>4</sup>',
    author_7: 'Wenjun Zhang<sup>2</sup>',
    author_8: 'Ping Zhang<sup>1</sup>',
    author_9: 'Khaled B. Letaief<sup>5</sup>',
    affiliation1: "<sup>1</sup>Beijing University of Posts and Telecommunications (BUPT)",
    affiliation2: "<sup>2</sup>Shanghai Jiao Tong University (SJTU)",
    affiliation3: "<sup>3</sup>East China Normal University (ECNU)",
    affiliation4: "<sup>4</sup>Tsinghua University (THU)",
    affiliation5: "<sup>5</sup>Hong Kong University of Science and Technology (HKUST)",
    venueInfo: "Accepted by IEEE Communications Surveys &amp; Tutorials (COMST), 2026",
    btn_paper: "Paper",
    tooltip_cite: "Cite this paper",
    tooltip_lang: "Language",

    // ===== Navigation =====
    nav_tldr: "TL;DR",
    nav_prelim: "Preliminaries",
    nav_fundamentals: "Fundamentals",
    nav_conditional: "Conditional DMs",
    nav_efficient: "Efficient DMs",
    nav_generalized: "Generalized DMs",
    nav_references: "References",

    // ===== TL;DR =====
    tldr_content: `<p>This is a companion tutorial page for the IEEE COMST paper <a href="https://arxiv.org/abs/2511.08416" target="_blank"><i>"Generative AI Meets 6G and Beyond: Diffusion Models for Semantic Communications"</i></a> (arXiv: 2511.08416). Semantic communications represent a paradigm shift from bit-accurate transmission to meaning-centric communication, where receivers reconstruct content from compact semantic representations rather than raw bitstreams. Among generative models, diffusion models stand out for their superior generation quality, stable training dynamics, and rigorous theoretical underpinnings, making them particularly well suited as the decoding backbone for generative semantic communication systems.</p>
<p><b>What you will learn:</b></p>
<ol>
<li><b>Fundamentals of Diffusion Models</b>: Score matching, Langevin dynamics, stochastic differential equations (SDEs), and probability flow ODE solvers.</li>
<li><b>Conditional Diffusion Models</b>: Classifier guidance, estimator guidance (including diffusion posterior sampling for inverse problems), and classifier-free guidance for controllable generation.</li>
<li><b>Efficient Diffusion Models</b>: Dimensionality reduction, knowledge distillation, structure pruning, cache reuse, and flow matching strategies for accelerating diffusion inference.</li>
<li><b>Generalized Diffusion Models</b>: Modality expansion, domain adaptation, and task generalization that extend diffusion models beyond image generation.</li>
</ol>`,

    // ===== §2 Preliminaries =====
    prelim_title: "Preliminaries",
    prelim_dgm_title: "",
    prelim_models_title: "",
    intro_p1: `<p>A foundational distinction in machine learning separates <b>discriminative</b> from <b>generative</b> modeling. Discriminative models learn decision boundaries between classes, while generative models learn the joint distribution over all variables to fit the underlying data distribution. Generative models simulate real-world data generation processes and offer two key advantages: (1) they power AI-generated content (AIGC) applications and unsupervised representation learning that extracts disentangled, semantically meaningful factors of variation; (2) they can incorporate physical laws and constraints while treating unknown details as noise, making them intuitive and interpretable.</p>
<p>Let $\\mathcal{X} \\subset \\mathbb{R}^D$ denote the data space with dimensionality $D \\in \\mathbb{N}^+$. The true data distribution $p_{\\mathrm{data}}(\\mathbf{x}): \\mathbb{R}^D \\to \\mathbb{R}_{\\geqslant 0}$ satisfies $\\int_{\\mathbb{R}^D} p_{\\mathrm{data}}(\\mathbf{x}) \\,\\mathrm{d}\\mathbf{x} = 1$, where $\\mathbf{x} = (x_1, \\ldots, x_D)^{\\top} \\in \\mathbb{R}^D$ is a data point. The goal of generative modeling is to estimate $p_{\\mathrm{data}}(\\mathbf{x})$ from a dataset $\\{\\mathbf{x}_i\\}_{i=1}^{N}$, enabling both sampling and probability evaluation. A parametric model $p_{\\boldsymbol{\\theta}}(\\mathbf{x}): \\mathbb{R}^D \\to \\mathbb{R}_{\\geqslant 0}$ with $P \\in \\mathbb{N}^+$ parameters $\\boldsymbol{\\theta} \\in \\Theta \\subset \\mathbb{R}^P$ serves as a proxy for $p_{\\mathrm{data}}(\\mathbf{x})$, and the objective is to find optimal parameters $\\boldsymbol{\\theta}^{\\star}$ such that $p_{\\boldsymbol{\\theta}^{\\star}}(\\mathbf{x}) \\approx p_{\\mathrm{data}}(\\mathbf{x})$. When such models are parameterized by deep neural networks (DNNs), they become <b>deep generative models</b>.</p>
<p>A valid probability distribution requires $p_{\\boldsymbol{\\theta}}(\\mathbf{x})$ to satisfy two properties: (1) <b>Non-negativity</b>: $\\forall \\mathbf{x} \\in \\mathbb{R}^D: p_{\\boldsymbol{\\theta}}(\\mathbf{x}) \\geqslant 0$; (2) <b>Normalization</b>: $\\int_{\\mathbb{R}^D} p_{\\boldsymbol{\\theta}}(\\mathbf{x})\\,\\mathrm{d}\\mathbf{x} = 1$. While non-negativity is easy to enforce, normalization poses a serious challenge: it demands integration over the entire high-dimensional data space, which is typically intractable for complex models. This fundamental difficulty motivates the specialized strategies employed by modern deep generative models.</p>`,

    intro_p2: `<p><b>Energy Models.</b> When exact normalization is intractable, <i>approximation</i> becomes necessary. Energy models parameterize distributions via Boltzmann machines, inspired by Boltzmann distributions in statistical physics: $p_{\\boldsymbol{\\theta}}(\\mathbf{x}) = \\exp(-\\beta E_{\\boldsymbol{\\theta}}(\\mathbf{x})) / Z_{\\boldsymbol{\\theta}}$, where $E_{\\boldsymbol{\\theta}}(\\mathbf{x})$ is an energy function (e.g., the potential energy $-\\log p_{\\boldsymbol{\\theta}}(\\mathbf{x})$), $\\beta$ is a positive constant analogous to inverse temperature, and $Z_{\\boldsymbol{\\theta}} = \\int \\exp(-\\beta E_{\\boldsymbol{\\theta}}(\\mathbf{x}))\\,\\mathrm{d}\\mathbf{x}$ is the partition function ensuring normalization. The energy function can be freely parameterized by DNNs without normalization constraints, but evaluating $Z_{\\boldsymbol{\\theta}}$ involves intractable high-dimensional integration. Fortunately, Markov chain Monte Carlo (MCMC) enables approximate training without computing $Z_{\\boldsymbol{\\theta}}$ explicitly. Even so, probability evaluation still requires estimating $Z_{\\boldsymbol{\\theta}}$, which inevitably introduces estimation errors.</p>
<p><b>Explicit Models.</b> Rather than approximating normalization, one can enforce it through explicit formulations. Two representative families are <b>Autoregressive Models (ARMs)</b> and <b>Variational Autoencoders (VAEs)</b>.</p>
<p><i>ARMs</i> leverage the probability chain rule to factorize high-dimensional distributions into products of univariate conditionals: $p_{\\boldsymbol{\\theta}}(\\mathbf{x}) = \\prod_{i=1}^D p_{\\boldsymbol{\\theta}}(x_i | \\mathbf{x}_{&lt;i})$, where $\\mathbf{x}_{&lt;i} = \\{x_1, \\ldots, x_{i-1}\\}$. This factorization guarantees exact normalization whenever each conditional is properly normalized. However, autoregressive factorization imposes a sequential ordering on data dimensions. While natural for sequential data (e.g., text, audio), many domains lack inherent ordering (e.g., pixel arrangements in images), limiting architectural flexibility. As a result, ARMs excel at sequential data generation but face challenges with ultra-high-resolution images and videos.</p>
<p><i>VAEs</i> achieve exact normalization by introducing an auxiliary latent variable $\\mathbf{z} \\sim p(\\mathbf{z})$ to model the data distribution: $p_{\\boldsymbol{\\theta}}(\\mathbf{x}) = \\int p(\\mathbf{z})\\,p_{\\boldsymbol{\\theta}}(\\mathbf{x}|\\mathbf{z})\\,\\mathrm{d}\\mathbf{z}$, which can be interpreted as an infinite mixture model where $p(\\mathbf{z})$ provides mixture coefficients and $p_{\\boldsymbol{\\theta}}(\\mathbf{x}|\\mathbf{z})$ defines mixture components. An encoder $q_{\\boldsymbol{\\phi}}(\\mathbf{z}|\\mathbf{x})$ approximates the intractable posterior via <i>variational inference</i>, and training maximizes the Evidence Lower BOund (ELBO). Normalization is guaranteed when both $p(\\mathbf{z})$ and $p_{\\boldsymbol{\\theta}}(\\mathbf{x}|\\mathbf{z})$ are normalized, but generated samples often appear blurred due to the looseness of the variational bound.</p>
<p><b>Implicit Models.</b> The normalization challenge originates from modeling probability density or mass functions, and can be sidestepped entirely by representing the distribution implicitly. <b>Generative Adversarial Networks (GANs)</b> are the most prominent family of implicit models: they directly model the sampling process, bypassing normalization altogether. GANs model data generation as a two-step process: first sample $\\mathbf{z} \\sim p(\\mathbf{z})$ from a simple prior, then transform it via a deterministic generator $G_{\\boldsymbol{\\theta}}$ to obtain $\\mathbf{x} = G_{\\boldsymbol{\\theta}}(\\mathbf{z})$. The distribution $p_{\\boldsymbol{\\theta}}(\\mathbf{x})$ is implicitly defined without direct parameterization. Training employs an adversarial discriminator $D_{\\boldsymbol{\\phi}}: \\mathbb{R}^D \\to [0, 1]$ that distinguishes real data from generated samples, while the generator tries to fool the discriminator. GANs require no special architectural constraints for normalization and can leverage flexible DNNs, but they cannot produce probability values. Moreover, adversarial training often suffers from instability and mode collapse, where the generator captures only a few data modes and fails to represent the full data diversity.</p>`,

    intro_table: `<table class="content-table">
<thead><tr><th>Category</th><th>Strategy</th><th>Key Advantage</th><th>Key Limitation</th></tr></thead>
<tbody>
<tr><td><b>Energy Models</b></td><td>Approximate normalization via MCMC sampling</td><td>Flexible energy parameterization by DNNs</td><td>Intractable partition function $Z_{\\boldsymbol{\\theta}}$; probability evaluation requires estimation</td></tr>
<tr><td><b>Explicit Models</b> (ARMs, VAEs)</td><td>Enforce normalization through explicit formulations (chain rule or latent variables)</td><td>Exact normalization &amp; tractable likelihoods</td><td>ARMs: sequential sampling, requires ordering; VAEs: blurred reconstructions due to variational bound</td></tr>
<tr><td><b>Implicit Models</b> (GANs)</td><td>Model the sampling process directly, bypassing density parameterization</td><td>Sharp perceptual quality; no normalization needed</td><td>Mode collapse, training instability; no probability values</td></tr>
<tr><td><b>Score Models</b></td><td>Learn score function (log-density gradient) $\\boldsymbol{s}(\\mathbf{x}) := \\nabla_{\\mathbf{x}} \\log p(\\mathbf{x})$</td><td>Completely oblivious to normalization</td><td>Requires score matching techniques; foundation of diffusion models</td></tr>
</tbody></table>`,

    intro_p3: `<p><b>Score models</b> have emerged as a state-of-the-art paradigm that circumvents the key limitations of previous deep generative models. Rather than modeling normalized distributions or relying on adversarial training, score models learn the <b>score function</b> $\\boldsymbol{s}(\\mathbf{x}) := \\nabla_{\\mathbf{x}} \\log p(\\mathbf{x})$, the gradient of the log-density. A neural network estimates this quantity iteratively, yielding $\\boldsymbol{s}_{\\boldsymbol{\\theta}}(\\mathbf{x})$ with parameters $\\boldsymbol{\\theta}$.</p>
<p>The score model is essentially a conservative vector field. In physics, the score $\\nabla_{\\mathbf{x}} \\log p(\\mathbf{x})$ corresponds to the negative gradient of potential energy $-\\log p(\\mathbf{x})$, acting as a "force" that drives samples toward high-probability regions. This interpretation is operationalized by parameterizing an energy function $E_{\\boldsymbol{\\theta}}(\\mathbf{x})$ with a neural network, then constructing the score model as $\\boldsymbol{s}_{\\boldsymbol{\\theta}}(\\mathbf{x}) = -\\nabla_{\\mathbf{x}} E_{\\boldsymbol{\\theta}}(\\mathbf{x})$.</p>
<p>Crucially, score functions are <b>oblivious to normalization</b>. For an unnormalized density $\\tilde{p}(\\mathbf{x})$ with $\\int \\tilde{p}(\\mathbf{x})\\,\\mathrm{d}\\mathbf{x} = Z \\ne 1$:</p>
$$\\boldsymbol{s}(\\mathbf{x}) = \\nabla_{\\mathbf{x}} \\log \\frac{\\tilde{p}(\\mathbf{x})}{Z} = \\nabla_{\\mathbf{x}} \\log \\tilde{p}(\\mathbf{x}) - \\underbrace{\\nabla_{\\mathbf{x}} \\log Z}_{=0} = \\nabla_{\\mathbf{x}} \\log \\tilde{p}(\\mathbf{x}),$$
<p>the normalization constant $Z$ vanishes entirely. Among score-based deep generative models, <b>diffusion models</b> are the most representative: they combine score-based modeling with stochastic differential equations to achieve state-of-the-art generation quality with stable training and flexible conditioning. Diffusion models are the central focus of this tutorial.</p>`,

    // ===== §3.1 Fundamentals of Diffusion Models =====
    fund_title: "Fundamentals of Diffusion Models",
    sm_title: "Score Matching &amp; Langevin Dynamics",
    sm_p1: `<p>As discussed above, learning unnormalized generative models is challenging due to the intractable partition function $Z_{\\boldsymbol{\\theta}}$. A natural question arises: how can we effectively train flexible score-based diffusion models from high-dimensional data? The answer lies in <b>score matching</b>, a well-established technique for estimating unnormalized statistical models and, more broadly, score models.</p>
<p>Score matching minimizes the distance between the scores of the data and model distributions. Since it operates directly on score functions, which are oblivious to the intractable partition function, no evaluation of $Z_{\\boldsymbol{\\theta}}$ is needed. From a statistical perspective, this amounts to minimizing the <b>Fisher divergence</b> between $p_{\\mathrm{data}}(\\mathbf{x})$ and $p_{\\boldsymbol{\\theta}}(\\mathbf{x})$:</p>
$$D_{F}(p_{\\mathrm{data}} \\parallel p_{\\boldsymbol{\\theta}}) := \\mathbb{E}_{p_{\\mathrm{data}}(\\mathbf{x})} \\left[ \\frac{1}{2} \\left\\| \\boldsymbol{s}(\\mathbf{x}) - \\boldsymbol{s}_{\\boldsymbol{\\theta}}(\\mathbf{x}) \\right\\|_2^2 \\right].$$
<p>Because $\\boldsymbol{s}_{\\boldsymbol{\\theta}}(\\mathbf{x})$ does not involve $Z_{\\boldsymbol{\\theta}}$, the Fisher divergence is free of this intractable term. However, directly computing the Fisher divergence remains infeasible since it requires access to the unknown ground-truth data score $\\boldsymbol{s}(\\mathbf{x})$. To work around this, the Fisher divergence can be reformulated via <b>integration by parts</b> (Hyv&auml;rinen, 2005), yielding an equivalent objective that eliminates dependence on the ground-truth score. Specifically, the divergence decomposes as $D_{F} = \\mathcal{L}(\\boldsymbol{\\theta}) + C$, where $C$ is a constant independent of $\\boldsymbol{\\theta}$, and the tractable loss function is:</p>
$$\\mathcal{L}(\\boldsymbol{\\theta}) := \\mathbb{E}_{p_{\\mathrm{data}}(\\mathbf{x})}\\left[ \\frac{1}{2} \\left\\| \\boldsymbol{s}_{\\boldsymbol{\\theta}}(\\mathbf{x}) \\right\\|_2^2 + \\mathrm{tr}(\\nabla_{\\mathbf{x}} \\boldsymbol{s}_{\\boldsymbol{\\theta}}(\\mathbf{x})) \\right],$$
<p>where $\\mathrm{tr}(\\cdot)$ denotes the matrix trace. Although this loss eliminates the ground-truth score, its practical implementation requires computing the trace of the <b>Hessian matrix</b> $\\mathrm{tr}(\\nabla_{\\mathbf{x}} \\boldsymbol{s}_{\\boldsymbol{\\theta}}(\\mathbf{x}))$, which involves expensive second-order derivatives in high-dimensional spaces. To sidestep this computational bottleneck, <b>Denoising Score Matching (DSM)</b> has become the standard approach for training score-based diffusion models.</p>`,

    sm_p2: `<p><b>Denoising Score Matching (DSM)</b> reformulates the score matching objective by introducing <i>controlled noise corruption</i> to the data. Instead of matching scores on the original data distribution, DSM operates on the noise-corrupted distribution $q(\\tilde{\\mathbf{x}}) = \\int_{\\mathbb{R}^D} p_{\\mathrm{data}}(\\mathbf{x})\\,q(\\tilde{\\mathbf{x}}|\\mathbf{x})\\,\\mathrm{d}\\mathbf{x}$, where $q(\\tilde{\\mathbf{x}}|\\mathbf{x})$ is the noise corruption kernel. The resulting DSM objective is:</p>
$$\\mathcal{J}(\\boldsymbol{\\theta}) := \\mathbb{E}_{p_{\\mathrm{data}}(\\mathbf{x})\\, q(\\tilde{\\mathbf{x}}|\\mathbf{x})} \\left[ \\frac{1}{2} \\left\\| \\nabla_{\\tilde{\\mathbf{x}}} \\log q(\\tilde{\\mathbf{x}}|\\mathbf{x}) - \\boldsymbol{s}_{\\boldsymbol{\\theta}}(\\tilde{\\mathbf{x}}) \\right\\|_2^2 \\right],$$
<p>which can be evaluated without computing any Hessian matrices. Note that DSM learns the score of the <b>noise-corrupted distribution</b> rather than the original data distribution. The noise corruption kernel $q(\\tilde{\\mathbf{x}}|\\mathbf{x})$ is typically implemented as additive Gaussian noise, chosen for its analytical tractability and favorable theoretical properties.</p>`,

    sm_p3: "",

    sm_deriv_title: "",
    sm_deriv_body: "",

    sm_langevin_title: "Langevin Dynamics",
    sm_langevin_p1: `<p>Once $\\boldsymbol{s}_{\\boldsymbol{\\theta}}(\\mathbf{x})$ has been trained, samples can be drawn through <b>Langevin dynamics</b>, an iterative sampling procedure rooted in statistical physics, originally formulated to describe Brownian motion of particles in a fluid.</p>
<p>Mathematically, Langevin dynamics implements a discrete MCMC procedure that initializes from an arbitrary prior distribution $\\mathbf{x}_0 \\sim \\pi(\\mathbf{x})$ and iteratively updates the sample for $i = 1, 2, \\ldots, N$:</p>
$$\\mathbf{x}_{i} = \\mathbf{x}_{i-1} + \\zeta\\, \\boldsymbol{s}_{\\boldsymbol{\\theta}}(\\mathbf{x}_{i-1}) + \\sqrt{2\\zeta}\\, \\boldsymbol{\\epsilon}, \\quad \\boldsymbol{\\epsilon} \\sim \\mathcal{N}(\\mathbf{0}, \\mathbf{I}),$$
<p>where $\\zeta$ is the step size, $\\boldsymbol{\\epsilon} \\sim \\mathcal{N}(\\mathbf{0}, \\mathbf{I})$ denotes standard Gaussian noise, and $\\mathbf{I}$ is the identity matrix. Each update has three components: the current position $\\mathbf{x}_{i-1}$; a <b>deterministic drift</b> toward higher-probability regions guided by the learned score $\\boldsymbol{s}_{\\boldsymbol{\\theta}}(\\mathbf{x}_{i-1})$; and <b>stochastic perturbations</b> $\\boldsymbol{\\epsilon}$ that prevent the dynamics from collapsing into local modes. When $\\zeta \\to 0$ and $N \\to \\infty$, the sampling endpoint $\\mathbf{x}_N$ converges exactly to the target distribution $p_{\\mathrm{data}}(\\mathbf{x})$ under mild regularity conditions.</p>`,

    viz1_title: "Interactive: Score Field &amp; Langevin Dynamics",
    viz_score_caption: "This interactive visualizes the score field $\\nabla_{\\mathbf{x}} \\log p(\\mathbf{x})$ of a balanced 2D Gaussian mixture with three modes $(\\mu_1, \\mu_2, \\mu_3)$ arranged across the full canvas with mixing weights $(\\pi_1,\\pi_2,\\pi_3)=(0.36,\\,0.32,\\,0.32)$. White arrows indicate the score direction and relative magnitude; contour lines mark iso-density levels; the bottom-left colorbar shows $\\|\\nabla \\log p\\|$. Click anywhere to seed particles. With <b>Stochastic</b> enabled the dynamics follow Langevin MCMC, $\\mathbf{x}_{i+1} = \\mathbf{x}_i + \\zeta\\,\\nabla \\log p(\\mathbf{x}_i) + \\sqrt{2\\zeta}\\,\\boldsymbol{\\epsilon}$, and particles explore <em>all</em> modes; disable it for pure gradient ascent (deterministic, mode-collapsing). The top-right panel reports the current step size $\\zeta$ and iteration count.",

    code_sm_title: "Python: Score Matching &amp; Langevin Sampling (for hands-on understanding of the DSM loss and iterative sampling)",
    code_sm_body: `<p>A minimal PyTorch implementation of denoising score matching and Langevin dynamics sampling:</p>
<div class="code-block"><div class="code-header"><span class="code-lang">Python</span><span>PyTorch</span></div><pre><span class="keyword">import</span> torch
<span class="keyword">import</span> torch.nn <span class="keyword">as</span> nn

<span class="keyword">def</span> <span class="function">denoising_score_matching_loss</span>(score_net, data, sigma=<span class="number">0.1</span>):
    <span class="string">"""DSM loss: train score_net to predict -eps/sigma from noisy data."""</span>
    noise = torch.randn_like(data)
    noisy_data = data + sigma * noise
    predicted_score = score_net(noisy_data)
    target = -noise / sigma  <span class="comment"># Ground-truth score of Gaussian corruption</span>
    <span class="keyword">return</span> <span class="number">0.5</span> * ((predicted_score - target) ** <span class="number">2</span>).sum(dim=-<span class="number">1</span>).mean()

<span class="keyword">def</span> <span class="function">langevin_sampling</span>(score_net, n_samples, n_steps, step_size, dim=<span class="number">2</span>):
    <span class="string">"""Generate samples via Langevin dynamics."""</span>
    x = torch.randn(n_samples, dim)
    <span class="keyword">for</span> _ <span class="keyword">in</span> <span class="builtin">range</span>(n_steps):
        score = score_net(x)
        noise = torch.randn_like(x)
        x = x + step_size * score + (<span class="number">2</span> * step_size) ** <span class="number">0.5</span> * noise
    <span class="keyword">return</span> x

<span class="comment"># Example usage</span>
score_net = nn.Sequential(nn.Linear(<span class="number">2</span>, <span class="number">128</span>), nn.ReLU(), nn.Linear(<span class="number">128</span>, <span class="number">2</span>))
optimizer = torch.optim.Adam(score_net.parameters(), lr=<span class="number">1e-3</span>)

<span class="keyword">for</span> epoch <span class="keyword">in</span> <span class="builtin">range</span>(<span class="number">1000</span>):
    data = <span class="function">sample_2d_data</span>(<span class="number">256</span>)  <span class="comment"># Your 2D dataset</span>
    loss = <span class="function">denoising_score_matching_loss</span>(score_net, data, sigma=<span class="number">0.1</span>)
    optimizer.zero_grad(); loss.backward(); optimizer.step()

samples = <span class="function">langevin_sampling</span>(score_net, <span class="number">500</span>, n_steps=<span class="number">1000</span>, step_size=<span class="number">0.01</span>)</pre></div>`,

    // §3.1.2 Score-Based Modeling with SDEs
    sde_title: "Score-Based Modeling with SDEs",
    sde_p1: `<p>Building on the standard score-based modeling pipeline, Song et al. introduced a unified framework that generalizes score matching and sampling through the lens of <b>stochastic differential equations (SDEs)</b>. Instead of perturbing data at a finite number of noise levels, this framework considers a continuum of intermediate distributions evolving over continuous time. The evolution follows a prescribed SDE that is independent of the data and contains no trainable parameters. The corresponding reverse-time SDE can then be derived and solved by training a time-dependent neural network to estimate the score function.</p>
<p><b>Perturbing Data with Forward SDEs.</b> To bridge discrete recursions and continuous-time SDEs, consider the natural progression from discrete to continuous dynamics:</p>
<ul>
<li><b>Discrete gradient descent:</b> $\\mathbf{x}_{i+1} = \\mathbf{x}_i - \\beta_i \\nabla f(\\mathbf{x}_i)$, where $\\beta_i$ is the step size at iteration $i$.</li>
<li><b>Continuous-time ODE:</b> Taking the step size to zero yields $\\frac{\\mathrm{d}\\mathbf{x}(t)}{\\mathrm{d}t} = -\\beta(t) \\nabla f(\\mathbf{x}(t))$, where $\\beta(t)$ is the continuous-time counterpart of the discrete step size.</li>
<li><b>Stochastic differential equation (SDE):</b> From a generative modeling perspective, deterministic dynamics alone cannot capture the stochastic nature of data distributions. Incorporating random perturbations via the <b>It&ocirc; calculus</b> framework, with noise $\\mathbf{n}(t)\\,\\mathrm{d}t = \\mathrm{d}\\mathbf{w}(t)$ where $\\mathbf{w}(t)$ is a standard <b>Wiener process</b> (with independent Gaussian increments $\\mathbf{w}(t+\\Delta t) - \\mathbf{w}(t) \\sim \\mathcal{N}(\\mathbf{0}, \\Delta t\\,\\mathbf{I})$), extends the ODE into an SDE.</li>
</ul>
<p>The forward diffusion process $\\{\\mathbf{x}(t)\\}_{t\\in[0,T]}$ over the time interval $[0,T]$ is modeled as the solution to the It&ocirc; SDE:</p>
$$\\mathrm{d}\\mathbf{x} = \\boldsymbol{f}(\\mathbf{x}, t)\\,\\mathrm{d}t + g(t)\\,\\mathrm{d}\\mathbf{w},$$
<p>where the vector-valued <b>drift coefficient</b> $\\boldsymbol{f}(\\cdot, t): \\mathbb{R}^D \\to \\mathbb{R}^D$ captures the deterministic drift of particles under external forces, pulling them toward a target prior distribution. The scalar-valued <b>diffusion coefficient</b> $g(t): \\mathbb{R}_{\\geqslant 0} \\to \\mathbb{R}_{>0}$ governs the intensity of stochastic noise injection at each time step. This drift-diffusion decomposition connects directly to the <b>Fokker&ndash;Planck equation</b> (also known as Kolmogorov's forward equation), which describes how the probability density $p_t(\\mathbf{x})$ of the entire particle ensemble evolves over time. Here, each "particle" represents the state of a data sample at time $t$.</p>`,

    sde_p2: `<p>The <b>forward diffusion</b> process $\\{\\mathbf{x}(t)\\}_{t\\in[0,T]}$ progressively transforms data $\\mathbf{x}(0) \\sim p_{\\mathrm{data}}$ into noise $\\mathbf{x}(T) \\sim p_T \\approx \\mathcal{N}(\\mathbf{0}, \\sigma_T^2\\mathbf{I})$. It is modeled as the solution to the It&ocirc; SDE:</p>
$$\\mathrm{d}\\mathbf{x} = \\boldsymbol{f}(\\mathbf{x}, t)\\,\\mathrm{d}t + g(t)\\,\\mathrm{d}\\mathbf{w},$$
<p>where $\\boldsymbol{f}(\\cdot, t): \\mathbb{R}^D \\to \\mathbb{R}^D$ is the <b>drift coefficient</b> that deterministically steers the state toward a tractable prior, $g(t): \\mathbb{R}_{\\geqslant 0} \\to \\mathbb{R}_{>0}$ is the <b>diffusion coefficient</b> controlling the intensity of stochastic noise injection, and $\\mathbf{w}(t)$ is a standard Wiener process with $\\mathbf{w}(t+\\Delta t) - \\mathbf{w}(t) \\sim \\mathcal{N}(\\mathbf{0}, \\Delta t\\, \\mathbf{I})$. The interplay between drift and diffusion determines the marginal distributions $\\{p_t(\\mathbf{x})\\}_{t \\in [0,T]}$ along the forward trajectory.</p>`,

    sde_p3: `<p>The <b>reverse-time SDE</b> (Anderson, 1982) enables sampling by running the diffusion backward from $t = T$ to $t = 0$:</p>
$$\\mathrm{d}\\mathbf{x} = [\\boldsymbol{f}(\\mathbf{x}, t) - g^2(t) \\nabla_{\\mathbf{x}} \\log p_t(\\mathbf{x})]\\,\\mathrm{d}t + g(t)\\,\\mathrm{d}\\bar{\\mathbf{w}},$$
<p>where $\\bar{\\mathbf{w}}$ is a <b>reverse-time Wiener process</b> and $\\mathrm{d}t$ denotes an <b>infinitesimal negative time step</b> (time flows backward). The score function $\\nabla_{\\mathbf{x}} \\log p_t(\\mathbf{x})$ plays a pivotal role: it corrects the forward drift $\\boldsymbol{f}(\\mathbf{x},t)$ so that the reverse process recovers the data distribution. Specifically, the term $-g^2(t)\\nabla_{\\mathbf{x}} \\log p_t(\\mathbf{x})$ acts as a "course correction" that steers the backward trajectory from noise toward data. Once the score is known for all $t \\in [0,T]$, we can generate samples from $p_0 \\approx p_{\\mathrm{data}}$ by simulating this reverse SDE starting from $\\mathbf{x}(T) \\sim p_T$.</p>
<p>A key advantage of stochastic sampling via the reverse SDE is that it achieves superior <b>robustness</b>, <b>semantic consistency</b>, and <b>perceptual quality</b> compared to the deterministic generation strategies of VAEs and GANs. The per-step stochastic noise serves a corrective function, enabling the trajectory to compensate for accumulated score estimation errors and explore nearby probability mass.</p>
<p>By extending the DSM objective to the continuous-time setting, diffusion models are unified through two principal SDE formulations: <b>Variance Exploding (VE)</b> and <b>Variance Preserving (VP)</b> SDEs. The continuous-time limit unifies SMLD and DDPM under a common mathematical framework:</p>
<ul>
<li><b>VE SDE</b> (SMLD): $\\mathrm{d}\\mathbf{x} = \\sqrt{\\frac{\\mathrm{d}[\\sigma^2(t)]}{\\mathrm{d}t}}\\,\\mathrm{d}\\mathbf{w}$, with <b>zero drift</b> ($\\boldsymbol{f}(\\mathbf{x},t) = \\mathbf{0}$). The variance grows without bound as $t \\to \\infty$, hence "Variance Exploding."</li>
<li><b>VP SDE</b> (DDPM): $\\mathrm{d}\\mathbf{x} = -\\frac{1}{2}\\beta(t)\\mathbf{x}\\,\\mathrm{d}t + \\sqrt{\\beta(t)}\\,\\mathrm{d}\\mathbf{w}$, where a <b>linear contraction</b> $-\\frac{1}{2}\\beta(t)\\mathbf{x}$ balances noise injection so that the marginal variance stays bounded at unit variance asymptotically, hence "Variance Preserving."</li>
</ul>
<p>The key distinction is that VE allows unbounded variance growth while VP maintains bounded variance through a mean-reverting drift. Both formulations share the property of <b>affine drift coefficients</b>, which guarantees that the perturbation kernels $p(\\mathbf{x}_t|\\mathbf{x}_0)$ are Gaussian with closed-form expressions, a critical feature that makes score matching training tractable.</p>`,

    sde_ve_title: "",
    sde_ve_p1: "",

    sde_vp_title: "",
    sde_vp_p1: "",

    sde_deriv_ve_title: "Derivation: Continuous-time VE SDE from SMLD",
    sde_deriv_ve_body: `<p>SMLD (Song &amp; Ermon, 2019) estimates scores at $N$ noise levels $\\{\\sigma_i\\}_{i=1}^N$. The discrete forward Markov chain is:</p>
$$\\mathbf{x}_i = \\mathbf{x}_{i-1} + \\sqrt{\\sigma_i^2 - \\sigma_{i-1}^2}\\,\\boldsymbol{\\epsilon}, \\quad \\boldsymbol{\\epsilon} \\sim \\mathcal{N}(\\mathbf{0}, \\mathbf{I}).$$
<p><b>Step 1 (Re-parameterize):</b> Let $\\{\\sigma_i\\}_{i=1}^N$ become $\\sigma(t)$ for $t \\in [0,1]$, and $\\mathbf{x}_i = \\mathbf{x}(i/N)$.</p>
<p><b>Step 2 (Taylor expand):</b> The increment reads:</p>
$$\\mathbf{x}(t+\\Delta t) - \\mathbf{x}(t) = \\sqrt{\\sigma^2(t+\\Delta t) - \\sigma^2(t)}\\,\\boldsymbol{\\epsilon} \\approx \\sqrt{\\frac{\\mathrm{d}[\\sigma^2(t)]}{\\mathrm{d}t}\\Delta t}\\,\\boldsymbol{\\epsilon}.$$
<p><b>Step 3 (Continuous limit):</b> As $\\Delta t \\to 0$, this yields the VE forward SDE with zero drift:</p>
$$\\mathrm{d}\\mathbf{x} = \\underbrace{\\sqrt{\\frac{\\mathrm{d}[\\sigma^2(t)]}{\\mathrm{d}t}}}_{g(t)}\\,\\mathrm{d}\\mathbf{w}, \\quad \\boldsymbol{f}(\\mathbf{x},t) = \\mathbf{0}.$$
<p><b>Step 4 (Verify reverse):</b> Define $\\alpha(t) = \\mathrm{d}[\\sigma^2(t)]/\\mathrm{d}t$ and discretize the reverse SDE with $\\Delta t = 1/N$:</p>
$$\\mathbf{x}_{i-1} = \\mathbf{x}_i + (\\sigma_i^2 - \\sigma_{i-1}^2)\\,\\boldsymbol{s}(\\mathbf{x}_i) + \\sqrt{\\sigma_i^2 - \\sigma_{i-1}^2}\\,\\boldsymbol{\\epsilon},$$
<p>which is identical to the SMLD ancestral sampling rule. Since $\\sigma(t) \\to \\infty$ as $t \\to \\infty$, the variance grows without bound, hence the name "Variance Exploding."</p>`,

    sde_deriv_vp_title: "Derivation: Continuous-time VP SDE from DDPM",
    sde_deriv_vp_body: `<p>DDPM (Ho et al., 2020) defines the forward chain with perturbation kernels $\\{p(\\mathbf{x}_i|\\mathbf{x}_0)\\}_{i=1}^N$:</p>
$$\\mathbf{x}_i = \\sqrt{1-\\beta_i}\\,\\mathbf{x}_{i-1} + \\sqrt{\\beta_i}\\,\\boldsymbol{\\epsilon}, \\quad \\boldsymbol{\\epsilon} \\sim \\mathcal{N}(\\mathbf{0}, \\mathbf{I}).$$
<p><b>Step 1 (Re-parameterize):</b> Define $\\Delta t = 1/N$ and an auxiliary schedule $\\bar{\\beta}_i$ such that $\\beta_i = \\bar{\\beta}_i \\Delta t = \\beta(t+\\Delta t)\\Delta t$. As $N \\to \\infty$, $\\bar{\\beta}_i \\to \\beta(t)$ becomes continuous.</p>
<p><b>Step 2 (Taylor expand):</b> Setting $\\mathbf{x}_i = \\mathbf{x}(t+\\Delta t)$ and applying $\\sqrt{1-\\beta(t)\\Delta t} \\approx 1 - \\frac{1}{2}\\beta(t)\\Delta t$:</p>
$$\\mathbf{x}(t+\\Delta t) - \\mathbf{x}(t) = -\\frac{1}{2}\\beta(t)\\,\\mathbf{x}(t)\\,\\Delta t + \\sqrt{\\beta(t)\\Delta t}\\,\\boldsymbol{\\epsilon}.$$
<p><b>Step 3 (Continuous limit):</b> As $\\Delta t \\to 0$:</p>
$$\\mathrm{d}\\mathbf{x} = \\underbrace{-\\frac{1}{2}\\beta(t)\\,\\mathbf{x}}_{\\boldsymbol{f}(\\mathbf{x},t)}\\,\\mathrm{d}t + \\underbrace{\\sqrt{\\beta(t)}}_{g(t)}\\,\\mathrm{d}\\mathbf{w}.$$
<p><b>Step 4 (Verify reverse):</b> Discretize with $\\beta(t)\\Delta t = \\beta_i \\ll 1$:</p>
$$\\mathbf{x}_{i-1} \\approx \\frac{1}{\\sqrt{1-\\beta_i}}\\left[\\mathbf{x}_i + \\frac{\\beta_i}{2}\\,\\boldsymbol{s}(\\mathbf{x}_i)\\right] + \\sqrt{\\beta_i}\\,\\boldsymbol{\\epsilon},$$
<p>which is identical to the DDPM ancestral sampling rule. The linear contraction $-\\frac{1}{2}\\beta(t)\\mathbf{x}$ counteracts noise injection so that the marginal variance remains bounded at one, hence "Variance Preserving."</p>`,

    code_ddpm_title: "Python: DDPM Training Loop (for hands-on understanding of the VP-SDE forward process and noise prediction loss)",
    code_ddpm_body: `<p>A minimal DDPM training step implementing the VP-SDE forward process and $\\boldsymbol{\\epsilon}$-prediction loss:</p>
<div class="code-block"><div class="code-header"><span class="code-lang">Python</span><span>PyTorch</span></div><pre><span class="keyword">import</span> torch
<span class="keyword">import</span> torch.nn.functional <span class="keyword">as</span> F

<span class="keyword">def</span> <span class="function">ddpm_train_step</span>(model, x_0, T=<span class="number">1000</span>, beta_min=<span class="number">1e-4</span>, beta_max=<span class="number">0.02</span>):
    <span class="string">"""Single DDPM training step (VP-SDE discretization).
    model: neural network predicting noise eps_theta(x_t, t)
    x_0:   clean data batch [B, C, H, W]
    """</span>
    <span class="comment"># Linear noise schedule</span>
    betas = torch.linspace(beta_min, beta_max, T, device=x_0.device)
    alphas = <span class="number">1.0</span> - betas
    alpha_bars = torch.cumprod(alphas, dim=<span class="number">0</span>)

    <span class="comment"># Sample random timestep for each example</span>
    t = torch.randint(<span class="number">0</span>, T, (x_0.shape[<span class="number">0</span>],), device=x_0.device)

    <span class="comment"># Forward process: q(x_t | x_0) = N(sqrt(alpha_bar_t) * x_0, (1-alpha_bar_t) * I)</span>
    alpha_bar_t = alpha_bars[t].view(-<span class="number">1</span>, <span class="number">1</span>, <span class="number">1</span>, <span class="number">1</span>)
    noise = torch.randn_like(x_0)
    x_t = alpha_bar_t.sqrt() * x_0 + (<span class="number">1</span> - alpha_bar_t).sqrt() * noise

    <span class="comment"># Predict noise and compute MSE loss</span>
    predicted_noise = model(x_t, t)
    loss = F.mse_loss(predicted_noise, noise)
    <span class="keyword">return</span> loss

<span class="comment"># Training loop</span>
<span class="keyword">for</span> epoch <span class="keyword">in</span> <span class="builtin">range</span>(num_epochs):
    <span class="keyword">for</span> x_0 <span class="keyword">in</span> dataloader:
        loss = <span class="function">ddpm_train_step</span>(model, x_0)
        optimizer.zero_grad(); loss.backward(); optimizer.step()</pre></div>`,

    viz2_title: "Interactive: Forward Diffusion Process",
    viz_forward_caption: "This interactive shows how the forward SDE progressively destroys data structure. The inset chart displays the noise schedule: VP mode shows $\\bar{\\alpha}(t) = e^{-5t^2}$ (signal attenuation), while VE mode shows $\\sigma(t) = t^2 \\cdot 3$ (noise growth). The SNR indicator (VP only) tracks signal-to-noise ratio in dB. The bottom histogram shows the marginal distribution $p_t(x_1)$ — watch it transition from bimodal to unimodal Gaussian as $t \\to 1$. Use auto-play or drag the slider to observe the diffusion at your own pace.",

    // §3.1.3 Probability Flow ODEs & Solvers
    ode_title: "Probability Flow ODEs &amp; Solvers",
    ode_p1: `<p>For every score-based reverse SDE, there exists a corresponding <b>probability flow ordinary differential equation (PF ODE)</b> that shares the same marginal densities $\\{p_t(\\mathbf{x})\\}_{t\\in[0,T]}$:</p>
$$\\mathrm{d}\\mathbf{x} = \\left[ \\boldsymbol{f}(\\mathbf{x}, t) - \\frac{1}{2}g^2(t)\\,\\boldsymbol{s}(\\mathbf{x}, t) \\right] \\mathrm{d}t.$$
<p>This <b>deterministic</b> formulation eliminates stochastic noise entirely, enabling controllable sampling, exact likelihood computation via the instantaneous change-of-variables formula, and the use of efficient numerical ODE solvers. Three principal families of solvers are employed:</p>
<ul>
<li><b>Euler&ndash;Maruyama</b> (first-order): $\\mathbf{x}_{i+1} = \\mathbf{x}_i + \\eta\\, \\boldsymbol{h}(\\mathbf{x}_i, t_i)$, with local truncation error $\\mathcal{O}(\\eta^2)$. This is the simplest scheme but requires small step sizes for accuracy. The Euler method applied to the PF ODE corresponds to <b>ancestral sampling</b> in SMLD/DDPM.</li>
<li><b>Runge&ndash;Kutta</b> (higher-order): The classical RK-4 method achieves local error $\\mathcal{O}(\\eta^5)$ by computing four intermediate slope evaluations per step: $\\mathbf{x}_{i+1} = \\mathbf{x}_i + \\frac{\\eta}{6}(\\mathbf{k}_1 + 2\\mathbf{k}_2 + 2\\mathbf{k}_3 + \\mathbf{k}_4)$, where $\\mathbf{k}_1, \\mathbf{k}_2, \\mathbf{k}_3, \\mathbf{k}_4$ are slopes evaluated at different points within the step interval.</li>
<li><b>Predictor&ndash;Corrector</b>: Alternates between a prediction step (one SDE integration) and a correction step (Langevin MCMC using the score), balancing computational efficiency with sample quality.</li>
</ul>`,

    ode_p2: `<p>With a learned score $\\boldsymbol{s}_{\\boldsymbol{\\theta}}(\\mathbf{x}, t)$, this becomes a <b>neural ODE</b> that can be solved numerically. Three families of solvers are commonly used:</p>
<ul>
<li><b>Euler-Maruyama</b> (first-order): $x_{i+1} = x_i + \\eta\\, f(x_i, t_i)$, local error $\\mathcal{O}(\\eta^2)$. Simple but needs small steps.</li>
<li><b>Runge-Kutta</b> (higher-order): RK-4 achieves local error $\\mathcal{O}(\\eta^5)$ via four intermediate evaluations per step.</li>
<li><b>Predictor-Corrector</b>: Alternates between SDE prediction and score-based MCMC correction for balanced efficiency and quality.</li>
</ul>`,

    ode_deriv_title: "Insight: Sampling as Numerical Solving",
    ode_deriv_body: `<p>A unifying insight: <b>sampling from a diffusion model is fundamentally a numerical integration problem</b>, whether solving the stochastic reverse SDE or the deterministic PF ODE. Each sampler is a numerical solver; different samplers correspond to different discretization schemes with distinct accuracy-efficiency trade-offs. This reframing transforms the sampling problem from a probabilistic one into a well-studied numerical analysis one.</p>
<p>This perspective immediately explains why DDPM requires approximately 1000 steps: its ancestral sampling implements a <b>first-order Euler</b> discretization of the reverse SDE, demanding small step sizes $\\eta$ to keep truncation errors $\\mathcal{O}(\\eta^2)$ manageable over the long time horizon $[0,T]$. Subsequent advances can be understood as importing mature numerical analysis techniques into diffusion sampling:</p>
<ul>
<li><b>DDIM</b> (Song et al., 2021): Reinterprets DDPM sampling as a non-Markovian process, enabling deterministic generation via the PF ODE. By removing stochasticity, DDIM reduces sampling to 50&ndash;100 steps with minimal quality loss.</li>
<li><b>DPM-Solver</b> (Lu et al., 2022): Applies higher-order multistep solvers and adaptive step sizes to the diffusion ODE framework, achieving high-quality generation in as few as 10&ndash;20 steps.</li>
</ul>
<p>Reducing sampling steps introduces <b>three categories of error</b> that jointly govern output quality:</p>
<ol>
<li><b>Discretization error</b>: arises from finite step sizes. The solver only approximates the continuous trajectory, and this error grows with step length. Higher-order solvers (RK-4, DPM-Solver) significantly reduce this error per step.</li>
<li><b>Score estimation error</b>: originates from the neural network's imperfect approximation of the true score $\\nabla_{\\mathbf{x}} \\log p_t(\\mathbf{x})$. This error is amplified when fewer steps leave less opportunity for self-correction between evaluations.</li>
<li><b>Stochastic error</b>: from noise injected at each SDE step, with variance scaling as $g(t)\\sqrt{\\Delta t}\\,\\boldsymbol{\\epsilon}$. <b>The ODE formulation eliminates this error source entirely</b>, which is precisely why ODE-based samplers tolerate larger step sizes than their SDE counterparts.</li>
</ol>
<p><b>On the role of stochasticity:</b> a common misconception is that per-step noise is the primary source of sample diversity. In reality, the fundamental source of diversity is the random initial sample $\\mathbf{x}(T) \\sim p_T$: different starting points trace different deterministic trajectories under the PF ODE regardless of solver type. Per-step noise in the SDE serves a <i>corrective</i> function, helping the trajectory explore nearby probability mass and compensate for accumulated score estimation errors, rather than being the primary diversity mechanism.</p>`,

    viz3_title: "Interactive: Reverse SDE vs Probability Flow ODE",
    viz_reverse_caption: "This side-by-side comparison contrasts two reverse-time samplers. <b>Left — Reverse SDE</b>: the stochastic predictor injects noise $\\sqrt{\\beta(t)}\\,d\\bar{\\mathbf{w}}$ at every step, producing wiggly trajectories and requiring many small steps (here $100$ NFE) to integrate accurately. <b>Right — PF ODE</b>: an high-order ODE solver (e.g. DPM-Solver / DEIS) discretises the deterministic probability-flow ODE with far larger steps, reaching the same marginals $p_t$ in roughly <b>$4\\times$ fewer evaluations</b> (here $25$ NFE) — the tick marks on each path show how few waypoints are visited. The per-panel status boxes report live $\\text{NFE}$ usage and a normalised convergence bar; the ODE panel finishes and freezes at $t=0$ while the SDE is still mid-flight. Both methods converge to the same $p_{\\text{data}}$; the ODE simply does so via straighter, deterministic paths.",

    // ===== §3.2 Conditional Diffusion Models =====
    cond_title: "Conditional Diffusion Models",
    cond_infer_title: "Inference-time Conditioning",
    cond_train_title: "Training-time Conditioning",
    cond_p1: `<p>The central question of <b>controllability</b>: how can we steer the reverse diffusion process so that generated samples conform to a target condition $\\mathbf{y}$? Unconditional diffusion models produce high-quality samples from $p_{\\mathrm{data}}(\\mathbf{x})$ but offer no mechanism to direct the output toward specific semantic content. This is precisely what <b>semantic communications</b> demands: at the receiver, reconstructions must be conditioned on side information (compressed features, channel observations, or textual descriptions) to ensure semantic fidelity with the transmitter's source signal.</p>
<p>We classify conditioning mechanisms by their <b>injection time</b> in the diffusion pipeline:</p>
<ul>
<li><b>Inference-time conditioning</b>: The condition $\\mathbf{y}$ is injected only during reverse sampling via external guidance signals. This preserves the pre-trained unconditional model entirely, enabling <b>plug-and-play</b> adaptation to diverse downstream tasks without retraining.</li>
<li><b>Training-time conditioning</b>: The condition $\\mathbf{y}$ is incorporated directly into the model architecture and training objective. This yields tighter integration and more precise control, at the cost of task-specific training.</li>
</ul>`,

    cond_bayes_title: "Bayesian Decomposition",
    cond_bayes_p1: `<p>The mathematical foundation for inference-time conditioning rests on <b>Bayes' theorem</b>. The conditional score decomposes as:</p>
$$\\underbrace{\\nabla_{\\mathbf{x}} \\log p_t(\\mathbf{x}|\\mathbf{y})}_{\\text{conditional score}} = \\underbrace{\\nabla_{\\mathbf{x}} \\log p_t(\\mathbf{x})}_{\\text{unconditional score}} + \\underbrace{\\nabla_{\\mathbf{x}} \\log p_t(\\mathbf{y}|\\mathbf{x})}_{\\text{log-likelihood gradient}}.$$
<p>The first term is the <b>unconditional score</b> $\\nabla_{\\mathbf{x}} \\log p_t(\\mathbf{x})$, directly available from a pre-trained diffusion model $\\boldsymbol{s}_{\\boldsymbol{\\theta}}(\\mathbf{x},t)$. The second term is the <b>log-likelihood gradient</b> $\\nabla_{\\mathbf{x}} \\log p_t(\\mathbf{y}|\\mathbf{x})$, which acts as an "external force" that steers the generation trajectory toward samples consistent with the condition $\\mathbf{y}$. Denoting this <b>guidance field</b> as $\\boldsymbol{g}(\\mathbf{y}|\\mathbf{x},t) := \\nabla_{\\mathbf{x}} \\log p_t(\\mathbf{y}|\\mathbf{x})$, the canonical equation for inference-time conditioning becomes:</p>
$$\\boldsymbol{s}(\\mathbf{x}|\\mathbf{y},t) \\approx \\boldsymbol{s}_{\\boldsymbol{\\theta}}(\\mathbf{x},t) + \\gamma\\,\\boldsymbol{g}(\\mathbf{y}|\\mathbf{x},t),$$
<p>where $\\gamma \\geqslant 0$ is a scalar that modulates the <b>guidance strength</b>, controlling the trade-off between unconditional sample quality and fidelity to the condition. This decomposition gives rise to two principal approaches for constructing the guidance field:</p>
<ul>
<li><b>Classifier guidance (CG)</b>: Applicable when a ground-truth conditional distribution (e.g., class labels) is available. A time-dependent classifier trained on noisy data provides the guidance gradient.</li>
<li><b>Estimator guidance</b>: Applicable when measurements are partial or indirect (e.g., inverse problems). The guidance field is derived from a forward measurement model combined with Tweedie's posterior mean estimate.</li>
</ul>`,

    cond_cg_title: "Classifier Guidance (CG)",
    cond_cg_p1: `<p>Dhariwal &amp; Nichol train a time-dependent classifier $p_{\\boldsymbol{\\phi}}(\\mathbf{y}|\\mathbf{x},t)$ on noise-corrupted data. The guidance field is $\\boldsymbol{g} = \\nabla_{\\mathbf{x}} \\log p_{\\boldsymbol{\\phi}}(\\mathbf{y}|\\mathbf{x},t)$, yielding:</p>
$$\\boldsymbol{s}(\\mathbf{x}|\\mathbf{y},t) = \\boldsymbol{s}_{\\boldsymbol{\\theta}}(\\mathbf{x},t) + \\gamma\\,\\nabla_{\\mathbf{x}} \\log p_{\\boldsymbol{\\phi}}(\\mathbf{y}|\\mathbf{x},t).$$
<p>In the $\\boldsymbol{\\epsilon}$-parameterization (where $\\boldsymbol{\\epsilon}_{\\boldsymbol{\\theta}}(\\mathbf{x},t) = -\\sqrt{1-\\bar{\\alpha}_t}\\,\\boldsymbol{s}_{\\boldsymbol{\\theta}}(\\mathbf{x},t)$):</p>
$$\\boldsymbol{\\epsilon}_{\\boldsymbol{\\theta}}(\\mathbf{x}|\\mathbf{y},t) = \\boldsymbol{\\epsilon}_{\\boldsymbol{\\theta}}(\\mathbf{x},t) - \\sqrt{1-\\bar{\\alpha}_t}\\,\\gamma\\,\\nabla_{\\mathbf{x}} \\log p_{\\boldsymbol{\\phi}}(\\mathbf{y}|\\mathbf{x},t).$$
<p>CG reshapes the probability landscape by amplifying conditional signals, focusing generation on target modes. For different downstream tasks, one can pre-train a single unconditional diffusion model and swap in task-specific classifiers at inference. However, CG faces two inherent problems: <b>noise adversity</b> (classifiers must handle multi-level noise along the diffusion trajectory) and <b>optimization failure</b> (when $\\mathbf{y}$ correlates weakly with $\\mathbf{x}$, classifier gradients may follow adversarial directions).</p>`,

    cond_eg_title: "Estimator Guidance",
    cond_dps_title: "Diffusion Posterior Sampling (DPS)",
    cond_eg_p1: `<p>In many scientific and engineering problems, we observe partial measurements derived from a source rather than the source itself. These settings naturally formulate as <b>inverse problems</b>, where an unknown source $\\mathbf{x}$ is recovered from its measurement $\\mathbf{y}$ through a forward model:</p>
$$\\mathbf{y} = \\mathcal{A}(\\mathbf{x}_0) + \\mathbf{n},$$
<p>where $\\mathbf{n} \\sim \\mathcal{N}(\\mathbf{0}, \\sigma_{\\mathbf{n}}^2\\mathbf{I})$ is additive Gaussian noise and $\\mathcal{A}(\\cdot): \\mathbb{R}^D \\to \\mathbb{R}^m$ is the forward operator encoding the degradation process. The problem is typically ill-posed: multiple sources may explain the same measurement, making unique recovery impossible without prior knowledge.</p>
<p>When a diffusion model serves as the prior, the unconditional score $\\boldsymbol{s}_{\\boldsymbol{\\theta}}(\\mathbf{x},t)$ is already available. Estimating the conditional score then reduces to recovering the log-likelihood gradient $\\nabla_{\\mathbf{x}} \\log p_t(\\mathbf{y}|\\mathbf{x})$. However, this gradient is not directly accessible: the measurement $\\mathbf{y}$ depends explicitly on the clean data $\\mathbf{x}_0$, yet during reverse sampling at time step $t$, only the intermediate noisy state $\\mathbf{x}_t$ is available.</p>
<p>The remedy is to follow the <b>indirect path</b> $\\mathbf{x}_t \\to \\mathbf{x}_0 \\to \\mathbf{y}$: first estimate $\\mathbf{x}_0$ from $\\mathbf{x}_t$ using the score model $\\boldsymbol{s}_{\\boldsymbol{\\theta}}$, then exploit the explicit dependency between $\\mathbf{x}_0$ and $\\mathbf{y}$. Chung et al. propose <b>Diffusion Posterior Sampling (DPS)</b>, which infers $\\mathbf{x}_0$ from $\\mathbf{x}_t$ via <b>Tweedie's formula</b>, yielding the posterior mean (denoised estimate):</p>
$$\\hat{\\mathbf{x}}_{0|t} = \\mathbb{E}[\\mathbf{x}_0|\\mathbf{x}_t] = \\frac{1}{\\alpha_t}\\left(\\mathbf{x}_t + \\sigma_t^2\\,\\boldsymbol{s}_{\\boldsymbol{\\theta}}(\\mathbf{x},t)\\right),$$
<p>where $\\alpha_t = \\sqrt{\\bar{\\alpha}_t}$ and $\\sigma_t = \\sqrt{1-\\bar{\\alpha}_t}$. This estimator, rooted in empirical Bayes, provides a principled way to reconstruct $\\mathbf{x}_0$ from its noisy counterpart $\\mathbf{x}_t$.</p>
<p>Building on this posterior mean, DPS approximates the time-dependent log-likelihood gradient by replacing the intractable conditional term with its denoised surrogate: $\\nabla_{\\mathbf{x}} \\log p_t(\\mathbf{y}|\\mathbf{x}) \\approx \\nabla_{\\mathbf{x}} \\log p_t(\\mathbf{y}|\\hat{\\mathbf{x}}_{0|t})$. The <b>general form of estimator guidance</b> is:</p>
$$\\boldsymbol{s}(\\mathbf{x}|\\mathbf{y},t) \\approx \\boldsymbol{s}_{\\boldsymbol{\\theta}}(\\mathbf{x},t) + \\gamma\\,\\nabla_{\\mathbf{x}} \\mathcal{R}(\\mathbf{y},\\, \\mathcal{A}(\\hat{\\mathbf{x}}_{0|t})),$$
<p>where $\\mathcal{R}$ is typically $\\|\\mathbf{y} - \\mathcal{A}(\\hat{\\mathbf{x}}_{0|t})\\|_2^2$ for Gaussian noise, serving as a measurement-consistency regularizer based on the posterior mean.</p>
<p>The discussion so far has assumed the forward operator $\\mathcal{A}$ is known. Yet in many real-world scenarios, the degradation model is unavailable or only partially characterized. This gives rise to <b>blind inverse problems</b>, where both the data $\\mathbf{x}$ and the operator parameters $\\boldsymbol{\\vartheta}$ must be jointly inferred. <b>BlindDPS</b> addresses this with parallel priors and joint estimator guidance: one diffusion prior $\\boldsymbol{s}_{\\boldsymbol{\\theta}}(\\mathbf{x},t)$ for data and another $\\boldsymbol{s}_{\\boldsymbol{\\theta}}(\\boldsymbol{\\rho},t)$ for operator parameters, both updated in tandem along the reverse process:</p>
$$\\boldsymbol{s}(\\mathbf{x}, \\boldsymbol{\\rho}|\\mathbf{y},t) \\approx \\boldsymbol{s}_{\\boldsymbol{\\theta}}(\\mathbf{x},t) + \\gamma\\,\\nabla_{\\mathbf{x}} \\mathcal{R}(\\mathbf{y},\\, \\mathcal{A}_{\\hat{\\boldsymbol{\\vartheta}}}(\\hat{\\mathbf{x}}_{0|t})).$$
<p>In essence, BlindDPS extends DPS by coupling two diffusion priors through measurement consistency, enabling simultaneous data denoising and operator estimation within a single reverse process.</p>
<p>Compared with classifier guidance, estimator guidance <b>avoids noise adversity and optimization failure</b> by deriving the guidance signal directly from the forward model rather than a separately trained classifier, tying the sampling trajectory to the measurement. However, estimator guidance has two main limitations: (1) it is <b>computationally expensive</b> because it requires a pre-trained diffusion model and injects measurement consistency during gradient-based sampling, making it slow and sometimes unstable; (2) when measurements are <b>heavily degraded</b>, the guidance becomes unreliable and can push the reverse trajectory away from the true data manifold, producing out-of-distribution artifacts.</p>`,

    cond_eg_p2: `<p>A natural concern arises: if the diffusion prior is trained on data that do not exactly match the target signal domain, does estimator guidance remain viable? This question is especially relevant for <b>generative semantic communications</b>, where the receiver's diffusion prior may have been trained on a generic data corpus rather than the specific content being transmitted. Recent work provides both empirical and theoretical evidence that such "weak" diffusion priors can still achieve strong reconstruction performance when the measurements are sufficiently informative. The insight, grounded in <b>Bayesian posterior consistency</b>, is that high-dimensional measurements can effectively dominate the prior, causing the posterior to concentrate near the true signal regardless of prior fidelity.</p>`,

    cond_deriv_title: "Tweedie's Formula and the Posterior Mean",
    cond_deriv_body: `<p><b>Tweedie's formula</b> (Efron, 2011), rooted in empirical Bayes, provides a principled way to reconstruct $\\mathbf{x}_0$ from its noisy counterpart $\\mathbf{x}_t$. For the VP perturbation kernel $p(\\mathbf{x}_t|\\mathbf{x}_0) = \\mathcal{N}(\\alpha_t\\mathbf{x}_0, \\sigma_t^2\\mathbf{I})$:</p>
$$\\hat{\\mathbf{x}}_{0|t} = \\mathbb{E}[\\mathbf{x}_0|\\mathbf{x}_t] = \\frac{1}{\\alpha_t}(\\mathbf{x}_t + \\sigma_t^2 \\nabla_{\\mathbf{x}_t} \\log p_t(\\mathbf{x}_t)).$$
<p>Replacing the true score with the learned score $\\boldsymbol{s}_{\\boldsymbol{\\theta}}$ yields the practical estimator.</p>
<p><b>Validity conditions:</b></p>
<ol>
<li><b>Perfect score model</b>: $\\boldsymbol{s}_{\\boldsymbol{\\theta}}(\\mathbf{x},t) = \\nabla_{\\mathbf{x}} \\log p_t(\\mathbf{x})$ with zero score estimation error $\\varepsilon_{\\mathrm{score}} = 0$. Formally, $\\varepsilon_{\\mathrm{score}} := \\mathbb{E}_{t \\sim \\mathcal{U}[0,1], \\mathbf{x} \\sim p_t} \\|\\nabla_{\\mathbf{x}} \\log p_t(\\mathbf{x}) - \\boldsymbol{s}_{\\boldsymbol{\\theta}}(\\mathbf{x},t)\\|_2^2$.</li>
<li><b>Gaussian perturbation kernel</b>: so that $p(\\mathbf{x}_t|\\mathbf{x}_0)$ retains a known Gaussian form.</li>
</ol>
<p>In practice, both conditions are violated: score network mismatch ($\\varepsilon_{\\mathrm{score}} > 0$) induces persistent bias, while non-Gaussian channel residuals (e.g., impulsive interference) distort the posterior mean. To mitigate error accumulation, a practical strategy is to use $\\hat{\\mathbf{x}}_{0|t}$ as a <i>soft</i> guiding direction scaled by $\\gamma$ rather than enforcing a hard projection at each step. This prevents small per-step biases from compounding over hundreds of denoising iterations.</p>`,

    cond_train_p1: `<p>While inference-time conditioning offers flexibility by adapting pre-trained models, it fundamentally relies on external guidance signals that may not align well with the diffusion process. An alternative paradigm emerges: directly train diffusion models to internalize conditional information. Rather than decomposing the conditional score via Bayes' theorem, we can directly interpolate between unconditional and conditional scores:</p>
$$\\boldsymbol{s}(\\mathbf{x}|\\mathbf{y},t) \\approx (1-\\gamma)\\,\\boldsymbol{s}_{\\boldsymbol{\\theta}}(\\mathbf{x},t) + \\gamma\\,\\boldsymbol{s}_{\\boldsymbol{\\theta}}(\\mathbf{x}|\\mathbf{y},t),$$
<p>where both scores are learned by the same neural network, and $\\gamma \\geqslant 0$ controls the conditioning strength. This formulation shifts the burden from inference-time guidance to training-time learning.</p>`,

    cond_cfg_title: "Classifier-Free Guidance (CFG)",
    cond_cfg_p1: `<p>Instead of relying on external classifiers, CFG directly interpolates between unconditional and conditional scores within a single model:</p>
$$\\boldsymbol{s}(\\mathbf{x}|\\mathbf{y},t) \\approx (1-\\gamma)\\,\\boldsymbol{s}_{\\boldsymbol{\\theta}}(\\mathbf{x},t) + \\gamma\\,\\boldsymbol{s}_{\\boldsymbol{\\theta}}(\\mathbf{x}|\\mathbf{y},t).$$
<p>During training, the model denoises with probability $p$ using condition $\\mathbf{y}$, and with probability $1-p$ using a null token $\\varnothing$. In the $\\boldsymbol{\\epsilon}$-parameterization:</p>
$$\\boldsymbol{\\epsilon}_{\\boldsymbol{\\theta}}(\\mathbf{x}|\\mathbf{y},t) = (1-\\gamma)\\,\\boldsymbol{\\epsilon}_{\\boldsymbol{\\theta}}(\\mathbf{x}|\\varnothing,t) + \\gamma\\,\\boldsymbol{\\epsilon}_{\\boldsymbol{\\theta}}(\\mathbf{x}|\\mathbf{y},t).$$
<p>When $\\gamma=0$: unconditional; $\\gamma=1$: standard conditional; $\\gamma>1$: amplified conditional (improves quality at the cost of diversity). CFG avoids the noise adversity and optimization failure problems of CG, at the cost of running the model twice per step.</p>
<p>The elegance of CFG lies in its unified training scheme: because the model naturally adapts to different noise levels for both conditional and unconditional generation, it sidesteps the noise adversity problem of CG. Since conditional information directly influences denoising predictions during training, gradient directions inherently align with generation objectives, circumventing optimization failure. However, CFG introduces its own trade-offs: as $\\gamma$ increases, sample diversity typically decreases, potentially causing mode collapse. Running the model twice per inference step (once conditional, once unconditional) doubles the computational cost. The optimal $\\gamma$ also varies across conditions and datasets, requiring careful tuning.</p>`,

    viz4_title: "Interactive: Classifier-Free Guidance Strength",
    viz_guidance_caption: "This interactive demonstrates Bayesian posterior steering via classifier-free guidance (CFG). The dashed blue ellipse is the prior $p(\\mathbf{x})$; the red dashed line marks the conditioning signal $\\mathbf{y}$; the solid purple ellipse is the posterior $p(\\mathbf{x}\\mid\\mathbf{y}) \\propto p(\\mathbf{y}\\mid\\mathbf{x})\\,p(\\mathbf{x})$ under a Gaussian conjugate model (posterior mean $\\mu_+\\!=\\!\\mu+(\\mathbf{y}-\\mu)\\,\\gamma/(\\gamma+1)$, variance shrunk by $1/(1+\\gamma)$). As $\\gamma$ grows, samples shift from blue (prior-dominated) toward purple/red (signal-dominated). At inference, CFG implements this by interpolating noise predictions $\\tilde{\\boldsymbol{\\epsilon}}=(1+\\gamma)\\boldsymbol{\\epsilon}_{\\boldsymbol{\\theta}}(\\mathbf{x},\\mathbf{y})-\\gamma\\,\\boldsymbol{\\epsilon}_{\\boldsymbol{\\theta}}(\\mathbf{x})$; $\\gamma\\!=\\!0$ yields unconditional sampling, while large $\\gamma$ collapses samples toward $\\mathbf{y}$ at the cost of diversity.",

    // ===== Chapter 7: Consistency Models =====
    cm_title: "Consistency Models",
    cm_p1: `<p>Consistency Models enforce <b>self-consistency</b> across diffusion sampling trajectories, enabling single-step generation. For the PF ODE with $\\boldsymbol{f}(\\mathbf{x},t) = \\mathbf{0}$ and $g(t) = \\sqrt{2t}$:</p>
$$\\frac{\\mathrm{d}\\mathbf{x}_t}{\\mathrm{d}t} = -t\\,\\boldsymbol{s}_{\\boldsymbol{\\theta}}(\\mathbf{x},t),$$
<p>initialized from $\\mathbf{x}_T \\sim \\mathcal{N}(\\mathbf{0}, T^2\\mathbf{I})$ and solved backwards to $\\mathbf{x}_0$.</p>`,

    cm_p2: `<p>The <b>consistency function</b> $\\boldsymbol{c}:(\\mathbf{x},t) \\to \\mathbf{x}_\\xi$ maps any point on an ODE trajectory to its endpoint $\\mathbf{x}_\\xi$, enforcing <b>self-consistency</b>: $\\boldsymbol{c}(\\mathbf{x},s) = \\boldsymbol{c}(\\mathbf{x},t)$ for all points on the same trajectory. The model is parameterized as:</p>
$$\\boldsymbol{c}_{\\boldsymbol{\\theta}}(\\mathbf{x},t) = \\boldsymbol{c}_{\\mathrm{skip}}(t)\\,\\mathbf{x} + \\boldsymbol{c}_{\\mathrm{out}}(t)\\,F_{\\boldsymbol{\\theta}}(\\mathbf{x},t),$$
<p>with boundary conditions $\\boldsymbol{c}_{\\mathrm{skip}}(\\xi) = 1$ and $\\boldsymbol{c}_{\\mathrm{out}}(\\xi) = 0$, ensuring $\\boldsymbol{c}_{\\boldsymbol{\\theta}}(\\mathbf{x},\\xi) = \\mathbf{x}$ at the data endpoint. Training minimizes:</p>
$$\\mathcal{L}(\\boldsymbol{\\theta}) = \\mathbb{E}_{t \\sim \\mathcal{U}[0,1], \\, s \\sim \\mathcal{U}[0,t), \\, \\mathbf{x} \\sim p_{t}(\\mathbf{x})} \\left\\| \\boldsymbol{c}_{\\boldsymbol{\\theta}}(\\mathbf{x}, s) - \\boldsymbol{c}_{\\boldsymbol{\\theta}}(\\mathbf{x}, t) \\right\\|_2^2.$$`,

    cm_p3: `<p>From a numerical analysis perspective, consistency models learn a <b>direct mapping</b> from any intermediate state to the trajectory endpoint, analogous to learning the analytical solution rather than numerically integrating step by step. This bypasses iterative integration entirely, enabling <b>single-step generation</b>. Extensions like <b>Latent Consistency Models (LCMs)</b> apply consistency training within VAE-encoded representations for efficient high-resolution generation.</p>`,

    cm_deriv_title: "Why Doesn't the Model Collapse to a Constant?",
    cm_deriv_body: `<p>Minimizing the self-consistency loss alone admits a trivial solution: the network could map all inputs to the same constant. The <b>boundary condition</b> $\\boldsymbol{c}_{\\boldsymbol{\\theta}}(\\mathbf{x},\\xi) = \\mathbf{x}_\\xi \\approx \\mathbf{x}_0$ prevents this: at time $\\xi$ (near the data endpoint), the model must faithfully reproduce its input. Combined with teacher guidance or stop-gradient techniques, this forces the model to learn the genuine trajectory-to-endpoint mapping. As training progresses, the network internalizes a time-invariant mapping: given any noisy sample from any point along the ODE trajectory, it directly recovers the corresponding clean data.</p>`,

    // ===== Chapter 8: Flow Matching =====
    fm_title: "Flow Matching",
    fm_p1: `<p>Flow matching reformulates generative modeling as learning a <b>velocity field</b> $\\boldsymbol{v}(\\mathbf{x}, t)$ that transports samples from a simple prior $p_0(\\mathbf{x}) = \\mathcal{N}(\\mathbf{0}, \\mathbf{I})$ at $t=0$ to the data distribution $p_1(\\mathbf{x}) = p_{\\mathrm{data}}(\\mathbf{x})$ at $t=1$. Each point follows the ODE:</p>
$$\\frac{\\mathrm{d}\\mathbf{x}}{\\mathrm{d}t} = \\boldsymbol{v}(\\mathbf{x}, t),$$
<p>defining a flow map $\\boldsymbol{\\psi}(\\mathbf{x}, t): \\mathbb{R}^D \\times [0,1] \\to \\mathbb{R}^D$ from initial positions to their locations at time $t$.</p>`,

    fm_p2: `<p>Unlike score-based diffusion, which first corrupts data and then learns to reverse the corruption, flow matching <b>directly</b> parameterizes the velocity field along <b>straight-line paths</b> connecting noise and data. Using the forward interpolation $\\mathbf{x}_t = (1-t)\\mathbf{x}_0 + t\\mathbf{x}_1$, the velocity is learned by minimizing:</p>
$$\\mathcal{L}(\\boldsymbol{\\theta}) = \\mathbb{E}_{t \\sim \\mathcal{U}[0,1],\\, \\mathbf{x} \\sim p_t(\\mathbf{x})} \\left[\\left\\|\\boldsymbol{v}(\\mathbf{x},t) - \\boldsymbol{v}_{\\boldsymbol{\\theta}}(\\mathbf{x},t)\\right\\|_2^2\\right],$$
<p>where $\\boldsymbol{v}(\\mathbf{x},t) = (\\mathbf{x}_1 - \\mathbf{x}_0)$ is the true velocity along the straight-line path.</p>`,

    fm_p3: `<p><b>Key advantages over score-based diffusion:</b></p>
<ol>
<li><b>Bounded targets</b>: Velocity vectors are bounded, unlike potentially unbounded score functions, leading to more stable training.</li>
<li><b>Straighter paths</b>: Straight-line trajectories produce smoother velocity fields that are easier for neural networks to approximate.</li>
<li><b>Fewer steps</b>: The deterministic ODE requires fewer function evaluations ($10$&ndash;$20\\times$ fewer than traditional diffusion).</li>
</ol>`,

    fm_deriv_title: "Unifying Score, Velocity, and Consistency",
    fm_deriv_body: `<p>Despite their distinct formulations, score-based diffusion, flow matching, and consistency models share a common abstraction: constructing a <b>probability path</b> $\\{p_t(\\mathbf{x})\\}_{t\\in[0,1]}$ from prior to data. The difference lies in <i>what</i> the network learns:</p>
<ul>
<li><b>Score-based diffusion</b>: Learns the <b>score function</b> $\\nabla_{\\mathbf{x}} \\log p_t(\\mathbf{x})$ to reverse a noising SDE.</li>
<li><b>Flow matching</b>: Learns the <b>velocity field</b> $\\boldsymbol{v}_{\\boldsymbol{\\theta}}(\\mathbf{x},t)$ along straight transport paths.</li>
<li><b>Consistency models</b>: Learns the <b>endpoint mapping</b> $\\boldsymbol{c}_{\\boldsymbol{\\theta}}$, i.e., the analytical solution of the PF ODE.</li>
</ul>
<p>This taxonomy organizes diffusion models along three design axes: the <b>geometry</b> of the probability path (curved vs. straight), the <b>dynamics</b> (stochastic SDE vs. deterministic ODE), and the <b>learning target</b> (score $\\boldsymbol{s}_{\\boldsymbol{\\theta}}$ vs. velocity $\\boldsymbol{v}_{\\boldsymbol{\\theta}}$ vs. endpoint $\\boldsymbol{c}_{\\boldsymbol{\\theta}}$).</p>`,

    code_fm_title: "Python: Flow Matching Training (for hands-on understanding of velocity field regression along straight paths)",
    code_fm_body: `<p>Conditional flow matching trains a velocity network along straight-line paths. The simplicity of the loss function is a key advantage over score-based methods:</p>
<div class="code-block"><div class="code-header"><span class="code-lang">Python</span><span>PyTorch</span></div><pre><span class="keyword">import</span> torch
<span class="keyword">import</span> torch.nn.functional <span class="keyword">as</span> F

<span class="keyword">def</span> <span class="function">flow_matching_step</span>(velocity_net, x_1):
    <span class="string">"""Single flow matching training step.
    velocity_net: neural network v_theta(x_t, t)
    x_1:         target data batch (from p_data)
    """</span>
    <span class="comment"># Sample from prior p_0 = N(0, I)</span>
    x_0 = torch.randn_like(x_1)

    <span class="comment"># Sample timestep uniformly</span>
    t = torch.rand(x_1.shape[<span class="number">0</span>], <span class="number">1</span>, <span class="number">1</span>, <span class="number">1</span>, device=x_1.device)

    <span class="comment"># Straight-line interpolation: x_t = (1-t)*x_0 + t*x_1</span>
    x_t = (<span class="number">1</span> - t) * x_0 + t * x_1

    <span class="comment"># True velocity along straight path: v = x_1 - x_0</span>
    v_target = x_1 - x_0

    <span class="comment"># Predict velocity and compute loss</span>
    v_pred = velocity_net(x_t, t.squeeze())
    loss = F.mse_loss(v_pred, v_target)
    <span class="keyword">return</span> loss

<span class="keyword">def</span> <span class="function">flow_matching_sample</span>(velocity_net, n_samples, dim, n_steps=<span class="number">100</span>):
    <span class="string">"""Generate samples by integrating the learned velocity ODE."""</span>
    x = torch.randn(n_samples, dim)  <span class="comment"># Start from noise</span>
    dt = <span class="number">1.0</span> / n_steps
    <span class="keyword">for</span> i <span class="keyword">in</span> <span class="builtin">range</span>(n_steps):
        t = torch.full((n_samples,), i * dt)
        x = x + velocity_net(x, t) * dt  <span class="comment"># Euler integration</span>
    <span class="keyword">return</span> x</pre></div>`,

    viz5_title: "Interactive: Flow Matching vs Score-based Diffusion",
    viz_flow_caption: "This side-by-side comparison highlights the transport efficiency of flow matching. <b>Left — Score-based diffusion</b>: curved, stochastic trajectories from noise $\\pi_0$ to data $\\pi_1$, integrated with Euler–Maruyama over many small steps (here $100$ NFE). <b>Right — Flow matching</b>: straight conditional paths $\\psi_t(\\mathbf{x})=(1-t)\\mathbf{x}_0+t\\mathbf{x}_1$ integrated by forward Euler; because the learned velocity field is nearly affine, only a handful of large steps are needed (here $10$ NFE, $\\sim\\!10\\times$ fewer). The waypoint dots on each FM path expose its few-step nature. The per-panel status boxes report live $\\text{NFE}$ usage and the accumulated transport cost — flow matching paths are markedly shorter, with fewer discretisation errors and lower wall-clock cost for the same endpoint distribution.",

    // ===== Chapter 9: Schrödinger Bridges =====
    sb_title: "Schr&ouml;dinger Bridges",
    sb_p1: `<p>Standard diffusion models and flow matching transport from a <b>fixed Gaussian prior</b> to the data distribution. But what if we want to transport between two <b>arbitrary distributions</b>? This is the setting of the Schr&ouml;dinger bridge problem, which seeks the optimal stochastic process connecting two given boundary distributions.</p>`,

    sb_p2: `<p>The optimization seeks a path measure $P$ satisfying boundary conditions $P_0 = p_0$ and $P_1 = p_1$, while minimizing:</p>
$$\\min_{P:\\, P_0 = p_0,\\, P_1 = p_1} \\mathbb{E}_P\\left[\\int_0^1 \\frac{1}{2}\\|\\boldsymbol{f}(\\mathbf{x},t)\\|_2^2\\,\\mathrm{d}t\\right] + D_{\\mathrm{KL}}(P \\parallel Q),$$
<p>where $\\boldsymbol{f}(\\cdot,t)$ is the drift guiding transport, and $Q$ denotes reference Brownian motion. The KL divergence encourages solutions close to natural diffusion. The <b>Diffusion Schr&ouml;dinger Bridge (DSB)</b> algorithm learns these bridges through Iterative Proportional Fitting (IPF), alternating between fitting forward and backward drift networks.</p>`,

    sb_p3: `<p>When the source distribution is Gaussian, the Schr&ouml;dinger bridge reduces to a diffusion model with an optimized noise schedule. When both endpoints are data distributions, it enables tasks like <b>unpaired domain translation</b> that lie beyond conventional diffusion. The <b>Image-to-Image Schr&ouml;dinger Bridge (I2SB)</b> framework exploits paired samples to reduce bridge learning to a conditional denoising objective compatible with standard DDPM training, bypassing iterative forward-backward procedures.</p>`,

    // ===== §3.3 Efficient Diffusion Methods =====
    eff_title: "Efficient Diffusion Methods",
    eff_p1: `<p>While diffusion models produce high-quality outputs, their iterative sampling (hundreds to thousands of neural network evaluations) poses significant computational challenges. The total inference cost for a U-Net backbone scales as $\\mathcal{O}(T C^2 HW)$, where $T$ is the number of function evaluations, $C$ the channel dimension, and $H \\times W$ the spatial resolution. Five primary acceleration strategies target different cost factors:</p>`,

    eff_table: `<table class="content-table">
<thead><tr><th>Strategy</th><th>Key Idea</th><th>What is Reduced</th></tr></thead>
<tbody>
<tr><td><b>Dimensionality Reduction</b></td><td>Diffusion in compressed latent spaces rather than high-dimensional data space</td><td>Spatial complexity $HW$</td></tr>
<tr><td><b>Knowledge Distillation</b></td><td>Training efficient students to replicate teacher behavior with fewer steps or reduced complexity</td><td>Sampling steps $T$</td></tr>
<tr><td><b>Structure Pruning</b></td><td>Removing redundant components while preserving generative capabilities</td><td>Channel dimension $C$, model parameters, and FLOPs</td></tr>
<tr><td><b>Cache Reuse</b></td><td>Reusing intermediate features across sampling steps to reduce redundancy</td><td>Redundant computation per step</td></tr>
<tr><td><b>Flow Matching</b></td><td>Learning optimal transport paths for deterministic, efficient generation</td><td>Number of function evaluations (NFEs)</td></tr>
</tbody></table>`,

    eff_dr_title: "Dimensionality Reduction",
    eff_dr_p1: `<p><b>Latent Diffusion Models (LDMs)</b>, exemplified by Stable Diffusion, perform the entire diffusion process in a compressed VAE latent space. For example, encoding a $(512, 512, 3)$ image into a $(64, 64, 4)$ latent achieves $64\\times$ spatial compression, drastically reducing per-step cost. Earlier models like DDPM operate in pixel space, incurring significant overhead as resolution increases. LDM decouples computational cost from output resolution.</p>
<p><b>Wavelet-based methods</b> exploit frequency-domain sparsity by decomposing signals into frequency components. During sampling, the model selectively updates important wavelet coefficients while skipping low-priority components, focusing resources on perceptually significant frequencies.</p>`,

    eff_kd_title: "Knowledge Distillation",
    eff_kd_p1: `<p>Distillation reduces the number of sampling steps $T$ by training a student model to replicate the output of a multi-step teacher in fewer evaluations. <b>Progressive Distillation</b> halves the step count iteratively. A more radical approach is <b>consistency models</b>, which learn a direct mapping from any point on the ODE trajectory to its endpoint, enabling single-step generation:</p>`,

    eff_sp_title: "Structure Pruning",
    eff_sp_p1: `<p><b>Channel pruning</b> removes entire channels from convolutional layers based on their contribution to generation quality. <b>SnapFusion</b> applies 50% uniform channel pruning to the VAE decoder (reducing MACs to ~$1/4$) and uses architecture evolution for the U-Net, evaluating each block by its impact on CLIP score degradation vs. latency improvement. This enables sub-two-second text-to-image generation on mobile devices.</p>
<p><b>Time-step pruning</b> selectively skips diffusion steps that contribute minimally to quality. Adaptive computation methods like <b>AdaDiff</b> dynamically allocate per-step resources through early-exit mechanisms using time-step-aware uncertainty estimation. Skip-step training introduces auxiliary loss terms to account for information lost during accelerated sampling.</p>`,

    eff_cr_title: "Cache Reuse",
    eff_cr_p1: `<p><b>DeepCache</b> analyzes U-Net architectures to identify temporally stable high-level features that can be cached and reused across multiple steps, while rapidly changing low-level features are recomputed. This selective computation maintains quality while substantially reducing overhead.</p>
<p><b>Learning-to-Cache (L2C)</b> trains a timestep-variant router that dynamically selects which transformer layers to compute vs. cache at each step. In early diffusion stages (coarse structure), more layers can reuse cached features; in later refinement stages, more active computation preserves fine details. The result is a static computation graph deployable without runtime overhead.</p>`,

    eff_fm_title: "Flow Matching",
    eff_fm_p1: `<p>While score-based diffusion models achieve remarkable results, they require learning the score function at all time steps, which can be computationally demanding. <b>Flow matching</b> emerges as an alternative paradigm that constructs efficient diffusion models by learning <b>velocity fields</b> along straight transport paths rather than score functions along curved SDE trajectories.</p>
<p>The straight-line paths $\\mathbf{x}_t = (1-t)\\mathbf{x}_0 + t\\mathbf{x}_1$ produce smoother velocity fields that are fundamentally easier for neural networks to approximate, enabling fewer-step generation ($10$&ndash;$20\\times$ fewer NFEs than traditional diffusion). <b>Rectified Flow</b> iteratively straightens transport paths through a "reflow" procedure, while <b>MeanFlow</b> directly predicts the mean velocity to reduce sampling to a single step. Flow matching naturally supports fewer-step generation through its continuous formulation, achieving comparable quality with substantially reduced computational overhead.</p>`,

    // ===== §3.4 Generalized Diffusion Models =====
    gen_title: "Generalized Diffusion Models",
    gen_p1: `<p>Diffusion models possess inherent flexibility that enables adaptation across diverse modalities, domains, and tasks. Three fundamental dimensions of generalization:</p>`,

    gen_modality_title: "Modality Expansion",
    gen_modality_p1: `<p>Diffusion excels at continuous data (images) but faces challenges with discrete data (text). Hybrid architectures address this gap. <b>Transfusion</b> simultaneously trains on discrete language tokens and continuous image patches using a shared transformer backbone, combining autoregressive cross-entropy loss for text with denoising loss for images. <b>Diffusion Forcing</b> introduces a training paradigm where the diffusion model denoises sequences with independent noise levels for each token, combining the adaptability of next-token prediction with the guidance capability of full-sequence diffusion for smooth long-horizon generation. <b>Show-o</b> employs modality-specific strategies within a single transformer: text tokens are processed autoregressively with causal attention while image tokens undergo discrete denoising diffusion with full attention, unified through an omni-attention mechanism.</p>
<p>High-fidelity cross-modal generation hinges on conditioning signal quality. <b>DALL-E 3</b> demonstrates that enriching training captions via a bespoke image captioner substantially narrows the semantic gap between user intent and visual output.</p>`,

    gen_domain_title: "Domain Adaptation",
    gen_domain_p1: `<p>Diffusion models can bridge domain gaps through several approaches. <b>DreamBooth</b> enables few-shot adaptation by fine-tuning on small target sets with specialized identifiers (e.g., <i>"a photo of [V] dog"</i>), balancing target adaptation with prior preservation loss to prevent overfitting. <b>Composable Diffusion</b> enables zero-shot generalization by linearly combining score functions from domain-specific models at inference time, generating images that satisfy multiple constraints simultaneously. A more principled approach to domain transfer is provided by Schr&ouml;dinger bridges. The <b>I2SB</b> framework provides a tractable instantiation for paired image-to-image translation by analytically marginalizing boundary conditions, reducing bridge learning to a conditional denoising objective compatible with standard DDPM training.</p>`,

    gen_task_title: "Task Generalization",
    gen_policy_title: "",
    gen_policy_p1: `<p><b>Diffuser (Planning with Diffusion)</b> demonstrates model-based reinforcement learning by generating entire trajectories. Rather than learning separate dynamics and policy models, it jointly learns the trajectory distribution $\\boldsymbol{\\tau} = (\\mathbf{s}_0, \\mathbf{a}_0, \\mathbf{s}_1, \\mathbf{a}_1, \\ldots, \\mathbf{s}_T)$, capturing both environment dynamics and policy. High-reward trajectories are preferentially sampled through guidance during reverse diffusion.</p>
<p><b>Diffusion Policy</b> reconceptualizes action selection as conditional generation: actions are sampled by denoising from $\\mathbf{a}_T \\sim \\mathcal{N}(\\mathbf{0}, \\mathbf{I})$ to clean actions $\\mathbf{a}_0$ through:</p>
$$p_{\\boldsymbol{\\theta}}(\\mathbf{a}_{t-1}|\\mathbf{a}_t, \\mathbf{s}) = \\mathcal{N}(\\mathbf{a}_{t-1};\\, \\boldsymbol{\\mu}_{\\boldsymbol{\\theta}}(\\mathbf{a}_t, t, \\mathbf{s}),\\, \\sigma_t^2\\mathbf{I}),$$
<p>where $\\mathbf{s}$ is the state observation. This naturally handles multi-modal action distributions crucial for tasks with multiple valid solutions. The iterative refinement provides implicit planning: early steps capture high-level strategy while later steps refine execution details.</p>`,

    gen_policy_p2: `<p><b>DDPO (Denoising Diffusion Policy Optimization)</b> recasts the iterative denoising procedure as a multi-step MDP: each denoising transition is treated as a policy action, and a scalar reward $r(\\mathbf{x}_0, \\mathbf{y})$ is assigned to the final sample. The objective maximizes:</p>
$$\\mathcal{J}(\\boldsymbol{\\theta}) = \\mathbb{E}_{\\mathbf{y},\\, \\mathbf{x}_{0:T} \\sim p_{\\boldsymbol{\\theta}}} \\left[ r(\\mathbf{x}_0, \\mathbf{y}) \\right].$$
<p>The policy gradient decomposes across denoising steps:</p>
$$\\nabla_{\\boldsymbol{\\theta}} \\mathcal{J}(\\boldsymbol{\\theta}) = \\mathbb{E} \\left[ r(\\mathbf{x}_0, \\mathbf{y}) \\sum_{t=1}^{T} \\nabla_{\\boldsymbol{\\theta}} \\log p_{\\boldsymbol{\\theta}}(\\mathbf{x}_{t-1}|\\mathbf{x}_t, \\mathbf{y}) \\right],$$
<p>where $\\nabla_{\\boldsymbol{\\theta}} \\log p_{\\boldsymbol{\\theta}}$ is the <b>Fisher score</b> (gradient w.r.t. <i>model parameters</i>, distinct from the Stein score which differentiates w.r.t. <i>random variables</i>). This enables fine-tuning diffusion models with human feedback for aesthetic quality, safety, and prompt-image alignment.</p>
<p><b>C-LoRA</b> tackles catastrophic forgetting through continually self-regularized low-rank adaptation. When learning a new concept, accumulated past LoRA weight deltas penalize new updates, balancing plasticity and stability without replaying past data. <b>Diffusion-ES</b> combines diffusion-based trajectory generation with gradient-free evolutionary search. High-scoring trajectories are mutated through a truncated diffusion process (forward noising followed by reverse denoising), serving as a structure-preserving mutation operator for black-box optimization.</p>`,

    // ===== Figure Placeholders =====
    fig_disgen_placeholder: "Figure: Discriminative vs. Generative Modeling — will be replaced by SVG",
    fig_disgen_caption: "Comparison between discriminative and generative modeling in machine learning. Discriminative models directly learn the mapping from inputs to outputs, while generative models learn the underlying data distribution enabling synthesis.",
    fig_score_placeholder: "Figure: Score-Based Modeling Pipeline — will be replaced by SVG",
    fig_score_caption: "Score-based modeling pipeline for diffusion models. (a) Score matching: The model learns to approximate the score (gradient of log-density) of the data distribution through denoising score matching. (b) Stochastic sampling: Langevin dynamics generates samples by following the learned score function with stochastic perturbations.",
    fig_sde_placeholder: "Figure: Forward-Reverse SDE Pipeline — will be replaced by SVG",
    fig_sde_caption: "Forward-reverse SDE pipeline for score-based diffusion models. The forward SDE progressively corrupts input into Gaussian noise. The reverse SDE performs iterative denoising guided by the learned score, composing denoising kernels to yield the output.",
    fig_pc_placeholder: "Figure: Predictor-Corrector Method for Solving PF ODEs — will be replaced by SVG",
    fig_pc_caption: "Solving probability flow ODEs with the Predictor-Corrector method. Prediction provides a coarse estimate, while correction performs score-based refinement.",
    fig_inference_placeholder: "Figure: Inference-time Conditional Diffusion Models — will be replaced by SVG",
    fig_inference_caption: "Inference-time conditioning: the conditional score is decomposed as the unconditional score plus a guidance field, enabling plug-and-play adaptation without retraining.",
    fig_training_placeholder: "Figure: Training-time Conditional Diffusion Models — will be replaced by SVG",
    fig_training_caption: "Training-time conditioning: the model jointly learns conditional and unconditional scores, interpolated via the guidance strength γ during sampling.",
    fig_flow_placeholder: "Figure: Flow Matching Mechanism — will be replaced by SVG",
    fig_flow_caption: "Underlying mechanism of flow matching. Samples from the prior are transported along straight-line conditional paths toward target data points. The probability path, velocity field, and flow form a triangular relationship.",

    // ===== References =====
    ref_title: "References",
    ref_content: `<ul>
<li>Sohl-Dickstein et al., "Deep Unsupervised Learning using Nonequilibrium Thermodynamics," ICML 2015.</li>
<li>Ho et al., "Denoising Diffusion Probabilistic Models (DDPM)," NeurIPS 2020.</li>
<li>Song &amp; Ermon, "Generative Modeling by Estimating Gradients of the Data Distribution," NeurIPS 2019.</li>
<li>Song et al., "Score-Based Generative Modeling through Stochastic Differential Equations," ICLR 2021.</li>
<li>Song et al., "Denoising Diffusion Implicit Models (DDIM)," ICLR 2021.</li>
<li>Dhariwal &amp; Nichol, "Diffusion Models Beat GANs on Image Synthesis," NeurIPS 2021.</li>
<li>Ho &amp; Salimans, "Classifier-Free Diffusion Guidance," NeurIPS Workshop 2021.</li>
<li>De Bortoli et al., "Diffusion Schr&ouml;dinger Bridge with Applications to Score-Based Generative Modeling," NeurIPS 2021.</li>
<li>Rombach et al., "High-Resolution Image Synthesis with Latent Diffusion Models (LDM)," CVPR 2022.</li>
<li>Janner et al., "Planning with Diffusion for Flexible Behavior Synthesis (Diffuser)," ICML 2022.</li>
<li>Calvin Luo, "Understanding Diffusion Models: A Unified Perspective," arXiv 2022.</li>
<li>Chung et al., "Diffusion Posterior Sampling for General Noisy Inverse Problems," ICLR 2023.</li>
<li>Song et al., "Consistency Models," ICML 2023.</li>
<li>Lipman et al., "Flow Matching for Generative Modeling," ICLR 2023.</li>
<li>Liu et al., "Flow Straight and Fast: Learning to Generate and Transfer Data with Rectified Flow," ICLR 2023.</li>
<li>Liu et al., "I2SB: Image-to-Image Schr&ouml;dinger Bridge," ICML 2023.</li>
<li>Chi et al., "Diffusion Policy: Visuomotor Policy Learning via Action Diffusion," RSS 2023.</li>
<li>Tong et al., "Improving and Generalizing Flow-Based Generative Models with Minibatch Optimal Transport," TMLR 2024.</li>
<li>Black et al., "Training Diffusion Models with Reinforcement Learning (DDPO)," ICLR 2024.</li>
<li>Stanley Chan, "Tutorial on Diffusion Models for Imaging and Vision," arXiv 2024.</li>
<li>Yang Song's blog: <a href="https://yang-song.net/blog/2021/score/" target="_blank">Generative Modeling by Estimating Gradients of the Data Distribution</a></li>
<li>Lilian Weng's blog: <a href="https://lilianweng.github.io/posts/2021-07-11-diffusion-models/" target="_blank">What are Diffusion Models?</a></li>
<li>Cambridge MLG blog: <a href="https://mlg.eng.cam.ac.uk/blog/2024/01/20/flow-matching.html" target="_blank">An Introduction to Flow Matching</a></li>
</ul>`,

    // ===== Figures =====
    fig_score_pipeline_placeholder: "Figure: Score-based modeling pipeline (placeholder for paper Fig. 2)",
    fig_sde_pipeline_placeholder: "Figure: Forward-reverse SDE pipeline (placeholder for paper Fig. 3)",
    fig_pc_placeholder: "Figure: Predictor-Corrector method (placeholder for paper Fig. 4)",
    fig_flow_placeholder: "Figure: Flow matching mechanism (placeholder for paper Fig. 5)",

    // ===== Modal & Footer =====
    bib_title: "BibTeX Citation",
    bib_copy: "Copy to Clipboard",
    bib_copied: "Copied!",
    footer_text: "&copy; 2026 Hai-Long Qin. All rights reserved. | Last updated: August 2026"
},

// =====================================================================
// CHINESE TRANSLATION
// =====================================================================
zh: {
    // ===== 元数据 =====
    pageTitle: "面向语义通信的扩散模型",
    paperTitle: "生成式AI驱动6G及未来通信：面向语义通信的扩散模型",
    related_links_btn: "相关链接",
    author_1: '秦海龙<sup>1</sup>',
    author_2: '戴金晟<sup>1</sup>',
    author_3: '鲁国<sup>2</sup>',
    author_4: '邵硕<sup>3</sup>',
    author_5: '王思贤<sup>2</sup>',
    author_6: '许通达<sup>4</sup>',
    author_7: '张文军<sup>2</sup>',
    author_8: '张平<sup>1</sup>',
    author_9: '李德富<sup>5</sup>',
    affiliation1: "<sup>1</sup>北京邮电大学 (BUPT)",
    affiliation2: "<sup>2</sup>上海交通大学 (SJTU)",
    affiliation3: "<sup>3</sup>华东师范大学 (ECNU)",
    affiliation4: "<sup>4</sup>清华大学 (THU)",
    affiliation5: "<sup>5</sup>香港科技大学 (HKUST)",
    venueInfo: "已录用于 IEEE Communications Surveys &amp; Tutorials (COMST), 2026年",
    btn_paper: "论文",
    tooltip_cite: "引用本文",
    tooltip_lang: "切换语言",

    // ===== 导航 =====
    nav_tldr: "要点概述",
    nav_prelim: "预备知识",
    nav_fundamentals: "扩散基础",
    nav_conditional: "条件扩散",
    nav_efficient: "高效扩散",
    nav_generalized: "泛化扩散",
    nav_references: "参考文献",

    // ===== 要点概述 =====
    tldr_content: `<p>本页面是 IEEE Communications Surveys &amp; Tutorials (COMST) 论文<a href="https://arxiv.org/abs/2511.08416" target="_blank"><i>"Generative AI Meets 6G and Beyond: Diffusion Models for Semantic Communications"</i></a>（arXiv: 2511.08416）的配套教程。语义通信标志着通信范式从比特精确传输向语义中心的转变——接收端不再逐比特恢复原始数据流，而是从紧凑的语义表征中重建内容。在众多生成模型中，扩散模型凭借卓越的生成质量、稳定的训练过程和坚实的理论基础脱颖而出，尤为适合充当生成式语义通信系统的解码核心。</p>
<p><b>你将学到：</b></p>
<ol>
<li><b>扩散模型基础</b>：得分匹配、朗之万动力学、随机微分方程（SDE）以及概率流ODE求解器。</li>
<li><b>条件扩散模型</b>：分类器引导、估计器引导（含面向逆问题的扩散后验采样）以及无分类器引导。</li>
<li><b>高效扩散模型</b>：数据降维、知识蒸馏、结构剪枝、缓存复用和流匹配五大加速策略。</li>
<li><b>泛化扩散模型</b>：模态扩展、域自适应和任务泛化，将扩散模型的能力拓展至图像生成之外。</li>
</ol>`,

    // ===== §2 预备知识 =====
    prelim_title: "预备知识",
    prelim_dgm_title: "",
    prelim_models_title: "",

    intro_p1: `<p>机器学习中一个基本区分在于<b>判别式</b>建模与<b>生成式</b>建模。判别式模型学习类别之间的决策边界；生成式模型则学习所有变量上的联合分布，拟合数据的底层分布。生成式模型模拟现实世界中的数据生成过程，具有两大核心优势：(1) 赋能AI生成内容（AIGC）应用与无监督表征学习，提取解耦的、语义可解释的变化因子；(2) 能够融入物理定律与约束，将未知细节视为噪声处理，从而兼具直观性与可解释性。</p>
<p>令 $\\mathcal{X} \\subset \\mathbb{R}^D$ 表示维度为 $D \\in \\mathbb{N}^+$ 的数据空间。真实数据分布 $p_{\\mathrm{data}}(\\mathbf{x}): \\mathbb{R}^D \\to \\mathbb{R}_{\\geqslant 0}$ 满足 $\\int_{\\mathbb{R}^D} p_{\\mathrm{data}}(\\mathbf{x}) \\,\\mathrm{d}\\mathbf{x} = 1$，其中 $\\mathbf{x} = (x_1, \\ldots, x_D)^{\\top} \\in \\mathbb{R}^D$ 为一个数据点。生成建模的目标是从数据集 $\\{\\mathbf{x}_i\\}_{i=1}^{N}$ 中估计 $p_{\\mathrm{data}}(\\mathbf{x})$，从而支持采样与概率评估。参数化模型 $p_{\\boldsymbol{\\theta}}(\\mathbf{x}): \\mathbb{R}^D \\to \\mathbb{R}_{\\geqslant 0}$（参数 $\\boldsymbol{\\theta} \\in \\Theta \\subset \\mathbb{R}^P$，$P \\in \\mathbb{N}^+$）作为 $p_{\\mathrm{data}}(\\mathbf{x})$ 的代理，目标是找到最优参数 $\\boldsymbol{\\theta}^{\\star}$ 使得 $p_{\\boldsymbol{\\theta}^{\\star}}(\\mathbf{x}) \\approx p_{\\mathrm{data}}(\\mathbf{x})$。当此类模型由深度神经网络（DNN）参数化时，便形成了<b>深度生成模型</b>。</p>
<p>一个合法的概率分布需要 $p_{\\boldsymbol{\\theta}}(\\mathbf{x})$ 满足两个条件：(1) <b>非负性</b>：$\\forall \\mathbf{x} \\in \\mathbb{R}^D: p_{\\boldsymbol{\\theta}}(\\mathbf{x}) \\geqslant 0$；(2) <b>归一化</b>：$\\int_{\\mathbb{R}^D} p_{\\boldsymbol{\\theta}}(\\mathbf{x})\\,\\mathrm{d}\\mathbf{x} = 1$。非负性容易保证，但归一化却是一大难题：它要求在整个高维数据空间上进行积分，对于复杂模型通常不可解。正是这一根本困难催生了现代深度生成模型的各种专门策略。</p>`,

    intro_p2: `<p><b>能量模型。</b>当精确归一化不可行时，<i>近似</i>成为必要手段。能量模型借鉴统计物理中的玻尔兹曼分布，利用玻尔兹曼机参数化分布：$p_{\\boldsymbol{\\theta}}(\\mathbf{x}) = \\exp(-\\beta E_{\\boldsymbol{\\theta}}(\\mathbf{x})) / Z_{\\boldsymbol{\\theta}}$，其中$E_{\\boldsymbol{\\theta}}(\\mathbf{x})$为能量函数（如势能$-\\log p_{\\boldsymbol{\\theta}}(\\mathbf{x})$），$\\beta$为类逆温度的正常数，$Z_{\\boldsymbol{\\theta}} = \\int \\exp(-\\beta E_{\\boldsymbol{\\theta}}(\\mathbf{x}))\\,\\mathrm{d}\\mathbf{x}$为确保归一化的配分函数。能量函数可由DNN灵活参数化，无需归一化约束，但$Z_{\\boldsymbol{\\theta}}$的计算涉及不可解的高维积分。好在马尔可夫链蒙特卡洛（MCMC）方法能在不显式计算$Z_{\\boldsymbol{\\theta}}$的情况下实现近似训练。然而，概率评估仍需估计$Z_{\\boldsymbol{\\theta}}$，不可避免地引入估计误差。</p>
<p><b>显式模型。</b>除近似手段外，也可通过显式公式直接实现归一化。两类代表性方法分别是<b>自回归模型（ARMs）</b>和<b>变分自编码器（VAEs）</b>。</p>
<p><i>ARMs</i> 利用概率链式法则将高维分布分解为一系列单变量条件分布的乘积：$p_{\\boldsymbol{\\theta}}(\\mathbf{x}) = \\prod_{i=1}^D p_{\\boldsymbol{\\theta}}(x_i | \\mathbf{x}_{&lt;i})$，其中$\\mathbf{x}_{&lt;i} = \\{x_1, \\ldots, x_{i-1}\\}$。只要每个条件分布已归一化，整体就能保证精确归一化。但自回归分解要求数据维度具有特定的顺序排列，这对文本、音频等序列数据而言自然成立，但对缺乏固有排序的数据（如图像像素）则构成限制。因此，ARMs擅长序列数据生成，但在超高分辨率图像或视频生成方面仍面临挑战。</p>
<p><i>VAEs</i> 通过引入辅助隐变量$\\mathbf{z} \\sim p(\\mathbf{z})$来建模数据分布：$p_{\\boldsymbol{\\theta}}(\\mathbf{x}) = \\int p(\\mathbf{z})\\,p_{\\boldsymbol{\\theta}}(\\mathbf{x}|\\mathbf{z})\\,\\mathrm{d}\\mathbf{z}$，可理解为无限混合模型——$p(\\mathbf{z})$提供混合系数，$p_{\\boldsymbol{\\theta}}(\\mathbf{x}|\\mathbf{z})$定义混合成分。编码器$q_{\\boldsymbol{\\phi}}(\\mathbf{z}|\\mathbf{x})$通过变分推断近似不可解的后验分布，训练时最大化证据下界（ELBO）。只要$p(\\mathbf{z})$和$p_{\\boldsymbol{\\theta}}(\\mathbf{x}|\\mathbf{z})$均已归一化，整体归一化即可保证。但受制于变分下界的松弛，VAE生成的样本往往较为模糊。</p>
<p><b>隐式模型。</b>归一化的挑战根源在于对概率密度函数的显式建模；如果改用隐式方式表示概率分布，便可完全绕过这一问题。<b>生成对抗网络（GANs）</b>是隐式模型最具代表性的一族：它直接建模采样过程，彻底免除归一化。GANs将数据生成建模为两步过程：先从简单先验中采样$\\mathbf{z} \\sim p(\\mathbf{z})$，再经确定性生成器$G_{\\boldsymbol{\\theta}}$变换得$\\mathbf{x} = G_{\\boldsymbol{\\theta}}(\\mathbf{z})$。所诱导的分布$p_{\\boldsymbol{\\theta}}(\\mathbf{x})$被隐式定义，无需直接参数化。训练引入判别器$D_{\\boldsymbol{\\phi}}: \\mathbb{R}^D \\to [0, 1]$区分真实数据与生成样本，生成器则设法"欺骗"判别器，形成对抗博弈。GANs无需施加归一化的架构约束，可利用灵活的DNN，但无法输出概率值。此外，对抗训练常常面临不稳定和模式坍缩问题——生成器仅聚焦于有限的数据模式，未能捕获完整的数据多样性。</p>`,

    intro_table: `<table class="content-table">
<thead><tr><th>类别</th><th>策略</th><th>核心优势</th><th>核心局限</th></tr></thead>
<tbody>
<tr><td><b>能量模型</b></td><td>通过 MCMC 等采样策略近似归一化</td><td>能量函数可由DNN灵活参数化</td><td>配分函数 $Z_{\\boldsymbol{\\theta}}$ 不可解；概率评估存在估计误差</td></tr>
<tr><td><b>显式模型</b>（ARMs、VAEs）</td><td>通过链式法则或变分推断实现显式归一化</td><td>精确归一化，似然可解</td><td>ARMs：局限于顺序采样，需预设排序；VAEs：变分下界松弛导致重建模糊</td></tr>
<tr><td><b>隐式模型</b>（GANs）</td><td>直接建模采样过程，绕过密度参数化</td><td>视觉质量逼真；无需归一化</td><td>模式坍缩与训练不稳定；无法提供概率值</td></tr>
<tr><td><b>得分模型</b></td><td>学习得分函数（对数密度梯度）$\\boldsymbol{s}(\\mathbf{x}) := \\nabla_{\\mathbf{x}} \\log p(\\mathbf{x})$</td><td>训练稳定；对归一化完全"无感"；生成样本质量高</td><td>需要得分匹配与迭代采样，生成速度较慢</td></tr>
</tbody></table>`,

    intro_p3: `<p><b>得分模型</b>作为一种先进范式，克服了此前深度生成模型的关键局限。它既不建模归一化分布，也不使用对抗训练，而是学习<b>得分函数</b> $\\boldsymbol{s}(\\mathbf{x}) := \\nabla_{\\mathbf{x}} \\log p(\\mathbf{x})$——对数密度的梯度。神经网络迭代估计该量，得到参数为$\\boldsymbol{\\theta}$的$\\boldsymbol{s}_{\\boldsymbol{\\theta}}(\\mathbf{x})$。</p>
<p>得分模型本质上是一个保守向量场。在物理学中，得分$\\nabla_{\\mathbf{x}} \\log p(\\mathbf{x})$对应势能$-\\log p(\\mathbf{x})$的负梯度，如同一种"力"驱动样本朝高概率区域运动。这一直觉通过用神经网络参数化能量函数$E_{\\boldsymbol{\\theta}}(\\mathbf{x})$并构造得分模型$\\boldsymbol{s}_{\\boldsymbol{\\theta}}(\\mathbf{x}) = -\\nabla_{\\mathbf{x}} E_{\\boldsymbol{\\theta}}(\\mathbf{x})$得以实现。</p>
<p>关键在于，得分函数对<b>归一化完全"无感"</b>。对于未归一化的密度$\\tilde{p}(\\mathbf{x})$（$\\int \\tilde{p}(\\mathbf{x})\\,\\mathrm{d}\\mathbf{x} = Z \\ne 1$）：</p>
$$\\boldsymbol{s}(\\mathbf{x}) = \\nabla_{\\mathbf{x}} \\log \\frac{\\tilde{p}(\\mathbf{x})}{Z} = \\nabla_{\\mathbf{x}} \\log \\tilde{p}(\\mathbf{x}) - \\underbrace{\\nabla_{\\mathbf{x}} \\log Z}_{=0} = \\nabla_{\\mathbf{x}} \\log \\tilde{p}(\\mathbf{x}),$$
<p>归一化常数$Z$完全消失。在基于得分的深度生成模型中，最具代表性的便是<b>扩散模型</b>——它将得分建模与随机微分方程相结合，在稳定训练和灵活条件化的基础上实现了顶尖的生成质量。扩散模型正是本教程的核心内容。</p>`,

    // ===== §3.1 扩散模型基础 =====
    fund_title: "扩散模型基础",
    sm_title: "得分匹配与朗之万动力学",
    sm_p1: `<p>如上所述，由于配分函数$Z_{\\boldsymbol{\\theta}}$不可解，学习未归一化的生成模型极具挑战。这引出一个自然的问题：如何从高维数据中有效训练灵活的基于得分的扩散模型？答案在于<b>得分匹配</b>——一种用于估计未归一化统计模型（尤其是得分模型）的成熟技术。</p>
<p>得分匹配最小化数据分布与模型分布得分之间的距离。由于直接操作对不可解配分函数"无感"的得分，整个过程无需计算$Z_{\\boldsymbol{\\theta}}$。从统计学视角，这等价于最小化 $p_{\\mathrm{data}}(\\mathbf{x})$ 与 $p_{\\boldsymbol{\\theta}}(\\mathbf{x})$ 之间的<b>Fisher散度</b>：</p>
$$D_{F}(p_{\\mathrm{data}} \\parallel p_{\\boldsymbol{\\theta}}) := \\mathbb{E}_{p_{\\mathrm{data}}(\\mathbf{x})} \\left[ \\frac{1}{2} \\left\\| \\boldsymbol{s}(\\mathbf{x}) - \\boldsymbol{s}_{\\boldsymbol{\\theta}}(\\mathbf{x}) \\right\\|_2^2 \\right].$$
<p>由于$\\boldsymbol{s}_{\\boldsymbol{\\theta}}(\\mathbf{x})$不涉及$Z_{\\boldsymbol{\\theta}}$，Fisher散度与该不可解项无关。但直接计算Fisher散度仍不可行——它需要获取未知的真实数据得分$\\boldsymbol{s}(\\mathbf{x})$。为绕过此限制，可通过<b>分部积分</b>（Hyv&auml;rinen, 2005）将Fisher散度重写为等价目标，消除对真实得分的依赖。具体地，散度可分解为$D_{F} = \\mathcal{L}(\\boldsymbol{\\theta}) + C$，$C$为与$\\boldsymbol{\\theta}$无关的常数，可行损失函数为：</p>
$$\\mathcal{L}(\\boldsymbol{\\theta}) := \\mathbb{E}_{p_{\\mathrm{data}}(\\mathbf{x})}\\left[ \\frac{1}{2} \\left\\| \\boldsymbol{s}_{\\boldsymbol{\\theta}}(\\mathbf{x}) \\right\\|_2^2 + \\mathrm{tr}(\\nabla_{\\mathbf{x}} \\boldsymbol{s}_{\\boldsymbol{\\theta}}(\\mathbf{x})) \\right],$$
<p>其中$\\mathrm{tr}(\\cdot)$为矩阵的迹。虽然该损失无需真实得分，但实际实现要计算<b>Hessian矩阵</b>的迹$\\mathrm{tr}(\\nabla_{\\mathbf{x}} \\boldsymbol{s}_{\\boldsymbol{\\theta}}(\\mathbf{x}))$，涉及高维空间中昂贵的二阶导数计算。为突破这一瓶颈，<b>去噪得分匹配（DSM）</b>成为训练基于得分的扩散模型的标准方法。</p>`,

    sm_p2: `<p><b>去噪得分匹配（DSM）</b>通过对数据施加<i>受控噪声破坏</i>来重新构造得分匹配目标。DSM不在原始数据分布上匹配得分，而是在噪声损坏分布$q(\\tilde{\\mathbf{x}}) = \\int_{\\mathbb{R}^D} p_{\\mathrm{data}}(\\mathbf{x})\\,q(\\tilde{\\mathbf{x}}|\\mathbf{x})\\,\\mathrm{d}\\mathbf{x}$上操作，$q(\\tilde{\\mathbf{x}}|\\mathbf{x})$为噪声破坏核。所得DSM目标为：</p>
$$\\mathcal{J}(\\boldsymbol{\\theta}) := \\mathbb{E}_{p_{\\mathrm{data}}(\\mathbf{x})\\, q(\\tilde{\\mathbf{x}}|\\mathbf{x})} \\left[ \\frac{1}{2} \\left\\| \\nabla_{\\tilde{\\mathbf{x}}} \\log q(\\tilde{\\mathbf{x}}|\\mathbf{x}) - \\boldsymbol{s}_{\\boldsymbol{\\theta}}(\\tilde{\\mathbf{x}}) \\right\\|_2^2 \\right],$$
<p>无需计算任何Hessian矩阵。值得注意的是，DSM学到的是<b>噪声损坏分布的得分</b>而非原始数据分布的得分。噪声破坏核$q(\\tilde{\\mathbf{x}}|\\mathbf{x})$通常采用加性高斯噪声实现，因其兼具解析可处理性与良好的理论性质。</p>`,

    sm_p3: "",

    sm_deriv_title: "",
    sm_deriv_body: "",

    sm_langevin_title: "朗之万动力学",
    sm_langevin_p1: `<p>一旦得分模型$\\boldsymbol{s}_{\\boldsymbol{\\theta}}(\\mathbf{x})$训练完成，便可通过<b>朗之万动力学</b>生成样本——这是一种源自统计物理的迭代采样过程，最初用于描述流体中粒子的布朗运动。</p>
<p>数学上，朗之万动力学实现了一个离散MCMC过程：从任意先验$\\mathbf{x}_0 \\sim \\pi(\\mathbf{x})$出发，按如下规则迭代更新（$i = 1, 2, \\ldots, N$）：</p>
$$\\mathbf{x}_{i} = \\mathbf{x}_{i-1} + \\zeta\\, \\boldsymbol{s}_{\\boldsymbol{\\theta}}(\\mathbf{x}_{i-1}) + \\sqrt{2\\zeta}\\, \\boldsymbol{\\epsilon}, \\quad \\boldsymbol{\\epsilon} \\sim \\mathcal{N}(\\mathbf{0}, \\mathbf{I}),$$
<p>其中$\\zeta$为步长，$\\boldsymbol{\\epsilon} \\sim \\mathcal{N}(\\mathbf{0}, \\mathbf{I})$为标准高斯噪声，$\\mathbf{I}$为单位矩阵。每次更新包含三个分量：当前位置$\\mathbf{x}_{i-1}$；由学习到的得分$\\boldsymbol{s}_{\\boldsymbol{\\theta}}(\\mathbf{x}_{i-1})$引导的朝高概率区域的<b>确定性漂移</b>；以及防止动力学陷入局部模态的<b>随机扰动</b>$\\boldsymbol{\\epsilon}$。当$\\zeta \\to 0$且$N \\to \\infty$时，在温和的正则条件下，采样终点$\\mathbf{x}_N$精确收敛至目标分布$p_{\\mathrm{data}}(\\mathbf{x})$。</p>`,

    viz1_title: "交互演示：得分场与朗之万动力学",
    viz_score_caption: "此交互演示展示一个均衡布局的三模态（$\\mu_1, \\mu_2, \\mu_3$）二维高斯混合的得分场 $\\nabla_{\\mathbf{x}} \\log p(\\mathbf{x})$，混合权重为 $(\\pi_1,\\pi_2,\\pi_3)=(0.36,\\,0.32,\\,0.32)$，三模态均匀铺满画布。白色箭头标示得分方向与相对幅值；等值线显示等密度水平；左下角色条展示 $\\|\\nabla \\log p\\|$。点击任意位置即可放置粒子。当 <b>Stochastic</b> 开启时，演化遵循朗之万 MCMC 迭代 $\\mathbf{x}_{i+1} = \\mathbf{x}_i + \\zeta\\,\\nabla \\log p(\\mathbf{x}_i) + \\sqrt{2\\zeta}\\,\\boldsymbol{\\epsilon}$，粒子最终遍历<em>所有</em>模态；关闭后退化为纯梯度上升（确定性、易陷入单一模态）。右上角实时显示当前步长 $\\zeta$ 与迭代次数。",

    code_sm_title: "Python：得分匹配与朗之万采样（动手理解DSM损失与迭代采样）",
    code_sm_body: `<p>去噪得分匹配与朗之万动力学采样的最小 PyTorch 实现：</p>
<div class="code-block"><div class="code-header"><span class="code-lang">Python</span><span>PyTorch</span></div><pre><span class="keyword">import</span> torch
<span class="keyword">import</span> torch.nn <span class="keyword">as</span> nn

<span class="keyword">def</span> <span class="function">denoising_score_matching_loss</span>(score_net, data, sigma=<span class="number">0.1</span>):
    <span class="string">"""DSM loss: train score_net to predict -eps/sigma from noisy data."""</span>
    noise = torch.randn_like(data)
    noisy_data = data + sigma * noise
    predicted_score = score_net(noisy_data)
    target = -noise / sigma  <span class="comment"># Ground-truth score of Gaussian corruption</span>
    <span class="keyword">return</span> <span class="number">0.5</span> * ((predicted_score - target) ** <span class="number">2</span>).sum(dim=-<span class="number">1</span>).mean()

<span class="keyword">def</span> <span class="function">langevin_sampling</span>(score_net, n_samples, n_steps, step_size, dim=<span class="number">2</span>):
    <span class="string">"""Generate samples via Langevin dynamics."""</span>
    x = torch.randn(n_samples, dim)
    <span class="keyword">for</span> _ <span class="keyword">in</span> <span class="builtin">range</span>(n_steps):
        score = score_net(x)
        noise = torch.randn_like(x)
        x = x + step_size * score + (<span class="number">2</span> * step_size) ** <span class="number">0.5</span> * noise
    <span class="keyword">return</span> x

<span class="comment"># Example usage</span>
score_net = nn.Sequential(nn.Linear(<span class="number">2</span>, <span class="number">128</span>), nn.ReLU(), nn.Linear(<span class="number">128</span>, <span class="number">2</span>))
optimizer = torch.optim.Adam(score_net.parameters(), lr=<span class="number">1e-3</span>)

<span class="keyword">for</span> epoch <span class="keyword">in</span> <span class="builtin">range</span>(<span class="number">1000</span>):
    data = <span class="function">sample_2d_data</span>(<span class="number">256</span>)  <span class="comment"># Your 2D dataset</span>
    loss = <span class="function">denoising_score_matching_loss</span>(score_net, data, sigma=<span class="number">0.1</span>)
    optimizer.zero_grad(); loss.backward(); optimizer.step()

samples = <span class="function">langevin_sampling</span>(score_net, <span class="number">500</span>, n_steps=<span class="number">1000</span>, step_size=<span class="number">0.01</span>)</pre></div>`,

    // ===== 第四章：SDE框架 =====
    sde_title: "基于得分的SDE建模",
    sde_p1: `<p>在标准得分建模流程的基础上，Song等人提出了一个统一框架，通过<b>随机微分方程（SDEs）</b>的视角推广得分匹配与采样过程。该框架不再在有限数量的噪声级别上扰动数据，而是考虑在连续时间上平滑演化的中间分布连续体。其演化遵循一个预设的、与数据无关且不含可训练参数的SDE。在此基础上推导出对应的反向SDE，并通过训练时间依赖的神经网络估计得分函数来近似求解。</p>
<p><b>用前向SDE扰动数据。</b>为桥接离散递推与连续时间SDE，考虑从离散到连续的自然递进：</p>
<ul>
<li><b>离散梯度下降：</b>$\\mathbf{x}_{i+1} = \\mathbf{x}_i - \\beta_i \\nabla f(\\mathbf{x}_i)$，$\\beta_i$为第$i$步的步长。</li>
<li><b>连续时间ODE：</b>令步长趋于零，得$\\frac{\\mathrm{d}\\mathbf{x}(t)}{\\mathrm{d}t} = -\\beta(t) \\nabla f(\\mathbf{x}(t))$，$\\beta(t)$为离散步长的连续对应。</li>
<li><b>随机微分方程（SDE）：</b>从生成建模角度看，确定性动力学无法捕捉数据分布的随机性。通过<b>It&ocirc;微积分</b>引入随机扰动——噪声$\\mathbf{n}(t)\\,\\mathrm{d}t = \\mathrm{d}\\mathbf{w}(t)$，$\\mathbf{w}(t)$为标准<b>维纳过程</b>（增量满足$\\mathbf{w}(t+\\Delta t) - \\mathbf{w}(t) \\sim \\mathcal{N}(\\mathbf{0}, \\Delta t\\,\\mathbf{I})$），从而将ODE推广为SDE。</li>
</ul>
<p>前向扩散过程$\\{\\mathbf{x}(t)\\}_{t\\in[0,T]}$被建模为It&ocirc; SDE的解：</p>
$$\\mathrm{d}\\mathbf{x} = \\boldsymbol{f}(\\mathbf{x}, t)\\,\\mathrm{d}t + g(t)\\,\\mathrm{d}\\mathbf{w},$$
<p>其中向量值<b>漂移系数</b>$\\boldsymbol{f}(\\cdot, t): \\mathbb{R}^D \\to \\mathbb{R}^D$刻画粒子在外力下的确定性漂移，将其拉向目标先验分布；标量值<b>扩散系数</b>$g(t): \\mathbb{R}_{\\geqslant 0} \\to \\mathbb{R}_{>0}$控制每个时间步噪声注入的强度。漂移-扩散分解直接联系到<b>Fokker–Planck方程</b>（亦称Kolmogorov前向方程），它描述了整个粒子集合的概率密度$p_t(\\mathbf{x})$如何随时间演化。此处每个"粒子"代表时间$t$处一个数据样本的状态。</p>`,

    sde_p2: `<p><b>前向扩散</b>过程 $\\{\\mathbf{x}(t)\\}_{t\\in[0,T]}$ 将数据 $\\mathbf{x}(0) \\sim p_{\\mathrm{data}}$ 逐步变换为噪声 $\\mathbf{x}(T) \\sim p_T \\approx \\mathcal{N}(\\mathbf{0}, \\sigma_T^2\\mathbf{I})$，建模为 It&ocirc; SDE 的解：</p>
$$\\mathrm{d}\\mathbf{x} = \\boldsymbol{f}(\\mathbf{x}, t)\\,\\mathrm{d}t + g(t)\\,\\mathrm{d}\\mathbf{w},$$
<p>其中 $\\boldsymbol{f}(\\cdot, t): \\mathbb{R}^D \\to \\mathbb{R}^D$ 为<b>漂移系数</b>，确定性地将状态引向可解先验分布；$g(t): \\mathbb{R}_{\\geqslant 0} \\to \\mathbb{R}_{>0}$ 为<b>扩散系数</b>，控制随机噪声注入的强度；$\\mathbf{w}(t)$ 为标准维纳过程（$\\mathbf{w}(t+\\Delta t) - \\mathbf{w}(t) \\sim \\mathcal{N}(\\mathbf{0}, \\Delta t\\, \\mathbf{I})$）。漂移与扩散的相互作用决定了前向轨迹沿线的边际分布 $\\{p_t(\\mathbf{x})\\}_{t \\in [0,T]}$。</p>`,

    sde_p3: `<p><b>反向SDE</b>（Anderson, 1982）通过从 $t = T$ 向 $t = 0$ 逆向运行实现采样：</p>
$$\\mathrm{d}\\mathbf{x} = [\\boldsymbol{f}(\\mathbf{x}, t) - g^2(t) \\nabla_{\\mathbf{x}} \\log p_t(\\mathbf{x})]\\,\\mathrm{d}t + g(t)\\,\\mathrm{d}\\bar{\\mathbf{w}},$$
<p>$\\bar{\\mathbf{w}}$ 为<b>反向维纳过程</b>，$\\mathrm{d}t$ 为<b>无穷小负时间步</b>（时间反向流动）。得分函数 $\\nabla_{\\mathbf{x}} \\log p_t(\\mathbf{x})$ 在此起关键作用：它修正前向漂移 $\\boldsymbol{f}(\\mathbf{x},t)$，使逆过程能够恢复数据分布。具体而言，$-g^2(t)\\nabla_{\\mathbf{x}} \\log p_t(\\mathbf{x})$ 项充当"航向修正"，引导逆向轨迹从噪声走向数据。一旦所有 $t \\in [0,T]$ 处的得分已知，即可从 $\\mathbf{x}(T) \\sim p_T$ 出发模拟反向SDE，生成 $p_0 \\approx p_{\\mathrm{data}}$ 的样本。</p>
<p>通过反向SDE进行随机采样的一大核心优势在于：相比VAE和GAN的确定性生成策略，它在<b>鲁棒性</b>、<b>语义一致性</b>和<b>感知质量</b>方面均表现更优。每步注入的随机噪声发挥校正功能，使轨迹得以弥补累积的得分估计误差并探索邻近概率质量。</p>
<p>将DSM目标推广到连续时间后，扩散模型统一为两种主要SDE形式：<b>方差爆炸 (VE)</b> 和 <b>方差保持 (VP)</b> SDE。连续时间极限将SMLD和DDPM纳入统一的数学框架：</p>
<ul>
<li><b>VE SDE</b>（SMLD）：$\\mathrm{d}\\mathbf{x} = \\sqrt{\\frac{\\mathrm{d}[\\sigma^2(t)]}{\\mathrm{d}t}}\\,\\mathrm{d}\\mathbf{w}$，具有<b>零漂移</b>（$\\boldsymbol{f}(\\mathbf{x},t) = \\mathbf{0}$）。当 $t \\to \\infty$ 时方差无界增长，故称"方差爆炸型"。</li>
<li><b>VP SDE</b>（DDPM）：$\\mathrm{d}\\mathbf{x} = -\\frac{1}{2}\\beta(t)\\mathbf{x}\\,\\mathrm{d}t + \\sqrt{\\beta(t)}\\,\\mathrm{d}\\mathbf{w}$，<b>线性收缩</b>项 $-\\frac{1}{2}\\beta(t)\\mathbf{x}$ 与噪声注入相平衡，使边际方差渐近有界于1，故称"方差保持型"。</li>
</ul>
<p>二者的核心区别在于：VE允许方差无界增长，VP则通过均值回归漂移保持方差有界。两种形式均具有<b>仿射漂移系数</b>的性质，保证扰动核 $p(\\mathbf{x}_t|\\mathbf{x}_0)$ 为高斯分布且有闭合形式——这一关键特性使得得分匹配的训练切实可行。</p>`,

    sde_ve_title: "",
    sde_ve_p1: "",

    sde_vp_title: "",
    sde_vp_p1: "",

    sde_deriv_ve_title: "推导：从SMLD到连续时间VE SDE",
    sde_deriv_ve_body: `<p>SMLD（Song &amp; Ermon, 2019）在 $N$ 个噪声级别 $\\{\\sigma_i\\}_{i=1}^N$ 上估计得分。离散前向马尔可夫链为：</p>
$$\\mathbf{x}_i = \\mathbf{x}_{i-1} + \\sqrt{\\sigma_i^2 - \\sigma_{i-1}^2}\\,\\boldsymbol{\\epsilon}, \\quad \\boldsymbol{\\epsilon} \\sim \\mathcal{N}(\\mathbf{0}, \\mathbf{I}).$$
<p><b>第一步（重参数化）：</b>令 $\\{\\sigma_i\\}_{i=1}^N$ 变为连续函数 $\\sigma(t)$（$t \\in [0,1]$），$\\mathbf{x}_i = \\mathbf{x}(i/N)$。</p>
<p><b>第二步（Taylor展开）：</b>增量为：</p>
$$\\mathbf{x}(t+\\Delta t) - \\mathbf{x}(t) = \\sqrt{\\sigma^2(t+\\Delta t) - \\sigma^2(t)}\\,\\boldsymbol{\\epsilon} \\approx \\sqrt{\\frac{\\mathrm{d}[\\sigma^2(t)]}{\\mathrm{d}t}\\Delta t}\\,\\boldsymbol{\\epsilon}.$$
<p><b>第三步（连续极限）：</b>当 $\\Delta t \\to 0$，得零漂移的VE前向SDE：</p>
$$\\mathrm{d}\\mathbf{x} = \\underbrace{\\sqrt{\\frac{\\mathrm{d}[\\sigma^2(t)]}{\\mathrm{d}t}}}_{g(t)}\\,\\mathrm{d}\\mathbf{w}, \\quad \\boldsymbol{f}(\\mathbf{x},t) = \\mathbf{0}.$$
<p><b>第四步（验证反向）：</b>定义 $\\alpha(t) = \\mathrm{d}[\\sigma^2(t)]/\\mathrm{d}t$，以 $\\Delta t = 1/N$ 离散化反向SDE：</p>
$$\\mathbf{x}_{i-1} = \\mathbf{x}_i + (\\sigma_i^2 - \\sigma_{i-1}^2)\\,\\boldsymbol{s}(\\mathbf{x}_i) + \\sqrt{\\sigma_i^2 - \\sigma_{i-1}^2}\\,\\boldsymbol{\\epsilon},$$
<p>与SMLD的祖先采样规则完全一致。由于 $\\sigma(t) \\to \\infty$（$t \\to \\infty$），方差无界增长，故名"方差爆炸型"。</p>`,

    sde_deriv_vp_title: "推导：从DDPM到连续时间VP SDE",
    sde_deriv_vp_body: `<p>DDPM（Ho et al., 2020）定义具有扰动核 $\\{p(\\mathbf{x}_i|\\mathbf{x}_0)\\}_{i=1}^N$ 的前向链：</p>
$$\\mathbf{x}_i = \\sqrt{1-\\beta_i}\\,\\mathbf{x}_{i-1} + \\sqrt{\\beta_i}\\,\\boldsymbol{\\epsilon}, \\quad \\boldsymbol{\\epsilon} \\sim \\mathcal{N}(\\mathbf{0}, \\mathbf{I}).$$
<p><b>第一步（重参数化）：</b>定义 $\\Delta t = 1/N$ 和辅助调度 $\\bar{\\beta}_i$，使得 $\\beta_i = \\bar{\\beta}_i \\Delta t = \\beta(t+\\Delta t)\\Delta t$。当 $N \\to \\infty$ 时，$\\bar{\\beta}_i \\to \\beta(t)$ 连续化。</p>
<p><b>第二步（Taylor展开）：</b>令 $\\mathbf{x}_i = \\mathbf{x}(t+\\Delta t)$，利用 $\\sqrt{1-\\beta(t)\\Delta t} \\approx 1 - \\frac{1}{2}\\beta(t)\\Delta t$：</p>
$$\\mathbf{x}(t+\\Delta t) - \\mathbf{x}(t) = -\\frac{1}{2}\\beta(t)\\,\\mathbf{x}(t)\\,\\Delta t + \\sqrt{\\beta(t)\\Delta t}\\,\\boldsymbol{\\epsilon}.$$
<p><b>第三步（连续极限）：</b>$\\Delta t \\to 0$ 时：</p>
$$\\mathrm{d}\\mathbf{x} = \\underbrace{-\\frac{1}{2}\\beta(t)\\,\\mathbf{x}}_{\\boldsymbol{f}(\\mathbf{x},t)}\\,\\mathrm{d}t + \\underbrace{\\sqrt{\\beta(t)}}_{g(t)}\\,\\mathrm{d}\\mathbf{w}.$$
<p><b>第四步（验证反向）：</b>以 $\\beta(t)\\Delta t = \\beta_i \\ll 1$ 离散化：</p>
$$\\mathbf{x}_{i-1} \\approx \\frac{1}{\\sqrt{1-\\beta_i}}\\left[\\mathbf{x}_i + \\frac{\\beta_i}{2}\\,\\boldsymbol{s}(\\mathbf{x}_i)\\right] + \\sqrt{\\beta_i}\\,\\boldsymbol{\\epsilon},$$
<p>与DDPM的祖先采样规则完全一致。线性收缩项 $-\\frac{1}{2}\\beta(t)\\mathbf{x}$ 抵消噪声注入，使边际方差保持有界为1，故名"方差保持型"。</p>`,

    viz2_title: "交互演示：前向扩散过程",
    viz_forward_caption: "此交互演示展示前向SDE如何逐步破坏数据结构。内嵌图表显示噪声调度：VP模式展示 $\\bar{\\alpha}(t) = e^{-5t^2}$（信号衰减），VE模式展示 $\\sigma(t) = t^2 \\cdot 3$（噪声增长）。SNR指示器（仅VP模式）以dB为单位追踪信噪比变化。底部直方图显示边际分布 $p_t(x_1)$——观察其从双峰分布向单峰高斯分布的转变过程（$t \\to 1$）。可使用自动播放或手动拖动滑块以自定节奏观察扩散过程。",

    code_ddpm_title: "Python：DDPM 训练循环（动手理解VP-SDE前向过程与噪声预测损失）",
    code_ddpm_body: `<p>实现VP-SDE前向过程和 $\\boldsymbol{\\epsilon}$-预测损失的最小DDPM训练步骤：</p>
<div class="code-block"><div class="code-header"><span class="code-lang">Python</span><span>PyTorch</span></div><pre><span class="keyword">import</span> torch
<span class="keyword">import</span> torch.nn.functional <span class="keyword">as</span> F

<span class="keyword">def</span> <span class="function">ddpm_train_step</span>(model, x_0, T=<span class="number">1000</span>, beta_min=<span class="number">1e-4</span>, beta_max=<span class="number">0.02</span>):
    <span class="string">"""Single DDPM training step (VP-SDE discretization).
    model: neural network predicting noise eps_theta(x_t, t)
    x_0:   clean data batch [B, C, H, W]
    """</span>
    <span class="comment"># Linear noise schedule</span>
    betas = torch.linspace(beta_min, beta_max, T, device=x_0.device)
    alphas = <span class="number">1.0</span> - betas
    alpha_bars = torch.cumprod(alphas, dim=<span class="number">0</span>)

    <span class="comment"># Sample random timestep for each example</span>
    t = torch.randint(<span class="number">0</span>, T, (x_0.shape[<span class="number">0</span>],), device=x_0.device)

    <span class="comment"># Forward process: q(x_t | x_0) = N(sqrt(alpha_bar_t) * x_0, (1-alpha_bar_t) * I)</span>
    alpha_bar_t = alpha_bars[t].view(-<span class="number">1</span>, <span class="number">1</span>, <span class="number">1</span>, <span class="number">1</span>)
    noise = torch.randn_like(x_0)
    x_t = alpha_bar_t.sqrt() * x_0 + (<span class="number">1</span> - alpha_bar_t).sqrt() * noise

    <span class="comment"># Predict noise and compute MSE loss</span>
    predicted_noise = model(x_t, t)
    loss = F.mse_loss(predicted_noise, noise)
    <span class="keyword">return</span> loss

<span class="comment"># Training loop</span>
<span class="keyword">for</span> epoch <span class="keyword">in</span> <span class="builtin">range</span>(num_epochs):
    <span class="keyword">for</span> x_0 <span class="keyword">in</span> dataloader:
        loss = <span class="function">ddpm_train_step</span>(model, x_0)
        optimizer.zero_grad(); loss.backward(); optimizer.step()</pre></div>`,

    // ===== 第五章：概率流ODE =====
    ode_title: "概率流ODE与求解器",
    ode_p1: `<p>对于每个基于得分的反向SDE，都存在一个共享相同边际密度 $\\{p_t(\\mathbf{x})\\}_{t\\in[0,T]}$ 的<b>概率流常微分方程（PF ODE）</b>：</p>
$$\\mathrm{d}\\mathbf{x} = \\left[ \\boldsymbol{f}(\\mathbf{x}, t) - \\frac{1}{2}g^2(t)\\,\\boldsymbol{s}(\\mathbf{x}, t) \\right] \\mathrm{d}t.$$
<p>这一<b>确定性</b>表述完全消除了随机噪声，使得可控采样、基于瞬时变量变换的精确似然计算以及高效数值ODE求解器的使用成为可能。三类常用求解器如下：</p>
<ul>
<li><b>Euler–Maruyama</b>（一阶）：$\\mathbf{x}_{i+1} = \\mathbf{x}_i + \\eta\\, \\boldsymbol{h}(\\mathbf{x}_i, t_i)$，局部截断误差 $\\mathcal{O}(\\eta^2)$。最简单的方案，但需要较小步长以保证精度。对PF ODE施加Euler方法即对应SMLD/DDPM中的<b>祖先采样</b>。</li>
<li><b>Runge–Kutta</b>（高阶）：经典RK-4方法每步四次中间斜率评估，可达局部误差 $\\mathcal{O}(\\eta^5)$：$\\mathbf{x}_{i+1} = \\mathbf{x}_i + \\frac{\\eta}{6}(\\mathbf{k}_1 + 2\\mathbf{k}_2 + 2\\mathbf{k}_3 + \\mathbf{k}_4)$。</li>
<li><b>预测–校正</b>：交替进行预测步骤（SDE积分）和校正步骤（基于得分的Langevin MCMC），在效率与质量间取得平衡。</li>
</ul>`,

    ode_p2: `<p>利用学习到的得分 $\\boldsymbol{s}_{\\boldsymbol{\\theta}}(\\mathbf{x}, t)$，PF ODE成为可数值求解的<b>神经ODE</b>。三类常用求解器：</p>
<ul>
<li><b>Euler-Maruyama</b>（一阶）：$x_{i+1} = x_i + \\eta\\, f(x_i, t_i)$，局部误差 $\\mathcal{O}(\\eta^2)$。简单但需小步长。</li>
<li><b>Runge-Kutta</b>（高阶）：RK-4 每步四次中间评估，局部误差 $\\mathcal{O}(\\eta^5)$。</li>
<li><b>预测-校正</b>：交替SDE预测与基于得分的MCMC校正，兼顾效率与质量。</li>
</ul>`,

    ode_deriv_title: "洞见：采样即数值求解",
    ode_deriv_body: `<p>一个统一性的洞见：<b>从扩散模型中采样，本质上是对微分方程的数值积分</b>——无论是随机反向SDE还是确定性PF ODE。每种采样器就是一种数值求解器，不同采样器对应不同的离散化方案，具有各自的精度-效率权衡。这一视角将采样问题从概率领域转化为已有深厚积累的数值分析问题。</p>
<p>由此可以立即理解为何DDPM需要约1000步：其祖先采样实现的是反向SDE的<b>一阶Euler</b>离散化，在长时间域$[0,T]$上必须使用小步长才能将截断误差$\\mathcal{O}(\\eta^2)$控制在可接受范围内。后续进展可被理解为将成熟的数值分析技术引入扩散采样：</p>
<ul>
<li><b>DDIM</b>（Song et al., 2021）：将DDPM采样重新解释为非马尔可夫过程，通过PF ODE实现确定性生成，可在50–100步内完成。</li>
<li><b>DPM-Solver</b>（Lu et al., 2022）：将高阶多步求解器和自适应步长应用于扩散ODE框架，最少仅需10–20步。</li>
</ul>
<p>减少采样步数会引入三类共同决定输出质量的误差：</p>
<ol>
<li><b>离散化误差</b>：源于有限步长。求解器仅近似连续轨迹，误差随步长增大而增长。高阶求解器可显著减小每步误差。</li>
<li><b>得分估计误差</b>：源于神经网络对真实得分的不完美近似。步数越少，评估之间的自我校正机会越少，误差越容易放大。</li>
<li><b>随机误差</b>：源于SDE每步注入的噪声（方差缩放为 $g(t)\\sqrt{\\Delta t}\\,\\boldsymbol{\\epsilon}$）。<b>ODE公式完全消除了这一误差源</b>，这正是ODE采样器能容忍更大步长的根本原因。</li>
</ol>
<p><b>关于随机性的常见误解：</b>人们常认为每步噪声是样本多样性的主要来源，但实际上多样性的根本来源是<b>随机初始样本</b> $\\mathbf{x}(T) \\sim p_T$——不同的起点在PF ODE下穿越不同的确定性轨迹。SDE中每步噪声起的是<i>校正</i>作用，帮助轨迹探索附近概率质量并弥补累积的得分估计误差，而非多样性的主因。</p>`,

    viz3_title: "交互演示：反向SDE vs 概率流ODE",
    viz_reverse_caption: "此并排对比展示两种反向时间采样器。<b>左侧——反向 SDE</b>：每一步都注入 $\\sqrt{\\beta(t)}\\,d\\bar{\\mathbf{w}}$ 随机噪声，导致轨迹锯齿明显，必须用许多小步才能数值稳定（此处 $100$ NFE）。<b>右侧——PF ODE</b>：高阶 ODE 求解器（如 DPM-Solver / DEIS）对确定性概率流 ODE 采用更大步长进行离散化，能以 <b>约 $4\\times$ 更少的函数评估</b> 抵达相同的边际分布 $p_t$（此处 $25$ NFE）——路径上的圆点即为各离散步骤的访问点。两个面板独立显示当前 $\\text{NFE}$ 使用量和归一化收敛条；ODE 面板提前收敛并停在 $t=0$，SDE 仍在继续。二者最终收敛到同一个 $p_{\\text{data}}$，但 ODE 路径更直、效率更高。",

    // ===== §3.2 条件扩散模型 =====
    cond_title: "条件扩散模型",
    cond_infer_title: "推理时条件化",
    cond_train_title: "训练时条件化",
    cond_p1: `<p><b>可控性</b>的核心问题：如何引导反向扩散过程，使生成样本符合目标条件 $\\mathbf{y}$？无条件扩散模型能从 $p_{\\mathrm{data}}(\\mathbf{x})$ 中生成高质量样本，但无法将输出导向特定的语义内容。而这恰恰是<b>语义通信</b>所需要的：接收端的重建必须以边信息（压缩特征、信道观测或文本描述）为条件，确保与发送端源信号的语义一致。</p>
<p>我们按条件 $\\mathbf{y}$ 进入扩散流水线的<b>注入时机</b>对条件机制进行分类：</p>
<ul>
<li><b>推理时条件化</b>：仅在反向采样中通过外部引导信号注入 $\\mathbf{y}$，完整保留预训练的无条件模型，实现对多样下游任务的<b>即插即用</b>适配。</li>
<li><b>训练时条件化</b>：将 $\\mathbf{y}$ 直接融入模型架构与训练目标，以任务特定的训练投入换取更紧密的集成与更精确的控制。</li>
</ul>`,

    cond_bayes_title: "贝叶斯分解",
    cond_bayes_p1: `<p>推理时条件化的数学基础源于<b>贝叶斯定理</b>。条件得分分解为：</p>
$$\\underbrace{\\nabla_{\\mathbf{x}} \\log p_t(\\mathbf{x}|\\mathbf{y})}_{\\text{条件得分}} = \\underbrace{\\nabla_{\\mathbf{x}} \\log p_t(\\mathbf{x})}_{\\text{无条件得分}} + \\underbrace{\\nabla_{\\mathbf{x}} \\log p_t(\\mathbf{y}|\\mathbf{x})}_{\\text{对数似然梯度}}.$$
<p>右端第一项为<b>无条件得分</b> $\\nabla_{\\mathbf{x}} \\log p_t(\\mathbf{x})$，直接由预训练扩散模型 $\\boldsymbol{s}_{\\boldsymbol{\\theta}}(\\mathbf{x},t)$ 提供。第二项为<b>对数似然梯度</b> $\\nabla_{\\mathbf{x}} \\log p_t(\\mathbf{y}|\\mathbf{x})$，如同一种"外力"，将生成轨迹引导向与条件 $\\mathbf{y}$ 相符的样本。记此<b>引导场</b>为 $\\boldsymbol{g}(\\mathbf{y}|\\mathbf{x},t) := \\nabla_{\\mathbf{x}} \\log p_t(\\mathbf{y}|\\mathbf{x})$，推理时条件化的标准方程为：</p>
$$\\boldsymbol{s}(\\mathbf{x}|\\mathbf{y},t) \\approx \\boldsymbol{s}_{\\boldsymbol{\\theta}}(\\mathbf{x},t) + \\gamma\\,\\boldsymbol{g}(\\mathbf{y}|\\mathbf{x},t),$$
<p>其中 $\\gamma \\geqslant 0$ 调控<b>引导强度</b>，平衡无条件样本质量与对条件的忠实度。此分解衍生出两种构建引导场的主要方法：</p>
<ul>
<li><b>分类器引导（CG）</b>：适用于可获得真实条件分布（如类别标签）的场景，在噪声数据上训练时间依赖的分类器提供引导梯度。</li>
<li><b>估计器引导</b>：适用于测量为部分或间接的场景（如逆问题），由前向测量模型结合Tweedie后验均值估计导出引导场。</li>
</ul>`,

    cond_cg_title: "分类器引导（CG）",
    cond_cg_p1: `<p>Dhariwal和Nichol在噪声损坏数据上训练时间依赖的分类器 $p_{\\boldsymbol{\\phi}}(\\mathbf{y}|\\mathbf{x},t)$，引导场为 $\\boldsymbol{g} = \\nabla_{\\mathbf{x}} \\log p_{\\boldsymbol{\\phi}}(\\mathbf{y}|\\mathbf{x},t)$：</p>
$$\\boldsymbol{s}(\\mathbf{x}|\\mathbf{y},t) = \\boldsymbol{s}_{\\boldsymbol{\\theta}}(\\mathbf{x},t) + \\gamma\\,\\nabla_{\\mathbf{x}} \\log p_{\\boldsymbol{\\phi}}(\\mathbf{y}|\\mathbf{x},t).$$
<p>在 $\\boldsymbol{\\epsilon}$ 参数化下（$\\boldsymbol{\\epsilon}_{\\boldsymbol{\\theta}}(\\mathbf{x},t) = -\\sqrt{1-\\bar{\\alpha}_t}\\,\\boldsymbol{s}_{\\boldsymbol{\\theta}}(\\mathbf{x},t)$）：</p>
$$\\boldsymbol{\\epsilon}_{\\boldsymbol{\\theta}}(\\mathbf{x}|\\mathbf{y},t) = \\boldsymbol{\\epsilon}_{\\boldsymbol{\\theta}}(\\mathbf{x},t) - \\sqrt{1-\\bar{\\alpha}_t}\\,\\gamma\\,\\nabla_{\\mathbf{x}} \\log p_{\\boldsymbol{\\phi}}(\\mathbf{y}|\\mathbf{x},t).$$
<p>CG通过放大条件信号重塑概率分布，使生成集中在目标模式。对于不同下游任务，只需预训练一个无条件扩散模型，推理时切换特定分类器即可。然而CG面临两个固有问题：<b>噪声对抗性</b>（分类器需适应扩散轨迹上的多级噪声）和<b>优化失败</b>（当$\\mathbf{y}$与$\\mathbf{x}$弱相关时，分类器梯度可能沿对抗方向偏移）。</p>`,

    cond_eg_title: "估计器引导",
    cond_dps_title: "扩散后验采样（DPS）",
    cond_eg_p1: `<p>在众多科学与工程问题中，我们获得的是源信号的部分测量值，而非源信号本身。这些场景自然建模为<b>逆问题</b>——从测量值$\\mathbf{y}$通过前向模型恢复未知源$\\mathbf{x}$：</p>
$$\\mathbf{y} = \\mathcal{A}(\\mathbf{x}_0) + \\mathbf{n},$$
<p>其中$\\mathbf{n} \\sim \\mathcal{N}(\\mathbf{0}, \\sigma_{\\mathbf{n}}^2\\mathbf{I})$为加性高斯噪声，$\\mathcal{A}(\\cdot): \\mathbb{R}^D \\to \\mathbb{R}^m$为编码退化过程的前向算子。该问题通常是病态的：多个源信号可能产生相同的测量值，缺乏先验知识便无法唯一恢复。</p>
<p>当扩散模型充当先验时，无条件得分$\\boldsymbol{s}_{\\boldsymbol{\\theta}}(\\mathbf{x},t)$已知。估计条件得分本质上归结为恢复对数似然梯度$\\nabla_{\\mathbf{x}} \\log p_t(\\mathbf{y}|\\mathbf{x})$。但该梯度无法直接获取：测量$\\mathbf{y}$显式依赖干净数据$\\mathbf{x}_0$，而反向采样在时间步$t$处仅有中间噪声状态$\\mathbf{x}_t$可用。</p>
<p>解决之道在于遵循<b>间接路径</b>$\\mathbf{x}_t \\to \\mathbf{x}_0 \\to \\mathbf{y}$：先用得分模型$\\boldsymbol{s}_{\\boldsymbol{\\theta}}$从$\\mathbf{x}_t$估计$\\mathbf{x}_0$，再利用$\\mathbf{x}_0$与$\\mathbf{y}$的显式依赖关系。Chung等人提出<b>扩散后验采样（DPS）</b>，借助<b>Tweedie公式</b>从$\\mathbf{x}_t$推断$\\mathbf{x}_0$，得到后验均值（去噪估计）：</p>
$$\\hat{\\mathbf{x}}_{0|t} = \\mathbb{E}[\\mathbf{x}_0|\\mathbf{x}_t] = \\frac{1}{\\alpha_t}\\left(\\mathbf{x}_t + \\sigma_t^2\\,\\boldsymbol{s}_{\\boldsymbol{\\theta}}(\\mathbf{x},t)\\right),$$
<p>其中$\\alpha_t = \\sqrt{\\bar{\\alpha}_t}$，$\\sigma_t = \\sqrt{1-\\bar{\\alpha}_t}$。该估计器根植于经验贝叶斯，为从噪声观测$\\mathbf{x}_t$中重建$\\mathbf{x}_0$提供了有原则的方法。</p>
<p>在此后验均值的基础上，DPS将不可解的条件项替换为去噪代理来近似对数似然梯度：$\\nabla_{\\mathbf{x}} \\log p_t(\\mathbf{y}|\\mathbf{x}) \\approx \\nabla_{\\mathbf{x}} \\log p_t(\\mathbf{y}|\\hat{\\mathbf{x}}_{0|t})$。<b>估计器引导的一般形式</b>为：</p>
$$\\boldsymbol{s}(\\mathbf{x}|\\mathbf{y},t) \\approx \\boldsymbol{s}_{\\boldsymbol{\\theta}}(\\mathbf{x},t) + \\gamma\\,\\nabla_{\\mathbf{x}} \\mathcal{R}(\\mathbf{y},\\, \\mathcal{A}(\\hat{\\mathbf{x}}_{0|t})),$$
<p>其中$\\mathcal{R}$在高斯噪声下通常取$\\|\\mathbf{y} - \\mathcal{A}(\\hat{\\mathbf{x}}_{0|t})\\|_2^2$，作为基于后验均值的测量一致性正则化项。</p>
<p>以上讨论假定前向算子$\\mathcal{A}$已知。但在许多实际场景中，退化模型不可获取或仅部分已知，由此产生<b>盲逆问题</b>——需同时推断数据$\\mathbf{x}$和算子参数$\\boldsymbol{\\vartheta}$。<b>BlindDPS</b>通过并行先验与联合估计器引导解决此问题：一个扩散先验$\\boldsymbol{s}_{\\boldsymbol{\\theta}}(\\mathbf{x},t)$针对数据，另一个$\\boldsymbol{s}_{\\boldsymbol{\\theta}}(\\boldsymbol{\\rho},t)$针对算子参数，在反向过程中同步更新：</p>
$$\\boldsymbol{s}(\\mathbf{x}, \\boldsymbol{\\rho}|\\mathbf{y},t) \\approx \\boldsymbol{s}_{\\boldsymbol{\\theta}}(\\mathbf{x},t) + \\gamma\\,\\nabla_{\\mathbf{x}} \\mathcal{R}(\\mathbf{y},\\, \\mathcal{A}_{\\hat{\\boldsymbol{\\vartheta}}}(\\hat{\\mathbf{x}}_{0|t})).$$
<p>BlindDPS的本质是通过测量一致性耦合两个扩散先验，在同一反向过程中同时完成数据去噪与未知算子估计。</p>
<p>相较于分类器引导，估计器引导直接从前向模型导出引导信号而非依赖单独训练的分类器，将采样轨迹绑定到测量值上，从而<b>避免了噪声对抗性和优化失败</b>问题。但估计器引导也有两大局限：(1) <b>计算开销较大</b>，需使用预训练扩散模型并在梯度采样中注入测量一致性，速度较慢且有时不稳定；(2) 当测量值<b>严重退化</b>时，引导信号变得不可靠，甚至可能将反向轨迹推离真实数据流形，产生分布外伪影。</p>`,

    cond_eg_p2: `<p>一个自然的疑问是：如果扩散先验的训练数据与目标信号域不完全匹配，估计器引导是否仍然有效？这一问题对<b>生成式语义通信</b>尤为重要——接收端的扩散先验可能是在通用语料上训练的，而非针对正在传输的特定内容。近期研究从经验和理论两个层面给出了肯定的答案：当测量信息足够充分时，这种"弱"扩散先验仍能实现良好的重建性能。其深层洞见基于<b>贝叶斯后验一致性</b>：高维测量能有效主导先验，使后验分布集中在真实信号附近，而不受先验保真度的限制。</p>`,

    cond_deriv_title: "Tweedie公式与后验均值",
    cond_deriv_body: `<p><b>Tweedie公式</b>（Efron, 2011）根植于经验贝叶斯，为从噪声观测 $\\mathbf{x}_t$ 重建 $\\mathbf{x}_0$ 提供了有原则的方法。对于VP扰动核 $p(\\mathbf{x}_t|\\mathbf{x}_0) = \\mathcal{N}(\\alpha_t\\mathbf{x}_0, \\sigma_t^2\\mathbf{I})$：</p>
$$\\hat{\\mathbf{x}}_{0|t} = \\mathbb{E}[\\mathbf{x}_0|\\mathbf{x}_t] = \\frac{1}{\\alpha_t}(\\mathbf{x}_t + \\sigma_t^2 \\nabla_{\\mathbf{x}_t} \\log p_t(\\mathbf{x}_t)).$$
<p>将真实得分替换为学习到的得分 $\\boldsymbol{s}_{\\boldsymbol{\\theta}}$ 即得实用估计量。</p>
<p><b>有效性条件：</b></p>
<ol>
<li><b>完美得分模型</b>：$\\boldsymbol{s}_{\\boldsymbol{\\theta}}(\\mathbf{x},t) = \\nabla_{\\mathbf{x}} \\log p_t(\\mathbf{x})$，得分估计误差为零（$\\varepsilon_{\\mathrm{score}} = 0$）。形式上，$\\varepsilon_{\\mathrm{score}} := \\mathbb{E}_{t \\sim \\mathcal{U}[0,1], \\mathbf{x} \\sim p_t} \\|\\nabla_{\\mathbf{x}} \\log p_t(\\mathbf{x}) - \\boldsymbol{s}_{\\boldsymbol{\\theta}}(\\mathbf{x},t)\\|_2^2$。</li>
<li><b>高斯扰动核</b>：$p(\\mathbf{x}_t|\\mathbf{x}_0)$ 保持已知高斯形式。</li>
</ol>
<p>在实际场景中两个条件均被违反：得分网络失配（$\\varepsilon_{\\mathrm{score}} > 0$）引入持续偏差，非高斯信道残差（如脉冲干扰）扭曲后验均值。为缓解误差累积，实用做法是将 $\\hat{\\mathbf{x}}_{0|t}$ 用作按 $\\gamma$ 缩放的<i>软</i>引导方向，而非在每步执行硬投影，从而防止逐步小偏差在数百次去噪迭代中复合放大。</p>`,

    cond_train_p1: `<p>推理时条件化通过调整预训练模型提供了灵活性，但其本质上依赖于可能与扩散过程不完全对齐的外部引导信号。另一条路线是：直接训练扩散模型内化条件信息。不通过贝叶斯定理分解条件得分，而是直接在无条件与条件得分之间插值：</p>
$$\\boldsymbol{s}(\\mathbf{x}|\\mathbf{y},t) \\approx (1-\\gamma)\\,\\boldsymbol{s}_{\\boldsymbol{\\theta}}(\\mathbf{x},t) + \\gamma\\,\\boldsymbol{s}_{\\boldsymbol{\\theta}}(\\mathbf{x}|\\mathbf{y},t),$$
<p>两个得分均由同一网络学习，$\\gamma \\geqslant 0$ 控制条件强度。此表述将任务负担从推理时引导转移到训练时学习。</p>`,

    cond_cfg_title: "无分类器引导（CFG）",
    cond_cfg_p1: `<p>CFG不依赖外部分类器，而在单一模型内部直接插值无条件与条件得分：</p>
$$\\boldsymbol{s}(\\mathbf{x}|\\mathbf{y},t) \\approx (1-\\gamma)\\,\\boldsymbol{s}_{\\boldsymbol{\\theta}}(\\mathbf{x},t) + \\gamma\\,\\boldsymbol{s}_{\\boldsymbol{\\theta}}(\\mathbf{x}|\\mathbf{y},t).$$
<p>训练时，模型以概率 $p$ 使用条件 $\\mathbf{y}$ 去噪，以概率 $1-p$ 使用空标记 $\\varnothing$ 去噪。在 $\\boldsymbol{\\epsilon}$ 参数化下：</p>
$$\\boldsymbol{\\epsilon}_{\\boldsymbol{\\theta}}(\\mathbf{x}|\\mathbf{y},t) = (1-\\gamma)\\,\\boldsymbol{\\epsilon}_{\\boldsymbol{\\theta}}(\\mathbf{x}|\\varnothing,t) + \\gamma\\,\\boldsymbol{\\epsilon}_{\\boldsymbol{\\theta}}(\\mathbf{x}|\\mathbf{y},t).$$
<p>$\\gamma=0$为纯无条件生成；$\\gamma=1$为标准条件生成；$\\gamma>1$为增强条件（以多样性换取质量提升）。CFG避免了CG的噪声对抗和优化失败问题，代价是每步需运行两次模型。</p>
<p>CFG的优雅之处在于统一的训练方案：模型自然地适应条件与无条件生成在不同噪声水平下的行为，回避了CG的噪声对抗性；条件信息在训练中直接影响去噪预测，梯度方向天然对齐生成目标，规避了优化失败。但CFG也有自身权衡：随$\\gamma$增大，样本多样性通常下降，可能引发模式坍缩；推理时需运行两次模型（有条件和无条件各一次），计算成本翻倍；最优$\\gamma$因条件和数据集而异，需仔细调优。</p>`,

    viz4_title: "交互演示：无分类器引导强度",
    viz_guidance_caption: "此交互演示展示无分类器引导（CFG）实现的贝叶斯后验调控。蓝色虚线椭圆为先验 $p(\\mathbf{x})$；红色虚线标记条件信号 $\\mathbf{y}$；紫色实线椭圆为高斯共轭模型下的后验 $p(\\mathbf{x}\\mid\\mathbf{y}) \\propto p(\\mathbf{y}\\mid\\mathbf{x})\\,p(\\mathbf{x})$（后验均值 $\\mu_+\\!=\\!\\mu+(\\mathbf{y}-\\mu)\\,\\gamma/(\\gamma+1)$，方差按 $1/(1+\\gamma)$ 收缩）。随 $\\gamma$ 增大，样本由蓝色（先验主导）逐渐转为紫红色（信号主导）。推理时，CFG 通过对噪声预测进行外插实现该后验：$\\tilde{\\boldsymbol{\\epsilon}}=(1+\\gamma)\\boldsymbol{\\epsilon}_{\\boldsymbol{\\theta}}(\\mathbf{x},\\mathbf{y})-\\gamma\\,\\boldsymbol{\\epsilon}_{\\boldsymbol{\\theta}}(\\mathbf{x})$；$\\gamma\\!=\\!0$ 为无条件采样，$\\gamma$ 较大时样本坍缩至 $\\mathbf{y}$ 附近，多样性下降。",

    // ===== 第七章：一致性模型 =====
    cm_title: "一致性模型",
    cm_p1: `<p>一致性模型在扩散采样轨迹上强制<b>自一致性</b>，从而实现单步生成。对于 $\\boldsymbol{f}(\\mathbf{x},t) = \\mathbf{0}$、$g(t) = \\sqrt{2t}$ 的PF ODE：</p>
$$\\frac{\\mathrm{d}\\mathbf{x}_t}{\\mathrm{d}t} = -t\\,\\boldsymbol{s}_{\\boldsymbol{\\theta}}(\\mathbf{x},t),$$
<p>从 $\\mathbf{x}_T \\sim \\mathcal{N}(\\mathbf{0}, T^2\\mathbf{I})$ 出发，逆向求解至 $\\mathbf{x}_0$。</p>`,

    cm_p2: `<p><b>一致性函数</b> $\\boldsymbol{c}:(\\mathbf{x},t) \\to \\mathbf{x}_\\xi$ 将ODE轨迹上任意一点映射到其端点 $\\mathbf{x}_\\xi$，强制<b>自一致性</b>：同一轨迹上的所有点满足 $\\boldsymbol{c}(\\mathbf{x},s) = \\boldsymbol{c}(\\mathbf{x},t)$。模型参数化为：</p>
$$\\boldsymbol{c}_{\\boldsymbol{\\theta}}(\\mathbf{x},t) = \\boldsymbol{c}_{\\mathrm{skip}}(t)\\,\\mathbf{x} + \\boldsymbol{c}_{\\mathrm{out}}(t)\\,F_{\\boldsymbol{\\theta}}(\\mathbf{x},t),$$
<p>边界条件 $\\boldsymbol{c}_{\\mathrm{skip}}(\\xi) = 1$、$\\boldsymbol{c}_{\\mathrm{out}}(\\xi) = 0$ 保证在数据端点处 $\\boldsymbol{c}_{\\boldsymbol{\\theta}}(\\mathbf{x},\\xi) = \\mathbf{x}$。训练最小化：</p>
$$\\mathcal{L}(\\boldsymbol{\\theta}) = \\mathbb{E}_{t \\sim \\mathcal{U}[0,1], \\, s \\sim \\mathcal{U}[0,t), \\, \\mathbf{x} \\sim p_{t}(\\mathbf{x})} \\left\\| \\boldsymbol{c}_{\\boldsymbol{\\theta}}(\\mathbf{x}, s) - \\boldsymbol{c}_{\\boldsymbol{\\theta}}(\\mathbf{x}, t) \\right\\|_2^2.$$`,

    cm_p3: `<p>从数值分析视角看，一致性模型学习的是从任意中间状态到轨迹端点的<b>直接映射</b>——类似于学习解析解而非逐步数值积分。这完全绕过了迭代过程，实现了<b>单步生成</b>。扩展方法如<b>隐空间一致性模型（LCM）</b>将一致性训练应用于VAE编码的表征空间，以实现高效的高分辨率生成。</p>`,

    cm_deriv_title: "为什么模型不会坍缩为常数？",
    cm_deriv_body: `<p>仅最小化自一致性损失会产生平凡解：网络将所有输入映射到同一常数。<b>边界条件</b> $\\boldsymbol{c}_{\\boldsymbol{\\theta}}(\\mathbf{x},\\xi) = \\mathbf{x}_\\xi \\approx \\mathbf{x}_0$ 阻止了这种坍缩——在时间 $\\xi$（靠近数据端点）处，模型必须忠实地复现输入。结合教师引导或梯度停止技术，迫使模型学习真正的轨迹-端点映射。随着训练推进，网络内化了一个与时间无关的映射：给定ODE轨迹上任意一点的噪声样本，直接恢复对应的干净数据。</p>`,

    // ===== 第八章：流匹配 =====
    fm_title: "流匹配",
    fm_p1: `<p>流匹配将生成建模重新表述为学习一个<b>速度场</b> $\\boldsymbol{v}(\\mathbf{x}, t)$，将样本从简单先验 $p_0(\\mathbf{x}) = \\mathcal{N}(\\mathbf{0}, \\mathbf{I})$（$t=0$）运输到数据分布 $p_1(\\mathbf{x}) = p_{\\mathrm{data}}(\\mathbf{x})$（$t=1$）。每个点沿ODE运动：</p>
$$\\frac{\\mathrm{d}\\mathbf{x}}{\\mathrm{d}t} = \\boldsymbol{v}(\\mathbf{x}, t),$$
<p>定义流映射 $\\boldsymbol{\\psi}(\\mathbf{x}, t): \\mathbb{R}^D \\times [0,1] \\to \\mathbb{R}^D$，将初始位置映射到时间 $t$ 处的位置。</p>`,

    fm_p2: `<p>不同于基于得分的扩散先破坏数据再学习逆过程，流匹配<b>直接</b>沿连接噪声与数据的<b>直线路径</b>参数化速度场。利用前向插值 $\\mathbf{x}_t = (1-t)\\mathbf{x}_0 + t\\mathbf{x}_1$，通过最小化以下目标学习速度：</p>
$$\\mathcal{L}(\\boldsymbol{\\theta}) = \\mathbb{E}_{t \\sim \\mathcal{U}[0,1],\\, \\mathbf{x} \\sim p_t(\\mathbf{x})} \\left[\\left\\|\\boldsymbol{v}(\\mathbf{x},t) - \\boldsymbol{v}_{\\boldsymbol{\\theta}}(\\mathbf{x},t)\\right\\|_2^2\\right],$$
<p>其中 $\\boldsymbol{v}(\\mathbf{x},t) = (\\mathbf{x}_1 - \\mathbf{x}_0)$ 为沿直线路径的真实速度。</p>`,

    fm_p3: `<p><b>相较于基于得分的扩散的关键优势：</b></p>
<ol>
<li><b>有界目标</b>：速度向量有界，不像得分函数可能无界，训练更稳定。</li>
<li><b>更直的路径</b>：直线轨迹产生更光滑的速度场，更易被神经网络拟合。</li>
<li><b>更少的步数</b>：确定性ODE所需函数评估次数大幅减少（比传统扩散少 $10$–$20$ 倍）。</li>
</ol>`,

    fm_deriv_title: "统一视角：得分、速度与一致性",
    fm_deriv_body: `<p>尽管表述各异，基于得分的扩散、流匹配和一致性模型共享同一个核心抽象：构建从先验到数据的<b>概率路径</b> $\\{p_t(\\mathbf{x})\\}_{t\\in[0,1]}$。区别在于网络学习的<i>对象</i>不同：</p>
<ul>
<li><b>基于得分的扩散</b>：学习<b>得分函数</b> $\\nabla_{\\mathbf{x}} \\log p_t(\\mathbf{x})$，用于逆转加噪SDE。</li>
<li><b>流匹配</b>：学习沿直线运输路径的<b>速度场</b> $\\boldsymbol{v}_{\\boldsymbol{\\theta}}(\\mathbf{x},t)$。</li>
<li><b>一致性模型</b>：学习<b>端点映射</b> $\\boldsymbol{c}_{\\boldsymbol{\\theta}}$，即PF ODE的解析解。</li>
</ul>
<p>这一分类法沿三个设计轴组织扩散模型：概率路径的<b>几何形状</b>（弯曲 vs. 直线）、<b>动力学</b>（随机SDE vs. 确定性ODE）、以及<b>学习目标</b>（得分 $\\boldsymbol{s}_{\\boldsymbol{\\theta}}$ vs. 速度 $\\boldsymbol{v}_{\\boldsymbol{\\theta}}$ vs. 端点 $\\boldsymbol{c}_{\\boldsymbol{\\theta}}$）。</p>`,

    viz5_title: "交互演示：流匹配 vs 基于得分的扩散",
    viz_flow_caption: "此并排对比凸显流匹配的传输效率优势。<b>左侧——基于得分的扩散</b>：在 Euler–Maruyama 离散化下，从噪声 $\\pi_0$ 到数据 $\\pi_1$ 的轨迹弯曲且伴有随机抖动，需要大量小步（此处 $100$ NFE）才能数值稳定。<b>右侧——流匹配</b>：学习到的直线条件路径 $\\psi_t(\\mathbf{x})=(1-t)\\mathbf{x}_0+t\\mathbf{x}_1$ 几乎是仿射的，因此前向 Euler 只需极少几步大步即可（此处 $10$ NFE，约 $10\\times$ 少于扩散）；路径上的圆点即为每个离散步的访问位置，直观体现“少步生成”的特性。两个面板独立显示当前 $\\text{NFE}$ 用量和累积传输代价——流匹配路径明显更短，对应更小的离散化误差与更低的实际墙钟成本，且抵达相同的终点分布。",

    code_fm_title: "Python：流匹配训练（动手理解沿直线路径的速度场回归）",
    code_fm_body: `<p>条件流匹配沿直线路径训练速度网络。损失函数的简洁性是相较于基于得分方法的一大优势：</p>
<div class="code-block"><div class="code-header"><span class="code-lang">Python</span><span>PyTorch</span></div><pre><span class="keyword">import</span> torch
<span class="keyword">import</span> torch.nn.functional <span class="keyword">as</span> F

<span class="keyword">def</span> <span class="function">flow_matching_step</span>(velocity_net, x_1):
    <span class="string">"""Single flow matching training step.
    velocity_net: neural network v_theta(x_t, t)
    x_1:         target data batch (from p_data)
    """</span>
    <span class="comment"># Sample from prior p_0 = N(0, I)</span>
    x_0 = torch.randn_like(x_1)

    <span class="comment"># Sample timestep uniformly</span>
    t = torch.rand(x_1.shape[<span class="number">0</span>], <span class="number">1</span>, <span class="number">1</span>, <span class="number">1</span>, device=x_1.device)

    <span class="comment"># Straight-line interpolation: x_t = (1-t)*x_0 + t*x_1</span>
    x_t = (<span class="number">1</span> - t) * x_0 + t * x_1

    <span class="comment"># True velocity along straight path: v = x_1 - x_0</span>
    v_target = x_1 - x_0

    <span class="comment"># Predict velocity and compute loss</span>
    v_pred = velocity_net(x_t, t.squeeze())
    loss = F.mse_loss(v_pred, v_target)
    <span class="keyword">return</span> loss

<span class="keyword">def</span> <span class="function">flow_matching_sample</span>(velocity_net, n_samples, dim, n_steps=<span class="number">100</span>):
    <span class="string">"""Generate samples by integrating the learned velocity ODE."""</span>
    x = torch.randn(n_samples, dim)  <span class="comment"># Start from noise</span>
    dt = <span class="number">1.0</span> / n_steps
    <span class="keyword">for</span> i <span class="keyword">in</span> <span class="builtin">range</span>(n_steps):
        t = torch.full((n_samples,), i * dt)
        x = x + velocity_net(x, t) * dt  <span class="comment"># Euler integration</span>
    <span class="keyword">return</span> x</pre></div>`,

    // ===== 第九章：薛定谔桥 =====
    sb_title: "薛定谔桥",
    sb_p1: `<p>标准扩散模型和流匹配都是从<b>固定高斯先验</b>向数据分布运输。但如果需要在两个<b>任意分布</b>之间运输呢？这正是薛定谔桥问题的设定——寻找连接两个给定边界分布的最优随机过程。</p>`,

    sb_p2: `<p>优化目标是找到满足边界条件 $P_0 = p_0$、$P_1 = p_1$ 的路径测度 $P$，同时最小化：</p>
$$\\min_{P:\\, P_0 = p_0,\\, P_1 = p_1} \\mathbb{E}_P\\left[\\int_0^1 \\frac{1}{2}\\|\\boldsymbol{f}(\\mathbf{x},t)\\|_2^2\\,\\mathrm{d}t\\right] + D_{\\mathrm{KL}}(P \\parallel Q),$$
<p>其中 $\\boldsymbol{f}(\\cdot,t)$ 为引导运输的漂移，$Q$ 为参考布朗运动。KL散度鼓励解接近自然扩散过程。<b>扩散薛定谔桥（DSB）</b>通过迭代比例拟合（IPF）算法学习桥接，交替拟合前向和反向漂移网络。</p>`,

    sb_p3: `<p>当源分布为高斯时，薛定谔桥退化为具有优化噪声调度的扩散模型。当两端均为数据分布时，它可实现<b>无配对域迁移</b>等超出常规扩散能力的任务。<b>图像到图像薛定谔桥（I2SB）</b>框架利用配对样本将桥学习简化为兼容标准DDPM训练的条件去噪目标，无需迭代的前向-反向拟合过程。</p>`,

    // ===== §3.3 高效扩散方法 =====
    eff_title: "高效扩散方法",
    eff_p1: `<p>扩散模型虽能生成高质量内容，但迭代采样（数百至数千次神经网络评估）带来了显著的计算挑战。对于U-Net骨干网络，总推理开销为 $\\mathcal{O}(T C^2 HW)$，$T$ 为函数评估次数，$C$ 为通道维度，$H \\times W$ 为空间分辨率。五种主要加速策略分别针对不同的开销因子：</p>`,

    eff_table: `<table class="content-table">
<thead><tr><th>策略</th><th>核心思想</th><th>削减目标</th></tr></thead>
<tbody>
<tr><td><b>降维</b></td><td>在压缩隐空间而非高维数据空间中执行扩散</td><td>空间复杂度 $HW$</td></tr>
<tr><td><b>知识蒸馏</b></td><td>训练轻量学生模型以更少步数或更低复杂度复现教师行为</td><td>采样步数 $T$</td></tr>
<tr><td><b>结构剪枝</b></td><td>在保持生成能力的前提下移除冗余组件</td><td>通道维度 $C$、模型参数量与计算量</td></tr>
<tr><td><b>缓存复用</b></td><td>跨采样步骤复用中间特征，减少重复计算</td><td>每步冗余计算</td></tr>
<tr><td><b>流匹配</b></td><td>学习最优传输路径以实现确定性高效生成</td><td>函数评估次数 (NFEs)</td></tr>
</tbody></table>`,

    eff_dr_title: "降维",
    eff_dr_p1: `<p><b>隐空间扩散模型（LDMs）</b>以Stable Diffusion为代表，在压缩的VAE隐空间中执行完整扩散过程。例如，将$(512, 512, 3)$图像编码为$(64, 64, 4)$隐表征，实现$64\\times$空间压缩，大幅降低每步成本。早期模型如DDPM在像素空间操作，分辨率提升意味着开销急剧增长。LDM将计算成本与输出分辨率解耦。</p>
<p><b>基于小波的方法</b>利用频域稀疏性将信号分解为频率分量。采样时模型选择性更新重要的小波系数，跳过低优先级分量，将计算资源集中于感知显著的频率。</p>`,

    eff_kd_title: "知识蒸馏",
    eff_kd_p1: `<p>蒸馏通过训练学生模型在更少评估次数中复现多步教师的输出来削减采样步数 $T$。<b>渐进蒸馏</b>迭代地将步数减半。更激进的方案是<b>一致性模型</b>——学习从ODE轨迹上任意一点到端点的直接映射，实现单步生成：</p>`,

    eff_sp_title: "结构剪枝",
    eff_sp_p1: `<p><b>通道剪枝</b>根据对生成质量的贡献，移除卷积层的整个通道。<b>SnapFusion</b>对VAE解码器施加50%均匀通道剪枝（MACs降至约$1/4$），并通过架构进化评估U-Net各模块对CLIP分数退化与延迟改善的影响，从而在移动设备上实现两秒以内的文本到图像生成。</p>
<p><b>时间步剪枝</b>选择性跳过对质量贡献极小的扩散步骤。自适应计算方法如<b>AdaDiff</b>利用时间步感知的不确定性估计实现早期退出，动态分配每步资源。跳步训练引入辅助损失项，补偿加速采样中损失的信息。</p>`,

    eff_cr_title: "缓存复用",
    eff_cr_p1: `<p><b>DeepCache</b>分析U-Net架构，识别出跨步骤保持时间稳定的高层特征并对其缓存复用，而快速变化的底层特征则实时重算。这种选择性计算在保持质量的同时大幅降低开销。</p>
<p><b>Learning-to-Cache (L2C)</b> 训练一个随时间步变化的路由器，在每一步动态决定哪些Transformer层需要实际计算、哪些可复用缓存。在扩散早期（粗结构阶段），更多层可复用缓存特征；在后期细化阶段，更多主动计算以保留精细细节。最终得到一个无运行时开销的静态计算图。</p>`,

    eff_fm_title: "流匹配",
    eff_fm_p1: `<p>基于得分的扩散模型虽然成果卓越，但需在所有时间步学习得分函数，计算代价较高。<b>流匹配</b>作为替代范式，通过沿直线传输路径学习<b>速度场</b>（而非沿弯曲SDE轨迹学习得分函数）来构建高效扩散模型。</p>
<p>直线路径 $\\mathbf{x}_t = (1-t)\\mathbf{x}_0 + t\\mathbf{x}_1$ 产生更光滑的速度场，从根本上更易被神经网络拟合，使生成步数大幅减少（比传统扩散少 $10$–$20$ 倍NFE）。<b>Rectified Flow</b> 通过迭代"reflow"过程逐步拉直传输路径；<b>MeanFlow</b> 直接预测均值速度，将采样压缩到单步。流匹配通过连续表述天然支持少步生成，以显著降低的计算开销达到同等质量。</p>`,

    // ===== §3.4 泛化扩散模型 =====
    gen_title: "泛化扩散模型",
    gen_p1: `<p>扩散模型具有内在的灵活性，可跨多样化的模态、领域和任务进行推广。三个基本的泛化维度：</p>`,

    gen_modality_title: "模态扩展",
    gen_modality_p1: `<p>扩散模型擅长处理连续数据（如图像），但对离散数据（如文本）则面临挑战。混合架构应运而生。<b>Transfusion</b>使用共享Transformer骨干同时训练离散语言token和连续图像patch，将文本的自回归交叉熵损失与图像的去噪损失相结合。<b>Diffusion Forcing</b>引入一种训练范式，为序列中每个token设置独立的噪声水平进行去噪，兼具下一token预测的灵活性与全序列扩散的引导能力，实现平滑的长时域生成。<b>Show-o</b>在单一Transformer内采用模态专属策略：文本token以因果注意力自回归处理，图像token以全注意力进行离散去噪扩散，二者通过全注意力机制统一。</p>
<p>高保真跨模态生成取决于条件信号的质量。<b>DALL-E 3</b>证实，通过专用图像描述器丰富训练标注，能显著缩小用户意图与视觉输出之间的语义鸿沟。</p>`,

    gen_domain_title: "域适应",
    gen_domain_p1: `<p>扩散模型可通过多种途径弥合领域差距。<b>DreamBooth</b>使用专属标识符（如<i>"一张[V]狗的照片"</i>）在少量目标集上微调，以先验保留损失平衡目标适配与防止过拟合，实现少样本适应。<b>Composable Diffusion</b>在推理时线性组合来自不同领域模型的得分函数，实现零样本泛化，生成同时满足多个约束的图像。更具原则性的域迁移方法来自薛定谔桥。<b>I2SB</b>框架解析地边际化边界条件，将桥学习化为兼容标准DDPM训练的条件去噪目标，提供了配对图像到图像翻译的可行方案。</p>`,

    gen_task_title: "任务泛化",
    gen_policy_title: "",
    gen_policy_p1: `<p><b>Diffuser（基于扩散的规划）</b>展示了基于模型的强化学习范式：通过扩散模型生成完整轨迹。不同于分别学习动力学和策略模型，它联合学习轨迹分布$\\boldsymbol{\\tau} = (\\mathbf{s}_0, \\mathbf{a}_0, \\mathbf{s}_1, \\mathbf{a}_1, \\ldots, \\mathbf{s}_T)$，同时捕捉环境动力学与策略。通过反向扩散中的引导机制，优先采样高回报轨迹。</p>
<p><b>Diffusion Policy</b>将动作选择重新概念化为条件生成：从$\\mathbf{a}_T \\sim \\mathcal{N}(\\mathbf{0}, \\mathbf{I})$去噪到干净动作$\\mathbf{a}_0$：</p>
$$p_{\\boldsymbol{\\theta}}(\\mathbf{a}_{t-1}|\\mathbf{a}_t, \\mathbf{s}) = \\mathcal{N}(\\mathbf{a}_{t-1};\\, \\boldsymbol{\\mu}_{\\boldsymbol{\\theta}}(\\mathbf{a}_t, t, \\mathbf{s}),\\, \\sigma_t^2\\mathbf{I}),$$
<p>$\\mathbf{s}$为状态观测。这天然适配多模态动作分布，对具有多个有效解的任务至关重要。迭代细化提供了隐式规划：早期步骤捕捉高层策略，后期步骤打磨执行细节。</p>`,

    gen_policy_p2: `<p><b>DDPO（去噪扩散策略优化）</b>将迭代去噪过程转化为多步MDP：每个去噪转移视为策略动作，标量回报$r(\\mathbf{x}_0, \\mathbf{y})$仅分配给最终样本。目标最大化：</p>
$$\\mathcal{J}(\\boldsymbol{\\theta}) = \\mathbb{E}_{\\mathbf{y},\\, \\mathbf{x}_{0:T} \\sim p_{\\boldsymbol{\\theta}}} \\left[ r(\\mathbf{x}_0, \\mathbf{y}) \\right].$$
<p>策略梯度在去噪步骤间分解：</p>
$$\\nabla_{\\boldsymbol{\\theta}} \\mathcal{J}(\\boldsymbol{\\theta}) = \\mathbb{E} \\left[ r(\\mathbf{x}_0, \\mathbf{y}) \\sum_{t=1}^{T} \\nabla_{\\boldsymbol{\\theta}} \\log p_{\\boldsymbol{\\theta}}(\\mathbf{x}_{t-1}|\\mathbf{x}_t, \\mathbf{y}) \\right],$$
<p>$\\nabla_{\\boldsymbol{\\theta}} \\log p_{\\boldsymbol{\\theta}}$为<b>Fisher得分</b>（对<i>模型参数</i>的梯度，区别于对<i>随机变量</i>求导的Stein得分）。这使得可利用人类反馈微调扩散模型，优化美学质量、安全性与提示-图像对齐。</p>
<p><b>C-LoRA</b>通过持续自正则化的低秩适应应对灾难性遗忘。学习新概念时，累积的历史LoRA权重增量对新更新施加惩罚，在不重放历史数据的前提下平衡可塑性与稳定性。<b>Diffusion-ES</b>将基于扩散的轨迹生成与无梯度进化搜索相结合——对高分轨迹施加截断扩散过程（前向加噪后反向去噪）作为结构保持的变异算子，用于黑盒优化。</p>`,

    // ===== 图片占位 =====
    fig_disgen_placeholder: "图片：判别式建模 vs. 生成式建模 — 将替换为SVG",
    fig_disgen_caption: "机器学习中判别式建模与生成式建模的比较。判别式模型直接学习从输入到输出的映射；生成式模型学习底层数据分布以实现合成。",
    fig_score_placeholder: "图片：基于得分的建模流程 — 将替换为SVG",
    fig_score_caption: "扩散模型的基于得分的建模流程。(a) 得分匹配：模型通过去噪得分匹配学习近似数据分布的得分（对数密度梯度）。(b) 随机采样：朗之万动力学沿学习到的得分函数并加入随机扰动生成样本。",
    fig_sde_placeholder: "图片：前向-反向SDE流程 — 将替换为SVG",
    fig_sde_caption: "基于得分的扩散模型前向-反向SDE流程。前向SDE逐步将输入破坏为高斯噪声；反向SDE在学习到的得分引导下迭代去噪，组合去噪核以产生输出。",
    fig_pc_placeholder: "图片：预测-校正方法求解PF ODE — 将替换为SVG",
    fig_pc_caption: "以预测-校正方法求解概率流ODE。预测提供粗略估计，校正执行基于得分的精细化。",
    fig_inference_placeholder: "图片：推理时条件扩散模型 — 将替换为SVG",
    fig_inference_caption: "推理时条件生成：条件得分分解为无条件得分加引导场，实现无需重训的即插即用适配。",
    fig_training_placeholder: "图片：训练时条件扩散模型 — 将替换为SVG",
    fig_training_caption: "训练时条件生成：模型联合学习条件与无条件得分，采样时通过引导强度γ插值。",
    fig_flow_placeholder: "图片：流匹配机制 — 将替换为SVG",
    fig_flow_caption: "流匹配的底层机制。先验分布的样本沿直线条件路径传输到目标数据点。概率路径、速度场和流构成三角关系。",

    // ===== 参考文献 =====
    ref_title: "参考文献",
    ref_content: `<ul>
<li>Sohl-Dickstein et al., "Deep Unsupervised Learning using Nonequilibrium Thermodynamics," ICML 2015.</li>
<li>Ho et al., "Denoising Diffusion Probabilistic Models (DDPM)," NeurIPS 2020.</li>
<li>Song &amp; Ermon, "Generative Modeling by Estimating Gradients of the Data Distribution," NeurIPS 2019.</li>
<li>Song et al., "Score-Based Generative Modeling through Stochastic Differential Equations," ICLR 2021.</li>
<li>Song et al., "Denoising Diffusion Implicit Models (DDIM)," ICLR 2021.</li>
<li>Dhariwal &amp; Nichol, "Diffusion Models Beat GANs on Image Synthesis," NeurIPS 2021.</li>
<li>Ho &amp; Salimans, "Classifier-Free Diffusion Guidance," NeurIPS Workshop 2021.</li>
<li>De Bortoli et al., "Diffusion Schr&ouml;dinger Bridge with Applications to Score-Based Generative Modeling," NeurIPS 2021.</li>
<li>Rombach et al., "High-Resolution Image Synthesis with Latent Diffusion Models (LDM)," CVPR 2022.</li>
<li>Janner et al., "Planning with Diffusion for Flexible Behavior Synthesis (Diffuser)," ICML 2022.</li>
<li>Calvin Luo, "Understanding Diffusion Models: A Unified Perspective," arXiv 2022.</li>
<li>Chung et al., "Diffusion Posterior Sampling for General Noisy Inverse Problems," ICLR 2023.</li>
<li>Song et al., "Consistency Models," ICML 2023.</li>
<li>Lipman et al., "Flow Matching for Generative Modeling," ICLR 2023.</li>
<li>Liu et al., "Flow Straight and Fast: Learning to Generate and Transfer Data with Rectified Flow," ICLR 2023.</li>
<li>Liu et al., "I2SB: Image-to-Image Schr&ouml;dinger Bridge," ICML 2023.</li>
<li>Chi et al., "Diffusion Policy: Visuomotor Policy Learning via Action Diffusion," RSS 2023.</li>
<li>Tong et al., "Improving and Generalizing Flow-Based Generative Models with Minibatch Optimal Transport," TMLR 2024.</li>
<li>Black et al., "Training Diffusion Models with Reinforcement Learning (DDPO)," ICLR 2024.</li>
<li>Stanley Chan, "Tutorial on Diffusion Models for Imaging and Vision," arXiv 2024.</li>
<li>Yang Song 博客: <a href="https://yang-song.net/blog/2021/score/" target="_blank">Generative Modeling by Estimating Gradients of the Data Distribution</a></li>
<li>Lilian Weng 博客: <a href="https://lilianweng.github.io/posts/2021-07-11-diffusion-models/" target="_blank">What are Diffusion Models?</a></li>
<li>Cambridge MLG 博客: <a href="https://mlg.eng.cam.ac.uk/blog/2024/01/20/flow-matching.html" target="_blank">An Introduction to Flow Matching</a></li>
</ul>`,

    // ===== 图片 =====
    fig_score_pipeline_placeholder: "图示：基于得分的建模流程（论文图2占位）",
    fig_sde_pipeline_placeholder: "图示：前向-反向SDE流程（论文图3占位）",
    fig_pc_placeholder: "图示：预测-校正方法（论文图4占位）",
    fig_flow_placeholder: "图示：流匹配机制（论文图5占位）",

    // ===== 弹窗与页脚 =====
    bib_title: "BibTeX 引用",
    bib_copy: "复制到剪贴板",
    bib_copied: "已复制!",
    footer_text: "&copy; 2026 秦海龙 版权所有 | 最后更新：2026年8月"
}
};