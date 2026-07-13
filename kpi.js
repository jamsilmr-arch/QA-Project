// [무결성 복구] 유실되었던 Glassmorphism 스타일 마크업 레이아웃 양식을 상단에 재배치 완결
export const KPI_TEMPLATE = `
    <div class="kpi-main-container" style="display: flex; gap: 24px; width: 100%; flex-direction: row; align-items: flex-start; padding: 4px; box-sizing: border-box;">
        <div class="kpi-builder-zone" style="flex: 1.8; display: flex; flex-direction: column; gap: 20px;">
            <div class="card-panel layout-vertical" style="position: relative; background: #ffffff; padding: 24px; border-radius: 12px; box-shadow: 0 4px 18px rgba(0, 0, 0, 0.03); border: 1px solid #e2e8f0;">
                <h2 style="font-size: 1.25rem; font-weight: 700; color: #1a202c; margin-bottom: 24px; display: flex; align-items: center; gap: 8px; letter-spacing: -0.5px;">
                    <span style="background: #edf2f7; padding: 6px; border-radius: 8px;">📊</span> 개인 KPI 목표 수행 현황
                </h2>
                <div class="kpi-sub-tabs" style="display: flex; background: #f1f3f5; padding: 5px; border-radius: 8px; margin-bottom: 24px; border: 1px solid #e2e8f0;">
                    <button class="kpi-sub-tab-btn active" data-subtab="1" style="flex: 1; border: none; padding: 10px; font-size: 13px; font-weight: 700; border-radius: 6px; cursor: pointer; background: #ffffff; color: #3182ce; box-shadow: 0 2px 4px rgba(0,0,0,0.04); transition: all 0.2s ease;">1. 업무 성과</button>
                    <button class="kpi-sub-tab-btn" data-subtab="2" style="flex: 1; border: none; padding: 10px; font-size: 13px; font-weight: 600; border-radius: 6px; cursor: pointer; background: none; color: #718096; transition: all 0.2s ease;">2. 팀 기여도</button>
                    <button class="kpi-sub-tab-btn" data-subtab="3" style="flex: 1; border: none; padding: 10px; font-size: 13px; font-weight: 600; border-radius: 6px; cursor: pointer; background: none; color: #718096; transition: all 0.2s ease;">3. 개인 역량</button>
                </div>
                <div id="kpi-sub-panel-1" class="kpi-sub-panel active-panel">
                    <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 16px;">
                        <h3 style="font-size: 14px; font-weight: 700; color: #2b6cb0; display: flex; align-items: center; gap: 6px;">🔹 1. Defect 검출 개수</h3>
                        <button class="btn-cal-nav" id="btn-reset-defects" style="font-size: 11px; padding: 5px 10px; background: #fff; color: #e53e3e; border: 1px solid #fed7d7; border-radius: 6px; font-weight: 600;">🗑️ 현재 탭 초기화</button>
                    </div>
                    <div class="layout-vertical" style="gap: 12px; background: #f8fafc; padding: 20px; border-radius: 10px; border: 1px solid #e2e8f0; margin-bottom: 24px;">
                        <div class="form-group style-horizontal" style="display:flex; align-items:center; gap:12px;"><label style="width: 90px; font-size:13px; font-weight:600; color:#4a5568; text-align:right;">Blocker</label><input type="number" id="kpi-df-blocker" value="0" style="flex:1; padding:8px 12px; border:1px solid #cbd5e0; border-radius:6px;"></div>
                        <div class="form-group style-horizontal" style="display:flex; align-items:center; gap:12px;"><label style="width: 90px; font-size:13px; font-weight:600; color:#4a5568; text-align:right;">Critical</label><input type="number" id="kpi-df-critical" value="0" style="flex:1; padding:8px 12px; border:1px solid #cbd5e0; border-radius:6px;"></div>
                        <div class="form-group style-horizontal" style="display:flex; align-items:center; gap:12px;"><label style="width: 90px; font-size:13px; font-weight:600; color:#4a5568; text-align:right;">Major</label><input type="number" id="kpi-df-major" value="0" style="flex:1; padding:8px 12px; border:1px solid #cbd5e0; border-radius:6px;"></div>
                        <div class="form-group style-horizontal" style="display:flex; align-items:center; gap:12px;"><label style="width: 90px; font-size:13px; font-weight:600; color:#4a5568; text-align:right;">Minor</label><input type="number" id="kpi-df-minor" value="0" style="flex:1; padding:8px 12px; border:1px solid #cbd5e0; border-radius:6px;"></div>
                        <div class="form-group style-horizontal" style="display:flex; align-items:center; gap:12px;"><label style="width: 90px; font-size:13px; font-weight:600; color:#4a5568; text-align:right;">Trivial</label><input type="number" id="kpi-df-trivial" value="0" style="flex:1; padding:8px 12px; border:1px solid #cbd5e0; border-radius:6px;"></div>
                        <hr style="border: none; border-top: 1px solid #e2e8f0; margin: 12px 0;">
                        <div class="form-group style-horizontal" style="display:flex; align-items:center; gap:12px;">
                            <label style="width: 90px; font-size:12px; font-weight:700; color:#2d3748; text-align:right;">전월 팀 평균</label>
                            <input type="number" id="kpi-df-team-avg" value="0" style="flex:1; padding:8px 12px; border:1px solid #cbd5e0; border-radius:6px; background:#fff;">
                        </div>
                    </div>
                    <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 16px;">
                        <h3 style="font-size: 14px; font-weight: 700; color: #2d3748; display: flex; align-items: center; gap: 6px;">🔹 2. TC 수행 업무 (PoC별 취합)</h3>
                        <button class="btn-action" id="btn-kpi-add-tc" style="font-size: 11px; padding: 6px 12px; background: #3182ce; color: white; border:none; border-radius:6px; font-weight:600;">➕ TC 추가</button>
                    </div>
                    <div id="kpi-tc-dynamic-zone" style="display: flex; flex-direction: column; gap: 10px; margin-bottom: 24px;"></div>
                    <h3 style="font-size: 14px; font-weight: 700; color: #2b6cb0; margin-bottom: 12px; display: flex; align-items: center; gap: 6px;">🔹 3. 본인영역 TC 작성 및 수정 업무</h3>
                    <textarea id="kpi-self-tc-text" rows="4" style="width:100%; resize:none; border:1px solid #cbd5e0; border-radius:8px; padding:12px; font-size:13px; line-height:1.5; outline:none;" placeholder="업무 세부 명세를 기술하세요."></textarea>
                </div>
                <div id="kpi-sub-panel-2" class="kpi-sub-panel" style="display: none;">
                    <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 16px;">
                        <h3 style="font-size: 14px; font-weight: 700; color: #2d3748;">🔹 팀 기여도 및 업무태도</h3>
                        <div style="display:flex; gap:8px;">
                            <button class="btn-action" id="btn-kpi-auto-generation" style="font-size: 11px; padding: 6px 12px; background: #3182ce; color: white; border:none; border-radius:6px; font-weight:600;">✨ 성과 요약 자동 작성</button>
                            <button class="btn-cal-nav" id="btn-reset-contribution" style="font-size: 11px; padding: 6px 12px; background: #fff; color: #e53e3e; border: 1px solid #fed7d7; border-radius: 6px; font-weight: 600;">현재 탭 초기화</button>
                        </div>
                    </div>
                    <textarea id="kpi-contribution-narrative" rows="15" style="width:100%; resize:none; border:1px solid #e2e8f0; border-radius:8px; padding:16px; font-size:13px; line-height:1.6; background:#f8fafc; outline:none;" placeholder="성과 요약 단추를 누르면 스크립트가 로딩됩니다."></textarea>
                </div>
                <div id="kpi-sub-panel-3" class="kpi-sub-panel" style="display: none;">
                    <h3 style="font-size: 14px; font-weight: 700; color: #2d3748; margin-bottom: 16px;">🔹 3. 개인 역량 및 자격 검정 관리</h3>
                    <div style="background: #f8fafc; padding: 48px 0; text-align: center; color: #a0aec0; font-size: 13px; border: 1px dashed #e2e8f0; border-radius: 8px; font-weight:500;">
                        역량 개발 프로파일링 필드가 준비 중입니다.
                    </div>
                </div>
            </div>
        </div>
        <div class="kpi-preview-zone" style="flex: 1.2; display: flex; flex-direction: column; gap: 16px; position: sticky; top: 20px; min-width: 320px;">
            <div class="card-panel layout-vertical" style="height: 100%; min-height: 580px; background: linear-gradient(145deg, #1e293b, #0f172a); color: #fff; padding: 24px; border-radius: 12px; box-shadow: 0 10px 25px rgba(15, 23, 42, 0.15); border: 1px solid #334155; box-sizing: border-box; display:flex; flex-direction:column;">
                <div style="font-size: 12px; color: #94a3b8; font-weight: 700; margin-bottom: 16px; display: flex; align-items: center; gap: 6px; text-transform: uppercase; letter-spacing: 0.5px;">
                    <span style="background: rgba(255,255,255,0.1); padding: 4px 6px; border-radius: 4px;">REPORT</span> [<span id="kpi-preview-tab-name" style="color:#38bdf8;">업무 성과</span>] 리포트 미리보기
                </div>
                <textarea id="kpi-display-preview-text" readonly style="background: rgba(15, 23, 42, 0.6); border: 1px solid #334155; padding: 18px; border-radius: 8px; flex: 1; width: 100%; font-family: monospace; font-size: 12.5px; line-height: 1.65; color: #f8fafc; resize: none; margin-bottom: 20px; overflow-y: auto; outline:none; box-sizing: border-box;"></textarea>
                <button class="btn-action" id="btn-kpi-copy-clipboard" style="background: #7c3aed; color: white; width: 100%; padding: 14px; font-weight: 700; font-size: 14px; border: none; border-radius: 8px; cursor: pointer; transition: all 0.2s ease; box-shadow: 0 4px 12px rgba(124, 58, 237, 0.3);">📋 복사하기</button>
            </div>
        </div>
    </div>
`;

