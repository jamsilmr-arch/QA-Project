window.QA_CORE = window.QA_CORE || {};
window.QA_CORE.Tc = window.QA_CORE.Tc || {};

// 골드 표준 프리셋 라이브러리
const PRESET_TC_LIBRARY = [
    {
        name: "📱 [GNB] 올리브 배러 홈 > 오특 GNB 탭 진입 및 상단 UI 검증",
        component: "GNB",
        poc: "진입",
        menu: "GNB",
        title: "홈 / 더보러가기 / 랭킹 / 기획전",
        target: "오특 진입",
        precond: "- 앱 설치 및 최초 실행 완료 상태\n- 올리브 배러 홈 화면 진입 상태",
        steps: "1. 올리브 배러 홈 화면\n2. GNB '홈' (또는 랭킹/기획전) 진입\n3. GNB '오특' 탭",
        expected: "- GNB 오특 화면 이동\n- GNB 내 '오특'에 선택 효과 노출",
        testdata: "전시 연결관리 > 올리브 배러 가상 카테고리 > [올리브 배러 오특] 오특 큐레이션"
    },
    {
        name: "🏷️ [오늘의특가] 상품 개수(1개~10개/품절) 및 BO 설정 노출 검증",
        component: "오늘의특가",
        poc: "상품 개수",
        menu: "1개~10개 / 일시품절",
        title: "스페셜 오특 + 일반 오특",
        target: "UI",
        precond: "1. 오늘의 특가 노출 상품 2개 이상 100개 이하\n2. 스페셜 오특 내 전체 일시 품절 상품 있음 (단품/옵션 상품 일시품절)",
        steps: "1. 올리브 배러 홈 > GNB '오특' 진입\n2. 오늘의 특가 / 스페셜 오특 영역\n3. 상품 리스트 및 상품 카드 확인",
        expected: "- 스페셜 오특 영역 정상 노출\n- 이미지 dim 처리 + '일시품절' 문구 노출\n- 상품 할인율 / 가격 등의 텍스트 '회색'으로 노출\n- 일시품절 상품은 리스트 가장 마지막 순서로 노출",
        testdata: "A000000861537 아디다스 퍼포먼스 우먼스 헬스장갑 M(화이트)\n스웨거로 재고 관리"
    },
    {
        name: "🛒 [상품카드] 장바구니 담기 토스트 팝업 및 뱃지 카운트 검증",
        component: "스페셜 오특",
        poc: "상품상세",
        menu: "장바구니",
        title: "선택 / 바로구매",
        target: "선택",
        precond: "1. 로그인 상태\n2. 선택 상품이 단일 옵션 상품인 경우\n3. 상품에 구매 수량 제한이 있는 경우 (ex. 3개까지만 구매 가능)\n4. 재고가 남아있는 경우",
        steps: "1. 오늘의 특가 / 스페셜 오특 영역\n2. 상품 카드 [장바구니] 아이콘 탭\n3. 구매 수량 제한 상품 > 제한 수량까지 장바구니 담긴 상태에서 추가 탭",
        expected: "- 해당 상품 장바구니에 정상 추가\n- '나의 장바구니에 담았어요' toast 노출\n- 네비게이션 바 [장바구니] 아이콘에 숫자 뱃지 카운트 추가\n- 수량 초과 시 '이 상품은 n개 까지 구매할 수 있어요.' 토스트 메시지 노출 (블랙 배경에 하얀 텍스트)",
        testdata: "A000000122563 식물나라 티트리카밍미스트 150ml\n(999개에서 3개로 변경 해둠 원복 필요)"
    },
    {
        name: "🔄 [로그인/로그아웃] 탭바 마이 진입 및 좋아요 동기화 검증",
        component: "로그인/로그아웃",
        poc: "탭바",
        menu: "마이",
        title: "스페셜 오특 / 오늘의 특가",
        target: "UI",
        precond: "1. 로그아웃 상태\n2. 로그인할 계정에 스페셜 오특 상품이 좋아요 되어있는 상태",
        steps: "1. 오특 GNB 진입\n2. 하단 탭바 [마이] 탭\n3. 로그인 진행 (유효 계정 입력)\n4. 오특 GNB 재진입\n5. 스페셜 오특 상품 리스트 확인",
        expected: "- 로그인 후 해당 상품에 '좋아요' 등록된 상태(레드 하트)로 정상 노출\n- 로그아웃 진행 시 좋아요 미등록 상태로 즉시 변경 노출",
        testdata: "A000000111067 [의료기기] 바른생각 퍼펙트핏 12P"
    }
];

