// 시스템 환경 설정 모달 패널 마크업 명세 (Glassmorphism 디자인 규격 동기화)
export const SETTINGS_TEMPLATE = `
    <div id="system-settings-overlay" style="position: fixed; top: 0; left: 0; width: 100vw; height: 100vh; background: rgba(0, 0, 0, 0.4); display: none; justify-content: center; align-items: center; z-index: 20000;">
        <div style="background: #ffffff; width: 480px; padding: 24px; border-radius: 14px; box-shadow: 0 12px 36px rgba(0, 0, 0, 0.15); border: 1px solid #e2e8f0; display: flex; flex-direction: column; gap: 20px; position: relative; font-family: sans-serif;">
            
            <div style="display: flex; justify-content: space-between; align-items: center; border-bottom: 1px solid #edf2f7; padding-bottom: 12px;">
                <span style="font-size: 15px; font-weight: 700; color: #2d3748; display: flex; align-items: center; gap: 6px;">⚙️ 시스템 환경 설정</span>
                <button id="btn-settings-close-x" style="background: none; border: none; font-size: 20px; cursor: pointer; color: #a0aec0; padding: 0; line-height: 1;">&times;</button>
            </div>
            
            <div style="display: flex; flex-direction: column; gap: 14px;">
                <h4 style="margin: 0; font-size: 13px; font-weight: 700; color: #4a5568; display: flex; align-items: center; gap: 6px;">🔒 Firebase 동기화 설정</h4>
                <div style="display: flex; flex-direction: column; gap: 6px;">
                    <label for="cfg-firebase-url" style="font-size: 11px; font-weight: 700; color: #718096; text-transform: uppercase;">Realtime Database URL</label>
                    <input type="text" id="cfg-firebase-url" placeholder="https://your-database.firebaseio.com" style="width: 100%; padding: 10px 12px; border: 1px solid #cbd5e0; border-radius: 6px; font-size: 13px; color: #2d3748; box-sizing: border-box; outline: none; transition: border 0.2s;" onfocus="this.style.border='1px solid #3182ce'" onblur="this.style.border='1px solid #cbd5e0'">
                </div>
            </div>
            
            <div style="display: flex; gap: 8px; justify-content: flex-end; margin-top: 4px;">
                <button id="btn-settings-reset" style="background: #edf2f7; color: #4a5568; padding: 10px 20px; font-size: 13px; font-weight: 600; border: none; border-radius: 6px; cursor: pointer; transition: background 0.2s;" onmouseover="this.style.background='#e2e8f0'" onmouseout="this.style.background='#edf2f7'">초기화</button>
                <button id="btn-settings-save" style="background: #0066ff; color: #ffffff; padding: 10px 24px; font-size: 13px; font-weight: 700; border: none; border-radius: 6px; cursor: pointer; transition: background 0.2s; box-shadow: 0 2px 6px rgba(0,102,255,0.2);" onmouseover="this.style.background='#0052cc'" onmouseout="this.style.background='#0066ff'">설정 저장</button>
            </div>
        </div>
    </div>
`;

window.QA_CORE = window.QA_CORE || {};

