// ===== DiffComm Tutorial — Interactive Visualizations =====
// 5 HTML5 Canvas visualizations with polished aesthetics.

// roundRect polyfill for older browsers
if (typeof CanvasRenderingContext2D !== 'undefined' && !CanvasRenderingContext2D.prototype.roundRect) {
    CanvasRenderingContext2D.prototype.roundRect = function (x, y, w, h, r) {
        if (typeof r === 'number') r = [r, r, r, r];
        const [tl, tr, br, bl] = r;
        this.moveTo(x + tl, y);
        this.lineTo(x + w - tr, y); this.quadraticCurveTo(x + w, y, x + w, y + tr);
        this.lineTo(x + w, y + h - br); this.quadraticCurveTo(x + w, y + h, x + w - br, y + h);
        this.lineTo(x + bl, y + h); this.quadraticCurveTo(x, y + h, x, y + h - bl);
        this.lineTo(x, y + tl); this.quadraticCurveTo(x, y, x + tl, y);
        this.closePath();
        return this;
    };
}

function initVisualizations() {
    initScoreField();
    initForwardDiffusion();
    initReverseSampling();
    initGuidance();
    initFlowVsDiffusion();
}

// ===== Color Palette =====
const VIZ_COLORS = {
    blue:        { r: 43, g: 108, b: 176 },
    red:         { r: 197, g: 48,  b: 48  },
    green:       { r: 34, g: 139, b: 94  },
    purple:      { r: 109, g: 40,  b: 169 },
    orange:      { r: 221, g: 135, b: 5   },
    teal:        { r: 0,  g: 128, b: 128  },
    gridLine:    'rgba(0, 0, 0, 0.035)',
    gridLineDark:'rgba(0, 0, 0, 0.07)',
    canvasBg:    '#fdfdfe',
    labelBg:     'rgba(255, 255, 255, 0.92)',
    labelText:   '#2d3748',
    divider:     'rgba(160, 180, 200, 0.35)',
};

const PARTICLE_COLORS = [
    VIZ_COLORS.blue, VIZ_COLORS.red, VIZ_COLORS.green,
    VIZ_COLORS.purple, VIZ_COLORS.orange, VIZ_COLORS.teal
];

// ===== Utility Functions =====
function setupCanvas(container) {
    if (!container) return null;
    const canvas = container.querySelector('.viz-canvas');
    if (!canvas) return null;
    const dpr = window.devicePixelRatio || 1;
    const rect = canvas.getBoundingClientRect();
    canvas.width = rect.width * dpr;
    canvas.height = rect.height * dpr;
    const ctx = canvas.getContext('2d');
    ctx.scale(dpr, dpr);
    return { canvas, ctx, w: rect.width, h: rect.height };
}

function gaussRandom() {
    let u = 0, v = 0;
    while (u === 0) u = Math.random();
    while (v === 0) v = Math.random();
    return Math.sqrt(-2.0 * Math.log(u)) * Math.cos(2.0 * Math.PI * v);
}

function gauss2D(mx, my, sx, sy) {
    return [mx + sx * gaussRandom(), my + sy * gaussRandom()];
}

function clamp(v, lo, hi) { return Math.max(lo, Math.min(hi, v)); }

function rgba(c, a) { return `rgba(${c.r}, ${c.g}, ${c.b}, ${a})`; }

function drawSubtleGrid(ctx, w, h, spacing) {
    ctx.save();
    ctx.strokeStyle = VIZ_COLORS.gridLine;
    ctx.lineWidth = 0.5;
    for (let x = spacing; x < w; x += spacing) {
        ctx.beginPath();
        ctx.moveTo(x, 0);
        ctx.lineTo(x, h);
        ctx.stroke();
    }
    for (let y = spacing; y < h; y += spacing) {
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(w, y);
        ctx.stroke();
    }
    ctx.restore();
}

function fillCanvasBg(ctx, w, h) {
    ctx.fillStyle = VIZ_COLORS.canvasBg;
    ctx.fillRect(0, 0, w, h);
}

