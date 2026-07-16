// 💡 사용자 발급 실측 Firebase SDK 설정 정보 정의
export const firebaseConfig = {
    apiKey: "AIzaSyBATBf16h4DQu06pY5sGfmUtPiMmO4Qvqg",
    authDomain: "qa-system-pro.firebaseapp.com",
    databaseURL: "https://qa-system-pro-default-rtdb.asia-southeast1.firebasedatabase.app",
    projectId: "qa-system-pro",
    storageBucket: "qa-system-pro.firebasestorage.app",
    messagingSenderId: "58795006709",
    appId: "1:58795006709:web:4fefa5057d2b04b61183bc",
    measurementId: "G-E5J8CN9YDJ"
};

window.QA_CORE = window.QA_CORE || {};
window.QA_CORE.firebaseConfig = firebaseConfig;

let currentPlatform = 'calendar'; 

// 💡 글로벌 중앙 클라우드 동기화 섀도잉 엔진 (Proxy & Hydration)
window.QA_CORE.GlobalSync = {
    currentUser: null,
    isHydrating: false, // 서버 패치 중 무한 루프 트리거 방지 락
    originalSetItem: Storage.prototype.setItem, // 브라우저 원본 API 백업

    init() {
        this.injectGlobalAuthUI();
        this.interceptStorage();
        this.listenAuthState();
    },

    // 라이트 테마에 맞춤 설계된 클라우드 연동 제어 버튼 헤더 주입
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
                this.hydrateFromServer(); 
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

    // 브라우저 로컬스토리지 쓰기 인터셉트 및 실시간 파이어베이스 미러링
    interceptStorage() {
        const self = this;
        Storage.prototype.setItem = function(key, value) {
            // 브라우저 내부 스토리지 데이터 적재 수행
            self.originalSetItem.apply(this, arguments);

            // 로그인 활성화 및 시스템 핵심 접두사(QA_) 탐색 시 섀도우 업로드 작동
            if (self.currentUser && !self.isHydrating && key.startsWith('QA_')) {
                const uid = self.currentUser.uid;
                firebase.database().ref(`users/${uid}/appData/${key}`).set(value)
                    .catch(err => console.error('Cloud Sync Write Failed:', err));
            }
        };
    },

    // 클라우드 백업 데이터를 다운받아 브라우저 로컬 저장소 갱신 및 뷰 리부팅
    hydrateFromServer() {
        if (!this.currentUser) return;
        this.isHydrating = true; 
        const uid = this.currentUser.uid;

        firebase.database().ref(`users/${uid}/appData`).once('value', snapshot => {
            const serverData = snapshot.val();
            if (serverData) {
                // 무한 루프 우회를 위해 순정 API 함수를 호출하여 브라우저 저장소 동기화
                Object.keys(serverData).forEach(key => {
                    this.originalSetItem.call(localStorage, key, serverData[key]);
                });

                // 뷰 컴포넌트 실시간 하이드레이션 격발
                if (window.QA_CORE.SkillManager) {
                    window.QA_CORE.SkillManager.initAll();
                }
                if (window.QA_CORE.Calendar && window.QA_CORE.Calendar.Render) {
                    window.QA_CORE.Calendar.Render.renderCalendarAll();
                }
            } else {
                // 클라우드 원본 데이터 부재 시 현재 로컬 데이터를 마스터 데이터로 전송 이관
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
    window.QA_CORE.GlobalSync.init(); // 프록시 후킹 엔진 최선순위 가동
    
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

// 4. 입력 폼 파싱 인터페이스 엔진 결속
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

// 5. 초기 로컬 스토리지 마운트 세팅
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
