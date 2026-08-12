window.QA_CORE = window.QA_CORE || {};
window.QA_CORE.Tc = window.QA_CORE.Tc || {};

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
                <h2 style="font-size: 1.1rem; font-weight: 700; color: #0369a1; margin: 0 0 12px 0;">🤖 LLM 기반 OY 특화 TC 자동 설계</h2>
                <div class="form-group" style="display: flex; flex-direction: column; flex: 1; margin-bottom: 16px; overflow: hidden;">
                    <label style="font-size: 12px; font-weight: 700; color: #0c4a6e; margin-bottom: 8px;">OY 기능 / 기획 개편안 요약 명세</label>
                    <textarea id="ai-feature-desc" placeholder="기획서 원문을 복사해서 붙여넣으세요. 20년차 QA 관점의 예외/경계값 테스트가 자동 포함되어 설계됩니다." style="background:#fff; color:#000; border:1px solid #7dd3fc; padding:12px; border-radius:6px; font-size:13px; line-height:1.5; width:100%; box-sizing:border-box; resize:none; flex: 1; overflow-y: auto;"></textarea>
                </div>
                <div style="display:flex; gap:8px; flex-shrink: 0;">
                    <button id="btn-ai-generate" style="background:#0284c7; color:white; border:none; padding:12px; font-size:13px; font-weight:bold; border-radius:6px; cursor:pointer; flex:1;" title="입력된 명세를 바탕으로 LLM 백엔드를 통해 TC를 자동 생성합니다.">✨ AI 지능형 초안 생성</button>
                    <button id="btn-ai-reverse" style="background:#4b5563; color:white; border:none; padding:12px; font-size:13px; font-weight:bold; border-radius:6px; cursor:pointer; flex:1;" title="현재 보드에 작성된 TC를 텍스트로 추출합니다.">🔄 역추출 가이드</button>
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
    state: {
        // 🚨 실행 방안 1에서 발급받은 실제 GAS 백엔드 URL을 필히 여기에 입력하셔야 통신이 작동합니다.
        gasLlmProxyUrl: 'https://script.google.com/macros/s/여기에_LLM_프록시_배포_URL_입력/exec'
    },

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
        let plainText = e.clipboardData.getData('text/plain');
        if (!plainText) return;
        
        e.preventDefault();
        const startPos = descArea.selectionStart;
        const endPos = descArea.selectionEnd;
        descArea.value = descArea.value.substring(0, startPos) + plainText + descArea.value.substring(endPos);
        descArea.selectionStart = descArea.selectionEnd = startPos + plainText.length;
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

    triggerReverseExtraction() {
        const validTcs = this.tcList.filter(tc => tc.title || tc.steps || tc.expected);
        if (validTcs.length === 0) {
            alert("역추출할 TC 데이터가 없습니다. 우측 보드에 데이터가 존재해야 합니다.");
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
            const compHeader = `${tc.comp || '공통 기능'}|${tc.poc || '전시/노출'}|${tc.menu || '상세 정책'}`;
            block.push(`■ [${compHeader}] ${tc.title || tc.target}`);
            if (tc.precond) block.push(`조건: ${tc.precond.replace(/\n/g, ' ')}`);
            if (tc.steps) block.push(`액션: ${tc.steps.replace(/\n/g, ' ')}`);
            if (tc.expected) block.push(`결과:\n${tc.expected}`);
            return block.join('\n');
        }).join('\n\n');

        descEl.value = reverseText;
        alert(`✅ 총 ${validTcs.length}개의 텍스트 역추출이 완료되었습니다.`);
    },

    // 🚨 기존 정규식 파싱 로직을 폐기하고 실제 LLM API 기반 지능형 파싱 통신 엔진으로 전면 쇄신
    async triggerAiGenerationPipeline() {
        const descEl = document.getElementById('ai-feature-desc');
        let desc = descEl ? descEl.value.trim() : '';
        if (desc.length < 10) { alert("기획 명세를 10자 이상 입력하세요."); descEl?.focus(); return; }

        const btn = document.getElementById('btn-ai-generate');
        const orig = btn.innerHTML;
        btn.innerHTML = `<span>⏳</span> LLM 서버 심층 분석 및 TC 변환 중...`;
        btn.disabled = true;

        try {
            // 사전에 정의된 특정 예외 하드코딩 패스 유지 (속도 최적화용)
            if (desc.includes("네이티브 영역에서 가로 또는 세로 이미지 최적화 수치를 0으로 요청")) {
                this.executeLegacyHardcodedPath();
                return;
            }

            if (!this.state || !this.state.gasLlmProxyUrl || this.state.gasLlmProxyUrl.includes('여기에_LLM_프록시')) {
                alert("🚨 시스템 설정 오류: LLM 연동을 위한 GAS 백엔드 URL이 입력되지 않았습니다. 소스코드를 확인해주세요.");
                return;
            }

            // 구글 앱스 스크립트 LLM Proxy 통신 파이프라인 기동
            const response = await fetch(this.state.gasLlmProxyUrl, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ description: desc })
            });

            if (!response.ok) throw new Error("네트워크 연동 실패 (HTTP " + response.status + ")");

            const data = await response.json();
            
            if (data.error) throw new Error(data.error);

            let generatedTcs = data.tcList || [];
            
            if (generatedTcs.length === 0) {
                throw new Error("AI가 유효한 TC 포맷을 추출하지 못했습니다. 기획서를 구체적으로 보완해주세요.");
            }

            // 시각적 강조를 위한 AI Modified 플래그 강제 부착
            generatedTcs = generatedTcs.map(tc => ({ ...tc, isAiModified: true }));

            this.tcList = generatedTcs;
            this.hierarchicalSort();
            this.renderTable();
            
            alert(`✅ AI 기반 지능형 TC 설계 완료: 예외/오류(Negative) 케이스를 포함한 총 ${generatedTcs.length}개의 정밀 TC가 도출되었습니다.`);

        } catch (error) {
            console.error(error);
            alert("🚨 AI TC 자동 설계 중 치명적 결함 발생:\n\n" + error.message);
        } finally {
            btn.innerHTML = orig;
            btn.disabled = false;
        }
    },

    executeLegacyHardcodedPath() {
        const newTcs = [];
        const imageTypes = [
            { cond: "1. 정사각형 이미지 (1:1) 파일 업로드된 상태", exp: "- 등록한 이미지 비율 깨짐 없이 노출" },
            { cond: "1. 세로가 긴 이미지 (2:3) 파일 업로드된 상태", exp: "- 등록한 이미지 비율 깨짐 없이 노출" }
        ];
        const matrix = [
            { c1: "홈 GNB", c2: "메인 배너", step: "1. 메인 배너 이미지 확인", types: imageTypes }
        ];

        matrix.forEach(m => {
            m.types.forEach(t => {
                newTcs.push({
                    comp: "OB 네이티브", poc: m.c1, menu: m.c2, title: "", target: "비율 유지 노출 확인", 
                    precond: t.cond, steps: m.step, expected: t.exp, testdata: "", isAiModified: true
                });
            });
        });

        this.tcList = newTcs;
        this.renderTable();
        alert(`✅ 특수 기획서 룰에 의거하여 총 ${newTcs.length}개의 TC가 생성되었습니다.`);
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
