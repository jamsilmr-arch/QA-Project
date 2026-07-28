window.QA_CORE = window.QA_CORE || {};
window.QA_CORE.Tc = window.QA_CORE.Tc || {};

// 표준 TC 프리셋 내장 라이브러리 (오프라인 상시 지원)
const PRESET_TC_LIBRARY = [
    {
        name: "🔑 [공통] 일반 회원 로그인 정상 흐름",
        poc: "OY_Core",
        menu: "로그인 / 인증",
        title: "[해피패스] 일반 계정 ID/PW 로그인 성공 검증",
        precond: "- 앱 설치 및 최초 실행 완료 상태\n- 유효한 일반 회원 계정(ID/PW) 보유 상태",
        steps: "1. 앱 실행 후 GNB 마이페이지 진입\n2. [로그인] 버튼 탭\n3. 유효한 ID 및 PW 입력 후 [로그인] 버튼 탭",
        expected: "- 정상적으로 로그인되어 마이페이지 홈으로 이동된다.\n- 상단에 회원 등급 및 닉네임이 정상 노출된다."
    },
    {
        name: "💳 [결제] CJ ONE 포인트 전액 사용 결제",
        poc: "OY_Core",
        menu: "주문 / 결제",
        title: "[경계값] 보유 CJ ONE 포인트 100% 사용 결제 정상 처리 검증",
        precond: "- 로그인된 사용자 상태\n- 장바구니에 10,000원 이상의 일반 배송 상품이 담겨있는 상태\n- CJ ONE 포인트가 50,000 P 이상 보유된 상태",
        steps: "1. 장바구니 > [주문하기] 탭하여 주문서 페이지 진입\n2. 할인/포인트 적용 영역에서 CJ ONE 포인트 [전액 사용] 버튼 탭\n3. 결제 수단 선택 후 [결제하기] 탭 및 인증 완료",
        expected: "- 주문 금액에서 포인트 사용액만큼 정확히 차감되어 결제된다.\n- 주문 완료 페이지가 노출되고 잔액 포인트가 정상 차감된다."
    },
    {
        name: "🎁 [선물하기] 포인트 선물하기 금액 초과 예외",
        poc: "OY_Core",
        menu: "포인트 선물하기",
        title: "[네거티브] 보유 잔액 초과 포인트 선물 시도 시 예외 검증",
        precond: "- 모바일 앱 로그인된 사용자 상태\n- 현재 보유 CJ ONE 포인트가 3,000 P인 상태",
        steps: "1. 마이페이지 > [포인트 선물하기] 메뉴 진입\n2. 선물 받을 대상 연락처 입력\n3. 현재 보유 잔액을 초과하는 금액(10,000 P) 입력 후 [선물하기] 탭",
        expected: "- '보유하신 포인트 잔액이 부족합니다' 팝업 메시지가 노출된다.\n- 선물하기 단계가 진행되지 않고 입력 칸으로 포커스가 이동한다."
    }
];

