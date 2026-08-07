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
            background: #f8fafc;
        }
        .tc-fullscreen .table-wrapper {
            max-height: calc(100vh - 80px) !important;
        }
        body.tc-fullscreen-active {
            overflow: hidden !important;
        }
    </style>
    <div class="content-panel active" style="display: flex; gap: 20px; width: 100%; flex-direction: row; box-sizing: border-box; padding: 4px; align-items: stretch;">
        
        <div style="flex: 1.2; display: flex; flex-direction: column; min-width: 400px; max-height: calc(100vh - 160px); min-height: 450px; position: sticky; top: 20px;">
            <div class="card-panel" style="background: linear-gradient(145deg, #f0f9ff, #e0f2fe); padding: 20px; border-radius: 8px; border: 1px solid #bae6fd; display: flex; flex-direction: column; flex: 1; overflow: hidden;">
                <h2 style="font-size: 1.1rem; font-weight: 700; color: #0369a1; margin: 0 0 12px 0;">🤖 AI 기반 OY 특화 TC 자동 설계</h2>
                <div class="form-group" style="display: flex; flex-direction: column; flex: 1; margin-bottom: 16px; overflow: hidden;">
                    <label style="font-size: 12px; font-weight: 700; color: #0c4a6e; margin-bottom: 8px;">OY 기능 / 기획 개편안 요약 명세</label>
                    <textarea id="ai-feature-desc" placeholder="기획서 원문을 복사해서 붙여넣으세요. (취소선 자동 삭제 및 마크다운 자동 변환 가동 중)" style="background:#fff; color:#000; border:1px solid #7dd3fc; padding:12px; border-radius:6px; font-size:13px; line-height:1.5; width:100%; box-sizing:border-box; resize:none; flex: 1; overflow-y: auto;"></textarea>
                </div>
                <div style="display:flex; gap:8px; flex-shrink: 0;">
                    <button id="btn-ai-generate" style="background:#0284c7; color:white; border:none; padding:12px; font-size:13px; font-weight:bold; border-radius:6px; cursor:pointer; flex:1;" title="입력된 명세를 바탕으로 TC를 자동 생성합니다.">✨ AI 초안 생성</button>
                    <button id="btn-ai-reverse" style="background:#4b5563; color:white; border:none; padding:12px; font-size:13px; font-weight:bold; border-radius:6px; cursor:pointer; flex:1;" title="현재 보드에 작성된 TC를 AI 최적화 기획 명세 포맷으로 역추출합니다.">🔄 역추출 가이드</button>
                </div>
            </div>
        </div>

        <div style="flex: 2.8; display: flex; flex-direction: column; gap: 16px; min-width: 0;">
            <div class="tc-preview-zone" style="background: #ffffff; padding: 20px; border-radius: 8px; border: 1px solid #e2e8f0; display: flex; flex-direction: column; height: 100%;">
                <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 12px; flex-shrink: 0;">
                    <h3 style="font-size: 1rem; font-weight: 700; color: #2d3748; margin: 0;">📊 OY 실무 스프레드시트 정형화 뷰어</h3>
                    <div style="display: flex; gap: 6px; align-items: center;">
                        <select id="tc-zoom-select" style="font-size: 11px; padding: 5px 8px; border: 1px solid #cbd5e0; border-radius: 4px; cursor: pointer; background: #f8fafc; color: #334155; font-weight: bold; outline: none;">
                            <option value="0.75">🔍 75%</option>
                            <option value="0.80">🔍 80%</option>
                            <option value="0.85">🔍 85%</option>
                            <option value="0.90">🔍 90%</option>
                            <option value="0.95">🔍 95%</option>
                            <option value="1" selected>🔍 100%</option>
                            <option value="1.05">🔍 105%</option>
                            <option value="1.10">🔍 110%</option>
                            <option value="1.15">🔍 115%</option>
                            <option value="1.20">🔍 120%</option>
                            <option value="1.25">🔍 125%</option>
                        </select>
                        <button id="btn-open-import-modal" style="white-space: nowrap; background: #0f172a; color: #fff; border: none; padding: 6px 12px; font-size: 11px; font-weight: 700; border-radius: 4px; cursor: pointer;">📥 시트 데이터 파싱</button>
                        <button class="btn-cal-nav" id="btn-tc-fullscreen" style="white-space: nowrap; font-size: 11px; padding: 6px 10px; background: #f8fafc; color: #334155; border: 1px solid #cbd5e0; border-radius: 4px; cursor: pointer; font-weight: 700;">🖥️ 전체보기</button>
                        <button class="btn-action" id="btn-tc-copy-sheet" style="white-space: nowrap; font-size: 11px; padding: 6px 12px; background: #3182ce; color: white; border: none; border-radius: 4px; cursor: pointer; font-weight: 700;">시트 복사</button>
                    </div>
                </div>
                
                <div class="table-wrapper" id="tc-scroll-wrapper" style="overflow: auto; flex: 1; min-height: 550px; max-height: 800px; border: 1px solid #cbd5e0; position: relative; background: #f8fafc;">
                    <table id="tc-native-sheet" style="border-collapse: collapse; width: max-content; min-width: 1050px; font-family: 'Malgun Gothic', sans-serif; font-size: 11px; text-align: left; transform-origin: top left;">
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
    debouncedRenderTable: null,

    init() {
        const panelZone = document.getElementById('tab-panel-tc');
        if (panelZone) panelZone.innerHTML = window.QA_CORE.Tc.TEMPLATE;

        if (!this.debouncedRenderTable) {
            this.debouncedRenderTable = this.debounce(() => this.renderTable(), 150);
        }

        this.bindEvents();
        this.renderTable();
    },

    debounce(func, wait) {
        let timeout;
        return (...args) => {
            clearTimeout(timeout);
            timeout = setTimeout(() => func(...args), wait);
        };
    },

    bindEvents() {
        const descArea = document.getElementById('ai-feature-desc');
        if (descArea && !descArea.dataset.pasteBound) {
            descArea.addEventListener('paste', this.handleSmartPaste.bind(this));
            descArea.dataset.pasteBound = 'true';
        }

        const bindModal = (openBtnId, modalId, closeBtnId) => {
            const openBtn = document.getElementById(openBtnId);
            const modal = document.getElementById(modalId);
            const closeBtn = document.getElementById(closeBtnId);
            if (openBtn && modal) openBtn.onclick = () => modal.style.display = 'flex';
            if (closeBtn && modal) closeBtn.onclick = () => modal.style.display = 'none';
            if (modal) modal.onclick = (e) => { if (e.target === modal) modal.style.display = 'none'; };
        };

        bindModal('btn-open-import-modal', 'tc-import-modal', 'btn-cancel-import');

        const zoomSelect = document.getElementById('tc-zoom-select');
        const tableWrapper = document.getElementById('tc-scroll-wrapper');
        const table = document.getElementById('tc-native-sheet');

        if (zoomSelect && table && tableWrapper) {
            zoomSelect.addEventListener('change', (e) => {
                table.style.zoom = e.target.value;
            });

            tableWrapper.addEventListener('wheel', (e) => {
                if (e.ctrlKey) {
                    e.preventDefault();
                    
                    let currentVal = parseFloat(zoomSelect.value);
                    if (isNaN(currentVal)) currentVal = 1.0; 
                    
                    if (e.deltaY < 0) {
                        currentVal = Math.min(1.25, currentVal + 0.05);
                    } else {
                        currentVal = Math.max(0.75, currentVal - 0.05);
                    }
                    
                    currentVal = Math.round(currentVal * 100) / 100;
                    let strVal = (currentVal === 1) ? "1" : currentVal.toFixed(2);
                    
                    zoomSelect.value = strVal;
                    table.style.zoom = currentVal;
                }
            }, { passive: false });
        }

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
                
                this.tcList = rows.map(cols => {
                    let offset = /^\d+$/.test(cols[0]) ? 1 : 0;
                    let comp = cols[0 + offset] || '', poc = cols[1 + offset] || '', menu = cols[2 + offset] || '', title = cols[3 + offset] || '';
                    let target = cols[4 + offset] || '', precond = cols[5 + offset] || '', steps = cols[6 + offset] || '', expected = cols[7 + offset] || '', testdata = cols[8 + offset] || '';

                    return { comp, poc, menu, title, target, precond, steps, expected, testdata, isAiModified: false };
                });

                if (isFillDown) {
                    let lastComp = "", lastPoc = "", lastMenu = "";
                    this.tcList.forEach(tc => {
                        if (tc.comp !== "") lastComp = tc.comp; else tc.comp = lastComp;
                        if (tc.poc !== "") lastPoc = tc.poc; else tc.poc = lastPoc;
                        if (tc.menu !== "") lastMenu = tc.menu; else tc.menu = lastMenu;
                    });
                }

                this.hierarchicalSort();
                this.renderTable();
                document.getElementById('tc-import-modal').style.display = 'none';
                document.getElementById('import-raw-text').value = '';
                alert(`✅ 총 ${rows.length}개 행이 단 1칸의 밀림 없이 완벽히 파싱 및 정렬되었습니다.`);
            };
        }

        const aiGen = document.getElementById('btn-ai-generate');
        if (aiGen) aiGen.onclick = () => this.triggerAiGenerationPipeline();

        const reverseBtn = document.getElementById('btn-ai-reverse');
        if (reverseBtn) reverseBtn.onclick = () => this.triggerReverseExtraction();

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
        let htmlData = e.clipboardData.getData('text/html');
        let plainText = e.clipboardData.getData('text/plain');
        
        let dropCount = 0;
        let cleanText = "";

        if (htmlData) {
            e.preventDefault(); 
            const parser = new DOMParser();
            const doc = parser.parseFromString(htmlData, 'text/html');
            
            const dropNodes = doc.querySelectorAll('del, s, strike');
            const dropStyledNodes = Array.from(doc.querySelectorAll('*')).filter(el => {
                const style = el.getAttribute('style');
                return style && style.toLowerCase().includes('line-through');
            });
            
            dropCount = dropNodes.length + dropStyledNodes.length;
            
            dropNodes.forEach(n => n.remove());
            dropStyledNodes.forEach(n => n.remove());

            doc.body.innerHTML = doc.body.innerHTML
                .replace(/<br\s*\/?>/gi, '\n')
                .replace(/<\/(p|div|li|h[1-6])>/gi, '\n')
                .replace(/<p>|<div>/gi, ''); 
            
            cleanText = doc.body.textContent || "";
            cleanText = cleanText.replace(/\n{3,}/g, '\n\n').trim();
        } else if (plainText) {
            e.preventDefault();
            cleanText = plainText.trim();
        } else {
            return;
        }

        const isAlreadyStructured = /^■\s*\[.*?\]/m.test(cleanText) || /^조건:/m.test(cleanText) || /^액션:/m.test(cleanText);
        
        let finalText = cleanText;
        let converted = false;
        let typoCount = 0;

        if (!isAlreadyStructured && cleanText.length > 10) {
            const result = this.convertToStructuredFormat(cleanText);
            finalText = result.text;
            typoCount = result.correctedCount;
            converted = true;
        }

        const startPos = descArea.selectionStart;
        const endPos = descArea.selectionEnd;
        descArea.value = descArea.value.substring(0, startPos) + finalText + descArea.value.substring(endPos);
        descArea.selectionStart = descArea.selectionEnd = startPos + finalText.length;
        
        if (dropCount > 0 || converted) {
            let msgs = [];
            if (dropCount > 0) msgs.push(`- 취소선 스펙(Drop) ${dropCount}건 영구 삭제`);
            if (typoCount > 0) msgs.push(`- 맞춤법 자동 교정 ${typoCount}건 반영`);
            if (converted) msgs.push(`- 원시 텍스트 컨텍스트 분석 및 그룹핑 구조화 완료`);
            
            alert(`✨ [페이스트 & 컨버트 엔진 가동]\n\n${msgs.join('\n')}\n\n입력창에 최적화된 역추출 포맷이 자동 적용되었습니다. 내용을 검토한 뒤 초안을 생성하세요.`);
        }
    },

    determineGlobalComponent(text) {
        if (/오특|오늘의\s*특가/i.test(text)) return "오늘의특가";
        if (/다가오는 특가|내일의 특가/i.test(text)) return "다가오는 특가";
        if (/위클리/i.test(text)) return "위클리특가";
        if (/홈 GNB|GNB/i.test(text)) return "홈 GNB";
        if (/루틴/i.test(text)) return "루틴 알림";
        if (/W케어/i.test(text)) return "W케어";
        if (/포커스/i.test(text)) return "포커스 섹션";
        
        const lines = text.split('\n').map(l => l.trim()).filter(l => l);
        if (lines.length > 0) {
            const firstLine = lines[0];
            if (!/^[0-9a-zA-Z①-⑳\-\.\[\]\(\)]/i.test(firstLine)) {
                const words = firstLine.split(/\s+/);
                if (words.length > 0) return words.slice(0, 2).join(' ');
            }
        }
        return "공통 기능";
    },

    convertToStructuredFormat(desc) {
        const TYPO_DICTIONARY = {
            '포험': '포함', '업을 경우': '없을 경우', '씨네일': '썸네일', '썸내일': '썸네일',
            '사품': '상품', '배지어트': '베지어트', '결재': '결제', '디폴트 값': '디폴트값'
        };
        
        let correctedCount = 0;
        Object.keys(TYPO_DICTIONARY).forEach(typo => {
            const regex = new RegExp(typo, 'g');
            if (regex.test(desc)) {
                desc = desc.replace(regex, TYPO_DICTIONARY[typo]);
                correctedCount++;
            }
        });

        const globalComp = this.determineGlobalComponent(desc);

        let processedDesc = desc.replace(/(?<!\d)\.\s+(?=[가-힣A-Za-z])/g, '.\n');
        let chunks = processedDesc.split(/\n\s*\n|\n(?=[■◆#①-⑳])/).map(c => c.trim()).filter(c => c.length > 5);

        const structuredBlocks = chunks.map((chunk, idx) => {
            const lines = chunk.split('\n').map(l => l.trim()).filter(l => l);
            if (lines.length === 0) return '';

            let rawTitle = lines[0].replace(/^[■◆#①-⑳\-\.\[\]\(\)a-zA-Z0-9]+\s*/, '').trim();
            
            let comp = globalComp;
            let target = rawTitle;

            const titleMatch = rawTitle.match(/^\[(.*?)\]\s*(.*)$/);
            if (titleMatch) {
                comp = titleMatch[1].trim();
                target = titleMatch[2].trim();
            }

            if (!target) target = `기능 확인 ${idx + 1}`;

            let condition = "";
            let action = "";
            let results = [];

            for (let i = 1; i < lines.length; i++) {
                let line = lines[i].replace(/^[-\*•]\s*/, '').trim();
                if (!line) continue;

                if (line.startsWith('조건:') || /경우$|상태면$|상태인$|때$/i.test(line)) {
                    condition = line.replace(/^조건:\s*/, '').trim();
                } 
                else if (line.startsWith('액션:') || /진입$|탭$|클릭$|확인$|선택$/i.test(line)) {
                    action = line.replace(/^액션:\s*/, '').trim();
                } 
                else {
                    let resLine = line.replace(/^[-]\s*/, '');
                    if (resLine) results.push(`- ${resLine}`);
                }
            }

            if (!action) {
                action = target.includes('스와이프') ? '좌/우 Swipe' : `${target} 확인`;
            }
            if (results.length === 0) {
                results.push(`- ${target} 정상 노출`);
            }

            let block = `■ [${comp}] ${target}\n`;
            if (condition) block += `조건: ${condition}\n`;
            block += `액션: ${action}\n`;
            block += results.join('\n');

            return block;
        });

        return { text: structuredBlocks.join('\n\n'), correctedCount };
    },

    hierarchicalSort() {
        if (this.tcList.length <= 1) return;

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
    },

    // [핵심 수정 1] 카테고리 1, 2 정보를 포맷 문자열에 함께 기록하여 파싱 재실행 시 유실 방지
    triggerReverseExtraction() {
        const validTcs = this.tcList.filter(tc => tc.title || tc.steps || tc.expected);
        if (validTcs.length === 0) {
            alert("역추출할 TC 데이터가 없습니다. 우측 보드에 파싱된 데이터가 존재해야 합니다.");
            return;
        }

        const descEl = document.getElementById('ai-feature-desc');
        if (descEl.value.trim().length > 0) {
            if (!confirm("역추출을 실행하면 현재 입력창의 텍스트가 모두 덮어씌워집니다.\n진행하시겠습니까?")) {
                return;
            }
        }

        const reverseText = validTcs.map(tc => {
            let block = [];
            
            // Component 필드에 [Component|Category1|Category2] 메타데이터 통합 기록
            const compHeader = `${tc.comp || '공통 기능'}|${tc.poc || '전시/노출'}|${tc.menu || '상세 정책'}`;
            block.push(`■ [${compHeader}] ${tc.title || tc.target}`);
            
            if (tc.precond) {
                const cleanPre = tc.precond.split('\n').map(l => l.replace(/^\d+\.\s*/, '').trim()).filter(l=>l).join(', ');
                if (cleanPre) block.push(`조건: ${cleanPre}`);
            }
            
            if (tc.steps) {
                const stepLines = tc.steps.split('\n').filter(l=>l.trim());
                const lastStep = stepLines[stepLines.length - 1].replace(/^\d+\.\s*/, '').trim();
                if (lastStep) block.push(`액션: ${lastStep}`);
            }
            
            if (tc.expected) {
                block.push(`${tc.expected}`);
            }
            
            return block.join('\n');
        }).join('\n\n');

        descEl.value = reverseText;
        alert(`✅ 총 ${validTcs.length}개의 TC를 바탕으로 기획 명세 포맷 역추출이 완료되었습니다.\n\n이 구조를 참고하여 향후 기획서를 작성하시면 파싱 자동화율이 극대화되며, 이 텍스트를 그대로 [AI 초안 생성] 시 똑같은 TC가 복원됩니다.`);
    },

    async triggerAiGenerationPipeline() {
        const descEl = document.getElementById('ai-feature-desc');
        let desc = descEl ? descEl.value.trim() : '';
        if (desc.length < 10) { alert("기획 명세를 10자 이상 입력하세요."); descEl?.focus(); return; }

        const btn = document.getElementById('btn-ai-generate');
        const orig = btn.innerHTML;
        btn.innerHTML = `<span>⏳</span> 파싱 및 TC 변환 중...`;
        btn.disabled = true;

        try {
            await new Promise(r => setTimeout(r, 1200));

            const globalComp = this.determineGlobalComponent(desc);

            let rawChunks = desc.split(/\n\s*\n/).map(c => c.trim()).filter(c => c.length > 5);
            let chunks = [];

            const delimiterStr = `(#{2,4}\\s+|[①②③④⑤⑥⑦⑧⑨⑩⑪⑫⑬⑭⑮⑯⑰⑱⑲⑳❶❷❸❹❺❻❼❽❾❿⓫⓬⓭⓮⓯⓰⓱⓲⓳⓴]|■|◆|\\[\\d+\\]|<\\d+>|【[^】]+】|\\d+\\.\\s+(?=[가-힣A-Za-z\\s]{0,20}(?:지면|섹션|설계|정책|화면|기능|요구사항|공통|기획|상품|카드|연동|테스트|특가)))`;
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
                const lines = chunk.split('\n').map(l => l.trim()).filter(l => l);
                const firstLine = lines[0] || '';
                
                let comp = globalComp;
                let shortTitle = "";
                let explicitPrecond = "";
                let explicitAction = "";
                let expectedLines = [];
                
                // [핵심 수정 2] 카테고리 1, 2 메타데이터 복원 파싱
                let explicitCat1 = "";
                let explicitCat2 = "";

                const structuredMatch = firstLine.match(/^[■◆#]*\s*\[(.*?)\]\s*(.*)$/);
                if (structuredMatch) {
                    const rawCompInfo = structuredMatch[1].trim();
                    shortTitle = structuredMatch[2].trim();

                    if (rawCompInfo.includes('|')) {
                        const parts = rawCompInfo.split('|');
                        comp = parts[0].trim() || globalComp;
                        explicitCat1 = parts[1] ? parts[1].trim() : "";
                        explicitCat2 = parts[2] ? parts[2].trim() : "";
                    } else {
                        comp = rawCompInfo;
                    }
                } else {
                    let rawTitle = firstLine.replace(/^[■◆#①-⑳\-\.\[\]\(\)a-zA-Z0-9]+\s*/, '').trim();
                    shortTitle = rawTitle.replace(/(상세\s*설계|운영\s*정책|가이드|섹션|영역|화면|리스트|목록|노출\s*정보|기타\s*정책|공통\s*사항|주요\s*지면|섹션구성|특징|방식).*$/gi, '').trim();
                    shortTitle = shortTitle.replace(/[-:;,.>]+$/, '').trim(); 
                    if (shortTitle.length > 25) {
                        const nouns = shortTitle.match(/[가-힣A-Za-z0-9]+/g) || [];
                        shortTitle = nouns.slice(0, 4).join(' '); 
                        if (shortTitle.length > 25) shortTitle = shortTitle.slice(0, 25).trim();
                    }
                    if (!shortTitle || shortTitle.length <= 1) shortTitle = `기능 확인 ${idx + 1}`;
                }
                
                // [핵심 수정 3] 명시된 Category1, Category2가 존재하면 복원하고, 없으면 자동 규칙 추론
                let cat1 = explicitCat1 || "전시/노출";
                let cat2 = explicitCat2 || "상세 정책";

                if (!explicitCat1) {
                    if (/다가오는 특가|내일의 특가/.test(comp)) { cat1 = "상품 공통"; cat2 = "상품명"; }
                    else if (/홈 GNB/.test(comp)) { cat1 = "오특 섹션"; cat2 = "필터칩"; }
                    else if (/오늘의특가/.test(comp)) { cat1 = "전시 코너"; cat2 = "특가 관리"; }
                    else if (/위클리특가/.test(comp)) { cat1 = "전시 코너"; cat2 = "독립 가상카테고리"; }
                    else if (/홈 전시/.test(comp)) { cat1 = "홈"; cat2 = "필터칩"; }
                    else if (/타이머/.test(comp)) { cat1 = "타이머"; cat2 = "시간 카운트"; }
                    else if (/오류|에러/.test(comp)) { cat1 = "오류 케이스"; cat2 = "예외 처리"; }
                    if (/브랜드|API/i.test(chunk)) { cat1 = "데이터 연동"; cat2 = "정보 호출"; }
                }

                lines.slice(1).forEach(line => {
                    if (line.startsWith('조건:')) explicitPrecond = line.replace('조건:', '').trim();
                    else if (line.startsWith('액션:')) explicitAction = line.replace('액션:', '').trim();
                    else if (line.startsWith('-')) expectedLines.push(line);
                });

                let precond = "";
                if (explicitPrecond) {
                    precond = explicitPrecond.split(',').map((p, i) => `${i+1}. ${p.trim()}`).join('\n');
                } else {
                    const cleanComp = comp.replace(/_대 카테고리관|_대카테고리관/g, '').trim();
                    const cleanCat1 = cat1.replace(/_대 카테고리관|_대카테고리관/g, '').trim();
                    const boSetupStr = cleanComp === cleanCat1 ? `'${cleanComp}'` : `'${cleanComp}', '${cleanCat1}'`;
                    precond = `1. ${boSetupStr} 설정 상태`;
                    
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
                }

                let steps = "";
                let baseStep1 = `1. 올리브베러 홈 > 오특 GNB 진입`;
                if (explicitAction) {
                    steps = `${baseStep1}\n2. ${explicitAction}`;
                } else {
                    let action = "확인";
                    if(/스와이프|swipe/i.test(chunk)) action = "좌/우 Swipe";
                    else if(/탭|클릭/i.test(chunk)) action = "탭";
                    else if(/새로고침/i.test(chunk)) {
                        baseStep1 = "1. 상단 새로고침 진행"; action = "확인";
                    }
                    let targetSub = shortTitle;
                    if(action === "좌/우 Swipe") targetSub = "리스트";
                    if(targetSub === "기능 확인") targetSub = "상품";
                    steps = `${baseStep1}\n2. ${targetSub} ${action}`;
                }

                let target = shortTitle.replace(/확인|탭|변경/g, '').trim();
                const actionStr = explicitAction || chunk;
                if (/swipe|스와이프/i.test(actionStr)) target = "상품 Swipe";
                else if (/탭|클릭/i.test(actionStr)) target = "동작_탭";
                else if (/정렬|순서/i.test(actionStr)) target = "상품 정렬 순서 확인";
                else if (/두줄|세줄|말줄임/i.test(actionStr)) target = "상품 명 노출 확인";
                else if (/시간|카운트다운/i.test(actionStr)) target = "상품 노출 시간";
                else if (/변경/i.test(actionStr)) target += " 변경";
                else if (/미수신|오류/i.test(actionStr)) target += " 미수신";
                else if (/노출/i.test(actionStr)) target += " 노출 확인";
                else target += " 노출";
                if (target.trim() === "노출" || target.trim() === "") target = "기본 UI 노출";

                let expected = "";
                if (expectedLines.length > 0) {
                    expected = expectedLines.map(l => {
                        let t = l.trim();
                        if (!explicitAction) {
                            let tRaw = t.replace(/^-/, '').trim();
                            tRaw = tRaw.replace(/수정됨/g, '노출').replace(/수정/g, '변경').replace(/되었으며 대신/g, '되며');
                            if (!tRaw.match(/(됨|출|경|음|리|함|다\.|표시|적용|증가)$/)) tRaw += ' 노출';
                            t = '- ' + tRaw;
                        }
                        return t;
                    }).join('\n');
                } else {
                    if (/미노출|제외|없으면/i.test(chunk)) expected = `- ${shortTitle} 미노출`;
                    else if (/이동|진입/i.test(chunk)) expected = `- 해당 페이지로 이동`;
                    else expected = `- ${shortTitle} 노출`;
                }

                return {
                    comp, poc: cat1, menu: cat2, title: shortTitle, target, precond,
                    steps, expected, testdata: "", isAiModified: true
                };
            });

            this.tcList = newTcs;
            this.hierarchicalSort();
            this.renderTable();
            
            alert(`✅ 텍스트가 자동 정규화되어 총 ${newTcs.length}개의 개별 TC 초안으로 완벽히 분할 생성되었습니다.`);

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

        let html = "";
        
        if (this.tcList.length > 0 && this.tcList[0].comp !== undefined) {
            html += this.tcList.map((tc, idx) => {
                const isAi = tc.isAiModified;
                let bg = '#ffffff';
                let borderStyle = '';
                if (isAi) {
                    bg = '#ecfdf5';
                    borderStyle = 'border-left: 4px solid #10b981;';
                }
                const rowStyle = `background-color: ${bg}; cursor: pointer; ${borderStyle}`;
                let num = `${idx + 1}`, nStyle = '';
                if (isAi) { nStyle = 'background:#059669; color:#fff; font-weight:bold;'; num += `<br><span style="font-size:9px; background:#a7f3d0; color:#065f46; padding:1px 3px; border-radius:3px;">✨AI</span>`; }

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
        }

        const MIN_ROWS = 25;
        const currentDataLength = (this.tcList.length === 0 || this.tcList[0].comp === undefined) ? 0 : this.tcList.length;
        
        if (currentDataLength < MIN_ROWS) {
            for (let i = currentDataLength; i < MIN_ROWS; i++) {
                html += `
                    <tr style="background-color: #ffffff; pointer-events: none; height: 35px;">
                        <td style="border: 1px solid #cbd5e0; padding: 8px; text-align: center; color: #94a3b8; font-size: 10px;">${i + 1}</td>
                        <td style="border: 1px solid #cbd5e0; padding: 8px;"></td>
                        <td style="border: 1px solid #cbd5e0; padding: 8px;"></td>
                        <td style="border: 1px solid #cbd5e0; padding: 8px;"></td>
                        <td style="border: 1px solid #cbd5e0; padding: 8px;"></td>
                        <td style="border: 1px solid #cbd5e0; padding: 8px;"></td>
                        <td style="border: 1px solid #cbd5e0; padding: 8px;"></td>
                        <td style="border: 1px solid #cbd5e0; padding: 8px;"></td>
                        <td style="border: 1px solid #cbd5e0; padding: 8px;"></td>
                        <td style="border: 1px solid #cbd5e0; padding: 8px;"></td>
                    </tr>
                `;
            }
        }

        tbody.innerHTML = html;
    }
};

export function initTcPanel() { window.QA_CORE.Tc.Manager.init(); }

if (window.QA_CORE.SkillManager && typeof window.QA_CORE.SkillManager.register === 'function') {
    window.QA_CORE.SkillManager.register('TcModuleCore', window.QA_CORE.Tc.Manager);
}
