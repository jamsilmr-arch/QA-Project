// [치명적 에러 해결] window.QA_CORE가 undefined 상태여도 터지지 않도록 전역 네임스페이스를 확실하게 먼저 선언합니다.
window.QA_CORE = window.QA_CORE || {};

// 아래는 기존 코드 그대로 유지하시면 됩니다.
window.QA_CORE.HOLIDAYS = {
    "2026-1-01": "신정",
    "2026-2-16": "설날 연휴",
    "2026-2-17": "설날",
    // ... (이전과 동일)
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