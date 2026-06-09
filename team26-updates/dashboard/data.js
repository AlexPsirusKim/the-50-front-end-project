/**
 * VitalSync Launch Performance Dashboard — Data Layer
 * 
 * 이 모듈은 Looker/BigQuery 데이터 파이프라인을 시뮬레이션합니다.
 * 실제 환경에서는 Looker Embed API 또는 BigQuery REST API로 교체합니다.
 * 
 * 데이터 소스 매핑:
 *   - 다운로드: Google Play Console API / App Store Connect API → BigQuery
 *   - 리텐션: Firebase Analytics / Amplitude → BigQuery
 *   - 유료 전환: Stripe/RevenueCat → BigQuery
 *   - NPS: Delighted/SurveyMonkey API → BigQuery
 *   - CAC: Meta Ads API, Google Ads API, 파트너 리포트 → BigQuery
 */

const VitalSyncData = (() => {
    'use strict';

    // ===== Configuration =====
    const CONFIG = {
        // GTM 성과 측정 프레임워크 목표 (6개월)
        targets6m: {
            downloads: 5_000_000,
            d7Retention: 40,       // %
            paidConversion: 8,     // %
            nps: 45,
            avgCAC: 1.50           // USD
        },
        // GTM 성과 측정 프레임워크 목표 (12개월)
        targets12m: {
            downloads: 20_000_000,
            d7Retention: 50,
            paidConversion: 15,
            nps: 60,
            subscriptionRetention12m: 75
        },
        // 가격 플랜 (GTM 전략 기반)
        plans: {
            free: { name: 'Free', price: 0 },
            plus: { name: 'Plus', price: 4.99 },
            premium: { name: 'Premium', price: 9.99 },
            clinical: { name: 'Clinical', price: 24.99 }
        },
        // 채널 (GTM 전략 기반)
        channels: [
            { id: 'aso', name: '앱스토어 최적화 (ASO)', budgetShare: 0.05, type: 'digital' },
            { id: 'social', name: '소셜 미디어', budgetShare: 0.25, type: 'digital' },
            { id: 'performance', name: '퍼포먼스 마케팅', budgetShare: 0.30, type: 'digital' },
            { id: 'content', name: '콘텐츠 마케팅', budgetShare: 0.15, type: 'digital' },
            { id: 'email', name: '이메일 마케팅', budgetShare: 0.05, type: 'digital' },
            { id: 'partners', name: '파트너십 채널', budgetShare: 0.20, type: 'partnership' }
        ],
        // 타겟 세그먼트
        segments: [
            '액티브 피트니스족',
            '만성질환 관리자',
            '워라밸 직장인',
            '여성 건강',
            '시니어'
        ],
        // 론칭 시장
        markets: [
            { id: 'us', name: '미국', phase: 1 },
            { id: 'kr', name: '한국', phase: 1 },
            { id: 'eu', name: '유럽', phase: 2 },
            { id: 'jp', name: '일본', phase: 2 }
        ],
        totalBudget: 2_500_000,  // Monthly marketing budget (USD)
        refreshInterval: 30_000  // 30초 간격 갱신
    };

    // ===== Utility Functions =====
    function randomBetween(min, max) {
        return Math.random() * (max - min) + min;
    }

    function randomInt(min, max) {
        return Math.floor(randomBetween(min, max + 1));
    }

    function generateDateRange(days) {
        const dates = [];
        const now = new Date();
        for (let i = days - 1; i >= 0; i--) {
            const d = new Date(now);
            d.setDate(d.getDate() - i);
            dates.push(d.toISOString().split('T')[0]);
        }
        return dates;
    }

    function formatNumber(n) {
        if (n >= 1_000_000) return (n / 1_000_000).toFixed(1) + 'M';
        if (n >= 1_000) return (n / 1_000).toFixed(1) + 'K';
        return n.toLocaleString();
    }

    function formatCurrency(n) {
        return '$' + n.toFixed(2);
    }

    function formatPercent(n) {
        return n.toFixed(1) + '%';
    }

    // ===== Data Generators =====

    /** 일별 다운로드 데이터 생성 */
    function generateDailyDownloads(days = 30) {
        const dates = generateDateRange(days);
        const organic = [];
        const paid = [];
        const partner = [];

        let baseOrganic = 12000;
        let basePaid = 25000;
        let basePartner = 8000;

        dates.forEach((date, i) => {
            // 트렌드: 점진적 상승 + 주말 변동
            const dayOfWeek = new Date(date).getDay();
            const weekendFactor = (dayOfWeek === 0 || dayOfWeek === 6) ? 0.85 : 1.0;
            const trendFactor = 1 + (i / days) * 0.15;

            organic.push(Math.round(baseOrganic * trendFactor * weekendFactor * randomBetween(0.9, 1.1)));
            paid.push(Math.round(basePaid * trendFactor * weekendFactor * randomBetween(0.85, 1.15)));
            partner.push(Math.round(basePartner * trendFactor * weekendFactor * randomBetween(0.8, 1.2)));
        });

        return { dates, organic, paid, partner };
    }

    /** KPI 요약 데이터 생성 */
    function generateKPISummary() {
        const totalDownloads = randomInt(1_850_000, 2_150_000);
        const d7Retention = randomBetween(37.5, 42.8);
        const paidConversion = randomBetween(6.8, 8.5);
        const nps = randomInt(42, 52);
        const avgCAC = randomBetween(1.25, 1.65);

        return {
            downloads: {
                value: totalDownloads,
                formatted: formatNumber(totalDownloads),
                change: randomBetween(8, 18),
                target: CONFIG.targets6m.downloads,
                progress: (totalDownloads / CONFIG.targets6m.downloads) * 100
            },
            d7Retention: {
                value: d7Retention,
                formatted: formatPercent(d7Retention),
                change: randomBetween(1.5, 4.2),
                target: CONFIG.targets6m.d7Retention,
                progress: (d7Retention / CONFIG.targets6m.d7Retention) * 100
            },
            paidConversion: {
                value: paidConversion,
                formatted: formatPercent(paidConversion),
                change: randomBetween(0.5, 2.1),
                target: CONFIG.targets6m.paidConversion,
                progress: (paidConversion / CONFIG.targets6m.paidConversion) * 100
            },
            nps: {
                value: nps,
                formatted: nps.toString(),
                change: randomInt(2, 6),
                target: CONFIG.targets6m.nps,
                progress: (nps / CONFIG.targets6m.nps) * 100
            },
            cac: {
                value: avgCAC,
                formatted: formatCurrency(avgCAC),
                change: -randomBetween(3, 8),
                target: CONFIG.targets6m.avgCAC,
                // CAC: 낮을수록 좋으므로 반전
                progress: Math.min(100, (CONFIG.targets6m.avgCAC / avgCAC) * 100)
            }
        };
    }

    /** 플랜별 구독 분포 생성 */
    function generatePlanDistribution() {
        return {
            labels: ['Free', 'Plus', 'Premium', 'Clinical'],
            values: [
                randomInt(1_200_000, 1_500_000),
                randomInt(85_000, 120_000),
                randomInt(45_000, 70_000),
                randomInt(3_000, 8_000)
            ],
            colors: ['#94a3b8', '#4f46e5', '#7c3aed', '#10b981']
        };
    }

    /** 코호트별 리텐션 커브 생성 */
    function generateRetentionCurve() {
        const days = [1, 3, 7, 14, 21, 30];
        const cohorts = {
            'Week 1 코호트': [],
            'Week 2 코호트': [],
            'Week 3 코호트': [],
            'Week 4 코호트': []
        };

        Object.keys(cohorts).forEach((cohort, ci) => {
            let retention = 100;
            days.forEach((day, di) => {
                if (di === 0) {
                    retention = randomBetween(62, 72);
                } else {
                    const dropRate = randomBetween(0.7, 0.88);
                    retention = retention * dropRate;
                }
                // 최신 코호트일수록 약간 더 좋은 리텐션
                cohorts[cohort].push(Math.round((retention + ci * 1.5) * 10) / 10);
            });
        });

        return { days: days.map(d => `D${d}`), cohorts };
    }

    /** 채널별 CAC 데이터 생성 */
    function generateChannelCAC() {
        return CONFIG.channels.map(ch => ({
            ...ch,
            cac: ch.id === 'aso' ? randomBetween(0.30, 0.60) :
                 ch.id === 'social' ? randomBetween(1.20, 1.80) :
                 ch.id === 'performance' ? randomBetween(1.40, 2.10) :
                 ch.id === 'content' ? randomBetween(0.80, 1.20) :
                 ch.id === 'email' ? randomBetween(0.50, 0.90) :
                 randomBetween(0.60, 1.10),
            downloads: ch.id === 'aso' ? randomInt(350_000, 500_000) :
                       ch.id === 'social' ? randomInt(280_000, 420_000) :
                       ch.id === 'performance' ? randomInt(600_000, 800_000) :
                       ch.id === 'content' ? randomInt(150_000, 250_000) :
                       ch.id === 'email' ? randomInt(80_000, 150_000) :
                       randomInt(200_000, 350_000),
            conversionRate: ch.id === 'aso' ? randomBetween(5, 9) :
                            ch.id === 'social' ? randomBetween(4, 7) :
                            ch.id === 'performance' ? randomBetween(6, 10) :
                            ch.id === 'content' ? randomBetween(7, 12) :
                            ch.id === 'email' ? randomBetween(8, 14) :
                            randomBetween(5, 9)
        }));
    }

    /** NPS 추이 데이터 생성 */
    function generateNPSTrend(weeks = 12) {
        const labels = [];
        const scores = [];
        let base = 38;

        for (let i = 0; i < weeks; i++) {
            labels.push(`W${i + 1}`);
            base += randomBetween(-1.5, 3);
            base = Math.max(30, Math.min(60, base));
            scores.push(Math.round(base));
        }

        return {
            labels,
            scores,
            distribution: {
                promoters: randomInt(45, 55),
                passives: randomInt(25, 35),
                detractors: randomInt(10, 20)
            }
        };
    }

    /** 전환 퍼널 데이터 생성 */
    function generateFunnel() {
        const totalDownloads = randomInt(1_850_000, 2_150_000);
        const activated = Math.round(totalDownloads * randomBetween(0.55, 0.65));
        const engaged7d = Math.round(activated * randomBetween(0.58, 0.68));
        const trialStarted = Math.round(engaged7d * randomBetween(0.25, 0.35));
        const paidConverted = Math.round(trialStarted * randomBetween(0.35, 0.50));

        return [
            { label: '앱 다운로드', value: totalDownloads, color: '#4f46e5' },
            { label: '온보딩 완료', value: activated, color: '#6366f1' },
            { label: '7일 활성 사용', value: engaged7d, color: '#7c3aed' },
            { label: '무료 체험 시작', value: trialStarted, color: '#a78bfa' },
            { label: '유료 전환', value: paidConverted, color: '#10b981' }
        ];
    }

    // ===== Acquisition Page Data =====
    function generateAcquisitionData(days = 30) {
        const dates = generateDateRange(days);
        const channelData = {};

        CONFIG.channels.forEach(ch => {
            channelData[ch.id] = dates.map((_, i) => {
                const base = ch.id === 'performance' ? 22000 :
                             ch.id === 'social' ? 12000 :
                             ch.id === 'aso' ? 14000 :
                             ch.id === 'content' ? 6000 :
                             ch.id === 'partners' ? 9000 : 4000;
                const trend = 1 + (i / days) * 0.12;
                return Math.round(base * trend * randomBetween(0.85, 1.15));
            });
        });

        return {
            dates,
            channelData,
            dailyDownloads: randomInt(48_000, 62_000),
            organicRate: randomBetween(28, 35),
            avgCPI: randomBetween(1.20, 1.55),
            appRank: randomInt(2, 8)
        };
    }

    /** 국가별 다운로드 */
    function generateGeoDownloads() {
        return {
            labels: ['미국', '한국', '영국', '독일', '일본', '기타'],
            values: [
                randomInt(750_000, 900_000),
                randomInt(400_000, 550_000),
                randomInt(120_000, 200_000),
                randomInt(100_000, 180_000),
                randomInt(80_000, 140_000),
                randomInt(200_000, 350_000)
            ],
            colors: ['#4f46e5', '#7c3aed', '#3b82f6', '#10b981', '#f59e0b', '#94a3b8']
        };
    }

    // ===== Retention Page Data =====
    function generateRetentionPageData() {
        return {
            d1: randomBetween(65, 72),
            d7: randomBetween(37.5, 42.8),
            d30: randomBetween(22, 30),
            wau: randomInt(680_000, 850_000),
            segmentRetention: CONFIG.segments.map(seg => ({
                name: seg,
                d7: seg === '액티브 피트니스족' ? randomBetween(48, 56) :
                    seg === '만성질환 관리자' ? randomBetween(52, 60) :
                    seg === '워라밸 직장인' ? randomBetween(35, 42) :
                    seg === '여성 건강' ? randomBetween(40, 48) :
                    randomBetween(38, 45)
            })),
            dauMau: generateDateRange(30).map((_, i) => ({
                date: i,
                ratio: randomBetween(28, 38)
            }))
        };
    }

    // ===== Revenue Page Data =====
    function generateRevenueData() {
        const months = ['1월','2월','3월','4월','5월','6월'];
        const mrr = [];
        let baseMRR = 120_000;
        months.forEach(() => {
            baseMRR += randomInt(30_000, 80_000);
            mrr.push(baseMRR);
        });

        return {
            mrr: { labels: months, values: mrr },
            currentMRR: mrr[mrr.length - 1],
            arpu: randomBetween(3.20, 4.80),
            convRate: randomBetween(6.8, 8.5),
            ltvCacRatio: randomBetween(2.8, 4.2),
            planFunnel: {
                labels: ['Free → Plus', 'Free → Premium', 'Plus → Premium', 'Premium → Clinical'],
                values: [
                    randomBetween(4, 7),
                    randomBetween(2, 4),
                    randomBetween(12, 18),
                    randomBetween(3, 6)
                ]
            },
            ltvDistribution: {
                labels: ['$0', '$1-10', '$10-50', '$50-100', '$100+'],
                values: [
                    randomInt(1_200_000, 1_500_000),
                    randomInt(60_000, 90_000),
                    randomInt(35_000, 55_000),
                    randomInt(15_000, 25_000),
                    randomInt(3_000, 8_000)
                ]
            }
        };
    }

    // ===== Channel Page Data =====
    function generateChannelPageData() {
        const channels = generateChannelCAC();
        const totalSpend = CONFIG.totalBudget;
        let totalRevenue = 0;

        const detailed = channels.map(ch => {
            const spend = Math.round(totalSpend * ch.budgetShare);
            const revenue = Math.round(spend * randomBetween(1.8, 4.5));
            totalRevenue += revenue;
            const roas = revenue / spend;

            return {
                ...ch,
                spend,
                revenue,
                roas,
                status: ch.cac <= 1.0 ? 'good' : ch.cac <= 1.5 ? 'warning' : 'bad'
            };
        });

        return {
            channels: detailed,
            totalSpend,
            totalRevenue,
            roas: totalRevenue / totalSpend,
            bestChannel: detailed.reduce((a, b) => a.roas > b.roas ? a : b).name,
            partnerShare: formatPercent(
                (detailed.find(c => c.id === 'partners')?.downloads || 0) /
                detailed.reduce((s, c) => s + c.downloads, 0) * 100
            )
        };
    }

    // ===== Cohort Heatmap Data =====
    function generateCohortHeatmap() {
        const weeks = ['W1', 'W2', 'W3', 'W4', 'W5', 'W6', 'W7', 'W8'];
        const retentionDays = ['D1', 'D3', 'D7', 'D14', 'D21', 'D30'];
        const data = [];

        weeks.forEach((_, wi) => {
            let ret = 100;
            const row = [];
            retentionDays.forEach((_, di) => {
                if (di === 0) {
                    ret = randomBetween(62, 72) + wi * 0.8;
                } else {
                    ret = ret * randomBetween(0.72, 0.88);
                }
                row.push(Math.round(ret * 10) / 10);
            });
            data.push(row);
        });

        return { weeks, retentionDays, data };
    }

    // ===== CPI Trend Data =====
    function generateCPITrend(days = 30) {
        const dates = generateDateRange(days);
        const channelCPI = {};

        ['performance', 'social', 'partners'].forEach(ch => {
            const base = ch === 'performance' ? 1.6 : ch === 'social' ? 1.4 : 0.9;
            channelCPI[ch] = dates.map((_, i) => {
                const trend = 1 - (i / days) * 0.08; // 하락 트렌드 (개선)
                return Math.round(base * trend * randomBetween(0.9, 1.1) * 100) / 100;
            });
        });

        return { dates, channelCPI };
    }

    // ===== Public API =====
    return {
        CONFIG,
        formatNumber,
        formatCurrency,
        formatPercent,
        getKPISummary: generateKPISummary,
        getDailyDownloads: generateDailyDownloads,
        getPlanDistribution: generatePlanDistribution,
        getRetentionCurve: generateRetentionCurve,
        getChannelCAC: generateChannelCAC,
        getNPSTrend: generateNPSTrend,
        getFunnel: generateFunnel,
        getAcquisitionData: generateAcquisitionData,
        getGeoDownloads: generateGeoDownloads,
        getRetentionPageData: generateRetentionPageData,
        getRevenueData: generateRevenueData,
        getChannelPageData: generateChannelPageData,
        getCohortHeatmap: generateCohortHeatmap,
        getCPITrend: generateCPITrend
    };
})();
