window.QA_CORE = window.QA_CORE || {};
window.QA_CORE.Issue = window.QA_CORE.Issue || {};

// [JIRA 규칙 완벽 통합] 기존 고도화된 스크린샷 레이아웃을 계승하며 필수/선택 필드를 완벽하게 체결한 마크업 명세
window.QA_CORE.Issue.TEMPLATE = `
    <div class="content-panel active" style="display: flex; gap: 20px; width: 100%; flex-direction: row; box-sizing: border-box; padding: 4px;">
        
        <!-- 좌측 사이드바: 유지 필드 구역 -->
        <div class="sidebar-left" style="width: 260px; display: flex; flex-direction: column; gap: 15px; flex-shrink: 0;">
            <div class="card-panel" style="background: #fff3cd; border: 1px solid #ffeeba; color: #856404; font-size: 12px; padding: 12px; border-radius: 8px; font-weight: bold;">
                ⚠️ 브라우저 캐시 삭제 시 유지 필드 내용이 초기화됩니다.
            </div>
            <div class="card-panel layout-vertical">
                <h3 style="font-size: 0.9rem; font-weight: bold; margin-bottom: 6px; color:#e53e3e;">🔗 Epic Link (필수) *</h3>
                <input type="text" id="issue-epic-link" placeholder="에픽 링크를 입력하세요" style="background:#f1f3f5; padding:8px; border:1px solid #cbd5e0; border-radius:6px; font-size:13px; color:#000;">
            </div>
            <div class="card-panel layout-vertical">
                <h3 style="font-size: 0.9rem; font-weight: bold; margin-bottom: 6px;">💡 이번 검증 참고사항 (유지 필드)</h3>
                <textarea id="issue-verify-note" rows="5" placeholder="검증 시 참고할 내용을 입력하세요" style="background:#f1f3f5; height: 120px; resize: none; padding:8px; border:1px solid #cbd5e0; border-radius:6px; font-size:13px; line-height:1.4; color:#000;"></textarea>
            </div>
        </div>

        <!-- 중앙: 메인 이슈 빌더 존 -->
        <div class="main-builder-zone" style="flex: 2; display: flex; flex-direction: column; gap: 20px; min-width: 0;">
            <div class="card-panel layout-vertical" style="position: relative; background:#ffffff; padding:20px; border-radius:8px; border:1px solid #e2e8f0;">
                
                <!-- 프리셋 관리 헤더 인터페이스 (ID 완전 보존) -->
                <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 12px; border-bottom:1px solid #edf2f7; padding-bottom:10px;">
                    <h2 style="font-size: 1.15rem; font-weight: 700; color:#1a202c; margin:0;">📝 JIRA 이슈 내용 입력</h2>
                    <div class="preset-group" style="display: flex; gap: 6px;">
                        <select id="preset-select" style="padding: 4px 8px; font-size: 12px; width: 120px; border-radius:4px; border:1px solid #cbd5e0; background:#fff; color:#000; font-weight:600;">
                            <option value="">💾 프리셋 선택...</option>
                        </select>
                        <input type="text" id="preset-name-input" placeholder="프리셋명 입력" style="width: 100px; padding: 4px 6px; font-size: 12px; border-radius:4px; border:1px solid #cbd5e0; background:#fff; color:#000;">
                        <button class="btn-cal-nav" id="btn-preset-save" style="font-size:12px; padding:4px 8px; font-weight:700;">저장</button>
                        <button class="btn-preset-delete" id="btn-preset-delete" style="font-size:12px; padding:4px 8px; background:#fff0f2; color:#e53e3e; border-color:#fed7d7; font-weight:700;">삭제</button>
                    </div>
                </div>

                <!-- 🔴 [규칙 주입] JIRA 규격 필수 마운트 컴포넌트 그룹 -->
                <div style="background:#fff5f5; border:1px solid #fed7d7; padding:16px; border-radius:8px; display:flex; flex-direction:column; gap:12px; margin-bottom:10px;">
                    <span style="font-size:13px; font-weight:700; color:#c53030; display:flex; align-items:center; gap:4px;">🔴 JIRA 필수 지정 대시보드 메타 필드</span>
                    <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 12px;">
                        <div class="form-group" style="margin:0;">
                            <label style="font-size:11px; font-weight:700; color:#4a5568;">Project *</label>
                            <select id="jira-project" style="padding:6px; font-size:12px; border:1px solid #cbd5e0; border-radius:4px; background:#fff; color:#000; font-weight:600;">
                                <option value="">프로젝트 선택</option>
                                <option value="T 멤버십">T 멤버십</option>
                                <option value="OY_Core">OY_Core</option>
                                <option value="PE_QA">PE_QA</option>
                            </select>
                        </div>
                        <div class="form-group" style="margin:0;">
                            <label style="font-size:11px; font-weight:700; color:#4a5568;">Issue Type *</label>
                            <select id="jira-issuetype" style="padding:6px; font-size:12px; border:1px solid #cbd5e0; border-radius:4px; background:#fff; color:#000;">
                                <option value="Defect">Defect - 테스트 이슈</option>
                                <option value="운영Bug">운영Bug - 실서버 이슈</option>
                            </select>
                        </div>
                    </div>
                    <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 12px;">
                        <div class="form-group" style="margin:0;">
                            <label style="font-size:11px; font-weight:700; color:#4a5568;">Component/s *</label>
                            <input type="text" id="jira-component" placeholder="이슈 발생 영역 / 메뉴 기입" style="padding:6px; font-size:12px; border:1px solid #cbd5e0; border-radius:4px; background:#fff; color:#000;">
                        </div>
                        <div class="form-group" style="margin:0;">
                            <label style="font-size:11px; font-weight:700; color:#4a5568;">Assignee *</label>
                            <select id="jira-assignee" style="padding:6px; font-size:12px; border:1px solid #cbd5e0; border-radius:4px; background:#fff; color:#000;">
                                <option value="개발자 담당">개발자 담당</option>
                                <option value="기획자 담당">기획자 담당</option>
                            </select>
                        </div>
                    </div>
                    <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 12px;">
                        <div class="form-group" style="margin:0;">
                            <label style="font-size:11px; font-weight:700; color:#4a5568;">Labels * <span style="font-size:10px; color:#e53e3e; font-weight:normal;">(공백 금지)</span></label>
                            <input type="text" id="jira-labels" placeholder="스쿼드 레이블 명세" style="padding:6px; font-size:12px; border:1px solid #cbd5e0; border-radius:4px; background:#fff; color:#000;">
                        </div>
                        <div class="form-group" style="margin:0;">
                            <label style="font-size:11px; font-weight:700; color:#4a5568;">Priority (중요도) *</label>
                            <select id="jira-priority" style="padding:6px; font-size:12px; border:1px solid #cbd5e0; border-radius:4px; background:#fff; color:#000; font-weight:600;">
                                <option value="Major">Major</option>
                                <option value="Critical">Critical</option>
                                <option value="Blocker">Blocker</option>
                                <option value="Minor">Minor</option>
                            </select>
                        </div>
                    </div>
                    <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 12px;">
                        <div class="form-group" style="margin:0;">
                            <label style="font-size:11px; font-weight:700; color:#4a5568;">Linked Issues *</label>
                            <input type="text" id="jira-linkedissues" value="is contained in" style="padding:6px; font-size:12px; border:1px solid #cbd5e0; border-radius:4px; background:#f8fafc; color:#4a5568;" readonly>
                        </div>
                        <div class="form-group" style="margin:0;">
                            <label style="font-size:11px; font-weight:700; color:#4a5568;">Issue * <span style="font-size:10px; color:#718096; font-weight:normal;">(종속 스토리 지라 연결)</span></label>
                            <input type="text" id="jira-issue-dep" placeholder="스토리(관련지라) 종속 연동 지지선" style="padding:6px; font-size:12px; border:1px solid #cbd5e0; border-radius:4px; background:#fff; color:#000;">
                        </div>
                    </div>
                    <div class="form-group" style="margin:0;">
                        <label style="font-size:11px; font-weight:700; color:#4a5568;">Attachment (첨부파일) *</label>
                        <input type="file" id="jira-attachment" style="font-size:12px; color:#718096; border:none; background:transparent; padding:0;">
                    </div>
                </div>

                <div class="form-group">
                    <label style="color: #d941c5; font-weight: 700;">📌 현상 요약 (AS-IS 경로 제외) *</label>
                    <input type="text" id="issue-summary" placeholder="현상을 입력하세요" style="margin-top: 4px; background:#fff; color:#000;">
                </div>

                <!-- 기존 제목 Prefix 상세 조건 카드 판넬 보존 -->
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
                            <select id="prefix-env" style="background:#fff; color:#000;">
                                <option value="">선택</option><option value="QA">QA</option><option value="STG">STG</option><option value="PRD">PRD</option>
                            </select></div>
                        <div class="form-group"><label style="font-size:11px;">OS <span style="float:right; color:#adb5bd;">2</span></label>
                            <select id="prefix-os" style="background:#fff; color:#000;">
                                <option value="해당없음">해당없음</option><option value="AOS">AOS</option><option value="iOS">iOS</option>
                            </select></div>
                        <div class="form-group"><label style="font-size:11px;">PoC <span style="float:right; color:#adb5bd;">3</span></label>
                            <select id="prefix-poc" style="background:#fff; color:#000;"><option value="T 멤버십">T 멤버십</option><option value="기타">기타</option></select></div>
                        <div class="form-group"><label style="font-size:11px;">Critical 구분 <span style="float:right; color:#adb5bd;">4</span></label>
                            <select id="prefix-critical" style="background:#fff; color:#000;"><option value="해당없음">해당없음</option><option value="Blocker">Blocker</option><option value="Critical">Critical</option></select></div>
                    </div>

                    <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 12px; margin-top: 10px;">
                        <div class="form-group"><label style="font-size:11px;">Device <span style="float:right; color:#adb5bd;">5</span></label>
                            <div style="display: flex; flex-wrap: wrap; gap: 8px; background:#fff; padding:8px; border:1px solid #e2e8f0; border-radius:6px; margin-top:4px;">
                                <label style="font-size:11px; font-weight:normal; color:#000;"><input type="checkbox" class="dev-chk" value="해당없음" checked> 해당없음</label>
                                <label style="font-size:11px; font-weight:normal; color:#000;"><input type="checkbox" class="dev-chk" value="삼성인터넷"> 삼성인터넷</label>
                                <label style="font-size:11px; font-weight:normal; color:#000;"><input type="checkbox" class="dev-chk" value="Safari"> Safari</label>
                                <label style="font-size:11px; font-weight:normal; color:#000;"><input type="checkbox" class="dev-chk" value="Chrome"> Chrome</label>
                                <label style="font-size:11px; font-weight:normal; color:#000;"><input type="checkbox" class="dev-chk" value="Edge"> Edge</label>
                            </div>
                            <input type="text" id="prefix-device-text" placeholder="예: 폴드" style="margin-top: 6px; padding:6px; background:#fff; color:#000;">
                        </div>
                        <div class="form-group"><label style="font-size:11px;">계정 <span style="float:right; color:#adb5bd;">6</span></label>
                            <input type="text" id="prefix-account" placeholder="예: VIP" style="margin-top:4px; background:#fff; color:#000;"></div>
                    </div>

                    <div class="form-group" style="margin-top: 10px;">
                        <label style="font-size:11px;">이슈 발생 페이지 <span style="float:right; color:#adb5bd;">7</span></label>
                        <input type="text" id="prefix-page" placeholder="예: 출석체크" style="margin-top: 4px; background:#fff; color:#000;">
                    </div>
                </div>

                <div class="form-group" style="margin-top: 15px;">
                    <label style="font-size: 12px; font-weight: bold; color:#1a202c;">서버</label>
                    <div style="display: flex; gap: 15px; margin-top: 6px;">
                        <label style="font-weight:normal; font-size:12px; color:#000;"><input type="checkbox" class="srv-chk" value="QA"> QA</label>
                        <label style="font-weight:normal; font-size:12px; color:#000;"><input type="checkbox" class="srv-chk" value="STG"> STG</label>
                        <label style="font-weight:normal; font-size:12px; color:#000;"><input type="checkbox" class="srv-chk" value="PRD"> PRD</label>
                    </div>
                </div>

                <div class="form-group" style="margin-top: 15px;">
                    <label style="font-size: 12px; font-weight: bold; color:#1a202c;">디바이스 선택</label>
                    <div style="margin-top: 6px;"><label style="font-size:11px; color:var(--text-light);">버전</label></div>
                    <div style="display: flex; flex-wrap: wrap; gap: 12px; background:#f8fafc; padding:10px; border:1px solid #e2e8f0; border-radius:6px; margin-top:4px;">
                        <label style="font-weight:normal; font-size:12px; color:#000;"><input type="checkbox" class="ver-chk" value="AOS"> AOS</label>
                        <label style="font-weight:normal; font-size:12px; color:#000;"><input type="checkbox" class="ver-chk" value="iOS"> iOS</label>
                        <label style="font-weight:normal; font-size:12px; color:#000;"><input type="checkbox" class="ver-chk" value="삼성인터넷"> 삼성인터넷</label>
                        <label style="font-weight:normal; font-size:12px; color:#000;"><input type="checkbox" class="ver-chk" value="Safari"> Safari</label>
                        <label style="font-weight:normal; font-size:12px; color:#000;"><input type="checkbox" class="ver-chk" value="Chrome"> Chrome</label>
                        <label style="font-weight:normal; font-size:12px; color:#000;"><input type="checkbox" class="ver-chk" value="Edge"> Edge</label>
                    </div>
                    <input type="text" id="issue-version-text" placeholder="상세 버전을 입력하세요 (선택)" style="margin-top:6px; padding:6px; background:#fff; color:#000;">
                </div>

                <!-- 마크업 스텝 폼 부문 완전 유지 계승 -->
                <div class="layout-vertical" style="gap: 15px; margin-top: 20px;">
                    <div class="form-group">
                        <div style="display:flex; justify-content:space-between; align-items:center;"><label style="font-weight:bold; font-size:13px; color:#1a202c;">[Pre-Condition]</label></div>
                        <textarea id="section-precond" rows="2" style="margin-top:4px; resize:none; background:#fff; color:#000;"></textarea>
                    </div>
                    
                    <div class="form-group">
                        <div style="display:flex; gap:8px; align-items:center;"><label style="font-weight:bold; font-size:13px; color:#1a202c;">[재현스텝]</label> <button class="btn-cal-nav" id="add-step-btn" style="font-size:10px; padding:2px 6px; background:#e1f5fe; border-color:#b3e5fc; color:#0288d1; font-weight:700;">CASE +</button> <button class="btn-cal-nav" id="reset-step-btn" style="font-size:10px; padding:2px 6px;">초기화</button></div>
                        <textarea id="section-steps" rows="3" style="margin-top:4px; resize:none; background:#fff; color:#000;"></textarea>
                    </div>

                    <div class="form-group">
                        <div style="display:flex; gap:8px; align-items:center;"><label style="font-weight:bold; font-size:13px; color:#1a202c;">[실행결과-문제현상]</label> <button class="btn-cal-nav" id="add-result-btn" style="font-size:10px; padding:2px 6px; background:#e1f5fe; border-color:#b3e5fc; color:#0288d1; font-weight:700;">CASE +</button> <button class="btn-cal-nav" id="reset-result-btn" style="font-size:10px; padding:2px 6px;">초기화</button></div>
                        <textarea id="section-error" rows="3" style="margin-top:4px; resize:none; background:#fff; color:#000;"></textarea>
                    </div>

                    <div class="form-group">
                        <div style="display:flex; gap:8px; align-items:center;"><label style="font-weight:bold; font-size:13px; color:#1a202c;">[기대결과]</label> <button class="btn-cal-nav" id="add-expect-btn" style="font-size:10px; padding:2px 6px; background:#e1f5fe; border-color:#b3e5fc; color:#0288d1; font-weight:700;">CASE +</button> <button class="btn-cal-nav" id="reset-expect-btn" style="font-size:10px; padding:2px 6px;">초기화</button></div>
                        <textarea id="section-expect" rows="3" style="margin-top:4px; resize:none; background:#fff; color:#000;"></textarea>
                    </div>

                    <div class="form-group">
                        <label style="font-weight:bold; font-size:13px; color:#1a202c;">[참고사항]</label>
                        <div style="background:#f1f3f5; padding:10px; border-radius:6px; font-size:12px; margin-top:4px; display:flex; flex-direction:column; gap:6px;">
                            <div style="font-weight:600; color:#2d3748;">1. 상용 재현 여부</div>
                            <input type="text" id="note-prod-reproduce" placeholder="상용 환경 재현 여부를 기입하세요" style="background:#fff; color:#000;">
                            <div style="margin-top:4px; font-weight:600; color:#2d3748;">기타 참고 내용</div>
                            <input type="text" id="note-etc" placeholder="기타 참고 내용을 입력하세요" style="background:#fff; color:#000;">
                        </div>
                    </div>
                </div>

                <!-- ⚪ [회색 규칙 수렴] JIRA 선택 입력 사항 아코디언 컴포넌트 전격 장착 -->
                <div style="border: 1px solid #edf2f7; border-radius: 8px; overflow: hidden; margin-top:20px;">
                    <div id="toggle-optional-fields" style="background:#edf2f7; padding:10px 14px; font-size:13px; font-weight:700; color:#4a5568; cursor:pointer; display:flex; justify-content:space-between; align-items:center; user-select:none;">
                        <span>⚪ JIRA 선택 입력 사항 (회색 옵션 항목 확장)</span>
                        <span id="accordion-arrow">▼</span>
                    </div>
                    <div id="optional-fields-box" style="padding:14px; display:none; flex-direction:column; gap:12px; background:#fcfcfc; border-top:1px solid #edf2f7;">
                        <div style="display:grid; grid-template-columns: 1fr 1fr 1fr; gap:10px;">
                            <div>
                                <label style="font-size:11px; color:#718096; font-weight:700;">OY_PMO</label>
                                <input type="text" id="opt-pmo" style="padding:6px; font-size:12px; border:1px solid #cbd5e0; background:#fff; color:#000; border-radius:4px;">
                            </div>
                            <div>
                                <label style="font-size:11px; color:#718096; font-weight:700;">OY_우선순위</label>
                                <input type="text" id="opt-oy-priority" style="padding:6px; font-size:12px; border:1px solid #cbd5e0; background:#fff; color:#000; border-radius:4px;">
                            </div>
                            <div>
                                <label style="font-size:11px; color:#718096; font-weight:700;">OY_구분</label>
                                <input type="text" id="opt-gubun" style="padding:6px; font-size:12px; border:1px solid #cbd5e0; background:#fff; color:#000; border-radius:4px;">
                            </div>
                        </div>
                        <div style="display:grid; grid-template-columns: 1fr 1fr 1fr; gap:10px;">
                            <div>
                                <label style="font-size:11px; color:#718096; font-weight:700;">OY_30d</label>
                                <input type="text" id="opt-30d" style="padding:6px; font-size:12px; border:1px solid #cbd5e0; background:#fff; color:#000; border-radius:4px;">
                            </div>
                            <div>
                                <label style="font-size:11px; color:#718096; font-weight:700;">Planned Start Date</label>
                                <input type="date" id="opt-planned-start" style="padding:4px; font-size:12px; border:1px solid #cbd5e0; background:#fff; color:#000; border-radius:4px;">
                            </div>
                            <div>
                                <label style="font-size:11px; color:#718096; font-weight:700;">Due Date</label>
                                <input type="date" id="opt-due" style="padding:4px; font-size:12px; border:1px solid #cbd5e0; background:#fff; color:#000; border-radius:4px;">
                            </div>
                        </div>
                        <div style="display:grid; grid-template-columns: 1fr 1fr 1fr 1fr; gap:8px;">
                            <div>
                                <label style="font-size:11px; color:#718096; font-weight:700;">Start Date</label>
                                <input type="date" id="opt-start" style="padding:4px; font-size:11px; border:1px solid #cbd5e0; background:#fff; color:#000; border-radius:4px;">
                            </div>
                            <div>
                                <label style="font-size:11px; color:#718096; font-weight:700;">Finish Date</label>
                                <input type="date" id="opt-finish" style="padding:4px; font-size:11px; border:1px solid #cbd5e0; background:#fff; color:#000; border-radius:4px;">
                            </div>
                            <div>
                                <label style="font-size:11px; color:#718096; font-weight:700;">Sprint</label>
                                <input type="text" id="opt-sprint" style="padding:6px; font-size:12px; border:1px solid #cbd5e0; background:#fff; color:#000; border-radius:4px;">
                            </div>
                            <div>
                                <label style="font-size:11px; color:#718096; font-weight:700;">Fix Version/s</label>
                                <input type="text" id="opt-fixversion" style="padding:6px; font-size:12px; border:1px solid #cbd5e0; background:#fff; color:#000; border-radius:4px;">
                            </div>
                        </div>
                        <div style="display:grid; grid-template-columns: 1fr 1fr; gap:12px;">
                            <div>
                                <label style="font-size:11px; color:#718096; font-weight:700;">Story Points</label>
                                <input type="number" id="opt-storypoint" style="padding:6px; font-size:12px; border:1px solid #cbd5e0; background:#fff; color:#000; border-radius:4px;">
                            </div>
                            <div>
                                <label style="font-size:11px; color:#718096; font-weight:700;">Original Story Points</label>
                                <input type="number" id="opt-originalpoint" style="padding:6px; font-size:12px; border:1px solid #cbd5e0; background:#fff; color:#000; border-radius:4px;">
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>

        <!-- 우측: 리포트 결과 프리뷰 파트 (구조 완전 동기화) -->
        <div class="report-preview-zone" style="width: 320px; flex-shrink: 0; display: flex; flex-direction: column; gap: 20px;">
            <div class="card-panel layout-vertical" style="height: 100%; min-height: 600px; background: #f8fafc; padding:20px; border-radius:8px; border:1px solid #e2e8f0; display:flex; flex-direction:column;">
                <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 15px;">
                    <h2 style="font-size: 1.1rem; font-weight: 700; color:#1a202c; margin:0;">📄 리포트 결과</h2>
                    <button class="btn-cal-nav" id="btn-report-clear" style="font-size:11px; padding:4px 8px;">🔄 새로 작성</button>
                </div>

                <div class="form-group">
                    <div style="display: flex; justify-content: space-between; align-items: center;"><label style="font-weight:bold; font-size:12px; color:#e53e3e;">📌 제목 (Title)</label> <button class="btn-action" id="btn-copy-title" style="font-size:11px; padding:3px 8px; background:#3182ce; color:white; border:none; border-radius:4px; cursor:pointer;">제목만 복사</button></div>
                    <div id="display-title-result" style="background:#fff; border:1px solid var(--border-color); padding:12px; border-radius:6px; min-height:40px; margin-top:6px; font-size:13px; font-weight:bold; word-break:break-all; color:#2d3748; border:1px solid #cbd5e0;"></div>
                </div>

                <div class="form-group" style="flex: 1; display: flex; flex-direction: column; margin-top: 15px;">
                    <div style="display: flex; justify-content: space-between; align-items: center;"><label style="font-weight:bold; font-size:12px; color:#2b6cb0;">📝 본문 (Description)</label> <button class="btn-action" id="btn-copy-desc" style="font-size:11px; padding:3px 8px; background:#3182ce; color:white; border:none; border-radius:4px; cursor:pointer;">본문만 복사</button></div>
                    <textarea id="display-desc-result" readonly style="background:#fff; border:1px solid #cbd5e0; padding:15px; border-radius:6px; flex:1; margin-top:6px; font-family:'Courier New', monospace; font-size:12px; line-height:1.6; color:#2d3748; resize:none; outline:none; box-sizing:border-box;"></textarea>
                </div>
            </div>
        </div>
    </div>
`;

