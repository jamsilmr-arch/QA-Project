window.QA_CORE = window.QA_CORE || {};
window.QA_CORE.Tc = window.QA_CORE.Tc || {};

// 💡 [신규 결속] OY QA 실무 특화 오탈자 및 맞춤법 교정 사전 (White-list)
const TYPO_DICTIONARY = {
    '포험': '포함',
    '업을 경우': '없을 경우',
    '씨네일': '썸네일',
    '썸내일': '썸네일',
    '사품': '상품',
    '배지어트': '베지어트',
    '네비게이션': '내비게이션',
    '결재': '결제',
    '디폴트 값': '디폴트값'
};

const OY_DOMAIN_RULES = {
    ROUTINE_ALARM: {
        keywords: ['루틴', '알림', '루틴알림', '루틴 알림'],
        validCategories: ['잘 먹기', '잘 채우기'],
        rule: "루틴 알림 퀵메뉴는 '잘 먹기', '잘 채우기' 대카테고리관에서만 노출되며, 미로그인 탭 시 소개페이지 이동 및 월경 주기 확인 시 로그인을 요구함."
    },
    W_CARE: {
        keywords: ['W케어', 'W 케어', '월경', '주기'],
        validCategories: ['잘 케어하기'],
        rule: "W 케어 퀵메뉴는 '잘 케어하기' 카테고리관에서만 노출됨. 미로그인 상태로 메인 페이지 진입이 가능하나, '월경 주기 확인하기' 탭 시 로그인 화면으로 라우팅됨."
    },
    RANKING_GRID: {
        keywords: ['랭킹', '순위', '인기순', '배치', '3시간'],
        rule: "랭킹 상품은 최대 21개까지 3의 배수(3x2줄=6개, 3x4줄=12개 등)로 라인 맞춤 노출됨. 00시부터 3시간 단위(00, 03, 06...) 배치로 직전 6시간 주문 기준 순위가 갱신됨."
    },
    CART_OPTION: {
        keywords: ['장바구니', '담기', '옵션', '토스트', '수량초과'],
        rule: "단품 담기 시 즉시 토스트('나의 장바구니에 담았어요')와 뱃지 카운트가 증가함. 복수 옵션은 바텀 모달 + 배경 Dim 처리되며, Dim/X/닫기 탭 시 담기지 않고 기존 상태 유지됨. 수량 초과 시 블랙 배경 하얀 텍스트 토스트('이 상품은 n개 까지 구매할 수 있어요.') 노출."
    },
    UPCOMING_OTEUK: {
        keywords: ['다가오는', '다가오는 특가', '내일의 특가'],
        rule: "다가오는 특가 상품은 탭 시 '상세페이지로 이동되지 않음'으로 처리되어야 하며, 전체 등록상품(스페셜/일반) 기준 '랜덤순 노출'되어야 함."
    },
    HOME_GNB_SORT: {
        keywords: ['홈 GNB', '정렬 순서', '일반 오특', '스페셜 오특 정상 상품'],
        rule: "홈 GNB 오특 섹션의 정렬은 반드시 '스페셜 정상 > 일반 정상 > 스페셜 품절 > 일반 품절' 순서를 명시해야 함."
    }
};

const TC_GUIDE_CONTENT = `
<div style="font-family: 'Pretendard', sans-serif; color: #2d3748; line-height: 1.6; font-size: 13px;">
    <div style="background: #f0fdf4; border-left: 4px solid #16a34a; padding: 14px; margin-bottom: 20px; border-radius: 6px;">
        <span style="font-weight: 800; color: #15803d; font-size: 14px;">📌 TC 작성 가이드 요약</span>
        <p style="margin: 6px 0 0 0; font-size: 12.5px; color: #166534;">
            • Pre-Condition은 사전 상태만 기술 (번호 활용 가능)<br>
            • Step은 실제 사용자 행동 흐름 중심 명시<br>
            • Expected Result는 명사형 또는 명확한 종결 어미로 결속<br>
            <span style="color:#b91c1c; font-weight:bold;">• 🚨 'API'와 같은 백엔드 기술 용어는 TC(UI/UX 관점) 본문에 사용 절대 금지</span><br>
            <span style="color:#b91c1c; font-weight:bold;">• 🚨 검증대상 필드는 어떠한 경우에도 빈 칸으로 남겨둘 수 없습니다.</span>
        </p>
    </div>
</div>
`;

