/**
 * [개인 KPI 관리 모듈 - Glassmorphism UI & 리포트 통합판]
 * 제공해주신 레이아웃에 요청하신 월간 업무성과 리포트의 모든 필드와 산출 로직을 완벽히 병합했습니다.
 */

export const KPI_TEMPLATE = `
    <div class="kpi-main-container" style="display: flex; gap: 24px; width: 100%; flex-direction: row; align-items: flex-start; padding: 4px; box-sizing: border-box;">
        <div class="kpi-builder-zone" style="flex: 1.8; display: flex; flex-direction: column; gap: 20px;">
            <div class="card-panel layout-vertical" style="position: relative; background: #ffffff; padding: 24px; border-radius: 12px; box-shadow: 0 4px 18px rgba(0, 0, 0, 0.03); border: 1px solid #e2e8f0;">
                <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom: 24px;">
                    <h2 style="font-size: 1.25rem; font-weight: 700; color: #1a202c; display: flex; align-items: center; gap: 8px; margin:0; letter-spacing: -0.5px;">
                        <span style="background: #edf2f7; padding: 6px; border-radius: 8px;">📊</span> 개인 KPI 목표 수행 현황
                    </h2>
                    <div style="display:flex; align-items:center; gap:8px;">
                        <label style="font-size:13px; font-weight:700;">평가 월:</label>
                        <input type="number" id="kpi-month" value="1" min="1" max="12" style="width:50px; padding:6px; border:1px solid #cbd5e0; border-radius:6px; text-align:center;">
                        <span style="font-size:13px; font-weight:700;">월</span>
                    </div>
                </div>
                
                <div class="kpi-sub-tabs" style="display: flex; background: #f1f3f5; padding: 5px; border-radius: 8px; margin-bottom: 24px; border: 1px solid #e2e8f0;">
                    <button class="kpi-sub-tab-btn active" data-subtab="1" style="flex: 1; border: none; padding: 10px; font-size: 13px; font-weight: 700; border-radius: 6px; cursor: pointer; background: #ffffff; color: #3182ce; box-shadow: 0 2px 4px rgba(0,0,0,0.04); transition: all 0.2s ease;">1. 업무 성과</button>
                    <button class="kpi-sub-tab-btn" data-subtab="2" style="flex: 1; border: none; padding: 10px; font-size: 13px; font-weight: 600; border-radius: 6px; cursor: pointer; background: none; color: #718096; transition: all 0.2s ease;">2. 기여도/근태</button>
                    <button class="kpi-sub-tab-btn" data-subtab="3" style="flex: 1; border: none; padding: 10px; font-size: 13px; font-weight: 600; border-radius: 6px; cursor: pointer; background: none; color: #718096; transition: all 0.2s ease;">3. 역량 강화</button>
                </div>

                <!-- 1. 업무 성과 탭 -->
                <div id="kpi-sub-panel-1" class="kpi-sub-panel active-panel">
                    <div style="display:grid; grid-template-columns:1fr 1fr 1fr; gap:12px; margin-bottom:16px;">
                        <div style="display:flex; flex-direction:column; gap:4px;"><label style="font-size:12px; font-weight:600; color:#4a5568;">스프린트 건수</label><input type="number" id="kpi-sprint-cnt" value="0" style="padding:8px; border:1px solid #cbd5e0; border-radius:6px; outline:none;"></div>
                        <div style="display:flex; flex-direction:column; gap:4px;"><label style="font-size:12px; font-weight:600; color:#4a5568;">프로젝트 건수</label><input type="number" id="kpi-proj-cnt" value="0" style="padding:8px; border:1px solid #cbd5e0; border-radius:6px; outline:none;"></div>
                        <div style="display:flex; flex-direction:column; gap:4px;"><label style="font-size:12px; font-weight:600; color:#4a5568;">JIRA 티켓 처리</label><input type="number" id="kpi-jira-cnt" value="0" style="padding:8px; border:1px solid #cbd5e0; border-radius:6px; outline:none;"></div>
                    </div>
                    <div style="display:flex; flex-direction:column; gap:12px; margin-bottom:24px;">
                        <div style="display:flex; flex-direction:column; gap:4px;"><label style="font-size:12px; font-weight:600; color:#4a5568;">스프린트 상세 내용</label><textarea id="kpi-sprint-txt" rows="2" placeholder="예) [상품통합] 클레임 상품 통합 쿼리 수정" style="padding:8px; border:1px solid #cbd5e0; border-radius:6px; resize:vertical; outline:none; font-family:inherit;"></textarea></div>
                        <div style="display:flex; flex-direction:column; gap:4px;"><label style="font-size:12px; font-weight:600; color:#4a5568;">프로젝트 상세 내용</label><textarea id="kpi-proj-txt" rows="2" placeholder="예) 통합 상담 시스템(new CO) 구축" style="padding:8px; border:1px solid #cbd5e0; border-radius:6px; resize:vertical; outline:none; font-family:inherit;"></textarea></div>
                    </div>

                    <h3 style="font-size: 14px; font-weight: 700; color: #2b6cb0; margin-bottom: 12px; display: flex; align-items: center; gap: 6px;">🔹 Defect 검출 (자동 합산)</h3>
                    <div style="display:grid; grid-template-columns:1fr 1fr 1fr; gap:12px; background: #f8fafc; padding: 16px; border-radius: 10px; border: 1px solid #e2e8f0; margin-bottom: 24px;">
                        <div style="display:flex; align-items:center; justify-content:space-between;"><label style="font-size:12px; font-weight:600;">Blocker</label><input type="number" id="kpi-df-blocker" value="0" style="width:60px; padding:6px; border:1px solid #cbd5e0; border-radius:6px;"></div>
                        <div style="display:flex; align-items:center; justify-content:space-between;"><label style="font-size:12px; font-weight:600;">Critical</label><input type="number" id="kpi-df-critical" value="0" style="width:60px; padding:6px; border:1px solid #cbd5e0; border-radius:6px;"></div>
                        <div style="display:flex; align-items:center; justify-content:space-between;"><label style="font-size:12px; font-weight:600;">Major</label><input type="number" id="kpi-df-major" value="0" style="width:60px; padding:6px; border:1px solid #cbd5e0; border-radius:6px;"></div>
                        <div style="display:flex; align-items:center; justify-content:space-between;"><label style="font-size:12px; font-weight:600;">Minor</label><input type="number" id="kpi-df-minor" value="0" style="width:60px; padding:6px; border:1px solid #cbd5e0; border-radius:6px;"></div>
                        <div style="display:flex; align-items:center; justify-content:space-between;"><label style="font-size:12px; font-weight:600;">Trivial</label><input type="number" id="kpi-df-trivial" value="0" style="width:60px; padding:6px; border:1px solid #cbd5e0; border-radius:6px;"></div>
                    </div>

                    <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 12px;">
                        <h3 style="font-size: 14px; font-weight: 700; color: #2d3748; display: flex; align-items: center; gap: 6px;">🔹 TC 수행 업무 (PoC별 달력 취합)</h3>
                        <button class="btn-action" id="btn-kpi-add-tc" style="font-size: 11px; padding: 6px 12px; background: #3182ce; color: white; border:none; border-radius:6px; font-weight:600; cursor:pointer;">➕ TC 추가</button>
                    </div>
                    <div id="kpi-tc-dynamic-zone" style="display: flex; flex-direction: column; gap: 8px; margin-bottom: 12px;"></div>
                </div>

                <!-- 2. 기여도 및 근태 탭 -->
                <div id="kpi-sub-panel-2" class="kpi-sub-panel" style="display: none;">
                    <h3 style="font-size: 14px; font-weight: 700; color: #2d3748; margin-bottom: 16px;">🔹 팀 기여도 및 업무태도 평가</h3>
                    <div style="display:grid; grid-template-columns:1fr 1fr 1fr; gap:12px; margin-bottom:16px;">
                        <div style="display:flex; flex-direction:column; gap:4px;"><label style="font-size:12px; font-weight:600; color:#4a5568;">야근 횟수</label><input type="number" id="kpi-night-cnt" value="0" style="padding:8px; border:1px solid #cbd5e0; border-radius:6px;"></div>
                        <div style="display:flex; flex-direction:column; gap:4px;"><label style="font-size:12px; font-weight:600; color:#4a5568;">특근 횟수</label><input type="number" id="kpi-weekend-cnt" value="0" style="padding:8px; border:1px solid #cbd5e0; border-radius:6px;"></div>
                        <div style="display:flex; flex-direction:column; gap:4px;"><label style="font-size:12px; font-weight:600; color:#4a5568;">긴급 배포 투입</label><input type="number" id="kpi-emergency-cnt" value="0" style="padding:8px; border:1px solid #cbd5e0; border-radius:6px;"></div>
                    </div>
                    <div style="display:grid; grid-template-columns:1fr 1fr; gap:12px; margin-bottom:16px;">
                        <div style="display:flex; flex-direction:column; gap:4px;"><label style="font-size:12px; font-weight:600; color:#4a5568;">업무 지원 내용</label><input type="text" id="kpi-support-txt" style="padding:8px; border:1px solid #cbd5e0; border-radius:6px;"></div>
                        <div style="display:flex; flex-direction:column; gap:4px;"><label style="font-size:12px; font-weight:600; color:#4a5568;">추가 근무 시간</label><input type="number" id="kpi-extra-hours" value="0" style="padding:8px; border:1px solid #cbd5e0; border-radius:6px;"></div>
                    </div>
                    <div style="display:flex; flex-direction:column; gap:4px; margin-bottom:24px;">
                        <label style="font-size:12px; font-weight:600; color:#4a5568;">추가 업무 명세</label>
                        <input type="text" id="kpi-extra-tasks" style="padding:8px; border:1px solid #cbd5e0; border-radius:6px;">
                    </div>

                    <hr style="border: none; border-top: 1px solid #e2e8f0; margin: 24px 0;">
                    <h3 style="font-size: 14px; font-weight: 700; color: #2d3748; margin-bottom: 16px;">🔹 기본 근태 평가</h3>
                    <div style="display:flex; flex-direction:column; gap:4px; width:33%;">
                        <label style="font-size:12px; font-weight:600; color:#4a5568;">개인 지각 횟수</label>
                        <input type="number" id="kpi-late-cnt" value="0" style="padding:8px; border:1px solid #cbd5e0; border-radius:6px;">
                    </div>
                </div>

                <!-- 3. 개인 역량 강화 탭 -->
                <div id="kpi-sub-panel-3" class="kpi-sub-panel" style="display: none;">
                    <h3 style="font-size: 14px; font-weight: 700; color: #2d3748; margin-bottom: 16px;">🔹 개인별 전문성 강화</h3>
                    <div style="display:grid; grid-template-columns:1fr 1fr; gap:12px; margin-bottom:16px;">
                        <div style="display:flex; flex-direction:column; gap:4px;"><label style="font-size:12px; font-weight:600; color:#4a5568;">자격증 응시 횟수</label><input type="number" id="kpi-cert-try" value="0" style="padding:8px; border:1px solid #cbd5e0; border-radius:6px;"></div>
                        <div style="display:flex; flex-direction:column; gap:4px;"><label style="font-size:12px; font-weight:600; color:#4a5568;">사내/외부교육 횟수</label><input type="number" id="kpi-edu-cnt" value="0" style="padding:8px; border:1px solid #cbd5e0; border-radius:6px;"></div>
                    </div>
                    <div style="display:flex; flex-direction:column; gap:12px; margin-bottom:24px;">
                        <div style="display:flex; flex-direction:column; gap:4px;"><label style="font-size:12px; font-weight:600; color:#4a5568;">오프라인 교육 상세</label><textarea id="kpi-offline-edu" rows="2" placeholder="예) 데이터 품질 테스트 기초 / 5월 14일" style="padding:8px; border:1px solid #cbd5e0; border-radius:6px; resize:vertical; font-family:inherit;"></textarea></div>
                        <div style="display:flex; flex-direction:column; gap:4px;"><label style="font-size:12px; font-weight:600; color:#4a5568;">보유 자격증 현황</label><textarea id="kpi-cert-owned" rows="2" placeholder="예) ISTQB : 2025년 8월" style="padding:8px; border:1px solid #cbd5e0; border-radius:6px; resize:vertical; font-family:inherit;"></textarea></div>
                    </div>
                </div>
            </div>
        </div>
        
        <!-- 우측 통합 리포트 뷰어 영역 -->
        <div class="kpi-preview-zone" style="flex: 1.2; display: flex; flex-direction: column; gap: 16px; position: sticky; top: 20px; min-width: 380px;">
            <div class="card-panel layout-vertical" style="height: 100%; min-height: 650px; background: linear-gradient(145deg, #1e293b, #0f172a); color: #fff; padding: 24px; border-radius: 12px; box-shadow: 0 10px 25px rgba(15, 23, 42, 0.15); border: 1px solid #334155; box-sizing: border-box; display:flex; flex-direction:column;">
                <div style="font-size: 12px; color: #94a3b8; font-weight: 700; margin-bottom: 16px; display: flex; align-items: center; gap: 6px; text-transform: uppercase; letter-spacing: 0.5px;">
                    <span style="background: rgba(255,255,255,0.1); padding: 4px 6px; border-radius: 4px;">REPORT</span> 통합 업무성과 리포트 (Auto-Sync)
                </div>
                <textarea id="kpi-display-preview-text" readonly style="background: rgba(15, 23, 42, 0.6); border: 1px solid #334155; padding: 18px; border-radius: 8px; flex: 1; width: 100%; font-family: 'Malgun Gothic', sans-serif; font-size: 13px; line-height: 1.65; color: #f8fafc; resize: none; margin-bottom: 20px; overflow-y: auto; outline:none; box-sizing: border-box;"></textarea>
                <button class="btn-action" id="btn-kpi-copy-clipboard" style="background: #7c3aed; color: white; width: 100%; padding: 14px; font-weight: 700; font-size: 14px; border: none; border-radius: 8px; cursor: pointer; transition: all 0.2s ease; box-shadow: 0 4px 12px rgba(124, 58, 237, 0.3);">📋 전체 복사하기</button>
            </div>
        </div>
    </div>
`;

