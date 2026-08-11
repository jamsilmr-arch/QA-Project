window.QA_CORE = window.QA_CORE || {};
window.QA_CORE.Calendar = window.QA_CORE.Calendar || {};

window.QA_CORE.Calendar.Schedule = {
    state: {
        isAsyncLocked: false,
        // TC 작성 및 수정용 구글 라이브 웹 앱 URL (유지)
        gasProxyUrl: 'https://script.google.com/macros/s/AKfycbwvTfIPgU5DbWFsB6tljhkVsBJhbU3OZUlHJfAduuvIIZZuVZwBfO2GyJ6obbaZW7AH/exec'
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
            const navGroup = document.querySelector('.calendar-nav-group') || 
                             document.querySelector('.cal-nav-wrapper') ||
                             document.querySelector('.calendar-controls') ||
                             document.querySelector('.fc-toolbar-chunk') ||
                             document.querySelector('header') || 
                             document.querySelector('.calendar-container');
            
            if (navGroup) {
                clearInterval(intervalId);

                // [핵심 수정 1] calendar-view.js에 렌더링된 'TC 수행 개수 확인' 버튼을 강제 삭제하지 않습니다.
                const oldWriteBtn = document.getElementById('btn-tc-write-count-hub');
                if (oldWriteBtn) oldWriteBtn.remove();

                // 1. 좌측 배치용 'TC 작성 및 수정 개수 확인' 버튼 노드 빌드
                const writeTcBtn = document.createElement('button');
                writeTcBtn.id = 'btn-tc-write-count-hub';
                writeTcBtn.className = 'btn-cal-nav';
                writeTcBtn.style.cssText = 'background: #2b6cb0; color: #fff; margin: 5px; border: none; font-weight: bold; cursor: pointer; padding: 8px 14px; border-radius: 4px; box-shadow: 0 2px 4px rgba(0,0,0,0.1);';
                writeTcBtn.innerText = '📝 TC 작성 및 수정 개수 확인';
                
                writeTcBtn.onclick = () => {
                    window.QA_CORE.Calendar.Schedule.triggerTcWriteCountFlow();
                };

                // [핵심 수정 2] 기존 'TC 수행 개수 확인' 버튼을 찾아서 안전하게 그 왼쪽에만 삽입합니다.
                const existTcBtn = document.getElementById('btn-tc-count-hub');
                
                if (existTcBtn && existTcBtn.parentNode) {
                    existTcBtn.parentNode.insertBefore(writeTcBtn, existTcBtn);
                } else if (navGroup.parentNode && navGroup.className.includes('group')) {
                    navGroup.parentNode.insertBefore(writeTcBtn, navGroup);
                } else {
                    navGroup.prepend(writeTcBtn);
                }
            } else {
                retryCount++;
                if (retryCount >= maxRetries) {
                    clearInterval(intervalId);
                }
            }
        }, 50);
    },

    getCalendarEventsSafe() {
        if (window.QA_CORE.Calendar.State && window.QA_CORE.Calendar.State.calendarEvents) {
            return window.QA_CORE.Calendar.State.calendarEvents;
        }
        const backupData = localStorage.getItem('QA_SYSTEM_CALENDAR');
        if (backupData) {
            try { return JSON.parse(backupData) || []; } catch (e) { console.error(e); }
        }
        return [];
    },

    bindDeleteEventsGlobal() {
        document.addEventListener('click', (e) => {
            const delBtn = e.target.closest('.del-schedule-btn') || 
                           e.target.closest('.del-event-btn') || 
                           e.target.closest('#btn-delete-schedule') ||
                           e.target.closest('.schedule-detail-actions .btn-delete');
            
            if (delBtn) {
                e.stopPropagation();
                e.preventDefault();
                
                const eventId = delBtn.getAttribute('data-id') || delBtn.dataset.id;
                if (eventId) {
                    this.executeScheduleDeletion(eventId);
                }
            }
        });
    },

    executeScheduleDeletion(id) {
        if (!confirm("해당 일정을 시스템에서 완전히 삭제하시겠습니까?")) return;

        let currentEvents = this.getCalendarEventsSafe();
        const updatedEvents = currentEvents.filter(ev => String(ev.id).trim() !== String(id).trim());

        localStorage.setItem('QA_SYSTEM_CALENDAR', JSON.stringify(updatedEvents));
        if (window.QA_CORE.Calendar.State) {
            window.QA_CORE.Calendar.State.calendarEvents = updatedEvents;
        }

        if (this.db) {
            this.db.ref('calendarEvents').set(updatedEvents);
        }

        const modal = document.getElementById('schedule-detail-modal') || 
                      document.getElementById('event-detail-modal') ||
                      document.getElementById('calendar-detail-popup-overlay') ||
                      document.querySelector('.modal-overlay');
        if (modal) {
            modal.style.display = 'none';
            if (typeof modal.remove === 'function') modal.remove();
        }

        const calendarRender = window.QA_CORE.Calendar.Render;
        if (calendarRender && typeof calendarRender.renderCalendarAll === 'function') {
            calendarRender.renderCalendarAll();
        } else if (window.QA_CORE.Calendar.Main && typeof window.QA_CORE.Calendar.Main.refresh === 'function') {
            window.QA_CORE.Calendar.Main.refresh();
        } else {
            location.reload();
        }
    },

    /**
     * TC 작성 및 수정용 데이터 전처리 기동 엔진 함수입니다. (유지)
     */
    triggerTcWriteCountFlow() {
        if (this.state.isAsyncLocked) {
            alert("원격 서버와의 연동 연산이 진행 중입니다. 잠시 후 다시 시도해 주십시오.");
            return;
        }
        
        const calState = window.QA_CORE.Calendar.State;
        if (!calState || !calState.currentCalendarDate) {
            alert("달력 상태를 로드할 수 없습니다.");
            return;
        }
        
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

        if (urlEvents.length === 0) {
            alert(`선택하신 ${targetYear}년 ${targetMonth}월 화면에 유효한 일정 카드가 발견되지 않았습니다.`);
            return;
        }

        const targetWorker = prompt(`[📝 ${targetYear}년 ${targetMonth}월 작성/수정 수집] 조회할 담당자 명을 입력하세요:`, "박준혁");
        if (!targetWorker || !targetWorker.trim()) return;

        this.executeTcWriteCountPipeline(urlEvents, targetWorker.trim(), targetYear, targetMonth);
    },

    /**
     * 작성 및 수정 건수를 원격 백엔드와 세션 동기화하여 취합하는 정류 네트워크 함수입니다. (유지)
     */
    executeTcWriteCountPipeline(urlEvents, workerName, year, month) {
        this.setAsyncLock(true);
        this.showProgressOverlay(true, "원격 구글 서버 연결 중...", 0, urlEvents.length);

        let processedIndex = 0;
        let totalCountedWriteTc = 0;
        let failedSheets = [];
        let backendMessageSummary = "";

        const parseNextSheet = () => {
            if (processedIndex >= urlEvents.length) {
                this.showProgressOverlay(false);
                this.setAsyncLock(false);

                localStorage.setItem('QA_SYSTEM_KPI_WRITE_COUNT', totalCountedWriteTc);
                localStorage.setItem('QA_SYSTEM_KPI_WRITE_DATE', `${year}-${month}`);

                document.dispatchEvent(new CustomEvent('QA_KPI_WRITE_DATA_SYNC', {
                    detail: { count: totalCountedWriteTc, year: year, month: month }
                }));

                let finalMsg = `[📝 TC 작성 및 수정 개수 확인 완료]\n\n`;
                finalMsg += `📅 대상 월: ${year}년 ${month}월\n`;
                finalMsg += `👤 대상 담당자: ${workerName}\n`;
                finalMsg += `✅ 성공 시트 수: ${urlEvents.length - failedSheets.length}개\n`;
                if (failedSheets.length > 0) {
                    finalMsg += `❌ 실패 시트: (${failedSheets.join(', ')})\n`;
                }
                finalMsg += `\n🎯 당월 취합된 총 TC 작성/수정 행(개수): ${totalCountedWriteTc}개\n`;
                if (backendMessageSummary) finalMsg += `📢 백엔드 리포트: ${backendMessageSummary}`;

                alert(finalMsg);
                return;
            }

            const currentEvent = urlEvents[processedIndex];
            processedIndex++;
            this.showProgressOverlay(true, currentEvent.title, processedIndex, urlEvents.length);

            const rawUrl = currentEvent.url.trim();
            let sheetId = "";

            if (rawUrl.indexOf('/d/') !== -1) {
                sheetId = rawUrl.split('/d/')[1].split('/')[0];
            } else {
                sheetId = rawUrl; 
            }
            
            if (!sheetId) {
                failedSheets.push(currentEvent.title);
                parseNextSheet();
                return;
            }

            const requestUrl = `${this.state.gasProxyUrl}?sheetId=${sheetId}&workerName=${encodeURIComponent(workerName)}&year=${year}&month=${month}&mode=write`;

            fetch(requestUrl)
                .then(response => { if (!response.ok) throw new Error(); return response.json(); })
                .then(data => {
                    if (data && data.success === true) {
                        totalCountedWriteTc += parseInt(data.count, 10) || 0;
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

    // [핵심 삭제 부분] 구형 TC 수행 로직(triggerTcCountFlow, executeTcCountPipeline)을 완벽히 제거했습니다.

    syncWithKpiManager(count, year, month) {
        localStorage.setItem('QA_SYSTEM_KPI_TC_COUNT', count);
        localStorage.setItem('QA_SYSTEM_KPI_TC_DATE', `${year}-${month}`);

        document.dispatchEvent(new CustomEvent('QA_KPI_TC_DATA_SYNC', {
            detail: { count: count, year: year, month: month }
        }));

        const selectors = [
            '#kpi-preview-tc-work',
            '#kpi-tc-execution-field',
            '.kpi-report-preview [data-type="tc"]',
            '#kpi-work-performance-preview'
        ];
        
        let targetField = null;
        for (const selector of selectors) {
            targetField = document.querySelector(selector);
            if (targetField) break;
        }

        if (targetField) {
            const syncMessage = `[TC 수행 업무] 당월 취합 총 TC 수행 개수: ${count}개`;
            
            if (typeof targetField.value !== 'undefined') {
                if (targetField.value.indexOf('[TC 수행 업무]') !== -1) {
                    const regex = /\[TC 수행 업무\][^\n]*/g;
                    targetField.value = targetField.value.replace(regex, syncMessage);
                } else {
                    targetField.value = targetField.value ? `${targetField.value}\n${syncMessage}` : syncMessage;
                }
            } else {
                if (targetField.innerText.indexOf('[TC 수행 업무]') !== -1) {
                    const regex = /\[TC 수행 업무\][^\n]*/g;
                    targetField.innerText = targetField.innerText.replace(regex, syncMessage);
                } else {
                    targetField.innerText = targetField.innerText ? `${targetField.innerText}\n${syncMessage}` : syncMessage;
                }
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
        if (lock) { saveBtn.disabled = true; saveBtn.innerText = "처리 중..."; }
        else { saveBtn.disabled = false; saveBtn.innerText = "저장하기"; }
    },

    clearForm() {
        if (window.QA_CORE.Calendar.State) window.QA_CORE.Calendar.State.editingEventId = null;
        const fields = ['cal-start-date', 'cal-end-date', 'cal-title', 'cal-url'];
        fields.forEach(id => { const el = document.getElementById(id); if (el) el.value = ''; });
    }
};

if (window.QA_CORE.SkillManager && typeof window.QA_CORE.SkillManager.register === 'function') {
    window.QA_CORE.SkillManager.register('CalendarScheduleModule', window.QA_CORE.Calendar.Schedule);
}
