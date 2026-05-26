// ===== DiffComm Tutorial — Interactive Visualizations (v2) =====
// 5 polished HTML5 Canvas visualizations with enhanced aesthetics & principle depth.

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

// ===== Color Palette (harmonized: cool=stochastic/source, warm=deterministic/target) =====
const VIZ_COLORS = {
    blue:        { r: 43,  g: 108, b: 176 },  // SDE / diffusion / prior / source
    red:         { r: 197, g: 48,  b: 48  },  // measurement / target accent
    green:       { r: 34,  g: 139, b: 94  },  // flow matching / efficient path
    purple:      { r: 109, g: 40,  b: 169 },  // posterior / guidance result
    orange:      { r: 221, g: 135, b: 5   },  // highlight
    teal:        { r: 0,   g: 128, b: 128 },  // PF-ODE / deterministic flow
    indigo:      { r: 67,  g: 56,  b: 202 },  // secondary accent
    pink:        { r: 213, g: 63,  b: 140 },
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
// Size a canvas to match its current CSS display box. The body uses CSS `zoom: 1.3`,
// and layout can shift after the initial init (fonts, fade-in transitions, late
// reflow), so we resync the bitmap to the displayed box on every call. This is
// idempotent — call it whenever you suspect the size may have drifted.
function setupCanvas(container) {
    if (!container) return null;
    const canvas = container.querySelector('.viz-canvas');
    if (!canvas) return null;
    const dpr = window.devicePixelRatio || 1;
    const rect = canvas.getBoundingClientRect();
    const cssW = Math.max(1, rect.width);
    const cssH = Math.max(1, rect.height);
    canvas.width  = Math.round(cssW * dpr);
    canvas.height = Math.round(cssH * dpr);
    const ctx = canvas.getContext('2d');
    ctx.setTransform(1, 0, 0, 1, 0, 0);
    ctx.scale(dpr, dpr);
    return { canvas, ctx, w: cssW, h: cssH };
}

// Re-run a viz whenever its canvas display box changes (late layout, browser resize,
// zoom). Pass a rebuild() that re-sizes the canvas and redraws from scratch.
function observeCanvasResize(canvas, rebuild) {
    if (typeof ResizeObserver === 'undefined') {
        let t = null;
        window.addEventListener('resize', () => {
            clearTimeout(t); t = setTimeout(rebuild, 80);
        });
        return;
    }
    let t = null;
    let lastW = 0, lastH = 0;
    const ro = new ResizeObserver(entries => {
        const r = entries[0].contentRect;
        // Skip noise: only rebuild when the box actually moved by >=1 px.
        if (Math.abs(r.width - lastW) < 1 && Math.abs(r.height - lastH) < 1) return;
        lastW = r.width; lastH = r.height;
        clearTimeout(t);
        t = setTimeout(rebuild, 60);
    });
    ro.observe(canvas);
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
function lerp(a, b, t) { return a + (b - a) * t; }
function rgba(c, a) { return `rgba(${c.r}, ${c.g}, ${c.b}, ${a})`; }

function drawSubtleGrid(ctx, w, h, spacing) {
    ctx.save();
    for (let x = spacing; x < w; x += spacing) {
        const edgeFade = Math.min(x / (spacing * 3), (w - x) / (spacing * 3), 1);
        ctx.strokeStyle = `rgba(0, 0, 0, ${0.03 * edgeFade})`;
        ctx.lineWidth = 0.5;
        ctx.beginPath(); ctx.moveTo(x, 0); ctx.lineTo(x, h); ctx.stroke();
    }
    for (let y = spacing; y < h; y += spacing) {
        const edgeFade = Math.min(y / (spacing * 3), (h - y) / (spacing * 3), 1);
        ctx.strokeStyle = `rgba(0, 0, 0, ${0.03 * edgeFade})`;
        ctx.lineWidth = 0.5;
        ctx.beginPath(); ctx.moveTo(0, y); ctx.lineTo(w, y); ctx.stroke();
    }
    ctx.restore();
}

function fillCanvasBg(ctx, w, h) {
    const grad = ctx.createLinearGradient(0, 0, 0, h);
    grad.addColorStop(0, '#fefefe');
    grad.addColorStop(1, '#f8f9fb');
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, w, h);
}

function drawLabel(ctx, text, x, y, align, fontSize, options) {
    ctx.save();
    const fs = fontSize || 15;
    const opts = options || {};
    const fontWeight = opts.bold ? '700' : '600';
    const fontFamily = opts.mono ? '"Fira Code", "Consolas", monospace' : '"Lato", sans-serif';
    ctx.font = fontWeight + ' ' + fs + 'px ' + fontFamily;
    ctx.textAlign = align || 'left';
    ctx.textBaseline = 'top';
    const metrics = ctx.measureText(text);
    const pad = 6;
    const lh = fs + 7;
    const lx = align === 'right' ? x - metrics.width - pad * 2 :
               align === 'center' ? x - metrics.width / 2 - pad : x;
    ctx.fillStyle = opts.bg || VIZ_COLORS.labelBg;
    ctx.beginPath();
    ctx.roundRect(lx, y - 1, metrics.width + pad * 2, lh, 4);
    ctx.fill();
    if (opts.border) {
        ctx.strokeStyle = opts.border;
        ctx.lineWidth = 0.8;
        ctx.stroke();
    }
    ctx.fillStyle = opts.color || VIZ_COLORS.labelText;
    ctx.fillText(text, align === 'right' ? x : align === 'center' ? x : x + pad, y + 2);
    ctx.restore();
}

function drawParticle(ctx, x, y, radius, color, glow) {
    if (glow) {
        ctx.save();
        ctx.shadowColor = rgba(color, 0.6);
        ctx.shadowBlur = 12;
    }
    ctx.beginPath();
    ctx.arc(x, y, radius, 0, Math.PI * 2);
    const grad = ctx.createRadialGradient(x - radius * 0.3, y - radius * 0.3, 0, x, y, radius);
    grad.addColorStop(0, 'rgba(255, 255, 255, 0.85)');
    grad.addColorStop(0.25, rgba(color, 1));
    grad.addColorStop(0.7, rgba(color, 0.85));
    grad.addColorStop(1, rgba(color, 0.35));
    ctx.fillStyle = grad;
    ctx.fill();
    if (glow) ctx.restore();
}

function drawDivider(ctx, x, h) {
    ctx.save();
    const grad = ctx.createLinearGradient(x, 0, x, h);
    grad.addColorStop(0, 'rgba(180, 195, 210, 0)');
    grad.addColorStop(0.12, 'rgba(180, 195, 210, 0.3)');
    grad.addColorStop(0.5, 'rgba(180, 195, 210, 0.4)');
    grad.addColorStop(0.88, 'rgba(180, 195, 210, 0.3)');
    grad.addColorStop(1, 'rgba(180, 195, 210, 0)');
    ctx.strokeStyle = grad;
    ctx.lineWidth = 1.5;
    ctx.setLineDash([5, 3]);
    ctx.beginPath(); ctx.moveTo(x, 0); ctx.lineTo(x, h); ctx.stroke();
    ctx.setLineDash([]);
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

// --- Enhanced Utility Functions ---

// Draw contour lines over a density field (marching squares)
function drawContourLines(ctx, densityFn, w, h, maxDensity, levels, color, lineWidth) {
    const step = 5;
    const lw = lineWidth || 0.9;
    for (let li = 0; li < levels.length; li++) {
        const threshold = levels[li] * maxDensity;
        const alpha = 0.2 + 0.4 * (levels[li]);
        ctx.beginPath();
        for (let px = 0; px < w - step; px += step) {
            for (let py = 0; py < h - step; py += step) {
                const d00 = densityFn(px, py), d10 = densityFn(px + step, py);
                const d01 = densityFn(px, py + step), d11 = densityFn(px + step, py + step);
                const a00 = d00 >= threshold, a10 = d10 >= threshold;
                const a01 = d01 >= threshold, a11 = d11 >= threshold;
                const sum = a00 + a10 + a01 + a11;
                if (sum > 0 && sum < 4) {
                    const pts = [];
                    if (a00 !== a10) pts.push([px + (threshold - d00) / (d10 - d00) * step, py]);
                    if (a01 !== a11) pts.push([px + (threshold - d01) / (d11 - d01) * step, py + step]);
                    if (a00 !== a01) pts.push([px, py + (threshold - d00) / (d01 - d00) * step]);
                    if (a10 !== a11) pts.push([px + step, py + (threshold - d10) / (d11 - d10) * step]);
                    if (pts.length >= 2) { ctx.moveTo(pts[0][0], pts[0][1]); ctx.lineTo(pts[1][0], pts[1][1]); }
                }
            }
        }
        ctx.strokeStyle = typeof color === 'string' ? color : rgba(color, alpha);
        ctx.lineWidth = lw;
        ctx.stroke();
    }
}

// Translucent Gaussian blob for target distribution
function drawGaussianBlob(ctx, cx, cy, rx, ry, color, maxAlpha) {
    const grad = ctx.createRadialGradient(cx, cy, 0, cx, cy, Math.max(rx, ry) * 1.5);
    grad.addColorStop(0, rgba(color, maxAlpha || 0.2));
    grad.addColorStop(0.5, rgba(color, (maxAlpha || 0.2) * 0.35));
    grad.addColorStop(1, rgba(color, 0));
    ctx.save();
    ctx.fillStyle = grad;
    ctx.beginPath();
    ctx.ellipse(cx, cy, rx * 2, ry * 2, 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();
}

// Inset chart (noise schedule, convergence, etc.)
function drawInsetChart(ctx, ix, iy, iw, ih, dataPoints, highlightIdx, color, title) {
    ctx.save();
    ctx.fillStyle = 'rgba(255, 255, 255, 0.88)';
    ctx.beginPath(); ctx.roundRect(ix, iy, iw, ih, 6); ctx.fill();
    ctx.strokeStyle = 'rgba(0, 0, 0, 0.08)';
    ctx.lineWidth = 0.8;
    ctx.stroke();

    if (title) {
        ctx.font = '600 10px "Lato", sans-serif';
        ctx.fillStyle = '#718096';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'top';
        ctx.fillText(title, ix + iw / 2, iy + 3);
    }

    const padX = 8, padTop = title ? 16 : 6, padBot = 6;
    const chartW = iw - padX * 2, chartH = ih - padTop - padBot;
    const ox = ix + padX, oy = iy + padTop;

    // Axes
    ctx.strokeStyle = 'rgba(0, 0, 0, 0.15)';
    ctx.lineWidth = 0.5;
    ctx.beginPath();
    ctx.moveTo(ox, oy); ctx.lineTo(ox, oy + chartH); ctx.lineTo(ox + chartW, oy + chartH);
    ctx.stroke();

    // Data curve with area fill
    if (dataPoints.length > 1) {
        ctx.beginPath();
        for (let i = 0; i < dataPoints.length; i++) {
            const x = ox + (i / (dataPoints.length - 1)) * chartW;
            const y = oy + chartH - clamp(dataPoints[i], 0, 1) * chartH;
            if (i === 0) ctx.moveTo(x, y); else ctx.lineTo(x, y);
        }
        ctx.strokeStyle = rgba(color, 0.8);
        ctx.lineWidth = 1.5;
        ctx.stroke();
        ctx.lineTo(ox + chartW, oy + chartH);
        ctx.lineTo(ox, oy + chartH);
        ctx.closePath();
        ctx.fillStyle = rgba(color, 0.06);
        ctx.fill();
    }

    // Highlight dot
    if (highlightIdx >= 0 && highlightIdx < dataPoints.length) {
        const hx = ox + (highlightIdx / (dataPoints.length - 1)) * chartW;
        const hy = oy + chartH - clamp(dataPoints[highlightIdx], 0, 1) * chartH;
        ctx.strokeStyle = rgba(color, 0.35);
        ctx.lineWidth = 0.7;
        ctx.setLineDash([2, 2]);
        ctx.beginPath(); ctx.moveTo(hx, oy); ctx.lineTo(hx, oy + chartH); ctx.stroke();
        ctx.setLineDash([]);
        ctx.beginPath(); ctx.arc(hx, hy, 3.5, 0, Math.PI * 2);
        ctx.fillStyle = rgba(color, 1);
        ctx.fill();
        ctx.strokeStyle = 'white'; ctx.lineWidth = 1.2; ctx.stroke();
    }
    ctx.restore();
}

// Gradient progress bar
function drawProgressBar(ctx, progress, x, y, barW, barH, color1, color2) {
    ctx.save();
    ctx.fillStyle = 'rgba(0, 0, 0, 0.05)';
    ctx.beginPath(); ctx.roundRect(x, y, barW, barH, barH / 2); ctx.fill();
    if (progress > 0.005) {
        const grad = ctx.createLinearGradient(x, y, x + barW * progress, y);
        grad.addColorStop(0, rgba(color1, 0.65));
        grad.addColorStop(1, rgba(color2, 0.75));
        ctx.fillStyle = grad;
        ctx.beginPath();
        ctx.roundRect(x, y, Math.max(barW * progress, barH), barH, barH / 2);
        ctx.fill();
    }
    ctx.restore();
}

// Mode center marker with label
function drawModeMarker(ctx, x, y, label, color) {
    ctx.save();
    const size = 6;
    ctx.strokeStyle = rgba(color || { r: 255, g: 255, b: 255 }, 0.8);
    ctx.lineWidth = 1.5;
    ctx.beginPath();
    ctx.moveTo(x - size, y); ctx.lineTo(x + size, y);
    ctx.moveTo(x, y - size); ctx.lineTo(x, y + size);
    ctx.stroke();
    // Subtle ring
    ctx.strokeStyle = rgba(color || { r: 255, g: 255, b: 255 }, 0.3);
    ctx.lineWidth = 1;
    ctx.beginPath(); ctx.arc(x, y, size + 3, 0, Math.PI * 2); ctx.stroke();
    if (label) {
        ctx.font = 'italic 600 11px "Lato", sans-serif';
        ctx.textAlign = 'left'; ctx.textBaseline = 'bottom';
        ctx.fillStyle = rgba(color || { r: 255, g: 255, b: 255 }, 0.95);
        ctx.fillText(label, x + size + 4, y - 3);
    }
    ctx.restore();
}

// Formula/code box on canvas
function drawFormulaBox(ctx, text, x, y, align, fontSize) {
    ctx.save();
    const fs = fontSize || 11;
    ctx.font = '500 ' + fs + 'px "Fira Code", "Consolas", monospace';
    ctx.textAlign = align || 'left';
    ctx.textBaseline = 'top';
    const metrics = ctx.measureText(text);
    const pad = 6;
    const lh = fs + 8;
    const lx = align === 'right' ? x - metrics.width - pad * 2 :
               align === 'center' ? x - metrics.width / 2 - pad : x;
    ctx.fillStyle = 'rgba(30, 30, 46, 0.82)';
    ctx.beginPath(); ctx.roundRect(lx, y - 2, metrics.width + pad * 2, lh, 4); ctx.fill();
    ctx.fillStyle = '#cdd6f4';
    ctx.fillText(text, align === 'right' ? x : align === 'center' ? x : x + pad, y + 1);
    ctx.restore();
}

// Draw ellipse contour (dashed or solid)
function drawEllipseContour(ctx, cx, cy, rx, ry, color, alpha, dashed) {
    ctx.save();
    ctx.strokeStyle = rgba(color, alpha);
    ctx.lineWidth = 1.5;
    if (dashed) ctx.setLineDash([5, 4]);
    ctx.beginPath(); ctx.ellipse(cx, cy, rx, ry, 0, 0, Math.PI * 2); ctx.stroke();
    if (dashed) ctx.setLineDash([]);
    ctx.restore();
}

// Draw a mini histogram sidebar
function drawMiniHistogram(ctx, data, bins, x, y, hw, hh, color, horizontal) {
    const counts = new Array(bins).fill(0);
    let minV = Infinity, maxV = -Infinity;
    for (const v of data) { if (v < minV) minV = v; if (v > maxV) maxV = v; }
    const range = maxV - minV || 1;
    for (const v of data) {
        const idx = Math.min(Math.floor((v - minV) / range * bins), bins - 1);
        counts[idx]++;
    }
    const maxCount = Math.max(...counts, 1);

    ctx.save();
    ctx.globalAlpha = 0.6;
    for (let i = 0; i < bins; i++) {
        const frac = counts[i] / maxCount;
        if (horizontal) {
            const barH = hh / bins;
            const barW = frac * hw;
            ctx.fillStyle = rgba(color, 0.15 + 0.5 * frac);
            ctx.fillRect(x, y + i * barH, barW, barH - 1);
        } else {
            const barW = hw / bins;
            const barH = frac * hh;
            ctx.fillStyle = rgba(color, 0.15 + 0.5 * frac);
            ctx.fillRect(x + i * barW, y + hh - barH, barW - 1, barH);
        }
    }
    ctx.restore();
}


// ===== Viz 1: Score Field & Langevin Dynamics =====
function initScoreField() {
    const container = document.getElementById('viz-score-field');
    if (!container) return;
    const canvas = container.querySelector('.viz-canvas');
    if (!canvas) return;

    // All dimension-dependent state lives in these closure vars and is rebuilt
    // whenever the canvas display box changes.
    let w = 0, h = 0, ctx = null;
    let modes = [];
    let particles = [];
    let trails = [];
    let iterCount = 0;
    let animId = null;
    let bgCache = null;

    const noiseCheckbox = container.querySelector('#viz-score-noise');
    const stepSlider = container.querySelector('#viz-score-step');
    const resetBtn = container.querySelector('#viz-score-reset');

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

    function drawBackground() {
        // ----- Density colormap underlay -----
        // KEY DETAIL: `putImageData` ignores the ctx transform and writes pixels
        // in BITMAP coordinates (which on a Hi-DPI display are dpr× larger than CSS
        // coords). If we createImageData at (w, h) — CSS-pixel size — putImageData
        // would only fill 1/dpr² of the bitmap, leaving white bands on the right
        // and bottom on any display with devicePixelRatio > 1 or with browser zoom.
        // Fix: render the colormap to an off-screen canvas at CSS resolution, then
        // `drawImage` it (drawImage *does* respect the ctx transform) so it scales
        // up to fill the full bitmap on any DPR.
        const cw = Math.ceil(w), ch = Math.ceil(h);

        let maxD = 0;
        const densities = new Float32Array(cw * ch);
        for (let py = 0; py < ch; py++) {
            for (let px = 0; px < cw; px++) {
                const d = density(px, py);
                densities[py * cw + px] = d;
                if (d > maxD) maxD = d;
            }
        }
        // 6-stop color gradient. The floor is a soft azure (NOT white) so the canvas
        // never has empty-looking regions, even where the density tails off.
        const stops = [
            { t: 0.00, r: 232, g: 242, b: 252 },  // soft azure floor
            { t: 0.18, r: 200, g: 222, b: 245 },  // pale cyan
            { t: 0.40, r: 140, g: 186, b: 232 },  // azure
            { t: 0.60, r: 66,  g: 120, b: 196 },  // royal blue
            { t: 0.80, r: 65,  g: 60,  b: 170 },  // indigo
            { t: 1.00, r: 110, g: 40,  b: 140 },  // plum
        ];
        function colorAt(t) {
            t = clamp(t, 0, 1);
            for (let i = 0; i < stops.length - 1; i++) {
                if (t >= stops[i].t && t <= stops[i + 1].t) {
                    const f = (t - stops[i].t) / (stops[i + 1].t - stops[i].t);
                    return [
                        Math.round(lerp(stops[i].r, stops[i + 1].r, f)),
                        Math.round(lerp(stops[i].g, stops[i + 1].g, f)),
                        Math.round(lerp(stops[i].b, stops[i + 1].b, f))
                    ];
                }
            }
            return [stops[stops.length - 1].r, stops[stops.length - 1].g, stops[stops.length - 1].b];
        }

        const off = document.createElement('canvas');
        off.width = cw;
        off.height = ch;
        const offCtx = off.getContext('2d');
        const imgData = offCtx.createImageData(cw, ch);
        for (let py = 0; py < ch; py++) {
            for (let px = 0; px < cw; px++) {
                const idx = (py * cw + px) * 4;
                const d = densities[py * cw + px] / maxD;
                const t = Math.pow(d, 0.42);
                const [r, g, b] = colorAt(t);
                imgData.data[idx] = r;
                imgData.data[idx + 1] = g;
                imgData.data[idx + 2] = b;
                imgData.data[idx + 3] = 255;
            }
        }
        offCtx.putImageData(imgData, 0, 0);
        // drawImage with (sx, sy, sw, sh, dx, dy, dw, dh) — destination is in scaled
        // CSS-pixel coords, so the colormap fills the full canvas at any dpr.
        ctx.imageSmoothingEnabled = true;
        ctx.imageSmoothingQuality = 'high';
        ctx.drawImage(off, 0, 0, cw, ch, 0, 0, w, h);

        // Contour lines at density levels
        drawContourLines(ctx, density, w, h, maxD,
            [0.15, 0.3, 0.5, 0.7, 0.85],
            { r: 255, g: 255, b: 255 }, 0.7);

        // Mode center markers with plain-text labels (avoid heavy math in the canvas)
        const labels = ['Mode 1', 'Mode 2', 'Mode 3'];
        const weights = ['34%', '34%', '32%'];
        for (let i = 0; i < modes.length; i++) {
            drawModeMarker(ctx, modes[i].mx, modes[i].my,
                labels[i] + '  •  ' + weights[i] + ' weight',
                { r: 255, g: 255, b: 255 });
        }

        // Score arrows on grid with magnitude-based coloring
        const step = 32;
        for (let gx = step; gx < w - step / 2; gx += step) {
            for (let gy = step; gy < h - step / 2; gy += step) {
                const [sx, sy] = scoreAt(gx, gy);
                const mag = Math.sqrt(sx * sx + sy * sy);
                if (mag < 0.001) continue;
                const scale = Math.min(mag * 800, 16);
                const nx = sx / mag * scale, ny = sy / mag * scale;
                const arrowAlpha = clamp(0.12 + mag * 25, 0.12, 0.7);
                ctx.beginPath();
                ctx.moveTo(gx, gy);
                ctx.lineTo(gx + nx, gy + ny);
                ctx.strokeStyle = `rgba(255, 255, 255, ${arrowAlpha})`;
                ctx.lineWidth = 1.2;
                ctx.lineCap = 'round';
                ctx.stroke();
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

        // Compact score magnitude colorbar at bottom-left (height-proportional)
        const legX = 12, legW = 9, legH = Math.min(70, h * 0.28);
        const legY = h - legH - 14;
        ctx.save();
        ctx.fillStyle = 'rgba(0, 0, 0, 0.32)';
        ctx.beginPath(); ctx.roundRect(legX - 6, legY - 14, 78, legH + 22, 5); ctx.fill();
        for (let i = 0; i < legH; i++) {
            const t = 1 - i / legH;
            const alpha = 0.18 + t * 0.6;
            ctx.fillStyle = `rgba(255, 255, 255, ${alpha})`;
            ctx.fillRect(legX, legY + i, legW, 1);
        }
        ctx.font = '600 9.5px "Lato", sans-serif';
        ctx.fillStyle = 'rgba(255, 255, 255, 0.92)';
        ctx.textAlign = 'left'; ctx.textBaseline = 'top';
        ctx.fillText('score magnitude', legX - 2, legY - 12);
        ctx.font = '500 9px "Lato", sans-serif';
        ctx.fillStyle = 'rgba(255, 255, 255, 0.78)';
        ctx.fillText('high', legX + legW + 5, legY - 1);
        ctx.fillText('low',  legX + legW + 5, legY + legH - 10);
        ctx.restore();
    }

    function cacheBackground() {
        drawBackground();
        bgCache = ctx.getImageData(0, 0, canvas.width, canvas.height);
    }

    function drawInfoPanel() {
        const zeta = (stepSlider ? stepSlider.value : 8) / 1000;
        const useNoise = noiseCheckbox ? noiseCheckbox.checked : true;
        // Panel shrinks slightly on narrow canvases so it never eats more than
        // ~28% of the canvas width.
        const panelW = Math.min(168, Math.max(132, w * 0.28));
        const panelH = 54;
        const px = w - panelW - 10, py = 10;
        ctx.save();
        ctx.fillStyle = 'rgba(0, 0, 0, 0.34)';
        ctx.beginPath(); ctx.roundRect(px, py, panelW, panelH, 6); ctx.fill();
        ctx.font = '700 11px "Lato", sans-serif';
        ctx.textAlign = 'left'; ctx.textBaseline = 'top';
        ctx.fillStyle = 'rgba(255, 255, 255, 0.95)';
        ctx.fillText(useNoise ? 'Langevin MCMC' : 'Gradient ascent',
                     px + 9, py + 6);
        ctx.font = '500 10px "Lato", sans-serif';
        ctx.fillStyle = 'rgba(220, 232, 245, 0.85)';
        ctx.fillText(useNoise ? 'stochastic update' : 'noise disabled',
                     px + 9, py + 20);
        ctx.font = '600 10px "Lato", sans-serif';
        ctx.fillStyle = 'rgba(255, 255, 255, 0.85)';
        ctx.fillText('step ' + zeta.toFixed(3) + '   •   iter ' + iterCount,
                     px + 9, py + 36);
        ctx.restore();
    }

    function draw() {
        if (bgCache) ctx.putImageData(bgCache, 0, 0);

        // Draw trails
        for (let i = 0; i < trails.length; i++) {
            const color = PARTICLE_COLORS[i % PARTICLE_COLORS.length];
            drawTrail(ctx, trails[i], { r: 255, g: 255, b: 255 }, 2.5, 0.05);
            drawTrail(ctx, trails[i], color, 1.8, 0.1);
        }
        // Draw particles with enhanced glow
        for (let i = 0; i < particles.length; i++) {
            const color = PARTICLE_COLORS[i % PARTICLE_COLORS.length];
            drawParticle(ctx, particles[i][0], particles[i][1], 5.5, color, true);
        }

        drawInfoPanel();

        if (particles.length === 0) {
            drawLabel(ctx, 'Click anywhere to seed a particle', w / 2, h - 22, 'center', 12,
                { bg: 'rgba(0,0,0,0.35)', color: 'rgba(255,255,255,0.92)' });
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
            if (trails[i].length > 300) trails[i].shift();
        }
        if (particles.length > 0) iterCount++;
    }

    function animate() {
        stepParticles();
        draw();
        animId = requestAnimationFrame(animate);
    }

    // Map a click event to canvas CSS coordinates. We divide by the bounding rect
    // (display) and multiply by `w` (the rebuild-time CSS width). This stays correct
    // even after a resize because rebuild() updates `w` and `h`.
    canvas.addEventListener('click', (e) => {
        const rect = canvas.getBoundingClientRect();
        const x = (e.clientX - rect.left) * (w / rect.width);
        const y = (e.clientY - rect.top)  * (h / rect.height);
        particles.push([x, y]);
        trails.push([[x, y]]);
        if (!animId) animate();
    });

    if (resetBtn) resetBtn.addEventListener('click', () => {
        particles = [];
        trails = [];
        iterCount = 0;
        if (animId) { cancelAnimationFrame(animId); animId = null; }
        draw();
    });

    // Rebuild every dimension-dependent piece of state from the live canvas size.
    // Called once at startup AND on every resize, so the visualisation always fills
    // the actual rendered canvas regardless of late layout / body zoom.
    function rebuild() {
        const dpr = window.devicePixelRatio || 1;
        const rect = canvas.getBoundingClientRect();
        const cssW = Math.max(1, rect.width);
        const cssH = Math.max(1, rect.height);
        canvas.width  = Math.round(cssW * dpr);
        canvas.height = Math.round(cssH * dpr);
        ctx = canvas.getContext('2d');
        ctx.setTransform(1, 0, 0, 1, 0, 0);
        ctx.scale(dpr, dpr);
        w = cssW; h = cssH;

        // Three Gaussian modes positioned by fraction so they adapt to any canvas
        // aspect ratio (wide 16:9 monitor or square-ish laptop screen).
        // - mx/my are fractions of w/h: the mode triangle always covers the canvas.
        // - sx = sy = min(w, h) * 0.18: blobs stay circular at every aspect ratio
        //   and shrink proportionally on smaller canvases.
        // - Mode 1/3 placed at y=0.45 (below the top-right info panel)
        //   and Mode 2 at y=0.70 (above the bottom-edge click hint), so the
        //   triangle never collides with overlays at any aspect ratio.
        const blobR = Math.min(w, h) * 0.18;
        modes = [
            { mx: w * 0.22, my: h * 0.45, sx: blobR, sy: blobR, weight: 0.34 },
            { mx: w * 0.50, my: h * 0.70, sx: blobR, sy: blobR, weight: 0.34 },
            { mx: w * 0.78, my: h * 0.45, sx: blobR, sy: blobR, weight: 0.32 }
        ];

        // Previous particle coords were in stale canvas units — drop them on resize.
        particles = [];
        trails = [];
        iterCount = 0;
        if (animId) { cancelAnimationFrame(animId); animId = null; }

        bgCache = null;
        cacheBackground();
        draw();
    }

    // Defer first build by one frame so any late layout (fonts, fade-in, body zoom)
    // has settled before we measure.
    requestAnimationFrame(rebuild);
    observeCanvasResize(canvas, rebuild);
}


// ===== Viz 2: Forward Diffusion Process =====
function initForwardDiffusion() {
    const container = document.getElementById('viz-forward-diffusion');
    if (!container) return;
    const canvas = container.querySelector('.viz-canvas');
    if (!canvas) return;

    let w = 0, h = 0, ctx = null;
    const N = 250;
    let basePoints = [];
    let noiseCache = [];

    // Pre-compute noise schedule data for inset chart
    const scheduleSteps = 101;
    let vpSchedule = [], veSchedule = [];
    for (let i = 0; i < scheduleSteps; i++) {
        const t = i / (scheduleSteps - 1);
        vpSchedule.push(Math.exp(-5 * t * t));   // alpha_bar
        veSchedule.push(Math.min(t * t * 3, 1)); // sigma (normalized)
    }

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
    const playBtn = container.querySelector('#viz-forward-play');
    let playAnimId = null;
    let playing = false;

    function draw() {
        const t = (tSlider ? tSlider.value : 0) / 100;
        const mode = modeSelect ? modeSelect.value : 'vp';

        fillCanvasBg(ctx, w, h);
        drawSubtleGrid(ctx, w, h, 40);

        // Ghost outlines of original clusters
        if (t > 0.05) {
            ctx.save();
            ctx.globalAlpha = clamp(t * 0.5, 0, 0.2);
            drawEllipseContour(ctx, w * 0.32, h * 0.4, w * 0.14, h * 0.14,
                VIZ_COLORS.blue, 0.5, true);
            drawEllipseContour(ctx, w * 0.68, h * 0.55, w * 0.16, h * 0.12,
                VIZ_COLORS.red, 0.5, true);
            ctx.restore();
        }

        // Compute & draw noisy positions, collect x-positions for histogram
        const xPositions = [];
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

            xPositions.push(nx);
            const alpha = Math.max(0.2, 1 - t * 0.6);
            const radius = 2.8 + t * 1.5;
            const color = p.cluster === 0 ? VIZ_COLORS.blue : VIZ_COLORS.red;

            ctx.beginPath();
            ctx.arc(nx, ny, radius, 0, Math.PI * 2);
            const grad = ctx.createRadialGradient(nx, ny, 0, nx, ny, radius);
            grad.addColorStop(0, rgba(color, alpha));
            grad.addColorStop(1, rgba(color, alpha * 0.3));
            ctx.fillStyle = grad;
            ctx.fill();
        }

        // Mini marginal distribution histogram at bottom
        if (xPositions.length > 0) {
            drawMiniHistogram(ctx, xPositions, 40, 0, h - 28, w, 22,
                t < 0.5 ? VIZ_COLORS.blue : VIZ_COLORS.purple, false);
        }

        // Labels (plain text, no formula glyphs)
        drawLabel(ctx, 'time  ' + t.toFixed(2), w - 8, 8, 'right', 13);
        drawLabel(ctx, mode === 'vp' ? 'VP (DDPM)' : 'VE (SMLD)', w - 8, 28, 'right', 12);

        // Signal / noise composition (plain text)
        if (mode === 'vp') {
            const ab = Math.exp(-5 * t * t);
            const sigPct = (ab * 100).toFixed(0);
            const nzPct  = ((1 - ab) * 100).toFixed(0);
            drawLabel(ctx, 'signal ' + sigPct + '%   noise ' + nzPct + '%',
                8, 8, 'left', 11, { bg: 'rgba(255,255,255,0.92)', color: '#2d3748' });
        } else {
            const sig = t * t * 3;
            drawLabel(ctx, 'noise level  ' + sig.toFixed(3),
                8, 8, 'left', 11, { bg: 'rgba(255,255,255,0.92)', color: '#2d3748' });
        }

        // Inset noise schedule chart with plain-text title
        const schedule = mode === 'vp' ? vpSchedule : veSchedule;
        const chartTitle = mode === 'vp' ? 'signal scale' : 'noise scale';
        const tIdx = Math.round(t * (scheduleSteps - 1));
        drawInsetChart(ctx, 8, 28, 116, 60, schedule, tIdx,
            mode === 'vp' ? VIZ_COLORS.blue : VIZ_COLORS.purple, chartTitle);

        // SNR indicator for VP mode (plain engineering label)
        if (mode === 'vp') {
            const ab = Math.exp(-5 * t * t);
            const snr = ab / Math.max(1 - ab, 1e-6);
            const snrDb = 10 * Math.log10(Math.max(snr, 1e-6));
            drawLabel(ctx, 'SNR  ' + snrDb.toFixed(1) + ' dB', 8, 92, 'left', 11,
                { bg: 'rgba(255,255,255,0.92)', color: snrDb > 0 ? '#2b6cb0' : '#c53030' });
        }

        // Gradient progress bar
        drawProgressBar(ctx, t, 0, h - 4, w, 4,
            VIZ_COLORS.blue, t < 0.5 ? VIZ_COLORS.blue : VIZ_COLORS.purple);
    }

    // Auto-play functionality
    function playStep() {
        if (!tSlider) return;
        let val = parseInt(tSlider.value) + 1;
        if (val > 100) { val = 100; stopPlay(); return; }
        tSlider.value = val;
        draw();
        if (playing) playAnimId = requestAnimationFrame(playStep);
    }
    function stopPlay() {
        playing = false;
        if (playAnimId) cancelAnimationFrame(playAnimId);
        if (playBtn) playBtn.textContent = '▶ Play';
    }

    if (playBtn) playBtn.addEventListener('click', () => {
        if (playing) { stopPlay(); return; }
        if (tSlider && parseInt(tSlider.value) >= 100) tSlider.value = 0;
        playing = true;
        playBtn.textContent = '⏸ Pause';
        playStep();
    });
    if (tSlider) tSlider.addEventListener('input', () => { stopPlay(); draw(); });
    if (modeSelect) modeSelect.addEventListener('change', draw);
    if (resetBtn) resetBtn.addEventListener('click', () => {
        stopPlay();
        if (tSlider) tSlider.value = 0;
        generatePoints();
        draw();
    });

    function rebuild() {
        const dpr = window.devicePixelRatio || 1;
        const rect = canvas.getBoundingClientRect();
        const cssW = Math.max(1, rect.width);
        const cssH = Math.max(1, rect.height);
        canvas.width  = Math.round(cssW * dpr);
        canvas.height = Math.round(cssH * dpr);
        ctx = canvas.getContext('2d');
        ctx.setTransform(1, 0, 0, 1, 0, 0);
        ctx.scale(dpr, dpr);
        w = cssW; h = cssH;
        generatePoints();
        draw();
    }
    requestAnimationFrame(rebuild);
    observeCanvasResize(canvas, rebuild);
}


// ===== Viz 3: Reverse SDE vs PF ODE =====
// Academic point: PF-ODE solvers (e.g. DPM-Solver, DEIS) reach the same data
// distribution as the reverse SDE with substantially fewer function evaluations.
// We model this by giving SDE 100 NFE and the ODE solver 25 NFE (≈ 4× speed-up);
// in animation time the ODE finishes at ~1/4 of the SDE wall-clock.
function initReverseSampling() {
    const container = document.getElementById('viz-reverse-sampling');
    if (!container) return;
    const canvas = container.querySelector('.viz-canvas');
    if (!canvas) return;

    let w = 0, h = 0, ctx = null, halfW = 0;
    const nParticles = 30;
    const SDE_NFE = 100;     // Stochastic predictor: many small steps
    const ODE_NFE = 25;      // High-order ODE solver: few large steps
    const TOTAL_FRAMES = SDE_NFE;  // Animation timeline (SDE governs wall-clock)
    let sdeTrajs = [], odeTrajs = [];
    let frame = 0;
    let animId = null;
    let running = false;

    let targets = [];
    let targetClusters = [];

    function buildTargets() {
        targets = [];
        for (let i = 0; i < nParticles; i++) {
            const cluster = Math.random() < 0.5;
            const tx = cluster ? halfW * 0.35 : halfW * 0.65;
            const ty = cluster ? h * 0.65 : h * 0.35;
            targets.push(gauss2D(tx, ty, halfW * 0.06, h * 0.06));
        }
        targetClusters = [
            { cx: halfW * 0.35, cy: h * 0.65, rx: halfW * 0.1, ry: h * 0.1 },
            { cx: halfW * 0.65, cy: h * 0.35, rx: halfW * 0.1, ry: h * 0.1 }
        ];
    }

    function generateTrajectories() {
        sdeTrajs = [];
        odeTrajs = [];
        for (let i = 0; i < nParticles; i++) {
            const startX = halfW * 0.1 + Math.random() * halfW * 0.8;
            const startY = h * 0.1 + Math.random() * h * 0.8;
            const endX = targets[i][0], endY = targets[i][1];

            // SDE: many small steps, drift toward target plus injected noise
            const sdePath = [[startX, startY]];
            for (let s = 1; s <= SDE_NFE; s++) {
                const t = s / SDE_NFE;
                const prevX = sdePath[s - 1][0], prevY = sdePath[s - 1][1];
                const drift_x = (endX - prevX) / (SDE_NFE - s + 1);
                const drift_y = (endY - prevY) / (SDE_NFE - s + 1);
                const noiseScale = Math.max(0, (1 - t)) * 8;
                sdePath.push([
                    prevX + drift_x + gaussRandom() * noiseScale,
                    prevY + drift_y + gaussRandom() * noiseScale
                ]);
            }
            sdeTrajs.push(sdePath);

            // PF-ODE: deterministic, far fewer steps; piecewise-Hermite trajectory.
            const odePath = [];
            for (let s = 0; s <= ODE_NFE; s++) {
                const t = s / ODE_NFE;
                const ease = t * t * (3 - 2 * t); // Hermite smoothstep
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

    // Map global animation frame to NFE used by each solver.
    // ODE consumes its full budget over the first (ODE_NFE / SDE_NFE) of the timeline,
    // then freezes — visually demonstrating the wall-clock advantage.
    function odeNFEAt(f) { return Math.min(f, ODE_NFE); }
    function sdeNFEAt(f) { return Math.min(f, SDE_NFE); }

    function computeConvergence(trajs, idx, total) {
        let totalDist = 0;
        for (let i = 0; i < nParticles; i++) {
            const pos = trajs[i][Math.min(idx, total)];
            const dx = pos[0] - targets[i][0], dy = pos[1] - targets[i][1];
            totalDist += Math.sqrt(dx * dx + dy * dy);
        }
        return totalDist / nParticles;
    }

    function draw() {
        fillCanvasBg(ctx, w, h);
        drawSubtleGrid(ctx, w, h, 40);

        const f = Math.min(frame, TOTAL_FRAMES);
        const sdeIdx = sdeNFEAt(f);
        const odeIdx = odeNFEAt(f);
        const odeDone = f >= ODE_NFE;
        const sdeDone = f >= SDE_NFE;
        // Continuous reverse time t goes from T=1 down to 0 in both panels.
        const tSDE = 1 - sdeIdx / SDE_NFE;
        const tODE = 1 - odeIdx / ODE_NFE;

        // Target distribution blobs (fade in as sampling progresses)
        const blobAlphaSDE = clamp(sdeIdx / SDE_NFE * 0.30, 0, 0.30);
        const blobAlphaODE = clamp(odeIdx / ODE_NFE * 0.30, 0, 0.30);
        for (const tc of targetClusters) {
            drawGaussianBlob(ctx, tc.cx, tc.cy, tc.rx, tc.ry, VIZ_COLORS.blue, blobAlphaSDE);
            drawGaussianBlob(ctx, tc.cx + halfW, tc.cy, tc.rx, tc.ry, VIZ_COLORS.teal, blobAlphaODE);
        }

        drawDivider(ctx, halfW, h);

        // Panel headers
        drawLabel(ctx, 'Reverse SDE  (stochastic)',  halfW / 2,         8, 'center', 13);
        drawLabel(ctx, 'PF-ODE  (deterministic)',    halfW + halfW / 2, 8, 'center', 13);

        // Continuous-time indicators (plain text, no formulas)
        drawLabel(ctx,
            'progress  ' + Math.round((1 - tSDE) * 100) + '%',
            halfW / 2, 28, 'center', 11,
            { bg: 'rgba(255,255,255,0.92)', color: '#2d3748' });
        drawLabel(ctx,
            odeDone ? 'reached data (converged)'
                    : 'progress  ' + Math.round((1 - tODE) * 100) + '%',
            halfW + halfW / 2, 28, 'center', 11,
            { bg: 'rgba(255,255,255,0.92)', color: odeDone ? '#0e7c66' : '#2d3748' });

        // ----- SDE trajectories (left half) -----
        for (let i = 0; i < nParticles; i++) {
            const traj = sdeTrajs[i];
            if (sdeIdx > 1) {
                for (let s = 1; s <= sdeIdx; s++) {
                    const progress = s / SDE_NFE;
                    const alpha = 0.04 + 0.28 * (s / sdeIdx);
                    const r = Math.round(lerp(120, 43,  progress));
                    const g = Math.round(lerp(170, 108, progress));
                    const b = Math.round(lerp(225, 176, progress));
                    ctx.beginPath();
                    ctx.moveTo(traj[s - 1][0], traj[s - 1][1]);
                    ctx.lineTo(traj[s][0],     traj[s][1]);
                    ctx.strokeStyle = `rgba(${r}, ${g}, ${b}, ${alpha})`;
                    ctx.lineWidth = 0.5 + 1.0 * progress;
                    ctx.lineCap = 'round';
                    ctx.stroke();
                }
            }
            const pos = traj[sdeIdx];
            drawParticle(ctx, pos[0], pos[1], 3.5, VIZ_COLORS.blue, sdeIdx > SDE_NFE * 0.8);
        }

        // ----- PF-ODE trajectories (right half) -----
        for (let i = 0; i < nParticles; i++) {
            const traj = odeTrajs[i];
            if (odeIdx > 1) {
                for (let s = 1; s <= odeIdx; s++) {
                    const progress = s / ODE_NFE;
                    // Mark each ODE step as a discrete waypoint — large steps are visible
                    const alpha = 0.18 + 0.45 * progress;
                    const r = Math.round(lerp(120, 0,   progress));
                    const g = Math.round(lerp(190, 128, progress));
                    const b = Math.round(lerp(200, 128, progress));
                    ctx.beginPath();
                    ctx.moveTo(traj[s - 1][0] + halfW, traj[s - 1][1]);
                    ctx.lineTo(traj[s][0]     + halfW, traj[s][1]);
                    ctx.strokeStyle = `rgba(${r}, ${g}, ${b}, ${alpha})`;
                    ctx.lineWidth = 1.1 + 1.2 * progress;
                    ctx.lineCap = 'round';
                    ctx.stroke();
                    // Tick mark at each waypoint to emphasise large step sizes
                    ctx.fillStyle = `rgba(${r}, ${g}, ${b}, ${Math.min(alpha + 0.2, 1)})`;
                    ctx.beginPath();
                    ctx.arc(traj[s][0] + halfW, traj[s][1], 1.6, 0, Math.PI * 2);
                    ctx.fill();
                }
            }
            const pos = traj[odeIdx];
            drawParticle(ctx, pos[0] + halfW, pos[1], 3.5, VIZ_COLORS.teal,
                         odeIdx > ODE_NFE * 0.8);
        }

        // ----- Per-panel NFE / convergence panels (top corners) -----
        const sdeConv0 = computeConvergence(sdeTrajs, 0, SDE_NFE);
        const odeConv0 = computeConvergence(odeTrajs, 0, ODE_NFE);
        const sdeConv  = computeConvergence(sdeTrajs, sdeIdx, SDE_NFE);
        const odeConv  = computeConvergence(odeTrajs, odeIdx, ODE_NFE);
        const sdeNorm  = clamp(1 - sdeConv / Math.max(sdeConv0, 1e-6), 0, 1);
        const odeNorm  = clamp(1 - odeConv / Math.max(odeConv0, 1e-6), 0, 1);

        function drawPanelStatus(x0, label, nfeUsed, nfeMax, conv, color, done) {
            const px = x0, py = h - 64, pw = 154, ph = 50;
            ctx.save();
            ctx.fillStyle = 'rgba(255, 255, 255, 0.92)';
            ctx.beginPath(); ctx.roundRect(px, py, pw, ph, 6); ctx.fill();
            ctx.strokeStyle = rgba(color, 0.25);
            ctx.lineWidth = 1;
            ctx.stroke();
            ctx.font = '600 10.5px "Lato", sans-serif';
            ctx.fillStyle = '#4a5568';
            ctx.textAlign = 'left'; ctx.textBaseline = 'top';
            ctx.fillText(label, px + 9, py + 6);
            ctx.font = '700 13px "Fira Code", "Consolas", monospace';
            ctx.fillStyle = done ? rgba(color, 1) : '#2d3748';
            ctx.fillText(`NFE  ${nfeUsed}/${nfeMax}`, px + 9, py + 20);
            // Convergence mini-bar
            drawProgressBar(ctx, conv, px + 9, py + 38, pw - 18, 5, color, color);
            if (done) {
                ctx.font = '700 9px "Lato", sans-serif';
                ctx.fillStyle = rgba(color, 1);
                ctx.textAlign = 'right';
                ctx.fillText('✓ converged', px + pw - 9, py + 6);
            }
            ctx.restore();
        }
        drawPanelStatus(10,            'Reverse SDE', sdeIdx, SDE_NFE, sdeNorm, VIZ_COLORS.blue, sdeDone);
        drawPanelStatus(w - 154 - 10,  'PF-ODE',      odeIdx, ODE_NFE, odeNorm, VIZ_COLORS.teal, odeDone);

        // ----- Speed-up callout (centred bottom) -----
        if (f > 2) {
            ctx.save();
            // Adaptive wording: shorter on narrow canvases so the tag never overflows.
            const tag = w < 640
                ? 'PF-ODE: ' + (SDE_NFE / ODE_NFE) + 'x fewer evaluations'
                : 'PF-ODE reaches data with ' + (SDE_NFE / ODE_NFE) +
                  ' times fewer evaluations   (' + ODE_NFE + ' vs ' + SDE_NFE + ')';
            ctx.font = '600 10.5px "Lato", sans-serif';
            const metrics = ctx.measureText(tag);
            const tw = metrics.width + 18, th = 22;
            const tx = (w - tw) / 2, ty = h - 30;
            ctx.fillStyle = 'rgba(30, 30, 46, 0.78)';
            ctx.beginPath(); ctx.roundRect(tx, ty, tw, th, 11); ctx.fill();
            ctx.fillStyle = 'rgba(255, 255, 255, 0.95)';
            ctx.textAlign = 'left'; ctx.textBaseline = 'middle';
            ctx.fillText(tag, tx + 9, ty + th / 2);
            ctx.restore();
        }

        // Bottom progress bars (separate per panel — ODE finishes early)
        drawProgressBar(ctx, sdeIdx / SDE_NFE, 0,     h - 4, halfW, 4, VIZ_COLORS.blue, VIZ_COLORS.blue);
        drawProgressBar(ctx, odeIdx / ODE_NFE, halfW, h - 4, halfW, 4, VIZ_COLORS.teal, VIZ_COLORS.teal);
    }

    function animate() {
        const speed = speedSlider ? parseInt(speedSlider.value) : 1;
        frame += speed;
        if (frame > TOTAL_FRAMES) { frame = TOTAL_FRAMES; running = false; }
        draw();
        if (running) animId = requestAnimationFrame(animate);
    }

    if (startBtn) startBtn.addEventListener('click', () => {
        if (running) { running = false; if (animId) cancelAnimationFrame(animId); return; }
        if (frame >= TOTAL_FRAMES) { frame = 0; generateTrajectories(); }
        running = true;
        animate();
    });
    if (resetBtn) resetBtn.addEventListener('click', () => {
        running = false;
        if (animId) cancelAnimationFrame(animId);
        frame = 0;
        generateTrajectories();
        draw();
    });

    function rebuild() {
        const dpr = window.devicePixelRatio || 1;
        const rect = canvas.getBoundingClientRect();
        const cssW = Math.max(2, rect.width);
        const cssH = Math.max(1, rect.height);
        canvas.width  = Math.round(cssW * dpr);
        canvas.height = Math.round(cssH * dpr);
        ctx = canvas.getContext('2d');
        ctx.setTransform(1, 0, 0, 1, 0, 0);
        ctx.scale(dpr, dpr);
        w = cssW; h = cssH; halfW = w / 2;
        if (running) { running = false; if (animId) cancelAnimationFrame(animId); }
        frame = 0;
        buildTargets();
        generateTrajectories();
        draw();
    }
    requestAnimationFrame(rebuild);
    observeCanvasResize(canvas, rebuild);
}


// ===== Viz 4: Guidance Strength =====
function initGuidance() {
    const container = document.getElementById('viz-guidance');
    if (!container) return;
    const canvas = container.querySelector('.viz-canvas');
    if (!canvas) return;

    let w = 0, h = 0, ctx = null;
    let priorMx = 0, priorMy = 0, priorSx = 0, priorSy = 0, measX = 0;

    const gammaSlider = container.querySelector('#viz-guidance-gamma');
    const gammaVal = container.querySelector('#viz-guidance-gamma-val');
    const resetBtn = container.querySelector('#viz-guidance-reset');

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

        // --- Posterior density heatmap (subtle) ---
        const resolution = 4;
        for (let px = 0; px < w; px += resolution) {
            for (let py = 0; py < h; py += resolution) {
                const dx = (px - priorMx) / priorSx, dy = (py - priorMy) / priorSy;
                const prior = Math.exp(-0.5 * (dx * dx + dy * dy));
                const likelihood = Math.exp(-gamma * ((px - measX) * (px - measX)) / (w * w * 0.01));
                const posterior = prior * likelihood;
                const t = Math.pow(Math.min(posterior, 1), 0.35);
                if (t > 0.01) {
                    const r = Math.round(41 + t * 100);
                    const g = Math.round(128 - t * 60);
                    const b = Math.round(185 + t * 40);
                    ctx.fillStyle = `rgba(${r}, ${g}, ${b}, ${t * 0.18})`;
                    ctx.fillRect(px, py, resolution, resolution);
                }
            }
        }

        // --- Prior distribution contour (dashed) ---
        drawEllipseContour(ctx, priorMx, priorMy, priorSx * 2, priorSy * 2,
            VIZ_COLORS.blue, 0.35, true);
        drawEllipseContour(ctx, priorMx, priorMy, priorSx * 3, priorSy * 3,
            VIZ_COLORS.blue, 0.18, true);

        // --- Posterior contour (solid, shifts with gamma) ---
        const postMx = priorMx + (measX - priorMx) * gamma / (gamma + 1);
        const postSx = priorSx / Math.sqrt(1 + gamma * 0.8);
        drawEllipseContour(ctx, postMx, priorMy, postSx * 2, priorSy * 2,
            VIZ_COLORS.purple, 0.45, false);

        // --- Likelihood gradient near measurement ---
        ctx.save();
        const likGrad = ctx.createLinearGradient(measX - w * 0.1, 0, measX + w * 0.1, 0);
        const likAlpha = clamp(gamma * 0.06, 0, 0.15);
        likGrad.addColorStop(0, `rgba(197, 48, 48, 0)`);
        likGrad.addColorStop(0.5, `rgba(197, 48, 48, ${likAlpha})`);
        likGrad.addColorStop(1, `rgba(197, 48, 48, 0)`);
        ctx.fillStyle = likGrad;
        ctx.fillRect(measX - w * 0.1, 0, w * 0.2, h);
        ctx.restore();

        // Measurement constraint line with glow
        ctx.save();
        ctx.shadowColor = rgba(VIZ_COLORS.red, 0.35);
        ctx.shadowBlur = 10;
        ctx.strokeStyle = rgba(VIZ_COLORS.red, 0.6);
        ctx.lineWidth = 2;
        ctx.setLineDash([8, 5]);
        ctx.beginPath(); ctx.moveTo(measX, 15); ctx.lineTo(measX, h - 15); ctx.stroke();
        ctx.setLineDash([]);
        ctx.restore();

        // --- Guided samples with smooth color transition ---
        for (const [bx, by] of baseSamples) {
            const shift = gamma / (gamma + 1);
            const gx = bx + (measX - bx) * shift;
            const gy = by * (1 - shift * 0.1) + h * 0.5 * shift * 0.1;

            // Color from blue (prior) → purple (mid) → red (strong guidance)
            const colorMix = Math.min(gamma / 5, 1);
            const r = Math.round(lerp(43, 170, colorMix));
            const g = Math.round(lerp(108, 45, colorMix));
            const b = Math.round(lerp(176, 120, colorMix));

            ctx.beginPath();
            ctx.arc(gx, gy, 3, 0, Math.PI * 2);
            const sGrad = ctx.createRadialGradient(gx, gy, 0, gx, gy, 3);
            sGrad.addColorStop(0, `rgba(${r}, ${g}, ${b}, 0.7)`);
            sGrad.addColorStop(1, `rgba(${r}, ${g}, ${b}, 0.25)`);
            ctx.fillStyle = sGrad;
            ctx.fill();
        }

        // --- Labels and annotations (plain text, no formulas on canvas) ---
        drawLabel(ctx, 'guidance strength  ' + gamma.toFixed(1), 8, 8, 'left', 14,
            { bold: true, color: '#2d3748' });

        // Plain-language summary at the bottom (no LaTeX in canvas)
        drawLabel(ctx,
            gamma < 0.3  ? 'no guidance — samples follow the prior'
          : gamma < 1.5  ? 'mild guidance — samples bend toward the signal'
          : gamma < 3.5  ? 'strong guidance — posterior dominates the prior'
                         : 'extreme guidance — samples collapse near the signal',
            w / 2 - 6, h - 26, 'center', 11,
            { bg: 'rgba(255,255,255,0.92)', color: '#2d3748' });

        // Legend
        ctx.save();
        ctx.fillStyle = 'rgba(255, 255, 255, 0.92)';
        ctx.beginPath(); ctx.roundRect(8, 32, 158, 70, 6); ctx.fill();
        ctx.strokeStyle = 'rgba(0, 0, 0, 0.08)'; ctx.lineWidth = 0.8; ctx.stroke();
        ctx.font = '500 10.5px "Lato", sans-serif'; ctx.textBaseline = 'middle';
        // Prior
        ctx.setLineDash([4, 3]); ctx.strokeStyle = rgba(VIZ_COLORS.blue, 0.55);
        ctx.lineWidth = 1.5;
        ctx.beginPath(); ctx.moveTo(18, 48); ctx.lineTo(40, 48); ctx.stroke();
        ctx.setLineDash([]);
        ctx.fillStyle = '#4a5568'; ctx.textAlign = 'left';
        ctx.fillText('prior (unconditional)', 46, 48);
        // Posterior
        ctx.strokeStyle = rgba(VIZ_COLORS.purple, 0.65);
        ctx.beginPath(); ctx.moveTo(18, 66); ctx.lineTo(40, 66); ctx.stroke();
        ctx.fillText('posterior (guided)', 46, 66);
        // Conditioning signal
        ctx.setLineDash([4, 3]); ctx.strokeStyle = rgba(VIZ_COLORS.red, 0.65);
        ctx.beginPath(); ctx.moveTo(18, 84); ctx.lineTo(40, 84); ctx.stroke();
        ctx.setLineDash([]);
        ctx.fillText('conditioning signal', 46, 84);
        ctx.restore();

        drawLabel(ctx, 'conditioning signal', measX + 8, 10, 'left', 11,
            { color: '#c53030' });
    }

    if (gammaSlider) gammaSlider.addEventListener('input', draw);
    if (resetBtn) resetBtn.addEventListener('click', () => {
        if (gammaSlider) gammaSlider.value = 10;
        generateSamples();
        draw();
    });

    function rebuild() {
        const dpr = window.devicePixelRatio || 1;
        const rect = canvas.getBoundingClientRect();
        const cssW = Math.max(1, rect.width);
        const cssH = Math.max(1, rect.height);
        canvas.width  = Math.round(cssW * dpr);
        canvas.height = Math.round(cssH * dpr);
        ctx = canvas.getContext('2d');
        ctx.setTransform(1, 0, 0, 1, 0, 0);
        ctx.scale(dpr, dpr);
        w = cssW; h = cssH;
        priorMx = w * 0.38; priorMy = h * 0.5;
        priorSx = w * 0.13; priorSy = h * 0.14;
        measX   = w * 0.68;
        generateSamples();
        draw();
    }
    requestAnimationFrame(rebuild);
    observeCanvasResize(canvas, rebuild);
}


// ===== Viz 5: Flow Matching vs Diffusion Paths =====
// Academic point: flow matching learns straight conditional paths, which means
// a small number of Euler steps already integrate the velocity field accurately.
// We give diffusion 100 NFE and flow matching 10 NFE (~10× fewer evaluations),
// and let the FM panel finish in ~1/10 of the animation timeline.
function initFlowVsDiffusion() {
    const container = document.getElementById('viz-flow-vs-diffusion');
    if (!container) return;
    const canvas = container.querySelector('.viz-canvas');
    if (!canvas) return;

    let w = 0, h = 0, ctx = null, halfW = 0;
    const nPairs = 20;
    const DIFF_NFE = 100;
    const FM_NFE   = 10;     // Few-step Euler is enough for straight FM paths
    const TOTAL_FRAMES = DIFF_NFE;
    let diffPaths = [], flowPaths = [];
    let frame = 0;
    let animId = null;
    let running = false;

    let sourceRegion = null;
    let targetClusters = [];
    function buildRegions() {
        sourceRegion = { cx: halfW * 0.5, cy: h * 0.2, rx: halfW * 0.3, ry: h * 0.08 };
        targetClusters = [
            { cx: halfW * 0.3, cy: h * 0.72, rx: halfW * 0.1, ry: h * 0.06 },
            { cx: halfW * 0.7, cy: h * 0.76, rx: halfW * 0.1, ry: h * 0.06 }
        ];
    }

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

            // Diffusion: curved noisy path with many small steps
            const dPath = [[sx, sy]];
            for (let s = 1; s <= DIFF_NFE; s++) {
                const t = s / DIFF_NFE;
                const prev = dPath[s - 1];
                const drift_x = (tex - prev[0]) / (DIFF_NFE - s + 1);
                const drift_y = (tey - prev[1]) / (DIFF_NFE - s + 1);
                const curveScale = Math.sin(t * Math.PI) * 15;
                dPath.push([
                    prev[0] + drift_x + gaussRandom() * curveScale * 0.5
                            + Math.sin(t * 4 + i) * curveScale * 0.3,
                    prev[1] + drift_y + gaussRandom() * curveScale * 0.3
                ]);
            }
            diffPaths.push(dPath);

            // Flow matching: straight conditional path with very few steps
            const fPath = [];
            for (let s = 0; s <= FM_NFE; s++) {
                const t = s / FM_NFE;
                fPath.push([sx + (tex - sx) * t, sy + (tey - sy) * t]);
            }
            flowPaths.push(fPath);
        }
    }

    const startBtn = container.querySelector('#viz-flow-start');
    const speedSlider = container.querySelector('#viz-flow-speed');
    const resetBtn = container.querySelector('#viz-flow-reset');

    function diffNFEAt(f) { return Math.min(f, DIFF_NFE); }
    function fmNFEAt(f)   { return Math.min(f, FM_NFE); }

    function computeTotalPathLength(paths, upToIdx, total) {
        let totalL = 0;
        const maxS = Math.min(upToIdx, total);
        for (const path of paths) {
            for (let s = 1; s <= maxS; s++) {
                const dx = path[s][0] - path[s - 1][0];
                const dy = path[s][1] - path[s - 1][1];
                totalL += Math.sqrt(dx * dx + dy * dy);
            }
        }
        return totalL;
    }

    function draw() {
        fillCanvasBg(ctx, w, h);
        drawSubtleGrid(ctx, w, h, 40);
        drawDivider(ctx, halfW, h);

        const f = Math.min(frame, TOTAL_FRAMES);
        const diffIdx = diffNFEAt(f);
        const fmIdx   = fmNFEAt(f);
        const diffProg = diffIdx / DIFF_NFE;
        const fmProg   = fmIdx   / FM_NFE;
        const fmDone   = f >= FM_NFE;
        const diffDone = f >= DIFF_NFE;

        // Source region (noise) — fades out as integration progresses
        if (diffProg < 0.3 || fmProg < 0.3) {
            const fadeDiff = clamp(1 - diffProg / 0.3, 0, 0.18);
            const fadeFM   = clamp(1 - fmProg   / 0.3, 0, 0.18);
            drawEllipseContour(ctx, sourceRegion.cx, sourceRegion.cy,
                sourceRegion.rx, sourceRegion.ry, VIZ_COLORS.blue,  fadeDiff, true);
            drawEllipseContour(ctx, sourceRegion.cx + halfW, sourceRegion.cy,
                sourceRegion.rx, sourceRegion.ry, VIZ_COLORS.green, fadeFM,   true);
        }
        // Target regions (data) — fade in independently per panel
        {
            const blobDiff = clamp((diffProg - 0.3) * 0.3, 0, 0.22);
            const blobFM   = clamp((fmProg   - 0.3) * 0.3, 0, 0.22);
            for (const tc of targetClusters) {
                drawGaussianBlob(ctx, tc.cx,         tc.cy, tc.rx, tc.ry, VIZ_COLORS.blue,  blobDiff);
                drawGaussianBlob(ctx, tc.cx + halfW, tc.cy, tc.rx, tc.ry, VIZ_COLORS.green, blobFM);
            }
        }

        // Panel headers
        drawLabel(ctx, 'Score-based Diffusion', halfW / 2,         8, 'center', 13);
        drawLabel(ctx, 'Flow Matching (straight paths)', halfW + halfW / 2, 8, 'center', 13);

        // ----- Diffusion paths (left) -----
        for (let i = 0; i < nPairs; i++) {
            const path = diffPaths[i];
            if (diffIdx > 0) {
                for (let s = 1; s <= diffIdx; s++) {
                    const progress = s / DIFF_NFE;
                    const alpha = 0.04 + 0.32 * (s / diffIdx);
                    const r = Math.round(lerp(120, 43,  progress));
                    const g = Math.round(lerp(170, 108, progress));
                    const b = Math.round(lerp(230, 176, progress));
                    ctx.beginPath();
                    ctx.moveTo(path[s - 1][0], path[s - 1][1]);
                    ctx.lineTo(path[s][0],     path[s][1]);
                    ctx.strokeStyle = `rgba(${r}, ${g}, ${b}, ${alpha})`;
                    ctx.lineWidth = 0.5 + 0.8 * progress;
                    ctx.lineCap = 'round';
                    ctx.stroke();
                }
            }
            const pos = path[diffIdx];
            drawParticle(ctx, pos[0], pos[1], 3.5, VIZ_COLORS.blue, diffProg > 0.8);
        }

        // ----- Flow matching paths (right) -----
        for (let i = 0; i < nPairs; i++) {
            const path = flowPaths[i];
            if (fmIdx > 0) {
                for (let s = 1; s <= fmIdx; s++) {
                    const progress = s / FM_NFE;
                    const alpha = 0.2 + 0.5 * progress;
                    const r = Math.round(lerp(110, 34,  progress));
                    const g = Math.round(lerp(195, 139, progress));
                    const b = Math.round(lerp(155, 94,  progress));
                    ctx.beginPath();
                    ctx.moveTo(path[s - 1][0] + halfW, path[s - 1][1]);
                    ctx.lineTo(path[s][0]     + halfW, path[s][1]);
                    ctx.strokeStyle = `rgba(${r}, ${g}, ${b}, ${alpha})`;
                    ctx.lineWidth = 1.0 + 1.2 * progress;
                    ctx.lineCap = 'round';
                    ctx.stroke();
                    // Waypoint marker — emphasises the few-step nature of Euler-FM
                    ctx.fillStyle = `rgba(${r}, ${g}, ${b}, ${Math.min(alpha + 0.25, 1)})`;
                    ctx.beginPath();
                    ctx.arc(path[s][0] + halfW, path[s][1], 1.7, 0, Math.PI * 2);
                    ctx.fill();
                }
            }
            const pos = path[fmIdx];
            drawParticle(ctx, pos[0] + halfW, pos[1], 3.5, VIZ_COLORS.green, fmProg > 0.8);
        }

        // Source / target labels (plain text, no Greek-letter measures on canvas)
        if (diffProg < 0.15 || fmProg < 0.15) {
            drawLabel(ctx, 'noise (source)', halfW / 2,         h * 0.2 - 20, 'center', 11,
                { bg: 'rgba(255,255,255,0.9)', color: '#718096' });
            drawLabel(ctx, 'noise (source)', halfW + halfW / 2, h * 0.2 - 20, 'center', 11,
                { bg: 'rgba(255,255,255,0.9)', color: '#718096' });
        }
        if (diffProg > 0.85 || fmProg > 0.85) {
            drawLabel(ctx, 'data (target)', halfW / 2,         h * 0.7 + 15, 'center', 11,
                { bg: 'rgba(255,255,255,0.9)', color: '#718096' });
            drawLabel(ctx, 'data (target)', halfW + halfW / 2, h * 0.7 + 15, 'center', 11,
                { bg: 'rgba(255,255,255,0.9)', color: '#718096' });
        }

        // ----- Per-panel NFE / transport-cost panels (top corners) -----
        const diffCost = computeTotalPathLength(diffPaths, diffIdx, DIFF_NFE);
        const flowCost = computeTotalPathLength(flowPaths, fmIdx,   FM_NFE);

        function drawFlowPanelStatus(x0, label, nfeUsed, nfeMax, cost, color, done) {
            const px = x0, py = h - 64, pw = 168, ph = 50;
            ctx.save();
            ctx.fillStyle = 'rgba(255, 255, 255, 0.92)';
            ctx.beginPath(); ctx.roundRect(px, py, pw, ph, 6); ctx.fill();
            ctx.strokeStyle = rgba(color, 0.25);
            ctx.lineWidth = 1; ctx.stroke();
            ctx.font = '600 10.5px "Lato", sans-serif';
            ctx.fillStyle = '#4a5568';
            ctx.textAlign = 'left'; ctx.textBaseline = 'top';
            ctx.fillText(label, px + 9, py + 6);
            ctx.font = '700 13px "Fira Code", "Consolas", monospace';
            ctx.fillStyle = done ? rgba(color, 1) : '#2d3748';
            ctx.fillText(`NFE  ${nfeUsed}/${nfeMax}`, px + 9, py + 20);
            ctx.font = '500 10px "Lato", sans-serif';
            ctx.fillStyle = '#718096';
            ctx.fillText('transport cost: ' + cost.toFixed(0), px + 9, py + 38);
            if (done) {
                ctx.font = '700 9px "Lato", sans-serif';
                ctx.fillStyle = rgba(color, 1);
                ctx.textAlign = 'right';
                ctx.fillText('✓ converged', px + pw - 9, py + 6);
            }
            ctx.restore();
        }
        drawFlowPanelStatus(10,           'Diffusion Sampling', diffIdx, DIFF_NFE, diffCost, VIZ_COLORS.blue,  diffDone);
        drawFlowPanelStatus(w - 168 - 10, 'Flow Matching',      fmIdx,   FM_NFE,   flowCost, VIZ_COLORS.green, fmDone);

        // ----- Speed-up callout (centred bottom) -----
        if (f > 2) {
            const tag = w < 640
                ? 'Flow Matching: ' + (DIFF_NFE / FM_NFE) + 'x fewer evaluations'
                : 'Flow Matching reaches data with ' + (DIFF_NFE / FM_NFE) +
                  ' times fewer evaluations   (' + FM_NFE + ' vs ' + DIFF_NFE + ')';
            ctx.save();
            ctx.font = '600 10.5px "Lato", sans-serif';
            const metrics = ctx.measureText(tag);
            const tw = metrics.width + 18, th = 22;
            const tx = (w - tw) / 2, ty = h - 30;
            ctx.fillStyle = 'rgba(30, 30, 46, 0.78)';
            ctx.beginPath(); ctx.roundRect(tx, ty, tw, th, 11); ctx.fill();
            ctx.fillStyle = 'rgba(255, 255, 255, 0.95)';
            ctx.textAlign = 'left'; ctx.textBaseline = 'middle';
            ctx.fillText(tag, tx + 9, ty + th / 2);
            ctx.restore();
        }

        // Bottom progress bars (independent per panel — FM finishes early)
        drawProgressBar(ctx, diffProg, 0,     h - 4, halfW, 4, VIZ_COLORS.blue,  VIZ_COLORS.blue);
        drawProgressBar(ctx, fmProg,   halfW, h - 4, halfW, 4, VIZ_COLORS.green, VIZ_COLORS.green);
    }

    function animate() {
        const speed = speedSlider ? parseInt(speedSlider.value) : 1;
        frame += speed;
        if (frame > TOTAL_FRAMES) { frame = TOTAL_FRAMES; running = false; }
        draw();
        if (running) animId = requestAnimationFrame(animate);
    }

    if (startBtn) startBtn.addEventListener('click', () => {
        if (running) { running = false; if (animId) cancelAnimationFrame(animId); return; }
        if (frame >= TOTAL_FRAMES) { frame = 0; generatePaths(); }
        running = true;
        animate();
    });
    if (resetBtn) resetBtn.addEventListener('click', () => {
        running = false;
        if (animId) cancelAnimationFrame(animId);
        frame = 0;
        generatePaths();
        draw();
    });

    function rebuild() {
        const dpr = window.devicePixelRatio || 1;
        const rect = canvas.getBoundingClientRect();
        const cssW = Math.max(2, rect.width);
        const cssH = Math.max(1, rect.height);
        canvas.width  = Math.round(cssW * dpr);
        canvas.height = Math.round(cssH * dpr);
        ctx = canvas.getContext('2d');
        ctx.setTransform(1, 0, 0, 1, 0, 0);
        ctx.scale(dpr, dpr);
        w = cssW; h = cssH; halfW = w / 2;
        if (running) { running = false; if (animId) cancelAnimationFrame(animId); }
        frame = 0;
        buildRegions();
        generatePaths();
        draw();
    }
    requestAnimationFrame(rebuild);
    observeCanvasResize(canvas, rebuild);
}
