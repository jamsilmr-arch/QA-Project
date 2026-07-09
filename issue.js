// 스크린샷 화면 사양과 100% 매칭되는 마크업 레이아웃 명세 (OS 2종 정류 반영)
export const ISSUE_TEMPLATE = `
    <div class="content-panel active" style="display: flex; gap: 20px; width: 100%; flex-direction: row;">
        
        <div class="sidebar-left" style="width: 260px; display: flex; flex-direction: column; gap: 15px;">
            <div class="card-panel" style="background: #fff3cd; border: 1px solid #ffeeba; color: #856404; font-size: 12px; padding: 12px; border-radius: 8px; font-weight: bold;">
                ⚠️ 브라우저 캐시 삭제 시 유지 필드 내용이 초기화됩니다.
            </div>
            <div class="card-panel layout-vertical">
                <h3 style="font-size: 0.9rem; font-weight: bold; margin-bottom: 6px;">🔗 Epic Link (유지 필드)</h3>
                <input type="text" id="issue-epic-link" placeholder="에픽 링크를 입력하세요" style="background:#f1f3f5;">
            </div>
            <div class="card-panel layout-vertical">
                <h3 style="font-size: 0.9rem; font-weight: bold; margin-bottom: 6px;">💡 이번 검증 참고사항 (유지 필드)</h3>
                <textarea id="issue-verify-note" rows="5" placeholder="검증 시 참고할 내용을 입력하세요" style="background:#f1f3f5; height: 120px; resize: none;"></textarea>
            </div>
        </div>

        <div class="main-builder-zone" style="flex: 2; display: flex; flex-direction: column; gap: 20px;">
            <div class="card-panel layout-vertical" style="position: relative;">
                <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 12px;">
                    <h2 style="font-size: 1.15rem; font-weight: 700;">📝 이슈 내용 입력</h2>
                    <div class="preset-group" style="display: flex; gap: 6px;">
                        <select id="preset-select" style="padding: 4px 8px; font-size: 12px; width: 110px;">
                            <option value="">💾 프리셋 선택...</option>
                        </select>
                        <input type="text" id="preset-name-input" placeholder="프리셋명 입력" style="width: 100px; padding: 4px 6px; font-size: 12px;">
                        <button class="btn-cal-nav" id="btn-preset-save" style="font-size:12px; padding:4px 8px;">저장</button>
                        <button class="btn-preset-delete" id="btn-preset-delete" style="font-size:12px; padding:4px 8px;">삭제</button>
                    </div>
                </div>

                <div class="form-group">
                    <label style="color: #d941c5; font-weight: 700;">📌 현상 요약 (AS-IS 경로 제외)</label>
                    <input type="text" id="issue-summary" placeholder="현상을 입력하세요" style="margin-top: 4px;">
                </div>

                <div class="card-panel" style="background: #fafbfc; border: 1px solid #e9ecef; margin-top: 10px; padding: 15px;">
                    <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 12px;">
                        <span style="font-size: 13px; font-weight: 700; color: #2b6cb0;">🔹 제목 Prefix 상세 조건 (선택)</span>
                        <div>
                            <button class="btn-cal-nav" id="btn-prefix-save" style="font-size:11px; padding:3px 8px;">저장</button>
                            <button class="btn-cal-nav" id="btn-prefix-reset" style="font-size:11px; padding:3px 8px;">초기화</button>
                        </div>
                    </div>
                    
                    <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 12px;">
                        <div class="form-group"><label style="font-size:11px;">환경 <span style="float:right; color:#adb5bd;">1</span></label>
                            <select id="prefix-env">
                                <option value="">선택</option>
                                <option value="QA">QA</option>
                                <option value="STG">STG</option>
                                <option value="PRD">PRD</option>
                            </select></div>
                        <div class="form-group"><label style="font-size:11px;">OS <span style="float:right; color:#adb5bd;">2</span></label>
                            <select id="prefix-os">
                                <option value="해당없음">해당없음</option>
                                <option value="AOS">AOS</option>
                                <option value="iOS">iOS</option>
                            </select></div>
                        <div class="form-group"><label style="font-size:11px;">PoC <span style="float:right; color:#adb5bd;">3</span></label>
                            <select id="prefix-poc"><option value="T 멤버십">T 멤버십</option><option value="기타">기타</option></select></div>
                        <div class="form-group"><label style="font-size:11px;">Critical 구분 <span style="float:right; color:#adb5bd;">4</span></label>
                            <select id="prefix-critical"><option value="해당없음">해당없음</option><option value="Blocker">Blocker</option><option value="Critical">Critical</option></select></div>
                    </div>

                    <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 12px; margin-top: 10px;">
                        <div class="form-group"><label style="font-size:11px;">Device <span style="float:right; color:#adb5bd;">5</span></label>
                            <div style="display: flex; flex-wrap: wrap; gap: 8px; background:#fff; padding:8px; border:1px solid #e2e8f0; border-radius:6px; margin-top:4px;">
                                <label style="font-size:11px; font-weight:normal;"><input type="checkbox" class="dev-chk" value="해당없음" checked> 해당없음</label>
                                <label style="font-size:11px; font-weight:normal;"><input type="checkbox" class="dev-chk" value="삼성인터넷"> 삼성인터넷</label>
                                <label style="font-size:11px; font-weight:normal;"><input type="checkbox" class="dev-chk" value="Safari"> Safari</label>
                                <label style="font-size:11px; font-weight:normal;"><input type="checkbox" class="dev-chk" value="Chrome"> Chrome</label>
                                <label style="font-size:11px; font-weight:normal;"><input type="checkbox" class="dev-chk" value="Edge"> Edge</label>
                            </div>
                            <input type="text" id="prefix-device-text" placeholder="예: 폴드" style="margin-top: 6px; padding:6px;">
                        </div>
                        <div class="form-group"><label style="font-size:11px;">계정 <span style="float:right; color:#adb5bd;">6</span></label>
                            <input type="text" id="prefix-account" placeholder="예: VIP" style="margin-top:4px;"></div>
                    </div>

                    <div class="form-group" style="margin-top: 10px;">
                        <label style="font-size:11px;">이슈 발생 페이지 <span style="float:right; color:#adb5bd;">7</span></label>
                        <input type="text" id="prefix-page" placeholder="예: 출석체크" style="margin-top: 4px;">
                    </div>
                </div>

                <div class="form-group" style="margin-top: 15px;">
                    <label style="font-size: 12px; font-weight: bold;">서버</label>
                    <div style="display: flex; gap: 15px; margin-top: 6px;">
                        <label style="font-weight:normal; font-size:12px;"><input type="checkbox" class="srv-chk" value="QA"> QA</label>
                        <label style="font-weight:normal; font-size:12px;"><input type="checkbox" class="srv-chk" value="STG"> STG</label>
                        <label style="font-weight:normal; font-size:12px;"><input type="checkbox" class="srv-chk" value="PRD"> PRD</label>
                    </div>
                </div>

                <div class="form-group" style="margin-top: 15px;">
                    <label style="font-size: 12px; font-weight: bold;">디바이스 선택</label>
                    <div style="margin-top: 6px;"><label style="font-size:11px; color:var(--text-light);">버전</label></div>
                    <div style="display: flex; flex-wrap: wrap; gap: 12px; background:#f8fafc; padding:10px; border:1px solid #e2e8f0; border-radius:6px; margin-top:4px;">
                        <label style="font-weight:normal; font-size:12px;"><input type="checkbox" class="ver-chk" value="AOS"> AOS</label>
                        <label style="font-weight:normal; font-size:12px;"><input type="checkbox" class="ver-chk" value="iOS"> iOS</label>
                        <label style="font-weight:normal; font-size:12px;"><input type="checkbox" class="ver-chk" value="삼성인터넷"> 삼성인터넷</label>
                        <label style="font-weight:normal; font-size:12px;"><input type="checkbox" class="ver-chk" value="Safari"> Safari</label>
                        <label style="font-weight:normal; font-size:12px;"><input type="checkbox" class="ver-chk" value="Chrome"> Chrome</label>
                        <label style="font-weight:normal; font-size:12px;"><input type="checkbox" class="ver-chk" value="Edge"> Edge</label>
                    </div>
                    <input type="text" id="issue-version-text" placeholder="상세 버전을 입력하세요 (선택)" style="margin-top:6px; padding:6px;">
                </div>

                <div class="layout-vertical" style="gap: 15px; margin-top: 20px;">
                    <div class="form-group">
                        <div style="display:flex; justify-content:space-between; align-items:center;"><label style="font-weight:bold; font-size:13px;">[Pre-Condition]</label></div>
                        <textarea id="section-precond" rows="2" style="margin-top:4px; resize:none;"></textarea>
                    </div>
                    
                    <div class="form-group">
                        <div style="display:flex; gap:8px; align-items:center;"><label style="font-weight:bold; font-size:13px;">[재현스텝]</label> <button class="btn-cal-nav" id="add-step-btn" style="font-size:10px; padding:2px 6px; background:#e1f5fe; border-color:#b3e5fc; color:#0288d1;">CASE +</button> <button class="btn-cal-nav" id="reset-step-btn" style="font-size:10px; padding:2px 6px;">초기화</button></div>
                        <textarea id="section-steps" rows="3" style="margin-top:4px; resize:none;"></textarea>
                    </div>

                    <div class="form-group">
                        <div style="display:flex; gap:8px; align-items:center;"><label style="font-weight:bold; font-size:13px;">[실행결과-문제현상]</label> <button class="btn-cal-nav" id="add-result-btn" style="font-size:10px; padding:2px 6px; background:#e1f5fe; border-color:#b3e5fc; color:#0288d1;">CASE +</button> <button class="btn-cal-nav" id="reset-result-btn" style="font-size:10px; padding:2px 6px;">초기화</button></div>
                        <textarea id="section-error" rows="3" style="margin-top:4px; resize:none;"></textarea>
                    </div>

                    <div class="form-group">
                        <div style="display:flex; gap:8px; align-items:center;"><label style="font-weight:bold; font-size:13px;">[기대결과]</label> <button class="btn-cal-nav" id="add-expect-btn" style="font-size:10px; padding:2px 6px; background:#e1f5fe; border-color:#b3e5fc; color:#0288d1;">CASE +</button> <button class="btn-cal-nav" id="reset-expect-btn" style="font-size:10px; padding:2px 6px;">초기화</button></div>
                        <textarea id="section-expect" rows="3" style="margin-top:4px; resize:none;"></textarea>
                    </div>

                    <div class="form-group">
                        <label style="font-weight:bold; font-size:13px;">[참고사항]</label>
                        <div style="background:#f1f3f5; padding:10px; border-radius:6px; font-size:12px; margin-top:4px; display:flex; flex-direction:column; gap:6px;">
                            <div>1. 상용 재현 여부</div>
                            <input type="text" id="note-prod-reproduce" placeholder="상용 환경 재현 여부를 기입하세요">
                            <div style="margin-top:4px;">기타 참고 내용</div>
                            <input type="text" id="note-etc" placeholder="기타 참고 내용을 입력하세요">
                        </div>
                    </div>
                </div>
            </div>
        </div>

        <div class="report-preview-zone" style="flex: 1.2; display: flex; flex-direction: column; gap: 20px;">
            <div class="card-panel layout-vertical" style="height: 100%; min-height: 600px; background: #f8fafc;">
                <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 15px;">
                    <h2 style="font-size: 1.1rem; font-weight: 700;">📄 리포트 결과</h2>
                    <button class="btn-cal-nav" id="btn-report-clear" style="font-size:11px; padding:4px 8px;">🔄 새로 작성</button>
                </div>

                <div class="form-group">
                    <div style="display: flex; justify-content: space-between; align-items: center;"><label style="font-weight:bold; font-size:12px; color:#e53e3e;">📌 제목 (Title)</label> <button class="btn-action" id="btn-copy-title" style="font-size:11px; padding:3px 8px; background:var(--accent-blue); color:white;">제목만 복사</button></div>
                    <div id="display-title-result" style="background:#fff; border:1px solid var(--border-color); padding:12px; border-radius:6px; min-height:40px; margin-top:6px; font-size:13px; font-weight:bold; word-break:break-all;"></div>
                </div>

                <div class="form-group" style="flex: 1; display: flex; flex-direction: column; margin-top: 15px;">
                    <div style="display: flex; justify-content: space-between; align-items: center;"><label style="font-weight:bold; font-size:12px; color:#2b6cb0;">📝 본문 (Description)</label> <button class="btn-action" id="btn-copy-desc" style="font-size:11px; padding:3px 8px; background:var(--accent-blue); color:white;">본문만 복사</button></div>
                    <textarea id="display-desc-result" readonly style="background:#fff; border:1px solid var(--border-color); padding:15px; border-radius:6px; flex:1; margin-top:6px; font-family:'Courier New', monospace; font-size:12px; line-height:1.6; color:#2d3748; resize:none;"></textarea>
                </div>
            </div>
        </div>
    </div>
`;

