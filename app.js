// schedule.js 모듈 및 전역 레이어 공유용 Firebase 설정 정의
export const firebaseConfig = {
    apiKey: "****", authDomain: "****", databaseURL: "****",
    projectId: "****", storageBucket: "****", messagingSenderId: "****", appId: "****"
};

window.QA_CORE = window.QA_CORE || {};
window.QA_CORE.firebaseConfig = firebaseConfig;

let currentPlatform = 'calendar'; 

// 💡 [신규 엔진] 글로벌 중앙 클라우드 동기화 섀도잉(Proxy & Hydration)
window.QA_CORE.GlobalSync = {
    currentUser: null,
    isHydrating: false, // 서버 다운로드 중 로컬 덮어쓰기 무한루프 방지 락(Lock)
    originalSetItem: Storage.prototype.setItem, // 브라우저 순정 API 백업

    init() {
        this.injectGlobalAuthUI();
        this.interceptStorage();
        this.listenAuthState();
    },

    // 글로벌 로그인/로그아웃 버튼을 우측 상단 헤더에 자동 주입
    injectGlobalAuthUI() {
        const headerRight = document.querySelector('.header-right');
        if (headerRight && !document.getElementById('global-auth-btn')) {
            const authBtn = document.createElement('button');
            authBtn.id = 'global-auth-btn';
            authBtn.className = 'btn-cal-nav';
            authBtn.style.cssText = 'display:flex; align-items:center; gap:4px; font-weight:bold; background:#0284c7; color:white; margin-right:8px; border:none; padding: 6px 12px; border-radius: 6px; cursor: pointer; transition: 0.2s;';
            authBtn.innerHTML = '🔑 클라우드 동기화 켜기';
            authBtn.onclick = () => this.toggleAuth();
            headerRight.prepend(authBtn); 
        }
    },

    toggleAuth() {
        if (typeof firebase === 'undefined') return;
        if (this.currentUser) {
            firebase.auth().signOut();
        } else {
            const provider = new firebase.auth.GoogleAuthProvider();
            firebase.auth().signInWithPopup(provider).catch(e => alert("로그인 실패: " + e.message));
        }
    },

    listenAuthState() {
        if (typeof firebase === 'undefined') return;
        firebase.auth().onAuthStateChanged(user => {
            const authBtn = document.getElementById('global-auth-btn');
            if (user) {
                this.currentUser = user;
                if (authBtn) {
                    authBtn.innerHTML = '🔓 연결 해제 (오프라인)';
                    authBtn.style.background = '#ef4444';
                }
                if (window.QA_CORE.UI && window.QA_CORE.UI.showToast) {
                    window.QA_CORE.UI.showToast(`✅ [${user.email}] 클라우드 실시간 동기화 동작 중`);
                }
                this.hydrateFromServer(); // 로그인 성공 시 서버 데이터 브라우저에 이식
            } else {
                this.currentUser = null;
                if (authBtn) {
                    authBtn.innerHTML = '🔑 클라우드 동기화 켜기';
                    authBtn.style.background = '#0284c7';
                }
                if (window.QA_CORE.UI && window.QA_CORE.UI.showToast) {
                    window.QA_CORE.UI.showToast(`로컬 오프라인 모드로 전환되었습니다.`);
                }
            }
        });
    },

    // 💡 네이티브 localStorage API 가로채기 (Monkey Patching)
    interceptStorage() {
        const self = this;
        Storage.prototype.setItem = function(key, value) {
            // 원본 순정 함수를 호출하여 브라우저 로컬 스토리지에는 정상 저장
            self.originalSetItem.apply(this, arguments);

            // 로그인 상태 & Hydration 락 해제 & QA_ 관련 데이터일 경우만 서버로 전송
            if (self.currentUser && !self.isHydrating && key.startsWith('QA_')) {
                const uid = self.currentUser.uid;
                firebase.database().ref(`users/${uid}/appData/${key}`).set(value)
                    .catch(err => console.error('Cloud Sync Write Failed:', err));
            }
        };
    },

    // 💡 서버에서 데이터를 받아와 브라우저 로컬 저장소를 덮어씌움
    hydrateFromServer() {
        if (!this.currentUser) return;
        this.isHydrating = true; // 무한 루프 차단
        const uid = this.currentUser.uid;

        firebase.database().ref(`users/${uid}/appData`).once('value', snapshot => {
            const serverData = snapshot.val();
            if (serverData) {
                // 프록시를 거치지 않는 순정 함수를 사용하여 데이터 강제 덮어쓰기
                Object.keys(serverData).forEach(key => {
                    this.originalSetItem.call(localStorage, key, serverData[key]);
                });

                // 데이터 이식 완료 후 모든 모듈 렌더링 리부트
                if (window.QA_CORE.SkillManager) {
                    window.QA_CORE.SkillManager.initAll();
                }
                if (window.QA_CORE.Calendar && window.QA_CORE.Calendar.Render) {
                    window.QA_CORE.Calendar.Render.renderCalendarAll();
                }
            } else {
                // 서버에 데이터가 없는 신규 로그인 유저면, 현재 작성해둔 로컬 데이터를 서버에 최초 이관
                this.uploadAllLocalData();
            }
            this.isHydrating = false; 
        });
    },

    uploadAllLocalData() {
        const uid = this.currentUser.uid;
        const payload = {};
        for (let i = 0; i < localStorage.length; i++) {
            const key = localStorage.key(i);
            if (key.startsWith('QA_')) {
                payload[key] = localStorage.getItem(key);
            }
        }
        if (Object.keys(payload).length > 0) {
            firebase.database().ref(`users/${uid}/appData`).set(payload);
        }
    }
};

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
    window.QA_CORE.GlobalSync.init(); // 💡 프록시 엔진 최우선 선제 기동
    
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

// 4. 유실된 입력 폼 파싱 인터페이스 엔진 복구 결합
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
    
    if (saveBtn) {
        saveBtn.onclick = () => {
            if (window.QA_CORE.Calendar.Schedule && typeof window.QA_CORE.Calendar.Schedule.addCalendarEvent === 'function') {
                window.QA_CORE.Calendar.Schedule.addCalendarEvent();
            } else {
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