function drawLabel(ctx, text, x, y, align, fontSize) {
    ctx.save();
    const fs = fontSize || 15;
    ctx.font = '600 ' + fs + 'px "Lato", sans-serif';
    ctx.textAlign = align || 'left';
    ctx.textBaseline = 'top';
    const metrics = ctx.measureText(text);
    const pad = 5;
    const lh = fs + 6;
    const lx = align === 'right' ? x - metrics.width - pad * 2 :
               align === 'center' ? x - metrics.width / 2 - pad : x;
    ctx.fillStyle = VIZ_COLORS.labelBg;
    ctx.beginPath();
    ctx.roundRect(lx, y - 1, metrics.width + pad * 2, lh, 3);
    ctx.fill();
    ctx.fillStyle = VIZ_COLORS.labelText;
    ctx.fillText(text, align === 'right' ? x : align === 'center' ? x : x + pad, y + 1);
    ctx.restore();
}

function drawParticle(ctx, x, y, radius, color, glow) {
    if (glow) {
        ctx.save();
        ctx.shadowColor = rgba(color, 0.5);
        ctx.shadowBlur = 8;
    }
    ctx.beginPath();
    ctx.arc(x, y, radius, 0, Math.PI * 2);
    const grad = ctx.createRadialGradient(x - radius * 0.3, y - radius * 0.3, 0, x, y, radius);
    grad.addColorStop(0, rgba(color, 1));
    grad.addColorStop(0.7, rgba(color, 0.85));
    grad.addColorStop(1, rgba(color, 0.5));
    ctx.fillStyle = grad;
    ctx.fill();
    ctx.strokeStyle = 'rgba(255,255,255,0.7)';
    ctx.lineWidth = 0.8;
    ctx.stroke();
    if (glow) ctx.restore();
}

function drawDivider(ctx, x, h) {
    ctx.save();
    const grad = ctx.createLinearGradient(x, 0, x, h);
    grad.addColorStop(0, 'rgba(180, 195, 210, 0)');
    grad.addColorStop(0.15, 'rgba(180, 195, 210, 0.35)');
    grad.addColorStop(0.85, 'rgba(180, 195, 210, 0.35)');
    grad.addColorStop(1, 'rgba(180, 195, 210, 0)');
    ctx.strokeStyle = grad;
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(x, 0);
    ctx.lineTo(x, h);
    ctx.stroke();
    ctx.restore();
}

function drawTrail(ctx, trail, color, maxWidth, fadeStart) {
    if (trail.length < 2) return;
    const len = trail.length;
    for (let j = 1; j < len; j++) {
        const alpha = fadeStart + (1 - fadeStart) * (j / len);
        const width = 0.5 + (maxWidth - 0.5) * (j / len);
        ctx.beginPath();
        ctx.moveTo(trail[j - 1][0], trail[j - 1][1]);
        ctx.lineTo(trail[j][0], trail[j][1]);
        ctx.strokeStyle = rgba(color, alpha * 0.7);
        ctx.lineWidth = width;
        ctx.lineCap = 'round';
        ctx.stroke();
    }
}

