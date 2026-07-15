window.QA_CORE = window.QA_CORE || {};
window.QA_CORE.Tc = window.QA_CORE.Tc || {};

// 🤖 AI 생성 및 감리 듀얼 엔진 + 날짜 자동 바인딩 필드가 결합된 TC 빌더
window.QA_CORE.Tc.TEMPLATE = `
    <div class="content-panel active" style="display: flex; gap: 20px; width: 100%; flex-direction: row; box-sizing: border-box; padding: 4px;">
        
        <!-- 좌측: AI 엔진 및 입력 제어 보드 구역 -->
        <div style="flex: 1.5; display: flex; flex-direction: column; gap: 16px;">
            
            <div class="card-panel" style="background: linear-gradient(145deg, #f0f9ff, #e0f2fe); padding: 20px; border-radius: 8px; border: 1px solid #bae6fd; box-shadow: 0 4px 12px rgba(0,0,0,0.03);">
                <h2 style="font-size: 1.1rem; font-weight: 700; color: #0369a1; border-bottom: 2px solid #bae6fd; padding-bottom: 8px; margin: 0 0 12px 0; display:flex; align-items:center; gap:6px;">
                    <span>🤖</span> AI 기반 TC 자동 설계 및 규격 감리 엔진
                </h2>
                <div class="form-group" style="margin-bottom:12px;">
                    <label style="font-size: 12px; font-weight: 700; color: #0c4a6e;">신규 기능 / 변경점 요약 명세</label>
                    <textarea id="ai-feature-desc" rows="2" placeholder="예: 포인트 선물하기 기능 추가. 1회 최대 5만 포인트 제한 조건" style="background:#fff; color:#000; border:1px solid #7dd3fc; resize:none; padding:10px; border-radius:6px; font-size:12px; outline:none; margin-top:6px; box-sizing: border-box; width: 100%;"></textarea>
                </div>
                <div style="display:flex; gap:8px; align-items:center;">
                    <select id="ai-test-type" style="padding:8px; font-size:12px; border:1px solid #7dd3fc; border-radius:6px; background:#fff; color:#000; flex:1; outline:none; font-weight:600;">
                        <option value="해피 패스(정상 흐름) 중심">해피 패스(정상 흐름) 중심 검증</option>
                        <option value="네거티브(예외/오류) 중심">네거티브(예외/오류 메시지) 중심 검증</option>
                        <option value="경계값 및 한계 조건 중심">경계값 및 한계 조건 중심 검증</option>
                    </select>
                    <!-- 생성 버튼 -->
                    <button id="btn-ai-generate" style="background:#0284c7; color:white; border:none; padding:8px 12px; font-size:12px; font-weight:bold; border-radius:6px; cursor:pointer; display:flex; align-items:center; gap:4px; box-shadow:0 2px 4px rgba(2,132,199,0.2); transition:background 0.2s;">
                        <span>✨</span> 초안 생성
                    </button>
                    <!-- 💡 [신규] 감리 버튼 추가 -->
                    <button id="btn-ai-review" style="background:#059669; color:white; border:none; padding:8px 12px; font-size:12px; font-weight:bold; border-radius:6px; cursor:pointer; display:flex; align-items:center; gap:4px; box-shadow:0 2px 4px rgba(5,150,105,0.2); transition:background 0.2s;">
                        <span>🔍</span> 규격 감리
                    </button>
                </div>
            </div>

            <div class="tc-builder-zone" style="display: flex; flex-direction: column; gap: 16px; background: #ffffff; padding: 20px; border-radius: 8px; border: 1px solid #e2e8f0; box-shadow: 0 4px 18px rgba(0,0,0,0.02);">
                <div style="display: flex; justify-content: space-between; align-items: center; border-bottom: 2px solid #edf2f7; padding-bottom: 8px; margin: 0;">
                    <h2 style="font-size: 1.1rem; font-weight: 700; color: #1a202c; margin:0;">📋 테스트케이스(TC) 세부 설계 보드</h2>
                    <span style="font-size: 11px; color: #718096;">💡 AI가 생성한 초안을 자유롭게 수정하십시오.</span>
                </div>
                
                <div style="display: grid; grid-template-columns: 1fr 1fr 1.5fr; gap: 12px;">
                    <div class="form-group" style="margin:0;">
                        <label style="font-size: 12px; font-weight: 700; color: #4a5568;">작성 일자</label>
                        <input type="date" id="tc-date" style="background:#fff; color:#000; border:1px solid #cbd5e0; padding:8px; border-radius:6px; font-size:12px; margin-top:4px; box-sizing:border-box; width:100%;">
                    </div>
                    <div class="form-group" style="margin:0;">
                        <label style="font-size: 12px; font-weight: 700; color: #4a5568;">대분류 / POC</label>
                        <input type="text" id="tc-poc" value="T 멤버십" style="background:#fff; color:#000; border:1px solid #cbd5e0; padding:8px; border-radius:6px; font-size:12px; margin-top:4px; box-sizing:border-box; width:100%;">
                    </div>
                    <div class="form-group" style="margin:0;">
                        <label style="font-size: 12px; font-weight: 700; color: #4a5568;">테스트 기능 / 메뉴명</label>
                        <input type="text" id="tc-menu" placeholder="예: 로그인" style="background:#fff; color:#000; border:1px solid #cbd5e0; padding:8px; border-radius:6px; font-size:12px; margin-top:4px; box-sizing:border-box; width:100%;">
                    </div>
                </div>

                <div class="form-group" style="margin:0;">
                    <label style="font-size: 12px; font-weight: 700; color: #4a5568;">테스트 목적 / 타이틀</label>
                    <input type="text" id="tc-title" placeholder="검증하고자 하는 유스케이스 목적 기술" style="background:#fff; color:#000; border:1px solid #cbd5e0; padding:8px; border-radius:6px; font-size:12px; margin-top:4px; box-sizing:border-box; width:100%;">
                </div>

                <div class="form-group" style="margin:0;">
                    <label style="font-size: 12px; font-weight: 700; color: #4a5568;">사전 조건 (Pre-Condition)</label>
                    <textarea id="tc-precond" rows="2" placeholder="테스트 수행 전 선행 필수 상태 명세" style="background:#fff; color:#000; border:1px solid #cbd5e0; resize:none; padding:8px; border-radius:6px; font-size:12px; margin-top:4px; box-sizing:border-box; width:100%;"></textarea>
                </div>

                <div class="form-group" style="margin:0;">
                    <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 4px;">
                        <label style="font-size: 12px; font-weight: 700; color: #4a5568; margin: 0;">테스트 절차 (Test Steps)</label>
                        <div>
                            <button class="btn-cal-nav" id="btn-tc-add-step" style="font-size: 10px; padding: 2px 6px; background: #e1f5fe; color: #0288d1; border-color: #b3e5fc;">STEP +</button>
                            <button class="btn-cal-nav" id="btn-tc-reset-step" style="font-size: 10px; padding: 2px 6px;">초기화</button>
                        </div>
                    </div>
                    <textarea id="tc-steps" rows="4" placeholder="수행 절차를 단계별로 기입하세요" style="background:#fff; color:#000; border:1px solid #cbd5e0; resize:none; padding:8px; border-radius:6px; font-size:12px; line-height:1.5; box-sizing:border-box; width:100%;"></textarea>
                </div>

                <div class="form-group" style="margin:0;">
                    <label style="font-size: 12px; font-weight: 700; color: #4a5568;">기대 결과 (Expected Result)</label>
                    <textarea id="tc-expected" rows="3" placeholder="정상 동작 범주의 기대 명세" style="background:#fff; color:#000; border:1px solid #cbd5e0; resize:none; padding:8px; border-radius:6px; font-size:12px; margin-top:4px; line-height:1.5; box-sizing:border-box; width:100%;"></textarea>
                </div>
            </div>
        </div>

        <!-- 우측: 실시간 정형화 결과 프리뷰 구역 -->
        <div class="tc-preview-zone" style="flex: 1; display: flex; flex-direction: column; background: #f8fafc; padding: 20px; border-radius: 8px; border: 1px solid #e2e8f0; box-shadow: 0 4px 18px rgba(0,0,0,0.02); min-width: 320px;">
            <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 12px;">
                <h3 style="font-size: 1rem; font-weight: 700; color: #2d3748; margin: 0;">📄 산출물 뷰어 / 🔍 감리 리포트</h3>
                <button class="btn-action" id="btn-tc-copy-all" style="font-size: 11px; padding: 6px 12px; background: #3182ce; color: white; border: none; border-radius: 4px; cursor: pointer; font-weight:700;">전체 복사</button>
            </div>
            <textarea id="tc-display-result" readonly style="width: 100%; flex: 1; min-height: 500px; padding: 16px; background: #ffffff; border: 1px solid #cbd5e0; border-radius: 6px; font-family: 'Courier New', monospace; font-size: 12px; line-height: 1.6; color: #2d3748; resize: none; outline: none; box-sizing: border-box;"></textarea>
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
        const yyyy = today.getFullYear();
        const mm = String(today.getMonth() + 1).padStart(2, '0');
        const dd = String(today.getDate()).padStart(2, '0');
        const dateInput = document.getElementById('tc-date');
        if (dateInput) {
            dateInput.value = `${yyyy}-${mm}-${dd}`;
        }

        this.bindEvents();
        this.compileTcData();
    },

    bindEvents() {
        const trackIds = ['tc-date', 'tc-poc', 'tc-menu', 'tc-title', 'tc-precond', 'tc-steps', 'tc-expected'];
        trackIds.forEach(id => {
            const el = document.getElementById(id);
            if (el) el.addEventListener('input', () => this.compileTcData());
        });

        // 1. 초안 생성 버튼 바인딩
        const aiGenerateBtn = document.getElementById('btn-ai-generate');
        if (aiGenerateBtn) {
            aiGenerateBtn.onclick = () => this.triggerAiGenerationPipeline();
        }

        // 2. 규격 감리 버튼 바인딩
        const aiReviewBtn = document.getElementById('btn-ai-review');
        if (aiReviewBtn) {
            aiReviewBtn.onclick = () => this.triggerAiReviewPipeline();
        }

        const addStepBtn = document.getElementById('btn-tc-add-step');
        if (addStepBtn) {
            addStepBtn.onclick = () => {
                const stepsArea = document.getElementById('tc-steps');
                if (!stepsArea) return;
                const lines = stepsArea.value.split('\n').filter(l => l.trim());
                const nextNum = lines.length + 1;
                stepsArea.value += (stepsArea.value ? '\n' : '') + `${nextNum}. `;
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

        const copyBtn = document.getElementById('btn-tc-copy-all');
        if (copyBtn) {
            copyBtn.onclick = () => {
                const resultArea = document.getElementById('tc-display-result');
                if (!resultArea || !resultArea.value.trim()) return;
                resultArea.select();
                document.execCommand('copy');
                alert("산출물이 복사되었습니다.");
            };
        }
    },

    /**
     * 🧠 [생성 엔진] 사용자가 제공한 작성 규칙을 하드코딩하여 무결점 초안을 생성
     */
    async triggerAiGenerationPipeline() {
        const descEl = document.getElementById('ai-feature-desc');
        const testType = document.getElementById('ai-test-type').value;
        const featureDesc = descEl.value.trim();

        if (featureDesc.length < 5) {
            alert("요구사항 컨텍스트가 부족합니다. 신규 기능 요약을 5자 이상 기입해 주십시오.");
            descEl.focus(); return;
        }

        const btn = document.getElementById('btn-ai-generate');
        const originalHtml = btn.innerHTML;
        btn.innerHTML = `<span>⏳</span> 생성 중...`;
        btn.disabled = true;

        try {
            // [API 연동 가이드] 여기에 외부 LLM 통신 코드를 배치합니다.
            // 페이로드에 "1. 버튼: '[버튼명] 클릭'", "2. 디바이스: 모바일(탭)/PC(클릭)" 등 규칙을 포함시킵니다.
            await new Promise(resolve => setTimeout(resolve, 1500));

            const mockAiResult = {
                poc: "T 멤버십",
                menu: "신규 기능 메뉴",
                title: `[${testType.split(' ')[0]}] ${featureDesc.substring(0, 15)}... 검증`,
                precond: "1. 모바일 기기에 로그인된 상태",
                steps: `1. 해당 메뉴 진입\n2. [전송] 클릭`,
                expected: "- 정상 처리 안내 팝업 노출\n- 상태 값 변경"
            };

            document.getElementById('tc-poc').value = mockAiResult.poc;
            document.getElementById('tc-menu').value = mockAiResult.menu;
            document.getElementById('tc-title').value = mockAiResult.title;
            document.getElementById('tc-precond').value = mockAiResult.precond;
            document.getElementById('tc-steps').value = mockAiResult.steps;
            document.getElementById('tc-expected').value = mockAiResult.expected;

            this.compileTcData();

        } catch (error) {
            alert("AI 엔진 연동 결함이 발생했습니다.");
        } finally {
            btn.innerHTML = originalHtml;
            btn.disabled = false;
        }
    },

    /**
     * 🔍 [감리 엔진] 사용자가 입력한 TC를 'TC 작성 규칙' 기반으로 엄격하게 심사
     */
    async triggerAiReviewPipeline() {
        const getVal = (id) => { const el = document.getElementById(id); return el ? el.value.trim() : ''; };
        
        // 현재 작성된 TC 내용 취합
        const currentTcContext = `
        [Pre-Condition] ${getVal('tc-precond')}
        [Test Steps] ${getVal('tc-steps')}
        [Expected Result] ${getVal('tc-expected')}
        `;

        if (currentTcContext.replace(/\s/g, '').length < 20) {
            alert("감리할 테스트케이스 내용이 부족합니다. 먼저 좌측 보드에 TC를 작성해주십시오.");
            return;
        }

        const btn = document.getElementById('btn-ai-review');
        const originalHtml = btn.innerHTML;
        btn.innerHTML = `<span>⏳</span> 감리 중...`;
        btn.disabled = true;

        try {
            /* 
               💡 [프롬프트 엔지니어링 주입]
               여기에 사용자가 제공한 'TC 작성 규칙' 전체 프롬프트 스트링을 페이로드로 전송합니다.
               system_prompt: "너는 선임 QA 엔지니어이자 시니어급 전략적 소프트웨어 테스팅 분석가이다..."
               user_prompt: currentTcContext
            */
            await new Promise(resolve => setTimeout(resolve, 2000));

            // [MOCK] AI 감리 리포트 결과 (사용자 요구 출력 가이드라인 적용)
            const mockReviewReport = `### 종합 결론
