window.QA_CORE = window.QA_CORE || {};
window.QA_CORE.Issue = window.QA_CORE.Issue || {};

// JIRA 등록 규칙을 완벽히 수렴한 매끄러운 반응형 레이아웃 마크업 뼈대 명세
window.QA_CORE.Issue.TEMPLATE = `
    <div class="issue-main-container" style="display: flex; gap: 24px; width: 100%; box-sizing: border-box; padding: 4px;">
        
        <!-- 좌측: JIRA 입력 폼 제어 구역 (필수 및 선택 분리) -->
        <div class="issue-form-zone" style="flex: 1.4; background: #ffffff; border: 1px solid #e2e8f0; border-radius: 12px; padding: 24px; box-shadow: 0 4px 18px rgba(0,0,0,0.02); display: flex; flex-direction: column; gap: 20px;">
            <div style="display: flex; justify-content: space-between; align-items: center; border-bottom: 2px solid #edf2f7; padding-bottom: 12px;">
                <h2 style="font-size: 1.2rem; font-weight: 700; color: #1a202c; margin: 0;">📝 JIRA 이슈 내용 입력</h2>
                <div style="font-size: 12px; color: #e53e3e; font-weight: 600;">* 빨간색 표시 필드는 필수 기입 항목입니다.</div>
            </div>

            <!-- SECTION 1: 필수 입력 항목 -->
            <div style="display: flex; flex-direction: column; gap: 14px;">
                <h3 style="font-size: 14px; font-weight: 700; color: #2d3748; margin: 0;">🔴 필수 입력 사항</h3>
                
                <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 12px;">
                    <div>
                        <label style="display:block; font-size:12px; font-weight:700; margin-bottom:6px; color:#e53e3e;">Project *</label>
                        <select id="jira-project" style="width:100%; padding:8px; border:1px solid #cbd5e0; border-radius:6px; background:#fff; color:#000; font-size:13px; font-weight:600;">
                            <option value="">프로젝트 선택</option>
                            <option value="T 멤버십">T 멤버십</option>
                            <option value="OY_Core">OY_Core</option>
                            <option value="PE_QA">PE_QA</option>
                        </select>
                    </div>
                    <div>
                        <label style="display:block; font-size:12px; font-weight:700; margin-bottom:6px; color:#e53e3e;">Issue Type *</label>
                        <select id="jira-issuetype" style="width:100%; padding:8px; border:1px solid #cbd5e0; border-radius:6px; background:#fff; color:#000; font-size:13px;">
                            <option value="Defect">Defect - 테스트 이슈</option>
                            <option value="운영Bug">운영Bug - 실서버 이슈</option>
                        </select>
                    </div>
                </div>

                <div>
                    <label style="display:block; font-size:12px; font-weight:700; margin-bottom:6px; color:#e53e3e;">Summary (이슈 요약) *</label>
                    <input type="text" id="jira-summary" placeholder="현상 및 핵심 요약을 입력하세요" style="width:100%; padding:8px 12px; border:1px solid #cbd5e0; border-radius:6px; background:#fff; color:#000; font-size:13px; box-sizing:border-box;">
                </div>

                <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 12px;">
                    <div>
                        <label style="display:block; font-size:12px; font-weight:700; margin-bottom:6px; color:#e53e3e;">Component/s *</label>
                        <input type="text" id="jira-component" placeholder="이슈 발생 영역 / 메뉴 기입" style="width:100%; padding:8px; border:1px solid #cbd5e0; border-radius:6px; background:#fff; color:#000; font-size:13px; box-sizing:border-box;">
                    </div>
                    <div>
                        <label style="display:block; font-size:12px; font-weight:700; margin-bottom:6px; color:#e53e3e;">Assignee (담당자) *</label>
                        <select id="jira-assignee" style="width:100%; padding:8px; border:1px solid #cbd5e0; border-radius:6px; background:#fff; color:#000; font-size:13px;">
                            <option value="개발자 담당">개발자 담당</option>
                            <option value="기획자 담당">기획자 담당</option>
                        </select>
                    </div>
                </div>

                <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 12px;">
                    <div>
                        <label style="display:block; font-size:12px; font-weight:700; margin-bottom:6px; color:#e53e3e;">Labels * <span style="font-size:10px; color:#718096; font-weight:normal;">(띄어쓰기 불가)</span></label>
                        <input type="text" id="jira-labels" placeholder="Squad 레이블 기입" style="width:100%; padding:8px; border:1px solid #cbd5e0; border-radius:6px; background:#fff; color:#000; font-size:13px; box-sizing:border-box;">
                    </div>
                    <div>
                        <label style="display:block; font-size:12px; font-weight:700; margin-bottom:6px; color:#e53e3e;">Priority (중요도) *</label>
                        <select id="jira-priority" style="width:100%; padding:8px; border:1px solid #cbd5e0; border-radius:6px; background:#fff; color:#000; font-size:13px; font-weight:600;">
                            <option value="Major">Major</option>
                            <option value="Critical">Critical</option>
                            <option value="Blocker">Blocker</option>
                            <option value="Minor">Minor</option>
                        </select>
                    </div>
                </div>

                <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 12px;">
                    <div>
                        <label style="display:block; font-size:12px; font-weight:700; margin-bottom:6px; color:#e53e3e;">Epic Link *</label>
                        <input type="text" id="jira-epiclink" placeholder="Squad의 Epic 또는 Story 설정" style="width:100%; padding:8px; border:1px solid #cbd5e0; border-radius:6px; background:#fff; color:#000; font-size:13px; box-sizing:border-box;">
                    </div>
                    <div>
                        <label style="display:block; font-size:12px; font-weight:700; margin-bottom:6px; color:#e53e3e;">Linked Issues *</label>
                        <input type="text" id="jira-linkedissues" value="is contained in" style="width:100%; padding:8px; border:1px solid #cbd5e0; border-radius:6px; background:#f7fafc; color:#4a5568; font-size:13px; box-sizing:border-box;" readonly>
                    </div>
                </div>

                <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 12px;">
                    <div>
                        <label style="display:block; font-size:12px; font-weight:700; margin-bottom:6px; color:#e53e3e;">Issue (종속 스토리) *</label>
                        <input type="text" id="jira-issue-dep" placeholder="Phase별 Story 연결 명세" style="width:100%; padding:8px; border:1px solid #cbd5e0; border-radius:6px; background:#fff; color:#000; font-size:13px; box-sizing:border-box;">
                    </div>
                    <div>
                        <label style="display:block; font-size:12px; font-weight:700; margin-bottom:6px; color:#e53e3e;">Attachment (첨부파일) *</label>
                        <input type="file" id="jira-attachment" style="width:100%; font-size:12px; color:#718096;">
                    </div>
                </div>

                <div>
                    <label style="display:block; font-size:12px; font-weight:700; margin-bottom:6px; color:#e53e3e;">Description 상세 입력 *</label>
                    <div style="display:grid; grid-template-columns: 1fr 1fr; gap:8px; margin-bottom:6px;">
                        <input type="text" id="desc-env" placeholder="테스트 환경 (예: QA 서버, AOS 14)" style="padding:6px; border:1px solid #e2e8f0; border-radius:4px; font-size:12px; background:#fff; color:#000;">
                        <input type="text" id="desc-pre" placeholder="사전 조건 명세" style="padding:6px; border:1px solid #e2e8f0; border-radius:4px; font-size:12px; background:#fff; color:#000;">
                    </div>
                    <textarea id="desc-steps" placeholder="재현 절차를 단계별로 기입하세요 (1. 마이페이지 진입...)" style="width:100%; height:70px; padding:8px; border:1px solid #cbd5e0; border-radius:6px; background:#fff; color:#000; font-size:12px; box-sizing:border-box; margin-bottom:6px; resize:none;"></textarea>
                    <div style="display:grid; grid-template-columns: 1fr 1fr; gap:8px;">
                        <input type="text" id="desc-error" placeholder="현재 결함 문제현상" style="padding:6px; border:1px solid #e2e8f0; border-radius:4px; font-size:12px; background:#fff; color:#000;">
                        <input type="text" id="desc-expected" placeholder="정상 기대결과" style="padding:6px; border:1px solid #e2e8f0; border-radius:4px; font-size:12px; background:#fff; color:#000;">
                    </div>
                </div>
            </div>

            <!-- SECTION 2: 선택 입력 항목 (접이식 아코디언 배치) -->
            <div style="border: 1px solid #edf2f7; border-radius: 8px; overflow: hidden;">
                <div id="toggle-optional-fields" style="background:#edf2f7; padding:10px 14px; font-size:13px; font-weight:700; color:#4a5568; cursor:pointer; display:flex; justify-content:space-between; align-items:center;">
                    <span>⚪ 선택 입력 사항 (회색 항목 확장)</span>
                    <span id="accordion-arrow">▼</span>
                </div>
                <div id="optional-fields-box" style="padding:14px; display:none; flex-direction:column; gap:12px; background:#fcfcfc; border-top:1px solid #edf2f7;">
                    <div style="display:grid; grid-template-columns: 1fr 1fr 1fr; gap:10px;">
                        <div>
                            <label style="font-size:11px; color:#718096; font-weight:700;">OY_PMO</label>
                            <input type="text" id="opt-pmo" style="width:100%; padding:4px; font-size:12px; border:1px solid #e2e8f0; background:#fff; color:#000;">
                        </div>
                        <div>
                            <label style="font-size:11px; color:#718096; font-weight:700;">OY_우선순위</label>
                            <input type="text" id="opt-oy-priority" style="width:100%; padding:4px; font-size:12px; border:1px solid #e2e8f0; background:#fff; color:#000;">
                        </div>
                        <div>
                            <label style="font-size:11px; color:#718096; font-weight:700;">OY_구분</label>
                            <input type="text" id="opt-gubun" style="width:100%; padding:4px; font-size:12px; border:1px solid #e2e8f0; background:#fff; color:#000;">
                        </div>
                    </div>
                    <div style="display:grid; grid-template-columns: 1fr 1fr 1fr; gap:10px;">
                        <div>
                            <label style="font-size:11px; color:#718096; font-weight:700;">OY_30d</label>
                            <input type="text" id="opt-30d" style="width:100%; padding:4px; font-size:12px; border:1px solid #e2e8f0; background:#fff; color:#000;">
                        </div>
                        <div>
                            <label style="font-size:11px; color:#718096; font-weight:700;">Planned Start</label>
                            <input type="date" id="opt-planned-start" style="width:100%; padding:4px; font-size:11px; border:1px solid #e2e8f0; background:#fff; color:#000;">
                        </div>
                        <div>
                            <label style="font-size:11px; color:#718096; font-weight:700;">Due Date</label>
                            <input type="date" id="opt-due" style="width:100%; padding:4px; font-size:11px; border:1px solid #e2e8f0; background:#fff; color:#000;">
                        </div>
                    </div>
                    <div style="display:grid; grid-template-columns: 1fr 1fr 1fr 1fr; gap:8px;">
                        <div>
                            <label style="font-size:11px; color:#718096; font-weight:700;">Start Date</label>
                            <input type="date" id="opt-start" style="width:100%; padding:4px; font-size:11px; border:1px solid #e2e8f0; background:#fff; color:#000;">
                        </div>
                        <div>
                            <label style="font-size:11px; color:#718096; font-weight:700;">Finish Date</label>
                            <input type="date" id="opt-finish" style="width:100%; padding:4px; font-size:11px; border:1px solid #e2e8f0; background:#fff; color:#000;">
                        </div>
                        <div>
                            <label style="font-size:11px; color:#718096; font-weight:700;">Sprint</label>
                            <input type="text" id="opt-sprint" style="width:100%; padding:4px; font-size:12px; border:1px solid #e2e8f0; background:#fff; color:#000;">
                        </div>
                        <div>
                            <label style="font-size:11px; color:#718096; font-weight:700;">Fix Version/s</label>
                            <input type="text" id="opt-fixversion" style="width:100%; padding:4px; font-size:12px; border:1px solid #e2e8f0; background:#fff; color:#000;">
                        </div>
                    </div>
                    <div style="display:grid; grid-template-columns: 1fr 1fr; gap:12px;">
                        <div>
                            <label style="font-size:11px; color:#718096; font-weight:700;">Story Points</label>
                            <input type="number" id="opt-storypoint" style="width:100%; padding:4px; font-size:12px; border:1px solid #e2e8f0; background:#fff; color:#000;">
                        </div>
                        <div>
                            <label style="font-size:11px; color:#718096; font-weight:700;">Original Story Points</label>
                            <input type="number" id="opt-originalpoint" style="width:100%; padding:4px; font-size:12px; border:1px solid #e2e8f0; background:#fff; color:#000;">
                        </div>
                    </div>
                </div>
            </div>
        </div>

        <!-- 우측: 원클릭 복사용 JIRA 리포트 결과 영역 -->
        <div class="issue-report-zone" style="flex: 1; background: #ffffff; border: 1px solid #e2e8f0; border-radius: 12px; padding: 24px; box-shadow: 0 4px 18px rgba(0,0,0,0.02); display: flex; flex-direction: column; gap: 16px; height: fit-content; position: sticky; top: 20px;">
            <h2 style="font-size: 1.1rem; font-weight: 700; color: #1a202c; margin: 0; border-bottom: 2px solid #edf2f7; padding-bottom: 12px;">📋 리포트 출력 결과</h2>
            
            <div>
                <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:6px;">
                    <span style="font-size:13px; font-weight:700; color:#e53e3e;">📌 JIRA 제목 (Summary)</span>
                    <button id="btn-copy-title" style="padding:4px 8px; background:#3182ce; color:white; border:none; border-radius:4px; font-size:11px; font-weight:600; cursor:pointer;">제목 복사</button>
                </div>
                <input type="text" id="output-title" style="width:100%; padding:8px; font-size:13px; font-weight:700; border:1px solid #cbd5e0; border-radius:6px; background:#f8fafc; color:#2d3748;" readonly>
            </div>

            <div>
                <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:6px;">
                    <span style="font-size:13px; font-weight:700; color:#2b6cb0;">📝 JIRA 본문 (Description)</span>
                    <button id="btn-copy-desc" style="padding:4px 8px; background:#3182ce; color:white; border:none; border-radius:4px; font-size:11px; font-weight:600; cursor:pointer;">본문 복사</button>
                </div>
                <textarea id="output-desc" style="width:100%; height:320px; padding:12px; font-size:12px; border:1px solid #cbd5e0; border-radius:6px; background:#f8fafc; color:#2d3748; font-family:monospace; resize:none;" readonly></textarea>
            </div>
        </div>

    </div>
`;