// ===== Viz 1: Score Field & Langevin Dynamics =====
function initScoreField() {
    const container = document.getElementById('viz-score-field');
    const setup = setupCanvas(container);
    if (!setup) return;
    const { canvas, ctx, w, h } = setup;

    const modes = [
        { mx: w * 0.3, my: h * 0.35, sx: w * 0.08, sy: h * 0.08, weight: 0.4 },
        { mx: w * 0.65, my: h * 0.6, sx: w * 0.09, sy: h * 0.07, weight: 0.35 },
        { mx: w * 0.5, my: h * 0.2, sx: w * 0.06, sy: h * 0.06, weight: 0.25 }
    ];

    function density(x, y) {
        let p = 0;
        for (const m of modes) {
            const dx = (x - m.mx) / m.sx, dy = (y - m.my) / m.sy;
            p += m.weight * Math.exp(-0.5 * (dx * dx + dy * dy));
        }
        return p;
    }

    function scoreAt(x, y) {
        let sx = 0, sy = 0, totalP = 0;
        for (const m of modes) {
            const dx = (x - m.mx) / m.sx, dy = (y - m.my) / m.sy;
            const p = m.weight * Math.exp(-0.5 * (dx * dx + dy * dy));
            sx += p * (-(x - m.mx) / (m.sx * m.sx));
            sy += p * (-(y - m.my) / (m.sy * m.sy));
            totalP += p;
        }
        if (totalP < 1e-12) return [0, 0];
        return [sx / totalP, sy / totalP];
    }

    let particles = [];
    let trails = [];
    let animId = null;

    const noiseCheckbox = container.querySelector('#viz-score-noise');
    const stepSlider = container.querySelector('#viz-score-step');
    const resetBtn = container.querySelector('#viz-score-reset');

    function drawBackground() {
        // Smooth density heatmap with purple-blue-white palette
        const imgData = ctx.createImageData(Math.ceil(w), Math.ceil(h));
        let maxD = 0;
        const cw = Math.ceil(w), ch = Math.ceil(h);
        const densities = new Float32Array(cw * ch);
        for (let py = 0; py < ch; py++) {
            for (let px = 0; px < cw; px++) {
                const d = density(px, py);
                densities[py * cw + px] = d;
                if (d > maxD) maxD = d;
            }
        }
        for (let py = 0; py < ch; py++) {
            for (let px = 0; px < cw; px++) {
                const idx = (py * cw + px) * 4;
                const d = densities[py * cw + px] / maxD;
                const t = Math.pow(d, 0.45);
                // White -> light blue -> deep blue -> purple
                if (t < 0.33) {
                    const s = t / 0.33;
                    imgData.data[idx]     = Math.round(250 - s * 30);   // R
                    imgData.data[idx + 1] = Math.round(251 - s * 40);   // G
                    imgData.data[idx + 2] = Math.round(252 - s * 2);    // B
                } else if (t < 0.66) {
                    const s = (t - 0.33) / 0.33;
                    imgData.data[idx]     = Math.round(220 - s * 120);  // R
                    imgData.data[idx + 1] = Math.round(211 - s * 80);   // G
                    imgData.data[idx + 2] = Math.round(250 - s * 30);   // B
                } else {
                    const s = (t - 0.66) / 0.34;
                    imgData.data[idx]     = Math.round(100 - s * 40);   // R
                    imgData.data[idx + 1] = Math.round(131 - s * 70);   // G
                    imgData.data[idx + 2] = Math.round(220 - s * 30);   // B
                }
                imgData.data[idx + 3] = 255;
            }
        }
        ctx.putImageData(imgData, 0, 0);

        // Score arrows on grid with smooth scaling
        const step = 32;
        for (let gx = step; gx < w - step / 2; gx += step) {
            for (let gy = step; gy < h - step / 2; gy += step) {
                const [sx, sy] = scoreAt(gx, gy);
                const mag = Math.sqrt(sx * sx + sy * sy);
                if (mag < 0.001) continue;
                const scale = Math.min(mag * 800, 15);
                const nx = sx / mag * scale, ny = sy / mag * scale;
                const arrowAlpha = Math.min(0.15 + mag * 30, 0.7);
                ctx.beginPath();
                ctx.moveTo(gx, gy);
                ctx.lineTo(gx + nx, gy + ny);
                ctx.strokeStyle = `rgba(255, 255, 255, ${arrowAlpha})`;
                ctx.lineWidth = 1.3;
                ctx.lineCap = 'round';
                ctx.stroke();
                // Arrowhead
                const angle = Math.atan2(ny, nx);
                ctx.beginPath();
                ctx.moveTo(gx + nx, gy + ny);
                ctx.lineTo(gx + nx - 4 * Math.cos(angle - 0.5), gy + ny - 4 * Math.sin(angle - 0.5));
                ctx.lineTo(gx + nx - 4 * Math.cos(angle + 0.5), gy + ny - 4 * Math.sin(angle + 0.5));
                ctx.closePath();
                ctx.fillStyle = `rgba(255, 255, 255, ${arrowAlpha})`;
                ctx.fill();
            }
        }
    }

    let bgCache = null;
    function cacheBackground() {
        drawBackground();
        bgCache = ctx.getImageData(0, 0, canvas.width, canvas.height);
    }

    function draw() {
        if (bgCache) ctx.putImageData(bgCache, 0, 0);

        // Draw trails with gradient fade
        for (let i = 0; i < trails.length; i++) {
            const color = PARTICLE_COLORS[i % PARTICLE_COLORS.length];
            drawTrail(ctx, trails[i], { r: 255, g: 255, b: 255 }, 2.5, 0.05);
            drawTrail(ctx, trails[i], color, 1.8, 0.1);
        }
        // Draw particles
        for (let i = 0; i < particles.length; i++) {
            const color = PARTICLE_COLORS[i % PARTICLE_COLORS.length];
            drawParticle(ctx, particles[i][0], particles[i][1], 5, color, true);
        }

        // Click hint
        if (particles.length === 0) {
            drawLabel(ctx, 'Click to place particles', w / 2, h - 22, 'center');
        }
    }

    function stepParticles() {
        const zeta = (stepSlider ? stepSlider.value : 8) / 1000;
        const useNoise = noiseCheckbox ? noiseCheckbox.checked : true;
        for (let i = 0; i < particles.length; i++) {
            const [sx, sy] = scoreAt(particles[i][0], particles[i][1]);
            let nx = particles[i][0] + zeta * sx * 500;
            let ny = particles[i][1] + zeta * sy * 500;
            if (useNoise) {
                nx += Math.sqrt(2 * zeta) * gaussRandom() * 2;
                ny += Math.sqrt(2 * zeta) * gaussRandom() * 2;
            }
            particles[i] = [clamp(nx, 2, w - 2), clamp(ny, 2, h - 2)];
            trails[i].push([particles[i][0], particles[i][1]]);
            if (trails[i].length > 250) trails[i].shift();
        }
    }

    function animate() {
        stepParticles();
        draw();
        animId = requestAnimationFrame(animate);
    }

    canvas.addEventListener('click', (e) => {
        const rect = canvas.getBoundingClientRect();
        const x = e.clientX - rect.left, y = e.clientY - rect.top;
        particles.push([x, y]);
        trails.push([[x, y]]);
        if (!animId) animate();
    });

    if (resetBtn) resetBtn.addEventListener('click', () => {
        particles = [];
        trails = [];
        if (animId) { cancelAnimationFrame(animId); animId = null; }
        draw();
    });

    cacheBackground();
    draw();
}