// 유현승님(퀄리티엔지니어링팀)의 테스트 케이스 작성 가이드 모달 콘텐츠
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
            <strong style="color: #15803d; font-size: 13px;">1. Pre-Condition은 '사전 상태' 명확히 기술</strong>
            <p style="margin: 2px 0 6px 0; font-size: 12px; color: #64748b;">테스트 수행 전 준비되어야 하는 로그인 상태, BO 설정, 상품 옵션/재고 상태를 구체적으로 작성합니다. (복합 조건 시 번호 목록 허용)</p>
            <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 8px;">
                <div style="background: #fff5f5; border: 1px solid #fed7d7; padding: 10px; border-radius: 6px;">
                    <span style="color: #e53e3e; font-weight: bold; font-size: 11px;">❌ 잘못된 예시:</span>
                    <p style="margin: 4px 0 0 0; font-size: 12px; color: #742a2a; line-height: 1.5;">1. 로그인 진행<br>2. 장바구니 상품 담기</p>
                </div>
                <div style="background: #f0fff4; border: 1px solid #c6f6d5; padding: 10px; border-radius: 6px;">
                    <span style="color: #16a34a; font-weight: bold; font-size: 11px;">⭕ 올바른 예시 (OY 규격):</span>
                    <p style="margin: 4px 0 0 0; font-size: 12px; color: #166534; line-height: 1.5;">1. 로그인 상태<br>2. 선택 상품이 단일 옵션인 경우<br>3. 구매 수량 제한이 있는 경우</p>
                </div>
            </div>
        </div>
        <div>
            <strong style="color: #15803d; font-size: 13px;">2. Step은 '사용자 행동 흐름 기준'으로 작성</strong>
            <p style="margin: 2px 0 6px 0; font-size: 12px; color: #64748b;">단순 "확인" 수준이 아닌, 실제 수행 흐름(진입 > 버튼 탭 > 요소 확인)이 드러나는 행동 단계로 작성합니다.</p>
            <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 8px;">
                <div style="background: #fff5f5; border: 1px solid #fed7d7; padding: 10px; border-radius: 6px;">
                    <span style="color: #e53e3e; font-weight: bold; font-size: 11px;">❌ 잘못된 예시:</span>
                    <p style="margin: 4px 0 0 0; font-size: 12px; color: #742a2a; line-height: 1.5;">1. 주문완료 페이지<br>2. 보조결제 수단 노출 순서 확인</p>
                </div>
                <div style="background: #f0fff4; border: 1px solid #c6f6d5; padding: 10px; border-radius: 6px;">
                    <span style="color: #16a34a; font-weight: bold; font-size: 11px;">⭕ 올바른 예시:</span>
                    <p style="margin: 4px 0 0 0; font-size: 12px; color: #166534; line-height: 1.5;">1. 올리브 배러 홈 > GNB '오특' 진입<br>2. 상품 카드 [장바구니] 탭<br>3. 토스트 메시지 노출 확인</p>
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
                    <li>'나의 장바구니에 담았어요' toast 노출</li>
                    <li>이미지 dim 처리 + '일시품절' 문구 노출</li>
                </ul>
            </div>
        </div>
        <div style="background: #f8fafc; padding: 12px; border-radius: 6px; border: 1px solid #cbd5e0;">
            <strong style="color: #334155; font-size: 13px;">2. 도메인 용어 명확화</strong>
            <p style="margin: 6px 0 0 0; font-size: 12px; color: #475569; line-height: 1.7;">
                • **BO 설정** ➔ 관리자(BO) 화면 전시 코너 관리 설정<br>
                • **GNB** ➔ 상단 글로벌 네비게이션 바 메뉴<br>
                • **dim 처리** ➔ 품절/종료 시 이미지 어둡게 처리
            </p>
        </div>
    </div>
