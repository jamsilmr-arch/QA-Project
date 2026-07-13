window.QA_CORE = window.QA_CORE || {};
window.QA_CORE.KpiModule = {
    activeSubTab: "1",
    tcItems: [],
    writeCount: 0, // 💡 [아키텍처 확장] 달력 취합 작성/수정 건수를 영속 보관할 내부 독립 상태 추가

    init() {
        const panelZone = document.getElementById('tab-panel-kpi');
        if (panelZone) {
            panelZone.innerHTML = KPI_TEMPLATE;
        }

        // 1. 초기 적재된 스토리지 데이터 마운트
        this.loadSyncedCalendarTc();
        this.loadSyncedCalendarWriteTc(); // 💡 [신규] 작성/수정 스토리지 동기 가드 가동

        // 2. [수행 개수] 비동기 이벤트 리스너 정류
        if (!this._handleTcSyncBound) {
            this._handleTcSyncBound = this._handleTcSync.bind(this);
        }
        document.removeEventListener('QA_KPI_TC_DATA_SYNC', this._handleTcSyncBound);
        document.addEventListener('QA_KPI_TC_DATA_SYNC', this._handleTcSyncBound);

        // 3. ✨ [신규 주입] 달력 탭(calendar.js)의 작성/수정 동기화 이벤트를 인터셉트하는 브릿지 장착
        if (!this._handleWriteSyncBound) {
            this._handleWriteSyncBound = this._handleWriteSync.bind(this);
        }
        document.removeEventListener('QA_KPI_WRITE_DATA_SYNC', this._handleWriteSyncBound);
        document.addEventListener('QA_KPI_WRITE_DATA_SYNC', this._handleWriteSyncBound);

        this.bindEvents();
        this.renderDynamicTcRows();
        this.compileKpiReport();
    },

    loadSyncedCalendarTc() {
        const savedCount = localStorage.getItem('QA_SYSTEM_KPI_TC_COUNT');
        const savedDate = localStorage.getItem('QA_SYSTEM_KPI_TC_DATE');
        if (savedCount && savedDate) {
            const [year, month] = savedDate.split('-');
            this.injectOrUpdateTcItem(parseInt(savedCount, 10) || 0, year, month);
        }
    },

    // ✨ [신규 구현] 새로고침 시 세션 스토리지에서 작성/수정 카운트를 복구하여 인젝션하는 백업 엔진
    loadSyncedCalendarWriteTc() {
        const savedCount = localStorage.getItem('QA_SYSTEM_KPI_WRITE_COUNT');
        const savedDate = localStorage.getItem('QA_SYSTEM_KPI_WRITE_DATE');
        if (savedCount && savedDate) {
            this.writeCount = parseInt(savedCount, 10) || 0;
            const selfTcEl = document.getElementById('kpi-self-tc-text');
            if (selfTcEl && !selfTcEl.value.trim()) {
                const [year, month] = savedDate.split('-');
                selfTcEl.value = `[달력 자동 취합] ${year}년 ${month}월 총 TC 작성/수정: ${this.writeCount}개 완료.`;
            }
        }
    },

    _handleTcSync(e) {
        if (e && e.detail) {
            const { count, year, month } = e.detail;
            this.injectOrUpdateTcItem(count, year, month);
            if (document.getElementById('kpi-tc-dynamic-zone')) {
                this.renderDynamicTcRows();
                this.compileKpiReport();
            }
        }
    },

    // ✨ [신규 구현] calendar.js가 쏘아 올린 전송 이벤트를 포착하여 실시간 렌더링 파이프라인으로 연결
    _handleWriteSync(e) {
        if (e && e.detail) {
            const { count, year, month } = e.detail;
            this.writeCount = count;
            const selfTcEl = document.getElementById('kpi-self-tc-text');
            if (selfTcEl) {
                selfTcEl.value = `[달력 자동 취합] ${year}년 ${month}월 총 TC 작성/수정: ${count}개 완료.\n(이곳에 세부 업무 명세를 추가 진술하십시오.)`;
            }
            this.compileKpiReport();
            this.triggerAutoSaveIndicator();
        }
    },

    injectOrUpdateTcItem(count, year, month) {
        const titleText = `${year}년 ${month}월 자동 취합 건수`;
        const existingItem = this.tcItems.find(item => item.title === titleText);
        if (existingItem) {
            existingItem.count = count;
        } else {
            this.tcItems.push({
                id: 'auto-' + Date.now(),
                poc: '달력취합',
                title: titleText,
                ticket: 'CAL-SYNC',
                count: count,
                deviceChecked: false
            });
        }
    },

    bindEvents() {
        const panelZone = document.getElementById('tab-panel-kpi');
        if (!panelZone) return;

        panelZone.querySelectorAll('.kpi-sub-tab-btn').forEach(btn => {
            btn.onclick = (e) => {
                panelZone.querySelectorAll('.kpi-sub-tab-btn').forEach(b => {
                    b.classList.remove('active'); b.style.background = 'none'; b.style.color = '#718096'; b.style.boxShadow = 'none';
                });
                e.target.classList.add('active'); 
                e.target.style.background = '#ffffff'; 
                e.target.style.color = '#3182ce';
                e.target.style.boxShadow = '0 2px 4px rgba(0,0,0,0.04)';
                
                const subtabId = e.target.getAttribute('data-subtab');
                this.activeSubTab = subtabId;
                
                panelZone.querySelectorAll('.kpi-sub-panel').forEach(p => p.style.display = 'none');
                const targetPanel = document.getElementById(`kpi-sub-panel-${subtabId}`);
                if (targetPanel) targetPanel.style.display = 'block';

                const tabNames = { "1": "업무 성과", "2": "팀 기여도", "3": "개인 역량" };
                document.getElementById('kpi-preview-tab-name').innerText = tabNames[subtabId];
                document.getElementById('btn-kpi-copy-clipboard').innerText = `📋 [${tabNames[subtabId]}] 복사하기`;
                
                this.compileKpiReport();
            };
        });

        const trackingInputs = ['kpi-df-blocker', 'kpi-df-critical', 'kpi-df-major', 'kpi-df-minor', 'kpi-df-trivial', 'kpi-df-team-avg', 'kpi-self-tc-text', 'kpi-contribution-narrative'];
        trackingInputs.forEach(id => {
            const el = document.getElementById(id);
            if (el) el.addEventListener('input', () => {
                this.compileKpiReport();
                this.triggerAutoSaveIndicator();
            });
        });

        document.getElementById('btn-kpi-add-tc').onclick = () => {
            this.tcItems.push({ id: Date.now(), poc: '기타', title: '', ticket: '', count: 0, deviceChecked: false });
            this.renderDynamicTcRows();
            this.compileKpiReport();
        };

        document.getElementById('btn-reset-defects').onclick = () => {
            if (!confirm("현재 업무 성과 탭의 모든 내용을 초기화하시겠습니까?")) return;
            ['kpi-df-blocker', 'kpi-df-critical', 'kpi-df-major', 'kpi-df-minor', 'kpi-df-trivial', 'kpi-df-team-avg'].forEach(id => {
                const el = document.getElementById(id); if (el) el.value = 0;
            });
            const selfTcEl = document.getElementById('kpi-self-tc-text');
            if (selfTcEl) selfTcEl.value = '';
            
            this.tcItems = [];
            this.writeCount = 0;
            localStorage.removeItem('QA_SYSTEM_KPI_TC_COUNT');
            localStorage.removeItem('QA_SYSTEM_KPI_TC_DATE');
            localStorage.removeItem('QA_SYSTEM_KPI_WRITE_COUNT');
            localStorage.removeItem('QA_SYSTEM_KPI_WRITE_DATE');

            this.renderDynamicTcRows();
            this.compileKpiReport();
            this.triggerAutoSaveIndicator();
        };

        const resetContributionBtn = document.getElementById('btn-reset-contribution');
        if (resetContributionBtn) {
            resetContributionBtn.onclick = () => {
                if (!confirm("현재 팀 기여도 및 업무태도 서술 본문을 초기화하시겠습니까?")) return;
                const narrativeArea = document.getElementById('kpi-contribution-narrative');
                if (narrativeArea) narrativeArea.value = '';
                this.compileKpiReport();
                this.triggerAutoSaveIndicator();
            };
        }

        document.getElementById('btn-kpi-auto-generation').onclick = () => { this.generateAiContributionScript(); };

        document.getElementById('btn-kpi-copy-clipboard').onclick = () => {
            const text = document.getElementById('kpi-display-preview-text').value;
            if (!text.trim()) return;
            navigator.clipboard.writeText(text).then(() => {
                if (window.QA_CORE.UI && typeof window.QA_CORE.UI.showToast === 'function') {
                    window.QA_CORE.UI.showToast("KPI 리포트가 클립보드에 복사되었습니다.");
                } else {
                    alert("리포트가 성공적으로 복사되었습니다.");
                }
            });
        };
    },

    renderDynamicTcRows() {
        const zone = document.getElementById('kpi-tc-dynamic-zone');
        if (!zone) return;
        zone.innerHTML = '';

        this.tcItems.forEach(item => {
            const row = document.createElement('div');
            row.style.cssText = 'display: flex; gap: 8px; align-items: center; background: #ffffff; padding: 12px; border-radius: 8px; border: 1px solid #e2e8f0; box-shadow:0 1px 2px rgba(0,0,0,0.02);';
            row.innerHTML = `
                <input type="text" class="tc-poc" data-id="${item.id}" value="${item.poc}" style="width: 70px; padding: 8px; border:1px solid #cbd5e0; border-radius:6px; font-size:12px; text-align:center; background:#fff; color:#000;">
                <input type="text" class="tc-title" data-id="${item.id}" value="${item.title}" style="flex: 2; padding: 8px; border:1px solid #cbd5e0; border-radius:6px; font-size:12px; background:#fff; color:#000;" placeholder="일정 명칭">
                <input type="text" class="tc-ticket" data-id="${item.id}" value="${item.ticket}" style="flex: 1; padding: 8px; border:1px solid #cbd5e0; border-radius:6px; font-size:12px; background:#fff; color:#000;" placeholder="티켓 번호">
                <input type="number" class="tc-count" data-id="${item.id}" value="${item.count}" style="width: 80px; padding: 8px; border:1px solid #cbd5e0; border-radius:6px; font-size:12px; text-align:right; background:#fff; color:#000;">
                <label style="font-size: 11px; font-weight: 600; color:#4a5568; display: flex; align-items: center; gap: 4px; white-space: nowrap; cursor:pointer;">
                    <input type="checkbox" class="tc-dev-chk" data-id="${item.id}" ${item.deviceChecked ? 'checked' : ''} style="cursor:pointer;"> 단말 2대
                </label>
                <button class="tc-del-btn" data-id="${item.id}" style="background: none; border: none; cursor: pointer; color: #e53e3e; padding: 6px; font-size:13px;">🗑️</button>
            `;

            row.querySelector('.tc-poc').oninput = (e) => { item.poc = e.target.value; this.compileKpiReport(); };
            row.querySelector('.tc-title').oninput = (e) => { item.title = e.target.value; this.compileKpiReport(); };
            row.querySelector('.tc-ticket').oninput = (e) => { item.ticket = e.target.value; this.compileKpiReport(); };
            row.querySelector('.tc-count').oninput = (e) => { item.count = parseInt(e.target.value, 10) || 0; this.compileKpiReport(); };
            row.querySelector('.tc-dev-chk').onchange = (e) => { item.deviceChecked = e.target.checked; this.compileKpiReport(); };
            row.querySelector('.tc-del-btn').onclick = () => {
                this.tcItems = this.tcItems.filter(t => t.id !== item.id);
                this.renderDynamicTcRows();
                this.compileKpiReport();
            };
            zone.appendChild(row);
        });
    },

    triggerAutoSaveIndicator() {
        let indicator = document.getElementById('kpi-auto-save-toast');
        if (!indicator) {
            indicator = document.createElement('div');
            indicator.id = 'kpi-auto-save-toast';
            indicator.style.cssText = 'position: fixed; top: 15px; left: 50%; transform: translateX(-50%); background: #2d3748; color:#fff; padding: 8px 18px; border-radius: 20px; font-size: 12px; font-weight: bold; z-index: 10000; display: none; align-items: center; gap: 6px; border:1px solid #4a5568;';
            document.body.appendChild(indicator);
        }
        const now = new Date();
        indicator.innerHTML = `💾 ${now.getHours()}:${String(now.getMinutes()).padStart(2, '0')} 폼 데이터 자동 저장됨`;
        indicator.style.display = 'flex';
        setTimeout(() => { indicator.style.display = 'none'; }, 2000);
    },

    generateAiContributionScript() {
        const blocker = parseInt(document.getElementById('kpi-df-blocker').value, 10) || 0;
        const critical = parseInt(document.getElementById('kpi-df-critical').value, 10) || 0;
        const totalDefects = blocker + critical + (parseInt(document.getElementById('kpi-df-major').value, 10) || 0) + (parseInt(document.getElementById('kpi-df-minor').value, 10) || 0) + (parseInt(document.getElementById('kpi-df-trivial').value, 10) || 0);
        const teamAvg = parseInt(document.getElementById('kpi-df-team-avg').value, 10) || 0;
        const diff = totalDefects - teamAvg;
        const totalTc = this.tcItems.reduce((acc, curr) => acc + curr.count, 0);

        const narrative = `금월 service 품질 분석 결과, 총 ${totalDefects}건의 결함을 식별하여 잠재적 리스크를 사전에 차단하였습니다. 이는 전월 팀 평균 대비 ${Math.abs(diff)}건 상회하는 수치로 품질 지표 향상에 기여했습니다. 특히 Blocker/Critical 등급의 주요 결함을 선제 억제하여 서비스 구동 안전성을 확보했습니다.

검증 수행 측면에서는 포설된 업무 트랙을 따라 총 ${totalTc}건의 테스트 케이스(TC)를 완수했으며, 멀티 디바이스 테스트 체계를 가동해 결함 검출력을 고도화했습니다.

자산 현황 관리 부문에서도 본인 영역의 TC 작성 및 최신화 아키텍처 공정을 충실히 수행하여, 당월 총 ${this.writeCount}건의 테스트 자산 고도화 누적 성과를 달성함으로써 검증 리드의 신뢰성을 보장했습니다.`;
        
        document.getElementById('kpi-contribution-narrative').value = narrative;
        this.compileKpiReport();
    },

    /**
     * [출력 엔진 고도화] 달력 비동기 취합 작성/수정 스펙을 보고서 데이터 체인에 자동 결합
     */
    compileKpiReport() {
        const previewField = document.getElementById('kpi-display-preview-text');
        if (!previewField) return;

        if (this.activeSubTab === "1") {
            const b = parseInt(document.getElementById('kpi-df-blocker').value, 10) || 0;
            const c = parseInt(document.getElementById('kpi-df-critical').value, 10) || 0;
            const j = parseInt(document.getElementById('kpi-df-major').value, 10) || 0;
            const n = parseInt(document.getElementById('kpi-df-minor').value, 10) || 0;
            const t = parseInt(document.getElementById('kpi-df-trivial').value, 10) || 0;
            const total = b + c + j + n + t;
            const teamAvg = parseInt(document.getElementById('kpi-df-team-avg').value, 10) || 0;
            const diff = total - teamAvg;

            let tcRowsText = "";
            let pocGroups = {};
            this.tcItems.forEach(item => {
                if (!pocGroups[item.poc]) pocGroups[item.poc] = { total: 0, details: [] };
                pocGroups[item.poc].total += item.count;
                pocGroups[item.poc].details.push(` - ${item.title ? item.title : '미지정'} ${item.ticket ? '(' + item.ticket + ')' : ''}  ${item.count}건${item.deviceChecked ? ' (단말 2대)' : ''}`);
            });

            Object.keys(pocGroups).forEach(poc => {
                tcRowsText += `\n* ${poc} : ${pocGroups[poc].total}개\n` + pocGroups[poc].details.join('\n');
            });

            const selfTcText = document.getElementById('kpi-self-tc-text') ? document.getElementById('kpi-self-tc-text').value : "-";

            // 💡 [최종 조립] 리포트 하단에 자동 취합된 TC 작성/수정 성과 지표 가드를 정밀 마운팅
            previewField.value = `Defect 검출 개수 : 총 ${total}개\n - Blocker ${b}개\n - Critical ${c}개\n - Major ${j}개\n - Minor ${n}개\n - Trivial ${t}개\n\n전월 팀 평균 Defect 검출 개수 : ${teamAvg}개 (${diff >= 0 ? diff + '개 상승' : Math.abs(diff) + '개 하락'})\n\nTC 수행 업무${tcRowsText}\n\nTC 작성 및 수정 업무 :\n - 당월 자동 취합 건수 : ${this.writeCount}개\n - 세부 활동 명세 :\n${selfTcText}`;
        } else if (this.activeSubTab === "2") {
            previewField.value = document.getElementById('kpi-contribution-narrative').value;
        } else {
            previewField.value = "개인 역량 지표 레코드가 비어 있습니다.";
        }
    }
};

if (window.QA_CORE.SkillManager && typeof window.QA_CORE.SkillManager.register === 'function') {
    window.QA_CORE.SkillManager.register('KpiModulePlugin', window.QA_CORE.KpiModule);
}