// ===== Viz 2: Forward Diffusion Process =====
function initForwardDiffusion() {
    const container = document.getElementById('viz-forward-diffusion');
    const setup = setupCanvas(container);
    if (!setup) return;
    const { canvas, ctx, w, h } = setup;

    const N = 250;
    let basePoints = [];
    // Pre-generate noise for deterministic animation at each slider value
    let noiseCache = [];

    function generatePoints() {
        basePoints = [];
        noiseCache = [];
        for (let i = 0; i < N; i++) {
            let pt;
            if (i < N * 0.55) {
                pt = gauss2D(w * 0.32, h * 0.4, w * 0.06, h * 0.06);
            } else {
                pt = gauss2D(w * 0.68, h * 0.55, w * 0.07, h * 0.05);
            }
            basePoints.push({ x: pt[0], y: pt[1], cluster: i < N * 0.55 ? 0 : 1 });
            noiseCache.push({ nx: gaussRandom(), ny: gaussRandom() });
        }
    }

    const tSlider = container.querySelector('#viz-forward-t');
    const modeSelect = container.querySelector('#viz-forward-mode');
    const resetBtn = container.querySelector('#viz-forward-reset');

    function draw() {
        const t = (tSlider ? tSlider.value : 0) / 100;
        const mode = modeSelect ? modeSelect.value : 'vp';

        fillCanvasBg(ctx, w, h);
        drawSubtleGrid(ctx, w, h, 40);

        // Draw cluster ghost outlines at t=0 positions
        if (t > 0.05) {
            ctx.save();
            ctx.globalAlpha = Math.min(t * 0.4, 0.15);
            ctx.strokeStyle = rgba(VIZ_COLORS.blue, 0.5);
            ctx.setLineDash([3, 5]);
            ctx.beginPath();
            ctx.ellipse(w * 0.32, h * 0.4, w * 0.14, h * 0.14, 0, 0, Math.PI * 2);
            ctx.stroke();
            ctx.strokeStyle = rgba(VIZ_COLORS.red, 0.5);
            ctx.beginPath();
            ctx.ellipse(w * 0.68, h * 0.55, w * 0.16, h * 0.12, 0, 0, Math.PI * 2);
            ctx.stroke();
            ctx.setLineDash([]);
            ctx.restore();
        }

        // Compute noisy positions
        for (let i = 0; i < basePoints.length; i++) {
            const p = basePoints[i];
            const nc = noiseCache[i];
            let nx, ny;
            if (mode === 'vp') {
                const alphaBar = Math.exp(-5 * t * t);
                const scale = Math.sqrt(alphaBar);
                const noise = Math.sqrt(1 - alphaBar);
                nx = w / 2 + scale * (p.x - w / 2) + noise * nc.nx * w * 0.15;
                ny = h / 2 + scale * (p.y - h / 2) + noise * nc.ny * h * 0.15;
            } else {
                const sigma = t * t * 3;
                nx = p.x + sigma * nc.nx * w * 0.12;
                ny = p.y + sigma * nc.ny * h * 0.12;
            }

            const alpha = Math.max(0.2, 1 - t * 0.6);
            const radius = 3 + t * 1.5; // dots slightly enlarge with noise
            const color = p.cluster === 0 ? VIZ_COLORS.blue : VIZ_COLORS.red;

            ctx.beginPath();
            ctx.arc(nx, ny, radius, 0, Math.PI * 2);
            ctx.fillStyle = rgba(color, alpha);
            ctx.fill();
            // Soft border
            ctx.strokeStyle = rgba(color, alpha * 0.3);
            ctx.lineWidth = 0.5;
            ctx.stroke();
        }

        // Time and mode labels
        drawLabel(ctx, `t = ${t.toFixed(2)}`, w - 8, 8, 'right');
        drawLabel(ctx, mode === 'vp' ? 'VP (DDPM)' : 'VE (SMLD)', w - 8, 28, 'right');

        // Progress bar at bottom
        ctx.save();
        ctx.fillStyle = 'rgba(0,0,0,0.06)';
        ctx.fillRect(0, h - 3, w, 3);
        const barColor = t < 0.5
            ? rgba(VIZ_COLORS.blue, 0.6)
            : rgba(VIZ_COLORS.purple, 0.6);
        ctx.fillStyle = barColor;
        ctx.fillRect(0, h - 3, w * t, 3);
        ctx.restore();
    }

    if (tSlider) tSlider.addEventListener('input', draw);
    if (modeSelect) modeSelect.addEventListener('change', draw);
    if (resetBtn) resetBtn.addEventListener('click', () => {
        if (tSlider) tSlider.value = 0;
        generatePoints();
        draw();
    });

    generatePoints();
    draw();
}