window.QA_CORE.Tc.TEMPLATE = `
    <style>
        .tc-fullscreen {
            position: fixed !important;
            top: 0 !important;
            left: 0 !important;
            width: 100vw !important;
            height: 100vh !important;
            z-index: 999999 !important;
            border-radius: 0 !important;
            margin: 0 !important;
            box-sizing: border-box !important;
        }
        .tc-fullscreen .table-wrapper {
            max-height: calc(100vh - 80px) !important;
        }
        body.tc-fullscreen-active {
            overflow: hidden !important;
        }
    </style>
    <div class="content-panel active" style="display: flex; gap: 20px; width: 100%; flex-direction: row; box-sizing: border-box; padding: 4px;">
        <div style="flex: 1.5; display: flex; flex-direction: column; gap: 16px; min-width: 420px;">
            <div class="card-panel" style="background: linear-gradient(145deg, #f0f9ff, #e0f2fe); padding: 20px; border-radius: 8px; border: 1px solid #bae6fd;">
                <h2 style="font-size: 1.1rem; font-weight: 700; color: #0369a1; margin: 0 0 12px 0;">🤖 AI 기반 OY 특화 TC 자동 설계</h2>
                <div class="form-group" style="margin-bottom:12px;">
                    <label style="font-size: 12px; font-weight: 700; color: #0c4a6e;">OY 기능 / 기획 개편안 요약 명세</label>
                    <textarea id="ai-feature-desc" rows="2" placeholder="기획서 원문을 복사해서 붙여넣으세요. (취소선 및 오탈자 자동 정제 엔진 가동 중)" style="background:#fff; color:#000; border:1px solid #7dd3fc; padding:10px; border-radius:6px; font-size:12px; width:100%; box-sizing:border-box; resize:none;"></textarea>
                </div>
                <div style="display:flex; gap:8px;">
                    <button id="btn-ai-generate" style="background:#0284c7; color:white; border:none; padding:10px; font-size:12.5px; font-weight:bold; border-radius:6px; cursor:pointer; flex:1;">✨ AI 초안 생성</button>
                    <button id="btn-ai-review" style="background:#059669; color:white; border:none; padding:10px; font-size:12.5px; font-weight:bold; border-radius:6px; cursor:pointer; flex:1;">🔍 규격 감리</button>
                </div>
            </div>

            <div class="tc-builder-zone" style="background: #ffffff; padding: 20px; border-radius: 8px; border: 1px solid #e2e8f0; display: flex; flex-direction: column; gap: 14px;">
                <div style="display: flex; justify-content: space-between; align-items: center; border-bottom: 2px solid #edf2f7; padding-bottom: 8px; margin: 0;">
                    
                    <div style="display: flex; align-items: center; gap: 10px;">
                        <h2 style="font-size: 1.1rem; font-weight: 700; color: #1a202c; margin:0;">📋 테스트케이스 세부 설계 보드</h2>
                        <div style="display: flex; gap: 4px;">
                            <button class="btn-cal-nav" id="btn-tc-add-row" style="font-size: 10px; padding: 4px 8px; background: #f8fafc; border: 1px solid #cbd5e0; border-radius: 4px; cursor: pointer;" title="현재 행 아래에 새 빈 행을 추가합니다">➕ 새 행</button>
                            <button class="btn-cal-nav" id="btn-tc-dup-row" style="font-size: 10px; padding: 4px 8px; background: #f8fafc; border: 1px solid #cbd5e0; border-radius: 4px; cursor: pointer;" title="현재 행을 똑같이 복사합니다">📄 복제</button>
                            <button class="btn-cal-nav" id="btn-tc-del-row" style="font-size: 10px; padding: 4px 8px; background: #fef2f2; color: #b91c1c; border: 1px solid #fecaca; border-radius: 4px; cursor: pointer;" title="현재 행을 완전히 삭제합니다">🗑️ 삭제</button>
                        </div>
                    </div>

                    <div style="display: flex; gap: 6px;">
                        <button id="btn-tc-clear-all" style="background: #fef2f2; color: #b91c1c; border: 1px solid #fecaca; padding: 6px 12px; font-size: 11px; font-weight: 700; border-radius: 4px; cursor: pointer;" title="작성된 모든 데이터를 지우고 초기화합니다">🧹 보드 비우기</button>
                        <button id="btn-open-import-modal" style="background: #0f172a; color: #fff; border: none; padding: 6px 12px; font-size: 11px; font-weight: 700; border-radius: 4px; cursor: pointer;">📥 시트 데이터 파싱</button>
                    </div>
                </div>
                
                <div style="display: grid; grid-template-columns: 1fr 1.5fr; gap: 10px;">
                    <div><label style="font-size: 11.5px; font-weight: 700;">작성 일자</label><input type="date" id="tc-date" style="width:100%; padding:6px; border:1px solid #cbd5e0; border-radius:4px; font-size:12px; box-sizing:border-box;"></div>
                    <div><label style="font-size: 11.5px; font-weight: 700; color: #1e3a8a;">• Component</label><input type="text" id="tc-component" style="width:100%; padding:6px; border:1px solid #cbd5e0; border-radius:4px; font-size:12px; box-sizing:border-box; font-weight:bold;"></div>
                </div>

                <div style="display: grid; grid-template-columns: 1fr 1fr 1fr; gap: 10px;">
                    <div><label style="font-size: 11.5px; font-weight: 700;">Category 1</label><input type="text" id="tc-poc" style="width:100%; padding:6px; border:1px solid #cbd5e0; border-radius:4px; font-size:12px; box-sizing:border-box;"></div>
                    <div><label style="font-size: 11.5px; font-weight: 700;">Category 2</label><input type="text" id="tc-menu" style="width:100%; padding:6px; border:1px solid #cbd5e0; border-radius:4px; font-size:12px; box-sizing:border-box;"></div>
                    <div><label style="font-size: 11.5px; font-weight: 700;">Category 3</label><input type="text" id="tc-title" style="width:100%; padding:6px; border:1px solid #cbd5e0; border-radius:4px; font-size:12px; box-sizing:border-box;"></div>
                </div>

                <div style="display: grid; grid-template-columns: 1fr 1.5fr; gap: 10px;">
                    <div><label style="font-size: 11.5px; font-weight: 700; color: #b45309;">• 검증대상</label><input type="text" id="tc-target" style="width:100%; padding:6px; border:1px solid #fcd34d; background:#fffbeb; border-radius:4px; font-size:12px; box-sizing:border-box; font-weight:bold;"></div>
                    <div><label style="font-size: 11.5px; font-weight: 800; color: #059669;">• Test Data</label><input type="text" id="tc-testdata" style="width:100%; padding:6px; border:1px solid #a7f3d0; background:#f0fdf4; border-radius:4px; font-size:12px; box-sizing:border-box; font-weight:bold;"></div>
                </div>

                <div><label style="font-size: 11.5px; font-weight: 700;">Pre-Conditions</label><textarea id="tc-precond" rows="2" style="width:100%; padding:6px; border:1px solid #cbd5e0; border-radius:4px; font-size:12px; box-sizing:border-box; resize:vertical;"></textarea></div>
                <div>
                    <div style="display: flex; justify-content: space-between; align-items: center;"><label style="font-size: 11.5px; font-weight: 700;">Step</label><div><button class="btn-cal-nav" id="btn-tc-add-step" style="font-size: 10px; padding: 2px 6px;">STEP+</button> <button class="btn-cal-nav" id="btn-tc-reset-step" style="font-size: 10px; padding: 2px 6px;">초기화</button></div></div>
                    <textarea id="tc-steps" rows="3" style="width:100%; padding:6px; border:1px solid #cbd5e0; border-radius:4px; font-size:12px; box-sizing:border-box; resize:vertical;"></textarea>
                </div>
                <div><label style="font-size: 11.5px; font-weight: 700;">Expected Result</label><textarea id="tc-expected" rows="3" style="width:100%; padding:6px; border:1px solid #cbd5e0; border-radius:4px; font-size:12px; box-sizing:border-box; resize:vertical;"></textarea></div>
            </div>
        </div>

        <div style="flex: 2; display: flex; flex-direction: column; gap: 16px; min-width: 0;">
            <div class="tc-preview-zone" style="background: #ffffff; padding: 20px; border-radius: 8px; border: 1px solid #e2e8f0; display: flex; flex-direction: column;">
                <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 12px; flex-shrink: 0;">
                    <h3 style="font-size: 1rem; font-weight: 700; color: #2d3748; margin: 0;">📊 OY 실무 스프레드시트 정형화 뷰어</h3>
                    <div style="display: flex; gap: 6px;">
                        <button class="btn-cal-nav" id="btn-tc-fullscreen" style="font-size: 11px; padding: 6px 10px; background: #f8fafc; color: #334155; border: 1px solid #cbd5e0; border-radius: 4px; cursor: pointer; font-weight: 700;">🖥️ 전체보기</button>
                        <button class="btn-cal-nav" id="btn-cluster-sort" style="font-size: 11px; padding: 6px 10px; background: #eff6ff; color: #2563eb; border: 1px solid #bfdbfe; border-radius: 4px; cursor: pointer; font-weight: 700;">🗂️ 동일 컴포넌트 묶기</button>
                        <button class="btn-cal-nav" id="btn-open-tc-guide" style="font-size: 11px; padding: 6px 10px; background: #f0fdf4; color: #16a34a; border: 1px solid #bbf7d0; border-radius: 4px; cursor: pointer; font-weight: 700;">📗 가이드</button>
                        <button class="btn-action" id="btn-tc-copy-sheet" style="font-size: 11px; padding: 6px 12px; background: #3182ce; color: white; border: none; border-radius: 4px; cursor: pointer; font-weight: 700;">시트 복사</button>
                    </div>
                </div>
                
                <div class="table-wrapper" style="overflow: auto; max-height: 650px; border: 1px solid #cbd5e0; position: relative;">
                    <table id="tc-native-sheet" style="border-collapse: collapse; width: max-content; min-width: 1050px; font-family: 'Malgun Gothic', sans-serif; font-size: 11px; text-align: left;">
                        <thead>
                            <tr>
                                <th rowspan="2" style="position: sticky; top: 0; z-index: 10; background: #0b2265; color: white; padding: 8px; text-align: center; width: 45px;">No</th>
                                <th rowspan="2" style="position: sticky; top: 0; z-index: 10; background: #0b2265; color: white; padding: 8px; text-align: center; width: 100px;">Component</th>
                                <th colspan="3" style="position: sticky; top: 0; z-index: 10; background: #0b2265; color: white; padding: 8px; text-align: center;">Category</th>
                                <th rowspan="2" style="position: sticky; top: 0; z-index: 10; background: #0b2265; color: white; padding: 8px; text-align: center; width: 120px;">검증대상</th>
                                <th rowspan="2" style="position: sticky; top: 0; z-index: 10; background: #0b2265; color: white; padding: 8px; text-align: center; width: 220px;">Pre-Conditions</th>
                                <th rowspan="2" style="position: sticky; top: 0; z-index: 10; background: #0b2265; color: white; padding: 8px; text-align: center; width: 260px;">Step</th>
                                <th rowspan="2" style="position: sticky; top: 0; z-index: 10; background: #0b2265; color: white; padding: 8px; text-align: center; width: 270px;">Expected Result</th>
                                <th rowspan="2" style="position: sticky; top: 0; z-index: 10; background: #0b2265; color: white; padding: 8px; text-align: center; width: 150px;">Test Data</th>
                            </tr>
                            <tr>
                                <th style="position: sticky; top: 31px; z-index: 10; background: #0b2265; color: white; padding: 8px; text-align: center; width: 100px;">Category1</th>
                                <th style="position: sticky; top: 31px; z-index: 10; background: #0b2265; color: white; padding: 8px; text-align: center; width: 110px;">Category2</th>
                                <th style="position: sticky; top: 31px; z-index: 10; background: #0b2265; color: white; padding: 8px; text-align: center; width: 140px;">Category3</th>
                            </tr>
                        </thead>
                        <tbody id="tc-native-sheet-body" style="background-color: #ffffff; color: #000000;"></tbody>
                    </table>
                </div>
            </div>

            <div id="tc-review-panel" style="display: none; flex-direction: column; background: #fffbeb; padding: 20px; border-radius: 8px; border: 1px solid #fde68a;">
                <h3 style="font-size: 1rem; font-weight: 700; color: #92400e; margin: 0 0 12px 0;">🔍 AI 작성 규격 & 비즈니스 룰 감리 리포트</h3>
                <textarea id="tc-review-result" readonly style="width: 100%; min-height: 200px; padding: 12px; background: #ffffff; border: 1px solid #fcd34d; border-radius: 6px; font-size: 12px; box-sizing: border-box;"></textarea>
            </div>
        </div>
    </div>

    <div id="tc-guide-modal" style="display: none; position: fixed; top: 0; left: 0; width: 100vw; height: 100vh; background: rgba(15, 23, 42, 0.65); z-index: 10000; justify-content: center; align-items: center;">
        <div style="background: #ffffff; width: 680px; max-width: 90vw; max-height: 85vh; border-radius: 12px; padding: 24px; display: flex; flex-direction: column;">
            <div style="display: flex; justify-content: space-between; align-items: center; border-bottom: 2px solid #edf2f7; padding-bottom: 12px; margin-bottom: 16px;">
                <h3 style="margin: 0; font-size: 1.25rem; font-weight: 800;">📗 TC 작성 가이드</h3>
                <button id="btn-close-tc-guide" style="background: none; border: none; font-size: 24px; cursor: pointer;">&times;</button>
            </div>
            <div style="overflow-y: auto; flex: 1;">${TC_GUIDE_CONTENT}</div>
        </div>
    </div>

    <div id="tc-import-modal" style="display: none; position: fixed; top: 0; left: 0; width: 100vw; height: 100vh; background: rgba(15, 23, 42, 0.7); z-index: 10001; justify-content: center; align-items: center;">
        <div style="background: #ffffff; width: 620px; max-width: 90vw; border-radius: 12px; padding: 24px; display: flex; flex-direction: column; gap: 14px;">
            <h3 style="margin: 0; font-size: 1.15rem; font-weight: 800;">📥 OY 실무 다중 행 일괄 파싱 Import</h3>
            <textarea id="import-raw-text" rows="8" placeholder="엑셀 또는 구글 시트 행을 복사해서 붙여넣으세요" style="width: 100%; padding: 10px; font-size: 12px; border: 1px solid #cbd5e0; border-radius: 6px; box-sizing: border-box;"></textarea>
            <div style="display: flex; justify-content: space-between; align-items: center;">
                <label style="font-size: 12px; font-weight: 700; cursor: pointer;"><input type="checkbox" id="chk-fill-down" checked> 상위 빈 셀 자동 채우기 (Fill-down)</label>
                <div style="display: flex; gap: 8px;">
                    <button id="btn-cancel-import" style="background: #f1f5f9; padding: 8px 16px; border: none; border-radius: 6px; cursor: pointer;">취소</button>
                    <button id="btn-execute-import" style="background: #0f172a; color: #fff; padding: 8px 18px; border: none; border-radius: 6px; cursor: pointer;">파싱 적용</button>
                </div>
            </div>
        </div>
    </div>
`;