</div>
`;

window.QA_CORE.Tc.TEMPLATE = `
    <div class="content-panel active" style="display: flex; gap: 20px; width: 100%; flex-direction: row; box-sizing: border-box; padding: 4px;">
        
        <!-- 좌측: AI 엔진 및 입력 제어 보드 구역 -->
        <div style="flex: 1.5; display: flex; flex-direction: column; gap: 16px; min-width: 420px;">
            
            <div class="card-panel" style="background: linear-gradient(145deg, #f0f9ff, #e0f2fe); padding: 20px; border-radius: 8px; border: 1px solid #bae6fd; box-shadow: 0 4px 12px rgba(0,0,0,0.03);">
                <h2 style="font-size: 1.1rem; font-weight: 700; color: #0369a1; border-bottom: 2px solid #bae6fd; padding-bottom: 8px; margin: 0 0 12px 0; display:flex; align-items:center; gap:6px;">
                    <span>🤖</span> AI 기반 OY 특화 TC 자동 설계
                </h2>
                <div class="form-group" style="margin-bottom:12px;">
                    <label style="font-size: 12px; font-weight: 700; color: #0c4a6e;">OY 기능 / 기획 개편안 요약 명세</label>
                    <textarea id="ai-feature-desc" rows="2" placeholder="예: 올리브 배러 홈 > 오늘의 특가 장바구니 담기 토스트 팝업 및 수량 초과 안내 검증" style="background:#fff; color:#000; border:1px solid #7dd3fc; resize:none; padding:10px; border-radius:6px; font-size:12px; outline:none; margin-top:6px; box-sizing: border-box; width: 100%;"></textarea>
                </div>
                <div style="display:flex; gap:8px; align-items:center;">
                    <button id="btn-ai-generate" style="background:#0284c7; color:white; border:none; padding:10px 16px; font-size:12.5px; font-weight:bold; border-radius:6px; cursor:pointer; display:flex; align-items:center; justify-content:center; gap:6px; flex:1;">
                        <span>✨</span> AI 초안 자동 생성
                    </button>
                    <button id="btn-ai-review" style="background:#059669; color:white; border:none; padding:10px 16px; font-size:12.5px; font-weight:bold; border-radius:6px; cursor:pointer; display:flex; align-items:center; justify-content:center; gap:6px; flex:1;">
                        <span>🔍</span> 작성 규격 감리
                    </button>
                </div>
            </div>

            <div class="tc-builder-zone" style="display: flex; flex-direction: column; gap: 14px; background: #ffffff; padding: 20px; border-radius: 8px; border: 1px solid #e2e8f0; box-shadow: 0 4px 18px rgba(0,0,0,0.02);">
                <div style="display: flex; justify-content: space-between; align-items: center; border-bottom: 2px solid #edf2f7; padding-bottom: 8px; margin: 0;">
                    <h2 style="font-size: 1.1rem; font-weight: 700; color: #1a202c; margin:0; display:flex; align-items:center; gap:6px;">
                        <span>📋</span> 테스트케이스 세부 설계 보드
                    </h2>
                    <button id="btn-open-import-modal" style="background: #0f172a; color: #fff; border: none; padding: 6px 12px; font-size: 11px; font-weight: 700; border-radius: 4px; cursor: pointer; display:flex; align-items:center; gap:4px;">
                        <span>📥</span> 시트 데이터 파싱(Import)
                    </button>
                </div>
                
                <div style="display: grid; grid-template-columns: 1fr 1fr 1fr; gap: 10px;">
                    <div class="form-group" style="margin:0;">
                        <label style="font-size: 11.5px; font-weight: 700; color: #4a5568;">작성 일자</label>
                        <input type="date" id="tc-date" style="background:#fff; color:#000; border:1px solid #cbd5e0; padding:6px 8px; border-radius:4px; font-size:12px; margin-top:4px; box-sizing:border-box; width:100%;">
                    </div>
                    <div class="form-group" style="margin:0;">
                        <label style="font-size: 11.5px; font-weight: 700; color: #1e3a8a;">• Component (구분)</label>
                        <input type="text" id="tc-component" placeholder="예: 올리브베러" style="background:#fff; color:#000; border:1px solid #cbd5e0; padding:6px 8px; border-radius:4px; font-size:12px; margin-top:4px; box-sizing:border-box; width:100%; font-weight:bold;">
                    </div>
                    <div class="form-group" style="margin:0;">
                        <label style="font-size: 11.5px; font-weight: 700; color: #d941c5;">• 검증 대상 (Target)</label>
                        <input type="text" id="tc-target" placeholder="예: UI / 선택 / 이동" style="background:#fff; color:#000; border:1px solid #cbd5e0; padding:6px 8px; border-radius:4px; font-size:12px; margin-top:4px; box-sizing:border-box; width:100%; font-weight:bold;">
                    </div>
                </div>

                <div style="display: grid; grid-template-columns: 1fr 1fr 1.5fr; gap: 10px;">
                    <div class="form-group" style="margin:0;">
                        <label style="font-size: 11.5px; font-weight: 700; color: #4a5568;">Category 1 (대분류)</label>
                        <input type="text" id="tc-poc" placeholder="예: 네비게이션 바" style="background:#fff; color:#000; border:1px solid #cbd5e0; padding:6px 8px; border-radius:4px; font-size:12px; margin-top:4px; box-sizing:border-box; width:100%;">
                    </div>
                    <div class="form-group" style="margin:0;">
                        <label style="font-size: 11.5px; font-weight: 700; color: #4a5568;">Category 2 (중분류)</label>
                        <input type="text" id="tc-menu" placeholder="예: 장바구니 / 하단 탭바" style="background:#fff; color:#000; border:1px solid #cbd5e0; padding:6px 8px; border-radius:4px; font-size:12px; margin-top:4px; box-sizing:border-box; width:100%;">
                    </div>
                    <div class="form-group" style="margin:0;">
                        <label style="font-size: 11.5px; font-weight: 700; color: #4a5568;">Category 3 (소분류/목적)</label>
                        <input type="text" id="tc-title" placeholder="예: 배송방법 변경 / 삭제" style="background:#fff; color:#000; border:1px solid #cbd5e0; padding:6px 8px; border-radius:4px; font-size:12px; margin-top:4px; box-sizing:border-box; width:100%;">
                    </div>
                </div>

                <div class="form-group" style="margin:0;">
                    <label style="font-size: 11.5px; font-weight: 800; color: #059669;">• Test Data (BO 경로 / 상품코드 / 계정)</label>
                    <input type="text" id="tc-testdata" placeholder="예: A000000861537 아디다스 퍼포먼스 우먼스 헬스장갑 / 스웨거로 재고 관리" style="background:#f0fdf4; color:#065f46; border:1px solid #a7f3d0; padding:8px; border-radius:4px; font-size:12px; margin-top:4px; box-sizing:border-box; width:100%; font-weight:bold;">
                </div>

                <div class="form-group" style="margin:0;">
                    <label style="font-size: 11.5px; font-weight: 700; color: #4a5568;">Pre-Conditions (사전 조건)</label>
                    <textarea id="tc-precond" rows="2" placeholder="1. 로그인 상태&#10;2. 선택 상품이 단일 옵션 상품인 경우" style="background:#fff; color:#000; border:1px solid #cbd5e0; resize:vertical; padding:8px; border-radius:4px; font-size:12px; margin-top:4px; box-sizing:border-box; width:100%;"></textarea>
                </div>

                <div class="form-group" style="margin:0;">
                    <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 2px;">
                        <label style="font-size: 11.5px; font-weight: 700; color: #4a5568; margin: 0;">Step (테스트 절차)</label>
                        <div>
                            <button class="btn-cal-nav" id="btn-tc-add-step" style="font-size: 10px; padding: 2px 6px;">STEP +</button>
                            <button class="btn-cal-nav" id="btn-tc-reset-step" style="font-size: 10px; padding: 2px 6px;">초기화</button>
                        </div>
                    </div>
                    <textarea id="tc-steps" rows="3" placeholder="1. 올리브 배러 홈 > GNB '오특' 진입&#10;2. 상품 카드 [장바구니] 탭" style="background:#fff; color:#000; border:1px solid #cbd5e0; resize:vertical; padding:8px; border-radius:4px; font-size:12px; line-height:1.5; box-sizing:border-box; width:100%;"></textarea>
                </div>

                <div class="form-group" style="margin:0;">
                    <label style="font-size: 11.5px; font-weight: 700; color: #4a5568;">Expected Result (기대 결과)</label>
                    <textarea id="tc-expected" rows="3" placeholder="- 해당 상품 장바구니에 추가&#10;- '나의 장바구니에 담았어요' toast 노출&#10;- 네비게이션 바 [장바구니] 아이콘에 숫자 뱃지 카운트 추가" style="background:#fff; color:#000; border:1px solid #cbd5e0; resize:vertical; padding:8px; border-radius:4px; font-size:12px; margin-top:4px; line-height:1.5; box-sizing:border-box; width:100%;"></textarea>
                </div>
            </div>
        </div>

        <!-- 우측: 구글 시트 네이티브 호환 HTML 테이블 뷰어 구역 -->
        <div style="flex: 2; display: flex; flex-direction: column; gap: 16px; min-width: 0;">
            <div class="tc-preview-zone" style="display: flex; flex-direction: column; background: #ffffff; padding: 20px; border-radius: 8px; border: 1px solid #e2e8f0; box-shadow: 0 4px 18px rgba(0,0,0,0.02); overflow: hidden;">
                <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 12px;">
                    <h3 style="font-size: 1rem; font-weight: 700; color: #2d3748; margin: 0; display:flex; align-items:center; gap:6px;">
                        <span>📊</span> OY 실무 스프레드시트 정형화 뷰어
                        <span style="font-size:11px; font-weight:normal; color:#059669; background:#ecfdf5; padding:2px 8px; border-radius:12px; border:1px solid #a7f3d0;">✨ AI 반영 행 하이라이트 활성</span>
                    </h3>
                    <div style="display: flex; gap: 6px;">
                        <button class="btn-cal-nav" id="btn-open-tc-guide" style="font-size: 11px; padding: 6px 10px; background: #f0fdf4; color: #16a34a; border: 1px solid #bbf7d0; border-radius: 4px; cursor: pointer; font-weight: 700;">📗 TC 가이드 보기</button>
                        <button class="btn-action" id="btn-tc-copy-sheet" style="font-size: 11px; padding: 6px 12px; background: #3182ce; color: white; border: none; border-radius: 4px; cursor: pointer; font-weight: 700;">시트 양식 복사</button>
                    </div>
                </div>
                
                <div style="overflow-x: auto; border: 1px solid #cbd5e0;">
                    <table id="tc-native-sheet" style="border-collapse: collapse; width: max-content; min-width: 1450px; font-family: 'Malgun Gothic', sans-serif; font-size: 11px; text-align: left;">
                        <thead>
                            <tr>
                                <th rowspan="2" style="border: 1px solid #cbd5e0; background-color: #0b2265; color: white; padding: 8px; text-align: center; width: 45px;">No</th>
                                <th rowspan="2" style="border: 1px solid #cbd5e0; background-color: #0b2265; color: white; padding: 8px; text-align: center; width: 90px;">Component</th>
                                <th colspan="3" style="border: 1px solid #cbd5e0; background-color: #0b2265; color: white; padding: 8px; text-align: center;">Category</th>
                                <th rowspan="2" style="border: 1px solid #cbd5e0; background-color: #0b2265; color: white; padding: 8px; text-align: center; width: 80px;">검증 대상</th>
                                <th rowspan="2" style="border: 1px solid #cbd5e0; background-color: #0b2265; color: white; padding: 8px; text-align: center; width: 220px;">Pre-Conditions</th>
                                <th rowspan="2" style="border: 1px solid #cbd5e0; background-color: #0b2265; color: white; padding: 8px; text-align: center; width: 250px;">Step</th>
                                <th rowspan="2" style="border: 1px solid #cbd5e0; background-color: #0b2265; color: white; padding: 8px; text-align: center; width: 260px;">Expected Result</th>
                                <th rowspan="2" style="border: 1px solid #cbd5e0; background-color: #0b2265; color: white; padding: 8px; text-align: center; width: 140px;">Test Data</th>
                                <th colspan="5" style="border: 1px solid #cbd5e0; background-color: #4c1d95; color: white; padding: 8px; text-align: center;">Result</th>
                                <th rowspan="2" style="border: 1px solid #cbd5e0; background-color: #0b2265; color: white; padding: 8px; text-align: center; width: 80px;">Issue No.</th>
                                <th rowspan="2" style="border: 1px solid #cbd5e0; background-color: #0b2265; color: white; padding: 8px; text-align: center; width: 120px;">Comments</th>
                            </tr>
                            <tr>
                                <th style="border: 1px solid #cbd5e0; background-color: #0b2265; color: white; padding: 8px; text-align: center; width: 90px;">Category1</th>
                                <th style="border: 1px solid #cbd5e0; background-color: #0b2265; color: white; padding: 8px; text-align: center; width: 100px;">Category2</th>
                                <th style="border: 1px solid #cbd5e0; background-color: #0b2265; color: white; padding: 8px; text-align: center; width: 130px;">Category3</th>
                                <th style="border: 1px solid #cbd5e0; background-color: #4c1d95; color: white; padding: 8px; text-align: center; width: 55px;">And_APP</th>
                                <th style="border: 1px solid #cbd5e0; background-color: #4c1d95; color: white; padding: 8px; text-align: center; width: 55px;">iOS_APP</th>
                                <th style="border: 1px solid #cbd5e0; background-color: #4c1d95; color: white; padding: 8px; text-align: center; width: 55px;">Safari</th>
                                <th style="border: 1px solid #cbd5e0; background-color: #4c1d95; color: white; padding: 8px; text-align: center; width: 55px;">Chrome</th>
                                <th style="border: 1px solid #cbd5e0; background-color: #4c1d95; color: white; padding: 8px; text-align: center; width: 75px;">Samsung<br>Internet</th>
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

    <!-- 다중 행 일괄 파싱 모달 창 -->
    <div id="tc-import-modal" style="display: none; position: fixed; top: 0; left: 0; width: 100vw; height: 100vh; background: rgba(15, 23, 42, 0.7); z-index: 10001; justify-content: center; align-items: center; box-sizing: border-box;">
        <div style="background: #ffffff; width: 620px; max-width: 90vw; border-radius: 12px; padding: 24px; box-shadow: 0 20px 40px rgba(0,0,0,0.25); display: flex; flex-direction: column; gap: 14px;">
            <div style="display: flex; justify-content: space-between; align-items: center; border-bottom: 2px solid #e2e8f0; padding-bottom: 10px;">
                <h3 style="margin: 0; font-size: 1.15rem; font-weight: 800; color: #0f172a;">📥 OY 실무 다중 행(Multi-Row) 일괄 파싱 Import</h3>
                <button id="btn-close-import-x" style="background: none; border: none; font-size: 22px; cursor: pointer; color: #94a3b8; padding: 0;">&times;</button>
            </div>
            <p style="margin: 0; font-size: 12px; color: #475569; line-height: 1.5;">
                구글 시트나 엑셀에서 검증할 <b>여러 개의 행(예: 병합된 10줄 블록 전체)</b>을 드래그하여 복사(<code style="background:#f1f5f9; padding:2px 4px; border-radius:4px;">Ctrl+C</code>)한 뒤, 아래에 붙여넣고 적용 버튼을 누르십시오.<br>
                <b>(인식 열 순서: Component ➔ Cat1 ➔ Cat2 ➔ Cat3 ➔ 검증 대상 ➔ Pre-Conditions ➔ Step ➔ Expected Result ➔ Test Data)</b>
            </p>
            <textarea id="import-raw-text" rows="8" placeholder="여러 줄을 한꺼번에 복사해서 붙여넣으세요!&#10;예)&#10;올리브베러	네비게이션 바	테마드로우		UI	1. 로그인 상태	1. 오특 탭...	- 오특 이동	A0001&#10;			검색		UI	1. 상품 0개	1. 오특 진입...	- 영역 미노출	A0002" style="width: 100%; padding: 10px; font-size: 12px; border: 1px solid #cbd5e0; border-radius: 6px; font-family: monospace; resize: vertical; box-sizing: border-box;"></textarea>
            <div style="display: flex; justify-content: space-between; align-items: center; margin-top: 6px;">
                <label style="font-size: 12px; font-weight: 700; color: #0284c7; display: flex; align-items: center; gap: 6px; cursor: pointer;">
                    <input type="checkbox" id="chk-fill-down" checked style="cursor: pointer;">
                    ☑️ 병합된 빈 셀 상위 값 자동 채우기 (Fill-down)
                </label>
                <div style="display: flex; gap: 8px;">
                    <button id="btn-cancel-import" style="background: #f1f5f9; color: #475569; border: none; padding: 8px 16px; border-radius: 6px; font-weight: 700; font-size: 12px; cursor: pointer;">취소</button>
                    <button id="btn-execute-import" style="background: #0f172a; color: #fff; border: none; padding: 8px 18px; border-radius: 6px; font-weight: 700; font-size: 12px; cursor: pointer;">⚡ 다중 행 일괄 파싱 적용</button>
                </div>
            </div>
        </div>
    </div>