// ===== Viz 3: Reverse SDE vs PF ODE =====
function initReverseSampling() {
    const container = document.getElementById('viz-reverse-sampling');
    const setup = setupCanvas(container);
    if (!setup) return;
    const { canvas, ctx, w, h } = setup;

    const halfW = w / 2;
    const nParticles = 30;
    const nSteps = 120;
    let sdeTrajs = [], odeTrajs = [];
    let step = 0;
    let animId = null;
    let running = false;

    const targets = [];
    for (let i = 0; i < nParticles; i++) {
        const cluster = Math.random() < 0.5;
        const tx = cluster ? halfW * 0.35 : halfW * 0.65;
        const ty = cluster ? h * 0.65 : h * 0.35;
        targets.push(gauss2D(tx, ty, halfW * 0.06, h * 0.06));
    }

    function generateTrajectories() {
        sdeTrajs = [];
        odeTrajs = [];
        for (let i = 0; i < nParticles; i++) {
            const startX = halfW * 0.1 + Math.random() * halfW * 0.8;
            const startY = h * 0.1 + Math.random() * h * 0.8;
            const endX = targets[i][0], endY = targets[i][1];

            const sdePath = [[startX, startY]];
            for (let s = 1; s <= nSteps; s++) {
                const t = s / nSteps;
                const prevX = sdePath[s - 1][0], prevY = sdePath[s - 1][1];
                const drift_x = (endX - prevX) / (nSteps - s + 1);
                const drift_y = (endY - prevY) / (nSteps - s + 1);
                const noiseScale = Math.max(0, (1 - t)) * 8;
                sdePath.push([
                    prevX + drift_x + gaussRandom() * noiseScale,
                    prevY + drift_y + gaussRandom() * noiseScale
                ]);
            }
            sdeTrajs.push(sdePath);

            const odePath = [];
            for (let s = 0; s <= nSteps; s++) {
                const t = s / nSteps;
                const ease = t * t * (3 - 2 * t);
                odePath.push([
                    startX + (endX - startX) * ease,
                    startY + (endY - startY) * ease
                ]);
            }
            odeTrajs.push(odePath);
        }
    }

    const startBtn = container.querySelector('#viz-reverse-start');
    const speedSlider = container.querySelector('#viz-reverse-speed');
    const resetBtn = container.querySelector('#viz-reverse-reset');

    function draw() {
        fillCanvasBg(ctx, w, h);
        drawSubtleGrid(ctx, w, h, 40);
        drawDivider(ctx, halfW, h);

        // Panel labels
        drawLabel(ctx, 'Reverse SDE (stochastic)', halfW / 2, 8, 'center');
        drawLabel(ctx, 'PF ODE (deterministic)', halfW + halfW / 2, 8, 'center');

        const showStep = Math.min(step, nSteps);

        // SDE trajectories (left half)
        for (let i = 0; i < nParticles; i++) {
            const traj = sdeTrajs[i];
            if (showStep > 1) {
                for (let s = 1; s <= showStep; s++) {
                    const alpha = 0.05 + 0.25 * (s / showStep);
                    ctx.beginPath();
                    ctx.moveTo(traj[s - 1][0], traj[s - 1][1]);
                    ctx.lineTo(traj[s][0], traj[s][1]);
                    ctx.strokeStyle = rgba(VIZ_COLORS.blue, alpha);
                    ctx.lineWidth = 0.6 + 0.8 * (s / nSteps);
                    ctx.lineCap = 'round';
                    ctx.stroke();
                }
            }
            const pos = traj[showStep];
            drawParticle(ctx, pos[0], pos[1], 3.5, VIZ_COLORS.blue, false);
        }

        // ODE trajectories (right half)
        for (let i = 0; i < nParticles; i++) {
            const traj = odeTrajs[i];
            if (showStep > 1) {
                for (let s = 1; s <= showStep; s++) {
                    const alpha = 0.05 + 0.25 * (s / showStep);
                    ctx.beginPath();
                    ctx.moveTo(traj[s - 1][0] + halfW, traj[s - 1][1]);
                    ctx.lineTo(traj[s][0] + halfW, traj[s][1]);
                    ctx.strokeStyle = rgba(VIZ_COLORS.red, alpha);
                    ctx.lineWidth = 0.6 + 0.8 * (s / nSteps);
                    ctx.lineCap = 'round';
                    ctx.stroke();
                }
            }
            const pos = traj[showStep];
            drawParticle(ctx, pos[0] + halfW, pos[1], 3.5, VIZ_COLORS.red, false);
        }

        // Progress bar
        ctx.save();
        ctx.fillStyle = 'rgba(0,0,0,0.06)';
        ctx.fillRect(0, h - 3, w, 3);
        const progress = showStep / nSteps;
        ctx.fillStyle = rgba(VIZ_COLORS.blue, 0.5);
        ctx.fillRect(0, h - 3, halfW * progress, 3);
        ctx.fillStyle = rgba(VIZ_COLORS.red, 0.5);
        ctx.fillRect(halfW, h - 3, halfW * progress, 3);
        ctx.restore();

        drawLabel(ctx, `step ${showStep}/${nSteps}`, w - 8, h - 22, 'right');
    }

    function animate() {
        const speed = speedSlider ? parseInt(speedSlider.value) : 5;
        step += speed;
        if (step > nSteps) { step = nSteps; running = false; }
        draw();
        if (running) animId = requestAnimationFrame(animate);
    }

    if (startBtn) startBtn.addEventListener('click', () => {
        if (running) return;
        if (step >= nSteps) { step = 0; generateTrajectories(); }
        running = true;
        animate();
    });
    if (resetBtn) resetBtn.addEventListener('click', () => {
        running = false;
        if (animId) cancelAnimationFrame(animId);
        step = 0;
        generateTrajectories();
        draw();
    });

    generateTrajectories();
    draw();
}

