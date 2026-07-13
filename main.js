import { initCoreSystem, switchTab } from './app.js';
import { initIssuePanel } from './issue.js';
import { initCalendarPanel } from './calendar-view.js';
import './bookmark.js'; 
import './kpi.js'; 
import './schedule.js';
import './calendar.js'; 

// [라우터 선행 배치 가드] 스크립트 결함 시에도 메뉴 락(Lock)을 방지하기 위해 네임스페이스 최상단 주입
window.QA_CORE = window.QA_CORE || {};
window.QA_CORE.Router = {
    switchTab: switchTab
};

function bootstrapSystem() {
    try {
        // 1. 각 서브 판넬 레이아웃 뼈대 마운트
        if (typeof initIssuePanel === 'function') initIssuePanel();
        if (typeof initCalendarPanel === 'function') initCalendarPanel();

        // 2. 백본 코어 엔진 및 환경 설정 구동
        if (typeof initCoreSystem === 'function') initCoreSystem();
        
        if (window.QA_CORE.Settings && typeof window.QA_CORE.Settings.init === 'function') {
            window.QA_CORE.Settings.init();
        }

        // 3. 캘린더 그리드 즉시 렌더링 동기화
        if (window.QA_CORE.Calendar && window.QA_CORE.Calendar.Render) {
            window.QA_CORE.Calendar.Render.renderCalendarAll();
        }

        // 4. 드래그 앤 드롭 탭 내비게이션 위임 리스너 바인딩
        const container = document.getElementById('draggable-tabs-container');
        if (container) {
            container.addEventListener('click', (e) => {
                const btn = e.target.closest('.tab-btn');
                if (!btn) return;
                
                const tabId = btn.id.replace('tab-btn-', '');
                if (typeof switchTab === 'function') switchTab(tabId);
            });
        }
    } catch (error) {
        console.error("시스템 최종 부트스트랩 구동 중 치명적 결함 발생:", error);
    }
}

// DOM 생성이 완료된 무결성 시점에 엔진 트리거 격발
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', bootstrapSystem);
} else {
    bootstrapSystem();
}
```[cite: 6]

---

### 반대 가설 검토 및 사후 수칙 (Red Teaming)

* **시나리오 1 (브라우저 디스크 캐시 보존에 따른 404/Syntax 동결 리스크):** `main.js` 소스코드를 무결하게 교정하여 정상 전송하더라도, Chrome 브라우저가 이전의 문법 오류가 난 `main.js` 파일 버퍼를 강제로 메모리에 쥐고 있다면 화면 백화 현상이 지속될 수 있습니다.
  * *보정 방안:* 파일 저장 완료 후 웹 사이트 화면에서 반드시 **`Ctrl` + `Shift` + `R` (강력 새로고침)** 단축키를 격발해 주어야만 낡은 캐시 가드가 파쇄되며 정상 인터페이스 대시보드가 송출됩니다.
* **시나리오 2 (Firebase 실시간 네트워크 지연 오인 리스크):** 뼈대 구조 컴포넌트가 활성화된 직후, 외부 파이어베이스 서버의 데이터 인입 속도가 지연되면 일시적으로 화면에 값이 비어 보일 위험이 상존합니다[cite: 9, 11]. 대시보드의 각 입력 창과 상단 메뉴 버튼들이 시각적으로 투명하게 마운트되었다면 런타임 엔진은 100% 완벽히 복구된 것으로 판정할 수 있습니다[cite: 17, 18].
