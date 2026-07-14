window.QA_CORE = window.QA_CORE || {};
window.QA_CORE.Tc = window.QA_CORE.Tc || {};

window.QA_CORE.Tc.TEMPLATE = `
    <div class="content-panel active" style="display: flex; gap: 20px; width: 100%; flex-direction: row; box-sizing: border-box; padding: 4px;">
        
        <div style="flex: 1.5; display: flex; flex-direction: column; gap: 16px;">
            <div class="card-panel" style="background: linear-gradient(145deg, #f0f9ff, #e0f2fe); padding: 20px; border-radius: 8px; border: 1px solid #bae6fd; box-shadow: 0 4px 12px rgba(0,0,0,0.03);">
                <h2 style="font-size: 1.1rem; font-weight: 700; color: #0369a1; border-bottom: 2px solid #bae6fd; padding-bottom: 8px; margin: 0 0 12px 0; display:flex; align-items:center; gap:6px;">
                    <span>🤖</span> AI 기반 TC 자동 설계 엔진
                </h2>
                <div class="form-group" style="margin-bottom:12px;">
                    <label style="font-size: 12px; font-weight: 700; color: #0c4a6e;">신규 기능 / 변경점 요약 명세</label>
                    <textarea id="ai-feature-desc" rows="2" placeholder="예: 포인트 선물하기 기능 추가. 1회 최대 5만 포인트 제한 조건" style="background:#fff; color:#000; border:1px solid #7dd3fc; resize:none; padding:10px; border-radius:6px; font-size:12px; outline:none; margin-top:6px;"></textarea>
                </div>
                <div style="display:flex; gap:12px; align-items:center;">
                    <select id="ai-test-type" style="padding:8px; font-size:12px; border:1px solid #7dd3fc; border-radius:6px; background:#fff; color:#000; flex:1; outline:none; font-weight:600;">
                        <option value="해피 패스(정상 흐름) 중심">해피 패스(정상 흐름) 중심 검증</option>
                        <option value="네거티브(예외/오류) 중심">네거티브(예외/오류 메시지) 중심 검증</option>
                        <option value="경계값 및 한계 조건 중심">경계값 및 한계 조건 중심 검증</option>
                    </select>
                    <button id="btn-ai-generate" style="background:#0284c7; color:white; border:none; padding:8px 16px; font-size:12px; font-weight:bold; border-radius:6px; cursor:pointer; display:flex; align-items:center; gap:6px; box-shadow:0 2px 4px rgba(2,132,199,0.2); transition:background 0.2s;">
                        <span>✨</span> AI 초안 생성
                    </button>
                </div>
            </div>

            <div class="tc-builder-zone" style="display: flex; flex-direction: column; gap: 16px; background: #ffffff; padding: 20px; border-radius: 8px; border: 1px solid #e2e8f0; box-shadow: 0 4px 18px rgba(0,0,0,0.02);">
                <div style="display: flex; justify-content: space-between; align-items: center; border-bottom: 2px solid #edf2f7; padding-bottom: 8px; margin: 0;">
                    <h2 style="font-size: 1.1rem; font-weight: 700; color: #1a202c; margin:0;">📋 테스트케이스(TC) 세부 설계 보드</h2>
                    <span style="font-size: 11px; color: #718096;">💡 AI가 생성한 초안을 자유롭게 수정하십시오.</span>
                </div>
                
                <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 12px;">
                    <div class="form-group" style="margin:0;">
                        <label style="font-size: 12px; font-weight: 700; color: #4a5568;">대분류 / POC</label>
                        <input type="text" id="tc-poc" value="T 멤버십" style="background:#fff; color:#000; border:1px solid #cbd5e0; padding:8px; border-radius:6px; font-size:12px; margin-top:4px;">
                    </div>
                    <div class="form-group" style="margin:0;">
                        <label style="font-size: 12px; font-weight: 700; color: #4a5568;">테스트 기능 / 메뉴명</label>
                        <input type="text" id="tc-menu" placeholder="예: 로그인, 마이페이지" style="background:#fff; color:#000; border:1px solid #cbd5e0; padding:8px; border-radius:6px; font-size:12px; margin-top:4px;">
                    </div>
                </div>

                <div class="form-group" style="margin:0;">
                    <label style="font-size: 12px; font-weight: 700; color: #4a5568;">테스트 목적 / 타이틀</label>
                    <input type="text" id="tc-title" placeholder="검증하고자 하는 유스케이스 목적 기술" style="background:#fff; color:#000; border:1px solid #cbd5e0; padding:8px; border-radius:6px; font-size:12px; margin-top:4px;">
                </div>

                <div class="form-group" style="margin:0;">
                    <label style="font-size: 12px; font-weight: 700; color: #4a5568;">사전 조건 (Pre-Condition)</label>
                    <textarea id="tc-precond" rows="2" placeholder="테스트 수행 전 선행 필수 상태 명세" style="background:#fff; color:#000; border:1px solid #cbd5e0; resize:none; padding:8px; border-radius:6px; font-size:12px; margin-top:4px;"></textarea>
                </div>

                <div class="form-group" style="margin:0;">
                    <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 4px;">
                        <label style="font-size: 12px; font-weight: 700; color: #4a5568; margin: 0;">테스트 절차 (Test Steps)</label>
                        <div>
                            <button class="btn-cal-nav" id="btn-tc-add-step" style="font-size: 10px; padding: 2px 6px; background: #e1f5fe; color: #0288d1; border-color: #b3e5fc;">STEP +</button>
                            <button class="btn-cal-nav" id="btn-tc-reset-step" style="font-size: 10px; padding: 2px 6px;">초기화</button>
                        </div>
                    </div>
                    <textarea id="tc-steps" rows="4" placeholder="수행 절차를 단계별로 기입하세요" style="background:#fff; color:#000; border:1px solid #cbd5e0; resize:none; padding:8px; border-radius:6px; font-size:12px; line-height:1.5;"></textarea>
                </div>

                <div class="form-group" style="margin:0;">
                    <label style="font-size: 12px; font-weight: 700; color: #4a5568;">기대 결과 (Expected Result)</label>
                    <textarea id="tc-expected" rows="3" placeholder="정상 동작 범주의 기대 명세" style="background:#fff; color:#000; border:1px solid #cbd5e0; resize:none; padding:8px; border-radius:6px; font-size:12px; margin-top:4px; line-height:1.5;"></textarea>
                </div>
            </div>
        </div>

        <div class="tc-preview-zone" style="flex: 1; display: flex; flex-direction: column; background: #f8fafc; padding: 20px; border-radius: 8px; border: 1px solid #e2e8f0; box-shadow: 0 4px 18px rgba(0,0,0,0.02); min-width: 320px;">
            <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 12px;">
                <h3 style="font-size: 1rem; font-weight: 700; color: #2d3748; margin: 0;">📄 정형화 산출물 뷰어</h3>
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
        if (aiGenerateBtn) {
            aiGenerateBtn.onclick = () => this.triggerAiGenerationPipeline();
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
                alert("TC 복사가 완료되었습니다.");
            };
        }
    },

    async triggerAiGenerationPipeline() {
        const descEl = document.getElementById('ai-feature-desc');
        const typeEl = document.getElementById('ai-test-type');
        const featureDesc = descEl.value.trim();
        const testType = typeEl.value;

        if (featureDesc.length < 5) {
            alert("요구사항 컨텍스트가 부족합니다. 신규 기능 요약을 5자 이상 구체적으로 기입해 주십시오.");
            descEl.focus();
            return;
        }

        const btn = document.getElementById('btn-ai-generate');
        const originalHtml = btn.innerHTML;
        btn.innerHTML = `<span>⏳</span> 생성 중...`;
        btn.disabled = true;
        btn.style.background = '#7dd3fc';
        btn.style.cursor = 'not-allowed';

        try {
            await new Promise(resolve => setTimeout(resolve, 1500));

            const mockAiResult = {
                poc: "T 멤버십",
                menu: "신규 기능 파트",
                title: `[${testType.split(' ')[0]}] ${featureDesc.substring(0, 15)}... 기능 검증`,
                precond: "1. 테스트 대상 계정으로 로그인 됨\n2. 검증을 위한 기초 데이터 세팅 완료",
                steps: `1. 홈 화면에서 해당 메뉴 진입\n2. '${featureDesc.substring(0, 5)}' 관련 데이터 입력\n3. 확인(전송) 버튼 터치`,
                expected: "1. 정상 처리 안내 토스트 팝업이 노출됨\n2. 페이지가 갱신되며 상태 값이 변경됨을 확인"
            };

            document.getElementById('tc-poc').value = mockAiResult.poc;
            document.getElementById('tc-menu').value = mockAiResult.menu;
            document.getElementById('tc-title').value = mockAiResult.title;
            document.getElementById('tc-precond').value = mockAiResult.precond;
            document.getElementById('tc-steps').value = mockAiResult.steps;
            document.getElementById('tc-expected').value = mockAiResult.expected;

            this.compileTcData();

        } catch (error) {
            console.error("AI Generation Error:", error);
            alert("AI 엔진 연동 결함이 발생했습니다.");
        } finally {
            btn.innerHTML = originalHtml;
            btn.disabled = false;
            btn.style.background = '#0284c7';
            btn.style.cursor = 'pointer';
        }
    },

    compileTcData() {
        const getVal = (id) => { const el = document.getElementById(id); return el ? el.value.trim() : ''; };

        const poc = getVal('tc-poc') || '-';
        const menu = getVal('tc-menu') || '-';
        const title = getVal('tc-title') || '테스트 목적을 입력하세요';
        const precond = getVal('tc-precond') || '없음';
        const steps = getVal('tc-steps') || '1. ';
        const expected = getVal('tc-expected') || '-';

        const structuredText = `[TEST CASE SPECIFICATION]
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