// ===== Viz 4: Guidance Strength =====
function initGuidance() {
    const container = document.getElementById('viz-guidance');
    const setup = setupCanvas(container);
    if (!setup) return;
    const { canvas, ctx, w, h } = setup;

    const gammaSlider = container.querySelector('#viz-guidance-gamma');
    const gammaVal = container.querySelector('#viz-guidance-gamma-val');
    const resetBtn = container.querySelector('#viz-guidance-reset');

    const priorMx = w * 0.43, priorMy = h * 0.5;
    const priorSx = w * 0.15, priorSy = h * 0.15;
    const measX = w * 0.62;

    const nSamples = 200;
    let baseSamples = [];

    function generateSamples() {
        baseSamples = [];
        for (let i = 0; i < nSamples; i++) {
            baseSamples.push(gauss2D(priorMx, priorMy, priorSx, priorSy));
        }
    }

    function draw() {
        const gamma = (gammaSlider ? gammaSlider.value : 10) / 10;
        if (gammaVal) gammaVal.textContent = gamma.toFixed(1);

        fillCanvasBg(ctx, w, h);
        drawSubtleGrid(ctx, w, h, 40);

        // Posterior heatmap with blue-purple gradient
        const resolution = 4;
        for (let px = 0; px < w; px += resolution) {
            for (let py = 0; py < h; py += resolution) {
                const dx = (px - priorMx) / priorSx, dy = (py - priorMy) / priorSy;
                const prior = Math.exp(-0.5 * (dx * dx + dy * dy));
                const likelihood = Math.exp(-gamma * ((px - measX) * (px - measX)) / (w * w * 0.01));
                const posterior = prior * likelihood;
                const t = Math.pow(Math.min(posterior, 1), 0.35);
                if (t > 0.01) {
                    // Blue-purple gradient for density
                    const r = Math.round(41 + t * 100);
                    const g = Math.round(128 - t * 60);
                    const b = Math.round(185 + t * 40);
                    ctx.fillStyle = `rgba(${r}, ${g}, ${b}, ${t * 0.2})`;
                    ctx.fillRect(px, py, resolution, resolution);
                }
            }
        }

        // Measurement constraint line with glow
        ctx.save();
        ctx.shadowColor = rgba(VIZ_COLORS.red, 0.3);
        ctx.shadowBlur = 8;
        ctx.strokeStyle = rgba(VIZ_COLORS.red, 0.6);
        ctx.lineWidth = 2;
        ctx.setLineDash([8, 5]);
        ctx.beginPath();
        ctx.moveTo(measX, 15);
        ctx.lineTo(measX, h - 15);
        ctx.stroke();
        ctx.setLineDash([]);
        ctx.restore();

        drawLabel(ctx, 'Conditional signals', measX + 8, 12, 'left', 15);

        // Guided samples with color transition
        for (const [bx, by] of baseSamples) {
            const shift = gamma / (gamma + 1);
            const gx = bx + (measX - bx) * shift;
            const gy = by * (1 - shift * 0.1) + h * 0.5 * shift * 0.1;

            // Color from blue (low gamma) to purple (high gamma)
            const colorMix = Math.min(gamma / 5, 1);
            const r = Math.round(41 + colorMix * 101);
            const g = Math.round(128 - colorMix * 60);
            const b = Math.round(185 - colorMix * 12);

            ctx.beginPath();
            ctx.arc(gx, gy, 3, 0, Math.PI * 2);
            ctx.fillStyle = `rgba(${r}, ${g}, ${b}, 0.55)`;
            ctx.fill();
            ctx.strokeStyle = `rgba(${r}, ${g}, ${b}, 0.2)`;
            ctx.lineWidth = 0.5;
            ctx.stroke();
        }

        drawLabel(ctx, `\u03B3 = ${gamma.toFixed(1)}`, 8, 8, 'left', 16);
    }

    if (gammaSlider) gammaSlider.addEventListener('input', draw);
    if (resetBtn) resetBtn.addEventListener('click', () => {
        if (gammaSlider) gammaSlider.value = 10;
        generateSamples();
        draw();
    });

    generateSamples();
    draw();
}