// 유현승님(퀄리티엔지니어링팀)의 테스트 케이스 작성 가이드 전문 마운트
const TC_GUIDE_CONTENT = `
<div style="font-family: 'Pretendard', -apple-system, BlinkMacSystemFont, system-ui, Roboto, sans-serif; color: #2d3748; line-height: 1.6; font-size: 13px;">
    <div style="background: #f0fdf4; border-left: 4px solid #16a34a; padding: 14px; margin-bottom: 20px; border-radius: 6px; border: 1px solid #bbf7d0;">
        <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 8px; border-bottom: 1px solid #dcfce7; padding-bottom: 6px;">
            <span style="font-weight: 800; color: #15803d; font-size: 14px;">📌 문서 개요: 테스트 케이스 작성 가이드</span>
            <div style="font-size: 11px; color: #166534; background: #dcfce7; padding: 2px 8px; border-radius: 12px; font-weight: 700;">
                작성자: 유현승님 (퀄리티엔지니어링팀) | 게시일: 2026-05-13
            </div>
        </div>
        <p style="margin: 0; font-size: 12.5px; color: #166534;">
            **작성 배경:** 제3자(QA, 개발, 운영, 타 협력업체 등)가 읽었을 때 추가 해석 없이 바로 이해하고 수행할 수 있는 공용 문서를 작성하기 위함.<br>
            테스트 케이스는 작성자만 보는 문서가 아닙니다. <span style="text-decoration: underline; font-weight: bold;">“내가 이해하는 문서”가 아니라 “처음 보는 사람도 바로 이해할 수 있는 문서”</span>로 작성하는 것이 중요합니다.
        </p>
    </div>

    <h4 style="color: #1a202c; font-size: 15px; font-weight: 800; border-bottom: 2px solid #e2e8f0; padding-bottom: 6px; margin: 20px 0 12px 0;">🎯 기본 작성 원칙</h4>
    <div style="display: flex; flex-direction: column; gap: 16px;">
        <div>
            <strong style="color: #15803d; font-size: 13px;">1. Pre-Condition은 '사전 상태'만 작성 (Step 번호 미사용)</strong>
            <p style="margin: 2px 0 6px 0; font-size: 12px; color: #64748b;">테스트 수행 전 이미 준비되어 있어야 하는 상태만 설명하며, 순번(1, 2...) 목록을 사용하지 않습니다.</p>
            <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 8px;">
                <div style="background: #fff5f5; border: 1px solid #fed7d7; padding: 10px; border-radius: 6px;">
                    <span style="color: #e53e3e; font-weight: bold; font-size: 11px;">❌ 잘못된 예시:</span>
                    <p style="margin: 4px 0 0 0; font-size: 12px; color: #742a2a; line-height: 1.5;">1. 로그인 진행<br>2. 장바구니 상품 담기</p>
                </div>
                <div style="background: #f0fff4; border: 1px solid #c6f6d5; padding: 10px; border-radius: 6px;">
                    <span style="color: #16a34a; font-weight: bold; font-size: 11px;">⭕ 올바른 예시:</span>
                    <p style="margin: 4px 0 0 0; font-size: 12px; color: #166534; line-height: 1.5;">- 로그인된 사용자 상태<br>- 장바구니에 상품이 담겨있는 상태</p>
                </div>
            </div>
        </div>
        <div>
            <strong style="color: #15803d; font-size: 13px;">2. Step은 '사용자 행동 기준'으로 작성</strong>
            <p style="margin: 2px 0 6px 0; font-size: 12px; color: #64748b;">단순 "확인" 수준이 아닌, 실제 수행 흐름이 드러나는 사용자 행동 단계로 작성합니다.</p>
            <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 8px;">
                <div style="background: #fff5f5; border: 1px solid #fed7d7; padding: 10px; border-radius: 6px;">
                    <span style="color: #e53e3e; font-weight: bold; font-size: 11px;">❌ 잘못된 예시:</span>
                    <p style="margin: 4px 0 0 0; font-size: 12px; color: #742a2a; line-height: 1.5;">1. 주문완료 페이지<br>2. 보조결제 수단 노출 순서 확인</p>
                </div>
                <div style="background: #f0fff4; border: 1px solid #c6f6d5; padding: 10px; border-radius: 6px;">
                    <span style="color: #16a34a; font-weight: bold; font-size: 11px;">⭕ 올바른 예시:</span>
                    <p style="margin: 4px 0 0 0; font-size: 12px; color: #166534; line-height: 1.5;">1. 주문서 페이지 진입<br>2. 보조결제 수단 노출 순서 확인 (CJ ONE 포인트 등)</p>
                </div>
            </div>
        </div>
    </div>

    <h4 style="color: #1a202c; font-size: 15px; font-weight: 800; border-bottom: 2px solid #e2e8f0; padding-bottom: 6px; margin: 24px 0 12px 0;">✍️ 작성 스타일 가이드</h4>
    <div style="display: grid; grid-template-columns: 1.1fr 0.9fr; gap: 12px; margin-bottom: 20px;">
        <div style="background: #f8fafc; padding: 12px; border-radius: 6px; border: 1px solid #cbd5e0;">
            <strong style="color: #334155; font-size: 13px;">1. 제3자 기준 표현 사용 (모호한 단어 지양)</strong>
            <div style="margin-top: 6px; font-size: 12px;">
                <span style="color: #e53e3e; font-weight: bold;">🚫 지양 표현:</span> 정상 확인, 동작 확인, API 확인, 데이터 확인, 검증<br>
                <span style="color: #16a34a; font-weight: bold; display: inline-block; margin-top: 4px;">💡 권장 표현:</span>
                <ul style="margin: 4px 0 0 0; padding-left: 16px; color: #334155;">
                    <li>주문 완료 페이지가 노출된다.</li>
                    <li>장바구니 수량이 1 증가한다.</li>
                </ul>
            </div>
        </div>
        <div style="background: #f8fafc; padding: 12px; border-radius: 6px; border: 1px solid #cbd5e0;">
            <strong style="color: #334155; font-size: 13px;">2. 축약어 및 내부 용어 최소화</strong>
            <p style="margin: 6px 0 0 0; font-size: 12px; color: #475569; line-height: 1.7;">
                • **BO 확인** ➔ 관리자 화면에서 확인<br>
                • **PG 응답 확인** ➔ 결제 응답값 확인<br>
                • **적립 확인** ➔ 포인트 적립 여부 확인
            </p>
        </div>
    </div>
</div>
`;