export function initIssuePanel() {
    const issuePanel = document.getElementById('tab-panel-issue');
    if (issuePanel && !issuePanel.innerHTML.trim()) {
        issuePanel.innerHTML = window.QA_CORE.Issue.TEMPLATE;
    }
    bindIssueBuilderEvents();
}

function bindIssueBuilderEvents() {
    // 필수 바인딩 트래킹 인풋 리스트 최신화 구성
    const inputs = [
        'issue-epic-link', 'issue-verify-note', 'issue-summary',
        'prefix-env', 'prefix-os', 'prefix-poc', 'prefix-critical',
        'prefix-device-text', 'prefix-account', 'prefix-page',
        'issue-version-text', 'section-precond', 'section-steps',
        'section-error', 'section-expect', 'note-prod-reproduce', 'note-etc',
        'jira-project', 'jira-issuetype', 'jira-component', 'jira-assignee', 
        'jira-labels', 'jira-priority', 'jira-issue-dep',
        'opt-pmo', 'opt-oy-priority', 'opt-gubun', 'opt-30d', 
        'opt-planned-start', 'opt-due', 'opt-start', 'opt-finish', 
        'opt-sprint', 'opt-fixversion', 'opt-storypoint', 'opt-originalpoint'
    ];

    inputs.forEach(id => {
        const el = document.getElementById(id);
        if (el) el.addEventListener('input', compileReportData);
    });

    document.querySelectorAll('.dev-chk, .srv-chk, .ver-chk').forEach(chk => {
        chk.addEventListener('change', compileReportData);
    });

    // 레이블 입력 단 공백 제거 수칙 강제 적용 리스너
    const labelField = document.getElementById('jira-labels');
    if (labelField) {
        labelField.addEventListener('input', (e) => {
            e.target.value = e.target.value.replace(/\s+/g, '');
            compileReportData();
        });
    }

    // 아코디언 토글 라우터 인터페이스 연결
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
             'section-precond', 'section-steps', 'section-error', 'section-expect', 'note-prod-reproduce', 'note-etc',
             'jira-project', 'jira-component', 'jira-labels', 'jira-issue-dep',
             'opt-pmo', 'opt-oy-priority', 'opt-gubun', 'opt-30d', 
             'opt-planned-start', 'opt-due', 'opt-start', 'opt-finish', 
             'opt-sprint', 'opt-fixversion', 'opt-storypoint', 'opt-originalpoint']
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
                if (window.QA_CORE.UI && typeof window.QA_CORE.UI.showToast === 'function') {
                    window.QA_CORE.UI.showToast("클립보드에 안전하게 복사되었습니다.");
                } else {
                    alert("클립보드에 복사되었습니다.");
                }
            });
        };
    }
}

