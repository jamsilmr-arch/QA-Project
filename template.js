window.QA_CORE = window.QA_CORE || {};
window.QA_CORE.Template = window.QA_CORE.Template || {};

window.QA_CORE.Template.Manager = {
    init() {
        const panelZone = document.getElementById('tab-panel-template');
        if (panelZone) {
            // 양식 관리 메인 UI 렌더링 구역
            panelZone.innerHTML = `
                <div class="content-panel active" style="padding: 20px; background: #ffffff; border-radius: 8px; box-shadow: 0 4px 18px rgba(0,0,0,0.02);">
                    <h2 style="font-size: 1.2rem; font-weight: 700; color: #1e293b; margin-bottom: 16px;">📄 업무 양식 관리 보드</h2>
                    <p style="font-size: 13px; color: #64748b; margin-bottom: 20px;">자주 사용하는 정형화된 업무 양식을 원클릭으로 복사하여 활용하십시오.</p>
                    
                    <button id="btn-copy-sample-template" style="background:#0284c7; color:white; border:none; padding:8px 16px; font-size:12px; font-weight:bold; border-radius:6px; cursor:pointer;">
                        샘플 양식 복사
                    </button>
                </div>
            `;
            this.bindEvents();
        }
    },

    bindEvents() {
        const copyBtn = document.getElementById('btn-copy-sample-template');
        if (copyBtn) {
            copyBtn.onclick = () => {
                // 💡 클립보드 복사 로직 등 수행 후...
                
                // 💡 [핵심] 기존 alert() 대신 글로벌 Toast UI를 호출하여 부드러운 알림 제공
                if (window.QA_CORE.UI && typeof window.QA_CORE.UI.showToast === 'function') {
                    window.QA_CORE.UI.showToast("✅ 양식이 클립보드에 복사되었습니다.");
                } else {
                    alert("✅ 양식이 클립보드에 복사되었습니다.");
                }
            };
        }
    }
};

export function initTemplatePanel() {
    window.QA_CORE.Template.Manager.init();
}
