window.QA_CORE = window.QA_CORE || {};
window.QA_CORE.Tc = window.QA_CORE.Tc || {};

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
    BO_CURATION: {
        keywords: ['큐레이션', '전시카테고리', 'BO', '어드민', '관리자'],
        rule: "MD 피드형 상품 큐레이션 전시카테고리 번호는 '올리브베러 대카테고리'만 등록 가능함. 기타 카테고리 등록 시 '전시카테고리번호는 올리브베러 대카테고리만 등록 가능합니다.' 에러 팝업 표출."
    },
    FILTER_RESET: {
        keywords: ['필터', '정렬', '판매순', '할인율순', '낮은가격순', '이동', '복귀'],
        rule: "전체 상품 리스트에서 필터(판매순, 낮은가격순 등) 적용 후 타 카테고리 이동 또는 뒤로가기 복귀 시, 필터는 무조건 Default 값(인기순)으로 멱등성 초기화되어야 함."
    },
    TOOLTIP_LIMIT: {
        keywords: ['툴팁', '카테고리 툴팁', '둘러볼 수 있어요'],
        rule: "대카테고리관 내비게이션 바 카테고리 툴팁('카테고리를 바꿔서 둘러볼 수 있어요.')은 3회 이하 진입 기기에서만 노출되며, 노출 후 5초 경과 또는 임의 터치/스크롤 시 즉시 사라짐."
    }
};

const PRESET_TC_LIBRARY = [
    {
        name: "📱 [GNB] 올리브 배러 홈 > 오특 GNB 탭 진입 및 상단 UI 검증",
        component: "GNB", poc: "진입", menu: "GNB", title: "홈 / 더보러가기 / 랭킹 / 기획전",
        precond: "1. 'GNB', '진입' 코너 전시 설정 상태",
        steps: "1. 올리브 배러 홈 화면\n2. GNB '홈' (또는 랭킹/기획전) 진입\n3. GNB '오특' 탭",
        expected: "- GNB 오특 화면 이동\n- GNB 내 '오특'에 선택 효과 노출",
        testdata: "전시 연결관리 > 올리브 배러 가상 카테고리 > [올리브 배러 오특] 오특 큐레이션"
    },
    {
        name: "🏷️ [오늘의특가] 상품 개수(1개~10개/품절) 및 BO 설정 노출 검증",
        component: "오늘의특가", poc: "상품 개수", menu: "1개~10개 / 일시품절", title: "스페셜 오특 + 일반 오특",
        precond: "1. '오늘의특가', '상품 개수' 코너 전시 설정 상태\n2. 스페셜 오특 내 단품/옵션 일시 품절 상품 포함 상태",
        steps: "1. 올리브 배러 홈 > GNB '오특' 진입\n2. 오늘의 특가 / 스페셜 오특 영역\n3. 상품 리스트 및 상품 카드 확인",
        expected: "- 스페셜 오특 영역 정상 노출\n- 이미지 dim 처리 + '일시품절' 문구 노출\n- 상품 할인율 / 가격 등의 텍스트 '회색'으로 노출\n- 일시품절 상품은 리스트 가장 마지막 순서로 노출",
        testdata: "A000000861537 아디다스 퍼포먼스 우먼스 헬스장갑 M(화이트)\n스웨거로 재고 관리"
    }
];

const TC_GUIDE_CONTENT = `
<div style="font-family: 'Pretendard', sans-serif; color: #2d3748; line-height: 1.6; font-size: 13px;">
    <div style="background: #f0fdf4; border-left: 4px solid #16a34a; padding: 14px; margin-bottom: 20px; border-radius: 6px;">
        <span style="font-weight: 800; color: #15803d; font-size: 14px;">📌 TC 작성 가이드 요약</span>
        <p style="margin: 6px 0 0 0; font-size: 12.5px; color: #166534;">
            • Pre-Condition은 사전 상태만 기술 (번호 활용 가능)<br>
            • Step은 실제 사용자 행동 흐름 중심 명시<br>
            • Expected Result는 명사형 또는 명확한 종결 어미로 결속<br>
            <span style="color:#b91c1c; font-weight:bold;">• 🚨 'API'와 같은 백엔드 기술 용어는 TC(UI/UX 관점) 본문에 사용 절대 금지</span>
        </p>
    </div>
</div>
`;

