window.QA_CORE = window.QA_CORE || {};
window.QA_CORE.Calendar = window.QA_CORE.Calendar || {};

window.QA_CORE.Calendar.Schedule = {
    state: {
        isAsyncLocked: false,
        gasProxyUrl: 'https://script.google.com/macros/s/AKfycbwYUNoOLOrhAk73ftSZ42zPQ42A4T8MfHImu5a7a764OMjt2aKgkwBEcMSkHDC6T7kg/exec'
    },

    init() {
        const globalConfig = window.QA_CORE.firebaseConfig;
        if (globalConfig && globalConfig.apiKey !== "****" && typeof firebase !== 'undefined' && !firebase.apps.length) {
            firebase.initializeApp(globalConfig);
        }
        this.db = (typeof firebase !== 'undefined' && firebase.apps.length) ? firebase.database() : null;
        this.injectControlPanels();
        this.bindDeleteEventsGlobal();
    },

    injectControlPanels() {
        let retryCount = 0;
        const maxRetries = 60;

        const intervalId = setInterval(() => {
            const navGroup = document.querySelector('.calendar-nav-group') || document.querySelector('.cal-nav-wrapper') || document.querySelector('.calendar-container');
            
            if (navGroup) {
                clearInterval(intervalId);

                const oldWriteBtn = document.getElementById('btn-tc-write-count-hub');
                if (oldWriteBtn) oldWriteBtn.remove();

                const writeTcBtn = document.createElement('button');
                writeTcBtn.id = 'btn-tc-write-count-hub';
                writeTcBtn.className = 'btn-cal-nav';
                writeTcBtn.style.cssText = 'background: #2b6cb0; color: #fff; margin: 5px; border: none; font-weight: bold; cursor: pointer; padding: 6px 12px; border-radius: 4px; box-shadow: 0 2px 4px rgba(0,0,0,0.1);';
                writeTcBtn.innerText = '📝 TC 작성 및 수정 개수 확인';
                writeTcBtn.onclick = () => window.QA_CORE.Calendar.Schedule.triggerTcWriteCountFlow();

                const existTcBtn = document.getElementById('btn-tc-count-hub');
                if (existTcBtn) {
                    existTcBtn.onclick = () => window.QA_CORE.Calendar.Schedule.triggerTcCountFlow();
                    if (existTcBtn.parentNode && !document.getElementById('btn-tc-write-count-hub')) {
                        existTcBtn.parentNode.insertBefore(writeTcBtn, existTcBtn);
                    }
                } else {
                    navGroup.prepend(writeTcBtn);
                }
            } else {
                retryCount++;
                if (retryCount >= maxRetries) clearInterval(intervalId);
            }
        }, 50);
    },

    getCalendarEventsSafe() {
        if (window.QA_CORE.Calendar.State && window.QA_CORE.Calendar.State.calendarEvents) return window.QA_CORE.Calendar.State.calendarEvents;
        const backupData = localStorage.getItem('QA_SYSTEM_CALENDAR');
        if (backupData) { try { return JSON.parse(backupData) || []; } catch (e) { console.error(e); } }
        return [];
    },

    bindDeleteEventsGlobal() {
        document.addEventListener('click', (e) => {
            const delBtn = e.target.closest('.del-schedule-btn') || e.target.closest('.del-event-btn') || e.target.closest('#btn-delete-schedule');
            if (delBtn) {
                e.stopPropagation();
                e.preventDefault();
                const eventId = delBtn.getAttribute('data-id') || delBtn.dataset.id;
                if (eventId) this.executeScheduleDeletion(eventId);
            }
        });
    },

    executeScheduleDeletion(id) {
        if (!confirm("해당 일정을 시스템에서 완전히 삭제하시겠습니까?")) return;
        let currentEvents = this.getCalendarEventsSafe();
        const updatedEvents = currentEvents.filter(ev => String(ev.id).trim() !== String(id).trim());

        localStorage.setItem('QA_SYSTEM_CALENDAR', JSON.stringify(updatedEvents));
        if (window.QA_CORE.Calendar.State) window.QA_CORE.Calendar.State.calendarEvents = updatedEvents;
        if (this.db) this.db.ref('calendarEvents').set(updatedEvents);

        const modal = document.getElementById('schedule-detail-modal') || document.getElementById('calendar-detail-popup-overlay');
        if (modal) { modal.style.display = 'none'; if (typeof modal.remove === 'function') modal.remove(); }

        const calendarRender = window.QA_CORE.Calendar.Render;
        if (calendarRender && typeof calendarRender.renderCalendarAll === 'function') {
            calendarRender.renderCalendarAll();
        } else {
            location.reload();
        }
    },

    getValidUrlEvents() {
        const calState = window.QA_CORE.Calendar.State;
        if (!calState || !calState.currentCalendarDate) return null;
        
        const targetYear = calState.currentCalendarDate.getFullYear();
        const targetMonth = calState.currentCalendarDate.getMonth() + 1; 

        const currentEvents = this.getCalendarEventsSafe();
        const monthStrTwoDigit = String(targetMonth).padStart(2, '0');
        const filterPattern1 = `${targetYear}-${monthStrTwoDigit}`;
        const filterPattern2 = `${targetYear}-${targetMonth}`;

        const urlEvents = currentEvents.filter(ev => {
            const hasUrl = ev.url && ev.url.trim() !== '';
            const inCurrentMonth = (ev.startDate && (ev.startDate.indexOf(filterPattern1) !== -1 || ev.startDate.indexOf(filterPattern2) !== -1)) || 
                                   (ev.endDate && (ev.endDate.indexOf(filterPattern1) !== -1 || ev.endDate.indexOf(filterPattern2) !== -1));
            return hasUrl && inCurrentMonth;
        });

        return { urlEvents, targetYear, targetMonth };
    },

    triggerTcWriteCountFlow() {
        if (this.state.isAsyncLocked) { alert("원격 서버와의 연동 연산이 진행 중입니다. 잠시 후 다시 시도해 주십시오."); return; }
        
        const data = this.getValidUrlEvents();
        if(!data) return;

        if (data.urlEvents.length === 0) {
            alert(`선택하신 ${data.targetYear}년 ${data.targetMonth}월 화면에 유효한 일정 카드가 발견되지 않았습니다.`);
            return;
        }

        const targetWorker = prompt(`[📝 ${data.targetYear}년 ${data.targetMonth}월 작성/수정 수집] 조회할 담당자 명을 입력하세요:`, "박준혁");
        if (!targetWorker || !targetWorker.trim()) return;

        this.executeDataPipeline(data.urlEvents, targetWorker.trim(), data.targetYear, data.targetMonth, 'write');
    },

    triggerTcCountFlow() {
        if (this.state.isAsyncLocked) { alert("원격 서버와의 연동 연산이 진행 중입니다. 잠시 후 다시 시도해 주십시오."); return; }
        
        const data = this.getValidUrlEvents();
        if(!data) return;

        if (data.urlEvents.length === 0) {
            alert(`선택하신 ${data.targetYear}년 ${data.targetMonth}월 화면에 유효한 일정 카드가 발견되지 않았습니다.`);
            return;
        }

        // 🚨 1인 검증 체제: 이름 프롬프트를 띄우지 않고 묵시적 타겟팅 파라미터 전달
        this.executeDataPipeline(data.urlEvents, "1인검증(이름무시)", data.targetYear, data.targetMonth, 'execute');
    },

    executeDataPipeline(urlEvents, workerName, year, month, mode) {
        this.setAsyncLock(true);
        this.showProgressOverlay(true, "원격 구글 서버 연결 중...", 0, urlEvents.length);

        let processedIndex = 0;
        let totalCounted = 0;
        let failedSheets = [];
        let backendMessageSummary = "";
        
        const actionLabel = mode === 'write' ? '작성/수정' : '수행';

        const parseNextSheet = () => {
            if (processedIndex >= urlEvents.length) {
                this.showProgressOverlay(false);
                this.setAsyncLock(false);

                if(mode === 'write') {
                    localStorage.setItem('QA_SYSTEM_KPI_WRITE_COUNT', totalCounted);
                    document.dispatchEvent(new CustomEvent('QA_KPI_WRITE_DATA_SYNC', { detail: { count: totalCounted } }));
                } else {
                    this.syncWithKpiManager(totalCounted, year, month);
                }

                let finalMsg = `[${mode === 'write' ? '📝' : '📊'} TC ${actionLabel} 개수 확인 완료]\n\n`;
                finalMsg += `📅 대상 월: ${year}년 ${month}월\n`;
                finalMsg += `👤 대상 담당자: ${workerName}\n`;
                finalMsg += `✅ 성공 시트 수: ${urlEvents.length - failedSheets.length}개\n`;
                if (failedSheets.length > 0) finalMsg += `❌ 실패 시트: (${failedSheets.join(', ')})\n`;
                finalMsg += `\n🎯 당월 취합된 총 TC ${actionLabel} 행(개수): ${totalCounted}개\n`;
                if (backendMessageSummary) finalMsg += `📢 백엔드 리포트: ${backendMessageSummary}`;

                alert(finalMsg);
                return;
            }

            const currentEvent = urlEvents[processedIndex];
            processedIndex++;
            this.showProgressOverlay(true, currentEvent.title, processedIndex, urlEvents.length);

            const rawUrl = currentEvent.url.trim();
            let sheetId = rawUrl.indexOf('/d/') !== -1 ? rawUrl.split('/d/')[1].split('/')[0] : rawUrl;
            
            if (!sheetId) { failedSheets.push(currentEvent.title); parseNextSheet(); return; }

            const requestUrl = `${this.state.gasProxyUrl}?sheetId=${sheetId}&workerName=${encodeURIComponent(workerName)}&year=${year}&month=${month}&mode=${mode}`;

            fetch(requestUrl)
                .then(response => { if (!response.ok) throw new Error(); return response.json(); })
                .then(data => {
                    if (data && data.success === true) {
                        totalCounted += parseInt(data.count, 10) || 0;
                        backendMessageSummary = data.message;
                    } else {
                        failedSheets.push(currentEvent.title);
                    }
                })
                .catch(() => { failedSheets.push(currentEvent.title); })
                .finally(() => { setTimeout(parseNextSheet, 200); });
        };
        parseNextSheet();
    },

    syncWithKpiManager(count, year, month) {
        localStorage.setItem('QA_SYSTEM_KPI_TC_COUNT', count);
        localStorage.setItem('QA_SYSTEM_KPI_TC_DATE', `${year}-${month}`);

        document.dispatchEvent(new CustomEvent('QA_KPI_TC_DATA_SYNC', { detail: { count: count, year: year, month: month } }));

        const selectors = ['#kpi-preview-tc-work', '#kpi-tc-execution-field', '.kpi-report-preview [data-type="tc"]', '#kpi-work-performance-preview'];
        let targetField = null;
        for (const selector of selectors) {
            targetField = document.querySelector(selector);
            if (targetField) break;
        }

        if (targetField) {
            const syncMessage = `[TC 수행 업무] 당월 취합 총 TC 수행 개수: ${count}개`;
            if (typeof targetField.value !== 'undefined') {
                targetField.value = targetField.value.indexOf('[TC 수행 업무]') !== -1 ? targetField.value.replace(/\[TC 수행 업무\][^\n]*/g, syncMessage) : (targetField.value ? `${targetField.value}\n${syncMessage}` : syncMessage);
            } else {
                targetField.innerText = targetField.innerText.indexOf('[TC 수행 업무]') !== -1 ? targetField.innerText.replace(/\[TC 수행 업무\][^\n]*/g, syncMessage) : (targetField.innerText ? `${targetField.innerText}\n${syncMessage}` : syncMessage);
            }
        }
    },

    showProgressOverlay(show, eventTitle = '', current = 0, total = 0) {
        let overlay = document.getElementById('kpi-processing-dim-layer');
        if (!show) { if (overlay) overlay.classList.add('d-none'); return; }
        if (!overlay) {
            overlay = document.createElement('div');
            overlay.id = 'kpi-processing-dim-layer';
            overlay.style.cssText = 'position:fixed; top:0; left:0; width:100vw; height:100vh; background:rgba(0,0,0,0.75); display:flex; flex-direction:column; justify-content:center; align-items:center; z-index:9999; color:#fff; font-family:sans-serif;';
            document.body.appendChild(overlay);
        }
        overlay.classList.remove('d-none');
        overlay.innerHTML = `<div style="font-size: 50px; margin-bottom: 20px;">⏳</div><div style="font-size: 16px; font-weight: bold; text-align:center;">[${eventTitle}] 구글 스프레드시트 데이터 연동 중... (${current} / ${total})</div>`;
    },

    setAsyncLock(lock) {
        const saveBtn = document.getElementById('save-event-btn');
        if (!saveBtn) return;
        saveBtn.disabled = lock; 
        saveBtn.innerText = lock ? "처리 중..." : "저장하기";
    }
};

if (window.QA_CORE.SkillManager && typeof window.QA_CORE.SkillManager.register === 'function') {
    window.QA_CORE.SkillManager.register('CalendarScheduleModule', window.QA_CORE.Calendar.Schedule);
}
