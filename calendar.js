window.QA_CORE = window.QA_CORE || {};
window.QA_CORE.Calendar = window.QA_CORE.Calendar || {};

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

window.QA_CORE.Calendar.State = window.QA_CORE.Calendar.State || {
    currentCalendarDate: new Date(),
    calendarEvents: [],
    editingEventId: null
};

window.QA_CORE.Calendar.Sync = {
    async fetchAndSync() {
        try {
            const proxyUrl = (window.QA_CORE.config && window.QA_CORE.config.gasProxyUrl) ? window.QA_CORE.config.gasProxyUrl.trim() : '';
            if (!proxyUrl) {
                console.warn("GAS Proxy URL이 app.js에 설정되지 않아 동기화를 건너뜁니다.");
                return;
            }

            const sep = proxyUrl.includes('?') ? '&' : '?';
            const liveUrl = proxyUrl + sep + "_cb=" + new Date().getTime();
            
            const response = await fetch(liveUrl);
            if (!response.ok) throw new Error("HTTP 요청 오류");
            
            const json = await response.json();
            
            if (!json.success) {
                alert("🚨 [데이터 동기화 실패]\n사유: " + json.error);
                return;
            }

            this.processSheetData(json.data);
        } catch (error) {
            console.error("구글 시트 네트워크 연동 실패:", error);
            if (error.message && error.message.includes("Failed to fetch")) {
                alert("🚨 [CORS 통신 차단]\n원인: app.js의 gasProxyUrl에 구글 시트 주소가 잘못 입력되었거나, GAS 서버 권한 누락입니다.");
            }
        }
    },

    extractMonthDay(str) {
        if (!str) return null;
        let s = String(str).trim();
        let m = s.match(/(\d{1,2})\s*월\s*(\d{1,2})\s*일/);
        if (m) return { m: parseInt(m[1], 10), d: parseInt(m[2], 10) };
        m = s.match(/(?:20\d\d|2\d)[\-\.]\s*(\d{1,2})[\-\.]\s*(\d{1,2})/);
        if (m) return { m: parseInt(m[1], 10), d: parseInt(m[2], 10) };
        m = s.match(/(?:^|[^\d])(\d{1,2})\s*\/\s*(\d{1,2})(?:[^\d]|$)/);
        if (m) return { m: parseInt(m[1], 10), d: parseInt(m[2], 10) };
        return null;
    },

    processSheetData(rows) {
        if (!rows || rows.length < 2) return;

        for (let i = 1; i < rows.length; i++) {
            for (let j = 0; j <= 5; j++) {
                if (rows[i][j] === undefined || String(rows[i][j]).trim() === '') {
                    rows[i][j] = (rows[i-1] && rows[i-1][j]) ? rows[i-1][j] : '';
                }
            }
        }

        let dateRowIndex = -1;
        for (let i = 0; i < Math.min(10, rows.length); i++) {
            const matchCount = rows[i].filter(cell => this.extractMonthDay(cell) !== null).length;
            if (matchCount > 3) {
                dateRowIndex = i;
                break;
            }
        }

        if (dateRowIndex === -1) return;

        const dateMap = {};
        let currentYear = new Date().getFullYear();
        let prevMonth = 0;

        rows[dateRowIndex].forEach((cell, colIndex) => {
            const md = this.extractMonthDay(cell);
            if (md) {
                const month = md.m;
                const day = md.d;
                if (prevMonth === 12 && month === 1) currentYear++;
                prevMonth = month;
                dateMap[colIndex] = `${currentYear}-${String(month).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
            }
        });

        let syncedEvents = [];
        let eventCounter = 0;
        const sortedColIndices = Object.keys(dateMap).sort((a, b) => parseInt(a) - parseInt(b));

        for (let i = dateRowIndex + 1; i < rows.length; i++) {
            const cols = rows[i];
            const rowMetaString = cols.slice(0, 10).join('').replace(/\s+/g, ''); 

            if (rowMetaString.includes("박준혁")) {
                const taskTypeMatch = rowMetaString.match(/업무\s*\d/);
                const taskType = taskTypeMatch ? taskTypeMatch[0].replace(/\s/g, '') : "업무";

                let currentTaskName = null;
                let currentTaskStart = null;
                let currentTaskEnd = null;
                let emptyCount = 0;

                // 🚨 핵심 수정: 중복 연차/업무지원 등을 걸러내는 스마트 필터
                const addSyncEvent = (type, name, start, end) => {
                    const baseName = String(name).trim();
                    const isDuplicate = syncedEvents.some(e => 
                        e.title.includes(baseName) && 
                        e.startDate === start && 
                        e.endDate === end
                    );

                    if (!isDuplicate) {
                        eventCounter++;
                        syncedEvents.push({
                            id: `SYNC_${i}_${eventCounter}`,
                            title: `[${type}] ${baseName}`,
                            startDate: start,
                            endDate: end,
                            url: "https://docs.google.com/spreadsheets/d/1uKaVMfzmCwDqefoOdUefT27kmwfkzOJk/edit",
                            skipHolidays: false
                        });
                    }
                };

                for (let colIndex of sortedColIndices) {
                    const colIdxNum = parseInt(colIndex, 10);
                    let cellText = String(cols[colIdxNum] || "").trim().replace(/\n|\r/g, ' '); 
                    const currentDate = dateMap[colIndex];

                    if (cellText && cellText !== '-' && cellText.toUpperCase() !== 'N/A') {
                        emptyCount = 0;

                        if (currentTaskName && currentTaskName !== cellText) {
                            addSyncEvent(taskType, currentTaskName, currentTaskStart, currentTaskEnd);
                            currentTaskName = cellText;
                            currentTaskStart = currentDate;
                            currentTaskEnd = currentDate;
                        } 
                        else if (currentTaskName === cellText) {
                            currentTaskEnd = currentDate;
                        }
                        else {
                            currentTaskName = cellText;
                            currentTaskStart = currentDate;
                            currentTaskEnd = currentDate;
                        }
                    } else {
                        if (currentTaskName) {
                            emptyCount++;
                            if (emptyCount <= 14) {
                                currentTaskEnd = currentDate;
                            } else {
                                addSyncEvent(taskType, currentTaskName, currentTaskStart, currentTaskEnd);
                                currentTaskName = null;
                            }
                        }
                    }
                }
                
                if (currentTaskName) {
                    addSyncEvent(taskType, currentTaskName, currentTaskStart, currentTaskEnd);
                }
            }
        }

        if(syncedEvents.length > 0) {
            let currentEvents = window.QA_CORE.Calendar.State.calendarEvents || [];
            currentEvents = currentEvents.filter(ev => !String(ev.id).startsWith('SYNC_'));
            currentEvents = [...currentEvents, ...syncedEvents];

            window.QA_CORE.Calendar.State.calendarEvents = currentEvents;
            localStorage.setItem('QA_SYSTEM_CALENDAR', JSON.stringify(currentEvents));
            
            window.QA_CORE.Calendar.Render.renderCalendarAll();
        }
    }
};

window.QA_CORE.Calendar.Render = {
    renderCalendarAll() {
        const state = window.QA_CORE.Calendar.State;
        
        if (!state.calendarEvents || state.calendarEvents.length === 0) {
            const backup = localStorage.getItem('QA_SYSTEM_CALENDAR');
            if (backup) {
                try { state.calendarEvents = JSON.parse(backup) || []; } catch(e) { console.error(e); }
            }
        }

        const year = state.currentCalendarDate.getFullYear();
        const month = state.currentCalendarDate.getMonth(); 

        const titleEl = document.getElementById('calendar-month-year-title');
        if (titleEl) titleEl.innerText = `${year}년 ${month + 1}월`;

        const gridZone = document.getElementById('calendar-grid-zone');
        if (!gridZone) return;
        gridZone.innerHTML = '';

        const firstDayIndex = new Date(year, month, 1).getDay();
        const lastDate = new Date(year, month + 1, 0).getDate();

        for (let i = 0; i < firstDayIndex; i++) {
            const emptyCell = document.createElement('div');
            emptyCell.className = 'calendar-day-cell empty';
            emptyCell.style.cssText = 'background: #f8fafc; height: 130px; border: 1px solid #e2e8f0; box-sizing: border-box;';
            gridZone.appendChild(emptyCell);
        }

        for (let day = 1; day <= lastDate; day++) {
            const dayCell = document.createElement('div');
            dayCell.className = 'calendar-day-cell';
            dayCell.style.cssText = 'background: #ffffff; height: 130px; border: 1px solid #e2e8f0; padding: 6px; box-sizing: border-box; display: flex; flex-direction: column; gap: 4px; position: relative; overflow: hidden;';
            
            const currentWeekDay = new Date(year, month, day).getDay();
            const fullDateStr = `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
            
            let holidayName = '';
            const cleanDateStr = `${year}-${month + 1}-${String(day).padStart(2, '0')}`;
            
            if (window.QA_CORE.HOLIDAYS && window.QA_CORE.HOLIDAYS[cleanDateStr]) {
                holidayName = window.QA_CORE.HOLIDAYS[cleanDateStr];
            } else if (holiDataMaster[cleanDateStr]) {
                holidayName = holiDataMaster[cleanDateStr];
            }

            let dateStyle = 'font-weight: bold; font-size: 12px; color: #4a5568;';
            if (currentWeekDay === 0 || holidayName) dateStyle += 'color: #e53e3e;'; 
            else if (currentWeekDay === 6) dateStyle += 'color: #3182ce;'; 

            const holidayLabel = holidayName ? `<span style="font-size: 10px; color: #e53e3e; font-weight: normal; margin-left: 4px;">${holidayName}</span>` : '';

            dayCell.innerHTML = `
                <div style="display: flex; align-items: center;">
                    <div style="${dateStyle}">${day}</div>
                    ${holidayLabel}
                </div>
                <div class="day-events-wrapper" style="display:flex; flex-direction:column; gap:2px; overflow-y:auto; flex:1; padding-right: 2px;"></div>
            `;
            gridZone.appendChild(dayCell);
            
            this.injectEventsIntoCell(year, month, day, dayCell.querySelector('.day-events-wrapper'));
        }

        this.renderSidebarList();
    },

    injectEventsIntoCell(year, month, day, wrapper) {
        if (!wrapper) return;
        const events = window.QA_CORE.Calendar.State.calendarEvents || [];
        const currentStr = `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;

        const currentWeekDay = new Date(year, month, day).getDay();
        const isWeekend = currentWeekDay === 0 || currentWeekDay === 6;
        const cleanDateStr = `${year}-${month + 1}-${String(day).padStart(2, '0')}`;
        const isHoliday = (window.QA_CORE.HOLIDAYS && window.QA_CORE.HOLIDAYS[cleanDateStr]) || (holiDataMaster && holiDataMaster[cleanDateStr]);

        events.forEach(ev => {
            if (currentStr >= ev.startDate && currentStr <= ev.endDate) {
                const shouldSkipHolidays = ev.skipHolidays !== false; 
                if (shouldSkipHolidays && (isWeekend || isHoliday)) {
                    return; 
                }

                const badge = document.createElement('div');
                badge.className = 'calendar-event-badge';
                const isSyncEvent = String(ev.id).startsWith('SYNC_');
                
                let bgCol = isSyncEvent ? '#38a169' : '#3182ce';
                if (ev.title.includes('연차') || ev.title.includes('휴가')) bgCol = '#dd6b20'; 
                else if (ev.title.includes('업무지원')) bgCol = '#805ad5'; 
                
                badge.style.cssText = `background: ${bgCol}; color: #fff; font-size: 11px; padding: 4px 6px; border-radius: 4px; font-weight: bold; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; cursor: pointer; margin-top: 2px; display: block;`;
                badge.innerText = ev.title;
                badge.title = ev.title;
                
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

        const state = window.QA_CORE.Calendar.State;
        const events = state.calendarEvents || [];

        const year = state.currentCalendarDate.getFullYear();
        const month = state.currentCalendarDate.getMonth();
        const lastDate = new Date(year, month + 1, 0).getDate();

        const monthStart = `${year}-${String(month + 1).padStart(2, '0')}-01`;
        const monthEnd = `${year}-${String(month + 1).padStart(2, '0')}-${String(lastDate).padStart(2, '0')}`;

        const filteredEvents = events.filter(ev => {
            return ev.startDate <= monthEnd && ev.endDate >= monthStart;
        }).sort((a, b) => a.startDate.localeCompare(b.startDate));

        if (filteredEvents.length === 0) {
            listZone.innerHTML = '<div style="font-size:12px; color:#a0aec0; padding:10px; text-align:center;">이달에 등록된 일정이 없습니다.</div>';
            return;
        }

        filteredEvents.forEach(ev => {
            const item = document.createElement('div');
            item.style.cssText = 'padding: 8px; border-bottom: 1px solid #edf2f7; font-size: 12px; display: flex; justify-content: space-between; align-items: center;';
            
            const urlMeta = ev.url ? `<a href="${ev.url}" target="_blank" style="color:#3182ce; text-decoration:underline; font-size:10px; margin-left:4px;">[링크]</a>` : '';
            const isSyncEvent = String(ev.id).startsWith('SYNC_');

            item.innerHTML = `
                <div style="flex: 1; min-width: 0; padding-right: 10px;">
                    <span style="font-weight:bold; color:#2d3748; display:inline-block; max-width:75%; white-space:nowrap; overflow:hidden; text-overflow:ellipsis; vertical-align:middle;" title="${ev.title}">
                        ${isSyncEvent ? '🔄 ' : ''}${ev.title}
                    </span>${urlMeta}
                    <div style="font-size:10px; color:#a0aec0; margin-top:2px;">${ev.startDate} ~ ${ev.endDate}</div>
                </div>
                <div style="display:flex; gap:4px; flex-shrink:0;">
                    ${!isSyncEvent ? '<button class="btn-cal-nav btn-edit-trigger" style="padding:2px 6px; font-size:10px; color:#3182ce; border-color:#bee3f8; background:none;">수정</button>' : ''}
                    <button class="btn-cal-nav btn-del-trigger" style="padding:2px 6px; font-size:10px; color:#e53e3e; border-color:#fed7d7; background:none;">삭제</button>
                </div>
            `;

            const editBtn = item.querySelector('.btn-edit-trigger');
            if(editBtn) editBtn.onclick = () => { this.showEditModalPopup(ev); };
            
            item.querySelector('.btn-del-trigger').onclick = () => {
                const scheduleModule = window.QA_CORE.Calendar.Schedule || {};
                const deleteFn = scheduleModule.executeScheduleDeletion || scheduleModule.deleteCalendarEvent;
                
                if (typeof deleteFn === 'function') {
                    deleteFn.call(scheduleModule, ev.id);
                    this.renderCalendarAll(); 
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
        const isSyncEvent = String(ev.id).startsWith('SYNC_');

        popupOverlay.innerHTML = `
            <div style="background:#ffffff; width:360px; padding:20px; border-radius:12px; box-shadow:0 10px 25px rgba(0,0,0,0.15); display:flex; flex-direction:column; gap:14px; position:relative; font-family:sans-serif;">
                <div style="display:flex; justify-content:space-between; align-items:center; border-bottom:1px solid #edf2f7; padding-bottom:8px;">
                    <span style="font-size:11px; font-weight:bold; color:#3182ce; background:#ebf8ff; padding:2px 6px; border-radius:4px;">${isSyncEvent ? '시트 동기화 일정' : '일정 상세'}</span>
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
                    ${!isSyncEvent ? '<button id="popup-edit-direct-btn" style="background:#3182ce; color:white; padding:8px 12px; font-size:12px; border:none; border-radius:6px; font-weight:bold; cursor:pointer; flex:1;">수정</button>' : ''}
                    <button id="popup-del-direct-btn" style="background:#e53e3e; color:white; padding:8px 12px; font-size:12px; border:none; border-radius:6px; font-weight:bold; cursor:pointer; flex:0.7;">삭제</button>
                </div>
            </div>
        `;
        document.body.appendChild(popupOverlay);
        popupOverlay.onclick = (e) => { if (e.target === popupOverlay) this.closeAllPopups(); };
        popupOverlay.querySelector('#popup-close-x-btn').onclick = () => this.closeAllPopups();
        
        const editBtn = popupOverlay.querySelector('#popup-edit-direct-btn');
        if(editBtn) editBtn.onclick = () => { this.showEditModalPopup(ev); };
        
        popupOverlay.querySelector('#popup-del-direct-btn').onclick = () => {
            const scheduleModule = window.QA_CORE.Calendar.Schedule || {};
            const deleteFn = scheduleModule.executeScheduleDeletion || scheduleModule.deleteCalendarEvent;
            
            if (typeof deleteFn === 'function') {
                const oldLength = (window.QA_CORE.Calendar.State.calendarEvents || []).length;
                deleteFn.call(scheduleModule, ev.id);
                const newLength = (window.QA_CORE.Calendar.State.calendarEvents || []).length;
                if (newLength < oldLength) this.closeAllPopups();
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

        const isCheckedHtml = ev.skipHolidays === false ? 'checked' : '';

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
                    <div style="display:flex; align-items:center; gap:6px; margin-top:4px;">
                        <input type="checkbox" id="popup-edit-include-holidays" ${isCheckedHtml} style="cursor:pointer;">
                        <label for="popup-edit-include-holidays" style="font-size:11px; font-weight:600; color:#e53e3e; cursor:pointer;">휴일 포함 (미체크 시 주말/공휴일 건너뜀)</label>
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
            const upSkipHolidays = !document.getElementById('popup-edit-include-holidays').checked;

            if (!upTitle || !upStart || !upEnd) { alert("필수 기입 사항이 누락되었습니다."); return; }
            if (upStart > upEnd) { alert("종료일은 시작일보다 과거일 수 없습니다."); return; }

            this.closeAllPopups();
            this.executePopupUpdateData(ev.id, { title: upTitle, startDate: upStart, endDate: upEnd, url: upUrl, skipHolidays: upSkipHolidays });
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
        window.QA_CORE.Calendar.Sync.fetchAndSync();
    },
    _handleRefresh() {
        window.QA_CORE.Calendar.Sync.fetchAndSync();
    }
};

if (window.QA_CORE.SkillManager && typeof window.QA_CORE.SkillManager.register === 'function') {
    window.QA_CORE.SkillManager.register('CalendarEngineModule', window.QA_CORE.Calendar.Module);
}