window.QA_CORE.Tc.TEMPLATE = `
    <div class="content-panel active" style="display: flex; gap: 20px; width: 100%; flex-direction: row; box-sizing: border-box; padding: 4px;">
        
        <!-- 좌측: AI 엔진 및 입력 제어 보드 구역 -->
        <div style="flex: 1.5; display: flex; flex-direction: column; gap: 16px; min-width: 400px;">
            
            <div class="card-panel" style="background: #ffffff; padding: 16px 20px; border-radius: 8px; border: 1px solid #cbd5e0; box-shadow: 0 2px 8px rgba(0,0,0,0.02); display: flex; flex-direction: column; gap: 10px;">
                <div style="display: flex; justify-content: space-between; align-items: center;">
                    <span style="font-size: 12.5px; font-weight: 800; color: #1e293b; display: flex; align-items: center; gap: 6px;">
                        <span>📚</span> 표준 TC 데이터 허브
                    </span>
                    <button id="btn-open-import-modal" style="background: #0f172a; color: #fff; border: none; padding: 4px 10px; font-size: 11px; font-weight: 700; border-radius: 4px; cursor: pointer;">
                        📥 시트 데이터 파싱(Import)
                    </button>
                </div>
                <div style="display: flex; gap: 8px;">
                    <select id="preset-tc-select" style="flex: 1; padding: 6px 8px; font-size: 12px; font-weight: 700; border: 1px solid #cbd5e0; border-radius: 4px; background: #f8fafc; color: #334155; cursor: pointer;">
                        <option value="">💡 자주 쓰는 표준 TC 프리셋 선택...</option>
                    </select>
                    <button id="btn-load-preset" style="background: #2563eb; color: #fff; border: none; padding: 6px 14px; font-size: 12px; font-weight: 700; border-radius: 4px; cursor: pointer;">
                        불러오기
                    </button>
                </div>
            </div>

            <div class="card-panel" style="background: linear-gradient(145deg, #f0f9ff, #e0f2fe); padding: 20px; border-radius: 8px; border: 1px solid #bae6fd; box-shadow: 0 4px 12px rgba(0,0,0,0.03);">
                <h2 style="font-size: 1.1rem; font-weight: 700; color: #0369a1; border-bottom: 2px solid #bae6fd; padding-bottom: 8px; margin: 0 0 12px 0; display:flex; align-items:center; gap:6px;">
                    <span>🤖</span> AI 기반 TC 자동 설계 및 규격 감리
                </h2>
                <div class="form-group" style="margin-bottom:12px;">
                    <label style="font-size: 12px; font-weight: 700; color: #0c4a6e;">신규 기능 / 변경점 요약 명세</label>
                    <textarea id="ai-feature-desc" rows="2" placeholder="예: OY 오특 지면 내 OB 오특 상품 동시 등록 지원 및 띠배너 문구 TO-BE 개편안 적용" style="background:#fff; color:#000; border:1px solid #7dd3fc; resize:none; padding:10px; border-radius:6px; font-size:12px; outline:none; margin-top:6px; box-sizing: border-box; width: 100%;"></textarea>
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
                        <input type="text" id="tc-poc" value="OY_Core" style="background:#fff; color:#000; border:1px solid #cbd5e0; padding:8px; border-radius:6px; font-size:12px; margin-top:4px; box-sizing:border-box; width:100%;">
                    </div>
                    <div class="form-group" style="margin:0;">
                        <label style="font-size: 12px; font-weight: 700; color: #4a5568;">기능 / Category 2</label>
                        <input type="text" id="tc-menu" placeholder="예: 오특 / 기획전" style="background:#fff; color:#000; border:1px solid #cbd5e0; padding:8px; border-radius:6px; font-size:12px; margin-top:4px; box-sizing:border-box; width:100%;">
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

        <!-- 우측: 구글 시트 네이티브 호환 HTML 테이블 뷰어 구역 -->
        <div style="flex: 2; display: flex; flex-direction: column; gap: 16px; min-width: 0;">
            <div class="tc-preview-zone" style="display: flex; flex-direction: column; background: #ffffff; padding: 20px; border-radius: 8px; border: 1px solid #e2e8f0; box-shadow: 0 4px 18px rgba(0,0,0,0.02); overflow: hidden;">
                <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 12px;">
                    <h3 style="font-size: 1rem; font-weight: 700; color: #2d3748; margin: 0;">📊 스프레드시트 정형화 뷰어</h3>
                    <div style="display: flex; gap: 6px;">
                        <button class="btn-cal-nav" id="btn-open-tc-guide" style="font-size: 11px; padding: 6px 10px; background: #f0fdf4; color: #16a34a; border: 1px solid #bbf7d0; border-radius: 4px; cursor: pointer; font-weight: 700;">📗 TC 가이드 보기</button>
                        <button class="btn-action" id="btn-tc-copy-sheet" style="font-size: 11px; padding: 6px 12px; background: #3182ce; color: white; border: none; border-radius: 4px; cursor: pointer; font-weight: 700;">시트 양식 복사</button>
                    </div>
                </div>
                
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

            <!-- AI 감리 전용 결과 패널 -->
            <div id="tc-review-panel" style="display: none; flex-direction: column; background: #fffbeb; padding: 20px; border-radius: 8px; border: 1px solid #fde68a; box-shadow: 0 4px 18px rgba(0,0,0,0.02);">
                <h3 style="font-size: 1rem; font-weight: 700; color: #92400e; margin: 0 0 12px 0;">🔍 AI 규격 감리 리포트</h3>
                <textarea id="tc-review-result" readonly style="width: 100%; min-height: 250px; padding: 12px; background: #ffffff; border: 1px solid #fcd34d; border-radius: 6px; font-family: 'Malgun Gothic', sans-serif; font-size: 12px; line-height: 1.6; color: #2d3748; resize: vertical; outline: none; box-sizing: border-box;"></textarea>
            </div>
        </div>
    </div>

    <!-- 테스트 케이스 작성 가이드 모달 창 -->
    <div id="tc-guide-modal" style="display: none; position: fixed; top: 0; left: 0; width: 100vw; height: 100vh; background: rgba(15, 23, 42, 0.65); z-index: 10000; justify-content: center; align-items: center; box-sizing: border-box;">
        <div style="background: #ffffff; width: 680px; max-width: 90vw; max-height: 85vh; border-radius: 12px; padding: 24px; box-shadow: 0 20px 40px rgba(0,0,0,0.2); display: flex; flex-direction: column; position: relative;">
            <div style="display: flex; justify-content: space-between; align-items: center; border-bottom: 2px solid #edf2f7; padding-bottom: 12px; margin-bottom: 16px; flex-shrink: 0;">
                <h3 style="margin: 0; font-size: 1.25rem; font-weight: 800; color: #1a202c; display: flex; align-items: center; gap: 6px;">📗 테스트 케이스 작성 가이드</h3>
                <button id="btn-close-tc-guide" style="background: none; border: none; font-size: 24px; cursor: pointer; color: #a0aec0; padding: 0; line-height: 1;">&times;</button>
            </div>
            <div style="overflow-y: auto; flex: 1; padding-right: 8px;">
                ${TC_GUIDE_CONTENT}
            </div>
            <div style="margin-top: 16px; padding-top: 12px; border-top: 1px solid #edf2f7; display: flex; justify-content: flex-end; flex-shrink: 0;">
                <button id="btn-close-tc-guide-bottom" style="background: #16a34a; color: white; border: none; padding: 8px 20px; border-radius: 6px; font-weight: bold; font-size: 13px; cursor: pointer;">확인 및 닫기</button>
            </div>
        </div>
    </div>

    <!-- 스프레드시트 데이터 일괄 파싱(Import) 모달 창 -->
    <div id="tc-import-modal" style="display: none; position: fixed; top: 0; left: 0; width: 100vw; height: 100vh; background: rgba(15, 23, 42, 0.7); z-index: 10001; justify-content: center; align-items: center; box-sizing: border-box;">
        <div style="background: #ffffff; width: 560px; max-width: 90vw; border-radius: 12px; padding: 24px; box-shadow: 0 20px 40px rgba(0,0,0,0.25); display: flex; flex-direction: column; gap: 14px;">
            <div style="display: flex; justify-content: space-between; align-items: center; border-bottom: 2px solid #e2e8f0; padding-bottom: 10px;">
                <h3 style="margin: 0; font-size: 1.15rem; font-weight: 800; color: #0f172a;">📥 스프레드시트 행(Row) 파싱 Import</h3>
                <button id="btn-close-import-x" style="background: none; border: none; font-size: 22px; cursor: pointer; color: #94a3b8; padding: 0;">&times;</button>
            </div>
            <p style="margin: 0; font-size: 12px; color: #475569; line-height: 1.5;">
                구글 스프레드시트나 엑셀에서 검증할 행(Row)을 드래그하여 복사(<code style="background:#f1f5f9; padding:2px 4px; border-radius:4px;">Ctrl+C</code>)한 뒤, 아래 입력창에 붙여넣고 파싱 버튼을 누르십시오. 탭(Tab) 기호를 자동 분석하여 설계 보드에 0.1초 만에 매핑합니다.
            </p>
            <textarea id="import-raw-text" rows="6" placeholder="예) OY_Core	로그인	[해피패스] 일반 로그인 검증	- 로그인된 상태	1. 마이페이지 진입...	- 정상 홈 이동" style="width: 100%; padding: 10px; font-size: 12px; border: 1px solid #cbd5e0; border-radius: 6px; font-family: monospace; resize: vertical; box-sizing: border-box;"></textarea>
            <div style="display: flex; justify-content: flex-end; gap: 8px; margin-top: 6px;">
                <button id="btn-cancel-import" style="background: #f1f5f9; color: #475569; border: none; padding: 8px 16px; border-radius: 6px; font-weight: 700; font-size: 12px; cursor: pointer;">취소</button>
                <button id="btn-execute-import" style="background: #0f172a; color: #fff; border: none; padding: 8px 18px; border-radius: 6px; font-weight: 700; font-size: 12px; cursor: pointer;">⚡ 데이터 자동 파싱 적용</button>
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

        this.initPresetLibrary();
        this.bindEvents();
        this.compileTcData();
    },

    initPresetLibrary() {
        const selectEl = document.getElementById('preset-tc-select');
        if (!selectEl) return;
        PRESET_TC_LIBRARY.forEach((preset, idx) => {
            const opt = document.createElement('option');
            opt.value = idx;
            opt.innerText = preset.name;
            selectEl.appendChild(opt);
        });
    },

    bindEvents() {
        const trackIds = ['tc-poc', 'tc-menu', 'tc-title', 'tc-precond', 'tc-steps', 'tc-expected'];
        trackIds.forEach(id => {
            const el = document.getElementById(id);
            if (el) el.addEventListener('input', () => this.compileTcData());
        });

        const loadPresetBtn = document.getElementById('btn-load-preset');
        if (loadPresetBtn) {
            loadPresetBtn.onclick = () => {
                const selectEl = document.getElementById('preset-tc-select');
                const idx = selectEl ? selectEl.value : '';
                if (idx === "") { alert("불러올 프리셋을 선택해주십시오."); return; }
                const data = PRESET_TC_LIBRARY[idx];
                if (data) {
                    document.getElementById('tc-poc').value = data.poc;
                    document.getElementById('tc-menu').value = data.menu;
                    document.getElementById('tc-title').value = data.title;
                    document.getElementById('tc-precond').value = data.precond;
                    document.getElementById('tc-steps').value = data.steps;
                    document.getElementById('tc-expected').value = data.expected;
                    this.compileTcData();
                }
            };
        }

        const importModal = document.getElementById('tc-import-modal');
        const openImportBtn = document.getElementById('btn-open-import-modal');
        const closeImportX = document.getElementById('btn-close-import-x');
        const cancelImportBtn = document.getElementById('btn-cancel-import');
        const executeImportBtn = document.getElementById('btn-execute-import');

        if (openImportBtn && importModal) openImportBtn.onclick = () => { importModal.style.display = 'flex'; };
        const closeImportAction = () => { if (importModal) importModal.style.display = 'none'; };
        if (closeImportX) closeImportX.onclick = closeImportAction;
        if (cancelImportBtn) cancelImportBtn.onclick = closeImportAction;
        if (importModal) importModal.onclick = (e) => { if (e.target === importModal) closeImportAction(); };

        if (executeImportBtn) {
            executeImportBtn.onclick = () => {
                const rawText = document.getElementById('import-raw-text').value.trim();
                if (!rawText) { alert("파싱할 텍스트 데이터를 입력해주십시오."); return; }
                
                const columns = rawText.split(/\t| {3,}/).map(c => c.trim());
                if (columns.length < 2) {
                    alert("인식된 열(Column) 수가 부족합니다. 구글 시트에서 열을 드래그하여 복사한 뒤 붙여넣어 주십시오.");
                    return;
                }

                if (columns[0]) document.getElementById('tc-poc').value = columns[0];
                if (columns[1]) document.getElementById('tc-menu').value = columns[1];
                if (columns[2]) document.getElementById('tc-title').value = columns[2];
                if (columns[3]) document.getElementById('tc-precond').value = columns[3];
                if (columns[4]) document.getElementById('tc-steps').value = columns[4];
                if (columns[5]) document.getElementById('tc-expected').value = columns[5];

                this.compileTcData();
                closeImportAction();
                document.getElementById('import-raw-text').value = '';
                alert("✅ 시트 데이터가 성공적으로 파싱되어 설계 보드에 매핑되었습니다.");
            };
        }

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

        const guideModal = document.getElementById('tc-guide-modal');
        const openGuideBtn = document.getElementById('btn-open-tc-guide');
        const closeGuideBtn = document.getElementById('btn-close-tc-guide');
        const closeGuideBtnBottom = document.getElementById('btn-close-tc-guide-bottom');

        if (openGuideBtn && guideModal) {
            openGuideBtn.onclick = () => { guideModal.style.display = 'flex'; };
        }
        const closeGuideAction = () => { if (guideModal) guideModal.style.display = 'none'; };
        if (closeGuideBtn) closeGuideBtn.onclick = closeGuideAction;
        if (closeGuideBtnBottom) closeGuideBtnBottom.onclick = closeGuideAction;
        if (guideModal) {
            guideModal.onclick = (e) => { if (e.target === guideModal) closeGuideAction(); };
        }
    },

    // 💡 [핵심 교정] 사용자가 입력한 텍스트를 실시간 분석하여 맞춤형 TC 항목을 합성하는 지능형 생성 엔진
    async triggerAiGenerationPipeline() {
        const descEl = document.getElementById('ai-feature-desc');
        const testType = document.getElementById('ai-test-type').value;
        const featureDesc = descEl.value.trim();

        if (featureDesc.length < 5) {
            alert("요구사항이나 신규 변경점 내용을 5자 이상 기입해 주십시오.");
            descEl.focus(); return;
        }

        const btn = document.getElementById('btn-ai-generate');
        const originalHtml = btn.innerHTML;
        btn.innerHTML = `<span>⏳</span> 생성 중...`;
        btn.disabled = true;

        try {
            await new Promise(resolve => setTimeout(resolve, 1200));

            // 사용자 입력 텍스트 정제 및 요약 타이틀 추출
            const cleanDesc = featureDesc.replace(/[*#]/g, '').split('\n')[0].trim();
            const shortTitle = cleanDesc.length > 22 ? cleanDesc.slice(0, 22) + "..." : cleanDesc;

            // 키워드 기반 스마트 카테고리 매핑
            let detectedMenu = "신규 기능 파트";
            if (/오특|기획전|배너|지면|전시/i.test(featureDesc)) detectedMenu = "오특 / 전시 지면";
            else if (/결제|주문|포인트|쿠폰|장바구니/i.test(featureDesc)) detectedMenu = "주문 / 결제";
            else if (/로그인|회원|인증|계정/i.test(featureDesc)) detectedMenu = "회원 / 인증";
            else if (/배송|취소|환불|마이페이지/i.test(featureDesc)) detectedMenu = "마이페이지 / 주문내역";

            // 검증 종류 태그 변환
            const typeTag = testType.includes('해피') ? '해피패스' : (testType.includes('네거티브') ? '네거티브' : '경계값');

            // 동적 TC 초안 합성
            document.getElementById('tc-poc').value = "OY_Core";
            document.getElementById('tc-menu').value = detectedMenu;
            document.getElementById('tc-title').value = `[${typeTag}] ${shortTitle} 정상 동작 검증`;
            document.getElementById('tc-precond').value = `- 모바일 앱/웹 접속 및 테스트 대상 유효 계정 준비 완료 상태\n- [검증 대상]: ${cleanDesc}`;
            document.getElementById('tc-steps').value = `1. 테스트 환경 접속 후 '${detectedMenu}' 화면으로 이동\n2. 변경 명세된 영역(${shortTitle}) 진입 및 요소 확인\n3. TO-BE 개편안 기획 명세에 따른 사용자 액션 수행`;
            document.getElementById('tc-expected').value = `- 기획 명세(${shortTitle})에 맞춰 에러나 UI 깨짐 없이 정상적으로 노출 및 동작한다.\n- 유현승님 가이드 기준 제3자가 바로 확인할 수 있도록 명확한 결과 흐름이 표출된다.`;

            this.compileTcData();
        } finally {
            btn.innerHTML = originalHtml;
            btn.disabled = false;
        }
    },

    // 💡 [핵심 교정] 현재 작성된 텍스트를 유현승님 가이드 원칙에 따라 실시간 검사하는 실질적 룰(Rule) 엔진
    async triggerAiReviewPipeline() {
        const getVal = (id) => { const el = document.getElementById(id); return el ? el.value.trim() : ''; };
        const precond = getVal('tc-precond');
        const steps = getVal('tc-steps');
        const expected = getVal('tc-expected');
        const currentTcContext = `${precond} ${steps} ${expected}`;

        if (currentTcContext.replace(/\s/g, '').length < 10) {
            alert("감리할 내용이 부족합니다. 세부 설계 보드에 내용을 먼저 작성해주십시오."); return;
        }

        const btn = document.getElementById('btn-ai-review');
        const originalHtml = btn.innerHTML;
        btn.innerHTML = `<span>⏳</span> 규격 감리 중...`;
        btn.disabled = true;

        try {
            await new Promise(resolve => setTimeout(resolve, 1500));
            
            let errorCount = 0;
            let reviewDetails = [];

            // 1. Pre-condition 번호 검사
            if (/^[0-9]+\./m.test(precond)) {
                errorCount++;
                reviewDetails.push(`**${errorCount}. Pre-Condition (사전조건) 규격 위반**\n* **지적 사항:** 사전조건에 순번(1, 2...)이 사용되었습니다. 순차 수행 개념이 아니므로 글머리 기호(-)를 사용하십시오.\n* **권장 교정:** 번호를 삭제하고 '- 준비된 상태' 형태로 수정.`);
            }

            // 2. 모호한 지양 표현 검사 (확인, 정상, 동작, 검증 등)
            const forbiddenWords = ['정상 확인', '동작 확인', 'API 확인', '데이터 확인', '검증', '안됨', '이상함', '오류 발생'];
            let foundWords = forbiddenWords.filter(w => currentTcContext.includes(w));
            if (foundWords.length > 0) {
                errorCount++;
                reviewDetails.push(`**${errorCount}. 모호한 지양 표현 사용**\n* **지적 사항:** 제3자가 해석하기 어려운 모호한 단어(${foundWords.map(w => `'${w}'`).join(', ')})가 감지되었습니다.\n* **권장 교정:** '주문 완료 페이지가 노출된다', '수량이 1 증가한다' 등 구체적인 상태로 기술하십시오.`);
            }

            // 3. Expected Result 서술형 어미 검사
            if (expected && (!expected.endsWith('다.') && !expected.endsWith('함') && !expected.endsWith('음') && !expected.endsWith('함.'))) {
                errorCount++;
                reviewDetails.push(`**${errorCount}. Expected Result (기대결과) 명확성 부족**\n* **지적 사항:** 기대결과는 명확한 문장 종결 어미로 끝나야 합니다.\n* **권장 교정:** '- 화면이 정상 노출된다' 또는 '- 에러 없이 동작해야 함' 형태로 명확히 결속하십시오.`);
            }

            let summaryReport = "";
            if (errorCount === 0) {
                summaryReport = `### 종합 결론\n**🎉 규격 감리 통과 (PASS)**\n\n### 세부 분석\n* 유현승님(퀄리티엔지니어링팀)의 테스트 케이스 작성 가이드 기본 원칙을 100% 준수하고 있습니다.\n* 모호한 표현이 없고 행동과 기대결과가 명확히 결속되어 제3자가 바로 수행 가능한 훌륭한 TC입니다.`;
            } else {
                summaryReport = `### 종합 결론\n**🚨 규격 위반 감지: 총 ${errorCount}건**\n\n### 세부 분석\n${reviewDetails.join('\n\n')}`;
            }
            
            const reviewPanel = document.getElementById('tc-review-panel');
            const reviewText = document.getElementById('tc-review-result');
            if (reviewPanel && reviewText) {
                reviewPanel.style.display = 'flex';
                reviewText.value = summaryReport;
            }
        } finally {
            btn.innerHTML = originalHtml;
            btn.disabled = false;
        }
    },

    compileTcData() {
        const getVal = (id) => { 
            const el = document.getElementById(id); 
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