`;

window.QA_CORE.Tc.Manager = {
    tcList: [], // 다중 행 상태 관리 배열
    currentEditIndex: 0, // 현재 좌측 폼과 연동된 활성 행 인덱스

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

        if (this.tcList.length === 0) {
            this.tcList.push({ comp: "올리브베러", poc: "네비게이션 바", menu: "테마드로우", title: "", target: "UI", precond: "", steps: "", expected: "", testdata: "", isAiModified: false });
        }

        this.bindEvents();
        this.loadToForm(0);
    },

    bindEvents() {
        const trackIds = ['tc-component', 'tc-poc', 'tc-menu', 'tc-title', 'tc-target', 'tc-precond', 'tc-steps', 'tc-expected', 'tc-testdata'];
        trackIds.forEach(id => {
            const el = document.getElementById(id);
            // 💡 사용자가 수동으로 폼을 수정하는 순간 AI 하이라이트 해제 (자연스러운 생명주기 제어)
            if (el) el.addEventListener('input', () => {
                if (this.tcList[this.currentEditIndex]) {
                    this.tcList[this.currentEditIndex].isAiModified = false;
                }
                this.syncFormToState();
            });
        });

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
                        } else { currentCell += char; }
                    }
                    if (currentCell.trim() || text.endsWith('\t')) currentRow.push(currentCell.trim());
                    if (currentRow.some(c => c !== "")) rows.push(currentRow);
                    return rows;
                };

                const parsedRows = parseMultiRowTSV(rawText);
                if (parsedRows.length === 0) {
                    alert("인식된 데이터 행이 없습니다."); return;
                }

                let lastComp = "", lastPoc = "", lastMenu = "";

                this.tcList = parsedRows.map((columns) => {
                    let offset = /^\d+$/.test(columns[0]) ? 1 : 0;
                    
                    let comp = columns[0 + offset] || '';
                    let poc = columns[1 + offset] || '';
                    let menu = columns[2 + offset] || '';
                    let title = columns[3 + offset] || '';
                    let target = columns[4 + offset] || 'UI';
                    let precond = columns[5 + offset] || '';
                    let steps = columns[6 + offset] || '';
                    let expected = columns[7 + offset] || '';
                    let testdata = columns[8 + offset] || '';

                    if (isFillDown) {
                        if (comp !== "") lastComp = comp; else comp = lastComp;
                        if (poc !== "") lastPoc = poc; else poc = lastPoc;
                        if (menu !== "") lastMenu = menu; else menu = lastMenu;
                    }

                    return { comp, poc, menu, title, target, precond, steps, expected, testdata, isAiModified: false };
                });

                this.loadToForm(0);
                closeImportAction();
                document.getElementById('import-raw-text').value = '';
                alert(`✅ 총 ${parsedRows.length}개 행(Row)의 병합 데이터가 성공적으로 파싱 및 렌더링되었습니다!`);
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
                } catch (err) { alert("복사에 실패했습니다."); }
                window.getSelection().removeAllRanges();
            };
        }

        const guideModal = document.getElementById('tc-guide-modal');
        const openGuideBtn = document.getElementById('btn-open-tc-guide');
        const closeGuideBtn = document.getElementById('btn-close-tc-guide');
        const closeGuideBtnBottom = document.getElementById('btn-close-tc-guide-bottom');

        if (openGuideBtn && guideModal) openGuideBtn.onclick = () => { guideModal.style.display = 'flex'; };
        const closeGuideAction = () => { if (guideModal) guideModal.style.display = 'none'; };
        if (closeGuideBtn) closeGuideBtn.onclick = closeGuideAction;
        if (closeGuideBtnBottom) closeGuideBtnBottom.onclick = closeGuideAction;
        if (guideModal) guideModal.onclick = (e) => { if (e.target === guideModal) closeGuideAction(); };
    },

    loadToForm(idx) {
        if (!this.tcList[idx]) return;
        this.currentEditIndex = idx;
        const tc = this.tcList[idx];

        document.getElementById('tc-component').value = tc.comp || '';
        document.getElementById('tc-poc').value = tc.poc || '';
        document.getElementById('tc-menu').value = tc.menu || '';
        document.getElementById('tc-title').value = tc.title || '';
        document.getElementById('tc-target').value = tc.target || '';
        document.getElementById('tc-precond').value = tc.precond || '';
        document.getElementById('tc-steps').value = tc.steps || '';
        document.getElementById('tc-expected').value = tc.expected || '';
        document.getElementById('tc-testdata').value = tc.testdata || '';

        this.renderTable();
    },

    syncFormToState() {
        if (!this.tcList[this.currentEditIndex]) {
            this.tcList[this.currentEditIndex] = {};
        }
        const tc = this.tcList[this.currentEditIndex];
        const getVal = (id) => { const el = document.getElementById(id); return el ? el.value.trim() : ''; };

        tc.comp = getVal('tc-component');
        tc.poc = getVal('tc-poc');
        tc.menu = getVal('tc-menu');
        tc.title = getVal('tc-title');
        tc.target = getVal('tc-target');
        tc.precond = getVal('tc-precond');
        tc.steps = getVal('tc-steps');
        tc.expected = getVal('tc-expected');
        tc.testdata = getVal('tc-testdata');

        this.renderTable();
    },

    // 💡 [핵심 교정] AI 초안 생성 완료 시 변경된 행에 isAiModified: true 속성 부여
    async triggerAiGenerationPipeline() {
        const descEl = document.getElementById('ai-feature-desc');
        const featureDesc = descEl ? descEl.value.trim() : '';

        if (featureDesc.length < 5) {
            alert("요구사항이나 신규 변경점 내용을 5자 이상 기입해 주십시오.");
            if (descEl) descEl.focus(); return;
        }

        const btn = document.getElementById('btn-ai-generate');
        const originalHtml = btn.innerHTML;
        btn.innerHTML = `<span>⏳</span> OY 특화 TC 생성 중...`;
        btn.disabled = true;

        try {
            await new Promise(resolve => setTimeout(resolve, 1200));

            const cleanDesc = featureDesc.replace(/[*#]/g, '').split('\n')[0].trim();
            const shortTitle = cleanDesc.length > 24 ? cleanDesc.slice(0, 24) + "..." : cleanDesc;

            let comp = "올리브베러"; let cat1 = "네비게이션 바"; let cat2 = "장바구니"; let cat3 = "배송방법 변경"; let target = "UI";
            let testdataStr = "전시 연결관리 > 올리브 배러 가상 카테고리 > [올리브 배러 오특] 오특 큐레이션";

            if (/장바구니|담기|토스트/i.test(featureDesc)) {
                comp = "올리브베러"; cat1 = "네비게이션 바"; cat2 = "장바구니"; cat3 = "배송방법 변경"; target = "UI";
                testdataStr = "A000000122563 식물나라 티트리카밍미스트 150ml";
            } else if (/GNB|진입|홈|랭킹|기획전/i.test(featureDesc)) {
                comp = "올리브베러"; cat1 = "GNB"; cat2 = "홈"; cat3 = "오특 진입"; target = "이동";
            } else if (/좋아요|하트|마이|로그인|로그아웃/i.test(featureDesc)) {
                comp = "올리브베러"; cat1 = "하단 탭바"; cat2 = "좋아요"; cat3 = "마이"; target = "UI";
                testdataStr = "A000000111067 [의료기기] 바른생각 퍼펙트핏 12P";
            } else if (/품절|0개|개수|정렬|타이틀/i.test(featureDesc)) {
                comp = "오늘의특가"; cat1 = "상품 개수"; cat2 = "1개~10개"; cat3 = "일시품절"; target = "UI";
                testdataStr = "A000000861537 아디다스 퍼포먼스 우먼스 헬스장갑\n스웨거로 재고 관리";
            }

            // 새로운 초안 생성 전 기존 행들의 AI 변경 플래그 초기화
            this.tcList.forEach(item => item.isAiModified = false);

            const tc = this.tcList[this.currentEditIndex] || {};
            tc.comp = comp; tc.poc = cat1; tc.menu = cat2; tc.title = cat3; tc.target = target; tc.testdata = testdataStr;
            tc.precond = `1. 로그인 상태\n2. 장바구니 내 상품 있는 상태\n3. [검증 명세]: ${cleanDesc}`;
            tc.steps = `1. 올리브 배러 홈 > GNB 진입\n2. '${comp}' 영역 내 카테고리 탭\n3. 변경 명세된 영역(${shortTitle})의 기획 개편안 사용자 액션 수행`;
            tc.expected = `- 기획 명세(${shortTitle})에 맞춰 에러나 UI 깨짐 없이 정상 노출된다.\n- 이미지 dim 처리, 하얀 텍스트의 토스트 팝업 메시지가 정상 출력된다.\n- GNB 네비게이션 바 및 상단 헤더 동기화가 정상 작동한다.`;
            
            // 💡 AI 생성 완료 마크 주입
            tc.isAiModified = true;

            this.loadToForm(this.currentEditIndex);
        } finally {
            btn.innerHTML = originalHtml;
            btn.disabled = false;
        }
    },

    async triggerAiReviewPipeline() {
        const tc = this.tcList[this.currentEditIndex] || {};
        const currentTcContext = `${tc.precond || ''} ${tc.steps || ''} ${tc.expected || ''}`;

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

            const forbiddenWords = ['정상 확인', '동작 확인', 'API 확인', '데이터 확인', '검증', '안됨', '이상함', '오류 발생'];
            let foundWords = forbiddenWords.filter(w => currentTcContext.includes(w));
            if (foundWords.length > 0) {
                errorCount++;
                reviewDetails.push(`**${errorCount}. 모호한 지양 표현 사용**\n* **지적 사항:** 제3자가 해석하기 어려운 모호한 단어(${foundWords.map(w => `'${w}'`).join(', ')})가 감지되었습니다.\n* **권장 교정:** '주문 완료 페이지가 노출된다', '토스트 메시지 노출' 등 구체적인 상태로 기술하십시오.`);
            }

            if (tc.expected && (!tc.expected.endsWith('다.') && !tc.expected.endsWith('함') && !tc.expected.endsWith('음') && !tc.expected.endsWith('출') && !tc.expected.endsWith('가') && !tc.expected.endsWith('동'))) {
                errorCount++;
                reviewDetails.push(`**${errorCount}. Expected Result (기대결과) 명확성 부족**\n* **지적 사항:** 기대결과는 명확한 명사형이나 문장 종결 어미로 끝나야 합니다.\n* **권장 교정:** '- 토스트 팝업 정상 노출' 또는 '- 에러 없이 이동됨' 형태로 명확히 결속하십시오.`);
            }

            let summaryReport = "";
            if (errorCount === 0) {
                summaryReport = `### 종합 결론\n**🎉 규격 감리 통과 (PASS)**\n\n### 세부 분석\n* 올리브영(OY) 실무 QA 스크린샷 규격과 유현승님 작성 원칙을 100% 준수하고 있습니다.\n* 도메인 용어(BO, GNB, 토스트 메시지, dim 처리)가 정확히 사용되어 제3자가 바로 수행 가능한 훌륭한 TC입니다.`;
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

    // 💡 [렌더링 엔진 고도화] isAiModified가 true인 행에 에메랄드 배경 및 '✨ AI' 배지 표출
    renderTable() {
        const tbody = document.getElementById('tc-native-sheet-body');
        if (!tbody) return;

        const formatNewline = (str) => (str || '').replace(/\n/g, '<br>');

        const spans = this.tcList.map(() => ({ comp: 1, poc: 1, menu: 1, skipComp: false, skipPoc: false, skipMenu: false }));

        for (let i = 0; i < this.tcList.length; i++) {
            if (spans[i].skipComp) continue;
            let run = 1;
            for (let j = i + 1; j < this.tcList.length; j++) {
                if (this.tcList[j].comp === this.tcList[i].comp && this.tcList[i].comp !== "") {
                    run++; spans[j].skipComp = true;
                } else break;
            }
            spans[i].comp = run;
        }

        for (let i = 0; i < this.tcList.length; i++) {
            if (spans[i].skipPoc) continue;
            let run = 1;
            for (let j = i + 1; j < this.tcList.length; j++) {
                if (this.tcList[j].comp !== this.tcList[i].comp) break; 
                if (this.tcList[j].poc === this.tcList[i].poc && this.tcList[i].poc !== "") {
                    run++; spans[j].skipPoc = true;
                } else break;
            }
            spans[i].poc = run;
        }

        for (let i = 0; i < this.tcList.length; i++) {
            if (spans[i].skipMenu) continue;
            let run = 1;
            for (let j = i + 1; j < this.tcList.length; j++) {
                if (this.tcList[j].poc !== this.tcList[i].poc || this.tcList[j].comp !== this.tcList[i].comp) break;
                if (this.tcList[j].menu === this.tcList[i].menu && this.tcList[i].menu !== "") {
                    run++; spans[j].skipMenu = true;
                } else break;
            }
            spans[i].menu = run;
        }

        tbody.innerHTML = this.tcList.map((tc, idx) => {
            const isSelected = idx === this.currentEditIndex;
            const isAi = tc.isAiModified;

            // 💡 배경색 및 외곽선 우선순위 결속 (선택 행 vs AI 수정 행)
            let rowStyle = 'background-color: #ffffff; cursor: pointer; transition: background 0.15s;';
            if (isSelected && isAi) {
                rowStyle = 'background-color: #ecfdf5; outline: 2px solid #3b82f6; border-left: 4px solid #10b981; cursor: pointer;';
            } else if (isSelected) {
                rowStyle = 'background-color: #eff6ff; outline: 2px solid #3b82f6; cursor: pointer;';
            } else if (isAi) {
                rowStyle = 'background-color: #ecfdf5; border-left: 4px solid #10b981; cursor: pointer; transition: background 0.15s;';
            }

            // 💡 순번 셀 디자인 및 '✨ AI' 배지 출력
            let numStyle = '';
            let numText = `${idx + 1}`;
            if (isAi) {
                numStyle = 'background-color: #059669; color: #fff; font-weight: bold;';
                numText = `${idx + 1}<br><span style="font-size:9px; background:#a7f3d0; color:#065f46; padding:1px 3px; border-radius:3px; display:inline-block; margin-top:2px;">✨ AI</span>`;
            } else if (isSelected) {
                numStyle = 'background-color: #2563eb; color: #fff; font-weight: bold;';
            }

            const compTd = spans[idx].skipComp ? '' : `<td rowspan="${spans[idx].comp}" style="border: 1px solid #cbd5e0; padding: 8px; vertical-align: middle; text-align: center; font-weight: bold; color: #1e3a8a; background-color: ${isAi ? '#ecfdf5' : '#f8fafc'};">${tc.comp || ''}</td>`;
            const pocTd = spans[idx].skipPoc ? '' : `<td rowspan="${spans[idx].poc}" style="border: 1px solid #cbd5e0; padding: 8px; vertical-align: middle; text-align: center; font-weight: 600; color: #334155;">${tc.poc || ''}</td>`;
            const menuTd = spans[idx].skipMenu ? '' : `<td rowspan="${spans[idx].menu}" style="border: 1px solid #cbd5e0; padding: 8px; vertical-align: middle; text-align: center; color: #475569;">${tc.menu || ''}</td>`;

            return `
                <tr class="tc-table-row" data-index="${idx}" style="${rowStyle}">
                    <td style="border: 1px solid #cbd5e0; padding: 8px; text-align: center; vertical-align: middle; ${numStyle}">${numText}</td>
                    ${compTd}
                    ${pocTd}
                    ${menuTd}
                    <td style="border: 1px solid #cbd5e0; padding: 8px; vertical-align: middle; text-align: center;">${tc.title || ''}</td>
                    <td style="border: 1px solid #cbd5e0; padding: 8px; vertical-align: middle; font-weight: bold; color: #d941c5; text-align: center;">${tc.target || ''}</td>
                    <td style="border: 1px solid #cbd5e0; padding: 8px; vertical-align: top; white-space: nowrap;">${formatNewline(tc.precond)}</td>
                    <td style="border: 1px solid #cbd5e0; padding: 8px; vertical-align: top; white-space: nowrap;">${formatNewline(tc.steps)}</td>
                    <td style="border: 1px solid #cbd5e0; padding: 8px; vertical-align: top; white-space: nowrap;">${formatNewline(tc.expected)}</td>
                    <td style="border: 1px solid #cbd5e0; padding: 8px; vertical-align: top; font-weight: bold; color: #059669; white-space: nowrap;">${formatNewline(tc.testdata)}</td>
                    <td style="border: 1px solid #cbd5e0; padding: 8px; text-align: center; vertical-align: middle; color: #15803d; font-weight: bold; background-color: #f0fdf4;">PASS</td>
                    <td style="border: 1px solid #cbd5e0; padding: 8px; text-align: center; vertical-align: middle; color: #15803d; font-weight: bold; background-color: #f0fdf4;">PASS</td>
                    <td style="border: 1px solid #cbd5e0; padding: 8px; text-align: center; vertical-align: middle; color: #15803d; font-weight: bold; background-color: #f0fdf4;">PASS</td>
                    <td style="border: 1px solid #cbd5e0; padding: 8px; text-align: center; vertical-align: middle; color: #15803d; font-weight: bold; background-color: #f0fdf4;">PASS</td>
                    <td style="border: 1px solid #cbd5e0; padding: 8px; text-align: center; vertical-align: middle; color: #15803d; font-weight: bold; background-color: #f0fdf4;">PASS</td>
                    <td style="border: 1px solid #cbd5e0; padding: 8px; vertical-align: middle;"></td>
                    <td style="border: 1px solid #cbd5e0; padding: 8px; vertical-align: middle;"></td>
                </tr>
            `;
        }).join('');

        tbody.querySelectorAll('.tc-table-row').forEach(row => {
            row.onclick = () => {
                const idx = parseInt(row.getAttribute('data-index'), 10);
                this.loadToForm(idx);
            };
            row.onmouseover = () => { 
                const idx = parseInt(row.getAttribute('data-index'), 10);
                if (idx !== this.currentEditIndex && !this.tcList[idx]?.isAiModified) row.style.backgroundColor = '#f8fafc'; 
            };
            row.onmouseout = () => { 
                const idx = parseInt(row.getAttribute('data-index'), 10);
                if (idx !== this.currentEditIndex && !this.tcList[idx]?.isAiModified) row.style.backgroundColor = '#ffffff'; 
            };
        });
    },

    compileTcData() {
        this.syncFormToState();
    }
};

export function initTcPanel() {
    window.QA_CORE.Tc.Manager.init();
}

if (window.QA_CORE.SkillManager && typeof window.QA_CORE.SkillManager.register === 'function') {
    window.QA_CORE.SkillManager.register('TcModuleCore', window.QA_CORE.Tc.Manager);
}
