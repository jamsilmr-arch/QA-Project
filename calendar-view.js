export const CALENDAR_TEMPLATE = `
    <div class="calendar-container" style="display: flex; gap: 20px; width: 100%; flex-direction: row; align-items: flex-start;">
        
        <div class="calendar-main-board" style="flex: 2; display: flex; flex-direction: column; gap: 15px; background: #ffffff; padding: 20px; border-radius: 8px; border: 1px solid #e2e8f0;">
            <div class="calendar-upper-bar" style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 5px;">
                <h2 id="calendar-month-year-title" style="font-size: 1.2rem; font-weight: 700; color: #1a202c;">----년 --월</h2>
                
                <div class="calendar-nav-group" style="display: flex; gap: 6px; align-items: center;">
                    <!-- [수정] KPI 연동 버튼 마크업을 완전히 영구 삭제하고 TC 수행 개수 확인만 단독 상주 처리합니다 -->
                    <button class="btn-cal-nav" id="btn-tc-count-hub" style="background: #319795; color: #fff; border: none; font-weight: bold; cursor: pointer; padding: 6px 12px; border-radius: 4px;">📊 TC 수행 개수 확인</button>
                    <button class="btn-cal-nav" id="cal-prev-btn" style="margin-left: 10px;">◀ 이전달</button>
                    <button class="btn-cal-nav" id="cal-today-btn">오늘</button>
                    <button class="btn-cal-nav" id="cal-next-btn">다음달 ▶</button>
                </div>
            </div>
            
            <div class="calendar-week-header" style="display: grid; grid-template-columns: repeat(7, 1fr); text-align: center; font-size: 12px; font-weight: bold; border-bottom: 2px solid #edf2f7; padding-bottom: 8px; color: #718096;">
                <div style="color: #e53e3e;">일</div>
                <div>월</div>
                <div>화</div>
                <div>수</div>
                <div>목</div>
                <div>금</div>
                <div style="color: #3182ce;">토</div>
            </div>

            <div id="calendar-grid-zone" style="display: grid; grid-template-columns: repeat(7, 1fr); gap: 1px; background: #e2e8f0; border: 1px solid #e2e8f0; border-radius: 4px; overflow: hidden;"></div>
        </div>

        <div class="calendar-sidebar-right" style="flex: 1; display: flex; flex-direction: column; gap: 20px; min-width: 300px;">
            <div class="card-panel layout-vertical" style="background: #ffffff; padding: 20px; border-radius: 8px; border: 1px solid #e2e8f0;">
                <h3 style="font-size: 0.95rem; font-weight: bold; margin-bottom: 12px; color: #1a202c;">새 일정 등록</h3>
                <div class="form-group" style="margin-bottom: 10px;">
                    <label for="cal-title" style="font-size: 11px; font-weight: 600; color: #4a5568;">일정명</label>
                    <input type="text" id="cal-title" placeholder="일정 제목 입력" style="width: 100%; padding: 8px; border: 1px solid #cbd5e0; border-radius: 6px; margin-top: 4px; box-sizing: border-box;">
                </div>
                <div class="form-group" style="margin-bottom: 10px;">
                    <label for="cal-start-date" style="font-size: 11px; font-weight: 600; color: #4a5568;">시작일</label>
                    <input type="date" id="cal-start-date" style="width: 100%; padding: 8px; border: 1px solid #cbd5e0; border-radius: 6px; margin-top: 4px; box-sizing: border-box;">
                </div>
                <div class="form-group" style="margin-bottom: 10px;">
                    <label for="cal-end-date" style="font-size: 11px; font-weight: 600; color: #4a5568;">종료일</label>
                    <input type="date" id="cal-end-date" style="width: 100%; padding: 8px; border: 1px solid #cbd5e0; border-radius: 6px; margin-top: 4px; box-sizing: border-box;">
                </div>
                <div class="form-group" style="margin-bottom: 15px;">
                    <label for="cal-url" style="font-size: 11px; font-weight: 600; color: #4a5568;">URL</label>
                    <input type="url" id="cal-url" placeholder="https://example.com" style="width: 100%; padding: 8px; border: 1px solid #cbd5e0; border-radius: 6px; margin-top: 4px; box-sizing: border-box;">
                </div>
                <button class="btn-action" id="save-event-btn" style="background: #3182ce; color: white; width: 100%; padding: 10px; font-weight: bold; border: none; border-radius: 6px; cursor: pointer;">저장하기</button>
            </div>

            <div class="card-panel layout-vertical" style="background: #ffffff; padding: 20px; border-radius: 8px; border: 1px solid #e2e8f0; min-height: 150px;">
                <h3 style="font-size: 0.95rem; font-weight: bold; margin-bottom: 12px; color: #1a202c;">이달의 일정 리스트</h3>
                <div id="sidebar-calendar-list" style="display: flex; flex-direction: column; gap: 2px;"></div>
            </div>
        </div>
    </div>
`;

export function initCalendarPanel() {
    const calendarPanel = document.getElementById('tab-panel-calendar');
    if (calendarPanel && !calendarPanel.innerHTML.trim()) {
        calendarPanel.innerHTML = CALENDAR_TEMPLATE;
    }
}