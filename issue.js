window.QA_CORE = window.QA_CORE || {};
window.QA_CORE.Issue = window.QA_CORE.Issue || {};

// 제공된 Jira 이슈 등록 가이드 전체 텍스트 상자 (마크다운 스타일 모달 변환)
const JIRA_GUIDE_CONTENT = `
<div style="font-family: 'Pretendard', -apple-system, BlinkMacSystemFont, system-ui, Roboto, sans-serif; color: #2d3748; line-height: 1.6; font-size: 13px;">
    <div style="background: #ebf8ff; border-left: 4px solid #3182ce; padding: 12px; margin-bottom: 16px; border-radius: 4px;">
        <h4 style="margin: 0 0 6px 0; color: #2b6cb0; font-size: 14px; font-weight: 700;">📌 작성 배경</h4>
        <p style="margin: 0 0 6px 0;">최근 등록되는 Jira 이슈 중 아래와 같은 사례가 반복적으로 확인되고 있습니다.</p>
        <ul style="margin: 0; padding-left: 20px; color: #4a5568;">
            <li>어떤 환경에서 발생한 이슈인지 알기 어렵다.</li>
            <li>재현 절차가 너무 간단하거나 생략되어 있다.</li>
            <li>“안됨”, “이상함”, “다름” 수준으로 작성되어 원인 파악이 어렵다.</li>
            <li>실제 결과와 기대 결과의 차이가 명확하지 않다.</li>
            <li>작성자만 이해 가능한 표현이나 내부 용어가 많다.</li>
        </ul>
        <p style="margin: 8px 0 0 0; font-weight: bold; color: #2c5282;">이슈 등록은 단순 보고가 아니라, 개발자 / QA / 기획자 / 운영 담당자가 함께 보는 공용 커뮤니케이션 문서입니다.<br>따라서 “내가 이해하는 내용”이 아니라 “처음 보는 사람도 바로 이해 가능한 내용”으로 작성하는 것이 중요합니다.</p>
    </div>

    <h4 style="color: #1a202c; font-size: 15px; font-weight: 700; border-bottom: 2px solid #e2e8f0; padding-bottom: 6px; margin: 20px 0 10px 0;">🎯 Jira 이슈 작성 기본 원칙</h4>
    <div style="margin-bottom: 16px;">
        <strong style="color: #2d3748;">1. 제목만 보고도 어떤 이슈인지 이해 필요</strong>
        <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 8px; margin-top: 6px;">
            <div style="background: #fff5f5; border: 1px solid #fed7d7; padding: 8px; border-radius: 4px;">
                <span style="color: #e53e3e; font-weight: bold;">❌ 잘못된 예시:</span>
                <p style="margin: 4px 0 0 0; font-size: 12px; color: #742a2a;">• 팝업 이상<br>• 회원등급 오류<br>• 안보임<br>• 위치 다름</p>
            </div>
            <div style="background: #f0fff4; border: 1px solid #c6f6d5; padding: 8px; border-radius: 4px;">
                <span style="color: #38a169; font-weight: bold;">⭕ 올바른 예시:</span>
                <p style="margin: 4px 0 0 0; font-size: 12px; color: #22543d;">• 포인트 사용 팝업에서 CJONE 회원 등급 위치가 올리브영 회원 등급과 반대로 노출됨</p>
            </div>
        </div>
    </div>

    <h4 style="color: #1a202c; font-size: 15px; font-weight: 700; border-bottom: 2px solid #e2e8f0; padding-bottom: 6px; margin: 20px 0 10px 0;">📝 Description 작성 가이드</h4>
    <p style="background: #f7fafc; padding: 8px 12px; border: 1px solid #cbd5e0; border-radius: 4px; font-weight: bold; color: #2d3748;">
        👉 작성 순서: [테스트 환경] → [테스트 데이터] → [사전조건] → [재현절차] → [실제결과] → [기대결과]
    </p>

    <div style="display: flex; flex-direction: column; gap: 14px; margin-top: 12px;">
        <div>
            <strong style="color: #2b6cb0;">1. 테스트 환경은 구체적으로 작성</strong>
            <p style="margin: 2px 0 4px 0; font-size: 12px; color: #718096;">개발자는 동일 환경에서 재현 가능해야 합니다. (서버/STG/QA 여부, 플랫폼, 앱 버전, OS 정보 최소 포함)</p>
            <div style="background: #f8fafc; padding: 8px; border-radius: 4px; font-size: 12px; border: 1px solid #e2e8f0;">
                <span style="color: #e53e3e;">❌ 잘못된 예시:</span> QA에서 발생 → 어떤 환경인지 부족함<br>
                <span style="color: #38a169; font-weight: bold;">⭕ 올바른 예시:</span> [테스트 환경] 서버: QA / 플랫폼: APP / OS 버전: iOS 26 / APP 버전: v3.48.0(202604291359) / 테스트 단말 정보: iPhone17
            </div>
        </div>

        <div>
            <strong style="color: #2b6cb0;">2. 테스트 데이터는 실제 사용 데이터로 작성</strong>
            <p style="margin: 2px 0 4px 0; font-size: 12px; color: #718096;">“정상 회원”, “임의 데이터” 수준으로 작성하면 재현 시 혼선이 발생할 수 있습니다. (※ 개인정보/민감정보 제외)</p>
            <div style="background: #f8fafc; padding: 8px; border-radius: 4px; font-size: 12px; border: 1px solid #e2e8f0;">
                <span style="color: #e53e3e;">❌ 잘못된 예시:</span> 일반 회원, 상품 사용<br>
                <span style="color: #38a169; font-weight: bold;">⭕ 올바른 예시:</span> [테스트 데이터] Green 등급 일반 회원 / 상품명: 올리브영 마스크팩 (A272677112) / 주문번호: Y202605130001
            </div>
        </div>

        <div>
            <strong style="color: #2b6cb0;">3. 사전조건은 “이미 준비된 상태”만 작성</strong>
            <p style="margin: 2px 0 4px 0; font-size: 12px; color: #718096;">사전조건은 재현을 위한 준비 상태입니다. Step처럼 수행 절차를 작성하지 않습니다.</p>
            <div style="background: #f8fafc; padding: 8px; border-radius: 4px; font-size: 12px; border: 1px solid #e2e8f0;">
                <span style="color: #e53e3e;">❌ 잘못된 예시:</span> 회원 로그인 → 상품 스캔 → 포인트 입력<br>
                <span style="color: #38a169; font-weight: bold;">⭕ 올바른 예시:</span> [사전조건] 일반 회원으로 로그인된 상태 / 포인트 사용 가능한 회원 상태 / 상품 구매가 완료된 상태
            </div>
        </div>

        <div>
            <strong style="color: #2b6cb0;">4. 재현절차는 실제 사용자 행동 흐름 기준으로 작성</strong>
            <p style="margin: 2px 0 4px 0; font-size: 12px; color: #718096;">재현절차는 “무엇을 눌렀고 어떤 행동을 했는지”가 명확히 보여야 합니다.</p>
            <div style="background: #f8fafc; padding: 8px; border-radius: 4px; font-size: 12px; border: 1px solid #e2e8f0;">
                <span style="color: #e53e3e;">❌ 잘못된 예시:</span> 팝업 확인 → 등급 확인<br>
                <span style="color: #38a169; font-weight: bold;">⭕ 올바른 예시:</span> [재현절차] 1. 포인트 사용 버튼을 선택한다 2. 포인트 사용 팝업을 노출한다 3. 회원 등급 영역을 확인한다
            </div>
        </div>

        <div>
            <strong style="color: #2b6cb0;">5. 실제결과는 “현재 어떻게 보이는지”를 작성</strong>
            <div style="background: #f8fafc; padding: 8px; border-radius: 4px; font-size: 12px; border: 1px solid #e2e8f0; margin-top: 4px;">
                <span style="color: #e53e3e;">❌ 잘못된 예시:</span> 비정상 노출, 위치 이상<br>
                <span style="color: #38a169; font-weight: bold;">⭕ 올바른 예시:</span> [실제결과] 올리브영 회원 등급과 CJONE 등급 위치가 서로 반대로 노출됨
            </div>
        </div>

        <div>
            <strong style="color: #2b6cb0;">6. 기대결과는 “원래 어떻게 보여야 하는지”를 작성</strong>
            <div style="background: #f8fafc; padding: 8px; border-radius: 4px; font-size: 12px; border: 1px solid #e2e8f0; margin-top: 4px;">
                <span style="color: #e53e3e;">❌ 잘못된 예시:</span> [기대결과] 정상 노출<br>
                <span style="color: #38a169; font-weight: bold;">⭕ 올바른 예시:</span> [기대결과] 올리브영 회원 등급과 CJONE 등급 위치가 정상 순서로 노출되어야 함
            </div>
        </div>
    </div>

    <h4 style="color: #1a202c; font-size: 15px; font-weight: 700; border-bottom: 2px solid #e2e8f0; padding-bottom: 6px; margin: 20px 0 10px 0;">🚨 작성 시 자주 보이는 문제 사례 & 권장 작성 스타일</h4>
    <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 10px; margin-bottom: 16px;">
        <div style="background: #fff5f5; padding: 10px; border-radius: 6px; border: 1px solid #fed7d7;">
            <strong style="color: #c53030; font-size: 12px;">🚫 지양 표현 (모호함)</strong>
            <ul style="margin: 6px 0 0 0; padding-left: 16px; font-size: 12px; color: #742a2a;">
                <li>**정상 확인**: 무엇을 확인했는지 모름</li>
                <li>**안됨**: 어떤 동작이 실패했는지 모름</li>
                <li>**오류 발생**: 오류 메시지/행동 없음</li>
                <li>**이상함**: 기준이 없음</li>
                <li>**위치 다름**: 어떤 위치가 어떻게 다른지 모름</li>
            </ul>
        </div>
        <div style="background: #f0fff4; padding: 10px; border-radius: 6px; border: 1px solid #c6f6d5;">
            <strong style="color: #276749; font-size: 12px;">💡 권장 표현 (구체적 명세)</strong>
            <ul style="margin: 6px 0 0 0; padding-left: 16px; font-size: 12px; color: #22543d;">
                <li>팝업이 노출되지 않음</li>
                <li>버튼 선택 시 앱이 종료됨</li>
                <li>주문완료 페이지로 이동하지 않음</li>
                <li>할인 금액이 0원으로 계산됨</li>
                <li>회원 등급 영역 순서가 반대로 노출됨</li>
            </ul>
        </div>
    </div>

    <h4 style="color: #1a202c; font-size: 15px; font-weight: 700; border-bottom: 2px solid #e2e8f0; padding-bottom: 6px; margin: 20px 0 10px 0;">✨ Before / After 비교 예시</h4>
    <div style="display: flex; flex-direction: column; gap: 10px;">
        <div style="background: #fff5f5; border: 1px solid #feb2b2; padding: 12px; border-radius: 6px; font-size: 12px;">
            <span style="background: #e53e3e; color: white; font-weight: bold; padding: 2px 6px; border-radius: 4px; font-size: 11px;">Before (개선 전)</span>
            <p style="margin: 6px 0 4px 0; font-weight: bold; color: #742a2a;">제목: [PC] 올리브포인트 잔액 수동 조회 및 포인트 점검 상태에서 조회 버튼 클릭 시 점검 팝업 미노출 현상</p>
            <p style="margin: 0; color: #4a5568;">
                **[테스트 환경]** 서버 : QA0 / 플랫폼 : PC<br>
                **[테스트 데이터]** 올리브 포인트 수동 조회 오픈 ON 상태에서 포인트 점검 중 올리브 포인트 조회 클릭시 점검 팝업 미노출<br>
                **[사전조건]** 올리브포인트 점검 상태 - 올리브 포인트 수동 조회 오픈(2081)ON<br>
                **[재현절차]** 주문서 진입 -> [조회] 클릭<br>
                **[실제결과]** 올리브 포인트 점검 팝업 미노출<br>
                **[기대결과]** 올리브 포인트 점검 팝업 노출
            </p>
        </div>

        <div style="background: #f0fff4; border: 1px solid #9ae6b4; padding: 12px; border-radius: 6px; font-size: 12px;">
            <span style="background: #38a169; color: white; font-weight: bold; padding: 2px 6px; border-radius: 4px; font-size: 11px;">After (개선 후)</span>
            <p style="margin: 6px 0 4px 0; font-weight: bold; color: #22543d;">제목: [PC] 포인트 점검 상태에서 올리브 포인트 조회 시 점검 팝업이 노출되지 않음</p>
            <p style="margin: 0; color: #2d3748;">
                **[테스트 환경]** 서버 : QA0 / 플랫폼 : PC<br>
                **[테스트 데이터]** 올리브 포인트 수동 조회 오픈(2081) : ON<br>
                **[사전조건]** 올리브 포인트 점검 상태 / 포인트 조회 가능한 회원으로 로그인된 상태<br>
                **[재현절차]** 1. 주문서 화면으로 진입한다 2. 올리브 포인트 조회 버튼을 클릭한다 3. 포인트 조회 결과를 확인한다<br>
                **[실제결과]** 포인트 점검 상태임에도 점검 안내 팝업이 노출되지 않음 / 포인트 조회 화면이 정상적으로 진행됨<br>
                **[기대결과]** 포인트 점검 상태일 경우 점검 안내 팝업이 노출되어야 함 / 포인트 조회가 제한되어야 함
            </p>
        </div>
    </div>
</div>
`;

