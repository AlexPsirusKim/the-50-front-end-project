/**
 * VitalSync Launch Performance Dashboard — Application Controller
 * 
 * 페이지 전환, 데이터 로딩, 실시간 업데이트, 테마 전환을 관리합니다.
 * 
 * Looker 연동 가이드:
 *   실제 환경에서는 VitalSyncData의 각 함수를
 *   Looker Embed SDK 또는 REST API 호출로 교체합니다.
 *   예: VitalSyncData.getKPISummary() → fetch('/api/looker/kpi-summary')
 */

(function () {
    'use strict';

    // ===== DOM References =====
    const sidebar = document.getElementById('sidebar');
    const sidebarToggle = document.getElementById('sidebarToggle');
    const mainContent = document.getElementById('mainContent');
    const navItems = document.querySelectorAll('.nav-item');
    const pageTitle = document.getElementById('pageTitle');
    const dateRange = document.getElementById('dateRange');
    const btnRefresh = document.getElementById('btnRefresh');
    const btnTheme = document.getElementById('btnTheme');
    const lastUpdated = document.getElementById('lastUpdated');

    let currentPage = 'overview';
    let refreshTimer = null;

    // ===== Page Titles =====
    const pageTitles = {
        overview: '론칭 성과 대시보드',
        acquisition: '사용자 획득 분석',
        retention: '리텐션 분석',
        revenue: '수익화 분석',
        channels: '채널별 성과 분석'
    };

    // ===== Initialize =====
    function init() {
        setupTheme();
        setupNavigation();
        setupSidebar();
        setupDateFilter();
        setupRefresh();
        loadPage('overview');
        startAutoRefresh();
    }

    // ===== Theme Management =====
    function setupTheme() {
        const saved = localStorage.getItem('vs-dashboard-theme');
        if (saved === 'dark') {
            document.body.classList.add('dark');
            updateThemeIcon();
        }

        btnTheme.addEventListener('click', () => {
            document.body.classList.toggle('dark');
            const isDark = document.body.classList.contains('dark');
            localStorage.setItem('vs-dashboard-theme', isDark ? 'dark' : 'light');
            updateThemeIcon();
            // Re-render current page for theme-aware chart colors
            loadPage(currentPage);
        });
    }

    function updateThemeIcon() {
        const isDark = document.body.classList.contains('dark');
        btnTheme.innerHTML = isDark
            ? '<i class="uil uil-sun"></i>'
            : '<i class="uil uil-moon"></i>';
    }

    // ===== Navigation =====
    function setupNavigation() {
        navItems.forEach(item => {
            item.addEventListener('click', () => {
                const page = item.dataset.page;
                if (page === currentPage) return;
                switchPage(page);
            });
        });
    }

    function switchPage(page) {
        // Update nav
        navItems.forEach(item => {
            item.classList.toggle('active', item.dataset.page === page);
        });

        // Update page content
        document.querySelectorAll('.page-content').forEach(p => {
            p.classList.remove('active');
        });
        const pageEl = document.getElementById(`page-${page}`);
        if (pageEl) pageEl.classList.add('active');

        // Update title
        currentPage = page;
        pageTitle.textContent = pageTitles[page] || '대시보드';

        // Close mobile sidebar
        sidebar.classList.remove('open');
        const overlay = document.querySelector('.sidebar-overlay');
        if (overlay) overlay.classList.remove('active');

        // Load page data
        loadPage(page);
    }

    // ===== Sidebar Toggle (Mobile) =====
    function setupSidebar() {
        // Create overlay
        const overlay = document.createElement('div');
        overlay.className = 'sidebar-overlay';
        document.body.appendChild(overlay);

        sidebarToggle.addEventListener('click', () => {
            sidebar.classList.toggle('open');
            overlay.classList.toggle('active');
        });

        overlay.addEventListener('click', () => {
            sidebar.classList.remove('open');
            overlay.classList.remove('active');
        });
    }

    // ===== Date Filter =====
    function setupDateFilter() {
        dateRange.addEventListener('change', () => {
            loadPage(currentPage);
        });
    }

    function getSelectedDays() {
        const val = dateRange.value;
        switch (val) {
            case '7d': return 7;
            case '30d': return 30;
            case '90d': return 90;
            case '6m': return 180;
            case '1y': return 365;
            default: return 30;
        }
    }

    // ===== Refresh =====
    function setupRefresh() {
        btnRefresh.addEventListener('click', () => {
            btnRefresh.classList.add('spinning');
            loadPage(currentPage);
            setTimeout(() => btnRefresh.classList.remove('spinning'), 800);
        });
    }

    function startAutoRefresh() {
        if (refreshTimer) clearInterval(refreshTimer);
        refreshTimer = setInterval(() => {
            loadPage(currentPage);
        }, VitalSyncData.CONFIG.refreshInterval);
    }

    function updateTimestamp() {
        const now = new Date();
        const time = now.toLocaleTimeString('ko-KR', { hour: '2-digit', minute: '2-digit', second: '2-digit' });
        lastUpdated.textContent = `마지막 업데이트: ${time}`;
    }

    // ===== Page Loaders =====
    function loadPage(page) {
        switch (page) {
            case 'overview': loadOverview(); break;
            case 'acquisition': loadAcquisition(); break;
            case 'retention': loadRetention(); break;
            case 'revenue': loadRevenue(); break;
            case 'channels': loadChannels(); break;
        }
        updateTimestamp();
    }

    // ----- Overview Page -----
    function loadOverview() {
        const kpi = VitalSyncData.getKPISummary();
        const days = getSelectedDays();

        // Update KPI cards
        animateValue('kpiDownloads', kpi.downloads.formatted);
        animateValue('kpiRetention', kpi.d7Retention.formatted);
        animateValue('kpiConversion', kpi.paidConversion.formatted);
        animateValue('kpiNPS', kpi.nps.formatted);
        animateValue('kpiCAC', kpi.cac.formatted);

        // Update changes
        updateChange('kpiDownloadsChange', kpi.downloads.change, true);
        updateChange('kpiRetentionChange', kpi.d7Retention.change, true);
        updateChange('kpiConversionChange', kpi.paidConversion.change, true);
        updateChange('kpiNPSChange', kpi.nps.change, true);
        updateChange('kpiCACChange', kpi.cac.change, false); // lower is better

        // Update progress bars
        setProgress('progressDownloads', kpi.downloads.progress);
        setProgress('progressRetention', kpi.d7Retention.progress);
        setProgress('progressConversion', kpi.paidConversion.progress);
        setProgress('progressNPS', kpi.nps.progress);
        setProgress('progressCAC', kpi.cac.progress);

        // Render charts
        const downloadsData = VitalSyncData.getDailyDownloads(Math.min(days, 90));
        VitalSyncCharts.renderDailyDownloads(downloadsData);

        const planData = VitalSyncData.getPlanDistribution();
        VitalSyncCharts.renderPlanDistribution(planData);

        const retentionData = VitalSyncData.getRetentionCurve();
        VitalSyncCharts.renderRetentionCurve(retentionData);

        const cacData = VitalSyncData.getChannelCAC();
        VitalSyncCharts.renderChannelCAC(cacData);

        const funnelData = VitalSyncData.getFunnel();
        VitalSyncCharts.renderFunnel(funnelData);

        const npsData = VitalSyncData.getNPSTrend();
        VitalSyncCharts.renderNPSTrend(npsData);
    }

    // ----- Acquisition Page -----
    function loadAcquisition() {
        const days = getSelectedDays();
        const data = VitalSyncData.getAcquisitionData(Math.min(days, 90));

        animateValue('kpiDailyDownloads', VitalSyncData.formatNumber(data.dailyDownloads));
        animateValue('kpiOrganicRate', VitalSyncData.formatPercent(data.organicRate));
        animateValue('kpiCPI', VitalSyncData.formatCurrency(data.avgCPI));
        animateValue('kpiAppRank', `#${data.appRank}`);

        VitalSyncCharts.renderChannelDownloads(data);

        const geoData = VitalSyncData.getGeoDownloads();
        VitalSyncCharts.renderGeoDownloads(geoData);

        const cpiData = VitalSyncData.getCPITrend(Math.min(days, 90));
        VitalSyncCharts.renderCPITrend(cpiData);
    }

    // ----- Retention Page -----
    function loadRetention() {
        const data = VitalSyncData.getRetentionPageData();

        animateValue('kpiD1', VitalSyncData.formatPercent(data.d1));
        animateValue('kpiD7', VitalSyncData.formatPercent(data.d7));
        animateValue('kpiD30', VitalSyncData.formatPercent(data.d30));
        animateValue('kpiWAU', VitalSyncData.formatNumber(data.wau));

        const heatmapData = VitalSyncData.getCohortHeatmap();
        VitalSyncCharts.renderCohortHeatmap(heatmapData);

        VitalSyncCharts.renderSegmentRetention(data.segmentRetention);
        VitalSyncCharts.renderDAUMAU(data.dauMau);
    }

    // ----- Revenue Page -----
    function loadRevenue() {
        const data = VitalSyncData.getRevenueData();

        animateValue('kpiMRR', '$' + VitalSyncData.formatNumber(data.currentMRR));
        animateValue('kpiARPU', VitalSyncData.formatCurrency(data.arpu));
        animateValue('kpiConvRate', VitalSyncData.formatPercent(data.convRate));
        animateValue('kpiLTVCAC', data.ltvCacRatio.toFixed(1) + 'x');

        VitalSyncCharts.renderMRR(data.mrr);
        VitalSyncCharts.renderPlanFunnel(data.planFunnel);
        VitalSyncCharts.renderLTV(data.ltvDistribution);
    }

    // ----- Channels Page -----
    function loadChannels() {
        const data = VitalSyncData.getChannelPageData();

        animateValue('kpiTotalSpend', '$' + VitalSyncData.formatNumber(data.totalSpend));
        animateValue('kpiROAS', data.roas.toFixed(1) + 'x');
        animateValue('kpiBestChannel', data.bestChannel.replace(/\(.*\)/, '').trim());
        animateValue('kpiPartnerShare', data.partnerShare);

        // Populate table
        const tbody = document.getElementById('channelTableBody');
        if (tbody) {
            tbody.innerHTML = data.channels.map(ch => `
                <tr>
                    <td><strong>${ch.name}</strong></td>
                    <td>$${VitalSyncData.formatNumber(ch.spend)}</td>
                    <td>${VitalSyncData.formatNumber(ch.downloads)}</td>
                    <td>${VitalSyncData.formatCurrency(ch.cac)}</td>
                    <td>${VitalSyncData.formatPercent(ch.conversionRate)}</td>
                    <td>${ch.roas.toFixed(1)}x</td>
                    <td><span class="status-badge ${ch.status}">${
                        ch.status === 'good' ? '✓ 양호' :
                        ch.status === 'warning' ? '⚠ 주의' : '✗ 초과'
                    }</span></td>
                </tr>
            `).join('');
        }

        VitalSyncCharts.renderBudgetAllocation(data.channels);
        VitalSyncCharts.renderCACvsConversion(data.channels);
    }

    // ===== UI Helpers =====
    function animateValue(elementId, newValue) {
        const el = document.getElementById(elementId);
        if (!el) return;
        el.style.opacity = '0';
        el.style.transform = 'translateY(4px)';
        setTimeout(() => {
            el.textContent = newValue;
            el.style.transition = 'opacity 0.3s, transform 0.3s';
            el.style.opacity = '1';
            el.style.transform = 'translateY(0)';
        }, 100);
    }

    function updateChange(elementId, change, higherIsBetter) {
        const el = document.getElementById(elementId);
        if (!el) return;

        const isPositive = higherIsBetter ? change > 0 : change < 0;
        const arrow = change > 0 ? '↑' : '↓';
        const absChange = Math.abs(change).toFixed(1);

        el.textContent = `${arrow} ${absChange}%`;
        el.className = `kpi-change ${isPositive ? 'positive' : 'negative'}`;
    }

    function setProgress(elementId, progress) {
        const el = document.getElementById(elementId);
        if (!el) return;
        setTimeout(() => {
            el.style.width = Math.min(100, Math.max(0, progress)).toFixed(1) + '%';
        }, 300);
    }

    // ===== Start =====
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }
})();
