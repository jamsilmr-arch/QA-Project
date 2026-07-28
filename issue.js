window.QA_CORE = window.QA_CORE || {};
window.QA_CORE.Issue = window.QA_CORE.Issue || {};

// 유현승님(퀄리티엔지니어링팀)의 Jira 이슈 등록 가이드 모달 콘텐츠 (유지)
const JIRA_GUIDE_CONTENT = `
<div style="font-family: 'Pretendard', -apple-system, BlinkMacSystemFont, system-ui, Roboto, sans-serif; color: #2d3748; line-height: 1.6; font-size: 13px;">
    <div style="background: #ebf8ff; border-left: 4px solid #3182ce; padding: 14px; margin-bottom: 20px; border-radius: 6px; border: 1px solid #bee3f8;">
        <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 8px; border-bottom: 1px solid #bfdbfe; padding-bottom: 6px;">
            <span style="font-weight: 800; color: #1e3a8a; font-size: 14px;">📌 문서 개요: Jira 이슈 등록 가이드</span>
            <div style="font-size: 11px; color: #1d4ed8; background: #dbeafe; padding: 2px 8px; border-radius: 12px; font-weight: 700;">
                작성자: 유현승님 (퀄리티엔지니어링팀) | 게시일: 2026-05-14
            </div>
        </div>
        <p style="margin: 0; font-size: 12.5px; color: #1e40af;">
            **작성 배경:** 개발자, QA, 기획자, 운영 담당자 간 공용 커뮤니케이션 문서로서, 처음 보는 사람도 추가 문의 없이 즉시 이해할 수 있도록 이슈 등록 품질을 향상하기 위함.<br>
            이슈 등록은 단순 보고가 아닙니다. <span style="text-decoration: underline; font-weight: bold;">“내가 이해하는 내용”이 아니라 “처음 보는 사람도 바로 이해 가능한 내용”</span>으로 작성하는 것이 중요합니다.
        </p>
    </div>

    <h4 style="color: #1a202c; font-size: 15px; font-weight: 800; border-bottom: 2px solid #e2e8f0; padding-bottom: 6px; margin: 20px 0 12px 0;">🎯 기본 작성 원칙</h4>
    <div style="margin-bottom: 20px;">
        <strong style="color: #1e3a8a; font-size: 13px;">• 제목만 보고도 어떤 이슈인지 즉시 이해 가능해야 함</strong>
        <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 8px; margin-top: 8px;">
            <div style="background: #fff5f5; border: 1px solid #fed7d7; padding: 10px; border-radius: 6px;">
                <span style="color: #e53e3e; font-weight: bold; font-size: 11px;">❌ 잘못된 예시 (모호함):</span>
                <p style="margin: 4px 0 0 0; font-size: 12px; color: #742a2a; line-height: 1.5;">• 팝업 이상<br>• 회원등급 오류<br>• 안보임<br>• 위치 다름</p>
            </div>
            <div style="background: #f0fff4; border: 1px solid #c6f6d5; padding: 10px; border-radius: 6px;">
                <span style="color: #16a34a; font-weight: bold; font-size: 11px;">⭕ 올바른 예시 (명확함):</span>
                <p style="margin: 4px 0 0 0; font-size: 12px; color: #166534; line-height: 1.5;">• 포인트 사용 팝업에서 CJONE 회원 등급 위치가 올리브영 회원 등급과 반대로 노출됨</p>
            </div>
        </div>
    </div>

    <h4 style="color: #1a202c; font-size: 15px; font-weight: 800; border-bottom: 2px solid #e2e8f0; padding-bottom: 6px; margin: 20px 0 12px 0;">📝 Description 작성 구조 및 가이드</h4>
    <div style="background: #f1f5f9; padding: 10px 14px; border: 1px solid #cbd5e0; border-radius: 6px; font-weight: 800; color: #1e293b; margin-bottom: 16px; text-align: center; font-size: 12.5px;">
        👉 핵심 작성 영역: [테스트 환경] ➔ [재현절차] ➔ [실제결과] ➔ [기대결과]
    </div>

    <div style="display: flex; flex-direction: column; gap: 16px;">
        <div>
            <strong style="color: #1e3a8a; font-size: 13px;">1. 테스트 환경 (구체적 기재)</strong>
            <p style="margin: 2px 0 6px 0; font-size: 12px; color: #64748b;">개발자가 동일 환경에서 즉시 재현할 수 있도록 필수 정보(서버, 플랫폼, 앱 버전, 단말 정보)를 명시합니다.</p>
            <div style="background: #f8fafc; padding: 10px; border-radius: 6px; font-size: 12px; border: 1px solid #e2e8f0; line-height: 1.6;">
                <span style="color: #e53e3e; font-weight: bold;">❌ 잘못된 예시:</span> QA에서 발생 → 어떤 환경인지 부족함<br>
                <span style="color: #16a34a; font-weight: bold;">⭕ 올바른 예시:</span> [테스트 환경] • 서버 : PRD • 플랫폼 : APP • APP버전 : AND - 마켓버전 (3.53.0) • 테스트 단말 정보 : 갤럭시 S25 Ultra
            </div>
        </div>
        <div>
            <strong style="color: #1e3a8a; font-size: 13px;">2. 재현절차 (사용자 행동 흐름 기준)</strong>
            <p style="margin: 2px 0 6px 0; font-size: 12px; color: #64748b;">무엇을 누르고 어떤 행동을 했는지 실제 사용자 흐름 기준으로 명확히 명시합니다.</p>
            <div style="background: #f8fafc; padding: 10px; border-radius: 6px; font-size: 12px; border: 1px solid #e2e8f0; line-height: 1.6;">
                <span style="color: #e53e3e; font-weight: bold;">❌ 잘못된 예시:</span> 팝업 확인 ➔ 등급 확인 (행동 불명확)<br>
                <span style="color: #16a34a; font-weight: bold;">⭕ 올바른 예시:</span> 1. 베러 홈 > 임의의 카테고리 퀵메뉴 탭 > 네비게이션바 영역 [베러홈] 탭 반복
            </div>
        </div>
        <div>
            <strong style="color: #1e3a8a; font-size: 13px;">3. 실제결과 vs 기대결과</strong>
            <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 8px; margin-top: 6px;">
                <div style="background: #fff5f5; border: 1px solid #fed7d7; padding: 10px; border-radius: 6px;">
                    <span style="color: #e53e3e; font-weight: bold; font-size: 11px;">❌ 잘못된 예시:</span>
                    <p style="margin: 4px 0 0 0; font-size: 12px; color: #742a2a; line-height: 1.5;">• [실제결과] 비정상 노출, 이상함<br>• [기대결과] 정상 노출</p>
                </div>
                <div style="background: #f0fff4; border: 1px solid #c6f6d5; padding: 10px; border-radius: 6px;">
                    <span style="color: #16a34a; font-weight: bold; font-size: 11px;">⭕ 올바른 예시:</span>
                    <p style="margin: 4px 0 0 0; font-size: 12px; color: #166534; line-height: 1.5;">• [실제결과] 앱 크래시 발생됨<br>• [기대결과] 앱 크래시가 발생하지 않고 정상 동작해야 함</p>
                </div>
            </div>
        </div>
    </div>

    <h4 style="color: #1a202c; font-size: 15px; font-weight: 800; border-bottom: 2px solid #e2e8f0; padding-bottom: 6px; margin: 24px 0 12px 0;">✍️ 권장 작성 스타일</h4>
    <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 12px; margin-bottom: 20px;">
        <div style="background: #fff5f5; padding: 12px; border-radius: 6px; border: 1px solid #fed7d7;">
            <strong style="color: #c53030; font-size: 12px;">🚫 지양 표현 (모호한 단어)</strong>
            <ul style="margin: 6px 0 0 0; padding-left: 16px; font-size: 12px; color: #742a2a; line-height: 1.6;">
                <li>확인, 정상, 이상, 오류</li>
                <li>안됨, 다름, 위치 다름</li>
            </ul>
        </div>
        <div style="background: #f0fff4; padding: 12px; border-radius: 6px; border: 1px solid #c6f6d5;">
            <strong style="color: #16a34a; font-size: 12px;">💡 권장 표현 (구체적 상태 서술)</strong>
            <ul style="margin: 6px 0 0 0; padding-left: 16px; font-size: 12px; color: #166534; line-height: 1.6;">
                <li>팝업이 노출되지 않음</li>
                <li>버튼 선택 시 앱이 종료됨</li>
                <li>할인 금액이 0원으로 계산됨</li>
                <li>회원 등급 영역 순서가 반대로 노출됨</li>
            </ul>
        </div>
    </div>
</div>
`;