window.QA_CORE.Issue.Manager = {
    init() {
        const panelZone = document.getElementById('tab-panel-issue');
        if (panelZone) {
            panelZone.innerHTML = window.QA_CORE.Issue.TEMPLATE;
        }
        this.bindEvents();
        this.updateReport();
    },

    bindEvents() {
        // 필수 및 상세 세부 입력 필드 전역 리스너 결합
        const inputs = [
            'jira-project', 'jira-issuetype', 'jira-summary', 'jira-component',
            'jira-assignee', 'jira-labels', 'jira-priority', 'jira-epiclink',
            'jira-issue-dep', 'desc-env', 'desc-pre', 'desc-steps', 'desc-error', 'desc-expected'
        ];
        
        inputs.forEach(id => {
            const el = document.getElementById(id);
            if (el) el.addEventListener('input', () => this.updateReport());
        });

        // 레이블 실시간 공백 소거 가드 핸들러 배치
        const labelsInput = document.getElementById('jira-labels');
        if (labelsInput) {
            labelsInput.addEventListener('input', (e) => {
                e.target.value = e.target.value.replace(/\s+/g, ''); // 띄어쓰기 원천 불허 수칙 집행
                this.updateReport();
            });
        }

        // 선택 필드 아코디언 토글 제어 라우터
        const toggleBtn = document.getElementById('toggle-optional-fields');
        const optionalBox = document.getElementById('optional-fields-box');
        const arrow = document.getElementById('accordion-arrow');
        if (toggleBtn && optionalBox) {
            toggleBtn.onclick = () => {
                if (optionalBox.style.display === 'none') {
                    optionalBox.style.display = 'flex';
                    arrow.innerText = '▲';
                } else {
                    optionalBox.style.display = 'none';
                    arrow.innerText = '▼';
                }
            };
        }

        // 클립보드 원클릭 카피 브릿지 바인딩
        this.setupCopyButton('btn-copy-title', 'output-title', "JIRA 제목이 복사되었습니다.");
        this.setupCopyButton('btn-copy-desc', 'output-desc', "JIRA 본문 템플릿이 복사되었습니다.");
    },

    setupCopyButton(btnId, targetId, successMsg) {
        const btn = document.getElementById(btnId);
        const target = document.getElementById(targetId);
        if (btn && target) {
            btn.onclick = () => {
                target.select();
                document.execCommand('copy');
                alert(successMsg);
            };
        }
    },

    /**
     * [연산 핵심 로직] JIRA 등록 규칙 명세에 부합하도록 출력 버퍼를 실시간 파싱 매핑합니다.
     */
    updateReport() {
        const project = document.getElementById('jira-project').value || "미선택";
        const summaryRaw = document.getElementById('jira-summary').value.trim();
        const component = document.getElementById('jira-component').value || "-";
        const assignee = document.getElementById('jira-assignee').value || "-";
        const labels = document.getElementById('jira-labels').value || "없음";
        const priority = document.getElementById('jira-priority').value || "Major";
        
        const env = document.getElementById('desc-env').value || "-";
        const pre = document.getElementById('desc-pre').value || "-";
        const steps = document.getElementById('desc-steps').value || "";
        const error = document.getElementById('desc-error').value || "";
        const expected = document.getElementById('desc-expected').value || "";

        // [대괄호 중복 기입 예방 가드] 사용자가 입력창에 직접 대괄호를 쳤을 경우 자동 정류 제거
        const cleansedSummary = summaryRaw.replace(/^\[.*?\]\s*/, '');
        
        // 1. 규칙 반영 제목 도출: [프로젝트명] 이슈 요약 명세 준수
        const finalTitle = `[${project}] ${cleansedSummary || "현상을 입력하세요"}`;
        document.getElementById('output-title').value = finalTitle;

        // 2. 규칙 반영 본문 명세 조립
        const markdownDesc = 
`[Environment]
■ Component : ${component}
■ Environment : ${env}
■ Assignee : ${assignee}
■ Labels : ${labels}
■ Priority : ${priority}

[Pre-Condition]
■ ${pre}

[재현스텝]
${steps || "1. "}

[실행결과-문제현상]
■ ${error || "현상 기입 대기"}

[기대결과]
■ ${expected || "정상 동작 명세 대기"}`;

        document.getElementById('output-desc').value = markdownDesc;
    }
};

// 코어 등록 허브가 작동 중이면 강제 상주 등록 처리
if (window.QA_CORE.SkillManager && typeof window.QA_CORE.SkillManager.register === 'function') {
    window.QA_CORE.SkillManager.register('IssueModuleCore', window.QA_CORE.Issue.Manager);
}
