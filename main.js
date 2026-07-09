import { initCoreSystem, switchTab } from './app.js';
import { initIssuePanel } from './issue.js';
import { initCalendarPanel } from './calendar-view.js';
import './bookmark.js'; 
import './kpi.js'; 
import './schedule.js';
import './calendar.js'; // [정정] calendar Core의 동적 런타임 인스턴스를 메모리에 확실히 상주시키기 위해 명시적 결합

window.QA_CORE = window.QA_CORE || {};
window.QA_CORE.Router = {
    switchTab: switchTab
};

const SETTINGS_MODAL_TEMPLATE = `
    <div class="modal-container settings-modal-fixed">
        <div class="modal-header" style="display:flex; justify-content:space-between; align-items:center; padding:15px 20px; border-bottom:1px solid var(--border-color);">
            <h2 id="modal-title" style="font-size:1.1rem; font-weight:700;">⚙️ 시스템 환경 설정</h2>
            <button class="modal-close" id="close-settings-btn" aria-label="환경 설정 닫기" style="background:none; border:none; font-size:20px; cursor:pointer;">&times;</button>
        </div>
        <div class="modal-body settings-group-wrapper" style="padding:20px; overflow-y:auto; max-height:70vh;">
            <div class="settings-card layout-vertical">
                <div class="settings-section-title">🔒 Firebase 동기화 설정</div>
                <div class="form-group">
                    <label for="set-db-url">Realtime Database URL</label>
                    <input type="text" id="set-db-url" class="config-input-field" placeholder="https://your-database.firebaseio.com">
                </div>
            </div>
        </div>
        <div class="modal-footer" style="padding:15px 20px; border-top:1px solid var(--border-color); display:flex; justify-content:flex-end; gap:10px; background:#f8fafc; border-radius:0 0 8px 8px;">
            <button class="btn-admin-sync" id="btn-settings-reset" style="padding:8px 16px; border-radius:6px; font-weight:bold; cursor:pointer;">초기화</button>
            <button class="btn-settings-save" id="btn-settings-save" style="padding:8px 16px; background:var(--accent-blue); color:white; border:none; border-radius:6px; font-weight:bold; cursor:pointer;">설정 저장</button>
        </div>
    </div>
`;

window.QA_CORE.Settings = {
    init() {
        const modalOverlay = document.getElementById('settings-modal');
        if (!modalOverlay) return;
        modalOverlay.innerHTML = SETTINGS_MODAL_TEMPLATE;

        const openBtn = document.getElementById('open-settings-btn');
        const closeBtn = document.getElementById('close-settings-btn');
        const saveBtn = document.getElementById('btn-settings-save');
        const resetBtn = document.getElementById('btn-settings-reset');

        if (openBtn) openBtn.addEventListener('click', () => modalOverlay.classList.remove('d-none'));
        if (closeBtn) closeBtn.addEventListener('click', () => modalOverlay.classList.add('d-none'));
        
        modalOverlay.addEventListener('click', (e) => {
            if (e.target === modalOverlay) modalOverlay.classList.add('d-none');
        });

        if (saveBtn) {
            saveBtn.addEventListener('click', () => {
                const dbUrl = document.getElementById('set-db-url').value.trim();
                localStorage.setItem('QA_SETTING_DB_URL', dbUrl);
                modalOverlay.classList.add('d-none');
                if (window.QA_CORE.UI) window.QA_CORE.UI.showToast("환경 설정이 안전하게 반영되었습니다.");
            });
        }
        if (resetBtn) {
            resetBtn.addEventListener('click', () => {
                document.getElementById('set-db-url').value = '';
            });
        }
    }
};

function bootstrapSystem() {
    try {
        // 1. 캘린더 판넬 뼈대를 확실하게 먼저 DOM에 심어 렌더러의 목적지 타겟을 동기 확보합니다.
        initIssuePanel();
        initCalendarPanel();

        // 2. 백본 시스템 부트스트랩 트리거
        if (typeof initCoreSystem === 'function') initCoreSystem();
        window.QA_CORE.Settings.init();

        // 3. [치명적 결함 해결] 돔이 완전히 마운트된 직후 캘린더 그리드 강제 즉시 렌더링 호출
        if (window.QA_CORE.Calendar && window.QA_CORE.Calendar.Render) {
            window.QA_CORE.Calendar.Render.renderCalendarAll();
        }

        // 4. 라우터 이벤트 위임 리스너 동기화
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

if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', bootstrapSystem);
} else {
    bootstrapSystem();
}