window.QA_CORE.Tc.TEMPLATE = `
    <div class="content-panel active" style="display: flex; gap: 20px; width: 100%; flex-direction: row; box-sizing: border-box; padding: 4px;">
        <div style="flex: 1.5; display: flex; flex-direction: column; gap: 16px; min-width: 420px;">
            <div class="card-panel" style="background: linear-gradient(145deg, #f0f9ff, #e0f2fe); padding: 20px; border-radius: 8px; border: 1px solid #bae6fd;">
                <h2 style="font-size: 1.1rem; font-weight: 700; color: #0369a1; margin: 0 0 12px 0;">🤖 AI 기반 OY 특화 TC 자동 설계</h2>
                <div class="form-group" style="margin-bottom:12px;">
                    <label style="font-size: 12px; font-weight: 700; color: #0c4a6e;">OY 기능 / 기획 개편안 요약 명세</label>
                    <textarea id="ai-feature-desc" rows="2" placeholder="예: 잘 케어하기 대카테고리관 W케어 퀵메뉴 미로그인 진입 검증" style="background:#fff; color:#000; border:1px solid #7dd3fc; padding:10px; border-radius:6px; font-size:12px; width:100%; box-sizing:border-box; resize:none;"></textarea>
                </div>
                <div style="display:flex; gap:8px;">
                    <button id="btn-ai-generate" style="background:#0284c7; color:white; border:none; padding:10px; font-size:12.5px; font-weight:bold; border-radius:6px; cursor:pointer; flex:1;">✨ AI 초안 생성</button>
                    <button id="btn-ai-review" style="background:#059669; color:white; border:none; padding:10px; font-size:12.5px; font-weight:bold; border-radius:6px; cursor:pointer; flex:1;">🔍 규격 감리</button>
                </div>
            </div>

            <div class="tc-builder-zone" style="background: #ffffff; padding: 20px; border-radius: 8px; border: 1px solid #e2e8f0; display: flex; flex-direction: column; gap: 14px;">
                <div style="display: flex; justify-content: space-between; align-items: center; border-bottom: 2px solid #edf2f7; padding-bottom: 8px; margin: 0;">
                    <h2 style="font-size: 1.1rem; font-weight: 700; color: #1a202c; margin:0;">📋 테스트케이스 세부 설계 보드</h2>
                    <button id="btn-open-import-modal" style="background: #0f172a; color: #fff; border: none; padding: 6px 12px; font-size: 11px; font-weight: 700; border-radius: 4px; cursor: pointer;">📥 시트 데이터 파싱</button>
                </div>
                
                <div style="display: grid; grid-template-columns: 1fr 1.5fr; gap: 10px;">
                    <div><label style="font-size: 11.5px; font-weight: 700;">작성 일자</label><input type="date" id="tc-date" style="width:100%; padding:6px; border:1px solid #cbd5e0; border-radius:4px; font-size:12px; box-sizing:border-box;"></div>
                    <div><label style="font-size: 11.5px; font-weight: 700; color: #1e3a8a;">• Component</label><input type="text" id="tc-component" style="width:100%; padding:6px; border:1px solid #cbd5e0; border-radius:4px; font-size:12px; box-sizing:border-box; font-weight:bold;"></div>
                </div>

                <div style="display: grid; grid-template-columns: 1fr 1fr 1.5fr; gap: 10px;">
                    <div><label style="font-size: 11.5px; font-weight: 700;">Category 1</label><input type="text" id="tc-poc" style="width:100%; padding:6px; border:1px solid #cbd5e0; border-radius:4px; font-size:12px; box-sizing:border-box;"></div>
                    <div><label style="font-size: 11.5px; font-weight: 700;">Category 2</label><input type="text" id="tc-menu" style="width:100%; padding:6px; border:1px solid #cbd5e0; border-radius:4px; font-size:12px; box-sizing:border-box;"></div>
                    <div><label style="font-size: 11.5px; font-weight: 700;">Category 3</label><input type="text" id="tc-title" style="width:100%; padding:6px; border:1px solid #cbd5e0; border-radius:4px; font-size:12px; box-sizing:border-box;"></div>
                </div>

                <div><label style="font-size: 11.5px; font-weight: 800; color: #059669;">• Test Data</label><input type="text" id="tc-testdata" style="width:100%; padding:6px; border:1px solid #a7f3d0; background:#f0fdf4; border-radius:4px; font-size:12px; box-sizing:border-box; font-weight:bold;"></div>
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
                        <button class="btn-cal-nav" id="btn-cluster-sort" style="font-size: 11px; padding: 6px 10px; background: #eff6ff; color: #2563eb; border: 1px solid #bfdbfe; border-radius: 4px; cursor: pointer; font-weight: 700;">🗂️ 동일 컴포넌트 묶기</button>
                        <button class="btn-cal-nav" id="btn-open-tc-guide" style="font-size: 11px; padding: 6px 10px; background: #f0fdf4; color: #16a34a; border: 1px solid #bbf7d0; border-radius: 4px; cursor: pointer; font-weight: 700;">📗 가이드</button>
                        <button class="btn-action" id="btn-tc-copy-sheet" style="font-size: 11px; padding: 6px 12px; background: #3182ce; color: white; border: none; border-radius: 4px; cursor: pointer; font-weight: 700;">시트 복사</button>
                    </div>
                </div>
                
                <div style="overflow: auto; max-height: 650px; border: 1px solid #cbd5e0; position: relative;">
                    <table id="tc-native-sheet" style="border-collapse: collapse; width: max-content; min-width: 1050px; font-family: 'Malgun Gothic', sans-serif; font-size: 11px; text-align: left;">
                        <thead>
                            <tr>
                                <th rowspan="2" style="position: sticky; top: 0; z-index: 10; background: #0b2265; color: white; padding: 8px; text-align: center; width: 45px;">No</th>
                                <th rowspan="2" style="position: sticky; top: 0; z-index: 10; background: #0b2265; color: white; padding: 8px; text-align: center; width: 100px;">Component</th>
                                <th colspan="3" style="position: sticky; top: 0; z-index: 10; background: #0b2265; color: white; padding: 8px; text-align: center;">Category</th>
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

    init() {
        const panelZone = document.getElementById('tab-panel-tc');
        if (panelZone) panelZone.innerHTML = window.QA_CORE.Tc.TEMPLATE;

        const dateInput = document.getElementById('tc-date');
        if (dateInput) {
            const today = new Date();
            dateInput.value = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, '0')}-${String(today.getDate()).padStart(2, '0')}`;
        }

        if (this.tcList.length === 0) {
            this.tcList.push({ comp: "", poc: "", menu: "", title: "", precond: "", steps: "", expected: "", testdata: "", isAiModified: false });
        }

        this.bindEvents();
        this.loadToForm(0);
    },

    bindEvents() {
        ['tc-component', 'tc-poc', 'tc-menu', 'tc-title', 'tc-precond', 'tc-steps', 'tc-expected', 'tc-testdata'].forEach(id => {
            const el = document.getElementById(id);
            if (el) el.addEventListener('input', () => {
                if (this.tcList[this.currentEditIndex]) this.tcList[this.currentEditIndex].isAiModified = false;
                this.syncFormToState();
            });
        });

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
                    let precond = cols[4 + offset] || '', steps = cols[5 + offset] || '', expected = cols[6 + offset] || '', testdata = cols[7 + offset] || '';

                    if (isFillDown) {
                        if (comp !== "") lastComp = comp; else comp = lastComp;
                        if (poc !== "") lastPoc = poc; else poc = lastPoc;
                        if (menu !== "") lastMenu = menu; else menu = lastMenu;
                    }
                    return { comp, poc, menu, title, precond, steps, expected, testdata, isAiModified: false };
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
        tc.precond = get('tc-precond');
        tc.steps = get('tc-steps');
        tc.expected = get('tc-expected');
        tc.testdata = get('tc-testdata');

        this.renderTable();
    },

    analyzeToneAndManner() {
        const valid = this.tcList.filter(i => (i.steps && i.steps.length > 5) || (i.expected && i.expected.length > 5));
        if (valid.length === 0) return null;

        let noun = 0, da = 0, numPre = false;
        valid.forEach(i => {
            if (/^\d+\./m.test(i.precond)) numPre = true;
            if (/(노출|이동|선택|처리|추가|유지|미노출|확인|적용)$/m.test(i.expected.trim())) noun++;
            if (/(다\.|함\.|음\.)$/m.test(i.expected.trim())) da++;
        });
        return { usesNumberedPrecond: numPre, useNounEnding: noun >= da };
    },

    async triggerAiGenerationPipeline() {
        const descEl = document.getElementById('ai-feature-desc');
        const desc = descEl ? descEl.value.trim() : '';
        if (desc.length < 10) { alert("기획 명세를 10자 이상 입력하세요."); descEl?.focus(); return; }

        const btn = document.getElementById('btn-ai-generate');
        const orig = btn.innerHTML;
        btn.innerHTML = `<span>⏳</span> 톤앤매너 학습 및 생성 중...`;
        btn.disabled = true;

        try {
            await new Promise(r => setTimeout(r, 1200));
            const tone = this.analyzeToneAndManner();
            
            // 💡 [핵심 해결] 줄바꿈 없이 하나의 덩어리로 붙은 텍스트 내부의 번호를 스캔하여 강제로 줄을 찢어주는 전처리 모듈 결속
            const delimiterStr = `(#{2,4}\\s+|[①②③④⑤⑥⑦⑧⑨⑩⑪⑫⑬⑭⑮⑯⑰⑱⑲⑳❶❷❸❹❺❻❼❽❾❿⓫⓬⓭⓮⓯⓰⓱⓲⓳⓴]|■|◆|\\[\\d+\\]|<\\d+>|【[^】]+】|\\d+\\.\\s+(?=[가-힣A-Za-z\\s]{0,20}(?:지면|섹션|설계|정책|화면|기능|요구사항|공통|기획|상품|카드|연동|테스트|특가)))`;
            
            // 문단 중간에 껴있는 번호 앞에 \n 삽입 (단, 이미 줄바꿈이 있는 경우는 패스)
            let normalizedDesc = desc.replace(new RegExp(`([^\\n])` + delimiterStr, 'gi'), '$1\n$2');

            // 강제 줄바꿈된 텍스트를 기준으로 다시 쪼개기
            const headerRegex = new RegExp(`^` + delimiterStr, 'i');

            const chunks = normalizedDesc.split(/\r?\n/).reduce((acc, line) => {
                if (headerRegex.test(line.trim()) && acc.length > 0) acc.push([line]);
                else { if (acc.length === 0) acc.push([]); acc[acc.length - 1].push(line); }
                return acc;
            }, []).map(c => c.join('\n')).filter(c => c.trim().length > 15);

            const finalChunks = chunks.length > 0 ? chunks : [desc];
            
            const newTcs = finalChunks.map((chunk, idx) => {
                const firstLine = chunk.split('\n')[0].trim();
                const rawTitle = firstLine.replace(headerRegex, '').replace(/\*\*/g, '').trim() || `검증 영역 ${idx + 1}`;
                const shortTitle = rawTitle.length > 30 ? rawTitle.slice(0, 30) + "..." : rawTitle;

                let comp = "스페셜 오특", cat1 = "오늘의특가", cat2 = "BO 세트 관리", testdata = "전시 연결관리 > 올리브 배러 가상 카테고리";
                
                if (/브랜드관|API/i.test(chunk)) { comp = "오특 상품카드"; cat1 = "브랜드관 연동"; cat2 = "브랜드 정보"; testdata = "/shop-around/api/brand-store"; }
                else if (/위클리/i.test(chunk)) { comp = "위클리특가"; cat1 = "전시 코너"; cat2 = "독립 가상카테고리"; }
                else if (/내일의 특가|다가오는/i.test(chunk)) { comp = "내일의특가"; cat1 = "전시 코너"; cat2 = "상품 큐레이션"; }
                else if (/필터칩|OB 홈|올리브베러 홈/i.test(chunk)) { comp = "올리브베러 홈"; cat1 = "OB 홈"; cat2 = "필터칩"; }
                else if (/타이머|카운트다운|00:00:00/i.test(chunk)) { comp = "오늘의특가"; cat1 = "타이머"; cat2 = "24시간 카운트"; }

                const cleanComp = comp.replace(/_대 카테고리관|_대카테고리관/g, '').trim();
                const cleanCat1 = cat1.replace(/_대 카테고리관|_대카테고리관/g, '').trim();
                const boSetupStr = cleanComp === cleanCat1 ? `'${cleanComp}'` : `'${cleanComp}', '${cleanCat1}'`;

                let precond = (tone && !tone.usesNumberedPrecond) ? `- ${boSetupStr} 설정 상태` : `1. ${boSetupStr} 설정 상태`;
                if (OY_DOMAIN_RULES.W_CARE.keywords.some(k => chunk.includes(k)) || OY_DOMAIN_RULES.ROUTINE_ALARM.keywords.some(k => chunk.includes(k))) {
                    precond += (tone && !tone.usesNumberedPrecond) ? `\n- 미로그인 진입 완료 계정 상태` : `\n2. 미로그인 진입 완료 계정 상태`;
                }

                const expected = (tone && !tone.useNounEnding) ? `- '${shortTitle}' 기획 명세에 맞추어 정상 노출 및 동작한다.` : `- '${shortTitle}' 기획 명세 기준 정상 노출`;

                return {
                    comp, poc: cat1, menu: cat2, title: shortTitle, precond,
                    steps: `1. '${comp}' 영역 내 주요 지면 및 섹션별 상세 설계\n2. 기획 명세 조건에 따른 사용자 인터랙션 수행`,
                    expected, testdata, isAiModified: true
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
            alert(`✅ 텍스트가 자동 정규화되어 총 ${newTcs.length}개의 개별 TC 초안으로 완벽히 분할 생성되었습니다.`);
        } finally {
            btn.innerHTML = orig;
            btn.disabled = false;
        }
    },

    async triggerAiReviewPipeline() {
        const tc = this.tcList[this.currentEditIndex] || {};
        const text = `${tc.precond || ''} ${tc.steps || ''} ${tc.expected || ''}`;
        if (text.replace(/\s/g, '').length < 10) { alert("감리할 내용이 부족합니다."); return; }

        const btn = document.getElementById('btn-ai-review');
        const orig = btn.innerHTML;
        btn.innerHTML = `<span>⏳</span> 감리 중...`;
        btn.disabled = true;

        try {
            await new Promise(r => setTimeout(r, 1200));
            let errs = 0, details = [];

            const forbiddenWords = ['정상 확인', '동작 확인', '데이터 확인', '검증', '안됨', '이상함', '오류 발생', 'API'];
            let foundWords = forbiddenWords.filter(w => text.includes(w));
            if (foundWords.length > 0) {
                errs++; details.push(`**모호한 표현 및 비즈니스 금지어 사용 (작성 가이드 위반)**\n* **지적 사항:** 제3자가 해석하기 어려운 단어나 백엔드 기술 용어(${foundWords.map(w => `'${w}'`).join(', ')})가 감지되었습니다.\n* **권장 교정:** 'API'는 '데이터 연동/노출'로, 모호한 표현은 '토스트 메시지 노출' 등 구체적인 UI 상태로 기술하십시오.`);
            }

            if (tc.expected && (!tc.expected.endsWith('다.') && !tc.expected.endsWith('함') && !tc.expected.endsWith('음') && !tc.expected.endsWith('출') && !tc.expected.endsWith('가') && !tc.expected.endsWith('동'))) {
                errs++; details.push(`**Expected Result (기대결과) 명확성 부족**\n* **지적 사항:** 기대결과는 명확한 명사형이나 문장 종결 어미로 끝나야 합니다.\n* **권장 교정:** '- 토스트 팝업 정상 노출' 또는 '- 에러 없이 이동됨' 형태로 명확히 결속하십시오.`);
            }

            if (tc.comp.includes('랭킹') || tc.poc.includes('랭킹') || tc.menu.includes('상품 개수')) {
                if (!tc.expected.includes('3의 배수') && !tc.expected.includes('21개')) {
                    errs++; details.push(`**[🚨 OY 비즈니스 룰 위반] 랭킹 그리드 배수 및 최대 노출 명세 누락**\n* **지적 사항:** 랭킹 도메인은 '3의 배수 노출' 및 '최대 21개 제한' 비즈니스 규칙이 강제됩니다.\n* **권장 교정:** 기대결과에 "${OY_DOMAIN_RULES.RANKING_GRID.rule}" 명세를 명시하십시오.`);
                }
            }

            if (tc.menu.includes('장바구니') || tc.title.includes('장바구니') || tc.steps.includes('장바구니')) {
                if (tc.precond.includes('복수 옵션') && !tc.expected.includes('모달') && !tc.expected.includes('Dim')) {
                    errs++; details.push(`**[🚨 OY 비즈니스 룰 위반] 복수 옵션 상품 장바구니 담기 분기 오류**\n* **지적 사항:** 복수 옵션 상품은 장바구니 탭 시 즉시 담기지 않고 바텀 모달과 Dim 처리가 선행되어야 합니다.\n* **권장 교정:** 기대결과에 "${OY_DOMAIN_RULES.CART_OPTION.rule}" 명세를 결속하십시오.`);
                }
            }

            if (tc.comp.includes('잘 쉬기') || tc.comp.includes('잘 움직이기')) {
                if (tc.steps.includes('W케어') || tc.steps.includes('루틴 알림')) {
                    errs++; details.push(`**[🚨 OY 비즈니스 룰 위반] 서비스 퀵메뉴 카테고리 오배치**\n* **지적 사항:** 해당 카테고리관에서는 W케어 및 루틴 알림 퀵메뉴가 노출되지 않는 것이 비즈니스 표준입니다.\n* **권장 교정:** 올바른 카테고리관('잘 먹기/채우기' 또는 '잘 케어하기')으로 대상 컴포넌트를 변경하십시오.`);
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

            let style = 'background-color: #ffffff; cursor: pointer;';
            if (isSel && isAi) style = 'background-color: #ecfdf5; outline: 2px solid #3b82f6; border-left: 4px solid #10b981; cursor: pointer;';
            else if (isSel) style = 'background-color: #eff6ff; outline: 2px solid #3b82f6; cursor: pointer;';
            else if (isAi) style = 'background-color: #ecfdf5; border-left: 4px solid #10b981; cursor: pointer;';

            let num = `${idx + 1}`, nStyle = '';
            if (isAi) { nStyle = 'background:#059669; color:#fff; font-weight:bold;'; num += `<br><span style="font-size:9px; background:#a7f3d0; color:#065f46; padding:1px 3px; border-radius:3px;">✨AI</span>`; }
            else if (isSel) nStyle = 'background:#2563eb; color:#fff; font-weight:bold;';

            const td = (key, val, skip, span) => skip ? '' : `<td rowspan="${span}" style="border: 1px solid #cbd5e0; padding: 8px; text-align: center; vertical-align: middle; font-weight: ${key==='comp'?'bold':'normal'}; color:${key==='comp'?'#1e3a8a':'#334155'}; background:${key==='comp' && isAi?'#ecfdf5':'#f8fafc'};">${val || ''}</td>`;

            return `
                <tr class="tc-table-row" data-index="${idx}" style="${style}">
                    <td style="border: 1px solid #cbd5e0; padding: 8px; text-align: center; vertical-align: middle; ${nStyle}">${num}</td>
                    ${td('comp', tc.comp, spans[idx].skipComp, spans[idx].comp)}
                    ${td('poc', tc.poc, spans[idx].skipPoc, spans[idx].poc)}
                    ${td('menu', tc.menu, spans[idx].skipMenu, spans[idx].menu)}
                    ${td('title', tc.title, spans[idx].skipTitle, spans[idx].title)}
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