window.QA_CORE.Settings = {
    init() {
        // 모달 돔 템플릿 강제 인젝션 수립
        if (!document.getElementById('system-settings-overlay')) {
            const wrapper = document.createElement('div');
            wrapper.innerHTML = SETTINGS_TEMPLATE;
            document.body.appendChild(wrapper.firstElementChild);
        }

        this.loadSavedConfig();
        this.bindEventsGlobal();
    },

    /**
     * 로컬 스토리지에 세션 보존되어 있던 데이터베이스 주소를 읽어 폼 필드에 주입합니다.
     */
    loadSavedConfig() {
        const savedUrl = localStorage.getItem('QA_SYSTEM_FIREBASE_URL');
        const urlInput = document.getElementById('cfg-firebase-url');
        if (urlInput && savedUrl) {
            urlInput.value = savedUrl;
            
            // 기존 전역 설정 객체 컨텍스트 실시간 동기화 바인딩
            window.QA_CORE.firebaseConfig = window.QA_CORE.firebaseConfig || {};
            window.QA_CORE.firebaseConfig.databaseURL = savedUrl;
        }
    },

    /**
     * 헤더 영역의 ⚙️ 버튼과 모달 제어용 버튼들의 이벤트 핸들러를 전역 레이어에 동색 결속합니다.
     */
    bindEventsGlobal() {
        // 1. 헤더 우측 상단 ⚙️ 아이콘 버튼 트래킹 위임 가동
        document.addEventListener('click', (e) => {
            const gearBtn = e.target.closest('.header-controls button') || 
                           e.target.closest('#btn-system-settings-trigger') ||
                           (e.target.innerText && e.target.innerText.indexOf('⚙️') !== -1) ||
                           e.target.closest('span[style*="font-size: 1.2rem; cursor: pointer;"]'); // 스타일 구조체 가드
            
            if (gearBtn && !e.target.closest('#system-settings-overlay')) {
                e.stopPropagation();
                this.openModal(true);
            }
        });

        // 2. 모달 팝업 내부 액션 버튼 핸들러 연결
        const overlay = document.getElementById('system-settings-overlay');
        if (overlay) {
            overlay.addEventListener('click', (e) => {
                if (e.target === overlay) this.openModal(false);
            });

            const closeX = document.getElementById('btn-settings-close-x');
            if (closeX) closeX.onclick = () => this.openModal(false);

            // 초기화 버튼 격발 시 폼 초기화 수행
            const resetBtn = document.getElementById('btn-settings-reset');
            if (resetBtn) {
                resetBtn.onclick = () => {
                    if (confirm("시스템 동기화 설정을 공백 상태로 초기화하시겠습니까?")) {
                        const urlInput = document.getElementById('cfg-firebase-url');
                        if (urlInput) urlInput.value = '';
                    }
                };
            }

            // 설정 저장 실행 파이프라인
            const saveBtn = document.getElementById('btn-settings-save');
            if (saveBtn) {
                saveBtn.onclick = () => {
                    const urlInput = document.getElementById('cfg-firebase-url');
                    if (urlInput) {
                        const inputUrl = urlInput.value.trim();
                        this.saveConfigPipeline(inputUrl);
                    }
                };
            }
        }
    },

    openModal(show) {
        const overlay = document.getElementById('system-settings-overlay');
        if (overlay) {
            overlay.style.display = show ? 'flex' : 'none';
            if (show) this.loadSavedConfig(); // 오픈 시점에 저장 데이터 최신 스크리닝
        }
    },

    /**
     * 입력 데이터를 로컬에 박제하고 데이터베이스 엔진 인스턴스를 무결화합니다.
     */
    saveConfigPipeline(url) {
        if (url && !url.startsWith('http://') && !url.startsWith('https://')) {
            alert("유효하지 않은 URL 형식입니다. 프로토콜(https://)을 포함하여 입력하십시오.");
            return;
        }

        // 스토리지 물리 영속화
        localStorage.setItem('QA_SYSTEM_FIREBASE_URL', url);
        
        window.QA_CORE.firebaseConfig = window.QA_CORE.QA_CORE_CONFIG || window.QA_CORE.firebaseConfig || {};
        window.QA_CORE.firebaseConfig.databaseURL = url;

        // Firebase 라이브 런타임 인스턴스 주소 가드 재컴파일
        if (typeof firebase !== 'undefined' && url) {
            try {
                if (firebase.apps.length > 0) {
                    // [DEFAULT] 앱 참조를 삭제 후 실시간 리인젝션 처리하여 경합 충돌 차단
                    firebase.app().delete().then(function() {
                        firebase.initializeApp(window.QA_CORE.firebaseConfig);
                    });
                } else {
                    firebase.initializeApp(window.QA_CORE.firebaseConfig);
                }
            } catch (e) {
                console.error("Firebase 실시간 런타임 초기화 오버헤드: ", e);
            }
        }

        if (window.QA_CORE.UI && typeof window.QA_CORE.UI.showToast === 'function') {
            window.QA_CORE.UI.showToast("⚙️ 시스템 환경 설정이 안전하게 저장되었습니다.");
        } else {
            alert("시스템 환경 설정이 저장되었습니다.");
        }
        
        this.openModal(false);
        
        // 캘린더나 스케줄러가 새 DB 컨텍스트를 읽을 수 있도록 세션 컴포넌트 전체 리리프레시 트리거
        if (window.QA_CORE.Calendar && window.QA_CORE.Calendar.Schedule && typeof window.QA_CORE.Calendar.Schedule.init === 'function') {
            window.QA_CORE.Calendar.Schedule.init();
        }
    }
};

// 메인 앱 실행 시 설정 모달 자가 기동 가드 수립
document.addEventListener('DOMContentLoaded', () => {
    window.QA_CORE.Settings.init();
});

// SkillManager 모듈 허브 자동 인젝션 마운트
if (window.QA_CORE.SkillManager && typeof window.QA_CORE.SkillManager.register === 'function') {
    window.QA_CORE.SkillManager.register('SystemSettingsModule', window.QA_CORE.Settings);
}