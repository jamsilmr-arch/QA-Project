// ==========================================
// 🛡️ [신규 아키텍처] 전역 런타임 에러 모니터링 인터셉터 가드 수립
// ==========================================
(function() {
    const logErrorToScreen = (type, message, source, lineno, colno, error) => {
        const errorStack = error && error.stack ? error.stack : '스택 추적 정보 없음';
        const cleanSource = source ? source.split('/').pop() : '알 수 없는 소스';
        
        // 정형화된 에러 리포트 텍스트 생성
        const reportText = `[QA SYSTEM PRO RUNTIME CRASH]\n* 발생 유형: ${type}\n* 에러 명세: ${message}\n* 타깃 파일: ${cleanSource} (라인: ${lineno || 0} / 컬럼: ${colno || 0})\n\n[상세 Stack Trace]\n${errorStack}`;
        
        // DOM 마운트 상태 검증 가드 (body가 없는 극초반 에러 대응 우회로)
        if (!document.body) {
            alert(`🚨 시스템 초기화 컴파일 실패!\n\n${reportText}`);
            return;
        }

        // 중복 레이어 생성 차단 가드
        if (document.getElementById('qa-system-error-dashboard')) return;

        // 세련된 다크 고대비 에러 모니터링 패널 디바이스 동적 생성
        const errorPanel = document.createElement('div');
        errorPanel.id = 'qa-system-error-dashboard';
        errorPanel.style.cssText = 'position:fixed; top:0; left:0; width:100vw; height:100vh; background:rgba(15,23,42,0.98); color:#f8fafc; padding:40px; box-sizing:border-box; z-index:999999; font-family:monospace; display:flex; flex-direction:column; gap:20px; overflow-y:auto;';
        
        errorPanel.innerHTML = `
            <div style="display:flex; justify-content:space-between; align-items:center; border-bottom:2px solid #ef4444; padding-bottom:15px;">
                <h1 style="margin:0; font-size:22px; color:#ef4444; font-weight:bold; display:flex; align-items:center; gap:10px;">🚨 시스템 런타임 차단 결함 검출</h1>
                <button id="btn-err-panel-close" style="background:#334155; color:#fff; border:none; padding:6px 16px; border-radius:6px; font-weight:bold; cursor:pointer;">화면 닫기 [X]</button>
            </div>
            <div style="background:#1e293b; border:1px solid #334155; padding:20px; border-radius:8px;">
                <div style="font-size:14px; color:#94a3b8; font-weight:700; margin-bottom:8px; text-transform:uppercase;">Crash Summary</div>
                <div style="font-size:15px; color:#f1f5f9; line-height:1.6; white-space:pre-wrap; font-weight:bold;">${message}</div>
            </div>
            <div style="display:grid; grid-template-columns:1fr 1fr; gap:15px;">
                <div style="background:#1e293b; padding:12px; border-radius:6px; border:1px solid #334155;">📁 발생 소스 파일: <span style="color:#38bdf8; font-weight:bold;">${cleanSource}</span></div>
                <div style="background:#1e293b; padding:12px; border-radius:6px; border:1px solid #334155;">📍 정밀 에러 라인: <span style="color:#fbbf24; font-weight:bold;">${lineno || '개별 스택 확인'}번째 줄</span></div>
            </div>
            <div style="flex:1; display:flex; flex-direction:column; gap:8px;">
                <div style="display:flex; justify-content:space-between; align-items:center;"><span style="font-size:13px; color:#94a3b8; font-weight:700;">💻 DETAILED EXCEPTION STACK TRACK (디버깅용 정보)</span><button id="btn-err-copy" style="background:#ef4444; color:#fff; border:none; padding:4px 12px; border-radius:4px; font-size:12px; font-weight:bold; cursor:pointer;">로그 복사하기</button></div>
                <textarea readonly style="width:100%; flex:1; background:#0f172a; border:1px solid #334155; border-radius:8px; color:#f43f5e; padding:15px; font-size:12px; line-height:1.5; font-family:monospace; resize:none; outline:none; box-sizing:border-box;">${reportText}</textarea>
            </div>
        `;

        document.body.appendChild(errorPanel);

        // 복사 및 패널 폐쇄 바인딩 트랙 가동
        document.getElementById('btn-err-panel-close').onclick = () => errorPanel.remove();
        document.getElementById('btn-err-copy').onclick = () => {
            navigator.clipboard.writeText(reportText).then(() => alert("에러 디버깅 리포트가 클립보드에 전격 복사되었습니다."));
        };
    };

    // 1. 일반 스크립트 실행 에러 및 동적 컴파일 문법 예외 트래킹 가드
    window.onerror = function(message, source, lineno, colno, error) {
        logErrorToScreen('일반 스크립트 런타임 에러 (window.onerror)', message, source, lineno, colno, error);
        return false; // 브라우저 콘솔에도 중복 송출되도록 패스 설정
    };

    // 2. 비동기 처리(Promise)단에서 거부된 예외 처리 누락 가드
    window.addEventListener('unhandledrejection', function(event) {
        const reason = event.reason;
        const msg = reason instanceof Error ? reason.message : String(reason);
        logErrorToScreen('비동기 파이프라인 에러 (Unhandled Rejection)', msg, reason?.fileName || 'Promise Async Layer', reason?.lineNumber || 0, 0, reason);
    });
})();

// ==========================================
// 📦 백본 시스템 기구축 기존 데이터 레코드 레이어
// ==========================================
window.QA_CORE = window.QA_CORE || {};

window.QA_CORE.HOLIDAYS = {
    "2026-1-01": "신정", "2026-2-16": "설날 연휴", "2026-2-17": "설날", "2026-2-18": "설날 연휴",
    "2026-3-01": "삼일절", "2026-3-02": "대체공휴일", "2026-5-05": "어린이날", "2026-5-24": "부처님오신날",
    "2026-5-25": "대체공휴일", "2026-6-03": "지방선거", "2026-6-06": "현충일", "2026-7-17": "제헌절",
    "2026-8-15": "광복절", "2026-8-17": "대체공휴일", "2026-9-24": "추석 연휴", "2026-9-25": "추석",
    "2026-9-26": "추석 연휴", "2026-10-03": "개천절", "2026-10-05": "대체공휴일", "2026-10-09": "한글날",
    "2026-12-25": "성탄절"
};

window.QA_CORE.CONSTANTS = {
    STORAGE_KEYS: {
        CALENDAR: 'QA_SYSTEM_CALENDAR',
        BOOKMARKS: 'QA_SYSTEM_BOOKMARKS',
        FOLDERS: 'QA_SYSTEM_BOOKBAR_FOLDERS_PURE',
        DB_URL: 'QA_SETTING_DB_URL'
    },
    DEFAULT_PLATFORM: 'calendar'
};
```[cite: 4]