**총 에러 수: 2건**
테스트 스텝의 다중 액션 혼재와 기대결과의 명사형 마감 규칙 위반이 감지되었습니다.

### 세부 분석 및 교정

**1. Test Step (테스트 단계)**
*   **지적 사항:** 하나의 Step에 두 개 이상의 액션이 포함되어 있으며, 불필요한 조사 사용.
*   **잠재 리스크 (Red Teaming):** 스크립트 자동화 엔지니어가 Step 단위를 쪼갤 때 XPath 매핑 에러가 격발될 확률이 높으며, 주니어 테스터가 중간 액션을 누락할 수 있습니다.
*   **교정 반영:**
    > Before: 1. 장바구니 메뉴로 이동해서 결제 버튼을 누른다.
    > After: 1. 장바구니 메뉴 
    > 2. [결제] 탭

**2. Expected Result (기대결과)**
*   **지적 사항:** '~된다', '~확인'과 같은 서술형 어미 사용 위반.
*   **잠재 리스크 (Red Teaming):** 기대결과가 명확한 상태(Status)를 지시하지 않아, 테스터의 주관적 해석이 개입되어 결함 유출(False Positive) 위험이 발생합니다.
*   **교정 반영:**
    > Before: - 결제 완료 창이 뜨는 것을 확인한다.
    > After: - 결제 완료 창 노출`;

            // 💡 감리 결과는 원본 폼을 건드리지 않고, 우측 뷰어 텍스트 에어리어에 덮어쓰기하여 출력
            const displayArea = document.getElementById('tc-display-result');
            if (displayArea) {
                displayArea.value = mockReviewReport;
            }

        } catch (error) {
            alert("AI 규격 감리 서버 통신 중 에러가 발생했습니다.");
        } finally {
            btn.innerHTML = originalHtml;
            btn.disabled = false;
        }
    },

    compileTcData() {
        const getVal = (id) => { const el = document.getElementById(id); return el ? el.value.trim() : ''; };

        const date = getVal('tc-date') || '-';
        const poc = getVal('tc-poc') || '-';
        const menu = getVal('tc-menu') || '-';
        const title = getVal('tc-title') || '테스트 목적을 입력하세요';
        const precond = getVal('tc-precond') || '없음';
        const steps = getVal('tc-steps') || '1. ';
        const expected = getVal('tc-expected') || '-';

        const structuredText = `[TEST CASE SPECIFICATION]
■ 작성 일자 : ${date}
■ 대분류/POC : ${poc}
■ 테스트 메뉴 : ${menu}
■ 테스트 목적 : ${title}

[Pre-Condition]
${precond}

[Test Steps]
${steps}

[Expected Result]
${expected}`;

        const displayArea = document.getElementById('tc-display-result');
        if (displayArea) displayArea.value = structuredText;
    }
};

export function initTcPanel() {
    window.QA_CORE.Tc.Manager.init();
}

if (window.QA_CORE.SkillManager && typeof window.QA_CORE.SkillManager.register === 'function') {
    window.QA_CORE.SkillManager.register('TcModuleCore', window.QA_CORE.Tc.Manager);
}
