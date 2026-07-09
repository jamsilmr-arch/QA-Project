window.QA_CORE = window.QA_CORE || {};

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

window.QA_CORE.App = {
    init() {
        if (window.QA_CORE.Calendar && window.QA_CORE.Calendar.Schedule) {
            window.QA_CORE.Calendar.Schedule.init();
        }
    }
};