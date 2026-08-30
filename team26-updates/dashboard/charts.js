/**
 * VitalSync Launch Performance Dashboard — Chart Module
 * 
 * Chart.js 기반 시각화 컴포넌트.
 * Looker 대시보드 스타일을 재현하며, 다크모드 자동 대응.
 */

const VitalSyncCharts = (() => {
    'use strict';

    const chartInstances = {};

    // ===== Theme-Aware Colors =====
    function getThemeColors() {
        const isDark = document.body.classList.contains('dark');
        return {
            text: isDark ? '#e2e8f0' : '#334155',
            textSecondary: isDark ? '#94a3b8' : '#64748b',
            grid: isDark ? 'rgba(148,163,184,0.1)' : 'rgba(0,0,0,0.06)',
            tooltipBg: isDark ? '#1e293b' : '#ffffff',
            tooltipBorder: isDark ? '#334155' : '#e2e8f0',
            tooltipText: isDark ? '#f1f5f9' : '#1e293b',
        };
    }

    // ===== Common Chart Options =====
    function baseOptions(overrides = {}) {
        const t = getThemeColors();
        return {
            responsive: true,
            maintainAspectRatio: false,
            interaction: {
                mode: 'index',
                intersect: false,
            },
            plugins: {
                legend: {
                    display: overrides.showLegend !== false,
                    position: 'top',
                    align: 'end',
                    labels: {
                        color: t.textSecondary,
                        font: { family: 'Inter', size: 11, weight: 500 },
                        usePointStyle: true,
                        pointStyle: 'circle',
                        padding: 16,
                        boxWidth: 6,
                    }
                },
                tooltip: {
                    backgroundColor: t.tooltipBg,
                    titleColor: t.tooltipText,
                    bodyColor: t.tooltipText,
                    borderColor: t.tooltipBorder,
                    borderWidth: 1,
                    cornerRadius: 8,
                    padding: 12,
                    titleFont: { family: 'Inter', size: 12, weight: 600 },
                    bodyFont: { family: 'Inter', size: 11 },
                    displayColors: true,
                    boxWidth: 8,
                    boxHeight: 8,
                    boxPadding: 4,
                    usePointStyle: true,
                    callbacks: overrides.tooltipCallbacks || {}
                }
            },
            scales: overrides.hideScales ? {} : {
                x: {
                    grid: { display: false },
                    ticks: {
                        color: t.textSecondary,
                        font: { family: 'Inter', size: 10 },
                        maxRotation: 0,
                    },
                    border: { display: false }
                },
                y: {
                    grid: { color: t.grid },
                    ticks: {
                        color: t.textSecondary,
                        font: { family: 'Inter', size: 10 },
                        callback: overrides.yTickCallback || undefined,
                    },
                    border: { display: false },
                    beginAtZero: overrides.beginAtZero !== false,
                }
            },
            ...overrides.extra
        };
    }

    // ===== Helper: Destroy existing chart =====
    function getOrCreate(canvasId) {
        if (chartInstances[canvasId]) {
            chartInstances[canvasId].destroy();
        }
        const ctx = document.getElementById(canvasId);
        if (!ctx) return null;
        return ctx.getContext('2d');
    }

    // ===== Chart: Daily Downloads (Line) =====
    function renderDailyDownloads(data) {
        const ctx = getOrCreate('chartDownloads');
        if (!ctx) return;

        const shortDates = data.dates.map(d => {
            const dt = new Date(d);
            return `${dt.getMonth()+1}/${dt.getDate()}`;
        });

        chartInstances['chartDownloads'] = new Chart(ctx, {
            type: 'line',
            data: {
                labels: shortDates,
                datasets: [
                    {
                        label: '유기적',
                        data: data.organic,
                        borderColor: '#10b981',
                        backgroundColor: 'rgba(16,185,129,0.08)',
                        fill: true,
                        tension: 0.4,
                        borderWidth: 2,
                        pointRadius: 0,
                        pointHoverRadius: 4,
                    },
                    {
                        label: '유료 광고',
                        data: data.paid,
                        borderColor: '#4f46e5',
                        backgroundColor: 'rgba(79,70,229,0.08)',
                        fill: true,
                        tension: 0.4,
                        borderWidth: 2,
                        pointRadius: 0,
                        pointHoverRadius: 4,
                    },
                    {
                        label: '파트너십',
                        data: data.partner,
                        borderColor: '#f59e0b',
                        backgroundColor: 'rgba(245,158,11,0.08)',
                        fill: true,
                        tension: 0.4,
                        borderWidth: 2,
                        pointRadius: 0,
                        pointHoverRadius: 4,
                    }
                ]
            },
            options: baseOptions({
                yTickCallback: (v) => VitalSyncData.formatNumber(v),
                tooltipCallbacks: {
                    label: (ctx) => `${ctx.dataset.label}: ${VitalSyncData.formatNumber(ctx.raw)}`
                }
            })
        });
    }

    // ===== Chart: Plan Distribution (Doughnut) =====
    function renderPlanDistribution(data) {
        const ctx = getOrCreate('chartPlans');
        if (!ctx) return;

        chartInstances['chartPlans'] = new Chart(ctx, {
            type: 'doughnut',
            data: {
                labels: data.labels,
                datasets: [{
                    data: data.values,
                    backgroundColor: data.colors,
                    borderWidth: 0,
                    hoverOffset: 8,
                }]
            },
            options: baseOptions({
                hideScales: true,
                showLegend: true,
                tooltipCallbacks: {
                    label: (ctx) => {
                        const total = ctx.dataset.data.reduce((a,b) => a+b, 0);
                        const pct = ((ctx.raw / total) * 100).toFixed(1);
                        return `${ctx.label}: ${VitalSyncData.formatNumber(ctx.raw)} (${pct}%)`;
                    }
                },
                extra: {
                    cutout: '65%',
                    plugins: {
                        legend: {
                            position: 'bottom',
                            labels: {
                                color: getThemeColors().textSecondary,
                                font: { family: 'Inter', size: 11, weight: 500 },
                                usePointStyle: true,
                                pointStyle: 'circle',
                                padding: 16,
                                boxWidth: 8,
                            }
                        }
                    }
                }
            })
        });
    }

    // ===== Chart: Retention Curve (Line) =====
    function renderRetentionCurve(data) {
        const ctx = getOrCreate('chartRetention');
        if (!ctx) return;

        const colors = ['#4f46e5', '#7c3aed', '#3b82f6', '#10b981'];
        const datasets = Object.entries(data.cohorts).map(([name, values], i) => ({
            label: name,
            data: values,
            borderColor: colors[i],
            backgroundColor: 'transparent',
            tension: 0.3,
            borderWidth: 2,
            pointRadius: 3,
            pointHoverRadius: 5,
            pointBackgroundColor: colors[i],
        }));

        chartInstances['chartRetention'] = new Chart(ctx, {
            type: 'line',
            data: { labels: data.days, datasets },
            options: baseOptions({
                yTickCallback: (v) => v + '%',
                tooltipCallbacks: {
                    label: (ctx) => `${ctx.dataset.label}: ${ctx.raw}%`
                }
            })
        });
    }

    // ===== Chart: Channel CAC (Bar) =====
    function renderChannelCAC(data) {
        const ctx = getOrCreate('chartCAC');
        if (!ctx) return;

        const colors = data.map(ch => ch.cac <= 1.0 ? '#10b981' : ch.cac <= 1.5 ? '#f59e0b' : '#ef4444');

        chartInstances['chartCAC'] = new Chart(ctx, {
            type: 'bar',
            data: {
                labels: data.map(ch => ch.name.replace(/\(.*\)/, '').trim()),
                datasets: [{
                    label: 'CAC ($)',
                    data: data.map(ch => Math.round(ch.cac * 100) / 100),
                    backgroundColor: colors,
                    borderRadius: 6,
                    borderSkipped: false,
                    barThickness: 32,
                }]
            },
            options: baseOptions({
                showLegend: false,
                yTickCallback: (v) => '$' + v.toFixed(2),
                tooltipCallbacks: {
                    label: (ctx) => `CAC: $${ctx.raw.toFixed(2)}`
                },
                extra: {
                    plugins: {
                        annotation: {
                            annotations: {
                                targetLine: {
                                    type: 'line',
                                    yMin: 1.5,
                                    yMax: 1.5,
                                    borderColor: '#ef4444',
                                    borderDash: [6, 4],
                                    borderWidth: 1.5,
                                    label: {
                                        display: true,
                                        content: '목표: $1.50',
                                        position: 'end',
                                    }
                                }
                            }
                        }
                    }
                }
            })
        });
    }

    // ===== Chart: NPS Trend (Line + Bar combo) =====
    function renderNPSTrend(data) {
        const ctx = getOrCreate('chartNPS');
        if (!ctx) return;

        chartInstances['chartNPS'] = new Chart(ctx, {
            type: 'line',
            data: {
                labels: data.labels,
                datasets: [{
                    label: 'NPS 점수',
                    data: data.scores,
                    borderColor: '#f59e0b',
                    backgroundColor: 'rgba(245,158,11,0.1)',
                    fill: true,
                    tension: 0.4,
                    borderWidth: 2.5,
                    pointRadius: 3,
                    pointBackgroundColor: '#f59e0b',
                    pointHoverRadius: 5,
                }]
            },
            options: baseOptions({
                tooltipCallbacks: {
                    label: (ctx) => `NPS: ${ctx.raw}`
                },
                extra: {
                    scales: {
                        x: {
                            grid: { display: false },
                            ticks: { color: getThemeColors().textSecondary, font: { family: 'Inter', size: 10 } },
                            border: { display: false }
                        },
                        y: {
                            grid: { color: getThemeColors().grid },
                            ticks: { color: getThemeColors().textSecondary, font: { family: 'Inter', size: 10 } },
                            border: { display: false },
                            min: 20,
                            max: 70,
                        }
                    }
                }
            })
        });
    }

    // ===== Funnel (DOM-based) =====
    function renderFunnel(data) {
        const container = document.getElementById('funnelChart');
        if (!container) return;
        container.innerHTML = '';

        const maxVal = data[0].value;
        data.forEach((step, i) => {
            const pct = (step.value / maxVal) * 100;
            const widthPct = Math.max(30, pct);
            const rate = i > 0 ? ((step.value / data[i-1].value) * 100).toFixed(1) + '%' : '100%';

            const el = document.createElement('div');
            el.className = 'funnel-step';
            el.style.width = widthPct + '%';
            el.style.margin = '0 auto';
            el.style.backgroundColor = step.color;
            el.innerHTML = `
                <span>${step.label}</span>
                <span class="funnel-value">${VitalSyncData.formatNumber(step.value)}</span>
                <span class="funnel-rate">전환율: ${rate}</span>
            `;
            container.appendChild(el);
        });
    }

    // ===== Acquisition: Channel Downloads Stacked Area =====
    function renderChannelDownloads(data) {
        const ctx = getOrCreate('chartChannelDownloads');
        if (!ctx) return;

        const colors = {
            performance: '#4f46e5',
            social: '#7c3aed',
            aso: '#10b981',
            content: '#3b82f6',
            partners: '#f59e0b',
            email: '#94a3b8'
        };

        const shortDates = data.dates.map(d => {
            const dt = new Date(d);
            return `${dt.getMonth()+1}/${dt.getDate()}`;
        });

        const datasets = Object.entries(data.channelData).map(([id, values]) => {
            const ch = VitalSyncData.CONFIG.channels.find(c => c.id === id);
            return {
                label: ch ? ch.name.replace(/\(.*\)/, '').trim() : id,
                data: values,
                borderColor: colors[id] || '#94a3b8',
                backgroundColor: (colors[id] || '#94a3b8') + '18',
                fill: true,
                tension: 0.4,
                borderWidth: 1.5,
                pointRadius: 0,
            };
        });

        chartInstances['chartChannelDownloads'] = new Chart(ctx, {
            type: 'line',
            data: { labels: shortDates, datasets },
            options: baseOptions({
                yTickCallback: (v) => VitalSyncData.formatNumber(v),
            })
        });
    }

    // ===== Acquisition: Geo Downloads (Horizontal Bar) =====
    function renderGeoDownloads(data) {
        const ctx = getOrCreate('chartGeoDownloads');
        if (!ctx) return;

        chartInstances['chartGeoDownloads'] = new Chart(ctx, {
            type: 'bar',
            data: {
                labels: data.labels,
                datasets: [{
                    label: '다운로드',
                    data: data.values,
                    backgroundColor: data.colors,
                    borderRadius: 6,
                    borderSkipped: false,
                }]
            },
            options: baseOptions({
                showLegend: false,
                yTickCallback: (v) => VitalSyncData.formatNumber(v),
                extra: { indexAxis: 'y' }
            })
        });
    }

    // ===== Acquisition: CPI Trend =====
    function renderCPITrend(data) {
        const ctx = getOrCreate('chartCPITrend');
        if (!ctx) return;

        const shortDates = data.dates.map(d => {
            const dt = new Date(d);
            return `${dt.getMonth()+1}/${dt.getDate()}`;
        });

        const colors = { performance: '#4f46e5', social: '#7c3aed', partners: '#f59e0b' };
        const names = { performance: '퍼포먼스', social: '소셜', partners: '파트너십' };

        const datasets = Object.entries(data.channelCPI).map(([id, values]) => ({
            label: names[id] || id,
            data: values,
            borderColor: colors[id],
            backgroundColor: 'transparent',
            tension: 0.4,
            borderWidth: 2,
            pointRadius: 0,
            pointHoverRadius: 4,
        }));

        chartInstances['chartCPITrend'] = new Chart(ctx, {
            type: 'line',
            data: { labels: shortDates, datasets },
            options: baseOptions({
                yTickCallback: (v) => '$' + v.toFixed(2),
            })
        });
    }

    // ===== Retention: Segment D7 (Bar) =====
    function renderSegmentRetention(data) {
        const ctx = getOrCreate('chartSegmentRetention');
        if (!ctx) return;

        const colors = data.map(s => s.d7 >= 45 ? '#10b981' : s.d7 >= 40 ? '#f59e0b' : '#ef4444');

        chartInstances['chartSegmentRetention'] = new Chart(ctx, {
            type: 'bar',
            data: {
                labels: data.map(s => s.name),
                datasets: [{
                    label: 'D7 리텐션 (%)',
                    data: data.map(s => Math.round(s.d7 * 10) / 10),
                    backgroundColor: colors,
                    borderRadius: 6,
                    borderSkipped: false,
                    barThickness: 28,
                }]
            },
            options: baseOptions({
                showLegend: false,
                yTickCallback: (v) => v + '%',
            })
        });
    }

    // ===== Retention: DAU/MAU Ratio (Line) =====
    function renderDAUMAU(data) {
        const ctx = getOrCreate('chartDAUMAU');
        if (!ctx) return;

        chartInstances['chartDAUMAU'] = new Chart(ctx, {
            type: 'line',
            data: {
                labels: data.map((_, i) => `D${i+1}`),
                datasets: [{
                    label: 'DAU/MAU (%)',
                    data: data.map(d => Math.round(d.ratio * 10) / 10),
                    borderColor: '#7c3aed',
                    backgroundColor: 'rgba(124,58,237,0.08)',
                    fill: true,
                    tension: 0.4,
                    borderWidth: 2,
                    pointRadius: 0,
                    pointHoverRadius: 4,
                }]
            },
            options: baseOptions({
                yTickCallback: (v) => v + '%',
            })
        });
    }

    // ===== Retention: Cohort Heatmap (using matrix-like bar) =====
    function renderCohortHeatmap(data) {
        const ctx = getOrCreate('chartCohortHeatmap');
        if (!ctx) return;

        // Flatten to grouped bar chart as a heatmap proxy
        const datasets = data.retentionDays.map((day, di) => {
            const baseHue = 240; // indigo
            return {
                label: day,
                data: data.data.map(row => row[di]),
                backgroundColor: data.data.map(row => {
                    const val = row[di];
                    const alpha = Math.max(0.15, val / 100);
                    return `hsla(${baseHue}, 70%, 55%, ${alpha})`;
                }),
                borderRadius: 3,
                borderSkipped: false,
            };
        });

        chartInstances['chartCohortHeatmap'] = new Chart(ctx, {
            type: 'bar',
            data: { labels: data.weeks, datasets },
            options: baseOptions({
                yTickCallback: (v) => v + '%',
                tooltipCallbacks: {
                    label: (ctx) => `${ctx.dataset.label}: ${ctx.raw}%`
                }
            })
        });
    }

    // ===== Revenue: MRR Trend (Area) =====
    function renderMRR(data) {
        const ctx = getOrCreate('chartMRR');
        if (!ctx) return;

        chartInstances['chartMRR'] = new Chart(ctx, {
            type: 'line',
            data: {
                labels: data.labels,
                datasets: [{
                    label: 'MRR ($)',
                    data: data.values,
                    borderColor: '#10b981',
                    backgroundColor: 'rgba(16,185,129,0.1)',
                    fill: true,
                    tension: 0.4,
                    borderWidth: 2.5,
                    pointRadius: 4,
                    pointBackgroundColor: '#10b981',
                    pointHoverRadius: 6,
                }]
            },
            options: baseOptions({
                yTickCallback: (v) => '$' + VitalSyncData.formatNumber(v),
            })
        });
    }

    // ===== Revenue: Plan Conversion Funnel (Horizontal Bar) =====
    function renderPlanFunnel(data) {
        const ctx = getOrCreate('chartPlanFunnel');
        if (!ctx) return;

        chartInstances['chartPlanFunnel'] = new Chart(ctx, {
            type: 'bar',
            data: {
                labels: data.labels,
                datasets: [{
                    label: '전환율 (%)',
                    data: data.values.map(v => Math.round(v * 10) / 10),
                    backgroundColor: ['#4f46e5', '#7c3aed', '#3b82f6', '#10b981'],
                    borderRadius: 6,
                    borderSkipped: false,
                }]
            },
            options: baseOptions({
                showLegend: false,
                yTickCallback: (v) => v + '%',
                extra: { indexAxis: 'y' }
            })
        });
    }

    // ===== Revenue: LTV Distribution (Bar) =====
    function renderLTV(data) {
        const ctx = getOrCreate('chartLTV');
        if (!ctx) return;

        chartInstances['chartLTV'] = new Chart(ctx, {
            type: 'bar',
            data: {
                labels: data.labels,
                datasets: [{
                    label: '사용자 수',
                    data: data.values,
                    backgroundColor: '#4f46e5',
                    borderRadius: 6,
                    borderSkipped: false,
                }]
            },
            options: baseOptions({
                showLegend: false,
                yTickCallback: (v) => VitalSyncData.formatNumber(v),
            })
        });
    }

    // ===== Channels: Budget Allocation (Doughnut) =====
    function renderBudgetAllocation(data) {
        const ctx = getOrCreate('chartBudgetAlloc');
        if (!ctx) return;

        const colors = ['#10b981', '#7c3aed', '#4f46e5', '#3b82f6', '#94a3b8', '#f59e0b'];

        chartInstances['chartBudgetAlloc'] = new Chart(ctx, {
            type: 'doughnut',
            data: {
                labels: data.map(ch => ch.name.replace(/\(.*\)/, '').trim()),
                datasets: [{
                    data: data.map(ch => ch.spend),
                    backgroundColor: colors,
                    borderWidth: 0,
                    hoverOffset: 8,
                }]
            },
            options: baseOptions({
                hideScales: true,
                tooltipCallbacks: {
                    label: (ctx) => `${ctx.label}: $${VitalSyncData.formatNumber(ctx.raw)}`
                },
                extra: {
                    cutout: '60%',
                    plugins: {
                        legend: {
                            position: 'bottom',
                            labels: {
                                color: getThemeColors().textSecondary,
                                font: { family: 'Inter', size: 10, weight: 500 },
                                usePointStyle: true,
                                pointStyle: 'circle',
                                padding: 12,
                                boxWidth: 6,
                            }
                        }
                    }
                }
            })
        });
    }

    // ===== Channels: CAC vs Conversion (Bubble) =====
    function renderCACvsConversion(data) {
        const ctx = getOrCreate('chartCACvsConv');
        if (!ctx) return;

        const colors = ['#10b981', '#7c3aed', '#4f46e5', '#3b82f6', '#94a3b8', '#f59e0b'];

        chartInstances['chartCACvsConv'] = new Chart(ctx, {
            type: 'bubble',
            data: {
                datasets: data.map((ch, i) => ({
                    label: ch.name.replace(/\(.*\)/, '').trim(),
                    data: [{
                        x: Math.round(ch.cac * 100) / 100,
                        y: Math.round(ch.conversionRate * 10) / 10,
                        r: Math.sqrt(ch.downloads) / 100,
                    }],
                    backgroundColor: colors[i] + '80',
                    borderColor: colors[i],
                    borderWidth: 1.5,
                }))
            },
            options: baseOptions({
                extra: {
                    scales: {
                        x: {
                            title: { display: true, text: 'CAC ($)', color: getThemeColors().textSecondary, font: { family: 'Inter', size: 11 } },
                            grid: { color: getThemeColors().grid },
                            ticks: { color: getThemeColors().textSecondary, font: { family: 'Inter', size: 10 }, callback: v => '$' + v.toFixed(2) },
                            border: { display: false },
                        },
                        y: {
                            title: { display: true, text: '전환율 (%)', color: getThemeColors().textSecondary, font: { family: 'Inter', size: 11 } },
                            grid: { color: getThemeColors().grid },
                            ticks: { color: getThemeColors().textSecondary, font: { family: 'Inter', size: 10 }, callback: v => v + '%' },
                            border: { display: false },
                        }
                    }
                },
                tooltipCallbacks: {
                    label: (ctx) => {
                        const d = ctx.raw;
                        return `CAC: $${d.x} | 전환율: ${d.y}%`;
                    }
                }
            })
        });
    }

    // ===== Destroy All Charts =====
    function destroyAll() {
        Object.values(chartInstances).forEach(c => c && c.destroy());
        Object.keys(chartInstances).forEach(k => delete chartInstances[k]);
    }

    // ===== Public API =====
    return {
        renderDailyDownloads,
        renderPlanDistribution,
        renderRetentionCurve,
        renderChannelCAC,
        renderNPSTrend,
        renderFunnel,
        renderChannelDownloads,
        renderGeoDownloads,
        renderCPITrend,
        renderSegmentRetention,
        renderDAUMAU,
        renderCohortHeatmap,
        renderMRR,
        renderPlanFunnel,
        renderLTV,
        renderBudgetAllocation,
        renderCACvsConversion,
        destroyAll,
    };
})();
