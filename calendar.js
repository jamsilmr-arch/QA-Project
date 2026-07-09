window.QA_CORE = window.QA_CORE || {};
window.QA_CORE.Calendar = window.QA_CORE.Calendar || {};

// 2026~2027 대한민국 공휴일 및 대체공휴일 마스터 데이터
const holiDataMaster = {
    "2026-1-01": "신정", "2026-2-16": "설날 연휴", "2026-2-17": "설날", "2026-2-18": "설날 연휴",
    "2026-3-01": "삼일절", "2026-3-02": "대체공휴일", "2026-5-05": "어린이날", "2026-5-24": "부처님오신날",
    "2026-5-25": "대체공휴일", "2026-6-03": "지방선거", "2026-6-06": "현충일", "2026-7-17": "제헌절",
    "2026-8-15": "광복절", "2026-8-17": "대체공휴일", "2026-9-24": "추석 연휴", "2026-9-25": "추석",
    "2026-9-26": "추석 연휴", "2026-10-03": "개천절", "2026-10-05": "대체공휴일", "2026-10-09": "한글날",
    "2026-12-25": "성탄절", "2027-1-01": "신정", "2027-2-06": "설날 연휴", "2027-2-07": "설날",
    "2027-2-08": "설날 연휴", "2027-2-09": "대체공휴일", "2027-3-01": "삼일절", "2027-5-05": "어린이날",
    "2027-5-13": "부처님오신날", "2027-6-06": "현충일", "2027-7-17": "제헌절", "2027-8-15": "광복절",
    "2027-8-16": "대체공휴일", "2027-9-14": "추석 연휴", "2027-9-15": "추석", "2027-9-16": "추석 연휴",
    "2027-10-03": "개천절", "2027-10-04": "대체공휴일", "2027-10-09": "한글날", "2027-12-25": "성탄절"
};

// 전역 네임스페이스 컨텍스트 구조 보장
window.QA_CORE.Calendar.State = window.QA_CORE.Calendar.State || {
    currentCalendarDate: new Date(),
    calendarEvents: [],
    editingEventId: null
};