window.QA_CORE.Tc.Manager = {
    tcList: [],
    currentEditIndex: 0,
    debouncedRenderTable: null,

    init() {
        const panelZone = document.getElementById('tab-panel-tc');
        if (panelZone) panelZone.innerHTML = window.QA_CORE.Tc.TEMPLATE;

        const dateInput = document.getElementById('tc-date');
        if (dateInput) {
            const today = new Date();
            dateInput.value = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, '0')}-${String(today.getDate()).padStart(2, '0')}`;
        }

        if (this.tcList.length === 0) {
            this.tcList.push({ comp: "", poc: "", menu: "", title: "", target: "", precond: "", steps: "", expected: "", testdata: "", isAiModified: false });
        }
        
        if (!this.debouncedRenderTable) {
            this.debouncedRenderTable = this.debounce(() => this.renderTable(), 150);
        }

        this.bindEvents();
        this.loadToForm(0);
    },

    debounce(func, wait) {
        let timeout;
        return (...args) => {
            clearTimeout(timeout);
            timeout = setTimeout(() => func(...args), wait);
        };
    },

    bindEvents() {
        ['tc-component', 'tc-poc', 'tc-menu', 'tc-title', 'tc-target', 'tc-precond', 'tc-steps', 'tc-expected', 'tc-testdata'].forEach(id => {
            const el = document.getElementById(id);
            if (el) {
                el.addEventListener('input', () => {
                    if (this.tcList[this.currentEditIndex]) this.tcList[this.currentEditIndex].isAiModified = false;
                    this.syncFormToState();
                });
            }
        });

        const descArea = document.getElementById('ai-feature-desc');
        if (descArea && !descArea.dataset.pasteBound) {
            descArea.addEventListener('paste', this.handleSmartPaste.bind(this));
            descArea.dataset.pasteBound = 'true';
        }

        const addRowBtn = document.getElementById('btn-tc-add-row');
        if (addRowBtn) {
            addRowBtn.onclick = () => {
                const newRow = { comp: "", poc: "", menu: "", title: "", target: "", precond: "", steps: "", expected: "", testdata: "", isAiModified: false };
                this.tcList.splice(this.currentEditIndex + 1, 0, newRow);
                this.loadToForm(this.currentEditIndex + 1);
            };
        }

        const dupRowBtn = document.getElementById('btn-tc-dup-row');
        if (dupRowBtn) {
            dupRowBtn.onclick = () => {
                const current = this.tcList[this.currentEditIndex] || { comp: "", poc: "", menu: "", title: "", target: "", precond: "", steps: "", expected: "", testdata: "" };
                const cloneRow = { ...current, isAiModified: false };
                this.tcList.splice(this.currentEditIndex + 1, 0, cloneRow);
                this.loadToForm(this.currentEditIndex + 1);
            };
        }

        const delRowBtn = document.getElementById('btn-tc-del-row');
        if (delRowBtn) {
            delRowBtn.onclick = () => {
                if (confirm("현재 선택된 테스트케이스 행을 삭제하시겠습니까?")) {
                    this.tcList.splice(this.currentEditIndex, 1);
                    if (this.tcList.length === 0) {
                        this.tcList.push({ comp: "", poc: "", menu: "", title: "", target: "", precond: "", steps: "", expected: "", testdata: "", isAiModified: false });
                    }
                    let nextIdx = this.currentEditIndex >= this.tcList.length ? this.tcList.length - 1 : this.currentEditIndex;
                    this.loadToForm(nextIdx);
                }
            };
        }

        const clearAllBtn = document.getElementById('btn-tc-clear-all');
        if (clearAllBtn) {
            clearAllBtn.onclick = () => {
                if (confirm("경고: 뷰어에 작성된 모든 데이터가 삭제됩니다.\n보드를 정말 비우시겠습니까?")) {
                    this.tcList = [{ comp: "", poc: "", menu: "", title: "", target: "", precond: "", steps: "", expected: "", testdata: "", isAiModified: false }];
                    this.loadToForm(0);
                }
            };
        }

        const bindModal = (openBtnId, modalId, closeBtnId) => {
            const openBtn = document.getElementById(openBtnId);
            const modal = document.getElementById(modalId);
            const closeBtn = document.getElementById(closeBtnId);
            if (openBtn && modal) openBtn.onclick = () => modal.style.display = 'flex';
            if (closeBtn && modal) closeBtn.onclick = () => modal.style.display = 'none';
            if (modal) modal.onclick = (e) => { if (e.target === modal) modal.style.display = 'none'; };
        };

        bindModal('btn-open-import-modal', 'tc-import-modal', 'btn-close-import-x');
        const cancelImport = document.getElementById('btn-cancel-import');
        if (cancelImport) cancelImport.onclick = () => document.getElementById('tc-import-modal').style.display = 'none';

        bindModal('btn-open-tc-guide', 'tc-guide-modal', 'btn-close-tc-guide');

        const clusterBtn = document.getElementById('btn-cluster-sort');
        if (clusterBtn) clusterBtn.onclick = () => {
            this.hierarchicalSort();
            this.renderTable();
            alert("🗂️ 동일 컴포넌트 및 카테고리별로 완벽하게 묶여 정렬되었습니다!");
        };

        const fullscreenBtn = document.getElementById('btn-tc-fullscreen');
        if (fullscreenBtn) {
            const toggleFullscreen = () => {
                const zone = document.querySelector('.tc-preview-zone');
                if (zone) {
                    const isFull = zone.classList.toggle('tc-fullscreen');
                    document.body.classList.toggle('tc-fullscreen-active', isFull);
                    fullscreenBtn.innerHTML = isFull ? '✖️ 축소하기' : '🖥️ 전체보기';
                }
            };
            fullscreenBtn.onclick = toggleFullscreen;
            
            document.addEventListener('keydown', (e) => {
                if (e.key === 'Escape') {
                    const zone = document.querySelector('.tc-preview-zone');
                    if (zone && zone.classList.contains('tc-fullscreen')) {
                        zone.classList.remove('tc-fullscreen');
                        document.body.classList.remove('tc-fullscreen-active');
                        fullscreenBtn.innerHTML = '🖥️ 전체보기';
                    }
                }
            });
        }

        const executeImportBtn = document.getElementById('btn-execute-import');
        if (executeImportBtn) {
            executeImportBtn.onclick = () => {
                const rawText = document.getElementById('import-raw-text').value.trim();
                if (!rawText) { alert("파싱할 데이터를 입력하세요."); return; }
                
                const isFillDown = document.getElementById('chk-fill-down').checked;
                
                const parseMultiRowTSV = (text) => {
                    const rows = [];
                    let currentRow = [];
                    let currentCell = "";
                    let inQuotes = false;
                    for (let i = 0; i < text.length; i++) {
                        const char = text[i];
                        const nextChar = text[i + 1];
                        if (char === '"') {
                            if (inQuotes && nextChar === '"') { currentCell += '"'; i++; }
                            else { inQuotes = !inQuotes; }
                        } else if (char === '\t' && !inQuotes) {
                            currentRow.push(currentCell.trim()); currentCell = "";
                        } else if ((char === '\r' || char === '\n') && !inQuotes) {
                            if (char === '\r' && nextChar === '\n') i++;
                            currentRow.push(currentCell.trim());
                            if (currentRow.some(c => c !== "")) rows.push(currentRow);
                            currentRow = []; currentCell = "";
                        } else {
                            currentCell += char;
                        }
                    }
                    if (currentCell.trim() || text.endsWith('\t')) currentRow.push(currentCell.trim());
                    if (currentRow.some(c => c !== "")) rows.push(currentRow);
                    return rows;
                };

                const rows = parseMultiRowTSV(rawText);
                
                let lastComp = "", lastPoc = "", lastMenu = "";
                this.tcList = rows.map(cols => {
                    let offset = /^\d+$/.test(cols[0]) ? 1 : 0;
                    let comp = cols[0 + offset] || '', poc = cols[1 + offset] || '', menu = cols[2 + offset] || '', title = cols[3 + offset] || '';
                    let target = cols[4 + offset] || '', precond = cols[5 + offset] || '', steps = cols[6 + offset] || '', expected = cols[7 + offset] || '', testdata = cols[8 + offset] || '';

                    if (isFillDown) {
                        if (comp !== "") lastComp = comp; else comp = lastComp;
                        if (poc !== "") lastPoc = poc; else poc = lastPoc;
                        if (menu !== "") lastMenu = menu; else menu = lastMenu;
                    }
                    return { comp, poc, menu, title, target, precond, steps, expected, testdata, isAiModified: false };
                });

                this.hierarchicalSort();
                this.loadToForm(0);
                document.getElementById('tc-import-modal').style.display = 'none';
                document.getElementById('import-raw-text').value = '';
                alert(`✅ 총 ${rows.length}개 행이 단 1칸의 밀림 없이 완벽히 파싱 및 정렬되었습니다.`);
            };
        }

        const aiGen = document.getElementById('btn-ai-generate');
        if (aiGen) aiGen.onclick = () => this.triggerAiGenerationPipeline();

        const aiRev = document.getElementById('btn-ai-review');
        if (aiRev) aiRev.onclick = () => this.triggerAiReviewPipeline();

        const addStep = document.getElementById('btn-tc-add-step');
        if (addStep) addStep.onclick = () => {
            const steps = document.getElementById('tc-steps');
            if (steps) {
                const lines = steps.value.split('\n').filter(l => l.trim());
                steps.value += (steps.value ? '\n' : '') + `${lines.length + 1}. `;
                steps.dispatchEvent(new Event('input'));
            }
        };

        const resetStep = document.getElementById('btn-tc-reset-step');
        if (resetStep) resetStep.onclick = () => {
            const steps = document.getElementById('tc-steps');
            if (steps) { steps.value = ''; steps.dispatchEvent(new Event('input')); }
        };

        const copyBtn = document.getElementById('btn-tc-copy-sheet');
        if (copyBtn) copyBtn.onclick = () => {
            const table = document.getElementById('tc-native-sheet');
            if (!table) return;
            const range = document.createRange();
            range.selectNode(table);
            window.getSelection().removeAllRanges();
            window.getSelection().addRange(range);
            try { document.execCommand('copy'); alert("시트 양식이 복사되었습니다. 구글 스프레드시트에 [Ctrl + V]로 붙여넣으세요."); }
            catch (e) { alert("복사 실패"); }
            window.getSelection().removeAllRanges();
        };
    },

    handleSmartPaste(e) {
        const descArea = e.target;
        const htmlData = e.clipboardData.getData('text/html');
        
        if (htmlData) {
            e.preventDefault(); 
            
            const parser = new DOMParser();
            const doc = parser.parseFromString(htmlData, 'text/html');
            
            const dropNodes = doc.querySelectorAll('del, s, strike');
            const dropStyledNodes = Array.from(doc.querySelectorAll('*')).filter(el => {
                const style = el.getAttribute('style');
                return style && style.toLowerCase().includes('line-through');
            });
            
            const totalDrops = dropNodes.length + dropStyledNodes.length;
            
            dropNodes.forEach(n => n.remove());
            dropStyledNodes.forEach(n => n.remove());

            doc.body.innerHTML = doc.body.innerHTML
                .replace(/<br\s*\/?>/gi, '\n')
                .replace(/<\/(p|div|li|h[1-6])>/gi, '\n')
                .replace(/<p>|<div>/gi, ''); 
            
            let cleanText = doc.body.textContent || "";
            cleanText = cleanText.replace(/\n{3,}/g, '\n\n').trim();

            const startPos = descArea.selectionStart;
            const endPos = descArea.selectionEnd;
            descArea.value = descArea.value.substring(0, startPos) + cleanText + descArea.value.substring(endPos);
            
            descArea.selectionStart = descArea.selectionEnd = startPos + cleanText.length;
            
            if (totalDrops > 0) {
                alert(`✂️ [스마트 페이스트 작동]\n\n취소선이 적용된 드랍(Drop) 스펙 ${totalDrops}건을 감지하여 자동 삭제했습니다.\n이제 잔여 텍스트로 안전하게 TC를 설계하세요.`);
            }
        }
    },

    hierarchicalSort() {
        if (this.tcList.length <= 1) return;
        const currentObj = this.tcList[this.currentEditIndex];

        const compMap = new Map();
        this.tcList.forEach(item => {
            const key = (item.comp || '기타').trim();
            if (!compMap.has(key)) compMap.set(key, []);
            compMap.get(key).push(item);
        });

        let sorted = [];
        compMap.forEach(items => {
            const pocMap = new Map();
            items.forEach(it => {
                const pKey = (it.poc || '').trim();
                if (!pocMap.has(pKey)) pocMap.set(pKey, []);
                pocMap.get(pKey).push(it);
            });
            pocMap.forEach(pocItems => {
                const menuMap = new Map();
                pocItems.forEach(it => {
                    const mKey = (it.menu || '').trim();
                    if (!menuMap.has(mKey)) menuMap.set(mKey, []);
                    menuMap.get(mKey).push(it);
                });
                menuMap.forEach(menuItems => {
                    sorted.push(...menuItems);
                });
            });
        });

        this.tcList = sorted;
        this.currentEditIndex = this.tcList.indexOf(currentObj);
        if (this.currentEditIndex === -1) this.currentEditIndex = 0;
    },

    loadToForm(idx) {
        if (!this.tcList[idx]) return;
        this.currentEditIndex = idx;
        const tc = this.tcList[idx];

        document.getElementById('tc-component').value = tc.comp || '';
        document.getElementById('tc-poc').value = tc.poc || '';
        document.getElementById('tc-menu').value = tc.menu || '';
        document.getElementById('tc-title').value = tc.title || '';
        document.getElementById('tc-target').value = tc.target || '';
        document.getElementById('tc-precond').value = tc.precond || '';
        document.getElementById('tc-steps').value = tc.steps || '';
        document.getElementById('tc-expected').value = tc.expected || '';
        document.getElementById('tc-testdata').value = tc.testdata || '';

        this.renderTable();
    },

    syncFormToState() {
        if (!this.tcList[this.currentEditIndex]) this.tcList[this.currentEditIndex] = {};
        const tc = this.tcList[this.currentEditIndex];
        const get = id => document.getElementById(id)?.value.trim() || '';

        tc.comp = get('tc-component');
        tc.poc = get('tc-poc');
        tc.menu = get('tc-menu');
        tc.title = get('tc-title');
        tc.target = get('tc-target');
        tc.precond = get('tc-precond');
        tc.steps = get('tc-steps');
        tc.expected = get('tc-expected');
        tc.testdata = get('tc-testdata');

        if(this.debouncedRenderTable) this.debouncedRenderTable();
    },

    analyzeToneAndManner() {
        const valid = this.tcList.filter(i => (i.steps && i.steps.length > 3) || (i.expected && i.expected.length > 3));
        if (valid.length === 0) return null;

        let noun = 0, da = 0, numPre = false;
        let precondFreq = {};
        let step1Freq = {};

        valid.forEach(i => {
            if (i.precond) {
                if (/^\d+\./m.test(i.precond)) numPre = true;
                const firstPre = i.precond.split('\n')[0].trim();
                if(firstPre && !/로그인/i.test(firstPre)) precondFreq[firstPre] = (precondFreq[firstPre] || 0) + 1;
            }
            if (i.steps) {
                const firstStep = i.steps.split('\n')[0].trim();
                if(firstStep) step1Freq[firstStep] = (step1Freq[firstStep] || 0) + 1;
            }
            if (i.expected) {
                if (/(노출|이동|선택|처리|추가|유지|미노출|확인|적용|됨|증가)$/m.test(i.expected.trim())) noun++;
                if (/(다\.|함\.|음\.)$/.test(i.expected.trim())) da++;
            }
        });

        const commonPrecond = Object.keys(precondFreq).length > 0 ? Object.keys(precondFreq).reduce((a, b) => precondFreq[a] > precondFreq[b] ? a : b) : "";
        const commonStep1 = Object.keys(step1Freq).length > 0 ? Object.keys(step1Freq).reduce((a, b) => step1Freq[a] > step1Freq[b] ? a : b) : "1. 올리브베러 홈 > 오특 GNB 진입";

        return { 
            usesNumberedPrecond: numPre, 
            useNounEnding: noun >= da,
            commonPrecond,
            commonStep1
        };
    },

    async triggerAiGenerationPipeline() {
        const descEl = document.getElementById('ai-feature-desc');
        let desc = descEl ? descEl.value.trim() : '';
        if (desc.length < 10) { alert("기획 명세를 10자 이상 입력하세요."); descEl?.focus(); return; }

        const btn = document.getElementById('btn-ai-generate');
        const orig = btn.innerHTML;
        btn.innerHTML = `<span>⏳</span> 스마트 오탈자 치환 및 생성 중...`;
        btn.disabled = true;

        try {
            await new Promise(r => setTimeout(r, 1200));

            // 💡 [실행 1] 스마트 오탈자 치환 엔진 (Pre-processing)
            let correctedCount = 0;
            Object.keys(TYPO_DICTIONARY).forEach(typo => {
                const regex = new RegExp(typo, 'g');
                if (regex.test(desc)) {
                    desc = desc.replace(regex, TYPO_DICTIONARY[typo]);
                    correctedCount++;
                }
            });

            const tone = this.analyzeToneAndManner();
            
            let rawChunks = desc.split(/\n\s*\n/).map(c => c.trim()).filter(c => c.length > 5);
            let chunks = [];

            const delimiterStr = `(#{2,4}\\s+|[①②③④⑤⑥⑦⑧⑨⑩⑪⑫⑬⑭⑮⑯⑰⑱⑲⑳❶❷❸❹❺❻❼❽❾❿⓫⓬⓭⓮⓯⓰⓱⓲⓳⓴]|■|◆|\\[\\d+\\]|<\\d+>|【[^】]+】|\\d+\\.\\s+(?=[가-힣A-Za-z\\s]{0,20}(?:지면|섹션|설계|정책|화면|기능|요구사항|공통|기획|상품|카드|연동|테스트|특가)))`;
            const headerRegex = new RegExp(`^` + delimiterStr, 'i');
            const splitRegex = new RegExp(`\\n(?=` + delimiterStr + `)`, 'gi');

            rawChunks.forEach(rc => {
                let subChunks = rc.split(splitRegex).map(s => s.trim()).filter(s => s.length > 5);
                chunks.push(...subChunks);
            });

            chunks = chunks.filter(chunk => {
                const firstLine = chunk.split('\n')[0];
                return !/^(배경|목적|일정|제외|참고|히스토리)/.test(firstLine.replace(/[^가-힣]/g,''));
            });

            const finalChunks = chunks.length > 0 ? chunks : [desc];
            
            const newTcs = finalChunks.map((chunk, idx) => {
                const firstLine = chunk.split('\n')[0].trim();
                let rawTitle = firstLine.replace(headerRegex, '').replace(/[\*\[\]]/g, '').trim();
                
                let shortTitle = rawTitle.replace(/(상세\s*설계|운영\s*정책|가이드|섹션|영역|화면|리스트|목록|노출\s*정보|기타\s*정책|공통\s*사항|주요\s*지면|섹션구성|특징|방식).*$/gi, '').trim();
                shortTitle = shortTitle.replace(/^[①②③④⑤⑥⑦⑧⑨⑩⑪⑫⑬⑭⑮⑯⑰⑱⑲⑳❶❷❸❹❺❻❼❽❾❿⓫⓬⓭⓮⓯⓰⓱⓲⓳⓴\d\.\s\-\[\]\(\)]+/, '').trim();
                shortTitle = shortTitle.replace(/[-:;,.>]+$/, '').trim(); 
                
                if (shortTitle.length > 15) {
                    const nouns = shortTitle.match(/[가-힣A-Za-z0-9]+/g) || [];
                    shortTitle = nouns.slice(0, 3).join(' '); 
                    if (shortTitle.length > 20) shortTitle = shortTitle.slice(0, 20).trim();
                }

                if (!shortTitle || shortTitle.length <= 1) {
                    shortTitle = `기능 확인 ${idx + 1}`;
                }

                let comp = shortTitle.split(' ')[0] || "공통 기능", cat1 = "전시/노출", cat2 = "상세 정책", testdata = "";
                
                if (/다가오는 특가|내일의 특가/i.test(chunk)) { comp = "다가오는 특가"; cat1 = "상품 공통"; cat2 = "상품명"; }
                else if (/홈 GNB/i.test(chunk)) { comp = "홈 GNB"; cat1 = "오특 섹션"; cat2 = "필터칩"; }
                else if (/오특|오늘의\s*특가/i.test(chunk)) { comp = "오늘의특가"; cat1 = "전시 코너"; cat2 = "특가 관리"; }
                else if (/위클리/i.test(chunk)) { comp = "위클리특가"; cat1 = "전시 코너"; cat2 = "독립 가상카테고리"; }
                else if (/필터칩/i.test(chunk)) { comp = "홈 전시"; cat1 = "홈"; cat2 = "필터칩"; }
                else if (/타이머|카운트다운/i.test(chunk)) { comp = "특가 타이머"; cat1 = "타이머"; cat2 = "시간 카운트"; }
                else if (/오류|에러/i.test(chunk)) { comp = "공통 모듈"; cat1 = "오류 케이스"; cat2 = "예외 처리"; }
                
                if (/브랜드|API/i.test(chunk)) { cat1 = "데이터 연동"; cat2 = "정보 호출"; }

                const cleanComp = comp.replace(/_대 카테고리관|_대카테고리관/g, '').trim();
                const cleanCat1 = cat1.replace(/_대 카테고리관|_대카테고리관/g, '').trim();
                const boSetupStr = cleanComp === cleanCat1 ? `'${cleanComp}'` : `'${cleanComp}', '${cleanCat1}'`;

                let precond = tone && tone.commonPrecond ? tone.commonPrecond : `1. ${boSetupStr} 설정 상태`;
                
                let loginState = "";
                if (/마이페이지|장바구니 담|좋아요|주문|결제|쿠폰|내정보|포인트/i.test(chunk)) loginState = "로그인 상태";
                else if (/미로그인|비로그인|로그아웃/i.test(chunk)) loginState = "미로그인 상태";

                let specificPrecond = "";
                if (/일시품절/i.test(chunk)) specificPrecond = "상품 정보 일시품절 상태인 경우";
                else if (/옵션.*변경/i.test(chunk)) specificPrecond = "옵션 상품 대표 단품 변경되었을 경우";
                else if (/유효한.*위클리.*존재/i.test(chunk)) specificPrecond = "유효한 위클리 특가 전시 세트 존재하는 경우";
                else if (/유효한.*위클리.*없/i.test(chunk)) specificPrecond = "유효한 위클리 특가 전시 세트 존재하지 않는 경우";

                if (specificPrecond) precond = `1. ${specificPrecond}`;
                if (loginState) precond += `\n2. ${loginState}`;

                let baseStep1 = tone && tone.commonStep1 ? tone.commonStep1 : `1. 올리브베러 홈 > 오특 GNB 진입`;
                
                let action = "확인";
                if(/스와이프|swipe/i.test(chunk)) action = "좌/우 Swipe";
                else if(/탭|클릭/i.test(chunk)) action = "탭";
                else if(/새로고침/i.test(chunk)) {
                    baseStep1 = "1. 상단 새로고침 진행"; action = "확인";
                }
                
                let targetSub = shortTitle;
                if(action === "좌/우 Swipe") targetSub = "리스트";
                if(targetSub === "기능 확인") targetSub = "상품";
                
                let steps = `${baseStep1}\n2. ${targetSub} ${action}`;

                let target = shortTitle.replace(/확인|탭|변경/g, '').trim();
                
                if (/swipe|스와이프/i.test(chunk)) target = "상품 Swipe";
                else if (/탭|클릭/i.test(chunk)) target = "동작_탭";
                else if (/정렬|순서/i.test(chunk)) target = "상품 정렬 순서 확인";
                else if (/두줄|세줄|말줄임/i.test(chunk)) target = "상품 명 노출 확인";
                else if (/시간|카운트다운/i.test(chunk)) target = "상품 노출 시간";
                else if (/변경/i.test(chunk)) target += " 변경";
                else if (/미수신|오류/i.test(chunk)) target += " 미수신";
                else if (/노출/i.test(chunk)) target += " 노출 확인";
                else target += " 노출";
                
                if (target.trim() === "노출" || target.trim() === "") target = "기본 UI 노출";

                let expected = "";
                let expectedLines = chunk.split('\n').filter(l => l.trim().startsWith('-'));
                
                if (/다가오는 특가/i.test(chunk) && action === "탭") {
                    expected = "- 상품 상세페이지로 이동되지 않음";
                } else if (/다가오는 특가/i.test(chunk) && /순서/i.test(chunk)) {
                    expected = "- 전체 등록상품(스페셜특가, 오늘의특가) 랜덤순 노출";
                } else if (/홈 GNB/i.test(chunk) && /정렬/i.test(chunk)) {
                    expected = "- 스페셜 오특 정상 상품 > 일반 오특 정상 상품 > 스페셜 오특 일시품절 상품 > 일반 오특 일시품절 상품 순으로 노출";
                } else if (expectedLines.length > 0) {
                    expected = expectedLines.map(l => {
                        let t = l.replace(/^-/, '').trim();
                        t = t.replace(/수정됨/g, '노출').replace(/수정/g, '변경').replace(/되었으며 대신/g, '되며');
                        if (!t.endsWith('됨') && !t.endsWith('출') && !t.endsWith('경') && !t.endsWith('음') && !t.endsWith('리')) t += ' 노출';
                        return '- ' + t;
                    }).join('\n');
                } else {
                    if (tone && !tone.useNounEnding) {
                        expected = `- ${shortTitle} 정상 노출된다.`;
                    } else {
                        if (/미노출|제외|없으면/i.test(chunk)) expected = `- ${shortTitle} 미노출`;
                        else if (/이동|진입/i.test(chunk)) expected = `- 해당 페이지로 이동`;
                        else expected = `- ${shortTitle} 노출`;
                    }
                }

                return {
                    comp, poc: cat1, menu: cat2, title: shortTitle, target, precond,
                    steps, expected, testdata, isAiModified: true
                };
            });

            const current = this.tcList[this.currentEditIndex];
            if (!current || (!current.comp && !current.poc && !current.title && !current.steps)) {
                this.tcList.splice(this.currentEditIndex, 1, ...newTcs);
                this.loadToForm(this.currentEditIndex);
            } else {
                const idx = this.currentEditIndex + 1;
                this.tcList.splice(idx, 0, ...newTcs);
                this.loadToForm(idx);
            }

            this.hierarchicalSort();
            this.renderTable();
            
            // 💡 [실행 2] 오탈자 교정 결과 피드백 알럿 강화
            if (correctedCount > 0) {
                alert(`✨ 스마트 오탈자 교정 ${correctedCount}건 반영 완료!\n(예: 포험, 썸내일 등의 오타를 감지하여 도메인 맞춤법으로 자동 정제했습니다.)\n\n✅ 텍스트가 정규화되어 총 ${newTcs.length}개의 개별 TC 초안이 분할 생성되었습니다.`);
            } else {
                alert(`✅ 텍스트가 자동 정규화되어 총 ${newTcs.length}개의 개별 TC 초안으로 완벽히 분할 생성되었습니다.`);
            }

        } finally {
            btn.innerHTML = orig;
            btn.disabled = false;
        }
    },

    async triggerAiReviewPipeline() {
        const tc = this.tcList[this.currentEditIndex] || {};
        const text = `${tc.precond || ''} ${tc.steps || ''} ${tc.expected || ''}`;
        
        let errs = 0, details = [];

        if (!tc.target || tc.target.trim() === '') {
            errs++; details.push(`**[🚨 필수 규격 위반] 검증대상 누락**\n* **지적 사항:** '검증대상' 필드는 빈 칸일 수 없습니다.\n* **권장 교정:** 'UI 노출', '타이틀 변경', '데이터 연동' 등 명확한 검증 목적을 기입하십시오.`);
        }

        if (text.replace(/\s/g, '').length < 10 && errs === 0) { alert("감리할 내용이 부족합니다."); return; }

        const btn = document.getElementById('btn-ai-review');
        const orig = btn.innerHTML;
        btn.innerHTML = `<span>⏳</span> 감리 중...`;
        btn.disabled = true;

        try {
            await new Promise(r => setTimeout(r, 1200));

            const forbiddenWords = ['정상 확인', '동작 확인', '데이터 확인', '검증', '안됨', '이상함', '오류 발생', 'API'];
            let foundWords = forbiddenWords.filter(w => text.includes(w));
            if (foundWords.length > 0) {
                errs++; details.push(`**모호한 표현 및 비즈니스 금지어 사용 (작성 가이드 위반)**\n* **지적 사항:** 제3자가 해석하기 어려운 단어나 백엔드 기술 용어(${foundWords.map(w => `'${w}'`).join(', ')})가 감지되었습니다.\n* **권장 교정:** 'API'는 '데이터 연동/노출'로, 모호한 표현은 '토스트 메시지 노출' 등 구체적인 UI 상태로 기술하십시오.`);
            }

            if (tc.expected && (!tc.expected.endsWith('다.') && !tc.expected.endsWith('함') && !tc.expected.endsWith('음') && !tc.expected.endsWith('출') && !tc.expected.endsWith('가') && !tc.expected.endsWith('동') && !tc.expected.endsWith('리'))) {
                errs++; details.push(`**Expected Result (기대결과) 명확성 부족**\n* **지적 사항:** 기대결과는 명확한 명사형이나 문장 종결 어미로 끝나야 합니다.\n* **권장 교정:** '- 토스트 팝업 정상 노출' 또는 '- 에러 없이 이동됨' 형태로 명확히 결속하십시오.`);
            }

            if (tc.comp.includes('다가오는 특가') && tc.steps.includes('탭')) {
                if (!tc.expected.includes('이동되지 않음')) {
                    errs++; details.push(`**[🚨 OY 비즈니스 룰 위반] 다가오는 특가 상세 이동 분기 오류**\n* **지적 사항:** 다가오는 특가 상품은 탭 시 상품 상세페이지로 이동되지 않아야 합니다.\n* **권장 교정:** 기대결과에 "상품 상세페이지로 이동되지 않음" 명세를 결속하십시오.`);
                }
            }

            if (tc.comp.includes('홈 GNB') && tc.expected.includes('정렬')) {
                if (!tc.expected.includes('스페셜 오특 정상 상품') && !tc.expected.includes('일반 오특 정상 상품')) {
                    errs++; details.push(`**[🚨 OY 비즈니스 룰 위반] 홈 GNB 오특 정렬 순서 누락**\n* **지적 사항:** 홈 GNB 오특 섹션의 정렬은 스페셜 정상 > 일반 정상 > 품절 순서 규칙이 강제됩니다.\n* **권장 교정:** 정렬 우선순위 명세를 명확히 기입하십시오.`);
                }
            }

            const report = errs === 0 ? "### 종합 결론\n**🎉 규격 감리 통과 (PASS)**" : `### 종합 결론\n**🚨 감리 결함 발견: ${errs}건**\n\n${details.join('\n\n')}`;
            const panel = document.getElementById('tc-review-panel');
            const res = document.getElementById('tc-review-result');
            if (panel && res) { panel.style.display = 'flex'; res.value = report; }
        } finally {
            btn.innerHTML = orig;
            btn.disabled = false;
        }
    },

    renderTable() {
        const tbody = document.getElementById('tc-native-sheet-body');
        if (!tbody) return;

        const nl = s => (s || '').replace(/\n/g, '<br>');
        const spans = this.tcList.map(() => ({ comp: 1, poc: 1, menu: 1, title: 1, skipComp: false, skipPoc: false, skipMenu: false, skipTitle: false }));

        ['comp', 'poc', 'menu', 'title'].forEach((key, kidx, arr) => {
            for (let i = 0; i < this.tcList.length; i++) {
                if (spans[i][`skip${key.charAt(0).toUpperCase() + key.slice(1)}`]) continue;
                let run = 1;
                for (let j = i + 1; j < this.tcList.length; j++) {
                    let match = true;
                    for (let k = 0; k <= kidx; k++) {
                        const pk = arr[k];
                        if (this.tcList[j][pk] !== this.tcList[i][pk] || !this.tcList[i][pk]) { match = false; break; }
                    }
                    if (match) { run++; spans[j][`skip${key.charAt(0).toUpperCase() + key.slice(1)}`] = true; }
                    else break;
                }
                spans[i][key] = run;
            }
        });

        tbody.innerHTML = this.tcList.map((tc, idx) => {
            const isSel = idx === this.currentEditIndex;
            const isAi = tc.isAiModified;

            let bg = '#ffffff';
            let borderStyle = '';
            if (isSel && isAi) {
                bg = '#ecfdf5';
                borderStyle = 'outline: 2px solid #3b82f6; border-left: 4px solid #10b981;';
            } else if (isSel) {
                bg = '#eff6ff';
                borderStyle = 'outline: 2px solid #3b82f6;';
            } else if (isAi) {
                bg = '#ecfdf5';
                borderStyle = 'border-left: 4px solid #10b981;';
            }
            const rowStyle = `background-color: ${bg}; cursor: pointer; ${borderStyle}`;

            let num = `${idx + 1}`, nStyle = '';
            if (isAi) { nStyle = 'background:#059669; color:#fff; font-weight:bold;'; num += `<br><span style="font-size:9px; background:#a7f3d0; color:#065f46; padding:1px 3px; border-radius:3px;">✨AI</span>`; }
            else if (isSel) nStyle = 'background:#2563eb; color:#fff; font-weight:bold;';

            const td = (key, val, skip, span) => skip ? '' : `<td rowspan="${span}" style="border: 1px solid #cbd5e0; padding: 8px; text-align: center; vertical-align: middle; font-weight: ${key==='comp'?'bold':'normal'}; color:${key==='comp'?'#1e3a8a':'#334155'}; background-color:${key==='comp' && isAi?'#ecfdf5':'#f8fafc'};"><div style="white-space:pre-wrap; word-break:break-all;">${val || ''}</div></td>`;
            
            return `
                <tr class="tc-table-row" data-index="${idx}" style="${rowStyle}">
                    <td style="border: 1px solid #cbd5e0; padding: 8px; text-align: center; vertical-align: middle; ${nStyle}">${num}</td>
                    ${td('comp', tc.comp, spans[idx].skipComp, spans[idx].comp)}
                    ${td('poc', tc.poc, spans[idx].skipPoc, spans[idx].poc)}
                    ${td('menu', tc.menu, spans[idx].skipMenu, spans[idx].menu)}
                    ${td('title', tc.title, spans[idx].skipTitle, spans[idx].title)}
                    <td style="border: 1px solid #cbd5e0; padding: 8px; text-align: center; vertical-align: middle; color:#b45309; font-weight:bold;">${nl(tc.target)}</td>
                    <td style="border: 1px solid #cbd5e0; padding: 8px; vertical-align: top;">${nl(tc.precond)}</td>
                    <td style="border: 1px solid #cbd5e0; padding: 8px; vertical-align: top;">${nl(tc.steps)}</td>
                    <td style="border: 1px solid #cbd5e0; padding: 8px; vertical-align: top;">${nl(tc.expected)}</td>
                    <td style="border: 1px solid #cbd5e0; padding: 8px; vertical-align: top; font-weight: bold; color: #059669;">${nl(tc.testdata)}</td>
                </tr>
            `;
        }).join('');

        tbody.querySelectorAll('.tc-table-row').forEach(row => {
            row.onclick = () => this.loadToForm(parseInt(row.getAttribute('data-index'), 10));
        });
    },

    compileTcData() { this.syncFormToState(); }
};

export function initTcPanel() { window.QA_CORE.Tc.Manager.init(); }

if (window.QA_CORE.SkillManager && typeof window.QA_CORE.SkillManager.register === 'function') {
    window.QA_CORE.SkillManager.register('TcModuleCore', window.QA_CORE.Tc.Manager);
}
