import { initCoreSystem, switchTab } from './app.js';
import { initIssuePanel } from './issue.js';
import { initCalendarPanel } from './calendar-view.js';
import { initTcPanel } from './tc.js'; 
import './bookmark.js'; 
import './kpi.js'; 
import './schedule.js';
import './calendar.js'; 

window.QA_CORE = window.QA_CORE || {};
window.QA_CORE.Router = {
    switchTab: switchTab
};

function bootstrapSystem() {
    try {
        if (typeof initIssuePanel === 'function') initIssuePanel();
        if (typeof initCalendarPanel === 'function') initCalendarPanel();
        if (typeof initTcPanel === 'function') initTcPanel(); 
        if (typeof initCoreSystem === 'function') initCoreSystem();
        
        if (window.QA_CORE.Settings && typeof window.QA_CORE.Settings.init === 'function') {
            window.QA_CORE.Settings.init();
        }

        if (window.QA_CORE.Calendar && window.QA_CORE.Calendar.Render) {
            window.QA_CORE.Calendar.Render.renderCalendarAll();
        }

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