export function initIssuePanel() {
    const issuePanel = document.getElementById('tab-panel-issue');
    if (issuePanel && !issuePanel.innerHTML.trim()) {
        issuePanel.innerHTML = ISSUE_TEMPLATE;
    }
    bindIssueBuilderEvents();
}

function bindIssueBuilderEvents() {
    const inputs = [
        'issue-epic-link', 'issue-verify-note', 'issue-summary',
        'prefix-env', 'prefix-os', 'prefix-poc', 'prefix-critical',
        'prefix-device-text', 'prefix-account', 'prefix-page',
        'issue-version-text', 'section-precond', 'section-steps',
        'section-error', 'section-expect', 'note-prod-reproduce', 'note-etc'
    ];

    inputs.forEach(id => {
        const el = document.getElementById(id);
        if (el) el.addEventListener('input', compileReportData);
    });

    document.querySelectorAll('.dev-chk, .srv-chk, .ver-chk').forEach(chk => {
        chk.addEventListener('change', compileReportData);
    });

    setupCaseAppendTrigger('add-step-btn', 'section-steps', '• ');
    setupCaseAppendTrigger('add-result-btn', 'section-error', '• ');
    setupCaseAppendTrigger('add-expect-btn', 'section-expect', '• ');

    setupFieldResetTrigger('reset-step-btn', 'section-steps');
    setupFieldResetTrigger('reset-result-btn', 'section-error');
    setupFieldResetTrigger('reset-expect-btn', 'section-expect');

    setupClipboardCopyTrigger('btn-copy-title', () => document.getElementById('display-title-result').innerText);
    setupClipboardCopyTrigger('btn-copy-desc', () => document.getElementById('display-desc-result').value);

    const clearBtn = document.getElementById('btn-report-clear');
    if (clearBtn) {
        clearBtn.addEventListener('click', () => {
            ['issue-summary', 'prefix-device-text', 'prefix-account', 'prefix-page', 'issue-version-text',
             'section-precond', 'section-steps', 'section-error', 'section-expect', 'note-prod-reproduce', 'note-etc']
            .forEach(id => { const el = document.getElementById(id); if (el) el.value = ''; });
            compileReportData();
        });
    }

    compileReportData();
}