/**
 * [동적 조립 연산 엔진] 프리픽스 조건과 신규 지라 규격 마크다운을 통합 컴파일
 */
function compileReportData() {
    const getVal = (id) => { const el = document.getElementById(id); return el ? el.value.trim() : ''; };
    
    // JIRA 코어 필드 수집
    const jProject = getVal('jira-project') || "미선택";
    const jIssueType = getVal('jira-issuetype') || "Defect";
    const jComponent = getVal('jira-component') || "-";
    const jAssignee = getVal('jira-assignee') || "-";
    const jLabels = getVal('jira-labels') || "없음";
    const jPriority = getVal('jira-priority') || "Major";
    const jEpicLink = getVal('issue-epic-link') || "없음";
    const jLinkedIssues = getVal('jira-linkedissues');
    const jIssueDep = getVal('jira-issue-dep') || "-";

    // JIRA 회색 선택 필드 수집
    const oPmo = getVal('opt-pmo');
    const oOyPri = getVal('opt-oy-priority');
    const oGubun = getVal('opt-gubun');
    const o30d = getVal('opt-30d');
    const oPStart = getVal('opt-planned-start');
    const oDue = getVal('opt-due');
    const oStart = getVal('opt-start');
    const oFinish = getVal('opt-finish');
    const oSprint = getVal('opt-sprint');
    const oFixVer = getVal('opt-fixversion');
    const oSp = getVal('opt-storypoint');
    const oOsp = getVal('opt-originalpoint');

    // 프리픽스 변수 수집
    const env = getVal('prefix-env');
    const os = getVal('prefix-os');
    const poc = getVal('prefix-poc') || 'T 멤버십';
    const critical = getVal('prefix-critical');
    const account = getVal('prefix-account');
    const page = getVal('prefix-page');
    const summary = getVal('issue-summary');

    // [중복 기입 방어선] 대괄호 타이틀 하이렉트 중복 오염 자동 보정 가드
    const cleansedSummary = summary.replace(/^\[.*?\]\s*/, '');

    let prefixParts = [];
    if (env) prefixParts.push(env);
    if (os && os !== '해당없음') prefixParts.push(os);
    if (poc) prefixParts.push(poc);
    if (critical && critical !== '해당없음') prefixParts.push(critical);
    if (account) prefixParts.push(account);
    if (page) prefixParts.push(page);

    // [지라 연동 수칙 매핑] [프로젝트명] 이슈 요약 명세와 서브 프리픽스 체인을 결속
    const titlePrefix = prefixParts.length ? `[${prefixParts.join('/')}] ` : '';
    const finalTitle = `[${jProject}] ${titlePrefix}${cleansedSummary || '현상을 입력하세요'}`;
    
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

    // 선택 입력 사항 유효 값 추출 파싱 스트링화
    let optBuffer = [];
    if(oPmo) optBuffer.push(`■ OY_PMO : ${oPmo}`);
    if(oOyPri) optBuffer.push(`■ OY_우선순위 : ${oOyPri}`);
    if(oGubun) optBuffer.push(`■ OY_구분 : ${oGubun}`);
    if(o30d) optBuffer.push(`■ OY_30d : ${o30d}`);
    if(oPStart) optBuffer.push(`■ Planned Start Date : ${oPStart}`);
    if(oDue) optBuffer.push(`■ Due Date : ${oDue}`);
    if(oStart) optBuffer.push(`■ Start Date : ${oStart}`);
    if(oFinish) optBuffer.push(`■ Finish Date : ${oFinish}`);
    if(oSprint) optBuffer.push(`■ Sprint : ${oSprint}`);
    if(oFixVer) optBuffer.push(`■ Fix Version/s : ${oFixVer}`);
    if(oSp) optBuffer.push(`■ Story Points : ${oSp}`);
    if(oOsp) optBuffer.push(`■ Original Story Points : ${oOsp}`);
    const optionalPartText = optBuffer.length ? `\n[JIRA Optional Fields]\n${optBuffer.join('\n')}\n` : '';

    // [Environment] 명세 규격 및 지라 요건 통합 리포팅 템플릿 완성본 조립
    const bodyText = `[JIRA Core Metadata]
■ Project : ${jProject}
■ Issue Type : ${jIssueType}
■ Component/s : ${jComponent}
■ Assignee : ${jAssignee}
■ Labels : ${jLabels}
■ Priority : ${jPriority}
■ Epic Link : ${jEpicLink}
■ Linked Issues : ${jLinkedIssues}
■ Issue (종속 스토리) : ${jIssueDep}
${optionalPartText}
[Environment]
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