window.QA_CORE = window.QA_CORE || {};
window.QA_CORE.KpiModule = {
    activeSubTab: "1",
    tcItems: [],
    writeCount: 0,

    init() {
        const panelZone = document.getElementById('tab-panel-kpi');
        if (panelZone) {
            panelZone.innerHTML = KPI_TEMPLATE;
        }
        this.loadSyncedCalendarTc();
        this.loadSyncedCalendarWriteTc();

        if (!this._handleTcSyncBound) this._handleTcSyncBound = this._handleTcSync.bind(this);
        document.removeEventListener('QA_KPI_TC_DATA_SYNC', this._handleTcSyncBound);
        document.addEventListener('QA_KPI_TC_DATA_SYNC', this._handleTcSyncBound);

        if (!this._handleWriteSyncBound) this._handleWriteSyncBound = this._handleWriteSync.bind(this);
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
                alert("KPI 리포트가 복사되었습니다.");
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
        indicator.innerHTML = `💾 ${now.getHours()}:${String(now.getMinutes()).padStart(2, '0')} 폼 데이터 저장됨`;
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

        const narrative = `금월 service 품질 분석 결과, 총 ${totalDefects}건의 결함을 식별하여 잠재적 리스크를 사전에 차단하였습니다. 이는 전월 팀 평균 대비 ${Math.abs(diff)}건 상회하는 수치입니다.

검증 수행 측면에서는 포설된 업무 트랙을 따라 총 ${totalTc}건의 테스트 케이스(TC)를 완수했으며, 멀티 디바이스 테스트 체계를 가동해 결함 검출력을 고도화했습니다.

자산 현황 관리 부문에서도 본인 영역의 TC 작성 및 최신화 아키쳐 공정을 충실히 수행하여, 당월 총 ${this.writeCount}건의 테스트 자산 고도화 누적 성과를 달성했습니다.`;
        
        document.getElementById('kpi-contribution-narrative').value = narrative;
        this.compileKpiReport();
    },

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