// ===== Viz 5: Flow Matching vs Diffusion Paths =====
function initFlowVsDiffusion() {
    const container = document.getElementById('viz-flow-vs-diffusion');
    const setup = setupCanvas(container);
    if (!setup) return;
    const { canvas, ctx, w, h } = setup;

    const halfW = w / 2;
    const nPairs = 20;
    const nSteps = 100;
    let diffPaths = [], flowPaths = [];
    let step = 0;
    let animId = null;
    let running = false;

    function generatePaths() {
        diffPaths = [];
        flowPaths = [];

        for (let i = 0; i < nPairs; i++) {
            const sx = halfW * 0.15 + Math.random() * halfW * 0.7;
            const sy = h * 0.1 + Math.random() * h * 0.3;
            const cluster = Math.random() < 0.5;
            const ex = cluster ? halfW * 0.3 : halfW * 0.7;
            const ey = cluster ? h * 0.7 : h * 0.75;
            const [tex, tey] = gauss2D(ex, ey, halfW * 0.05, h * 0.04);

            // Diffusion: curved noisy paths
            const dPath = [[sx, sy]];
            for (let s = 1; s <= nSteps; s++) {
                const t = s / nSteps;
                const prev = dPath[s - 1];
                const drift_x = (tex - prev[0]) / (nSteps - s + 1);
                const drift_y = (tey - prev[1]) / (nSteps - s + 1);
                const curveScale = Math.sin(t * Math.PI) * 15;
                dPath.push([
                    prev[0] + drift_x + gaussRandom() * curveScale * 0.5 + Math.sin(t * 4 + i) * curveScale * 0.3,
                    prev[1] + drift_y + gaussRandom() * curveScale * 0.3
                ]);
            }
            diffPaths.push(dPath);

            // Flow matching: straight line
            const fPath = [];
            for (let s = 0; s <= nSteps; s++) {
                const t = s / nSteps;
                fPath.push([
                    sx + (tex - sx) * t,
                    sy + (tey - sy) * t
                ]);
            }
            flowPaths.push(fPath);
        }
    }

    const startBtn = container.querySelector('#viz-flow-start');
    const speedSlider = container.querySelector('#viz-flow-speed');
    const resetBtn = container.querySelector('#viz-flow-reset');

    function draw() {
        fillCanvasBg(ctx, w, h);
        drawSubtleGrid(ctx, w, h, 40);
        drawDivider(ctx, halfW, h);

        drawLabel(ctx, 'Score-based Diffusion (curved)', halfW / 2, 8, 'center');
        drawLabel(ctx, 'Flow Matching (straight)', halfW + halfW / 2, 8, 'center');

        const showStep = Math.min(step, nSteps);

        // Diffusion paths (left)
        for (let i = 0; i < nPairs; i++) {
            const path = diffPaths[i];
            if (showStep > 0) {
                for (let s = 1; s <= showStep; s++) {
                    const alpha = 0.05 + 0.3 * (s / showStep);
                    ctx.beginPath();
                    ctx.moveTo(path[s - 1][0], path[s - 1][1]);
                    ctx.lineTo(path[s][0], path[s][1]);
                    ctx.strokeStyle = rgba(VIZ_COLORS.blue, alpha);
                    ctx.lineWidth = 0.6 + 0.6 * (s / nSteps);
                    ctx.lineCap = 'round';
                    ctx.stroke();
                }
            }
            const pos = path[showStep];
            drawParticle(ctx, pos[0], pos[1], 3.5, VIZ_COLORS.blue, false);
        }

        // Flow paths (right, offset by halfW)
        for (let i = 0; i < nPairs; i++) {
            const path = flowPaths[i];
            if (showStep > 0) {
                for (let s = 1; s <= showStep; s++) {
                    const alpha = 0.05 + 0.3 * (s / showStep);
                    ctx.beginPath();
                    ctx.moveTo(path[s - 1][0] + halfW, path[s - 1][1]);
                    ctx.lineTo(path[s][0] + halfW, path[s][1]);
                    ctx.strokeStyle = rgba(VIZ_COLORS.green, alpha);
                    ctx.lineWidth = 0.6 + 0.6 * (s / nSteps);
                    ctx.lineCap = 'round';
                    ctx.stroke();
                }
            }
            const pos = path[showStep];
            drawParticle(ctx, pos[0] + halfW, pos[1], 3.5, VIZ_COLORS.green, false);
        }

        // Endpoint labels
        if (showStep < nSteps * 0.1) {
            drawLabel(ctx, 'noise', halfW / 2, h - 22, 'center');
            drawLabel(ctx, 'noise', halfW + halfW / 2, h - 22, 'center');
        } else if (showStep > nSteps * 0.9) {
            drawLabel(ctx, 'data', halfW / 2, h - 22, 'center');
            drawLabel(ctx, 'data', halfW + halfW / 2, h - 22, 'center');
        }

        // Progress bar
        ctx.save();
        ctx.fillStyle = 'rgba(0,0,0,0.06)';
        ctx.fillRect(0, h - 3, w, 3);
        const progress = showStep / nSteps;
        ctx.fillStyle = rgba(VIZ_COLORS.blue, 0.5);
        ctx.fillRect(0, h - 3, halfW * progress, 3);
        ctx.fillStyle = rgba(VIZ_COLORS.green, 0.5);
        ctx.fillRect(halfW, h - 3, halfW * progress, 3);
        ctx.restore();

        drawLabel(ctx, `step ${showStep}/${nSteps}`, w - 8, h - 22, 'right');
    }

    function animate() {
        const speed = speedSlider ? parseInt(speedSlider.value) : 5;
        step += speed;
        if (step > nSteps) { step = nSteps; running = false; }
        draw();
        if (running) animId = requestAnimationFrame(animate);
    }

    if (startBtn) startBtn.addEventListener('click', () => {
        if (running) return;
        if (step >= nSteps) { step = 0; generatePaths(); }
        running = true;
        animate();
    });
    if (resetBtn) resetBtn.addEventListener('click', () => {
        running = false;
        if (animId) cancelAnimationFrame(animId);
        step = 0;
        generatePaths();
        draw();
    });

    generatePaths();
    draw();
}
