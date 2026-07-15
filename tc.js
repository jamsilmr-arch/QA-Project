window.QA_CORE = window.QA_CORE || {};
window.QA_CORE.Tc = window.QA_CORE.Tc || {};

window.QA_CORE.Tc.TEMPLATE = `
    <div class="content-panel active" style="display: flex; gap: 20px; width: 100%; flex-direction: row; box-sizing: border-box; padding: 4px;">
        
        <!-- 좌측: AI 엔진 및 입력 제어 보드 구역 -->
        <div style="flex: 1.5; display: flex; flex-direction: column; gap: 16px; min-width: 400px;">
            
            <div class="card-panel" style="background: linear-gradient(145deg, #f0f9ff, #e0f2fe); padding: 20px; border-radius: 8px; border: 1px solid #bae6fd; box-shadow: 0 4px 12px rgba(0,0,0,0.03);">
                <h2 style="font-size: 1.1rem; font-weight: 700; color: #0369a1; border-bottom: 2px solid #bae6fd; padding-bottom: 8px; margin: 0 0 12px 0; display:flex; align-items:center; gap:6px;">
                    <span>🤖</span> AI 기반 TC 자동 설계 및 규격 감리
                </h2>
                <div class="form-group" style="margin-bottom:12px;">
                    <label style="font-size: 12px; font-weight: 700; color: #0c4a6e;">신규 기능 / 변경점 요약 명세</label>
                    <textarea id="ai-feature-desc" rows="2" placeholder="예: 포인트 선물하기 기능 추가" style="background:#fff; color:#000; border:1px solid #7dd3fc; resize:none; padding:10px; border-radius:6px; font-size:12px; outline:none; margin-top:6px; box-sizing: border-box; width: 100%;"></textarea>
                </div>
                <div style="display:flex; gap:8px; align-items:center;">
                    <select id="ai-test-type" style="padding:8px; font-size:12px; border:1px solid #7dd3fc; border-radius:6px; background:#fff; color:#000; flex:1; outline:none; font-weight:600;">
                        <option value="해피 패스(정상 흐름) 중심">해피 패스(정상 흐름) 검증</option>
                        <option value="네거티브(예외/오류) 중심">네거티브(예외/오류) 검증</option>
                        <option value="경계값 및 한계 조건 중심">경계값 및 한계 조건 검증</option>
                    </select>
                    <button id="btn-ai-generate" style="background:#0284c7; color:white; border:none; padding:8px 12px; font-size:12px; font-weight:bold; border-radius:6px; cursor:pointer; display:flex; align-items:center; gap:4px;">
                        <span>✨</span> 초안 생성
                    </button>
                    <button id="btn-ai-review" style="background:#059669; color:white; border:none; padding:8px 12px; font-size:12px; font-weight:bold; border-radius:6px; cursor:pointer; display:flex; align-items:center; gap:4px;">
                        <span>🔍</span> 규격 감리
                    </button>
                </div>
            </div>

            <div class="tc-builder-zone" style="display: flex; flex-direction: column; gap: 16px; background: #ffffff; padding: 20px; border-radius: 8px; border: 1px solid #e2e8f0; box-shadow: 0 4px 18px rgba(0,0,0,0.02);">
                <div style="display: flex; justify-content: space-between; align-items: center; border-bottom: 2px solid #edf2f7; padding-bottom: 8px; margin: 0;">
                    <h2 style="font-size: 1.1rem; font-weight: 700; color: #1a202c; margin:0;">📋 테스트케이스 세부 설계 보드</h2>
                </div>
                
                <div style="display: grid; grid-template-columns: 1fr 1fr 1.5fr; gap: 12px;">
                    <div class="form-group" style="margin:0;">
                        <label style="font-size: 12px; font-weight: 700; color: #4a5568;">작성 일자</label>
                        <input type="date" id="tc-date" style="background:#fff; color:#000; border:1px solid #cbd5e0; padding:8px; border-radius:6px; font-size:12px; margin-top:4px; box-sizing:border-box; width:100%;">
                    </div>
                    <div class="form-group" style="margin:0;">
                        <label style="font-size: 12px; font-weight: 700; color: #4a5568;">대분류 / Category 1</label>
                        <input type="text" id="tc-poc" value="T 멤버십" style="background:#fff; color:#000; border:1px solid #cbd5e0; padding:8px; border-radius:6px; font-size:12px; margin-top:4px; box-sizing:border-box; width:100%;">
                    </div>
                    <div class="form-group" style="margin:0;">
                        <label style="font-size: 12px; font-weight: 700; color: #4a5568;">기능 / Category 2</label>
                        <input type="text" id="tc-menu" placeholder="예: 로그인" style="background:#fff; color:#000; border:1px solid #cbd5e0; padding:8px; border-radius:6px; font-size:12px; margin-top:4px; box-sizing:border-box; width:100%;">
                    </div>
                </div>

                <div class="form-group" style="margin:0;">
                    <label style="font-size: 12px; font-weight: 700; color: #4a5568;">테스트 목적 / Category 3</label>
                    <input type="text" id="tc-title" placeholder="검증하고자 하는 유스케이스 목적 기술" style="background:#fff; color:#000; border:1px solid #cbd5e0; padding:8px; border-radius:6px; font-size:12px; margin-top:4px; box-sizing:border-box; width:100%;">
                </div>

                <div class="form-group" style="margin:0;">
                    <label style="font-size: 12px; font-weight: 700; color: #4a5568;">사전 조건 (Pre-Conditions)</label>
                    <textarea id="tc-precond" rows="2" style="background:#fff; color:#000; border:1px solid #cbd5e0; resize:vertical; padding:8px; border-radius:6px; font-size:12px; margin-top:4px; box-sizing:border-box; width:100%;"></textarea>
                </div>

                <div class="form-group" style="margin:0;">
                    <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 4px;">
                        <label style="font-size: 12px; font-weight: 700; color: #4a5568; margin: 0;">테스트 절차 (Step)</label>
                        <div>
                            <button class="btn-cal-nav" id="btn-tc-add-step" style="font-size: 10px; padding: 2px 6px;">STEP +</button>
                            <button class="btn-cal-nav" id="btn-tc-reset-step" style="font-size: 10px; padding: 2px 6px;">초기화</button>
                        </div>
                    </div>
                    <textarea id="tc-steps" rows="3" style="background:#fff; color:#000; border:1px solid #cbd5e0; resize:vertical; padding:8px; border-radius:6px; font-size:12px; line-height:1.5; box-sizing:border-box; width:100%;"></textarea>
                </div>

                <div class="form-group" style="margin:0;">
                    <label style="font-size: 12px; font-weight: 700; color: #4a5568;">기대 결과 (Expected Result)</label>
                    <textarea id="tc-expected" rows="3" style="background:#fff; color:#000; border:1px solid #cbd5e0; resize:vertical; padding:8px; border-radius:6px; font-size:12px; margin-top:4px; line-height:1.5; box-sizing:border-box; width:100%;"></textarea>
                </div>
            </div>
        </div>

        <!-- 💡 [핵심 교정] 우측: 구글 시트 네이티브 호환 HTML 테이블 뷰어 구역 -->
        <div style="flex: 2; display: flex; flex-direction: column; gap: 16px; min-width: 0;">
            <div class="tc-preview-zone" style="display: flex; flex-direction: column; background: #ffffff; padding: 20px; border-radius: 8px; border: 1px solid #e2e8f0; box-shadow: 0 4px 18px rgba(0,0,0,0.02); overflow: hidden;">
                <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 12px;">
                    <h3 style="font-size: 1rem; font-weight: 700; color: #2d3748; margin: 0;">📊 스프레드시트 정형화 뷰어</h3>
                    <button class="btn-action" id="btn-tc-copy-sheet" style="font-size: 11px; padding: 6px 12px; background: #3182ce; color: white; border: none; border-radius: 4px; cursor: pointer; font-weight:700;">시트 양식 복사</button>
                </div>
                
                <!-- 구글 시트 복사 호환성을 위해 CSS 인라인 스타일 하드코딩 적용 및 가로 스크롤 허용 -->
                <div style="overflow-x: auto; border: 1px solid #cbd5e0;">
                    <table id="tc-native-sheet" style="border-collapse: collapse; width: max-content; min-width: 1400px; font-family: 'Malgun Gothic', sans-serif; font-size: 11px; text-align: left;">
                        <thead>
                            <tr>
                                <th rowspan="2" style="border: 1px solid #cbd5e0; background-color: #0b2265; color: white; padding: 8px; text-align: center; width: 40px;">No</th>
                                <th rowspan="2" style="border: 1px solid #cbd5e0; background-color: #0b2265; color: white; padding: 8px; text-align: center; width: 80px;">Component</th>
                                <th colspan="3" style="border: 1px solid #cbd5e0; background-color: #0b2265; color: white; padding: 8px; text-align: center;">Category</th>
                                <th rowspan="2" style="border: 1px solid #cbd5e0; background-color: #0b2265; color: white; padding: 8px; text-align: center; width: 200px;">Pre-Conditions</th>
                                <th rowspan="2" style="border: 1px solid #cbd5e0; background-color: #0b2265; color: white; padding: 8px; text-align: center; width: 250px;">Step</th>
                                <th rowspan="2" style="border: 1px solid #cbd5e0; background-color: #0b2265; color: white; padding: 8px; text-align: center; width: 250px;">Expected Result</th>
                                <th rowspan="2" style="border: 1px solid #cbd5e0; background-color: #0b2265; color: white; padding: 8px; text-align: center; width: 100px;">Test Data</th>
                                <th colspan="5" style="border: 1px solid #cbd5e0; background-color: #4c1d95; color: white; padding: 8px; text-align: center;">Result</th>
                                <th rowspan="2" style="border: 1px solid #cbd5e0; background-color: #0b2265; color: white; padding: 8px; text-align: center; width: 80px;">Issue No.</th>
                                <th rowspan="2" style="border: 1px solid #cbd5e0; background-color: #0b2265; color: white; padding: 8px; text-align: center; width: 120px;">Comments</th>
                            </tr>
                            <tr>
                                <th style="border: 1px solid #cbd5e0; background-color: #0b2265; color: white; padding: 8px; text-align: center; width: 100px;">Category1</th>
                                <th style="border: 1px solid #cbd5e0; background-color: #0b2265; color: white; padding: 8px; text-align: center; width: 100px;">Category2</th>
                                <th style="border: 1px solid #cbd5e0; background-color: #0b2265; color: white; padding: 8px; text-align: center; width: 150px;">Category3</th>
                                <th style="border: 1px solid #cbd5e0; background-color: #4c1d95; color: white; padding: 8px; text-align: center; width: 60px;">And_APP</th>
                                <th style="border: 1px solid #cbd5e0; background-color: #4c1d95; color: white; padding: 8px; text-align: center; width: 60px;">iOS_APP</th>
                                <th style="border: 1px solid #cbd5e0; background-color: #4c1d95; color: white; padding: 8px; text-align: center; width: 60px;">Safari</th>
                                <th style="border: 1px solid #cbd5e0; background-color: #4c1d95; color: white; padding: 8px; text-align: center; width: 60px;">Chrome</th>
                                <th style="border: 1px solid #cbd5e0; background-color: #4c1d95; color: white; padding: 8px; text-align: center; width: 80px;">Samsung<br>Internet</th>
                            </tr>
                        </thead>
                        <tbody id="tc-native-sheet-body" style="background-color: #ffffff; color: #000000;">
                            <!-- JS를 통해 실시간 데이터가 렌더링 될 구역 -->
                        </tbody>
                    </table>
                </div>
            </div>

            <!-- AI 감리 전용 결과 패널 (평소 숨김 처리) -->
            <div id="tc-review-panel" style="display: none; flex-direction: column; background: #fffbeb; padding: 20px; border-radius: 8px; border: 1px solid #fde68a; box-shadow: 0 4px 18px rgba(0,0,0,0.02);">
                <h3 style="font-size: 1rem; font-weight: 700; color: #92400e; margin: 0 0 12px 0;">🔍 AI 규격 감리 리포트</h3>
                <textarea id="tc-review-result" readonly style="width: 100%; min-height: 250px; padding: 12px; background: #ffffff; border: 1px solid #fcd34d; border-radius: 6px; font-family: 'Malgun Gothic', sans-serif; font-size: 12px; line-height: 1.6; color: #2d3748; resize: vertical; outline: none; box-sizing: border-box;"></textarea>
            </div>
        </div>
    </div>
`;