// [초경량 슬림화] 불필요한 메타데이터 전면 삭제 및 요청한 핵심 4대 구역 단독 구성
window.QA_CORE.Issue.TEMPLATE = `
    <div class="content-panel active" style="display: flex; gap: 20px; width: 100%; flex-direction: row; box-sizing: border-box; padding: 4px;">
        
        <!-- 중앙 메인 빌더: 담당자/보고자, 제목, 4대 본문 구역 -->
        <div class="main-builder-zone" style="flex: 2; display: flex; flex-direction: column; gap: 16px; min-width: 0;">
            <div class="card-panel layout-vertical" style="background:#ffffff; padding:20px; border-radius:8px; border:1px solid #e2e8f0; display:flex; flex-direction:column; gap:16px;">
                
                <!-- 상단 헤더 & 프리셋 제어 -->
                <div style="display: flex; justify-content: space-between; align-items: center; border-bottom:1px solid #edf2f7; padding-bottom:12px;">
                    <h2 style="font-size: 1.2rem; font-weight: 800; color:#1e293b; margin:0; display:flex; align-items:center; gap:6px;">
                        <span>📝</span> Jira 이슈 핵심 작성 보드
                    </h2>
                    <div class="preset-group" style="display: flex; gap: 6px;">
                        <select id="preset-select" style="padding: 4px 8px; font-size: 12px; width: 120px; border-radius:4px; border:1px solid #cbd5e0; background:#fff; color:#000; font-weight:600;">
                            <option value="">💾 프리셋 선택...</option>
                        </select>
                        <input type="text" id="preset-name-input" placeholder="프리셋명 입력" style="width: 100px; padding: 4px 6px; font-size: 12px; border-radius:4px; border:1px solid #cbd5e0; background:#fff; color:#000;">
                        <button class="btn-cal-nav" id="btn-preset-save" style="font-size:12px; padding:4px 8px; font-weight:700;">저장</button>
                        <button class="btn-preset-delete" id="btn-preset-delete" style="font-size:12px; padding:4px 8px; background:#fff0f2; color:#e53e3e; border-color:#fed7d7; font-weight:700;">삭제</button>
                    </div>
                </div>

                <!-- 1. 담당자 & 보고자 정보 (드롭다운 & 고정값 반영) -->
                <div style="background:#f8fafc; border:1px solid #cbd5e0; padding:14px; border-radius:6px; display:grid; grid-template-columns: 1fr 1fr; gap:12px;">
                    <div>
                        <label style="font-size:12px; font-weight:700; color:#1e293b; display:block; margin-bottom:4px;">👤 담당자 (Assignee)</label>
                        <select id="jira-assignee" style="width:100%; padding:8px; font-size:12.5px; font-weight:600; border:1px solid #cbd5e0; border-radius:4px; background:#fff; color:#000; box-sizing:border-box; cursor:pointer;">
                            <option value="이종하(Jongha Lee)_웰니스서비스개발팀(Wellness Dev)">이종하(Jongha Lee)_웰니스서비스개발팀(Wellness Dev)</option>
                            <option value="유준성(JoonSeong You)_웰니스서비스개발팀(Wellness Dev)">유준성(JoonSeong You)_웰니스서비스개발팀(Wellness Dev)</option>
                        </select>
                    </div>
                    <div>
                        <label style="font-size:12px; font-weight:700; color:#1e293b; display:block; margin-bottom:4px;">📢 보고자 (Reporter)</label>
                        <input type="text" id="jira-reporter" value="박준혁님 퀄리티엔지니어링팀_파트너" readonly style="width:100%; padding:8px; font-size:12.5px; font-weight:700; border:1px solid #cbd5e0; border-radius:4px; background:#e2e8f0; color:#475569; box-sizing:border-box; cursor:not-allowed;">
                    </div>
                </div>

                <!-- 2. 이슈 제목 (AND/iOS 단 2개 옵션 압축) -->
                <div style="background:#f0f9ff; border:1px solid #bae6fd; padding:14px; border-radius:6px;">
                    <label style="font-size:12px; font-weight:800; color:#0369a1; display:block; margin-bottom:6px;">📌 이슈 제목 (Title)</label>
                    <div style="display:flex; gap:8px;">
                        <select id="title-os-prefix" style="width:100px; padding:8px; font-size:12.5px; font-weight:800; border:1px solid #7dd3fc; border-radius:4px; background:#fff; color:#0c4a6e; cursor:pointer;">
                            <option value="AND">[AND]</option>
                            <option value="iOS">[iOS]</option>
                        </select>
                        <input type="text" id="issue-summary" placeholder="베러 홈 > 카테고리 퀵메뉴 탭 > 네비게이션바 영역 [베러홈] 탭 반복 시 앱 크래시 발생하는 현상" style="flex:1; padding:8px 10px; font-size:13px; font-weight:700; border:1px solid #7dd3fc; border-radius:4px; background:#fff; color:#000; box-sizing:border-box;">
                    </div>
                </div>

                <!-- 3. 본문 4대 핵심 구역 (테스트 환경, 재현절차, 실제결과, 기대결과) -->
                <div class="layout-vertical" style="gap:16px; margin-top:4px;">
                    
                    <!-- ① [테스트 환경] -->
                    <div style="border:1px solid #e2e8f0; padding:14px; border-radius:6px; background:#fff;">
                        <label style="font-weight:800; font-size:13px; color:#1e293b; display:block; margin-bottom:8px;">1. [테스트 환경]</label>
                        <div style="display:grid; grid-template-columns: 1fr 1fr; gap:10px;">
                            <div>
                                <span style="font-size:11px; color:#64748b; font-weight:700;">• 서버</span>
                                <input type="text" id="env-server" value="PRD" placeholder="예: PRD / STG / QA" style="width:100%; padding:6px 8px; font-size:12px; border:1px solid #cbd5e0; border-radius:4px; margin-top:2px; background:#fff; color:#000; box-sizing:border-box;">
                            </div>
                            <div>
                                <span style="font-size:11px; color:#64748b; font-weight:700;">• 플랫폼</span>
                                <input type="text" id="env-platform" value="APP" placeholder="예: APP / WEB / PC" style="width:100%; padding:6px 8px; font-size:12px; border:1px solid #cbd5e0; border-radius:4px; margin-top:2px; background:#fff; color:#000; box-sizing:border-box;">
                            </div>
                            <div>
                                <span style="font-size:11px; color:#64748b; font-weight:700;">• APP버전</span>
                                <input type="text" id="env-version" value="AND - 마켓버전 (3.53.0)" placeholder="예: AND - 마켓버전 (3.53.0)" style="width:100%; padding:6px 8px; font-size:12px; border:1px solid #cbd5e0; border-radius:4px; margin-top:2px; background:#fff; color:#000; box-sizing:border-box;">
                            </div>
                            <div>
                                <span style="font-size:11px; color:#64748b; font-weight:700;">• 테스트 단말 정보</span>
                                <select id="env-device" style="width:100%; padding:6px 8px; font-size:12px; font-weight:600; border:1px solid #cbd5e0; border-radius:4px; margin-top:2px; background:#fff; color:#000; box-sizing:border-box; cursor:pointer;">
                                    <option value="갤럭시 S25 Ultra">갤럭시 S25 Ultra</option>
                                    <option value="iPhone 11">iPhone 11</option>
                                </select>
                            </div>
                        </div>
                    </div>

                    <!-- ② [재현절차] -->
                    <div style="border:1px solid #e2e8f0; padding:14px; border-radius:6px; background:#fff;">
                        <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:6px;">
                            <label style="font-weight:800; font-size:13px; color:#1e293b;">2. [재현절차]</label>
                            <div>
                                <button class="btn-cal-nav" id="add-step-btn" style="font-size:11px; padding:2px 8px; background:#e0f2fe; color:#0284c7; border-color:#bae6fd; font-weight:700;">STEP +</button>
                                <button class="btn-cal-nav" id="reset-step-btn" style="font-size:11px; padding:2px 8px;">초기화</button>
                            </div>
                        </div>
                        <textarea id="section-steps" rows="3" placeholder="1. 베러 홈 > 임의의 카테고리 퀵메뉴 탭 > 네비게이션바 영역 [베러홈] 탭 반복" style="width:100%; padding:8px; font-size:12.5px; border:1px solid #cbd5e0; border-radius:4px; resize:vertical; background:#fff; color:#000; line-height:1.5; box-sizing:border-box;"></textarea>
                    </div>

                    <!-- ③ [실제결과] -->
                    <div style="border:1px solid #e2e8f0; padding:14px; border-radius:6px; background:#fff;">
                        <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:6px;">
                            <label style="font-weight:800; font-size:13px; color:#e53e3e;">3. [실제결과]</label>
                            <div>
                                <button class="btn-cal-nav" id="add-result-btn" style="font-size:11px; padding:2px 8px; background:#fee2e2; color:#dc2626; border-color:#fecaca; font-weight:700;">CASE +</button>
                                <button class="btn-cal-nav" id="reset-result-btn" style="font-size:11px; padding:2px 8px;">초기화</button>
                            </div>
                        </div>
                        <textarea id="section-error" rows="2" placeholder="• 앱 크래시 발생됨" style="width:100%; padding:8px; font-size:12.5px; border:1px solid #cbd5e0; border-radius:4px; resize:vertical; background:#fff; color:#000; line-height:1.5; box-sizing:border-box;"></textarea>
                    </div>

                    <!-- ④ [기대결과] -->
                    <div style="border:1px solid #e2e8f0; padding:14px; border-radius:6px; background:#fff;">
                        <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:6px;">
                            <label style="font-weight:800; font-size:13px; color:#16a34a;">4. [기대결과]</label>
                            <div>
                                <button class="btn-cal-nav" id="add-expect-btn" style="font-size:11px; padding:2px 8px; background:#dcfce7; color:#16a34a; border-color:#bbf7d0; font-weight:700;">CASE +</button>
                                <button class="btn-cal-nav" id="reset-expect-btn" style="font-size:11px; padding:2px 8px;">초기화</button>
                            </div>
                        </div>
                        <textarea id="section-expect" rows="2" placeholder="• 앱 크래시가 발생하지 않고 정상 동작해야 함" style="width:100%; padding:8px; font-size:12.5px; border:1px solid #cbd5e0; border-radius:4px; resize:vertical; background:#fff; color:#000; line-height:1.5; box-sizing:border-box;"></textarea>
                    </div>

                </div>
            </div>
        </div>

        <!-- 우측: 리포트 결과 프리뷰 파트 -->
        <div class="report-preview-zone" style="width: 340px; flex-shrink: 0; display: flex; flex-direction: column; gap: 16px;">
            <div class="card-panel layout-vertical" style="height: 100%; min-height: 600px; background: #f8fafc; padding:20px; border-radius:8px; border:1px solid #e2e8f0; display:flex; flex-direction:column; gap:14px;">
                
                <div style="display: flex; justify-content: space-between; align-items: center;">
                    <h2 style="font-size: 1.1rem; font-weight: 800; color:#1a202c; margin:0;">📄 리포트 결과</h2>
                    <div style="display: flex; gap: 6px;">
                        <button class="btn-cal-nav" id="btn-open-jira-guide" style="font-size:11px; padding:4px 8px; background:#ebf8ff; color:#3182ce; border-color:#bee3f8; font-weight:700;">📘 가이드</button>
                        <button class="btn-cal-nav" id="btn-report-clear" style="font-size:11px; padding:4px 8px;">🔄 새로 작성</button>
                    </div>
                </div>

                <!-- 담당자 & 보고자 확인용 대시보드 -->
                <div style="background:#ffffff; border:1px solid #cbd5e0; padding:10px; border-radius:6px; font-size:12px;">
                    <div style="color:#64748b; margin-bottom:4px;">👤 <b>담당자:</b> <span id="display-assignee" style="color:#1e293b; font-weight:bold;">-</span></div>
                    <div style="color:#64748b;">📢 <b>보고자:</b> <span id="display-reporter" style="color:#1e293b; font-weight:bold;">-</span></div>
                </div>

                <!-- 이슈 제목 (Title) -->
                <div class="form-group">
                    <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom:4px;">
                        <label style="font-weight:800; font-size:12px; color:#0369a1;">📌 제목 (Title)</label>
                        <button class="btn-action" id="btn-copy-title" style="font-size:11px; padding:4px 10px; background:#0284c7; color:white; border:none; border-radius:4px; font-weight:700; cursor:pointer;">제목 복사</button>
                    </div>
                    <div id="display-title-result" style="background:#fff; border:1px solid #cbd5e0; padding:12px; border-radius:6px; min-height:36px; font-size:12.5px; font-weight:700; word-break:break-all; color:#1e293b;"></div>
                </div>

                <!-- 이슈 본문 (Description) -->
                <div class="form-group" style="flex: 1; display: flex; flex-direction: column;">
                    <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom:4px;">
                        <label style="font-weight:800; font-size:12px; color:#1e293b;">📝 본문 (Description)</label>
                        <button class="btn-action" id="btn-copy-desc" style="font-size:11px; padding:4px 10px; background:#0f172a; color:white; border:none; border-radius:4px; font-weight:700; cursor:pointer;">본문 복사</button>
                    </div>
                    <textarea id="display-desc-result" readonly style="background:#fff; border:1px solid #cbd5e0; padding:14px; border-radius:6px; flex:1; font-family:'Courier New', monospace; font-size:12px; line-height:1.6; color:#1e293b; resize:none; outline:none; box-sizing:border-box;"></textarea>
                </div>

            </div>
        </div>
    </div>

    <!-- Jira 이슈 등록 가이드 모달 창 -->
    <div id="jira-guide-modal" style="display: none; position: fixed; top: 0; left: 0; width: 100vw; height: 100vh; background: rgba(15, 23, 42, 0.65); z-index: 10000; justify-content: center; align-items: center; box-sizing: border-box;">
        <div style="background: #ffffff; width: 680px; max-width: 90vw; max-height: 85vh; border-radius: 12px; padding: 24px; box-shadow: 0 20px 40px rgba(0,0,0,0.2); display: flex; flex-direction: column; position: relative;">
            <div style="display: flex; justify-content: space-between; align-items: center; border-bottom: 2px solid #edf2f7; padding-bottom: 12px; margin-bottom: 16px; flex-shrink: 0;">
                <h3 style="margin: 0; font-size: 1.25rem; font-weight: 800; color: #1a202c; display: flex; align-items: center; gap: 6px;">📘 Jira 이슈 등록 가이드</h3>
                <button id="btn-close-jira-guide" style="background: none; border: none; font-size: 24px; cursor: pointer; color: #a0aec0; padding: 0; line-height: 1;">&times;</button>
            </div>
            <div style="overflow-y: auto; flex: 1; padding-right: 8px;">
                ${JIRA_GUIDE_CONTENT}
            </div>
            <div style="margin-top: 16px; padding-top: 12px; border-top: 1px solid #edf2f7; display: flex; justify-content: flex-end; flex-shrink: 0;">
                <button id="btn-close-jira-guide-bottom" style="background: #3182ce; color: white; border: none; padding: 8px 20px; border-radius: 6px; font-weight: bold; font-size: 13px; cursor: pointer;">확인 및 닫기</button>
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
    const inputs = [
        'jira-assignee', 'jira-reporter',
        'title-os-prefix', 'issue-summary',
        'env-server', 'env-platform', 'env-version', 'env-device',
        'section-steps', 'section-error', 'section-expect'
    ];

    inputs.forEach(id => {
        const el = document.getElementById(id);
        if (el) {
            el.addEventListener('input', compileReportData);
            el.addEventListener('change', compileReportData);
        }
    });

    setupCaseAppendTrigger('add-step-btn', 'section-steps', '', true);
    setupCaseAppendTrigger('add-result-btn', 'section-error', '• ');
    setupCaseAppendTrigger('add-expect-btn', 'section-expect', '• ');

    setupFieldResetTrigger('reset-step-btn', 'section-steps');
    setupFieldResetTrigger('reset-result-btn', 'section-error');
    setupFieldResetTrigger('reset-expect-btn', 'section-expect');

    setupClipboardCopyTrigger('btn-copy-title', () => document.getElementById('display-title-result').innerText);
    setupClipboardCopyTrigger('btn-copy-desc', () => document.getElementById('display-desc-result').value);

    // 가이드 모달 바인딩
    const guideModal = document.getElementById('jira-guide-modal');
    const openGuideBtn = document.getElementById('btn-open-jira-guide');
    const closeGuideBtn = document.getElementById('btn-close-jira-guide');
    const closeGuideBtnBottom = document.getElementById('btn-close-jira-guide-bottom');

    if (openGuideBtn && guideModal) {
        openGuideBtn.onclick = () => { guideModal.style.display = 'flex'; };
    }
    const closeGuideAction = () => { if (guideModal) guideModal.style.display = 'none'; };
    if (closeGuideBtn) closeGuideBtn.onclick = closeGuideAction;
    if (closeGuideBtnBottom) closeGuideBtnBottom.onclick = closeGuideAction;
    if (guideModal) {
        guideModal.onclick = (e) => { if (e.target === guideModal) closeGuideAction(); };
    }

    // 새로 작성 (초기화) 바인딩
    const clearBtn = document.getElementById('btn-report-clear');
    if (clearBtn) {
        clearBtn.addEventListener('click', () => {
            if (!confirm("작성 중인 이슈 내용을 모두 지우고 새로 작성하시겠습니까?")) return;
            inputs.forEach(id => { 
                const el = document.getElementById(id); 
                if (el) {
                    if (id === 'jira-assignee') el.value = '이종하(Jongha Lee)_웰니스서비스개발팀(Wellness Dev)';
                    else if (id === 'jira-reporter') el.value = '박준혁님 퀄리티엔지니어링팀_파트너';
                    else if (id === 'env-server') el.value = 'PRD';
                    else if (id === 'env-platform') el.value = 'APP';
                    else if (id === 'env-version') el.value = 'AND - 마켓버전 (3.53.0)';
                    else if (id === 'env-device') el.value = '갤럭시 S25 Ultra';
                    else if (id === 'title-os-prefix') el.value = 'AND';
                    else el.value = '';
                }
            });
            compileReportData();
        });
    }

    compileReportData();
}

function compileReportData() {
    const getVal = (id) => { const el = document.getElementById(id); return el ? el.value.trim() : ''; };
    
    // 1. 담당자 & 보고자 대시보드 동기화
    const assignee = getVal('jira-assignee') || "미지정";
    const reporter = getVal('jira-reporter') || "미지정";
    const dispAssignee = document.getElementById('display-assignee');
    const dispReporter = document.getElementById('display-reporter');
    if (dispAssignee) dispAssignee.innerText = assignee;
    if (dispReporter) dispReporter.innerText = reporter;

    // 2. 이슈 제목 조합 (AND/iOS)
    const osPrefix = getVal('title-os-prefix');
    const summary = getVal('issue-summary');
    const titlePrefixStr = osPrefix ? `[${osPrefix}] ` : '';
    const finalTitle = `${titlePrefixStr}${summary || '현상을 입력하세요'}`;
    
    const titleDisplay = document.getElementById('display-title-result');
    if (titleDisplay) titleDisplay.innerText = finalTitle;

    // 3. 본문 4대 핵심 구역 조합
    const srv = getVal('env-server') || '-';
    const plt = getVal('env-platform') || '-';
    const ver = getVal('env-version') || '-';
    const dev = getVal('env-device') || '-';
    const steps = getVal('section-steps') || '1. 베러 홈 > 임의의 카테고리 퀵메뉴 탭 > 네비게이션바 영역 [베러홈] 탭 반복';
    const actual = getVal('section-error') || '• 앱 크래시 발생됨';
    const expect = getVal('section-expect') || '• 앱 크래시가 발생하지 않고 정상 동작해야 함';

    const bodyText = `[테스트 환경]

• 서버 : ${srv}
• 플랫폼 : ${plt}
• APP버전 : ${ver}
• 테스트 단말 정보 : ${dev}


[재현절차]

${steps}


[실제결과]

${actual}


[기대결과]

${expect}`;

    const descDisplay = document.getElementById('display-desc-result');
    if (descDisplay) descDisplay.value = bodyText;
}

// 절차(numbered list)와 결과(bullet point)를 지능적으로 구분하는 텍스트 추가 트리거
function setupCaseAppendTrigger(btnId, targetId, prefixText, isNumbered = false) {
    const btn = document.getElementById(btnId);
    if (btn) {
        btn.onclick = () => {
            const tx = document.getElementById(targetId);
            if (!tx) return;
            const lines = tx.value.split('\n').filter(l => l.trim());
            let appendStr = '';
            if (isNumbered) {
                appendStr = `${lines.length + 1}. `;
            } else {
                appendStr = `${prefixText}`;
            }
            tx.value += (tx.value ? '\n' : '') + appendStr;
            tx.dispatchEvent(new Event('input'));
            tx.focus();
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
                    alert("✅ 클립보드에 복사되었습니다.");
                }
            });
        };
    }
}