// JIRA 등록 규칙을 완벽히 수렴한 반응형 레이아웃 마크업
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
                
                <!-- 프리셋 관리 헤더 인터페이스 -->
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

                <!-- JIRA 규격 필수 마운트 컴포넌트 그룹 -->
                <div style="background:#fff5f5; border:1px solid #fed7d7; padding:16px; border-radius:8px; display:flex; flex-direction:column; gap:12px; margin-bottom:10px;">
                    <span style="font-size:13px; font-weight:700; color:#c53030; display:flex; align-items:center; gap:4px;">🔴 JIRA 필수 지정 대시보드 메타 필드</span>
                    <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 12px;">
                        <div class="form-group" style="margin:0;">
                            <label style="font-size:11px; font-weight:700; color:#4a5568;">Project *</label>
                            <!-- 💡 [수정] T 멤버십 삭제 처리 -->
                            <select id="jira-project" style="padding:6px; font-size:12px; border:1px solid #cbd5e0; border-radius:4px; background:#fff; color:#000; font-weight:600;">
                                <option value="">프로젝트 선택</option>
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

                <!-- 제목 Prefix 상세 조건 카드 판넬 -->
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
                            <!-- 💡 [수정] AOS -> AND 변경 -->
                            <select id="prefix-os" style="background:#fff; color:#000;">
                                <option value="해당없음">해당없음</option><option value="AND">AND</option><option value="iOS">iOS</option>
                            </select></div>
                        <div class="form-group"><label style="font-size:11px;">PoC <span style="float:right; color:#adb5bd;">3</span></label>
                            <!-- 💡 [수정] T 멤버십 삭제 및 기본 설정 조정 -->
                            <select id="prefix-poc" style="background:#fff; color:#000;"><option value="OY_Core">OY_Core</option><option value="기타">기타</option></select></div>
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
                        <!-- 💡 [수정] AOS -> AND 변경 -->
                        <label style="font-weight:normal; font-size:12px; color:#000;"><input type="checkbox" class="ver-chk" value="AND"> AND</label>
                        <label style="font-weight:normal; font-size:12px; color:#000;"><input type="checkbox" class="ver-chk" value="iOS"> iOS</label>
                        <label style="font-weight:normal; font-size:12px; color:#000;"><input type="checkbox" class="ver-chk" value="삼성인터넷"> 삼성인터넷</label>
                        <label style="font-weight:normal; font-size:12px; color:#000;"><input type="checkbox" class="ver-chk" value="Safari"> Safari</label>
                        <label style="font-weight:normal; font-size:12px; color:#000;"><input type="checkbox" class="ver-chk" value="Chrome"> Chrome</label>
                        <label style="font-weight:normal; font-size:12px; color:#000;"><input type="checkbox" class="ver-chk" value="Edge"> Edge</label>
                    </div>
                    <input type="text" id="issue-version-text" placeholder="상세 버전을 입력하세요 (선택)" style="margin-top:6px; padding:6px; background:#fff; color:#000;">
                </div>

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

                <!-- JIRA 선택 입력 사항 아코디언 컴포넌트 -->
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

        <!-- 우측: 리포트 결과 프리뷰 파트 -->
        <div class="report-preview-zone" style="width: 320px; flex-shrink: 0; display: flex; flex-direction: column; gap: 20px;">
            <div class="card-panel layout-vertical" style="height: 100%; min-height: 600px; background: #f8fafc; padding:20px; border-radius:8px; border:1px solid #e2e8f0; display:flex; flex-direction:column;">
                <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 15px;">
                    <h2 style="font-size: 1.1rem; font-weight: 700; color:#1a202c; margin:0;">📄 리포트 결과</h2>
                    <div style="display: flex; gap: 6px;">
                        <button class="btn-cal-nav" id="btn-open-jira-guide" style="font-size:11px; padding:4px 8px; background:#ebf8ff; color:#3182ce; border-color:#bee3f8; font-weight:700;">📘 가이드 보기</button>
                        <button class="btn-cal-nav" id="btn-report-clear" style="font-size:11px; padding:4px 8px;">🔄 새로 작성</button>
                    </div>
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

    <!-- Jira 이슈 등록 가이드 모달 창 (Viewport 중앙 고정) -->
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

    const labelField = document.getElementById('jira-labels');
    if (labelField) {
        labelField.addEventListener('input', (e) => {
            e.target.value = e.target.value.replace(/\s+/g, '');
            compileReportData();
        });
    }

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

    // Jira 이슈 등록 가이드 모달 제어 핸들러 바인딩
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

