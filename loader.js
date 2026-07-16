window.QA_CORE = window.QA_CORE || {};

// 전역 UI 컴포넌트 관리 객체
window.QA_CORE.UI = {
    showToast(message) {
        let toast = document.getElementById('qa-core-toast');
        if (!toast) {
            toast = document.createElement('div');
            toast.id = 'qa-core-toast';
            toast.className = 'toast-message';
            document.body.appendChild(toast);
        }
        
        toast.innerText = message;
        toast.classList.add('show');
        
        setTimeout(() => {
            toast.classList.remove('show');
        }, 3000);
    }
};

// 앱 중앙 초기화 (부트스트랩) 매니저
window.QA_CORE.App = {
    init() {
        // 1. 기존 캘린더 스케줄러 모듈 구동
        if (window.QA_CORE.Calendar && window.QA_CORE.Calendar.Schedule) {
            window.QA_CORE.Calendar.Schedule.init();
        }

        // 💡 [신규 추가] 양식 관리(Template) 모듈 구동 파이프라인 결속
        // 스크립트 로딩 지연 에러를 방어하기 위한 안전성 검사(Guard) 필수 포함
        if (window.QA_CORE.Template && window.QA_CORE.Template.Manager) {
            if (typeof window.QA_CORE.Template.Manager.init === 'function') {
                window.QA_CORE.Template.Manager.init();
            }
        }
    }
};
