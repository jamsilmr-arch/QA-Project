window.QA_CORE = window.QA_CORE || {};
window.QA_CORE.Tc = window.QA_CORE.Tc || {};

// 제공된 테스트 케이스 작성 가이드 전체 텍스트 상자 (마크다운 스타일 모달 변환)
const TC_GUIDE_CONTENT = `
<div style="font-family: 'Pretendard', -apple-system, BlinkMacSystemFont, system-ui, Roboto, sans-serif; color: #2d3748; line-height: 1.6; font-size: 13px;">
    <div style="background: #f0fdf4; border-left: 4px solid #16a34a; padding: 12px; margin-bottom: 16px; border-radius: 4px;">
        <h4 style="margin: 0 0 6px 0; color: #15803d; font-size: 14px; font-weight: 700;">📌 작성 배경</h4>
        <p style="margin: 0 0 6px 0;">최근 작성하신 테스트 케이스에 대해 아래와 같은 의견이 있었습니다.</p>
        <ul style="margin: 0; padding-left: 20px; color: #4a5568;">
            <li>어떤 상황에서 테스트를 수행하는지 이해하기 어렵다.</li>
            <li>Pre-Condition과 Step의 역할이 혼재되어 있다.</li>
            <li>Step이 단순히 “확인” 수준으로 작성되어 실제 수행 흐름이 보이지 않는다.</li>
            <li>작성자 본인은 이해하지만, 제3자가 읽었을 때 해석이 필요한 경우가 많다.</li>
        </ul>
        <p style="margin: 8px 0 0 0; font-weight: bold; color: #166534;">테스트 케이스는 작성자만 보는 문서가 아니라, QA / 개발 / 운영 / 타 협력업체 등 다양한 사람이 함께 참고하는 공용 문서입니다.<br>따라서 “내가 이해하는 문서”가 아니라 “처음 보는 사람도 바로 이해할 수 있는 문서”로 작성하는 것이 중요합니다.</p>
    </div>

    <h4 style="color: #1a202c; font-size: 15px; font-weight: 700; border-bottom: 2px solid #e2e8f0; padding-bottom: 6px; margin: 20px 0 10px 0;">🎯 기본 작성 원칙</h4>
    
    <div style="display: flex; flex-direction: column; gap: 16px;">
        <div>
            <strong style="color: #15803d; font-size: 13px;">1. Pre-Condition은 “사전 상태”만 작성</strong>
            <p style="margin: 2px 0 6px 0; font-size: 12px; color: #718096;">Pre-Condition은 테스트를 수행하기 전에 이미 준비되어 있어야 하는 상태를 의미합니다.<br>즉, “무엇을 해야 하는지”를 쓰는 영역이 아니라 “어떤 상태인지”를 설명하는 영역입니다.</p>
            <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 8px;">
                <div style="background: #fff5f5; border: 1px solid #fed7d7; padding: 8px; border-radius: 4px;">
                    <span style="color: #e53e3e; font-weight: bold; font-size: 11px;">❌ 잘못된 예시 (실제 수행 절차가 들어감):</span>
                    <p style="margin: 4px 0 0 0; font-size: 12px; color: #742a2a;">1. 로그인 진행<br>2. 장바구니 상품 담기<br>3. 배송지 등록</p>
                </div>
                <div style="background: #f0fff4; border: 1px solid #c6f6d5; padding: 8px; border-radius: 4px;">
                    <span style="color: #38a169; font-weight: bold; font-size: 11px;">⭕ 올바른 예시 (준비 상태만 명확히 전달):</span>
                    <p style="margin: 4px 0 0 0; font-size: 12px; color: #22543d;">- 로그인된 사용자 상태<br>- 장바구니에 상품이 담겨있는 상태<br>- 기본 배송지가 등록되어 있는 상태</p>
                </div>
            </div>
        </div>

        <div>
            <strong style="color: #15803d; font-size: 13px;">2. Pre-Condition에는 Step 번호 미사용</strong>
            <p style="margin: 2px 0 6px 0; font-size: 12px; color: #718096;">Pre-Condition은 순차 수행 개념이 아닙니다. 따라서 순번 매기기 형식은 지양합니다.</p>
            <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 8px;">
                <div style="background: #fff5f5; border: 1px solid #fed7d7; padding: 8px; border-radius: 4px;">
                    <span style="color: #e53e3e; font-weight: bold; font-size: 11px;">❌ 잘못된 예시:</span>
                    <p style="margin: 4px 0 0 0; font-size: 12px; color: #742a2a;">1. 주문 생성<br>2. 취소 완료<br>3. 환불 완료</p>
                </div>
                <div style="background: #f0fff4; border: 1px solid #c6f6d5; padding: 8px; border-radius: 4px;">
                    <span style="color: #38a169; font-weight: bold; font-size: 11px;">⭕ 올바른 예시:</span>
                    <p style="margin: 4px 0 0 0; font-size: 12px; color: #22543d;">- 주문이 완료된 상태<br>- 주문 취소가 완료된 상태<br>- 환불이 완료된 상태</p>
                </div>
            </div>
        </div>

        <div>
            <strong style="color: #15803d; font-size: 13px;">3. Step은 “사용자 행동 기준”으로 작성</strong>
            <p style="margin: 2px 0 6px 0; font-size: 12px; color: #718096;">Step은 실제 수행 흐름이 드러나야 합니다. 단순히 “확인”이라고 작성하면 무엇을 어떻게 검증하는지 알기 어렵습니다.</p>
            <div style="background: #fff5f5; border: 1px solid #fed7d7; padding: 8px; border-radius: 4px; margin-bottom: 8px;">
                <span style="color: #e53e3e; font-weight: bold; font-size: 11px;">❌ 잘못된 예시 (무엇을 수행했는지 알 수 없음):</span>
                <p style="margin: 4px 0 0 0; font-size: 12px; color: #742a2a;">Step 1: (사전조건으로 장바구니에 있는 상태라고 가정) 주문완료 페이지<br>Step 2: 보조결제 수단 노출 순서 확인<br>Step 3: (사전조건으로 주문 완료했다고 가정) 주문취소 진행</p>
            </div>
            <div style="background: #f0fff4; border: 1px solid #c6f6d5; padding: 8px; border-radius: 4px;">
                <span style="color: #38a169; font-weight: bold; font-size: 11px;">⭕ 올바른 예시 (실제 사용 흐름이 보임):</span>
                <p style="margin: 4px 0 0 0; font-size: 12px; color: #22543d;">
                    **Step (예시 1 - 사전조건: 장바구니에 있는 상태):**<br>
                    1. 주문서 페이지에 진입<br>
                    2. 보조결제 수단 노출 순서 확인 (CJ ONE 포인트 > 올리브 포인트 > 올리브영 기프트카드 > CJ 기프트카드 > 모바일 상품권 > 올리브영 현대카드 리워드 > 카페테리아 포인트 > 예치금)<br><br>
                    **Step (예시 2 - 사전조건: 주문 완료한 상태):**<br>
                    1. 마이페이지 진입<br>
                    2. 주문/배송 조회 영역 내 '전체보기 >' 탭<br>
                    3. 주문취소 버튼 탭<br>
                    4. 취소사유 선택 영역 '사유' 탭 > '고객단순변심' 선택<br>
                    5. [다음] 탭 > [확인] 탭
                </p>
            </div>
        </div>

        <div>
            <strong style="color: #15803d; font-size: 13px;">4. “확인”만 작성하지 말고, 행동 + 결과 흐름으로 작성</strong>
            <p style="margin: 2px 0 6px 0; font-size: 12px; color: #718096;">테스트 케이스는 “무엇을 했다”와 “무슨 결과를 기대하는지”가 연결되어야 합니다.</p>
            <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 8px;">
                <div style="background: #fff5f5; border: 1px solid #fed7d7; padding: 8px; border-radius: 4px;">
                    <span style="color: #e53e3e; font-weight: bold; font-size: 11px;">❌ 잘못된 예시:</span>
                    <p style="margin: 4px 0 0 0; font-size: 12px; color: #742a2a;">• Step: 쿠폰 확인<br>• Expected Result: 쿠폰 노출</p>
                </div>
                <div style="background: #f0fff4; border: 1px solid #c6f6d5; padding: 8px; border-radius: 4px;">
                    <span style="color: #38a169; font-weight: bold; font-size: 11px;">⭕ 올바른 예시:</span>
                    <p style="margin: 4px 0 0 0; font-size: 12px; color: #22543d;">• Step: 주문서 페이지에서 다운로드 쿠폰 적용<br>• Expected Result: 주문 금액에 쿠폰 할인 금액이 반영된다</p>
                </div>
            </div>
        </div>
    </div>

    <h4 style="color: #1a202c; font-size: 15px; font-weight: 700; border-bottom: 2px solid #e2e8f0; padding-bottom: 6px; margin: 20px 0 10px 0;">✍️ 작성 스타일 가이드</h4>
    
    <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 12px; margin-bottom: 16px;">
        <div style="background: #fff5f5; padding: 10px; border-radius: 6px; border: 1px solid #fed7d7;">
            <strong style="color: #c53030; font-size: 12px;">🚫 지양 표현 (작성자만 이해 가능)</strong>
            <ul style="margin: 6px 0 0 0; padding-left: 16px; font-size: 12px; color: #742a2a;">
                <li>정상 확인</li>
                <li>동작 확인</li>
                <li>API 확인</li>
                <li>데이터 확인</li>
                <li>검증</li>
                <li>**축약어 지양:** BO 확인, PG 응답 확인, 적립 확인</li>
            </ul>
        </div>
        <div style="background: #f0fff4; padding: 10px; border-radius: 6px; border: 1px solid #c6f6d5;">
            <strong style="color: #15803d; font-size: 12px;">💡 권장 표현 (제3자 기준 명확성)</strong>
            <ul style="margin: 6px 0 0 0; padding-left: 16px; font-size: 12px; color: #22543d;">
                <li>주문 완료 페이지가 노출된다.</li>
                <li>장바구니 수량이 1 증가한다.</li>
                <li>주문 상태가 '결제완료'로 노출된다.</li>
                <li>취소/반품/교환 내역 페이지에 취소완료 주문이 조회된다.</li>
                <li>**용어 풀이:** 관리자 화면에서 확인, 결제 응답값 확인, 포인트 적립 여부 확인</li>
            </ul>
        </div>
    </div>

    <h4 style="color: #1a202c; font-size: 15px; font-weight: 700; border-bottom: 2px solid #e2e8f0; padding-bottom: 6px; margin: 20px 0 10px 0;">✨ 예시 비교 (Before vs After)</h4>
    <div style="display: flex; flex-direction: column; gap: 10px;">
        <div style="background: #fff5f5; border: 1px solid #feb2b2; padding: 12px; border-radius: 6px; font-size: 12px;">
            <span style="background: #e53e3e; color: white; font-weight: bold; padding: 2px 6px; border-radius: 4px; font-size: 11px;">Before (개선 전)</span>
            <p style="margin: 8px 0 0 0; color: #4a5568;">
                **Pre-Condition:** 로그인, 상품 담기, 장바구니 쿠폰 다운로드<br>
                **Step:** 주문 확인<br>
                **Expected Result:** 정상 확인
            </p>
        </div>

        <div style="background: #f0fff4; border: 1px solid #9ae6b4; padding: 12px; border-radius: 6px; font-size: 12px;">
            <span style="background: #16a34a; color: white; font-weight: bold; padding: 2px 6px; border-radius: 4px; font-size: 11px;">After (개선 후)</span>
            <p style="margin: 8px 0 0 0; color: #2d3748;">
                **Pre-Condition:**<br>
                - 로그인된 사용자 상태<br>
                - 장바구니에 일반 배송 상품이 담겨있는 상태<br>
                - 장바구니 쿠폰이 발급된 상태<br>
                - CJ ONE 포인트가 100,000 P 있는 상태<br><br>
                **Step:**<br>
                1. 구매할 상품 선택 > [구매하기] 탭<br>
                2. 장바구니 쿠폰 적용<br>
                3. CJ ONE 포인트 [전액 사용] 탭 > [결제하기] 탭<br><br>
                **Expected Result:** 주문 완료 페이지 노출
            </p>
        </div>
    </div>
</div>
`;

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

        <!-- 💡 [핵심 교정] 우측: 구글 시트 네이티브 호환 HTML 테이블 뷰어 구역 (+ 가이드 보기 버튼 신규 장착) -->
        <div style="flex: 2; display: flex; flex-direction: column; gap: 16px; min-width: 0;">
            <div class="tc-preview-zone" style="display: flex; flex-direction: column; background: #ffffff; padding: 20px; border-radius: 8px; border: 1px solid #e2e8f0; box-shadow: 0 4px 18px rgba(0,0,0,0.02); overflow: hidden;">
                <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 12px;">
                    <h3 style="font-size: 1rem; font-weight: 700; color: #2d3748; margin: 0;">📊 스프레드시트 정형화 뷰어</h3>
                    <div style="display: flex; gap: 6px;">
                        <button class="btn-cal-nav" id="btn-open-tc-guide" style="font-size: 11px; padding: 6px 10px; background: #f0fdf4; color: #16a34a; border: 1px solid #bbf7d0; border-radius: 4px; cursor: pointer; font-weight: 700;">📗 TC 가이드 보기</button>
                        <button class="btn-action" id="btn-tc-copy-sheet" style="font-size: 11px; padding: 6px 12px; background: #3182ce; color: white; border: none; border-radius: 4px; cursor: pointer; font-weight: 700;">시트 양식 복사</button>
                    </div>
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

    <!-- ✨ 테스트 케이스 작성 가이드 모달 창 (Viewport 중앙 고정) -->
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

        // ✨ [신규 장착] 테스트 케이스 가이드 모달 제어 핸들러 바인딩
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
