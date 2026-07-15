window.QA_CORE = window.QA_CORE || {};
window.QA_CORE.Calendar = window.QA_CORE.Calendar || {};

window.QA_CORE.Calendar.Schedule = {
    state: {
        isAsyncLocked: false,
        // 현재 브라우저 직접 검증이 끝난 구글 라이브 웹 앱 URL 주소 고정 바인딩
        gasProxyUrl: 'https://script.google.com/macros/s/AKfycbzhBlue7Ji5mo5WBXN9NJAOsRel2ePtz1UXMpUA0AaS5OGuA9TfsbsOTXrTIfyAyrl8/exec'
    },

    init() {
        const globalConfig = window.QA_CORE.firebaseConfig;
        if (globalConfig && globalConfig.apiKey !== "****" && typeof firebase !== 'undefined' && !firebase.apps.length) {
            firebase.initializeApp(globalConfig);
        }
        this.db = (typeof firebase !== 'undefined' && firebase.apps.length) ? firebase.database() : null;
        this.injectControlPanels();
        
        // 동적 UI 리스트와 상세 모달 전체를 커버하는 글로벌 삭제 이벤트 리스너 마운트
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

                // 중복 누적 및 정렬 왜곡 방지를 위해 기존 허브 단추 컴포넌트 선행 소거 가드 작동
                const oldTcBtn = document.getElementById('btn-tc-count-hub');
                const oldWriteBtn = document.getElementById('btn-tc-write-count-hub');
                if (oldTcBtn) oldTcBtn.remove();
                if (oldWriteBtn) oldWriteBtn.remove();

                // 1. 좌측 배치용 'TC 작성 및 수정 개수 확인' 버튼 노드 빌드
                const writeTcBtn = document.createElement('button');
                writeTcBtn.id = 'btn-tc-write-count-hub';
                writeTcBtn.className = 'btn-cal-nav';
                writeTcBtn.style.cssText = 'background: #2b6cb0; color: #fff; margin: 5px; border: none; font-weight: bold; cursor: pointer; padding: 8px 14px; border-radius: 4px; box-shadow: 0 2px 4px rgba(0,0,0,0.1);';
                writeTcBtn.innerText = '📝 TC 작성 및 수정 개수 확인';
                
                // [무결성 보정] 모호한 참조 컨텍스트를 방지하기 위해 전역 절대 경로 인젝션으로 정류 바인딩
                writeTcBtn.onclick = () => {
                    window.QA_CORE.Calendar.Schedule.triggerTcWriteCountFlow();
                };

                // 2. 우측 배치용 기존 'TC 수행 개수 확인' 버튼 노드 빌드
                const tcBtn = document.createElement('button');
                tcBtn.id = 'btn-tc-count-hub';
                tcBtn.className = 'btn-cal-nav';
                tcBtn.style.cssText = 'background: #319795; color: #fff; margin: 5px; border: none; font-weight: bold; cursor: pointer; padding: 8px 14px; border-radius: 4px; box-shadow: 0 2px 4px rgba(0,0,0,0.1);';
                tcBtn.innerText = '📊 TC 수행 개수 확인';
                
                tcBtn.onclick = () => {
                    window.QA_CORE.Calendar.Schedule.triggerTcCountFlow();
                };
                
                // DOM 레이아웃 세부 정렬 배치 트래킹 가동
                if (navGroup.parentNode && navGroup.className.includes('group')) {
                    navGroup.parentNode.insertBefore(tcBtn, navGroup);
                    navGroup.parentNode.insertBefore(writeTcBtn, tcBtn);
                } else {
                    navGroup.prepend(tcBtn);
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
     * TC 작성 및 수정용 데이터 전처리 기동 엔진 함수입니다.
     */
    triggerTcWriteCountFlow() {
        // [정정] 침묵을 방지하기 위해 비동기 락 수신 시 브라우저 알림 안내창 배치
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
     * 작성 및 수정 건수를 원격 백엔드와 세션 동기화하여 취합하는 정류 네트워크 함수입니다.
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

    triggerTcCountFlow() {
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

        const targetWorker = prompt(`[📊 ${targetYear}년 ${targetMonth}월 수집] 조회할 담당자 명을 입력하세요:`, "박준혁");
        if (!targetWorker || !targetWorker.trim()) return;

        this.executeTcCountPipeline(urlEvents, targetWorker.trim(), targetYear, targetMonth);
    },

    executeTcCountPipeline(urlEvents, workerName, year, month) {
        this.setAsyncLock(true);
        this.showProgressOverlay(true, "원격 구글 서버 연결 중...", 0, urlEvents.length);

        let processedIndex = 0;
        let totalCountedTc = 0;
        let failedSheets = [];
        let backendMessageSummary = "";

        const parseNextSheet = () => {
            if (processedIndex >= urlEvents.length) {
                this.showProgressOverlay(false);
                this.setAsyncLock(false);

                this.syncWithKpiManager(totalCountedTc, year, month);

                let finalMsg = `[📊 TC 수행 개수 확인 완료]\n\n`;
                finalMsg += `📅 대상 월: ${year}년 ${month}월\n`;
                finalMsg += `👤 대상 담당자: ${workerName}\n`;
                finalMsg += `✅ 성공 시트 수: ${urlEvents.length - failedSheets.length}개\n`;
                if (failedSheets.length > 0) {
                    finalMsg += `❌ 실패 시트: (${failedSheets.join(', ')})\n`;
                }
                finalMsg += `\n🎯 당월 취합된 총 TC 수행 행(개수): ${totalCountedTc}개\n`;
                finalMsg += `📢 백엔드 리포트: ${backendMessageSummary}`;

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

            // 대상 열(targetColumn)을 T열로 명시하여 백엔드로 전송하는 규격 확립
const requestUrl = `${this.state.gasProxyUrl}?sheetId=${sheetId}&workerName=${encodeURIComponent(workerName)}&year=${year}&month=${month}&targetColumn=T`;

            fetch(requestUrl)
                .then(response => { if (!response.ok) throw new Error(); return response.json(); })
                .then(data => {
                    if (data && data.success === true) {
                        totalCountedTc += parseInt(data.count, 10) || 0;
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