window.QA_CORE = window.QA_CORE || {};
window.QA_CORE.KpiModule = {
    activeSubTab: "1",
    state: {
        month: new Date().getMonth() + 1,
        sprintCnt: 0, projCnt: 0, jiraCnt: 0,
        sprintText: "", projText: "",
        dfBlocker: 0, dfCritical: 0, dfMajor: 0, dfMinor: 0, dfTrivial: 0,
        nightCnt: 0, weekendCnt: 0, emergencyCnt: 0, supportText: "", extraHours: 0, extraTasks: "",
        lateCnt: 0,
        certTry: 0, eduCnt: 0, offlineEdu: "", certOwned: ""
    },
    tcItems: [],
    writeCount: 0,

    init() {
        const panelZone = document.getElementById('tab-panel-kpi');
        if (panelZone) panelZone.innerHTML = KPI_TEMPLATE;
        
        this.loadData();
        this.fillInputsFromState();
        
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

    loadData() {
        const data = localStorage.getItem('QA_KPI_DATA_V2');
        if (data) {
            try { 
                const parsed = JSON.parse(data);
                this.state = { ...this.state, ...parsed.state };
                this.tcItems = parsed.tcItems || [];
                this.writeCount = parsed.writeCount || 0;
            } 
            catch (e) { console.error(e); }
        }
    },

    saveData() {
        localStorage.setItem('QA_KPI_DATA_V2', JSON.stringify({
            state: this.state,
            tcItems: this.tcItems,
            writeCount: this.writeCount
        }));
    },

    fillInputsFromState() {
        const map = {
            'kpi-month': 'month', 'kpi-sprint-cnt': 'sprintCnt', 'kpi-proj-cnt': 'projCnt', 'kpi-jira-cnt': 'jiraCnt',
            'kpi-sprint-txt': 'sprintText', 'kpi-proj-txt': 'projText',
            'kpi-df-blocker': 'dfBlocker', 'kpi-df-critical': 'dfCritical', 'kpi-df-major': 'dfMajor', 'kpi-df-minor': 'dfMinor', 'kpi-df-trivial': 'dfTrivial',
            'kpi-night-cnt': 'nightCnt', 'kpi-weekend-cnt': 'weekendCnt', 'kpi-emergency-cnt': 'emergencyCnt',
            'kpi-support-txt': 'supportText', 'kpi-extra-hours': 'extraHours', 'kpi-extra-tasks': 'extraTasks',
            'kpi-late-cnt': 'lateCnt',
            'kpi-cert-try': 'certTry', 'kpi-edu-cnt': 'eduCnt', 'kpi-offline-edu': 'offlineEdu', 'kpi-cert-owned': 'certOwned'
        };
        for (let id in map) {
            const el = document.getElementById(id);
            if (el) el.value = this.state[map[id]];
        }
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
        if (savedCount) this.writeCount = parseInt(savedCount, 10) || 0;
    },

    _handleTcSync(e) {
        if (e && e.detail) {
            const { count, year, month } = e.detail;
            this.injectOrUpdateTcItem(count, year, month);
            if (document.getElementById('kpi-tc-dynamic-zone')) {
                this.renderDynamicTcRows();
                this.saveData();
                this.compileKpiReport();
            }
        }
    },

    _handleWriteSync(e) {
        if (e && e.detail) {
            this.writeCount = e.detail.count;
            this.saveData();
            this.compileKpiReport();
        }
    },

    injectOrUpdateTcItem(count, year, month) {
        const titleText = `${year}년 ${month}월 자동 취합 건수`;
        const existingItem = this.tcItems.find(item => item.title === titleText);
        if (existingItem) existingItem.count = count;
        else {
            this.tcItems.push({ id: 'auto-' + Date.now(), poc: '달력취합', title: titleText, ticket: 'CAL-SYNC', count: count, deviceChecked: false });
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
            };
        });

        const inputMap = {
            'kpi-month': 'month', 'kpi-sprint-cnt': 'sprintCnt', 'kpi-proj-cnt': 'projCnt', 'kpi-jira-cnt': 'jiraCnt',
            'kpi-sprint-txt': 'sprintText', 'kpi-proj-txt': 'projText',
            'kpi-df-blocker': 'dfBlocker', 'kpi-df-critical': 'dfCritical', 'kpi-df-major': 'dfMajor', 'kpi-df-minor': 'dfMinor', 'kpi-df-trivial': 'dfTrivial',
            'kpi-night-cnt': 'nightCnt', 'kpi-weekend-cnt': 'weekendCnt', 'kpi-emergency-cnt': 'emergencyCnt',
            'kpi-support-txt': 'supportText', 'kpi-extra-hours': 'extraHours', 'kpi-extra-tasks': 'extraTasks',
            'kpi-late-cnt': 'lateCnt',
            'kpi-cert-try': 'certTry', 'kpi-edu-cnt': 'eduCnt', 'kpi-offline-edu': 'offlineEdu', 'kpi-cert-owned': 'certOwned'
        };

        for (let id in inputMap) {
            const el = document.getElementById(id);
            if (el) {
                el.addEventListener('input', (e) => {
                    const key = inputMap[id];
                    if (el.type === 'number') this.state[key] = parseInt(e.target.value, 10) || 0;
                    else this.state[key] = e.target.value;
                    this.saveData();
                    this.compileKpiReport();
                });
            }
        }

        document.getElementById('btn-kpi-add-tc').onclick = () => {
            this.tcItems.push({ id: Date.now(), poc: '기타', title: '', ticket: '', count: 0, deviceChecked: false });
            this.renderDynamicTcRows();
            this.saveData();
            this.compileKpiReport();
        };

        document.getElementById('btn-kpi-copy-clipboard').onclick = () => {
            const text = document.getElementById('kpi-display-preview-text').value;
            if (!text.trim()) return;
            navigator.clipboard.writeText(text).then(() => {
                if (window.QA_CORE.UI && window.QA_CORE.UI.showToast) window.QA_CORE.UI.showToast("✅ KPI 리포트가 복사되었습니다.");
                else alert("KPI 리포트가 복사되었습니다.");
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
                <input type="number" class="tc-count" data-id="${item.id}" value="${item.count}" style="width: 80px; padding: 8px; border:1px solid #cbd5e0; border-radius:6px; font-size:12px; text-align:right; background:#fff; color:#000;">
                <button class="tc-del-btn" data-id="${item.id}" style="background: none; border: none; cursor: pointer; color: #e53e3e; padding: 6px; font-size:13px;">🗑️</button>
            `;

            row.querySelector('.tc-poc').oninput = (e) => { item.poc = e.target.value; this.saveData(); this.compileKpiReport(); };
            row.querySelector('.tc-title').oninput = (e) => { item.title = e.target.value; this.saveData(); this.compileKpiReport(); };
            row.querySelector('.tc-count').oninput = (e) => { item.count = parseInt(e.target.value, 10) || 0; this.saveData(); this.compileKpiReport(); };
            row.querySelector('.tc-del-btn').onclick = () => {
                this.tcItems = this.tcItems.filter(t => t.id !== item.id);
                this.renderDynamicTcRows();
                this.saveData();
                this.compileKpiReport();
            };
            zone.appendChild(row);
        });
    },

    compileKpiReport() {
        const previewField = document.getElementById('kpi-display-preview-text');
        if (!previewField) return;

        const s = this.state;
        const defectTotal = s.dfBlocker + s.dfCritical + s.dfMajor + s.dfMinor + s.dfTrivial;
        const tcTotal = this.tcItems.reduce((acc, curr) => acc + curr.count, 0) + this.writeCount;

        const report = `■ ${s.month}월 업무성과 정량적 도출 평가
스프린트 : ${s.sprintCnt}건 / 프로젝트 : ${s.projCnt}건 / Defect : ${defectTotal}건 / TC 작성 및 수행 : ${tcTotal}건 

JIRA : ${s.jiraCnt}개

스프린트
${s.sprintText}
프로젝트
${s.projText}

■ ${s.month}월 팀 기여도 및 업무태도 평가
야근 : ${s.nightCnt}회 / 특근 : ${s.weekendCnt}회 / 긴급 배포 투입 : ${s.emergencyCnt}회
업무 지원  :  ${s.supportText}
추가 근무 시간 : ${s.extraHours}시간
추가 업무 : ${s.extraTasks}

■ ${s.month}월 기본 근태 평가
개인 지각 횟수 : ${s.lateCnt}회

■ 개인별 전문성 강화
자격증 응시 : ${s.certTry}회 , 사내/외부교육 : ${s.eduCnt}회

오프라인 교육 
${s.offlineEdu}

보유 자격증 
${s.certOwned}`;

        previewField.value = report;
    }
};

if (window.QA_CORE.SkillManager && typeof window.QA_CORE.SkillManager.register === 'function') {
    window.QA_CORE.SkillManager.register('kpi', window.QA_CORE.KpiModule);
}
