// schedule.js 모듈 및 전역 레이어 공유용 Firebase 설정 정의
export const firebaseConfig = {
    apiKey: "****", authDomain: "****", databaseURL: "****",
    projectId: "****", storageBucket: "****", messagingSenderId: "****", appId: "****"
};

window.QA_CORE = window.QA_CORE || {};
window.QA_CORE.firebaseConfig = firebaseConfig;

let currentPlatform = 'calendar'; 

// 1. 중앙 모듈 플러그인 매니저
window.QA_CORE.SkillManager = {
    skills: {},
    register(name, skillModule) { this.skills[name] = skillModule; },
    initAll() {
        Object.keys(this.skills).forEach(name => {
            try {
                if (this.skills[name] && typeof this.skills[name].init === 'function') {
                    this.skills[name].init();
                }
            } catch (error) { console.error(`[SkillManager] '${name}' 구동 실패:`, error); }
        });
    }
};

// 2. 부트스트랩 엔진 구동
export function initCoreSystem() {
    window.QA_CORE.SkillManager.initAll();
    loadInitialData();

    if (window.QA_CORE.Calendar && window.QA_CORE.Calendar.Render) {
        window.QA_CORE.Calendar.Render.renderCalendarAll();
    }
    initCalendarTriggers();
}

// 3. 전역 탭 네비게이션 라우터
export function switchTab(tabId) {
    currentPlatform = tabId;
    const panels = document.querySelectorAll('.content-panel');
    panels.forEach(panel => panel.classList.remove('active'));
    
    const targetPanel = document.getElementById(`tab-panel-${tabId}`);
    if (targetPanel) targetPanel.classList.add('active');
    
    const tabs = document.querySelectorAll('.tab-btn');
    tabs.forEach(tab => {
        tab.classList.remove('active');
        tab.setAttribute('aria-selected', 'false');
    });
    
    const targetTab = document.getElementById(`tab-btn-${tabId}`);
    if (targetTab) {
        targetTab.classList.add('active');
        targetTab.setAttribute('aria-selected', 'true');
    }
    
    if (tabId === 'calendar' && window.QA_CORE.Calendar && window.QA_CORE.Calendar.Render) {
        window.QA_CORE.Calendar.Render.renderCalendarAll();
    }
}

// 4. [정정] 유실된 입력 폼 파싱 인터페이스 엔진을 원천 복구 결합합니다.
function initCalendarTriggers() {
    const prevBtn = document.getElementById('cal-prev-btn');
    const nextBtn = document.getElementById('cal-next-btn');
    const todayBtn = document.getElementById('cal-today-btn');
    const saveBtn = document.getElementById('save-event-btn');
    const tcCountBtn = document.getElementById('btn-tc-count-hub');
    
    if (tcCountBtn) {
        tcCountBtn.onclick = () => {
            if (window.QA_CORE.Calendar.Schedule && typeof window.QA_CORE.Calendar.Schedule.triggerTcCountFlow === 'function') {
                window.QA_CORE.Calendar.Schedule.triggerTcCountFlow();
            }
        };
    }
    
    if (prevBtn) {
        prevBtn.onclick = () => {
            if (window.QA_CORE.Calendar.State) {
                const date = window.QA_CORE.Calendar.State.currentCalendarDate;
                date.setMonth(date.getMonth() - 1);
                window.QA_CORE.Calendar.Render.renderCalendarAll();
            }
        };
    }
    
    if (nextBtn) {
        nextBtn.onclick = () => {
            if (window.QA_CORE.Calendar.State) {
                const date = window.QA_CORE.Calendar.State.currentCalendarDate;
                date.setMonth(date.getMonth() + 1);
                window.QA_CORE.Calendar.Render.renderCalendarAll();
            }
        };
    }
    
    if (todayBtn) {
        todayBtn.onclick = () => {
            if (window.QA_CORE.Calendar.State) {
                window.QA_CORE.Calendar.State.currentCalendarDate = new Date();
                window.QA_CORE.Calendar.Render.renderCalendarAll();
            }
        };
    }
    
    // [치명적 결함 해결] 폼 입력 추출 런타임을 정밀 결합하여 schedule.js의 핵심 연산 엔진을 호출합니다.
    if (saveBtn) {
        saveBtn.onclick = () => {
            if (window.QA_CORE.Calendar.Schedule && typeof window.QA_CORE.Calendar.Schedule.addCalendarEvent === 'function') {
                window.QA_CORE.Calendar.Schedule.addCalendarEvent();
            } else {
                // 스케줄 독립 모듈 미기동 시 예외 가드 가동
                const startDate = document.getElementById('cal-start-date').value;
                const endDate = document.getElementById('cal-end-date').value;
                const title = document.getElementById('cal-title').value.trim();
                const url = document.getElementById('cal-url') ? document.getElementById('cal-url').value.trim() : '';

                if (!startDate || !endDate || !title) { alert("필수 기입 사항이 누락되었습니다."); return; }
                
                let currentEvents = window.QA_CORE.Calendar.State.calendarEvents || [];
                const newEvent = { id: Date.now(), startDate, endDate, title, url };
                currentEvents.push(newEvent);
                
                window.QA_CORE.Calendar.State.calendarEvents = currentEvents;
                localStorage.setItem('QA_SYSTEM_CALENDAR', JSON.stringify(currentEvents));
                
                // 폼 비우기
                document.getElementById('cal-title').value = '';
                document.getElementById('cal-url').value = '';
                
                if (window.QA_CORE.Calendar.Render) window.QA_CORE.Calendar.Render.renderCalendarAll();
            }
        };
    }
}

// 5. 초기 스토리지 데이터 마운트 인프라
function loadInitialData() {
    window.QA_CORE.Calendar = window.QA_CORE.Calendar || {};
    window.QA_CORE.Calendar.State = window.QA_CORE.Calendar.State || {
        currentCalendarDate: new Date(),
        calendarEvents: []
    };

    const localData = localStorage.getItem('QA_SYSTEM_CALENDAR');
    if (localData) {
        try { window.QA_CORE.Calendar.State.calendarEvents = JSON.parse(localData) || []; } 
        catch (e) { window.QA_CORE.Calendar.State.calendarEvents = []; }
    }
}