window.QA_CORE = window.QA_CORE || {};
window.QA_CORE.Template = window.QA_CORE.Template || {};

window.QA_CORE.Template.Manager = {
    memos: [], // 메모 상태를 관리하는 중앙 배열

    init() {
        this.loadData();
        this.renderLayout();
        this.bindGlobalEvents();
    },

    // 💡 스토리지 데이터 로드 및 초기 샘플 양식 주입
    loadData() {
        const data = localStorage.getItem('QA_CORE_MEMO_TEMPLATES');
        if (data) {
            try { 
                this.memos = JSON.parse(data); 
            } catch(e) { 
                this.memos = []; 
            }
        } 
        
        // 데이터가 아예 없을 경우 빈칸 대신 기본 결함 양식을 1개 세팅
        if (this.memos.length === 0) {
            this.memos = [{
                id: Date.now(),
                content: "[Environment]\n■ PoC : \n■ Device(OS Ver.) : \n■ App : \n■ Server : \n\n[Pre-Condition]\n1. \n\n[재현스텝]\n1. \n2. \n3. \n\n[실행결과-문제현상]\n1. \n\n[기대결과]\n1. "
            }];
        }
    },

    saveData() {
        localStorage.setItem('QA_CORE_MEMO_TEMPLATES', JSON.stringify(this.memos));
    },

    // 💡 메인 껍데기(부모 레이아웃) 렌더링
    renderLayout() {
        const panelZone = document.getElementById('tab-panel-template');
        if (!panelZone) return;

        panelZone.innerHTML = `
            <div class="content-panel active" style="padding: 20px; background: #f8fafc; border-radius: 8px; border: 1px solid #e2e8f0; min-height: 600px;">
                <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 20px; border-bottom: 2px solid #cbd5e0; padding-bottom: 12px;">
                    <div>
                        <h2 style="font-size: 1.2rem; font-weight: 700; color: #0f172a; margin: 0 0 4px 0;">📝 다중 양식 메모 보드</h2>
                        <p style="font-size: 12px; color: #64748b; margin: 0;">작성 내용은 실시간으로 브라우저에 자동 저장됩니다.</p>
                    </div>
                    <button id="btn-add-memo" style="background:#0f172a; color:white; border:none; padding:8px 16px; font-size:12px; font-weight:bold; border-radius:6px; cursor:pointer; box-shadow: 0 2px 4px rgba(0,0,0,0.1);">
                        + 칸 추가
                    </button>
                </div>
                
                <!-- CSS Grid: 화면 너비에 따라 최소 320px 너비로 3~4개씩 자동 정렬 -->
                <div id="memo-grid-container" style="display: grid; grid-template-columns: repeat(auto-fill, minmax(320px, 1fr)); gap: 16px;">
                    <!-- 내부 카드는 renderMemos()에 의해 동적 삽입됨 -->
                </div>
            </div>
        `;
        this.renderMemos();
    },

    // 💡 메모 카드 배열 렌더링
    renderMemos() {
        const container = document.getElementById('memo-grid-container');
        if (!container) return;
        
        container.innerHTML = '';
        
        this.memos.forEach(memo => {
            const card = document.createElement('div');
            card.style.cssText = "background: #ffffff; border: 1px solid #cbd5e0; border-radius: 6px; padding: 12px; display: flex; flex-direction: column; box-shadow: 0 2px 6px rgba(0,0,0,0.03);";
            
            card.innerHTML = `
                <div style="display: flex; justify-content: flex-end; gap: 6px; margin-bottom: 8px;">
                    <button class="btn-copy-memo" data-id="${memo.id}" style="background: #e0f2fe; color: #0284c7; border: none; padding: 4px 12px; font-size: 11px; border-radius: 4px; cursor: pointer; font-weight: bold;">복사</button>
                    <button class="btn-delete-memo" data-id="${memo.id}" style="background: #fee2e2; color: #dc2626; border: none; padding: 4px 12px; font-size: 11px; border-radius: 4px; cursor: pointer; font-weight: bold;">삭제</button>
                </div>
                <textarea class="memo-textarea" data-id="${memo.id}" style="width: 100%; height: 350px; resize: vertical; border: 1px solid #e2e8f0; border-radius: 4px; padding: 10px; font-family: 'Malgun Gothic', sans-serif; font-size: 12px; line-height: 1.5; color: #334155; outline: none; box-sizing: border-box; background: #f8fafc;" placeholder="여기에 양식을 입력하세요...">${memo.content}</textarea>
            `;
            container.appendChild(card);
        });
        
        this.bindDynamicEvents();
    },

    // 💡 정적 엘리먼트 (추가 버튼) 이벤트 바인딩
    bindGlobalEvents() {
        const panelZone = document.getElementById('tab-panel-template');
        if (!panelZone) return;
        
        panelZone.addEventListener('click', (e) => {
            if (e.target.id === 'btn-add-memo') {
                this.memos.push({ id: Date.now(), content: "" });
                this.saveData();
                this.renderMemos();
            }
        });
    },

    // 💡 동적 엘리먼트 (입력, 복사, 삭제) 이벤트 바인딩
    bindDynamicEvents() {
        const container = document.getElementById('memo-grid-container');
        if (!container) return;

        // 1. 실시간 오토 세이브 (타건 시 즉시 스토리지 덮어쓰기)
        const textareas = container.querySelectorAll('.memo-textarea');
        textareas.forEach(ta => {
            ta.addEventListener('input', (e) => {
                const id = parseInt(e.target.getAttribute('data-id'));
                const memo = this.memos.find(m => m.id === id);
                if (memo) {
                    memo.content = e.target.value;
                    this.saveData();
                }
            });
        });

        // 2. 클립보드 복사
        const copyBtns = container.querySelectorAll('.btn-copy-memo');
        copyBtns.forEach(btn => {
            btn.addEventListener('click', (e) => {
                const id = parseInt(e.target.getAttribute('data-id'));
                const memo = this.memos.find(m => m.id === id);
                if (memo && memo.content) {
                    navigator.clipboard.writeText(memo.content).then(() => {
                        if (window.QA_CORE.UI && typeof window.QA_CORE.UI.showToast === 'function') {
                            window.QA_CORE.UI.showToast("✅ 클립보드에 복사되었습니다.");
                        }
                    }).catch(() => alert("복사에 실패했습니다."));
                }
            });
        });

        // 3. 개별 메모 삭제
        const delBtns = container.querySelectorAll('.btn-delete-memo');
        delBtns.forEach(btn => {
            btn.addEventListener('click', (e) => {
                if(confirm("해당 양식을 완전히 삭제하시겠습니까? (복구 불가)")) {
                    const id = parseInt(e.target.getAttribute('data-id'));
                    this.memos = this.memos.filter(m => m.id !== id);
                    this.saveData();
                    this.renderMemos();
                }
            });
        });
    }
};

export function initTemplatePanel() {
    window.QA_CORE.Template.Manager.init();
}