function compileReportData() {
    const getVal = (id) => { const el = document.getElementById(id); return el ? el.value.trim() : ''; };
    
    const jProject = getVal('jira-project') || "미선택";
    const jIssueType = getVal('jira-issuetype') || "Defect";
    const jComponent = getVal('jira-component') || "-";
    const jAssignee = getVal('jira-assignee') || "-";
    const jLabels = getVal('jira-labels') || "없음";
    const jPriority = getVal('jira-priority') || "Major";
    const jEpicLink = getVal('issue-epic-link') || "없음";
    const jLinkedIssues = getVal('jira-linkedissues');
    const jIssueDep = getVal('jira-issue-dep') || "-";

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

    const env = getVal('prefix-env');
    const os = getVal('prefix-os');
    // 💡 [수정] T 멤버십 제거 및 기본 Fallback 값을 '기타'로 변경
    const poc = getVal('prefix-poc') || '기타';
    const critical = getVal('prefix-critical');
    const account = getVal('prefix-account');
    const page = getVal('prefix-page');
    const summary = getVal('issue-summary');

    const cleansedSummary = summary.replace(/^\[.*?\]\s*/, '');

    let prefixParts = [];
    if (env) prefixParts.push(env);
    if (os && os !== '해당없음') prefixParts.push(os);
    if (poc) prefixParts.push(poc);
    if (critical && critical !== '해당없음') prefixParts.push(critical);
    if (account) prefixParts.push(account);
    if (page) prefixParts.push(page);

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

    let oBuffer = [];
    if(oPmo) oBuffer.push(`■ OY_PMO : ${oPmo}`);
    if(oOyPri) oBuffer.push(`■ OY_우선순위 : ${oOyPri}`);
    if(oGubun) oBuffer.push(`■ OY_구분 : ${oGubun}`);
    if(o30d) oBuffer.push(`■ OY_30d : ${o30d}`);
    if(oPStart) oBuffer.push(`■ Planned Start Date : ${oPStart}`);
    if(oDue) oBuffer.push(`■ Due Date : ${oDue}`);
    if(oStart) oBuffer.push(`■ Start Date : ${oStart}`);
    if(oFinish) oBuffer.push(`■ Finish Date : ${oFinish}`);
    if(oSprint) oBuffer.push(`■ Sprint : ${oSprint}`);
    if(oFixVer) oBuffer.push(`■ Fix Version/s : ${oFixVer}`);
    if(oSp) oBuffer.push(`■ Story Points : ${oSp}`);
    if(oOsp) oBuffer.push(`■ Original Story Points : ${oOsp}`);
    const optionalPartText = oBuffer.length ? `\n[JIRA Optional Fields]\n${oBuffer.join('\n')}\n` : '';

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

// 돔 조작 유틸리티 함수 3종
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
                }
            });
        };
    }
}