window.QA_CORE.Tc.Manager = {
    init() {
        const panelZone = document.getElementById('tab-panel-tc');
        if (panelZone) {
            panelZone.innerHTML = window.QA_CORE.Tc.TEMPLATE;
        }

        const today = new Date();
        const dateInput = document.getElementById('tc-date');
        if (dateInput) {
            dateInput.value = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, '0')}-${String(today.getDate()).padStart(2, '0')}`;
        }

        this.bindEvents();
        this.compileTcData();
    },

    bindEvents() {
        const trackIds = ['tc-poc', 'tc-menu', 'tc-title', 'tc-precond', 'tc-steps', 'tc-expected'];
        trackIds.forEach(id => {
            const el = document.getElementById(id);
            if (el) el.addEventListener('input', () => this.compileTcData());
        });

        const aiGenerateBtn = document.getElementById('btn-ai-generate');
        if (aiGenerateBtn) aiGenerateBtn.onclick = () => this.triggerAiGenerationPipeline();

        const aiReviewBtn = document.getElementById('btn-ai-review');
        if (aiReviewBtn) aiReviewBtn.onclick = () => this.triggerAiReviewPipeline();

        const addStepBtn = document.getElementById('btn-tc-add-step');
        if (addStepBtn) {
            addStepBtn.onclick = () => {
                const stepsArea = document.getElementById('tc-steps');
                if (!stepsArea) return;
                const lines = stepsArea.value.split('\n').filter(l => l.trim());
                stepsArea.value += (stepsArea.value ? '\n' : '') + `${lines.length + 1}. `;
                stepsArea.dispatchEvent(new Event('input'));
            };
        }

        const resetStepBtn = document.getElementById('btn-tc-reset-step');
        if (resetStepBtn) {
            resetStepBtn.onclick = () => {
                const stepsArea = document.getElementById('tc-steps');
                if (stepsArea) { stepsArea.value = ''; stepsArea.dispatchEvent(new Event('input')); }
            };
        }

        // 💡 [핵심 교정] 텍스트가 아닌 DOM 테이블 객체 자체를 클립보드에 복사하는 엔진
        const copyBtn = document.getElementById('btn-tc-copy-sheet');
        if (copyBtn) {
            copyBtn.onclick = () => {
                const tableEl = document.getElementById('tc-native-sheet');
                if (!tableEl) return;
                
                const range = document.createRange();
                range.selectNode(tableEl);
                window.getSelection().removeAllRanges();
                window.getSelection().addRange(range);
                
                try {
                    document.execCommand('copy');
                    alert("시트 양식이 복사되었습니다. 구글 스프레드시트에 [Ctrl + V]로 붙여넣으세요.");
                } catch (err) {
                    alert("복사에 실패했습니다. 브라우저 권한을 확인해주세요.");
                }
                window.getSelection().removeAllRanges();
            };
        }
    },

    async triggerAiGenerationPipeline() {
        const descEl = document.getElementById('ai-feature-desc');
        const testType = document.getElementById('ai-test-type').value;
        const featureDesc = descEl.value.trim();

        if (featureDesc.length < 5) {
            alert("요구사항을 5자 이상 기입해 주십시오.");
            descEl.focus(); return;
        }

        const btn = document.getElementById('btn-ai-generate');
        const originalHtml = btn.innerHTML;
        btn.innerHTML = `<span>⏳</span> 생성 중...`;
        btn.disabled = true;

        try {
            await new Promise(resolve => setTimeout(resolve, 1500));
            const mockAiResult = {
                poc: "T 멤버십", menu: "신규 기능 파트", title: `[${testType.split(' ')[0]}] 검증`,
                precond: "1. 모바일 앱 로그인 상태", steps: `1. 메뉴 진입\n2. [확인] 클릭`, expected: "- 정상 처리 노출"
            };

            document.getElementById('tc-poc').value = mockAiResult.poc;
            document.getElementById('tc-menu').value = mockAiResult.menu;
            document.getElementById('tc-title').value = mockAiResult.title;
            document.getElementById('tc-precond').value = mockAiResult.precond;
            document.getElementById('tc-steps').value = mockAiResult.steps;
            document.getElementById('tc-expected').value = mockAiResult.expected;

            this.compileTcData();
        } finally {
            btn.innerHTML = originalHtml;
            btn.disabled = false;
        }
    },

    async triggerAiReviewPipeline() {
        const getVal = (id) => { const el = document.getElementById(id); return el ? el.value.trim() : ''; };
        const currentTcContext = `[Pre-Condition] ${getVal('tc-precond')} [Test Steps] ${getVal('tc-steps')} [Expected Result] ${getVal('tc-expected')}`;

        if (currentTcContext.replace(/\s/g, '').length < 20) {
            alert("감리할 내용이 부족합니다."); return;
        }

        const btn = document.getElementById('btn-ai-review');
        const originalHtml = btn.innerHTML;
        btn.innerHTML = `<span>⏳</span> 감리 중...`;
        btn.disabled = true;

        try {
            await new Promise(resolve => setTimeout(resolve, 2000));
            const mockReviewReport = `### 종합 결론\n**총 에러 수: 1건**\n\n### 세부 분석\n**1. Expected Result (기대결과)**\n* **지적 사항:** 서술형 어미 사용 위반.\n* **교정 반영:**\n  > Before: - 완료 창이 뜬다.\n  > After: - 완료 창 노출`;
            
            // 리뷰 패널 표출 및 데이터 삽입
            const reviewPanel = document.getElementById('tc-review-panel');
            const reviewText = document.getElementById('tc-review-result');
            if (reviewPanel && reviewText) {
                reviewPanel.style.display = 'flex';
                reviewText.value = mockReviewReport;
            }
        } finally {
            btn.innerHTML = originalHtml;
            btn.disabled = false;
        }
    },

    compileTcData() {
        const getVal = (id) => { 
            const el = document.getElementById(id); 
            // 엑셀 붙여넣기 시 줄바꿈 호환을 위해 \n을 <br>로 치환
            return el ? el.value.trim().replace(/\n/g, '<br>') : ''; 
        };

        const poc = getVal('tc-poc') || '';
        const menu = getVal('tc-menu') || '';
        const title = getVal('tc-title') || '';
        const precond = getVal('tc-precond') || '';
        const steps = getVal('tc-steps') || '';
        const expected = getVal('tc-expected') || '';

        const tbody = document.getElementById('tc-native-sheet-body');
        if (!tbody) return;

        // HTML 태그로 엑셀의 Row(tr) 및 Cell(td) 레이아웃 물리적 렌더링
        tbody.innerHTML = `
            <tr>
                <td style="border: 1px solid #cbd5e0; padding: 8px; text-align: center; vertical-align: top;">1</td>
                <td style="border: 1px solid #cbd5e0; padding: 8px; vertical-align: top;"></td>
                <td style="border: 1px solid #cbd5e0; padding: 8px; vertical-align: top;">${poc}</td>
                <td style="border: 1px solid #cbd5e0; padding: 8px; vertical-align: top;">${menu}</td>
                <td style="border: 1px solid #cbd5e0; padding: 8px; vertical-align: top;">${title}</td>
                <td style="border: 1px solid #cbd5e0; padding: 8px; vertical-align: top; white-space: nowrap;">${precond}</td>
                <td style="border: 1px solid #cbd5e0; padding: 8px; vertical-align: top; white-space: nowrap;">${steps}</td>
                <td style="border: 1px solid #cbd5e0; padding: 8px; vertical-align: top; white-space: nowrap;">${expected}</td>
                <td style="border: 1px solid #cbd5e0; padding: 8px; vertical-align: top;"></td>
                <td style="border: 1px solid #cbd5e0; padding: 8px; text-align: center; vertical-align: top; color: #15803d; font-weight: bold; background-color: #f0fdf4;">PASS</td>
                <td style="border: 1px solid #cbd5e0; padding: 8px; text-align: center; vertical-align: top; color: #15803d; font-weight: bold; background-color: #f0fdf4;">PASS</td>
                <td style="border: 1px solid #cbd5e0; padding: 8px; text-align: center; vertical-align: top; color: #15803d; font-weight: bold; background-color: #f0fdf4;">PASS</td>
                <td style="border: 1px solid #cbd5e0; padding: 8px; text-align: center; vertical-align: top; color: #15803d; font-weight: bold; background-color: #f0fdf4;">PASS</td>
                <td style="border: 1px solid #cbd5e0; padding: 8px; text-align: center; vertical-align: top; color: #15803d; font-weight: bold; background-color: #f0fdf4;">PASS</td>
                <td style="border: 1px solid #cbd5e0; padding: 8px; vertical-align: top;"></td>
                <td style="border: 1px solid #cbd5e0; padding: 8px; vertical-align: top;"></td>
            </tr>
        `;
    }
};

export function initTcPanel() {
    window.QA_CORE.Tc.Manager.init();
}

if (window.QA_CORE.SkillManager && typeof window.QA_CORE.SkillManager.register === 'function') {
    window.QA_CORE.SkillManager.register('TcModuleCore', window.QA_CORE.Tc.Manager);
}