window.QA_CORE.Calendar.Render = {
    renderCalendarAll() {
        const state = window.QA_CORE.Calendar.State;
        
        // [보안] 데이터가 유실되었을 경우 브라우저 스토리지 보관본 즉시 복원
        if (!state.calendarEvents || state.calendarEvents.length === 0) {
            const backup = localStorage.getItem('QA_SYSTEM_CALENDAR');
            if (backup) {
                try { state.calendarEvents = JSON.parse(backup) || []; } catch(e) { console.error(e); }
            }
        }

        const year = state.currentCalendarDate.getFullYear();
        const month = state.currentCalendarDate.getMonth(); 

        const titleEl = document.getElementById('calendar-month-year-title');
        if (titleEl) {
            titleEl.innerText = `${year}년 ${month + 1}월`;
        }

        const gridZone = document.getElementById('calendar-grid-zone');
        if (!gridZone) return;
        gridZone.innerHTML = '';

        const firstDayIndex = new Date(year, month, 1).getDay();
        const lastDate = new Date(year, month + 1, 0).getDate();

        // 1. 앞쪽 빈 셀 생성
        for (let i = 0; i < firstDayIndex; i++) {
            const emptyCell = document.createElement('div');
            emptyCell.className = 'calendar-day-cell empty';
            emptyCell.style.cssText = 'background: #f8fafc; min-height: 90px; border: 1px solid #e2e8f0;';
            gridZone.appendChild(emptyCell);
        }

        // 2. 일자별 셀 및 내부 배지 렌더링 가동
        for (let day = 1; day <= lastDate; day++) {
            const dayCell = document.createElement('div');
            dayCell.className = 'calendar-day-cell';
            dayCell.style.cssText = 'background: #ffffff; min-height: 90px; border: 1px solid #e2e8f0; padding: 6px; box-sizing: border-box; display: flex; flex-direction: column; gap: 4px; position: relative;';
            
            const currentWeekDay = new Date(year, month, day).getDay();
            const fullDateStr = `${year}-${month + 1}-${String(day).padStart(2, '0')}`;
            
            let holidayName = '';
            if (window.QA_CORE.HOLIDAYS && window.QA_CORE.HOLIDAYS[fullDateStr]) {
                holidayName = window.QA_CORE.HOLIDAYS[fullDateStr];
            } else if (holiDataMaster[fullDateStr]) {
                holidayName = holiDataMaster[fullDateStr];
            }

            let dateStyle = 'font-weight: bold; font-size: 12px; color: #4a5568;';
            if (currentWeekDay === 0 || holidayName) {
                dateStyle += 'color: #e53e3e;'; 
            } else if (currentWeekDay === 6) {
                dateStyle += 'color: #3182ce;'; 
            }

            const holidayLabel = holidayName ? `<span style="font-size: 10px; color: #e53e3e; font-weight: normal; margin-left: 4px;">${holidayName}</span>` : '';

            dayCell.innerHTML = `
                <div style="display: flex; align-items: center;">
                    <div style="${dateStyle}">${day}</div>
                    ${holidayLabel}
                </div>
                <div class="day-events-wrapper" style="display:flex; flex-direction:column; gap:2px; overflow-y:auto; flex:1;"></div>
            `;
            gridZone.appendChild(dayCell);
            
            this.injectEventsIntoCell(year, month, day, dayCell.querySelector('.day-events-wrapper'));
        }

        this.renderSidebarList();
    },

    injectEventsIntoCell(year, month, day, wrapper) {
        if (!wrapper) return;
        const events = window.QA_CORE.Calendar.State.calendarEvents || [];
        
        // 날짜 비교 매칭을 위해 포맷팅 규격을 완전히 동기화 처리
        const currentStr = `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;

        events.forEach(ev => {
            if (currentStr >= ev.startDate && currentStr <= ev.endDate) {
                const badge = document.createElement('div');
                badge.className = 'calendar-event-badge';
                badge.style.cssText = 'background: #3182ce; color: #fff; font-size: 11px; padding: 2px 6px; border-radius: 4px; font-weight: bold; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; cursor: pointer; margin-top:1px;';
                badge.innerText = ev.title;
                
                badge.onclick = (e) => {
                    e.stopPropagation();
                    window.QA_CORE.Calendar.Render.showEventDetailPopup(ev);
                };
                wrapper.appendChild(badge);
            }
        });
    },

    renderSidebarList() {
        const listZone = document.getElementById('sidebar-calendar-list');
        if (!listZone) return;
        listZone.innerHTML = '';

        const events = window.QA_CORE.Calendar.State.calendarEvents || [];
        if (events.length === 0) {
            listZone.innerHTML = '<div style="font-size:12px; color:#a0aec0; padding:10px; text-align:center;">등록된 일정이 없습니다.</div>';
            return;
        }

        events.forEach(ev => {
            const item = document.createElement('div');
            item.style.cssText = 'padding: 8px; border-bottom: 1px solid #edf2f7; font-size: 12px; display: flex; justify-content: space-between; align-items: center;';
            
            const urlMeta = ev.url ? `<a href="${ev.url}" target="_blank" style="color:#3182ce; text-decoration:underline; font-size:10px; margin-left:4px;">[링크]</a>` : '';

            item.innerHTML = `
                <div style="flex: 1; min-width: 0; padding-right: 10px;">
                    <span style="font-weight:bold; color:#2d3748; display:inline-block; max-width:75%; white-space:nowrap; overflow:hidden; text-overflow:ellipsis; vertical-align:middle;">${ev.title}</span>${urlMeta}
                    <div style="font-size:10px; color:#a0aec0; margin-top:2px;">${ev.startDate} ~ ${ev.endDate}</div>
                </div>
                <div style="display:flex; gap:4px; flex-shrink:0;">
                    <button class="btn-cal-nav btn-edit-trigger" style="padding:2px 6px; font-size:10px; color:#3182ce; border-color:#bee3f8; background:none;">수정</button>
                    <button class="btn-cal-nav btn-del-trigger" style="padding:2px 6px; font-size:10px; color:#e53e3e; border-color:#fed7d7; background:none;">삭제</button>
                </div>
            `;

            item.querySelector('.btn-edit-trigger').onclick = () => { this.showEditModalPopup(ev); };
            
            // [정정] 이달의 일정 리스트 내 명칭 미스매치를 전격 해제하는 하이브리드 바인딩 가드 처리
            item.querySelector('.btn-del-trigger').onclick = () => {
                const scheduleModule = window.QA_CORE.Calendar.Schedule || {};
                const deleteFn = scheduleModule.executeScheduleDeletion || scheduleModule.deleteCalendarEvent;
                
                if (typeof deleteFn === 'function') {
                    deleteFn.call(scheduleModule, ev.id);
                    this.renderCalendarAll(); // 딜리트 본부 연동 후 화면 동기화 격발
                } else {
                    if (confirm("선택한 일정을 삭제하시겠습니까?")) {
                        let currentEvents = window.QA_CORE.Calendar.State.calendarEvents || [];
                        window.QA_CORE.Calendar.State.calendarEvents = currentEvents.filter(item => String(item.id).trim() !== String(ev.id).trim());
                        localStorage.setItem('QA_SYSTEM_CALENDAR', JSON.stringify(window.QA_CORE.Calendar.State.calendarEvents));
                        this.renderCalendarAll();
                    }
                }
            };
            listZone.appendChild(item);
        });
    },

    showEventDetailPopup(ev) {
        this.closeAllPopups();
        const popupOverlay = document.createElement('div');
        popupOverlay.id = 'calendar-detail-popup-overlay';
        popupOverlay.style.cssText = 'position:fixed; top:0; left:0; width:100vw; height:100vh; background:rgba(0,0,0,0.4); display:flex; justify-content:center; align-items:center; z-index:10000;';
        const linkButtonHtml = ev.url ? `<a href="${ev.url}" target="_blank" style="display:inline-block; text-align:center; background:#edf2f7; color:#2d3748; padding:8px 12px; font-size:12px; border-radius:6px; font-weight:bold; text-decoration:none; border:1px solid #cbd5e0; flex:1;">🔗 링크 이동</a>` : '';

        popupOverlay.innerHTML = `
            <div style="background:#ffffff; width:360px; padding:20px; border-radius:12px; box-shadow:0 10px 25px rgba(0,0,0,0.15); display:flex; flex-direction:column; gap:14px; position:relative; font-family:sans-serif;">
                <div style="display:flex; justify-content:space-between; align-items:center; border-bottom:1px solid #edf2f7; padding-bottom:8px;">
                    <span style="font-size:11px; font-weight:bold; color:#3182ce; background:#ebf8ff; padding:2px 6px; border-radius:4px;">일정 상세</span>
                    <button id="popup-close-x-btn" style="background:none; border:none; font-size:18px; cursor:pointer; color:#a0aec0; padding:0; line-height:1;">&times;</button>
                </div>
                <div>
                    <h4 style="margin:0; font-size:16px; font-weight:bold; color:#1a202c; word-break:break-all;">${ev.title}</h4>
                    <div style="font-size:12px; color:#718096; margin-top:6px; display:flex; flex-direction:column; gap:4px;">
                        <div>📆 <b>기간:</b> ${ev.startDate} ~ ${ev.endDate}</div>
                        <div>🔗 <b>URL:</b> ${ev.url ? `<a href="${ev.url}" target="_blank" style="color:#3182ce; word-break:break-all;">${ev.url}</a>` : '<span style="color:#cbd5e0;">등록된 링크 없음</span>'}</div>
                    </div>
                </div>
                <div style="display:flex; gap:6px; margin-top:4px;">
                    ${linkButtonHtml}
                    <button id="popup-edit-direct-btn" style="background:#3182ce; color:white; padding:8px 12px; font-size:12px; border:none; border-radius:6px; font-weight:bold; cursor:pointer; flex:1;">수정</button>
                    <button id="popup-del-direct-btn" style="background:#e53e3e; color:white; padding:8px 12px; font-size:12px; border:none; border-radius:6px; font-weight:bold; cursor:pointer; flex:0.7;">삭제</button>
                </div>
            </div>
        `;
        document.body.appendChild(popupOverlay);
        popupOverlay.onclick = (e) => { if (e.target === popupOverlay) this.closeAllPopups(); };
        popupOverlay.querySelector('#popup-close-x-btn').onclick = () => this.closeAllPopups();
        popupOverlay.querySelector('#popup-edit-direct-btn').onclick = () => { this.showEditModalPopup(ev); };
        
        // [정정] 취소 버튼 선택 시 상세 팝업창이 먼저 날아가 흐름이 파괴되던 예외를 배열 랭스 추적 매커니즘으로 원천 제어
        popupOverlay.querySelector('#popup-del-direct-btn').onclick = () => {
            const scheduleModule = window.QA_CORE.Calendar.Schedule || {};
            const deleteFn = scheduleModule.executeScheduleDeletion || scheduleModule.deleteCalendarEvent;
            
            if (typeof deleteFn === 'function') {
                // 실행 전후의 스태틱 배열 크기를 박제 대조
                const oldLength = (window.QA_CORE.Calendar.State.calendarEvents || []).length;
                deleteFn.call(scheduleModule, ev.id);
                const newLength = (window.QA_CORE.Calendar.State.calendarEvents || []).length;
                
                // 컨피그 얼럿창에서 최종 '확인'을 눌러 실제 배열 크기가 하락했을 때만 모달창 닫기 격발
                if (newLength < oldLength) {
                    this.closeAllPopups();
                }
            } else {
                if (confirm("선택한 일정을 삭제하시겠습니까?")) {
                    let currentEvents = window.QA_CORE.Calendar.State.calendarEvents || [];
                    window.QA_CORE.Calendar.State.calendarEvents = currentEvents.filter(item => String(item.id).trim() !== String(ev.id).trim());
                    localStorage.setItem('QA_SYSTEM_CALENDAR', JSON.stringify(window.QA_CORE.Calendar.State.calendarEvents));
                    this.closeAllPopups();
                    this.renderCalendarAll();
                }
            }
        };
    },

    showEditModalPopup(ev) {
        this.closeAllPopups();
        const editOverlay = document.createElement('div');
        editOverlay.id = 'calendar-edit-popup-overlay';
        editOverlay.style.cssText = 'position:fixed; top:0; left:0; width:100vw; height:100vh; background:rgba(0,0,0,0.5); display:flex; justify-content:center; align-items:center; z-index:10001;';

        editOverlay.innerHTML = `
            <div style="background:#ffffff; width:380px; padding:24px; border-radius:12px; box-shadow:0 12px 30px rgba(0,0,0,0.2); display:flex; flex-direction:column; gap:16px; font-family:sans-serif; border:1px solid #e2e8f0;">
                <div style="display:flex; justify-content:space-between; align-items:center; border-bottom:1px solid #edf2f7; padding-bottom:10px;">
                    <span style="font-size:13px; font-weight:bold; color:#319795; background:#e6fffa; padding:3px 8px; border-radius:4px;">⚙️ 일정 편집 팝업</span>
                    <button id="edit-popup-close-btn" style="background:none; border:none; font-size:20px; cursor:pointer; color:#a0aec0; padding:0;">&times;</button>
                </div>
                <div style="display:flex; flex-direction:column; gap:12px;">
                    <div style="display:flex; flex-direction:column; gap:4px;">
                        <label style="font-size:11px; font-weight:600; color:#4a5568;">일정명</label>
                        <input type="text" id="popup-edit-title" value="${ev.title}" style="padding:10px; border:1px solid #cbd5e0; border-radius:6px; font-size:13px; box-sizing:border-box; width:100%;">
                    </div>
                    <div style="display:flex; flex-direction:column; gap:4px;">
                        <label style="font-size:11px; font-weight:600; color:#4a5568;">시작일</label>
                        <input type="date" id="popup-edit-start" value="${ev.startDate}" style="padding:8px; border:1px solid #cbd5e0; border-radius:6px; font-size:13px; box-sizing:border-box; width:100%;">
                    </div>
                    <div style="display:flex; flex-direction:column; gap:4px;">
                        <label style="font-size:11px; font-weight:600; color:#4a5568;">종료일</label>
                        <input type="date" id="popup-edit-end" value="${ev.endDate}" style="padding:8px; border:1px solid #cbd5e0; border-radius:6px; font-size:13px; box-sizing:border-box; width:100%;">
                    </div>
                    <div style="display:flex; flex-direction:column; gap:4px;">
                        <label style="font-size:11px; font-weight:600; color:#4a5568;">URL</label>
                        <input type="url" id="popup-edit-url" value="${ev.url || ''}" placeholder="https://example.com" style="padding:10px; border:1px solid #cbd5e0; border-radius:6px; font-size:13px; box-sizing:border-box; width:100%;">
                    </div>
                </div>
                <div style="display:flex; gap:8px; margin-top:8px; justify-content:flex-end;">
                    <button id="edit-popup-cancel-btn" style="background:#edf2f7; color:#4a5568; padding:10px 16px; font-size:13px; border:none; border-radius:6px; font-weight:bold; cursor:pointer;">취소</button>
                    <button id="edit-popup-submit-btn" style="background:#319795; color:white; padding:10px 20px; font-size:13px; border:none; border-radius:6px; font-weight:bold; cursor:pointer;">수정 완료</button>
                </div>
            </div>
        `;
        document.body.appendChild(editOverlay);
        editOverlay.onclick = (e) => { if (e.target === editOverlay) this.closeAllPopups(); };
        editOverlay.querySelector('#edit-popup-close-btn').onclick = () => this.closeAllPopups();
        editOverlay.querySelector('#edit-popup-cancel-btn').onclick = () => this.closeAllPopups();
        editOverlay.querySelector('#edit-popup-submit-btn').onclick = () => {
            const upTitle = document.getElementById('popup-edit-title').value.trim();
            const upStart = document.getElementById('popup-edit-start').value;
            const upEnd = document.getElementById('popup-edit-end').value;
            const upUrl = document.getElementById('popup-edit-url').value.trim();

            if (!upTitle || !upStart || !upEnd) { alert("필수 기입 사항이 누락되었습니다."); return; }
            if (upStart > upEnd) { alert("종료일은 시작일보다 과거일 수 없습니다."); return; }

            this.closeAllPopups();
            this.executePopupUpdateData(ev.id, { title: upTitle, startDate: upStart, endDate: upEnd, url: upUrl });
        };
    },

    executePopupUpdateData(eventId, updatedObj) {
        let currentEvents = window.QA_CORE.Calendar.State.calendarEvents || [];
        currentEvents = currentEvents.map(ev => {
            if (ev.id === eventId) return { ...ev, ...updatedObj };
            return ev;
        });
        window.QA_CORE.Calendar.State.calendarEvents = currentEvents;
        localStorage.setItem('QA_SYSTEM_CALENDAR', JSON.stringify(currentEvents));
        this.renderCalendarAll();
    },

    closeAllPopups() {
        const detailPopup = document.getElementById('calendar-detail-popup-overlay');
        if (detailPopup) detailPopup.remove();
        const editPopup = document.getElementById('calendar-edit-popup-overlay');
        if (editPopup) editPopup.remove();
    }
};

window.QA_CORE.Calendar.Module = {
    init() {
        document.removeEventListener('QA_REFRESH_CALENDAR', window.QA_CORE.Calendar.Module._handleRefresh);
        document.addEventListener('QA_REFRESH_CALENDAR', window.QA_CORE.Calendar.Module._handleRefresh);
        
        window.QA_CORE.Calendar.Render.renderCalendarAll();
    },
    _handleRefresh() {
        window.QA_CORE.Calendar.Render.renderCalendarAll();
    }
};

// 모듈 스킬 매니저 자동 등록 및 가드 수립
if (window.QA_CORE.SkillManager && typeof window.QA_CORE.SkillManager.register === 'function') {
    window.QA_CORE.SkillManager.register('CalendarEngineModule', window.QA_CORE.Calendar.Module);
}

// 런타임 수동 강제 예외 초기화 가드
setTimeout(() => {
    window.QA_CORE.Calendar.Render.renderCalendarAll();
}, 200);