function setupCaseAppendTrigger(btnId, targetId, prefixText) {
    const btn = document.getElementById(btnId);
    if (btn) {
        btn.onclick = () => {
            const tx = document.getElementById(targetId);
            if (!tx) return;
            const lines = tx.value.split('\n').filter(l => l.trim());
            const nextNum = lines.length + 1;
            tx.value += (tx.value ? '\n' : '') + `${prefixText}${nextNum}단계: `;
            tx.dispatchEvent(new Event('input'));
        };
    }
}

function setupFieldResetTrigger(btnId, targetId) {
    const btn = document.getElementById(btnId);
    if (btn) {
        btn.onclick = () => {
            const tx = document.getElementById(targetId);
            if (tx) { tx.value = ''; tx.dispatchEvent(new Event('input')); }
        };
    }
}

function setupClipboardCopyTrigger(btnId, dataSelector) {
    const btn = document.getElementById(btnId);
    if (btn) {
        btn.onclick = () => {
            const text = dataSelector();
            if (!text.trim()) return;
            navigator.clipboard.writeText(text).then(() => {
                if (window.QA_CORE.UI) window.QA_CORE.UI.showToast("클립보드에 안전하게 복사되었습니다.");
            });
        };
    }
}

function compileReportData() {
    const getVal = (id) => { const el = document.getElementById(id); return el ? el.value.trim() : ''; };
    
    const env = getVal('prefix-env');
    const os = getVal('prefix-os');
    const poc = getVal('prefix-poc') || 'T 멤버십';
    const critical = getVal('prefix-critical');
    const account = getVal('prefix-account');
    const page = getVal('prefix-page');
    const summary = getVal('issue-summary');

    let prefixParts = [];
    if (env) prefixParts.push(env);
    if (os && os !== '해당없음') prefixParts.push(os);
    if (poc) prefixParts.push(poc);
    if (critical && critical !== '해당없음') prefixParts.push(critical);
    if (account) prefixParts.push(account);
    if (page) prefixParts.push(page);

    const titlePrefix = prefixParts.length ? `[${prefixParts.join('/')}] ` : '';
    const finalTitle = `${titlePrefix}${summary || '현상을 입력하세요'}`;
    
    const titleDisplay = document.getElementById('display-title-result');
    if (titleDisplay) titleDisplay.innerText = finalTitle;

    const checkedDevices = Array.from(document.querySelectorAll('.dev-chk:checked')).map(c => c.value);
    const customDevice = getVal('prefix-device-text');
    let deviceFinal = checkedDevices.join(', ');
    if (customDevice) deviceFinal += (deviceFinal ? ', ' : '') + customDevice;

    const checkedServers = Array.from(document.querySelectorAll('.srv-chk:checked')).map(c => c.value).join(', ');
    const checkedVersions = Array.from(document.querySelectorAll('.ver-chk:checked')).map(c => c.value).join(', ');
    const customVersion = getVal('issue-version-text');
    let versionFinal = checkedVersions;
    if (customVersion) versionFinal += (versionFinal ? ' / ' : '') + customVersion;

    const bodyText = `[Environment]
■ POC : ${poc}
■ Device : ${deviceFinal || '-'}
■ 서버 : ${checkedServers || '-'}
■ 버전 : ${versionFinal || '-'}

[Pre-Condition]
${getVal('section-precond')}

[재현스텝]
${getVal('section-steps')}

[실행결과-문제현상]
${getVal('section-error')}

[기대결과]
${getVal('section-expect')}

[참고사항]
1. 상용 재현 여부: ${getVal('note-prod-reproduce') || '기입 안 함'}
2. 기타 참고 내용: ${getVal('note-etc') || '없음'}`;

    const descDisplay = document.getElementById('display-desc-result');
    if (descDisplay) descDisplay.value = bodyText;
}